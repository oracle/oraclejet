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
exports.default = decoratorTransformer;
const ts = __importStar(require("typescript"));
const DecoratorUtils_1 = require("./utils/DecoratorUtils");
const _DT_DECORATORS = new Set([
    'method',
    'consumedBindings',
    'providedBindings',
    'consumedContexts'
]);
function decoratorTransformer(buildOptions) {
    function visitor(ctx, sf) {
        if (!buildOptions.componentToMetadata) {
            return (node) => {
                return node;
            };
        }
        if (buildOptions['debug'])
            console.log(`${sf.fileName}: processing decorators...`);
        const aliasToExport = buildOptions.importMaps?.aliasToExport;
        const visitor = (node) => {
            if (aliasToExport && ts.canHaveDecorators(node) && ts.getDecorators(node)?.length > 0) {
                let updatedModifiers = removeDtDecoratorsFromModifiers(node, aliasToExport);
                if (updatedModifiers.length === 0) {
                    updatedModifiers = undefined;
                }
                if (!updatedModifiers || updatedModifiers.length < node.modifiers.length) {
                    if (ts.isClassDeclaration(node)) {
                        node = ts.factory.updateClassDeclaration(node, updatedModifiers, node.name, node.typeParameters, node.heritageClauses, node.members);
                    }
                    else if (ts.isMethodDeclaration(node)) {
                        return ts.factory.updateMethodDeclaration(node, updatedModifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
                    }
                }
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return ((sf) => ts.visitNode(sf, visitor(ctx, sf)));
    };
}
function removeDtDecoratorsFromModifiers(node, aliasToExport) {
    return node.modifiers?.filter((modLike) => {
        if (ts.isModifier(modLike)) {
            return true;
        }
        else {
            return !_DT_DECORATORS.has(aliasToExport[(0, DecoratorUtils_1.getDecoratorName)(modLike)]);
        }
    });
}
//# sourceMappingURL=decoratorTransformer.js.map