import { ReexportedType } from '../exportTransformer';
/**
 * Utility class used to track the re-exported types (and its aliases) of a module.
 * It is used by the ApiDocUtils to identify TypeDefs that are backed by exported types of a given module.
 */
export declare class ExportMaps {
    private _collectedReexports;
    constructor();
    storeExportsForModule(moduleName: string, exports: ReexportedType[]): void;
    getModuleTypeExports(moduleName: string): ReexportedType[] | undefined;
    getAllModuleTypeExports(): Map<string, ReexportedType[]>;
}
