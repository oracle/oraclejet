/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojlogger', 'ojs/ojdomutils', 'ojs/ojpreact-patch', 'jqueryui-amd/position', 'ojs/ojcontext', 'preact/jsx-runtime', 'preact', 'ojs/ojcustomelement-utils'], function (exports, oj, $, Components, Logger, DomUtils, ojpreactPatch, position, Context, jsxRuntime, preact, ojcustomelementUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

  /**
   * Invokes the callback function with the touchstart event if the touch sequence
   * resulted in a "Tap".  The goal is to distinguish a touchstart that doesn't result
   * in scroll.
   * @extends {oj.Object}
   * @public
   * @constructor
   * @class SimpleTapRecognizer
   * @since 1.1.0
   * @param {function(!Event)} tapCallback function invoked when a Tap is detected
   * @ignore
   * @ojtsignore
   */
  const SimpleTapRecognizer = function (tapCallback) {
    this._tapCallback = tapCallback;
    this.Init();
  };
  oj._registerLegacyNamespaceProp('SimpleTapRecognizer', SimpleTapRecognizer);

  oj.Object.createSubclass(SimpleTapRecognizer, oj.Object, 'oj.SimpleTapRecognizer');

  /**
   * Sets up the touch listeners ready to fire the callback.
   * @override
   * @instance
   * @protected
   */
  SimpleTapRecognizer.prototype.Init = function () {
    SimpleTapRecognizer.superclass.Init.call(this);
    var eventHandlerCallback = this._eventHandler.bind(this);
    this._eventHandlerCallback = eventHandlerCallback;

    var docElement = document.documentElement;
    var eventType;
    for (var i = 0; i < SimpleTapRecognizer._TOUCHEVENTS.length; i++) {
      eventType = SimpleTapRecognizer._TOUCHEVENTS[i];
      if (eventType === 'touchstart' || eventType === 'touchmove') {
        docElement.addEventListener(eventType, eventHandlerCallback, {
          passive: false,
          capture: true
        });
      } else {
        docElement.addEventListener(eventType, eventHandlerCallback, true);
      }
    }
  };

  /**
   * Keeps reference to the last touchstart event.  If at touchend is encountered before a
   * touchmove or touchcancel, then fire the tap callback with the touchstart event.
   * @private
   * @param {Event} event native touch event
   */
  SimpleTapRecognizer.prototype._eventHandler = function (event) {
    var tapCallback = this._tapCallback;
    var eventType = event.type;
    if (eventType === 'touchstart') {
      this._touchStartEvent = event;
      this._touchStartEvent._tapStart = new Date().getTime();
    } else if (eventType === 'touchmove' || eventType === 'touchcancel') {
      this._touchStartEvent = null;
    } else if (eventType === 'touchend') {
      if (this._touchStartEvent) {
        var tapStart = this._touchStartEvent._tapStart;
        if (!isNaN(tapStart)) {
          var now = new Date().getTime();
          // if the period of ms between touchstart and touchend is less than the long touch
          // thresshold, invoke the callback
          if (now - tapStart < SimpleTapRecognizer._PRESSHOLDTHRESSHOLD) {
            tapCallback(this._touchStartEvent);
          }
        } else {
          tapCallback(this._touchStartEvent);
        }
      }

      this._touchStartEvent = null;
    }
  };

  /**
   * Unregisters touch listeners and deletes references to callbacks.
   * @public
   */
  SimpleTapRecognizer.prototype.destroy = function () {
    this._tapCallback = null;

    var eventHandlerCallback = this._eventHandlerCallback;
    this._eventHandlerCallback = null;

    var docElement = document.documentElement;
    var eventType;
    for (var i = 0; i < SimpleTapRecognizer._TOUCHEVENTS.length; i++) {
      eventType = SimpleTapRecognizer._TOUCHEVENTS[i];
      if (eventType === 'touchstart' || eventType === 'touchmove') {
        docElement.removeEventListener(eventType, eventHandlerCallback, {
          passive: false,
          capture: true
        });
      } else {
        docElement.removeEventListener(eventType, eventHandlerCallback, true);
      }
    }
  };

  /**
   * Touch events that we are interested in listening for.
   *
   * @const
   * @private
   * @type {Array.<string>}
   */
  SimpleTapRecognizer._TOUCHEVENTS = ['touchstart', 'touchmove', 'touchcancel', 'touchend'];

  /**
   * Period of milliseconds for determining a long tap.  The normal threshold is 750ms.
   * The auto dismissal listeners for capture events versus bubble by the rest of the
   * framework.  Make the window for determining a long tap shorter than normal
   *
   * @const
   * @private
   * @type {number}
   */
  SimpleTapRecognizer._PRESSHOLDTHRESSHOLD = 700;

  /* jslint browser: true*/

  /**
   * Internal framework service for managing popup instances.
   *
   * @extends {oj.Object}
   * @protected
   * @constructor
   * @since 1.1.0
   * @class oj.PopupService
   * @ignore
   * @ojtsignore
   */
  const PopupService = function () {
    this.Init();
  };
  oj._registerLegacyNamespaceProp('PopupService', PopupService);

  oj.Object.createSubclass(PopupService, oj.Object, 'oj.PopupService');

  // Classes defined here to avoid ESLint no-use-before-define requirement
  const PopupServiceImpl = function () {
    this.Init();
  };
  const ZOrderUtils = {};

  /**
   * @override
   * @instance
   * @protected
   */
  PopupService.prototype.Init = function () {
    PopupService.superclass.Init.call(this);
  };

  /**
   * @param {Object=} options used by the factory method for service instantiation
   * @return {!oj.PopupService} singleton instance of the manager
   * @public
   */
  // eslint-disable-next-line no-unused-vars
  PopupService.getInstance = function (options) {
    // in the future we might need a JET Island impl
    if (!PopupService._popupService) {
      PopupService._popupService = new PopupServiceImpl();
    }
    return PopupService._popupService;
  };

  /**
   * @param {!Object.<PopupService.OPTION, ?>} options property bag for opening the popup
   * @return {void}
   * @instance
   * @public
   */
  // eslint-disable-next-line no-unused-vars
  PopupService.prototype.open = function (options) {
    oj.Assert.failedInAbstractFunction();
  };

  /**
   * @param {!Object.<PopupService.OPTION, ?>} options property bag for closing the popup
   * @return {void}
   * @instance
   * @public
   */
  // eslint-disable-next-line no-unused-vars
  PopupService.prototype.close = function (options) {
    oj.Assert.failedInAbstractFunction();
  };

  /**
   * @param {!Object.<PopupService.OPTION, ?>} options property bag to change
   * the state of the target popup.
   * @return {void}
   * @instance
   * @public
   */
  // eslint-disable-next-line no-unused-vars
  PopupService.prototype.changeOptions = function (options) {
    oj.Assert.failedInAbstractFunction();
  };

  /**
   * @param {!jQuery} popup to target triggering the event on decendents
   * @param {!PopupService.EVENT} event to trigger
   * @param {Array=} argsArray to pass to the associated callback for the event
   * @return {void}
   * @instance
   * @public
   */
  // eslint-disable-next-line no-unused-vars
  PopupService.prototype.triggerOnDescendents = function (popup, event, argsArray) {
    oj.Assert.failedInAbstractFunction();
  };

  /**
   * @return {void}
   * @instance
   * @public
   */
  PopupService.prototype.destroy = function () {
    PopupService._popupService = null;
  };

  /**
   * Dialog modality states.
   * @enum {string}
   * @public
   * @ojtsignore
   */
  PopupService.MODALITY = {
    /** Type of popup that doesn't support modality */
    NONE: 'none',
    /** Dialog that that blocks user input of the primary window.*/
    MODAL: 'modal',
    /** Type of dialog that doesn't block user input of the primary window */
    MODELESS: 'modeless'
  };

  /**
   * Event names used to identify the {@link PopupService.OPTION.EVENT} option
   * property.
   * @enum {string}
   * @public
   * @ojtsignore
   */
  PopupService.EVENT = {
    /**
     * Event called by the popup service when the surrogate is removed in the document
     * resulting in the popup getting implicitly closed and associated bound element
     * is removed */
    POPUP_REMOVE: 'ojPopupRemove',
    /**
     * Event called when a parent popup is closed causing implicit closure of
     * descendent popups.
     */
    POPUP_CLOSE: 'ojPopupClose',
    /**
     * Event called on when a parent popup is refreshed triggering a cascade
     * refresh on children.
     */
    POPUP_REFRESH: 'ojPopupRefresh',
    /**
     * Event called to enforce auto dismissal rules specific to each popup category.
     */
    POPUP_AUTODISMISS: 'ojPopupAutoDismiss',
    /**
     * Event called before the popup is open but after it has been reparented into the
     * zorder container.  The callback should be used for implementing open animation.
     * The callback function should return a Promise if animation is reqired or void/undefined
     * if no animation is necessary. The callback is passed the open options
     * {!Object.<PopupService.OPTION, ?>} as the only argument.
     * @since 3.0.0
     */
    POPUP_BEFORE_OPEN: 'ojPopupBeforeOpen',
    /**
     * Event called after the popup is open. The callback should implement component
     * open finalization actions such as triggering an open event.  The resultant of
     * the callback function is void.  The callback is passed the
     * open options {!Object.<PopupService.OPTION, ?>} as the only argument.
     */
    POPUP_AFTER_OPEN: 'ojPopupAfterOpen',
    /**
     * Event called before the popup is close.  When invoked, the popup dom is still
     * located within the zorder container.  The callback is a good place to implement
     * close animation. The callback should return a Promise if animation is required
     * or void/undefined if no animation is required.  The callback is passed the
     * close options {!Object.<PopupService.OPTION, ?>} as the only argument.
     * @since 3.0.0
     */
    POPUP_BEFORE_CLOSE: 'ojPopupBeforeClose',
    /**
     * Event called after the popup is closed and reparented back into its original
     * location within the document.  The callback is for close finalization logic.
     * It's a good places to trigger a component close event. The resultant of the
     * callback is expected to be void. The callback is passed the
     * close options {!Object.<PopupService.OPTION, ?>} as the only argument.
     * @since 3.0.0
     */
    POPUP_AFTER_CLOSE: 'ojPopupAfterClose'
  };

  /**
   * Layer level used to identify the {@link PopupService.OPTION.LAYER_LEVEL} option
   * property.
   * @enum {string}
   * @public
   * @ojtsignore
   */
  PopupService.LAYER_LEVEL = {
    /**
     * Option used by dialogs.  Dialogs are always top rooted.
     */
    TOP_LEVEL: 'topLevel',
    /**
     * The default layer option.  Popups will be reparented to the nearest ancestor layer defined
     * relative to the associated {@link PopupService.OPTION.LAUNCHER}.
     */
    NEAREST_ANCESTOR: 'nearestAncestor'
  };

  /**
   * Property names in the options property bag passed to popup service api.
   * @enum {string}
   * @public
   * @see oj.PopupService#close
   * @see oj.PopupService#open
   * @ojtsignore
   */
  PopupService.OPTION = {
    /**
     * Parameter holding the jQuery element that is the root of the popup.  This
     * element is reparented into the zorder container when open. It is a required
     * option.
     */
    POPUP: 'popup',
    /**
     * Map of event names to callbacks.  The event names are defined by the
     * {@link PopupService.EVENT} enumerated type.
     */
    EVENTS: 'events',
    /**
     * Defines the modal state of a popup.  The value of this attribute is defined
     * by the {@link PopupService.MODALITY} enumeration.
     */
    MODALITY: 'modality',
    /**
     * The jQuery element that is associated with the popup being open.  The launcher
     * is used to find the target popups reparented location within the zorder
     * container when open.  This is an optional parameter.  Dialogs don't require a launcher.
     */
    LAUNCHER: 'launcher',
    /**
     * The jQuery UI position object that defines where the popup should be aligned.
     * This is an optional parameter.
     */
    POSITION: 'position',
    /**
     * The CSS selector names applied to the layer for the target type of popup.  These
     * selectors will define the stacking context for the popup and its children.  Multiple
     * selector names should be delimited by a space similar to the syntax for the jquery
     * addClass API.  This option is required.
     */
    LAYER_SELECTORS: 'layerSelectors',
    /**
     * The initial level that the popup will be reparented to when open.  Dialogs are reparented
     * into the top level.  Other types of popups will be parented to their nearest ancestor layer.
     * The values of this attribute are defined by {@link PopupService.LAYER_LEVEL}.
     */
    LAYER_LEVEL: 'layerLevel',
    /**
     * General purpose context that the "open" and "close" can add to the options and it will be
     * passed thru to the corresponding "before" and "after" operations. Use this context to pass
     * variables declared locally in the open to the associated before and after
     * callbacks.
     * @since 3.0.0
     */
    CONTEXT: 'context',

    /**
     * Indicates the component with the associated popup was instantiated as a custom element.
     * This switch determines how the associated surrogate will be created.
     * @since 4.0.0
     */
    CUSTOM_ELEMENT: 'customElement'
  };

  oj.__registerWidget('oj.ojSurrogate', $.oj.baseComponent, {
    version: '1.0.0',
    widgetEventPrefix: 'oj',
    options: {
      beforeDestroy: null
    },
    _ComponentCreate: function () {
      this._super();
      this.element.uniqueId();
    },
    _invokeBeforeDestroy: function () {
      var callback = this.options.beforeDestroy;
      this.options.beforeDestroy = null;
      if (callback) {
        callback();
      }
    },
    _destroy: function () {
      this._invokeBeforeDestroy();
      this.element.removeUniqueId();
      this._super();
    },
    _NotifyDetached: function () {
      this._invokeBeforeDestroy();
      this._super();
    }
  });

  var ojSurrogateMeta = {
    properties: {
      beforeDestroy: {
        type: 'function'
      }
    },
    extension: {
      _WIDGET_NAME: 'ojSurrogate'
    }
  };
  oj.CustomElementBridge.register('oj-surrogate', { metadata: ojSurrogateMeta });

  oj._registerLegacyNamespaceProp('PopupServiceImpl', PopupServiceImpl);

  oj.Object.createSubclass(PopupServiceImpl, PopupService, 'oj.PopupServiceImpl');

  /**
   * Establishes a popup to be open and managed by the framework.  Managed popups will
   * by reparented to the zorder container appended to the document body.  The
   * location within that container is determined by the launcher or modality options.
   *
   * @param {!Object.<PopupService.OPTION, ?>} options property bag for opening the popup
   * @return {void}
   * @instance
   * @public
   * @override
   */
  PopupServiceImpl.prototype.open = function (options) {
    oj.Assert.assertObject(options);

    /** @type {!jQuery} */
    var popup = $(options[PopupService.OPTION.POPUP]);
    oj.Assert.assertPrototype(popup, $);

    // Trying to open a popup that is either already opening, open or closing.
    // Evaulate if global dom listeners are still needed and ignore the request.
    // This is generally and indicator something wacky has happened that needs recovery.
    var status = ZOrderUtils.getStatus(popup);
    if (
      !(
        status === ZOrderUtils.STATUS.UNKNOWN ||
        status === ZOrderUtils.STATUS.BEFORE_OPEN ||
        status === ZOrderUtils.STATUS.CLOSE
      )
    ) {
      this._assertEventSink();
      return;
    }

    /** @type {jQuery} */
    var launcher = $(options[PopupService.OPTION.LAUNCHER]);
    oj.Assert.assertPrototype(launcher, $);

    /** @type {Object} */
    var position = options[PopupService.OPTION.POSITION];
    oj.Assert.assertObjectOrNull(position);

    /** @type {!Object.<PopupService.EVENT, function(...)>} **/
    var events = options[PopupService.OPTION.EVENTS];
    oj.Assert.assertObject(events);

    var modality = options[PopupService.OPTION.MODALITY];
    if (
      !modality ||
      !(PopupService.MODALITY.MODELESS === modality || PopupService.MODALITY.MODAL === modality)
    ) {
      modality = PopupService.MODALITY.NONE;
    }

    var layerClass = options[PopupService.OPTION.LAYER_SELECTORS];
    oj.Assert.assertString(layerClass);

    var isCustomElement = options[PopupService.OPTION.CUSTOM_ELEMENT];

    var layerLevel = options[PopupService.OPTION.LAYER_LEVEL];
    if (
      !layerLevel ||
      !(
        PopupService.LAYER_LEVEL.TOP_LEVEL === layerLevel ||
        PopupService.LAYER_LEVEL.NEAREST_ANCESTOR === layerLevel
      )
    ) {
      layerLevel = PopupService.LAYER_LEVEL.NEAREST_ANCESTOR;
    }

    var beforeOpenCallback = events[PopupService.EVENT.POPUP_BEFORE_OPEN];
    if (!beforeOpenCallback || !$.isFunction(beforeOpenCallback)) {
      beforeOpenCallback = PopupServiceImpl._defaultBeforeOpenCallback;
    }

    var afterOpenCallback = events[PopupService.EVENT.POPUP_AFTER_OPEN];

    ZOrderUtils.setStatus(popup, ZOrderUtils.STATUS.OPENING);

    // set logical parent
    DomUtils.setLogicalParent(popup, launcher);

    ZOrderUtils.addToAncestorLayer(
      popup,
      launcher,
      modality,
      layerClass,
      layerLevel,
      isCustomElement
    );

    var _finalize = function () {
      try {
        popup.removeAttr('aria-hidden');

        this._assertEventSink();
        Components.subtreeShown(popup[0]);
      } catch (e) {
        Logger.error('Error opening popup:\n%o', e);
      } finally {
        ZOrderUtils.setStatus(popup, ZOrderUtils.STATUS.OPEN);
        // invoke the after open callback if one is provided.
        if (afterOpenCallback) {
          afterOpenCallback(options);
        }

        // delay activating event callbacks until after open is resolved
        // preventing a race condition
        var layer = ZOrderUtils.getFirstAncestorLayer(popup);
        oj.Assert.assertPrototype(layer, $);
        ZOrderUtils.applyEvents(layer, events);

        // if the originating subtree where the popup was defined is removed during
        // open animation, invoke the popup remove event callback.  It's registered
        // late (applyEvents above) to prevent removing the popup while it's animating open.
        if (
          !ZOrderUtils._getSurrogate(layer) &&
          $.isFunction(events[PopupService.EVENT.POPUP_REMOVE])
        ) {
          var surrogateRemoveCallback = events[PopupService.EVENT.POPUP_REMOVE];
          surrogateRemoveCallback();
        }
      }
    };
    _finalize = _finalize.bind(this);

    var resultant;
    try {
      resultant = beforeOpenCallback(options);
    } catch (e) {
      Logger.error('Error before open popup:\n%o', e);
    } finally {
      if (resultant && resultant instanceof Promise) {
        resultant.then(_finalize);
      } else {
        _finalize();
      }
    }
  };

  /**
   * Default {@link PopupService.EVENT.POPUP_BEFORE_OPEN} if one is not provided.
   * @private
   * @since 3.0.0
   * @param {!Object.<PopupService.OPTION, ?>} options property bag for closing the popup
   * @return {Promise|void}
   */
  PopupServiceImpl._defaultBeforeOpenCallback = function (options) {
    /** @type {!jQuery} */
    var popup = $(options[PopupService.OPTION.POPUP]);
    oj.Assert.assertPrototype(popup, $);

    /** @type {Object} */
    var position = options[PopupService.OPTION.POSITION];

    popup.show();
    if (position) {
      popup.position(position);
    }

    return undefined;
  };

  /**
   * Closes a open popup managed by the framework.  The popup element is reparented
   * to its original location within the document.  Any open descendent popups are
   * implicitly closed.
   *
   * @param {!Object.<PopupService.OPTION, ?>} options property bag for closing the popup
   * @return {void}
   * @instance
   * @public
   * @override
   */
  PopupServiceImpl.prototype.close = function (options) {
    oj.Assert.assertObject(options);

    /** @type {!jQuery} */
    var popup = $(options[PopupService.OPTION.POPUP]);
    oj.Assert.assertPrototype(popup, $);

    /** @type {!jQuery} */
    var layer = ZOrderUtils.getOpenPopupLayer(popup);
    oj.Assert.assertPrototype(layer, $);

    /** @type {!Object.<PopupService.EVENT, function(...)>} **/
    var events = options[PopupService.OPTION.EVENTS];
    if (!events) {
      events = ZOrderUtils.getEvents(layer);
      // eslint-disable-next-line no-param-reassign
      options[PopupService.OPTION.EVENTS] = events;
    } else {
      events = $.extend(ZOrderUtils.getEvents(layer), events);
    }

    // Popup is not in a open status or there are no events registered for the popup,
    // then it is opening, closing or already closed. Evaluate if the document level
    // dom listeners are still needed and ignore the request.
    var status = ZOrderUtils.getStatus(popup);
    if (
      !(status === ZOrderUtils.STATUS.OPEN || status === ZOrderUtils.STATUS.BEFORE_CLOSE) ||
      !events
    ) {
      this._assertEventSink();
      return;
    }

    var beforeCloseCallback = events[PopupService.EVENT.POPUP_BEFORE_CLOSE];
    if (!beforeCloseCallback || !$.isFunction(beforeCloseCallback)) {
      beforeCloseCallback = PopupServiceImpl._defaultBeforeCloseCallback;
    }

    var afterCloseCallback = events[PopupService.EVENT.POPUP_AFTER_CLOSE];

    ZOrderUtils.setStatus(popup, ZOrderUtils.STATUS.CLOSING);
    // Unregister events during before close callback
    ZOrderUtils.applyEvents(layer, {});

    // need to set aria-hidden here to prevent screen readers from re-reading during animation
    popup.attr('aria-hidden', 'true');

    var _finalize = function () {
      try {
        popup.hide();
        // If 'null' value was provided as the position option, do not reset it.
        // Consumer handles positioning by his own (DrawerPopup)
        if (options[PopupService.OPTION.POSITION] !== null) {
          // reset position units
          popup.css({ top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' });
        }

        ZOrderUtils.removeFromAncestorLayer(popup);

        // remove the logical parent
        DomUtils.setLogicalParent(popup, null);

        this._assertEventSink();
        Components.subtreeHidden(popup[0]);
      } catch (e) {
        Logger.error('Error closing popup:\n%o', e);
      } finally {
        ZOrderUtils.setStatus(popup, ZOrderUtils.STATUS.CLOSE);
        if (afterCloseCallback && $.isFunction(afterCloseCallback)) {
          afterCloseCallback(options);
        }
      }
    };
    _finalize = _finalize.bind(this);

    var resultant;
    try {
      resultant = beforeCloseCallback(options);
    } catch (e) {
      Logger.error('Error before close popup:\n%o', e);
    } finally {
      if (resultant && resultant instanceof Promise) {
        resultant.then(_finalize);
      } else {
        _finalize();
      }
    }
  };

  /**
   * Default {@link PopupService.EVENT.POPUP_BEFORE_CLOSE} if one is not provided.
   *
   * @private
   * @since 3.0.0
   * @param {!Object.<PopupService.OPTION, ?>} options property bag for closing the popup
   * @return {Promise|void} undefined is returned indicating no animation (sync operation)
   */
  PopupServiceImpl._defaultBeforeCloseCallback = function (options) {
    /** @type {!jQuery} */
    var popup = $(options[PopupService.OPTION.POPUP]);
    oj.Assert.assertPrototype(popup, $);

    popup.hide();
    return undefined;
  };

  /**
   * Applies a new {@link PopupService.OPTION.EVENTS} callback linkage or
   * applies changes a popup dialogs {@link PopupService.OPTION.MODALITY},
   * {@link PopupService.OPTION.EVENTS}, or {@link PopupService.OPTION.LAYER_SELECTORS}.
   * @param {!Object.<PopupService.OPTION, ?>} options property bag including target popup
   * @return {void}
   * @instance
   * @public
   * @override
   */
  PopupServiceImpl.prototype.changeOptions = function (options) {
    oj.Assert.assertObject(options);

    /** @type {!jQuery} */
    var popup = $(options[PopupService.OPTION.POPUP]);
    oj.Assert.assertPrototype(popup, $);

    if (ZOrderUtils.getStatus(popup) !== ZOrderUtils.STATUS.OPEN) {
      return;
    }

    /** @type {!jQuery} */
    var layer = ZOrderUtils.getOpenPopupLayer(popup);
    oj.Assert.assertPrototype(layer, $);

    /** @type Object.<PopupService.EVENT, function(...)> */
    var events = options[PopupService.OPTION.EVENTS];
    if (events) {
      ZOrderUtils.applyEvents(layer, events);
    }

    /** @type {PopupService.MODALITY} */
    var modality = options[PopupService.OPTION.MODALITY];
    if (modality) {
      ZOrderUtils.applyModality(layer, modality);
    }

    /** @type {?} */
    var layerClass = options[PopupService.OPTION.LAYER_SELECTORS];
    if (!oj.StringUtils.isEmptyOrUndefined(layerClass)) {
      layer.attr('class', layerClass);
    }
  };

  /**
   * Triggers the target event defined on all open descendent popups.
   * @param {!jQuery} popup to target triggering the event on decendents
   * @param {!PopupService.EVENT} event to trigger
   * @param {Array=} argsArray to pass "apply" to the associated callback for the event
   * @return {void}
   * @instance
   * @override
   * @public
   */
  PopupServiceImpl.prototype.triggerOnDescendents = function (popup, event, argsArray) {
    // if the popup is not open, there are not descendents
    if (!ZOrderUtils.isPopupOpen(popup)) {
      return;
    }

    var context = {};
    context.event = event;
    context.argsArray = argsArray;

    /** @type {!jQuery} */
    var layer = ZOrderUtils.getFirstAncestorLayer(popup);
    ZOrderUtils.postOrderVisit(layer, this._triggerOnDescendentsVisitCallback, context);
  };

  /**
   * The {@link ZOrderUtils.postOrderVisit} callback implementation for
   * {@link PopupServiceImpl#triggerOnDescendents}.
   *
   * @param {!jQuery} layer
   * @param {!Object} context
   * @instance
   * @return {ZOrderUtils.VISIT_RESULT}
   * @private
   * @see PopupServiceImpl#triggerOnDescendents
   */
  PopupServiceImpl.prototype._triggerOnDescendentsVisitCallback = function (layer, context) {
    var event = context.event;
    var argsArray = context.argsArray;

    var events = ZOrderUtils.getEvents(layer);
    if (events && $.isFunction(events[event])) {
      events[event].apply(this, argsArray);
    }

    return ZOrderUtils.VISIT_RESULT.ACCEPT;
  };

  /**
   * Depending on if popups are open, adds or removes event listeners redistributed
   * to open popups.
   * @return {void}
   * @instance
   * @private
   */
  PopupServiceImpl.prototype._assertEventSink = function () {
    var hasPopupsOpen = ZOrderUtils.hasPopupsOpen();
    var callbackEventFilter = this._callbackEventFilter;
    var i;
    var docElement;
    var event;

    if (!hasPopupsOpen && callbackEventFilter) {
      window.removeEventListener('resize', PopupServiceImpl._refreshCallback, true);
      window.removeEventListener('scroll', PopupServiceImpl._refreshCallback, true);

      docElement = document.documentElement;
      docElement.removeEventListener('mousewheel', PopupServiceImpl._refreshCallback, {
        passive: true,
        capture: true
      });
      docElement.removeEventListener('DOMMouseScroll', PopupServiceImpl._refreshCallback, true);

      this._callbackEventFilter = null;
      for (i = 0; i < PopupServiceImpl._REDISTRIBUTE_EVENTS.length; i++) {
        event = PopupServiceImpl._REDISTRIBUTE_EVENTS[i];
        docElement.removeEventListener(event, callbackEventFilter, true);
      }

      var simpleTapRecognizer = this._simpleTapRecognizer;
      if (simpleTapRecognizer) {
        simpleTapRecognizer.destroy();
        this._simpleTapRecognizer = null;
      }
    } else if (hasPopupsOpen && !callbackEventFilter) {
      window.addEventListener('resize', PopupServiceImpl._refreshCallback, true);
      window.addEventListener('scroll', PopupServiceImpl._refreshCallback, true);

      docElement = document.documentElement;
      docElement.addEventListener('mousewheel', PopupServiceImpl._refreshCallback, {
        passive: true,
        capture: true
      });
      docElement.addEventListener('DOMMouseScroll', PopupServiceImpl._refreshCallback, true);

      callbackEventFilter = this._eventFilterCallback.bind(this);
      this._callbackEventFilter = callbackEventFilter;
      for (i = 0; i < PopupServiceImpl._REDISTRIBUTE_EVENTS.length; i++) {
        event = PopupServiceImpl._REDISTRIBUTE_EVENTS[i];
        docElement.addEventListener(event, callbackEventFilter, true);
      }

      if (DomUtils.isTouchSupported()) {
        this._simpleTapRecognizer = new SimpleTapRecognizer(callbackEventFilter);
      }
    }
  };

  /**
   * Event callback for events defined by {@link PopupServiceImpl._REDISTRIBUTE_EVENTS}.
   * This callback handles applying the ".oj-focus-within" selector to the popup that
   * is active.  It also handles redistributing events to open popups.
   *
   * @param {Event} event from document capture listeners
   * @return {void}
   * @instance
   * @private
   */
  PopupServiceImpl.prototype._eventFilterCallback = function (event) {
    var target = $(event.target);

    var hasPopupsOpen = ZOrderUtils.hasPopupsOpen();
    if (!hasPopupsOpen) {
      this._assertEventSink();
      return;
    }

    // Ignore mouse events on the scrollbar. FF and Chrome, raises focus events on the
    // scroll container too.
    if (DomUtils.isChromeEvent(event) || (event.type === 'focus' && !target.is(':focusable'))) {
      return;
    }

    var defaultLayer = ZOrderUtils.getDefaultLayer();
    if (
      event.type === 'keydown' &&
      ZOrderUtils.hasModalDialogOpen() &&
      !DomUtils.isAncestor(defaultLayer[0], target[0])
    ) {
      // Inexpensive check to make sure that if a modal dialog is open,
      // we prevent a keydown outside the zorder layer that contains all
      // popups.  This handles the scenario where focus is placed in the
      // location bar and you start tabbing.  The browser will try to tab to
      // the first tabstop in the document.  Eat this event if it's under the
      // modal glass (not within the zorder container) and don't redistribute.

      ZOrderUtils.eatEvent(event);
      return;
    }

    var targetWithinLayer = ZOrderUtils.getFirstAncestorLayer(target);
    var $lastFocusLayer = defaultLayer.find('.' + PopupServiceImpl._FOCUS_WITHIN_SELECTOR).first();
    var targetIsOverlay = event.target.classList.contains(ZOrderUtils._OVERLAY_SELECTOR);

    // toggle the oj-focus-within pseudo state
    if (defaultLayer[0] !== targetWithinLayer[0]) {
      if (!targetWithinLayer.hasClass(PopupServiceImpl._FOCUS_WITHIN_SELECTOR)) {
        if ($lastFocusLayer.length) {
          $lastFocusLayer.removeClass(PopupServiceImpl._FOCUS_WITHIN_SELECTOR);
        }
        targetWithinLayer.addClass(PopupServiceImpl._FOCUS_WITHIN_SELECTOR);
      }
    } else if ($lastFocusLayer.length && !targetIsOverlay) {
      // focus relinquished outside any managed popup
      $lastFocusLayer.removeClass(PopupServiceImpl._FOCUS_WITHIN_SELECTOR);
    }

    // Don't redistribute a focus event targeted for an element that doesn't normally take focus.
    // Clicking on the scrollbars sometimes targets focus on containers with a -1 tabindex.
    // However, we still need to process the focus-within logic for this scenario.
    if (event.type === 'focus' && target.attr('tabindex') === '-1') {
      return;
    }

    // redistribute events for auto dismissal
    var context = {};
    context.targetIsOverlay = targetIsOverlay;

    // Capture all interesting event properties.  Similar to jQuery.event.fix.
    var _COPY_SAFE_EVENT_PROPERTIES = PopupServiceImpl._COPY_SAFE_EVENT_PROPERTIES;
    var props = {};
    for (var i = 0; i < _COPY_SAFE_EVENT_PROPERTIES.length; i++) {
      var key = _COPY_SAFE_EVENT_PROPERTIES[i];
      var value = event[key];
      if (value !== undefined && !$.isFunction(value)) {
        props[key] = value;
      }
    }

    // Wrap a native event in a jQuery.Event
    context.event = $.Event(event, props);
    ZOrderUtils.postOrderVisit(defaultLayer, PopupServiceImpl._redistributeVisitCallback, context);
  };

  /**
   * The {@link ZOrderUtils.postOrderVisit} callback for redistributing
   * {@link PopupService.EVENT.POPUP_AUTODISMISS} events to open popups.
   * @param {!jQuery} layer
   * @param {!Object} context
   * @return {ZOrderUtils.VISIT_RESULT}
   * @instance
   * @private
   * @see PopupServiceImpl#_eventFilterCallback
   */
  PopupServiceImpl._redistributeVisitCallback = function (layer, context) {
    var events = ZOrderUtils.getEvents(layer);
    var event = context.event;

    if (events && $.isFunction(events[PopupService.EVENT.POPUP_AUTODISMISS])) {
      events[PopupService.EVENT.POPUP_AUTODISMISS](event);
    } else if (event.type === 'mousedown' && context.targetIsOverlay) {
      // JET-50124: if no autodismiss handler is registered and the event is 'mousedown'
      // on overlay div, we need to prevent focus from escaping to the document body
      event.preventDefault();
    }

    return ZOrderUtils.VISIT_RESULT.ACCEPT;
  };

  /**
   * Event listener added to the window for the resize and scroll events.
   *
   * @param {Event} event resize,scroll or mousewheel event
   * @return {void}
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  PopupServiceImpl._refreshCallback = function (event) {
    var refreshTimerId = PopupServiceImpl._refreshTimerId;
    if (!isNaN(refreshTimerId)) {
      return;
    }

    // Throttle redistributing the refresh listener to intervals of ? ms.
    // This will help performance for chatty events such as scroll.

    PopupServiceImpl._refreshTimerId = window.setTimeout(function () {
      PopupServiceImpl._refreshTimerId = Number.NaN;
      var defaultLayer = ZOrderUtils.getDefaultLayer();

      if ($.isFunction(window.requestAnimationFrame)) {
        PopupServiceImpl._afRequestId = window.requestAnimationFrame(function () {
          PopupServiceImpl._afRequestId = null;
          ZOrderUtils.postOrderVisit(defaultLayer, PopupServiceImpl._refreshVisitCallback);
        });
      } else {
        ZOrderUtils.postOrderVisit(defaultLayer, PopupServiceImpl._refreshVisitCallback);
      }
    }, PopupServiceImpl._REFRESH_DELAY);
  };

  /**
   * The {@link ZOrderUtils.postOrderVisit} callback for invoking the
   * {@link PopupService.EVENT.POPUP_REFRESH} function for open popups.
   *
   * @param {!jQuery} layer
   * @param {!Object} context
   * @return {ZOrderUtils.VISIT_RESULT}
   * @private
   * @see PopupServiceImpl._refreshCallback
   */
  PopupServiceImpl._refreshVisitCallback = function (layer, context) {
    // Only need to call on the first level of popups as they will recursively
    // call on children.
    var level = context.level;
    if (level > 0) {
      return ZOrderUtils.VISIT_RESULT.REJECT;
    }

    var events = ZOrderUtils.getEvents(layer);
    if (events && $.isFunction(events[PopupService.EVENT.POPUP_REFRESH])) {
      events[PopupService.EVENT.POPUP_REFRESH]();
    }

    return ZOrderUtils.VISIT_RESULT.ACCEPT;
  };

  /**
   * @return {void}
   * @instance
   * @public
   * @override
   */
  PopupServiceImpl.prototype.destroy = function () {
    PopupServiceImpl.superclass.destroy.call(this);
  };

  /**
   * The pseudo select name applied to the popup that has focus.
   *
   * @const
   * @private
   * @type {string}
   */
  PopupServiceImpl._FOCUS_WITHIN_SELECTOR = 'oj-focus-within';

  /**
   * Array of events that are redistributed to open popups.
   *
   * @const
   * @private
   * @type {Array.<string>}
   */
  PopupServiceImpl._REDISTRIBUTE_EVENTS = ['focus', 'mousedown', 'keydown'];

  /**
   * Map of event properties that are interesting to capture when creating a jQuery.Event
   * wrapper from a native event.  This is similar to what is done in jQuery.event.fix.
   * This list is needed to prevent warning messages for event properties that have been
   * deprecated.
   *
   * @const
   * @private
   * @type {Object}
   */
  PopupServiceImpl._COPY_SAFE_EVENT_PROPERTIES = [
    'altKey',
    'bubbles',
    'cancelable',
    'ctrlKey',
    'currentTarget',
    'eventPhase',
    'metaKey',
    'relatedTarget',
    'shiftKey',
    'target',
    'timeStamp',
    'view',
    'which',
    'button',
    'buttons',
    'clientX',
    'clientY',
    'offsetX',
    'offsetY',
    'pageX',
    'pageY',
    'screenX',
    'screenY',
    'toElement',
    'char',
    'charCode',
    'key',
    'keyCode'
  ];

  /**
   * Milliseconds that is used to throttle processing of native resize, scroll and mousewheel
   * events. Dispatching refresh events to open popups will happen after the delay.
   * This is to guard against chatty events.
   *
   * @const
   * @private
   * @type {number}
   */
  PopupServiceImpl._REFRESH_DELAY = 10;

  /**
   * Utilities used by the popup framework.
   * @since 1.1.0
   * @ignore
   * @ojtsignore
   */
  oj._registerLegacyNamespaceProp('ZOrderUtils', ZOrderUtils);

  /**
   * Operation status for a target popup.
   * @enum {number}
   * @public
   * @see ZOrderUtils.getStatus
   * @see ZOrderUtils.setStatus
   * @ojtsignore
   */
  ZOrderUtils.STATUS = {
    /** Node has not interacted with the popup service. */
    UNKNOWN: 0,
    /** triggering the before open event */
    BEFORE_OPEN: 0.5,
    /** Popup is in the process of opening. */
    OPENING: 1,
    /** Popup is currently open. */
    OPEN: 2,
    /** triggering the before close event */
    BEFORE_CLOSE: 2.5,
    /** Popup is in the process of closing */
    CLOSING: 3,
    /** Popup previously open is now closed **/
    CLOSE: 4
  };

  /**
   * Key to store the current operation status of the popup.
   * @const
   * @private
   * @type {string}
   * @see ZOrderUtils.getStatus
   * @see ZOrderUtils.setStatus
   */
  ZOrderUtils._STATUS_DATA = 'oj-popup-status';

  /**
   * Returns the current operation status of the target popup element.
   * @param {jQuery|Element} popup
   * @returns {ZOrderUtils.STATUS}
   * @see ZOrderUtils.setStatus
   */
  ZOrderUtils.getStatus = function (popup) {
    if (popup instanceof Element) {
      // eslint-disable-next-line no-param-reassign
      popup = $(popup);
    }

    /** @type {?} */
    var status = popup.data(ZOrderUtils._STATUS_DATA);
    if (isNaN(status)) {
      return ZOrderUtils.STATUS.UNKNOWN;
    }
    return status;
  };

  /**
   * Sets the current operational status of the popup element.
   * @param {jQuery|Element} popup
   * @param {ZOrderUtils.STATUS} status
   * @see ZOrderUtils.getStatus
   */
  ZOrderUtils.setStatus = function (popup, status) {
    if (popup instanceof Element) {
      // eslint-disable-next-line no-param-reassign
      popup = $(popup);
    }

    if (status >= ZOrderUtils.STATUS.UNKNOWN && status <= ZOrderUtils.STATUS.CLOSE) {
      popup.data(ZOrderUtils._STATUS_DATA, status);
    }
  };

  /**
   * Accepts a launcher associated with the target popup being open.  The
   * resultant is the nearest layer or default zorder container that the
   * popup should be reparented to when open.  It can also return the
   * layer "stacking context" of a popup that is already open.
   *
   * @param {jQuery=} launcher associated with the target popup
   * @return {!jQuery}
   * @public
   */
  ZOrderUtils.getFirstAncestorLayer = function (launcher) {
    // dialogs will not have launchers and will be top rooted
    if (!launcher) {
      return ZOrderUtils.getDefaultLayer();
    }

    var parent = launcher;
    while (
      parent &&
      parent.length > 0 &&
      parent.attr(ZOrderUtils._SURROGATE_ATTR) !== ZOrderUtils._DEFAULT_LAYER_ID
    ) {
      if (ZOrderUtils._hasSurrogate(parent[0])) {
        return parent;
      }
      parent = parent.parent();
    }

    return ZOrderUtils.getDefaultLayer();
  };

  /**
   * Returns the jQuery DIV element that represents the zorder container prepended to the
   * document body.  All open popups will be a descendent of the resultant node.
   *
   * @return {!jQuery}
   * @public
   */
  ZOrderUtils.getDefaultLayer = function () {
    /** @type {jQuery} */
    var defaultLayer = $(document.getElementById(ZOrderUtils._DEFAULT_LAYER_ID));
    if (defaultLayer.length > 0) {
      return defaultLayer;
    }

    defaultLayer = $('<div>');
    defaultLayer.attr('role', 'presentation');
    defaultLayer.attr('id', ZOrderUtils._DEFAULT_LAYER_ID);
    defaultLayer.prependTo($(document.body)); // @HTMLUpdateOK attach programmatic generated node

    return defaultLayer;
  };

  /**
   * Adds the target popup to the nearest ancestor layer within the zorder container.
   * A surrogate script element will be added to mark where the popup root element
   * was prior to reparenting.
   *
   * @param {!jQuery} popup root widget
   * @param {?jQuery} launcher associated with a popup
   * @param {!PopupService.MODALITY} modality of the popup being open
   * @param {string} layerClass selector that defines the stacking context "z-index" of the popup
   * @param {PopupService.LAYER_LEVEL} layerLevel defines where the popup will be reparented
   * @param {boolean} isCustomElement indicates if the owning component is a custom element
   * @return {void}
   * @public
   */
  ZOrderUtils.addToAncestorLayer = function (
    popup,
    launcher,
    modality,
    layerClass,
    layerLevel,
    isCustomElement
  ) {
    var popupDom = popup[0];
    if (ZOrderUtils._hasSurrogate(popupDom.parentNode)) {
      throw new Error('JET Popup is already open - id: ' + popupDom.getAttribute('id'));
    }

    var ancestorLayer = ZOrderUtils.getFirstAncestorLayer(
      layerLevel === PopupService.LAYER_LEVEL.TOP_LEVEL ? null : launcher
    );

    var layer = $('<div>');

    /** @type {?} */
    var popupId = popup.attr('id');
    if (oj.StringUtils.isEmptyOrUndefined(popupId)) {
      layer.uniqueId();
    } else {
      layer.attr('id', [popupId, 'layer'].join('_'));
    }

    layer.attr('role', 'presentation');
    layer.addClass(layerClass);
    popup.after(layer); // @HTMLUpdateOK

    const surrogate = ZOrderUtils._createSurrogate(layer, isCustomElement);

    Components.subtreeDetached(popupDom);
    popup.appendTo(layer); // @HTMLUpdateOK

    // link the popup to the layer @see ZOrderUtils.getOpenPopupLayer
    popup.data(ZOrderUtils._LAYER_ID_DATA, layer.attr('id'));

    layer.appendTo(ancestorLayer); // @HTMLUpdateOK
    Components.subtreeAttached(popupDom);

    ZOrderUtils._applyVDomPatch(surrogate[0], popupDom);

    ZOrderUtils.applyModality(layer, modality);
  };

  /**
   * @ignore
   */
  ZOrderUtils._applyVDomPatch = function (surrogate, popup) {
    // It does not seem that a surrogate is ever reused, so we should not have to
    // clear the OJ_POPUP symbol when the dialog is closed
    // eslint-disable-next-line no-param-reassign
    surrogate[ojpreactPatch.OJ_POPUP] = popup;

    ojpreactPatch.patchPopupParent(surrogate.parentElement);
  };

  /**
   * @param {!jQuery} layer of the target popup
   * @return {jQuery} surrogate element associated with the layer
   * @private
   */
  ZOrderUtils._getSurrogate = function (layer) {
    var surrogateId = layer.attr(ZOrderUtils._SURROGATE_ATTR);
    if (surrogateId) {
      return document.getElementById(surrogateId);
    }
    return undefined;
  };

  /**
   * Replaces the event callback map associated with an open popup.  The event
   * callbacks are used for auto dismissal or handling implicit dismissal when
   * the surrogate element associated with a layer is removed from the document.
   *
   * @param {!jQuery} layer of the target popup
   * @param {!Object.<PopupService.EVENT, function(...)>} events map of event name to callback
   * @param {?Object=} surrogate saves position within the document where popup is
   *             defined
   * @return {void}
   * @public
   */
  ZOrderUtils.applyEvents = function (layer, events, surrogate) {
    if (!surrogate) {
      // eslint-disable-next-line no-param-reassign
      surrogate = $(ZOrderUtils._getSurrogate(layer));
    }

    layer.data(ZOrderUtils._EVENTS_DATA, events);

    if (surrogate.length > 0 && events && $.isFunction(events[PopupService.EVENT.POPUP_REMOVE])) {
      // if the surrogate script element gets replaced in the dom it will trigger closure of the
      // popup.
      Components.setComponentOption(
        surrogate[0],
        'beforeDestroy',
        events[PopupService.EVENT.POPUP_REMOVE]
      );
    }
  };

  /**
   * Returns the map of event callbacks associated with an open popup.
   *
   * @param {!jQuery} layer of an open popup
   * @return {!Object.<PopupService.EVENT, function(...)>}
   * @public
   */
  ZOrderUtils.getEvents = function (layer) {
    /** @type {?} */
    var events = layer.data(ZOrderUtils._EVENTS_DATA);
    return events;
  };

  /**
   * Creates a script element before the target layer bound to the simple jquery UI
   * surrogate component.  Links this element to the layer by attribute named
   * {@link ZOrderUtils._SURROGATE_ATTR}.
   *
   * @param {!jQuery} layer stacking context
   * @param {boolean} isCustomElement
   * @return {jQuery}
   * @private
   * @see ZOrderUtils.addToAncestorLayer
   */
  ZOrderUtils._createSurrogate = function (layer, isCustomElement) {
    var nodeName = 'script'; // @HTMLUpdateOK
    if (isCustomElement) {
      nodeName = 'oj-surrogate';
    }

    /** @type {?} */
    var surrogate = $(document.createElement(nodeName)); // @HTMLUpdateOK

    /** @type {?} */
    var layerId = layer.attr('id');
    if (!oj.StringUtils.isEmptyOrUndefined(layerId)) {
      surrogate.attr('id', [layerId, 'surrogate'].join('_'));
    }

    if (isCustomElement) {
      // programmatically created elements not managed by a binding stratagy like knockout
      // needs this attribute to signal the component should be created.
      surrogate.attr('data-oj-binding-provider', 'none');
    }

    surrogate.insertBefore(layer); // @HTMLUpdateOK

    if (!isCustomElement) {
      // create the jquery ui component bound to the script node
      surrogate.ojSurrogate();
    }

    /** @type {?} */
    var surrogateId = surrogate.attr('id');
    // loosely associate the popup to the surrogate element
    layer.attr(ZOrderUtils._SURROGATE_ATTR, surrogateId); // @HTMLUpdateOK

    return surrogate;
  };

  /**
   * Reparents the layer after the associated surrogate script element removing
   * the surrogate script element.
   *
   * @param {!jQuery} layer stacking context of the popup
   * @return {boolean} true if the original location the popup was defined still exists
   * @private
   * @see ZOrderUtils.removeFromAncestorLayer
   */
  ZOrderUtils._removeSurrogate = function (layer) {
    /** @type {?} */
    var surrogateId = layer.attr(ZOrderUtils._SURROGATE_ATTR);
    layer.removeAttr(ZOrderUtils._SURROGATE_ATTR);

    /** @type {jQuery} */
    var surrogate = $(document.getElementById(surrogateId));
    var originatingSubtreeExists = surrogate.length > 0;
    if (originatingSubtreeExists) {
      layer.insertAfter(surrogate); // @HTMLUpdateOK
      Components.setComponentOption(surrogate[0], 'beforeDestroy', null);
      surrogate.remove();
    }

    return originatingSubtreeExists;
  };

  /**
   * Returns the layer associated with a popup.  The layer should be the immediate parent of an open
   * popup unless it was disconnected from the document.
   *
   * @param {!jQuery} popup
   * @returns {!jQuery} open popup's layer
   * @public
   */
  ZOrderUtils.getOpenPopupLayer = function (popup) {
    /** @type {?} */
    var layer = popup.parent();
    if (!layer || layer.length === 0) {
      // the open popup has been detached from the layer before it was closed
      // use the backup pointer for better cleanup
      /** @type {?} */
      var layerId = popup.data(ZOrderUtils._LAYER_ID_DATA);
      layer = $(document.getElementById(layerId));
    }

    return layer;
  };

  /**
   * Closes a open popup by reparenting it back to its original location within
   * the document marked by the surrogate.  Recursively calls the
   * {@link PopupService.EVENT.POPUP_CLOSE} event callback on descendent popups.
   * @param {!jQuery} popup root widget
   * @return {void}
   * @public
   */
  ZOrderUtils.removeFromAncestorLayer = function (popup) {
    var layer = ZOrderUtils.getOpenPopupLayer(popup);

    ZOrderUtils.preOrderVisit(layer, ZOrderUtils._closeDescendantPopupsCallback);

    ZOrderUtils._removeOverlayFromAncestorLayer(layer);
    ZOrderUtils._resetAriaHiddenOnBackround(layer);
    ZOrderUtils._restoreBodyOverflow();

    layer.removeData(ZOrderUtils._EVENTS_DATA);
    layer.removeData(ZOrderUtils._MODALITY_DATA);
    popup.removeData(ZOrderUtils._LAYER_ID_DATA);

    var popupDom = popup[0];
    Components.subtreeDetached(popupDom);
    var originatingSubtreeExists = ZOrderUtils._removeSurrogate(layer);

    // if the popup is not orphaned
    if (originatingSubtreeExists && popupDom && popupDom.parentElement) {
      DomUtils.unwrap(popup, layer);
      Components.subtreeAttached(popupDom);
    } else {
      layer.remove();
    }
  };

  /**
   * The {@link ZOrderUtils.preOrderVisit} callback that invokes the
   * {@link PopupService.EVENT.POPUP_CLOSE} function for descendent
   * popups.
   * @param {!jQuery} layer to be dismissed
   * @param {!Object} context for visit tree
   * @return {ZOrderUtils.VISIT_RESULT}
   * @private
   * @see ZOrderUtils.removeFromAncestorLayer
   */
  ZOrderUtils._closeDescendantPopupsCallback = function (layer, context) {
    var level = context.level;
    // Only need to visit the immediate children as the children will recursively
    // close any open child popups.
    if (level > 0) {
      return ZOrderUtils.VISIT_RESULT.REJECT;
    }

    var events = layer.data(ZOrderUtils._EVENTS_DATA);
    if (events && $.isFunction(events[PopupService.EVENT.POPUP_CLOSE])) {
      events[PopupService.EVENT.POPUP_CLOSE]();
    }

    return ZOrderUtils.VISIT_RESULT.ACCEPT;
  };

  ZOrderUtils._disableBodyOverflow = function (layer) {
    const body = document.body;
    const popup = layer.children()[0];
    if ($(popup).width() <= window.innerWidth && $(popup).height() <= window.innerHeight) {
      // JET-44685: setting 'overflow:hidden' on body is not enough to lock background scrolling on iOS.
      // There is the address bar which gets hidden/revealed when swiping the screen vertically and
      // iOS seems to ignore 'overflow:hidden' until the address bar is visible.
      // The generally recommended workaround is setting 'position: fixed' on body while preserving
      // the current scroll position.
      if (oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS) {
        if (this._iosScrollLockBackup) {
          return;
        }
        const offsetLeft = window.visualViewport.offsetLeft;
        const offsetTop = window.visualViewport.offsetTop;
        const windowScrollX = window.pageXOffset;
        const windowScrollY = window.pageYOffset;

        this._iosScrollLockBackup = {
          windowScrollX: windowScrollX,
          windowScrollY: windowScrollY,
          bodyPosition: body.style.position,
          bodyOverflow: body.style.overflow,
          bodyTop: body.style.top,
          bodyLeft: body.style.left,
          bodyRight: body.style.right
        };

        body.style.position = 'fixed';
        body.style.overflow = 'hidden';
        body.style.top = `${-(windowScrollY - Math.floor(offsetTop))}px`;
        body.style.left = `${-(windowScrollX - Math.floor(offsetLeft))}px`;
        body.style.right = '0';
      } else {
        // JET-44685: anywhere else but iOS, setting body.style.overflow='hidden' is sufficient
        body.classList.add('oj-component-modal-open');
      }
    }
  };

  ZOrderUtils._restoreBodyOverflow = function () {
    // if there are no more modals left, enable scrolling on body
    if (!ZOrderUtils.hasModalDialogOpen()) {
      const body = document.body;

      // JET-44685: if on iOS, revert the previously applied scroll lock patch
      if (oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS) {
        if (!this._iosScrollLockBackup) {
          return;
        }

        const backup = this._iosScrollLockBackup;

        body.style.position = backup.bodyPosition;
        body.style.overflow = backup.bodyOverflow;
        body.style.top = backup.bodyTop;
        body.style.left = backup.bodyLeft;
        body.style.right = backup.bodyRight;

        window.scrollTo(backup.windowScrollX, backup.windowScrollY);

        delete this._iosScrollLockBackup;
      } else {
        body.classList.remove('oj-component-modal-open');
      }
    }
  };

  ZOrderUtils._removeFocusWithinFromOverlayedContent = function () {
    var defaultLayer = ZOrderUtils.getDefaultLayer();
    var $lastFocusLayer = defaultLayer.find('.' + PopupServiceImpl._FOCUS_WITHIN_SELECTOR).first();

    if ($lastFocusLayer.length) {
      // focus relinquished outside any managed popup
      $lastFocusLayer.removeClass(PopupServiceImpl._FOCUS_WITHIN_SELECTOR);
    }
  };

  /**
   * Handles adding or removing a sibling overlay blocking pane before the dialog
   * based on the modality option.  The overlay pane is associated with the dialog
   * vai a attribute pointing to the id of the overlay.
   *
   * @param {!jQuery} layer for the target popup
   * @param {PopupService.MODALITY} modality
   * @return {void}
   * @public
   */
  ZOrderUtils.applyModality = function (layer, modality) {
    /** @type {?} */
    var currModality = layer.data(ZOrderUtils._MODALITY_DATA);
    layer.data(ZOrderUtils._MODALITY_DATA, modality);

    if (oj.StringUtils.isEmptyOrUndefined(currModality)) {
      if (PopupService.MODALITY.MODAL === modality) {
        ZOrderUtils._addOverlayToAncestorLayer(layer);
        ZOrderUtils._disableBodyOverflow(layer);
        ZOrderUtils._removeFocusWithinFromOverlayedContent();
        ZOrderUtils._setAriaHiddenOnBackround(layer);
      } else {
        // Note: Calling this is probably not necessary as this is initial opening of a popup
        ZOrderUtils._removeOverlayFromAncestorLayer(layer);
      }
    } else if (currModality !== modality) {
      if (modality === PopupService.MODALITY.MODAL) {
        ZOrderUtils._addOverlayToAncestorLayer(layer);
        ZOrderUtils._disableBodyOverflow(layer);
        ZOrderUtils._removeFocusWithinFromOverlayedContent();
        ZOrderUtils._setAriaHiddenOnBackround(layer);
      } else {
        ZOrderUtils._removeOverlayFromAncestorLayer(layer);
        ZOrderUtils._restoreBodyOverflow();
        ZOrderUtils._resetAriaHiddenOnBackround(layer);
      }
    }
    if (modality === PopupService.MODALITY.MODAL) {
      layer.attr('aria-modal', 'true');
    } else {
      // saw a tech note that a "false" value doesn't convey the same information as
      // if the attribute wasn’t present at all screen readers.
      layer.removeAttr('aria-modal');
    }
  };

  /**
   * Adds aria-hidden="true" on elements outside of the modal popup hierarchy.
   * This is a required workaround for screen readers that do not honor
   * the aria-modal="true" setting on the popup and allow elements under
   * the modal overlay to be read and accessed.
   *
   * @param {!jQuery} layer for the target popup
   * @return {void}
   * @private
   */
  ZOrderUtils._setAriaHiddenOnBackround = function (layer) {
    var $node = layer;
    var $hidden = $();
    do {
      $hidden = $hidden.add($node.siblings(':not(script):not([aria-hidden="true"])'));
      $node = $node.parent();
    } while ($node[0].tagName.toLowerCase() !== 'body');
    $hidden.attr('aria-hidden', true);
    layer.data(ZOrderUtils._ARIA_HIDDEN_ELEMS, $hidden);
  };

  /**
   * Removes aria-hidden="true" on elements outside of the modal popup hierarchy
   * when the modal closes or modality status changes.
   *
   * @param {!jQuery} layer for the target popup
   * @return {void}
   * @private
   */
  ZOrderUtils._resetAriaHiddenOnBackround = function (layer) {
    var $hidden = layer.data(ZOrderUtils._ARIA_HIDDEN_ELEMS);
    if ($hidden) {
      $hidden.removeAttr('aria-hidden');
      layer.removeData(ZOrderUtils._ARIA_HIDDEN_ELEMS);
    }
  };

  /**
   * @return {boolean} <code>true</code> if one or more modal dialogs are open
   * @public
   */
  ZOrderUtils.hasModalDialogOpen = function () {
    var defaultLayer = ZOrderUtils.getDefaultLayer();
    var children = defaultLayer.children();
    var childrenCount = children.length;
    for (var i = childrenCount - 1; i > -1; i--) {
      var child = $(children[i]);
      if (child.hasClass(ZOrderUtils._OVERLAY_SELECTOR)) {
        return true;
      }
    }

    return false;
  };

  /**
   * Creates a overlay div assigned the {@link ZOrderUtils._OVERLAY_SELECTOR}
   * selector inserted before the dialog layer.  The layer is associated to the
   * overlay by the {@link ZOrderUtils._OVERLAY_ATTR} assigned to the root layer
   * element.
   * @param {!jQuery} layer root widget
   * @return {void}
   * @private
   * @see ZOrderUtils.applyModality
   */
  ZOrderUtils._addOverlayToAncestorLayer = function (layer) {
    /** @type {jQuery} */
    var overlay = $('<div>');
    overlay.addClass(ZOrderUtils._OVERLAY_SELECTOR);
    overlay.addClass(layer[0].className);
    overlay.attr('role', 'presentation');

    /** @type {?} */
    var layerId = layer.attr('id');
    if (oj.StringUtils.isEmptyOrUndefined(layerId)) {
      overlay.uniqueId();
    } else {
      overlay.attr('id', [layerId, 'overlay'].join('_'));
    }

    layer.before(overlay); // @HTMLUpdateOK

    /** @type {?} */
    var overlayId = overlay.attr('id');
    layer.attr(ZOrderUtils._OVERLAY_ATTR, overlayId); // @HTMLUpdateOK
  };

  /**
   * Removes the overlay associated with a modal dialog and removes the the attribute
   * that associates the popup with the overlay.
   *
   * @param {!jQuery} layer root widget
   * @return {void}
   * @private
   * @see ZOrderUtils.applyModality
   */
  ZOrderUtils._removeOverlayFromAncestorLayer = function (layer) {
    /** @type {?} */
    var overlayId = layer.attr(ZOrderUtils._OVERLAY_ATTR);

    if (!oj.StringUtils.isEmptyOrUndefined(overlayId)) {
      layer.removeAttr(ZOrderUtils._OVERLAY_ATTR);
      var overlay = $(document.getElementById(overlayId));
      overlay.remove();
    }
  };

  /**
   * Resultant enumerated type used to control the popup visit (pre/post order)
   * traversal.
   * @enum {number}
   * @public
   * @see ZOrderUtils.postOrderVisit
   * @see ZOrderUtils.preOrderVisit
   * @ojtsignore
   */
  ZOrderUtils.VISIT_RESULT = {
    /** Continue to descend into current subtree. */
    ACCEPT: 0,
    /** Halt processing the subtree but contine visiting */
    REJECT: 1,
    /** Halt tree visit **/
    COMPLETE: 2
  };

  /**
   * Defines the visit traversal type.
   * @enum {number}
   * @private
   */
  ZOrderUtils._VISIT_TRAVERSAL = {
    /** The callback is invoked on the target popup before any children. */
    PRE_ORDER: 0,
    /** The callback is invoked on the target popup after first visiting all descendents. */
    POST_ORDER: 1
  };

  /**
   * Visits all open popups invoking the callback function on the target popup after first
   * visiting all children in order of last open.
   * @param {!jQuery} layer to begin searching for popups
   * @param {function(!jQuery, !Object) : ZOrderUtils.VISIT_RESULT} callback invoked for each
   *        child popup
   * @param {Object=} context passed to the visit
   * @return {void}
   * @public
   */
  ZOrderUtils.postOrderVisit = function (layer, callback, context) {
    var _context = context;
    if (!context) {
      _context = {};
    }

    _context.level = 0;
    _context.type = ZOrderUtils._VISIT_TRAVERSAL.POST_ORDER;
    ZOrderUtils._visitTree(layer, callback, _context);
  };

  /**
   * Visits all open popups invoking the callback on the target popup before any
   * popups that are descendents.
   * @param {!jQuery} layer to begin searching for popups
   * @param {function(!jQuery, !Object) : ZOrderUtils.VISIT_RESULT} callback invoked for each child
   *         popup
   * @param {Object=} context passed to the visit
   * @return {void}
   * @public
   */
  ZOrderUtils.preOrderVisit = function (layer, callback, context) {
    var _context = context;
    if (!context) {
      _context = {};
    }

    _context.level = 0;
    _context.type = ZOrderUtils._VISIT_TRAVERSAL.PRE_ORDER;
    ZOrderUtils._visitTree(layer, callback, _context);
  };

  /**
   * Visits popups in order defined by {@link ZOrderUtils._VISIT_TRAVERSAL.PRE_ORDER}
   * invoking the callback for each popup.
   * @param {!jQuery} layer to begin searching for popups
   * @param {function(!jQuery, !Object) : ZOrderUtils.VISIT_RESULT} callback
   *        invoked for each child popup
   * @param {!Object} context passed to the visit
   * @return {ZOrderUtils.VISIT_RESULT} instructions on how to proceed
   * @private
   * @see ZOrderUtils.preOrderVisit
   * @see ZOrderUtils.postOrderVisit
   */
  ZOrderUtils._visitTree = function (layer, callback, context) {
    // Patterned from the RC visit APIs
    var level = context.level;

    var children = layer.children();
    var childrenCount = children.length;
    for (var i = childrenCount - 1; i > -1; i--) {
      var child = $(children[i]);
      if (ZOrderUtils._hasSurrogate(child[0])) {
        var vrtn;

        // handle visit pre-order
        if (context.type === ZOrderUtils._VISIT_TRAVERSAL.PRE_ORDER) {
          vrtn = callback(child, context);
          if (vrtn === ZOrderUtils.VISIT_RESULT.COMPLETE) {
            return vrtn;
          } else if (vrtn === ZOrderUtils.VISIT_RESULT.REJECT) {
            break;
          }
        }

        // visit children
        // eslint-disable-next-line no-param-reassign
        context.level = level + 1;
        vrtn = ZOrderUtils._visitTree(child, callback, context);
        // eslint-disable-next-line no-param-reassign
        context.level = level;
        if (vrtn === ZOrderUtils.VISIT_RESULT.COMPLETE) {
          return vrtn;
        }

        // handle visit post-order
        if (context.type === ZOrderUtils._VISIT_TRAVERSAL.POST_ORDER) {
          vrtn = callback(child, context);
          if (vrtn === ZOrderUtils.VISIT_RESULT.COMPLETE) {
            return vrtn;
          } else if (vrtn === ZOrderUtils.VISIT_RESULT.REJECT) {
            break;
          }
        }
      }
    }

    return ZOrderUtils.VISIT_RESULT.ACCEPT;
  };

  /**
   * Determines the target element is an open popup by checking for the
   * {@link ZOrderUtils._SURROGATE_ATTR} attribute assigned to open popup layers.
   *
   * @param {!Element} element to check for a stand-in component
   * @return {boolean} <code>true</code> if the element is associated with a placeholder element
   * @private
   */
  ZOrderUtils._hasSurrogate = function (element) {
    if (element && element.nodeType === 1 && element.hasAttribute(ZOrderUtils._SURROGATE_ATTR)) {
      return true;
    }
    return false;
  };

  /**
   * @return {boolean} <code>true</code> if one or more popups are open
   * @public
   */
  ZOrderUtils.hasPopupsOpen = function () {
    var defaultLayer = ZOrderUtils.getDefaultLayer();
    return defaultLayer.children().length > 0;
  };

  /**
   * @return {number} total number of open popups
   * @public
   */
  ZOrderUtils.getOpenPopupCount = function () {
    var context = {};
    context.popupCount = 0;

    var defaultLayer = ZOrderUtils.getDefaultLayer();
    ZOrderUtils.preOrderVisit(defaultLayer, ZOrderUtils._openPopupCountCallback, context);

    return context.popupCount;
  };

  /**
   * The {@link ZOrderUtils.preOrderVisit} callback for counting the total number of
   * open popups.
   * @param {!jQuery} layer
   * @param {!Object} context for visit tree
   * @return {ZOrderUtils.VISIT_RESULT}
   * @private
   * @see ZOrderUtils.getOpenPopupCount
   */
  ZOrderUtils._openPopupCountCallback = function (layer, context) {
    // eslint-disable-next-line no-param-reassign
    context.popupCount += 1;
    return ZOrderUtils.VISIT_RESULT.ACCEPT;
  };

  /**
   * Returns a jQuery set of all open popup layer dom elements.  Popups open last will appear at the
   * end of the set. Used by automated testing.
   * @return {!jQuery} set of all open popup root elements managed by the popup service
   * @public
   */
  ZOrderUtils.findOpenPopups = function () {
    var context = {};

    /** @type {Array.<Element>} */
    var popups = [];

    context.popups = popups;
    var defaultLayer = ZOrderUtils.getDefaultLayer();
    ZOrderUtils.preOrderVisit(defaultLayer, ZOrderUtils._openPopupsCallback, context);
    popups = context.popups;

    return $(popups);
  };

  /**
   * The {@link ZOrderUtils.preOrderVisit} callback that collects a set of open
   * popups.
   * @param {!jQuery} layer
   * @param {!Object} context for visit tree
   * @return {ZOrderUtils.VISIT_RESULT}
   * @private
   * @see ZOrderUtils.findOpenPopups
   */
  ZOrderUtils._openPopupsCallback = function (layer, context) {
    /** @type {Array.<Element>} */
    var popups = context.popups;
    popups.push(layer[0]);
    return ZOrderUtils.VISIT_RESULT.ACCEPT;
  };

  /**
   * @public
   * @param {!Element} element to determine if it's above the top modal popup
   * @returns {boolean} returns <code>true</code> if the element is above the top modal popup
   */
  ZOrderUtils.isAboveTopModalLayer = function (element) {
    /**
     * @return {Element|undefined}
     */
    function getTopLayer() {
      // traverses the first level of popups looking for the popup with the highest
      // stacking context.
      // pre-order traversal
      function callback(layer, context) {
        var level = context.level;

        // first level traversal only
        if (level > 0) {
          return ZOrderUtils.VISIT_RESULT.REJECT;
        }

        var prevLayer = context.topLayer;
        if (prevLayer) {
          // if the current layer has a higher context than the prev, it becomes the top
          if (ZOrderUtils.compareStackingContexts($(layer), $(prevLayer)) > 0) {
            // eslint-disable-next-line no-param-reassign
            context.topLayer = layer;
          }
        } else {
          // eslint-disable-next-line no-param-reassign
          context.topLayer = layer;
        }
        return ZOrderUtils.VISIT_RESULT.ACCEPT;
      }

      var context = { topLayer: null };
      var defaultLayer = ZOrderUtils.getDefaultLayer();
      ZOrderUtils.preOrderVisit(defaultLayer, callback, context);
      if (context.topLayer) {
        return context.topLayer[0];
      }
      return undefined;
    }

    /**
     *
     * @param {!Element} topLayer
     * @return {Element|undefined}
     */
    function getTopModalLayer(topLayer) {
      // post-order traversal starting at the topLayer.  Retuns the modal popup at the
      // highest deepest level.
      function callback(layer, context) {
        if (layer[0].hasAttribute(ZOrderUtils._OVERLAY_ATTR)) {
          // eslint-disable-next-line no-param-reassign
          context.topModalPopup = layer;
          return ZOrderUtils.VISIT_RESULT.COMPLETE;
        }
        return ZOrderUtils.VISIT_RESULT.ACCEPT;
      }

      var context = {
        topModalPopup: null
      };
      if (topLayer.hasAttribute(ZOrderUtils._OVERLAY_ATTR)) {
        context.topModalPopup = $(topLayer);
      }

      ZOrderUtils.postOrderVisit($(topLayer), callback, context);

      if (context.topModalPopup) {
        return context.topModalPopup[0];
      }
      return undefined;
    }

    // inexpensive prerequisite check
    if (!element || !ZOrderUtils.hasPopupsOpen()) {
      return true;
    }

    // Popups closest to the body will have the greatest stacking context weight.
    // Find the top first level layer.
    var topLayer = getTopLayer();
    if (!topLayer) {
      return true;
    }

    // look for the last modal popup open starting from the top layer
    var topModalLayer = getTopModalLayer(topLayer);
    if (!topModalLayer) {
      return true;
    }

    // Returns true if the target element is a child of the top most modal layer.
    return (
      DomUtils.isAncestorOrSelf(topModalLayer, element) ||
      ZOrderUtils.compareStackingContexts($(topModalLayer), $(element)) < 0
    );
  };

  /**
   * Utility used for testing. Compares two jquery singleton wappered elements
   * determining which element has the greatest stacking context.
   * @public
   * @param {jQuery} el1 first element to compare
   * @param {jQuery} el2 second element to compare
   * @return {number} 0 if elements have the same stacking context;
   *                  1 if the first element has a greater stacking context;
   *                 -1 when the second element has a greater stacking context;
   */
  ZOrderUtils.compareStackingContexts = function (el1, el2) {
    oj.Assert.assertPrototype(el1, $);
    oj.Assert.assertPrototype(el2, $);

    function describeStackingContext(element, allLevels) {
      var positions = ['absolute', 'relative', 'fixed'];
      var parents = element.parents();

      var tmp = [];
      var i;
      for (i = parents.length - 1; i > -1; i--) {
        tmp.push($(parents[i]));
      }
      parents = tmp;

      parents.push(element);

      var stack = [];
      var level = 0;
      for (i = 0; i < parents.length; i++) {
        var parent = parents[i];
        var position = parent.css('position');
        var opacity = DomUtils.getCSSLengthAsFloat(parent.css('opacity'));
        var zindex = DomUtils.getCSSLengthAsInt(parent.css('z-index'));
        var order = $.inArray(parent[0], parent.parent().children());
        if ($.inArray(position, positions) > -1 && zindex > 0) {
          stack.push({ weight: [level, zindex, order], order: [order] });
          level += 1;
        } else if (opacity < 1) {
          stack.push({ weight: [level, 1, order], order: [order] });
          level += 1;
        } else if (allLevels) {
          stack.push({ weight: [0, 0, order], order: [order] });
        }
      }
      return stack;
    }

    function compareSets(n1, n2) {
      var maxLen = Math.max(n1.length, n2.length);
      for (var i = 0; i < maxLen; i++) {
        var _e1 = i < n1.length ? n1[i] : 0;
        var _e2 = i < n2.length ? n2[i] : 0;
        if (_e1 !== _e2) {
          if (_e1 < _e2) {
            return -1;
          }
          return 1;
        }
      }
      return 0;
    }

    var n1 = describeStackingContext(el1, false);
    var n2 = describeStackingContext(el2, false);
    var i;
    var c;
    var e1;
    var e2;

    var maxLen = Math.max(n1.length, n2.length);
    for (i = 0; i < maxLen; i++) {
      e1 = i < n1.length ? n1[i].weight : [-1];
      e2 = i < n2.length ? n2[i].weight : [-1];

      c = compareSets(e1, e2);
      if (c !== 0) {
        return c;
      }
    }

    // include all elements for tie breaker
    n1 = describeStackingContext(el1, true);
    n2 = describeStackingContext(el2, true);

    maxLen = Math.max(n1.length, n2.length);
    // tie breaker based on document order
    for (i = 0; i < maxLen; i++) {
      e1 = i < n1.length ? n1[i].order : [-1];
      e2 = i < n2.length ? n2[i].order : [-1];

      c = compareSets(e1, e2);
      if (c !== 0) {
        return c;
      }
    }

    return 0;
  };

  /**
   * Event listener that will stop propagation and prevent default on the event.
   * @param {jQuery.Event|Event} event
   * @return {void}
   * @public
   */
  ZOrderUtils.eatEvent = function (event) {
    event.stopPropagation();
    event.preventDefault();
  };

  /**
   * @public
   * @param {jQuery} popup jQuery element
   * @return {boolean} <code>true</code> if the popup is reparented into the zorder container
   */
  ZOrderUtils.isPopupOpen = function (popup) {
    // only open popups will be associated with a surrogate via parent layer
    var parent = popup.parent();
    if (parent && parent.length === 1 && ZOrderUtils._hasSurrogate(parent[0])) {
      return true;
    }
    return false;
  };

  /**
   * Key used to store the popup event callbacks on the popup layer
   * as a jQuery data property.
   * @const
   * @private
   * @type {string}
   */
  ZOrderUtils._EVENTS_DATA = 'oj-popup-events';

  /**
   * Key used to store the modality of a popup layer as a jQuery data property.
   * @const
   * @private
   * @type {string}
   */
  ZOrderUtils._MODALITY_DATA = 'oj-popup-modality';

  /**
   * Key used to store the aria-hidden elems outside of a modal popup layer
   * as a jQuery data property.
   * @const
   * @private
   * @type {string}
   */
  ZOrderUtils._ARIA_HIDDEN_ELEMS = 'oj-aria-hidden-elems';

  /**
   * The id assigned to the zorder container that will house all open popups.
   * The zorder container will be appended to the document body.
   * @const
   * @private
   * @type {string}
   */
  ZOrderUtils._DEFAULT_LAYER_ID = '__oj_zorder_container';

  /**
   * The attribute name assigned to the associated layer of open popups.  The value of the
   * attribute will point to the script element that holds the place in the document
   * that the popup originated from prior to being open.
   * @const
   * @private
   * @type {string}
   */
  ZOrderUtils._SURROGATE_ATTR = 'data-oj-surrogate-id';

  /**
   * This key that captures the popups layer id.  The layer should always be the immediate parent
   * of the popup after open but if the popup is disconnected from the layer, this is a secondary
   * link to the layer for better cleanup.
   *
   * @const
   * @private
   * @type {string}
   * @see ZOrderUtils.getOpenPopupLayer
   */
  ZOrderUtils._LAYER_ID_DATA = 'oj-popup-layer-id';

  /**
   * The attribute name assigned to the popup layer for open dialogs that have a
   * modality state of "modal".  The value of the attribute points to the associated
   * overlay element.
   * @const
   * @private
   * @type {string}
   */
  ZOrderUtils._OVERLAY_ATTR = 'data-oj-overlayid';

  /**
   * The CSS selector name assigned to the modal overlay DIV.
   * @const
   * @private
   * @type {string}
   */
  ZOrderUtils._OVERLAY_SELECTOR = 'oj-component-overlay';

  /* eslint-disable no-param-reassign */

  /**
   * Utilities used in conjunction with the jquery positon utility.
   * @ignore
   * @class PositionUtils
   * @ojtsignore
   */
  const PositionUtils = {};
  oj._registerLegacyNamespaceProp('PositionUtils', PositionUtils);

  /**
   * <p>Of the properties on the position object, "my" and "at" are of interest. The base jQuery
   * horizontal alignment mnemonics are "right", "center" and "left". For better JET RTL
   * support we have added "start" and "end".  Depending on the rtl direction, "start" and
   * "end" will be replaced with "left" or "right". The resultant postion object will
   * be a new instance that extends the position passed as the first argument.
   *
   * <p>Likewise, JET supports "<" and ">" operators wherever "-" and "+" are supported.
   * The "<" value means "- in LTR; + in RTL", while the ">" value means "+ in LTR; - in RTL".
   * E.g. a "my" value of "start<40" shifts the menu 40px "startward," while a "my" value of
   * "start>40" shifts the menu 40px "endward."
   *
   * @param {Object} position source position object
   * @param {boolean} isRtl
   * @return {Object} position object that has normalized jquery horizontal mnemonics.
   */
  PositionUtils.normalizeHorizontalAlignment = function (position, isRtl) {
    // This assertion prevents security testing: someone could pass in a bogus position
    // oj.Assert.assertObject(position, "position");
    var target = $.extend({}, position);
    for (var i = 0; i < PositionUtils._ALIGN_RULE_PROPERTIES.length; i++) {
      var propName = PositionUtils._ALIGN_RULE_PROPERTIES[i];
      var align = target[propName];
      if (align) {
        if (oj.StringUtils.isString(align)) {
          target[propName] = align
            .replace('start', isRtl ? 'right' : 'left')
            .replace('end', isRtl ? 'left' : 'right')
            .replace('<', isRtl ? '+' : '-')
            .replace('>', isRtl ? '-' : '+');
        } else {
          for (var s = 0; s < PositionUtils._SUB_ALIGN_RULE_PROPERTIES.length; s++) {
            var subPropName = PositionUtils._SUB_ALIGN_RULE_PROPERTIES[s];
            var subAlign = align[subPropName];
            if (oj.StringUtils.isString(subAlign)) {
              align[subPropName] = subAlign
                .replace('start', isRtl ? 'right' : 'left')
                .replace('end', isRtl ? 'left' : 'right')
                .replace('<', isRtl ? '+' : '-')
                .replace('>', isRtl ? '-' : '+');
            }
          }
        }
      }
    }

    return target;
  };

  /**
   * <p>In the jQuery UI [Position]{@link http://api.jqueryui.com/position/} utility,
   * the "of" field specifies the element or event relative to which the popup should
   * be positioned.
   *
   * <p>Popup components like Menu often need to position themselves relative to their
   * launcher (e.g. MenuButton), or the launching event (e.g. right-click event), both
   * of which can vary on a per-launch basis.  To facilitate specifying these policies
   * in advance, in a component option, it's useful to support "launcher" and "event"
   * keywords in the "of" field.  Without these keywords, the app would have to set
   * this field at each popup launch, via either the open() method or a beforeOpen listener,
   * at which point they could supply the actual event or launcher element for this
   * particular launch.
   *
   * <p>This method is intended to be called by the popup component at launch time.  It
   * takes an "of" field possibly containing these keywords, and the event and launcher
   * for the current launch, and returns a new "of" value where those keywords have
   * been replaced by the event or launcher, so that the resulting "position" object
   * is ready to be passed to the JQUI utility.
   *
   * <p>Since callers may have different needs, this method does not log if, say,
   * of==="event" && event==null.  Callers should log or throw if this condition
   * indicates application error.
   *
   * <p>While the code is simple, it's useful to centralize the logic to avoid subtle
   * differences in behavior among JET popup components.
   *
   * @param of the "of" field of a position object.  Defaults to "launcher" if null/undefined.
   * @param launcher launcher element
   * @param event event that opened the popup
   * @return normalized "of" value
   */
  PositionUtils.normalizePositionOf = function (of, launcher, event) {
    if (of === 'event') {
      return event;
    } else if (of == null || of === 'launcher') {
      return launcher;
    }
    return of;
  };

  // TODO: file a JQ bug and link to it here.
  /**
   * On iOS and Android, the JQ Event object wrapping touch* events lacks pageX and pageY properties, which is contrary to the
   * contract [1].  This breaks JQ's position() API [2], which assumes that the contract is obeyed.  Specifically, it
   * relies on the pageX/Y fields of the Event object passed as the "of" field (and publicly docs that it does so).
   *
   * Per W3C [3], pageX/Y are found in originalEvent.touches[i] or originalEvent.changedTouches[i], where originalEvent is
   * the native (not JQ) event, and i is 0 for us.  In practice, for touchstart at least, iOS7 and 8 Mobile Safari, but
   * apparently not Android Chrome, also put pageX and pageY on the top-level native event, and the values seem to be the
   * same as those in the touches array.  We'll use the cross-platform W3C location.
   *
   * To workaround the JQ bug, popup components like Menu can call this method at open() time.  This method copies the properties
   * to the wrapper JQ event.
   *
   * [1] http://api.jquery.com/category/events/event-object/
   * [2] http://api.jqueryui.com/position/
   * [3] http://www.w3.org/TR/touch-events/#touch-interface et. seq.
   *
   * @private
   * @param event
   */
  PositionUtils._normalizeEventForPosition = function (event) {
    $.each(['pageX', 'pageY'], function (index, pagePos) {
      if (event && event[pagePos] === undefined && event.originalEvent) {
        var originalEvent = event.originalEvent;
        var type = originalEvent.type;
        var touchList;

        if (type === 'touchstart' || type === 'touchmove') {
          touchList = 'touches';
        } else if (type === 'touchend') {
          touchList = 'changedTouches';
        } else {
          touchList = null;
        }

        if (touchList) {
          var firstTouch = originalEvent[touchList][0];
          if (firstTouch) {
            // eslint-disable-next-line no-param-reassign
            event[pagePos] = firstTouch[pagePos];
          }
        }
      }
    });
  };

  /**
   * @private
   * @const
   */
  PositionUtils._ALIGN_RULE_PROPERTIES = ['my', 'at'];

  /**
   * @private
   * @const
   */
  PositionUtils._SUB_ALIGN_RULE_PROPERTIES = ['vertical', 'horizontal'];

  /**
   * A common utilty that is designed be be called for a jquery ui position "using" callback
   * that will check to see if the target aligning "of" position is clipped in an overflow
   * container.  Used by popups that should auto dismiss when what they are aligning to is
   * no longer visible.  The aligning position can be either an element, event or a rect.
   *
   * @param {Object} props second argument to the jquery ui position "using" callback.
   * @returns {boolean} <code>true</code> if the point aligned is not totally visible in and overflow container
   */
  PositionUtils.isAligningPositionClipped = function (props) {
    // Alignment can be to an element, event or a rect but we only care to make this
    // check if alignment is to an element - .
    if (props.target && props.target.height > 0 && props.target.width > 0) {
      // if the target has a width and height greater than zero then it's an element
      /** @type {jQuery} */
      var positionOf = props.target.element;
      return !PositionUtils.isWithinViewport(positionOf);
    }
    return false;
  };

  /**
   * Returns <code>true</code> if the jquery element is visible within overflow an
   * overflow container. The check only considers statically positioned elements and
   * stops short of the body.
   *
   * The first positioned ancestor is treated as the root viewport. Positioned elements need be
   * compared with the window viewport versus its ancestors.  Visibility of positioned
   * elements also need to compare stacking contexts within the document to determine
   * what is on top "visible" - thus excluded from this check.
   *
   * @param {jQuery} element jquery element to test
   * @returns {boolean}
   */
  PositionUtils.isWithinViewport = function (element) {
    function isVisible(alignBox, containerBox) {
      var scrollBarWidth;
      if (['hidden', 'scroll', 'auto'].indexOf(containerBox.overflowY) > -1) {
        // 1px fudge factor for rounding errors
        if (alignBox.bottom - containerBox.top < -1) {
          return false;
        }

        // find horizontal scrollbar size. always present when "scroll", or when "auto" and scrollWidth > innerWidth
        scrollBarWidth =
          (containerBox.overflowX === 'auto' && containerBox.scrollWidth > containerBox.innerWidth) ||
          containerBox.overflowX === 'scroll'
            ? DomUtils.getScrollBarWidth()
            : 0;
        if (containerBox.bottom - scrollBarWidth - alignBox.top < 1) {
          return false;
        }
      }

      if (['hidden', 'scroll', 'auto'].indexOf(containerBox.overflowX) > -1) {
        // find vertical scrollbar width. always present when "scroll", or when "auto" and scrollHeight > innerHeight
        scrollBarWidth =
          (containerBox.overflowY === 'auto' &&
            containerBox.scrollHeight > containerBox.innerHeight) ||
          containerBox.overflowY === 'scroll'
            ? DomUtils.getScrollBarWidth()
            : 0;

        // depending on ltr vs rtl, the vertical scrollbar can be on either side of the container, so only include the side its on
        if (
          alignBox.right -
            (containerBox.left + (DomUtils.getReadingDirection() === 'rtl' ? scrollBarWidth : 0)) <
            -1 ||
          alignBox.left -
            (containerBox.right - (DomUtils.getReadingDirection() === 'ltr' ? scrollBarWidth : 0)) >
            -1
        ) {
          return false;
        }
      }

      return true;
    }

    function hasOverflow(_element) {
      return _element.css('overflow-x') !== 'visible' || _element.css('overflow-y') !== 'visible';
    }

    function getRect(_element) {
      var domElement = _element[0];
      if (domElement.nodeType === 1) {
        var rec = $.extend({}, domElement.getBoundingClientRect());
        rec.overflowX = _element.css('overflow-x');
        rec.overflowY = _element.css('overflow-y');
        rec.innerHeight = _element.innerHeight();
        rec.innerWidth = _element.innerWidth();
        rec.scrollHeight = domElement.scrollHeight;
        rec.scrollWidth = domElement.scrollWidth;
        return rec;
      }
      return { height: 0, width: 0 };
    }

    function isPositioned(_element) {
      return (
        ['fixed', 'absolute', 'relative', 'sticky'].indexOf(_element.css('position')) > -1 &&
        (!isNaN(parseInt(_element.css('top'), 10)) ||
          !isNaN(parseInt(_element.css('bottom'), 10)) ||
          !isNaN(parseInt(_element.css('left'), 10)) ||
          !isNaN(parseInt(_element.css('right'), 10)))
      );
    }

    if (!element) {
      return false;
    } else if ($.isWindow(element[0]) || isPositioned(element)) {
      return true;
    }

    var alignBox = getRect(element);

    // check that the element is not hidden in overflow
    var isWithinViewPort = true;
    var parent = element.parent();
    while (
      isWithinViewPort &&
      parent &&
      parent.length > 0 &&
      parent[0].nodeName !== 'BODY' &&
      parent[0].nodeType === 1 &&
      !isPositioned(parent)
    ) {
      if (hasOverflow(parent)) {
        var parentBox = getRect(parent);
        // ignore elements with empty border-boxes
        if (parentBox.height > 0 && parentBox.width > 0) {
          isWithinViewPort = isVisible(alignBox, parentBox);
        }
      }
      parent = parent.parent();
    }

    return isWithinViewPort;
  };

  /**
   * Mapping of horizontal-vertical (x,y) alignment positon to the corresponding css
   * "transform-origin" attribute.
   *
   * horizontal: right, left, center
   * vertical: top, bottom, middle
   *
   * @private
   * @const
   */
  PositionUtils._ANIMATION_TRANSFORM_ORIGIN_RULES = {
    'right-top': 'right top',
    'right-middle': 'right center',
    'right-bottom': 'right bottom',
    'left-top': 'left top',
    'left-middle': 'left center',
    'left-bottom': 'left bottom',
    'center-top': 'center top',
    'center-middle': 'center center',
    'center-bottom': 'center bottom'
  };

  /**
   * Data attribute key used to store the alignment of the popup relative
   * to the aligning element - position.of
   *
   * @private
   * @const
   * @type {string}
   */
  PositionUtils._ALIGN_MNEMONIC_DATA = 'oj-popup-align-mnemonic';

  /**
   * Pass the root popup element and the second argument of the jquery ui position utils using
   * callback.  Stashes away the alignment hints returned by the position utility as a data property
   * on the target jquery element.  The alignment hints are used to define the transform-origin
   * of animation effects.
   *
   * @see PositionUtils.addTransformOriginAnimationEffectsOption
   * @param {jQuery} element popup root node
   * @param {Object} props second argument to the jquery ui position "using" callback.
   * @return {void}
   */
  PositionUtils.captureTransformOriginAnimationEffectsOption = function (element, props) {
    var alignMnemonic = [props.horizontal, props.vertical].join('-');
    element.data(PositionUtils._ALIGN_MNEMONIC_DATA, alignMnemonic);
  };

  /**
   * Pass "open" or "close" animation effects.  Replaces occurances of
   * "transformOrigin":"#myPositon" with a value that represents the popups alignment.
   *
   * @see PositionUtils.captureTransformOriginAnimationEffectsOption
   * @param {jQuery} element popup root node
   * @param {string|Object|Array} effects animation instructions
   * @returns {string|Object|Array} effects with the transformOrign property resolved
   */
  PositionUtils.addTransformOriginAnimationEffectsOption = function (element, effects) {
    var effectsAsString;
    var isEffectsTypeofString;

    if (!oj.StringUtils.isString(effects)) {
      isEffectsTypeofString = false;
      effectsAsString = JSON.stringify(effects);
    } else {
      isEffectsTypeofString = true;
      effectsAsString = effects;
    }

    var exp = /#myPosition/g;
    if (effectsAsString.match(exp)) {
      var alignMnemonic = /** @type {string} */ (element.data(PositionUtils._ALIGN_MNEMONIC_DATA));
      if (oj.StringUtils.isEmptyOrUndefined(alignMnemonic)) {
        alignMnemonic = 'center-middle';
      }

      var transformOrigin = PositionUtils._ANIMATION_TRANSFORM_ORIGIN_RULES[alignMnemonic];

      effectsAsString = effectsAsString.replace(exp, transformOrigin);

      // eslint-disable-next-line no-param-reassign
      effects = isEffectsTypeofString
        ? effectsAsString
        : /** @type {Object} */ (JSON.parse(effectsAsString));
    }

    return effects;
  };

  /**
   * Splits the jquery UI vertical mnemonic into 3 groups.
   * @private
   * @constant {RegExp}
   */
  PositionUtils._JQUI_MNEMONIC_GRP_REGX = /^(\w+)(\+|-)?(\d+)?/;

  /**
   * Verify vertical mnemonic.
   * @private
   * @constant {RegExp}
   */
  PositionUtils._VERTICAL_ENUM_TST_REGX = /^top$|^center$|^bottom$/;

  /**
   * Verify horizontal mnemonic.
   * @private
   * @constant {RegExp}
   */
  PositionUtils._HORIZONTAL_ENUM_TST_REGX = /^start$|^left$|^center$|^end$|^right$/;

  /**
   * Verify collision mnemonic.
   * @private
   * @constant {RegExp}
   */
  PositionUtils._COLLISION_ENUM_TST_REGX = /^none$|^flip$|^flipfit$|^fit$|^flipcenter$/;

  /**
   * @private
   * @param {string} token containing a position alignment rule
   * @param {RegExp} testRegX regular expression to verify the token enumerations
   * @returns {Array} array of two values [alignment, offset].
   */
  PositionUtils._parsePositionNmnemonic = function (token, testRegX) {
    var data = [null, Number.NaN];
    var groups = PositionUtils._JQUI_MNEMONIC_GRP_REGX.exec(token);

    if (groups[1] && testRegX.test(groups[1])) {
      data[0] = groups[1];

      // has an offset prefiex by +|-
      if (groups[2]) {
        var offset = parseInt(groups[3], 10);
        if (!isNaN(offset)) {
          offset *= groups[2] === '-' ? -1 : 1;
          data[1] = offset;
        }
      }
    }
    return data;
  };

  /**
   *
   * @private
   * @param {?} value that might be a json string
   * @returns {?} returns an object if the value is a json string; otherwise,
   *          a null value is returned.
   */
  PositionUtils._parseJSON = function (value) {
    if (oj.StringUtils.isString(value) && /^{/.test(value) && /}$/.test(value)) {
      try {
        return JSON.parse(value);
      } catch (e) {
        // Ignore errors
      }
    }

    return null;
  };

  /**
   * Converts a source "position.my" or "position.at" into a suitable state held by jet components.
   *
   * @param {string} type "my" or "at"
   * @param {Object} source postion.my or position.at to shape into a Jet position object
   * @param {Object=} offsetSource position.offset
   * @param {Object=} sourceDefault default values
   * @returns {Object} internal position impl
   * @private
   */
  PositionUtils._coerceMyAtToJet = function (type, source, offsetSource, sourceDefault) {
    var obj = PositionUtils._parseJSON(source);
    if (obj) {
      // eslint-disable-next-line no-param-reassign
      source = obj;
    }

    obj = PositionUtils._parseJSON(offsetSource);
    if (obj) {
      // eslint-disable-next-line no-param-reassign
      offsetSource = obj;
    }

    if (!sourceDefault) {
      // eslint-disable-next-line no-param-reassign
      sourceDefault = {};
    }

    var target = $.extend({}, sourceDefault);
    var offsetTarget = { x: 0, y: 0 };
    if (offsetSource && 'x' in offsetSource && 'y' in offsetSource) {
      offsetTarget.x = DomUtils.getCSSLengthAsInt(offsetSource.x);
      offsetTarget.y = DomUtils.getCSSLengthAsInt(offsetSource.y);
    }

    var groups;

    if (oj.StringUtils.isString(source)) {
      // jquery ui
      // split horizontal and vertical tokens
      var tokens = source.split(/\s/);

      // parse horizontal
      if (tokens.length > 0 && !oj.StringUtils.isEmpty(tokens[0])) {
        groups = PositionUtils._parsePositionNmnemonic(
          tokens[0],
          PositionUtils._HORIZONTAL_ENUM_TST_REGX
        );

        // verify horizontal enum
        if (groups[0]) {
          target.horizontal = groups[0];
          if (!isNaN(groups[1])) {
            offsetTarget.x = groups[1];
          }
        }
      }

      // parse vertical
      if (tokens.length > 1 && !oj.StringUtils.isEmpty(tokens[1])) {
        groups = PositionUtils._parsePositionNmnemonic(
          tokens[1],
          PositionUtils._VERTICAL_ENUM_TST_REGX
        );

        // verify vertical enum
        if (groups[0]) {
          target.vertical = groups[0];
          if (!isNaN(groups[1])) {
            offsetTarget.y = groups[1];
          }
        }
      }
    } else if (source) {
      // my is is in the jet position format
      if ('horizontal' in source) {
        groups = PositionUtils._parsePositionNmnemonic(
          source.horizontal,
          PositionUtils._HORIZONTAL_ENUM_TST_REGX
        );

        if (groups[0]) {
          target.horizontal = groups[0];
          if (!isNaN(groups[1])) {
            offsetTarget.x = groups[1];
          }
        }
      }

      if ('vertical' in source) {
        groups = PositionUtils._parsePositionNmnemonic(
          source.vertical,
          PositionUtils._VERTICAL_ENUM_TST_REGX
        );

        if (groups[0]) {
          target.vertical = groups[0];
          if (!isNaN(groups[1])) {
            offsetTarget.y = groups[1];
          }
        }
      }
    }

    var targetPosition = {};
    targetPosition[type] = target;
    targetPosition.offset = offsetTarget;
    return targetPosition;
  };

  /**
   * Converts a source "position.collision" into a suitable state held by jet components.
   *
   * @param {string} collisionSource postion.collision to shape into a Jet position object
   * @param {string=} collisionDefault default values
   * @returns {Object} internal position impl
   * @private
   */
  PositionUtils._coerceCollisionToJet = function (collisionSource, collisionDefault) {
    var collisionTarget = collisionDefault;

    if (PositionUtils._COLLISION_ENUM_TST_REGX.test(collisionSource)) {
      collisionTarget = collisionSource;
    }

    return { collision: collisionTarget };
  };

  /**
   * Converts a source "position.of" into a suitable state held by jet components.
   *
   * @param {Object} ofSource position.of
   * @param {Object=} ofDefault default value
   * @return {Object} internal postion object
   * @private
   */
  PositionUtils._coerceOfToJet = function (ofSource, ofDefault) {
    function _escapeId(id) {
      var targetId = [];
      var regex = /\w|_|-/;

      for (var i = 0; i < id.length; i++) {
        var c = id.substring(i, i + 1);
        if (regex.test(c)) {
          targetId.push(c);
        } else {
          targetId.push('\\' + c);
        }
      }
      return targetId.join('');
    }

    var obj = PositionUtils._parseJSON(ofSource);
    if (obj) {
      // eslint-disable-next-line no-param-reassign
      ofSource = obj;
    }

    var targetOf = ofDefault;

    if (oj.StringUtils.isString(ofSource)) {
      targetOf = ofSource; // assume a valid selector
    } else if ($.isWindow(ofSource)) {
      targetOf = 'window';
    } else if (ofSource instanceof Element || ofSource instanceof $) {
      // eslint-disable-next-line no-param-reassign
      ofSource = $(ofSource);
      ofSource.uniqueId();
      var id = ofSource.attr('id');
      targetOf = '#' + _escapeId(id);
    } else if (ofSource instanceof Event || ofSource instanceof $.Event) {
      if ('pageX' in ofSource || 'pageY' in ofSource) {
        targetOf = {};
        targetOf.x = DomUtils.getCSSLengthAsFloat(ofSource.pageX);
        targetOf.y = DomUtils.getCSSLengthAsFloat(ofSource.pageY);
      }
    } else if (ofSource) {
      if ('x' in ofSource || 'y' in ofSource) {
        targetOf = {};
        targetOf.x = DomUtils.getCSSLengthAsFloat(ofSource.x);
        targetOf.y = DomUtils.getCSSLengthAsFloat(ofSource.y);
      }
    }

    return { of: targetOf };
  };

  /**
   * Converts a source "position" into a suitable state held by jet components.
   *
   * @param {Object} source position
   * @param {Object=} defaults for target position
   * @return {Object} internal postion object
   */
  PositionUtils.coerceToJet = function (source, defaults) {
    if (!source) {
      // eslint-disable-next-line no-param-reassign
      source = {};
    }

    var obj = PositionUtils._parseJSON(source);
    if (obj) {
      // eslint-disable-next-line no-param-reassign
      source = obj;
    }

    if (!defaults) {
      // eslint-disable-next-line no-param-reassign
      defaults = {};
    }

    function _coerceUsingToJet(usingSource, usingDefault) {
      var targetUsing = $.isFunction(usingSource) ? usingSource : usingDefault;
      return { using: targetUsing };
    }

    var myDefault = defaults.my;
    var atDefault = defaults.at;
    var collisionDefault = defaults.collision;
    var ofDefault = defaults.of;
    var usingDefault; // to dangerous to inherit

    var targetMy = PositionUtils._coerceMyAtToJet('my', source.my, source.offset, myDefault);
    var targetAt = PositionUtils._coerceMyAtToJet('at', source.at, null, atDefault);

    // sum the "at" and "my" offsets
    var targetOffset = {
      offset: {
        x: targetMy.offset.x + targetAt.offset.x,
        y: targetMy.offset.y + targetAt.offset.y
      }
    };
    delete targetMy.offset;
    delete targetAt.offset;

    var target = $.extend(
      {},
      targetMy,
      targetAt,
      targetOffset,
      PositionUtils._coerceCollisionToJet(source.collision, collisionDefault),
      PositionUtils._coerceOfToJet(source.of, ofDefault),
      _coerceUsingToJet(source.using, usingDefault)
    );

    return target;
  };

  /**
   * Converts the jet position object into the jQuery UI object used by the position utility.
   *
   * @param {Object} source internal position object
   * @return {Object} jQuery UI position Object
   */
  PositionUtils.coerceToJqUi = function (source) {
    function alignToJqUi(align, direction) {
      var tokens = [];
      if (source[align][direction]) {
        tokens.push(source[align][direction]);
      } else {
        tokens.push('center');
      }

      if (align === 'my' && source.offset) {
        var offsetDirection = direction === 'horizontal' ? 'x' : 'y';
        var offset = source.offset[offsetDirection];
        if (!isNaN(offset) && offset !== 0) {
          tokens.push(offset > 0 ? '+' : '');
          tokens.push(Math.floor(offset).toString());
        }
      }

      return tokens.join('');
    }

    var target = {};

    // convert my and at
    ['my', 'at'].forEach(function (align) {
      if (source[align]) {
        var tokens = [];
        tokens.push(alignToJqUi(align, 'horizontal'));
        tokens.push(' ');
        tokens.push(alignToJqUi(align, 'vertical'));
        target[align] = tokens.join('');
      }
    });

    // convert of
    var ofSource = source.of;
    if (oj.StringUtils.isString(ofSource)) {
      if (ofSource === 'window') {
        target.of = window;
      } else {
        target.of = ofSource;
      }
    } else if (ofSource && !oj.StringUtils.isString(ofSource) && 'x' in ofSource && 'y' in ofSource) {
      var x = ofSource.x;
      var y = ofSource.y;
      var nativeEvent = document.createEvent('MouseEvents');
      nativeEvent.initMouseEvent(
        'click',
        true,
        true,
        window,
        1,
        x,
        y,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        null
      );
      target.of = $.Event(nativeEvent, { pageX: x, pageY: y });
    } else {
      target.of = ofSource;
    }

    if (source.collision) {
      target.collision = source.collision;
    }

    // convert using
    if (source.using) {
      target.using = source.using;
    }

    return target;
  };

  /**
   * Calculates available width and height for a popup based on the position 'using'
   * callback feedback.
   *
   * @param {Object} pos current popup position (left, top) returned by jqueryui.position
   * @param {Object} feedback an object with target and popup coordinates passed to
   *                          the position 'using' callback
   * @param {Element=} withinElem optional bounding element for popup position calculation
   *                          default is 'window'
   * @return {Object} object with max available popup width and height within current constraints
   */
  PositionUtils.calcAvailablePopupSize = function (pos, feedback, withinElem) {
    var within = $.position.getWithinInfo(withinElem || window);
    var scrollInfo = $.position.getScrollInfo(within);
    var isRtl = DomUtils.getReadingDirection() === 'rtl';

    var paddingLeft = isRtl ? scrollInfo.width : 0;
    var paddingRight = isRtl ? 0 : scrollInfo.width;

    var element = feedback.element;
    var target = feedback.target;

    var scrollLeft = within.isWindow ? within.scrollLeft : 0;
    var scrollTop = within.isWindow ? within.scrollTop : 0;

    var elemLeft = element.left;
    var elemRight = element.left + element.width;
    var elemTop = element.top;
    var elemBottom = element.top + element.height;
    var targetLeft = target.left;
    var targetRight = target.left + target.width;
    var targetTop = target.top;
    var targetBottom = target.top + target.height;
    var withinLeft = within.offset.left + scrollLeft + paddingLeft;
    // eslint-disable-next-line no-mixed-operators
    var withinRight = within.offset.left + within.width + scrollLeft - paddingRight;
    var withinTop = within.offset.top + scrollTop;
    // eslint-disable-next-line no-mixed-operators
    var withinBottom = within.offset.top + within.height + scrollTop - scrollInfo.height;

    var minLeft;
    var maxRight;
    var minTop;
    var maxBottom;

    if (elemLeft < targetLeft) {
      minLeft = withinLeft;
      if (elemRight <= targetLeft) {
        maxRight = targetLeft;
      } else if (elemRight <= targetRight) {
        maxRight = Math.min(targetRight, withinRight);
      } else {
        maxRight = withinRight;
      }
    } else if (elemLeft === targetLeft) {
      if (targetLeft - withinLeft > withinRight - targetRight) {
        minLeft = withinLeft;
        maxRight = targetRight;
      } else {
        minLeft = targetLeft;
        maxRight = withinRight;
      }
    } else if (elemLeft < targetRight) {
      minLeft = targetLeft;
      if (elemRight <= targetRight) {
        maxRight = targetRight;
      } else {
        maxRight = withinRight;
      }
    } else {
      minLeft = targetRight;
      maxRight = withinRight;
    }

    if (elemTop < targetTop) {
      minTop = withinTop;
      if (elemBottom <= targetTop) {
        maxBottom = targetTop;
      } else if (elemBottom <= targetBottom) {
        maxBottom = Math.min(targetBottom, withinBottom);
      } else {
        maxBottom = withinBottom;
      }
    } else if (elemTop === targetTop) {
      minTop = targetTop;
      maxBottom = withinBottom;
    } else if (elemTop < targetBottom) {
      minTop = targetTop;
      if (elemBottom <= targetBottom) {
        maxBottom = targetBottom;
      } else {
        maxBottom = withinBottom;
      }
    } else {
      minTop = targetBottom;
      maxBottom = withinBottom;
    }

    return {
      width: maxRight - minLeft,
      height: maxBottom - minTop
    };
  };

  /**
   * Forked version of jQueryUI.position() API with JET bug fixes.
   *
   */
  (function () {
    /**
     * @ojtsignore
     */
    var cachedScrollbarWidth;
    var max = Math.max;
    var abs = Math.abs;
    const rhorizontal = /left|center|right/;
    const rvertical = /top|center|bottom/;
    const roffset = /[+-]\d+(\.[\d]+)?%?/;
    const rposition = /^\w+/;
    const rpercent = /%$/;
    var _position = $.fn.position;

    var _origGetWithinInfo = $.position.getWithinInfo; // stash away the original getWithinInfo method

    function getOffsets(offsets, width, height) {
      return [
        parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1),
        parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)
      ];
    }

    function parseCss(element, property) {
      return parseInt($.css(element, property), 10) || 0;
    }

    function isWindow(obj) {
      return obj != null && obj === obj.window;
    }

    function getDimensions(elem) {
      var raw = elem[0];
      if (raw.nodeType === 9) {
        return {
          width: elem.width(),
          height: elem.height(),
          offset: { top: 0, left: 0 }
        };
      }
      if (isWindow(raw)) {
        // JET-41302: jQuery's $(window).height() does not reflect changing window height
        // for dynamic browser adress bar and toolbar behavior while scrolling.
        // Need to use window.innerHeight on mobile.
        var agentInfo = oj.AgentUtils.getAgentInfo();
        var isMobile =
          oj.AgentUtils.OS.ANDROID === agentInfo.os || oj.AgentUtils.OS.IOS === agentInfo.os;
        return {
          width: elem.width(),
          height: isMobile ? raw.innerHeight : elem.height(),
          offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
        };
      }
      if (raw.preventDefault) {
        return {
          width: 0,
          height: 0,
          offset: { top: raw.pageY, left: raw.pageX }
        };
      }
      return {
        width: elem.outerWidth(),
        height: elem.outerHeight(),
        offset: elem.offset()
      };
    }

    /**
     * Forked jqueryUI $.position.scrollbarWidth() implementation.
     *
     * The original implementation in jqueryUI is not CSP compliant as
     * it creates a div with inline style. Our implementation replaces
     * the inline style definition with individual style property settings
     * on a temporary div element.
     *
     * The fork also includes the $.position.getScrollInfo method which depends
     * on $.position.scrollbarWidth via a local reference, so we cannot simply
     * delegate to the original method, because it would use the old
     * scrollbarWidth() version.
     *
     */
    $.position = {
      getWithinInfo: _origGetWithinInfo.bind(this),

      scrollbarWidth: function () {
        if (cachedScrollbarWidth !== undefined) {
          return cachedScrollbarWidth;
        }
        var w1;
        var w2;
        var div = document.createElement('div');
        div.style.display = 'block';
        div.style.position = 'absolute';
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflow = 'hidden';
        var innerDiv = document.createElement('div');
        innerDiv.style.height = '100px';
        innerDiv.style.width = 'auto';
        div.appendChild(innerDiv); // @HTMLUpdateOK
        $('body').append($(div)); // @HTMLUpdateOK
        w1 = innerDiv.offsetWidth;
        div.style.overflow = 'scroll';
        w2 = innerDiv.offsetWidth;
        if (w1 === w2) {
          w2 = div.clientWidth;
        }
        $(div).remove();
        cachedScrollbarWidth = w1 - w2;
        return cachedScrollbarWidth;
      },

      getScrollInfo: function (within) {
        var overflowX = within.isWindow || within.isDocument ? '' : within.element.css('overflow-x');
        var overflowY = within.isWindow || within.isDocument ? '' : within.element.css('overflow-y');
        var hasOverflowX =
          overflowX === 'scroll' ||
          (overflowX === 'auto' && within.width < within.element[0].scrollWidth);
        var hasOverflowY =
          overflowY === 'scroll' ||
          (overflowY === 'auto' && within.height < within.element[0].scrollHeight);

        return {
          width: hasOverflowY ? $.position.scrollbarWidth() : 0,
          height: hasOverflowX ? $.position.scrollbarWidth() : 0
        };
      }
    };

    $.fn.position = function (options) {
      if (!options || !options.of) {
        return _position.apply(this, arguments);
      }

      // Make a copy, we don't want to modify arguments
      options = $.extend({}, options);

      var atOffset;
      var targetWidth;
      var targetHeight;
      var targetOffset;
      var basePosition;
      var dimensions;

      // Make sure string options are treated as CSS selectors
      var target = typeof options.of === 'string' ? $(document).find(options.of) : $(options.of);

      var within = $.position.getWithinInfo(options.within);
      var scrollInfo = $.position.getScrollInfo(within);
      var collision = (options.collision || 'flip').split(' ');
      var offsets = {};

      dimensions = getDimensions(target);
      if (target[0].preventDefault) {
        // Force left top to allow flipping
        options.at = 'left top';
      }
      targetWidth = dimensions.width;
      targetHeight = dimensions.height;
      targetOffset = dimensions.offset;

      // Clone to reuse original targetOffset later
      basePosition = $.extend({}, targetOffset);

      // Force my and at to have valid horizontal and vertical positions
      // if a value is missing or invalid, it will be converted to center
      $.each(['my', 'at'], function () {
        var pos = (options[this] || '').split(' ');
        var horizontalOffset;
        var verticalOffset;

        if (pos.length === 1) {
          pos = rhorizontal.test(pos[0])
            ? pos.concat(['center'])
            : rvertical.test(pos[0])
            ? ['center'].concat(pos)
            : ['center', 'center'];
        }
        pos[0] = rhorizontal.test(pos[0]) ? pos[0] : 'center';
        pos[1] = rvertical.test(pos[1]) ? pos[1] : 'center';

        // Calculate offsets
        horizontalOffset = roffset.exec(pos[0]);
        verticalOffset = roffset.exec(pos[1]);
        offsets[this] = [
          horizontalOffset ? horizontalOffset[0] : 0,
          verticalOffset ? verticalOffset[0] : 0
        ];

        // Reduce to just the positions without the offsets
        options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]];
      });

      // Normalize collision option
      if (collision.length === 1) {
        collision[1] = collision[0];
      }

      if (options.at[0] === 'right') {
        basePosition.left += targetWidth;
      } else if (options.at[0] === 'center') {
        basePosition.left += targetWidth / 2;
      }

      if (options.at[1] === 'bottom') {
        basePosition.top += targetHeight;
      } else if (options.at[1] === 'center') {
        basePosition.top += targetHeight / 2;
      }

      atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
      basePosition.left += atOffset[0];
      basePosition.top += atOffset[1];

      return this.each(function () {
        var collisionPosition;
        var using;
        var elem = $(this);
        var elemWidth = elem.outerWidth();
        var elemHeight = elem.outerHeight();
        var marginLeft = parseCss(this, 'marginLeft');
        var marginTop = parseCss(this, 'marginTop');
        var collisionWidth =
          elemWidth + marginLeft + parseCss(this, 'marginRight') + scrollInfo.width;
        var collisionHeight =
          elemHeight + marginTop + parseCss(this, 'marginBottom') + scrollInfo.height;
        var position = $.extend({}, basePosition);
        var myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

        if (options.my[0] === 'right') {
          position.left -= elemWidth;
        } else if (options.my[0] === 'center') {
          position.left -= elemWidth / 2;
        }

        if (options.my[1] === 'bottom') {
          position.top -= elemHeight;
        } else if (options.my[1] === 'center') {
          position.top -= elemHeight / 2;
        }

        position.left += myOffset[0];
        position.top += myOffset[1];

        collisionPosition = {
          marginLeft: marginLeft,
          marginTop: marginTop
        };

        $.each(['left', 'top'], function (i, dir) {
          if ($.ui.position[collision[i]]) {
            $.ui.position[collision[i]][dir](position, {
              targetWidth: targetWidth,
              targetHeight: targetHeight,
              elemWidth: elemWidth,
              elemHeight: elemHeight,
              collisionPosition: collisionPosition,
              collisionWidth: collisionWidth,
              collisionHeight: collisionHeight,
              offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
              my: options.my,
              at: options.at,
              within: within,
              elem: elem
            });
          }
        });

        // JET-56620: normalize position left/top to integer values to avoid unnecessary
        // repositioning caused by potential floating number oscillations
        position.left = Math.round(position.left);
        position.top = Math.round(position.top);

        if (options.using) {
          // Adds feedback as second argument to using callback, if present
          using = function (props) {
            var left = targetOffset.left - position.left;
            var right = left + targetWidth - elemWidth;
            var top = targetOffset.top - position.top;
            var bottom = top + targetHeight - elemHeight;
            var feedback = {
              target: {
                element: target,
                left: targetOffset.left,
                top: targetOffset.top,
                width: targetWidth,
                height: targetHeight
              },
              element: {
                element: elem,
                left: position.left,
                top: position.top,
                width: elemWidth,
                height: elemHeight
              },
              horizontal: right < 0 ? 'left' : left > 0 ? 'right' : 'center',
              vertical: bottom < 0 ? 'top' : top > 0 ? 'bottom' : 'middle'
            };
            if (targetWidth < elemWidth && Math.abs(left + right) < targetWidth) {
              feedback.horizontal = 'center';
            }
            if (targetHeight < elemHeight && Math.abs(top + bottom) < targetHeight) {
              feedback.vertical = 'middle';
            }
            if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
              feedback.important = 'horizontal';
            } else {
              feedback.important = 'vertical';
            }
            options.using.call(this, props, feedback);
          };
        }

        elem.offset($.extend(position, { using: using }));
      });
    };

    /**
     * Forked the jquery UI "flip" position collision rule in version 1.11.4.
     * The jquery version doesn't consider the best fit in terms of
     * top/bottom. The rule favors top when there is no fit versus choosing the
     * best fit, lesser of two evils. The new JET spin of this rule will pick
     * the better fit versus favoring top when there is no fit.
     *
     * Outside of making the code closure compiler friendly, there is only
     * a single line difference.  It's noted with a bug number.
     * @private
     */
    var _origLeftFlipCollisionRule = $.ui.position.flip.left; // stash away the original left flip rule

    /**
     * @ojtsignore
     */
    $.ui.position.flip = {
      left: _origLeftFlipCollisionRule.bind(this),
      /**
       * @param {{top: number, left: number}} position
       * @param {{targetWidth: number,
       *         targetHeight: number,
       *         elemWidth: number,
       *         elemHeight: number,
       *         collisionPosition: {marginLeft: number, marginTop: number},
       *         collisionWidth: number,
       *         collisionHeight: number,
       *         offset: Array.<number>,
       *         my: Array.<string>,
       *         at: Array.<string>,
       *         within: {element: jQuery, isWindow: boolean, isDocument: boolean, offset: {left: number, top: number}, scrollLeft: number, scrollTop: number, width: number, height: number},
       *         elem: jQuery
       *        }} data
       * @returns {undefined}
       */
      top: function (position, data) {
        var within = data.within;
        var withinOffset = within.offset.top + within.scrollTop;
        var outerHeight = within.height;
        var offsetTop = within.isWindow ? within.scrollTop : within.offset.top;
        var collisionPosTop = position.top - data.collisionPosition.marginTop;
        var overTop = collisionPosTop - offsetTop;
        var overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop;
        var top = data.my[1] === 'top';

        var myOffset;
        if (top) {
          myOffset = -data.elemHeight;
        } else if (data.my[1] === 'bottom') {
          myOffset = data.elemHeight;
        } else {
          myOffset = 0;
        }

        var atOffset;
        if (data.at[1] === 'top') {
          atOffset = data.targetHeight;
        } else if (data.at[1] === 'bottom') {
          atOffset = -data.targetHeight;
        } else {
          atOffset = 0;
        }

        var offset = -2 * data.offset[1];
        var newOverBottom;
        var newOverTop;
        if (overTop < 0) {
          newOverBottom =
            position.top +
            myOffset +
            atOffset +
            offset +
            data.collisionHeight -
            outerHeight -
            withinOffset;
          if (newOverBottom < 0 || newOverBottom < Math.abs(overTop)) {
            //  - only flip up if there is more "over" on top than bottom
            if (overBottom < 0 && overTop > overBottom) {
              // eslint-disable-next-line no-param-reassign
              position.top += myOffset + atOffset + offset;
            }
          }
        } else if (overBottom > 0) {
          newOverTop =
            position.top -
            data.collisionPosition.marginTop +
            myOffset +
            atOffset +
            offset -
            offsetTop;
          if (newOverTop > 0 || Math.abs(newOverTop) < overBottom) {
            // eslint-disable-next-line no-param-reassign
            position.top += myOffset + atOffset + offset;
          }
        }
      }
    };

    /**
     * Forked the jquery UI "fit" position collision rule.
     * The jquery version can return negative left and top positions. This
     * is a problem because the page cannot be scrolled to negative
     * coordinates and parts of the popup may not be accessible.
     *
     * Outside of making the code closure compiler friendly, the only
     * difference is the test whether the returned position is negative.
     * If so, it is set to 0 to make the popup "fit" in the page.
     */

    /**
     * @ojtsignore
     */
    $.ui.position.fit = {
      left: function (position, data) {
        var within = data.within;
        var withinOffset = within.isWindow ? within.scrollLeft : within.offset.left;
        var outerWidth = within.width;
        var collisionPosLeft = position.left - data.collisionPosition.marginLeft;
        var overLeft = withinOffset - collisionPosLeft;
        var overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset;
        var newOverRight;

        // Element is wider than within
        if (data.collisionWidth > outerWidth) {
          // Element is initially over the left side of within
          if (overLeft > 0 && overRight <= 0) {
            newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
            position.left += overLeft - newOverRight;

            // Element is initially over right side of within
          } else if (overRight > 0 && overLeft <= 0) {
            position.left = withinOffset;

            // Element is initially over both left and right sides of within
          } else {
            // eslint-disable-next-line no-lonely-if
            if (overLeft > overRight) {
              position.left = withinOffset + outerWidth - data.collisionWidth;
            } else {
              position.left = withinOffset;
            }
          }

          // Too far left -> align with left edge
        } else if (overLeft > 0) {
          position.left += overLeft;

          // Too far right -> align with right edge
        } else if (overRight > 0) {
          position.left -= overRight;

          // Adjust based on position and margin
        } else {
          position.left = Math.max(position.left - collisionPosLeft, position.left);
        }

        // JET-43962: Do not allow left position to be < 0
        if (position.left < 0) {
          position.left = 0;
        }
      },

      top: function (position, data) {
        var within = data.within;
        var withinOffset = within.isWindow ? within.scrollTop : within.offset.top;
        var outerHeight = data.within.height;
        var collisionPosTop = position.top - data.collisionPosition.marginTop;
        var overTop = withinOffset - collisionPosTop;
        var overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset;
        var newOverBottom;

        // Element is taller than within
        if (data.collisionHeight > outerHeight) {
          // Element is initially over the top of within
          if (overTop > 0 && overBottom <= 0) {
            newOverBottom =
              position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
            position.top += overTop - newOverBottom;

            // Element is initially over bottom of within
          } else if (overBottom > 0 && overTop <= 0) {
            position.top = withinOffset;

            // Element is initially over both top and bottom of within
          } else {
            // eslint-disable-next-line no-lonely-if
            if (overTop > overBottom) {
              position.top = withinOffset + outerHeight - data.collisionHeight;
            } else {
              position.top = withinOffset;
            }
          }

          // Too far up -> align with top
        } else if (overTop > 0) {
          position.top += overTop;

          // Too far down -> align with bottom edge
        } else if (overBottom > 0) {
          position.top -= overBottom;

          // Adjust based on position and margin
        } else {
          position.top = Math.max(position.top - collisionPosTop, position.top);
        }

        // JET-43962: Do not allow top position to be < 0
        if (position.top < 0) {
          position.top = 0;
        }
      }
    };

    /**
     * Custom jquery UI position collision rule that will first apply the "flip" rule and follow with "center" alignment.
     * @ojtsignore
     */
    $.ui.position.flipcenter = {
      /**
       * @param {{top: number, left: number}} position
       * @param {{targetWidth: number,
       *         targetHeight: number,
       *         elemWidth: number,
       *         elemHeight: number,
       *         collisionPosition: {marginLeft: number, marginTop: number},
       *         collisionWidth: number,
       *         collisionHeight: number,
       *         offset: Array.<number>,
       *         my: Array.<string>,
       *         at: Array.<string>,
       *         within: {element: jQuery, isWindow: boolean, isDocument: boolean, offset: {left: number, top: number}, scrollLeft: number, scrollTop: number, width: number, height: number},
       *         elem: jQuery
       *        }} data
       * @returns {undefined}
       */
      left: function (position, data) {
        // stash away the initial position calculated from the at alignment
        var posLeft = position.left;

        // call on the flip rule
        $.ui.position.flip.left.call(this, position, data);

        // These calcs were taken from the "fit" rule.
        var within = data.within;
        var withinOffset = within.isWindow ? within.scrollLeft : within.offset.left;
        var outerWidth = within.width;
        var collisionPosLeft = position.left - data.collisionPosition.marginLeft;
        var overLeft = withinOffset - collisionPosLeft;
        var overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset;

        // if popup is not within, center align it
        if (overLeft > 0 || overRight > 0) {
          // find the center of the target element
          if (data.at[0] === 'right') {
            posLeft -= data.targetWidth / 2;
          } else if (data.at[0] === 'left') {
            posLeft += data.targetWidth / 2;
          }

          var isRTL = DomUtils.getReadingDirection() === 'rtl';
          var dirFactor = isRTL ? -1 : 1;

          // factor in half the width of the popup
          posLeft -= dirFactor * (data.elemWidth / 2);

          // JET-53426: need to check if the popup element fits the screen after centering
          // otherwise it could cause text reflow and popup resize which might result
          // in another positioning cycle with a potential endless loop.
          // If the element does not fit, apply the 'fit' collision to avoid the resize.
          if (posLeft < withinOffset || posLeft + data.elemWidth > outerWidth - withinOffset) {
            $.ui.position.fit.left.call(this, position, data);
            posLeft = position.left;
          }

          // Force the popup start to be within the viewport.
          // This collision rule is only used by input components internally. The notewindow will auto dismiss when
          // what it is aligned to is hidden in a scroll container.
          // eslint-disable-next-line no-param-reassign
          position.left = Math.max(0, posLeft);
        }
      },

      /**
       * @param {{top: number, left: number}} position
       * @param {{targetWidth: number,
       *         targetHeight: number,
       *         elemWidth: number,
       *         elemHeight: number,
       *         collisionPosition: {marginLeft: number, marginTop: number},
       *         collisionWidth: number,
       *         collisionHeight: number,
       *         offset: Array.<number>,
       *         my: Array.<string>,
       *         at: Array.<string>,
       *         within: {element: jQuery, isWindow: boolean, isDocument: boolean, offset: {left: number, top: number}, scrollLeft: number, scrollTop: number, width: number, height: number},
       *         elem: jQuery
       *        }} data
       * @returns {undefined}
       */
      top: function (position, data) {
        // stash away the initial position calculated from the at alignment
        var posTop = position.top;

        $.ui.position.flip.top.call(this, position, data);

        // These calcs were taken from the "fit" rule.
        var within = data.within;
        var withinOffset = within.isWindow ? within.scrollTop : within.offset.top;
        var outerHeight = data.within.height;
        var collisionPosTop = position.top - data.collisionPosition.marginTop;
        var overTop = withinOffset - collisionPosTop;
        var overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset;

        if (overTop > 0 || overBottom > 0) {
          // find the center of the target element
          if (data.at[1] === 'top') {
            posTop += data.targetHeight / 2;
          } else if (data.at[1] === 'bottom') {
            posTop -= data.targetHeight / 2;
          }

          // factor in half the height of the popup
          posTop += data.elemHeight / 2;

          // Force the popup top to be within the viewport.
          // This collision rule is only used by input components internally. The notewindow will auto dismiss when
          // what it is aligned to is hidden in a scroll container.
          // eslint-disable-next-line no-param-reassign
          position.top = Math.max(0, posTop);
        }
      }
    };
  })();

  /**
   * Utility for handling popup voice over messages sent to a aria live region.
   * @extends {oj.Object}
   * @public
   * @constructor
   * @since 1.1
   * @class PopupLiveRegion
   * @ignore
   * @ojtsignore
   */
  const PopupLiveRegion = function () {
    this.Init();
  };
  oj._registerLegacyNamespaceProp('PopupLiveRegion', PopupLiveRegion);

  oj.Object.createSubclass(PopupLiveRegion, oj.Object, 'oj.PopupLiveRegion');

  /**
   * Adds one to the reference counter instance.
   * @override
   * @instance
   * @protected
   */
  PopupLiveRegion.prototype.Init = function () {
    PopupLiveRegion.superclass.Init.call(this);
    if (isNaN(PopupLiveRegion._refCounter)) {
      PopupLiveRegion._refCounter = 1;
    } else {
      PopupLiveRegion._refCounter += 1;
    }
  };

  /**
   * Decrements the reference counter destroying the assocaited shared DOM aria
   * live region element when there are no longer any popups using it.
   * @instance
   * @public
   */
  PopupLiveRegion.prototype.destroy = function () {
    if (!isNaN(PopupLiveRegion._refCounter)) {
      PopupLiveRegion._refCounter -= 1;
      if (PopupLiveRegion._refCounter < 1) {
        var liveRegion = $(document.getElementById(PopupLiveRegion._POPUP_LIVE_REGION_ID));
        if (liveRegion.length > 0) {
          liveRegion.remove();
        }
      }
    }
  };

  /**
   * Sends a message to the aria live region for voice over mode.
   * @instance
   * @public
   * @param {string} message to be announce in the live region
   */
  PopupLiveRegion.prototype.announce = function (message) {
    if (!oj.StringUtils.isEmpty(message)) {
      var liveRegion = PopupLiveRegion._getLiveRegion();
      liveRegion.children().remove();
      // JET-39406: Chrome does not read out messages inside aria-live.
      // This inconsistency happenes may be due to the container is not getting add to the DOM long enough before the contents are changed
      // After discuss with acc team, we decide to put a setTimeout here to resolve the issue. 20ms is the minimum delay time to make Chrome JAWS read out the content.
      // We will need to revisit if the bug is not resolved on user side.
      // JET-46575: Update: the 20ms delay turned out to be too short in specific real-case scenarios. Increasing the delay to 250ms to give Chrome JAWS
      // a chance to pick up the live region change.
      setTimeout(function () {
        $('<div>').text(message).appendTo(liveRegion); // @HTMLUpdateOK the "messsage" comes from a
      }, 250);
      // translated string that can be overridden by
      // an option on the ojPopup.  The jquery "text"
      // function will escape script.
    }
  };

  /**
   * Creates or returns an existing aria live region used by popups.
   * @returns {jQuery} aria live region
   * @private
   */
  PopupLiveRegion._getLiveRegion = function () {
    var liveRegion = $(document.getElementById(PopupLiveRegion._POPUP_LIVE_REGION_ID));
    if (liveRegion.length === 0) {
      liveRegion = $('<div>');
      liveRegion.attr({
        id: PopupLiveRegion._POPUP_LIVE_REGION_ID,
        role: 'log',
        'aria-live': 'polite',
        'aria-relevant': 'additions'
      });
      liveRegion.addClass('oj-helper-hidden-accessible');
      liveRegion.appendTo(document.body); // @HTMLUpdateOK
    }
    return liveRegion;
  };

  /**
   * Id assigned to the popup aria live region dom element.
   * @const
   * @private
   * @type {string}
   */
  PopupLiveRegion._POPUP_LIVE_REGION_ID = '__oj_popup_arialiveregion';

  /**
   * Utility that injects a hidden link relative to another for voice support
   * @class PopupSkipLink
   * @extends {oj.Object}
   * @public
   * @constructor
   * @since 1.1
   * @ignore
   * @param {jQuery} sibling element to the new skip link element
   * @param {string} message text assigned to the skip link
   * @param {function(!Event)} callback fired for activation of the skip link
   * @param {string=} id assigned to the skiplink component
   * @param {{insertBefore:boolean, preventKeyEvents: boolean}=} options overrides default behaviors
   * @ojtsignore
   */
  const PopupSkipLink = function (sibling, message, callback, id, options) {
    oj.Assert.assertPrototype(sibling, $);
    oj.Assert.assertString(message);
    oj.Assert.assertFunction(callback);
    oj.Assert.assertStringOrNull(id);

    this._options = { insertBefore: false, preventKeyEvents: true };
    if (options) {
      this._options = Object.assign({}, this._options, options);
    }

    this._sibling = sibling;
    this._message = message;
    this._callback = callback;
    this._id = id;
    this.Init();
  };
  oj._registerLegacyNamespaceProp('PopupSkipLink', PopupSkipLink);

  oj.Object.createSubclass(PopupSkipLink, oj.Object, 'oj.PopupSkipLink');

  /**
   * Creates an invisible anchor relative to the sibling and hooks up the activation callack.
   * @override
   * @instance
   * @protected
   */
  PopupSkipLink.prototype.Init = function () {
    PopupSkipLink.superclass.Init.call(this);
    var sibling = this._sibling;
    var callback = this._callback;
    var message = this._message;
    var insertBefore = this._options.insertBefore;
    var preventKeyEvents = this._options.preventKeyEvents;
    this._message = null;
    var id = this._id;
    this._id = null;

    var link = $(document.getElementById(id));
    if (link.length < 1) {
      link = $('<a>').attr({ tabindex: '-1', href: '#', role: 'link' });
    }
    link.attr('id', id);
    link.addClass('oj-helper-hidden-accessible');
    link.text(message);
    if (!insertBefore) {
      link.insertAfter(sibling); // @HTMLUpdateOK
    } else {
      link.insertBefore(sibling); // @HTMLUpdateOK
    }

    link.on('click', PopupSkipLink._activateHandler.bind(this, callback));

    if (preventKeyEvents) {
      // This could only happen in some kind of simulator as this skip link is only used on the iOS
      // platform. Prevent click generated from an "enter" key press by eating the event.
      link.on('keydown keyup keypress', PopupSkipLink._keyHandler);
    }

    sibling.data(PopupSkipLink._SKIPLINK_ATTR, link);
  };

  /**
   * Handles activation of the skiplink.  Cancels the click event.
   * @private
   * @param {?} listener
   * @param {Event} event
   */
  PopupSkipLink._activateHandler = function (listener, event) {
    ZOrderUtils.eatEvent(event);
    window.setImmediate(listener);
  };

  /**
   * Listener registered on the skip link element to prevent an enter key from generating a click
   * @private
   * @param {jQuery.Event|Event} event
   */
  PopupSkipLink._keyHandler = function (event) {
    if (event.keyCode === $.ui.keyCode.ENTER) {
      ZOrderUtils.eatEvent(event);
    }
  };

  /**
   * Removes the voice over skip link.
   * @instance
   * @public
   */
  PopupSkipLink.prototype.destroy = function () {
    var sibling = this._sibling;
    delete this._sibling;
    delete this._callback;

    if (sibling) {
      var link = sibling.data(PopupSkipLink._SKIPLINK_ATTR);
      sibling.removeData(PopupSkipLink._SKIPLINK_ATTR);
      if (link) {
        link.off('click keydown keyup keypress');
        link.remove();
      }
    }
  };

  /**
   * Returns the skip link jQuery element.
   * @instance
   * @public
   * @return {jQuery} skip link
   */
  PopupSkipLink.prototype.getLink = function () {
    /** @type {?} */
    var sibling = this._sibling;
    /** @type {jQuery} */
    var link;
    if (sibling) {
      link = sibling.data(PopupSkipLink._SKIPLINK_ATTR);
    }
    return link;
  };

  /**
   * Data attribute name assigned to the sibling element that tracks a
   * reference for the associated skip link.
   * @const
   * @private
   * @type {string}
   */
  PopupSkipLink._SKIPLINK_ATTR = 'oj-skiplink';

  /**
   * Coordinate communications between an event being fulfilled and one or more promises
   * being resolved.  The window of time between the instance creation and the associated event
   * triggered is guarded by the {@link oj.BusyContext}.  The
   * @link{PopupWhenReadyMediator#getWhenReadyPromise} promise will resolve when either the
   * target event is triggered or instance destroyed.
   * @class PopupWhenReadyMediator
   * @extends {oj.Object}
   * @constructor
   * @since 3.0.0
   * @ignore
   * @param {jQuery} element to subscribe on the event type triggered on completion of the operation
   * @param {string} operation that completion will resolve one or more promises
   * @param {string} widgetName component constructor
   * @param {boolean} isCustomElement <code>true</code> if the widget is created as a custom element
   * @ojtsignore
   */
  const PopupWhenReadyMediator = function (element, operation, widgetName, isCustomElement) {
    this._element = element;
    this._operation = operation;
    this._widgetName = widgetName;
    this._isCustomElement = !!isCustomElement;

    this.Init();
  };
  oj._registerLegacyNamespaceProp('PopupWhenReadyMediator', PopupWhenReadyMediator);

  oj.Object.createSubclass(PopupWhenReadyMediator, oj.Object, 'oj.PopupWhenReadyMediator');

  /**
   * Registers an event handler on the element associated with the target operation.
   * The event handler will resolve one or more pending promises.  The convention
   * is the operation will raise a "oj" + operation event upon completion. The
   * event hander is one and done - unregistered after first delivery.
   *
   * @override
   * @instance
   * @protected
   */
  PopupWhenReadyMediator.prototype.Init = function () {
    PopupWhenReadyMediator.superclass.Init.call(this);
    this._resolvedQueue = [];
    this._callback = this._eventHandler.bind(this);

    var operation = this._operation;
    var tokens = ['oj'];
    if (this._isCustomElement) {
      tokens.push(operation.charAt(0).toUpperCase());
      tokens.push(operation.slice(1));
    } else {
      tokens.push(operation);
    }

    var eventType = tokens.join('');
    this._eventType = eventType;
    this._element.on(eventType, this._callback);

    // Add a busy state for the pending operation.  The busy state resolver will
    // be invoked when the resolved queue is delivered (operation completes).
    var busyContext = Context.getContext(this._element[0]).getBusyContext();
    var options = {
      description: this._getBusyStateDescription.bind(
        this,
        this._element,
        this._operation,
        this._widgetName
      )
    };
    var resolve = busyContext.addBusyState(options);
    this.AddPromiseExecutor(resolve);

    // setup the when ready promise
    this._whenReadyPromise = new Promise(this.AddPromiseExecutor.bind(this));
  };

  /**
   * @private
   * @param {jQuery} element to subscribe on the event type triggered on completion of the operation
   * @param {string} operation that completion will resolve one or more promises
   * @param {string} widgetName component constructor
   * @returns {string} description of the busy state animation operation.
   */
  PopupWhenReadyMediator.prototype._getBusyStateDescription = function (
    element,
    operation,
    widgetName
  ) {
    return (
      widgetName +
      " identified by '" +
      element.attr('id') +
      "' is busy animating on " +
      "the '" +
      operation +
      "' operation."
    );
  };

  /**
   * Resolves the pending promises.
   *
   * @private
   * @param {string=} operation override sent to the resolverdQueue
   */
  PopupWhenReadyMediator.prototype._deliverResolved = function (operation) {
    // Critical section - the registered resolve queue is disconnect from the
    // instance state so that a race condition will not occur - resolve promoise
    // adding new operations to the same queue.

    var resolvedQueue = this._resolvedQueue;
    this._resolvedQueue = null;

    var _operation = !operation ? this._operation : operation;
    this._operation = null;

    for (var i = 0; i < resolvedQueue.length; i++) {
      try {
        resolvedQueue[i](_operation);
      } catch (e) {
        Logger.error('Error resolving whenReady promises:\n%o', e);
      }
    }

    this._whenReadyPromise = Promise.resolve('none');
  };

  /**
   * Force delivery of unresolved promises.
   */
  PopupWhenReadyMediator.prototype.destroy = function () {
    // If the promise is swapped (component is destroyed)
    // before the event is fired, resolve with a "none" operation.
    if (this._resolvedQueue) {
      this._deliverResolved('none');
    }

    if (this._callback) {
      var eventType = this._eventType;
      this._element.off(eventType, this._callback);
    }

    this._callback = null;
    this._element = null;
    this._operation = null;
    this._whenReadyPromise = null;
    this._widgetName = null;
    this._eventType = null;
  };

  /**
   * @returns {Promise} returns an instance of the current whenReadyPromise
   */
  PopupWhenReadyMediator.prototype.getWhenReadyPromise = function () {
    return this._whenReadyPromise;
  };

  /**
   * Event handler associated with completion of the target operation.
   * @private
   * @param {jQuery.Event} event
   */
  PopupWhenReadyMediator.prototype._eventHandler = function (event) {
    if (event.target === this._element[0]) {
      this._element.off(event.type, this._callback);
      this._deliverResolved();
      this._callback = null;
    }
  };

  /**
   * @private
   * @return {string} Returns the pending operation
   */
  PopupWhenReadyMediator.prototype._getPendingOperation = function () {
    return this._operation ? this._operation : 'none';
  };

  /**
   * A function that will be passed to other functions via the arguments resolve and reject.
   * The resolve function will be invoked when the event associated with completion of the
   * target operation is delivered to the target element.
   *
   * @protected
   * @param {Function} resolve resultant function that will resovle a promise executor
   * @param {Function=} reject (not interested in the reject)
   */
  // eslint-disable-next-line no-unused-vars
  PopupWhenReadyMediator.prototype.AddPromiseExecutor = function (resolve, reject) {
    if (this._resolvedQueue) {
      this._resolvedQueue.push(resolve);
    }
  };

  /**
   * Checks to see if there is a pending "open" or "close" operation.  If pending and it
   * is the same as the requested operation, the request silently fails.  If the current
   * operation is the inverse operation, we queue the current operation after the pending
   * operation is resolved.
   *
   * @param {Object} widgetInstance this mediator is negotiating on behalf of
   * @param {string} operation currently requested
   * @param {string} methodName that should be invoked on the widgetInstance if the operation is the
   *                 inverse of the pending operation
   * @param {Array} methodArgs passed to a queue method invocation
   * @returns {boolean} <code>true</code> if a "close" or "open" operation is pending completion.
   */
  PopupWhenReadyMediator.prototype.isOperationPending = function (
    widgetInstance,
    operation,
    methodName,
    methodArgs
  ) {
    var isPending = false;
    var widgetName = this._widgetName;
    var pendingOperation = this._getPendingOperation();
    if (operation === pendingOperation) {
      // Same request is already pending. Silently fail.
      Logger.info(
        "An %s instance invoked a '%s' operation while pending animation of " +
          'the same type of operation.  The second request will be ignored.',
        widgetName,
        operation
      );
      isPending = true;
    } else if (pendingOperation !== 'none') {
      Logger.info(
        "An %s instance invoked a '%s' operation while pending animation of a " +
          "'%s' operation. The second request will be invoked after the pending operation " +
          'completes.',
        widgetName,
        operation,
        pendingOperation
      );

      // Queue the operation after the pending operation has completed
      // register another resolve promise with the mediator that will be
      // call when the pending operation finishes.
      var promise = new Promise(this.AddPromiseExecutor.bind(this));
      promise.then(
        function () {
          this[methodName].apply(this, methodArgs);
        }.bind(widgetInstance)
      );
      isPending = true;
    }
    return isPending;
  };

  class VPopup extends preact.Component {
      constructor() {
          super(...arguments);
          this._setRootRef = (element) => {
              this._rootRef = element;
          };
      }
      render(props) {
          return (jsxRuntime.jsx("div", { style: { display: 'none' }, ref: this._setRootRef, children: props.children }));
      }
      componentDidMount() {
          this._popup = $(this._rootRef.firstChild);
          const options = {
              [PopupService.OPTION.POPUP]: this._popup,
              [PopupService.OPTION.EVENTS]: {
                  [PopupService.EVENT.POPUP_AUTODISMISS]: this.props.autoDismiss,
                  [PopupService.EVENT.POPUP_REFRESH]: function () {
                      this._popup.position(this._getPosition());
                  }.bind(this)
              },
              [PopupService.OPTION.LAYER_SELECTORS]: this.props.layerSelectors,
              [PopupService.OPTION.CUSTOM_ELEMENT]: true,
              [PopupService.OPTION.LAUNCHER]: $(this._rootRef),
              [PopupService.OPTION.POSITION]: this._getPosition()
          };
          PopupService.getInstance().open(options);
      }
      componentWillUnmount() {
          PopupService.getInstance().close({ [PopupService.OPTION.POPUP]: this._popup });
      }
      componentDidUpdate() {
          this._popup.position(this._getPosition());
      }
      _getPosition() {
          return PositionUtils.normalizeHorizontalAlignment(this.props.position, DomUtils.getReadingDirection() === 'rtl');
      }
  }
  VPopup.defaultProps = {
      autoDismiss: null,
      layerSelectors: '',
      position: {}
  };

  const OLD_DEFAULT_LAYER_ID = '__oj_zorder_container';
  const NEW_DEFAULT_LAYER_ID = '__root_layer_host';
  const getUniqueId = ojcustomelementUtils.ElementUtils.getUniqueId.bind(null, null);
  const V_LAYER_HOST_ID_REF = Symbol();
  function getPopupServiceOptions(element, launcherElement) {
      const PSOptions = {};
      const PSoption = oj.PopupService.OPTION;
      PSOptions[PSoption.POPUP] = element;
      PSOptions[PSoption.LAUNCHER] = launcherElement;
      PSOptions[PSoption.LAYER_SELECTORS] = 'oj-v-layer-host-layer';
      const PSEvent = oj.PopupService.EVENT;
      PSOptions[PSoption.EVENTS] = {
          [PSEvent.POPUP_BEFORE_OPEN]: () => { },
          [PSEvent.POPUP_AFTER_OPEN]: () => { },
          [PSEvent.POPUP_BEFORE_CLOSE]: () => { },
          [PSEvent.POPUP_AFTER_CLOSE]: () => { },
          [PSEvent.POPUP_AUTODISMISS]: () => { },
          [PSEvent.POPUP_REFRESH]: () => { },
          [PSEvent.POPUP_CLOSE]: () => {
              closeLayerHost(element, launcherElement);
          },
          [PSEvent.POPUP_REMOVE]: () => { }
      };
      return PSOptions;
  }
  function getLayerHost(element) {
      const anchorRef = element['anchorRef'];
      let layerHost;
      if (!element[V_LAYER_HOST_ID_REF]) {
          element[V_LAYER_HOST_ID_REF] = `__v_layer_host_${getUniqueId()}`;
      }
      else {
          layerHost = document.getElementById(element[V_LAYER_HOST_ID_REF]);
      }
      if (layerHost) {
          return layerHost;
      }
      let isComponentInOldDom = false;
      let launcherElement;
      if (anchorRef != undefined) {
          launcherElement = anchorRef.current;
      }
      else {
          launcherElement = element;
      }
      let zOrderContainer = element.closest(`#${OLD_DEFAULT_LAYER_ID}`);
      if (zOrderContainer) {
          isComponentInOldDom = true;
      }
      else {
          if (anchorRef && anchorRef.current && !anchorRef.current.x) {
              zOrderContainer = anchorRef.current.closest(`#${OLD_DEFAULT_LAYER_ID}`);
              if (zOrderContainer) {
                  isComponentInOldDom = true;
              }
          }
      }
      if (isComponentInOldDom) {
          return openLayerHost(element[V_LAYER_HOST_ID_REF], launcherElement);
      }
      return _getNewLayerHost();
  }
  function _getNewLayerHost() {
      let newLayerHost = document.getElementById(NEW_DEFAULT_LAYER_ID);
      if (!newLayerHost) {
          newLayerHost = document.createElement('div');
          newLayerHost.setAttribute('id', NEW_DEFAULT_LAYER_ID);
          newLayerHost.setAttribute('data-oj-binding-provider', 'preact');
          newLayerHost.classList.add('oj-root-layer-host');
          let zOrderContainer = document.getElementById(OLD_DEFAULT_LAYER_ID);
          if (!zOrderContainer) {
              document.body.prepend(newLayerHost);
          }
          else {
              zOrderContainer.after(newLayerHost);
          }
      }
      return newLayerHost;
  }
  function openLayerHost(elementId, launcherElement) {
      if (!elementId)
          return;
      let vpopupCoreElement = document.getElementById(elementId);
      if (!vpopupCoreElement) {
          vpopupCoreElement = document.createElement('div');
          vpopupCoreElement.setAttribute('id', elementId);
          vpopupCoreElement.setAttribute('data-oj-binding-provider', 'preact');
          document.body.appendChild(vpopupCoreElement);
      }
      const popupServiceInstance = oj.PopupService.getInstance();
      const popupServiceOptions = getPopupServiceOptions(vpopupCoreElement, launcherElement);
      popupServiceInstance.open(popupServiceOptions);
      return vpopupCoreElement;
  }
  function closeLayerHost(element, launcherElement) {
      if (!element)
          return;
      const popupServiceInstance = oj.PopupService.getInstance();
      const popupServiceOptions = getPopupServiceOptions(element, launcherElement);
      popupServiceInstance.close(popupServiceOptions);
      element.remove();
  }
  function findOpenVPopups() {
      const newLayerHost = _getNewLayerHost();
      return [].slice.call(newLayerHost.children);
  }

  exports.PopupLiveRegion = PopupLiveRegion;
  exports.PopupService = PopupService;
  exports.PopupSkipLink = PopupSkipLink;
  exports.PopupWhenReadyMediator = PopupWhenReadyMediator;
  exports.PositionUtils = PositionUtils;
  exports.VPopup = VPopup;
  exports.findOpenVPopups = findOpenVPopups;
  exports.getLayerHost = getLayerHost;

  Object.defineProperty(exports, '__esModule', { value: true });

});
