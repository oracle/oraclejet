"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerError = void 0;
class TransformerError extends Error {
    constructor(className, message) {
        super(`${className}: ${message}`);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransformerError);
        }
        this.name = "TransformerError";
    }
}
exports.TransformerError = TransformerError;
