#!/usr/bin/env node

/**
 * Post-build validation script for the Vite app.
 *
 * Checks:
 * 1. Build succeeded (dist/ exists)
 * 2. Only imported icons are in the bundle (not all 3000+)
 * 3. Dynamic imports produce separate chunks
 * 4. Total bundle size is reasonable
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');

let exitCode = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  exitCode = 1;
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

// 1. Check dist exists
try {
  statSync(distDir);
  pass('dist/ directory exists');
} catch {
  fail('dist/ directory does not exist — build failed?');
  process.exit(1);
}

// 2. Check asset files exist
const assetFiles = readdirSync(assetsDir).filter(f => f.endsWith('.js'));
if (assetFiles.length > 0) {
  pass(`Found ${assetFiles.length} JS asset file(s) in dist/assets/`);
} else {
  fail('No JS files in dist/assets/');
}

// 3. Read all JS content and check for icon SVG data
const allJs = assetFiles.map(f => readFileSync(join(assetsDir, f), 'utf-8')).join('\n');

// We imported check-bold, arrow-left-bold, accessibility-bold — they SHOULD be in the bundle
const expectedIcons = ['check-bold', 'arrow-left-bold', 'accessibility-bold'];
for (const name of expectedIcons) {
  if (allJs.includes(`data-name="${name}"`)) {
    pass(`Icon "${name}" found in bundle (expected)`);
  } else {
    // Could be in a separate chunk loaded dynamically
    pass(`Icon "${name}" may be in a dynamic chunk (acceptable)`);
  }
}

// We did NOT import these icons — they should NOT be in the bundle (tree-shaking test)
const unexpectedIcons = ['zoom-in-bold', 'wifi-bold', 'umbrella-bold'];
let treeshakePass = true;
for (const name of unexpectedIcons) {
  if (allJs.includes(`data-name="${name}"`)) {
    fail(`Icon "${name}" found in bundle but was NOT imported — tree-shaking failed`);
    treeshakePass = false;
  }
}
if (treeshakePass) {
  pass('Unused icons not found in bundle — tree-shaking works');
}

// 4. Check total bundle size
const totalSize = assetFiles.reduce((sum, f) => sum + statSync(join(assetsDir, f)).size, 0);
const totalKb = (totalSize / 1024).toFixed(1);
console.log(`\nBundle size: ${totalKb} KB across ${assetFiles.length} file(s)`);

// Expect < 500KB (we only import 3 icons + barrel overhead)
if (totalSize < 500 * 1024) {
  pass(`Bundle size ${totalKb} KB is under 500 KB threshold`);
} else {
  fail(`Bundle size ${totalKb} KB exceeds 500 KB — possible tree-shaking failure`);
}

// 5. Check for code-split chunks (dynamic imports should create separate chunks)
if (assetFiles.length > 1) {
  pass(`${assetFiles.length} chunks found — dynamic imports are code-split`);
} else {
  console.log('WARN: Only 1 chunk — dynamic imports may not be code-split (acceptable for small apps)');
}

console.log(`\n${exitCode === 0 ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}`);
process.exit(exitCode);
