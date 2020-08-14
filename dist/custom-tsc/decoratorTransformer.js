"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const DecoratorUtils_1 = require("./utils/DecoratorUtils");
const _DT_DECORATORS = new Set([
    "method",
    "rootProperty",
    "_writeback",
    "event",
]);
let _BUILD_OPTIONS;
let _FILE_NAME;
let _ALIAS_TO_EXPORT;
function decoratorTransformer(buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    function visitor(ctx, sf) {
        var _a;
        _FILE_NAME = sf.fileName;
        if (_BUILD_OPTIONS["debug"])
            console.log(`${_FILE_NAME}: processing decorators...`);
        _ALIAS_TO_EXPORT = (_a = _BUILD_OPTIONS.importMaps) === null || _a === void 0 ? void 0 : _a.aliasToExport;
        const visitor = (node) => {
            if (_ALIAS_TO_EXPORT && node.decorators) {
                const updatedDecorators = removeDtDecorators(node);
                if (updatedDecorators.length === 0) {
                    node.decorators = undefined;
                }
                else if (updatedDecorators.length < node.decorators.length) {
                    node.decorators = ts.createNodeArray(updatedDecorators);
                }
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return (sf) => ts.visitNode(sf, visitor(ctx, sf));
    };
}
exports.default = decoratorTransformer;
function removeDtDecorators(node) {
    return node.decorators.filter(decorator => {
        const decoratorName = _ALIAS_TO_EXPORT[DecoratorUtils_1.getDecoratorName(decorator)];
        return !_DT_DECORATORS.has(decoratorName);
    });
}
