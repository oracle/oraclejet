import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import type { BorderProps } from '../utils/UNSAFE_interpolations/borders';
import { WithRequired } from '../utils/UNSAFE_typeUtils';
declare const dimensions: ("height" | "width")[];
declare type Dimension = typeof dimensions[number];
declare const border: "borderRadius"[];
declare type BorderRadius = typeof border[number];
declare type StyleInterpolationProps = Pick<DimensionProps, Dimension>;
declare type BorderRadiusProps = Pick<BorderProps, BorderRadius>;
declare type SkeletonProps = WithRequired<StyleInterpolationProps, 'height'> & BorderRadiusProps;
/**
 * Skeleton component allows the appropriate skeleton to be rendered based on the
 * property values
 **/
export declare function Skeleton({ ...props }: SkeletonProps): import("preact").JSX.Element;
export {};
