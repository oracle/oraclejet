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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalExport = exports.getPossibleTypeDef = exports.getEnumStringsFromUnion = exports.isClassDeclaration = exports.possibleComplexProperty = exports.getAllMetadataForDeclaration = exports.getSubstituteTypeForCircularReference = exports.getComplexPropertyMetadata = exports.getPropertyTypes = exports.getPropertyType = exports.isGenericTypeParameter = exports.isTypeLiteralType = exports.getTypeDeclaration = exports.getNodeDeclaration = exports.getTypeNameFromIntersectionTypes = exports.getTypeNameFromType = exports.getTypeNameFromTypeReference = exports.getSignatureFromType = exports.getGenericsAndTypeParametersFromType = exports.getGenericsAndTypeParameters = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TransformerError_1 = require("./TransformerError");
const _REGEX_LINE_AND_BLOCK_COMMENTS = new RegExp(/(\/\*(.|[\r\n])*?\*\/)|(\/\/.*)/g);
const _REGEX_EXTRA_WHITESPACE = new RegExp(/\s\s*/g);
const _OR_NULL = '|null';
function getGenericsAndTypeParameters(node, isPropsClass) {
    let retVal;
    let typeParams = [];
    let typeParamsExpression = [];
    let jsxTypeParam = [];
    node.typeParameters?.forEach((tpn) => {
        typeParams.push(tpn.name.getText());
        typeParamsExpression.push(tpn.getText());
        if (isPropsClass) {
            jsxTypeParam.push('any');
        }
    });
    if (typeParamsExpression.length > 0) {
        retVal = {
            genericsDeclaration: `<${typeParamsExpression.join()}>`,
            genericsTypeParams: `<${typeParams.join()}>`,
            genericsTypeParamsArray: typeParams
        };
        if (isPropsClass) {
            retVal.genericsTypeParamsAny = `<${jsxTypeParam.join()}>`;
        }
    }
    return retVal;
}
exports.getGenericsAndTypeParameters = getGenericsAndTypeParameters;
function getGenericsAndTypeParametersFromType(typeObj, metaUtilObj) {
    let retVal;
    const genericParams = [];
    const typeParamsSignature = [];
    const typeParams = [];
    const typeDecl = (typeObj.aliasSymbol?.getDeclarations()[0] ||
        typeObj.symbol?.getDeclarations()[0]);
    const typeDeclParams = typeDecl.typeParameters;
    if (typeObj.aliasTypeArguments) {
        const classPropsAliasTypeArgs = metaUtilObj.classPropsAliasTypeArgs;
        for (let i = 0; i < typeObj.aliasTypeArguments.length; i++) {
            const propsAta = typeObj.aliasTypeArguments[i];
            const classPropsAta = classPropsAliasTypeArgs?.[i];
            if (propsAta.symbol && isGenericTypeParameter(propsAta.symbol)) {
                const declParam = typeDeclParams?.[i];
                const declPropsAta = propsAta.symbol.declarations?.[0];
                const declClassPropsAta = classPropsAta?.symbol && isGenericTypeParameter(classPropsAta.symbol)
                    ? classPropsAta.symbol.declarations?.[0]
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
                    typeParamsSignature.push(resolvedDecl.name.getText());
                    typeParams.push({
                        name: declPropsAta.name.getText(),
                        isGeneric: true
                    });
                }
                else {
                    genericParams.push(propsAta.symbol.name);
                    typeParamsSignature.push(propsAta.symbol.name);
                    typeParams.push({
                        name: propsAta.symbol.name,
                        isGeneric: true
                    });
                }
            }
            else if (propsAta.aliasSymbol) {
                typeParamsSignature.push(propsAta.aliasSymbol.name);
                typeParams.push({
                    name: propsAta.aliasSymbol.name,
                    isGeneric: false
                });
            }
        }
    }
    if (genericParams.length > 0 && typeParams.length > 0) {
        retVal = {
            genericsDeclaration: `<${genericParams.join()}>`,
            genericsTypeParams: `<${typeParamsSignature.join()}>`,
            genericsTypeParamData: typeParams
        };
    }
    return retVal;
}
exports.getGenericsAndTypeParametersFromType = getGenericsAndTypeParametersFromType;
function getSignatureFromType(type, isPropSignatureType, seenUnionTypeAliases, metaUtilObj) {
    let typeObj;
    let unionWithNull = false;
    let unionTypes = [];
    const checker = metaUtilObj.typeChecker;
    if (type.isUnion()) {
        const unionTypeName = getTypeNameFromType(type);
        if (unionTypeName) {
            if (seenUnionTypeAliases?.has(unionTypeName)) {
                return { type: 'unknown', reftype: unionTypeName };
            }
            else {
                seenUnionTypeAliases = seenUnionTypeAliases ?? new Set();
                seenUnionTypeAliases.add(unionTypeName);
            }
        }
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
        typeObj = getSignatureFromType(checker.getApparentType(type), isPropSignatureType, seenUnionTypeAliases, metaUtilObj);
    }
    else {
        const strType = checker.typeToString(type);
        if (type.isUnion()) {
            typeObj = getSignatureFromUnionTypes(unionTypes, seenUnionTypeAliases, metaUtilObj);
        }
        else if (type.isIntersection()) {
            typeObj = { type: 'object', reftype: getTypeNameFromType(type) };
        }
        else if (type.isStringLiteral()) {
            typeObj = { type: 'string', enumValues: [type.value] };
        }
        else if (type.isNumberLiteral()) {
            typeObj = { type: 'number', reftype: 'number' };
        }
        else if (type.flags & ts.TypeFlags.BigIntLiteral) {
            typeObj = { type: 'bigint', reftype: 'bigint' };
        }
        else if (type.flags & ts.TypeFlags.BooleanLiteral) {
            typeObj = { type: 'boolean', reftype: 'boolean' };
        }
        else if (type.flags & ts.TypeFlags.Null) {
            typeObj = { type: 'null', reftype: 'null' };
        }
        else if (type.flags & ts.TypeFlags.TemplateLiteral) {
            typeObj = { type: 'string', reftype: 'string' };
        }
        else if (type.flags & ts.TypeFlags.Index) {
            typeObj = { type: 'string|number', reftype: strType };
        }
        else if (type.isTypeParameter()) {
            typeObj = { type: 'any', reftype: strType };
            if (unionWithNull) {
                typeObj.reftype += _OR_NULL;
                unionWithNull = false;
            }
        }
        else if (MetaUtils.isTypeTreatedAsAny(type)) {
            typeObj = { type: 'any' };
            unionWithNull = false;
        }
        else if (MetaUtils.isObjectType(type)) {
            typeObj = { type: getTypeNameFromType(type) };
            let typeObjTypeParams = MetaUtils.getTypeParametersFromType(type, checker);
            typeObj.reftype = typeObjTypeParams ? typeObj.type + typeObjTypeParams : typeObj.type;
            if (typeObj.type === 'Array') {
                typeObj = getSignatureFromArrayType(type, strType, seenUnionTypeAliases, metaUtilObj);
                if (isPropSignatureType) {
                    delete typeObj.enumValues;
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
                    typeDecl = typeSymbol.declarations?.[0];
                }
                else if (type['aliasSymbol']) {
                    typeSymbol = type['aliasSymbol'];
                    typeDecl = typeSymbol.declarations?.[0];
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
                        case ts.SyntaxKind.InterfaceDeclaration:
                            if (typeSymbol.name === 'Array') {
                                typeObj = getSignatureFromArrayType(type, strType, seenUnionTypeAliases, metaUtilObj);
                                if (isPropSignatureType) {
                                    delete typeObj.enumValues;
                                }
                                break;
                            }
                            else if (typeSymbol.name === 'Promise') {
                                typeObj = { type: 'Promise', reftype: 'Promise<void>' };
                                break;
                            }
                        default:
                            let keepObjectTypeName = (isPropSignatureType && symbolHasPropertySignatureMembers(typeSymbol)) ||
                                isDomType(type) ||
                                isJetCollectionType(typeObj.type, type);
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
    if (typeObj.type === 'boolean' && typeObj?.reftype === 'boolean') {
        delete typeObj.reftype;
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
function getSignatureFromArrayType(type, fallbackType, seenUnionTypeAliases, metaUtilObj) {
    let typeObj;
    const elementTypes = metaUtilObj.typeChecker.getTypeArguments(type);
    const arrayItemType = elementTypes?.[0];
    if (arrayItemType) {
        const arrayItemTypeObj = getSignatureFromType(arrayItemType, false, seenUnionTypeAliases, metaUtilObj);
        typeObj = {
            type: `Array<${arrayItemTypeObj.type}>`,
            reftype: `Array<${arrayItemTypeObj.reftype ?? arrayItemTypeObj.type}>`
        };
        if (arrayItemTypeObj.reftype &&
            (arrayItemTypeObj.type === 'object' || arrayItemTypeObj.type === 'object|null')) {
            typeObj.isArrayOfObject = true;
        }
        if (arrayItemTypeObj.enumValues?.length > 0) {
            typeObj.enumValues = [...arrayItemTypeObj.enumValues];
        }
    }
    else {
        typeObj.type = fallbackType;
    }
    return typeObj;
}
function getSignatureFromUnionTypes(unionTypes, seenUnionTypeAliases, metaUtilObj) {
    let typeObj;
    let types = new Set();
    let reftypes = new Set();
    let enumvalues = new Set();
    let values;
    let subArrayEnumValues;
    let isEnumValuesForDTOnly = false;
    let subEnumValues = [];
    const checker = metaUtilObj.typeChecker;
    for (let type of unionTypes) {
        if (MetaUtils.isConditionalType(type)) {
            type = checker.getApparentType(type);
            if (type.isUnion()) {
                const unionTypeObj = getSignatureFromUnionTypes(type.types, seenUnionTypeAliases !== null ? new Set(seenUnionTypeAliases) : null, metaUtilObj);
                const unionTypeArray = unionTypeObj.type.split(MetaUtils._UNION_SPLITTER);
                unionTypeArray.forEach((typeName) => types.add(typeName));
                if (unionTypeObj.reftype) {
                    const unionRefTypeArray = unionTypeObj.reftype.split(MetaUtils._UNION_SPLITTER);
                    unionRefTypeArray.forEach((reftypeName) => reftypes.add(reftypeName));
                }
                if (unionTypeObj.enumValues) {
                    unionTypeObj.enumValues.forEach((enumVal) => enumvalues.add(enumVal));
                    if (unionTypeObj.isEnumValuesForDTOnly) {
                        isEnumValuesForDTOnly = unionTypeObj.isEnumValuesForDTOnly;
                    }
                }
                continue;
            }
        }
        if (MetaUtils.isTypeTreatedAsAny(type)) {
            types.clear();
            reftypes.clear();
            types.add('any');
            break;
        }
        const tFlags = type.getFlags();
        if (type.isStringLiteral()) {
            types.add('string');
            reftypes.add('string');
            enumvalues.add(type.value);
        }
        else if (tFlags & ts.TypeFlags.Null) {
            types.add('null');
            reftypes.add('null');
        }
        else {
            isEnumValuesForDTOnly = true;
            subArrayEnumValues = null;
            if (tFlags & (ts.TypeFlags.String | ts.TypeFlags.TemplateLiteral)) {
                types.add('string');
                reftypes.add('string');
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
            else if (tFlags & ts.TypeFlags.Index) {
                types.add('string');
                types.add('number');
                reftypes.add(checker.typeToString(type));
            }
            else if (tFlags & ts.TypeFlags.Object) {
                const objtypeObj = getSignatureFromType(type, false, seenUnionTypeAliases !== null ? new Set(seenUnionTypeAliases) : null, metaUtilObj);
                if (objtypeObj.type === 'Array<string>' || objtypeObj.type === 'Array<string|null>') {
                    if (objtypeObj.enumValues?.length > 0) {
                        subArrayEnumValues = objtypeObj.enumValues;
                    }
                }
                types.add(objtypeObj.type);
                reftypes.add(objtypeObj.reftype);
            }
            else if (type.isIntersection()) {
                const primitiveType = getPrimitiveTypeNameFromIntersectionPattern(type);
                if (primitiveType !== undefined) {
                    types.add(primitiveType);
                    reftypes.add(primitiveType);
                }
                else {
                    const objtypeObj = getSignatureFromType(type, false, seenUnionTypeAliases !== null ? new Set(seenUnionTypeAliases) : null, metaUtilObj);
                    types.add(objtypeObj.type);
                    reftypes.add(objtypeObj.reftype);
                }
            }
            else {
                const strType = checker.typeToString(type);
                types.add(type.isTypeParameter() ? 'any' : strType);
                reftypes.add(strType);
            }
            subEnumValues.push(subArrayEnumValues ?? []);
        }
    }
    if (types.size > 1 && types.has('any')) {
        typeObj = { type: 'any' };
    }
    else {
        values = [...types];
        typeObj = { type: values.join('|') };
        if (values.length == 1 && values[0] === 'Array<object>') {
            typeObj.isArrayOfObject = true;
        }
    }
    if (reftypes.size > 0) {
        values = [...reftypes];
        typeObj.reftype = values.join('|');
    }
    if (enumvalues.size > 0) {
        typeObj.enumValues = [...enumvalues];
        if (subEnumValues.length > 0) {
            let hasAllMatched = true;
            for (const subEnums of subEnumValues) {
                if (hasAllMatched) {
                    if (subEnums.length !== enumvalues.size) {
                        hasAllMatched = false;
                    }
                    else {
                        subEnums.forEach((val) => {
                            if (!enumvalues.has(val)) {
                                hasAllMatched = false;
                            }
                        });
                    }
                }
            }
            if (hasAllMatched) {
                isEnumValuesForDTOnly = false;
            }
        }
        if (isEnumValuesForDTOnly) {
            typeObj.isEnumValuesForDTOnly = isEnumValuesForDTOnly;
        }
        if (typeObj.type === 'string' || typeObj.type === 'string|null') {
            delete typeObj.reftype;
        }
    }
    return typeObj;
}
function getPrimitiveTypeNameFromIntersectionPattern(intersectionType) {
    let primitiveName;
    let wasAnonymousEmptyObjFound = false;
    if (intersectionType.types.length === 2) {
        intersectionType.types.forEach((type) => {
            if (type.flags & ts.TypeFlags.String) {
                primitiveName = 'string';
            }
            else if (type.flags & ts.TypeFlags.Number) {
                primitiveName = 'number';
            }
            else if (type.flags & ts.TypeFlags.BigInt) {
                primitiveName = 'bigint';
            }
            else if (type.flags & ts.TypeFlags.Object) {
                const objType = type;
                if (objType.objectFlags & ts.ObjectFlags.Anonymous) {
                    const objSymbol = objType.symbol;
                    if (!(objSymbol.members?.size > 0)) {
                        wasAnonymousEmptyObjFound = true;
                    }
                }
            }
        });
    }
    return wasAnonymousEmptyObjFound && primitiveName ? primitiveName : undefined;
}
function getTypeNameFromTypeReference(node) {
    return ts.isTypeReferenceNode(node) ? node.typeName?.getText() : node.expression?.getText();
}
exports.getTypeNameFromTypeReference = getTypeNameFromTypeReference;
function getTypeNameFromType(type) {
    if (type.isIntersection()) {
        return getTypeNameFromIntersectionTypes(type.types);
    }
    else if (type.aliasSymbol) {
        return type.aliasSymbol.name;
    }
    else if (type.symbol) {
        let decl = type.symbol.declarations?.[0];
        if (decl && ts.isTypeLiteralNode(decl)) {
            let rtnName = decl.getText();
            if (rtnName?.length) {
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
    let declaration = type.aliasSymbol
        ? type.aliasSymbol.declarations?.[0]
        : type.symbol?.declarations?.[0];
    return declaration;
}
exports.getTypeDeclaration = getTypeDeclaration;
function isTypeLiteralType(type) {
    let declaration = getTypeDeclaration(type);
    return declaration?.kind === ts.SyntaxKind.TypeLiteral;
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
                interTypes?.forEach((tr) => {
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
function getComplexPropertyMetadata(memberSymbol, type, outerType, scope, flags, propertyPath, nestedArrayStack, metaUtilObj) {
    let seen = new Set();
    if (outerType) {
        seen.add(outerType);
    }
    const returnObj = getComplexPropertyHelper(memberSymbol, type, seen, scope, flags, propertyPath, nestedArrayStack, metaUtilObj);
    if (returnObj.circularRefs?.length > 0) {
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
function getAllMetadataForDeclaration(declarationWithType, scope, flags, propertyPath, declSymbol, metaUtilObj) {
    let metadata = {
        type: 'any'
    };
    let typeObj;
    let refNodeTypeName;
    if (scope == MetaTypes.MetadataScope.DT) {
        Object.assign(metadata, MetaUtils.getDtMetadata(declarationWithType, flags, propertyPath, metaUtilObj));
    }
    if (!declarationWithType.type) {
        if (ts.isPropertyDeclaration(declarationWithType)) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DEFAULT_TO_ANY_TYPE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `No type provided, defaulting to 'any' for property '${declarationWithType['name']?.getText()}'.`, declarationWithType);
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
                typeObj = getSignatureFromType(symbolType, true, null, metaUtilObj);
            }
        }
    }
    if (!typeObj) {
        if (ts.isParenthesizedTypeNode(declTypeNode)) {
            declTypeNode = declTypeNode.type;
        }
        if (ts.isTypeReferenceNode(declTypeNode)) {
            refNodeTypeName = getTypeNameFromTypeReference(declTypeNode);
            if (refNodeTypeName === `${metaUtilObj.namedExportToAlias.ElementReadOnly}` ||
                refNodeTypeName === `${metaUtilObj.namedExportToAlias.ReadOnlyPropertyChanged}`) {
                declTypeNode = declTypeNode.typeArguments?.[0];
            }
        }
        let isPropSignature = ts.isPropertySignature(declarationWithType) || ts.isPropertyDeclaration(declarationWithType);
        const type = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
        typeObj = getSignatureFromType(type, isPropSignature, null, metaUtilObj);
        if (refNodeTypeName) {
            if (MetaUtils.isMappedType(type)) {
                const strType = metaUtilObj.typeChecker.typeToString(type);
                refNodeTypeName = strType;
            }
            else if (declTypeNode.typeArguments) {
                refNodeTypeName += MetaUtils.getGenericTypeParameters(declTypeNode).genericSignature;
            }
            typeObj['reftype'] = refNodeTypeName;
        }
    }
    if (scope !== MetaTypes.MetadataScope.DT) {
        if (scope === MetaTypes.MetadataScope.RT) {
            delete typeObj.reftype;
        }
        delete typeObj.optional;
        if (typeObj.isEnumValuesForDTOnly) {
            delete typeObj.enumValues;
        }
        delete typeObj.isEnumValuesForDTOnly;
    }
    else {
        if (flags & MetaTypes.MDFlags.PROP_RO_WRITEBACK) {
            delete typeObj.reftype;
        }
        if (typeObj.isEnumValuesForDTOnly) {
            if (metadata['propertyEditorValues'] === undefined && metadata['format'] === undefined) {
                const peValuesObj = {};
                typeObj.enumValues.forEach((val) => (peValuesObj[val] = {}));
                metadata['propertyEditorValues'] = peValuesObj;
            }
            delete typeObj.enumValues;
            delete typeObj.isEnumValuesForDTOnly;
        }
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
            isJetCollectionType(type, symbolType) ||
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
    if (symbolType.symbol?.valueDeclaration) {
        return ts.isClassDeclaration(symbolType.symbol?.valueDeclaration);
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
    const members = symbolType['members'] || symbolType['symbol']?.members;
    if (!members || members.size === 0) {
        return false;
    }
    let bRetVal = true;
    members.forEach((symbol) => {
        const memberType = symbol.declarations?.[0].kind;
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
        if (literal?.kind === ts.SyntaxKind.StringLiteral) {
            enums.push(literal.text);
        }
        else if (literal?.kind === ts.SyntaxKind.NullKeyword) {
            enums.push(null);
        }
    });
    return enums.length === union.types.length ? enums : null;
}
exports.getEnumStringsFromUnion = getEnumStringsFromUnion;
function getComplexPropertyHelper(memberSymbol, type, seen, scope, flags, propertyPath, nestedArrayStack, metaUtilObj) {
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
        if (processedMembers < 0) {
            return;
        }
        const memberType = symbol.declarations?.[0].kind;
        if (memberType !== ts.SyntaxKind.PropertySignature) {
            if (memberType !== ts.SyntaxKind.TypeParameter) {
                processedMembers = -1;
            }
            return;
        }
        else {
            processedMembers += 1;
        }
        const prop = key;
        const updatedPath = [...propertyPath, prop];
        const metaObj = getAllMetadataForDeclaration(symbol.valueDeclaration, scope == MetaTypes.MetadataScope.RT ? MetaTypes.MetadataScope.RT_EXTENDED : scope, nestedArrayStack.length === 0 ? flags : flags | MetaTypes.MDFlags.EXT_ITEMPROPS, updatedPath, symbol, metaUtilObj);
        let type = metaObj.type;
        const circularRefInfo = checkMemberForCircularReference(metaObj, seen);
        if (circularRefInfo) {
            circularRefs.push(circularRefInfo);
            metaObj.type = getSubstituteTypeForCircularReference(metaObj);
            metadata[prop] = metaObj;
        }
        else {
            if (scope == MetaTypes.MetadataScope.DT) {
                const propSym = mappedTypeSymbol ?? symbol;
                metaObj.optional = propSym.flags & ts.SymbolFlags.Optional ? true : false;
            }
            let isExtensionMd = false;
            if (scope == MetaTypes.MetadataScope.DT && metaObj.isArrayOfObject) {
                isExtensionMd = true;
                nestedArrayStack.push(prop);
            }
            const returnObj = getComplexPropertyHelper(symbol, type, new Set(seen), scope, nestedArrayStack.length === 0 ? flags : flags | MetaTypes.MDFlags.EXT_ITEMPROPS, updatedPath, nestedArrayStack, metaUtilObj);
            if (isExtensionMd) {
                nestedArrayStack.pop();
            }
            if (returnObj.circularRefs?.length > 0) {
                const circRefInfo = returnObj.circularRefs.pop();
                metaObj.type = getSubstituteTypeForCircularReference(metaObj);
            }
            metadata[prop] = metaObj;
            if (returnObj.metadata) {
                if (metaObj.isArrayOfObject) {
                    if (scope == MetaTypes.MetadataScope.DT) {
                        if (nestedArrayStack.length == 0) {
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
                if (scope == MetaTypes.MetadataScope.DT) {
                    const typeDef = getPossibleTypeDef(prop, symbol, metaObj, metaUtilObj);
                    if (typeDef && (typeDef.name || typeDef.coreJetModule)) {
                        metadata[prop]['jsdoc'] = metadata[prop]['jsdoc'] || {};
                        metadata[prop]['jsdoc']['typedef'] = typeDef;
                    }
                }
            }
        }
        delete metadata[prop]['isArrayOfObject'];
        delete metadata[prop]['reftype'];
    });
    return { metadata: processedMembers > 0 ? metadata : null };
}
function isDomType(symbolType) {
    let isDomType = false;
    const declaration = symbolType?.symbol?.declarations[0];
    if (declaration && declaration.parent && ts.isSourceFile(declaration?.parent)) {
        const sourceFile = declaration.parent;
        isDomType =
            sourceFile.isDeclarationFile &&
                sourceFile.fileName.indexOf('typescript/lib/lib.dom.d.ts') > -1;
    }
    return isDomType;
}
function isJetCollectionType(typeName, symbolType) {
    let isJetCollectionType = false;
    const declaration = symbolType?.symbol?.declarations[0];
    if (declaration && declaration.parent && ts.isSourceFile(declaration?.parent)) {
        const sourceFile = declaration.parent;
        if (sourceFile.isDeclarationFile) {
            isJetCollectionType =
                (typeName === 'DataProvider' &&
                    sourceFile.fileName.indexOf('types/ojdataprovider/index.d.ts') > -1) ||
                    (typeName === 'KeySet' && sourceFile.fileName.indexOf('types/ojkeyset/index.d.ts') > -1) ||
                    (typeName === 'TreeDataProvider' &&
                        sourceFile.fileName.indexOf('types/ojtreedataprovider/index.d.ts') > -1) ||
                    (typeName === 'DataGridProvider' &&
                        sourceFile.fileName.indexOf('types/ojdatagridprovider/index.d.ts') > -1);
        }
    }
    return isJetCollectionType;
}
function getTypeRefNodeForPropDeclaration(declaration, metaUtilObj) {
    const declTypeNode = declaration.type;
    let typeRefNode;
    if (declTypeNode.kind == ts.SyntaxKind.UnionType) {
        const unionTypes = declTypeNode.types;
        let result = unionTypes.filter(nullTypeNodeFilter);
        if (result.length == 1) {
            if (result[0].kind == ts.SyntaxKind.TypeReference) {
                const typeRef = result[0];
                if (typeRef.typeArguments && typeRef.typeName?.getText() === 'Array') {
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
        const typeRefName = typeRef.typeName?.getText();
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
                const arrayItemType = elementTypes?.[0];
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
function getPossibleTypeDef(prop, memberSymbol, metaObj, metaUtilObj) {
    let typeName;
    let typedefObj = {};
    if (metaObj.reftype) {
        try {
            let symbolType = metaUtilObj.typeChecker
                .getTypeOfSymbolAtLocation(memberSymbol, memberSymbol.valueDeclaration)
                .getNonNullableType();
            const kind = memberSymbol.valueDeclaration.kind;
            const declaration = memberSymbol.valueDeclaration;
            if ((kind === ts.SyntaxKind.PropertyDeclaration ||
                kind === ts.SyntaxKind.PropertySignature ||
                kind === ts.SyntaxKind.Parameter) &&
                symbolType &&
                !!(symbolType['flags'] & ts.SymbolFlags.TypeAlias ||
                    symbolType['flags'] & ts.SymbolFlags.Alias)) {
                const typeRefNode = getTypeRefNodeForPropDeclaration(declaration, metaUtilObj);
                let typeToCheck;
                if (typeRefNode) {
                    let typeAliasDeclaration;
                    let typeNode;
                    if (ts.isTypeReferenceNode(typeRefNode)) {
                        if (typeRefNode.typeArguments &&
                            (typeRefNode.typeName.getText() === 'Pick' ||
                                typeRefNode.typeName.getText() === 'Omit' ||
                                typeRefNode.typeName.getText() === 'Partial' ||
                                typeRefNode.typeName.getText() === 'Required' ||
                                typeRefNode.typeName.getText() === 'Readonly')) {
                            typeNode = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode.typeArguments[0]);
                        }
                        else {
                            typeNode = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
                        }
                    }
                    else if (ts.isIndexedAccessTypeNode(typeRefNode)) {
                        const symbolName = symbolType.getSymbol().getName();
                        if (symbolName === 'Array') {
                            typeNode = metaUtilObj.typeChecker.getTypeArguments(symbolType)[0];
                        }
                        else {
                            typeNode = symbolType;
                        }
                    }
                    if (!typeNode) {
                        return typedefObj;
                    }
                    typeAliasDeclaration = typeNode?.aliasSymbol?.declarations[0];
                    if (!typeAliasDeclaration) {
                        typeAliasDeclaration = typeNode?.symbol?.declarations[0];
                    }
                    if (typeAliasDeclaration?.kind !== ts.SyntaxKind.TypeAliasDeclaration &&
                        typeAliasDeclaration?.kind !== ts.SyntaxKind.InterfaceDeclaration) {
                        return typedefObj;
                    }
                    if (!typeAliasDeclaration) {
                        return typedefObj;
                    }
                    let type = typeAliasDeclaration.name?.getText();
                    if (!typeToCheck) {
                        typeToCheck = type;
                    }
                    if (!type) {
                        return typedefObj;
                    }
                    let isCoreJetType = false;
                    if (metaUtilObj.coreJetModuleMapping && metaUtilObj.coreJetModuleMapping.size > 0) {
                        for (let key of metaUtilObj.coreJetModuleMapping.keys()) {
                            if (new RegExp(`\\b${key}\\b`, 'g').test(typeToCheck) ||
                                new RegExp(`\\b${metaUtilObj.coreJetModuleMapping.get(key).binding}\\b`, 'g').test(typeToCheck)) {
                                isCoreJetType = true;
                                typedefObj.coreJetModule = typedefObj.coreJetModule || {};
                                if (!typedefObj.coreJetModule[key]) {
                                    typedefObj.coreJetModule[key] = metaUtilObj.coreJetModuleMapping.get(key).module;
                                }
                            }
                        }
                    }
                    if (!isCoreJetType) {
                        const md = MetaUtils.getDtMetadata(typeAliasDeclaration, MetaTypes.MDFlags.COMP, null, metaUtilObj) || {};
                        const signature = getGenericsAndTypeParameters(typeAliasDeclaration) || {};
                        typedefObj = { ...md['jsdoc'], ...signature };
                        if (typeAliasDeclaration.kind == ts.SyntaxKind.TypeAliasDeclaration ||
                            typeAliasDeclaration.kind == ts.SyntaxKind.InterfaceDeclaration) {
                            const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(symbolType.aliasSymbol ? symbolType.aliasSymbol : symbolType.symbol);
                            if (exportedSymbol) {
                                let node = typeAliasDeclaration;
                                while (!ts.isSourceFile(node)) {
                                    node = node.parent;
                                }
                                const fileName = node.fileName;
                                if (fileName && fileName.indexOf('node_modules/typescript/lib/') < 0) {
                                    const isLocalExport = fileName.indexOf(metaUtilObj.fullMetadata['jsdoc'].meta.filename) > -1;
                                    if (isLocalExport || metaUtilObj.followImports) {
                                        typeName = type;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (ex) {
            console.log(`Unexpected error happened during typdef lookup for ${prop}`);
        }
    }
    typedefObj.name = typeName;
    return typedefObj;
}
exports.getPossibleTypeDef = getPossibleTypeDef;
function isLocalExport(typeRefNode, metaUtilObj) {
    let isLocalExport = false;
    const symbolType = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
    const typeAliasDeclaration = symbolType.aliasSymbol?.declarations?.[0] || symbolType.symbol?.declarations?.[0];
    const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(symbolType.aliasSymbol ? symbolType.aliasSymbol : symbolType.symbol);
    if (exportedSymbol) {
        if (typeAliasDeclaration.parent && ts.isSourceFile(typeAliasDeclaration?.parent)) {
            const sourceFile = typeAliasDeclaration.parent;
            isLocalExport =
                sourceFile.fileName.indexOf(metaUtilObj.fullMetadata['jsdoc'].meta.filename) > -1;
        }
    }
    return isLocalExport;
}
exports.isLocalExport = isLocalExport;
//# sourceMappingURL=MetadataTypeUtils.js.map