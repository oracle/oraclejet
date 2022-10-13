/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
require('./UNSAFE_Flex.js');
require('./utils/UNSAFE_classNames.js');
var hooks = require('preact/hooks');
var MessageCloseButton = require('./MessageCloseButton-c5605b75.js');
var MessageDetail = require('./MessageDetail-4d43ff71.js');
var MessageFormattingUtils = require('./MessageFormattingUtils-6764fed3.js');
var MessageStartIcon = require('./MessageStartIcon-600451b4.js');
var MessageSummary = require('./MessageSummary-f93feb7b.js');
var MessageTimestamp = require('./MessageTimestamp-abe719cf.js');
var MessageUtils = require('./MessageUtils-68957380.js');
var classNames = require('./classNames-82bfab52.js');
var Flex = require('./Flex-327ae051.js');
var MessagesManager = require('./MessagesManager-e88df2a4.js');
var Message_types = require('./Message.types-2c9b978d.js');
require('./tslib.es6-e91f819d.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./_curry1-94f22a19.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./_curry2-e6dc9cf1.js');
require('./_has-556488e4.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./keys-0a611b24.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-3d991801.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-91650faf.js');
require('preact');
require('./utils/UNSAFE_getLocale.js');
require('./index-dcd95188.js');
require('./UNSAFE_Icon.js');
require('./Icon-42559ff1.js');
require('./hooks/UNSAFE_useUser.js');
require('./UNSAFE_Environment.js');
require('./UNSAFE_Layer.js');
require('preact/compat');
require('./hooks/UNSAFE_useTheme.js');
require('./index-e2b299b3.js');
require('./utils/UNSAFE_logger.js');
require('./utils/UNSAFE_soundUtils.js');
require('./UNSAFE_TransitionGroup.js');

/**
 * Generates a root style class based on the severity. For invalid severity and severity=none
 * no specific style class exists.
 *
 * @param severity The message severity
 * @returns calculated style class based on the severity
 */

function getSeverityStyleClass(severity) {
  const isValidSeverity = MessageFormattingUtils.isValidValueForProp(severity, 'severity');
  return classNames.classNames([isValidSeverity && severity !== 'none' && `oj-c-messagebanner-${severity}`]);
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
/**
 * CSS styles for various components
 */


const messageStyles = {
  base: "_f3dkge",
  section: "_nls1pj",
  header: "_3uuhyw",
  // TODO: Replace with Flex and View components to handle padding and flex
  content: "n7zh9m"
};
/**
 * A component that styles the header for the message component
 * @param param0 Props
 * @returns MessageHeader component instance
 */

function StyledMessageHeader({
  children
}) {
  return jsxRuntime.jsx("div", Object.assign({
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
    if (MessageFormattingUtils.isValidValueForProp(sound)) {
      // It is sufficient to check for the value to be a
      // non-empty string. The playSound method takes care of the rest.
      MessageUtils.playSound(sound);
    }
  }, []); // No deps to run this only on mount

  const rootClasses = classNames.classNames([messageStyles.base, severityClass, type === 'section' && messageStyles.section]); // We will be animating the root div, so add padding to an inner wrapper div so that
  // when animating height looks smooth. If padding were to be added to the root
  // div, the animation will not be smooth as height will never reach 0 due to the
  // padding.

  return jsxRuntime.jsx("div", Object.assign({
    ref: containerDivRef,
    class: rootClasses,
    role: "alert",
    "aria-atomic": "true",
    tabIndex: 0,
    onKeyUp: handleCloseOnEsc
  }, {
    children: jsxRuntime.jsxs("div", Object.assign({
      class: messageStyles.content
    }, {
      children: [isSeverityIconNeeded(severity) && jsxRuntime.jsx(MessageStartIcon.MessageStartIcon, {
        variant: "banner",
        severity: severity,
        translations: translations
      }), jsxRuntime.jsxs(Flex.Flex, Object.assign({
        direction: "column",
        flex: "1"
      }, {
        children: [jsxRuntime.jsxs(StyledMessageHeader, {
          children: [jsxRuntime.jsx(MessageSummary.MessageSummary, {
            variant: "banner",
            text: summary
          }), MessageFormattingUtils.isValidValueForProp(timestamp, 'timestamp') && jsxRuntime.jsx(MessageTimestamp.MessageTimestamp, {
            variant: "banner",
            value: timestamp
          })]
        }), jsxRuntime.jsx(MessageDetail.MessageDetail, {
          variant: "banner",
          item: Object.assign(Object.assign({}, item), {
            index
          }),
          renderer: detailRenderer
        })]
      })), closeAffordance === 'on' && jsxRuntime.jsx(MessageCloseButton.MessageCloseButton, {
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

exports.MessageCloseButton = MessageCloseButton.MessageCloseButton;
exports.MessageDetail = MessageDetail.MessageDetail;
exports.formatTimestamp = MessageFormattingUtils.formatTimestamp;
exports.isValidValueForProp = MessageFormattingUtils.isValidValueForProp;
exports.MessageStartIcon = MessageStartIcon.MessageStartIcon;
exports.MessageSummary = MessageSummary.MessageSummary;
exports.MessageTimestamp = MessageTimestamp.MessageTimestamp;
exports.getRenderer = MessageUtils.getRenderer;
exports.isSeverityIconNeeded = MessageUtils.isSeverityIconNeeded;
exports.playSound = MessageUtils.playSound;
exports.severityBasedStyleClass = MessageUtils.severityBasedStyleClass;
exports.throwError = MessageUtils.throwError;
exports.MessagesContext = MessagesManager.MessagesContext;
exports.MessagesManager = MessagesManager.MessagesManager;
exports.severities = Message_types.severities;
exports.Message = Message;
/*  */
//# sourceMappingURL=UNSAFE_Message.js.map
