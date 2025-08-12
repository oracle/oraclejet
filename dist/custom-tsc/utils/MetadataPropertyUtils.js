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
exports.generatePropertiesMetadata = generatePropertiesMetadata;
exports.checkReservedProps = checkReservedProps;
exports.generateObservedGlobalPropsMetadata = generateObservedGlobalPropsMetadata;
exports.generatePropertiesRtExtensionMetadata = generatePropertiesRtExtensionMetadata;
exports.updateDefaultsFromDefaultProps = updateDefaultsFromDefaultProps;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const MetadataSlotUtils_1 = require("./MetadataSlotUtils");
const MetadataEventUtils_1 = require("./MetadataEventUtils");
const TransformerError_1 = require("./TransformerError");
const MetadataTypes_1 = require("./MetadataTypes");
const DecoratorUtils_1 = require("../shared/DecoratorUtils");
const ImportMaps_1 = require("../shared/ImportMaps");
const Utils_1 = require("../shared/Utils");
function generatePropertiesMetadata(propsInfo, metaUtilObj) {
    let readOnlyPropNameNodes = [];
    let writebackPropNameNodes = [];
    let elementReadOnlyPropNameNodes = [];
    MetaUtils.walkTypeMembers(propsInfo.propsType, metaUtilObj, (memberSymbol, memberKey, mappedTypeSymbol) => {
        // Skip generic type parameters like K in Props<K>
        if (!TypeUtils.isGenericTypeParameter(memberSymbol)) {
            const propDeclaration = (memberSymbol.valueDeclaration ??
                memberSymbol.getDeclarations()[0]);
            // let's save the fact whether we had a valueDeclaration or not. We will use later
            // on in the generateObservedGlobalPropsMetadata utility function to decide if
            // we need to suppress this property from further processing
            const isValueDeclaration = !!memberSymbol.valueDeclaration;
            const prop = memberKey;
            const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, propDeclaration);
            // check for TypeReference so we can determine if we need to
            // skip for writeback property callback(s), process a slot or an event
            // which are all declared on the Props class
            const typeName = TypeUtils.getPropertyType(propDeclaration.type, propDeclaration.name.getText());
            const writebackPropInfo = getWritebackPropInfo(prop, propDeclaration, typeName, exportToAlias, metaUtilObj);
            // Writeback property?
            if (writebackPropInfo.propName) {
                // Add it to the list of writeback props
                writebackPropNameNodes.push({
                    name: writebackPropInfo.propName,
                    node: propDeclaration
                });
                // Read-only writeback property?
                if (writebackPropInfo.isReadOnly) {
                    const readOnlyWritebackProp = writebackPropInfo.propName;
                    // Check whether VComponent author incorrectly migrated the component
                    // and left either the old 'ElementReadOnly' prop declaration,
                    // or else removed the 'ElementReadOnly' marker type but left the prop.
                    const eroMatch = elementReadOnlyPropNameNodes.find((item) => item.name === readOnlyWritebackProp);
                    if (eroMatch) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_ROWRITEBACK_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate read-only writeback property '${readOnlyWritebackProp}' detected. Delete extraneous property of type 'ElementReadOnly'.`, eroMatch.node);
                    }
                    else if (metaUtilObj.rtMetadata.properties?.[readOnlyWritebackProp]) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_PROP_ROWRITEBACK, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate '${readOnlyWritebackProp}' property detected.`, propDeclaration);
                    }
                    // Otherwise, include the read-only writeback property in both
                    // the RT and DT metadata, and add it to the list of readOnlyProps
                    MetaUtils.printInColor(`Processing properties RT metadata...`, metaUtilObj, 0, MetadataTypes_1.Color.FgWhite, MetadataTypes_1.Color.BgBlue);
                    const rt = getMetadataForProperty(readOnlyWritebackProp, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MDScope.RT, MetaTypes.MDContext.PROP | MetaTypes.MDContext.PROP_RO_WRITEBACK, metaUtilObj);
                    MetaUtils.printInColor(`Processing properties DT metadata...`, metaUtilObj, 0, MetadataTypes_1.Color.FgWhite, MetadataTypes_1.Color.BgCyan);
                    const dt = getMetadataForProperty(readOnlyWritebackProp, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MDScope.DT, MetaTypes.MDContext.PROP | MetaTypes.MDContext.PROP_RO_WRITEBACK, metaUtilObj);
                    rt.readOnly = true;
                    dt.readOnly = true;
                    readOnlyPropNameNodes.push({
                        name: readOnlyWritebackProp,
                        node: propDeclaration
                    });
                    if (!metaUtilObj.rtMetadata.properties) {
                        metaUtilObj.rtMetadata.properties = {};
                    }
                    if (!metaUtilObj.fullMetadata.properties) {
                        metaUtilObj.fullMetadata.properties = {};
                    }
                    metaUtilObj.rtMetadata.properties[readOnlyWritebackProp] = rt;
                    metaUtilObj.fullMetadata.properties[readOnlyWritebackProp] = dt;
                }
            }
            else if (!generateObservedGlobalPropsMetadata(prop, propDeclaration, metaUtilObj, isValueDeclaration) &&
                !(0, MetadataSlotUtils_1.generateSlotsMetadata)(prop, propDeclaration, metaUtilObj) &&
                !(0, MetadataEventUtils_1.generateEventsMetadata)(prop, propDeclaration, metaUtilObj)) {
                // Check whether VComponent author incorrectly migrated the component, and
                // we have already encountered a read-only writeback property of this name.
                if (readOnlyPropNameNodes.find((item) => item.name === prop)) {
                    // Duplicate detected!  Now differentiate based upon whether the current
                    // prop declaration uses the deprecated ElementReadOnly marker type, or
                    // if it is just a plain prop declaration.
                    if (typeName === `${exportToAlias.ElementReadOnly}`) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_ROWRITEBACK_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate read-only writeback property '${prop}' detected. Delete extraneous property of type 'ElementReadOnly'.`, propDeclaration);
                    }
                    else {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_PROP_ROWRITEBACK, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate '${prop}' property detected.`, propDeclaration);
                    }
                }
                if (!metaUtilObj.rtMetadata.properties) {
                    metaUtilObj.rtMetadata.properties = {};
                }
                if (!metaUtilObj.fullMetadata.properties) {
                    metaUtilObj.fullMetadata.properties = {};
                }
                // get RT metadata
                const rt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MDScope.RT, MetaTypes.MDContext.PROP, metaUtilObj);
                // get DT + RT metadata
                MetaUtils.printInColor(`Processing properties DT metadata...`, metaUtilObj, 0, MetadataTypes_1.Color.FgWhite, MetadataTypes_1.Color.BgBlack);
                const dt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MDScope.DT, MetaTypes.MDContext.PROP, metaUtilObj);
                metaUtilObj.rtMetadata.properties[prop] = rt;
                metaUtilObj.fullMetadata.properties[prop] = dt;
                // (Deprecated) ElementReadOnly property?
                if (typeName === `${exportToAlias.ElementReadOnly}`) {
                    // Stash the (deprecated) ElementReadOnly property so we can check
                    // after all properties are processed whether a callback was added
                    rt.readOnly = true;
                    dt.readOnly = true;
                    const roNameNode = { name: prop, node: propDeclaration };
                    readOnlyPropNameNodes.push(roNameNode);
                    elementReadOnlyPropNameNodes.push(roNameNode); // for error checking...
                    const uppercaseProp = prop.charAt(0).toUpperCase() + prop.slice(1);
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DEPRECATED_ELEMENTREADONLY, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'${prop}' property is declared to be of deprecated type 'ElementReadOnly'.
  In order to upgrade, delete this '${prop}' field and instead declare a callback property 'on${uppercaseProp}Changed' of type 'ReadOnlyPropertyChanged'.`, propDeclaration);
                }
            }
        }
    });
    return { writebackPropNameNodes, readOnlyPropNameNodes };
}
function checkReservedProps(propsInfo, metaUtilObj) {
    MetaUtils.walkTypeMembers(propsInfo.propsType, metaUtilObj, (memberSymbol, memberKey, mappedTypeSymbol) => {
        // if the type is an interface (as opposed to a type alias), generic type parameters
        // may be amongst the set of members -- we'll want to skip them
        if (TypeUtils.isGenericTypeParameter(memberSymbol)) {
            return;
        }
        const prop = memberKey;
        const propDecl = memberSymbol.declarations?.[0];
        // Common reserved property name checks
        switch (prop) {
            case 'ref':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_REF_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'ref' is a reserved property and cannot be redefined.`, propDecl);
                break;
            case 'key':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_KEY_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'key' is a reserved property and cannot be redefined.`, propDecl);
                break;
            case 'className':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_CLASSNAME_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The 'className' property is not allowed. Use the global HTML 'class' property to specify style classes.`, propDecl);
                break;
            case 'htmlFor':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_HTMLFOR_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The 'htmlFor' property is not allowed. Define a 'for' property of type string instead, for the id of a labelable form-related element.`, propDecl);
                break;
            case 'class':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_CLASS_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'class' is a global HTML property already accessible to VComponents and cannot be overridden.`, propDecl);
                break;
            case 'style':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_STYLE_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'style' is a global HTML property already accessible to VComponents and cannot be overridden.`, propDecl);
                break;
            default:
                // If we detect a hit with the cached set of reserved GlobalProp names,
                // check whether this is an instance of an inline observed GlobalProps
                // property declaration.
                //
                //    - If an inline global JSX prop, add this prop to the RT metadata set of ObservedGlobalProps
                //      (generatePropertiesMetadata will add it to the DT metadata for API Doc generation);
                //    - If an inline global event handler JSX prop, throw an error (observed event handler JSX props
                //      are not supported);
                //    - Otherwise, log a warning
                if (metaUtilObj['reservedGlobalProps']?.has(prop)) {
                    const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, propDecl);
                    const ogpStatus = checkInlineObservedGlobalPropStatus(prop, propDecl, exportToAlias, metaUtilObj);
                    switch (ogpStatus) {
                        case InlineOGP.NONE:
                            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_GLOBAL_PROP, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'${prop}' property declaration overrides a global HTML property.
  As an alternative, either use the ObservedGlobalProps utility type to specify observable global HTML properties
  or update the property declaration to use the ${exportToAlias.GlobalProps ?? 'GlobalProps'}['${prop}'] indexed access type.`, propDecl);
                            break;
                        case InlineOGP.EVENT_HANDLER:
                            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_OBSERVED_EVENT_HANDLER, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The '${prop}' declaration is attempting to observe an event handler JSX property, which is not supported.`, propDecl);
                            break;
                        case InlineOGP.PROP:
                            propsInfo.propsRtObservedGlobalPropsSet =
                                propsInfo.propsRtObservedGlobalPropsSet || new Set();
                            propsInfo.propsRtObservedGlobalPropsSet.add(prop);
                            break;
                        default:
                            // Forces compilation error in case we add a new InlineOGP enum value without
                            // accounting for it in this switch logic
                            const check = ogpStatus;
                            break;
                    }
                }
                break;
        }
    });
}
/**
 * Determines if a property is an observed global property and, if so, adds its metadata
 * to the `observedGlobalProps` section of the provided metadata object.
 *
 * If the property is an inline observed global property, its metadata is extracted and
 * stored, and the function returns `true` to indicate it should not be processed as a
 * regular VComponent property. If the property is a reserved global property (but not
 * a value declaration), the function also returns `true` to skip further processing.
 *
 * @param prop - The name of the property being checked.
 * @param propDecl - The TypeScript property declaration node.
 * @param metaUtilObj - The metadata utility object containing context and metadata maps.
 * @param isValueDeclaration - Indicates if the property is a value declaration.
 * @returns `true` if the property is an observed or reserved global property and should be excluded from further processing; otherwise, `false`.
 */
function generateObservedGlobalPropsMetadata(prop, propDecl, metaUtilObj, isValueDeclaration) {
    const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, propDecl);
    let isObservedGlobalProp = checkInlineObservedGlobalPropStatus(prop, propDecl, exportToAlias, metaUtilObj) ===
        InlineOGP.PROP;
    // If this is an inline observed GlobalProp property declaration, add its metadata
    // to metaUtilObj.fullMetadata['observedGlobalProps'], and then return true
    // so that it does not get included with the other VComponent Properties.
    //
    // NOTE:  We let an InlineOGP.EVENT_HANDLER property declaration go through
    //        normal VComponent Property processing, where we will eventually detect it
    //        and throw an error!
    if (isObservedGlobalProp) {
        const gpDT = TypeUtils.getAllMetadataForDeclaration(propDecl, MetaTypes.MDScope.DT, MetaTypes.MDContext.PROP, null, null, metaUtilObj);
        // NOTE:  All GlobalProps are optional!
        gpDT['optional'] = true;
        metaUtilObj.fullMetadata['observedGlobalProps'] =
            metaUtilObj.fullMetadata['observedGlobalProps'] || {};
        metaUtilObj.fullMetadata['observedGlobalProps'][prop] = gpDT;
    }
    else {
        // We know at this point it's not an inlined OGP using IndexedAccessType, let's see
        // if it's still a reservedGlobalProps AND if it doesn't have a valueDeclaration,
        // in which case we don't want to process this property declaration further.
        isObservedGlobalProp = metaUtilObj['reservedGlobalProps']?.has(prop) && !isValueDeclaration;
    }
    return isObservedGlobalProp;
}
function generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, observedGlobalProps, metaUtilObj) {
    if (writebackPropNameNodes.length || readOnlyPropNameNodes.length) {
        const rtPropsMeta = metaUtilObj.rtMetadata.properties;
        const fullPropsMeta = metaUtilObj.fullMetadata.properties;
        const writebackProps = [];
        const readOnlyProps = [];
        for (const propNameNode of writebackPropNameNodes) {
            const prop = propNameNode.name;
            writebackProps.push(prop);
            if (!rtPropsMeta[prop]) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.WRITEBACK_NO_PROP_MATCH, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Writeback property callback found, but property '${prop}' was not defined.`, propNameNode.node);
            }
            // Update metadata to mark the writeback properties
            rtPropsMeta[prop].writeback = true;
            fullPropsMeta[prop].writeback = true;
        }
        for (const propNameNode of readOnlyPropNameNodes) {
            const prop = propNameNode.name;
            readOnlyProps.push(prop);
            if (writebackProps.indexOf(prop) === -1) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.ROWRITEBACK_NO_PROP_MATCH, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Read-only writeback property '${prop}' found, but no callback property was defined.`, propNameNode.node);
            }
        }
        // Stash so we can generate callbacks for these in the VirtualElementBridge
        MetaUtils.updateRtExtensionMetadata('_WRITEBACK_PROPS', writebackProps, metaUtilObj);
        // Stash so we can remove read-only properties in the VirtualElementBridge
        MetaUtils.updateRtExtensionMetadata('_READ_ONLY_PROPS', readOnlyProps, metaUtilObj);
    }
    if (observedGlobalProps?.size > 0) {
        // Stash the set of observed GlobalProps as RT extension metadata
        MetaUtils.updateRtExtensionMetadata('_OBSERVED_GLOBAL_PROPS', [...observedGlobalProps], metaUtilObj);
    }
}
/**
 * Walks the static defaultProps class property and update the
 * rt metadata
 * @param rt The runtime metadata object for the property
 * @param objExpression The defaultProps object
 */
function updateDefaultsFromDefaultProps(defaultProps, metaUtilObj) {
    const fullPropsMeta = metaUtilObj.fullMetadata?.properties;
    defaultProps.forEach((prop) => {
        // Only process BindingElements that a) have an initializer and b) are not rest parameters
        if (ts.isPropertyAssignment(prop) ||
            (ts.isBindingElement(prop) && prop.initializer && !prop.dotDotDotToken)) {
            const propName = prop.name.getText();
            const propMetadata = fullPropsMeta?.[propName];
            if (propMetadata) {
                // If the property is flagged in the DT as 'required', log a Warning
                if (propMetadata.required) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DT_REQUIRED_HAS_DEFAULT_VALUE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `The '${propName}' property has a default value and is flagged as 'required' in the design time environment.
  Properties with default values typically should not be flagged as 'required'.`, prop);
                }
                updateDefaultValue(propMetadata, propName, prop, metaUtilObj);
            }
            else {
                reportInvalidDefaultPropsDefault(propName, prop, metaUtilObj);
            }
        }
    });
}
// Private functions
var InlineOGP;
(function (InlineOGP) {
    InlineOGP[InlineOGP["NONE"] = 0] = "NONE";
    InlineOGP[InlineOGP["PROP"] = 1] = "PROP";
    InlineOGP[InlineOGP["EVENT_HANDLER"] = 2] = "EVENT_HANDLER";
})(InlineOGP || (InlineOGP = {}));
function checkInlineObservedGlobalPropStatus(prop, propDecl, exportToAlias, metaUtilObj) {
    let ogpStatus = InlineOGP.NONE;
    const gpTypeNode = propDecl.type;
    // Return InlineOGP.PROP if the property is defined by an IndexedAccessType
    // reference to a matching GlobalProps property name, e.g.:
    //
    //    id: GlobalProps['id'];
    //
    // Return InlineOGP.EVENT_HANDLER if the property is defined by an IndexedAccessType
    // reference to a matching GlobalProps event handler name, e.g.:
    //
    //    onfocusout: GlobalProps['onfocusout'];
    //
    // Otherwise return InlineOGP.NONE
    if (gpTypeNode && ts.isIndexedAccessTypeNode(gpTypeNode)) {
        if (ts.isTypeReferenceNode(gpTypeNode.objectType) &&
            (0, Utils_1.getTypeNameFromTypeReference)(gpTypeNode.objectType) === exportToAlias.GlobalProps &&
            ts.isLiteralTypeNode(gpTypeNode.indexType) &&
            ts.isStringLiteralLike(gpTypeNode.indexType.literal) &&
            gpTypeNode.indexType.literal.text === prop) {
            ogpStatus = prop.startsWith('on') ? InlineOGP.EVENT_HANDLER : InlineOGP.PROP;
        }
    }
    return ogpStatus;
}
function getWritebackPropInfo(prop, propDecl, typeName, exportToAlias, metaUtilObj) {
    let rtnInfo = {
        isReadOnly: false
    };
    switch (typeName) {
        case `${exportToAlias.ReadOnlyPropertyChanged}`:
            rtnInfo.isReadOnly = true;
        case `${exportToAlias.PropertyChanged}`:
            rtnInfo.propName = MetaUtils.writebackCallbackToProperty(prop);
            if (!rtnInfo.propName) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.WRITEBACK_MISSING_PREFIX, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Writeback property callback found, but property '${prop}' does not meet the 'on[Property]Changed' naming syntax.`, propDecl);
            }
            break;
        default:
            break;
    }
    return rtnInfo;
}
// Returns all discoverable metadata for a given property declaration together with its sub-properties (if they exist)
function getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, scope, context, metaUtilObj) {
    let md;
    const propsName = metaUtilObj.propsName;
    const propertyPath = [prop];
    const handleFunctionSignatureProcessing = (declTypeNode) => {
        const type = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
        let typeDeclaration = TypeUtils.getTypeDeclaration(type);
        if (typeDeclaration?.kind == ts.SyntaxKind.FunctionType) {
            const parameters = typeDeclaration.parameters;
            const functionParams = [];
            parameters.forEach((parameter) => {
                const name = parameter.name.getText();
                const symbol = parameter['symbol'];
                // only execute the parameter processing if we have the symbol object for the ParameterDeclaration
                if (symbol) {
                    const typeObj = getMetadataForProperty(name, symbol, parameter, null, MetaTypes.MDScope.DT, MetaTypes.MDContext.TYPEDEF, metaUtilObj);
                    const mParamObj = { name, ...typeObj };
                    functionParams.push(mParamObj);
                }
            });
            if (functionParams.length > 0) {
                metaObj['jsdoc'] = metaObj['jsdoc'] || {};
                metaObj['jsdoc']['params'] = functionParams;
            }
        }
    };
    if (scope == MetaTypes.MDScope.DT) {
        MetaUtils.printInColor(`Processing property: ${prop}`, metaUtilObj, 2, MetadataTypes_1.Color.FgBlack, MetadataTypes_1.Color.BgMagenta);
    }
    // get all possible metadata for this property declaration
    const metaObj = TypeUtils.getAllMetadataForDeclaration(propDeclaration, scope, context, propertyPath, memberSymbol, metaUtilObj);
    /*
     * For the DT scope, if the type of the property is a function signature we will try to gather the function's
     * parameter types to see if we should create a TypeDef in the API Doc. We will parse/process each parameter in
     * the same way as we would process a property (see the call to getMetadataForProperty but passing along
     * a ParameterDeclaration in this case).
     * Note: strangely enough, I was not able to get the symbol object for the ParameterDeclaration via the usual compiler
     * API calls. All the TS code suggests that parameters are considered in the context of a class constructor
     * I was expecting that the call to getSymbolsOfParameterPropertyDeclaration will return the symbol object.
     */
    if (scope == MetaTypes.MDScope.DT && metaObj.type.indexOf('function') > -1) {
        let declTypeNode = propDeclaration.type;
        if (ts.isUnionTypeNode(declTypeNode)) {
            for (const unionNode of declTypeNode.types) {
                if (ts.isParenthesizedTypeNode(unionNode)) {
                    declTypeNode = unionNode;
                    handleFunctionSignatureProcessing(declTypeNode);
                }
            }
        }
        else {
            handleFunctionSignatureProcessing(declTypeNode);
        }
    }
    // If a property has a complex type, generate the nested
    // metadata properties structure
    let nestedArrayStack = [];
    if (scope == MetaTypes.MDScope.DT && metaObj.isArrayOfObject) {
        nestedArrayStack.push(propDeclaration.name.getText());
    }
    if (scope == MetaTypes.MDScope.DT) {
        MetaUtils.printInColor(`Processing sub-properties for: ${prop}`, metaUtilObj, 2, MetadataTypes_1.Color.FgCyan);
    }
    const complexMD = TypeUtils.getComplexPropertyMetadata(memberSymbol, metaObj, propsName, scope, context, propertyPath, nestedArrayStack, metaUtilObj);
    md = metaObj;
    if (scope == MetaTypes.MDScope.DT) {
        const propSym = mappedTypeSymbol ?? memberSymbol;
        md['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
    }
    // if a circular reference was detected, set type to the returned substitution type
    // that stops further processing down that branch
    if (complexMD.circRefDetected) {
        md.type = TypeUtils.getSubstituteTypeForCircularReference(metaObj);
    }
    else {
        if (complexMD.properties) {
            // if we have object based array type, we explode the subproperties under a special location
            if (metaObj.isArrayOfObject) {
                if (scope == MetaTypes.MDScope.DT) {
                    md.extension = md.extension ?? {};
                    md.extension['vbdt'] = md.extension['vbdt'] ?? {};
                    md.extension['vbdt']['itemProperties'] = complexMD.properties;
                }
            }
            else {
                const typeNames = md.type.split(MetaUtils._UNION_SPLITTER);
                md.type =
                    typeNames.length <= 1 || typeNames.indexOf('null') === -1 ? 'object' : 'object|null';
                md.properties = complexMD.properties;
            }
        }
        if (complexMD.keyedProperties) {
            if (scope == MetaTypes.MDScope.DT) {
                md.extension = md.extension ?? {};
                md.extension['vbdt'] = md.extension['vbdt'] ?? {};
                md.extension['vbdt']['keyedProperties'] = complexMD.keyedProperties;
            }
        }
    }
    // Parse default values
    if (propDeclaration.initializer) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_NO_DEFAULTPROPS, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Default value should be set using defaultProps for '${memberSymbol.name}'.`, propDeclaration);
    }
    // Process PropertyBinding metadata:
    //  * for function-based VComponents, specified via an optional 3rd arg to 'registerCustomElement'
    //  * for class-based VComponents, specified via decorators
    if (metaUtilObj.functionPropBindings) {
        if (metaUtilObj.functionPropBindings[prop]) {
            md.binding = metaUtilObj.functionPropBindings[prop];
        }
    }
    else {
        // @consumedBindings({ prop: { name: 'value' }, ... })
        if (metaUtilObj.classConsumedBindingsDecorator) {
            const consumedArg = (0, DecoratorUtils_1.getDecoratorArguments)(metaUtilObj.classConsumedBindingsDecorator)?.[0];
            if (consumedArg && ts.isObjectLiteralExpression(consumedArg)) {
                const consume = MetaUtils.getPropertyValueFromObjectLiteralExpression(consumedArg, prop);
                if (consume) {
                    if (!md.binding) {
                        md.binding = {};
                    }
                    md.binding.consume = consume;
                }
            }
        }
        // @providedBindings({ prop: [{ name: 'nameValue',
        //                              default: 'defaultValue',
        //                              transform: {prop1: 'provided', prop2: 'provided'} }], ... } )
        if (metaUtilObj.classProvidedBindingsDecorator) {
            const providedArg = (0, DecoratorUtils_1.getDecoratorArguments)(metaUtilObj.classProvidedBindingsDecorator)?.[0];
            if (providedArg && ts.isObjectLiteralExpression(providedArg)) {
                const provide = MetaUtils.getPropertyValueFromObjectLiteralExpression(providedArg, prop);
                if (provide) {
                    if (!md.binding) {
                        md.binding = {};
                    }
                    md.binding.provide = provide;
                }
            }
        }
    }
    // remove helper metadata before writing out
    delete md['isArrayOfObject'];
    delete md['isEnumValuesForDTOnly'];
    delete md['typeDefs'];
    delete md['rawType'];
    return md;
}
function updateDefaultValue(md, propertyName, propNode, metaUtilObj) {
    let defMDValueNode = (0, Utils_1.removeCastExpressions)(propNode.initializer);
    let value;
    if (defMDValueNode) {
        // Specifying an inline object or array literal as a default value
        // in an ES6 destructuring assignment can cause performance issues,
        // so warn the VComponent author, but otherwise accept the default.
        if (ts.isBindingElement(propNode) &&
            (ts.isObjectLiteralExpression(defMDValueNode) || ts.isArrayLiteralExpression(defMDValueNode))) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_OBJECT_LITERAL, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Default property values specified as inline object or array literals can cause performance issues.
  Use a reference to a non-primitive constant instead.`, defMDValueNode);
        }
        // If the default value is a reference (i.e., either an Identifier or
        // a PropertyAccessExpression), then dereference it to get the node
        // representing the actual value
        if ((0, Utils_1.isValueNodeReference)(defMDValueNode)) {
            defMDValueNode = (0, Utils_1.getValueNodeFromReference)(defMDValueNode, metaUtilObj.typeChecker);
            // Remove any type casts from the dereferenced value node
            defMDValueNode = (0, Utils_1.removeCastExpressions)(defMDValueNode);
        }
        // Still have something to work with?
        if (defMDValueNode) {
            // Still have something to work with for MD processing?
            // NOTE:  At this point, if defMDValueNode is an Identifier,
            //        then it's probably a (JSON non-serializable) 'undefined'
            //        so we skip it.
            if (!ts.isIdentifier(defMDValueNode)) {
                value = MetaUtils.getMDValueFromNode(defMDValueNode, propertyName, metaUtilObj);
            }
        }
    }
    if (value !== undefined) {
        // object not expected, or default is null?
        if (!md.properties || value === null) {
            // Set the MD value directly if we don't need to walk a nested structure
            md.value = value;
            // otherwise object is expected, check if we have one
        }
        else if (isAnObject(value)) {
            // separate default values onto their leaf property MD objects
            updateComplexPropertyValues(md.properties, value, propertyName, defMDValueNode, metaUtilObj);
        }
        else {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_NONOBJECT_VALUE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Non-object default value '${value}' specified for object property '${propertyName}'.`, defMDValueNode);
        }
    }
    if (defMDValueNode) {
        // Save ALL defaultProps (even non-serializable JSON defaults, like 'undefined')
        // in an object processed separately during function-based VComponent registration.
        metaUtilObj.defaultPropToNode = metaUtilObj.defaultPropToNode || {};
        metaUtilObj.defaultPropToNode[propertyName] = defMDValueNode;
    }
}
/**
 * Recursively walk a complex property metadata object and adds default values to
 * leaf nodes.
 * @param md The metadata object for the (current) object property
 * @param values The values to split out into leaf nodes
 * @param propName The name of the outermost object property
 * @param valueNode The outermost AST node for the object property's value
 * @param metaUtilObj bag o'useful stuff
 */
function updateComplexPropertyValues(md, values, propName, valueNode, metaUtilObj) {
    if (md) {
        for (let [key, value] of Object.entries(values)) {
            if (md[key] === undefined) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNRECOGNIZED_SUBPROP_KEY, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Sub-property '${key}' of property '${propName}' is unrecognized.`, valueNode);
            }
            else if (value !== undefined) {
                // object not expected, or default is null?
                if (!md[key].properties || value === null) {
                    // Set the value directly if we don't need to walk a nested structure
                    md[key].value = value;
                }
                // otherwise object is expected, check if we have one
                else if (isAnObject(value)) {
                    // recurse to walk nested structure
                    updateComplexPropertyValues(md[key].properties, value, propName, valueNode, metaUtilObj);
                }
                else {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_NONOBJECT_VALUE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Non-object default value '${value}' specified for object sub-property '${key}' of property '${propName}'.`, valueNode);
                }
            }
        }
    }
}
function isAnObject(value) {
    return typeof value === 'object' && !Array.isArray(value);
}
function reportInvalidDefaultPropsDefault(propName, propNode, metaUtilObj) {
    const fullMeta = metaUtilObj.fullMetadata;
    const observedGlobalProps = metaUtilObj.rtMetadata.extension?._OBSERVED_GLOBAL_PROPS;
    // If trying to initialize a slot, let it go through
    // until we can verify whether or not it is feasible
    // to support this use case at RT (see JET-46508, JET-46509)
    //
    // NOTE:  DynamicSlot use cases are flagged by the generic
    //        'Unknown property' errMsg, as we don't have a good way
    //        to tie the propName to dynamicSlots metadata.
    if (propName === MetaTypes.DEFAULT_SLOT_PROP || fullMeta.slots?.[propName]) {
        return;
    }
    else {
        // See if we can translate the propName to an event name
        if (propName.length > 2) {
            const eventPropName = `${propName[2].toLowerCase()}${propName.substring(3)}`;
            // Trying to initialize an event?
            if (fullMeta.events?.[eventPropName]) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_EVENT_HANDLER, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The '${propName}' event handler cannot be initialized with a default property value.`, propNode);
            }
        }
        // Check if this is an ObservedGlobalProp:
        //  - OK if there is no default value, otherwise fail
        if (observedGlobalProps?.indexOf(propName) >= 0) {
            if (!propNode.initializer) {
                return;
            }
            else {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_OBSERVEDGLOBALPROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Observed GlobalProp '${propName}' cannot be initialized with a default property value.`, propNode);
            }
        }
        // If no other case detected, report a generic exception
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_UNKNOWN_PROP, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `Unknown property '${propName}' cannot be initialized with a default property value.`, propNode);
    }
}
//# sourceMappingURL=MetadataPropertyUtils.js.map