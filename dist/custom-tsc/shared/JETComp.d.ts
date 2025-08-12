import * as Metadata from 'ojs/ojmetadata';
export declare enum ContentItemType {
    COMPONENT = "component",// default if unspecified
    RESOURCE = "resource",
    VDOM = "vdom",
    HOOK = "hook",
    UTIL = "util",
    VB_FRAGMENT = "vbcs-fragment",
    VB_PATTERN = "vbcs-pattern"
}
export type ContentItem = {
    name: string;
    defaultExport?: boolean;
    description?: string;
    displayName?: string;
    export?: string;
    main?: string;
    readme?: string;
    status?: Array<Metadata.Status>;
    type?: ContentItemType;
    metadata?: string;
};
/**
 * Class presenting information derived from JET Component metadata JSON.
 * Useful for looking up information about standard JET Packs, JET mono-packs,
 * JET Reference Components, etc.
 *
 * NOTE:  'jetVersion' is a required metadata property for mono-packs,
 *        but optional for standard JET Packs
 */
export declare class JETComp {
    private _compObject;
    constructor(packObj: Record<string, any>);
    private _normalizeCompName;
    private _isMatch;
    static DEPENDENCIES_TOKEN: "@dependencies@";
    get name(): string;
    get version(): string;
    get jetVersion(): string | undefined;
    get license(): string | undefined;
    get contents(): Array<ContentItem> | undefined;
    get dependencies(): typeof JETComp.DEPENDENCIES_TOKEN | Record<string, string> | undefined;
    get dependencyScope(): string | undefined;
    get translationBundle(): string | undefined;
    isStandardPack(): boolean;
    isMonoPack(): boolean;
    isReferenceComponent(): boolean;
    isJETPack(): boolean;
    isCompInPack(fullName: string, type?: ContentItemType): boolean;
    findContentInPack(fullName: string, type?: ContentItemType): ContentItem | undefined;
}
