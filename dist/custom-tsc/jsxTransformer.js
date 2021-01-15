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
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
function jsxTransformer(program, buildOptions) {
    function visitor(ctx, sf) {
        var _a;
        if (!buildOptions.componentToMetadata) {
            return (node) => {
                return node;
            };
        }
        if (buildOptions["debug"])
            console.log(`${sf.fileName}: processing jsx types...`);
        const exportToAlias = (_a = buildOptions.importMaps) === null || _a === void 0 ? void 0 : _a.exportToAlias;
        const visitor = (node) => {
            var _a;
            if (exportToAlias && ts.isClassDeclaration(node)) {
                let vcompClassName = undefined;
                const heritageClauses = node.heritageClauses;
                if (heritageClauses) {
                    for (let clause of heritageClauses) {
                        for (let type of clause.types) {
                            if (type.expression.getText() === exportToAlias.ElementVComponent) {
                                const propsType = (_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
                                let propsTypeParams = "";
                                if ((propsType === null || propsType === void 0 ? void 0 : propsType.kind) === ts.SyntaxKind.TypeReference) {
                                    const propsTypeRef = propsType;
                                    if (propsTypeRef.typeArguments) {
                                        propsTypeParams = MetaUtils.getGenericTypeParameters(propsTypeRef);
                                    }
                                }
                                vcompClassName = node.name.getText();
                                return injectVpropsVariable(node, propsTypeParams, vcompClassName, buildOptions.componentToMetadata);
                            }
                        }
                    }
                }
                return node;
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return (sf) => ts.visitNode(sf, visitor(ctx, sf));
    };
}
exports.default = jsxTransformer;
function injectVpropsVariable(classNode, propsTypeParams, vcompClassName, componentToMetadata) {
    const meta = componentToMetadata === null || componentToMetadata === void 0 ? void 0 : componentToMetadata[vcompClassName];
    if (meta && (meta["propsClassName"] || meta.name)) {
        const vpropsClassName = `${meta.name ? "V" : ""}${meta["propsClassName"] || vcompClassName + "Props"}`;
        meta["vpropsClassName"] = vpropsClassName;
        const vpropsProperty = ts.factory.createPropertyDeclaration(undefined, ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Protected), "_vprops", ts.factory.createToken(ts.SyntaxKind.QuestionToken), ts.factory.createTypeReferenceNode(`${vpropsClassName}${propsTypeParams}`, undefined), undefined);
        const members = classNode.members.concat([vpropsProperty]);
        return ts.factory.updateClassDeclaration(classNode, classNode.decorators, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, members);
    }
    return classNode;
}
function trimQuotes(text) {
    return text.slice(1, text.length - 1);
}
