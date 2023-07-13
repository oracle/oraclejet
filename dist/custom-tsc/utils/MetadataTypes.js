"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunctionInfo = exports.isClassInfo = exports.VCompPack = exports.VCompType = exports.MetadataScope = exports.MDFlags = exports.DEPENDENCIES_TOKEN = exports.CONTENTS_TOKEN = exports.DEFAULT_SLOT_PROP = exports.SLOT_TYPE = void 0;
exports.SLOT_TYPE = 'Slot';
exports.DEFAULT_SLOT_PROP = 'children';
exports.CONTENTS_TOKEN = '@contents@';
exports.DEPENDENCIES_TOKEN = '@dependencies@';
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
    get contents() {
        return this._packObject['contents'];
    }
    get dependencies() {
        return this._packObject['dependencies'];
    }
    get translationBundle() {
        return this._packObject['translationBundle'];
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
            if (this.contents) {
                const vcompName = fullName.startsWith(this.name)
                    ? fullName.substring(this.name.length + 1)
                    : fullName;
                rtnFound =
                    this.contents.findIndex((elem) => elem === exports.CONTENTS_TOKEN ||
                        (elem.name === vcompName && (!elem.type || elem.type === 'component'))) >= 0;
            }
        }
        else if (this.isStandardPack()) {
            if (this.dependencies === exports.DEPENDENCIES_TOKEN) {
                rtnFound = true;
            }
            else {
                for (const depName of Object.keys(this.dependencies)) {
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