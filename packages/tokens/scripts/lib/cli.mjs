/**
 * Utilidades de linha de comando compartilhadas pelos scripts do pacote.
 *
 * Todo script daqui é executado por gente (num terminal) e por CI (num log sem
 * cor). As duas plateias querem coisas diferentes e nenhuma delas quer um stack
 * trace de 40 linhas quando a causa é "faltou uma variável de ambiente". O que
 * este módulo padroniza é isso: onde escrever, com qual símbolo, e quando um
 * erro merece stack.
 */

import process from 'node:process';

/**
 * A mensagem de um `catch`.
 *
 * Em JavaScript o que chega num `catch` é `unknown` — pode ser um `Error`, uma
 * string, ou `undefined` de uma promise rejeitada sem motivo. Ler `.message`
 * direto produz o célebre `undefined` como texto do erro, que é pior do que não
 * ter mensagem nenhuma, porque parece uma.
 *
 * @param {unknown} error
 * @returns {string}
 */
export function messageOf(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return String(error);
}

/**
 * O stack, quando existe e quando pedido.
 * @param {unknown} error
 * @returns {string}
 */
export const stackOf = (error) =>
  error instanceof Error && error.stack ? error.stack : messageOf(error);

/** Cores ANSI, desligadas quando a saída não é um terminal ou quando NO_COLOR está definido. */
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

/**
 * @param {number} code
 * @param {string} text
 */
const paint = (code, text) => (useColor ? `[${code}m${text}[0m` : text);

/** @param {string} text */
export const dim = (text) => paint(2, text);
/** @param {string} text */
export const bold = (text) => paint(1, text);
/** @param {string} text */
export const green = (text) => paint(32, text);
/** @param {string} text */
export const yellow = (text) => paint(33, text);
/** @param {string} text */
export const red = (text) => paint(31, text);

/**
 * Envelopa o `main` de um script.
 *
 * Erro previsto (um `TokensError`, lançado por nós ao encontrar uma condição que
 * sabemos explicar) sai como uma linha limpa. Qualquer outra coisa é bug e sai
 * com stack, porque aí o stack é justamente o que se quer ver.
 *
 * @param {string} label nome do script, para o cabeçalho da falha
 * @param {() => Promise<unknown>} main
 */
export async function run(label, main) {
  try {
    await main();
  } catch (error) {
    const expected = error instanceof TokensError;
    console.error(`\n${red('✗')} ${bold(label)}\n`);
    console.error(`${expected ? messageOf(error) : stackOf(error)}\n`);
    process.exitCode = 1;
  }
}

/**
 * Erro que o script sabe explicar — sai sem stack.
 * Use para condição de ambiente ou de dados; nunca para bug de programação.
 */
export class TokensError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'TokensError';
  }
}

/**
 * Lê uma variável de ambiente obrigatória.
 *
 * @param {string} name
 * @param {string} why para que ela serve, na mensagem de erro
 * @returns {string}
 */
export function requireEnv(name, why) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new TokensError(
      `A variável de ambiente ${bold(name)} não está definida.\n\n` +
        `  ${why}\n\n` +
        `  Copie .env.example para .env na raiz do repositório e preencha o valor.\n` +
        `  O .env não é versionado.`,
    );
  }
  return value;
}
