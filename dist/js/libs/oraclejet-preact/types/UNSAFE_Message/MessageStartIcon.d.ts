/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from 'preact';
import { MessageSeverity, MessageVariant } from './Message.types';
/**
 * Props for the StartIcon component
 */
declare type Props = {
    /**
     * The icon severity
     */
    severity: Exclude<MessageSeverity, 'none'>;
    /**
     * Style variant
     */
    variant?: MessageVariant;
    /**
     * Translations resources
     * TODO: Replace with preact translations when it is available
     */
    translations?: {
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
 * StartIcon Component for rendering the severity based icon in Message
 */
declare function MessageStartIcon({ severity, variant, translations }: Props): h.JSX.Element;
export { MessageStartIcon };
