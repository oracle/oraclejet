/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'promise', 'ojs/ojcomponentcore'], function(oj, $)
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */


/**
 * Utility methods for animating elements.
 *
 * <h3 id="custom-animation-section">
 *   Customizing and Disabling Animation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#custom-animation-section"></a>
 * </h3>
 * 
 * Default animations can be customized or disabled at several levels with varying degrees of control:
 * <ol>
 *   <li>For all JET components.</li>
 *   <li>For all instances of a JET component.</li>
 *   <li>For one instance of a JET component.</li>
 * </ol>
 * 
 * <h4>1. For all JET components</h4>
 * 
 * <p>There are several theme variables that control the speed of animations in JET.  Applications can change their values 
 * to speed up or slow down animations for all components, or to disable animations altogether by setting them to 0:</p>
 * <pre class="prettyprint"><code>$animationDurationShort: .25s !default;
 * $animationDurationMedium: .4s !default;
 * $animationDurationLong: .5s !default;
 * </code></pre>
 * <p>Note that setting them to 0 does not make the actions that invoke animations synchronous.  For example, opening a dialog is an asynchronous
 * action.  By setting the animation duration to 0 simply makes the dialog appear to open immediately.  Events related to the dialog opening
 * are still fired asynchronously, though with a much shorter delay.</p>
 * 
 * <h4>2. For All Instances of a JET Component.</h4>
 * 
 * <p>Default animations for JET components are defined by component-specific theme variables.  Changing the values of the theme variables for a particular component
 * will affect the default animations for all instances of that component.  These theme variables are listed in the API documentation
 * for the <code class="prettyprint">ojAnimateStart</code> event of each component.</p>
 * 
 * <h4>3. For One Instance of a JET Component</h4> 
 *
 * <p>Applications can customize animations triggered by actions in some components by listening for <code class="prettyprint">ojAnimateStart/ojAnimateEnd</code>
 *    events and override action specific animations.  See the documentation of individual components for support details of <code
 *    class="prettyprint">ojAnimateStart/ojAnimateEnd</code> events and the associated actions.</p>
 * <p>To customize an animation, applications first listen to <code class="prettyprint">ojAnimateStart</code> event and cancel the default animation.  Then
 *    specify the new animation in one of several ways:</p>
 * <ul>
 *   <li>Call one of the animation effect methods in oj.AnimationUtils.</li>
 *   <li>Call a 3rd-party animation function with a Javascript API, such as jQuery, GreenSock, Velocity.js, etc.</li>
 *   <li>Define action-specific CSS style classes on the animated item.  When an action triggers animation, a marker class of the form "oj-animate-&lt;action&gt;" 
 *       (e.g. "oj-animate-open") is added to the animated element.  After a slight delay, a second marker class of the form "oj-animate-&lt;action&gt;-active"
 *       (e.g. "oj-animate-open-active") is added.  This allows application to define CSS transition on the element.</li>
 * </ul>
 *
 * <h4>Examples</h4>
 * <br>
 * <i>Disable a default "open" animation:</i>
 * <pre class="prettyprint"><code>
 * myComponent.addEventListener( "ojAnimateStart", function( event ) {
 *   if (event.detail.action == "open") {
 *     event.preventDefault();
 *     event.detail.endCallback();
 *   }
 * });
 * </code></pre>
 * <br>
 * <i>Customize a default "open" animation with oj.AnimationUtils method:</i>
 * <pre class="prettyprint"><code>
 * myComponent.addEventListener( "ojAnimateStart", function( event ) {
 *   if (event.detail.action == "open") {
 *     event.preventDefault();
 *     oj.AnimationUtils.slideIn(event.detail.element).then(event.detail.endCallback);
 *   }
 * });
 * </code></pre>
 * <br>
 * <i>Customize a default "close" animation with jQuery method:</i>
 * <pre class="prettyprint"><code>
 * myComponent.addEventListener( "ojAnimateStart", function( event ) {
 *   if (event.detail.action == "close") {
 *     event.preventDefault();
 *     $(event.detail.element).fadeOut(event.detail.endCallback);
 *   }
 * });
 * </code></pre>
 * <br>
 * <i>Customize a default "update" animation with CSS style classes:</i>
 * <pre class="prettyprint"><code>
 * // Cancel the default animation in the event listener
 * myComponent.addEventListener( "ojAnimateStart", function( event ) {
 *   if (event.detail.action == "update") {
 *     event.preventDefault();
 *     event.detail.endCallback();
 *   }
 * });
 *
 * </code></pre>
 *
 * <pre class="prettyprint"><code>
 * /* Define new animation in CSS
 *    Different selectors may be needed to target the CSS correctly *&#47;
 *
 * /* State to animate from is marked by oj-animate-&lt;action&gt; class *&#47; 
 * .selector .oj-animate-update {
 *   color: red;
 * }
 *
 * /* State to animate to is marked by oj-animate-&lt;action&gt; and oj-animate-&lt;action&gt;-active classes *&#47; 
 * .selector .oj-animate-update.oj-animate-update-active {
 *   transition: color 1s;
 *   color: black;
 * }
 * </code></pre>
 *
 * <h3 id="busy-state-section">
 *   Adding Busy State
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#busy-state-section"></a>
 * </h3>
 *
 * <p>Animations are asynchronous by nature.  Sometimes applications may need to wait for an animation to end before
 *    proceeding with other operations.  All the effect methods in oj.AnimationUtils return promises that are
 *    resolved when the animations end.</p>
 * <p>In cases where applications use the {@link oj.BusyContext} class to track the busy state of components or pages, it is
 *    up to the callers of the effect methods to add busy state to the appropriate context, which may or may not
 *    be the context that contains the element being animated.</p>
 *
 * <h4>Examples</h4>
 * <br>
 * <i>Add a busy state while an animation is in progress:</i>
 * <pre class="prettyprint"><code>
 * // Context node is usually the animated element but can also be a node for any
 * // context that wants to wait for the animation to end.
 * var contextNode = element;
 * var busyContext = oj.Context.getContext(contextNode).getBusyContext();
 * var resolveFunc = busyContext.addBusyState({"description": "Animation in progress"});
 * oj.AnimationUtils.slideOut(element).then(resolveFunc);
 * </code></pre>
 *
 * @namespace
 * @since 2.1
 * @export
 */
oj.AnimationUtils = {};

// Return a platform-dependent property or event name from a base name
oj.AnimationUtils._getName = function(element, baseName)
{
  if (!oj.AnimationUtils._nameMap)
  {
    oj.AnimationUtils._nameMap = {};
    var nameMap = oj.AnimationUtils._nameMap;
    var style = element.style;
    
    // Property names
    nameMap['backfaceVisibility'] = (style['webkitBackfaceVisibility'] !== undefined) ? 'webkitBackfaceVisibility' : 'backfaceVisibility';
    nameMap['transform'] = (style['webkitTransform'] !== undefined) ? 'webkitTransform' : 'transform';
    nameMap['transformOrigin'] = (style['webkitTransformOrigin'] !== undefined) ? 'webkitTransformOrigin' : 'transformOrigin';
    nameMap['transition'] = (style['webkitTransition'] !== undefined) ? 'webkitTransition' : 'transition';
    
    // Event names
    nameMap['transitionend'] = (style['webkitTransition'] !== undefined) ? 'webkitTransitionEnd' : 'transitionend';
  }
  
  var mappedName = oj.AnimationUtils._nameMap[baseName];
  
  return mappedName ? mappedName : baseName;
};

oj.AnimationUtils._getElementStyle = function(element, baseName)
{
  return element.style[oj.AnimationUtils._getName(element, baseName)];
};

oj.AnimationUtils._setElementStyle = function(element, baseName, value)
{
  element.style[oj.AnimationUtils._getName(element, baseName)] = value;
};

/**
 * Main utility function for starting a css transition on an element.<br>
 * Currently this function assumes the following:<br>
 * 1. If multiple properties are animated, they all use the same delay and duration.<br>
 * All css property names should be specified in camel case.
 * @param {Element} element  the HTML element to animate
 * @param {Object} fromState  the css class and properties for setting up the starting state
 * @param {Object} toState  the css class and properties for setting up the ending state
 * @param {Object} options  the common options for the css transition or animation.  This
 *                          include 'delay', 'duration', 'timingFunction', and 'persist'.
 * @param {Array} transProps  an array of css properties being transitioned.
 * @param {Array=} persistProps  an array of css properties to persist if the persist option is set.
 *                               If this is omitted, it will be set to transProps.
 * @return {Promise|IThenable} a promise that will be resolved when the animation ends
 * @private
 */
oj.AnimationUtils._animate = function(element, fromState, toState, options, transProps, persistProps)
{
  var propArray = [].concat(transProps);

  var doAnimate = function(resolve, reject)
  {
    var endListener = function(event) {
      // event.propertyName is the hyphenated name.  Entries in propArray is the 
      // camel-case name without prefix.  So we drop any prefix and convert 
      // event.propertyName to camel-case before finding it in propArray. 
      var basePropName = event.propertyName.indexOf('-webkit-') == 0 ? event.propertyName.substr(8) : event.propertyName;
      basePropName = oj.AnimationUtils._getCamelCasePropName(basePropName);
      var idx = propArray.indexOf(basePropName);
      if (idx > -1)
      {
        if (propArray.length > 1)
        {
          propArray.splice(idx, 1);
        }
        else
        {
          resolvePromise();
        }
      }
    };
    var requestId = 0;
    var promiseResolved = false;
    var resolvePromise = function() {
      if (!promiseResolved)
      {
        if (requestId)
        {
          window.cancelAnimationFrame(requestId);
          requestId = 0;
        }
        
        element.removeEventListener(oj.AnimationUtils._getName(element, 'transitionend'), endListener);

        if (resolve)
        {
          resolve(true);
        }
        promiseResolved = true;          
      }
    };

    // For css transition, specify the transition value when applying the toState
    // since we don't want to trigger the transition prematurely.
    if (toState == null)
    {
      toState = {};
    }
    if (toState['css'] == null)
    {
      toState['css'] = {};
    }
    toState['css']['transition'] = oj.AnimationUtils._createTransitionValue(element, transProps, options);

    // Save the orignal style so that we can restore it later if needed
    var effectCount = oj.AnimationUtils._saveStyle(element, fromState, toState, options, persistProps || transProps);

    oj.AnimationUtils._applyState(element, fromState, effectCount > 1);

    element.addEventListener(oj.AnimationUtils._getName(element, 'transitionend'), endListener);

    var duration = options['duration'];
    var delay = options['delay'];
    var skipPromise = options['_skipPromise'];

    function transitionFunc() {
      requestId = 0;
      oj.AnimationUtils._applyState(element, toState, effectCount > 1);
    }

    if (fromState == null)
    {
      // If there is no fromState, assume that we are transitioning from the
      // current state to a new state, so just apply toState immediately.
      transitionFunc();
    }
    else
    {
      if (!options['_noReflow'])
      {
        // If the final state is the same as current state,
        // requestAnimationFrame may not trigger a transition.  Need to force
        // a reflow after applying the initial state by getting one of several 
        // properties that cause reflow.
        //
        // Assign it to an export object so that Closure compiler will not remove
        // this as dead code
        oj.AnimationUtils._x = element.offsetWidth;
      }

      // Add the toState after a delay.  This is necessary to trigger css 
      // transition.
      requestId = window.requestAnimationFrame(transitionFunc);
    }
    
    var totalMs = oj.AnimationUtils._getTotalTiming(duration, delay);
    if (!skipPromise)
    {
      // There are situations in which the transitionend event is never
      // fired (e.g. removing the transiton property or setting the display
      // property to none.)
      // Add a timeout to avoid having unresolved promise.
      setTimeout(resolvePromise, totalMs + 100);
    }
  };

  // Special option to skip promise to reduce overhead.  A side effect is that
  // no clean up will be done on the element, which is fine if the element is
  // temporary
  if (options['_skipPromise'])
  {
    doAnimate(null, null);
    return null;
  }
  else
  {
    var promise = new Promise(doAnimate);
    return promise.then(function() {
      // Remove any temporary effect class when the promise is fulfilled.
      // Do not remove them in the endListener, since the promise fulfillment
      // callback is not in the same animation frame and occurs later than
      // the endListener.  Because any caller cleanup is done on promise
      // fulfillment, the element may flash if we remove the class too early.

      if (fromState && fromState['addClass'])
      {
        $(element).removeClass(fromState['addClass']);
      }
      
      if (toState && toState['addClass'])
      {
        $(element).removeClass(toState['addClass']);
      }

      oj.AnimationUtils._restoreStyle(element);
    });
  }
};

// Save the element style from a property set
oj.AnimationUtils._saveCssValues = function(element, css, savedStyle, persistProps)
{
  for (var cssProp in css)
  {
    if (!savedStyle.hasOwnProperty(cssProp) && (!persistProps || persistProps.indexOf(cssProp) == -1))
    {
      savedStyle[cssProp] = oj.AnimationUtils._getElementStyle(element, cssProp);
    }
  }
};

// Save the original element style before animating it
oj.AnimationUtils._saveStyle = function(element, fromState, toState, options, persistProps)
{
  var savedStyle = element._ojSavedStyle || {};
  var fromStateCss = (fromState && fromState['css']) ? fromState['css'] : {};
  var toStateCss = (toState && toState['css']) ? toState['css'] : {};

  if (!(options && options['persist'] === 'all'))
  {
    persistProps = null;
  }

  oj.AnimationUtils._saveCssValues(element, fromStateCss, savedStyle, persistProps);
  oj.AnimationUtils._saveCssValues(element, toStateCss, savedStyle, persistProps);

  element._ojSavedStyle = savedStyle;

  // Remember how many times this is called to allow composite animation
  var effectCount = element._ojEffectCount || 0;
  element._ojEffectCount = ++effectCount;
  
  return effectCount;
};

// Restore the original element style
oj.AnimationUtils._restoreStyle = function(element)
{
  var effectCount = element._ojEffectCount;

  // In case of composite animation, restore style when the last effect has ended
  if (effectCount > 1)
  {
    element._ojEffectCount = effectCount - 1;
  }
  else
  {
    var savedStyle = element._ojSavedStyle;
    if (savedStyle)
    {
      for (var prop in savedStyle)
      {
        oj.AnimationUtils._setElementStyle(element, prop, savedStyle[prop]);
      }

      delete element._ojSavedStyle;
      delete element._ojEffectCount;
    }
  }
};

// Get the corresponding camel-cased property name
oj.AnimationUtils._getCamelCasePropName = function(propName)
{
  if (propName.indexOf('-') >= 0)
  {
    var newName = '';

    var strArray = propName.split('-');
    for (var i = 0; i < strArray.length; i++)
    {
      var subStr = strArray[i];

      if (subStr)
      {
        if (newName)
        {
          newName += subStr.charAt(0).toUpperCase() + subStr.slice(1);
        }
        else
        {
          // Keep the first segment in lower case
          newName = subStr;
        }
      }
    }
    
    return newName;
  }
  
  return propName;
};

// Get the corresponding hyphenated property name
oj.AnimationUtils._getHyphenatedPropName = function(propName)
{
  var newName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  if (newName.indexOf('webkit') == 0)
  {
    newName = '-' + newName;
  }
  return newName;
};

// Concatenate value for style property that allows multiple values 
oj.AnimationUtils._concatMultiValue = function(element, state, propName, defaultPrefix, separator)
{
  if (state['css'][propName])
  {
    var currPropValue = oj.AnimationUtils._getElementStyle(element, propName);
    if (currPropValue && currPropValue.indexOf(defaultPrefix) != 0)
    {
      state['css'][propName] = currPropValue + separator + state['css'][propName];
    }
  }
};

oj.AnimationUtils._splitTransform = function(transform)
{
  var array = [];

  if (transform && transform != 'none')
  {
    var index;
    
    while ((index = transform.indexOf(')')) > 0)
    {
      var funcExpr = transform.substr(0, index + 1);
      array.push(funcExpr.trim());
      transform = transform.slice(index + 1);
    }
  }
  
  return array;
};

oj.AnimationUtils._getTransformFuncName = function(funcExpr)
{
  var index = funcExpr.indexOf('(');
  if (index >= 1)
  {
    return funcExpr.substr(0, index);
  }
  
  return funcExpr;
};

// Apply the transform style
oj.AnimationUtils._applyTransform = function(element, newTransform)
{
  var oldTransform = oj.AnimationUtils._getElementStyle(element, 'transform');
  var oldTransformArray = oj.AnimationUtils._splitTransform(oldTransform);
  var newTransformArray = oj.AnimationUtils._splitTransform(newTransform);
  var extraTransformArray = [];
  
  for (var i = 0; i < newTransformArray.length; i++)
  {
    var funcName = oj.AnimationUtils._getTransformFuncName(newTransformArray[i]);
    var match = false;

    if (funcName)
    {
      for (var j = 0; j < oldTransformArray.length; j++)
      {
        // Search for funcName + '(' since some transform functions can be the
        // prefix of other functions such as translate and translateZ.
        if (oldTransformArray[j].indexOf(funcName + '(') == 0)
        {
          // Replace any matching old transform function with the new one
          oldTransformArray[j] = newTransformArray[i];
          match = true;
        }
      }
    }

    // Keep track of any new transform function that wasn't specified    
    if (!match)
    {
      extraTransformArray.push(newTransformArray[i]);
    }
  }
  
  // Concatenate the updated transform list with newly added list
  oldTransformArray = oldTransformArray.concat(extraTransformArray);

  // Return the transform list as a string  
  return oldTransformArray.join(' ');
};

oj.AnimationUtils._applyState = function(element, state, isComposite)
{
  if (state)
  {
    if (state['css'])
    {
      var transitionPropName = 'transition';
      var transformPropName = 'transform';
      
      // For composite animation, we need to concatenate certain property values
      // instead of replacing them
      if (isComposite)
      {
        oj.AnimationUtils._concatMultiValue(element, state, transitionPropName, 'all', ', ');
      }

      if (state['css'][transformPropName])
      {
        state['css'][transformPropName] = oj.AnimationUtils._applyTransform(element, state['css'][transformPropName]);
      }

      var newStyle = state['css'];
      for (var prop in newStyle)
      {
        oj.AnimationUtils._setElementStyle(element, prop, newStyle[prop]);
      }
    }
    
    if (state['addClass'])
    {
      $(element).addClass(state['addClass']);
    }
    
    if (state['removeClass'])
    {
      $(element).removeClass(state['removeClass']);
    }
  }
};

// Get a timing value in millisecond from a string such as duration and delay
oj.AnimationUtils._getTimingValue = function(timingStr)
{
  var timingValue = parseFloat(timingStr);
  if (isNaN(timingValue))
  {
    return 0;
  }
  
  return (timingStr.indexOf('ms') > -1) ? timingValue : timingValue * 1000;
};

oj.AnimationUtils._getTotalTiming = function(duration, delay)
{
  var durationMs = oj.AnimationUtils._getTimingValue(duration);
  if (durationMs > 0)
  {
    var delayMs = delay ? oj.AnimationUtils._getTimingValue(delay) : 0;
    return (durationMs + delayMs);
  }
  
  return 0;
};

oj.AnimationUtils._calcCssTime = function(propertyStr, delayStr, durationStr)
{
  var propertyArray = propertyStr.split(',');
  var delayArray = delayStr.split(',');
  var durationArray = durationStr.split(',');
  var propertyLen = propertyArray.length;
  var delayLen = delayArray.length;
  var durationLen = durationArray.length;
  var maxTime = 0;
  
  for (var i = 0; i < propertyLen; i++)
  {
    var duration = durationArray[i % durationLen];
    var delay = delayArray[i % delayLen];
    var totalMs = oj.AnimationUtils._getTotalTiming(duration, delay);

    maxTime = Math.max(maxTime, totalMs);
  }

  return maxTime;  
};

oj.AnimationUtils._calcEffectTime = function(element)
{
  var style = window.getComputedStyle(element);
  var propertyStr, delayStr, durationStr;
  
  propertyStr = style['animationName'] || style['webkitAnimationName'];
  delayStr = style['animationDelay'] || style['webkitAnimationDelay'];
  durationStr = style['animationDuration'] || style['webkitAnimationDuration'];
  var animationTime = oj.AnimationUtils._calcCssTime(propertyStr, delayStr, durationStr);

  propertyStr = style['transitionProperty'] || style['webkitTransitionProperty'];
  delayStr = style['transitionDelay'] || style['webkitTransitionDelay'];
  durationStr = style['transitionDuration'] || style['webkitTransitionDuration'];
  var transitionTime = oj.AnimationUtils._calcCssTime(propertyStr, delayStr, durationStr);
  
  return Math.max(animationTime, transitionTime);
};

// Fill in empty timing options from a set of source options
oj.AnimationUtils._fillEmptyOptions = function(targetOptions, sourceOptions)
{
  targetOptions['delay'] = targetOptions['delay'] || sourceOptions['delay'];
  targetOptions['duration'] = targetOptions['duration'] || sourceOptions['duration'];
  targetOptions['timingFunction'] = targetOptions['timingFunction'] || sourceOptions['timingFunction'];
  targetOptions['persist'] = targetOptions['persist'] || sourceOptions['persist'];
};

// Trigger oj custom event
oj.AnimationUtils._triggerEvent = function(element, eventName, ui, component)
{
  var defaultPrevented;

  if (component && component._trigger)
  {
    // _trigger() returns false if preventDefault has been called
    defaultPrevented = !component._trigger(eventName, null, ui);
  }
  else
  {
    var ojEventType = 'oj' + eventName.substr(0,1).toUpperCase() + eventName.substr(1);
    var customEvent = new CustomEvent(ojEventType, {'detail':ui, 'bubbles':true, 'cancelable':true});
    var eventTarget = component || element;
    if (eventTarget.dispatchEvent)
    {
      eventTarget.dispatchEvent(customEvent);
    }
    defaultPrevented = customEvent.defaultPrevented;
  }
  
  return defaultPrevented;
}  

/**
 * Internal method for starting an animation.
 * @param {Element} element  the HTML element to animate
 * @param {string} action  a component-defined string that identifies the action starting
 *                         the animation, such as "open", "close", "add", "remove", etc.
 * @param {string|Object|Array} effects  The name of one of the effect methods
 *                        in oj.AnimationUtils, or an object that specifies the
 *                        effect method and its options, such as:
 *                        {'effect': 'fadeOut', 'endOpacity': 0.5}, or an array of the above.
 * @param {Object=} component  the component that owns the HTML element
 *                             to animate.  If this is specified and it has a
 *                             _trigger method (jQuery UI widget), animation events will
 *                             be triggered on the component via jQuery UI _trigger(),
 *                             so that listeners specified as event options will work.
 *                             If this is specified but it doesn't have a _trigger
 *                             method (HTML element), animation events will be triggered
 *                             on the component via dispatchEvent.
 *                             If this is not specified, animation events will be triggered
 *                             on the animated HTML element via dispatchEvent.
 * @return {Promise} a promise that will be resolved when the animation ends
 * @export
 * @ignore
 */
oj.AnimationUtils.startAnimation = function(element, action, effects, component)
{
  // Temporary fix for callers that are passing in jQuery object
  element = $(element)[0];

  var promise = new Promise(
    function(resolve, reject)
    {    
      var jelem = $(element);
      var fromMarker = 'oj-animate-' + action;
      var toMarker = fromMarker + '-active';
      var eventProcessed = false;
      var markerProcessed = false;
      var resolvePromise = function() {
        if (eventProcessed && markerProcessed)
        {
          jelem.removeClass(fromMarker);
          jelem.removeClass(toMarker);
          oj.AnimationUtils._restoreStyle(element);
          resolve(true);
          
          var ui = {'action': action, 'element': element};
          oj.AnimationUtils._triggerEvent(element, 'animateEnd', ui, component);
        }
      };
      var eventCallback = function() {
        eventProcessed = true;
        resolvePromise();
      };
      var markerCallback = function() {
        markerProcessed = true;
        resolvePromise();
      };

      // This will add a ref count so that the style is not restored until
      // all effects and user-defined css transitions have ended.  Otherwise
      // there may be screen flash if 'persist' != 'all'.
      oj.AnimationUtils._saveStyle(element, null, null, null, null);

      // Trigger ojanimatestart event so that app can prevent default animation 
      // and define custom effect in JS
      var ui = {'action': action, 'element': element, 'endCallback': eventCallback};
      var defaultPrevented = oj.AnimationUtils._triggerEvent(element, 'animateStart', ui, component);

      // Continue animation handling if app didn't preventDefault
      if (!defaultPrevented)
      {
        var effectArray = [].concat(effects);
        var promiseArray = [];
        var lastOptions = {};

        for (var i = 0; i < effectArray.length; i++)
        {
          var animationEffect = effectArray[i];
          var effectName = '';
          var effectOptions;
          
          // Start any explicit animation effect 
          if (animationEffect != null && animationEffect != 'none')
          {
            if (typeof animationEffect == 'string')
            {
              effectName = animationEffect;
              effectOptions = {};
            }
            else if (typeof animationEffect == 'object')
            {
              effectName = animationEffect['effect'];
              effectOptions = $.extend({}, animationEffect);
            }

            // Fill in empty timing options with what was specified last
            oj.AnimationUtils._fillEmptyOptions(effectOptions, lastOptions);
            
            // Remember the last set of options
            lastOptions = $.extend({}, effectOptions);
          }
            
          if (effectName && oj.AnimationUtils[effectName])
          {
            promiseArray.push(oj.AnimationUtils[effectName](element, effectOptions));
          }
        }
        
        if (promiseArray.length)
        {
          Promise.all(promiseArray).then(eventCallback);
        }
        else
        {
          eventCallback();
        }
      }

      // Add marker class so that app can define custom effect in CSS      
      jelem.addClass(fromMarker);
      var requestId = window.requestAnimationFrame(function() {
        requestId = 0;
        
        jelem.addClass(toMarker);
        
        var totalMs = oj.AnimationUtils._calcEffectTime(element);
        if (totalMs > 0)
        {
          // Set a timeout to resolve the promise.  We can't rely on
          // transitionend event since there can be multiple transition
          // properties, or the transition is never triggered, or the transition
          // is cancelled.
          setTimeout(markerCallback, totalMs + 100);
        }
        else
        {
          markerCallback();
        }
      });
      
      // In case we are in the background and requestAnimationFrame is not
      // called, have a timeout that cancel the request and resolve promise
      setTimeout(function() {
        if (requestId)
        {
          window.cancelAnimationFrame(requestId);
          requestId = 0;
          markerCallback();
        }
      }, 1000);
    }
  );
  
  return promise;
};

oj.AnimationUtils._mergeOptions = function(effect, options)
{
  if (oj.AnimationUtils._defaultOptions == null)
  {
    oj.AnimationUtils._defaultOptions = oj.ThemeUtils.parseJSONFromFontFamily('oj-animation-effect-default-options');
  }
 
  // At the minimum, we should have a duration.  Merge any theming defaults
  // and then any user options to it.  
  return $.extend({'duration': '400ms'},
                  oj.AnimationUtils._defaultOptions ? oj.AnimationUtils._defaultOptions[effect] : null,
                  options);
};

oj.AnimationUtils._createTransitionValue = function(element, transProps, options)
{
  var transValue = '';

  if (transProps)
  {
    for (var i = 0; i < transProps.length; i++)
    {
      var propName = oj.AnimationUtils._getName(element, transProps[i]);
      var hyphenatedName = oj.AnimationUtils._getHyphenatedPropName(propName);

      transValue += (i > 0 ? ', ' : '') + hyphenatedName + ' ' + options['duration'];
      
      if (options['timingFunction'])
        transValue += ' ' + options['timingFunction'];
      
      if (options['delay'])
        transValue += ' ' + options['delay'];
    }
  }
  
  return transValue;
};
  
oj.AnimationUtils._fade = function(element, options, effect, startOpacity, endOpacity)
{
  options = oj.AnimationUtils._mergeOptions(effect, options);
  
  var fromState = {'css': {'opacity': startOpacity}};
  var toState = {'css': {'opacity': endOpacity}};

  if (options)
  {    
    if (options['startOpacity'])
      fromState['css']['opacity'] = options['startOpacity'];
   
    if (options['endOpacity'])
      toState['css']['opacity'] = options['endOpacity'];
  }

  return oj.AnimationUtils._animate(element, fromState, toState, options, ['opacity']);
};

/**
 * Animaton effect method for fading in a HTML element.
 * 
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {number=} options.startOpacity starting opacity. Default is 0.
 * @param {number=} options.endOpacity  ending opacity. Default is 1.
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.fadeIn = function(element, options)
{
  return oj.AnimationUtils._fade(element, options, 'fadeIn', 0, 1);
};

/**
 * Animaton effect method for fading out a HTML element.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {number=} options.startOpacity starting opacity. Default is 1.
 * @param {number=} options.endOpacity  ending opacity. Default is 0.
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.fadeOut = function(element, options)
{
  return oj.AnimationUtils._fade(element, options, 'fadeOut', 1, 0);
};

/**
 * Animaton effect method for expanding a HTML element.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.direction direction to expand. Valid values are "height", "width", or "both". Default is "height".
 * @param {string=} options.startMaxHeight starting max-height value to expand from.  Default is "0".
 * @param {string=} options.endMaxHeight ending max-height value to expand to.  Default is natural element height.
 * @param {string=} options.startMaxWidth starting max-width value to expand from.  Default is "0".
 * @param {string=} options.endMaxWidth starting max-width value to expand to.  Default is natural element width.
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.expand = function(element, options)
{
  return oj.AnimationUtils._expandCollapse(element, options, true);
};

/**
 * Animaton effect method for collapsing a HTML element.
 * <p>When using this method to hide an element, the element should not have any border
 * or padding, because border and padding are visible even if the element's height
 * is set to 0. The use of "box-sizing: border-box" style doesn't change this behavior.
 * If the element needs border and padding, create a wrapper element around it and
 * call this method on the wrapper element instead.</p>
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.direction direction to collapse. Valid values are "height", "width", or "both". Default is "height".
 * @param {string=} options.startMaxHeight starting max-height value to collapse from.  Default is natural element height.
 * @param {string=} options.endMaxHeight ending max-height value to collapse to.  Default is "0".
 * @param {string=} options.startMaxWidth starting max-width value to collapse from.  Default is natural element width.
 * @param {string=} options.endMaxWidth starting max-width value to collapse to.  Default is "0".
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.collapse = function(element, options)
{
  return oj.AnimationUtils._expandCollapse(element, options, false);
};

// Wrap table row content and return an array of wrapper elements to animate
oj.AnimationUtils._wrapRowContent = function(row, rowHeight)
{
  var wrappers = [];
  var cells = row.children;
  var cellsPadding = [];
  var cellsTextAlign = [];
  
  // Collect all the needed style before modifying the DOM.  Otherwise it
  // causes additional reflow and takes more time.

  row._ojSavedHeight = row.style['height'];

  for (var i = 0; i < cells.length; i++)
  {
    var cell = cells[i];
    var cellStyle = window.getComputedStyle(cell);
    cellsPadding.push(cellStyle['padding']);
    cellsTextAlign.push(cellStyle['textAlign']);

    // Remember the inline padding style (not computed style)
    cell._ojSavedPadding = cell.style['padding'];
  }

  // Start modifying the DOM
  
  for (var i = 0; i < cells.length; i++)
  {
    var cell = cells[i];

    // Create the outer wrapper
    var outerWrapper = document.createElement('div');
    outerWrapper.style['overflow'] = 'hidden;';
    
    // Create the inner wrapper    
    var innerWrapper = document.createElement('div');
    innerWrapper.style['display'] = 'table-cell';
    innerWrapper.style['verticalAlign'] = 'middle';
    innerWrapper.style['boxSizing'] = 'border-box';
    innerWrapper.style['height'] = rowHeight;
    innerWrapper.style['padding'] = cellsPadding[i];
    innerWrapper.style['textAlign'] = cellsTextAlign[i];
    
    // Append inner wrapper to outer wrapper
    outerWrapper.appendChild(innerWrapper); //@HTMLUpdateOK; innerWrapper is constructed by component code and is not using string passed in through any APIs.

    // Transfer children of cell to inner wrapper
    while (cell.firstChild)
    {
      innerWrapper.appendChild(cell.firstChild); //@HTMLUpdateOK; cell.firstChild is constructed by component code and is not using string passed in through any APIs.
    }

    // Finally append the outer wrapper back to the cell
    cell.appendChild(outerWrapper); //@HTMLUpdateOK; outerWrapper is constructed by component code and is not using string passed in through any APIs.
    
    // Set the cell padding to 0 so that it can be completely collapsed
    cell.style['padding'] = '0';
    
    wrappers.push(outerWrapper);
  };
  
  // Set the row height to 0 so that it can be completely collapsed
  row.style['height'] = '0';
  
  return wrappers;
};

// Unwrap table row content
oj.AnimationUtils._unwrapRowContent = function(row)
{
  var cells = row.children;
  
  for (var i = 0; i < cells.length; i++)
  {
    var cell = cells[i];

    var outerWrapper = cell.children[0];
    if (outerWrapper)
    {
      var innerWrapper = outerWrapper.children[0];
      if (innerWrapper)
      {
        while (innerWrapper.firstChild)
        {
          cell.appendChild(innerWrapper.firstChild); //@HTMLUpdateOK; innerWrapper.firstChild is constructed by component code and is not using string passed in through any APIs.
        }
      }
      
      // Remove the outer wrapper will also remove the inner wrapper
      cell.removeChild(outerWrapper);
    }

    // Restore any inline padding style to the cell
    cell.style['padding'] = cell._ojSavedPadding;
    delete cell._ojSavedPadding;        
  }

  // Restore any inline height style to the row
  row.style['height'] = row._ojSavedHeight;
  delete row._ojSavedHeight;
};

// Expand or collapse a table row
oj.AnimationUtils._expandCollapseRow = function(element, options, isExpand)
{
  var promise;
  var rowHeight = element.offsetHeight + 'px';
  var wrappers = oj.AnimationUtils._wrapRowContent(element, rowHeight);
  var wrapperOptions = $.extend({}, options);

  // Set the known max height into the options so that each cell doesn't
  // have to recalculate it
  if (isExpand)
  {
    if (!wrapperOptions['endMaxHeight'])
    {
      wrapperOptions['endMaxHeight'] = rowHeight;
    }
  }
  else
  {
    if (!wrapperOptions['startMaxHeight'])
    {
      wrapperOptions['startMaxHeight'] = rowHeight;
    }
  }
  
  // Set persist option so that we don't need to restore the style after 
  // animation.  The wrapper will be removed anyway.
  wrapperOptions['persist'] = 'all';
  
  // Set internal _noReflow option so that we don't force reflow on Firefox.
  // New elements will naturally cause reflow.
  wrapperOptions['_noReflow'] = true;
  
  if (wrappers.length)
  {
    // Animate all the cells
    for (var i = 0; i < wrappers.length; i++)
    {
      // We only need one promise/row.  Skip promise for all cells except first.
      if (i == 0)
      {
        wrapperOptions['_skipPromise'] = false;
        promise = oj.AnimationUtils._expandCollapse(wrappers[i], wrapperOptions, isExpand);
      }
      else
      {
        wrapperOptions['_skipPromise'] = true;
        oj.AnimationUtils._expandCollapse(wrappers[i], wrapperOptions, isExpand);
      }
    }
  }
  else
  {
    promise = Promise.resolve();
  }

  return promise.then(function() {
    if (options == null || options['persist'] != 'all')
    {
      oj.AnimationUtils._unwrapRowContent(element);
    }
  });
};

// Determine the min/max width/height used for animation
oj.AnimationUtils._getSizeLimit = function(element, style, optionValue, isLower, isWidth)
{
  var limitValue = optionValue;

  if (!limitValue)
  {
    if (isLower)
    {
      limitValue = '0';
    }
    else
    {
      var cssValue = isWidth ? style['maxWidth'] : style['maxHeight'];
      if (cssValue !== "none")
      {
        limitValue = cssValue;
      }
      else
      {
        limitValue = (isWidth ? element.offsetWidth : element.offsetHeight) + 'px';
      }
    }
  }
  
  return limitValue;
};

oj.AnimationUtils._expandCollapse = function(element, options, isExpand)
{
  // Handle the case where the element is a <tr> element.  We need to wrap the
  // content of every child <td> and animate the wrappers because the min height
  // of <tr> and <td> are limited by their contents.
  if (element && element.tagName == 'TR')
  {
    return oj.AnimationUtils._expandCollapseRow(element, options, isExpand);
  }
  
  options = oj.AnimationUtils._mergeOptions(isExpand ? 'expand' : 'collapse', options);

  var fromState = {};
  var toState = {};

  var direction = options['direction'] || "height";

  var fromCSS = fromState['css'] = {};
  var toStateCSS = toState['css'] = {};

  var style = window.getComputedStyle(element);
  var transProps = [];
  if(direction === "both" || direction === "height") 
  {
    var startMaxHeight = oj.AnimationUtils._getSizeLimit(element, style, options['startMaxHeight'], isExpand, false);
    var endMaxHeight = oj.AnimationUtils._getSizeLimit(element, style, options['endMaxHeight'], !isExpand, false);

    fromCSS['maxHeight'] = startMaxHeight;
    toStateCSS['maxHeight'] = endMaxHeight;
    transProps.push('maxHeight');
  }

  if(direction === "both" || direction === "width") 
  {
    var startMaxWidth = oj.AnimationUtils._getSizeLimit(element, style, options['startMaxWidth'], isExpand, true);
    var endMaxWidth = oj.AnimationUtils._getSizeLimit(element, style, options['endMaxWidth'], !isExpand, true);
    
    fromCSS['maxWidth'] = startMaxWidth;
    toStateCSS['maxWidth'] = endMaxWidth;
    transProps.push('maxWidth');
  }
  
  // expand and collapse needs overflow hidden to hide the content
  fromCSS['overflow'] = options['overflow'] ? options['overflow'] : 'hidden';
  
  var persistProps = [].concat(transProps);
  persistProps.push('overflow');

  return oj.AnimationUtils._animate(element, fromState, toState, options, transProps, persistProps);
};

/**
 * Animaton effect method for zooming in a HTML element.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.axis the axis along which to scale the element. Valid values are "x", "y", or "both". Default is "both".
 * @param {string=} options.transformOrigin set the CSS transform-origin property, which controls the anchor point for the zoom. Default is "center".
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.zoomIn = function(element, options)
{
  return oj.AnimationUtils._zoom(element, options, true);
};

/**
 * Animaton effect method for zooming out a HTML element.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.axis the axis along which to scale the element. Valid values are "x", "y", or "both". Default is "both".
 * @param {string=} options.transformOrigin set the CSS transform-origin property, which controls the anchor point for the zoom. Default is "center".
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.zoomOut = function(element, options)
{
  return oj.AnimationUtils._zoom(element, options, false);
};

oj.AnimationUtils._zoom = function(element, options, isIn)
{
  options = oj.AnimationUtils._mergeOptions(isIn ? 'zoomIn' : 'zoomOut', options);

  var fromState = {};
  var toState = {};

  var axis = options['axis'] || "both";
    
  var scale = axis === "both" ? "scale" : (axis === "x" ? "scaleX" : "scaleY");
  var fromCSS = fromState['css'] = {};
  var toStateCSS = toState['css'] = {};
  var transformPropName = 'transform';
  var transformOriginPropName = 'transformOrigin';

  fromCSS[transformPropName] = scale + "(" + (isIn ? 0 : 1) + ") translateZ(0)";
  toStateCSS[transformPropName] = scale + "(" + (isIn ? 1 : 0) + ") translateZ(0)";

  fromCSS[transformOriginPropName] = options['transformOrigin'] || "center";

  return oj.AnimationUtils._animate(element, fromState, toState, options, [transformPropName]);
};

/**
 * Animaton effect method for sliding in a HTML element.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.direction Direction of the slide. Valid values are "left", "top", "right", "bottom", "start", and "end". Default is "start".
 *                                    This option is ignored if either offsetX or offsetY is specified.
 * @param {string=} options.offsetX The offset on the x-axis to translate from. This value must be a number followed by a unit such as "px", "em", etc.
 *                                  If moving in a horizontal direction, default to element width. Otherwise, default to "0px".
 * @param {string=} options.offsetY The offset on the y-axis to translate from. This value must be a number followed by a unit such as "px", "em", etc.
 *                                  If moving in a vertical direction, default to element height. Otherwise, default to "0px".
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.slideIn = function(element, options)
{
  return oj.AnimationUtils._slide(element, options, true);
};

/**
 * Animaton effect method for sliding out a HTML element.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.direction Direction of the slide. Valid values are "left", "top", "right", "bottom", "start", and "end". Default is "start".
 *                                    This option is ignored if either offsetX or offsetY is specified.
 * @param {string=} options.offsetX The offset on the x-axis to translate to. This value must be a number followed by a unit such as "px", "em", etc.
 *                                  If moving in a horizontal direction, default to element width. Otherwise, default to "0px".
 * @param {string=} options.offsetY The offset on the y-axis to translate to. This value must be a number followed by a unit such as "px", "em", etc.
 *                                  If moving in a vertical direction, default to element height. Otherwise, default to "0px".
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.slideOut = function(element, options)
{
  return oj.AnimationUtils._slide(element, options, false);
};

oj.AnimationUtils._slide = function(element, options, isIn)
{
  options = oj.AnimationUtils._mergeOptions(isIn ? 'slideIn' : 'slideOut', options);

  var fromState = {};
  var toState = {};

  var direction = options['direction'] || "start";

  var offsetX = '0';
  var offsetY = '0';
  var fromCSS = fromState['css'] = {};
  var toStateCSS = toState['css'] = {};

  if (options['offsetX'] || options['offsetY'])
  {
    if (options['offsetX'])
      offsetX = options['offsetX'];
    
    if (options['offsetY'])
      offsetY = options['offsetY'];
  }
  else
  {
    var isRTL = oj.DomUtils.getReadingDirection() === "rtl";

    switch (direction)
    {
      case 'left':
        offsetX = (isIn ? element.offsetWidth : -element.offsetWidth) + 'px';
        break;
      case 'right':
        offsetX = (isIn ? -element.offsetWidth : element.offsetWidth) + 'px';
        break;
      case 'top':
        offsetY = (isIn ? element.offsetHeight : -element.offsetHeight) + 'px';
        break;
      case 'bottom':
        offsetY = (isIn ? -element.offsetHeight : element.offsetHeight) + 'px';
        break;
      case 'end':
        offsetX = ((isIn ? -element.offsetWidth : element.offsetWidth) * (isRTL ? -1 : 1)) + 'px';
        break;
      default: // 'start'
        offsetX = ((isIn ? element.offsetWidth : -element.offsetWidth) * (isRTL ? -1 : 1)) + 'px';
        break;
    }
  }
  
  var transformPropName = 'transform';
  if (isIn)
  {
    fromCSS[transformPropName] = "translate(" + offsetX + "," + offsetY + ") translateZ(0)";
    toStateCSS[transformPropName] = "translate(0,0) translateZ(0)";
  }
  else
  {
    fromCSS[transformPropName] = "translate(0,0) translateZ(0)";
    toStateCSS[transformPropName] = "translate(" + offsetX + "," + offsetY + ") translateZ(0)";
  }

  return oj.AnimationUtils._animate(element, fromState, toState, options, [transformPropName]);
};

/**
 * Animaton effect method for rippling a HTML element.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.offsetX Horizontal offset of the ripple center, with a unit of either "px" or "%".
 *                                  If the unit is "px", it specifies the offset in pixels.
 *                                  If the unit is "%", it specifies the offset as a percentage of the element's width.
 * @param {string=} options.offsetY Vertical offset of the ripple center, with a unit of either "px" or "%".
 *                                  If the unit is "px", it specifies the offset in pixels.
 *                                  If the unit is "%", it specifies the offset as a percentage of the element's height.
 * @param {string=} options.color Color of the ripple. Default is specified in the "oj-animation-effect-ripple" CSS class.
 * @param {string=} options.diameter Diameter of the ripple, with a unit of either "px" or "%".
 *                                   If the unit is "px", it specifies the diameter in pixels.
 *                                   If the unit is "%", it specifies the diameter as a percentage of either the element's width or height, whichever is less.
 *                                   Default is specified in the "oj-animation-effect-ripple" CSS class.
 * @param {number=} options.startOpacity start opacity of the ripple. Default is specified in the "oj-animation-effect-ripple" CSS class.
 * @param {number=} options.endOpacity end opacity of the ripple. Default is 0.
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.ripple = function(element, options)
{
  options = oj.AnimationUtils._mergeOptions('ripple', options);

  var fromState = {};
  var toState = {};

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  // The rippler need its own container since setting overflow on the target
  // element may not work if the element has no explicit height, which can be
  // the case on buton, listitem, etc.
  var container = $("<div style='position:absolute; overflow:hidden'>");
  var rippler = $("<div class='oj-animation-effect-ripple oj-animation-rippler'>");
  
  // prepend the rippler instead of append so that it doesn't obscure other children
  var style = window.getComputedStyle(element);
  var position = (style['position'] == 'static') ? {'left':element.offsetLeft, 'top':element.offsetTop} : {'left':0, 'top':0};
  element.insertBefore(container[0], element.firstChild); //@HTMLUpdateOK; container is constructed by component code and is not using string passed in through any APIs.
  container.css({'left': position['left'] + 'px', 
                 'top': position['top'] + 'px',
                 'width': width + 'px',
                 'height': height + 'px'});
  
  container.prepend(rippler); //@HTMLUpdateOK; rippler is constructed by component code and is not using string passed in through any APIs.
  
  var fromCSS = fromState['css'] = {};
  var toStateCSS = toState['css'] = {};
  var transformPropName = 'transform';

  oj.AnimationUtils._setRippleOptions(fromCSS, rippler, container, options);
  
  fromCSS[transformPropName] = "scale(0) translateZ(0)";
  fromCSS['opacity'] = options["startOpacity"] || rippler.css('opacity');
  
  toStateCSS[transformPropName] = "scale(1) translateZ(0)";
  toStateCSS['opacity'] = options["endOpacity"] || 0;
  
  // Always persist the ripple state so that it remains invisible until removed.
  // Otherwise it may re-appear briefly on mobile Safari.
  options['persist'] = 'all';

  return oj.AnimationUtils._animate(rippler[0], fromState, toState, options, [transformPropName, 'opacity']).
          then(function() 
          {
            container.remove();
          });
};

oj.AnimationUtils._setRippleOptions = function(css, rippler, parent, options)
{
  var diameter = rippler.width();
  var parentWidth = parent.width();
  var parentHeight = parent.height();

  if (options['diameter'])
  {
    var diameterStr = options['diameter'];
    var value = parseInt(diameterStr, 10);
    if (!isNaN(value))
    {
      if (diameterStr.charAt(diameterStr.length - 1) == '%')
      {
        diameter = Math.floor(Math.min(parentWidth, parentHeight) * (value / 100));
      }
      else
      {
        diameter = value;
      }

      css['width'] = diameter + 'px';
      css['height'] = diameter + 'px';
    }
  }

  var position = (parent.css('position') == 'static') ? parent.position() : {'left':0, 'top':0};
  var offset;
  
  offset = oj.AnimationUtils._calcRippleOffset(options['offsetX'], diameter, parentWidth, position['left']);
  if (offset != null)
  {
    css['left'] = offset + 'px';
  }
  
  offset = oj.AnimationUtils._calcRippleOffset(options['offsetY'], diameter, parentHeight, position['top']);
  if (offset != null)
  {
    css['top'] = offset + 'px';
  }
  
  if (options['color'])
  {
    css['backgroundColor'] = options['color'];
  }
};

oj.AnimationUtils._calcRippleOffset = function(offsetOption, diameter, parentSize, parentOffset)
{
  var offset;
  
  offsetOption = offsetOption || '50%';

  var offsetInt = parseInt(offsetOption, 10);
  if (!isNaN(offsetInt))
  {
    if (offsetOption.charAt(offsetOption.length - 1) == '%')
    {
      offset = (parentSize * (offsetInt / 100)) - (diameter / 2);
    }
    else
    {
      offset = offsetInt - (diameter / 2);
    }

    // offset should be relative to the rippler's offsetParent, which is not
    // the parent element if the parent element has static position.      
    offset = Math.floor(offset + parentOffset);
  }
  
  return offset;
};

oj.AnimationUtils._removeRipple = function(element, options)
{
  options = options || {};

  var possibleEffects = {"fadeOut": 1, "collapse": 1, "zoomOut": 1, "slideOut": 1};
  var removeEffect = options["removeEffect"] || "fadeOut";
  var rippler = $(".oj-animation-rippler", element);

  if(rippler.length === 0) 
  {
    console.warn("No rippler so returning");
    return
  }

  if(!(removeEffect in possibleEffects)) 
  {
    return rippler.remove();
  }
  
  return oj.AnimationUtils[removeEffect](rippler, options).
          then(function() 
          {
            rippler.remove();
          });
};

oj.AnimationUtils._calcBackfaceAngle = function(angle)
{
  var backfaceAngle;
  var expr = /^([\+\-]?\d*\.?\d*)(.*)$/;
  var matchArray = angle.match(expr);
  var amount = parseFloat(matchArray[1]);
  var unit = matchArray[2];

  switch (unit)
  {
    case 'deg': backfaceAngle = (amount - 180) + unit; break;
    case 'grad': backfaceAngle = (amount - 200) + unit; break;
    case 'rad': backfaceAngle = (amount - 3.1416) + unit; break;
    case 'turn': backfaceAngle = (amount - 0.5) + unit; break;
    default: console.log('Unknown angle unit in flip animation: ' + unit); break;
  }
  
  return backfaceAngle;
};

oj.AnimationUtils._flip = function(element, options, effect, startAngle, endAngle)
{
  // Handle the case where the element has children to represent front and back
  // faces.  We need to flip the children instead of the parent since IE doesn't
  // support preserve-3d style, which works on other browsers.
  if (options && options['flipTarget'] == 'children')
  {
    var promises = [];
    var children = $(element).children();
    var childOptions;

    var frontOptions = $.extend({}, options);
    delete frontOptions['flipTarget'];

    var backOptions = $.extend({}, frontOptions);
    backOptions['startAngle'] = oj.AnimationUtils._calcBackfaceAngle(options['startAngle'] || startAngle);
    backOptions['endAngle'] = oj.AnimationUtils._calcBackfaceAngle(options['endAngle'] || endAngle);
    
    for (var i = 0; i < children.length; i++)
    {
      childOptions = $(children[i]).hasClass('oj-animation-backface') ? backOptions : frontOptions;
      promises.push(oj.AnimationUtils._flip(children[i], childOptions, effect, startAngle, endAngle));
    }

    return Promise.all(promises);
  }

  options = oj.AnimationUtils._mergeOptions(effect, options);

  var fromCss = {};
  var toCss = {};
  var fromState = {'css': fromCss};
  var toState = {'css': toCss};
  var rotateFunc = 'rotateY(';
  var perspective = '2000px';
  var backfaceVisibility = 'hidden';
  var transformOrigin = 'center';
  var transform;
  
  if (options)
  {    
    if (options['axis'] === 'x')
      rotateFunc = 'rotateX(';
    
    if (options['startAngle'])
      startAngle = options['startAngle'];

    if (options['endAngle'])
      endAngle = options['endAngle'];
   
    if (options['perspective'])
      perspective = options['perspective'];
    
    if (options['backfaceVisibility'])
      backfaceVisibility = options['backfaceVisibility'];
    
    if (options['transformOrigin'])
      transformOrigin = options['transformOrigin'];
  }

  // perspective() must precede rotate() in the transform value in order for it to work
  transform = 'perspective(' + perspective + ') ' + rotateFunc;

  // Safari still requires webkit prefix for backfaceVisibility property
  var backfaceVisPropName = 'backfaceVisibility';
  var transformPropName = 'transform';
  var transformOriginPropName = 'transformOrigin';
  
  fromCss[transformPropName] = transform + startAngle + ')';
  fromCss[backfaceVisPropName] = backfaceVisibility;
  fromCss[transformOriginPropName] = transformOrigin;  

  toCss[transformPropName] = transform + endAngle + ')';

  // backfaceVisibility and transformOrigin affects the final look of the element,
  // so they should be persisted if the persist option is set.
  return oj.AnimationUtils._animate(element, fromState, toState, options, [transformPropName], [transformPropName, backfaceVisPropName, transformOriginPropName]);
};

/**
 * Animaton effect method for rotating a HTML element into view.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.axis  The axis of the rotation. Valid values are "x" and "y". Default is "y".
 * @param {string=} options.startAngle  The starting angle of the rotation. Refer to CSS rotate() transform for valid values. Default is "-180deg", which shows the back face of the element.
 * @param {string=} options.endAngle  The ending angle of the rotation. Refer to CSS rotate() transform for valid values. Default is "0deg", which shows the front face of the element.
 * @param {string=} options.backfaceVisibility  The visibility of the back face when facing the user. Valid values are "visible" and "hidden". If set to "visible", the back face shows a 
 *                                              mirrored image of the front face. If set to "hidden", the back face is invisible.  Default is "hidden".
 * @param {string=} options.perspective  The 3D perspective for the element. Default is "2000px". A smaller value makes the 3D effect more pronounced during rotation.
 * @param {string=} options.transformOrigin  The axis location for the rotation. Refer to CSS transform-origin for valid values. Default is "center".
 * @param {string=} options.flipTarget  The target for flipping.  Valid values are "element" and "children".  Default is "element".
 *                                      <p>Set to "element" to flip the element itself.</p>
 *                                      <p>Set to "children" to flip the children of the element.  This is used when the element is a card-like structure that
 *                                         has children to represent the front and back faces of a card.  The child that represents the back face must have
 *                                         the "oj-animation-backface" marker class.  Use this option instead of the "transform-style: preserve-3d" CSS style because
 *                                         some browsers do not support "transform-style".  See the cookbook for a Card Flip example of using this option.</p>
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.flipIn = function(element, options)
{
  return oj.AnimationUtils._flip(element, options, 'flipIn', '-180deg', '0deg');
};

/**
 * Animaton effect method for rotating a HTML element out of view.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object=} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.axis  The axis of the rotation. Valid values are "x" and "y". Default is "y".
 * @param {string=} options.startAngle  The starting angle of the rotation. Refer to CSS rotate() transform for valid values. Default is "0deg", which shows the front face of the element.
 * @param {string=} options.endAngle  The ending angle of the rotation. Refer to CSS rotate() transform for valid values. Default is "180deg", which shows the back face of the element.
 * @param {string=} options.backfaceVisibility  The visibility of the back face when facing the user. Valid values are "visible" and "hidden". If set to "visible", the back face shows a 
 *                                              mirrored image of the front face. If set to "hidden", the back face is invisible.  Default is "hidden".
 * @param {string=} options.perspective  The 3D perspective for the element. Default is "2000px". A smaller value makes the 3D effect more pronounced during rotation.
 * @param {string=} options.transformOrigin  The axis location for the rotation. Refer to CSS transform-origin for valid values. Default is "center".
 * @param {string=} options.flipTarget  The target for flipping.  Valid values are "element" and "children".  Default is "element".
 *                                      <p>Set to "element" to flip the element itself.</p>
 *                                      <p>Set to "children" to flip the children of the element.  This is used when the element is a card-like structure that
 *                                         has children to represent the front and back faces of a card.  The child that represents the back face must have
 *                                         the "oj-animation-backface" marker class.  Use this option instead of the "transform-style: preserve-3d" CSS style because
 *                                         some browsers do not support "transform-style".  See the cookbook for a Card Flip example of using this option.</p>
 * @return {Promise.<boolean>} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.flipOut = function(element, options)
{
  return oj.AnimationUtils._flip(element, options, 'flipOut', '0deg', '180deg');
};

/**
 * Animaton effect method for adding transition to a HTML element.  Caller should
 * set the new style immediately before calling this method.  This is for internal
 * use only.
 *
 * @param {Element} element  the HTML element to animate
 * @param {Object} options Options applicable to the specific animation effect.
 * @param {string=} options.delay  The delay from the time the animation is applied to time the 
 * animation should begin. This may be specified in either seconds (by specifying s as the unit) or milliseconds 
 * (by specifying ms as the unit). Default is "0s".
 * @param {string=} options.duration The duration that an animation should take to complete. This may be 
 * specified in either seconds (by specifying s as the unit) or milliseconds (by specifying ms as the unit). 
 * Default is "400ms".
 * @param {string=} options.timingFunction  One of the valid values for either CSS transition-timing-function or CSS 
 * animation-timing-function. Default is "ease".
 * @param {Array} options.transitionProperties  An array of properties to transition.
 * @return {Promise|IThenable} a promise that will be resolved when the animation ends
 *
 * @export
 * @ignore
 */
oj.AnimationUtils.addTransition = function(element, options)
{
  options = oj.AnimationUtils._mergeOptions('addTransition', options);
   
  return oj.AnimationUtils._animate(element, null, null, options, options['transitionProperties']);
};
/**
 * All the available animation methods supported in oj.AnimationUtils
 * @typedef {Object} oj.AnimationUtils.AnimationMethods
 * @ojvalue {string} "collapse"
 * @ojvalue {string} "expand"
 * @ojvalue {string} "fadeIn"
 * @ojvalue {string} "fadeOut"
 * @ojvalue {string} "flipIn"
 * @ojvalue {string} "flipOut"
 * @ojvalue {string} "ripple"
 * @ojvalue {string} "slideIn"
 * @ojvalue {string} "slideOut"
 * @ojvalue {string} "zoomIn"
 * @ojvalue {string} "zoomOut"
 */
});