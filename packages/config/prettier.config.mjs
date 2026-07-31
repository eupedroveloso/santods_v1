/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      // Tokens são lidos por humanos e por máquinas — largura maior evita quebras ruins
      files: ['**/tokens/src/**/*.json', '**/*.tokens.json'],
      options: { printWidth: 120 },
    },
  ],
};
