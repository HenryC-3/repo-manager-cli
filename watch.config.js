import { ctx } from "./build.config.js"


try {
    await ctx.watch()
    console.log('watching...')
} catch (error) {
    console.log(error)
}

