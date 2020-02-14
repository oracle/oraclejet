/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'knockout', 'ojs/ojmessaging', 'ojs/ojknockout'], function(oj, $, Context, ko, Message)
{
  "use strict";


/* jslint browser: true, devel: true*/
/* global Message:false, Context:false */

/**
 * Tracks the validity of a group of components bound to this observable. It also provides
 * properties and methods that the page author can use to enforce form validation best practice.
 *
 * <p>
 * Validity of components that are disabled or readOnly will not be tracked by this object.</li>
 * </p>
 *
 * <p>
 * The <code class="prettyprint">invalidComponentTracker</code> binding attribute should be bound to
 * a ko observable, and 'ojs/ojknockout-validation' should be included in the dependency list.
 * At runtime the framework creates an instance of this type
 * <code class="prettyprint">oj.InvalidComponentTracker</code> and sets it on the bound observable.<br/>
 * This object can then be used by page authors to do the following -
 * <ul>
 * <li>determine if there are invalid components tracked by this object that are currently showing
 * errors.</li>
 * <li>determine if there are invalid components tracked by this object that are currently deferring
 * showing errors.</li>
 * <li>set focus on the first invalid component in the tracked group</li>
 * <li>show all messages on all tracked components including deferred error messages, and set focus
 * on the first invalid component.</li>
 * </ul>
 * </p>
 *
 * @example <caption> Bind an observable to the <code class="prettyprint">invalidComponentTracker</code> and access oj.InvalidComponentTracker instance.</caption>
 * &lt;input id="username" type="text" required
 *   data-bind="ojComponent: {component: 'ojInputText', value: userName,
 *    invalidComponentTracker: tracker}">
 * &lt;input id="password" type="text" required
 *   data-bind="ojComponent: {component: 'ojInputPassword', value: password,
 *    invalidComponentTracker: tracker}">
 *
 * &lt;script>
 * function MyViewModel() {
 *   var self = this;
 *   self.tracker = ko.observable();
 *
 *   log = function ()
 *   {
 *     var trackerObj = ko.utils.unwrapObservable(self.tracker);
 *     console.log(trackerObj instanceof oj.InvalidComponentTracker); // true, so safe to call InvalidComponentTracker methods and properties.
 *   }
 *
 *   self.focusOnFirstInvalid = function()
 *   {
 *      var trackerObj = ko.utils.unwrapObservable(self.tracker);
 *      if (trackerObj !== undefined)
 *      {
 *        // make sure the trackerObj is an oj.InvalidComponentTracker
 *        // before calling methods on it.
 *        if (trackerObj instanceof oj.InvalidComponentTracker)
 *        {
*           // showMessages first
*           // (this will show any hidden messages, if any)
*           trackerObj.showMessages();
*           // focusOnFirstInvalid will focus on the first component
*           // that is invalid, if any.
*           trackerObj.focusOnFirstInvalid();
*         }
*       }
*     }
 * }
 * &lt;/script>
 * Note: Make sure you have included the 'ojs/ojknockout-validation' dependency in your require list,
 * otherwise you will see an error about InvalidComponentTracker being undefined.
 *
 * @class oj.InvalidComponentTracker
 * @constructor
 * @class
 * @export
 * @since 0.7.0
 * @ignore
 */
oj.InvalidComponentTracker = function () {
  this.Init();
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.InvalidComponentTracker, oj.Object, 'oj.InvalidComponentTracker');

// DOCLETS for public properties

/**
 * Whether there is at least one component (tracked by this object) that is invalid and is currently
 * showing messages.
 *
 *
 * @example <caption>Disable button using <code class="prettyprint">invalidShown</code> property:</caption>
 * &lt;input id="username" type="text" required
 *   data-bind="ojComponent: {component: 'ojInputText', value: userName,
 *    invalidComponentTracker: tracker}">
 * &lt;input id="password" type="text" required
 *   data-bind="ojComponent: {component: 'ojInputPassword', value: password,
 *    invalidComponentTracker: tracker}">
 * &lt;button type="button" data-bind="ojComponent: {component: 'ojButton', label: 'Create',
 *   disabled: tracker()['invalidShown']}"></button>
 *
 * &lt;script>
 * var userName = ko.observable();
 * var password = ko.observable();
 * var tracker = ko.observable();
 * &lt;/script>
 *
 * @member
 * @name invalidShown
 * @access public
 * @instance
 * @default false
 * @type {boolean}
 * @expose
 * @memberof oj.InvalidComponentTracker
 */


/**
 * prevent preceding jsdoc from applying to following line of code
 * @ignore
 */
// Options we are interested in listening to changes for.
oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN = 'messagesShown';
oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN = 'messagesHidden';
oj.InvalidComponentTracker._OPTION_DISABLED = 'disabled';
oj.InvalidComponentTracker._OPTION_READONLY = 'readOnly';

/**
 * Whether there is at least one component that is invalid with deferred messages, i.e., messages
 * that are currently hidden. For example, when a component is
 * required, deferred validation is run when the component is created.
 * Any validation error raised is not shown to user right away, i.e., it is deferred.
 *
 * @example <caption>Enable button using <code class="prettyprint">invalidHidden</code> property:</caption>
 * &lt;input id="username" type="text" required
 *   data-bind="ojComponent: {component: 'ojInputText', value: userName,
 *    invalidComponentTracker: tracker}">
 * &lt;input id="password" type="text" required
 *   data-bind="ojComponent: {component: 'ojInputPassword', value: password,
 *    invalidComponentTracker: tracker}">
 * &lt;br/>
 * &lt;button type="button" data-bind="ojComponent: {component: 'ojButton', label: 'Create',
 *   disabled: !tracker()['invalidHidden']}"></button>
 *
 * &lt;script>
 * var userName = ko.observable();
 * var password = ko.observable();
 * var tracker = ko.observable();
 * &lt;/script>
 *
 * @member
 * @name invalidHidden
 * @access public
 * @instance
 * @default false
 * @type {boolean}
 * @expose
 * @memberof oj.InvalidComponentTracker
 */
/**
 * Initializer
 * @protected
 * @memberof oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype.Init = function () {
  oj.InvalidComponentTracker.superclass.Init.call(this);

  // INTERNAL PROPERTIES
  // Array of Objects containing component and its element
  // that are being tracked by invalidComponentTracker
  // [{'component': component, 'element': element}]
  this._tracked = [];

  // tracks invalid components showing messages. indices correspond to this_tracked.
  // e.g., [true, false, false, false, true]
  this._invalid = [];

  // tracks invalid components hiding messages. indices correspond to this_tracked.
  // e.g., [false, true, false, false, false]
  this._invalidHidden = [];

  // PUBLIC PROPERTIES
  // Whether there is at least one component
  // (tracked by this object) that is invalid and is currently showing messages.
  this.invalidShown = false;
  // Whether there is at least one component that is invalid with deferred messages,
  // i.e., messages that are currently hidden.
  this.invalidHidden = false;
};

/**
 * Sets focus on first invalid component currently showing an error. This method does not set focus
 * on components that are invalid and have deferred messages. For example, when a component is
 * required, deferred validation is run. Any validation error raised is not shown to user right away,
 *  i.e., it is deferred.
 *  <p>
 *  To show hidden messages on all tracked components use showMessages() method. </p>
 *
 * @return {boolean} true if there is at least one invalid component to set focus on; false if
 * unable to locate a component to focus on or there are no invalid components.
 * @export
 * @see #showMessages
 * @memberof oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype.focusOnFirstInvalid = function () {
  var firstInvalid = null;
  var self = this;
  var updateCounter = this._updateCounter;

  // we don't always have a element associated, so this is on the page level context
  var busyContext = Context.getPageContext().getBusyContext();
  var resolveBusyState = busyContext.addBusyState(
    { description: 'Setting Focus to first invalid component.' });

  if (this.invalidShown) {
    firstInvalid = this._getFirstInvalidComponent();
  }

  // always call focus handler on a timer to give time for binding layer to
  // apply changes on the component.
  setTimeout(function () {
    // sometimes when this timer is called, firstInvalid may not have been determined
    // yet. Or the invalid states could have changed in between the timer being set and the
    // callback being called.
    // TODO: talk to Pavitra regarding this logic, it seems unnecessary.
    firstInvalid = (updateCounter === self._updateCounter) ?
                   firstInvalid || self._getFirstInvalidComponent() :
                   self._getFirstInvalidComponent();

    if (firstInvalid) {
      // Get the widget instance for the firstInvalid so we can call protected methods directly.
      firstInvalid('instance').GetFocusElement().focus();
    }

    resolveBusyState();
  }, 1);

  return !!firstInvalid;
};

/**
 * Shows hidden messages on all tracked components by calling showMessages() method on each tracked
 * editable component.
 *
 * @example <caption>Show all hidden messages on tracked components:</caption>
 *  function ViewModel ()
 *  {
 *    self = this;
 *    var tracker = ko.observable();
 *   // ...
 *
 *   showAllMessages : function ()
 *   {
 *      var trackerObj = ko.utils.unwrapObservable(self.tracker);
        return trackerObj.showMessages();
 *    }
 *  }
 *
 * @export
 * @memberof oj.InvalidComponentTracker
 * @instance
 * @see oj.editableValue#showMessages
 */
oj.InvalidComponentTracker.prototype.showMessages = function () {
  var tr;

  if (this.invalidHidden) {
    var len = this._invalidHidden.length;
    for (var index = 0; index < len; index++) {
      if (this._invalidHidden[index]) {
        tr = (this._tracked[index].component).call(tr, 'showMessages');
      }
    }
  }
};

// P R I V A T E    M E T H O D S
/**
 * Gets the first invalid component and returns the component to focus on.
 *
 * @returns the component instance that has focus or null
 * @private
 * @memberof oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype._getFirstInvalidComponent = function () {
  var idx = 0;
  var invalidComponents = [];
  var len = this._invalid.length;

  // locate first invalid component and set focus on it
  // this._invalid is an array of booleans that tracks invalid components showing messages.
  // e.g., [false, true, true, false]. This maps to the this._tracked which holds the
  // components. So the components showing messages is the ones at indices 1 and 2.
  // this._tracked may not be in DOM order if a new tracked component was added not
  // at the end of the DOM order.
  for (idx = 0; idx < len; idx++) {
    var isInvalid = this._invalid[idx];
    if (isInvalid) {
      invalidComponents.push(this._tracked[idx]);
    }
  }

  if (invalidComponents.length === 0) {
    return null;
  }

  // sort the invalidComponents based on dom order
  invalidComponents.sort(function (a, b) {
    var elementA = a.element;
    var elementB = b.element;
    // If elementA precedes elementB in dom order, return -1
    // eslint-disable-next-line no-bitwise
    return (elementA.compareDocumentPosition(elementB) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
  });

  // invalidComponents is sorted now by document order, so return the first one.
  return invalidComponents[0].component;
};

/**
 * Removes the component from its tracked list.
 *
 * @param {Object} component being removed
 * @returns {boolean} if internal state mutated; false otherwise
 * @private
 * @memberof oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype._remove = function (component) {
  var trackedIndex = -1;
  var mutated = false;

  // locate the index in tracked, for the component that was updated
  $.each(this._tracked, function (index, item) {
    if (trackedIndex < 0 && item.component === component) {
      trackedIndex = index;
    }
  });

  if (trackedIndex >= 0) {
    this._tracked.splice(trackedIndex, 1);
    // stop tracking them in the internal arrays
    this._invalid.splice(trackedIndex, 1);
    this._invalidHidden.splice(trackedIndex, 1);
    this._updateInvalidProperties();
    mutated = true;
  }

  return mutated;
};


/**
 * Updates the internal properties to reflect the current validity state of the component, using
 * new messages.
 *
 * @param {Object} component the component that has the new messages
 * @param {Element} element the element that has the new messages (this is the component's element)
 * @param {string} option the option being updated. e.g., messagesShown, messagesHidden, disabled,
 *  readOnly
 * @param {Array.<string>| Array.<oj.Message>} value the value of the option. For example, if option is 'messagesShown'
 *   the value is the Array of the messagesShown, if empty value is [].
 * @returns {boolean} if internal state mutated; false otherwise
 * @private
 * @memberof oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype._update = function (component, element, option, value) {
  var compValid = component.call(component, 'isValid');
  var mutated = true;
  var result;
  var trackedIndex = -1;

  // locate the index in tracked, for the component that was updated.
  $.each(this._tracked, function (index, item) {
    if (trackedIndex < 0 && item.component === component) {
      trackedIndex = index;
    }
  });

  switch (option) {
    case oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN:
    case oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN:

      result = false;
      if (value) {
        // start tracking component if not already doing it.
        if (trackedIndex < 0) {
          trackedIndex = this._tracked.push({ component: component, element: element }) - 1;
          // adds the trackedIndex/result to this._invalid and this._invalidHidden boolean arrays,
          // keeping this._tracked in sync with this._invalid and this._invalidHidden.
          // adds the trackedIndex/result to this._invalid and this._invalidHidden boolean arrays,
          // keeping this._tracked in sync with this._invalid and this._invalidHidden.
          this._initializeInvalidTrackers(trackedIndex, result);
        }

        if (!compValid) {
          if (oj.InvalidComponentTracker._hasInvalidMessages(value)) {
            result = true;
            if (option === oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN) {
              // if component is disabled or readOnly but has messages showing, tracker stops
              // tracking component in its 'invalidShown' list. We do this because if property is
              // bound to a button, and if the only invalid component showing messages is disabled
              // the button would appear disabled visually, confusing the end-user.
              // E.g., disabled component can be initialized with messagesCustom making it invalid and
              // disabled.

              var isDisabled = component.call(component, 'option',
                                              oj.InvalidComponentTracker._OPTION_DISABLED);
              var isReadOnly = component.call(component, 'option',
                                              oj.InvalidComponentTracker._OPTION_READONLY);
              result = !(isDisabled || isReadOnly);
            }
          }
        }

        mutated = this._updateInvalidTracker(option, trackedIndex || 0, result);
        this._updateInvalidProperties();

        // update properties
        if (mutated) {
          // every time messages mutates, we track it.
          if (this._updateCounter === undefined) {
            this._updateCounter = 0;
          }
          this._updateCounter += 1;
        }
      }
      break;

    case oj.InvalidComponentTracker._OPTION_DISABLED:
    case oj.InvalidComponentTracker._OPTION_READONLY:

      // when component goes from enabled to disabled (or to readOnly) tracker updates invalidShown
      // to be false, since the component cannot be showing errors visually. Same goes for
      // invalidHidden.
      //
      // when component goes from disabled (or readOnly) to enabled validations are re-run and
      // component's messagesHidden and messagesShown are updated which result in invalidShown and
      // invalidHidden to be updated. This case is not handled here.

      mutated = false;
      if (value) {
        mutated = this._updateInvalidTracker(oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN,
                trackedIndex || 0, false);
        mutated = this._updateInvalidTracker(oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN,
                trackedIndex || 0, false) || mutated;
        this._updateInvalidProperties();
      }
      break;

    default:
      break;
  }
  return mutated;
};

/**
 * This is called when we are starting to track a component. Before this function is called,
 * we push the component and element into the this._tracked array and then we call this
 * with the trackedIndex
 *
 * @param {number} trackedIndex
 * @param {boolean} result true or false. Since this is initializing the this._invalid and
 * this._invalidHidden arrays, it really only makes sense if it is false but it
 *  isn't enforced.
 * @private
 * @memberof oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype._initializeInvalidTrackers = function (trackedIndex, result) {
  if (this._invalid[trackedIndex] === undefined) {
    this._updateInvalidTracker(
      oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN, trackedIndex, result);
  }
  if (this._invalidHidden[trackedIndex] === undefined) {
    this._updateInvalidTracker(
      oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN, trackedIndex, result);
  }
};

oj.InvalidComponentTracker.prototype._updateInvalidProperties = function () {
  // updates public properties exposed by this object
  this.invalidShown = this._invalid.indexOf(true) >= 0;
  this.invalidHidden = this._invalidHidden.indexOf(true) >= 0;
};

/**
 * If option is "messagesShown", then update this._invalid boolean array,
 * else if option is "messagesHidden", update this._invalidHidden boolean array
 * using the trackedIndex and the value.
 * this._invalid is a boolean array, e.g., [false, false, false, true, false], indicating
 * which components have invalid messages showing.
 * this._invalidHidden is also a boolean array indicating which components have invalid messages
 * hidden. The components are tracked in this._tracked. The indices correspond. For example,
 * the component at this._tracked[3]['component'] is showing invalid messages
 * if this._invalid[3] is true.
 * @private
 * @memberof oj.InvalidComponentTracker
 * @instance
 * @param {string} option "messagesShown" or "messagesHidden".
 * @param {number} trackedIndex the index of the tracked component
 * @param {boolean} value true or false
 * @returns {boolean} whether or not this._invalid or this._invalidHidden was mutated
 */
oj.InvalidComponentTracker.prototype._updateInvalidTracker =
  function (option, trackedIndex, value) {
    var arr;
    var mutated = false;

    if (option === oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN) {
      arr = this._invalid;
    } else if (option === oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN) {
      arr = this._invalidHidden;
    } else {
      arr = [];
    }

    // updates or pushes the value into the appropriate array
    if (trackedIndex >= 0 && arr[trackedIndex] !== undefined) {
      // mark component as invalid or invalidHidden to match the trackedIndex; update only if value
      // changes
      mutated = arr[trackedIndex] !== value;
      if (mutated) {
        arr[trackedIndex] = value;
      }
    } else {
      // new
      arr.push(value);
      mutated = true;
    }

    return mutated;
  };

/**
 * helper to determine if we have invalid messages among the list of messages that are currently
 * showing i.e., that are showing.
 *
 * @param {!Array.<oj.Message>} messages list of all messages associated with component
 * @returns {boolean}
 * @private
 * @memberof oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker._hasInvalidMessages = function (messages) {
  return !Message.isValid(messages);
};



/* global ko:false */
/* jslint browser: true, devel: true*/

// private to prevent creating a JSDoc page for this class.  The only thing we wish
// to JSDoc is the invalidComponentTracker, which we're putting in EditableValue's output.
/**
 * An extension to oj.ComponentBinding, properties exposed on this binding are available
 * to jet components that extend from oj.editableValue.
 *
 * @private
 * @constructor oj.ValueBinding
 * @see oj.ComponentBinding
 * @see oj.editableValue
 * @since 0.6.0
 */
oj.ValueBinding = function () {};


/**
 * <p>When this attribute is bound to an observable, the framework pushes
 * an object of type {@link oj.InvalidComponentTracker} onto the observable.
 * The object itself tracks the validity of a group of editable components.
 *
 * <p>When this attribute is present, the binding registers a listener
 * for the <a href="#optionChange">optionChange</a>
 * event. This event is fired by JET editable components whenever its validity changes (i.e. when
 * <a href="#messagesShown">messagesShown</a> or <a href="#messagesHidden">messagesHidden</a>
 * options change). When the event is fired, the listener determines the current validity of the
 * component and updates the tracker.
 *
 * <p>
 * The observable bound to this attribute is often used with multiple component binding declarations
 * as shown in the example below.
 * </p>
 *
 * <p>
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and
 * is not a component option.
 * </p>
 *
 * @example <caption>Track validity of multiple components using a single observable
 * bound to the <code class="prettyprint">invalidComponentTracker</code> attribute:</caption>
 * &lt;input id="username" type="text" name="username" required
 *   data-bind="ojComponent: {component: 'ojInputText', value: userName,
 *                            invalidComponentTracker: tracker}">
 *
 * &lt;input id="password" type="password" name="password" required
 *   data-bind="ojComponent: {component: 'ojInputPassword', value: password,
 *                            invalidComponentTracker: tracker}"/>
 *
 * // ViewModel that defines the tracker observable
 * &lt;script>
 * function MemberViewModel()
 * {
 *   var self = this;
 *
 *   self.tracker = ko.observable();
 *
 *   self.userName = ko.observable();
 *   self.password = ko.observable();
 *
 *   self.focusOnFirstInvalid = function()
 *   {
 *      var trackerObj = ko.utils.unwrapObservable(self.tracker);
 *      if (trackerObj !== undefined)
 *      {
 *        // make sure the trackerObj is an oj.InvalidComponentTracker
 *        // before calling methods on it.
 *        if (trackerObj instanceof oj.InvalidComponentTracker)
 *        {
*           // showMessages first
*           // (this will show any hidden messages, if any)
*           trackerObj.showMessages();
*           // focusOnFirstInvalid will focus on the first component
*           // that is invalid, if any.
*           trackerObj.focusOnFirstInvalid();
*         }
*       }
*     }
 * }
 * &lt;/script>
 *
 * @example <caption>Use tracker property <code class="prettyprint">invalid</code> to disable button:</caption>
 * // button is disabled if there are components currently showing errors
 * &lt;button type="button" data-bind="ojComponent: {component: 'ojButton', label: 'Submit',
 *                                                disabled: tracker()['invalidShown']}"></button>
 *
 * @ojbindingonly
 * @member
 * @name invalidComponentTracker
 * @memberof oj.editableValue
 * @instance
 * @type {oj.InvalidComponentTracker}
 * @default <code class="prettyprint">null</code>
 * @since 0.7.0
 * @ignore
 */
/** prevent preceding jsdoc from applying to following line of code */

oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER = 'invalidComponentTracker';

// A listener is added for this event to listen to changes to the 'messagesHidden' or
// 'messagesShown' options. The listener updates the InvalidComponentTracker.
oj.ValueBinding._EVENT_OPTIONCHANGE = 'ojoptionchange';

// Options we are interested in listening to changes for.
oj.ValueBinding._OPTION_MESSAGES_SHOWN = 'messagesShown';
oj.ValueBinding._OPTION_MESSAGES_HIDDEN = 'messagesHidden';

// options that are managed primarily to detect changes for tracker to be notified.
oj.ValueBinding._OPTION_DISABLED = 'disabled';
oj.ValueBinding._OPTION_READONLY = 'readOnly';


// callback called when managed attribute is being updated
oj.ValueBinding._update = function (name, value, element, component, valueAccessor) {
  var options = valueAccessor.call();
  var updateProps = {};
  var ictObs = options[oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER];

  if (name === oj.ValueBinding._OPTION_DISABLED || name === oj.ValueBinding._OPTION_READONLY) {
    var icTracker = (ictObs && ictObs.peek()) || null; // don't add extra subscriptions
    // when either of these options are updated
    if (icTracker !== null && ko.isWriteableObservable(ictObs)) {
      if (icTracker._update.call(icTracker, component, element, name, value)) {
        // if _update mutates state
        ictObs.valueHasMutated();
      }
    }
    updateProps[name] = value;
    return updateProps;
  }

  return undefined;
};

// init callback for managed attributes. When managing options like disabled, readOnly
// this method is required to return values.
oj.ValueBinding._init = function (name, value) {
  var initProps = {};

  initProps[name] = value;
  return initProps;
};

/**
 * Called after component binding creates the component.
 * @param {string} property
 * @param {Element} element the element to which binding applied the componnet
 * @param {Function=} component the widget bridge
 * @param {Object=} valueAccessor
 * @private
 */
oj.ValueBinding._afterCreate = function (property, element, component, valueAccessor) {
  var initProps = {};
  var optionsSet = valueAccessor.call();
  var isICTOptionSet;

  if (property === oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER) {
    isICTOptionSet = !!optionsSet[property];

    if (isICTOptionSet) {
      // register a writeback for invalidComponentTracker property by registering an event listener
      //  for the optionChange event.
      oj.ValueBinding._registerInvalidComponentTrackerWriteback(property,
                                                                optionsSet,
                                                                element,
                                                                component);
    }
  }

  return initProps;
};

/**
 * Called right before component is destroyed.
 *
 * @param {Element} element
 * @private
 */
oj.ValueBinding._beforeDestroy = function (property, element, component, valueAccessor) {
  var jelem = $(element);
  var options = valueAccessor.call();
  var icTracker;
  var ictObs = options[property];

  if (property === oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER) {
    jelem.off(oj.ValueBinding._EVENT_OPTIONCHANGE,
              oj.ValueBinding._updateInvalidComponentTracker);
    if (ictObs && ko.isWriteableObservable(ictObs)) {
      icTracker = ictObs.peek();
      // remove component from tracker
      if (icTracker._remove.call(icTracker, component)) {
        // if _remove mutates state, then components need to react to it.
        // example a button that binds to properties on invalidComponentTracker.
        ictObs.valueHasMutated();
      }
    }
  }
};

/**
 * Listener for the optionChange event, it updates the invalidComponentTracker associated to the
 * component that triggered the event.
 *
 * @param {jQuery.event=} event
 * @private
 */
oj.ValueBinding._updateInvalidComponentTracker = function (event) {
  var ictObs = event.data.tracker;
  var icTracker;
  var component = event.data.component;
  var element = event.data.element;
  var payload = arguments[1];
  var option = payload.option;
  var msgs = payload.value;

  if (option === oj.ValueBinding._OPTION_MESSAGES_SHOWN ||
      option === oj.ValueBinding._OPTION_MESSAGES_HIDDEN) {
    if (ictObs && ko.isWriteableObservable(ictObs)) {
      icTracker = ictObs.peek();
      if (icTracker && icTracker._update.call(icTracker, component, element, option, msgs)) {
        // if _update mutates state
        ictObs.valueHasMutated();
      }
    }
  }
};


/**
 * Register a default callback for the 'optionChange' event. The callback writes the component and
 * its validity to the invalidComponentTracker observable.
 * @param {string} property
 * @param {Object} options original options set on element
 * @param {Element} element
 * @param {Function=} component
 * @private
 */
oj.ValueBinding._registerInvalidComponentTrackerWriteback =
  function (property, options, element, component) {
    var ictObs = options[property];
    var icTracker;
    var jElem = $(element);

    // Create new intsance of InvalidComponentTracker if the observable is not set.
    if (ko.isObservable(ictObs)) {
      icTracker = ictObs.peek();
      // push new instance of oj.InvalidComponentTracker onto observable if none present.
      if (icTracker == null) { // null or undefined
        icTracker = new oj.InvalidComponentTracker();
        ictObs(icTracker);
      }
    } else {
      // tracker object is not an observable.
      throw new Error('Binding attribute ' + oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER +
                      ' should be bound to a ko observable.');
    }

    // update icTracker initial state using component's latest option values
    if (ko.isWriteableObservable(ictObs)) {
      // EditableValue's messagesShown option is an Array of messages currently shown on component.
      var messagesShown = component.call(component, 'option',
                                          oj.ValueBinding._OPTION_MESSAGES_SHOWN);
      // EditableValue's messagesHidden option is an Array of messages currently hidden on component
      var messagesHidden = component.call(component, 'option',
                                          oj.ValueBinding._OPTION_MESSAGES_HIDDEN);

      icTracker._update.call(icTracker, component, element,
                              oj.ValueBinding._OPTION_MESSAGES_SHOWN, messagesShown);
      icTracker._update.call(icTracker, component, element,
                              oj.ValueBinding._OPTION_MESSAGES_HIDDEN, messagesHidden);
      ictObs.valueHasMutated();
    }

    // register listener for optionChange event for future changes to messages* options
    var eventData = { tracker: ictObs, component: component, element: element };
    jElem.on(oj.ValueBinding._EVENT_OPTIONCHANGE, eventData,
              oj.ValueBinding._updateInvalidComponentTracker);
  };

/**
 * editableValue Behavior Definition and Injection
 */
oj.ComponentBinding.getDefaultInstance().setupManagedAttributes(
  {
    for: 'editableValue',
    attributes: [oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER,
      oj.ValueBinding._OPTION_DISABLED,
      oj.ValueBinding._OPTION_READONLY],
    init: oj.ValueBinding._init,
    update: oj.ValueBinding._update,
    afterCreate: oj.ValueBinding._afterCreate,
    beforeDestroy: oj.ValueBinding._beforeDestroy
  });

});