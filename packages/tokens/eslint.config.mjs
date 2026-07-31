import base from '@santo/config/eslint';

/**
 * Este pacote não publica código de runtime: publica JSON, CSS e um `.d.ts`
 * gerados por scripts de linha de comando. Para um script de CLI, a saída em
 * stdout É o produto — `no-console` existe para pegar `console.log` esquecido em
 * biblioteca, e aqui não há biblioteca em que esquecer.
 *
 * A regra continua valendo para o resto do monorepo, onde ela faz sentido.
 */
export default [
  ...base,
  {
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
];
