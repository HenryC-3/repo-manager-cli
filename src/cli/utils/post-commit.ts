/* utils for post-commit file */
import { appendFile, createFile, exists, mkdirp, writeFile } from "fs-extra";
import { $, chalk } from "zx";
import { resolve } from "path";
import { checkIfContains, getStr } from "../../utils/index.js";
import { homedir } from "os";
import { getConfigValue, updateConfig } from "./config.js";
import { replaceInFile } from "replace-in-file";

/**
 * @description create executable post-commit hook in ~/.config/global-hooks/hooks
 */
export async function initHook() {
    const hooksPath = await getHooksPath();
    const isHookExist = await exists(`${hooksPath}/post-commit`);
    const status = await getConfigValue("autoUpdate");
    const scriptWithSheBang = `#!/bin/sh \n${getScriptInHook()}`;

    // hooks path configured and post-commit hook exist
    if (isHookExist) {
        const isHookContainsScript = await checkIfContains(
            `${hooksPath}/post-commit`,
            getScriptInHook()
        );
        // add script to hook when
        // 1. autoUpdate in config.json is true
        // 2. there's no existing scripts in post-commit hook
        if (status && !isHookContainsScript) {
            await addScriptToHook();
        }
        console.log(
            chalk.blue(`post-commit hook initialized, available at`),
            chalk.green(`${hooksPath}/post-commit`)
        );
        return;
    }

    // haven't configure hooks path yet
    if (!hooksPath) {
        const defaultHooksPath = `${homedir()}/.config/global-hooks/hooks`;

        await mkdirp(defaultHooksPath);
        await $`git config --global core.hooksPath ${defaultHooksPath}`;
        await createPostCommit(
            `${defaultHooksPath}/post-commit`,
            scriptWithSheBang
        );
    }

    // hooks path configured but post-commit file doesn't exist
    if (hooksPath && !isHookExist) {
        await createPostCommit(`${hooksPath}/post-commit`, scriptWithSheBang);
    }

    async function createPostCommit(
        postCommitPath: string,
        scriptWithSheBang: string
    ) {
        await createFile(postCommitPath);
        await writeFile(postCommitPath, scriptWithSheBang);

        // make hook executable
        await $`chmod +x ${postCommitPath}`;
        chalk.green(
            `post-commit hook initialized, available at ${postCommitPath}`
        );
    }
}

export async function getHooksPath() {
    const output = await $`git config --global core.hooksPath`;
    return getStr(output);
}

export function getScriptInHook() {
    const scriptPath = resolve(__dirname, "../../output/scripts/index.cjs");
    return `\nnode ${scriptPath}`;
}

export async function removeScriptInHook() {
    const hooksPath = await getHooksPath();
    await replaceInFile({
        files: `${hooksPath}/post-commit`,
        from: getScriptInHook(),
        to: "",
    });
    updateConfig({ autoUpdate: false });
}

export async function addScriptToHook() {
    const hooksPath = await getHooksPath();
    const isHookExist = await exists(`${hooksPath}/post-commit`);

    if (isHookExist) {
        await appendFile(`${hooksPath}/post-commit`, getScriptInHook());
        updateConfig({ autoUpdate: true });
    }
}
