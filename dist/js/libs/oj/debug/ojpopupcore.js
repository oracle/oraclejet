/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'jqueryui-amd/position'], 
       function(oj, $)
{

/*jslint browser: true*/
/*
** Copyright (c) 2004, 2012, Oracle and/or its affiliates. All rights reserved.
*/
/**
 * Utilities used in conjunction with the jquery positon utility.
 * @ignore
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

oj.PositionUtils = {};

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
oj.PositionUtils.normalizeHorizontalAlignment = function(position, isRtl)
{
  // This assertion prevents security testing: someone could pass in a bogus position
  //oj.Assert.assertObject(position, "position");
  var target = $.extend({}, position);
  for (var i = 0; i < oj.PositionUtils._ALIGN_RULE_PROPERTIES.length; i++)
  {
    var propName = oj.PositionUtils._ALIGN_RULE_PROPERTIES[i];
    var align = target[propName];
    if (align)
      target[propName] = align.replace("start", (isRtl ? "right" : "left"))
                              .replace("end", (isRtl ? "left" : "right"))
                              .replace("<", (isRtl ? "+" : "-"))
                              .replace(">", (isRtl ? "-" : "+"));
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
oj.PositionUtils.normalizePositionOf = function(of, launcher, event)
{
  return (of === "event")
    ? event
    : (of == null || of === "launcher")
      ? launcher
      : of;
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
 * @param event
 */
oj.PositionUtils._normalizeEventForPosition = function(event)
{
  $.each(["pageX", "pageY"], function (index, pagePos) 
  {
    if (event && event[pagePos] === undefined && event.originalEvent) 
    {
      var originalEvent = event.originalEvent;
      var type = originalEvent.type;
      var touchList = (type === "touchstart" || type === "touchmove")
          ? "touches"
          : (type === "touchend") ? "changedTouches" : null;

      if (touchList) 
      {
        var firstTouch = originalEvent[touchList][0];
        if (firstTouch)
          event[pagePos] = firstTouch[pagePos];
      }
    }
  });
};

oj.PositionUtils._ALIGN_RULE_PROPERTIES = ['my', 'at'];

/**
 * A common utilty that is designed be be called for a jquery ui position "using" callback
 * that will check to see if the target aligning "of" position is clipped in an overflow
 * container.  Used by popups that should auto dismiss when what they are aligning to is
 * no longer visible.  The aligning position can be either an element, event or a rect.
 *
 * @param {Object} props second argument to the jquery ui position "using" callback.
 * @returns {boolean} <code>true</code> if the point aligned is not totally visible in and overflow container
 */
oj.PositionUtils.isAligningPositionClipped = function(props)
{
  // Alignment can be to an element, event or a rect but we only care to make this
  // check if alignment is to an element - .
  if (props["target"] && props["target"]["height"] > 0 && props["target"]["width"] > 0)
  {
    // if the target has a width and height greater than zero then it's an element
    /** @type {jQuery} */
    var positionOf = props["target"]["element"];
    return !oj.DomUtils.isWithinViewport(positionOf);
  }
  else
    return false;
};

/**
 *
 * Custom jquery UI position collision rule that will first apply the "flip" rule and follow with "center" alignment.
 */
$.ui.position["flipcenter"] =
{
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
  "left": function (position, data)
  {
    // stash away the initial position calculated from the at alignment
    var posLeft = position["left"];

    // call on the flip rule
    $.ui.position["flip"]["left"].call(this, position, data);

    // These calcs were taken from the "fit" rule.
    var within = data["within"];
    var withinOffset = within["isWindow"] ? within["scrollLeft"] : within["offset"]["left"];
    var outerWidth = within["width"];
    var collisionPosLeft = position["left"] - data["collisionPosition"]["marginLeft"];
    var overLeft = withinOffset - collisionPosLeft;
    var overRight = collisionPosLeft + data["collisionWidth"] - outerWidth - withinOffset;

    // if popup is not within, center align it
    if (overLeft > 0 || overRight > 0)
    {
      // find the center of the target element
      if ("right" === data["at"][0])
        posLeft -= data["targetWidth"] /2;
      else if ("left" === data["at"][0])
        posLeft += data["targetWidth"] /2;

      var isRTL = oj.DomUtils.getReadingDirection() === "rtl";
      var dirFactor = isRTL ? -1 : 1;

      // factor in half the width of the popup
      posLeft -= dirFactor * (data["elemWidth"] / 2);

      position["left"] = posLeft;
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
  "top": function (position, data)
  {
    // stash away the initial position calculated from the at alignment
    var posTop = position["top"];

    $.ui.position["flip"]["top"].call(this, position, data);

    // These calcs were taken from the "fit" rule.
    var within = data["within"];
    var withinOffset = within["isWindow"] ? within["scrollTop"] : within["offset"]["top"];
    var outerHeight = data["within"]["height"];
    var collisionPosTop = position["top"] - data["collisionPosition"]["marginTop"];
    var overTop = withinOffset - collisionPosTop;
    var overBottom = collisionPosTop + data["collisionHeight"] - outerHeight - withinOffset;

    if (overTop > 0 || overBottom > 0)
    {
      // find the center of the target element
      if ("top" === data["at"][1])
        posTop += data["targetHeight"] /2;
      else if ("bottom" === data["at"][1])
        posTop -= data["targetHeight"] /2;

      // factor in half the height of the popup
      posTop += data["elemHeight"] / 2;

      position["top"] = posTop;
    }
  }
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
 */
$.ui.position["flip"] = {
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
  "left": function(position, data)
  {
    var within = data["within"],
    withinOffset = within["offset"]["left"] + within["scrollLeft"],
    outerWidth = within["width"],
    offsetLeft = within["isWindow"] ? within["scrollLeft"] : within["offset"]["left"],
    collisionPosLeft = position["left"] - data["collisionPosition"]["marginLeft"],
    overLeft = collisionPosLeft - offsetLeft,
    overRight = collisionPosLeft + data["collisionWidth"] - outerWidth - offsetLeft,
    myOffset = data["my"][ 0 ] === "left" ? -data["elemWidth"] :
                data["my"][ 0 ] === "right" ? data["elemWidth"] : 0,
    atOffset = data["at"][ 0 ] === "left" ? data["targetWidth"] :
                data["at"][ 0 ] === "right" ? -data["targetWidth"] : 0,
    offset = -2 * data["offset"][ 0 ],
    newOverRight,
    newOverLeft;

    if (overLeft < 0 && Math.abs(newOverRight) < Math.abs(newOverLeft))
    {
      newOverRight = position["left"] + myOffset + atOffset + offset + data["collisionWidth"] - outerWidth - withinOffset;
      if (newOverRight < 0 || newOverRight < Math.abs(overLeft))
      {
        position["left"] += myOffset + atOffset + offset;
      }
    } else if (overRight > 0)
    {
      newOverLeft = position["left"] - data["collisionPosition"]["marginLeft"] + myOffset + atOffset + offset - offsetLeft;
      if (newOverLeft > 0 || Math.abs(newOverLeft) < overRight)
      {
        position["left"] += myOffset + atOffset + offset;
      }
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
  "top": function(position, data)
  {
    var within = data["within"],
    withinOffset = within["offset"]["top"] + within["scrollTop"],
    outerHeight = within["height"],
    offsetTop = within["isWindow"] ? within["scrollTop"] : within["offset"]["top"],
    collisionPosTop = position["top"] - data["collisionPosition"]["marginTop"],
    overTop = collisionPosTop - offsetTop,
    overBottom = collisionPosTop + data["collisionHeight"] - outerHeight - offsetTop,
    top = data["my"][ 1 ] === "top",
    myOffset = top ? -data["elemHeight"] :
                data["my"][ 1 ] === "bottom" ? data["elemHeight"] : 0,
    atOffset = data["at"][ 1 ] === "top" ? data["targetHeight"] :
                data["at"][ 1 ] === "bottom" ? -data["targetHeight"] : 0,
    offset = -2 * data["offset"][ 1 ],
    newOverBottom,
    newOverTop;
    if (overTop < 0)
    {
      newOverBottom = position["top"] + myOffset + atOffset + offset + data["collisionHeight"] - outerHeight - withinOffset;
      if (newOverBottom < 0 || newOverBottom < Math.abs(overTop))
      {
        //  - only flip up if there is more "over" on bottom than top
        if (overBottom < 0 && overTop < overBottom)
          position["top"] += myOffset + atOffset + offset;
      }
    } else if (overBottom > 0)
    {
      newOverTop = position["top"] - data["collisionPosition"]["marginTop"] + myOffset + atOffset + offset - offsetTop;
      if (newOverTop > 0 || Math.abs(newOverTop) < overBottom)
      {
        position["top"] += myOffset + atOffset + offset;
      }
    }
  }
};
/*jslint browser: true*/
/*
 ** Copyright (c) 2004, 2012, Oracle and/or its affiliates. All rights reserved.
 */

/**
 * @extends {oj.Object}
 * @protected
 * @constructor
 * @since 1.1.0
 * @class Internal framework service for managing popup instances.
 * @ignore
 */
oj.PopupService = function ()
{
  this.Init();
};

oj.Object.createSubclass(oj.PopupService, oj.Object, "oj.PopupService");

/**
 * @override
 * @instance
 * @protected
 */
oj.PopupService.prototype.Init = function ()
{
  oj.PopupService.superclass.Init.call(this);
};

/**
 * @param {Object=} options used by the factory method for service instantiation
 * @return {!oj.PopupService} singleton instance of the manager
 * @public
 */
oj.PopupService.getInstance = function (options)
{
  // in the future we might need a JET Island impl
  if (!oj.PopupService._popupService)
  {
    oj.PopupService._popupService = new oj.PopupServiceImpl();
  }
  return oj.PopupService._popupService;
};

/**
 * @param {!Object.<oj.PopupService.OPTION, ?>} options property bag for opening the popup
 * @return {void}
 * @instance
 * @public
 */
oj.PopupService.prototype.open = function (options)
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * @param {!Object.<oj.PopupService.OPTION, ?>} options property bag for closing the popup
 * @return {void}
 * @instance
 * @public
 */
oj.PopupService.prototype.close = function (options)
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * @param {!Object.<oj.PopupService.OPTION, ?>} options property bag to change
 * the state of the target popup.
 * @return {void}
 * @instance
 * @public
 */
oj.PopupService.prototype.changeOptions = function (options)
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * @param {!jQuery} popup to target triggering the event on decendents
 * @param {!oj.PopupService.EVENT} event to trigger
 * @param {Array=} argsArray to pass to the associated callback for the event
 * @return {void}
 * @instance
 * @public
 */
oj.PopupService.prototype.triggerOnDescendents = function (popup, event, argsArray)
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * @return {void}
 * @instance
 * @public
 */
oj.PopupService.prototype.destroy = function ()
{
  delete oj.PopupService._popupService;
};

/**
 * Dialog modality states.
 * @enum {string}
 * @public
 */
oj.PopupService.MODALITY =
{
  /** Type of popup that doesn't support modality */
  NONE: "none",
  /** Dialog that that blocks user input of the primary window.*/
  MODAL: "modal",
  /** Type of dialog that doesn't block user input of the primary window */
  MODELESS: "modeless"
};

/**
 * Event names used to identify the {@link oj.PopupService.OPTION.EVENT} option
 * property.
 * @enum {string}
 * @public
 */
oj.PopupService.EVENT =
{
  /**
   * Event called by the popup service when the surrogate is removed in the document
   * resulting in the popup getting implicitly closed and associated bound element
   * is removed */
  POPUP_REMOVE: "ojPopupRemove",
  /**
   * Event called when a parent popup is closed causing implicit closure of
   * descendent popups.
   */
  POPUP_CLOSE: "ojPopupClose",
  /**
   * Event called on when a parent popup is refreshed triggering a cascade
   * refresh on children.
   */
  POPUP_REFRESH: "ojPopupRefresh",
  /**
   * Event called to enforce auto dismissal rules specific to each popup category.
   */
  POPUP_AUTODISMISS: "ojPopupAutoDismiss"
};

/**
 * Layer level used to identify the {@link oj.PopupService.OPTION.LAYER_LEVEL} option
 * property.
 * @enum {string}
 * @public
 */
oj.PopupService.LAYER_LEVEL =
{
   /**
    * Option used by dialogs.  Dialogs are always top rooted.
    */
   TOP_LEVEL: "topLevel",

   /**
    * The default layer option.  Popups will be reparented to the nearest ancestor layer defined
    * relative to the associated {@link oj.PopupService.OPTION.LAUNCHER}.
    */
   NEAREST_ANCESTOR: "nearestAncestor"
};

/**
 * Property names in the options property bag passed to popup service api.
 * @enum {string}
 * @public
 * @see oj.PopupService#close
 * @see oj.PopupService#open
 */
oj.PopupService.OPTION =
{
  /**
   * Parameter holding the jQuery element that is the root of the popup.  This
   * element is reparented into the zorder container when open. It is a required
   * option.
   */
  POPUP: "popup",
  /**
   * Map of event names to callbacks.  The event names are defined by the
   * {@link oj.PopupService.EVENT} enumerated type.
   */
  EVENTS: "events",
  /**
   * Defines the modal state of a popup.  The value of this attribute is defined
   * by the {@link oj.PopupService.MODALITY} enumeration.
   */
  MODALITY: "modality",
  /**
   * The jQuery element that is associated with the popup being open.  The launcher
   * is used to find the target popups reparented location within the zorder
   * container when open.  This is an optional parameter.  Dialogs don't require a launcher.
   */
  LAUNCHER: "launcher",
  /**
   * The jQuery UI position object that defines where the popup should be aligned.
   * This is an optional parameter.
   */
  POSITION: "position",

  /**
   * The CSS selector names applied to the layer for the target type of popup.  These
   * selectors will define the stacking context for the popup and its children.  Multiple
   * selector names should be delimited by a space similar to the syntax for the jquery
   * addClass API.  This option is required.
   */
  LAYER_SELECTORS: "layerSelectors",

  /**
   * The initial level that the popup will be reparented to when open.  Dialogs are reparented
   * into the top level.  Other types of popups will be parented to their nearest ancestor layer.
   * The values of this attribute are defined by {@link oj.PopupService.LAYER_LEVEL}.
   */
  LAYER_LEVEL: "layerLevel"
};

// -----------------------------------------------------------------------------

/**
 * @extends {oj.PopupService}
 * @public
 * @constructor
 * @since 1.1.0
 * @ignore
 */
oj.PopupServiceImpl = function ()
{
  this.Init();
};

oj.Object.createSubclass(oj.PopupServiceImpl, oj.PopupService, "oj.PopupServiceImpl");

/**
 * Establishes a popup to be open and managed by the framework.  Managed popups will
 * by reparented to the zorder container appended to the document body.  The
 * location within that container is determined by the launcher or modality options.
 * @param {!Object.<oj.PopupService.OPTION, ?>} options property bag for opening the popup
 * @return {void}
 * @instance
 * @public
 * @override
 */
oj.PopupServiceImpl.prototype.open = function (options)
{
  oj.Assert.assertObject(options);

  /** @type {!jQuery} */
  var popup = options[oj.PopupService.OPTION.POPUP];
  oj.Assert.assertPrototype(popup, jQuery);

  /** @type {jQuery} */
  var launcher = options[oj.PopupService.OPTION.LAUNCHER];
  oj.Assert.assertPrototype(launcher, jQuery);

  /** @type {Object} */
  var position = options[oj.PopupService.OPTION.POSITION];
  oj.Assert.assertObjectOrNull(position);

  /** @type {!Object.<oj.PopupService.EVENT, function(...)>} **/
  var events = options[oj.PopupService.OPTION.EVENTS];
  oj.Assert.assertObject(events);

  var modality = options[oj.PopupService.OPTION.MODALITY];
  if (!modality ||
    !(oj.PopupService.MODALITY.MODELESS === modality || oj.PopupService.MODALITY.MODAL === modality))
    modality = oj.PopupService.MODALITY.NONE;

  var layerClass = options[oj.PopupService.OPTION.LAYER_SELECTORS];
  oj.Assert.assertString(layerClass);


  var layerLevel = options[oj.PopupService.OPTION.LAYER_LEVEL];
  if (!layerLevel ||
    !(oj.PopupService.LAYER_LEVEL.TOP_LEVEL === layerLevel || oj.PopupService.LAYER_LEVEL.NEAREST_ANCESTOR === layerLevel))
    layerLevel = oj.PopupService.LAYER_LEVEL.NEAREST_ANCESTOR;

  //set logical parent
  oj.DomUtils.setLogicalParent(popup, launcher);

  oj.ZOrderUtils.addToAncestorLayer(popup, launcher, events, modality, layerClass, layerLevel);

  popup.show();
  popup.removeAttr("aria-hidden");
  if (position)
    popup["position"](position);

  this._assertEventSink();
  oj.Components.subtreeShown(popup[0]);
};

/**
 * Closes a open popup managed by the framework.  The popup element is reparented
 * to its original location within the document.  Any open descendent popups are
 * implicitly closed.
 * @param {!Object.<oj.PopupService.OPTION, ?>} options property bag for closing the popup
 * @return {void}
 * @instance
 * @public
 * @override
 */
oj.PopupServiceImpl.prototype.close = function (options)
{
  oj.Assert.assertObject(options);

  /** @type {!jQuery} */
  var popup = options[oj.PopupService.OPTION.POPUP];
  oj.Assert.assertPrototype(popup, jQuery);

  oj.ZOrderUtils.removeFromAncestorLayer(popup);
  popup.hide();
  popup.attr("aria-hidden", "true");

  //remove the logical parent
  oj.DomUtils.setLogicalParent(popup, null);

  this._assertEventSink();
  oj.Components.subtreeHidden(popup[0]);
};

/**
 * Applies a new {@link oj.PopupService.OPTION.EVENTS} callback linkage or
 * applies changes a popup dialogs {@link oj.PopupService.OPTION.MODALITY},
 * {@link oj.PopupService.OPTION.EVENTS}, or {@link oj.PopupService.OPTION.LAYER_SELECTORS}.
 * @param {!Object.<oj.PopupService.OPTION, ?>} options property bag including target popup
 * @return {void}
 * @instance
 * @public
 * @override
 */
oj.PopupServiceImpl.prototype.changeOptions = function (options)
{
  oj.Assert.assertObject(options);

  /** @type {!jQuery} */
  var popup = options[oj.PopupService.OPTION.POPUP];
  oj.Assert.assertPrototype(popup, jQuery);

  /** @type {!jQuery} */
  var layer = oj.ZOrderUtils.getFirstAncestorLayer(popup);
  oj.Assert.assertPrototype(layer, jQuery);

  /** @type Object.<oj.PopupService.EVENT, function(...)> */
  var events = options[oj.PopupService.OPTION.EVENTS];
  // Doesn't account for undefined
  //oj.Assert.assertObjectOrNull(events);
  if (events)
    oj.ZOrderUtils.applyEvents(layer, events);

  /** @type {oj.PopupService.MODALITY} */
  var modality = options[oj.PopupService.OPTION.MODALITY];
  if (modality)
    oj.ZOrderUtils.applyModality(layer, modality);

  /** @type {?} */
  var layerClass = options[oj.PopupService.OPTION.LAYER_SELECTORS];
  if (!oj.StringUtils.isEmptyOrUndefined(layerClass))
    layer.attr("class", layerClass);

};

/**
 * Triggers the target event defined on all open descendent popups.
 * @param {!jQuery} popup to target triggering the event on decendents
 * @param {!oj.PopupService.EVENT} event to trigger
 * @param {Array=} argsArray to pass "apply" to the associated callback for the event
 * @return {void}
 * @instance
 * @override
 * @public
 */
oj.PopupServiceImpl.prototype.triggerOnDescendents = function (popup, event, argsArray)
{
  var context = {};
  context['event'] = event;
  context['argsArray'] = argsArray;

  /** @type {!jQuery} */
  var layer = oj.ZOrderUtils.getFirstAncestorLayer(popup);
  oj.ZOrderUtils.postOrderVisit(layer, this._triggerOnDescendentsVisitCallback, context);
};

/**
 * The {@link oj.ZOrderUtils.postOrderVisit} callback implementation for
 * {@link oj.PopupServiceImpl#triggerOnDescendents}.
 *
 * @param {!jQuery} layer
 * @param {!Object} context
 * @instance
 * @return {oj.ZOrderUtils.VISIT_RESULT}
 * @private
 * @see oj.PopupServiceImpl#triggerOnDescendents
 */
oj.PopupServiceImpl.prototype._triggerOnDescendentsVisitCallback = function (layer, context)
{
  var event = context['event'];
  var argsArray = context['argsArray'];

  var events = oj.ZOrderUtils.getEvents(layer);
  if (events && $.isFunction(events[event]))
    events[event].apply(this, argsArray);

  return oj.ZOrderUtils.VISIT_RESULT.ACCEPT;
};

/**
 * Depending on if popups are open, adds or removes event listeners redistributed
 * to open popups.
 * @return {void}
 * @instance
 * @private
 */
oj.PopupServiceImpl.prototype._assertEventSink = function ()
{

  var hasPopupsOpen = oj.ZOrderUtils.hasPopupsOpen();
  var callbackEventFilter = this._callbackEventFilter;
  var win;
  var documentElement;
  if (!hasPopupsOpen && callbackEventFilter)
  {
    window.removeEventListener("resize", oj.PopupServiceImpl._refreshCallback, true);
    window.removeEventListener("scroll", oj.PopupServiceImpl._refreshCallback, true);

    var docElement = document.documentElement;
    docElement.removeEventListener("mousewheel", oj.PopupServiceImpl._refreshCallback, true);
    docElement.removeEventListener("DOMMouseScroll", oj.PopupServiceImpl._refreshCallback, true);

    delete this._callbackEventFilter;
    for (var i = 0; i < oj.PopupServiceImpl._REDISTRIBUTE_EVENTS.length; i++)
    {
      var event = oj.PopupServiceImpl._REDISTRIBUTE_EVENTS[i];
      docElement.removeEventListener(event, callbackEventFilter, true);
    }

    var simpleTapRecognizer = this._simpleTapRecognizer;
    if (simpleTapRecognizer)
    {
      simpleTapRecognizer.destroy();
      delete this._simpleTapRecognizer;
    }
  }
  else if (hasPopupsOpen && !callbackEventFilter)
  {
    window.addEventListener("resize", oj.PopupServiceImpl._refreshCallback, true);
    window.addEventListener("scroll", oj.PopupServiceImpl._refreshCallback, true);

    var docElement = document.documentElement;
    docElement.addEventListener("mousewheel", oj.PopupServiceImpl._refreshCallback, true);
    docElement.addEventListener("DOMMouseScroll", oj.PopupServiceImpl._refreshCallback, true);

    callbackEventFilter = this._callbackEventFilter = $.proxy(this._eventFilterCallback, this);
    for (var i = 0; i < oj.PopupServiceImpl._REDISTRIBUTE_EVENTS.length; i++)
    {
      var event = oj.PopupServiceImpl._REDISTRIBUTE_EVENTS[i];
      docElement.addEventListener(event, callbackEventFilter, true);
    }

    if (oj.DomUtils.isTouchSupported())
      this._simpleTapRecognizer = new oj.SimpleTapRecognizer(callbackEventFilter);
  }
};

/**
 * Event callback for events defined by {@link oj.PopupServiceImpl._REDISTRIBUTE_EVENTS}.
 * This callback handles applying the ".oj-focus-within" selector to the popup that
 * is active.  It also handles redistributing events to open popups.
 *
 * @param {Event} event from document capture listeners
 * @return {void}
 * @instance
 * @private
 */
oj.PopupServiceImpl.prototype._eventFilterCallback = function (event)
{
  var target = $(event.target);

  var hasPopupsOpen = oj.ZOrderUtils.hasPopupsOpen();
  if (!hasPopupsOpen)
  {
    this._assertEventSink();
    return;
  }

  // Ignore mouse events on the scrollbar. FF and Chrome, raises focus events on the
  // scroll container too.
  if (oj.DomUtils.isChromeEvent(event) || ("focus" === event.type && !target.is(":focusable")))
    return;

  var defaultLayer = oj.ZOrderUtils.getDefaultLayer();
  if ("keydown" === event.type && oj.ZOrderUtils.hasModalDialogOpen() &&
      !oj.DomUtils.isAncestor(defaultLayer[0], target[0]))
  {
    // Inexpensive check to make sure that if a modal dialog is open,
    // we prevent a keydown outside the zorder layer that contains all
    // popups.  This handles the scenario where focus is placed in the
    // location bar and you start tabbing.  The browser will try to tab to
    // the first tabstop in the document.  Eat this event if it's under the
    // modal glass (not within the zorder container) and don't redistribute.

    oj.ZOrderUtils.eatEvent($.Event(event));
    return;
  }

  var targetWitinLayer = oj.ZOrderUtils.getFirstAncestorLayer(target);

  // toggle the oj-focus-within pseudo state
  if (defaultLayer[0] !== targetWitinLayer[0])
  {
    if (!targetWitinLayer.hasClass(oj.PopupServiceImpl._FOCUS_WITHIN_SELECTOR))
    {
      var lastFocusLayer = this._lastFocusLayer;
      if (lastFocusLayer)
        lastFocusLayer.removeClass(oj.PopupServiceImpl._FOCUS_WITHIN_SELECTOR);
      targetWitinLayer.addClass(oj.PopupServiceImpl._FOCUS_WITHIN_SELECTOR);
      this._lastFocusLayer = targetWitinLayer;
    }
  }
  else
  {
    // focus relinquished outside any managed popup
    var lastFocusLayer = this._lastFocusLayer;
    if (lastFocusLayer)
    {
      lastFocusLayer.removeClass(oj.PopupServiceImpl._FOCUS_WITHIN_SELECTOR);
      delete this._lastFocusLayer;
    }
  }

  // Don't redistribute a focus event targeted for an element that doesn't normally take focus.
  // Clicking on the scrollbars sometimes targets focus on containers with a -1 tabindex.
  // However, we still need to process the focus-within logic for this scenario.
  if ("focus" === event.type && "-1" === target.attr("tabindex"))
    return;

  // redistribute events for auto dismissal
  var context = {};

  // Capture all interesting event properties.  Similar to jQuery.event.fix.
  var props = {};
  for (var key in event)
  {
    if (oj.PopupServiceImpl._COPY_SAFE_EVENT_PROPERTIES[key] && !$.isFunction(event[key]))
      props[key] = event[key];
  }

  // Wrap a native event in a jQuery.Event
  context["event"] = $.Event(event, props);
  oj.ZOrderUtils.postOrderVisit(defaultLayer, oj.PopupServiceImpl._redistributeVisitCallback, context);
};

/**
 * The {@link oj.ZOrderUtils.postOrderVisit} callback for redistributing
 * {@link oj.PopupService.EVENT.POPUP_AUTODISMISS} events to open popups.
 * @param {!jQuery} layer
 * @param {!Object} context
 * @return {oj.ZOrderUtils.VISIT_RESULT}
 * @instance
 * @private
 * @see oj.PopupServiceImpl#_eventFilterCallback
 */
oj.PopupServiceImpl._redistributeVisitCallback = function (layer, context)
{
  var events = oj.ZOrderUtils.getEvents(layer);
  var event = context["event"];
  var eventType = event.type;

  if (events && $.isFunction(events[oj.PopupService.EVENT.POPUP_AUTODISMISS]))
    events[oj.PopupService.EVENT.POPUP_AUTODISMISS](event);

  return oj.ZOrderUtils.VISIT_RESULT.ACCEPT;
};

/**
 * Event listener added to the window for the resize and scroll events.
 *
 * @param {Event} event resize,scroll or mousewheel event
 * @return {void}
 * @private
 */
oj.PopupServiceImpl._refreshCallback = function (event)
{
  // Throttle redistributing the refresh listener to intervals of ? ms.
  // This will help performance for chatty events such as scroll.

  var refreshTimmer = oj.PopupServiceImpl._refreshTimmer;
  if (!isNaN(refreshTimmer))
    return;

  oj.PopupServiceImpl._refreshTimmer = window.setTimeout(function()
  {
    delete oj.PopupServiceImpl._refreshTimmer;
    var defaultLayer = oj.ZOrderUtils.getDefaultLayer();
    oj.ZOrderUtils.postOrderVisit(defaultLayer, oj.PopupServiceImpl._refreshVisitCallback);
  }, oj.PopupServiceImpl._REFRESH_DELAY);
};

/**
 * The {@link oj.ZOrderUtils.postOrderVisit} callback for invoking the
 * {@link oj.PopupService.EVENT.POPUP_REFRESH} function for open popups.
 *
 * @param {!jQuery} layer
 * @param {!Object} context
 * @return {oj.ZOrderUtils.VISIT_RESULT}
 * @private
 * @see oj.PopupServiceImpl._refreshCallback
 */
oj.PopupServiceImpl._refreshVisitCallback = function (layer, context)
{
  // Only need to call on the first level of popups as they will recursively
  // call on children.
  var level = context["level"];
  if (level > 0)
    return oj.ZOrderUtils.VISIT_RESULT.REJECT;

  var events = oj.ZOrderUtils.getEvents(layer);
  if (events && $.isFunction(events[oj.PopupService.EVENT.POPUP_REFRESH]))
    events[oj.PopupService.EVENT.POPUP_REFRESH]();

  return oj.ZOrderUtils.VISIT_RESULT.ACCEPT;
};

/**
 * @return {void}
 * @instance
 * @public
 * @override
 */
oj.PopupServiceImpl.prototype.destroy = function ()
{
  oj.PopupServiceImpl.superclass.destroy.call(this);
};

/**
 * The pseudo select name applied to the popup that has focus.
 *
 * @const
 * @private
 * @type {string}
 */
oj.PopupServiceImpl._FOCUS_WITHIN_SELECTOR = "oj-focus-within";

/**
 * Array of events that are redistributed to open popups.
 *
 * @const
 * @private
 * @type {Array.<string>}
 */
oj.PopupServiceImpl._REDISTRIBUTE_EVENTS = ["focus", "mousedown", "keydown"];

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
oj.PopupServiceImpl._COPY_SAFE_EVENT_PROPERTIES = {'altKey':true, 'bubbles': true, 'cancelable':true, 'ctrlKey': true,
                          'currentTarget': true,  'eventPhase': true, 'metaKey': true,
                          'relatedTarget': true,  'shiftKey': true, 'target':true,  'timeStamp':true,
                          'view': true, 'which': true, 'button': true, 'buttons':true, 'clientX': true,
                          'clientY': true, 'offsetX': true, 'offsetY': true, 'pageX': true,
                          'pageY': true,  'screenX': true, 'screenY': true, 'toElement': true,
                          'char': true,  'charCode': true, 'key': true, 'keyCode': true};
/**
 * Milliseconds that is used to throttle processing of native resize, scroll and mousewheel
 * events. Dispatching refresh events to open popups will happen after the delay.
 * This is to guard against chatty events.
 *
 * @const
 * @private
 * @type {number}
 */
oj.PopupServiceImpl._REFRESH_DELAY = 100;

// -----------------------------------------------------------------------------

/**
 * Utilities used by the popup framework.
 * @since 1.1.0
 * @ignore
 */
oj.ZOrderUtils = {};

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
oj.ZOrderUtils.getFirstAncestorLayer = function (launcher)
{
  // dialogs will not have launchers and will be top rooted
  if (!launcher)
    return oj.ZOrderUtils.getDefaultLayer();

  var parent = launcher;
  while (parent && parent.length > 0
         && parent.attr("oj.ZOrderUtils._SURROGATE_ATTR") !== oj.ZOrderUtils._DEFAULT_LAYER_ID)
  {
    if (oj.ZOrderUtils._hasSurrogate(parent[0]))
      return parent;
    else
      parent = parent.parent();
  }

  return oj.ZOrderUtils.getDefaultLayer();
};

/**
 * Returns the jQuery DIV element that represents the zorder container prepended to the
 * document body.  All open popups will be a descendent of the resultant node.
 *
 * @return {!jQuery}
 * @public
 */
oj.ZOrderUtils.getDefaultLayer = function ()
{
  /** @type {jQuery} */
  var defaultLayer = $(document.getElementById(oj.ZOrderUtils._DEFAULT_LAYER_ID));
  if (defaultLayer.length > 0)
    return defaultLayer;

  defaultLayer = $("<div>");
  defaultLayer.attr("role", "presentation");
  defaultLayer.attr("id", oj.ZOrderUtils._DEFAULT_LAYER_ID);
  defaultLayer.prependTo($(document.body));

  return defaultLayer;
};

/**
 * Adds the target popup to the nearest ancestor layer within the zorder container.
 * A surrogate script element will be added to mark where the popup root element
 * was prior to reparenting.
 *
 * @param {!jQuery} popup root widget
 * @param {?jQuery} launcher associated with a popup
 * @param {!Object.<oj.PopupService.EVENT, function(...)>} events map of event name to callback
 * @param {!oj.PopupService.MODALITY} modality of the popup being open
 * @param {string} layerClass selector that defines the stacking context "z-index" of the popup
 * @param {oj.PopupService.LAYER_LEVEL} layerLevel defines where the popup will be reparented
 * @return {void}
 * @public
 */
oj.ZOrderUtils.addToAncestorLayer = function (popup, launcher, events, modality, layerClass, layerLevel)
{
  var popupDom = popup[0];
  if (oj.ZOrderUtils._hasSurrogate(popupDom.parentNode))
    throw new Error("JET Popup is already open - id: " + popupDom.getAttribute("id"));

  var ancestorLayer = oj.ZOrderUtils.getFirstAncestorLayer(layerLevel === oj.PopupService.LAYER_LEVEL.TOP_LEVEL ? null : launcher);

  var layer = $("<div>");

  /** @type {?} */
  var popupId = popup.attr("id");
  if (oj.StringUtils.isEmptyOrUndefined(popupId))
    layer.uniqueId();
  else
    layer.attr("id", [popupId, "layer"].join("_"));

  layer.attr("role", "presentation");
  layer.addClass(layerClass);
  popup.after(layer);

  var surrogate = oj.ZOrderUtils._createSurrogate(layer);

  oj.Components.subtreeDetached(popupDom);
  popup.appendTo(layer);

  layer.appendTo(ancestorLayer);
  oj.Components.subtreeAttached(popupDom);

  oj.ZOrderUtils.applyModality(layer, modality);
  oj.ZOrderUtils.applyEvents(layer, events, surrogate);
};

/**
 * Replaces the event callback map associated with an open popup.  The event
 * callbacks are used for auto dismissal or handling implicit dismissal when
 * the surrogate element associated with a layer is removed from the document.
 *
 * @param {!jQuery} layer of the target popup
 * @param {!Object.<oj.PopupService.EVENT, function(...)>} events map of event name to callback
 * @param {?=} surrogate saves position within the document where popup is
 *             defined
 * @return {void}
 * @public
 */
oj.ZOrderUtils.applyEvents = function (layer, events, surrogate)
{
  if (!surrogate)
  {
    /** @type {?} */
    var surrogateId = layer.attr(oj.ZOrderUtils._SURROGATE_ATTR);
    if (surrogateId)
      surrogate = $(document.getElementById(surrogateId));
  }

  layer.data(oj.ZOrderUtils._EVENTS_DATA, events);

  if (surrogate && events && $.isFunction(events[oj.PopupService.EVENT.POPUP_REMOVE]))
  {
    // if the surrogate script element gets replaced in the dom it will trigger closure of the popup.
    surrogate['surrogate']();
    surrogate['surrogate']("option", "beforeDestroy", events[oj.PopupService.EVENT.POPUP_REMOVE]);
  }
};

/**
 * Returns the map of event callbacks associated with an open popup.
 *
 * @param {!jQuery} layer of an open popup
 * @return {!Object.<oj.PopupService.EVENT, function(...)>}
 * @public
 */
oj.ZOrderUtils.getEvents = function (layer)
{
  /** @type {?} */
  var events = layer.data(oj.ZOrderUtils._EVENTS_DATA);
  return events;
};

/**
 * Creates a script element before the target layer bound to the simple jquery UI
 * surrogate component.  Links this element to the layer by attribute named
 * {@link oj.ZOrderUtils._SURROGATE_ATTR}.
 *
 * @param {!jQuery} layer stacking context
 * @return {jQuery}
 * @private
 * @see oj.ZOrderUtils.addToAncestorLayer
 */
oj.ZOrderUtils._createSurrogate = function (layer)
{
  /** @type {?} */
  var surrogate = $("<script>");

  /** @type {?} */
  var layerId = layer.attr("id");
  if (oj.StringUtils.isEmptyOrUndefined(layerId))
    surrogate.uniqueId();
  else
    surrogate.attr("id", [layerId, "surrogate"].join("_"));

  surrogate.insertBefore(layer);
  var surrogateId = surrogate.attr('id');
  // loosely associate the popup to the surrogate element
  layer.attr(oj.ZOrderUtils._SURROGATE_ATTR, surrogateId);

  return surrogate;
};

/**
 * Reparents the layer after the associated surrogate script element removing
 * the surrogate script element.
 *
 * @param {!jQuery} layer stacking context of the popup
 * @return {void}
 * @private
 * @see oj.ZOrderUtils.removeFromAncestorLayer
 */
oj.ZOrderUtils._removeSurrogate = function (layer)
{
  /** @type {?} */
  var surrogateId = layer.attr(oj.ZOrderUtils._SURROGATE_ATTR);
  layer.removeAttr(oj.ZOrderUtils._SURROGATE_ATTR);

  /** @type {jQuery} */
  var surrogate = $(document.getElementById(surrogateId));
  layer.insertAfter(surrogate);

  surrogate['surrogate']("option", "beforeDestroy", null);
  surrogate.remove();
};

/**
 * Closes a open popup by reparenting it back to its original location within
 * the document marked by the surrogate.  Recursively calls the
 * {@link oj.PopupService.EVENT.POPUP_CLOSE} event callback on descendent popups.
 * @param {!jQuery} popup root widget
 * @return {void}
 * @public
 */
oj.ZOrderUtils.removeFromAncestorLayer = function (popup)
{
  var layer = oj.ZOrderUtils.getFirstAncestorLayer(popup);
  oj.ZOrderUtils.preOrderVisit(layer, oj.ZOrderUtils._closeDescendantPopupsCallback);

  oj.ZOrderUtils._removeOverlayFromAncestorLayer(layer);

  layer.removeData(oj.ZOrderUtils._EVENTS_DATA);
  layer.removeData(oj.ZOrderUtils._MODALITY_DATA);

  var popupDom = popup[0];
  oj.Components.subtreeDetached(popupDom);
  oj.ZOrderUtils._removeSurrogate(layer);
  oj.DomUtils.unwrap(popup, layer);
  oj.Components.subtreeAttached(popupDom);
};

/**
 * The {@link oj.ZOrderUtils.preOrderVisit} callback that invokes the
 * {@link oj.PopupService.EVENT.POPUP_CLOSE} function for descendent
 * popups.
 * @param {!jQuery} layer to be dismissed
 * @param {!Object} context for visit tree
 * @return {oj.ZOrderUtils.VISIT_RESULT}
 * @private
 * @see oj.ZOrderUtils.removeFromAncestorLayer
 */
oj.ZOrderUtils._closeDescendantPopupsCallback = function (layer, context)
{
  var level = context['level'];
  // Only need to visit the immediate children as the children will recursively
  // close any open child popups.
  if (level > 0)
    return oj.ZOrderUtils.VISIT_RESULT.REJECT;

  var events = layer.data(oj.ZOrderUtils._EVENTS_DATA);
  if (events && $.isFunction(events[oj.PopupService.EVENT.POPUP_CLOSE]))
    events[oj.PopupService.EVENT.POPUP_CLOSE]();

  return oj.ZOrderUtils.VISIT_RESULT.ACCEPT;
};

/**
 * Handles adding or removing a sibling overlay blocking pane before the dialog
 * based on the modality option.  The overlay pane is associated with the dialog
 * vai a attribute pointing to the id of the overlay.
 *
 * @param {!jQuery} layer for the target popup
 * @param {oj.PopupService.MODALITY} modality
 * @return {void}
 * @public
 */
oj.ZOrderUtils.applyModality = function (layer, modality)
{
  /** @type {?} */
  var currModality = layer.data(oj.ZOrderUtils._MODALITY_DATA);
  layer.data(oj.ZOrderUtils._MODALITY_DATA, modality);

  if (oj.StringUtils.isEmptyOrUndefined(currModality))
  {
    if (oj.PopupService.MODALITY.MODAL === modality)
      oj.ZOrderUtils._addOverlayToAncestorLayer(layer);
    else
      oj.ZOrderUtils._removeOverlayFromAncestorLayer(layer);
  }
  else if (currModality === modality)
    return;
  else if (modality !== currModality && modality === oj.PopupService.MODALITY.MODAL)
    oj.ZOrderUtils._addOverlayToAncestorLayer(layer);
  else
    oj.ZOrderUtils._removeOverlayFromAncestorLayer(layer);
};

/**
 * @return {boolean} <code>true</code> if one or more modal dialogs are open
 * @public
 */
oj.ZOrderUtils.hasModalDialogOpen = function ()
{
  var defaultLayer = oj.ZOrderUtils.getDefaultLayer();
  var children = defaultLayer.children();
  var childrenCount = children.length;
  for (var i = childrenCount - 1; i > -1; i--)
  {
    var child = $(children[i]);
    if (child.hasClass(oj.ZOrderUtils._OVERLAY_SELECTOR))
      return true;
  }

  return false;
};

/**
 * Creates a overlay div assigned the {@link oj.ZOrderUtils._OVERLAY_SELECTOR}
 * selector inserted before the dialog layer.  The layer is associated to the
 * overlay by the {@link oj.ZOrderUtils._OVERLAY_ATTR} assigned to the root layer
 * element.
 * @param {!jQuery} layer root widget
 * @return {void}
 * @private
 * @see oj.ZOrderUtils.applyModality
 */
oj.ZOrderUtils._addOverlayToAncestorLayer = function (layer)
{
  /** @type {jQuery} */
  var overlay = $("<div>");
  overlay.addClass(oj.ZOrderUtils._OVERLAY_SELECTOR);
  overlay.addClass(layer[0].className);
  overlay.attr("role", "presentation");

  /** @type {?} */
  var layerId = layer.attr("id");
  if (oj.StringUtils.isEmptyOrUndefined(layerId))
    overlay.uniqueId();
  else
    overlay.attr("id", [layerId, "overlay"].join("_"));

  layer.before(overlay);

  /** @type {?} */
  var overlayId = overlay.attr("id");
  layer.attr(oj.ZOrderUtils._OVERLAY_ATTR, overlayId);

};

/**
 * Removes the overlay associated with a modal dialog and removes the the attribute
 * that associates the popup with the overlay.
 *
 * @param {!jQuery} layer root widget
 * @return {void}
 * @private
 * @see oj.ZOrderUtils.applyModality
 */
oj.ZOrderUtils._removeOverlayFromAncestorLayer = function (layer)
{
  /** @type {?} */
  var overlayId = layer.attr(oj.ZOrderUtils._OVERLAY_ATTR);

  if (!oj.StringUtils.isEmptyOrUndefined(overlayId))
  {
    layer.removeAttr(oj.ZOrderUtils._OVERLAY_ATTR);
    var overlay = $(document.getElementById(overlayId));
    overlay.remove();
  }
};

/**
 * Resultant enumerated type used to control the popup visit (pre/post order)
 * traversal.
 * @enum {number}
 * @public
 * @see oj.ZOrderUtils.postOrderVisit
 * @see oj.ZOrderUtils.preOrderVisit
 */
oj.ZOrderUtils.VISIT_RESULT =
{
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
oj.ZOrderUtils._VISIT_TRAVERSAL =
{
  /** The callback is invoked on the target popup before any children. */
  PRE_ORDER: 0,
  /** The callback is invoked on the target popup after first visiting all descendents. */
  POST_ORDER: 1
};

/**
 * Visits all open popups invoking the callback function on the target popup after first
 * visiting all children in order of last open.
 * @param {!jQuery} layer to begin searching for popups
 * @param {function(!jQuery, !Object) : oj.ZOrderUtils.VISIT_RESULT} callback invoked for each child popup
 * @param {Object=} context passed to the visit
 * @return {void}
 * @public
 */
oj.ZOrderUtils.postOrderVisit = function (layer, callback, context)
{
  if (!context)
    context = {};

  context["level"] = 0;
  context["type"] = oj.ZOrderUtils._VISIT_TRAVERSAL.POST_ORDER;
  oj.ZOrderUtils._visitTree(layer, callback, context);
};

/**
 * Visits all open popups invoking the callback on the target popup before any
 * popups that are descendents.
 * @param {!jQuery} layer to begin searching for popups
 * @param {function(!jQuery, !Object) : oj.ZOrderUtils.VISIT_RESULT} callback invoked for each child popup
 * @param {Object=} context passed to the visit
 * @return {void}
 * @public
 */
oj.ZOrderUtils.preOrderVisit = function (layer, callback, context)
{
  if (!context)
    context = {};

  context["level"] = 0;
  context["type"] = oj.ZOrderUtils._VISIT_TRAVERSAL.PRE_ORDER;
  oj.ZOrderUtils._visitTree(layer, callback, context);
};

/**
 * Visits popups in order defined by {@link oj.ZOrderUtils._VISIT_TRAVERSAL.PRE_ORDER}
 * invoking the callback for each popup.
 * @param {!jQuery} layer to begin searching for popups
 * @param {function(!jQuery, !Object) : oj.ZOrderUtils.VISIT_RESULT} callback
 *        invoked for each child popup
 * @param {!Object} context passed to the visit
 * @return {oj.ZOrderUtils.VISIT_RESULT} instructions on how to proceed
 * @private
 * @see oj.ZOrderUtils.preOrderVisit
 * @see oj.ZOrderUtils.postOrderVisit
 */
oj.ZOrderUtils._visitTree = function (layer, callback, context)
{
  // Patterned from the RC visit APIs
  var level = context["level"];

  var children = layer.children();
  var childrenCount = children.length;
  for (var i = childrenCount - 1; i > -1; i--)
  {
    var child = $(children[i]);
    if (!oj.ZOrderUtils._hasSurrogate(child[0]))
      continue;

    var vrtn;

    // handle visit pre-order
    if (context["type"] === oj.ZOrderUtils._VISIT_TRAVERSAL.PRE_ORDER)
    {
      vrtn = callback(child, context);
      if (vrtn === oj.ZOrderUtils.VISIT_RESULT.COMPLETE)
        return vrtn;
      else if (vrtn === oj.ZOrderUtils.VISIT_RESULT.REJECT)
        break;
    }

    // visit children
    context["level"] = level + 1;
    vrtn = oj.ZOrderUtils._visitTree(child, callback, context);
    context["level"] = level;
    if (vrtn === oj.ZOrderUtils.VISIT_RESULT.COMPLETE)
      return vrtn;

    // handle visit post-order
    if (context["type"] === oj.ZOrderUtils._VISIT_TRAVERSAL.POST_ORDER)
    {
      vrtn = callback(child, context);
      if (vrtn === oj.ZOrderUtils.VISIT_RESULT.COMPLETE)
        return vrtn;
      else if (vrtn === oj.ZOrderUtils.VISIT_RESULT.REJECT)
        break;
    }
  }

  return oj.ZOrderUtils.VISIT_RESULT.ACCEPT;
};


/**
 * Determines the target element is an open popup by checking for the {@link oj.ZOrderUtils._SURROGATE_ATTR}
 * attribute assigned to open popup layers.
 *
 * @param {!Element} element to check for a stand-in component
 * @return {boolean} <code>true</code> if the element is associated with a placeholder element
 * @private
 */
oj.ZOrderUtils._hasSurrogate = function (element)
{
  if (element.nodeType === 1 && element.hasAttribute(oj.ZOrderUtils._SURROGATE_ATTR))
    return true;
  else
    return false;
};

/**
 * @return {boolean} <code>true</code> if one or more popups are open
 * @public
 */
oj.ZOrderUtils.hasPopupsOpen = function ()
{
  var defaultLayer = oj.ZOrderUtils.getDefaultLayer();
  return defaultLayer.children().length > 0;
};

/**
 * @return {number} total number of open popups
 * @public
 */
oj.ZOrderUtils.getOpenPopupCount = function ()
{
  var context = {};
  context["popupCount"] = 0;

  var defaultLayer = oj.ZOrderUtils.getDefaultLayer();
  oj.ZOrderUtils.preOrderVisit(defaultLayer, oj.ZOrderUtils._openPopupCountCallback, context);

  return context["popupCount"];
};

/**
 * The {@link oj.ZOrderUtils.preOrderVisit} callback for counting the total number of
 * open popups.
 * @param {!jQuery} layer
 * @param {!Object} context for visit tree
 * @return {oj.ZOrderUtils.VISIT_RESULT}
 * @private
 * @see oj.ZOrderUtils.getOpenPopupCount
 */
oj.ZOrderUtils._openPopupCountCallback = function (layer, context)
{
  context["popupCount"] = context["popupCount"] + 1;
  return oj.ZOrderUtils.VISIT_RESULT.ACCEPT;
};

/**
 * Returns a jQuery set of all open popup layer dom elements.  Popups open last will appear at the end of the
 * set. Used by automated testing.
 * @return {!jQuery} set of all open popup root elements managed by the popup service
 * @public
 */
oj.ZOrderUtils.findOpenPopups = function ()
{
  var context = {};

  /** @type {Array.<Element>} */
  var popups = [];

  context["popups"] = popups;
  var defaultLayer = oj.ZOrderUtils.getDefaultLayer();
  oj.ZOrderUtils.preOrderVisit(defaultLayer, oj.ZOrderUtils._openPopupsCallback, context);
  popups = context["popups"];

  return $(popups);
};

/**
 * The {@link oj.ZOrderUtils.preOrderVisit} callback that collects a set of open
 * popups.
 * @param {!jQuery} layer
 * @param {!Object} context for visit tree
 * @return {oj.ZOrderUtils.VISIT_RESULT}
 * @private
 * @see oj.ZOrderUtils.findOpenPopups
 */
oj.ZOrderUtils._openPopupsCallback = function (layer, context)
{
  /** @type {Array.<Element>} */
  var popups = context["popups"];
  popups.push(layer[0]);
  return oj.ZOrderUtils.VISIT_RESULT.ACCEPT;
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
oj.ZOrderUtils.compareStackingContexts = function (el1, el2)
{
  oj.Assert.assertPrototype(el1, jQuery);
  oj.Assert.assertPrototype(el2, jQuery);

  function describeStackingContext(element, allLevels) {
    var positions = ['absolute', 'relative', 'fixed'];
    var parents = element.parents();

    var tmp = [];
    for (var i = parents.length - 1; i > - 1; i--)
      tmp.push($(parents[i]));
    parents = tmp;

    parents.push(element);

    var stack = [];
    var level = 0;
    for (var i = 0; i < parents.length; i++)
    {
      var parent = parents[i];
      var position = parent.css("position");
      var opacity = oj.DomUtils.getCSSLengthAsFloat(parent.css("opacity"));
      var zindex = oj.DomUtils.getCSSLengthAsInt(parent.css("z-index"));
      var order = $.inArray(parent[0], parent.parent().children());
      if ($.inArray(position, positions) > -1)
        stack.push({'weight': [level++, zindex, order], 'order': [order]});
      else if (opacity < 1)
        stack.push({'weight': [level++, 1, order], 'order': [order]});
      else
      {
        if (!allLevels)
          continue;
        else
          stack.push({'weight': [0, 0, order], 'order': [order]});
      }
    }
    return stack;
  }
  ;

  function compareSets(n1, n2) {
    var maxLen = Math.max(n1.length, n2.length);
    for (var i = 0; i < maxLen; i++)
    {
      var e1 = i < n1.length ? n1[i] : -1;
      var e2 = i < n2.length ? n2[i] : -1;
      if (e1 === e2)
        continue;
      else if (e1 < e2)
        return -1;
      else
        return 1;
    }
    return 0;
  }
  ;

  var n1 = describeStackingContext(el1, false);
  var n2 = describeStackingContext(el2, false);

  var maxLen = Math.max(n1.length, n2.length);
  for (var i = 0; i < maxLen; i++)
  {
    var e1 = i < n1.length ? n1[i]['weight'] : [-1];
    var e2 = i < n2.length ? n2[i]['weight'] : [-1];

    var c = compareSets(e1, e2);
    if (c === 0)
      continue;
    else
      return c;
  }

  // include all elements for tie breaker
  n1 = describeStackingContext(el1, true);
  n2 = describeStackingContext(el2, true);

  maxLen = Math.max(n1.length, n2.length);
  // tie breaker based on document order
  for (var i = 0; i < maxLen; i++)
  {
    e1 = i < n1.length ? n1[i]['order'] : [-1];
    e2 = i < n2.length ? n2[i]['order'] : [-1];

    var c = compareSets(e1, e2);
    if (c === 0)
      continue;
    else
      return c;
  }

  return 0;
};

/**
 * Event listener that will stop propagation and prevent default on the event.
 * @param {jQuery.event=} event
 * @return {void}
 * @public
 */
oj.ZOrderUtils.eatEvent = function (event)
{
  event.stopPropagation();
  event.preventDefault();
};

/**
 * Key used to store the popup event callbacks on the popup layer
 * as a jQuery data property.
 * @const
 * @private
 * @type {string}
 */
oj.ZOrderUtils._EVENTS_DATA = "oj-popup-events";

/**
 * Key used to store the modality of a popup layer as a jQuery data property.
 * @const
 * @private
 * @type {string}
 */
oj.ZOrderUtils._MODALITY_DATA = "oj-popup-modality";

/**
 * The id assigned to the zorder container that will house all open popups.
 * The zorder container will be appended to the document body.
 * @const
 * @private
 * @type {string}
 */
oj.ZOrderUtils._DEFAULT_LAYER_ID = "__oj_zorder_container";

/**
 * The attribute name assigned to the associated layer of open popups.  The value of the
 * attribute will point to the script element that holds the place in the document
 * that the popup originated from prior to being open.
 * @const
 * @private
 * @type {string}
 */
oj.ZOrderUtils._SURROGATE_ATTR = "data-oj-surrogate-id";

/**
 * The attribute name assigned to the popup layer for open dialogs that have a
 * modality state of "modal".  The value of the attribute points to the associated
 * overlay element.
 * @const
 * @private
 * @type {string}
 */
oj.ZOrderUtils._OVERLAY_ATTR = "data-oj-overlayid";

/**
 * The CSS selector name assigned to the modal overlay DIV.
 * @const
 * @private
 * @type {string}
 */
oj.ZOrderUtils._OVERLAY_SELECTOR = "oj-component-overlay";

// -----------------------------------------------------------------------------

$.widget("oj.surrogate",
{
  options:
  {
    'create': null,
    'beforeDestroy': null
  },
  _create: function ()
  {
    this._super();
    this.element.uniqueId();
  },
  _destroy: function ()
  {
    this._trigger("beforeDestroy");
    this.element.removeUniqueId();
    this._super();
  }
});

/**
 * @extends {oj.Object}
 * @public
 * @constructor
 * @since 1.1.0
 * @class Invokes the callback function with the touchstart event if the touch sequence
 *        resulted in a "Tap".  The goal is to distinguish a touchstart that doesn't result
 *        in scroll.
 * @ignore
 * @param {function(!Event)} tapCallback function invoked when a Tap is detected
 */
oj.SimpleTapRecognizer = function (tapCallback)
{
  this._tapCallback = tapCallback;
  this.Init();
};

oj.Object.createSubclass(oj.SimpleTapRecognizer, oj.Object, "oj.SimpleTapRecognizer");

/**
 * Sets up the touch listeners ready to fire the callback.
 * @override
 * @instance
 * @protected
 */
oj.SimpleTapRecognizer.prototype.Init = function ()
{
  oj.SimpleTapRecognizer.superclass.Init.call(this);
  var eventHandlerCallback = this._eventHandlerCallback = $.proxy(this._eventHandler, this);

  var docElement = document.documentElement;
  for (var i = 0; i < oj.SimpleTapRecognizer._TOUCHEVENTS.length; i++)
    docElement.addEventListener(oj.SimpleTapRecognizer._TOUCHEVENTS[i], eventHandlerCallback, true);
};

/**
 * Keeps reference to the last touchstart event.  If at touchend is encountered before a
 * touchmove or touchcancel, then fire the tap callback with the touchstart event.
 * @private
 * @param {Event} event native touch event
 */
oj.SimpleTapRecognizer.prototype._eventHandler = function (event)
{
  var tapCallback = this._tapCallback;
  var eventType = event.type;
  if ("touchstart" === eventType)
  {
    this._touchStartEvent = event;
    this._touchStartEvent._tapStart = new Date().getTime();
  }
  else if ("touchmove" === eventType || "touchcancel" === eventType)
  {
    delete this._touchStartEvent;
  }
  else if ("touchend" === eventType)
  {
    if (this._touchStartEvent)
    {
      var tapStart = this._touchStartEvent._tapStart;
      if (!isNaN(tapStart))
      {
        var now = new Date().getTime();
        // if the period of ms between touchstart and touchend is less than the long touch thresshold, invoke the callback
        if (now - tapStart < oj.SimpleTapRecognizer._PRESSHOLDTHRESSHOLD)
          tapCallback(this._touchStartEvent);
      }
      else
        tapCallback(this._touchStartEvent);
    }

    delete this._touchStartEvent;
  }
};

/**
 * Unregisters touch listeners and deletes references to callbacks.
 * @public
 */
oj.SimpleTapRecognizer.prototype.destroy = function ()
{
  delete this._tapCallback;

  var eventHandlerCallback = this._eventHandlerCallback;
  delete this._eventHandlerCallback;

  var docElement = document.documentElement;
  for (var i = 0; i < oj.SimpleTapRecognizer._TOUCHEVENTS.length; i++)
    docElement.removeEventListener(oj.SimpleTapRecognizer._TOUCHEVENTS[i], eventHandlerCallback, true);
};

/**
 * Touch events that we are interested in listening for.
 *
 * @const
 * @private
 * @type {Array.<string>}
 */
oj.SimpleTapRecognizer._TOUCHEVENTS = ["touchstart", "touchmove", "touchcancel", "touchend"];

/**
 * Period of milliseconds for determining a long tap.  The normal threshold is 750ms.
 * The auto dismissal listeners for capture events versus bubble by the rest of the
 * framework.  Make the window for determining a long tap shorter than normal
 *
 * @const
 * @private
 * @type {number}
 */
oj.SimpleTapRecognizer._PRESSHOLDTHRESSHOLD = 700;

/**
 * @extends {oj.Object}
 * @public
 * @constructor
 * @since 1.1
 * @class Utility for handling popup voice over messages sent to a aria live region.
 * @ignore
 */
oj.PopupLiveRegion = function() {
  this.Init();
};

oj.Object.createSubclass(oj.PopupLiveRegion, oj.Object, "oj.PopupLiveRegion");

/**
 * Adds one to the reference counter instance.
 * @override
 * @instance
 * @protected
 */
oj.PopupLiveRegion.prototype.Init = function ()
{
  oj.PopupLiveRegion.superclass.Init.call(this);
  if (isNaN(oj.PopupLiveRegion._refCounter))
    oj.PopupLiveRegion._refCounter = 1;
  else
    ++oj.PopupLiveRegion._refCounter;
};

/**
 * Decrements the reference counter destroying the assocaited shared DOM aria
 * live region element when there are no longer any popups using it.
 * @instance
 * @public
 */
oj.PopupLiveRegion.prototype.destroy = function ()
{
  if (!isNaN(oj.PopupLiveRegion._refCounter))
  {
    --oj.PopupLiveRegion._refCounter;
    if (oj.PopupLiveRegion._refCounter < 1)
    {
      var liveRegion = $(document.getElementById(oj.PopupLiveRegion._POPUP_LIVE_REGION_ID));
      if (liveRegion.length > 0)
        liveRegion.remove();
    }
  }
};

/**
 * Sends a message to the aria live region for voice over mode.
 * @instance
 * @public
 * @param {string} message to be announce in the live region
 */
oj.PopupLiveRegion.prototype.announce = function (message)
{
  if (!oj.StringUtils.isEmpty(message))
  {
    var liveRegion = oj.PopupLiveRegion._getLiveRegion();
    liveRegion.children().remove();
    $("<div>").text(message).appendTo(liveRegion);
  }
};

/**
 * Creates or returns an existing aria live region used by popups.
 * @returns {jQuery} aria live region
 * @private
 */
oj.PopupLiveRegion._getLiveRegion = function()
{
  var liveRegion = $(document.getElementById(oj.PopupLiveRegion._POPUP_LIVE_REGION_ID));
  if (liveRegion.length === 0)
  {
    liveRegion = $("<div>");
    liveRegion.attr({'id': oj.PopupLiveRegion._POPUP_LIVE_REGION_ID, 'role': 'log', 'aria-live': 'polite', 'aria-relevant': 'additions'});
    liveRegion.addClass("oj-helper-hidden-accessible");
    liveRegion.appendTo(document.body);
  }
  return liveRegion;
};

/**
 * Id assigned to the popup aria live region dom element.
 * @const
 * @private
 * @type {string}
 */
oj.PopupLiveRegion._POPUP_LIVE_REGION_ID = "__oj_popup_arialiveregion";

/**
 * @extends {oj.Object}
 * @public
 * @constructor
 * @since 1.1
 * @class Utility that injects a hidden link relative to another for voice support
 * @ignore
 * @param {jQuery} sibling element to the new skip link element
 * @param {string} message text assigned to the skip link
 * @param {function(!Event)} callback fired for activation of the skip link
 * @param {string=} id assigned to the skiplink component
 */
oj.PopupSkipLink = function(sibling, message, callback, id)
{
  oj.Assert.assertPrototype(sibling, jQuery);
  oj.Assert.assertString(message);
  oj.Assert.assertFunction(callback);
  oj.Assert.assertStringOrNull(id);

  this._sibling = sibling;
  this._message = message;
  this._callback = callback;
  this._id = !id ? "" : id;
  this.Init();
};

oj.Object.createSubclass(oj.PopupSkipLink, oj.Object, "oj.PopupSkipLink");

/**
 * Creates an invisible anchor relative to the sibling and hooks up the activation callack.
 * @override
 * @instance
 * @protected
 */
oj.PopupSkipLink.prototype.Init = function()
{
  oj.PopupSkipLink.superclass.Init.call(this);
  var sibling = this._sibling;
  var callback = this._callback;
  var message = this._message;
  delete this._message;
  var id = this._id;
  delete this._id;

  var link = $("<a>").attr({'tabindex':'-1', 'href': '#'});
  if (!oj.StringUtils.isEmpty(id))
    link.attr("id", id);
  link.addClass("oj-helper-hidden-accessible");
  link.text(message);
  link.insertAfter(sibling);
  link.on("click", callback);
  sibling.data(oj.PopupSkipLink._SKIPLINK_ATTR, link);
};

/**
 * Removes the voice over skip link.
 * @instance
 * @public
 */
oj.PopupSkipLink.prototype.destroy = function()
{
  var sibling = this._sibling;
  delete this._sibling;

  var callback = this._callback;
  delete this._callback;

  if (sibling)
  {
    var link = sibling.data(oj.PopupSkipLink._SKIPLINK_ATTR);
    sibling.removeData(oj.PopupSkipLink._SKIPLINK_ATTR);
    if (link)
    {
      link.off("click", callback);
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
oj.PopupSkipLink.prototype.getLink = function()
{
  /** @type {?} */
  var sibling = this._sibling;
  /** @type {jQuery} */
  var link;
  if (sibling)
    link = sibling.data(oj.PopupSkipLink._SKIPLINK_ATTR);
  return link;
};

/**
 * Data attribute name assigned to the sibling element that tracks a
 * reference for the associated skip link.
 * @const
 * @private
 * @type {string}
 */
oj.PopupSkipLink._SKIPLINK_ATTR = "oj-skiplink";
});
