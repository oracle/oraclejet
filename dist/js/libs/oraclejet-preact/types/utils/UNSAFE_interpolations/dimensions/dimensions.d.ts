import { Size } from '../../../utils/UNSAFE_size';
declare const dimensions: ("height" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "width")[];
declare type Dimension = typeof dimensions[number];
export declare type DimensionProps = {
    [key in Dimension]?: Size;
};
declare type Interpolations = {
    [Key in keyof DimensionProps]-?: (props: Pick<DimensionProps, Key>) => {} | Record<string, string>;
};
declare const dimensionInterpolations: Interpolations;
export { dimensions, dimensionInterpolations };
