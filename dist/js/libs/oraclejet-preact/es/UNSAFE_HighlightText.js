/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx } from 'preact/jsx-runtime';
import { Fragment } from 'preact';
import './UNSAFE_HighlightText.css';

const highlightStyles = "_xwz06k";
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
    const nodes = tokens.map((current, index) => index % 2 == 0 ? current : jsx("span", Object.assign({
      class: highlightStyles
    }, {
      children: current
    })));
    return jsx(Fragment, {
      children: nodes
    });
  }

  return jsx(Fragment, {
    children: unhighlightedText
  });
}

function escapeRegExp(str) {
  // copied from:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { HighlightText };
/*  */
//# sourceMappingURL=UNSAFE_HighlightText.js.map
