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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const _ = __importStar(require("underscore"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Underscore template helper.
 * @param {string} filepath - Templates directory.
 */
class Template {
    constructor(filepath) {
        this.path = filepath;
        this.cache = {};
        // override default template tag settings
        this.settings = {
            evaluate: /<\?js([\s\S]+?)\?>/g,
            interpolate: /<\?js=([\s\S]+?)\?>/g,
            escape: /<\?js~([\s\S]+?)\?>/g
        };
    }
    /** Loads template from given file.
     * @param {string} file - Template filename.
     * @return {function} Returns template closure.
     */
    load(file) {
        return _.template(fs.readFileSync(file, 'utf8'), this.settings);
    }
    /**
     * Renders template using given data.
     * This is low-level function, for rendering full templates use {@link Template.render()}.
     * @param {string} file - Template filename.
     * @param {object} data - Template variables (doesn't have to be object, but passing variables dictionary is best way and most common use).
     * @return {string} Rendered template.
     */
    partial(file, data) {
        file = path.resolve(this.path, file);
        // load template into cache
        if (!(file in this.cache)) {
            this.cache[file] = this.load(file);
        }
        // keep template helper context
        return this.cache[file].call(this, data);
    }
    /**
     * Renders template with given data.
     * This method automaticaly applies layout if set.
     * @param {string} file - Template filename.
     * @param {object} data - Template variables (doesn't have to be object, but passing variables dictionary is best way and most common use).
     * @return {string} Rendered template.
     */
    render(file, data) {
        var content = this.partial(file, data);
        return content;
    }
}
exports.Template = Template;
//# sourceMappingURL=template.js.map