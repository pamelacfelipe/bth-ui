// Generates docs/tokens.json from the SASS variables in src/tokens.
//
// The variables are resolved by the SASS compiler, so interpolations, math and
// references between variables come out as final values. Maps are flattened
// into one token per leaf (`$colors.primary.base`).
//
// The path and the shape of docs/tokens.json are a contract with bth-ui-mcp:
// changing either one requires a changelog entry and an update on the MCP.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass-embedded';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokensDir = join(root, 'src/tokens');
const outFile = join(root, 'docs/tokens.json');

/** Writes a color the way it is written in the token files: hex, with alpha only when translucent. */
function toHex(color) {
  const rgb = color.toSpace('rgb');
  const hex = n => Math.round(n).toString(16).padStart(2, '0');
  const channels = ['red', 'green', 'blue'].map(channel => hex(rgb.channel(channel))).join('');
  return `#${channels}${rgb.alpha < 1 ? hex(rgb.alpha * 255) : ''}`;
}

function toText(value) {
  if (value instanceof sass.SassString) return value.text;
  if (value instanceof sass.SassColor) return toHex(value);
  return value.toString();
}

/** Turns a SASS value into `[name, value]` pairs, walking into maps. */
function flatten(name, value) {
  const map = value.tryMap();
  // An empty list is also an empty map, and it has nothing to flatten
  if (!map || map.contents.size === 0) {
    return [[name, toText(value)]];
  }
  return [...map.contents.entries()].flatMap(([key, child]) => flatten(`${name}.${toText(key)}`, child));
}

/** Reads every variable a token file exposes, already resolved. */
function readVariables(file) {
  let variables = [];

  sass.compileString(
    `@use 'sass:meta';
     @use '${basename(file, '.scss').replace(/^_/, '')}' as tokens;
     $_: collect(meta.module-variables('tokens'));`,
    {
      loadPaths: [tokensDir],
      functions: {
        'collect($variables)': ([map]) => {
          variables = [...map.assertMap('variables').contents.entries()];
          return sass.sassNull;
        },
      },
    },
  );

  return variables;
}

// index.scss only forwards the partials, so reading it would lose the source file
const files = readdirSync(tokensDir)
  .filter(file => file.startsWith('_') && file.endsWith('.scss'))
  .sort();

const tokens = files.flatMap(file => {
  const path = join(tokensDir, file);
  const source = relative(root, path).split('\\').join('/');

  return readVariables(path).flatMap(([name, value]) =>
    flatten(`$${toText(name)}`, value).map(([tokenName, tokenValue]) => {
      // Tokens declared as `var(--bth-x, fallback)` can be overridden by that custom property
      const cssVariable = /^var\(\s*(--[\w-]+)/.exec(tokenValue)?.[1];
      return { name: tokenName, value: tokenValue, ...(cssVariable && { cssVariable }), file: source };
    }),
  );
});

if (tokens.length === 0) {
  throw new Error(`No SASS variables found in ${relative(root, tokensDir)}`);
}

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({ version, tokens }, null, 2) + '\n');

console.log(`${tokens.length} tokens written to ${relative(root, outFile)}`);
