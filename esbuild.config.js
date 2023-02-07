import * as esbuild from 'esbuild'

let ctx = await esbuild.context({
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

try {
    await ctx.watch()
    console.log('watching...')
} catch (error) {
    console.log(error)
}

