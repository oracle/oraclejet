/**
 * This file contains prop => style functions related to a UI elements
 * dimensions.
 * Style interpolations are functions from props to UI styling.
 * This technique is often used in Styled Components to provide consistent,
 * reusable styled props API.
 */
import { StandardProperties } from "csstype";
import { Size } from "./size";
declare const dimensions: ("height" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "width")[];
declare type Dimension = typeof dimensions[number];
export declare type DimensionProps = Pick<StandardProperties<Size>, Dimension>;
declare const interpolations: {
    height: (props: Pick<DimensionProps, "height">) => {} | import("csstype").Property.Height<Size>;
    maxHeight: (props: Pick<DimensionProps, "maxHeight">) => {} | import("csstype").Property.MaxHeight<Size>;
    maxWidth: (props: Pick<DimensionProps, "maxWidth">) => {} | import("csstype").Property.MaxWidth<Size>;
    minHeight: (props: Pick<DimensionProps, "minHeight">) => {} | import("csstype").Property.MinHeight<Size>;
    minWidth: (props: Pick<DimensionProps, "minWidth">) => {} | import("csstype").Property.MinWidth<Size>;
    width: (props: Pick<DimensionProps, "width">) => {} | import("csstype").Property.Width<Size>;
};
export { dimensions, interpolations };
