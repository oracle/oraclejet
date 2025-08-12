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
const DecoratorUtils_1 = require("./shared/DecoratorUtils");
const _DT_DECORATORS = new Set([
    'method',
    'consumedBindings',
    'providedBindings',
    'consumedContexts'
]);
/**
 * Transformer run after the metadata transformer and before the code
 * is compiled to JavaScript so we can remove design time only decorators,
 * removing any run time footprints.
 * @param program
 * @param buildOptions
 */
function decoratorTransformer(buildOptions) {
    function visitor(ctx, sf) {
        // If this file doesn't contain custom element VComponents, we can skip
        if (!buildOptions.componentToMetadata) {
            return (node) => {
                return node;
            };
        }
        if (buildOptions['debug'])
            console.log(`${sf.fileName}: processing decorators...`);
        const aliasToExport = buildOptions.importMaps?.aliasToExport;
        // As of TypeScript 4.8:
        //  - both 'decorators' and 'modifiers' properties are deprecated on the base ts.Node interface
        //  - Node sub-types selectively expose a 'modifiers' property of type ts.NodeArray<ts.ModifierLike>,
        //    where ts.ModifierLike is a union of ts.Modifier | ts.Decorator
        //
        // Therefore, the logic to remove DT-only decorators was modified to update the appropriate
        // Declaration node's "modifiers".
        const visitor = (node) => {
            if (aliasToExport && ts.canHaveDecorators(node) && ts.getDecorators(node)?.length > 0) {
                let updatedModifiers = removeDtDecoratorsFromModifiers(node, aliasToExport);
                // If updatedModifiers is now an empty array (i.e., "modifiers" consisted solely
                // of DT-only decorators), then reset the param to undefined to ensure that the
                // decorate() call is removed in the emitted JS.
                if (updatedModifiers.length === 0) {
                    updatedModifiers = undefined;
                }
                // If our filtering reduced the number of "ModifierLike" stuff, update the node
                if (!updatedModifiers || updatedModifiers.length < node.modifiers.length) {
                    if (ts.isClassDeclaration(node)) {
                        // Remove DT class decorators and continue visiting
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
            // keep all Modifiers
            return true;
        }
        else {
            // otherwise must be a Decorator -> keep if NOT in the list of DT decorators
            return !_DT_DECORATORS.has(aliasToExport[(0, DecoratorUtils_1.getDecoratorName)(modLike)]);
        }
    });
}
//# sourceMappingURL=decoratorTransformer.js.map