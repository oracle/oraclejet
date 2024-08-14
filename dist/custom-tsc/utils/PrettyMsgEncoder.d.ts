export declare enum PCC {
    FILE = "\u001B[96m",
    LINE = "\u001B[93m",
    COL = "\u001B[93m",
    ERR = "\u001B[91m",
    WARN = "\u001B[93m",
    ERRCODE = "\u001B[90m",
    VCOMP = "\u001B[96m"
}
export declare class PrettyMsgEncoder {
    private _isPretty;
    constructor(tsconfig_pretty: unknown);
    encode(type: PCC, val: unknown): string;
    encodeFileLineChar(file: string, line: number, char: number): string;
    get ERROR(): string;
    get WARNING(): string;
}
