"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunctionInfo = exports.isClassInfo = exports.VCompPack = exports.VCompType = exports.MetadataScope = exports.MDFlags = exports.DEFAULT_SLOT_PROP = exports.READ_ONLY_PROPERTY_CHANGED = exports.PROPERTY_CHANGED = exports.CANCELABLE_ACTION = exports.ACTION = exports.CHILDREN_TYPE = exports.DYNAMIC_TEMPLATE_SLOT_TYPE = exports.DYNAMIC_SLOT_TYPE = exports.TEMPLATE_SLOT_TYPE = exports.SLOT_TYPE = void 0;
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
var MDFlags;
(function (MDFlags) {
    MDFlags[MDFlags["COMP"] = 1] = "COMP";
    MDFlags[MDFlags["PROP"] = 2] = "PROP";
    MDFlags[MDFlags["EVENT"] = 4] = "EVENT";
    MDFlags[MDFlags["SLOT"] = 8] = "SLOT";
    MDFlags[MDFlags["METHOD"] = 16] = "METHOD";
    MDFlags[MDFlags["PROP_RO_WRITEBACK"] = 32] = "PROP_RO_WRITEBACK";
    MDFlags[MDFlags["EVENT_DETAIL"] = 64] = "EVENT_DETAIL";
    MDFlags[MDFlags["SLOT_DATA"] = 128] = "SLOT_DATA";
    MDFlags[MDFlags["METHOD_PARAM"] = 256] = "METHOD_PARAM";
    MDFlags[MDFlags["METHOD_RETURN"] = 512] = "METHOD_RETURN";
    MDFlags[MDFlags["EXT_ITEMPROPS"] = 1024] = "EXT_ITEMPROPS";
})(MDFlags = exports.MDFlags || (exports.MDFlags = {}));
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
class VCompPack {
    constructor(packObj) {
        this._packObject = packObj;
    }
    get name() {
        return this._packObject['name'];
    }
    get version() {
        return this._packObject['version'];
    }
    get jetVersion() {
        return this._packObject['jetVersion'];
    }
    get license() {
        return this._packObject['license'];
    }
    isStandardPack() {
        return this._packObject['type'] === 'pack';
    }
    isMonoPack() {
        return this._packObject['type'] === 'mono-pack';
    }
    isJETPack() {
        return this.isMonoPack() || this.isStandardPack();
    }
    isVCompInPack(fullName) {
        let rtnFound = false;
        if (this.isMonoPack()) {
            const contents = this._packObject['contents'];
            if (contents) {
                const vcompName = fullName.startsWith(this.name)
                    ? fullName.substring(this.name.length + 1)
                    : fullName;
                rtnFound =
                    contents.findIndex((elem) => elem.name === vcompName && (!elem.type || elem.type === 'component')) >= 0;
            }
        }
        else if (this.isStandardPack()) {
            const dependencies = this._packObject['dependencies'];
            if (dependencies === '@dependencies@') {
                rtnFound = true;
            }
            else {
                for (const depName of Object.keys(dependencies)) {
                    if (depName === fullName) {
                        rtnFound = true;
                        break;
                    }
                }
            }
        }
        return rtnFound;
    }
}
exports.VCompPack = VCompPack;
function isClassInfo(info) {
    return info.className !== undefined;
}
exports.isClassInfo = isClassInfo;
function isFunctionInfo(info) {
    return info.componentNode !== undefined;
}
exports.isFunctionInfo = isFunctionInfo;
//# sourceMappingURL=MetadataTypes.js.map