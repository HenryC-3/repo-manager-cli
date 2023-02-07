import { $, chalk } from "zx";
import { cleanGitEnvs, updateLinkWrapper } from "./utils.js";
import { getStr } from "../utils/index.js";

$.verbose = false;
cleanGitEnvs();

$`pwd`
    .then((output) => {
        updateLinkWrapper(getStr(output), $.env.ROOT_SUPER_PROJECT);
    })
    .catch((error) => {
        console.log(chalk.red(error));
    });
