/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

    /**
     * @classdesc
     * A utility class with helpers to play audio
     */
    class SoundUtils {
        /**
         * Plays a notification sound using WebAudio API
         *
         * @throws {Error} Throws an error if WebAudio is not supported
         */
        static playDefaultNotificationSound() {
            const audioContext = SoundUtils._getAudioContext();
            // Now that we know WebAudio API is supported, play a beep sound
            // We will be using the default gain node, so simply creating an
            // oscillator node should suffice.
            const oscillatorNode = audioContext.createOscillator();
            // For simple beep, we will be using the default values in the oscillator.
            // sine wave, with frequency 440Hz.
            // Connect the oscillatorNode to the default destination and play the sound
            // for 100ms
            oscillatorNode.connect(audioContext.destination);
            oscillatorNode.start(0);
            oscillatorNode.stop(audioContext.currentTime + 0.1); // 0.1 = 100ms
        }
        /**
         * Plays an audio using the URL specified.
         *
         * @param url The URL of the audio file
         *
         * @returns {Promise<void, Error>} A promise that resolves when the audio is play or rejects if there are any issues
         */
        static playAudioFromURL(url) {
            let resolve;
            let reject;
            const returnPromise = new Promise((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            });
            // Using an <audio> element is simple for our use case.
            const audioElement = document.createElement('audio');
            audioElement.src = url;
            // Attach a listener for Invalid URL
            audioElement.addEventListener('error', reject);
            // Play the audio
            // Some older browsers will not return a Promise, like IE. Though we do not have to support them
            // it is safe to handle to it.
            (audioElement.play() || Promise.resolve()).then(resolve, reject).catch(reject);
            return returnPromise;
        }
        ////////////////////////////
        // Private helper methods //
        ////////////////////////////
        /**
         * Creates a new audioContext or reuses the existing audioContext.
         *
         * @returns The audioContext instance
         * @throws {Error} Throws an error if WebAudio is not supported
         */
        static _getAudioContext() {
            // If we have already created an instance, then return the stored instance
            if (SoundUtils._audioContext) {
                return SoundUtils._audioContext;
            }
            // If we have the stored instance as null (not undefined, which represents we have not tried
            // creating an instance of AudioContext yet), then WebAudio is not supported. Then throw an error
            if (SoundUtils._audioContext === null) {
                throw new Error('Browser does not support WebAudio API');
            }
            // AudioContext is not created yet, try creating one.
            try {
                SoundUtils._audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            catch (e) {
                // WebAudio is not supported, store the value as null and throw an error
                SoundUtils._audioContext = null;
                throw new Error('Browser does not support WebAudio API');
            }
            // Return the successfully created audioContext
            return SoundUtils._audioContext;
        }
    }

    exports.SoundUtils = SoundUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

});
