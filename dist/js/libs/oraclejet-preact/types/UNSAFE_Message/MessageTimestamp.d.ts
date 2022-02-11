/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from 'preact';
import { MessageVariant } from "./Message.types";
/**
 * Props for the Timestamp component
 */
declare type Props = {
    /**
     * The timestamp to show in ISO format
     */
    value: string;
    /**
     * Style variant
     */
    variant?: MessageVariant;
};
/**
 * Timestamp Component for rendering timestamp in Message
 */
declare function MessageTimestamp({ value, variant }: Props): h.JSX.Element;
export { MessageTimestamp };
