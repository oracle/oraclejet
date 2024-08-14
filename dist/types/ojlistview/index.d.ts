import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import CommonTypes = require('../ojcommontypes');
import { KeySet } from '../ojkeyset';
import { DataProvider, ItemMetadata, Item } from '../ojdataprovider';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojListView<K, D> extends baseComponent<ojListViewSettableProperties<K, D>> {
    as: string;
    currentItem: K;
    data: DataProvider<K, D>;
    display: 'list' | 'card';
    dnd: {
        drag?: {
            items: {
                dataTypes?: string | string[];
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((param0: Event, param1: {
                    items: Element[];
                }) => void);
            };
        };
        drop?: {
            items: {
                dataTypes?: string | string[];
                dragEnter?: ((param0: Event, param1: {
                    item: Element;
                }) => void);
                dragLeave?: ((param0: Event, param1: {
                    item: Element;
                }) => void);
                dragOver?: ((param0: Event, param1: {
                    item: Element;
                }) => void);
                drop?: ((param0: Event, param1: ojListView.ItemsDropContext) => void);
            };
        };
        reorder?: {
            items: 'enabled' | 'disabled';
        };
    };
    drillMode: 'collapsible' | 'none';
    expanded: KeySet<K>;
    readonly firstSelectedItem: CommonTypes.ItemContext<K, D>;
    gridlines: {
        item: 'visible' | 'visibleExceptLast' | 'hidden';
    };
    groupHeaderPosition: 'static' | 'sticky';
    item: {
        focusable?: ((param0: ojListView.ItemContext<K, D>) => boolean) | boolean;
        renderer?: ((param0: ojListView.ItemContext<K, D>) => {
            insert: Element | string;
        } | undefined) | null;
        selectable?: ((param0: ojListView.ItemContext<K, D>) => boolean) | boolean;
    };
    scrollPolicy: 'auto' | 'loadAll' | 'loadMoreOnScroll';
    scrollPolicyOptions: {
        fetchSize?: number;
        maxCount?: number;
        scroller?: Element | keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string;
    };
    scrollPosition: {
        index?: number;
        key?: K;
        offsetX?: number;
        offsetY?: number;
        parent?: K;
        x?: number;
        y?: number;
    };
    scrollToKey: 'auto' | 'capability' | 'always' | 'never';
    selected: KeySet<K>;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    selectionRequired: boolean;
    translations: {
        accessibleExpandCollapseInstructionText?: string;
        accessibleGroupCollapse?: string;
        accessibleGroupExpand?: string;
        accessibleNavigateSkipItems?: string;
        accessibleReorderAfterItem?: string;
        accessibleReorderBeforeItem?: string;
        accessibleReorderInsideItem?: string;
        accessibleReorderTouchInstructionText?: string;
        accessibleSuggestion?: string;
        indexerCharacters?: string;
        labelCopy?: string;
        labelCut?: string;
        labelPaste?: string;
        labelPasteAfter?: string;
        labelPasteBefore?: string;
        msgFetchCompleted?: string;
        msgFetchingData?: string;
        msgItemsAppended?: string;
        msgNoData?: string;
    };
    addEventListener<T extends keyof ojListViewEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojListViewEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojListViewSettableProperties<K, D>>(property: T): ojListView<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojListViewSettableProperties<K, D>>(property: T, value: ojListViewSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojListViewSettableProperties<K, D>>): void;
    setProperties(properties: ojListViewSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojListView.ContextByNode<K> | null;
    getDataForVisibleItem(context: {
        key?: K;
        index?: number;
        parent?: Element;
    }): D;
    refresh(): void;
    scrollToItem(item: {
        key: K;
    }): void;
}
export namespace ojListView {
    interface ojAnimateEnd extends CustomEvent<{
        action: string;
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: string;
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
    interface ojCopy extends CustomEvent<{
        items: Element[];
        [propName: string]: any;
    }> {
    }
    interface ojCut extends CustomEvent<{
        items: Element[];
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K> extends CustomEvent<{
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojItemAction<K, D> extends CustomEvent<{
        context: CommonTypes.ItemContext<K, D>;
        originalEvent: Event;
        [propName: string]: any;
    }> {
    }
    interface ojPaste extends CustomEvent<{
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojReorder extends CustomEvent<{
        items: Element[];
        position: string;
        reference: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillModeChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["drillMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type firstSelectedItemChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["firstSelectedItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupHeaderPositionChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["groupHeaderPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["item"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollPolicy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollPolicyOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollToKeyChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollToKey"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectedChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRequiredChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selectionRequired"]>;
    // tslint:disable-next-line interface-over-type-literal
    type ContextByNode<K> = {
        group?: boolean;
        index: number;
        key: K;
        parent?: Element;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K, D> = {
        data: D;
        datasource: DataProvider<K, D>;
        depth?: number;
        index: number;
        key: K;
        leaf?: boolean;
        metadata: ItemMetadata<K>;
        parentElement: Element;
        parentKey?: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemsDropContext = {
        item: Element;
        position: 'before' | 'after' | 'inside';
        reorder: boolean;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        item: Item<K, D>;
        key: K;
        leaf: boolean;
        parentKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
}
export interface ojListViewEventMap<K, D> extends baseComponentEventMap<ojListViewSettableProperties<K, D>> {
    'ojAnimateEnd': ojListView.ojAnimateEnd;
    'ojAnimateStart': ojListView.ojAnimateStart;
    'ojBeforeCollapse': ojListView.ojBeforeCollapse<K>;
    'ojBeforeCurrentItem': ojListView.ojBeforeCurrentItem<K>;
    'ojBeforeExpand': ojListView.ojBeforeExpand<K>;
    'ojCollapse': ojListView.ojCollapse<K>;
    'ojCopy': ojListView.ojCopy;
    'ojCut': ojListView.ojCut;
    'ojExpand': ojListView.ojExpand<K>;
    'ojItemAction': ojListView.ojItemAction<K, D>;
    'ojPaste': ojListView.ojPaste;
    'ojReorder': ojListView.ojReorder;
    'asChanged': JetElementCustomEvent<ojListView<K, D>["as"]>;
    'currentItemChanged': JetElementCustomEvent<ojListView<K, D>["currentItem"]>;
    'dataChanged': JetElementCustomEvent<ojListView<K, D>["data"]>;
    'displayChanged': JetElementCustomEvent<ojListView<K, D>["display"]>;
    'dndChanged': JetElementCustomEvent<ojListView<K, D>["dnd"]>;
    'drillModeChanged': JetElementCustomEvent<ojListView<K, D>["drillMode"]>;
    'expandedChanged': JetElementCustomEvent<ojListView<K, D>["expanded"]>;
    'firstSelectedItemChanged': JetElementCustomEvent<ojListView<K, D>["firstSelectedItem"]>;
    'gridlinesChanged': JetElementCustomEvent<ojListView<K, D>["gridlines"]>;
    'groupHeaderPositionChanged': JetElementCustomEvent<ojListView<K, D>["groupHeaderPosition"]>;
    'itemChanged': JetElementCustomEvent<ojListView<K, D>["item"]>;
    'scrollPolicyChanged': JetElementCustomEvent<ojListView<K, D>["scrollPolicy"]>;
    'scrollPolicyOptionsChanged': JetElementCustomEvent<ojListView<K, D>["scrollPolicyOptions"]>;
    'scrollPositionChanged': JetElementCustomEvent<ojListView<K, D>["scrollPosition"]>;
    'scrollToKeyChanged': JetElementCustomEvent<ojListView<K, D>["scrollToKey"]>;
    'selectedChanged': JetElementCustomEvent<ojListView<K, D>["selected"]>;
    'selectionChanged': JetElementCustomEvent<ojListView<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojListView<K, D>["selectionMode"]>;
    'selectionRequiredChanged': JetElementCustomEvent<ojListView<K, D>["selectionRequired"]>;
}
export interface ojListViewSettableProperties<K, D> extends baseComponentSettableProperties {
    as: string;
    currentItem: K;
    data: DataProvider<K, D>;
    display: 'list' | 'card';
    dnd: {
        drag?: {
            items: {
                dataTypes?: string | string[];
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((param0: Event, param1: {
                    items: Element[];
                }) => void);
            };
        };
        drop?: {
            items: {
                dataTypes?: string | string[];
                dragEnter?: ((param0: Event, param1: {
                    item: Element;
                }) => void);
                dragLeave?: ((param0: Event, param1: {
                    item: Element;
                }) => void);
                dragOver?: ((param0: Event, param1: {
                    item: Element;
                }) => void);
                drop?: ((param0: Event, param1: ojListView.ItemsDropContext) => void);
            };
        };
        reorder?: {
            items: 'enabled' | 'disabled';
        };
    };
    drillMode: 'collapsible' | 'none';
    expanded: KeySet<K>;
    readonly firstSelectedItem: CommonTypes.ItemContext<K, D>;
    gridlines: {
        item: 'visible' | 'visibleExceptLast' | 'hidden';
    };
    groupHeaderPosition: 'static' | 'sticky';
    item: {
        focusable?: ((param0: ojListView.ItemContext<K, D>) => boolean) | boolean;
        renderer?: ((param0: ojListView.ItemContext<K, D>) => {
            insert: Element | string;
        } | undefined) | null;
        selectable?: ((param0: ojListView.ItemContext<K, D>) => boolean) | boolean;
    };
    scrollPolicy: 'auto' | 'loadAll' | 'loadMoreOnScroll';
    scrollPolicyOptions: {
        fetchSize?: number;
        maxCount?: number;
        scroller?: Element | keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string;
    };
    scrollPosition: {
        index?: number;
        key?: K;
        offsetX?: number;
        offsetY?: number;
        parent?: K;
        x?: number;
        y?: number;
    };
    scrollToKey: 'auto' | 'capability' | 'always' | 'never';
    selected: KeySet<K>;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    selectionRequired: boolean;
    translations: {
        accessibleExpandCollapseInstructionText?: string;
        accessibleGroupCollapse?: string;
        accessibleGroupExpand?: string;
        accessibleNavigateSkipItems?: string;
        accessibleReorderAfterItem?: string;
        accessibleReorderBeforeItem?: string;
        accessibleReorderInsideItem?: string;
        accessibleReorderTouchInstructionText?: string;
        accessibleSuggestion?: string;
        indexerCharacters?: string;
        labelCopy?: string;
        labelCut?: string;
        labelPaste?: string;
        labelPasteAfter?: string;
        labelPasteBefore?: string;
        msgFetchCompleted?: string;
        msgFetchingData?: string;
        msgItemsAppended?: string;
        msgNoData?: string;
    };
}
export interface ojListViewSettablePropertiesLenient<K, D> extends Partial<ojListViewSettableProperties<K, D>> {
    [key: string]: any;
}
export type ListViewElement<K, D> = ojListView<K, D>;
export namespace ListViewElement {
    interface ojAnimateEnd extends CustomEvent<{
        action: string;
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: string;
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
    interface ojCopy extends CustomEvent<{
        items: Element[];
        [propName: string]: any;
    }> {
    }
    interface ojCut extends CustomEvent<{
        items: Element[];
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K> extends CustomEvent<{
        item: Element;
        key: K;
        [propName: string]: any;
    }> {
    }
    interface ojItemAction<K, D> extends CustomEvent<{
        context: CommonTypes.ItemContext<K, D>;
        originalEvent: Event;
        [propName: string]: any;
    }> {
    }
    interface ojPaste extends CustomEvent<{
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojReorder extends CustomEvent<{
        items: Element[];
        position: string;
        reference: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillModeChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["drillMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type firstSelectedItemChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["firstSelectedItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupHeaderPositionChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["groupHeaderPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["item"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollPolicy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollPolicyOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollToKeyChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["scrollToKey"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectedChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRequiredChanged<K, D> = JetElementCustomEvent<ojListView<K, D>["selectionRequired"]>;
    // tslint:disable-next-line interface-over-type-literal
    type ContextByNode<K> = {
        group?: boolean;
        index: number;
        key: K;
        parent?: Element;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K, D> = {
        data: D;
        datasource: DataProvider<K, D>;
        depth?: number;
        index: number;
        key: K;
        leaf?: boolean;
        metadata: ItemMetadata<K>;
        parentElement: Element;
        parentKey?: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemsDropContext = {
        item: Element;
        position: 'before' | 'after' | 'inside';
        reorder: boolean;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        item: Item<K, D>;
        key: K;
        leaf: boolean;
        parentKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
}
export interface ListViewIntrinsicProps extends Partial<Readonly<ojListViewSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojListViewEventMap<any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojListViewEventMap<any, any>['ojAnimateStart']) => void;
    onojBeforeCollapse?: (value: ojListViewEventMap<any, any>['ojBeforeCollapse']) => void;
    onojBeforeCurrentItem?: (value: ojListViewEventMap<any, any>['ojBeforeCurrentItem']) => void;
    onojBeforeExpand?: (value: ojListViewEventMap<any, any>['ojBeforeExpand']) => void;
    onojCollapse?: (value: ojListViewEventMap<any, any>['ojCollapse']) => void;
    onojCopy?: (value: ojListViewEventMap<any, any>['ojCopy']) => void;
    onojCut?: (value: ojListViewEventMap<any, any>['ojCut']) => void;
    onojExpand?: (value: ojListViewEventMap<any, any>['ojExpand']) => void;
    onojItemAction?: (value: ojListViewEventMap<any, any>['ojItemAction']) => void;
    onojPaste?: (value: ojListViewEventMap<any, any>['ojPaste']) => void;
    onojReorder?: (value: ojListViewEventMap<any, any>['ojReorder']) => void;
    onasChanged?: (value: ojListViewEventMap<any, any>['asChanged']) => void;
    oncurrentItemChanged?: (value: ojListViewEventMap<any, any>['currentItemChanged']) => void;
    ondataChanged?: (value: ojListViewEventMap<any, any>['dataChanged']) => void;
    ondisplayChanged?: (value: ojListViewEventMap<any, any>['displayChanged']) => void;
    ondndChanged?: (value: ojListViewEventMap<any, any>['dndChanged']) => void;
    ondrillModeChanged?: (value: ojListViewEventMap<any, any>['drillModeChanged']) => void;
    onexpandedChanged?: (value: ojListViewEventMap<any, any>['expandedChanged']) => void;
    onfirstSelectedItemChanged?: (value: ojListViewEventMap<any, any>['firstSelectedItemChanged']) => void;
    ongridlinesChanged?: (value: ojListViewEventMap<any, any>['gridlinesChanged']) => void;
    ongroupHeaderPositionChanged?: (value: ojListViewEventMap<any, any>['groupHeaderPositionChanged']) => void;
    onitemChanged?: (value: ojListViewEventMap<any, any>['itemChanged']) => void;
    onscrollPolicyChanged?: (value: ojListViewEventMap<any, any>['scrollPolicyChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: ojListViewEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onscrollPositionChanged?: (value: ojListViewEventMap<any, any>['scrollPositionChanged']) => void;
    onscrollToKeyChanged?: (value: ojListViewEventMap<any, any>['scrollToKeyChanged']) => void;
    onselectedChanged?: (value: ojListViewEventMap<any, any>['selectedChanged']) => void;
    onselectionChanged?: (value: ojListViewEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojListViewEventMap<any, any>['selectionModeChanged']) => void;
    onselectionRequiredChanged?: (value: ojListViewEventMap<any, any>['selectionRequiredChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-list-view": ListViewIntrinsicProps;
        }
    }
}
