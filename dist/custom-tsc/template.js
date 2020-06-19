"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const fs = require("fs");
const path = require("path");
class Template {
    constructor(filepath) {
        this.path = filepath;
        this.cache = {};
        this.settings = {
            'evaluate': /<\?js([\s\S]+?)\?>/g,
            'interpolate': /<\?js=([\s\S]+?)\?>/g,
            'escape': /<\?js~([\s\S]+?)\?>/g
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
    ;
    render(file, data) {
        var content = this.partial(file, data);
        return content;
    }
}
exports.Template = Template;
;
