const esbuild = require('esbuild');

esbuild.build({
  bundle: true,
  entryPoints: ['src/plugin/index.ts'],
  outfile: 'dist/index.js',
  tsconfig: 'src/plugin/tsconfig.json',
});
