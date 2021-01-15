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
exports.isClassDeclaration = exports.possibleComplexProperty = exports.getAllMetadataForDeclaration = exports.getComplexPropertyMetadata = exports.getPropertyType = exports.isGenericTypeParameter = exports.getNodeDeclaration = exports.getTypeNameNoGenerics = exports.getTypeReferenceNodeSignature = exports.getUnionTypeNodeSignature = exports.getGenericsAndTypeParameters = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
function getGenericsAndTypeParameters(node, isPropsClass) {
    var _a;
    let retVal;
    let typeParams = [];
    let typeParamsExpression = [];
    let jsxTypeParam = [];
    (_a = node.typeParameters) === null || _a === void 0 ? void 0 : _a.forEach((tpn) => {
        typeParams.push(tpn.name.getText());
        typeParamsExpression.push(tpn.getText());
        if (isPropsClass) {
            jsxTypeParam.push("any");
        }
    });
    if (typeParamsExpression.length > 0) {
        retVal = {
            genericsDeclaration: `<${typeParamsExpression.join()}>`,
            genericsTypeParams: `<${typeParams.join()}>`,
        };
        if (isPropsClass) {
            retVal.genericsTypeParamsAny = `<${jsxTypeParam.join()}>`;
        }
    }
    return retVal;
}
exports.getGenericsAndTypeParameters = getGenericsAndTypeParameters;
function getUnionTypeNodeSignature(unionNode, metaUtilObj) {
    let typeObj = { type: "string" };
    const unionNodeSymbol = metaUtilObj.typeChecker.getTypeAtLocation(unionNode);
    const strType = metaUtilObj.typeChecker.typeToString(unionNodeSymbol);
    if (strType === "any") {
        return { type: "any" };
    }
    let enumValues = getEnumsFromUnion(unionNode);
    if (enumValues) {
        typeObj["enumValues"] = enumValues.filter((enumVal) => enumVal !== null);
        if (enumValues.some((enumVal) => enumVal === null)) {
            typeObj.type = "string|null";
        }
    }
    else {
        let regTypes = new Set();
        let reftypes = new Set();
        let allEnums = new Set();
        unionNode.types.forEach((typeNode) => {
            let kind = typeNode.kind;
            switch (kind) {
                case ts.SyntaxKind.StringKeyword:
                    regTypes.add("string");
                    reftypes.add("string");
                    break;
                case ts.SyntaxKind.NumberKeyword:
                    regTypes.add("number");
                    reftypes.add("number");
                    break;
                case ts.SyntaxKind.BooleanKeyword:
                    regTypes.add("boolean");
                    reftypes.add("boolean");
                    break;
                case ts.SyntaxKind.NullKeyword:
                    regTypes.add("null");
                    reftypes.add("null");
                    break;
                case ts.SyntaxKind.ObjectKeyword:
                    regTypes.add("object");
                    reftypes.add("object");
                    break;
                case ts.SyntaxKind.ArrayType:
                    const data = getArrayTypeNodeSignature(typeNode, metaUtilObj);
                    regTypes.add(data.type);
                    if (data.reftype) {
                        reftypes.add(data.reftype);
                    }
                    else {
                        reftypes.add(data.type);
                    }
                    break;
                case ts.SyntaxKind.TypeReference:
                    const refTypeNode = typeNode;
                    const refTypes = getTypeReferenceNodeSignature(refTypeNode, false, metaUtilObj);
                    if (refTypes.enumValues) {
                        refTypes.enumValues.forEach((val) => allEnums.add(val));
                    }
                    regTypes.add(refTypes.type);
                    reftypes.add(refTypes["reftype"]);
                    break;
                case ts.SyntaxKind.ParenthesizedType:
                    const parTypeNode = typeNode;
                    if (parTypeNode.type.kind === ts.SyntaxKind.FunctionType) {
                        regTypes.add("function");
                        reftypes.add(`( ${parTypeNode.type.getText()} )`);
                    }
                    break;
                case ts.SyntaxKind.TypeLiteral:
                    const typeLiteral = typeNode;
                    regTypes.add("object");
                    reftypes.add(typeLiteral.getText());
                    break;
                case ts.SyntaxKind.LiteralType:
                    const literal = typeNode.literal;
                    if ((literal === null || literal === void 0 ? void 0 : literal.kind) === ts.SyntaxKind.StringLiteral) {
                        allEnums.add(literal.text);
                        regTypes.add("string");
                        reftypes.add("string");
                    }
                    else if ((literal === null || literal === void 0 ? void 0 : literal.kind) === ts.SyntaxKind.NullKeyword) {
                        regTypes.add("null");
                        reftypes.add("null");
                    }
                    break;
                case ts.SyntaxKind.TypeOperator: {
                    let regTypeVal = "any";
                    const typeOperatorNode = typeNode;
                    const operator = typeOperatorNode.operator.valueOf();
                    let strOperator = "";
                    if (operator === ts.SyntaxKind.KeyOfKeyword) {
                        strOperator = "keyof";
                        regTypeVal = "string | number";
                    }
                    if (operator === ts.SyntaxKind.UniqueKeyword) {
                        strOperator = "unique";
                    }
                    if (operator === ts.SyntaxKind.ReadonlyKeyword) {
                        strOperator = "readonly";
                    }
                    const typeOfOperator = typeOperatorNode.type.getText();
                    regTypes.add(regTypeVal);
                    reftypes.add(`${strOperator} ${typeOfOperator}`);
                    break;
                }
                default:
                    regTypes.add(strType);
                    reftypes.add(strType);
                    break;
            }
        });
        let iter = regTypes.values();
        if (regTypes.has("any")) {
            typeObj["type"] = "any";
        }
        else {
            enumValues = [];
            for (let val of iter) {
                enumValues.push(val);
            }
            let result = enumValues.filter((type) => type.trim() !== "null");
            if (result.length == 1 && result[0] === "Array<object>") {
                typeObj.isArrayOfObject = true;
            }
            typeObj["type"] = enumValues.join("|");
        }
        iter = reftypes.values();
        enumValues = [];
        for (let val of iter) {
            enumValues.push(val);
        }
        typeObj["reftype"] = enumValues.join("|");
        if (allEnums.size > 0) {
            iter = allEnums.values();
            enumValues = [];
            for (let val of iter) {
                enumValues.push(val);
            }
            typeObj.enumValues = enumValues;
        }
    }
    return typeObj;
}
exports.getUnionTypeNodeSignature = getUnionTypeNodeSignature;
function getTypeReferenceNodeSignature(node, isPropSignature, metaUtilObj) {
    var _a, _b, _c, _d, _e;
    const typeRefNode = node;
    let refNodeTypeName = typeRefNode.typeName.getText();
    const typeObject = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
    const strType = metaUtilObj.typeChecker.typeToString(typeObject);
    if (typeRefNode.typeArguments) {
        refNodeTypeName += MetaUtils.getGenericTypeParameters(typeRefNode);
    }
    let typeObj = {
        type: strType,
        reftype: refNodeTypeName,
    };
    let symbol, kind;
    let declaration;
    if (typeObject.symbol) {
        symbol = typeObject.symbol;
        declaration = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
        kind = declaration.kind;
    }
    else if (typeObject.aliasSymbol) {
        symbol = typeObject.aliasSymbol;
        declaration = (_b = symbol.declarations) === null || _b === void 0 ? void 0 : _b[0];
        declaration = declaration.type;
        kind = declaration.kind;
    }
    if (!symbol) {
        return typeObj;
    }
    switch (kind) {
        case ts.SyntaxKind.FunctionType:
            typeObj = { type: "function", reftype: refNodeTypeName };
            break;
        case ts.SyntaxKind.ArrayType:
            typeObj = getArrayTypeNodeSignature(declaration, metaUtilObj);
            typeObj.reftype = refNodeTypeName;
            break;
        case ts.SyntaxKind.UnionType:
            typeObj = getArrayTypeNodeSignature(declaration, metaUtilObj);
            typeObj = getUnionTypeNodeSignature(declaration, metaUtilObj);
            typeObj.reftype = refNodeTypeName;
            break;
        case ts.SyntaxKind.InterfaceDeclaration:
            if (symbol.name === "Array") {
                if (typeRefNode.typeArguments) {
                    let typevars = "";
                    let typearg = typeRefNode.typeArguments[0];
                    if (typearg.kind === ts.SyntaxKind.TypeReference) {
                        let types = getTypeReferenceNodeSignature(typearg, false, metaUtilObj);
                        typeObj["reftype"] = `Array<${(_c = types.reftype) !== null && _c !== void 0 ? _c : types.type}>`;
                        typeObj["type"] = `Array<${types.type}>`;
                        if (types.reftype && types.type === "object") {
                            typeObj.isArrayOfObject = true;
                        }
                        return typeObj;
                    }
                    else if (typearg.kind === ts.SyntaxKind.UnionType) {
                        let types = getUnionTypeNodeSignature(typearg, metaUtilObj);
                        typeObj["reftype"] = `Array<${(_d = types.reftype) !== null && _d !== void 0 ? _d : types.type}>`;
                        typeObj["type"] = `Array<${types.type}>`;
                        let arrTypeNodes = typearg.types.filter(nullFilter);
                        if (arrTypeNodes.length == 1) {
                            if (arrTypeNodes[0].kind ==
                                ts.SyntaxKind.TypeLiteral) {
                                typeObj.isArrayOfObject = true;
                            }
                            else if (arrTypeNodes[0].kind ==
                                ts.SyntaxKind.TypeReference) {
                                let types = getTypeReferenceNodeSignature(arrTypeNodes[0], false, metaUtilObj);
                                if (types.reftype && types.type === "object") {
                                    typeObj.isArrayOfObject = true;
                                }
                            }
                        }
                        return typeObj;
                    }
                    else {
                        typevars = typearg.getText();
                    }
                    typeObj["reftype"] = `Array<${typevars}>`;
                    if (["string", "number", "boolean"].indexOf(typevars.toLowerCase()) > -1) {
                        typeObj["type"] = `Array<${typevars.toLowerCase()}>`;
                    }
                    else {
                        typeObj["type"] = "Array<object>";
                        if (typearg.kind === ts.SyntaxKind.TypeLiteral) {
                            typeObj.isArrayOfObject = true;
                        }
                    }
                }
                else {
                    if (typeObject.aliasSymbol) {
                        symbol = typeObject.aliasSymbol;
                        declaration = (_e = symbol.declarations) === null || _e === void 0 ? void 0 : _e[0];
                        declaration = declaration.type;
                        typeObj = {
                            type: getArrayTypeNodeSignature(declaration, metaUtilObj).type,
                            reftype: refNodeTypeName,
                        };
                    }
                }
            }
            else if (symbol.name === "Function") {
                typeObj["type"] = "function";
            }
            else if (["Number", "String", "Boolean", "Object"].indexOf(symbol.name) > -1) {
                typeObj["reftype"] = strType;
                typeObj["type"] = strType.toLowerCase();
            }
            else if (symbol.name === "Promise") {
                typeObj["type"] = "Promise";
            }
            else {
                typeObj["type"] =
                    (isPropSignature && symbolHasPropertySignatureMembers(symbol)) ||
                        isDomType(typeObject)
                        ? strType
                        : "object";
            }
            break;
        case ts.SyntaxKind.TypeParameter:
            typeObj["type"] = "any";
            typeObj["reftype"] = declaration.getText();
            break;
        case ts.SyntaxKind.EnumDeclaration:
            const enumDeclaration = declaration;
            const members = enumDeclaration.members;
            let enums = [];
            const initializer = members[0].initializer;
            if (initializer && initializer.kind === ts.SyntaxKind.StringLiteral) {
                typeObj["type"] = "string";
                members.forEach((member) => {
                    enums.push(metaUtilObj.typeChecker.getConstantValue(member));
                });
                typeObj["enumValues"] = enums;
            }
            else {
                typeObj["type"] = "number";
            }
            break;
        default:
            typeObj["type"] =
                (isPropSignature && symbolHasPropertySignatureMembers(symbol)) ||
                    isDomType(typeObject)
                    ? strType
                    : "object";
            break;
    }
    return typeObj;
}
exports.getTypeReferenceNodeSignature = getTypeReferenceNodeSignature;
function getTypeNameNoGenerics(node) {
    var _a;
    return (_a = node.typeName) === null || _a === void 0 ? void 0 : _a.getText();
}
exports.getTypeNameNoGenerics = getTypeNameNoGenerics;
function getNodeDeclaration(node, checker) {
    let declaration;
    const typeAtLoc = checker.getTypeAtLocation(node);
    declaration = typeAtLoc.aliasSymbol
        ? typeAtLoc.aliasSymbol.declarations[0]
        : typeAtLoc.symbol.declarations[0];
    return declaration;
}
exports.getNodeDeclaration = getNodeDeclaration;
function isGenericTypeParameter(symbol) {
    return (symbol.declarations &&
        symbol.declarations[0].kind === ts.SyntaxKind.TypeParameter);
}
exports.isGenericTypeParameter = isGenericTypeParameter;
function getPropertyType(propDeclaration) {
    let typeName;
    const propName = propDeclaration.name.getText();
    const typeRef = propDeclaration.type;
    if (typeRef) {
        const kind = typeRef.kind;
        switch (kind) {
            case ts.SyntaxKind.TypeReference:
                typeName = typeRef.typeName.getText();
                if (typeName === "Array" && propName === MetaTypes.DEFAULT_SLOT_PROP) {
                    typeName = typeRef.typeArguments[0].getText();
                }
                break;
            case ts.SyntaxKind.ArrayType:
                typeName = typeRef.elementType.getText();
                break;
            default:
                break;
        }
    }
    return typeName;
}
exports.getPropertyType = getPropertyType;
function getComplexPropertyMetadata(memberSymbol, type, includeDtMetadata, stack, metaUtilObj) {
    var _a;
    const returnObj = getComplexPropertyHelper(memberSymbol, type, new Set(), includeDtMetadata, stack, metaUtilObj);
    if (((_a = returnObj.circularRefs) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        return { circularRefs: { type: returnObj.circularRefs[0] } };
    }
    return returnObj.metadata;
}
exports.getComplexPropertyMetadata = getComplexPropertyMetadata;
function getAllMetadataForDeclaration(declarationWithType, includeDtMetadata, metaUtilObj) {
    var _a;
    let metadata = { type: "any" };
    if (includeDtMetadata) {
        Object.assign(metadata, MetaUtils.getDtMetadata(declarationWithType, metaUtilObj));
    }
    if (!declarationWithType.type) {
        if (ts.isPropertyDeclaration(declarationWithType)) {
            console.log(`${metaUtilObj.componentClassName}: No type provided, defaulting to 'any' for property '${(_a = declarationWithType["name"]) === null || _a === void 0 ? void 0 : _a.getText()}'.`);
        }
        return metadata;
    }
    const declarationType = declarationWithType.type;
    const kind = declarationType.kind;
    const symbolType = metaUtilObj.typeChecker.getTypeAtLocation(declarationType);
    const strType = metaUtilObj.typeChecker.typeToString(symbolType);
    let isPropSignature = ts.isPropertySignature(declarationWithType) ||
        ts.isPropertyDeclaration(declarationWithType);
    let typeObj;
    switch (kind) {
        case ts.SyntaxKind.TypeReference:
            typeObj = getTypeReferenceNodeSignature(declarationType, isPropSignature, metaUtilObj);
            break;
        case ts.SyntaxKind.FunctionType:
            typeObj = getFunctionTypeNodeSignature(declarationType, metaUtilObj);
            break;
        case ts.SyntaxKind.ArrayType:
            typeObj = getArrayTypeNodeSignature(declarationType, metaUtilObj);
            break;
        case ts.SyntaxKind.TypeLiteral:
            typeObj = { type: "object" };
            break;
        case ts.SyntaxKind.UnionType:
            typeObj = getUnionTypeNodeSignature(declarationType, metaUtilObj);
            break;
        case ts.SyntaxKind.StringKeyword:
        case ts.SyntaxKind.NumberKeyword:
        case ts.SyntaxKind.BooleanKeyword:
        default:
            typeObj = { type: strType };
            break;
    }
    if (!includeDtMetadata) {
        delete typeObj.reftype;
        delete typeObj.optional;
    }
    return Object.assign({}, metadata, typeObj);
}
exports.getAllMetadataForDeclaration = getAllMetadataForDeclaration;
const _NON_OBJECT_TYPES = new Set([
    "Array",
    "Function",
    "boolean",
    "number",
    "string",
]);
function possibleComplexProperty(symbolType, type, checkForDt) {
    let iscomplex = true;
    if (_NON_OBJECT_TYPES.has(type) ||
        isDomType(symbolType) ||
        isClassDeclaration(symbolType) ||
        type.indexOf("|") > -1) {
        iscomplex = false;
        if (checkForDt && type.indexOf("Array") > -1) {
            iscomplex = true;
        }
    }
    return iscomplex;
}
exports.possibleComplexProperty = possibleComplexProperty;
function isClassDeclaration(symbolType) {
    var _a, _b;
    if ((_a = symbolType.symbol) === null || _a === void 0 ? void 0 : _a.valueDeclaration) {
        return ts.isClassDeclaration((_b = symbolType.symbol) === null || _b === void 0 ? void 0 : _b.valueDeclaration);
    }
    return false;
}
exports.isClassDeclaration = isClassDeclaration;
function nullFilter(type) {
    return (type.kind !== ts.SyntaxKind.NullKeyword &&
        (!ts.isLiteralTypeNode(type) ||
            (ts.isLiteralTypeNode(type) &&
                type.literal.kind !== ts.SyntaxKind.NullKeyword)));
}
function symbolHasPropertySignatureMembers(symbolType) {
    var _a;
    const members = symbolType["members"] || ((_a = symbolType["symbol"]) === null || _a === void 0 ? void 0 : _a.members);
    if (!members || members.size === 0) {
        return false;
    }
    let bRetVal = true;
    members.forEach((symbol) => {
        var _a;
        const memberType = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0].kind;
        if (memberType !== ts.SyntaxKind.PropertySignature) {
            bRetVal = false;
        }
    });
    return bRetVal;
}
function getEnumsFromUnion(union) {
    const enums = [];
    union.types.forEach((type) => {
        const literal = type.literal;
        if ((literal === null || literal === void 0 ? void 0 : literal.kind) === ts.SyntaxKind.StringLiteral) {
            enums.push(literal.text);
        }
        else if ((literal === null || literal === void 0 ? void 0 : literal.kind) === ts.SyntaxKind.NullKeyword) {
            enums.push(null);
        }
    });
    return enums.length === union.types.length ? enums : null;
}
function getComplexPropertyHelper(memberSymbol, type, seen, includeDtMetadata, stack, metaUtilObj) {
    var _a;
    let symbolType = metaUtilObj.typeChecker
        .getTypeOfSymbolAtLocation(memberSymbol, memberSymbol.valueDeclaration)
        .getNonNullableType();
    const kind = memberSymbol.valueDeclaration.kind;
    const declaration = memberSymbol.valueDeclaration;
    if (kind == ts.SyntaxKind.PropertyDeclaration ||
        kind == ts.SyntaxKind.PropertySignature) {
        const typeRefNode = getTypeRefNodeForPropDeclaration(declaration);
        if (typeRefNode) {
            if (typeRefNode.kind !== ts.SyntaxKind.TypeLiteral) {
                type = typeRefNode.getText();
            }
            else {
                type = "object";
            }
            let typeObject = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
            symbolType = typeObject;
        }
        else {
            return {};
        }
    }
    if (!possibleComplexProperty(symbolType, type, includeDtMetadata)) {
        return {};
    }
    if (type !== "object") {
        seen.add(type);
    }
    const members = (_a = symbolType.symbol) === null || _a === void 0 ? void 0 : _a.members;
    if (!members || members.size === 0) {
        return {};
    }
    let continueWalk = true;
    let circularRefs = [];
    const metadata = {};
    try {
        members.forEach((symbol) => {
            var _a;
            if (!continueWalk) {
                return;
            }
            const memberType = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0].kind;
            if (memberType !== ts.SyntaxKind.PropertySignature) {
                continueWalk = false;
                return;
            }
            const typeObj = getAllMetadataForDeclaration(symbol.valueDeclaration, includeDtMetadata, metaUtilObj);
            let type = typeObj.type;
            if (ts.isPropertySignature(symbol.valueDeclaration) &&
                symbol.valueDeclaration.type.kind == ts.SyntaxKind.ArrayType) {
                const arrNode = symbol.valueDeclaration.type;
                let arrTypeNode = arrNode.elementType;
                type = arrTypeNode.getText();
            }
            if (seen.has(type)) {
                circularRefs.push(type);
                continueWalk = false;
                throw "Circular dependency detected";
            }
        });
    }
    catch (ex) { }
    if (!continueWalk) {
        return { circularRefs };
    }
    try {
        members.forEach((symbol, key) => {
            var _a;
            const metaObj = getAllMetadataForDeclaration(symbol.valueDeclaration, includeDtMetadata, metaUtilObj);
            if (includeDtMetadata) {
                metaObj.optional = symbol.valueDeclaration["questionToken"]
                    ? true
                    : false;
            }
            let type = metaObj.type;
            const prop = key;
            let isExtensionMd = false;
            if (includeDtMetadata && metaObj.isArrayOfObject) {
                isExtensionMd = true;
                stack.push(prop);
            }
            const returnObj = getComplexPropertyHelper(symbol, type, new Set(seen), includeDtMetadata, stack, metaUtilObj);
            if (isExtensionMd) {
                stack.pop();
            }
            if (((_a = returnObj.circularRefs) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                circularRefs = returnObj.circularRefs;
                continueWalk = false;
                throw "Circular dependency detected";
            }
            else {
                metadata[prop] = metaObj;
                if (returnObj.metadata) {
                    if (metaObj.isArrayOfObject) {
                        if (includeDtMetadata) {
                            if (stack.length == 0) {
                                metadata[prop].type = "Array<object>";
                                metadata[prop].extension = {};
                                metadata[prop].extension["vbdt"] = {};
                                metadata[prop].extension["vbdt"]["itemProperties"] =
                                    returnObj.metadata;
                            }
                            else {
                                metadata[prop].type = "Array<object>";
                                metadata[prop].properties = returnObj.metadata;
                            }
                        }
                        else {
                            metadata[prop].type = "Array<object>";
                        }
                    }
                    else {
                        metadata[prop].type = "object";
                        metadata[prop].properties = returnObj.metadata;
                    }
                }
                delete metadata[prop]["isArrayOfObject"];
            }
        });
    }
    catch (ex) {
        return { circularRefs };
    }
    return { metadata: continueWalk ? metadata : null };
}
function getArrayTypeNodeSignature(node, metaUtilObj) {
    let typeObj = { type: "Array" };
    if (ts.isArrayTypeNode(node)) {
        const arrayNode = node;
        const elementType = arrayNode.elementType;
        const typeName = elementType.getText();
        if (ts.isTypeReferenceNode(elementType)) {
            typeObj.type = "Array<object>";
            typeObj.reftype = `Array<${typeName}>`;
            typeObj.isArrayOfObject = true;
        }
        else {
            typeObj.type = `Array<${typeName}>`;
        }
    }
    else if (ts.isTypeReferenceNode(node)) {
        let types = getTypeReferenceNodeSignature(node, false, metaUtilObj);
        typeObj.reftype = types.reftype ? types.reftype : types.type;
        typeObj.type = types.type;
    }
    return typeObj;
}
function getFunctionTypeNodeSignature(node, metaUtilObj) {
    let typeObj = { type: "function" };
    if (ts.isFunctionTypeNode(node)) {
        const functionNode = node;
        const parameters = functionNode.parameters;
        let signature = "(";
        for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i];
            signature += parameter.name.getText();
            if (parameter.type) {
                const paramSymbolType = metaUtilObj.typeChecker.getTypeAtLocation(parameter.type);
                const strType = metaUtilObj.typeChecker.typeToString(paramSymbolType);
                signature += `:${strType}`;
            }
            if (i < parameters.length - 1) {
                signature += ",";
            }
        }
        signature += ")";
        const returnType = functionNode.type;
        const returnTypeSymbol = metaUtilObj.typeChecker.getTypeAtLocation(returnType);
        const strType = metaUtilObj.typeChecker.typeToString(returnTypeSymbol);
        signature += ` => ${strType}`;
        typeObj["reftype"] = signature;
    }
    return typeObj;
}
function isDomType(symbolType) {
    var _a;
    let isDomType = false;
    const declaration = (_a = symbolType === null || symbolType === void 0 ? void 0 : symbolType.symbol) === null || _a === void 0 ? void 0 : _a.declarations[0];
    if (declaration &&
        declaration.parent &&
        ts.isSourceFile(declaration === null || declaration === void 0 ? void 0 : declaration.parent)) {
        const sourceFile = declaration.parent;
        isDomType =
            sourceFile.isDeclarationFile &&
                sourceFile.fileName.indexOf("typescript/lib/lib.dom.d.ts") > -1;
    }
    return isDomType;
}
function getTypeRefNodeForPropDeclaration(declaration) {
    const declarationType = declaration.type;
    let typeRefNode;
    if (declarationType.kind == ts.SyntaxKind.UnionType) {
        const unionTypes = declarationType.types;
        let result = unionTypes.filter(nullFilter);
        if (result.length == 1) {
            if (result[0].kind == ts.SyntaxKind.TypeReference) {
                const typeRef = result[0];
                if (typeRef.typeArguments && typeRef.typeName.getText() === "Array") {
                    typeRefNode = typeRef.typeArguments[0];
                }
                else {
                    typeRefNode = typeRef;
                }
            }
            else if (result[0].kind == ts.SyntaxKind.ArrayType) {
                const arrTypeNode = result[0];
                typeRefNode = arrTypeNode.elementType;
            }
            else {
                typeRefNode = result[0];
            }
        }
    }
    else if (declarationType.kind == ts.SyntaxKind.ArrayType) {
        const arrTypeNode = declarationType;
        typeRefNode = arrTypeNode.elementType;
    }
    else if (declarationType.kind == ts.SyntaxKind.TypeReference ||
        declarationType.kind == ts.SyntaxKind.TypeLiteral) {
        const typeRef = declarationType;
        if (typeRef.typeArguments && typeRef.typeName.getText() === "Array") {
            typeRefNode = typeRef.typeArguments[0];
        }
        else {
            typeRefNode = typeRef;
        }
        if (typeRefNode && typeRefNode.kind === ts.SyntaxKind.UnionType) {
            const unionTypes = typeRefNode.types;
            let result = unionTypes.filter(nullFilter);
            if (result.length == 1) {
                if (result[0].kind == ts.SyntaxKind.TypeReference ||
                    result[0].kind == ts.SyntaxKind.TypeLiteral) {
                    typeRefNode = result[0];
                }
            }
        }
    }
    return typeRefNode;
}
