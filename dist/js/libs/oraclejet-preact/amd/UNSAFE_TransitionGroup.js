define(['exports', 'preact'], (function (exports, preact) { 'use strict';

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  /**
   * @classdesc
   * A utility class consisting of helper functions for handling transitions
   * related operations.
   */
  class TransitionUtils {
      /**
       * Creates a map of the children array with the calculated in prop
       *
       * @param children The newly received children
       * @param prevChildMapping The previous child mapping
       * @returns the newly created child mapping
       */
      static getChildMapping(children, prevChildMapping = new Map(), onExited = () => { }) {
          // A symbol to store trailing children
          const TRAILING = Symbol();
          let mappedDeletions = {};
          if (prevChildMapping.size !== 0) {
              // If previous children exists, get the mapped deleted children
              mappedDeletions = TransitionUtils._getMappedDeletions(children, prevChildMapping, TRAILING);
          }
          // Create a new Map with the new children along with the deletions inserted in their
          // respective positions
          const mergedChildrenMap = children.reduce((accumulator, currentChild) => {
              if (mappedDeletions[currentChild.key]) {
                  // There are keys from prev that are deleted before the current
                  // next key, so add them first
                  const deletedChildren = mappedDeletions[currentChild.key];
                  for (const key of deletedChildren) {
                      const previousChild = prevChildMapping.get(key);
                      // Set the in property to false, as this is children is removed
                      accumulator.set(key, preact.cloneElement(previousChild, { in: false }));
                  }
                  // Then add the current key. Do not change the in property as this is a
                  // retained children.
                  const previousChild = prevChildMapping.get(currentChild.key);
                  accumulator.set(currentChild.key, preact.cloneElement(currentChild, { in: previousChild.props.in }));
              }
              else {
                  // This is a new children. Set the in property to true
                  const newChild = preact.cloneElement(currentChild, {
                      // bind the original child so that the original callbacks can be
                      // called in the onExited callback from the argument.
                      onExited: onExited.bind(null, currentChild),
                      in: true
                  });
                  accumulator.set(currentChild.key, newChild);
              }
              return accumulator;
          }, new Map());
          // Finally add any trailing deleted children present in the mappedDeletions[TRAILING]
          for (const key of mappedDeletions[TRAILING] || []) {
              const previousChild = prevChildMapping.get(key);
              // Set the in property to false, as this is children is removed
              mergedChildrenMap.set(key, preact.cloneElement(previousChild, { in: false }));
          }
          // Finally return the merged children map
          return mergedChildrenMap;
      }
      ////////////////////////////
      // Private helper methods //
      ////////////////////////////
      /**
       * Creates a map of deleted children wrt to the keys in the new data.
       *
       * @param children The newly received children
       * @param prevChildMapping The previous child mapping
       * @param TRAILING A unique symbol to be used for storing the trailing children
       * @returns A map containing deleted children
       */
      static _getMappedDeletions(children, prevChildMapping, TRAILING) {
          // Create a set with keys of next children
          const nextChildrenKeys = new Set(children.map((children) => children.key));
          return [...prevChildMapping.keys()].reduce((accumulator, currentKey) => {
              if (nextChildrenKeys.has(currentKey)) {
                  // We have reached a point where the closest prevKey that
                  // is in the next, so if there are any pending keys add them
                  // to this key in mappedDeletions so that the pending keys will
                  // be added before the current next key
                  accumulator[currentKey] = accumulator[TRAILING];
                  delete accumulator[TRAILING];
              }
              else {
                  // If key is not found in next, then add it to the trailing keys.
                  const trailingChildren = accumulator[TRAILING]
                      ? [...accumulator[TRAILING], currentKey]
                      : [currentKey];
                  accumulator[TRAILING] = trailingChildren;
              }
              return accumulator;
          }, {});
      }
  }

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  /**
   * @classdesc
   * The <TransitionGroup> component manages a set of components that involves animations.
   * This component does not handle any animation, rather just a state machine that manages
   * the mounting and unmounting of the components over the time. The actual animation needs
   * to be handled by the content component.
   *
   * Consider the example below:
   * <TransitionGroup>
   *   {
   *      messages.map(message => {
   *        <Transition key={message.key}>
   *          <Message
   *            type={type}
   *            index={index}
   *            item={data.message}
   *            onOjClose={onOjClose}
   *          />
   *        </Transition>
   *      });
   *   }
   * </TransitionGroup>
   * As the messages are added/removed, the TransitionGroup Component automatically
   * toggles the 'in' prop of the Transition Component.
   *
   * @ignore
   */
  class TransitionGroup extends preact.Component {
      ///////////////////////////
      // Handler functions end //
      ///////////////////////////
      /**
       * Instantiates Component
       *
       * @param props The component properties
       */
      constructor(props) {
          super(props);
          ////////////////////////////////////////////////////////////////////////
          // Handler functions are created as members to have them 'this' bound //
          ////////////////////////////////////////////////////////////////////////
          /**
           * Handles when a transition component exits
           *
           * @param child The child instance that exited
           * @param node The corresponding transition element
           * @param key The key of the corresponding transition component
           */
          this._handleExited = (child, node) => {
              var _a, _b;
              const { children } = this.props;
              // get the child mapping for the current children
              const currentChildMapping = TransitionUtils.getChildMapping(children);
              // if the exited child is added again, do nothing here
              if (currentChildMapping.has(child.key))
                  return;
              // The child component has exited, call the original onExited callback
              (_b = (_a = child.props).onExited) === null || _b === void 0 ? void 0 : _b.call(_a, node);
              // Check if this component is still mounted, if so update the state
              if (this._mounted) {
                  this.setState((state) => {
                      const childMapping = new Map(state.childMapping);
                      // delete the exited child
                      childMapping.delete(child.key);
                      return { childMapping };
                  });
              }
          };
          this.state = {
              childMapping: undefined,
              handleExited: this._handleExited
          };
          this._mounted = false;
      }
      /**
       * Derives state from the current props
       *
       * @param props The current Props that will be used to get the new state
       * @param state The current state
       *
       * @returns The new state
       */
      static getDerivedStateFromProps(props, state) {
          const { childMapping, handleExited } = state;
          return {
              childMapping: TransitionUtils.getChildMapping(props.children, childMapping, handleExited)
          };
      }
      //////////////////////////////////////
      // Component Life Cycle Hooks Start //
      //////////////////////////////////////
      /**
       * Life cycle hook that gets called when the component is mounted on to
       * the DOM
       */
      componentDidMount() {
          this._mounted = true;
      }
      /**
       * Life cycle hook that gets called when the component is unmounted from
       * the DOM
       */
      componentWillUnmount() {
          this._mounted = false;
      }
      ////////////////////////////////////
      // Component Life Cycle Hooks End //
      ////////////////////////////////////
      /**
       * Renders the transition components
       */
      render() {
          const WrapperComponent = this.props.elementType;
          const { childMapping } = this.state;
          const children = [...childMapping.values()];
          return preact.h(WrapperComponent, null, children);
      }
  }
  TransitionGroup.defaultProps = {
      elementType: 'div'
  };

  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  /**
   * @classdesc
   * The component that acts as a layer for handing transitions.
   *
   * @ignore
   */
  class Transition extends preact.Component {
      ////////////////////////////////////////////////////////////////////////
      // Handler functions are created as members to have them 'this' bound //
      ////////////////////////////////////////////////////////////////////////
      ///////////////////////////
      // Handler functions end //
      ///////////////////////////
      /**
       * Instantiates Component
       *
       * @param props The component properties
       */
      constructor(props) {
          super(props);
          let appearStatus;
          if (props.in) {
              appearStatus = 'entering';
          }
          else {
              appearStatus = null;
          }
          this._appearStatus = appearStatus;
          this.state = { status: 'exited' };
          this._nextCallback = null;
      }
      //////////////////////////////////////
      // Component Life Cycle Hooks Start //
      //////////////////////////////////////
      /**
       * Lifecycle hook that gets called when the component is mounted to the DOM
       */
      componentDidMount() {
          this._updateStatus(this._appearStatus);
      }
      /**
       * Lifecycle hook that gets called after each update to the component
       *
       * @param prevProps The props of the component before last update
       */
      componentDidUpdate(prevProps) {
          let nextStatus = null;
          if (prevProps !== this.props) {
              const { status } = this.state;
              if (this.props.in) {
                  if (status !== 'entering' && status !== 'entered') {
                      // The component is just entering, so set the next status as Entering
                      nextStatus = 'entering';
                  }
              }
              else {
                  if (status === 'entering' || status === 'entered') {
                      // The component is not in the data anymore, so we need to do exit animation
                      // So, set the next status as Exiting
                      nextStatus = 'exiting';
                  }
              }
          }
          this._updateStatus(nextStatus);
      }
      /**
       * Lifecycle hook that gets called right before the component unmounts
       */
      componentWillUnmount() {
          this._cancelNextCallback();
      }
      ////////////////////////////////////
      // Component Life Cycle Hooks End //
      ////////////////////////////////////
      /**
       * Renders the Transition component
       *
       * @param props The current props
       * @returns The rendered component child
       */
      render(props) {
          return props === null || props === void 0 ? void 0 : props.children;
      }
      ////////////////////////////
      // Private helper methods //
      ////////////////////////////
      /**
       * Creates a wrapper callback function, which can be cancelled.
       *
       * @param callback The current callback function
       * @returns The created cancellable callback
       */
      _setNextCallback(callback) {
          let active = true;
          this._nextCallback = (...args) => {
              if (active) {
                  active = false;
                  this._nextCallback = null;
                  callback(...args);
              }
          };
          this._nextCallback.cancel = () => {
              active = false;
          };
          return this._nextCallback;
      }
      /**
       * Cancels the scheduled next callback
       */
      _cancelNextCallback() {
          var _a, _b;
          (_b = (_a = this._nextCallback) === null || _a === void 0 ? void 0 : _a.cancel) === null || _b === void 0 ? void 0 : _b.call(_a);
          this._nextCallback = null;
      }
      /**
       * Updates the status of the component. Performs corresponding Transitions.
       */
      _updateStatus(nextStatus) {
          if (nextStatus != null) {
              this._cancelNextCallback();
              if (nextStatus === 'entering') {
                  this._performEnter(this.base); // In our component, base is always Element
              }
              else {
                  this._performExit(this.base); // In our component, base is always Element
              }
          }
      }
      /**
       * Perform Entering transitions
       *
       * @param node The root DOM element of this component
       */
      _performEnter(node) {
          var _a, _b;
          (_b = (_a = this.props).onEnter) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
          this.setState({ status: 'entering' }, () => {
              var _a, _b;
              (_b = (_a = this.props).onEntering) === null || _b === void 0 ? void 0 : _b.call(_a, node, this._setNextCallback(() => {
                  this.setState({ status: 'entered' }, () => {
                      var _a, _b;
                      (_b = (_a = this.props).onEntered) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
                  });
              }), this.props.metadata);
          });
      }
      /**
       * Perform Exiting transitions
       *
       * @param node The root DOM element of this component
       */
      _performExit(node) {
          var _a, _b;
          (_b = (_a = this.props).onExit) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
          this.setState({ status: 'exiting' }, () => {
              var _a, _b;
              (_b = (_a = this.props).onExiting) === null || _b === void 0 ? void 0 : _b.call(_a, node, this._setNextCallback(() => {
                  this.setState({ status: 'exited' }, () => {
                      var _a, _b;
                      (_b = (_a = this.props).onExited) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
                  });
              }), this.props.metadata);
          });
      }
  }

  exports.Transition = Transition;
  exports.TransitionGroup = TransitionGroup;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
