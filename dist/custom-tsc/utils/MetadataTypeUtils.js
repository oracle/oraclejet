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
exports.getEnumStringsFromUnion = exports.isClassDeclaration = exports.possibleComplexProperty = exports.getAllMetadataForDeclaration = exports.getSubstituteTypeForCircularReference = exports.getComplexPropertyMetadata = exports.getPropertyTypes = exports.getPropertyType = exports.isGenericTypeParameter = exports.isTypeLiteralType = exports.getTypeDeclaration = exports.getNodeDeclaration = exports.getTypeNameFromIntersectionTypes = exports.getTypeNameFromType = exports.getTypeNameFromTypeReference = exports.getSignatureFromType = exports.getIndexedAccessTypeNodeSignature = exports.getTypeReferenceNodeSignature = exports.getUnionTypeNodeSignature = exports.getGenericsAndTypeParametersFromType = exports.getGenericsAndTypeParameters = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TransformerError_1 = require("./TransformerError");
const _REGEX_LINE_AND_BLOCK_COMMENTS = new RegExp(/(\/\*(.|[\r\n])*?\*\/)|(\/\/.*)/g);
const _REGEX_EXTRA_WHITESPACE = new RegExp(/\s\s*/g);
const _OR_NULL = '|null';
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
            jsxTypeParam.push('any');
        }
    });
    if (typeParamsExpression.length > 0) {
        retVal = {
            genericsDeclaration: `<${typeParamsExpression.join()}>`,
            genericsTypeParams: `<${typeParams.join()}>`
        };
        if (isPropsClass) {
            retVal.genericsTypeParamsAny = `<${jsxTypeParam.join()}>`;
        }
    }
    return retVal;
}
exports.getGenericsAndTypeParameters = getGenericsAndTypeParameters;
function getGenericsAndTypeParametersFromType(typeObj, metaUtilObj) {
    var _a, _b, _c, _d;
    let retVal;
    const genericParams = [];
    const typeParams = [];
    const typeDecl = (((_a = typeObj.aliasSymbol) === null || _a === void 0 ? void 0 : _a.getDeclarations()[0]) ||
        ((_b = typeObj.symbol) === null || _b === void 0 ? void 0 : _b.getDeclarations()[0]));
    const typeDeclParams = typeDecl.typeParameters;
    if (typeObj.aliasTypeArguments) {
        const classPropsAliasTypeArgs = metaUtilObj.classPropsAliasTypeArgs;
        for (let i = 0; i < typeObj.aliasTypeArguments.length; i++) {
            const propsAta = typeObj.aliasTypeArguments[i];
            const classPropsAta = classPropsAliasTypeArgs === null || classPropsAliasTypeArgs === void 0 ? void 0 : classPropsAliasTypeArgs[i];
            if (propsAta.symbol && isGenericTypeParameter(propsAta.symbol)) {
                const declParam = typeDeclParams === null || typeDeclParams === void 0 ? void 0 : typeDeclParams[i];
                const declPropsAta = (_c = propsAta.symbol.declarations) === null || _c === void 0 ? void 0 : _c[0];
                const declClassPropsAta = (classPropsAta === null || classPropsAta === void 0 ? void 0 : classPropsAta.symbol) && isGenericTypeParameter(classPropsAta.symbol)
                    ? (_d = classPropsAta.symbol.declarations) === null || _d === void 0 ? void 0 : _d[0]
                    : null;
                let resolvedDecl;
                if (declClassPropsAta && (declClassPropsAta.constraint || declClassPropsAta.default)) {
                    resolvedDecl = declClassPropsAta;
                }
                else if (declPropsAta && (declPropsAta.constraint || declPropsAta.default)) {
                    resolvedDecl = declPropsAta;
                }
                else {
                    resolvedDecl = declParam;
                }
                if (resolvedDecl) {
                    genericParams.push(resolvedDecl.getText());
                    typeParams.push(resolvedDecl.name.getText());
                }
                else {
                    genericParams.push(propsAta.symbol.name);
                    typeParams.push(propsAta.symbol.name);
                }
            }
            else if (propsAta.aliasSymbol) {
                typeParams.push(propsAta.aliasSymbol.name);
            }
        }
    }
    else {
        return getGenericsAndTypeParameters(typeDecl);
    }
    if (genericParams.length > 0 && typeParams.length > 0) {
        retVal = {
            genericsDeclaration: `<${genericParams.join()}>`,
            genericsTypeParams: `<${typeParams.join()}>`
        };
    }
    return retVal;
}
exports.getGenericsAndTypeParametersFromType = getGenericsAndTypeParametersFromType;
function getUnionTypeNodeSignature(unionNode, metaUtilObj) {
    let typeObj = { type: 'string' };
    let stringTypeExplicit = false;
    const unionNodeSymbol = metaUtilObj.typeChecker.getTypeAtLocation(unionNode);
    const strType = metaUtilObj.typeChecker.typeToString(unionNodeSymbol);
    if (strType === 'any') {
        return { type: 'any' };
    }
    let enumValues = getEnumStringsFromUnion(unionNode);
    if (enumValues) {
        typeObj['enumValues'] = enumValues.filter((enumVal) => enumVal !== null);
        if (enumValues.some((enumVal) => enumVal === null)) {
            typeObj.type = 'string|null';
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
                    regTypes.add('string');
                    reftypes.add('string');
                    stringTypeExplicit = true;
                    break;
                case ts.SyntaxKind.NumberKeyword:
                    regTypes.add('number');
                    reftypes.add('number');
                    break;
                case ts.SyntaxKind.BigIntKeyword:
                    regTypes.add('bigint');
                    reftypes.add('bigint');
                    break;
                case ts.SyntaxKind.BooleanKeyword:
                    regTypes.add('boolean');
                    reftypes.add('boolean');
                    break;
                case ts.SyntaxKind.NullKeyword:
                    regTypes.add('null');
                    reftypes.add('null');
                    break;
                case ts.SyntaxKind.ObjectKeyword:
                    regTypes.add('object');
                    reftypes.add('object');
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
                    reftypes.add(refTypes['reftype']);
                    break;
                case ts.SyntaxKind.ParenthesizedType:
                    const parTypeNode = typeNode;
                    if (parTypeNode.type.kind === ts.SyntaxKind.FunctionType) {
                        regTypes.add('function');
                        reftypes.add(`( ${parTypeNode.type.getText()} )`);
                    }
                    break;
                case ts.SyntaxKind.TypeLiteral:
                    const typeLiteral = typeNode;
                    regTypes.add('object');
                    reftypes.add(typeLiteral.getText());
                    break;
                case ts.SyntaxKind.LiteralType:
                    const literal = typeNode.literal;
                    if (ts.isStringLiteral(literal)) {
                        allEnums.add(literal.text);
                        regTypes.add('string');
                        reftypes.add('string');
                    }
                    else if (ts.isNumericLiteral(literal)) {
                        regTypes.add('number');
                        reftypes.add('number');
                    }
                    else if (ts.isBigIntLiteral(literal)) {
                        regTypes.add('bigint');
                        reftypes.add('bigint');
                    }
                    else if ((literal === null || literal === void 0 ? void 0 : literal.kind) === ts.SyntaxKind.NullKeyword) {
                        regTypes.add('null');
                        reftypes.add('null');
                    }
                    break;
                case ts.SyntaxKind.TypeOperator: {
                    let regTypeVal = 'any';
                    const typeOperatorNode = typeNode;
                    const operator = typeOperatorNode.operator.valueOf();
                    let strOperator = '';
                    if (operator === ts.SyntaxKind.KeyOfKeyword) {
                        strOperator = 'keyof';
                        regTypeVal = 'string | number';
                    }
                    if (operator === ts.SyntaxKind.UniqueKeyword) {
                        strOperator = 'unique';
                    }
                    if (operator === ts.SyntaxKind.ReadonlyKeyword) {
                        strOperator = 'readonly';
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
        if (regTypes.has('any')) {
            typeObj['type'] = 'any';
        }
        else {
            enumValues = [];
            for (let val of iter) {
                enumValues.push(val);
            }
            let result = enumValues.filter((type) => type.trim() !== 'null');
            if (result.length == 1 && result[0] === 'Array<object>') {
                typeObj.isArrayOfObject = true;
            }
            typeObj['type'] = enumValues.join('|');
        }
        iter = reftypes.values();
        enumValues = [];
        for (let val of iter) {
            enumValues.push(val);
        }
        typeObj['reftype'] = enumValues.join('|');
        if (allEnums.size > 0 && !stringTypeExplicit) {
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
    if (MetaUtils.isMappedType(typeObject)) {
        refNodeTypeName = strType;
    }
    else if (typeRefNode.typeArguments) {
        refNodeTypeName += MetaUtils.getGenericTypeParameters(typeRefNode);
    }
    let typeObj = {
        type: strType,
        reftype: refNodeTypeName
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
            typeObj = { type: 'function', reftype: refNodeTypeName };
            break;
        case ts.SyntaxKind.ArrayType:
            typeObj = getArrayTypeNodeSignature(declaration, metaUtilObj);
            typeObj.reftype = refNodeTypeName;
            break;
        case ts.SyntaxKind.UnionType:
            typeObj = getUnionTypeNodeSignature(declaration, metaUtilObj);
            typeObj.reftype = refNodeTypeName;
            break;
        case ts.SyntaxKind.InterfaceDeclaration:
            if (symbol.name === 'Array') {
                if (typeRefNode.typeArguments) {
                    let typevars = '';
                    let typearg = typeRefNode.typeArguments[0];
                    if (ts.isTypeReferenceNode(typearg)) {
                        let types = getTypeReferenceNodeSignature(typearg, false, metaUtilObj);
                        typeObj['reftype'] = `Array<${(_c = types.reftype) !== null && _c !== void 0 ? _c : types.type}>`;
                        typeObj['type'] = `Array<${types.type}>`;
                        if (types.reftype && types.type === 'object') {
                            typeObj.isArrayOfObject = true;
                        }
                        return typeObj;
                    }
                    else if (ts.isUnionTypeNode(typearg)) {
                        let types = getUnionTypeNodeSignature(typearg, metaUtilObj);
                        typeObj['reftype'] = `Array<${(_d = types.reftype) !== null && _d !== void 0 ? _d : types.type}>`;
                        typeObj['type'] = `Array<${types.type}>`;
                        let arrTypeNodes = typearg.types.filter(nullTypeNodeFilter);
                        if (arrTypeNodes.length == 1) {
                            const arrTypeNode = arrTypeNodes[0];
                            if (ts.isTypeLiteralNode(arrTypeNode)) {
                                typeObj.isArrayOfObject = true;
                            }
                            else if (ts.isTypeReferenceNode(arrTypeNode)) {
                                let types = getTypeReferenceNodeSignature(arrTypeNode, false, metaUtilObj);
                                if (types.reftype && types.type === 'object') {
                                    typeObj.isArrayOfObject = true;
                                }
                            }
                        }
                        return typeObj;
                    }
                    else {
                        typevars = typearg.getText();
                    }
                    typeObj['reftype'] = `Array<${typevars}>`;
                    if (['string', 'number', 'boolean'].indexOf(typevars.toLowerCase()) > -1) {
                        typeObj['type'] = `Array<${typevars.toLowerCase()}>`;
                    }
                    else {
                        typeObj['type'] = 'Array<object>';
                        if (typearg.kind === ts.SyntaxKind.TypeLiteral ||
                            typearg.kind === ts.SyntaxKind.IntersectionType) {
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
                            reftype: refNodeTypeName
                        };
                    }
                }
            }
            else if (symbol.name === 'Function') {
                typeObj['type'] = 'function';
            }
            else if (['Number', 'String', 'Boolean', 'Object'].indexOf(symbol.name) > -1) {
                typeObj['reftype'] = strType;
                typeObj['type'] = strType.toLowerCase();
            }
            else if (symbol.name === 'Promise') {
                typeObj['type'] = 'Promise';
            }
            else {
                typeObj['type'] =
                    (isPropSignature && symbolHasPropertySignatureMembers(symbol)) || isDomType(typeObject)
                        ? strType
                        : 'object';
            }
            break;
        case ts.SyntaxKind.TypeParameter:
            typeObj['type'] = 'any';
            typeObj['reftype'] = declaration.getText();
            break;
        case ts.SyntaxKind.EnumDeclaration:
            const enumDeclaration = declaration;
            const members = enumDeclaration.members;
            let enums = [];
            const initializer = members[0].initializer;
            if (initializer && initializer.kind === ts.SyntaxKind.StringLiteral) {
                typeObj['type'] = 'string';
                members.forEach((member) => {
                    enums.push(metaUtilObj.typeChecker.getConstantValue(member));
                });
                typeObj['enumValues'] = enums;
            }
            else {
                typeObj['type'] = 'number';
            }
            break;
        default:
            typeObj['type'] =
                (isPropSignature && symbolHasPropertySignatureMembers(symbol)) || isDomType(typeObject)
                    ? strType
                    : 'object';
            break;
    }
    return typeObj;
}
exports.getTypeReferenceNodeSignature = getTypeReferenceNodeSignature;
function getIndexedAccessTypeNodeSignature(indexedAccessNode, metaUtilObj) {
    let indexedAccessType = metaUtilObj.typeChecker.getTypeAtLocation(indexedAccessNode);
    return getSignatureFromType(indexedAccessType, true, metaUtilObj);
}
exports.getIndexedAccessTypeNodeSignature = getIndexedAccessTypeNodeSignature;
function getSignatureFromType(type, isPropSignatureType, metaUtilObj) {
    var _a, _b, _c;
    let typeObj;
    let unionWithNull = false;
    let unionTypes = [];
    const checker = metaUtilObj.typeChecker;
    if (type.isUnion()) {
        unionTypes = type.types.filter(undefinedTypeFilter);
        let unionLength = unionTypes.length;
        if (unionLength == 1) {
            type = unionTypes[0];
        }
        else {
            unionTypes = unionTypes.filter(nullTypeFilter);
            if (unionLength > unionTypes.length) {
                unionWithNull = true;
            }
            if (unionTypes.length == 1) {
                type = unionTypes[0];
            }
        }
    }
    if (MetaUtils.isConditionalType(type)) {
        typeObj = getSignatureFromType(checker.getApparentType(type), isPropSignatureType, metaUtilObj);
    }
    else {
        const strType = checker.typeToString(type);
        if (type.isUnion()) {
            typeObj = getSignatureFromUnionTypes(unionTypes, metaUtilObj);
        }
        else if (type.isIntersection()) {
            typeObj = { type: 'object', reftype: getTypeNameFromType(type) };
        }
        else if (type.isStringLiteral()) {
            typeObj = { type: 'string', reftype: 'string', enumValues: [type.value] };
        }
        else if (type.isTypeParameter() || MetaUtils.isAnyOrUnknownType(type)) {
            typeObj = { type: 'any' };
        }
        else if (MetaUtils.isObjectType(type)) {
            typeObj = { type: getTypeNameFromType(type) };
            let typeObjTypeParams = MetaUtils.getTypeParametersFromType(type, checker);
            typeObj.reftype = typeObjTypeParams ? typeObj.type + typeObjTypeParams : typeObj.type;
            if (typeObj.type === 'Array') {
                const elementTypes = checker.getTypeArguments(type);
                const arrayItemType = elementTypes === null || elementTypes === void 0 ? void 0 : elementTypes[0];
                if (arrayItemType) {
                    const arrayItemTypeObj = getSignatureFromType(arrayItemType, false, metaUtilObj);
                    typeObj = {
                        type: `Array<${arrayItemTypeObj.type}>`,
                        reftype: `Array<${(_a = arrayItemTypeObj.reftype) !== null && _a !== void 0 ? _a : arrayItemTypeObj.type}>`
                    };
                    if (arrayItemTypeObj.reftype &&
                        (arrayItemTypeObj.type === 'object' || arrayItemTypeObj.type === 'object|null')) {
                        typeObj.isArrayOfObject = true;
                    }
                }
                else {
                    typeObj.type = strType;
                }
            }
            else if (typeObj.type === 'Number') {
                typeObj = { type: 'number', reftype: 'Number' };
            }
            else if (typeObj.type === 'String') {
                typeObj = { type: 'string', reftype: 'String' };
            }
            else if (typeObj.type === 'Boolean') {
                typeObj = { type: 'boolean', reftype: 'Boolean' };
            }
            else if (typeObj.type === 'BigInt') {
                typeObj = { type: 'bigint', reftype: 'BigInt' };
            }
            else if (typeObj.type === 'Function') {
                typeObj = { type: 'function', reftype: 'Function' };
            }
            else if (typeObj.type === 'Promise') {
                typeObj = { type: 'Promise', reftype: 'Promise<void>' };
            }
            else {
                let typeSymbol;
                let typeDecl;
                if (type['symbol']) {
                    typeSymbol = type['symbol'];
                    typeDecl = (_b = typeSymbol.declarations) === null || _b === void 0 ? void 0 : _b[0];
                }
                else if (type['aliasSymbol']) {
                    typeSymbol = type['aliasSymbol'];
                    typeDecl = (_c = typeSymbol.declarations) === null || _c === void 0 ? void 0 : _c[0];
                    typeDecl = typeDecl.type;
                }
                if (typeSymbol && typeDecl) {
                    switch (typeDecl.kind) {
                        case ts.SyntaxKind.TypeLiteral:
                            typeObj.type = 'object';
                            if (!typeObj.reftype) {
                                typeObj.reftype = 'object';
                            }
                            break;
                        case ts.SyntaxKind.FunctionType:
                            typeObj.type = 'function';
                            typeObj.reftype = strType;
                            break;
                        case ts.SyntaxKind.NumberKeyword:
                            typeObj.type = 'number';
                            typeObj.reftype = 'number';
                            break;
                        case ts.SyntaxKind.StringKeyword:
                            typeObj.type = 'string';
                            typeObj.reftype = 'string';
                            break;
                        case ts.SyntaxKind.BooleanKeyword:
                            typeObj.type = 'boolean';
                            typeObj.reftype = 'boolean';
                            break;
                        case ts.SyntaxKind.BigIntKeyword:
                            typeObj.type = 'bigint';
                            typeObj.reftype = 'bigint';
                            break;
                        case ts.SyntaxKind.ObjectKeyword:
                            typeObj.type = 'object';
                            typeObj.reftype = 'object';
                            break;
                        case ts.SyntaxKind.FunctionKeyword:
                            typeObj.type = 'function';
                            typeObj.reftype = 'function';
                            break;
                        default:
                            let keepObjectTypeName = (isPropSignatureType && symbolHasPropertySignatureMembers(typeSymbol)) ||
                                isDomType(type);
                            if (!keepObjectTypeName) {
                                typeObj.type = 'object';
                            }
                            break;
                    }
                }
            }
        }
        else {
            typeObj = { type: strType };
        }
    }
    if (unionWithNull) {
        typeObj.type += _OR_NULL;
        if (typeObj.reftype) {
            typeObj.reftype += _OR_NULL;
        }
    }
    return typeObj;
}
exports.getSignatureFromType = getSignatureFromType;
function getSignatureFromUnionTypes(unionTypes, metaUtilObj) {
    let typeObj;
    let types = new Set();
    let reftypes = new Set();
    let enumvalues = new Set();
    let values;
    let stringTypeExplicit = false;
    unionTypes.forEach((type) => {
        if (MetaUtils.isConditionalType(type)) {
            type = metaUtilObj.typeChecker.getApparentType(type);
            if (type.isUnion()) {
                const unionTypeObj = getSignatureFromUnionTypes(type.types, metaUtilObj);
                const unionTypeArray = unionTypeObj.type.split(MetaUtils._UNION_SPLITTER);
                unionTypeArray.forEach((typeName) => types.add(typeName));
                if (unionTypeObj.reftype) {
                    const unionRefTypeArray = unionTypeObj.reftype.split(MetaUtils._UNION_SPLITTER);
                    unionRefTypeArray.forEach((reftypeName) => reftypes.add(reftypeName));
                }
                if (unionTypeObj.enumValues) {
                    unionTypeObj.enumValues.forEach((enumVal) => enumvalues.add(enumVal));
                }
                return;
            }
        }
        if (MetaUtils.isAnyOrUnknownType(type)) {
            return { type: 'any' };
        }
        let tFlags = type['flags'];
        if (type.isStringLiteral()) {
            types.add('string');
            reftypes.add('string');
            enumvalues.add(type.value);
        }
        else if (tFlags & ts.TypeFlags.String) {
            types.add('string');
            reftypes.add('string');
            stringTypeExplicit = true;
        }
        else if (tFlags & ts.TypeFlags.Null) {
            types.add('null');
            reftypes.add('null');
        }
        else if (type.isNumberLiteral() || tFlags & ts.TypeFlags.Number) {
            types.add('number');
            reftypes.add('number');
        }
        else if (tFlags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) {
            types.add('boolean');
            reftypes.add('boolean');
        }
        else if (tFlags & (ts.TypeFlags.BigInt | ts.TypeFlags.BigIntLiteral)) {
            types.add('bigint');
            reftypes.add('bigint');
        }
        else if (tFlags & ts.TypeFlags.Object) {
            let objtypeObj = getSignatureFromType(type, false, metaUtilObj);
            types.add(objtypeObj.type);
            reftypes.add(objtypeObj.reftype);
        }
        else {
            const strType = metaUtilObj.typeChecker.typeToString(type);
            types.add(strType);
            reftypes.add(strType);
        }
    });
    values = [...types];
    typeObj = { type: values.join('|') };
    if (values.length == 1 && values[0] === 'Array<object>') {
        typeObj.isArrayOfObject = true;
    }
    values = [...reftypes];
    typeObj.reftype = values.join('|');
    if (enumvalues.size > 0) {
        if (!stringTypeExplicit) {
            typeObj.enumValues = [...enumvalues];
        }
    }
    return typeObj;
}
function getTypeNameFromTypeReference(node) {
    var _a, _b;
    return ts.isTypeReferenceNode(node) ? (_a = node.typeName) === null || _a === void 0 ? void 0 : _a.getText() : (_b = node.expression) === null || _b === void 0 ? void 0 : _b.getText();
}
exports.getTypeNameFromTypeReference = getTypeNameFromTypeReference;
function getTypeNameFromType(type) {
    var _a;
    if (type.isIntersection()) {
        return getTypeNameFromIntersectionTypes(type.types);
    }
    else if (type.aliasSymbol) {
        return type.aliasSymbol.name;
    }
    else if (type.symbol) {
        let decl = (_a = type.symbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
        if (decl && ts.isTypeLiteralNode(decl)) {
            let rtnName = decl.getText();
            if (rtnName === null || rtnName === void 0 ? void 0 : rtnName.length) {
                rtnName = rtnName
                    .replace(_REGEX_LINE_AND_BLOCK_COMMENTS, '')
                    .replace(_REGEX_EXTRA_WHITESPACE, ' ');
            }
            return rtnName;
        }
        else {
            return type.symbol.name;
        }
    }
}
exports.getTypeNameFromType = getTypeNameFromType;
function getTypeNameFromIntersectionTypes(types) {
    let intersectionTypeName;
    if (types.length) {
        intersectionTypeName = '(';
        for (let i = 0; i < types.length; i++) {
            intersectionTypeName += getTypeNameFromType(types[i]);
            if (i < types.length - 1) {
                intersectionTypeName += ' & ';
            }
        }
        intersectionTypeName += ')';
    }
    return intersectionTypeName;
}
exports.getTypeNameFromIntersectionTypes = getTypeNameFromIntersectionTypes;
function getNodeDeclaration(node, checker) {
    const typeAtLoc = checker.getTypeAtLocation(node);
    return getTypeDeclaration(typeAtLoc);
}
exports.getNodeDeclaration = getNodeDeclaration;
function getTypeDeclaration(type) {
    var _a, _b;
    let declaration = type.aliasSymbol
        ? type.aliasSymbol.declarations[0]
        : (_b = (_a = type.symbol) === null || _a === void 0 ? void 0 : _a.declarations) === null || _b === void 0 ? void 0 : _b[0];
    return declaration;
}
exports.getTypeDeclaration = getTypeDeclaration;
function isTypeLiteralType(type) {
    let declaration = getTypeDeclaration(type);
    return (declaration === null || declaration === void 0 ? void 0 : declaration.kind) === ts.SyntaxKind.TypeLiteral;
}
exports.isTypeLiteralType = isTypeLiteralType;
function isGenericTypeParameter(symbol) {
    return symbol.declarations && symbol.declarations[0].kind === ts.SyntaxKind.TypeParameter;
}
exports.isGenericTypeParameter = isGenericTypeParameter;
function getPropertyType(typeRef, propName) {
    let typeName;
    if (typeRef) {
        const kind = typeRef.kind;
        switch (kind) {
            case ts.SyntaxKind.TypeReference:
                typeName = typeRef.typeName.getText();
                if (typeName === 'Array' && propName === MetaTypes.DEFAULT_SLOT_PROP) {
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
function getPropertyTypes(propDeclaration) {
    let types = {};
    const typeRef = propDeclaration.type;
    if (typeRef) {
        const kind = typeRef.kind;
        switch (kind) {
            case ts.SyntaxKind.TypeReference:
            case ts.SyntaxKind.ArrayType:
                let typeName = getPropertyType(typeRef);
                if (typeName) {
                    types[typeName] = typeRef;
                }
                break;
            case ts.SyntaxKind.IntersectionType:
                let interTypes = typeRef['types'];
                interTypes === null || interTypes === void 0 ? void 0 : interTypes.forEach((tr) => {
                    let typeName = getPropertyType(tr);
                    if (typeName) {
                        types[typeName] = tr;
                    }
                });
            default:
                break;
        }
    }
    return types;
}
exports.getPropertyTypes = getPropertyTypes;
function getComplexPropertyMetadata(memberSymbol, type, outerType, scope, stack, metaUtilObj) {
    var _a;
    let seen = new Set();
    if (outerType) {
        seen.add(outerType);
    }
    const returnObj = getComplexPropertyHelper(memberSymbol, type, seen, scope, stack, metaUtilObj);
    if (((_a = returnObj.circularRefs) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        const circRefInfo = returnObj.circularRefs.pop();
        return { circRefDetected: { type: circRefInfo.circularType } };
    }
    return returnObj.metadata;
}
exports.getComplexPropertyMetadata = getComplexPropertyMetadata;
function getSubstituteTypeForCircularReference(metaObj) {
    return metaObj.isArrayOfObject ? 'Array<object>' : 'object';
}
exports.getSubstituteTypeForCircularReference = getSubstituteTypeForCircularReference;
function getAllMetadataForDeclaration(declarationWithType, scope, metaUtilObj, flags = MetaTypes.GETMD_FLAGS_NONE, declSymbol) {
    var _a, _b;
    let metadata = {
        type: 'any'
    };
    let typeObj;
    if (scope == MetaTypes.MetadataScope.DT) {
        Object.assign(metadata, MetaUtils.getDtMetadata(declarationWithType, metaUtilObj, flags));
    }
    if (!declarationWithType.type) {
        if (ts.isPropertyDeclaration(declarationWithType)) {
            const logHeader = TransformerError_1.TransformerError.getMsgHeader(metaUtilObj.componentName, declarationWithType);
            console.log(`${logHeader} No type provided, defaulting to 'any' for property '${(_a = declarationWithType['name']) === null || _a === void 0 ? void 0 : _a.getText()}'.`);
        }
        return metadata;
    }
    let declTypeNode = declarationWithType.type;
    if (declSymbol) {
        const seen = new Set();
        if (metaUtilObj.propsName) {
            seen.add(metaUtilObj.propsName);
        }
        if (MetaUtils.isConditionalTypeNodeDetected(declTypeNode, seen, metaUtilObj)) {
            const symbolType = metaUtilObj.typeChecker.getTypeOfSymbolAtLocation(declSymbol, declarationWithType);
            if (symbolType) {
                typeObj = getSignatureFromType(symbolType, true, metaUtilObj);
            }
        }
    }
    if (!typeObj) {
        if (ts.isTypeReferenceNode(declTypeNode)) {
            let refNodeTypeName = getTypeNameFromTypeReference(declTypeNode);
            if (refNodeTypeName === `${metaUtilObj.namedExportToAlias.ElementReadOnly}` ||
                refNodeTypeName === `${metaUtilObj.namedExportToAlias.ReadOnlyPropertyChanged}`) {
                declTypeNode = (_b = declTypeNode.typeArguments) === null || _b === void 0 ? void 0 : _b[0];
            }
        }
        else if (ts.isParenthesizedTypeNode(declTypeNode)) {
            declTypeNode = declTypeNode.type;
        }
        let kind = declTypeNode.kind;
        let isPropSignature = ts.isPropertySignature(declarationWithType) || ts.isPropertyDeclaration(declarationWithType);
        switch (kind) {
            case ts.SyntaxKind.TypeReference:
                typeObj = getTypeReferenceNodeSignature(declTypeNode, isPropSignature, metaUtilObj);
                break;
            case ts.SyntaxKind.FunctionType:
                typeObj = getFunctionTypeNodeSignature(declTypeNode, metaUtilObj);
                break;
            case ts.SyntaxKind.ArrayType:
                typeObj = getArrayTypeNodeSignature(declTypeNode, metaUtilObj);
                break;
            case ts.SyntaxKind.TypeLiteral:
            case ts.SyntaxKind.IntersectionType:
                typeObj = { type: 'object' };
                break;
            case ts.SyntaxKind.UnionType:
                typeObj = getUnionTypeNodeSignature(declTypeNode, metaUtilObj);
                break;
            case ts.SyntaxKind.IndexedAccessType:
                typeObj = getIndexedAccessTypeNodeSignature(declTypeNode, metaUtilObj);
                break;
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.BooleanKeyword:
            default:
                let symbolType = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
                let strType = metaUtilObj.typeChecker.typeToString(symbolType);
                typeObj = { type: strType };
                break;
        }
    }
    if (scope == MetaTypes.MetadataScope.RT) {
        delete typeObj.reftype;
        delete typeObj.optional;
    }
    return Object.assign({}, metadata, typeObj);
}
exports.getAllMetadataForDeclaration = getAllMetadataForDeclaration;
const _NON_OBJECT_TYPES = new Set(['Array', 'Function', 'boolean', 'number', 'string']);
function possibleComplexProperty(symbolType, type, scope) {
    let iscomplex = true;
    if (!(symbolType.isIntersection() || MetaUtils.isMappedType(symbolType))) {
        if (_NON_OBJECT_TYPES.has(type) ||
            isDomType(symbolType) ||
            isClassDeclaration(symbolType) ||
            type.indexOf('|') > -1) {
            iscomplex = false;
            if (scope == MetaTypes.MetadataScope.DT && type.indexOf('Array') > -1) {
                iscomplex = true;
            }
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
function nullTypeNodeFilter(type) {
    return (type.kind !== ts.SyntaxKind.NullKeyword &&
        (!ts.isLiteralTypeNode(type) ||
            (ts.isLiteralTypeNode(type) && type.literal.kind !== ts.SyntaxKind.NullKeyword)));
}
function nullTypeFilter(t) {
    return t.flags !== ts.TypeFlags.Null;
}
function undefinedTypeFilter(t) {
    return t.flags !== ts.TypeFlags.Undefined;
}
function symbolHasPropertySignatureMembers(symbolType) {
    var _a;
    const members = symbolType['members'] || ((_a = symbolType['symbol']) === null || _a === void 0 ? void 0 : _a.members);
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
function getEnumStringsFromUnion(union) {
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
exports.getEnumStringsFromUnion = getEnumStringsFromUnion;
function getComplexPropertyHelper(memberSymbol, type, seen, scope, stack, metaUtilObj) {
    const checkMemberForCircularReference = function (circularTypeObj, seen) {
        let rtnRefInfo;
        if (seen.has(circularTypeObj.type)) {
            rtnRefInfo = {
                circularType: circularTypeObj.type
            };
        }
        else if (circularTypeObj.isArrayOfObject) {
            let arrayRefType = circularTypeObj.reftype;
            let openIndex = arrayRefType.indexOf('<');
            let closeIndex = arrayRefType.lastIndexOf('>');
            if (openIndex > 0 && closeIndex > 0) {
                let refType = arrayRefType.substring(openIndex + 1, closeIndex);
                openIndex = refType.indexOf('<');
                if (openIndex > 0) {
                    refType = refType.substring(0, openIndex);
                }
                if (seen.has(refType)) {
                    rtnRefInfo = {
                        circularType: refType
                    };
                }
            }
        }
        return rtnRefInfo;
    };
    let symbolType = metaUtilObj.typeChecker
        .getTypeOfSymbolAtLocation(memberSymbol, memberSymbol.valueDeclaration)
        .getNonNullableType();
    if (MetaUtils.isConditionalType(symbolType)) {
        const typeNames = type.split(MetaUtils._UNION_SPLITTER);
        if (typeNames.indexOf('object') > -1 &&
            (typeNames.length === 1 || (typeNames.length === 2 && typeNames.indexOf('null') > -1))) {
            type = 'object';
        }
    }
    else if (!symbolType.isIntersection()) {
        const kind = memberSymbol.valueDeclaration.kind;
        const declaration = memberSymbol.valueDeclaration;
        if (kind == ts.SyntaxKind.PropertyDeclaration || kind == ts.SyntaxKind.PropertySignature) {
            const typeRefNode = getTypeRefNodeForPropDeclaration(declaration, metaUtilObj);
            if (typeRefNode) {
                if (ts.isIndexedAccessTypeNode(typeRefNode)) {
                    const typeObject = getSymbolTypeFromIndexedAccessTypeNode(typeRefNode, metaUtilObj);
                    if (typeObject) {
                        symbolType = typeObject;
                        type = !isTypeLiteralType(symbolType)
                            ? MetaUtils.isMappedType(symbolType)
                                ? metaUtilObj.typeChecker.typeToString(symbolType)
                                : getTypeNameFromType(symbolType)
                            : 'object';
                    }
                    else {
                        return {};
                    }
                }
                else {
                    symbolType = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
                    if (!ts.isTypeLiteralNode(typeRefNode) && !MetaUtils.isConditionalType(symbolType)) {
                        type = MetaUtils.isMappedType(symbolType)
                            ? metaUtilObj.typeChecker.typeToString(symbolType)
                            : ts.isTypeReferenceNode(typeRefNode)
                                ? getTypeNameFromTypeReference(typeRefNode)
                                : typeRefNode.getText();
                    }
                    else {
                        type = 'object';
                    }
                }
            }
            else {
                return {};
            }
        }
    }
    if (!possibleComplexProperty(symbolType, type, scope)) {
        return {};
    }
    let circularRefs = [];
    if (!(type === 'object' || type === 'any')) {
        if (seen.has(type)) {
            const circRefInfo = {
                circularType: type
            };
            circularRefs.push(circRefInfo);
            return { circularRefs };
        }
        else {
            seen.add(type);
        }
    }
    let processedMembers = 0;
    const metadata = {};
    MetaUtils.walkTypeMembers(symbolType, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
        var _a, _b;
        if (processedMembers < 0) {
            return;
        }
        const memberType = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0].kind;
        if (memberType !== ts.SyntaxKind.PropertySignature) {
            if (memberType !== ts.SyntaxKind.TypeParameter) {
                processedMembers = -1;
            }
            return;
        }
        else {
            processedMembers += 1;
        }
        const metaObj = getAllMetadataForDeclaration(symbol.valueDeclaration, scope == MetaTypes.MetadataScope.RT ? MetaTypes.MetadataScope.RT_EXTENDED : scope, metaUtilObj, MetaTypes.GETMD_FLAGS_NONE, symbol);
        let type = metaObj.type;
        const prop = key;
        const circularRefInfo = checkMemberForCircularReference(metaObj, seen);
        if (circularRefInfo) {
            circularRefs.push(circularRefInfo);
            metaObj.type = getSubstituteTypeForCircularReference(metaObj);
            metadata[prop] = metaObj;
        }
        else {
            if (scope == MetaTypes.MetadataScope.DT) {
                const propSym = mappedTypeSymbol !== null && mappedTypeSymbol !== void 0 ? mappedTypeSymbol : symbol;
                metaObj.optional = propSym.flags & ts.SymbolFlags.Optional ? true : false;
            }
            let isExtensionMd = false;
            if (scope == MetaTypes.MetadataScope.DT && metaObj.isArrayOfObject) {
                isExtensionMd = true;
                stack.push(prop);
            }
            const returnObj = getComplexPropertyHelper(symbol, type, new Set(seen), scope, stack, metaUtilObj);
            if (isExtensionMd) {
                stack.pop();
            }
            if (((_b = returnObj.circularRefs) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                const circRefInfo = returnObj.circularRefs.pop();
                metaObj.type = getSubstituteTypeForCircularReference(metaObj);
            }
            metadata[prop] = metaObj;
            if (returnObj.metadata) {
                if (metaObj.isArrayOfObject) {
                    if (scope == MetaTypes.MetadataScope.DT) {
                        if (stack.length == 0) {
                            metadata[prop].type = 'Array<object>';
                            metadata[prop].extension = {};
                            metadata[prop].extension['vbdt'] = {};
                            metadata[prop].extension['vbdt']['itemProperties'] = returnObj.metadata;
                        }
                        else {
                            metadata[prop].type = 'Array<object>';
                            metadata[prop].properties = returnObj.metadata;
                        }
                    }
                    else {
                        metadata[prop].type = 'Array<object>';
                    }
                }
                else {
                    metadata[prop].type = 'object';
                    metadata[prop].properties = returnObj.metadata;
                }
            }
        }
        delete metadata[prop]['isArrayOfObject'];
        delete metadata[prop]['reftype'];
    });
    return { metadata: processedMembers > 0 ? metadata : null };
}
function getArrayTypeNodeSignature(node, metaUtilObj) {
    let typeObj = { type: 'Array' };
    if (ts.isArrayTypeNode(node)) {
        let elemTypeNode = node.elementType;
        if (ts.isParenthesizedTypeNode(elemTypeNode)) {
            elemTypeNode = elemTypeNode.type;
        }
        if (ts.isUnionTypeNode(elemTypeNode)) {
            const unionTypeObj = getUnionTypeNodeSignature(elemTypeNode, metaUtilObj);
            typeObj.type = `Array<${unionTypeObj.type}>`;
            if (unionTypeObj.reftype) {
                typeObj.reftype = `Array<${unionTypeObj.reftype}>`;
            }
        }
        else if (ts.isTypeReferenceNode(elemTypeNode)) {
            const typeRefTypeObj = getTypeReferenceNodeSignature(elemTypeNode, false, metaUtilObj);
            typeObj.type = `Array<${typeRefTypeObj.type}>`;
            if (typeRefTypeObj.reftype) {
                typeObj.reftype = `Array<${typeRefTypeObj.reftype}>`;
            }
            const typeRefTypes = typeRefTypeObj.type.split(MetaUtils._UNION_SPLITTER);
            if (typeRefTypes.indexOf('object') > -1 &&
                (typeRefTypes.length === 1 ||
                    (typeRefTypes.length === 2 && typeRefTypes.indexOf('null') > -1))) {
                typeObj.isArrayOfObject = true;
            }
        }
        else if (ts.isTypeLiteralNode(elemTypeNode)) {
            typeObj.type = 'Array<object>';
            typeObj.isArrayOfObject = true;
        }
        else {
            typeObj.type = `Array<${elemTypeNode.getText()}>`;
        }
    }
    else if (ts.isTypeReferenceNode(node)) {
        let typesObj = getTypeReferenceNodeSignature(node, false, metaUtilObj);
        typeObj.reftype = typesObj.reftype ? typesObj.reftype : typesObj.type;
        typeObj.type = typesObj.type;
        const typeRefTypes = typesObj.type.split(MetaUtils._UNION_SPLITTER);
        if (typeRefTypes.indexOf('object') > -1 &&
            (typeRefTypes.length === 1 ||
                (typeRefTypes.length === 2 && typeRefTypes.indexOf('null') > -1))) {
            typeObj.isArrayOfObject = true;
        }
    }
    return typeObj;
}
function getFunctionTypeNodeSignature(node, metaUtilObj) {
    let typeObj = { type: 'function' };
    if (ts.isFunctionTypeNode(node)) {
        const functionNode = node;
        const parameters = functionNode.parameters;
        let signature = '(';
        for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i];
            signature += parameter.name.getText();
            if (parameter.type) {
                const paramSymbolType = metaUtilObj.typeChecker.getTypeAtLocation(parameter.type);
                const strType = metaUtilObj.typeChecker.typeToString(paramSymbolType);
                signature += `:${strType}`;
            }
            if (i < parameters.length - 1) {
                signature += ',';
            }
        }
        signature += ')';
        const returnType = functionNode.type;
        const returnTypeSymbol = metaUtilObj.typeChecker.getTypeAtLocation(returnType);
        const strType = metaUtilObj.typeChecker.typeToString(returnTypeSymbol);
        signature += ` => ${strType}`;
        typeObj['reftype'] = signature;
    }
    return typeObj;
}
function isDomType(symbolType) {
    var _a;
    let isDomType = false;
    const declaration = (_a = symbolType === null || symbolType === void 0 ? void 0 : symbolType.symbol) === null || _a === void 0 ? void 0 : _a.declarations[0];
    if (declaration && declaration.parent && ts.isSourceFile(declaration === null || declaration === void 0 ? void 0 : declaration.parent)) {
        const sourceFile = declaration.parent;
        isDomType =
            sourceFile.isDeclarationFile &&
                sourceFile.fileName.indexOf('typescript/lib/lib.dom.d.ts') > -1;
    }
    return isDomType;
}
function getTypeRefNodeForPropDeclaration(declaration, metaUtilObj) {
    var _a, _b;
    const declTypeNode = declaration.type;
    let typeRefNode;
    if (declTypeNode.kind == ts.SyntaxKind.UnionType) {
        const unionTypes = declTypeNode.types;
        let result = unionTypes.filter(nullTypeNodeFilter);
        if (result.length == 1) {
            if (result[0].kind == ts.SyntaxKind.TypeReference) {
                const typeRef = result[0];
                if (typeRef.typeArguments && ((_a = typeRef.typeName) === null || _a === void 0 ? void 0 : _a.getText()) === 'Array') {
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
    else if (declTypeNode.kind == ts.SyntaxKind.ArrayType) {
        const arrTypeNode = declTypeNode;
        typeRefNode = arrTypeNode.elementType;
    }
    else if (declTypeNode.kind == ts.SyntaxKind.TypeReference ||
        declTypeNode.kind == ts.SyntaxKind.TypeLiteral) {
        const typeRef = declTypeNode;
        const typeRefName = (_b = typeRef.typeName) === null || _b === void 0 ? void 0 : _b.getText();
        if (typeRef.typeArguments &&
            (typeRefName === 'Array' ||
                typeRefName === `${metaUtilObj.namedExportToAlias.ReadOnlyPropertyChanged}`)) {
            typeRefNode = typeRef.typeArguments[0];
        }
        else {
            typeRefNode = typeRef;
        }
        if (typeRefNode && typeRefNode.kind === ts.SyntaxKind.UnionType) {
            const unionTypes = typeRefNode.types;
            let result = unionTypes.filter(nullTypeNodeFilter);
            if (result.length == 1) {
                if (result[0].kind == ts.SyntaxKind.TypeReference ||
                    result[0].kind == ts.SyntaxKind.TypeLiteral) {
                    typeRefNode = result[0];
                }
            }
        }
    }
    else if (declTypeNode.kind == ts.SyntaxKind.IndexedAccessType) {
        typeRefNode = declTypeNode;
    }
    return typeRefNode;
}
function getSymbolTypeFromIndexedAccessTypeNode(indexedAccessNode, metaUtilObj) {
    let rtnType;
    let indexedAccessType = metaUtilObj.typeChecker.getTypeAtLocation(indexedAccessNode);
    if (indexedAccessType.isUnion()) {
        let unionTypes = indexedAccessType.types.filter(undefinedTypeFilter).filter(nullTypeFilter);
        if (unionTypes.length == 1) {
            indexedAccessType = unionTypes[0];
        }
    }
    if (!indexedAccessType.isUnion()) {
        if (indexedAccessType.isIntersection()) {
            rtnType = indexedAccessType;
        }
        else if (MetaUtils.isObjectType(indexedAccessType)) {
            const typeName = getTypeNameFromType(indexedAccessType);
            if (typeName === 'Array') {
                const elementTypes = metaUtilObj.typeChecker.getTypeArguments(indexedAccessType);
                const arrayItemType = elementTypes === null || elementTypes === void 0 ? void 0 : elementTypes[0];
                if (arrayItemType) {
                    if (arrayItemType.isUnion()) {
                        let arrayItemUnionTypes = arrayItemType.types.filter(nullTypeFilter);
                        if (arrayItemUnionTypes.length == 1) {
                            rtnType = arrayItemUnionTypes[0];
                        }
                    }
                    else {
                        rtnType = arrayItemType;
                    }
                }
            }
            else {
                rtnType = indexedAccessType;
            }
        }
    }
    return rtnType;
}
//# sourceMappingURL=MetadataTypeUtils.js.map