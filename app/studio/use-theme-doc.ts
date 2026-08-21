"use client";

import { useCallback, useMemo, useState } from "react";
import { applyBrand, diffToOverrides } from "@/lib/tokens/brand";
import type {
  Brand,
  EffectStyleDef,
  RawValue,
  TextStyleDef,
  TokenDoc,
  VariableDef,
} from "@/lib/tokens/types";

const MAX_HISTORY = 100;

/**
 * Documento em edicao mais o historico. Fica tudo em estado (nao em ref) para
 * que `canUndo`/`canRedo` sejam derivados do render, e nao de um valor mutavel.
 */
type History = { doc: TokenDoc; past: TokenDoc[]; future: TokenDoc[] };

/** Copia rasa por nivel — evita mutar o doc base ao editar um token. */
function withVariable(doc: TokenDoc, collection: string, name: string, def: VariableDef): TokenDoc {
  return {
    ...doc,
    collections: {
      ...doc.collections,
      [collection]: {
        ...doc.collections[collection],
        variables: { ...doc.collections[collection].variables, [name]: def },
      },
    },
  };
}

function push(history: History, next: TokenDoc): History {
  if (next === history.doc) return history;
  return { doc: next, past: [...history.past.slice(-MAX_HISTORY), history.doc], future: [] };
}

export type ThemeDocStore = ReturnType<typeof useThemeDoc>;

export function useThemeDoc(base: TokenDoc, initialBrand: Brand) {
  const [history, setHistory] = useState<History>(() => ({
    doc: applyBrand(base, initialBrand),
    past: [],
    future: [],
  }));
  const [brandMeta, setBrandMeta] = useState({
    id: initialBrand.id,
    name: initialBrand.name,
    description: initialBrand.description ?? "",
  });

  const { doc } = history;

  /** Aplica uma transformacao no doc e registra no historico. */
  const edit = useCallback((transform: (current: TokenDoc) => TokenDoc) => {
    setHistory((h) => push(h, transform(h.doc)));
  }, []);

  const setDoc = useCallback((next: TokenDoc) => setHistory((h) => push(h, next)), []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const previous = h.past[h.past.length - 1];
      return { doc: previous, past: h.past.slice(0, -1), future: [h.doc, ...h.future] };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const [next, ...rest] = h.future;
      return { doc: next, past: [...h.past, h.doc], future: rest };
    });
  }, []);

  /** Troca o valor de um token num modo especifico. */
  const setVariableValue = useCallback(
    (collection: string, name: string, mode: string, value: RawValue) => {
      edit((current) => {
        const c = current.collections[collection];
        const def = c.variables[name];
        const values = def.values ?? { [c.defaultMode]: def.value as RawValue };
        const nextDef: VariableDef =
          c.modes.length === 1
            ? { type: def.type, value, scopes: def.scopes, description: def.description }
            : {
                type: def.type,
                values: { ...values, [mode]: value },
                scopes: def.scopes,
                description: def.description,
              };
        // Sem chaves undefined, para o diff nao enxergar ruido.
        if (nextDef.scopes === undefined) delete nextDef.scopes;
        if (nextDef.description === undefined) delete nextDef.description;
        return withVariable(current, collection, name, nextDef);
      });
    },
    [edit],
  );

  /**
   * Troca varios tokens de uma vez.
   *
   * Uma rampa inteira e uma decisao so — precisa ser um passo so do desfazer,
   * senao voltar atras exigiria onze cliques.
   */
  const setVariableValues = useCallback(
    (changes: { collection: string; name: string; mode: string; value: RawValue }[]) => {
      edit((current) =>
        changes.reduce((acc, change) => {
          const c = acc.collections[change.collection];
          const def = c.variables[change.name];
          if (!def) return acc;
          const values = def.values ?? { [c.defaultMode]: def.value as RawValue };
          const nextDef: VariableDef =
            c.modes.length === 1
              ? { type: def.type, value: change.value, scopes: def.scopes, description: def.description }
              : {
                  type: def.type,
                  values: { ...values, [change.mode]: change.value },
                  scopes: def.scopes,
                  description: def.description,
                };
          if (nextDef.scopes === undefined) delete nextDef.scopes;
          if (nextDef.description === undefined) delete nextDef.description;
          return withVariable(acc, change.collection, change.name, nextDef);
        }, current),
      );
    },
    [edit],
  );

  const setTextStyle = useCallback(
    (name: string, patch: Partial<TextStyleDef>) => {
      edit((current) => ({
        ...current,
        textStyles: { ...current.textStyles, [name]: { ...current.textStyles[name], ...patch } },
      }));
    },
    [edit],
  );

  /**
   * Troca vários text styles de uma vez.
   *
   * Atualiza o vínculo (que é o que vira CSS) e o valor literal (que é o que o
   * snapshot guarda) juntos — deixar os dois divergirem faria o diff mentir.
   */
  const setTextStyles = useCallback(
    (patches: { name: string; fontSize: number; lineHeight: number }[]) => {
      edit((current) => {
        const textStyles = { ...current.textStyles };
        for (const patch of patches) {
          const style = textStyles[patch.name];
          if (!style) continue;
          textStyles[patch.name] = {
            ...style,
            fontSize: patch.fontSize,
            lineHeight: { unit: "PIXELS", value: patch.lineHeight },
            boundVariables: {
              ...style.boundVariables,
              fontSize: `type/size/${patch.fontSize}`,
              lineHeight: `type/leading/${patch.lineHeight}`,
            },
          };
        }
        return { ...current, textStyles };
      });
    },
    [edit],
  );

  const setEffectStyle = useCallback(
    (name: string, def: EffectStyleDef) => {
      edit((current) => ({ ...current, effectStyles: { ...current.effectStyles, [name]: def } }));
    },
    [edit],
  );

  /** Volta um token unico ao valor da base do Figma. */
  const resetToken = useCallback(
    (collection: string, name: string) => {
      edit((current) => {
        const baseDef = base.collections[collection]?.variables?.[name];
        return baseDef ? withVariable(current, collection, name, baseDef) : current;
      });
    },
    [base, edit],
  );

  const resetAll = useCallback(() => {
    edit(() => applyBrand(base, { id: "", name: "", overrides: { variables: {}, textStyles: {}, effectStyles: {} } }));
  }, [base, edit]);

  const loadBrand = useCallback(
    (brand: Brand) => {
      setBrandMeta({ id: brand.id, name: brand.name, description: brand.description ?? "" });
      setDoc(applyBrand(base, brand));
    },
    [base, setDoc],
  );

  const overrides = useMemo(() => diffToOverrides(base, doc), [base, doc]);

  const brand: Brand = useMemo(
    () => ({ id: brandMeta.id, name: brandMeta.name, description: brandMeta.description, overrides }),
    [brandMeta, overrides],
  );

  return {
    doc,
    setDoc,
    brand,
    brandMeta,
    setBrandMeta,
    overrides,
    setVariableValue,
    setVariableValues,
    setTextStyle,
    setTextStyles,
    setEffectStyle,
    resetToken,
    resetAll,
    loadBrand,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
