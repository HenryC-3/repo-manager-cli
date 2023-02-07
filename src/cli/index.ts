#!/usr/bin/env node
import { Command } from "commander";
import { $ } from "zx";
import {
    enableAutoUpdate,
    disableAutoUpdate,
    initConfig as initCache,
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
    .action(() => {
        initCache();
        initHook();
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

program.parse(process.argv);
