import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojNavigationList<K, D> extends baseComponent<ojNavigationListSettableProperties<K, D>> {
    as: string;
    currentItem: K;
    data: DataProvider<K, D> | null;
    display: 'all' | 'icons';
    drillMode: 'none' | 'collapsible' | 'sliding';
    edge: 'top' | 'bottom' | 'start';
    expanded: KeySet<K>;
    hierarchyMenuThreshold: number;
    item: {
        renderer?: (((context: ojNavigationList.ItemContext<K, D>) => void) | null);
        selectable?: (((context: ojNavigationList.ItemContext<K, D>) => boolean) | boolean);
    };
    overflow: 'popup' | 'hidden';
    rootLabel: string | null;
    selection: K;
    translations: {
        accessibleExpandCollapseInstructionText?: string;
        defaultRootLabel?: string;
        hierMenuBtnLabel?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        overflowItemLabel?: string;
        previousIcon?: string;
        selectedLabel?: string;
    };
    addEventListener<T extends keyof ojNavigationListEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojNavigationListEventMap<K, D>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojNavigationListSettableProperties<K, D>>(property: T): ojNavigationList<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojNavigationListSettableProperties<K, D>>(property: T, value: ojNavigationListSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojNavigationListSettableProperties<K, D>>): void;
    setProperties(properties: ojNavigationListSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojNavigationList.NodeContext<K> | null;
    refresh(): void;
}
export namespace ojNavigationList {
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
    interface ojBeforeCollapse extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentItem extends CustomEvent<{
        item: Element;
        key: any;
        previousItem: Element;
        previousKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojSelectionAction<K> extends CustomEvent<{
        previousValue: K;
        value: K;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillModeChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["drillMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type edgeChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["edge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hierarchyMenuThresholdChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["hierarchyMenuThreshold"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["item"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overflowChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["overflow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootLabelChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["rootLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K, D> = {
        componentElement: Element;
        data: any;
        datasource?: DataProvider<K, D>;
        depth?: number;
        index: number;
        key: any;
        leaf?: boolean;
        parentElement: Element;
        parentKey?: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        data: object;
        depth: number;
        index: number;
        key: any;
        leaf: boolean;
        parentkey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        group: boolean;
        index: number;
        key: K;
        parent?: Element;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
}
export interface ojNavigationListEventMap<K, D> extends baseComponentEventMap<ojNavigationListSettableProperties<K, D>> {
    'ojAnimateEnd': ojNavigationList.ojAnimateEnd;
    'ojAnimateStart': ojNavigationList.ojAnimateStart;
    'ojBeforeCollapse': ojNavigationList.ojBeforeCollapse;
    'ojBeforeCurrentItem': ojNavigationList.ojBeforeCurrentItem;
    'ojBeforeExpand': ojNavigationList.ojBeforeExpand;
    'ojBeforeSelect': ojNavigationList.ojBeforeSelect;
    'ojCollapse': ojNavigationList.ojCollapse;
    'ojExpand': ojNavigationList.ojExpand;
    'ojSelectionAction': ojNavigationList.ojSelectionAction<K>;
    'asChanged': JetElementCustomEvent<ojNavigationList<K, D>["as"]>;
    'currentItemChanged': JetElementCustomEvent<ojNavigationList<K, D>["currentItem"]>;
    'dataChanged': JetElementCustomEvent<ojNavigationList<K, D>["data"]>;
    'displayChanged': JetElementCustomEvent<ojNavigationList<K, D>["display"]>;
    'drillModeChanged': JetElementCustomEvent<ojNavigationList<K, D>["drillMode"]>;
    'edgeChanged': JetElementCustomEvent<ojNavigationList<K, D>["edge"]>;
    'expandedChanged': JetElementCustomEvent<ojNavigationList<K, D>["expanded"]>;
    'hierarchyMenuThresholdChanged': JetElementCustomEvent<ojNavigationList<K, D>["hierarchyMenuThreshold"]>;
    'itemChanged': JetElementCustomEvent<ojNavigationList<K, D>["item"]>;
    'overflowChanged': JetElementCustomEvent<ojNavigationList<K, D>["overflow"]>;
    'rootLabelChanged': JetElementCustomEvent<ojNavigationList<K, D>["rootLabel"]>;
    'selectionChanged': JetElementCustomEvent<ojNavigationList<K, D>["selection"]>;
}
export interface ojNavigationListSettableProperties<K, D> extends baseComponentSettableProperties {
    as: string;
    currentItem: K;
    data: DataProvider<K, D> | null;
    display: 'all' | 'icons';
    drillMode: 'none' | 'collapsible' | 'sliding';
    edge: 'top' | 'bottom' | 'start';
    expanded: KeySet<K>;
    hierarchyMenuThreshold: number;
    item: {
        renderer?: (((context: ojNavigationList.ItemContext<K, D>) => void) | null);
        selectable?: (((context: ojNavigationList.ItemContext<K, D>) => boolean) | boolean);
    };
    overflow: 'popup' | 'hidden';
    rootLabel: string | null;
    selection: K;
    translations: {
        accessibleExpandCollapseInstructionText?: string;
        defaultRootLabel?: string;
        hierMenuBtnLabel?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        overflowItemLabel?: string;
        previousIcon?: string;
        selectedLabel?: string;
    };
}
export interface ojNavigationListSettablePropertiesLenient<K, D> extends Partial<ojNavigationListSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojTabBar<K, D> extends baseComponent<ojTabBarSettableProperties<K, D>> {
    as: string;
    currentItem: any;
    data: DataProvider<K, D> | null;
    display: 'all' | 'icons' | 'stacked';
    edge: 'top' | 'bottom' | 'start' | 'end';
    item: {
        renderer?: (((context: ojTabBar.ItemContext<K, D>) => void) | null);
        selectable?: (((context: ojTabBar.ItemContext<K, D>) => boolean) | boolean);
    };
    layout: 'stretch' | 'condense';
    overflow: 'popup' | 'hidden';
    reorderable: 'enabled' | 'disabled';
    selection: any;
    truncation: 'none' | 'progressive';
    translations: {
        accessibleReorderAfterItem?: string;
        accessibleReorderBeforeItem?: string;
        accessibleReorderTouchInstructionText?: string;
        labelCut?: string;
        labelPasteAfter?: string;
        labelPasteBefore?: string;
        labelRemove?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        overflowItemLabel?: string;
        removeCueText?: string;
        selectedLabel?: string;
    };
    addEventListener<T extends keyof ojTabBarEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTabBarEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTabBarSettableProperties<K, D>>(property: T): ojTabBar<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTabBarSettableProperties<K, D>>(property: T, value: ojTabBarSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTabBarSettableProperties<K, D>>): void;
    setProperties(properties: ojTabBarSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojTabBar.NodeContext<K> | null;
    refresh(): void;
}
export namespace ojTabBar {
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
    interface ojBeforeCurrentItem extends CustomEvent<{
        item: Element;
        key: any;
        previousItem: Element;
        previousKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeDeselect extends CustomEvent<{
        fromItem: Element;
        fromKey: any;
        toItem: Element;
        toKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRemove extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojDeselect extends CustomEvent<{
        fromItem: Element;
        fromKey: any;
        toItem: Element;
        toKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojRemove extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojReorder extends CustomEvent<{
        item: Element;
        position: 'before' | 'after';
        reference: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type edgeChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["edge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["item"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overflowChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["overflow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type reorderableChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["reorderable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type truncationChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["truncation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K, D> = {
        componentElement: Element;
        data: D;
        datasource?: DataProvider<K, D>;
        index: number;
        key: K;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        index: number;
        key: K;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
}
export interface ojTabBarEventMap<K, D> extends baseComponentEventMap<ojTabBarSettableProperties<K, D>> {
    'ojAnimateEnd': ojTabBar.ojAnimateEnd;
    'ojAnimateStart': ojTabBar.ojAnimateStart;
    'ojBeforeCurrentItem': ojTabBar.ojBeforeCurrentItem;
    'ojBeforeDeselect': ojTabBar.ojBeforeDeselect;
    'ojBeforeRemove': ojTabBar.ojBeforeRemove;
    'ojBeforeSelect': ojTabBar.ojBeforeSelect;
    'ojDeselect': ojTabBar.ojDeselect;
    'ojRemove': ojTabBar.ojRemove;
    'ojReorder': ojTabBar.ojReorder;
    'asChanged': JetElementCustomEvent<ojTabBar<K, D>["as"]>;
    'currentItemChanged': JetElementCustomEvent<ojTabBar<K, D>["currentItem"]>;
    'dataChanged': JetElementCustomEvent<ojTabBar<K, D>["data"]>;
    'displayChanged': JetElementCustomEvent<ojTabBar<K, D>["display"]>;
    'edgeChanged': JetElementCustomEvent<ojTabBar<K, D>["edge"]>;
    'itemChanged': JetElementCustomEvent<ojTabBar<K, D>["item"]>;
    'layoutChanged': JetElementCustomEvent<ojTabBar<K, D>["layout"]>;
    'overflowChanged': JetElementCustomEvent<ojTabBar<K, D>["overflow"]>;
    'reorderableChanged': JetElementCustomEvent<ojTabBar<K, D>["reorderable"]>;
    'selectionChanged': JetElementCustomEvent<ojTabBar<K, D>["selection"]>;
    'truncationChanged': JetElementCustomEvent<ojTabBar<K, D>["truncation"]>;
}
export interface ojTabBarSettableProperties<K, D> extends baseComponentSettableProperties {
    as: string;
    currentItem: any;
    data: DataProvider<K, D> | null;
    display: 'all' | 'icons' | 'stacked';
    edge: 'top' | 'bottom' | 'start' | 'end';
    item: {
        renderer?: (((context: ojTabBar.ItemContext<K, D>) => void) | null);
        selectable?: (((context: ojTabBar.ItemContext<K, D>) => boolean) | boolean);
    };
    layout: 'stretch' | 'condense';
    overflow: 'popup' | 'hidden';
    reorderable: 'enabled' | 'disabled';
    selection: any;
    truncation: 'none' | 'progressive';
    translations: {
        accessibleReorderAfterItem?: string;
        accessibleReorderBeforeItem?: string;
        accessibleReorderTouchInstructionText?: string;
        labelCut?: string;
        labelPasteAfter?: string;
        labelPasteBefore?: string;
        labelRemove?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        overflowItemLabel?: string;
        removeCueText?: string;
        selectedLabel?: string;
    };
}
export interface ojTabBarSettablePropertiesLenient<K, D> extends Partial<ojTabBarSettableProperties<K, D>> {
    [key: string]: any;
}
export type NavigationListElement<K, D> = ojNavigationList<K, D>;
export type TabBarElement<K, D> = ojTabBar<K, D>;
export namespace NavigationListElement {
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
    interface ojBeforeCollapse extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentItem extends CustomEvent<{
        item: Element;
        key: any;
        previousItem: Element;
        previousKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojSelectionAction<K> extends CustomEvent<{
        previousValue: K;
        value: K;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillModeChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["drillMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type edgeChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["edge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hierarchyMenuThresholdChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["hierarchyMenuThreshold"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["item"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overflowChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["overflow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootLabelChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["rootLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojNavigationList<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K, D> = {
        componentElement: Element;
        data: any;
        datasource?: DataProvider<K, D>;
        depth?: number;
        index: number;
        key: any;
        leaf?: boolean;
        parentElement: Element;
        parentKey?: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        data: object;
        depth: number;
        index: number;
        key: any;
        leaf: boolean;
        parentkey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        group: boolean;
        index: number;
        key: K;
        parent?: Element;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
}
export namespace TabBarElement {
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
    interface ojBeforeCurrentItem extends CustomEvent<{
        item: Element;
        key: any;
        previousItem: Element;
        previousKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeDeselect extends CustomEvent<{
        fromItem: Element;
        fromKey: any;
        toItem: Element;
        toKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRemove extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojDeselect extends CustomEvent<{
        fromItem: Element;
        fromKey: any;
        toItem: Element;
        toKey: any;
        [propName: string]: any;
    }> {
    }
    interface ojRemove extends CustomEvent<{
        item: Element;
        key: any;
        [propName: string]: any;
    }> {
    }
    interface ojReorder extends CustomEvent<{
        item: Element;
        position: 'before' | 'after';
        reference: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type edgeChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["edge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["item"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overflowChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["overflow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type reorderableChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["reorderable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type truncationChanged<K, D> = JetElementCustomEvent<ojTabBar<K, D>["truncation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K, D> = {
        componentElement: Element;
        data: D;
        datasource?: DataProvider<K, D>;
        index: number;
        key: K;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        index: number;
        key: K;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
}
export interface NavigationListIntrinsicProps extends Partial<Readonly<ojNavigationListSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojNavigationListEventMap<any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojNavigationListEventMap<any, any>['ojAnimateStart']) => void;
    onojBeforeCollapse?: (value: ojNavigationListEventMap<any, any>['ojBeforeCollapse']) => void;
    onojBeforeCurrentItem?: (value: ojNavigationListEventMap<any, any>['ojBeforeCurrentItem']) => void;
    onojBeforeExpand?: (value: ojNavigationListEventMap<any, any>['ojBeforeExpand']) => void;
    onojBeforeSelect?: (value: ojNavigationListEventMap<any, any>['ojBeforeSelect']) => void;
    onojCollapse?: (value: ojNavigationListEventMap<any, any>['ojCollapse']) => void;
    onojExpand?: (value: ojNavigationListEventMap<any, any>['ojExpand']) => void;
    onojSelectionAction?: (value: ojNavigationListEventMap<any, any>['ojSelectionAction']) => void;
    onasChanged?: (value: ojNavigationListEventMap<any, any>['asChanged']) => void;
    oncurrentItemChanged?: (value: ojNavigationListEventMap<any, any>['currentItemChanged']) => void;
    ondataChanged?: (value: ojNavigationListEventMap<any, any>['dataChanged']) => void;
    ondisplayChanged?: (value: ojNavigationListEventMap<any, any>['displayChanged']) => void;
    ondrillModeChanged?: (value: ojNavigationListEventMap<any, any>['drillModeChanged']) => void;
    onedgeChanged?: (value: ojNavigationListEventMap<any, any>['edgeChanged']) => void;
    onexpandedChanged?: (value: ojNavigationListEventMap<any, any>['expandedChanged']) => void;
    onhierarchyMenuThresholdChanged?: (value: ojNavigationListEventMap<any, any>['hierarchyMenuThresholdChanged']) => void;
    onitemChanged?: (value: ojNavigationListEventMap<any, any>['itemChanged']) => void;
    onoverflowChanged?: (value: ojNavigationListEventMap<any, any>['overflowChanged']) => void;
    onrootLabelChanged?: (value: ojNavigationListEventMap<any, any>['rootLabelChanged']) => void;
    onselectionChanged?: (value: ojNavigationListEventMap<any, any>['selectionChanged']) => void;
    children?: ComponentChildren;
}
export interface TabBarIntrinsicProps extends Partial<Readonly<ojTabBarSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojTabBarEventMap<any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojTabBarEventMap<any, any>['ojAnimateStart']) => void;
    onojBeforeCurrentItem?: (value: ojTabBarEventMap<any, any>['ojBeforeCurrentItem']) => void;
    onojBeforeDeselect?: (value: ojTabBarEventMap<any, any>['ojBeforeDeselect']) => void;
    onojBeforeRemove?: (value: ojTabBarEventMap<any, any>['ojBeforeRemove']) => void;
    onojBeforeSelect?: (value: ojTabBarEventMap<any, any>['ojBeforeSelect']) => void;
    onojDeselect?: (value: ojTabBarEventMap<any, any>['ojDeselect']) => void;
    onojRemove?: (value: ojTabBarEventMap<any, any>['ojRemove']) => void;
    onojReorder?: (value: ojTabBarEventMap<any, any>['ojReorder']) => void;
    onasChanged?: (value: ojTabBarEventMap<any, any>['asChanged']) => void;
    oncurrentItemChanged?: (value: ojTabBarEventMap<any, any>['currentItemChanged']) => void;
    ondataChanged?: (value: ojTabBarEventMap<any, any>['dataChanged']) => void;
    ondisplayChanged?: (value: ojTabBarEventMap<any, any>['displayChanged']) => void;
    onedgeChanged?: (value: ojTabBarEventMap<any, any>['edgeChanged']) => void;
    onitemChanged?: (value: ojTabBarEventMap<any, any>['itemChanged']) => void;
    onlayoutChanged?: (value: ojTabBarEventMap<any, any>['layoutChanged']) => void;
    onoverflowChanged?: (value: ojTabBarEventMap<any, any>['overflowChanged']) => void;
    onreorderableChanged?: (value: ojTabBarEventMap<any, any>['reorderableChanged']) => void;
    onselectionChanged?: (value: ojTabBarEventMap<any, any>['selectionChanged']) => void;
    ontruncationChanged?: (value: ojTabBarEventMap<any, any>['truncationChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-navigation-list": NavigationListIntrinsicProps;
            "oj-tab-bar": TabBarIntrinsicProps;
        }
    }
}
