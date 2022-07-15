declare type Props = {
    /**
     * Whether this live region is atomic
     */
    atomic?: 'true' | 'false';
    /**
     * The text to be read out in the live region
     */
    children?: string;
    /**
     * Timeout for updating the text
     */
    timeout?: number;
    /**
     * The value for the aria-live attribute
     */
    type?: 'assertive' | 'polite' | 'off';
};
/**
 * A helper component that renders an aria-live region
 *
 * TODO: Create a more centralized component that can handle aria-live region for
 * the whole application and use context api to communicate
 */
declare function LiveRegion({ atomic, children, timeout, type }: Props): import("preact").JSX.Element;
export { LiveRegion };
