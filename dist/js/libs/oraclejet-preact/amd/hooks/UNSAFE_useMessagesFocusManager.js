define(['exports', 'preact/hooks'], (function (exports, hooks) { 'use strict';

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  const componentsMap = new Map();
  const componentsOrder = [];
  const priorFocusCache = new Map();
  let hasDocumentListener = false;
  let priorFocusedElement;
  let currentFocusedMessage;
  /**
   * Handles KeyDown event in the document element during the capture phase.
   *
   * @param event The keydown event object
   */
  function handleDocumentKeyDownCapture(event) {
      // Do nothing if any of the following is true:
      // 1. No components are registered
      // 2. Pressed key is not F6
      // 3. Event is defaultPrevented
      if (componentsMap.size === 0 ||
          event.key !== 'F6' ||
          event.defaultPrevented) {
          return;
      }
      // Try cycling focus through the messages and if that fails
      // set the focus to the prior focused element.
      if (!cycleFocusThroughMessages(event)) {
          currentFocusedMessage && togglePreviousFocus(currentFocusedMessage, event);
      }
  }
  /**
   * Handles the blur event captured on the document
   * @param event Blur event object
   */
  function handleDocumentBlurCapture(event) {
      priorFocusedElement = event.target;
  }
  /**
   * Handles the keydown event in the component
   * @param id A unique symbol that ids the component to be registered for managing focus
   * @param event The keydown event object
   */
  function handleComponentKeyDown(id, event) {
      // Ignore the call if the comp is not registered anymore or event default is prevented
      if (!componentsMap.has(id) || event.defaultPrevented) {
          return;
      }
      // Additional checks for keydown event and recognized keys
      if (event.type === 'keydown' && ['Escape'].includes(event.key)) {
          // toggle focus to the previously focused element
          togglePreviousFocus(id, event);
      }
  }
  /**
   * Handles the focus event in the component
   * @param id A unique symbol that ids the component to be registered for managing focus
   * @param event The focus event object
   */
  function handleComponentFocus(id, event) {
      var _a;
      // Ignore the call if the comp is not registered anymore or event default is prevented
      if (!componentsMap.has(id) || event.defaultPrevented) {
          return;
      }
      // Store the id of the current focused message
      currentFocusedMessage = id;
      // Track previous focus if the priorFocused element is not a part of this or any other
      // registered component
      const [, callbacks] = componentsMap.get(id);
      if (priorFocusedElement && !isPartOfRegisteredMessages(priorFocusedElement)) {
          priorFocusCache.set(id, priorFocusedElement);
          // since the focus moved to this component from outside, call the
          // onFocus callbacks if available
          (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onFocus) === null || _a === void 0 ? void 0 : _a.call(callbacks);
      }
  }
  /**
   * Handles the blur event in the component
   * @param id A unique symbol that ids the component to be registered for managing focus
   * @param event The focus event object
   */
  function handleComponentBlur(id, event) {
      // Ignore the call if the comp is not registered anymore or event default is prevented
      if (!componentsMap.has(id) || event.defaultPrevented) {
          return;
      }
      // reset the current focus message ID
      currentFocusedMessage = undefined;
  }
  /**
   * Cycles the focus through the registered messages component from the previous message of current focused
   * message to the top of the hierarchy.
   *
   * @param event The event that initiated this action
   * @returns boolean indicating the result of this action
   */
  function cycleFocusThroughMessages(event) {
      var _a, _b, _c;
      // At this point, we need to focus the previous message from the current focused
      // message
      const nextPosition = indexOfOrDefaultTo(componentsOrder, currentFocusedMessage, componentsOrder.length) - 1;
      for (let i = nextPosition; i > -1; i--) {
          const id = componentsOrder[i];
          const [ref] = (_a = componentsMap.get(id)) !== null && _a !== void 0 ? _a : [];
          if ((_c = (_b = ref === null || ref === void 0 ? void 0 : ref.current) === null || _b === void 0 ? void 0 : _b.focus) === null || _c === void 0 ? void 0 : _c.call(_b)) {
              // prevent default action as the event has transferred focus
              event.preventDefault();
              // Focus is set, so break the loop
              return true;
          }
      }
      return false;
  }
  /**
   * Checks if the provided element is a part of any of the registered messages
   *
   * @param element The candidate element
   * @returns true if is inside any of the registered messages
   */
  function isPartOfRegisteredMessages(element) {
      var _a;
      for (const [ref] of componentsMap.values()) {
          if ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(element)) {
              return true;
          }
      }
      return false;
  }
  /**
   * Finds the index of the item in the array, if it does not exist returns the
   * default value instead
   *
   * @param arr The array to perform the search
   * @param search The item to be searched
   * @param defaultIndex The default value if the item is not found
   * @returns The index of the item or the default value
   */
  function indexOfOrDefaultTo(arr, search, defaultIndex = -1) {
      const index = arr.indexOf(search);
      if (index !== -1)
          return index;
      return defaultIndex;
  }
  /**
   * Traverses through the priorFocusCache to fetch the last focused
   * element outside of the messages region.
   *
   * @param id The current focused message's ID
   * @returns The closest prior focused element, null if not found
   */
  function getClosestPriorFocusedElement(id) {
      // F6 navigation cycles through messages in reverse order
      // so to get the closest prior focused element we need to
      // traverse in natural order from the current message
      const index = componentsOrder.indexOf(id);
      for (let i = index; i < componentsOrder.length; i++) {
          if (priorFocusCache.has(componentsOrder[i])) {
              return priorFocusCache.get(componentsOrder[i]);
          }
      }
      // No prior cache found, so return null
      return null;
  }
  /**
   * Adds the component to the internal members.
   *
   * @param id A unique symbol that ids the component to be registered for managing focus
   * @param ref A ref handle to the focusable component
   * @param callbacks Optional callbacks
   */
  function addComponent(id, ref, callbacks) {
      componentsMap.set(id, [ref, callbacks]);
      componentsOrder.push(id);
  }
  /**
   * Removes the component from the internal members
   *
   * @param id A unique symbol that ids the component to be registered for managing focus
   */
  function removeComponent(id) {
      if (!componentsMap.has(id)) {
          return;
      }
      componentsMap.delete(id);
      componentsOrder.splice(componentsOrder.indexOf(id), 1);
  }
  /**
   * Clears the priorFocusCache of the specified component
   *
   * @param id The id of the component whose cache is to be cleared
   */
  function clearFocusCache(id) {
      priorFocusCache.delete(id);
  }
  /**
   * Adds event listeners to the document element
   */
  function addDocumentListeners() {
      // Add the events in capture phase, as we do not want this to be stopped by the elements
      // in the DOM tree
      document.documentElement.addEventListener('keydown', handleDocumentKeyDownCapture, true);
      document.documentElement.addEventListener('blur', handleDocumentBlurCapture, true);
      hasDocumentListener = true;
  }
  /**
   * Removes event listeners from the document element
   */
  function removeDocumentListeners() {
      document.documentElement.removeEventListener('keydown', handleDocumentKeyDownCapture, true);
      document.documentElement.removeEventListener('blur', handleDocumentBlurCapture, true);
      hasDocumentListener = false;
  }
  /**
   * Registers a component for its focus to be managed.
   *
   * @param id A unique symbol that ids the component to be registered for managing focus
   * @param ref A ref handle to the focusable component
   * @param callbacks Optional callbacks
   *
   * @returns An object focus event listener and keydown event listener
   */
  function register(id, ref, callbacks) {
      if (!hasDocumentListener) {
          addDocumentListeners();
      }
      addComponent(id, ref, callbacks);
      return {
          onfocusin: (event) => handleComponentFocus(id, event),
          onfocusout: (event) => handleComponentBlur(id, event),
          onKeyDown: (event) => handleComponentKeyDown(id, event)
      };
  }
  /**
   * Focuses the element which was focused prior to the passed component.
   * @param id A unique symbol that ids the component to be registered for managing focus
   * @param event The event that initiated the focus transfer. The event will be default prevented if the focus
   *              is transferred successfully.
   * @returns true, if focus is restored. false otherwise.
   */
  function togglePreviousFocus(id, event) {
      const target = getClosestPriorFocusedElement(id);
      if (target && document.body.contains(target)) {
          target.focus();
          // As the prior focus is restored, empty the focus cache
          priorFocusCache.clear();
          event === null || event === void 0 ? void 0 : event.preventDefault();
          return true;
      }
      // Prior focused element does not exist or
      // Element does not exist in DOM.
      return false;
  }
  /**
   * Unregisters a component from focus management
   *
   * @param id A unique symbol that ids the component to be registered for managing focus
   */
  function unregister(id) {
      removeComponent(id);
      clearFocusCache(id);
      if (hasDocumentListener && componentsMap.size === 0) {
          // no component is registered, so remove the document listeners
          removeDocumentListeners();
      }
  }
  /**
   * Moves the priority of the component with the specified id
   *
   * @param id A unique symbol that ids the component to be registered for managing focus
   */
  function prioritize(id) {
      if (!componentsMap.has(id)) {
          // Do nothing if the component is not registered
          return;
      }
      // Remove and add the component with the same ref
      // to move it in the priority queue
      const [ref, callbacks] = componentsMap.get(id);
      removeComponent(id);
      addComponent(id, ref, callbacks);
  }
  /**
   * The focus manager object
   */
  const messagesFocusManager = {
      prioritize,
      register,
      togglePreviousFocus,
      unregister
  };
  /**
   * A custom hook that handles focus management for the messages component.
   * @param ref The custom ref handle for the component
   * @param callbacks Optional callbacks
   * @returns The handlers and a controller
   */
  function useMessageFocusManager(ref, callbacks) {
      const id = hooks.useRef(Symbol());
      const focusManager = hooks.useRef(messagesFocusManager);
      const [handlers, setHandlers] = hooks.useState({});
      const controller = hooks.useMemo(() => ({
          prioritize: () => focusManager.current.prioritize(id.current),
          restorePriorFocus: () => focusManager.current.togglePreviousFocus(id.current)
      }), [focusManager.current, id.current]);
      // Register handlers for focus management
      hooks.useEffect(() => {
          setHandlers(focusManager.current.register(id.current, ref, callbacks));
          return () => focusManager.current.unregister(id.current);
      }, []);
      return {
          handlers,
          controller
      };
  }

  exports.useMessageFocusManager = useMessageFocusManager;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
