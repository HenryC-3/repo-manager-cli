import { $, chalk } from "zx";
export async function addSubmodule(
    superProjectPath: string,
    submoduleRemoteURL: string,
    submodulePath: string
) {
    try {
        await $`git -C ${superProjectPath} submodule add ${submoduleRemoteURL} ${submodulePath}`;
        console.log(
            chalk.green(
                `submodule added, available at ${superProjectPath}/${submodulePath}`
            )
        );
    } catch (error) {
        console.log(error);
    }
}
