/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojanimation', 'ojs/ojlogger', 'ojdnd'],
       function(oj, $, Context, Config, ThemeUtils, Components, AnimationUtils, Logger)
{
  "use strict";
var __oj_masonry_layout_metadata = 
{
  "properties": {
    "reorderHandle": {
      "type": "string"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "labelCut": {
          "type": "string"
        },
        "labelPasteAfter": {
          "type": "string"
        },
        "labelPasteBefore": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "refresh": {},
    "resizeTile": {},
    "insertTile": {},
    "removeTile": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {},
    "ojBeforeInsert": {},
    "ojInsert": {},
    "ojBeforeRemove": {},
    "ojRemove": {},
    "ojBeforeResize": {},
    "ojResize": {},
    "ojBeforeReorder": {},
    "ojReorder": {}
  },
  "extension": {}
};


/*
** Important:
** - This file is designed to be shared verbatim among the ADFui products.
** - Do not add framework-specific dependencies in this file (it must be self-contained).
** - Do not change this file without testing it in other ADFui products (ADF Faces, JET, etc.).
*/

/**
 * Constructor.
 * @param {Object} elem DOM element associated with the masonry layout
 * @param {boolean} rtl True if the reading direction is right-to-left, otherwise false
 * @param {boolean} automationEnabled True if automation mode is enabled, otherwise false
 * @param {Object} selectors Map of properties for the following selector information:
 *  - tiles: Selector for child tiles.
 * @param {Object} styles Map of properties for the following style classes:
 *  - transitionShowFromStyleClass: Initial state for transition to show a child tile,
 * @param {Object} callbackInfo Map of properties for the following callback functions:
 *  - addStyleClassName: Add a style class to a DOM element,
 *  - removeStyleClassName: Remove a style class from a DOM element,
 *  - getSizeStyleClassName: Get the style class for the tile size,
 *  - getTileSpan: Get the tile span,
 *  - showTileOnEndFunc: Called after a tile is shown,
 *  - hideTileOnEndFunc: Called after a tile is hideden,
 *  - startAnimationFunc: Called to animate a tile,
 *  - layoutOnEndFunc: Called after tiles are positioned,
 *  - layoutCycleOnStartFunc: Called before entire layout cycle begins,
 *  - layoutCycleOnEndFunc: Called after entire layout cycle is done,
 *  - sortTilesOriginalOrderFunc: Sort tile DOM elements into their original order,
 *  - subtreeAttached: Called after a tile is attached to the DOM,
 *  - subtreeDetached: Called after a tile is detached from the DOM,
 *  - addBusyState: Add a busy state to the busy context.
 * @class MasonryLayoutCommon
 * @memberof MasonryLayoutCommon
 * @protected
 * @constructor
 * @ignore
 * @ojtsignore
 */
function MasonryLayoutCommon(
  elem,
  rtl,
  automationEnabled,
  selectors,
  styles,
  callbackInfo) {
  // this agent initialization concept copied from adf.shared.impl.animationUtils.transition()
  var mlcClass = MasonryLayoutCommon;
  if (mlcClass._agentTypeAndVersion == null) {
    // Do a 1-time agent initialization
    mlcClass._agentTypeAndVersion = mlcClass._getAgentTypeAndVersion(navigator.userAgent);
  }

  this._elem = elem;
  this._rtl = rtl;
  this._automationEnabled = automationEnabled;
  this._tilesSelector = selectors.tiles;
  this._transitionShowFromStyleClass = styles.transitionShowFromStyleClass;
  this._addStyleClassNameFunc = callbackInfo.addStyleClassName;
  this._removeStyleClassNameFunc = callbackInfo.removeStyleClassName;
  this._getSizeStyleClassNameFunc = callbackInfo.getSizeStyleClassName;
  this._getTileSpanFunc = callbackInfo.getTileSpan;
  this._showTileOnEndFunc = callbackInfo.showTileOnEndFunc;
  this._hideTileOnEndFunc = callbackInfo.hideTileOnEndFunc;
  this._startAnimationFunc = callbackInfo.startAnimationFunc;
  this._layoutOnEndFunc = callbackInfo.layoutOnEndFunc;
  // FIX : need to know when layout cycle is starting in order
  // to preserve focus across layout DOM order changes
  this._layoutCycleOnStartFunc = callbackInfo.layoutCycleOnStartFunc;
  this._layoutCycleOnEndFunc = callbackInfo.layoutCycleOnEndFunc;
  // FIX : need to be able to sort the tiles into their original
  // DOM order before running layout
  this._sortTilesOriginalOrderFunc = callbackInfo.sortTilesOriginalOrderFunc;
  this._subtreeAttachedFunc = callbackInfo.subtreeAttached;
  this._subtreeDetachedFunc = callbackInfo.subtreeDetached;
  this._addBusyStateFunc = callbackInfo.addBusyState;

  // create a non-absolutely positioned div to define the size of the
  // infolet layout, because the absolutely positioned infolets are not
  // part of the flow and will not define the size of the component div
  var sizeDivWrapper = document.createElement('div');
  var style = sizeDivWrapper.style;
  style.display = 'inline-block';
  style.overflow = 'hidden';
  style.visibility = 'hidden';
  var sizeDiv = document.createElement('div');
  style = sizeDiv.style;
  style.display = 'inline-block';
  sizeDivWrapper.appendChild(sizeDiv); // @HTMLUpdateOK
  elem.insertBefore(sizeDivWrapper, elem.firstChild); // @HTMLUpdateOK
  this._sizeDivWrapper = sizeDivWrapper;
  this._sizeDiv = sizeDiv;

  var self = this;
  this._hideTilesFunc = function () {
    self._hideTiles();
  };
  this._resolveBusyStateFunc = function () {
    self._resolveBusyState();
  };
}

/**
 * Setup the masonry layout.
 * @param {boolean} init True for initialization, false for refresh
 * @param {boolean} reorder True for reordering, false otherwise
 * @return {boolean} True if layout changed, false if not
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.setup = function (init, reorder) {
  var ret = false;
  if (init) {
    // layout without animating
    ret = !!this._layout();
    // FIX : reorder the tile DOM elements to match the visual layout order
    this._reorderTilesForLayout();
  } else {
    // FIX : add busy state before animating a layout change
    this._busyStateResolveFunc = this._addBusyStateFunc('performing layout (setup)');

    // FIX : notify the peer that a layout cycle is starting so that
    // it can save state if it wants
    this._layoutCycleOnStartFunc();

    // if this is a refresh, add the transition class BEFORE doing the next layout
    this._transitionStart(reorder);
    ret = this._transitionLayout();
  }
  return ret;
};

/**
 * Destroy the masonry layout.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.destroy = function () {
  // FIX : resolve busy state when destroying
  this._resolveBusyState();

  var elem = this._elem;

  // remove layout positions from the children
  var children = this._getTileChildren();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var style = child.style;
    if (this._rtl) {
      style.right = '';
    } else {
      style.left = '';
    }
    style.top = '';
  }

  elem.removeChild(this._sizeDivWrapper);
  this._sizeDivWrapper = null;
  this._sizeDiv = null;

  this._hideTilesFunc = null;
  this._resolveBusyStateFunc = null;

  this._arMovedInfolets = null;
  this._arInfoletsToResize = null;
  this._arInfoletsToShow = null;
  this._arInfoletsToHide = null;
  this._arFireHideOnEnd = null;

  this._elem = null;
  this._addStyleClassNameFunc = null;
  this._removeStyleClassNameFunc = null;
  this._getSizeStyleClassNameFunc = null;
  this._getTileSpanFunc = null;
  this._showTileOnEndFunc = null;
  this._hideTileOnEndFunc = null;
  this._startAnimationFunc = null;
  this._layoutOnEndFunc = null;
  this._layoutCycleOnStartFunc = null;
  this._layoutCycleOnEndFunc = null;
  this._sortTilesOriginalOrderFunc = null;
  this._subtreeAttachedFunc = null;
  this._subtreeDetachedFunc = null;
  this._addBusyStateFunc = null;
};

/**
 * Resize a child tile.
 * @param {string} selector Selector for the tile to resize
 * @param {string} sizeStyleClass New size style class
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.resizeTile = function (selector, sizeStyleClass) {
  var elem = this._elem;
  var infolet = elem.querySelector(selector);
  // add the transition class immediately, but defer the layout call using a
  // timeout so that the app can set new sizes on the children before the
  // layout call happens so that the size changes will be animated along with
  // the relayout
  if (!this._arInfoletsToResize) {
    this._arInfoletsToResize = [];
  }
  var arInfoletsToResize = this._arInfoletsToResize;
  arInfoletsToResize.push(infolet);
  arInfoletsToResize.push(sizeStyleClass);
  this._resizingInfolet = true;

  this._queueRelayout();
};

/**
 * Insert a tile into the masonryLayout.
 * @param {Object} tileDomElem Tile to insert
 * @param {number} index Index at which to insert
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.insertTileDomElem = function (tileDomElem, index) {
  var arChildren = this._getTileChildren();
  // FIX : need to sort the tiles into their original DOM order
  // before inserting because the index is relative to the original DOM order,
  // not the current layout order
  this._sortTilesOriginalOrderFunc(arChildren);
  var currChildAtIndex = null;
  if (index >= 0 && index < arChildren.length) {
    currChildAtIndex = arChildren[index];
  }
  var elem = this._elem;
  elem.insertBefore(tileDomElem, currChildAtIndex); // @HTMLUpdateOK

  this._queueRelayout();
};

/**
 * Show a hidden tile.
 * @param {string} selector Selector for the tile to show
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.showTile = function (selector) {
  var elem = this._elem;
  var infolet = elem.querySelector(selector);
  if (infolet) {
    if (!this._arInfoletsToShow) {
      this._arInfoletsToShow = [];
    }
    var arInfoletsToShow = this._arInfoletsToShow;
    arInfoletsToShow.push(infolet);
    this._showingInfolets = true;

    // don't queue another layout if we're already doing layout and in a phase
    // before the SHOW phase
    var mlcClass = MasonryLayoutCommon;
    if (this._layoutPhase !== mlcClass._PHASE_HIDE &&
        this._layoutPhase !== mlcClass._PHASE_LAYOUT) {
      this._queueRelayout();
    } else {
      // if not queueing a relayout, need to explicitly set this flag to false
      // now so that future component resizes will be processed in resizeNotify()
      this._showingInfolets = false;
    }
  }
};

/**
 * Hide a tile.
 * @param {string} selector Selector for the tile to hide
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.hideTile = function (selector) {
  var elem = this._elem;
  var infolet = elem.querySelector(selector);
  if (infolet) {
    if (!this._arInfoletsToHide) {
      this._arInfoletsToHide = [];
    }
    var arInfoletsToHide = this._arInfoletsToHide;
    arInfoletsToHide.push(infolet);
    this._hidingInfolets = true;

    this._queueRelayout();
  }
};

/**
 * Notify the MasonryLayoutCommon that the masonryLayout component has been resized.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.resizeNotify = function () {
  // don't respond to resize events when we're already doing layout
  if (!this._resizingInfolet &&
      !this._hidingInfolets &&
      !this._showingInfolets) {
    // FIX : add busy state before animating a layout change
    this._busyStateResolveFunc = this._addBusyStateFunc('performing layout (resizeNotify)');

    // FIX : notify the peer that a layout cycle is starting so that
    // it can save state if it wants
    this._layoutCycleOnStartFunc();

    this._transitionStart(false);
    this._transitionLayout();
  }
};

/**
 * Get the size of a unit cell.
 * @return {Object} object specifying unit cell size with properties w and h
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.getCellSize = function () {
  return this._cellSize;
};

/**
 * Determine whether animation is enabled.
 * @return {boolean} true if animation is enabled, false if not
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.isAnimationEnabled = function () {
  if (this._temporarilyDisableAnimation) {
    return false;
  }

  if (!this._cachedAnimationEnabled) {
    if (this._automationEnabled) {
      this._animationEnabled = false;
    } else {
      var mlcClass = MasonryLayoutCommon;
      var agentType = mlcClass._agentTypeAndVersion[0];
      var agentVersion = mlcClass._agentTypeAndVersion[1];

      // check whether the agent supports CSS transitions
      this._animationEnabled = mlcClass._isMinimumAgentMet(agentType, agentVersion,
        ['gecko', 16,
          'trident', 6,
          'webkit', 533.1]);
    }
    this._cachedAnimationEnabled = true;
  }
  return this._animationEnabled;
};

/**
 * Determine whether a layout cycle is currently underway.
 * @return {boolean} true if in a layout cycle, false otherwise
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.isInLayoutCycle = function () {
  // FIX : when drag and drop reordering, the layoutPhase doesn't
  // get set because we're only running layout itself, so also check whether
  // we're moving tiles
  return (this._layoutPhase != null ||
          (this._arMovedInfolets != null && this._arMovedInfolets.length > 0));
};

/**
 * Finish the current layout cycle, aborting and/or skipping any animations.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 */
MasonryLayoutCommon.prototype.finishLayoutCycle = function () {
  // FIX : when we get multiple masonry events in quick succession, we need
  // to abort and skip animation due to processing the previous event in order to
  // start processing the latest event immediately
  this._temporarilyDisableAnimation = true;

  // remove transition classes for animation
  this._removeStyleClassFromTiles(this._transitionShowFromStyleClass);

  // remove transition listeners
  var mlcClass = MasonryLayoutCommon;

  var tileChildren = this._getTileChildren();
  for (var i = 0; i < tileChildren.length; i++) {
    var child = tileChildren[i];
    if (child._afrCellSize) {
      delete child._afrCellSize;
    }
  }

  // now that we've stopped and blocked animation, continue processing the layout cycle
  // based on the phase we're currently in
  if (this._hideTilesAnimationStarted) {
    this._hideTilesAnimationStarted = false;
    this._handleHideTransitionEnd(null);
  } else if (this._showTilesTimeout) {
    clearTimeout(this._showTilesTimeout);
    this._showTilesTimeout = null;

    this._showTiles();
  } else if (this._layoutPhase === mlcClass._PHASE_LAYOUT ||
             (this._arMovedInfolets != null && this._arMovedInfolets.length > 0)) {
    // FIX : when drag and drop reordering, the layoutPhase doesn't
    // get set because we're only running layout itself, so also check whether
    // we're moving tiles
    this._handleTransitionEnd(null);
  } else if (this._layoutPhase === mlcClass._PHASE_SHOW) {
    this._handleShowTransitionEnd(null);
  }

  // reenable animation
  this._temporarilyDisableAnimation = false;
};

/**
 * Get the size of the given DOM element (including margins).
 * @param {Object} elem DOM element
 * @return {Object} Object specifying size of element with properties w and h
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._getElemSize = function (elem) {
  var mlcClass = MasonryLayoutCommon;
  var computedStyle = mlcClass._getComputedStyle(elem);
  var extraWidth = mlcClass._getCSSLengthAsInt(computedStyle.marginLeft) +
                   mlcClass._getCSSLengthAsInt(computedStyle.marginRight);
  var extraHeight = mlcClass._getCSSLengthAsInt(computedStyle.marginTop) +
                    mlcClass._getCSSLengthAsInt(computedStyle.marginBottom);
  return { w: elem.offsetWidth + extraWidth, h: elem.offsetHeight + extraHeight };
};

/**
 * Get the insets of a given DOM element (padding and border).
 * @param {Object} elem DOM element
 * @return {Object} Object specifying size of insets with properties:
 *         paddingLeft, paddingRight, paddingTop, paddingBottom,
 *         bodrerLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._getElemInsets = function (elem) {
  var mlcClass = MasonryLayoutCommon;
  var computedStyle = mlcClass._getComputedStyle(elem);
  return {
    paddingLeft: mlcClass._getCSSLengthAsInt(computedStyle.paddingLeft),
    paddingRight: mlcClass._getCSSLengthAsInt(computedStyle.paddingRight),
    paddingTop: mlcClass._getCSSLengthAsInt(computedStyle.paddingTop),
    paddingBottom: mlcClass._getCSSLengthAsInt(computedStyle.paddingBottom),
    borderLeftWidth: mlcClass._getCSSLengthAsInt(computedStyle.borderLeftWidth),
    borderRightWidth: mlcClass._getCSSLengthAsInt(computedStyle.borderRightWidth),
    borderTopWidth: mlcClass._getCSSLengthAsInt(computedStyle.borderTopWidth),
    borderBottomWidth: mlcClass._getCSSLengthAsInt(computedStyle.borderBottomWidth) };
};

/**
 * Get the computed style of the given DOM element.
 * @param {Object} elem DOM element
 * @return {Object} Computed style for the element
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._getComputedStyle = function (elem) {
  var elemOwnerDoc = elem.ownerDocument;
  var defView = elemOwnerDoc.defaultView;
  var computedStyle = null;
  if (defView) {
    // this line copied from AdfAgent.getComputedStyle()
    computedStyle = defView.getComputedStyle(elem, null);
  } else {
    // this line copied from AdfIEAgent.getComputedStyle()
    computedStyle = elem.currentStyle;
  }
  return computedStyle;
};

/**
 * Get the int value of a CSS length.
 * @param {string} cssLength cssLength as a string
 * @return {number} cssLength as an int
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._getCSSLengthAsInt = function (cssLength) {
  // this function copied from AdfAgent.getCSSLengthAsInt
  if ((cssLength.length) > 0 && (cssLength !== 'auto')) {
    var intLength = parseInt(cssLength, 10);

    if (isNaN(intLength)) {
      intLength = 0;
    }

    return intLength;
  }
  return 0;
};

/**
 * Get the index of an item in an array.
 * @param {Array} array Array to search
 * @param {Object} item Item to search for
 * @return {number} index of item in array, or -1 if not found
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._arrayIndexOf = function (array, item) {
  if (array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return i;
      }
    }
  }
  return -1;
};

/**
 * Gets whether the specified agent minimum requirements are met or exceeded.
 * Every 2 arguments past actualAgentType and actualAgentVersion must correspond
 * to a minimum required agent type and floating point version number.
 * @param {string} actualAgentType the actual agent type ("trident", "webkit", "gecko")
 * @param {number} actualAgentVersion the actual agent version number as a floating point number
 * @param {Array} agentRequirements the required agent types and versions
 * @return {boolean} whether the specified agent minimums are met
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._isMinimumAgentMet = function (
  actualAgentType, actualAgentVersion, agentRequirements
) {
  // This function was copied from adf.shared.impl.animationUtils

  var argCount = agentRequirements.length;
  if (argCount % 2 === 0) { // even number
    // Loop through each requirement pair to see if we match one
    for (var i = 0; i <= argCount - 2; i += 2) {
      var requirementType = agentRequirements[i];
      if (actualAgentType === requirementType) {
        // We found an agent type match so now see if the actual version is greater than or equal
        // to the requirement version number:
        var requirementVersion = agentRequirements[1 + i];
        if (actualAgentVersion >= requirementVersion) {
          return true;
        } // met requirement
        return false; // failed requirement
      }
    }
  }
  return false; // no agent type match found; failed requirement
};

/**
 * Gets the agent type and version.
 * @param {string} givenUserAgentString the navigator's userAgent property
 * @return {Array} with 2 members, a string for the agent
 *         type ("trident", "webkit", "gecko") and a Float for the agent version
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._getAgentTypeAndVersion = function (givenUserAgentString) {
  // This function was copied from adf.shared.impl.animationUtils

  var mlcClass = MasonryLayoutCommon;
  var versionParser = mlcClass._parseFloatVersion;
  var agentType = null;
  var agentVersion = -1;
  var userAgent = givenUserAgentString.toLowerCase();
  if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
    agentType = 'trident';
    var possibleVersion = versionParser(userAgent, /trident\/(\d+[.]\d+)/);
    if (possibleVersion !== -1) {
      // 6.0 = IE10
      // 5.0 = IE9
      // 4.0 = IE8
      agentVersion = possibleVersion;
    } else {
      possibleVersion = versionParser(userAgent, /msie (\d+\.\d+);/);
      if (possibleVersion === -1) {
        possibleVersion = versionParser(userAgent, /msie (\d+\.\d+)b;/); // expression for betas
      }
      agentVersion = possibleVersion - 4; // Trident versions are 4 behind IE numbers
    }
    if (document.documentMode != null) {
      // If a documentMode is provided, it would be an IE number and Trident versions are 4 behind IE numbers.
      // The actual Trident version in use would be the smaller of the 2 numbers:
      agentVersion = Math.min(agentVersion, document.documentMode - 4);
    }
  } else if (userAgent.indexOf('applewebkit') !== -1) {
    agentType = 'webkit';
    // 536.26.17 = Mac Desktop Safari 6.0.2
    // 535.1 = Chrome 13.0.782.1
    // 534.46 = Safari 5.1 or iOS 5
    // 525.18 = Mac/Windows Desktop Safari 3.1.1
    // 420.1 = iOS 3
    agentVersion = versionParser(userAgent, /applewebkit\/(\d+([.]\d+)*)/);
  } else if (userAgent.indexOf('gecko/') !== -1) {
    agentType = 'gecko';
    // rv:5 = Firefox 5
    // rv:2 = Firefox 4
    // rv:1.9 = Firefox 3
    // rv:1.8.1 = Firefox 2
    // rv:1.8 = Firefox 1.5
    agentVersion = versionParser(userAgent, /rv:(\d+[.]\d+)/);
  }
  return [agentType, agentVersion];
};

/**
 * Parses the float version out of of the specified agent string using
 * a regular expression to identify the version portion of the string.
 * @param {string} userAgent the lowercase navigator user agent string
 * @param {RegExp} versionNumberPattern the regular expression pattern
 *        used to extract a number that will be parsed into a float
 * @return {number} version number
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._parseFloatVersion = function (userAgent, versionNumberPattern) {
  // This function was copied from adf.shared.impl.animationUtils

  var matches = userAgent.match(versionNumberPattern);
  if (matches) {
    var versionString = matches[1];
    if (versionString) {
      return parseFloat(versionString);
    }
  }
  return -1;
};

/**
 * Comparison function used to sort tiles according to their layout positions.
 * @param {Object} pos1 Object that defines the startCol and startRow for a tile
 * @param {Object} pos2 Object that defines the startCol and startRow for another tile
 * @return {number} -1 if pos1 should be sorted before pos2, 1 if pos2 should be sorted
 *         before pos1
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._compareTilePositions = function (pos1, pos2) {
  // FIX : sort by rows first, because if the rows are different then
  // the columns don't matter
  if (pos1.startRow > pos2.startRow) {
    return 1;
  }
  if (pos1.startRow < pos2.startRow) {
    return -1;
  }

  // sort by columns only if the rows are the same
  if (pos1.startCol > pos2.startCol) {
    return 1;
  }
  return -1;
};

/**
 * Queue a relayout.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._queueRelayout = function () {
  if (!this._hideTilesTimeout) {
    // FIX : if we're not in a layout cycle, set the timeout to start one;
    // otherwise, if we are in a layout cycle, set the flag indicating we need to queue
    // another one
    if (!this._layoutPhase) {
      // FIX : add busy state before animating a layout change
      this._busyStateResolveFunc = this._addBusyStateFunc('performing layout');

      this._hideTilesTimeout = setTimeout(this._hideTilesFunc, 0); // @HTMLUpdateOK
    } else if (!this._queuedRelayout) {
      this._queuedRelayout = true;
    }
  }
};

/**
 * Get the rendered child tiles.
 * @return {Array} Array of rendered child tiles
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._getTileChildren = function () {
  var elem = this._elem;
  var children = elem.querySelectorAll(this._tilesSelector);
  var arChildren = [];
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childStyle = child.style;
    if (child.offsetWidth > 0 && child.offsetHeight > 0 && childStyle.visibility !== 'hidden') {
      arChildren.push(child);
    }
  }
  return arChildren;
};

/**
 * Layout and animate with a transition.  This is the second phase of the
 * <hide, layout, show> sequence.
 * @return {boolean} true if layout changed, otherwise false
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._transitionLayout = function () {
  var oldMovedInfolets = this._arMovedInfolets;
  var newMovedInfolets = this._layout();

  // an infolet should be considered to "move" if it's resized, even if it doesn't change position,
  // because it will still go through a transition
  if (this._arInfoletsToResize) {
    var arInfoletsToResize = this._arInfoletsToResize;
    if (!newMovedInfolets) {
      newMovedInfolets = [];
    }
    var mlcClass = MasonryLayoutCommon;
    for (var i = 0; i < arInfoletsToResize.length; i += 2) {
      var resizedInfolet = arInfoletsToResize[i];
      if (mlcClass._arrayIndexOf(newMovedInfolets, resizedInfolet) < 0) {
        newMovedInfolets.push(resizedInfolet);
      }
    }
  }

  var calledHandleTransitionEnd = false;
  if (!newMovedInfolets || newMovedInfolets.length < 1) {
    if (!oldMovedInfolets || oldMovedInfolets.length < 1) {
      this._arMovedInfolets = null;
      this._handleTransitionEnd(null);
      calledHandleTransitionEnd = true;
    }
  } else {
    this._arMovedInfolets = newMovedInfolets;
  }

  var ret = (newMovedInfolets != null && newMovedInfolets.length > 0);

  if (!this.isAnimationEnabled() && !calledHandleTransitionEnd) {
    this._handleTransitionEnd(null);
  }

  return ret;
};

/**
 * Layout.
 * @return {Array} Array of tiles that were moved
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._layout = function () {
  var elem = this._elem;
  var children = this._getTileChildren();
  // FIX : need to sort the tiles into their original DOM order
  // before layout so that layout always starts from the intended order of the
  // children, not from the current layout order
  this._sortTilesOriginalOrderFunc(children);
  // always recalculate cell size in case the app has specified media queries
  // to change CSS cell sizes based on screen or component size
  this._cellSize = null;
  var cellSize = null;
  this._cols = 0;
  this._rows = 1;
  this._occupancyMap = null;
  var arMovedInfolets = [];
  var arOldPositions = [];
  var arNewPositions = [];
  var arCols = [];
  var rtl = this._rtl;
  // FIX : need to take container border and padding into account for layout
  var mlcClass = MasonryLayoutCommon;
  var insets = mlcClass._getElemInsets(elem);
  // FIX : keep track of maxColSpan to define width of layout
  var maxColSpan = 0;
  // FIX : keep track of tile positions so that tiles can later be
  // sorted into layout order
  var arTilePositions = [];
  this._arTilePositions = arTilePositions;

  var i;
  var child;
  var childStyle;
  var newPosition;
  var oldPosition;

  for (i = 0; i < children.length; i++) {
    child = children[i];

    // if we've saved cell size on the infolet, we need to use it because
    // that refers to pre-transition cell size based on old size style class.
    // get the cell size if we've saved it on the infolet being resized,
    // and then delete it from the infolet
    if (child._afrCellSize) {
      this._cellSize = child._afrCellSize;
      delete child._afrCellSize;
    }

    var childSpan = this._getTileSpanFunc(child);
    if (!this._cellSize) {
      this._cellSize = this._calcCellSize(child, childSpan);
    }
    cellSize = this._cellSize;

    // keep track of which cells are occupied
    if (!this._occupancyMap) {
      // make sure we have at least 1 column to work with
      // FIX : width available for layout is the offsetWidth minus
      // padding and borders
      var effectiveWidth = elem.offsetWidth - insets.paddingLeft - insets.paddingRight -
                           insets.borderLeftWidth - insets.borderRightWidth;
      this._cols = Math.max(Math.floor(effectiveWidth / cellSize.w), 1);
      this._initOccupancyMap(this._cols, this._rows);
      // FIX : initialize maxColSpan to define width of layout based
      // on the calculated number of layout columns
      maxColSpan = this._cols;
    }

    // FIX : keep track of maxColSpan to define width of layout
    // (must do this using original value of colSpan BEFORE potentially decreasing
    // colSpan based on number of _cols below)
    if (childSpan.colSpan > maxColSpan) {
      maxColSpan = childSpan.colSpan;
    }

    // handle case where childSpan is bigger than the number of cols by treating
    // childSpan as if it equaled the number of cols (can only modify childSpan
    // AFTER using original value to calculate cellSize above)
    if (childSpan.colSpan > this._cols) {
      childSpan.colSpan = this._cols;
    }

    var next = false;
    for (var r = 0; r < this._rows; r++) {
      for (var c = 0; c < this._cols; c++) {
        if (this._fits(c, r, childSpan)) {
          // save old position before applying new one so that we can use it below to
          // figure out which infolets actually moved
          childStyle = child.style;
          oldPosition = { top: childStyle.top };
          // FIX : in RTL, position tiles using "right" instead of "left"
          if (rtl) {
            oldPosition.right = childStyle.right;
          } else {
            oldPosition.left = childStyle.left;
          }
          arOldPositions.push(oldPosition);
          newPosition = this._calcPosition(child, c, r, childSpan, cellSize, insets);
          arNewPositions.push(newPosition);

          if (rtl) {
            arCols.push(c);
          }
          next = true;
          // FIX : keep track of tile positions so that tiles can later be
          // sorted into layout order
          arTilePositions.push({ startCol: c, startRow: r, tile: child });
          break;
        }
      }
      if (next) {
        break;
      }
      if (r === this._rows - 1) {
        this._addRow();
      }
    }
  }

  // only need to adjust sizeDiv and adjust layout for rtl if there are child tiles
  if (cellSize) {
    var sizeDiv = this._sizeDiv;
    var style = sizeDiv.style;

    if (style) {
      // FIX : define width based on the maxColSpan
      var width = (maxColSpan * cellSize.w);
      var height = (this._rows * cellSize.h);

      // get the current sizeDiv width and height
      var currWidth = (style.width ?
                       MasonryLayoutCommon._getCSSLengthAsInt(style.width.toString()) :
                       0);
      var currHeight = (style.height ?
                        MasonryLayoutCommon._getCSSLengthAsInt(style.height.toString()) :
                        0);
      if (currWidth > width || currHeight > height) {
        // temporarily store the new width/height of the sizeDiv
        // this dimensions will be applied only after the layout transition is complete,
        // because the new dimensions are smaller than current sizeDiv dimensions
        this._afrSizeDivDims = {};
        this._afrSizeDivDims.width = width + 'px';
        this._afrSizeDivDims.height = height + 'px';
      }
      // temporarily set the max dimensions on sizeDiv until the layout transition is complete
      // this will avoid any appearance of scrollbar during the layout transition.
      style.width = (currWidth > width ? currWidth : width) + 'px';
      style.height = (currHeight > height ? currHeight : height) + 'px';
    }
  }

  // figure out which infolets actually moved (need to do this AFTER adjusting for RTL above)
  for (i = 0; i < children.length; i++) {
    child = children[i];
    childStyle = child.style;
    newPosition = arNewPositions[i];
    oldPosition = arOldPositions[i];

    // if this is a new tile that masonryLayout didn't know about, then
    // don't mark it as being moved because it won't actually transition
    if (oldPosition.top !== '') {
      // round to int because fractional value differences in Firefox don't actually result in transition,
      // and it really doesn't make much difference to the user whether they're animated because
      // they're so small
      // FIX : in RTL, position tiles using "right" instead of "left"
      if ((rtl && (parseInt(newPosition.right, 10) !== parseInt(oldPosition.right, 10))) ||
          (!rtl && (parseInt(newPosition.left, 10) !== parseInt(oldPosition.left, 10))) ||
          (parseInt(newPosition.top, 10) !== parseInt(oldPosition.top, 10))) {
        arMovedInfolets.push(child);
        if (this._layoutTransition) {
          if (mlcClass._arrayIndexOf(this._arInfoletsToResize, child) < 0) {
            // This applies the transition styles via the animation framework and this
            // has to be called before positioning the tiles for the animation to work correctly.
            // Add transition only if child is not also being resized.  Otherwise
            // the resize code would have added the transition.
            this._animateLayout(child, this._reorderTransitionStarted ? 'reorder' : 'move');
          }
        }
      }
    }

    // FIX  - MASONRY LAYOUT: LAYOUT DOES NOT ANIMATE FOR THE FIRST TIME
    // Position the child tiles after setting the layout transition animation.
    childStyle.top = newPosition.top;
    if (this._rtl) {
      childStyle.right = newPosition.right;
    } else {
      childStyle.left = newPosition.left;
    }
  }

  if (arMovedInfolets.length < 1) {
    arMovedInfolets = null;
  }
  return arMovedInfolets;
};

/**
 * Update sizeDiv dimensions after the layout transition is complete
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._updateSizeDivOnEnd = function () {
  // if new sizeDiv dimension is available, set that on sizeDiv
  if (this._afrSizeDivDims) {
    var style = this._sizeDiv.style;
    style.width = this._afrSizeDivDims.width;
    style.height = this._afrSizeDivDims.height;
    delete this._afrSizeDivDims;
  }
};

/**
 * Reorder tiles in the DOM to match the visual layout order so that tab order
 * and screen reader reading order match the visual layout order.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._reorderTilesForLayout = function () {
  // FIX : loop through the DOM order and layout order, and where
  // the tiles at a given index are different, rearrange the DOM order to
  // match the layout order
  var arTilePositions = this._arTilePositions;
  this._arTilePositions = null;
  var mlcClass = MasonryLayoutCommon;
  arTilePositions = arTilePositions.sort(mlcClass._compareTilePositions);
  var children = this._getTileChildren();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var pos = arTilePositions[i];
    var posTile = pos.tile;
    // if the tiles are different, need to rearrange the DOM
    if (child !== posTile) {
      // notify the element that it's been detached from the DOM BEFORE actually
      // detaching it so that components can save state
      this._subtreeDetachedFunc(posTile);
      // insert the tile from the layout order into the DOM at this index
      var parentNode = child.parentNode;
      parentNode.insertBefore(posTile, child); // @HTMLUpdateOK
      // notify the element that it's been attached to the DOM
      this._subtreeAttachedFunc(posTile);

      // rearrange the array of children to match the DOM reorder above
      var posTileIndex = mlcClass._arrayIndexOf(children, posTile);
      if (posTileIndex > i) {
        children.splice(posTileIndex, 1);
        children.splice(i, 0, posTile);
      }
    }
  }
};

/**
 * Initialize the map of which cells are occupied.
 * @param {number} cols Number of columns in the layout
 * @param {number} rows Number of rows in the layout
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._initOccupancyMap = function (cols, rows) {
  this._occupancyMap = [];
  var occupancyMap = this._occupancyMap;
  for (var row = 0; row < rows; row++) {
    var arCols = [];
    occupancyMap.push(arCols);
    for (var col = 0; col < cols; col++) {
      arCols[col] = false;
    }
  }
};

/**
 * Add a row to the layout.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._addRow = function () {
  this._rows += 1;

  var arCols = [];
  var occupancyMap = this._occupancyMap;
  occupancyMap.push(arCols);
  for (var col = 0; col < this._cols; col++) {
    arCols[col] = false;
  }
};

/**
 * Get whether a tile of the given size fits at the given location.
 * @param {number} col Column index
 * @param {number} row Row index
 * @param {Object} childSpan Object specifying tile span with colSpan and rowSpan properties
 * @return {boolean} True if the tile fits, false otherwise
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._fits = function (col, row, childSpan) {
  var colSpan = childSpan.colSpan;
  var rowSpan = childSpan.rowSpan;
  for (var r = row; r < row + rowSpan; r++) {
    if (r >= this._rows) {
      this._addRow();
    }
    for (var c = col; c < col + colSpan; c++) {
      if (c >= this._cols) {
        return false;
      }
      if (this._occupancyMap[r][c]) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Calculates the child tile position.
 * @param {Object} child Tile to position
 * @param {number} col Column index
 * @param {number} row Row index
 * @param {Object} childSpan Object specifying child span with colSpan and rowSpan properties
 * @param {Object} cellSize Object specifying unit cell size with w and h properties
 * @param {Object} insets The insets of the layout container
 * @return {Object} Tile position
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._calcPosition = function (
  child, col, row, childSpan, cellSize, insets
) {
  var colSpan = childSpan.colSpan;
  var rowSpan = childSpan.rowSpan;
  var occupancyMap = this._occupancyMap;
  for (var r = row; r < row + rowSpan; r++) {
    for (var c = col; c < col + colSpan; c++) {
      occupancyMap[r][c] = true;
    }
  }
  // FIX : take padding into account
  var style = {};
  var newTop = insets.paddingTop + (row * cellSize.h);
  style.top = newTop + 'px';
  // FIX : in RTL, position tiles using "right" instead of "left"
  if (this._rtl) {
    var newRight = insets.paddingRight + (col * cellSize.w);
    style.right = newRight + 'px';
  } else {
    var newLeft = insets.paddingLeft + (col * cellSize.w);
    style.left = newLeft + 'px';
  }
  return style;
};

/**
 * Remove a style class from all of the rendered tile children.
 * @param {string} styleClassName Style class to remove
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._removeStyleClassFromTiles = function (styleClassName) {
  var children = this._getTileChildren();
  for (var i = 0; i < children.length; i++) {
    this._removeStyleClassNameFunc(children[i], styleClassName);
  }
};

/**
 * Animate layout
 * @param {Element} element The element to animate
 * @param {string} action The element action
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._animateLayout = function (element, action) {
  if (this.isAnimationEnabled()) {
    var self = this;
    self._startAnimationFunc(element, action).then(function () {
      if (self._layoutTransition) {
        // Only need to do this once per layout cycle.
        // _handleTransitionEnd will set _layoutTransition to false when
        // at least one tile is moved or no tile needs moving.
        self._handleTransitionEnd(element);
      }
    });
  }
};

/**
 * Start a layout transition.
 * @param {boolean} reorder True if this layout is due to a reorder, false otherwise
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._transitionStart = function (reorder) {
  if (!this._layoutTransition) {
    this._reorderTransitionStarted = reorder;
    this._layoutTransition = true;
  }
};

/**
 * Handle a layout transition end.
 * @param {Object} target Target element
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._handleTransitionEnd = function (target) {
  var doneTransitioning = true;
  if (this._arMovedInfolets) {
    var arMovedInfolets = this._arMovedInfolets;
    if (target) {
      for (var i = 0; i < arMovedInfolets.length; i++) {
        if (target === arMovedInfolets[i]) {
          // as soon as we get a transition end for one moved tile, clear all the moved tiles
          this._arMovedInfolets = [];
          arMovedInfolets = this._arMovedInfolets;
          break;
        }
      }
    } else if (!this.isAnimationEnabled()) {
      // if animation is not enabled, clear all the moved infolets at the same time
      this._arMovedInfolets = [];
      arMovedInfolets = this._arMovedInfolets;
    }
    // if there are still tiles for which we haven't gotten a transition end event yet,
    // then we're not done yet
    if (arMovedInfolets.length > 0) {
      doneTransitioning = false;
    }
  }
  if (doneTransitioning) {
    if (this._arInfoletsToResize) {
      this._arInfoletsToResize = null;
    }

    if (this._reorderTransitionStarted) {
      this._reorderTransitionStarted = false;
    }
    var mlcClass = MasonryLayoutCommon;
    this._layoutTransition = false;
    this._resizingInfolet = false;
    this._hidingInfolets = false;
    this._showingInfolets = false;

    // FIX : reorder the tile DOM elements to match the visual layout order
    this._reorderTilesForLayout();

    this._layoutOnEndFunc();

    // update sizeDiv after the layout transition is complete
    this._updateSizeDivOnEnd();

    if (this._layoutPhase === mlcClass._PHASE_LAYOUT) {
      if (this.isAnimationEnabled()) {
        // Need to use a timeout here because we don't keep track of all the expected
        // transitionend events from the layout phase.  We listened for the first one
        // and removed the listener and transition style classes.  But, if we
        // immediately _showTiles, the transitionend listener we add in there
        // may receive some leftover layout transitionend events.  By using the
        // timeout, we don't inadvertently get those leftover events.
        var self = this;
        this._showTilesTimeout = setTimeout(function () {
          self._showTiles();
        }, 0);
      } else {
        this._showTiles();
      }
    } else if (!this._layoutPhase) {
      // FIX : resolve busy state after laying out
      this._layoutCycleOnEndFunc(this._resolveBusyStateFunc);
    }
  }
};

/**
 * Calculate the unit cell size.
 * @param {Object} child Tile to use for calculating cell size
 * @param {Object} childSpan Object specifying child span with colSpan and rowSpan properties
 * @return {Object} Object specifying unit cell size with w and h properties
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._calcCellSize = function (child, childSpan) {
  var mlcClass = MasonryLayoutCommon;
  var childSize = mlcClass._getElemSize(child);
  return { w: childSize.w / childSpan.colSpan, h: childSize.h / childSpan.rowSpan };
};

/**
 * Hide any tiles waiting to be hidden.  This is the first phase of the
 * <hide, layout, show> sequence.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._hideTiles = function () {
  if (this._hideTilesTimeout) {
    clearTimeout(this._hideTilesTimeout);
    this._hideTilesTimeout = null;
  }

  // FIX : notify the peer that a layout cycle is starting so that
  // it can save state if it wants
  this._layoutCycleOnStartFunc();

  var mlcClass = MasonryLayoutCommon;
  this._layoutPhase = mlcClass._PHASE_HIDE;

  if (this._arInfoletsToHide && this.isAnimationEnabled()) {
    var arInfoletsToHide = this._arInfoletsToHide;
    var self = this;
    this._hideTilesAnimationStarted = true;
    for (var i = 0; i < arInfoletsToHide.length; i++) {
      var infolet = arInfoletsToHide[i];
      var endFunc = function (_infolet) {
        self._handleHideTransitionEnd(_infolet);
      }.bind(null, infolet);
      this._startAnimationFunc(infolet, 'remove').then(endFunc);
    }
  } else {
    this._handleHideTransitionEnd(null);
  }
};

/**
 * Handle the end of the hide transition.
 * @param {Element} target The target element
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._handleHideTransitionEnd = function (target) {
  if (this._hideTilesAnimationStarted) {
    this._hideTilesAnimationStarted = false;
  }

  var mlcClass = MasonryLayoutCommon;
  var infolet;
  var tmpInfolet;
  var i;
  var arInfoletsToHide = this._arInfoletsToHide;
  var arFireHideOnEnd;

  if (target) {
    infolet = target;
    if (arInfoletsToHide) {
      for (i = 0; i < arInfoletsToHide.length; i++) {
        tmpInfolet = arInfoletsToHide[i];
        if (tmpInfolet === infolet) {
          arInfoletsToHide.splice(i, 1);
          if (!this._arFireHideOnEnd) {
            this._arFireHideOnEnd = [];
          }
          arFireHideOnEnd = this._arFireHideOnEnd;
          arFireHideOnEnd.push(infolet);
          break;
        }
      }
      if (arInfoletsToHide.length < 1) {
        this._arInfoletsToHide = null;
      }
    }
  } else if (!this.isAnimationEnabled()) {
    // if animation is not enabled, process all the hides at the same time
    if (arInfoletsToHide) {
      for (i = 0; i < arInfoletsToHide.length; i++) {
        tmpInfolet = arInfoletsToHide[i];
        if (!this._arFireHideOnEnd) {
          this._arFireHideOnEnd = [];
        }
        arFireHideOnEnd = this._arFireHideOnEnd;
        arFireHideOnEnd.push(tmpInfolet);
      }
      this._arInfoletsToHide = null;
    }
  }

  if (!this._arInfoletsToHide) {
    if (this._arFireHideOnEnd) {
      arFireHideOnEnd = this._arFireHideOnEnd;
      for (i = 0; i < arFireHideOnEnd.length; i++) {
        infolet = arFireHideOnEnd[i];

        // remove layout position from the child
        var style = infolet.style;
        if (this._rtl) {
          style.right = '';
        } else {
          style.left = '';
        }
        style.top = '';

        this._hideTileOnEndFunc(infolet);
      }
      this._arFireHideOnEnd = null;
    }

    this._layoutPhase = mlcClass._PHASE_LAYOUT;

    this._transitionStart(false);

    // update size style classes AFTER starting transition, but BEFORE doing layout
    if (this._arInfoletsToResize) {
      var arInfoletsToResize = this._arInfoletsToResize;
      for (i = 0; i < arInfoletsToResize.length; i += 2) {
        infolet = arInfoletsToResize[i];
        var newSizeStyleClass = arInfoletsToResize[i + 1];
        var oldSizeStyleClass = this._getSizeStyleClassNameFunc(infolet);
        // if we add a _transitionResizeFromStyleClass in the future, we'll have
        // to add it here immediately and then do the below in a timeout because
        // it would need to happen AFTER the _transitionResizeFromStyleClass is
        // applied
        if (this.isAnimationEnabled()) {
          // temporarily store current cell size on the infolet before the transition begins,
          // because the element size still corresponds to the old size style class before
          // the transition runs
          infolet._afrCellSize = this._cellSize;

          // This must be called before the style class change in order to work
          // consistently.
          this._animateLayout(infolet, 'resize');
        }
        this._removeStyleClassNameFunc(infolet, oldSizeStyleClass);
        this._addStyleClassNameFunc(infolet, newSizeStyleClass);
      }
    }

    this._transitionLayout();
  }
};

/**
 * Show any tiles that were inserted.  This is the third phase of the
 * <hide, layout, show> sequence.
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._showTiles = function () {
  if (this._showTilesTimeout) {
    clearTimeout(this._showTilesTimeout);
    this._showTilesTimeout = null;
  }

  var mlcClass = MasonryLayoutCommon;
  this._layoutPhase = mlcClass._PHASE_SHOW;

  var i;
  var infolet;
  var arInfoletsToShow = this._arInfoletsToShow;

  if (arInfoletsToShow && this.isAnimationEnabled()) {
    var self = this;
    for (i = 0; i < arInfoletsToShow.length; i++) {
      infolet = arInfoletsToShow[i];
      this._removeStyleClassNameFunc(infolet, this._transitionShowFromStyleClass);
      var endFunc = function (_infolet) {
        self._handleShowTransitionEnd(_infolet);
      }.bind(null, infolet);
      this._startAnimationFunc(infolet, 'insert').then(endFunc);
    }
  } else {
    // FIX : make sure we remove the transitionShowFrom class that may have been
    // added by the peer
    if (arInfoletsToShow) {
      for (i = 0; i < arInfoletsToShow.length; i++) {
        infolet = arInfoletsToShow[i];
        this._removeStyleClassNameFunc(infolet, this._transitionShowFromStyleClass);
      }
    }
    this._handleShowTransitionEnd(null);
  }
};

/**
 * Handle the end of the show transition.
 * @param {Element} target The target element
 * @return {void}
 * @memberof MasonryLayoutCommon
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._handleShowTransitionEnd = function (target) {
  var arInfoletsToShow = this._arInfoletsToShow;
  var i;
  var tmpInfolet;

  if (target) {
    var infolet = target;
    if (arInfoletsToShow) {
      for (i = 0; i < arInfoletsToShow.length; i++) {
        tmpInfolet = arInfoletsToShow[i];
        if (tmpInfolet === infolet) {
          arInfoletsToShow.splice(i, 1);
          this._showTileOnEndFunc(infolet);
          break;
        }
      }
      if (arInfoletsToShow.length < 1) {
        this._arInfoletsToShow = null;
      }
    }
  } else if (!this.isAnimationEnabled()) {
    // if animation is not enabled, process all the shows at the same time
    if (arInfoletsToShow) {
      for (i = 0; i < arInfoletsToShow.length; i++) {
        tmpInfolet = arInfoletsToShow[i];
        this._showTileOnEndFunc(tmpInfolet);
      }
      this._arInfoletsToShow = null;
    }
  }

  // only advance the layout phase if there are no more infolets to show
  // still transitioning
  if (!this._arInfoletsToShow) {
    this._layoutPhase = null;
    // FIX : notify the callback that the layout cycle is done
    // FIX : resolve busy state after laying out
    this._layoutCycleOnEndFunc(this._resolveBusyStateFunc);
    // FIX : if we got another layout request while we were in the layout cycle,
    // queue another layout now
    if (this._queuedRelayout) {
      this._queuedRelayout = false;
      this._queueRelayout();
    }
  }
};

/**
 * Resolve an outstanding busy state.
 * @memberof MasonryLayoutCommon
 * @return {void}
 * @instance
 * @private
 */
MasonryLayoutCommon.prototype._resolveBusyState = function () {
  if (this._busyStateResolveFunc) {
    this._busyStateResolveFunc();
    this._busyStateResolveFunc = null;
  }
};

/**
 * Layout phase: hide deleted tiles.
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._PHASE_HIDE = 1;
/**
 * Layout phase: layout tiles.
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._PHASE_LAYOUT = 2;
/**
 * Layout phase: show inserted tiles.
 * @memberof MasonryLayoutCommon
 * @private
 */
MasonryLayoutCommon._PHASE_SHOW = 3;



/* global MasonryLayoutCommon:false, Components:false, Logger:false, Config:false, ThemeUtils:false, Context:false */

/**
 * @ojcomponent oj.ojMasonryLayout
 * @augments oj.baseComponent
 * @since 1.1.0
 *
 * @ojshortdesc A masonry layout lays out its children in a grid of tiles.
 * @class oj.ojMasonryLayout
 *
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 2
 *
 * @classdesc
 * <h3 id="masonryLayoutOverview-section">
 *   JET MasonryLayout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#masonryLayoutOverview-section"></a>
 * </h3>
 *
 * <p>Description: A grid of tiles.
 *
 * <p>A JET MasonryLayout can contain multiple direct child elements that can be sized and positioned.
 * <p>Each direct child element must be styled using one of the predefined
 * <code class="prettyprint">oj-masonrylayout-tile-CxR</code> style classes to specify
 * the size of that tile.  A tile can span multiple columns and/or rows.  The
 * list of predefined size style classes can be found in <a href="#styling-section">styling section</a>.
 *
 * <p>The number of columns in the layout is determined by the width of the
 * element and the width of a 1x1 tile.  The number of rows is determined by
 * the number of columns and the number and sizes of tiles to be laid out.  When
 * the element is resized, relayout will occur and the number of columns and
 * rows may change.
 * <p>When performing layout, tiles are processed in the order in which they
 * originally appeared in the DOM.  Cells in the grid are processed in
 * left-to-right, top-to-bottom order (or right-to-left, top-to-bottom order
 * when the reading direction is right-to-left).  A tile will be positioned in
 * the first empty cell in which it fits.  This can result in empty cells in the
 * layout.  Subsequent tiles may fill those earlier gaps if they fit.
 *
 * <p>Note for performance reasons, if the MasonryLayout has additional content that is expensive to render and is initially hidden,
 * like on the back of a tile that can be flipped or in a collapsed tile that can be expanded,
 * you should wrap the additional content in an <code class="prettyprint">oj-defer</code> element (API doc {@link oj.ojDefer}) to defer the rendering of that content until it is shown.<br/>
 * See the <a href="../jetCookbook.html?component=masonryLayout&demo=deferredRenderingMasonryLayout">Masonry Layout - Deferred Rendering</a> demo for an example.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-masonry-layout>
 *   &lt;div class='oj-masonrylayout-tile-2x1'>Alpha&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x2'>Beta&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Gamma&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Delta&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Epsilon&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Zeta&lt;/div>
 * &lt;/oj-masonry-layout>
 * </code></pre>
 *
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 *
 * <h3 id="keyboard-appdev-section">
 *   Keyboard Application Developer Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-appdev-section"></a>
 * </h3>
 *
 * <p>Providing keyboard support for the tiles in the masonry layout is the
 * responsibility of the application developer, if the tiles do not already
 * support keyboard interaction.  This could be done, for example, by specifying
 * <code class="prettyprint">tabindex</code> on each tile to enable tab
 * navigation.  Alternatively, this could be done by adding a keyboard listener
 * and responding to key events, like pressing the arrow keys.
 *
 *
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>MasonryLayout is for layout only.  It is the responsibility of the
 * application developer to make the tiles in the layout accessible.  Sighted
 * keyboard-only users need to be able to access the tiles in the layout just by
 * using the keyboard.  It is up to the child tiles of the MasonryLayout to
 * support keyboard navigation.  The MasonryLayout reorders the tile DOM
 * elements to match the visual layout order so that tab order and screen reader
 * reading order will match the visual layout order.
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>As with any JET element, in the unusual case that the directionality
 * (LTR or RTL) changes post-init, the MasonryLayout must be
 * <code class="prettyprint">refresh()</code>ed.
 *
 *
 * <h3 id="contextmenu-section">
 *   Context Menu
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#contextmenu-section"></a>
 * </h3>
 * <p>Masonry Layout supports context menu for performing cut and paste operations on tiles as
 * an accessible alternative to drag and drop reordering.
 * When defining a context menu, masonry layout will provide built-in
 * behavior for "cut" and "paste" if the following format for menu &lt;oj-option&gt; items is used:
 * <ul><li> &lt;oj-option data-oj-command="oj-masonrylayout-['commandname']" >&lt;/oj-option&gt;</li></ul>
 * The available translated text will be applied to menu items defined this way.
 *
 * <p>The supported commands:</p>
 * <table class="keyboard-table">
 *   <thead>
 *      <tr>
 *       <th>Default Function</th>
 *       <th>data-oj-command value</th>
 *      </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Cut</kbd></td>
 *       <td>oj-masonrylayout-cut</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Paste Before</kbd></td>
 *       <td>oj-masonrylayout-paste-before</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Paste After</kbd></td>
 *       <td>oj-masonrylayout-paste-after</td>
 *     </tr>
 * </tbody></table>
 *
 * @example <caption>Define a context menu in the masonry layout for performing cut and paste operation:</caption>
 * &lt;oj-masonry-layout&gt;
 *   &lt;oj-menu slot="contextMenu">
 *     &lt;oj-option data-oj-command="oj-masonrylayout-cut" >&lt;/oj-option>
 *     &lt;oj-option data-oj-command="oj-masonrylayout-paste-before" >&lt;/oj-option>
 *     &lt;oj-option data-oj-command="oj-masonrylayout-paste-after" >&lt;/oj-option>
 *   &lt;/oj-menu&gt;
 * &lt;/oj-masonry-layout>
 */
/**
 * <p> &lt;oj-masonry-layout> accepts arbitrary direct child elements that can be
 * sized and positioned, which it will lay out as a grid of tiles.  Each direct
 * child element must be styled using one of the predefined <code
 * class="prettyprint">oj-masonrylayout-tile-CxR</code> style classes to specify
 * the size of that tile.  A tile can span multiple columns and/or rows.</p>
 *
 * @ojchild Default
 * @memberof oj.ojMasonryLayout
 * @ojshortdesc The oj-masonry-layout element accepts arbitrary direct child elements that can be sized and positioned, which it will lay out as a grid of tiles. See the Help documentation for more information.
 *
 * @example <caption>Initialize the masonry layout with child content specified:</caption>
 * &lt;oj-masonry-layout>
 *   &lt;div class='oj-masonrylayout-tile-2x1'>Alpha&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x2'>Beta&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Gamma&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Delta&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Epsilon&lt;/div>
 *   &lt;div class='oj-masonrylayout-tile-1x1'>Zeta&lt;/div>
 * &lt;/oj-masonry-layout>
 */
(function () {
  // start static members and functions //////////////////////////////////////////

  var _PX = 'px';
  var _HIDDEN = 'hidden';
  var _NONE = 'none';
  var _DRAGGABLE = 'draggable';

  var _OJ_DISABLED = 'oj-disabled';
  var _OJ_DRAGGABLE = 'oj-draggable';

  var _OJ_MASONRYLAYOUT_TILE = 'oj-masonrylayout-tile';
  var _OJ_MASONRYLAYOUT_TILE_SIZE_CLASS_PATTERN = /oj-masonrylayout-tile-[0-9]+x[0-9]+/;

  var _TILE_SELECTOR = '.' + _OJ_MASONRYLAYOUT_TILE;

  var _OJ_MASONRYLAYOUT_TILE_TRANSITION_SHOW_FROM_CLASS = 'oj-masonrylayout-tile-transition-show-from';

  // log warning message when "disabled" property set
  var _WARNING_DISABLED_OPTION = "JET MasonryLayout: 'disabled' property not supported";

  // Context Menu: menu item ids
  var _OJMASONRYLAYOUTCUT = 'ojmasonrylayoutcut';
  var _OJMASONRYLAYOUTPASTEBEFORE = 'ojmasonrylayoutpastebefore';
  var _OJMASONRYLAYOUTPASTEAFTER = 'ojmasonrylayoutpasteafter';
  var _MENU_CMD_MAP = {
    cut: _OJMASONRYLAYOUTCUT,
    'paste-before': _OJMASONRYLAYOUTPASTEBEFORE,
    'paste-after': _OJMASONRYLAYOUTPASTEAFTER
  };
  var _MENU_TRANSLATION_MAP = {
    cut: 'labelCut',
    'paste-before': 'labelPasteBefore',
    'paste-after': 'labelPasteAfter'
  };
  // make sure the collapseEventTimeout param is less than the one used in the unit tests
  // in order to ensure that the masonry listener gets the resize event before the unit test
  var _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT = 25;

  /**
   * Get the position of an element relative to the document.
   * @param {Object} elem Element for which to get position.
   * @returns {Object} Object containing properties: top, left.
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _getRelativePosition(elem) {
    return $(elem).offset();
  }

  /**
   * Add a style class name to an element.
   * @param {Object} elem Element to which to add style class.
   * @param {string} styleClass Style class name to add.
   * @return {void}
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _addStyleClassName(elem, styleClass) {
    $(elem).addClass(styleClass);
  }

  /**
   * Remove a style class name from an element.
   * @param {Object} elem Element from which to remove style class.
   * @param {string} styleClass Style class name to remove.
   * @return {void}
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _removeStyleClassName(elem, styleClass) {
    $(elem).removeClass(styleClass);
  }

  /**
   * Get the masonry tile size style class applied to an element.
   * @param {Object} elem Element for which to get size style class name.
   * @returns {?string} Style class name.
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _getSizeStyleClassName(elem) {
    var str = null;
    var tile = $(elem);
    var tileClass = tile.attr('class');
    var matches = tileClass.match(_OJ_MASONRYLAYOUT_TILE_SIZE_CLASS_PATTERN);
    if (matches) {
      str = matches[0];
    }
    return str;
  }

  /**
   * Get the masonry tile span of an element.
   * @param {Object} elem Element for which to get span.
   * @returns {Object} Object containing properties: colSpan, rowSpan.
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _getTileSpan(elem) {
    var span = null;
    var tile = $(elem);
    var tileClass = tile.attr('class');
    var matches = tileClass.match(_OJ_MASONRYLAYOUT_TILE_SIZE_CLASS_PATTERN);
    var styleClass = matches[0];
    var colRowSpanStr = styleClass.substring(_OJ_MASONRYLAYOUT_TILE.length + 1);
    var xIndex = colRowSpanStr.indexOf('x');
    var columnIndex = colRowSpanStr.substring(0, xIndex);
    var rowIndex = colRowSpanStr.substring(xIndex + 1);
    span = {
      colSpan: MasonryLayoutCommon._getCSSLengthAsInt(columnIndex),
      rowSpan: MasonryLayoutCommon._getCSSLengthAsInt(rowIndex)
    };


    return span;
  }

  /**
   * Sort tiles based on their original DOM order.
   * @param {Array} arTiles Array of tiles.
   * @returns {Array} The given array of tiles, sorted.
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _sortTilesOriginalOrder(arTiles) {
    if (arTiles) {
      arTiles.sort(_compareTilesOriginalOrder);
    }

    return arTiles;
  }

  /**
   * Compare tiles for sorting based on the original DOM order.
   * @param {Object} tile1 A tile.
   * @param {Object} tile2 Another tile.
   * @returns {number} 1 if tile2 should be sorted before tile1, -1 if tile1
   *          should be sorted before tile2, or 0 if the tile order doesn't
   *          need to change
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _compareTilesOriginalOrder(tile1, tile2) {
    if (tile2._jetDataMasonryOriginalOrder < tile1._jetDataMasonryOriginalOrder) {
      return 1;
    }
    if (tile1._jetDataMasonryOriginalOrder < tile2._jetDataMasonryOriginalOrder) {
      return -1;
    }
    return 0;
  }

  // start static functions for drag-and-drop reordering /////////////////////

  /**
   * Find the masonry tile that contains the given element.
   * @param {Object} elem Descendant element of a masonry tile.
   * @param {Object} rootElem Root of the masonryLayout.
   * @returns {Object} Masonry tile element.
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _findContainingTile(elem, rootElem) {
    var currElem = elem;
    while (currElem) {
      var style = currElem.style;
      if (style && (style.visibility === _HIDDEN || style.display === _NONE)) {
        break;
      }
      var parentElem = currElem.parentNode;
      if (parentElem === rootElem) {
        return currElem;
      }
      currElem = parentElem;
    }
    return null;
  }

  /**
   * Get the next visible sibling element.
   * @param {Object} elem Element for which to get next visible sibling.
   * @returns {Object} Next visible sibling element.
   * @memberof oj.ojMasonryLayout
   * @private
   */
  function _getNextElement(elem) {
    var currElem = elem;
    while (currElem) {
      var nextElem = currElem.nextSibling;
      var bVisible = true;
      if (nextElem) {
        var style = nextElem.style;
        if (style && (style.visibility === _HIDDEN || style.display === _NONE)) {
          bVisible = false;
        }
      }
      if (nextElem && nextElem.nodeType === 1 && bVisible) {
        return nextElem;
      }
      currElem = nextElem;
    }
    return null;
  }

  // end static functions for drag-and-drop reordering ///////////////////////

  oj.__registerWidget('oj.ojMasonryLayout', $.oj.baseComponent,
    {
      defaultElement: '<div>',
      widgetEventPrefix: 'oj',

      options:
      {
        /**
         * Specify the selector of the descendant DOM element in a <code class="prettyprint">oj-masonry-layout</code>
         * child that can be used to reorder the child by drag-and-drop.
         *
         * <p>This attribute value is <code class="prettyprint">null</code> by default,
         * meaning that <code class="prettyprint">oj-masonry-layout</code> children
         * cannot be reordered.  If each child that can be reordered has an element
         * with style class <code class="prettyprint">'my-reorder-handle'</code>,
         * then the <code class="prettyprint">reorder-handle</code> attribute would be specified as
         * <code class="prettyprint">'.my-reorder-handle'</code>.
         *
         * <p>When specifying a <code class="prettyprint">reorder-handle</code>,
         * the application should also specify a context menu with actions to cut
         * and paste tiles as an accessible alternative to drag-and-drop reordering.
         * <p>To specify a context menu, see the documentation of <a href="oj.ojMenu.html">oj-menu</a>.</p>
         *
         * @expose
         * @memberof oj.ojMasonryLayout
         * @instance
         * @type {?string}
         * @default null
         * @ojshortdesc Specifies the selector of the child DOM element that can be used to reorder the child.
         *
         * @example <caption>Initialize the masonryLayout with the
         * <code class="prettyprint">reorder-handle</code> attribute specified:</caption>
         * &lt;oj-masonry-layout reorder-handle='.my-reorder-handle'>
         *   &lt;div id='child1'>
         *     &lt;div class='my-reorder-handle'/>
         *   &lt;/div>
         *   &lt;div id='child2'>
         *     &lt;div class='my-reorder-handle'/>
         *   &lt;/div>
         *   &lt;!-- additional child elements... -->
         * &lt;/oj-masonry-layout>
         *
         * @example <caption>Get or set the <code class="prettyprint">reorderHandle</code>
         * property after initialization:</caption>
         * // getter
         * var contentParent = myMasonryLayout.reorderHandle;
         *
         * // setter
         * myMasonryLayout.reorderHandle = '.my-reorder-handle';
         */
        reorderHandle: null,

        /**
         * MasonryLayout inherits the <code class="prettyprint">disabled</code>
         * attribute from its superclass, but does not support it in order to avoid
         * tight coupling between a MasonryLayout and its contents.  Setting this
         * attribute on MasonryLayout has no effect.
         *
         * <p><b>WARNING:</b> Applications should not depend on this behavior
         * because we reserve the right to change it in the future in order to
         * support <code class="prettyprint">disabled</code> and propagate it to
         * child elements of MasonryLayout.
         *
         * @member
         * @name disabled
         * @memberof oj.ojMasonryLayout
         * @instance
         * @type {boolean}
         * @default false
         * @ignore
         */
        // disabled attribute declared in superclass, but we still want the above API doc

        // event callbacks
        /**
         * Triggered when a default animation is about to start on the element.
         *
         * <p>The default animation can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>,
         * followed by a call to <code class="prettyprint">event.detail.endCallback()</code>. <code class="prettyprint">event.detail.endCallback()</code>
         * should be called immediately after <code class="prettyprint">event.preventDefault()</code> if the application merely
         * wants to cancel animation, or it should be called when the custom animation ends if the application is invoking another animation function.
         * Failure to call <code class="prettyprint">event.detail.endCallback()</code> may prevent the element from working properly.</p>
         *
         * <p>For more information on customizing animations, see the documentation of
         * <a href="oj.AnimationUtils.html">oj.AnimationUtils</a>.</p>
         *
         * <caption>The default animations are controlled via the theme (SCSS) :</caption>
         * <pre class="prettyprint"><code>
         * $masonryLayoutInsertAnimation: ((effect: "zoomIn", duration: $masonryLayoutAnimationDuration, timingFunction: "ease-in-out"), "fadeIn") !default;
         * $masonryLayoutRemoveAnimation: ((effect: "zoomOut", duration: $masonryLayoutAnimationDuration, timingFunction: "ease-in-out"), "fadeOut") !default;
         * $masonryLayoutMoveAnimation: (effect: "addTransition", duration: $masonryLayoutAnimationDuration, timingFunction: "ease-in-out", transitionProperties: ('top', 'left', 'right')) !default;
         * $masonryLayoutResizeAnimation: (effect: "addTransition", duration: $masonryLayoutAnimationDuration, timingFunction: "ease-in-out", transitionProperties: ('width', 'height', 'top', 'left', 'right')) !default;
         * $masonryLayoutReorderAnimation: (effect: "addTransition", duration: $masonryLayoutAnimationDurationFast, timingFunction: "ease-in-out", transitionProperties: ('width', 'height', 'top', 'left', 'right')) !default;
         * </code></pre>
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojcancelable
         * @ojshortdesc Event triggered when the default animation of a particular action is about to start. See the Help documentation for more information.
         * @property {string} action The action that triggers the animation.
         *            Supported values are:
         *                    <ul>
         *                      <li>"insert" - when a tile is inserted</li>
         *                      <li>"move" - when a tile is moved</li>
         *                      <li>"remove" - when a tile is removed</li>
         *                      <li>"resize" - when a tile is resized</li>
         *                      <li>"reorder" - when a tile is reordered</li>
         *                    </ul>
         *                    <br>Note that some animation effects may not look appropriate for a
         *                    given action.
         * @property {Element} element The element being animated.
         * @property {function():void} endCallback If the event listener calls
         *            event.preventDefault to cancel the default animation, it must call the
         *            endCallback function after it finishes its own animation handling and any
         *            custom animation has ended.
         *
         * @example <caption>Add a listener for the <code class="prettyprint">ojAnimateStart</code> event
         *          to override the default "insert" animation with a custom animation:</caption>
         *   myMasonryLayout.addEventListener("ojAnimateStart", function( event )
         *   {
         *     if (!$(event.target).is("oj-masonry-layout"))
         *       return;
         *     var ui = event.detail;
         *     // Change the insert animation
         *     if (ui.action == "insert") {
         *       event.preventDefault();
         *       // Invoke new animation and call event.detail.endCallback when it ends
         *       oj.AnimationUtils.fadeIn(ui.element).then(ui.endCallback);
         *     }
         *   });
         *
         * @example <caption>Add a listener for the <code class="prettyprint">ojAnimateStart</code> event
         *          to prevent the default "remove" animation:</caption>
         *   myMasonryLayout.addEventListener("ojAnimateStart", function( event )
         *   {
         *     if (!$(event.target).is("oj-masonry-layout"))
         *       return;
         *     var ui = event.detail;
         *     // Prevent the remove animation
         *     if (ui.action == "remove") {
         *       event.preventDefault();
         *       ui.endCallback();
         *     }
         *   });
         */
        animateStart: null,

        /**
         * Triggered when a default animation has ended.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojshortdesc Event triggered when the default animation of a particular action has ended.
         * @property {string} action The action that triggers the animation.
         *            Supported values are:
         *                    <ul>
         *                      <li>"insert" - when a tile is inserted</li>
         *                      <li>"move" - when a tile is moved</li>
         *                      <li>"remove" - when a tile is removed</li>
         *                      <li>"resize" - when a tile is resized</li>
         *                      <li>"reorder" - when a tile is reordered</li>
         *                    </ul>
         * @property {Element} element The element being animated.
         */
        animateEnd: null,

        /**
         * Triggered immediately before a tile is inserted.
         * This event can be cancelled by calling
         * <code class="prettyprint">event.preventDefault()</code>.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojcancelable
         * @ojshortdesc Event triggered before a tile is inserted.
         * @property {Element} tile The tile that is about to be inserted.
         * @property {number} index The 0-based index into the set of rendered
         *                                       <code class="prettyprint">oj-masonry-layout</code> children where
         *                                       the tile will be inserted.
         */
        beforeInsert: null,

        /**
         * Triggered immediately after a tile is inserted.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojshortdesc Event triggered after a tile is inserted.
         * @property {Element} tile  The tile that was inserted.
         * @property {number} index The 0-based index into the set of rendered
         *                                       <code class="prettyprint">oj-masonry-layout</code> children where
         *                                       the tile was inserted.
         */
        insert: null,

        /**
         * Triggered immediately before a tile is removed.
         * This event can be cancelled by calling
         * <code class="prettyprint">event.preventDefault()</code>.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojcancelable
         * @ojshortdesc Event triggered before a tile is removed.
         * @property {Element} tile  The tile that will be removed.
         */
        beforeRemove: null,

        /**
         * Triggered immediately after a tile is removed.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojshortdesc Event triggered after a tile is removed.
         * @property {Element} tile  The tile that was removed.
         */
        remove: null,

        /**
         * Triggered immediately before a tile is resized.
         * This event can be cancelled by calling
         * <code class="prettyprint">event.preventDefault()</code>.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojcancelable
         * @ojshortdesc Event triggered before a tile is resized.
         * @property {Element} tile  The tile that will be resized.
         * @property {string} previousSizeStyleClass The previous size style
         *                                           class applied to the tile.
         * @property {string} sizeStyleClass The new size style class that will
         *                                   be applied to the tile.
         */
        beforeResize: null,

        /**
         * Triggered immediately after a tile is resized.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojshortdesc Event triggered after a tile is resized.
         * @property {Element} tile  The tile that was resized.
         * @property {string} previousSizeStyleClass The previous size style
         *                                           class applied to the tile.
         * @property {string} sizeStyleClass The new size style class applied
         *                                   to the tile.
         */
        resize: null,

        /**
         * Triggered immediately before a tile is reordered.
         * This event can be cancelled by calling
         * <code class="prettyprint">event.preventDefault()</code>.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojcancelable
         * @ojshortdesc Event triggered before a tile is reordered.
         * @property {Element} tile  The tile that will be reordered.
         * @property {number} fromIndex The 0-based index into the set of rendered
         *                                           <code class="prettyprint">oj-masonry-layout</code> children from
         *                                           which the tile will be reordered.
         */
        beforeReorder: null,

        /**
         * Triggered immediately after a tile is reordered.
         *
         * @expose
         * @event
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ojshortdesc Event triggered after a tile is reordered.
         * @property {Element} tile  The tile that was reordered.
         * @property {number} fromIndex The 0-based index into the set of rendered
         *                                           <code class="prettyprint">oj-masonry-layout</code> children from
         *                                           which the tile was reordered.
         * @property {number} toIndex   The 0-based index into the set of rendered
         *                                           <code class="prettyprint">oj-masonry-layout</code> children to
         *                                            which the tile was reordered.
         */
        reorder: null

        /**
         * Triggered when the masonryLayout is created.
         *
         * @event
         * @name create
         * @memberof oj.ojMasonryLayout
         * @instance
         * @ignore
         */
        // create event declared in superclass, but we still want the above API doc
      },

      /**
       * After _ComponentCreate and _AfterCreate,
       * the widget should be 100% set up. this._super should be called first.
       * @return {void}
       * @override
       * @protected
       * @instance
       * @memberof oj.ojMasonryLayout
       */
      _ComponentCreate: function () { // Override of protected base class method.
        // call superclass first
        this._super();

        var elem = this.element;
        elem.addClass('oj-masonrylayout oj-component');

        // log warning message when "disabled" property set
        var options = this.options;
        if (options.disabled) {
          Logger.warn(_WARNING_DISABLED_OPTION);
        }

        this.reorderHandleEventNamespace = this.eventNamespace + 'ReorderHandle';

        this._menu = {};
        this._menu.usermenu = false;
        this._menu.$container = false;
        this._menu.$elemCut = false;
        this._menu.$elemPasteBefore = false;
        this._menu.$elemPasteAfter = false;

        this._initMenu();
        this._applyMenu();

        this._setup(true);
      },

      // This method currently runs at create, init, and refresh time (since refresh() is called by _init()).
      /**
       * Refreshes the visual state of the masonryLayout. JET elements require a
       * <code class="prettyprint">refresh()</code> after the DOM is
       * programmatically changed underneath the element.
       *
       * <p>This method does not accept any arguments.
       * @return {void}
       *
       * @expose
       * @memberof oj.ojMasonryLayout
       * @instance
       * @ojshortdesc Refreshes the visual state of the masonryLayout.
       *
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       * myMasonryLayout.refresh();
       */
      refresh: function () { // Override of public base class method.
        this._super();

        // if RTL has changed, just destroy and recreate the MasonryLayoutCommon
        var bRTL = (this._GetReadingDirection() === 'rtl');
        var bRecreate = (bRTL !== this._bRTL);
        if (bRecreate) {
          this._destroyMLCommon();
        }
        this._setup(bRecreate);
      },

      /**
       * Notifies the component that its subtree has been made visible
       * programmatically after the component has been created.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @protected
       * @override
       */
      _NotifyShown: function () {
        this._super();
        // perform a deferred layout
        if (this._needsSetup) {
          this._setup(this._needsSetup[0]);
        } else {
          // explicitly relayout in case we don't get a resize notification when shown
          var mlCommon = this._mlCommon;
          mlCommon.setup(true);
        }
      },

      /**
       * Notifies the component that its subtree has been connected to the document
       * programmatically after the component has been created.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @protected
       * @override
       */
      _NotifyAttached: function () {
        this._super();
        // perform a deferred layout
        if (this._needsSetup) {
          this._setup(this._needsSetup[0]);
        } else {
          // explicitly relayout in case we don't get a resize notification when attached
          var mlCommon = this._mlCommon;
          mlCommon.setup(true);
        }
      },

      /**
       * Notifies the component that its context menu is opening.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @protected
       * @override
       */
      _NotifyContextMenuGesture: function (menu, event, eventType) {
        // prepare the context menu here instead of in a context menu "beforeOpen" event
        this._prepareContextMenuBeforeOpen(event);

        // FIX : only allow reordering if context menu was
        // launched from reorder handle, so only show context menu if it
        // contains items that are not hidden (i.e. not cut/paste)
        var $menuContainer = this._menu.$container;
        var $menuItems = $menuContainer.children().not('.oj-helper-hidden');
        if ($menuItems && $menuItems.length > 0) {
          this._OpenContextMenu(event, eventType,
                                { launcher: $(event.target).closest(':tabbable') });
        }
      },

      // isInit is true for init (create and re-init), false for refresh
      /**
       * Setup the masonryLayout.
       * @param {boolean} isInit true if _setup is called from _init(), false
       *        if called from refresh()
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _setup: function (isInit) { // Private, not an override (not in base class).
        var self = this;

        // if masonryLayout is detached or hidden, we can't layout correctly, so
        // defer layout until masonryLayout is attached or shown
        if (!this._canCalculateSizes()) {
          // want a true value of isInit to take precedence over a false value
          var oldIsInit = false;
          if (this._needsSetup) {
            oldIsInit = this._needsSetup[0];
          }
          this._needsSetup = [isInit || oldIsInit];
          return;
        }
        this._needsSetup = null;

        this._bRTL = (this._GetReadingDirection() === 'rtl');
        this._bTouchSupported = oj.DomUtils.isTouchSupported();
        var elem = this.element;
        var options = this.options;
        if (isInit) {
          this._showTileOnEndFunc = function (_elem) {
            self._showTileOnEnd(_elem);
          };
          this._hideTileOnEndFunc = function (_elem) {
            self._hideTileOnEnd(_elem);
          };
          this._startAnimationFunc = function (_elem, action) {
            return self._startAnimation(_elem, action);
          };
          this._layoutOnEndFunc = function () {
            self._layoutOnEnd();
          };
          this._layoutCycleOnStartFunc = function () {
            self._layoutCycleOnStart();
          };
          this._layoutCycleOnEndFunc = function (resolveBusyState) {
            self._layoutCycleOnEnd(resolveBusyState);
          };
          if (!this._mlCommon) {
            var selectors = {};
            selectors.tiles = _TILE_SELECTOR;
            var styles = {};
            styles.transitionShowFromStyleClass = _OJ_MASONRYLAYOUT_TILE_TRANSITION_SHOW_FROM_CLASS;
            var callbackInfo = {};
            callbackInfo.addStyleClassName = _addStyleClassName;
            callbackInfo.removeStyleClassName = _removeStyleClassName;
            callbackInfo.getSizeStyleClassName = _getSizeStyleClassName;
            callbackInfo.getTileSpan = _getTileSpan;
            callbackInfo.showTileOnEndFunc = this._showTileOnEndFunc;
            callbackInfo.hideTileOnEndFunc = this._hideTileOnEndFunc;
            callbackInfo.startAnimationFunc = this._startAnimationFunc;
            callbackInfo.layoutOnEndFunc = this._layoutOnEndFunc;
            callbackInfo.layoutCycleOnStartFunc = this._layoutCycleOnStartFunc;
            callbackInfo.layoutCycleOnEndFunc = this._layoutCycleOnEndFunc;
            callbackInfo.sortTilesOriginalOrderFunc = _sortTilesOriginalOrder;
            callbackInfo.subtreeAttached = Components.subtreeAttached;
            callbackInfo.subtreeDetached = Components.subtreeDetached;
            callbackInfo.addBusyState = function (description) {
              return self._addBusyState(description);
            };

            // apply the oj-masonrylayout-tile style class to child tiles
            this._applyTileStyleClass();

            // save the original order of the tiles, because the DOM order may
            // change due to layout and we want to always use the original order
            // for running subsequent layouts
            this._saveTilesOriginalOrder();

            this._mlCommon = new MasonryLayoutCommon(
              elem[0],
              this._bRTL,
              Config.getAutomationMode() === 'enabled',
              selectors,
              styles,
              callbackInfo);
          }

          this._handleDragStartFunc = function (event) {
            self._handleDragStart(event);
          };
          this._handleDragEnterFunc = function (event) {
            self._handleDragEnter(event);
          };
          this._handleDragOverFunc = function (event) {
            self._handleDragOver(event);
          };
          this._handleDragLeaveFunc = function (event) {
            self._handleDragLeave(event);
          };
          this._handleDragEndFunc = function (event) {
            self._handleDragEnd(event);
          };
          this._handleDropFunc = function (event) {
            self._handleDrop(event);
          };
          if (options.reorderHandle) {
            this._setupReorderHandles();
          }
        } else {
          // apply the oj-masonrylayout-tile style class to child tiles that are missing it
          this._applyTileStyleClass();

          // FIX : tear down and setup the reorder handles for the
          // tiles again in case something changed, for example if there are
          // new tiles
          var children = elem.children();
          this._tearDownReorderHandlesForElem(children);
          this._setupReorderHandlesForElem(children);

          // make sure that any new tiles have an assigned index in the
          // original DOM ordering
          this._checkTilesOriginalOrder();
        }

        var mlCommon = this._mlCommon;
        mlCommon.setup(isInit);

        if (isInit) {
          // eslint-disable-next-line no-unused-vars
          this._handleResizeFunc = function (width, height) {
            self._handleResize();
          };
          oj.DomUtils.addResizeListener(elem[0], this._handleResizeFunc,
                                        _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT);
        }
      },

      /**
       * Destroy the masonryLayout.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @override
       * @protected
       */
      _destroy: function () { // Override of protected base class method.
        this._clearMenu();

        var elem = this.element;
        oj.DomUtils.removeResizeListener(elem[0], this._handleResizeFunc);
        this._handleResizeFunc = null;

        // restore tiles to their original order and delete stored indices
        this._restoreTilesOriginalOrder();
        var children = this._getTileElements();
        var numChildren = children.length;
        for (var i = 0; i < numChildren; i++) {
          var child = children[i];
          delete child._jetDataMasonryOriginalOrder;
        }

        this._destroyMLCommon();

        elem.removeClass('oj-masonrylayout oj-component');
        var options = this.options;
        if (options.reorderHandle) {
          this._tearDownReorderHandles();
        }

        // remove the oj-masonrylayout-tile style class from child tiles
        var tiles = elem.children('.' + _OJ_MASONRYLAYOUT_TILE);
        tiles.removeClass(_OJ_MASONRYLAYOUT_TILE);

        this._handleDragStartFunc = null;
        this._handleDragEnterFunc = null;
        this._handleDragOverFunc = null;
        this._handleDragLeaveFunc = null;
        this._handleDragEndFunc = null;
        this._handleDropFunc = null;

        this._showTileOnEndFunc = null;
        this._hideTileOnEndFunc = null;
        this._startAnimationFunc = null;
        this._layoutOnEndFunc = null;
        this._layoutCycleOnStartFunc = null;
        this._layoutCycleOnEndFunc = null;

        this._arTilesToInsert = null;

        this._super();
      },

      /**
       * Set an option on the masonryLayout.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @override
       * @protected
       */
      _setOption: function (key, value, flags) { // Override of protected base class method.
        // Method name needn't be quoted since is in externs.js.
        var bReorderHandle = false;
        var bRefreshMenu = false;
        switch (key) {
          case 'reorderHandle':
            this._tearDownReorderHandles();
            bReorderHandle = true;
            break;
          case 'disabled':
            // log warning message when "disabled" property set
            Logger.warn(_WARNING_DISABLED_OPTION);
            break;
          case 'contextMenu':
            if (!oj.DomUtils.isTouchSupported()) {
              this._clearMenu();
              if (value) {
                this._initMenu(value);
              }
            }
            break;
          case 'translations':
            if (!oj.Object.compareValues(value, this.options[key])) {
              bRefreshMenu = true;
            }
            break;
          default:
            break;
        }
        this._super(key, value, flags);
        if (bRefreshMenu) {
          this._refreshMenu();
        }
        if (bReorderHandle && value) {
          this._setupReorderHandles();
        }
      },

      /**
       * Resize a tile in the masonryLayout.
       * @param {string} selector Selector identifying the tile to resize.
       * @param {string} sizeStyleClass New size style class to apply to the tile.
       * @return {void}
       *
       * @expose
       * @memberof oj.ojMasonryLayout
       * @instance
       * @ojshortdesc Resize a tile.
       *
       * @example <caption>Invoke the <code class="prettyprint">resizeTile</code> method:</caption>
       * myMasonryLayout.resizeTile('#tileSelector', 'oj-masonrylayout-tile-2x1');
       */
      resizeTile: function (selector, sizeStyleClass) {
        var mlCommon = this._mlCommon;
        // FIX : if we're already in a layout cycle, finish it immediately
        // before processing the resize
        if (mlCommon.isInLayoutCycle()) {
          mlCommon.finishLayoutCycle();
        }

        var jqElem = $(selector);
        var elem = jqElem[0];
        // Fix  - throw error if the selector is invalid
        if (!elem) {
          throw new Error('JET MasonryLayout: Unable to resize tile because ' +
                           'no tile found for selector: ' + selector);
        }
        var prevSizeStyleClass = _getSizeStyleClassName(elem);

        // FIX : if the style class isn't changing, don't do anything;
        // this prevents the layout from preparing for a resize and then waiting for
        // the end of a resize animation that won't happen
        // FIX : throw error if style class isn't changing
        if (sizeStyleClass === prevSizeStyleClass) {
          throw new Error('JET MasonryLayout: Unable to resize child ' + selector +
                          ' to style class ' + sizeStyleClass + ' because ' +
                          sizeStyleClass + ' is already applied.');
        }

        // fire beforeResize event
        var eventData = {
          /** @expose */
          tile: jqElem,
          /** @expose */
          previousSizeStyleClass: prevSizeStyleClass,
          /** @expose */
          sizeStyleClass: sizeStyleClass
        };
        var bSuccess = this._trigger('beforeResize', null, eventData);

        if (bSuccess !== false) {
          if (!this._arResizingTiles) {
            this._arResizingTiles = [];
          }
          var arResizingTiles = this._arResizingTiles;
          arResizingTiles.push(elem, prevSizeStyleClass, sizeStyleClass);

          mlCommon.resizeTile(selector, sizeStyleClass);
        }
      },

      /**
       * Insert a tile into the masonryLayout.
       * @param {string} selector Selector identifying the tile to insert.  The tile
       *        does not need to be a child of the
       *        <code class="prettyprint">oj-masonry-layout</code> when this method is
       *        called.  This method will reparent the tile to the
       *        <code class="prettyprint">oj-masonry-layout</code>.
       * @param {number} index The 0-based index into the set of rendered
       *           <code class="prettyprint">oj-masonry-layout</code> children where
       *           the tile will be inserted.
       * @return {void}
       *
       * @expose
       * @memberof oj.ojMasonryLayout
       * @instance
       * @ojshortdesc Insert a tile.
       *
       * @example <caption>Invoke the <code class="prettyprint">insertTile</code> method:</caption>
       * myMasonryLayout.insertTile('#tileSelector', 2);
       */
      insertTile: function (selector, index) {
        var mlCommon = this._mlCommon;
        // FIX : if we're already in a layout cycle, finish it immediately
        // before processing the insert
        if (mlCommon.isInLayoutCycle()) {
          mlCommon.finishLayoutCycle();
        }

        if (isNaN(index)) {
          // eslint-disable-next-line no-param-reassign
          index = -1;
        }

        var jqElem = $(selector);
        var elem = jqElem[0];
        // Fix  - throw error if the selector is invalid
        if (!elem) {
          throw new Error('JET MasonryLayout: Unable to insert tile because ' +
                           'no tile found for selector: ' + selector);
        }

        // add the oj-masonrylayout-tile style class to the inserted tile
        jqElem.addClass(_OJ_MASONRYLAYOUT_TILE);

        // fire beforeInsert event
        var eventData = {
          /** @expose */
          tile: jqElem,
          /** @expose */
          index: index
        };
        var bSuccess = this._trigger('beforeInsert', null, eventData);

        if (bSuccess !== false) {
          elem._jetDataTileInsertIndex = index;

          // only need to initially hide inserts if they will be animated later,
          // otherwise we can just leave them shown here
          if (mlCommon.isAnimationEnabled()) {
            // immediately hide insert in order to show it later with a transition
            jqElem.addClass(_OJ_MASONRYLAYOUT_TILE_TRANSITION_SHOW_FROM_CLASS);
          }

          var style = elem.style;
          style.top = '-1px';
          // FIX : in RTL, position tiles using "right" instead of "left"
          if (this._bRTL) {
            style.right = '-1px';
          } else {
            style.left = '-1px';
          }

          this._insertTileOriginalOrder(elem, index);
          mlCommon.insertTileDomElem(elem, index);
          // notify the element that it's been attached to the DOM
          Components.subtreeAttached(elem);

          if (!this._arTilesToInsert) {
            this._arTilesToInsert = [];
          }
          var arTilesToInsert = this._arTilesToInsert;
          arTilesToInsert.push(selector);
        }
      },

      /**
       * Remove a tile from the masonryLayout.
       * @param {string} selector Selector identifying the tile to remove.
       * @return {void}
       *
       * @expose
       * @memberof oj.ojMasonryLayout
       * @instance
       * @ojshortdesc Remove a tile.
       *
       * @example <caption>Invoke the <code class="prettyprint">removeTile</code> method:</caption>
       * myMasonryLayout.removeTile('#tileSelector');
       */
      removeTile: function (selector) {
        var mlCommon = this._mlCommon;
        // FIX : if we're already in a layout cycle, finish it immediately
        // before processing the delete
        if (mlCommon.isInLayoutCycle()) {
          mlCommon.finishLayoutCycle();
        }

        var jqInfolet = $(selector);
        var infolet = jqInfolet[0];
        // Fix  - throw error if the selector is invalid
        if (!infolet) {
          throw new Error('JET MasonryLayout: Unable to remove tile because ' +
                           'no tile found for selector: ' + selector);
        }

        // if the infolet being deleted contains the focus, remember that so we can
        // try to restore focus to the next infolet after layout
        if (oj.FocusUtils.containsFocus(infolet)) {
          var children = this._getTileElements(true);
          var index = children.indexOf(infolet);
          // save the previous infolet, because this one is being deleted
          if (index > 0) {
            this._deletingTileWithFocusPrev = children[index - 1];
          }
        }

        // fire beforeRemove event
        var eventData = {
          /** @expose */
          tile: jqInfolet
        };
        var bSuccess = this._trigger('beforeRemove', null, eventData);

        if (bSuccess !== false) {
          mlCommon.hideTile(selector);
        }
      },

      /**
       * Handle a component resize.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleResize: function () {
        if (!this._bDragging && !this._inLayoutCycle) {
          var mlCommon = this._mlCommon;
          mlCommon.resizeNotify();
        }
      },

      /**
       * Callback to run after a tile is shown.
       * @param {Object} elem Tile that was shown.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _showTileOnEnd: function (elem) {
        var jqElem = $(elem);
        var index = elem._jetDataTileInsertIndex;
        // eslint-disable-next-line no-param-reassign
        delete elem._jetDataTileInsertIndex;

        // FIX : setup the reorder handle for the inserted tile
        var options = this.options;
        if (options.reorderHandle) {
          this._setupReorderHandlesForElem(jqElem);
        }

        // fire insert event
        var eventData = {
          /** @expose */
          tile: jqElem,
          /** @expose */
          index: index
        };
        this._eventsToFire.push('insert', eventData);
      },

      /**
       * Callback to run after a tile is hidden.
       * @param {!Element} elem Tile that was hidden.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _hideTileOnEnd: function (elem) {
        var jqElem = $(elem);

        // FIX : tear down the reorder handle for the removed tile
        var options = this.options;
        if (options.reorderHandle) {
          this._tearDownReorderHandlesForElem(jqElem);
        }

        // remove the oj-masonrylayout-tile style class from the hidden tile
        jqElem.removeClass(_OJ_MASONRYLAYOUT_TILE);

        // notify the element that it's been detached from the DOM BEFORE actually
        // detaching it so that components can save state
        Components.subtreeDetached(elem);

        var parentNode = elem.parentNode;
        parentNode.removeChild(elem);
        // remove the tile from the original order
        this._removeTileOriginalOrder(elem);

        // fire remove event
        var eventData = {
          /** @expose */
          tile: jqElem
        };
        this._eventsToFire.push('remove', eventData);
      },

      /**
       * Callback to run to animate a tile.
       * @param {!Element} elem Tile to be animated.
       * @param {!string} action Action that starts animation.
       * @return {Promise} A promise that resolves when the animation ends.
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _startAnimation: function (elem, action) {
        var defaults = (ThemeUtils.parseJSONFromFontFamily('oj-masonrylayout-option-defaults') || {}).animation;
        var animation = defaults ? defaults[action] : null;
        // eslint-disable-next-line no-undef
        return AnimationUtils.startAnimation(elem, action, animation, this);
      },

      /**
       * Callback to run after layout is done.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _layoutOnEnd: function () {
        var i;
        if (this._arTilesToInsert) {
          var mlCommon = this._mlCommon;
          var arTilesToInsert = this._arTilesToInsert;
          for (i = 0; i < arTilesToInsert.length; i++) {
            var selector = arTilesToInsert[i];
            mlCommon.showTile(selector);
          }
          this._arTilesToInsert = null;
        }

        if (this._arResizingTiles) {
          var arResizingTiles = this._arResizingTiles;
          for (i = 0; i < arResizingTiles.length; i += 3) {
            var elem = arResizingTiles[i];
            var prevSizeStyleClass = arResizingTiles[i + 1];
            var sizeStyleClass = arResizingTiles[i + 2];

            // fire resize event
            var eventData = {
              /** @expose */
              tile: $(elem),
              /** @expose */
              previousSizeStyleClass: prevSizeStyleClass,
              /** @expose */
              sizeStyleClass: sizeStyleClass
            };
            this._eventsToFire.push('resize', eventData);
          }
          this._arResizingTiles = null;
        }

        if (this._bDragging) {
          if (this._bDragMoveTransition) {
            this._handleDragMoveTransitionEnd();
          } else if (this._bDragEndTransition) {
            this._handleDragEndTransitionEnd();
          }
        }
      },

      /**
       * Callback to run before whole layout cycle starts.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _layoutCycleOnStart: function () {
        this._inLayoutCycle = true;
        this._layoutStartActiveDomElem = null;

        // store events to fire when the layout cycle ends
        if (!this._eventsToFire) {
          this._eventsToFire = [];
        }

        var activeDomElem = document.activeElement;
        // if the currently focused element is a child of the  masonryLayout,
        // remember that so we can try to restore focus after layout, in case the
        // child DOM order changes
        if (activeDomElem) {
          if (oj.DomUtils.isAncestor(this.element[0], activeDomElem)) {
            this._layoutStartActiveDomElem = activeDomElem;
          }
        }
      },

      /**
       * Callback to run after whole layout cycle is done.
       * @param {function():void} resolveBusyState Resolve function for busy state.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _layoutCycleOnEnd: function (resolveBusyState) {
        this._inLayoutCycle = false;

        var elem = this.element[0];
        // if we saved the focus element before layout, try to restore focus now
        if (this._layoutStartActiveDomElem) {
          var layoutStartActiveDomElem = this._layoutStartActiveDomElem;
          this._layoutStartActiveDomElem = null;
          // after deleting a tile, focus the tile that took its position in the layout
          if (this._deletingTileWithFocusPrev) {
            var tile = this._deletingTileWithFocusPrev;
            this._deletingTileWithFocusPrev = null;
            if (tile && oj.DomUtils.isAncestor(elem, tile)) {
              var children = this._getTileElements(elem, true);
              var index = children.indexOf(tile);
              // because we saved the id of the prev tile, try to restore focus
              // to the tile after it, which would have been where the deleted
              // tile was positioned
              if (index >= 0 && index < children.length - 1) {
                oj.FocusUtils.focusFirstTabStop(children[index + 1]);
              } else {
                oj.FocusUtils.focusFirstTabStop(tile);
              }
            }
          } else if (oj.DomUtils.isAncestor(elem, layoutStartActiveDomElem)) {
            // restore focus to the element that had focus before layout, or to
            // the first tabstop in the masonryLayout
            oj.FocusUtils.focusElement(layoutStartActiveDomElem);
          } else {
            oj.FocusUtils.focusFirstTabStop(elem);
          }
        }

        // FIX : resolve busy state after laying out, but BEFORE firing events so that when
        // an app gets an event it doesn't then have to wait for the busy context to be resolved
        if (resolveBusyState) {
          resolveBusyState();
        }

        // fire stored events at end of layout cycle
        if (this._eventsToFire) {
          var eventsToFire = this._eventsToFire;
          this._eventsToFire = [];

          for (var i = 0; i < eventsToFire.length; i += 2) {
            var eventType = eventsToFire[i];
            var eventData = eventsToFire[i + 1];
            this._trigger(eventType, null, eventData);
          }
        }
      },

      /**
       * Destroy the MasonryLayoutCommon.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _destroyMLCommon: function () {
        var mlCommon = this._mlCommon;
        if (mlCommon) {
          mlCommon.destroy();
        }
        this._mlCommon = null;
      },

      /**
       * Determine whether the masonryLayout can calculate sizes (when it is
       * attached to the page DOM and not hidden).
       * @returns {boolean} true if sizes can be calculated, false if not
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _canCalculateSizes: function () {
        var div = document.createElement('div');
        var style = div.style;
        style.width = '10px';
        style.height = '10px';
        var elem = this.element[0];
        elem.appendChild(div); // @HTMLUpdateOK
        var bCanCalcSizes = false;
        try {
          bCanCalcSizes = div.offsetWidth > 0 && div.offsetHeight > 0;
        } catch (e) {
          // do nothing
        }
        elem.removeChild(div);
        return bCanCalcSizes;
      },

      /**
       * Get the child tile elements.
       * @param {boolean} excludeDropSite True to exclude the dropsite, false to
       *        include it.
       * @returns {Array} Array of child tile elements.
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _getTileElements: function (excludeDropSite) {
        var elem = this.element;
        var children = elem.children(_TILE_SELECTOR);
        var numChildren = children.length;
        var arChildren = [];
        for (var i = 0; i < numChildren; i++) {
          var child = children[i];
          if (!excludeDropSite || (excludeDropSite && child !== this._dropSite)) {
            var style = child.style;
            if (style.visibility !== _HIDDEN && style.display !== _NONE) {
              arChildren.push(child);
            }
          }
        }
        return arChildren;
      },

      /**
       * Save the original DOM order of the tiles.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _saveTilesOriginalOrder: function () {
        var arTiles = this._getTileElements();
        if (arTiles) {
          for (var i = 0; i < arTiles.length; i++) {
            var tile = arTiles[i];
            // only assign original index to tile if it hasn't already been assigned,
            // so that repeated calls to _setup(true) won't overwrite the original
            // values with current layout order values
            if (!tile._jetDataMasonryOriginalOrder) {
              // make original order index 1-based so that we can easily check for
              // the existence of the attribute on an element
              // (e.g. "if (tile._jetDataMasonryOriginalOrder)")
              tile._jetDataMasonryOriginalOrder = i + 1;
            }
          }
        }
      },

      /**
       * Check that all tiles have an assigned index in the original DOM
       * order, in case new tiles have been inserted outside of the
       * insertTile API and the masonryLayout has been refreshed.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _checkTilesOriginalOrder: function () {
        var arTiles = this._getTileElements();
        if (arTiles) {
          for (var i = 0; i < arTiles.length; i++) {
            var tile = arTiles[i];
            // insert the tile at its current index
            if (!tile._jetDataMasonryOriginalOrder) {
              this._insertTileOriginalOrder(tile, i);
            }
          }
        }
      },

      /**
       * Restore the original DOM order of the tiles.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _restoreTilesOriginalOrder: function () {
        var children = this._getTileElements();
        var sortedChildren = this._getTileElements();
        _sortTilesOriginalOrder(sortedChildren);
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          var sortedChild = sortedChildren[i];
          // if the tiles are different, need to rearrange the DOM
          if (child !== sortedChild) {
            // notify the element that it's been detached from the DOM BEFORE actually
            // detaching it so that components can save state
            Components.subtreeDetached(sortedChild);
            // insert the tile from the layout order into the DOM at this index
            var parentNode = child.parentNode;
            parentNode.insertBefore(sortedChild, child); // @HTMLUpdateOK
            // notify the element that it's been attached to the DOM
            Components.subtreeAttached(sortedChild);

            // rearrange the array of children to match the DOM reorder above
            var sortedChildIndex = children.indexOf(sortedChild);
            if (sortedChildIndex > i) {
              children.splice(sortedChildIndex, 1);
              children.splice(i, 0, sortedChild);
            }
          }
        }
      },

      /**
       * Insert a tile into the original DOM order at the given index.
       * @param {Object} insertedTile Tile to insert.
       * @param {number} index Index at which to insert.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _insertTileOriginalOrder: function (insertedTile, index) {
        var arTiles = this._getTileElements();
        if (index < 0) {
          // eslint-disable-next-line no-param-reassign
          index = arTiles.length;
        }
        if (arTiles) {
          for (var i = 0; i < arTiles.length; i++) {
            var tile = arTiles[i];
            // increment the index of each shifted tile
            if (tile._jetDataMasonryOriginalOrder &&
                tile._jetDataMasonryOriginalOrder >= index + 1) {
              tile._jetDataMasonryOriginalOrder += 1;
            }
          }
        }
        // save the index on the inserted tile AFTER the above loop so that its index
        // didn't get incremented
        // eslint-disable-next-line no-param-reassign
        insertedTile._jetDataMasonryOriginalOrder = index + 1;
      },

      /**
       * Remove a tile from the original DOM order.
       * @param {Object} removedTile Tile to remove.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _removeTileOriginalOrder: function (removedTile) {
        if (removedTile._jetDataMasonryOriginalOrder) {
          var arTiles = this._getTileElements();
          if (arTiles) {
            for (var i = 0; i < arTiles.length; i++) {
              var tile = arTiles[i];
              // decrement the index of each shifted tile
              if (tile._jetDataMasonryOriginalOrder &&
                  tile._jetDataMasonryOriginalOrder > removedTile._jetDataMasonryOriginalOrder) {
                tile._jetDataMasonryOriginalOrder -= 1;
              }
            }
          }
          // delete the stored index from the tile
          // eslint-disable-next-line no-param-reassign
          delete removedTile._jetDataMasonryOriginalOrder;
        }
      },

      /**
       * Apply the "oj-masonrylayout-tile" style class to any child tile that is missing it.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _applyTileStyleClass: function () {
        var elem = this.element;
        var children = elem.children();
        children = children.not('.' + _OJ_MASONRYLAYOUT_TILE);
        children = children.filter(function (index, childElem) {
          var childClasses = childElem.className;
          return childClasses.match(_OJ_MASONRYLAYOUT_TILE_SIZE_CLASS_PATTERN);
        });
        children.addClass(_OJ_MASONRYLAYOUT_TILE);
      },

      // start functions for context menu reordering ///////////////////////////////

      /**
       * Initialize the context menu.  This is called on startup, or on option
       * "contextMenu" change.
       * @param {Object=} newVal True if called because of an option change.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _initMenu: function (newVal) {
        var t = null;
        var menu = this._GetContextMenu();

        // check for contextmenu attribute on the root element
        if ((!newVal) && (!menu) && !this._IsCustomElement()) {
          menu = this.element.attr('contextmenu');
          if (menu) {
            this.options.contextMenu = '#' + menu;
          }
        }

        if ((!newVal) && (!menu)) {
          return;
        }

        menu = newVal || menu;
        t = $.type(menu);
        if (t === 'function') {
          try {
            // call user's method to get the context menu
            menu = menu();
          } catch (e) {
            menu = null;
          }
          t = $.type(menu);
        }

        if (!menu) {
          return;
        }

        // get the user's <ul> list
        var $m = $(menu);
        if ($m.length > 0) {
          // ensure it's not visible
          $m.css('display', _NONE);
          var dm = this._menu;
          if (!dm) {
            return;
          }

          dm.$container = $m;
          // have a context menu
          dm.usermenu = true;
        }

        // if we have a context menu
        if (this._menu.usermenu) {
          // and it is being changed
          if (newVal) {
            // complete menu creation/attachment
            this._applyMenu();
          }
        }

        //  If not a new val from options, Menu will be noted at the end of initialization in _start()
      },

      /**
       * Replace built in shortcut reorder context menu items with real items and
       * add listeners to the context menu.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _applyMenu: function () {
        if (!this._menu || !this._menu.usermenu || !this.options.reorderHandle) {
          return;
        }

        // Add our listeners so that we can handle build-in cut/paste, etc
        var $menuContainer = this._menu.$container;
        var self = this;

        // Check if the menu container tag name is 'OJ-MENU' for custom element context menu
        if ($menuContainer[0].tagName === 'OJ-MENU') {
          // For custom element context menu, attach action listener to handle selection
          $menuContainer[0].addEventListener('ojAction', this._handleContextMenuSelect.bind(this));
        } else {
          // For data-bind widget context menu, attach selection listener to handle selection
          $menuContainer.on('ojselect', this._handleContextMenuSelect.bind(this));
        }

        // If there are any ojMasonryLayout built in menu item ids, construct the menu items
        var listItems = $menuContainer.find('[data-oj-command]');
        var bChanged = false;

        listItems.each(function () {
          var command = $(this).attr('data-oj-command');
          if (command.indexOf('oj-masonrylayout-') >= 0) {
            command = command.slice('oj-masonrylayout-'.length);
          }
          var tagName = ($menuContainer[0].tagName === 'OJ-MENU') ? this.tagName : 'li';
          var newMenuItem = self._buildContextMenuItem(command, tagName);

          $(this).attr('id', newMenuItem.attr('id'));
          if (this.tagName === 'OJ-OPTION') {
            // Just update the content of OJ-OPTION and don't replace that with menu item,
            // because replacing OJ-OPTION would trigger a detach/attach of custom element
            this.innerHTML = newMenuItem.get(0).innerHTML; // @HTMLUpdateOK
            $(this).attr('data-oj-command', newMenuItem.attr('data-oj-command'));
          } else {
            // replace the list item with the new menu item
            newMenuItem.get(0).className = $(this).get(0).className;
            $(this).replaceWith(newMenuItem); // @HTMLUpdateOK
          }
          bChanged = true;
        });

        if (bChanged) {
          if ($menuContainer[0].tagName === 'OJ-MENU') {
            $menuContainer[0].refresh();
          } else {
            $menuContainer.ojMenu('refresh');
          }
        }

        this._menu.$elemCut = $menuContainer.find('#' + _OJMASONRYLAYOUTCUT);
        this._menu.$elemPasteBefore = $menuContainer.find('#' + _OJMASONRYLAYOUTPASTEBEFORE);
        this._menu.$elemPasteAfter = $menuContainer.find('#' + _OJMASONRYLAYOUTPASTEAFTER);
      },

      /**
       * Clear out any contextMenu data.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _clearMenu: function () {
        var menu = this._menu;
        if (menu && menu.usermenu) {
          menu.usermenu = false;
          if (menu.$container[0].tagName === 'OJ-MENU') {
            menu.$container[0].removeEventListener('ojAction', this._handleContextMenuSelect);
          } else {
            menu.$container.off('ojselect');
          }
          menu.$container = null;
        }
      },

      /**
       * Refresh the context menu.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _refreshMenu: function () {
        this._clearMenu();
        this._initMenu();
        this._applyMenu();
      },

      /**
       * Prepare the context menu before it's opened.
       * @param {Object} e jQuery event object.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _prepareContextMenuBeforeOpen: function (e) {
        var elem = this.element;

        // FIX : only allow reordering if context menu was
        // launched from reorder handle
        var target = e.originalEvent.target;
        var options = this.options;
        var reorderHandle = options.reorderHandle;
        var reorderAllowed = false;
        if (reorderHandle) {
          var closestHandle = $(target).closest(reorderHandle);
          if (closestHandle && closestHandle.length > 0) {
            reorderAllowed = true;
          }
        }

        var tile = _findContainingTile(target, elem[0]);
        this._menu.tile = tile;

        var bDisable;
        // set menu items disabled state
        if (this._menu.usermenu) {
          var cutTile = this._menu.cutTile;
          var bRefreshMenu = false;

          var elemCut = this._menu.$elemCut;
          if (elemCut) {
            // FIX : only allow reordering if context menu was
            // launched from reorder handle
            var cutHidden = elemCut.hasClass('oj-helper-hidden');
            if (!reorderAllowed && !cutHidden) {
              elemCut.addClass('oj-helper-hidden');
              bRefreshMenu = true;
            } else if (reorderAllowed && cutHidden) {
              elemCut.removeClass('oj-helper-hidden');
              bRefreshMenu = true;
            }

            var cutDisabled = elemCut.hasClass(_OJ_DISABLED);
            bDisable = false;
            // disable "cut" if this tile has already been cut
            if (cutTile && tile === cutTile) {
              bDisable = true;
            }

            if (bDisable && !cutDisabled) {
              elemCut.addClass(_OJ_DISABLED);
              bRefreshMenu = true;
            } else if (!bDisable && cutDisabled) {
              elemCut.removeClass(_OJ_DISABLED);
              bRefreshMenu = true;
            }
          }

          var elemPasteBefore = this._menu.$elemPasteBefore;
          if (elemPasteBefore) {
            // FIX : only allow reordering if context menu was
            // launched from reorder handle
            var pasteBeforeHidden = elemPasteBefore.hasClass('oj-helper-hidden');
            if (!reorderAllowed && !pasteBeforeHidden) {
              elemPasteBefore.addClass('oj-helper-hidden');
              bRefreshMenu = true;
            } else if (reorderAllowed && pasteBeforeHidden) {
              elemPasteBefore.removeClass('oj-helper-hidden');
              bRefreshMenu = true;
            }

            var pasteBeforeDisabled = elemPasteBefore.hasClass(_OJ_DISABLED);
            bDisable = false;
            // disable "pasteBefore" if this is the tile that was cut or if the cut
            // tile is the one before this tile
            if (!cutTile ||
                (tile === cutTile || tile === _getNextElement(cutTile))) {
              bDisable = true;
            }

            if (bDisable && !pasteBeforeDisabled) {
              elemPasteBefore.addClass(_OJ_DISABLED);
              bRefreshMenu = true;
            } else if (!bDisable && pasteBeforeDisabled) {
              elemPasteBefore.removeClass(_OJ_DISABLED);
              bRefreshMenu = true;
            }
          }

          var elemPasteAfter = this._menu.$elemPasteAfter;
          if (elemPasteAfter) {
            // FIX : only allow reordering if context menu was
            // launched from reorder handle
            var pasteAfterHidden = elemPasteAfter.hasClass('oj-helper-hidden');
            if (!reorderAllowed && !pasteAfterHidden) {
              elemPasteAfter.addClass('oj-helper-hidden');
              bRefreshMenu = true;
            } else if (reorderAllowed && pasteAfterHidden) {
              elemPasteAfter.removeClass('oj-helper-hidden');
              bRefreshMenu = true;
            }

            var pasteAfterDisabled = elemPasteAfter.hasClass(_OJ_DISABLED);
            bDisable = false;
            // disable "pasteAfter" if this is the tile that was cut or if the cut
            // tile is the one after this tile
            if (!cutTile ||
                (cutTile === tile || cutTile === _getNextElement(tile))) {
              bDisable = true;
            }

            if (bDisable && !pasteAfterDisabled) {
              elemPasteAfter.addClass(_OJ_DISABLED);
              bRefreshMenu = true;
            } else if (!bDisable && pasteAfterDisabled) {
              elemPasteAfter.removeClass(_OJ_DISABLED);
              bRefreshMenu = true;
            }
          }

          if (bRefreshMenu) {
            var $menuContainer = this._menu.$container;

            if ($menuContainer[0].tagName === 'OJ-MENU') {
              $menuContainer[0].refresh();
            } else {
              $menuContainer.ojMenu('refresh');
            }
          }
        }
      },

      /**
       * Build a context menu item for a cut/paste command.
       * @param {string} command Command to execute for item.
       * @param {string} tagName to use to create the menu item
       * @returns {jQuery} jQuery list item object.
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _buildContextMenuItem: function (command, tagName) {
        var id = _MENU_CMD_MAP[command];
        var item = $(document.createElement(tagName));
        item.attr('id', id);
        item.attr('data-oj-command', command);
        item.append(this._buildContextMenuLabel(command, tagName === 'OJ-OPTION')); // @HTMLUpdateOK
        return item;
      },

      /**
       * Builds a context menu label by looking up command translation
       * @param {string} command the string to look up translation for
       * @param {boolean=} useOjOption whether oj-option tag should be used
       * @return {jQuery|string} a jQuery object with HTML containing a label
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _buildContextMenuLabel: function (command, useOjOption) {
        // convert to the translation key convention
        var transKey = _MENU_TRANSLATION_MAP[command];
        var textNode = document.createTextNode(this.getTranslatedString(transKey));

        // for custom elements, no <a> tag is required
        if (useOjOption) {
          return textNode;
        }
        return $('<a href="#"></a>').append(textNode); // @HTMLUpdateOK
      },

      /**
       * Execute a "cut" command from the context menu.
       * @param {Object} obj Tile element to cut.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _menuCut: function (obj) {
        if (obj) {
          this._menu.cutTile = obj;
        }
      },

      /**
       * Execute a "paste" command from the context menu.
       * @param {Object} obj Tile element at paste location.
       * @param {boolean} pasteBefore True to paste before the given tile, false to
       *        paste after the given tile.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _menuPaste: function (obj, pasteBefore) {
        if (obj && this._menu.cutTile) {
          var cutTile = this._menu.cutTile;
          this._menu.cutTile = false;
          this._doPaste(cutTile, obj, pasteBefore);
        }
      },

      /**
       * Paste the cut tile before or after the given paste tile.
       * @param {Object} cutTile Tile element to paste.
       * @param {Object} pasteTile Tile element at paste location.
       * @param {boolean} pasteBefore True to paste before the given tile, false to
       *        paste after the given tile.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _doPaste: function (cutTile, pasteTile, pasteBefore) {
        var fromIndex = cutTile._jetDataMasonryOriginalOrder - 1;
        var jqCutTile = $(cutTile);

        // fire beforeReorder event
        var beforeEventData = {
          /** @expose */
          tile: jqCutTile,
          /** @expose */
          fromIndex: fromIndex
        };
        var bSuccess = this._trigger('beforeReorder', null, beforeEventData);

        if (bSuccess !== false) {
          // remove the cutTile from the original ordering before getting the toIndex
          this._removeTileOriginalOrder(cutTile);
          var toIndex = pasteTile._jetDataMasonryOriginalOrder - 1;
          if (!pasteBefore) {
            toIndex += 1;
          }

          var elem = this.element[0];
          if (pasteBefore) {
            this._insertTileOriginalOrder(cutTile, toIndex);
            elem.insertBefore(cutTile, pasteTile); // @HTMLUpdateOK
          } else {
            var nextElem = _getNextElement(pasteTile);
            this._insertTileOriginalOrder(cutTile, toIndex);
            elem.insertBefore(cutTile, nextElem); // @HTMLUpdateOK
          }

          var mlCommon = this._mlCommon;
          mlCommon.setup(true);

          // fire reorder event
          var eventData = {
            /** @expose */
            tile: jqCutTile,
            /** @expose */
            fromIndex: fromIndex,
            /** @expose */
            toIndex: toIndex
          };
          this._trigger('reorder', null, eventData);
        }
      },

      /**
       * Handle a context menu select event.
       * @param {Event|CustomEvent} event event for context menu item selection
       * @param {Object=} ui an object containing the menu item that was selected
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleContextMenuSelect: function (event, ui) {
        // get the selected menu item from the ui object in the old data-bind syntax widget case,
        // or from the event target in the custom element case.
        var item = ui ? ui.item : $(event.target);
        var id = item.attr('id');

        if (id === _OJMASONRYLAYOUTCUT) {
          this._menuCut(this._menu.tile);
        } else if (id === _OJMASONRYLAYOUTPASTEBEFORE) {
          this._menuPaste(this._menu.tile, true);
        } else if (id === _OJMASONRYLAYOUTPASTEAFTER) {
          this._menuPaste(this._menu.tile, false);
        }
      },

      // end functions for context menu reordering /////////////////////////////////

      // start functions for drag-and-drop reordering //////////////////////////////

      /**
       * Get the index of the given child tile.
       * @param {Object} tile Tile for which to get the index.
       * @returns {number} Index of the tile.
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _getTileIndex: function (tile) {
        // index should be with respect to "real" children, not including the dropsite,
        // so exclude the dropsite from the children array
        var children = this._getTileElements(true);
        // need to sort the children because the index is with respect to the original order
        _sortTilesOriginalOrder(children);
        var numChildren = children.length;
        for (var i = 0; i < numChildren; i++) {
          if (children[i] === tile) {
            return i;
          }
        }
        return -1;
      },

      /**
       * Setup drag and drop on the reorder handles.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _setupReorderHandles: function () {
        var elem = this.element;
        var children = elem.children();
        this._setupReorderHandlesForElem(children);
        elem
          .on('dragstart' + this.reorderHandleEventNamespace, this._handleDragStartFunc)
          .on('dragenter' + this.reorderHandleEventNamespace, this._handleDragEnterFunc)
          .on('dragover' + this.reorderHandleEventNamespace, this._handleDragOverFunc)
          .on('dragleave' + this.reorderHandleEventNamespace, this._handleDragLeaveFunc)
          .on('dragend' + this.reorderHandleEventNamespace, this._handleDragEndFunc)
          .on('drop' + this.reorderHandleEventNamespace, this._handleDropFunc);
      },

      /**
       * Setup drag and drop on the reorder handles.
       * @param {jQuery} jqElem Elem for which to setup drag and drop on
       *        the reorder handles.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _setupReorderHandlesForElem: function (jqElem) {
        var options = this.options;
        // setup for tiles themselves
        var tiles = jqElem.filter(options.reorderHandle);
        tiles
          .attr(_DRAGGABLE, 'true')
          .addClass(_OJ_DRAGGABLE);
        // setup for descendants of tiles
        var reorderHandles = jqElem.find(options.reorderHandle);
        reorderHandles
          .attr(_DRAGGABLE, 'true')
          .addClass(_OJ_DRAGGABLE);
      },

      /**
       * Tear down drag and drop on the reorder handles.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _tearDownReorderHandles: function () {
        var elem = this.element;
        var children = elem.children();
        // tear down reorder handles on the children of the root elem in case
        // the root elem itself is draggable
        this._tearDownReorderHandlesForElem(children);
        elem.off(this.reorderHandleEventNamespace);
      },

      /**
       * Tear down drag and drop on the reorder handles.
       * @param {jQuery} jqElem Elem for which to tear down drag and drop on
       *        the reorder handles.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _tearDownReorderHandlesForElem: function (jqElem) {
        var options = this.options;
        // tear down for tiles themselves
        var tiles = jqElem.filter(options.reorderHandle);
        tiles
          .removeAttr(_DRAGGABLE)
          .removeClass(_OJ_DRAGGABLE);
        // tear down for descendants of tiles
        var reorderHandles = jqElem.find(options.reorderHandle);
        reorderHandles
          .removeAttr(_DRAGGABLE)
          .removeClass(_OJ_DRAGGABLE);
      },

      /**
       * Handle a dragstart event.
       * @param {Event} event jQuery Event
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleDragStart: function (event) {
        var options = this.options;
        var target;

        // FIX : if drag didn't start on reorder handle, don't
        // reorder tile
        target = event.originalEvent.target;
        var closestHandle = $(target).closest(options.reorderHandle);
        if (!closestHandle || closestHandle.length < 1) {
          return;
        }


        // don't try to start another drag while there's already one happening
        // (in case the previous transition is still running)
        if (!this._bDragging) {
          target = event.target;
          var elem = this.element;
          var tile = _findContainingTile(target, elem[0]);
          if (tile) {
            var index = this._getTileIndex(tile);
            tile._jetDataMasonryDragSourceIndex = index;

            // fire beforeReorder event
            var eventData = {
              /** @expose */
              tile: $(tile),
              /** @expose */
              fromIndex: index
            };
            var bSuccess = this._trigger('beforeReorder', null, eventData);

            if (bSuccess !== false) {
              var originalEvent = event.originalEvent;
              this._dragStart(tile, originalEvent.pageX, originalEvent.pageY,
                              originalEvent.dataTransfer);
            }
          }
        }
      },

      /**
       * Handle a dragenter event.
       * @param {Event} event jQuery Event
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleDragEnter: function (event) {
        // FIX : only process drag and drop event if masonryLayout
        // started the drag
        if (!this._bDragging) {
          return;
        }

        var originalEvent = event.originalEvent;
        var relatedTarget = originalEvent.relatedTarget;
        var elem = this.element[0];
        var enteringMasonryLayout = false;
        if (relatedTarget) {
          enteringMasonryLayout = (elem !== relatedTarget) &&
            !oj.DomUtils.isAncestor(elem, relatedTarget);
        } else if (this._dragLeftMasonryLayout) {
          // chrome 40.0.2214.111 doesn't set a relatedTarget, so need to use other means
          // to figure out if we're re-entering the masonryLayout
          var elemUnderPoint = document.elementFromPoint(originalEvent.clientX,
                                                         originalEvent.clientY);
          enteringMasonryLayout = elemUnderPoint &&
            (elemUnderPoint === elem ||
             oj.DomUtils.isAncestor(elem, elemUnderPoint));
        }
        if (enteringMasonryLayout) {
          this._dragLeftMasonryLayout = false;
          if (!this._draggedTile) {
            var dataTransfer = originalEvent.dataTransfer;
            dataTransfer.dropEffect = 'none';
          } else if (this._dropSite) {
            $(this._dropSite).css('display', '');
            var mlCommon = this._mlCommon;
            mlCommon.setup(false, true);
          }
        }
      },

      /**
       * Handle a dragover event.
       * @param {Event} event jQuery Event
       * @returns {boolean} False
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleDragOver: function (event) {
        // FIX : only process drag and drop event if masonryLayout
        // started the drag
        if (!this._bDragging) {
          return false;
        }

        var originalEvent = event.originalEvent;
        var dataTransfer = originalEvent.dataTransfer;
        dataTransfer.dropEffect = 'move';

        this._dragMove(originalEvent.pageX, originalEvent.clientX, originalEvent.clientY);

        // necessary to allow a drop
        event.preventDefault();
        return false;
      },

      /**
       * Handle a dragleave event.
       * @param {Event} event jQuery Event
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleDragLeave: function (event) {
        // FIX : only process drag and drop event if masonryLayout
        // started the drag
        if (!this._bDragging) {
          return;
        }

        var originalEvent = event.originalEvent;
        var relatedTarget = originalEvent.relatedTarget;
        var elem = this.element[0];
        var leavingMasonryLayout = false;
        if (relatedTarget) {
          leavingMasonryLayout = (elem !== relatedTarget) &&
            !oj.DomUtils.isAncestor(elem, relatedTarget);
        } else {
          // chrome 40.0.2214.111 doesn't set a relatedTarget, so need to use other means
          // to figure out if we're exiting the masonryLayout
          var elemUnderPoint = document.elementFromPoint(originalEvent.clientX,
                                                         originalEvent.clientY);
          leavingMasonryLayout = elemUnderPoint &&
            elemUnderPoint !== elem &&
            !oj.DomUtils.isAncestor(elem, elemUnderPoint);
        }
        if (leavingMasonryLayout) {
          this._dragLeftMasonryLayout = true;
          if (this._dropSite) {
            $(this._dropSite).css('display', _NONE);
            var mlCommon = this._mlCommon;
            mlCommon.setup(false, true);
          }
        }
      },

      /**
       * Clear the timeout used to hide the tile at the start of a drag.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _clearDragStartHideTileTimeout: function () {
        if (this._dragStartHideTileTimeout) {
          clearTimeout(this._dragStartHideTileTimeout);
          this._dragStartHideTileTimeout = null;
          this._busyStateResolveFunc();
          this._busyStateResolveFunc = null;

          var draggedTile = this._draggedTile;
          if (draggedTile) {
            $(draggedTile).removeClass('oj-drag');
          }
        }
      },

      /**
       * Handle a dragend event.
       * @param {Event} event jQuery Event
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _handleDragEnd: function (event) {
        // FIX : if the drag and drop was a very short duration,
        // the hide tile timeout may not have fired yet, so clear it now
        this._clearDragStartHideTileTimeout();

        // FIX : only process drag and drop event if masonryLayout
        // started the drag
        if (!this._bDragging) {
          return;
        }

        // only process the dragend if we're not currently processing a drop (for
        // example if the mouse button was released outside of the masonryLayout)
        if (!this._bDropping) {
          var draggedTile = this._draggedTile;
          if (draggedTile && this._dropSite) {
            var dropSite = this._dropSite;
            var elem = this.element[0];
            // tile was not moved outside
            if (oj.DomUtils.isAncestor(elem, draggedTile)) {
              $(dropSite).css('display', '');
              this._removeTileOriginalOrder(dropSite);
              var parent = dropSite.parentNode;
              parent.removeChild(dropSite);
              $(draggedTile).css('display', '');
              this._insertTileOriginalOrder(draggedTile,
                                            draggedTile._jetDataMasonryOriginalOrder - 1);
              var mlCommon = this._mlCommon;
              mlCommon.setup(false, true);
            }

            delete draggedTile._jetDataMasonryDragSourceIndex;
          }
          this._draggedTile = null;
          this._dropSite = null;
          this._prevTileUnderPoint = null;
          this._prevCellUnderPoint = null;
          this._bDragMoveTransition = false;
          this._bMouseMoved = false;
          this._dragOffset = null;
          this._bDragEndTransition = false;
          this._bDragging = false;
        }
      },

      /**
       * Handle a drop event.
       * @param {Event} event jQuery Event
       * @returns {boolean} False
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleDrop: function (event) {
        // FIX : only process drag and drop event if masonryLayout
        // started the drag
        if (!this._bDragging) {
          return false;
        }

        // FIX : if the drop happens before the drag move layout
        // animation is done, finish that layout cycle immediately before processing
        // the drop
        var mlCommon = this._mlCommon;
        if (mlCommon.isInLayoutCycle()) {
          mlCommon.finishLayoutCycle();
        }

        // FIX : if the drag and drop was a very short duration,
        // the hide tile timeout may not have fired yet, so clear it now
        this._clearDragStartHideTileTimeout();

        var originalEvent = event.originalEvent;
        this._drop(this._draggedTile, originalEvent.pageX, originalEvent.pageY);

        // stop the browser from redirecting
        event.stopPropagation();
        return false;
      },

      /**
       * Start a drag.
       * @param {!Element} tile Tile being dragged.
       * @param {number} pageX Page coordinate at which the drag starts.
       * @param {number} pageY Page coordinate at which the drag starts.
       * @param {Object} dataTransfer Drag and drop DataTransfer object.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _dragStart: function (tile, pageX, pageY, dataTransfer) {
        this._bDragging = true;
        this._bDropping = false;
        this._bMouseMoved = false;
        this._bDragStartTileHidden = false;
        this._draggedTile = tile;
        var elem = this.element[0];

        var sizeClass = _getSizeStyleClassName(tile);
        this._dropSite = document.createElement('div');
        var dropSite = this._dropSite;
        dropSite._jetDataMasonryOriginalOrder = tile._jetDataMasonryOriginalOrder;
        dropSite.className = sizeClass + ' oj-drop ' + _OJ_MASONRYLAYOUT_TILE;
        var style = dropSite.style;
        var tileStyle = tile.style;
        style.top = tileStyle.top;
        // FIX : in RTL, position tiles using "right" instead of "left"
        if (this._bRTL) {
          style.right = tileStyle.right;
        } else {
          style.left = tileStyle.left;
        }
        // need to get the relative position of the tile BEFORE replacing it with
        // the dropsite and adding it to the elemParent below
        var offset = _getRelativePosition(tile);
        elem.insertBefore(dropSite, tile); // @HTMLUpdateOK

        var dragOffset = { left: pageX - offset.left, top: pageY - offset.top };
        this._dragOffset = dragOffset;

        // add the oj-drag class BEFORE creating the drag feedback image
        $(tile).addClass('oj-drag');

        // eslint-disable-next-line no-param-reassign
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData('text/html', tile.outerHTML); // @HTMLUpdateOK
        dataTransfer.setDragImage(tile, dragOffset.left, dragOffset.top);

        // hide the original tile in a timeout AFTER creating the drag feedback image
        var self = this;
        this._busyStateResolveFunc = this._addBusyState('Wait for dragStartHideTile timeout');
        this._dragStartHideTileTimeout = setTimeout(function () {
          self._bDragStartTileHidden = true;
          tileStyle.display = _NONE;
          $(tile).removeClass('oj-drag');
          self._dragStartHideTileTimeout = null;
          self._busyStateResolveFunc();
          self._busyStateResolveFunc = null;
          // notify the element that it's been hidden
          Components.subtreeHidden(tile);
        }, 0);
      },

      /**
       * Drag a tile.
       * @param {number} pageX Page coordinate of the drag move.
       * @param {number} clientX Client coordinate of the drag move.
       * @param {number} clientY Client coordinate of the drag move.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _dragMove: function (pageX, clientX, clientY) {
        this._bMouseMoved = true;

        // FIX : if the dragged tile hasn't been hidden yet, don't
        // process the drag move because it may layout the dragged tile, which
        // will leave a visual gap in the layout once the tile is hidden
        if (!this._bDragStartTileHidden) {
          return;
        }

        if (!this._bDragMoveTransition) {
          var elem = this.element[0];
          var elemUnderPoint = document.elementFromPoint(clientX, clientY);
          var tileUnderPoint = _findContainingTile(elemUnderPoint, elem);

          // FIX : only allow reordering if tile has reorder
          // handle
          var tileHasReorderHandle = false;
          if (tileUnderPoint) {
            var $tileUnderPoint = $(tileUnderPoint);
            var options = this.options;
            var reorderHandle = options.reorderHandle;
            // FIX : the tile has a reorder handle if: 1) the tile
            // itself is the reorder handle, or 2) the reorder handle is a
            // descendant of the tile
            if ($tileUnderPoint.is(reorderHandle)) {
              tileHasReorderHandle = true;
            } else {
              var handleInTile = $tileUnderPoint.find(reorderHandle);
              tileHasReorderHandle = handleInTile && handleInTile.length > 0;
            }
          }

          // FIX :  if the tileUnderPoint is a valid tile and is different than previous
          // tileUnderPoint, then the reorder animation have shifted a different tile under the mouse.
          // Check if the cellUnderPoint before the reorder animation is same as after the animation.
          // If they are same, then skip re-ordering of tiles to prevent recursion.
          // A different tile under the same cell during a drag move indicates that the reorder animation
          // have shifted a different tile under the mouse.
          var bSkipReorder = false;
          if (tileUnderPoint == null ||
              tileUnderPoint === this._dropSite ||
              tileUnderPoint === this._draggedTile) {
            this._prevTileUnderPoint = null;
            this._prevCellUnderPoint = null;
          } else if (this._prevTileUnderPoint && this._prevCellUnderPoint &&
                     this._prevTileUnderPoint !== tileUnderPoint) {
            var cellUnderPoint = this._getCellPosition(clientX, clientY);
            if (cellUnderPoint &&
                cellUnderPoint.row === this._prevCellUnderPoint.row &&
                cellUnderPoint.col === this._prevCellUnderPoint.col) {
              bSkipReorder = true;
            }
          }

          if (tileUnderPoint && !bSkipReorder &&
              tileUnderPoint !== this._dropSite &&
              tileUnderPoint !== this._draggedTile &&
              tileHasReorderHandle) {
            var offset = _getRelativePosition(elem);
            var relX = pageX - offset.left;
            var oldNextSibling = _getNextElement(this._dropSite);
            var bRightSide = relX >= tileUnderPoint.offsetLeft + (tileUnderPoint.offsetWidth * 0.5);
            this._removeTileOriginalOrder(this._dropSite);
            if ((bRightSide && !this._bRTL) || (!bRightSide && this._bRTL)) {
              var nextElem = _getNextElement(tileUnderPoint);
              if (nextElem) {
                // insert before the nextElem
                this._insertTileOriginalOrder(this._dropSite,
                                              nextElem._jetDataMasonryOriginalOrder - 1);
                elem.insertBefore(this._dropSite, nextElem); // @HTMLUpdateOK
              } else {
                // append to the end
                this._insertTileOriginalOrder(this._dropSite,
                                              tileUnderPoint._jetDataMasonryOriginalOrder);
                elem.appendChild(this._dropSite); // @HTMLUpdateOK
              }
            } else {
              // insert before the tileUnderPoint
              this._insertTileOriginalOrder(this._dropSite,
                                            tileUnderPoint._jetDataMasonryOriginalOrder - 1);
              elem.insertBefore(this._dropSite, tileUnderPoint); // @HTMLUpdateOK
            }
            var newNextSibling = _getNextElement(this._dropSite);
            // only need to layout if the dropSite has actually changed order
            if (oldNextSibling !== newNextSibling) {
              // only record the start of a drag move transition if the layout
              // actually changed
              var mlCommon = this._mlCommon;
              // save the tileUnderPoint and cellUnderPoint of the current layout
              // before the call to mlCommon.setup() that computes the relayout.
              var tmpTileUnderPoint = tileUnderPoint;
              var tmpCellUnderPoint = this._getCellPosition(clientX, clientY);

              this._bDragMoveTransition = mlCommon.setup(false, true);
              // if the tile has moved, save tmpTileUnderPoint and tmpCellUnderPoint
              if (this._bDragMoveTransition) {
                this._prevTileUnderPoint = tmpTileUnderPoint;
                this._prevCellUnderPoint = tmpCellUnderPoint;
              }
            }
          }
        }
      },

      /**
       * Handle the end of a layout transition while dragging a tile.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleDragMoveTransitionEnd: function () {
        this._bDragMoveTransition = false;
      },

      /**
       * Drop a tile.
       * @param {!Element} tile Tile being dragged.
       * @param {number} pageX Page coordinate of the drop.
       * @param {number} pageY Page coordinate of the drop.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _drop: function (tile, pageX, pageY) {
        this._bDropping = true;
        var elem = this.element[0];
        var dropSite = this._dropSite;
        this._dropSite = null;
        this._prevTileUnderPoint = null;
        this._prevCellUnderPoint = null;
        // notify the element that it's been detached from the DOM BEFORE actually
        // detaching it so that components can save state
        Components.subtreeDetached(tile);
        // FIX : calling DOM replaceChild() seems to break in IE11 on Win7, so instead call
        // equivalent insertBefore() and removeChild()
        elem.insertBefore(tile, dropSite); // @HTMLUpdateOK
        elem.removeChild(dropSite);
        // notify the element that it's been attached to the DOM
        Components.subtreeAttached(tile);
        // eslint-disable-next-line no-param-reassign
        tile._jetDataMasonryOriginalOrder = dropSite._jetDataMasonryOriginalOrder;
        var style = tile.style;
        style.display = '';
        // notify the element that it's been shown
        Components.subtreeShown(tile);

        // immediately transform the page absolute coords to ones relative to the
        // ojmasonrylayout
        var offset = _getRelativePosition(elem);
        var dragOffset = this._dragOffset;
        style.top = (pageY - dragOffset.top - offset.top) + _PX;
        // FIX : in RTL, position tiles using "right" instead of "left"
        var newLeft = pageX - dragOffset.left - offset.left;
        if (this._bRTL) {
          style.right = (elem.offsetWidth - (newLeft + $(tile).outerWidth(true))) + _PX;
          style.left = '';
        } else {
          style.left = newLeft + _PX;
        }

        this._dragOffset = null;

        if (this._bMouseMoved) {
          // transition the tile to its permanent place in the layout
          var mlCommon = this._mlCommon;
          this._bDragEndTransition = mlCommon.setup(false, true);
        } else {
          this._handleDragEndTransitionEnd();
        }
      },

      /**
       * Handle the end of a layout transition when a tile is dropped.
       * @return {void}
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _handleDragEndTransitionEnd: function () {
        this._bDragEndTransition = false;
        this._bDragging = false;
        this._bDropping = false;
        this._bMouseMoved = false;
        this._bDragStartTileHidden = false;

        var tile = this._draggedTile;
        this._draggedTile = null;
        var fromIndex = tile._jetDataMasonryDragSourceIndex;
        delete tile._jetDataMasonryDragSourceIndex;
        var toIndex = this._getTileIndex(tile);

        // fire reorder event
        var eventData = {
          /** @expose */
          tile: $(tile),
          /** @expose */
          fromIndex: fromIndex,
          /** @expose */
          toIndex: toIndex
        };
        this._trigger('reorder', null, eventData);
      },

      /**
       * Get the grid cell position for the given client coordinates.
       * Returns an object with col, row properties, or null if it can't figure out.
       * This will return invalid cell positions if clientX/clientY is outside the component.
       * So this method should be called only for valid coordinates inside the component.
       *
       * @param {number} clientX Client X coordinate
       * @param {number} clientY Client Y coordinate
       * @returns {Object|null} cell position
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _getCellPosition: function (clientX, clientY) {
        var mlCommon = this._mlCommon;
        var cellSize = mlCommon.getCellSize();
        var position = null;
        if (cellSize) {
          position = {
            col: parseInt(clientX / cellSize.w, 10),
            row: parseInt(clientY / cellSize.h, 10) };
        }
        return position;
      },

      // end functions for drag-and-drop reordering ////////////////////////////////

      /**
       * Add a busy state to the busy context.
       *
       * @param {string} description Additional information about busy state.
       * @returns {Function} Resolve function called by the registrant when the busy state completes.
       *          The resultant function will throw an error if the busy state is no longer registered.
       * @memberof oj.ojMasonryLayout
       * @instance
       * @private
       */
      _addBusyState: function (description) {
        var element = this.element;
        var context = Context.getContext(element[0]);
        var busyContext = context.getBusyContext();

        var desc = 'MasonryLayout';
        var id = element.attr('id');
        desc += " (id='" + id + "')";
        desc += ': ' + description;

        var busyStateOptions = { description: desc };
        return busyContext.addBusyState(busyStateOptions);
      },

      // @inheritdoc
      getNodeBySubId: function (locator) {
        return this._super(locator);
      },

      // @inheritdoc
      getSubIdByNode: function (node) {
        return this._super(node);
      }

      // start API doc fragments /////////////////////////////////////////////////////

      /**
       * <p>This element does not expose any subIds.</p>
       *
       * @ojsubid None
       * @memberof oj.ojMasonryLayout
       */

      /**
       * <p>MasonryLayout is for layout only and does not directly support touch
       * interaction.
       *
       * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
       * @memberof oj.ojMasonryLayout
       */

      /**
       * <p>MasonryLayout is for layout only and does not directly support keyboard
       * interaction.
       *
       * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
       * @memberof oj.ojMasonryLayout
       */

      /**
       * <p>The following css classes can be used to specify the size of a masonry tile.
       *
       * <table class="generic-table styling-table">
       *   <thead>
       *     <tr>
       *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
       *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td>oj-masonrylayout-tile-1x1</td>
       *       <td>A tile that spans 1 column and 1 row.</td>
       *     </tr>
       *     <tr>
       *       <td>oj-masonrylayout-tile-1x2</td>
       *       <td>A tile that spans 1 column and 2 rows.</td>
       *     </tr>
       *     <tr>
       *       <td>oj-masonrylayout-tile-1x3</td>
       *       <td>A tile that spans 1 column and 3 rows.</td>
       *     </tr>
       *     <tr>
       *       <td>oj-masonrylayout-tile-2x1</td>
       *       <td>A tile that spans 2 columns and 1 row.</td>
       *     </tr>
       *     <tr>
       *       <td>oj-masonrylayout-tile-2x2</td>
       *       <td>A tile that spans 2 columns and 2 rows.</td>
       *     </tr>
       *     <tr>
       *       <td>oj-masonrylayout-tile-2x3</td>
       *       <td>A tile that spans 2 columns and 3 rows.</td>
       *     </tr>
       *     <tr>
       *       <td>oj-masonrylayout-tile-3x1</td>
       *       <td>A tile that spans 3 columns and 1 row.</td>
       *     </tr>
       *     <tr>
       *       <td>oj-masonrylayout-tile-3x2</td>
       *       <td>A tile that spans 3 columns and 2 rows.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
       * @memberof oj.ojMasonryLayout
       */
      // end API doc fragments ///////////////////////////////////////////////////////

    }); // end of oj.__registerWidget


// end static members and functions ////////////////////////////////////////////
}()); // end of MasonryLayout wrapper function


/* global __oj_masonry_layout_metadata:false */
(function () {
  __oj_masonry_layout_metadata.extension._WIDGET_NAME = 'ojMasonryLayout';
  oj.CustomElementBridge.register('oj-masonry-layout', { metadata: __oj_masonry_layout_metadata });
}());

});