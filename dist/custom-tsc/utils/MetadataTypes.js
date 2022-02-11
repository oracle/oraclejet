"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunctionInfo = exports.isClassInfo = exports.VCompType = exports.MetadataScope = exports.GETMD_FLAGS_RO_WRITEBACK = exports.GETMD_FLAGS_NONE = exports.DEFAULT_SLOT_PROP = exports.READ_ONLY_PROPERTY_CHANGED = exports.PROPERTY_CHANGED = exports.CANCELABLE_ACTION = exports.ACTION = exports.CHILDREN_TYPE = exports.DYNAMIC_TEMPLATE_SLOT_TYPE = exports.DYNAMIC_SLOT_TYPE = exports.TEMPLATE_SLOT_TYPE = exports.SLOT_TYPE = void 0;
exports.SLOT_TYPE = 'Slot';
exports.TEMPLATE_SLOT_TYPE = 'TemplateSlot';
exports.DYNAMIC_SLOT_TYPE = 'DynamicSlots';
exports.DYNAMIC_TEMPLATE_SLOT_TYPE = 'DynamicTemplateSlots';
exports.CHILDREN_TYPE = 'Children';
exports.ACTION = 'Action';
exports.CANCELABLE_ACTION = 'CancelableAction';
exports.PROPERTY_CHANGED = 'PropertyChanged';
exports.READ_ONLY_PROPERTY_CHANGED = 'ReadOnlyPropertyChanged';
exports.DEFAULT_SLOT_PROP = 'children';
exports.GETMD_FLAGS_NONE = 0b0000;
exports.GETMD_FLAGS_RO_WRITEBACK = 0b0001;
var MetadataScope;
(function (MetadataScope) {
    MetadataScope[MetadataScope["RT_EXTENDED"] = -1] = "RT_EXTENDED";
    MetadataScope[MetadataScope["RT"] = 0] = "RT";
    MetadataScope[MetadataScope["DT"] = 1] = "DT";
})(MetadataScope = exports.MetadataScope || (exports.MetadataScope = {}));
var VCompType;
(function (VCompType) {
    VCompType[VCompType["FUNCTION"] = 0] = "FUNCTION";
    VCompType[VCompType["CLASS"] = 1] = "CLASS";
})(VCompType = exports.VCompType || (exports.VCompType = {}));
function isClassInfo(info) {
    return info.className !== undefined;
}
exports.isClassInfo = isClassInfo;
function isFunctionInfo(info) {
    return info.componentNode !== undefined;
}
exports.isFunctionInfo = isFunctionInfo;
//# sourceMappingURL=MetadataTypes.js.map