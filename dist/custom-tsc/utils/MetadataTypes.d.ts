import * as Metadata from 'ojs/ojmetadata';
import * as ts from 'typescript';
export declare const SLOT_TYPE = "Slot";
export declare const DEFAULT_SLOT_PROP = "children";
export declare const CONTENTS_TOKEN = "@contents@";
export declare const DEPENDENCIES_TOKEN = "@dependencies@";
export declare enum MDFlags {
    COMP = 1,
    PROP = 2,
    EVENT = 4,
    SLOT = 8,
    METHOD = 16,
    PROP_RO_WRITEBACK = 32,
    EVENT_DETAIL = 64,
    SLOT_DATA = 128,
    METHOD_PARAM = 256,
    METHOD_RETURN = 512,
    EXT_ITEMPROPS = 1024
}
export type ImportAliases = {
    Component?: string;
    ComponentProps?: string;
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
export type RuntimeMetadata = {
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
export type EventDetailsMetadata = {
    [key: string]: ExtendedEventDetailsMetadata;
};
export type SlotDataMetadata = {
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
export type AllMetadataTypes = Metadata.ComponentMetadata | Metadata.ComponentMetadataProperties | Metadata.ComponentMetadataMethods | Metadata.ComponentMetadataEvents | Metadata.ComponentMetadataSlots;
export type ALL_TYPES = {
    type: string;
    reftype?: string;
    optional?: boolean;
    enumValues?: string[];
    isArrayOfObject?: boolean;
    isEnumValuesForDTOnly?: boolean;
};
export type NameValuePair = [string, any];
export type PropertyBindingMetadata = Record<string, Metadata.PropertyBinding>;
export type RegisteredMethodParam = Omit<Metadata.MethodParam, 'type'>;
export type RegisteredMethodsMetadata = Record<string, Omit<Metadata.ComponentMetadataMethods, 'params' | 'return'> & {
    params?: Array<RegisteredMethodParam>;
    apidocDescription?: string;
    apidocRtnDescription?: string;
}>;
export type RegisteredMetadata = {
    bindings?: PropertyBindingMetadata;
    methods?: RegisteredMethodsMetadata;
    contexts?: ts.Expression;
};
export type RegisteredMethodsInfo = {
    signaturesTypeNode: ts.TypeNode;
    metadata?: RegisteredMetadata['methods'];
    metadataNode?: ts.Node;
};
export type RegisteredOptions = {
    bindings?: RegisteredMetadata['bindings'];
    methodsInfo?: RegisteredMethodsInfo;
    contexts?: RegisteredMetadata['contexts'];
};
export declare enum MetadataScope {
    RT_EXTENDED = -1,
    RT = 0,
    DT = 1
}
export type CircularRefInfo = {
    circularType: string;
};
export type GenericsTypes = {
    genericsDeclaration: string;
    genericsTypeParams: string;
    genericsTypeParamsArray: Array<string>;
    genericsTypeParamsAny?: string;
};
export type GenericsTypesFromType = Omit<GenericsTypes, 'genericsTypeParamsArray' | 'genericsTypeParamsAny'> & {
    genericsTypeParamData: Array<TypeParamInfo>;
};
export type TypeParamInfo = {
    name: string;
    isGeneric: boolean;
};
export type GenericTypeParametersInfo = {
    genericSignature: string;
    genericTypeParamsArray: Array<string>;
};
export type HasTypeParameters = ts.ClassLikeDeclarationBase | ts.InterfaceDeclaration | ts.TypeAliasDeclaration;
export type DefaultPropsElement = ts.ObjectLiteralElementLike | ts.BindingElement;
export type VCompFunctionalNode = ts.VariableStatement | ts.ExpressionStatement;
export declare enum VCompType {
    FUNCTION = 0,
    CLASS = 1
}
export type PropsInfo = {
    propsName: string;
    propsType: ts.Type;
    propsNode: ts.TypeNode;
    propsMappedTypes: Array<MappedTypeItem>;
    propsExtendGlobalPropsRef: ts.TypeReferenceType | null;
    propsTypeParams?: string;
    propsTypeParamsArray?: Array<string>;
    propsGenericsDeclaration?: ts.Declaration;
    propsRtObservedGlobalPropsSet?: Set<string>;
};
export type MappedTypeItem = {
    name: string;
    params?: string;
};
export type MappedTypesInfo = {
    mappedTypes: Array<MappedTypeItem>;
    wrappedTypeName: string;
    wrappedTypeNode?: ts.TypeNode;
};
export type IntersectionTypeNodeInfo = {
    observedProps?: Array<string>;
    substituteTypeNode?: ts.TypeNode;
    propsName?: string;
};
export type VCompTranslationBundleInfo = {
    loaderImports: Array<string>;
    bundleMapExpression: ts.Expression;
};
export declare class VCompPack {
    private _packObject;
    constructor(packObj: Record<string, any>);
    get name(): string;
    get version(): string;
    get jetVersion(): string | undefined;
    get license(): string | undefined;
    get contents(): Array<typeof CONTENTS_TOKEN | Record<string, any>> | undefined;
    get dependencies(): typeof DEPENDENCIES_TOKEN | Record<string, string> | undefined;
    get translationBundle(): string | undefined;
    isStandardPack(): boolean;
    isMonoPack(): boolean;
    isJETPack(): boolean;
    isVCompInPack(fullName: string): boolean;
}
export type VCompClassInfo = {
    elementName: string;
    className: string;
    classNode: ts.ClassDeclaration;
    propsInfo: PropsInfo | null;
    additionalImports?: Array<string>;
    translationBundleMapExpression?: ts.Expression;
    consumedContextsExpression?: ts.Expression;
    packInfo?: VCompPack;
};
export type VCompFunctionInfo = {
    compRegisterCall: ts.CallExpression;
    elementName: string;
    componentNode: ts.HasJSDoc;
    propsInfo: PropsInfo | null;
    componentName?: string;
    functionName?: string;
    defaultProps?: ts.NodeArray<DefaultPropsElement>;
    propBindings?: PropertyBindingMetadata;
    methodsInfo?: RegisteredMethodsInfo;
    contextsExpression?: ts.Expression;
    useComponentPropsForSettableProperties?: boolean;
    additionalImports?: Array<string>;
    translationBundleMapExpression?: ts.Expression;
    packInfo?: VCompPack;
};
export type VCompInfo = VCompClassInfo | VCompFunctionInfo;
export declare function isClassInfo(info: VCompInfo): info is VCompClassInfo;
export declare function isFunctionInfo(info: VCompInfo): info is VCompFunctionInfo;
export type NameNodePair = {
    name: string;
    node: ts.Node;
};
export type WritebackPropInfo = {
    propName?: string;
    isReadOnly?: boolean;
};
export type SlotTypeInfo = {
    typeName: string;
    typeRefNode: ts.TypeReferenceNode;
    hasImplicitBusyContext?: boolean;
};
export type MetaUtilObj = {
    componentName: string;
    componentInfo: VCompInfo;
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
    propsTypeParamsArray?: Array<string>;
    propsClassTypeParamsArray?: Array<string>;
    classPropsAliasTypeArgs?: readonly ts.Type[];
    classConsumedBindingsDecorator?: ts.Decorator;
    classProvidedBindingsDecorator?: ts.Decorator;
    functionPropBindings?: PropertyBindingMetadata;
    followImports?: boolean;
    coreJetModuleMapping?: Map<string, ImportBindings>;
};
export type ImportBindings = {
    binding?: string;
    module?: string;
};
export type TypedefObj = {
    name?: string;
    jsdoc?: Record<string, string>;
    genericsDeclaration?: string;
    genericsTypeParams?: string;
    coreJetModule?: Record<string, string>;
};
