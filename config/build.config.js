import * as esbuild from 'esbuild'
import { writeFile } from "fs/promises"
import { getConfig } from './shared.js'

try {
    const result = await esbuild.build(await getConfig())
    // create meta.json for bundle analysis  [esbuild - Bundle Size Analyzer](https://esbuild.github.io/analyze/)
    await writeFile('meta.json', JSON.stringify(result.metafile))
    process.exit()
} catch (error) {
    console.log(error)
    process.exit(1)
}

