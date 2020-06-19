/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

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
    x: number;
    y: number;
    rotationPointX?: number;
    rotationPointY?: number;
    angle?: number;
    halign?: string;
    valign?: string;
};
