/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojNavigationList<K, D> extends baseComponent<ojNavigationListSettableProperties<K, D>> {
    as: string;
    currentItem: K;
    data: DataProvider<K, D> | null;
    display: 'all' | 'icons';
    drillMode: 'none' | 'collapsible' | 'sliding';
    edge: 'top' | 'start';
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
        defaultRootLabel?: string;
        hierMenuBtnLabel?: string;
        previousIcon?: string;
    };
    addEventListener<T extends keyof ojNavigationListEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojNavigationListEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
        key: any;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentItem extends CustomEvent<{
        previousKey: any;
        previousItem: Element;
        key: any;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        key: any;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        key: any;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        key: any;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        key: any;
        item: Element;
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
        datasource?: DataProvider<K, D>;
        index: number;
        key: any;
        data: any;
        parentElement: Element;
        depth?: number;
        parentKey?: K;
        leaf?: boolean;
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
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        subId: string;
        index: number;
        key: K;
        group: boolean;
        parent?: Element;
    };
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
    edge: 'top' | 'start';
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
        defaultRootLabel?: string;
        hierMenuBtnLabel?: string;
        previousIcon?: string;
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
    addEventListener<T extends keyof ojTabBarEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTabBarEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
        previousKey: any;
        previousItem: Element;
        key: any;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeDeselect extends CustomEvent<{
        fromKey: any;
        fromItem: Element;
        toKey: any;
        toItem: Element;
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
        key: any;
        item: Element;
        [propName: string]: any;
    }> {
    }
    interface ojDeselect extends CustomEvent<{
        fromKey: any;
        fromItem: Element;
        toKey: any;
        toItem: Element;
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
        datasource?: DataProvider<K, D>;
        index: number;
        key: K;
        data: D;
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
        subId: string;
        index: number;
        key: K;
    };
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
