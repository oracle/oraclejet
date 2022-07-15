/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

var MessageFormattingUtils = require('./MessageFormattingUtils-d406c991.js');

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

  const formattedTimestamp = MessageFormattingUtils.formatTimestamp(value);
  return jsxRuntime.jsx("div", Object.assign({
    class: classes
  }, {
    children: formattedTimestamp
  }));
}

exports.MessageTimestamp = MessageTimestamp;
/*  */
//# sourceMappingURL=MessageTimestamp-00534130.js.map
