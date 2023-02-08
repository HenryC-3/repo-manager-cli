import { writeJson } from "fs-extra";
import { chalk } from "zx";
import { homedir } from "os";
import { name } from "../../../package.json";

export const configPath = `${homedir()}/.config/${name}`;
export const configFilePath = `${homedir()}/.config/${name}/config.json`;

export interface Config {
    autoUpdate: boolean;
    superProjectPath: string;
    // rootSuperProject: string
}

export const defaultConfig: Config = {
    autoUpdate: true,
    superProjectPath: "",
};

export function getConfigValue(key: keyof Config) {
    try {
        return getConfig()[key];
    } catch (error) {
        console.log(error);
        console.log(chalk.red(`${key} is not configured in ${configFilePath}`));
    }
}

export async function updateConfig(config: Partial<Config>) {
    const oldConfig = getConfig();
    const newConfig = Object.assign(oldConfig, config);
    await writeJson(configFilePath, newConfig);
}

export function getConfig(): Config {
    return require(configFilePath);
}
