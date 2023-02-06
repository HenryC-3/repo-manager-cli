const esbuild = require('esbuild')

esbuild.build({
    entryPoints: ['./src/scripts/index.ts', "./src/cli/index.ts"],
    outdir: "./output",
    outExtension: { '.js': '.cjs' }, // [esbuild - API](https://esbuild.github.io/api/#out-extension)
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node18',
    format: "cjs",
}).catch(() => process.exit(1))