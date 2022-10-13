/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-82bfab52.js');
require('./UNSAFE_ComponentMessage.js');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var ComponentMessageContainer = require('./ComponentMessageContainer-caebad7b.js');
require('preact/hooks');
require('./UNSAFE_Environment.js');
require('preact');
require('./UNSAFE_Layer.js');
require('preact/compat');
require('./ComponentMessage-a872eb39.js');
require('./UNSAFE_HiddenAccessible.js');
require('./HiddenAccessible-12dce52a.js');
require('./UNSAFE_Message.js');
require('./UNSAFE_Flex.js');
require('./Flex-327ae051.js');
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
require('./MessageCloseButton-c5605b75.js');
require('./MessageDetail-4d43ff71.js');
require('./MessageFormattingUtils-6764fed3.js');
require('./utils/UNSAFE_getLocale.js');
require('./Message.types-2c9b978d.js');
require('./MessageStartIcon-600451b4.js');
require('./index-dcd95188.js');
require('./UNSAFE_Icon.js');
require('./Icon-42559ff1.js');
require('./hooks/UNSAFE_useUser.js');
require('./hooks/UNSAFE_useTheme.js');
require('./index-e2b299b3.js');
require('./MessageSummary-f93feb7b.js');
require('./MessageTimestamp-abe719cf.js');
require('./MessageUtils-68957380.js');
require('./utils/UNSAFE_logger.js');
require('./utils/UNSAFE_soundUtils.js');
require('./MessagesManager-e88df2a4.js');
require('./UNSAFE_TransitionGroup.js');

const rootStyles = "_k9pwhe";
function InlineHelpSource({
  children,
  source
}) {
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  const userAssistance_learnMoreStr = translations.userAssistance_learnMore();
  children = children !== null && children !== void 0 ? children : userAssistance_learnMoreStr; // TODO: Implement and use a preact Link component instead of using an anchor tag

  return jsxRuntime.jsx("a", Object.assign({
    class: rootStyles,
    target: "_blank",
    href: source
  }, {
    children: children
  }));
}

const helpTextStyles = "_igqc22";
function InlineHelp({
  assistiveText,
  sourceLink,
  sourceText
}) {
  return jsxRuntime.jsxs("div", {
    children: [assistiveText && sourceLink ? jsxRuntime.jsx("span", Object.assign({
      class: helpTextStyles
    }, {
      children: assistiveText
    })) : assistiveText, sourceLink && jsxRuntime.jsx(InlineHelpSource, Object.assign({
      source: sourceLink
    }, {
      children: sourceText
    }))]
  });
}

const variantStyles$1 = {
  start: "_0kd52r",
  end: "va9krn"
};
const displayHiddenStyles = "g2l5cm";
function InlineRequired({
  align = 'end',
  hasHelp = false,
  hasMessages = false
}) {
  const classes = classNames.classNames([variantStyles$1[align], (hasHelp || hasMessages) && displayHiddenStyles]);
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  const requiredStr = translations.userAssistance_required();
  return jsxRuntime.jsx("div", Object.assign({
    class: classes
  }, {
    children: requiredStr
  }));
}

const baseStyles = "_yui29";
const variantStyles = {
  reflow: "_86ld0",
  efficient: "_hk1l7g"
}; // defaults to type='reflow'. If this is within an oj-form-layout, the o-f-l
// will pass down its type which defaults to 'efficient' (TODO).

function InlineUserAssistanceContainer({
  variant = 'reflow',
  children,
  id
}) {
  const classes = classNames.classNames([baseStyles, variantStyles[variant]]);
  return jsxRuntime.jsx("div", Object.assign({
    class: classes,
    id: id
  }, {
    children: children
  }));
}

// This has the precedence rules for the user assistance.
function InlineUserAssistance({ assistiveText, fieldLabel, helpSourceLink, helpSourceText, id, isRequiredShown, messages = [], userAssistanceDensity }) {
    const { isReadonly: isFormReadonly } = hooks_UNSAFE_useFormContext.useFormContext();
    const needsUserAssistanceIfNoContent = userAssistanceDensity === 'efficient' && isFormReadonly === false;
    const { isFocused } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
    const uaInlineContent = messages.length > 0 ? (jsxRuntime.jsx(ComponentMessageContainer.ComponentMessageContainer, { fieldLabel: fieldLabel, messages: messages })) : (assistiveText || helpSourceLink) && isFocused ? (jsxRuntime.jsx(InlineHelp, { assistiveText: assistiveText, sourceLink: helpSourceLink, sourceText: helpSourceText })) : isRequiredShown ? (jsxRuntime.jsx(InlineRequired, {})) : null;
    // when reflow we do not render unless it has content.
    // when efficient we render regardless of if it has content.
    // TODO: Get the userAssistanceDensity value from the FormContext
    return uaInlineContent || needsUserAssistanceIfNoContent ? (jsxRuntime.jsx(InlineUserAssistanceContainer, Object.assign({ id: id, variant: userAssistanceDensity }, { children: uaInlineContent }))) : null;
}

exports.InlineHelp = InlineHelp;
exports.InlineHelpSource = InlineHelpSource;
exports.InlineRequired = InlineRequired;
exports.InlineUserAssistance = InlineUserAssistance;
exports.InlineUserAssistanceContainer = InlineUserAssistanceContainer;
/*  */
//# sourceMappingURL=UNSAFE_UserAssistance.js.map
