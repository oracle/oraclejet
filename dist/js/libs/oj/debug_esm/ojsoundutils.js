/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
class SoundUtils {
    static playDefaultNotificationSound() {
        const audioContext = SoundUtils._getAudioContext();
        const oscillatorNode = audioContext.createOscillator();
        oscillatorNode.connect(audioContext.destination);
        oscillatorNode.start(0);
        oscillatorNode.stop(audioContext.currentTime + 0.1);
    }
    static playAudioFromURL(url) {
        let resolve;
        let reject;
        const returnPromise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });
        const audioElement = document.createElement('audio');
        audioElement.src = url;
        audioElement.addEventListener('error', reject);
        (audioElement.play() || Promise.resolve()).then(resolve, reject).catch(reject);
        return returnPromise;
    }
    static _getAudioContext() {
        if (SoundUtils._audioContext) {
            return SoundUtils._audioContext;
        }
        if (SoundUtils._audioContext === null) {
            throw new Error('Browser does not support WebAudio API');
        }
        try {
            SoundUtils._audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        catch (e) {
            SoundUtils._audioContext = null;
            throw new Error('Browser does not support WebAudio API');
        }
        return SoundUtils._audioContext;
    }
}

export { SoundUtils };
