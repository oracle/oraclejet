import * as ts from 'typescript';
export declare enum IMAP {
    exportToAlias = "exportToAlias",
    aliasToExport = "aliasToExport"
}
type IMAP_UNION = keyof typeof IMAP;
/**
 * Utility class used to manage maps of key imported symbols and their
 * local aliases across the transpilation
 */
export declare class ImportMaps {
    static _TRACKED_MODULES: Set<string>;
    static _TRACKED_IMPORTS: Set<string>;
    private _EMPTY_MAP;
    private _sfMaps;
    constructor();
    private _getSfMap;
    private _getSfMapFromType;
    private isNode;
    registerMapping(context: ts.Node, module: string, importName: string, aliasName: string): void;
    getMap(type: IMAP, context: ts.Node): Record<string, string>;
    getMap(type: IMAP, context: ts.Type): Record<string, string>;
    getComponentImportMaps(componentNode: ts.Node): Record<IMAP_UNION, Record<string, string>>;
}
export {};
