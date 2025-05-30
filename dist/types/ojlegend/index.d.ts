import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojLegend<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> extends dvtBaseComponent<ojLegendSettableProperties<K, D>> {
    /** @deprecated since 6.2.0 - Set the alias directly on the template element using the data-oj-as attribute instead. */
    as?: string;
    data: DataProvider<K, D> | null;
    drilling?: 'on' | 'off';
    /** @deprecated since 16.0.0 - Collapsible legend sections are not recommended in the Redwood theme. */
    expanded?: KeySet<K> | null;
    halign?: 'center' | 'end' | 'start';
    hiddenCategories?: string[];
    hideAndShowBehavior?: 'on' | 'off';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    hoverBehaviorDelay?: number;
    orientation?: 'horizontal' | 'vertical';
    /** @deprecated since 12.1.0 - Setting scrolling to off is not supported in the Redwood theme and it is not recommended. */
    scrolling?: 'off' | 'asNeeded';
    sectionTitleHalign?: 'center' | 'end' | 'start';
    sectionTitleStyle?: Partial<CSSStyleDeclaration>;
    symbolHeight?: number;
    symbolWidth?: number;
    textStyle?: Partial<CSSStyleDeclaration>;
    /** @deprecated since 15.0.0 - This is no longer needed due to performance enhancements. The default behavior will be used. */
    trackResize: 'on' | 'off';
    valign?: 'middle' | 'bottom' | 'top';
    translations: {
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        accessibleContainsControls?: string;
        componentName?: string;
        labelAndValue?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelClearSelection?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelInvalidData?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelNoData?: string;
        stateCollapsed?: string;
        stateDrillable?: string;
        stateExpanded?: string;
        stateHidden?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateIsolated?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateMaximized?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateMinimized?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateSelected?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateUnselected?: string;
        stateVisible?: string;
        tooltipCollapse?: string;
        tooltipExpand?: string;
    };
    addEventListener<T extends keyof ojLegendEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojLegendEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojLegendSettableProperties<K, D>>(property: T): ojLegend<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojLegendSettableProperties<K, D>>(property: T, value: ojLegendSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojLegendSettableProperties<K, D>>): void;
    setProperties(properties: ojLegendSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojLegend.NodeContext | null;
    getPreferredSize(width: number, height: number): ojLegend.PreferredSize | null;
}
export namespace ojLegend {
    interface ojDrill extends CustomEvent<{
        id: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type halignChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["halign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hideAndShowBehaviorChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hideAndShowBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollingChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["scrolling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sectionTitleHalignChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["sectionTitleHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sectionTitleStyleChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["sectionTitleStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type symbolHeightChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["symbolHeight"]>;
    // tslint:disable-next-line interface-over-type-literal
    type symbolWidthChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["symbolWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textStyleChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["textStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["trackResize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valignChanged<K, D extends Item<K> | Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["valign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Item<K> = {
        borderColor?: string;
        categories?: string[];
        /** @deprecated since 14.1.0 - Use hidden-categories attribute of oj-legend instead. */
        categoryVisibility?: 'hidden' | 'visible';
        color?: string;
        drilling?: 'off' | 'on' | 'inherit';
        id?: K;
        lineStyle?: 'dashed' | 'dotted' | 'solid';
        lineWidth?: number;
        markerColor?: string;
        markerShape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        markerSvgClassName?: string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        markerSvgStyle?: Partial<CSSStyleDeclaration>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shortDesc?: string;
        source?: string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        svgClassName?: string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        svgStyle?: Partial<CSSStyleDeclaration>;
        symbolType?: 'image' | 'line' | 'lineWithMarker' | 'marker';
        text: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        /** @deprecated since 16.0.0 - The componentElement property is deprecated. This shouldn't be needed, as the component template with access to this context is unique to the component. */
        componentElement: Element;
        data: D;
        index: number;
        key: K;
        parentData: D[];
        parentKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        itemIndex: number;
        sectionIndexPath: number[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PreferredSize = {
        height: number;
        width: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Section<K> = {
        /** @deprecated since 16.0.0 - Collapsible legend sections are not recommended in the Redwood theme. */
        collapsible?: 'on' | 'off';
        /** @deprecated since 14.1.0 - Applications should use the expanded API on oj-legend instead. */
        expanded?: 'off' | 'on';
        id?: K;
        items?: Array<Item<K>>;
        /** @deprecated since 18.0.0 - Use of nested legend sections is not recommended in Redwood theme. As such, this attribute is deprecated. */
        sections?: Array<Section<K>>;
        title?: string;
        /** @deprecated since 15.1.0 - Individual section title alignment is no longer supported. Use section-title-halign in oj-legend to align all section titles. */
        titleHalign?: 'center' | 'end' | 'start';
        /** @deprecated since 15.1.0 - Individual section title style is no longer supported. Use section-title-style in oj-legend to style all section titles. */
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SectionTemplateContext<K = any, D = any> = {
        /** @deprecated since 16.0.0 - The componentElement property is deprecated. This shouldn't be needed, as the component template with access to this context is unique to the component. */
        componentElement: Element;
        data: D;
        index: number;
        key: K;
        parentData: D[];
        parentKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderSectionTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<SectionTemplateContext<K, D>>;
}
export interface ojLegendEventMap<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> extends dvtBaseComponentEventMap<ojLegendSettableProperties<K, D>> {
    'ojDrill': ojLegend.ojDrill;
    'asChanged': JetElementCustomEvent<ojLegend<K, D>["as"]>;
    'dataChanged': JetElementCustomEvent<ojLegend<K, D>["data"]>;
    'drillingChanged': JetElementCustomEvent<ojLegend<K, D>["drilling"]>;
    'expandedChanged': JetElementCustomEvent<ojLegend<K, D>["expanded"]>;
    'halignChanged': JetElementCustomEvent<ojLegend<K, D>["halign"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojLegend<K, D>["hiddenCategories"]>;
    'hideAndShowBehaviorChanged': JetElementCustomEvent<ojLegend<K, D>["hideAndShowBehavior"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojLegend<K, D>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojLegend<K, D>["hoverBehavior"]>;
    'hoverBehaviorDelayChanged': JetElementCustomEvent<ojLegend<K, D>["hoverBehaviorDelay"]>;
    'orientationChanged': JetElementCustomEvent<ojLegend<K, D>["orientation"]>;
    'scrollingChanged': JetElementCustomEvent<ojLegend<K, D>["scrolling"]>;
    'sectionTitleHalignChanged': JetElementCustomEvent<ojLegend<K, D>["sectionTitleHalign"]>;
    'sectionTitleStyleChanged': JetElementCustomEvent<ojLegend<K, D>["sectionTitleStyle"]>;
    'symbolHeightChanged': JetElementCustomEvent<ojLegend<K, D>["symbolHeight"]>;
    'symbolWidthChanged': JetElementCustomEvent<ojLegend<K, D>["symbolWidth"]>;
    'textStyleChanged': JetElementCustomEvent<ojLegend<K, D>["textStyle"]>;
    'trackResizeChanged': JetElementCustomEvent<ojLegend<K, D>["trackResize"]>;
    'valignChanged': JetElementCustomEvent<ojLegend<K, D>["valign"]>;
}
export interface ojLegendSettableProperties<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> extends dvtBaseComponentSettableProperties {
    /** @deprecated since 6.2.0 - Set the alias directly on the template element using the data-oj-as attribute instead. */
    as?: string;
    data: DataProvider<K, D> | null;
    drilling?: 'on' | 'off';
    /** @deprecated since 16.0.0 - Collapsible legend sections are not recommended in the Redwood theme. */
    expanded?: KeySet<K> | null;
    halign?: 'center' | 'end' | 'start';
    hiddenCategories?: string[];
    hideAndShowBehavior?: 'on' | 'off';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    hoverBehaviorDelay?: number;
    orientation?: 'horizontal' | 'vertical';
    /** @deprecated since 12.1.0 - Setting scrolling to off is not supported in the Redwood theme and it is not recommended. */
    scrolling?: 'off' | 'asNeeded';
    sectionTitleHalign?: 'center' | 'end' | 'start';
    sectionTitleStyle?: Partial<CSSStyleDeclaration>;
    symbolHeight?: number;
    symbolWidth?: number;
    textStyle?: Partial<CSSStyleDeclaration>;
    /** @deprecated since 15.0.0 - This is no longer needed due to performance enhancements. The default behavior will be used. */
    trackResize: 'on' | 'off';
    valign?: 'middle' | 'bottom' | 'top';
    translations: {
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        accessibleContainsControls?: string;
        componentName?: string;
        labelAndValue?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelClearSelection?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelInvalidData?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        labelNoData?: string;
        stateCollapsed?: string;
        stateDrillable?: string;
        stateExpanded?: string;
        stateHidden?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateIsolated?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateMaximized?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateMinimized?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateSelected?: string;
        /** @deprecated since 15.0.0 - This resource is not used by oj-legend. */
        stateUnselected?: string;
        stateVisible?: string;
        tooltipCollapse?: string;
        tooltipExpand?: string;
    };
}
export interface ojLegendSettablePropertiesLenient<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> extends Partial<ojLegendSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojLegendItem extends JetElement<ojLegendItemSettableProperties> {
    borderColor?: string;
    categories?: string[];
    /** @deprecated since 14.1.0 - Use hidden-categories on oj-legend instead */
    categoryVisibility?: 'hidden' | 'visible';
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    lineStyle?: 'dotted' | 'dashed' | 'solid';
    lineWidth?: number;
    markerColor?: string;
    markerShape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    markerSvgClassName?: string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    markerSvgStyle?: Partial<CSSStyleDeclaration>;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    shortDesc?: string;
    source?: string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    svgClassName?: string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    svgStyle?: Partial<CSSStyleDeclaration>;
    symbolType?: 'line' | 'lineWithMarker' | 'image' | 'marker';
    text: string;
    addEventListener<T extends keyof ojLegendItemEventMap>(type: T, listener: (this: HTMLElement, ev: ojLegendItemEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojLegendItemSettableProperties>(property: T): ojLegendItem[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojLegendItemSettableProperties>(property: T, value: ojLegendItemSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojLegendItemSettableProperties>): void;
    setProperties(properties: ojLegendItemSettablePropertiesLenient): void;
}
export namespace ojLegendItem {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojLegendItem["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojLegendItem["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoryVisibilityChanged = JetElementCustomEvent<ojLegendItem["categoryVisibility"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojLegendItem["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojLegendItem["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineStyleChanged = JetElementCustomEvent<ojLegendItem["lineStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineWidthChanged = JetElementCustomEvent<ojLegendItem["lineWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerColorChanged = JetElementCustomEvent<ojLegendItem["markerColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged = JetElementCustomEvent<ojLegendItem["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSvgClassNameChanged = JetElementCustomEvent<ojLegendItem["markerSvgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSvgStyleChanged = JetElementCustomEvent<ojLegendItem["markerSvgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged = JetElementCustomEvent<ojLegendItem["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojLegendItem["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged = JetElementCustomEvent<ojLegendItem["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojLegendItem["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojLegendItem["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type symbolTypeChanged = JetElementCustomEvent<ojLegendItem["symbolType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textChanged = JetElementCustomEvent<ojLegendItem["text"]>;
}
export interface ojLegendItemEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEvent<ojLegendItem["borderColor"]>;
    'categoriesChanged': JetElementCustomEvent<ojLegendItem["categories"]>;
    'categoryVisibilityChanged': JetElementCustomEvent<ojLegendItem["categoryVisibility"]>;
    'colorChanged': JetElementCustomEvent<ojLegendItem["color"]>;
    'drillingChanged': JetElementCustomEvent<ojLegendItem["drilling"]>;
    'lineStyleChanged': JetElementCustomEvent<ojLegendItem["lineStyle"]>;
    'lineWidthChanged': JetElementCustomEvent<ojLegendItem["lineWidth"]>;
    'markerColorChanged': JetElementCustomEvent<ojLegendItem["markerColor"]>;
    'markerShapeChanged': JetElementCustomEvent<ojLegendItem["markerShape"]>;
    'markerSvgClassNameChanged': JetElementCustomEvent<ojLegendItem["markerSvgClassName"]>;
    'markerSvgStyleChanged': JetElementCustomEvent<ojLegendItem["markerSvgStyle"]>;
    'patternChanged': JetElementCustomEvent<ojLegendItem["pattern"]>;
    'shortDescChanged': JetElementCustomEvent<ojLegendItem["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojLegendItem["source"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojLegendItem["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojLegendItem["svgStyle"]>;
    'symbolTypeChanged': JetElementCustomEvent<ojLegendItem["symbolType"]>;
    'textChanged': JetElementCustomEvent<ojLegendItem["text"]>;
}
export interface ojLegendItemSettableProperties extends JetSettableProperties {
    borderColor?: string;
    categories?: string[];
    /** @deprecated since 14.1.0 - Use hidden-categories on oj-legend instead */
    categoryVisibility?: 'hidden' | 'visible';
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    lineStyle?: 'dotted' | 'dashed' | 'solid';
    lineWidth?: number;
    markerColor?: string;
    markerShape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    markerSvgClassName?: string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    markerSvgStyle?: Partial<CSSStyleDeclaration>;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    shortDesc?: string;
    source?: string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    svgClassName?: string;
    /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
    svgStyle?: Partial<CSSStyleDeclaration>;
    symbolType?: 'line' | 'lineWithMarker' | 'image' | 'marker';
    text: string;
}
export interface ojLegendItemSettablePropertiesLenient extends Partial<ojLegendItemSettableProperties> {
    [key: string]: any;
}
export interface ojLegendSection extends JetElement<ojLegendSectionSettableProperties> {
    /** @deprecated since 16.0.0 - Collapsible legend sections are not recommended in the Redwood theme. */
    collapsible?: 'on' | 'off';
    text?: string;
    /** @deprecated since 15.1.0 - Individual section title alignment is no longer supported. Use section-title-halign in oj-legend to align all section titles */
    textHalign?: 'center' | 'end' | 'start';
    /** @deprecated since 15.1.0 - Individual section title style is no longer supported. Use section-title-style in oj-legend to style all section titles */
    textStyle?: Partial<CSSStyleDeclaration>;
    addEventListener<T extends keyof ojLegendSectionEventMap>(type: T, listener: (this: HTMLElement, ev: ojLegendSectionEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojLegendSectionSettableProperties>(property: T): ojLegendSection[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojLegendSectionSettableProperties>(property: T, value: ojLegendSectionSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojLegendSectionSettableProperties>): void;
    setProperties(properties: ojLegendSectionSettablePropertiesLenient): void;
}
export namespace ojLegendSection {
    // tslint:disable-next-line interface-over-type-literal
    type collapsibleChanged = JetElementCustomEvent<ojLegendSection["collapsible"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textChanged = JetElementCustomEvent<ojLegendSection["text"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textHalignChanged = JetElementCustomEvent<ojLegendSection["textHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textStyleChanged = JetElementCustomEvent<ojLegendSection["textStyle"]>;
}
export interface ojLegendSectionEventMap extends HTMLElementEventMap {
    'collapsibleChanged': JetElementCustomEvent<ojLegendSection["collapsible"]>;
    'textChanged': JetElementCustomEvent<ojLegendSection["text"]>;
    'textHalignChanged': JetElementCustomEvent<ojLegendSection["textHalign"]>;
    'textStyleChanged': JetElementCustomEvent<ojLegendSection["textStyle"]>;
}
export interface ojLegendSectionSettableProperties extends JetSettableProperties {
    /** @deprecated since 16.0.0 - Collapsible legend sections are not recommended in the Redwood theme. */
    collapsible?: 'on' | 'off';
    text?: string;
    /** @deprecated since 15.1.0 - Individual section title alignment is no longer supported. Use section-title-halign in oj-legend to align all section titles */
    textHalign?: 'center' | 'end' | 'start';
    /** @deprecated since 15.1.0 - Individual section title style is no longer supported. Use section-title-style in oj-legend to style all section titles */
    textStyle?: Partial<CSSStyleDeclaration>;
}
export interface ojLegendSectionSettablePropertiesLenient extends Partial<ojLegendSectionSettableProperties> {
    [key: string]: any;
}
export type LegendElement<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = ojLegend<K, D>;
export type LegendItemElement = ojLegendItem;
export type LegendSectionElement = ojLegendSection;
export namespace LegendElement {
    interface ojDrill extends CustomEvent<{
        id: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type halignChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["halign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hideAndShowBehaviorChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hideAndShowBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollingChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["scrolling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sectionTitleHalignChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["sectionTitleHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sectionTitleStyleChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["sectionTitleStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type symbolHeightChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["symbolHeight"]>;
    // tslint:disable-next-line interface-over-type-literal
    type symbolWidthChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["symbolWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textStyleChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["textStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["trackResize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valignChanged<K, D extends ojLegend.Item<K> | ojLegend.Section<K> | any> = JetElementCustomEvent<ojLegend<K, D>["valign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Item<K> = {
        borderColor?: string;
        categories?: string[];
        /** @deprecated since 14.1.0 - Use hidden-categories attribute of oj-legend instead. */
        categoryVisibility?: 'hidden' | 'visible';
        color?: string;
        drilling?: 'off' | 'on' | 'inherit';
        id?: K;
        lineStyle?: 'dashed' | 'dotted' | 'solid';
        lineWidth?: number;
        markerColor?: string;
        markerShape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        markerSvgClassName?: string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        markerSvgStyle?: Partial<CSSStyleDeclaration>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shortDesc?: string;
        source?: string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        svgClassName?: string;
        /** @deprecated since 14.1.0 - This is not recommended in the Redwood design system. */
        svgStyle?: Partial<CSSStyleDeclaration>;
        symbolType?: 'image' | 'line' | 'lineWithMarker' | 'marker';
        text: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        /** @deprecated since 16.0.0 - The componentElement property is deprecated. This shouldn't be needed, as the component template with access to this context is unique to the component. */
        componentElement: Element;
        data: D;
        index: number;
        key: K;
        parentData: D[];
        parentKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        itemIndex: number;
        sectionIndexPath: number[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PreferredSize = {
        height: number;
        width: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Section<K> = {
        /** @deprecated since 16.0.0 - Collapsible legend sections are not recommended in the Redwood theme. */
        collapsible?: 'on' | 'off';
        /** @deprecated since 14.1.0 - Applications should use the expanded API on oj-legend instead. */
        expanded?: 'off' | 'on';
        id?: K;
        items?: Array<ojLegend.Item<K>>;
        /** @deprecated since 18.0.0 - Use of nested legend sections is not recommended in Redwood theme. As such, this attribute is deprecated. */
        sections?: Array<ojLegend.Section<K>>;
        title?: string;
        /** @deprecated since 15.1.0 - Individual section title alignment is no longer supported. Use section-title-halign in oj-legend to align all section titles. */
        titleHalign?: 'center' | 'end' | 'start';
        /** @deprecated since 15.1.0 - Individual section title style is no longer supported. Use section-title-style in oj-legend to style all section titles. */
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SectionTemplateContext<K = any, D = any> = {
        /** @deprecated since 16.0.0 - The componentElement property is deprecated. This shouldn't be needed, as the component template with access to this context is unique to the component. */
        componentElement: Element;
        data: D;
        index: number;
        key: K;
        parentData: D[];
        parentKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderSectionTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<SectionTemplateContext<K, D>>;
}
export namespace LegendItemElement {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojLegendItem["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojLegendItem["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoryVisibilityChanged = JetElementCustomEvent<ojLegendItem["categoryVisibility"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojLegendItem["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojLegendItem["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineStyleChanged = JetElementCustomEvent<ojLegendItem["lineStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineWidthChanged = JetElementCustomEvent<ojLegendItem["lineWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerColorChanged = JetElementCustomEvent<ojLegendItem["markerColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged = JetElementCustomEvent<ojLegendItem["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSvgClassNameChanged = JetElementCustomEvent<ojLegendItem["markerSvgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSvgStyleChanged = JetElementCustomEvent<ojLegendItem["markerSvgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged = JetElementCustomEvent<ojLegendItem["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojLegendItem["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged = JetElementCustomEvent<ojLegendItem["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojLegendItem["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojLegendItem["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type symbolTypeChanged = JetElementCustomEvent<ojLegendItem["symbolType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textChanged = JetElementCustomEvent<ojLegendItem["text"]>;
}
export namespace LegendSectionElement {
    // tslint:disable-next-line interface-over-type-literal
    type collapsibleChanged = JetElementCustomEvent<ojLegendSection["collapsible"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textChanged = JetElementCustomEvent<ojLegendSection["text"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textHalignChanged = JetElementCustomEvent<ojLegendSection["textHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textStyleChanged = JetElementCustomEvent<ojLegendSection["textStyle"]>;
}
export interface LegendIntrinsicProps extends Partial<Readonly<ojLegendSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojDrill?: (value: ojLegendEventMap<any, any>['ojDrill']) => void;
    /** @deprecated since 6.2.0 */ onasChanged?: (value: ojLegendEventMap<any, any>['asChanged']) => void;
    ondataChanged?: (value: ojLegendEventMap<any, any>['dataChanged']) => void;
    ondrillingChanged?: (value: ojLegendEventMap<any, any>['drillingChanged']) => void;
    /** @deprecated since 16.0.0 */ onexpandedChanged?: (value: ojLegendEventMap<any, any>['expandedChanged']) => void;
    onhalignChanged?: (value: ojLegendEventMap<any, any>['halignChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojLegendEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhideAndShowBehaviorChanged?: (value: ojLegendEventMap<any, any>['hideAndShowBehaviorChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojLegendEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojLegendEventMap<any, any>['hoverBehaviorChanged']) => void;
    /** @deprecated since 14.1.0 */ onhoverBehaviorDelayChanged?: (value: ojLegendEventMap<any, any>['hoverBehaviorDelayChanged']) => void;
    onorientationChanged?: (value: ojLegendEventMap<any, any>['orientationChanged']) => void;
    /** @deprecated since 12.1.0 */ onscrollingChanged?: (value: ojLegendEventMap<any, any>['scrollingChanged']) => void;
    onsectionTitleHalignChanged?: (value: ojLegendEventMap<any, any>['sectionTitleHalignChanged']) => void;
    onsectionTitleStyleChanged?: (value: ojLegendEventMap<any, any>['sectionTitleStyleChanged']) => void;
    onsymbolHeightChanged?: (value: ojLegendEventMap<any, any>['symbolHeightChanged']) => void;
    onsymbolWidthChanged?: (value: ojLegendEventMap<any, any>['symbolWidthChanged']) => void;
    ontextStyleChanged?: (value: ojLegendEventMap<any, any>['textStyleChanged']) => void;
    /** @deprecated since 15.0.0 */ ontrackResizeChanged?: (value: ojLegendEventMap<any, any>['trackResizeChanged']) => void;
    onvalignChanged?: (value: ojLegendEventMap<any, any>['valignChanged']) => void;
    children?: ComponentChildren;
}
export interface LegendItemIntrinsicProps extends Partial<Readonly<ojLegendItemSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojLegendItemEventMap['borderColorChanged']) => void;
    oncategoriesChanged?: (value: ojLegendItemEventMap['categoriesChanged']) => void;
    /** @deprecated since 14.1.0 */ oncategoryVisibilityChanged?: (value: ojLegendItemEventMap['categoryVisibilityChanged']) => void;
    oncolorChanged?: (value: ojLegendItemEventMap['colorChanged']) => void;
    ondrillingChanged?: (value: ojLegendItemEventMap['drillingChanged']) => void;
    onlineStyleChanged?: (value: ojLegendItemEventMap['lineStyleChanged']) => void;
    onlineWidthChanged?: (value: ojLegendItemEventMap['lineWidthChanged']) => void;
    onmarkerColorChanged?: (value: ojLegendItemEventMap['markerColorChanged']) => void;
    onmarkerShapeChanged?: (value: ojLegendItemEventMap['markerShapeChanged']) => void;
    /** @deprecated since 14.1.0 */ onmarkerSvgClassNameChanged?: (value: ojLegendItemEventMap['markerSvgClassNameChanged']) => void;
    /** @deprecated since 14.1.0 */ onmarkerSvgStyleChanged?: (value: ojLegendItemEventMap['markerSvgStyleChanged']) => void;
    onpatternChanged?: (value: ojLegendItemEventMap['patternChanged']) => void;
    onshortDescChanged?: (value: ojLegendItemEventMap['shortDescChanged']) => void;
    onsourceChanged?: (value: ojLegendItemEventMap['sourceChanged']) => void;
    /** @deprecated since 14.1.0 */ onsvgClassNameChanged?: (value: ojLegendItemEventMap['svgClassNameChanged']) => void;
    /** @deprecated since 14.1.0 */ onsvgStyleChanged?: (value: ojLegendItemEventMap['svgStyleChanged']) => void;
    onsymbolTypeChanged?: (value: ojLegendItemEventMap['symbolTypeChanged']) => void;
    ontextChanged?: (value: ojLegendItemEventMap['textChanged']) => void;
    children?: ComponentChildren;
}
export interface LegendSectionIntrinsicProps extends Partial<Readonly<ojLegendSectionSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 16.0.0 */ oncollapsibleChanged?: (value: ojLegendSectionEventMap['collapsibleChanged']) => void;
    ontextChanged?: (value: ojLegendSectionEventMap['textChanged']) => void;
    /** @deprecated since 15.1.0 */ ontextHalignChanged?: (value: ojLegendSectionEventMap['textHalignChanged']) => void;
    /** @deprecated since 15.1.0 */ ontextStyleChanged?: (value: ojLegendSectionEventMap['textStyleChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-legend": LegendIntrinsicProps;
            "oj-legend-item": LegendItemIntrinsicProps;
            "oj-legend-section": LegendSectionIntrinsicProps;
        }
    }
}
