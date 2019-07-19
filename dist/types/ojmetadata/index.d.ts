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
    styleClasses?: Array<{
        styleGroup: string[];
        description: string;
    }>;
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
export type Paths = {
    min?: string;
    debug?: string;
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
    target?: 'propertyType' | 'parameterType' | 'returnType';
    value?: string[];
};
