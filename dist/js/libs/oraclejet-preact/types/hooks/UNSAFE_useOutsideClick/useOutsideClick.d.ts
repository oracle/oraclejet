/**
 * `useClickOutside` hook for capturing clicking outside of an element
 */
import { RefObject } from 'preact';
declare type Props = {
    /**
     * If true outside click is disabled
     */
    isDisabled?: boolean;
    /**
     * Reference to element or array of elements relative to which outside click is performed
     */
    ref: RefObject<HTMLElement> | RefObject<HTMLElement>[];
    /**
     * Outside click callback
     */
    handler?: (event: MouseEvent) => void;
};
declare const useOutsideClick: ({ isDisabled: disabled, ref, handler }: Props) => void;
export default useOutsideClick;
