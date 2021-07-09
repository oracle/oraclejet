"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.validateDynamicSlots = exports.checkDefaultSlotType = exports.getSlotData = exports.generateSlotsMetadata = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
function generateSlotsMetadata(memberKey, propDeclaration, typeName, metaUtilObj) {
    if (!typeName)
        return false;
    checkDefaultSlotType(memberKey, typeName, metaUtilObj);
    switch (typeName) {
        case `${metaUtilObj.namedExportToAlias.ComponentChildren}`:
            updateRtSlotMetadata("", propDeclaration, false, false, metaUtilObj);
            return true;
        case `${metaUtilObj.namedExportToAlias.TemplateSlot}`:
            updateRtSlotMetadata(memberKey, propDeclaration, true, false, metaUtilObj);
            return true;
        case `${metaUtilObj.namedExportToAlias.Slot}`:
            updateRtSlotMetadata(memberKey, propDeclaration, false, false, metaUtilObj);
            return true;
        case `${metaUtilObj.namedExportToAlias.DynamicTemplateSlots}`:
            metaUtilObj.dynamicSlotsInUse = metaUtilObj.dynamicSlotsInUse | 0b0010;
            if (metaUtilObj.dynamicSlotsInUse === 3) {
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `Components cannot have properties for both named and template dynamic slots. Only one dynamic slot property is allowed.`);
            }
            MetaUtils.updateRtExtensionMetadata("_DYNAMIC_SLOT", {
                prop: memberKey,
                isTemplate: 1,
            }, metaUtilObj);
            updateRtSlotMetadata(memberKey, propDeclaration, true, true, metaUtilObj);
            return true;
        case `${metaUtilObj.namedExportToAlias.DynamicSlots}`:
            metaUtilObj.dynamicSlotsInUse = metaUtilObj.dynamicSlotsInUse | 0b0001;
            if (metaUtilObj.dynamicSlotsInUse === 3) {
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `Components cannot have properties for both named and template dynamic slots. Only one dynamic slot property is allowed.`);
            }
            MetaUtils.updateRtExtensionMetadata("_DYNAMIC_SLOT", {
                prop: memberKey,
                isTemplate: 0,
            }, metaUtilObj);
            metaUtilObj.fullMetadata.dynamicSlots =
                metaUtilObj.fullMetadata.dynamicSlots || {};
            return true;
        default:
            return false;
    }
}
exports.generateSlotsMetadata = generateSlotsMetadata;
function updateRtSlotMetadata(slotName, propDeclaration, isTemplateSlot = false, isDynamicSlot = false, metaUtilObj) {
    if (!isDynamicSlot) {
        if (!metaUtilObj.rtMetadata.slots) {
            metaUtilObj.rtMetadata.slots = {};
            metaUtilObj.fullMetadata.slots = {};
        }
        metaUtilObj.rtMetadata.slots[slotName] = isTemplateSlot ? { data: {} } : {};
        metaUtilObj.fullMetadata.slots[slotName] = getDtMetadataForSlot(propDeclaration, metaUtilObj);
    }
    else {
        if (isTemplateSlot) {
            metaUtilObj.fullMetadata.dynamicSlots =
                metaUtilObj.fullMetadata.dynamicSlots || {};
            const typeRefNode = propDeclaration.type;
            if (typeRefNode.typeArguments && typeRefNode.typeArguments.length) {
                const detailNode = typeRefNode.typeArguments[0];
                if (ts.isUnionTypeNode(detailNode)) {
                    const typeParamsArr = detailNode.types;
                    let k = 0;
                    typeParamsArr.forEach((detailData) => {
                        let dt = MetaUtils.getDtMetadata(propDeclaration, metaUtilObj);
                        const dataObj = getSlotData(detailData, metaUtilObj);
                        if (dataObj) {
                            dt["data"] = dataObj;
                        }
                        let key;
                        if (ts.isTypeReferenceNode(detailData)) {
                            key = TypeUtils.getTypeNameFromTypeReference(detailData);
                        }
                        else {
                            key = `dynamicTmplSlotKey${k++}`;
                        }
                        metaUtilObj.fullMetadata.dynamicSlots[key] = dt;
                    });
                }
                else {
                    const key = ts.isTypeReferenceNode(detailNode)
                        ? TypeUtils.getTypeNameFromTypeReference(detailNode)
                        : detailNode.getText();
                    metaUtilObj.fullMetadata.dynamicSlots[key] = getDtMetadataForSlot(propDeclaration, metaUtilObj);
                }
            }
        }
    }
}
function getDtMetadataForSlot(propDeclaration, metaUtilObj) {
    const declaration = propDeclaration;
    const dt = MetaUtils.getDtMetadata(declaration, metaUtilObj);
    const typeRefNode = propDeclaration.type;
    if (typeRefNode.typeArguments && typeRefNode.typeArguments.length) {
        const detailNode = typeRefNode.typeArguments[0];
        const dataObj = getSlotData(detailNode, metaUtilObj);
        if (dataObj) {
            dt["data"] = dataObj;
        }
    }
    return dt;
}
function getSlotData(detailNode, metaUtilObj) {
    let data = {};
    const checker = metaUtilObj.typeChecker;
    let detailName;
    if (ts.isTypeReferenceNode(detailNode)) {
        detailName = TypeUtils.getTypeNameFromTypeReference(detailNode);
    }
    MetaUtils.walkTypeNodeMembers(detailNode, checker, (value, key) => {
        const propSignature = value.valueDeclaration;
        if (!propSignature) {
            return;
        }
        const symbolType = metaUtilObj.typeChecker.getTypeOfSymbolAtLocation(value, propSignature);
        if (ts.isPropertySignature(propSignature) ||
            ts.isPropertyDeclaration(propSignature)) {
            const property = key.toString();
            const slotDataMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MetadataScope.DT, metaUtilObj);
            data = data || {};
            data[property] = slotDataMetadata;
            if (TypeUtils.possibleComplexProperty(symbolType, slotDataMetadata.type, MetaTypes.MetadataScope.DT)) {
                let stack = [];
                if (slotDataMetadata.type === "Array<object>") {
                    stack.push(key);
                }
                const subprops = TypeUtils.getComplexPropertyMetadata(value, slotDataMetadata.type, detailName, MetaTypes.MetadataScope.DT, stack, metaUtilObj);
                if (subprops) {
                    if (subprops.circRefDetected) {
                        data[property].type = TypeUtils.getSubstituteTypeForCircularReference(slotDataMetadata);
                    }
                    else if (slotDataMetadata.type === "Array<object>") {
                        data[property].extension = {};
                        data[property].extension.vbdt = {};
                        data[property].extension.vbdt.itemProperties = subprops;
                    }
                    else {
                        data[property].type = "object";
                        data[property].properties = subprops;
                    }
                }
            }
            MetaUtils.pruneMetadata(data[property]);
        }
    });
    return data;
}
exports.getSlotData = getSlotData;
function checkDefaultSlotType(propName, typeName, metaUtilObj) {
    if (propName === MetaTypes.DEFAULT_SLOT_PROP &&
        typeName !== `${metaUtilObj.namedExportToAlias.ComponentChildren}`) {
        throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `Unsupported type '${typeName}' for reserved default slot property name '${MetaTypes.DEFAULT_SLOT_PROP}'.`);
    }
}
exports.checkDefaultSlotType = checkDefaultSlotType;
function validateDynamicSlots(metaUtilObj) {
    let found = false;
    let matchingKey = true;
    if (metaUtilObj.fullMetadata.dynamicSlots) {
        const keys = Object.keys(metaUtilObj.fullMetadata.dynamicSlots);
        if (metaUtilObj.fullMetadata.properties) {
            const allPropsArr = Object.keys(metaUtilObj.fullMetadata.properties);
            for (let i = 0; i < allPropsArr.length; i++) {
                let propKey = allPropsArr[i];
                let defValue = metaUtilObj.fullMetadata.properties[propKey].dynamicSlotDef;
                if (defValue !== undefined) {
                    found = true;
                    if (keys.length > 0) {
                        if (keys.indexOf(defValue) < 0) {
                            matchingKey = false;
                            break;
                        }
                    }
                }
            }
        }
        if (!found) {
            throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, 'Dynamic Slots were defined for this component but no "dynamicSlotDef" metadata was found.');
        }
        if (!matchingKey) {
            throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, 'Dynamic Slots were defined for this component but "dynamicSlotDef" metadata value does not match a key in "dynamicSlots" metadata.');
        }
    }
}
exports.validateDynamicSlots = validateDynamicSlots;
