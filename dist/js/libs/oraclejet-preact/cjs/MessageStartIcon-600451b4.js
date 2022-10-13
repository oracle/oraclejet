/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

require('./utils/UNSAFE_classNames.js');
require('./index-dcd95188.js');
require('./UNSAFE_Flex.js');
var UNSAFE_Icons = require('./index-e2b299b3.js');
var Flex = require('./Flex-327ae051.js');
var classNames = require('./classNames-82bfab52.js');

const messageStartIconStyles = "pkt5vp";
const severityIconStyles = {
  banner: "lwh3cu",
  inline: "r7vpj0"
};
const severityIcons = {
  confirmation: UNSAFE_Icons.SvgIcoSuccessS,
  error: UNSAFE_Icons.SvgIcoErrorS,
  info: UNSAFE_Icons.SvgIcoInformationS,
  warning: UNSAFE_Icons.SvgIcoWarningS
};
/**
 * StartIcon Component for rendering the severity based icon in Message
 */

function MessageStartIcon({
  severity,
  variant = 'banner',
  translations
}) {
  const IconComponent = severityIcons[severity]; // TODO: JET-50793

  const iconContent = variant === 'banner' ? jsxRuntime.jsx(Flex.Flex, Object.assign({
    align: "center",
    height: "100%"
  }, {
    children: jsxRuntime.jsx(IconComponent, {
      accessibleLabel: translations === null || translations === void 0 ? void 0 : translations[severity]
    })
  })) : jsxRuntime.jsx(IconComponent, {
    accessibleLabel: translations === null || translations === void 0 ? void 0 : translations[severity]
  });
  return jsxRuntime.jsx("div", Object.assign({
    class: classNames.classNames([`oj-c-message${variant}-start-icon`, messageStartIconStyles, severityIconStyles[variant]]),
    role: "presentation"
  }, {
    children: iconContent
  }));
}

exports.MessageStartIcon = MessageStartIcon;
/*  */
//# sourceMappingURL=MessageStartIcon-600451b4.js.map
