import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface IndexerModel {
    getIndexableSections(): IndexerModel.Section[];
    getMissingSections(): IndexerModel.Section[];
    setSection(section: IndexerModel.Section): Promise<IndexerModel.Section>;
}
export namespace IndexerModel {
    // tslint:disable-next-line interface-over-type-literal
    type Section = string | {
        label: string;
    };
}
declare let IndexerModel: {
    prototype: IndexerModel;
    SECTION_OTHERS: {
        id: string;
        label: string;
    };
};
export interface ojIndexer extends baseComponent<ojIndexerSettableProperties> {
    data: IndexerModel;
    translations: {
        ariaDisabledLabel?: string;
        ariaInBetweenText?: string;
        ariaKeyboardInstructionText?: string;
        ariaOthersLabel?: string;
        ariaTouchInstructionText?: string;
        indexerCharacters?: string;
        indexerOthers?: string;
    };
    addEventListener<T extends keyof ojIndexerEventMap>(type: T, listener: (this: HTMLElement, ev: ojIndexerEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojIndexerSettableProperties>(property: T): ojIndexer[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojIndexerSettableProperties>(property: T, value: ojIndexerSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojIndexerSettableProperties>): void;
    setProperties(properties: ojIndexerSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojIndexer {
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged = JetElementCustomEvent<ojIndexer["data"]>;
}
export interface ojIndexerEventMap extends baseComponentEventMap<ojIndexerSettableProperties> {
    'dataChanged': JetElementCustomEvent<ojIndexer["data"]>;
}
export interface ojIndexerSettableProperties extends baseComponentSettableProperties {
    data: IndexerModel;
    translations: {
        ariaDisabledLabel?: string;
        ariaInBetweenText?: string;
        ariaKeyboardInstructionText?: string;
        ariaOthersLabel?: string;
        ariaTouchInstructionText?: string;
        indexerCharacters?: string;
        indexerOthers?: string;
    };
}
export interface ojIndexerSettablePropertiesLenient extends Partial<ojIndexerSettableProperties> {
    [key: string]: any;
}
export type IndexerElement = ojIndexer;
export namespace IndexerElement {
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged = JetElementCustomEvent<ojIndexer["data"]>;
}
export interface IndexerIntrinsicProps extends Partial<Readonly<ojIndexerSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondataChanged?: (value: ojIndexerEventMap['dataChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-indexer": IndexerIntrinsicProps;
        }
    }
}
