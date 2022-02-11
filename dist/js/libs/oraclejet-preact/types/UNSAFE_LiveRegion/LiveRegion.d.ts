import { h } from 'preact';
declare type Props = {
    /**
     * The text to be read out in the live region
     */
    text?: string;
    /**
     * Timeout for updating the text
     */
    timeout?: number;
    /**
     * The value for the aria-live attribute
     */
    type?: 'assertive' | 'polite' | 'off';
    /**
     * Whether this live region is atomic
     */
    atomic?: 'true' | 'false';
};
/**
 * A helper component that renders an aria-live region
 *
 * TODO: Create a more centralized component that can handle aria-live region for
 * the whole application and use context api to communicate
 */
declare function LiveRegion({ atomic, text, timeout, type }: Props): h.JSX.Element;
export { LiveRegion };
