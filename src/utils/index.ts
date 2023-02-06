import { ProcessOutput } from "zx";

export function getStr(input: ProcessOutput) {
    return input.stdout.trim(); //input.stdout contains \n in the end
}
