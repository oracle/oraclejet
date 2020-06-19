/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSunburst<K, D extends ojSunburst.Node<K> | any> extends dvtBaseComponent<ojSunburstSettableProperties<K, D>> {
    animationDuration: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    animationUpdateColor: string;
    as: string;
    colorLabel: string;
    data: DataProvider<K, D> | null;
    displayLevels: number;
    drilling: 'on' | 'off';
    expanded: KeySet<K>;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverBehaviorDelay: number;
    nodeDefaults: {
        borderColor: string;
        borderWidth: number;
        hoverColor: string;
        labelDisplay: 'horizontal' | 'rotated' | 'off' | 'auto';
        labelHalign: 'inner' | 'outer' | 'center';
        labelMinLength: number;
        labelStyle: CSSStyleDeclaration;
        selectedInnerColor: string;
        selectedOuterColor: string;
        showDisclosure: 'on' | 'off';
    };
    rootNode: any;
    rootNodeContent: {
        renderer: ((context: ojSunburst.RootNodeContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    rotation: 'off' | 'on';
    selection: any[];
    selectionMode: 'none' | 'single' | 'multiple';
    sizeLabel: string;
    sorting: 'on' | 'off';
    startAngle: number;
    tooltip: {
        renderer: ((context: ojSunburst.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelColor?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelSize?: string;
        stateCollapsed?: string;
        stateDrillable?: string;
        stateExpanded?: string;
        stateHidden?: string;
        stateIsolated?: string;
        stateMaximized?: string;
        stateMinimized?: string;
        stateSelected?: string;
        stateUnselected?: string;
        stateVisible?: string;
        tooltipCollapse?: string;
        tooltipExpand?: string;
    };
    addEventListener<T extends keyof ojSunburstEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojSunburstEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSunburstSettableProperties<K, D>>(property: T): ojSunburst<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSunburstSettableProperties<K, D>>(property: T, value: ojSunburstSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSunburstSettableProperties<K, D>>): void;
    setProperties(properties: ojSunburstSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojSunburst.NodeContext | null;
}
export namespace ojSunburst {
    interface ojBeforeCollapse<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeDrill<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojDrill<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojRotateInput extends CustomEvent<{
        value: number;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationUpdateColorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationUpdateColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorLabelChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["colorLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayLevelsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["displayLevels"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeDefaultsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["nodeDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootNodeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["rootNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootNodeContentChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["rootNodeContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rotationChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["rotation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeLabelChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["sizeLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sortingChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["sorting"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startAngleChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["startAngle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type DataContext = {
        color: string;
        label: string;
        selected: boolean;
        size: number;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K> = {
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        drilling?: 'inherit' | 'off' | 'on';
        id?: K;
        label?: string;
        labelDisplay?: 'auto' | 'horizontal' | 'off' | 'rotated';
        labelHalign?: 'center' | 'inner' | 'outer';
        labelStyle?: CSSStyleDeclaration;
        nodes?: Array<Node<K>>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        radius?: number;
        selectable?: 'auto' | 'off';
        shortDesc?: string;
        showDisclosure?: 'inherit' | 'off' | 'on';
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        subId: string;
        indexPath: number[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
        parentData: any[];
        parentKey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RootNodeContext<K, D> = {
        outerBounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        innerBounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        id: K;
        data: Node<K>;
        itemData: D;
        componentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D> = {
        parentElement: Element;
        id: K;
        label: string;
        value: number;
        radius: number;
        color: string;
        data: Node<K>;
        itemData: D;
        componentElement: Element;
    };
}
export interface ojSunburstEventMap<K, D extends ojSunburst.Node<K> | any> extends dvtBaseComponentEventMap<ojSunburstSettableProperties<K, D>> {
    'ojBeforeCollapse': ojSunburst.ojBeforeCollapse<K, D>;
    'ojBeforeDrill': ojSunburst.ojBeforeDrill<K, D>;
    'ojBeforeExpand': ojSunburst.ojBeforeExpand<K, D>;
    'ojCollapse': ojSunburst.ojCollapse<K, D>;
    'ojDrill': ojSunburst.ojDrill<K, D>;
    'ojExpand': ojSunburst.ojExpand<K, D>;
    'ojRotateInput': ojSunburst.ojRotateInput;
    'animationDurationChanged': JetElementCustomEvent<ojSunburst<K, D>["animationDuration"]>;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojSunburst<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojSunburst<K, D>["animationOnDisplay"]>;
    'animationUpdateColorChanged': JetElementCustomEvent<ojSunburst<K, D>["animationUpdateColor"]>;
    'asChanged': JetElementCustomEvent<ojSunburst<K, D>["as"]>;
    'colorLabelChanged': JetElementCustomEvent<ojSunburst<K, D>["colorLabel"]>;
    'dataChanged': JetElementCustomEvent<ojSunburst<K, D>["data"]>;
    'displayLevelsChanged': JetElementCustomEvent<ojSunburst<K, D>["displayLevels"]>;
    'drillingChanged': JetElementCustomEvent<ojSunburst<K, D>["drilling"]>;
    'expandedChanged': JetElementCustomEvent<ojSunburst<K, D>["expanded"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojSunburst<K, D>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojSunburst<K, D>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojSunburst<K, D>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojSunburst<K, D>["hoverBehavior"]>;
    'hoverBehaviorDelayChanged': JetElementCustomEvent<ojSunburst<K, D>["hoverBehaviorDelay"]>;
    'nodeDefaultsChanged': JetElementCustomEvent<ojSunburst<K, D>["nodeDefaults"]>;
    'rootNodeChanged': JetElementCustomEvent<ojSunburst<K, D>["rootNode"]>;
    'rootNodeContentChanged': JetElementCustomEvent<ojSunburst<K, D>["rootNodeContent"]>;
    'rotationChanged': JetElementCustomEvent<ojSunburst<K, D>["rotation"]>;
    'selectionChanged': JetElementCustomEvent<ojSunburst<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojSunburst<K, D>["selectionMode"]>;
    'sizeLabelChanged': JetElementCustomEvent<ojSunburst<K, D>["sizeLabel"]>;
    'sortingChanged': JetElementCustomEvent<ojSunburst<K, D>["sorting"]>;
    'startAngleChanged': JetElementCustomEvent<ojSunburst<K, D>["startAngle"]>;
    'tooltipChanged': JetElementCustomEvent<ojSunburst<K, D>["tooltip"]>;
    'touchResponseChanged': JetElementCustomEvent<ojSunburst<K, D>["touchResponse"]>;
}
export interface ojSunburstSettableProperties<K, D extends ojSunburst.Node<K> | any> extends dvtBaseComponentSettableProperties {
    animationDuration: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    animationUpdateColor: string;
    as: string;
    colorLabel: string;
    data: DataProvider<K, D> | null;
    displayLevels: number;
    drilling: 'on' | 'off';
    expanded: KeySet<K>;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverBehaviorDelay: number;
    nodeDefaults: {
        borderColor: string;
        borderWidth: number;
        hoverColor: string;
        labelDisplay: 'horizontal' | 'rotated' | 'off' | 'auto';
        labelHalign: 'inner' | 'outer' | 'center';
        labelMinLength: number;
        labelStyle: CSSStyleDeclaration;
        selectedInnerColor: string;
        selectedOuterColor: string;
        showDisclosure: 'on' | 'off';
    };
    rootNode: any;
    rootNodeContent: {
        renderer: ((context: ojSunburst.RootNodeContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    rotation: 'off' | 'on';
    selection: any[];
    selectionMode: 'none' | 'single' | 'multiple';
    sizeLabel: string;
    sorting: 'on' | 'off';
    startAngle: number;
    tooltip: {
        renderer: ((context: ojSunburst.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelColor?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelSize?: string;
        stateCollapsed?: string;
        stateDrillable?: string;
        stateExpanded?: string;
        stateHidden?: string;
        stateIsolated?: string;
        stateMaximized?: string;
        stateMinimized?: string;
        stateSelected?: string;
        stateUnselected?: string;
        stateVisible?: string;
        tooltipCollapse?: string;
        tooltipExpand?: string;
    };
}
export interface ojSunburstSettablePropertiesLenient<K, D extends ojSunburst.Node<K> | any> extends Partial<ojSunburstSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojSunburstNode extends JetElement<ojSunburstNodeSettableProperties> {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    label?: string;
    labelDisplay?: 'horizontal' | 'rotated' | 'off' | 'auto';
    labelHalign?: 'inner' | 'outer' | 'center';
    labelStyle?: CSSStyleDeclaration;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    radius?: number;
    selectable?: 'off' | 'auto';
    shortDesc?: string;
    showDisclosure?: 'on' | 'off' | 'inherit';
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    value: number;
    addEventListener<T extends keyof ojSunburstNodeEventMap>(type: T, listener: (this: HTMLElement, ev: ojSunburstNodeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSunburstNodeSettableProperties>(property: T): ojSunburstNode[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSunburstNodeSettableProperties>(property: T, value: ojSunburstNodeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSunburstNodeSettableProperties>): void;
    setProperties(properties: ojSunburstNodeSettablePropertiesLenient): void;
}
export namespace ojSunburstNode {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojSunburstNode["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged = JetElementCustomEvent<ojSunburstNode["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojSunburstNode["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojSunburstNode["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojSunburstNode["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojSunburstNode["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged = JetElementCustomEvent<ojSunburstNode["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHalignChanged = JetElementCustomEvent<ojSunburstNode["labelHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojSunburstNode["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged = JetElementCustomEvent<ojSunburstNode["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type radiusChanged = JetElementCustomEvent<ojSunburstNode["radius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged = JetElementCustomEvent<ojSunburstNode["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojSunburstNode["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type showDisclosureChanged = JetElementCustomEvent<ojSunburstNode["showDisclosure"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojSunburstNode["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojSunburstNode["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSunburstNode["value"]>;
}
export interface ojSunburstNodeEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEvent<ojSunburstNode["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojSunburstNode["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojSunburstNode["categories"]>;
    'colorChanged': JetElementCustomEvent<ojSunburstNode["color"]>;
    'drillingChanged': JetElementCustomEvent<ojSunburstNode["drilling"]>;
    'labelChanged': JetElementCustomEvent<ojSunburstNode["label"]>;
    'labelDisplayChanged': JetElementCustomEvent<ojSunburstNode["labelDisplay"]>;
    'labelHalignChanged': JetElementCustomEvent<ojSunburstNode["labelHalign"]>;
    'labelStyleChanged': JetElementCustomEvent<ojSunburstNode["labelStyle"]>;
    'patternChanged': JetElementCustomEvent<ojSunburstNode["pattern"]>;
    'radiusChanged': JetElementCustomEvent<ojSunburstNode["radius"]>;
    'selectableChanged': JetElementCustomEvent<ojSunburstNode["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojSunburstNode["shortDesc"]>;
    'showDisclosureChanged': JetElementCustomEvent<ojSunburstNode["showDisclosure"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojSunburstNode["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojSunburstNode["svgStyle"]>;
    'valueChanged': JetElementCustomEvent<ojSunburstNode["value"]>;
}
export interface ojSunburstNodeSettableProperties extends JetSettableProperties {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    label?: string;
    labelDisplay?: 'horizontal' | 'rotated' | 'off' | 'auto';
    labelHalign?: 'inner' | 'outer' | 'center';
    labelStyle?: CSSStyleDeclaration;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    radius?: number;
    selectable?: 'off' | 'auto';
    shortDesc?: string;
    showDisclosure?: 'on' | 'off' | 'inherit';
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    value: number;
}
export interface ojSunburstNodeSettablePropertiesLenient extends Partial<ojSunburstNodeSettableProperties> {
    [key: string]: any;
}
