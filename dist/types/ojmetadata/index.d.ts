/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

// tslint:disable-next-line no-unnecessary-class
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadata = {
    dependencies?: {
        [key: string]: string;
    };
    description?: string;
    displayName?: string;
    dynamicSlots?: {
        [key: string]: ComponentMetadataSlots;
    };
    events?: {
        [key: string]: ComponentMetadataEvents;
    };
    extension?: object;
    help?: string;
    icon?: Icon;
    implements?: string[];
    jetVersion: string;
    license?: string;
    methods?: {
        [key: string]: ComponentMetadataMethods;
    };
    name: string;
    pack?: string;
    paths?: {
        cdn: Paths;
    };
    preferredParent?: PreferredParent[];
    properties?: {
        [key: string]: ComponentMetadataProperties;
    };
    propertyLayout?: PropertyLayoutGroup[];
    since?: string;
    slots?: {
        [key: string]: ComponentMetadataSlots;
    };
    status?: Status[];
    styleClasses?: StyleClassItem[] | StyleGroup[];
    styleVariables?: StyleVariable[];
    subcomponentType?: 'data' | 'patternImpl' | 'packPrivate';
    type?: 'composite' | 'core' | 'pack' | 'reference' | 'resource';
    version: string;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataEvents = {
    bubbles?: boolean;
    cancelable?: boolean;
    description?: string;
    detail?: {
        [key: string]: EventDetailItem;
    };
    displayName?: string;
    eventGroup?: string;
    extension?: object;
    help?: string;
    status?: Status[];
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataMethods = {
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    internalName?: string;
    params?: MethodParam[];
    return?: string;
    status?: Status[];
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataProperties = {
    binding?: PropertyBinding;
    description?: string;
    displayName?: string;
    dynamicSlotDef?: string;
    enumValues?: string[];
    eventGroup?: string;
    exclusiveMaximum?: number | string;
    exclusiveMinimum?: number | string;
    extension?: object;
    format?: string;
    help?: string;
    maximum?: number | string;
    minCapabilities?: MinCapabilities;
    minimum?: number | string;
    pattern?: string;
    placeholder?: string;
    properties?: {
        [key: string]: ComponentMetadataProperties;
    };
    propertyEditorValues?: {
        [key: string]: PropertyEditorValue;
    };
    propertyGroup?: string;
    readOnly?: boolean;
    required?: boolean;
    status?: Status[];
    templateSlotRenderType?: string;
    translatable?: boolean;
    type: string;
    units?: string;
    value?: any[] | object | boolean | number | null | string;
    visible?: boolean;
    writeback?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataSlots = {
    data?: {
        [key: string]: SlotDataVariable;
    };
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    implicitBusyContext?: boolean;
    maxItems?: number;
    minItems?: number;
    preferredContent?: string[];
    status?: Status[];
    templateSlotRenderType?: string;
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type EventDetailItem = {
    description?: string;
    eventGroup?: string;
    status?: Status[];
    type: string;
};
// tslint:disable-next-line interface-over-type-literal
export type FilterCapabilities = {
    nestedFilter: boolean;
    textFilter: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type Icon = {
    hoverIconPath?: string;
    iconPath?: string;
    selectedIconPath?: string;
};
// tslint:disable-next-line interface-over-type-literal
export type MethodParam = {
    description?: string;
    name: string;
    status?: Status[];
    type: string;
};
// tslint:disable-next-line interface-over-type-literal
export type MinCapabilities = {
    filter?: FilterCapabilities;
};
// tslint:disable-next-line interface-over-type-literal
export type Paths = {
    debug?: string;
    min?: string;
};
// tslint:disable-next-line interface-over-type-literal
export type PreferredParent = {
    extension?: object;
    isDirectParent?: boolean;
    parentInterface: string;
    status?: Status[];
};
// tslint:disable-next-line interface-over-type-literal
export type PropertyBinding = {
    consume?: {
        name: string;
    };
    provide?: ProvideProperty[];
};
// tslint:disable-next-line interface-over-type-literal
export type PropertyEditorValue = {
    description?: string;
    displayName?: string;
    icon?: Icon;
};
// tslint:disable-next-line interface-over-type-literal
export type PropertyLayoutGroup = {
    displayName?: string;
    items: Array<string | PropertyLayoutGroup>;
    propertyGroup: string;
};
// tslint:disable-next-line interface-over-type-literal
export type ProvideProperty = {
    default?: string | number | boolean | null;
    name: string;
    transform?: Record<string, string | number | boolean | null>;
};
// tslint:disable-next-line interface-over-type-literal
export type SlotDataVariable = {
    description?: string;
    status?: Status[];
    type: string;
};
// tslint:disable-next-line interface-over-type-literal
export type Status = {
    description?: string;
    since?: string;
    target?: 'propertyType' | 'propertyValue' | 'parameterType' | 'returnType';
    themes?: Array<('Alta' | 'Redwood' | 'Stable' | string)>;
    type?: 'antiPattern' | 'deprecated' | 'maintenance' | 'supersedes';
    value?: string[];
};
// tslint:disable-next-line interface-over-type-literal
export type StyleClass = {
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    kind: 'class';
    name: string;
    scope?: 'public' | 'protected';
    status?: Status[];
    styleSelector?: string;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleClassItem = StyleClass | StyleSet | StyleTemplate;
// tslint:disable-next-line interface-over-type-literal
export type StyleGroup = {
    description?: string;
    styleGroup?: string[];
};
// tslint:disable-next-line interface-over-type-literal
export type StyleSet = {
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    kind: 'set';
    name: string;
    scope?: 'public' | 'protected';
    status?: Status[];
    styleItems: Array<(StyleClass | StyleSet | StyleTemplate)>;
    styleRelation: 'exclusive' | 'inclusive';
};
// tslint:disable-next-line interface-over-type-literal
export type StyleTemplate = {
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    kind: 'template';
    name: string;
    scope?: 'public' | 'protected';
    status?: Status[];
    styleSelector?: string;
    tokens: Array<(StyleTemplateToken)>;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleTemplateToken = {
    description?: string;
    displayName?: string;
    name: string;
    styleRelation: 'exclusive' | 'inclusive';
    values: Array<(StyleTemplateTokenValue)>;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleTemplateTokenValue = {
    description?: string;
    displayName?: string;
    name: string;
    status?: Status[];
};
// tslint:disable-next-line interface-over-type-literal
export type StyleVariable = {
    description?: string;
    displayName?: string;
    extension?: object;
    formats?: Array<('color' | 'length' | 'number' | 'percentage' | 'rgb_values' | 'time')>;
    help?: string;
    keywords?: string[];
    name: string;
    status?: Status[];
};
