// tslint:disable-next-line no-unnecessary-class
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
    dependencies?: object;
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    icon?: {
        iconPath?: string;
        selectedIconPath?: string;
        hoverIconPath?: string;
    };
    license?: string;
    pack?: string;
    propertyLayout?: Array<{
        propertyGroup: string;
        displayName: string;
        items: Array<(string | object)>;
    }>;
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
        [key: string]: any;
    };
    displayName?: string;
    eventGroup?: string;
    extension?: object;
    help?: string;
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataMethods = {
    internalName?: string;
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    params?: Array<{
        description?: string;
        name?: string;
        type?: string;
    }>;
    return?: string;
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataProperties = {
    enumValues?: string[];
    properties?: {
        [key: string]: ComponentMetadataProperties;
    };
    readOnly?: boolean;
    type?: string;
    value?: object;
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
        description: string;
        displayName: string;
        icon: {
            iconPath?: string;
            selectedIconPath?: string;
            hoverIconPath?: string;
        };
    };
    propertyGroup?: string;
    required?: boolean;
    translatable?: boolean;
    units?: string;
    visible?: boolean;
};
// tslint:disable-next-line interface-over-type-literal
export type ComponentMetadataSlots = {
    data?: {
        description?: string;
        type?: string;
    };
    description?: string;
    displayName?: string;
    extension?: object;
    help?: string;
    maxItems?: number;
    minItems?: number;
    visible?: boolean;
};
