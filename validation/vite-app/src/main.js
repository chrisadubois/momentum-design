/**
 * Validation app to verify icon/asset distribution works with Vite.
 *
 * This entry point tests STATIC imports only (barrel + deep imports).
 * It deliberately does NOT import dynamicIconImports, because importing
 * the full dynamic import map naturally references all icons.
 *
 * Tests:
 * 1. Static named import from barrel (tree-shaking via sideEffects: false)
 * 2. Per-icon deep import (guaranteed single-file resolution)
 * 3. Brand-visual dynamic import
 * 4. Illustration dynamic import
 * 5. Animation manifest import
 */

// --- Test 1: Barrel import (tree-shaking) ---
// Only these 2 icons should end up in the bundle
import { checkBold, arrowLeftBold } from '@momentum-design/icons';

// --- Test 2: Per-icon deep import ---
import accessibilityBold from '@momentum-design/icons/icons/accessibility-bold';

// --- Test 5: Animation manifest ---
import animationManifest from '@momentum-design/animations/manifest';

const app = document.getElementById('app');

function log(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  app.appendChild(p);
}

// Test 1
log(`[Barrel import] checkBold type: ${typeof checkBold}, returns: ${typeof checkBold()}`);
log(`[Barrel import] arrowLeftBold type: ${typeof arrowLeftBold}, returns: ${typeof arrowLeftBold()}`);

// Test 2
log(`[Deep import] accessibilityBold type: ${typeof accessibilityBold}, returns: ${typeof accessibilityBold()}`);

// Test 3 - brand-visual dynamic import (single icon, code-split)
import('@momentum-design/brand-visuals/brand-visuals/alphalink').then(mod => {
  log(`[Brand-visual] alphalink loaded, type: ${typeof mod.default}`);
}).catch(err => {
  log(`[Brand-visual] alphalink failed: ${err.message}`);
});

// Test 4 - illustration dynamic import (single icon, code-split)
import('@momentum-design/illustrations/illustrations/ants-content-oneninetwo-default').then(mod => {
  log(`[Illustration] loaded, type: ${typeof mod.default}`);
}).catch(err => {
  log(`[Illustration] failed: ${err.message}`);
});

// Test 5
log(`[Animation manifest] keys: ${Object.keys(animationManifest).length}`);

log('--- All static import tests complete ---');
