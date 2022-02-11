import { MessageItem, MessagesManager, MessageTemplateItem } from '@oracle/oraclejet-preact/UNSAFE_Message';
import { Item } from '@oracle/oraclejet-preact/utils/dataProvider';
import { ComponentChildren, ComponentProps, h, VNode } from 'preact';
declare type IntrinsicProps = Pick<ComponentProps<typeof MessagesManager>, 'startAnimation'>;
/**
 * Props for the MessageBanner Component
 */
declare type Props<Key, Data> = IntrinsicProps & {
    /**
     * Data for the MessageBanner component. This data is used for rendering each banner message.
     * The key for the each message will be configured using the key of the corresponding item. This way,
     * the component will know whether a new message is being or an existing message is being updated
     * when the new data comes in.
     */
    data: Item<Key, Data>[];
    /**
     * A Banner message can have a different look and feel. For example, when using page-level
     * messaging the messages need to be rendered from edge to edge without any outline. On the other
     * hand, when they are being used in a section of a page or a dialog, they need to be rendered
     * with an outline. This attribute can be used to specify where the component is being used so that
     * it will render the messages accordingly.
     */
    type?: 'page' | 'section';
    /**
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     */
    onClose?: (item: Item<Key, Data>) => void;
    /**
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the detail content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the detail content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an ItemContext and return a key to a template for
     * rendering the corresponding message's detail content. The value returned from this function
     * should be a key to one of the dynamic template slots provided. If the returned value is not
     * one of the keys of the provided dynamic template slots, the component will throw an Error.
     *
     * If the function returns null or undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detail-template, the detail-template will
     * take precedence and the corresponding template will be used for rendering the detail content.
     */
    detailRendererKey?: string | ((item: Item<Key, Data>) => string | null);
    /**
     * A set of available renderers for rendering the message content. Which renderer is used
     * for rendering which content will be decided by specific properties in the row data.
     */
    renderers?: Record<string, (data: MessageTemplateItem<Key, Data>) => ComponentChildren>;
    /**
     * A renderer that renders the close button in the message.
     */
    closeButtonRenderer?: (title: string, onAction: (event?: Event) => void) => VNode;
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
         * Text to guide keyboard users navigate to prior focussed element when the messages
         * region gains focus
         */
        navigationFromMessagesRegion?: string;
        /**
         * Text to guide keyboard users navigate to new displayed messages when focus is outside
         * the messages region
         */
        navigationToMessagesRegion?: string;
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
 * Renders individual messages based on the provided data
 */
declare function MessageBanner<K extends string | number = string | number, D extends MessageItem = MessageItem>({ closeButtonRenderer, detailRendererKey, data, onClose, renderers, startAnimation, translations, type }: Props<K, D>): h.JSX.Element | null;
export { MessageBanner };
export type { MessageItem as MessageBannerItem, MessageTemplateItem as MessageBannerTemplateItem };
