import { JSX, RefObject, Ref } from 'preact';
import { Offset, Placement, Coords, Rect } from '../hooks/UNSAFE_useFloating';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;
declare type Props = IntrinsicProps & {
    /**
     * Placement of the popup element relative to the trigger.
     */
    placement?: Placement;
    /**
     * Trigger element reference.
     */
    anchorRef: RefObject<Element | Coords>;
    /**
     * Placement offset.
     */
    offsetValue?: Offset;
    /**
     * Click outside callback.
     */
    onClickOutside?: (event: MouseEvent) => void;
};
export declare const Floating: import("preact").FunctionalComponent<Omit<Props, "ref"> & {
    ref?: Ref<HTMLElement> | undefined;
}>;
export { Offset, Placement, Coords, Rect };
