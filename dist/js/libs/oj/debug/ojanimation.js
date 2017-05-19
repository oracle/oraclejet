/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
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
 *   Customizing Animation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#custom-animation-section"></a>
 * </h3>
 *
 * <p>Applications can customize animations triggered by actions in some components by listening for <code class="prettyprint">animateStart/animateEnd</code>
 *    events and override action specific animations.  See the documentation of individual components for support details of <code
 *    class="prettyprint">animateStart/animateEnd</code> events and the associated actions.</p>
 * <p>To customize an animation, applications first listen to <code class="prettyprint">animateStart</code> event and cancel the default animation.  Then
 *    specify the new animation in one of several ways:</p>
 * <ul>
 *   <li>Call one of the animation effect methods in oj.AnimationUtils.
 *   <li>Call a 3rd-party animation function with a Javascript API, such as jQuery, GreenSock, Velocity.js, etc.
 *   <li>Define action specific CSS style classes on the animated item.
 * </ul>
 *
 * <h4>Examples</h4>
 * <br>
 * <i>Customize a default "open" animation with oj.AnimationUtils method:</i>
 * <pre class="prettyprint"><code>
 * $( ".selector" ).on( "ojanimatestart", function( event, ui ) {
 *   if (ui.action == "open") {
 *     event.preventDefault();
 *     oj.AnimationUtils.slideIn(ui.element).then(ui.endCallback);
 *   }
 * });
 * </code></pre>
 * <br>
 * <i>Customize a default "close" animation with jQuery method:</i>
 * <pre class="prettyprint"><code>
 * $( ".selector" ).on( "ojanimatestart", function( event, ui ) {
 *   if (ui.action == "close") {
 *     event.preventDefault();
 *     $(ui.element).fadeOut(ui.endCallback);
 *   }
 * });
 * </code></pre>
 * <br>
 * <i>Customize a default "update" animation with CSS style classes:</i>
 * <pre class="prettyprint"><code>
 * $( ".selector" ).on( "ojanimatestart", function( event, ui ) {
 *   if (ui.action == "update") {
 *     event.preventDefault();
 *     ui.endCallback();
 *   }
 * });
 * </code></pre>
 *
 * <pre class="prettyprint"><code>
 * .selector .oj-animate-update {
 *   color: red;
 * }
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
 * @export
 */
oj.AnimationUtils = {};

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
  var jelem = $(element);
  var propArray = [].concat(transProps);

  var promise = new Promise(
    function(resolve, reject)
    {
      /** @type {function(jQuery.event=)} */
      var endListener = function(event) {
        var idx = propArray.indexOf(event.originalEvent.propertyName);
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
      var promiseResolved = false;
      var resolvePromise = function() {
        if (!promiseResolved)
        {
          jelem.off('transitionend webkitTransitionEnd', endListener);

          resolve(true);
          promiseResolved = true;          
        }
      };

      // For css transition, specify the transition value when applying the toState
      // since we don't want to trigger the transition prematurely.
      if (toState['css'] == null)
      {
        toState['css'] = {};
      }
      toState['css']['transition'] = oj.AnimationUtils._createTransitionValue(transProps, options);

      // Save the orignal style so that we can restore it later if needed
      var effectCount = oj.AnimationUtils._saveStyle(jelem, fromState, toState, options, persistProps || transProps);

      oj.AnimationUtils._applyState(jelem, fromState, effectCount > 1);

      jelem.on('transitionend webkitTransitionEnd', endListener);

      // Add the toState after a delay.  This is necessary to trigger css 
      // transition.  Use setTimeout instead of requestAnimationFrame because 
      // the later is not reliable for triggering transition on Firefox.
      window.setTimeout(function()
      {
        oj.AnimationUtils._applyState(jelem, toState, effectCount > 1);

        // There are situations in which the transitionend event is never
        // fired (e.g. removing the transiton property or setting the display
        // property to none.)
        // Add a timeout to avoid having unresolved promise.
        setTimeout(resolvePromise, oj.AnimationUtils._calcEffectTime(jelem) + 100);
      }, 20);
    }
  );

  return promise.then(function() {
    // Remove any temporary effect class when the promise is fulfilled.
    // Do not remove them in the endListener, since the promise fulfillment
    // callback is not in the same animation frame and occurs later than
    // the endListener.  Because any caller cleanup is done on promise
    // fulfillment, the element may flash if we remove the class too early.

    if (fromState && fromState['addClass'])
    {
      jelem.removeClass(fromState['addClass']);
    }
    
    if (toState && toState['addClass'])
    {
      jelem.removeClass(toState['addClass']);
    }

    oj.AnimationUtils._restoreStyle(jelem);
  });
};

// Save the element style from a property set
oj.AnimationUtils._saveCssValues = function(jelem, css, savedStyle, persistProps)
{
  for (var cssProp in css)
  {
    var prop = oj.AnimationUtils._getCamelCasePropName(cssProp);

    if (!savedStyle.hasOwnProperty(prop) && (!persistProps || persistProps.indexOf(prop) == -1))
    {
      var style = jelem[0].style;

      if (style[prop] === undefined)
      {
        savedStyle[prop] = style[oj.AnimationUtils._getWebkitPropName(prop)];
      }
      else
      {
        savedStyle[prop] = style[prop];
      }
    }
  }
};

// Save the original element style before animating it
oj.AnimationUtils._saveStyle = function(jelem, fromState, toState, options, persistProps)
{
  var savedStyle = jelem.data('_ojSavedStyle') || {};
  var fromStateCss = (fromState && fromState['css']) ? fromState['css'] : {};
  var toStateCss = (toState && toState['css']) ? toState['css'] : {};

  if (!(options && options['persist'] === 'all'))
  {
    persistProps = null;
  }

  oj.AnimationUtils._saveCssValues(jelem, fromStateCss, savedStyle, persistProps);
  oj.AnimationUtils._saveCssValues(jelem, toStateCss, savedStyle, persistProps);

  jelem.data('_ojSavedStyle', savedStyle);

  // Remember how many times this is called to allow composite animation
  var effectCount = jelem.data('_ojEffectCount') || 0;
  jelem.data('_ojEffectCount', ++effectCount);
  
  return effectCount;
};

// Restore the original element style
oj.AnimationUtils._restoreStyle = function(jelem)
{
  var effectCount = jelem.data('_ojEffectCount');

  // In case of composite animation, restore style when the last effect has ended
  if (effectCount > 1)
  {
    jelem.data('_ojEffectCount', effectCount - 1);
  }
  else
  {
    var savedStyle = jelem.data('_ojSavedStyle');
    if (savedStyle)
    {
      jelem.css(savedStyle);
      jelem.removeData('_ojSavedStyle');
      jelem.removeData('_ojEffectCount');
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
  return propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

// Get the corresponding webkit-prefixed property name
oj.AnimationUtils._getWebkitPropName = function(propName)
{
  return 'webkit' + propName.charAt(0).toUpperCase() + propName.slice(1);
};

// Concatenate value for style property that allows multiple values 
oj.AnimationUtils._concatMultiValue = function(jelem, state, propName, defaultPrefix, separator)
{
  if (state['css'][propName])
  {
    propName = oj.AnimationUtils._getCamelCasePropName(propName);

    var currPropValue = jelem[0].style[propName] || jelem[0].style[oj.AnimationUtils._getWebkitPropName(propName)];
    if (currPropValue && currPropValue.indexOf(defaultPrefix) != 0)
    {
      state['css'][propName] = currPropValue + separator + state['css'][propName];
    }
  }
};

oj.AnimationUtils._applyState = function(jelem, state, isComposite)
{
  if (state)
  {
    if (state['css'])
    {
      // For composite animation, we need to concatenate certain property values
      // instead of replacing them
      if (isComposite)
      {
        oj.AnimationUtils._concatMultiValue(jelem, state, 'transform', 'none', ' ');
        oj.AnimationUtils._concatMultiValue(jelem, state, 'transition', 'all', ', ');
      }

      jelem.css(state['css']);    
    }
    
    if (state['addClass'])
    {
      jelem.addClass(state['addClass']);
    }
    
    if (state['removeClass'])
    {
      jelem.removeClass(state['removeClass']);
    }
  }
};

oj.AnimationUtils._calcCssTime = function(jelem, cssProp, prefix)
{
  var propertyStr = jelem.css(cssProp);
  var delayStr = jelem.css(prefix + 'Delay');
  var durationStr = jelem.css(prefix + 'Duration');
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
    var durationMs = (duration.indexOf('ms') > -1) ? parseFloat(duration) : parseFloat(duration) * 1000;
    if (durationMs > 0)
    {
      var delay = delayArray[i % delayLen];
      var delayMs = (delay.indexOf('ms') > -1) ? parseFloat(delay) : parseFloat(delay) * 1000;

      maxTime = Math.max(maxTime, delayMs + durationMs);
    }
  }

  return maxTime;  
};

oj.AnimationUtils._calcEffectTime = function(jelem)
{
  var animationTime = oj.AnimationUtils._calcCssTime(jelem, 'animationName', 'animation');
  var transitionTime = oj.AnimationUtils._calcCssTime(jelem, 'transitionProperty', 'transition');
  
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

/**
 * Internal method for starting an animation.
 * @param {Element} element  the HTML element to animate
 * @param {string} action  a component-defined string that identifies the action starting
 *                         the animation, such as "open", "close", "add", "remove", etc.
 * @param {string|Object|Array} effects  The name of one of the effect methods
 *                        in oj.AnimationUtils, or an object that specifies the
 *                        effect method and its options, such as:
 *                        {'effect': 'fadeOut', 'endOpacity': 0.5}, or an array of the above.
 * @param {jQuery=} component  the component that contains the HTML element
 *                             to animate.  If this is specified, animation events will
 *                             be triggered on the component via jQuery UI _trigger(),
 *                             so that listeners specified as event options will work.
 *                             If this is not specified, animation events will be triggered
 *                             on the animated HTML element via jQuery trigger().
 * @return {Promise} a promise that will be resolved when the animation ends
 * @export
 * @ignore
 */
oj.AnimationUtils.startAnimation = function(element, action, effects, component)
{
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
          resolve(true);
          
          var ui = {'action': action, 'element': element};
          if (component)
          {
            component._trigger('animateEnd', null, ui);
          }
          else
          {
            jelem.trigger('ojanimateend', ui);
          }
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

      // Trigger ojanimatestart event so that app can prevent default animation 
      // and define custom effect in JS
      var event = $.Event('ojanimatestart');
      var ui = {'action': action, 'element': element, 'endCallback': eventCallback};
      var defaultPrevented;

      if (component)
      {
        // _trigger() returns false if preventDefault has been called
        defaultPrevented = !component._trigger('animateStart', null, ui);
      }
      else
      {
        jelem.trigger(event, ui);
        defaultPrevented = event.isDefaultPrevented();
      }

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
      window.setTimeout(function() {
        jelem.addClass(toMarker);
        
        // Set a timeout to resolve the promise.  We can't rely on
        // transitionend event since there can be multiple transition
        // properties, or the transition is never triggered, or the transition
        // is cancelled.
        setTimeout(markerCallback, oj.AnimationUtils._calcEffectTime(jelem) + 100);
      }, 20);
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

oj.AnimationUtils._createTransitionValue = function(transProps, options)
{
  var transValue = '';

  if (transProps)
  {
    for (var i = 0; i < transProps.length; i++)
    {
      var hyphenatedName = oj.AnimationUtils._getHyphenatedPropName(transProps[i]);

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
 * @param {Object} options Options applicable to the specific animation effect.
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
 * @return {Promise} a promise that will be resolved when the animation ends
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
 * @param {Object} options Options applicable to the specific animation effect.
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
 * @return {Promise} a promise that will be resolved when the animation ends
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
 * @param {Object} options Options applicable to the specific animation effect.
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
 * @return {Promise} a promise that will be resolved when the animation ends
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
 * @param {Object} options Options applicable to the specific animation effect.
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
 * @return {Promise} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.collapse = function(element, options)
{
  return oj.AnimationUtils._expandCollapse(element, options, false);
};

oj.AnimationUtils._expandCollapse = function(element, options, isExpand)
{
  options = oj.AnimationUtils._mergeOptions(isExpand ? 'expand' : 'collapse', options);

  var fromState = {};
  var toState = {};

  var direction = options['direction'] || "height";
  var ele = $(element);
  var width = ele.outerWidth();
  var height = ele.outerHeight();

  var maxWidth = ele.css("maxWidth");
  var maxHeight = ele.css("maxHeight");
  var fromCSS = fromState['css'] = {};
  var toStateCSS = toState['css'] = {};

  if(maxWidth !== "none")
  {
    width = maxWidth;
  }

  if(maxHeight !== "none")
  {
    height = maxHeight;
  }

  var transProps = [];  
  if(direction === "both" || direction === "height") 
  {
    var startMaxHeight = options['startMaxHeight'] || (isExpand ? 0 : height);
    var endMaxHeight = options['endMaxHeight'] || (isExpand ? height : 0);

    fromCSS['maxHeight'] = startMaxHeight;
    toStateCSS['maxHeight'] = endMaxHeight;
    transProps.push('maxHeight');
  }

  if(direction === "both" || direction === "width") 
  {
    var startMaxWidth = options['startMaxWidth'] || (isExpand ? 0 : width);
    var endMaxWidth = options['endMaxWidth'] || (isExpand ? width : 0);

    fromCSS['maxWidth'] = startMaxWidth;
    toStateCSS['maxWidth'] = endMaxWidth;
    transProps.push('maxWidth');
  }

  return oj.AnimationUtils._animate(ele[0], fromState, toState, options, transProps);
};

/**
 * Animaton effect method for zooming in a HTML element.
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
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.axis the axis along which to scale the element. Valid values are "x", "y", or "both". Default is "both".
 * @param {string=} options.transformOrigin set the CSS transform-origin property, which controls the anchor point for the zoom. Default is "center".
 * @return {Promise} a promise that will be resolved when the animation ends
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
 * @param {Object} options Options applicable to the specific animation effect.
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
 * @return {Promise} a promise that will be resolved when the animation ends
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
  var ele = $(element);
    
  var scale = axis === "both" ? "scale" : (axis === "x" ? "scaleX" : "scaleY");
  var fromCSS = fromState['css'] = {};
  var toStateCSS = toState['css'] = {};

  fromCSS['transform'] = scale + "(" + (isIn ? 0 : 1) + ") translateZ(0)";
  toStateCSS['transform'] = scale + "(" + (isIn ? 1 : 0) + ") translateZ(0)";

  fromCSS['transformOrigin'] = options['transformOrigin'] || "center";

  return oj.AnimationUtils._animate(ele[0], fromState, toState, options, ['transform']);
};

/**
 * Animaton effect method for sliding in a HTML element.
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
 * @param {string=} options.persist  Valid values are "none" and "all".  Set to "none" to remove the inline style being animated at the end of animation.  
 *                                    Set to "all" to persist the inline style.  Default is "none".
 * @param {string=} options.direction Direction of the slide. Valid values are "left", "top", "right", "bottom", "start", and "end". Default is "start".
 *                                    This option is ignored if either offsetX or offsetY is specified.
 * @param {string=} options.offsetX The offset on the x-axis to translate from. This value must be a number followed by a unit such as "px", "em", etc.
 *                                  If moving in a horizontal direction, default to element width. Otherwise, default to "0px".
 * @param {string=} options.offsetY The offset on the y-axis to translate from. This value must be a number followed by a unit such as "px", "em", etc.
 *                                  If moving in a vertical direction, default to element height. Otherwise, default to "0px".
 * @return {Promise} a promise that will be resolved when the animation ends
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
 * @param {Object} options Options applicable to the specific animation effect.
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
 * @return {Promise} a promise that will be resolved when the animation ends
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
  var ele = $(element);

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
    var outerWidth = ele.outerWidth();
    var outerHeight = ele.outerHeight();
    var isRTL = oj.DomUtils.getReadingDirection() === "rtl";

    switch (direction)
    {
      case 'left':
        offsetX = (isIn ? outerWidth : -outerWidth) + 'px';
        break;
      case 'right':
        offsetX = (isIn ? -outerWidth : outerWidth) + 'px';
        break;
      case 'top':
        offsetY = (isIn ? outerHeight : -outerHeight) + 'px';
        break;
      case 'bottom':
        offsetY = (isIn ? -outerHeight : outerHeight) + 'px';
        break;
      case 'end':
        offsetX = ((isIn ? -outerWidth : outerWidth) * (isRTL ? -1 : 1)) + 'px';
        break;
      default: // 'start'
        offsetX = ((isIn ? outerWidth : -outerWidth) * (isRTL ? -1 : 1)) + 'px';
        break;
    }
  }
  
  if (isIn)
  {
    fromCSS["transform"] = "translate(" + offsetX + "," + offsetY + ") translateZ(0)";
    toStateCSS["transform"] = "translate(0,0) translateZ(0)";
  }
  else
  {
    fromCSS["transform"] = "translate(0,0) translateZ(0)";
    toStateCSS["transform"] = "translate(" + offsetX + "," + offsetY + ") translateZ(0)";
  }

  return oj.AnimationUtils._animate(ele[0], fromState, toState, options, ['transform']);
};

/**
 * Animaton effect method for rippling a HTML element.
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
 * @param {string} options.offsetX Horizontal offset of the ripple center, with a unit of either "px" or "%".
 *                                  If the unit is "px", it specifies the offset in pixels.
 *                                  If the unit is "%", it specifies the offset as a percentage of the element's width.
 * @param {string} options.offsetY Vertical offset of the ripple center, with a unit of either "px" or "%".
 *                                  If the unit is "px", it specifies the offset in pixels.
 *                                  If the unit is "%", it specifies the offset as a percentage of the element's height.
 * @param {string=} options.color Color of the ripple. Default is specified in the "oj-animation-effect-ripple" CSS class.
 * @param {string=} options.diameter Diameter of the ripple, with a unit of either "px" or "%".
 *                                   If the unit is "px", it specifies the diameter in pixels.
 *                                   If the unit is "%", it specifies the diameter as a percentage of either the element's width or height, whichever is less.
 *                                   Default is specified in the "oj-animation-effect-ripple" CSS class.
 * @param {number=} options.startOpacity start opacity of the ripple. Default is specified in the "oj-animation-effect-ripple" CSS class.
 * @param {number=} options.endOpacity end opacity of the ripple. Default is 0.
 * @return {Promise} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.ripple = function(element, options)
{
  options = oj.AnimationUtils._mergeOptions('ripple', options);

  var fromState = {};
  var toState = {};

  var ele = $(element);
 
  var width = ele.outerWidth();
  var height = ele.outerHeight();

  // The rippler need its own container since setting overflow on the target
  // element may not work if the element has no explicit height, which can be
  // the case on buton, listitem, etc.
  var container = $("<div style='position:absolute; overflow:hidden'>");
  var rippler = $("<div class='oj-animation-effect-ripple oj-animation-rippler'>");
  
  // prepend the rippler instead of append so that it doesn't obscure other children
  var position = (ele.css('position') == 'static') ? ele.position() : {'left':0, 'top':0};
  ele.prepend(container); //@HTMLUpdateOK; container is constructed by component code and is not using string passed in through any APIs.
  container.css({'left': position['left'] + 'px', 
                 'top': position['top'] + 'px',
                 'width': width + 'px',
                 'height': height + 'px'});
  
  container.prepend(rippler); //@HTMLUpdateOK; container is constructed by component code and is not using string passed in through any APIs.
  
  var fromCSS = fromState['css'] = {};
  var toStateCSS = toState['css'] = {};

  oj.AnimationUtils._setRippleOptions(fromCSS, rippler, container, options);
  
  fromCSS['transform'] = "scale(0) translateZ(0)";
  fromCSS['opacity'] = options["startOpacity"] || rippler.css('opacity');
  
  toStateCSS['transform'] = "scale(1) translateZ(0)";
  toStateCSS['opacity'] = options["endOpacity"] || 0;
  
  // Always persist the ripple state so that it remains invisible until removed.
  // Otherwise it may re-appear briefly on mobile Safari.
  options['persist'] = 'all';

  return oj.AnimationUtils._animate(rippler[0], fromState, toState, options, ['transform', 'opacity']).
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

  fromCss['transform'] = transform + startAngle + ')';
  fromCss['backfaceVisibility'] = backfaceVisibility;
  fromCss['transformOrigin'] = transformOrigin;

  toCss['transform'] = transform + endAngle + ')';

  // backfaceVisibility and transformOrigin affects the final look of the element,
  // so they should be persisted if the persist option is set.
  return oj.AnimationUtils._animate(element, fromState, toState, options, ['transform'], ['transform', 'backfaceVisibility', 'transformOrigin']);
};

/**
 * Animaton effect method for rotating a HTML element into view.
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
 * @return {Promise} a promise that will be resolved when the animation ends
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
 * @param {Object} options Options applicable to the specific animation effect.
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
 * @return {Promise} a promise that will be resolved when the animation ends
 *
 * @export
 * @memberof oj.AnimationUtils
 */
oj.AnimationUtils.flipOut = function(element, options)
{
  return oj.AnimationUtils._flip(element, options, 'flipOut', '0deg', '180deg');
};

});
