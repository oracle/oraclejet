/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');


const messageSummaryStyles = {
  // TODO: Reevaluate once the TEXT component is available (JET-46891)
  base: "voojor",
  banner: "_icrkuj",
  inline: "_gwsuhf"
};
/**
 * Summary Component for rendering the summary text of the Message
 */

function MessageSummary({
  text,
  variant = 'banner'
}) {
  const classes = `oj-c-message${variant}-summary ${messageSummaryStyles.base} ${messageSummaryStyles[variant]}`;
  return jsxRuntime.jsx("div", Object.assign({
    role: "heading",
    class: classes
  }, {
    children: text
  }));
}

exports.MessageSummary = MessageSummary;
/*  */
//# sourceMappingURL=MessageSummary-f93feb7b.js.map
