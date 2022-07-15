import { JSX, RefObject } from 'preact';
import { Offset, Placement, Coords } from '../../UNSAFE_Floating';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'id' | 'children'>;
declare type Props = IntrinsicProps & {
    /**
     * Click outside callback.
     */
    onClickOutside?: (event: MouseEvent) => void;
    /**
     * Placement of the popup element relative to the trigger.
     */
    placement?: Placement;
    /**
     * Trigger element reference.
     */
    anchorRef: RefObject<HTMLElement | Coords>;
    /**
     * Placement offset.
     */
    offsetValue?: Offset;
    /**
     * Determines whether the Popover is open.
     */
    isOpen: boolean;
};
export declare const Popover: ({ children, onClickOutside, placement, anchorRef, isOpen, offsetValue }: Props) => JSX.Element | null;
export {};
