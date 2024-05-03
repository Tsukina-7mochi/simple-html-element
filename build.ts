import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['mod.ts'],
  outfile: 'main.cjs',
  bundle: true,
  format: 'cjs',
  platform: 'node',
  minify: true,
});
await esbuild.stop();
