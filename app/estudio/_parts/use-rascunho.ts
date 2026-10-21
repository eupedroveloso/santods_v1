"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { estudioApi, EstudioErro } from "@/lib/estudio/client";
import { ESTILO_IDS, type EstiloId } from "@/lib/estudio/estilos";
import { ESCOPO, estudio, montarRascunho, type Registro, type Registros } from "@/lib/estudio/rascunho";
import type { Derivado } from "@/lib/tokens/estudio.mjs";
import type { SaveState } from "@/lib/ui";

type Historia = { passado: Registros[]; presente: Registros; futuro: Registros[]; ultimo?: { estilo: EstiloId; em: number } };

/** Edições seguidas no mesmo estilo dentro desta janela viram um passo só do desfazer (arrasto de slider). */
const JUNTA_MS = 800;
/** Espera depois da última edição de um estilo antes do PUT. */
const SALVA_MS = 700;
const LIMITE = 100;

/**
 * Estado do editor: os registros por estilo (o que o banco guarda), o
 * histórico para desfazer/refazer, a derivação ao vivo (derivar() do Compasso,
 * ~8 ms) e o autosave com debounce por estilo. O servidor rederiva e recusa
 * (422) o que não valida; o cliente já não manda o que sabe que vai falhar.
 */
export function useRascunho(
  sistema: { id: string; nome: string; slug: string },
  inicial: Registros,
  /**
   * Derivação do estado inicial feita no servidor. O cliente a usa até a
   * primeira edição: a conta das rampas não é idêntica bit a bit entre motores
   * JS (Node × WebKit dão #fcf0ed × #fbf0ed), e um hex diferente na hidratação
   * fazia o React refazer a raiz (o <html> perdia data-theme e data-brand).
   */
  derivadoInicial?: Derivado,
) {
  const [h, setH] = useState<Historia>({ passado: [], presente: inicial, futuro: [] });
  const [rede, setRede] = useState<{ save: SaveState; problems: string[] }>({ save: "salvo", problems: [] });

  const derivado = useMemo(
    () =>
      h.presente === inicial && derivadoInicial ? derivadoInicial : estudio.derivar(montarRascunho(sistema, h.presente), { scope: ESCOPO }),
    [sistema, h.presente, inicial, derivadoInicial],
  );
  // O preview não pisca para o vazio quando um valor intermediário não valida.
  const [ultimoBom, setUltimoBom] = useState(derivado.ok ? derivado : null);
  if (derivado.ok && ultimoBom !== derivado) setUltimoBom(derivado);

  const editar = useCallback((estilo: EstiloId, fn: (r: Registro) => Registro) => {
    setRede({ save: "salvando", problems: [] });
    setH((s) => {
      const agora = Date.now();
      const junta = s.ultimo?.estilo === estilo && agora - s.ultimo.em < JUNTA_MS;
      const presente = { ...s.presente, [estilo]: fn(s.presente[estilo]) };
      return {
        passado: junta ? s.passado : [...s.passado, s.presente].slice(-LIMITE),
        presente,
        futuro: [],
        ultimo: { estilo, em: agora },
      };
    });
  }, []);

  const desfazer = useCallback(
    () => (setRede({ save: "salvando", problems: [] }), setH((s) => (s.passado.length ? { passado: s.passado.slice(0, -1), presente: s.passado.at(-1)!, futuro: [s.presente, ...s.futuro] } : s))),
    [],
  );
  const refazer = useCallback(
    () => (setRede({ save: "salvando", problems: [] }), setH((s) => (s.futuro.length ? { passado: [...s.passado, s.presente], presente: s.futuro[0], futuro: s.futuro.slice(1) } : s))),
    [],
  );

  // ⌘Z / ⇧⌘Z (Ctrl fora do Mac), fora de campo de texto: lá o desfazer é do próprio campo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      const alvo = e.target as HTMLElement | null;
      if (alvo?.closest("input, textarea, [contenteditable]")) return;
      e.preventDefault();
      if (e.shiftKey) refazer();
      else desfazer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [desfazer, refazer]);

  // Autosave: compara cada estilo com o último que o servidor aceitou.
  const salvo = useRef<Registros>(inicial);
  const timers = useRef(new Map<EstiloId, ReturnType<typeof setTimeout>>());
  const pendentes = useRef(new Map<EstiloId, Registro>());
  const voando = useRef(0);
  /** Fim de uma ida ao servidor: "salvo" só quando nada mais está na fila nem no ar. */
  const conferir = useCallback(() => {
    if (!voando.current && !pendentes.current.size) setRede({ save: "salvo", problems: [] });
  }, []);
  useEffect(() => {
    // Rascunho que não valida não vai ao servidor; o erro aparece pelo `derivado`.
    if (!derivado.ok) return;
    const sujos = ESTILO_IDS.filter((e) => h.presente[e] !== salvo.current[e]);
    if (!sujos.length) {
      // Desfez até o que já estava salvo: nada a enviar.
      const t = setTimeout(conferir, 0);
      return () => clearTimeout(t);
    }
    for (const e of sujos) {
      clearTimeout(timers.current.get(e));
      const enviar = h.presente[e];
      pendentes.current.set(e, enviar);
      timers.current.set(
        e,
        setTimeout(async () => {
          pendentes.current.delete(e);
          voando.current++;
          try {
            await estudioApi.salvarEstilo(sistema.id, e, enviar);
            salvo.current = { ...salvo.current, [e]: enviar };
            voando.current--;
            conferir();
          } catch (err) {
            voando.current--;
            setRede({ save: "erro", problems: err instanceof EstudioErro ? [err.message, ...err.problems] : [String(err)] });
          }
        }, SALVA_MS),
      );
    }
  }, [h.presente, derivado, sistema.id, conferir]);

  // Saiu do editor com edição pendente: grava já, sem esperar o debounce.
  useEffect(() => {
    const t = timers.current;
    const p = pendentes.current;
    return () => {
      t.forEach(clearTimeout);
      p.forEach((registro, e) => void estudioApi.salvarEstilo(sistema.id, e, registro).catch(() => undefined));
    };
  }, [sistema.id]);

  return {
    registros: h.presente,
    derivado,
    preview: derivado.ok ? derivado : ultimoBom,
    editar,
    desfazer,
    refazer,
    podeDesfazer: h.passado.length > 0,
    podeRefazer: h.futuro.length > 0,
    estado: derivado.ok ? rede : { save: "erro" as const, problems: derivado.problems },
  };
}
