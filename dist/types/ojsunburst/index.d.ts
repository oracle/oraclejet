import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSunburst<K, D extends ojSunburst.Node<K> | any> extends dvtBaseComponent<ojSunburstSettableProperties<K, D>> {
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    animationUpdateColor?: string;
    as?: string;
    colorLabel?: string;
    data: DataProvider<K, D> | null;
    displayLevels?: number;
    drilling?: 'on' | 'off';
    expanded?: KeySet<K>;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightMode?: 'categories' | 'descendants';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverBehaviorDelay?: number;
    nodeDefaults?: {
        borderColor?: string;
        borderWidth?: number;
        hoverColor?: string;
        labelDisplay?: 'horizontal' | 'rotated' | 'off' | 'auto';
        labelHalign?: 'inner' | 'outer' | 'center';
        labelMinLength?: number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        selectedInnerColor?: string;
        selectedOuterColor?: string;
        showDisclosure?: 'on' | 'off';
    };
    rootNode?: any;
    rootNodeContent?: {
        renderer: ((context: ojSunburst.RootNodeContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    rotation?: 'off' | 'on';
    selection?: any[];
    selectionMode?: 'none' | 'single' | 'multiple';
    sizeLabel?: string;
    sorting?: 'on' | 'off';
    startAngle?: number;
    tooltip?: {
        renderer: ((context: ojSunburst.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    translations: {
        accessibleContainsControls?: string;
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
        stateLoaded?: string;
        stateLoading?: string;
        stateMaximized?: string;
        stateMinimized?: string;
        stateSelected?: string;
        stateUnselected?: string;
        stateVisible?: string;
        tooltipCollapse?: string;
        tooltipExpand?: string;
    };
    addEventListener<T extends keyof ojSunburstEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojSunburstEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSunburstSettableProperties<K, D>>(property: T): ojSunburst<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSunburstSettableProperties<K, D>>(property: T, value: ojSunburstSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSunburstSettableProperties<K, D>>): void;
    setProperties(properties: ojSunburstSettablePropertiesLenient<K, D>): void;
    getAutomation(): any;
    getContextByNode(node: Element): ojSunburst.NodeContext | null;
}
export namespace ojSunburst {
    interface ojBeforeCollapse<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeDrill<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojDrill<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
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
    type highlightModeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["highlightMode"]>;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends Node<K> | any> = dvtBaseComponent.trackResizeChanged<ojSunburstSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataContext = {
        color: string;
        label: string;
        selected: boolean;
        size: number;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K, D = any> = {
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        drilling?: 'inherit' | 'off' | 'on';
        id?: K;
        label?: string;
        labelDisplay?: 'auto' | 'horizontal' | 'off' | 'rotated';
        labelHalign?: 'center' | 'inner' | 'outer';
        labelStyle?: Partial<CSSStyleDeclaration>;
        nodes?: Array<Node<K>>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        radius?: number;
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: NodeShortDescContext<K, D>) => string));
        showDisclosure?: 'inherit' | 'off' | 'on';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        indexPath: number[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K, D> = {
        data: Node<K>;
        id: K;
        itemData: D;
        label: string;
        value: number;
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
        componentElement: Element;
        data: Node<K>;
        id: K;
        innerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        itemData: D;
        outerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D> = {
        color: string;
        componentElement: Element;
        data: Node<K>;
        id: K;
        itemData: D;
        label: string;
        parentElement: Element;
        radius: number;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRootNodeContentTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<RootNodeContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D>>;
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
    'highlightModeChanged': JetElementCustomEvent<ojSunburst<K, D>["highlightMode"]>;
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
    'trackResizeChanged': JetElementCustomEvent<ojSunburst<K, D>["trackResize"]>;
}
export interface ojSunburstSettableProperties<K, D extends ojSunburst.Node<K> | any> extends dvtBaseComponentSettableProperties {
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    animationUpdateColor?: string;
    as?: string;
    colorLabel?: string;
    data: DataProvider<K, D> | null;
    displayLevels?: number;
    drilling?: 'on' | 'off';
    expanded?: KeySet<K>;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightMode?: 'categories' | 'descendants';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverBehaviorDelay?: number;
    nodeDefaults?: {
        borderColor?: string;
        borderWidth?: number;
        hoverColor?: string;
        labelDisplay?: 'horizontal' | 'rotated' | 'off' | 'auto';
        labelHalign?: 'inner' | 'outer' | 'center';
        labelMinLength?: number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        selectedInnerColor?: string;
        selectedOuterColor?: string;
        showDisclosure?: 'on' | 'off';
    };
    rootNode?: any;
    rootNodeContent?: {
        renderer: ((context: ojSunburst.RootNodeContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    rotation?: 'off' | 'on';
    selection?: any[];
    selectionMode?: 'none' | 'single' | 'multiple';
    sizeLabel?: string;
    sorting?: 'on' | 'off';
    startAngle?: number;
    tooltip?: {
        renderer: ((context: ojSunburst.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    translations: {
        accessibleContainsControls?: string;
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
        stateLoaded?: string;
        stateLoading?: string;
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
export interface ojSunburstNode<K = any, D = any> extends dvtBaseComponent<ojSunburstNodeSettableProperties<K, D>> {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    label?: string;
    labelDisplay?: 'horizontal' | 'rotated' | 'off' | 'auto';
    labelHalign?: 'inner' | 'outer' | 'center';
    labelStyle?: Partial<CSSStyleDeclaration>;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    radius?: number;
    selectable?: 'off' | 'auto';
    shortDesc?: (string | ((context: ojSunburst.NodeShortDescContext<K, D>) => string));
    showDisclosure?: 'on' | 'off' | 'inherit';
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value: number;
    addEventListener<T extends keyof ojSunburstNodeEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojSunburstNodeEventMap<K, D>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSunburstNodeSettableProperties<K, D>>(property: T): ojSunburstNode<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSunburstNodeSettableProperties<K, D>>(property: T, value: ojSunburstNodeSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSunburstNodeSettableProperties<K, D>>): void;
    setProperties(properties: ojSunburstNodeSettablePropertiesLenient<K, D>): void;
}
export namespace ojSunburstNode {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHalignChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["labelHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type radiusChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["radius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type showDisclosureChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["showDisclosure"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["value"]>;
}
export interface ojSunburstNodeEventMap<K = any, D = any> extends dvtBaseComponentEventMap<ojSunburstNodeSettableProperties<K, D>> {
    'borderColorChanged': JetElementCustomEvent<ojSunburstNode<K, D>["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojSunburstNode<K, D>["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojSunburstNode<K, D>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojSunburstNode<K, D>["color"]>;
    'drillingChanged': JetElementCustomEvent<ojSunburstNode<K, D>["drilling"]>;
    'labelChanged': JetElementCustomEvent<ojSunburstNode<K, D>["label"]>;
    'labelDisplayChanged': JetElementCustomEvent<ojSunburstNode<K, D>["labelDisplay"]>;
    'labelHalignChanged': JetElementCustomEvent<ojSunburstNode<K, D>["labelHalign"]>;
    'labelStyleChanged': JetElementCustomEvent<ojSunburstNode<K, D>["labelStyle"]>;
    'patternChanged': JetElementCustomEvent<ojSunburstNode<K, D>["pattern"]>;
    'radiusChanged': JetElementCustomEvent<ojSunburstNode<K, D>["radius"]>;
    'selectableChanged': JetElementCustomEvent<ojSunburstNode<K, D>["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojSunburstNode<K, D>["shortDesc"]>;
    'showDisclosureChanged': JetElementCustomEvent<ojSunburstNode<K, D>["showDisclosure"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojSunburstNode<K, D>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojSunburstNode<K, D>["svgStyle"]>;
    'valueChanged': JetElementCustomEvent<ojSunburstNode<K, D>["value"]>;
}
export interface ojSunburstNodeSettableProperties<K = any, D = any> extends dvtBaseComponentSettableProperties {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    label?: string;
    labelDisplay?: 'horizontal' | 'rotated' | 'off' | 'auto';
    labelHalign?: 'inner' | 'outer' | 'center';
    labelStyle?: Partial<CSSStyleDeclaration>;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    radius?: number;
    selectable?: 'off' | 'auto';
    shortDesc?: (string | ((context: ojSunburst.NodeShortDescContext<K, D>) => string));
    showDisclosure?: 'on' | 'off' | 'inherit';
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value: number;
}
export interface ojSunburstNodeSettablePropertiesLenient<K = any, D = any> extends Partial<ojSunburstNodeSettableProperties<K, D>> {
    [key: string]: any;
}
export type SunburstElement<K, D extends ojSunburst.Node<K> | any> = ojSunburst<K, D>;
export type SunburstNodeElement<K = any, D = any> = ojSunburstNode<K, D>;
export namespace SunburstElement {
    interface ojBeforeCollapse<K, D> extends CustomEvent<{
        data: ojSunburst.Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeDrill<K, D> extends CustomEvent<{
        data: ojSunburst.Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K, D> extends CustomEvent<{
        data: ojSunburst.Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K, D> extends CustomEvent<{
        data: ojSunburst.Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojDrill<K, D> extends CustomEvent<{
        data: ojSunburst.Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K, D> extends CustomEvent<{
        data: ojSunburst.Node<K>;
        id: K;
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
    type animationDurationChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationUpdateColorChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["animationUpdateColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorLabelChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["colorLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayLevelsChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["displayLevels"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightModeChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["highlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeDefaultsChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["nodeDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootNodeChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["rootNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootNodeContentChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["rootNodeContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rotationChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["rotation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeLabelChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["sizeLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sortingChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["sorting"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startAngleChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["startAngle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends ojSunburst.Node<K> | any> = JetElementCustomEvent<ojSunburst<K, D>["touchResponse"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojSunburst.Node<K> | any> = dvtBaseComponent.trackResizeChanged<ojSunburstSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataContext = {
        color: string;
        label: string;
        selected: boolean;
        size: number;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K, D = any> = {
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        drilling?: 'inherit' | 'off' | 'on';
        id?: K;
        label?: string;
        labelDisplay?: 'auto' | 'horizontal' | 'off' | 'rotated';
        labelHalign?: 'center' | 'inner' | 'outer';
        labelStyle?: Partial<CSSStyleDeclaration>;
        nodes?: Array<ojSunburst.Node<K>>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        radius?: number;
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: ojSunburst.NodeShortDescContext<K, D>) => string));
        showDisclosure?: 'inherit' | 'off' | 'on';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        indexPath: number[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K, D> = {
        data: ojSunburst.Node<K>;
        id: K;
        itemData: D;
        label: string;
        value: number;
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
        componentElement: Element;
        data: ojSunburst.Node<K>;
        id: K;
        innerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        itemData: D;
        outerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D> = {
        color: string;
        componentElement: Element;
        data: ojSunburst.Node<K>;
        id: K;
        itemData: D;
        label: string;
        parentElement: Element;
        radius: number;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRootNodeContentTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<RootNodeContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D>>;
}
export namespace SunburstNodeElement {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHalignChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["labelHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type radiusChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["radius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type showDisclosureChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["showDisclosure"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any, D = any> = JetElementCustomEvent<ojSunburstNode<K, D>["value"]>;
}
export interface SunburstIntrinsicProps extends Partial<Readonly<ojSunburstSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeCollapse?: (value: ojSunburstEventMap<any, any>['ojBeforeCollapse']) => void;
    onojBeforeDrill?: (value: ojSunburstEventMap<any, any>['ojBeforeDrill']) => void;
    onojBeforeExpand?: (value: ojSunburstEventMap<any, any>['ojBeforeExpand']) => void;
    onojCollapse?: (value: ojSunburstEventMap<any, any>['ojCollapse']) => void;
    onojDrill?: (value: ojSunburstEventMap<any, any>['ojDrill']) => void;
    onojExpand?: (value: ojSunburstEventMap<any, any>['ojExpand']) => void;
    onojRotateInput?: (value: ojSunburstEventMap<any, any>['ojRotateInput']) => void;
    onanimationDurationChanged?: (value: ojSunburstEventMap<any, any>['animationDurationChanged']) => void;
    onanimationOnDataChangeChanged?: (value: ojSunburstEventMap<any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojSunburstEventMap<any, any>['animationOnDisplayChanged']) => void;
    onanimationUpdateColorChanged?: (value: ojSunburstEventMap<any, any>['animationUpdateColorChanged']) => void;
    onasChanged?: (value: ojSunburstEventMap<any, any>['asChanged']) => void;
    oncolorLabelChanged?: (value: ojSunburstEventMap<any, any>['colorLabelChanged']) => void;
    ondataChanged?: (value: ojSunburstEventMap<any, any>['dataChanged']) => void;
    ondisplayLevelsChanged?: (value: ojSunburstEventMap<any, any>['displayLevelsChanged']) => void;
    ondrillingChanged?: (value: ojSunburstEventMap<any, any>['drillingChanged']) => void;
    onexpandedChanged?: (value: ojSunburstEventMap<any, any>['expandedChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojSunburstEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: ojSunburstEventMap<any, any>['highlightMatchChanged']) => void;
    onhighlightModeChanged?: (value: ojSunburstEventMap<any, any>['highlightModeChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojSunburstEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojSunburstEventMap<any, any>['hoverBehaviorChanged']) => void;
    onhoverBehaviorDelayChanged?: (value: ojSunburstEventMap<any, any>['hoverBehaviorDelayChanged']) => void;
    onnodeDefaultsChanged?: (value: ojSunburstEventMap<any, any>['nodeDefaultsChanged']) => void;
    onrootNodeChanged?: (value: ojSunburstEventMap<any, any>['rootNodeChanged']) => void;
    onrootNodeContentChanged?: (value: ojSunburstEventMap<any, any>['rootNodeContentChanged']) => void;
    onrotationChanged?: (value: ojSunburstEventMap<any, any>['rotationChanged']) => void;
    onselectionChanged?: (value: ojSunburstEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojSunburstEventMap<any, any>['selectionModeChanged']) => void;
    onsizeLabelChanged?: (value: ojSunburstEventMap<any, any>['sizeLabelChanged']) => void;
    onsortingChanged?: (value: ojSunburstEventMap<any, any>['sortingChanged']) => void;
    onstartAngleChanged?: (value: ojSunburstEventMap<any, any>['startAngleChanged']) => void;
    ontooltipChanged?: (value: ojSunburstEventMap<any, any>['tooltipChanged']) => void;
    ontouchResponseChanged?: (value: ojSunburstEventMap<any, any>['touchResponseChanged']) => void;
    ontrackResizeChanged?: (value: ojSunburstEventMap<any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface SunburstNodeIntrinsicProps extends Partial<Readonly<ojSunburstNodeSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojSunburstNodeEventMap<any, any>['borderColorChanged']) => void;
    onborderWidthChanged?: (value: ojSunburstNodeEventMap<any, any>['borderWidthChanged']) => void;
    oncategoriesChanged?: (value: ojSunburstNodeEventMap<any, any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojSunburstNodeEventMap<any, any>['colorChanged']) => void;
    ondrillingChanged?: (value: ojSunburstNodeEventMap<any, any>['drillingChanged']) => void;
    onlabelChanged?: (value: ojSunburstNodeEventMap<any, any>['labelChanged']) => void;
    onlabelDisplayChanged?: (value: ojSunburstNodeEventMap<any, any>['labelDisplayChanged']) => void;
    onlabelHalignChanged?: (value: ojSunburstNodeEventMap<any, any>['labelHalignChanged']) => void;
    onlabelStyleChanged?: (value: ojSunburstNodeEventMap<any, any>['labelStyleChanged']) => void;
    onpatternChanged?: (value: ojSunburstNodeEventMap<any, any>['patternChanged']) => void;
    onradiusChanged?: (value: ojSunburstNodeEventMap<any, any>['radiusChanged']) => void;
    onselectableChanged?: (value: ojSunburstNodeEventMap<any, any>['selectableChanged']) => void;
    onshortDescChanged?: (value: ojSunburstNodeEventMap<any, any>['shortDescChanged']) => void;
    onshowDisclosureChanged?: (value: ojSunburstNodeEventMap<any, any>['showDisclosureChanged']) => void;
    onsvgClassNameChanged?: (value: ojSunburstNodeEventMap<any, any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojSunburstNodeEventMap<any, any>['svgStyleChanged']) => void;
    onvalueChanged?: (value: ojSunburstNodeEventMap<any, any>['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-sunburst": SunburstIntrinsicProps;
            "oj-sunburst-node": SunburstNodeIntrinsicProps;
        }
    }
}
