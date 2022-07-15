/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-69178ebf.js');
require('./UNSAFE_ComponentMessage.js');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var ComponentMessageContainer = require('./ComponentMessageContainer-00bd8855.js');
require('preact/hooks');
require('./UNSAFE_Environment.js');
require('preact');
require('./UNSAFE_Layer.js');
require('preact/compat');
require('./ComponentMessage-2d34a873.js');
require('./UNSAFE_Message.js');
require('./UNSAFE_Flex.js');
require('./Flex-b2488744.js');
require('./tslib.es6-5c843188.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-bca189f8.js');
require('./_curry1-33165c71.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./_curry2-40682636.js');
require('./_has-2cbf94e8.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./keys-4bd017bf.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-c4644897.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-5f5d588b.js');
require('./MessageCloseButton-bb97745b.js');
require('./MessageDetail-4f21648c.js');
require('./MessageFormattingUtils-d406c991.js');
require('./utils/UNSAFE_getLocale.js');
require('./Message.types-27433937.js');
require('./MessageStartIcon-8c60ed0a.js');
require('./index-9adddc55.js');
require('./UNSAFE_Icon.js');
require('./Icon-b60b3f23.js');
require('./hooks/UNSAFE_useUser.js');
require('./hooks/UNSAFE_useTheme.js');
require('./index-f38e0982.js');
require('./MessageSummary-e7e6089e.js');
require('./MessageTimestamp-00534130.js');
require('./MessageUtils-d65699cf.js');
require('./utils/UNSAFE_logger.js');
require('./utils/UNSAFE_soundUtils.js');
require('./MessagesManager-2ef5e191.js');
require('./UNSAFE_TransitionGroup.js');

const rootStyles = "r1yxs6yj";
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

const helpTextStyles = "h178vflh";
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
  start: "s1qfwwsi",
  end: "e1y8b86q"
};
const displayHiddenStyles = "dq4dyme";
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

const baseStyles = "b1edsw0w";
const variantStyles = {
  reflow: "r15mbt1n",
  efficient: "e53t0ow"
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
function InlineUserAssistance({ assistiveText, helpSourceLink, helpSourceText, id, isRequiredShown, messages = [], userAssistanceDensity }) {
    const { isReadonly: isFormReadonly } = hooks_UNSAFE_useFormContext.useFormContext();
    const needsUserAssistanceIfNoContent = userAssistanceDensity === 'efficient' && isFormReadonly === false;
    const { isFocused } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
    const uaInlineContent = messages.length > 0 ? (jsxRuntime.jsx(ComponentMessageContainer.ComponentMessageContainer, { messages: messages })) : (assistiveText || helpSourceLink) && isFocused ? (jsxRuntime.jsx(InlineHelp, { assistiveText: assistiveText, sourceLink: helpSourceLink, sourceText: helpSourceText })) : isRequiredShown ? (jsxRuntime.jsx(InlineRequired, {})) : null;
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
