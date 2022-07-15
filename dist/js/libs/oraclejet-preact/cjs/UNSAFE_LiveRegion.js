/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
var hooks = require('preact/hooks');

const offScreenStyle = "o1xwg2xa";
/**
 * A helper component that renders an aria-live region
 *
 * TODO: Create a more centralized component that can handle aria-live region for
 * the whole application and use context api to communicate
 */

function LiveRegion({
  atomic = 'false',
  children = '',
  timeout = 100,
  type = 'polite'
}) {
  const ariaLiveText = useLiveText(children, timeout);
  return jsxRuntime.jsx("span", Object.assign({
    "aria-live": type,
    "aria-atomic": atomic,
    class: offScreenStyle
  }, {
    children: ariaLiveText
  }));
}
/**
 * A custom hook for handling the aria-live region
 *
 * @param text The aria-live text to use
 * @param timeout The timeout for setting the aria-live text async
 * @returns The aria-live text
 */


function useLiveText(text, timeout) {
  const [liveText, setLiveText] = hooks.useState();
  const updateText = hooks.useCallback(() => setLiveText(text), [text]);
  const updateTextAsync = hooks.useCallback(() => setTimeout(updateText, timeout), [updateText, timeout]);
  hooks.useEffect(() => {
    const timeoutId = updateTextAsync();
    return () => clearTimeout(timeoutId);
  }, [updateTextAsync]);
  return liveText;
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.LiveRegion = LiveRegion;
/*  */
//# sourceMappingURL=UNSAFE_LiveRegion.js.map
