declare class DiagramUtils {
    static getLayout(obj: {
        nodes: {
            id: any;
            x: number;
            y: number;
            labelLayout: DiagramUtils.LabelLayout;
        };
        links: {
            id: any;
            path: string;
            coordinateSpace: any;
            labelLayout: DiagramUtils.LabelLayout;
        };
        nodeDefaults: {
            labelLayout: DiagramUtils.LabelLayout | function(DvtDiagramLayoutContext, DvtDiagramLayoutContextNode):DiagramUtils.LabelLayout;
        };
        linkDefaults: {
            path: function(DvtDiagramLayoutContext, DvtDiagramLayoutContextLink):string;
            labelLayout: function(DvtDiagramLayoutContext, DvtDiagramLayoutContextLink):DiagramUtils.LabelLayout;
        };
        viewport: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
    }): function(DvtDiagramLayoutContext):void;
}
declare namespace DiagramUtils {
    // tslint:disable-next-line interface-over-type-literal
    type LabelLayout = {
        x: number;
        y: number;
        rotationPointX: number;
        rotationPointY: number;
        angle: number;
        halign: string;
        valign: string;
    };
}
export = DiagramUtils;
