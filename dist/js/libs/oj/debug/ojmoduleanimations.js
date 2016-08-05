/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'promise', 'ojs/ojanimation'], function(oj, ko)
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */


/**
 * A collection of ModuleAnimation implementations that can be specified on the "animation"
 * option of ojModule binding.<br><br>
 * These implementations assume that either the ojModule binding is on a real HTML element
 * or, for ojModule binding on virtual element, each view is contained by a single HTML
 * root element.
 * @namespace
 */
oj.ModuleAnimations = {};

oj.ModuleAnimations._DESCRIPTORS = {
  'coverStart': {
    oldViewClass: 'oj-animation-coverstart',
    newViewClass: 'oj-animation-coverstart',
    newViewOnTop: true
  },
  'coverUp': {
    newViewClass: 'oj-animation-coverup',
    newViewOnTop: true
  },
  'fade': {
    oldViewClass: 'oj-animation-fade',
    newViewClass: 'oj-animation-fade',
    newViewOnTop: false
  },
  'pushStart': {
    oldViewClass: 'oj-animation-revealstart',
    newViewClass: 'oj-animation-coverstart',
    newViewOnTop: false
  },
  'pushEnd': {
    oldViewClass: 'oj-animation-revealend',
    newViewClass: 'oj-animation-coverend',
    newViewOnTop: false
  },
  'revealDown': {
    oldViewClass: 'oj-animation-revealdown',
    newViewOnTop: false
  },
  'revealEnd': {
    oldViewClass: 'oj-animation-revealend',
    newViewClass: 'oj-animation-revealend',
    newViewOnTop: false
  },
  'zoomIn': {
    newViewClass: 'oj-animation-zoomin',
    newViewOnTop: true
  },
  'zoomOut': {
    oldViewClass: 'oj-animation-zoomout',
    newViewOnTop: false
  }
};

/**
 * Main utility function for starting a transition or animation on an element.
 * For transition:
 * 1. The transition property and the initial value of the property being 
 *    animated must be specified in the ".{baseClass}.oj-{action}" css rule.
 * 2. The final value of the property being animated must be specified in the
 *    ".{baseClass}.oj-{action}.oj-{action}-active" css rule.
 * For animation:
 * 1. The animation property must be specified in the ".{baseClass}.oj-{action}"
 *    css rule.
 * 2. No ".{baseClass}.oj-{action}.oj-{action}-active" css rule is needed, as 
 *    the keyframes for the animation should have both initial and final values.
 * @private
 */
oj.ModuleAnimations._animateElement = function(element, baseClass, action)
{
  var jelem = $(element);

  var promise = new Promise(
    function(resolve, reject) {
      var fromClass = 'oj-' + action;
      var toClass = fromClass + '-active';

      jelem.addClass(baseClass);
      jelem.addClass(fromClass);
      
      // Add the to-class on the next animation frame.  This is necessary
      // for css transition so that the browser can detect a property change
      // and start the transition.
      window.requestAnimationFrame(function() {
        jelem.addClass(toClass);
      });

      var endListener = function() {
        // No need to remove the classes or listener from the element since
        // the element is temporary and will be removed from the DOM
        resolve(true);
      };
      var duration = jelem.css('animationDuration') || jelem.css('webkitAnimationDuration');
      if (duration && duration != '0s')
      {
        jelem.on("animationend webkitAnimationEnd", endListener);
      }
      else
      {
        duration = jelem.css('transitionDuration') || jelem.css('webkitTransitionDuration');
        if (duration && duration != '0s')
        {
          jelem.on("transitionend webkitTransitionEnd", endListener);
        }
        else
        {
          // If there is no animation, the promise is resolved.
          resolve(true);
        }
      }

    }
  );

  return promise;
};

oj.ModuleAnimations._animateView = function(oldElement, newElement, animateName)
{
  var promises = [];
  var descriptor = oj.ModuleAnimations._DESCRIPTORS[animateName];

  if (oldElement && descriptor && descriptor.oldViewClass)
  {
    promises.push(oj.ModuleAnimations._animateElement(oldElement, descriptor.oldViewClass, 'leave'));
  }

  if (newElement && descriptor && descriptor.newViewClass)
  {
    promises.push(oj.ModuleAnimations._animateElement(newElement, descriptor.newViewClass, 'enter'));
  }

  return Promise.all(promises);
};

oj.ModuleAnimations._addContainedElements = function(node, roots)
{
  var child = ko.virtualElements.firstChild(node);
  while(child)
  {
    if (child.nodeType == 1)
    {
      roots.push(child);
    }
    else if (child.nodeType == 8)
    {
      this._addContainedElements(child, roots);
    }

    child = ko.virtualElements.nextSibling(child);
  }
};

oj.ModuleAnimations._cacheVirtualViewRoot = function(context, root)
{
  context['_ojOldRoot'] = root;
};

oj.ModuleAnimations._getVirtualViewRoot = function(context)
{
  return context['_ojOldRoot'];
};

oj.ModuleAnimations._defaultCanAnimate = function(context)
{
  // No animation for the initial module display
  if (context['isInitial'])
  {
    return false;
  }

  // We can animate if the module binding is on a real element
  if (context['node'].nodeType == 1)
  {
    return true;
  }

  // If the module binding is on a comment node, we can animate if the view
  // is single-rooted
  if (context['node'].nodeType == 8)
  {
    var children = [];
    oj.ModuleAnimations._addContainedElements(context['node'], children);
    if (children && children.length == 1)
    {
      oj.ModuleAnimations._cacheVirtualViewRoot(context, children[0]);
      return true;
    }
  }

  return false;
};

oj.ModuleAnimations._getOldView = function(context)
{
  var oldView;

  if (context['node'].nodeType == 1)
  {
    oldView = context['node'];
  }
  else if (context['node'].nodeType == 8)
  {
    oldView = oj.ModuleAnimations._getVirtualViewRoot(context);
  }

  return oldView;
};

oj.ModuleAnimations._createViewParent = function(oldView)
{
  var viewport = $(document.createElement('div'));
  var cssStyle = {'position': 'absolute',
                  'height': oldView.offsetHeight + 'px',
                  'width': oldView.offsetWidth + 'px',
                  'left': oldView.offsetLeft + 'px',
                  'top': oldView.offsetTop + 'px'};

  viewport.appendTo(oldView.offsetParent);
  viewport.css(cssStyle);
  viewport.addClass('oj-animation-host-viewport');
  
  var host = document.createElement('div');
  host.className = 'oj-animation-host';

  viewport.append(host);
  
  return host;
};

oj.ModuleAnimations._defaultPrepareAnimation = function(context, animateName)
{
  var viewParents = {};
  var descriptor = oj.ModuleAnimations._DESCRIPTORS[animateName];
  var oldView = oj.ModuleAnimations._getOldView(context);
  
  if (descriptor)
  {
    if (descriptor.newViewClass && !descriptor.newViewOnTop)
    {
      viewParents['newViewParent'] = oj.ModuleAnimations._createViewParent(oldView);
    }
    
    if (descriptor.oldViewClass)
    {
      viewParents['oldViewParent'] = oj.ModuleAnimations._createViewParent(oldView);
    }

    if (descriptor.newViewClass && descriptor.newViewOnTop)
    {
      viewParents['newViewParent'] = oj.ModuleAnimations._createViewParent(oldView);
    }    
  }

  return viewParents;  
};

oj.ModuleAnimations._defaultAnimate = function(context, animateName)
{
  var oldViewHost = context['oldViewParent'];
  var newViewHost = context['newViewParent'];

  var animatePromise = oj.ModuleAnimations._animateView(oldViewHost, newViewHost, animateName);

  return animatePromise.then(function(result) {
    oj.ModuleAnimations._postAnimationProcess(context);
  });
};

oj.ModuleAnimations._removeViewParent = function(context, hostProp)
{
  var host = context[hostProp];
  
  if (host)
  {
    var viewport = host.parentNode; 
    if (viewport && viewport.parentNode)
    {
      viewport.parentNode.removeChild(viewport);
    }
  }
};

oj.ModuleAnimations._postAnimationProcess = function(context)
{
  context['removeOldView']();
  context['insertNewView']();

  oj.ModuleAnimations._removeViewParent(context, 'newViewParent');
  oj.ModuleAnimations._removeViewParent(context, 'oldViewParent');
};

oj.ModuleAnimations._getImplementation = function(animateName)
{
  return {
    'canAnimate': oj.ModuleAnimations._defaultCanAnimate,
    'prepareAnimation': function(context) {
      return oj.ModuleAnimations._defaultPrepareAnimation(context, animateName);
    },
    'animate': function(context) {
      return oj.ModuleAnimations._defaultAnimate(context, animateName);
    }
  };
};

oj.ModuleAnimations._getNavigateMethod = function(context, navigationType)
{
  if (oj.ModuleAnimations._navigateMethods == null)
  {
    oj.ModuleAnimations._navigateMethods = oj.ThemeUtils.parseJSONFromFontFamily('oj-animation-navigate-methods');
  }

  if (oj.ModuleAnimations._navigateMethods)
  {
    return oj.ModuleAnimations._navigateMethods[navigationType];
  }
  
  return null;
};

oj.ModuleAnimations._navigateCanAnimate = function(context, navigationType)
{
  return oj.ModuleAnimations._getNavigateMethod(context, navigationType) &&
         oj.ModuleAnimations._defaultCanAnimate(context);
};

oj.ModuleAnimations._navigatePrepareAnimation = function(context, navigationType)
{
  var animateName = oj.ModuleAnimations._getNavigateMethod(context, navigationType);
  return oj.ModuleAnimations._defaultPrepareAnimation(context, animateName)
};

oj.ModuleAnimations._navigateAnimate = function(context, navigationType)
{
  var animateName = oj.ModuleAnimations._getNavigateMethod(context, navigationType);
  return oj.ModuleAnimations._defaultAnimate(context, animateName);
};

oj.ModuleAnimations._getNavigateImplementation = function(navigationType)
{
  return {
    'canAnimate': function(context) {
      return oj.ModuleAnimations._navigateCanAnimate(context, navigationType);
    },
    'prepareAnimation': function(context) {
      return oj.ModuleAnimations._navigatePrepareAnimation(context, navigationType);
    },
    'animate': function(context) {
      return oj.ModuleAnimations._navigateAnimate(context, navigationType);
    }
  };
};

/**
 * ModuleAnimation implementation for changing views by
 * sliding the new view in to cover the old view.<br><br>
 * This will take the text direction of the page into account.  On "ltr" page,
 * the new view will slide to the left.  On "rtl" page, it will slide to the
 * right.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.coverStart = oj.ModuleAnimations._getImplementation('coverStart');

/**
 * ModuleAnimation implementation for changing views by
 * sliding the old view out to reveal the new view.<br><br>
 * This will take the text direction of the page into account.  On "ltr" page,
 * the old view will slide to the right.  On "rtl" page, it will slide to the
 * left.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.revealEnd = oj.ModuleAnimations._getImplementation('revealEnd');

/**
 * ModuleAnimation implementation for changing views by
 * sliding the new view up to cover the old view.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.coverUp = oj.ModuleAnimations._getImplementation('coverUp');

/**
 * ModuleAnimation implementation for changing views by
 * sliding the old view down to reveal the new view.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.revealDown = oj.ModuleAnimations._getImplementation('revealDown');

/**
 * ModuleAnimation implementation for changing views by
 * zooming in on the new view.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.zoomIn = oj.ModuleAnimations._getImplementation('zoomIn');

/**
 * ModuleAnimation implementation for changing views by
 * zooming out on the old view.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.zoomOut = oj.ModuleAnimations._getImplementation('zoomOut');

/**
 * ModuleAnimation implementation for changing views by
 * fading in the new view and fading out the old view.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.fade = oj.ModuleAnimations._getImplementation('fade');

/**
 * ModuleAnimation implementation for changing views by
 * having the new view push out the old view towards the start of the reading order.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.pushStart = oj.ModuleAnimations._getImplementation('pushStart');

/**
 * ModuleAnimation implementation for changing views by
 * having the new view push out the old view towards the end of the reading order.
 * @export
 * @memberof oj.ModuleAnimations
 */
oj.ModuleAnimations.pushEnd = oj.ModuleAnimations._getImplementation('pushEnd');

/**
 * ModuleAnimation implementation for navigating to child views by
 * using animations that are dependent on the platform theme.
 * <p>The default animations for each platform theme are as follows:</p>
 * <ul>
 *   <li>Web theme: coverStart</li>
 *   <li>iOS theme: coverStart</li>
 *   <li>Android theme: coverUp</li>
 *   <li>Windows theme: zoomIn</li>
 * </ul>
 * <p>The default animation can be changed with the following theme variable:<br>
 * <code class="prettyprint">$animationNavChildDefault</code>: specify
 * the animation for navigating to child views.<br>
 * <p>Valid values are the names of specific animation implementations such as
 * "coverStart".</p>
 * @export
 * @memberof oj.ModuleAnimations
 * @example <caption>Set the default in the theme (SCSS) :</caption>
 * $animationNavChildDefault:  coverStart  !default;
 */
oj.ModuleAnimations.navChild = oj.ModuleAnimations._getNavigateImplementation('navChild');

/**
 * ModuleAnimation implementation for navigating to parent views by
 * using animations that are dependent on the platform theme.
 * <p>The default animations for each platform theme are as follows:</p>
 * <ul>
 *   <li>Web theme: revealEnd</li>
 *   <li>iOS theme: revealEnd</li>
 *   <li>Android theme: revealDown</li>
 *   <li>Windows theme: zoomOut</li>
 * </ul>
 * <p>The default animation can be changed with the following theme variable:<br>
 * <code class="prettyprint">$animationNavParentDefault</code>: specify
 * the animation for navigating to parent views.</p>
 * <p>Valid values are the names of specific animation implementations such as
 * "revealEnd".</p>
 * @export
 * @memberof oj.ModuleAnimations
 * @example <caption>Set the default in the theme (SCSS) :</caption>
 * $animationNavParentDefault:  revealEnd  !default;
 */
oj.ModuleAnimations.navParent = oj.ModuleAnimations._getNavigateImplementation('navParent');

/**
 * ModuleAnimation implementation for drilling in to views by
 * using animations that are dependent on the platform theme.
 * <p>The default animations for each platform theme are as follows:</p>
 * <ul>
 *   <li>Web theme: coverStart</li>
 *   <li>iOS theme: coverStart</li>
 *   <li>Android theme: coverUp</li>
 *   <li>Windows theme: zoomIn</li>
 * </ul>
 * @export
 * @memberof oj.ModuleAnimations
 * @deprecated This is deprecated.  Please use <a href="#navChild">navChild</a> instead.
 */
oj.ModuleAnimations.drillIn = oj.ModuleAnimations.navChild;

/**
 * ModuleAnimation implementation for drilling out of views by
 * using animations that are dependent on the platform theme.
 * <p>The default animations for each platform theme are as follows:</p>
 * <ul>
 *   <li>Web theme: revealEnd</li>
 *   <li>iOS theme: revealEnd</li>
 *   <li>Android theme: revealDown</li>
 *   <li>Windows theme: zoomOut</li>
 * </ul>
 * @export
 * @memberof oj.ModuleAnimations
 * @deprecated This is deprecated.  Please use <a href="#navParent">navParent</a> instead.
 */
oj.ModuleAnimations.drillOut = oj.ModuleAnimations.navParent;

/**
 * ModuleAnimation implementation for navigating to sibling views earlier in the reading order by
 * using animations that are dependent on the platform theme.
 * <p>The default animations for each platform theme are as follows:</p>
 * <ul>
 *   <li>Web theme: none</li>
 *   <li>iOS theme: none</li>
 *   <li>Android theme: pushEnd</li>
 *   <li>Windows theme: pushEnd</li>
 * </ul>
 * <p>The default animation can be changed with the following theme variable:<br>
 * <code class="prettyprint">$animationNavSiblingEarlierDefault</code>: specify
 * the animation for navigating to sibling views earlier in the reading order.</p>
 * <p>Valid values are the names of specific animation implementations such as
 * "pushEnd".</p>
 * @export
 * @memberof oj.ModuleAnimations
 * @example <caption>Set the default in the theme (SCSS) :</caption>
 * $animationNavSiblingEarlierDefault:  pushEnd  !default;
 */
oj.ModuleAnimations.navSiblingEarlier = oj.ModuleAnimations._getNavigateImplementation('navSiblingEarlier');

/**
 * ModuleAnimation implementation for navigating to sibling views later in the reading order by
 * using animations that are dependent on the platform theme.
 * <p>The default animations for each platform theme are as follows:</p>
 * <ul>
 *   <li>Web theme: none</li>
 *   <li>iOS theme: none</li>
 *   <li>Android theme: pushStart</li>
 *   <li>Windows theme: pushStart</li>
 * </ul>
 * <p>The default animation can be changed with the following theme variable:<br>
 * <code class="prettyprint">$animationNavSiblingLaterDefault</code>: specify
 * the animation for navigating to sibling views later in the reading order.</p>
 * <p>Valid values are the names of specific animation implementations such as
 * "pushStart".</p>
 * @export
 * @memberof oj.ModuleAnimations
 * @example <caption>Set the default in the theme (SCSS) :</caption>
 * $animationNavSiblingLaterDefault:  pushStart  !default;
 */
oj.ModuleAnimations.navSiblingLater = oj.ModuleAnimations._getNavigateImplementation('navSiblingLater');

/**
  * Returns an implementation of ModuleAnimation interface that switches between different animation implementations
  *
  * @param {Function} callback - a callback function whose return value should be a string containing one of the animation types
  * supported by oj.ModuleAnimations. The function will be passed a context object with the keys detailed below:
  * <ul>
  * <li>node - a DOM node where the ojModule binding is attached. This may be a virtual/comment node</li>
  * <li>valueAccessor - value accessor for the binding</li>
  * <li>isInitial  - true if the initial View is about to be displayed, false otherwise</li>
  * <li>oldViewModel - the instance of the ViewModel for the old View</li>
  * <li>newViewModel  - the instance of the ViewModel for the new View</li>
  * </ul>
  *
  * @return {Object} switching implementation of the ModuleAnimation interface
  * @export
  */
oj.ModuleAnimations.switcher = function(callback)
{
  /**
   * @constructor
   * @private
   */
  var AnimateProxy = function()
  {
    var _delegate;

    function _getDelegateInvoker(name)
    {
      var invoker = function(context)
      {
        return _delegate[name].call(_delegate, context);
      }
      return invoker;
    };

    var _self  = this;
    var _canAnimate = 'canAnimate';

    this[_canAnimate] = function(context)
    {
      // Get the 'delegate' animation
      var type = callback(context);
      _delegate = (type == null ? null : oj['ModuleAnimations'][type]);
      if (!_delegate)
      {
        return false;
      }

      // Define the rest of the methods on the fly if we have a delegate
      var methods = ['prepareAnimation', 'animate'];
      for (var i=0; i<methods.length; i++)
      {
        var method = methods[i];
        _self[method] = _getDelegateInvoker(method);
      }

      return _getDelegateInvoker(_canAnimate)(context);
    };

  };

  return new AnimateProxy();
};

/**
  * Create and return a ModuleAnimation implementation that combines base effects from {@link oj.AnimationUtils}
  *
  * @param {null|string|Object} oldViewEffect - an animation effect for the outgoing view.<br><br>
  *                              If this is null, no animation will be applied.<br>
  *                              If this is a string, it should be one of the effect method names in oj.AnimationUtils.<br>
  *                              If this is an object, it should describe the effect:
  * @param {string} oldViewEffect.effect - the name of an effect method in oj.AnimationUtils
  * @param {*=} oldViewEffect.effectOption - any option applicable to the specific animation effect<br><br>
  *                                                 Replace <i>effectOption</i> with the actual option name.  More than one option can be specified.  
  *                                                 Refer to the method description in {@link oj.AnimationUtils} for available options.
  * @param {null|string|Object} newViewEffect - an animation effect for the incoming view.<br><br>
  *                                             This is in the same format as oldViewEffect.
  * @param {boolean} newViewOnTop - specify true to initially create the new view on top of the old view. 
  *                  This is needed for certain effects such as sliding the new view in to cover the old view.
  *                  Default is false.
  * @return {Object} an implementation of the ModuleAnimation interface
  * @export
  * 
  * @example <caption>Create a custom ModuleAnimation that fades out old view by 50% and slides in the new view:</caption>
  * var customAnimation = oj.ModuleAnimations.createAnimation({"effect":"fadeOut", "endOpacity":0.5}, {"effect":"slideIn", "direction":"end"}, true);
  */
oj.ModuleAnimations.createAnimation = function(oldViewEffect, newViewEffect, newViewOnTop)
{
  return {
    'canAnimate': oj.ModuleAnimations._defaultCanAnimate,
    'prepareAnimation': function(context) {
      var viewParents = {};
      var oldView = oj.ModuleAnimations._getOldView(context);
      
      if (newViewEffect && !newViewOnTop)
      {
        viewParents['newViewParent'] = oj.ModuleAnimations._createViewParent(oldView);
      }
      
      if (oldViewEffect)
      {
        viewParents['oldViewParent'] = oj.ModuleAnimations._createViewParent(oldView);
      }

      if (newViewEffect && newViewOnTop)
      {
        viewParents['newViewParent'] = oj.ModuleAnimations._createViewParent(oldView);
      }    

      return viewParents;  
    },
    'animate': function(context) {
      var oldViewHost = context['oldViewParent'];
      var newViewHost = context['newViewParent'];

      var promises = [];

      if (oldViewHost && oldViewEffect)
      {
        promises.push(oj.AnimationUtils.startAnimation(oldViewHost, 'close', oldViewEffect));
      }

      if (newViewHost && newViewEffect)
      {
        promises.push(oj.AnimationUtils.startAnimation(newViewHost, 'open', newViewEffect));
      }

      var animatePromise = Promise.all(promises);

      return animatePromise.then(function(result) {
        oj.ModuleAnimations._postAnimationProcess(context);
      });
    }
  };
};

});
