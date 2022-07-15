import { Property } from 'csstype';
declare type Props = {
    gridTemplateColumns?: Property.GridTemplateColumns;
    gridAutoRows?: Property.GridAutoRows;
};
declare const gridInterpolations: {
    gridTemplateColumns: ({ gridTemplateColumns }: Pick<Props, 'gridTemplateColumns'>) => {
        gridTemplateColumns?: undefined;
    } | {
        gridTemplateColumns: Property.GridTemplateColumns<0 | (string & {})>;
    };
    gridAutoRows: ({ gridAutoRows }: Pick<Props, 'gridAutoRows'>) => {
        gridAutoRows?: undefined;
    } | {
        gridAutoRows: Property.GridAutoRows<0 | (string & {})>;
    };
};
export { gridInterpolations };
export declare type GridProps = Props;
