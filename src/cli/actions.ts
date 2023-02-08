import { configFilePath, configPath, defaultConfig } from "./utils/config.js";
import { getConfigValue } from "./utils/config.js";
import { addScriptToHook, removeScriptInHook } from "./utils/post-commit.js";
import { mkdirp, createFile, writeJson, pathExists, remove } from "fs-extra";
import { chalk } from "zx";
import { $ } from "zx";

export async function disableAutoUpdate() {
    const status = getConfigValue("autoUpdate");
    if (!status) {
        console.log(chalk.blue("already disabled"));
        return;
    }
    await removeScriptInHook();
    console.log(chalk.green("auto update disabled"));
}

export async function enableAutoUpdate() {
    const status = getConfigValue("autoUpdate");
    if (status) {
        console.log(chalk.blue("already enabled"));
        return;
    }
    await addScriptToHook();
    console.log(chalk.green("auto update enabled"));
}

/**
 * @description create config file at ~/.config/repo-steward/config.json
 */
export async function initConfig() {
    const isConfigExist = await pathExists(configPath);

    if (isConfigExist) {
        remove(configPath);
        removeScriptInHook();
    }

    await mkdirp(configPath);
    await createFile(configFilePath);
    await writeJson(configFilePath, defaultConfig);
}

export async function openConfigInEditor() {
    const editor = $.env.EDITOR;
    await $`${editor} ${configFilePath}`;
}
