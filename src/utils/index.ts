import { readFile } from "fs-extra";
import { ProcessOutput } from "zx";

export function getStr(input: ProcessOutput) {
    return input.stdout.trim(); //input.stdout contains \n in the end
}

export async function checkIfContains(path: string, str: string) {
    const contents = await readFile(path, "utf-8");
    return contents.includes(str);
}
