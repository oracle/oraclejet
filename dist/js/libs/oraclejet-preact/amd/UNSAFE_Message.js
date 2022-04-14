define(['exports', '@oracle/oraclejet-preact/UNSAFE_Flex', '@oracle/oraclejet-preact/utils/classNames', 'preact', 'preact/hooks', '@oracle/oraclejet-preact/utils/getLocale', '@oracle/oraclejet-preact/utils/stringUtils', '@oracle/oraclejet-preact/utils/stringLiteralArray', '@oracle/oraclejet-preact/utils/logger', '@oracle/oraclejet-preact/utils/soundUtils', '@oracle/oraclejet-preact/UNSAFE_TransitionGroup'], (function (exports, UNSAFE_Flex, classNames$1, preact, hooks, getLocale, stringUtils, stringLiteralArray, logger, soundUtils, UNSAFE_TransitionGroup) { 'use strict';

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  const messageCloseButtonStyles = {
    banner: "oj-message-banner-2rbena"
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
    preact.h("button", {
      "aria-label": title,
      onClick: onAction,
      title: title
    }, "X");
    const classes = `oj-message${variant}-close-icon ${messageCloseButtonStyles[variant]}`; // Otherwise, render the close icon

    return preact.h("div", {
      class: classes
    }, renderedButton);
  }

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  stringLiteralArray.stringLiteralArray([
      'banner'
  ]);
  const severities = stringLiteralArray.stringLiteralArray([
      'error',
      'warning',
      'confirmation',
      'info',
      'none'
  ]);

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
      const locale = getLocale.getLocale();
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
              return typeof value === 'string' && !stringUtils.isEmptyOrUndefined(value);
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

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  const messageDetailStyles = {
    // TODO: Reevaluate once the TEXT component is available (JET-46891)
    base: "oj-message-base-14kwy8x",
    banner: "oj-message-banner-takd8k"
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

    return preact.h(preact.Fragment, null, detail);
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

    const classes = `oj-message${variant}-detail ${messageDetailStyles.base} ${messageDetailStyles[variant]}`;
    return preact.h("div", {
      class: classes
    }, renderedContent);
  }

  /**
   * Given a set of string arguments, join the values together into a string with
   * spaces. Falsey values will be omitted,
   * e.g. classNames(['A', 'B', false, 'D', false]) --> 'A B D'
   * @param values The set of values
   * @returns The values joined as a string, or blank string if no values
   */
  function classNames(values) {
      return values.filter(Boolean).join(' ');
  }

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  let counter = 0;

  function useSvgId() {
    return hooks.useRef(`svg-${++counter}`).current;
  } // TODO: replace with real image component when that is available
  // tracked by JET-47348 - set images in a component


  const svgStyles = "oj-message-svgStyles-8z03w3";

  const Svg = ({
    class: className,
    children,
    height = 24,
    width = 24,
    title
  }) => {
    const id = useSvgId();
    return preact.h("svg", {
      class: classNames$1.classNames([svgStyles, className]),
      height: height,
      viewBox: "0 0 24 24",
      width: width,
      xmlns: "http://www.w3.org/2000/svg",
      "aria-labelledby": id
    }, preact.h("title", {
      id: id
    }, title), children);
  };

  const ConfirmationIcon = ({
    class: className,
    height,
    width,
    title,
    fill = 'currentColor'
  }) => preact.h(Svg, {
    class: className,
    height: height,
    width: width,
    title: title
  }, preact.h("path", {
    d: "m12 23c-6.07513225 0-11-4.9248677-11-11 0-6.07513225 4.92486775-11 11-11 6.0751323 0 11 4.92486775 11 11 0 6.0751323-4.9248677 11-11 11zm-4.29289322-10.7071068c-.39052429-.3905243-1.02368927-.3905243-1.41421356 0s-.39052429 1.0236893 0 1.4142136l3 3c.39052429.3905243 1.02368928.3905243 1.41421358 0l7-7.00000002c.3905243-.39052429.3905243-1.02368927 0-1.41421356s-1.0236893-.39052429-1.4142136 0l-6.2928932 6.29289318z",
    fill: fill
  }));

  const ErrorIcon = ({
    class: className,
    height = 24,
    width = 24,
    title,
    fill = 'currentColor'
  }) => preact.h(Svg, {
    class: className,
    height: height,
    width: width,
    title: title
  }, preact.h("path", {
    d: "m12 1c6.0751322 0 11 4.92486775 11 11 0 6.0751322-4.9248678 11-11 11-6.07513225 0-11-4.9248678-11-11 0-6.07513225 4.92486775-11 11-11zm-3.29289322 6.29289322-1.41421356 1.41421356 7.99999998 8.00000002 1.4142136-1.4142136z",
    fill: fill
  }));

  const InfoIcon = ({
    class: className,
    height = 24,
    width = 24,
    title,
    fill = 'currentColor'
  }) => preact.h(Svg, {
    class: className,
    height: height,
    width: width,
    title: title
  }, preact.h("path", {
    d: "m12 1c6.0751322 0 11 4.92486775 11 11 0 6.0751322-4.9248678 11-11 11-6.07513225 0-11-4.9248678-11-11 0-6.07513225 4.92486775-11 11-11zm.0245053 9h-.0490003c-.5365027 0-.975505.439-.975505.9755v6.0485c0 .537.4390023.976.975505.976h.0490003c.5365027 0 .975505-.439.975505-.976v-6.0485c0-.5365-.4390023-.9755-.975505-.9755zm.975505-4h-2v2h2z",
    fill: fill
  }));

  const WarningIcon = ({
    class: className,
    height = 24,
    width = 24,
    title,
    fill = 'currentColor'
  }) => preact.h(Svg, {
    class: className,
    height: height,
    width: width,
    title: title
  }, preact.h("path", {
    d: "m12 .85290895 11.6563637 22.14709105h-23.31272741zm1 17.14709105h-2v2h2zm0-9h-2v7h2z",
    fill: fill
  }));

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  const messageStartIconStyles = "oj-message-messageStartIconStyles-iuvtfp";
  const severityIconStyles = {
    banner: "oj-message-banner-zjhpfj"
  };
  const severityIcons = {
    confirmation: ConfirmationIcon,
    error: ErrorIcon,
    info: InfoIcon,
    warning: WarningIcon
  };
  /**
   * StartIcon Component for rendering the severity based icon in Message
   */

  function MessageStartIcon({
    severity,
    variant = 'banner',
    translations
  }) {
    const IconComponent = severityIcons[severity];
    return preact.h("div", {
      class: classNames([`oj-message${variant}-start-icon`, messageStartIconStyles]),
      role: "presentation"
    }, preact.h(IconComponent, {
      class: severityIconStyles[variant],
      title: translations === null || translations === void 0 ? void 0 : translations[severity]
    }));
  }

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  const messageSummaryStyles = {
    // TODO: Reevaluate once the TEXT component is available (JET-46891)
    base: "oj-message-base-bowowq",
    banner: "oj-message-banner-vxm2jp"
  };
  /**
   * Summary Component for rendering the summary text of the Message
   */

  function MessageSummary({
    text,
    variant = 'banner'
  }) {
    const classes = `oj-message${variant}-summary ${messageSummaryStyles.base} ${messageSummaryStyles[variant]}`;
    return preact.h("div", {
      role: "heading",
      class: classes
    }, text);
  }

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  const messageTimestampStyles = {
    banner: "oj-message-banner-18frmp1"
  };
  /**
   * Timestamp Component for rendering timestamp in Message
   */

  function MessageTimestamp({
    value,
    variant = 'banner'
  }) {
    const classes = `oj-message${variant}-timestamp ${messageTimestampStyles[variant]}`; // Otherwise, render the timestamp

    const formattedTimestamp = formatTimestamp(value);
    return preact.h("div", {
      class: classes
    }, formattedTimestamp);
  }

  /**
   * Logger that prepends the component name to the message
   */
  const MessageLogger = {
      error: (message, type = 'common') => logger.Logger.error(`JET Message(${type}): ${message}`),
      warn: (message, type = 'common') => logger.Logger.warn(`JET Message(${type}): ${message}`),
      info: (message, type = 'common') => logger.Logger.info(`JET Message(${type}): ${message}`),
      log: (message, type = 'common') => logger.Logger.log(`JET Message(${type}): ${message}`)
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
              soundUtils.playDefaultNotificationSound();
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
          await soundUtils.playAudioFromURL(sound);
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
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  /**
   * Generates a root style class based on the severity. For invalid severity and severity=none
   * no specific style class exists.
   *
   * @param severity The message severity
   * @returns calculated style class based on the severity
   */

  function getSeverityStyleClass(severity) {
    const isValidSeverity = isValidValueForProp(severity, 'severity');
    return classNames$1.classNames([isValidSeverity && severity !== 'none' && `oj-messagebanner-${severity}`]);
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
    base: "oj-message-base-ph7f1",
    section: "oj-message-section-y709vw",
    header: "oj-message-header-13ytxxv",
    // TODO: Replace with Flex and View components to handle padding and flex
    content: "oj-message-content-1cvp4im"
  };
  /**
   * A component that styles the header for the message component
   * @param param0 Props
   * @returns MessageHeader component instance
   */

  function StyledMessageHeader({
    children
  }) {
    return preact.h("div", {
      role: "presentation",
      class: messageStyles.header
    }, children);
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
    const containerDivRef = hooks.useRef(null); // Add methods to the ref object

    hooks.useImperativeHandle(messageRef, () => ({
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

    const handleClose = hooks.useCallback(() => {
      onClose === null || onClose === void 0 ? void 0 : onClose(item);
    }, [item, onClose]);
    /**
     * Handles closing the message on pressing Esc
     */

    const handleCloseOnEsc = hooks.useCallback(event => {
      // Close the message only when closeAffordance is on
      if (event.key === 'Escape' && closeAffordance === 'on') {
        onClose === null || onClose === void 0 ? void 0 : onClose(item);
      }
    }, [closeAffordance, item, onClose]);
    hooks.useEffect(() => {
      if (isValidValueForProp(sound)) {
        // It is sufficient to check for the value to be a
        // non-empty string. The playSound method takes care of the rest.
        playSound(sound);
      }
    }, []); // No deps to run this only on mount

    const rootClasses = classNames$1.classNames([messageStyles.base, severityClass, type === 'section' && messageStyles.section]); // We will be animating the root div, so add padding to an inner wrapper div so that
    // when animating height looks smooth. If padding were to be added to the root
    // div, the animation will not be smooth as height will never reach 0 due to the
    // padding.

    return preact.h("div", {
      ref: containerDivRef,
      class: rootClasses,
      role: "alert",
      "aria-atomic": "true",
      tabIndex: 0,
      onKeyDown: handleCloseOnEsc
    }, preact.h("div", {
      class: messageStyles.content
    }, isSeverityIconNeeded(severity) && preact.h(MessageStartIcon, {
      variant: "banner",
      severity: severity,
      translations: translations
    }), preact.h(UNSAFE_Flex.Flex, {
      direction: "column",
      flex: "1"
    }, preact.h(StyledMessageHeader, null, preact.h(MessageSummary, {
      variant: "banner",
      text: summary
    }), isValidValueForProp(timestamp, 'timestamp') && preact.h(MessageTimestamp, {
      variant: "banner",
      value: timestamp
    })), preact.h(MessageDetail, {
      variant: "banner",
      item: Object.assign(Object.assign({}, item), {
        index
      }),
      renderer: detailRenderer
    })), closeAffordance === 'on' && preact.h(MessageCloseButton, {
      buttonRenderer: closeButtonRenderer,
      title: translations === null || translations === void 0 ? void 0 : translations.close,
      variant: "banner",
      onAction: handleClose
    })));
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
  const MessagesContext = preact.createContext({});
  /**
   * Uses the MessagesContext if one is available.
   *
   * @returns The context from the closes provider
   */
  function useMessagesContext() {
      return hooks.useContext(MessagesContext);
  }

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  /**
   * The component that renders individual messages for the provided data.
   */
  function MessagesManager(props) {
      const { children, data } = props;
      const { handleEntering, handleExiting } = useMessagesManager(props);
      return (preact.h(UNSAFE_TransitionGroup.TransitionGroup, { elementType: preact.Fragment }, data.map((item, index) => (preact.h(UNSAFE_TransitionGroup.Transition, { key: item.key, metadata: { index, key: item.key }, onEntering: handleEntering, onExiting: handleExiting }, children === null || children === void 0 ? void 0 : children({ index, item }))))));
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
      const _addBusyState = hooks.useCallback((description) => {
          var _a;
          return (_a = addBusyState === null || addBusyState === void 0 ? void 0 : addBusyState(description)) !== null && _a !== void 0 ? _a : (() => { });
      }, [addBusyState]);
      /**
       * Performs animation.
       *
       * @param type The type of the animation
       * @param base The root DOM element
       */
      const performAnimation = hooks.useCallback(async (type, base) => {
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
      const handleEntering = hooks.useCallback(async (node, callback) => {
          await performAnimation('enter', node);
          callback === null || callback === void 0 ? void 0 : callback();
      }, [performAnimation]);
      /**
       * Handles when a message has started to exit.
       *
       * @param node The corresponding message element
       * @param callback A callback function to be called after the animation is complete
       */
      const handleExiting = hooks.useCallback(async (node, callback, metadata) => {
          await performAnimation('exit', node);
          metadata && (onMessageWillRemove === null || onMessageWillRemove === void 0 ? void 0 : onMessageWillRemove(metadata.key, metadata.index));
          callback === null || callback === void 0 ? void 0 : callback();
      }, [performAnimation, onMessageWillRemove]);
      return { handleEntering, handleExiting };
  }

  exports.Message = Message;
  exports.MessageCloseButton = MessageCloseButton;
  exports.MessageDetail = MessageDetail;
  exports.MessageStartIcon = MessageStartIcon;
  exports.MessageSummary = MessageSummary;
  exports.MessageTimestamp = MessageTimestamp;
  exports.MessagesContext = MessagesContext;
  exports.MessagesManager = MessagesManager;
  exports.formatTimestamp = formatTimestamp;
  exports.getRenderer = getRenderer;
  exports.isValidValueForProp = isValidValueForProp;
  exports.playSound = playSound;
  exports.severities = severities;
  exports.throwError = throwError;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
