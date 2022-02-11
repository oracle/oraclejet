/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { Item } from '@oracle/oraclejet-preact/utils/dataProvider';
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
export { getRenderer, playSound, throwError };
