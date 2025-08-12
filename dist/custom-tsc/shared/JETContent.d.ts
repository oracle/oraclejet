import * as ts from 'typescript';
import * as Metadata from 'ojs/ojmetadata';
import { JETComp, ContentItem } from './JETComp';
import { type VdomProperties, type VdomParam, type VdomReturn } from './ContentMetadata';
type MetadataBasePickedProps = 'name' | 'version' | 'jetVersion' | 'pack' | 'description' | 'displayName' | 'license';
type JETBasePickedProps = MetadataBasePickedProps | 'export' | 'since' | 'status' | 'help' | 'icon' | 'extension';
type JETResourcePickedProps = JETBasePickedProps | 'dependencies' | 'paths';
type VdomBaseContent<T extends ContentType> = Pick<Metadata.ComponentMetadata, JETBasePickedProps> & {
    type: T;
    genericSignature?: string;
    main: string;
};
type VdomFunctionCommonProps = {
    params: Array<VdomParam>;
    return: VdomReturn;
};
export declare enum ContentType {
    COMPONENT = "composite",// default if unspecified
    VDOM = "vdom",
    HOOK = "hook",
    UTIL = "util",
    RESOURCE = "resource",
    VB_FRAGMENT = "vbcs-fragment",
    VB_PATTERN = "vbcs-pattern"
}
export type ComponentContent = Omit<Metadata.ComponentMetadata, 'type'> & {
    type?: ContentType.COMPONENT;
};
export type VdomContent = VdomBaseContent<ContentType.VDOM> & {
    properties?: VdomProperties;
};
export type HookContent = VdomBaseContent<ContentType.HOOK> & VdomFunctionCommonProps;
export type UtilContent = VdomBaseContent<ContentType.UTIL> & VdomFunctionCommonProps;
export type ResourceContent = Pick<Metadata.ComponentMetadata, JETResourcePickedProps> & {
    type: ContentType.RESOURCE;
    publicModules?: Array<string>;
};
export type VBFragmentContent = Pick<Metadata.ComponentMetadata, MetadataBasePickedProps> & {
    type: ContentType.VB_FRAGMENT;
};
export type VBPatternContent = Pick<Metadata.ComponentMetadata, MetadataBasePickedProps> & {
    type: ContentType.VB_PATTERN;
};
export type JETContent = ComponentContent | VdomContent | HookContent | UtilContent | ResourceContent | VBFragmentContent | VBPatternContent;
export declare function isComponentContent(content: JETContent): content is ComponentContent;
export declare function isVdomContent(content: JETContent): content is VdomContent;
export declare function isHookContent(content: JETContent): content is HookContent;
export declare function isUtilContent(content: JETContent): content is UtilContent;
export declare function isResourceContent(content: JETContent): content is ResourceContent;
export declare function isVBFragmentContent(content: JETContent): content is VBFragmentContent;
export declare function isVBPatternContent(content: JETContent): content is VBPatternContent;
export declare class JETContentFactory {
    private _checker;
    constructor(checker: ts.TypeChecker);
    private _generateGenericSignature;
    private _generateBaseContent;
    private _setBaseContentFromJSDoc;
    create(type: ContentType, name: string, exportName: string, main: string, monoPack: JETComp, contentItem: ContentItem, node: ts.Node, propsTypeNode?: ts.TypeNode): JETContent;
}
export {};
