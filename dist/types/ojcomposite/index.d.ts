import MetadataTypes = require('../ojmetadata');
export function getComponentMetadata(name: string): MetadataTypes.ComponentMetadata | null;
export function register<P extends PropertiesType = PropertiesType>(name: string, descriptor: {
    metadata: MetadataTypes.ComponentMetadata;
    view: string;
    viewModel?: {
        new (context: ViewModelContext<P>): ViewModel<P>;
    };
    parseFunction?: ((value: string, name: string, meta: MetadataTypes.ComponentMetadataProperties, defaultParseFunction?: (value: string) => any) => any);
}): void;
// tslint:disable-next-line interface-over-type-literal
export type PropertiesType = {
    [key: string]: any;
};
// tslint:disable-next-line interface-over-type-literal
export type PropertyChangedContext<P extends PropertiesType = PropertiesType> = {
    property: keyof P;
    value: P[keyof P];
    previousValue: P[keyof P];
    updatedFrom: 'external' | 'internal';
    subproperty?: {
        path: string;
        value: any;
        previousValue: any;
    };
};
// tslint:disable-next-line interface-over-type-literal
export type ViewModel<P extends PropertiesType = PropertiesType> = {
    activated?: ((context: ViewModelContext<P>) => Promise<any> | void);
    connected?: ((context: ViewModelContext<P>) => void);
    bindingsApplied?: ((context: ViewModelContext<P>) => void);
    propertyChanged?: ((context: PropertyChangedContext<P>) => void);
    disconnected?: ((element: Element) => void);
};
// tslint:disable-next-line interface-over-type-literal
export type ViewModelContext<P extends PropertiesType = PropertiesType> = {
    element: Element;
    properties: P;
    slotCounts: {
        [key: string]: number;
    };
    unique: string;
    uniqueId: string;
};
