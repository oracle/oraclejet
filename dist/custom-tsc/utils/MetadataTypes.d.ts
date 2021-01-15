import * as Metadata from "ojs/ojmetadata";
import * as ts from "typescript";
export declare const SLOT_TYPE: string;
export declare const TEMPLATE_SLOT_TYPE: string;
export declare const DYNAMIC_SLOT_TYPE: string;
export declare const DYNAMIC_TEMPLATE_SLOT_TYPE: string;
export declare const CHILDREN_TYPE: string;
export declare const ACTION: string;
export declare const CANCELABLE_ACTION: string;
export declare const PROPERTY_CHANGED: string;
export declare const DEFAULT_SLOT_PROP: string;
export declare type DecoratorAliases = {
    ElementVComponent?: string;
    VComponent?: string;
    customElement?: string;
    dynamicDefault?: string;
    method?: string;
    rootProperty?: string;
    readOnly?: string;
    event?: string;
    provideBinding?: string;
    consumeBinding?: string;
};
export declare type RuntimeMetadata = {
    properties?: Record<string, Metadata.ComponentMetadataProperties>;
    events?: Record<string, Metadata.ComponentMetadataEvents>;
    methods?: Record<string, Metadata.ComponentMetadataMethods>;
    slots?: Record<string, object>;
    extension?: {
        _DEFAULTS?: string;
        _DYNAMIC_SLOT?: Record<string, string | number>;
        _ROOT_PROPS_MAP?: Record<string, number>;
        _WRITEBACK_PROPS?: string[];
        _READ_ONLY_PROPS?: string[];
    };
};
export declare type EventDetailsMetadata = {
    [key: string]: ExtendedEventDetailsMetadata;
};
export declare type SlotDataMetadata = {
    [key: string]: ExtendedSlotDataMetadata;
};
export interface ExtendedSlotDataMetadata extends Metadata.SlotDataVariable, ALL_TYPES {
    properties?: Record<string, ExtendedSlotDataMetadata>;
    extension?: Record<string, any>;
}
export interface ExtendedEventDetailsMetadata extends Metadata.EventDetailItem, ALL_TYPES {
    properties?: Record<string, ExtendedEventDetailsMetadata>;
    extension?: Record<string, any>;
}
export interface ExtendedPropertiesMetadata extends Metadata.ComponentMetadataProperties, ALL_TYPES {
}
export declare type AllMetadataTypes = Metadata.ComponentMetadata | Metadata.ComponentMetadataProperties | Metadata.ComponentMetadataMethods | Metadata.ComponentMetadataEvents | Metadata.ComponentMetadataSlots;
export declare type NameValuePair = [string, any];
export declare type ALL_TYPES = {
    type: string;
    reftype?: string;
    optional?: boolean;
    enumValues?: string[];
    isArrayOfObject?: boolean;
};
export declare type GenericsTypes = {
    genericsDeclaration: string;
    genericsTypeParams: string;
    genericsTypeParamsAny?: string;
};
export declare type HasTypeParameters = ts.ClassLikeDeclarationBase | ts.InterfaceDeclaration | ts.TypeAliasDeclaration;
export declare type MetaUtilObj = {
    componentClassName: string;
    typeChecker: ts.TypeChecker;
    rtMetadata: RuntimeMetadata;
    fullMetadata: Metadata.ComponentMetadata;
    namedExportToAlias: Record<string, string>;
    aliasToNamedExport: Record<string, string>;
    dynamicSlotsInUse: number;
};
