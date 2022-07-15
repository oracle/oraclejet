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
exports.Template = void 0;
const _ = __importStar(require("underscore"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Template {
    constructor(filepath) {
        this.path = filepath;
        this.cache = {};
        this.settings = {
            evaluate: /<\?js([\s\S]+?)\?>/g,
            interpolate: /<\?js=([\s\S]+?)\?>/g,
            escape: /<\?js~([\s\S]+?)\?>/g
        };
    }
    load(file) {
        return _.template(fs.readFileSync(file, 'utf8'), this.settings);
    }
    partial(file, data) {
        file = path.resolve(this.path, file);
        if (!(file in this.cache)) {
            this.cache[file] = this.load(file);
        }
        return this.cache[file].call(this, data);
    }
    render(file, data) {
        var content = this.partial(file, data);
        return content;
    }
}
exports.Template = Template;
//# sourceMappingURL=template.js.map