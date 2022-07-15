import { ComponentChildren } from 'preact';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
declare type Props = DimensionProps & {
    children?: ComponentChildren;
};
/**
 * Center is a convenience component that creates a flexbox
 * with justifyContent: center and alignItems: center.
 * TODO: How do I add background-color, border, etc?
 *
 */
declare function Center({ children, width, height, ...props }: Props): import("preact").JSX.Element;
export { Center };
