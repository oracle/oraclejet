import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
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
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((event: Event, context: {
                    items: D[];
                }) => void);
            };
        };
        drop?: {
            items: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragOver?: ((event: Event, context: {
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
    scrollPolicyOptions: {
        maxCount: number;
    };
    selected: KeySet<K>;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple' | 'leafOnly';
    translations: {
        receivedDataAria?: string;
        retrievingDataAria?: string;
        treeViewSelectorAria?: string;
    };
    addEventListener<T extends keyof ojTreeViewEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTreeViewEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentItem<K> extends CustomEvent<{
        item: Element;
        key: K;
        previousItem: Element;
        previousKey: K;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K> extends CustomEvent<{
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K> extends CustomEvent<{
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K> extends CustomEvent<{
        item: Element;
        key: K;
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
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["scrollPolicyOptions"]>;
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
        datasource: TreeDataProvider<K, D> | object;
        depth: number;
        index: number;
        key: K;
        leaf: boolean;
        metadata: ItemMetadata<K>;
        parentElement: Element;
        parentKey?: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemsDropOnDropContext = {
        item: Element;
        position: 'inside' | 'before' | 'after' | 'first';
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        key: K;
        leaf: boolean;
        metadata: ItemMetadata<K>;
        parentkey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
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
    'scrollPolicyOptionsChanged': JetElementCustomEvent<ojTreeView<K, D>["scrollPolicyOptions"]>;
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
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((event: Event, context: {
                    items: D[];
                }) => void);
            };
        };
        drop?: {
            items: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    item: Element;
                }) => void);
                dragOver?: ((event: Event, context: {
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
    scrollPolicyOptions: {
        maxCount: number;
    };
    selected: KeySet<K>;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple' | 'leafOnly';
    translations: {
        receivedDataAria?: string;
        retrievingDataAria?: string;
        treeViewSelectorAria?: string;
    };
}
export interface ojTreeViewSettablePropertiesLenient<K, D> extends Partial<ojTreeViewSettableProperties<K, D>> {
    [key: string]: any;
}
export type TreeViewElement<K, D> = ojTreeView<K, D>;
export namespace TreeViewElement {
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
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentItem<K> extends CustomEvent<{
        item: Element;
        key: K;
        previousItem: Element;
        previousKey: K;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K> extends CustomEvent<{
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K> extends CustomEvent<{
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K> extends CustomEvent<{
        item: Element;
        key: K;
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
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojTreeView<K, D>["scrollPolicyOptions"]>;
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
        datasource: TreeDataProvider<K, D> | object;
        depth: number;
        index: number;
        key: K;
        leaf: boolean;
        metadata: ItemMetadata<K>;
        parentElement: Element;
        parentKey?: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemsDropOnDropContext = {
        item: Element;
        position: 'inside' | 'before' | 'after' | 'first';
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        key: K;
        leaf: boolean;
        metadata: ItemMetadata<K>;
        parentkey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
}
export interface TreeViewIntrinsicProps extends Partial<Readonly<ojTreeViewSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojTreeViewEventMap<any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojTreeViewEventMap<any, any>['ojAnimateStart']) => void;
    onojBeforeCollapse?: (value: ojTreeViewEventMap<any, any>['ojBeforeCollapse']) => void;
    onojBeforeCurrentItem?: (value: ojTreeViewEventMap<any, any>['ojBeforeCurrentItem']) => void;
    onojBeforeExpand?: (value: ojTreeViewEventMap<any, any>['ojBeforeExpand']) => void;
    onojCollapse?: (value: ojTreeViewEventMap<any, any>['ojCollapse']) => void;
    onojExpand?: (value: ojTreeViewEventMap<any, any>['ojExpand']) => void;
    oncurrentItemChanged?: (value: ojTreeViewEventMap<any, any>['currentItemChanged']) => void;
    ondataChanged?: (value: ojTreeViewEventMap<any, any>['dataChanged']) => void;
    ondndChanged?: (value: ojTreeViewEventMap<any, any>['dndChanged']) => void;
    onexpandedChanged?: (value: ojTreeViewEventMap<any, any>['expandedChanged']) => void;
    onitemChanged?: (value: ojTreeViewEventMap<any, any>['itemChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: ojTreeViewEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onselectedChanged?: (value: ojTreeViewEventMap<any, any>['selectedChanged']) => void;
    onselectionChanged?: (value: ojTreeViewEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojTreeViewEventMap<any, any>['selectionModeChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-tree-view": TreeViewIntrinsicProps;
        }
    }
}
