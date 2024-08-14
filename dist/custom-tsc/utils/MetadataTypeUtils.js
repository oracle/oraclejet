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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ParameterizedTypeDeclIterator_paramSource;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalExport = exports.getTypeDefMetadata = exports.getPossibleTypeDef = exports.getEnumStringsFromUnion = exports.isClassDeclaration = exports.possibleComplexProperty = exports.getAllMetadataForDeclaration = exports.getSubstituteTypeForCircularReference = exports.getComplexPropertyMetadata = exports.getPropertyTypes = exports.getPropertyType = exports.isGenericTypeParameter = exports.isTypeLiteralType = exports.getTypeDeclaration = exports.getNodeDeclaration = exports.getTypeNameFromIntersectionTypes = exports.getTypeNameFromType = exports.getTypeNameFromTypeReference = exports.getSignatureFromType = exports.getGenericsAndTypeParametersFromType = exports.getGenericsAndTypeParameters = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TransformerError_1 = require("./TransformerError");
const _REGEX_LINE_AND_BLOCK_COMMENTS = new RegExp(/(\/\*(.|[\r\n])*?\*\/)|(\/\/.*)/g);
const _REGEX_EXTRA_WHITESPACE = new RegExp(/\s\s*/g);
const _OR_NULL = '|null';
const _OR_UNDEFINED = '|undefined';
const JS_DOM_TYPE = 'lib.dom.d.ts';
const JS_COLLECTION_TYPE = 'lib.es2015.collection.d.ts';
function getGenericsAndTypeParameters(node, metaUtilObj, extras) {
    let retVal;
    let typeParams = [];
    let typeParamsExpression = [];
    let jsxTypeParam = [];
    let typeReferences = [];
    node.typeParameters?.forEach((tpn) => {
        typeParams.push(tpn.name.getText());
        typeParamsExpression.push(tpn.getText());
        if (extras & MetaTypes.GTExtras.PARAMS_ANY) {
            jsxTypeParam.push('any');
        }
        if (tpn.constraint) {
            if (ts.isUnionTypeNode(tpn.constraint) || ts.isIntersectionTypeNode(tpn.constraint)) {
                const constraint = tpn.constraint;
                let typeRefs = [];
                for (let i = 0; i < constraint.types.length; i++) {
                    if (ts.isTypeReferenceNode(constraint.types[i])) {
                        typeRefs.push(constraint.types[i]);
                    }
                }
                typeReferences = addUniqueTypeRefs(typeReferences, typeRefs);
            }
            else if (ts.isTypeReferenceNode(tpn.constraint)) {
                typeReferences = addUniqueTypeRefs(typeReferences, [tpn.constraint]);
            }
        }
    });
    const apiDocTypeDefs = MetaUtils.createTypeDefinitionFromTypeRefs(typeReferences, metaUtilObj);
    if (typeParamsExpression.length > 0) {
        retVal = {
            genericsDeclaration: `<${typeParamsExpression.join()}>`,
            genericsTypeParams: `<${typeParams.join()}>`,
            genericsTypeParamsArray: typeParams,
            jsdoc: apiDocTypeDefs
        };
        if (extras & MetaTypes.GTExtras.PARAMS_ANY) {
            retVal.genericsTypeParamsAny = `<${jsxTypeParam.join()}>`;
        }
        if (extras & MetaTypes.GTExtras.DECL_NODES) {
            retVal.genericsTypeParamsNodes = [...node?.typeParameters];
        }
    }
    return retVal;
}
exports.getGenericsAndTypeParameters = getGenericsAndTypeParameters;
function getGenericsAndTypeParametersFromType(typeObj, typeNode, metaUtilObj) {
    let retVal;
    const genericsDeclSignature = [];
    const typeParamsSignature = [];
    const resolvedGenericsSignature = [];
    let currentGenericIdx = 0;
    const typeParamDecls = new ParameterizedTypeDeclIterator(typeObj, typeNode, metaUtilObj.typeChecker);
    for (const decl of typeParamDecls) {
        if (ts.isTypeParameterDeclaration(decl)) {
            let resolvedGeneric;
            if (metaUtilObj.classTypeParamsNodes) {
                let idx = metaUtilObj.propsClassTypeParamsArray?.indexOf(ts.idText(decl.name));
                if (idx < 0 || idx >= metaUtilObj.classTypeParamsNodes.length) {
                    idx = currentGenericIdx;
                }
                const remappedDecl = metaUtilObj.classTypeParamsNodes[idx];
                genericsDeclSignature.push(remappedDecl.getText());
                typeParamsSignature.push(ts.idText(remappedDecl.name));
                resolvedGeneric = metaUtilObj.propsTypeParamsArray?.[idx];
            }
            else {
                genericsDeclSignature.push(decl.getText());
                typeParamsSignature.push(ts.idText(decl.name));
                resolvedGeneric = metaUtilObj.propsTypeParamsArray?.[currentGenericIdx];
            }
            if (resolvedGeneric) {
                resolvedGenericsSignature.push(resolvedGeneric);
            }
            currentGenericIdx += 1;
        }
        else if (ts.isTypeAliasDeclaration(decl) ||
            ts.isInterfaceDeclaration(decl) ||
            ts.isClassDeclaration(decl)) {
            typeParamsSignature.push(ts.idText(decl.name));
        }
    }
    if (genericsDeclSignature.length > 0 && typeParamsSignature.length > 0) {
        retVal = {
            genericsDeclaration: `<${genericsDeclSignature.join()}>`,
            genericsTypeParams: `<${typeParamsSignature.join()}>`,
            resolvedGenericParams: `<${resolvedGenericsSignature.join()}>`
        };
    }
    return retVal;
}
exports.getGenericsAndTypeParametersFromType = getGenericsAndTypeParametersFromType;
function getSignatureFromType(type, context, isPropSignatureType, seenUnionTypeAliases, metaUtilObj) {
    let typeObj;
    let unionWithNull = false;
    let unionWithUndefined = false;
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
        let unionLength = type.types.length;
        unionTypes = type.types.filter(undefinedTypeFilter);
        if (unionLength > unionTypes.length && context & MetaTypes.MDContext.METHOD_RETURN) {
            unionWithUndefined = true;
        }
        if (unionTypes.length == 1) {
            type = unionTypes[0];
        }
        else {
            unionLength = unionTypes.length;
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
        typeObj = getSignatureFromType(checker.getApparentType(type), context, isPropSignatureType, seenUnionTypeAliases, metaUtilObj);
    }
    else {
        const strType = checker.typeToString(type);
        if (type.isUnion()) {
            typeObj = getSignatureFromUnionTypes(unionTypes, context, seenUnionTypeAliases, metaUtilObj);
        }
        else if (type.isIntersection()) {
            typeObj = { type: 'object', reftype: getTypeNameFromType(type), isApiDocSignature: true };
        }
        else if (type.isStringLiteral()) {
            typeObj = { type: 'string', enumValues: [type.value] };
        }
        else if (type.isNumberLiteral()) {
            typeObj = { type: 'number', reftype: 'number', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.BigIntLiteral) {
            typeObj = { type: 'bigint', reftype: 'bigint', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.BooleanLiteral) {
            typeObj = { type: 'boolean', reftype: 'boolean', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.Null) {
            typeObj = { type: 'null', reftype: 'null', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.TemplateLiteral) {
            typeObj = { type: 'string', reftype: 'string', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.Index) {
            typeObj = { type: 'string|number', reftype: strType, isApiDocSignature: false };
        }
        else if (type.isTypeParameter()) {
            typeObj = { type: 'any', reftype: strType, isApiDocSignature: true };
            if (unionWithNull) {
                typeObj.reftype += _OR_NULL;
                unionWithNull = false;
            }
            if (unionWithUndefined) {
                typeObj.reftype += _OR_UNDEFINED;
                unionWithUndefined = false;
            }
        }
        else if (MetaUtils.isTypeTreatedAsAny(type)) {
            typeObj = { type: 'any' };
            unionWithNull = false;
        }
        else if (MetaUtils.isObjectType(type)) {
            typeObj = { type: getTypeNameFromType(type), isApiDocSignature: true };
            let typeObjTypeParams = MetaUtils.getTypeParametersFromType(type, checker);
            typeObj.reftype = typeObjTypeParams ? typeObj.type + typeObjTypeParams : typeObj.type;
            if (typeObj.type === 'Array') {
                typeObj = getSignatureFromArrayType(type, context, strType, seenUnionTypeAliases, metaUtilObj);
                if (isPropSignatureType) {
                    delete typeObj.enumValues;
                }
            }
            else if (typeObj.type === 'Number') {
                typeObj = { type: 'number', reftype: 'Number', isApiDocSignature: false };
            }
            else if (typeObj.type === 'String') {
                typeObj = { type: 'string', reftype: 'String', isApiDocSignature: false };
            }
            else if (typeObj.type === 'Boolean') {
                typeObj = { type: 'boolean', reftype: 'Boolean', isApiDocSignature: false };
            }
            else if (typeObj.type === 'BigInt') {
                typeObj = { type: 'bigint', reftype: 'BigInt', isApiDocSignature: false };
            }
            else if (typeObj.type === 'Function') {
                typeObj = { type: 'function', reftype: 'Function', isApiDocSignature: false };
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
                            if (!typeDecl.parameters || typeDecl.parameters.length == 0) {
                                typeObj.isApiDocSignature = false;
                            }
                            break;
                        case ts.SyntaxKind.NumberKeyword:
                            typeObj.type = 'number';
                            typeObj.reftype = 'number';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.StringKeyword:
                            typeObj.type = 'string';
                            typeObj.reftype = 'string';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.BooleanKeyword:
                            typeObj.type = 'boolean';
                            typeObj.reftype = 'boolean';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.BigIntKeyword:
                            typeObj.type = 'bigint';
                            typeObj.reftype = 'bigint';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.ObjectKeyword:
                            typeObj.type = 'object';
                            typeObj.reftype = 'object';
                            typeObj.isApiDocSignature = true;
                            break;
                        case ts.SyntaxKind.FunctionKeyword:
                            typeObj.type = 'function';
                            typeObj.reftype = 'function';
                            break;
                        case ts.SyntaxKind.InterfaceDeclaration:
                            if (typeSymbol.name === 'Array') {
                                typeObj = getSignatureFromArrayType(type, context, strType, seenUnionTypeAliases, metaUtilObj);
                                if (isPropSignatureType) {
                                    delete typeObj.enumValues;
                                }
                                break;
                            }
                            else if (typeSymbol.name === 'Promise') {
                                typeObj = { type: 'Promise', reftype: 'Promise<void>', isApiDocSignature: true };
                                break;
                            }
                        default:
                            let keepObjectTypeName = (isPropSignatureType && symbolHasPropertySignatureMembers(typeSymbol)) ||
                                isJsLibraryType(type, JS_DOM_TYPE) ||
                                isJetCollectionType(typeObj.type, type);
                            if (!keepObjectTypeName) {
                                typeObj.type = 'object';
                                if (isJsLibraryType(type, JS_COLLECTION_TYPE)) {
                                    typeObj.isApiDocSignature = true;
                                }
                                else {
                                    typeObj.isApiDocSignature = false;
                                }
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
    if (unionWithUndefined) {
        typeObj.type += _OR_UNDEFINED;
        if (typeObj.reftype) {
            typeObj.reftype += _OR_UNDEFINED;
        }
    }
    return typeObj;
}
exports.getSignatureFromType = getSignatureFromType;
function getSignatureFromArrayType(type, context, fallbackType, seenUnionTypeAliases, metaUtilObj) {
    let typeObj;
    const elementTypes = metaUtilObj.typeChecker.getTypeArguments(type);
    const arrayItemType = elementTypes?.[0];
    if (arrayItemType) {
        const arrayItemTypeObj = getSignatureFromType(arrayItemType, context, false, seenUnionTypeAliases, metaUtilObj);
        typeObj = {
            type: `Array<${arrayItemTypeObj.type}>`,
            reftype: `Array<${arrayItemTypeObj.reftype ?? arrayItemTypeObj.type}>`,
            isApiDocSignature: arrayItemTypeObj.isApiDocSignature
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
function getSignatureFromUnionTypes(unionTypes, context, seenUnionTypeAliases, metaUtilObj) {
    let typeObj;
    let types = new Set();
    let reftypes = new Set();
    let enumvalues = new Set();
    let values;
    let subArrayEnumValues;
    let isEnumValuesForDTOnly = false;
    let subEnumValues = [];
    const checker = metaUtilObj.typeChecker;
    let useRefType = false;
    for (let type of unionTypes) {
        if (MetaUtils.isConditionalType(type)) {
            type = checker.getApparentType(type);
            if (type.isUnion()) {
                const unionTypeObj = getSignatureFromUnionTypes(type.types, context, seenUnionTypeAliases !== null ? new Set(seenUnionTypeAliases) : null, metaUtilObj);
                useRefType = unionTypeObj.isApiDocSignature;
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
            useRefType = true;
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
                const objtypeObj = getSignatureFromType(type, context, false, seenUnionTypeAliases !== null ? new Set(seenUnionTypeAliases) : null, metaUtilObj);
                if (objtypeObj.type === 'Array<string>' || objtypeObj.type === 'Array<string|null>') {
                    if (objtypeObj.enumValues?.length > 0) {
                        subArrayEnumValues = objtypeObj.enumValues;
                    }
                }
                types.add(objtypeObj.type);
                reftypes.add(objtypeObj.reftype);
                useRefType = objtypeObj.isApiDocSignature;
            }
            else if (type.isIntersection()) {
                const primitiveType = getPrimitiveTypeNameFromIntersectionPattern(type);
                if (primitiveType !== undefined) {
                    types.add(primitiveType);
                    reftypes.add(primitiveType);
                }
                else {
                    const objtypeObj = getSignatureFromType(type, context, false, seenUnionTypeAliases !== null ? new Set(seenUnionTypeAliases) : null, metaUtilObj);
                    types.add(objtypeObj.type);
                    reftypes.add(objtypeObj.reftype);
                    useRefType = objtypeObj.isApiDocSignature;
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
    typeObj.isApiDocSignature = useRefType;
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
function getComplexPropertyMetadata(memberSymbol, type, outerType, scope, context, propertyPath, nestedArrayStack, metaUtilObj) {
    let seen = new Set();
    if (outerType) {
        seen.add(outerType);
    }
    const returnObj = getComplexPropertyHelper(memberSymbol, type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj);
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
function getAllMetadataForDeclaration(declarationWithType, scope, context, propertyPath, declSymbol, metaUtilObj) {
    let metadata = {
        type: 'any'
    };
    let typeObj;
    let refNodeTypeName;
    if (scope == MetaTypes.MDScope.DT) {
        Object.assign(metadata, MetaUtils.getDtMetadata(declarationWithType, context, propertyPath, metaUtilObj));
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
                typeObj = getSignatureFromType(symbolType, context, true, null, metaUtilObj);
            }
        }
    }
    if (!typeObj) {
        if (ts.isParenthesizedTypeNode(declTypeNode)) {
            declTypeNode = declTypeNode.type;
        }
        if (ts.isTypeReferenceNode(declTypeNode)) {
            refNodeTypeName = getTypeNameFromTypeReference(declTypeNode);
            const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, declTypeNode);
            if (refNodeTypeName === `${exportToAlias.ElementReadOnly}` ||
                refNodeTypeName === `${exportToAlias.ReadOnlyPropertyChanged}`) {
                declTypeNode = declTypeNode.typeArguments?.[0];
            }
        }
        let isPropSignature = ts.isPropertySignature(declarationWithType) || ts.isPropertyDeclaration(declarationWithType);
        const type = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
        typeObj = getSignatureFromType(type, context, isPropSignature, null, metaUtilObj);
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
    if (scope !== MetaTypes.MDScope.DT) {
        if (scope === MetaTypes.MDScope.RT) {
            delete typeObj.isApiDocSignature;
            delete typeObj.reftype;
        }
        delete typeObj.optional;
        if (typeObj.isEnumValuesForDTOnly) {
            delete typeObj.enumValues;
        }
        delete typeObj.isEnumValuesForDTOnly;
    }
    else {
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
            isJsLibraryType(symbolType, JS_DOM_TYPE) ||
            isJetCollectionType(type, symbolType) ||
            isClassDeclaration(symbolType) ||
            type.indexOf('|') > -1) {
            iscomplex = false;
            if (scope == MetaTypes.MDScope.DT && type.indexOf('Array') > -1) {
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
function nullOrUndefinedTypeNodeFilter(type) {
    return (type.kind !== ts.SyntaxKind.UndefinedKeyword &&
        type.kind !== ts.SyntaxKind.NullKeyword &&
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
function getComplexPropertyHelper(memberSymbol, type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj) {
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
        const metaObj = getAllMetadataForDeclaration(symbol.valueDeclaration, scope == MetaTypes.MDScope.RT ? MetaTypes.MDScope.RT_EXTENDED : scope, nestedArrayStack.length === 0 ? context : context | MetaTypes.MDContext.EXT_ITEMPROPS, updatedPath, symbol, metaUtilObj);
        let type = metaObj.type;
        const circularRefInfo = checkMemberForCircularReference(metaObj, seen);
        if (circularRefInfo) {
            circularRefs.push(circularRefInfo);
            metaObj.type = getSubstituteTypeForCircularReference(metaObj);
            metadata[prop] = metaObj;
        }
        else {
            if (scope == MetaTypes.MDScope.DT) {
                const propSym = mappedTypeSymbol ?? symbol;
                metaObj.optional = propSym.flags & ts.SymbolFlags.Optional ? true : false;
            }
            let isExtensionMd = false;
            if (scope == MetaTypes.MDScope.DT && metaObj.isArrayOfObject) {
                isExtensionMd = true;
                nestedArrayStack.push(prop);
            }
            const returnObj = getComplexPropertyHelper(symbol, type, new Set(seen), scope, nestedArrayStack.length === 0 ? context : context | MetaTypes.MDContext.EXT_ITEMPROPS, updatedPath, nestedArrayStack, metaUtilObj);
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
                    if (scope == MetaTypes.MDScope.DT) {
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
                if (scope == MetaTypes.MDScope.DT) {
                    const typeDef = getPossibleTypeDef(prop, symbol, metaObj, metaUtilObj);
                    if (typeDef && (typeDef.name || typeDef.coreJetModule)) {
                        metadata[prop]['jsdoc'] = metadata[prop]['jsdoc'] || {};
                        metadata[prop]['jsdoc']['typedef'] = typeDef;
                    }
                }
            }
        }
        if (scope != MetaTypes.MDScope.DT) {
            delete metadata[prop]['isArrayOfObject'];
            delete metadata[prop]['reftype'];
            delete metadata[prop]['isApiDocSignature'];
        }
    });
    return { metadata: processedMembers > 0 ? metadata : null };
}
function isJsLibraryType(symbolType, libraryName) {
    let isLibType = false;
    const declaration = symbolType?.symbol?.declarations[0];
    if (declaration && declaration.parent && ts.isSourceFile(declaration?.parent)) {
        const sourceFile = declaration.parent;
        isLibType =
            sourceFile.isDeclarationFile &&
                sourceFile.fileName.indexOf(`typescript/lib/${libraryName}`) > -1;
    }
    return isLibType;
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
function getNonParenthesizedTypeNode(tNode) {
    while (ts.isParenthesizedTypeNode(tNode)) {
        tNode = tNode.type;
    }
    return tNode;
}
function getTypeRefNodeForPropDeclaration(declaration, metaUtilObj) {
    const declTypeNode = getNonParenthesizedTypeNode(declaration.type);
    let typeRefNode;
    if (ts.isUnionTypeNode(declTypeNode)) {
        const filteredUnion = declTypeNode.types.filter(nullOrUndefinedTypeNodeFilter);
        if (filteredUnion.length == 1) {
            const result = getNonParenthesizedTypeNode(filteredUnion[0]);
            if (ts.isTypeReferenceNode(result)) {
                const typeRef = result;
                if (typeRef.typeArguments && typeRef.typeName?.getText() === 'Array') {
                    typeRefNode = typeRef.typeArguments[0];
                }
                else {
                    typeRefNode = typeRef;
                }
            }
            else if (ts.isArrayTypeNode(result)) {
                typeRefNode = result.elementType;
            }
            else {
                typeRefNode = result;
            }
            typeRefNode = getNonParenthesizedTypeNode(typeRefNode);
        }
    }
    else if (ts.isArrayTypeNode(declTypeNode)) {
        typeRefNode = getNonParenthesizedTypeNode(declTypeNode.elementType);
    }
    else if (ts.isIndexedAccessTypeNode(declTypeNode)) {
        typeRefNode = declTypeNode;
    }
    else if (ts.isTypeReferenceNode(declTypeNode) || ts.isTypeLiteralNode(declTypeNode)) {
        const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, declTypeNode);
        const typeRef = declTypeNode;
        const typeRefName = typeRef.typeName?.getText();
        if (typeRef.typeArguments &&
            (typeRefName === 'Array' || typeRefName === `${exportToAlias.ReadOnlyPropertyChanged}`)) {
            typeRefNode = getNonParenthesizedTypeNode(typeRef.typeArguments[0]);
        }
        else {
            typeRefNode = typeRef;
        }
    }
    if (typeRefNode && ts.isUnionTypeNode(typeRefNode)) {
        const filteredUnion = typeRefNode.types.filter(nullOrUndefinedTypeNodeFilter);
        if (filteredUnion.length == 1) {
            const result = getNonParenthesizedTypeNode(filteredUnion[0]);
            if (ts.isTypeReferenceNode(result) || ts.isTypeLiteralNode(result)) {
                typeRefNode = result;
            }
        }
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
                        let arrayItemUnionTypes = arrayItemType.types
                            .filter(undefinedTypeFilter)
                            .filter(nullTypeFilter);
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
                        const md = MetaUtils.getDtMetadata(typeAliasDeclaration, MetaTypes.MDContext.TYPEDEF, null, metaUtilObj) || {};
                        const signature = getGenericsAndTypeParameters(typeAliasDeclaration, metaUtilObj) || {};
                        typedefObj = { ...md['jsdoc'], ...signature };
                        if (typeAliasDeclaration.kind == ts.SyntaxKind.TypeAliasDeclaration ||
                            typeAliasDeclaration.kind == ts.SyntaxKind.InterfaceDeclaration) {
                            const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(symbolType.aliasSymbol ?? symbolType.symbol);
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
function getTypeDefMetadata(typedefType, metaUtilObj, symbolType) {
    let typeDefObj = {};
    let typeName;
    let declaration = typedefType?.aliasSymbol?.declarations[0];
    if (!declaration) {
        declaration = typedefType?.symbol?.declarations[0];
    }
    if (!declaration ||
        (declaration?.kind !== ts.SyntaxKind.TypeAliasDeclaration &&
            declaration?.kind !== ts.SyntaxKind.InterfaceDeclaration)) {
        return typeDefObj;
    }
    const typeAliasDeclaration = declaration;
    let typeToCheck = typeAliasDeclaration.name?.getText();
    if (!typeToCheck) {
        return typeDefObj;
    }
    let isCoreJetType = false;
    if (metaUtilObj.coreJetModuleMapping && metaUtilObj.coreJetModuleMapping.size > 0) {
        for (let key of metaUtilObj.coreJetModuleMapping.keys()) {
            if (new RegExp(`\\b${key}\\b`, 'g').test(typeToCheck) ||
                new RegExp(`\\b${metaUtilObj.coreJetModuleMapping.get(key).binding}\\b`, 'g').test(typeToCheck)) {
                isCoreJetType = true;
                typeDefObj.coreJetModule = typeDefObj.coreJetModule || {};
                if (!typeDefObj.coreJetModule[key]) {
                    typeDefObj.coreJetModule[key] = metaUtilObj.coreJetModuleMapping.get(key).module;
                }
            }
        }
    }
    if (!isCoreJetType) {
        const md = MetaUtils.getDtMetadata(typeAliasDeclaration, MetaTypes.MDContext.COMP, null, metaUtilObj) || {};
        const signature = getGenericsAndTypeParameters(typeAliasDeclaration, metaUtilObj) || {};
        typeDefObj = { ...md['jsdoc'], ...signature };
        if (typeAliasDeclaration.kind == ts.SyntaxKind.TypeAliasDeclaration ||
            typeAliasDeclaration.kind == ts.SyntaxKind.InterfaceDeclaration) {
            const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(symbolType.aliasSymbol ?? symbolType.symbol);
            if (exportedSymbol) {
                let node = typeAliasDeclaration;
                while (!ts.isSourceFile(node)) {
                    node = node.parent;
                }
                const fileName = node.fileName;
                if (fileName && fileName.indexOf('node_modules/typescript/lib/') < 0) {
                    const _isLocalExport = fileName.indexOf(metaUtilObj.fullMetadata['jsdoc'].meta.filename) > -1;
                    if (_isLocalExport || metaUtilObj.followImports) {
                        typeName = typeToCheck;
                    }
                }
            }
        }
    }
    typeDefObj.name = typeName;
    return typeDefObj;
}
exports.getTypeDefMetadata = getTypeDefMetadata;
function isLocalExport(typeRefNode, metaUtilObj) {
    let isLocalExport = false;
    const symbolType = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
    const typeAliasDeclaration = symbolType.aliasSymbol?.declarations?.[0] || symbolType.symbol?.declarations?.[0];
    const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(symbolType.aliasSymbol ?? symbolType.symbol);
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
function addUniqueTypeRefs(target, source) {
    if (target.length == 0) {
        target = target.concat(source);
    }
    else {
        source.forEach((tref) => {
            if (!target.find((node) => node.typeName === tref.typeName)) {
                target.push(tref);
            }
        });
    }
    return target;
}
class ParameterizedTypeDeclIterator {
    constructor(type, typeNode, checker) {
        _ParameterizedTypeDeclIterator_paramSource.set(this, void 0);
        __classPrivateFieldSet(this, _ParameterizedTypeDeclIterator_paramSource, [], "f");
        if (type.aliasSymbol) {
            if (type.aliasTypeArguments) {
                for (const ata of type.aliasTypeArguments) {
                    const paramDecl = ata.aliasSymbol?.getDeclarations()?.[0] ?? ata.symbol?.getDeclarations()?.[0];
                    if (paramDecl) {
                        __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f").push(paramDecl);
                    }
                    else {
                        __classPrivateFieldSet(this, _ParameterizedTypeDeclIterator_paramSource, [], "f");
                        break;
                    }
                }
            }
        }
        else if (typeNode.typeArguments) {
            for (const tNode of typeNode.typeArguments) {
                const tArgType = checker.getTypeAtLocation(tNode);
                const tArgDecl = tArgType.aliasSymbol?.getDeclarations()?.[0] ?? tArgType.symbol?.getDeclarations()?.[0];
                if (tArgDecl) {
                    __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f").push(tArgDecl);
                }
                else {
                    __classPrivateFieldSet(this, _ParameterizedTypeDeclIterator_paramSource, [], "f");
                    break;
                }
            }
        }
    }
    [(_ParameterizedTypeDeclIterator_paramSource = new WeakMap(), Symbol.iterator)]() {
        let index = 0;
        return {
            next: () => {
                if (__classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f") && index < __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f").length) {
                    return { value: __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f")[index++], done: false };
                }
                else {
                    return { done: true };
                }
            }
        };
    }
}
//# sourceMappingURL=MetadataTypeUtils.js.map