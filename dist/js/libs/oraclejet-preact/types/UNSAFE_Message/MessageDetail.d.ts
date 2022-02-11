/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ItemMetadata } from '@oracle/oraclejet-preact/utils/dataProvider';
import { ComponentChildren, h } from 'preact';
import { MessageVariant } from './Message.types';
/**
 * Structure of template item used for dynamic templates
 */
declare type MessageTemplateItem<K, D> = {
    /**
     * The data for the current message
     */
    data: D;
    /**
     * The zero-based index of the current message
     */
    index: number;
    /**
     * The key for the current message
     */
    key: K;
    /**
     * The metadata for the current message
     */
    metadata?: ItemMetadata<K>;
};
/**
 * Props for the Detail component
 */
declare type Props<K, D> = {
    /**
     * The template item for rendering the detail content
     */
    item: MessageTemplateItem<K, D>;
    /**
     * A custom renderer for rendering the detail content
     */
    renderer?: (item: MessageTemplateItem<K, D>) => ComponentChildren;
    /**
     * Style variant
     */
    variant?: MessageVariant;
};
/**
 * Detail Component for rendering the detail content of the Message
 */
declare function MessageDetail<K, D>({ item, renderer, variant }: Props<K, D>): h.JSX.Element | null;
export { MessageDetail, MessageTemplateItem };
