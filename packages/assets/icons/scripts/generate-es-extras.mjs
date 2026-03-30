#!/usr/bin/env node

/**
 * Post-build script for @momentum-design/icons
 *
 * Generates from dist/manifest.json:
 * - dist/es/index.js          — barrel re-exporting all icons as named exports
 * - dist/es/index.d.ts        — TypeScript declarations for the barrel
 * - dist/es/dynamicIconImports.js  — lazy import map (Lucide pattern)
 * - dist/es/dynamicIconImports.d.ts
 * - dist/es/<icon>.d.ts       — per-icon type declarations
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distEs = join(root, 'dist', 'es');
const manifestPath = join(root, 'dist', 'manifest.json');

// Read manifest to get all icon names
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const iconNames = Object.keys(manifest);

// Convert kebab-case icon name to a valid JS identifier (camelCase)
function toIdentifier(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

mkdirSync(distEs, { recursive: true });

// --- Per-icon .d.ts files ---
const perIconDts = `import { TemplateResult } from 'lit';
declare const icon: () => TemplateResult;
export default icon;
`;

for (const name of iconNames) {
  writeFileSync(join(distEs, `${name}.d.ts`), perIconDts);
}

// --- Barrel index.js ---
const barrelLines = iconNames.map((name) => {
  const id = toIdentifier(name);
  return `export { default as ${id} } from './${name}.js';`;
});
writeFileSync(join(distEs, 'index.js'), barrelLines.join('\n') + '\n');

// --- Barrel index.d.ts ---
const barrelDtsLines = iconNames.map((name) => {
  const id = toIdentifier(name);
  return `export { default as ${id} } from './${name}.js';`;
});
writeFileSync(join(distEs, 'index.d.ts'), barrelDtsLines.join('\n') + '\n');

// --- Dynamic import map ---
const dynamicLines = iconNames.map(
  (name) => `  '${name}': () => import('./${name}.js'),`,
);
const dynamicImportMap = `const dynamicIconImports = {\n${dynamicLines.join('\n')}\n};\nexport default dynamicIconImports;\n`;
writeFileSync(join(distEs, 'dynamicIconImports.js'), dynamicImportMap);

// --- Dynamic import map .d.ts ---
const dynamicDts = `import { TemplateResult } from 'lit';

type IconModule = { default: () => TemplateResult };
declare const dynamicIconImports: Record<string, () => Promise<IconModule>>;
export default dynamicIconImports;
`;
writeFileSync(join(distEs, 'dynamicIconImports.d.ts'), dynamicDts);

console.log(`Generated ES module extras for ${iconNames.length} icons in dist/es/`);
