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
exports.isFunctionInfo = exports.isClassInfo = exports.VCompImportMaps = exports.IMAP = exports.VCompPack = exports.VCompType = exports.GTExtras = exports.MDScope = exports.MDContext = exports.DEPENDENCIES_TOKEN = exports.CONTENTS_TOKEN = exports.DEFAULT_SLOT_PROP = exports.SLOT_TYPE = void 0;
const ts = __importStar(require("typescript"));
exports.SLOT_TYPE = 'Slot';
exports.DEFAULT_SLOT_PROP = 'children';
exports.CONTENTS_TOKEN = '@contents@';
exports.DEPENDENCIES_TOKEN = '@dependencies@';
var MDContext;
(function (MDContext) {
    MDContext[MDContext["COMP"] = 1] = "COMP";
    MDContext[MDContext["PROP"] = 2] = "PROP";
    MDContext[MDContext["EVENT"] = 4] = "EVENT";
    MDContext[MDContext["SLOT"] = 8] = "SLOT";
    MDContext[MDContext["METHOD"] = 16] = "METHOD";
    MDContext[MDContext["TYPEDEF"] = 32] = "TYPEDEF";
    MDContext[MDContext["PROP_RO_WRITEBACK"] = 64] = "PROP_RO_WRITEBACK";
    MDContext[MDContext["EVENT_DETAIL"] = 128] = "EVENT_DETAIL";
    MDContext[MDContext["SLOT_DATA"] = 256] = "SLOT_DATA";
    MDContext[MDContext["METHOD_PARAM"] = 512] = "METHOD_PARAM";
    MDContext[MDContext["METHOD_RETURN"] = 1024] = "METHOD_RETURN";
    MDContext[MDContext["EXT_ITEMPROPS"] = 2048] = "EXT_ITEMPROPS";
})(MDContext || (exports.MDContext = MDContext = {}));
var MDScope;
(function (MDScope) {
    MDScope[MDScope["RT_EXTENDED"] = -1] = "RT_EXTENDED";
    MDScope[MDScope["RT"] = 0] = "RT";
    MDScope[MDScope["DT"] = 1] = "DT";
})(MDScope || (exports.MDScope = MDScope = {}));
var GTExtras;
(function (GTExtras) {
    GTExtras[GTExtras["PARAMS_ANY"] = 1] = "PARAMS_ANY";
    GTExtras[GTExtras["DECL_NODES"] = 2] = "DECL_NODES";
})(GTExtras || (exports.GTExtras = GTExtras = {}));
var VCompType;
(function (VCompType) {
    VCompType[VCompType["FUNCTION"] = 0] = "FUNCTION";
    VCompType[VCompType["CLASS"] = 1] = "CLASS";
})(VCompType || (exports.VCompType = VCompType = {}));
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
    get dependencyScope() {
        return this._packObject['dependencyScope'];
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
    isReferenceComponent() {
        return this._packObject['type'] === 'reference';
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
var IMAP;
(function (IMAP) {
    IMAP["exportToAlias"] = "exportToAlias";
    IMAP["aliasToExport"] = "aliasToExport";
})(IMAP || (exports.IMAP = IMAP = {}));
class VCompImportMaps {
    constructor() {
        this._EMPTY_MAP = {};
        this._sfMaps = new Map();
    }
    _getSfMap(context, initOnRequest = false) {
        while (!ts.isSourceFile(context)) {
            context = context.parent;
        }
        let sfMap = this._sfMaps.get(context.fileName);
        if (!sfMap && initOnRequest) {
            sfMap = {
                exportToAlias: {},
                aliasToExport: {}
            };
            this._sfMaps.set(context.fileName, sfMap);
        }
        return sfMap;
    }
    registerMapping(context, importName, aliasName) {
        const iMap = this._getSfMap(context, true);
        iMap.exportToAlias[importName] = aliasName;
        iMap.aliasToExport[aliasName] = importName;
    }
    getMap(type, context) {
        const iMap = this._getSfMap(context);
        return iMap?.[type] ?? this._EMPTY_MAP;
    }
    getComponentImportMaps(componentNode) {
        return this._getSfMap(componentNode);
    }
}
exports.VCompImportMaps = VCompImportMaps;
function isClassInfo(info) {
    return info.className !== undefined;
}
exports.isClassInfo = isClassInfo;
function isFunctionInfo(info) {
    return info.componentNode !== undefined;
}
exports.isFunctionInfo = isFunctionInfo;
//# sourceMappingURL=MetadataTypes.js.map