/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
require('./UNSAFE_HiddenAccessible.js');
require('./UNSAFE_Message.js');
require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-82bfab52.js');
var MessageUtils = require('./MessageUtils-68957380.js');
var HiddenAccessible = require('./HiddenAccessible-12dce52a.js');
var MessageStartIcon = require('./MessageStartIcon-600451b4.js');
var MessageSummary = require('./MessageSummary-f93feb7b.js');

const baseStyles = "n1cjnf";
/**
 * The component that renders an individual message for inline component messaging.
 */

function ComponentMessage({
  detail,
  fieldLabel,
  severity = 'error'
}) {
  const classes = classNames.classNames([baseStyles, MessageUtils.severityBasedStyleClass(severity, 'inline')]);
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  const severityTranslations = {
    confirmation: translations.confirmation(),
    error: translations.error(),
    info: translations.info(),
    warning: translations.warn()
  };
  return jsxRuntime.jsxs("div", Object.assign({
    class: classes,
    role: "alert",
    "aria-atomic": "true"
  }, {
    children: [fieldLabel && jsxRuntime.jsx(HiddenAccessible.HiddenAccessible, {
      children: fieldLabel
    }), MessageUtils.isSeverityIconNeeded(severity) && jsxRuntime.jsx(MessageStartIcon.MessageStartIcon, {
      variant: "inline",
      severity: severity,
      translations: severityTranslations
    }), jsxRuntime.jsx(MessageSummary.MessageSummary, {
      variant: "inline",
      text: detail
    })]
  }));
}

exports.ComponentMessage = ComponentMessage;
/*  */
//# sourceMappingURL=ComponentMessage-a872eb39.js.map
