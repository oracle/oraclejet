/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { Item } from '../utils/UNSAFE_dataProvider';
import { MessageSeverity, MessageVariant } from './Message.types';
/**
 * Plays a sound based on the provided argument. Supported keywords:
 * 1. default - plays the default beep sound
 * 2. none - no sound will be played
 *
 * @param sound Supported keywords or URL to an audio file
 */
declare function playSound(sound: string): Promise<void>;
/**
 * A helper function that throws an error
 *
 * @param message The error message
 * @param type The type of the message that is throwing an error
 * @throws {Error}
 */
declare function throwError(message: string, type?: string): void;
/**
 * Fetches a renderer for the current message if one is provided
 *
 * @param message The item context for the current message
 * @param rendererIdentifier Identifier of the current renderer
 * @param renderers All available renderers
 * @returns The renderer for rendering the custom content
 */
declare function getRenderer<K, D, R>(message: Item<K, D>, rendererIdentifier?: string | ((item: Item<K, D>) => string | null), renderers?: Record<string, (data: R) => ComponentChildren>, type?: string): ((data: R) => ComponentChildren) | undefined;
/**
 * Generates a root style class based on the severity. For invalid severity and severity=none
 * no specific style class exists.
 *
 * @param severity The message severity
 * @returns calculated style class based on the severity
 */
declare function severityBasedStyleClass(severity: MessageSeverity, variant: MessageVariant): string;
/**
 * Determines if a severity icon is needed based on the component severity
 *
 * @param severity The component severity
 * @returns Whether or not to render the severity icon
 */
declare function isSeverityIconNeeded(severity: MessageSeverity): severity is Exclude<MessageSeverity, 'none'>;
export { getRenderer, playSound, throwError, severityBasedStyleClass, isSeverityIconNeeded };
