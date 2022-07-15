/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Plays an audio using the URL specified.
 *
 * @param url The URL of the audio file
 * @returns A promise that resolves when the audio is play or rejects if there are any issues
 */
export declare function playAudioFromURL(url: string): Promise<void | Error>;
/**
 * Plays a notification sound using WebAudio API
 *
 * @throws {Error} Throws an error if WebAudio is not supported
 */
export declare function playDefaultNotificationSound(): void;
