"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerError = void 0;
class TransformerError extends Error {
    constructor(vcompName, message, errNode) {
        const header = TransformerError.getMsgHeader(vcompName, errNode);
        super(`${header} ${message}`);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransformerError);
        }
        this.name = 'TransformerError';
    }
    static getMsgHeader(vcompName, errNode) {
        let rtnString;
        const sourceFile = errNode === null || errNode === void 0 ? void 0 : errNode.getSourceFile();
        if (sourceFile) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(errNode.getStart());
            rtnString = `${sourceFile.fileName}:${line + 1}:${character + 1} - ${vcompName}:`;
        }
        else {
            rtnString = `${vcompName}:`;
        }
        return rtnString;
    }
}
exports.TransformerError = TransformerError;
//# sourceMappingURL=TransformerError.js.map