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
exports.getGenericsAndTypeParameters = getGenericsAndTypeParameters;
exports.getGenericsAndTypeParametersFromType = getGenericsAndTypeParametersFromType;
exports.getSignatureFromType = getSignatureFromType;
exports.getTypeNameFromTypeReference = getTypeNameFromTypeReference;
exports.getTypeNameFromType = getTypeNameFromType;
exports.getTypeNameFromIntersectionTypes = getTypeNameFromIntersectionTypes;
exports.getNodeDeclaration = getNodeDeclaration;
exports.getTypeDeclaration = getTypeDeclaration;
exports.getTypeReferenceDeclaration = getTypeReferenceDeclaration;
exports.isTypeLiteralType = isTypeLiteralType;
exports.isGenericTypeParameter = isGenericTypeParameter;
exports.getPropertyType = getPropertyType;
exports.getPropertyTypes = getPropertyTypes;
exports.getComplexPropertyMetadata = getComplexPropertyMetadata;
exports.processComplexPropertyMetadata = processComplexPropertyMetadata;
exports.getSubstituteTypeForCircularReference = getSubstituteTypeForCircularReference;
exports.getAllMetadataForDeclaration = getAllMetadataForDeclaration;
exports.possibleComplexProperty = possibleComplexProperty;
exports.isClassDeclaration = isClassDeclaration;
exports.getEnumStringsFromUnion = getEnumStringsFromUnion;
exports.getPossibleTypeDef = getPossibleTypeDef;
exports.getTypeDefMetadata = getTypeDefMetadata;
exports.isLocalExport = isLocalExport;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TransformerError_1 = require("./TransformerError");
const MetadataTypes_1 = require("./MetadataTypes");
const _REGEX_LINE_AND_BLOCK_COMMENTS = new RegExp(/(\/\*(.|[\r\n])*?\*\/)|(\/\/.*)/g);
const _REGEX_EXTRA_WHITESPACE = new RegExp(/\s\s*/g);
const _REGEX_CORE_JET_TYPES = new RegExp(/\/types\/(oj[^\/]*)\/index\.d\.ts/);
const _OR_NULL = '|null';
const _OR_UNDEFINED = '|undefined';
const _KEY_PROP_PLACEHOLDER = '[key]';
const _NON_OBJECT_TYPES = new Set(['Array', 'bigint', 'boolean', 'function', 'number', 'string']);
const _OBJECT_TYPE_ALIAS_EXCEPTIONS = new Set(['Array', 'Map', 'Set', 'Promise']);
const _PRIMITIVE_DATA_TYPES = new Set([
    'string',
    'number',
    'boolean',
    'bigint',
    'symbol',
    'null',
    'undefined'
]);
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
function getSignatureFromType(type, context, scope, isPropSignatureType, seen, metaUtilObj) {
    let typeObj;
    let unionWithNull = false;
    let unionWithUndefined = false;
    let unionTypes = [];
    const checker = metaUtilObj.typeChecker;
    if (type.isUnionOrIntersection()) {
        const unionTypeName = getTypeNameFromType(type);
        if (unionTypeName) {
            if (seen?.has(unionTypeName)) {
                return { type: 'unknown', reftype: unionTypeName };
            }
            else {
                seen = seen ?? new Set();
                seen.add(unionTypeName);
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
        typeObj = getSignatureFromType(checker.getApparentType(type), context, scope, isPropSignatureType, seen, metaUtilObj);
    }
    else {
        const strType = checker.typeToString(type);
        if (type.isUnionOrIntersection()) {
            let typeAliasDecl = getTypeDeclaration(type);
            if (typeAliasDecl && ts.isTypeAliasDeclaration(typeAliasDecl) && type.isIntersection()) {
                if (MetaUtils.isObjectType(type) || checker.getPropertiesOfType(type)?.length > 0) {
                    typeObj = { type: 'object', reftype: strType, isApiDocSignature: true };
                    if (scope == MetaTypes.MDScope.DT) {
                        let typeAliasDeclType = typeAliasDecl.type;
                        addPotentialTypeDefFromType(type, typeAliasDeclType, typeObj, checker, metaUtilObj);
                    }
                }
            }
            else {
                typeObj = getSignatureFromUnionOrIntersectionTypes(unionTypes, context, scope, seen, metaUtilObj, type.isUnion());
            }
        }
        else if (type.isStringLiteral()) {
            typeObj = { type: 'string', enumValues: [type.value] };
        }
        else if (type.isNumberLiteral()) {
            typeObj =
                context & MetaTypes.MDContext.KEYPROPS_KEYS
                    ? { type: 'number', enumNumericKeys: [type.value] }
                    : { type: 'number', reftype: 'number', isApiDocSignature: false };
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
            typeObj = { type: 'string|number', reftype: strType, isApiDocSignature: true };
        }
        else if (type.isTypeParameter()) {
            let constraintTypeObj;
            const constraint = type.getConstraint();
            if (constraint) {
                let constraintWithNull = false;
                let constraintWithUndefined = false;
                constraintTypeObj = getSignatureFromType(constraint, context, scope, isPropSignatureType, seen, metaUtilObj);
                if (constraint.isUnion()) {
                    const constraintSubTypes = constraintTypeObj.type.split(MetaUtils._UNION_SPLITTER);
                    constraintWithNull = constraintSubTypes.indexOf('null') > -1;
                    constraintWithUndefined = constraintSubTypes.indexOf('undefined') > -1;
                    for (const subType of constraintSubTypes) {
                        if (!_PRIMITIVE_DATA_TYPES.has(subType)) {
                            constraintTypeObj = undefined;
                            break;
                        }
                    }
                }
                else if (!_PRIMITIVE_DATA_TYPES.has(constraintTypeObj.type)) {
                    constraintTypeObj = undefined;
                }
                else {
                    constraintWithNull = constraintTypeObj.type === 'null';
                    constraintWithUndefined = constraintTypeObj.type === 'undefined';
                }
                if (constraintTypeObj) {
                    if (unionWithNull && !constraintWithNull) {
                        constraintTypeObj.type += _OR_NULL;
                    }
                    if (unionWithUndefined && !constraintWithUndefined) {
                        constraintTypeObj.type += _OR_UNDEFINED;
                    }
                }
            }
            typeObj = {
                type: constraintTypeObj?.type ?? 'any',
                reftype: strType,
                isApiDocSignature: true
            };
            if (constraintTypeObj?.enumValues) {
                typeObj.enumValues = constraintTypeObj.enumValues;
            }
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
        else if (MetaUtils.isIndexedAccessTypeParameters(type)) {
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
        else if (MetaUtils.isObjectType(type)) {
            typeObj = { type: getTypeNameFromType(type), isApiDocSignature: true };
            let typeObjTypeParams = MetaUtils.getTypeParametersFromType(type, checker);
            typeObj.reftype = typeObjTypeParams ? typeObj.type + typeObjTypeParams : typeObj.type;
            if (typeObj.type === 'Array') {
                typeObj = getSignatureFromArrayType(type, context, scope, strType, seen, metaUtilObj);
                if (isPropSignatureType) {
                    delete typeObj.enumValues;
                }
            }
            else if (!typeObj.type && checker.isArrayLikeType(type) && checker.isTupleType(type)) {
                typeObj = getSignatureFromArrayLikeType(type, context, scope, seen, metaUtilObj);
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
                let isTypePreviouslySeen = false;
                if (type['symbol']) {
                    typeSymbol = type['symbol'];
                    typeDecl = typeSymbol.declarations?.[0];
                }
                if (type['aliasSymbol']) {
                    isTypePreviouslySeen = seen?.has(typeObj.type);
                    if (!isTypePreviouslySeen && !_OBJECT_TYPE_ALIAS_EXCEPTIONS.has(typeObj.type)) {
                        seen = seen ?? new Set();
                        seen.add(typeObj.type);
                    }
                    if (typeSymbol === undefined) {
                        typeSymbol = type['aliasSymbol'];
                        typeDecl = typeSymbol.declarations?.[0];
                        typeDecl = typeDecl.type;
                    }
                }
                if (typeSymbol && typeDecl) {
                    switch (typeDecl.kind) {
                        case ts.SyntaxKind.TypeLiteral:
                            typeObj.type = 'object';
                            if (!typeObj.reftype) {
                                typeObj.reftype = 'object';
                            }
                            if (scope == MetaTypes.MDScope.DT) {
                                addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj);
                            }
                            break;
                        case ts.SyntaxKind.FunctionType:
                            typeObj.type = 'function';
                            typeObj.reftype = strType;
                            if (scope == MetaTypes.MDScope.DT && type['aliasSymbol']) {
                                const aliasSymbol = type['aliasSymbol'];
                                const typeNodeDecl = aliasSymbol.declarations?.[0];
                                const aliasType = checker.getTypeAtLocation(typeNodeDecl);
                                if (aliasType.getCallSignatures().length > 0) {
                                    const signature = aliasType.getCallSignatures()[0];
                                    const funcTypeStr = checker.signatureToString(signature);
                                    typeObj.reftype = funcTypeStr;
                                    const parameters = signature.getParameters();
                                    parameters.forEach((param) => {
                                        const paramType = checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration);
                                        const paramTypeObj = getSignatureFromType(paramType, context, scope, false, seen, metaUtilObj);
                                        if (paramTypeObj.typeDefs && paramTypeObj.typeDefs.length > 0) {
                                            typeObj.typeDefs = typeObj.typeDefs || [];
                                            typeObj.typeDefs = [...typeObj.typeDefs, ...paramTypeObj.typeDefs];
                                        }
                                    });
                                    const returnType = signature.getReturnType();
                                    const returnTypeObj = getSignatureFromType(returnType, context, scope, false, seen, metaUtilObj);
                                    if (returnTypeObj.typeDefs && returnTypeObj.typeDefs.length > 0) {
                                        typeObj.typeDefs = typeObj.typeDefs || [];
                                        typeObj.typeDefs = [...typeObj.typeDefs, ...returnTypeObj.typeDefs];
                                    }
                                }
                            }
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
                        case ts.SyntaxKind.MappedType:
                            typeObj.isApiDocSignature = true;
                            typeObj.type = 'object';
                            if (scope == MetaTypes.MDScope.DT && !isTypePreviouslySeen) {
                                if (MetaUtils.isRecordType(type)) {
                                    const recordInfo = getKeyedPropsTypeInfo(type, context, scope, seen, metaUtilObj);
                                    if (recordInfo) {
                                        const valueTypeObj = getSignatureFromType(recordInfo.valuesType, context, scope, false, seen, metaUtilObj);
                                        if (valueTypeObj.typeDefs && valueTypeObj.typeDefs.length > 0) {
                                            typeObj.typeDefs = typeObj.typeDefs || [];
                                            typeObj.typeDefs = [...typeObj.typeDefs, ...valueTypeObj.typeDefs];
                                        }
                                        typeObj.reftype = `Record<${recordInfo.keysRefType ?? recordInfo.keysTypeName}, ${valueTypeObj.reftype ?? valueTypeObj.type}>`;
                                    }
                                }
                                else {
                                    addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj);
                                }
                            }
                            break;
                        case ts.SyntaxKind.InterfaceDeclaration:
                            if (!isTypePreviouslySeen) {
                                if (typeSymbol.name === 'Array') {
                                    typeObj = getSignatureFromArrayType(type, context, scope, strType, seen, metaUtilObj);
                                    if (isPropSignatureType) {
                                        delete typeObj.enumValues;
                                    }
                                    break;
                                }
                                else if (typeSymbol.name === 'Promise') {
                                    typeObj = { type: 'Promise', reftype: 'Promise<void>', isApiDocSignature: true };
                                    break;
                                }
                                else if (typeSymbol.getName() === 'Set') {
                                    typeObj.type = 'object';
                                    if (scope == MetaTypes.MDScope.DT) {
                                        const typeArgs = checker.getTypeArguments(type);
                                        if (typeArgs.length >= 1) {
                                            const valuesType = typeArgs[0];
                                            const valuesTypeObj = getSignatureFromType(valuesType, context, scope, false, seen, metaUtilObj);
                                            if (valuesTypeObj.typeDefs && valuesTypeObj.typeDefs.length > 0) {
                                                typeObj.typeDefs = typeObj.typeDefs || [];
                                                typeObj.typeDefs = [...typeObj.typeDefs, ...valuesTypeObj.typeDefs];
                                            }
                                            typeObj.type = `Set<${valuesTypeObj.type}>`;
                                            typeObj.reftype = `Set<${valuesTypeObj.reftype ?? valuesTypeObj.type}>`;
                                        }
                                    }
                                    break;
                                }
                                else if (typeSymbol.name === 'Map') {
                                    typeObj.type = 'object';
                                    if (scope == MetaTypes.MDScope.DT) {
                                        const typeArgs = checker.getTypeArguments(type);
                                        if (typeArgs.length >= 2) {
                                            const keysType = typeArgs[0];
                                            const keysTypeObj = getSignatureFromType(keysType, context, scope, false, seen, metaUtilObj);
                                            if (keysTypeObj.typeDefs && keysTypeObj.typeDefs.length > 0) {
                                                typeObj.typeDefs = typeObj.typeDefs || [];
                                                typeObj.typeDefs = [...typeObj.typeDefs, ...keysTypeObj.typeDefs];
                                            }
                                            const valuesType = typeArgs[1];
                                            const valuesTypeObj = getSignatureFromType(valuesType, context, scope, false, seen, metaUtilObj);
                                            if (valuesTypeObj.typeDefs && valuesTypeObj.typeDefs.length > 0) {
                                                typeObj.typeDefs = typeObj.typeDefs || [];
                                                typeObj.typeDefs = [...typeObj.typeDefs, ...valuesTypeObj.typeDefs];
                                            }
                                            typeObj.type = `Map<${keysTypeObj.type}, ${valuesTypeObj.type}>`;
                                            typeObj.reftype = `Map<${keysTypeObj.reftype ?? keysTypeObj.type}, ${valuesTypeObj.reftype ?? valuesTypeObj.type}>`;
                                        }
                                    }
                                    break;
                                }
                                else {
                                    if (!typeObj.reftype) {
                                        typeObj.reftype = 'object';
                                    }
                                    if (scope == MetaTypes.MDScope.DT) {
                                        addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj);
                                    }
                                }
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
function getTypeArgumentsForTypeObject(type, checker) {
    let typeArgs;
    if (type && type.aliasSymbol) {
        typeArgs = type.aliasTypeArguments;
    }
    else {
        typeArgs = checker.getTypeArguments(type);
    }
    return typeArgs;
}
function getItemTypeFromArrayType(arrayType, metaUtilObj) {
    const elementTypes = metaUtilObj.typeChecker.getTypeArguments(arrayType);
    return elementTypes?.[0];
}
function getSignatureFromArrayType(type, context, scope, fallbackType, seen, metaUtilObj) {
    let typeObj;
    const arrayItemType = getItemTypeFromArrayType(type, metaUtilObj);
    if (arrayItemType) {
        const arrayItemTypeObj = getSignatureFromType(arrayItemType, context, scope, false, seen, metaUtilObj);
        typeObj = {
            type: `Array<${arrayItemTypeObj.type}>`,
            reftype: `Array<${arrayItemTypeObj.reftype ?? arrayItemTypeObj.type}>`,
            isApiDocSignature: arrayItemTypeObj.isApiDocSignature,
            typeDefs: arrayItemTypeObj.typeDefs
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
function getSignatureFromArrayLikeType(type, context, scope, seen, metaUtilObj) {
    let typeObj;
    let reftypes = new Array();
    let typeDefs;
    let isApiDocSignature = false;
    const elementTypes = metaUtilObj.typeChecker.getTypeArguments(type);
    if (elementTypes) {
        elementTypes.forEach((typeArg) => {
            const arrayItemTypeObj = getSignatureFromType(typeArg, context, scope, false, seen, metaUtilObj);
            reftypes.push(arrayItemTypeObj.reftype);
            if (arrayItemTypeObj.isApiDocSignature) {
                isApiDocSignature = true;
            }
            if (scope == MetaTypes.MDScope.DT && arrayItemTypeObj.typeDefs) {
                typeDefs = typeDefs || [];
                typeDefs = [...arrayItemTypeObj.typeDefs];
            }
        });
        typeObj = { type: 'Array<object>' };
        if (reftypes.length > 0) {
            typeObj.reftype = `[${reftypes.join(',')}]`;
        }
        typeObj.isApiDocSignature = isApiDocSignature;
        typeObj.typeDefs = typeDefs;
    }
    return typeObj;
}
function getSignatureFromUnionOrIntersectionTypes(unionTypes, context, scope, seen, metaUtilObj, isUnion) {
    let typeObj;
    let types = new Set();
    let reftypes = new Set();
    let typeDefs;
    let enumvalues = new Set();
    let enumnumerickeys = new Set();
    let values;
    let subArrayEnumValues;
    let isEnumValuesForDTOnly = false;
    let subEnumValues = [];
    const checker = metaUtilObj.typeChecker;
    let useRefType = false;
    for (let type of unionTypes) {
        if (MetaUtils.isConditionalType(type)) {
            type = checker.getApparentType(type);
            if (type.isUnionOrIntersection()) {
                const unionTypeObj = getSignatureFromUnionOrIntersectionTypes(type.types, context, scope, seen !== null ? new Set(seen) : null, metaUtilObj, type.isUnion());
                useRefType = unionTypeObj.isApiDocSignature;
                let splitter = MetaUtils._UNION_SPLITTER;
                if (type.isIntersection()) {
                    splitter = MetaUtils._INTERSECTION_SPLITTER;
                }
                const unionTypeArray = unionTypeObj.type.split(splitter);
                unionTypeArray.forEach((typeName) => types.add(typeName));
                if (unionTypeObj.reftype) {
                    const unionRefTypeArray = unionTypeObj.reftype.split(splitter);
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
        else if (context & MetaTypes.MDContext.KEYPROPS_KEYS && type.isNumberLiteral()) {
            types.add('number');
            reftypes.add('number');
            enumnumerickeys.add(type.value);
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
                useRefType = true;
            }
            else if (tFlags & ts.TypeFlags.Object) {
                const objtypeObj = getSignatureFromType(type, context, scope, false, seen !== null ? new Set(seen) : null, metaUtilObj);
                if (objtypeObj.type === 'Array<string>' || objtypeObj.type === 'Array<string|null>') {
                    if (objtypeObj.enumValues?.length > 0) {
                        subArrayEnumValues = objtypeObj.enumValues;
                    }
                }
                types.add(objtypeObj.type);
                reftypes.add(objtypeObj.reftype);
                useRefType = objtypeObj.isApiDocSignature;
                if (scope == MetaTypes.MDScope.DT && objtypeObj.typeDefs) {
                    typeDefs = typeDefs || [];
                    typeDefs = [...typeDefs, ...objtypeObj.typeDefs];
                }
            }
            else if (type.isIntersection()) {
                const primitiveType = getPrimitiveTypeNameFromIntersectionPattern(type);
                if (primitiveType !== undefined) {
                    types.add(primitiveType);
                    reftypes.add(primitiveType);
                }
                else {
                    const objtypeObj = getSignatureFromType(type, context, scope, false, seen !== null ? new Set(seen) : null, metaUtilObj);
                    types.add(objtypeObj.type);
                    reftypes.add(objtypeObj.reftype);
                    useRefType = objtypeObj.isApiDocSignature;
                    if (scope == MetaTypes.MDScope.DT && objtypeObj.typeDefs) {
                        typeDefs = typeDefs || [];
                        typeDefs = [...typeDefs, ...objtypeObj.typeDefs];
                    }
                }
            }
            else {
                const strType = checker.typeToString(type);
                if (MetaUtils.isIndexedAccessTypeParameters(type) || type.isTypeParameter()) {
                    const paramTypeObj = getSignatureFromType(type, context, scope, false, seen !== null ? new Set(seen) : null, metaUtilObj);
                    types.add(paramTypeObj.type);
                    reftypes.add(paramTypeObj.reftype);
                    useRefType = true;
                }
                else {
                    types.add(strType);
                    reftypes.add(strType);
                }
            }
            subEnumValues.push(subArrayEnumValues ?? []);
        }
    }
    if (types.size > 1 && types.has('any')) {
        typeObj = { type: 'any' };
    }
    else {
        values = [...types];
        typeObj = { type: values.join(isUnion ? '|' : '&') };
        if (values.length == 1 && values[0] === 'Array<object>') {
            typeObj.isArrayOfObject = true;
        }
    }
    if (reftypes.size > 0) {
        values = [...reftypes];
        typeObj.reftype = values.join(isUnion ? '|' : ' & ');
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
    if (!isEnumValuesForDTOnly && enumnumerickeys.size > 0) {
        typeObj.enumNumericKeys = [...enumnumerickeys];
    }
    typeObj.isApiDocSignature = useRefType;
    typeObj.typeDefs = typeDefs;
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
function getNodeDeclaration(node, checker) {
    const typeAtLoc = checker.getTypeAtLocation(node);
    return getTypeDeclaration(typeAtLoc);
}
function getTypeDeclaration(type) {
    let declaration = type.aliasSymbol
        ? type.aliasSymbol.declarations?.[0]
        : type.symbol?.declarations?.[0];
    return declaration;
}
function getTypeReferenceDeclaration(type) {
    let typeDecl;
    if (type.flags & ts.SymbolFlags.TypeAlias) {
        if (type['aliasSymbol']) {
            let aliasName = type.aliasSymbol?.name;
            if (aliasName && type.aliasTypeArguments?.length >= 1) {
                if (aliasName === 'Pick' ||
                    aliasName === 'Omit' ||
                    aliasName === 'Partial' ||
                    aliasName === 'Required' ||
                    aliasName === 'Readonly') {
                    typeDecl = getTypeReferenceDeclaration(type.aliasTypeArguments[0]);
                }
            }
            else {
                typeDecl = type['aliasSymbol'].declarations?.[0];
                typeDecl = typeDecl.type;
            }
        }
        else if (type['symbol']) {
            typeDecl = type['symbol'].declarations?.[0];
        }
    }
    return typeDecl;
}
function isTypeLiteralType(type) {
    let declaration = getTypeDeclaration(type);
    return declaration?.kind === ts.SyntaxKind.TypeLiteral;
}
function isGenericTypeParameter(symbol) {
    return symbol.declarations && symbol.declarations[0].kind === ts.SyntaxKind.TypeParameter;
}
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
function getComplexPropertyMetadata(memberSymbol, metaObj, outerType, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs) {
    let seen = new Set();
    if (outerType) {
        seen.add(outerType);
    }
    const returnObj = getComplexPropertyHelper(memberSymbol, metaObj.type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs);
    if (returnObj.circularRefs?.length > 0) {
        const circRefInfo = returnObj.circularRefs.pop();
        return { circRefDetected: { type: circRefInfo.circularType } };
    }
    createTypeDefinitionForPropertyDeclaration(returnObj.subpropsMD, memberSymbol, propertyPath[propertyPath.length - 1], metaObj, context, scope, metaUtilObj, seenTypeDefs);
    const rtnMD = {};
    if (returnObj.subpropsMD) {
        rtnMD.properties = returnObj.subpropsMD;
    }
    if (returnObj.keyedpropsMD) {
        rtnMD.keyedProperties = returnObj.keyedpropsMD;
    }
    return rtnMD;
}
function processComplexPropertyMetadata(property, metaObj, complexMD, dtMetadata) {
    if (complexMD.circRefDetected) {
        dtMetadata.type = getSubstituteTypeForCircularReference(metaObj);
    }
    else {
        if ((complexMD.properties && metaObj.type === 'Array<object>') || complexMD.keyedProperties) {
            dtMetadata.extension = {};
            dtMetadata.extension['vbdt'] = {};
        }
        if (complexMD.properties) {
            if (metaObj.type === 'Array<object>') {
                dtMetadata.extension['vbdt']['itemProperties'] = complexMD.properties;
            }
            else {
                dtMetadata.type = 'object';
                dtMetadata.properties = complexMD.properties;
            }
        }
        if (complexMD.keyedProperties) {
            dtMetadata.extension['vbdt']['keyedProperties'] = complexMD.keyedProperties;
        }
    }
    if (dtMetadata) {
        delete dtMetadata['typeDefs'];
        delete dtMetadata['rawType'];
    }
}
function getSubstituteTypeForCircularReference(metaObj) {
    return metaObj.isArrayOfObject ? 'Array<object>' : 'object';
}
function getAllMetadataForDeclaration(declarationWithType, scope, context, propertyPath, declSymbol, metaUtilObj) {
    let metadata = {
        type: 'any'
    };
    let typeObj;
    let refNodeTypeName;
    const seen = new Set();
    if (metaUtilObj.propsName) {
        seen.add(metaUtilObj.propsName);
    }
    let depth = 2;
    if (propertyPath && propertyPath.length) {
        depth += propertyPath.length;
    }
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
    if (scope == MetaTypes.MDScope.DT) {
        const propTypeStr = declarationWithType.type.getFullText();
        MetaUtils.printInColor(MetadataTypes_1.Color.FgCyan, `with type:${propTypeStr} `, metaUtilObj, depth);
    }
    if (declSymbol) {
        if (MetaUtils.isConditionalTypeNodeDetected(declTypeNode, new Set(seen), metaUtilObj)) {
            const symbolType = metaUtilObj.typeChecker.getTypeOfSymbolAtLocation(declSymbol, declarationWithType);
            if (symbolType) {
                typeObj = getSignatureFromType(symbolType, context, scope, true, seen, metaUtilObj);
            }
        }
    }
    if (!typeObj) {
        if (ts.isParenthesizedTypeNode(declTypeNode)) {
            declTypeNode = declTypeNode.type;
        }
        let readOnlyProp = false;
        if (ts.isTypeReferenceNode(declTypeNode)) {
            refNodeTypeName = getTypeNameFromTypeReference(declTypeNode);
            const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, declTypeNode);
            if (refNodeTypeName === `${exportToAlias.ElementReadOnly}` ||
                refNodeTypeName === `${exportToAlias.ReadOnlyPropertyChanged}`) {
                declTypeNode = declTypeNode.typeArguments?.[0];
                readOnlyProp = true;
            }
        }
        let isPropSignature = ts.isPropertySignature(declarationWithType) || ts.isPropertyDeclaration(declarationWithType);
        const type = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
        typeObj = getSignatureFromType(type, context, scope, isPropSignature, seen, metaUtilObj);
        if (scope == MetaTypes.MDScope.DT && typeObj.typeDefs?.length > 0) {
            typeObj.rawType = metaUtilObj.typeChecker.typeToString(type);
        }
        if (refNodeTypeName) {
            if (MetaUtils.isMappedType(type)) {
                if (MetaUtils.isRecordType(type)) {
                    refNodeTypeName = typeObj.reftype;
                }
                else {
                    refNodeTypeName = metaUtilObj.typeChecker.typeToString(type);
                }
            }
            else if ((readOnlyProp || type.isUnion()) && typeObj.reftype) {
                refNodeTypeName = typeObj.reftype;
            }
            else if (MetaUtils.isFunctionType(type, metaUtilObj.typeChecker)) {
                refNodeTypeName = typeObj.reftype;
            }
            else if (declTypeNode.typeArguments) {
                if (refNodeTypeName !== 'Array' && refNodeTypeName !== 'Set' && refNodeTypeName !== 'Map') {
                    refNodeTypeName += MetaUtils.getGenericTypeParameters(declTypeNode).genericSignature;
                }
                else {
                    refNodeTypeName = typeObj.reftype;
                }
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
function isClassDeclaration(symbolType) {
    if (symbolType.symbol?.valueDeclaration) {
        return ts.isClassDeclaration(symbolType.symbol?.valueDeclaration);
    }
    return false;
}
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
function getComplexPropertyHelper(memberSymbol, type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs) {
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
    if (!(type === 'object' || type === 'any')) {
        if (seen.has(type)) {
            const circRefInfo = {
                circularType: type
            };
            const circularRefs = [circRefInfo];
            return { circularRefs };
        }
        else {
            seen.add(type);
        }
    }
    const subPropsInfo = getSubPropertyMembersInfo(symbolType, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs);
    const rtnObj = {};
    if (subPropsInfo) {
        if (subPropsInfo.processedMembers > 0) {
            rtnObj.subpropsMD = subPropsInfo.metadata;
        }
        if (scope === MetaTypes.MDScope.DT &&
            (subPropsInfo.processedMembers <= 0 || subPropsInfo.indexSignatureMembers > 0)) {
            const objType = symbolType.getNonNullableType();
            if (MetaUtils.isObjectType(objType)) {
                rtnObj.keyedpropsMD = getKeyedPropsTypeMetadata(objType, seen, context | MetaTypes.MDContext.EXTENSION_MD, scope, propertyPath, metaUtilObj);
            }
        }
    }
    return rtnObj;
}
function getKeyedPropsTypeMetadata(objType, seen, context, scope, propertyPath, metaUtilObj) {
    let rtnMD;
    let valuesType;
    let valuesTypeName;
    let valuesProps;
    let valuesKeyedProps;
    const objKeyedPropsInfo = getKeyedPropsTypeInfo(objType, context, scope, seen, metaUtilObj);
    if (objKeyedPropsInfo.type !== MetaTypes.KPType.NONE) {
        valuesType = objKeyedPropsInfo.valuesType;
        if (valuesType) {
            const nestedArrayStack = [];
            const updatedPropertyPath = [...propertyPath, _KEY_PROP_PLACEHOLDER];
            const typeObj = getSignatureFromType(valuesType, context, scope, false, null, metaUtilObj);
            valuesTypeName = typeObj.type;
            valuesType = valuesType.getNonNullableType();
            if (!seen.has(getTypeNameFromType(valuesType))) {
                if (typeObj.isArrayOfObject) {
                    valuesType = getItemTypeFromArrayType(valuesType, metaUtilObj)?.getNonNullableType();
                    if (valuesType && !seen.has(getTypeNameFromType(valuesType))) {
                        nestedArrayStack.push(_KEY_PROP_PLACEHOLDER);
                    }
                    else {
                        valuesType = undefined;
                    }
                }
                if (valuesType && MetaUtils.isObjectType(valuesType)) {
                    const subPropsInfo = getSubPropertyMembersInfo(valuesType, seen, MetaTypes.MDScope.DT, context, updatedPropertyPath, nestedArrayStack, metaUtilObj);
                    if (subPropsInfo) {
                        valuesProps = subPropsInfo.metadata;
                        if (subPropsInfo.processedMembers <= 0 || subPropsInfo.indexSignatureMembers > 0) {
                            valuesKeyedProps = getKeyedPropsTypeMetadata(valuesType, seen, context, scope, updatedPropertyPath, metaUtilObj);
                        }
                    }
                }
            }
            if (objKeyedPropsInfo.type === MetaTypes.KPType.INDEXED || valuesProps || valuesKeyedProps) {
                rtnMD = {};
                if (objKeyedPropsInfo.type !== MetaTypes.KPType.SET) {
                    rtnMD.keys = { type: objKeyedPropsInfo.keysTypeName };
                    if (objKeyedPropsInfo.keysEnum) {
                        rtnMD.keys.enumValues = objKeyedPropsInfo.keysEnum;
                    }
                }
                rtnMD.values = { type: valuesTypeName };
                if (valuesProps) {
                    rtnMD.values.properties = valuesProps;
                }
                if (valuesKeyedProps) {
                    rtnMD.values.keyedProperties = valuesKeyedProps;
                }
            }
        }
    }
    return rtnMD;
}
function getKeyedPropsTypeInfo(objType, context, scope, seen, metaUtilObj) {
    const rtnInfo = { type: MetaTypes.KPType.NONE };
    if (objType.symbol?.getName() === 'Array' ||
        (MetaUtils.isMappedType(objType) &&
            objType.aliasSymbol &&
            objType.aliasTypeArguments?.length >= 1 &&
            isJsLibraryType(objType.aliasTypeArguments[0], JS_DOM_TYPE))) {
        return rtnInfo;
    }
    const checker = metaUtilObj.typeChecker;
    const strIndexInfo = checker.getIndexInfoOfType(objType, ts.IndexKind.String);
    const numIndexInfo = checker.getIndexInfoOfType(objType, ts.IndexKind.Number);
    if (strIndexInfo || numIndexInfo) {
        rtnInfo.type = MetaTypes.KPType.INDEXED;
        if (!strIndexInfo && numIndexInfo) {
            rtnInfo.keysTypeName = 'number';
            rtnInfo.valuesType = numIndexInfo.type;
        }
        else {
            if (strIndexInfo && numIndexInfo) {
                rtnInfo.keysTypeName = 'string|number';
            }
            else {
                rtnInfo.keysTypeName = 'string';
            }
            rtnInfo.valuesType = strIndexInfo.type;
        }
    }
    else {
        let objAlias = objType.aliasSymbol;
        if (objAlias) {
            if (objAlias.getName() === 'Record' && objType.aliasTypeArguments?.length >= 2) {
                rtnInfo.type = MetaTypes.KPType.INDEXED;
                const keyType = objType.aliasTypeArguments[0];
                const keyTypeObj = getSignatureFromType(keyType, context | MetaTypes.MDContext.KEYPROPS_KEYS, scope, false, seen, metaUtilObj);
                rtnInfo.keysTypeName = keyTypeObj.type;
                rtnInfo.keysRefType = keyTypeObj.reftype;
                if (keyTypeObj.enumValues || keyTypeObj.enumNumericKeys) {
                    rtnInfo.keysEnum = [
                        ...(keyTypeObj.enumValues ?? []),
                        ...(keyTypeObj.enumNumericKeys ?? [])
                    ];
                }
                rtnInfo.valuesType = objType.aliasTypeArguments[1];
            }
            else {
                const aliasDecl = objAlias.declarations?.[0];
                if (aliasDecl &&
                    ts.isTypeAliasDeclaration(aliasDecl) &&
                    ts.isTypeReferenceNode(aliasDecl.type) &&
                    aliasDecl.type.typeName.getText() === 'Record' &&
                    aliasDecl.type.typeArguments?.length >= 2) {
                    rtnInfo.type = MetaTypes.KPType.INDEXED;
                    const aliasKeyType = checker.getTypeAtLocation(aliasDecl.type.typeArguments[0]);
                    const keyTypeObj = getSignatureFromType(aliasKeyType, context | MetaTypes.MDContext.KEYPROPS_KEYS, scope, false, seen, metaUtilObj);
                    rtnInfo.keysTypeName = keyTypeObj.type;
                    rtnInfo.keysRefType = keyTypeObj.reftype;
                    if (keyTypeObj.enumValues || keyTypeObj.enumNumericKeys) {
                        rtnInfo.keysEnum = [
                            ...(keyTypeObj.enumValues ?? []),
                            ...(keyTypeObj.enumNumericKeys ?? [])
                        ];
                    }
                    rtnInfo.valuesType = checker.getTypeAtLocation(aliasDecl.type.typeArguments[1]);
                }
            }
        }
    }
    if (rtnInfo.type === MetaTypes.KPType.NONE) {
        const objName = objType.symbol?.getName();
        if (objName === 'Map' || objName === 'Set') {
            const typeArgs = checker.getTypeArguments(objType);
            if (objName === 'Map' && typeArgs.length >= 2) {
                rtnInfo.type = MetaTypes.KPType.MAP;
                const keyType = typeArgs[0];
                const keyTypeObj = getSignatureFromType(keyType, context | MetaTypes.MDContext.KEYPROPS_KEYS, scope, false, seen, metaUtilObj);
                rtnInfo.keysTypeName = keyTypeObj.type;
                if (keyTypeObj.enumValues || keyTypeObj.enumNumericKeys) {
                    rtnInfo.keysEnum = [
                        ...(keyTypeObj.enumValues ?? []),
                        ...(keyTypeObj.enumNumericKeys ?? [])
                    ];
                }
                rtnInfo.valuesType = typeArgs[1];
            }
            else if (objName === 'Set' && typeArgs.length >= 1) {
                rtnInfo.type = MetaTypes.KPType.SET;
                rtnInfo.valuesType = typeArgs[0];
            }
        }
    }
    return rtnInfo;
}
function getSubPropertyMembersInfo(type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs) {
    let processedMembers = 0;
    let indexSignatureMembers = 0;
    const metadata = {};
    MetaUtils.walkTypeMembers(type, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
        if (processedMembers < 0) {
            return;
        }
        if (symbol.declarations === undefined) {
            return;
        }
        const memberType = symbol.declarations[0].kind;
        if (memberType !== ts.SyntaxKind.PropertySignature) {
            if (memberType === ts.SyntaxKind.IndexSignature) {
                indexSignatureMembers += 1;
            }
            else if (memberType !== ts.SyntaxKind.TypeParameter) {
                processedMembers = -1;
            }
            return;
        }
        else {
            processedMembers += 1;
        }
        const prop = key;
        const updatedPath = [...propertyPath, prop];
        const depth = 2 + updatedPath.length;
        if (scope == MetaTypes.MDScope.DT) {
            const propPathStr = updatedPath.join('->');
            MetaUtils.printInColor(MetadataTypes_1.Color.FgCyan, `getAllMetadataForDeclaration:  ${propPathStr}`, metaUtilObj, depth);
        }
        const metaObj = getAllMetadataForDeclaration(symbol.valueDeclaration, scope == MetaTypes.MDScope.RT ? MetaTypes.MDScope.RT_EXTENDED : scope, nestedArrayStack.length === 0 ? context : context | MetaTypes.MDContext.EXTENSION_MD, updatedPath, symbol, metaUtilObj);
        let typeName = metaObj.type;
        const circularRefInfo = checkForCircularReference(metaObj, seen);
        if (circularRefInfo) {
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
            if (scope == MetaTypes.MDScope.DT) {
                if (context & MetaTypes.MDContext.TYPEDEF &&
                    seenTypeDefs &&
                    seenTypeDefs.has(metaObj.rawType)) {
                    MetaUtils.printInColor(MetadataTypes_1.Color.FgYellow, `getComplexPropertyHelper: circular reference, return`, metaUtilObj, depth);
                    metadata[prop] = metaObj;
                    return;
                }
                const propPathStr = updatedPath.join('->');
                MetaUtils.printInColor(MetadataTypes_1.Color.FgCyan, `getComplexPropertyHelper: for: ${propPathStr}`, metaUtilObj, depth);
            }
            const returnObj = getComplexPropertyHelper(symbol, typeName, new Set(seen), scope, nestedArrayStack.length === 0 ? context : context | MetaTypes.MDContext.EXTENSION_MD, updatedPath, nestedArrayStack, metaUtilObj, seenTypeDefs);
            if (isExtensionMd) {
                nestedArrayStack.pop();
            }
            metadata[prop] = metaObj;
            if (returnObj.circularRefs?.length > 0) {
                returnObj.circularRefs.pop();
                metadata[prop].type = getSubstituteTypeForCircularReference(metaObj);
            }
            else {
                if (returnObj.subpropsMD) {
                    if (metaObj.isArrayOfObject) {
                        metadata[prop].type = 'Array<object>';
                        if (scope == MetaTypes.MDScope.DT) {
                            if (nestedArrayStack.length == 0 && !(context & MetaTypes.MDContext.EXTENSION_MD)) {
                                metadata[prop].extension = {};
                                metadata[prop].extension['vbdt'] = {};
                                metadata[prop].extension['vbdt']['itemProperties'] = returnObj.subpropsMD;
                            }
                            else {
                                metadata[prop].properties = returnObj.subpropsMD;
                            }
                        }
                    }
                    else {
                        metadata[prop].type = 'object';
                        metadata[prop].properties = returnObj.subpropsMD;
                    }
                }
                if (returnObj.keyedpropsMD && scope == MetaTypes.MDScope.DT) {
                    if (nestedArrayStack.length == 0 && !(context & MetaTypes.MDContext.EXTENSION_MD)) {
                        metadata[prop].extension = metadata[prop].extension ?? {};
                        metadata[prop].extension['vbdt'] = metadata[prop].extension['vbdt'] ?? {};
                        metadata[prop].extension['vbdt']['keyedProperties'] = returnObj.keyedpropsMD;
                    }
                    else {
                        metadata[prop]['keyedProperties'] = returnObj.keyedpropsMD;
                    }
                }
                createTypeDefinitionForPropertyDeclaration(returnObj.subpropsMD, symbol, prop, metaObj, context, scope, metaUtilObj, seenTypeDefs);
            }
        }
        delete metadata[prop]['typeDefs'];
        delete metadata[prop]['rawType'];
        if (scope != MetaTypes.MDScope.DT) {
            delete metadata[prop]['isArrayOfObject'];
            delete metadata[prop]['reftype'];
            delete metadata[prop]['isApiDocSignature'];
            delete metadata[prop]['circularRef'];
        }
    });
    const rtnInfo = {
        processedMembers,
        indexSignatureMembers
    };
    if (processedMembers > 0) {
        rtnInfo.metadata = metadata;
    }
    return rtnInfo;
}
function checkForCircularReference(circularTypeObj, seen) {
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
function getCoreJetModule(symbolType) {
    let jetModule;
    let declaration = symbolType?.symbol?.declarations[0];
    if (declaration && declaration.parent) {
        while (!ts.isSourceFile(declaration)) {
            declaration = declaration.parent;
        }
        const sourceFile = declaration;
        const sourceFileName = sourceFile.fileName;
        if (sourceFile.isDeclarationFile && sourceFileName) {
            const match = sourceFileName.match(_REGEX_CORE_JET_TYPES);
            if (match) {
                jetModule = match[1];
            }
        }
    }
    return jetModule;
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
function addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj) {
    let typeArgTypes = getTypeArgumentsForTypeObject(type, checker);
    if (typeArgTypes) {
        typeArgTypes.forEach((typeArg) => {
            if (typeArg.flags & ts.SymbolFlags.TypeAlias) {
                let typeArgDecl = getTypeReferenceDeclaration(typeArg);
                if (typeArgDecl) {
                    const typeDefObj = getTypeDefMetadata(typeArg, metaUtilObj);
                    if (typeDefObj && typeDefObj.name) {
                        typeDefObj.typeReference = typeArgDecl;
                        typeObj.typeDefs = typeObj.typeDefs || [];
                        typeObj.typeDefs.push(typeDefObj);
                    }
                }
            }
        });
    }
    const typeDefObj = getTypeDefMetadata(type, metaUtilObj);
    if (typeDefObj && typeDefObj.name) {
        typeDefObj.typeReference = typeDecl;
        typeObj.typeDefs = typeObj.typeDefs || [];
        typeObj.typeDefs.push(typeDefObj);
    }
}
function getPossibleTypeDef(prop, memberSymbol, metaObj, metaUtilObj) {
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
                if (typeRefNode) {
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
                    typedefObj = getTypeDefMetadata(typeNode, metaUtilObj);
                }
            }
        }
        catch (ex) {
            console.log(`Unexpected error happened during typdef lookup for ${prop}`);
        }
    }
    return typedefObj;
}
function getTypeDefMetadata(typedefType, metaUtilObj) {
    const isImportFromThisModule = (importedKey) => {
        const bindings = metaUtilObj.coreJetModuleMapping.get(importedKey);
        return bindings?.fileName === metaUtilObj.fullMetadata['jsdoc']['meta'].fileName;
    };
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
    if (getCoreJetModule(typedefType)) {
        if (metaUtilObj.coreJetModuleMapping && metaUtilObj.coreJetModuleMapping.size > 0) {
            for (let key of metaUtilObj.coreJetModuleMapping.keys()) {
                if (new RegExp(`\\b${key}\\b`, 'g').test(typeToCheck) ||
                    (new RegExp(`\\b${metaUtilObj.coreJetModuleMapping.get(key).binding}\\b`, 'g').test(typeToCheck) &&
                        isImportFromThisModule(key))) {
                    isCoreJetType = true;
                    typeDefObj.coreJetModule = typeDefObj.coreJetModule || {};
                    if (!typeDefObj.coreJetModule[key]) {
                        typeDefObj.coreJetModule[key] = metaUtilObj.coreJetModuleMapping.get(key).module;
                        typeName = key;
                    }
                }
            }
            if (!isCoreJetType) {
                let jetModule = getCoreJetModule(typedefType);
                if (jetModule) {
                    isCoreJetType = true;
                    typeName = typeToCheck;
                    typeDefObj.coreJetModule = typeDefObj.coreJetModule || {};
                    if (!typeDefObj.coreJetModule[typeToCheck]) {
                        typeDefObj.coreJetModule[typeToCheck] = jetModule;
                    }
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
            const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(typedefType.aliasSymbol ?? typedefType.symbol);
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
function createTypeDefinitionForPropertyDeclaration(subProps, memberSymbol, property, metaObj, context, scope, metaUtilObj, seenTypeDefs) {
    let createTypeDef = true;
    const indent = 2;
    if (scope == MetaTypes.MDScope.DT) {
        if (subProps && Object.keys(subProps).length > 0) {
            const typeDef = getPossibleTypeDef(property, memberSymbol, metaObj, metaUtilObj);
            if (typeDef && (typeDef.name || typeDef.coreJetModule)) {
                MetaUtils.printInColor(MetadataTypes_1.Color.FgGreen, `Trying to create typeDef ${typeDef.name}...`, metaUtilObj, indent);
                if (typeDef.coreJetModule) {
                    MetaUtils.printInColor(MetadataTypes_1.Color.FgYellow, `typeDef is Core JET type`, metaUtilObj, indent);
                }
                if (Array.isArray(metaObj.typeDefs)) {
                    const targetTypeDef = metaObj.typeDefs.find((td) => td.name === typeDef.name);
                    if (!targetTypeDef) {
                        createTypeDef = false;
                    }
                    else {
                        let propSymbolType = metaUtilObj.typeChecker
                            .getTypeOfSymbolAtLocation(memberSymbol, memberSymbol.valueDeclaration)
                            .getNonNullableType();
                        if (MetaUtils.isMappedType(propSymbolType)) {
                            const mappedTypeName = getTypeNameFromType(propSymbolType);
                            if (mappedTypeName == 'Omit' || mappedTypeName == 'Pick') {
                                createTypeDef = false;
                            }
                        }
                    }
                }
                if (createTypeDef) {
                    if (!MetaUtils.findTypeDefByName(typeDef, metaUtilObj)) {
                        typeDef.properties = subProps;
                        metaUtilObj.typeDefinitions.push(typeDef);
                        MetaUtils.printInColor(MetadataTypes_1.Color.FgGreen, `Created TypeDef: ${typeDef.name} for property: ${property} with type: ${metaObj.reftype}`, metaUtilObj, indent);
                    }
                    else {
                        MetaUtils.printInColor(MetadataTypes_1.Color.FgGreen, `typeDef ${typeDef.name} was already created, skip`, metaUtilObj, indent);
                    }
                }
            }
            else {
                createTypeDef = false;
                MetaUtils.printInColor(MetadataTypes_1.Color.FgYellow, `Could not find a possible typeDef`, metaUtilObj, indent);
            }
        }
        else {
            createTypeDef = false;
            MetaUtils.printInColor(MetadataTypes_1.Color.FgYellow, `No subprops, could not create typeDef`, metaUtilObj, indent);
        }
        if (!createTypeDef) {
            if (metaObj && metaObj.typeDefs) {
                const propDeclTypeStr = metaObj.rawType;
                let stack = new Set();
                if (propDeclTypeStr) {
                    if (context & MetaTypes.MDContext.TYPEDEF && seenTypeDefs) {
                        stack = seenTypeDefs;
                    }
                    stack.add(propDeclTypeStr);
                    MetaUtils.createTypeDefinitionFromTypeRefs(metaObj.typeDefs.map((t) => t.typeReference), metaUtilObj, stack);
                }
            }
        }
    }
}
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