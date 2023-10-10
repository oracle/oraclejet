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
function generateSlotsMetadata(memberKey, slotPropDeclaration, metaUtilObj) {
    var _a, _b;
    let isSlot = false;
    const slotTypeInfo = getSlotTypeInfo(slotPropDeclaration, metaUtilObj);
    if (slotTypeInfo) {
        checkDefaultSlotType(memberKey, slotTypeInfo.typeName, slotPropDeclaration, metaUtilObj);
        isSlot = true;
        switch (slotTypeInfo.typeName) {
            case `${metaUtilObj.namedExportToAlias.ComponentChildren}`:
                updateSlotMetadata('', slotPropDeclaration, slotTypeInfo, false, false, metaUtilObj);
                break;
            case `${metaUtilObj.namedExportToAlias.TemplateSlot}`:
                updateSlotMetadata(memberKey, slotPropDeclaration, slotTypeInfo, true, false, metaUtilObj);
                break;
            case `${metaUtilObj.namedExportToAlias.Slot}`:
                updateSlotMetadata(memberKey, slotPropDeclaration, slotTypeInfo, false, false, metaUtilObj);
                break;
            case `${metaUtilObj.namedExportToAlias.DynamicTemplateSlots}`:
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
            case `${metaUtilObj.namedExportToAlias.DynamicSlots}`:
                if (metaUtilObj.dynamicSlotsInUse & _DYNAMIC_SLOT_DETECTED) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MULTIPLE_DYNAMIC_SLOTS, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Components cannot have multiple properties for dynamic slots. Only a single Property is allowed to specify support for dynamic slots.`, slotPropDeclaration);
                }
                metaUtilObj.dynamicSlotsInUse = metaUtilObj.dynamicSlotsInUse | _DYNAMIC_SLOT_DETECTED;
                if (metaUtilObj.dynamicSlotsInUse === _DYNAMIC_SLOT_INVALID_STATE) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_MIXED_DYNAMIC_SLOT_PROPS, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, _INVALID_MIXED_DYNAMIC_SLOT_PROPS_MSG, slotPropDeclaration);
                }
                if (slotTypeInfo.hasImplicitBusyContext) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, (_a = slotPropDeclaration.type) !== null && _a !== void 0 ? _a : slotPropDeclaration);
                }
                MetaUtils.updateRtExtensionMetadata('_DYNAMIC_SLOT', {
                    prop: memberKey,
                    isTemplate: 0
                }, metaUtilObj);
                metaUtilObj.fullMetadata.dynamicSlots = metaUtilObj.fullMetadata.dynamicSlots || {};
                metaUtilObj.dynamicSlotNameNodes.push({
                    name: '',
                    node: (_b = slotPropDeclaration.type) !== null && _b !== void 0 ? _b : slotPropDeclaration
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
    var _a, _b;
    if (!isDynamicSlot) {
        if (!metaUtilObj.rtMetadata.slots) {
            metaUtilObj.rtMetadata.slots = {};
            metaUtilObj.fullMetadata.slots = {};
        }
        if (isTemplateSlot && slotTypeInfo.hasImplicitBusyContext) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, (_a = propDeclaration.type) !== null && _a !== void 0 ? _a : propDeclaration);
        }
        metaUtilObj.rtMetadata.slots[slotName] = isTemplateSlot
            ? { data: {} }
            : slotTypeInfo.hasImplicitBusyContext
                ? { implicitBusyContext: true }
                : {};
        metaUtilObj.fullMetadata.slots[slotName] = Object.assign({}, getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj), slotTypeInfo.hasImplicitBusyContext && !isTemplateSlot ? { implicitBusyContext: true } : {});
    }
    else {
        if (slotTypeInfo.hasImplicitBusyContext) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_IMPLICITBUSYCONTEXT, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, _UNSUPPORTED_IMPLICIT_BUSY_CONTEXT_MSG, (_b = propDeclaration.type) !== null && _b !== void 0 ? _b : propDeclaration);
        }
        if (isTemplateSlot) {
            metaUtilObj.fullMetadata.dynamicSlots = metaUtilObj.fullMetadata.dynamicSlots || {};
            const typeRefNode = slotTypeInfo.typeRefNode;
            if (typeRefNode.typeArguments && typeRefNode.typeArguments.length) {
                const detailNode = typeRefNode.typeArguments[0];
                if (ts.isUnionTypeNode(detailNode)) {
                    const typeParamsArr = detailNode.types;
                    let k = 0;
                    typeParamsArr.forEach((detailData) => {
                        let dt = MetaUtils.getDtMetadata(propDeclaration, MetaTypes.MDFlags.SLOT, null, metaUtilObj);
                        const dataObj = getSlotData(detailData, metaUtilObj);
                        if (dataObj) {
                            dt['data'] = dataObj;
                        }
                        let key;
                        if (ts.isTypeReferenceNode(detailData)) {
                            key = TypeUtils.getTypeNameFromTypeReference(detailData);
                        }
                        else {
                            key = `dynamicTmplSlotKey${k++}`;
                        }
                        metaUtilObj.fullMetadata.dynamicSlots[key] = dt;
                        metaUtilObj.dynamicSlotNameNodes.push({
                            name: key,
                            node: detailData
                        });
                    });
                }
                else {
                    const key = ts.isTypeReferenceNode(detailNode)
                        ? TypeUtils.getTypeNameFromTypeReference(detailNode)
                        : detailNode.getText();
                    metaUtilObj.fullMetadata.dynamicSlots[key] = getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj);
                    metaUtilObj.dynamicSlotNameNodes.push({
                        name: key,
                        node: detailNode
                    });
                }
            }
        }
    }
}
function getDtMetadataForSlot(propDeclaration, slotTypeInfo, metaUtilObj) {
    const declaration = propDeclaration;
    const dt = MetaUtils.getDtMetadata(declaration, MetaTypes.MDFlags.SLOT, null, metaUtilObj);
    const typeRefNode = slotTypeInfo.typeRefNode;
    if (typeRefNode.typeArguments && typeRefNode.typeArguments.length) {
        const detailNode = typeRefNode.typeArguments[0];
        const dataObj = getSlotData(detailNode, metaUtilObj);
        if (dataObj) {
            dt['data'] = dataObj;
            if (ts.isTypeReferenceNode(detailNode) && TypeUtils.isLocalExport(detailNode, metaUtilObj)) {
                const typeDefName = TypeUtils.getTypeNameFromTypeReference(detailNode);
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['typedef'] = typeDefName;
            }
        }
    }
    return dt;
}
function getSlotData(detailNode, metaUtilObj) {
    let data = {};
    let detailName;
    if (ts.isTypeReferenceNode(detailNode)) {
        detailName = TypeUtils.getTypeNameFromTypeReference(detailNode);
    }
    MetaUtils.walkTypeNodeMembers(detailNode, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
        const propSignature = symbol.valueDeclaration;
        if (!propSignature) {
            return;
        }
        const symbolType = metaUtilObj.typeChecker.getTypeOfSymbolAtLocation(symbol, propSignature);
        if (ts.isPropertySignature(propSignature) || ts.isPropertyDeclaration(propSignature)) {
            const property = key.toString();
            const propertyPath = [property];
            const slotDataMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.SLOT | MetaTypes.MDFlags.SLOT_DATA, propertyPath, symbol, metaUtilObj);
            data = data || {};
            data[property] = slotDataMetadata;
            if (TypeUtils.possibleComplexProperty(symbolType, slotDataMetadata.type, MetaTypes.MetadataScope.DT)) {
                let nestedArrayStack = [];
                if (slotDataMetadata.type === 'Array<object>') {
                    nestedArrayStack.push(key);
                }
                const subprops = TypeUtils.getComplexPropertyMetadata(symbol, slotDataMetadata.type, detailName, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.SLOT | MetaTypes.MDFlags.SLOT_DATA, propertyPath, nestedArrayStack, metaUtilObj);
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
                    if (typeDef && typeDef.name) {
                        data[property]['jsdoc'] = data[property]['jsdoc'] || {};
                        data[property]['jsdoc']['typedef'] = typeDef;
                    }
                }
            }
        }
    });
    return data;
}
exports.getSlotData = getSlotData;
function validateDynamicSlots(metaUtilObj) {
    if (metaUtilObj.dynamicSlotNameNodes.length > 0) {
        const allDynSlotDefs = new Set();
        if (metaUtilObj.fullMetadata.properties) {
            const allPropsArr = Object.keys(metaUtilObj.fullMetadata.properties);
            for (let i = 0; i < allPropsArr.length; i++) {
                const propKey = allPropsArr[i];
                const defValue = metaUtilObj.fullMetadata.properties[propKey].dynamicSlotDef;
                if (defValue !== undefined) {
                    allDynSlotDefs.add(defValue);
                }
            }
        }
        for (let nameNode of metaUtilObj.dynamicSlotNameNodes) {
            if (!allDynSlotDefs.has(nameNode.name)) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_DYNAMIC_SLOT_DEF, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `Dynamic slots were defined for this component, but no Property with a matching 'dynamicSlotDef' metadata value of "${nameNode.name}" was found.`, nameNode.node);
            }
        }
    }
}
exports.validateDynamicSlots = validateDynamicSlots;
function checkDefaultSlotType(propName, typeName, propDecl, metaUtilObj) {
    var _a, _b;
    if (propName === MetaTypes.DEFAULT_SLOT_PROP &&
        typeName !== `${metaUtilObj.namedExportToAlias.ComponentChildren}`) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_DEFAULT_SLOT_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Unsupported type '${typeName}' for reserved default slot property name '${MetaTypes.DEFAULT_SLOT_PROP}'.`, (_a = propDecl.type) !== null && _a !== void 0 ? _a : propDecl);
    }
    else if (typeName === `${metaUtilObj.namedExportToAlias.ComponentChildren}` &&
        propName !== MetaTypes.DEFAULT_SLOT_PROP) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.COMPONENT_CHILDREN_NOT_DEFAULT_SLOT, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'${typeName}' is reserved for default slot property name '${MetaTypes.DEFAULT_SLOT_PROP}'. Did you mean to declare this property as type '${MetaTypes.SLOT_TYPE}'?`, (_b = propDecl.type) !== null && _b !== void 0 ? _b : propDecl);
    }
}
function getSlotTypeInfo(slotPropDeclaration, metaUtilObj) {
    let rtnSlotTypeInfo;
    let hasImplicitBusyContext = false;
    let isSinglePossibleSlotType = true;
    const types = TypeUtils.getPropertyTypes(slotPropDeclaration);
    const typeNames = Object.keys(types);
    if (typeNames.length > 0) {
        let possibleSlotTypeName;
        for (const name of typeNames) {
            if (name === metaUtilObj.namedExportToAlias.ImplicitBusyContext) {
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
//# sourceMappingURL=MetadataSlotUtils.js.map