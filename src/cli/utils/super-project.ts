/* utils for git super-project */
import { lstat, readdir } from "fs/promises";
import { join } from "path";
import { $ } from "zx";
import { getConfigValue } from "./config.js";

export async function getSubFolders(targetPath: string) {
    const dirs = [];
    const names = await readdir(targetPath); // read current folder
    for (const name of names) {
        const fullPath = join(targetPath, name);
        const result = await lstat(fullPath);

        if (result.isDirectory()) {
            dirs.push(name);
        }
    }
    return dirs;
}

/**
 * @description add, commit, push changes in super-project
 * @param isSubmodule is this file a submodule?
 */
export async function updateSuperProject(
    changedFilesPath: string[],
    msg: string,
    isSubmodule = false
) {
    const superProjectPath = await getConfigValue("superProjectPath");
    // git add
    for (const path of changedFilesPath) {
        await $`git -C ${superProjectPath} add ${path}`;
    }
    if (isSubmodule) await $`git -C ${superProjectPath} add .gitmodules`;
    // git commit
    await $`git commit -m ${msg}`;
    // git push
    await $`git push origin master`;
}
