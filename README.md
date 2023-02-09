> NOTICE: This Project is under development, and functionalities have been tested on MacOS only.

## Table of Content

- [Table of Content](#table-of-content)
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Uninstall](#uninstall)
- [Setup Script Only](#setup-script-only)
- [Development](#development)

## Overview

This project ships 2 things

-   a script used in `post-commit` hook
-   a CLI command used to control script behavior

By using this script, you can

-   commit and push in super-project automatically after running `git commit -m msg` in it's submodule
-   stop auto commit in super-project when the path matches `$ROOT_SUPER_PROJECT`

If you want to use the script without CLI, you can follow the [setup-script-only](#setup-script-only) guide.

## Installation

```bash
npm install -g repo-steward
rp init
```

This step installs the `rp` command, and sets up script in `post-commit` hook.

## Usage

```bash
rp --help
rp help <command>
```

## Uninstall

```bash
rp auto-update --disable
npm uninstall -g repo-steward
```

## Setup Script Only

1.  Download [auto-update script](https://github.com/HenryC-3/repo-manager-cli/releases/download/0.0.1/auto-update-script)
2.  Run `chmod +x` for this script
3.  Add the path to the script in your global `post-commit` file. For how to setup git hooks globally, checkout [this answer](https://stackoverflow.com/a/37293198/10915537).

    ```bash
    #!/bin/sh

    path-to-the-downloaded-script/auto-update-script
    ```

Now, try to commit in a submodule and see what's happened in it's super-project!

## Development

> This is my very first CLI application, any advices and PRs are welcome!

```bash
pnpm i
npm run watch
```
