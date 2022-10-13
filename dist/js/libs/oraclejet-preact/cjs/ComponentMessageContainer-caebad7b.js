/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

require('./UNSAFE_Message.js');
var ComponentMessage = require('./ComponentMessage-a872eb39.js');
var MessagesManager = require('./MessagesManager-e88df2a4.js');

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
  return jsxRuntime.jsx("div", Object.assign({
    class: rootStyles
  }, {
    children: jsxRuntime.jsx(MessagesManager.MessagesManager, Object.assign({
      animations: animations,
      data: generateMessagesData(messages)
    }, {
      children: ({
        item
      }) => jsxRuntime.jsx(ComponentMessage.ComponentMessage, {
        detail: item.data.detail,
        fieldLabel: fieldLabel,
        severity: item.data.severity
      }, item.key)
    }))
  }));
}

exports.ComponentMessageContainer = ComponentMessageContainer;
/*  */
//# sourceMappingURL=ComponentMessageContainer-caebad7b.js.map
