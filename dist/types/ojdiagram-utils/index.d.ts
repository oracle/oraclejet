import { DvtDiagramLayoutContext, DvtDiagramLayoutContextNode, DvtDiagramLayoutContextLink } from '../ojdiagram';
export function getLayout<K1, K2, D1, D2>(obj: {
    nodes: Array<{
        id: K1;
        x: number;
        y: number;
        labelLayout?: LabelLayout;
    }>;
    links?: Array<{
        id: K2;
        path?: string;
        coordinateSpace?: K1;
        labelLayout?: LabelLayout;
    }>;
    nodeDefaults?: {
        labelLayout: LabelLayout | ((context: DvtDiagramLayoutContext<K1, K2, D1, D2>, node: DvtDiagramLayoutContextNode<K1, D1>) => LabelLayout);
    };
    linkDefaults?: {
        path?: (context: DvtDiagramLayoutContext<K1, K2, D1, D2>, link: DvtDiagramLayoutContextLink<K1, K2, D2>) => string;
        labelLayout?: (context: DvtDiagramLayoutContext<K1, K2, D1, D2>, link: DvtDiagramLayoutContextLink<K1, K2, D2>) => LabelLayout;
    };
    panZoomState?: {
        zoom: number;
        centerX: number;
        centerY: number;
    } | ((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => {
        zoom: number;
        centerY: number;
        centerX: number;
    });
    viewport?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | ((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => {
        x: number;
        y: number;
        w: number;
        h: number;
    });
}): (context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => void;
// tslint:disable-next-line interface-over-type-literal
export type LabelLayout = {
    angle?: number;
    halign?: string;
    rotationPointX?: number;
    rotationPointY?: number;
    valign?: string;
    x: number;
    y: number;
};
