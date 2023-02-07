import { writeJson } from "fs-extra";
import { chalk } from "zx";
import { Cache, cacheFilePath } from "../actions.js";

export function getCacheValue(key: keyof Cache) {
    try {
        return getCache()[key];
    } catch (error) {
        console.log(error);
        console.log(
            chalk.red(
                "run `rp init` to initialize configuration and post-commit hooks"
            )
        );
    }
}

export async function updateCache(cache: Partial<Cache>) {
    const oldCache = getCache();
    const newCache = Object.assign(oldCache, cache);
    await writeJson(cacheFilePath, newCache);
}

export function getCache(): Cache {
    return require(cacheFilePath);
}
