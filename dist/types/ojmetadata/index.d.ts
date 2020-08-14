/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

// tslint:disable-next-line no-unnecessary-class
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadata = {
    name: string;
    version: string;
    jetVersion: string;
    properties?: {
        [key: string]: ComponentMetadataProperties;
    };
    methods?: {
        [key: string]: ComponentMetadataMethods;
    };
    events?: {
        [key: string]: ComponentMetadataEvents;
    };
    slots?: {
        [key: string]: ComponentMetadataSlots;
    };
    dependencies?: {
        [key: string]: string;
    };
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    icon?: Icon;
    license?: string;
    pack?: string;
    paths?: {
        cdn: Paths;
    };
    propertyLayout?: PropertyLayoutGroup[];
    status?: Status[];
    styleClasses?: StyleClassItem[] | StyleGroup[];
    type?: 'composite' | 'core' | 'pack' | 'reference' | 'resource';
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
    internalName?: string;
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    params?: MethodParam[];
    return?: string;
    status?: Status[];
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataProperties = {
    enumValues?: string[];
    properties?: {
        [key: string]: ComponentMetadataProperties;
    };
    readOnly?: boolean;
    type: string;
    value?: any[] | object | boolean | number | null | string;
    binding?: PropertyBinding;
    writeback?: boolean;
    description?: string;
    displayName?: string;
    eventGroup?: string;
    exclusiveMaximum?: number | string;
    exclusiveMinimum?: number | string;
    extension?: object;
    format?: string;
    help?: string;
    maximum?: number | string;
    minimum?: number | string;
    minCapabilities?: MinCapabilities;
    pattern?: string;
    placeholder?: string;
    propertyEditorValues?: {
        [key: string]: PropertyEditorValue;
    };
    propertyGroup?: string;
    required?: boolean;
    status?: Status[];
    translatable?: boolean;
    units?: string;
    visible?: boolean;
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
    maxItems?: number;
    minItems?: number;
    status?: Status[];
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type EventDetailItem = {
    description?: string;
    type: string;
    status?: Status[];
    eventGroup?: string;
};
// tslint:disable-next-line interface-over-type-literal
export type FilterCapabilities = {
    textFilter: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type Icon = {
    iconPath?: string;
    selectedIconPath?: string;
    hoverIconPath?: string;
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
    min?: string;
    debug?: string;
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
    propertyGroup: string;
    displayName?: string;
    items: Array<string | PropertyLayoutGroup>;
};
// tslint:disable-next-line interface-over-type-literal
export type ProvideProperty = {
    name: string;
    default?: string | number | boolean | null;
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
    type?: 'deprecated';
    since?: string;
    description?: string;
    target?: 'propertyType' | 'propertyValue' | 'parameterType' | 'returnType';
    value?: string[];
};
// tslint:disable-next-line interface-over-type-literal
export type StyleClass = {
    name: string;
    kind: 'class';
    displayName?: string;
    description?: string;
    extension?: object;
    help?: string;
    status?: Status[];
    styleSelector?: string;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleClassItem = StyleClass | StyleSet | StyleTemplate;
// tslint:disable-next-line interface-over-type-literal
export type StyleGroup = {
    styleGroup?: string[];
    description?: string;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleSet = {
    name: string;
    kind: 'set';
    displayName?: string;
    description?: string;
    extension?: object;
    help?: string;
    status?: Status[];
    styleRelation: 'exclusive' | 'inclusive';
    styleItems: Array<(StyleClass | StyleSet | StyleTemplate)>;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleTemplate = {
    name: string;
    kind: 'template';
    displayName?: string;
    description?: string;
    extension?: object;
    help?: string;
    status?: Status[];
    styleSelector?: string;
    tokens: Array<(StyleTemplateToken)>;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleTemplateToken = {
    name: string;
    displayName?: string;
    description?: string;
    styleRelation: 'exclusive' | 'inclusive';
    values: Array<(StyleTemplateTokenValue)>;
};
// tslint:disable-next-line interface-over-type-literal
export type StyleTemplateTokenValue = {
    name: string;
    displayName?: string;
    description?: string;
    status?: Status[];
};
