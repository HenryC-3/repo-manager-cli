import { Command } from "commander";
import { existsSync, appendFileSync, mkdirpSync } from "fs-extra";
import { resolve } from "path";
import { getHooksPath, getScriptInHook, initHook } from "./utils.js";
import { homedir } from "os";
import { replaceInFileSync } from "replace-in-file";

const program = new Command();

program
    .name("submodule-manager")
    .description(
        "CLI for setting up git hooks and executing shortcuts of git submodule related commands"
    )
    .version("0.0.1");

program
    .command("init")
    .description("setup post-commit hooks and environment variables")
    .action(() => {
        const newFolderPath = `${homedir()}/.config/global-hooks/hooks`;
        const postCommitSourcePath = resolve(__dirname, "../../post-commit");
        getHooksPath().then((hooksPath) => {
            const isHookExist = existsSync(`${hooksPath}/post-commit`);

            if (isHookExist) {
                appendFileSync(`${hooksPath}/post-commit`, getScriptInHook());
            }

            if (!hooksPath) {
                mkdirpSync(newFolderPath);
                initHook(newFolderPath, postCommitSourcePath);
            }

            if (hooksPath && !isHookExist) {
                initHook(newFolderPath, postCommitSourcePath);
            }
        });
    });

program
    .command("remove")
    .description("remove update submodule operation in post-commit hook")
    .action(() => {
        getHooksPath().then((hooksPath) => {
            replaceInFileSync({
                files: `${hooksPath}/post-commit`,
                from: getScriptInHook(),
                to: "",
            });
        });
    });

program.parse();
