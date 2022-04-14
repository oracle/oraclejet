define(['exports', 'preact', 'preact/hooks'], (function (exports, preact, hooks) { 'use strict';

  const offScreenStyle = "oj-live-region-offScreenStyle-14cpbki";
  /**
   * A helper component that renders an aria-live region
   *
   * TODO: Create a more centralized component that can handle aria-live region for
   * the whole application and use context api to communicate
   */

  function LiveRegion({
    atomic = 'false',
    text = '',
    timeout = 100,
    type = 'polite'
  }) {
    const ariaLiveText = useLiveText(text, timeout);
    return preact.h("span", {
      "aria-live": type,
      "aria-atomic": atomic,
      class: offScreenStyle
    }, ariaLiveText);
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

  exports.LiveRegion = LiveRegion;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
