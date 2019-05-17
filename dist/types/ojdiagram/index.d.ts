import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface DvtDiagramLayoutContext {
    getCommonContainer(nodeId1: any, nodeId2: any): any;
    getComponentSize(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getCurrentViewport(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getEventData(): object;
    getLinkById(id: any): DvtDiagramLayoutContextLink;
    getLinkByIndex(index: number): DvtDiagramLayoutContextLink;
    getLinkCount(): number;
    getNodeById(id: any): DvtDiagramLayoutContextNode;
    getNodeByIndex(index: number): DvtDiagramLayoutContextNode;
    getNodeCount(): number;
    getViewport(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    isLocaleR2L(): boolean;
    setViewport(viewport: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): void;
}
export interface DvtDiagramLayoutContextLink {
    getCoordinateSpace(): any;
    getData(): object | any[];
    getEndConnectorOffset(): number;
    getEndId(): any;
    getId(): any;
    getLabelBounds(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getLabelHalign(): 'left' | 'center' | 'right';
    getLabelPosition(): {
        x: number;
        y: number;
    };
    getLabelRotationAngle(): number;
    getLabelRotationPoint(): {
        x: number;
        y: number;
    };
    getLabelValign(): 'top' | 'middle' | 'bottom' | 'baseline';
    getLinkWidth(): number;
    getPoints(): any[];
    getSelected(): boolean;
    getStartConnectorOffset(): number;
    getStartId(): any;
    isPromoted(): boolean;
    setCoordinateSpace(containerId: any): void;
    setLabelHalign(halign: 'left' | 'center' | 'right'): void;
    setLabelPosition(pos: {
        x: number;
        y: number;
    }): void;
    setLabelRotationAngle(angle: number): void;
    setLabelRotationPoint(point: {
        x: number;
        y: number;
    }): void;
    setLabelValign(valign: 'top' | 'middle' | 'bottom' | 'baseline'): void;
    setPoints(points: any[]): void;
}
export interface DvtDiagramLayoutContextNode {
    getBounds(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getChildNodes(): any[];
    getContentBounds(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getData(): object;
    getId(): any;
    getLabelBounds(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getLabelHalign(): 'left' | 'center' | 'right';
    getLabelPosition(): {
        x: number;
        y: number;
    };
    getLabelRotationAngle(): number;
    getLabelRotationPoint(): {
        x: number;
        y: number;
    };
    getLabelValign(): 'top' | 'middle' | 'bottom' | 'baseline';
    getPosition(): {
        x: number;
        y: number;
    };
    getRelativePosition(containerId: any): {
        x: number;
        y: number;
    };
    getSelected(): boolean;
    isDisclosed(): boolean;
    setLabelHalign(halign: 'left' | 'center' | 'right'): void;
    setLabelPosition(pos: {
        x: number;
        y: number;
    }): void;
    setLabelRotationAngle(angle: number): void;
    setLabelRotationPoint(point: {
        x: number;
        y: number;
    }): void;
    setLabelValign(valign: 'top' | 'middle' | 'bottom' | 'baseline'): void;
    setPosition(pos: {
        x: number;
        y: number;
    }): void;
}
export interface ojDiagram<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> extends dvtBaseComponent<ojDiagramSettableProperties<K1, K2, D1, D2>> {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    dnd: {
        drag: {
            nodes: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((param0: Event, param1: object) => void);
            };
            ports: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((param0: Event, param1: object) => void);
                linkStyle: ((param0: object) => void);
                selector: string;
            };
        };
        drop: {
            background: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
            };
            links: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
            };
            nodes: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
            };
            ports: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
                selector: string;
            };
        };
    };
    expanded: KeySet<K1>;
    focusRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    layout: ((param0: DvtDiagramLayoutContext) => void);
    linkData: DataProvider<K2, D2> | null;
    linkHighlightMode: 'linkAndNodes' | 'link';
    maxZoom: number;
    minZoom: number;
    nodeData: DataProvider<K1, D1> | null;
    nodeHighlightMode: 'nodeAndIncomingLinks' | 'nodeAndOutgoingLinks' | 'nodeAndLinks' | 'node';
    overview: {
        halign: 'start' | 'end' | 'center';
        height: number;
        rendered: 'on' | 'off';
        valign: 'top' | 'bottom' | 'middle';
        width: number;
    };
    panDirection: 'x' | 'y' | 'auto';
    panning: 'auto' | 'none';
    promotedLinkBehavior: 'none' | 'full' | 'lazy';
    renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
        insert: SVGElement;
    }));
    selection: Array<K1 | K2>;
    selectionMode: 'single' | 'multiple' | 'none';
    selectionRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults: {
        animationDuration: number;
        hoverBehaviorDelay: number;
        linkDefaults: {
            color: string;
            endConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            labelStyle: CSSStyleDeclaration;
            startConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            width: number;
        };
        nodeDefaults: {
            icon: {
                borderColor: string;
                borderRadius: string;
                borderWidth: number;
                color: string;
                height: number;
                pattern: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
                   'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
                source: string;
                sourceHover: string;
                sourceHoverSelected: string;
                sourceSelected: string;
                svgClassName: string;
                svgStyle: CSSStyleDeclaration;
                width: number;
            };
            labelStyle: CSSStyleDeclaration;
            showDisclosure: 'off' | 'on';
        };
        promotedLink: {
            color: string;
            endConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            startConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            width: number;
        };
    };
    tooltip: {
        renderer: ((context: ojDiagram.TooltipContext<K1, K2, D1, D2>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    zoomRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    zooming: 'auto' | 'none';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        promotedLink?: string;
        promotedLinkAriaDesc?: string;
        promotedLinks?: string;
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
    addEventListener<T extends keyof ojDiagramEventMap<K1, K2, D1, D2>>(type: T, listener: (this: HTMLElement, ev: ojDiagramEventMap<K1, K2, D1, D2>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojDiagramSettableProperties<K1, K2, D1, D2>>(property: T): ojDiagram<K1, K2, D1, D2>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDiagramSettableProperties<K1, K2, D1, D2>>(property: T, value: ojDiagramSettableProperties<K1, K2, D1, D2>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDiagramSettableProperties<K1, K2, D1, D2>>): void;
    setProperties(properties: ojDiagramSettablePropertiesLenient<K1, K2, D1, D2>): void;
    getContextByNode(node: Element): object | null;
}
export namespace ojDiagram {
    interface ojBeforeCollapse extends CustomEvent<{
        nodeId: any;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        nodeId: any;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        nodeId: any;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        nodeId: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type focusRendererChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["focusRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverRendererChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkDataChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkHighlightModeChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkHighlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxZoomChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["maxZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minZoomChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["minZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeDataChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeHighlightModeChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeHighlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panDirectionChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panDirection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panningChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panning"]>;
    // tslint:disable-next-line interface-over-type-literal
    type promotedLinkBehaviorChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["promotedLinkBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rendererChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["renderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRendererChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selectionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomRendererChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["zoomRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomingChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["zooming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Link<K1, K2> = {
        id?: K1;
        categories: string[];
        color?: string;
        label?: string;
        labelStyle?: CSSStyleDeclaration | null;
        selectable?: 'auto' | 'off';
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        width?: number;
        startNode: K2;
        endNode: K2;
        startConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
        endConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K> = {
        id?: K;
        categories?: string[];
        icon?: {
            borderColor?: string;
            borderRadius?: string;
            borderWidth?: number;
            color?: string;
            pattern?: 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'mallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' |
               'smallDiamond' | 'smallTriangle' | string;
            opacity?: number;
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            source?: string;
            sourceHover?: string;
            sourceHoverSelected?: string;
            sourceSelected?: string;
            width?: number;
            height?: number;
            svgStyle?: CSSStyleDeclaration;
            svgClassName?: string;
        };
        label?: string;
        labelStyle?: CSSStyleDeclaration | null;
        overview?: {
            icon?: {
                shape?: 'inherit' | 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
                svgStyle?: CSSStyleDeclaration;
                svgClassName?: string;
            };
        };
        selectable?: 'auto' | 'off';
        shortDesc?: string;
        showDisclosure?: 'on' | 'off';
        descendantsConnectivity?: 'connected' | 'disjoint' | 'unknown';
    };
    // tslint:disable-next-line interface-over-type-literal
    type RendererContext<K1, D1> = {
        parentElement: Element;
        componentElement: Element;
        data: object;
        itemData: D1;
        content: {
            element: Element;
            width: number;
            height: number;
        };
        state: {
            hovered: boolean;
            selected: boolean;
            focused: boolean;
            expanded: boolean;
            zoom: number;
        };
        previousState: {
            hovered: boolean;
            selected: boolean;
            focused: boolean;
            expanded: boolean;
            zoom: number;
        };
        id: K1;
        type: string;
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K1, K2, D1, D2> = {
        parentElement: Element;
        componentElement: Element;
        id: K1 | K2;
        type: string;
        label: string;
        data: object | object[];
        itemData: D1 | D2 | D2[];
    };
}
export interface ojDiagramEventMap<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> extends dvtBaseComponentEventMap<ojDiagramSettableProperties<K1, K2, D1, D2>> {
    'ojBeforeCollapse': ojDiagram.ojBeforeCollapse;
    'ojBeforeExpand': ojDiagram.ojBeforeExpand;
    'ojCollapse': ojDiagram.ojCollapse;
    'ojExpand': ojDiagram.ojExpand;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["as"]>;
    'dndChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["dnd"]>;
    'expandedChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["expanded"]>;
    'focusRendererChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["focusRenderer"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverBehavior"]>;
    'hoverRendererChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverRenderer"]>;
    'layoutChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["layout"]>;
    'linkDataChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkData"]>;
    'linkHighlightModeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkHighlightMode"]>;
    'maxZoomChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["maxZoom"]>;
    'minZoomChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["minZoom"]>;
    'nodeDataChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeData"]>;
    'nodeHighlightModeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeHighlightMode"]>;
    'overviewChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["overview"]>;
    'panDirectionChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panDirection"]>;
    'panningChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panning"]>;
    'promotedLinkBehaviorChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["promotedLinkBehavior"]>;
    'rendererChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["renderer"]>;
    'selectionChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selectionMode"]>;
    'selectionRendererChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selectionRenderer"]>;
    'styleDefaultsChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["styleDefaults"]>;
    'tooltipChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["tooltip"]>;
    'touchResponseChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["touchResponse"]>;
    'zoomRendererChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["zoomRenderer"]>;
    'zoomingChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["zooming"]>;
}
export interface ojDiagramSettableProperties<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> extends dvtBaseComponentSettableProperties {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    dnd: {
        drag: {
            nodes: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((param0: Event, param1: object) => void);
            };
            ports: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((param0: Event, param1: object) => void);
                linkStyle: ((param0: object) => void);
                selector: string;
            };
        };
        drop: {
            background: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
            };
            links: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
            };
            nodes: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
            };
            ports: {
                dataTypes: string | string[];
                dragEnter: ((param0: Event, param1: object) => void);
                dragLeave: ((param0: Event, param1: object) => void);
                dragOver: ((param0: Event, param1: object) => void);
                drop: ((param0: Event, param1: object) => void);
                selector: string;
            };
        };
    };
    expanded: KeySet<K1>;
    focusRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    layout: ((param0: DvtDiagramLayoutContext) => void);
    linkData: DataProvider<K2, D2> | null;
    linkHighlightMode: 'linkAndNodes' | 'link';
    maxZoom: number;
    minZoom: number;
    nodeData: DataProvider<K1, D1> | null;
    nodeHighlightMode: 'nodeAndIncomingLinks' | 'nodeAndOutgoingLinks' | 'nodeAndLinks' | 'node';
    overview: {
        halign: 'start' | 'end' | 'center';
        height: number;
        rendered: 'on' | 'off';
        valign: 'top' | 'bottom' | 'middle';
        width: number;
    };
    panDirection: 'x' | 'y' | 'auto';
    panning: 'auto' | 'none';
    promotedLinkBehavior: 'none' | 'full' | 'lazy';
    renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
        insert: SVGElement;
    }));
    selection: Array<K1 | K2>;
    selectionMode: 'single' | 'multiple' | 'none';
    selectionRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults: {
        animationDuration: number;
        hoverBehaviorDelay: number;
        linkDefaults: {
            color: string;
            endConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            labelStyle: CSSStyleDeclaration;
            startConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            width: number;
        };
        nodeDefaults: {
            icon: {
                borderColor: string;
                borderRadius: string;
                borderWidth: number;
                color: string;
                height: number;
                pattern: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
                   'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
                source: string;
                sourceHover: string;
                sourceHoverSelected: string;
                sourceSelected: string;
                svgClassName: string;
                svgStyle: CSSStyleDeclaration;
                width: number;
            };
            labelStyle: CSSStyleDeclaration;
            showDisclosure: 'off' | 'on';
        };
        promotedLink: {
            color: string;
            endConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            startConnectorType: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            width: number;
        };
    };
    tooltip: {
        renderer: ((context: ojDiagram.TooltipContext<K1, K2, D1, D2>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    zoomRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    zooming: 'auto' | 'none';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        promotedLink?: string;
        promotedLinkAriaDesc?: string;
        promotedLinks?: string;
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
export interface ojDiagramSettablePropertiesLenient<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> extends Partial<ojDiagramSettableProperties<K1, K2, D1, D2>> {
    [key: string]: any;
}
export interface ojDiagramLink extends JetElement<ojDiagramLinkSettableProperties> {
    categories: string[];
    color?: string;
    endConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    endNode: any;
    label?: string;
    labelStyle?: CSSStyleDeclaration | null;
    selectable?: 'auto' | 'off';
    shortDesc?: string;
    startConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    startNode: any;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    width?: number;
    addEventListener<T extends keyof ojDiagramLinkEventMap>(type: T, listener: (this: HTMLElement, ev: ojDiagramLinkEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojDiagramLinkSettableProperties>(property: T): ojDiagramLink[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDiagramLinkSettableProperties>(property: T, value: ojDiagramLinkSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDiagramLinkSettableProperties>): void;
    setProperties(properties: ojDiagramLinkSettablePropertiesLenient): void;
}
export namespace ojDiagramLink {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojDiagramLink["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojDiagramLink["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endConnectorTypeChanged = JetElementCustomEvent<ojDiagramLink["endConnectorType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endNodeChanged = JetElementCustomEvent<ojDiagramLink["endNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojDiagramLink["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojDiagramLink["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged = JetElementCustomEvent<ojDiagramLink["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojDiagramLink["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startConnectorTypeChanged = JetElementCustomEvent<ojDiagramLink["startConnectorType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startNodeChanged = JetElementCustomEvent<ojDiagramLink["startNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojDiagramLink["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojDiagramLink["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged = JetElementCustomEvent<ojDiagramLink["width"]>;
}
export interface ojDiagramLinkEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEvent<ojDiagramLink["categories"]>;
    'colorChanged': JetElementCustomEvent<ojDiagramLink["color"]>;
    'endConnectorTypeChanged': JetElementCustomEvent<ojDiagramLink["endConnectorType"]>;
    'endNodeChanged': JetElementCustomEvent<ojDiagramLink["endNode"]>;
    'labelChanged': JetElementCustomEvent<ojDiagramLink["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojDiagramLink["labelStyle"]>;
    'selectableChanged': JetElementCustomEvent<ojDiagramLink["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojDiagramLink["shortDesc"]>;
    'startConnectorTypeChanged': JetElementCustomEvent<ojDiagramLink["startConnectorType"]>;
    'startNodeChanged': JetElementCustomEvent<ojDiagramLink["startNode"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojDiagramLink["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojDiagramLink["svgStyle"]>;
    'widthChanged': JetElementCustomEvent<ojDiagramLink["width"]>;
}
export interface ojDiagramLinkSettableProperties extends JetSettableProperties {
    categories: string[];
    color?: string;
    endConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    endNode: any;
    label?: string;
    labelStyle?: CSSStyleDeclaration | null;
    selectable?: 'auto' | 'off';
    shortDesc?: string;
    startConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    startNode: any;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    width?: number;
}
export interface ojDiagramLinkSettablePropertiesLenient extends Partial<ojDiagramLinkSettableProperties> {
    [key: string]: any;
}
export interface ojDiagramNode extends JetElement<ojDiagramNodeSettableProperties> {
    categories?: string[];
    descendantsConnectivity?: 'connected' | 'disjoint' | 'unknown';
    icon?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: number;
        color?: string;
        height?: number;
        opacity?: number;
        pattern?: 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'mallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' |
           'smallDiamond' | 'smallTriangle' | string;
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        width?: number;
    };
    label?: string;
    labelStyle?: CSSStyleDeclaration | null;
    overview?: {
        icon?: {
            shape?: 'inherit' | 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
        };
    };
    selectable?: 'auto' | 'off';
    shortDesc?: string;
    showDisclosure?: 'on' | 'off';
    addEventListener<T extends keyof ojDiagramNodeEventMap>(type: T, listener: (this: HTMLElement, ev: ojDiagramNodeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojDiagramNodeSettableProperties>(property: T): ojDiagramNode[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDiagramNodeSettableProperties>(property: T, value: ojDiagramNodeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDiagramNodeSettableProperties>): void;
    setProperties(properties: ojDiagramNodeSettablePropertiesLenient): void;
}
export namespace ojDiagramNode {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojDiagramNode["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type descendantsConnectivityChanged = JetElementCustomEvent<ojDiagramNode["descendantsConnectivity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type iconChanged = JetElementCustomEvent<ojDiagramNode["icon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojDiagramNode["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojDiagramNode["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged = JetElementCustomEvent<ojDiagramNode["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged = JetElementCustomEvent<ojDiagramNode["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojDiagramNode["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type showDisclosureChanged = JetElementCustomEvent<ojDiagramNode["showDisclosure"]>;
}
export interface ojDiagramNodeEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEvent<ojDiagramNode["categories"]>;
    'descendantsConnectivityChanged': JetElementCustomEvent<ojDiagramNode["descendantsConnectivity"]>;
    'iconChanged': JetElementCustomEvent<ojDiagramNode["icon"]>;
    'labelChanged': JetElementCustomEvent<ojDiagramNode["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojDiagramNode["labelStyle"]>;
    'overviewChanged': JetElementCustomEvent<ojDiagramNode["overview"]>;
    'selectableChanged': JetElementCustomEvent<ojDiagramNode["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojDiagramNode["shortDesc"]>;
    'showDisclosureChanged': JetElementCustomEvent<ojDiagramNode["showDisclosure"]>;
}
export interface ojDiagramNodeSettableProperties extends JetSettableProperties {
    categories?: string[];
    descendantsConnectivity?: 'connected' | 'disjoint' | 'unknown';
    icon?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: number;
        color?: string;
        height?: number;
        opacity?: number;
        pattern?: 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'mallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' |
           'smallDiamond' | 'smallTriangle' | string;
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        width?: number;
    };
    label?: string;
    labelStyle?: CSSStyleDeclaration | null;
    overview?: {
        icon?: {
            shape?: 'inherit' | 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
        };
    };
    selectable?: 'auto' | 'off';
    shortDesc?: string;
    showDisclosure?: 'on' | 'off';
}
export interface ojDiagramNodeSettablePropertiesLenient extends Partial<ojDiagramNodeSettableProperties> {
    [key: string]: any;
}
