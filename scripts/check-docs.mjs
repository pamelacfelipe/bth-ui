// Checks the documentation that ships in the package (docs/docs.json and
// docs/tokens.json), which is what bth-ui-mcp reads. Run it after the build.
//
// Every component needs a summary, @category, @status, at least one
// @usage-when and one @example, and every @related must be an existing tag.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function readJson(file) {
  const path = join(root, file);
  if (!existsSync(path)) {
    errors.push(`${file}: file not found, run "npm run build" first`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    return null;
  }
}

const docs = readJson('docs/docs.json');
const tokens = readJson('docs/tokens.json');

if (docs) {
  const components = docs.components ?? [];
  const tags = new Set(components.map(component => component.tag));

  if (components.length === 0) {
    errors.push('docs/docs.json: no components found');
  }

  for (const component of components) {
    const fail = message => errors.push(`${component.tag}: ${message}`);
    const tagTexts = name =>
      (component.docsTags ?? []).filter(tag => tag.name === name).map(tag => (tag.text ?? '').trim());

    if (!component.docs?.trim()) {
      fail('missing summary (JSDoc description)');
    }

    for (const required of ['category', 'status', 'usage-when', 'example']) {
      const texts = tagTexts(required);
      if (texts.length === 0) {
        fail(`missing @${required}`);
      } else if (texts.some(text => !text)) {
        fail(`empty @${required}`);
      }
    }

    for (const name of ['category', 'status']) {
      if (tagTexts(name).length > 1) {
        fail(`more than one @${name}`);
      }
    }

    const related = tagTexts('related')
      .flatMap(text => text.split(','))
      .map(tag => tag.trim())
      .filter(Boolean);

    for (const tag of related) {
      if (tag === component.tag) {
        fail('@related points to the component itself');
      } else if (!tags.has(tag)) {
        fail(`@related points to "${tag}", which is not a component`);
      }
    }
  }
}

if (tokens) {
  if (!Array.isArray(tokens.tokens) || tokens.tokens.length === 0) {
    errors.push('docs/tokens.json: no tokens found');
  } else if (tokens.tokens.some(token => !token.name || !token.value || !token.file)) {
    errors.push('docs/tokens.json: every token needs name, value and file');
  }
}

if (errors.length > 0) {
  console.error(`Documentation check failed:\n${errors.map(error => `  - ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`Documentation check passed: ${docs.components.length} components, ${tokens.tokens.length} tokens`);
