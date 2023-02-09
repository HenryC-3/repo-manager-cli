import { remove } from 'fs-extra';

export async function getConfig() {
    const env = process.env.NODE_ENV;
    const defaultConfig = {
        entryPoints: ['./src/scripts/index.ts', "./src/cli/index.ts"],
        outdir: "./output",
        outExtension: { '.js': '.cjs' },
        bundle: true,
        minify: true,
        platform: 'node',
        sourcemap: true,
        metafile: true,
        target: 'node18',
        format: "cjs",
    };
    if (env === "production") {
        await remove("output");
        const productionConfig = Object.assign(defaultConfig, { sourcemap: false });
        return productionConfig;
    }
    return defaultConfig;
}
