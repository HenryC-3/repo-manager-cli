#!/usr/bin/env node
import { Command } from "@commander-js/extra-typings";
import { $ } from "zx";
import {
    enableAutoUpdate,
    disableAutoUpdate,
    initConfig,
    addRepoToSuperProject,
} from "./actions.js";
import { initHook } from "./utils/post-commit.js";

$.verbose = false;
const program = new Command();

program
    .name("rp")
    .description("CLI for setting up git hooks and organizing git submodules")
    .version("0.0.1");

program
    .command("init")
    .description("initialize cache files and post-commit hook")
    .action(async () => {
        await initConfig();
        await initHook();
    });

// program
//     .command("config")
//     .option("--edit", "edit config file")
//     .action(openConfigInEditor);

program
    .command("auto-update")
    .description("disable or enable auto update")
    .option("--disable", "disable auto update after commit in submodule")
    .option("--enable", "enable auto update after commit in submodule")
    .action((options) => {
        if (options.disable) disableAutoUpdate();
        if (options.enable) enableAutoUpdate();
    });

program
    .command("module")
    .description("perform module operation")
    .option("--add", "add current repository to super-project") // `rp module --add` 添加当前路径下的 repository 到 super-project
    .action(addRepoToSuperProject);

program.parse(process.argv);
