export declare enum PCC {
    FILE = "\u001B[96m",// "Bright Cyan"
    LINE = "\u001B[93m",// "Bright Yellow"
    COL = "\u001B[93m",
    ERR = "\u001B[91m",// "Bright Red",
    WARN = "\u001B[93m",// "Bright Yellow"
    ERRCODE = "\u001B[90m",// "Bright Black (Gray)"
    VCOMP = "\u001B[96m"
}
/**
 * Utility class that provides ANSI color coding for prettier
 * compilation error/warning messages.
 * Color coding is only applied if stdout is connect to a terminal,
 * and can be disabled based upon the tsconfig "pretty" setting.
 */
export declare class PrettyMsgEncoder {
    private _isPretty;
    constructor(tsconfig_pretty: unknown);
    encode(type: PCC, val: unknown): string;
    encodeFileLineChar(file: string, line: number, char: number): string;
    get ERROR(): string;
    get WARNING(): string;
}
