import { Item } from '@oracle/oraclejet-preact/utils/dataProvider';
import { ComponentChildren, h, Ref, VNode } from 'preact';
import { MessageSeverity } from './Message.types';
import { MessageTemplateItem } from './MessageDetail';
/**
 * An object representing a single message in Message component.
 */
export declare type MessageItem = {
    /**
     * Defines whether or not to include the close icon for the message
     */
    closeAffordance?: 'on' | 'off';
    /**
     * Defines the detail text of the message
     */
    detail?: string;
    /**
     * Defines the severity of the message
     */
    severity?: MessageSeverity;
    /**
     * Defines the sound to be played when opening the message
     */
    sound?: 'default' | 'none' | string;
    /**
     * Defines the primary text of the message
     */
    summary?: string;
    /**
     * Defines the timestamp for the message in ISO format
     */
    timestamp?: string;
};
/**
 * Type of the mutated Ref to allow setting focus
 */
declare type SimpleBannerMessageHandle = {
    /**
     * Method to set focus to the rendered message
     */
    focus: () => void;
    /**
     * Method to determine whether an element is inside this component
     * @param element The candidate element
     */
    contains: (element?: Element | null) => boolean;
};
/**
 * Props for the Message Component
 */
declare type Props<Key, Data> = {
    /**
     * A ref object for holding reference to this component
     */
    messageRef?: Ref<SimpleBannerMessageHandle>;
    /**
     * The index of the current message instance
     */
    index?: number;
    /**
     * The message item with all the necessary data in it
     */
    item: Item<Key, Data>;
    /**
     * A Banner message can have a different look and feel. For example, when using page-level
     * messaging the messages need to be rendered from edge to edge without any outline. On the other
     * hand, when they are being used in a section of a page or a dialog, they need to be rendered
     * with an outline. This attribute can be used to specify where the component is being used so that
     * it will render the messages accordingly.
     */
    type?: 'page' | 'section';
    /**
     * A renderer that renders the close button in the message.
     */
    closeButtonRenderer?: (title: string, onAction: (event?: Event) => void) => VNode;
    /**
     * A custom renderer for rendering the detail content
     */
    detailRenderer?: (item: MessageTemplateItem<Key, Data>) => ComponentChildren;
    /**
     * Triggered when a user tries to close a message through UI interaction. The parent
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message to be removed from the DOM. If the parent
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component.
     */
    onClose?: (item: Item<Key, Data>) => void;
    /**
     * Translations resources
     * TODO: Replace with preact translations when it is available
     */
    translations?: {
        /**
         * Label for the message close button
         */
        close?: string;
        /**
         * Text for 'error' severity level
         */
        error?: string;
        /**
         * Text for 'warning' severity level
         */
        warning?: string;
        /**
         * Text for 'info' severity level
         */
        info?: string;
        /**
         * Text for 'confirmation' severity level
         */
        confirmation?: string;
    };
};
/**
 * Component that renders an individual message
 */
declare function Message<K extends string | number = string | number, D extends MessageItem = MessageItem>({ closeButtonRenderer, detailRenderer, index, item, onClose, messageRef, translations, type }: Props<K, D>): h.JSX.Element;
export { Message };
