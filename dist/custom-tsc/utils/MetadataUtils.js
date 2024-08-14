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
exports.createTypeDefinitionFromTypeRefs = exports.removeQuotes = exports.generateStatementsFromText = exports.getMDValueFromNode = exports.getValueNodeFromPropertyAccessExpression = exports.getValueNodeFromIdentifier = exports.getValueNodeFromReference = exports.isValueNodeReference = exports.removeCastExpressions = exports.updateRtExtensionMetadata = exports.pruneMetadata = exports.pruneCompilerMetadata = exports.updateCompilerCompMetadata = exports.updateCompilerPropsMetadata = exports.walkTypeNodeMembers = exports.walkTypeMembers = exports.isConditionalTypeNodeDetected = exports._UNION_SPLITTER = exports.isTypeTreatedAsAny = exports.isObjectType = exports.isConditionalType = exports.isMappedType = exports.constructMappedTypeName = exports.getWrappedReadonlyType = exports.isAliasToMappedType = exports.isPropsMappedType = exports.isMappedTypeReference = exports.getMappedTypesInfo = exports.getIntersectionTypeNodeInfo = exports.getPropsInfo = exports.updateFunctionalVCompNode = exports.addMetadataToClassNode = exports.getDtMetadata = exports.getTypeParametersFromType = exports.getGenericTypeParameters = exports.writebackCallbackToProperty = exports.tagNameToElementRoot = exports.tagNameToElementInterfaceName = void 0;
const ts = __importStar(require("typescript"));
const DecoratorUtils = __importStar(require("./DecoratorUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaValid = __importStar(require("./MetadataValidationUtils"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
const vm = __importStar(require("vm"));
const _OJMETADATA_TAG = 'ojmetadata';
const _IGNORED_BIGINT_DEFAULT_VALUE_MSG_HEADER = 'Default values of type BigInt are not reflected in the generated custom element JSON metadata.';
const _IGNORED_FUNCTION_DEFAULT_VALUE_MSG_HEADER = 'Default values of type Function are not reflected in the generated custom element JSON metadata.';
const _IGNORED_ARRAY_DEFAULT_VALUE_MSG_HEADER = 'Default array values with items of an unsupported type are not reflected in the generated custom element JSON metadata.';
function tagNameToElementInterfaceName(tagName) {
    return `${tagNameToElementRoot(tagName)}Element`;
}
exports.tagNameToElementInterfaceName = tagNameToElementInterfaceName;
function tagNameToElementRoot(tagName) {
    return tagName
        .toLowerCase()
        .match(/-(?<match>.*)/)[0]
        .replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}
exports.tagNameToElementRoot = tagNameToElementRoot;
function writebackCallbackToProperty(property) {
    if (/^on[A-Z].*Changed$/.test(property)) {
        return property[2].toLowerCase() + property.substring(3, property.length - 7);
    }
    return null;
}
exports.writebackCallbackToProperty = writebackCallbackToProperty;
function getGenericTypeParameters(propsTypeNode) {
    let genericSignature = '<';
    const genericTypeParamsArray = [];
    for (let i = 0; i < propsTypeNode.typeArguments.length; i++) {
        const typeRefNode = propsTypeNode.typeArguments[i];
        let typeName = typeRefNode.typeName && ts.isIdentifier(typeRefNode.typeName)
            ? ts.idText(typeRefNode.typeName)
            : typeRefNode.typeName && ts.isQualifiedName(typeRefNode.typeName)
                ? ts.idText(typeRefNode.typeName.right)
                : ts.isTypeLiteralNode(typeRefNode)
                    ? 'object'
                    : typeRefNode.getText();
        const typeNode = typeRefNode;
        if (typeNode.typeArguments && typeNode.typeArguments.length) {
            const subGenerics = getGenericTypeParameters(typeNode);
            typeName += subGenerics.genericSignature;
        }
        genericTypeParamsArray.push(typeName);
        genericSignature += typeName;
        if (i < propsTypeNode.typeArguments.length - 1) {
            genericSignature += ', ';
        }
    }
    genericSignature += '>';
    return {
        genericSignature,
        genericTypeParamsArray
    };
}
exports.getGenericTypeParameters = getGenericTypeParameters;
function getTypeParametersFromType(type, checker) {
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
            const typeArgName = TypeUtils.getTypeNameFromType(typeArg) ?? checker.typeToString(typeArg);
            typeParamsSignature += typeArgName;
            if ((typeArg.typeArguments && typeArg.typeArguments.length) ||
                (typeArg.aliasTypeArguments && typeArg.aliasTypeArguments.length)) {
                typeParamsSignature += getTypeParametersFromType(typeArg, checker) ?? '';
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
function getDtMetadata(objWithJsDoc, context, propertyPath, metaUtilObj) {
    const dt = {};
    const tags = ts.getJSDocTags(objWithJsDoc);
    for (const tag of tags) {
        if (ts.idText(tag.tagName) === _OJMETADATA_TAG) {
            let [mdKey, mdVal, mdValidationInfo] = _getOjMetadataTuple(tag, metaUtilObj);
            if (mdKey && MetaValid.isValidMetadata(mdKey, mdVal, mdValidationInfo, tag, metaUtilObj)) {
                if (mdKey === 'value' && !(context & MetaTypes.MDContext.TYPEDEF)) {
                    if (!(context & MetaTypes.MDContext.PROP)) {
                        continue;
                    }
                    else if (!(context & (MetaTypes.MDContext.PROP_RO_WRITEBACK | MetaTypes.MDContext.EXT_ITEMPROPS))) {
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
                        continue;
                    }
                }
                if (mdValidationInfo.isArray && !Array.isArray(mdVal)) {
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
                if (!Array.isArray(dt[mdKey])) {
                    dt[mdKey] = mdVal;
                }
                else if (!Array.isArray(mdVal)) {
                    dt[mdKey].push(mdVal);
                }
                else {
                    dt[mdKey] = dt[mdKey].concat(mdVal);
                }
            }
        }
        else if (ts.idText(tag.tagName) === 'classdesc' || ts.idText(tag.tagName) === 'description') {
            const jsdocDescText = removeQuotes(ts.getTextOfJSDocComment(tag.comment));
            if (jsdocDescText) {
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['description'] = jsdocDescText;
            }
        }
        else if (ts.idText(tag.tagName) === 'example') {
            const jsdocExampleText = ts.getTextOfJSDocComment(tag.comment);
            if (jsdocExampleText) {
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['example'] = dt['jsdoc']['example'] || [];
                dt['jsdoc']['example'].push(jsdocExampleText);
            }
        }
        else if (ts.idText(tag.tagName) === 'typeparam') {
            dt['jsdoc'] = dt['jsdoc'] || {};
            dt['jsdoc']['typeparams'] = dt['jsdoc']['typeparams'] || [];
            let [key, val] = _getTagTuple(tag);
            dt['jsdoc']['typeparams'].push({ name: key, description: val });
        }
        else if (ts.idText(tag.tagName) === 'ignore') {
            dt['jsdoc'] = dt['jsdoc'] || {};
            dt['jsdoc']['ignore'] = true;
        }
        else if (ts.isJSDocReturnTag(tag)) {
            const jsdocRtnDesc = ts.getTextOfJSDocComment(tag.comment);
            if (jsdocRtnDesc) {
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['returns'] = jsdocRtnDesc;
            }
        }
        else if (ts.isJSDocParameterTag(tag)) {
            const jsdocParamDesc = ts.getTextOfJSDocComment(tag.comment);
            if (jsdocParamDesc) {
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['params'] = dt['jsdoc']['params'] || [];
                const jsdocParams = dt['jsdoc']['params'];
                const found = jsdocParams.find((param) => param.name === tag.name.getText());
                if (found) {
                    found.description = jsdocParamDesc;
                }
                else {
                    jsdocParams.push({
                        name: tag.name.getText(),
                        description: jsdocParamDesc
                    });
                }
            }
        }
    }
    if (!dt['jsdoc'] || !dt['jsdoc']['description']) {
        if (objWithJsDoc['jsDoc']) {
            let commentNode = objWithJsDoc['jsDoc'][0];
            if (commentNode && ts.isJSDocCommentContainingNode(commentNode)) {
                const objDesc = removeQuotes(ts.getTextOfJSDocComment(commentNode.comment));
                if (objDesc) {
                    dt['jsdoc'] = dt['jsdoc'] || {};
                    dt['jsdoc']['description'] = objDesc;
                }
            }
        }
    }
    return dt;
}
exports.getDtMetadata = getDtMetadata;
function addMetadataToClassNode(vcompClassInfo, rtMetadata) {
    const classNode = vcompClassInfo.classNode;
    let additionalPropDecls = [];
    if (Object.keys(rtMetadata).length > 0) {
        const metadataNode = _metadataToAstNodes(rtMetadata);
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
    const rtMetadata = metaUtilObj.rtMetadata;
    const needPlaceholderArgs = !!vcompFunctionInfo.translationBundleMapExpression || !!vcompFunctionInfo.contextsExpression;
    const defDisplayNameExpression = ts.factory.createStringLiteral(vcompFunctionInfo.componentName ??
        `VComponent(${vcompFunctionInfo.functionName ?? vcompFunctionInfo.elementName})`);
    const compRegisterCall = vcompFunctionInfo.compRegisterCall;
    const updatedCallArgs = [
        compRegisterCall.arguments[0],
        compRegisterCall.arguments[1]
    ];
    updatedCallArgs.push(defDisplayNameExpression);
    if (Object.keys(rtMetadata).length > 0) {
        updatedCallArgs.push(_metadataToAstNodes(rtMetadata));
        if (metaUtilObj.defaultProps) {
            const keys = Object.keys(metaUtilObj.defaultProps);
            updatedCallArgs.push(ts.factory.createObjectLiteralExpression(keys.map((key) => {
                return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), _defaultPropToAstNodes(metaUtilObj.defaultProps[key]));
            })));
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
function getPropsInfo(compType, componentName, typeRef, progImportMaps, checker) {
    let rtnInfo = null;
    let rtnObservedGlobalProps = new Set();
    let rtnMappedTypes = [];
    let rtnTypeNode;
    let rtnEGPRef = null;
    let isAliasToEGP = false;
    let isUnwrappedROType = false;
    let propsTypeParamsNode;
    let propsTypeSubstituteName;
    let exportToAlias = progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, typeRef);
    if (compType === MetaTypes.VCompType.FUNCTION) {
        rtnTypeNode = typeRef;
        propsTypeParamsNode = rtnTypeNode;
    }
    else {
        let typeRefName = TypeUtils.getTypeNameFromTypeReference(typeRef);
        if (typeRefName === exportToAlias.ExtendGlobalProps) {
            rtnEGPRef = typeRef;
            rtnTypeNode = typeRef.typeArguments?.[0];
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
                        TypeUtils.getTypeNameFromTypeReference(aliasType) === exportToAlias.ExtendGlobalProps) {
                        rtnEGPRef = aliasType;
                        rtnTypeNode = aliasType.typeArguments?.[0];
                    }
                }
            }
            else {
                const symbolDeclaration = typeRefType.symbol?.declarations[0];
                if (ts.isInterfaceDeclaration(symbolDeclaration) ||
                    ts.isClassDeclaration(symbolDeclaration)) {
                    const heritageClauses = symbolDeclaration.heritageClauses;
                    if (heritageClauses) {
                        for (let clause of heritageClauses) {
                            if (rtnTypeNode) {
                                break;
                            }
                            for (let type of clause.types) {
                                if (TypeUtils.getTypeNameFromTypeReference(type) === exportToAlias.ExtendGlobalProps) {
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
            intersectionInlinePropsInfo = getIntersectionTypeNodeInfo(rtnTypeNode, progImportMaps, true, checker);
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
                if (rtnPropsName === exportToAlias.ObservedGlobalProps) {
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
                            const aliasIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo(aliasTypeNode, progImportMaps, false, checker);
                            if (aliasIntersectionTypeNodeInfo.observedProps) {
                                for (const ogProp of aliasIntersectionTypeNodeInfo.observedProps) {
                                    rtnObservedGlobalProps.add(ogProp);
                                }
                            }
                        }
                        else if (ts.isTypeReferenceNode(aliasTypeNode) &&
                            TypeUtils.getTypeNameFromTypeReference(aliasTypeNode) ===
                                exportToAlias.ObservedGlobalProps) {
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
                    const typeParamsInfo = getGenericTypeParameters(propsTypeParamsNode);
                    rtnInfo.propsTypeParams = typeParamsInfo.genericSignature;
                    rtnInfo.propsTypeParamsArray = typeParamsInfo.genericTypeParamsArray;
                }
            }
            if (rtnObservedGlobalProps.size > 0) {
                rtnInfo.propsRtObservedGlobalPropsSet = rtnObservedGlobalProps;
            }
        }
    }
    return rtnInfo;
}
exports.getPropsInfo = getPropsInfo;
function getIntersectionTypeNodeInfo(intersectionTypeNode, progImportMaps, isInline, checker) {
    let rtnInfo = {};
    let filteredTypeNodes = [];
    let observedProps = [];
    const exportToAlias = progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, intersectionTypeNode);
    const typeNodes = intersectionTypeNode.types;
    for (let node of typeNodes) {
        if (ts.isTypeReferenceNode(node)) {
            if (TypeUtils.getTypeNameFromTypeReference(node) === exportToAlias.ObservedGlobalProps) {
                observedProps = observedProps.concat(_getObservedGlobalPropsArray(node));
                continue;
            }
            else {
                const typeRefType = checker.getTypeFromTypeNode(node);
                const typeRefDecl = TypeUtils.getTypeDeclaration(typeRefType);
                if (ts.isTypeAliasDeclaration(typeRefDecl)) {
                    const aliasTypeNode = typeRefDecl.type;
                    if (ts.isIntersectionTypeNode(aliasTypeNode)) {
                        const aliasIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo(aliasTypeNode, progImportMaps, false, checker);
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
                wrappedTypeNode = wrappedTypeNode.typeArguments?.[0];
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
function isMappedTypeReference(typeRefNode) {
    return _MAPPED_TYPENAMES.has(TypeUtils.getTypeNameFromTypeReference(typeRefNode));
}
exports.isMappedTypeReference = isMappedTypeReference;
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
    let rtnType = null;
    if (type.aliasSymbol?.name === 'Readonly') {
        const typeArg = type.aliasTypeArguments?.[0];
        const typeArgName = typeArg?.aliasSymbol?.name;
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
                        const errNode = aliasDecl.name ?? typeNode;
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
    let decl = type.symbol?.declarations?.[0];
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
    let foundIt = false;
    if (ts.isConditionalTypeNode(typeNode)) {
        foundIt = true;
    }
    else if (ts.isTypeReferenceNode(typeNode)) {
        const typeName = TypeUtils.getTypeNameFromTypeReference(typeNode);
        if (typeName === 'Array' && typeNode.typeArguments?.[0]) {
            foundIt = isConditionalTypeNodeDetected(typeNode.typeArguments[0], seen, metaUtilObj);
        }
        else if (!seen.has(typeName)) {
            seen.add(typeName);
            const typeDecl = TypeUtils.getNodeDeclaration(typeNode, metaUtilObj.typeChecker);
            const aliasTypeNode = typeDecl?.type;
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
        let rtnValue = false;
        let tname;
        tname = type.aliasSymbol?.name;
        if (tname && metaUtilObj.excludedTypes?.has(tname)) {
            rtnValue = true;
        }
        else {
            const decl = type.aliasSymbol?.declarations?.[0];
            if (decl && ts.isTypeAliasDeclaration(decl) && ts.isTypeReferenceNode(decl.type)) {
                tname = TypeUtils.getTypeNameFromTypeReference(decl.type);
                const aliasToExport = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.aliasToExport, decl.type);
                if (metaUtilObj.excludedTypes?.has(aliasToExport[tname])) {
                    rtnValue = true;
                }
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
        if (!isMappedType(type) && !isConditionalType(type)) {
            const members = type.getSymbol()?.members;
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
                        return checker.getRootSymbols(sym)?.[0];
                    });
                }
                for (let symbol, i = 0; i < propCount; i++) {
                    if (rootSymbols?.[i]) {
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
function updateCompilerPropsMetadata(readOnlyPropNameNodes, metaUtilObj) {
    metaUtilObj.fullMetadata['readOnlyProps'] =
        readOnlyPropNameNodes?.length > 0 ? readOnlyPropNameNodes.map((item) => item.name) : [];
    if (metaUtilObj.templateSlotProps?.length > 0) {
        metaUtilObj.fullMetadata['templateSlotProps'] = [...metaUtilObj.templateSlotProps];
    }
}
exports.updateCompilerPropsMetadata = updateCompilerPropsMetadata;
function updateCompilerCompMetadata(vcompInfo, metaUtilObj) {
    if (MetaTypes.isClassInfo(vcompInfo)) {
        const classNode = vcompInfo.classNode;
        if (classNode.typeParameters) {
            const genericsInfo = TypeUtils.getGenericsAndTypeParameters(classNode, metaUtilObj, MetaTypes.GTExtras.PARAMS_ANY | MetaTypes.GTExtras.DECL_NODES);
            metaUtilObj.fullMetadata['classTypeParamsDeclaration'] = genericsInfo?.genericsDeclaration;
            metaUtilObj.fullMetadata['classTypeParams'] = genericsInfo?.genericsTypeParams;
            metaUtilObj.fullMetadata['classTypeParamsAny'] = genericsInfo?.genericsTypeParamsAny;
            metaUtilObj.classTypeParamsNodes = genericsInfo?.genericsTypeParamsNodes;
            if (genericsInfo?.jsdoc.length > 0) {
                metaUtilObj.fullMetadata['jsdoc']['typedefs'] = genericsInfo.jsdoc;
            }
        }
        const classDecorators = DecoratorUtils.getDecorators(classNode);
        const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, classNode);
        const consumedBindingsDecorator = classDecorators[exportToAlias.consumedBindings];
        if (consumedBindingsDecorator) {
            metaUtilObj.classConsumedBindingsDecorator = consumedBindingsDecorator;
        }
        const providedBindingsDecorator = classDecorators[exportToAlias.providedBindings];
        if (providedBindingsDecorator) {
            metaUtilObj.classProvidedBindingsDecorator = providedBindingsDecorator;
        }
        const consumedContextsDecorator = classDecorators[exportToAlias.consumedContexts];
        if (consumedContextsDecorator) {
            const args = DecoratorUtils.getDecoratorArguments(consumedContextsDecorator);
            if (args.length === 1) {
                vcompInfo.consumedContextsExpression = args[0];
            }
        }
    }
    else {
        if (vcompInfo.componentNode['typeParameters']) {
            const genericsInfo = TypeUtils.getGenericsAndTypeParameters(vcompInfo.componentNode, metaUtilObj, MetaTypes.GTExtras.PARAMS_ANY | MetaTypes.GTExtras.DECL_NODES);
            metaUtilObj.fullMetadata['classTypeParamsDeclaration'] = genericsInfo?.genericsDeclaration;
            metaUtilObj.fullMetadata['classTypeParams'] = genericsInfo?.genericsTypeParams;
            metaUtilObj.fullMetadata['classTypeParamsAny'] = genericsInfo?.genericsTypeParamsAny;
            metaUtilObj.classTypeParamsNodes = genericsInfo?.genericsTypeParamsNodes;
            if (genericsInfo?.jsdoc.length > 0) {
                metaUtilObj.fullMetadata['jsdoc']['typedefs'] = genericsInfo.jsdoc;
            }
        }
        if (vcompInfo.propBindings) {
            metaUtilObj.functionPropBindings = vcompInfo.propBindings;
        }
        if (vcompInfo.useComponentPropsForSettableProperties) {
            metaUtilObj.fullMetadata['useComponentPropsForSettableProperties'] = true;
        }
    }
    if (vcompInfo.additionalImports?.length) {
        metaUtilObj.fullMetadata['additionalImports'] = [...vcompInfo.additionalImports];
    }
    const propsInfo = vcompInfo.propsInfo;
    if (propsInfo) {
        if (propsInfo.propsTypeParams) {
            metaUtilObj.fullMetadata['propsTypeParams'] = propsInfo.propsTypeParams;
        }
        if (propsInfo.propsTypeParamsArray) {
            metaUtilObj.propsTypeParamsArray = propsInfo.propsTypeParamsArray;
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
            const genericsInfo = TypeUtils.getGenericsAndTypeParameters(propsNode, metaUtilObj, MetaTypes.GTExtras.PARAMS_ANY);
            metaUtilObj.fullMetadata['propsClassTypeParamsDeclaration'] =
                genericsInfo?.genericsDeclaration;
            metaUtilObj.fullMetadata['propsClassTypeParams'] = genericsInfo?.genericsTypeParams;
            metaUtilObj.fullMetadata['propsTypeParamsAny'] = genericsInfo?.genericsTypeParamsAny;
            metaUtilObj.propsClassTypeParamsArray = genericsInfo?.genericsTypeParamsArray;
        }
        metaUtilObj.fullMetadata['propsClassName'] = propsInfo.propsName;
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
    delete metaUtilObj.fullMetadata['classTypeParamsAny'];
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
    delete metaUtilObj.fullMetadata['observedGlobalProps'];
    delete metaUtilObj.fullMetadata['templateSlotProps'];
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
        delete metadata['isApiDocSignature'];
        delete metadata['optional'];
        delete metadata['isArrayOfObject'];
        delete metadata['isEnumValuesForDTOnly'];
        delete metadata['evnDetailTypeParamsDeclaration'];
        delete metadata['evnDetailTypeParams'];
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
function removeCastExpressions(vNode) {
    while (vNode && ts.isAsExpression(vNode)) {
        vNode = vNode.expression;
    }
    return vNode;
}
exports.removeCastExpressions = removeCastExpressions;
function isValueNodeReference(vNode) {
    return ts.isIdentifier(vNode) || ts.isPropertyAccessExpression(vNode);
}
exports.isValueNodeReference = isValueNodeReference;
function getValueNodeFromReference(refNode, metaUtilObj) {
    let vNode = null;
    if (ts.isIdentifier(refNode)) {
        vNode = getValueNodeFromIdentifier(refNode, metaUtilObj);
    }
    else if (ts.isPropertyAccessExpression(refNode)) {
        vNode = getValueNodeFromPropertyAccessExpression(refNode, metaUtilObj);
    }
    return vNode;
}
exports.getValueNodeFromReference = getValueNodeFromReference;
function getValueNodeFromIdentifier(idNode, metaUtilObj) {
    let rtnNode = idNode;
    const refSymbol = metaUtilObj.typeChecker.getSymbolAtLocation(idNode);
    if (refSymbol) {
        if (refSymbol.getName() !== 'undefined') {
            if (refSymbol.valueDeclaration?.initializer) {
                rtnNode = refSymbol.valueDeclaration.initializer;
            }
            else if (refSymbol.valueDeclaration && ts.isFunctionDeclaration(refSymbol.valueDeclaration)) {
                rtnNode = refSymbol.valueDeclaration;
            }
            else {
                rtnNode = null;
            }
        }
    }
    else {
        rtnNode = null;
    }
    return rtnNode;
}
exports.getValueNodeFromIdentifier = getValueNodeFromIdentifier;
function getValueNodeFromPropertyAccessExpression(propAccessNode, metaUtilObj) {
    let rtnNode = null;
    let targetNode = getValueNodeFromReference(propAccessNode.expression, metaUtilObj);
    targetNode = removeCastExpressions(targetNode);
    if (targetNode && ts.isObjectLiteralExpression(targetNode)) {
        const propName = ts.idText(propAccessNode.name);
        const accessedProp = targetNode.properties.find((prop) => prop.name?.getText() === propName);
        if (accessedProp && ts.isPropertyAssignment(accessedProp)) {
            rtnNode = accessedProp.initializer;
        }
    }
    return rtnNode;
}
exports.getValueNodeFromPropertyAccessExpression = getValueNodeFromPropertyAccessExpression;
function getMDValueFromNode(valueNode, prop, metaUtilObj, topLvlProp) {
    let value = undefined;
    if (metaUtilObj) {
        valueNode = getValueNodeFromReference(valueNode, metaUtilObj) ?? valueNode;
    }
    if (!isValueNodeReference(valueNode)) {
        valueNode = removeCastExpressions(valueNode);
        switch (valueNode.kind) {
            case ts.SyntaxKind.StringLiteral:
                value = valueNode.text;
                break;
            case ts.SyntaxKind.NumericLiteral:
                value = Number(valueNode.text);
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
            case ts.SyntaxKind.BigIntLiteral:
                if (metaUtilObj) {
                    const refString = topLvlProp
                        ? `Sub-property '${prop}' of property '${topLvlProp}'.`
                        : `Property '${prop}'.`;
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_BIGINT_DEFAULT_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `${_IGNORED_BIGINT_DEFAULT_VALUE_MSG_HEADER}
  Reference:  ${refString}`, valueNode);
                }
                break;
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.FunctionDeclaration:
                if (metaUtilObj) {
                    const refString = topLvlProp
                        ? `Sub-property '${prop}' of property '${topLvlProp}'.`
                        : `Property '${prop}'.`;
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_FUNCTION_DEFAULT_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `${_IGNORED_FUNCTION_DEFAULT_VALUE_MSG_HEADER}
  Reference:  ${refString}`, valueNode);
                }
                break;
            case ts.SyntaxKind.ArrayLiteralExpression:
                let valArray = [];
                for (const elem of valueNode.elements) {
                    const itemValue = getMDValueFromNode(elem, prop, metaUtilObj, topLvlProp);
                    if (itemValue !== undefined) {
                        valArray.push(itemValue);
                    }
                    else {
                        if (metaUtilObj) {
                            const refString = topLvlProp
                                ? `Sub-property '${prop}' of property '${topLvlProp}'.`
                                : `Property '${prop}'.`;
                            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_ARRAY_DEFAULT_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `${_IGNORED_ARRAY_DEFAULT_VALUE_MSG_HEADER}
  Reference:  ${refString}`, valueNode);
                        }
                        valArray = undefined;
                        break;
                    }
                }
                if (valArray !== undefined) {
                    value = valArray;
                }
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                const objExpression = valueNode;
                let valObj = {};
                if (objExpression.properties.length > 0) {
                    for (const subprop of objExpression.properties) {
                        if (ts.isPropertyAssignment(subprop)) {
                            const sub_key = subprop.name.getText();
                            const sub_val = getMDValueFromNode(subprop.initializer, sub_key, metaUtilObj, topLvlProp ?? prop);
                            if (sub_val !== undefined) {
                                valObj[sub_key] = sub_val;
                            }
                        }
                    }
                    if (Object.keys(valObj).length === 0) {
                        valObj = undefined;
                    }
                }
                if (valObj !== undefined) {
                    value = valObj;
                }
                break;
            default:
                if (metaUtilObj) {
                    const refString = topLvlProp
                        ? `Sub-property '${prop}' of property '${topLvlProp}'.`
                        : `Property '${prop}'.`;
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.CANNOT_CONVERT_TO_JSON, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Unable to convert the default value '${valueNode.getText()}' to JSON.
  Reference:  ${refString}`, valueNode);
                }
                break;
        }
    }
    return value;
}
exports.getMDValueFromNode = getMDValueFromNode;
function generateStatementsFromText(text, offset) {
    const tmpNode = ts.createSourceFile('temp.ts', text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX);
    const statements = tmpNode.statements.map((stmt) => {
        _applyFixups(stmt, offset);
        return stmt;
    });
    return statements;
}
exports.generateStatementsFromText = generateStatementsFromText;
function removeQuotes(str) {
    if (str) {
        return str.replace(/^['"]/g, '').replace(/['"]$/g, '');
    }
    return str;
}
exports.removeQuotes = removeQuotes;
function createTypeDefinitionFromTypeRefs(typeRefs, metaUtilObj) {
    let retObj = [];
    typeRefs.forEach((node) => {
        let typeDefDetails = getTypeDefDetails(node, metaUtilObj);
        if (typeDefDetails.name) {
            retObj.push(typeDefDetails);
        }
    });
    return retObj;
}
exports.createTypeDefinitionFromTypeRefs = createTypeDefinitionFromTypeRefs;
function getTypeDefDetails(typeRefNode, metaUtilObj) {
    let md;
    let details;
    if (ts.isTypeReferenceNode(typeRefNode)) {
        const typedefType = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
        md = TypeUtils.getTypeDefMetadata(typedefType, metaUtilObj, typedefType);
        if (md.name) {
            let detailName = md.name;
            walkTypeNodeMembers(typeRefNode, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
                const propSignature = symbol.valueDeclaration;
                if (!propSignature) {
                    return;
                }
                if (ts.isPropertySignature(propSignature) || ts.isPropertyDeclaration(propSignature)) {
                    const property = key.toString();
                    const propertyPath = [property];
                    const typeDefMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MDScope.DT, MetaTypes.MDContext.TYPEDEF, propertyPath, symbol, metaUtilObj);
                    const propSym = mappedTypeSymbol ?? symbol;
                    typeDefMetadata['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
                    details = details || {};
                    details[property] = typeDefMetadata;
                    let nestedArrayStack = [];
                    if (typeDefMetadata.type === 'Array<object>') {
                        nestedArrayStack.push(key);
                    }
                    const subprops = TypeUtils.getComplexPropertyMetadata(symbol, typeDefMetadata.type, detailName, MetaTypes.MDScope.DT, MetaTypes.MDContext.PROP, propertyPath, nestedArrayStack, metaUtilObj);
                    if (subprops) {
                        if (subprops.circRefDetected) {
                            details[property].type =
                                TypeUtils.getSubstituteTypeForCircularReference(typeDefMetadata);
                        }
                        else if (typeDefMetadata.type === 'Array<object>') {
                            details[property].extension = {};
                            details[property].extension['vbdt'] = {};
                            details[property].extension['vbdt'].itemProperties = subprops;
                        }
                        else {
                            details[property].type = 'object';
                            details[property].properties = subprops;
                        }
                        const typeDef = TypeUtils.getPossibleTypeDef(property, symbol, typeDefMetadata, metaUtilObj);
                        if (typeDef && (typeDef.name || typeDef.coreJetModule)) {
                            details[property]['jsdoc'] = details[property]['jsdoc'] || {};
                            details[property]['jsdoc']['typedef'] = typeDef;
                        }
                    }
                }
            });
        }
    }
    md.properties = details;
    return md;
}
function _offsetTextRange(tr, offset) {
    return { pos: tr.pos + offset, end: tr.end + offset };
}
function _applyFixups(node, offset) {
    if (ts.isStringLiteral(node)) {
        node['singleQuote'] = true;
    }
    node.flags |= ts.NodeFlags.Synthesized;
    if (offset && node.pos >= 0 && node.end >= 0) {
        node = ts.setTextRange(node, _offsetTextRange(node, offset));
    }
    node.forEachChild((child) => _applyFixups(child, offset));
}
function _generateDefaultValueWarning(componentInfo, propertyPath) {
    let msg;
    const propPath = propertyPath?.length ? propertyPath.join('.') : '<unknown>';
    msg = `Property '${propPath}' - ignored JSDoc annotation specifying a default value.`;
    if (MetaTypes.isFunctionInfo(componentInfo)) {
        msg +=
            '\n  Specify the default value using an object binding pattern for the Props argument of the function component.';
    }
    else {
        msg += "\n  Specify the default value in the component class's static 'defaultProps' field.";
    }
    return msg;
}
function _pruneSubPropMetadata(metaelement, validSubPropMap) {
    for (let metaprop in metaelement) {
        const validSubPropSet = validSubPropMap[metaprop];
        if (validSubPropSet) {
            const metadata = metaelement[metaprop];
            _pruneSubPropsNotInSet(metadata, validSubPropSet);
        }
    }
}
function _pruneSubPropsNotInSet(metadata, validSet) {
    for (let prop in metadata) {
        for (let subprop in metadata[prop]) {
            if (!validSet.has(subprop)) {
                delete metadata[prop][subprop];
            }
            else if (subprop === 'properties') {
                const subpropMetadata = metadata[prop][subprop];
                _pruneSubPropsNotInSet(subpropMetadata, validSet);
            }
        }
    }
}
function _getScopedSymbolDeclaration(typeNode, checker) {
    let scopedSymbolDeclaration;
    const scopedTypeAliases = checker.getSymbolsInScope(typeNode, ts.SymbolFlags.TypeAlias);
    const aliasTypeName = TypeUtils.getTypeNameFromTypeReference(typeNode);
    const scopedAliasSymbol = scopedTypeAliases.find((sym) => {
        return sym.getName() === aliasTypeName;
    });
    if (scopedAliasSymbol) {
        scopedSymbolDeclaration = scopedAliasSymbol.getDeclarations()?.[0];
    }
    return scopedSymbolDeclaration;
}
function _getObservedGlobalPropsArray(refNode) {
    let observedProps = [];
    const node = refNode.typeArguments?.[0];
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
function _getTagTuple(tag) {
    let key;
    let val;
    const commentText = ts.getTextOfJSDocComment(tag.comment);
    if (commentText) {
        const tagText = commentText.trim();
        const keySep = tagText.indexOf(' ');
        if (keySep > 0) {
            key = tagText.substring(0, keySep);
            val = tagText.substring(keySep + 1).trim();
        }
        else {
            key = tagText;
            val = '';
        }
    }
    return [key, val];
}
function _getOjMetadataTuple(tag, metaUtilObj) {
    let mdKey;
    let mdVal;
    const [tagKey, tagVal] = _getTagTuple(tag);
    const mdValidationInfo = MetaValid.getValidationInfo(tagKey);
    if (!mdValidationInfo) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNRECOGNIZED_OJMETADATA_KEY, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Unrecognized @ojmetadata key '${tagKey}' will be ignored.`, tag);
    }
    else {
        mdKey = tagKey;
        if (tagVal.length > 0) {
            mdVal = _normalizeOjMetadataValue(mdKey, tagVal, mdValidationInfo, tag, metaUtilObj);
            try {
                mdVal = _execBundle(mdVal);
            }
            catch (e) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MALFORMED_METADATA_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Malformed metadata value '${mdVal}' for key '${mdKey}' will be ignored.`, tag);
                mdKey = undefined;
                mdVal = undefined;
            }
        }
        else {
            mdVal = true;
        }
    }
    return [mdKey, mdVal, mdValidationInfo];
}
function _normalizeOjMetadataValue(key, value, mdValidationInfo, tag, metaUtilObj) {
    let isStringNormalizationNeeded = false;
    if (mdValidationInfo.baseType === 'string' &&
        !(mdValidationInfo.isArray && value.charAt(0) === '[' && value.charAt(value.length - 1) === ']')) {
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
            break;
        case 'number':
            return ts.factory.createNumericLiteral(String(value));
            break;
        case 'bigint':
            return ts.factory.createBigIntLiteral(`${String(value)}n`);
            break;
        case 'boolean':
            return value ? ts.factory.createTrue() : ts.factory.createFalse();
            break;
        case 'object':
            if (!value) {
                return ts.factory.createNull();
            }
            const keys = Object.keys(value);
            return ts.factory.createObjectLiteralExpression(keys.map((key) => {
                return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), _metadataToAstNodes(value[key]));
            }));
            break;
        case 'undefined':
        default:
            return ts.factory.createIdentifier('undefined');
            break;
    }
}
function _defaultPropToAstNodes(defProp) {
    return _cloneValue(defProp);
}
function _cloneValue(valueNode) {
    switch (valueNode.kind) {
        case ts.SyntaxKind.Identifier:
            return ts.factory.createIdentifier(valueNode.getText());
            break;
        case ts.SyntaxKind.StringLiteral:
            const strVal = valueNode.getText();
            return ts.factory.createStringLiteral(strVal.substring(1, strVal.length - 1));
            break;
        case ts.SyntaxKind.NumericLiteral:
            return ts.factory.createNumericLiteral(valueNode.getText());
            break;
        case ts.SyntaxKind.BigIntLiteral:
            return ts.factory.createBigIntLiteral(valueNode.getText());
            break;
        case ts.SyntaxKind.TrueKeyword:
            return ts.factory.createTrue();
            break;
        case ts.SyntaxKind.FalseKeyword:
            return ts.factory.createFalse();
            break;
        case ts.SyntaxKind.NullKeyword:
            return ts.factory.createNull();
            break;
        case ts.SyntaxKind.ArrayLiteralExpression:
            return ts.factory.createArrayLiteralExpression(valueNode.elements.map((elem) => _cloneValue(elem)));
            break;
        case ts.SyntaxKind.ObjectLiteralExpression:
            const propAssignments = valueNode.properties.filter((prop) => ts.isPropertyAssignment(prop));
            return ts.factory.createObjectLiteralExpression(propAssignments.map((propAssign) => {
                const propKey = ts.isStringLiteral(propAssign.name)
                    ? _cloneValue(propAssign.name)
                    : ts.factory.createStringLiteral(propAssign.name.getText());
                return ts.factory.createPropertyAssignment(propKey, _cloneValue(propAssign.initializer));
            }));
            break;
        case ts.SyntaxKind.AsExpression:
            return _cloneValue(valueNode.expression);
            break;
        case ts.SyntaxKind.PropertyAccessExpression:
            const propAccessNode = valueNode;
            return ts.factory.createPropertyAccessExpression(propAccessNode.expression, propAccessNode.name);
            break;
        case ts.SyntaxKind.ArrowFunction:
            const arrowFuncNode = valueNode;
            return ts.factory.createArrowFunction(arrowFuncNode.modifiers, arrowFuncNode.typeParameters, arrowFuncNode.parameters, arrowFuncNode.type, arrowFuncNode.equalsGreaterThanToken, arrowFuncNode.body);
            break;
        case ts.SyntaxKind.FunctionExpression:
            const funcExprNode = valueNode;
            return ts.factory.createFunctionExpression(funcExprNode.modifiers, funcExprNode.asteriskToken, funcExprNode.name, funcExprNode.typeParameters, funcExprNode.parameters, funcExprNode.type, funcExprNode.body);
            break;
        case ts.SyntaxKind.FunctionDeclaration:
            const funcDeclNode = valueNode;
            const funcID = funcDeclNode.name ? ts.idText(funcDeclNode.name) : 'undefined';
            return ts.factory.createIdentifier(funcID);
            break;
        default:
            return ts.factory.createIdentifier('undefined');
            break;
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
//# sourceMappingURL=MetadataUtils.js.map