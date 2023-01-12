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
exports.generateStatementsFromText = exports.getValueFromNode = exports.updateRtExtensionMetadata = exports.pruneMetadata = exports.pruneCompilerMetadata = exports.updateCompilerCompMetadata = exports.updateCompilerPropsMetadata = exports.walkTypeNodeMembers = exports.walkTypeMembers = exports.isConditionalTypeNodeDetected = exports._UNION_SPLITTER = exports.isTypeTreatedAsAny = exports.isObjectType = exports.isConditionalType = exports.isMappedType = exports.constructMappedTypeName = exports.getWrappedReadonlyType = exports.isAliasToMappedType = exports.isPropsMappedType = exports.getMappedTypesInfo = exports.getIntersectionTypeNodeInfo = exports.getPropsInfo = exports.updateFunctionalVCompNode = exports.addMetadataToClassNode = exports.getDtMetadata = exports.getTypeParametersFromType = exports.getGenericTypeParameters = exports.stringToJS = exports.writebackCallbackToProperty = exports.tagNameToElementName = exports.tagNameToElementInterfaceName = void 0;
const ts = __importStar(require("typescript"));
const DecoratorUtils = __importStar(require("./DecoratorUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
const vm = __importStar(require("vm"));
function tagNameToElementInterfaceName(tagName) {
    return `${tagNameToElementName(tagName)}Element`;
}
exports.tagNameToElementInterfaceName = tagNameToElementInterfaceName;
function tagNameToElementName(tagName) {
    return tagName
        .toLowerCase()
        .match(/-(?<match>.*)/)[0]
        .replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}
exports.tagNameToElementName = tagNameToElementName;
function writebackCallbackToProperty(property) {
    if (/^on[A-Z].*Changed$/.test(property)) {
        return property[2].toLowerCase() + property.substring(3, property.length - 7);
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
                return _execBundle(value);
            default:
                return undefined;
        }
    }
    catch (ex) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.CANNOT_CONVERT_TO_JSON, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Unable to convert the default value '${value}' to JSON for property '${memberName}'.`);
        return undefined;
    }
}
exports.stringToJS = stringToJS;
function getGenericTypeParameters(propsTypeNode) {
    let genericSignature = '<';
    for (let i = 0; i < propsTypeNode.typeArguments.length; i++) {
        const typeRefNode = propsTypeNode.typeArguments[i];
        const typeName = typeRefNode.typeName && ts.isIdentifier(typeRefNode.typeName)
            ? ts.idText(typeRefNode.typeName)
            : typeRefNode.typeName && ts.isQualifiedName(typeRefNode.typeName)
                ? ts.idText(typeRefNode.typeName.right)
                : ts.isTypeLiteralNode(typeRefNode)
                    ? 'object'
                    : typeRefNode.getText();
        genericSignature += typeName;
        const typeNode = typeRefNode;
        if (typeNode.typeArguments && typeNode.typeArguments.length) {
            genericSignature += getGenericTypeParameters(typeNode);
        }
        if (i < propsTypeNode.typeArguments.length - 1) {
            genericSignature += ', ';
        }
    }
    genericSignature += '>';
    return genericSignature;
}
exports.getGenericTypeParameters = getGenericTypeParameters;
function getTypeParametersFromType(type, checker) {
    var _a;
    let typeParamsSignature;
    let typeArgs;
    if (type.aliasSymbol) {
        typeArgs = type.aliasTypeArguments;
    }
    else {
        typeArgs = checker.getTypeArguments(type);
    }
    if (Array.isArray(typeArgs) && typeArgs.length) {
        typeParamsSignature = '<';
        for (let i = 0; i < typeArgs.length; i++) {
            const typeArg = typeArgs[i];
            const typeArgName = (_a = TypeUtils.getTypeNameFromType(typeArg)) !== null && _a !== void 0 ? _a : checker.typeToString(typeArg);
            typeParamsSignature += typeArgName;
            if ((typeArg.typeArguments && typeArg.typeArguments.length) ||
                (typeArg.aliasTypeArguments && typeArg.aliasTypeArguments.length)) {
                typeParamsSignature += getTypeParametersFromType(typeArg, checker);
            }
            if (i < typeArgs.length - 1) {
                typeParamsSignature += ', ';
            }
        }
        typeParamsSignature += '>';
    }
    return typeParamsSignature;
}
exports.getTypeParametersFromType = getTypeParametersFromType;
const _METADATA_TAG = 'ojmetadata';
const _METADATA_ARRAYS = [
    'implements',
    'params',
    'preferredContent',
    'propertyLayout',
    'status',
    'styleClasses',
    'styleVariables'
];
function getDtMetadata(objWithJsDoc, flags, propertyPath, metaUtilObj) {
    const dt = {};
    const tags = ts.getJSDocTags(objWithJsDoc);
    for (const tag of tags) {
        if (ts.idText(tag.tagName) === _METADATA_TAG) {
            let [mdKey, mdVal] = _getDtMetadataNameValue(tag, metaUtilObj);
            if (mdKey) {
                if (mdKey === 'value') {
                    if (!(flags & MetaTypes.MDFlags.PROP)) {
                        continue;
                    }
                    else if (!(flags & (MetaTypes.MDFlags.PROP_RO_WRITEBACK | MetaTypes.MDFlags.EXT_ITEMPROPS))) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `${_generateDefaultValueWarning(metaUtilObj.componentInfo, propertyPath)}`, tag);
                        continue;
                    }
                }
                if (mdKey === 'styleVariableSet') {
                    if (mdVal.styleVariables && Array.isArray(mdVal.styleVariables)) {
                        mdKey = 'styleVariables';
                        mdVal = mdVal.styleVariables.slice();
                    }
                    else {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_STYLEVARIABLESET, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Invalid 'styleVariableSet' DT metadata specified: ${mdVal}`, tag);
                    }
                }
                if ((flags & MetaTypes.MDFlags.COMP && ['version', 'jetVersion'].indexOf(mdKey) > -1) ||
                    !dt[mdKey]) {
                    if (_METADATA_ARRAYS.indexOf(mdKey) > -1 && !Array.isArray(mdVal)) {
                        mdVal = [mdVal];
                    }
                    if (mdKey === 'styleClasses') {
                        let styleClasses = mdVal;
                        styleClasses.forEach((sc) => {
                            if (sc.extension) {
                                delete sc.extension['jet'];
                                if (Object.getOwnPropertyNames(sc.extension).length == 0) {
                                    delete sc.extension;
                                }
                            }
                            if (sc.scope == 'protected') {
                                delete sc.help;
                            }
                        });
                    }
                    dt[mdKey] = mdVal;
                }
                else {
                    if (!Array.isArray(dt[mdKey])) {
                        dt[mdKey] = [dt[mdKey]];
                    }
                    if (!Array.isArray(mdVal)) {
                        dt[mdKey].push(mdVal);
                    }
                    else {
                        dt[mdKey] = dt[mdKey].concat(mdVal);
                    }
                }
            }
        }
        else if (ts.idText(tag.tagName) === 'classdesc' || ts.idText(tag.tagName) === 'description') {
            dt['jsdoc'] = dt['jsdoc'] || {};
            dt['jsdoc']['description'] = removeQuotes(ts.getTextOfJSDocComment(tag.comment));
        }
        else if (ts.idText(tag.tagName) === 'example') {
            dt['jsdoc'] = dt['jsdoc'] || {};
            dt['jsdoc']['example'] = dt['jsdoc']['example'] || [];
            dt['jsdoc']['example'].push(ts.getTextOfJSDocComment(tag.comment));
        }
        else if (ts.idText(tag.tagName) === 'typeparam') {
            dt['jsdoc'] = dt['jsdoc'] || {};
            dt['jsdoc']['typeparams'] = dt['jsdoc']['typeparams'] || [];
            let [mdKey, mdVal] = _getDtMetadataNameValue(tag, metaUtilObj);
            dt['jsdoc']['typeparams'].push({ name: mdKey, description: mdVal });
        }
        else if (ts.idText(tag.tagName) === 'returns' || ts.idText(tag.tagName) === 'return') {
            dt['jsdoc'] = dt['jsdoc'] || {};
            dt['jsdoc']['returns'] = ts.getTextOfJSDocComment(tag.comment);
        }
        else if (ts.idText(tag.tagName) === 'ignore') {
            dt['jsdoc'] = dt['jsdoc'] || {};
            dt['jsdoc']['ignore'] = true;
        }
    }
    if (!dt['jsdoc'] || !dt['jsdoc']['description']) {
        if (objWithJsDoc['jsDoc']) {
            let commentNode = objWithJsDoc['jsDoc'][0];
            if (commentNode && commentNode.kind === ts.SyntaxKind.JSDocComment && commentNode.comment) {
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['description'] = removeQuotes(ts.getTextOfJSDocComment(commentNode.comment));
            }
        }
    }
    return dt;
}
exports.getDtMetadata = getDtMetadata;
function addMetadataToClassNode(vcompClassInfo, metadata) {
    const classNode = vcompClassInfo.classNode;
    let additionalPropDecls = [];
    if (Object.keys(metadata).length > 0) {
        const metadataNode = _metadataToAstNodes(metadata);
        additionalPropDecls.push(ts.factory.createPropertyDeclaration(ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), '_metadata', undefined, undefined, metadataNode));
    }
    if (vcompClassInfo.translationBundleMapExpression) {
        additionalPropDecls.push(ts.factory.createPropertyDeclaration(ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), '_translationBundleMap', undefined, undefined, vcompClassInfo.translationBundleMapExpression));
    }
    if (vcompClassInfo.consumedContextsExpression) {
        additionalPropDecls.push(ts.factory.createPropertyDeclaration(ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), '_consumedContexts', undefined, undefined, vcompClassInfo.consumedContextsExpression));
    }
    if (additionalPropDecls.length === 0) {
        return classNode;
    }
    else {
        const updatedMembers = classNode.members.concat(additionalPropDecls);
        return ts.factory.updateClassDeclaration(classNode, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, updatedMembers);
    }
}
exports.addMetadataToClassNode = addMetadataToClassNode;
function updateFunctionalVCompNode(functionalCompNode, vcompFunctionInfo, metaUtilObj) {
    var _a, _b;
    const rtMetadata = metaUtilObj.rtMetadata;
    const needPlaceholderArgs = !!vcompFunctionInfo.translationBundleMapExpression || !!vcompFunctionInfo.contextsExpression;
    const defDisplayNameExpression = ts.factory.createStringLiteral((_a = vcompFunctionInfo.componentName) !== null && _a !== void 0 ? _a : `VComponent(${(_b = vcompFunctionInfo.functionName) !== null && _b !== void 0 ? _b : vcompFunctionInfo.elementName})`);
    const compRegisterCall = vcompFunctionInfo.compRegisterCall;
    const updatedCallArgs = [
        compRegisterCall.arguments[0],
        compRegisterCall.arguments[1]
    ];
    updatedCallArgs.push(defDisplayNameExpression);
    if (Object.keys(rtMetadata).length > 0) {
        updatedCallArgs.push(_metadataToAstNodes(rtMetadata));
        if (metaUtilObj.defaultProps) {
            updatedCallArgs.push(_metadataToAstNodes(metaUtilObj.defaultProps));
        }
        else if (needPlaceholderArgs) {
            updatedCallArgs.push(ts.factory.createIdentifier('undefined'));
        }
    }
    else if (needPlaceholderArgs) {
        updatedCallArgs.push(ts.factory.createIdentifier('undefined'), ts.factory.createIdentifier('undefined'));
    }
    if (vcompFunctionInfo.translationBundleMapExpression) {
        updatedCallArgs.push(vcompFunctionInfo.translationBundleMapExpression);
    }
    else if (vcompFunctionInfo.contextsExpression) {
        updatedCallArgs.push(ts.factory.createIdentifier('undefined'));
    }
    if (vcompFunctionInfo.contextsExpression) {
        updatedCallArgs.push(vcompFunctionInfo.contextsExpression);
    }
    const updatedCompRegisterCall = ts.factory.updateCallExpression(compRegisterCall, compRegisterCall.expression, compRegisterCall.typeArguments, updatedCallArgs);
    if (ts.isVariableStatement(functionalCompNode)) {
        const updatedVarDeclArray = functionalCompNode.declarationList.declarations.map((varDecl, i) => {
            if (i === 0) {
                return ts.factory.updateVariableDeclaration(varDecl, varDecl.name, varDecl.exclamationToken, varDecl.type, updatedCompRegisterCall);
            }
            else {
                return varDecl;
            }
        });
        const updatedVarDeclList = ts.factory.updateVariableDeclarationList(functionalCompNode.declarationList, updatedVarDeclArray);
        return ts.factory.updateVariableStatement(functionalCompNode, functionalCompNode.modifiers, updatedVarDeclList);
    }
    else {
        return ts.factory.updateExpressionStatement(functionalCompNode, updatedCompRegisterCall);
    }
}
exports.updateFunctionalVCompNode = updateFunctionalVCompNode;
function getPropsInfo(compType, componentName, typeRef, vexportToAlias, checker) {
    var _a, _b, _c;
    let rtnInfo = null;
    let rtnObservedGlobalProps = new Set();
    let rtnMappedTypes = [];
    let rtnTypeNode;
    let rtnEGPRef = null;
    let isAliasToEGP = false;
    let isUnwrappedROType = false;
    let propsTypeParamsNode;
    let propsTypeSubstituteName;
    if (compType === MetaTypes.VCompType.FUNCTION) {
        rtnTypeNode = typeRef;
        propsTypeParamsNode = rtnTypeNode;
    }
    else {
        let typeRefName = TypeUtils.getTypeNameFromTypeReference(typeRef);
        if (typeRefName === vexportToAlias.ExtendGlobalProps) {
            rtnEGPRef = typeRef;
            rtnTypeNode = (_a = typeRef.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
            propsTypeParamsNode = rtnTypeNode;
        }
        else {
            isAliasToEGP = true;
            propsTypeParamsNode = typeRef;
            propsTypeSubstituteName = typeRefName;
            const typeRefType = checker.getTypeAtLocation(typeRef);
            if (typeRefType.aliasSymbol) {
                const aliasSymbolDeclaration = typeRefType.aliasSymbol.declarations[0];
                if (ts.isTypeAliasDeclaration(aliasSymbolDeclaration)) {
                    const aliasType = aliasSymbolDeclaration.type;
                    if (ts.isTypeReferenceNode(aliasType) &&
                        TypeUtils.getTypeNameFromTypeReference(aliasType) === vexportToAlias.ExtendGlobalProps) {
                        rtnEGPRef = aliasType;
                        rtnTypeNode = (_b = aliasType.typeArguments) === null || _b === void 0 ? void 0 : _b[0];
                    }
                }
            }
            else {
                const symbolDeclaration = (_c = typeRefType.symbol) === null || _c === void 0 ? void 0 : _c.declarations[0];
                if (ts.isInterfaceDeclaration(symbolDeclaration) ||
                    ts.isClassDeclaration(symbolDeclaration)) {
                    const heritageClauses = symbolDeclaration.heritageClauses;
                    if (heritageClauses) {
                        for (let clause of heritageClauses) {
                            if (rtnTypeNode) {
                                break;
                            }
                            for (let type of clause.types) {
                                if (TypeUtils.getTypeNameFromTypeReference(type) === vexportToAlias.ExtendGlobalProps) {
                                    rtnEGPRef = type;
                                    rtnTypeNode = type.typeArguments[0];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (rtnTypeNode) {
        let intersectionInlinePropsInfo;
        let rtnIsInlineIntersectionType = false;
        let rtnIsObservedGlobalPropsOnly = false;
        let mappedTypeGenericsDeclaration;
        if (ts.isIntersectionTypeNode(rtnTypeNode)) {
            intersectionInlinePropsInfo = getIntersectionTypeNodeInfo(rtnTypeNode, vexportToAlias, true, checker);
            if (intersectionInlinePropsInfo.substituteTypeNode) {
                rtnTypeNode = intersectionInlinePropsInfo.substituteTypeNode;
            }
            else {
                rtnIsInlineIntersectionType = true;
            }
            if (intersectionInlinePropsInfo.observedProps) {
                for (const oProp of intersectionInlinePropsInfo.observedProps) {
                    rtnObservedGlobalProps.add(oProp);
                }
            }
        }
        let rtnType = checker.getTypeAtLocation(rtnTypeNode);
        if (rtnType) {
            const mappedTypesInfo = getMappedTypesInfo(rtnType, checker, true, rtnTypeNode);
            if (mappedTypesInfo) {
                rtnMappedTypes = mappedTypesInfo.mappedTypes;
                rtnTypeNode = mappedTypesInfo.wrappedTypeNode;
                if (!isAliasToEGP) {
                    propsTypeParamsNode = rtnTypeNode;
                }
                mappedTypeGenericsDeclaration = TypeUtils.getNodeDeclaration(rtnTypeNode, checker);
            }
            else if (isAliasToMappedType(rtnType, rtnTypeNode)) {
                const unwrappedType = getWrappedReadonlyType(rtnType, rtnTypeNode, componentName, checker);
                if (unwrappedType) {
                    rtnType = unwrappedType;
                    isUnwrappedROType = true;
                }
                mappedTypeGenericsDeclaration = _getScopedSymbolDeclaration(rtnTypeNode, checker);
            }
            let rtnIsInlineTypeLiteral = ts.isTypeLiteralNode(rtnTypeNode);
            let rtnPropsName;
            if (rtnIsInlineIntersectionType) {
                rtnPropsName = intersectionInlinePropsInfo.propsName;
            }
            else if (rtnIsInlineTypeLiteral) {
                rtnPropsName = propsTypeSubstituteName;
            }
            else {
                rtnPropsName = TypeUtils.getTypeNameFromTypeReference(rtnTypeNode);
                if (rtnPropsName === vexportToAlias.ObservedGlobalProps) {
                    rtnIsObservedGlobalPropsOnly = true;
                    const ogpArray = _getObservedGlobalPropsArray(rtnTypeNode);
                    for (const ogProp of ogpArray) {
                        rtnObservedGlobalProps.add(ogProp);
                    }
                }
                else if (!isUnwrappedROType) {
                    const rtnTypeDeclaration = TypeUtils.getTypeDeclaration(rtnType);
                    if (ts.isTypeAliasDeclaration(rtnTypeDeclaration)) {
                        const aliasTypeNode = rtnTypeDeclaration.type;
                        if (ts.isIntersectionTypeNode(aliasTypeNode)) {
                            const aliasIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo(aliasTypeNode, vexportToAlias, false, checker);
                            if (aliasIntersectionTypeNodeInfo.observedProps) {
                                for (const ogProp of aliasIntersectionTypeNodeInfo.observedProps) {
                                    rtnObservedGlobalProps.add(ogProp);
                                }
                            }
                        }
                        else if (ts.isTypeReferenceNode(aliasTypeNode) &&
                            TypeUtils.getTypeNameFromTypeReference(aliasTypeNode) ===
                                vexportToAlias.ObservedGlobalProps) {
                            rtnIsObservedGlobalPropsOnly = true;
                            const ogpArray = _getObservedGlobalPropsArray(aliasTypeNode);
                            for (const ogProp of ogpArray) {
                                rtnObservedGlobalProps.add(ogProp);
                            }
                        }
                    }
                }
            }
            rtnInfo = {
                propsType: rtnType,
                propsName: rtnPropsName,
                propsNode: rtnTypeNode,
                propsMappedTypes: rtnMappedTypes,
                propsExtendGlobalPropsRef: rtnEGPRef
            };
            if (!(rtnIsInlineIntersectionType || rtnIsObservedGlobalPropsOnly)) {
                if (mappedTypeGenericsDeclaration) {
                    rtnInfo.propsGenericsDeclaration = mappedTypeGenericsDeclaration;
                }
                else {
                    rtnInfo.propsGenericsDeclaration = !rtnIsInlineTypeLiteral
                        ? TypeUtils.getTypeDeclaration(rtnType)
                        : TypeUtils.getNodeDeclaration(propsTypeParamsNode, checker);
                }
                if (propsTypeParamsNode.typeArguments) {
                    rtnInfo.propsTypeParams = getGenericTypeParameters(propsTypeParamsNode);
                }
            }
            if (rtnObservedGlobalProps.size > 0) {
                rtnInfo.propsObservedGlobalProps = [...rtnObservedGlobalProps];
            }
        }
    }
    return rtnInfo;
}
exports.getPropsInfo = getPropsInfo;
function getIntersectionTypeNodeInfo(intersectionTypeNode, vexportToAlias, isInline, checker) {
    let rtnInfo = {};
    let filteredTypeNodes = [];
    let observedProps = [];
    const typeNodes = intersectionTypeNode.types;
    for (let node of typeNodes) {
        if (ts.isTypeReferenceNode(node)) {
            if (TypeUtils.getTypeNameFromTypeReference(node) === vexportToAlias.ObservedGlobalProps) {
                observedProps = observedProps.concat(_getObservedGlobalPropsArray(node));
                continue;
            }
            else {
                const typeRefType = checker.getTypeFromTypeNode(node);
                const typeRefDecl = TypeUtils.getTypeDeclaration(typeRefType);
                if (ts.isTypeAliasDeclaration(typeRefDecl)) {
                    const aliasTypeNode = typeRefDecl.type;
                    if (ts.isIntersectionTypeNode(aliasTypeNode)) {
                        const aliasIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo(aliasTypeNode, vexportToAlias, false, checker);
                        if (aliasIntersectionTypeNodeInfo.observedProps) {
                            observedProps = observedProps.concat(aliasIntersectionTypeNodeInfo.observedProps);
                        }
                    }
                }
            }
        }
        if (isInline) {
            filteredTypeNodes.push(node);
        }
    }
    if (filteredTypeNodes.length > 0) {
        if (filteredTypeNodes.length == 1) {
            rtnInfo.substituteTypeNode = filteredTypeNodes[0];
        }
        else {
            const types = filteredTypeNodes.map((node) => checker.getTypeAtLocation(node));
            if (types.length) {
                rtnInfo.propsName = TypeUtils.getTypeNameFromIntersectionTypes(types);
            }
        }
    }
    if (observedProps.length > 0) {
        rtnInfo.observedProps = observedProps;
    }
    return rtnInfo;
}
exports.getIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo;
const _MAPPED_TYPENAMES = new Set(['Partial', 'Required', 'Readonly', 'Pick', 'Omit']);
function getMappedTypesInfo(outerType, checker, isPropsInfo, outerTypeNode) {
    var _a;
    let rtnInfo = null;
    let mappedTypes = [];
    let wrappedType = outerType;
    let wrappedTypeNode = outerTypeNode;
    while (wrappedType && isPropsInfo
        ? isPropsMappedType(wrappedType, wrappedTypeNode)
        : isMappedType(wrappedType)) {
        const mappedTypeName = TypeUtils.getTypeNameFromType(wrappedType);
        const mappedTypeArgs = wrappedType.aliasTypeArguments;
        if (mappedTypeName && mappedTypeArgs) {
            let params = mappedTypeArgs
                .slice(1)
                .map((t) => checker.typeToString(t))
                .join(', ');
            const mappedEntry = {
                name: mappedTypeName
            };
            if (params !== '') {
                mappedEntry.params = params;
            }
            mappedTypes.push(mappedEntry);
            if (wrappedTypeNode) {
                wrappedTypeNode = (_a = wrappedTypeNode.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
                wrappedType = wrappedTypeNode ? checker.getTypeAtLocation(wrappedTypeNode) : null;
            }
            else {
                wrappedType = mappedTypeArgs[0];
            }
        }
        else {
            break;
        }
    }
    if (mappedTypes.length > 0 && wrappedType) {
        rtnInfo = {
            mappedTypes,
            wrappedTypeName: TypeUtils.getTypeNameFromType(wrappedType)
        };
        if (wrappedTypeNode) {
            rtnInfo.wrappedTypeNode = wrappedTypeNode;
        }
    }
    return rtnInfo;
}
exports.getMappedTypesInfo = getMappedTypesInfo;
function isPropsMappedType(type, typeNode) {
    return (isMappedType(type) &&
        _MAPPED_TYPENAMES.has(typeNode
            ? TypeUtils.getTypeNameFromTypeReference(typeNode)
            : TypeUtils.getTypeNameFromType(type)));
}
exports.isPropsMappedType = isPropsMappedType;
function isAliasToMappedType(type, typeNode) {
    return (isMappedType(type) &&
        !_MAPPED_TYPENAMES.has(TypeUtils.getTypeNameFromTypeReference(typeNode)));
}
exports.isAliasToMappedType = isAliasToMappedType;
function getWrappedReadonlyType(type, typeNode, componentName, checker) {
    var _a, _b, _c, _d;
    let rtnType = null;
    if (((_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.name) === 'Readonly') {
        const typeArg = (_b = type.aliasTypeArguments) === null || _b === void 0 ? void 0 : _b[0];
        const typeArgName = (_c = typeArg === null || typeArg === void 0 ? void 0 : typeArg.aliasSymbol) === null || _c === void 0 ? void 0 : _c.name;
        if (!typeArgName || !_MAPPED_TYPENAMES.has(typeArgName)) {
            if (typeArg.symbol) {
                const unwrappedNode = typeArg.symbol.declarations[0];
                rtnType = checker.getTypeAtLocation(unwrappedNode);
            }
            else {
                if (typeArg.isIntersection()) {
                    const foundOGP = typeArg.types.find((subtype) => TypeUtils.getTypeNameFromType(subtype) === 'ObservedGlobalProps');
                    if (foundOGP) {
                        const aliasDecl = _getScopedSymbolDeclaration(typeNode, checker);
                        const errNode = (_d = aliasDecl.name) !== null && _d !== void 0 ? _d : typeNode;
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_OBSERVEDGLOBALPROPS_INSTANCE, TransformerError_1.ExceptionType.THROW_ERROR, componentName, `An unsupported ObservedGlobalProps instance was detected within a Readonly Props intersection type.
Remove the ObservedGlobalProps instance from the intersection type, and instead have it intersect with the Readonly Props type.`, errNode);
                    }
                }
                rtnType = typeArg;
            }
        }
    }
    return rtnType;
}
exports.getWrappedReadonlyType = getWrappedReadonlyType;
function constructMappedTypeName(mappedTypesInfo, wrappedTypeGenerics) {
    let rtnName = '';
    let paramsStack = [];
    let poppedParams;
    const mappedTypesLast = mappedTypesInfo.mappedTypes.length - 1;
    mappedTypesInfo.mappedTypes.forEach((mType, i) => {
        rtnName += mType.name;
        if (mType.params) {
            paramsStack.push(mType.params);
        }
        else {
            paramsStack.push(null);
        }
        rtnName += '<';
        if (i === mappedTypesLast) {
            rtnName += mappedTypesInfo.wrappedTypeName;
            if (wrappedTypeGenerics) {
                rtnName += wrappedTypeGenerics;
            }
            while (paramsStack.length > 0) {
                if ((poppedParams = paramsStack.pop())) {
                    rtnName += `, ${poppedParams}>`;
                }
                else {
                    rtnName += '>';
                }
            }
        }
    });
    return rtnName;
}
exports.constructMappedTypeName = constructMappedTypeName;
function isMappedType(type) {
    var _a, _b;
    let decl = (_b = (_a = type.symbol) === null || _a === void 0 ? void 0 : _a.declarations) === null || _b === void 0 ? void 0 : _b[0];
    return decl && ts.isMappedTypeNode(decl);
}
exports.isMappedType = isMappedType;
function isConditionalType(type) {
    return !!(type['flags'] & ts.TypeFlags.Conditional);
}
exports.isConditionalType = isConditionalType;
function isObjectType(type) {
    return !!(type['flags'] & ts.TypeFlags.Object);
}
exports.isObjectType = isObjectType;
function isTypeTreatedAsAny(type) {
    return !!(type['flags'] & (ts.TypeFlags.Any | ts.TypeFlags.Unknown));
}
exports.isTypeTreatedAsAny = isTypeTreatedAsAny;
exports._UNION_SPLITTER = /\s*\|\s*/;
function isConditionalTypeNodeDetected(typeNode, seen, metaUtilObj) {
    var _a;
    let foundIt = false;
    if (ts.isConditionalTypeNode(typeNode)) {
        foundIt = true;
    }
    else if (ts.isTypeReferenceNode(typeNode)) {
        const typeName = TypeUtils.getTypeNameFromTypeReference(typeNode);
        if (typeName === 'Array' && ((_a = typeNode.typeArguments) === null || _a === void 0 ? void 0 : _a[0])) {
            foundIt = isConditionalTypeNodeDetected(typeNode.typeArguments[0], seen, metaUtilObj);
        }
        else if (!seen.has(typeName)) {
            seen.add(typeName);
            const typeDecl = TypeUtils.getNodeDeclaration(typeNode, metaUtilObj.typeChecker);
            const aliasTypeNode = typeDecl === null || typeDecl === void 0 ? void 0 : typeDecl.type;
            if (aliasTypeNode) {
                foundIt = isConditionalTypeNodeDetected(aliasTypeNode, seen, metaUtilObj);
            }
        }
    }
    else if (ts.isUnionTypeNode(typeNode)) {
        for (const unionNode of typeNode.types) {
            if (isConditionalTypeNodeDetected(unionNode, seen, metaUtilObj)) {
                foundIt = true;
                break;
            }
        }
    }
    else if (ts.isArrayTypeNode(typeNode)) {
        foundIt = isConditionalTypeNodeDetected(typeNode.elementType, seen, metaUtilObj);
    }
    else if (ts.isParenthesizedTypeNode(typeNode)) {
        foundIt = isConditionalTypeNodeDetected(typeNode.type, seen, metaUtilObj);
    }
    return foundIt;
}
exports.isConditionalTypeNodeDetected = isConditionalTypeNodeDetected;
function walkTypeMembers(type, metaUtilObj, callback) {
    const isExcludedType = function (type, metaUtilObj) {
        var _a, _b, _c, _d, _e;
        let rtnValue = false;
        const tname = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.name;
        if (tname && ((_b = metaUtilObj.excludedTypes) === null || _b === void 0 ? void 0 : _b.has(tname))) {
            rtnValue = true;
        }
        else {
            const decl = (_d = (_c = type.aliasSymbol) === null || _c === void 0 ? void 0 : _c.declarations) === null || _d === void 0 ? void 0 : _d[0];
            if (decl &&
                ts.isTypeAliasDeclaration(decl) &&
                ts.isTypeReferenceNode(decl.type) &&
                ((_e = metaUtilObj.excludedTypeAliases) === null || _e === void 0 ? void 0 : _e.has(TypeUtils.getTypeNameFromTypeReference(decl.type)))) {
                rtnValue = true;
            }
        }
        return rtnValue;
    };
    const getConstituentTypes = function (type, metaUtilObj, typeMap) {
        const checker = metaUtilObj.typeChecker;
        if (type.isIntersection()) {
            const intersectionTypes = type.types;
            for (let t of intersectionTypes) {
                getConstituentTypes(t, metaUtilObj, typeMap);
            }
        }
        else {
            const typeDecl = TypeUtils.getTypeDeclaration(type);
            if (typeDecl) {
                if (ts.isClassLike(typeDecl) || ts.isInterfaceDeclaration(typeDecl)) {
                    const heritageClauses = typeDecl.heritageClauses;
                    if (heritageClauses) {
                        for (let clause of heritageClauses) {
                            for (let typeRef of clause.types) {
                                const inheritedTypeName = TypeUtils.getTypeNameFromTypeReference(typeRef);
                                if (!typeMap[inheritedTypeName]) {
                                    const typeRefType = checker.getTypeAtLocation(typeRef);
                                    if (typeRefType) {
                                        getConstituentTypes(typeRefType, metaUtilObj, typeMap);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isExcludedType(type, metaUtilObj)) {
                const typeName = isMappedType(type) || isConditionalType(type)
                    ? checker.typeToString(type)
                    : TypeUtils.getTypeNameFromType(type);
                if (!typeMap[typeName]) {
                    typeMap[typeName] = type;
                }
            }
        }
    };
    const processMembers = function (type, checker, callback) {
        var _a;
        if (!isMappedType(type) && !isConditionalType(type)) {
            const members = (_a = type.getSymbol()) === null || _a === void 0 ? void 0 : _a.members;
            if (members) {
                members.forEach((memberSymbol, memberKey) => {
                    callback(memberSymbol, memberKey);
                });
            }
        }
        else {
            const propSymbols = checker.getPropertiesOfType(type);
            if (propSymbols) {
                const propCount = propSymbols.length;
                let rootSymbols;
                if (isMappedType(type)) {
                    rootSymbols = propSymbols.map((sym) => {
                        var _a;
                        return (_a = checker.getRootSymbols(sym)) === null || _a === void 0 ? void 0 : _a[0];
                    });
                }
                for (let symbol, i = 0; i < propCount; i++) {
                    if (rootSymbols === null || rootSymbols === void 0 ? void 0 : rootSymbols[i]) {
                        symbol = rootSymbols[i];
                        callback(symbol, symbol.getEscapedName(), propSymbols[i]);
                    }
                    else {
                        symbol = propSymbols[i];
                        callback(symbol, symbol.getEscapedName());
                    }
                }
            }
        }
    };
    let typeMap = {};
    getConstituentTypes(type, metaUtilObj, typeMap);
    const typeKeys = Object.keys(typeMap);
    const checker = metaUtilObj.typeChecker;
    for (let k of typeKeys) {
        processMembers(typeMap[k], checker, callback);
    }
}
exports.walkTypeMembers = walkTypeMembers;
function walkTypeNodeMembers(typeNode, metaUtilObj, callback) {
    const typeAtLoc = metaUtilObj.typeChecker.getTypeAtLocation(typeNode);
    walkTypeMembers(typeAtLoc, metaUtilObj, callback);
}
exports.walkTypeNodeMembers = walkTypeNodeMembers;
function updateCompilerPropsMetadata(propsInfo, readOnlyPropNameNodes, metaUtilObj) {
    if (propsInfo.propsTypeParams) {
        metaUtilObj.fullMetadata['propsTypeParams'] = propsInfo.propsTypeParams;
    }
    if (propsInfo.propsMappedTypes.length > 0) {
        metaUtilObj.fullMetadata['propsMappedTypes'] = propsInfo.propsMappedTypes.slice();
    }
    let declaration = propsInfo.propsGenericsDeclaration;
    if (declaration &&
        (ts.isClassDeclaration(declaration) ||
            ts.isTypeAliasDeclaration(declaration) ||
            ts.isInterfaceDeclaration(declaration))) {
        const propsNode = declaration;
        const genericsInfo = TypeUtils.getGenericsAndTypeParameters(propsNode, true);
        metaUtilObj.fullMetadata['propsClassTypeParamsDeclaration'] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsDeclaration;
        metaUtilObj.fullMetadata['propsClassTypeParams'] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParams;
        metaUtilObj.fullMetadata['propsTypeParamsAny'] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParamsAny;
    }
    metaUtilObj.fullMetadata['propsClassName'] = propsInfo.propsName;
    metaUtilObj.fullMetadata['readOnlyProps'] =
        (readOnlyPropNameNodes === null || readOnlyPropNameNodes === void 0 ? void 0 : readOnlyPropNameNodes.length) > 0 ? readOnlyPropNameNodes.map((item) => item.name) : [];
}
exports.updateCompilerPropsMetadata = updateCompilerPropsMetadata;
function updateCompilerCompMetadata(vcompInfo, metaUtilObj) {
    var _a, _b, _c;
    if (MetaTypes.isClassInfo(vcompInfo)) {
        const classNode = vcompInfo.classNode;
        if (classNode.typeParameters) {
            const genericsInfo = TypeUtils.getGenericsAndTypeParameters(classNode);
            metaUtilObj.fullMetadata['classTypeParamsDeclaration'] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsDeclaration;
            metaUtilObj.fullMetadata['classTypeParams'] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParams;
        }
        const classDecorators = DecoratorUtils.getDecorators(classNode, metaUtilObj.aliasToNamedExport);
        const consumedBindingsDecorator = classDecorators[metaUtilObj.namedExportToAlias.consumedBindings];
        if (consumedBindingsDecorator) {
            metaUtilObj.classConsumedBindingsDecorator = consumedBindingsDecorator;
        }
        const providedBindingsDecorator = classDecorators[metaUtilObj.namedExportToAlias.providedBindings];
        if (providedBindingsDecorator) {
            metaUtilObj.classProvidedBindingsDecorator = providedBindingsDecorator;
        }
        const consumedContextsDecorator = classDecorators[metaUtilObj.namedExportToAlias.consumedContexts];
        if (consumedContextsDecorator) {
            const args = DecoratorUtils.getDecoratorArguments(consumedContextsDecorator);
            if (args.length === 1) {
                vcompInfo.consumedContextsExpression = args[0];
            }
        }
    }
    else {
        if (vcompInfo.componentNode['typeParameters']) {
            const genericsInfo = TypeUtils.getGenericsAndTypeParameters(vcompInfo.componentNode);
            metaUtilObj.fullMetadata['classTypeParamsDeclaration'] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsDeclaration;
            metaUtilObj.fullMetadata['classTypeParams'] = genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParams;
        }
        if (vcompInfo.propBindings) {
            metaUtilObj.functionPropBindings = vcompInfo.propBindings;
        }
        if ((_a = vcompInfo.additionalImports) === null || _a === void 0 ? void 0 : _a.length) {
            metaUtilObj.fullMetadata['additionalImports'] = [...vcompInfo.additionalImports];
        }
        if (vcompInfo.useComponentPropsForSettableProperties) {
            metaUtilObj.fullMetadata['useComponentPropsForSettableProperties'] = true;
        }
    }
    if ((_b = vcompInfo.additionalImports) === null || _b === void 0 ? void 0 : _b.length) {
        metaUtilObj.fullMetadata['additionalImports'] = [...vcompInfo.additionalImports];
    }
    if ((_c = vcompInfo.propsInfo) === null || _c === void 0 ? void 0 : _c.propsType.aliasTypeArguments) {
        metaUtilObj.classPropsAliasTypeArgs = vcompInfo.propsInfo.propsType.aliasTypeArguments;
    }
}
exports.updateCompilerCompMetadata = updateCompilerCompMetadata;
const dummyEventDetail = {
    description: '',
    enumValues: [],
    extension: {},
    eventGroup: '',
    properties: {},
    status: [],
    type: ''
};
const dummySlotData = {
    description: '',
    extension: {},
    properties: {},
    status: [],
    type: ''
};
const validEventSubProps = {
    detail: new Set(Object.keys(dummyEventDetail))
};
const validSlotSubProps = {
    data: new Set(Object.keys(dummySlotData))
};
function pruneCompilerMetadata(metaUtilObj) {
    delete metaUtilObj.fullMetadata['classTypeParams'];
    delete metaUtilObj.fullMetadata['classTypeParamsDeclaration'];
    delete metaUtilObj.fullMetadata['propsTypeParams'];
    delete metaUtilObj.fullMetadata['propsMappedTypes'];
    delete metaUtilObj.fullMetadata['propsClassTypeParamsDeclaration'];
    delete metaUtilObj.fullMetadata['propsClassTypeParams'];
    delete metaUtilObj.fullMetadata['propsTypeParamsAny'];
    delete metaUtilObj.fullMetadata['ojLegacyVComponent'];
    delete metaUtilObj.fullMetadata['propsClassName'];
    delete metaUtilObj.fullMetadata['readOnlyProps'];
    delete metaUtilObj.fullMetadata['jsdoc'];
    delete metaUtilObj.fullMetadata['additionalImports'];
    delete metaUtilObj.fullMetadata['useComponentPropsForSettableProperties'];
    delete metaUtilObj.fullMetadata['funcVCompMethodSignatures'];
    pruneMetadata(metaUtilObj.fullMetadata.properties);
    pruneMetadata(metaUtilObj.fullMetadata.methods);
    pruneMetadata(metaUtilObj.fullMetadata.events);
    for (let event in metaUtilObj.fullMetadata.events) {
        _pruneSubPropMetadata(metaUtilObj.fullMetadata.events[event], validEventSubProps);
    }
    pruneMetadata(metaUtilObj.fullMetadata.slots);
    for (let slot in metaUtilObj.fullMetadata.slots) {
        _pruneSubPropMetadata(metaUtilObj.fullMetadata.slots[slot], validSlotSubProps);
    }
    pruneMetadata(metaUtilObj.fullMetadata.dynamicSlots);
    for (let dynSlot in metaUtilObj.fullMetadata.dynamicSlots) {
        _pruneSubPropMetadata(metaUtilObj.fullMetadata.dynamicSlots[dynSlot], validSlotSubProps);
    }
}
exports.pruneCompilerMetadata = pruneCompilerMetadata;
function pruneMetadata(metadata) {
    if (metadata && typeof metadata == 'object') {
        delete metadata['reftype'];
        delete metadata['optional'];
        delete metadata['isArrayOfObject'];
        delete metadata['isStringTypeExplicit'];
        delete metadata['evnDetailTypeParamsDeclaration'];
        delete metadata['evnDetailNameTypeParams'];
        delete metadata['jsdoc'];
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
function getValueFromNode(exp) {
    let value = undefined;
    switch (exp.kind) {
        case ts.SyntaxKind.StringLiteral:
            value = exp.text;
            break;
        case ts.SyntaxKind.NumericLiteral:
            value = Number(exp.text);
            break;
        case ts.SyntaxKind.TrueKeyword:
            value = true;
            break;
        case ts.SyntaxKind.FalseKeyword:
            value = false;
            break;
        case ts.SyntaxKind.NullKeyword:
            value = null;
            break;
        case ts.SyntaxKind.ArrayLiteralExpression:
            value = _getArrayLiteral(exp);
            break;
        case ts.SyntaxKind.ObjectLiteralExpression:
            value = _getObjectLiteral(exp);
            break;
    }
    return value;
}
exports.getValueFromNode = getValueFromNode;
function generateStatementsFromText(text) {
    let tmpNode = ts.createSourceFile('temp.ts', text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX);
    _fixSingleQuoteAndNodeFlagsRecursively(tmpNode);
    tmpNode.statements.forEach((stmt) => ts.setEmitFlags(stmt, ts.EmitFlags.NoNestedComments));
    return tmpNode.statements;
}
exports.generateStatementsFromText = generateStatementsFromText;
function _fixSingleQuoteAndNodeFlagsRecursively(node) {
    if (node.kind == ts.SyntaxKind.StringLiteral && !node['singleQuote']) {
        node['singleQuote'] = true;
    }
    node.flags |= ts.NodeFlags.Synthesized;
    node.forEachChild((child) => _fixSingleQuoteAndNodeFlagsRecursively(child));
}
function _generateDefaultValueWarning(componentInfo, propertyPath) {
    let msg;
    const propPath = (propertyPath === null || propertyPath === void 0 ? void 0 : propertyPath.length) ? propertyPath.join('.') : '<unknown>';
    msg = `Property '${propPath}' - ignored JSDoc annotation specifying a default value.`;
    if (MetaTypes.isFunctionInfo(componentInfo)) {
        msg +=
            '\nSpecify the default value using an object binding pattern for the Props argument of the function component.';
    }
    else {
        msg += "\nSpecify the default value in the component class's static 'defaultProps' field.";
    }
    return msg;
}
function _pruneSubPropMetadata(metaelement, validSubPropMap) {
    for (let metaprop in metaelement) {
        const validSubPropSet = validSubPropMap[metaprop];
        if (validSubPropSet) {
            const metadata = metaelement[metaprop];
            for (let prop in metadata) {
                for (let subprop in metadata[prop]) {
                    if (!validSubPropSet.has(subprop)) {
                        delete metadata[prop][subprop];
                    }
                }
            }
        }
    }
}
function _getArrayLiteral(arrayExpression) {
    let retArray = [];
    arrayExpression.elements.forEach((element) => {
        const item = getValueFromNode(element);
        if (!(item === null || item === undefined)) {
            retArray.push(item);
        }
    });
    return retArray;
}
function _getObjectLiteral(objExpression) {
    let retObj = {};
    objExpression.properties.forEach((prop) => {
        if (ts.isPropertyAssignment(prop)) {
            const propKey = prop.name.getText();
            retObj[propKey] = getValueFromNode(prop.initializer);
        }
    });
    return retObj;
}
function _getScopedSymbolDeclaration(typeNode, checker) {
    let scopedSymbolDeclaration;
    const scopedTypeAliases = checker.getSymbolsInScope(typeNode, ts.SymbolFlags.TypeAlias);
    const aliasTypeName = TypeUtils.getTypeNameFromTypeReference(typeNode);
    const scopedAliasSymbol = scopedTypeAliases.find((sym) => {
        return sym.getName() === aliasTypeName;
    });
    if (scopedAliasSymbol) {
        scopedSymbolDeclaration = scopedAliasSymbol.getDeclarations()[0];
    }
    return scopedSymbolDeclaration;
}
function _getObservedGlobalPropsArray(refNode) {
    var _a;
    let observedProps = [];
    const node = (_a = refNode.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
    if (ts.isLiteralTypeNode(node)) {
        const literal = node.literal;
        if (ts.isStringLiteral(literal)) {
            observedProps.push(literal.text);
        }
    }
    else if (ts.isUnionTypeNode(node)) {
        observedProps = observedProps.concat(TypeUtils.getEnumStringsFromUnion(node));
    }
    return observedProps;
}
function _getDtMetadataNameValue(tag, metaUtilObj) {
    let mdKey, mdVal;
    let commentText = ts.getTextOfJSDocComment(tag.comment);
    if (commentText) {
        const dtMdTagText = commentText.trim();
        const mdkeySep = dtMdTagText.indexOf(' ');
        if (mdkeySep > 0) {
            mdKey = dtMdTagText.substr(0, mdkeySep);
            mdVal = dtMdTagText.substr(mdkeySep + 1).trim();
            mdVal = _normalizeDtMetadataValue(mdKey, mdVal, tag, metaUtilObj);
            try {
                mdVal = _execBundle(mdVal);
            }
            catch (e) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MALFORMED_METADATA_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Malformed metadata value '${mdVal}' for key '${mdKey}'.`, tag);
            }
        }
        else {
            mdKey = dtMdTagText;
            mdVal = true;
        }
    }
    return [mdKey, mdVal];
}
const _STRING_METADATA_KEYS = new Set([
    'description',
    'displayName',
    'help',
    'license',
    'pack',
    'eventGroup',
    'internalName',
    'name',
    'dynamicSlotDef',
    'format',
    'placeholder',
    'propertyGroup',
    'units'
]);
const _STRING_ARRAY_METADATA_KEYS = new Set(['implements', 'preferredContent']);
function _normalizeDtMetadataValue(key, value, tag, metaUtilObj) {
    let isStringNormalizationNeeded = false;
    if (_STRING_METADATA_KEYS.has(key) ||
        (_STRING_ARRAY_METADATA_KEYS.has(key) &&
            !(value.charAt(0) === '[' && value.charAt(value.length - 1) === ']'))) {
        isStringNormalizationNeeded = true;
        const start = value.charAt(0);
        const end = value.charAt(value.length - 1);
        if ((start === '"' || start === "'") && start !== end) {
            const matchingEndQuoteIndex = value.lastIndexOf(start);
            if (matchingEndQuoteIndex > 0) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.TRIMMED_METADATA_STRING, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'${key}' text beyond the matching quote character was trimmed for metadata value: ${value}`, tag);
                value = value.substring(0, matchingEndQuoteIndex + 1);
            }
        }
        if (value.match(/^(['"])(?:[\s\S])*?\1$/)) {
            if (value.length > 2) {
                value = value.substring(1, value.length - 1);
            }
            else if (value.length === 2) {
                isStringNormalizationNeeded = false;
            }
        }
    }
    if (isStringNormalizationNeeded) {
        value = `"${value.replace(/\s+/g, ' ').replace(/['"]/g, '\\$&').trim()}"`;
    }
    return value;
}
function _metadataToAstNodes(value) {
    if (Array.isArray(value)) {
        return ts.factory.createArrayLiteralExpression(value.map((item) => _metadataToAstNodes(item)));
    }
    switch (typeof value) {
        case 'string':
            return ts.factory.createStringLiteral(value);
        case 'number':
            return ts.factory.createNumericLiteral(String(value));
        case 'boolean':
            return value ? ts.factory.createTrue() : ts.factory.createFalse();
        case 'object':
            if (!value) {
                return ts.factory.createNull();
            }
            const keys = Object.keys(value);
            return ts.factory.createObjectLiteralExpression(keys.map((key) => {
                return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), _metadataToAstNodes(value[key]));
            }));
    }
}
function _execBundle(src) {
    const script = new vm.Script(`ret(${src})`);
    const result = script.runInContext(vm.createContext({
        ret: function (t) {
            return t;
        }
    }));
    return result;
}
function removeQuotes(str) {
    if (str) {
        return str.replace(/^['"]/g, '').replace(/['"]$/g, '');
    }
    return str;
}
//# sourceMappingURL=MetadataUtils.js.map