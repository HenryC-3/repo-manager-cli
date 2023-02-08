import { lstat, readdir } from "fs-extra";
import { join } from "path";

export async function getSubFolders(targetPath: string) {
    const dirs = [];
    const names = await readdir(targetPath); // read current folder
    for (const name of names) {
        const fullPath = join(targetPath, name);
        const result = await lstat(fullPath);

        if (result.isDirectory()) {
            dirs.push(name);
        }
    }
    return dirs;
}
