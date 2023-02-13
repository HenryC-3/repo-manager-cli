import { defineConfig } from "tsup";

export default defineConfig({
    entry: ['src/cli/index.ts', 'src/scripts/index.ts'],
    format: ["esm"],
    target: "esnext",
    splitting: false,
    // [Make \`require\` work in ESM bundle · Discussion #505 · egoist/tsup](https://github.com/egoist/tsup/discussions/505)
    banner: {
        js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import\.meta.url);`,
    },

});


