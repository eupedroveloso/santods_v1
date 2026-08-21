/**
 * Valores sentinela para quando um token não resolve.
 *
 * Acontece em dois casos: alias apontando para variável que não existe mais
 * (token removido no Figma) e marca sobrescrevendo um token que sumiu. Nos dois,
 * a interface precisa continuar renderizando para a pessoa **ver** o problema em
 * vez de olhar uma tela branca.
 *
 * Não são decisões de design — são marcadores de defeito. Por isso vivem aqui,
 * isolados, em vez de espalhados como hex solto pelo código de interface.
 */

/** Preto puro: se aparecer numa amostra, o token acima dele está quebrado. */
export const MISSING_COLOR = "#000000";

export const MISSING_NUMBER = 0;
export const MISSING_STRING = "";
