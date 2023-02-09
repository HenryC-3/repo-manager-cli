import * as esbuild from 'esbuild'

export const ctx = await esbuild.context({
    entryPoints: ['./src/scripts/index.ts', "./src/cli/index.ts"],
    outdir: "./output",
    outExtension: { '.js': '.cjs' }, // [esbuild - API](https://esbuild.github.io/api/#out-extension)
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node18',
    format: "cjs",
})


// TODO dynamically generate vscode debug configuration in launch.json. waiting for API to implement this, see [List all command's arguments using Helper · Issue #1823 · tj/commander.js](https://github.com/tj/commander.js/issues/1823)
// 1. get all subcommands and options
// 2. set the debug configuration template
// 3. fill those commands and options into debug configuration template
// 4. generate along with esbuild re-build