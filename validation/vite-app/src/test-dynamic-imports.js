/**
 * Separate test for the dynamic import map (Lucide pattern).
 *
 * When importing dynamicIconImports, the bundler creates a chunk for each icon.
 * This is expected — the icons are only loaded on demand at runtime.
 * The test verifies that the import resolves and works.
 */

import dynamicIconImports from '@momentum-design/icons/dynamicIconImports';

const iconName = 'check-bold';

if (dynamicIconImports[iconName]) {
  dynamicIconImports[iconName]().then(mod => {
    console.log(`[Dynamic import map] ${iconName} loaded successfully, type: ${typeof mod.default}`);
    document.getElementById('app').textContent = `Dynamic import of ${iconName}: OK`;
  });
} else {
  console.error(`[Dynamic import map] ${iconName} not found in map`);
}

console.log(`[Dynamic import map] Total icons in map: ${Object.keys(dynamicIconImports).length}`);
