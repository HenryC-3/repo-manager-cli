import { $, ProcessOutput, chalk } from "zx";
import { getStr } from "../utils/index.js";

/**
 * @description update super-project's submodule link by condition
 */
export async function updateLinkWrapper(
    currentPath: string,
    rootSuperProjectPath: string | undefined
) {
    const { relSubmodulePath, superProjectPath, submodulePath } =
        await getSubmoduleInfo(currentPath);

    const isCurrentPathSubmodule = await isSubmodule(currentPath);
    const isRootSuperProject = rootSuperProjectPath
        ? rootSuperProjectPath === currentPath
        : false;
    if (!isCurrentPathSubmodule || isRootSuperProject) {
        return;
    }
    console.log(
        chalk.green(`
=====================================
    updating module A in module B
    A: ${currentPath} 
    B: ${superProjectPath}
=====================================
    `)
    );
    await updateLink(superProjectPath, submodulePath, relSubmodulePath);
}

/**
 * @description auto add, commit and push changes of current submodule in super-project
 */
export async function updateLink(
    superProjectPath: string,
    submodulePath: string,
    relSubmodulePath: string
) {
    const updateMsg = `auto update: ${relSubmodulePath}/`;
    await $`git -C ${superProjectPath} add ${submodulePath}`;
    await $`git -C ${superProjectPath} commit -m ${updateMsg}`;
    try {
        await $`git -C ${superProjectPath} push origin master`;
        console.log(
            chalk.green(`
=========================================
    update success    
=========================================
        `)
        );
    } catch (error) {
        console.log(
            chalk.red(`${superProjectPath} push to origin master failed`)
        );
        console.log(chalk.red(error));
    }
}

/**
 * @description Determine if the current folder is a git repository
 * @param absPath The absolute path of a git repository
 */
export async function isSubmodule(absPath: string | undefined) {
    if (absPath) {
        const result =
            await $`git -C ${absPath} rev-parse --show-superproject-working-tree`;
        return Boolean(getStr(result));
    }
    return false;
}

export async function getSubmoduleInfo(submodulePath: string) {
    const output =
        await $`git -C ${submodulePath} rev-parse --show-superproject-working-tree`;

    const superProjectPath = getStr(output);
    const relSubmodulePath = submodulePath.replace(superProjectPath + "/", "");
    return {
        relSubmodulePath,
        superProjectPath,
        submodulePath,
    };
}

export function isGitCmdSuccess(input: ProcessOutput) {
    return input.exitCode === 0; // 0 for success
}

/**
 * @description remove env variables to make sure git commands on other repos execute successfully, see https://stackoverflow.com/questions/4043609/getting-fatal-not-a-git-repository-when-using-post-update-hook-to-execut/4532716#4532716
 */
export function cleanGitEnvs() {
    // https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables
    const repositoryLocationsENV = [
        "GIT_ALTERNATE_OBJECT_DIRECTORIES",
        "GIT_OBJECT_DIRECTORY",
        "GIT_INDEX_FILE",
        "GIT_WORK_TREE",
        "GIT_CEILING_DIRECTORIES",
        "GIT_DIR",
    ];
    repositoryLocationsENV.forEach((name) => {
        delete $.env[name];
        return $.env[name];
    });
}
