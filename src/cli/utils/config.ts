/* utils for config.json file */
import { exists, readJson, writeJson } from "fs-extra";
import { chalk } from "zx";
import { homedir } from "os";
import { name } from "../../../package.json";
import { getHooksPath, getScriptInHook } from "./post-commit.js";
import { checkIfContains } from "../../utils/index.js";

export const configPath = `${homedir()}/.config/${name}`;
export const configFilePath = `${homedir()}/.config/${name}/config.json`;

export interface Config {
    superProjectPath: string; // the path to the git super-project which stores the structure of github repositories
    // rootSuperProject: string
}

export const defaultConfig: Config = {
    superProjectPath: "",
};

export async function getScriptStatus() {
    const hooksPath = await getHooksPath();
    const isHookExist = await exists(`${hooksPath}/post-commit`);
    if (isHookExist) {
        const isHookContainsScript = await checkIfContains(
            `${hooksPath}/post-commit`,
            getScriptInHook()
        );
        return isHookContainsScript;
    } else {
        throw "post-commit hook doesn't exit, run `rp init` to initialize post-commit file";
    }
}

export async function getConfigValue(key: keyof Config) {
    try {
        const result = await getConfig();
        if (result[key] !== undefined || result[key] !== "") {
            return result[key];
        }
        throw Error;
    } catch (error) {
        console.log(
            chalk.red(`In order to use this command, please configure`),
            chalk.green(`${key}`),
            chalk.red("in"),
            chalk.green(`${configFilePath}`),
            chalk.red("first.")
        );
    }
}

export async function updateConfig(config: Partial<Config>) {
    const oldConfig = getConfig();
    const newConfig = Object.assign(oldConfig, config);
    await writeJson(configFilePath, newConfig);
}

export async function getConfig(): Promise<Config> {
    return await readJson(configFilePath);
}
