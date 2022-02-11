/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChild, h } from 'preact';
import { Item } from '@oracle/oraclejet-preact/utils/dataProvider';
/**
 * A type that defines animation configuration
 */
declare type MessageAnimation = {
    effect?: string;
    duration?: string | number;
    direction?: string;
};
/**
 * Type of the render context passed on to render individual message
 */
declare type MessageRenderContext<Key, Data> = {
    /**
     * The index of the current message
     */
    index: number;
    /**
     * The message item with all the necessary data in it
     */
    item: Item<Key, Data>;
};
declare type StartAnimType = (element: Element, action: string, effects: string | object | (string | object)[], component?: object) => Promise<unknown>;
/**
 * Props for the Message Component
 */
declare type Props<Key, Data> = {
    /**
     * An object of various animation effects for the transitions.
     */
    animations?: Record<string, MessageAnimation[]>;
    /**
     * A render function that renders individual child.
     */
    children?: (context: MessageRenderContext<Key, Data>) => ComponentChild;
    /**
     * Data for the messages. This data is used for rendering each message.
     */
    data: Item<Key, Data>[];
    /**
     * Method for starting an animation.
     */
    startAnimation?: StartAnimType;
    /**
     * A callback function that gets called before a message is removed
     */
    onMessageWillRemove?: (key: Key, index: number) => void;
};
/**
 * The component that renders individual messages for the provided data.
 */
declare function MessagesManager<K extends string | number = string | number, D = any>(props: Props<K, D>): h.JSX.Element;
export { MessageAnimation, MessagesManager };
