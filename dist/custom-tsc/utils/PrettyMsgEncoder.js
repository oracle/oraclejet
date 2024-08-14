"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettyMsgEncoder = exports.PCC = void 0;
const process = __importStar(require("process"));
var PCC;
(function (PCC) {
    PCC["FILE"] = "\u001B[96m";
    PCC["LINE"] = "\u001B[93m";
    PCC["COL"] = "\u001B[93m";
    PCC["ERR"] = "\u001B[91m";
    PCC["WARN"] = "\u001B[93m";
    PCC["ERRCODE"] = "\u001B[90m";
    PCC["VCOMP"] = "\u001B[96m";
})(PCC || (exports.PCC = PCC = {}));
const RESET_PCC = '\u001b[0m';
class PrettyMsgEncoder {
    constructor(tsconfig_pretty) {
        this._isPretty = process.stdout.isTTY;
        if (tsconfig_pretty !== undefined) {
            this._isPretty &&= !!tsconfig_pretty;
        }
    }
    encode(type, val) {
        return this._isPretty ? `${type}${val}${RESET_PCC}` : `${val}`;
    }
    encodeFileLineChar(file, line, char) {
        return `${this.encode(PCC.FILE, file)}:${this.encode(PCC.LINE, line + 1)}:${this.encode(PCC.COL, char + 1)}`;
    }
    get ERROR() {
        return this.encode(PCC.ERR, 'error');
    }
    get WARNING() {
        return this.encode(PCC.WARN, 'warning');
    }
}
exports.PrettyMsgEncoder = PrettyMsgEncoder;
//# sourceMappingURL=PrettyMsgEncoder.js.map