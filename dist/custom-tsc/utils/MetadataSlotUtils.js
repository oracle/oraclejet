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
exports.validateDynamicSlots = exports.getSlotData = exports.generateSlotsMetadata = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
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
    const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, slotPropDeclaration);
    const slotTypeInfo = getSlotTypeInfo(slotPropDeclaration, exportToAlias, metaUtilObj);
    if (slotTypeInfo) {
        checkDefaultSlotType(memberKey, slotTypeInfo.typeName, slotPropDeclaration, exportToAlias, metaUtilObj);
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
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, slotPropDeclaration.type ?? slotPropDeclaration);
                }
                MetaUtils.updateRtExtensionMetadata('_DYNAMIC_SLOT', {
                    prop: memberKey,
                    isTemplate: 0
                }, metaUtilObj);
                metaUtilObj.fullMetadata.dynamicSlots = metaUtilObj.fullMetadata.dynamicSlots || {};
                let slotDt = MetaUtils.getDtMetadata(slotPropDeclaration, MetaTypes.MDContext.SLOT, null, metaUtilObj);
                metaUtilObj.dynamicSlotsInfo.push({
                    key: '',
                    node: slotPropDeclaration.type ?? slotPropDeclaration,
                    metadata: slotDt
                });
                break;
            default:
                isSlot = false;
                break;
        }
    }
    return isSlot;
}
exports.generateSlotsMetadata = generateSlotsMetadata;
function updateSlotMetadata(slotName, propDeclaration, slotTypeInfo, isTemplateSlot, isDynamicSlot, metaUtilObj) {
    if (!isDynamicSlot) {
        let templateSlotInfo;
        if (!metaUtilObj.rtMetadata.slots) {
            metaUtilObj.rtMetadata.slots = {};
            metaUtilObj.fullMetadata.slots = {};
        }
        if (isTemplateSlot) {
            if (slotTypeInfo.hasImplicitBusyContext) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, propDeclaration.type ?? propDeclaration);
            }
            const slotDataNode = getSlotDataNode(slotTypeInfo);
            if (slotDataNode) {
                templateSlotInfo = getTemplateSlotInfo(slotName, slotDataNode, metaUtilObj);
            }
        }
        metaUtilObj.rtMetadata.slots[slotName] = isTemplateSlot
            ? { data: {} }
            : slotTypeInfo.hasImplicitBusyContext
                ? { implicitBusyContext: true }
                : {};
        metaUtilObj.fullMetadata.slots[slotName] = Object.assign({}, getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj), slotTypeInfo.hasImplicitBusyContext && !isTemplateSlot ? { implicitBusyContext: true } : {});
        if (templateSlotInfo) {
            templateSlotInfo.slotRenderType = getTemplateSlotRenderType(metaUtilObj.fullMetadata.slots[slotName], templateSlotInfo.slotPropName);
            const slotDeprecation = metaUtilObj.fullMetadata.slots[slotName].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
            if (slotDeprecation) {
                templateSlotInfo.slotDeprecation = slotDeprecation;
            }
            metaUtilObj.templateSlotProps ??= [];
            metaUtilObj.templateSlotProps.push(templateSlotInfo);
        }
    }
    else {
        if (slotTypeInfo.hasImplicitBusyContext) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, propDeclaration.type ?? propDeclaration);
        }
        if (isTemplateSlot) {
            metaUtilObj.fullMetadata.dynamicSlots ??= {};
            const slotDataNode = getSlotDataNode(slotTypeInfo);
            if (slotDataNode) {
                if (ts.isUnionTypeNode(slotDataNode)) {
                    const typeParamsArr = slotDataNode.types;
                    typeParamsArr.forEach((dataNode) => {
                        if (!ts.isTypeReferenceNode(dataNode) || MetaUtils.isMappedTypeReference(dataNode)) {
                            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, _INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM_MSG, dataNode);
                        }
                        const key = TypeUtils.getTypeNameFromTypeReference(dataNode);
                        const dynamicTemplateSlotInfo = getTemplateSlotInfo(slotName, dataNode, metaUtilObj);
                        let dt = MetaUtils.getDtMetadata(propDeclaration, MetaTypes.MDContext.SLOT, null, metaUtilObj);
                        const dataObj = getSlotData(dataNode, metaUtilObj);
                        if (dataObj) {
                            dt['data'] = dataObj;
                        }
                        let processedStatus;
                        if (dt.status) {
                            processedStatus = processDynamicTemplateSlotsStatus(key, dt.status);
                            if (processedStatus.filteredStatus.length > 0) {
                                dt.status = processedStatus.filteredStatus;
                            }
                            else {
                                delete dt.status;
                            }
                        }
                        metaUtilObj.fullMetadata.dynamicSlots[key] = dt;
                        let slotDataType = metaUtilObj.typeChecker.getTypeAtLocation(dataNode);
                        let slotDataTypeDecl = TypeUtils.getTypeDeclaration(slotDataType);
                        let typeDt;
                        if (slotDataTypeDecl) {
                            typeDt = MetaUtils.getDtMetadata(slotDataTypeDecl, MetaTypes.MDContext.TYPEDEF, null, metaUtilObj);
                        }
                        const dynamicSlotItem = {
                            key,
                            node: dataNode,
                            deprecation: processedStatus?.filteredDeprecation,
                            metadata: typeDt
                        };
                        if (dynamicTemplateSlotInfo) {
                            dynamicSlotItem.slotDataTypeParamsDeclaration =
                                dynamicTemplateSlotInfo.slotDataTypeParamsDeclaration;
                            dynamicSlotItem.slotDataNameTypeParams =
                                dynamicTemplateSlotInfo.slotDataNameTypeParams;
                        }
                        metaUtilObj.dynamicSlotsInfo.push(dynamicSlotItem);
                    });
                }
                else {
                    if (!ts.isTypeReferenceNode(slotDataNode) ||
                        MetaUtils.isMappedTypeReference(slotDataNode)) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, _INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM_MSG, slotDataNode);
                    }
                    const key = TypeUtils.getTypeNameFromTypeReference(slotDataNode);
                    const dynamicTemplateSlotInfo = getTemplateSlotInfo(slotName, slotDataNode, metaUtilObj);
                    let dt = getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj);
                    let processedStatus;
                    if (dt.status) {
                        processedStatus = processDynamicTemplateSlotsStatus(key, dt.status);
                        if (processedStatus.filteredStatus.length > 0) {
                            dt.status = processedStatus.filteredStatus;
                        }
                        else {
                            delete dt.status;
                        }
                    }
                    metaUtilObj.fullMetadata.dynamicSlots[key] = dt;
                    let slotDataType = metaUtilObj.typeChecker.getTypeAtLocation(slotDataNode);
                    let slotDataTypeDecl = TypeUtils.getTypeDeclaration(slotDataType);
                    let typeDt;
                    if (slotDataTypeDecl) {
                        typeDt = MetaUtils.getDtMetadata(slotDataTypeDecl, MetaTypes.MDContext.TYPEDEF, null, metaUtilObj);
                    }
                    const dynamicSlotItem = {
                        key,
                        node: slotDataNode,
                        deprecation: processedStatus?.filteredDeprecation,
                        metadata: typeDt
                    };
                    if (dynamicTemplateSlotInfo) {
                        dynamicSlotItem.slotDataTypeParamsDeclaration =
                            dynamicTemplateSlotInfo.slotDataTypeParamsDeclaration;
                        dynamicSlotItem.slotDataNameTypeParams = dynamicTemplateSlotInfo.slotDataNameTypeParams;
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
            filteredStatus.push({ ...status });
        }
        else if (status.type == undefined || status.type === 'deprecated') {
            let depStatus = { ...status };
            if (depStatus.target) {
                if (depStatus.target === 'propertyType' && depStatus.value?.indexOf(key) >= 0) {
                    delete depStatus.target;
                    delete depStatus.value;
                }
                else {
                    depStatus = undefined;
                }
            }
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
function isMoreRecentDeprecation(candidate, current) {
    if (candidate.since == undefined) {
        return true;
    }
    else if (current.since == undefined) {
        return false;
    }
    else {
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
            if (ts.isTypeReferenceNode(slotDataNode) &&
                TypeUtils.isLocalExport(slotDataNode, metaUtilObj)) {
                const typeDefName = TypeUtils.getTypeNameFromTypeReference(slotDataNode);
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['typedef'] = typeDefName;
            }
        }
    }
    return dt;
}
function getSlotData(slotDataNode, metaUtilObj) {
    let data = {};
    let detailName;
    if (ts.isTypeReferenceNode(slotDataNode)) {
        detailName = TypeUtils.getTypeNameFromTypeReference(slotDataNode);
    }
    MetaUtils.walkTypeNodeMembers(slotDataNode, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
        const propSignature = symbol.valueDeclaration;
        if (!propSignature) {
            return;
        }
        if (ts.isPropertySignature(propSignature) || ts.isPropertyDeclaration(propSignature)) {
            const property = key.toString();
            const propertyPath = [property];
            const slotDataMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MDScope.DT, MetaTypes.MDContext.SLOT | MetaTypes.MDContext.SLOT_DATA, propertyPath, symbol, metaUtilObj);
            const propSym = mappedTypeSymbol ?? symbol;
            slotDataMetadata['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
            data = data || {};
            data[property] = slotDataMetadata;
            let nestedArrayStack = [];
            if (slotDataMetadata.type === 'Array<object>') {
                nestedArrayStack.push(key);
            }
            const subprops = TypeUtils.getComplexPropertyMetadata(symbol, slotDataMetadata.type, detailName, MetaTypes.MDScope.DT, MetaTypes.MDContext.SLOT | MetaTypes.MDContext.SLOT_DATA, propertyPath, nestedArrayStack, metaUtilObj);
            if (subprops) {
                if (subprops.circRefDetected) {
                    data[property].type = TypeUtils.getSubstituteTypeForCircularReference(slotDataMetadata);
                }
                else if (slotDataMetadata.type === 'Array<object>') {
                    data[property].extension = {};
                    data[property].extension.vbdt = {};
                    data[property].extension.vbdt.itemProperties = subprops;
                }
                else {
                    data[property].type = 'object';
                    data[property].properties = subprops;
                }
                const typeDef = TypeUtils.getPossibleTypeDef(property, symbol, slotDataMetadata, metaUtilObj);
                if (typeDef && (typeDef.name || typeDef.coreJetModule)) {
                    data[property]['jsdoc'] = data[property]['jsdoc'] || {};
                    data[property]['jsdoc']['typedef'] = typeDef;
                }
            }
        }
    });
    return data;
}
exports.getSlotData = getSlotData;
function validateDynamicSlots(metaUtilObj) {
    if (metaUtilObj.dynamicSlotsInfo.length > 0) {
        const allDynSlotDefs = {};
        const vcompProps = metaUtilObj.fullMetadata.properties;
        if (vcompProps) {
            populateDynamicSlotDefsMapping(vcompProps, allDynSlotDefs);
        }
        for (const item of metaUtilObj.dynamicSlotsInfo) {
            const dynSlotProps = allDynSlotDefs[item.key];
            if (dynSlotProps === undefined) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_DYNAMIC_SLOT_DEF, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `Dynamic slots were defined for this component, but no Property with a matching 'dynamicSlotDef' metadata value of "${item.key}" was found.`, item.node);
            }
            else if (item.key.length > 0) {
                for (const slotProp of dynSlotProps) {
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
                    const slotRenderType = slotProp.templateSlotRenderType;
                    let templateSlotInfo = metaUtilObj.templateSlotProps?.find((info) => info?.slotRenderType === slotRenderType);
                    if (templateSlotInfo === undefined ||
                        templateSlotInfo.slotDataNameTypeParams !== item.slotDataNameTypeParams) {
                        templateSlotInfo = {
                            slotPropName: slotProp.propName,
                            slotRenderType,
                            slotDataTypeParamsDeclaration: item.slotDataTypeParamsDeclaration,
                            slotDataNameTypeParams: item.slotDataNameTypeParams,
                            slotDeprecation: item.deprecation
                        };
                        metaUtilObj.templateSlotProps ??= [];
                        metaUtilObj.templateSlotProps.push(templateSlotInfo);
                    }
                    else if (templateSlotInfo.slotDeprecation != undefined) {
                        if (item.deprecation == undefined) {
                            delete templateSlotInfo.slotDeprecation;
                        }
                        else if (isMoreRecentDeprecation(item.deprecation, templateSlotInfo.slotDeprecation)) {
                            templateSlotInfo.slotDeprecation = item.deprecation;
                        }
                    }
                }
            }
        }
    }
}
exports.validateDynamicSlots = validateDynamicSlots;
function populateDynamicSlotDefsMapping(properties, dynSlotDefs) {
    const allProps = Object.keys(properties);
    for (const prop of allProps) {
        const defValue = properties[prop].dynamicSlotDef;
        if (defValue !== undefined) {
            dynSlotDefs[defValue] ??= [];
            const propMD = properties[prop];
            const dynSlotDefPropInfo = {
                propName: prop,
                templateSlotRenderType: getTemplateSlotRenderType(propMD, prop)
            };
            if (Array.isArray(propMD['preferredContent'])) {
                dynSlotDefPropInfo.preferredContent = [...propMD['preferredContent']];
                delete propMD['preferredContent'];
            }
            dynSlotDefs[defValue].push(dynSlotDefPropInfo);
        }
        else if (properties[prop].properties) {
            populateDynamicSlotDefsMapping(properties[prop].properties, dynSlotDefs);
        }
        else if (properties[prop].extension?.['vbdt']?.['itemProperties']) {
            populateDynamicSlotDefsMapping(properties[prop].extension['vbdt']['itemProperties'], dynSlotDefs);
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
    if (typeNames.length > 0) {
        let possibleSlotTypeName;
        for (const name of typeNames) {
            if (name === exportToAlias.ImplicitBusyContext) {
                hasImplicitBusyContext = true;
            }
            else if (possibleSlotTypeName === undefined) {
                possibleSlotTypeName = name;
            }
            else {
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
function getTemplateSlotInfo(slotName, slotDataNode, metaUtilObj) {
    let templateSlotInfo = {
        slotPropName: slotName
    };
    const checker = metaUtilObj.typeChecker;
    if (ts.isTypeReferenceNode(slotDataNode)) {
        const typeObject = checker.getTypeAtLocation(slotDataNode);
        const mappedTypesInfo = MetaUtils.getMappedTypesInfo(typeObject, checker, false, slotDataNode);
        if (mappedTypesInfo && mappedTypesInfo.wrappedTypeNode) {
            const innerTypeObject = checker.getTypeAtLocation(mappedTypesInfo.wrappedTypeNode);
            const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(innerTypeObject, mappedTypesInfo.wrappedTypeNode, metaUtilObj);
            if (genericsInfo) {
                templateSlotInfo.slotDataTypeParamsDeclaration = genericsInfo.genericsDeclaration;
            }
            templateSlotInfo.slotDataNameTypeParams = MetaUtils.constructMappedTypeName(mappedTypesInfo, genericsInfo?.genericsTypeParams);
        }
        else {
            const declaration = typeObject.aliasSymbol?.getDeclarations()?.[0] ?? typeObject.symbol?.getDeclarations()?.[0];
            if (declaration &&
                (ts.isTypeAliasDeclaration(declaration) ||
                    ts.isInterfaceDeclaration(declaration) ||
                    ts.isClassDeclaration(declaration))) {
                const slotDataName = declaration.name.getText();
                const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(typeObject, slotDataNode, metaUtilObj);
                if (genericsInfo) {
                    templateSlotInfo.slotDataTypeParamsDeclaration = genericsInfo.genericsDeclaration;
                    templateSlotInfo.slotDataNameTypeParams = `${slotDataName}${genericsInfo.genericsTypeParams}`;
                }
                else {
                    templateSlotInfo.slotDataNameTypeParams = slotDataName;
                }
            }
        }
    }
    return templateSlotInfo;
}
function getTemplateSlotRenderType(md, slotProp) {
    return md?.templateSlotRenderType ?? `Render${slotProp[0].toUpperCase()}${slotProp.substring(1)}`;
}
//# sourceMappingURL=MetadataSlotUtils.js.map