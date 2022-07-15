/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type Props = {
    /**
     * The text string to apply highlighting to.
     */
    children?: string;
    /**
     * The text string to match.
     */
    matchText?: string;
};
/**
 * Renders a text string with highlighting applied to the given text to match.
 */
export declare function HighlightText({ children, matchText }: Props): import("preact").JSX.Element;
export {};
