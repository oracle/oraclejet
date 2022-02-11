"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const ts = __importStar(require("typescript"));
const DecoratorUtils_1 = require("./utils/DecoratorUtils");
const _DT_DECORATORS = new Set(['method', 'consumedBindings', 'providedBindings']);
function decoratorTransformer(buildOptions) {
    function visitor(ctx, sf) {
        var _a;
        if (!buildOptions.componentToMetadata) {
            return (node) => {
                return node;
            };
        }
        if (buildOptions['debug'])
            console.log(`${sf.fileName}: processing decorators...`);
        const aliasToExport = (_a = buildOptions.importMaps) === null || _a === void 0 ? void 0 : _a.aliasToExport;
        const visitor = (node) => {
            if (aliasToExport && node.decorators) {
                let updatedDecorators = removeDtDecorators(node, aliasToExport);
                if (updatedDecorators.length === 0) {
                    updatedDecorators = undefined;
                }
                if (!updatedDecorators || updatedDecorators.length < node.decorators.length) {
                    if (ts.isClassDeclaration(node)) {
                        node = ts.factory.updateClassDeclaration(node, updatedDecorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, node.members);
                    }
                    else if (ts.isMethodDeclaration(node)) {
                        return ts.factory.updateMethodDeclaration(node, updatedDecorators, node.modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
                    }
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
function removeDtDecorators(node, aliasToExport) {
    return node.decorators.filter((decorator) => {
        const decoratorName = aliasToExport[DecoratorUtils_1.getDecoratorName(decorator)];
        return !_DT_DECORATORS.has(decoratorName);
    });
}
//# sourceMappingURL=decoratorTransformer.js.map