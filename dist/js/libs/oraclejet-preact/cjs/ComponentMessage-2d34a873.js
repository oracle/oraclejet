/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

require('./UNSAFE_Message.js');
require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-69178ebf.js');
var MessageUtils = require('./MessageUtils-d65699cf.js');
var MessageStartIcon = require('./MessageStartIcon-8c60ed0a.js');
var MessageSummary = require('./MessageSummary-e7e6089e.js');

const baseStyles = "bisdpvl";
/**
 * The component that renders an individual message for inline component messaging.
 */

function ComponentMessage({
  severity = 'error',
  detail
}) {
  const classes = classNames.classNames([baseStyles, MessageUtils.severityBasedStyleClass(severity, 'inline')]);
  return jsxRuntime.jsxs("div", Object.assign({
    class: classes,
    role: "alert",
    "aria-atomic": "true"
  }, {
    children: [MessageUtils.isSeverityIconNeeded(severity) && jsxRuntime.jsx(MessageStartIcon.MessageStartIcon, {
      variant: "inline",
      severity: severity
    }), jsxRuntime.jsx(MessageSummary.MessageSummary, {
      variant: "inline",
      text: detail
    })]
  }));
}

exports.ComponentMessage = ComponentMessage;
/*  */
//# sourceMappingURL=ComponentMessage-2d34a873.js.map
