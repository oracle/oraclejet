"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
let _BUILD_OPTIONS;
let _FILE_NAME;
let _VCOMP_CLASS_NAME;
function jsxTransformer(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    function visitor(ctx, sf) {
        var _a;
        _FILE_NAME = sf.fileName;
        if (_BUILD_OPTIONS["debug"])
            console.log(`${_FILE_NAME}: processing jsx types...`);
        const exportToAlias = (_a = _BUILD_OPTIONS.importMaps) === null || _a === void 0 ? void 0 : _a.exportToAlias;
        const visitor = (node) => {
            var _a;
            if (exportToAlias && ts.isClassDeclaration(node)) {
                _VCOMP_CLASS_NAME = undefined;
                const heritageClauses = node.heritageClauses;
                if (heritageClauses) {
                    for (let clause of heritageClauses) {
                        for (let type of clause.types) {
                            if (type.expression.getText() === exportToAlias.VComponent) {
                                const propsType = (_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
                                let propsTypeParams = "";
                                if ((propsType === null || propsType === void 0 ? void 0 : propsType.kind) === ts.SyntaxKind.TypeReference) {
                                    const propsTypeRef = propsType;
                                    if (propsTypeRef.typeArguments) {
                                        propsTypeParams = getGenericTypeParameters(propsTypeRef);
                                    }
                                }
                                _VCOMP_CLASS_NAME = node.name.getText();
                                return injectVpropsVariable(node, propsTypeParams);
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
function injectVpropsVariable(classNode, propsTypeParams) {
    var _a;
    const meta = (_a = _BUILD_OPTIONS.componentToMetadata) === null || _a === void 0 ? void 0 : _a[_VCOMP_CLASS_NAME];
    if (meta && (meta["propsClassName"] || meta.name)) {
        const vpropsClassName = `${meta.name ? "V" : ""}${meta["propsClassName"] || _VCOMP_CLASS_NAME + "Props"}`;
        meta["vpropsClassName"] = vpropsClassName;
        const vpropsProperty = ts.createProperty(undefined, ts.createModifiersFromModifierFlags(ts.ModifierFlags.Protected), "_vprops", ts.createToken(ts.SyntaxKind.QuestionToken), ts.createTypeReferenceNode(`${vpropsClassName}${propsTypeParams}`, undefined), undefined);
        const members = classNode.members.concat([vpropsProperty]);
        return ts.updateClassDeclaration(classNode, classNode.decorators, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, members);
    }
    return classNode;
}
function trimQuotes(text) {
    return text.slice(1, text.length - 1);
}
function getGenericTypeParameters(propsType) {
    let genericSignature = "<";
    for (let i = 0; i < propsType.typeArguments.length; i++) {
        const type = propsType.typeArguments[i];
        const typeName = type.getText();
        genericSignature += typeName;
        if (type.typeArguments && type.typeArguments.length) {
            genericSignature += getGenericTypeParameters(type);
        }
        if (i < propsType.typeArguments.length - 1) {
            genericSignature += ", ";
        }
    }
    genericSignature += ">";
    return genericSignature;
}
