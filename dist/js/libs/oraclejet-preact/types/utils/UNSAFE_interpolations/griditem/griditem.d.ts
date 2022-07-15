import { Property } from 'csstype';
export declare type GridProps = {
    gridColumn?: Property.GridColumn;
};
declare const gridItemInterpolations: {
    gridColumn: ({ gridColumn }: Pick<GridProps, 'gridColumn'>) => {
        gridColumn?: undefined;
    } | {
        gridColumn: Property.GridColumn;
    };
};
export { gridItemInterpolations };
