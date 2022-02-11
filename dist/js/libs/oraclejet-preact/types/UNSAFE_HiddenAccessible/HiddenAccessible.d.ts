import { h, ComponentChildren } from 'preact';
declare type HiddenAccessibleProps = {
    /**
     * Specifies the ComponentChildren
     */
    children?: ComponentChildren;
};
/**
 * HiddenAccessible is a helper component that hides its children visually,
 * but keeps them visible to screen readers.
 *
 */
declare function HiddenAccessible({ children }: HiddenAccessibleProps): h.JSX.Element;
export { HiddenAccessible };
