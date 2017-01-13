/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojknockout', 'ojs/ojmessaging'], function(oj, $, ko)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true, devel: true*/

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
 * @since 0.6
 */
oj.ValueBinding = function(){};


/** 
 * <p>When this attribute is bound to an observable, the framework pushes an object of type {@link oj.InvalidComponentTracker}
 * onto the observable. The object itself tracks the validity of a group of editable components.
 * 
 * <p>When this attribute is present, the binding registers a listener for the <a href="#optionChange">optionChange</a>
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
 * @example <caption>Track validity of multiple components using a single observable bound to the <code class="prettyprint">invalidComponentTracker</code> attribute:</caption>
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
 * @since 0.7
 */
/** prevent preceding jsdoc from applying to following line of code */

oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER = 'invalidComponentTracker';

// An listener is added for this event to listen to changes to the 'messagesHidden' or 
// 'messagesShown' options. The listener updates the InvalidComponentTracker.
oj.ValueBinding._EVENT_OPTIONCHANGE = "ojoptionchange";

// Options we are interested in listening to changes for.
oj.ValueBinding._OPTION_MESSAGES_SHOWN = 'messagesShown';
oj.ValueBinding._OPTION_MESSAGES_HIDDEN = 'messagesHidden';

// options that are managed primarily to detect changes for tracker to be notified.
oj.ValueBinding._OPTION_DISABLED = 'disabled';
oj.ValueBinding._OPTION_READONLY = 'readOnly';


// callback called when managed attribute is being updated
oj.ValueBinding._update = function(name, value, element, component, valueAccessor)
{
  var options = valueAccessor.call(), updateProps = {},
      ictObs = options[oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER], 
      icTracker;
      
  if (name === oj.ValueBinding._OPTION_DISABLED || name === oj.ValueBinding._OPTION_READONLY)
  {
    icTracker = ictObs && ictObs.peek() || null; // don't add extra subscriptions
    // when either of these options are updated
    if (icTracker !== null && ko.isWriteableObservable(ictObs))
    {
      if (icTracker._update.call(icTracker, component, name, value))
      {
        // if _update mutates state
        ictObs.valueHasMutated();
      }
    }
    updateProps[name] = value;
    return updateProps;
  }
};

// init callback for managed attributes. When managing options like disabled, readOnly
// this method is required to return values.
oj.ValueBinding._init = function(name, value)
{
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
oj.ValueBinding._afterCreate = function(property, element, component, valueAccessor)
{
  var initProps = {}, optionsSet = valueAccessor.call(), isICTOptionSet;

  if (property ===  oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER)
  {
    isICTOptionSet = optionsSet[property] ? true : false;

    if (isICTOptionSet)
    {
      // register a writeback for invalidComponentTracker property by registering an event listener
      //  for the optionChange event.
      oj.ValueBinding._registerInvalidComponentTrackerWriteback(property, optionsSet, element, component);
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
oj.ValueBinding._beforeDestroy = function(property, element, component, valueAccessor)
{
  var jelem = $(element), options = valueAccessor.call(), icTracker,
      ictObs = options[property];

  if (property ===  oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER)
  {
    if (jelem)
    {
      jelem.off(oj.ValueBinding._EVENT_OPTIONCHANGE, oj.ValueBinding._updateInvalidComponentTracker);
      if (ictObs && ko.isWriteableObservable(ictObs))
      {
        icTracker = ictObs.peek(); 
        // remove component from tracker
        if (icTracker._remove.call(icTracker, component))
        {
          // if _remove mutates state, then components need to react to it.
          // example a button that binds to properties on invalidComponentTracker.
          ictObs.valueHasMutated();
        }
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
oj.ValueBinding._updateInvalidComponentTracker = function(event)
{
  var ictObs = event.data.tracker, icTracker,
      component = event.data.component, payload = arguments[1], option = payload['option'], 
      msgs = payload['value'];
  
  if (option === oj.ValueBinding._OPTION_MESSAGES_SHOWN || 
      option === oj.ValueBinding._OPTION_MESSAGES_HIDDEN)
  {
    if (ictObs && ko.isWriteableObservable(ictObs))
    {
      icTracker = ictObs.peek();
      if (icTracker && icTracker._update.call(icTracker, component, option, msgs))
      {
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
oj.ValueBinding._registerInvalidComponentTrackerWriteback = function(property, options, element, component)
{
  var ictObs = options[property], messagesShown, messagesHidden, eventData,
      icTracker, jElem = $(element);

  // Create new intsance of InvalidComponentTracker if the observable is not set.
  if (ko.isObservable(ictObs))
  {
    icTracker = ictObs.peek();
    // push new instance of oj.InvalidComponentTracker onto observable if none present.
    if (icTracker == null) // null or undefined
    {
      icTracker = new oj.InvalidComponentTracker();
      ictObs(icTracker);
    }
  }
  else
  {
    // tracker object is not an observable. 
    throw new Error('Binding attribute ' + oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER +
            ' should be bound to a ko observable.');
  }

  if (icTracker !== null)
  {
    // update icTracker inital state using component's latest option values
    if (ko.isWriteableObservable(ictObs))
    {
      messagesShown = component.call(component, "option", oj.ValueBinding._OPTION_MESSAGES_SHOWN);
      messagesHidden = component.call(component, "option", oj.ValueBinding._OPTION_MESSAGES_HIDDEN);

      icTracker._update.call(icTracker, component,
              oj.ValueBinding._OPTION_MESSAGES_SHOWN, messagesShown);
      icTracker._update.call(icTracker, component,
              oj.ValueBinding._OPTION_MESSAGES_HIDDEN, messagesHidden);
      ictObs.valueHasMutated();
    }

    // register listener for optionChange event for future changes to messages* options
    eventData = {tracker: ictObs, component: component};
    jElem.on(oj.ValueBinding._EVENT_OPTIONCHANGE, eventData,
            oj.ValueBinding._updateInvalidComponentTracker);
  }
};

/**
 * editableValue Behavior Definition and Injection
 */
oj.ComponentBinding.getDefaultInstance().setupManagedAttributes(
{
  'for': 'editableValue',
  'attributes': [oj.ValueBinding._ATTRIBUTE_INVALID_COMPONENT_TRACKER, 
                 oj.ValueBinding._OPTION_DISABLED,
                  oj.ValueBinding._OPTION_READONLY],
  'init': oj.ValueBinding._init,
  'update': oj.ValueBinding._update,
  'afterCreate': oj.ValueBinding._afterCreate,
  'beforeDestroy': oj.ValueBinding._beforeDestroy
});

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true, devel: true*/

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
 *   var tracker = ko.observable();
 *   
 *   log = function ()
 *   {
 *     var trackerObj = ko.utils.unwrapObservable(self.tracker);
 *     console.log(trackerObj instanceof oj.InvalidComponentTracker); // true 
 *   }
 * }
 * &lt;/script>
 * Note: Make sure you have included the 'ojs/ojknockout-validation' dependency in your require list,
 * otherwise you will see an error about InvalidComponentTracker being undefined.
 * 
 * @class oj.InvalidComponentTracker 
 * @constructor
 * @class
 * @export
 * @since 0.7
 */
oj.InvalidComponentTracker = function()
{
  this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.InvalidComponentTracker, oj.Object, "oj.InvalidComponentTracker");

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
 * @memberof! oj.InvalidComponentTracker
 */


/** 
 * prevent preceding jsdoc from applying to following line of code 
 * @ignore
 */
//Options we are interested in listening to changes for.
oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN = 'messagesShown';
oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN = 'messagesHidden';
oj.InvalidComponentTracker._OPTION_DISABLED = 'disabled';
oj.InvalidComponentTracker._OPTION_READONLY = 'readOnly';

/**
 * Whether there is at least one component that is invalid with deferred messages, i.e., messages 
 * that are currently hidden.
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
 * @memberof! oj.InvalidComponentTracker
 */
/**
 * Initializer
 * @protected
 * @memberof! oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype.Init = function()
{
  var self = this;
  oj.InvalidComponentTracker.superclass.Init.call(this);

  // INTERNAL PROPERTIES
  // all tracked components
  this._tracked = [];

  // tracks invalid components showing messages. indices correspond to this_tracked.
  this._invalid = [];

  // tracks invalid components hiding messages. Contains indices from tracked.
  this._invalidHidden = [];

  // PUBLIC PROPERTIES
  this['invalidShown'] = false;
  this['invalidHidden'] = false;
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
 * @memberof! oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype.focusOnFirstInvalid = function()
{
  var firstInvalid = null, self = this, updateCounter = this._updateCounter;
  if (this['invalidShown'])
  {
    firstInvalid = this._getFirstInvalidComponent();
  }

  // always call focus handler on a timer; to give time for updates to be applied on component. 
  // oj.ComponentBinding.applyUpdates, happens on a timer.
  setTimeout(function () {
      // sometimes when this timer is called, firstInvalid may not have been determined 
      // yet. Or the invalid states could have changed in between the timer being set and the 
      // callback being called.
      firstInvalid = (updateCounter === self._updateCounter) ? 
                        firstInvalid || self._getFirstInvalidComponent() : self._getFirstInvalidComponent(); 
      if (firstInvalid)
      {
        // Call a protected method Focus() exposed on editable components for now.
        firstInvalid.call(firstInvalid, "Focus");
      }
    }, 1);
  
  return firstInvalid ? true : false;
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
 * @memberof! oj.InvalidComponentTracker
 * @instance
 * @see oj.editableValue#showMessages
 */
oj.InvalidComponentTracker.prototype.showMessages = function()
{
  var tr, len, index;

  if (this['invalidHidden'])
  {
    len = this._invalidHidden.length;
    for (index = 0; index < len; index++)
    {
      if (this._invalidHidden[index])
      {
        tr = this._tracked[index].call(tr, "showMessages");
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
 */
oj.InvalidComponentTracker.prototype._getFirstInvalidComponent = function()
{
  var firstInvalid, focusable = null, idx = 0, len = this._invalid.length;

  // locate first invalid component and set focus on it
  for (idx = 0; idx < len; idx++)
  {
    firstInvalid = this._invalid[idx];
    if (firstInvalid)
    {
      return this._tracked[idx];
    }
  };

  return focusable;
};

/**
 * Removes the component from its tracked list. 
 * 
 * @param {Object} component being removed
 * @returns {boolean} if internal state mutated; false otherwise
 * @private
 * @memberof! oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype._remove = function(component)
{
  var trackedIndex = -1, mutated = false;

  // locate the index in tracked, for the component that was updated 
  $.each(this._tracked, function(index, item)
  {
    if (trackedIndex < 0 && item === component)
    {
      trackedIndex = index;
      return;
    }
  });

  if (trackedIndex >= 0)
  {
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
 * @param {string} option 
 * @param {Array} value 
 * @returns {boolean} if internal state mutated; false otherwise
 * @private
 * @memberof! oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker.prototype._update = function(component, option, value)
{
  var compValid = component.call(component, "isValid"), 
      trackedIndex = -1, item, mutated = true, result, isDisabled, isReadOnly;
  
  // locate the index in tracked, for the component that was updated 
  $.each(this._tracked, function(index, item)
  {
    if (trackedIndex < 0 && item === component)
    {
      trackedIndex = index;
      return;
    }
  });

  switch (option)
  {
    case oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN:
    case oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN:

      result = false;
      if (value)
      {
        // start tracking component if not already doing it.
        if (trackedIndex < 0)
        {
          trackedIndex = this._tracked.push(component) - 1;
          this._initializeInvalidTrackers(trackedIndex, result);
        }

        if (!compValid)
        {
          if (oj.InvalidComponentTracker._hasInvalidMessages(value))
          {
            result = true;
            if (option === oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN)
            {
              // if component is disabled or readOnly but has messages showing, tracker stops 
              // tracking component in its 'invalidShown' list. We do this because if property is 
              // bound to a button, and if the only invalid component showing messages is disabled 
              // the button would appear disabled visually, confusing the end-user. 
              // E.g., disabled component can be initialized with messagesCustom making it invalid and 
              // disabled.

              isDisabled = component.call(component, "option", oj.InvalidComponentTracker._OPTION_DISABLED),
              isReadOnly = component.call(component, "option", oj.InvalidComponentTracker._OPTION_READONLY);
              result = isDisabled || isReadOnly ? false : true;
            }
          }
        }

        mutated = this._updateInvalidTracker(option, trackedIndex || 0, result);
        this._updateInvalidProperties();

        // update properties
        if (mutated)
        {
          // every time messages mutates, we track it. 
          if (this._updateCounter === undefined)
          {
            this._updateCounter = 0;
          }
          this._updateCounter++;
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
      if (value)
      {
        mutated = this._updateInvalidTracker(oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN,
                trackedIndex || 0, false);
        mutated = this._updateInvalidTracker(oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN,
                trackedIndex || 0, false) || mutated;
        this._updateInvalidProperties();
      }
      break;
  }
  return mutated;
};

oj.InvalidComponentTracker.prototype._initializeInvalidTrackers = function(trackedIndex, result)
{
  if (this._invalid[trackedIndex] === undefined)
    this._updateInvalidTracker(oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN, trackedIndex, result);
  if (this._invalidHidden[trackedIndex] === undefined)
    this._updateInvalidTracker(oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN, trackedIndex, result);
};

oj.InvalidComponentTracker.prototype._updateInvalidProperties = function()
{
  // updates public properties exposed by this object
  this['invalidShown'] = this._invalid.indexOf(true) >= 0;
  this['invalidHidden'] = this._invalidHidden.indexOf(true) >= 0;
};

oj.InvalidComponentTracker.prototype._updateInvalidTracker = function(option, trackedIndex, value)
{
  var mutated = false, 
      arr = (option === oj.InvalidComponentTracker._OPTION_MESSAGES_SHOWN) ? 
        this._invalid : (option === oj.InvalidComponentTracker._OPTION_MESSAGES_HIDDEN) ? 
          this._invalidHidden : [];

  // adds or updates the appropriate array
  if (trackedIndex >= 0 && arr[trackedIndex] !== undefined)
  {
    // mark component as invalid or invalidHidden to match the trackedIndex; update only if value 
    // changes
    mutated = arr[trackedIndex] !== value ? true : false;
    if (mutated)
    {
      arr.splice(trackedIndex, 1, value);
    }
  }
  else
  {
    arr.push(value);
    mutated = true;
  }

  return mutated;
};

/**
 * helper to determine if we have invalid messages among the list of messages that are currently 
 * showing i.e., that are showing.
 * 
 * @param {!Array} messages list of all messages associated with component
 * @returns {boolean}
 * @private
 * @memberof! oj.InvalidComponentTracker
 * @instance
 */
oj.InvalidComponentTracker._hasInvalidMessages = function(messages)
{
  return !oj.Message.isValid(messages);
};

});
