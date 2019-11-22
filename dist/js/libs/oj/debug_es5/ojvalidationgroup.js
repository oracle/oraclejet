/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojcontext', 'ojs/ojcomponentcore', 'ojs/ojlogger'], 
/*
* @param {Object} oj 
*/
function(oj, Context, Components, Logger)
{
  "use strict";
var __oj_validation_group_metadata = 
{
  "properties": {
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    }
  },
  "methods": {
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "showMessages": {},
    "focusOn": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};


/* global Components:false, Logger:false, Context:false */

/**
 * @ojcomponent oj.ojValidationGroup
 * @since 4.2.0
 *
 * @ojshortdesc A validation group tracks and summarizes the current validity state of a group of components.
 * @ojsignature class ojValidationGroup extends JetElement<ojValidationGroupSettableProperties>
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["valid"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 2
 *
 * @classdesc
 * <h3 id="optionOverview-section">
 *   JET ValidationGroup
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#optionOverview-section"></a>
 * </h3>
 * <p>The oj-validation-group element tracks the current validity state of its
 * JET custom element descendents that contain the <code class="prettyprint">valid</code>
 *  property.
 * </p>
 * <p>The oj-validation-group element searches all its descendents.
 * When it finds a component with a <code class="prettyprint">valid</code> property,
 * it adds it to the list of components
 * it is tracking. For performance reasons it does not search the tracked component's
 * children since the tracked component's valid state will  be based on
 * its children's valid state, if it has children with valid states.

 * Once it finds all the components it needs to track, it calculates its own
 * valid property value based on all the enabled (including hidden) components it tracks.
 * Enabled means not disabled or readonly, so
 * oj-validation-group's valid state ignores any disabled or readonly components.
 * </p>
 * <p>
 * The most 'invalid' component's
 * <code class="prettyprint">valid</code> property value will be
 * oj-validation-group's <code class="prettyprint">valid</code> property value.
 * When any of the tracked component's valid value changes, oj-validation-group will
 * be notified and will update its own valid value if it has changed.
 * </p>
 * <p>The oj-validation-group does not perform its own validation</p>
 * <p>This is an example of the oj-validation-group wrapping the JET form components.
 * All the JET form components have the <code class="prettyprint">valid</code> property.
 * It is not shown in the HTML markup
 * because it is readonly and cannot be set by the application developer.
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-validation-group>
 *   &lt;oj-form-layout>
 *     &lt;oj-input-text required value="text" label-hint="input 1">&lt;/oj-input-text>
 *     &lt;oj-text-area value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 *     &lt;oj-input-text value="text" label-hint="input 2">&lt;/oj-input-text>
 *     &lt;oj-input-text value="text" label-hint="input 3 longer label">&lt;/oj-input-text>
 *   &lt;/oj-form-layout>
 * &lt;/oj-validation-group>
 * </code></pre>
 * </p>
 *
 */

/**
 * The current validity state of the
 * <code class="prettyprint">oj-validation-group</code> element.
 * <p>
 * The oj-validation-group's
 * <code class="prettyprint">valid</code> property value is calculated from all the
 * enabled components it tracks. The most 'invalid' component's
 * <code class="prettyprint">valid</code> property value will be
 * oj-validation-group's <code class="prettyprint">valid</code> property value.
 * For example,
 * if all the components are valid except one is "invalidShown", then oj-validation-group's
 * valid value will be "invalidShown". If one is "invalidShown" and one is "invalidHidden",
 * then oj-validation-group's valid value will be "invalidShown" since "invalidShown" is more
 * invalid than "invalidHidden".
 * </p>
 * <p>
 * When any of the enabled tracked component's valid value changes, oj-validation-group will
 * be notified and will update its own valid value if it has changed.
 * There is no default value for the valid property
 * since it is a read-only property that is calculated on initialization
 * and kept updated if any of its tracked component's valid value changes.
 * </p>
 * <p>
 * The oj-validation-group does not filter out components that are hidden.
 * Hidden components will be considered
 * in oj-validation-group's valid calculation as long as they are enabled.
 * A hidden enabled component's valid state is no different
 * than a visible enabled component; if there
 * is an error that isn't a deferred error, its valid value is "invalidShown".
 * You can disable any components you do not want
 * considered in oj-validation-group's valid value.
 * </p>
 * <p>
 *  Note: New valid states may be added to the list of valid values in future releases.
 *  If so, we will keep the convention where if it is valid, it will start with "valid".
 *  If it is invalid, it will start with "invalid".
 *  If it is pending, it will start with "pending".
 * </p>
 * @member
 * @name valid
 * @ojshortdesc Read-only property used for retrieving the current validity state of the group of components being tracked. See the Help documentation for more information.
 * @expose
 * @memberof oj.ojValidationGroup
 * @instance
 * @type {string}
 * @ojvalue {string} "valid" The component is valid
 * @ojvalue {string} "pending" The component is waiting for the validation state to be determined.
 *    The "pending" state is never set in this release of JET. It will be set in a future release.
 * @ojvalue {string} "invalidHidden" The component has invalid messages hidden
 *    and no invalid messages showing. An invalid message is one with severity "error" or higher.
 * @ojvalue {string} "invalidShown" The component has invalid messages showing.
 *  An invalid message is one with severity "error" or higher.
 * @readonly
 * @ojwriteback
 * @since 4.2
 * @example <caption>Get the <code class="prettyprint">valid</code> property after initialization:</caption>
 * // getter
 * var valid = myValidationGroupElement.valid;
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 * @return {void}
 *
 * @expose
 * @memberof oj.ojValidationGroup
 * @instance
 *
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */

/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {any}
 *
 * @expose
 * @memberof oj.ojValidationGroup
 * @instance
 *
 * @example <caption>Get a single subproperty of a complex property:</caption>
 * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
 */

/**
 * Performs a batch set of properties.
 * @function setProperties
 * @param {Object} properties - An object containing the property and value pairs to set.
 * @return {void}
 * @expose
 * @memberof oj.ojValidationGroup
 * @instance
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */
// Slots
// //////

/**
 * <p>The <code class="prettyprint">&lt;oj-validation-group></code> accepts
 * any DOM elements in its Default slot but only tracks the validity
 * state of any JET custom element descendents that contain the valid property.
 *
 * @ojchild Default
 * @memberof oj.ojValidationGroup
 * @since 4.2.0
 */

/**
 * The _ojValidationGroup constructor function.
 *
 * @constructor
 * @private
 */
// eslint-disable-next-line no-unused-vars
function ojValidationGroup(context) {
  var FIRST_INVALID_SHOWN_KEY = '@firstInvalidShown';
  var self = this;
  var element = context.element;
  var _trackedComponents = [];

  var _ojDiv; // Our version of GCC has a bug where the second param of MutationObserver.observe must be of
  // type MutationObserverInit which isn't a real class that we can instantiate. Work around is to
  // create the MutationObserver on an alias of 'this' and call observe in a different function.
  // TODO Cleanup when we replace GCC with uglify in 5.0.0.

  /**
   * If the dom is mutated, call _refreshTrackedComponents if needed
   *
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  self._rootElementMutationObserver = new MutationObserver(function (mutations) {
    // mutations is an array of objects, each of type MutationRecord.
    //
    // if the oj-validation-group has been removed from the body element's subtree,
    // no need to remove event listeners or refresh.  Just disconnect the observer.
    // This can happen when you press apply in the cookbook demo.
    if (document.body.contains(element)) {
      var mutationsLength = mutations.length;
      var refreshNeeded = false; // figure out if we have to refresh the tracked components list
      // if refreshNeeded is false,
      // then continue for loop and look at the next mutation to see if that can be ignored
      // or if _refreshTrackedComponents needs to be called.

      for (var i = 0; i < mutationsLength && !refreshNeeded; i++) {
        var mutation = mutations[i]; // target is the node whose children changed

        var target = mutation.target; // we definitely need to refresh if we are removing a tracked node.
        // if we remove a tracked node, like ojInputTextNode.remove(), the target is the
        // tracked node's parent and the tracked node is in removedNodes.

        var removedNodes = mutation.removedNodes;
        var addedNodes = mutation.addedNodes;
        refreshNeeded = _isOrContainsTrackedComponent(removedNodes);

        if (!refreshNeeded && addedNodes.length > 0) {
          // if refreshNeeded is false, and we are adding something,
          // then look at this mutation;
          // if it is a child of any of the tracked components,
          // then ignore this mutation.
          var ignore = _isNodeInTrackedComponent(target); // if ignore is false, see if target or addedNodes needs to be tracked.
          // checking on the addedNodes does not always work. you must also check target
          // If so, set refreshNeeded to true


          if (!ignore && _isAnyNodeTrackable(target, addedNodes)) {
            refreshNeeded = true;
          }
        }
      } // if 'refreshNeeded' is true,
      // one of the mutations is or contains an element that needs tracking.


      if (refreshNeeded) {
        // remove event listeners from removed nodes if they are there
        _removeEventListenersFromRemovedChildren(mutations); // refresh the tracked components (clears and updates the _trackedComponents
        // and re-adds event handlers)


        _refreshTrackedComponents();
      }
    } else {
      this.disconnect();
    }
  }); // end self._rootElementMutationObserver
  // This gets called on initial render.
  // It gets the tracked components. No ui change is made here.

  self.createDOM = function () {
    element.classList.add('oj-validation-group'); // 1. add a div child of oj-validation-group.
    //    We call this _ojDiv and add data-oj-context onto it
    //    to be used by the BusyContext.
    // 2. reparent its children to _ojDiv. With the reparenting the framework
    //    resolves the old busy context and creates a
    //    new one for the children when you add them back in the DOM. It doesn't work to
    //    put the data-oj-context on oj-validation-group since the
    //    BusyContext needs the data-oj-context attribute needs to be in place
    //    when the children are added. It would work if the app developer puts the data-oj-context
    //    on oj-validation-group in his html page,
    //    but we don't want the app dev to have to do that.

    _ojDiv = document.createElement('div');

    _ojDiv.setAttribute('data-oj-context', ''); // wrap the children with the div
    // use firstChild so we can get text/comments/etc. ko bindings are comments, and we don't
    // want to skip those.


    while (element.firstChild) {
      _ojDiv.appendChild(element.firstChild); // @HTMLUpdateOK reparenting child nodes

    }

    element.appendChild(_ojDiv); // @HTMLUpdateOK appending internally created DOM element
  }; // remove event listeners and refresh tracked components
  // this is not called for property changes since I override handlePropertyChanged
  // and return true from it.
  // This function gets called on initial render and when refresh() is called.


  self.updateDOM = function () {
    // We wait until the child elements have finished upgrading before we get the
    // tracked components.
    // If we do not do this, we may get a lot of mutations as the children are adding
    // dom themselves; e.g., oj-form-layout  marks itself busy as it manipulates
    // its dom (adds oj-label, bonus dom, etc), and we don't have to get
    // a mutation observer for each of its manipulations if we wait until the BusyContext resolves.
    //
    // Another benefit of waiting is if an app dev adds an on-valid-changed listener
    // on oj-validation-group that he wants called on page load,
    // the listener gets called on page load only when we wait on the BusyContext resolving.
    // We can wait here or we can have the app dev wait. It's best to wait here for these
    // reasons.
    //
    // However, in the case where knockout is not used and the child components
    // are registered after the parent so that the parent's logic
    // gets run first before the children even get a chance to
    // add their busy states (before they even get registered).
    //  In that case this would immediately get called. It's ok since we will
    // get mutations when the components get upgraded, and they get the valid
    // property.
    var busyContext = Context.getContext(_ojDiv).getBusyContext();
    busyContext.whenReady().then(function () {
      // if this is the initial render, _trackedComponents.length is 0
      var length = _trackedComponents.length;

      for (var i = 0; i < length; i++) {
        _removeEventListenersFromNode(_trackedComponents[i]);
      }

      _refreshTrackedComponents(); // Pay attention to mutations.  The mutations
      // we care about are added elements and removed elements.
      // We need to update the trackedComponents and their listeners in these cases.


      self._rootElementMutationObserver.observe(element, {
        childList: true,
        subtree: true
      });
    });
  }; // Handles property changes for oj-validation-group.
  // handlePropertyChanged is an optional DefinitionalElementBridge method where if defined,
  // will be called with the property and value that changed
  // letting the component handle a partial update case. The component
  // can return true in this callback to skip a full render call to updateDOM
  // which will be done if this method returns false or undefined.
  // eslint-disable-next-line no-unused-vars


  self.handlePropertyChanged = function (property, value) {
    // skip a full render call to updateDOM when we get a property change.
    return true;
  };
  /**
   * Takes all deferred messages and shows them on each enabled component. An enabled
   * component is one that is not disabled or readonly.
   * As a result, the valid property may be updated; e.g.,
   * if the valid state was "invalidHidden"
   * before showMessages(), the valid state will become "invalidShown" after showMessages().
   * <p>
   * If there were no deferred messages this method simply returns.
   * </p>
   * @function showMessages
   * @access public
   * @instance
   * @return {void}
   * @example <caption>Display all messages including deferred ones.</caption>
   * validationGroupElem.showMessages();
   * @expose
   * @memberof oj.ojValidationGroup
   * @since 4.2.0
   */


  self.showMessages = function () {
    // get tracked components and call showMessages() on them
    // as long as they are enabled.
    for (var i = 0; i < _trackedComponents.length; i++) {
      var component = _trackedComponents[i];

      if (!(component.disabled || component.readonly)) {
        if ('showMessages' in component) {
          component.showMessages();
        }
      }
    }
  };
  /**
   * If the parameter passed in is "@firstInvalidShown", then
   * it sets focus on the first enabled component with invalid messages showing, if any.
   * If nothing is passed in, it will set focus to the first enabled component being tracked,
   * if any. An enabled component is one that is not disabled or readonly.
   *
   * @function focusOn
   * @ojshortdesc Sets the focus on one of the enabled components that is being tracked. See the Help documentation for more information.
   * @param {string=} key - "@firstInvalidShown" will focus on first invalidShown enabled
   * component in DOM order, if any. When no parameter is passed in, the method will
   * focus on first enabled component regardless of the valid state, if any. An enabled
   * component is one that is not disabled or readonly.
   * @ojsignature {target: "Type", for:"key", value: "'@firstInvalidShown'"}
   * @example <caption>Focus on the first enabled component showing invalid messages.</caption>
   * validationGroupElem.focusOn("@firstInvalidShown");
   * @example <caption>Focus on the first enabled component.</caption>
   * validationGroupElem.focusOn();
   * @access public
   * @instance
   * @return {void}
   * @expose
   * @memberof oj.ojValidationGroup
   * @since 4.2.0
   */


  self.focusOn = function (key) {
    var firstFocusable = null;
    var firstInvalid = null;

    if (key === FIRST_INVALID_SHOWN_KEY) {
      firstInvalid = _getFirstInvalidComponent();

      if (firstInvalid) {
        // If the component has the 'focusOn' method,
        // call that instead of focus()
        // to handle nested oj-validation-groups
        if ('focusOn' in firstInvalid) {
          firstInvalid.focusOn(FIRST_INVALID_SHOWN_KEY);
        } else {
          firstInvalid.focus();
        }
      }
    } else if (key === undefined) {
      // Get the first non readonly or disabled, then call focus
      firstFocusable = _getFirstFocusable();

      if (firstFocusable) {
        // If the component has the 'focusOn' method,
        // call that instead of focus()
        // to handle nested oj-validation-groups
        if ('focusOn' in firstFocusable) {
          firstFocusable.focusOn();
        } else {
          firstFocusable.focus();
        }
      }
    } else {
      // it's a no/op if they pass something into focusOn and it's not a key we support
      // which is now only '@firstInvalidShown'.
      // this behaves the same way html's focus() works.
      Logger.info("focusOn's parameter value is not '@firstInvalidShown' or empty, so it's a no-op.");
    }
  };
  /**
   * This function clears out _trackedComponents, finds them all again, and adds
   * the child event listeners on each one. It also updates the 'valid' property.
   * <p>
   * The dom spec for addEventListener states that it will not add duplicate
   * event listeners, so there is no need to track if we already added this.
   * If you want to remove child event listeners, do so before this function is called.
   * </p>
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _refreshTrackedComponents() {
    // clear out the tracked components when this is called
    _trackedComponents = []; // this sets the _trackedComponents

    _getTrackedComponents(element); // eslint-disable-next-line no-param-reassign


    context.props.valid = _consolidateValid(); // property change events do not bubble,
    // so add to each child where the property change occurs

    var length = _trackedComponents.length;

    for (var i = 0; i < length; i++) {
      _addChildEventListeners(_trackedComponents[i]);
    }
  }
  /**
   * Add the property change event listeners to the tracked component node, aka child.
   *
   * Only the component events bubble and not the property change events,
   * so it doesn't work to listen on the oj-validation-group for
   * these property change events. Instead we
   * put them on the child component themselves, and we share the listener.
   * @param {Element} child
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _addChildEventListeners(child) {
    child.addEventListener('validChanged', _handleValidChanged.bind(this));
    child.addEventListener('disabledChanged', _handleDisabledReadonlyChanged.bind(this));
    child.addEventListener('readonlyChanged', _handleDisabledReadonlyChanged.bind(this));
  }
  /**
   * remove child event listeners
   * Only the component events bubble and not the property change events,
   * so it doesn't work to listen on the oj-validation-group
   * for these property change events. We add/remove the listener from the
   * child JET component itself.
   *
   * @param {Array.<MutationRecord>} mutations the array of MutationRecords from the observer
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _removeEventListenersFromRemovedChildren(mutations) {
    var mutationsLength = mutations.length;

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];
      var removedNodesLength = mutation.removedNodes.length;

      for (var j = 0; j < removedNodesLength; j++) {
        var child = mutation.removedNodes[j];

        if (child.nodeType === 1) {
          _removeEventListenersFromNode(child);
        }
      }
    }
  }
  /**
   * Given a node element, remove the event listeners we added
   * @param {Element} node The element from which to remove the event listeners we added.
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _removeEventListenersFromNode(node) {
    node.removeEventListener('validChanged', _handleValidChanged);
    node.removeEventListener('disabledChanged', _handleDisabledReadonlyChanged);
    node.removeEventListener('readonlyChanged', _handleDisabledReadonlyChanged);
  }
  /**
   * Handles any validChanged events from the tracked components.
   * This consolidates the valid properties of the tracked components,
   * finding the most invalid state, and setting the oj-validation-group's
   * 'valid' property to that state.
   * @param {Event} event
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _handleValidChanged() {
    // eslint-disable-next-line no-param-reassign
    context.props.valid = _consolidateValid();
  }
  /**
   * Handles any disabledChanged and readonlyChanged
   * events from the tracked components.
   * This consolidates the valid properties of the tracked components,
   * finding the most invalid state, and setting the oj-validation-group's
   * 'valid' property to that state.
   * We do not want to count the valid state of a non-enabled component
   * in our oj-validation-group valid state.
   * @param {Event} event
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _handleDisabledReadonlyChanged(event) {
    var component = event.target;
    var componentValid = component.valid;
    var componentEnabled = !(component.readonly || component.disabled); // If the component that changed
    // its disabled/readonly state is valid,
    // then it's a no-op since that won't
    // change oj-validation-group's valid property value.

    if (componentValid === 'valid') {// invalidShown is the 'most severe' valid state, so if the
      // enabled component's valid state is invalidShown, then no
      // matter what oj-validation-group is already, it will be invalidShown now.
      // if oj-validation-group is already invalidShown, the set property is a no/op.
    } else if (componentEnabled && componentValid === 'invalidShown') {
      // eslint-disable-next-line no-param-reassign
      context.props.valid = 'invalidShown';
    } else {
      // if it went from true to false or vice versa,
      // we need to re-consolidate the valid value since
      // we do not count disabled/readonly components
      // in the valid calculation.
      // eslint-disable-next-line no-param-reassign
      context.props.valid = _consolidateValid();
    }
  }
  /**
   * This consolidates the valid properties of the tracked components,
   * finding the most invalid state, and setting the oj-validation-group's
   * 'valid' property to that state.
   * We track components even when they are disabled or readonly, but
   * we do NOT consider them in the 'valid' state calculation.
   * We track them because we will consider them in the 'value',
   *  when that property is added to oj-validation-group
   * in a future release.
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   * @return {string} Returns the most invalid state: "invalidShown", "invalidHidden",
   * "pending", or "valid".
   */


  function _consolidateValid() {
    var mostInvalid = 'valid'; // The order of validity (least valid to most valid) is:
    // "invalidShown", "invalidHidden", "pending", "valid"
    //
    // Find the most invalid state of all the tracked components.
    // break out of loop as soon as we see the
    // most invalid state, "invalidShown"

    var length = _trackedComponents.length;

    for (var i = 0; i < length && mostInvalid !== 'invalidShown'; i++) {
      var component = _trackedComponents[i];

      if (_isComponentNotDestroyed(component)) {
        var componentValidState = component.valid;
        var disabled = component.disabled;
        var readonly = component.readonly; // we do not count disabled/readonly components
        // in the valid calculation.

        if (!(disabled || readonly)) {
          if (componentValidState === 'invalidShown') {
            mostInvalid = 'invalidShown';
          } else if (componentValidState === 'invalidHidden') {
            mostInvalid = 'invalidHidden';
          } else if (componentValidState === 'pending' && mostInvalid === 'valid') {
            mostInvalid = 'pending';
          }
        }
      }
    }

    return mostInvalid;
  }
  /**
   * Gets all the tracked components within the tracker.
   * Check childNodes of root. If trackable, store in _trackedComponents and
   * don't go into descendents. If not trackable, store in notTrackableElements,
   * and do go into the descendents by calling this function recursively.
   * @param {Element} root The element from which to start the search for tracked components.
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _getTrackedComponents(root) {
    var i;
    var notTrackableElements = []; // get children
    // check each one. if trackable, store in trackedComponents and don't go into descendents.
    // if not trackable, store in notTrackableElements, and do go into the descendents.

    var children = root.childNodes;
    var length = children.length;

    for (i = 0; i < length; i++) {
      var child = children[i];

      var trackable = _isTrackable(child);

      if (trackable) {
        _trackedComponents.push(child);
      } else {
        notTrackableElements.push(child);
      }
    } // now loop through the notTrackableElements we found the first pass and check their children.


    length = notTrackableElements.length;

    for (i = 0; i < length; i++) {
      _getTrackedComponents(notTrackableElements[i]);
    }
  }
  /**
   * Check the node to see if oj-validation-group should track it.
   * In this first revision of oj-validation-group, we see if it has the 'valid' property.
   *
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   * @param {Node} elem see if the element is trackable by oj-validation-group
   * @return {boolean} true if the element is one the oj-validation-group must track.
   */


  function _isTrackable(elem) {
    // only look at elements with a '-' in it.
    if (elem.nodeType === 1 && elem.tagName.indexOf('-') !== -1 && 'valid' in elem) {
      if (_isComponentNotDestroyed(elem)) {
        var valid = elem.valid;

        if (valid !== undefined) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Check the target and nodes to see if any of them are trackable.
   * Useful for our MutationObserver when figuring out if we can ignore a mutation.
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   * @param {Node} target node to see if trackable
   * @param {NodeList} nodes nodes to see if any are trackable
   * @return {boolean} true if the target or a node from nodelist is trackable, else false
   */


  function _isAnyNodeTrackable(target, nodes) {
    var length = nodes.length;

    if (_isTrackable(target)) {
      return true;
    } // loop through the nodes and see if one is trackable


    for (var i = 0; i < length; i++) {
      if (_isTrackable(nodes[i])) {
        return true;
      }
    }

    return false;
  }
  /**
   * Checks if a _trackedComponents component contains the elem (i.e., a child)
   * Useful for our MutationObserver when figuring out if we can ignore a mutation.
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   * @param {Node} node node to check to see if it is a child of one of the tracked components
   * @return {boolean} true if a _trackedComponents component contains the elem, false otherwise
   *
   */


  function _isNodeInTrackedComponent(node) {
    var length = _trackedComponents.length;

    if (node.nodeType !== 1) {
      return false;
    } // look at this mutation.
    // if it is a child of any of the tracked components,
    // then ignore this mutation.


    for (var i = 0; i < length; i++) {
      var trackedComponent = _trackedComponents[i];

      if (trackedComponent.contains(node)) {
        return true;
      }
    }

    return false;
  }
  /**
   * Returns true if one of the nodes is or contains a tracked component.
   * Useful for our MutationObserver when looking at what nodes are being removed.
   *
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   * @param {NodeList} nodes nodes to see if any are in the _trackedComponents list or contain
   *  a tracked component
   * @return {boolean} true if any of the nodes are or contain a tracked component.
   */


  function _isOrContainsTrackedComponent(nodes) {
    var trackedLength = _trackedComponents.length;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];

      if (node.nodeType === 1) {
        // check if node is in the _trackedComponents
        if (_trackedComponents.indexOf(node) !== -1) {
          return true;
        } // now check if the node contains a tracked node


        for (var j = 0; j < trackedLength; j++) {
          if (node.contains(_trackedComponents[j])) {
            return true;
          }
        }
      }
    }

    return false;
  }
  /**
   * Gets the first component that isn't readonly or disabled to focus on.
   *
   * @returns {Element|null} the first focusable element or null if none
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _getFirstFocusable() {
    var trackedComponent = null;
    var length = _trackedComponents.length;

    for (var i = 0; i < length; i++) {
      trackedComponent = _trackedComponents[i];

      if (!(trackedComponent.readonly || trackedComponent.disabled)) {
        return trackedComponent;
      }
    }

    return null;
  }
  /**
   * Gets the first invalid component and returns the component to focus on.
   *
   * @returns {Element|null} the component instance that has focus or null
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _getFirstInvalidComponent() {
    var invalidComponents = [];

    if (element.valid !== 'invalidShown') {
      return null;
    } // locate first invalid component and set focus on it
    // _trackedComponents may not be in DOM order if a new tracked component was added not
    // at the end of the DOM order.


    var length = _trackedComponents.length;

    for (var i = 0; i < length; i++) {
      var component = _trackedComponents[i]; // don't try to focus on a disabled/readonly component

      if (!(component.disabled || component.readonly)) {
        if (component.valid === 'invalidShown') {
          invalidComponents.push(component);
        }
      }
    }

    if (invalidComponents.length === 0) {
      return null;
    } // sort the invalidComponents based on dom order


    invalidComponents.sort(function (elementA, elementB) {
      // If elementA precedes elementB in dom order, return -1
      // eslint-disable-next-line no-bitwise
      return elementA.compareDocumentPosition(elementB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    }); // invalidComponents is sorted now by document order, so return the first one.

    return invalidComponents[0];
  }
  /**
   * We need to make sure widgetElem hasn't been destroyed before
   * accessing its properties, like elem.["valid"].
   * We can remove this code in v5.0 when the framework handles custom elements implemented
   * as widgets's destroy/ko.cleanNode better.
   * In 5.0 the framework will  circumvent
   * jquery's cleanup altogether for custom elements and children of custom elements
   *
   * @param {Node} elem the element to check
   * @returns {boolean} true if it is safe to call .valid on the element, false if not.
   * @memberof oj.ojValidationGroup
   * @instance
   * @private
   */


  function _isComponentNotDestroyed(elem) {
    var widgetElem;
    var bridge = oj.BaseCustomElementBridge.getInstance(elem);
    var bridgeWidgetElem = bridge._WIDGET_ELEM; // bridgetWidgetElem is undefined for oj-validation-group
    // since it's not implemented using the widget code.
    // bridgetWidgetElem has a value for oj-input-text, oj-input-number, etc.,
    // since they are implemented using the widget code.

    if (bridgeWidgetElem !== undefined) {
      widgetElem = Components.__GetWidgetConstructor(bridgeWidgetElem);
    }

    return !!(bridgeWidgetElem === undefined || widgetElem);
  }
}



/* global __oj_validation_group_metadata:false */

/* global ojValidationGroup */
(function () {
  __oj_validation_group_metadata.extension._CONSTRUCTOR = ojValidationGroup;
  Object.freeze(__oj_validation_group_metadata);
  oj.CustomElementBridge.register('oj-validation-group', {
    metadata: __oj_validation_group_metadata
  });
})();

});