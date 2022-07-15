define(["exports","./utils/UNSAFE_logger","./utils/UNSAFE_soundUtils","./MessageFormattingUtils-84e373f3"],(function(e,t,o,n){"use strict";const i=(e,o="common")=>t.Logger.warn(`JET Message(${o}): ${e}`);function r(e,t="common"){throw new Error(`JET Message(${t}) - ${e}`)}e.getRenderer=function(e,t,o,n){if(!t||!o)return;const i="function"==typeof t?t(e):t;return null!=i?(i in o||r(`${i} is not a valid template name for the message with key=${e.key}`,n),o[i]):void 0},e.isSeverityIconNeeded=function(e){return n.isValidValueForProp(e,"severity")&&"none"!==e},e.playSound=async function(e){if("none"!==e)if("default"!==e)try{await o.playAudioFromURL(e)}catch(t){i(`Failed to play the audio from the url ${e}. ${t}.`)}else try{o.playDefaultNotificationSound()}catch(e){i(`Failed to play the default sound. ${e}.`)}},e.severityBasedStyleClass=function(e,t){return n.isValidValueForProp(e,"severity")&&"none"!==e?`oj-c-message${t}-${e}`:""},e.throwError=r}));
//# sourceMappingURL=MessageUtils-1eb80ddc.js.map
