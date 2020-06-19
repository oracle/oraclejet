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
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    dnd: {
        drag: {
            nodes: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: {
                    nodes: ojDiagram.DndNodeContext<K1, D1>[];
                }) => void);
            };
            ports: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: {
                    ports: {
                        portElement: Element;
                        dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    };
                }) => void);
                linkStyle: ((context: {
                    portElement: Element;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => ({
                    svgStyle?: CSSStyleDeclaration;
                    svgClassName?: string;
                } | null));
                selector: string;
            };
        };
        drop: {
            background: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                drop: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
            };
            links: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                drop: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
            };
            nodes: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                drop: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
            };
            ports: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                drop: ((event: Event, context: {
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
    layout: ((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => void);
    linkContent: {
        focusRenderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => ({
            insert: SVGElement;
        }));
        selectionRenderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
    };
    linkData: DataProvider<K2, D2> | null;
    linkHighlightMode: 'linkAndNodes' | 'link';
    maxZoom: number;
    minZoom: number;
    nodeContent: {
        focusRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
            insert: SVGElement;
        }));
        selectionRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        zoomRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
    };
    nodeData: DataProvider<K1, D1> | null;
    nodeHighlightMode: 'nodeAndIncomingLinks' | 'nodeAndOutgoingLinks' | 'nodeAndLinks' | 'node';
    overview: {
        fitArea: 'content' | 'canvas';
        halign: 'start' | 'end' | 'center';
        height: number;
        preserveAspectRatio: 'none' | 'meet';
        rendered: 'on' | 'off';
        valign: 'top' | 'bottom' | 'middle';
        width: number;
    };
    panDirection: 'x' | 'y' | 'auto';
    panning: 'fixed' | 'centerContent' | 'none' | 'auto';
    promotedLinkBehavior: 'none' | 'full' | 'lazy';
    renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
        insert: SVGElement;
    }));
    selection: Array<K1 | K2>;
    selectionMode: 'none' | 'single' | 'multiple';
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
    type DndNodeContext<K1, D1> = {
        nodeOffset: {
            x: number;
            y: number;
        };
        componentElement: Element;
        id: K1;
        type: 'node';
        label: string;
        data: Node<K1>;
        itemData: D1;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Link<K2, K1> = {
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
    type LinkItemContext<K1, K2, D2> = {
        componentElement: Element;
        id: K2;
        type: 'link';
        label: string;
        data: Link<K2, K1>;
        itemData: D2;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkRendererContext<K1, K2, D2> = {
        parentElement: Element;
        componentElement: Element;
        rootElement: Element | null;
        data: Link<K2, K1>;
        itemData: D2 | D2[];
        state: {
            hovered: boolean;
            selected: boolean;
            focused: boolean;
        };
        previousState: {
            hovered: boolean;
            selected: boolean;
            focused: boolean;
        };
        id: K2;
        type: 'link' | 'promotedLink';
        points: any[] | string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K1> = {
        id?: K1;
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
    type NodeContext = {
        subId: 'oj-diagram-link' | 'oj-diagram-node';
        index: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeItemContext<K1, D1> = {
        componentElement: Element;
        id: K1;
        type: 'node';
        label: string;
        data: Node<K1>;
        itemData: D1;
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
        id: K2;
        type: 'promotedLink';
        label: string;
        data: Link<K2, K1>[];
        itemData: D2[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type RendererContext<K1, D1> = {
        parentElement: Element;
        componentElement: Element;
        rootElement: Element | null;
        data: Node<K1>;
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
        type: 'node' | 'link' | 'promotedLink';
        label: string;
        data: Node<K1> | Link<K2, K1> | Link<K2, K1>[];
        itemData: D1 | D2 | D2[];
    };
}
export interface ojDiagramEventMap<K1, K2, D1 extends ojDiagram.Node<K1> | any, D2 extends ojDiagram.Link<K2, K1> | any> extends dvtBaseComponentEventMap<ojDiagramSettableProperties<K1, K2, D1, D2>> {
    'ojBeforeCollapse': ojDiagram.ojBeforeCollapse<K1>;
    'ojBeforeExpand': ojDiagram.ojBeforeExpand<K1>;
    'ojCollapse': ojDiagram.ojCollapse<K1>;
    'ojExpand': ojDiagram.ojExpand<K1>;
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
                dragStart: ((event: Event, context: {
                    nodes: ojDiagram.DndNodeContext<K1, D1>[];
                }) => void);
            };
            ports: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: {
                    ports: {
                        portElement: Element;
                        dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    };
                }) => void);
                linkStyle: ((context: {
                    portElement: Element;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => ({
                    svgStyle?: CSSStyleDeclaration;
                    svgClassName?: string;
                } | null));
                selector: string;
            };
        };
        drop: {
            background: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
                drop: ((event: Event, context: {
                    x: number;
                    y: number;
                }) => void);
            };
            links: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
                drop: ((event: Event, context: {
                    x: number;
                    y: number;
                    linkContext: ojDiagram.LinkItemContext<K1, K2, D2> | ojDiagram.PromotedLinkItemContext<K1, K2, D2>;
                }) => void);
            };
            nodes: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
                drop: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    nodeContext: ojDiagram.NodeItemContext<K1, D1>;
                }) => void);
            };
            ports: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragLeave: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                dragOver: ((event: Event, context: {
                    x: number;
                    y: number;
                    nodeX: number;
                    nodeY: number;
                    dataContext: ojDiagram.NodeItemContext<K1, D1>;
                    portElement: Element;
                }) => void);
                drop: ((event: Event, context: {
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
    layout: ((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => void);
    linkContent: {
        focusRenderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => ({
            insert: SVGElement;
        }));
        selectionRenderer: ((context: ojDiagram.LinkRendererContext<K1, K2, D2>) => {
            insert: SVGElement;
        } | void) | null;
    };
    linkData: DataProvider<K2, D2> | null;
    linkHighlightMode: 'linkAndNodes' | 'link';
    maxZoom: number;
    minZoom: number;
    nodeContent: {
        focusRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        hoverRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
            insert: SVGElement;
        }));
        selectionRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
        zoomRenderer: ((context: ojDiagram.RendererContext<K1, D1>) => {
            insert: SVGElement;
        } | void) | null;
    };
    nodeData: DataProvider<K1, D1> | null;
    nodeHighlightMode: 'nodeAndIncomingLinks' | 'nodeAndOutgoingLinks' | 'nodeAndLinks' | 'node';
    overview: {
        fitArea: 'content' | 'canvas';
        halign: 'start' | 'end' | 'center';
        height: number;
        preserveAspectRatio: 'none' | 'meet';
        rendered: 'on' | 'off';
        valign: 'top' | 'bottom' | 'middle';
        width: number;
    };
    panDirection: 'x' | 'y' | 'auto';
    panning: 'fixed' | 'centerContent' | 'none' | 'auto';
    promotedLinkBehavior: 'none' | 'full' | 'lazy';
    renderer: ((context: ojDiagram.RendererContext<K1, D1>) => ({
        insert: SVGElement;
    }));
    selection: Array<K1 | K2>;
    selectionMode: 'none' | 'single' | 'multiple';
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
