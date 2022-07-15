/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var preact = require('preact');


const highlightStyles = "hkkzuh9";
/**
 * Renders a text string with highlighting applied to the given text to match.
 */

function HighlightText({
  children = '',
  matchText = ''
}) {
  return highlighter(children, matchText);
}
const HIGHLIGHT_TOKEN = '__@@__';
const HIGHLIGHT_PATTERN = `${HIGHLIGHT_TOKEN}$&${HIGHLIGHT_TOKEN}`;

function highlighter(unhighlightedText, matchText) {
  if (matchText.length > 0 && unhighlightedText.length > 0) {
    const escapedMatchText = escapeRegExp(matchText);
    const highlightedText = unhighlightedText.replace(new RegExp(escapedMatchText, 'gi'), HIGHLIGHT_PATTERN);
    const tokens = highlightedText.split(HIGHLIGHT_TOKEN);
    const nodes = tokens.map((current, index) => index % 2 == 0 ? current : jsxRuntime.jsx("span", Object.assign({
      class: highlightStyles
    }, {
      children: current
    })));
    return jsxRuntime.jsx(preact.Fragment, {
      children: nodes
    });
  }

  return jsxRuntime.jsx(preact.Fragment, {
    children: unhighlightedText
  });
}

function escapeRegExp(str) {
  // copied from:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

exports.HighlightText = HighlightText;
/*  */
//# sourceMappingURL=HighlightText-7c600dab.js.map
