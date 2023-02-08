import { getRemoteURL, haveChange } from "./utils/repo.js";
import inquirer from "inquirer";
import { getSubFolders, updateSuperProject } from "./utils/super-project.js";
import { configFilePath, configPath, defaultConfig } from "./utils/config.js";
import { getConfigValue } from "./utils/config.js";
import { addScriptToHook, removeScriptInHook } from "./utils/post-commit.js";
import { mkdirp, createFile, writeJson, pathExists, remove } from "fs-extra";
import { $, chalk } from "zx";
import { basename } from "path";
import { addSubmodule } from "./utils/submodule.js";

export async function disableAutoUpdate() {
    const status = await getConfigValue("autoUpdate");
    if (!status) {
        console.log(chalk.blue("already disabled"));
        return;
    }
    await removeScriptInHook();
    console.log(chalk.green("auto update disabled"));
}

export async function enableAutoUpdate() {
    const status = await getConfigValue("autoUpdate");
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
        await removeScriptInHook();
    }

    await mkdirp(configPath);
    await createFile(configFilePath);
    await writeJson(configFilePath, defaultConfig);
    console.log(
        chalk.blue(`configuration initialized, available at`),
        chalk.green(configFilePath)
    );
}

export async function openConfigInEditor() {
    const editor = $.env.EDITOR;
    await $`${editor} ${configFilePath}`;
}

export async function addRepoToSuperProject() {
    const superProjectPath = (await getConfigValue(
        "superProjectPath"
    )) as string;
    const remoteURL = await getRemoteURL();

    // check current folder
    if (await haveChange()) {
        console.error("there are uncommitted changes");
        return;
    }
    if (!remoteURL) {
        console.error("not a remote repository");
        return;
    }

    // get categories in super-project folder
    const categories = await getSubFolders(superProjectPath).then((result) => {
        return result.filter((name) => {
            const excludes = [".vscode", "dotbot", ".git", "media"];
            const isNotExclude = !excludes.includes(name);
            if (isNotExclude) {
                return name;
            }
        });
    });

    // launch prompt
    const { category, confirmDelete } = await inquirer.prompt([
        {
            type: "list",
            name: "category",
            message: "Choose a category",
            choices: categories,
            loop: false,
        },
        {
            type: "confirm",
            name: "confirmDelete",
            message: "Delete current folder?",
            default: false,
        },
    ]);

    // add submodule to super-project
    const moduleName = basename(process.cwd());
    await addSubmodule(
        superProjectPath,
        remoteURL,
        `${category}/${moduleName}`
    );

    // update changes in super-project
    await updateSuperProject(
        `${category}/${moduleName}`,
        `add module ${moduleName}`,
        true
    );

    // delete current folder
    if (confirmDelete) {
        await remove(process.cwd());
    }
}
