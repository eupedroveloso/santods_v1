import type { Control, ControlValues } from "./registry.types";

/**
 * Utilitarios das demos: montam o trecho de JSX que o playground mostra a
 * partir dos valores dos controles, omitindo o que esta no padrao.
 */

type PropValue = string | boolean | undefined;

/** `<Button variant="primary" disabled>Salvar</Button>` — omite undefined, false e o padrao. */
export function jsx(
  name: string,
  props: Record<string, PropValue>,
  children?: string,
  defaults: Record<string, PropValue> = {},
) {
  const attrs = Object.entries(props)
    .filter(([k, v]) => v !== undefined && v !== false && v !== "" && defaults[k] !== v)
    // Valor que comeca com "{" e expressao JSX: sai sem aspas.
    .map(([k, v]) => {
      if (v === true) return k;
      const text = String(v);
      if (text.startsWith("{")) return `${k}=${text}`;
      // Aspas no valor quebrariam o atributo: vira expressao com string escapada.
      return text.includes('"') ? `${k}={${JSON.stringify(text)}}` : `${k}="${text}"`;
    });
  const open = [name, ...attrs].join(" ");
  return children ? `<${open}>${children}</${name}>` : `<${open} />`;
}

/** Valores iniciais de uma lista de controles. */
export function initialValues(controls: Control[]): ControlValues {
  return Object.fromEntries(controls.map((c) => [c.prop, c.initial]));
}
