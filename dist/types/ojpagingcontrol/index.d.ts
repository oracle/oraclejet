import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { PagingModel } from '../ojpagingmodel';
import NumberRangeValidator = require('../ojvalidator-numberrange');
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojPagingControl extends baseComponent<ojPagingControlSettableProperties> {
    data: PagingModel;
    loadMoreOptions: {
        maxCount: number;
    };
    mode: 'page' | 'loadMore';
    overflow: 'fit' | 'none';
    pageOptions: {
        layout?: [
            'auto' | 'all' | 'input' | 'rangeText' | 'pages' | 'nav'
        ];
        maxPageLinks?: number;
        orientation?: 'horizontal' | 'vertical';
        type?: 'numbers' | 'dots';
    };
    pageSize: number;
    translations: {
        fullMsgItem?: string;
        fullMsgItemApprox?: string;
        fullMsgItemAtLeast?: string;
        fullMsgItemRange?: string;
        fullMsgItemRangeApprox?: string;
        fullMsgItemRangeAtLeast?: string;
        labelAccNavFirstPage?: string;
        labelAccNavLastPage?: string;
        labelAccNavNextPage?: string;
        labelAccNavPage?: string;
        labelAccNavPreviousPage?: string;
        labelAccPageNumber?: string;
        labelAccPaging?: string;
        labelLoadMore?: string;
        labelLoadMoreMaxRows?: string;
        labelNavInputPage?: string;
        labelNavInputPageMax?: string;
        maxPageLinksInvalid?: string;
        msgItemNoTotal?: string;
        msgItemRangeCurrent?: string;
        msgItemRangeCurrentSingle?: string;
        msgItemRangeItems?: string;
        msgItemRangeNoTotal?: string;
        msgItemRangeOf?: string;
        msgItemRangeOfApprox?: string;
        msgItemRangeOfAtLeast?: string;
        pageInvalid?: string;
        tipNavFirstPage?: string;
        tipNavInputPage?: string;
        tipNavLastPage?: string;
        tipNavNextPage?: string;
        tipNavPageLink?: string;
        tipNavPreviousPage?: string;
    };
    addEventListener<T extends keyof ojPagingControlEventMap>(type: T, listener: (this: HTMLElement, ev: ojPagingControlEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojPagingControlSettableProperties>(property: T): ojPagingControl[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojPagingControlSettableProperties>(property: T, value: ojPagingControlSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojPagingControlSettableProperties>): void;
    setProperties(properties: ojPagingControlSettablePropertiesLenient): void;
    firstPage(): Promise<null>;
    lastPage(): Promise<null>;
    loadNext(): Promise<null>;
    nextPage(): Promise<null>;
    page(page: number): Promise<null>;
    previousPage(): Promise<null>;
    refresh(): void;
}
export namespace ojPagingControl {
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged = JetElementCustomEvent<ojPagingControl["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type loadMoreOptionsChanged = JetElementCustomEvent<ojPagingControl["loadMoreOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type modeChanged = JetElementCustomEvent<ojPagingControl["mode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overflowChanged = JetElementCustomEvent<ojPagingControl["overflow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pageOptionsChanged = JetElementCustomEvent<ojPagingControl["pageOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pageSizeChanged = JetElementCustomEvent<ojPagingControl["pageSize"]>;
}
export interface ojPagingControlEventMap extends baseComponentEventMap<ojPagingControlSettableProperties> {
    'dataChanged': JetElementCustomEvent<ojPagingControl["data"]>;
    'loadMoreOptionsChanged': JetElementCustomEvent<ojPagingControl["loadMoreOptions"]>;
    'modeChanged': JetElementCustomEvent<ojPagingControl["mode"]>;
    'overflowChanged': JetElementCustomEvent<ojPagingControl["overflow"]>;
    'pageOptionsChanged': JetElementCustomEvent<ojPagingControl["pageOptions"]>;
    'pageSizeChanged': JetElementCustomEvent<ojPagingControl["pageSize"]>;
}
export interface ojPagingControlSettableProperties extends baseComponentSettableProperties {
    data: PagingModel;
    loadMoreOptions: {
        maxCount: number;
    };
    mode: 'page' | 'loadMore';
    overflow: 'fit' | 'none';
    pageOptions: {
        layout?: [
            'auto' | 'all' | 'input' | 'rangeText' | 'pages' | 'nav'
        ];
        maxPageLinks?: number;
        orientation?: 'horizontal' | 'vertical';
        type?: 'numbers' | 'dots';
    };
    pageSize: number;
    translations: {
        fullMsgItem?: string;
        fullMsgItemApprox?: string;
        fullMsgItemAtLeast?: string;
        fullMsgItemRange?: string;
        fullMsgItemRangeApprox?: string;
        fullMsgItemRangeAtLeast?: string;
        labelAccNavFirstPage?: string;
        labelAccNavLastPage?: string;
        labelAccNavNextPage?: string;
        labelAccNavPage?: string;
        labelAccNavPreviousPage?: string;
        labelAccPageNumber?: string;
        labelAccPaging?: string;
        labelLoadMore?: string;
        labelLoadMoreMaxRows?: string;
        labelNavInputPage?: string;
        labelNavInputPageMax?: string;
        maxPageLinksInvalid?: string;
        msgItemNoTotal?: string;
        msgItemRangeCurrent?: string;
        msgItemRangeCurrentSingle?: string;
        msgItemRangeItems?: string;
        msgItemRangeNoTotal?: string;
        msgItemRangeOf?: string;
        msgItemRangeOfApprox?: string;
        msgItemRangeOfAtLeast?: string;
        pageInvalid?: string;
        tipNavFirstPage?: string;
        tipNavInputPage?: string;
        tipNavLastPage?: string;
        tipNavNextPage?: string;
        tipNavPageLink?: string;
        tipNavPreviousPage?: string;
    };
}
export interface ojPagingControlSettablePropertiesLenient extends Partial<ojPagingControlSettableProperties> {
    [key: string]: any;
}
export type PagingControlElement = ojPagingControl;
export namespace PagingControlElement {
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged = JetElementCustomEvent<ojPagingControl["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type loadMoreOptionsChanged = JetElementCustomEvent<ojPagingControl["loadMoreOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type modeChanged = JetElementCustomEvent<ojPagingControl["mode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overflowChanged = JetElementCustomEvent<ojPagingControl["overflow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pageOptionsChanged = JetElementCustomEvent<ojPagingControl["pageOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pageSizeChanged = JetElementCustomEvent<ojPagingControl["pageSize"]>;
}
export interface PagingControlIntrinsicProps extends Partial<Readonly<ojPagingControlSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondataChanged?: (value: ojPagingControlEventMap['dataChanged']) => void;
    onloadMoreOptionsChanged?: (value: ojPagingControlEventMap['loadMoreOptionsChanged']) => void;
    onmodeChanged?: (value: ojPagingControlEventMap['modeChanged']) => void;
    onoverflowChanged?: (value: ojPagingControlEventMap['overflowChanged']) => void;
    onpageOptionsChanged?: (value: ojPagingControlEventMap['pageOptionsChanged']) => void;
    onpageSizeChanged?: (value: ojPagingControlEventMap['pageSizeChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-paging-control": PagingControlIntrinsicProps;
        }
    }
}
