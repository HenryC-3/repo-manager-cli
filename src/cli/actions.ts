import { getCacheValue } from "./utils/cache.js";
import { addScriptToHook, removeScriptInHook } from "./utils/post-commit.js";
import { mkdirp, createFile, writeJson, pathExists, remove } from "fs-extra";
import { chalk } from "zx";
import { homedir } from "os";
import { name } from "../../package.json";
import { $ } from "zx";

export const configPath = `${homedir()}/.config/${name}`;
export const cacheFilePath = `${homedir()}/.config/${name}/cache.json`;
export interface Cache {
    autoUpdate: boolean;
    globalHooksPath: string;
}

export async function disableAutoUpdate() {
    const status = getCacheValue("autoUpdate");
    if (!status) {
        console.log(chalk.blue("already disabled"));
        return;
    }
    await removeScriptInHook();
    console.log(chalk.green("auto update disabled"));
}

export async function enableAutoUpdate() {
    const status = getCacheValue("autoUpdate");
    if (status) {
        console.log(chalk.blue("already enabled"));
        return;
    }
    await addScriptToHook();
    console.log(chalk.green("auto update enabled"));
}

/**
 * @description create config file at ~/.config/repo-steward/cache.json
 */
export async function initCache() {
    const isConfigExist = await pathExists(configPath);
    const content: Cache = {
        autoUpdate: false,
        globalHooksPath: "",
    };

    if (isConfigExist) {
        remove(configPath);
        removeScriptInHook();
    }

    await mkdirp(configPath);
    await createFile(cacheFilePath);
    await writeJson(cacheFilePath, content);
}

export async function openConfigInEditor() {
    const editor = $.env.EDITOR;
    await $`${editor} ${cacheFilePath}`;
}
