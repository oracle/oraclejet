"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerError = void 0;
class TransformerError extends Error {
    constructor(message) {
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransformerError);
        }
        this.name = "TransformerError";
    }
}
exports.TransformerError = TransformerError;
