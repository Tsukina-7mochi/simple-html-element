import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['mod.ts'],
  outfile: 'main.js',
  bundle: true,
  platform: 'neutral',
  minify: true,
});
await esbuild.stop();
