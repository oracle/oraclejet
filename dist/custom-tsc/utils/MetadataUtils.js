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
exports.updateRtExtensionMetadata = exports.pruneMetadata = exports.pruneCompilerMetadata = exports.updateCompilerClassMetadata = exports.updateCompilerPropsMetadata = exports.walkTypeNodeMembers = exports.addMetadataToClassNode = exports.getDtMetadata = exports.getGenericTypeParameters = exports.stringToJS = exports.writebackCallbackToProperty = void 0;
const ts = __importStar(require("typescript"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
function writebackCallbackToProperty(property) {
    if (/^on[A-Z].*Changed$/.test(property)) {
        return (property[2].toLowerCase() + property.substring(3, property.length - 7));
    }
    return null;
}
exports.writebackCallbackToProperty = writebackCallbackToProperty;
function stringToJS(memberName, type, value, metaUtilObj) {
    try {
        switch (type) {
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.NumericLiteral:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
                return JSON.parse(value);
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.ArrayLiteralExpression:
            case ts.SyntaxKind.AsExpression:
                return new Function("return " + value)();
            default:
                return undefined;
        }
    }
    catch (ex) {
        console.log(`${metaUtilObj.componentClassName}: Unable to convert the default value '${value}' to JSON for property '${memberName}'.`);
        return undefined;
    }
}
exports.stringToJS = stringToJS;
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
exports.getGenericTypeParameters = getGenericTypeParameters;
const _METADATA_TAG = "ojmetadata";
function getDtMetadata(objWithJsDoc, metaUtilObj) {
    let dt = {};
    let tags = ts.getJSDocTags(objWithJsDoc);
    tags.forEach((tag) => {
        if (tag.tagName.getText() === _METADATA_TAG) {
            const [mdKey, mdVal] = getDtMetadataNameValue(tag, metaUtilObj);
            let isClassMetadata = ts.isClassDeclaration(objWithJsDoc);
            if ((isClassMetadata && ["version", "jetVersion"].indexOf(mdKey) > -1) ||
                !dt[mdKey]) {
                if (mdKey === "styleClasses") {
                    let styleClasses = mdVal;
                    styleClasses.forEach((sc) => {
                        if (sc.extension) {
                            delete sc.extension["jet"];
                            if (Object.getOwnPropertyNames(sc.extension).length == 0) {
                                delete sc.extension;
                            }
                        }
                    });
                }
                dt[mdKey] = mdVal;
            }
            else {
                if (!Array.isArray(dt[mdKey])) {
                    dt[mdKey] = [dt[mdKey]];
                }
                dt[mdKey].push(mdVal);
            }
        }
    });
    return dt;
}
exports.getDtMetadata = getDtMetadata;
function addMetadataToClassNode(classNode, metadata) {
    if (Object.keys(metadata).length === 0) {
        return classNode;
    }
    const metadataNode = metadataToAstNodes(metadata);
    const metadataProperty = ts.factory.createPropertyDeclaration(undefined, ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), "metadata", undefined, undefined, metadataNode);
    const members = classNode.members.concat([metadataProperty]);
    return ts.factory.updateClassDeclaration(classNode, classNode.decorators, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, members);
}
exports.addMetadataToClassNode = addMetadataToClassNode;
function walkTypeNodeMembers(typeNode, checker, callback) {
    const processMembers = function (symbol, callback) {
        const members = symbol === null || symbol === void 0 ? void 0 : symbol.members;
        if (members) {
            members.forEach((memberSymbol, memberKey) => {
                callback(memberSymbol, memberKey);
            });
        }
    };
    const typeAtLoc = checker.getTypeAtLocation(typeNode);
    if (typeAtLoc.isIntersection()) {
        const intersectionTypes = typeAtLoc.types;
        for (let type of intersectionTypes) {
            processMembers(type.getSymbol(), callback);
        }
    }
    else {
        processMembers(typeAtLoc.getSymbol(), callback);
    }
}
exports.walkTypeNodeMembers = walkTypeNodeMembers;
function updateCompilerPropsMetadata(propsAsType, declaration, propsClassName, readOnlyProps, metaUtilObj) {
    if (propsAsType === null || propsAsType === void 0 ? void 0 : propsAsType.typeArguments) {
        metaUtilObj.fullMetadata["propsTypeParams"] = getGenericTypeParameters(propsAsType);
    }
    if (ts.isClassDeclaration(declaration) ||
        ts.isTypeAliasDeclaration(declaration) ||
        ts.isInterfaceDeclaration(declaration)) {
        const propsClassNode = declaration;
        const genericsInfo = TypeUtils.getGenericsAndTypeParameters(propsClassNode, true);
        metaUtilObj.fullMetadata["propsClassTypeParamsDeclaration"] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsDeclaration;
        metaUtilObj.fullMetadata["propsClassTypeParams"] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParams;
        metaUtilObj.fullMetadata["propsTypeParamsAny"] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParamsAny;
    }
    metaUtilObj.fullMetadata["propsClassName"] = propsClassName;
    metaUtilObj.fullMetadata["readOnlyProps"] = readOnlyProps;
}
exports.updateCompilerPropsMetadata = updateCompilerPropsMetadata;
function updateCompilerClassMetadata(classNode, metaUtilObj) {
    if (classNode.typeParameters) {
        const genericsInfo = TypeUtils.getGenericsAndTypeParameters(classNode);
        metaUtilObj.fullMetadata["classTypeParamsDeclaration"] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsDeclaration;
        metaUtilObj.fullMetadata["classTypeParams"] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParams;
    }
}
exports.updateCompilerClassMetadata = updateCompilerClassMetadata;
function pruneCompilerMetadata(metaUtilObj) {
    delete metaUtilObj.fullMetadata["classTypeParams"];
    delete metaUtilObj.fullMetadata["classTypeParamsDeclaration"];
    delete metaUtilObj.fullMetadata["propsTypeParams"];
    delete metaUtilObj.fullMetadata["propsClassTypeParamsDeclaration"];
    delete metaUtilObj.fullMetadata["propsClassTypeParams"];
    delete metaUtilObj.fullMetadata["propsTypeParamsAny"];
    delete metaUtilObj.fullMetadata["ojLegacyVComponent"];
    delete metaUtilObj.fullMetadata["propsClassName"];
    delete metaUtilObj.fullMetadata["readOnlyProps"];
    pruneMetadata(metaUtilObj.fullMetadata.properties);
    pruneMetadata(metaUtilObj.fullMetadata.events);
}
exports.pruneCompilerMetadata = pruneCompilerMetadata;
function pruneMetadata(metadata) {
    if (metadata && typeof metadata == "object") {
        delete metadata["reftype"];
        delete metadata["optional"];
        delete metadata["isArrayOfObject"];
        delete metadata["evnDetailTypeParamsDeclaration"];
        delete metadata["evnDetailNameTypeParams"];
        for (let prop in metadata) {
            pruneMetadata(metadata[prop]);
        }
    }
}
exports.pruneMetadata = pruneMetadata;
function updateRtExtensionMetadata(name, value, metaUtilObj) {
    if (!metaUtilObj.rtMetadata.extension) {
        metaUtilObj.rtMetadata.extension = {};
    }
    metaUtilObj.rtMetadata.extension[name] = value;
}
exports.updateRtExtensionMetadata = updateRtExtensionMetadata;
function getDtMetadataNameValue(tag, metaUtilObj) {
    const comment = tag.comment.trim();
    const mdkeySep = comment.indexOf(" ");
    let mdKey, mdVal;
    if (mdkeySep > 0) {
        mdKey = comment.substr(0, mdkeySep);
        mdVal = comment.substr(mdkeySep + 1);
        try {
            mdVal = new Function("return " + mdVal)();
        }
        catch (e) {
            console.log(`${metaUtilObj.componentClassName}: Malformed metadata value ${mdVal} for key ${mdKey}.`);
        }
    }
    else {
        mdKey = comment;
        mdVal = true;
    }
    return [mdKey, mdVal];
}
function metadataToAstNodes(value) {
    if (Array.isArray(value)) {
        return ts.factory.createArrayLiteralExpression(value.map((item) => metadataToAstNodes(item)));
    }
    switch (typeof value) {
        case "string":
            return ts.factory.createStringLiteral(value);
        case "number":
            return ts.factory.createNumericLiteral(String(value));
        case "boolean":
            return value ? ts.factory.createTrue() : ts.factory.createFalse();
        case "object":
            if (!value) {
                return ts.factory.createNull();
            }
            const keys = Object.keys(value);
            return ts.factory.createObjectLiteralExpression(keys.map((key) => {
                return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), key === "_DEFAULTS"
                    ? ts.factory.createIdentifier(value[key])
                    : metadataToAstNodes(value[key]));
            }));
    }
}
