import * as Metadata from 'ojs/ojmetadata';
import * as ts from 'typescript';
export declare const SLOT_TYPE: string;
export declare const TEMPLATE_SLOT_TYPE: string;
export declare const DYNAMIC_SLOT_TYPE: string;
export declare const DYNAMIC_TEMPLATE_SLOT_TYPE: string;
export declare const CHILDREN_TYPE: string;
export declare const ACTION: string;
export declare const CANCELABLE_ACTION: string;
export declare const PROPERTY_CHANGED: string;
export declare const READ_ONLY_PROPERTY_CHANGED: string;
export declare const DEFAULT_SLOT_PROP: string;
export declare const GETMD_FLAGS_NONE = 0;
export declare const GETMD_FLAGS_RO_WRITEBACK = 1;
export declare type ImportAliases = {
    Component?: string;
    PureComponent?: string;
    forwardRef?: string;
    memo?: string;
    customElement?: string;
    registerCustomElement?: string;
    method?: string;
    ElementReadOnly?: string;
    ExtendGlobalProps?: string;
    GlobalProps?: string;
    ObservedGlobalProps?: string;
    providedBindings?: string;
    consumedBindings?: string;
};
export declare type RuntimeMetadata = {
    properties?: Record<string, Metadata.ComponentMetadataProperties>;
    events?: Record<string, Metadata.ComponentMetadataEvents>;
    methods?: Record<string, Metadata.ComponentMetadataMethods>;
    slots?: Record<string, object>;
    extension?: {
        _DYNAMIC_SLOT?: Record<string, string | number>;
        _WRITEBACK_PROPS?: string[];
        _READ_ONLY_PROPS?: string[];
        _OBSERVED_GLOBAL_PROPS?: string[];
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
export declare enum MetadataScope {
    RT_EXTENDED = -1,
    RT = 0,
    DT = 1
}
export declare type CircularRefInfo = {
    circularType: string;
};
export declare type GenericsTypes = {
    genericsDeclaration: string;
    genericsTypeParams: string;
    genericsTypeParamsAny?: string;
};
export declare type HasTypeParameters = ts.ClassLikeDeclarationBase | ts.InterfaceDeclaration | ts.TypeAliasDeclaration;
export declare type DefaultPropsElement = ts.ObjectLiteralElementLike | ts.BindingElement;
export declare type VCompFunctionalNode = ts.VariableStatement | ts.ExpressionStatement;
export declare enum VCompType {
    FUNCTION = 0,
    CLASS = 1
}
export declare type PropsInfo = {
    propsName: string;
    propsType: ts.Type;
    propsNode: ts.TypeNode;
    propsMappedTypes: Array<MappedTypeItem>;
    propsExtendGlobalPropsRef: ts.TypeReferenceType | null;
    propsTypeParams?: string;
    propsGenericsDeclaration?: ts.Declaration;
    propsObservedGlobalProps?: Array<string>;
};
export declare type MappedTypeItem = {
    name: string;
    params?: string;
};
export declare type MappedTypesInfo = {
    mappedTypes: Array<MappedTypeItem>;
    wrappedTypeName: string;
    wrappedTypeNode?: ts.TypeNode;
};
export declare type IntersectionTypeNodeInfo = {
    observedProps?: Array<string>;
    substituteTypeNode?: ts.TypeNode;
    propsName?: string;
};
export declare type VCompClassInfo = {
    elementName: string;
    className: string;
    classNode: ts.ClassDeclaration;
    propsInfo: PropsInfo | null;
};
export declare type VCompFunctionInfo = {
    compRegisterCall: ts.CallExpression;
    elementName: string;
    componentNode: ts.HasJSDoc;
    propsInfo: PropsInfo | null;
    componentName?: string;
    functionName?: string;
    defaultProps?: ts.NodeArray<DefaultPropsElement>;
};
export declare type VCompInfo = VCompClassInfo | VCompFunctionInfo;
export declare function isClassInfo(info: VCompInfo): info is VCompClassInfo;
export declare function isFunctionInfo(info: VCompInfo): info is VCompFunctionInfo;
export declare type NameNodePair = {
    name: string;
    node: ts.Node;
};
export declare type WritebackPropInfo = {
    propName?: string;
    isReadOnly?: boolean;
};
export declare type MetaUtilObj = {
    componentName: string;
    typeChecker: ts.TypeChecker;
    rtMetadata: RuntimeMetadata;
    fullMetadata: Metadata.ComponentMetadata;
    namedExportToAlias: Record<string, string>;
    aliasToNamedExport: Record<string, string>;
    dynamicSlotsInUse: number;
    dynamicSlotNameNodes: Array<NameNodePair>;
    propsName?: string;
    reservedGlobalProps?: Set<string>;
    defaultProps?: Record<string, any>;
    excludedTypes?: Set<string>;
    excludedTypeAliases?: Set<string>;
    classPropsAliasTypeArgs?: readonly ts.Type[];
    classConsumedBindingsDecorator?: ts.Decorator;
    classProvidedBindingsDecorator?: ts.Decorator;
};
