"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = exports.KPType = exports.VCompType = exports.GTExtras = exports.MDScope = exports.MDContext = exports.DEFAULT_SLOT_PROP = exports.SLOT_TYPE = void 0;
exports.isClassInfo = isClassInfo;
exports.isFunctionInfo = isFunctionInfo;
exports.SLOT_TYPE = 'Slot';
exports.DEFAULT_SLOT_PROP = 'children';
// Context flags passed when getting metadata
var MDContext;
(function (MDContext) {
    // Basic context
    MDContext[MDContext["COMP"] = 1] = "COMP";
    MDContext[MDContext["PROP"] = 2] = "PROP";
    MDContext[MDContext["EVENT"] = 4] = "EVENT";
    MDContext[MDContext["SLOT"] = 8] = "SLOT";
    MDContext[MDContext["METHOD"] = 16] = "METHOD";
    MDContext[MDContext["TYPEDEF"] = 32] = "TYPEDEF";
    // Additional context that can be added to the basics
    MDContext[MDContext["PROP_RO_WRITEBACK"] = 64] = "PROP_RO_WRITEBACK";
    MDContext[MDContext["EVENT_DETAIL"] = 128] = "EVENT_DETAIL";
    MDContext[MDContext["SLOT_DATA"] = 256] = "SLOT_DATA";
    MDContext[MDContext["METHOD_PARAM"] = 512] = "METHOD_PARAM";
    MDContext[MDContext["METHOD_RETURN"] = 1024] = "METHOD_RETURN";
    MDContext[MDContext["EXTENSION_MD"] = 2048] = "EXTENSION_MD";
    MDContext[MDContext["KEYPROPS_KEYS"] = 4096] = "KEYPROPS_KEYS";
})(MDContext || (exports.MDContext = MDContext = {}));
/**
 * Enum used to qualify the scope of the metadata
 * returned by getAllMetadataForDeclaration
 */
var MDScope;
(function (MDScope) {
    MDScope[MDScope["RT_EXTENDED"] = -1] = "RT_EXTENDED";
    MDScope[MDScope["RT"] = 0] = "RT";
    MDScope[MDScope["DT"] = 1] = "DT"; // = 1
})(MDScope || (exports.MDScope = MDScope = {}));
var GTExtras;
(function (GTExtras) {
    // generate TypeParams signature substituting 'any'
    GTExtras[GTExtras["PARAMS_ANY"] = 1] = "PARAMS_ANY";
    // return NodeArray<TypeParameterDeclarations>
    GTExtras[GTExtras["DECL_NODES"] = 2] = "DECL_NODES";
})(GTExtras || (exports.GTExtras = GTExtras = {}));
/**
 * Enum used to specify whether PropsInfo is being collected for
 * a Class-based VComponent or a Function-based VComponent
 */
var VCompType;
(function (VCompType) {
    VCompType[VCompType["FUNCTION"] = 0] = "FUNCTION";
    VCompType[VCompType["CLASS"] = 1] = "CLASS"; // = 1
})(VCompType || (exports.VCompType = VCompType = {}));
// Identifies the Keyed Properties use case
var KPType;
(function (KPType) {
    KPType[KPType["NONE"] = 0] = "NONE";
    KPType[KPType["INDEXED"] = 1] = "INDEXED";
    KPType[KPType["MAP"] = 2] = "MAP";
    KPType[KPType["SET"] = 3] = "SET"; // = 3, Set type
})(KPType || (exports.KPType = KPType = {}));
function isClassInfo(info) {
    return info.className !== undefined;
}
function isFunctionInfo(info) {
    return info.componentNode !== undefined;
}
exports.Color = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',
    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',
    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m'
};
//# sourceMappingURL=MetadataTypes.js.map