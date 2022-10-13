/* @oracle/oraclejet-preact: 13.1.0 */
import { jsxs, jsx } from 'preact/jsx-runtime';
import './UNSAFE_ComponentMessage.css';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';
import { HiddenAccessible } from './UNSAFE_HiddenAccessible.js';
import { severityBasedStyleClass, isSeverityIconNeeded, MessageStartIcon, MessageSummary, MessagesManager } from './UNSAFE_Message.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import 'preact/hooks';
import './UNSAFE_Environment.js';
import 'preact';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './UNSAFE_Flex.js';
import './tslib.es6-deee4931.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-b6f34fc4.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-77d2b8e6.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import './utils/UNSAFE_getLocale.js';
import './UNSAFE_ThemedIcons.js';
import './UNSAFE_Icon.js';
import './hooks/UNSAFE_useUser.js';
import './hooks/UNSAFE_useTheme.js';
import './UNSAFE_Icons.js';
import './utils/UNSAFE_logger.js';
import './utils/UNSAFE_soundUtils.js';
import './UNSAFE_TransitionGroup.js';

const baseStyles = "n1cjnf";
/**
 * The component that renders an individual message for inline component messaging.
 */

function ComponentMessage({
  detail,
  fieldLabel,
  severity = 'error'
}) {
  const classes = classNames([baseStyles, severityBasedStyleClass(severity, 'inline')]);
  const translations = useTranslationBundle('@oracle/oraclejet-preact');
  const severityTranslations = {
    confirmation: translations.confirmation(),
    error: translations.error(),
    info: translations.info(),
    warning: translations.warn()
  };
  return jsxs("div", Object.assign({
    class: classes,
    role: "alert",
    "aria-atomic": "true"
  }, {
    children: [fieldLabel && jsx(HiddenAccessible, {
      children: fieldLabel
    }), isSeverityIconNeeded(severity) && jsx(MessageStartIcon, {
      variant: "inline",
      severity: severity,
      translations: severityTranslations
    }), jsx(MessageSummary, {
      variant: "inline",
      text: detail
    })]
  }));
}

const rootStyles = "yqm965";
/**
 * Converts the messages data into Item
 *
 * @param messages The messages data passed down as prop
 * @returns The messages data as Item
 */

function generateMessagesData(messages) {
  return messages.map((message, index) => {
    return {
      key: index,
      data: {
        closeAffordance: 'off',
        severity: message.severity || 'error',
        detail: message.detail
      }
    };
  });
}

function ComponentMessageContainer({
  animations,
  fieldLabel,
  messages = []
}) {
  return jsx("div", Object.assign({
    class: rootStyles
  }, {
    children: jsx(MessagesManager, Object.assign({
      animations: animations,
      data: generateMessagesData(messages)
    }, {
      children: ({
        item
      }) => jsx(ComponentMessage, {
        detail: item.data.detail,
        fieldLabel: fieldLabel,
        severity: item.data.severity
      }, item.key)
    }))
  }));
}

export { ComponentMessage, ComponentMessageContainer };
/*  */
//# sourceMappingURL=UNSAFE_ComponentMessage.js.map
