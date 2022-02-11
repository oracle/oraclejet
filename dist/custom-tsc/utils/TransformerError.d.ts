import ts from 'typescript';
export declare class TransformerError extends Error {
    constructor(vcompName: string, message: string, errNode?: ts.Node);
    static getMsgHeader(vcompName: string, errNode?: ts.Node): string;
}
