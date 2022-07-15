/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

require('./UNSAFE_Message.js');
var ComponentMessage = require('./ComponentMessage-2d34a873.js');
var MessagesManager = require('./MessagesManager-2ef5e191.js');

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
        severity: item.data.severity
      }, item.key)
    }))
  }));
}

exports.ComponentMessageContainer = ComponentMessageContainer;
/*  */
//# sourceMappingURL=ComponentMessageContainer-00bd8855.js.map
