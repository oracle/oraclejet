import * as Metadata from 'ojs/ojmetadata';
import * as ts from 'typescript';
export declare const SLOT_TYPE = "Slot";
export declare const DEFAULT_SLOT_PROP = "children";
export declare const CONTENTS_TOKEN = "@contents@";
export declare const DEPENDENCIES_TOKEN = "@dependencies@";
export declare enum MDContext {
    COMP = 1,
    PROP = 2,
    EVENT = 4,
    SLOT = 8,
    METHOD = 16,
    TYPEDEF = 32,
    PROP_RO_WRITEBACK = 64,
    EVENT_DETAIL = 128,
    SLOT_DATA = 256,
    METHOD_PARAM = 512,
    METHOD_RETURN = 1024,
    EXT_ITEMPROPS = 2048
}
export declare enum MDScope {
    RT_EXTENDED = -1,
    RT = 0,
    DT = 1
}
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
export type MethodParameterMetadata = Omit<Metadata.MethodParam, 'type'>;
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
    isApiDocSignature?: boolean;
};
export type MDValidationInfo = {
    baseType: 'string' | 'number' | 'boolean' | 'object' | 'string|number' | 'any';
    isArray: boolean;
    context: MDContext;
    schemaRelRef?: `#/${string}`;
};
export type TagTuple = [string, string];
export type MDTuple = [string, any, MDValidationInfo];
export type PropertyBindingMetadata = Record<string, Metadata.PropertyBinding>;
export type RegisteredMethodsMetadata = Record<string, Omit<Metadata.ComponentMetadataMethods, 'params' | 'return'> & {
    params?: Array<MethodParameterMetadata>;
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
export type CircularRefInfo = {
    circularType: string;
};
export declare enum GTExtras {
    PARAMS_ANY = 1,
    DECL_NODES = 2
}
export type GenericsTypes = {
    genericsDeclaration: string;
    genericsTypeParams: string;
    genericsTypeParamsArray: Array<string>;
    jsdoc: Array<TypedefObj>;
    genericsTypeParamsAny?: string;
    genericsTypeParamsNodes?: Array<ts.TypeParameterDeclaration>;
};
export type GenericsTypesFromType = Pick<GenericsTypes, 'genericsDeclaration' | 'genericsTypeParams'> & {
    resolvedGenericParams: string;
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
    get dependencyScope(): string | undefined;
    get translationBundle(): string | undefined;
    isStandardPack(): boolean;
    isMonoPack(): boolean;
    isReferenceComponent(): boolean;
    isJETPack(): boolean;
    isVCompInPack(fullName: string): boolean;
}
export declare enum IMAP {
    exportToAlias = "exportToAlias",
    aliasToExport = "aliasToExport"
}
type IMAP_UNION = keyof typeof IMAP;
export declare class VCompImportMaps {
    private _EMPTY_MAP;
    private _sfMaps;
    constructor();
    private _getSfMap;
    registerMapping(context: ts.Node, importName: string, aliasName: string): void;
    getMap(type: IMAP, context: ts.Node): Record<string, string>;
    getComponentImportMaps(componentNode: ts.Node): Record<IMAP_UNION, Record<string, string>>;
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
export type TemplateSlotInfo = {
    slotPropName: string;
    slotRenderType?: string;
    slotDataTypeParamsDeclaration?: string;
    slotDataNameTypeParams?: string;
    slotDeprecation?: Metadata.Status;
};
export type DynamicSlotDefPropInfo = {
    propName: string;
    templateSlotRenderType: string;
    preferredContent?: Array<string>;
};
export type DynamicSlotItem = {
    key: string;
    node: ts.Node;
    deprecation?: Metadata.Status;
    metadata?: AllMetadataTypes;
    slotDataTypeParamsDeclaration?: string;
    slotDataNameTypeParams?: string;
};
export type DynamicTemplateSlotsProcessedStatus = {
    filteredStatus: Metadata.Status[];
    filteredDeprecation: Metadata.Status | undefined;
};
export type MetaUtilObj = {
    componentName: string;
    componentInfo: VCompInfo;
    typeChecker: ts.TypeChecker;
    rtMetadata: RuntimeMetadata;
    fullMetadata: Metadata.ComponentMetadata;
    progImportMaps: VCompImportMaps;
    dynamicSlotsInUse: number;
    dynamicSlotsInfo: Array<DynamicSlotItem>;
    excludedTypes: Set<string>;
    propsName?: string;
    reservedGlobalProps?: Set<string>;
    defaultProps?: Record<string, ts.Node>;
    templateSlotProps?: Array<TemplateSlotInfo>;
    propsTypeParamsArray?: Array<string>;
    propsClassTypeParamsArray?: Array<string>;
    classTypeParamsNodes?: Array<ts.TypeParameterDeclaration>;
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
    properties?: Record<string, Metadata.ComponentMetadataProperties>;
};
export {};
