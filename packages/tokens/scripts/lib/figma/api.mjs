/**
 * Cliente da API REST do Figma.
 *
 * ─── O aviso que precisa vir antes de tudo ──────────────────────────────────
 *
 * A API de Variables do Figma (ler E escrever) é exclusiva de planos
 * Enterprise. Não é uma questão de escopo do token: numa organização em plano
 * inferior o endpoint responde 403 mesmo com um PAT perfeitamente válido. Como
 * esse 403 é indistinguível, no corpo, de "faltou escopo", este módulo traduz
 * os erros para uma explicação com as duas hipóteses — sem isso, a mensagem
 * padrão manda a pessoa regenerar um token que nunca foi o problema.
 *
 * Quem não tem Enterprise sincroniza pelo plugin, consumindo os mesmos arquivos
 * de `dist/figma/`. É por isso que o build emite esses JSON mesmo quando
 * ninguém vai chamar a API: eles são o formato de troca, não um detalhe do push.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { TokensError, bold, requireEnv } from '../cli.mjs';
import { PACKAGE_ROOT } from '../sources.mjs';

const API = 'https://api.figma.com';

/** A raiz do repositório, onde moram os arquivos de ambiente. */
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');

/**
 * Arquivos de ambiente, na ordem em que são lidos.
 *
 * `.env.local` vem depois porque é o arquivo pessoal — a convenção difundida é
 * que ele sobrescreve o `.env` compartilhado da máquina. Os dois são ignorados
 * pelo git (`.env` e `.env.*`, com exceção do `.env.example`), então qualquer
 * um dos dois é lugar seguro para o token; ler os dois evita o suporte
 * "coloquei o token e continua dizendo que não tem token", que é o sintoma de
 * ter escolhido o arquivo errado entre dois igualmente plausíveis.
 */
const ENV_FILES = ['.env', '.env.local'];

/**
 * Carrega os arquivos de ambiente da raiz para dentro de `process.env`.
 *
 * O Node só passou a ter `--env-file` embutido no 20.6 e `process.loadEnvFile()`
 * no 20.12, e este pacote declara suporte a partir do 20.11. Em vez de exigir
 * uma flag na linha de comando de cada script (que alguém vai esquecer, e o
 * sintoma seria "token não definido" com o token definido), os arquivos são
 * lidos aqui. Valor já presente no ambiente sempre vence: em CI quem manda é o
 * secret, não um arquivo que por acaso tenha sobrado no disco.
 */
async function loadEnvFiles() {
  /** Preenchido por arquivo anterior, e não pelo ambiente real. */
  const fromFile = new Set();

  for (const file of ENV_FILES) {
    let contents;
    try {
      contents = await readFile(path.join(REPO_ROOT, file), 'utf8');
    } catch {
      continue; // Ausência é normal: em CI as variáveis vêm do ambiente.
    }

    for (const line of contents.split('\n')) {
      const match = /^\s*(?:export\s+)?([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i.exec(line);
      if (!match) continue;

      const [, name, rawValue] = match;
      // Definido no ambiente de verdade: intocável. Definido por um arquivo
      // anterior: o arquivo mais específico pode sobrepor.
      if (process.env[name] !== undefined && !fromFile.has(name)) continue;

      const value = rawValue.trim().replace(/\s+#.*$/, '');
      if (!value) continue; // Chave vazia não apaga o que já foi carregado.

      process.env[name] = /^(['"])(.*)\1$/.test(value) ? value.slice(1, -1) : value;
      fromFile.add(name);
    }
  }
}

/**
 * @typedef {object} FigmaClient
 * @property {string} fileKey
 * @property {(endpoint: string) => Promise<any>} get
 * @property {(endpoint: string, body: unknown) => Promise<any>} post
 */

/**
 * Monta o cliente, já com as credenciais validadas.
 * @returns {Promise<FigmaClient>}
 */
export async function figmaClient() {
  await loadEnvFiles();

  const token = requireEnv(
    'FIGMA_ACCESS_TOKEN',
    'Personal Access Token do Figma, com escopo de Variables (leitura, e escrita para o push).',
  );
  const fileKey = requireEnv(
    'FIGMA_FILE_KEY',
    'Chave do arquivo da biblioteca no Figma — o trecho de figma.com/design/<CHAVE>/<nome>.',
  );

  /**
   * @param {string} method
   * @param {string} endpoint
   * @param {unknown} [body]
   */
  async function request(method, endpoint, body) {
    const url = `${API}${endpoint.replace('{file}', fileKey)}`;

    let response;
    try {
      response = await fetch(url, {
        method,
        headers: {
          'X-Figma-Token': token,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (cause) {
      throw new TokensError(
        `Não foi possível falar com a API do Figma (${method} ${endpoint}).\n` +
          `  ${cause instanceof Error ? cause.message : String(cause)}`,
      );
    }

    const text = await response.text();
    /** @type {any} */
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) throw explain(response.status, payload, method, endpoint);
    return payload;
  }

  return {
    fileKey,
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, body) => request('POST', endpoint, body),
  };
}

/**
 * Traduz o erro HTTP no que ele costuma significar aqui.
 *
 * @param {number} status
 * @param {any} payload
 * @param {string} method
 * @param {string} endpoint
 */
function explain(status, payload, method, endpoint) {
  const detail = payload?.message ?? payload?.err ?? '(sem detalhe no corpo da resposta)';
  const where = `${method} ${endpoint}`;

  // "Invalid token" chega como 403, não como 401 — o que faria a heurística de
  // escopo/plano abaixo culpar o plano por uma credencial revogada. Esta
  // checagem vem antes de tudo justamente por isso: token morto não é assunto
  // de escopo nem de plano.
  if (/invalid token/i.test(String(detail))) {
    return new TokensError(
      `O Figma respondeu ${status} em ${where}: ${bold('token inválido ou revogado')}.\n\n` +
        `  O token enviado não é aceito — foi revogado, expirou, ou foi copiado\n` +
        `  incompleto. Note que gerar um token novo no Figma NÃO invalida os\n` +
        `  anteriores: se você acabou de criar um, confira se colou o novo mesmo,\n` +
        `  e não o antigo que ainda estava na área de transferência.\n\n` +
        `  Gere outro em Figma → avatar → Settings → Security → Personal access tokens.`,
    );
  }

  if (status === 403) {
    // O Figma nomeia o escopo que falta quando o problema é escopo. Quando é
    // plano, a resposta não menciona escopo nenhum. Distinguir os dois casos
    // aqui é o que evita mandar alguém brigar com o financeiro por causa de um
    // checkbox esquecido na tela de criação do token — e vice-versa.
    const missingScope = /requires the (\S+) scope/.exec(String(detail))?.[1];

    if (missingScope) {
      return new TokensError(
        `O Figma recusou ${where} com 403: falta escopo no token.\n\n` +
          `  Escopo exigido: ${bold(missingScope)}\n\n` +
          `  Escopo se escolhe na CRIAÇÃO do token e não dá para editar depois — é\n` +
          `  preciso gerar outro em Figma → avatar → Settings → Security →\n` +
          `  "Personal access tokens" → Generate new token, marcando:\n\n` +
          `    · ${bold('Variables')} → Read     para ${bold('figma:check')} e ${bold('figma:pull')}\n` +
          `    · ${bold('Variables')} → Write    para ${bold('figma:push')}\n\n` +
          `  Atenção: com o escopo correto o endpoint ainda pode responder 403 por\n` +
          `  PLANO — a API de Variables é exclusiva de organizações Enterprise. Se\n` +
          `  isso acontecer, a resposta virá sem menção a escopo, e o caminho passa\n` +
          `  a ser o plugin, com os arquivos de dist/figma/ (ver docs/figma-parity.md).`,
      );
    }

    return new TokensError(
      `O Figma recusou ${where} com 403, sem apontar escopo faltando.\n\n` +
        `  Resposta: ${detail}\n\n` +
        `  Como o token não foi acusado de escopo insuficiente, a causa provável é o\n` +
        `  ${bold('plano')}: a API de Variables é exclusiva de organizações Enterprise e\n` +
        `  responde 403 em qualquer plano abaixo, mesmo com token perfeitamente válido.\n\n` +
        `  Alternativa: sincronizar pelo plugin, usando os arquivos de dist/figma/\n` +
        `  (ver docs/figma-parity.md).`,
    );
  }

  if (status === 404) {
    return new TokensError(
      `O Figma respondeu 404 em ${where}.\n\n` +
        `  Resposta: ${detail}\n\n` +
        `  Confira FIGMA_FILE_KEY. A chave é o trecho entre /design/ e o nome do arquivo\n` +
        `  na URL: figma.com/design/${bold('<CHAVE>')}/Santo-DS — e o token precisa ter acesso\n` +
        `  a esse arquivo.`,
    );
  }

  if (status === 401) {
    return new TokensError(
      `O Figma respondeu 401 em ${where}: token inválido ou revogado.\n\n` +
        `  Resposta: ${detail}\n\n` +
        `  Gere outro em Figma → avatar → Settings → Security → Personal access tokens.`,
    );
  }

  if (status === 429) {
    return new TokensError(
      `O Figma respondeu 429 em ${where}: limite de requisições atingido.\n` +
        `  Espere alguns minutos e rode de novo.`,
    );
  }

  return new TokensError(`O Figma respondeu ${status} em ${where}.\n\n  Resposta: ${detail}`);
}

/** Endpoint de leitura das variáveis locais do arquivo. */
export const LOCAL_VARIABLES = '/v1/files/{file}/variables/local';

/** Endpoint de escrita em lote. */
export const WRITE_VARIABLES = '/v1/files/{file}/variables';
