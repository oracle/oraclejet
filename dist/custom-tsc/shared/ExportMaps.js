"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportMaps = void 0;
/**
 * Utility class used to track the re-exported types (and its aliases) of a module.
 * It is used by the ApiDocUtils to identify TypeDefs that are backed by exported types of a given module.
 */
class ExportMaps {
    constructor() {
        this._collectedReexports = new Map();
    }
    storeExportsForModule(moduleName, exports) {
        this._collectedReexports.set(moduleName, exports);
    }
    getModuleTypeExports(moduleName) {
        return this._collectedReexports.get(moduleName);
    }
    getAllModuleTypeExports() {
        return this._collectedReexports;
    }
}
exports.ExportMaps = ExportMaps;
//# sourceMappingURL=ExportMaps.js.map