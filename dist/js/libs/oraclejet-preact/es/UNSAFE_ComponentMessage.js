/* @oracle/oraclejet-preact: 13.0.0 */
import { jsxs, jsx } from 'preact/jsx-runtime';
import './UNSAFE_ComponentMessage.css';
import { severityBasedStyleClass, isSeverityIconNeeded, MessageStartIcon, MessageSummary, MessagesManager } from './UNSAFE_Message.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_Flex.js';
import './tslib.es6-fc945e53.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-8b0d63fc.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-cb973048.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import 'preact/hooks';
import 'preact';
import './utils/UNSAFE_getLocale.js';
import './UNSAFE_ThemedIcons.js';
import './UNSAFE_Icon.js';
import './hooks/UNSAFE_useUser.js';
import './UNSAFE_Environment.js';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './hooks/UNSAFE_useTheme.js';
import './UNSAFE_Icons.js';
import './utils/UNSAFE_logger.js';
import './utils/UNSAFE_soundUtils.js';
import './UNSAFE_TransitionGroup.js';

const baseStyles = "bisdpvl";
/**
 * The component that renders an individual message for inline component messaging.
 */

function ComponentMessage({
  severity = 'error',
  detail
}) {
  const classes = classNames([baseStyles, severityBasedStyleClass(severity, 'inline')]);
  return jsxs("div", Object.assign({
    class: classes,
    role: "alert",
    "aria-atomic": "true"
  }, {
    children: [isSeverityIconNeeded(severity) && jsx(MessageStartIcon, {
      variant: "inline",
      severity: severity
    }), jsx(MessageSummary, {
      variant: "inline",
      text: detail
    })]
  }));
}

const rootStyles = "rgqp09a";
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
        severity: item.data.severity
      }, item.key)
    }))
  }));
}

export { ComponentMessage, ComponentMessageContainer };
/*  */
//# sourceMappingURL=UNSAFE_ComponentMessage.js.map
