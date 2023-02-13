/* utils for git/github repositories */
import { $ } from "zx";
import { getStr } from "../../utils/index.js";

export async function haveChange() {
    const output = await $`git status -s`; // when there's no change, `git status -s` output nothing
    return getStr(output);
}

export async function getRemoteURL() {
    const output = await $`git config --get remote.origin.url`;
    return getStr(output);
}
