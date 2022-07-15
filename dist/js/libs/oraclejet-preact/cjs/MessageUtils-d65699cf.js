/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var utils_UNSAFE_logger = require('./utils/UNSAFE_logger.js');
var utils_UNSAFE_soundUtils = require('./utils/UNSAFE_soundUtils.js');
var MessageFormattingUtils = require('./MessageFormattingUtils-d406c991.js');

/**
 * Logger that prepends the component name to the message
 */
const MessageLogger = {
    error: (message, type = 'common') => utils_UNSAFE_logger.Logger.error(`JET Message(${type}): ${message}`),
    warn: (message, type = 'common') => utils_UNSAFE_logger.Logger.warn(`JET Message(${type}): ${message}`),
    info: (message, type = 'common') => utils_UNSAFE_logger.Logger.info(`JET Message(${type}): ${message}`),
    log: (message, type = 'common') => utils_UNSAFE_logger.Logger.log(`JET Message(${type}): ${message}`)
};
/**
 * Plays a sound based on the provided argument. Supported keywords:
 * 1. default - plays the default beep sound
 * 2. none - no sound will be played
 *
 * @param sound Supported keywords or URL to an audio file
 */
async function playSound(sound) {
    if (sound === 'none') {
        // no need to play any audio
        return;
    }
    // For default, we play a beep sound using WebAudio API
    if (sound === 'default') {
        try {
            utils_UNSAFE_soundUtils.playDefaultNotificationSound();
        }
        catch (error) {
            // Default sound is not played due to some error
            // Log a message and return doing nothing else
            MessageLogger.warn(`Failed to play the default sound. ${error}.`);
        }
        return;
    }
    // If it is not a key word, then it is an URL
    try {
        await utils_UNSAFE_soundUtils.playAudioFromURL(sound);
    }
    catch (error) {
        // Playing audio using the URL failed.
        MessageLogger.warn(`Failed to play the audio from the url ${sound}. ${error}.`);
    }
}
/**
 * A helper function that throws an error
 *
 * @param message The error message
 * @param type The type of the message that is throwing an error
 * @throws {Error}
 */
function throwError(message, type = 'common') {
    throw new Error(`JET Message(${type}) - ${message}`);
}
/**
 * Fetches a renderer for the current message if one is provided
 *
 * @param message The item context for the current message
 * @param rendererIdentifier Identifier of the current renderer
 * @param renderers All available renderers
 * @returns The renderer for rendering the custom content
 */
function getRenderer(message, rendererIdentifier, renderers, type) {
    // If either detailRenderer function or record of renderers are not available,
    // return null
    if (!rendererIdentifier || !renderers) {
        return undefined;
    }
    const rendererKey = typeof rendererIdentifier === 'function' ? rendererIdentifier(message) : rendererIdentifier;
    // If rendererKey is null or undefined, then we need to use default rendering
    // so return null
    if (rendererKey == null) {
        return undefined;
    }
    // If the returned render key is a string but does not exist in the provided
    // record of dynamic template slots, throw an error
    if (!(rendererKey in renderers)) {
        throwError(`${rendererKey} is not a valid template name for the message with key=${message.key}`, type);
    }
    // Else, fetch and return the renderer
    return renderers[rendererKey];
}
/**
 * Generates a root style class based on the severity. For invalid severity and severity=none
 * no specific style class exists.
 *
 * @param severity The message severity
 * @returns calculated style class based on the severity
 */
function severityBasedStyleClass(severity, variant) {
    const isValidSeverity = MessageFormattingUtils.isValidValueForProp(severity, 'severity');
    return isValidSeverity && severity !== 'none' ? `oj-c-message${variant}-${severity}` : '';
}
/**
 * Determines if a severity icon is needed based on the component severity
 *
 * @param severity The component severity
 * @returns Whether or not to render the severity icon
 */
function isSeverityIconNeeded(severity) {
    const isValidSeverity = MessageFormattingUtils.isValidValueForProp(severity, 'severity');
    return isValidSeverity && severity !== 'none';
}

exports.getRenderer = getRenderer;
exports.isSeverityIconNeeded = isSeverityIconNeeded;
exports.playSound = playSound;
exports.severityBasedStyleClass = severityBasedStyleClass;
exports.throwError = throwError;
/*  */
//# sourceMappingURL=MessageUtils-d65699cf.js.map
