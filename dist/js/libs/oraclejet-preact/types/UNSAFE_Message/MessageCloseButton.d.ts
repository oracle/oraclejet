/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h, VNode } from 'preact';
import { MessageVariant } from './Message.types';
/**
 * Props for the MessageCloseButton component
 */
declare type Props = {
    /**
     * The callback function to be called when the close icon is clicked
     */
    onAction: (event?: Event) => void;
    /**
     * Button renderer
     */
    buttonRenderer?: (title: string, onAction: (event?: Event) => void, variant?: MessageVariant) => VNode;
    /**
     * Style variant
     */
    variant?: MessageVariant;
    /**
     * Close button title
     */
    title?: string;
};
/**
 * A Component for rendering the message close button
 */
declare function MessageCloseButton({ onAction, buttonRenderer, title, variant }: Props): h.JSX.Element;
export { MessageCloseButton };
