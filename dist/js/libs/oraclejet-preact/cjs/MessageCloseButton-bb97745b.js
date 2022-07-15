/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');


const messageCloseButtonStyles = {
  banner: "b10cag1l",
  inline: undefined
};
/**
 * A Component for rendering the message close button
 */

function MessageCloseButton({
  onAction,
  buttonRenderer,
  title = 'Close',
  variant = 'banner'
}) {
  const renderedButton = buttonRenderer ? buttonRenderer(title, onAction, variant) : // we should ultimately be able to create an oj-button (or rather its preact
  // equivalent) here, but for now just create a regular HTML button if a renderer
  // is not passed in from the core JET layer
  jsxRuntime.jsx("button", Object.assign({
    "aria-label": title,
    onClick: onAction,
    title: title
  }, {
    children: "X"
  }));
  const classes = `oj-c-message${variant}-close-icon ${messageCloseButtonStyles[variant]}`; // Otherwise, render the close icon

  return jsxRuntime.jsx("div", Object.assign({
    class: classes
  }, {
    children: renderedButton
  }));
}

exports.MessageCloseButton = MessageCloseButton;
/*  */
//# sourceMappingURL=MessageCloseButton-bb97745b.js.map
