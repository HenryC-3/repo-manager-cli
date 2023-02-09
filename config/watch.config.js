import * as esbuild from 'esbuild'
import { getConfig } from "./shared.js"

const ctx = await esbuild.context(await getConfig())

try {
    await ctx.watch()
    console.log('watching...')
} catch (error) {
    console.log(error)
}

