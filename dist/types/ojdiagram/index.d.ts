import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface DvtDiagramLayoutContext<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> {
    getCommonContainer(nodeId1: K1, nodeId2: K1): K1 | null;
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
    getLinkById(id: K1): DvtDiagramLayoutContextLink<K1, K2, D2>;
    getLinkByIndex(index: number): DvtDiagramLayoutContextLink<K1, K2, D2>;
    getLinkCount(): number;
    getNodeById(id: K1): DvtDiagramLayoutContextNode<K1, D1>;
    getNodeByIndex(index: number): DvtDiagramLayoutContextNode<K1, D1>;
    getNodeCount(): number;
    getViewport(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    isLocaleR2L(): boolean;
    setPanZoomState(panZoomState: {
        zoom: number | null;
        centerX: number | null;
        centerY: number | null;
    }): void;
    setViewport(viewport: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): void;
}
export interface DvtDiagramLayoutContextLink<K1, K2, D2 extends ojDiagram.Link<K2, K1> | any> {
    getCoordinateSpace(): K1;
    getData(): D2 | D2[];
    getEndConnectorOffset(): number;
    getEndId(): K1;
    getId(): K2;
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
    getLayoutAttributes(): object;
    getLinkWidth(): number;
    getPoints(): any[];
    getSelected(): boolean;
    getStartConnectorOffset(): number;
    getStartId(): K1;
    isPromoted(): boolean;
    setCoordinateSpace(containerId: K1): void;
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
export interface DvtDiagramLayoutContextNode<K1, D1 extends ojDiagram.Node<K1> | any> {
    getBounds(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getChildNodes(): DvtDiagramLayoutContextNode<K1, D1>[];
    getContainerId(): K1;
    getContentBounds(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getData(): D1;
    getId(): K1;
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
    getLayoutAttributes(): object;
    getPosition(): {
        x: number;
        y: number;
    };
    getRelativePosition(containerId: K1): {
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
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    as?: string;
    currentItem?: K1 | K2;
    dnd?: {
        drag?: {
            nodes?: {
                dataTypes?: string | string[];
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((event: Event, context: {
                    nodes: ojDiagram.DndNodeContext<K1, D1>[];
                }) => void);
            };
            ports?: {
                dataTypes?: string | string[];
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((event: Event, context: {
                    ports: {
                        portElement: Element;
                        dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    };
                }) => void);
                linkStyle?: ((context: {
                    portElement: Element;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => ({
                    svgStyle?: Partial<CSSStyleDeclaration>;
                    svgClassName?: string;
                } | null));
                selector?: string;
            };
        };
        drop?: {
            background?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
            };
            links?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
            };
            nodes?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
            };
            ports?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                selector: string;
            };
        };
    };
    expanded?: KeySet<K1>;
    focusRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    layout?: ((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => void);
    linkContent?: {
        focusRenderer?: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer?: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => ({
            insert: SVGElement;
        }));
        selectionRenderer?: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
    };
    linkData?: DataProvider<K2, D2> | null;
    linkHighlightMode?: 'linkAndNodes' | 'link';
    maxZoom?: number;
    minZoom?: number;
    nodeContent?: {
        focusRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
            insert: SVGElement;
        }));
        selectionRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        zoomRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
    };
    nodeData: DataProvider<K1, D1> | null;
    nodeHighlightMode?: 'nodeAndIncomingLinks' | 'nodeAndOutgoingLinks' | 'nodeAndLinks' | 'node';
    overview?: {
        fitArea?: 'content' | 'canvas';
        halign?: 'start' | 'end' | 'center';
        height?: number;
        preserveAspectRatio?: 'none' | 'meet';
        rendered?: 'on' | 'off';
        valign?: 'top' | 'bottom' | 'middle';
        width?: number;
    };
    panDirection?: 'x' | 'y' | 'auto';
    panZoomState?: {
        centerX: number | null;
        centerY: number | null;
        zoom: number;
    };
    panning?: 'fixed' | 'centerContent' | 'none' | 'auto';
    promotedLinkBehavior?: 'none' | 'full' | 'lazy';
    renderer?: ((context: ojDiagram.RendererContext<K1, D1>) => ({
        insert: SVGElement;
    }));
    selection?: Array<K1 | K2>;
    selectionMode?: 'none' | 'single' | 'multiple';
    selectionRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults?: {
        animationDuration?: number;
        hoverBehaviorDelay?: number;
        linkDefaults?: {
            color?: string;
            endConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            labelStyle?: Partial<CSSStyleDeclaration>;
            startConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        nodeDefaults?: {
            icon?: {
                borderColor?: string;
                borderRadius?: string;
                borderWidth?: number;
                color?: string;
                height?: number;
                pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' |
                   'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'rectangle' | 'square' | string;
                source?: string;
                sourceHover?: string;
                sourceHoverSelected?: string;
                sourceSelected?: string;
                svgClassName?: string;
                svgStyle?: Partial<CSSStyleDeclaration>;
                width?: number;
            };
            labelStyle?: Partial<CSSStyleDeclaration>;
            showDisclosure?: 'off' | 'on';
        };
        promotedLink?: {
            color?: string;
            endConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            startConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
    };
    tooltip?: {
        renderer: ((context: ojDiagram.TooltipRendererContext<K1, K2, D1, D2>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    zoomRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    zooming?: 'auto' | 'none';
    translations: {
        accessibleContainsControls?: string;
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
    addEventListener<T extends keyof ojDiagramEventMap<K1, K2, D1, D2>>(type: T, listener: (this: HTMLElement, ev: ojDiagramEventMap<K1, K2, D1, D2>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDiagramSettableProperties<K1, K2, D1, D2>>(property: T): ojDiagram<K1, K2, D1, D2>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDiagramSettableProperties<K1, K2, D1, D2>>(property: T, value: ojDiagramSettableProperties<K1, K2, D1, D2>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDiagramSettableProperties<K1, K2, D1, D2>>): void;
    setProperties(properties: ojDiagramSettablePropertiesLenient<K1, K2, D1, D2>): void;
    getContextByNode(node: Element): ojDiagram.NodeContext | null;
}
export namespace ojDiagram {
    interface ojBeforeCollapse<K1> extends CustomEvent<{
        nodeId: K1;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K1> extends CustomEvent<{
        nodeId: K1;
        [propName: string]: any;
    }> {
    }
    interface ojBeforePanZoomReset extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K1> extends CustomEvent<{
        nodeId: K1;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K1> extends CustomEvent<{
        nodeId: K1;
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
    type currentItemChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["currentItem"]>;
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
    type linkContentChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkDataChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkHighlightModeChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkHighlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxZoomChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["maxZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minZoomChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["minZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeContentChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeDataChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeHighlightModeChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeHighlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panDirectionChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panDirection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panZoomStateChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panZoomState"]>;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, D1 extends Node<K1> | any, D2 extends Link<K2, K1> | any> = dvtBaseComponent.trackResizeChanged<ojDiagramSettableProperties<K1, K2, D1, D2>>;
    // tslint:disable-next-line interface-over-type-literal
    type DndNodeContext<K1, D1> = {
        componentElement: Element;
        data: Node<K1>;
        id: K1;
        itemData: D1;
        label: string;
        nodeOffset: {
            x: number;
            y: number;
        };
        type: 'node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Link<K1, K2, D2 = any> = {
        categories?: string[];
        color?: string;
        endConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
        endNode: K2;
        id?: K1;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration> | null;
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: LinkShortDescContext<K1, K2, D2>) => string));
        startConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
        startNode: K2;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkContentTemplateContext<K1, K2, D2> = {
        componentElement: Element;
        data: Link<K2, K1>;
        id: K2;
        itemData: D2 | D2[];
        parentElement: Element;
        points: any[] | string;
        previousState: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        rootElement: Element | null;
        state: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        type: 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkItemContext<K1, K2, D2> = {
        componentElement: Element;
        data: Link<K2, K1>;
        id: K2;
        itemData: D2;
        label: string;
        type: 'link';
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkRendererContext<K1, K2, D2> = {
        componentElement: Element;
        data: Link<K2, K1>;
        id: K2;
        itemData: D2 | D2[];
        parentElement: Element;
        points: any[] | string;
        previousState: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        rootElement: Element | null;
        state: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        type: 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkShortDescContext<K1, K2, D2> = {
        data: Link<K2, K1> | Link<K2, K1>[];
        id: K2;
        itemData: D2 | D2[];
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K1, D1 = any> = {
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
            shape?: 'circle' | 'rectangle' | 'square';
            source?: string;
            sourceHover?: string;
            sourceHoverSelected?: string;
            sourceSelected?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        id?: K1;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration> | null;
        overview?: {
            icon?: {
                shape?: 'inherit' | 'circle' | 'rectangle' | 'square' | string;
                svgClassName?: string;
                svgStyle?: Partial<CSSStyleDeclaration>;
            };
        };
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: NodeShortDescContext<K1, D1>) => string));
        showDisclosure?: 'on' | 'off';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContentTemplateContext<K1, D1> = {
        componentElement: Element;
        content: {
            element: Element;
            height: number;
            width: number;
        };
        data: Node<K1>;
        id: K1;
        itemData: D1;
        parentElement: Element;
        previousState: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
        rootElement: Element | null;
        state: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        type: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        index: number;
        subId: 'oj-diagram-link' | 'oj-diagram-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeItemContext<K1, D1> = {
        componentElement: Element;
        data: Node<K1>;
        id: K1;
        itemData: D1;
        label: string;
        type: 'node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K1, D1> = {
        data: Node<K1>;
        id: K1;
        itemData: D1;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeTemplateContext = {
        data: object;
        index: number;
        key: any;
        parentData: any[];
        parentKey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PromotedLinkItemContext<K1, K2, D2> = {
        componentElement: Element;
        data: Link<K2, K1>[];
        id: K2;
        itemData: D2[];
        label: string;
        type: 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type RendererContext<K1, D1> = {
        componentElement: Element;
        content: {
            element: Element;
            height: number;
            width: number;
        };
        data: Node<K1>;
        id: K1;
        itemData: D1;
        parentElement: Element;
        previousState: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
        rootElement: Element | null;
        state: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        type: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K1, K2, D1, D2> = {
        componentElement: Element;
        data: Node<K1> | Link<K2, K1> | Link<K2, K1>[];
        id: K1 | K2;
        itemData: D1 | D2 | D2[];
        label: string;
        parentElement: Element;
        type: 'node' | 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K1, K2, D1, D2> = {
        componentElement: Element;
        data: Node<K1> | Link<K2, K1> | Link<K2, K1>[];
        id: K1 | K2;
        itemData: D1 | D2 | D2[];
        label: string;
        parentElement: Element;
        type: 'node' | 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderLinkContentTemplate<K1, K2, D2> = import('ojs/ojvcomponent').TemplateSlot<LinkContentTemplateContext<K1, K2, D2>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderLinkTemplate = import('ojs/ojvcomponent').TemplateSlot<LinkTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeContentTemplate<K1, D1> = import('ojs/ojvcomponent').TemplateSlot<NodeContentTemplateContext<K1, D1>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K1, K2, D1, D2> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K1, K2, D1, D2>>;
}
export interface ojDiagramEventMap<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> extends dvtBaseComponentEventMap<ojDiagramSettableProperties<K1, K2, D1, D2>> {
    'ojBeforeCollapse': ojDiagram.ojBeforeCollapse<K1>;
    'ojBeforeExpand': ojDiagram.ojBeforeExpand<K1>;
    'ojBeforePanZoomReset': ojDiagram.ojBeforePanZoomReset;
    'ojCollapse': ojDiagram.ojCollapse<K1>;
    'ojExpand': ojDiagram.ojExpand<K1>;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["as"]>;
    'currentItemChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["currentItem"]>;
    'dndChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["dnd"]>;
    'expandedChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["expanded"]>;
    'focusRendererChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["focusRenderer"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverBehavior"]>;
    'hoverRendererChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverRenderer"]>;
    'layoutChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["layout"]>;
    'linkContentChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkContent"]>;
    'linkDataChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkData"]>;
    'linkHighlightModeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkHighlightMode"]>;
    'maxZoomChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["maxZoom"]>;
    'minZoomChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["minZoom"]>;
    'nodeContentChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeContent"]>;
    'nodeDataChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeData"]>;
    'nodeHighlightModeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeHighlightMode"]>;
    'overviewChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["overview"]>;
    'panDirectionChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panDirection"]>;
    'panZoomStateChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panZoomState"]>;
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
    'trackResizeChanged': JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["trackResize"]>;
}
export interface ojDiagramSettableProperties<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> extends dvtBaseComponentSettableProperties {
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    as?: string;
    currentItem?: K1 | K2;
    dnd?: {
        drag?: {
            nodes?: {
                dataTypes?: string | string[];
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((event: Event, context: {
                    nodes: ojDiagram.DndNodeContext<K1, D1>[];
                }) => void);
            };
            ports?: {
                dataTypes?: string | string[];
                drag?: ((param0: Event) => void);
                dragEnd?: ((param0: Event) => void);
                dragStart?: ((event: Event, context: {
                    ports: {
                        portElement: Element;
                        dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    };
                }) => void);
                linkStyle?: ((context: {
                    portElement: Element;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => ({
                    svgStyle?: Partial<CSSStyleDeclaration>;
                    svgClassName?: string;
                } | null));
                selector?: string;
            };
        };
        drop?: {
            background?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
            };
            links?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
            };
            nodes?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
            };
            ports?: {
                dataTypes?: string | string[];
                dragEnter?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragLeave?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragOver?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                drop?: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                selector: string;
            };
        };
    };
    expanded?: KeySet<K1>;
    focusRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    layout?: ((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => void);
    linkContent?: {
        focusRenderer?: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer?: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => ({
            insert: SVGElement;
        }));
        selectionRenderer?: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
    };
    linkData?: DataProvider<K2, D2> | null;
    linkHighlightMode?: 'linkAndNodes' | 'link';
    maxZoom?: number;
    minZoom?: number;
    nodeContent?: {
        focusRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
            insert: SVGElement;
        }));
        selectionRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        zoomRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
    };
    nodeData: DataProvider<K1, D1> | null;
    nodeHighlightMode?: 'nodeAndIncomingLinks' | 'nodeAndOutgoingLinks' | 'nodeAndLinks' | 'node';
    overview?: {
        fitArea?: 'content' | 'canvas';
        halign?: 'start' | 'end' | 'center';
        height?: number;
        preserveAspectRatio?: 'none' | 'meet';
        rendered?: 'on' | 'off';
        valign?: 'top' | 'bottom' | 'middle';
        width?: number;
    };
    panDirection?: 'x' | 'y' | 'auto';
    panZoomState?: {
        centerX: number | null;
        centerY: number | null;
        zoom: number;
    };
    panning?: 'fixed' | 'centerContent' | 'none' | 'auto';
    promotedLinkBehavior?: 'none' | 'full' | 'lazy';
    renderer?: ((context: ojDiagram.RendererContext<K1, D1>) => ({
        insert: SVGElement;
    }));
    selection?: Array<K1 | K2>;
    selectionMode?: 'none' | 'single' | 'multiple';
    selectionRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults?: {
        animationDuration?: number;
        hoverBehaviorDelay?: number;
        linkDefaults?: {
            color?: string;
            endConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            labelStyle?: Partial<CSSStyleDeclaration>;
            startConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        nodeDefaults?: {
            icon?: {
                borderColor?: string;
                borderRadius?: string;
                borderWidth?: number;
                color?: string;
                height?: number;
                pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' |
                   'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape?: 'circle' | 'rectangle' | 'square' | string;
                source?: string;
                sourceHover?: string;
                sourceHoverSelected?: string;
                sourceSelected?: string;
                svgClassName?: string;
                svgStyle?: Partial<CSSStyleDeclaration>;
                width?: number;
            };
            labelStyle?: Partial<CSSStyleDeclaration>;
            showDisclosure?: 'off' | 'on';
        };
        promotedLink?: {
            color?: string;
            endConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            startConnectorType?: 'arrowOpen' | 'arrow' | 'arrowConcave' | 'circle' | 'rectangle' | 'rectangleRounded' | 'none';
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
    };
    tooltip?: {
        renderer: ((context: ojDiagram.TooltipRendererContext<K1, K2, D1, D2>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    zoomRenderer?: ((context: ojDiagram.RendererContext<K1, D1>) => {
        insert: SVGElement;
    } | void) | null;
    zooming?: 'auto' | 'none';
    translations: {
        accessibleContainsControls?: string;
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
export interface ojDiagramChildContent {
    addEventListener<T extends keyof ojDiagramChildContentEventMap>(type: T, listener: (this: HTMLElement, ev: ojDiagramChildContentEventMap[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDiagramChildContentSettableProperties>(property: T): ojDiagramChildContent[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDiagramChildContentSettableProperties>(property: T, value: ojDiagramChildContentSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDiagramChildContentSettableProperties>): void;
    setProperties(properties: ojDiagramChildContentSettablePropertiesLenient): void;
}
// These interfaces are empty but required to keep the event chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface ojDiagramChildContentEventMap extends HTMLElementEventMap {
}
// These interfaces are empty but required to keep the component chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface ojDiagramChildContentSettableProperties extends JetSettableProperties {
}
export interface ojDiagramChildContentSettablePropertiesLenient extends Partial<ojDiagramChildContentSettableProperties> {
    [key: string]: any;
}
export interface ojDiagramLink<K1 = any, K2 = any, D2 = any> extends dvtBaseComponent<ojDiagramLinkSettableProperties<K1, K2, D2>> {
    categories?: string[];
    color?: string;
    endConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    endNode: any;
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration> | null;
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojDiagram.LinkShortDescContext<K1, K2, D2>) => string));
    startConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    startNode: any;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    width?: number;
    addEventListener<T extends keyof ojDiagramLinkEventMap<K1, K2, D2>>(type: T, listener: (this: HTMLElement, ev: ojDiagramLinkEventMap<K1, K2, D2>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDiagramLinkSettableProperties<K1, K2, D2>>(property: T): ojDiagramLink<K1, K2, D2>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDiagramLinkSettableProperties<K1, K2, D2>>(property: T, value: ojDiagramLinkSettableProperties<K1, K2, D2>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDiagramLinkSettableProperties<K1, K2, D2>>): void;
    setProperties(properties: ojDiagramLinkSettablePropertiesLenient<K1, K2, D2>): void;
}
export namespace ojDiagramLink {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endConnectorTypeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["endConnectorType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endNodeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["endNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startConnectorTypeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["startConnectorType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startNodeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["startNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["width"]>;
}
export interface ojDiagramLinkEventMap<K1 = any, K2 = any, D2 = any> extends dvtBaseComponentEventMap<ojDiagramLinkSettableProperties<K1, K2, D2>> {
    'categoriesChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["color"]>;
    'endConnectorTypeChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["endConnectorType"]>;
    'endNodeChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["endNode"]>;
    'labelChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["labelStyle"]>;
    'selectableChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["shortDesc"]>;
    'startConnectorTypeChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["startConnectorType"]>;
    'startNodeChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["startNode"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["svgStyle"]>;
    'widthChanged': JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["width"]>;
}
export interface ojDiagramLinkSettableProperties<K1 = any, K2 = any, D2 = any> extends dvtBaseComponentSettableProperties {
    categories?: string[];
    color?: string;
    endConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    endNode: any;
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration> | null;
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojDiagram.LinkShortDescContext<K1, K2, D2>) => string));
    startConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
    startNode: any;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    width?: number;
}
export interface ojDiagramLinkSettablePropertiesLenient<K1 = any, K2 = any, D2 = any> extends Partial<ojDiagramLinkSettableProperties<K1, K2, D2>> {
    [key: string]: any;
}
export interface ojDiagramNode<K1 = any, D1 = any> extends dvtBaseComponent<ojDiagramNodeSettableProperties<K1, D1>> {
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
        shape?: 'circle' | 'rectangle' | 'square';
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number;
    };
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration> | null;
    overview?: {
        icon?: {
            shape?: 'inherit' | 'circle' | 'rectangle' | 'square' | string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
    };
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojDiagram.NodeShortDescContext<K1, D1>) => string));
    showDisclosure?: 'on' | 'off';
    addEventListener<T extends keyof ojDiagramNodeEventMap<K1, D1>>(type: T, listener: (this: HTMLElement, ev: ojDiagramNodeEventMap<K1, D1>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDiagramNodeSettableProperties<K1, D1>>(property: T): ojDiagramNode<K1, D1>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDiagramNodeSettableProperties<K1, D1>>(property: T, value: ojDiagramNodeSettableProperties<K1, D1>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDiagramNodeSettableProperties<K1, D1>>): void;
    setProperties(properties: ojDiagramNodeSettablePropertiesLenient<K1, D1>): void;
}
export namespace ojDiagramNode {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type descendantsConnectivityChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["descendantsConnectivity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type iconChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["icon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type showDisclosureChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["showDisclosure"]>;
}
export interface ojDiagramNodeEventMap<K1 = any, D1 = any> extends dvtBaseComponentEventMap<ojDiagramNodeSettableProperties<K1, D1>> {
    'categoriesChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["categories"]>;
    'descendantsConnectivityChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["descendantsConnectivity"]>;
    'iconChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["icon"]>;
    'labelChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["labelStyle"]>;
    'overviewChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["overview"]>;
    'selectableChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["shortDesc"]>;
    'showDisclosureChanged': JetElementCustomEvent<ojDiagramNode<K1, D1>["showDisclosure"]>;
}
export interface ojDiagramNodeSettableProperties<K1 = any, D1 = any> extends dvtBaseComponentSettableProperties {
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
        shape?: 'circle' | 'rectangle' | 'square';
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number;
    };
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration> | null;
    overview?: {
        icon?: {
            shape?: 'inherit' | 'circle' | 'rectangle' | 'square' | string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
    };
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojDiagram.NodeShortDescContext<K1, D1>) => string));
    showDisclosure?: 'on' | 'off';
}
export interface ojDiagramNodeSettablePropertiesLenient<K1 = any, D1 = any> extends Partial<ojDiagramNodeSettableProperties<K1, D1>> {
    [key: string]: any;
}
export type DiagramElement<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = ojDiagram<K1, K2, D1, D2>;
export type DiagramChildContentElement = ojDiagramChildContent;
export type DiagramLinkElement<K1 = any, K2 = any, D2 = any> = ojDiagramLink<K1, K2, D2>;
export type DiagramNodeElement<K1 = any, D1 = any> = ojDiagramNode<K1, D1>;
export namespace DiagramElement {
    interface ojBeforeCollapse<K1> extends CustomEvent<{
        nodeId: K1;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand<K1> extends CustomEvent<{
        nodeId: K1;
        [propName: string]: any;
    }> {
    }
    interface ojBeforePanZoomReset extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojCollapse<K1> extends CustomEvent<{
        nodeId: K1;
        [propName: string]: any;
    }> {
    }
    interface ojExpand<K1> extends CustomEvent<{
        nodeId: K1;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type focusRendererChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["focusRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverRendererChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["hoverRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkContentChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkDataChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkHighlightModeChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["linkHighlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxZoomChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["maxZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minZoomChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["minZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeContentChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeDataChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeHighlightModeChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["nodeHighlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panDirectionChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panDirection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panZoomStateChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panZoomState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panningChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["panning"]>;
    // tslint:disable-next-line interface-over-type-literal
    type promotedLinkBehaviorChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["promotedLinkBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rendererChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["renderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRendererChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["selectionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomRendererChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["zoomRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomingChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = JetElementCustomEvent<ojDiagram<K1, K2, D1, D2>["zooming"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> = dvtBaseComponent.trackResizeChanged<ojDiagramSettableProperties<K1, K2, D1, D2>>;
    // tslint:disable-next-line interface-over-type-literal
    type DndNodeContext<K1, D1> = {
        componentElement: Element;
        data: ojDiagram.Node<K1>;
        id: K1;
        itemData: D1;
        label: string;
        nodeOffset: {
            x: number;
            y: number;
        };
        type: 'node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Link<K1, K2, D2 = any> = {
        categories?: string[];
        color?: string;
        endConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
        endNode: K2;
        id?: K1;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration> | null;
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: ojDiagram.LinkShortDescContext<K1, K2, D2>) => string));
        startConnectorType?: 'arrow' | 'arrowConcave' | 'arrowOpen' | 'circle' | 'none' | 'rectangle' | 'rectangleRounded';
        startNode: K2;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkContentTemplateContext<K1, K2, D2> = {
        componentElement: Element;
        data: ojDiagram.Link<K2, K1>;
        id: K2;
        itemData: D2 | D2[];
        parentElement: Element;
        points: any[] | string;
        previousState: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        rootElement: Element | null;
        state: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        type: 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkItemContext<K1, K2, D2> = {
        componentElement: Element;
        data: ojDiagram.Link<K2, K1>;
        id: K2;
        itemData: D2;
        label: string;
        type: 'link';
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkRendererContext<K1, K2, D2> = {
        componentElement: Element;
        data: ojDiagram.Link<K2, K1>;
        id: K2;
        itemData: D2 | D2[];
        parentElement: Element;
        points: any[] | string;
        previousState: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        rootElement: Element | null;
        state: {
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
        };
        type: 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkShortDescContext<K1, K2, D2> = {
        data: ojDiagram.Link<K2, K1> | ojDiagram.Link<K2, K1>[];
        id: K2;
        itemData: D2 | D2[];
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K1, D1 = any> = {
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
            shape?: 'circle' | 'rectangle' | 'square';
            source?: string;
            sourceHover?: string;
            sourceHoverSelected?: string;
            sourceSelected?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            width?: number;
        };
        id?: K1;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration> | null;
        overview?: {
            icon?: {
                shape?: 'inherit' | 'circle' | 'rectangle' | 'square' | string;
                svgClassName?: string;
                svgStyle?: Partial<CSSStyleDeclaration>;
            };
        };
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: ojDiagram.NodeShortDescContext<K1, D1>) => string));
        showDisclosure?: 'on' | 'off';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContentTemplateContext<K1, D1> = {
        componentElement: Element;
        content: {
            element: Element;
            height: number;
            width: number;
        };
        data: ojDiagram.Node<K1>;
        id: K1;
        itemData: D1;
        parentElement: Element;
        previousState: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
        rootElement: Element | null;
        state: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        type: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        index: number;
        subId: 'oj-diagram-link' | 'oj-diagram-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeItemContext<K1, D1> = {
        componentElement: Element;
        data: ojDiagram.Node<K1>;
        id: K1;
        itemData: D1;
        label: string;
        type: 'node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K1, D1> = {
        data: ojDiagram.Node<K1>;
        id: K1;
        itemData: D1;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeTemplateContext = {
        data: object;
        index: number;
        key: any;
        parentData: any[];
        parentKey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PromotedLinkItemContext<K1, K2, D2> = {
        componentElement: Element;
        data: ojDiagram.Link<K2, K1>[];
        id: K2;
        itemData: D2[];
        label: string;
        type: 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type RendererContext<K1, D1> = {
        componentElement: Element;
        content: {
            element: Element;
            height: number;
            width: number;
        };
        data: ojDiagram.Node<K1>;
        id: K1;
        itemData: D1;
        parentElement: Element;
        previousState: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
        rootElement: Element | null;
        state: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            inActionableMode: boolean;
            selected: boolean;
            zoom: number;
        };
        type: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K1, K2, D1, D2> = {
        componentElement: Element;
        data: ojDiagram.Node<K1> | ojDiagram.Link<K2, K1> | ojDiagram.Link<K2, K1>[];
        id: K1 | K2;
        itemData: D1 | D2 | D2[];
        label: string;
        parentElement: Element;
        type: 'node' | 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K1, K2, D1, D2> = {
        componentElement: Element;
        data: ojDiagram.Node<K1> | ojDiagram.Link<K2, K1> | ojDiagram.Link<K2, K1>[];
        id: K1 | K2;
        itemData: D1 | D2 | D2[];
        label: string;
        parentElement: Element;
        type: 'node' | 'link' | 'promotedLink';
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderLinkContentTemplate<K1, K2, D2> = import('ojs/ojvcomponent').TemplateSlot<LinkContentTemplateContext<K1, K2, D2>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderLinkTemplate = import('ojs/ojvcomponent').TemplateSlot<LinkTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeContentTemplate<K1, D1> = import('ojs/ojvcomponent').TemplateSlot<NodeContentTemplateContext<K1, D1>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K1, K2, D1, D2> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K1, K2, D1, D2>>;
}
export namespace DiagramLinkElement {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endConnectorTypeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["endConnectorType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endNodeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["endNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startConnectorTypeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["startConnectorType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startNodeChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["startNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged<K1 = any, K2 = any, D2 = any> = JetElementCustomEvent<ojDiagramLink<K1, K2, D2>["width"]>;
}
export namespace DiagramNodeElement {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type descendantsConnectivityChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["descendantsConnectivity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type iconChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["icon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type showDisclosureChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojDiagramNode<K1, D1>["showDisclosure"]>;
}
export interface DiagramIntrinsicProps extends Partial<Readonly<ojDiagramSettableProperties<any, any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeCollapse?: (value: ojDiagramEventMap<any, any, any, any>['ojBeforeCollapse']) => void;
    onojBeforeExpand?: (value: ojDiagramEventMap<any, any, any, any>['ojBeforeExpand']) => void;
    onojBeforePanZoomReset?: (value: ojDiagramEventMap<any, any, any, any>['ojBeforePanZoomReset']) => void;
    onojCollapse?: (value: ojDiagramEventMap<any, any, any, any>['ojCollapse']) => void;
    onojExpand?: (value: ojDiagramEventMap<any, any, any, any>['ojExpand']) => void;
    onanimationOnDataChangeChanged?: (value: ojDiagramEventMap<any, any, any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojDiagramEventMap<any, any, any, any>['animationOnDisplayChanged']) => void;
    onasChanged?: (value: ojDiagramEventMap<any, any, any, any>['asChanged']) => void;
    oncurrentItemChanged?: (value: ojDiagramEventMap<any, any, any, any>['currentItemChanged']) => void;
    ondndChanged?: (value: ojDiagramEventMap<any, any, any, any>['dndChanged']) => void;
    onexpandedChanged?: (value: ojDiagramEventMap<any, any, any, any>['expandedChanged']) => void;
    onfocusRendererChanged?: (value: ojDiagramEventMap<any, any, any, any>['focusRendererChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojDiagramEventMap<any, any, any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: ojDiagramEventMap<any, any, any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojDiagramEventMap<any, any, any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojDiagramEventMap<any, any, any, any>['hoverBehaviorChanged']) => void;
    onhoverRendererChanged?: (value: ojDiagramEventMap<any, any, any, any>['hoverRendererChanged']) => void;
    onlayoutChanged?: (value: ojDiagramEventMap<any, any, any, any>['layoutChanged']) => void;
    onlinkContentChanged?: (value: ojDiagramEventMap<any, any, any, any>['linkContentChanged']) => void;
    onlinkDataChanged?: (value: ojDiagramEventMap<any, any, any, any>['linkDataChanged']) => void;
    onlinkHighlightModeChanged?: (value: ojDiagramEventMap<any, any, any, any>['linkHighlightModeChanged']) => void;
    onmaxZoomChanged?: (value: ojDiagramEventMap<any, any, any, any>['maxZoomChanged']) => void;
    onminZoomChanged?: (value: ojDiagramEventMap<any, any, any, any>['minZoomChanged']) => void;
    onnodeContentChanged?: (value: ojDiagramEventMap<any, any, any, any>['nodeContentChanged']) => void;
    onnodeDataChanged?: (value: ojDiagramEventMap<any, any, any, any>['nodeDataChanged']) => void;
    onnodeHighlightModeChanged?: (value: ojDiagramEventMap<any, any, any, any>['nodeHighlightModeChanged']) => void;
    onoverviewChanged?: (value: ojDiagramEventMap<any, any, any, any>['overviewChanged']) => void;
    onpanDirectionChanged?: (value: ojDiagramEventMap<any, any, any, any>['panDirectionChanged']) => void;
    onpanZoomStateChanged?: (value: ojDiagramEventMap<any, any, any, any>['panZoomStateChanged']) => void;
    onpanningChanged?: (value: ojDiagramEventMap<any, any, any, any>['panningChanged']) => void;
    onpromotedLinkBehaviorChanged?: (value: ojDiagramEventMap<any, any, any, any>['promotedLinkBehaviorChanged']) => void;
    onrendererChanged?: (value: ojDiagramEventMap<any, any, any, any>['rendererChanged']) => void;
    onselectionChanged?: (value: ojDiagramEventMap<any, any, any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojDiagramEventMap<any, any, any, any>['selectionModeChanged']) => void;
    onselectionRendererChanged?: (value: ojDiagramEventMap<any, any, any, any>['selectionRendererChanged']) => void;
    onstyleDefaultsChanged?: (value: ojDiagramEventMap<any, any, any, any>['styleDefaultsChanged']) => void;
    ontooltipChanged?: (value: ojDiagramEventMap<any, any, any, any>['tooltipChanged']) => void;
    ontouchResponseChanged?: (value: ojDiagramEventMap<any, any, any, any>['touchResponseChanged']) => void;
    onzoomRendererChanged?: (value: ojDiagramEventMap<any, any, any, any>['zoomRendererChanged']) => void;
    onzoomingChanged?: (value: ojDiagramEventMap<any, any, any, any>['zoomingChanged']) => void;
    ontrackResizeChanged?: (value: ojDiagramEventMap<any, any, any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface DiagramChildContentIntrinsicProps extends Partial<Readonly<ojDiagramChildContentSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: ComponentChildren;
}
export interface DiagramLinkIntrinsicProps extends Partial<Readonly<ojDiagramLinkSettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: ojDiagramLinkEventMap<any, any, any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojDiagramLinkEventMap<any, any, any>['colorChanged']) => void;
    onendConnectorTypeChanged?: (value: ojDiagramLinkEventMap<any, any, any>['endConnectorTypeChanged']) => void;
    onendNodeChanged?: (value: ojDiagramLinkEventMap<any, any, any>['endNodeChanged']) => void;
    onlabelChanged?: (value: ojDiagramLinkEventMap<any, any, any>['labelChanged']) => void;
    onlabelStyleChanged?: (value: ojDiagramLinkEventMap<any, any, any>['labelStyleChanged']) => void;
    onselectableChanged?: (value: ojDiagramLinkEventMap<any, any, any>['selectableChanged']) => void;
    onshortDescChanged?: (value: ojDiagramLinkEventMap<any, any, any>['shortDescChanged']) => void;
    onstartConnectorTypeChanged?: (value: ojDiagramLinkEventMap<any, any, any>['startConnectorTypeChanged']) => void;
    onstartNodeChanged?: (value: ojDiagramLinkEventMap<any, any, any>['startNodeChanged']) => void;
    onsvgClassNameChanged?: (value: ojDiagramLinkEventMap<any, any, any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojDiagramLinkEventMap<any, any, any>['svgStyleChanged']) => void;
    onwidthChanged?: (value: ojDiagramLinkEventMap<any, any, any>['widthChanged']) => void;
    children?: ComponentChildren;
}
export interface DiagramNodeIntrinsicProps extends Partial<Readonly<ojDiagramNodeSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: ojDiagramNodeEventMap<any, any>['categoriesChanged']) => void;
    ondescendantsConnectivityChanged?: (value: ojDiagramNodeEventMap<any, any>['descendantsConnectivityChanged']) => void;
    oniconChanged?: (value: ojDiagramNodeEventMap<any, any>['iconChanged']) => void;
    onlabelChanged?: (value: ojDiagramNodeEventMap<any, any>['labelChanged']) => void;
    onlabelStyleChanged?: (value: ojDiagramNodeEventMap<any, any>['labelStyleChanged']) => void;
    onoverviewChanged?: (value: ojDiagramNodeEventMap<any, any>['overviewChanged']) => void;
    onselectableChanged?: (value: ojDiagramNodeEventMap<any, any>['selectableChanged']) => void;
    onshortDescChanged?: (value: ojDiagramNodeEventMap<any, any>['shortDescChanged']) => void;
    onshowDisclosureChanged?: (value: ojDiagramNodeEventMap<any, any>['showDisclosureChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-diagram": DiagramIntrinsicProps;
            "oj-diagram-child-content": DiagramChildContentIntrinsicProps;
            "oj-diagram-link": DiagramLinkIntrinsicProps;
            "oj-diagram-node": DiagramNodeIntrinsicProps;
        }
    }
}
