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
exports.ImportMaps = exports.IMAP = void 0;
const ts = __importStar(require("typescript"));
var IMAP;
(function (IMAP) {
    IMAP["exportToAlias"] = "exportToAlias";
    IMAP["aliasToExport"] = "aliasToExport";
})(IMAP || (exports.IMAP = IMAP = {}));
/**
 * Utility class used to manage maps of key imported symbols and their
 * local aliases across the transpilation
 */
class ImportMaps {
    constructor() {
        this._EMPTY_MAP = {};
        this._sfMaps = new Map();
    }
    // Get the two-way import maps for the source file associated with the context node.
    // If it does not exist and initialization is requested, then create a new entry.
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
    _getSfMapFromType(type, initOnRequest = false) {
        const decls = type.aliasSymbol?.getDeclarations() ?? type.symbol?.getDeclarations();
        if (!decls || decls.length === 0)
            return;
        const context = decls[0]; // use the first declaration as context
        return this._getSfMap(context, initOnRequest);
    }
    isNode(value) {
        return typeof value === 'object' && value !== null && 'kind' in value;
    }
    // Given a context node along with a module specifier, an import from
    // that module, and its alias:
    //  - determine if the module and import are of interest;
    //  - if so, get the import maps for the associated source file;
    //  - register the two-way mapping.
    registerMapping(context, module, importName, aliasName) {
        if (ImportMaps._TRACKED_MODULES.has(module) && ImportMaps._TRACKED_IMPORTS.has(importName)) {
            const iMap = this._getSfMap(context, true);
            iMap.exportToAlias[importName] = aliasName;
            iMap.aliasToExport[aliasName] = importName;
        }
    }
    // Given a map type and a context node, get the import maps for the associated source file
    // and return the requested mapping.
    // If not found, return an empty map.
    getMap(type, context) {
        const iMap = this.isNode(context)
            ? this._getSfMap(context)
            : this._getSfMapFromType(context);
        return iMap?.[type] ?? this._EMPTY_MAP;
    }
    // Given a context node, return the two-way import maps for the associated source file.
    getComponentImportMaps(componentNode) {
        return this._getSfMap(componentNode);
    }
}
exports.ImportMaps = ImportMaps;
// defines the set of moduleSpecfiers that we care about
ImportMaps._TRACKED_MODULES = new Set([
    'ojs/ojvcomponent',
    'preact',
    'preact/compat',
    'ojs/ojvcomponent-binding'
]);
// defines the set of imports that we care about
ImportMaps._TRACKED_IMPORTS = new Set([
    'ComponentChildren',
    'Action',
    'CancelableAction',
    'Bubbles',
    'PropertyChanged',
    'ReadOnlyPropertyChanged',
    'Slot',
    'TemplateSlot',
    'DynamicSlots',
    'DynamicTemplateSlots',
    'ImplicitBusyContext',
    'Component',
    'ComponentProps',
    'PureComponent',
    'forwardRef',
    'memo',
    'customElement',
    'registerCustomElement',
    'method',
    'ElementReadOnly',
    'ExtendGlobalProps',
    'GlobalProps',
    'ObservedGlobalProps',
    'consumedContexts',
    'consumedBindings',
    'providedBindings'
]);
//# sourceMappingURL=ImportMaps.js.map