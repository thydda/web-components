import { readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Every component folder has a matching implementation and unit test.
const root = fileURLToPath(new URL('../src/components/', import.meta.url));
const components = (await readdir(root, { withFileTypes: true })).filter((entry) =>
  entry.isDirectory(),
);
if (!components.length) throw new Error('No component folders found.');
for (const { name } of components) {
  for (const file of [`${name}.ts`, `${name}.test.ts`]) {
    try {
      await access(join(root, name, file));
    } catch {
      throw new Error(`Component ${name} requires ${file}.`);
    }
  }
}
console.log(`Verified unit test files for ${components.length} component(s).`);
