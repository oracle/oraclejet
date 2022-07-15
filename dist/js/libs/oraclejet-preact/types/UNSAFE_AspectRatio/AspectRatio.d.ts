import { VNode } from 'preact';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
export declare const ratios: ("9/16" | "1/1" | "6/5" | "5/4" | "4/3" | "11/8" | "1.43/1" | "3/2" | "14/9" | "16/10" | "1.6180/1" | "5/3" | "16/9" | "1.85/1" | "1.9/1" | "2/1" | "2.2/1" | "64/21" | "2.4/1" | "2.414/1" | "2.76/1" | "32/9" | "18/5" | "4/1")[];
declare type Ratio = typeof ratios[number];
declare const dimensions: ("maxWidth" | "minWidth" | "width")[];
declare type Dimension = typeof dimensions[number];
declare type StyleInterpolationProps = Pick<DimensionProps, Dimension>;
declare type AspectRatioProps = StyleInterpolationProps & {
    /**
     * The box’s preferred aspect ratio is the specified ratio of width / height. When ratio is 1/1
     * it is a square.
     */
    ratio?: Ratio;
    /**
     * The child.
     */
    children: VNode<any>;
};
/**
 * The AspectRatio component displays its content with a certain ratio based on the dimension
 * properties. Overflow content is hidden.
 *
 * It uses a common padding-bottom hack to do this. In future versions it will
 * be implemented using the CSS's aspect-ratio property when the browsers we need to support
 * all have it. For example, Safari 15 has it, but we won't drop Safari 14 until jet 14.
 *
 */
export declare function AspectRatio({ children, ratio, ...props }: AspectRatioProps): import("preact").JSX.Element;
export {};
