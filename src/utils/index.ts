import { readFile } from "fs/promises";
import { ProcessOutput } from "zx";
import { dirname } from "path";
import { fileURLToPath } from "url";

export function __dirname() {
    return dirname(fileURLToPath(import.meta.url));
}
export function getStr(input: ProcessOutput) {
    return input.stdout.trim(); //input.stdout contains \n in the end
}

export async function checkIfContains(path: string, str: string) {
    const contents = await readFile(path, "utf-8");
    return contents.includes(str);
}
