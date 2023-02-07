import { getCacheValue } from "./utils/cache.js";
import { addScriptToHook, removeScriptToHook } from "./utils/post-commit.js";
import { mkdirp, createFile, writeJson, pathExists } from "fs-extra";
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
    await removeScriptToHook();
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
export async function initConfig() {
    const isConfigExist = await pathExists(cacheFilePath);
    const content: Cache = {
        autoUpdate: false,
        globalHooksPath: "",
    };

    if (!isConfigExist) {
        await mkdirp(configPath);
        await createFile(cacheFilePath);
        await writeJson(cacheFilePath, content);
    }
}

export async function openConfigInEditor() {
    const editor = $.env.EDITOR;
    await $`${editor} ${cacheFilePath}`;
}
