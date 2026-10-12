# Changelog

## 0.0.3

Corrige o campo `exports` do pacote.

- `require('bth-ui/loader')` e `require('bth-ui')` apontavam para arquivos que não existem no pacote. Agora resolvem para `loader/index.cjs.js` e `dist/index.cjs.js`.
- Os componentes do build de custom elements passam a ser importáveis, um a um, como `bth-ui/components/bth-button` (cada import registra a própria tag). O índice fica em `bth-ui/components`. Esse build é só ESM.
- `bth-ui/docs.json` e `bth-ui/tokens.json` passam a funcionar também com `require`.
- Os tipos são declarados em `exports`, e `bth-ui/package.json` passa a ser exportado.

## 0.0.2

Primeira versão que publica a documentação dentro do pacote, para ser lida por ferramentas como o `bth-ui-mcp`.

- O pacote passa a incluir `docs/docs.json` (componentes, gerado pelo Stencil) e `docs/tokens.json` (design tokens, gerado por `scripts/build-tokens.mjs` a partir de `src/tokens`).
- Os dois arquivos também ficam disponíveis como `bth-ui/docs.json` e `bth-ui/tokens.json`.
- O CI valida a documentação dos componentes (`npm run check:docs`) e a presença dos dois arquivos no pacote.

Os caminhos e o formato desses arquivos são um contrato com o `bth-ui-mcp`: qualquer mudança neles precisa ser registrada aqui.

## 0.0.1

- Versão inicial, com `bth-alert`, `bth-alert-title`, `bth-alert-description`, `bth-badge`, `bth-button` e `bth-icon`.
