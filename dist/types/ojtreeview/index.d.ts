/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ItemMetadata } from '../ojdataprovider';
import { KeySet } from '../ojkeyset';
import TreeDataProvider = require('../ojtreedataprovider');
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTreeView<K, D> extends baseComponent<ojTreeViewSettableProperties<K, D>> {
    readonly currentItem: K;
    data: TreeDataProvider<K, D>;
    dnd: {
        drag?: {
            items: {
                dataTypes?: string | string[];
                dragStart?: ((event: Event, context: {
                    items: D[];
                }) => void);
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
            };
        };
        drop?: {
            items: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragOver?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    item: Element;
                }) => void);
                drop: ((param0: Event, param1: ojTreeView.ItemsDropOnDropContext) => void);
            };
        };
    };
    expanded: KeySet<K>;
    item: {
        focusable?: ((itemContext: ojTreeView.ItemContext<K, D>) => boolean);
        renderer?: ((itemContext: ojTreeView.ItemContext<K, D>) => {
            insert: Element | string;
        } | void) | null;
        selectable?: ((itemContext: ojTreeView.ItemContext<K, D>) => boolean);
    };
    selected: KeySet<K>;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    addEventListener<T extends keyof ojTreeViewEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTreeViewEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTreeViewSettableProperties<K, D>>(property: T): ojTreeView<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTreeViewSettableProperties<K, D>>(property: T, value: ojTreeViewSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTreeViewSettableProperties<K, D>>): void;
    setProperties(properties: ojTreeViewSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): object | null;
}
export namespace ojTreeView {
    interface ojAnimateEnd extends CustomEvent<{
        action: 'expand' | 'collapse';
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: 'expand' | 'collapse';
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCollapse<K> extends CustomEvent<{
        key: K;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentItem<K> extends CustomEvent<{
        previousKey: K;
        previousItem: Element;
        key: K;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K> extends CustomEvent<{
        key: K;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K> extends CustomEvent<{
        key: K;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K> extends CustomEvent<{
        key: K;
        item: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["item"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectedChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["selected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K, D> = {
        componentElement: Element;
        data?: D;
        depth: number;
        index: number;
        key: K;
        leaf: boolean;
        parentElement: Element;
        parentKey?: K;
        metadata: ItemMetadata<K>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemsDropOnDropContext = {
        item: Element;
        position: 'inside' | 'before' | 'after' | 'first';
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
        depth: number;
        leaf: boolean;
        parentkey: any;
    };
}
export interface ojTreeViewEventMap<K, D> extends baseComponentEventMap<ojTreeViewSettableProperties<K, D>> {
    'ojAnimateEnd': ojTreeView.ojAnimateEnd;
    'ojAnimateStart': ojTreeView.ojAnimateStart;
    'ojBeforeCollapse': ojTreeView.ojBeforeCollapse<K>;
    'ojBeforeCurrentItem': ojTreeView.ojBeforeCurrentItem<K>;
    'ojBeforeExpand': ojTreeView.ojBeforeExpand<K>;
    'ojCollapse': ojTreeView.ojCollapse<K>;
    'ojExpand': ojTreeView.ojExpand<K>;
    'currentItemChanged': JetElementCustomEvent<ojTreeView<K, D>["currentItem"]>;
    'dataChanged': JetElementCustomEvent<ojTreeView<K, D>["data"]>;
    'dndChanged': JetElementCustomEvent<ojTreeView<K, D>["dnd"]>;
    'expandedChanged': JetElementCustomEvent<ojTreeView<K, D>["expanded"]>;
    'itemChanged': JetElementCustomEvent<ojTreeView<K, D>["item"]>;
    'selectedChanged': JetElementCustomEvent<ojTreeView<K, D>["selected"]>;
    'selectionChanged': JetElementCustomEvent<ojTreeView<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojTreeView<K, D>["selectionMode"]>;
}
export interface ojTreeViewSettableProperties<K, D> extends baseComponentSettableProperties {
    readonly currentItem: K;
    data: TreeDataProvider<K, D>;
    dnd: {
        drag?: {
            items: {
                dataTypes?: string | string[];
                dragStart?: ((event: Event, context: {
                    items: D[];
                }) => void);
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
            };
        };
        drop?: {
            items: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragOver?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    item: Element;
                }) => void);
                drop: ((param0: Event, param1: ojTreeView.ItemsDropOnDropContext) => void);
            };
        };
    };
    expanded: KeySet<K>;
    item: {
        focusable?: ((itemContext: ojTreeView.ItemContext<K, D>) => boolean);
        renderer?: ((itemContext: ojTreeView.ItemContext<K, D>) => {
            insert: Element | string;
        } | void) | null;
        selectable?: ((itemContext: ojTreeView.ItemContext<K, D>) => boolean);
    };
    selected: KeySet<K>;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
}
export interface ojTreeViewSettablePropertiesLenient<K, D> extends Partial<ojTreeViewSettableProperties<K, D>> {
    [key: string]: any;
}
