/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import './UNSAFE_Message.css';
import { Flex } from './UNSAFE_Flex.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import { useRef, useImperativeHandle, useCallback, useEffect, useContext } from 'preact/hooks';
import { Fragment, createContext } from 'preact';
import { getLocale } from './utils/UNSAFE_getLocale.js';
import { isEmptyOrUndefined } from './utils/UNSAFE_stringUtils.js';
import { stringLiteralArray } from './utils/UNSAFE_arrayUtils.js';
import './UNSAFE_ThemedIcons.js';
import { IcoSuccessS as SvgIcoSuccessS, IcoErrorS as SvgIcoErrorS, IcoInformationS as SvgIcoInformationS, IcoWarningS as SvgIcoWarningS } from './UNSAFE_Icons.js';
import { Logger } from './utils/UNSAFE_logger.js';
import { playDefaultNotificationSound, playAudioFromURL } from './utils/UNSAFE_soundUtils.js';
import { TransitionGroup, Transition } from './UNSAFE_TransitionGroup.js';
import './tslib.es6-fc945e53.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_size.js';
import './_curry1-8b0d63fc.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-cb973048.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import './UNSAFE_Icon.js';
import './hooks/UNSAFE_useUser.js';
import './UNSAFE_Environment.js';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './hooks/UNSAFE_useTheme.js';

const messageCloseButtonStyles = {
  banner: "b10cag1l",
  inline: undefined
};
/**
 * A Component for rendering the message close button
 */

function MessageCloseButton({
  onAction,
  buttonRenderer,
  title = 'Close',
  variant = 'banner'
}) {
  const renderedButton = buttonRenderer ? buttonRenderer(title, onAction, variant) : // we should ultimately be able to create an oj-button (or rather its preact
  // equivalent) here, but for now just create a regular HTML button if a renderer
  // is not passed in from the core JET layer
  jsx("button", Object.assign({
    "aria-label": title,
    onClick: onAction,
    title: title
  }, {
    children: "X"
  }));
  const classes = `oj-c-message${variant}-close-icon ${messageCloseButtonStyles[variant]}`; // Otherwise, render the close icon

  return jsx("div", Object.assign({
    class: classes
  }, {
    children: renderedButton
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const variants = stringLiteralArray(['banner', 'inline']);
const severities = stringLiteralArray(['error', 'warning', 'confirmation', 'info', 'none']);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Options for creating an Intl.DateTimeFormat instance.
 */
const DATE_FORMAT_OPTIONS = Object.freeze({
    TODAY: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    },
    DEFAULT: {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }
});
/**
 * Regex for validating ISO timestamp
 */
const ISO_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
/**
 * Checks if the provided date is today
 *
 * @param isoDate Date to be tested for today
 *
 * @returns boolean indicating if the provided date is today
 */
function isDateToday(isoDate) {
    const today = new Date();
    const provided = new Date(isoDate);
    return (today.getUTCFullYear() === provided.getUTCFullYear() &&
        today.getUTCMonth() === provided.getUTCMonth() &&
        today.getUTCDate() === provided.getUTCDate());
}
/**
 * Creates an instance of Intl.DateTimeFormat
 *
 * @param isToday A boolean to indicate whether a formatter is needed for the date
 *                that is the current day.
 *
 * @returns the formatter instance
 */
function getDateTimeFormatter(isToday) {
    const locale = getLocale();
    const { DateTimeFormat } = Intl;
    if (isToday) {
        return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.TODAY);
    }
    return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.DEFAULT);
}
/**
 * Checks if the provided value is valid for the prop specified.
 * By default, this method just checks for the value to be a valid string.
 *
 * @param value The value to be checked
 * @param prop The property for which the value needs to be evaluated
 *
 * @returns the result of the validation
 */
function isValidValueForProp(value, prop = 'string') {
    switch (prop) {
        case 'severity':
            // Should be one of the allowed severity
            return typeof value === 'string' && severities.includes(value);
        case 'timestamp':
            // Should be a valid ISO Datetime string
            return typeof value === 'string' && ISO_DATE_REGEX.test(value);
        case 'string':
        default:
            // anything other than null, undefined and '' is a valid string
            return typeof value === 'string' && !isEmptyOrUndefined(value);
    }
}
/**
 * Formats the timestamp in the required format based on the current
 * locale.
 *
 * @param isoTime Timestamp in ISO format
 */
function formatTimestamp(isoTime) {
    const isToday = isDateToday(isoTime);
    const formatter = getDateTimeFormatter(isToday);
    return formatter.format(new Date(isoTime));
}

const messageDetailStyles = {
  // TODO: Reevaluate once the TEXT component is available (JET-46891)
  base: "bbznd28",
  banner: "b39ctpn",
  inline: undefined
};
/**
 * Default renderer for rendering the detail content.
 *
 * @param item The template item object
 * @returns Rendered detail content
 */

function defaultDetailRenderer(item) {
  const {
    detail
  } = item.data; // If the detail is null or an empty string, do not render the
  // content row

  if (!isValidValueForProp(detail)) {
    return null;
  }

  return jsx(Fragment, {
    children: detail
  });
}
/**
 * Detail Component for rendering the detail content of the Message
 */


function MessageDetail({
  item,
  renderer = defaultDetailRenderer,
  variant = 'banner'
}) {
  const renderedContent = renderer(item);
  if (renderedContent == null) return null; // If detail content is rendered, then wrap it in a div with specified style classes

  const classes = `oj-c-message${variant}-detail ${messageDetailStyles.base} ${messageDetailStyles[variant]}`;
  return jsx("div", Object.assign({
    class: classes
  }, {
    children: renderedContent
  }));
}

const messageStartIconStyles = "mmmpf1e";
const severityIconStyles = {
  banner: "b1mv77e8",
  inline: "ie3df0t"
};
const severityIcons = {
  confirmation: SvgIcoSuccessS,
  error: SvgIcoErrorS,
  info: SvgIcoInformationS,
  warning: SvgIcoWarningS
};
/**
 * StartIcon Component for rendering the severity based icon in Message
 */

function MessageStartIcon({
  severity,
  variant = 'banner',
  translations
}) {
  const IconComponent = severityIcons[severity]; // TODO: JET-50793

  const iconContent = variant === 'banner' ? jsx(Flex, Object.assign({
    align: "center",
    height: "100%"
  }, {
    children: jsx(IconComponent, {
      accessibleLabel: translations === null || translations === void 0 ? void 0 : translations[severity]
    })
  })) : jsx(IconComponent, {
    accessibleLabel: translations === null || translations === void 0 ? void 0 : translations[severity]
  });
  return jsx("div", Object.assign({
    class: classNames([`oj-c-message${variant}-start-icon`, messageStartIconStyles, severityIconStyles[variant]]),
    role: "presentation"
  }, {
    children: iconContent
  }));
}

const messageSummaryStyles = {
  // TODO: Reevaluate once the TEXT component is available (JET-46891)
  base: "bczmanu",
  banner: "bonzci6",
  inline: "i1j7ne0i"
};
/**
 * Summary Component for rendering the summary text of the Message
 */

function MessageSummary({
  text,
  variant = 'banner'
}) {
  const classes = `oj-c-message${variant}-summary ${messageSummaryStyles.base} ${messageSummaryStyles[variant]}`;
  return jsx("div", Object.assign({
    role: "heading",
    class: classes
  }, {
    children: text
  }));
}

const messageTimestampStyles = {
  banner: "b1i0o3vp",
  inline: undefined
};
/**
 * Timestamp Component for rendering timestamp in Message
 */

function MessageTimestamp({
  value,
  variant = 'banner'
}) {
  const classes = `oj-c-message${variant}-timestamp ${messageTimestampStyles[variant]}`; // Otherwise, render the timestamp

  const formattedTimestamp = formatTimestamp(value);
  return jsx("div", Object.assign({
    class: classes
  }, {
    children: formattedTimestamp
  }));
}

/**
 * Logger that prepends the component name to the message
 */
const MessageLogger = {
    error: (message, type = 'common') => Logger.error(`JET Message(${type}): ${message}`),
    warn: (message, type = 'common') => Logger.warn(`JET Message(${type}): ${message}`),
    info: (message, type = 'common') => Logger.info(`JET Message(${type}): ${message}`),
    log: (message, type = 'common') => Logger.log(`JET Message(${type}): ${message}`)
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
            playDefaultNotificationSound();
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
        await playAudioFromURL(sound);
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
    const isValidSeverity = isValidValueForProp(severity, 'severity');
    return isValidSeverity && severity !== 'none' ? `oj-c-message${variant}-${severity}` : '';
}
/**
 * Determines if a severity icon is needed based on the component severity
 *
 * @param severity The component severity
 * @returns Whether or not to render the severity icon
 */
function isSeverityIconNeeded$1(severity) {
    const isValidSeverity = isValidValueForProp(severity, 'severity');
    return isValidSeverity && severity !== 'none';
}

/**
 * Generates a root style class based on the severity. For invalid severity and severity=none
 * no specific style class exists.
 *
 * @param severity The message severity
 * @returns calculated style class based on the severity
 */

function getSeverityStyleClass(severity) {
  const isValidSeverity = isValidValueForProp(severity, 'severity');
  return classNames([isValidSeverity && severity !== 'none' && `oj-c-messagebanner-${severity}`]);
}
/**
 * Determines if a severity icon is needed based on the component severity
 *
 * @param severity The component severity
 * @returns Whether or not to render the severity icon
 */


function isSeverityIconNeeded(severity) {
  const isValidSeverity = isValidValueForProp(severity, 'severity');
  return isValidSeverity && severity !== 'none';
}
/**
 * CSS styles for various components
 */


const messageStyles = {
  base: "bb5rzqk",
  section: "s1c5gur5",
  header: "h1k6g34i",
  // TODO: Replace with Flex and View components to handle padding and flex
  content: "cy2ssrz"
};
/**
 * A component that styles the header for the message component
 * @param param0 Props
 * @returns MessageHeader component instance
 */

function StyledMessageHeader({
  children
}) {
  return jsx("div", Object.assign({
    role: "presentation",
    class: messageStyles.header
  }, {
    children: children
  }));
}
/**
 * Component that renders an individual message
 */


function Message({
  closeButtonRenderer,
  detailRenderer,
  index = -1,
  item,
  onClose,
  messageRef = () => {},
  translations,
  type
}) {
  const {
    closeAffordance = 'on',
    severity = 'error',
    sound,
    summary,
    timestamp
  } = item.data;
  const severityClass = getSeverityStyleClass(severity);
  const containerDivRef = useRef(null); // Add methods to the ref object

  useImperativeHandle(messageRef, () => ({
    focus: () => {
      var _a;

      return (_a = containerDivRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    },
    contains: element => {
      var _a, _b;

      return containerDivRef.current === element || ((_b = element && ((_a = containerDivRef.current) === null || _a === void 0 ? void 0 : _a.contains(element))) !== null && _b !== void 0 ? _b : false);
    }
  }));
  /**
   * Handles clicking on the close icon of the message
   */

  const handleClose = useCallback(() => {
    onClose === null || onClose === void 0 ? void 0 : onClose(item);
  }, [item, onClose]);
  /**
   * Handles closing the message on pressing Esc
   */

  const handleCloseOnEsc = useCallback(event => {
    // Close the message only when closeAffordance is on
    if (event.key === 'Escape' && closeAffordance === 'on') {
      onClose === null || onClose === void 0 ? void 0 : onClose(item);
    }
  }, [closeAffordance, item, onClose]);
  useEffect(() => {
    if (isValidValueForProp(sound)) {
      // It is sufficient to check for the value to be a
      // non-empty string. The playSound method takes care of the rest.
      playSound(sound);
    }
  }, []); // No deps to run this only on mount

  const rootClasses = classNames([messageStyles.base, severityClass, type === 'section' && messageStyles.section]); // We will be animating the root div, so add padding to an inner wrapper div so that
  // when animating height looks smooth. If padding were to be added to the root
  // div, the animation will not be smooth as height will never reach 0 due to the
  // padding.

  return jsx("div", Object.assign({
    ref: containerDivRef,
    class: rootClasses,
    role: "alert",
    "aria-atomic": "true",
    tabIndex: 0,
    onKeyUp: handleCloseOnEsc
  }, {
    children: jsxs("div", Object.assign({
      class: messageStyles.content
    }, {
      children: [isSeverityIconNeeded(severity) && jsx(MessageStartIcon, {
        variant: "banner",
        severity: severity,
        translations: translations
      }), jsxs(Flex, Object.assign({
        direction: "column",
        flex: "1"
      }, {
        children: [jsxs(StyledMessageHeader, {
          children: [jsx(MessageSummary, {
            variant: "banner",
            text: summary
          }), isValidValueForProp(timestamp, 'timestamp') && jsx(MessageTimestamp, {
            variant: "banner",
            value: timestamp
          })]
        }), jsx(MessageDetail, {
          variant: "banner",
          item: Object.assign(Object.assign({}, item), {
            index
          }),
          renderer: detailRenderer
        })]
      })), closeAffordance === 'on' && jsx(MessageCloseButton, {
        buttonRenderer: closeButtonRenderer,
        title: translations === null || translations === void 0 ? void 0 : translations.close,
        variant: "banner",
        onAction: handleClose
      })]
    }))
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Context which the parent custom element components can use for passing down
 * the busy context
 */
const MessagesContext = createContext({});
/**
 * Uses the MessagesContext if one is available.
 *
 * @returns The context from the closes provider
 */
function useMessagesContext() {
    return useContext(MessagesContext);
}

/**
 * The component that renders individual messages for the provided data.
 */
function MessagesManager(props) {
    const { children, data } = props;
    const { handleEntering, handleExiting } = useMessagesManager(props);
    return (jsx(TransitionGroup, Object.assign({ elementType: Fragment }, { children: data.map((item, index) => (jsx(Transition, Object.assign({ metadata: { index, key: item.key }, onEntering: handleEntering, onExiting: handleExiting }, { children: children === null || children === void 0 ? void 0 : children({ index, item }) }), item.key))) })));
}
/**
 * A custom hook for creating the listeners for the MessagesManager
 *
 * @param param0 The props for the messages
 * @returns The transition listeners
 */
function useMessagesManager({ animations, startAnimation = () => Promise.resolve(false), onMessageWillRemove }) {
    const { addBusyState } = useMessagesContext();
    /**
     * Adds busy state if available in the context
     *
     * @param description The description of the busyState
     * @returns The busyState resolver
     */
    const _addBusyState = useCallback((description) => {
        var _a;
        return (_a = addBusyState === null || addBusyState === void 0 ? void 0 : addBusyState(description)) !== null && _a !== void 0 ? _a : (() => { });
    }, [addBusyState]);
    /**
     * Performs animation.
     *
     * @param type The type of the animation
     * @param base The root DOM element
     */
    const performAnimation = useCallback(async (type, base) => {
        if (!base) {
            return;
        }
        const animation = animations === null || animations === void 0 ? void 0 : animations[type];
        if (animation) {
            const busyStateResolver = _addBusyState(`performing message animation - ${type}`);
            // If an animation is provided for the current transition, perform the animation
            await startAnimation(base, type, animation);
            busyStateResolver();
        }
    }, [animations, startAnimation, _addBusyState]);
    /**
     * Handles when a message is successfully entered.
     *
     * @param node The corresponding message element
     * @param callback A callback function to be called after the animation is complete
     */
    const handleEntering = useCallback(async (node, callback) => {
        await performAnimation('enter', node);
        callback === null || callback === void 0 ? void 0 : callback();
    }, [performAnimation]);
    /**
     * Handles when a message has started to exit.
     *
     * @param node The corresponding message element
     * @param callback A callback function to be called after the animation is complete
     */
    const handleExiting = useCallback(async (node, callback, metadata) => {
        await performAnimation('exit', node);
        metadata && (onMessageWillRemove === null || onMessageWillRemove === void 0 ? void 0 : onMessageWillRemove(metadata.key, metadata.index, node));
        callback === null || callback === void 0 ? void 0 : callback();
    }, [performAnimation, onMessageWillRemove]);
    return { handleEntering, handleExiting };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { Message, MessageCloseButton, MessageDetail, MessageStartIcon, MessageSummary, MessageTimestamp, MessagesContext, MessagesManager, formatTimestamp, getRenderer, isSeverityIconNeeded$1 as isSeverityIconNeeded, isValidValueForProp, playSound, severities, severityBasedStyleClass, throwError };
/*  */
//# sourceMappingURL=UNSAFE_Message.js.map
