import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojNBox<K, D extends ojNBox.Node<K> | any> extends dvtBaseComponent<ojNBoxSettableProperties<K, D>> {
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    as?: string;
    cellContent?: 'counts' | 'auto';
    cellMaximize?: 'off' | 'on';
    cells?: Promise<ojNBox.Cell[]> | null;
    columns: Promise<ojNBox.Column[]> | null;
    columnsTitle?: string;
    countLabel?: ((context: ojNBox.CountLabelContext) => (string | null));
    data: DataProvider<K, D> | null;
    groupAttributes?: 'color' | 'indicatorColor' | 'indicatorIconColor' | 'indicatorIconPattern' | 'indicatorIconShape';
    groupBehavior?: 'acrossCells' | 'none' | 'withinCell';
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    labelTruncation?: 'ifRequired' | 'on';
    maximizedColumn?: string;
    maximizedRow?: string;
    otherColor?: string;
    otherThreshold?: number;
    rows: Promise<ojNBox.Row[]> | null;
    rowsTitle?: string;
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    styleDefaults?: {
        animationDuration?: number;
        cellDefaults?: {
            labelHalign?: 'center' | 'end' | 'start';
            labelStyle?: Partial<CSSStyleDeclaration>;
            maximizedSvgStyle?: Partial<CSSStyleDeclaration>;
            minimizedSvgStyle?: Partial<CSSStyleDeclaration>;
            showCount?: 'on' | 'off' | 'auto';
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        columnLabelStyle?: Partial<CSSStyleDeclaration>;
        columnsTitleStyle?: Partial<CSSStyleDeclaration>;
        hoverBehaviorDelay?: number;
        nodeDefaults?: {
            borderColor?: string;
            borderWidth?: number;
            color?: string;
            iconDefaults?: {
                background?: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'blue' | 'slate' | 'pink' | 'mauve' | 'purple' | 'lilac' | 'gray' | string;
                borderColor?: string;
                borderRadius?: string;
                borderWidth?: number;
                color?: string;
                height?: number;
                opacity?: number;
                pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' |
                   'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star' | string;
                source?: string;
                width?: number;
            };
            indicatorColor?: string;
            indicatorIconDefaults?: {
                borderColor?: string;
                borderRadius?: string;
                borderWidth?: number;
                color?: string;
                height?: number;
                opacity?: number;
                pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' |
                   'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star' | string;
                source?: string;
                width?: number;
            };
            labelStyle?: Partial<CSSStyleDeclaration>;
            secondaryLabelStyle?: Partial<CSSStyleDeclaration>;
        };
        rowLabelStyle?: Partial<CSSStyleDeclaration>;
        rowsTitleStyle?: Partial<CSSStyleDeclaration>;
    };
    tooltip?: {
        renderer: ((context: ojNBox.TooltipContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    touchResponse?: 'touchStart' | 'auto';
    translations: {
        accessibleContainsControls?: string;
        componentName?: string;
        highlightedCount?: string;
        labelAdditionalData?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelGroup?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelOther?: string;
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
    };
    addEventListener<T extends keyof ojNBoxEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojNBoxEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojNBoxSettableProperties<K, D>>(property: T): ojNBox<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojNBoxSettableProperties<K, D>>(property: T, value: ojNBoxSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojNBoxSettableProperties<K, D>>): void;
    setProperties(properties: ojNBoxSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojNBox.NodeContext<K> | ojNBox.CellContext | ojNBox.DialogContext | ojNBox.GroupNodeContext | null;
}
export namespace ojNBox {
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellContentChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cellContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellMaximizeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cellMaximize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cells"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["columns"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsTitleChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["columnsTitle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type countLabelChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["countLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupAttributesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["groupAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupBehaviorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["groupBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelTruncationChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["labelTruncation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximizedColumnChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["maximizedColumn"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximizedRowChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["maximizedRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherColorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["otherColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherThresholdChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["otherThreshold"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["rows"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowsTitleChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["rowsTitle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["touchResponse"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends Node<K> | any> = dvtBaseComponent.trackResizeChanged<ojNBoxSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type Cell = {
        column: string;
        label?: string;
        labelHalign?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        maximizedSvgClassName?: string;
        maximizedSvgStyle?: Partial<CSSStyleDeclaration>;
        minimizedSvgClassName?: string;
        minimizedSvgStyle?: Partial<CSSStyleDeclaration>;
        row: string;
        shortDesc?: string;
        showCount?: 'on' | 'off' | 'auto';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CellContext = {
        column: string;
        row: string;
        subId: 'oj-nbox-cell';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Column = {
        id: string;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CountLabelContext = {
        column: string;
        highlightedNodeCount: number;
        nodeCount: number;
        row: string;
        totalNodeCount: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DialogContext = {
        subId: 'oj-nbox-dialog';
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupNodeContext = {
        column: string;
        groupCategory: string;
        row: string;
        subId: 'oj-nbox-group-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K> = {
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        column: string;
        groupCategory?: string;
        icon?: {
            background?: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'mauve' | 'purple';
            borderColor?: string;
            borderRadius?: string;
            borderWidth?: number;
            color?: string;
            height?: number;
            initials?: string;
            opacity?: number;
            pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
               'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            source?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        id?: K;
        indicatorColor?: string;
        indicatorIcon?: {
            borderColor?: string;
            borderRadius?: string;
            borderWidth?: number;
            color?: string;
            height?: number;
            opacity?: number;
            pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
               'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            source?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        label?: string;
        row: string;
        secondaryLabel?: string;
        shortDesc?: (string | ((context: NodeShortDescContext<K>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        xPercentage?: number;
        yPercentage?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        id: K;
        subId: 'oj-nbox-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K> = {
        column: string;
        id: K;
        label: string;
        row: string;
        secondaryLabel: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Row = {
        id: string;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K> = {
        color: string;
        column: string;
        componentElement: Element;
        id: K;
        indicatorColor: string;
        label: string;
        parentElement: Element;
        row: string;
        secondaryLabel: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K>>;
}
export interface ojNBoxEventMap<K, D extends ojNBox.Node<K> | any> extends dvtBaseComponentEventMap<ojNBoxSettableProperties<K, D>> {
    'animationOnDataChangeChanged': JetElementCustomEvent<ojNBox<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojNBox<K, D>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojNBox<K, D>["as"]>;
    'cellContentChanged': JetElementCustomEvent<ojNBox<K, D>["cellContent"]>;
    'cellMaximizeChanged': JetElementCustomEvent<ojNBox<K, D>["cellMaximize"]>;
    'cellsChanged': JetElementCustomEvent<ojNBox<K, D>["cells"]>;
    'columnsChanged': JetElementCustomEvent<ojNBox<K, D>["columns"]>;
    'columnsTitleChanged': JetElementCustomEvent<ojNBox<K, D>["columnsTitle"]>;
    'countLabelChanged': JetElementCustomEvent<ojNBox<K, D>["countLabel"]>;
    'dataChanged': JetElementCustomEvent<ojNBox<K, D>["data"]>;
    'groupAttributesChanged': JetElementCustomEvent<ojNBox<K, D>["groupAttributes"]>;
    'groupBehaviorChanged': JetElementCustomEvent<ojNBox<K, D>["groupBehavior"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojNBox<K, D>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojNBox<K, D>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojNBox<K, D>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojNBox<K, D>["hoverBehavior"]>;
    'labelTruncationChanged': JetElementCustomEvent<ojNBox<K, D>["labelTruncation"]>;
    'maximizedColumnChanged': JetElementCustomEvent<ojNBox<K, D>["maximizedColumn"]>;
    'maximizedRowChanged': JetElementCustomEvent<ojNBox<K, D>["maximizedRow"]>;
    'otherColorChanged': JetElementCustomEvent<ojNBox<K, D>["otherColor"]>;
    'otherThresholdChanged': JetElementCustomEvent<ojNBox<K, D>["otherThreshold"]>;
    'rowsChanged': JetElementCustomEvent<ojNBox<K, D>["rows"]>;
    'rowsTitleChanged': JetElementCustomEvent<ojNBox<K, D>["rowsTitle"]>;
    'selectionChanged': JetElementCustomEvent<ojNBox<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojNBox<K, D>["selectionMode"]>;
    'styleDefaultsChanged': JetElementCustomEvent<ojNBox<K, D>["styleDefaults"]>;
    'tooltipChanged': JetElementCustomEvent<ojNBox<K, D>["tooltip"]>;
    'touchResponseChanged': JetElementCustomEvent<ojNBox<K, D>["touchResponse"]>;
    'trackResizeChanged': JetElementCustomEvent<ojNBox<K, D>["trackResize"]>;
}
export interface ojNBoxSettableProperties<K, D extends ojNBox.Node<K> | any> extends dvtBaseComponentSettableProperties {
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    as?: string;
    cellContent?: 'counts' | 'auto';
    cellMaximize?: 'off' | 'on';
    cells?: ojNBox.Cell[] | Promise<ojNBox.Cell[]> | null;
    columns: ojNBox.Column[] | Promise<ojNBox.Column[]> | null;
    columnsTitle?: string;
    countLabel?: ((context: ojNBox.CountLabelContext) => (string | null));
    data: DataProvider<K, D> | null;
    groupAttributes?: 'color' | 'indicatorColor' | 'indicatorIconColor' | 'indicatorIconPattern' | 'indicatorIconShape';
    groupBehavior?: 'acrossCells' | 'none' | 'withinCell';
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    labelTruncation?: 'ifRequired' | 'on';
    maximizedColumn?: string;
    maximizedRow?: string;
    otherColor?: string;
    otherThreshold?: number;
    rows: ojNBox.Row[] | Promise<ojNBox.Row[]> | null;
    rowsTitle?: string;
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    styleDefaults?: {
        animationDuration?: number;
        cellDefaults?: {
            labelHalign?: 'center' | 'end' | 'start';
            labelStyle?: Partial<CSSStyleDeclaration>;
            maximizedSvgStyle?: Partial<CSSStyleDeclaration>;
            minimizedSvgStyle?: Partial<CSSStyleDeclaration>;
            showCount?: 'on' | 'off' | 'auto';
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        columnLabelStyle?: Partial<CSSStyleDeclaration>;
        columnsTitleStyle?: Partial<CSSStyleDeclaration>;
        hoverBehaviorDelay?: number;
        nodeDefaults?: {
            borderColor?: string;
            borderWidth?: number;
            color?: string;
            iconDefaults?: {
                background?: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'blue' | 'slate' | 'pink' | 'mauve' | 'purple' | 'lilac' | 'gray' | string;
                borderColor?: string;
                borderRadius?: string;
                borderWidth?: number;
                color?: string;
                height?: number;
                opacity?: number;
                pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' |
                   'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star' | string;
                source?: string;
                width?: number;
            };
            indicatorColor?: string;
            indicatorIconDefaults?: {
                borderColor?: string;
                borderRadius?: string;
                borderWidth?: number;
                color?: string;
                height?: number;
                opacity?: number;
                pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' |
                   'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star' | string;
                source?: string;
                width?: number;
            };
            labelStyle?: Partial<CSSStyleDeclaration>;
            secondaryLabelStyle?: Partial<CSSStyleDeclaration>;
        };
        rowLabelStyle?: Partial<CSSStyleDeclaration>;
        rowsTitleStyle?: Partial<CSSStyleDeclaration>;
    };
    tooltip?: {
        renderer: ((context: ojNBox.TooltipContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    touchResponse?: 'touchStart' | 'auto';
    translations: {
        accessibleContainsControls?: string;
        componentName?: string;
        highlightedCount?: string;
        labelAdditionalData?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelGroup?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelOther?: string;
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
    };
}
export interface ojNBoxSettablePropertiesLenient<K, D extends ojNBox.Node<K> | any> extends Partial<ojNBoxSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojNBoxNode<K = any> extends dvtBaseComponent<ojNBoxNodeSettableProperties<K>> {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    column: string;
    groupCategory?: string;
    icon?: {
        background?: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'blue' | 'slate' | 'mauve' | 'pink' | 'purple' | 'lilac' | 'gray' | string;
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: number;
        color?: string;
        height?: number | null;
        initials?: string;
        opacity?: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'mallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number | null;
    };
    indicatorColor?: string;
    indicatorIcon?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: number;
        color?: string;
        height?: number | null;
        opacity?: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string | null;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration> | null;
        width?: number | null;
    };
    label?: string;
    row: string;
    secondaryLabel?: string;
    shortDesc?: (string | ((context: ojNBox.NodeShortDescContext<K>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration> | null;
    xPercentage?: number | null;
    yPercentage?: number | null;
    addEventListener<T extends keyof ojNBoxNodeEventMap<K>>(type: T, listener: (this: HTMLElement, ev: ojNBoxNodeEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojNBoxNodeSettableProperties<K>>(property: T): ojNBoxNode<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojNBoxNodeSettableProperties<K>>(property: T, value: ojNBoxNodeSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojNBoxNodeSettableProperties<K>>): void;
    setProperties(properties: ojNBoxNodeSettablePropertiesLenient<K>): void;
}
export namespace ojNBoxNode {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["column"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupCategoryChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["groupCategory"]>;
    // tslint:disable-next-line interface-over-type-literal
    type iconChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["icon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorColorChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["indicatorColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorIconChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["indicatorIcon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["row"]>;
    // tslint:disable-next-line interface-over-type-literal
    type secondaryLabelChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["secondaryLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xPercentageChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["xPercentage"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yPercentageChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["yPercentage"]>;
}
export interface ojNBoxNodeEventMap<K = any> extends dvtBaseComponentEventMap<ojNBoxNodeSettableProperties<K>> {
    'borderColorChanged': JetElementCustomEvent<ojNBoxNode<K>["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojNBoxNode<K>["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojNBoxNode<K>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojNBoxNode<K>["color"]>;
    'columnChanged': JetElementCustomEvent<ojNBoxNode<K>["column"]>;
    'groupCategoryChanged': JetElementCustomEvent<ojNBoxNode<K>["groupCategory"]>;
    'iconChanged': JetElementCustomEvent<ojNBoxNode<K>["icon"]>;
    'indicatorColorChanged': JetElementCustomEvent<ojNBoxNode<K>["indicatorColor"]>;
    'indicatorIconChanged': JetElementCustomEvent<ojNBoxNode<K>["indicatorIcon"]>;
    'labelChanged': JetElementCustomEvent<ojNBoxNode<K>["label"]>;
    'rowChanged': JetElementCustomEvent<ojNBoxNode<K>["row"]>;
    'secondaryLabelChanged': JetElementCustomEvent<ojNBoxNode<K>["secondaryLabel"]>;
    'shortDescChanged': JetElementCustomEvent<ojNBoxNode<K>["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojNBoxNode<K>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojNBoxNode<K>["svgStyle"]>;
    'xPercentageChanged': JetElementCustomEvent<ojNBoxNode<K>["xPercentage"]>;
    'yPercentageChanged': JetElementCustomEvent<ojNBoxNode<K>["yPercentage"]>;
}
export interface ojNBoxNodeSettableProperties<K = any> extends dvtBaseComponentSettableProperties {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    column: string;
    groupCategory?: string;
    icon?: {
        background?: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'blue' | 'slate' | 'mauve' | 'pink' | 'purple' | 'lilac' | 'gray' | string;
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: number;
        color?: string;
        height?: number | null;
        initials?: string;
        opacity?: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'mallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number | null;
    };
    indicatorColor?: string;
    indicatorIcon?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: number;
        color?: string;
        height?: number | null;
        opacity?: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string | null;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration> | null;
        width?: number | null;
    };
    label?: string;
    row: string;
    secondaryLabel?: string;
    shortDesc?: (string | ((context: ojNBox.NodeShortDescContext<K>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration> | null;
    xPercentage?: number | null;
    yPercentage?: number | null;
}
export interface ojNBoxNodeSettablePropertiesLenient<K = any> extends Partial<ojNBoxNodeSettableProperties<K>> {
    [key: string]: any;
}
export type NBoxElement<K, D extends ojNBox.Node<K> | any> = ojNBox<K, D>;
export type NBoxNodeElement<K = any> = ojNBoxNode<K>;
export namespace NBoxElement {
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellContentChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cellContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellMaximizeChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cellMaximize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellsChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cells"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["columns"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsTitleChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["columnsTitle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type countLabelChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["countLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupAttributesChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["groupAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupBehaviorChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["groupBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelTruncationChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["labelTruncation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximizedColumnChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["maximizedColumn"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximizedRowChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["maximizedRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherColorChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["otherColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherThresholdChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["otherThreshold"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowsChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["rows"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowsTitleChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["rowsTitle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends ojNBox.Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["touchResponse"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojNBox.Node<K> | any> = dvtBaseComponent.trackResizeChanged<ojNBoxSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type Cell = {
        column: string;
        label?: string;
        labelHalign?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        maximizedSvgClassName?: string;
        maximizedSvgStyle?: Partial<CSSStyleDeclaration>;
        minimizedSvgClassName?: string;
        minimizedSvgStyle?: Partial<CSSStyleDeclaration>;
        row: string;
        shortDesc?: string;
        showCount?: 'on' | 'off' | 'auto';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CellContext = {
        column: string;
        row: string;
        subId: 'oj-nbox-cell';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Column = {
        id: string;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CountLabelContext = {
        column: string;
        highlightedNodeCount: number;
        nodeCount: number;
        row: string;
        totalNodeCount: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DialogContext = {
        subId: 'oj-nbox-dialog';
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupNodeContext = {
        column: string;
        groupCategory: string;
        row: string;
        subId: 'oj-nbox-group-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K> = {
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        column: string;
        groupCategory?: string;
        icon?: {
            background?: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'mauve' | 'purple';
            borderColor?: string;
            borderRadius?: string;
            borderWidth?: number;
            color?: string;
            height?: number;
            initials?: string;
            opacity?: number;
            pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
               'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            source?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        id?: K;
        indicatorColor?: string;
        indicatorIcon?: {
            borderColor?: string;
            borderRadius?: string;
            borderWidth?: number;
            color?: string;
            height?: number;
            opacity?: number;
            pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
               'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            source?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        label?: string;
        row: string;
        secondaryLabel?: string;
        shortDesc?: (string | ((context: ojNBox.NodeShortDescContext<K>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        xPercentage?: number;
        yPercentage?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        id: K;
        subId: 'oj-nbox-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K> = {
        column: string;
        id: K;
        label: string;
        row: string;
        secondaryLabel: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Row = {
        id: string;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K> = {
        color: string;
        column: string;
        componentElement: Element;
        id: K;
        indicatorColor: string;
        label: string;
        parentElement: Element;
        row: string;
        secondaryLabel: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K>>;
}
export namespace NBoxNodeElement {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["column"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupCategoryChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["groupCategory"]>;
    // tslint:disable-next-line interface-over-type-literal
    type iconChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["icon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorColorChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["indicatorColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorIconChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["indicatorIcon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["row"]>;
    // tslint:disable-next-line interface-over-type-literal
    type secondaryLabelChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["secondaryLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xPercentageChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["xPercentage"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yPercentageChanged<K = any> = JetElementCustomEvent<ojNBoxNode<K>["yPercentage"]>;
}
export interface NBoxIntrinsicProps extends Partial<Readonly<ojNBoxSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onanimationOnDataChangeChanged?: (value: ojNBoxEventMap<any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojNBoxEventMap<any, any>['animationOnDisplayChanged']) => void;
    onasChanged?: (value: ojNBoxEventMap<any, any>['asChanged']) => void;
    oncellContentChanged?: (value: ojNBoxEventMap<any, any>['cellContentChanged']) => void;
    oncellMaximizeChanged?: (value: ojNBoxEventMap<any, any>['cellMaximizeChanged']) => void;
    oncellsChanged?: (value: ojNBoxEventMap<any, any>['cellsChanged']) => void;
    oncolumnsChanged?: (value: ojNBoxEventMap<any, any>['columnsChanged']) => void;
    oncolumnsTitleChanged?: (value: ojNBoxEventMap<any, any>['columnsTitleChanged']) => void;
    oncountLabelChanged?: (value: ojNBoxEventMap<any, any>['countLabelChanged']) => void;
    ondataChanged?: (value: ojNBoxEventMap<any, any>['dataChanged']) => void;
    ongroupAttributesChanged?: (value: ojNBoxEventMap<any, any>['groupAttributesChanged']) => void;
    ongroupBehaviorChanged?: (value: ojNBoxEventMap<any, any>['groupBehaviorChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojNBoxEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: ojNBoxEventMap<any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojNBoxEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojNBoxEventMap<any, any>['hoverBehaviorChanged']) => void;
    onlabelTruncationChanged?: (value: ojNBoxEventMap<any, any>['labelTruncationChanged']) => void;
    onmaximizedColumnChanged?: (value: ojNBoxEventMap<any, any>['maximizedColumnChanged']) => void;
    onmaximizedRowChanged?: (value: ojNBoxEventMap<any, any>['maximizedRowChanged']) => void;
    onotherColorChanged?: (value: ojNBoxEventMap<any, any>['otherColorChanged']) => void;
    onotherThresholdChanged?: (value: ojNBoxEventMap<any, any>['otherThresholdChanged']) => void;
    onrowsChanged?: (value: ojNBoxEventMap<any, any>['rowsChanged']) => void;
    onrowsTitleChanged?: (value: ojNBoxEventMap<any, any>['rowsTitleChanged']) => void;
    onselectionChanged?: (value: ojNBoxEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojNBoxEventMap<any, any>['selectionModeChanged']) => void;
    onstyleDefaultsChanged?: (value: ojNBoxEventMap<any, any>['styleDefaultsChanged']) => void;
    ontooltipChanged?: (value: ojNBoxEventMap<any, any>['tooltipChanged']) => void;
    ontouchResponseChanged?: (value: ojNBoxEventMap<any, any>['touchResponseChanged']) => void;
    ontrackResizeChanged?: (value: ojNBoxEventMap<any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface NBoxNodeIntrinsicProps extends Partial<Readonly<ojNBoxNodeSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojNBoxNodeEventMap<any>['borderColorChanged']) => void;
    onborderWidthChanged?: (value: ojNBoxNodeEventMap<any>['borderWidthChanged']) => void;
    oncategoriesChanged?: (value: ojNBoxNodeEventMap<any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojNBoxNodeEventMap<any>['colorChanged']) => void;
    oncolumnChanged?: (value: ojNBoxNodeEventMap<any>['columnChanged']) => void;
    ongroupCategoryChanged?: (value: ojNBoxNodeEventMap<any>['groupCategoryChanged']) => void;
    oniconChanged?: (value: ojNBoxNodeEventMap<any>['iconChanged']) => void;
    onindicatorColorChanged?: (value: ojNBoxNodeEventMap<any>['indicatorColorChanged']) => void;
    onindicatorIconChanged?: (value: ojNBoxNodeEventMap<any>['indicatorIconChanged']) => void;
    onlabelChanged?: (value: ojNBoxNodeEventMap<any>['labelChanged']) => void;
    onrowChanged?: (value: ojNBoxNodeEventMap<any>['rowChanged']) => void;
    onsecondaryLabelChanged?: (value: ojNBoxNodeEventMap<any>['secondaryLabelChanged']) => void;
    onshortDescChanged?: (value: ojNBoxNodeEventMap<any>['shortDescChanged']) => void;
    onsvgClassNameChanged?: (value: ojNBoxNodeEventMap<any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojNBoxNodeEventMap<any>['svgStyleChanged']) => void;
    onxPercentageChanged?: (value: ojNBoxNodeEventMap<any>['xPercentageChanged']) => void;
    onyPercentageChanged?: (value: ojNBoxNodeEventMap<any>['yPercentageChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-n-box": NBoxIntrinsicProps;
            "oj-n-box-node": NBoxNodeIntrinsicProps;
        }
    }
}
