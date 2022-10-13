/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

var MessageFormattingUtils = require('./MessageFormattingUtils-6764fed3.js');

const messageTimestampStyles = {
  banner: "_lyan3k",
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
//# sourceMappingURL=MessageTimestamp-abe719cf.js.map
