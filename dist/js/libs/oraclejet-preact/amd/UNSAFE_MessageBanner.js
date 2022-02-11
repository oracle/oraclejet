define(['exports', '@oracle/oraclejet-preact/hooks/UNSAFE_useMessagesFocusManager', '@oracle/oraclejet-preact/hooks/UNSAFE_useMutableRefArray', '@oracle/oraclejet-preact/UNSAFE_LiveRegion', '@oracle/oraclejet-preact/UNSAFE_Message', 'preact', 'preact/hooks', '@oracle/oraclejet-preact/UNSAFE_Flex'], (function (exports, UNSAFE_useMessagesFocusManager, UNSAFE_useMutableRefArray, UNSAFE_LiveRegion, UNSAFE_Message, preact, hooks, UNSAFE_Flex) { 'use strict';

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  /**
   * Animation config for banner messages.
   * TODO: Get this from theme context provider
   */
  const DEFAULT_ANIMATIONS = {
      enter: [{ effect: 'expand', duration: '0.25s', direction: 'height' }],
      exit: [{ effect: 'collapse', duration: '0.25s', direction: 'height' }]
  };
  /**
   * Default translations for banner messages.
   * TODO: Replace this with preact translations
   */
  const DEFAULT_TRANSLATIONS = {
      close: 'Close',
      navigationFromMessagesRegion: 'Entering messages region. Press F6 to navigate back to prior focused element.',
      navigationToMessagesRegion: 'Messages region has new messages. Press F6 to navigate to the most recent message region.',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      confirmation: 'Confirmation'
  };
  /**
   * Renders individual messages based on the provided data
   */
  function MessageBanner({ closeButtonRenderer, detailRendererKey, data, onClose, renderers, startAnimation, translations = DEFAULT_TRANSLATIONS, type = 'section' }) {
      // Keyboard Navigation and Focus Management
      const messagesRef = UNSAFE_useMutableRefArray.useMutableRefArray(data.length);
      const containerDivRef = hooks.useRef(null);
      const focusHandleRef = hooks.useRef(null);
      const [liveRegionText, setLiveRegionText] = hooks.useState();
      const [shouldRender, setShouldRender] = hooks.useState(data.length > 0);
      const [prevDataLength, setPreviousDataLength] = hooks.useState(0);
      // We need a ref that holds the current data length, as the exiting
      // node will always call handleNextFocus with previous data.
      // As in TransitionGroup, when an item is removed from the data, a new vnode
      // will not be created instead previous vnode will be used. So, the new handleNextFocus
      // will not be called when the old vnode exits. Thus, we will be using a ref
      // to always get the correct current data length.
      const dataLengthRef = hooks.useRef(data.length);
      // Update the data length ref
      dataLengthRef.current = data.length;
      // Update the focusHandleRef
      hooks.useImperativeHandle(focusHandleRef, () => ({
          focus: () => {
              var _a, _b;
              // Only trigger focus if the component is rendering messages
              if (data.length) {
                  (_b = (_a = messagesRef[0]) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
                  return true;
              }
              return false;
          },
          contains: (element) => {
              var _a, _b;
              // Only invoke method if the component is rendering messages
              if (data.length && element) {
                  return (_b = (_a = containerDivRef.current) === null || _a === void 0 ? void 0 : _a.contains(element)) !== null && _b !== void 0 ? _b : false;
              }
              return false;
          }
      }), [data, messagesRef]);
      // Register handlers for focus management
      const { controller, handlers } = UNSAFE_useMessagesFocusManager.useMessageFocusManager(focusHandleRef, {
          onFocus: hooks.useCallback(() => {
              setLiveRegionText(translations.navigationFromMessagesRegion);
          }, [setLiveRegionText])
      });
      /**
       * Emits onClose event for the provided message.
       * @param item The message which the user tried to close
       */
      const handleClose = hooks.useCallback((item) => {
          onClose === null || onClose === void 0 ? void 0 : onClose(item);
      }, [onClose]);
      /**
       * Handles focus when a message is closed and animated away from the DOM
       * @param key The key of the message
       * @param index The index of the message
       */
      const handleNextFocus = hooks.useCallback((_key, index) => {
          var _a, _b, _c;
          const currentDataCount = dataLengthRef.current;
          const currentMessagesCount = messagesRef.length;
          const message = messagesRef[index];
          const isCurrentMessageFocused = (_a = message === null || message === void 0 ? void 0 : message.current) === null || _a === void 0 ? void 0 : _a.contains(document.activeElement);
          // If there are no messages, do not render anything. As the old messages
          // are still in the DOM, use the data count to determine what to do next as it
          // represents the next state.
          if (currentDataCount === 0) {
              setShouldRender(false);
              // If the current message holds focus, then restore previous focus
              if (isCurrentMessageFocused) {
                  controller.restorePriorFocus();
              }
              return;
          }
          let nextMessageToFocus = -1;
          // Now that this message is closed, focus the next message will take this index. If no
          // message will take this message's index, then it means that this is the last message. If
          // that is the case, focus the message at the previous index.
          // Use the count of the messages that are currently shown in the UI (current state including
          // the message that will be removed). This way we can get the correct element from the messagesRef
          // as it will contain the closing message as well.
          if (index + 1 < currentMessagesCount) {
              nextMessageToFocus = index + 1;
          }
          else if (index - 1 > -1) {
              nextMessageToFocus = index - 1;
          }
          // if next message is available then transfer the focus to the next element
          if (nextMessageToFocus > -1 && isCurrentMessageFocused) {
              (_c = (_b = messagesRef[nextMessageToFocus]) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.focus();
          }
      }, [controller, dataLengthRef, messagesRef, setShouldRender]);
      // Prioritize this component whenever the data changes and
      // the new data has atleast one message
      hooks.useEffect(() => {
          if (data.length) {
              // set state to render content whenever the data is not empty
              setShouldRender(true);
              if (data.length > prevDataLength) {
                  // Only when having a new message, update the aria-live area with the
                  // text to indicate how to get the focus to the new message.
                  setLiveRegionText(translations.navigationToMessagesRegion);
              }
              controller.prioritize();
          }
          else {
              // When there are no messages, clear the live region so that
              // the navigation text will be read when a new message appear
              setLiveRegionText('');
          }
          setPreviousDataLength(data.length);
      }, [data, controller, prevDataLength, setPreviousDataLength, setShouldRender]);
      // When both shouldRender flag is false and no data to render, do not render
      // anything
      if (!shouldRender && data.length === 0) {
          return null;
      }
      return (preact.h("div", Object.assign({ ref: containerDivRef, class: 'oj-messagebanner', tabIndex: -1 }, handlers),
          preact.h(UNSAFE_Flex.Flex, { direction: "column", gap: type === 'section' ? 'xs' : undefined },
              preact.h(UNSAFE_Message.MessagesManager, { animations: DEFAULT_ANIMATIONS, data: data, startAnimation: startAnimation, onMessageWillRemove: handleNextFocus }, ({ index, item }) => {
                  return (preact.h(UNSAFE_Message.Message, { messageRef: messagesRef[index], item: item, closeButtonRenderer: closeButtonRenderer, detailRenderer: UNSAFE_Message.getRenderer(item, detailRendererKey, renderers), index: index, key: item.key, translations: translations, type: type, onClose: handleClose }));
              }),
              preact.h(UNSAFE_LiveRegion.LiveRegion, { text: liveRegionText }))));
  }

  exports.MessageBanner = MessageBanner;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
