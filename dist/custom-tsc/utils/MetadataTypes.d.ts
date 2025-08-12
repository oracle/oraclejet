import * as Metadata from 'ojs/ojmetadata';
import * as ts from 'typescript';
import { type DefaultProps } from '../shared/DefaultProps';
import { ImportMaps } from '../shared/ImportMaps';
import { JETComp } from '../shared/JETComp';
import { type AllJsDocTypes } from './ApiDocTypes';
export declare const SLOT_TYPE = "Slot";
export declare const DEFAULT_SLOT_PROP = "children";
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
    EXTENSION_MD = 2048,
    KEYPROPS_KEYS = 4096
}
/**
 * Enum used to qualify the scope of the metadata
 * returned by getAllMetadataForDeclaration
 */
export declare enum MDScope {
    RT_EXTENDED = -1,
    RT = 0,// = 0
    DT = 1
}
/**
 * Since runtime metadata doesn't need name, version, or jetVersion which
 * are all required in the ComponentMetadata type, we need separate a type
 * to describe the runtime metadata.
 */
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
/**
 * Also need a separate type to describe method parameter DT metadata
 * that leaves out 'type' metadata (we will derive the parameter types
 * from the function signatures themselves)
 */
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
    rawType?: string;
    optional?: boolean;
    enumValues?: string[];
    enumNumericKeys?: number[];
    isArrayOfObject?: boolean;
    isEnumValuesForDTOnly?: boolean;
    isApiDocSignature?: boolean;
    typeDefs?: Array<TypedefObj>;
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
export type HasTypeParameters = ts.ClassLikeDeclarationBase | ts.InterfaceDeclaration | ts.SignatureDeclaration | ts.TypeAliasDeclaration;
/**
 * Top-level node for registering functional VComponent will either be
 * a VariableStatement (e.g., "const CustomElement = registerCustomElement(...);")
 * or an ExpressionStatement (e.g., "registerCustomElement(...);")
 */
export type VCompFunctionalNode = ts.VariableStatement | ts.ExpressionStatement;
/**
 * Enum used to specify whether PropsInfo is being collected for
 * a Class-based VComponent or a Function-based VComponent
 */
export declare enum VCompType {
    FUNCTION = 0,// = 0
    CLASS = 1
}
/**
 * Utility type used to collect all necessary information
 * required to process a custom element's Props metadata.
 */
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
/**
 * Utility type used to specify a mapped type wrapping the
 * declared Props type.  These are collected in an Array
 * for easy pushing/popping.
 */
export type MappedTypeItem = {
    name: string;
    params?: string;
};
/**
 * Utility type used to collect all necessary information
 * required to process a Props type that is wrapped by one or more
 * Utility (Mapped) types.
 */
export type MappedTypesInfo = {
    mappedTypes: Array<MappedTypeItem>;
    wrappedTypeName: string;
    wrappedTypeNode?: ts.TypeNode;
};
/**
 * Utility type defining metadata for advanced object Property use cases
 * where some or all of the object keys are non-statically determined
 * (e.g., Records, Maps, Sets, index signatures)
 */
export type KeyedPropsMetadata = {
    keys?: {
        type?: string;
        enumValues?: Array<string | number>;
    };
    values?: {
        type?: string;
        properties?: Record<string, Metadata.ComponentMetadataProperties>;
        keyedProperties?: KeyedPropsMetadata;
    };
};
export declare enum KPType {
    NONE = 0,// = 0, not Keyed Props
    INDEXED = 1,// = 1, index signature(s) or Record type
    MAP = 2,// = 2, Map type
    SET = 3
}
/**
 * Utility type used to return information used to generate KeyedPropsMetadata
 */
export type KeyedPropsTypeInfo = {
    type: KPType;
    keysTypeName?: string;
    keysRefType?: string;
    keysEnum?: Array<string | number>;
    valuesType?: ts.Type;
    valuesTypeName?: string;
};
/**
 * Utility type used to return information about complex Property metadata
 * (i.e., object properties with nested sub-properties and/or
 * non-statically determined object keys)
 */
export type ComplexPropertyMetadata = {
    circRefDetected?: {
        type: string;
    };
    properties?: Record<string, Metadata.ComponentMetadataProperties>;
    keyedProperties?: KeyedPropsMetadata;
};
/**
 * Utility type used to return information about sub-property metadata
 */
export type SubPropertyMetadata = {
    circularRefs?: Array<CircularRefInfo>;
    subpropsMD?: Record<string, Metadata.ComponentMetadataProperties>;
    keyedpropsMD?: KeyedPropsMetadata;
};
/**
 * Utility type used to return information gathered by walking complex Property ts.Type members
 */
export type SubPropertyMembersInfo = {
    processedMembers: number;
    indexSignatureMembers: number;
    metadata?: Record<string, Metadata.ComponentMetadataProperties>;
};
/**
 * Utility type used to collect all necessary information
 * required to correctly process a Props object's IntersectionType
 *
 *  - if observedProps is defined, then the ObservedGlobalProps
 *    utility type was detected in the IntersectionTypeNode, and so we return
 *    the list of observed GlobalProps for inclusion in the component's
 *    RT metadata
 *
 *  - If substituteTypeNode is defined, then it implies that
 *    an inline IntersectionTypeNode, after having filtered out
 *    any ObservedGlobalProps utility type, can be represented
 *    by a single TypeNode
 *    e.g., ExtendGlobalProps<foo & ObservedGlobalProps<"id">>
 *            ==> foo TypeNode
 *
 *  - if propsName is defined, then it implies that the Props object
 *    is indeed represented by an inline IntersectionTypeNode
 *    (even after accounting for any ObservedGlobalProps utility type),
 *    so we return the computed Props name used for generating the d.ts file
 *    e.g., ExtendGlobalProps<foo & bar & ObservedGlobalProps<"id">>
 *            ==> "(foo & bar)"
 */
export type IntersectionTypeNodeInfo = {
    observedProps?: Array<string>;
    substituteTypeNode?: ts.TypeNode;
    propsName?: string;
};
/**
 * Utility type used to collect all necessary information
 * required to process VComponent translation bundle injection
 */
export type VCompTranslationBundleInfo = {
    loaderImports: Array<string>;
    bundleMapExpression: ts.Expression;
};
/**
 * Utility type used to collect all necessary information
 * required to process a Class-based VComponent
 */
export type VCompClassInfo = {
    elementName: string;
    className: string;
    classNode: ts.ClassDeclaration;
    propsInfo: PropsInfo | null;
    additionalImports?: Array<string>;
    translationBundleMapExpression?: ts.Expression;
    consumedContextsExpression?: ts.Expression;
    packInfo?: JETComp;
};
/**
 * Utility type used to collect all necessary information
 * required to process a Function-based VComponent
 */
export type VCompFunctionInfo = {
    compRegisterCall: ts.CallExpression;
    elementName: string;
    componentNode: ts.HasJSDoc;
    typeParamsNode: HasTypeParameters;
    propsInfo: PropsInfo | null;
    componentName?: string;
    functionName?: string;
    defaultProps?: DefaultProps;
    propBindings?: PropertyBindingMetadata;
    methodsInfo?: RegisteredMethodsInfo;
    contextsExpression?: ts.Expression;
    useComponentPropsForSettableProperties?: boolean;
    additionalImports?: Array<string>;
    translationBundleMapExpression?: ts.Expression;
    packInfo?: JETComp;
};
/**
 * VCompInfo union type, plus utility functions that return corresponding type predicates
 */
export type VCompInfo = VCompClassInfo | VCompFunctionInfo;
export declare function isClassInfo(info: VCompInfo): info is VCompClassInfo;
export declare function isFunctionInfo(info: VCompInfo): info is VCompFunctionInfo;
/**
 * Utility type used to collect auxiliary information
 * for processing the type of a Function-based VComponent
 * that is cast with an AsExpression during registration
 */
export type VCompAsCastInfo = {
    typeNode: HasTypeParameters;
    propsNode?: ts.TypeReferenceNode;
    displayName?: string;
};
/**
 * Utility type used to collect Property names and their
 * corresponding Nodes.  The Nodes are used
 * by the TransformerError class to provide detailed
 * source file references.
 */
export type NameNodePair = {
    name: string;
    node: ts.Node;
};
/**
 * Utility type used to collect information about
 * a potential Writeback property
 */
export type WritebackPropInfo = {
    propName?: string;
    isReadOnly?: boolean;
};
/**
 * Utility type used to collect information about
 * a potential Slot property
 */
export type SlotTypeInfo = {
    typeName: string;
    typeRefNode: ts.TypeReferenceNode;
    hasImplicitBusyContext?: boolean;
};
/**
 * Utility type to pass TemplateSlot information to the
 * dtsTransformer for generating render function and
 * context alias signatures
 */
export type TemplateSlotInfo = {
    slotPropName: string;
    slotContextType?: string;
    slotRenderType?: string;
    slotTypeParamName?: string;
    slotDataTypeParamsDeclaration?: string;
    slotDataTypeParams?: string;
    slotContextTypeParams?: string;
    slotRenderContextTypeParams?: string;
    slotContextIndirectType?: string;
    slotMappedTypesInfo?: MappedTypesInfo;
    slotDeprecation?: Metadata.Status;
};
/**
 * Utility type to collect information about a property mapped to
 * a dynamic template slot through dynamicSlotDef metadata
 */
export type DynamicSlotDefPropInfo = {
    propName: string;
    templateSlotContextType: string;
    templateSlotRenderType: string;
    preferredContent?: Array<string>;
};
/**
 * Utility type to collect information about Dynamic Slots:
 * their key/node pairs, their deprecation status,
 * any associated DT metadata for API Doc, as well as
 * any generic declaration/type parameter signatures
 * for dynamic template slots
 */
export type DynamicSlotItem = {
    key: string;
    node: ts.Node;
    deprecation?: Metadata.Status;
    metadata?: AllMetadataTypes;
    slotTypeParamName?: string;
    slotDataTypeParamsDeclaration?: string;
    slotDataTypeParams?: string;
};
/**
 * Utility type for returning information about processed
 * DynamicTemplateSlots status, given a specific
 * 'dynamicSlots' key
 */
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
    progImportMaps: ImportMaps;
    dynamicSlotsInUse: number;
    dynamicSlotsInfo: Array<DynamicSlotItem>;
    excludedTypes: Set<string>;
    propsName?: string;
    reservedGlobalProps?: Set<string>;
    defaultPropToNode?: Record<string, ts.Node>;
    templateSlotProps?: Array<TemplateSlotInfo>;
    propsTypeParamsArray?: Array<string>;
    propsClassTypeParamsArray?: Array<string>;
    classTypeParamsNodes?: Array<ts.TypeParameterDeclaration>;
    classConsumedBindingsDecorator?: ts.Decorator;
    classProvidedBindingsDecorator?: ts.Decorator;
    functionPropBindings?: PropertyBindingMetadata;
    followImports?: boolean;
    debugMode?: boolean;
    coreJetModuleMapping?: Map<string, ImportBindings>;
    coreJetWebElementSet?: Set<string>;
    typeDefinitions?: Array<TypedefObj>;
    apidoc?: Array<AllJsDocTypes>;
};
export type ImportBindings = {
    binding?: string;
    module?: string;
    fileName?: string;
};
export type TypedefObj = {
    name?: string;
    properties?: Record<string, Metadata.ComponentMetadataProperties>;
    jsdoc?: Record<string, string>;
    genericsDeclaration?: string;
    genericsTypeParams?: string;
    coreJetModule?: Record<string, string>;
    typeReference?: ts.TypeReferenceNode;
    targetType?: string;
};
export declare const Color: {
    Reset: string;
    Bright: string;
    Dim: string;
    Underscore: string;
    Blink: string;
    Reverse: string;
    Hidden: string;
    FgBlack: string;
    FgRed: string;
    FgGreen: string;
    FgYellow: string;
    FgBlue: string;
    FgMagenta: string;
    FgCyan: string;
    FgWhite: string;
    BgBlack: string;
    BgRed: string;
    BgGreen: string;
    BgYellow: string;
    BgBlue: string;
    BgMagenta: string;
    BgCyan: string;
    BgWhite: string;
};
