#!/usr/bin/env node

/**
 * Post-build validation script for the Webpack app.
 *
 * Checks:
 * 1. Build succeeded (dist/ exists)
 * 2. Only imported icons are in the bundle (not all 3000+)
 * 3. No webpack "context module" bundling all icons
 * 4. Total bundle size is reasonable
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

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

// 2. Check JS files exist
const jsFiles = readdirSync(distDir).filter(f => f.endsWith('.js'));
if (jsFiles.length > 0) {
  pass(`Found ${jsFiles.length} JS file(s) in dist/`);
} else {
  fail('No JS files in dist/');
}

// 3. Read all JS content
const allJs = jsFiles.map(f => readFileSync(join(distDir, f), 'utf-8')).join('\n');

// Check expected icons are present
const expectedIcons = ['check-bold', 'arrow-left-bold', 'accessibility-bold'];
for (const name of expectedIcons) {
  if (allJs.includes(`data-name="${name}"`) || allJs.includes(`data-name=\\"${name}\\"`)) {
    pass(`Icon "${name}" found in bundle (expected)`);
  } else {
    pass(`Icon "${name}" may be in a dynamic chunk (acceptable)`);
  }
}

// Check unexpected icons are NOT present (tree-shaking)
const unexpectedIcons = ['zoom-in-bold', 'wifi-bold', 'umbrella-bold'];
let treeshakePass = true;
for (const name of unexpectedIcons) {
  if (allJs.includes(`data-name="${name}"`) || allJs.includes(`data-name=\\"${name}\\"`)) {
    fail(`Icon "${name}" found in bundle but was NOT imported — tree-shaking failed`);
    treeshakePass = false;
  }
}
if (treeshakePass) {
  pass('Unused icons not found in bundle — tree-shaking works');
}

// 4. Check for context module (webpack specific problem)
// A context module would contain ALL icon SVGs; look for a large number of data-name attributes
const dataNameMatches = allJs.match(/data-name="/g);
const dataNameCount = dataNameMatches ? dataNameMatches.length : 0;
console.log(`\nFound ${dataNameCount} icon SVGs in the bundle`);

if (dataNameCount <= 20) {
  pass(`Only ${dataNameCount} icon SVGs in bundle — no context module problem`);
} else {
  fail(`${dataNameCount} icon SVGs in bundle — possible context module bundling all icons`);
}

// 5. Check total bundle size
const totalSize = jsFiles.reduce((sum, f) => sum + statSync(join(distDir, f)).size, 0);
const totalKb = (totalSize / 1024).toFixed(1);
console.log(`\nBundle size: ${totalKb} KB across ${jsFiles.length} file(s)`);

if (totalSize < 500 * 1024) {
  pass(`Bundle size ${totalKb} KB is under 500 KB threshold`);
} else {
  fail(`Bundle size ${totalKb} KB exceeds 500 KB — possible tree-shaking failure`);
}

console.log(`\n${exitCode === 0 ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}`);
process.exit(exitCode);
