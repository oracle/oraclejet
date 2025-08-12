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
exports.generateSlotsMetadata = generateSlotsMetadata;
exports.getSlotData = getSlotData;
exports.validateDynamicSlots = validateDynamicSlots;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
const ImportMaps_1 = require("../shared/ImportMaps");
const Utils_1 = require("../shared/Utils");
// Used in conjunction with the metaUtilObj.dynamicSlotsInUse bitmap
// and dynamic slot validation
const _DYNAMIC_SLOT_DETECTED = 0b0001;
const _DYNAMIC_TEMPLATE_SLOT_DETECTED = 0b0010;
const _DYNAMIC_SLOT_INVALID_STATE = 0b0011;
const _INVALID_MIXED_DYNAMIC_SLOT_PROPS_MSG = 'Components cannot have properties for both dynamic slots and dynamic template slots. Only a single Property is allowed to specify support for dynamic slots.';
const _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG = 'The ImplicitBusyContext marker type does not apply to Template Slots nor to Dynamic Slots, and should be removed.';
const _INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM_MSG = `The DynamicTemplateSlots type requires that its type parameter consist of one or more named type references.
  Refactor any inline type literals, mapped types, intersection types, etc. into a new type alias or interface definition, and reference it by name.
  This name will become a key in the 'dynamicSlots' element of the VComponent's generated metadata JSON.`;
function generateSlotsMetadata(memberKey, slotPropDeclaration, metaUtilObj) {
    let isSlot = false;
    const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, slotPropDeclaration);
    const slotTypeInfo = getSlotTypeInfo(slotPropDeclaration, exportToAlias, metaUtilObj);
    if (slotTypeInfo) {
        checkDefaultSlotType(memberKey, slotTypeInfo.typeName, slotPropDeclaration, exportToAlias, metaUtilObj);
        // If we pass Default slot check, then assume we have a slot (until we find out otherwise...)
        isSlot = true;
        switch (slotTypeInfo.typeName) {
            case `${exportToAlias.ComponentChildren}`:
                updateSlotMetadata('', slotPropDeclaration, slotTypeInfo, false, false, metaUtilObj);
                break;
            case `${exportToAlias.TemplateSlot}`:
                updateSlotMetadata(memberKey, slotPropDeclaration, slotTypeInfo, true, false, metaUtilObj);
                break;
            case `${exportToAlias.Slot}`:
                updateSlotMetadata(memberKey, slotPropDeclaration, slotTypeInfo, false, false, metaUtilObj);
                break;
            case `${exportToAlias.DynamicTemplateSlots}`:
                if (metaUtilObj.dynamicSlotsInUse & _DYNAMIC_TEMPLATE_SLOT_DETECTED) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MULTIPLE_DYNAMIC_TEMPLATE_SLOTS, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Components cannot have multiple properties for dynamic template slots. Only a single Property is allowed to specify support for dynamic slots.`, slotPropDeclaration);
                }
                metaUtilObj.dynamicSlotsInUse =
                    metaUtilObj.dynamicSlotsInUse | _DYNAMIC_TEMPLATE_SLOT_DETECTED;
                if (metaUtilObj.dynamicSlotsInUse === _DYNAMIC_SLOT_INVALID_STATE) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_MIXED_DYNAMIC_SLOT_PROPS, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, _INVALID_MIXED_DYNAMIC_SLOT_PROPS_MSG, slotPropDeclaration);
                }
                MetaUtils.updateRtExtensionMetadata('_DYNAMIC_SLOT', {
                    prop: memberKey,
                    isTemplate: 1
                }, metaUtilObj);
                updateSlotMetadata(memberKey, slotPropDeclaration, slotTypeInfo, true, true, metaUtilObj);
                break;
            case `${exportToAlias.DynamicSlots}`:
                if (metaUtilObj.dynamicSlotsInUse & _DYNAMIC_SLOT_DETECTED) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MULTIPLE_DYNAMIC_SLOTS, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Components cannot have multiple properties for dynamic slots. Only a single Property is allowed to specify support for dynamic slots.`, slotPropDeclaration);
                }
                metaUtilObj.dynamicSlotsInUse = metaUtilObj.dynamicSlotsInUse | _DYNAMIC_SLOT_DETECTED;
                if (metaUtilObj.dynamicSlotsInUse === _DYNAMIC_SLOT_INVALID_STATE) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_MIXED_DYNAMIC_SLOT_PROPS, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, _INVALID_MIXED_DYNAMIC_SLOT_PROPS_MSG, slotPropDeclaration);
                }
                if (slotTypeInfo.hasImplicitBusyContext) {
                    // Report error that ImplicitBusyContext marker type is unsupported
                    // for Dynamic Slots
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, slotPropDeclaration.type ?? slotPropDeclaration);
                }
                MetaUtils.updateRtExtensionMetadata('_DYNAMIC_SLOT', {
                    prop: memberKey,
                    isTemplate: 0
                }, metaUtilObj);
                metaUtilObj.fullMetadata.dynamicSlots = metaUtilObj.fullMetadata.dynamicSlots || {};
                // For purposes of subsequent dynamic slot validation, associate
                // the declaration of the property of type 'DynamicSlots' with
                // its metadata "key" (i.e., the empty string).
                // to aid in documenting dynamic lots in the Api Doc, gather all discoverable
                // metadata from the property declaration and attach to the object below
                let slotDt = MetaUtils.getDtMetadata(slotPropDeclaration, MetaTypes.MDContext.SLOT, null, metaUtilObj);
                metaUtilObj.dynamicSlotsInfo.push({
                    key: '',
                    node: slotPropDeclaration.type ?? slotPropDeclaration,
                    metadata: slotDt
                });
                break;
            default:
                // Nope, wasn't a slot after all...
                isSlot = false;
                break;
        }
    }
    return isSlot;
}
function updateSlotMetadata(slotName, propDeclaration, slotTypeInfo, isTemplateSlot, isDynamicSlot, metaUtilObj) {
    if (!isDynamicSlot) {
        let slotDataNode;
        let templateSlotInfo;
        if (!metaUtilObj.rtMetadata.slots) {
            metaUtilObj.rtMetadata.slots = {};
            metaUtilObj.fullMetadata.slots = {};
        }
        if (isTemplateSlot) {
            if (slotTypeInfo.hasImplicitBusyContext) {
                // Report error that ImplicitBusyContext marker type is unsupported
                // for Template Slots
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, propDeclaration.type ?? propDeclaration);
            }
            slotDataNode = getSlotDataNode(slotTypeInfo);
            if (slotDataNode) {
                templateSlotInfo = getTemplateSlotInfo(slotName, slotDataNode, metaUtilObj);
            }
        }
        // NOTE: Only non-template slots support implicitBusyContext
        metaUtilObj.rtMetadata.slots[slotName] = isTemplateSlot
            ? { data: {} }
            : slotTypeInfo.hasImplicitBusyContext
                ? { implicitBusyContext: true }
                : {};
        metaUtilObj.fullMetadata.slots[slotName] = Object.assign({}, getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj), slotTypeInfo.hasImplicitBusyContext && !isTemplateSlot ? { implicitBusyContext: true } : {});
        // NOTE: We can only get the template slot's render function signature
        // type alias, context type alias, and deprecation status AFTER
        // having populated its DT metadata
        if (templateSlotInfo) {
            [templateSlotInfo.slotContextType, templateSlotInfo.slotRenderType] =
                getTemplateSlotAliasTypes(metaUtilObj.fullMetadata.slots[slotName], templateSlotInfo.slotPropName);
            const slotDeprecation = metaUtilObj.fullMetadata.slots[slotName].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
            if (slotDeprecation) {
                templateSlotInfo.slotDeprecation = slotDeprecation;
            }
            // Perform a final validation check, returning information for context
            // alias declaration signatures before pushing
            [
                templateSlotInfo.slotContextTypeParams,
                templateSlotInfo.slotRenderContextTypeParams,
                templateSlotInfo.slotContextIndirectType
            ] = getSlotContextDeclSignatures(slotDataNode, templateSlotInfo, metaUtilObj);
            metaUtilObj.templateSlotProps ??= [];
            metaUtilObj.templateSlotProps.push(templateSlotInfo);
        }
    }
    else {
        if (slotTypeInfo.hasImplicitBusyContext) {
            // Report error that ImplicitBusyContext marker type is unsupported
            // for Dynamic Slots
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, propDeclaration.type ?? propDeclaration);
        }
        // For dynamic template slots we need to provide component-level 'dynamicSlots' metadata -
        // the value is an object, whose keys are dynamic template slot type names and whose values
        // are of type MetadataTypes.ComponentMetadataSlots.
        if (isTemplateSlot) {
            metaUtilObj.fullMetadata.dynamicSlots ??= {};
            const slotDataNode = getSlotDataNode(slotTypeInfo);
            if (slotDataNode) {
                // If the type parameter of DynamicTemplateSlots is a Union Type,
                // then each sub-type defines a separate context object, each with its
                // own key in the "dynamicSlots" DT metadata.
                if (ts.isUnionTypeNode(slotDataNode)) {
                    const typeParamsArr = slotDataNode.types;
                    typeParamsArr.forEach((dataNode) => {
                        // Each sub-type must be a "simple" type reference (i.e., not a MappedType nor an Array)
                        if (!ts.isTypeReferenceNode(dataNode) || !MetaUtils.isSimpleTypeReference(dataNode)) {
                            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, _INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM_MSG, dataNode);
                        }
                        const key = (0, Utils_1.getTypeNameFromTypeReference)(dataNode);
                        // NOTE: The 'slotName' for DynamicTemplateSlots is immaterial
                        //  - during subsequent dynamic slot validation we will find the Property
                        //    whose value specifies the corresponding dynamic slot name, and that
                        //    Property will be used to determine the name of the renderer
                        //    function signature type
                        const dynamicTemplateSlotInfo = getTemplateSlotInfo(slotName, dataNode, metaUtilObj);
                        let dt = MetaUtils.getDtMetadata(propDeclaration, MetaTypes.MDContext.SLOT, null, metaUtilObj);
                        const dataObj = getSlotData(dataNode, metaUtilObj);
                        if (dataObj) {
                            dt['data'] = dataObj;
                        }
                        let processedStatus;
                        if (dt.status) {
                            processedStatus = processDynamicTemplateSlotsStatus(key, dt.status);
                            // if the filtered DynamicTemplateSlots status metadata is non-empty,
                            // then reset it; otherwise remove status from the dt metadata
                            if (processedStatus.filteredStatus.length > 0) {
                                dt.status = processedStatus.filteredStatus;
                            }
                            else {
                                delete dt.status;
                            }
                        }
                        metaUtilObj.fullMetadata.dynamicSlots[key] = dt;
                        // get the jsdoc metadata for the template slot context type
                        // (to be passed to the ApiDocUtils)
                        let slotDataType = metaUtilObj.typeChecker.getTypeAtLocation(dataNode);
                        let slotDataTypeDecl = TypeUtils.getTypeDeclaration(slotDataType);
                        let typeDt;
                        if (slotDataTypeDecl) {
                            typeDt = MetaUtils.getDtMetadata(slotDataTypeDecl, MetaTypes.MDContext.TYPEDEF, null, metaUtilObj);
                        }
                        // Save information about dynamicSlots for subsequent validation,
                        // template slot processing
                        const dynamicSlotItem = {
                            key,
                            node: dataNode,
                            deprecation: processedStatus?.filteredDeprecation,
                            metadata: typeDt
                        };
                        if (dynamicTemplateSlotInfo) {
                            dynamicSlotItem.slotTypeParamName = dynamicTemplateSlotInfo.slotTypeParamName;
                            dynamicSlotItem.slotDataTypeParamsDeclaration =
                                dynamicTemplateSlotInfo.slotDataTypeParamsDeclaration;
                            dynamicSlotItem.slotDataTypeParams = dynamicTemplateSlotInfo.slotDataTypeParams;
                        }
                        metaUtilObj.dynamicSlotsInfo.push(dynamicSlotItem);
                    });
                }
                else {
                    // The context object type must be a "simple" type reference (i.e.,
                    // not a MappedType nor an Array)
                    if (!ts.isTypeReferenceNode(slotDataNode) ||
                        !MetaUtils.isSimpleTypeReference(slotDataNode)) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, _INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM_MSG, slotDataNode);
                    }
                    const key = (0, Utils_1.getTypeNameFromTypeReference)(slotDataNode);
                    // NOTE: The 'slotName' for DynamicTemplateSlots is immaterial
                    //  - during subsequent dynamic slot validation we will find the Property
                    //    whose value specifies the corresponding dynamic slot name, and that
                    //    Property name will be used to determine the name of the renderer
                    //    function signature type
                    const dynamicTemplateSlotInfo = getTemplateSlotInfo(slotName, slotDataNode, metaUtilObj);
                    let dt = getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj);
                    let processedStatus;
                    if (dt.status) {
                        processedStatus = processDynamicTemplateSlotsStatus(key, dt.status);
                        // if the filtered DynamicTemplateSlots status metadata is non-empty,
                        // then reset it; otherwise remove status from the dt metadata
                        if (processedStatus.filteredStatus.length > 0) {
                            dt.status = processedStatus.filteredStatus;
                        }
                        else {
                            delete dt.status;
                        }
                    }
                    metaUtilObj.fullMetadata.dynamicSlots[key] = dt;
                    // get the jsdoc metadata for the template slot context type (to be passed to the ApiDocUtils)
                    let slotDataType = metaUtilObj.typeChecker.getTypeAtLocation(slotDataNode);
                    let slotDataTypeDecl = TypeUtils.getTypeDeclaration(slotDataType);
                    let typeDt;
                    if (slotDataTypeDecl) {
                        typeDt = MetaUtils.getDtMetadata(slotDataTypeDecl, MetaTypes.MDContext.TYPEDEF, null, metaUtilObj);
                    }
                    // Save information about dynamicSlots for subsequent validation,
                    // template slot processing
                    const dynamicSlotItem = {
                        key,
                        node: slotDataNode,
                        deprecation: processedStatus?.filteredDeprecation,
                        metadata: typeDt
                    };
                    if (dynamicTemplateSlotInfo) {
                        dynamicSlotItem.slotTypeParamName = dynamicTemplateSlotInfo.slotTypeParamName;
                        dynamicSlotItem.slotDataTypeParamsDeclaration =
                            dynamicTemplateSlotInfo.slotDataTypeParamsDeclaration;
                        dynamicSlotItem.slotDataTypeParams = dynamicTemplateSlotInfo.slotDataTypeParams;
                    }
                    metaUtilObj.dynamicSlotsInfo.push(dynamicSlotItem);
                }
            }
        }
    }
}
function processDynamicTemplateSlotsStatus(key, origStatus) {
    const filteredStatus = [];
    let filteredDeprecation;
    for (const status of origStatus) {
        if (status.type && status.type !== 'deprecated') {
            // clone all non-deprecation Status items to the filtered list
            filteredStatus.push({ ...status });
        }
        else if (status.type == undefined || status.type === 'deprecated') {
            // clone the potential deprecation Status item
            let depStatus = { ...status };
            // is there a specific target?
            if (depStatus.target) {
                // if the deprecation Status item has a 'propertyType' target that identifies
                // this particular dynamic template slot key value, filter the target and value
                // metadata properties from the Status item (no longer needed)
                if (depStatus.target === 'propertyType' && depStatus.value?.indexOf(key) >= 0) {
                    delete depStatus.target;
                    delete depStatus.value;
                }
                // otherwise if not a matching target then drop this deprecation Status item
                else {
                    depStatus = undefined;
                }
            }
            // if we still have a current deprecation Status item, check whether we should update our
            // candidate for the "final" Deprecation for the specified dynamic template slot key,
            // and push the Status item to the filtered list
            if (depStatus) {
                if (filteredDeprecation == undefined ||
                    isMoreRecentDeprecation(depStatus, filteredDeprecation)) {
                    filteredDeprecation = depStatus;
                }
                filteredStatus.push(depStatus);
            }
        }
    }
    return { filteredStatus, filteredDeprecation };
}
/**
 * Returns true if the candidate Status is more recent than the current Status, otherwise false.
 *
 *    - If the candidate Status has no 'since' semver metadata, return true
 *      (i.e., assume last deprecation status without 'since' semver is more recent)
 *    - Otherwise if the current Status has no 'since' semver metadata, return false
 *      (i.e., prior deprecation status without 'since' semver takes precedence)
 *    - Otherwise compare the two 'since' semver values
 */
function isMoreRecentDeprecation(candidate, current) {
    if (candidate.since == undefined) {
        return true;
    }
    else if (current.since == undefined) {
        return false;
    }
    else {
        /* NOTES:
            - If any of the major/minor/patch sections of either Status value's
              'since' semver is invalid, then Number.parseInt() will return a Nan value.
            - Per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN,
              all comparison operations involving a Nan value (like '==' or '>') always
              return false.
            - The JET Component Metadata JSON schema verifies that Status 'since'
              metadata values are valid semver strings, making it unlikely that we
              will encounter NaN values in practice.
            - Finally, if either the 'since' semver value is malformed, then this will
              simply cause the function to return false. This seems acceptable, and
              preferable to complicating the logic with NaN checks.
        */
        let [candidateMajor, candidateMinor, candidatePatch] = candidate.since
            .split('.', 3)
            .map((str) => Number.parseInt(str));
        let [currentMajor, currentMinor, currentPatch] = current.since
            .split('.', 3)
            .map((str) => Number.parseInt(str));
        return (candidateMajor > currentMajor ||
            (candidateMajor == currentMajor &&
                (candidateMinor > currentMinor ||
                    (candidateMinor == currentMinor && candidatePatch > currentPatch))));
    }
}
function getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj) {
    const declaration = propDeclaration;
    const dt = MetaUtils.getDtMetadata(declaration, MetaTypes.MDContext.SLOT, null, metaUtilObj);
    const slotDataNode = getSlotDataNode(slotTypeInfo);
    if (slotDataNode) {
        const dataObj = getSlotData(slotDataNode, metaUtilObj);
        if (dataObj) {
            dt['data'] = dataObj;
            // check to see if we have an exported type alias (apidoc metadata)
            if (ts.isTypeReferenceNode(slotDataNode) &&
                TypeUtils.isLocalExport(slotDataNode, metaUtilObj)) {
                const typeDefName = (0, Utils_1.getTypeNameFromTypeReference)(slotDataNode);
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['typedef'] = typeDefName;
            }
        }
    }
    return dt;
}
/**
 * Returns the properties of the slot data.
 * @param slotDataNode
 */
function getSlotData(slotDataNode, metaUtilObj) {
    let data = {};
    let detailName;
    if (ts.isTypeReferenceNode(slotDataNode)) {
        detailName = (0, Utils_1.getTypeNameFromTypeReference)(slotDataNode);
    }
    MetaUtils.walkTypeNodeMembers(slotDataNode, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
        const propSignature = symbol.valueDeclaration;
        // if the symbol is an interface (as opposed to a type alias), generics will be part of members
        if (!propSignature) {
            return;
        }
        if (ts.isPropertySignature(propSignature) || ts.isPropertyDeclaration(propSignature)) {
            const property = key.toString();
            const propertyPath = [property];
            const slotDataMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MDScope.DT, MetaTypes.MDContext.SLOT | MetaTypes.MDContext.SLOT_DATA, propertyPath, symbol, metaUtilObj);
            const propSym = mappedTypeSymbol ?? symbol;
            slotDataMetadata['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
            // assign top level metadata
            data = data || {};
            data[property] = slotDataMetadata;
            // now see if we have sub-properties
            // we use this stack to keep track of the top most level where we find
            // an object based array type. We will explode the properties of that
            // object as extension metadata in the component.json file
            let nestedArrayStack = [];
            if (slotDataMetadata.type === 'Array<object>') {
                nestedArrayStack.push(key);
            }
            const complexMD = TypeUtils.getComplexPropertyMetadata(symbol, slotDataMetadata, detailName, MetaTypes.MDScope.DT, MetaTypes.MDContext.SLOT | MetaTypes.MDContext.SLOT_DATA, propertyPath, nestedArrayStack, metaUtilObj);
            // process the returned complex property metadata
            TypeUtils.processComplexPropertyMetadata(property, slotDataMetadata, complexMD, data[property]);
        }
    });
    return data;
}
/**
 * Utility that validates dynamic slot metadata after all other metadata is processed:
 *
 *    - If the VComponent custom element supports dynamic slots, then there must be
 *      one or more other Properties with the corresponding dynamicSlotDef metadata.
 *    - We also need to see if there are any dynamic template slots that require
 *      additions to the list of template slots.
 *    - Also take the opportunity to do some final housekeeping on our VComponent's
 *      list of template slots before the list is packaged and passed on to the
 *      dtsTransformer.
 */
function validateDynamicSlots(metaUtilObj) {
    if (metaUtilObj.dynamicSlotsInfo.length > 0) {
        const allDynSlotDefs = {};
        const vcompProps = metaUtilObj.fullMetadata.properties;
        // Map each dynamicSlotDef to one or more property names
        if (vcompProps) {
            populateDynamicSlotDefsMapping(vcompProps, allDynSlotDefs);
        }
        // Now loop through dynamic slot items in order to:
        //  * validate that there is matching dynamicSlotDef metadata
        //  * determine if we need to add to the list of template slots
        //    to be passed to the dtsTransformer
        for (const item of metaUtilObj.dynamicSlotsInfo) {
            const dynSlotProps = allDynSlotDefs[item.key];
            if (dynSlotProps === undefined) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_DYNAMIC_SLOT_DEF, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `Dynamic slots were defined for this component, but no Property with a matching 'dynamicSlotDef' metadata value of "${item.key}" was found.`, item.node);
            }
            // Is this a dynamic template slot (i.e., key is not an empty string)?
            else if (item.key.length > 0) {
                // Process each property mapped to this dynamic template slot item
                for (const slotProp of dynSlotProps) {
                    // If any new preferredContent metadata available, apply it to the dynamicSlot
                    if (slotProp.preferredContent) {
                        const dynSlotMD = metaUtilObj.fullMetadata.dynamicSlots[item.key];
                        if (dynSlotMD) {
                            dynSlotMD.preferredContent ??= [];
                            for (const slotPref of slotProp.preferredContent) {
                                if (!dynSlotMD.preferredContent.includes(slotPref)) {
                                    dynSlotMD.preferredContent.push(slotPref);
                                }
                            }
                        }
                    }
                    // See if we already have a corresponding TemplateSlot entry
                    const slotRenderType = slotProp.templateSlotRenderType;
                    let templateSlotInfo = metaUtilObj.templateSlotProps?.find((info) => info?.slotRenderType === slotRenderType);
                    // if no existing TemplateSlot entry, add it now
                    if (templateSlotInfo === undefined ||
                        templateSlotInfo.slotTypeParamName !== item.slotTypeParamName) {
                        // NOTE:  DynamicTemplateSlot type parameters are always
                        //        simple type references (i.e., never Arrays/Tuples nor
                        //        MappedTypes)
                        templateSlotInfo = {
                            slotPropName: slotProp.propName,
                            slotContextType: slotProp.templateSlotContextType,
                            slotRenderType,
                            slotTypeParamName: item.slotTypeParamName,
                            slotDataTypeParamsDeclaration: item.slotDataTypeParamsDeclaration,
                            slotDataTypeParams: item.slotDataTypeParams,
                            slotDeprecation: item.deprecation
                        };
                        // Perform a final validation check, returning information for context
                        // alias declaration signatures before pushing
                        [
                            templateSlotInfo.slotContextTypeParams,
                            templateSlotInfo.slotRenderContextTypeParams,
                            templateSlotInfo.slotContextIndirectType
                        ] = getSlotContextDeclSignatures(item.node, templateSlotInfo, metaUtilObj);
                        metaUtilObj.templateSlotProps ??= [];
                        metaUtilObj.templateSlotProps.push(templateSlotInfo);
                    }
                    // otherwise check existing TemplateSlot entry's deprecation status
                    else if (templateSlotInfo.slotDeprecation != undefined) {
                        // if ANY matching dynamic template slot is NOT deprecated, then
                        // clear the entry's deprecation status
                        if (item.deprecation == undefined) {
                            delete templateSlotInfo.slotDeprecation;
                        }
                        // otherwise use the most recent deprecation status
                        else if (isMoreRecentDeprecation(item.deprecation, templateSlotInfo.slotDeprecation)) {
                            templateSlotInfo.slotDeprecation = item.deprecation;
                        }
                    }
                }
            }
        }
    }
    // Prune any cached MappedTypesInfo structures in our template slot list
    // before it is packaged and shipped over to the dtsTransformer
    if (metaUtilObj.templateSlotProps) {
        for (const slotProp of metaUtilObj.templateSlotProps) {
            if (slotProp.slotMappedTypesInfo) {
                delete slotProp.slotMappedTypesInfo;
            }
        }
    }
}
function populateDynamicSlotDefsMapping(properties, dynSlotDefs) {
    // Loop through ALL properties looking for dynamicSlotDef metadata,
    // which can be either
    //   1. an empty string for dynamic slots, or
    //   2. the type name used for a dynamic template slot.
    const allProps = Object.keys(properties);
    for (const prop of allProps) {
        const defValue = properties[prop].dynamicSlotDef;
        if (defValue !== undefined) {
            // If a dynamicSlotDef key is found, map it to the property name
            // along with its associated template slot type aliases and any
            // preferred content interfaces
            dynSlotDefs[defValue] ??= [];
            const propMD = properties[prop];
            const [contextType, renderType] = getTemplateSlotAliasTypes(propMD, prop);
            const dynSlotDefPropInfo = {
                propName: prop,
                templateSlotRenderType: renderType,
                templateSlotContextType: contextType
            };
            // Once we've mapped any preferred content interfaces, delete it from the
            // property metadata - we only put it there so that we could ultimately
            // transfer it to the correct dynamicSlots metadata instance
            if (Array.isArray(propMD['preferredContent'])) {
                dynSlotDefPropInfo.preferredContent = [...propMD['preferredContent']];
                delete propMD['preferredContent'];
            }
            dynSlotDefs[defValue].push(dynSlotDefPropInfo);
        }
        // Otherwise look for sub-properties and recursively check
        // for dynamicSlotDef metadata
        else if (properties[prop].properties) {
            populateDynamicSlotDefsMapping(properties[prop].properties, dynSlotDefs);
        }
        // Otherwise look for Array<object> properties and recursively check
        // for dynamicSlotDef metadata
        else if (properties[prop].extension?.['vbdt']?.['itemProperties']) {
            populateDynamicSlotDefsMapping(properties[prop].extension['vbdt']['itemProperties'], dynSlotDefs);
        }
        // Also look for sub-properties within keyedProperties structures
        // (i.e., Records, Maps, Sets, index signatures)
        // NOTE:  'keyedProperties' may be found at this level if extension metadata
        //        was established at higher levels
        let keyedProps = properties[prop].extension?.['vbdt']?.['keyedProperties'] ??
            properties[prop]['keyedProperties'];
        while (keyedProps) {
            if (keyedProps.values?.properties) {
                populateDynamicSlotDefsMapping(keyedProps.values.properties, dynSlotDefs);
                break;
            }
            else if (keyedProps.values?.keyedProperties) {
                keyedProps = keyedProps.values.keyedProperties;
            }
            else {
                break;
            }
        }
    }
}
function checkDefaultSlotType(propName, typeName, propDecl, exportToAlias, metaUtilObj) {
    if (propName === MetaTypes.DEFAULT_SLOT_PROP &&
        typeName !== `${exportToAlias.ComponentChildren}`) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_DEFAULT_SLOT_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Unsupported type '${typeName}' for reserved default slot property name '${MetaTypes.DEFAULT_SLOT_PROP}'.`, propDecl.type ?? propDecl);
    }
    else if (typeName === `${exportToAlias.ComponentChildren}` &&
        propName !== MetaTypes.DEFAULT_SLOT_PROP) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.COMPONENT_CHILDREN_NOT_DEFAULT_SLOT, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'${typeName}' is reserved for default slot property name '${MetaTypes.DEFAULT_SLOT_PROP}'. Did you mean to declare this property as type '${MetaTypes.SLOT_TYPE}'?`, propDecl.type ?? propDecl);
    }
}
function getSlotTypeInfo(slotPropDeclaration, exportToAlias, metaUtilObj) {
    let rtnSlotTypeInfo;
    let hasImplicitBusyContext = false;
    let isSinglePossibleSlotType = true;
    const types = TypeUtils.getPropertyTypes(slotPropDeclaration);
    const typeNames = Object.keys(types);
    // A potential slot property definition will have at least one named type
    if (typeNames.length > 0) {
        let possibleSlotTypeName;
        // Loop through type names, filtering out & noting ImplicitBusyContext
        // while tracking whether the possibleSlotTypeName represents a single type
        for (const name of typeNames) {
            if (name === exportToAlias.ImplicitBusyContext) {
                hasImplicitBusyContext = true;
            }
            else if (possibleSlotTypeName === undefined) {
                possibleSlotTypeName = name;
            }
            else {
                // If multiple potential type names detected,
                // reconstruct as an "intersection" type name
                isSinglePossibleSlotType = false;
                possibleSlotTypeName = `${possibleSlotTypeName} & ${name}`;
            }
        }
        if (possibleSlotTypeName) {
            rtnSlotTypeInfo = {
                typeName: possibleSlotTypeName,
                typeRefNode: (isSinglePossibleSlotType
                    ? types[possibleSlotTypeName]
                    : slotPropDeclaration.type),
                hasImplicitBusyContext
            };
        }
    }
    return rtnSlotTypeInfo;
}
function getSlotDataNode(slotTypeInfo) {
    let dataNode;
    const typeRefNode = slotTypeInfo.typeRefNode;
    if (typeRefNode.typeArguments?.length) {
        dataNode = typeRefNode.typeArguments[0];
    }
    return dataNode;
}
/**
 * Utility that initializes and returns information about
 * a TemplateSlot that the dtsTransformer uses to generate
 * corresponding render function signature & context
 * type alias definitions.
 *
 * @param slotName Name of the Slot property
 * @param slotDataNode TypeNode for the TemplateSlot 'data' type parameter
 * @param metaUtilObj Bag o'useful stuff
 * @returns TemplateSlotInfo
 */
function getTemplateSlotInfo(slotName, slotDataNode, metaUtilObj) {
    let templateSlotInfo = {
        slotPropName: slotName
    };
    let isDataArrayOrTuple = false;
    const checker = metaUtilObj.typeChecker;
    if (ts.isTypeReferenceNode(slotDataNode)) {
        let typeObject = checker.getTypeAtLocation(slotDataNode);
        const mappedTypesInfo = MetaUtils.getMappedTypesInfo(typeObject, checker, false, slotDataNode);
        // If the template slot type parameter reference is a MappedType, treat
        // its inner wrapped typeNode as the template slot type parameter
        if (mappedTypesInfo && mappedTypesInfo.wrappedTypeNode) {
            typeObject = checker.getTypeAtLocation(mappedTypesInfo.wrappedTypeNode); // reset
            const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(typeObject, mappedTypesInfo.wrappedTypeNode, metaUtilObj);
            if (genericsInfo) {
                templateSlotInfo.slotDataTypeParamsDeclaration = genericsInfo.genericsDeclaration;
                templateSlotInfo.slotDataTypeParams = genericsInfo.genericsTypeParams;
            }
            // Save off to flag as a MappedType
            templateSlotInfo.slotMappedTypesInfo = mappedTypesInfo;
            // If the wrapped typeNode is (still) a TypeReference, use it to get the
            // type parameter name; otherwise, we can just construct the (identical)
            // context alias and render function context declaration signatures now
            if (ts.isTypeReferenceNode(mappedTypesInfo.wrappedTypeNode)) {
                templateSlotInfo.slotTypeParamName = (0, Utils_1.getTypeNameFromTypeReference)(mappedTypesInfo.wrappedTypeNode);
            }
            else {
                templateSlotInfo.slotContextTypeParams = MetaUtils.constructMappedTypeName(mappedTypesInfo, genericsInfo?.genericsTypeParams);
                templateSlotInfo.slotRenderContextTypeParams = templateSlotInfo.slotContextTypeParams;
            }
        }
        // Otherwise, if NOT the MappedType use case, get the template slot
        // type parameter name directly from the reference
        else {
            templateSlotInfo.slotTypeParamName = (0, Utils_1.getTypeNameFromTypeReference)(slotDataNode);
        }
        const slotDataSymbol = typeObject.aliasSymbol ?? typeObject.symbol;
        const slotDataDecl = slotDataSymbol?.getDeclarations()?.[0];
        if (slotDataDecl &&
            (ts.isTypeAliasDeclaration(slotDataDecl) ||
                ts.isInterfaceDeclaration(slotDataDecl) ||
                ts.isClassDeclaration(slotDataDecl))) {
            if (slotDataDecl.name.getText() === 'Array') {
                isDataArrayOrTuple = true;
            }
            // NOTE:  If we already dealt with the MappedType use case, then
            //        any generics were already processed
            if (!templateSlotInfo.slotMappedTypesInfo) {
                const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(typeObject, slotDataNode, metaUtilObj);
                if (genericsInfo) {
                    templateSlotInfo.slotDataTypeParamsDeclaration = genericsInfo.genericsDeclaration;
                    templateSlotInfo.slotDataTypeParams = genericsInfo.genericsTypeParams;
                }
            }
        }
    }
    // Otherwise, the template slot type parameter is an inline literal
    //  - check if it's an array or tuple object
    else if (ts.isArrayTypeNode(slotDataNode) || ts.isTupleTypeNode(slotDataNode)) {
        isDataArrayOrTuple = true;
    }
    if (isDataArrayOrTuple) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_TEMPLATE_SLOT_DATA_OBJ, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `A TemplateSlot must specify an object type for its 'data' context - array and tuple types are not supported.`, slotDataNode);
        // NOTE:  Normally, if the template slot type parameter is an array or tuple
        //        then we throw an error & stop the build...unless that particular
        //        error has been disabled!
        //        For that edge case, make sure to clear the slotTypeParamName field,
        //        otherwise we end up treating 'Array' as a standard TypeReference
        //        (which it isn't...) when generating alias declaration signatures
        templateSlotInfo.slotTypeParamName = undefined;
    }
    return templateSlotInfo;
}
/**
 * Utility to get a template slot's context type alias name
 * and render function type alias name.
 */
function getTemplateSlotAliasTypes(md, slotProp) {
    let aliasRoot = slotProp;
    // Check the metadata for an override to the root used for generating
    // the alias names:
    //    - preferred option is to use 'templateSlotAlias'
    //    - otherwise if a deprecated 'templateSlotRenderType' value was
    //      supplied, see if it's a suitable candidate for providing a
    //      common root to use for the context type alias
    if (md !== undefined) {
        if (md.templateSlotAlias) {
            aliasRoot = md.templateSlotAlias;
        }
        else if (md.templateSlotRenderType &&
            md.templateSlotRenderType.length > 6 &&
            md.templateSlotRenderType.startsWith('Render')) {
            aliasRoot = md.templateSlotRenderType.substring(6);
        }
    }
    // Ensure that the root is in TitleCase
    aliasRoot = `${aliasRoot[0].toUpperCase()}${aliasRoot.substring(1)}`;
    // Use the deprecated 'templateSlotRenderType' value to override the default
    // render function signature type alias name IF AND ONLY IF 'templateSlotAlias'
    // is NOT available!
    return [
        `${aliasRoot}Context`,
        md && md.templateSlotRenderType && !md.templateSlotAlias
            ? md.templateSlotRenderType
            : `Render${aliasRoot}`
    ];
}
/**
 * Called before the final push of a TemplateSlotInfo structure, it peforms
 * some last minute validation of template slot type parameter references and
 * returns information about context alias declaration signatures, used by the
 * dtsTransformer for the VComponent element namespace.
 *
 * NOTES:
 *    - If the template slot type parameter is a MappedType reference, then
 *      there are two use cases to consider:
 *        1)  The inner wrapped type is an inline type literal, in which case
 *            we already generated the neccessary declaration signatures,
 *            so we just return them;
 *        2)  The inner wrapped type and the cached MappedTypesInfo instance
 *            is used to construct the final declaration signatures.
 *    - If the type parameter type reference matches the context alias name and we
 *      were to go ahead & generate the resulting context alias declaration in the
 *      VComponent element namespace ('type FooTemplateContext = FooTemplateContext;'),
 *      this would result in a circular reference error.  Therefore we check for this
 *      scenario and generate an alternate indirect context alias name to incorporate
 *      into the context declaration signature (i.e., the 1st tuple return item).
 *      This indirect context alias name is also passed back separately to the caller
 *      as an optional 3rd tuple return item.
 *        - If dtsTransformer detects one or more indirect context alias names
 *          in the templateSlotInfo array passed through the VComponent metadata,
 *          it will generate the necessary intermediate declared namespace required
 *          to support this level of indirection.
 *
 * @param dataNode typeNode of the template slot type parameter
 * @param templateSlotInfo the collected information about the template slot
 * @param metaUtilObj bag o'useful stuff
 * @returns tuple consisting of context alias decl; render function context decl; (optional) indirect context alias
 */
function getSlotContextDeclSignatures(dataNode, templateSlotInfo, metaUtilObj) {
    let contextDecl = undefined;
    let renderContextDecl = undefined;
    let contextIndirectType = undefined;
    if (templateSlotInfo.slotContextTypeParams) {
        // if already computed, just return it
        contextDecl = templateSlotInfo.slotContextTypeParams;
    }
    else {
        if (templateSlotInfo.slotTypeParamName &&
            templateSlotInfo.slotTypeParamName === templateSlotInfo.slotContextType) {
            // If the type parameter type reference matches the context type alias name,
            // specify an indirect alias in order to avoid a circular reference error
            contextIndirectType = `_${templateSlotInfo.slotContextType}`;
        }
        if (templateSlotInfo.slotMappedTypesInfo) {
            // if the template slot type parameter reference was a MappedType,
            // use the cached MappedTypesInfo instance, seeded with either the
            // indirect alias or the type parameter type reference, to construct
            // context signature declaration
            templateSlotInfo.slotMappedTypesInfo.wrappedTypeName = `${contextIndirectType ?? templateSlotInfo.slotTypeParamName}`;
            contextDecl = MetaUtils.constructMappedTypeName(templateSlotInfo.slotMappedTypesInfo, templateSlotInfo.slotDataTypeParams);
        }
        else if (templateSlotInfo.slotTypeParamName) {
            contextDecl = `${contextIndirectType ?? templateSlotInfo.slotTypeParamName}${templateSlotInfo.slotDataTypeParams ?? ''}`;
        }
    }
    if (templateSlotInfo.slotRenderContextTypeParams) {
        // if already computed, just return it
        renderContextDecl = templateSlotInfo.slotRenderContextTypeParams;
    }
    else if (templateSlotInfo.slotMappedTypesInfo && !contextIndirectType) {
        // IF the template slot type parameter reference was a MappedType
        //    AND there is no context alias already defined through an
        //    indirect wrapped inner type,
        // THEN use the cached MappedTypesInfo instance, seeded with the
        //    type parameter type reference, to construct the render function
        //    context signature declaration
        templateSlotInfo.slotMappedTypesInfo.wrappedTypeName = templateSlotInfo.slotTypeParamName;
        renderContextDecl = MetaUtils.constructMappedTypeName(templateSlotInfo.slotMappedTypesInfo, templateSlotInfo.slotDataTypeParams);
    }
    else if (templateSlotInfo.slotTypeParamName) {
        renderContextDecl = `${templateSlotInfo.slotTypeParamName}${templateSlotInfo.slotDataTypeParams ?? ''}`;
    }
    return [contextDecl, renderContextDecl, contextIndirectType];
}
//# sourceMappingURL=MetadataSlotUtils.js.map