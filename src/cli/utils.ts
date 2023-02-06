import { copyFileSync } from "fs-extra";
import { $, chalk } from "zx";
import { resolve } from "path";
import { getStr } from "utils/index.js";

export async function initHook(targetPath: string, sourcePath: string) {
    copyFileSync(sourcePath, targetPath);
    await $`chmod +x ${targetPath}`;
    chalk.green(
        // TODO: add related doc link
        "the post-commit hook is set, you can use ROOT_SUPER_PROJECT environment variable to configure it's behavior, see"
    );
}

export async function getHooksPath() {
    const output = await $`git config --global core.hooksPath`;
    return getStr(output);
}

export function getScriptInHook() {
    const scriptPath = resolve(__dirname, "../../output/scripts/index.cjs");
    return `\nnode ${scriptPath}`;
}
