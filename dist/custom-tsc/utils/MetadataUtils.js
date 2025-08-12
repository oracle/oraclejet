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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaUtilObjFactory = exports._INTERSECTION_SPLITTER = exports._UNION_SPLITTER = void 0;
exports.tagNameToElementInterfaceName = tagNameToElementInterfaceName;
exports.writebackCallbackToProperty = writebackCallbackToProperty;
exports.getGenericTypeParameters = getGenericTypeParameters;
exports.getTypeParametersFromType = getTypeParametersFromType;
exports.getDtMetadata = getDtMetadata;
exports.addMetadataToClassNode = addMetadataToClassNode;
exports.updateFunctionalVCompNode = updateFunctionalVCompNode;
exports.getPropsInfo = getPropsInfo;
exports.getIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo;
exports.getMappedTypesInfo = getMappedTypesInfo;
exports.isSimpleTypeReference = isSimpleTypeReference;
exports.isPropsMappedType = isPropsMappedType;
exports.isAliasToMappedType = isAliasToMappedType;
exports.getWrappedReadonlyType = getWrappedReadonlyType;
exports.constructMappedTypeName = constructMappedTypeName;
exports.isMappedType = isMappedType;
exports.isRecordType = isRecordType;
exports.isFunctionType = isFunctionType;
exports.isConditionalType = isConditionalType;
exports.isObjectType = isObjectType;
exports.isWalkableObjectType = isWalkableObjectType;
exports.isNonNullableType = isNonNullableType;
exports.isTypeTreatedAsAny = isTypeTreatedAsAny;
exports.isIndexedAccessTypeParameters = isIndexedAccessTypeParameters;
exports.isConditionalTypeNodeDetected = isConditionalTypeNodeDetected;
exports.walkTypeMembers = walkTypeMembers;
exports.walkTypeNodeMembers = walkTypeNodeMembers;
exports.updateCompilerPropsMetadata = updateCompilerPropsMetadata;
exports.updateCompilerCompMetadata = updateCompilerCompMetadata;
exports.pruneCompilerMetadata = pruneCompilerMetadata;
exports.pruneMetadata = pruneMetadata;
exports.updateRtExtensionMetadata = updateRtExtensionMetadata;
exports.getMDValueFromNode = getMDValueFromNode;
exports.getPropertyValueFromObjectLiteralExpression = getPropertyValueFromObjectLiteralExpression;
exports.generateStatementsFromText = generateStatementsFromText;
exports.removeQuotes = removeQuotes;
exports.createTypeDefinitionFromTypeRefs = createTypeDefinitionFromTypeRefs;
exports.createTypeDefinitionFromTypeDefObj = createTypeDefinitionFromTypeDefObj;
exports.findTypeDefByName = findTypeDefByName;
exports.printInColor = printInColor;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetadataTypes_1 = require("./MetadataTypes");
const MetaValid = __importStar(require("./MetadataValidationUtils"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
const DecoratorUtils_1 = require("../shared/DecoratorUtils");
const ImportMaps_1 = require("../shared/ImportMaps");
const Utils_1 = require("../shared/Utils");
const vm = __importStar(require("vm"));
const _OJMETADATA_TAG = 'ojmetadata';
const _IGNORED_BIGINT_DEFAULT_VALUE_MSG_HEADER = 'Default values of type BigInt are not reflected in the generated custom element JSON metadata.';
const _IGNORED_FUNCTION_DEFAULT_VALUE_MSG_HEADER = 'Default values of type Function are not reflected in the generated custom element JSON metadata.';
const _IGNORED_ARRAY_DEFAULT_VALUE_MSG_HEADER = 'Default array values with items of an unsupported type are not reflected in the generated custom element JSON metadata.';
/**
 * Utility method that converts a custom element tag name to the name
 * used for the custom element's TS interface, e.g. oj-some-component -> SomeComponentElement.
 * NOTE: Copied from CustomElementUtils.tagNameToElementClassName static method.
 * @param tagName
 * @ignore
 */
function tagNameToElementInterfaceName(tagName) {
    return `${(0, Utils_1.stickCaseToTitleCase)(tagName)}Element`;
}
function writebackCallbackToProperty(property) {
    if (/^on[A-Z].*Changed$/.test(property)) {
        return property[2].toLowerCase() + property.substring(3, property.length - 7);
    }
    return null;
}
/**
 * Utility method that generates a generics signature string
 * and an array of type parameter names.
 * It works off of a Node object with typeArguments.
 */
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
/**
 * Utility method that generates a TypeParameters signature string.
 * It works off of a Type object.
 */
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
function getDtMetadata(objWithJsDoc, context, propertyPath, metaUtilObj) {
    const dt = {};
    const tags = ts.getJSDocTags(objWithJsDoc);
    for (const tag of tags) {
        if (ts.idText(tag.tagName) === _OJMETADATA_TAG) {
            let [mdKey, mdVal, mdValidationInfo] = _getOjMetadataTuple(tag, context, metaUtilObj);
            // Is this a recognized @ojmetadata key, and does
            // the @ojmetadata value pass basic validation?
            if (mdKey && MetaValid.isValidMetadata(mdKey, mdVal, mdValidationInfo, tag, metaUtilObj)) {
                // Specifying a default value in the context of callable API
                // (i.e., NOT in a Typedef) through DT metadata?
                if (mdKey === 'value' && !(context & MetaTypes.MDContext.TYPEDEF)) {
                    if (!(context & MetaTypes.MDContext.PROP)) {
                        // If not a Property, ignore the tag and continue with the next tag
                        continue;
                    }
                    else if (!(context & (MetaTypes.MDContext.PROP_RO_WRITEBACK | MetaTypes.MDContext.EXTENSION_MD))) {
                        // Only allow default value Property DT metadata in two scenarios:
                        //    1) for read-only writeback properties
                        //    2) within nested extension metadata
                        // Otherwise, log a warning with sufficient guidance on the correct way
                        // to specify a default value in this particular use case, ignore the tag,
                        // and continue with the next tag.
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `${_generateDefaultValueWarning(metaUtilObj.componentInfo, propertyPath)}`, tag);
                        continue;
                    }
                }
                // If processing a StyleVariableSet, the DT metadata only cares about its
                // child 'styleVariables' array
                if (mdKey === 'styleVariableSet') {
                    if (mdVal.styleVariables && Array.isArray(mdVal.styleVariables)) {
                        mdKey = 'styleVariables';
                        mdVal = mdVal.styleVariables.slice(); // copy the array
                    }
                    else {
                        // Something is wrong with this '@ojmetadata styleVariableSet' tag, so
                        // log a warning, ignore it, and continue with the next tag.
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_STYLEVARIABLESET, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Invalid 'styleVariableSet' DT metadata specified: ${mdVal}`, tag);
                        continue;
                    }
                }
                // Consult the mdValidationInfo to see if the metadata value should be converted
                // to an array (if it is not already one)
                if (mdValidationInfo.isArray && !Array.isArray(mdVal)) {
                    mdVal = [mdVal];
                }
                // Pre-process arrays of (LEGACY) Style Classes before including them in the DT metadata
                // NOTE:  Legacy VComponent API Doc was generated outside of custom-tsc
                if (mdKey === 'styleClasses') {
                    let styleClasses = mdVal;
                    styleClasses.forEach((sc) => {
                        // API Doc examples are tucked away under extension.jet metadata - remove them
                        // so they don't end up getting written out to the DT metadata
                        if (sc.extension) {
                            delete sc.extension['jet'];
                            if (Object.getOwnPropertyNames(sc.extension).length == 0) {
                                delete sc.extension;
                            }
                        }
                        // Style Classes with 'protected' scope are hidden in the API Doc, so remove
                        // their links from the DT metadata as well
                        if (sc.scope == 'protected') {
                            delete sc.help;
                        }
                    });
                }
                // Add the new mdKey/mdVal to the DT metadata:
                //  - If no pre-existing dt[mdKey] or the existing value is not an array, just set it
                //  - otherwise, if there is a pre-existing array, add new value(s) to it
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
            // We really only care about method parameter descriptions
            const jsdocParamDesc = ts.getTextOfJSDocComment(tag.comment);
            if (jsdocParamDesc) {
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['params'] = dt['jsdoc']['params'] || [];
                // Maintain array mapping method parameter names to description text
                // ('type' metadata will come directly from the method signature).
                const jsdocParams = dt['jsdoc']['params'];
                // If array entry for a particular parameter already exists, then update its
                // description text; otherwise add a new entry to the array.
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
/**
 * Returns an updated class node with additional static metadata properties
 * pointing to runtime metadata and/or a translation bundle map.
 * @param vcompClassInfo Information about the VComponent class instance
 * @param rtMetadata The metadata object
 */
function addMetadataToClassNode(vcompClassInfo, rtMetadata) {
    const classNode = vcompClassInfo.classNode;
    let additionalPropDecls = [];
    // If there is any RT metadata, create a static property declaration
    // and add it to the list of additional properties
    if (Object.keys(rtMetadata).length > 0) {
        const metadataNode = _metadataToAstNodes(rtMetadata);
        additionalPropDecls.push(ts.factory.createPropertyDeclaration(ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), '_metadata', undefined, undefined, metadataNode));
    }
    // If there is a translation bundle map ts.Expression, create a static
    // property declaration and add it to the list of additional properties
    if (vcompClassInfo.translationBundleMapExpression) {
        additionalPropDecls.push(ts.factory.createPropertyDeclaration(ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), '_translationBundleMap', undefined, undefined, vcompClassInfo.translationBundleMapExpression));
    }
    // If there is a consumed contexts ts.Expression, create a static
    // property declaration and add it to the list of additional properties
    if (vcompClassInfo.consumedContextsExpression) {
        additionalPropDecls.push(ts.factory.createPropertyDeclaration(ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), '_consumedContexts', undefined, undefined, vcompClassInfo.consumedContextsExpression));
    }
    // If no additional properties are required, return the
    // original ts.ClassDeclaration
    if (additionalPropDecls.length === 0) {
        return classNode;
    }
    // Otherwise, add the additional properties and return the
    // updated ts.ClassDeclaration
    else {
        const updatedMembers = classNode.members.concat(additionalPropDecls);
        return ts.factory.updateClassDeclaration(classNode, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, updatedMembers);
    }
}
/**
 * Update the functional VComponent node before returning from the transformer.
 *
 * Inject additional arguments into the registerCustomElement call:
 *    - a StringLiteral representing a default 'displayName' property value
 *    - an ObjectLiteralExpression representing the runtime metadata for the function VComponent
 *      (as needed)
 *    - an ObjectLiteralExpression representing default property values for the function VComponent
 *      (as needed)
 *    - an Expression representing a map of translation bundleIds to loader functions
 *      (as needed)
 *    - an Expression representing a map of Contexts (as needed - only supports 'consume' for now)
 *
 * In addition, if the functional VComponent exposes methods, then we also need to modify the inline
 * Preact functional component argument to the registerCustomElement call in order to inject
 * a ref object reference to be forwarded to the Preact component's children.
 *
 * @param functionalCompNode VariableStatement or ExpressionStatement for the functional VComp
 * @param vcompFunctionInfo Information about the functional VComp
 * @param metaUtilObj Bag o'useful stuff
 */
function updateFunctionalVCompNode(functionalCompNode, vcompFunctionInfo, metaUtilObj) {
    const rtMetadata = metaUtilObj.rtMetadata;
    // Track whether we will need placeholders for missing args,
    // in case there is a translationBundleMap or Contexts map to be passed as
    // undocumented arguments to the registerCustomElement call
    const needPlaceholderArgs = !!vcompFunctionInfo.translationBundleMapExpression || !!vcompFunctionInfo.contextsExpression;
    // Create a StringLiteral expression for the default displayName value
    const defDisplayNameExpression = ts.factory.createStringLiteral(vcompFunctionInfo.componentName ??
        `VComponent(${vcompFunctionInfo.functionName ?? vcompFunctionInfo.elementName})`);
    // Get the call to registerCustomElement
    const compRegisterCall = vcompFunctionInfo.compRegisterCall;
    // Create a new arguments array
    //
    // NOTE:  If the optional 3rd or 4th arguments were supplied,
    //        then we have already processed them, so we DO NOT include them
    //        in the updated args array.
    //
    //        If, at some later point, we decide that we DO need to pass along
    //        any of these optional arguments to the VComponent framework during
    //        registration, then we will need to allow for them when they are NOT specified.
    //        In that case, we would need to insert "undefined" Identifiers as placeholders,
    //        and update the logic both here and in the registerCustomElement implementation.
    const updatedCallArgs = [
        compRegisterCall.arguments[0], // element name
        compRegisterCall.arguments[1] // Preact functional component
    ];
    // Add the default displayName as the 3rd argument
    updatedCallArgs.push(defDisplayNameExpression);
    // If there is RT metadata, create an Expression node for the object literal
    // and also add that as the 4th argument
    if (Object.keys(rtMetadata).length > 0) {
        updatedCallArgs.push(_metadataToAstNodes(rtMetadata));
        // If there is RT metadata then there might be defaultProps -- add them as well
        // as the 5th argument
        if (metaUtilObj.defaultPropToNode) {
            const keys = Object.keys(metaUtilObj.defaultPropToNode);
            updatedCallArgs.push(ts.factory.createObjectLiteralExpression(keys.map((key) => {
                return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), _defaultPropToAstNodes(metaUtilObj.defaultPropToNode[key]));
            })));
        }
        // Otherwise check whether a placeholder arg is needed
        else if (needPlaceholderArgs) {
            updatedCallArgs.push(ts.factory.createIdentifier('undefined'));
        }
    }
    // Otherwise, if no RT metadata, check whether placeholder args are needed
    else if (needPlaceholderArgs) {
        updatedCallArgs.push(ts.factory.createIdentifier('undefined'), ts.factory.createIdentifier('undefined'));
    }
    // If there is a translationBundleMapExpression, pass it as the 6th argument
    if (vcompFunctionInfo.translationBundleMapExpression) {
        updatedCallArgs.push(vcompFunctionInfo.translationBundleMapExpression);
    }
    // Otherwise check whether yet another placeholder arg is needed
    else if (vcompFunctionInfo.contextsExpression) {
        updatedCallArgs.push(ts.factory.createIdentifier('undefined'));
    }
    // Finally, if there is a contextsExpression, pass it as the 7th argument
    if (vcompFunctionInfo.contextsExpression) {
        updatedCallArgs.push(vcompFunctionInfo.contextsExpression);
    }
    // Update the registerCustomElement call to pass the additional args
    const updatedCompRegisterCall = ts.factory.updateCallExpression(compRegisterCall, compRegisterCall.expression, compRegisterCall.typeArguments, updatedCallArgs);
    // Update and return the VCompFunctionalNode
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
/**
 * Utility method that analyzes the TypeReferenceNode (from a class's heritageClause)
 * and determines whether we indeed have a reference to a Props type
 * for a VComponent custom element.
 * If so, we return an object with all the necessary information for subsequent
 * processing of custom element Props metadata.
 * Otherwise, return null.
 */
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
    let exportToAlias = progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, typeRef);
    // For Functional VComponents, the reference to the Props type is not wrapped
    // in an ExtendGlobalProps reference -- that's handled by the call to
    // registerCustomElement.
    if (compType === MetaTypes.VCompType.FUNCTION) {
        rtnTypeNode = typeRef;
        propsTypeParamsNode = rtnTypeNode;
    }
    // Otherwise, for Class-based VComponents, look for ExtendGlobalProps and its
    // first typeArgument.
    else {
        let typeRefName = (0, Utils_1.getTypeNameFromTypeReference)(typeRef);
        // If we find the ExtendGlobalProps utility type, then
        // its first typeArgument is the Props type node we're seeking.
        if (typeRefName === exportToAlias.ExtendGlobalProps) {
            rtnEGPRef = typeRef;
            rtnTypeNode = typeRef.typeArguments?.[0];
            propsTypeParamsNode = rtnTypeNode;
        }
        // Otherwise, look for an indirect reference to the Props type
        else {
            isAliasToEGP = true;
            propsTypeParamsNode = typeRef;
            // The typeRefName will become a substitute propsType name if the Props typeNode
            // turns out to be a TypeLiteral.
            // NOTE: In the case of a direct inline TypeLiteral for the Component Props argument,
            // the typeName will be undefined, and this will get flagged as an error
            // -- we expect the Props object to have a name for the purposes of generating
            // the TS definition file for the VComponent custom element.
            propsTypeSubstituteName = typeRefName;
            const typeRefType = checker.getTypeAtLocation(typeRef);
            // Is this a TypeAlias?
            if (typeRefType.aliasSymbol) {
                const aliasSymbolDeclaration = typeRefType.aliasSymbol.declarations[0];
                if (ts.isTypeAliasDeclaration(aliasSymbolDeclaration)) {
                    const aliasType = aliasSymbolDeclaration.type;
                    if (ts.isTypeReferenceNode(aliasType) &&
                        (0, Utils_1.getTypeNameFromTypeReference)(aliasType) === exportToAlias.ExtendGlobalProps) {
                        rtnEGPRef = aliasType;
                        rtnTypeNode = aliasType.typeArguments?.[0];
                    }
                }
            }
            // Otherwise look for an Interface or Class
            else {
                const symbolDeclaration = typeRefType.symbol?.declarations[0];
                if (ts.isInterfaceDeclaration(symbolDeclaration) ||
                    ts.isClassDeclaration(symbolDeclaration)) {
                    const heritageClauses = symbolDeclaration.heritageClauses;
                    if (heritageClauses) {
                        for (let clause of heritageClauses) {
                            // Break if we've already found the Props type node
                            if (rtnTypeNode) {
                                break;
                            }
                            for (let type of clause.types) {
                                if ((0, Utils_1.getTypeNameFromTypeReference)(type) === exportToAlias.ExtendGlobalProps) {
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
    // Having found the Props type node, construct the PropsInfo instance
    if (rtnTypeNode) {
        let intersectionInlinePropsInfo;
        let rtnIsInlineIntersectionType = false;
        let rtnIsObservedGlobalPropsOnly = false;
        let mappedTypeGenericsDeclaration;
        // If the Props type node is an inline IntersectionType, it may include
        // the ObservedGlobalProps utility type.  Therefore, we need to do some
        // additional processing to extract the necessary information.
        if (ts.isIntersectionTypeNode(rtnTypeNode)) {
            intersectionInlinePropsInfo = getIntersectionTypeNodeInfo(rtnTypeNode, progImportMaps, true, checker);
            // If a substituteTypeNode was returned, it's because the Props object
            // is not REALLY specified by an inline IntersectionType
            // e.g., (foo & ObservedGlobalProps<"id">) implies we can substitute
            // the 'foo' TypeNode for constructing the PropsInfo instance as well as
            // for generating propsTypeParams
            if (intersectionInlinePropsInfo.substituteTypeNode) {
                rtnTypeNode = intersectionInlinePropsInfo.substituteTypeNode;
                propsTypeParamsNode = rtnTypeNode;
            }
            // Otherwise the Props object is specified by an inline IntersectionType,
            // even after accounting for ObservedGlobalProps.
            else {
                rtnIsInlineIntersectionType = true;
            }
            // Note any ObservedGlobalProps from the IntersectionType
            if (intersectionInlinePropsInfo.observedProps) {
                for (const oProp of intersectionInlinePropsInfo.observedProps) {
                    rtnObservedGlobalProps.add(oProp);
                }
            }
        }
        let rtnType = checker.getTypeAtLocation(rtnTypeNode);
        if (rtnType) {
            // Check if the Props type (i.e., the direct type argument to ExtendGlobalProps,
            // and not an alias Type!) is wrapped by mapping Utility Types
            // If so, we need to track:
            //  * ordered stack of mapping Utility type names and their additional parameters
            //  * the inner TypeNode used to get the propsName and the propsGenericsDeclaration
            const mappedTypesInfo = getMappedTypesInfo(rtnType, checker, true, rtnTypeNode);
            if (mappedTypesInfo) {
                rtnMappedTypes = mappedTypesInfo.mappedTypes;
                rtnTypeNode = mappedTypesInfo.wrappedTypeNode;
                // If we did NOT have to walk type aliases to find ExtendGlobalProps,
                // then we also need to reset propsTypeParamsNode in order to correctly
                // compute propsTypeParams
                if (!isAliasToEGP) {
                    propsTypeParamsNode = rtnTypeNode;
                }
                mappedTypeGenericsDeclaration = TypeUtils.getNodeDeclaration(rtnTypeNode, checker);
            }
            // Otherwise, check whether the Props type is, in fact, an alias to a MappedType
            else if (isAliasToMappedType(rtnType, rtnTypeNode)) {
                // Check if this is the special case of an alias to a Readonly type, e.g.:
                //
                //    export type Props = Readonly<{
                //      a: string;
                //    }>;
                //
                //  If so, then we are not at all interested in the Readonly bit --
                //  we are only interested in its typeArgument, from which we will derive
                //  the actual rtnType!
                const unwrappedType = getWrappedReadonlyType(rtnType, rtnTypeNode, componentName, checker);
                if (unwrappedType) {
                    rtnType = unwrappedType;
                    isUnwrappedROType = true;
                }
                // If we made it here, then rtnTypeNode must be a TypeReference to an alias
                // to a MappedType.  We need the generics as defined by that alias,
                // so get the alias Symbol's declaration -- that's what we will use
                // for the propsGenericsDeclaration.
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
                rtnPropsName = (0, Utils_1.getTypeNameFromTypeReference)(rtnTypeNode);
                // Check for ObservedGlobalProps
                if (rtnPropsName === exportToAlias.ObservedGlobalProps) {
                    rtnIsObservedGlobalPropsOnly = true;
                    const ogpArray = _getObservedGlobalPropsArray(rtnTypeNode);
                    for (const ogProp of ogpArray) {
                        rtnObservedGlobalProps.add(ogProp);
                    }
                    // An unwrapped Readonly type may not include ObservedGlobalProps,
                    // in which case we can skip further checking...
                }
                else if (!isUnwrappedROType) {
                    const rtnTypeDeclaration = TypeUtils.getTypeDeclaration(rtnType);
                    if (ts.isTypeAliasDeclaration(rtnTypeDeclaration)) {
                        const aliasTypeNode = rtnTypeDeclaration.type;
                        // IntersectionType (not inline)?
                        if (ts.isIntersectionTypeNode(aliasTypeNode)) {
                            const aliasIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo(aliasTypeNode, progImportMaps, false, checker);
                            if (aliasIntersectionTypeNodeInfo.observedProps) {
                                for (const ogProp of aliasIntersectionTypeNodeInfo.observedProps) {
                                    rtnObservedGlobalProps.add(ogProp);
                                }
                            }
                        }
                        // ObservedGlobalProps only?
                        else if (ts.isTypeReferenceNode(aliasTypeNode) &&
                            (0, Utils_1.getTypeNameFromTypeReference)(aliasTypeNode) === exportToAlias.ObservedGlobalProps) {
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
            // Collect information about Props generics and type parameters,
            // but only if the Props type is neither an inline IntersectionType
            // nor the ObservedGlobalProps utility type.
            //
            // If Props needs to be defined as an Intersection of parameterized types,
            // then we expect the custom element developer to abstract all that detail
            // behind a type alias, rather than specifying it inline.
            if (!(rtnIsInlineIntersectionType || rtnIsObservedGlobalPropsOnly)) {
                // If the Props type is a MappedType, then we have already
                // figured out the correct declaration for computing Props generics
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
            // Were ObservedGlobalProps detected?
            if (rtnObservedGlobalProps.size > 0) {
                rtnInfo.propsRtObservedGlobalPropsSet = rtnObservedGlobalProps;
            }
        }
    }
    return rtnInfo;
}
/**
 * Additional processing for the Props object if it is specified by an IntersectionTypeNode:
 *
 *   - return an array of observed global properties if the ObservedGlobalProps utility type
 *     is in the list of intersection types
 *
 *   - if the intersection type consists of a single type + ObservedGlobalProps
 *     (e.g., 'foo & ObservedGlobalProps<"id", "aria-label">), then return an alternate
 *     TypeNode (e.g., 'foo') that filters out the ObservedGlobalProps utility type
 *
 *   - if the intersection type consists of multiple types + ObservedGlobalProps
 *     (e.g., 'foo & bar & ObservedGlobalProps<"id", "aria-label">), then return
 *     the computed Props name (e.g., 'foo & bar') for generating the component's d.ts
 */
function getIntersectionTypeNodeInfo(intersectionTypeNode, progImportMaps, isInline, checker) {
    let rtnInfo = {};
    let filteredTypeNodes = [];
    let observedProps = [];
    const exportToAlias = progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, intersectionTypeNode);
    // Walk the TypeNodes that constitute the Intersection
    const typeNodes = intersectionTypeNode.types;
    for (let node of typeNodes) {
        if (ts.isTypeReferenceNode(node)) {
            if ((0, Utils_1.getTypeNameFromTypeReference)(node) === exportToAlias.ObservedGlobalProps) {
                observedProps = observedProps.concat(_getObservedGlobalPropsArray(node));
                continue;
            }
            else {
                // Check for alias type that is itself an Intersection type, and see if
                // that alias includes any ObservedGlobalProps.
                //
                // NOTES:
                //  * Typescript will detect and prevent circular references within Intersection Types,
                //    so we don't have to check for duplicate alias types.
                //  * Don't worry about duplicates in the observedProps array - getPropsInfo
                //    will assign the values of the returned observedProps array to a Set,
                //    ensuring that the values in the final list are unique.
                const typeRefType = checker.getTypeFromTypeNode(node);
                const typeRefDecl = TypeUtils.getTypeDeclaration(typeRefType);
                if (ts.isTypeAliasDeclaration(typeRefDecl)) {
                    const aliasTypeNode = typeRefDecl.type;
                    if (ts.isIntersectionTypeNode(aliasTypeNode)) {
                        const aliasIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo(aliasTypeNode, progImportMaps, false, // NOT the inline case -- therefore will only look for observedProps
                        checker);
                        if (aliasIntersectionTypeNodeInfo.observedProps) {
                            observedProps = observedProps.concat(aliasIntersectionTypeNodeInfo.observedProps);
                        }
                    }
                }
            }
        }
        // For the inline IntersectionType use case, save any
        // non-ObservedGlobalProps TypeNodes to the filtered list.
        if (isInline) {
            // Otherwise, save the TypeNode to the filtered list
            filteredTypeNodes.push(node);
        }
    }
    if (filteredTypeNodes.length > 0) {
        // If there's only a single TypeNode in the filtered list, then return it
        // (i.e., don't treat Props as an IntersectionType after all!)
        if (filteredTypeNodes.length == 1) {
            rtnInfo.substituteTypeNode = filteredTypeNodes[0];
        }
        // Otherwise, compute the inline IntersectionType name from the filtered list
        else {
            const types = filteredTypeNodes.map((node) => checker.getTypeAtLocation(node));
            if (types.length) {
                rtnInfo.propsName = TypeUtils.getTypeNameFromIntersectionTypes(types);
            }
        }
    }
    // Return any observed GlobalProps
    if (observedProps.length > 0) {
        rtnInfo.observedProps = observedProps;
    }
    return rtnInfo;
}
// Set of Type names that trigger special PropsInfo processing
// (We need to track information about well-known mapping
// Utility types wrapping the Props object, in order to properly
// generate the corresponding Type definition file.)
const _MAPPED_TYPENAMES = new Set(['Partial', 'Required', 'Readonly', 'Pick', 'Omit']);
/**
 * Additional processing for the Props object if it is wrapped by one or more
 * mapping Utility types.  There are two fundamental use cases for using getMappedTypesInfo:
 *
 *  - When constructing PropsInfo that describes the Props object, an outerTypeNode parameter
 *    is specified.  This is our signal to leverage TypeNodes to walk the Types and TypeNodes
 *    in tandem.
 *
 *  - When constructing a typeName for a MappingType, the optional outerTypeNode parameter
 *    is NOT specified.  This is our signal to ignore any TypeNode processing, and simply
 *    walk the Type structure in order to gather information about nested mapping types.
 *
 * This utility function returns null if no mapping types are detected; otherwise, it returns:
 *
 *  - an array of MappedTypeItem objects, specifying MappedType names and any additional type parameters;
 *  - if an outer TypeNode was specified, then return inner TypeNode from whence we can derive
 *    the propsGenericDeclaration.
 *
 */
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
        // Verify name & type arguments
        if (mappedTypeName && mappedTypeArgs) {
            // The first type argument will be the nested Type.
            // If there are subsequent arguments, join them
            // and add to the MappedTypes entry so we can
            // replay them during type definition generation.
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
            // Set up for the next iteration
            if (wrappedTypeNode) {
                // If tracking TypeNodes, then the first wrappedTypeNode argument
                // is the nested wrappedTypeNode, and we use the nested wrappedTypeNode
                // to get the next wrappedType
                wrappedTypeNode = wrappedTypeNode.typeArguments?.[0];
                wrappedType = wrappedTypeNode ? checker.getTypeAtLocation(wrappedTypeNode) : null;
            }
            else {
                // Otherwise get the next wrappedType from the first type argument
                wrappedType = mappedTypeArgs[0];
            }
        }
        else {
            break;
        }
    }
    // If we found one or more Mapped Types plus an innermost
    // wrapped Type, return this information to the caller.
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
/**
 * Given a TypeReferenceNode, determine if this is a "simple" type reference (i.e.,
 * neither a reference to an Array nor a reference to a MappedType utility wrapper).
 */
function isSimpleTypeReference(typeRefNode) {
    const name = (0, Utils_1.getTypeNameFromTypeReference)(typeRefNode);
    return !(name === 'Array' || _MAPPED_TYPENAMES.has(name));
}
/**
 * Given a potential Props object Type, determines if this is
 * a MappedType requiring special PropsInfo processing.
 */
function isPropsMappedType(type, typeNode) {
    return (isMappedType(type) &&
        _MAPPED_TYPENAMES.has(typeNode
            ? (0, Utils_1.getTypeNameFromTypeReference)(typeNode)
            : TypeUtils.getTypeNameFromType(type)));
}
/**
 * Determine whether the Props type is actually an alias to a MappedType
 */
function isAliasToMappedType(type, typeNode) {
    return (isMappedType(type) &&
        !_MAPPED_TYPENAMES.has((0, Utils_1.getTypeNameFromTypeReference)(typeNode)));
}
/**
 * If the Props type is a Readonly type (with no other mappings), then return
 * the unwrapped type; otherwise, return null.
 */
function getWrappedReadonlyType(type, typeNode, componentName, checker) {
    let rtnType = null;
    if (type.aliasSymbol?.name === 'Readonly') {
        const typeArg = type.aliasTypeArguments?.[0];
        const typeArgName = typeArg?.aliasSymbol?.name;
        // If the typeArg is NOT a MappedType, see if we can return
        // the unwrapped Type
        if (!typeArgName || !_MAPPED_TYPENAMES.has(typeArgName)) {
            if (typeArg.symbol) {
                const unwrappedNode = typeArg.symbol.declarations[0];
                rtnType = checker.getTypeAtLocation(unwrappedNode);
            }
            else {
                // If the typeArg has no Symbol, then it may be an IntersectionType.
                // In that case, looks to see if one of the sub-types is an instance
                // of ObservedGlobalProps -- the VComponent author may have specified it
                // incorrectly, in which case flag it as an error and (try to) provide
                // guidance on how to fix it.
                //
                // NOTE:  Since we are dealing with ts.Types as opposed to ts.TypeNodes,
                //        any import aliases have been resolved, so we need to test directly
                //        for "ObservedGlobalProps"!
                //
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
/**
 * Constructs a typeName, given a MappedTypesInfo object.
 *
 * If the wrappedTypeGenerics string is specified, then include those
 * type parameters for the innermost wrapped Type when constructing
 * the requested typeName.
 *
 * We don't need the type parameters for the innermost wrapped Type
 * for those use cases where we are simply using the returned typeName
 * to check for circular dependencies, etc.
 */
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
        // If we're at the last mappedTypes item,
        // add the innermost wrapped Type name (and,
        // optionally, its generics), and then close out
        // all the wrapping MappedTypes.
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
/**
 * Given a Type, determines if this is a Mapped Type
 * (requires special handling during walking to get its
 * Property members).
 */
function isMappedType(type) {
    let decl = type.symbol?.declarations?.[0];
    return decl && ts.isMappedTypeNode(decl);
}
/**
 * For a given Type return true if this mapped type is a generic Record type
 * @param type a type object
 * @returns
 */
function isRecordType(type) {
    let bRetVal = false;
    if (isMappedType(type)) {
        // direct Record type
        let objAlias = type.aliasSymbol;
        if (objAlias) {
            if (objAlias.getName() === 'Record') {
                bRetVal = true;
            }
            else {
                const aliasDecl = objAlias.declarations?.[0];
                // Indirect Record type via a type alias
                if (aliasDecl &&
                    ts.isTypeAliasDeclaration(aliasDecl) &&
                    ts.isTypeReferenceNode(aliasDecl.type) &&
                    aliasDecl.type.typeName.getText() === 'Record') {
                    bRetVal = true;
                }
            }
        }
    }
    return bRetVal;
}
function isFunctionType(type, checker) {
    // Get call signatures from the type
    const callSignatures = type.getCallSignatures();
    // If there are call signatures, it's a function type
    return callSignatures.length > 0;
}
/**
 * Given a Type, determines if this is a Conditional type
 */
function isConditionalType(type) {
    return !!(type['flags'] & ts.TypeFlags.Conditional);
}
/**
 * Given a Type, determines if this is an Object type
 */
function isObjectType(type, checker) {
    return (!!(type['flags'] & ts.TypeFlags.Object) ||
        (checker &&
            !!(type['flags'] & ts.TypeFlags.NonPrimitive) &&
            checker.typeToString(type) === 'object'));
}
/**
 * Given a Type, determines if it is an object type whose sub-properties
 * we would want to walk - for example, even though arrays, tuples, Maps,
 * and Sets are all JS objects, we don't want to directly walk their members.
 */
function isWalkableObjectType(type, checker) {
    let isWalkable = (isObjectType(type, checker) || type.isIntersection()) &&
        !checker.isArrayLikeType(type) &&
        !isRecordType(type);
    if (isWalkable) {
        const typeName = type.getSymbol()?.getName();
        if (typeName === 'Map' || typeName === 'Set') {
            isWalkable = false;
        }
    }
    return isWalkable;
}
/**
 * Given a Type, determines if this is the NonNullable wrapper type
 * (i.e., NonNullable<T>).
 */
function isNonNullableType(type, checker) {
    if (type && type.isIntersection()) {
        // Check if the type is an intersection of two types
        // where one of them is NonNullable
        return type.types.length === 2 && checker.typeToString(type).startsWith('NonNullable<');
    }
    return false;
}
/**
 * Given a Type, determines if this is "any" or "unknown"
 */
function isTypeTreatedAsAny(type) {
    return !!(type['flags'] & (ts.TypeFlags.Any | ts.TypeFlags.Unknown));
}
/**
 * Given a Type, determine if it is an IndexedAccessType whose objectType
 * and indexType are type parameters (i.e., "D[keyof D]")
 */
function isIndexedAccessTypeParameters(type) {
    let isDetected = false;
    if (type['flags'] & ts.TypeFlags.IndexedAccess) {
        const objType = type.objectType;
        const idxType = type.indexType['type'];
        isDetected =
            objType &&
                !!(objType['flags'] & ts.TypeFlags.TypeParameter) &&
                idxType &&
                !!(idxType['flags'] & ts.TypeFlags.TypeParameter);
    }
    return isDetected;
}
exports._UNION_SPLITTER = /\s*\|\s*/;
exports._INTERSECTION_SPLITTER = /\s*\&\s*/;
/**
 * Returns true if a direct or indirect reference to a ConditionalTypeNode
 * is detected; otherwise false.
 */
function isConditionalTypeNodeDetected(typeNode, seen, metaUtilObj) {
    let foundIt = false;
    if (ts.isConditionalTypeNode(typeNode)) {
        foundIt = true;
    }
    else if (ts.isTypeReferenceNode(typeNode)) {
        const typeName = (0, Utils_1.getTypeNameFromTypeReference)(typeNode);
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
/**
 * Given a Type, walks the members of that Type and processes them
 * via a specified callback.
 */
function walkTypeMembers(type, metaUtilObj, callback) {
    // Helper function that determines whether to exclude
    // a constituent Type (e.g., ObservedGlobalProps)
    const isExcludedType = function (type, metaUtilObj) {
        let rtnValue = false;
        let tname;
        // There are two use cases we need to cover:
        //  * if the specified Type's name matches
        //    a typename in our Excluded set;
        //  * if the specified Type is an alias declaration
        //    that resolves to a typename in our Excluded set.
        tname = type.aliasSymbol?.name;
        if (tname && metaUtilObj.excludedTypes?.has(tname)) {
            rtnValue = true;
        }
        else {
            const decl = type.aliasSymbol?.declarations?.[0];
            if (decl && ts.isTypeAliasDeclaration(decl) && ts.isTypeReferenceNode(decl.type)) {
                tname = (0, Utils_1.getTypeNameFromTypeReference)(decl.type);
                const aliasToExport = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.aliasToExport, decl.type);
                if (metaUtilObj.excludedTypes?.has(aliasToExport[tname])) {
                    rtnValue = true;
                }
            }
        }
        return rtnValue;
    };
    // Helper function to get a mapping of constituent Types that make up a Type
    const getConstituentTypes = function (type, metaUtilObj, typeMap) {
        const checker = metaUtilObj.typeChecker;
        // If this is an IntersectionType, map the types that make up the intersection.
        if (type.isIntersection()) {
            const intersectionTypes = type.types;
            for (let t of intersectionTypes) {
                getConstituentTypes(t, metaUtilObj, typeMap);
            }
        }
        // Objects like Classes and Interfaces can be extended (via heritageClauses)
        //  either by other Classes/Interfaces or by TypeAliases.
        // Check for any inherited types that require further mapping.
        else {
            const typeDecl = TypeUtils.getTypeDeclaration(type);
            if (typeDecl) {
                // Is this type a "ClassLike" object, or an Interface?
                if (ts.isClassLike(typeDecl) || ts.isInterfaceDeclaration(typeDecl)) {
                    const heritageClauses = typeDecl.heritageClauses;
                    if (heritageClauses) {
                        for (let clause of heritageClauses) {
                            for (let typeRef of clause.types) {
                                const inheritedTypeName = (0, Utils_1.getTypeNameFromTypeReference)(typeRef);
                                // If we have not seen this inherited type before, map it
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
            // Having processed any inherited types from this type's declaration, now check
            // whether the type meets our exclusion criteria or whether we have already
            // seen this type -- if neither is true, add to our type map.
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
    // Helper function to process a Type's member properties
    const processMembers = function (type, checker, callback) {
        // avoid processing members of the built in Array<T> type
        if (checker.isArrayLikeType(type)) {
            return;
        }
        if (!isMappedType(type) && !isConditionalType(type)) {
            // Handle index signatures
            // Note: when working with checker.getSymbolAtLocation (most likely called in the function that originated the walkTypeMembers
            // call to get the type of a property declaration by preserving the declaration's context)
            // and with checker.getPropertiesOfType (see below), we will not get a member Symbol for any index signatures, but there
            // are use cases where we need to pass this information up thru the callback. Therefore we check explicitly here if the
            // ts.Type has an index signature so we can create a "fake" synthetic signature Symbol to pass thru to the callback.
            // Example: consider the following property declaration:
            // propWithKeyedIndexType?: { [key: string]: MenuItem };
            // Note: if a ts.Type returns IndexInfo for both ts.IndexKind.String
            // AND ts.IndexKind.Number, we will use the IndexInfo for ts.IndexKind.String
            // to generate extension.vbdt.keyedProperties.values metadata.
            const stringIndexType = type.getStringIndexType();
            if (stringIndexType) {
                callback(createSyntheticIndexSignatureSymbol('string', stringIndexType, checker), ts.escapeLeadingUnderscores('__index:string__'));
            }
            // let's ask the checker for the members that are available for the ts.Type
            // this will give us back the "resolved" set of members that the type system sees
            // for instance if the type of a member is a type parameter and the parameter was
            // instantiated, we will get that type for the memberSymbol
            const members = checker.getPropertiesOfType(type);
            members?.forEach((memberSymbol) => {
                callback(memberSymbol, memberSymbol.getEscapedName());
            });
        }
        else {
            // If this is a MappedType or a ConditionalType, then let TS compute
            // the array of Property symbols that make up this Type.
            //
            // For MappedTypes, we will also need corresponding Root symbols for
            // generating Property metadata, and the Property symbols are then passed
            // as optional callback arguments -- these arguments are needed
            // to determine if the Mapped Type Property is optional,
            // since the Root symbol itself might not be marked as optional.
            const propSymbols = checker.getPropertiesOfType(type);
            if (propSymbols) {
                const rootSymbols = isMappedType(type)
                    ? propSymbols.map((sym) => checker.getRootSymbols(sym)?.[0])
                    : [];
                for (let i = 0; i < propSymbols.length; i++) {
                    const mappedSymbol = propSymbols[i];
                    const rootSymbol = rootSymbols?.[i] ?? mappedSymbol;
                    callback(rootSymbol, rootSymbol.getEscapedName(), mappedSymbol);
                }
            }
        }
    };
    // Get the constituent types that make up the specified Type
    let typeMap = {};
    getConstituentTypes(type, metaUtilObj, typeMap);
    // Iterate over the constituent types, and process their member properties
    const typeKeys = Object.keys(typeMap);
    const checker = metaUtilObj.typeChecker;
    for (let k of typeKeys) {
        processMembers(typeMap[k], checker, callback);
    }
}
/**
 * Given a TypeNode, walks the members of the underlying Type and processes them
 * via a specified callback.
 */
function walkTypeNodeMembers(typeNode, metaUtilObj, callback) {
    // Get the Type from the TypeNode
    const typeAtLoc = metaUtilObj.typeChecker.getTypeAtLocation(typeNode);
    walkTypeMembers(typeAtLoc, metaUtilObj, callback);
}
/**
 * Convenience method for preactMetadataTransformer to stash compiler-only Props metadata
 * (metadata that is only available after all Properties have been processed), which is
 * needed for type generation about the Props type.
 */
function updateCompilerPropsMetadata(readOnlyPropNameNodes, metaUtilObj) {
    metaUtilObj.fullMetadata['readOnlyProps'] =
        readOnlyPropNameNodes?.length > 0 ? readOnlyPropNameNodes.map((item) => item.name) : [];
    if (metaUtilObj.templateSlotProps?.length > 0) {
        metaUtilObj.fullMetadata['templateSlotProps'] = [...metaUtilObj.templateSlotProps];
    }
}
/**
 * Convenience method to stash compiler only metadata needed for type generation
 * and property binding metadata for the component (whether functional or class-based).
 * @param classNode
 */
function updateCompilerCompMetadata(vcompInfo, metaUtilObj) {
    // Handle metadata specifically related to class-based VComponents
    if (MetaTypes.isClassInfo(vcompInfo)) {
        const classNode = vcompInfo.classNode;
        if (classNode.typeParameters) {
            const genericsInfo = TypeUtils.getGenericsAndTypeParameters(classNode, metaUtilObj, MetaTypes.GTExtras.PARAMS_ANY | MetaTypes.GTExtras.DECL_NODES);
            metaUtilObj.fullMetadata['classTypeParamsDeclaration'] = genericsInfo?.genericsDeclaration;
            metaUtilObj.fullMetadata['classTypeParams'] = genericsInfo?.genericsTypeParams;
            metaUtilObj.fullMetadata['classTypeParamsAny'] = genericsInfo?.genericsTypeParamsAny;
            metaUtilObj.classTypeParamsNodes = genericsInfo?.genericsTypeParamsNodes;
            // stash an array of typedef metadata for the API Doc processing utility
            if (genericsInfo?.jsdoc.length > 0) {
                metaUtilObj.fullMetadata['jsdoc']['typedefs'] = genericsInfo.jsdoc;
            }
        }
        // Fetch any custom element-related class decorators
        const classDecorators = (0, DecoratorUtils_1.getDecorators)(classNode);
        const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, classNode);
        // Check for consumedBindings, providedBindings decorators on the custom element
        // and stash them away for subsequent processing of Property metadata
        const consumedBindingsDecorator = classDecorators[exportToAlias.consumedBindings];
        if (consumedBindingsDecorator) {
            metaUtilObj.classConsumedBindingsDecorator = consumedBindingsDecorator;
        }
        const providedBindingsDecorator = classDecorators[exportToAlias.providedBindings];
        if (providedBindingsDecorator) {
            metaUtilObj.classProvidedBindingsDecorator = providedBindingsDecorator;
        }
        // Check for a consumedContexts decorator and store its (first argument) expression
        // in the ClassInfo
        const consumedContextsDecorator = classDecorators[exportToAlias.consumedContexts];
        if (consumedContextsDecorator) {
            vcompInfo.consumedContextsExpression = (0, DecoratorUtils_1.getDecoratorArguments)(consumedContextsDecorator)?.[0];
        }
    }
    // Otherwise handle metadata specifically related to function-based VComponents
    else {
        // Is this a generic functional component?
        if (vcompInfo.typeParamsNode.typeParameters) {
            const genericsInfo = TypeUtils.getGenericsAndTypeParameters(vcompInfo.typeParamsNode, metaUtilObj, MetaTypes.GTExtras.PARAMS_ANY | MetaTypes.GTExtras.DECL_NODES);
            metaUtilObj.fullMetadata['classTypeParamsDeclaration'] = genericsInfo?.genericsDeclaration;
            metaUtilObj.fullMetadata['classTypeParams'] = genericsInfo?.genericsTypeParams;
            metaUtilObj.fullMetadata['classTypeParamsAny'] = genericsInfo?.genericsTypeParamsAny;
            metaUtilObj.classTypeParamsNodes = genericsInfo?.genericsTypeParamsNodes;
            // stash an array of typedef metadata for the API Doc processing utility
            if (genericsInfo?.jsdoc.length > 0) {
                metaUtilObj.fullMetadata['jsdoc']['typedefs'] = genericsInfo.jsdoc;
            }
        }
        if (vcompInfo.propBindings) {
            metaUtilObj.functionPropBindings = vcompInfo.propBindings;
        }
        // If required, signal that the dtsTransformer will have to use
        // an alternate strategy for generating this VComponent's
        // SettableProperties interface
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
// We need an array of valid keys for certain Metadata types, but because TypeScript
// types do not exist in the emitted RT code, we have to resort to a bit of trickery...
//
// We create dummy object instances using the Required utility type such that it forces
// us to enumerate all valid keys.  (And if the Metadata type changes, this will get
// caught when we compile custom-tsc & force us to update these dummy instances).
//
// We can then call Object.keys() on each dummy object instance to get the array
// of valid keys at runtime, which we use to instantiate a corresponding Set of valid keys
// that is used to prune invalid sub-props for the given context.
//
// NOTE: Our JSON schema allows both Event details and Slot data to specify
// additional metadata that is NOT included in their corresponding documented
// Metadata types.  Therefore, we need to grandfather these extras into
// our Sets of valid keys.
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
/**
 * Removes metadata stashed for the type generator before writing out files
 */
function pruneCompilerMetadata(metaUtilObj) {
    delete metaUtilObj.fullMetadata['classTypeParams']; // the type parameter signature used by the VComp class
    delete metaUtilObj.fullMetadata['classTypeParamsDeclaration']; // the type parameter declaration used by the VComp class
    delete metaUtilObj.fullMetadata['classTypeParamsAny']; // the lenient type parameter signature used by the VComp class
    delete metaUtilObj.fullMetadata['propsTypeParams']; // the type parameter names used by the Props class in the VComp class
    delete metaUtilObj.fullMetadata['propsMappedTypes']; // utility types wrapping the Props class that specify a MappedType
    delete metaUtilObj.fullMetadata['propsClassTypeParamsDeclaration']; // the type parameter declaration used by the Props class
    delete metaUtilObj.fullMetadata['propsClassTypeParams']; // the type parameter signature used by the Props class
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
    // For each event metadata element, prune any invalid sub-properties
    for (let event in metaUtilObj.fullMetadata.events) {
        _pruneSubPropMetadata(metaUtilObj.fullMetadata.events[event], validEventSubProps);
    }
    pruneMetadata(metaUtilObj.fullMetadata.slots);
    // For each slot metadata element, prune any invalid sub-properties
    for (let slot in metaUtilObj.fullMetadata.slots) {
        _pruneSubPropMetadata(metaUtilObj.fullMetadata.slots[slot], validSlotSubProps);
    }
    pruneMetadata(metaUtilObj.fullMetadata.dynamicSlots);
    // For each dynamic slot metadata element, prune any invalid sub-properties
    for (let dynSlot in metaUtilObj.fullMetadata.dynamicSlots) {
        _pruneSubPropMetadata(metaUtilObj.fullMetadata.dynamicSlots[dynSlot], validSlotSubProps);
    }
}
function pruneMetadata(metadata) {
    if (metadata && typeof metadata == 'object') {
        delete metadata['reftype'];
        delete metadata['isApiDocSignature'];
        delete metadata['typeDefs'];
        delete metadata['rawType'];
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
function updateRtExtensionMetadata(name, value, metaUtilObj) {
    if (!metaUtilObj.rtMetadata.extension) {
        metaUtilObj.rtMetadata.extension = {};
    }
    metaUtilObj.rtMetadata.extension[name] = value;
}
/**
 * Returns the metadata value represented by a given AST node.
 * MD values MUST be serializable to JSON, otherwise return undefined.
 *
 * If optional metaUtilObj is provided, then this utility supports:
 *    - dereferencing of reference nodes (including EnumMembers and other references to LiteralTypes)
 *    - exception reporting for metadata values that cannot serialize to JSON
 *
 * If optional topLvlProp is provided, then any exception reporting will provide
 * both the (top-level) property and sub-property context.
 *
 * @param valueNode AST node representing a metadata value
 * @param prop Name of metadata property
 * @param metaUtilObj If specified, enables dereferencing of reference nodes and exception reporting
 * @param topLvlProp If 'prop' is a metadata sub-property name, provides name of top-level MD property
 */
function getMDValueFromNode(valueNode, prop, metaUtilObj, topLvlProp) {
    let value = undefined;
    if (metaUtilObj) {
        const checker = metaUtilObj.typeChecker;
        // If the node yields a LiteralType through its Symbol,
        // then that will provide the metadata value.
        const valueSymbol = checker.getSymbolAtLocation(valueNode);
        if (valueSymbol) {
            const valueType = checker.getTypeOfSymbol(valueSymbol);
            if (valueType.isLiteral()) {
                return valueType.value; // all done...
            }
        }
        // If the node was not a reference to a LiteralType, dereference it now
        //
        // NOTE:
        //    getValueNodeFromReference will return undefined if its argument
        //    is NOT a reference, or if passed a reference to an unsupported use case,
        //    in which case valueNode should remain unchanged.
        //
        valueNode = (0, Utils_1.getValueNodeFromReference)(valueNode, metaUtilObj.typeChecker) ?? valueNode;
    }
    // At this point, is there a "value" to work with (NOT a reference)?
    if (!(0, Utils_1.isValueNodeReference)(valueNode)) {
        // Remove any type casts from the value
        valueNode = (0, Utils_1.removeCastExpressions)(valueNode);
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
                // Loop over the ArrayLiteral elements, pushing each metadata value
                // onto the return array.
                // If an item comes back as undefined, we assume there was an error
                // and we abort the entire metadata array value.
                // (i.e., sparse arrays are NOT supported!)
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
                        // abort the metadata array value and exit the loop
                        valArray = undefined;
                        break;
                    }
                }
                // Array value to return?
                if (valArray !== undefined) {
                    value = valArray;
                }
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                const objExpression = valueNode;
                let valObj = {};
                if (objExpression.properties.length > 0) {
                    // Loop over ObjectLiteral properties, adding simple PropertyAssignment
                    // key/MDValue pairs.  If an MDValue sub-prop comes back as undefined,
                    // skip it but keep going (any Warnings will have been logged).
                    for (const subprop of objExpression.properties) {
                        if (ts.isPropertyAssignment(subprop)) {
                            const sub_key = subprop.name.getText();
                            const sub_val = getMDValueFromNode(subprop.initializer, sub_key, metaUtilObj, topLvlProp ?? prop);
                            if (sub_val !== undefined) {
                                valObj[sub_key] = sub_val;
                            }
                        }
                    }
                    // If, after looping through all PropertyAssignments, we did not end up
                    // transferring any sub-properties, abort this metadata object value
                    if (Object.keys(valObj).length === 0) {
                        valObj = undefined;
                    }
                }
                // Object value to return?
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
/**
 * Returns the value of a specified Property from an ObjectLiteralExpression
 * @param objLiteral ObjectLiteralExpression node
 * @param prop Name of property whose value is requested
 * @returns property value, or undefined if property does not exist in object literal
 */
function getPropertyValueFromObjectLiteralExpression(objLiteral, propName) {
    let propValue = undefined;
    const propAssignment = objLiteral.properties.find((prop) => ts.isPropertyAssignment(prop) && prop.name.getText() === propName);
    if (propAssignment) {
        propValue = getMDValueFromNode(propAssignment.initializer, propName);
    }
    return propValue;
}
/**
 * Given a code snippet as a string, generate an array of Statement objects.
 *
 * The Statements will be generated as if they started from the beginning
 * of a logical SourceFile - if an optional offset is specified, then this
 * offset is applied to all of the Statements before they are returned.
 * @param text code snippet
 * @param offset? optional offset to apply to the TextRanges of the generated Statements
 * @returns ts.Statement[]
 */
function generateStatementsFromText(text, offset) {
    // this call will create an in-memory AST that represents the code snippet
    const tmpNode = ts.createSourceFile('temp.ts', text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX);
    const statements = tmpNode.statements.map((stmt) => {
        _applyFixups(stmt, offset);
        return stmt;
    });
    return statements;
}
function removeQuotes(str) {
    if (str) {
        return str.replace(/^['"]/g, '').replace(/['"]$/g, '');
    }
    return str;
}
function createTypeDefinitionFromTypeRefs(typeRefs, metaUtilObj, seenTypeDefs) {
    let retObj = [];
    typeRefs.forEach((node) => {
        let typeDefDetails = getTypeDefDetails(node, metaUtilObj, seenTypeDefs);
        if (typeDefDetails && typeDefDetails.name) {
            retObj.push(typeDefDetails);
            // if we have properties for the TD, or is a type from Core JET, add to the registry
            if (!findTypeDefByName(typeDefDetails, metaUtilObj) &&
                ((typeDefDetails.properties && Object.keys(typeDefDetails.properties).length > 0) ||
                    typeDefDetails.coreJetModule)) {
                // add to the global typedef registry
                metaUtilObj.typeDefinitions.push(typeDefDetails);
            }
        }
    });
    return retObj;
}
function createTypeDefinitionFromTypeDefObj(typeDefs, metaUtilObj, seenTypeDefs) {
    let retObj = [];
    typeDefs.forEach((td) => {
        const processProps = td.targetType ? false : true;
        let typeDefDetails = getTypeDefDetails(td.typeReference, metaUtilObj, seenTypeDefs, processProps);
        if (typeDefDetails && typeDefDetails.name) {
            if (td.targetType) {
                typeDefDetails.targetType = td.targetType;
            }
            retObj.push(typeDefDetails);
            // if we have properties for the TD, or is a type from Core JET, or is an alias typedef add to the registry
            if (!findTypeDefByName(typeDefDetails, metaUtilObj) &&
                ((typeDefDetails.properties && Object.keys(typeDefDetails.properties).length > 0) ||
                    typeDefDetails.coreJetModule ||
                    td.targetType)) {
                // add to the global typedef registry
                metaUtilObj.typeDefinitions.push(typeDefDetails);
            }
        }
    });
    return retObj;
}
function findTypeDefByName(typeDef, metaUtilObj) {
    metaUtilObj.typeDefinitions = metaUtilObj.typeDefinitions || [];
    return metaUtilObj.typeDefinitions.find((td) => {
        if (typeDef.coreJetModule) {
            return td.name === typeDef.name && td.coreJetModule;
        }
        else {
            return td.name === typeDef.name;
        }
    });
}
class MetaUtilObjFactory {
    static create(typeChecker, componentName, componentInfo, progImportMaps) {
        return {
            componentName: componentName || null,
            componentInfo: componentInfo || null,
            typeChecker,
            progImportMaps: progImportMaps || new ImportMaps_1.ImportMaps(),
            rtMetadata: {},
            fullMetadata: null,
            // Track dynamic slot types being use in a VComponent subclass
            // we either support DynamicSlots or DynamicTemplateSlots but not both
            dynamicSlotsInUse: 0b0000,
            dynamicSlotsInfo: [],
            followImports: true,
            debugMode: false,
            coreJetModuleMapping: new Map(),
            excludedTypes: new Set()
        };
    }
}
exports.MetaUtilObjFactory = MetaUtilObjFactory;
/*-------------------------------------------------------------------------*/
/*                           PRIVATE API                                   */
/*-------------------------------------------------------------------------*/
function createSyntheticIndexSignatureSymbol(keyType, valueType, checker) {
    const tmpSymbol = {
        getFlags: () => ts.SymbolFlags.Property,
        getName: () => `[key: ${keyType}]`,
        getEscapedName: () => `__index:${keyType}__`,
        valueDeclaration: undefined,
        declarations: []
    };
    // Optional metadata for downstream use
    tmpSymbol.__indexKeyType = keyType;
    tmpSymbol.__indexValueType = valueType;
    tmpSymbol.__indexDisplayType = checker.typeToString(valueType);
    return tmpSymbol;
}
function getTypeDefDetails(typeRefNode, metaUtilObj, seenTypeDefs, processProps) {
    // Default processProps to true if not specified
    processProps = processProps !== false;
    let md;
    let details;
    // Get the Type from the TypeNode
    const typeRefType = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
    // check if this type has a shape
    if (typeRefType && metaUtilObj.typeChecker.getPropertiesOfType(typeRefType)?.length > 0) {
        // returns a typeDef object with discovered jsdoc metadata
        md = TypeUtils.getTypeDefMetadata(typeRefType, metaUtilObj);
        // if we have a valid TD name and this TD was not added yet to the registry, then proceed to find it's members
        if (md.name && !findTypeDefByName(md, metaUtilObj) && !md.coreJetModule && processProps) {
            let detailName = md.name;
            seenTypeDefs = seenTypeDefs ?? new Set();
            if (!seenTypeDefs.has(detailName)) {
                seenTypeDefs.add(detailName);
                printInColor(`getTypeDefDetails:: push ${detailName} to the stack and walk it's members.`, metaUtilObj, 2, MetadataTypes_1.Color.FgCyan);
                printStack(seenTypeDefs, metaUtilObj);
                walkTypeNodeMembers(typeRefNode, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
                    const propSignature = symbol.valueDeclaration;
                    // if the symbol is an interface (as opposed to a type alias), generics will be part of members
                    if (!propSignature) {
                        return;
                    }
                    if (ts.isPropertySignature(propSignature) ||
                        ts.isPropertyDeclaration(propSignature) ||
                        ts.isMethodSignature(propSignature) ||
                        ts.isMethodDeclaration(propSignature)) {
                        const property = key.toString();
                        const propertyPath = [property];
                        const typeDefMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MDScope.DT, MetaTypes.MDContext.TYPEDEF, propertyPath, symbol, metaUtilObj);
                        const propSym = mappedTypeSymbol ?? symbol;
                        typeDefMetadata['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
                        // assign top level metadata
                        details = details || {};
                        details[property] = typeDefMetadata;
                        // check for circular reference
                        if (typeDefMetadata['rawType'] && seenTypeDefs.has(typeDefMetadata['rawType'])) {
                            printInColor(`getTypeDefDetails:: Circular reference detected for type:  ${typeDefMetadata['rawType']}.`, metaUtilObj, 2, MetadataTypes_1.Color.FgYellow);
                            delete details[property]['typeDefs'];
                            delete details[property]['rawType'];
                            return;
                        }
                        let nestedArrayStack = [];
                        if (typeDefMetadata.type === 'Array<object>') {
                            nestedArrayStack.push(key);
                        }
                        // check to see if we have sub properties
                        const complexMD = TypeUtils.getComplexPropertyMetadata(symbol, typeDefMetadata, detailName, MetaTypes.MDScope.DT, MetaTypes.MDContext.PROP | MetaTypes.MDContext.TYPEDEF, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs);
                        // process the returned complex property metadata
                        TypeUtils.processComplexPropertyMetadata(property, typeDefMetadata, complexMD, details[property]);
                    }
                    else {
                        printInColor(`getTypeDefDetails:: ${key.toString()} is not a supported declaration`, metaUtilObj, 2, MetadataTypes_1.Color.FgYellow);
                    }
                });
                // successfully processed the inner types, remove the outer type from the stack
                seenTypeDefs.delete(detailName);
                printInColor(`getTypeDefDetails:: Pop type:  ${md.name} from stack.`, metaUtilObj, 2, MetadataTypes_1.Color.FgCyan);
                printStack(seenTypeDefs, metaUtilObj);
            }
            else {
                printInColor(`getTypeDefDetails:: Circular reference detected for type:  ${md.name}.`, metaUtilObj, 2, MetadataTypes_1.Color.FgYellow);
                return md;
            }
        }
    }
    if (md) {
        if (details) {
            md.properties = details;
            printInColor(`getTypeDefDetails:: created TypeDef for ${md.name}.`, metaUtilObj, 2, MetadataTypes_1.Color.FgCyan);
        }
        else if (md.name) {
            printInColor(`getTypeDefDetails:: TypeDef for ${md.name} was already created, skip.`, metaUtilObj, 2, MetadataTypes_1.Color.FgCyan);
            if (md.coreJetModule) {
                printInColor(`getTypeDefDetails:: TypeDef is a core Jet type.`, metaUtilObj, 3, MetadataTypes_1.Color.FgCyan);
            }
        }
        else {
            printInColor(`getTypeDefDetails:: Cannot create TypeDef for this type reference. Reason: no discoverable name.`, metaUtilObj, 2, MetadataTypes_1.Color.FgYellow);
        }
    }
    else {
        printInColor(`getTypeDefDetails:: Cannot create TypeDef for this type reference. Reason: no metadata.`, metaUtilObj, 2, MetadataTypes_1.Color.FgYellow);
    }
    return md;
}
// Private functions
function printStack(stackSet, metaUtilObj) {
    let stack = [];
    stackSet.forEach((v) => stack.push(v));
    printInColor(`getTypeDefDetails:: Stack is: ${stack.length == 0 ? 'empty' : stack.join('->')}`, metaUtilObj, 2, MetadataTypes_1.Color.FgGreen);
}
/**
 * Prints the given text in color if the debug mode is enabled.
 * @param text The text to print.
 * @param metaUtilObj The MetaUtilObj containing debug mode information.
 * @param indent The number of spaces to indent the text.
 * @param fgColor Optional foreground color.
 * @param bgColor Optional background color.
 */
function printInColor(text, metaUtilObj, indent, fgColor, bgColor) {
    if (metaUtilObj.debugMode) {
        const spacing = ' '.repeat(indent);
        const fgBgColor = combineColors(fgColor, bgColor);
        const styledText = `${fgBgColor}${spacing}${text}${MetadataTypes_1.Color.Reset}`;
        console.log(styledText);
    }
}
function combineColors(fg, bg) {
    return `${bg ?? ''}${fg ?? ''}`;
}
function _offsetTextRange(tr, offset) {
    return { pos: tr.pos + offset, end: tr.end + offset };
}
/**
 * Explanation:
 * We used to create custom ts.Statements to inject into the ts.SourceFile
 * with the 3rd-party ts-creator package. This package generated factory API calls
 * to create various nodes (ex: ts.createImportDeclaration(...), etc.).
 * We migrated away from this package due to security concerns and a lack of support.
 *
 * As a substitute, we found that we could leverage the ts.createSourceFile API to
 * generate an array of ts.Statements, given the text of the TS code to be injected.
 *
 * The call below addresses a few issues with this alternate approach:
 *
 *    - force all newly created string literals to be emitted with single quotes
 *    - set the NodeFlags.Synthesized flag on all newly created ts.Nodes (to match
 *      ts.Nodes created through the regular factory methods)
 *    - an optional offset can also be applied to the positioning of all newly created
 *      ts.Nodes (required when appending ts.Statements, if comments are being emitted)
 */
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
// Generate a warning message for an invalid '@ojmetadata value' annotation
// that will be ignored
function _generateDefaultValueWarning(componentInfo, propertyPath) {
    let msg;
    const propPath = propertyPath?.length ? propertyPath.join('.') : '<unknown>';
    msg = `Property '${propPath}' - ignored JSDoc annotation specifying a default value.`;
    if (MetaTypes.isFunctionInfo(componentInfo)) {
        msg +=
            '\n  Specify the default value using function parameter destructuring syntax for the Props argument of the function component implementation.';
    }
    else {
        msg += "\n  Specify the default value in the component class's static 'defaultProps' field.";
    }
    return msg;
}
// Prune any subproperties that are not in the valid property set
function _pruneSubPropMetadata(metaelement, validSubPropMap) {
    // Loop through each metadata element's properties
    for (let metaprop in metaelement) {
        const validSubPropSet = validSubPropMap[metaprop];
        // Found a metadata element property requiring subprop pruning?
        if (validSubPropSet) {
            const metadata = metaelement[metaprop];
            _pruneSubPropsNotInSet(metadata, validSubPropSet);
        }
    }
}
function _pruneSubPropsNotInSet(metadata, validSet) {
    // Loop thru the metadata element's properties
    for (let prop in metadata) {
        // Loop thru each property's sub-properties
        for (let subprop in metadata[prop]) {
            // If the sub-property is not in the valid set, prune it!
            if (!validSet.has(subprop)) {
                delete metadata[prop][subprop];
            }
            // Otherwise, if this is the "properties" sub-property,
            // recurse in order to prune that as well!
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
    const aliasTypeName = (0, Utils_1.getTypeNameFromTypeReference)(typeNode);
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
/**
 * Given a JSDocTag, parses its comment text into a key/value pair of strings
 *  - key: first word of comment text
 *  - value: rest of comment text after initial separator (trimmed)
 *  - if comment text consists of a single word, return an empty string as the value
 * @param tag ts.JSDocTag
 * @returns MetaTypes.TagTuple key/value pair as a string tuple
 */
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
/**
 * Given an @ojmetadata JSDocTag, parses its comment text and performs some basic verification
 * and evaluation:
 *  - Is this a recognized DT metadata key?
 *  - Is the DT metadata value well-formed (i.e., evaluates to a JS primitive)?
 *  - If the key/value pair pass basic verification, also returns MDValidationInfo to be used
 *    for context-sensitive validation
 * @param tag @ojmetadata ts.JSDocTag instance
 * @param context Context flags
 * @param metaUtilObj bag o'useful stuff
 * @returns MetaTypes.MDTuple mdKey/mdValue/MDValidationInfo triplet
 */
function _getOjMetadataTuple(tag, context, metaUtilObj) {
    let mdKey;
    let mdVal;
    const [tagKey, tagVal] = _getTagTuple(tag);
    const mdValidationInfo = MetaValid.getValidationInfo(tagKey, context);
    if (!mdValidationInfo) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNRECOGNIZED_OJMETADATA_KEY, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Unrecognized @ojmetadata key '${tagKey}' will be ignored.`, tag);
    }
    else {
        mdKey = tagKey; // must be valid @ojmetadata key
        // If tag value is non-empty string, normalize it and then evaluate it
        // to get the @ojmetdata value
        if (tagVal.length > 0) {
            mdVal = _normalizeOjMetadataValue(mdKey, tagVal, mdValidationInfo, tag, metaUtilObj);
            try {
                // this will also check for a malformed object and/or array value
                mdVal = _execBundle(mdVal);
            }
            catch (e) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MALFORMED_METADATA_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Malformed metadata value '${mdVal}' for key '${mdKey}' will be ignored.`, tag);
                mdKey = undefined;
                mdVal = undefined;
            }
        }
        // Otherwise, if the tag value is an empty string, assume the key represents
        // a boolean DT metadata property (e.g., @ojmetadata translatable), in which case
        // specifying the key alone implies setting it to true.
        else {
            mdVal = true;
        }
    }
    return [mdKey, mdVal, mdValidationInfo];
}
// Normalize trimmed @ojmetadata tag values of whose baseType is string
function _normalizeOjMetadataValue(key, value, mdValidationInfo, tag, metaUtilObj) {
    let isStringNormalizationNeeded = false;
    // If the baseType is string and the tag value does NOT represent
    // an Array of strings, then normalize the tag string value.
    // NOTE: getDtMetadata will take care of wrapping individual DT metadata strings
    // within an Array as needed
    if (mdValidationInfo.baseType === 'string' &&
        !(mdValidationInfo.isArray && value.charAt(0) === '[' && value.charAt(value.length - 1) === ']')) {
        isStringNormalizationNeeded = true;
        // If the value begins with a quote but does not end with its matching quote,
        // trim any garbage text past the end of its matching quote before continuing
        // with our normalization.
        const start = value.charAt(0);
        const end = value.charAt(value.length - 1);
        if ((start === '"' || start === "'") && start !== end) {
            const matchingEndQuoteIndex = value.lastIndexOf(start);
            // If a matching quote is found that's not the starting quote,
            // then trim any garbage text past the matching quote.
            if (matchingEndQuoteIndex > 0) {
                // Log the presence of garbage text that is about to be trimmed
                // - that way, the developer can decide to clean this up.
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.TRIMMED_METADATA_STRING, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'${key}' text beyond the matching quote character was trimmed for metadata value: ${value}`, tag);
                // Trim the garbage text, and proceed
                value = value.substring(0, matchingEndQuoteIndex + 1);
            }
        }
        // Is the value wrapped in matching quotes at the beginning and end?
        if (value.match(/^(['"])(?:[\s\S])*?\1$/)) {
            // Strip off the matching quotes as long as the end result
            // is not an empty string...
            if (value.length > 2) {
                value = value.substring(1, value.length - 1);
            }
            // ...but if the value is indeed an empty quoted string,
            // then no further processing is required
            else if (value.length === 2) {
                isStringNormalizationNeeded = false;
            }
        }
    }
    if (isStringNormalizationNeeded) {
        // Normalize the value by:
        //  * replacing a string of one or more whitespace characters with a single space
        //  * escaping any single or double quote characters
        //  * trim and enclose the resulting value in double quotes
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
            // NOTE:  Also covers the case of an explicit 'undefined' value
            return ts.factory.createIdentifier(valueNode.getText());
            break;
        case ts.SyntaxKind.StringLiteral:
            // NOTES:
            //    * StringLiteral text has delimiters that need to be stripped
            //    * Cloned string literal always created with double quotes (JSON-compatible)
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
            // NOTES:
            //    * Our expectation is that any object literals being cloned as default property values
            //      will ONLY consist of simple property assignments (i.e., no short-hand assignments,
            //      no spread assignments, etc.)
            //    * Standardize on double-quoted string literals as property keys (JSON-compatible)
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
            // NOTES:
            //    * Use case is a property of type function where the specified default value
            //      is a reference to a declared function with the correct signature
            //    * Rather than inline the function expression, we just want to specify the
            //      declared function name
            //    * Valid TS syntax requires that a FunctionDeclaration will always have a name,
            //      but 'name' is an optional property so just in case...
            const funcDeclNode = valueNode;
            const funcID = funcDeclNode.name ? ts.idText(funcDeclNode.name) : 'undefined';
            return ts.factory.createIdentifier(funcID);
            break;
        default:
            // NOTE:  Fallback for all other unsupported/unexpected Node types...
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