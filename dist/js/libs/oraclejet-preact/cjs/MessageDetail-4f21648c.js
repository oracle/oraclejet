/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

var preact = require('preact');
var MessageFormattingUtils = require('./MessageFormattingUtils-d406c991.js');

const messageDetailStyles = {
  // TODO: Reevaluate once the TEXT component is available (JET-46891)
  base: "bbznd28",
  banner: "b39ctpn",
  inline: undefined
};
/**
 * Default renderer for rendering the detail content.
 *
 * @param item The template item object
 * @returns Rendered detail content
 */

function defaultDetailRenderer(item) {
  const {
    detail
  } = item.data; // If the detail is null or an empty string, do not render the
  // content row

  if (!MessageFormattingUtils.isValidValueForProp(detail)) {
    return null;
  }

  return jsxRuntime.jsx(preact.Fragment, {
    children: detail
  });
}
/**
 * Detail Component for rendering the detail content of the Message
 */


function MessageDetail({
  item,
  renderer = defaultDetailRenderer,
  variant = 'banner'
}) {
  const renderedContent = renderer(item);
  if (renderedContent == null) return null; // If detail content is rendered, then wrap it in a div with specified style classes

  const classes = `oj-c-message${variant}-detail ${messageDetailStyles.base} ${messageDetailStyles[variant]}`;
  return jsxRuntime.jsx("div", Object.assign({
    class: classes
  }, {
    children: renderedContent
  }));
}

exports.MessageDetail = MessageDetail;
/*  */
//# sourceMappingURL=MessageDetail-4f21648c.js.map
