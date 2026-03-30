#!/usr/bin/env node

/**
 * Post-build script for @momentum-design/illustrations
 *
 * Generates from dist/manifest.json:
 * - dist/es/index.js          — barrel re-exporting all illustrations as named exports
 * - dist/es/index.d.ts        — TypeScript declarations for the barrel
 * - dist/es/dynamicIllustrationImports.js  — lazy import map
 * - dist/es/dynamicIllustrationImports.d.ts
 * - dist/es/<name>.d.ts       — per-illustration type declarations
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distEs = join(root, 'dist', 'es');
const manifestPath = join(root, 'dist', 'manifest.json');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const assetNames = Object.keys(manifest);

function toIdentifier(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

mkdirSync(distEs, { recursive: true });

// --- Per-illustration .d.ts files ---
const perAssetDts = `import { TemplateResult } from 'lit';
declare const illustration: () => TemplateResult;
export default illustration;
`;

for (const name of assetNames) {
  writeFileSync(join(distEs, `${name}.d.ts`), perAssetDts);
}

// --- Barrel index.js ---
const barrelLines = assetNames.map((name) => {
  const id = toIdentifier(name);
  return `export { default as ${id} } from './${name}.js';`;
});
writeFileSync(join(distEs, 'index.js'), barrelLines.join('\n') + '\n');

// --- Barrel index.d.ts ---
writeFileSync(join(distEs, 'index.d.ts'), barrelLines.join('\n') + '\n');

// --- Dynamic import map ---
const dynamicLines = assetNames.map(
  (name) => `  '${name}': () => import('./${name}.js'),`,
);
const dynamicImportMap = `const dynamicIllustrationImports = {\n${dynamicLines.join('\n')}\n};\nexport default dynamicIllustrationImports;\n`;
writeFileSync(join(distEs, 'dynamicIllustrationImports.js'), dynamicImportMap);

// --- Dynamic import map .d.ts ---
const dynamicDts = `import { TemplateResult } from 'lit';

type IllustrationModule = { default: () => TemplateResult };
declare const dynamicIllustrationImports: Record<string, () => Promise<IllustrationModule>>;
export default dynamicIllustrationImports;
`;
writeFileSync(join(distEs, 'dynamicIllustrationImports.d.ts'), dynamicDts);

console.log(`Generated ES module extras for ${assetNames.length} illustrations in dist/es/`);
