/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';

/**
 * Base object for HTML toolkit derivative objects.
 * @class The base object for HTML toolkit derivative objects.
 * @constructor
 */
const Obj = function () {};

/** @private @const **/
Obj._GET_FUNCTION_NAME_REGEXP = /function\s+([\S^]+)\s*\(/;

/**
 *  Provides inheritance by subclassing a class from a given base class.
 *  @param  {class} extendingClass  The class to be extended from the base class.
 *  @param  {class} baseClass  The base class
 */
Obj.createSubclass = function (extendingClass, baseClass) {
  // use a temporary constructor to get our superclass as our prototype
  // without out having to initialize the superclass
  var tempConstructor = Obj._tempSubclassConstructor;

  tempConstructor.prototype = baseClass.prototype;
  extendingClass.prototype = new tempConstructor();

  extendingClass.prototype.constructor = extendingClass;
  extendingClass.superclass = baseClass.prototype;
};

/**  @private  */
Obj._tempSubclassConstructor = function () {};

/**
 *  Returns a copy of this object.  Abstract method, subclasses
 *   must implement.
 *  @type {Obj}
 */
Obj.prototype.clone = function () {
  return null;
};

/**
 * Creates a callback function
 *
 * @param {object} thisPtr the object that should be "this" when the function is called
 * @param {function} func the function to create the callback for
 *
 * @return {function} the callback function
 */
Obj.createCallback = function (thisPtr, func) {
  return function () {
    return func.apply(thisPtr, arguments);
  };
};

/**
 * Utility to compare two objects which uses JET's oj.KeyUtils.equals method if provided
 * or a strict equality check otherwise.
 * @param {dvt.Context} ctx The context object
 * @param {*} obj1 The first object to compare
 * @param {*} obj2 The second object to compare
 * @return {boolean} True if the two objects are equal and false otherwise
 */
Obj.compareValues = function (ctx, obj1, obj2) {
  return ctx.oj.KeyUtils.equals(obj1, obj2);
};

/**
 * Defines an (x,y) coordinate.
 * @class Point
 * @constructor
 * @param {number} x
 * @param {number} y
 */
const Point = function (x, y) {
  this.x = x === null || isNaN(x) ? 0 : x;
  this.y = y === null || isNaN(y) ? 0 : y;
};

/**
 * Compare the coordinates with another Point
 *
 * @param {Point} p  point to compare
 * @return {boolean} true if the point has the same coordinates as this
 */
Point.prototype.equals = function (p) {
  if (p instanceof Point && this.x === p.x && this.y === p.y) return true;

  return false;
};

/**
 * @constructor
 */
const Agent = function () {};

//Note: AgentInfo is set when ojdvt-base module is loaded
var AgentInfo;
Agent.setAgentInfo = function (info) {
  AgentInfo = info;
};

Agent.getAgentInfo = function () {
  return AgentInfo;
};

Object.defineProperty(Agent, 'browser', {
  enumerable: true,
  get: function () {
    return Agent.getAgentInfo().browser;
  }
});
Object.defineProperty(Agent, 'engine', {
  enumerable: true,
  get: function () {
    return Agent.getAgentInfo().engine;
  }
});
Object.defineProperty(Agent, 'version', {
  enumerable: true,
  get: function () {
    return Agent.getAgentInfo().browserVersion;
  }
});
Object.defineProperty(Agent, 'os', {
  enumerable: true,
  get: function () {
    return Agent.getAgentInfo().os.toLowerCase();
  }
});

Obj.createSubclass(Agent, Obj);

/**
 * @const
 */
Agent.FOCUS_COLOR_DEFAULT = '#0645AD';
/**
 * @const
 */
Agent.FOCUS_COLOR_IE = '#090909';

/**
 * Returns true if creation of aria-label attributes can be deferred.  This prevents costly string generation from
 * becoming necessary across the entire data set.  When deferred, the getAriaLabel API should be implemented on
 * the DvtLogicalObject implementation.
 * @return {boolean}
 */
Agent.deferAriaCreation = function () {
  return !Agent.isTouchDevice() && !Agent.isEnvironmentTest();
};

/**
 * Returns the ratio between physical pixels and device independent pixels for the current device.
 * @return {number} the device pixel ratio
 */
Agent.getDevicePixelRatio = function () {
  Agent._initialize();
  return Agent._devicePixelRatio;
};

/**
 * Returns the position of the specified DOM element in page coordinates.
 * @param {object} element
 * @return {Point}
 */
Agent.getElementPosition = function (element) {
  if (Agent.browser === 'ie' || Agent.browser === 'edge')
    return Agent._getElementPositionIE(element);
  else return Agent._getElementPositionDefault(element);
};

/**
 * Returns true if rendering in a right to left locale.
 * @param {dvt.Context=} context If specified, first tries to determine the reading direction from the context.
 * @return {boolean}
 */
Agent.isRightToLeft = function (context) {
  Agent._initialize();
  if (context && context.getReadingDirection() != null)
    return context.getReadingDirection() == 'rtl';
  else return Agent._bRtl;
};

/**
 * Returns true if rendering on a touch device.
 * @return {boolean}
 */
Agent.isTouchDevice = function () {
  Agent._initialize();
  return Agent._bTouchDevice;
};

/**
 * Sets the current environment type
 * @param {String} type The environment type.  Currently supports 'batik' and 'test'
 */
Agent.setEnvironment = function (type) {
  Agent._environment = type;
};

/**
 * Returns whether the current environment is test
 * @return {boolean}
 */
Agent.isEnvironmentTest = function () {
  return Agent._environment == 'test';
};

/**
 * Sets the whether the current environment is rendering in high contrast mode
 * @param {boolean} bHighContrast Whether to render in high contrast mode
 */
Agent.setHighContrast = function (bHighContrast) {
  Agent._highContrast = bHighContrast;
};

/**
 * Returns whether the whether the current environment is rendering in high contrast mode
 * @return {boolean}
 */
Agent.isHighContrast = function () {
  return Agent._highContrast === true;
};

/**
 * Works around Firefox bug where displayable isn't rendered correctly for matrix update
 * @param {dvt.Displayable} displayable The displayable to check
 */
Agent.workaroundFirefoxRepaint = function (displayable) {
  //Fix for 
  if (Agent.browser === 'firefox') {
    var parent = displayable.getParent();
    if (parent) {
      var idx = parent.getChildIndex(displayable);
      parent.removeChildAt(idx);
      parent.addChildAt(displayable, idx);
    }
  }
};

/**
 * Initializes the agent.  This caches all the relevant agent parameters and must be called before accessing any of
 * the variables on Agent.
 * @private
 */
Agent._initialize = function () {
  // Initialize Agent if it hasn't been already.
  if (!Agent._bInitialized) {
    Agent._bRtl =
      document && document.documentElement ? document.documentElement.dir == 'rtl' : false;
    Agent._bTouchDevice = Agent.os === 'ios' || Agent.os === 'android';
    Agent._devicePixelRatio =
      window && window.devicePixelRatio != null ? window.devicePixelRatio : 1;
    // Don't initialize again
    Agent._bInitialized = true;
  }
};

/**
 * Returns the position of an HTML element relative to the document body.
 * @param {object} element The HTML element.
 * @return {Point}
 * @private
 */
Agent._getElementPositionDefault = function (element) {
  // Note: This code was copied from AdfAgent and is not cleaned up for purposes of maintainability and comparison.
  //AdfAssert.assertDomElement(element);
  var boundingRect = element.getBoundingClientRect();
  // top and bottom are not rounded off in Gecko1.9
  // http://www.quirksmode.org/dom/w3c_cssom.html#elementviewm
  var elemTop = Math.round(boundingRect.top);
  var elemLeft = boundingRect.left;
  var docElement = element.ownerDocument.documentElement;
  var body = element.ownerDocument.body;
  // clientLeft and clientTop would be 0 for Gecko1.9
  // https://bugzilla.mozilla.org/show_bug.cgi?id=174397#c34
  // : scrollTop/Left could be defined in either the docElem or the body, so we need to check both
  elemLeft += docElement.scrollLeft || body.scrollLeft;
  elemTop += docElement.scrollTop || body.scrollTop;
  return new Point(elemLeft, elemTop);
};

/**
 * Returns the position of an HTML element relative to the document body.
 * @param {object} element The HTML element.
 * @return {Point}
 * @private
 */
Agent._getElementPositionIE = function (element) {
  // Note: This code was copied from AdfAgent and is not cleaned up for purposes of maintainability and comparison.
  //AdfAssert.assertDomElement(element);
  var boundingRect = element.getBoundingClientRect();
  var elemTop = boundingRect.top;
  var elemLeft = boundingRect.left;
  var docElement = element.ownerDocument.documentElement;
  var scrollLeft = docElement.scrollLeft;

  // RTL adjustment for IE scrolled view
  //if(AdfPage.PAGE.getLocaleContext().isRightToLeft())
  //  scrollLeft += docElement.clientWidth - docElement.scrollWidth;

  // adjust for the document scroll positions and window borders
  elemLeft -= docElement.clientLeft - scrollLeft;
  elemTop -= docElement.clientTop - docElement.scrollTop;
  return new Point(elemLeft, elemTop);
};

/**
 * Get browser specific focus color.
 * @return {string} A color specification for the focus color
 */
Agent.getFocusColor = function () {
  Agent._initialize();
  if (!Agent._focusColor) {
    var focusColor;
    if (Agent.engine === 'blink' || Agent.browser === 'safari') {
      var body = document.getElementsByTagName('body')[0];
      var tempDiv = document.createElement('div');
      body.appendChild(tempDiv); //@HTMLUpdateOK
      tempDiv.style.outline = '-webkit-focus-ring-color';
      focusColor = window.getComputedStyle(tempDiv).getPropertyValue('outline-color');
      body.removeChild(tempDiv);
    } else if (Agent.browser === 'ie' || Agent.browser === 'edge')
      focusColor = Agent.FOCUS_COLOR_IE;
    Agent._focusColor = focusColor ? focusColor : Agent.FOCUS_COLOR_DEFAULT;
  }
  return Agent._focusColor;
};

/**
 *  A static class for DnD support.
 *  @class DragAndDropUtils
 */
const DragAndDropUtils = {};

Obj.createSubclass(DragAndDropUtils, Obj);

/**
 * Returns a {dvt.Rectangle} representing the drag feedback bounds.
 * @param {object} displayables The dvt.Displayable or array of DvtDisplayables to display for drag feedback.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the coordinate space of the resulting bounds.  The
 *                                               parent coordinate space is used if none is provided.
 */
DragAndDropUtils.getDragFeedbackBounds = function (displayables, targetCoordinateSpace) {
  if (!displayables) return null;

  var bounds = null;
  if (!(displayables instanceof Array)) {
    // for simple objects, just return the object bounds
    // TODO: eventually should ensure that bounds are in container coordinates
    bounds = displayables.getDimensions(
      targetCoordinateSpace ? targetCoordinateSpace : displayables.getParent()
    );
  } else if (displayables.length > 0) {
    // TODO: eventually should ensure that bounds are in container coordinates
    // for arrays, initialize bounds based on the first object
    bounds = displayables[0].getDimensions(
      targetCoordinateSpace ? targetCoordinateSpace : displayables[0].getParent()
    );

    // ... and adjust it to acommodate other objects in the collection
    for (var i = 1; i < displayables.length; i++) {
      var obj = displayables[i];
      var objBounds = obj.getDimensions(
        targetCoordinateSpace ? targetCoordinateSpace : obj.getParent()
      );

      if (objBounds.x < bounds.x) {
        bounds.w += bounds.x - objBounds.x;
        bounds.x = objBounds.x;
      }
      if (objBounds.y < bounds.y) {
        bounds.h += bounds.y - objBounds.y;
        bounds.y = objBounds.y;
      }
      if (objBounds.x + objBounds.w > bounds.x + bounds.w) {
        bounds.w = objBounds.x + objBounds.w - bounds.x;
      }
      if (objBounds.y + objBounds.h > bounds.y + bounds.h) {
        bounds.h = objBounds.y + objBounds.h - bounds.y;
      }
    }
  }
  return bounds;
};

/**
 * Drag source event handler.
 * @param {dvt.Context} context
 * @class DragSource
 * @constructor
 */
const DragSource = function (context) {
  this.Init(context);
};

Obj.createSubclass(DragSource, Obj);

// Margin to add to drag feedback bounds to minimize clipping
DragSource.DRAG_FEEDBACK_MARGIN = 2;

/**
 * @param {dvt.Container} container
 * @param {dvt.Context} context
 */
DragSource.prototype.Init = function (context) {
  this._context = context;

  // current draggable object under the mouse pointer
  this._dragCandidate = null;

  // object being dragged
  this._dragObj = null;
  this._dragCoords = null;
};

/**
 * Returns the current drag candidate object.
 */
DragSource.prototype.getDragCandidate = function () {
  return this._dragCandidate;
};

/**
 * Sets the specified object as the current drag candidate, if it supports the DvtDraggable interface.
 * @param {object} obj
 */
DragSource.prototype.setDragCandidate = function (obj) {
  // a DnD candidate object must support all DvtDraggable methods
  if (obj && obj.isDragAvailable && obj.getDragTransferable) this._dragCandidate = obj;
  else this._dragCandidate = null;
};

/**
 * If there are any drag candidate, returns the client id of the drag component.
 * Otherwise returns null.
 */
DragSource.prototype.isDragAvailable = function (clientIds) {
  if (this._dragCandidate != null) {
    return this._dragCandidate.isDragAvailable(clientIds);
  }
  return null;
};

/**
 * If there are a drag candidate, return the dragTransferable object.
 */
DragSource.prototype.getDragTransferable = function (mouseX, mouseY) {
  // if there's anything to drag
  if (this._dragCandidate) {
    // store the dragObj and current mouse coords
    this._dragObj = this._dragCandidate;
    this._dragCoords = {
      x: mouseX,
      y: mouseY
    };

    return this._dragCandidate.getDragTransferable(mouseX, mouseY);
  }
  return null;
};

/**
 * Returns the feedback for the drag operation.
 */
DragSource.prototype.getDragOverFeedback = function (mouseX, mouseY) {
  // Hide the tooltip, since this is the last hook before the drag feedback is created
  this._context.getTooltipManager().hideTooltip();

  // Return the drag feedback
  var dragObj = this.getDragObject();
  if (dragObj && dragObj.getDragFeedback) return dragObj.getDragFeedback(mouseX, mouseY);
  else return null;
};

/**
 * Returns component specific context for the drag.
 */
DragSource.prototype.getDragContext = function (mouseX, mouseY) {
  if (this._dragObj && this._dragObj.getDragContext) {
    return this._dragObj.getDragContext(mouseX, mouseY);
  }
  return null;
};

/**
 * Returns the object currently being dragged.
 */
DragSource.prototype.getDragObject = function () {
  return this._dragObj;
};

/**
 * Returns the coordinates where the current drag was initiated.
 */
DragSource.prototype.getDragCoords = function () {
  return this._dragCoords;
};

/**
 * Return the offset to use for the drag feedback.
 */
DragSource.prototype.getDragOffset = function (mouseX, mouseY) {
  var offset = {};
  var feedback = this.getDragOverFeedback(mouseX, mouseY);
  if (feedback) {
    var bounds = DragAndDropUtils.getDragFeedbackBounds(feedback, this._context.getStage());

    //return displayables to their original condition, if necessary,
    //after determining bounds
    var dragObj = this.getDragObject();
    if (dragObj && dragObj.afterDragOverFeedback) {
      dragObj.afterDragOverFeedback(feedback);
    }

    if (bounds) {
      offset.x = mouseX - bounds.x;
      offset.y = mouseY - bounds.y;
      offset.x += DragSource.DRAG_FEEDBACK_MARGIN;
      offset.y += DragSource.DRAG_FEEDBACK_MARGIN;
    }
  } else {
    offset.x = 0;
    offset.y = 0;
  }
  return offset;
};

/**
 * Returns the offset from the mouse pointer where the drag is considered to be located.
 * @param {number} xOffset A suggested offset, usually the center of the drag feedback.
 * @param {number} yOffset A suggested offset, usually the center of the drag feedback.
 * @return {object}
 */
DragSource.prototype.getPointerOffset = function (xOffset, yOffset) {
  // Default implementation does not apply an offset, mouse position is used instead
  return { x: 0, y: 0 };
};

/**
 * Called when a drag is started.
 */
DragSource.prototype.initiateDrag = function () {
  // On touch devices, when a drag is initiated, immediately cancel any touch and hold
  var tm = this.getTouchManager();
  if (Agent.isTouchDevice() && tm) tm.cancelTouchHold();
};

/**
 * Clean up after the drag is completed.
 */
DragSource.prototype.dragDropEnd = function () {
  this._dragCandidate = null;
  this._dragObj = null;
  this._dragCoords = null;
};

/**
 * Sets a touch manager object
 * @param {dvt.TouchManager} touch manager object
 */
DragSource.prototype.setTouchManager = function (touchManager) {
  this._touchManager = touchManager;
};

/**
 * Gets a touch manager object
 * @return {dvt.TouchManager} touch manager object
 */
DragSource.prototype.getTouchManager = function () {
  return this._touchManager;
};

/**
 * Defines a (w,h) dimension.
 * @class dvt.Dimension
 * @constructor
 * @param {number} w The dimension width
 * @param {number} h The dimension height
 */
const Dimension = function (w, h) {
  this.w = w === null || isNaN(w) ? 0 : w;
  this.h = h === null || isNaN(h) ? 0 : h;
};

/**
 *  Creates an immutable matrix object. Note that methods that mutate the matrix after
 *  construction, e.g. translate, skew, rotate, etc will return a new instance of a Matrix
 *  instead of modifying the existing object.
 *  @extends {dvt.Obj}
 *  @class Matrix is a platform independent class representing a transformation
 *  matrix.
 *  <p>
 *  The matrix is in the form:<br>
 *  [ a  b  tx ]<br>
 *  [ c  d  ty ]<br>
 *  [ 0  0  1  ]<br>
 *  <p>
 *  <b>Example:</b><br><br> <code>
 *  var mat = new Matrix(context) ;<br>
 *  mat.translate(15, 30) ;<br>
 *</code>
 *  @constructor
 *  @param {number} a Optional
 *  @param {number} b Optional
 *  @param {number} c Optional
 *  @param {number} d Optional
 *  @param {number} tx Optional
 *  @param {number} ty Optional
 */
const Matrix = function (a, b, c, d, tx, ty) {
  //don't allow users to set individual elements, because we
  //may need to adjust transforms for different platforms, for
  //example if the angle of rotation increases in different
  //directions on different platforms, and we don't want to try
  //to deconstruct the matrix
  this._a = a == null ? 1 : a;
  this._b = b == null ? 0 : b;
  this._c = c == null ? 0 : c;
  this._d = d == null ? 1 : d;
  this._tx = tx == null ? 0 : tx;
  this._ty = ty == null ? 0 : ty;
  this._u = 0;
  this._v = 0;
  this._w = 1;
};

Obj.createSubclass(Matrix, Obj);

//   [ a  b  tx ]
//   [ c  d  ty ]
//   [ 0  0  1  ]

/**
 *  @private
 */
Matrix._DECOMP_TX = 0;

/**
 *  @private
 */
Matrix._DECOMP_TY = 1;

/**
 *  @private
 */
Matrix._DECOMP_R = 2;

/**
 *  @private
 */
Matrix._DECOMP_SKEWX = 3;

/**
 *  @private
 */
Matrix._DECOMP_SX = 4;

/**
 *  @private
 */
Matrix._DECOMP_SY = 5;

/**
 *  Get the A element of this matrix.
 *  @return {Number}  The A element of this matrix.
 */
Matrix.prototype.getA = function () {
  return this._a;
};

/**
 *  Get the B element of this matrix.
 *  @return {Number}  The B element of this matrix.
 */
Matrix.prototype.getB = function () {
  return this._b;
};

/**
 *  Get the C element of this matrix.
 *  @return {Number}  The C element of this matrix.
 */
Matrix.prototype.getC = function () {
  return this._c;
};

/**
 *  Get the D element of this matrix.
 *  @return {Number}  The D element of this matrix.
 */
Matrix.prototype.getD = function () {
  return this._d;
};

/**
 *  Get the TX element of this matrix.
 *  @return {Number}  The TX element of this matrix.
 */
Matrix.prototype.getTx = function () {
  return this._tx;
};

/**
 *  Get the TY element of this matrix.
 *  @return {Number}  The TY element of this matrix.
 */
Matrix.prototype.getTy = function () {
  return this._ty;
};

/**
 *  Returns a new Matrix which is a concatenation of the given matrix
 *  with this matrix.
 *  @param {Matrix} mat   The matrix to concatenate with this matrix.
 *  @return {Matrix}
 */
Matrix.prototype.concat = function (mat) {
  // A * B = B.concat(A) = childMatrix.concat(parentMatrix)
  var newA = this._a * mat.getA() + this._c * mat.getB() + this._u * mat.getTx();
  var newB = this._b * mat.getA() + this._d * mat.getB() + this._v * mat.getTx();
  var newTX = this._tx * mat.getA() + this._ty * mat.getB() + this._w * mat.getTx();

  var newC = this._a * mat.getC() + this._c * mat.getD() + this._u * mat.getTy();
  var newD = this._b * mat.getC() + this._d * mat.getD() + this._v * mat.getTy();
  var newTY = this._tx * mat.getC() + this._ty * mat.getD() + this._w * mat.getTy();

  return new Matrix(newA, newB, newC, newD, newTX, newTY);
};

/**
 *  Returns a new Matrix which is a translation of this matrix to the given dx and dy values.
 *  @param {Number} dx   The horizontal distance to translate by, in pixels.
 *  @param {Number} dy   The vertical distance to translate by, in pixels.
 *  @return {Matrix}
 */
Matrix.prototype.translate = function (dx, dy) {
  return this.concat(new Matrix(1, 0, 0, 1, dx, dy));
};

/**
 *  Returns a new Matrix which is a scale of this matrix, optionally around a specified point
 *  @param {number} sx   The horizontal value to scale by.
 *  @param {number} sy   The vertical value to scale by.
 *  @param {number} px   The x value of the point to scale around (optional)
 *  @param {number} py   The y value of the point to scale around (optional)
 *  @return {Matrix}
 */
Matrix.prototype.scale = function (sx, sy, px, py) {
  var scaleMat = this;
  if (px || py) {
    scaleMat = this.translate(-px, -py);
  }
  var tMat = new Matrix(sx, 0, 0, sy);

  scaleMat = scaleMat.concat(tMat);
  if (px || py) {
    scaleMat = scaleMat.translate(px, py);
  }
  return scaleMat;
};

/**
 *  Returns a new Matrix which is a rotation of this matrix.
 *  @param {Number} angleRads   The angle to rotate by, in radians.
 *  @return {Matrix}
 */
Matrix.prototype.rotate = function (angleRads) {
  var cos = Math.cos(angleRads);
  var sin = Math.sin(angleRads);
  var tMat = new Matrix(cos, -sin, sin, cos);
  return this.concat(tMat);
};

/**
 *  Returns a new Matrix that is a skew of this matrix.
 *  @param {Number} sxRads   The horizontal angle to skew by, in radians.
 *  @param {Number} syRads   The vertical angle to skew by, in radians.
 *  @return {Matrix}
 */
Matrix.prototype.skew = function (sxRads, syRads) {
  var tMat = new Matrix(1, Math.tan(sxRads), Math.tan(syRads), 1);
  return this.concat(tMat);
};

/**
 *  Calculate the determinant of this matrix.
 *  @return {number} determinant of this matrix
 *  @private
 */
Matrix.prototype._determinant = function () {
  var determinant =
    this._a * (this._d * this._w - this._ty * this._v) -
    this._b * (this._c * this._w - this._ty * this._u) +
    this._tx * (this._c * this._v - this._d * this._u);
  return determinant;
};

/**
 *  Returns a new Matrix that is an inversion of this matrix.
 *  @return {Matrix}
 */
Matrix.prototype.invert = function () {
  var determinant = this._determinant();
  var A = this._d * this._w - this._ty * this._v;
  var B = this._tx * this._v - this._b * this._w;
  var TX = this._b * this._ty - this._tx * this._d;
  var C = this._ty * this._u - this._c * this._w;
  var D = this._a * this._w - this._tx * this._u;
  var TY = this._tx * this._c - this._a * this._ty;
  return new Matrix(
    A / determinant,
    B / determinant,
    C / determinant,
    D / determinant,
    TX / determinant,
    TY / determinant
  );
};

/**
 *  Decompose this matrix into its constituent transforms.
 *  @return {Array} array of transform values in the form
 *           [translateX, translateY, rotationRadians, skewXRadians, scaleX, scaleY],
 *           of null if decomposition doesn't exist
 *  @private
 */
Matrix.prototype._decompose = function () {
  var A = this._a;
  var B = this._b;
  var C = this._c;
  var D = this._d;
  var Tx = this._tx;
  var Ty = this._ty;

  if (A * D - B * C === 0) return null;

  //x scale factor
  var Sx = Math.sqrt(A * A + C * C);
  A = A / Sx;
  C = C / Sx;

  //xy shear
  var K = A * B + C * D;
  B = B - A * K;
  D = D - C * K;

  //y scale factor
  var Sy = Math.sqrt(B * B + D * D);
  B = B / Sy;
  D = D / Sy;
  K = K / Sy;

  var determinant = A * D - B * C;
  if (determinant === -1) {
    K = -K;
    Sy = -Sy;
  }

  //rotation
  var R = Math.atan2(C, A);

  //skew
  var skewX = Math.atan(K);

  //to create new matrix with same transforms, use order:
  //1) scale(Sx, Sy)
  //2) skew(skewX, 0);
  //3) rotate(R);
  //4) translate(Tx, Ty);
  return [Tx, Ty, R, skewX, Sx, Sy];
};

/**
 *  Recompose this matrix from the given decomposition.
 *  @param {Array}  arDecomposition  array of transform values returned from
 *         calling decompose()
 *  @return {Matrix}
 *  @private
 */
Matrix.prototype._recompose = function (arDecomposition) {
  var mat = new Matrix(); // the identity matrix

  var Tx = arDecomposition[0];
  var Ty = arDecomposition[1];
  var R = arDecomposition[2];
  var skewX = arDecomposition[3];
  var Sx = arDecomposition[4];
  var Sy = arDecomposition[5];

  mat = mat.scale(Sx, Sy);
  mat = mat.skew(skewX, 0);
  mat = mat.rotate(R);
  return mat.translate(Tx, Ty);
};

/**
 *  @override
 */
Matrix.prototype.equals = function (mat) {
  if (!this && mat) return false;
  else if (this && !mat) return false;
  else if (!this && !mat) return true;
  else
    return (
      this._a === mat.getA() &&
      this._b === mat.getB() &&
      this._c === mat.getC() &&
      this._d === mat.getD() &&
      this._tx === mat.getTx() &&
      this._ty === mat.getTy()
    );
};

/**
 * Transform a point using this matrix.
 * @param {dvt.Point}  p  point to transform
 * @type {dvt.Point}
 */
Matrix.prototype.transformPoint = function (p) {
  var newX = this._a * p.x + this._b * p.y + this._tx * 1;
  var newY = this._c * p.x + this._d * p.y + this._ty * 1;
  return new Point(newX, newY);
};

/**
 * Test if this matrix is an indentity matrix.  Returns true if an identity matrix, else false.
 * @type {boolean}
 */
Matrix.prototype.isIdentity = function () {
  return (
    this._a === 1 &&
    this._b === 0 &&
    this._c === 0 &&
    this._d === 1 &&
    this._tx === 0 &&
    this._ty === 0
  );
};

/**
 * @class
 */
const ToolkitUtils = {};

Obj.createSubclass(ToolkitUtils, Obj);
/** @const **/
ToolkitUtils.SVG_NS = 'http://www.w3.org/2000/svg';
/** @const **/
ToolkitUtils.XLINK_NS = 'http://www.w3.org/1999/xlink';

/** @private **/
ToolkitUtils._IMAGE_URL_CACHE = {};
/** @private **/
ToolkitUtils._ICON_CACHE = {};

/**
 * Creates and returns a new SVG document with the specified id.
 * @param {string} id The id for the new SVG document.
 * @return {object} A new SVG document.
 */
ToolkitUtils.createSvgDocument = function (id) {
  var svg = document.createElementNS(ToolkitUtils.SVG_NS, 'svg');

  if (id != null) ToolkitUtils.setAttrNullNS(svg, 'id', id);

  ToolkitUtils.setAttrNullNS(svg, 'width', '100%');
  ToolkitUtils.setAttrNullNS(svg, 'height', '100%');

  //  - IE allows tabbing into svg element
  if (Agent.browser === 'ie' || Agent.browser === 'edge')
    ToolkitUtils.setAttrNullNS(svg, 'focusable', 'false');
  return svg;
};

/**
 * Returns the drag feedback for the specified objects.
 * @param {object} displayables The dvt.Displayable or array of DvtDisplayables to display for drag feedback.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the coordinate space of the resulting bounds.  The
 *                                               parent coordinate space is used if none is provided.
 * @return {object} An object containing drag feedback information.
 */
ToolkitUtils.getDragFeedback = function (displayables, targetCoordinateSpace) {
  var feedback = new Object();
  if (!displayables) {
    // This covers ER 25388103 - add ability to create diagram links via dnd
    // In the link creation case there are no displayables to create traditional DnD feedback.
    // The empty svg feedback object is created to suppress the default feedback,
    // the diagram link will be generated to reflect the drag.
    feedback.width = 1;
    feedback.height = 1;
    feedback.svg = ToolkitUtils.createSvgDocument('dnd');
    return feedback;
  }

  // Wrap in an array if not already wrapped.
  if (!(displayables instanceof Array)) {
    displayables = [displayables];
  }
  var bounds = DragAndDropUtils.getDragFeedbackBounds(displayables, targetCoordinateSpace);
  var svg = ToolkitUtils._getDragFeedbackSVG(displayables, bounds);

  feedback.width = bounds.w + DragSource.DRAG_FEEDBACK_MARGIN * 2;
  feedback.height = bounds.h + DragSource.DRAG_FEEDBACK_MARGIN * 2;
  if (svg) feedback.svg = svg;

  return feedback;
};

/**
 * Returns an svg string representing the drag over feedback.
 * @param {object} displayables The dvt.Displayable or array of DvtDisplayables to display for drag feedback.
 * @param {dvt.Rectangle} bounds The bounds for the drag feedback displayables, used to translate the feedback to 0.
 * @return {string} and svg string representing the drag over feedback
 * @private
 */
ToolkitUtils._getDragFeedbackSVG = function (displayables, bounds) {
  // : A new svg document must be created programmatically and appended to the wrapping div later on.
  //  This is necessary for Safari 5.0 and earlier, as well as iOS.  innerHTML should not be used.
  var svgElem = ToolkitUtils.createSvgDocument('dnd');
  ToolkitUtils.setAttrNullNS(svgElem, 'class', 'oj-drag');

  // Create a group element to apply the top level translate to show the drag feedback at (0, 0)
  var tx = DragSource.DRAG_FEEDBACK_MARGIN - bounds.x;
  var ty = DragSource.DRAG_FEEDBACK_MARGIN - bounds.y;
  var translate = 'translate(' + tx + ',' + ty + ')';
  var container = document.createElementNS(ToolkitUtils.SVG_NS, 'g');
  ToolkitUtils.setAttrNullNS(container, 'transform', translate);
  ToolkitUtils.appendChildElem(svgElem, container);

  // Loop through and add the displayables
  for (var i = 0; i < displayables.length; i++) {
    var src = displayables[i];
    // Clone the selected node and add
    var elem = src.getElem();
    var clone = elem.cloneNode(true);

    // Remove filters if present, since these effects overflow the bounds and look broken
    if (ToolkitUtils.getAttrNullNS(clone, 'filter'))
      ToolkitUtils.setAttrNullNS(clone, 'filter', null);

    var cloneContainer = document.createElementNS(ToolkitUtils.SVG_NS, 'g');
    ToolkitUtils.appendChildElem(container, cloneContainer);
    var pathToStage = src.getPathToStage();
    var mat = null;
    for (var j = 1; j < pathToStage.length; j++) {
      if (!mat) mat = pathToStage[j].getMatrix();
      else {
        mat = mat.concat(pathToStage[j].getMatrix());
      }
    }
    if (mat) {
      var sMat =
        'matrix(' +
        mat.getA() +
        ',' +
        mat.getC() +
        ',' +
        mat.getB() +
        ',' +
        mat.getD() +
        ',' +
        mat.getTx() +
        ',' +
        mat.getTy() +
        ')';
      ToolkitUtils.setAttrNullNS(cloneContainer, 'transform', sMat);
    }
    ToolkitUtils.appendChildElem(cloneContainer, clone);
  }

  return svgElem;
};

/**
 * Add an event listener to a DOM element.
 * @param {object} elem DOM element
 * @param {string} type type of event
 * @param {function} listener the listener function
 * @param {object|boolean} options options for the event listener or a boolean to inidcate
 *                                 whether the listener operates in the capture phase
 */
ToolkitUtils.addDomEventListener = function (elem, type, listener, options) {
  if (elem && elem.addEventListener) {
    elem.addEventListener(type, listener, options);
  }
};

/**
 * Remove an event listener from a DOM element.
 * @param {object} elem DOM element
 * @param {string} type type of event
 * @param {function} listener the listener function
 * @param {object|boolean} options options for the event listener or a boolean to inidcate
 *                                 whether the listener operates in the capture phase
 */
ToolkitUtils.removeDomEventListener = function (elem, type, listener, options) {
  if (elem && elem.removeEventListener) {
    elem.removeEventListener(type, listener, options);
  }
};

/**
 * Wrapper for appendChild method
 * @param {object} parent DOM element
 * @param {object} child DOM element added to parent
 * @return {object} the appended element (child)
 */
ToolkitUtils.appendChildElem = function (parent, child) {
  return parent.appendChild(child); //@HTMLUpdateOK
};

/**
 * Wrapper for removeChild method
 * @param {Node} parent DOM element
 * @param {Node} child DOM element to be removed from parent
 * @return {Node|null} the removed element (child) or null if not removed
 */
ToolkitUtils.removeChildElem = function (parent, child) {
  // check if the child belongs to the parent
  if (child.parentNode != parent) {
    return null;
  }
  return parent.removeChild(child);
};

/**
 * Wrapper for getAttribute method
 * @param {object} elem DOM element
 * @param {string} name Attribute name to get
 * @return {string} Value associated with given name
 */
ToolkitUtils.getAttrNullNS = function (elem, name) {
  return elem.getAttribute(name);
};

/**
 * Wrapper for hasAttribute method
 * @param {object} elem DOM element
 * @param {string} name the name of the attribute.
 * @return {boolean} true if the element has the specified attribute.
 */
ToolkitUtils.hasAttrNullNS = function (elem, name) {
  return elem.hasAttribute(name);
};

/**
 * Wrapper for setAttribute method.  When the value of the attribute matches the default value, the DOM will not be
 * updated unless the attribute has already been set to a different value.
 * @param {object} elem DOM element
 * @param {string} name the name of the attribute.
 * @param {string} value The value of the attribute.
 * @param {string=} defaultValue The default value of the attribute, which can be provided to optimize performance.
 */
ToolkitUtils.setAttrNullNS = function (elem, name, value, defaultValue) {
  // Note: We're not strict about value or defaultValue being String types, since browser implementations are not. The
  //       code in this function should always assume that users may pass objects that would be converted to Strings.

  // If defaultValue specified and value matches default, optimize the DOM calls
  if (defaultValue != null && value == defaultValue) {
    if (ToolkitUtils.hasAttrNullNS(elem, name)) {
      ToolkitUtils.removeAttrNullNS(elem, name);
    }
    return;
  }

  // Otherwise set the attribute
  elem.setAttribute(name, value); // @HTMLUpdateOK
};

/**
 * Remove an attribute from a DOM element, using a null namespace.
 * @param {object} elem DOM element
 * @param {string} name Attribute name to remove
 */
ToolkitUtils.removeAttrNullNS = function (elem, name) {
  //  This might be an over-optimization, but we know that hasAttrNullNS is cheap
  if (ToolkitUtils.hasAttrNullNS(elem, name)) elem.removeAttribute(name);
};

/**
 * Sets the href or xlink:href attribute for an element depending on browser support.
 * @param {object} elem DOM element
 * @param {string} src The href value
 */
ToolkitUtils.setHref = function (elem, src) {
  if (Agent.browser === 'safari' || (Agent.browser === 'firefox' && Agent.version < 51))
    elem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src);
  else ToolkitUtils.setAttrNullNS(elem, 'href', src);
};
/**
 * Get a pseudo link callback that loads a document into the existing or a new window.
 * The callback can be used as an onclick callback for dvt.Button.
 * @param {string} target a target frame or a name of the window for the link
 * @param {string} dest a URL to be loaded for the link
 * @return {function} callback function
 */
ToolkitUtils.getLinkCallback = function (target, dest) {
  if (target || dest) {
    // DVT ES6 TODO: Added missing 'self' ref - Trung
    var self = this;
    var callback = function () {
      if (target == null) {
        self.location = dest;
      } else {
        var newWindow = window.open(dest, target);
        if (newWindow) newWindow.focus();
      }
    };
    return callback;
  }
  return null;
};

/**
 * Constructs a URL path based on the ID in the SVG definition.
 * @param {string} id The ID in the SVG definition.
 * @return {string} URL path.
 */
ToolkitUtils.getUrlPathById = function (id) {
  // If <base> is defined on the document, we have to use the full URL.
  // document.baseURI is not supported in IE, so we have to check if the <base> tag exists in the document.
  var hasBase =
    Agent.browser === 'ie' || Agent.browser === 'edge'
      ? document.querySelector('base') != null
      : document.URL != document.baseURI;
  var root = hasBase ? document.URL.split('#')[0] + '#' : '#';
  return root + id;
};

/**
 * Constructs a URL attribute value based on the ID in the SVG definition.
 * @param {string} id The ID in the SVG definition.
 * @return {string} URL attribute value.
 */
ToolkitUtils.getUrlById = function (id) {
  return 'url(' + ToolkitUtils.getUrlPathById(id) + ')';
};

/**
 * Sets the width and height of the component SVG.
 * @param {dvt.Context} context
 * @param {number} width
 * @param {number} height
 */
ToolkitUtils.setSvgSize = function (context, width, height) {
  var svg = context.getSvgDocument();
  ToolkitUtils.setAttrNullNS(svg, 'width', width + 'px');
  ToolkitUtils.setAttrNullNS(svg, 'height', height + 'px');
};

/**
 * Returns the width and height of the component outer div.
 * @param {dvt.Context} context
 * @return {Dimension}
 */
ToolkitUtils.getOuterDivSize = function (context) {
  var outerDiv = context.getSvgDocument().parentNode;
  var computedStyle = window.getComputedStyle(outerDiv);
  return new Dimension(parseFloat(computedStyle.width), parseFloat(computedStyle.height));
};

/**
 * Returns jQuery-wrapped event or a native event based on jQuery availability and the
 * syntax used to create the JET component.
 * @param {dvt.Context} context
 * @param {dvt.BaseEvent} event
 * @return {$.Event|Event}
 */
ToolkitUtils.getEventForSyntax = function (context, event) {
  var nativeEvent = event.getNativeEvent();
  if (!context.isCustomElement() && typeof $ != 'undefined') {
    // Use $.event.fix instead of $.Event so that the $event properties are populated
    // The dataTransfer property has to be copied manually
    var $event = $.event.fix(nativeEvent);
    $event.dataTransfer = nativeEvent.dataTransfer;
    return $event;
  }
  return nativeEvent;
};

/**
 * Returns the image URL for the specified CSS class name.
 * @param {dvt.Context} context
 * @param {string} className
 * @return {string} The image URL.
 */
ToolkitUtils.getImageUrl = function (context, className) {
  // If classname is undefined or null, return the same and
  // let the caller handle it.
  // Also, if the className contains a dot, then it is actually a URL,
  // so return immediately.
  if (className == null || className.indexOf('.') !== -1) {
    return className;
  }
  var urlMapping = ToolkitUtils.getImageUrls(context, [className]);
  return urlMapping[className];
};

/**
 * Returns the image URL map for the specified list of classnames
 * @param {dvt.Context} context
 * @param {Array<string>} classNames
 * @return {object} The map of the classname to image URL
 */
ToolkitUtils.getImageUrls = function (context, classNames) {
  // If the classname is empty, then return
  if (classNames.length == 0) {
    return {};
  }

  var urlMapping = {};
  var cssContainer = document.createElement('div');
  cssContainer.style.display = 'none';

  // Create divs with the class names in the list and append it to the cssContainer
  for (var i = 0; i < classNames.length; i++) {
    var className = classNames[i];
    var url, cssDiv;

    // Skip if the classname is null or undefined
    if (className == null) {
      continue;
    }

    // If the className contains a dot, then it is actually a URL, so store and skip
    if (className.indexOf('.') !== -1) {
      urlMapping[className] = className;
      continue;
    }

    url = ToolkitUtils._IMAGE_URL_CACHE[className];
    // Check if the URL is already available in the cache
    if (url != null) {
      urlMapping[className] = url;
      continue;
    }

    cssDiv = document.createElement('div');
    cssDiv.className = className;

    ToolkitUtils.appendChildElem(cssContainer, cssDiv);
  }

  // No need to append the container and compute style when no
  // child nodes are added.
  // urlMapping can be returned immediately.
  if (!cssContainer.hasChildNodes()) {
    return urlMapping;
  }

  // Append the cssContainer to the container of the context
  // This invokes a forced Recalculate Styles by the browser
  // Then the url can be extracted from the child divs
  ToolkitUtils.appendChildElem(context.getContainer(), cssContainer);

  // Iterate through all the children of the cssContainer and
  // extract the background-image url
  Array.prototype.forEach.call(cssContainer.childNodes, function (cssDiv) {
    var className = cssDiv.className;
    var styleMap = window.getComputedStyle(cssDiv);
    var url = styleMap.getPropertyValue('background-image');

    // Sanitize the url
    if (url && url.indexOf('url(') !== -1) {
      url = url.slice(url.indexOf('url(') + 4, url.length - 1).replace(/["']/g, '');
    } else {
      url = className;
    }

    urlMapping[className] = url;
    ToolkitUtils._IMAGE_URL_CACHE[className] = url;
  });

  ToolkitUtils.removeChildElem(context.getContainer(), cssContainer);
  return urlMapping;
};

/**
 * Returns the font icon style for the given classname
 * @param {dvt.Context} context
 * @param {string} className
 * @return {object} An object with 'character' and 'transform' keys
 */
ToolkitUtils.getIconStyle = function (context, className) {
  return ToolkitUtils.getIconStyles(context, [className])[className];
};

/**
 * Returns the font icon characters for the specified list of classnames
 * @param {dvt.Context} context
 * @param {Array<string>} classNames
 * @return {object} A map from classnames to objects with 'character' and 'transform' keys
 */
ToolkitUtils.getIconStyles = function (context, classNames) {
  // If the classname is empty, then return
  if (classNames.length == 0) {
    return {};
  }

  var iconStyles = {};
  var cssContainer = document.createElement('div');
  var containerStyle = cssContainer.style;
  // can't use display:none because it will cause pseudoelements to be unavailable
  containerStyle.width = '0px';
  containerStyle.height = '0px';
  containerStyle.visibility = 'hidden';

  // Create divs with the class names in the list and append it to the cssContainer
  for (var i = 0; i < classNames.length; i++) {
    var className = classNames[i];
    var iconStyle, cssDiv;

    // Skip if the classname is null or undefined
    if (className == null) {
      continue;
    }

    iconStyle = ToolkitUtils._ICON_CACHE[className];
    // Check if the icon is already available in the cache
    if (iconStyle != null) {
      iconStyles[className] = iconStyle;
      continue;
    }

    cssDiv = document.createElement('div');
    cssDiv.className = className;

    ToolkitUtils.appendChildElem(cssContainer, cssDiv);
  }

  // No need to append the container and compute style when no
  // child nodes are added.
  // charMapping can be returned immediately.
  if (!cssContainer.hasChildNodes()) {
    return iconStyles;
  }

  // Append the cssContainer to the container of the context
  // This invokes a forced Recalculate Styles by the browser
  // Then the char can be extracted from the child divs
  ToolkitUtils.appendChildElem(context.getContainer(), cssContainer);

  // Iterate through all the children of the cssContainer and
  // extract the content of the :before pseudoelement
  Array.prototype.forEach.call(cssContainer.childNodes, function (cssDiv) {
    var className = cssDiv.className;
    var styleMap = window.getComputedStyle(cssDiv, ':before');
    var content = styleMap.getPropertyValue('content');
    // content is of the form '"c"' in all browsers except for safari where it's just 'c'
    var char = content.charAt(content.charAt(0) === '"' ? 1 : 0);
    var transform = styleMap.getPropertyValue('transform');
    // should be either 'none' or 'matrix(a, b, c, d, tx, ty)'
    var matrix;
    if (transform === 'none') {
      matrix = new Matrix();
    } else {
      var args = transform
        .match(/matrix\((.*)\)/)[1]
        .split(', ')
        .map((num) => Number(num));
      matrix = new Matrix(...args);
    }

    var iconStyle = { character: char, transform: matrix };
    iconStyles[className] = iconStyle;
    ToolkitUtils._ICON_CACHE[className] = iconStyle;
  });

  ToolkitUtils.removeChildElem(context.getContainer(), cssContainer);
  return iconStyles;
};

/**
 * Helper method that adds a class to a DOM element if it is not already added
 * @param {object} elem DOM element
 * @param {string} className
 */
ToolkitUtils.addClassName = function (elem, className) {
  if (elem && className) {
    if (ToolkitUtils.hasAttrNullNS(elem, 'class')) {
      var names = ToolkitUtils.getAttrNullNS(elem, 'class').split(' ');
      if (names.indexOf(className) == -1) {
        names.push(className);
        ToolkitUtils.setAttrNullNS(elem, 'class', names.join(' '));
      }
    } else {
      ToolkitUtils.setAttrNullNS(elem, 'class', className);
    }
  }
};

/**
 * Helper method that removes a class from DOM element if it exists
 * @param {object} elem DOM element
 * @param {string} className
 */
ToolkitUtils.removeClassName = function (elem, className) {
  if (elem && className) {
    if (ToolkitUtils.hasAttrNullNS(elem, 'class')) {
      var names = ToolkitUtils.getAttrNullNS(elem, 'class').split(' ');
      var index = names.indexOf(className);
      if (index >= 0) {
        names.splice(index, 1);
        ToolkitUtils.setAttrNullNS(elem, 'class', names.join(' '));
      }
    }
  }
};

/**
 * Gets 'grab' cursor if it's supported by a browser, otherwise returns 'move' cursor.
 * @return {String} 'grab' or 'move'
 */
ToolkitUtils.getGrabCursor = function () {
  return Agent.browser === 'ie' ? 'move' : 'grab';
};

/**
 * Gets 'grabbing' cursor if it's supported by a browser, otherwise returns 'move' cursor.
 * @return {String} 'grabbing' or 'move'
 */
ToolkitUtils.getGrabbingCursor = function () {
  return Agent.browser === 'ie' ? 'move' : 'grabbing';
};

/**
 * Cleans up the dataContext for drag events. Removes the component and componentElement properties
 * @param {object} context
 * @return {object}
 */
ToolkitUtils.cleanDragDataContext = function (context) {
  delete context.componentElement;
  delete context.component;
  return context;
};

/**
 * Extracts the value for the capture from the options passed
 * @param {object|boolean} options options for the event listener or a boolean to inidcate
 *                                 whether the listener operates in the capture phase
 * @returns {boolean} value for useCapture, false if none specified.
 */
ToolkitUtils.getUseCaptureFromOptions = function (options) {
  if (options == null) {
    return false;
  }
  if (typeof options === 'boolean') {
    return options;
  }
  return options['capture'] || false;
};

const DvtAnimationFrameUtils = {
  /**
   * Polyfill for requestAnimationFrame.
   * @param {function} callback The function that will be executed.
   * @return {number} A long integer value that uniquely identifies the entry in the callback list. This can be passed to
   *                  Context.cancelAnimationFrame to cancel the request.
   */
  requestAnimationFrame: function (callback) {
    // On android, requestAnimationFrame results causes the JS to wait until after the Rasterizer and GPU are
    // done, which can be slow. Using timeouts will allow the JS to execute concurrently.
    if (Agent.isTouchDevice() && Agent.browser === 'chrome') {
      return window.setTimeout(callback, 1000 / 60); // @HTMLUpdateOK
    }
    return window.requestAnimationFrame(callback);
  },

  /**
   * Polyfill for cancelAnimationFrame.
   * @param {number} requestId A long integer value that uniquely identifies the entry in the callback list.
   */
  cancelAnimationFrame: function (requestId) {
    if (Agent.isTouchDevice() && Agent.browser === 'chrome') clearTimeout(requestId);
    else window.cancelAnimationFrame(requestId);
  }
};

/**
 *  @class ClipPath
 *  Defines a clipping region composed of the union of one or more outlines.
 *  @param {String} prefix  An optional prefix for the clip path id.
 *  @constructor
 */
const ClipPath = function (prefix) {
  /** Id of the clip path. @type {String}  */
  this._id = (prefix ? prefix + '$' : '') + 'cp' + ClipPath._uniqueSeed++;
  /** the clipping outline  @type {Object}  */
  this._regions = [];
};

Obj.createSubclass(ClipPath, Obj);

ClipPath._uniqueSeed = 0;

//  Clipping path outlines

/**  @final  @type {number}  */
ClipPath.NONE = 0;

/**  @final  @type {number}  */
ClipPath.RECT = 1;

/**  @final  @type {number}  */
ClipPath.PATH = 2;

/**  @final  @type {number}  */
ClipPath.POLYGON = 3;

/**  @final  @type {number}  */
ClipPath.CIRCLE = 5;

/**
 *   Returns the ID of the clip path
 *   @return {String}  The ID of the clip path
 */

ClipPath.prototype.getId = function () {
  return this._id;
};

/**
 *   Returns a  clipping region outline object (by index).
 *   @type {Object}
 */

ClipPath.prototype.getRegions = function (idx) {
  return this._regions;
};

/**
 *  Adds a rectangular clipping region to the clip path.
 *  @param {number}  x   The top left x position of the rectangular region.
 *  @param {number}  y   The top left y position of the rectangular region.
 *  @param {number}  w   The width of the rectangular region.
 *  @param {number}  h   The height of the rectangular region.
 *  @param {number}  rx  Optional x-axis radius of the ellipse used to round off the cornders of the rectangle.
 *  @param {number}  ry  Optional y-axis radius of the ellipse used to round off the cornders of the rectangle.
 */
ClipPath.prototype.addRect = function (x, y, w, h, rx, ry) {
  var obj = {
    type: ClipPath.RECT,
    x: x,
    y: y,
    w: w,
    h: h,
    rx: rx,
    ry: ry
  };
  this._regions.push(obj);
};

/**
 *  Adds a circular clipping region to the clip path.
 *  @param {number}  cx  The x-axis coordinate of the center of the circle.
 *  @param {number}  cy  The y-axis coordinate of the center of the circle.
 *  @param {number}  r   The radius of the circle.
 */
ClipPath.prototype.addCircle = function (cx, cy, r) {
  var obj = {
    type: ClipPath.CIRCLE,
    cx: cx,
    cy: cy,
    r: r
  };
  this._regions.push(obj);
};

/**
 *  Adds a polygon clipping region to the clip path.
 *  @param {string}  points  The points that make up the polygon.
 */
ClipPath.prototype.addPolygon = function (points) {
  var obj = {
    type: ClipPath.POLYGON,
    points: points
  };
  this._regions.push(obj);
};

/**
 *  Adds a path clipping region to the clip path.
 *  @param {string}  d  Path data.
 */
ClipPath.prototype.addPath = function (d) {
  var obj = {
    type: ClipPath.PATH,
    d: d
  };
  this._regions.push(obj);
};

/**
 * Utilities for Arrays.
 * @class ArrayUtils
 */
const ArrayUtils = new Object();

Obj.createSubclass(ArrayUtils, Obj);

/**
 * Removes an item from the array if the item exists i the array
 * @param {array} array
 * @param {Object} item
 */
ArrayUtils.removeItem = function (array, item) {
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
};

/**
 * Inserts array2 in to array1 at the specified index
 * @param {array} array1 host array
 * @param {array} array2 array that contains items to be inserted
 * @param {number} index index where items should be added
 * @return {array} a new array that contains a result of insert oparation
 */
ArrayUtils.insert = function (array1, array2, index) {
  if (!Array.isArray(array1)) {
    return null;
  } else if (!Array.isArray(array2)) {
    return array1;
  }

  var retArray;
  if (index === 0) {
    retArray = array2.concat(array1);
  } else if (index > 0 && index < array1.length) {
    var tempArray = array1.splice(0, index);
    tempArray = tempArray.concat(array2);
    retArray = tempArray.concat(array1);
  } else {
    retArray = array1.concat(array2);
  }
  return retArray;
};

/**
 * Returns true if the two arrays have the same contents.
 * @param {array} a
 * @param {array} b
 */
ArrayUtils.equals = function (a, b) {
  if (!a && b) return false;
  else if (a && !b) return false;
  else if (!a && !b) return true;
  // a && b
  else {
    if (a.length != b.length) return false;

    // Compare the individual items
    for (var i = 0; i <= a.length; i++) {
      if (a[i] !== b[i]) return false;
    }

    // Everything matched, return true
    return true;
  }
};

/**
 * Returns true if the specified map has any of the specified array items.
 * @param {Object} map The boolean map within which to look for the items.
 * @param {array} items The array of items to look for.
 * @return {boolean}
 */
ArrayUtils.hasAnyMapItem = function (map, items) {
  // Return false if either array is empty
  if (!map || !items) return false;

  // Look for each of the items
  for (var i = 0; i < items.length; i++) {
    if (map[items[i]]) return true;
  }

  // No match found, return false
  return false;
};

/**
 * Returns true if the specified map has all of the specified array items.
 * @param {Object} map The boolean map within which to look for the items.
 * @param {array} items The array of items to look for.
 * @return {boolean}
 */
ArrayUtils.hasAllMapItems = function (map, items) {
  // Return true if the items array is empty
  if (!map || !items) return false;

  // Look for each of the items
  for (var i = 0; i < items.length; i++) {
    if (!map[items[i]]) return false;
  }

  // No missing items found, return true
  return true;
};

/**
 * Returns true if the specified array has any of the specified items.
 * @param {array} array The array within which to look for the items.
 * @param {array} items The array of items to look for.
 * @return {boolean}
 */
ArrayUtils.hasAnyItem = function (array, items) {
  return ArrayUtils.hasAnyMapItem(ArrayUtils.createBooleanMap(array), items);
};

/**
 * Returns true if the specified array has all of the specified items.
 * @param {array} array The array within which to look for the items.
 * @param {array} items The array of items to look for.
 * @return {boolean}
 */
ArrayUtils.hasAllItems = function (array, items) {
  return ArrayUtils.hasAllMapItems(ArrayUtils.createBooleanMap(array), items);
};

/**
 * Creates and returns a map whose keys are the items in the specified array. This map will return true if index by an
 * item in the array.
 * @param {array} array
 * @return {object}
 */
ArrayUtils.createBooleanMap = function (array) {
  if (!array) return null;

  var ret = {};
  for (var i = 0; i < array.length; i++) {
    ret[array[i]] = true;
  }
  return ret;
};

/**
 *   Creates an immutable gradient specification (shareable by other shapes).
 *   @extends {Obj}
 *   @class
 *   @constructor
 *   @param {Array} arColors  An array of color specifications (which do not include alpha values).
 *   @param {Array} arColors  An optional array of alpha values (between 0 and 1).  If omitted,
 *                            alphas of 1 are assumed.
 *   @param {Array} arStops   An optional array of stop boundary positions (between 0 and 1).
 *                            If omitted, an equal distribution of colors is assumed.
 *   @param {Array} arBounds  An optional bounding box array (x, y, w, h).
 */
const GradientFill = function (arColors, arAlphas, arStops, arBounds) {
  this.Init(arColors, arAlphas, arStops, arBounds);
};

Obj.createSubclass(GradientFill, Obj);

/**
 *   Returns an array of alpha's.
 *   @type {Array}
 */
GradientFill.prototype.getAlphas = function () {
  return this._arAlphas;
};

/**
 *   Returns the bounding box for the gradient as an array (x, y, w, h).
 *   @type {Array}
 */
GradientFill.prototype.getBounds = function () {
  return this._arBounds;
};

/**
 *   Returns an array of colors.
 *   @type {Array}
 */
GradientFill.prototype.getColors = function () {
  return this._arColors;
};

/**
 *   Returns an array of stop ratios.
 *   @type {Array}
 */
GradientFill.prototype.getStops = function () {
  return this._arStops;
};

/**
 *  @protected
 */
GradientFill.prototype.Init = function (arColors, arAlphas, arStops, arBounds) {
  if (!arAlphas) {
    arAlphas = [];
    if (arColors) {
      for (var i = 0; i < arColors.length; i++) {
        arAlphas.push(1);
      }
    }
  }

  var len = arColors ? arColors.length - 1 : 0;
  if (!arStops) {
    // if no stops, generate default stops
    // for a uniform distribution of colors.
    arStops = [];
    var incr = len > 0 ? 1 / len : 0;
    var curStop = 0;

    do {
      arStops.push(curStop);
      curStop += incr;
    } while (--len > 0);
    arStops.push(1);
  }

  this._arColors = arColors;
  this._arAlphas = arAlphas;
  this._arStops = arStops;
  this._arBounds = arBounds;
};

/**
 * @override
 */
GradientFill.prototype.equals = function (fill) {
  return (
    fill instanceof GradientFill &&
    ArrayUtils.equals(this.getColors(), fill.getColors()) &&
    ArrayUtils.equals(this.getStops(), fill.getStops()) &&
    ArrayUtils.equals(this.getAlphas(), fill.getAlphas()) &&
    ArrayUtils.equals(this.getBounds(), fill.getBounds())
  );
};

/*---------------------------------------------------------------------------*/
/*    DvtSvgGradientUtils    A static class for SVG gradient property manip- */
/*                           ulation.                                        */
/*---------------------------------------------------------------------------*/
/**
 *   DvtSvgGradientUtils    A static class for SVG gradient property manipulation.
 *   @class DvtSvgGradientUtils
 *   @constructor
 */
const DvtSvgGradientUtils = function () {};

Obj.createSubclass(DvtSvgGradientUtils, Obj);

/**
 *  Static method to create an SVG element and apply gradient properties to it.
 *  @param {dvt.GradientFill}  A dvt.GradientFill derivative to apply.
 */
DvtSvgGradientUtils.createElem = function (grad, id) {
  var elemGrad = document.createElementNS(ToolkitUtils.SVG_NS, 'linearGradient');
  ToolkitUtils.setAttrNullNS(elemGrad, 'id', id);

  var i;
  var arColors = grad.getColors();
  var arAlphas = grad.getAlphas();
  var arStops = grad.getStops();
  var arBounds = grad.getBounds();
  var len = arColors.length;

  for (i = 0; i < len; i++) {
    var elem = document.createElementNS(ToolkitUtils.SVG_NS, 'stop');
    /* eslint no-mixed-operators: 0 */
    ToolkitUtils.setAttrNullNS(elem, 'offset', '' + arStops[i] * 100 + '%');
    var color = arColors[i];
    if (color) {
      var alpha = arAlphas[i];
      ToolkitUtils.setAttrNullNS(elem, 'stop-color', color);
      if (alpha != null) ToolkitUtils.setAttrNullNS(elem, 'stop-opacity', alpha, 1);
    }
    ToolkitUtils.appendChildElem(elemGrad, elem);
  }

  //  If no gradient bounding box specified, will use the object's boundary box.

  var bUseObjBBox =
    !arBounds || (arBounds[0] == 0 && arBounds[1] == 0 && arBounds[2] == 0 && arBounds[3] == 0);

  //  The angle of rotation for SVG is clockwise, so must convert from the standard
  //  anti-clockwise convention used by the middle-tier xml. Rotation is
  //  at the mid-point of the bounding box.
  var angle = grad.getAngle();

  var x1 = '0%';
  var y1 = '0%';
  var x2 = '100%';
  var y2 = '0%';

  var setGradientVector = true;

  if (bUseObjBBox) {
    // Set gradient vector for gradientUnits = "objectBoundingBox"
    // (the default value for gradientUnits).

    if (angle === 45) {
      y1 = '100%';
      x2 = '100%';
    } else if (angle === 90) {
      y1 = '100%';
      x2 = '0%';
    } else if (angle === 135) {
      x1 = '100%';
      x2 = '0%';
      y2 = '100%';
    } else if (angle === 270) {
      x2 = '0%';
      y2 = '100%';
    } else if (angle !== 0) {
      angle = -angle;
      ToolkitUtils.setAttrNullNS(elemGrad, 'gradientTransform', 'rotate(' + angle + ' ' + '.5 .5)');
      setGradientVector = false; // no need to change the default gradient vector, since we are rotating the
      // gradient via gradientTransform
    }
  } else {
    //  Apply specified bounding box

    // use gradientUnits = "userSpaceOnUse"; for when we want to account for bounding box
    // first rotate the gradient by the specified angle
    // then scale this gradient to the width and bounds specifed in arBounds
    // then translate the gradient
    // note that if the width and height of the gradient are not equal, then the actual angle of the
    // gradient is different from the specified angle argument
    // However, this is the same behavior as how Flash processes the bounding box argument
    // Finally, note that in SVG, the order of transform operations is right to left

    ToolkitUtils.setAttrNullNS(elemGrad, 'gradientUnits', 'userSpaceOnUse');

    // set gradient vector to span the middle of the unit square
    x1 = '0';
    y1 = '0.5';
    x2 = '1';
    y2 = '0.5';

    var scaleX = arBounds[2];
    var scaleY = arBounds[3];
    var translateX = arBounds[0];
    var translateY = arBounds[1];

    angle = -angle;
    var rotateTransformStr = 'rotate(' + angle + ' ' + '.5 .5)';
    var scaleTransformStr = 'scale(' + scaleX + ' ' + scaleY + ')';
    var translateTransformStr = 'translate(' + translateX + ' ' + translateY + ')';
    var boundingBoxTransformStr = scaleTransformStr + ' ' + rotateTransformStr;

    if (translateX != 0 || translateY != 0) {
      boundingBoxTransformStr = translateTransformStr + ' ' + boundingBoxTransformStr;
    }

    // in the case of a bounding box, to set up the gradient, we need both gradientTransform and
    // a gradient vector centered in the unit square

    ToolkitUtils.setAttrNullNS(elemGrad, 'gradientTransform', boundingBoxTransformStr);
  }

  if (setGradientVector) {
    ToolkitUtils.setAttrNullNS(elemGrad, 'x1', x1);
    ToolkitUtils.setAttrNullNS(elemGrad, 'y1', y1);
    ToolkitUtils.setAttrNullNS(elemGrad, 'x2', x2);
    ToolkitUtils.setAttrNullNS(elemGrad, 'y2', y2);
  }
  return elemGrad;
};

/**
 *   Creates an immutable pattern specification (shareable by other shapes).
 *   @extends {Obj}
 *   @class
 *   @constructor
 *   @param {String} pattern  constant for the type of pattern
 *   @param {String} fillColor  color of the pattern
 *   @param {String} backgroundColor  background color of the pattern
 *   @param {dvt.Matrix} matrix  The matrix tansform to apply to this pattern.
 */
const PatternFill = function (pattern, fillColor, backgroundColor, matrix) {
  this._pattern = pattern ? PatternFill._convertPatternValue(pattern) : PatternFill.SM_DIAG_UP_LT;
  this._fillColor = fillColor ? fillColor : '#000000';
  this._backgroundColor = backgroundColor ? backgroundColor : '#ffffff';
  this._matrix = matrix;
};

Obj.createSubclass(PatternFill, Obj);

/**   @final @type {String}  */
PatternFill.SM_DIAG_UP_LT = 'sDUL';

/**   @final @type {String}  */
PatternFill.LG_DIAG_UP_LT = 'lDUL';

/**   @final @type {String}  */
PatternFill.SM_DIAG_UP_RT = 'sDUR';

/**   @final @type {String}  */
PatternFill.LG_DIAG_UP_RT = 'lDUR';

/**   @final @type {String}  */
PatternFill.SM_CROSSHATCH = 'sC';

/**   @final @type {String}  */
PatternFill.LG_CROSSHATCH = 'lC';

/**   @final @type {String}  */
PatternFill.SM_CHECK = 'sCh';

/**   @final @type {String}  */
PatternFill.LG_CHECK = 'lCh';

/**   @final @type {String}  */
PatternFill.SM_TRIANGLE_CHECK = 'sTCh';

/**   @final @type {String}  */
PatternFill.LG_TRIANGLE_CHECK = 'lTCh';

/**   @final @type {String}  */
PatternFill.SM_DIAMOND_CHECK = 'sDCh';

/**   @final @type {String}  */
PatternFill.LG_DIAMOND_CHECK = 'lDCh';

/**
 *   Returns the type of pattern
 *   @type {String}
 */
PatternFill.prototype.getPattern = function () {
  return this._pattern;
};

/**
 *   Returns the color of the pattern
 *   @type {String}
 */
PatternFill.prototype.getColor = function () {
  return this._fillColor;
};

/**
 *   Returns the background color of the pattern
 *   @type {String}
 */
PatternFill.prototype.getBackgroundColor = function () {
  return this._backgroundColor;
};

/**
 * @override
 */
PatternFill.prototype.equals = function (fill) {
  return (
    fill instanceof PatternFill &&
    fill.getPattern() == this.getPattern() &&
    fill.getColor() == this.getColor() &&
    fill.getBackgroundColor() == this.getBackgroundColor()
  );
};

/**
 * Return the transformation matrix applied to this container.
 *  @type {dvt.Matrix}
 *  @return transformation matrix
 */
PatternFill.prototype.getMatrix = function () {
  return this._matrix || new Matrix();
};

/**
 * Returns the pattern constant given the API string name for the pattern.  Returns the unmodified string if the value
 * is already a predefined constant or if it's not recognized.
 * @return {string}
 * @private
 */
PatternFill._convertPatternValue = function (patternStr) {
  if (patternStr == 'smallDiagonalLeft') return PatternFill.SM_DIAG_UP_LT;
  else if (patternStr == 'largeDiagonalLeft') return PatternFill.LG_DIAG_UP_LT;
  else if (patternStr == 'smallDiagonalRight') return PatternFill.SM_DIAG_UP_RT;
  else if (patternStr == 'largeDiagonalRight') return PatternFill.LG_DIAG_UP_RT;
  else if (patternStr == 'smallCrosshatch') return PatternFill.SM_CROSSHATCH;
  else if (patternStr == 'largeCrosshatch') return PatternFill.LG_CROSSHATCH;
  else if (patternStr == 'smallChecker') return PatternFill.SM_CHECK;
  else if (patternStr == 'largeChecker') return PatternFill.LG_CHECK;
  else if (patternStr == 'smallTriangle') return PatternFill.SM_TRIANGLE_CHECK;
  else if (patternStr == 'largeTriangle') return PatternFill.LG_TRIANGLE_CHECK;
  else if (patternStr == 'smallDiamond') return PatternFill.SM_DIAMOND_CHECK;
  else if (patternStr == 'largeDiamond') return PatternFill.LG_DIAMOND_CHECK;
  else return patternStr;
};

/**
 * LRU cache implementation for use in improving performance.  Alternate cache implementation options may be added in
 * the future as needed.
 * @param {number} targetSize The target size of the cache. Once populated, this is the minimum size of the cache.
 * @class Cache
 * @extends {dvt.Obj}
 * @constructor
 */
const Cache = function (targetSize) {
  this.Init(targetSize);
};

Obj.createSubclass(Cache, Obj);

/**
 * The default target size of the cache.
 * @private
 */
Cache._TARGET_SIZE = 1000;

/**
 * The overflow allowed in cache size before a removal of old keys is performed.
 * @private
 */
Cache._BUFFER_SIZE = 0.5;

/**
 * Initializes the cache and its underlying data structures.
 * @param {number} targetSize The target size of the cache. Once populated, this is the minimum size of the cache.
 */
Cache.prototype.Init = function (targetSize) {
  this._targetSize = targetSize != null ? targetSize : Cache._TARGET_SIZE;
  this._maxSize = Math.ceil(this._targetSize * (1 + Cache._BUFFER_SIZE));

  // Initialize the cache and array of keys, where the first key is the least recently used.
  this._cache = {};
  this._lruArray = [];

  // Initialize debug params for cache tuning
  this._hits = 0;
  this._misses = 0;
};

/**
 * Retrieves the value corresponding to the key from the cache.  If the key cannot be found in the cache, returns null.
 * @param {object} key
 * @return {object}
 */
Cache.prototype.get = function (key) {
  var ret = this._cache[key];
  if (ret != null) {
    this._hits++;
    return ret;
  } else {
    this._misses++;
    return null;
  }
};

/**
 * Stores the value corresponding to the key in the cache.  If the cache has reached the maximum size, then the least
 * recently used key will be removed from the cache.
 * @param {object} key
 * @param {object} value
 */
Cache.prototype.put = function (key, value) {
  // Optimize the cache update based on whether the key already existed in the cache
  var bKeyExists = this._cache[key] != null;

  // Update the cache first
  this._cache[key] = value;

  // Update the array tracking recently used items
  if (bKeyExists) {
    // Already exists, remove before we add to the end of the list
    var keyIndex = this._lruArray.indexOf(key);
    this._lruArray.splice(keyIndex, 1);
    this._lruArray.push(key);
  } else {
    // Doesn't exist already, add to the array.  This indicates the cache size has increased.
    this._lruArray.push(key);

    // If the cache size exceeds the max length, then remove the least recently used items.
    if (this._lruArray.length > this._maxSize) {
      var removedKeys = this._lruArray.splice(0, this._maxSize - this._targetSize);
      for (var i = 0; i < removedKeys.length; i++) {
        delete this._cache[removedKeys[i]];
      }
    }
  }
};

/**
 * @override
 */
Cache.prototype.toString = function () {
  // Returns a variety of tuning information
  var ret = 'Cache Size: ' + this._lruArray.length;
  ret += '\nHits: ' + this._hits;
  ret += '\nMisses: ' + this._misses;
  ret += '\nHit %: ' + Math.round((10000 * this._hits) / (this._hits + this._misses)) / 100;
  return ret;
};

/**
 * Defines miscellaneous math constants and utilities.
 * @class Math
 */
const DvtMath = new Object();

Obj.createSubclass(DvtMath, Obj);

/**
 *  Number of radians in 1 degree.
 *  @type {number}
 *  @const
 */
DvtMath.RADS_PER_DEGREE = Math.PI / 180;

/**
 *  Number of degrees in 1 radian.
 *  @type {number}
 *  @const
 */
DvtMath.DEGREES_PER_RAD = 180 / Math.PI;

/**
 *  Twice value of Pi radians.
 *  @type {number}
 *  @const
 */
DvtMath.TWO_PI = Math.PI * 2;

/**
 *  Half the value of Pi radians.
 *  @type {number}
 *  @const
 */
DvtMath.HALF_PI = Math.PI / 2;

/**
 *  One quarter the value of Pi radians.
 *  @type {number}
 *  @const
 */
DvtMath.QUARTER_PI = Math.PI / 4;

/**
 *  Fudge factor deal with floating point rounding error
 *  @type {number}
 *  @const
 */
DvtMath.TOLERANCE = 0.1;

/**
 * Converts degrees to radians.
 * @param {number} deg The value in degrees to be converted.
 * @return {number}
 */
DvtMath.degreesToRads = function (deg) {
  return deg * DvtMath.RADS_PER_DEGREE;
};

/**
 * Converts radians to degrees.
 * @param {number} rad The value in radians to be converted.
 * @return {number}
 */
DvtMath.radsToDegrees = function (rad) {
  return rad * DvtMath.DEGREES_PER_RAD;
};

/**
 * Interpolate a number between the original and destination values for the given percent.
 * @param {number} origVal The original value
 * @param {number} destVal The destination value
 * @param {number} percent The percent value to interpolate
 * @return {number}
 */
DvtMath.interpolateNumber = function (origVal, destVal, percent) {
  return origVal + percent * (destVal - origVal);
};

/**
 * Returns the log base 10 of the value.
 * @param {number} value
 * @return {number}
 */
DvtMath.log10 = function (value) {
  return Math.log(value) / Math.LN10;
};

/**
 * Returns the angle in radians between two vectors
 * @param {number} vector1X
 * @param {number} vector1Y
 * @param {number} vector2X
 * @param {number} vector2Y
 * @return {number} angle in radians
 */
DvtMath.calculateAngleBetweenTwoVectors = function (vector1X, vector1Y, vector2X, vector2Y) {
  var angle = Math.atan2(vector2Y, vector2X) - Math.atan2(vector1Y, vector1X);
  return angle < 0 ? angle + DvtMath.TWO_PI : angle;
};

/*-------------------------------------------------------------------------*/
/*   ColorUtils       A static class for css color manipulation         */
/*-------------------------------------------------------------------------*/
/*   The static utility functions operate on color specifications of the   */
/*   format #rrggbb, or rgb(r,g,b), or rgba(r,g,b,a).                      */
/*-------------------------------------------------------------------------*/
/**  Static utility functions that operate on color specification strings of the
 *  format #rrggbb, or rgb(r,g,b), or rgba(r,g,b,a).
 *  @base ColorUtils
 */
const ColorUtils = {};

Obj.createSubclass(ColorUtils, Obj);

//  Channel definition constants

ColorUtils._RED = 0; // Channels. Don't change
ColorUtils._GREEN = 1; // defs unless the routines
ColorUtils._BLUE = 2; // below are changed.
ColorUtils._ALPHA = 3;

//  private constants

ColorUtils._RGBA = 'rgba(';
ColorUtils._RGB = 'rgb(';
ColorUtils._POUND = '#';

ColorUtils._FACTOR = 0.15; // default darkening percentage.

/** @private */
ColorUtils._names; // associative array

/**
 * Cache for getContrastingTextColor() to prevent repeated computations.
 * @private
 */
ColorUtils._CONTRASTING_TEXT_COLOR_CACHE = {};

/*-------------------------------------------------------------------------*/
/*  getColorFromName()                                                     */
/*-------------------------------------------------------------------------*/
/**
 * Returns a color definition string from the named color.
 * @param {String}  name  The color name.
 * @type {String}
 * @return  An #rrggbb color string.
 */
ColorUtils.getColorFromName = function (name) {
  if (!ColorUtils._names) {
    var ar = {};
    ar['aliceblue'] = '#f0f8ff';
    ar['antiquewhite'] = '#faEbd7';
    ar['aqua'] = '#00ffff';
    ar['aquamarine'] = '#7fffd4';
    ar['azure'] = '#f0ffff';
    ar['beige'] = '#f5f5dc';
    ar['bisque'] = '#ffE4c4';
    ar['black'] = '#000000';
    ar['blanchedalmond'] = '#ffEbcd';
    ar['blue'] = '#0000ff';
    ar['blueviolet'] = '#8a2bE2';
    ar['brown'] = '#a52a2a';
    ar['burlywood'] = '#dEb887';
    ar['cadetblue'] = '#5f9Ea0';
    ar['chartreuse'] = '#7fff00';
    ar['chocolate'] = '#d2691E';
    ar['coral'] = '#ff7f50';
    ar['cornflowerblue'] = '#6495Ed';
    ar['cornsilk'] = '#fff8dc';
    ar['crimson'] = '#dc143c';
    ar['cyan'] = '#00ffff';
    ar['darkblue'] = '#00008b';
    ar['darkcyan'] = '#008b8b';
    ar['darkgoldenrod'] = '#b8860b';
    ar['darkgray'] = '#a9a9a9';
    ar['darkgreen'] = '#006400';
    ar['darkkhaki'] = '#bdb76b';
    ar['darkmagenta'] = '#8b008b';
    ar['darkolivegreen'] = '#556b2f';
    ar['darkorange'] = '#ff8c00';
    ar['darkorchid'] = '#9932cc';
    ar['darkred'] = '#8b0000';
    ar['darksalmon'] = '#E9967a';
    ar['darkseagreen'] = '#8fbc8f';
    ar['darkslateblue'] = '#483d8b';
    ar['darkslategray'] = '#2f4f4f';
    ar['darkturquoise'] = '#00cEd1';
    ar['darkviolet'] = '#9400d3';
    ar['deeppink'] = '#ff1493';
    ar['deepskyblue'] = '#00bfff';
    ar['dimgray'] = '#696969';
    ar['dodgerblue'] = '#1E90ff';
    ar['firebrick'] = '#b22222';
    ar['floralwhite'] = '#fffaf0';
    ar['forestgreen'] = '#228b22';
    ar['fuchsia'] = '#ff00ff';
    ar['gainsboro'] = '#dcdcdc';
    ar['ghostwhite'] = '#f8f8ff';
    ar['gold'] = '#ffd700';
    ar['goldenrod'] = '#daa520';
    ar['gray'] = '#808080';
    ar['green'] = '#008000';
    ar['greenyellow'] = '#adff2f';
    ar['honeydew'] = '#f0fff0';
    ar['hotpink'] = '#ff69b4';
    ar['indianred '] = '#cd5c5c';
    ar['indigo '] = '#4b0082';
    ar['ivory'] = '#fffff0';
    ar['khaki'] = '#f0E68c';
    ar['lavender'] = '#E6E6fa';
    ar['lavenderblush'] = '#fff0f5';
    ar['lawngreen'] = '#7cfc00';
    ar['lemonchiffon'] = '#fffacd';
    ar['lightblue'] = '#add8E6';
    ar['lightcoral'] = '#f08080';
    ar['lightcyan'] = '#E0ffff';
    ar['lightgoldenrodyellow'] = '#fafad2';
    ar['lightgray'] = '#d3d3d3';
    ar['lightgreen'] = '#90EE90';
    ar['lightpink'] = '#ffb6c1';
    ar['lightsalmon'] = '#ffa07a';
    ar['lightseagreen'] = '#20b2aa';
    ar['lightskyblue'] = '#87cEfa';
    ar['lightslategray'] = '#778899';
    ar['lightsteelblue'] = '#b0c4dE';
    ar['lightyellow'] = '#ffffE0';
    ar['lime'] = '#00ff00';
    ar['limegreen'] = '#32cd32';
    ar['linen'] = '#faf0E6';
    ar['magenta'] = '#ff00ff';
    ar['maroon'] = '#800000';
    ar['mediumaquamarine'] = '#66cdaa';
    ar['mediumblue'] = '#0000cd';
    ar['mediumorchid'] = '#ba55d3';
    ar['mediumpurple'] = '#9370db';
    ar['mediumseagreen'] = '#3cb371';
    ar['mediumslateblue'] = '#7b68EE';
    ar['mediumspringgreen'] = '#00fa9a';
    ar['mediumturquoise'] = '#48d1cc';
    ar['mediumvioletred'] = '#c71585';
    ar['midnightblue'] = '#191970';
    ar['mintcream'] = '#f5fffa';
    ar['mistyrose'] = '#ffE4E1';
    ar['moccasin'] = '#ffE4b5';
    ar['navajowhite'] = '#ffdEad';
    ar['navy'] = '#000080';
    ar['oldlace'] = '#fdf5E6';
    ar['olive'] = '#808000';
    ar['olivedrab'] = '#6b8E23';
    ar['orange'] = '#ffa500';
    ar['orangered'] = '#ff4500';
    ar['orchid'] = '#da70d6';
    ar['palegoldenrod'] = '#EEE8aa';
    ar['palegreen'] = '#98fb98';
    ar['paleturquoise'] = '#afEEEE';
    ar['palevioletred'] = '#db7093';
    ar['papayawhip'] = '#ffEfd5';
    ar['peachpuff'] = '#ffdab9';
    ar['peru'] = '#cd853f';
    ar['pink'] = '#ffc0cb';
    ar['plum'] = '#dda0dd';
    ar['powderblue'] = '#b0E0E6';
    ar['purple'] = '#800080';
    ar['rebeccapurple'] = '#663399';
    ar['red'] = '#ff0000';
    ar['rosybrown'] = '#bc8f8f';
    ar['royalblue'] = '#4169E1';
    ar['saddlebrown'] = '#8b4513';
    ar['salmon'] = '#fa8072';
    ar['sandybrown'] = '#f4a460';
    ar['seagreen'] = '#2E8b57';
    ar['seashell'] = '#fff5EE';
    ar['sienna'] = '#a0522d';
    ar['silver'] = '#c0c0c0';
    ar['skyblue'] = '#87cEEb';
    ar['slateblue'] = '#6a5acd';
    ar['slategray'] = '#708090';
    ar['snow'] = '#fffafa';
    ar['springgreen'] = '#00ff7f';
    ar['steelblue'] = '#4682b4';
    ar['tan'] = '#d2b48c';
    ar['teal'] = '#008080';
    ar['thistle'] = '#d8bfd8';
    ar['tomato'] = '#ff6347';
    ar['turquoise'] = '#40E0d0';
    ar['violet'] = '#EE82EE';
    ar['wheat'] = '#f5dEb3';
    ar['white'] = '#ffffff';
    ar['whitesmoke'] = '#f5f5f5';
    ar['yellow'] = '#ffff00';
    ar['yellowgreen'] = '#9acd32';

    ar['transparent'] = 'rgba(255,255,255,0)';

    ColorUtils._names = ar;
  }
  return ColorUtils._names[name.toLowerCase()];
};

/*-------------------------------------------------------------------------*/
/*   getChannel()     Returns a channel from a #, rgb or rgba string.      */
/*                    (Note: if an alpha channel is requested and a # or   */
/*                    rgb string is supplied, the implied value of 1 is    */
/*                    returned.                                            */
/*-------------------------------------------------------------------------*/
/**
 *  Returns a specifed channel value from a css color specification (#, rgb(), rgba()).
 *  If an alpha channel is requested and a # or rgb string is supplied,
 *  an implied value of 1 is returned.
 *  @private
 *  @param  {number} chan  The channel (see {@ColorUtils#_RED} for example).
 *  @param  {String} c  The color string.
 *  @type {number}
 *  @return The channel value as a decimal number (between 0 and 255).
 */
ColorUtils._getChannel = function (chan, c) {
  var clr = c;
  var chval = null; // the return value

  // If clr is a named color, then convert into usable format
  var namedColor = ColorUtils.getColorFromName(clr);
  if (namedColor) clr = namedColor;

  // Alpha support
  if (chan === ColorUtils._ALPHA) {
    if (clr.charAt(0) === '#') return clr.length > 7 ? parseInt(clr.substring(1, 3), 16) / 255 : 1;
    //check for MT extended format of #aarrggbb
    else if (clr === 'none') return 0;
  }

  var x1 = clr.indexOf('(');
  var ar;
  if (x1 < 0) {
    ar = [];
    //: parse channels for different # formats
    if (clr.length > 7) {
      //  #aarrggbb format
      ar[0] = parseInt(clr.substr(3, 2), 16);
      ar[1] = parseInt(clr.substr(5, 2), 16);
      ar[2] = parseInt(clr.substr(7, 2), 16);
      ar[3] = parseInt(clr.substr(1, 2), 16) / 255;
    } else {
      //  #rrggbb format
      ar[0] = parseInt(clr.substr(1, 2), 16);
      ar[1] = parseInt(clr.substr(3, 2), 16);
      ar[2] = parseInt(clr.substr(5, 2), 16);
      ar[3] = 1;
    }
    chval = ar[chan];
  } else {
    //  rgb() or rgba() format
    ar = clr.substring(x1 + 1).match(/[^,|)]+/gm);

    if (ar.length === 3 && chan === ColorUtils._ALPHA) {
      chval = 1;
    } else chval = parseFloat(ar[chan]);
  }

  return chval;
};

/**
 * Returns the specified color made darker by the specified percentage.
 * @param {string} color   A color specification.
 * @param {number} factor  An optional percentage by which each color component is to be
 *                         darkened (0 returns unchanged) specified as a decimal
 *                         (e.g. 25% = 0.25).  If omitted, a default percentage of
 *                         15% (i.e 0.15) is applied.
 * @return {string} A darkened color specification in RGBA format.
 */
ColorUtils.getDarker = function (color, factor) {
  var r = ColorUtils.getRed(color);
  var g = ColorUtils.getGreen(color);
  var b = ColorUtils.getBlue(color);
  var a = ColorUtils.getAlpha(color);

  if (!factor) {
    factor = ColorUtils._FACTOR; // use default factor
  }

  r = Math.max(parseInt(r * (1 - factor)), 0);
  g = Math.max(parseInt(g * (1 - factor)), 0);
  b = Math.max(parseInt(b * (1 - factor)), 0);

  return ColorUtils.makeRGBA(r, g, b, a);
};

/**
 * Returns a brighter color using the supplied color based on a percentage factor.
 * @param {string} color  A color specification.
 * @param {number} factor An optional percentage by which the color is to be brightened (0 returns unchanged)
 *                        specified as a decimal (e.g., 25% = 0.25).  If omitted, the default percentage of
 *                        15% (i.e., 0.15) is applied.
 * @return {string} A brightened color specification in RGBA format.
 */
ColorUtils.getBrighter = function (color, factor) {
  var a = ColorUtils.getAlpha(color);
  var r = ColorUtils.getRed(color);
  var g = ColorUtils.getGreen(color);
  var b = ColorUtils.getBlue(color);

  if (!factor) {
    factor = ColorUtils._FACTOR; // use default factor
  }

  var gR = Math.min(r + parseInt((255 - r) * factor), 255);
  var gG = Math.min(g + parseInt((255 - g) * factor), 255);
  var gB = Math.min(b + parseInt((255 - b) * factor), 255);

  return ColorUtils.makeRGBA(gR, gG, gB, a);
};

/*-------------------------------------------------------------------------*/
/*   makeRGB()                                                             */
/*-------------------------------------------------------------------------*/
/**
 *  Creates an rgb(...) format from the supplied red, green, blue channel values.
 *  @param {number} r  The red value as a decimal number in the range 0 - 255.
 *  @param {number} g  The green value as a decimal number in the range 0 - 255.
 *  @param {number} b  The blue value as a decimal number in the range 0 - 255.
 *  @type {String}
 *  @return A new rgb(. . .) format string.
 */
ColorUtils.makeRGB = function (r, g, b) {
  b = b === null || isNaN(b) ? 0 : b;
  g = g === null || isNaN(g) ? 0 : g;
  r = r === null || isNaN(r) ? 0 : r;

  return ColorUtils._RGB + r + ',' + g + ',' + b + ')';
};

/*-------------------------------------------------------------------------*/
/*   makeRGBA()                                                            */
/*-------------------------------------------------------------------------*/
/**
 *  Creates an rgba(...) format string using the supplied red, green, blue,
 *   and alpha channel values.
 *  @param {number} r  The red value as a decimal number in the range 0 - 255.
 *  @param {number} g  The green value as a decimal number in the range 0 - 255.
 *  @param {number} b  The blue value as a decimal number in the range 0 - 255.
 *  @param {number} a  The alpha value as a decimal number in the range 0 - 1.
 *                  If omitted, 1 is assumed.
 *  @type {String}
 *  @return A new rgba(. . .) format string.
 */
ColorUtils.makeRGBA = function (r, g, b, a) {
  b = b === null || isNaN(b) ? 0 : Math.round(b);
  g = g === null || isNaN(g) ? 0 : Math.round(g);
  r = r === null || isNaN(r) ? 0 : Math.round(r);
  a = a === null || isNaN(a) ? 1 : a;

  return ColorUtils._RGBA + r + ',' + g + ',' + b + ',' + a + ')';
};

/*-------------------------------------------------------------------------*/
/*   makePound()                                                           */
/*-------------------------------------------------------------------------*/
/**
 *  Creates a #rrggbb format string using the supplied red, green and blue
 *  channel values.
 *  @param {number} r  The red value as a decimal number in the range 0 - 255.
 *  @param {number} g  The green value as a decimal number in the range 0 - 255.
 *  @param {number} b  The blue value as a decimal number in the range 0 - 255.
 *  @type {String}
 *  @return A new #rrggbb format string.
 */
ColorUtils.makePound = function (r, g, b) {
  var rr = Math.round(r);
  var gg = Math.round(g);
  var bb = Math.round(b);
  var red = rr.toString(16);
  var green = gg.toString(16);
  var blue = bb.toString(16);

  return (
    '#' +
    (red.length === 1 ? '0' : '') +
    red +
    (green.length === 1 ? '0' : '') +
    green +
    (blue.length === 1 ? '0' : '') +
    blue
  );
};

/*-------------------------------------------------------------------------*/
/*   getPound()  Returns a "#rrggbb" string from a color string            */
/*              specification such as #rr[gg[bb[aa]]], rgba(...), rgb(...) */
/*-------------------------------------------------------------------------*/
/**
 *   Returns a "#rrggbb"  color string from the supplied color string. Formats
 *   accepted are the extended middle-tier "#aarrggbb" string, "rgba(r,g,b,a)",
 *   or an "rgb(r,g,b)". If a "#rrggbb" is supplied, the same object will be
 *   returned.  (See also {@link ColorUtils#makePound}.)
 *   @param {String} s  A color string specification.
 *   @return {String}  a string of the format "#rrggbb".
 */
ColorUtils.getPound = function (s) {
  var ret;

  if (s.charAt(0) === '#') {
    var len = s.length;

    if (len <= 7) {
      return s;
    } else {
      // alpha specified (#aarrggbb) - middle-tier extended format
      ret = ColorUtils._POUND;
      ret += s.substring(3, 5) + s.substring(5, 7) + s.substring(7, 9);
    }
  } else {
    var r = ColorUtils.getRed(s);
    var g = ColorUtils.getGreen(s);
    var b = ColorUtils.getBlue(s);
    ret = ColorUtils.makePound(r, g, b);
  }

  return ret;
};

/*-------------------------------------------------------------------------*/
/*   getRGB()   Returns an rgb(rr,gg,bb) string from a color string        */
/*              specification such as #rr[gg[bb[aa]]], rgba(...), rgb(...) */
/*-------------------------------------------------------------------------*/
/**
 *   Returns an "rgb(r,g,b)"  color string from a supplied "#rrggbb" or
 *   extended middle-tier "#aarrggbb" string, or an rgb(r,g,b,a).
 *   If an "rgb(r,g,b)" is supplied, the same object will be returned.  (See also {@link ColorUtils#makePound}.)
 *   @param {String} s  A color string specification.
 *   @type {String.}
 */
ColorUtils.getRGB = function (s) {
  var ret;

  // If clr is a named color, then convert into usable format
  var namedColor = ColorUtils.getColorFromName(s);
  if (namedColor) s = namedColor;

  if (s.charAt(0) === '#') {
    ret = ColorUtils._RGB;

    var len = s.length;

    if (len > 7) {
      // alpha specified (#aarrggbb) - middle-tier extended format
      ret +=
        parseInt(s.substring(3, 5), 16) +
        ',' +
        parseInt(s.substring(5, 7), 16) +
        ',' +
        parseInt(s.substring(7, 9), 16);
    } else if (len === 7) {
      // alpha not specified (#rrggbb)
      ret +=
        parseInt(s.substring(1, 3), 16) +
        ',' +
        parseInt(s.substring(3, 5), 16) +
        ',' +
        parseInt(s.substr(5), 16);
    } else if (len === 4) {
      // #rgb
      var r = s.substring(1, 2);
      r += r;
      var g = s.substring(2, 3);
      g += g;
      var b = s.substring(3);
      b += b;

      ret += parseInt(r, 16) + ',' + parseInt(g, 16) + ',' + parseInt(b, 16);
    } else if (len === 5) {
      // #rrgg
      ret += parseInt(s.substring(1, 3), 16) + ',' + parseInt(s.substring(3, 5), 16) + ',0,1';
    } else if (len === 3) {
      // #rr
      ret += parseInt(s.substring(1, 3), 16) + ',0,0,1';
    }

    ret += ')';
  } else if (s.substr(0, 5) === ColorUtils._RGBA) {
    var x = s.lastIndexOf(',');
    ret = ColorUtils._RGB;
    ret += s.substring(5, x);
    ret += ')';
  } else {
    ret = s;
  }
  return ret;
};

/*-------------------------------------------------------------------------*/
/*   getRGBA()  Returns an rgba(rr,gg,bb,aa) string from a color string    */
/*              specification such as #rr[gg[bb[aa]]], rgb(...), rgba(...) */
/*-------------------------------------------------------------------------*/
/**
 *   Returns an "rgba(r,g,b,a)"  color string from a supplied "#rrggbb" or
 *   extended middle-tier "#aarrggbb" string.  Will also accept an rgb(r,g,b)
 *   string (in which case the implied alpha is 1).  If an "rgba(r,g,b,a)" is
 *   supplied, the same object will be returned.  (See also {@link ColorUtils#makePound}.)
 *   @param {String} s  A color string specification.
 *   @type {String.}
 */
ColorUtils.getRGBA = function (s) {
  var ret;

  // If clr is a named color, then convert into usable format
  var namedColor = ColorUtils.getColorFromName(s);
  if (namedColor) s = namedColor;

  if (s.charAt(0) === '#') {
    ret = ColorUtils._RGBA;

    var len = s.length;

    if (len > 7) {
      // alpha specified (#aarrggbb)
      ret +=
        parseInt(s.substring(3, 5), 16) +
        ',' +
        parseInt(s.substring(5, 7), 16) +
        ',' +
        parseInt(s.substring(7, 9), 16) +
        ',' +
        parseInt(s.substring(1, 3), 16) / 255;
    } else if (len === 7) {
      // alpha not specified (#rrggbb)  - alpha of 1 is assumed
      ret +=
        parseInt(s.substring(1, 3), 16) +
        ',' +
        parseInt(s.substring(3, 5), 16) +
        ',' +
        parseInt(s.substr(5), 16) +
        ',1';
    } else if (len === 5) {
      // #rrgg
      ret += parseInt(s.substring(1, 3), 16) + ',' + parseInt(s.substring(3, 5), 16) + ',0,1';
    } else if (len === 4) {
      // #rgb
      var r = s.substring(1, 2);
      r += r;
      var g = s.substring(2, 3);
      g += g;
      var b = s.substring(3);
      b += b;

      ret += parseInt(r, 16) + ',' + parseInt(g, 16) + ',' + parseInt(b, 16) + ',1';
    } else if (len === 3) {
      // #rr
      ret += parseInt(s.substring(1, 3), 16) + ',0,0,1';
    }

    ret += ')';
  } else if (s.substr(0, 4) === ColorUtils._RGB) {
    ret = ColorUtils._RGBA;
    ret += s.substring(4, s.length - 1) + ',1)';
  } else {
    ret = s;
  }
  return ret;
};

/*-------------------------------------------------------------------------*/
/*  _setChannel()     Replaces a channel in an rgb or rgba string.  (Note: */
/*                    if an alpha channel is added and an rgb string was   */
/*                    supplied, the string is changed to an rgba string.)  */
/*-------------------------------------------------------------------------*/
/**
 *  Returns a new color String with the specifed channel value set.
 *  If an alpha channel is requested and a # or rgb string is supplied,
 *  an rgba(...) string is returned.
 *  @private
 *  @param {number} chan  The channel to be changed.
 *  @param {String} s     A color specification to be changed.
 *  @param {number} chval The new channel value (as a decimal number).
 *  @type {String}
 */
ColorUtils._setChannel = function (chan, s, chval) {
  if (
    chan === undefined ||
    chval === undefined ||
    chan < ColorUtils._RED ||
    chan > ColorUtils._ALPHA
  ) {
    return s;
  }

  // If named color, then convert into usable format
  var namedColor = ColorUtils.getColorFromName(s);
  if (namedColor) s = namedColor;

  var ar;
  var bPound = s.charAt(0) === '#';
  var bRGBA;
  var ret;
  if (bPound) {
    ar = [];
    ar.push(parseInt(s.substr(1, 2), 16));
    ar.push(parseInt(s.substr(3, 2), 16));
    ar.push(parseInt(s.substr(5, 2), 16));
    if (chan === ColorUtils._ALPHA) {
      ar.push(chval);
      bPound = false;
      bRGBA = true;
    }
  } else {
    bRGBA = s.substr(0, 5) === ColorUtils._RGBA;
    var x1 = s.indexOf('(');
    var x2 = s.indexOf(')');
    ar = s.substring(x1 + 1, x2).split(',');

    if (!bRGBA && chan === ColorUtils._ALPHA) {
      ar.push(chval);
      bRGBA = true;
    }
  }

  ar[chan] = chval;

  if (bPound) {
    ret = ColorUtils.makePound(ar[0], ar[1], ar[2]);
  } else {
    ret = bRGBA
      ? ColorUtils.makeRGBA(ar[0], ar[1], ar[2], ar[3])
      : ColorUtils.makeRGB(ar[0], ar[1], ar[2]);
  }
  return ret;
};

// Create setters and getters for Red, Blue, Green and Alpha channels
var props = ['Red', 'Green', 'Blue', 'Alpha'];
props.forEach(function (prop) {
  ColorUtils['get' + prop] = ColorUtils._getChannel.bind(
    null,
    ColorUtils['_' + prop.toUpperCase()]
  );
  ColorUtils['set' + prop] = ColorUtils._setChannel.bind(
    null,
    ColorUtils['_' + prop.toUpperCase()]
  );
});

/**
 * Returns the hsl values for a color with the given rgb.
 * @param {number} r The r value, on a scale from 0 to 255
 * @param {number} g The g value, on a scale from 0 to 255
 * @param {number} b The b value, on a scale from 0 to 255
 * @return {object} The object containing the h, s, and l fields.  The h field is on a scale from 0 to 360, and the s
 *                  and l fields are on a scale from 0 to 1.
 */
ColorUtils.rgb2hsl = function (r, g, b) {
  // Scale rgb to be from 0 to 1
  r /= 255;
  g /= 255;
  b /= 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var sum = max + min;

  var h, s;
  var l = sum / 2;

  if (max == min) {
    h = 0;
    s = 0;
  } else {
    var diff = max - min;
    s = l > 0.5 ? diff / (2 - sum) : diff / sum;

    if (max == r) h = (g - b) / diff + (g < b ? 6 : 0);
    else if (max == g) h = (b - r) / diff + 2;
    else if (max == b) h = (r - g) / diff + 4;
    else h = 0;
    h /= 6;
  }

  return { h: h * 360, s: s, l: l };
};

/**
 * Returns the rgb values for a color with the given hsl.
 * @param {number} h The h value, on a scale from 0 to 360
 * @param {number} s The s value, on a scale from 0 to 1
 * @param {number} l The l value, on a scale from 0 to 1
 * @return {object} The object containing the r, g, and b fields on a scale from 0 to 255.
 */
ColorUtils.hsl2rgb = function (h, s, l) {
  // Scale h to be from 0 to 1
  h /= 360;

  var r, g, b;
  if (s == 0) r = g = b = l;
  else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = ColorUtils._hue2rgb(p, q, h + 1 / 3);
    g = ColorUtils._hue2rgb(p, q, h);
    b = ColorUtils._hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
};

/**
 * @private
 */
ColorUtils._hue2rgb = function (p, q, t) {
  if (t < 0) t += 1;
  else if (t > 1) t -= 1;

  if (t < 1 / 6) return p + (q - p) * 6 * t;
  else if (t < 1 / 2) return q;
  else if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  else return p;
};

/**
 * Returns a color whose lightness has been adjusted by the specified amount.
 * @param {string} color The original color.
 * @param {number} dh The change in hue.
 * @param {number} ds The change in saturation.
 * @param {number} dl The change in lightness.
 * @return {string} The adjusted color.
 */
ColorUtils.adjustHSL = function (color, dh, ds, dl) {
  // Cache the adjusted values for performance.
  if (!ColorUtils._hslCache) ColorUtils._hslCache = new Cache(100);

  // Create the key and look for the cache entry.
  var key = color + ':' + dh + ':' + ds + ':' + dl;
  var ret = ColorUtils._hslCache.get(key);
  if (ret != null) return ret;

  // Break down in rgba
  var r = ColorUtils.getRed(color);
  var g = ColorUtils.getGreen(color);
  var b = ColorUtils.getBlue(color);
  var a = ColorUtils.getAlpha(color);

  // Get the color as HSL
  var hslColor = ColorUtils.rgb2hsl(r, g, b);

  // Add the changes, bounded to the min and max for each value
  var h = Math.min(Math.max(0, hslColor.h + dh), 360);
  var s = Math.min(Math.max(0, hslColor.s + ds), 1);
  var l = Math.min(Math.max(0, hslColor.l + dl), 1);

  // Convert back to rgba and return
  var rgbColor = ColorUtils.hsl2rgb(h, s, l);
  if (a == 1) ret = ColorUtils.makePound(rgbColor.r, rgbColor.g, rgbColor.b);
  else ret = ColorUtils.makeRGBA(rgbColor.r, rgbColor.g, rgbColor.b, a);

  // Store in the cache and return
  ColorUtils._hslCache.put(key, ret);
  return ret;
};

/**
 * Interpolate a color between the original and destination values for the
 * given percent.
 * @param  origVal  original color value, a string
 * @param  destVal  destination color value, a string
 * @param {number}  percent  percent value to interpolate
 */
ColorUtils.interpolateColor = function (origVal, destVal, percent) {
  var oldR = ColorUtils.getRed(origVal);
  var oldG = ColorUtils.getGreen(origVal);
  var oldB = ColorUtils.getBlue(origVal);
  var oldA = ColorUtils.getAlpha(origVal);

  var destR = ColorUtils.getRed(destVal);
  var destG = ColorUtils.getGreen(destVal);
  var destB = ColorUtils.getBlue(destVal);
  var destA = ColorUtils.getAlpha(destVal);

  var newR = Math.round(DvtMath.interpolateNumber(oldR, destR, percent));
  var newG = Math.round(DvtMath.interpolateNumber(oldG, destG, percent));
  var newB = Math.round(DvtMath.interpolateNumber(oldB, destB, percent));
  var newA = DvtMath.interpolateNumber(oldA, destA, percent);

  return ColorUtils.makeRGBA(newR, newG, newB, newA);
};

/**
 * Returns the relative brightness of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white.
 * Follows the formula in www.w3.org/TR/WCAG20/#relativeluminancedef
 * @param {string} color
 * @return {number} The relative luminance of the provided color.
 */
ColorUtils.getLuminance = function (color) {
  var transform = function (c) {
    var cs = c / 255;
    return cs < 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  };

  var r = ColorUtils.getRed(color);
  var g = ColorUtils.getGreen(color);
  var b = ColorUtils.getBlue(color);
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
};

/**
 * Returns the contrast ratio between two colors. The ratio can range from 1 to 21.
 * Follows the formula in www.w3.org/TR/WCAG20/#contrast-ratiodef
 * @param {string} color1
 * @param {string} color2
 * @return {number} The contrast ratio.
 */
ColorUtils.getContrastRatio = function (color1, color2) {
  return ColorUtils.getContrastRatioByLuminance(
    ColorUtils.getLuminance(color1),
    ColorUtils.getLuminance(color2)
  );
};

/**
 * Returns the contrast ratio between two relative luminance values. The ratio can range from 1 to 21.
 * Follows the formula in www.w3.org/TR/WCAG20/#contrast-ratiodef
 * @param {string} luminance1
 * @param {string} luminance2
 * @return {number} The contrast ratio.
 */
ColorUtils.getContrastRatioByLuminance = function (luminance1, luminance2) {
  var l1 = luminance1 + 0.05;
  var l2 = luminance2 + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
};

/**
 * Returns a contrasting text color for the specified background color.
 * @param {string} backgroundColor The background color.
 * @return {string} A constrasting color for use on text.
 */
ColorUtils.getContrastingTextColor = function (backgroundColor) {
  // Retrieve from cache if it has been computed before
  if (!ColorUtils._CONTRASTING_TEXT_COLOR_CACHE[backgroundColor]) {
    var luminance = ColorUtils.getLuminance(backgroundColor);
    var whiteContrast = ColorUtils.getContrastRatioByLuminance(luminance, 1);
    var blackContrast = ColorUtils.getContrastRatioByLuminance(luminance, 0);
    var textColor = whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
    ColorUtils._CONTRASTING_TEXT_COLOR_CACHE[backgroundColor] = textColor;
  }
  return ColorUtils._CONTRASTING_TEXT_COLOR_CACHE[backgroundColor];
};

/**
 * Process and fix color based on platform.
 * Color in #aarrggbb format is converted to rgba(r,g,b,a) representation
 * Batik doesn't support rgba, so splits the rgba color into rgb(r,g,b) color and alpha for Batik
 * @param {String}  color  The hex or RGB or RGBA representation of the color
 * @param {number}  alpha  The opacity
 * @return {object}  color object containing 'color' and 'alpha'
 */
ColorUtils.fixColorForPlatform = function (color, alpha) {
  if (!color) return null;
  if (color.charAt(0) == '#' && color.length > 8) {
    // #aarrggbb values shouldn't be sent to the DOM
    color = ColorUtils.getRGBA(color);
  }
  var colorObj = {};
  colorObj['color'] = color;
  if (alpha != null) colorObj['alpha'] = alpha;
  return colorObj;
};

/**
 * Utility functions for SVG paths taken from 3rd party sources.
 * @class
 */
const Dvt3rdPartyPathUtils = {};

Obj.createSubclass(Dvt3rdPartyPathUtils, Obj);

/**
 * Adapted from D3.js -- d3_svg_lineLinear
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @return {string} Path commands.
 */
Dvt3rdPartyPathUtils.lineLinear = function (points) {
  return points.join('L');
};

/**
 * Adapted from D3.js -- d3_svg_lineCardinalClosed
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @param {number} tension A number from 0 to 1 specifying the tension.
 * @return {string} Path commands.
 */
Dvt3rdPartyPathUtils.lineCardinalClosed = function (points, tension) {
  return points.length < 3
    ? Dvt3rdPartyPathUtils.lineLinear(points)
    : points[0] +
        Dvt3rdPartyPathUtils.lineHermite(
          (points.push(points[0]), points),
          Dvt3rdPartyPathUtils.lineCardinalTangents(
            [points[points.length - 2]].concat(points, [points[1]]),
            tension
          )
        );
};

/**
 * Adapted from D3.js -- d3_svg_lineCardinal
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @param {number} tension A number from 0 to 1 specifying the tension.
 * @return {string} Path commands.
 */
Dvt3rdPartyPathUtils.lineCardinal = function (points, tension) {
  return points.length < 3
    ? Dvt3rdPartyPathUtils.lineLinear(points)
    : points[0] +
        Dvt3rdPartyPathUtils.lineHermite(
          points,
          Dvt3rdPartyPathUtils.lineCardinalTangents(points, tension)
        );
};

/**
 * Adapted from D3.js -- d3_svg_lineHermite
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @param {array} tangents Tangents in the form of [[t0x t0y] [t1x t1y] ...].
 * @return {string} Path commands.
 */
Dvt3rdPartyPathUtils.lineHermite = function (points, tangents) {
  if (
    tangents.length < 1 ||
    (points.length != tangents.length && points.length != tangents.length + 2)
  ) {
    return Dvt3rdPartyPathUtils.lineLinear(points);
  }
  var quad = points.length != tangents.length,
    path = '',
    p0 = points[0],
    p = points[1],
    t0 = tangents[0],
    t = t0,
    pi = 1;
  if (quad) {
    path +=
      'Q' +
      Math.round(p[0] - (t0[0] * 2) / 3) +
      ',' +
      Math.round(p[1] - (t0[1] * 2) / 3) +
      ',' +
      Math.round(p[0]) +
      ',' +
      Math.round(p[1]);
    p0 = points[1];
    pi = 2;
  }
  if (tangents.length > 1) {
    t = tangents[1];
    p = points[pi];
    pi++;
    path +=
      'C' +
      Math.round(p0[0] + t0[0]) +
      ',' +
      Math.round(p0[1] + t0[1]) +
      ',' +
      Math.round(p[0] - t[0]) +
      ',' +
      Math.round(p[1] - t[1]) +
      ',' +
      Math.round(p[0]) +
      ',' +
      Math.round(p[1]);
    for (var i = 2; i < tangents.length; i++, pi++) {
      p = points[pi];
      t = tangents[i];
      path +=
        'S' +
        Math.round(p[0] - t[0]) +
        ',' +
        Math.round(p[1] - t[1]) +
        ',' +
        Math.round(p[0]) +
        ',' +
        Math.round(p[1]);
    }
  }
  if (quad) {
    var lp = points[pi];
    path +=
      'Q' +
      Math.round(p[0] + (t[0] * 2) / 3) +
      ',' +
      Math.round(p[1] + (t[1] * 2) / 3) +
      ',' +
      Math.round(lp[0]) +
      ',' +
      Math.round(lp[1]);
  }
  return path;
};

/**
 * Adapted from D3.js -- d3_svg_lineCardinalTangents
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @param {number} tension A number from 0 to 1 specifying the tension.
 * @return {array} Tangents in the form of [[t0x t0y] [t1x t1y] ...].
 */
Dvt3rdPartyPathUtils.lineCardinalTangents = function (points, tension) {
  var tangents = [],
    a = (1 - tension) / 2,
    p0,
    p1 = points[0],
    p2 = points[1],
    i = 1,
    n = points.length;
  while (++i < n) {
    p0 = p1;
    p1 = p2;
    p2 = points[i];
    tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
  }
  return tangents;
};

/**
 * Adapted from D3.js -- d3_svg_lineSlope
 * @param {array} p0 Point in the form of [x y].
 * @param {array} p1 Point in the form of [x y].
 * @return {number} Slope.
 */
Dvt3rdPartyPathUtils.lineSlope = function (p0, p1) {
  return (p1[1] - p0[1]) / (p1[0] - p0[0]);
};

/**
 * Adapted from D3.js -- d3_svg_lineFiniteDifferences
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @return {array} Finite differences.
 */
Dvt3rdPartyPathUtils.lineFiniteDifferences = function (points) {
  var i = 0,
    j = points.length - 1,
    m = [],
    p0 = points[0],
    p1 = points[1],
    d = (m[0] = Dvt3rdPartyPathUtils.lineSlope(p0, p1));
  while (++i < j) {
    m[i] = (d + (d = Dvt3rdPartyPathUtils.lineSlope((p0 = p1), (p1 = points[i + 1])))) / 2;
  }
  m[i] = d;
  return m;
};

/**
 * Adapted from D3.js -- d3_svg_lineMonotoneTangents
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @param {boolean} isHoriz If true, the spline is monotonic in X. Otherwise, it is monotonic in Y.
 * @return {array} Tangents in the form of [[t0x t0y] [t1x t1y] ...].
 */
Dvt3rdPartyPathUtils.lineMonotoneTangents = function (points, isHoriz) {
  if (isHoriz)
    // swap x and y
    points = Dvt3rdPartyPathUtils._rotatePoints(points);

  var tangents = [],
    d,
    a,
    b,
    s,
    m = Dvt3rdPartyPathUtils.lineFiniteDifferences(points),
    i = -1,
    j = points.length - 1;
  while (++i < j) {
    d = Dvt3rdPartyPathUtils.lineSlope(points[i], points[i + 1]);
    if (Math.abs(d) < 1e-6) {
      m[i] = m[i + 1] = 0;
    } else {
      a = m[i] / d;
      b = m[i + 1] / d;
      s = a * a + b * b;
      if (s > 9) {
        s = (d * 3) / Math.sqrt(s);
        m[i] = s * a;
        m[i + 1] = s * b;
      }
    }
  }
  i = -1;
  while (++i <= j) {
    s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
    tangents.push([s || 0, m[i] * s || 0]);
  }

  if (isHoriz)
    // swap x and y again
    tangents = Dvt3rdPartyPathUtils._rotatePoints(tangents);

  return tangents;
};

/**
 * Adapted from D3.js -- d3_svg_lineMonotone
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @param {boolean} isHoriz If true, the spline is monotonic in X. Otherwise, it is monotonic in Y.
 * @return {string} Path commands.
 */
Dvt3rdPartyPathUtils.lineMonotone = function (points, isHoriz) {
  return points.length < 3
    ? Dvt3rdPartyPathUtils.lineLinear(points)
    : points[0] +
        Dvt3rdPartyPathUtils.lineHermite(
          points,
          Dvt3rdPartyPathUtils.lineMonotoneTangents(points, isHoriz)
        );
};

/**
 * Rotate the points by swapping the x and y.
 * @param {array} points Points in the form of [[p0x p0y] [p1x p1y] ...].
 * @return {array} Rotated points.
 * @private
 */
Dvt3rdPartyPathUtils._rotatePoints = function (points) {
  var rPoints = [];
  for (var i = 0; i < points.length; i++) rPoints.push([points[i][1], points[i][0]]);
  return rPoints;
};

/**
 *  Defines the geometry of a rectangle. Top-left (x,y), and width and height.
 *  @class Rectangle
 *  @extends {dvt.Obj}
 *  @constructor
 *  @param {number} x
 *  @param {number} y
 *  @param {number} w
 *  @param {number} h
 *  @type {Rectangle}
 */
const Rectangle = function (x, y, w, h) {
  this.x = x === null || isNaN(x) ? 0 : x;
  this.y = y === null || isNaN(y) ? 0 : y;
  this.w = w === null || isNaN(w) ? 0 : w;
  this.h = h === null || isNaN(h) ? 0 : h;
};

Obj.createSubclass(Rectangle, Obj);

/**
 * Creates a new Rectangle from an array of coordinates.
 * @param {Array} ar  an array of rectangle coordinates, where x = ar[0], y = ar[1], w = ar[2], h = ar[3].
 * @return  {Rectangle}
 */
Rectangle.create = function (ar) {
  return new Rectangle(ar[0], ar[1], ar[2], ar[3]);
};

/**
 * Returns true if the rectangle contains the given point.
 */
Rectangle.prototype.containsPoint = function (nX, nY) {
  return nX >= this.x && nX <= this.x + this.w && nY >= this.y && nY <= this.y + this.h;
};

Rectangle.prototype.getCenter = function () {
  return new Point(this.x + this.w / 2.0, this.y + this.h / 2.0);
};

/**
 * Returns the union of this and the supplied rectangle.
 * @param {Rectangle}  rect  the supplied rectangle.
 * @return {Rectangle} a new rectangle that is the union of this and the supplied rectangle.
 */
Rectangle.prototype.getUnion = function (rect) {
  var u = new Rectangle();

  if (rect && rect.w !== 0 && rect.h !== 0) {
    // ignore zero size rect's
    if (this.w !== 0 && this.h !== 0) {
      //  ..     ..   ..    ..
      var thisRight = this.x + this.w; // this right
      var thisBottom = this.y + this.h; // this bottom
      var rectRight = rect.x + rect.w; // rect right
      var rectBottom = rect.y + rect.h; // rect bottom

      var minx = Math.min(this.x, rect.x);
      var miny = Math.min(this.y, rect.y);

      u.w = thisRight < rectRight ? rectRight - minx : thisRight - minx;
      u.h = thisBottom > rectBottom ? thisBottom - miny : rectBottom - miny;
      u.x = minx;
      u.y = miny;
    } else {
      u.x = rect.x;
      u.y = rect.y;
      u.w = rect.w;
      u.h = rect.h;
    }
  } else {
    u.x = this.x;
    u.y = this.y;
    u.w = this.w;
    u.h = this.h;
  }

  return u;
};

/**
 * Returns the intersection of this and the supplied rectangle.
 * @param {Rectangle}  rect  the supplied rectangle.
 * @return {Rectangle} a new rectangle that is the intersection of this and the supplied rectangle. Returns null if there is no intersection.
 */
Rectangle.prototype.getIntersection = function (rect) {
  var i = new Rectangle();

  if (rect && rect.w !== 0 && rect.h !== 0) {
    // ignore zero size rect's
    if (this.w !== 0 && this.h !== 0) {
      //  ..     ..   ..    ..
      var thisRight = this.x + this.w; // this right
      var thisBottom = this.y + this.h; // this bottom
      var rectRight = rect.x + rect.w; // rect right
      var rectBottom = rect.y + rect.h; // rect bottom

      var maxX = Math.max(this.x, rect.x);
      var maxY = Math.max(this.y, rect.y);

      if (maxX >= thisRight || maxX >= rectRight || maxY >= thisBottom || maxY >= rectBottom)
        return null;

      i.w = thisRight < rectRight ? thisRight - maxX : rectRight - maxX;
      i.h = thisBottom > rectBottom ? rectBottom - maxY : thisBottom - maxY;
      i.x = maxX;
      i.y = maxY;
    } else {
      return null;
    }
  } else return null;

  return i;
};

/**
 * Returns true if the rectangle intersectes the supplied rectangle.
 * @param {Rectangle}  rect  the supplied rectangle.
 */
Rectangle.prototype.intersects = function (rect) {
  if (rect && rect.w !== 0 && rect.h !== 0) {
    // ignore zero size rect's
    if (this.w !== 0 && this.h !== 0) {
      //  ..     ..   ..    ..
      var thisRight = this.x + this.w; // this right
      var thisBottom = this.y + this.h; // this bottom
      var rectRight = rect.x + rect.w; // rect right
      var rectBottom = rect.y + rect.h; // rect bottom

      return !(
        rect.x > thisRight ||
        rectRight < this.x ||
        rect.y > thisBottom ||
        rectBottom < this.y
      );
    }
  }
  return false;
};

/**
 * Returns a clone of itself.
 * @return {Rectangle} Its clone.
 */
Rectangle.prototype.clone = function () {
  return new Rectangle(this.x, this.y, this.w, this.h);
};

/**
 * Return true if the specified object is equal to this one.
 * @param {object} obj
 * @return {boolean}
 */
Rectangle.prototype.equals = function (obj) {
  return (
    obj instanceof Rectangle &&
    this.x == obj.x &&
    this.y == obj.y &&
    this.w == obj.w &&
    this.h == obj.h
  );
};

/**
 * @override
 */
Rectangle.prototype.toString = function () {
  return this.x + ', ' + this.y + ', ' + this.w + ', ' + this.h;
};

/*---------------------------------------------------------------------*/
/*  PathUtils()       Utility functions for SVG paths               */
/*---------------------------------------------------------------------*/

const PathUtils = {};

Obj.createSubclass(PathUtils, Obj);

PathUtils.SPLINE_TYPE_MONOTONE_VERTICAL = 'mv';
PathUtils.SPLINE_TYPE_MONOTONE_HORIZONTAL = 'mh';
PathUtils.SPLINE_TYPE_CARDINAL_CLOSED = 'cc';
PathUtils.SPLINE_TYPE_CARDINAL = 'c';

/**
 * Returns a path command for a move to the specified coordinates
 * @param x the destination x coordinate
 * @param y the destination y coordinate
 * @return the moveTo path command
 */
PathUtils.moveTo = function (x, y) {
  return 'M' + x + ',' + y;
};

/**
 * Returns a path command for a line to the specified coordinates
 * @param x the destination x coordinate
 * @param y the destination y coordinate
 * @return the lineTo path command
 */
PathUtils.lineTo = function (x, y) {
  return 'L' + x + ',' + y;
};

PathUtils.quadTo = function (x1, y1, x, y) {
  return 'Q' + x1 + ',' + y1 + ',' + x + ',' + y;
};

/**
 * Returns a path command for a vertical line to the specified x coordinate
 * @param {integer} x the destination x coordinate
 * @return {string} the horizontal line path command
 */
PathUtils.horizontalLineTo = function (x) {
  return 'H' + x;
};

/**
 * Returns a path command for a horizontal line to the specified y coordinate
 * @param {integer} y the destination y coordinate
 * @return {string} the vertical line path command
 */
PathUtils.verticalLineTo = function (y) {
  return 'V' + y;
};

PathUtils.cubicTo = function (x1, y1, x2, y2, x, y) {
  return 'C' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + x + ',' + y;
};

/**
 * Returns a path command for an arc to the specified coordinates
 * @param rx the x radius of the ellipse whose arc will be drawn
 * @param ry the y radius of the ellipse whose arc will be drawn
 * @param angleExtent the sweep of the arc to be drawn
 * @param direction 1 for clockwise, 0 for counter-clockwise
 * @param x the ending x coordinate
 * @param y the ending y coordinate
 */
PathUtils.arcTo = function (rx, ry, angleExtent, direction, x, y) {
  var cmd = 'A' + rx + ',' + ry + ',0,';
  if (angleExtent > Math.PI) {
    cmd += '1,';
  } else {
    cmd += '0,';
  }
  cmd += direction + ',' + x + ',' + y;
  return cmd;
};

/**
 * Returns a path command that closes the path.
 */
PathUtils.closePath = function () {
  return 'Z';
};

/**
 * Returns a path command for a rounded rectangle.
 * @param {number} x Rectangle x.
 * @param {number} y Rectangle y.
 * @param {number} w Rectangle width.
 * @param {number} h Rectangle height.
 * @param {number} tlcr Top left corner radius.
 * @param {number} trcr Top right corner radius.
 * @param {number} brcr Bottom right corner radius.
 * @param {number} blcr Bottom left corner radius.
 * @return {string} Path command.
 */
PathUtils.roundedRectangle = function (x, y, w, h, tlcr, trcr, brcr, blcr) {
  return PathUtils._roundedRectangle(x, y, w, h, tlcr, tlcr, trcr, trcr, brcr, brcr, blcr, blcr);
};

/**
 * Parse corner radii and return the new shape.
 *
 * Sample (valid) radius values:
 *  '5px' - 5px all corners
 *  '50% 50% 0 0' - 50% top corners, 0 bottom corners
 *  '50% 10' - 50% top left bottom right, 10px top right bottom left.
 *  '5px / 10px' - 5px horizontal radius, 10px vertical radius all corners
 *  '50% 50% 25% 25% / 25% 25% 50% 50%' - 50% h radius 25% v radius top corners, 25% h radius 50% v radius bottom corners
 *
 * Note that all non-% values (including unitless) get interpreted as 'px'.
 *
 * @param {number} x Rectangle x.
 * @param {number} y Rectangle y.
 * @param {number} w Rectangle width.
 * @param {number} h Rectangle height.
 * @param {String} radius The options attribute to be parsed
 * @param {number} multiplier The value used for when a percent radius is provided
 * @param {string} defaultValue A specified value for the border radius
 * @return {string} Path command of shape with border radius.
 */
PathUtils.rectangleWithBorderRadius = function (x, y, w, h, radius, multiplier, defaultValue) {
  var topLeftX = defaultValue;
  var topLeftY = defaultValue;
  var topRightX = defaultValue;
  var topRightY = defaultValue;
  var bottomRightX = defaultValue;
  var bottomRightY = defaultValue;
  var bottomLeftX = defaultValue;
  var bottomLeftY = defaultValue;
  if (radius) {
    if (radius.indexOf('/') != -1) {
      var splitHorizVert = radius.split('/');
      var horiz = splitHorizVert[0].trim().split(/\s+/);
      var vert = splitHorizVert[1].trim().split(/\s+/);
      if (horiz.length == 1) topLeftX = topRightX = bottomRightX = bottomLeftX = horiz[0];
      else if (horiz.length == 2) {
        topLeftX = bottomRightX = horiz[0];
        topRightX = bottomLeftX = horiz[1];
      } else if (horiz.length == 3) {
        topLeftX = horiz[0];
        topRightX = bottomLeftX = horiz[1];
        bottomRightX = horiz[2];
      } else if (horiz.length == 4) {
        topLeftX = horiz[0];
        topRightX = horiz[1];
        bottomRightX = horiz[2];
        bottomLeftX = horiz[3];
      }
      if (vert.length == 1) topLeftY = topRightY = bottomRightY = bottomLeftY = vert[0];
      else if (vert.length == 2) {
        topLeftY = bottomRightY = vert[0];
        topRightY = bottomLeftY = vert[1];
      } else if (vert.length == 3) {
        topLeftY = vert[0];
        topRightY = bottomLeftY = vert[1];
        bottomRightY = vert[2];
      } else if (vert.length == 4) {
        topLeftY = vert[0];
        topRightY = vert[1];
        bottomRightY = vert[2];
        bottomLeftY = vert[3];
      }
    } else if (radius != 'auto') {
      var split = radius.trim().split(/\s+/);
      if (split.length == 1) {
        topLeftX =
          topRightX =
          bottomRightX =
          bottomLeftX =
          topLeftY =
          topRightY =
          bottomRightY =
          bottomLeftY =
            split[0];
      } else if (split.length == 2) {
        topLeftX = bottomRightX = topLeftY = bottomRightY = split[0];
        topRightX = bottomLeftX = topRightY = bottomLeftY = split[1];
      } else if (split.length == 3) {
        topLeftX = topLeftY = split[0];
        topRightX = bottomLeftX = topRightY = bottomLeftY = split[1];
        bottomRightX = bottomRightY = split[2];
      } else if (split.length == 4) {
        topLeftX = topLeftY = split[0];
        topRightX = topRightY = split[1];
        bottomRightX = bottomRightY = split[2];
        bottomLeftX = bottomLeftY = split[3];
      }
    }
  }

  if (!radius || radius == '0') return PathUtils._rectangle(x, y, w, h);

  return PathUtils._roundedRectangle(
    x,
    y,
    w,
    h,
    PathUtils._parseBorderRadiusItem(topLeftX, multiplier),
    PathUtils._parseBorderRadiusItem(topLeftY, multiplier),
    PathUtils._parseBorderRadiusItem(topRightX, multiplier),
    PathUtils._parseBorderRadiusItem(topRightY, multiplier),
    PathUtils._parseBorderRadiusItem(bottomRightX, multiplier),
    PathUtils._parseBorderRadiusItem(bottomRightY, multiplier),
    PathUtils._parseBorderRadiusItem(bottomLeftX, multiplier),
    PathUtils._parseBorderRadiusItem(bottomLeftY, multiplier)
  );
};

/**
 * Parse a single corner radius dimension
 * @param {String} item The x or y radius input need to be parsed
 * @param {number} multiplier The value used for when a percent radius is provided
 * @return {number} The integer value of the corner radius
 * @private
 */
PathUtils._parseBorderRadiusItem = function (item, multiplier) {
  var radius = Math.min(parseFloat(item), multiplier / 2);
  if (item.indexOf('%') != -1) {
    radius = Math.min(50, parseFloat(item)) * 0.01 * multiplier;
  }
  return radius;
};

/**
 * Returns a path command for a rounded rectangle.
 * @param {number} x Rectangle x.
 * @param {number} y Rectangle y.
 * @param {number} w Rectangle width.
 * @param {number} h Rectangle height.
 * @param {number} tlcrX Top left corner x radius.
 * @param {number} tlcrY Top left corner y radius.
 * @param {number} trcrX Top right corner x radius.
 * @param {number} trcrY Top right corner y radius.
 * @param {number} brcrX Bottom right corner x radius.
 * @param {number} brcrY Bottom right corner y radius.
 * @param {number} blcrX Bottom left corner x radius.
 * @param {number} blcrY Bottom left corner  y radius.
 * @return {string} Path command.
 * @private
 */
PathUtils._roundedRectangle = function (
  x,
  y,
  w,
  h,
  tlcrX,
  tlcrY,
  trcrX,
  trcrY,
  brcrX,
  brcrY,
  blcrX,
  blcrY
) {
  tlcrY = Math.min(tlcrY, 0.5 * h);
  trcrY = Math.min(trcrY, 0.5 * h);
  brcrY = Math.min(brcrY, 0.5 * h);
  blcrY = Math.min(blcrY, 0.5 * h);
  tlcrX = Math.min(tlcrX, 0.5 * w);
  trcrX = Math.min(trcrX, 0.5 * w);
  brcrX = Math.min(brcrX, 0.5 * w);
  blcrX = Math.min(blcrX, 0.5 * w);
  var cmd =
    PathUtils.moveTo(x + tlcrX, y) +
    PathUtils.lineTo(x + w - trcrX, y) +
    PathUtils.arcTo(trcrX, trcrY, Math.PI / 2, 1, x + w, y + trcrY) +
    PathUtils.lineTo(x + w, y + h - brcrY) +
    PathUtils.arcTo(brcrX, brcrY, Math.PI / 2, 1, x + w - brcrX, y + h) +
    PathUtils.lineTo(x + blcrX, y + h) +
    PathUtils.arcTo(blcrX, blcrY, Math.PI / 2, 1, x, y + h - blcrY) +
    PathUtils.lineTo(x, y + tlcrY) +
    PathUtils.arcTo(tlcrX, tlcrY, Math.PI / 2, 1, x + tlcrX, y) +
    PathUtils.closePath();

  return cmd;
};

/**
 * Returns a polyline path cmd based on the points array.
 * @param {array} points Polyline points array.
 * @param {boolean} connectWithLine Whether the first point is reached using lineTo. Otherwise, moveTo is used.
 * @return {string} Path command.
 */
PathUtils.polyline = function (points, connectWithLine) {
  if (points.length < 2) return '';

  var cmd = connectWithLine
    ? PathUtils.lineTo(points[0], points[1])
    : PathUtils.moveTo(points[0], points[1]);
  for (var i = 2; i < points.length; i += 2) {
    cmd += PathUtils.lineTo(points[i], points[i + 1]);
  }

  return cmd;
};

/**
 * Returns a curved path command, based on cubic hermite splines, that goes through the points in the points array.
 * @param {array} points Polyline points array.
 * @param {boolean} connectWithLine Whether the first point is reached using lineTo. Otherwise, moveTo is used.
 * @param {string} type The spline type.
 * @return {string} Path commands.
 */
PathUtils.curveThroughPoints = function (points, connectWithLine, splineType) {
  if (points.length == 0) return '';

  var pts = [];
  for (
    var i = 0;
    i < points.length;
    i += 2 // convert to D3 points format
  )
    pts.push([points[i], points[i + 1]]);
  var prefix = connectWithLine ? 'L' : 'M';

  if (splineType == PathUtils.SPLINE_TYPE_MONOTONE_VERTICAL)
    return prefix + Dvt3rdPartyPathUtils.lineMonotone(pts, false);
  else if (splineType == PathUtils.SPLINE_TYPE_MONOTONE_HORIZONTAL)
    return prefix + Dvt3rdPartyPathUtils.lineMonotone(pts, true);
  else if (splineType == PathUtils.SPLINE_TYPE_CARDINAL_CLOSED)
    return prefix + Dvt3rdPartyPathUtils.lineCardinalClosed(pts, 0.7);
  else return prefix + Dvt3rdPartyPathUtils.lineCardinal(pts, 0.7);
};

/**
 *  Creates an array of path/coords from an Svg path string.
 *  @param {String} cmds A string containing SVG path command sequences.
 *  @return {Array}  an array of consecutive path command/coords, or null
 *                    if no command string supplied.
 */
PathUtils.createPathArray = function (sCmds) {
  if (!sCmds) return null;

  //  Unpack into an array of commands and coords.
  sCmds = sCmds.replace(/([0-9])([\-])/g, '$1 $2'); // must add a space before negative numbers that don't have one
  var cmds = sCmds.replace(/([mlqhvzcast])/gi, ',$1,'); // create array of coords from the string
  var ar = cmds.split(/[ ,]/g);
  var len = ar.length;
  var i;
  //  Convert coordinates in command array to floats.
  for (i = 0; i < len; i++) {
    var s = ar[i];
    if (!s) {
      ar.splice(i, 1);
      i--;
      len--;
    } else if (!isNaN(s)) {
      ar[i] = parseFloat(s);
    }
  }

  return ar;
};

/**
 * Returns the bounding box of the supplied path commands.
 * @param {Array} arCmds the path commands.
 * @return {Rectangle} the bounding box of the supplied path commands.
 */
PathUtils.getDimensions = function (aCmds) {
  if (!(aCmds && aCmds.length)) {
    return new Rectangle();
  }

  var len = aCmds.length;
  var c;
  var xSubPath, ySubPath;
  var bFirst = true; // false after first command
  var bRel; // true if relative command
  var x, y, x2, y2, x3, y3;

  var minX = Number.MAX_VALUE;
  var maxX = -1 * Number.MAX_VALUE;
  var minY = Number.MAX_VALUE;
  var maxY = -1 * Number.MAX_VALUE;
  var aPos = [];
  var i, j, k;

  for (i = 0; i < len; i++) {
    bRel = false;
    var iMulti = 0;
    j = 0;

    c = aCmds[i];

    switch (c) {
      case 'm':
        bRel = true;
      case 'M':
        do {
          x = aCmds[i + 1];
          y = aCmds[i + 2];

          if (bFirst) {
            // note if first is 'm', it is treated as absolute.
            bFirst = false;
          } else if (bRel) {
            x += xSubPath;
            y += ySubPath;
          }
          xSubPath = x;
          ySubPath = y;

          aPos[j++] = x;
          aPos[j++] = y;
          iMulti++;
          i += 2;
        } while (!isNaN(aCmds[i + 1]));
        break;

      case 'c':
        bRel = true;
      case 'C':
        do {
          x = aCmds[i + 1];
          y = aCmds[i + 2];
          x2 = aCmds[i + 3];
          y2 = aCmds[i + 4];
          x3 = aCmds[i + 5];
          y3 = aCmds[i + 6];

          if (bRel) {
            x += xSubPath;
            y += ySubPath;
            x2 += xSubPath;
            y2 += ySubPath;
            x3 += xSubPath;
            y3 += ySubPath;
          }
          xSubPath = x3;
          ySubPath = y3;

          aPos[j++] = x3;
          aPos[j++] = y3;
          iMulti++;
          i += 6;
        } while (!isNaN(aCmds[i + 1]));
        break;

      case 'q':
        bRel = true;
      case 'Q':
        do {
          x = aCmds[i + 1];
          y = aCmds[i + 2];
          x2 = aCmds[i + 3];
          y2 = aCmds[i + 4];
          if (bRel) {
            x += xSubPath;
            y += ySubPath;
            x2 += xSubPath;
            y2 += ySubPath;
          }
          xSubPath = x2;
          ySubPath = y2;

          aPos[j++] = x2;
          aPos[j++] = y2;
          iMulti++;
          i += 4;
        } while (!isNaN(aCmds[i + 1]));
        break;

      case 'l':
        bRel = true;
      case 'L':
        do {
          x = aCmds[i + 1];
          y = aCmds[i + 2];
          if (bRel) {
            x += xSubPath;
            y += ySubPath;
          }
          xSubPath = x;
          ySubPath = y;

          aPos[j++] = x;
          aPos[j++] = y;
          iMulti++;
          i += 2;
        } while (!isNaN(aCmds[i + 1]));
        break;

      case 'h':
        bRel = true;
      case 'H':
        do {
          x = aCmds[i + 1];
          if (bRel) {
            x += xSubPath;
          }
          xSubPath = x;

          aPos[j++] = x;
          aPos[j++] = ySubPath;
          iMulti++;
          i += 1;
        } while (!isNaN(aCmds[i + 1]));
        break;

      case 'v':
        bRel = true;
      case 'V':
        do {
          y = aCmds[i + 1];
          if (bRel) {
            y += ySubPath;
          }
          ySubPath = y;

          aPos[j++] = xSubPath;
          aPos[j++] = y;
          iMulti++;
          i += 1;
        } while (!isNaN(aCmds[i + 1]));
        break;
      case 'a':
        bRel = true;
      case 'A':
        do {
          var rx = aCmds[i + 1];
          var ry = aCmds[i + 2];
          var xRotation = aCmds[i + 3];
          var largeArcFlag = aCmds[i + 4];
          var sweepFlag = aCmds[i + 5];
          var endX = aCmds[i + 6];
          var endY = aCmds[i + 7];

          if (bRel) {
            endX += xSubPath;
            endY += ySubPath;
          }

          var arcDims = PathUtils._getArcDims(
            xSubPath,
            ySubPath,
            rx,
            ry,
            xRotation,
            largeArcFlag,
            sweepFlag,
            endX,
            endY
          );
          aPos[j++] = arcDims[0];
          aPos[j++] = arcDims[1];
          aPos[j++] = arcDims[2];
          aPos[j++] = arcDims[3];
          iMulti += 2;

          xSubPath = endX;
          ySubPath = endY;

          i += 7;
        } while (!isNaN(aCmds[i + 1]));
        break;
      case 'z':
      case 'Z':
        break;

      default:
        break;
    } // end switch

    j = 0;
    for (k = 0; k < iMulti; k++) {
      x = aPos[j++];
      y = aPos[j++];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  return new Rectangle(minX, minY, Math.abs(maxX - minX), Math.abs(maxY - minY));
};

/**
 *  Converts a platform independent array of consecutive commands and coords
 *  to an SVG path string.
 *  @param {Array} ar  The array of commands and coordinates to be converted.
 *  @type {String}
 */
PathUtils.getPathString = function (ar) {
  var sOut = '';
  var len = ar.length;
  var s;

  for (var i = 0; i < len; i++) {
    s = ar[i];
    if (s !== undefined && s !== null) sOut += (i > 0 ? ' ' : '') + ar[i];
  }

  return sOut;
};

/**
 *  Transforms the shape to the specified coordinates.
 *  @param {array} arCmds The array of commands for a path
 *  @param {number} x The x translation
 *  @param {number} y The y translation
 *  @param {number} sx The x scale factor
 *  @param {number} sy The y scale factor
 *  @return {string} The transformed path
 *  @private
 */
PathUtils.transformPath = function (arCmds, x, y, sx, sy) {
  if (!arCmds) return;

  var scaledPath = ''; // return string
  var cmdType = '';
  var absCmd;
  for (var i = 0; i < arCmds.length; i++) {
    if (typeof arCmds[i] == 'string') {
      cmdType = arCmds[i];
      absCmd = cmdType === cmdType.toUpperCase();
      scaledPath += cmdType + ' ';
    }

    var args = [];
    while (i < arCmds.length - 1 && typeof arCmds[i + 1] == 'number') {
      i++;
      args.push(arCmds[i]);
    }

    if (cmdType.toUpperCase() === 'A') {
      // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)  only rx, ry, x, y should be scaled
      // only x,y should be translated for 'A', no translation for 'a'

      for (
        var j = 0;
        j < args.length;
        j += 7 // loop to support multi-arc
      ) {
        scaledPath += parseFloat(args[j]) * sx + ' '; // rx
        scaledPath += parseFloat(args[j + 1]) * sy + ' '; // ry
        scaledPath += args[j + 2] + ' '; // x-axis-rotation
        scaledPath += args[j + 3] + ' '; // large-arc-flag
        scaledPath += args[j + 4] + ' '; // sweep-flag
        scaledPath += parseFloat(args[j + 5]) * sx + (absCmd ? x : 0) + ' '; // x
        scaledPath += parseFloat(args[j + 6]) * sy + (absCmd ? y : 0) + ' '; // y
      }
    } else {
      // For all other cmdTypes, all numbers should be scaled
      // For all absolute cmdTypes, all numbers should be translated

      var scales = [];
      var translates = [];
      if (cmdType.toUpperCase() === 'H') {
        scales.push(sx); // All numbers should be scaled by sx
        translates.push(absCmd ? x : 0); // All numbers should be translated by x
      } else if (cmdType.toUpperCase() === 'V') {
        scales.push(sy); // All numbers should be scaled by sy
        translates.push(absCmd ? y : 0); // All numbers should be translated by y
      } else {
        // All other commands take a set of points, so even indices should be scaled
        //  by sx, odd indices by sy
        scales.push(sx);
        scales.push(sy);
        // For absolute commands, even indices should be translated by x, odd indices by y
        translates.push(absCmd ? x : 0);
        translates.push(absCmd ? y : 0);
      }

      for (var j = 0; j < args.length; j++) {
        var s = scales[j % scales.length];
        var t = translates[j % translates.length];

        scaledPath += parseFloat(args[j]) * s + t + ' '; // scale and translate
      }
    }
  } // end for

  return scaledPath;
};

/**
 * Helper function for path simplification
 * @param {number} xMove The number of pixels that will be moved in the horizontal coordinate space.
 * @param {number} yMove The number of pixels that will be moved in the vertical coordinate space.
 * @param {number} scale The scale to test if the the x/y movement will show
 * @return {boolean} Whether or not the x/y movement will show in the given scale.
 */
PathUtils._fitsInScale = function (xMove, yMove, scale) {
  return Math.abs(xMove) > scale || Math.abs(yMove) > scale;
};

/**
 * Simplifies a given path by scaling it down and discarding pixel movements that are too small to be seen in the
 * given scale.
 * @param {array} cmdAr The array of commands and coordinates to be converted.
 * @param {number} scale The scale to simplify the path to.
 * @return {string} The simplified string of path commands and coordinates.
 */
PathUtils.simplifyPath = function (cmdAr, scale) {
  var cmd;
  var simplifiedCmdStr = '';
  var tempSimplifiedStr = '';
  var partialX = 0;
  var partialY = 0;
  var simplifiedCmd;
  var mx = 0;
  var my = 0;
  // we expect all path commands to start with an m and end with a z
  var numCmds = 0;
  for (var i = 0; i < cmdAr.length; i++) {
    if (isNaN(cmdAr[i])) {
      cmd = cmdAr[i];
      if (cmd == 'Z' || cmd == 'z') {
        simplifiedCmd = cmd;
        tempSimplifiedStr += cmd;
        // if a command only contains move commands i.e. m[x] [y]z, do not add it but keep track of the relative position
        if (numCmds > 0) {
          simplifiedCmdStr += tempSimplifiedStr;
          mx = 0;
          my = 0;
        }
        tempSimplifiedStr = '';
        numCmds = 0;
        partialX = 0;
        partialY = 0;
      }
      continue;
    }

    switch (cmd) {
      case 'M':
        mx = 0;
        my = 0;
      case 'm':
        mx += cmdAr[i];
        my += cmdAr[i + 1];
        tempSimplifiedStr = tempSimplifiedStr + cmd + mx + ' ' + my;
        simplifiedCmd = cmd;
        i++;
        break;
      case 'l':
        partialX += cmdAr[i];
        partialY += cmdAr[i + 1];
        if (PathUtils._fitsInScale(partialX, partialY, scale)) {
          if (simplifiedCmd != cmd) {
            simplifiedCmd = cmd;
            tempSimplifiedStr += cmd;
          } else {
            tempSimplifiedStr += ' ';
          }
          tempSimplifiedStr = tempSimplifiedStr + partialX + ' ' + partialY;
          partialX = 0;
          partialY = 0;
          numCmds++;
        }
        i++;
        break;
      case 'h':
      case 'v':
        if (cmd == 'h') partialX += cmdAr[i];
        else partialY += cmdAr[i];
        if (PathUtils._fitsInScale(partialX, partialY, scale)) {
          if (partialX != 0 && partialY != 0) {
            if (simplifiedCmd != 'l') {
              simplifiedCmd = 'l';
              tempSimplifiedStr += 'l';
            } else {
              tempSimplifiedStr += ' ';
            }
            tempSimplifiedStr = tempSimplifiedStr + partialX + ' ' + partialY;
          } else {
            simplifiedCmd = cmd;
            tempSimplifiedStr = tempSimplifiedStr + cmd + (cmd == 'h' ? partialX : partialY);
          }
          partialX = 0;
          partialY = 0;
          numCmds++;
        }
        break;
      default:
    }
  }
  return simplifiedCmdStr;
};

/**
 * Returns a path command for a rectangle.
 * @param {number} x Rectangle x.
 * @param {number} y Rectangle y.
 * @param {number} w Rectangle width.
 * @param {number} h Rectangle height.
 * @return {string} Path command.
 * @private
 */
PathUtils._rectangle = function (x, y, w, h) {
  var cmd =
    PathUtils.moveTo(x, y) +
    PathUtils.horizontalLineTo(x + w) +
    PathUtils.verticalLineTo(y + h) +
    PathUtils.horizontalLineTo(x) +
    PathUtils.closePath();

  return cmd;
};

/**
 * The helper method that calculates dimensions of an arc based on arc parameters.
 * @param {number} startX x coordinate for the arc start
 * @param {number} startY y coordinate for the arc start
 * @param {number} rx horizontal radius of the ellipse that defines arc segment
 * @param {number} ry vertical radius of the ellipse that defines arc segment
 * @param {number} xrotatation ellipse rotation angle
 * @param {number} largeArcFlag 1 for using the large section of an ellipse, 0 for small section
 * @param {number} sweepFlag 0 or 1 flag that defines section direction
 * @param {number} endX x coordinate for the arc end
 * @param {number} endY y coordinate for the arc end
 * @return {array} arc bounds represented by x,y for the top left and bottom right points
 */
PathUtils._getArcDims = function (
  startX,
  startY,
  rx,
  ry,
  xrotatation,
  largeArcFlag,
  sweepFlag,
  endX,
  endY
) {
  let arc = PathUtils._convertArc(
    startX,
    startY,
    rx,
    ry,
    xrotatation,
    largeArcFlag,
    sweepFlag,
    endX,
    endY
  );

  // get updated radii
  rx = arc[2];
  ry = arc[3];

  const start = new Point(startX, startY); // start point
  const end = new Point(endX, endY); // end point
  const c = new Point(arc[0], arc[1]); // ellipse center
  // find ellipse edges
  const edges = [
    new Point(c.x + rx, c.y),
    new Point(c.x, c.y + ry),
    new Point(c.x - rx, c.y),
    new Point(c.x, c.y - ry)
  ];

  // Build an array of relevant points - points that represent shape dimensions.
  let points = [start, end];

  // Find what edge points from ellipse are relevant for the shape.
  // The algorithm is based on the idea that start-end points represent a line and relevant ellipse
  // edges are either below that line or above that line based on sweepFlag.
  // We don't have to make adjustments for largeArcFlag, because we already have the correct ellipse
  // calculated by _convertArc() method.
  // Find base angle using start/end points
  const baseAngle = PathUtils._getClockwiseAngle(start, end);
  const range =
    sweepFlag === 0
      ? [baseAngle, baseAngle + Math.PI]
      : [baseAngle + Math.PI, baseAngle + 2 * Math.PI];

  edges.forEach((pt) => {
    var angle = PathUtils._getClockwiseAngle(start, pt);
    if (
      (angle >= range[0] && angle <= range[1]) ||
      (angle + 2 * Math.PI >= range[0] && angle + 2 * Math.PI <= range[1])
    ) {
      points.push(pt);
    }
  });

  // collect the x and y coords from the list
  const listX = points.map((pt) => pt.x);
  const listY = points.map((pt) => pt.y);

  // find the min and max x and y
  const minX = Math.min(...listX);
  const minY = Math.min(...listY);
  const maxX = Math.max(...listX);
  const maxY = Math.max(...listY);

  return [minX, minY, maxX, maxY];
};

/**
 * Get clockwise angle for the vector from p1 to p2
 * @param {dvt.Point} p1
 * @param {dvt.Point} p2
 * @return {number} an link angle from 0 to 2*PI
 */
PathUtils._getClockwiseAngle = function (p1, p2) {
  var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  angle = angle < 0 ? angle + Math.PI * 2 : angle;
  return angle;
};

/**
 * The following code, adapted from the Apache Batik project, converts an SVG-style arc to a center-and-angles format.
 *
 * Convert an elliptical arc specified as SVG path parameters
 * to an arc based around a central point.
 *
 * @param {number} x0 x-coordinate of beginning of arc
 * @param {number} y0 y-coordinate of beginning of arc
 * @param {number} rx x-radius of ellipse
 * @param {number} ry y-radius of ellipse
 * @param {number} xAngle x-axis rotation angle in degrees
 * @param {number} largeArcFlag large-arc-flag as defined in SVG specification
 * @param {number} sweepFlag sweep-flag  as defined in SVG specification
 * @param {number} x x-coordinate of endpoint of arc
 * @param {number} y y-coordinate of endpoint of arc
 *
 * @return {array} Return value is an array containing:
 *   center x coordinate
 *   center y coordinate
 *   x-radius of ellipse
 *   y-radius of ellipse
 *   beginning angle of arc in degrees
 *   arc extent in degrees
 *   x-axis rotation angle in degrees
 */
PathUtils._convertArc = function (x0, y0, rx, ry, xAngle, largeArcFlag, sweepFlag, x, y) {
  // Step 1: compute half the distance between the current
  // and final point.
  var dx2 = (x0 - x) / 2.0;
  var dy2 = (y0 - y) / 2.0;

  // convert angle from degrees to radians
  var xAngle = (Math.PI * (xAngle % 360.0)) / 180.0;
  var cosXAngle = Math.cos(xAngle);
  var sinXAngle = Math.sin(xAngle);

  // Compute x1, y1 - translation which places the origin at the midpoint
  // of the line joining arc start (x0,y0) to arc end (x,y), followed by a rotation
  // to line up coordinate axes with the axes of the ellipse.
  // See implementation details at https://www.w3.org/TR/SVG/implnote.html
  var x1 = cosXAngle * dx2 + sinXAngle * dy2;
  var y1 = -sinXAngle * dx2 + cosXAngle * dy2;

  // Ensure radii are large enough
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  var rxSq = rx * rx;
  var rySq = ry * ry;
  var x1Sq = x1 * x1;
  var y1Sq = y1 * y1;

  var radiiCheck = x1Sq / rxSq + y1Sq / rySq;
  if (radiiCheck > 1) {
    rx = Math.sqrt(radiiCheck) * rx;
    ry = Math.sqrt(radiiCheck) * ry;
    rxSq = rx * rx;
    rySq = ry * ry;
  }

  // Step 2: Compute (cx1, cy1)
  // The cx1,cy1 are center coordinates of the image of the ellipse.
  // See implementation details at https://www.w3.org/TR/SVG/implnote.html
  var sign = largeArcFlag == sweepFlag ? -1 : 1;
  var sq = (rxSq * rySq - rxSq * y1Sq - rySq * x1Sq) / (rxSq * y1Sq + rySq * x1Sq);
  sq = sq < 0 ? 0 : sq;
  var coef = sign * Math.sqrt(sq);
  var cx1 = coef * ((rx * y1) / ry);
  var cy1 = coef * -((ry * x1) / rx);

  // Step 3 : Compute (cx, cy) from (cx1, cy1)
  var sx2 = (x0 + x) / 2.0;
  var sy2 = (y0 + y) / 2.0;
  var cx = sx2 + (cosXAngle * cx1 - sinXAngle * cy1);
  var cy = sy2 + (sinXAngle * cx1 + cosXAngle * cy1);

  // Step 4 : Compute the angleStart and the angleExtent
  var ux = (x1 - cx1) / rx;
  var uy = (y1 - cy1) / ry;
  var vx = (-x1 - cx1) / rx;
  var vy = (-y1 - cy1) / ry;
  var p, n;
  // Compute the angle start
  n = Math.sqrt(ux * ux + uy * uy);
  p = ux; // (1 * ux) + (0 * uy)
  sign = uy < 0 ? -1.0 : 1.0;
  var angleStart = (180.0 * (sign * Math.acos(p / n))) / Math.PI;

  // Compute the angle extent
  n = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
  p = ux * vx + uy * vy;
  sign = ux * vy - uy * vx < 0 ? -1.0 : 1.0;
  var angleExtent = (180.0 * (sign * Math.acos(p / n))) / Math.PI;
  if (!sweepFlag && angleExtent > 0) {
    angleExtent -= 360.0;
  } else if (sweepFlag && angleExtent < 0) {
    angleExtent += 360.0;
  }
  angleExtent %= 360;
  angleStart %= 360;

  return [cx, cy, rx, ry, angleStart, angleExtent, xAngle];
};

/*---------------------------------------------------------------------------*/
/*    DvtSvgPatternFillUtils    A static class for SVG pattern fill property */
/*                              manipulation.                                */
/*---------------------------------------------------------------------------*/
/**
 *   A static class for creating SVG pattern fills.
 *   @class DvtSvgPatternFillUtils
 *   @constructor
 */
const DvtSvgPatternFillUtils = function () {};

Obj.createSubclass(DvtSvgPatternFillUtils, Obj);

/**   @private @final @type {String}  */
DvtSvgPatternFillUtils._SM_WIDTH = 8;

/**   @private @final @type {String}  */
DvtSvgPatternFillUtils._SM_HEIGHT = 8;

/**   @private @final @type {String}  */
DvtSvgPatternFillUtils._LG_WIDTH = 16;

/**   @private @final @type {String}  */
DvtSvgPatternFillUtils._LG_HEIGHT = 16;

/**
 *  Static method to create an SVG pattern element.
 *  @param {PatternFill}  patternFill  pattern fill object
 *  @param {string}  id  pattern identifier
 */
DvtSvgPatternFillUtils.createElem = function (patternFill, id) {
  var elemPat = document.createElementNS(ToolkitUtils.SVG_NS, 'pattern');
  ToolkitUtils.setAttrNullNS(elemPat, 'id', id);

  var pattern = patternFill.getPattern();
  var bSmall = DvtSvgPatternFillUtils.IsSmallPattern(pattern);
  var ww;
  var hh;
  if (bSmall) {
    ww = DvtSvgPatternFillUtils._SM_WIDTH;
    hh = DvtSvgPatternFillUtils._SM_HEIGHT;
  } else {
    ww = DvtSvgPatternFillUtils._LG_WIDTH;
    hh = DvtSvgPatternFillUtils._LG_HEIGHT;
  }

  ToolkitUtils.setAttrNullNS(elemPat, 'x', 0);
  ToolkitUtils.setAttrNullNS(elemPat, 'y', 0);
  ToolkitUtils.setAttrNullNS(elemPat, 'width', ww);
  ToolkitUtils.setAttrNullNS(elemPat, 'height', hh);
  ToolkitUtils.setAttrNullNS(elemPat, 'patternUnits', 'userSpaceOnUse');
  var mat = patternFill.getMatrix();
  if (mat) {
    var sMat =
      'matrix(' +
      mat.getA() +
      ',' +
      mat.getC() +
      ',' +
      mat.getB() +
      ',' +
      mat.getD() +
      ',' +
      mat.getTx() +
      ',' +
      mat.getTy() +
      ')';
    ToolkitUtils.setAttrNullNS(elemPat, 'patternTransform', sMat);
  }

  DvtSvgPatternFillUtils.CreatePatternElems(patternFill, elemPat);

  return elemPat;
};

/**
 * Determine if the pattern is large or small.
 *
 * @param {string}  pattern  constant representing the pattern
 * @protected
 */
DvtSvgPatternFillUtils.IsSmallPattern = function (pattern) {
  return pattern.charAt(0) === 's';
};

/**
 * Determine if the pattern is large or small.
 *
 * @param {PatternFill}  patternFill  pattern fill object
 * @param {object}  parentElem  parent pattern DOM element
 * @protected
 */
DvtSvgPatternFillUtils.CreatePatternElems = function (patternFill, parentElem) {
  var rightX;
  var bottomY;
  var w;
  var h;
  var halfW;
  var halfH;
  var elem;
  const STROKE_OPACITY = 'stroke-opacity';
  const STROKE_WIDTH = 'stroke-width';
  const FILL_OPACITY = 'fill-opacity';

  var pattern = patternFill.getPattern();
  var sColor = patternFill.getColor();
  var color = ColorUtils.getRGB(sColor);
  var alpha = ColorUtils.getAlpha(sColor);
  var sBackgroundColor = patternFill.getBackgroundColor();
  var backgroundColor = ColorUtils.getRGB(sBackgroundColor);
  var backgroundAlpha = ColorUtils.getAlpha(sBackgroundColor);

  var bSmall = DvtSvgPatternFillUtils.IsSmallPattern(pattern);
  if (bSmall) {
    rightX = DvtSvgPatternFillUtils._SM_WIDTH;
    bottomY = DvtSvgPatternFillUtils._SM_HEIGHT;
    w = DvtSvgPatternFillUtils._SM_WIDTH;
    h = DvtSvgPatternFillUtils._SM_HEIGHT;
  } else {
    rightX = DvtSvgPatternFillUtils._LG_WIDTH;
    bottomY = DvtSvgPatternFillUtils._LG_HEIGHT;
    w = DvtSvgPatternFillUtils._LG_WIDTH;
    h = DvtSvgPatternFillUtils._LG_HEIGHT;
  }

  //if a background color is specified, then fill a rect with that color
  //before drawing the pattern elements on top of it
  if (backgroundColor && backgroundAlpha > 0) {
    elem = document.createElementNS(ToolkitUtils.SVG_NS, 'rect');

    ToolkitUtils.setAttrNullNS(elem, 'stroke', backgroundColor);
    ToolkitUtils.setAttrNullNS(elem, STROKE_OPACITY, backgroundAlpha);
    ToolkitUtils.setAttrNullNS(elem, STROKE_WIDTH, 1);
    ToolkitUtils.setAttrNullNS(elem, 'fill', backgroundColor);
    ToolkitUtils.setAttrNullNS(elem, FILL_OPACITY, backgroundAlpha);

    ToolkitUtils.setAttrNullNS(elem, 'x', 0);
    ToolkitUtils.setAttrNullNS(elem, 'y', 0);
    ToolkitUtils.setAttrNullNS(elem, 'width', rightX);
    ToolkitUtils.setAttrNullNS(elem, 'height', bottomY);

    ToolkitUtils.appendChildElem(parentElem, elem);
  }

  if (pattern === PatternFill.SM_DIAG_UP_LT || pattern === PatternFill.LG_DIAG_UP_LT) {
    elem = document.createElementNS(ToolkitUtils.SVG_NS, 'path');
    ToolkitUtils.setAttrNullNS(elem, 'stroke', color);
    ToolkitUtils.setAttrNullNS(elem, STROKE_OPACITY, alpha);
    ToolkitUtils.setAttrNullNS(elem, STROKE_WIDTH, 1);
    ToolkitUtils.setAttrNullNS(elem, 'stroke-linecap', 'square');

    ToolkitUtils.setAttrNullNS(
      elem,
      'd',
      PathUtils.moveTo(0, -h / 2) +
        PathUtils.lineTo((3 * w) / 2, h) +
        PathUtils.moveTo(-w / 2, 0) +
        PathUtils.lineTo(w / 2, h)
    );

    ToolkitUtils.appendChildElem(parentElem, elem);
  } else if (pattern === PatternFill.SM_DIAG_UP_RT || pattern === PatternFill.LG_DIAG_UP_RT) {
    elem = document.createElementNS(ToolkitUtils.SVG_NS, 'path');
    ToolkitUtils.setAttrNullNS(elem, 'stroke', color);
    ToolkitUtils.setAttrNullNS(elem, STROKE_OPACITY, alpha);
    ToolkitUtils.setAttrNullNS(elem, STROKE_WIDTH, 1);
    ToolkitUtils.setAttrNullNS(elem, 'stroke-linecap', 'square');

    ToolkitUtils.setAttrNullNS(
      elem,
      'd',
      PathUtils.moveTo(-w / 2, h) +
        PathUtils.lineTo(w, -h / 2) +
        PathUtils.moveTo(0, (3 * h) / 2) +
        PathUtils.lineTo((3 * w) / 2, 0)
    );

    ToolkitUtils.appendChildElem(parentElem, elem);
  } else if (pattern === PatternFill.SM_CROSSHATCH || pattern === PatternFill.LG_CROSSHATCH) {
    // use path instead of two lines because it's more compact (uses one
    // DOM element instead of two)
    elem = document.createElementNS(ToolkitUtils.SVG_NS, 'path');

    ToolkitUtils.setAttrNullNS(elem, 'stroke', color);
    ToolkitUtils.setAttrNullNS(elem, STROKE_OPACITY, alpha);
    ToolkitUtils.setAttrNullNS(elem, STROKE_WIDTH, 1);

    ToolkitUtils.setAttrNullNS(
      elem,
      'd',
      'M0,0' + 'L' + rightX + ',' + bottomY + 'M' + rightX + ',0' + 'L0,' + bottomY
    );

    ToolkitUtils.appendChildElem(parentElem, elem);
  } else if (pattern === PatternFill.SM_CHECK || pattern === PatternFill.LG_CHECK) {
    halfW = w / 2;
    halfH = h / 2;

    // use path instead of two rects because it's more compact (uses one
    // DOM element instead of two)
    elem = document.createElementNS(ToolkitUtils.SVG_NS, 'path');

    ToolkitUtils.setAttrNullNS(elem, 'stroke', color);
    ToolkitUtils.setAttrNullNS(elem, STROKE_OPACITY, alpha);
    ToolkitUtils.setAttrNullNS(elem, STROKE_WIDTH, 1);
    ToolkitUtils.setAttrNullNS(elem, 'fill', color);
    ToolkitUtils.setAttrNullNS(elem, FILL_OPACITY, alpha);

    ToolkitUtils.setAttrNullNS(
      elem,
      'd',
      'M' +
        halfW +
        ',0' +
        'L' +
        w +
        ',0' +
        'L' +
        w +
        ',' +
        halfH +
        'L' +
        halfW +
        ',' +
        halfH +
        'Z' +
        'M0,' +
        halfH +
        'L' +
        halfW +
        ',' +
        halfH +
        'L' +
        halfW +
        ',' +
        h +
        'L0,' +
        h +
        'Z'
    );

    ToolkitUtils.appendChildElem(parentElem, elem);
  } else if (
    pattern === PatternFill.SM_TRIANGLE_CHECK ||
    pattern === PatternFill.LG_TRIANGLE_CHECK
  ) {
    elem = document.createElementNS(ToolkitUtils.SVG_NS, 'polygon');

    ToolkitUtils.setAttrNullNS(elem, 'stroke', color);
    ToolkitUtils.setAttrNullNS(elem, STROKE_OPACITY, alpha);
    ToolkitUtils.setAttrNullNS(elem, STROKE_WIDTH, 1);
    ToolkitUtils.setAttrNullNS(elem, 'fill', color);
    ToolkitUtils.setAttrNullNS(elem, FILL_OPACITY, alpha);

    ToolkitUtils.setAttrNullNS(
      elem,
      'points',
      '0,' + bottomY + ' ' + rightX + ',0 ' + rightX + ',' + bottomY
    );

    ToolkitUtils.appendChildElem(parentElem, elem);
  } else if (pattern === PatternFill.SM_DIAMOND_CHECK || pattern === PatternFill.LG_DIAMOND_CHECK) {
    halfW = w / 2;
    halfH = h / 2;

    elem = document.createElementNS(ToolkitUtils.SVG_NS, 'polygon');

    ToolkitUtils.setAttrNullNS(elem, 'stroke', color);
    ToolkitUtils.setAttrNullNS(elem, STROKE_OPACITY, alpha);
    ToolkitUtils.setAttrNullNS(elem, STROKE_WIDTH, 1);
    ToolkitUtils.setAttrNullNS(elem, 'fill', color);
    ToolkitUtils.setAttrNullNS(elem, FILL_OPACITY, alpha);

    ToolkitUtils.setAttrNullNS(
      elem,
      'points',
      '0,' + halfH + ' ' + halfW + ',0 ' + rightX + ',' + halfW + ' ' + halfW + ',' + bottomY
    );

    ToolkitUtils.appendChildElem(parentElem, elem);
  }
};

/**
 *   Static Shape Utility Functions
 *   @class SvgShapeUtils
 *   @constructor
 */
const SvgShapeUtils = function () {};

Obj.createSubclass(SvgShapeUtils, Obj);

/**
 * @private
 */
SvgShapeUtils._uniqueSeed = 0; // for unique Id creation

/**
 * Adds a clipping region to the global defs element.
 * @param {ClipPath} cp The ClipPath object specifying the clipping region(s).
 * @param {dvt.Context} context The rendering context.
 * @return {boolean} True if the clipping paths was successfully or already added, else false.
 */
SvgShapeUtils.addClipPath = function (cp, context) {
  var id = cp.getId();
  if (!id) {
    return false; // essential to have an id to reference
  }

  var elemDefs = context.getDefs();
  if (!elemDefs) {
    return false;
  }

  // Check if clipping path for this id is already defined.
  var defsChildren = elemDefs.childNodes;
  var len = defsChildren.length;
  for (var i = 0; i < len; i++) {
    var el = defsChildren[i];
    if (el.id === id) return true;
  }

  var elemClip = SvgShapeUtils.createElement('clipPath', id);
  context.appendDefs(elemClip);

  var regions = cp.getRegions();
  for (var i = 0; i < regions.length; i++) {
    var region = regions[i];
    if (region) {
      var elem = null;
      if (region.type === ClipPath.RECT) {
        elem = SvgShapeUtils.createElement('rect');
        ToolkitUtils.setAttrNullNS(elem, 'x', region.x);
        ToolkitUtils.setAttrNullNS(elem, 'y', region.y);
        ToolkitUtils.setAttrNullNS(elem, 'width', region.w);
        ToolkitUtils.setAttrNullNS(elem, 'height', region.h);
        if (region.rx) ToolkitUtils.setAttrNullNS(elem, 'rx', region.rx);
        if (region.ry) ToolkitUtils.setAttrNullNS(elem, 'ry', region.ry);
      } else if (region.type === ClipPath.PATH) {
        elem = SvgShapeUtils.createElement('path');
        ToolkitUtils.setAttrNullNS(elem, 'd', region.d);
      } else if (region.type === ClipPath.POLYGON) {
        elem = SvgShapeUtils.createElement('polygon');
        ToolkitUtils.setAttrNullNS(elem, 'points', region.points);
      } else if (region.type === ClipPath.ELLIPSE) {
        elem = SvgShapeUtils.createElement('ellipse');
        ToolkitUtils.setAttrNullNS(elem, 'cx', region.cx);
        ToolkitUtils.setAttrNullNS(elem, 'cy', region.cy);
        ToolkitUtils.setAttrNullNS(elem, 'rx', region.rx);
        ToolkitUtils.setAttrNullNS(elem, 'ry', region.ry);
      } else if (region.type === ClipPath.CIRCLE) {
        elem = SvgShapeUtils.createElement('circle');
        ToolkitUtils.setAttrNullNS(elem, 'cx', region.cx);
        ToolkitUtils.setAttrNullNS(elem, 'cy', region.cy);
        ToolkitUtils.setAttrNullNS(elem, 'r', region.r);
      }

      if (elem) ToolkitUtils.appendChildElem(elemClip, elem);
    }
  }

  return true;
};

/**
 * Adds a mask to the global defs element.
 * @param {dvt.Mask} mask The mask to add to the global defs
 * @param {dvt.Context} context The context to add the gradient defs element to
 * @return {boolean} True if the mask was successfully or already added, else false
 */
SvgShapeUtils.addMask = function (mask, context) {
  var id = mask.getId();
  if (!id) {
    return false;
  }

  var elemDefs = context.getDefs();
  if (!elemDefs) {
    return false;
  }

  // Check if mask for this id is already defined
  var defsChildren = elemDefs.childNodes;
  var len = defsChildren.length;
  for (var i = 0; i < len; i++) {
    var el = defsChildren[i];
    if (el.id === id) return true;
  }

  var elemMask = SvgShapeUtils.createElement('mask', id);
  context.appendDefs(elemMask);

  var gradient = mask.getGradient();
  var gradientId = SvgShapeUtils.addSpecialFill(gradient, context);

  var bounds = mask.getBounds();
  var rectElem = SvgShapeUtils.createElement('rect');
  ToolkitUtils.setAttrNullNS(rectElem, 'x', bounds.x);
  ToolkitUtils.setAttrNullNS(rectElem, 'y', bounds.y);
  ToolkitUtils.setAttrNullNS(rectElem, 'width', bounds.w);
  ToolkitUtils.setAttrNullNS(rectElem, 'height', bounds.h);
  ToolkitUtils.setAttrNullNS(rectElem, 'fill', ToolkitUtils.getUrlById(gradientId));
  ToolkitUtils.appendChildElem(elemMask, rectElem);
  return true;
};

/**
 * Adds a gradient or linear fill to the global defs element.
 * @param {GradientFill|PatternFill} fill The fill to add to the global defs
 * @param {dvt.Context} context The context to add the gradient defs element to
 * @return {string} The id of the special fill that was added to the global def.
 */
SvgShapeUtils.addSpecialFill = function (fill, context) {
  if (!fill._defPresent) {
    var elem = fill._defElem;
    if (!elem) {
      if (fill instanceof GradientFill) {
        fill._id = SvgShapeUtils.getUniqueId('Gr');
        elem = DvtSvgGradientUtils.createElem(fill, fill._id);
      } else if (fill instanceof PatternFill) {
        fill._id = SvgShapeUtils.getUniqueId('pat');
        elem = DvtSvgPatternFillUtils.createElem(fill, fill._id);
      }
    }
    fill._defElem = elem;
    context.appendDefs(elem);
    fill._defPresent = true;
  }
  return fill._id;
};

/**
 * Creates an SVG DOM element.
 * @param {String} name
 * @param {String} id  Optional ID to be applied to the created DOM element.
 * @return {Element} the DOM element
 */
SvgShapeUtils.createElement = function (name, id) {
  var elem = document.createElementNS(ToolkitUtils.SVG_NS, name);

  if (id) {
    ToolkitUtils.setAttrNullNS(elem, 'id', id);
  }

  return elem;
};

/**
 * Creates a unique ID string
 * @param {String} sPrefix  Optional string used as a prefix for the generated ID. If
 *                          omitted, the ID generated will be prefixed with '$'.
 * @return {String}        A unique ID string
 */
SvgShapeUtils.getUniqueId = function (sPrefix) {
  return (sPrefix ? sPrefix : '$') + SvgShapeUtils._uniqueSeed++;
};

/**
 * Converts an array of x,y coordinate pairs into an SVG style string.
 * @param {array} arPoints the array of points
 * @return {Array}  the string usable by SVG polygons and polylines
 */
SvgShapeUtils.convertPointsArray = function (arPoints) {
  var len = arPoints.length; // convert to svg space separated list
  var s = '';

  for (var i = 0; i < len; i++) {
    if (i > 0) {
      s += ' ';
    }
    s += arPoints[i];
  }
  return s;
};

/**
 * Utility functions for aria labels.
 * @class
 */
const AriaUtils = {
  ARIA_LABEL_STATE_DELIMITER: ', ',
  ARIA_LABEL_DESC_DELIMITER: '. ',

  /**
   * Returns a processed aria label where all supported HTML formatting characters are removed.
   * @param {string} label
   * @return {string}
   */
  processAriaLabel: function (label) {
    var ret = label;

    if (ret) {
      // Make all brackets consistent to simplify later searches
      ret = ret.replace(/(<|&#60;)/g, '&lt;');
      ret = ret.replace(/(>|&#62;)/g, '&gt;');

      // Strip out bold and italic tags
      ret = ret.replace(/&lt;b&gt;/g, '');
      ret = ret.replace(/&lt;\/b&gt;/g, '');
      ret = ret.replace(/&lt;i&gt;/g, '');
      ret = ret.replace(/&lt;\/i&gt;/g, '');

      // Replace logical newlines sequences with semicolons
      ret = ret.replace(/\n/g, '; ');
      ret = ret.replace(/&#92;n/g, '; ');
      ret = ret.replace(/&lt;br&gt;/g, '; ');
      ret = ret.replace(/&lt;br\/&gt;/g, '; ');
    }

    return ret;
  }
};

/**
 * @constructor
 */
const DvtSvgFilterContext = function () {
  this.Init();
};

Obj.createSubclass(DvtSvgFilterContext, Obj);

DvtSvgFilterContext.prototype.Init = function () {
  this._regionPctRect = new Rectangle(-10, -10, 120, 120);
  this._counter = 0;
};

DvtSvgFilterContext.prototype.getRegionPctRect = function () {
  return this._regionPctRect;
};

DvtSvgFilterContext.prototype.createResultId = function (id) {
  if (!id) {
    id = 'filtRes';
  }
  return id + this._counter++;
};

/**
 * @class Shadow
 * Represents an immutable drop shadow.
 *
 * @constructor
 * @param {number} dx            The x offset of the drop shadow.
 * @param {number} dy            The y offset of the drop shadow.
 * @param {number} stdDeviation  The standard deviation for the blur operation in the  drop shadow; equal to half of the blur radius.
 * @param {String} floodColor    The color and transparency of the shadow.
 */
const Shadow = function (dx, dy, stdDeviation, floodColor) {
  // The type of this draw effect
  this.__type = 'shadow';

  this._dx = dx;
  this._dy = dy;
  this._stdDeviation = stdDeviation;
  this._floodColor = floodColor;
  this._Id = 'ds' + Shadow._uniqueId++;
};

Obj.createSubclass(Shadow, Obj);

Shadow._uniqueId = 1;

/*---------------------------------------------------------------------------*/
/*   DvtSvgShadowUtils    A static class for SVG drop shadow property manip- */
/*                        ulation.                                           */
/*---------------------------------------------------------------------------*/
/**
 *  A static class for SVG drop shadow property manipulation.
 *  @class DvtSvgShadowUtils
 *  @constructor
 */
const DvtSvgShadowUtils = function () {};

Obj.createSubclass(DvtSvgShadowUtils, Obj);

/**
 * @private
 * @final
 */
DvtSvgShadowUtils.RADS_PER_DEGREE = Math.PI / 180;

DvtSvgShadowUtils.createFilterPrimitives = function (filt, shadow, svgDisplayable, filtContext) {
  var dx = shadow._dx;
  var dy = shadow._dy;
  var stdDeviation = shadow._stdDeviation;
  var floodColor = shadow._floodColor;
  const FLOOD_COLOR = 'flood-color';

  //:
  //if we have a boundsRect, increase the size of the filter so
  //that the shadow has room to display outside the shape
  var boundsRect = svgDisplayable.getDimensions(svgDisplayable.getParent());
  if (boundsRect) {
    //try to optimize based on how much of the shadow falls
    //on each side of the bounding box
    //use two times the blur by default, because using it directly
    //still clips the shadow
    var padding = 2 * stdDeviation;
    var padLeft = padding;
    var padRight = padding;
    var padTop = padding;
    var padBottom = padding;
    padLeft -= dx;
    padTop -= dy;
    padRight += dx;
    padBottom += dy;
    if (padLeft < 0) {
      padLeft = 0;
    }
    if (padTop < 0) {
      padTop = 0;
    }
    if (padRight < 0) {
      padRight = 0;
    }
    if (padBottom < 0) {
      padBottom = 0;
    }
    var ratioLeft = (padLeft / boundsRect.w) * 100;
    var ratioRight = (padRight / boundsRect.w) * 100;
    var ratioTop = (padTop / boundsRect.h) * 100;
    var ratioBottom = (padBottom / boundsRect.h) * 100;
    if (filtContext.getRegionPctRect().x > -ratioLeft) {
      filtContext.getRegionPctRect().x = -ratioLeft;
    }
    if (filtContext.getRegionPctRect().y > -ratioTop) {
      filtContext.getRegionPctRect().y = -ratioTop;
    }
    if (filtContext.getRegionPctRect().w < 100 + ratioLeft + ratioRight) {
      filtContext.getRegionPctRect().w = 100 + ratioLeft + ratioRight;
    }
    if (filtContext.getRegionPctRect().h < 100 + ratioTop + ratioBottom) {
      filtContext.getRegionPctRect().h = 100 + ratioTop + ratioBottom;
    }
  }
  // The bounding box does not take into accoutn stroke-width. Need to adjust for dvt.Line objects
  // TBD: the comment above mentions dvt.Line, but the condition below is only true for Polyline...
  if (svgDisplayable.requiresStrokeAdjustmentForShadow()) {
    var strokeWidth = svgDisplayable.getStroke().getWidth();
    // If stroke is wider than 1 pixel, adjust y coordinate and height of shadow bounding box
    if (strokeWidth > 1) {
      filtContext.getRegionPctRect().h = filtContext.getRegionPctRect().h + strokeWidth;
      filtContext.getRegionPctRect().y = filtContext.getRegionPctRect().y - strokeWidth;
    }
  }

  if (Agent.browser !== 'ie' && Agent.browser !== 'edge') {
    /*
     * <feDropShadow dx="<dx>" dy="<dy>" stdDeviation="<stdDeviation>" flood-color="<floodColor>"/>
     */
    var dropShadow = SvgShapeUtils.createElement('feDropShadow');
    ToolkitUtils.setAttrNullNS(dropShadow, 'dx', dx);
    ToolkitUtils.setAttrNullNS(dropShadow, 'dy', dy);
    ToolkitUtils.setAttrNullNS(dropShadow, 'stdDeviation', stdDeviation);
    ToolkitUtils.setAttrNullNS(dropShadow, FLOOD_COLOR, floodColor);
    ToolkitUtils.appendChildElem(filt, dropShadow);
  } else {
    /*
     * <feGaussianBlur stdDeviation="<stdDeviation>"/>
     * <feOffset dx="<dx>" dy="<dy>" result="<offsetResult>"/>
     * <feFlood flood-color="<floodColor>"/>
     * <feComposite in2="<offsetResult>" operator="in"/>
     * <feMerge>
     *   <feMergeNode/>
     *   <feMergeNode in="SourceGraphic"/>
     * </feMerge>
     */
    var gaussianBlur = SvgShapeUtils.createElement('feGaussianBlur');
    ToolkitUtils.setAttrNullNS(gaussianBlur, 'stdDeviation', stdDeviation);

    var offset = SvgShapeUtils.createElement('feOffset');
    var offsetResult = filtContext.createResultId('offset');
    ToolkitUtils.setAttrNullNS(offset, 'dx', dx);
    ToolkitUtils.setAttrNullNS(offset, 'dy', dy);
    ToolkitUtils.setAttrNullNS(offset, 'result', offsetResult);

    var flood = SvgShapeUtils.createElement('feFlood');
    // IE doesn't support transparency in flood-color, need to split into color + opacity
    var colorTokens = floodColor.split(/[\(,\)]/);
    if (colorTokens.length === 6) {
      // ["rgba/hsla", "r/h", "g/s", "b/l", "a", ""]
      ToolkitUtils.setAttrNullNS(
        flood,
        FLOOD_COLOR,
        `${colorTokens[0].substr(0, 3)}(${colorTokens[1]},${colorTokens[2]},${colorTokens[3]})`
      );
      ToolkitUtils.setAttrNullNS(flood, 'flood-opacity', colorTokens[4]);
    } else {
      ToolkitUtils.setAttrNullNS(flood, FLOOD_COLOR, floodColor);
    }

    var composite = SvgShapeUtils.createElement('feComposite');
    ToolkitUtils.setAttrNullNS(composite, 'in2', offsetResult);
    ToolkitUtils.setAttrNullNS(composite, 'operator', 'in');

    var merge = SvgShapeUtils.createElement('feMerge');
    var mergeNode1 = SvgShapeUtils.createElement('feMergeNode');
    var mergeNode2 = SvgShapeUtils.createElement('feMergeNode');
    ToolkitUtils.setAttrNullNS(mergeNode2, 'in', 'SourceGraphic');
    ToolkitUtils.appendChildElem(merge, mergeNode1);
    ToolkitUtils.appendChildElem(merge, mergeNode2);

    ToolkitUtils.appendChildElem(filt, gaussianBlur);
    ToolkitUtils.appendChildElem(filt, offset);
    ToolkitUtils.appendChildElem(filt, flood);
    ToolkitUtils.appendChildElem(filt, composite);
    ToolkitUtils.appendChildElem(filt, merge);
  }
};

/**
 *   Static SVG filter routines.
 *   @class DvtSvgFilterUtils
 *   @constructor
 */
const DvtSvgFilterUtils = function () {};

Obj.createSubclass(DvtSvgFilterUtils, Obj);

DvtSvgFilterUtils._counter = 0;

DvtSvgFilterUtils.createFilter = function (effects, svgDisplayable) {
  var filt = SvgShapeUtils.createElement('filter', DvtSvgFilterUtils.CreateFilterId());
  var filtContext = new DvtSvgFilterContext();
  for (var i = 0; i < effects.length; i++) {
    var effect = effects[i];
    if (effect) {
      DvtSvgFilterUtils.CreateFilterPrimitives(filt, effect, svgDisplayable, filtContext);
    }
  }

  // : When bounding box of svg element has zero height or width, userSpaceOnUse must be used
  // Otherwise, the element will disappear
  var userSpaceOnUse = false;
  if (svgDisplayable) {
    var boundsRect = svgDisplayable.getElem().getBBox();
    if (boundsRect) {
      var width = boundsRect.width;
      var height = boundsRect.height;
      if (height == 0 || width == 0) {
        var stroke;
        //if displayable is not a shape, for example a container, then it doesn't have a stroke
        if (svgDisplayable.getStroke) {
          stroke = svgDisplayable.getStroke();
        }
        var adjustWidth = 10;
        if (stroke) {
          adjustWidth = stroke.getWidth();
        }
        var x = boundsRect.x;
        var y = boundsRect.y;

        if (height == 0) {
          height = 2 * adjustWidth;
          y -= adjustWidth;
        }
        if (width == 0) {
          width = 2 * adjustWidth;
          x -= adjustWidth;
        }

        ToolkitUtils.setAttrNullNS(filt, 'x', x);
        ToolkitUtils.setAttrNullNS(filt, 'y', y);
        ToolkitUtils.setAttrNullNS(filt, 'width', width);
        ToolkitUtils.setAttrNullNS(filt, 'height', height);
        ToolkitUtils.setAttrNullNS(filt, 'filterUnits', 'userSpaceOnUse');
        userSpaceOnUse = true;
      }
    }
  }
  if (!userSpaceOnUse) {
    if (
      filtContext.getRegionPctRect().x != -10 &&
      filtContext.getRegionPctRect().x != 'Infinity' &&
      filtContext.getRegionPctRect().x != '-Infinity'
    ) {
      ToolkitUtils.setAttrNullNS(filt, 'x', filtContext.getRegionPctRect().x + '%');
    }
    if (
      filtContext.getRegionPctRect().y != -10 &&
      filtContext.getRegionPctRect().y != 'Infinity' &&
      filtContext.getRegionPctRect().y != '-Infinity'
    ) {
      ToolkitUtils.setAttrNullNS(filt, 'y', filtContext.getRegionPctRect().y + '%');
    }
    if (
      filtContext.getRegionPctRect().w != 120 &&
      filtContext.getRegionPctRect().w != 'Infinity' &&
      filtContext.getRegionPctRect().w != '-Infinity'
    ) {
      ToolkitUtils.setAttrNullNS(filt, 'width', filtContext.getRegionPctRect().w + '%');
    }
    if (
      filtContext.getRegionPctRect().h != 120 &&
      filtContext.getRegionPctRect().h != 'Infinity' &&
      filtContext.getRegionPctRect().h != '-Infinity'
    ) {
      ToolkitUtils.setAttrNullNS(filt, 'height', filtContext.getRegionPctRect().h + '%');
    }
  }

  return filt;
};

DvtSvgFilterUtils.CreateFilterPrimitives = function (filter, effect, svgDisplayable, filtContext) {
  if (effect instanceof Shadow) {
    DvtSvgShadowUtils.createFilterPrimitives(filter, effect, svgDisplayable, filtContext);
  }
  return null;
};

DvtSvgFilterUtils.CreateFilterId = function () {
  return 'filt' + DvtSvgFilterUtils._counter++;
};

// File containing all draw effect (filter) related functions defined on Displayable.

const _DRAW_EFFECT = {
  addDrawEffect: function (effect) {
    if (!this._drawEffects) {
      this._drawEffects = [];
    }

    this._drawEffects.push(effect);

    this._applyDrawEffects();
  },

  removeAllDrawEffects: function () {
    if (this._drawEffects) {
      this._drawEffects = null;
      this._applyDrawEffects(this._drawEffects);
    }
  },

  _applyDrawEffects: function () {
    var effects = this._drawEffects;

    // remove current filter
    // should be done before creating a new outerElem because the current filter lives in the current outerElem
    if (this._filter) {
      ToolkitUtils.removeAttrNullNS(this.getOuterElem(), 'filter');
      this.getCtx().removeDefs(this._filter);
      this._filter = null;
    }

    // Create an outer group if there is a matrix defined, since SVG applies transforms before filters.
    if (!this._outerElem && this._matrix) this._createOuterGroupElem();

    // add new filter if necessary
    if (effects && effects.length > 0) {
      // : Repaint bug in Firefox requires us to force a repaint after removing filter
      // At worst we will create n empty filters where n=# markers
      this._filter = DvtSvgFilterUtils.createFilter(effects, this);
      if (this._filter) {
        this.getCtx().appendDefs(this._filter);
        var filterId = ToolkitUtils.getAttrNullNS(this._filter, 'id');
        ToolkitUtils.setAttrNullNS(
          this.getOuterElem(),
          'filter',
          ToolkitUtils.getUrlById(filterId)
        );
      }
    }
  },

  // Overridden in Polyline (needed for Line as well?)
  requiresStrokeAdjustmentForShadow: function () {
    return false;
  }
};

/**
 * Abstract class for wrapper classes for native DOM events.
 * Internal events that do not wrap native DOM events should not extend this class.
 * @constructor
 */
const BaseEvent = function () {};

Obj.createSubclass(BaseEvent, Obj);

/**
 * Object initializer
 * @param {Object} event The native event
 * @protected
 */
BaseEvent.prototype.Init = function (event) {
  this.type = event.type;

  // Find the dvt.Obj corresponding to the event target
  this.target = BaseEvent.FindDisplayable(event.target);
  this._isPropagationStopped = false;
  this._event = event;
};

/**
 * Returns the native event that we are wrapping
 * @return {Object} The native event that we are wrapping
 */
BaseEvent.prototype.getNativeEvent = function () {
  return this._event;
};

/**
 * Prevents the default browser action that the native event would have triggered
 */
BaseEvent.prototype.preventDefault = function () {
  if (this._event.cancelable) this._event.preventDefault();
};

/**
 * Stops propagation of the native event in the browser's event bubbling phase.
 */
BaseEvent.prototype.stopPropagation = function () {
  if (this._event.stopPropagation) this._event.stopPropagation();
  this._event.cancelBubble = true;
  this._event.cancel = true;
  this._event.returnValue = false;
  this._isPropagationStopped = true;
};

/**
 * Checks whether event propagation was stopped
 * @return {boolean}
 */
BaseEvent.prototype.isPropagationStopped = function () {
  return this._isPropagationStopped;
};

/**
 * Given an SVG DOM target, returns the corresponding dvt.Displayable.
 * @param {DOMElement} target The original DOM element target
 * @return {dvt.Displayable} The corresponding displayable, if any.
 * @protected
 */
BaseEvent.FindDisplayable = function (target) {
  while (target) {
    // If this object has a displayable, return it
    if (target._obj) return target._obj;
    // Otherwise look at the parent
    else target = target.parentNode;
  }

  return null;
};

/**
 * @constructor
 * Wrapper class providing access to a Touch.
 * @extends {dvt.Obj}
 * @class Touch
 * <p>The supported fields are:
 * <ul>
 * <li>clientX</li>
 * <li>clientY</li>
 * <li>screenX</li>
 * <li>screenY</li>
 * <li>pageX</li>
 * <li>pageY</li>
 * <li>target</li>
 * <li>identifier</li>
 * </ul>
 * <p>
 */
const Touch = function (touch) {
  this.Init(touch);
};

Obj.createSubclass(Touch, Obj);

/**
 * @protected
 * @param {Touch} the DOM Touch
 */
Touch.prototype.Init = function (touch) {
  this.clientX = touch.clientX;
  this.clientY = touch.clientY;
  this.screenX = touch.screenX;
  this.screenY = touch.screenY;
  this.pageX = touch.pageX;
  this.pageY = touch.pageY;
  this.target = touch.target;
  this.identifier = touch.identifier == null || isNaN(touch.identifier) ? 1 : touch.identifier;
};

/**
 * Wrapper class for Touch Events.
 * @param {TouchEvent} event The DOM TouchEvent
 * @constructor
 */
const TouchEvent = function (event) {
  this.Init(event);
};

Obj.createSubclass(TouchEvent, BaseEvent);

// Constants for touch event types
//: indirectly assign the value so the closure compiler will abbreviate references to the constant
/** @const **/
TouchEvent.TOUCHSTART = 'touchstart';
/** @const **/
TouchEvent.TOUCHMOVE = 'touchmove';
/** @const **/
TouchEvent.TOUCHEND = 'touchend';
/** @const **/
TouchEvent.TOUCHCANCEL = 'touchcancel';

/**
 * @param {TouchEvent} event The DOM TouchEvent
 * @protected
 */
TouchEvent.prototype.Init = function (event) {
  TouchEvent.superclass.Init.call(this, event);
  // Convert touchcancel to touchend
  if (event.type == TouchEvent.TOUCHCANCEL) {
    this.type = TouchEvent.TOUCHEND;
  }
  this.touches = TouchEvent.createTouchArray(event.touches);
  this.targetTouches = TouchEvent.createTouchArray(event.targetTouches);
  this.changedTouches = TouchEvent.createTouchArray(event.changedTouches);

  this._touchManager = null;
};

/**
 * Blocks a touch hold event
 */
TouchEvent.prototype.blockTouchHold = function () {
  this.getNativeEvent()._touchHoldBlocked = true;
};

/**
 * Returns true if this is the initial touch event
 * @return {boolean}
 */
TouchEvent.prototype.isInitialTouch = function () {
  return this.touches.length - this.changedTouches.length == 0;
};

/**
 * Returns true if a touch hold event has been blocked and false otherwise.
 * @return {boolean}
 */
TouchEvent.prototype.isTouchHoldBlocked = function () {
  return this.getNativeEvent()._touchHoldBlocked ? true : false;
};

/**
 * Creates an array of DvtTouchEvents from native TouchEvents
 * @param {Array} nativeTouchArray The array of native touch events
 * @return {Array}
 */
TouchEvent.createTouchArray = function (nativeTouchArray) {
  var touches = new Array();
  for (var i = 0; i < nativeTouchArray.length; i++) {
    var nativeTouch = nativeTouchArray[i];
    var touch = new Touch(nativeTouch);
    touches.push(touch);
  }
  return touches;
};

/**
 * Prevents further propagation of the current event
 */
TouchEvent.prototype.stopPropagation = function () {
  TouchEvent.superclass.stopPropagation.call(this);
  if (this._touchManager) this._touchManager.postEventBubble(this);
};

/**
 * Sets a touch manager object
 * @param {TouchManager} touchManager The touch manager object for the event
 */
TouchEvent.prototype.setTouchManager = function (touchManager) {
  this._touchManager = touchManager;
};

/**
 * Platform independent class for Keyboard Events.
 * @constructor
 * @param {KeyboardEvent} event The DOM KeyboardEvent
 */
const KeyboardEvent = function (event) {
  this.Init(event);
};

Obj.createSubclass(KeyboardEvent, BaseEvent);

// Constants for keyboard event types
//: indirectly assign the value so the closure compiler will abbreviate references to the constant

/** Key down event type **/
KeyboardEvent.KEYDOWN = 'keydown';
/** Key up event type **/
KeyboardEvent.KEYUP = 'keyup';

/** Key press event type **/
KeyboardEvent.KEYPRESS = 'keypress';

/** Tab key **/
KeyboardEvent.TAB = 9;
/** Enter key **/
KeyboardEvent.ENTER = 13;
/** Shift key **/
KeyboardEvent.SHIFT = 16;
/** Control key **/
KeyboardEvent.CONTROL = 17;
/** Escape key **/
KeyboardEvent.ESCAPE = 27;
/** Space key **/
KeyboardEvent.SPACE = 32;
/** Page up key **/
KeyboardEvent.PAGE_UP = 33;
/** Page down key **/
KeyboardEvent.PAGE_DOWN = 34;
/** Up arrow key **/
KeyboardEvent.UP_ARROW = 38;
/** Down arrow key **/
KeyboardEvent.DOWN_ARROW = 40;
/** Left arrow key **/
KeyboardEvent.LEFT_ARROW = 37;
/** Right arrow key **/
KeyboardEvent.RIGHT_ARROW = 39;
/** F2 - used to navigate inside the item **/
KeyboardEvent.F2 = 113;
/** Open bracket key **/
KeyboardEvent.OPEN_BRACKET = 219;
/** Close bracket key **/
KeyboardEvent.CLOSE_BRACKET = 221;
/** Standard 0 key code **/
KeyboardEvent.ZERO = 48;
/** Numpad 0 key code **/
KeyboardEvent.NUMPAD_ZERO = 96;
/** Plus key **/
KeyboardEvent.NUMPAD_PLUS = 107;
/** Minus key **/
KeyboardEvent.NUMPAD_MINUS = 109;
/** Chrome/safari plus key **/
KeyboardEvent.WEBKIT_PLUS = 187;
/** Chrome/safari minus key **/
KeyboardEvent.WEBKIT_MINUS = 189;
/** Firefox plus key **/
KeyboardEvent.GECKO_PLUS = 61;
/** Firefox minus key **/
KeyboardEvent.GECKO_MINUS = 173;
/** Key code for letter M key **/
KeyboardEvent.M = 77;
/** Open angled bracket key **/
KeyboardEvent.OPEN_ANGLED_BRACKET = 188;
/** Closed angled bracket key **/
KeyboardEvent.CLOSE_ANGLED_BRACKET = 190;

/**
 * Object initializer.  This essentially mirrors the DOM initKeyboardEvent() API
 * @param {KeyboardEvent} event The DOM KeyboardEvent
 * @protected
 */
KeyboardEvent.prototype.Init = function (event) {
  KeyboardEvent.superclass.Init.call(this, event);
  this.bubbles = event.bubbles;
  this.cancelable = event.cancelable;
  this.view = event.view;
  this.charCode = event.charCode;
  this.keyCode = event.keyCode;
  this.location = event.location;
  this.ctrlKey = event.ctrlKey || event.metaKey; //treat the meat key same as ctrl;
  this.altKey = event.altKey;
  this.shiftKey = event.shiftKey;
  this.repeat = event.repeat;
  this.locale = event.locale;
};

/**
 * Utility method that returns true if the keyboard event is a plus keystroke. Handy because keycodes differ
 * across different render kits
 * @param {KeyboardEvent} event
 * @return {Boolean} true if the event is a "+" keystroke
 */
KeyboardEvent.isPlus = function (event) {
  var keyCode = event.keyCode;
  if (keyCode == KeyboardEvent.NUMPAD_PLUS) return true;

  if (Agent.browser === 'firefox') {
    // special case for Gecko/Firefox
    if (keyCode == KeyboardEvent.GECKO_PLUS && event.shiftKey) return true;
    else return false;
  } else {
    if (keyCode == KeyboardEvent.WEBKIT_PLUS && event.shiftKey) return true;
    else return false;
  }
};

/**
 * Utility method that returns true if the keyboard event is a equals keystroke. Handy because keycodes differ
 * across different render kits
 * @param {KeyboardEvent} event
 * @return {Boolean} true if the event is a "+" keystroke
 */
KeyboardEvent.isEquals = function (event) {
  var keyCode = event.keyCode;

  if (Agent.browser === 'firefox') {
    // special case for Gecko/Firefox
    if (keyCode == KeyboardEvent.GECKO_PLUS && !event.shiftKey) return true;
    else return false;
  } else {
    if (keyCode == KeyboardEvent.WEBKIT_PLUS && !event.shiftKey) return true;
    else return false;
  }
};

/**
 * Utility method that returns true if the keyboard event is a minus keystroke. Handy because keycodes differ
 * across different render kits
 * @param {KeyboardEvent} event
 * @return {Boolean} true if the event is a "-" keystroke
 */
KeyboardEvent.isMinus = function (event) {
  var keyCode = event.keyCode;

  if (keyCode == KeyboardEvent.NUMPAD_MINUS) return true;

  if (Agent.browser === 'firefox') {
    // special case for Gecko/Firefox
    if (keyCode == KeyboardEvent.GECKO_MINUS && !event.shiftKey) return true;
    else return false;
  } else {
    if (keyCode == KeyboardEvent.WEBKIT_MINUS && !event.shiftKey) return true;
    else return false;
  }
};

/**
 * Utility method that returns true if the keyboard event is an underscore keystroke. Handy because keycodes differ
 * across different render kits
 * @param {KeyboardEvent} event
 * @return {Boolean} true if the event is a "_" keystroke
 */
KeyboardEvent.isUnderscore = function (event) {
  var keyCode = event.keyCode;

  if (Agent.browser === 'firefox') {
    // special case for Gecko/Firefox
    if (keyCode == KeyboardEvent.GECKO_MINUS && event.shiftKey) return true;
    else return false;
  } else {
    if (keyCode == KeyboardEvent.WEBKIT_MINUS && event.shiftKey) return true;
    else return false;
  }
};

/**
 * @constructor
 * Platform independent class for Focus Events. This class roughly follows the DOM Level 3 API.
 * @param {FocusEvent} event The native FocusEvent
 */
const DvtFocusEvent = function (event) {
  this.Init(event);
};

Obj.createSubclass(DvtFocusEvent, BaseEvent);

/**
 * Focus event key
 */
DvtFocusEvent.FOCUS = 'focus';
/**
 * Focus in event key
 */
DvtFocusEvent.FOCUSIN = 'focusin';
/**
 * Focus out event key
 */
DvtFocusEvent.FOCUSOUT = 'focusout';
/**
 * Blur event key
 */
DvtFocusEvent.BLUR = 'blur';

/**
 * Object initializer.
 * @param {FocusEvent} event The native FocusEvent
 * @protected
 */
DvtFocusEvent.prototype.Init = function (event) {
  DvtFocusEvent.superclass.Init.call(this, event);
  this.bubbles = event.bubbles;
  this.cancelable = event.cancelable;
  this.view = event.view;
  // Find the dvt.Obj corresponding to the event target
  if (event.relatedTarget != null)
    this.relatedTarget = BaseEvent.FindDisplayable(event.relatedTarget);
};

/**
 * @constructor
 * Wrapper class for Mouse Events.  This class roughly follows the DOM Level 2 API.
 * @param {MouseEvent} event The DOM MouseEvent
 */
const MouseEvent = function (event) {
  this.Init(event);
};

Obj.createSubclass(MouseEvent, BaseEvent);

// Constants for mouse event types
//: indirectly assign the value so the closure compiler will abbreviate references to the constant
/** @const **/
MouseEvent.CLICK = 'click';
/** @const **/
MouseEvent.DBLCLICK = 'dblclick';
/** @const **/
MouseEvent.MOUSEOVER = 'mouseover';
/** @const **/
MouseEvent.MOUSEOUT = 'mouseout';
/** @const **/
MouseEvent.MOUSEDOWN = 'mousedown';
/** @const **/
MouseEvent.MOUSEUP = 'mouseup';
/** @const **/
MouseEvent.MOUSEMOVE = 'mousemove';
/** @const **/
MouseEvent.MOUSEWHEEL = 'wheel';

/** @const **/
MouseEvent.RIGHT_CLICK_BUTTON = 2;

/**
 * Object initializer. This essentially mirrors the DOM initMouseEvent() API
 * @param {MouseEvent} event The DOM MouseEvent
 * @protected
 */
MouseEvent.prototype.Init = function (event) {
  MouseEvent.superclass.Init.call(this, event);
  // Find the dvt.Obj corresponding to the event target
  if (event.relatedTarget != null)
    this.relatedTarget = BaseEvent.FindDisplayable(event.relatedTarget);

  // Copy the remaining information
  this.button = event.button;
  this.ctrlKey = event.ctrlKey || event.metaKey;
  this.shiftKey = event.shiftKey;
  this.pageX = event.pageX;
  this.pageY = event.pageY;
  //: Flag indicates if the event is modified for Internet Explorer
  this._isEventModifiedForIE = false;

  if (event.wheelDeltaY != null) this.wheelDelta = event.wheelDeltaY / 40;
  else if (event.deltaY != null) {
    this.deltaMode = event.deltaMode;
    this.deltaY = event.deltaY;

    // Approximate the wheel delta from the deltaY and deltaMode
    if (event.deltaMode == event.DOM_DELTA_LINE) this.wheelDelta = -event.deltaY;
    else if (event.deltaMode == event.DOM_DELTA_PIXEL) this.wheelDelta = -event.deltaY / 15;
  } else if (event.wheelDelta != null) this.wheelDelta = event.wheelDelta / 40;
  else this.wheelDelta = event.detail;
};

/**
 * Modify the event for IE with the new event type and new target element
 * @param {string} newType  New MouseEvent type
 * @param {DOMElement} newTargetElement  New SVG DOM Target Element
 */
MouseEvent.prototype.modifyEventForIE = function (newType, newTargetElement) {
  //: Set the event type as newType, relatedTarget as current target and target as displayable of newTargetElement
  //This will target the event to newTargetElement and change the event type
  //Modify the event target only once because every MouseEvent instance has unique native event.
  //Doing this more than once will make relatedTarget and target same as displayable of newTargetElement
  if (!this._isEventModifiedForIE) {
    this.type = newType;
    this.relatedTarget = this.target;
    this.target = BaseEvent.FindDisplayable(newTargetElement);
    this._isEventModifiedForIE = true;
  }
};

/**
 * Event factory for DOM events.
 * @class
 */
const DomEventFactory = new Object();

Obj.createSubclass(DomEventFactory, Obj);

// Note: this doesn't need to live in the factory because it will always be called
// by impl specific code looking to wrap the event.
/**
 * Creates a DVT wrapper for a mouse, keyboard, focus or touch event
 * @param {MouseEvent|KeyboardEvent|TouchEvent|FocusEvent} nativeEvent native event
 * @param {dvt.Context} context rendering context
 * @return {dvt.BaseEvent} a wrapper for a mouse, keyboard, focus or touch event
 */
DomEventFactory.newEvent = function (nativeEvent, context) {
  // TODO detect the event type and perform wrapping as needed
  var eventType = nativeEvent.type;
  if (
    eventType == TouchEvent.TOUCHSTART ||
    eventType == TouchEvent.TOUCHMOVE ||
    eventType == TouchEvent.TOUCHEND ||
    eventType == TouchEvent.TOUCHCANCEL
  ) {
    return new TouchEvent(nativeEvent);
  } else if (
    eventType == KeyboardEvent.KEYDOWN ||
    eventType == KeyboardEvent.KEYUP ||
    eventType == KeyboardEvent.KEYPRESS
  ) {
    return new KeyboardEvent(nativeEvent);
  } else {
    //: if the native event is the same as the last one, return the stored logical event,
    //otherwise create a new logical event and store the pair of events
    if (context._nativeEvent != nativeEvent) {
      context._nativeEvent = nativeEvent;
      if (
        eventType == DvtFocusEvent.FOCUS ||
        eventType == DvtFocusEvent.FOCUSIN ||
        eventType == DvtFocusEvent.FOCUSOUT ||
        eventType == DvtFocusEvent.BLUR
      ) {
        context._logicalEvent = new DvtFocusEvent(nativeEvent);
      } else {
        // default to mouse event
        context._logicalEvent = new MouseEvent(nativeEvent);
      }
    }
    return context._logicalEvent;
  }
};

/**
 * Utility class for providing keyboard listeners to add to HTML divs
 * @class HtmlKeyboardListenerUtils
 */
const HtmlKeyboardListenerUtils = function () {};

Obj.createSubclass(HtmlKeyboardListenerUtils, Obj);

/**
 * @param {Boolean} useCapture True if the listener is to be used in the event capture phase,
 *                             false if the listener is to be used in the event bubble phase
 * @return {function} A function that can be used as an event listener during the bubble or capture phase
 */
HtmlKeyboardListenerUtils.getListener = function (useCapture) {
  if (useCapture) return HtmlKeyboardListenerUtils._captureListener;
  else return HtmlKeyboardListenerUtils._bubbleListener;
};

/**
 * The event listener that is called by the implementation object's bubble phase listeners.
 * This function will wrap the event and delegate to the real event listeners.
 * @param {object} event the DOM event object
 * @this {object} the platform object actively processing the event object with an event listener
 * @private
 */
HtmlKeyboardListenerUtils._bubbleListener = function (event) {
  HtmlKeyboardListenerUtils._commonListener.call(this, event, false);
};

/**
 * The event listener that is called by the implementation object's capture phase listeners.
 * This function will wrap the event and delegate to the real event listeners.
 * @param {object} event the DOM event object
 * @this {object} the platform object actively processing the event object with an event listener
 * @private
 */
HtmlKeyboardListenerUtils._captureListener = function (event) {
  HtmlKeyboardListenerUtils._commonListener.call(this, event, true);
};

/**
 * The event listener that is called by the implementation object's bubble and capture phase listeners.
 * This function will wrap the event and delegate to the real event listeners.
 * @param {object} event the DOM event object
 * @param {boolean} useCapture True if the listener is to be used in the event capture phase,
 *                             false if the listener is to be used in the event bubble phase
 * @this {object} the platform object actively processing the event object with an event listener
 * @private
 */
HtmlKeyboardListenerUtils._commonListener = function (event, useCapture) {
  var dvtEvent;
  if (this._currentObj) {
    // fire to the current listener only
    if (event.type == 'focus') {
      //  - store the focus event until next keyboard event.
      // On the next keyboard event we can make a decision, if the focus should be reset to the first subcomponent or the last one.
      // There is no harm in storing the event, if the event was caused by a mouse click.
      this._focusEvent = event;
      return;
    }
    var ctx = this._currentObj.getCtx();
    if (this._focusEvent) {
      ctx.resetCurrentKeyboardFocus(event);
      dvtEvent = DomEventFactory.newEvent(this._focusEvent, ctx);
      this._currentObj.FireListener(dvtEvent, useCapture);
      this._focusEvent = null;
    }
    dvtEvent = DomEventFactory.newEvent(event, ctx);
    this._currentObj.FireListener(dvtEvent, useCapture);
  } else if (Array.isArray(this._keyboardListeners)) {
    // fire to all listeners
    var svgObj;
    var length = this._keyboardListeners.length;
    for (var i = 0; i < length; i++) {
      svgObj = this._keyboardListeners[i];
      dvtEvent = DomEventFactory.newEvent(event, svgObj.getCtx());
      svgObj.FireListener(dvtEvent, useCapture);
    }
  }
};

// File containing all event listener related functions defined on Displayable.

const _EVENT = {
  /**
   * Adds an event listener.
   * @param {string} type the event type
   * @param {function} listener the function to call
   * @param {object|boolean} options options for the event listener or a boolean to indicate
   *                                 whether the listener operates in the capture phase
   * @param {object} obj instance of the object the listener is defined on
   */
  addEvtListener: function (type, listener, options, obj) {
    // Extract useCapture from options
    var useCapture = ToolkitUtils.getUseCaptureFromOptions(options);

    // Store a reference to the listener
    var listenersArray = this._getListeners(type, useCapture, true);
    listenersArray.push(listener);
    listenersArray.push(obj);

    // Call the impl so that it can add the actual listener
    this._addListener(type, options);
  },

  /**
   * Removes an event listener.
   * @param {string} type the event type
   * @param {function} listener the function to call
   * @param {object|boolean} options options for the event listener or a boolean to indicate
   *                                 whether the listener operates in the capture phase
   * @param {object} obj instance of the object the listener is defined on
   */
  removeEvtListener: function (type, listener, options, obj) {
    // Extract useCapture from options
    var useCapture = ToolkitUtils.getUseCaptureFromOptions(options);

    // Remove the listener
    var listenersArray = this._getListeners(type, useCapture, false);
    if (listenersArray) {
      for (var i = 0; i < listenersArray.length; i += 2) {
        if (listenersArray[i] === listener && listenersArray[i + 1] === obj) {
          listenersArray.splice(i, 2);
          break;
        }
      }
    }

    // Call the impl so that it can remove the actual listener.
    // Note that the array itself is intentionally not removed.
    if (listenersArray && listenersArray.length <= 0) this._removeListener(type, options);
  },

  /**
   * Adds listener to the DOM element.
   * @param {string} type
   * @param {function} listener
   * @param {object|boolean} options options for the event listener or a boolean to indicate
   *                                 whether the listener operates in the capture phase
   * @protected
   */
  AddElemListener: function (type, listener, options) {
    ToolkitUtils.addDomEventListener(this.getElem(), type, listener, options);
    if (type == TouchEvent.TOUCHEND) {
      ToolkitUtils.addDomEventListener(
        this.getElem(),
        TouchEvent.TOUCHCANCEL,
        listener,
        options
      );
    }
  },

  /**
   * Notifies all applicable event listeners of the given event.
   * @param {DvtMouseEvent} event
   * @param {boolean} useCapture whether the listener operates in capture phase
   * @protected
   */
  FireListener: function (event, useCapture) {
    var listenersArray = this._getListeners(event.type, useCapture, false);
    if (listenersArray) {
      for (var i = 0; i < listenersArray.length; i += 2) {
        var obj = listenersArray[i + 1];
        if (listenersArray[i]) {
          listenersArray[i].call(obj, event);
        }
      }
    }
  },

  /**
   * Notifies all applicable event listeners of the given keyboard event.
   * @param {DvtKeyboardEvent} event
   * @param {boolean} useCapture whether the listener operates in capture phase
   */
  fireKeyboardListener: function (event, useCapture) {
    this.FireListener(event, useCapture);
  },

  /**
   * Returns the listeners of the given event type and capture mode.
   * @param {string} type the event type
   * @param {string} useCapture whether the listener operates in the capture phase
   * @param {boolean} createNew whether the array should be created if it doesn't exist
   * @return {array} the mutable Array of listeners
   * @private
   */
  _getListeners: function (type, useCapture, createNew) {
    // First find the object where the listener arrays are stored
    if (!this._listenerObj) {
      if (createNew) {
        this._listenerObj = {};
      } else {
        return null;
      }
    }

    // Then find the array for this event type, creating if necessary
    var eventKey = type + '_' + (useCapture ? true : false); // for example: "click_true"
    var listenersArray = this._listenerObj[eventKey];
    if (!listenersArray && createNew) {
      listenersArray = [];
      this._listenerObj[eventKey] = listenersArray;
    }

    return listenersArray;
  },

  /**
   * Adds an event listener.
   * @param {String} type the event type
   * @param {object|boolean} options options for the event listener or a boolean to indicate
   *                                 whether the listener operates in the capture phase
   * @private
   */
  _addListener: function (type, options) {
    // Extract useCapture from options
    var useCapture = ToolkitUtils.getUseCaptureFromOptions(options);
    var listener = this._getListener(useCapture);
    // on keyboard events, add the listener to the component's wrapping div, since SVG
    // DOM elements don't support keystrokes.
    if (
      type == KeyboardEvent.KEYUP ||
      type == KeyboardEvent.KEYDOWN ||
      type == KeyboardEvent.KEYPRESS ||
      type == DvtFocusEvent.FOCUS ||
      type == DvtFocusEvent.FOCUSIN ||
      type == DvtFocusEvent.FOCUSOUT ||
      type == DvtFocusEvent.BLUR
    ) {
      var context = this.getCtx();
      var stage = context.getStage();
      var wrappingDiv = stage.getSVGRoot().parentNode;
      if (!wrappingDiv) return;

      // allow support for multiple displayables to receive keyboard events
      // TODO: replace this with a singular compound event manager that
      //       will dispatch keyboard events to individual event managers
      if (!wrappingDiv._keyboardListeners) {
        wrappingDiv._keyboardListeners = [];
      }
      if (wrappingDiv._keyboardListeners.indexOf(this) == -1) {
        wrappingDiv._keyboardListeners.push(this);
      }
      listener = HtmlKeyboardListenerUtils.getListener(useCapture);
      ToolkitUtils.addDomEventListener(wrappingDiv, type, listener, options);
    } else {
      this.AddElemListener(type, listener, options);
    }
  },

  /**
   * Removes an event listener.
   * @param {string} type the event type
   * @param {object|boolean} options options for the event listener or a boolean to indicate
   *                                 whether the listener operates in the capture phase
   * @private
   */
  _removeListener: function (type, options) {
    // Extract useCapture from options
    var useCapture = ToolkitUtils.getUseCaptureFromOptions(options);
    var listener = this._getListener(useCapture);

    if (
      type == KeyboardEvent.KEYUP ||
      type == KeyboardEvent.KEYDOWN ||
      type == KeyboardEvent.KEYPRESS ||
      type == DvtFocusEvent.FOCUS ||
      type == DvtFocusEvent.FOCUSIN ||
      type == DvtFocusEvent.FOCUSOUT ||
      type == DvtFocusEvent.BLUR
    ) {
      // Keyboard listeners are attached to the wrapping div and tracked via an array stored using _keyboardListeners.
      var wrappingDiv = this.getCtx().getStage().getSVGRoot().parentNode;
      ToolkitUtils.removeDomEventListener(wrappingDiv, type, listener, options);
      var index = wrappingDiv._keyboardListeners.indexOf(this);
      if (index !== -1) wrappingDiv._keyboardListeners.splice(index, 1);
    } else ToolkitUtils.removeDomEventListener(this.getElem(), type, listener, options);
  },

  /**
   * Returns a function that will handle events with the specified useCapture value.
   * @param {boolean} useCapture
   * @return {function}
   * @private
   */
  _getListener: function (useCapture) {
    var thisRef = this;
    if (useCapture) {
      if (!this._captureClosure) {
        this._captureClosure = function (event) {
          thisRef._captureListener(event);
        };
      }
      return this._captureClosure;
    } else {
      if (!this._bubbleClosure) {
        this._bubbleClosure = function (event) {
          thisRef._bubbleListener(event);
        };
      }
      return this._bubbleClosure;
    }
  },

  /**
   *  Moving an object in the dom for IE/Edge causes mouse over/out events to fire if the moved item is under the mouse
   *  Ensure events are not repeatedly called in such a case
   *  @param {object} event the DOM event
   *  @param {boolean} useCapture
   */
  _shouldIgnoreEvent: function (event, useCapture) {
    var hoverItem = useCapture ? this._captureHoverItem : this._bubbleHoverItem;
    if (hoverItem) {
      if (event.type === MouseEvent.MOUSEOVER) {
        // mouse is going from relatedTarget to target
        return hoverItem === event.target;
      }
      if (event.type === MouseEvent.MOUSEOUT) {
        // mouse is going from target to relatedTarget
        return hoverItem === event.relatedTarget;
      }
    }
    return false;
  },

  /**
   *  After firing a mouseover event, DOM reparenting can cause IE/Edge to sometimes fire:
   *  a) a mouseover on a different element, without an intervening mouseout or
   *  b) a mouseout on a different element, usually a parent
   *  In either case,  we want to make sure a mouseout is handled on the original element to allow cleanup (e.g. hideHoverEffect) to occur
   *  @param {object} event the DOM event
   *  @param {boolean} useCapture
   */
  _fireMissedEvent: function (event, useCapture) {
    if (event.type === MouseEvent.MOUSEOVER || MouseEvent.MOUSEOUT) {
      var hoverItem = useCapture ? this._captureHoverItem : this._bubbleHoverItem;
      if (hoverItem) {
        if (hoverItem !== event.target) {
          var dvtEvent = DomEventFactory.newEvent(event, this.getCtx());
          // : Set the event as MOUSEOUT event, target as hoverItem, relatedTarget as event.target
          // This is equivalent to firing new MOUSEOUT event for hoverItem
          dvtEvent.modifyEventForIE(MouseEvent.MOUSEOUT, hoverItem);
          this.FireListener(dvtEvent, useCapture);
        }
      }
    }
  },

  /**
   * The event listener that is called by the implementation object's bubble phase listeners.
   * This function will wrap the event and delegate to the real event listeners.
   * @param {object} event the DOM event object
   * @this {object} the platform object actively processing the event object with an event listener
   * @private
   */
  _bubbleListener: function (event) {
    if (Agent.browser === 'ie' || Agent.browser === 'edge') {
      if (this._shouldIgnoreEvent(event, false)) {
        return;
      }
      this._fireMissedEvent(event, false);
      if (event.type == MouseEvent.MOUSEOVER) {
        this._bubbleHoverItem = event.target;
      } else if (event.type == MouseEvent.MOUSEOUT) {
        this._bubbleHoverItem = null;
      }
    }

    var dvtEvent = DomEventFactory.newEvent(event, this.getCtx());
    this.FireListener(dvtEvent, false);
  },

  /**
   * The event listener that is called by the implementation object's capture phase listeners.
   * This function will wrap the event and delegate to the real event listeners.
   * @param {object} event the DOM event object
   * @this {object} the platform object actively processing the event object with an event listener
   * @private
   */
  _captureListener: function (event) {
    if (Agent.browser === 'ie' || Agent.browser === 'edge') {
      if (this._shouldIgnoreEvent(event, true)) {
        return;
      }
      this._fireMissedEvent(event, true);
      if (event.type == MouseEvent.MOUSEOVER) {
        this._captureHoverItem = event.target;
      } else if (event.type == MouseEvent.MOUSEOUT) {
        this._captureHoverItem = null;
      }
    }
    var dvtEvent = DomEventFactory.newEvent(event, this.getCtx());
    this.FireListener(dvtEvent, true);
  }
};

/**
 * @constructor
 * CSSGradient
 */
const CSSGradient = function (type) {
  this.Init(type);
};

Obj.createSubclass(CSSGradient, Obj);

CSSGradient.LINEAR = 0;
CSSGradient.RADIAL = 1;

CSSGradient.prototype.Init = function (type) {
  this._type = type;
};

/**
 *   Returns an array of alpha's.
 *   @type {Array}
 */
CSSGradient.prototype.getAlphas = function () {
  return this._arAlphas;
};

/**
 *  Sets the alphas of the gradient.
 *  @param {Array} arAlphas  The array of alphas
 */
CSSGradient.prototype.setAlphas = function (arAlphas) {
  this._arAlphas = arAlphas;
};

/**
 *   Returns an array of colors.
 *   @type {Array}
 */
CSSGradient.prototype.getColors = function () {
  return this._arColors;
};

/**
 *  Sets the colors of the gradient.
 *  @param {Array} arColors  The array of colors
 */
CSSGradient.prototype.setColors = function (arColors) {
  this._arColors = arColors;
};

/**
 *   Returns an array of stop ratios.
 *   @type {Array}
 */
CSSGradient.prototype.getRatios = function () {
  return this._arRatios;
};

/**
 *  Sets the ratios of the gradient.
 *  @param {Array} arRatios  The array of ratios
 */
CSSGradient.prototype.setRatios = function (arRatios) {
  this._arRatios = arRatios;
};

/**
 * @constructor
 * DvtLinearGradient
 */
const DvtLinearGradient = function () {
  this.Init();
};

/*
 * make CSSGradient a subclass of DvtLinearGradient
 */
Obj.createSubclass(DvtLinearGradient, CSSGradient);

//convert sides into an angle (in radian)
//Note: in toolkit, angles are in degree (not radian)
DvtLinearGradient.LEFT = 0; //0;
DvtLinearGradient.BOTTOM_LEFT = 45;
DvtLinearGradient.BOTTOM = 90; //Math.PI / 2;
DvtLinearGradient.BOTTOM_RIGHT = 135;
DvtLinearGradient.RIGHT = 180; //Math.PI;
DvtLinearGradient.TOP_RIGHT = 225;
DvtLinearGradient.TOP = 270; //3 * Math.PI / 2;
DvtLinearGradient.TOP_LEFT = 315;

DvtLinearGradient.prototype.Init = function () {
  DvtLinearGradient.superclass.Init.call(this, CSSGradient.LINEAR);
};

/*---------------------------------------------------------------------*/
/*   get/setAngle()                                                    */
/*---------------------------------------------------------------------*/
/**
 *  Returns the angle of the gradient.
 *  @return {number} the angle of the gradient.
 */
DvtLinearGradient.prototype.getAngle = function () {
  // return angle
  // usage:
  // angle = Math.atan2(hh, ww)
  // var fill_matrix:Matrix = new Matrix();
  // fill_matrix.createGradientBox(ww, hh, angle, xx, yy);

  return this._angle;
};

/**
 *  Sets the angle of the gradient.
 *  @param {number} angle  The angle of the gradient.
 */
DvtLinearGradient.prototype.setAngle = function (angle) {
  this._angle = angle;
};

const DvtColorParser = {
  /**
   * @param {String} sval a string that is presumed to start with a color
   * @param {Array<String>} cArray the array that the parsed color should be pushed to
   * @return {String} the input val with the parsed color chopped off
   */
  parseLeadingColor: function (sval, cArray) {
    var val = sval.trim();
    var strLen = val.length;
    var endIndex = -1;
    var colorObj;

    if (!val) {
      return val;
    }
    // rgb format?
    if (val.indexOf('rgb') == 0) {
      endIndex = val.indexOf(')') + 1;
      colorObj = val.slice(0, endIndex);
    } else {
      // color name?
      endIndex = val.indexOf(' ');
      if (endIndex == -1) endIndex = strLen;
      var singleColor = val.slice(0, endIndex);

      colorObj = ColorUtils.getColorFromName(singleColor);

      // hex color
      if (!colorObj) {
        colorObj = DvtColorParser.parseHexColor(singleColor);
      }
    }

    if (colorObj) {
      cArray.push(colorObj);
      val = val.slice(endIndex);
    }
    return val;
  },

  // val is a string in #AARRGGBB or #RRGGBB format
  parseHexColor: function (val) {
    if (!val) return null;

    // assume black if we didn't get a valid numeric string or hex format
    // accept 8-digit hex format for border color
    return val.charAt(0) !== '#' || isNaN('0x' + val.substring(1)) ? '#000000' : val;
  }
};

/**
 * parse gradient string into gradient object
 * @class GradientParser
 * @constructor
 */
const GradientParser = function () {};

Obj.createSubclass(GradientParser, Obj);

//W3C CSS3 gradient
GradientParser.GD_LINEAR = 'linear-gradient';

GradientParser.GD_TOP = 'top';
GradientParser.GD_BOTTOM = 'bottom';
GradientParser.GD_LEFT = 'left';
GradientParser.GD_RIGHT = 'right';
GradientParser.GD_TO = 'to';

/**
 * Parse a gradient style String and turn it into a CSSStyle.
 * @param {String} gradient string
 * @return a CSSGradient object if it is a gradient value,
 *         a null otherwise.
 */
GradientParser.parseCSSGradient = function (gradient) {
  if (gradient != null) {
    gradient = gradient.trim();

    if (GradientParser._startsWith(gradient, GradientParser.GD_LINEAR)) {
      gradient = GradientParser._removeParenthesis(gradient, GradientParser.GD_LINEAR);
      return GradientParser._parseLinearGradient(gradient);
    }
  }
  return null;
};

/****************************************************************
   CSS3 - http://dev.w3.org/csswg/css3-images/#gradients

   <linear-gradient> = linear-gradient(
      [ [ <angle> | to <side-or-corner> ] ,]?
      <color-stop>[, <color-stop>]+
   )

   <side-or-corner> = [left | right] || [top | bottom]

/(([0-9]+)(deg|rad|grad)|\s*(to\s+)?((left|right)\s+)?(top|bottom)?\s*,\s*)?/i

/(#[0-9a-f]+|rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)|rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d?)(\.\d+)?\s*\)|[a-z]+)(\s+\d+%)?/gi


  ******************************************************************/

GradientParser._parseLinearGradient = function (gradient) {
  var number = new RegExp('(-?(?:\\d*\\.)?\\d+)');
  var angleUnit = new RegExp('(deg|rad|grad|turn)');
  var horiz = new RegExp('(left|right)');
  var vert = new RegExp('(top|bottom)');
  var to = new RegExp('(?:(to)\\s+)');
  var angle = new RegExp('(?:' + number.source + angleUnit.source + ')');
  var horizThenVert = new RegExp('(?:' + horiz.source + '(?:\\s+' + vert.source + ')?)');
  var vertThenHoriz = new RegExp('(?:' + vert.source + '(?:\\s+' + horiz.source + ')?)');
  var sideOrCorner = new RegExp('(?:' + horizThenVert.source + '|' + vertThenHoriz.source + ')');
  var direction = new RegExp(
    '(?:' + angle.source + '|(?:' + to.source + '?' + sideOrCorner.source + '))'
  );
  var everythingBeforeColorStops = new RegExp('(?:\\s*' + direction.source + '\\s*,\\s*)', 'i');
  var sides = gradient.match(everythingBeforeColorStops);

  if (sides == null || sides.length == 0) return null;

  // sides
  // 0: match string
  // 1: angle
  // 2: angle unit
  // 3: to (if present)
  // 4: horiz (if horizThenVert)
  // 5: vert (if horizThenVert)
  // 6: vert (if vertThenHoriz)
  // 7: horiz (if vertThenHoriz)

  var size = sides.length;
  var gradObj = new DvtLinearGradient();

  var bTop = sides[5] == GradientParser.GD_TOP || sides[6] == GradientParser.GD_TOP;
  var bBottom = sides[5] == GradientParser.GD_BOTTOM || sides[6] == GradientParser.GD_BOTTOM;
  var bLeft = sides[4] == GradientParser.GD_LEFT || sides[7] == GradientParser.GD_LEFT;
  var bRight = sides[4] == GradientParser.GD_RIGHT || sides[7] == GradientParser.GD_RIGHT;
  var bTo = sides[3] == GradientParser.GD_TO;
  if (bTo) {
    // specifying end rather than start, swap top/bottom, left/right if specified
    if (bTop || bBottom) {
      bTop = !bTop;
      bBottom = !bBottom;
    }

    if (bLeft || bRight) {
      bLeft = !bLeft;
      bRight = !bRight;
    }
  }

  // top left | top right | top
  if (bTop) {
    if (bLeft) {
      gradObj.setAngle(DvtLinearGradient.TOP_LEFT);
    } else if (bRight) {
      gradObj.setAngle(DvtLinearGradient.TOP_RIGHT);
    } else {
      gradObj.setAngle(DvtLinearGradient.TOP);
    }
  }
  // bottom left | bottom right | bottom
  else if (bBottom) {
    if (bLeft) {
      gradObj.setAngle(DvtLinearGradient.BOTTOM_LEFT);
    } else if (bRight) {
      gradObj.setAngle(DvtLinearGradient.BOTTOM_RIGHT);
    } else {
      gradObj.setAngle(DvtLinearGradient.BOTTOM);
    }
  } else if (bLeft) {
    gradObj.setAngle(DvtLinearGradient.LEFT);
  } else if (bRight) {
    gradObj.setAngle(DvtLinearGradient.RIGHT);
  }
  // parse angle if specified
  else if (sides[2]) {
    var angle = parseFloat(sides[1]);

    if (!isNaN(angle)) {
      if (sides[2] == 'grad') {
        angle = (angle / 200) * 180;
      } else if (sides[2] == 'rad') {
        angle = (angle / Math.PI) * 180;
      } else if (sides[2] == 'turn') {
        angle = (angle / 0.5) * 180;
      }
      //TODO: dont need to convert negative angle to positive
      //because beginGradientFill take negative angle
      //      angle = angle % (2 * Math.PI);
      //      if (angle < 0) {
      //        angle += 2 * Math.PI;
      //      }

      gradObj.setAngle(angle);
    }
  }

  // parse colorStops
  gradient = gradient.substring(sides[0].length);
  GradientParser._parseCSSColorStops(gradient, gradObj);

  return gradObj;
};

/**
 * Parse Gradient CSS Color Stops
 * @private
 * @param {string} s  style attribute
 * @param {dvt.CSSGradient} gradObj  Gradient object
 */
GradientParser._parseCSSColorStops = function (s, gradObj) {
  var colorStops = s.match(
    /(#[0-9a-f]+|rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)|rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d?)(\.\d+)?\s*\)|[a-z]+)(\s+\d+\.?\d*%)?/gi
  );

  if (colorStops != null && colorStops.length > 0) {
    GradientParser._parseColorStops(colorStops, gradObj);
  }
};

GradientParser._parseColorStops = function (colorStops, gradObj) {
  var size = colorStops.length;
  var alphas = [];
  var colors = [];
  var ratios = [];
  var alphaColor;
  var position;
  var noRatio = true;
  var sPosition;
  var colorArray = [];

  for (var i = 0; i < colorStops.length; i++) {
    sPosition = DvtColorParser.parseLeadingColor(colorStops[i], colorArray);
    alphaColor = colorArray.pop();

    colors[i] = alphaColor;
    alphas[i] = ColorUtils.getAlpha(alphaColor);

    sPosition = sPosition.trim();
    if (sPosition.length > 0) {
      position = parseFloat(sPosition);
      if (!isNaN(position)) {
        //NOTE: support % but not length or ratio.
        if (sPosition.endsWith('%')) {
          ratios[i] = position / 100;
          noRatio = false;
        }
      }
    }
  }

  // no location is specified, even space is assumed
  if (size > 1 && noRatio) {
    for (var r = 0; r < size; r++) {
      ratios[r] = r / (size - 1);
    }
  } else if (noRatio) {
    ratios[0] = 0;
  }

  gradObj.setColors(colors);
  gradObj.setAlphas(alphas);
  gradObj.setRatios(ratios);
};

GradientParser._removeParenthesis = function (gradient, keyWord) {
  if (gradient.charAt(gradient.length - 1) != ')') return null;

  // remove keyWord and parethesis around it
  gradient = gradient.substring(keyWord.length);

  return GradientParser.removeQuotes(gradient, '(', ')');
};

GradientParser.removeQuotes = function (colorStr, openQ, closeQ) {
  // remove quote around the color string
  colorStr = colorStr.trim();
  if (colorStr.charAt(0) != openQ) return colorStr;

  if (closeQ == null) closeQ = openQ;

  var iStart = 1;
  var iEnd = colorStr.lastIndexOf(closeQ);
  if (iEnd < 0) return colorStr.substring(iStart);

  return colorStr.substring(iStart, iEnd);
};

GradientParser._startsWith = function (str, value) {
  return str.indexOf(value) == 0;
};

/**
 * @constructor
 * Represents a set of CSS styles.
 * @param {string|object} style inlineStyle string/object
 */
const CSSStyle = function (style) {
  this.Init(style);
};

Obj.createSubclass(CSSStyle, Obj);

CSSStyle.DEFAULT_FONT_SIZE = '12px';

/** @const **/
CSSStyle.SKIN_ALTA = 'alta';

// Background Properties
CSSStyle.BACKGROUND = 'background';
CSSStyle.BACKGROUND_COLOR = 'background-color';
CSSStyle.BACKGROUND_IMAGE = 'background-image';
CSSStyle.BACKGROUND_REPEAT = 'background-repeat';
CSSStyle.BACKGROUND_POSITION = 'background-position';

// Border Properties
CSSStyle.BORDER = 'border';
CSSStyle.BORDER_TOP = 'border-top';
CSSStyle.BORDER_BOTTOM = 'border-bottom';
CSSStyle.BORDER_LEFT = 'border-left';
CSSStyle.BORDER_RIGHT = 'border-right';

CSSStyle.BORDER_WIDTH = 'border-width';
CSSStyle.BORDER_TOP_WIDTH = 'border-top-width';
CSSStyle.BORDER_BOTTOM_WIDTH = 'border-bottom-width';
CSSStyle.BORDER_LEFT_WIDTH = 'border-left-width';
CSSStyle.BORDER_RIGHT_WIDTH = 'border-right-width';

CSSStyle.BORDER_COLOR = 'border-color';
CSSStyle.BORDER_TOP_COLOR = 'border-top-color';
CSSStyle.BORDER_BOTTOM_COLOR = 'border-bottom-color';
CSSStyle.BORDER_LEFT_COLOR = 'border-left-color';
CSSStyle.BORDER_RIGHT_COLOR = 'border-right-color';

CSSStyle.BORDER_STYLE = 'border-style';

// - border-radius css property not supported when used inside <dvt:node>
CSSStyle.BORDER_RADIUS = 'border-radius';
CSSStyle.BORDER_TOP_LEFT_RADIUS = 'border-top-left-radius';
CSSStyle.BORDER_TOP_RIGHT_RADIUS = 'border-top-right-radius';
CSSStyle.BORDER_BOTTOM_RIGHT_RADIUS = 'border-bottom-right-radius';
CSSStyle.BORDER_BOTTOM_LEFT_RADIUS = 'border-bottom-left-radius';

// Margin Properties
CSSStyle.MARGIN = 'margin';
CSSStyle.MARGIN_TOP = 'margin-top';
CSSStyle.MARGIN_BOTTOM = 'margin-bottom';
CSSStyle.MARGIN_LEFT = 'margin-left';
CSSStyle.MARGIN_RIGHT = 'margin-right';

// Padding Properties
CSSStyle.PADDING = 'padding';
CSSStyle.PADDING_TOP = 'padding-top';
CSSStyle.PADDING_BOTTOM = 'padding-bottom';
CSSStyle.PADDING_LEFT = 'padding-left';
CSSStyle.PADDING_RIGHT = 'padding-right';

// Font Properties
CSSStyle.COLOR = 'color';
CSSStyle.FONT_FAMILY = 'font-family';
CSSStyle.FONT_SIZE = 'font-size';
CSSStyle.FONT_STYLE = 'font-style';
CSSStyle.FONT_WEIGHT = 'font-weight';
CSSStyle.TEXT_DECORATION = 'text-decoration';
CSSStyle.TEXT_ALIGN = 'text-align';

// Size Properties
CSSStyle.HEIGHT = 'height';
CSSStyle.WIDTH = 'width';
CSSStyle.MAX_WIDTH = 'max-width';

//values for background-repeat
CSSStyle.NO_REPEAT = 'no-repeat';
CSSStyle.REPEAT = 'repeat';
CSSStyle.REPEAT_X = 'repeat-x';
CSSStyle.REPEAT_Y = 'repeat-y';

//value for margin
CSSStyle.AUTO = 'auto';
CSSStyle.AUTO_MARGIN = '8';

/** @const */
CSSStyle.WHITE_SPACE = 'white-space';

/** @private **/
CSSStyle._NAMED_FONT_SIZE_MAP = {
  'xx-small': '9',
  'x-small': '10',
  small: '13',
  medium: '16',
  large: '18',
  'x-large': '24',
  'xx-large': '32'
};

/** @private **/
CSSStyle._NAMED_WIDTH_MAP = {
  thin: '2',
  medium: '4',
  thick: '6'
};

// numeric attributes List
CSSStyle._numericAttrsList = [
  CSSStyle.MAX_WIDTH,
  CSSStyle.WIDTH,
  CSSStyle.HEIGHT,
  CSSStyle.BORDER_WIDTH,
  CSSStyle.BORDER_TOP_WIDTH,
  CSSStyle.BORDER_BOTTOM_WIDTH,
  CSSStyle.BORDER_LEFT_WIDTH,
  CSSStyle.BORDER_RIGHT_WIDTH,
  CSSStyle.MARGIN,
  CSSStyle.MARGIN_TOP,
  CSSStyle.MARGIN_BOTTOM,
  CSSStyle.MARGIN_LEFT,
  CSSStyle.MARGIN_RIGHT,
  CSSStyle.PADDING,
  CSSStyle.PADDING_TOP,
  CSSStyle.PADDING_BOTTOM,
  CSSStyle.PADDING_LEFT,
  CSSStyle.PADDING_RIGHT
];

CSSStyle._DOUBLE_QUOTE = '"';
CSSStyle._SINGLE_QUOTE = "'";

// Default color ramps
CSSStyle.COLORS_ALTA = [
  '#237bb1',
  '#68c182',
  '#fad55c',
  '#ed6647',
  '#8561c8',
  '#6ddbdb',
  '#ffb54d',
  '#e371b2',
  '#47bdef',
  '#a2bf39',
  '#a75dba',
  '#f7f37b'
];

/**
 * Initializes the CSSStyle using the specified inline style string/object.
 * @param {string|object} style The inline style string/object containing the attributes for this CSSStyle.
 * @protected
 */
CSSStyle.prototype.Init = function (style) {
  // Initialize the object map containing all the style properties
  this._styleMap = {};

  this.parseInlineStyle(style);
};

/**
 * Parse an inlineStyle string/object into a set of CSS styles and merge the results to this style object.
 * @param {string|object} style inlineStyle string/object
 */
CSSStyle.prototype.parseInlineStyle = function (style) {
  if (!style) return;
  var cssStyle = this;
  if (style instanceof Object) {
    for (var key in style) {
      var attrVal = style[key];
      key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      cssStyle.setStyle(key, attrVal);
    }
  } else {
    CSSStyle._parseStyleString(style, function (attrName, attrVal) {
      cssStyle.setStyle(attrName, attrVal);
    });
  }
};

/**
 * Sets the value for a CSS attribute. This function will do all necessary conversion for the value.
 * @param {string} key The attribute name.
 * @param {string} val The attribute value.
 * @return {CSSStyle} This CSSStyle instance, useful for linking calls.
 */
CSSStyle.prototype.setStyle = function (key, val) {
  // TODO: This function can be made faster by indexing the attributes to their conversion routines.
  // TODO: This function can be made faster by removing unnecessary conversion routines (color)
  if (val == null) this._setStyleAttr(key, val);
  else {
    // The specialized routines don't do a good job of null checking. TODO CLEANUP
    switch (key) {
      case 'background-repeat':
        this._setBackgroundRepeat(key, val);
        break;
      case 'color':
      case 'background-color':
      case 'border-top-color':
      case 'border-bottom-color':
      case 'border-left-color':
      case 'border-right-color':
        this._setColorAttr(key, val);
        break;

      case 'border-top':
      case 'border-bottom':
      case 'border-left':
      case 'border-right':
        this._setBorderSide(key, val);
        break;

      case 'border':
        this._setBorderShorthand(key, val);
        break;
      case 'border-color':
        this._setBorderColorShorthand(key, val);
        break;
      case 'border-width':
        this._setBorderWidthShorthand(key, val);
        break;

      // - border-radius css property not supported when used inside <dvt:node>
      case 'border-radius':
        this._setBorderRadius(key, val);
        break;

      case 'padding':
        this._setPaddingShorthand(key, val);
        break;
      case 'margin':
        this._setMarginShorthand(key, val);
        break;
      case 'font-size':
        this.setFontSize(key, val);
        break;

      // - hv command button loses gradient
      //TODO: allow gradient syntax on BACKGROUND_COLOR???
      case 'background-image':
        var gradObj = GradientParser.parseCSSGradient(val);
        if (gradObj) {
          val = gradObj;
        }
        this._setStyleAttr(key, val);
        break;

      default:
        this._setStyleAttr(key, val);
        break;
    }
  }

  // Return this instance to support linking of set calls.
  return this;
};

/**
 * Returns the value of the specified style property.
 * @param {string} key The style property whose value will be returned.
 * @return {string} The value of the specified style property.
 */
CSSStyle.prototype.getStyle = function (key) {
  return this._styleMap[key];
};

/**
 * Specifies the value of the specified style property.  Does not perform any conversion.
 * @param {string} key The style property whose value will be returned.
 * @param {string} value The value of the specified style property.
 * @return {CSSStyle} This CSSStyle instance, useful for linking calls.
 * @private
 */
CSSStyle.prototype._setStyleAttr = function (key, value) {
  if (value != null) this._styleMap[key] = value;
  else delete this._styleMap[key];

  return this;
};

/**
 * Sets the font-size on a CSSStyle object
 * @param {string} key The css key to set the font-size under TODO , is this ever not font-size?
 * @param {string} val The font-size which can be in the format '9', '9px', or 'xx-small'
 * @param {Context} context
 */
CSSStyle.prototype.setFontSize = function (key, val, context) {
  var fsize = val.trim();
  var specSize = CSSStyle._NAMED_FONT_SIZE_MAP[fsize];
  if (specSize) {
    this._setStyleAttr(key, String(specSize) + 'px');
  } else {
    // The context object is not passed from setStyle() method on CSSStyle.
    // The constant is used as default value in this case.
    var defaultFontSize = context ? context.getDefaultFontSize() : CSSStyle.DEFAULT_FONT_SIZE;
    this._setStyleAttr(key, isNaN(parseFloat(fsize)) ? defaultFontSize : fsize);
  }
};

/**
 * @param key is a shorthand for the four border properties: top, right, bottom and left border, respectively.
 * @param val may contain up to 4 border-width values.
 * @private
 */
CSSStyle.prototype._setBorderWidthShorthand = function (key, val) {
  var bwArray = val.split(' ');
  var bWidth = null;

  switch (bwArray.length) {
    case 1:
      this._setStyleAttr(key, CSSStyle._getBorderWidth(bwArray[0]));
      // remove other border widths
      this._setStyleAttr(CSSStyle.BORDER_TOP_WIDTH, null);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_WIDTH, null);
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_WIDTH, null);
      this._setStyleAttr(CSSStyle.BORDER_LEFT_WIDTH, null);
      break;

    case 2:
      bWidth = CSSStyle._getBorderWidth(bwArray[0]);
      this._setStyleAttr(CSSStyle.BORDER_TOP_WIDTH, bWidth);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_WIDTH, bWidth);

      bWidth = CSSStyle._getBorderWidth(bwArray[1]);
      this._setStyleAttr(CSSStyle.BORDER_LEFT_WIDTH, bWidth);
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_WIDTH, bWidth);
      break;

    case 3:
      this._setStyleAttr(CSSStyle.BORDER_TOP_WIDTH, CSSStyle._getBorderWidth(bwArray[0]));
      bWidth = CSSStyle._getBorderWidth(bwArray[1]);
      this._setStyleAttr(CSSStyle.BORDER_LEFT_WIDTH, bWidth);
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_WIDTH, bWidth);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_WIDTH, CSSStyle._getBorderWidth(bwArray[2]));
      break;

    case 4:
      this._setStyleAttr(CSSStyle.BORDER_TOP_WIDTH, CSSStyle._getBorderWidth(bwArray[0]));
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_WIDTH, CSSStyle._getBorderWidth(bwArray[1]));
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_WIDTH, CSSStyle._getBorderWidth(bwArray[2]));
      this._setStyleAttr(CSSStyle.BORDER_LEFT_WIDTH, CSSStyle._getBorderWidth(bwArray[3]));
      break;

    case 0:
    default:
      break;
  }
};

/**
 * @param val contain only one borderWidth value
 * @private
 */
CSSStyle._getBorderWidth = function (val) {
  var bwidth = val.trim();
  var specSize = CSSStyle._NAMED_WIDTH_MAP[bwidth];
  if (!specSize) {
    specSize = isNaN(parseFloat(bwidth)) ? '0px' : bwidth;
  }

  return specSize;
};

/**
 * @param {string} key The border-*** attribute, such as border-top.
 * @param {string} val The value of the border property, such as "#797975 1px solid".  Accepts width, style, and color
 *                     in any order, separated by spaces.
 * @private
 */
CSSStyle.prototype._setBorderSide = function (key, val) {
  var borderArray = val.split(' ');
  var borderVal = null;
  var noBorder = false;
  var key1;

  for (var i = 0; i < borderArray.length; i++) {
    borderVal = borderArray[i];
    key1 = key;

    //rgb border color
    if (borderVal.indexOf('rgb') == 0) {
      for (var k = i + 1; k < borderArray.length; k++) {
        borderVal += borderArray[k];
        i++;
        if (borderArray[k].indexOf(')') != -1) break;
      }
      if (!key.endsWith('-' + CSSStyle.COLOR)) key1 = key + '-' + CSSStyle.COLOR;
      this._setStyleAttr(key1, borderVal);
    }
    //border color
    else if (CSSStyle._isColorValue(borderVal)) {
      if (!key.endsWith('-' + CSSStyle.COLOR)) key1 = key + '-' + CSSStyle.COLOR;
      this._setStyleAttr(key1, DvtColorParser.parseHexColor(borderVal));
    } else if (CSSStyle._isBorderWidthValue(borderVal)) {
      // border width
      if (!key.endsWith('-' + CSSStyle.WIDTH)) key1 = key + '-' + CSSStyle.WIDTH;
      this._setStyleAttr(key1, borderVal);
    }
    //we don't currently handle border style, but if it's none, set width=0
    else if (val == 'none') noBorder = true;
  }

  if (noBorder) {
    this._setStyleAttr(key + '-' + CSSStyle.WIDTH, '0');
  }
};

/**
 * Computes and returns the margin for the specified side.
 * @param {string} key The margin-*** attribute, such as margin-top.
 * @param {number}
 */
CSSStyle.prototype.getMargin = function (key) {
  return this._getSideWidth(key, CSSStyle.MARGIN);
};

/**
 * Computes and returns the padding for the specified side.
 * @param {string} key The padding-*** attribute, such as padding-top.
 * @param {number}
 */
CSSStyle.prototype.getPadding = function (key) {
  return this._getSideWidth(key, CSSStyle.PADDING);
};

CSSStyle.prototype.getBorderWidth = function () {
  var bwidth = this.getStyle(CSSStyle.BORDER_WIDTH);
  if (bwidth) {
    return CSSStyle.toNumber(bwidth);
  }
  bwidth = this.getStyle(CSSStyle.BORDER_TOP_WIDTH);
  if (bwidth) {
    return CSSStyle.toNumber(bwidth);
  }
  bwidth = this.getStyle(CSSStyle.BORDER_RIGHT_WIDTH);
  if (bwidth) {
    return CSSStyle.toNumber(bwidth);
  }
  bwidth = this.getStyle(CSSStyle.BORDER_BOTTOM_WIDTH);
  if (bwidth) {
    return CSSStyle.toNumber(bwidth);
  }
  bwidth = this.getStyle(CSSStyle.BORDER_LEFT_WIDTH);
  if (bwidth) {
    return CSSStyle.toNumber(bwidth);
  }
  return 0;
};

// width and height
CSSStyle.prototype.getMaxWidth = function () {
  return this.getStyle(CSSStyle.MAX_WIDTH);
};

CSSStyle.prototype.getWidth = function () {
  return this.getStyle(CSSStyle.WIDTH);
};

CSSStyle.prototype.getHeight = function () {
  return this.getStyle(CSSStyle.HEIGHT);
};

/**
 * Convert a string to a number
 *
 * @return a number or zero if not a number or value is not specified
 */
CSSStyle.toNumber = function (val) {
  if (val) {
    val = parseFloat(val);
    return isNaN(val) ? 0 : val;
  }
  return 0;
};

// val is a string contains up to 4 rgb colors, ex:
// border-color: rgb(221, 221, 216) rgb(185, 185, 132) rgb(121, 121, 117)
CSSStyle.prototype._setBorderColorShorthand = function (key, val) {
  var bcArray = CSSStyle._parseBorderColorString(key, val);
  var bcolor;

  switch (bcArray.length) {
    case 1:
      this._setStyleAttr(key, bcArray[0]);
      this._setStyleAttr(CSSStyle.BORDER_TOP_COLOR, null);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_COLOR, null);
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_COLOR, null);
      this._setStyleAttr(CSSStyle.BORDER_LEFT_COLOR, null);
      break;

    case 2:
      bcolor = bcArray[0];
      this._setStyleAttr(CSSStyle.BORDER_TOP_COLOR, bcolor);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_COLOR, bcolor);

      bcolor = bcArray[1];
      this._setStyleAttr(CSSStyle.BORDER_LEFT_COLOR, bcolor);
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_COLOR, bcolor);
      break;

    case 3:
      this._setStyleAttr(CSSStyle.BORDER_TOP_COLOR, bcArray[0]);
      bcolor = bcArray[1];
      this._setStyleAttr(CSSStyle.BORDER_LEFT_COLOR, bcolor);
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_COLOR, bcolor);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_COLOR, bcArray[2]);
      break;

    case 4:
      this._setStyleAttr(CSSStyle.BORDER_TOP_COLOR, bcArray[0]);
      this._setStyleAttr(CSSStyle.BORDER_RIGHT_COLOR, bcArray[1]);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_COLOR, bcArray[2]);
      this._setStyleAttr(CSSStyle.BORDER_LEFT_COLOR, bcArray[3]);
      break;

    case 0:
    default:
      break;
  }
};

// val is a string contains up to 4 padding sizes, ex:
// padding: 2px 9px 1px
CSSStyle.prototype._setPaddingShorthand = function (key, val) {
  var padArray = val.split(' ');
  var padding = null;

  switch (padArray.length) {
    case 1:
      this._setStyleAttr(key, this._getPercent(padArray[0]));
      this._setStyleAttr(CSSStyle.PADDING_TOP, null);
      this._setStyleAttr(CSSStyle.PADDING_BOTTOM, null);
      this._setStyleAttr(CSSStyle.PADDING_RIGHT, null);
      this._setStyleAttr(CSSStyle.PADDING_LEFT, null);
      break;

    case 2:
      padding = this._getPercent(padArray[0]);
      this._setStyleAttr(CSSStyle.PADDING_TOP, padding);
      this._setStyleAttr(CSSStyle.PADDING_BOTTOM, padding);

      padding = this._getPercent(padArray[1]);
      this._setStyleAttr(CSSStyle.PADDING_LEFT, padding);
      this._setStyleAttr(CSSStyle.PADDING_RIGHT, padding);
      break;

    case 3:
      this._setStyleAttr(CSSStyle.PADDING_TOP, this._getPercent(padArray[0]));
      padding = this._getPercent(padArray[1]);
      this._setStyleAttr(CSSStyle.PADDING_LEFT, padding);
      this._setStyleAttr(CSSStyle.PADDING_RIGHT, padding);
      this._setStyleAttr(CSSStyle.PADDING_BOTTOM, this._getPercent(padArray[2]));
      break;

    case 4:
      this._setStyleAttr(CSSStyle.PADDING_TOP, this._getPercent(padArray[0]));
      this._setStyleAttr(CSSStyle.PADDING_RIGHT, this._getPercent(padArray[1]));
      this._setStyleAttr(CSSStyle.PADDING_BOTTOM, this._getPercent(padArray[2]));
      this._setStyleAttr(CSSStyle.PADDING_LEFT, this._getPercent(padArray[3]));
      break;

    case 0:
    default:
      break;
  }
};

// val is a string contains up to 4 margin sizes, ex:
// margin: 2px 9px 1px
//TODO: margin can be negative numbers and in CM
CSSStyle.prototype._setMarginShorthand = function (key, val) {
  var padArray = val.split(' ');
  var margin = null;

  switch (padArray.length) {
    case 1:
      this._setStyleAttr(key, this._getMargin(padArray[0]));
      this._setStyleAttr(CSSStyle.MARGIN_TOP, null);
      this._setStyleAttr(CSSStyle.MARGIN_BOTTOM, null);
      this._setStyleAttr(CSSStyle.MARGIN_RIGHT, null);
      this._setStyleAttr(CSSStyle.MARGIN_LEFT, null);
      break;

    case 2:
      margin = this._getMargin(padArray[0]);
      this._setStyleAttr(CSSStyle.MARGIN_TOP, margin);
      this._setStyleAttr(CSSStyle.MARGIN_BOTTOM, margin);

      margin = this._getMargin(padArray[1]);
      this._setStyleAttr(CSSStyle.MARGIN_LEFT, margin);
      this._setStyleAttr(CSSStyle.MARGIN_RIGHT, margin);
      break;

    case 3:
      this._setStyleAttr(CSSStyle.MARGIN_TOP, this._getMargin(padArray[0]));
      margin = this._getMargin(padArray[1]);
      this._setStyleAttr(CSSStyle.MARGIN_LEFT, margin);
      this._setStyleAttr(CSSStyle.MARGIN_RIGHT, margin);
      this._setStyleAttr(CSSStyle.MARGIN_BOTTOM, this._getMargin(padArray[2]));
      break;

    case 4:
      this._setStyleAttr(CSSStyle.MARGIN_TOP, this._getMargin(padArray[0]));
      this._setStyleAttr(CSSStyle.MARGIN_RIGHT, this._getMargin(padArray[1]));
      this._setStyleAttr(CSSStyle.MARGIN_BOTTOM, this._getMargin(padArray[2]));
      this._setStyleAttr(CSSStyle.MARGIN_LEFT, this._getMargin(padArray[3]));
      break;

    case 0:
    default:
      break;
  }
};

//TODO: auto size defined by browsers
CSSStyle.prototype._getMargin = function (val) {
  var margin = val.trim();
  if (CSSStyle.AUTO == margin) return CSSStyle.AUTO_MARGIN;
  else return this._getPercent(margin);
};

// TODO: No idea how this has anything to do with percentages
CSSStyle.prototype._getPercent = function (val) {
  return val.trim();
};

CSSStyle.prototype._setBorderShorthand = function (key, val) {
  /*
   * "border" Shorthand property can specify width, style, and color
   * separated by spaces, which are applied to all 4 border sides
   * ex: "1px solid rgb(185, 185, 180)"
   */
  var borderArray = val.split(' ');
  var borderVal = null;
  var noBorder = false;

  for (var i = 0; i < borderArray.length; i++) {
    borderVal = borderArray[i];

    //rgb border color
    if (borderVal.indexOf('rgb') == 0) {
      for (var k = i + 1; k < borderArray.length; k++) {
        borderVal += borderArray[k];
        i++;
        if (borderArray[k].indexOf(')') != -1) break;
      }
      this._setBorderColorShorthand(CSSStyle.BORDER_COLOR, borderVal);
    }

    //border color
    else if (CSSStyle._isColorValue(borderVal))
      this._setBorderColorShorthand(CSSStyle.BORDER_COLOR, borderVal);
    //border width
    else if (CSSStyle._isBorderWidthValue(borderVal))
      this._setBorderWidthShorthand(CSSStyle.BORDER_WIDTH, borderVal);
    //we don't currently handle border style, but if it's none, set width=0
    else if (val == 'none') noBorder = true;
  }

  if (noBorder) {
    this._setBorderWidthShorthand(CSSStyle.BORDER_WIDTH, '0');
  }
};

CSSStyle._getBorderRadius = function (val) {
  var radii = val.trim();
  return isNaN(parseFloat(radii)) ? '0px' : radii;
};

// - border-radius css property not supported when used inside <dvt:node>
CSSStyle.prototype._setBorderRadius = function (key, val) {
  /*
   * border-radius: 1-4 length|% / 1-4 length|%;
   *
   * Note: order of 4 values: top-left, top-right, bottom-right, bottom-left.
   * If bottom-left is omitted it is the same as top-right. If bottom-right is omitted
   * it is the same as top-left.
   */
  var brArray = val.split('/');
  if (brArray[0] == null) {
    this._setStyleAttr(key, '0px');
    return;
  }
  // horizontal radii
  var brHorzArr = brArray[0].trim().split(' ');
  var bRadius = null;

  switch (brHorzArr.length) {
    case 1:
    default:
      this._setStyleAttr(key, CSSStyle._getBorderRadius(brHorzArr[0]));
      // remove other border radius
      this._setStyleAttr(CSSStyle.BORDER_TOP_LEFT_RADIUS, null);
      this._setStyleAttr(CSSStyle.BORDER_TOP_RIGHT_RADIUS, null);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_RIGHT_RADIUS, null);
      this._setStyleAttr(CSSStyle.BORDER_BOTTOM_LEFT_RADIUS, null);
      break;

    /*
 * only support 4 corner with the same radius

  case 2:
    bRadius = CSSStyle._getBorderRadius(brHorzArr[0]);
    this._setStyleAttr(CSSStyle.BORDER_TOP_LEFT_RADIUS, bRadius);
    this._setStyleAttr(CSSStyle.BORDER_BOTTOM_RIGHT_RADIUS, bRadius);

    bRadius = CSSStyle._getBorderRadius(brHorzArr[1]);
    this._setStyleAttr(CSSStyle.BORDER_TOP_RIGHT_RADIUS, bRadius);
    this._setStyleAttr(CSSStyle.BORDER_BOTTOM_LEFT_RADIUS, bRadius);
    break;

  case 3:
    this._setStyleAttr(CSSStyle.BORDER_TOP_LEFT_RADIUS, CSSStyle._getBorderRadius(brHorzArr[0]));
    bRadius = CSSStyle._getBorderRadius(brHorzArr[1]);
    this._setStyleAttr(CSSStyle.BORDER_TOP_RIGHT_RADIUS, bRadius);
    this._setStyleAttr(CSSStyle.BORDER_BOTTOM_RIGHT_RADIUS, CSSStyle._getBorderRadius(brHorzArr[2]));
    this._setStyleAttr(CSSStyle.BORDER_BOTTOM_LEFT_RADIUS, bRadius);
    break;

  case 4:
    this._setStyleAttr(CSSStyle.BORDER_TOP_LEFT_RADIUS, CSSStyle._getBorderRadius(brHorzArr[0]));
    this._setStyleAttr(CSSStyle.BORDER_TOP_RIGHT_RADIUS, CSSStyle._getBorderRadius(brHorzArr[1]));
    this._setStyleAttr(CSSStyle.BORDER_BOTTOM_RIGHT_RADIUS, CSSStyle._getBorderRadius(brHorzArr[2]));
    this._setStyleAttr(CSSStyle.BORDER_BOTTOM_LEFT_RADIUS, CSSStyle._getBorderRadius(brHorzArr[3]));
    break;

  case 0:
  default:
    break;

      */
  }

  // vertical radii
  if (brArray.length == 2 && brArray[1] != null) {
    var brVertArr = brArray[1].trim().split(' ');

    switch (brVertArr.length) {
      case 1:
        if (this.getStyle(key))
          this._setStyleAttr(
            key,
            this.getStyle(key) + ' ' + CSSStyle._getBorderRadius(brVertArr[0])
          );
        else this._setStyleAttr(key, CSSStyle._getBorderRadius(brVertArr[0]));
        break;

      case 0:
      default:
        break;
    }
  }
};

/**
 * Returns border radius as a number. If the radius were not set for this style, returns 0
 * @return {number} border radius
 */
CSSStyle.prototype.getBorderRadius = function () {
  if (
    this.getStyle(CSSStyle.BORDER_RADIUS) !== 'undefined' &&
    this.getStyle(CSSStyle.BORDER_RADIUS) !== null
  )
    return CSSStyle.toNumber(this.getStyle(CSSStyle.BORDER_RADIUS));
  else return 0;
};

CSSStyle.prototype._setBackgroundRepeat = function (key, val) {
  var a = val.split(' ');

  //  - buttons look broken on safari
  // in Safari button -> background-repeat: repeat no-repeat
  if (a.length == 2) {
    // both repeat or no_repeat
    if (a[0] == a[1]) val = a[0];
    else if (a[0] == CSSStyle.REPEAT && a[1] == CSSStyle.NO_REPEAT) val = CSSStyle.REPEAT_X;
    if (a[0] == CSSStyle.NO_REPEAT && a[1] == CSSStyle.REPEAT) val = CSSStyle.REPEAT_Y;
  }
  this._setStyleAttr(key, val);
};

/**
 * set a color attribute
 *
 * @param {string} key color attribute
 * @param {string} val is a string in color keyword or a numeric value in #AARRGGBB or #RRGGBB format
 */
CSSStyle.prototype._setColorAttr = function (key, val) {
  // TODO : This entire function seems unnecessary
  var color = ColorUtils.getColorFromName(val);
  if (color) {
    this._setStyleAttr(key, color);
  } else if (CSSStyle._isColorValue(val)) {
    this._setStyleAttr(key, val);
  }
};

/**
 * return a copy of this object
 */
CSSStyle.prototype.clone = function () {
  var ret = new CSSStyle();
  for (var key in this._styleMap) {
    ret._setStyleAttr(key, this.getStyle(key));
  }
  return ret;
};

/**
 * Merge the properties of the given CSSStyle into this one.
 *
 * @param style properties to merge into this CSSStyle
 */
CSSStyle.prototype.merge = function (style) {
  if (style) {
    for (var key in style._styleMap) {
      this._setStyleAttr(key, style.getStyle(key));
    }
  }
  return this;
};

/**
 * Merge the properties of the given CSSStyle under this one.
 *
 * @param style properties to merge under this CSSStyle
 */
CSSStyle.prototype.mergeUnder = function (style) {
  if (style) {
    for (var key in style._styleMap) {
      if (!this.getStyle(key)) this._setStyleAttr(key, style.getStyle(key));
    }
  }
  return this;
};

/**
 * Returns a inline style representation of the style attributes contained in this CSSStyle.
 * @return {string}
 */
CSSStyle.prototype.toString = function () {
  var strBuf = '';
  for (var key in this._styleMap) {
    strBuf += key + ':' + this.getStyle(key) + '; ';
  }
  return strBuf;
};

/**
 * returns true if style has any of the background styles
 * @return {boolean} true if the style has any background styles
 */
CSSStyle.prototype.hasBackgroundStyles = function () {
  if (
    this.getStyle(CSSStyle.BORDER_COLOR) ||
    this.getStyle(CSSStyle.BORDER_WIDTH) ||
    this.getStyle(CSSStyle.BORDER_RADIUS) ||
    this.getStyle(CSSStyle.BACKGROUND_COLOR)
  )
    return true;

  return false;
};

/**
 * Determine if the given string specifies a color value.
 *
 * @param s string that may specify a color value
 *
 * @return true if the string specifies a color value, false otherwise
 */
CSSStyle._isColorValue = function (val) {
  val = val.trim();

  if (val.indexOf('rgb') == 0 || val.indexOf('#') == 0) return true;

  // color name?
  var color = ColorUtils.getColorFromName(val);
  if (color) {
    return true;
  }
  return false;
};

/**
 * @private
 * #param val contain only one borderWidth value
 */
CSSStyle._isBorderWidthValue = function (val) {
  var bwidth = val.trim();
  if (CSSStyle._NAMED_WIDTH_MAP[bwidth]) return true;

  return !isNaN(parseFloat(bwidth));
};

// val is a string contains up to 4 rgb colors, ex:
// border-color: rgb(221, 221, 216) rgb(185, 185, 132) rgb(121, 121, 117)
CSSStyle._parseBorderColorString = function (key, val) {
  var val = val.trim();
  var cArray = [];
  while (val != null && val.length > 0) {
    val = DvtColorParser.parseLeadingColor(val, cArray);
  }
  return cArray;
};

// get padding-top, padding-right, padding-bottom and padding-left
// get border-top-width, border-right-width, border-bottom-width and border-left=width
// get margin-top, margin-right, margin-bottom and margin-left
//TODO: percent
CSSStyle.prototype._getSideWidth = function (key, shortKey) {
  var side = this.getStyle(key);
  if (!side) {
    side = this.getStyle(shortKey);
  }
  return CSSStyle.toNumber(side);
};

CSSStyle.prototype.getFontSize = function () {
  return this.getStyle(CSSStyle.FONT_SIZE);
};

// Returns a CSSStyle object as a merge of the array
CSSStyle.mergeStyles = function (styleArray) {
  var style = new CSSStyle();
  if (styleArray) {
    for (var i = 0; i < styleArray.length; i++) {
      style.merge(styleArray[i]);
    }
  }
  return style;
};

/**
 * Returns true if this object does not contain any style properties.
 * @return {boolean}
 */
CSSStyle.prototype.isEmpty = function () {
  for (var key in this._styleMap) {
    return false;
  }
  return true;
};

/**
 * Returns a string that can be used as a hash code for caching text measurements.  Includes all attributes which can
 * affect the size of text.
 * @return {string}
 */
CSSStyle.prototype.hashCodeForTextMeasurement = function () {
  // Use a combination of all attrs that affect dimensions calculations.
  var ret = '';
  var textProperties = CSSStyle.getTextMeasurementProperties();
  for (var index = 0; index < textProperties.length; index++) {
    var style = this.getStyle(textProperties[index]);
    if (style) {
      ret += style;
    }
  }
  return ret;
};

/**
 * Returns array of Text Measurement properties
 * @return {array} Array of Text Measurement properties
 */
CSSStyle.getTextMeasurementProperties = function () {
  return [CSSStyle.FONT_FAMILY, CSSStyle.FONT_SIZE, CSSStyle.FONT_STYLE, CSSStyle.FONT_WEIGHT];
};

/**
 * Converts an object of CSS properties to a string. Object may contain both JS and CSS style attribute names
 * @param {object} style The style object
 * @return {string}
 */
CSSStyle.cssObjectToString = function (style) {
  var styleString = '';
  if (style) {
    JSON.parse(JSON.stringify(style), function (key, value) {
      if (key) {
        key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        styleString += key + ':' + value + ';';
      }
    });
  }
  return styleString;
};

/**
 * Converts a string of CSS properties to style object.
 * @param {String} style  The style string of CSS properties
 * @return {object} style object
 */
CSSStyle.cssStringToObject = function (style) {
  var styleObj = {};
  CSSStyle._parseStyleString(style, function (attrName, attrVal) {
    attrName = CSSStyle.cssStringToObjectProperty(attrName);
    styleObj[attrName] = attrVal;
  });
  return styleObj;
};

/**
 * Translates string representation of style property to object property.
 * If the style property has hyphen(-), it will be replaced with camel case version of the property
 * @param {string} property  style property
 * @return {string} object property
 */
CSSStyle.cssStringToObjectProperty = function (property) {
  if (property)
    property = property.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  return property;
};

/**
 * @private
 * Parses the style string and passes the style attribute name/value to the setter function
 * @param {String} style The style string to parse
 * @param {function} func The setter function to set the parsed style attribute name and value.
 *                        setter function syntax is: func(attrName, attrValue)
 */
CSSStyle._parseStyleString = function (style, func) {
  if (style && style.length > 0) {
    var splits = style.split(';');
    for (var i = 0; i < splits.length; i++) {
      var s = splits[i];
      if (s && s.length > 0) {
        //find the first colon instead of using String.split because
        //there may be other colons in the string, for instance in
        //a fully qualified background-image url (http://some.server.com/...)
        var colonIndex = s.indexOf(':');
        if (colonIndex > -1) {
          var attrName = s.substring(0, colonIndex).trim();
          var attrVal = s.substring(colonIndex + 1).trim();

          if (attrName && attrName.length > 0 && attrVal && attrVal.length > 0) {
            //inline images with data url
            if (attrName == CSSStyle.BACKGROUND_IMAGE && attrVal.indexOf('data:image/') >= 0) {
              attrVal = attrVal + ';' + splits[i + 1];
              i++;
            }
            //pass the attribute name and value to the setter function
            func(attrName, attrVal);
          }
        }
      }
    }
  }
};

/**
 * Parses the ms time value.
 *
 * @param {object} value The time as read from the json object. Could be in ms or s. If intger value then assume it's ms.
 * @return {number} the value in milliseconds
 */
CSSStyle.getTimeMilliseconds = function (value) {
  if (typeof value == 'string') {
    if (value.slice(-2) == 'ms') value = parseInt(value.slice(0, -2));
    else if (value.slice(-1) == 's') value = parseFloat(value.slice(0, -1)) * 1000;
    else value = parseInt(value);
  }
  return value;
};

/**
 * Applies the contained styles to the specified element in a CSP-safe way
 */
CSSStyle.prototype.applyStylesToElement = function (element) {
  CSSStyle.applyCssObjectToElement(this._styleMap, element);
};

/**
 * Applies the contained styles to the specified element in a CSP-safe way
 */
CSSStyle.applyCssObjectToElement = function (style, element) {
  var keys = Object.keys(style);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    element.style[CSSStyle.cssStringToObjectProperty(key)] = style[key];
  }
};

/**
 * An immutable shape fill class rendering a solid fill color.
 * @constructor
 * @param {String} fc  A css color specification for the fill color.
 * @param {String} fa  An optional alpha. Can be used to supplement the alpha specified by the fill color.  If omitted, the alpha specifed
 *                     by the fill color (or 1 if it does not specify an alpha) is used.
 */
const SolidFill = function (fc, fa) {
  this._fc = fc;
  this._fa = fa != null ? fa : 1;
};

Obj.createSubclass(SolidFill, Obj);

/**
 *  Returns the fill's solid color (and alpha).
 *  @type {String}
 */
SolidFill.prototype.getColor = function () {
  return this._fc;
};

/**
 *  Returns the fill's solid color alpha channel value in the range 0 (invisible) to 1 (opaque).
 *  @type {number}
 */
SolidFill.prototype.getAlpha = function () {
  return this._fa;
};

/**
 * Returns an instance of SolidFill that is invisible and can be used for event detection.
 * @return {SolidFill}
 */
SolidFill.invisibleFill = function () {
  if (!SolidFill._INVISIBLE_FILL) SolidFill._INVISIBLE_FILL = new SolidFill('rgba(0,0,0,0)');

  return SolidFill._INVISIBLE_FILL;
};

/**
 * @override
 */
SolidFill.prototype.equals = function (fill) {
  // TODO  fc should be converted so that equivalent colors via different syntax are treated correctly.
  return (
    fill instanceof SolidFill &&
    fill.getColor() == this.getColor() &&
    fill.getAlpha() == this.getAlpha()
  );
};

/**
 * An immutable class representing the stroke properties for a solid line.
 * @param {String} color  A css color specification for the stroke color.
 * @param {String} alpha  An optional alpha. Can be used to supplement the alpha specified by the stroke color.
 *                     If omitted, the alpha specifed by the stroke color (or 1 if it does not specify an alpha) is used.
 * @param {number} width  The width of the stroke line.  If omitted, the default width is 1.
 * @param {boolean} props.isFixedWidth True if this stroke should be of fixed width. If omitted, the default is false.
 *
 * @param {Object} dashProps Additional properties for customizing dashed and dotted line types.
 * @param {String} dashProps.dashArray  For dashed lines, specifies the dash and space size.
 *                           The string contains a list of numbers separated by commas
 *                           or whitespace, specifying dash length and gaps. The list
 *                           should have an even number of entries, but if an odd number
 *                           is used the list will be repeated so that the entry count is even.
 * @param {number} dashProps.dashOffset Offset on the rendering of the dashArray.
 *
 * @param {Object} lineProps Additional properties for customizing line types.
 * @param {string} lineProps.lineJoin Specifies the type of line end. See 'stroke-linejoin' attribute
 *                                     doc for valid and default values.
 * @param {string} lineProps.lineCap Specifies the type of line end. See 'stroke-linecap' attribute
 *                                     doc for valid and default values.
 * @param {number} lineProps.miterLimit Miter limit when lineJoin is type 'miter'.
 */
const Stroke = function (color, alpha, width, fixedWidth, dashProps, lineProps) {
  this._color = color;
  this._alpha = alpha != null ? alpha : 1;
  this._width = width === null || isNaN(width) ? 1 : width;
  this._fixedWidth = fixedWidth || false;
  this._dashProps = dashProps;
  this._lineProps = lineProps;
};

Obj.createSubclass(Stroke, Obj);

Stroke.prototype.getLineProps = function () {
  return this._lineProps;
};

Stroke.prototype.getDashProps = function () {
  return this._dashProps;
};

/**
 *  Returns the stroke alpha as a value between 0 (invisible) and 1 (opaque).
 *  @type {number}
 */
Stroke.prototype.getAlpha = function () {
  return this._alpha;
};

/**
 *  Returns the stroke color.
 *  @type {String}
 */
Stroke.prototype.getColor = function () {
  return this._color;
};

/**
 *  Returns the stroke width.
 *  @type {number}
 */
Stroke.prototype.getWidth = function () {
  return this._width;
};

Stroke.prototype.isFixedWidth = function () {
  return this._fixedWidth;
};

/**
 * Gets a default dash size based on the stroke type and stroke width
 * or null if the stroke type is not dashed or dotted.
 * @return {Object} dash size string, e.g. "6,3,4,3"
 */
Stroke.getDefaultDashProps = function (type, width) {
  if (type === 'solid') return null;

  width = Math.ceil(width);
  if (type == 'dashed') return { dashArray: '' + Math.max(6, width * 2) };
  if (type == 'dotted') return { dashArray: '' + Math.max(2, width) };

  return null;
};

// File containing all paint (fill and stroke) related functions defined on Displayable.

const _PAINT = {
  /**
   * Returns the fill for this shape.
   * @return {dvt.Fill}
   */
  getFill: function () {
    return this.GetProperty('fill');
  },

  /**
   * Specifies a fill to be applied to the shape.
   * @param {dvt.Fill} fill
   */
  setFill: function (fill) {
    this._manageDefinitions(this.GetProperty('fill'), fill);

    if (!fill) {
      ToolkitUtils.setAttrNullNS(this._elem, 'fill', 'none');
      ToolkitUtils.removeAttrNullNS(this._elem, 'fill-opacity');
      this.SetProperty('fill', null);
      return;
    } else {
      if (this.GetProperty('fill') === fill) {
        return;
      }
    }

    this.SetProperty('fill', fill);

    if (fill instanceof GradientFill || fill instanceof PatternFill) {
      var fillId = SvgShapeUtils.addSpecialFill(fill, this.getCtx());
      ToolkitUtils.setAttrNullNS(this._elem, 'fill', ToolkitUtils.getUrlById(fillId));
    } else {
      // Basic fill
      var fillObj = ColorUtils.fixColorForPlatform(fill.getColor(), fill.getAlpha());
      if (fillObj && fillObj.color) {
        ToolkitUtils.setAttrNullNS(this._elem, 'fill', fillObj.color);
        if (fillObj.alpha != null) {
          ToolkitUtils.setAttrNullNS(this._elem, 'fill-opacity', fillObj.alpha, 1);
        }
      }
    }

    this.UpdateSelectionEffect();
  },

  /**
   * Returns the class name for this shape.
   * @return {String}
   */
  getClassName: function () {
    return this._className;
  },

  /**
   * Specifies a class name to be applied to the shape.
   * @param {String} className
   * @return {Displayable}
   */
  setClassName: function (className) {
    if (this._className && !className) ToolkitUtils.removeAttrNullNS(this._elem, 'class');
    else if (className) ToolkitUtils.setAttrNullNS(this._elem, 'class', className);
    this._className = className;
    return this;
  },

  /**
   * Helper method that adds a class to DOM element.
   */
  addClassName: function (className) {
    ToolkitUtils.addClassName(this._elem, className);
    this._className = ToolkitUtils.getAttrNullNS(this._elem, 'class');
  },

  /**
   * Helper method that removes a class from DOM element.
   */
  removeClassName: function (className) {
    ToolkitUtils.removeClassName(this._elem, className);
    this._className = ToolkitUtils.getAttrNullNS(this._elem, 'class');
  },

  /**
   * Returns the style for this shape.
   * @return {object}
   */
  getStyle: function () {
    return this._style;
  },

  /**
   * Specifies a class name to be applied to the shape.
   * @param {object} style
   * @return {Displayable}
   */
  setStyle: function (style) {
    if (this._style) ToolkitUtils.removeAttrNullNS(this._elem, 'style');
    if (style) CSSStyle.applyCssObjectToElement(style, this._elem);
    this._style = style;
    return this;
  },

  /**
   *  Sets a solid fill on this shape.
   *  @param {String}  color  The hex or RGB representation of the solid fill
   *  @param {number}  alpha  The fill opacity. Defaults to 1 if none specified.
   *  If null is specified, a transparent fill is applied.
   */
  setSolidFill: function (color, alpha) {
    this.setFill(new SolidFill(color, alpha));
  },

  /**
   *  Sets an invisible fill on this shape.
   */
  setInvisibleFill: function () {
    this.setFill(SolidFill.invisibleFill());
  },

  /**
   * Returns the stroke for this shape.
   * @return {Stroke}
   */
  getStroke: function () {
    return this._stroke;
  },

  /**
   *  Sets the stroke properties on this shape from the supplied stroke object.
   *  If the stroke object is null, any existing stroke is removed.
   *  @param {Stroke} stroke A stroke object.
   */
  setStroke: function (stroke) {
    this._manageDefinitions(this._stroke, stroke);

    this._stroke = stroke;
    const STROKE_OPACITY = 'stroke-opacity';
    const STROKE_DASHARRAY = 'stroke-dasharray';
    const STROKE_DASHOFFSET = 'stroke-dashoffset';
    const STROKE_LINEJOIN = 'stroke-linejoin';
    const STROKE_LINECAP = 'stroke-linecap';
    const STROKE_MITERLIMIT = 'stroke-miterlimit';
    const STROKE = 'stroke';
    const STROKE_WIDTH = 'stroke-width';

    if (!stroke) {
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_OPACITY);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_WIDTH);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_DASHARRAY);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_DASHOFFSET);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_LINEJOIN);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_LINECAP);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_MITERLIMIT);
      return;
    }

    //  Stroke color/alpha
    var strokeObj = ColorUtils.fixColorForPlatform(stroke.getColor(), stroke.getAlpha());
    if (strokeObj && strokeObj.color) {
      ToolkitUtils.setAttrNullNS(this._elem, STROKE, strokeObj.color);
      if (strokeObj.alpha != null) {
        ToolkitUtils.setAttrNullNS(this._elem, STROKE_OPACITY, strokeObj.alpha, 1);
      }
    } else {
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE);
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_OPACITY);
    }

    //  Width defaults to 1 if not set
    ToolkitUtils.setAttrNullNS(this._elem, STROKE_WIDTH, stroke.getWidth(), 1);

    if (stroke.isFixedWidth()) {
      ToolkitUtils.setAttrNullNS(this._elem, 'vector-effect', 'non-scaling-stroke');
    }

    var dashProps = stroke.getDashProps();
    if (dashProps && dashProps.dashArray) {
      ToolkitUtils.setAttrNullNS(this._elem, STROKE_DASHARRAY, dashProps.dashArray);
    } else {
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_DASHARRAY);
    }
    if (dashProps && dashProps.dashOffset) {
      ToolkitUtils.setAttrNullNS(this._elem, STROKE_DASHOFFSET, dashProps.dashOffset);
    } else {
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_DASHOFFSET);
    }

    var lineProps = stroke.getLineProps();
    if (lineProps && lineProps.lineJoin) {
      ToolkitUtils.setAttrNullNS(this._elem, STROKE_LINEJOIN, lineProps.lineJoin);
    } else {
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_LINEJOIN);
    }
    if (lineProps && lineProps.lineCap) {
      ToolkitUtils.setAttrNullNS(this._elem, STROKE_LINECAP, lineProps.lineCap);
    } else {
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_LINECAP);
    }
    if (lineProps && lineProps.miterLimit) {
      ToolkitUtils.setAttrNullNS(this._elem, STROKE_MITERLIMIT, lineProps.miterLimit);
    } else {
      ToolkitUtils.removeAttrNullNS(this._elem, STROKE_MITERLIMIT);
    }
  },

  /**
   *  Sets a solid stroke on this shape.
   *  @param {String}  color  The hex or RGB representation of the solid fill
   *  @param {number}  alpha  The fill opacity. Defaults to 1 if none specified.
   *  @param {number}  strokeWidth  The stroke width. Defaults to 1 if none specified.
   *  If null is specified, a transparent fill is applied.
   */
  setSolidStroke: function (color, alpha, strokeWidth) {
    this.setStroke(new Stroke(color, alpha, strokeWidth));
  },

  /**
   * Manage the gradient/filter definitions for svg by keeping a reference count and removing unreferenced defs.
   * @param {object} oldObj The old gradient or filter definition.
   * @param {object} newObj The new gradient or filter definition.
   * @private
   */
  _manageDefinitions: function (oldObj, newObj) {
    // If a new obj is specified, adjust reference counts and remove def if 0 references
    if (oldObj != newObj) {
      // Decrease count on existing obj
      if (oldObj) {
        oldObj._referenceCount--;
        if (oldObj._referenceCount == 0) {
          if (oldObj._defElem) {
            this.getCtx().removeDefs(oldObj._defElem);
            oldObj._defPresent = false;
          }
        }
      }
      if (newObj) {
        if (!newObj._referenceCount) newObj._referenceCount = 0;
        newObj._referenceCount++;
      }
    }
  }
};

/**
 *   Static Utility Functions for dvt.Displayable
 *   @class DisplayableUtils
 *   @constructor
 */
const DisplayableUtils = function () {};

Obj.createSubclass(DisplayableUtils, Obj);

/**
 * Array of SVG attributes that should be transferred to the outer element.
 */
DisplayableUtils.ATTRS_TRANSFERABLE_TO_OUTER = [/* 'filter', */ 'clip-path'];

/*
 * Temporarily add the display object to the stage to get dimensions.
 * Remove it from stage after done
 */
DisplayableUtils.getDimensionsForced = function (context, obj) {
  //save original parent and index
  var oParent = obj.getParent();
  var oIndex;
  if (oParent) oIndex = oParent.getChildIndex(obj);

  var stage = context.getStage();
  stage.addChild(obj);

  var dim = obj.getDimensions();
  stage.removeChild(obj);

  //restore original parent
  if (oParent) {
    oParent.addChildAt(obj, oIndex);
  }

  return dim;
};

/**
 * Returns the dimensions of an element by calling getBBox.
 * @return {Rectangle}
 */
DisplayableUtils.getSvgDimensions = function (elem) {
  try {
    var bbox = elem.getBBox();
  } catch (e) {
    return null;
  }
  //don't return bbox directly because we don't want calling code
  //to depend on platform-specific API, so instead turn it into
  //a Rectangle
  return new Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
};

/*
 * Temporarily add the display object to the stage to get dimensions.
 * Remove it from stage after done
 * cached dimensions in obj._dim
 */
DisplayableUtils.getDimForced = function (context, obj) {
  //if there is a cache or context is null, return it.
  if (obj._dim || !context) {
    return obj._dim;
  }

  var dim = DisplayableUtils.getDimensionsForced(context, obj);

  //cached the dimensions
  DisplayableUtils._setDimForced(obj, dim);
  return dim;
};

/*
 * cached dimensions in obj._dim
 */
DisplayableUtils._setDimForced = function (obj, dim) {
  //cached the dimensions
  obj._dim = dim;
};

/**
 * Returns true if any of the specified attribute names are present on the element.
 * @param {object} elem  The SVG DOM element.
 * @param {array} attrNames The array of attribute names to look for.
 * @protected
 * @return {boolean}
 */
DisplayableUtils.hasAttributes = function (elem, attrNames) {
  if (attrNames) {
    var numAttrs = attrNames.length;
    for (var i = 0; i < numAttrs; i++) {
      if (ToolkitUtils.getAttrNullNS(elem, attrNames[i])) {
        // TODO  This should be hasAttrNullNS
        return true;
      }
    }
  }
  return false;
};

const _TRANSFORM = {
  /**
   * Sets the horizontal and vertical translation to apply to this container.
   * @param {Number} tx   The horizontal translation to apply, in pixels.
   * @param {Number} ty   The vertical translation to apply, in pixels.
   */
  setTranslate: function (tx, ty) {
    this._modifyMatrix(null, null, tx, ty);
  },

  /**
   * Returns the horizontal translation applied to this container.
   * @return {Number} horizontal translation, in pixels
   */
  getTranslateX: function () {
    var matrix = this.getMatrix();
    if (matrix) {
      // get the value from the matrix because other
      // transformations may have changed it
      return matrix._decompose()[Matrix._DECOMP_TX];
    }

    return 0;
  },

  /**  Set the horizontal translation to apply to this container.
   *  @param {Number} tx   The horizontal translation to apply, in pixels.
   */
  setTranslateX: function (tx) {
    this._modifyMatrix(null, null, tx);
  },

  /**
   * Return the vertical translation applied to this container.
   * @return {Number} vertical translation, in pixels
   */
  getTranslateY: function () {
    var matrix = this.getMatrix();
    if (matrix) {
      // get the value from the matrix, because other
      // transformations may have changed it
      return matrix._decompose()[Matrix._DECOMP_TY];
    }

    return 0;
  },

  /**  Set the vertical translation to apply to this container.
   *  @param {Number} ty   The vertical translation to apply, in pixels.
   */
  setTranslateY: function (ty) {
    this._modifyMatrix(null, null, null, ty);
  },

  /**
   * Sets the horizontal and vertical scale to apply to this container.
   * @param {Number} sx   The horizontal scale to apply.
   * @param {Number} sy   The vertical scale to apply.
   */
  setScale: function (sx, sy) {
    this._modifyMatrix(sx, sy);
  },

  /**
   * Return the horizontal scale applied to this container.
   * @return {number}  horizontal scale
   */
  getScaleX: function () {
    var matrix = this.getMatrix();
    if (matrix) {
      // get the value from the matrix, because other
      // transformations may have changed it
      return matrix._decompose()[Matrix._DECOMP_SX];
    }

    return 1;
  },

  /**  Set the horizontal scale to apply to this container.
   *  @param {Number} sx   The horizontal scale to apply.
   */
  setScaleX: function (sx) {
    this._modifyMatrix(sx);
  },

  /**
   * Return the vertical scale applied to this container.
   * @return {number}  vertical scale
   */
  getScaleY: function () {
    var matrix = this.getMatrix();
    if (matrix) {
      // get the value from the matrix, because other
      // transformations may have changed it
      return matrix._decompose()[Matrix._DECOMP_SY];
    }

    return 1;
  },

  /**  Set the vertical scale to apply to this container.
   *  @param {Number} sy   The horizontal scale to apply.
   */
  setScaleY: function (sy) {
    this._modifyMatrix(null, sy);
  },

  /**
   * Return the rotation applied to this container.
   * @return {number}  rotation, in radians
   */
  getRotation: function () {
    var matrix = this.getMatrix();
    if (matrix) {
      // get the value from the matrix, because other
      // transformations may have changed it
      return matrix._decompose()[Matrix._DECOMP_R];
    }

    return 0;
  },

  /**  Set the rotation to apply to this container.
   *  @param {Number} angleRads   The rotation to apply, in radians.
   */
  setRotation: function (angleRads) {
    this._modifyMatrix(null, null, null, null, angleRads);
  },

  /**
   * Return the transformation matrix applied to this container.
   * @return {Matrix} transformation matrix
   */
  getMatrix: function () {
    if (this._matrix) {
      return this._matrix;
    }

    return new Matrix();
  },

  /**
   * Set the transformation matrix to apply to this container.
   * When set, the matrix becomes permanently locked so that it becomes immutable.
   * A clone must be created if any updates to the matrix need to be made.
   * The same matrix can be set on more than one displayable irregardless of locking.
   * @param {Matrix} mat   The transformation matrix to apply.
   */
  setMatrix: function (mat) {
    // treat setting identity matrix same as setting null matrix
    if (mat && mat.isIdentity()) mat = null;

    if (this._matrix != mat) {
      this._matrix = mat;

      // Create an outer elem if needed
      if (
        !this._outerElem &&
        DisplayableUtils.hasAttributes(this.getElem(), DisplayableUtils.ATTRS_TRANSFERABLE_TO_OUTER)
      ) {
        this._createOuterGroupElem();
      }

      this._matrix = mat;
      // apply the new matrix if it's non-null
      if (mat) {
        var sMat =
          'matrix(' +
          mat.getA() +
          ',' +
          mat.getC() +
          ',' +
          mat.getB() +
          ',' +
          mat.getD() +
          ',' +
          mat.getTx() +
          ',' +
          mat.getTy() +
          ')';

        // set the transform attribute on the outer SVG element of this shape
        ToolkitUtils.setAttrNullNS(this.getElem(), 'transform', sMat, 'matrix(1,0,0,1,0,0)');

        // set the vector-effect attribute to prevent the stroke-width
        // from scaling with the transform
        // NOTE: this is commented out for now because it causes strange rendering
        // artifacts when scaling to a small value
        // ToolkitUtils.setAttrNullNS(this.getElem(), 'vector-effect', 'non-scaling-stroke') ;
      } else {
        // if clearing the existing matrix by setting a null or undefined mat,
        // then remove the existing attribute from the DOM
        var transformAttr = ToolkitUtils.getAttrNullNS(this.getElem(), 'transform');
        if (transformAttr) {
          ToolkitUtils.removeAttrNullNS(this.getElem(), 'transform');
          if (Agent.browser === 'ie' || Agent.browser === 'edge') {
            // , prev removeAttributeNS()
            ToolkitUtils.setAttrNullNS(this.getElem(), 'transform', null); // fails for IE9 (9.0.8112.16421)
          }
        }
        // NOTE: this is commented out for now because it causes strange rendering
        // artifacts when scaling to a small value
        var vectorEffectAttr; // = ToolkitUtils.getAttrNullNS(this.getElem(), 'vector-effect');
        if (vectorEffectAttr) {
          ToolkitUtils.removeAttrNullNS(this.getElem(), 'vector-effect');
        }
      }
    }
  },

  /**
   * Sets the scales,translations and rotation to apply to this container.
   * @param {Number} sx   The horizontal scale to apply.
   * @param {Number} sy   The vertical scale to apply.
   * @param {Number} tx   The horizontal translation to apply, in pixels.
   * @param {Number} ty   The vertical translation to apply, in pixels.
   * @param {Number} angleRads   The rotation to apply, in radians.
   * @private
   */
  _modifyMatrix: function (sx, sy, tx, ty, angleRads) {
    // the matrix is the ultimate source of truth, because
    // it contains all the transform information
    var decomp = this.getMatrix()._decompose();
    var matrixSx = decomp[Matrix._DECOMP_SX];
    var matrixSy = decomp[Matrix._DECOMP_SY];
    var matrixTx = decomp[Matrix._DECOMP_TX];
    var matrixTy = decomp[Matrix._DECOMP_TY];
    var matrixR = decomp[Matrix._DECOMP_R];
    var isMatrixAdjusted = false;
    if (sx != null && matrixSx != sx) {
      decomp[Matrix._DECOMP_SX] = sx;
      isMatrixAdjusted = true;
    }
    if (sy != null && matrixSy != sy) {
      decomp[Matrix._DECOMP_SY] = sy;
      isMatrixAdjusted = true;
    }
    if (tx != null && matrixTx != tx) {
      decomp[Matrix._DECOMP_TX] = tx;
      isMatrixAdjusted = true;
    }
    if (ty != null && matrixTy != ty) {
      decomp[Matrix._DECOMP_TY] = ty;
      isMatrixAdjusted = true;
    }
    if (angleRads != null && matrixR != angleRads) {
      decomp[Matrix._DECOMP_R] = angleRads;
      isMatrixAdjusted = true;
    }
    if (isMatrixAdjusted) {
      var mat = this.getMatrix();
      this.setMatrix(mat._recompose(decomp));
    }
  }
};

/**
 *  Abstract base class for displayable objects.
 *  @extends {dvt.Obj}
 *  @class
 *  @constructor
 */
const Displayable = function () {
  // This class should never be instantiated directly
};

Obj.createSubclass(Displayable, Obj);

/**
 * A boolean to toggle whether displayable IDs are sent to the DOM or not.  false for performance reasons but can be
 * changed to true for debugging purposes.
 */
Displayable.SET_ID_ON_DOM = false;

/**
 * @param {Context} context
 * @param {string} type The type of SVG element to be created.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
Displayable.prototype.Init = function (context, type, id) {
  this._context = context;
  this._elem = SvgShapeUtils.createElement(type); // @HTMLUpdateOK
  this._elem._obj = this; //  pointer back to this object
  this.setId(id);
  // TODO  Removal of null initialization routines
  this._bVisible = true;
  this._cursor = null;
  this._alpha = 1;
  this._matrix = null;

  this._ariaProperties = {};

  /**
   * Property map used to cache SVG property values to avoid DOM access.
   * @private
   */
  this._properties = {};
};

/**
 * Returns the application context.
 * @return {Context}
 */
Displayable.prototype.getCtx = function () {
  return this._context;
};

/**
 *  Returns the SVG DOM element representing this displayable object.
 *  @return {DOM_element}  An SVG DOM element representing this displayable object.
 */
Displayable.prototype.getElem = function () {
  return this._elem;
};

/**
 * Returns the outermost SVG DOM element of this displayable.  This should be used when
 * removing this displayable from the DOM.
 * @return {Displayable}
 */
Displayable.prototype.getOuterElem = function () {
  return this._outerElem ? this._outerElem : this.getElem();
};

/**
 * Returns the id of this displayable.
 * @return {string}
 */
Displayable.prototype.getId = function () {
  return this._id;
};

/**
 * Specifies the id of this displayable.
 * @param {string} id The id to set
 * @param {boolean} bForce True if we should always set id on DOM. Used for VoiceOver .
 */
Displayable.prototype.setId = function (id, bForce) {
  if (this._id !== id) {
    if (id && id.length === 0) {
      id = null;
    }
    this._id = id;
    if (Displayable.SET_ID_ON_DOM || bForce) {
      if (id) ToolkitUtils.setAttrNullNS(this.getOuterElem(), 'id', id);
      else ToolkitUtils.removeAttrNullNS(this.getOuterElem(), 'id');
    }
  }
};

/**
 * Returns the parent of this object.
 * @return {Displayable}
 */
Displayable.prototype.getParent = function () {
  return this._parent;
};

/**
 * Sets the parent of this object.
 * @param {Displayable} parent
 */
Displayable.prototype.setParent = function (parent) {
  this._parent = parent;
};

/**
 * Returns true if this object is a descendant of the specified object.
 * @param {dvt.Obj} obj
 * @return {boolean}
 */
Displayable.prototype.isDescendantOf = function (obj) {
  if (!obj || !this.getParent()) return false;
  else if (this.getParent() == obj) return true;
  else return this.getParent().isDescendantOf(obj);
};

/**
 * Specifies whether pixel hinting is enabled.
 * @param {boolean} bHint
 */
Displayable.prototype.setPixelHinting = function (bHint) {
  if (bHint) ToolkitUtils.setAttrNullNS(this._elem, 'shape-rendering', 'crispEdges');
  else ToolkitUtils.removeAttrNullNS(this._elem, 'shape-rendering');
};

/**
 *  Gets the visibility of this object.
 *  @return {boolean}  True if the object is visible, else false.
 */
Displayable.prototype.getVisible = function () {
  return this._bVisible;
};

/**
 *  Enables/disables the visibility of this object.
 *  @param {boolean}  bVis  True if the object is to be visible, else false if
 *  it is to be hidden.
 */
Displayable.prototype.setVisible = function (bVis) {
  if (this._bVisible !== bVis) {
    this._bVisible = bVis;
    var elem = this.getElem();

    // - HTML5: VISIBILITY="VISIBLE" LEFT ON ELEMENT AFTER ANIMATION
    //Since the default value for visibility is true, just remove the 'visibility' attribute.
    //This change is needed to avoid the attribute visibility="visible" left on
    //this element after animation.
    //Note: in SVG, the visibility attribute doesn't behave like Flash,
    //Ex: if a child has visibility="visible" and its container has visibility=hidden
    //the child is still visible
    if (bVis) {
      ToolkitUtils.removeAttrNullNS(elem, 'visibility');
    } else {
      ToolkitUtils.setAttrNullNS(elem, 'visibility', 'hidden');
    }
  }
};

/**
 *  Sets a clipping region for this object.
 *  @param {dvt.ClipPath}  cp  the dvt.ClipPath object specifying the clipping region.
 */
Displayable.prototype.setClipPath = function (cp) {
  // Update clip path reference count on the context
  if (cp) {
    if (this.ClipPathId == cp.getId()) {
      return;
    } else {
      if (this.ClipPathId) this._context.decreaseGlobalDefReference(this.ClipPathId);
      this.ClipPathId = cp.getId();
      this._context.increaseGlobalDefReference(this.ClipPathId);

      // Create an outer group if there is a matrix defined, since SVG applies transforms before clip paths.
      if (!this._outerElem && this._matrix) this._createOuterGroupElem();

      var id = cp.getId();
      if (id) {
        // essential to have an id to reference
        var context = this.getCtx();

        if (SvgShapeUtils.addClipPath(cp, context)) {
          // add to global defs
          // Set the clip path on the outer element of the shape
          ToolkitUtils.setAttrNullNS(this.getOuterElem(), 'clip-path', ToolkitUtils.getUrlById(id));
        }
      }
    }
  } else if (this.ClipPathId) {
    this._context.decreaseGlobalDefReference(this.ClipPathId);
    this.ClipPathId = null;
    ToolkitUtils.removeAttrNullNS(this.getOuterElem(), 'clip-path');
    return;
  }
};

/**
 * Adds a mask to the global defs element.
 * @param {dvt.Mask} mask
 */
Displayable.prototype.setMask = function (mask) {
  // Update clip path reference count on the context
  if (mask) {
    if (this.MaskId == mask.getId()) {
      return;
    } else {
      if (this.MaskId) this._context.decreaseGlobalDefReference(this.MaskId);
      this.MaskId = mask.getId();
      this._context.increaseGlobalDefReference(this.MaskId);

      // Create an outer group if there is a matrix defined, since SVG applies transforms before clip paths.
      if (!this._outerElem && this._matrix) this._createOuterGroupElem();

      var id = mask.getId();
      if (id) {
        // essential to have an id to reference
        var context = this.getCtx();

        if (SvgShapeUtils.addMask(mask, context)) {
          // add to global defs
          // Set the clip path on the outer element of the shape
          ToolkitUtils.setAttrNullNS(this.getOuterElem(), 'mask', ToolkitUtils.getUrlById(id));
        }
      }
    }
  } else if (this.MaskId) {
    this._context.decreaseGlobalDefReference(this.MaskId);
    this.MaskId = null;
    ToolkitUtils.removeAttrNullNS(this.getOuterElem(), 'mask');
    return;
  }
};

/**
 * Converts the Rectangle in the local coordinate system to the target displayable's coordinate system.
 * @param {Rectangle} rect
 * @param {Displayable} targetCoordinateSpace
 * @return {Rectangle}
 */
Displayable.prototype.ConvertCoordSpaceRect = function (rect, targetCoordinateSpace) {
  if (!targetCoordinateSpace || targetCoordinateSpace === this) return rect;

  // First calculate relative to the stage
  var stageP1 = this.localToStage(new Point(rect.x, rect.y));
  var stageP2 = this.localToStage(new Point(rect.x + rect.w, rect.y + rect.h));

  // Then convert relative to target
  var targetP1 = targetCoordinateSpace.stageToLocal(stageP1);
  var targetP2 = targetCoordinateSpace.stageToLocal(stageP2);

  return new Rectangle(
    Math.min(targetP1.x, targetP2.x),
    Math.min(targetP1.y, targetP2.y),
    Math.abs(targetP2.x - targetP1.x),
    Math.abs(targetP2.y - targetP1.y)
  );
};

/**
 * Returns the dimensions of the displayable by calling getBBox.
 * @return {Rectangle}
 */
Displayable.prototype.GetSvgDimensions = function () {
  return DisplayableUtils.getSvgDimensions(this.getElem());
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.
 * @param {Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
Displayable.prototype.getDimensions = function (targetCoordinateSpace) {
  var bounds = this.GetSvgDimensions();
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

//:
/**
 * Returns the bounds of the displayable relative to the target coordinate space, including stroke width.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.
 * @param {Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
Displayable.prototype.getDimensionsWithStroke = function (targetCoordinateSpace) {
  var bounds = this.GetDimensionsWithStroke();
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

//:
/**
 * Returns the dimensions of the displayable relative to the target space.
 * @param {Rectangle} targetCoordinateSpace
 * @return {Rectangle}
 * @protected
 */
Displayable.prototype.GetDimensionsWithStroke = function (targetCoordinateSpace) {
  //get dims for the shape elem, and change coord space if necessary
  var dims = this.GetElemDimensionsWithStroke();
  if (!targetCoordinateSpace || targetCoordinateSpace === this) return dims;
  else {
    // Calculate the bounds relative to the target space
    return this.ConvertCoordSpaceRect(dims, targetCoordinateSpace);
  }
};

//:
/**
 * Returns the dimensions of the displayable by calling getBBox.
 * @return {Rectangle}
 * @protected
 */
Displayable.prototype.GetElemDimensionsWithStroke = function () {
  //the method is overridden in dvt.Shape to account for the stroke
  return this.GetSvgDimensions();
};

/**
 * Transfer relevant attributes from the original SVG DOM element to the new SVG DOM element.
 * @param {object} fromElem  The SVG DOM element.
 * @param {object} toElem  The new SVG DOM element.
 * @param {array} attrNames The array of attribute names to transfer.
 * @protected
 */
Displayable.TransferAttributes = function (fromElem, toElem, attrNames) {
  if (attrNames) {
    var attrName;
    var attrValue;
    var numAttrs = attrNames.length;
    for (var i = 0; i < numAttrs; i++) {
      attrName = attrNames[i];
      attrValue = ToolkitUtils.getAttrNullNS(fromElem, attrName);
      if (attrValue) {
        ToolkitUtils.removeAttrNullNS(fromElem, attrName);
        ToolkitUtils.setAttrNullNS(toElem, attrName, attrValue);
        if (Agent.browser === 'ie' || Agent.browser === 'edge') {
          // , prev removeAttributeNS()
          ToolkitUtils.setAttrNullNS(fromElem, attrName, null); // fails for IE9 (9.0.8112.16421)
        }
      }
    }
  }
};

/**
 * Creates an outer group element to workaround issues with filters and clip paths.
 * @private
 */
Displayable.prototype._createOuterGroupElem = function () {
  if (this._outerElem) return;

  var outerId = this._id ? this._id + '_outer' : null;
  this._outerElem = SvgShapeUtils.createElement('g', outerId);

  // Reparent the DOM elements
  var parent = this.getParent();
  if (parent) {
    var parentElem = parent.getElem();
    parentElem.replaceChild(this._outerElem, this.getElem());
  }
  ToolkitUtils.appendChildElem(this._outerElem, this.getElem());

  // Transfer attributes from the old outermost SVG element to the new outer element
  Displayable.TransferAttributes(
    this.getElem(),
    this._outerElem,
    DisplayableUtils.ATTRS_TRANSFERABLE_TO_OUTER
  );
};

/**
 * @return {DvtCssStyle} the dvt.CSSStyle of this object.
 */
Displayable.prototype.getCSSStyle = function () {
  return this._cssStyle;
};

/**
 * Sets the dvt.CSSStyle of this object.
 * @param {DvtCssStyle} style The dvt.CSSStyle of this object.
 */
Displayable.prototype.setCSSStyle = function (style) {
  this._cssStyle = style; // TODO  Should we have this on non-text-objects?
};

/**
 * Sets the cursor on this object.
 * @param {string} cursorType
 */
Displayable.prototype.setCursor = function (cursorType) {
  this._cursor = cursorType;

  // Update the DOM
  if (cursorType) ToolkitUtils.setAttrNullNS(this.getElem(), 'cursor', cursorType);
  else ToolkitUtils.removeAttrNullNS(this.getElem(), 'cursor');
};

/**
 * Gets the cursor used on this object.
 * @return {String}
 */
Displayable.prototype.getCursor = function () {
  return this._cursor;
};

/**
 * Sets whether mouse events are enabled on this object.
 * @param {boolean} bEnabled whether mouse events are enabled
 */
Displayable.prototype.setMouseEnabled = function (bEnabled) {
  var val = bEnabled ? 'visiblePainted' : 'none';
  ToolkitUtils.setAttrNullNS(this.getElem(), 'pointer-events', val);
};

/**
 *  Returns the alpha channel value.
 *  @return {number} A value between 0 (invisible) and 1 (opaque).
 */
Displayable.prototype.getAlpha = function () {
  return this._alpha;
};

/**
 *  Sets the alpha.
 *  @param {number} alpha  A value between 0 (invisible) and 1 (opaque).
 */
Displayable.prototype.setAlpha = function (alpha) {
  //when animating alpha, small values are turned into strings like
  //"3.145e-8", which SVG incorrectly clamps to 1, so just cut off
  //small values here and make them 0
  if (alpha < 0.00001) alpha = 0;

  if (alpha !== this._alpha) {
    this._alpha = alpha;
    ToolkitUtils.setAttrNullNS(this.getElem(), 'opacity', this._alpha, 1);
  }
};

/**
 * Applies deferred aria role and properties to the DOM.
 */
Displayable.prototype.applyAriaProperties = function () {
  if (Agent.deferAriaCreation()) {
    // Apply Aria Role
    if (this._ariaRole) this._setAriaRole(this._ariaRole);

    // Apply Aria Properties
    for (var property in this._ariaProperties) {
      this._setAriaProperty(property, this._ariaProperties[property]);
    }
  }
};

/**
 * Sets the WAI-ARIA role.
 * @param {String} role The role attribute value.
 * @param {boolean} bForce True if the role should be set
 *                         regardless of whether aria creation is deferred.
 */
Displayable.prototype.setAriaRole = function (role, bForce) {
  if (!Agent.deferAriaCreation() || bForce) this._setAriaRole(role);

  this._ariaRole = role;
};

/**
 * Sets the WAI-ARIA role.
 * @param {String} role The role attribute value.
 * @private
 */
Displayable.prototype._setAriaRole = function (role) {
  var elem = this.GetAriaElem();
  if (role) ToolkitUtils.setAttrNullNS(elem, 'role', role);
  else ToolkitUtils.removeAttrNullNS(elem, 'role');
};

/**
 * Gets the WAI-ARIA role.
 * @return {String} The role attribute value.
 */
Displayable.prototype.getAriaRole = function () {
  return this._ariaRole;
};

/**
 * Returns the DOM element to add WAI-ARIA attributes to. Allows subclasses to return the outer group element if
 * needed (see ).
 * @return {SVGElement} The SVG DOM element to add wai-aria attributes to
 * @protected
 */
Displayable.prototype.GetAriaElem = function () {
  return this.getElem();
};

/**
 * Sets the WAI-ARIA property/state.
 * @param {string} property The property/state attribute name. The prefix "aria-" should be skipped.
 * @param {string|number} value The property/state attribute value.
 * @param {boolean} bForce True if the property should be set
 *                         regardless of whether aria creation is deferred.
 */
Displayable.prototype.setAriaProperty = function (property, value, bForce) {
  if (!property) return;

  if (!Agent.deferAriaCreation() || bForce) this._setAriaProperty(property, value);

  this._ariaProperties[property] = value;
};

/**
 * Sets the WAI-ARIA property/state.
 * @param {string} property The property/state attribute name. The prefix "aria-" should be skipped.
 * @param {string|number} value The property/state attribute value.
 * @private
 */
Displayable.prototype._setAriaProperty = function (property, value) {
  var elem = this.GetAriaElem();
  if (value != null && value !== '') {
    // Make replacements on the text string as needed
    if (property === 'label') value = AriaUtils.processAriaLabel(value);

    ToolkitUtils.setAttrNullNS(elem, 'aria-' + property, value);
  } else ToolkitUtils.removeAttrNullNS(elem, 'aria-' + property);
};

/**
 * Gets the WAI-ARIA property/state.
 * @param {String} property The property/state attribute name. The prefix "aria-" should be skipped.
 * @return {String} The property/state attribute value.
 */
Displayable.prototype.getAriaProperty = function (property) {
  if (property) {
    return this._ariaProperties[property];
  } else {
    return null;
  }
};

/**
 * Convert a point from stage coords to local coords.
 * @param {Point}  point  point in stage coords
 * @return {Point}
 */
Displayable.prototype.stageToLocal = function (point) {
  var pathToStage = this.getPathToStage();
  var mat;
  var retPoint = point;
  for (var i = pathToStage.length - 1; i >= 0; i--) {
    mat = pathToStage[i].getMatrix();
    mat = mat.invert();
    retPoint = mat.transformPoint(retPoint);
  }
  return retPoint;
};

/**
 * Convert a point from local coords to stage coords.
 * @param {Point}  point  point in local coords
 * @return {Point}
 */
Displayable.prototype.localToStage = function (point) {
  var pathToStage = this.getPathToStage();
  var mat;
  var retPoint = point;
  for (var i = 0; i < pathToStage.length; i++) {
    mat = pathToStage[i].getMatrix();
    retPoint = mat.transformPoint(retPoint);
  }
  return retPoint;
};

/**
 * Get an array of objects in the tree from this displayable to the stage.
 * The returned array is ordered with this displayable first and the stage
 * last, like [this, this.getParent(), ... , stage].
 * @return {array}
 */
Displayable.prototype.getPathToStage = function () {
  var displayable = this;
  var array = [];
  while (displayable) {
    array.push(displayable);
    displayable = displayable.getParent();
  }
  return array;
};

/**
 * Removes the displayable from its parent if one exists.
 */
Displayable.prototype.removeFromParent = function () {
  if (this._parent) this._parent.removeChild(this);
};

/**
 *    Destroy the displayable.  It should no longer be used or displayed
 */
Displayable.prototype.destroy = function () {
  //: Remove all draw effects at once, because removing
  //them one by one results in the remaining ones being reapplied at each
  //iteration.  Since this object is being destroyed, it is most likely
  //disconnected from the display list.  When the draw effects are applied,
  //they may call getBBox() on the element, which can result in errors in
  //Firefox when the object is disconnected, and the view not being rendered.
  this.removeAllDrawEffects();
  if (this.ClipPathId) this.setClipPath(null);
};

/**
 * Helper function to access the value of a property that was set using SetProperty.
 * @param {string} name the name of the attribute.
 * @return {object}
 * @protected
 */
Displayable.prototype.GetProperty = function (name) {
  return this._properties[name];
};

/**
 * Helper function to store the value of a property. Protects against attribute name collision with subclasses by
 * storing the value on a child object.
 * @param {string} name The name of the attribute.
 * @param {string} value The value of the attribute.
 * @return {Displayable} Returns this instance to support chaining.
 * @protected
 */
Displayable.prototype.SetProperty = function (name, value) {
  if (value !== this._properties[name]) {
    this._properties[name] = value;
  }
  return this;
};

/**
 * Helper function to set the specified SVG attribute on the DOM element.  Optimizes getters by storing a copy of the
 * value using SetAttr so that DOM access isn't required. If the property value has been updated, then
 * SvgPropertyChanged will be called to allow for additional processing if needed.
 * @param {string} name The name of the attribute.
 * @param {string} value The value of the attribute.
 * @param {string=} defaultValue The default value of the attribute, which can be provided to optimize performance.
 * @return {Displayable} Returns this instance to support chaining.
 * @protected
 */
Displayable.prototype.SetSvgProperty = function (name, value, defaultValue) {
  if (value !== this._properties[name]) {
    this._properties[name] = value;
    ToolkitUtils.setAttrNullNS(this._elem, name, value, defaultValue);
    this.SvgPropertyChanged(name);
  }
  return this;
};

/**
 * Creates the getter and setter for SVG properties. The propertyInfo details are optional and can have the default value and customize accessor(lower case).
 * eg: {r: {value: 0, name: 'radius'}} will create getRadius and setRadius with a default set value of 0.
 * @param {object} obj The object on which the getters and setters will be set.
 * @param {object} propertyInfo A map of SVG property name to details(name and value) needed to create the setter and getter for it.
 */
Displayable.defineProps = function (obj, propertyInfo) {
  var props = Object.keys(propertyInfo);
  props.forEach(function (name) {
    var details = propertyInfo[name];
    var accessor = details.name || name;
    accessor = accessor.charAt(0).toUpperCase() + accessor.slice(1); // Capitalize first letter
    obj.prototype['get' + accessor] = function () {
      return this.GetProperty(name);
    };
    obj.prototype['set' + accessor] = function (val) {
      return this.SetSvgProperty(name, val, details.value);
    };
  });
};

/**
 * Callback that is notified whenever the value of a property is changed by SetSvgProperty. Subclasses can override to
 * perform additional processing, such as updating the selection feedback, when properties are changed.
 * @param {string} name The name of the attribute.
 * @protected
 */
Displayable.prototype.SvgPropertyChanged = function (name) {
  // subclasses can override
};

/**
 * Prepares an aria-label for a data object.
 * The aria-label is composed of an application provided description and the data object's current states.
 * @param {String|function} shortDesc  The short description for a data object
 * @param {Array} states An array of states to populate in the aria label
 * @param {function} context shortDesc Function that returns the context object
 * @return {String}
 */
Displayable.generateAriaLabel = function (shortDesc, states, context) {
  var desc = [];
  var hasStates = states && states.length > 0;

  if (shortDesc) {
    desc.push(Displayable.resolveShortDesc(shortDesc, context));
  }
  if (hasStates) {
    desc.push(states.join(AriaUtils.ARIA_LABEL_STATE_DELIMITER));
  }

  return desc.join(AriaUtils.ARIA_LABEL_DESC_DELIMITER);
};

/**
 * Resolves the shortDesc
 * @param {String|function} shortDesc  The short description for a data object
 * @param {function} context shortDesc Function that returns the context object
 * @return {String}
 */
Displayable.resolveShortDesc = function (shortDesc, context) {
  if (typeof shortDesc === 'function') {
    return shortDesc(context());
  }
  return shortDesc;
};

Object.assign(Displayable.prototype, _DRAW_EFFECT);
Object.assign(Displayable.prototype, _EVENT);
Object.assign(Displayable.prototype, _PAINT);
Object.assign(Displayable.prototype, _TRANSFORM);

/**
 * Container for displayable objects.
 * @extends {Displayable}
 * @param {dvt.Context} context
 * @param {string=} id The optional id for the corresponding DOM element.
 * @param {boolean=} shapeContainer whether this container is a dvt.Shape
 * @class
 * @constructor
 */
const Container = function (context, type, id, shapeContainer) {
  this.Init(context, type, id, shapeContainer);
};

Obj.createSubclass(Container, Displayable);

/**
 * @override
 */
Container.prototype.Init = function (context, type, id, shapeContainer) {
  // For the SVG implementation, we need to know whether this is a standard
  // non-shape container, or a shape "container".  Since elementary objects
  // may not be nested, e.g. a rect containing another rect, an artificial
  // group must be constructed to group the parent and the children.  That
  // is they actually become grouped siblings.
  this._bShapeContainer = !!shapeContainer;
  Container.superclass.Init.call(this, context, type != null ? type : 'g', id);
  this._childGroupElem = null; // child surround group
};

/**
 * @protected
 * Array of SVG attributes that should be transferred from the shape
 * tag to the group when this shape becomes a group (when children
 * are added to it).
 */
Container.AttributesTransferableToGroup = [
  'transform',
  'opacity',
  'visibility',
  'pointer-events',
  'clip-path',
  'cursor'
];

/**
 *  Adds the specified object as a child of this container. The object is
 *  added to the end of the child list.  If the object is already a child,
 *  it will be moved to the end of the child list.
 *   @param {Displayable} obj The object to be added.
 */
Container.prototype.addChild = function (obj) {
  if (obj) {
    // Remove the object from its current parent
    var oldParent = obj.getParent();
    if (oldParent) oldParent.removeChild(obj);

    //initialize _arList after removing child from parent in case
    //this container was the parent, which could result in removeChild()
    //setting _arList to null if the last child was removed
    if (!this._arList) {
      this._arList = [];
    }

    // Add the object to this container
    obj.setParent(this);

    if (this._bShapeContainer) {
      //  This is a shape "container".
      //  If no previous children, will create a group DOM element for the this
      //  (parent) object and add the new child to the child group DOM element.
      //  else will add the object directly to the shape group container element.
      this.CreateChildGroupElem(false);
    }

    //   - GET RID OF DVTGOLINK AND IMPLS
    //  if there is an anchor elem <a> for this container
    //  append child to the <a> element
    //  otherwise append child directly to this container group element
    var containerElem = this.getContainerElem();
    ToolkitUtils.appendChildElem(containerElem, obj.getOuterElem());

    this._arList.push(obj);
  }
};

/**
 *  Adds the specified object as a child of this container at the specified index. Returns
 *  immediately if the index position doesn't already exist in the child list (unless the
 *  index equals the number of children).  If a currently occupied index is specified, the
 *  current child at that position and all subsequent children are moved one position
 *  higher in the list.  If the object is a child of another container, it is removed and
 *  reparented in the new container. Note that the action of this method is to remove the
 *  object from the current container (which may also be the container that it will be
 *  added to), so for an object "move" in the same container, all objects with a higher
 *  index will now move one position lower.  The object is now inserted at the supplied
 *  index.
 *  @param {dvt.Obj} obj  The object to be added (must be a descendent of {@link dvt.Obj}).
 *  @param {number} index The index at which to add this object
 */
Container.prototype.addChildAt = function (obj, index) {
  this.AddChildAt(obj, index);
};

// TODO JSDoc, exists so that shapes can call without being confused by the additional shapes for selection
Container.prototype.AddChildAt = function (obj, index) {
  if (index >= 0 && index <= this.getNumChildren() && obj) {
    // validate index
    var curIndex = this._findChild(obj); // note if obj is child of this container
    if (curIndex >= 0 && curIndex == index)
      // do nothing if child of this container
      return; // and move is to current position
    var oldParent = obj.getParent(); // remove object from current parent
    if (oldParent) oldParent.removeChild(obj);
    obj.setParent(this); // reparent

    // If obj is child of this container and the intent is to place it after the last
    // object (before the above remove was done), decrement the index.
    if (curIndex >= 0) {
      if (index == this.getNumChildren() + 1) index--;
    }

    var idx = index;

    if (this._bShapeContainer) {
      //  This is a shape "container".
      //  If no previous children, will create a group DOM element for the this
      //  (parent) object and add the new child to the child group DOM element.
      //  else will add the object directly to the shape group container element.
      this.CreateChildGroupElem(false);

      //need to increment the index to account for the shape dom element,
      //which should be the first child of the childGroupElem
      idx++;
    }

    //   - GET RID OF DVTGOLINK AND IMPLS
    //  if there is an anchor elem <a> for this container
    //  append child to the <a> element
    //  otherwise append child directly to this container group element
    var containerElem = this.getContainerElem();
    var existingNode = containerElem.childNodes[idx];
    // : IE9 cannot handle a value of undefined in insertBefore.  Set to null in such a case.
    if (!existingNode) existingNode = null;
    containerElem.insertBefore(obj.getOuterElem(), existingNode); //@HTMLUpdateOK

    if (!this._arList) {
      this._arList = [];
    }
    this._arList.splice(index, 0, obj);
  }
};

/**
 * Returns true if the specified displayable is a direct child of this container.
 * @param {Displayable} obj The object to be searched for.
 * @return {boolean} True if object is contained by this container, else false.
 */
Container.prototype.contains = function (obj) {
  return this._findChild(obj) >= 0;
};

/**
 * Returns index of specified child obj in the internal list, or -1 if not
 * found.
 * @type {dvt.Obj}
 * @private
 */
Container.prototype._findChild = function (obj) {
  var idx = -1;

  if (this._arList) {
    var len = this._arList.length;
    for (var i = 0; i < len; i++) {
      // find the obj
      if (this._arList[i] === obj) {
        idx = i;
        break;
      }
    }
  }

  return idx;
};

/**
 *   Returns the child after the specified object, or null if it is the last
 *   in the list.
 *   @param {dvt.Obj} obj  The object whose successor is required.
 *   @type {dvt.Obj}
 */
Container.prototype.getChildAfter = function (obj) {
  var o = null;
  var idx = this._findChild(obj);

  if (idx >= 0 && ++idx < this._arList.length) {
    o = this._arList[idx];
  }

  return o;
};

/**
 *   Returns the child before the specified object, or null if the is the first
 *   in the list.
 *   @param {dvt.Obj} obj  The object whose predecessor is required.
 *   @type {dvt.Obj}
 */
Container.prototype.getChildBefore = function (obj) {
  var o = null;
  var idx = this._findChild(obj);

  if (idx > 0) {
    o = this._arList[idx - 1];
  }

  return o;
};

/**
 *   Returns the child at the specified zero-relative position, or null if
 *   there is no child represented by the position.
 *   @param {number} idx  The zero-relative index to the child object.
 *   @type {dvt.Obj}
 */
Container.prototype.getChildAt = function (idx) {
  var o = null;

  if (this._arList && this._arList.length > idx && idx >= 0) {
    o = this._arList[idx];
  }

  return o;
};

/**
 *   Returns the container index of the specified object, or -1 if the object
 *   is not a direct child of the container.
 *   @param {dvt.Obj} obj  The object whose container index is required.
 *   @type {number}
 */
Container.prototype.getChildIndex = function (obj) {
  return this._findChild(obj);
};

/**
 *   Returns the number of direct children of this container
 *   @type {number}
 */
Container.prototype.getNumChildren = function () {
  return this._arList ? this._arList.length : 0;
};

/**
 *   Removes the specified child object from this container.
 *   @param {dvt.Obj} obj  The object to be removed.
 */
Container.prototype.removeChild = function (obj) {
  var idx = this._findChild(obj); // is child in container
  if (idx !== -1) {
    this._removeObj(obj, idx);
  }
};

/**
 *   Removes the specified child object from this container.
 *   @param {Displayable} obj The object to be removed.
 */
Container.prototype.removeChildImpl = function (obj) {
  var elemObj = obj.getOuterElem(); // obj's outer DOM element
  var parent = obj.getParent(); // get parent object (the container or the shape group container)

  if (elemObj && parent) {
    //  - GET RID OF DVTGOLINK AND IMPLS
    var elem = this.getContainerElem();
    elem.removeChild(elemObj);
  }

  //  If no more children, can remove the added group for child containership,
  //  and reparent the containing shape directly back to its parent in the
  //  position that the added child group container occupied.
  //  - GET RID OF DVTGOLINK AND IMPLS
  // don't remove the childGroupElem because we need it to hold the anchor
  if (!this._anchorElem && this._bShapeContainer && this.getNumChildren() === 1) {
    var childGroupElem = this._childGroupElem;
    var childGroupElemParent = childGroupElem ? childGroupElem.parentNode : null;

    if (childGroupElemParent) {
      Displayable.TransferAttributes(
        childGroupElem,
        this._elem,
        this.GetAttributesTransferableToGroup()
      );
      childGroupElemParent.replaceChild(this._elem, childGroupElem);
      this._childGroupElem = null;
    }
  }
};

/**
 *   Removes the specified child object at the index specfied from this container.
 *   @param {number} idx  The index of the object to be removed.
 *   @return {dvt.Obj}  The object removed.
 */
Container.prototype.removeChildAt = function (idx) {
  var obj = this.getChildAt(idx);

  if (obj) {
    this._removeObj(obj, idx);
  }

  return obj;
};

/**
 *   Removes all child object's from this container.
 */
Container.prototype.removeChildren = function () {
  if (this._arList) {
    var ar = this._arList;

    while (this.getNumChildren() > 0) {
      this._removeObj(ar[0], 0);
    }
  }
};

/**
 *   Removes the specified object from this container.
 *   @param {dvt.Obj}  obj   The object to be removed.
 *   @param {number}  idx   The index position (zero relative) of the child
 *                          in the container's list of chhildren.
 *    @private
 */
Container.prototype._removeObj = function (obj, idx) {
  //  obj must be in the container.
  this.removeChildImpl(obj); // perform platform remove
  obj.setParent(null);

  this._arList.splice(idx, 1); // remove from list
  if (this._arList.length === 0) {
    this._arList = null;
  }
};

/**
 *    Destroy the container.  It should no longer be used or displayed
 */
Container.prototype.destroy = function () {
  Container.superclass.destroy.call(this);
  var childCount = this.getNumChildren();
  for (var i = 0; i < childCount; i++) {
    var child = this.getChildAt(i);
    child.destroy();
  }
};

/**
 * Returns an rray of SVG attributes that should be transferred from the shape
 * tag to the group when this shape becomes a group (when children are added to it).
 * @return {array}
 */
Container.prototype.GetAttributesTransferableToGroup = function () {
  return Container.AttributesTransferableToGroup;
};

/**
 * @override
 */
Container.prototype.getElem = function () {
  return this._childGroupElem ? this._childGroupElem : this._elem;
};

/**
 * Create a group element for adding children.
 * @param {boolean} rmChildren True if all children should be removed
 * @param {boolean} forced True always create a child group element for shape container
 * @protected
 */
Container.prototype.CreateChildGroupElem = function (rmChildren, forced) {
  //  This is a shape "container".
  //  If no previous children, will create a group DOM element for the this
  //  (parent) object and add the new child to the child group DOM element.
  //  else will add the object directly to the shape group container element.
  if (!this._childGroupElem && (forced || this.getNumChildren() === 0)) {
    var childGroupId = Displayable.SET_ID_ON_DOM && this._id ? this._id + '_g' : null;
    this._childGroupElem = SvgShapeUtils.createElement('g', childGroupId);

    //  Remove this's DOM element from the parent, and append to child group DOM element.
    var parent = this.getParent();
    var elemParent;
    if (parent) {
      elemParent = parent.getElem();
      elemParent.replaceChild(this._childGroupElem, this._elem);
    }
    if (!rmChildren) ToolkitUtils.appendChildElem(this._childGroupElem, this._elem); // add shape to new group
    //transfer attributes from the old outermost SVG element to the
    //new outer group element
    Displayable.TransferAttributes(
      this._elem,
      this._childGroupElem,
      this.GetAttributesTransferableToGroup()
    );

    //Note need to copy _obj reference to the new group element so that events can be propagated.
    if (this._elem._obj) {
      this._childGroupElem._obj = this._elem._obj;
    }
  } else if (rmChildren) {
    this.removeChildren();
  }
};

/**
 * @override
 */
Container.prototype.getDimensions = function (targetCoordinateSpace) {
  if (!Agent.isEnvironmentTest() || this.getNumChildren() === 0 || !this.CanOptimizeDimensions()) {
    return Container.superclass.getDimensions.call(this, targetCoordinateSpace);
  }

  let localDims = this._getDimensionsHelper((child) => child.getDimensions(this));
  if (this._bShapeContainer) {
    const selfDims = DisplayableUtils.getSvgDimensions(this._elem);
    localDims = localDims.getUnion(selfDims);
  }
  return this.ConvertCoordSpaceRect(localDims, targetCoordinateSpace);
};

Container.prototype.CanOptimizeDimensions = function () {
  return true;
};

//:
/**
 * @override
 */
Container.prototype.getDimensionsWithStroke = function () {
  //get dims in coordinate space of this container, because we're
  //processing whole subtree of children under this container
  return this._getDimensionsHelper((child) => child.GetDimensionsWithStroke(this));
};

Container.prototype._getDimensionsHelper = function (childVisitor) {
  //a pure container has no shape of its own, so calculate the
  //dims for all child shapes in the subtree rooted at this container
  //build an initial array of all direct children of this container
  var ar = [];
  var numChildren = this.getNumChildren();
  for (var i = 0; i < numChildren; i++) {
    ar.push(this.getChildAt(i));
  }

  //loop over the array of children until it's empty
  var totalDims = null;
  while (ar.length > 0) {
    //remove the first object from the array
    var child = ar.shift();
    var dims = childVisitor(child);
    if (dims) {
      if (!totalDims) {
        totalDims = dims;
      } else {
        totalDims = totalDims.getUnion(dims);
      }
    }

    if (!child.includeChildSubtree || child.includeChildSubtree()) {
      //add any children of current object to end of array
      numChildren = child.getNumChildren();
      for (var j = 0; j < numChildren; j++) {
        ar.push(child.getChildAt(j));
      }
    }
  }
  return totalDims;
};

//:
Container.prototype.GetDimensionsWithStroke = function (targetCoordinateSpace) {
  //pure container doesn't have its own dimensions
  return null;
};

/**
 * Returns the anchor element if exists.
 */
Container.prototype.getContainerElem = function () {
  return this._anchorElem ? this._anchorElem : this.getElem();
};

/**
 * Updates the geometries of the Shape used for the selection effects.
 */
Container.prototype.UpdateSelectionEffect = function () {
  // Needed for setFill function
};

/**
 * Changes the shape to an outline shape format.  Used for legends
 * markers that represent a hidden state for the associated series risers.
 * @param {String} fc Border color for hollow shape in format of #aarrggbb
 * @param {number} strokeWidth Stroke width used for shapes that were transofrmed (optional)
 */
Container.prototype.setHollow = function (fc, strokeWidth) {
  // Delegate to children
  for (var i = 0; i < this.getNumChildren(); i++) {
    var child = this.getChildAt(i);
    var childColor = child.getFill() ? child.getFill().getColor() : fc;
    child.setHollow(childColor, strokeWidth);
  }
};

/**
 * Whether or not to evaluate the children of a container when calculating dimensions.
 * Note: Should be overridden to return false for any container that overrides GetDimensionsWithStroke
 * to not return null
 * @return {boolean}
 */
Container.prototype.includeChildSubtree = function () {
  return true;
};

/**
 * Top level container for all displayables contained within the SVG document.  This class should not be extended.
 * @extends {dvt.Container}
 * @param {dvt.Context} context
 * @param {SVGElement} svgRoot The containing SVG document.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @class
 * @constructor
 */
const DvtStage = function (context, svgRoot, id) {
  // Note: Initialization code in constructor to prevent subclassing.
  this.Init(context, 'g', id);

  this._SVGRoot = svgRoot; // containing SVG DOM element

  this.disableSelection(this._elem);

  //set cursor to default to avoid text cursors on text objects
  this.setCursor('default');
};

Obj.createSubclass(DvtStage, Container);

/**
 * @override
 */
DvtStage.prototype.addChild = function (obj) {
  // Note: This function exists to ensure that applications can add children to the stage.  Do not remove.
  DvtStage.superclass.addChild.call(this, obj);
};

/**
 * Returns the root SVG document.
 * @return {object}
 */
DvtStage.prototype.getSVGRoot = function () {
  return this._SVGRoot;
};

/**
 * Disables text selection.
 * Note: Originally added for .
 * It is also needed to support 'grabbing' cursor on Safari at panning event.
 * @param {SVGElement} target
 */
DvtStage.prototype.disableSelection = function (target) {
  target.onselectstart = function () {
    return false;
  };
};

/**
 * Class representing a scheduling service.
 * @extends {Obj}
 * @class DvtScheduler
 * @constructor
 *
 * @param {Context}  context  platform specific context object
 */
const DvtScheduler = function (context) {
  this.Init(context);
};

Obj.createSubclass(DvtScheduler, Obj);

/**
 * @param {Context}  context  platform specific context object
 * @protected
 */
DvtScheduler.prototype.Init = function (context) {
  this._scheduledItems = new Array();
  this._bRunning = false;
};

/**
 * @protected
 * Handle a timer tick.
 */
DvtScheduler.prototype.HandleTimer = function () {
  var time = new Date().getTime();
  for (var i = 0; i < this._scheduledItems.length; i++) {
    var scheduled = this._scheduledItems[i];
    if (scheduled.processTime(time)) this.removeScheduled(scheduled);
  }

  if (this._scheduledItems.length < 1) {
    if (this._bRunning) {
      this._bRunning = false;
      if (this._animationRequestId) {
        DvtAnimationFrameUtils.cancelAnimationFrame(this._animationRequestId);
      }
    }
    this._animationRequestId = null;
  } else {
    this._animationRequestId = DvtAnimationFrameUtils.requestAnimationFrame(
      Obj.createCallback(this, this.HandleTimer)
    );
  }

  // Private flag for animation testing. Do not remove.
  DvtScheduler._frameCount++;
};

/**
 * Add a scheduled item to be run.
 *
 * @param {dvt.Animator}  scheduled  item to add
 */
DvtScheduler.prototype.addScheduled = function (scheduled) {
  var i = this._scheduledItems.indexOf(scheduled);
  if (i < 0) {
    this._scheduledItems.push(scheduled);
  }

  this.play();
};

/**
 * Remove a scheduled item.
 *
 * @param {dvt.Animator}  scheduled  item to remove
 */
DvtScheduler.prototype.removeScheduled = function (scheduled) {
  var i = this._scheduledItems.indexOf(scheduled);
  if (i >= 0) {
    this._scheduledItems.splice(i, 1);
  }
};

/**
 * Play the scheduler.
 */
DvtScheduler.prototype.play = function () {
  if (!this._bRunning) {
    for (var i = 0; i < this._scheduledItems.length; i++) {
      var scheduled = this._scheduledItems[i];
      if (!scheduled.isRunning()) {
        scheduled.play();
      }
    }

    this._bRunning = true;

    this._animationRequestId = DvtAnimationFrameUtils.requestAnimationFrame(
      Obj.createCallback(this, this.HandleTimer)
    );
  }
};

/**
 * @param {dvt.Context} context
 * @param {string} domElementId
 * @constructor
 * @class HtmlTooltipManager
 */
const HtmlTooltipManager = function (context, domElementId) {
  this.Init(context, domElementId);
};

Obj.createSubclass(HtmlTooltipManager, Obj);

/** @private @const */
HtmlTooltipManager._TOOLTIP_DIV_ID = '_dvtTooltip';

/** @private @const */
HtmlTooltipManager._SHOW_DELAY = 500; // in ms

/** @private @const */
HtmlTooltipManager._BORDER_COLOR = '#9ba2b0';
/** @private @const */
HtmlTooltipManager._FONT_COLOR = '#383a47';

/** @private @const */
HtmlTooltipManager._VIEWPORT_BUFFER = 15;

/**
 * @param {dvt.Context} context
 * @param {string} domElementId
 */
HtmlTooltipManager.prototype.Init = function (context, domElementId) {
  this._context = context;

  // if a dom element is specified, it will override the default tooltip div
  this._domElementId = domElementId ? domElementId : HtmlTooltipManager._TOOLTIP_DIV_ID;
  this._isTooltip = true;
};

/**
 * Displays a datatip.
 * @param {number} x The pageX coordinate at which to display the datatip.
 * @param {number} y The pageY coordinate at which to display the datatip.
 * @param {string} text The string to show in the datatip.
 * @param {string} borderColor The border color for the datatip.
 * @param {boolean=} useOffset false to prevent offsets from being applied. Offsets will be applied otherwise.
 */
HtmlTooltipManager.prototype.showDatatip = function (x, y, text, borderColor, useOffset) {
  // If useOffset not specified, then apply offsets
  if (useOffset == null) useOffset = true;

  this._isTooltip = false;
  this._showTextAtPosition(x, y, text, borderColor, useOffset, 'oj-dvt-datatip');
};

/**
 * Helper to display a datatip or tooltip.
 * @param {number} x The pageX coordinate at which to display the tooltip.
 * @param {number} y The pageY coordinate at which to display the tooltip.
 * @param {number|string|node|Array<node>|boolean} text The string or HTML node(s) to show in the tooltip. This can also be the true(boolean), to indicate that the tooltip content shouldn't be modified
 * @param {string} borderColor The border color for the tooltip.
 * @param {boolean} useOffset True if offsets should be applied to the coordinates.
 * @param {string} popupClass The style class to use for the outer tooltip div.
 * @private
 */
HtmlTooltipManager.prototype._showTextAtPosition = function (
  x,
  y,
  text,
  borderColor,
  useOffset,
  popupClass
) {
  var tooltipDOM;
  var outerElem = this.getTooltipElem();
  var canModify = text !== true; // Check if we are to modify the tooltip contents

  if (canModify) {
    // Clear out the previous tooltip to make room for the new one.
    while (outerElem.hasChildNodes()) outerElem.removeChild(outerElem.firstChild);
  }

  // Make replacements on the text string as needed
  if (typeof text == 'string') {
    // For security, turn HTML brackets into strings to disable tags.
    text = text.replace(/(<|&#60;)/g, '&lt;');
    text = text.replace(/(>|&#62;)/g, '&gt;');

    // Support a subset of HTML tags, including bold, italic, and table tags.
    text = HtmlTooltipManager._restoreTag(text, 'b');
    text = HtmlTooltipManager._restoreTag(text, 'i');
    text = HtmlTooltipManager._restoreTag(text, 'table');
    text = HtmlTooltipManager._restoreTag(text, 'tr');
    text = HtmlTooltipManager._restoreTag(text, 'td');

    // Replace logical newlines sequences
    text = text.replace(/\n/g, '<br>');
    text = text.replace(/\\n/g, '<br>');
    text = text.replace(/&#92;n/g, '<br>');
    text = HtmlTooltipManager._restoreTag(text, 'br');

    // Create the tooltip element
    tooltipDOM = document.createElement('span');
    tooltipDOM.style.visibility = 'inherit';
    tooltipDOM.style.width = null;
    tooltipDOM.style.height = null;

    // Set the text
    tooltipDOM.innerHTML = text; //@HTMLUpdateOK
  } else if (canModify) tooltipDOM = text; // the text is an element or array of elements to be appended directly

  // Apply default class and border color on the outer element only if the user hasn't specified them ( + 21150376)
  if (!this._isCustomClassName) outerElem.className = popupClass;
  this._isCustomClassName = false;

  if (!borderColor) borderColor = HtmlTooltipManager._BORDER_COLOR;

  if (!this._isCustomBorderColor) {
    outerElem.style.borderColor = borderColor;
  }
  this._isCustomBorderColor = false;

  // Position the outer element
  outerElem.style.position = 'absolute';
  outerElem.style.zIndex = 2147483647;

  if (tooltipDOM != null) {
    // only add content if the elem has not already been populated
    if (Array.isArray(tooltipDOM)) {
      tooltipDOM.forEach(function (node) {
        outerElem.appendChild(node); //@HTMLUpdateOK
      });
    } else {
      outerElem.appendChild(tooltipDOM); //@HTMLUpdateOK
    }
  }

  this.PostElement(outerElem, x, y, true, useOffset);
};

/**
 * Performs a bunch of processing for an assembled tooltip or datatip.
 * @param {object} tooltip The outer DOM element of the tooltip.
 * @param {number} x The pageX coordinate at which to display the tooltip.
 * @param {number} y The pageY coordinate at which to display the tooltip.
 * @param {boolean} noEvents True if this tooltip should not recieve mouse events.
 * @param {boolean} useOffset True if this tooltip should be offset from the x and y coordinates.
 * @protected
 */
HtmlTooltipManager.prototype.PostElement = function (tooltip, x, y, noEvents, useOffset) {
  // Block mouse events if the tip is not interactive
  tooltip.style['pointer-events'] = noEvents ? 'none' : 'auto';

  // Clear the width and height, and reset the position to 0,0. This allows positionTip to get the accurate tooltip size
  tooltip.style.width = null;
  tooltip.style.height = null;
  tooltip.style.left = '0px';
  tooltip.style.top = '0px';

  // Add offsets to the tip position as needed
  if (useOffset) {
    var offsets = this._getOffsets(tooltip);
    this.positionTip(x + offsets.x, y + offsets.y, x, y);
  } else this.positionTip(x, y, x, y);

  // Make the tooltip visible
  tooltip.style.visibility = 'visible';

  // Invoke the tooltip attached callback if one is available.
  var callback = this._context.getTooltipAttachedCallback();
  if (callback) callback(tooltip);
};

/**
 * @override
 */
HtmlTooltipManager.prototype.hideTooltip = function () {
  this.clearTooltip();
  this._tooltipDisplayed = false;
  this._timerIsRunning = false;

  var tooltip = document.getElementById(this._domElementId);
  if (tooltip) {
    tooltip.style.visibility = 'hidden';
    tooltip.style.overflow = null;
    tooltip.style.width = '0px';
    tooltip.style.height = '0px';
    if (!Agent.isRightToLeft(this._context)) tooltip.style.left = '0px';
    else tooltip.style.left = tooltip.style.right;
    tooltip.style.top = '0px';

    // Use JQuery .remove() to cleanup DOM to prevent memory leaks
    // when using JET knockout templates
    if (typeof $ != 'undefined' && this._tooltipTemplateCleanup) {
      this._tooltipTemplateCleanup();
      this._tooltipTemplateCleanup = null;
      $(tooltip).children().remove();
    }
  }
};

/**
 * Removes tooltip divs shown by tooltip managers registered with the context
 */
HtmlTooltipManager.prototype.releaseTooltipResources = function () {
  var tooltip = document.getElementById(this._domElementId);
  if (tooltip) this._getTooltipContainer().removeChild(tooltip);
};

/**
 * Retrieves the outer DOM element of the tooltip.
 * @return {object}
 * @protected
 */
HtmlTooltipManager.prototype.getTooltipElem = function () {
  // Retrieve the tooltip element and create if it doesn't exist.
  var tooltip = document.getElementById(this._domElementId);
  if (!tooltip) tooltip = this.InitializeTooltipElem();

  return tooltip;
};

let tooltipContainer;

/**
 * Retrieves the outer DOM element of the tooltip.
 * @return {object}
 * @protected
 */
HtmlTooltipManager.prototype._getTooltipContainer = function () {
  if (tooltipContainer) {
    return tooltipContainer;
  } else {
    tooltipContainer = document.getElementById('_dvtTooltip_shared_container');
    if (!tooltipContainer) {
      var tooltipContainerDiv = document.createElement('div');
      tooltipContainerDiv.id = '_dvtTooltip_shared_container';
      document.body.appendChild(tooltipContainerDiv);
      tooltipContainer = tooltipContainerDiv;
    }
    return tooltipContainer;
  }
};

/**
 * Initializes the outer DOM element of the tooltip.
 * @return {object} The outer DOM element.
 * @protected
 */
HtmlTooltipManager.prototype.InitializeTooltipElem = function () {
  var tooltip = document.createElement('div');
  tooltip.id = this._domElementId;
  tooltip.style.visibility = 'hidden';
  // adding tooltip to a div container shared across dvts
  this._getTooltipContainer().appendChild(tooltip);
  this.InitContent(tooltip);
  return tooltip;
};

/**
 * TODO JSDoc
 * @param {string} tooltip
 * @protected
 */
HtmlTooltipManager.prototype.InitContent = function (tooltip) {};

/**
 * @override
 */
HtmlTooltipManager.prototype.showTooltip = function (x, y, text, shape, bTrackMouse, borderColor) {
  if (!text || text.length == 0) return;

  this._x = x;
  this._y = y;
  this._text = text;

  //TODO: trackMouse is not working!
  this._trackMouse = bTrackMouse;

  if (this._timerIsRunning) return;

  if (!borderColor) {
    borderColor = HtmlTooltipManager._BORDER_COLOR;
  }
  var outerElem = this.getTooltipElem();
  outerElem.style.borderColor = borderColor;

  if (Agent.isTouchDevice() || (this._tooltipDisplayed && this._trackMouse)) {
    this._displayTooltip(this._x, this._y, this._text, this._borderColor);
  } else {
    // Tooltips fade-in and remove themselves after a delay.
    this._timerIsRunning = true;
    // prettier-ignore
    this._showTimerId = window.setTimeout( // @HTMLUpdateOK
      this._handleShowTimer.bind(this),
      HtmlTooltipManager._SHOW_DELAY
    );
  }
};

/**
 * Clears the currently displayed tooltip.
 */
HtmlTooltipManager.prototype.clearTooltip = function () {
  if (this._showTimerId) {
    window.clearTimeout(this._showTimerId);

    this._showTimerId = undefined;
    this._x = undefined;
    this._y = undefined;
    this._text = undefined;

    this._trackMouse = undefined;
  }
  if (this._hideTimerId) {
    window.clearTimeout(this._hideTimerId);
    this._hideTimerId = undefined;
  }
};

/**
 * TODO JSDoc
 * @param {object} event
 * @private
 */
HtmlTooltipManager.prototype._handleShowTimer = function (event) {
  this._timerIsRunning = false;
  this._displayTooltip(this._x, this._y, this._text, this._borderColor);
  this._tooltipDisplayed = true;
};

/**
 * TODO JSDoc
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {string} borderColor
 * @private
 */
HtmlTooltipManager.prototype._displayTooltip = function (x, y, text, borderColor) {
  this._isTooltip = true;
  this._showTextAtPosition(x, y, text, borderColor, true, 'oj-dvt-tooltip');
};

/**
 * TODO JSDoc
 * TODO This should return dvt.Dimension, not Point
 * @param {string} tooltip
 * @private
 * @return {Point}
 */
HtmlTooltipManager.prototype._getOffsets = function (tooltip) {
  var tooltipBounds = this.getTooltipBounds(tooltip);
  if (Agent.isTouchDevice()) {
    return new Point(0 - tooltipBounds.w / 2, -30 - tooltipBounds.h);
  } else {
    var yOffset = -8 - tooltipBounds.h;
    var xOffset = 8;
    if (this._isTooltip) {
      yOffset = 22;
      xOffset = 0;
    }
    var bBidi = Agent.isRightToLeft(this._context);
    if (bBidi) {
      xOffset = -xOffset - tooltipBounds.w;
    }

    return new Point(xOffset, yOffset);
  }
};

/**
 * Returns an approximation of the tooltip bounds.
 * @return {Rectangle}
 */
HtmlTooltipManager.prototype.getTooltipBounds = function () {
  var tooltip = this.getTooltipElem();

  // Fix for 17898759: The offset height can be incorrect if the tooltip div inherits from the HTML body.  Set to auto
  // temporarily to prevent this.
  tooltip.style.height = 'auto';
  return new Rectangle(
    parseInt(tooltip.style.left),
    parseInt(tooltip.style.top),
    tooltip.offsetWidth,
    tooltip.offsetHeight
  );
};

/**
 * Positions the tip based on the mouse position in relation to the tooltip size.
 * @param {number} x The coordinate at which to display the tooltip with offsets.
 * @param {number} y The coordinate at which to display the tooltip with offsets.
 */
HtmlTooltipManager.prototype.positionTip = function (x, y) {
  var tooltip = this.getTooltipElem();
  var tooltipDimensions = this.getTooltipBounds();
  var tooltipWidth = tooltipDimensions.w;
  var tooltipHeight = tooltipDimensions.h;

  // Calculate the bounds of the browser viewport, within which we'll position the tooltip
  var viewportBounds = new Rectangle(
    window.pageXOffset + HtmlTooltipManager._VIEWPORT_BUFFER,
    window.pageYOffset + HtmlTooltipManager._VIEWPORT_BUFFER,
    window.innerWidth - 2 * HtmlTooltipManager._VIEWPORT_BUFFER,
    window.innerHeight - 2 * HtmlTooltipManager._VIEWPORT_BUFFER
  );

  if (tooltipWidth > viewportBounds.w - 2 * HtmlTooltipManager._VIEWPORT_BUFFER) {
    // Reset width
    tooltipWidth = viewportBounds.w - 2 * HtmlTooltipManager._VIEWPORT_BUFFER;
    tooltip.style.width = tooltipWidth + 'px';
  }

  // X Position
  var tooltipX = x;
  tooltipX = Math.max(tooltipX, viewportBounds.x); // Prevent left overflow
  tooltipX = Math.min(tooltipX, viewportBounds.x + viewportBounds.w - tooltipWidth); // Prevent right overflow

  // If page is scrolled, force a width on the tooltip so that it doesn't crunch at the edges. Workaround for browser issue.
  if (Math.abs(viewportBounds.x) > HtmlTooltipManager._VIEWPORT_BUFFER) {
    tooltip.style.width =
      Math.min(tooltip.clientWidth, viewportBounds.x + viewportBounds.w - tooltipX) + 'px';
    y += tooltipHeight - tooltip.offsetHeight; // update y location
    tooltipHeight = tooltip.offsetHeight; // update height
    tooltip.style.overflow = 'hidden';
  }

  // Y Position
  var tooltipY = y;
  tooltipY = Math.min(tooltipY, viewportBounds.y + viewportBounds.h - tooltipHeight); // Prevent bottom overflow
  tooltipY = Math.max(tooltipY, viewportBounds.y); // Prevent top overflow

  // Apply the calculated positions
  tooltip.style.left = tooltipX + 'px';
  tooltip.style.top = tooltipY + 'px';
};

/**
 * Returns a custom tooltip based on the tooltip function and the data context.
 * @param {function} tooltipFunc
 * @param {object} dataContext
 * @return {object} The custom tooltip, which is either a string or a DOM element.
 */
HtmlTooltipManager.prototype.getCustomTooltip = function (tooltipFunc, dataContext) {
  var tooltipElem = this.getTooltipElem();

  // Clearing out the previous tooltip content
  if (this._tooltipTemplateCleanup) {
    this._tooltipTemplateCleanup();
    this._tooltipTemplateCleanup = null;
  }
  while (tooltipElem.hasChildNodes()) tooltipElem.removeChild(tooltipElem.firstChild);

  dataContext['parentElement'] = tooltipElem;

  // reset class and border color each time so that we can tell if the user specifies custom ones ( + 21150376)
  tooltipElem.className = '';
  tooltipElem.style.borderColor = '';

  // Fix renderer context before calling the tooltip function
  dataContext = this._context.fixRendererContext(dataContext);
  var tooltip = tooltipFunc(dataContext);

  // if custom class or border color are specified, set flags so we don't override them with the default values
  if (tooltipElem.className) this._isCustomClassName = true;

  if (tooltipElem.style.borderColor) this._isCustomBorderColor = true;

  // Get a tooltip template cleanup from the dataContext after the renderer is  called on the JET side.
  this._tooltipTemplateCleanup = dataContext['_tooltipTemplateCleanup'];

  // If the tooltipElem has been populated by the app and a null returned, don't overwrite it.
  if (!tooltip && tooltipElem.hasChildNodes()) return true;

  return tooltip;
};

/**
 * Restores a supported HTML tag.
 * All HTML brackets are converted into &gt; and &lt; for security reasons, to prevent people from adding unsupported
 * elements. This method restores the brackets for the supported element only.
 * @param {string} text The HTML string.
 * @param {string} tag The tag name to be restored.
 * @return {string} The updated HTML string.
 * @private
 */
HtmlTooltipManager._restoreTag = function (text, tag) {
  // Match the following: <tag...>, </tag...>, and <tag.../>
  var regExp = new RegExp('&lt;(/?)(' + tag + ')(?=[\\s&/])([^&]*)(/?)&gt;', 'g');
  return text.replace(regExp, '<$1' + tag + '$3$4>');
};

/**
 * Creates an HTML element with the specified tag name.  Also applies optional style and text content.
 * @param {string} tag Tag name.
 * @param {dvt.CSSStyle=} style optional CSS style to be added as the inline style.
 * @param {number|string|Array<Node>=} content optional child content
 * @param {Array<string>=} classList optional CSS classes to be added as the element.
 * @return {Node} The HTML element.
 */
HtmlTooltipManager.createElement = function (tag, style, content, classList) {
  var element = document.createElement(tag); // @HTMLUpdateOK
  if (style) style.applyStylesToElement(element);
  if (classList) element.classList.add.apply(element.classList, classList);
  if (content != null) {
    if (Array.isArray(content)) {
      for (var i = 0; i < content.length; i++) {
        element.appendChild(content[i]);
      }
    } else element.appendChild(document.createTextNode(content));
  }
  return element;
};

/**
 *   Selection effect utilities.
 *   @class SelectionEffectUtils
 *   @constructor
 */
const SelectionEffectUtils = {};

Obj.createSubclass(SelectionEffectUtils, Obj);

/**
 * Get the border color to use for a selectable marker when the mouse hovers over it.
 * @param {String} color The color of the data marker.
 * @return String The resulting color.
 */
SelectionEffectUtils.getHoverBorderColor = function (color) {
  return ColorUtils.adjustHSL(color, 0, 0, 0.15);
};

/**
 * Create a stroke to use when the mouse hovers over a selectable marker.
 *
 * @param {String}  selColor  color of the data marker
 *
 * @type {Stroke}
 */
SelectionEffectUtils.createSelectingStroke = function (selColor) {
  // Set low miter limit to avoid bits sticking out at corners of 3D bars, for example
  return new Stroke(SelectionEffectUtils.getHoverBorderColor(selColor), 1, 2, false, null, {
    miterLimit: 1
  });
};

/**
 * Get the type of cursor to use when the mouse hovers over a selectable marker.
 * @return {string}
 */
SelectionEffectUtils.getSelectingCursor = function () {
  return 'pointer';
};

/**
 *  Abstract base class for shape displayables.
 *  @extends {Container}
 *  @class
 *  @constructor
 */
const Shape = function (context, type, id) {
  // This class should never be instantiated directly
  this.Init(context, type, id);
};

//  Allow shapes to become 'containers' themselves.  Note: this does not
//  provide a true parent/child relationship since this not available in SVG. TODO  reconsider this decision
Obj.createSubclass(Shape, Container);

/**
 * @override
 */
Shape.prototype.Init = function (context, type, id) {
  Shape.superclass.Init.call(this, context, type, id, true);

  // TODO : For all properties that default to null or false, remove from constructor
  this._bSelectable = false;
  this.IsSelected = false;
  this.InnerShape = null;
  this.HoverInnerStroke = null;
  this.HoverOuterStroke = null;
  this.SelectedInnerStroke = null;
  this.SelectedOuterStroke = null;
  this.SelectedHoverInnerStroke = null;
  this.SelectedHoverOuterStroke = null;
  this.OriginalStroke = null;
  this._isOriginalStrokeSet = false;
  this.IsShowingHoverEffect = false;
  this._feedbackClassName = null;
};

/**  Changes the shape to an outline shape format.  Used for legends
 *  markers that represent a hidden state for the associated series risers.
 *  @param {String} fc Border color for hollow shape in format of #aarrggbb
 *  @param {number} strokeWidth Stroke width used for shapes that were transofrmed (optional)
 */
Shape.prototype.setHollow = function (fc, strokeWidth) {
  if (!this._bHollow) {
    // Save original fill and stroke to restore
    this._origFill = this.GetProperty('fill');
    this._origStroke = this.getStroke();
    // Set hollow shape fill and stroke based on shape fill
    var hollowFill = SolidFill.invisibleFill();
    var hollowStroke;
    if (fc) {
      hollowStroke = new Stroke(ColorUtils.getRGB(fc), ColorUtils.getAlpha(fc), strokeWidth);
    } else {
      hollowStroke = new Stroke(
        this.GetProperty('fill').getColor(),
        this.GetProperty('fill').getAlpha(),
        strokeWidth
      );
    }
    this.setFill(hollowFill);
    this.setStroke(hollowStroke);
    this._bHollow = true;
  } else {
    this.setFill(this._origFill);
    this.setStroke(this._origStroke);
    this._bHollow = false;
  }
};

/**  Returns whether a shape is hollow.
 *  @return {boolean} True if the shape is hollow
 */
Shape.prototype.isHollow = function () {
  return this._bHollow;
};

/**
 *    Destroy the shape.  It should no longer be used or displayed
 */
Shape.prototype.destroy = function () {
  Shape.superclass.destroy.call(this);
  this.setFill(null);
  this.setStroke(null);
};

//:
/**
 * @override
 */
Shape.prototype.getDimensionsWithStroke = function () {
  //get the dims for this shape by itself
  var dims = this.GetElemDimensionsWithStroke();
  //get the dims for any children of this container
  var containerDims = Shape.superclass.getDimensionsWithStroke.call(this);
  //create union of shape and container dims
  if (dims && containerDims) {
    dims = dims.getUnion(containerDims);
  } else if (containerDims) {
    dims = containerDims;
  }

  return dims;
};

//:
Shape.prototype.GetDimensionsWithStroke = function (targetCoordinateSpace) {
  //get the dims for this shape by itself
  var dims = this.GetElemDimensionsWithStroke();
  if (!targetCoordinateSpace || targetCoordinateSpace === this) return dims;
  else {
    // Calculate the bounds relative to the target space
    return this.ConvertCoordSpaceRect(dims, targetCoordinateSpace);
  }
};

//:
Shape.prototype.GetElemDimensionsWithStroke = function () {
  //get the dims for this shape by itself
  var dims =
    this.getDimensionsSelf && this.getNumChildren() - this._getInnerShapeCount() == 0
      ? this.getDimensionsSelf()
      : Shape.superclass.getDimensions.call(this);

  //assume that stroke touches every edge of bounding box, so push out
  //every edge by half the stroke width
  var stroke = this.getStroke();
  if (dims && stroke) {
    var sw = stroke.getWidth();
    if (sw) {
      var halfSw = 0.5 * sw;
      dims.x -= halfSw;
      dims.y -= halfSw;
      dims.w += sw;
      dims.h += sw;
    }
  }
  return dims;
};

/**
 * Updates the geometries of the Shape used for the selection effects.
 * @protected
 */
Shape.prototype.UpdateSelectionEffect = function () {
  if (this.isSelected() || this.isHoverEffectShown()) {
    var stroke;
    if (this.InnerShape) {
      stroke = this.InnerShape.getStroke();
      this.removeChild(this.InnerShape);
    }
    this.InnerShape = this.copyShape();
    this.InnerShape._setOuterShape(this);
    this.InnerShape.setMouseEnabled(false);
    this.InnerShape.setFill(this.getFill());
    this.InnerShape.setStroke(stroke || this.getStroke());
    this.InnerShape.setStyle(this.getStyle()).setClassName(this.getClassName());
    if (this._feedbackClassName) {
      this.InnerShape.removeClassName('oj-dvt-default-border-width');
      this.InnerShape.removeClassName('oj-dvt-default-border-color');
      this.InnerShape.removeClassName(this._feedbackClassName);
      this.InnerShape.addClassName(`${this._feedbackClassName}-inner-shape`);
    }
    this.InnerShape.setMouseEnabled(false);
    this.InnerShape.setCursor(SelectionEffectUtils.getSelectingCursor());
    this.AddChildAt(this.InnerShape, 0);
  }
};

/**
 * Sets the outer shape of this shape
 * @param {Shape} shape The outer shape of this shape
 * @private
 */
Shape.prototype._setOuterShape = function (shape) {
  this._outerShape = shape;
};

/**
 * Get the inner shape stroke based on the hover/selection state of the shape
 * @return {Stroke} inner shape hover/selection stroke
 * @protected
 */
Shape.prototype.GetHoverSelectionInnerStroke = function () {
  var innerStroke;
  if (this.InnerShape) {
    if (this.isSelected()) {
      innerStroke = this.isHoverEffectShown()
        ? this.SelectedHoverInnerStroke
        : this.SelectedInnerStroke;
    } else if (this.isHoverEffectShown()) {
      innerStroke = this.HoverInnerStroke;
    }
  }
  return innerStroke;
};

/**
 * Get the outer shape stroke based on the hover/selection state of the shape
 * @return {Stroke} outer shape hover/selection stroke
 * @protected
 */
Shape.prototype.GetHoverSelectionOuterStroke = function () {
  var outerStroke;
  if (this._outerShape) {
    if (this._outerShape.isSelected()) {
      outerStroke = this._outerShape.isHoverEffectShown()
        ? this._outerShape.SelectedHoverOuterStroke
        : this._outerShape.SelectedOuterStroke;
    } else if (this._outerShape.isHoverEffectShown()) {
      outerStroke = this._outerShape.HoverOuterStroke;
    }
  }
  return outerStroke;
};

/**
 * Sets the hover inner and outer strokes for this shape.
 * If there is only one stroke color for this effect, only innerStroke needs to be set.
 * @param {Stroke} innerStroke The inner stroke color for this effect
 * @param {Stroke} outerStroke The outer stroke color for this effect
 * @return {Shape} To be used for chaining
 */
Shape.prototype.setHoverStroke = function (innerStroke, outerStroke) {
  this.HoverInnerStroke = innerStroke;
  this.HoverOuterStroke = outerStroke;
  return this;
};

/**
 * Sets the selected inner and outer strokes for this shape.
 * If there is only one stroke color for this effect, only innerStroke needs to be set.
 * @param {Stroke} innerStroke The inner stroke color for this effect
 * @param {Stroke} outerStroke The outer stroke color for this effect
 * @return {Shape} To be used for chaining
 */
Shape.prototype.setSelectedStroke = function (innerStroke, outerStroke) {
  this.SelectedInnerStroke = innerStroke;
  this.SelectedOuterStroke = outerStroke;
  return this;
};

/**
 * Sets the selected hover inner and outer stroke for this shape.
 * If there is only one stroke color for this effect, only innerStroke needs to be set.
 * If none are given, default will be to use the selected outer and hover inner strokes.
 * @param {Stroke} innerStroke The inner stroke color for this effect
 * @param {Stroke} outerStroke The outer stroke color for this effect
 * @return {Shape} To be used for chaining
 */
Shape.prototype.setSelectedHoverStroke = function (innerStroke, outerStroke) {
  this.SelectedHoverInnerStroke = innerStroke;
  this.SelectedHoverOuterStroke = outerStroke;
  return this;
};

/**
 * Implemented for DvtSelectable
 */
Shape.prototype.setSelectable = function (bSelectable) {
  this._bSelectable = bSelectable;
  if (this._bSelectable) this.setCursor(SelectionEffectUtils.getSelectingCursor());
  else this.setCursor(null);
};

/**
 * Implemented for DvtSelectable
 */
Shape.prototype.isSelectable = function () {
  return this._bSelectable;
};

/**
 * Implemented for DvtSelectable
 */
Shape.prototype.isSelected = function () {
  return this.IsSelected;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
Shape.prototype.setSelected = function (selected) {
  const OJ_SELECTED = 'oj-selected';
  if (this.IsSelected == selected) return;

  if (!this._isOriginalStrokeSet) {
    this._isOriginalStrokeSet = true;
    this.OriginalStroke = this.getStroke();
  }

  this.IsSelected = selected;

  if (this.isSelected()) {
    // on selection, set the outer border treatment on the Shape and the inner border treatment
    // on its copy which is placed in front of it with the same fill
    this.UpdateSelectionEffect();

    if (this._feedbackClassName) {
      this.addClassName(OJ_SELECTED);
      this.InnerShape.addClassName(OJ_SELECTED);
    } else if (this.isHoverEffectShown()) {
      this.CreateSelectedHoverStrokes();
      this.InnerShape.setStroke(this.SelectedHoverInnerStroke);
      this.setStroke(this.SelectedHoverOuterStroke);
    } else {
      this.InnerShape.setStroke(this.SelectedInnerStroke);
      this.setStroke(this.SelectedOuterStroke);
    }
  } else {
    if (this._feedbackClassName) {
      this.removeClassName(OJ_SELECTED);
      this.InnerShape.removeClassName(OJ_SELECTED);
    }
    if (this.IsShowingHoverEffect) {
      if (!this._feedbackClassName) {
        this.InnerShape.setStroke(this.HoverInnerStroke);
        this.setStroke(this.HoverOuterStroke);
      }
    } else {
      this.removeChild(this.InnerShape);
      this.setStroke(this.OriginalStroke);
    }
  }
};

/**
 * @param {string} className
 */
Shape.prototype.setFeedbackClassName = function (className) {
  this.addClassName(className);
  this._feedbackClassName = className;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
Shape.prototype.showHoverEffect = function () {
  if (this.IsShowingHoverEffect) return;

  this.IsShowingHoverEffect = true;

  if (!this._isOriginalStrokeSet) {
    this._isOriginalStrokeSet = true;
    this.OriginalStroke = this.getStroke();
  }

  this.UpdateSelectionEffect();

  if (this._feedbackClassName) {
    this.addClassName('oj-hover');
    this.InnerShape.addClassName('oj-hover');
  } else if (this.isSelected()) {
    this.CreateSelectedHoverStrokes();
    this.InnerShape.setStroke(this.SelectedHoverInnerStroke);
    this.setStroke(this.SelectedHoverOuterStroke);
  } else {
    this.InnerShape.setStroke(this.HoverInnerStroke);
    this.setStroke(this.HoverOuterStroke);
  }
};

/**
 * Initializes the selected hover strokes
 * @protected
 */
Shape.prototype.CreateSelectedHoverStrokes = function () {
  if (!this.SelectedHoverInnerStroke) this.SelectedHoverInnerStroke = this.HoverInnerStroke;
  if (!this.SelectedHoverOuterStroke) {
    this.SelectedHoverOuterStroke = new Stroke(
      this.SelectedOuterStroke.getColor(),
      this.SelectedOuterStroke.getAlpha(),
      this.SelectedOuterStroke.getWidth() +
        (this.HoverInnerStroke.getWidth() - this.SelectedInnerStroke.getWidth())
    );
  }
};

/**
 * Implemented for DvtSelectable
 */
Shape.prototype.hideHoverEffect = function () {
  if (!this.IsShowingHoverEffect) return;

  this.IsShowingHoverEffect = false;
  if (this._feedbackClassName) {
    this.removeClassName('oj-hover');
    this.InnerShape.removeClassName('oj-hover');
  }
  if (this.isSelected()) {
    if (!this._feedbackClassName) {
      this.InnerShape.setStroke(this.SelectedInnerStroke);
      this.setStroke(this.SelectedOuterStroke);
    }
  } else {
    this.removeChild(this.InnerShape);
    this.setStroke(this.OriginalStroke);
  }
};

/**
 * Determine if the selection hover effect is shown.
 * @type {boolean}
 */
Shape.prototype.isHoverEffectShown = function () {
  return this.IsShowingHoverEffect;
};

/**
 * Override Container's addChildAt to account for the selection shape
 * @override
 */
Shape.prototype.addChildAt = function (obj, idx) {
  Shape.superclass.addChildAt.call(this, obj, idx + this._getInnerShapeCount());
};

/**
 * Override Container's getChildAt to account for the selection shape
 * @override
 */
Shape.prototype.getChildAt = function (obj, idx) {
  return Shape.superclass.getChildAt.call(this, obj, idx + this._getInnerShapeCount());
};

/**
 * Override Container's getChildIndex to account for the selection shape
 * @override
 */
Shape.prototype.getChildIndex = function (obj) {
  return Shape.superclass.getChildIndex.call(this, obj) - this._getInnerShapeCount();
};

/**
 * Override Container's removeChildAt to account for the selection shape
 * @override
 */
Shape.prototype.removeChildAt = function (idx) {
  Shape.superclass.removeChildAt.call(this, idx + this._getInnerShapeCount());
};

/**
 * @override
 */
Shape.prototype.getDimensions = function (targetCoordinateSpace) {
  // Optimized implementation that allows container geometry to be taken into account to avoid costly DOM calls
  if (this.getDimensionsSelf && this.getNumChildren() - this._getInnerShapeCount() == 0)
    return this.getDimensionsSelf(targetCoordinateSpace);
  else return Shape.superclass.getDimensions.call(this, targetCoordinateSpace);
};

/**
 * Returns the number of inner shapes that are part of the child list.  This value should be used as an offset to find
 * the true child count.
 * @private
 */
Shape.prototype._getInnerShapeCount = function () {
  // TODO CLEANUP:  Technically we should override getNumChildren, but I'm nervous about changing this behavior.
  //               We'll end up fine once shapes can no longer be child containers.
  return this.isSelected() || this.isHoverEffectShown() ? 1 : 0;
};

/**
 * @override
 */
Shape.prototype.SvgPropertyChanged = function (name) {
  this.UpdateSelectionEffect();
};

/**
 * Makes and returns a copy of the shape with the same geometries. The original shape's fill, stroke, and id will not
 * be copied over.
 * @return {Shape} A copy of this shape with the same constructor arguments.
 */
Shape.prototype.copyShape = function () {
  // subclasses should implement
  return null;
};

/**
 * Utility functions for text.
 * @class
 */
const TextUtils = {};

Obj.createSubclass(TextUtils, Obj);

/** @private */
TextUtils._cachedTextWidth = {};
/** @private */
TextUtils._cachedRepTextDimensions = {};
/** @private */
TextUtils._canvasCtx = null;
/** @private */
TextUtils._wordSpacing;
/** @private */
TextUtils._letterSpacing;
/** @private */
TextUtils._fontVariantNumeric;
/** @const */
TextUtils.EMPTY_TEXT_BUFFER = 2;
/** @const */
TextUtils.ELLIPSIS = '\u2026';
/** @const */
TextUtils.REPRESENTATIVE_TEXT = 'MW';

/** @const */
TextUtils.V_ALIGN_TOP = 'top';
/** @const */
TextUtils.V_ALIGN_MIDDLE = 'middle';
/** @const */
TextUtils.V_ALIGN_CENTRAL = 'central';
/** @const */
TextUtils.V_ALIGN_BOTTOM = 'bottom';
/** @const */
TextUtils.V_ALIGN_AUTO = 'auto';

// To avoid circular dependencies, OutputText will push its constructor onto TextUtils
// so that TextUtils is able to construct a new instance for getting representative text
// dimensions
/** @private */
TextUtils._rep_text_constructor = null;

/**
 * Returns the maximum dimensions for the OutputText objects in the specified array.
 * @param {array} textArray An array of OutputText objects.
 * @return {Dimension}
 */
TextUtils.getMaxTextDimensions = function (textArray) {
  var maxWidth = 0;
  var maxHeight = 0;

  for (var i = 0; i < textArray.length; i++) {
    if (textArray[i] == null) continue;

    var dims = textArray[i].getDimensions();
    maxWidth = Math.max(maxWidth, dims.w);
    maxHeight = Math.max(maxHeight, dims.h);
  }

  return new Dimension(maxWidth, maxHeight);
};

/**
 * Returns the maximum width for the texts and styles in the specified arrays. It can take
 * an array of styles that corresponds with texts in textArray or a single style to be applied for allthe texts
 * @param {dvt.Context} context
 * @param {array} textStringArray An array of text strings.
 * @param {=CSSStyle|array} cssStyle Single style or array of styles to be used for the texts
 * @return {Number}
 */
TextUtils.getMaxTextStringWidth = function (context, textStringArray, cssStyle) {
  var maxWidth = 0;
  var isStyleArray = Array.isArray(cssStyle);

  for (var i = 0; i < textStringArray.length; i++) {
    if (textStringArray[i] == null || textStringArray[i].length == 0) continue;

    var style = !cssStyle ? null : isStyleArray ? cssStyle[i] : cssStyle;
    var textWidth = TextUtils.getTextStringWidth(context, textStringArray[i], style);

    if (textWidth > maxWidth) maxWidth = textWidth;
  }

  return maxWidth;
};

/**
 * Returns the text dimensions (width and height) given a textString and cssStyle. It looks up the the cache,
 * and creates a text elem only if the value is not found in the cache.
 * @param {dvt.Context} context
 * @param {string} textString
 * @param {CSSStyle} cssStyle
 * @return {Rectangle} The text dimensions.
 */
TextUtils.getTextStringDimensions = function (context, textString, cssStyle) {
  var cachedRepDimensions = TextUtils._getRepresentativeDimensions(context, cssStyle);
  return new Rectangle(
    0,
    cachedRepDimensions.y,
    TextUtils.getTextStringWidth(context, textString, cssStyle),
    cachedRepDimensions.h
  );
};

/**
 * Returns the text width given a textString and cssStyle.
 * @param {dvt.Context} context
 * @param {string} textString
 * @param {CSSStyle} cssStyle
 * @return {number} The text width.
 */
TextUtils.getTextStringWidth = function (context, textString, cssStyle) {
  if (textString == null || textString.length == 0) return 0;
  var letterSpacing = context.letterSpacing || 'normal';
  var wordSpacing = context.wordSpacing || 'normal';
  var fontVariantNumeric = context.fontVariantNumeric || 'normal';
  var cacheKey = TextUtils._createCacheKey(context, cssStyle, textString);
  var cachedDims = TextUtils._cachedTextWidth[cacheKey];

  if (cachedDims != null) return cachedDims;
  else {
    var width;
    var isLetterSpacingNormal = TextUtils._isNormalSpacing(letterSpacing);
    var isWordSpacingNormal = TextUtils._isNormalSpacing(wordSpacing);
    var isFontVariantNumericNormal = fontVariantNumeric === 'normal';
    if (isLetterSpacingNormal && isWordSpacingNormal && isFontVariantNumericNormal) {
      var spacingChanged =
        TextUtils._wordSpacing || TextUtils._letterSpacing || TextUtils._fontVariantNumeric;
      TextUtils._storeCanvasContext(spacingChanged);
      TextUtils._setSpacing(null, null, null);
      width = TextUtils._getCanvasTextWidth(context, textString, cssStyle);
    } else {
      // Properties that are supported in <canvas> elements by browser
      // Chrome and Safari supports only support fontVariantNumeric
      // Firefox supports none
      if (
        (Agent.browser === 'safari' || Agent.browser === 'chrome') &&
        isLetterSpacingNormal &&
        isWordSpacingNormal
      ) {
        if (TextUtils._fontVariantNumeric != fontVariantNumeric) {
          TextUtils._clearCanvasContext();
          TextUtils._setSpacing(wordSpacing, letterSpacing, fontVariantNumeric);
        }
        TextUtils._storeCanvasContext();
        TextUtils._attachCanvas(context);
        width = TextUtils._getCanvasTextWidth(context, textString, cssStyle);
      } else {
        var text = new TextUtils._rep_text_constructor(context, textString);
        text.setCSSStyle(cssStyle);
        // Add to the stage to obtain correct measurements
        var stage = text.getCtx().getStage();
        stage.addChild(text);
        width = text.GetSvgDimensions().w;
        stage.removeChild(text);
      }
    }
    TextUtils._cachedTextWidth[cacheKey] = width;
    return width;
  }
};
/**
 * Returns whether letter or word spacing is normal
 * @param {number} value The word or letter spacing value
 * @return {boolean} true if the spacing is normal
 * @private
 */
TextUtils._isNormalSpacing = function (value) {
  return value === 'normal' || value === '0px';
};

/**
 * Set the word and letter spacing and font variant numeric
 * @param {string} wordSpacing
 * @param {string} letterSpacing
 * @param {string} fontVariantNumeric
 * @private
 */
TextUtils._setSpacing = function (wordSpacing, letterSpacing, fontVariantNumeric) {
  TextUtils._wordSpacing = wordSpacing;
  TextUtils._letterSpacing = letterSpacing;
  TextUtils._fontVariantNumeric = fontVariantNumeric;
};

/**
 * Stores the canvas context to TextUtils._canvasCtx
 * @param {boolean} forceNew Force a new context from the canvas
 * @private
 */
TextUtils._storeCanvasContext = function (forceNew) {
  var canvas = TextUtils._canvasCtx ? TextUtils._canvasCtx.canvas : null;
  if (!canvas) {
    canvas = document.createElement('CANVAS');
    TextUtils._canvasCtx = canvas.getContext('2d');
  } else if (forceNew) {
    TextUtils._canvasCtx = TextUtils._canvasCtx.canvas.getContext('2d');
  }
};

/**
 * Clears the canvas context stashed reference
 * @private
 */
TextUtils._clearCanvasContext = function () {
  if (TextUtils._canvasCtx) {
    var canvas = TextUtils._canvasCtx.canvas;
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    TextUtils._canvasCtx = null;
  }
};

/**
 * Attaches the canvas to the element
 * @param {dvt.context} context
 * @private
 */
TextUtils._attachCanvas = function (context) {
  var canvas = TextUtils._canvasCtx.canvas;
  if (!canvas.parentNode) {
    canvas.style.display = 'none';
    context.getContainer().appendChild(canvas);
    TextUtils._canvasCtx = canvas.getContext('2d');
  }
};

/**
 * Returns the cache key
 * @param {dvt.Context} context
 * @param {CSSStyle} cssStyle
 * @param {string} textString
 * @return {string} the cache key
 * @private
 */
TextUtils._createCacheKey = function (context, cssStyle, textString) {
  var cssStyleKey = cssStyle != null ? cssStyle.hashCodeForTextMeasurement() : '';
  var text = textString ? textString : '';
  return (
    text + cssStyleKey + context.letterSpacing + context.wordSpacing + context.fontVariantNumeric
  );
};

/**
 * Returns the text height given a cssStyle.
 * @param {dvt.Context} context
 * @param {CSSStyle} cssStyle
 * @return {number} The text height.
 */
TextUtils.getTextStringHeight = function (context, cssStyle) {
  return TextUtils._getRepresentativeDimensions(context, cssStyle).h;
};

/**
 * Fits text in the provided space. It adds the text to the container, and removes it if the text cannot
 * fit at all in the container and noRemove is not true.
 * @param {OutputText|BackgroundOutputText|MultilineText|BackgroundMultilineText} text
 * @param {number} maxWidth The maximum width of the text
 * @param {number} maxHeight The maximum height of the text
 * @param {dvt.Container} container The parent of the text
 * @param {number=} minChars The minimum number of characters that should be displayed before ellipsis if
 *                            truncation occurs. If this argument is skipped, the default is 1 character.
 * @param {boolean=} noRemove Flag for whether or not text should be removed from parent if it does not fit.
 * @return {boolean} false if the text cannot fit at all, true otherwise.
 */
TextUtils.fitText = function (text, maxWidth, maxHeight, container, minChars, noRemove) {
  var untruncatedTextString = text.getTextString();

  // Initial checks for OutputText
  if (!text.hasBackground() && !text.isMultiline()) {
    var textDims = TextUtils.getTextStringDimensions(
      text.getCtx(),
      untruncatedTextString,
      text.getCSSStyle()
    );

    // Safe to quit if height doesn't fit.
    if (textDims.h > maxHeight) {
      // Remove from parent in this case to be consistent
      if (!noRemove) text.removeFromParent();
      return false;
    }

    // Truncation is not necessary if the width <= maxWidth.
    if (textDims.w <= maxWidth) {
      container.addChild(text);
      return true;
    }
  }

  // At this point, truncation may be needed.  Try to truncate the text.
  container.addChild(text);
  minChars = typeof minChars != 'number' || minChars == null ? 1 : minChars;

  if (text.isMultiline()) {
    // OutputText will manage removal from container and setting of untruncated text string
    return text.__fitText(maxWidth, maxHeight, minChars);
  } else if (!text.isMultiline()) {
    TextUtils._truncateOutputText(text, maxWidth, minChars);
  } else {
    // TODO: Should never get here?
    text.setMaxWidth(maxWidth, minChars);
    throw new Error('TextUtils.fitText called with a non-text class');
  }

  // Check if the truncated text can fit
  if (text.getTextString() == '') {
    if (!noRemove) container.removeChild(text);
    // Reset the original text
    text.setTextString(untruncatedTextString);
    return false;
  } else {
    if (text.getTextString() != untruncatedTextString)
      text.setUntruncatedTextString(untruncatedTextString);

    return true;
  }
};

/**
 * Centers text vertically adjusting for browser alignment differences
 * @param {object} text The text needed to be centered. Can be either OutputText or MultilineText.
 * @param {number} centerY The y axis midpoint of the bounds.
 */
TextUtils.centerTextVertically = function (text, centerY) {
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    text.setY(centerY);
    text.alignMiddle();
  } else text.setY(centerY - text.getDimensions().h / 2);
};

/**
 * Truncates the text instance to fit within the given width.  Sets the text string of the text to an empty string if
 * truncated text does not fit.
 * @param {OutputText} text The text instance to be truncated.
 * @param {number} maxWidth The maximum width of the text.
 * @param {number} minChars The minimum number of characters that should be displayed before ellipsis after truncation.
 * @private
 */
TextUtils._truncateOutputText = function (text, maxWidth, minChars) {
  if (maxWidth <= 0) {
    text.setTextString('');
    return;
  }

  // Initial check using accurate dimensions
  var dims = text.getDimensions();
  if (dims.w <= maxWidth) return;

  // Determine avg pixels per char and make an initial guess at the truncation
  var textString = text.getTextString();
  var textLength = textString.length;
  var avgPixelsPerChar = dims.w / TextUtils._getTextLength(textString);
  var maxNumChars = Math.max(Math.floor(maxWidth / avgPixelsPerChar) - 2, minChars); // Subtract 2 for the ellipsis

  // Determine whether we can use context to measure text.
  // If so, don't need to call getDimensions() at all, and only need to setTextString() at the very end.
  var truncatedTextString = textString.substring(0, maxNumChars) + TextUtils.ELLIPSIS;
  text.setTextString(truncatedTextString);
  dims = text.getDimensions();

  // Add characters if initial guess is too short.  Keep track of the previous string and dims in case we overshoot
  var prevTextString = truncatedTextString;
  var prevDims = dims;
  while (dims.w < maxWidth) {
    if (maxNumChars >= textString.length) break;

    // Calculate the availWidth and use that to estimate the number of characters to increment
    var availWidth = maxWidth - dims.w;

    // estimatedIncrement: The smaller of the chars remaining and the estimate of characters than can fit
    var estimatedIncrement = Math.min(
      textLength - maxNumChars,
      Math.max(Math.floor(availWidth / avgPixelsPerChar), 1)
    );

    // Add chars and measure again
    maxNumChars += estimatedIncrement;
    truncatedTextString = textString.substring(0, maxNumChars) + TextUtils.ELLIPSIS;
    text.setTextString(truncatedTextString);
    dims = text.getDimensions();

    // If we overshot and the increment was only 1, then restore the old string
    if (estimatedIncrement == 1 && dims.w > maxWidth) {
      text.setTextString(prevTextString);
      dims = prevDims;
      break;
    }

    // Otherwise update the previous string and dims
    prevTextString = truncatedTextString;
    prevDims = dims;
  }

  // Remove characters if initial guess is too long
  while (dims.w > maxWidth) {
    if (maxNumChars <= minChars) {
      // minChars doesn't fit, return ""
      text.setTextString('');
      break;
    }

    // Truncate 1 char at a time
    maxNumChars -= 1;
    truncatedTextString = textString.substring(0, maxNumChars) + TextUtils.ELLIPSIS;
    text.setTextString(truncatedTextString);
    dims = text.getDimensions();
  }
};

/**
 * Returns the number of characters in a text string after stripping off the zero-width characters.
 * @param {string} textString
 * @return {number} String length excluding the zero-width characters
 * @private
 */
TextUtils._getTextLength = function (textString) {
  textString = textString.replace(/[\u200A\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, '');
  return textString.length;
};

/**
 * Gets the dimensions of auto-aligned representative characters for the specified cssStyle.
 * @param {dvt.Context} context
 * @param {CSSStyle} cssStyle
 * @return {object} The representative dimensions
 * @private
 */
TextUtils._getRepresentativeDimensions = function (context, cssStyle) {
  // Check whether a cached size is already available
  var cssStyleKey = TextUtils._createCacheKey(context, cssStyle);
  var cachedDims = TextUtils._cachedRepTextDimensions[cssStyleKey];
  if (cachedDims == null) {
    var text = new TextUtils._rep_text_constructor(context, TextUtils.REPRESENTATIVE_TEXT);
    text.alignAuto();
    text.setCSSStyle(cssStyle);

    // Add to the stage to obtain correct measurements
    var stage = text.getCtx().getStage();
    stage.addChild(text);
    var dims = text.GetSvgDimensions();
    stage.removeChild(text);

    // Cache the dims of a single character. Conservative because real strings are not solely longest characters.
    cachedDims = { x: dims.x, y: dims.y, w: 0.5 * dims.w, h: dims.h };
    TextUtils._cachedRepTextDimensions[cssStyleKey] = cachedDims;
  }
  return cachedDims;
};

// Should only be called by OutputText to push a reference to its constructor
TextUtils.setRepresentativeTextConstructor = function (outputTextConstructor) {
  TextUtils._rep_text_constructor = outputTextConstructor;
};

/**
 * Gets the required baseline translation for the specified OutputText for environments that don't support dominant-baseline.
 * @param {OutputText} text
 * @return {number} The necessary baseline translation
 */
TextUtils.getBaselineTranslation = function (text) {
  var valign = text.getVertAlignment();
  if (valign != TextUtils.V_ALIGN_AUTO) {
    var cachedDims = TextUtils._getRepresentativeDimensions(text.getCtx(), text.getCSSStyle());
    if (valign == TextUtils.V_ALIGN_TOP) {
      return -cachedDims.y;
    } else if (valign == TextUtils.V_ALIGN_MIDDLE) {
      return -cachedDims.y - cachedDims.h / 2;
    } else if (valign == TextUtils.V_ALIGN_CENTRAL) {
      return -cachedDims.y / 2;
    } else if (valign == TextUtils.V_ALIGN_BOTTOM) {
      return -cachedDims.y - cachedDims.h;
    }
  }
  return 0;
};

/**
 * Returns the text width using canvas measurements.
 * @param {dvt.Context} context
 * @param {string} text
 * @param {CSSStyle} cssStyle
 * @return {number} the text width
 * @private
 */
TextUtils._getCanvasTextWidth = function (context, text, cssStyle) {
  var fontStyle = (cssStyle ? cssStyle.getStyle('font-style') : null) || 'normal';
  var fontVariant = (cssStyle ? cssStyle.getStyle('font-variant') : null) || 'normal';
  var fontWeight = (cssStyle ? cssStyle.getStyle('font-weight') : null) || 'normal';
  var fontFamily =
    (cssStyle ? cssStyle.getStyle('font-family') : null) || context.getDefaultFontFamily() || '';
  var fontSize =
    (cssStyle ? cssStyle.getFontSize() : null) || context.getDefaultFontSize() || '12px';

  // include 'px' if fontSize is just a number
  if (!isNaN(fontSize)) fontSize += 'px';

  var font = fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily;
  TextUtils._configureCanvas(context, font);
  return TextUtils._canvasCtx.measureText(text).width;
};

/**
 * Configures the canvas for text measurements.
 * @param {dvt.Context} context
 * @param {string} font
 * @private
 */
TextUtils._configureCanvas = function (context, font) {
  // IE and Edge canvases have issues processing '-apple-system' fonts.
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    font = font.replace(/-apple-system(-\w+)*,?/g, '');

    // Also, it's relative font units only work if canvas is attached to DOM
    TextUtils._attachCanvas(context);
  }

  TextUtils._canvasCtx.font = font;
};

/**
 * Clears the caches used by TextUtils
 */
TextUtils.clearCaches = function () {
  TextUtils._cachedTextWidth = {};
  TextUtils._cachedRepTextDimensions = {};
};

/**
 * Calculate the optimal text size based on the bounds provided.
 * @param {dvt.Context} context
 * @param {string} textString
 * @param {CSSStyle} cssStyle
 * @param {Rectangle} bounds The bounds to fit the label
 * @return {string} the optimal font size with the unit 'px'
 */
TextUtils.getOptimalFontSize = function (context, textString, cssStyle, bounds) {
  cssStyle = cssStyle ? cssStyle.clone() : new CSSStyle();
  // Round the initial guess so that we're more likely to get cache hits on subsequent calls
  for (
    var i = Math.max(Math.round(Math.min(bounds.w / textString.length, bounds.h / 2)), 9);
    i < 51;
    i += 1
  ) {
    cssStyle.setFontSize('font-size', i + 'px', context);
    var textDim = TextUtils.getTextStringDimensions(context, textString, cssStyle);
    if (textDim.w > bounds.w || textDim.h > bounds.h) return Math.min(i - 1, 50) + 'px';
  }
  return '50px';
};

/**
 * Creates an instance of OutputText.
 * @extends {Shape}
 * @class OutputText
 * @constructor
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {string} id
 */
const OutputText = function (context, textStr, x, y, id) {
  this.Init(context, textStr, x, y, id);
};

// Push a reference onto TextUtils so that OutputText can be used to calculate
// representative text dimensions
TextUtils.setRepresentativeTextConstructor(OutputText);

Obj.createSubclass(OutputText, Shape);

/** @const */
OutputText.ELLIPSIS = TextUtils.ELLIPSIS;
/** @const */
OutputText.REPRESENTATIVE_TEXT = TextUtils.REPRESENTATIVE_TEXT;
/** @const */
OutputText.BIDI_ZERO_WIDTH = '\u200B';

// Horizontal Alignments
/** @const */
OutputText.H_ALIGN_LEFT = 'left';
/** @const */
OutputText.H_ALIGN_CENTER = 'center';
/** @const */
OutputText.H_ALIGN_RIGHT = 'right';

OutputText.TEXT_ANCHOR = 'text-anchor';

// Vertical Alignments
/** @const */
OutputText.V_ALIGN_TOP = TextUtils.V_ALIGN_TOP;
/** @const */
OutputText.V_ALIGN_MIDDLE = TextUtils.V_ALIGN_MIDDLE;
/** @const */
OutputText.V_ALIGN_CENTRAL = TextUtils.V_ALIGN_CENTRAL;
/** @const */
OutputText.V_ALIGN_BOTTOM = TextUtils.V_ALIGN_BOTTOM;
/** @const */
OutputText.V_ALIGN_AUTO = TextUtils.V_ALIGN_AUTO;

/**
 * @param {dvt.Context} context
 * @param {string} textStr the text string
 * @param {number} x
 * @param {number} y
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
OutputText.prototype.Init = function (context, textStr, x, y, id) {
  OutputText.superclass.Init.call(this, context, 'text', id);

  // Attribute for IE alignment. This stores the component x position of the text.
  // In IE, only align start works properly for mixed LTR and RTL text, so we have to use align start and adjust
  // the x position in the DOM according to the alignment.
  this._x = x != null ? x : 0;

  // - NODE RENDERED INCORRECTLY IN IE9+
  this._baseline = false;

  // Fix for 14297988: BIDI and mixed text in IE
  if (Agent.isRightToLeft(context) && (Agent.browser === 'ie' || Agent.browser === 'edge')) {
    ToolkitUtils.setAttrNullNS(this.getElem(), 'unicode-bidi', 'embed');
  }

  // Initialize the alignment attrs.  Our impl defaults to start and baseline, so set the alignment if the defaults
  // don't match the impl defaults.
  this.alignLeft();
  this.alignTop();

  this.setTextString(textStr);
  this.setX(x);
  this.setY(y);

  // TODO : Remove this workaround and the incorrect none default in DvtSvgShape.
  // Workaround to remove some strange defaulting for the fill, which is set to none in DvtSvgShape.Init.
  ToolkitUtils.removeAttrNullNS(this.getElem(), 'fill');

  // By default, hide text from VoiceOver
  this.setAriaProperty('hidden', 'true');
};

/**
 * Returns the text string for this text object.
 * @return {string} the text string
 */
OutputText.prototype.getTextString = function () {
  return this._textString;
};

/**
 * Specifies the text string for this text object.
 * @param {string} textString the text string
 * @return {OutputText}
 */
OutputText.prototype.setTextString = function (textString) {
  // Trim because leading/trailing spaces are ignored by the browser, but they complicate text measurement.
  textString = textString != null ? String(textString).trim() : '';

  // Add zero-width char to force correct alignment in RTL for IE.
  if (
    this._needsTextAnchorAdjustment() &&
    (Agent.browser === 'ie' || Agent.browser === 'edge') &&
    textString.charAt(0) != OutputText.BIDI_ZERO_WIDTH
  )
    textString = OutputText.BIDI_ZERO_WIDTH + textString;

  this._textString = textString;

  // Update the text node if it is already created
  var textNode = this.getElem().firstChild;
  if (textNode !== null) {
    textNode.nodeValue = textString;
  } else {
    // Otherwise create it
    textNode = document.createTextNode(textString);
    ToolkitUtils.appendChildElem(this.getElem(), textNode);
  }

  if (Agent.browser === 'ie' || Agent.browser === 'edge') this.setX(this._x); // readjust x position. IE text-anchor attribute is buggy.

  return this;
};

/**
 * Returns true if this text instance has been truncated.  When truncated, the getUntruncatedTextString function can be
 * used to find the full text String.
 * @return {boolean}
 */
OutputText.prototype.isTruncated = function () {
  return this.getUntruncatedTextString() != null;
};

/**
 * Returns the untruncated text string for this text object.  Returns null if the text string has not been truncated.
 * @return {string} the untruncated text string
 */
OutputText.prototype.getUntruncatedTextString = function () {
  return this._untruncatedTextString;
};

/**
 * Specifies the untruncated text string for this text object. This should only be set if the OutputText was
 * truncated by TextUtils.
 * @param {string} textString the untruncated text string
 */
OutputText.prototype.setUntruncatedTextString = function (textString) {
  if (textString != this.getTextString()) this._untruncatedTextString = textString;
};

/**
 * Returns the x position for this text object.
 * @return {number} The x position.
 */
OutputText.prototype.getX = function () {
  var x;
  if (Agent.browser === 'ie' || Agent.browser === 'edge') x = this._x;
  // return the component x
  else x = this.GetProperty('x');
  return x ? x : 0;
};

/**
 * Specifies the x position for this text object.
 * @param {number} x The x position
 * @return {OutputText}
 */
OutputText.prototype.setX = function (x) {
  this._x = x != null ? x : 0;
  if (Agent.browser === 'ie' || Agent.browser === 'edge')
    return this.SetSvgProperty('x', this._x + this._getIEAlignmentOffset(), 0);
  else return this.SetSvgProperty('x', x, 0);
};

/**
 * Computes the x alignment offset for IE. The text-anchor attribute is buggy in IE, and only works correctly
 * if set to "start". Thus, for all other horizontal alignments, we use the "start" text-anchor and shift the
 * x position of the text in the DOM.
 * @return {number}
 * @private
 */
OutputText.prototype._getIEAlignmentOffset = function () {
  var align = this.getHorizAlignment();
  var isRTL = Agent.isRightToLeft(this.getCtx());

  if (align == OutputText.H_ALIGN_LEFT)
    return isRTL
      ? TextUtils.getTextStringWidth(this.getCtx(), this.getTextString(), this.getCSSStyle())
      : 0;
  else if (align == OutputText.H_ALIGN_CENTER)
    return isRTL
      ? TextUtils.getTextStringWidth(this.getCtx(), this.getTextString(), this.getCSSStyle()) / 2
      : -1 *
          (TextUtils.getTextStringWidth(this.getCtx(), this.getTextString(), this.getCSSStyle()) /
            2);
  else if (align == OutputText.H_ALIGN_RIGHT)
    return isRTL
      ? 0
      : -1 * TextUtils.getTextStringWidth(this.getCtx(), this.getTextString(), this.getCSSStyle());
  return 0;
};

/**
 * Returns the y position for this text object.
 * @return {number} The y position.
 */
OutputText.prototype.getY = function () {
  var y = this.GetProperty('y');
  return y ? y : 0;
};

/**
 * Specifies the y position for this text object.
 * @param {number} y The y position
 * @return {OutputText}
 */
OutputText.prototype.setY = function (y) {
  return this.SetSvgProperty('y', y, 0);
};

/**
 * Convenience function for specifying the font size. This function will clone the CSSStyle and apply it to the component.
 * @param {string|number} size The font-size which can be in the format 9, '9', '9px', or 'xx-small'
 */
OutputText.prototype.setFontSize = function (size) {
  var style = this.getCSSStyle();
  style = style ? style.clone() : new CSSStyle();
  style.setFontSize(CSSStyle.FONT_SIZE, String(size), this.getCtx());
  this.setCSSStyle(style);
};

/**
 * Returns the horizontal alignment for this text object.  Valid constants begin with OutputText.H_ALIGN_.
 * @return {string}
 */
OutputText.prototype.getHorizAlignment = function () {
  return this._horizAlign;
};

/**
 * Specifies the horizontal alignment for this text object.  Valid constants begin with OutputText.H_ALIGN_.
 * @param {string} align
 */
OutputText.prototype.setHorizAlignment = function (align) {
  if (align == OutputText.H_ALIGN_LEFT) this.alignLeft();
  else if (align == OutputText.H_ALIGN_CENTER) this.alignCenter();
  else if (align == OutputText.H_ALIGN_RIGHT) this.alignRight();
};

/**
 * Returns the vertical alignment for this text object.  Valid constants begin with OutputText.V_ALIGN_.
 * @return {string} The horizontal alignment
 */
OutputText.prototype.getVertAlignment = function () {
  return this._vertAlign;
};

/**
 * Specifies the vertical alignment for this text object.  Valid constants begin with OutputText.V_ALIGN_.
 * @param {string} align
 */
OutputText.prototype.setVertAlignment = function (align) {
  if (align == OutputText.V_ALIGN_TOP) this.alignTop();
  else if (align == OutputText.V_ALIGN_MIDDLE) this.alignMiddle();
  else if (align == OutputText.V_ALIGN_CENTRAL) this.alignCentral();
  else if (align == OutputText.V_ALIGN_BOTTOM) this.alignBottom();
  else if (align == OutputText.V_ALIGN_AUTO) this.alignAuto();
};

/**
 * Aligns the left side of the text to the x coordinate. Note: This does not always correspond to what the browser
 * considers a "start" alignment, as we work around issues in rtl locales to provide a consistent API.
 */

OutputText.prototype.alignLeft = function () {
  // No change in value, return
  if (this._horizAlign == OutputText.H_ALIGN_LEFT) return;

  this._horizAlign = OutputText.H_ALIGN_LEFT;

  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    this.setX(this._x); // readjust x position. IE text-anchor attribute is buggy.
  } else {
    // : When html dir="rtl", Webkit and FF25+ treat the right side of the text as the start, and the left
    // side of the text as end.  Our API always treats the left side as start, so we need to adjust based on agent.
    var bAdjust = this._needsTextAnchorAdjustment();
    ToolkitUtils.setAttrNullNS(
      this.getElem(),
      OutputText.TEXT_ANCHOR,
      bAdjust ? 'end' : 'start',
      'start'
    );
  }
};

/**
 * Aligns the center of the text to the x coordinate.
 */
OutputText.prototype.alignCenter = function () {
  // No change in value, return
  if (this._horizAlign == OutputText.H_ALIGN_CENTER) return;

  this._horizAlign = OutputText.H_ALIGN_CENTER;

  if (Agent.browser === 'ie' || Agent.browser === 'edge') this.setX(this._x);
  // readjust x position. IE text-anchor attribute is buggy.
  else ToolkitUtils.setAttrNullNS(this.getElem(), OutputText.TEXT_ANCHOR, 'middle', 'start');
};

/**
 * Aligns the right side of the text to the x coordinate. Note: This does not always correspond to what the browser
 * considers an "end" alignment, as we work around issues in rtl locales to provide a consistent API.
 */
OutputText.prototype.alignRight = function () {
  // No change in value, return
  if (this._horizAlign == OutputText.H_ALIGN_RIGHT) return;

  this._horizAlign = OutputText.H_ALIGN_RIGHT;

  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    this.setX(this._x); // readjust x position. IE text-anchor attribute is buggy.
  } else {
    // : When html dir="rtl", Webkit and FF25+ treat the right side of the text as the start, and the left
    // side of the text as end.  Our API always treats the left side as start, so we need to adjust based on agent.
    var bAdjust = this._needsTextAnchorAdjustment();
    ToolkitUtils.setAttrNullNS(
      this.getElem(),
      OutputText.TEXT_ANCHOR,
      bAdjust ? 'start' : 'end',
      'start'
    );
  }
};

/**
 * Aligns the top of the text to the y coordinate.
 */
OutputText.prototype.alignTop = function () {
  // No change in value, return
  if (this._vertAlign == OutputText.V_ALIGN_TOP) return;
  else if (this._vertAlign == OutputText.V_ALIGN_BOTTOM && Agent.browser === 'safari')
    this._setBaseline(false);

  this._vertAlign = OutputText.V_ALIGN_TOP;

  // - NODE RENDERED INCORRECTLY IN IE9+
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    this._setBaseline(true);
  } else this.SetDominantBaselineAttr('text-before-edge');
};

/**
 * Aligns the middle of the text to the y coordinate.
 */
OutputText.prototype.alignMiddle = function () {
  // No change in value, return
  if (this._vertAlign == OutputText.V_ALIGN_MIDDLE) return;
  else if (this._vertAlign == OutputText.V_ALIGN_BOTTOM && Agent.browser === 'safari')
    this._setBaseline(false);

  this._vertAlign = OutputText.V_ALIGN_MIDDLE;

  // - NODE RENDERED INCORRECTLY IN IE9+
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    this._setBaseline(true);
  } else this.SetDominantBaselineAttr('middle');
};

/**
 * Aligns the center of the text (above the baseline) to the y coordinate.
 */
OutputText.prototype.alignCentral = function () {
  // No change in value, return
  if (this._vertAlign == OutputText.V_ALIGN_CENTRAL) return;
  else if (this._vertAlign == OutputText.V_ALIGN_BOTTOM && Agent.browser === 'safari')
    this._setBaseline(false);

  this._vertAlign = OutputText.V_ALIGN_CENTRAL;

  // - NODE RENDERED INCORRECTLY IN IE9+
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    this._setBaseline(true);
  } else this.SetDominantBaselineAttr('central');
};

/**
 * Aligns the bottom of the text to the y coordinate.
 */
OutputText.prototype.alignBottom = function () {
  // No change in value, return
  if (this._vertAlign == OutputText.V_ALIGN_BOTTOM) return;

  this._vertAlign = OutputText.V_ALIGN_BOTTOM;

  // - NODE RENDERED INCORRECTLY IN IE9+
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    this._setBaseline(true);
  } else if (Agent.browser === 'safari') {
    // : Safari bottom text alignment is broken and produces middle alignment instead.
    this._setBaseline(true);
    this.SetDominantBaselineAttr(null);
  } else this.SetDominantBaselineAttr('text-after-edge');
};

/**
 * Aligns the bottom of the text based on default browser settings
 */
OutputText.prototype.alignAuto = function () {
  // No change in value, return
  if (this._vertAlign == OutputText.V_ALIGN_AUTO) return;
  else if (this._vertAlign == OutputText.V_ALIGN_BOTTOM && Agent.browser === 'safari')
    this._setBaseline(false);

  this._vertAlign = OutputText.V_ALIGN_AUTO;

  if (Agent.browser === 'ie' || Agent.browser === 'edge') this._setBaseline(false);
  else this.SetDominantBaselineAttr(null);
};

/**
 * Specifies whether baseline should be manually adjusted and triggers an adjustment.
 * @param {boolean} baseline
 * @private
 */
OutputText.prototype._setBaseline = function (baseline) {
  this._baseline = baseline;
  this.setMatrix(this.getMatrix());
};

/**
 * Set the dominant baseline for vertical alignment.
 * @param {string} baseline The value of the dominant-baseline attribute
 * @protected
 */
OutputText.prototype.SetDominantBaselineAttr = function (baseline) {
  if (baseline) ToolkitUtils.setAttrNullNS(this.getElem(), 'dominant-baseline', baseline);
  else ToolkitUtils.removeAttrNullNS(this.getElem(), 'dominant-baseline');
};

/**
 * Sets the CSSStyle of this object.
 * @param {CSSStyle} style The CSSStyle of this object.
 */
OutputText.prototype.setCSSStyle = function (style) {
  OutputText.superclass.setCSSStyle.call(this, style);
  var elem = this.getOuterElem();

  if (style) {
    //NOTE: svg does not recognize css "color" attribute, use "fill" instead
    var val = style.getStyle('color');
    var fillObj = ColorUtils.fixColorForPlatform(val);
    if (fillObj && fillObj['color']) {
      ToolkitUtils.setAttrNullNS(elem, 'fill', fillObj['color']);
      if (fillObj['alpha'] != null)
        ToolkitUtils.setAttrNullNS(elem, 'fill-opacity', fillObj['alpha'], 1);
    }

    const FONT_FAMILY = 'font-family';
    val = style.getStyle(FONT_FAMILY);
    if (val && !this.getCtx().isDefaultFontFamily(val))
      ToolkitUtils.setAttrNullNS(elem, FONT_FAMILY, val);
    else ToolkitUtils.removeAttrNullNS(elem, FONT_FAMILY);

    val = style.getStyle('font-size');
    if (val && val != this.getCtx().getDefaultFontSize()) {
      ToolkitUtils.setAttrNullNS(elem, 'font-size', val);

      // - NODE RENDERED INCORRECTLY IN IE9+
      if (Agent.browser === 'ie' || Agent.browser === 'edge' || Agent.browser === 'safari') {
        this.setMatrix(this.getMatrix());
      }
    } else ToolkitUtils.removeAttrNullNS(elem, 'font-size');

    val = style.getStyle('font-style');
    if (val) {
      ToolkitUtils.setAttrNullNS(elem, 'font-style', val);
    }

    const FONT_WEIGHT = 'font-weight';
    val = style.getStyle(FONT_WEIGHT);
    if (val && val != this.getCtx().getDefaultFontWeight())
      ToolkitUtils.setAttrNullNS(elem, FONT_WEIGHT, val);
    else ToolkitUtils.removeAttrNullNS(elem, FONT_WEIGHT);

    //NOTE: svg does not recognize css "text-align" attribute,
    //call alignCenter, alignLeft, alignRight... if needed.
    //For multi line text, text-align is handled in DvtOutputTextArea
    val = style.getStyle('text-decoration');
    if (val) {
      ToolkitUtils.setAttrNullNS(elem, 'text-decoration', val);
    }

    val = style.getStyle('cursor');
    if (val) {
      ToolkitUtils.setAttrNullNS(elem, 'cursor', val);
    }

    if (Agent.browser === 'ie' || Agent.browser === 'edge') this.setX(this._x); // readjust x position. IE text-anchor attribute is buggy.
  }
};

// - NODE RENDERED INCORRECTLY IN IE9+
/**
 * Returns the y translation used to compensate for IE's lack of dominant-baseline support
 * @return {number} the y translation
 * @private
 */
OutputText.prototype._getBaselineTranslation = function () {
  //if not in IE, no adjustment required
  if (this._baseline) {
    // Use text height for baseline translation if not representative text, else use font-size
    if (this._textString && !this._isRepresentativeText())
      return TextUtils.getBaselineTranslation(this);
    else {
      var valign = this.getVertAlignment();
      if (valign != OutputText.V_ALIGN_AUTO) {
        var size = ToolkitUtils.getAttrNullNS(this.getElem(), 'font-size');
        if (!size) size = ToolkitUtils.getAttrNullNS(this.getOuterElem(), 'font-size');
        if (!size || (isNaN(size) && size.indexOf('px') == -1))
          size = this.getCtx().getDefaultFontSize();
        size = parseFloat(size);

        if (valign == OutputText.V_ALIGN_TOP) {
          return 0.8 * size;
        } else if (valign == OutputText.V_ALIGN_MIDDLE) {
          return 0.3 * size;
        } else if (valign == OutputText.V_ALIGN_CENTRAL) {
          return 0.4 * size;
        } else if (valign == OutputText.V_ALIGN_BOTTOM) {
          return -0.2 * size;
        }
      }
    }
  }
  return 0;
};

/**
 * Returns the specified matrix adjusted by the baseline (if any)
 * @param {Matrix} mat the matrix to adjust
 * @return {Matrix} the adjusted matrix
 * @private
 */
OutputText.prototype._getBaselineAdjustedMatrix = function (mat) {
  if (this._baseline) {
    // this._baseline is only set for IE
    if (!mat) {
      mat = new Matrix();
    }
    var nmat = new Matrix(null, null, null, null, null, this._getBaselineTranslation());
    mat = nmat.concat(mat);
  }
  return mat;
};

/**
 *  @override
 */
OutputText.prototype.setMatrix = function (mat) {
  if (Agent.browser === 'ie' || Agent.browser === 'edge' || Agent.browser === 'safari') {
    this._matrixForIE = mat;
    mat = this._getBaselineAdjustedMatrix(mat);
  }
  OutputText.superclass.setMatrix.call(this, mat);
};

/**
 *  @override
 */
OutputText.prototype.getMatrix = function () {
  var matrix = null;
  if (Agent.browser === 'ie' || Agent.browser === 'edge' || Agent.browser === 'safari') {
    matrix = this._matrixForIE;
  }
  if (!matrix) {
    matrix = OutputText.superclass.getMatrix.call(this);
  }
  return matrix;
};

/**
 * Checks if this textString is the representative text or the BIDI zero width character so that we only cache the size the first time.
 * @private
 * @return {boolean} is this a representative text
 */
OutputText.prototype._isRepresentativeText = function () {
  return (
    this._textString == OutputText.REPRESENTATIVE_TEXT ||
    this._textString == OutputText.BIDI_ZERO_WIDTH ||
    this._textString == OutputText.BIDI_ZERO_WIDTH + OutputText.REPRESENTATIVE_TEXT
  );
};

/**
 * @override
 */
OutputText.prototype.GetSvgDimensions = function () {
  // TODO  target coord space would be broken here
  var bbox = OutputText.superclass.GetSvgDimensions.call(this);

  //  - NODE RENDERED INCORRECTLY IN IE9+
  if (bbox) {
    bbox.y += this._getBaselineTranslation();

    //  - Japanese group label doesn't display in IE11
    if (!this._isRepresentativeText())
      bbox.h = TextUtils.getTextStringHeight(this.getCtx(), this.getCSSStyle());
  }

  return bbox;
};

/**
 * @override
 */
OutputText.prototype.UpdateSelectionEffect = function () {
  // noop: Does not participate in selection effects
};

/**
 * @override
 */
OutputText.prototype.getDimensions = function (targetCoordinateSpace) {
  var hAlign = this.getHorizAlignment();
  var vAlign = this.getVertAlignment();

  var localDims = TextUtils.getTextStringDimensions(
    this.getCtx(),
    this.getTextString(),
    this.getCSSStyle()
  );
  localDims.x = this.getX();

  // Adjust dimensions for text alignment.  We do this because we don't take alignment into account in the cache, and
  // also because browsers return inconsistently calculated dimensions based on alignment.
  if (hAlign === OutputText.H_ALIGN_RIGHT) localDims.x -= localDims.w;
  else if (hAlign === OutputText.H_ALIGN_CENTER) localDims.x -= localDims.w / 2;

  if (vAlign === OutputText.V_ALIGN_TOP) localDims.y = this.getY();
  else if (vAlign === OutputText.V_ALIGN_BOTTOM) localDims.y = this.getY() - localDims.h;
  else if (vAlign === OutputText.V_ALIGN_MIDDLE) localDims.y = this.getY() - localDims.h / 2;
  else if (vAlign === OutputText.V_ALIGN_CENTRAL) localDims.y = this.getY() - localDims.h * 0.4;
  else if (vAlign === OutputText.V_ALIGN_AUTO) localDims.y += this.getY();

  // Transform to the target coord space and return
  return !targetCoordinateSpace || targetCoordinateSpace === this
    ? localDims
    : this.ConvertCoordSpaceRect(localDims, targetCoordinateSpace);
};

/**
 * @override
 */
OutputText.prototype.copyShape = function () {
  var ret = new OutputText(this.getCtx(), this.getTextString(), this.getX(), this.getY());
  ret.setCSSStyle(this.getCSSStyle());
  ret.setHorizAlignment(this.getHorizAlignment());
  ret.setVertAlignment(this.getVertAlignment());
  return ret;
};

/**
 * Returns true if the text anchor needs to be flipped from "start" to "end" and vice versa.
 * @private
 * @return {boolean}
 */
OutputText.prototype._needsTextAnchorAdjustment = function () {
  // : When html dir="rtl", theright side of the text is treated as the start, and the left as the end. Our
  // API always treats the left side as start, so we need to adjust based on agent.
  return Agent.isRightToLeft(this.getCtx());
};

/**
 * @param {dvt.Context} ctx
 * @param {object} iconOptions supports keys style, size, pos
 */
OutputText.createIcon = (function () {
  // cache in closure scope
  var baselineCache = {};
  function getBaseline(ctx, size, character) {
    if (!baselineCache[size]) {
      var icon = new OutputText(ctx, character);
      icon.setClassName('oj-fwk-icon oj-dvt-icon');
      icon.getElem().style.fontSize = size + 'px';
      icon.alignAuto();

      // Add to the stage to obtain correct measurements
      var stage = ctx.getStage();
      stage.addChild(icon);
      var dims = icon.GetSvgDimensions();
      stage.removeChild(icon);
      baselineCache[size] = -dims.y;
    }
    return baselineCache[size];
  }

  return function (ctx, iconOptions) {
    // Icons might have their own transforms (e.g. rotate, scale) so we can't use attribute-based positioning
    // Additionally, OutputText might have its own transform to deal with browser-specific text alignment
    // First allow OutputText to set any alignment-based transform
    // Then apply transform from the iconStyle
    // Finally apply the positioning transform
    // Note that this returned icon must be treated as immutable as mutation could lose transform information
    var style = iconOptions.style;
    var size = iconOptions.size;
    var pos = iconOptions.pos || { x: size / 2, y: size / 2 };
    var icon = new OutputText(ctx, style.character);
    icon.setClassName('oj-fwk-icon oj-dvt-icon');
    icon.getElem().style.fontSize = size + 'px';
    if (Agent.browser === 'ie' || Agent.browser === 'edge') {
      // current positioned top, left
      // reset any x alignment, all positioning will be done in the matrix
      icon.SetSvgProperty('x', 0, 0);

      // Next line should position exactly, but may return incorrect number if icon font hasn't been loaded yet
      // approximate for IE since the font loading check isn't supported
      var baselineHeight =
        Agent.browser === 'ie' ? 0.8 * size : getBaseline(ctx, size, style.character);

      // call superclass.setMatrix, browser-specific logic is already being handled here
      var isRTL = Agent.isRightToLeft(ctx);
      var baselineTranslation = new Matrix(
        1,
        0,
        0,
        1,
        isRTL ? size / 2 : -size / 2,
        baselineHeight - size / 2
      );
      OutputText.superclass.setMatrix.call(
        icon,
        baselineTranslation.concat(style.transform).translate(pos.x, pos.y)
      );
    } else {
      icon.alignCenter();
      icon.alignCentral();
      icon.setMatrix(style.transform.translate(pos.x, pos.y));
    }
    return icon;
  };
})();

OutputText.prototype.isMultiline = function () {
  return false;
};

OutputText.prototype.hasBackground = function () {
  return false;
};

/**
 * Rectangle displayable.
 * @param {dvt.Context} context
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {Shape}
 * @class
 * @constructor
 */
const Rect = function (context, x, y, w, h, id) {
  this.Init(context, x, y, w, h, id);
};

Obj.createSubclass(Rect, Shape);

Rect._cssAttrs = ['background-color', 'border-color', 'border-width'];

/**
 * @param {dvt.Context} context
 * @param {number} x
 * @param {number} Y
 * @param {number} w
 * @param {number} h
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
Rect.prototype.Init = function (context, x, y, w, h, id) {
  Rect.superclass.Init.call(this, context, 'rect', id);
  this._strokeAlignment = 'center'; //default stroke alignment
  this.setX(x).setY(y).setWidth(w).setHeight(h);
};

// Create SVG property getters and setters
Displayable.defineProps(Rect, {
  x: { value: 0 },
  y: { value: 0 },
  width: { value: 0 },
  height: { value: 0 },
  rx: {},
  ry: {}
});

/**
 * Sets the dvt.CSSStyle of this object.
 * @param {dvt.CSSStyle} style The dvt.CSSStyle of this object.
 */
Rect.prototype.setCSSStyle = function (style) {
  Rect.superclass.setCSSStyle.call(this, style);

  // TODO  CLEANUP: This code seems to apply to all shapes.  It's unclear why we only support it here.
  var elem = this._elem;
  if (style) {
    var val = style.getStyle('background-color');
    if (val) {
      ToolkitUtils.setAttrNullNS(elem, 'fill', val);
    }
    val = style.getStyle('border-color');
    if (val) {
      ToolkitUtils.setAttrNullNS(elem, 'stroke', val);
    }
    val = style.getStyle('border-width');
    if (val) {
      ToolkitUtils.setAttrNullNS(elem, 'stroke-width', val);
    }

    // - border-radius css property not supported when used inside <dvt:node>
    val = style.getStyle('border-radius');
    if (val) {
      var radArr = val.trim().split(' ');
      if (radArr.length > 0 && radArr[0]) {
        this.setRx(radArr[0]);
      }
      if (radArr.length > 1 && radArr[1]) {
        this.setRy(radArr[1]);
      }
    }
  } else {
    ToolkitUtils.removeAttrNullNS(this._elem, 'style');
  }
};

/**
 * @override
 */
Rect.prototype.SetSvgProperty = function (name, value, defaultValue) {
  if (value !== this.GetProperty(name)) {
    this.SetProperty(name, value);
    this._setAttributeWithStroke(name, value, defaultValue);
    this.SvgPropertyChanged(name);
  }
  return this;
};

/**
 * Function to set the specified SVG attribute on the DOM element based on stroke alignment.
 * @param {string} name The name of the attribute.
 * @param {string} value The value of the attribute.
 * @param {string=} defaultValue The default value of the attribute, which can be provided to optimize performance.
 * @private
 */
Rect.prototype._setAttributeWithStroke = function (name, value, defaultValue) {
  if (value != null && this._strokeAlignment != 'center') {
    // Resize the Rect so that the stroke appears like it is applied on the outer/inner edge of the rectangle path.
    // Directly modify the rect attributes in DOM. The rect attributes in DOM and
    // the underlying rect properties (x/y/height/width) are expected to be out of sync.
    // TO DO: This does not fix correct rx/ry attributes
    var strokeOffset = this._getStrokeOffset();
    switch (name) {
      case 'x':
      case 'y':
        value -= strokeOffset;
        break;
      case 'width':
      case 'height':
        value += strokeOffset * 2;
        break;
    }
  }
  ToolkitUtils.setAttrNullNS(this._elem, name, value, defaultValue);
};

/**
 * Specifies the stroke alignment of the rectangle.
 * Supported values are 'outer' | 'inner' | 'center' (default)
 *
 * This functionality is similar to proposed SVG 'stroke-alignment' property which isn't supported yet.
 *
 * For CENTER stroke alignment (default), the stroke is applied along the path of rectangle.
 * If inner stroke and outer stroke are specified, the inner stroke will be applied on top of outer stroke.
 * The inner/outer strokes will overlap and are center aligned along the path of the rectangle.
 * Since the inner stroke obfuscates outer stroke, the visible width of outer stroke will be reduced by inner stroke.
 *
 * For OUTER stroke alignment, the stroke is applied on the outer edge of the path of the rectangle.
 * If inner stroke and outer stroke are specified, the outer stroke will circumscribe inner stroke.
 * And both the strokes will be rendered outside the specified bounds of the rectangle.
 * Visible width of outer stroke won't be reduced by inner stroke and it will remain same as specified.
 *
 * For INNER stroke alignment, the stroke is applied on the inner edge of the path of the rectangle.
 * If inner stroke and outer stroke are specified, the outer stroke will circumscribe inner stroke.
 * And both the strokes will be rendered inside the specified bounds of the rectangle.
 * Visible width of outer stroke won't be reduced by inner stroke and it will remain same as specified.
 *
 * @param {string} alignment the stroke alignment
 */
Rect.prototype.setStrokeAlignment = function (alignment) {
  // Update element stroke dimensions if the stroke alignment has changed.
  if (this._strokeAlignment != alignment) {
    this._strokeAlignment = alignment;
    this._updateElemStrokeDimensions();
  }
};

/**
 * Returns the stroke alignment of the rectangle.
 * Supported values are 'outer' | 'inner' | 'center' (default)
 *
 * @return {string} the stroke alignment
 */
Rect.prototype.getStrokeAlignment = function () {
  return this._strokeAlignment;
};

/**
 * Update element stroke dimensions based on the stroke alignment
 * @private
 */
Rect.prototype._updateElemStrokeDimensions = function () {
  this._setAttributeWithStroke('x', this.getX(), 0);
  this._setAttributeWithStroke('y', this.getY(), 0);
  this._setAttributeWithStroke('width', this.getWidth());
  this._setAttributeWithStroke('height', this.getHeight());
};

/**
 * Returns the stroke offset based on the stroke alignment
 * @return {number} The stroke offset
 * @private
 */
Rect.prototype._getStrokeOffset = function () {
  var strokeOffset = 0;
  var stroke = this.getStroke();
  if (stroke) {
    // When stroke alignment is OUTER, the strokeOffset needs to account for inner stroke width
    if (this._strokeAlignment == 'outer') {
      strokeOffset = stroke.getWidth() / 2;
      // Get the inner rect stroke
      var innerStroke = this.GetHoverSelectionInnerStroke();
      if (innerStroke != null) strokeOffset += innerStroke.getWidth();

      // When stroke alignment is INNER, the strokeOffset needs to account for outer stroke width
    } else if (this._strokeAlignment == 'inner') {
      strokeOffset = -stroke.getWidth() / 2;
      // Get the outer rect stroke
      var outerStroke = this.GetHoverSelectionOuterStroke();
      if (outerStroke != null) strokeOffset -= outerStroke.getWidth();
    }
  }
  return strokeOffset;
};

/**
 * @override
 */
Rect.prototype.setStroke = function (stroke) {
  Rect.superclass.setStroke.call(this, stroke);
  // Update element stroke dimensions if the stroke alignment is not CENTER
  if (this._strokeAlignment != 'center') {
    this._updateElemStrokeDimensions();
  }
};

/**
 * @override
 */
Rect.prototype.GetElemDimensionsWithStroke = function () {
  var dims = Rect.superclass.GetElemDimensionsWithStroke.call(this);
  //Update the element dimesions if the stroke alignment is not CENTER
  if (dims && this._strokeAlignment != 'center') {
    var strokeOffset = this._getStrokeOffset();
    dims.x -= strokeOffset;
    dims.y -= strokeOffset;
    dims.w += strokeOffset * 2;
    dims.h += strokeOffset * 2;
  }
  return dims;
};

/**
 *  Sets the corner radius value(s) to create rounded corners.
 *  @param {number} rx  The horizontal (x) radius.
 *  @param {number} ry  Optional: The vertical (y) radius. if omitted the rx
 *                      value is used.
 */
Rect.prototype.setCornerRadius = function (rx, ry) {
  this.setRx(rx).setRy(ry); // TODO  CLEANUP/NECESSARY?
};

/**
 *  Sets the position and size of the rectangle.
 *  May be specified as individual values or using a Rectangle object.
 *  <p>
 *  Example<br><br><code>
 *  rect.setRect(10, 10, 50, 100) ; &nbsp;  or<br>
 *  <br>
 *  rect.setRect(myRect) ; &nbsp; &nbsp;  where myRect = new Rectangle(10, 10, 50, 100);<br>
 *
 *  @param {number|Rectangle} x  The x position of the top left corner of the rectangle or an
 *                                   instance of Rectangle.
 *  @param {number} y  The y position of the top left corner of the rectangle.
 *  @param {number} w  The width of the rectangle.
 *  @param {number} h  The height of the rectangle.
 */
Rect.prototype.setRect = function (x, y, w, h) {
  if (x instanceof Rectangle) {
    this.setX(x.x).setY(x.y).setWidth(x.w).setHeight(x.h);
  } else {
    this.setX(x).setY(y).setWidth(w).setHeight(h);
  }
};

/**
 * @override
 */
Rect.prototype.copyShape = function () {
  var copy = new Rect(this.getCtx(), this.getX(), this.getY(), this.getWidth(), this.getHeight());
  copy.setRx(this.getRx()).setRy(this.getRy());
  copy.setStrokeAlignment(this.getStrokeAlignment());
  return copy;
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
Rect.prototype.getDimensionsSelf = function (targetCoordinateSpace) {
  // Note: In the near future, we will not support children for shapes, so this routine will be refactored into the
  //       existing getDimensions calls.  For now, components must be aware of the presence of children to use this.
  var bounds = new Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

/**
 * Class representing a timer.
 * @extends {Obj}
 * @class Timer
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  interval  interval between timer ticks, in milliseconds
 * @param {function}  callback  function to call for each timer tick
 * @param {object}  callbackObj  optional object instance that callback function is defined on
 * @param {number}  repeatCount  optional number of times for timer to repeat;
 *        timer repeats indefinitely if 0 or undefined
 */
const Timer = function (context, interval, callback, callbackObj, repeatCount) {
  this.Init(context, interval, callback, callbackObj, repeatCount);
};

Obj.createSubclass(Timer, Obj);

/**
 * @protected
 */
Timer.prototype.Init = function (context, interval, callback, callbackObj, repeatCount) {
  this._interval = interval; //in ms
  this._callback = callback;
  this._callbackObj = callbackObj;

  this._repeatCount = repeatCount;
  this._bRunning = false;
  this._numIterations = 0;
};

/**
 * Start this timer.
 */
Timer.prototype.start = function () {
  if (!this._bRunning) {
    this._bRunning = true;
    this.StartTimer();
  }
};

/**
 * Stop this timer.
 */
Timer.prototype.stop = function () {
  if (this._bRunning) {
    this._bRunning = false;
    this.StopTimer();
  }
};

/**
 * Reset this timer.
 */
Timer.prototype.reset = function () {
  if (this._bRunning) {
    this.stop();
  }

  this._numIterations = 0;
};

/**
 * Determine if this timer is running.
 * @type {boolean}
 */
Timer.prototype.isRunning = function () {
  return this._bRunning;
};

/**
 * @protected
 * Handle a timer tick.
 */
Timer.prototype.HandleTimer = function () {
  if (this._callback) {
    this._callback.call(this._callbackObj);

    if (this._repeatCount) {
      this._numIterations++;
      if (this._numIterations >= this._repeatCount) {
        this.stop();
      }
    }
  }
};

/**
 * Set the interval between timer ticks, in milliseconds.
 * @param {number}  interval  interval between timer ticks, in milliseconds
 */
Timer.prototype.setInterval = function (interval) {
  var i = interval;
  if (i < 0) {
    i = 0;
  }
  var oldBRunning = this._bRunning;
  if (oldBRunning) {
    this.stop();
  }
  this._interval = i;
  if (oldBRunning) {
    this.start();
  }
};

/**
 * Get the interval between timer ticks.
 * @type {number}
 */
Timer.prototype.getInterval = function () {
  return this._interval;
};

/**
 * Starts the internal timer implementation.  Called when the timer is started.
 * @protected
 */
Timer.prototype.StartTimer = function () {
  var timer = this;
  var timerCallback = this.HandleTimer;
  this._timerId = window.setInterval(function () {
    timerCallback.call(timer);
  }, this.getInterval());
};

/**
 * Stops the internal timer implementation.  Called when the timer is stopped.
 * @protected
 */
Timer.prototype.StopTimer = function () {
  if (this._timerId) {
    window.clearInterval(this._timerId);
    this._timerId = null;
  }
};

/*--------------------------------------------------------------------*/
/*   DvtCustomTooltip              Action tooltip Component           */
/*--------------------------------------------------------------------*/
/**
 * @constructor
 *  Action tooltip component.
 *  @extends {dvt.Obj}
 *  @class DvtCustomTooltip  Creates an action tooltip component.
 */
const DvtCustomTooltip = function (context, id) {
  this._Init(context, id);
};

Obj.createSubclass(DvtCustomTooltip, Container);

DvtCustomTooltip.DEFAULT_BORDER_COLOR = 'gray';
DvtCustomTooltip.DEFAULT_BACKGROUND_COLOR = '#ffffff';

DvtCustomTooltip.prototype._Init = function (context, id) {
  this._context = context;
  DvtCustomTooltip.superclass.Init.call(this, context);

  this._tooltipText = null;
  this._tooltipBorderColor = null;
  this._menuFontSize = 11;
  this._tooltipFill = new SolidFill(DvtCustomTooltip.DEFAULT_BACKGROUND_COLOR);
  this._fontSize = 11; // TODO: This shouldn't be hard coded, but this maintains the existing behavior
};

DvtCustomTooltip.prototype.getRootDisplayable = function () {
  return this;
};

DvtCustomTooltip.prototype.UpdateTooltipSize = function (width, height) {
  this._displayWidth = width;
  this._displayHeight = height;
};

DvtCustomTooltip.prototype.getDisplayWidth = function () {
  return this._displayWidth;
};

DvtCustomTooltip.prototype.getDisplayHeight = function () {
  return this._displayHeight;
};

DvtCustomTooltip.prototype.clearContent = function () {
  this.clearMenuItems();
  this.setTooltipBorderColor(null);
  this.setTooltipText(null);
};

DvtCustomTooltip.prototype.setTooltipBorderColor = function (color) {
  this._tooltipBorderColor = color;
};

DvtCustomTooltip.prototype.getTooltipBorderColor = function () {
  return this._tooltipBorderColor;
};

DvtCustomTooltip.prototype.setTooltipText = function (text) {
  this._tooltipText = text;
};

DvtCustomTooltip.prototype.addMenuItem = function (menuItem) {
  this.getMenuItems().push(menuItem);
};

DvtCustomTooltip.prototype.hasMenuItems = function () {
  var menuItems = this.getMenuItems();
  return menuItems && menuItems.length > 0;
};

DvtCustomTooltip.prototype.clearMenuItems = function () {
  if (this._menuItems) {
    this._menuItems = [];
  }
};

DvtCustomTooltip.prototype.getMenuItems = function () {
  if (!this._menuItems) this._menuItems = new Array();
  return this._menuItems;
};

DvtCustomTooltip.prototype.containsMenuId = function (id) {
  var menuItems = this.getMenuItems();
  for (var i = 0; i < menuItems.length; i++) {
    var menuItem = menuItems[i];
    if (menuItem.getId() == id) {
      return true;
    }
  }
  return false;
};

/**
 * Renders this action tooltip.
 */
DvtCustomTooltip.prototype.Render = function () {
  var parent = this.getRootDisplayable();
  //parent.setPixelHinting(true);
  // First clear old drawables
  parent.removeChildren();

  var hasMenuItems = this.hasMenuItems();
  if (!hasMenuItems) {
    return;
  }

  // Constants
  var padding = 4;
  var menuItemPadding = 5;
  var tooltipBorderWidth = 2;

  // Temp variables
  var topTextY = padding + tooltipBorderWidth / 2;
  var runningHeight = 0;
  var maxWidth = 0;

  parent.setAlpha(1);

  var textItems = new Array();
  var textWidths = new Array();
  runningHeight += menuItemPadding / 2;

  var menuItems = this.getMenuItems();
  for (var i = 0; i < menuItems.length; i++) {
    var menuItem = menuItems[i];

    var text = new OutputText(this._context, menuItem.getText(), 0, 0, null);
    text.alignBottom();
    text.setFontSize(this._menuFontSize);
    text._menu = menuItem;

    var dimensions = text.getDimensions();
    dimensions.y = topTextY + runningHeight;
    var textWidth = dimensions.w;
    textWidths.push(dimensions);
    maxWidth = Math.max(textWidth + 21 + 10, maxWidth); // left menu padding is 21, right menu is 10
    text.setY(dimensions.y);
    runningHeight += dimensions.h;

    if (i < menuItems.length - 1) {
      runningHeight += menuItemPadding;
    }

    textItems.push(text);
    text.alignLeft();
    text.alignTop();
  }

  runningHeight += menuItemPadding / 2;

  var contentWidth = maxWidth + 2 * padding;
  var tooltipWidth = contentWidth + tooltipBorderWidth;
  var tooltipHeight = topTextY + runningHeight + padding + tooltipBorderWidth / 2;

  this.UpdateTooltipSize(tooltipWidth + tooltipBorderWidth, tooltipHeight + tooltipBorderWidth);
  parent.setTranslate(tooltipBorderWidth / 2, tooltipBorderWidth / 2);

  // Add background panels
  var backgroundPanel = new Rect(this._context, 0, 0, tooltipWidth, tooltipHeight);
  backgroundPanel.setSolidStroke('rgb(229,232,238)');

  backgroundPanel.setFill(this._tooltipFill);
  parent.addChildAt(backgroundPanel, 0);

  // Add text items
  for (var i = 0; i < textItems.length; i++) {
    var textItem = textItems[i];
    parent.addChild(textItem);
    var textWidth = textWidths[i].w;
    if (textItem._menu) {
      // Menus have target areas
      var hitAreaRect = new Rectangle(
        0,
        textWidths[i].y - menuItemPadding / 2,
        tooltipWidth,
        textWidths[i].h + menuItemPadding
      );
      var hitTarget = new Rect(
        this._context,
        hitAreaRect.x,
        hitAreaRect.y,
        hitAreaRect.w,
        hitAreaRect.h
      );
      hitTarget.setInvisibleFill();

      hitTarget._menu = textItem._menu;
      parent.addChild(hitTarget);
    }
    textItem.setTranslateX(21); // left menu padding is 21
  }
};

/*--------------------------------------------------------------------*/
/*   DvtCustomTooltipItem              Action tooltip item            */
/*--------------------------------------------------------------------*/
/**
 *  Logical action tooltip item.  No dependency on drawables
 *  @extends {dvt.Obj}
 *  @class DvtCustomTooltipItem  Creates an action tooltip item.
 *  @constructor
 */
var DvtCustomTooltipItem = function (context, id, text, listener, listenerObj) {
  this.Init(context, id, text, listener, listenerObj);
};

Obj.createSubclass(DvtCustomTooltipItem, Obj);

DvtCustomTooltipItem.prototype.Init = function (context, id, text, listener, listenerObj) {
  this._context = context;
  this._id = id;
  this._text = text;
  this._listener = listener;
  this._listenerObj = listenerObj;
};

DvtCustomTooltipItem.prototype.getId = function () {
  return this._id;
};

DvtCustomTooltipItem.prototype.getText = function () {
  return this._text;
};

DvtCustomTooltipItem.prototype.FireActionTooltipItem = function (target) {
  if (this._listenerObj && this._listener) {
    var evt = new Object();
    evt.target = target;
    evt.menuItem = this._menuItem;
    this._menuItemTimer = new Timer(this._context, 1, this._handleMenuTimer, this);
    // store event on timer temporarily
    this._menuItemTimer.evt = evt;
    this._menuItemTimer.start();
  }
};

// Timer handler for menu item listener
DvtCustomTooltipItem.prototype._handleMenuTimer = function () {
  if (this._menuItemTimer) {
    this._menuItemTimer.stop();
  }
  this._listener.call(this._listenerObj, this._menuItemTimer.evt);
};

// Used for rendering SVG content in to an HTML div wrapper
/**
 * @param {Context} context
 * @param {string} domElementId
 * @constructor
 */
const DvtHtmlRichTooltipManager = function (context, domElementId) {
  this.Init(context, domElementId);
};

Obj.createSubclass(DvtHtmlRichTooltipManager, HtmlTooltipManager);

/**
 * @param {Context} context
 * @param {string} domElementId
 */
DvtHtmlRichTooltipManager.prototype.Init = function (context, domElementId) {
  this._storedContexts = new Object();
  DvtHtmlRichTooltipManager.superclass.Init.call(this, context, domElementId);
};

DvtHtmlRichTooltipManager.prototype.InitContent = function (tooltip) {
  // For an svg custom tooltip, the context is the new svg context for the svg document overlay.
  tooltip.innerHTML = ''; // @HTMLUpdateOK
  var context = this._context.createContext(tooltip, 'DvtCustomTooltip');
  context.removeSizingSvg();
  this._storedContexts[this._domElementId] = context;
};

DvtHtmlRichTooltipManager.prototype.GetStoredContext = function () {
  return this._storedContexts[this._domElementId];
};

DvtHtmlRichTooltipManager.prototype.showRichElement = function (x, y, renderable, useOffset) {
  this.showRichElementAtPosition(x, y, renderable, useOffset, false);
};

DvtHtmlRichTooltipManager.prototype.showRichElementAtPosition = function (
  x,
  y,
  renderable,
  useOffset,
  noEvents
) {
  var tooltip = this.getTooltipElem();
  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = 2147483647;

  var context = this.GetStoredContext();
  if (context) {
    var stage = context.getStage();
    stage.removeChildren();
    var rootDisplayable = renderable.getRootDisplayable();
    stage.addChild(rootDisplayable);

    if (renderable && renderable.Render) {
      renderable.Render();
    }

    var svg = stage.getSVGRoot();
    ToolkitUtils.setAttrNullNS(svg, 'width', renderable.getDisplayWidth());
    ToolkitUtils.setAttrNullNS(svg, 'height', renderable.getDisplayHeight());

    this.PostElement(tooltip, x, y, noEvents, useOffset);
  }
};

DvtHtmlRichTooltipManager.prototype.hideTooltip = function () {
  DvtHtmlRichTooltipManager.superclass.hideTooltip.call(this);
  var context = this.GetStoredContext();
  if (context) {
    var stage = context.getStage();
    stage.removeChildren();
  }
};

/**
 * @constructor
 * A higher-level class that represents a single touch event.
 * The target and the relatedTarget simulate target and relatedTarget of the MouseEvent
 * and the target does not match target on the native TouchEvent.
 * @param {string} type One of the ComponentTouchEvent event types.
 * @param {dvt.Touch} touch A single point of contact with the surface
 * @param {object} target An element that triggered the event
 * @param {object} relatedTarget An element related to the element that triggered the event
 * @param {TouchEvent} nativeEvent  Native touch event
 * @class ComponentTouchEvent
 */
const ComponentTouchEvent = function (type, touch, target, relatedTarget, nativeEvent) {
  this.type = type;
  this.touch = touch;
  this.target = target;
  this.relatedTarget = relatedTarget;
  this._nativeEvent = nativeEvent;
  this._isPropagationStopped = false;
};

/**
 * Touch hold start event
 * @const
 */
ComponentTouchEvent.TOUCH_HOLD_START_TYPE = 'touchholdstart';

/**
 * Touch hold move event
 * @const
 */
ComponentTouchEvent.TOUCH_HOLD_MOVE_TYPE = 'touchholdmove';

/**
 * Touch hold end event
 * @const
 */
ComponentTouchEvent.TOUCH_HOLD_END_TYPE = 'touchholdend';

/**
 * Touch hover start event
 * @const
 */
ComponentTouchEvent.TOUCH_HOVER_START_TYPE = 'touchhoverstart';

/**
 * Touch hover move event
 * @const
 */
ComponentTouchEvent.TOUCH_HOVER_MOVE_TYPE = 'touchhovermove';

/**
 * Touch hover end event
 * @const
 */
ComponentTouchEvent.TOUCH_HOVER_END_TYPE = 'touchhoverend';

/**
 * Touch hover over event
 * @const
 */
ComponentTouchEvent.TOUCH_HOVER_OVER_TYPE = 'touchhoverover';

/**
 * Touch hover out event
 * @const
 */
ComponentTouchEvent.TOUCH_HOVER_OUT_TYPE = 'touchhoverout';

/**
 * Touch click event
 * @const
 */
ComponentTouchEvent.TOUCH_CLICK_TYPE = 'touchclick';

/**
 * Touch double click event
 * @const
 */
ComponentTouchEvent.TOUCH_DOUBLE_CLICK_TYPE = 'touchdblclick';

// Stub methods so that mouse click handlers don't break
ComponentTouchEvent.prototype.preventDefault = function () {};

ComponentTouchEvent.prototype.stopPropagation = function () {
  this._isPropagationStopped = true;
};

ComponentTouchEvent.prototype.isPropagationStopped = function () {
  return this._isPropagationStopped;
};

/**
 * Get native touch event
 * @return {TouchEvent}  native touch event
 */
ComponentTouchEvent.prototype.getNativeEvent = function () {
  return this._nativeEvent;
};

/**
 * Document APIs.
 * @class SvgDocumentUtils
 */
const SvgDocumentUtils = function () {};

Obj.createSubclass(SvgDocumentUtils, Obj);

// TODO JSDoc
// Return displayable
SvgDocumentUtils.elementFromPoint = function (posX, posY) {
  var domObj = document.elementFromPoint(posX, posY);
  while (domObj) {
    if (domObj._obj) {
      return domObj._obj;
    }
    domObj = domObj.parentNode;
  }
  return null;
};

/**
 * Wrapper for the elementFromPoint function that uses clientX and clientY coordinates
 * from the touch to find a corresponding displayable object
 * @param {dvt.Touch} touch The touch being passed in to evaluate the element it corresponds to
 * @return {dvt.Displayable} displayable The dom object the touch corresponds to
 */
SvgDocumentUtils.elementFromTouch = function (touch) {
  return this.elementFromPoint(touch.clientX, touch.clientY);
};

/**
 * Adds drag listeners to an object. The drag will have to start from the object, but the following mouse/touch
 * gestures will be captured even if it goes outside the object. The move and end listeners are added to the document
 * when the drag starts, and will be cleaned up when the drag ends.
 * @param {dvt.Displayable} displayable The draggable displayable.
 * @param {function} dragStartCallback The callback function that is called on drag start. It should return a boolean
 *     indicating if the drag is initiated.
 * @param {function} dragMoveCallback The callback function that is called on drag move.
 * @param {function} dragEndCallback The callback function that is called on drag end.
 * @param {object} callbackObj The object of the callback functions.
 * @param {boolean} bPreventClick (optional) Whether click should be prevented at the end of drag.
 */
SvgDocumentUtils.addDragListeners = function (
  displayable,
  dragStartCallback,
  dragMoveCallback,
  dragEndCallback,
  callbackObj,
  bPreventClick
) {
  var isTouch = Agent.isTouchDevice();
  var context = displayable.getCtx();
  var bodyStyle = document.body.style;

  var mouseMoved;
  var clickStaticCallback = function (event) {
    // Prevent click from occurring (e.g. to prevent clearing selection)
    event.stopPropagation();
  };

  var dragStartStaticCallback = function (dvtEvent) {
    if (dragStartCallback.call(callbackObj, dvtEvent)) {
      // Add dragMove and dragEnd event listeners to the document so that the gestures that follow can be captured
      // outside the component.
      if (isTouch) {
        // Starting in Chrome 51, Firefox 49, and Safari 11.1, touch event listeners are passive by default
        // for scrolling performance reasons.
        // See also https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md.
        // This means calling event.preventDefault() inside touchmove handlers won't prevent page scrolling.
        // We use to call event.preventDefault() in various touchmove handlers to prevent page scrolls when dragging,
        // (e.g. in dvt.SimpleScrollBar and component specific panning logic), but they stopped working.
        // Solution is to set passive to false to allow event.preventDefault().
        // This should be safe, because we always want to prevent page scrolling when dragging, so having passive true
        // gives us no performance benefits.
        document.addEventListener('touchmove', dragMoveStaticCallback, {
          capture: true,
          passive: false
        });
        document.addEventListener('touchend', dragEndStaticCallback, true);
      } else {
        document.addEventListener('mousemove', dragMoveStaticCallback, true);
        document.addEventListener('mouseup', dragEndStaticCallback, true);
        mouseMoved = false;
        if (bPreventClick) document.addEventListener('click', clickStaticCallback, true);
      }

      // Save the original CSS values
      SvgDocumentUtils._webkitUserSelect = bodyStyle.webkitUserSelect;
      SvgDocumentUtils._mozUserSelect = bodyStyle.MozUserSelect;

      // Disable selection during drag
      bodyStyle.webkitUserSelect = 'none';
      bodyStyle.MozUserSelect = 'none';
    }
  };

  var dragMoveStaticCallback = function (event) {
    mouseMoved = true;
    // Convert the native event and call the callback
    var dvtEvent = DomEventFactory.newEvent(event, context);
    dragMoveCallback.call(callbackObj, dvtEvent);
  };

  var dragEndStaticCallback = function (event) {
    // Clean up the dragMove and dragEnd event listeners
    if (isTouch) {
      document.removeEventListener('touchmove', dragMoveStaticCallback, true);
      document.removeEventListener('touchend', dragEndStaticCallback, true);
    } else {
      document.removeEventListener('mousemove', dragMoveStaticCallback, true);
      document.removeEventListener('mouseup', dragEndStaticCallback, true);

      if (Agent.browser === 'firefox' && mouseMoved && !bPreventClick) {
        // FF fires a spurious click event here, need to stop it from propagating
        document.addEventListener('click', clickStaticCallback, { capture: true, once: true });
        // Just to be extra paranoid, remove the listener if it doesn't trigger
        setTimeout(function () {
          document.removeEventListener('click', clickStaticCallback, { capture: true, once: true });
        }, 0);
      }
      mouseMoved = false;
      // Use timeout because the click event is fired after mouseup. We can't remove the listener in the
      // clickCallback because the click event may not be fired depending on where the mouseup happens.
      if (bPreventClick) {
        setTimeout(function () {
          document.removeEventListener('click', clickStaticCallback, true);
        }, 50);
      }
    }

    // Restore selection
    bodyStyle.webkitUserSelect = SvgDocumentUtils._webkitUserSelect;
    bodyStyle.MozUserSelect = SvgDocumentUtils._mozUserSelect;

    // Convert the native event and call the callback
    var dvtEvent = DomEventFactory.newEvent(event, context);
    dragEndCallback.call(callbackObj, dvtEvent);
  };

  // Add the dragStart listener to the object.
  if (isTouch) {
    displayable.addEvtListener(TouchEvent.TOUCHSTART, dragStartStaticCallback);
  } else {
    displayable.addEvtListener(MouseEvent.MOUSEDOWN, dragStartStaticCallback);
  }
};

/**
 * Converts an instance callback that takes a DVT wrapped event to a static callback that takes the native event.
 * @param {dvt.Context} context
 * @param {function} callback
 * @param {object} callbackObj
 * @return {function}
 */
SvgDocumentUtils.createStaticCallback = function (context, callback, callbackObj) {
  return function (event) {
    // Convert the native event and call the callback
    var dvtEvent = DomEventFactory.newEvent(event, context);
    callback.call(callbackObj, dvtEvent);
  };
};

/**
 * Disables mouse events on the elem and all of its descendants.
 * @param {Element} elem
 */
SvgDocumentUtils.disableMouseEvents = function (elem) {
  if (elem.style) elem.style.pointerEvents = 'none';

  // Recursively disable mouse events on the children
  // elem.children isn't defined for SVG in IE, so we have to use elem.childNodes
  if (elem.childNodes) {
    for (var i = 0; i < elem.childNodes.length; i++) {
      SvgDocumentUtils.disableMouseEvents(elem.childNodes[i]);
    }
  }
};

/**
 * @constructor
 * Keeps track of the current state of touches and fires higher-level logical events
 * @extends {dvt.Obj}
 * @param {string} id Id for the this TouchManager instance
 * @param {dvt.Context} context An application specific context
 * @param {dvt.EventManager} eventManager The event manager for this TouchManager instance.
 * @class TouchManager
 */
const TouchManager = function (id, context, eventManager) {
  this.Init(id, context, eventManager);
};

Obj.createSubclass(TouchManager, Obj);

TouchManager.TOUCH_MODE = 'mode';
TouchManager.TOUCH_MODE_DEFAULT = 'defaultMode';
TouchManager.TOUCH_MODE_LONG_PRESS = 'longPressMode';

TouchManager.PREV_HOVER_OBJ = 'prevHoverObj';

TouchManager.HOVER_TOUCH_KEY = 'hoverTouch';

/**
 * @protected
 * Helper method called by the constructor to initialize this object.
 * @param {string} id Id for the this TouchManager instance
 * @param {dvt.Context} context An application specific context
 * @param {dvt.EventManager} eventManager The event manager for this TouchManager instance.
 */
TouchManager.prototype.Init = function (id, context, eventManager) {
  this._context = context;
  this._id = id;
  this._eventManager = eventManager;

  // Total number of touches on the screen
  this._touchCount = 0;

  // Single timer for touch hold
  this._touchHoldTimer = new Timer(this._context, 200, this._handleTouchHoldStartTimer, this);
  this._blockTouchHold = false;

  // Stored mapping for history information on touches
  this._touchMap = new Object();

  // Save information on touches which are already associated with listeners
  this._savedTouchInfo = new Array();

  // internal listener to translate to hover
  this._addTouchHoldMoveEventListener(this._onTouchHoldHover, this);

  // Single timer for double tap
  // We are using 600 ms because 300ms is too fast in VoiceOver mode to recognize the second tap.
  // Do not change this value without checking VoiceOver.
  this._doubleTapTimer = new Timer(this._context, 600, this._handleDoubleTapTimer, this, 1);

  // dvt.Touch event
  this._dvtTouchEvent = null;
};

/**
 * Block touch hold event. We might want to prevent touch hold during zoom oparation.
 */
TouchManager.prototype.blockTouchHold = function () {
  this._stopTouchHoldTimer();
  this._blockTouchHold = true;
};

/**
 * Releases touch hold block.
 */
TouchManager.prototype.unblockTouchHold = function () {
  this._blockTouchHold = false;
};

TouchManager.prototype._addTouchHoldMoveEventListener = function (listener, obj) {
  this.addTouchEventListener(ComponentTouchEvent.TOUCH_HOLD_START_TYPE, listener, obj);
  this.addTouchEventListener(ComponentTouchEvent.TOUCH_HOLD_MOVE_TYPE, listener, obj);
  this.addTouchEventListener(ComponentTouchEvent.TOUCH_HOLD_END_TYPE, listener, obj);
};

/**
 * Internal touch hold listener to translate to hover events
 * @private
 * @param {ComponentTouchEvent} evt A touch hold event.
 */
TouchManager.prototype._onTouchHoldHover = function (evt) {
  var type = evt.type;
  var touch = evt.touch;
  var nativeEvt = evt.getNativeEvent();

  var info = this._touchMap[touch.identifier];

  var obj = evt.target;
  if (type == ComponentTouchEvent.TOUCH_HOLD_END_TYPE) {
    var hoverEvt = new ComponentTouchEvent(
      ComponentTouchEvent.TOUCH_HOVER_END_TYPE,
      touch,
      obj,
      null,
      nativeEvt
    );
    hoverEvt._isCancelEvent = this._isCancelEvent;

    if (obj != null)
      this.FireListener(
        new ComponentTouchEvent(
          ComponentTouchEvent.TOUCH_HOVER_OUT_TYPE,
          touch,
          obj,
          null,
          nativeEvt
        )
      );
    info[TouchManager.PREV_HOVER_OBJ] = null;

    this.FireListener(hoverEvt);
  } else if (type == ComponentTouchEvent.TOUCH_HOLD_START_TYPE) {
    info[TouchManager.PREV_HOVER_OBJ] = null;
    if (obj != null)
      this.FireListener(
        new ComponentTouchEvent(
          ComponentTouchEvent.TOUCH_HOVER_OVER_TYPE,
          touch,
          obj,
          null,
          nativeEvt
        )
      );
    info[TouchManager.PREV_HOVER_OBJ] = obj;

    this.FireListener(
      new ComponentTouchEvent(
        ComponentTouchEvent.TOUCH_HOVER_START_TYPE,
        touch,
        obj,
        null,
        nativeEvt
      )
    );
  } else if (type == ComponentTouchEvent.TOUCH_HOLD_MOVE_TYPE) {
    this._fireHoverOverOutEvents(obj, info[TouchManager.PREV_HOVER_OBJ], touch, nativeEvt);
    info[TouchManager.PREV_HOVER_OBJ] = obj;
    this.FireListener(
      new ComponentTouchEvent(
        ComponentTouchEvent.TOUCH_HOVER_MOVE_TYPE,
        touch,
        obj,
        null,
        nativeEvt
      )
    );
  }
};

TouchManager.prototype._getObjFromTouch = function (touch) {
  return touch ? SvgDocumentUtils.elementFromTouch(touch) : null;
};

/**
 * @private
 * Fire logical hover events
 * @param {object} currentObj  Current element that triggered the event
 * @param {object} prevHoverObj  Previous element that triggered the event
 * @param {dvt.Touch} touch A single point of contact with the surface
 * @param {TouchEvent} nativeEvt  Native touch event
 */
TouchManager.prototype._fireHoverOverOutEvents = function (
  currentObj,
  prevHoverObj,
  touch,
  nativeEvt
) {
  if (prevHoverObj != currentObj) {
    if (prevHoverObj != null)
      this.FireListener(
        new ComponentTouchEvent(
          ComponentTouchEvent.TOUCH_HOVER_OUT_TYPE,
          touch,
          prevHoverObj,
          currentObj,
          nativeEvt
        )
      );
    if (currentObj != null)
      this.FireListener(
        new ComponentTouchEvent(
          ComponentTouchEvent.TOUCH_HOVER_OVER_TYPE,
          touch,
          currentObj,
          prevHoverObj,
          nativeEvt
        )
      );
  }
};

/**
 * Adds an event listener.
 * @param {string} type One of the ComponentTouchEvent types
 * @param {function} listener Listener to add
 * @param {object} obj Optional object on which the listener function is defined
 */
TouchManager.prototype.addTouchEventListener = function (type, listener, obj) {
  // Store a reference to the listener
  var listenersArray = this._getListeners(type, true);
  listenersArray.push(listener);
  listenersArray.push(obj);
};

/**
 * Removes an event listener.
 * @param {string} type One of the ComponentTouchEvent types
 * @param {function} listener Listener to remove
 * @param {object} obj Optional object on which the listener function is defined
 */
TouchManager.prototype.removeTouchEventListener = function (type, listener, obj) {
  // Remove the listener
  var listenersArray = this._getListeners(type, false);
  if (listenersArray) {
    for (var i = 0; i < listenersArray.length; i += 2) {
      if (listenersArray[i] === listener && listenersArray[i + 1] === obj) {
        listenersArray.splice(i, 2);
        break;
      }
    }
  }
};

/**
 * Returns the listeners of the given event type and capture mode.
 **/
TouchManager.prototype._getListeners = function (type, createNew) {
  // First find the object where the listener arrays are stored
  if (!this._listenerObj) {
    if (createNew) {
      this._listenerObj = {};
    } else {
      return null;
    }
  }

  // Then find the array for this event type, creating if necessary
  var eventKey = type;
  var listenersArray = this._listenerObj[eventKey];
  if (!listenersArray && createNew) {
    listenersArray = [];
    this._listenerObj[eventKey] = listenersArray;
  }

  return listenersArray;
};

/**
 * Notifies all applicable event listeners of the given event.
 **/
TouchManager.prototype.FireListener = function (event) {
  var listenersArray = this._getListeners(event.type, false);
  if (listenersArray) {
    for (var i = 0; i < listenersArray.length; i += 2) {
      var obj = listenersArray[i + 1];
      listenersArray[i].call(obj, event);
    }
  }
};

/**
 * Start touch hold
 * @param {DvtTouchEvent} evt  Wrapper for the native event
 */
TouchManager.prototype.startTouchHold = function (evt) {
  var touchid = this._startSingleFingerTouchId;
  if (touchid != null && !isNaN(touchid)) {
    var info = this._touchMap[touchid];
    if (info) {
      var touchStartObj = info['startTarget'];
      var startTouch = info['startTouch'];
      var nativeEvt = evt.getNativeEvent();

      // If there are any immediate touches for this id, end it since touch hold has started
      var matches = this._findMatches('touchId', touchid);
      for (var i = 0; i < matches.length; i++) {
        var savedInfo = matches[i];
        var touchObj = savedInfo['touchObj'];
        var touchId = savedInfo['touchId'];
        if (touchObj != TouchManager.HOVER_TOUCH_KEY) {
          var touchInfo = this.getTouchInfo(touchId);
          var touch = touchInfo['startTouch'];
          this.performAssociatedTouchEnd(touch, touchObj, null);
        }
      }

      // Save mode on touch
      info[TouchManager.TOUCH_MODE] = TouchManager.TOUCH_MODE_LONG_PRESS;
      this.saveProcessedTouch(
        touchid,
        TouchManager.HOVER_TOUCH_KEY,
        null,
        TouchManager.HOVER_TOUCH_KEY,
        TouchManager.HOVER_TOUCH_KEY,
        this.HoverMoveInternal,
        this.HoverEndInternal,
        this
      );

      var touchHoldStartEvent = new ComponentTouchEvent(
        ComponentTouchEvent.TOUCH_HOLD_START_TYPE,
        startTouch,
        touchStartObj,
        null,
        nativeEvt
      );
      this.FireListener(touchHoldStartEvent);
    }
  }
};

/**
 * Execute listeners for logical events.
 * Note that there is no way to bubble logical events in the framework at the moment
 * @param {DvtTouchEvent} touchEvent  Dvt touch event
 */
TouchManager.prototype.fireLogicalEvents = function (touchEvent) {
  var type = touchEvent.type;
  var nativeEvent = touchEvent.getNativeEvent();
  if (type == TouchEvent.TOUCHSTART) {
    if (!touchEvent.isTouchHoldBlocked()) {
      this.processAssociatedTouchAttempt(
        touchEvent,
        TouchManager.HOVER_TOUCH_KEY,
        this.HoverStartInternal,
        this
      );
    }
    if (this._doubleTapAttemptStarted) {
      touchEvent.preventDefault();
    }
  } else if (type == TouchEvent.TOUCHMOVE) {
    this.processAssociatedTouchMove(touchEvent, TouchManager.HOVER_TOUCH_KEY);
  } else if (type == TouchEvent.TOUCHEND) {
    this.processAssociatedTouchEnd(touchEvent, TouchManager.HOVER_TOUCH_KEY);
  }

  if (type == TouchEvent.TOUCHEND) {
    this._context.oj.Logger.log('received touch end:' + performance.now());
    var changedTouches = this._getStoredTouches(touchEvent.changedTouches);
    for (var i = 0; i < changedTouches.length; i++) {
      var touch = changedTouches[i];
      var identifier = touch.identifier;
      var info = this.getTouchInfo(identifier);

      var targetObj = info['currentObj'];

      if (info[TouchManager.TOUCH_MODE] != TouchManager.TOUCH_MODE_LONG_PRESS) {
        if (info['fireClick']) {
          var touchClickEvt = new ComponentTouchEvent(
            ComponentTouchEvent.TOUCH_CLICK_TYPE,
            touch,
            targetObj,
            null,
            nativeEvent
          );
          touchClickEvt.touchEvent = touchEvent;
          this._context.oj.Logger.log('doubleTapAttemptStarted:' + this._doubleTapAttemptStarted);
          if (this._doubleTapAttemptStarted) {
            var prevTapObj = this._doubleTapAttemptObj;

            this.resetDoubleTap();

            if (targetObj == prevTapObj || prevTapObj.contains(targetObj)) {
              var touchDblClickEvt = new ComponentTouchEvent(
                ComponentTouchEvent.TOUCH_DOUBLE_CLICK_TYPE,
                touch,
                targetObj,
                null,
                nativeEvent
              );
              touchDblClickEvt.touchEvent = touchEvent;
              this._context.oj.Logger.log('firing double tap');
              this.FireListener(touchDblClickEvt);
            } // if the new target is different from the previous, process a click because the user is not intending to double-tap
            else this.FireListener(touchClickEvt);
          } else {
            // fire click event and begin waiting to process a double tap
            this._context.oj.Logger.log('firing tap');
            this.FireListener(touchClickEvt);

            this.resetDoubleTap();
            this._context.oj.Logger.log('starting double tap timer');
            this._doubleTapTimer.start();
            this._doubleTapAttemptStarted = true;
            this._doubleTapAttemptObj = targetObj;
          }
        }
      }
    }
  }
};

TouchManager.prototype.getTouchInfo = function (touchId) {
  return this._touchMap[touchId];
};

/**
 * Handler for the touch event. Starts timer for the potential hover event.
 * @param {DvtTouchEvent} event Wrapper for the native event
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
TouchManager.prototype.HoverStartInternal = function (event, touch) {
  if (this._blockTouchHold) return;
  var identifier = touch.identifier;
  this._startSingleFingerTouchId = identifier;
  this._stopTouchHoldTimer();
  this._startTouchHoldTimer(event);
};

/**
 * Handler for the touch hover move
 * @param {DvtTouchEvent} event Wrapper for the native event
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
TouchManager.prototype.HoverMoveInternal = function (event, touch) {
  var identifier = touch.identifier;
  var info = this.getTouchInfo(identifier);
  var targetObj = info['currentObj'];
  var touchHoldMoveEvent = new ComponentTouchEvent(
    ComponentTouchEvent.TOUCH_HOLD_MOVE_TYPE,
    touch,
    targetObj,
    null,
    event.getNativeEvent()
  );
  this.FireListener(touchHoldMoveEvent);
  event.preventDefault();
};

/**
 * Handler for the touch hover end.
 * @param {DvtTouchEvent} event Wrapper for the native event
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
TouchManager.prototype.HoverEndInternal = function (event, touch) {
  var identifier = touch.identifier;
  var info = this.getTouchInfo(identifier);
  var targetObj = info['currentObj'];
  var touchHoldEndEvent = new ComponentTouchEvent(
    ComponentTouchEvent.TOUCH_HOLD_END_TYPE,
    touch,
    targetObj,
    null,
    event.getNativeEvent()
  );
  this.FireListener(touchHoldEndEvent);
  if (event) event.preventDefault();
};

/**
 * Reset touch hold
 */
TouchManager.prototype.resetTouchHold = function () {
  this._startSingleFingerTouchId = null;
  this._stopTouchHoldTimer();
};

/**
 * Updates state information for current touches before logical event "bubbles"
 * @param {DvtTouchEvent} touchEvent Touch event
 */
TouchManager.prototype.preEventBubble = function (touchEvent) {
  if (touchEvent.setTouchManager) touchEvent.setTouchManager(this);

  var type = touchEvent.type;
  if (type == TouchEvent.TOUCHSTART) {
    this.processTouchStart(touchEvent);
  } else if (type == TouchEvent.TOUCHMOVE) {
    this.processTouchMove(touchEvent);
  } else if (type == TouchEvent.TOUCHEND) {
    this.processTouchEnd(touchEvent);
  }
};

// Updates state information after logical event is done "bubbling"
TouchManager.prototype.postEventBubble = function (touchEvent) {
  var type = touchEvent.type;

  if (type == TouchEvent.TOUCHSTART) {
  } else if (type == TouchEvent.TOUCHMOVE) {
  } else if (type == TouchEvent.TOUCHEND) {
    var changedTouches = this._getStoredTouches(touchEvent.changedTouches);
    for (var i = 0; i < changedTouches.length; i++) {
      var changedTouch = changedTouches[i];
      var identifier = changedTouch.identifier;

      delete this._touchMap[identifier];
      if (this._startSingleFingerTouchId == identifier) {
        this._startSingleFingerTouchId = null;
      }
      // Stop propagation may not allow touch manager to clear saved touch info.  Need to check for any remaining
      // info and remove
      var savedMatches = this._findMatches('touchId', identifier);
      for (var j = 0; j < savedMatches.length; j++) {
        var match = savedMatches[j];
        this.removeTooltipInfo(match['touchId'], match['touchObj']);
      }
    }
  }
};

TouchManager.prototype.saveProcessedTouch = function (
  touchId,
  touchObj,
  tooltipObjOverride,
  grouping,
  type,
  moveListener,
  endListener,
  listenerObj
) {
  if (touchId != null && !isNaN(touchId)) {
    var info = TouchManager.createSavedTouchInfo(
      touchId,
      touchObj,
      tooltipObjOverride,
      grouping,
      type,
      moveListener,
      endListener,
      listenerObj
    );
    this._savedTouchInfo.push(info);
    return true;
  }
  return false;
};

TouchManager.prototype.cancelTouchHold = function () {
  var uniqueKey = TouchManager.HOVER_TOUCH_KEY;
  var touchIds = this.getTouchIdsForObj(uniqueKey);
  for (var i = 0; i < touchIds.length; i++) {
    var touchId = touchIds[i];
    var info = this.getTouchInfo(touchId);
    var touch = info['startTouch'];
    if (touch) {
      this._isCancelEvent = true;
      this.performAssociatedTouchEnd(touch, uniqueKey, null);
      this._isCancelEvent = false;
      delete this._touchMap[touchId];
    }
  }
};

/**
 * Processes a touch end event
 * @param {object} touch The touch info object
 * @param {string} uniqueKey The touch id
 * @param {TouchEvent} event The touch event to process
 */
TouchManager.prototype.performAssociatedTouchEnd = function (touch, uniqueKey, event) {
  var identifier = touch.identifier;
  var savedInfoObjs = this._getSavedTouchInfo(identifier, uniqueKey);
  for (var i = 0; i < savedInfoObjs.length; i++) {
    var savedInfo = savedInfoObjs[i];
    var listenerObj = savedInfo['listenerObj'];
    var endListener = savedInfo['endListener'];

    // Remove tooltip info first
    this.removeTooltipInfo(identifier, uniqueKey);
    if (endListener) {
      endListener.call(listenerObj, event, touch, savedInfo);
    }
  }
};

TouchManager.prototype.processAssociatedTouchAttempt = function (
  event,
  uniqueKey,
  startListener,
  listenerObj
) {
  var touches = event.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (touch) {
      if (startListener) startListener.call(listenerObj, event, touch);
    }
  }
};

/**
 * Processes a touch move event
 * @param {TouchEvent} event The touch event to process
 * @param {string} uniqueKey The touch id
 */
TouchManager.prototype.processAssociatedTouchMove = function (event, uniqueKey) {
  var touchIds = this.getTouchIdsForObj(uniqueKey);
  for (var i = 0; i < touchIds.length; i++) {
    var touchId = touchIds[i];
    if (touchId != null && !isNaN(touchId)) {
      var touch = TouchManager.getTouchById(touchId, this._getStoredTouches(event.changedTouches));
      if (touch) {
        var savedInfoObjs = this._getSavedTouchInfo(touch.identifier, uniqueKey);
        for (var i = 0; i < savedInfoObjs.length; i++) {
          var savedInfo = savedInfoObjs[i];
          var listenerObj = savedInfo['listenerObj'];
          var moveListener = savedInfo['moveListener'];

          if (moveListener) moveListener.call(listenerObj, event, touch);
        }
      }
    }
  }
};

TouchManager.prototype.processAssociatedTouchEnd = function (event, uniqueKey) {
  var touchIds = this.getTouchIdsForObj(uniqueKey);
  for (var i = 0; i < touchIds.length; i++) {
    var touchId = touchIds[i];
    var touch = TouchManager.getTouchById(touchId, this._getStoredTouches(event.changedTouches));
    if (touch) {
      this.performAssociatedTouchEnd(touch, uniqueKey, event);
    }
  }
};

TouchManager.prototype._findMatches = function (matchProp, matchValue) {
  var results = new Array();
  for (var i = 0; i < this._savedTouchInfo.length; i++) {
    var info = this._savedTouchInfo[i];
    if (info[matchProp] == matchValue) {
      results.push(info);
    }
  }
  return results;
};

/**
 * Returns an array of touch info objects matching the unique key.
 * @param {string} touchId The touch info identifier
 * @param {string} uniqueKey The id used to find the matching touch info
 * @return {array}
 * @private
 */
TouchManager.prototype._getSavedTouchInfo = function (touchId, uniqueKey) {
  var matches = this._findMatches('touchId', touchId);
  var touchInfoObjs = [];
  for (var i = 0; i < matches.length; i++) {
    var info = matches[i];
    if (info['touchObj'] == uniqueKey) {
      touchInfoObjs.push(info);
    }
  }
  return touchInfoObjs;
};

TouchManager.prototype.getTouchIdsForObj = function (touchObj) {
  var results = new Array();
  var matches = this._findMatches('touchObj', touchObj);
  for (var i = 0; i < matches.length; i++) {
    var info = matches[i];
    var touchId = info['touchId'];
    results.push(touchId);
  }
  return results;
};

TouchManager.prototype.removeTooltipInfo = function (touchId, uniqueKey) {
  var matches = this._findMatches('touchId', touchId);
  var removeObjects = new Array();
  for (var i = 0; i < matches.length; i++) {
    var info = matches[i];
    if (info['touchObj'] == uniqueKey) {
      removeObjects.push(info);
    }
  }
  for (var i = 0; i < removeObjects.length; i++) {
    var removeObj = removeObjects[i];
    var removeIdx = -1;
    for (var j = 0; j < this._savedTouchInfo.length; j++) {
      var info = this._savedTouchInfo[j];
      if (info == removeObj) {
        removeIdx = j;
      }
    }
    if (removeIdx != -1) {
      this._savedTouchInfo.splice(removeIdx, 1);
      if (this._savedTouchInfo.length == 0) {
        this._context.getTooltipManager().hideTooltip();
      }
    }
  }
};

TouchManager.prototype.setTooltipEnabled = function (touchId, enabled) {
  var tooltipInfoArray = this._savedTouchInfo;
  for (var i = 0; i < tooltipInfoArray.length; i++) {
    var tooltipInfo = tooltipInfoArray[i];
    var tooltipTouchId = tooltipInfo['touchId'];
    if (tooltipTouchId == touchId) {
      tooltipInfo['allowTooltips'] = enabled;
    }
  }
};

TouchManager.prototype.getTooltipInfo = function () {
  var tooltipInfoObj = new Object();
  var touchIds = new Array();
  var tooltipTarget = null;

  var firstGroup = null;
  var multipleGroups = false;

  var matches = this._findMatches('allowTooltips', true);
  for (var i = 0; i < matches.length; i++) {
    var tooltipInfo = matches[i];
    var touchId = tooltipInfo['touchId'];

    if (!firstGroup) {
      firstGroup = tooltipInfo['grouping'];
    } else {
      // Multiple groups are not supported for tooltips yet
      if (tooltipInfo['grouping'] != firstGroup) {
        multipleGroups = true;
      }
    }

    var tooltipObj;
    var touchInfo = this._touchMap[touchId];
    // By default, show tooltip for item under finger
    if (touchInfo) tooltipObj = touchInfo['currentObj'];
    // If an override is present, use this instead
    if (tooltipInfo['tooltipObjOverride']) {
      tooltipObj = tooltipInfo['tooltipObjOverride'];
    }

    touchIds.push(touchId);
    tooltipTarget = tooltipObj;
  }
  if (multipleGroups) touchIds = new Array();
  tooltipInfoObj['touchIds'] = touchIds;
  tooltipInfoObj['tooltipTarget'] = tooltipTarget;

  return tooltipInfoObj;
};

TouchManager.prototype.processTouchStart = function (touchEvent) {
  var changedTouches = touchEvent.changedTouches;
  var touches = touchEvent.touches;

  this._touchCount = touches.length;
  for (var i = 0; i < changedTouches.length; i++) {
    var changedTouch = changedTouches[i];
    var screenX = changedTouch.screenX;
    var screenY = changedTouch.screenY;
    var identifier = changedTouch.identifier;
    var targetObj = this._getObjFromTouch(changedTouch);
    var touchInfo = {
      x: screenX,
      y: screenY,
      prevX: screenX,
      prevY: screenY,
      pageX: changedTouch.pageX,
      pageY: changedTouch.pageY,
      prevPageX: changedTouch.pageX,
      prevPageY: changedTouch.pageY,
      dx: 0,
      dy: 0,
      fireClick: true,
      startTarget: targetObj,
      currentObj: targetObj,
      touchMoved: false,
      touchtype: null,
      startTouch: changedTouch
    };
    touchInfo[TouchManager.TOUCH_MODE] = TouchManager.TOUCH_MODE_DEFAULT;
    touchInfo['origx'] = screenX;
    touchInfo['origy'] = screenY;

    this._touchMap[identifier] = touchInfo;
  }

  // For now, keep the restriction of only one finger being able to be in hover mode at a time
  if (this._isHovering() || !this._isTouchHoldAllowed()) {
    touchEvent.blockTouchHold();
  }
  return true;
};

TouchManager.prototype._isTouchHoldAllowed = function () {
  var touchMoved = false;
  var count = 0;
  for (var id in this._touchMap) {
    var info = this.getTouchInfo(id);
    if (info['touchMoved']) touchMoved = true;
    count++;
  }
  if (count > 1 && !touchMoved) {
    this.resetTouchHold();
    return false;
  }
  return true;
};

TouchManager.prototype._isHovering = function () {
  for (var id in this._touchMap) {
    var info = this.getTouchInfo(id);
    if (info[TouchManager.TOUCH_MODE] == TouchManager.TOUCH_MODE_LONG_PRESS) {
      return true;
    }
  }
  return false;
};

TouchManager.prototype._getStoredTouches = function (touches) {
  var storedTouches = new Array();
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var touchid = touch.identifier;
    var info = this.getTouchInfo(touchid);
    if (info) {
      storedTouches.push(touch);
    }
  }
  return storedTouches;
};

/**
 * Process touch move event
 * @param {DvtTouchEvent} touchEvent Dvt touch move event
 * @return {boolean} true if the touch move event is processed successfully
 */
TouchManager.prototype.processTouchMove = function (touchEvent) {
  var changedTouches = this._getStoredTouches(touchEvent.changedTouches);
  var touches = this._getStoredTouches(touchEvent.touches);

  for (var i = 0; i < changedTouches.length; i++) {
    var touch = changedTouches[i];
    var targetObj = this._getObjFromTouch(touch);
    var touchid = touch.identifier;
    var info = this.getTouchInfo(touchid);

    info['currentObj'] = targetObj;
    info['touchMoved'] = true;
    // If the single finger touch id moves, don't attempt a touch hold
    if (info[TouchManager.TOUCH_MODE] != TouchManager.TOUCH_MODE_LONG_PRESS) {
      var pageDx = Math.abs(info['pageX'] - touch.pageX);
      var pageDy = Math.abs(info['pageY'] - touch.pageY);

      // Reset touch hold
      if (this._startSingleFingerTouchId == touchid && (pageDx > 0 || pageDy > 0))
        this.resetTouchHold();
      // Ignore any touch move less than 3px, decreasing sensitivity for recognizing tap
      info['touchMoved'] = pageDx > 3 || pageDy > 3;
    }

    // If the move ever goes out of the initial object and we are not currently executing a marquee, don't fire a click
    // : Marquee (currently applicable to chart only) is excluded because this check assumes the elements to be compared
    // are already rendered, and the marquee object is dynamically added after receiving a touch move event.
    // DvtChartEventManager will handle resetting the state of the touch manager if we do not want to fire a click.
    if (
      info['touchMoved'] ||
      (info['fireClick'] &&
        info[TouchManager.TOUCH_MODE] != TouchManager.TOUCH_MODE_LONG_PRESS &&
        info['currentObj'] != info['startTarget'] &&
        info['currentObj'] != this._eventManager.getMarqueeGlassPane())
    ) {
      info['fireClick'] = false;
    }
  }

  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var identifier = touch.identifier;
    var info = this.getTouchInfo(identifier);
    var screenX = touch.screenX;
    var screenY = touch.screenY;
    var deltaX = screenX - info['x'];
    var deltaY = screenY - info['y'];

    info['prevX'] = info['x'];
    info['prevY'] = info['y'];
    info['dx'] = deltaX;
    info['dy'] = deltaY;
    info['x'] = screenX;
    info['y'] = screenY;
    info['prevPageX'] = info['pageX'];
    info['prevPageY'] = info['pageY'];
    info['pageX'] = touch.pageX;
    info['pageY'] = touch.pageY;
  }
  return true;
};

TouchManager.prototype.processTouchEnd = function (touchEvent) {
  var changedTouches = touchEvent.changedTouches;
  this._touchCount = touchEvent.touches.length;

  for (var i = 0; i < changedTouches.length; i++) {
    var touch = changedTouches[i];
    var targetObj = this._getObjFromTouch(touch);
    var touchid = touch.identifier;
    var info = this.getTouchInfo(touchid);
    if (!info) continue;
    if (info['fireClick']) {
      if (info[TouchManager.TOUCH_MODE] == TouchManager.TOUCH_MODE_LONG_PRESS) {
        this._startSingleFingerTouchId = null;
      } else {
        var sameTarget = targetObj == info['startTarget'];
        var touchMoved = info['touchMoved'];
        var fireClick = sameTarget && !touchMoved;
        info['fireClick'] = fireClick;
      }
    }
  }

  return true;
};

TouchManager.getTouchById = function (id, touches) {
  if (id != null && !isNaN(id)) {
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      if (touch.identifier == id) {
        return touch;
      }
    }
  }
  return null;
};

TouchManager.createSavedTouchInfo = function (
  touchId,
  touchObj,
  tooltipObjOverride,
  grouping,
  type,
  moveListener,
  endListener,
  listenerObj
) {
  var obj = {
    touchId: touchId,
    tooltipObjOverride: tooltipObjOverride,
    grouping: grouping,
    type: type,
    touchObj: touchObj,
    allowTooltips: true
  };
  obj['moveListener'] = moveListener;
  obj['endListener'] = endListener;
  obj['listenerObj'] = listenerObj;
  return obj;
};

/**
 * @private
 * Timer used for touch hold event
 */
TouchManager.prototype._handleTouchHoldStartTimer = function () {
  var event = this._dvtTouchEvent;
  this._stopTouchHoldTimer();
  this.startTouchHold(event);
};

/**
 * @private
 * Start touch hold timer
 * @param {DvtTouchEvent} evt  Wrapper for the native event
 */
TouchManager.prototype._startTouchHoldTimer = function (evt) {
  this._dvtTouchEvent = evt;
  if (this._touchHoldTimer) this._touchHoldTimer.start();
};

/**
 * @private
 * Stop touch hold timer
 */
TouchManager.prototype._stopTouchHoldTimer = function () {
  this._dvtTouchEvent = null;
  if (this._touchHoldTimer) this._touchHoldTimer.stop();
};

TouchManager.prototype._handleDoubleTapTimer = function () {
  this._context.oj.Logger.log('double tap timer expired');
  this.resetDoubleTap();
};

TouchManager.prototype.resetDoubleTap = function () {
  this._doubleTapAttemptStarted = false;
  this._doubleTapAttemptObj = null;
  this._doubleTapTimer.stop();
};

/**
 * Returns a map containing touch data for two finger touch events.
 * The map contins the following:
 * dz - The distance moved since the last touch event
 * cx - The current center of the two finger touch
 * dcx - The horizontal distance moved for the center of the two finger touch since the last touch event
 * dcy - The vertical distance moved for the center of the two finger touch since the last tch event
 */
TouchManager.prototype.getMultiTouchData = function (touchIds) {
  if (touchIds.length == 2) {
    var touch1Data = this._touchMap[touchIds[0]];
    var touch2Data = this._touchMap[touchIds[1]];
    if (touch1Data == null || touch2Data == null) return null;

    if (touch1Data['dx'] == 0 && touch2Data['dy'] == 0) return null;

    //: use page coords instead of screen coords, which the component can then turn into
    //stage-relative coords

    // current distance 2 fingers are apart
    var dx = touch1Data.pageX - touch2Data.pageX;
    var dy = touch1Data.pageY - touch2Data.pageY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // previous distance 2 fingers are apart
    var prevdx = touch1Data['prevPageX'] - touch2Data['prevPageX'];
    var prevdy = touch1Data['prevPageY'] - touch2Data['prevPageY'];
    var prevdist = Math.sqrt(prevdx * prevdx + prevdy * prevdy);

    var dz = dist - prevdist;

    // calculate the distance the center btwn the two fingers has moved
    var cx = (touch1Data.pageX + touch2Data.pageX) / 2;
    var cy = (touch1Data.pageY + touch2Data.pageY) / 2;
    var prevcx = (touch1Data['prevPageX'] + touch2Data['prevPageX']) / 2;
    var prevcy = (touch1Data['prevPageY'] + touch2Data['prevPageY']) / 2;
    var dcx = cx - prevcx;
    var dcy = cy - prevcy;

    return { dz: dz, cx: cx, cy: cy, dcx: dcx, dcy: dcy, dist: dist };
  }
  return null;
};

TouchManager.prototype.calcAveragePosition = function (touchIds) {
  var pointX = 0;
  var pointY = 0;
  var touchCount = touchIds.length;
  for (var i = 0; i < touchCount; i++) {
    var touchId = touchIds[i];
    var touchData = this.getTouchInfo(touchId);
    pointX += touchData.pageX;
    pointY += touchData.pageY;
  }
  pointX /= touchCount;
  pointY /= touchCount;
  return new Point(pointX, pointY);
};

/**
 * Returns an array of start targets for corresponding touch ids
 * @param {array} touchIds An array of touch ids
 * @return {array} An array of touch targets
 */
TouchManager.prototype.getStartTargetsByIds = function (touchIds) {
  var targets = new Array();
  for (var i = 0; i < touchIds.length; i++) {
    var touchData = this.getTouchInfo(touchIds[i]);
    targets.push(touchData['startTarget']);
  }
  return targets;
};

/**
 * Resets touch info, touch map and timers.
 */
TouchManager.prototype.reset = function () {
  this._touchMap = new Object();
  this._savedTouchInfo = new Array();
  this.resetTouchHold();
  this.resetDoubleTap();
};

/**
 * Factory class for component events to be fired to framework layers. Any changes to existing event payloads requires
 * search and update in the shared JS and all framework layers.
 */
const EventFactory = new Object();

Obj.createSubclass(EventFactory, Obj);

/**
 * Creates and returns an event object with the specified type. All events are represented as JSON objects.
 * @param {string} type The event type.
 * @param {string=} id The id of the event target, if applicable.
 * @return {object}
 */
EventFactory.newEvent = function (type, id) {
  var ret = { type: type };

  // Add the id if one was specified
  if (id) ret['id'] = id;

  return ret;
};

/**
 * A generic option change event. This should be considered whenever a new event is added. The JET layer will
 * handle this event by updating the specified key in the options. If the specified key is private, such as '_key', then
 * the options will be updated without triggering an option change event.
 * @param {string} key The name of the option to set.
 * @param {Object} value The value to set for the option.
 * @param {Object} optionMetadata (optional) The option metadata for the event.
 * @return {object}
 */
EventFactory.newOptionChangeEvent = function (key, value, optionMetadata) {
  var ret = EventFactory.newEvent('optionChange');
  ret['key'] = key;
  ret['value'] = value;
  ret['optionMetadata'] = optionMetadata;
  return ret;
};

/**
 * A generic render event. This can be used if a toolkit component needs to trigger a rerender from
 * the JET side.
 * @return {object}
 */
EventFactory.newRenderEvent = function () {
  return EventFactory.newEvent('dvtRender');
};

//***************************** Common Events ********************************/

/**
 * @param {string} category
 * @param {array} hiddenCategories The array of all currently hidden categories
 * @return {object}
 */
EventFactory.newCategoryHideEvent = function (category, hiddenCategories) {
  var ret = EventFactory.newEvent('categoryHide');
  ret['category'] = category;
  ret['hiddenCategories'] = hiddenCategories;
  return ret;
};

/**
 * @param {string} category
 * @param {array} hiddenCategories The array of all currently hidden categories
 * @return {object}
 */
EventFactory.newCategoryShowEvent = function (category, hiddenCategories) {
  var ret = EventFactory.newEvent('categoryShow');
  ret['category'] = category;
  ret['hiddenCategories'] = hiddenCategories;
  return ret;
};

/**
 * @param {object} categories The category or array of categories that are the target of the event.
 * @param {boolean} bOver
 * @return {object}
 */
EventFactory.newCategoryHighlightEvent = function (categories, bOver) {
  var ret = EventFactory.newEvent('categoryHighlight');

  // Private property for use within the toolkit.
  ret['_highlightType'] = bOver ? 'over' : 'out';

  // Ensure that the categories is an array for easy uptake
  categories = categories || [];
  ret['categories'] = !(categories instanceof Array) ? [categories] : categories;

  // Create the option change event
  return ret;
};

/**
 * @param {string} id The id of the target.
 * @param {string} subType the subType of the drillEvent; used in chart
 * @return {object}
 */
EventFactory.newDrillEvent = function (id, subType) {
  var event = EventFactory.newEvent('drill', id);
  if (subType) {
    event['subType'] = subType;
  }
  return event;
};

/**
 * @return {object}
 */
EventFactory.newReadyEvent = function () {
  return EventFactory.newEvent('ready');
};

/**
 * @param {array} selection
 * @return {object}
 */
EventFactory.newSelectionEvent = function (selection) {
  var ret = EventFactory.newEvent('selection');
  ret['selection'] = selection;
  return ret;
};

/**
 * @param {object} nativeEvent
 * @return {object}
 */
EventFactory.newTouchHoldReleaseEvent = function (nativeEvent) {
  var ret = EventFactory.newEvent('touchHoldRelease');
  ret['nativeEvent'] = nativeEvent;
  return ret;
};

/**
 * @param {number} oldValue
 * @param {number} newValue
 * @param {boolean} bComplete true if the interaction is complete.
 * @return {object}
 */
EventFactory.newValueChangeEvent = function (oldValue, newValue, bComplete) {
  var ret = EventFactory.newEvent('valueChange');
  ret['oldValue'] = oldValue;
  ret['newValue'] = newValue;
  ret['complete'] = bComplete;
  return ret;
};

/**
 * @param {string} type actionTooltipClosed|actionTooltipStarted
 * @param {dvt.Displayable} target
 * @return {object}
 */
EventFactory.newActionTooltipEvent = function (type, target) {
  var ret = EventFactory.newEvent(type);
  ret['target'] = target;
  return ret;
};

/**
 * @param {string} subtype panStart|panMove|panEnd|pinchStart|pinchMove|pinchEnd|zoom
 * @param {number} dxMin The delta of the xMin.
 * @param {number} dxMax The delta of the xMax.
 * @param {number} dyMin The delta of the yMin.
 * @param {number} dyMax The delta of the yMax.
 * @param {number=} dxMinTotal The total delta of the xMin (relative to the beginning of action).
 * @param {number=} dxMaxTotal The total delta of the xMax (relative to the beginning of action).
 * @param {number=} dyMinTotal The total delta of the yMin (relative to the beginning of action).
 * @param {number=} dyMaxTotal The total delta of the yMax (relative to the beginning of action).
 * @return {object}
 */
EventFactory.newPanZoomEvent = function (
  subtype,
  dxMin,
  dxMax,
  dyMin,
  dyMax,
  dxMinTotal,
  dxMaxTotal,
  dyMinTotal,
  dyMaxTotal
) {
  var ret = EventFactory.newEvent('dvtPanZoom');
  ret.subtype = subtype;
  ret.dxMin = dxMin;
  ret.dxMax = dxMax;
  ret.dyMin = dyMin;
  ret.dyMax = dyMax;
  ret.dxMinTotal = dxMinTotal;
  ret.dxMaxTotal = dxMaxTotal;
  ret.dyMinTotal = dyMinTotal;
  ret.dyMaxTotal = dyMaxTotal;
  return ret;
};

//************************ Component Specific Events *************************/

/**
 * @param {string} subtype move|end
 * @param {number} newMin The new scrollbar minimum.
 * @param {number} newMax The new scrollbar maximum.
 * @return {object}
 */
EventFactory.newSimpleScrollbarEvent = function (subtype, newMin, newMax) {
  var ret = EventFactory.newEvent('dvtSimpleScrollbar');
  ret.subtype = subtype;
  ret.newMin = newMin;
  ret.newMax = newMax;
  return ret;
};

/**
 * @param {string} subtype dropCallback|scrollTime|scrollPos|scrollEnd|rangeChange|rangeChanging
 * @param {number} newX1
 * @param {number} newX2
 * @param {number} newY1
 * @param {number} newY2
 * @param {number} oldX1
 * @param {number} oldX2
 * @param {number} oldY1
 * @param {number} oldY2
 * @return {object}
 */
EventFactory.newOverviewEvent = function (
  subtype,
  newX1,
  newX2,
  newY1,
  newY2,
  oldX1,
  oldX2,
  oldY1,
  oldY2
) {
  var ret = EventFactory.newEvent('overview');
  ret.subtype = subtype;
  ret.newX1 = newX1;
  ret.newX2 = newX2;
  ret.newY1 = newY1;
  ret.newY2 = newY2;
  ret.oldX1 = oldX1;
  ret.oldX2 = oldX2;
  ret.oldY1 = oldY1;
  ret.oldY2 = oldY2;
  return ret;
};

/**
 * @param {string} id The id of the target.
 * @param {string} series The series of the target.
 * @param {string} group The group of the target.
 * @param {string} subType The subType of the drill Event.
 * @return {object}
 */
EventFactory.newChartDrillEvent = function (id, series, group, subType) {
  var ret = EventFactory.newDrillEvent(id, subType);
  ret['series'] = series;
  ret['group'] = group;
  return ret;
};

/**
 * @param {array} selection The array of currently selected ids for the component.
 * @param {boolean} bComplete true if the interaction is complete.
 * @param {number=} xMin The xMin of the marquee bounds (only applies to marquee selection).
 * @param {number=} xMax The xMax of the marquee bounds (only applies to marquee selection).
 * @param {string=} startGroup The first group that is included in the bounds (only applies to marquee selection).
 * @param {string=} endGroup The last group that is included in the bounds (only applies to marquee selection).
 * @param {number=} yMin The yMin of the marquee bounds (only applies to marquee selection).
 * @param {number=} yMax The yMax of the marquee bounds (only applies to marquee selection).
 * @param {number=} y2Min The y2Min of the marquee bounds (only applies to marquee selection).
 * @param {number=} y2Max The y2Max of the marquee bounds (only applies to marquee selection).
 * @return {object}
 */
EventFactory.newChartSelectionEvent = function (
  selection,
  bComplete,
  xMin,
  xMax,
  startGroup,
  endGroup,
  yMin,
  yMax,
  y2Min,
  y2Max
) {
  var ret = EventFactory.newSelectionEvent(selection);
  ret['complete'] = bComplete;
  ret['xMin'] = xMin;
  ret['xMax'] = xMax;
  ret['startGroup'] = startGroup;
  ret['endGroup'] = endGroup;
  ret['yMin'] = yMin;
  ret['yMax'] = yMax;
  ret['y2Min'] = y2Min;
  ret['y2Max'] = y2Max;
  return ret;
};

/**
 * @param {boolean} bComplete true if the interaction is complete.
 * @param {number=} xMin The xMin of the viewport.
 * @param {number=} xMax The xMax of the viewport.
 * @param {string=} startGroup The first group that is included in the viewport.
 * @param {string=} endGroup The last group that is included in the viewport.
 * @param {number=} yMin The yMin of the viewport.
 * @param {number=} yMax The yMax of the viewport.
 * @return {object}
 */
EventFactory.newChartViewportChangeEvent = function (
  bComplete,
  xMin,
  xMax,
  startGroup,
  endGroup,
  yMin,
  yMax
) {
  var ret = EventFactory.newEvent('viewportChange');
  ret['complete'] = bComplete;
  ret['xMin'] = xMin;
  ret['xMax'] = xMax;
  ret['startGroup'] = startGroup;
  ret['endGroup'] = endGroup;
  ret['yMin'] = yMin;
  ret['yMax'] = yMax;
  return ret;
};

/**
 * @param {string} subtype start|move|end
 * @param {number} x Marquee x.
 * @param {number} y Marquee y.
 * @param {number} w Marquee w.
 * @param {number} h Marquee h.
 * @param {boolean} ctrlKey Whether the ctrl key is pressed.
 * @return {object}
 */
EventFactory.newMarqueeEvent = function (subtype, x, y, w, h, ctrlKey) {
  var ret = EventFactory.newEvent('dvtMarquee');
  ret.subtype = subtype;
  ret.x = x;
  ret.y = y;
  ret.w = w;
  ret.h = h;
  ret.ctrlKey = ctrlKey;
  return ret;
};

/**
 * expand/collapse event
 * @param {string} type The event type.
 * @param {string} id The id of the node.
 * @param {object} data The data object of the node.
 * @param {object} component The widget constructor.
 * @param {array} expanded The expanded nodes array.
 * @return {object}
 */
EventFactory.newExpandCollapseEvent = function (type, id, data, component, expanded) {
  var ret = EventFactory.newEvent(type, id);
  ret['expanded'] = expanded;
  ret['data'] = data;
  ret['component'] = component;
  return ret;
};

/**
 * Tree drill event
 * @param {string} id The id of the node.
 * @param {number} data The data value of the node.
 * @param {object} component The widget constructor.
 * @return {object}
 */
EventFactory.newTreeDrillEvent = function (id, data, component) {
  var ret = EventFactory.newDrillEvent(id);
  ret['data'] = data;
  ret['component'] = component;
  return ret;
};

/**
 * Breadcrumbs drill event
 * @param {string} id @param {string} id The id of the data item that was drilled.
 * @return {object}
 */
EventFactory.newBreadcrumbsDrillEvent = function (id) {
  var ret = EventFactory.newEvent('breadcrumbsDrill', id);
  return ret;
};

/**
 * @param {number} startAngle The start angle of the sunburst, in degrees.
 * @param {boolean} bComplete true if the interaction is complete.
 * @return {object}
 */
EventFactory.newSunburstRotationEvent = function (startAngle, bComplete) {
  var ret = EventFactory.newEvent('rotation');
  ret['complete'] = bComplete;

  // Adjust the angle so that it's always between 0 and 360
  ret['startAngle'] = startAngle % 360;
  return ret;
};

/**
 * @param {number} panX
 * @param {number} panY
 * @param {number} zoom
 * @return {object}
 **/
EventFactory.newThematicMapViewportChangeEvent = function (panX, panY, zoom) {
  var ret = EventFactory.newEvent('viewportChange');
  ret['panX'] = panX;
  ret['panY'] = panY;
  ret['zoom'] = zoom;
  return ret;
};

/**
 * @param {array} itemContexts
 * @param {string} value
 * @param {string} start
 * @param {string} end
 * @return {object}
 **/
EventFactory.newTimelineMoveEvent = function (itemContexts, value, start, end) {
  var ret = EventFactory.newEvent('move');
  ret['itemContexts'] = itemContexts;
  ret['value'] = value;
  ret['start'] = start;
  ret['end'] = end;
  return ret;
};

/**
 * @param {array} itemContexts
 * @param {string} value
 * @param {string} start
 * @param {string} end
 * @param {string} type
 * @return {object}
 **/
EventFactory.newTimelineResizeEvent = function (itemContexts, value, start, end, type) {
  var ret = EventFactory.newEvent('resize');
  ret['itemContexts'] = itemContexts;
  ret['value'] = value;
  ret['start'] = start;
  ret['end'] = end;
  ret['typeDetail'] = type;
  return ret;
};

/**
 * @param {number} viewportStart The start value of the viewport.
 * @param {number} viewportEnd The end value of the viewport.
 * @param {string} minorAxisScale The scale value of the minor axis.
 * @return {object}
 **/
EventFactory.newTimelineViewportChangeEvent = function (
  viewportStart,
  viewportEnd,
  minorAxisScale
) {
  var ret = EventFactory.newEvent('viewportChange');
  ret['viewportStart'] = viewportStart;
  ret['viewportEnd'] = viewportEnd;
  ret['minorAxisScale'] = minorAxisScale;
  return ret;
};

/**
 * @param {number} viewportStart The start value of the viewport.
 * @param {number} viewportEnd The end value of the viewport.
 * @param {string} majorAxisScale The scale value of the major axis.
 * @param {string} minorAxisScale The scale value of the minor axis.
 * @return {object}
 **/
EventFactory.newGanttViewportChangeEvent = function (
  viewportStart,
  viewportEnd,
  majorAxisScale,
  minorAxisScale
) {
  var ret = EventFactory.newTimelineViewportChangeEvent(viewportStart, viewportEnd, minorAxisScale);
  ret['majorAxisScale'] = majorAxisScale;
  return ret;
};

/**
 * @param {array} taskContexts
 * @param {string} value
 * @param {string} start
 * @param {string} end
 * @param {string} baselineStart
 * @param {string} baselineEnd
 * @param {object} rowContext
 * @return {object}
 **/
EventFactory.newGanttMoveEvent = function (
  taskContexts,
  value,
  start,
  end,
  baselineStart,
  baselineEnd,
  rowContext
) {
  var ret = EventFactory.newEvent('move');
  ret['taskContexts'] = taskContexts;
  ret['value'] = value;
  ret['start'] = start;
  ret['end'] = end;
  ret['baselineStart'] = baselineStart;
  ret['baselineEnd'] = baselineEnd;
  ret['rowContext'] = rowContext;
  return ret;
};

/**
 * @param {array} taskContexts
 * @param {string} value
 * @param {string} start
 * @param {string} end
 * @param {string} type
 * @return {object}
 **/
EventFactory.newGanttResizeEvent = function (taskContexts, value, start, end, type) {
  var ret = EventFactory.newEvent('resize');
  ret['taskContexts'] = taskContexts;
  ret['value'] = value;
  ret['start'] = start;
  ret['end'] = end;
  ret['typeDetail'] = type;
  return ret;
};

/**
 * @param {number} y
 * @param {number} rowIndex
 * @param {number} offsetY
 * @return {object}
 */
EventFactory.newGanttScrollPositionChangeEvent = function (y, rowIndex, offsetY) {
  var ret = EventFactory.newEvent('scrollPositionChange');
  ret['y'] = y;
  ret['rowIndex'] = rowIndex;
  ret['offsetY'] = offsetY;
  return ret;
};

/**
 * expand/collapse event
 * @param {string} type The event type.
 * @param {*} id The id of the target.
 * @param {object} rowData The data object of the row.
 * @param {object} itemData The data provider row data object.
 * @param {*} expanded The new expanded KeySet.
 * @return {object}
 */
EventFactory.newGanttExpandCollapseEvent = function (type, id, rowData, itemData, expanded) {
  var ret = EventFactory.newEvent(type, id);
  ret['rowData'] = rowData;
  ret['itemData'] = itemData;
  ret['expanded'] = expanded;
  return ret;
};

/**
 * @param {string} id The id of the currently isolated node.
 * @return {object}
 */
EventFactory.newTreemapIsolateEvent = function (id) {
  return EventFactory.newEvent('isolate', id);
};

/**
 * @param {string}  subtype  dragPanBegin|dragPanEnd|panning|panned|elasticAnimBegin|elasticAnimEnd
 * @param {number}  newX  new x-coord
 * @param {number}  newY  new y-coord
 * @param {number}  oldX  old x-coord
 * @param {number}  oldY  old y-coord
 * @param {dvt.Animator}  animator  optional animator used to animate the zoom
 * @param {number}  zoom zoom value
 * @return {object}
 */
EventFactory.newPanEvent = function (subtype, newX, newY, oldX, oldY, animator, zoom) {
  var ret = EventFactory.newEvent('dvtPan');
  ret.subtype = subtype;
  ret.newX = newX;
  ret.newY = newY;
  ret.oldX = oldX;
  ret.oldY = oldY;
  ret.animator = animator;
  ret.zoom = zoom;
  return ret;
};

/**
 * @param {string}  subtype  zooming|zoomed|zoomEnd|dragZoomBegin|dragZoomEnd|zoomAndCenter|zoomToFitBegin|zoomToFitEnd|elasticAnimBegin|elasticAnimEnd|adjustPanConstraints
 *                           The difference between "zoomed" and "zoomEnd" is on touch device. A component gets "zoomed" events for appropriate
 *                           "touchmove" events. When all touches are released on "touchend"  the component will get "zoomEnd" notification.
 *                           "adjustPanConstraints" is fired right before "zooming" to give components a chance to adjust the pan constraints.
 * @param {number}  newZoom  new zoom factor
 * @param {number}  oldZoom  old zoom factor
 * @param {dvt.Animator}  animator  optional animator used to animate the zoom
 * @param {dvt.Point}  centerPoint  center of zoom
 * @param {dvt.Point} pos optional current position of component
 * @param {boolean} panAndZoom if true, both zoom + pan changes are occurring
 * @return {object}
 */
EventFactory.newZoomEvent = function (
  subtype,
  newZoom,
  oldZoom,
  animator,
  centerPoint,
  pos,
  panAndZoom
) {
  var ret = EventFactory.newEvent('dvtZoom');
  ret.subtype = subtype;
  ret.newZoom = newZoom;
  ret.oldZoom = oldZoom;
  ret.animator = animator;
  ret.centerPoint = centerPoint;
  ret.pos = pos;
  ret.panAndZoom = !!panAndZoom;
  return ret;
};

/**
 * @param {string} subtype highlight|unhighlight|selection
 * @param {any} itemId
 * @param {boolean=} isMultiSelect
 * @return {object}
 */
EventFactory.newTimelineOverviewEvent = function (subtype, itemId, isMultiSelect) {
  var ret = EventFactory.newEvent('timeline');
  ret.subtype = subtype;
  ret.itemId = itemId;
  ret.isMultiSelect = isMultiSelect;
  return ret;
};

/**
 * 2D map implementation for use in improving performance.  Alternate implementation options may be added in
 * the future as needed.
 * @class Map2D
 * @extends {dvt.Obj}
 * @constructor
 */
const Map2D = function () {
  this.Init();
};

Obj.createSubclass(Map2D, Obj);

/**
 * Initializes the map and its underlying data structures.
 */
Map2D.prototype.Init = function () {
  this._map = {};
};

/**
 * Retrieves the value corresponding to the keys from the map.
 * @param {object} keyA
 * @param {object} keyB
 * @return {object}
 */
Map2D.prototype.get = function (keyA, keyB) {
  return this._getInnerMap(keyA)[keyB];
};

/**
 * Stores the value corresponding to the keys in the map.
 * @param {object} keyA
 * @param {object} keyB
 * @param {object} value
 * @return {object} The previous value, if one existed.
 */
Map2D.prototype.put = function (keyA, keyB, value) {
  var innerMap = this._getInnerMap(keyA);
  var oldValue = innerMap[keyB];
  innerMap[keyB] = value;
  return oldValue;
};

/**
 * Returns the inner map corresponding to the specified key, creating it if necessary.
 * @param {object} keyA
 * @return {object} The inner map.
 * @private
 */
Map2D.prototype._getInnerMap = function (keyA) {
  var innerMap = this._map[keyA];
  if (!innerMap) {
    innerMap = {};
    this._map[keyA] = innerMap;
  }
  return innerMap;
};

// DvtBaseComponentCache.js
//
//
//    NAME
//     DvtBaseComponentCache.js
//
//    DESCRIPTION
//    Cache instance for dvt components to use
//
//    MODIFIED  (MM/DD/YY)
//         04/16/16 - Created

/**
 * Cache for JSON components.
 * @class
 * @constructor
 */
const BaseComponentCache = function () {
  this.Init();
};

/**
 * Initializes the cache.
 * @protected
 */
BaseComponentCache.prototype.Init = function () {
  /**
   * Reference to the internal cache object.
   * @type {Object}
   * @protected
   */
  this.Cache = {};
};

/**
 * Initialize/clear the component cache.
 */
BaseComponentCache.prototype.clearCache = function () {
  this.Cache = {};
};

/**
 * Retrieves the value corresponding to the key from the component cache.
 * @param {object} key
 * @return {object}
 */
BaseComponentCache.prototype.getFromCache = function (key) {
  return this.Cache[key];
};

/**
 * Stores the value corresponding to the key in the component cache.
 * @param {object} key
 * @param {object} value
 */
BaseComponentCache.prototype.putToCache = function (key, value) {
  this.Cache[key] = value;
};

/**
 * Retrieves the value corresponding to itemKey from the cached map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKey
 * @return {object}
 */
BaseComponentCache.prototype.getFromCachedMap = function (mapKey, itemKey) {
  return this._getCachedMap(mapKey)[itemKey];
};

/**
 * Retrieves the cached map corresponding to mapKey.
 * @param {object} mapKey
 * @return {object}
 *
 * @private
 */
BaseComponentCache.prototype._getCachedMap = function (mapKey) {
  var map = this.getFromCache(mapKey);
  if (!map) {
    map = {};
    this.putToCache(mapKey, map);
  }
  return map;
};

/**
 * Stores the value corresponding to itemKey to the cached map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKey
 * @param {object} value
 */
BaseComponentCache.prototype.putToCachedMap = function (mapKey, itemKey, value) {
  this._getCachedMap(mapKey)[itemKey] = value;
};

/**
 * Retrieves the value corresponding to (itemKeyA, itemKeyB) from the cached 2D map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKeyA
 * @param {object} itemKeyB
 * @return {object}
 */
BaseComponentCache.prototype.getFromCachedMap2D = function (mapKey, itemKeyA, itemKeyB) {
  var map = this._getCachedMap2D(mapKey);
  return map.get(itemKeyA, itemKeyB);
};

/**
 * Retrieves the cached 2D map corresponding to mapKey.
 * @param {object} mapKey
 * @return {object}
 *
 * @private
 */
BaseComponentCache.prototype._getCachedMap2D = function (mapKey) {
  var map = this.getFromCache(mapKey);
  if (!map) {
    map = new Map2D();
    this.putToCache(mapKey, map);
  }
  return map;
};

/**
 * Stores the value corresponding to (itemKeyA, itemKeyB) to the cached 2D map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKeyA
 * @param {object} itemKeyB
 * @param {object} value
 */
BaseComponentCache.prototype.putToCachedMap2D = function (mapKey, itemKeyA, itemKeyB, value) {
  var map = this._getCachedMap2D(mapKey);
  map.put(itemKeyA, itemKeyB, value);
};

const ResourceUtils = {
  /**
   * Substitutes the replacement objects into the specified pattern.
   * @param {string} pattern The pattern string with placeholders.
   * @param {array} replacements The array of replacement strings.
   * @return {string} The resulting string.
   */
  format: function (pattern, replacements) {
    return pattern
      ? pattern.replace(/\{(\d+)\}/g, function () {
          return replacements[arguments[1]];
        })
      : pattern;
  }
};

/**
 * JSON utilities.
 * @class
 */
const JsonUtils = new Object();

Obj.createSubclass(JsonUtils, Obj);

/**
 * Returns a deep clone of the object.
 * @param {object} obj The object to clone.
 * @param {function} keyFunc An optional boolean-valued function that will be called for each key.  If the function returns false, the key will not be copied over
 * @param {object=} noClone List of keys to not clone.
 * @return {object} The clone.
 */
JsonUtils.clone = function (obj, keyFunc, noClone) {
  if (obj == null) return null;
  var ret = null;

  if (obj instanceof Array) {
    ret = [];

    // Loop through and copy the Array
    for (var i = 0; i < obj.length; i++) {
      if (JsonUtils._isDeepClonable(obj[i]))
        // deep clone objects
        ret[i] = JsonUtils.clone(obj[i], keyFunc, noClone);
      // copy values
      else ret[i] = obj[i];
    }
  } else if (obj instanceof CSSStyle) {
    ret = obj.clone();
  } else if (obj instanceof Date) {
    // convert Date to time millis
    ret = obj.getTime();
  } else if (JsonUtils._isClonableObject(obj)) {
    ret = {};

    // Loop through all properties of the object
    for (var key in obj) {
      if (!keyFunc || keyFunc(key)) {
        var value = obj[key];
        if (
          !(noClone && noClone[key] == true) &&
          JsonUtils._isDeepClonable(value) &&
          key != '_widgetConstructor'
        ) {
          // deep clone objects
          var subNoClone = noClone ? noClone[key] : null;
          ret[key] = JsonUtils.clone(value, keyFunc, subNoClone);
        } // copy values
        else ret[key] = value;
      }
    }
  }

  return ret;
};

/**
 * Returns a new object with the merged properties of the given objects.  Properties
 * in the first object take precedence.
 * @param {object} a
 * @param {object} b
 * @param {object=} noClone an object of keys not to be cloned.
 * @return {object} A new object containing the merged properties.
 */
JsonUtils.merge = function (a, b, noClone) {
  // Clone so that contents aren't modified
  var one = a && a._dvtNoClone ? a : JsonUtils.clone(a, null, noClone);
  if (b && b._dvtNoClone) {
    throw new Error('Do not merge because content will be modified.');
  }
  var two = JsonUtils.clone(b, null, noClone);
  if (one == null) return two;
  if (two == null && one._dvtNoClone) {
    throw new Error('Do not return an uncloned object.');
  } else if (two == null) return one;
  else {
    JsonUtils._copy(one, two);
    return two;
  }
};

/**
 * Copys the properties from the first object onto the second.
 * @param {object} a The source of the properties to copy.
 * @param {object} b The destination of the copied properties.
 * @private
 */
JsonUtils._copy = function (a, b) {
  for (var key in a) {
    var value = a[key];
    // Treat an 'undefined' value as if the key were not set and ignore
    if (value === undefined) continue;

    if ((value && value instanceof Array) || key == '_widgetConstructor') {
      // Copy the array over, since we don't want arrays to be merged
      // We also don't want the widget constructor to be copied/cloned
      b[key] = value;
    } else if (b[key] && b[key] instanceof CSSStyle) {
      // If an object is defined as CSS in the base object, merge the CSS
      if (value instanceof CSSStyle) b[key].merge(value);
      // value is String
      else b[key].merge(new CSSStyle(value));
    } else if (JsonUtils._isDeepClonable(value)) {
      // Deep clone if object exists in b, copy otherwise
      if (b[key]) JsonUtils._copy(value, b[key]);
      else b[key] = value;
    } else b[key] = value;
  }
};

/**
 * Checks the type of an object and returns whether it is deep clonable
 * @param {Object} obj The object to check the type of
 * @return {boolean} Whether the object is deep clonable
 * @private
 */
JsonUtils._isDeepClonable = function (obj) {
  if (obj instanceof Object) {
    if (obj['has'])
      // key set
      return false;
    else if (obj._dvtNoClone) return false;

    return (
      !(obj instanceof Boolean) &&
      !(obj instanceof String) &&
      !(obj instanceof Number) &&
      !(obj instanceof Function) &&
      !obj.then
    );
  }
  return false;
};

/**
 * Checks the type of an object and returns whether it is supported for cloning. Returns false if object is not a JavaScript Object.
 * @param {Object} obj The object to check the type of
 * @return {boolean} Whether the object is supported
 * @private
 */
JsonUtils._isClonableObject = function (obj) {
  if (obj instanceof Object) {
    if (obj.then)
      // Promise
      return false;
    else if (obj.jquery)
      // JQuery Object
      return false;
    else if (obj['has'])
      // key set
      return false;
    else if (typeof NodeList != 'undefined' && obj instanceof NodeList)
      // DOM NodeList
      return false;
    else if (typeof Node != 'undefined' && obj instanceof Node)
      // DOM objects
      return false;
    else if (obj._dvtNoClone) return false;
    else return true;
  }
  return false;
};

/**
 * Read-only text object that supports wrapping.
 * @extends {Container}
 * @class MultilineText
 * @constructor
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {string} id
 * @param {boolean=} preserveNewLine If true, text will wrap only on new line characters
 */
const MultilineText = function (context, textStr, x, y, id, preserveNewLine) {
  this.Init(context, textStr, x, y, id, preserveNewLine);
};

Obj.createSubclass(MultilineText, Container);

/**
 * The space between lines expressed as a percentage of line height.
 * @private
 */
MultilineText._LINE_SPACE = 0;

// Horizontal Alignments
/** @const */
MultilineText.H_ALIGN_LEFT = 'left';
/** @const */
MultilineText.H_ALIGN_CENTER = 'center';
/** @const */
MultilineText.H_ALIGN_RIGHT = 'right';

// Vertical Alignments
/** @const */
MultilineText.V_ALIGN_TOP = 'top';
/** @const */
MultilineText.V_ALIGN_MIDDLE = 'middle';
/** @const */
MultilineText.V_ALIGN_CENTRAL = 'central';
/** @const */
MultilineText.V_ALIGN_BOTTOM = 'bottom';

/**
 * @param {dvt.Context} context
 * @param {string} textStr the text string
 * @param {number} x
 * @param {number} y
 * @param {string=} id The optional id for the corresponding DOM element.
 * @param {string=} preserveNewLine
 * @protected
 */
MultilineText.prototype.Init = function (context, textStr, x, y, id, preserveNewLine) {
  MultilineText.superclass.Init.call(this, context, null, id);

  /**
   * The primary text instance.  All properties are stored here.  If TextUtils.fitText is not called, the text will
   * appear as a single line using this instance.
   * @private
   */
  this._textInstance = null;

  /**
   * Any additional lines of text resulting from text wrapping.
   * @private
   */
  this._additionalLines = [];

  /** The height of a line of text.
   *  Useful for estimating or reserving vertical space for wrapped text
   *  @private
   */
  this._lineHeight = null;

  /** Store the yCoordinate set on the text.
   * getY() returns ycoordinate of primary text instance.
   * getYAlignCoord() returns ycoordinate used for vertical alignment
   * @private
   */
  this._yCoord = null;

  /** Flag for optimizing attempts to fit a MultilineText object.
   *  A layout algorithm can set the value to true if it figures out
   *  that it will not be possible to fit more than one line of text
   *  in the space available for the text.
   *  @private
   */
  this._noWrap = false;

  /** Flag for whether or not this text will wrap on new line characters.
   *  @private
   */
  this._preserveNewLine = preserveNewLine ? preserveNewLine : false;

  /** Optimizing preserveNewLine wrapping.
   *  Since the OutputTexts and their initial text strings will always be the
   *  same, we create them once when the textString is set.
   *  This avoids recreating them multiple times if a component needs to fit or
   *  wrap the MultilineText more than once.
   *  @private
   */
  this._preservedLines = [];

  // Apply properties
  this.setTextString(textStr);
  this.setX(x ? x : 0);
  this.setY(y ? y : 0);
  this.setMaxLines(Infinity);
};

/**
 * Returns the text string for this text object.  Unlike the implementation on OutputText, this always returns the
 * full and untruncated text string.
 * @return {string} the text string
 */
MultilineText.prototype.getTextString = function () {
  return this._textString;
};

/**
 * Specifies the text string for this text object.
 * @param {string} textString the text string
 */
MultilineText.prototype.setTextString = function (textString) {
  // Store the full string
  this._textString = textString != null ? String(textString) : null;

  if (!this._textInstance) {
    // Create the primary text instance.  This instance is used to store all properties.
    this._textInstance = new OutputText(this.getCtx(), this._textString);
    this.addChild(this._textInstance);
  } else {
    this._textInstance.setTextString(textString);
    // Remove any additional text lines
    this._removeAdditionalLines();
  }

  if (this._preserveNewLine) {
    // Create text objects based on \n split, and wrap text.
    this._generatePreservedLines();
    this.wrapText(Infinity, Infinity, 1, false);
  }

  // Since this is a new text string, truncation has not occurred
  this._bTruncated = false;
};

/**
 * Returns an array with pointers to all the lines in this MultilineText object
 * @return {Array} the lines in this object.
 * @private
 */
MultilineText.prototype._getTextLines = function () {
  var lines = this._additionalLines.slice();
  // Add this._textInstance unless it was removed by a fitText call
  if (this._textInstance.getParent() == this) {
    lines.unshift(this._textInstance);
  }
  return lines;
};

/**
 * Returns the x position for this text object.
 * @return {number} The x position.
 */
MultilineText.prototype.getX = function () {
  return this._textInstance.getX();
};

/**
 * Specifies the x position for this text object.
 * @param {number} x The x position
 * @return {MultilineText}
 */
MultilineText.prototype.setX = function (x) {
  this._getTextLines().forEach(function (entry) {
    entry.setX(x);
  });
  return this;
};

/**
 * Returns the y position for the primary instance of this text object.
 * @return {number} The y position.
 */
MultilineText.prototype.getY = function () {
  return this._textInstance.getY();
};

/** Returns the y position used for vertical alignment
 *  @return {number} The y position.
 */
MultilineText.prototype.getYAlignCoord = function () {
  return this._yCoord;
};

/**
 * Specifies the y position for this text object.
 * @param {number} y The y position
 * @return {MultilineText}
 */
MultilineText.prototype.setY = function (y) {
  this._yCoord = y;

  // If not using vertical align, use default alignment for the multiline text
  if (!this._vertAlign) {
    var yChange = y - this._textInstance.getY();
    if (!yChange) yChange = y;
    this._getTextLines().forEach(function (entry) {
      var yLine = entry.getY();
      entry.setY(yLine ? yLine + yChange : yChange);
    });
  } // Align each entry in reference to the yCoord based on it's alignment
  else this._alignVerticalText();

  return this;
};

/**
 * Returns the y position for this text object.
 * @return {number} The y position.
 */
MultilineText.prototype.getMaxLines = function () {
  return this.GetProperty('maxLines');
};

/**
 * Specifies the maximum number of lines to display when wrapped. Defaults to Infinity.
 * @param {number} maxLines
 * @return {MultilineText}
 */
MultilineText.prototype.setMaxLines = function (maxLines) {
  // Ignore values of 0 or less
  if (maxLines > 0) return this.SetProperty('maxLines', maxLines);
  return null;
};

/**
 * Returns true if this text instance has been truncated.
 * @return {boolean}
 */
MultilineText.prototype.isTruncated = function () {
  return this._bTruncated;
};

/**
 * Returns the horizontal alignment for this text object.  Valid constants begin with OutputText.H_ALIGN_.
 * @return {string}
 */
MultilineText.prototype.getHorizAlignment = function () {
  return this._textInstance.getHorizAlignment();
};

/**
 * Specifies the horizontal alignment for this text object.  Valid constants begin with OutputText.H_ALIGN_.
 * @param {string} align
 * @return {MultilineText}
 */
MultilineText.prototype.setHorizAlignment = function (align) {
  this._getTextLines().forEach(function (entry) {
    entry.setHorizAlignment(align);
  });
  return this;
};

/**
 * Aligns the left side of the text to the x coordinate. Note: This does not always correspond to what the browser
 * considers a "start" alignment, as we work around issues in rtl locales to provide a consistent API.
 */
MultilineText.prototype.alignLeft = function () {
  // No change in value, return
  if (this._horizAlign == MultilineText.H_ALIGN_LEFT) return;

  this._horizAlign = MultilineText.H_ALIGN_LEFT;

  this._getTextLines().forEach(function (entry) {
    entry.alignLeft();
  });
};

/**
 * Aligns the center of the text to the x coordinate.
 */
MultilineText.prototype.alignCenter = function () {
  // No change in value, return
  if (this._horizAlign == MultilineText.H_ALIGN_CENTER) return;

  this._horizAlign = MultilineText.H_ALIGN_CENTER;

  this._getTextLines().forEach(function (entry) {
    entry.alignCenter();
  });
};

/**
 * Aligns the right side of the text to the x coordinate. Note: This does not always correspond to what the browser
 * considers an "end" alignment, as we work around issues in rtl locales to provide a consistent API.
 */
MultilineText.prototype.alignRight = function () {
  // No change in value, return
  if (this._horizAlign == MultilineText.H_ALIGN_RIGHT) return;

  this._horizAlign = MultilineText.H_ALIGN_RIGHT;

  this._getTextLines().forEach(function (entry) {
    entry.alignRight();
  });
};

/**
 * Aligns the top side of the full text object to the y coordinate.
 */
MultilineText.prototype.alignTop = function () {
  // No change in value, return
  if (this._vertAlign == MultilineText.V_ALIGN_TOP) return;

  this._vertAlign = MultilineText.V_ALIGN_TOP;

  this._alignVerticalText();
  this._getTextLines().forEach(function (entry) {
    entry.alignTop();
  });

  return;
};

/**
 * Aligns the middle of the full text object to the y coordinate.
 */
MultilineText.prototype.alignMiddle = function () {
  // No change in value, return
  if (this._vertAlign == MultilineText.V_ALIGN_MIDDLE) return;

  this._vertAlign = MultilineText.V_ALIGN_MIDDLE;

  this._alignVerticalText();
  this._getTextLines().forEach(function (entry) {
    entry.alignMiddle();
  });

  return;
};

/**
 * Aligns the center of the full text object (above the baseline) to the y coordinate.
 */
MultilineText.prototype.alignCentral = function () {
  // No change in value, return
  if (this._vertAlign == MultilineText.V_ALIGN_CENTRAL) return;

  this._vertAlign = MultilineText.V_ALIGN_CENTRAL;

  this._alignVerticalText();
  this._getTextLines().forEach(function (entry) {
    entry.alignCentral();
  });

  return;
};

/**
 *  Aligns the bottom side of the full text object to the y coordinate.
 */
MultilineText.prototype.alignBottom = function () {
  // No change in value, return
  if (this._vertAlign == MultilineText.V_ALIGN_BOTTOM) return;

  this._vertAlign = MultilineText.V_ALIGN_BOTTOM;

  this._alignVerticalText();
  this._getTextLines().forEach(function (entry) {
    entry.alignBottom();
  });

  return;
};

/**
 * Sets y coordinates for each text line such that the full text object is aligned in reference to the y coordinate
 * @private
 */
MultilineText.prototype._alignVerticalText = function () {
  if (!this._vertAlign) return;

  var yCoord = this.getYAlignCoord();
  var lineCount = this.getLineCount();
  var lineHeight = this.getLineHeight();
  var textLines = this._getTextLines();
  var adjustment = 0;

  for (var i = 0; i < textLines.length; i++) {
    var entry = textLines[i];

    if (this._vertAlign == MultilineText.V_ALIGN_TOP) adjustment = lineHeight * i;
    else if (
      this._vertAlign == MultilineText.V_ALIGN_MIDDLE ||
      this.vertAlign == MultilineText.V_ALIGN_CENTRAL
    ) {
      var range = lineHeight * (lineCount - 1);
      adjustment = lineHeight * i - range / 2;
    } else if (this._vertAlign == MultilineText.V_ALIGN_BOTTOM) {
      adjustment = -lineHeight * (lineCount - i - 1);
    }

    entry.setY(yCoord + adjustment);
  }
};

/**
 * Returns the dvt.CSSStyle for this object.
 * @return {dvt.CSSStyle} The dvt.CSSStyle of this object.
 */
MultilineText.prototype.getCSSStyle = function () {
  return this._textInstance.getCSSStyle();
};

/**
 * Sets the dvt.CSSStyle of this object. If the dvt.CSSStyle is changed, then TextUtils.fitText must be called again, as the previous multi-line layouts will not be valid.
 * @param {dvt.CSSStyle} style The dvt.CSSStyle of this object.
 * @return {MultilineText}
 */
MultilineText.prototype.setCSSStyle = function (style) {
  this._lineHeight = null; // a new cssStyle invalidates any previously calculated lineHeight
  this._getTextLines().forEach(function (entry) {
    entry.setCSSStyle(style);
  });
  return this;
};

/**
 * @override
 */
MultilineText.prototype.copyShape = function () {
  var ret = new MultilineText(this.getCtx(), this.getTextString(), this.getX(), this.getY());
  ret
    .setCSSStyle(this.getCSSStyle())
    .setHorizAlignment(this.getHorizAlignment())
    .setMaxLines(this.getMaxLines());
  return ret;
};

/**
 * Helper function to remove additional text lines.
 * @private
 */
MultilineText.prototype._removeAdditionalLines = function () {
  for (var i = 0; i < this._additionalLines.length; i++) {
    this.removeChild(this._additionalLines[i]);
  }

  this._additionalLines = [];
};

/**
 * Helper function to generate and save the default OutputTexts that get
 * manipulated whens preserving new lines. Avoids having to create the elements
 * if the MultilineText is re-wrapped.
 * @private
 */
MultilineText.prototype._generatePreservedLines = function () {
  if (this._preserveNewLine) {
    this._preservedLines = [];
    var splits = this.getTextString().split(/\n+/);
    var currentLine = this._textInstance;
    var currentString = null;
    this._preservedLines.push(currentLine);

    for (var i = 0; i < splits.length; i++) {
      currentString = splits[i].replace(/\s+/g, ' ');
      currentLine.setTextString(currentString);

      if (i < splits.length - 1) {
        var newLine = currentLine.copyShape();
        this._preservedLines.push(newLine);
        currentLine = newLine;
      }
    }
  }
};

/**
 * Truncates the text instances to fit within the given width. Individual lines handle setting the untruncated text string on itself
 * or removing itself from the MultilineText container if truncated text does not fit.  Only for use by TextUtils.
 * @param {number} maxWidth The maximum width of the text.
 * @param {number} maxHeight The maximum height of the text.
 * @param {number} minChars The minimum number of characters that should be displayed before ellipsis after truncation.
 * @return {boolean} false if the text cannot fit at all, true otherwise.
 */
MultilineText.prototype.__fitText = function (maxWidth, maxHeight, minChars) {
  if (!this._preserveNewLine) {
    // Clear any previous layout results
    this._textInstance.setTextString(this.getTextString());
    this._removeAdditionalLines();

    // First try to fit the entire string in 1 line
    if (!TextUtils.fitText(this._textInstance, maxWidth, maxHeight, this, minChars)) {
      // String doesn't fit at all, remove from parent and return
      this.getParent().removeChild(this);
      return false;
    } else if (!this._textInstance.isTruncated()) {
      // No truncation needed, text fits in one line.
      return true;
    } else if (!this.isWrapEnabled()) {
      // Accept text that fits partially and turn on truncated flag
      this._bTruncated = true;
      return true;
    }
  }

  // Then wrap and truncate text to fit within the given parameters
  return this.wrapText(maxWidth, maxHeight, minChars, false);
};

/**
 * Wrap and truncates text to fit within the given parameters
 * @param {number} maxWidth The maximum width of the text.
 * @param {number} maxHeight The maximum height of the text.
 * @param {number} minChars The minimum number of characters that should be displayed before ellipsis after truncation.
 * @param {boolean=} breakOnTruncation Optional boolean to return unwrapped text if text does not fully fit in given dimensions
 * @return {boolean} false if the text cannot fit in the parameters, true otherwise.
 */
MultilineText.prototype.wrapText = function (maxWidth, maxHeight, minChars, breakOnTruncation) {
  if (this.getLineCount() > 1)
    // Clear any previous wrapping results
    this._removeAdditionalLines();

  // Calculate line height so that we can add additional lines as space allows.
  var lineHeight = this.getLineHeight();
  var lineSpace = lineHeight * MultilineText._LINE_SPACE;

  var maxLines = this.getMaxLines();
  var availHeight =
    Math.min(maxHeight, maxLines * (lineHeight + lineSpace) - lineSpace) - lineHeight - lineSpace;

  // We are currently splitting MultilineText wrapping into two exclusive behaviors
  // 1. Wrap only on new line characters. Each line truncates according to maxWidth parameter.
  // 2. Wrap between words as needed. Number of lines is dictated by the maxHeight parameter.
  //    The final line will truncate if we have used all the given space
  var currentLine;
  if (this._preserveNewLine) {
    var atLeastOneLineFits = false;
    var previousLine = null;
    for (var i = 0; i < this._preservedLines.length; i++) {
      currentLine = this._preservedLines[i];

      // Consider text truncated and return if we still have a line, but not enough availHeight
      if (availHeight < lineSpace + lineHeight) {
        this._bTruncated = true;
        return atLeastOneLineFits;
      }

      if (TextUtils.fitText(currentLine, maxWidth, Infinity, this, minChars)) {
        atLeastOneLineFits = true;
        availHeight -= lineSpace + lineHeight;
        // Consider the text truncated if any line is truncated
        if (currentLine.isTruncated() && !this.isTruncated()) this._bTruncated = true;

        if (i > 0) {
          this._additionalLines.push(currentLine);
          // Offset the new line from the previousLine, if none fit so far this line will be at the top
          var offset = previousLine ? previousLine.getY() + lineSpace + lineHeight : this.getY();
          currentLine.setY(offset);
          this.addChild(currentLine);
        }
        previousLine = currentLine;
      }
    }
    return atLeastOneLineFits;
  } else {
    currentLine = this._textInstance;
    var currentString = null;
    var lastTruncatedLine = null;
    var lastTruncatedString = null;

    // Split the string into parts.  Reverse the array so that we can use like a queue.
    var splits = this.getTextString().split(/\s+/);
    splits.reverse();

    var moveToNewLine = function () {
      var newLine = currentLine.copyShape();
      newLine.setY(currentLine.getY() + lineSpace + lineHeight);
      this.addChild(newLine);
      this._additionalLines.push(newLine);

      // Update the pointers to the line and the availHeight
      currentLine = newLine;
      currentString = null;
      availHeight -= lineSpace + lineHeight;
    }.bind(this);

    // Loop and add each split into the current line.  Create a new line once the current one is full.
    var isInitialSplit = true;
    while (splits.length > 0) {
      // Try adding the next split into the current line.
      var split = splits.pop();
      var newString = currentString ? currentString + ' ' + split : split;
      currentLine.setTextString(newString);
      currentLine.setUntruncatedTextString(null);

      if (!TextUtils.fitText(currentLine, maxWidth, Infinity, this, minChars, true)) {
        // If we are not at the beginning of the line,
        // continue with current split on new line
        if (currentString != null) {
          splits.push(split);
          moveToNewLine();
        }

        // 1. If first split does not fit at all, return false because none of the others will fit.
        // 2. If none of the previous lines were truncated and none of the other splits will fit, return false because
        //    it is better to drop the text than have a line with no ellipsis(that would indicate dropped lines).
        else if (isInitialSplit || !lastTruncatedLine) {
          this._textInstance.setTextString(null);
          this._removeAdditionalLines();
          return false;
        }

        // Subsequent piece of text doesn't fit at all. Return true because previous pieces of text had fit.
        else {
          // Reset the last truncated line to it's truncated form to show that lines were dropped.
          lastTruncatedLine.setTextString(lastTruncatedString);
          // Roll back to the last successful truncated line
          var droppedLine = this._additionalLines.pop();
          while (droppedLine && droppedLine !== lastTruncatedLine) {
            this.removeChild(droppedLine);
            droppedLine = this._additionalLines.pop();
          }
          droppedLine ? this._additionalLines.push(droppedLine) : null;
          return true;
        }
      } else if (currentLine.isTruncated()) {
        // If there's no more space to add lines, we're done
        if (availHeight < lineSpace + lineHeight) {
          this._bTruncated = true;
          return true;
        }

        // Update pointers to last truncated line
        lastTruncatedString = currentLine.getTextString();
        lastTruncatedLine = currentLine;

        // Decide whether to keep this split in the current line or push to the next
        if (currentString) {
          // If we are not at the beginning of a line
          // Always push the split to the next line if it didn't fit with the current one.
          currentLine.setTextString(currentString);
          splits.push(split);
        } else {
          // This means that we are keeping a truncated text line, because we're not pushing the split back onto the stack to be processed
          if (breakOnTruncation) {
            this._textInstance.setTextString(this.getTextString());
            this._removeAdditionalLines();
            return false;
          } else this._bTruncated = true;
        }

        // Text partially fit, create a new line for the next split
        if (splits.length > 0) {
          // If there are more splits to process
          moveToNewLine();
        }
      } // Text completely fit, continue using this line
      else currentString = newString;

      isInitialSplit = false;
    }

    return true;
  }
};

/**
 * @override
 */
MultilineText.prototype.GetSvgDimensions = function (targetCoordinateSpace) {
  var textLines = this._getTextLines();
  if (textLines.length == 0) return new Rectangle(0, 0, 0, 0);

  var dimensions = new Rectangle(Infinity, Infinity, 0, 0);
  textLines.forEach(function (entry) {
    // getUnion takes into account padding and covers cases that don't apply
    // for Multiline, so calculating dimensions here
    var entryDims = entry.getDimensions();
    dimensions.x = Math.min(dimensions.x, entryDims.x);
    dimensions.y = Math.min(dimensions.y, entryDims.y);
    dimensions.w = Math.max(dimensions.w, entryDims.w);
    dimensions.h += entryDims.h;
  });
  return this.ConvertCoordSpaceRect(dimensions, targetCoordinateSpace);
};

/**
 * Returns the number of lines for the text
 * @return {number}
 */
MultilineText.prototype.getLineCount = function () {
  return this._additionalLines.length + 1;
};

/**
 * Returns the line height
 * @return {number}
 */
MultilineText.prototype.getLineHeight = function () {
  if (!this._lineHeight)
    this._lineHeight = TextUtils.getTextStringHeight(this.getCtx(), this.getCSSStyle());

  return this._lineHeight;
};

/**
 * Enables or disables attempting to wrap during text fitting
 * @param {boolean} wrapEnabled
 */
MultilineText.prototype.setWrapEnabled = function (wrapEnabled) {
  if (!wrapEnabled) {
    if (this._textInstance.getParent() != this) this.addChild(this._textInstance);

    if (!this._textInstance.getTextString()) this._textInstance.setTextString(this.getTextString());

    this._removeAdditionalLines();
  }

  this._noWrap = !wrapEnabled;
};

/**
 * Returns whether or not text will attempt to wrap during fitting
 * @return {boolean}
 */
MultilineText.prototype.isWrapEnabled = function () {
  return !this._noWrap;
};

//// Functions added so that MultilineText can be used in the same instances as OutputText
/**
 * Returns the text string for this text object.  Returns null if the text string has not been truncated.
 * @return {string} the untruncated text string
 */
MultilineText.prototype.getUntruncatedTextString = function () {
  return this.isTruncated() ? this.getTextString() : null;
};

/**
 * Added for compatibilty with OutputText usages
 * @param {string} textString
 */
MultilineText.prototype.setUntruncatedTextString = function (textString) {
  // noop
};

/**
 * @override
 */
MultilineText.prototype.getDimensions = function (targetCoordinateSpace) {
  return this.GetSvgDimensions(targetCoordinateSpace);
};

/**
 * @override
 */
MultilineText.prototype.UpdateSelectionEffect = function () {
  // noop: Does not participate in selection effects
};

/**
 * Returns the horizontal alignment for this text object.  Valid constants begin with MultilineText.H_ALIGN_.
 * @return {string}
 */
MultilineText.prototype.getHorizAlignment = function () {
  return this._horizAlign;
};

/**
 * Specifies the horizontal alignment for this text object.  Valid constants begin with MultilineText.H_ALIGN_.
 * @param {string} align
 */
MultilineText.prototype.setHorizAlignment = function (align) {
  if (align == MultilineText.H_ALIGN_LEFT) this.alignLeft();
  else if (align == MultilineText.H_ALIGN_CENTER) this.alignCenter();
  else if (align == MultilineText.H_ALIGN_RIGHT) this.alignRight();
};

/**
 * Returns the vertical alignment for this text object.  Valid constants begin with MultilineText.V_ALIGN_.
 * @return {string} The horizontal alignment
 */
MultilineText.prototype.getVertAlignment = function () {
  return this._vertAlign;
};

/**
 * Specifies the vertical alignment for this text object.  Valid constants begin with MultilineText.V_ALIGN_.
 * @param {string} align
 */
MultilineText.prototype.setVertAlignment = function (align) {
  if (align == MultilineText.V_ALIGN_TOP) this.alignTop();
  else if (align == MultilineText.V_ALIGN_MIDDLE) this.alignMiddle();
  else if (align == MultilineText.V_ALIGN_CENTRAL) this.alignCentral();
  else if (align == MultilineText.V_ALIGN_BOTTOM) this.alignBottom();
};

MultilineText.prototype.isMultiline = function () {
  return true;
};

MultilineText.prototype.hasBackground = function () {
  return false;
};

/**
 * Simple logical object for tooltip support.
 * @param {string} tooltip The tooltip to display.
 * @param {string|function} datatip The datatip to display.
 * @param {string|function} datatipColor The border color of the datatip.
 * @param {object=} params Optional object containing additional parameters for use by component.
 * @class
 * @constructor
 * @implements {DvtTooltipSource}
 */
const SimpleObjPeer = function (tooltip, datatip, datatipColor, params) {
  this.Init(tooltip, datatip, datatipColor, params);
};

Obj.createSubclass(SimpleObjPeer, Obj);

/**
 * @param {string} tooltip The tooltip to display.
 * @param {string|function} datatip The datatip to display.
 * @param {string|function} datatipColor The border color of the datatip.
 * @param {object=} params Optional object containing additional parameters for use by component.
 */
SimpleObjPeer.prototype.Init = function (tooltip, datatip, datatipColor, params) {
  this._tooltip = tooltip;
  this._datatip = datatip;
  this._datatipColor = datatipColor;
  this._params = params;
};

/**
 * Returns additional parameters for this object, if available.
 * @return {object}
 */
SimpleObjPeer.prototype.getParams = function () {
  return this._params;
};

//---------------------------------------------------------------------//
// Tooltip Support: DvtTooltipSource impl                              //
//---------------------------------------------------------------------//

/**
 * @override
 */
SimpleObjPeer.prototype.getTooltip = function (target) {
  return this._tooltip;
};

/**
 * @override
 */
SimpleObjPeer.prototype.getDatatip = function (target) {
  if (typeof this._datatip === 'function') return this._datatip();
  return this._datatip;
};

/**
 * @override
 */
SimpleObjPeer.prototype.getDatatipColor = function (target) {
  if (typeof this._datatipColor === 'function') return this._datatipColor();
  return this._datatipColor;
};

/**
 * Simple logical object for dvt text that supports tooltip and keyboard focus.
 * @param {Container} The container of the element associated with the peer.
 * @param {MultilineText | OutputText} text The text element associated with the
 * @param {string} tooltip The tooltip to display.
 * @param {string} datatip The datatip to display.
 * @param {string} datatipColor The border color of the datatip.
 * @param {object=} params Optional object containing additional parameters for use by component.
 * @class
 * @constructor
 * @implements {DvtTooltipSource}
 * @implements {DvtLogicalObject}
 */
class TextObjPeer extends SimpleObjPeer {
  /**
   * @param {Container} The container of the element associated with the peer.
   * @param {MultilineText | OutputText} text The text element associated with the
   * @param {string} tooltip The tooltip to display.
   * @param {string} datatip The datatip to display.
   * @param {string} datatipColor The border color of the datatip.
   * @param {object=} params Optional object containing additional parameters for use by component.
   */
  constructor(container, text, tooltip, datatip, datatipColor, params) {
    super(tooltip, datatip, datatipColor, params);
    this._parent = container;
    this._text = text;
  }

  //---------------------------------------------------------------------//
  // Keyboard Support: DvtKeyboardNavigable impl                         //
  //---------------------------------------------------------------------//

  /**
   * @override
   * Returns true if the text associated with this logical object is
   * showing keyboard focus effect
   * @returns {boolean}
   */
  isShowingKeyboardFocusEffect() {
    return this._isShowingKeyboardFocusEffect;
  }

  /**
   * @override
   * Shows the keyboard focus effect on the text associated with this logical object.
   */
  showKeyboardFocusEffect() {
    this._isShowingKeyboardFocusEffect = true;
    if (this._text) {
      var bounds = this.getKeyboardBoundingBox();
      this._overlayRect = new Rect(this._parent.getCtx(), bounds.x, bounds.y, bounds.w, bounds.h);
      this._overlayRect.setSolidStroke(Agent.getFocusColor());
      this._overlayRect.setInvisibleFill();

      // necessary to align rect with tangential and rotated labels
      this._overlayRect.setMatrix(this._text.getMatrix());
      this._parent.addChild(this._overlayRect);
    }
  }

  /**
   * @override
   * Returns the bounding box of the text element.
   * @param {*} targetCoordinateSpace
   * @returns {Rectangle}
   */
  getKeyboardBoundingBox(targetCoordinateSpace) {
    if (this._text) {
      return this._text.getDimensions(targetCoordinateSpace);
    }
    return new Rectangle(0, 0, 0, 0);
  }

  /**
   * @override
   * Hides the keyboard focus effect on the text.
   */
  hideKeyboardFocusEffect() {
    this._isShowingKeyboardFocusEffect = false;
    if (this._text) {
      this._parent.removeChild(this._overlayRect);
      this._overlayRect = null;
    }
  }

  /**
   * @override
   * Returns the dom text element.
   */
  getTargetElem() {
    if (this._text) {
      return this._text.getElem();
    }
    return null;
  }

  /**
   * @override
   * Returns the associated displayable.
   * @returns {MultilineText | OutputText}
   */
  getDisplayable() {
    return this._text;
  }

  /**
   * @override
   * Returns the aria-label to be read when text is focused.
   * @returns {string}
   */
  getAriaLabel() {
    return this._text.getTextString();
  }

  /**
   * Returns the id of the text object peer if present.
   */
  getId() {
    return this._params ? this._params.id : null;
  }
}

/**
 * Base class for JSON components.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @class
 * @constructor
 * @extends {Container}
 */
const BaseComponent = function (context, callback, callbackObj, doNotInit) {
  // Components should implement newInstance factory methods instead of exposing contructors.
  // TODO: Replace doNotInit when fixing JET-48705; called from DvtChart and DvtChartDataChange
  if (!doNotInit) {
    this.Init(context, callback, callbackObj);
  }
};

Obj.createSubclass(BaseComponent, Container);
/**
 * Initializes the component.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @protected
 */
BaseComponent.prototype.Init = function (context, callback, callbackObj) {
  BaseComponent.superclass.Init.call(this, context);
  this._callback = callback;
  this._callbackObj = callbackObj;

  /**
   * Reference to the BaseComponentDefaults instance for this component.
   * @type {BaseComponentDefaults}
   * @protected
   */
  this.Defaults = null;
  /**
   * Reference to the options specifications for the component.
   * @protected
   */
  this.Options = null;
  /**
   * Reference to the component width.
   * @protected
   */
  this.Width = 0;
  /**
   * Reference to the component height.
   * @protected
   */
  this.Height = 0;
  /**
   * Reference to the component event manager used for cleanup.
   * @protected
   */
  this.EventManager = null;
  /**
   * Reference to the component animation. Used for cleanup.
   * @protected
   */
  this.Animation = null;
  /**
   * Reference to the component animation stopped flag. Used for cleanup.
   * @protected
   */
  this.AnimationStopped = false;
  /**
   * @private
   */
  this._optionsCache = new BaseComponentCache();
  /**
   * @private
   */
  this._cache = new BaseComponentCache();
  /**
   * @private
   * @const
   */
  this._SHARED_DEFS_DIV_ID = '_dvtSharedDefs';
};

/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 * @protected
 */
BaseComponent.prototype.GetDefaults = function (skin) {
  // This function will work as long as this.Defaults is properly initialized.
  return this.Defaults ? this.Defaults.getDefaults(skin) : {};
};

/**
 * Returns the component description to be appended to the component's aria-label.
 * @return {string}
 * @protected
 */
BaseComponent.prototype.GetComponentDescription = function () {
  return this.getOptions().translations.componentName;
};

/**
 * Returns true if this is the root component.
 * @protected
 * @return {boolean}
 */
BaseComponent.prototype.IsParentRoot = function () {
  return this.getParent() == this.getCtx().getStage();
};

/**
 * Applies the component WAI-ARIA accessibility information if root component.
 * @protected
 */
BaseComponent.prototype.UpdateAriaAttributes = function () {
  if (this.IsParentRoot()) {
    var translations = this.getOptions().translations;
    // Set up the aria role and label for this component for accessibility without deferring
    this.getCtx().setAriaRole('application');
    this.getCtx().setAriaLabel(
      ResourceUtils.format(translations.labelAndValue, [
        translations.labelDataVisualization,
        AriaUtils.processAriaLabel(this.GetComponentDescription())
      ])
    );
  }
};

/**
 * Specifies the options specifications for this component.
 * @param {object} options The object containing options specifications for this component.
 * @protected
 */
BaseComponent.prototype.SetOptions = function (options) {
  if (options) {
    this._optionsCache.clearCache();
  }
};

/**
 * Returns the options specifications for this component.
 * @return {object} options The object containing options specifications for this component.
 */
BaseComponent.prototype.getOptions = function () {
  if (!this.Options) this.Options = this.GetDefaults();

  return this.Options;
};

/**
 * Applies the specified options on top of the existing properties.  This function is only supported after the
 * component is initially rendered.
 * @param {object} options The object containing data and specifications for this component.
 * @param {object=} noClone an object of keys not to be cloned.
 */
BaseComponent.prototype.applyOptions = function (options, noClone) {
  if (!this.Options || !options) return;

  // Merge the new properties with the existing ones and set
  this.SetOptions(JsonUtils.merge(options, this.Options, noClone));
};

/**
 * Renders the component with the specified options object.  If no options are supplied to a component
 * that has already been rendered, the component will be rerendered to the specified size.
 * @param {object} options The object containing data and specifications for this component.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
BaseComponent.prototype.render = function (options, width, height) {
  // Subclasses should override
};

/**
 * Fires the ready event to notify the component owner that the render is complete. Should be called by component when it's ready.
 * @protected
 */
BaseComponent.prototype.RenderComplete = function () {
  // Reset the animation and reference
  this.Animation = null;
  this.AnimationStopped = false;

  // Reset the cached isOffscreen check
  this.getCtx().resetIsOffscreen();

  // Finally fire the ready event
  this.dispatchEvent(EventFactory.newReadyEvent());
};

/**
 * Returns the width of this component
 * @return {number}
 */
BaseComponent.prototype.getWidth = function () {
  return this.Width;
};

/**
 * Returns the height of this component
 * @return {number}
 */
BaseComponent.prototype.getHeight = function () {
  return this.Height;
};

/**
 * Highlights the specified categories.
 * @param {array} categories The array of categories whose data items will be highlighted. If null or empty, all
 *                           highlighting will be removed.
 */
BaseComponent.prototype.highlight = function (categories) {
  // subclasses should override if highlightedCategories is supported. Called from JET to avoid re-render.
};

/**
 * Selects the specified items.
 * @param {array} selection The array of selected items.
 */
BaseComponent.prototype.select = function (selection) {
  // subclasses should override if selection is supported. Called from JET to avoid re-render.
};

/**
 * Dispatches the event to the callback function.
 * @param {object} event The event to be dispatched.
 */
BaseComponent.prototype.dispatchEvent = function (event) {
  if (this._callback && this._callback.call) this._callback.call(this._callbackObj, event, this);
};

/**
 * @override
 */
BaseComponent.prototype.getDimensionsWithStroke = function (targetCoordinateSpace) {
  return this.getDimensions(targetCoordinateSpace);
};

/**
 * Returns this component's event manager
 * @return {dvt.EventManager}
 */
BaseComponent.prototype.getEventManager = function () {
  return this.EventManager;
};

/**
 * Returns the element that is the current keyboard focus
 * @return {DOMElement}
 */
BaseComponent.prototype.getKeyboardFocus = function () {
  var eventManager = this.getEventManager();
  if (eventManager) return eventManager.getFocus() ? eventManager.getFocus().getTargetElem() : null;
  return null;
};

/**
 * Returns the cache. Cleared at anytime by the component.
 * @return {object}
 */
BaseComponent.prototype.getCache = function () {
  return this._cache;
};

/**
 * Returns the options cache. Cleared only when the component's options are reset.
 * @return {object}
 */
BaseComponent.prototype.getOptionsCache = function () {
  return this._optionsCache;
};

/**
 * Stops animation and resets animation object reference and flags
 * @param {boolean=} bJumpToEnd Optional flag indicating whether to jump to 100% progress. False if not specified.
 * @protected
 */
BaseComponent.prototype.StopAnimation = function (bJumpToEnd) {
  if (this.Animation) {
    this.AnimationStopped = true;
    this.Animation.stop(bJumpToEnd || false);
    this.Animation = null;
  }
};

/**
 * Adds the specified element to the shared defs on the page.
 * @param {Element} elem The element to add.
 * @return {Element} The appended element.
 */
BaseComponent.prototype.appendSharedDefs = function (elem) {
  var sharedDefsDiv = document.getElementById(this._SHARED_DEFS_DIV_ID);
  if (!sharedDefsDiv) {
    // Add a div outside the component, following how DVT tooltips are added outside the component,
    // i.e. by setting the appropriate styles to keep it hidden and adding it to the end of body
    sharedDefsDiv = document.createElement('div');
    sharedDefsDiv.id = this._SHARED_DEFS_DIV_ID;
    sharedDefsDiv.style.width = '0px';
    sharedDefsDiv.style.height = '0px';
    sharedDefsDiv.style.left = '0px';
    sharedDefsDiv.style.top = '0px';
    sharedDefsDiv.style.position = 'absolute';

    var svg = ToolkitUtils.createSvgDocument();
    ToolkitUtils.setAttrNullNS(svg, 'width', '0px');
    ToolkitUtils.setAttrNullNS(svg, 'height', '0px');
    var defs = SvgShapeUtils.createElement('defs');

    svg.appendChild(defs);
    sharedDefsDiv.appendChild(svg);

    // Add the div to the end of body (following what DVT tooltips do).
    document.body.appendChild(sharedDefsDiv); //@HTMLUpdateOK
  }

  defs = sharedDefsDiv.childNodes[0].childNodes[0];
  defs.appendChild(elem);
  return elem;
};

/**
 * Component destroy function called to prevent memory leaks when component is no longer referenced.
 * Subclasses should call superclass destroy last if overriding.
 */
BaseComponent.prototype.destroy = function () {
  // Animation should be stopped before the event manager is destroyed since it might access the event manager
  this.StopAnimation();
  if (this.EventManager) {
    this.EventManager.removeListeners(this);
    this.EventManager.destroy();
    this.EventManager = null;
  }

  // The last DVT component on the page should remove the shared defs div on destroy
  // TODO: Employ the solution that will be used to fix 
  var isLastDVTComponent = document.getElementsByClassName('oj-dvtbase').length === 1;
  var sharedDefsDiv = document.getElementById(this._SHARED_DEFS_DIV_ID);
  if (isLastDVTComponent && sharedDefsDiv) document.body.removeChild(sharedDefsDiv);

  // Always call superclass last for destroy
  BaseComponent.superclass.destroy.call(this);
};

/**
 * Creates and adds an 'Empty Text' message to a container
 * @param {dvt.Container} container The container to add the empty text message to
 * @param {string} textStr The emtpy text message
 * @param {Rectangle} space The available space to render the emtpy text message in
 * @param {dvt.EventManager} eventManager The event manager to associate any tooltips with for truncated text
 * @param {dvt.CSSStyle} style The CSS style to apply to the empty text
 * @return {MultilineText}
 */
BaseComponent.prototype.renderEmptyText = function (
  container,
  textStr,
  space,
  eventManager,
  style
) {
  // Create and position the text
  var text = new MultilineText(
    container.getCtx(),
    textStr,
    /* eslint no-mixed-operators: 0 */
    space.x + space.w / 2,
    space.y + space.h / 2
  );
  if (style) text.setCSSStyle(style);
  text.alignCenter();
  text.alignMiddle();

  let tooltip;

  // Truncate the text to fit horizontally.  Note, we do not account for vertical size, because displaying a
  // cut off "No Data" message is better than displaying none at all.
  var maxWidth = space.w - 2 * TextUtils.EMPTY_TEXT_BUFFER;
  if (TextUtils.fitText(text, maxWidth, Infinity, container, 0)) {
    // Add tooltip if truncated
    if (text.isTruncated()) {
      tooltip = text.getUntruncatedTextString();
    }
    // WAI-ARIA
    text.setAriaProperty('hidden', null);
  }
  let noDataPeer = new TextObjPeer(container, text, tooltip, null, null, { id: 'noDataPeer' });
  this.getOptionsCache().putToCache('noDataPeer', noDataPeer);
  eventManager.associate(text, noDataPeer);
  return text;
};

/**
 * Specifies whether there is a context menu defined on the component
 * @param {boolean} hasMenu
 */
BaseComponent.prototype.setContextMenu = function (hasMenu) {
  this._hasContextMenu = hasMenu;
};

/**
 * Returns whether the component has a context menu
 * @return {boolean}
 */
BaseComponent.prototype.hasContextMenu = function () {
  return this._hasContextMenu;
};

/**
 * Interactivity manager for selection.
 * @class SelectionHandler
 * @constructor
 */
const SelectionHandler = function (context, type) {
  this.Init(context, type);
};

Obj.createSubclass(SelectionHandler, Obj);

SelectionHandler.TYPE_SINGLE = 's';
SelectionHandler.TYPE_MULTIPLE = 'm';

SelectionHandler.prototype.Init = function (context, type) {
  this._context = context;
  this._selection = [];
  this._type = type ? type : SelectionHandler.TYPE_SINGLE;

  // Some selected id may not correspond to a drawn target because it's outside the viewport.
  this._hiddenSelectedIds = [];
};

SelectionHandler.prototype.getType = function () {
  return this._type;
};

/**
 * Returns the number of currently selected objects.
 * @return {number}
 */
SelectionHandler.prototype.getSelectedCount = function () {
  return this._selection.length;
};

/**
 * Returns the current selection.
 * @return {array} The current selection.
 */
SelectionHandler.prototype.getSelection = function () {
  return this._selection.slice(0);
};

/**
 * Returns the ids for the currently selected objects. Includes the ids of the hidden selected objects.
 * @return {array} The ids for the currently selected objects.
 */
SelectionHandler.prototype.getSelectedIds = function () {
  var selectedIds = [];
  for (var i = 0; i < this._selection.length; i++) {
    selectedIds.push(this._selection[i].getId());
  }
  return selectedIds.concat(this._hiddenSelectedIds);
};

/**
 * Processes the initially selected objects, updating the state of this handler.
 * @param {array} selectedIds The array of ids for the selected objects.
 * @param {array} targets The array of selectable objects.
 */
SelectionHandler.prototype.processInitialSelections = function (selectedIds, targets) {
  // Clear current selection state
  this.clearSelection(true);

  // If nothing selected, we are done
  if (!selectedIds || !targets) return;

  // Construct a keySet so that the process to iterate though the targets and match the selectedIds takes
  // O(n) time instead of O(n^2) ()
  // This logic is a little convoluted and involves iterating over both the targets + selectedIds due to the
  // lack of a KeyMap, but should still be linear
  var keySet = new this._context.KeySetImpl(selectedIds);
  var matchedMap = new Map();
  var count = 0;
  for (var i = 0; count !== selectedIds.length && i < targets.length; i++) {
    var target = targets[i];
    if (target.isSelectable && target.isSelectable()) {
      var keySetId = keySet.get(target.getId());
      if (keySetId !== keySet.NOT_A_KEY) {
        // Found a match
        count++;
        matchedMap.set(keySetId, target);
      }
    }
  }
  for (var i = 0; i < selectedIds.length; i++) {
    var target = matchedMap.get(selectedIds[i]);
    if (target) {
      this._addToSelection(target, true, true);
    } else {
      // The selected item doesn't have a displayable, so add it to the hidden selection array
      this._hiddenSelectedIds.push(selectedIds[i]);
    }
  }
};

/**
 * Processes a click event.
 * @param {DvtSelectable} target
 * @param {boolean} addToExisting true if a key indicating multi-select should be performed was pressed during the click.
 * @return {boolean} true if the selection has changed.
 */
SelectionHandler.prototype.processClick = function (target, addToExisting) {
  //: if this click is unrelated to selection, then
  //don't change selection at all
  if (target && target.isUnrelatedToSelection && target.isUnrelatedToSelection()) {
    return false;
  }

  // Check whether we are in multi-select mode
  var bMulti = addToExisting && this._type == SelectionHandler.TYPE_MULTIPLE;

  //*************************************************
  // Possible cases:
  // 1. Multi-select of selectable target
  // 2. Multi-select of non-selectable target (noop)
  // 3. Single select of selectable target
  // 4. Single select of non-selectable target
  //*************************************************

  var bChanged = false; // Keep track of whether the selection is changed
  if (bMulti) {
    if (target && target.isSelectable && target.isSelectable()) {
      // 1. Multi-select of selectable target
      if (target.isSelected()) {
        bChanged = this._removeFromSelection(target);
      } else {
        bChanged = this._addToSelection(target, true);
      }
    }
    // Otherwise 2. Multi-select of non-selectable target (noop)
  } // Single Select
  else {
    if (target && target.isSelectable && target.isSelectable()) {
      // 3. Single select of selectable target
      if (addToExisting && target.isSelected()) {
        bChanged = this._removeFromSelection(target);
      } else {
        bChanged = this._addToSelection(target, false);
      }
    } else {
      // 4. Single select of non-selectable target
      bChanged = this.clearSelection();
    }
  }

  // Return whether the selection has changed.
  return bChanged;
};

/**
 * Processes selection event involving a group of target items.
 * @param {array} targets Array of DvtSelectable objects
 * @param {boolean} addToExisting true if a key indicating multi-select should be performed was pressed during the click.
 */
SelectionHandler.prototype.processGroupSelection = function (targets, addToExisting) {
  if (!addToExisting) this.clearSelection();

  var target;
  for (var i = 0; i < targets.length; i++) {
    target = targets[i];

    //: if this click is unrelated to selection, then
    //don't change selection at all
    if (target && target.isUnrelatedToSelection && target.isUnrelatedToSelection()) {
      continue;
    }

    this._addToSelection(target, true);
  }
};

/**
 * Processes a mouseOver event.
 * @param {DvtSelectable} target
 */
SelectionHandler.prototype.processMouseOver = function (target) {
  if (target && target.isSelectable && target.isSelectable() && target.showHoverEffect) {
    target.showHoverEffect();
  }
};

/**
 * Processes a mouseOut event.
 * @param {DvtSelectable} target
 */
SelectionHandler.prototype.processMouseOut = function (target) {
  if (target && target.isSelectable && target.isSelectable() && target.hideHoverEffect) {
    target.hideHoverEffect();
  }
};

/**
 * Selects a single object.
 * @param {DvtSelectable} target the object to select
 * @param {boolean} bAddToExisting true if the object should be added to the current selection.
 * @param {boolean} isInitial (optional) True if it is an initial selection.
 * @return {boolean} true if the selection has changed.
 */
SelectionHandler.prototype._addToSelection = function (target, bAddToExisting, isInitial) {
  // If already selected, return.  This intentionally ignores bAddToExisting.
  if (target.isSelected() || (target.isSelectable && !target.isSelectable())) {
    return false;
  }

  // If not adding to the current selection, deselect all
  if (!bAddToExisting) {
    this.clearSelection(isInitial);
  }

  // Finally, select the object
  target.setSelected(true, isInitial);
  this._selection.push(target);
  return true;
};

/**
 * Deselects a single object in the selection.
 * @param {DvtSelectable} target the object to deselect
 * @return {boolean} true if the selection has changed.
 */
SelectionHandler.prototype._removeFromSelection = function (target) {
  if (!target.isSelected()) return false;

  // First deselect the object, then remove it from the selected array
  target.setSelected(false);
  for (var i = 0; i < this._selection.length; i++) {
    if (this._selection[i] == target) {
      this._selection.splice(i, 1);
      break;
    }
  }
  return true;
};

/**
 * Clears the current selection.
 * @param {boolean} isInitial (optional) True if it is an initial selection.
 * @return {boolean} true if the selection has changed.
 */
SelectionHandler.prototype.clearSelection = function (isInitial) {
  if (this._selection.length <= 0 && this._hiddenSelectedIds.length <= 0) return false;

  while (this._selection.length > 0) {
    var obj = this._selection.pop();
    obj.setSelected(false, isInitial);
  }
  this._hiddenSelectedIds.length = 0;
  return true;
};

/**
 * Interactivity handle for category rollover effects support.
 * Objects must implement DvtLogicalObject and DvtCategoricalObject to be supported by this handler.
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @class CategoryRolloverHandler
 * @extends {Obj}
 * @constructor
 */
const CategoryRolloverHandler = function (callback, callbackObj) {
  this._callback = callback;
  this._callbackObj = callbackObj;

  // Assume the source of the event is also the callbackObj. We can add a param if needed.
  this._source = callbackObj;

  /**
   * True if highlight mode is on. This is true anytime after the initial hover delay has passed and the hover timeout
   * has not.
   * @private
   */
  this._bHighlightMode = false;

  /**
   * Callback used to apply highlighting. The delay will vary based on whether this is an initial rollover, subsequent
   * rollover, or rollout.
   * @private
   */
  this._hoverDelayCallback = null;

  /**
   * Callback used to disabled highlight mode. It will be called after a sufficient interval of no highlighting.
   * @see CategoryRolloverHandler._HOVER_TIMEOUT
   * @private
   */
  this._highlightModeTimeout = null;

  /**
   * Used to override default hover delay value. The delay is used in applying highlighting for subsequent highlights.
   * It's primary function is to reduce jitter when moving across small gaps between data items.
   * @see CategoryRolloverHandler._HOVER_DELAY
   * @private
   */
  this._hoverDelay = CategoryRolloverHandler._HOVER_DELAY;
};

Obj.createSubclass(CategoryRolloverHandler, Obj);

/**
 * Default hover delay value
 * @see this._hoverDelayCallback
 * @const
 * @private
 */
CategoryRolloverHandler._HOVER_DELAY = 50;
/**
 * The delay in disabling highlight mode. This is satisfied when no object is highlighted for this duration.
 * @see this._highlightModeTimeout
 * @const
 * @private
 */
CategoryRolloverHandler._HOVER_TIMEOUT = 1000;

/**
 * The delay for processing a rollout event to update highlighted items when not in highlight mode.
 * This case is possible if a legend item is filtered and then navigated away from quickly enough such that we
 * do not call the roll over callback and enter highlight mode. This creates a case where _bHighlightMode is false, yet
 * we received a rollout event that is expected to update the highlighted categories.
 * @const
 * @private
 */
CategoryRolloverHandler._ROLLOUT_TIMEOUT = 250;

/**
 * The default fade out opacity.
 * @const
 * @private
 */
CategoryRolloverHandler._FADE_OUT_OPACITY = 0.35;

/**
 * Processes the specified highlight event for the array of objects.
 * @param {object} event The event that was triggered.
 * @param {array} objs The array of objects containing hide and show targets.
 * @param {number} initialHoverDelay The delay before the initial highlight action.
 * @param {boolean=} bAnyMatched True if an object need only contain any of the categories to be highlighted.
 * @param {number=} customAlpha A custom alpha for the dimmed objects.
 * @deprecated We should update all components to use the highlight API instead.
 */
CategoryRolloverHandler.prototype.processEvent = function (
  event,
  objs,
  initialHoverDelay,
  bAnyMatched,
  customAlpha
) {
  if (!event || !objs || objs.length == 0) return;

  // Cancel any pending highlight operations. We've either moved to a new object or left the current one.
  if (this._hoverDelayCallback) {
    clearTimeout(this._hoverDelayCallback);
    this._hoverDelayCallback = null;
  }

  // Create the callback to perform the appropriate highlighting.
  var type = event['_highlightType'];
  if (type == 'over') {
    // Highlight after the appropriate delay, based on whether we're already in highlight mode.
    var hoverDelay = this._bHighlightMode ? this._hoverDelay : initialHoverDelay;
    // prettier-ignore
    this._hoverDelayCallback = setTimeout( // @HTMLUpdateOK
      this.GetRolloverCallback(event, objs, bAnyMatched, customAlpha),
      hoverDelay
    );

    // If the highlight mode timeout has been started, cancel it.
    if (this._highlightModeTimeout) {
      clearInterval(this._highlightModeTimeout);
      this._highlightModeTimeout = null;
    }
  } else if (type == 'out') {
    // Process rollout if a highlight has occurred, or after the rollout delay has elapsed.
    var rolloutDelay = this._bHighlightMode
      ? this._hoverDelay
      : CategoryRolloverHandler._ROLLOUT_TIMEOUT;
    // prettier-ignore
    this._hoverDelayCallback = setTimeout( // @HTMLUpdateOK
      this.GetRolloutCallback(event, objs, bAnyMatched, customAlpha),
      rolloutDelay
    );
  }
};

/**
 * Returns the callback to be applied after a rollover.
 * @param {object} event The event that was triggered.
 * @param {array} objs The array of objects containing hide and show targets.
 * @param {boolean=} bAnyMatched True if an object need only contain any of the categories to be highlighted.
 * @param {number=} customAlpha A custom alpha for the dimmed objects.
 * @return {function}
 * @protected
 */
CategoryRolloverHandler.prototype.GetRolloverCallback = function (
  event,
  objs,
  bAnyMatched,
  customAlpha
) {
  var callback = function () {
    this._bHighlightMode = true;
    CategoryRolloverHandler.highlight(event['categories'], objs, bAnyMatched, customAlpha);

    this.FireCallback(event);
  };
  return Obj.createCallback(this, callback);
};

/**
 * Returns the callback to be applied after a rollout.
 * @param {object} event The event that was triggered.
 * @param {array} objs The array of objects containing hide and show targets.
 * @param {boolean=} bAnyMatched True if an object need only contain any of the categories to be highlighted.
 * @param {number=} customAlpha A custom alpha for the dimmed objects.
 * @return {function}
 * @protected
 */
CategoryRolloverHandler.prototype.GetRolloutCallback = function (
  event,
  objs,
  bAnyMatched,
  customAlpha
) {
  var callback = function () {
    CategoryRolloverHandler.highlight(event['categories'], objs, bAnyMatched, customAlpha);
    this.SetHighlightModeTimeout();

    this.FireCallback(event);
  };
  return Obj.createCallback(this, callback);
};
/**
 * Fires the callback function
 * @param {object} event The event that was triggered.
 * @protected
 */
CategoryRolloverHandler.prototype.FireCallback = function (event) {
  // Fire the event to the component's callback if specified.
  if (this._callback) this._callback.call(this._callbackObj, event, this._source);
};
/**
 * Highlights the objects corresponding to the specified objects.  If no categories are specified, all highlight will
 * be removed.
 * @param {array} categories The array of categories whose data items will be highlighted.
 * @param {array} objs The array of objects containing hide and show targets.
 * @param {boolean=} bAnyMatched True if an object need only contain any of the categories to be highlighted.
 * @param {number=} customAlpha A custom alpha for the dimmed objects.
 */
CategoryRolloverHandler.highlight = function (categories, objs, bAnyMatched, customAlpha) {
  if (!objs) return;

  var dimmedAlpha = !customAlpha ? CategoryRolloverHandler._FADE_OUT_OPACITY : customAlpha;

  // Loop through the objects and update objects not belonging to the specified category.
  for (var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    if (obj && obj.getCategories) {
      var match = bAnyMatched
        ? CategoryRolloverHandler._hasAnyCategory(obj, categories)
        : CategoryRolloverHandler._hasAllCategories(obj, categories);
      var bDimmed = categories && categories.length > 0 && !match;
      CategoryRolloverHandler._highlightObj(obj, bDimmed, dimmedAlpha);
    }
  }
};

/**
 * Helper function to highlight the specified object. Assumes that obj is not null.
 * @param {object} obj The logical object to be highlighted.
 * @param {boolean} bDimmed True if the object should be dimmed.
 * @param {number} dimmedAlpha The alpha for dimmed objects
 * @private
 */
CategoryRolloverHandler._highlightObj = function (obj, bDimmed, dimmedAlpha) {
  var alpha = bDimmed ? dimmedAlpha : 1;

  // Delegate to the object to perform highlighting if supported. Otherwise adjust the alpha of all displayables.
  if (obj.highlight) obj.highlight(bDimmed, alpha);
  else {
    var displayables = obj.getDisplayables();
    CategoryRolloverHandler._updateAlpha(displayables, alpha);
  }
};

/**
 * Updates the alpha of the displayables to the specified value.
 * @param {array} displayables The array of displayables.
 * @param {number} alpha The new alpha value.
 * @private
 */
CategoryRolloverHandler._updateAlpha = function (displayables, alpha) {
  if (!displayables) return;

  for (var i = 0; i < displayables.length; i++) {
    displayables[i].setAlpha(alpha);
  }
};

/**
 * Returns true if the specified object belongs to one of the specified categories.
 * @param {DvtCategoricalObject} obj
 * @param {array} categories
 * @return {boolean}
 * @private
 */
CategoryRolloverHandler._hasAnyCategory = function (obj, categories) {
  if (!obj || !obj.getCategories) return false;

  return ArrayUtils.hasAnyItem(obj.getCategories(), categories);
};

/**
 * Returns true if the specified object belongs to all of the specified categories.
 * @param {DvtCategoricalObject} obj
 * @param {array} categories
 * @return {boolean}
 * @private
 */
CategoryRolloverHandler._hasAllCategories = function (obj, categories) {
  if (!obj || !obj.getCategories) return false;

  return ArrayUtils.hasAllItems(obj.getCategories(), categories);
};

/**
 * Sets highlight mode
 * @param {boolean} bMode True if highlight mode is on
 * @protected
 */
CategoryRolloverHandler.prototype.SetHighlightMode = function (bMode) {
  this._bHighlightMode = bMode;
};

/**
 * Sets highlight mode timeout
 * @protected
 */
CategoryRolloverHandler.prototype.SetHighlightModeTimeout = function () {
  // First create the callback to cancel highlight mode after the given timeout.
  var highlightTimeout = Obj.createCallback(this, function () {
    this.SetHighlightMode(false);
  });
  this._highlightModeTimeout = setTimeout(highlightTimeout, CategoryRolloverHandler._HOVER_TIMEOUT); //@HTMLUpdateOK
};

/**
 * Sets the hover delay value
 * @param {number} hoverDelay The delay in applying highlighting for subsequent highlights. The delay value is in milliseconds.
 */
CategoryRolloverHandler.prototype.setHoverDelay = function (hoverDelay) {
  this._hoverDelay = hoverDelay;
};

/**
 * Event manager that processes low level events and sends them to the appropriate handlers.
 * @param {dvt.Context} context The platform specific context object.
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @param {BaseComponent} component The BaseComponent that this EventManager is associated with; omit if the EventManager is being used for a non-BaseComponent object.
 * @class
 * @implements {DvtComponentKeyboardHandler}
 * @constructor
 */
const EventManager = function (context, callback, callbackObj, component) {
  this.Init(context, callback, callbackObj, component);
};

Obj.createSubclass(EventManager, Obj);

EventManager.CLEAR_SELECTION_ACTION_TYPE = 'clearSelectionActionType';

/**
 * Used for touch response touchStart
 * @const
 */
EventManager.TOUCH_RESPONSE_TOUCH_START = 'touchStart';
/**
 * Used for touch response touchHold
 * @const
 */
EventManager.TOUCH_RESPONSE_TOUCH_HOLD = 'touchHold';
/**
 * Used for touch response auto
 * @const
 */
EventManager.TOUCH_RESPONSE_AUTO = 'auto';
/**
 * Used for chrome scrollHeight/Width checking which returns a slightly higher value than actual DOM scrolHeight
 * @const
 * @private
 */
EventManager._TOUCH_RESPONSE_PADDING_CHECK = 10;
/**
 * @const
 * @private
 */
EventManager._EVENT_INFO_TOOLTIP_DISPLAYED_KEY = 'tooltipDisplayed';

/**
 * Method called by the constructor to initialize this object
 * @param {dvt.Context} context The platform specific context object.
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @param {BaseComponent} component The BaseComponent that this EventManager is associated with; omit if the EventManager is being used for a non-BaseComponent object.
 * @protected
 */
EventManager.prototype.Init = function (context, callback, callbackObj, component) {
  this._context = context;
  this._callback = callback;
  this._callbackObj = callbackObj;
  this._component = component;
  // Used to keep track of the previous and current touch targets
  this._touchMap = {};

  // Initialize the higher level event handlers.  These handlers are exposed as protected fields
  // so that subclasses can fully customize the behavior of this event manager.
  this._selectionHandler = null;
  this.KeyboardHandler = null;

  // Rollover Handler: Used to support the hover delays.
  this.RolloverHandler = this.CreateCategoryRolloverHandler(callback, callbackObj);

  // Tooltips enabled by default
  this.setTooltipsEnabled(true);

  var id = context.getStage().getId();
  if (!id) id = 'undefinedId';
  this.CustomTooltipManager = this._context.getCustomTooltipManager();
  this.CustomTooltipManager.addTooltipEventListener(
    'actionTooltipClosed',
    this.OnActionTooltipClosed,
    this
  );
  this.CustomTooltipManager.addTooltipEventListener(
    'actionTooltipStarted',
    this.OnActionTooltipStarted,
    this
  );

  this.TouchManager = null;
  if (Agent.isTouchDevice())
    this.TouchManager = new TouchManager('touchmanager', this._context, this);

  // The DvtKeyboardNavigable item that currently has keyboard focus
  this._focusedObj = null;

  // flag to indicate if the component should display keyboard focus
  this._shouldDisplayKeyboardFocus = false;

  // An array of event managers that can process keyboard events sent to this
  // event manager, arranged in tab order. This event manager should be in this
  // array, but there may be other event managers as well, such as an event
  // manager for breadcrumbs
  this._keyboardHandlers = [this];

  // index to the _keyboardHandlers array indicating the current handler
  // that receives keyboard events
  this._currentKeyboardHandlerIdx = -1;

  // Map of DnD listeners
  this._dndListeners = {};
};

/**
 * Returns the dvt.Context associated with this event manager.
 * @return {dvt.Context}
 */
EventManager.prototype.getCtx = function () {
  return this._context;
};

/**
 * Associates the specified displayable with the specified object for this event manager.  This is used by the default
 * implementation of GetLogicalObject.
 * @param {Displayable} displayable The displayable to associate.
 * @param {object} obj The object to associate with.
 * @param {boolean} bReplace True if the existing logical objects should be replaced.
 */
EventManager.prototype.associate = function (displayable, obj, bReplace) {
  if (displayable) {
    // Create the logical objects array if not already present
    if (!displayable._logicalObjects || bReplace) displayable._logicalObjects = [];

    // Add this logical object and event manager mapping
    displayable._logicalObjects.push({ logicalObject: obj, eventManager: this });
  }
};

/**
 * Adds event listeners to the specified displayable.
 * @param {Displayable} displayable The object on which to add the listeners.
 */
EventManager.prototype.addListeners = function (displayable) {
  if (!displayable) return;

  if (Agent.isTouchDevice()) {
    // Hide any tooltips previously shown
    this.hideTooltip();

    displayable.addEvtListener(TouchEvent.TOUCHSTART, this.OnTouchStartBubble, false, this);
    displayable.addEvtListener(TouchEvent.TOUCHMOVE, this.OnTouchMoveBubble, false, this);
    displayable.addEvtListener(TouchEvent.TOUCHEND, this.OnTouchEndBubble, false, this);

    this.TouchManager.addTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_START_TYPE,
      this.OnComponentTouchHoverStart,
      this
    );
    this.TouchManager.addTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_MOVE_TYPE,
      this.OnComponentTouchHoverMove,
      this
    );
    this.TouchManager.addTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_END_TYPE,
      this.OnComponentTouchHoverEnd,
      this
    );
    this.TouchManager.addTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_OUT_TYPE,
      this.OnComponentTouchHoverOut,
      this
    );
    this.TouchManager.addTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_OVER_TYPE,
      this.OnComponentTouchHoverOver,
      this
    );

    this.TouchManager.addTouchEventListener(
      ComponentTouchEvent.TOUCH_CLICK_TYPE,
      this.OnComponentTouchClick,
      this
    );
    this.TouchManager.addTouchEventListener(
      ComponentTouchEvent.TOUCH_DOUBLE_CLICK_TYPE,
      this.OnComponentTouchDblClick,
      this
    );
  } else {
    displayable.addEvtListener(MouseEvent.CLICK, this._onClick, false, this);
    displayable.addEvtListener(MouseEvent.DBLCLICK, this._onDblClick, false, this);
    displayable.addEvtListener('contextmenu', this.OnContextMenu, false, this);
    displayable.addEvtListener(MouseEvent.MOUSEMOVE, this.OnMouseMove, false, this);
    displayable.addEvtListener(MouseEvent.MOUSEOVER, this.PreOnMouseOver, false, this);
    displayable.addEvtListener(MouseEvent.MOUSEOUT, this.PreOnMouseOut, false, this);
    displayable.addEvtListener(MouseEvent.MOUSEDOWN, this.PreOnMouseDown, false, this);
    displayable.addEvtListener(MouseEvent.MOUSEUP, this.OnMouseUp, false, this);
    displayable.addEvtListener(KeyboardEvent.KEYDOWN, this.OnKeyDown, false, this);
    displayable.addEvtListener(KeyboardEvent.KEYUP, this.OnKeyUp, false, this);
    displayable.addEvtListener(DvtFocusEvent.FOCUS, this.OnFocus, false, this);
    displayable.addEvtListener(DvtFocusEvent.BLUR, this.OnBlur, false, this);

    // Safari does not dispatch wheel events to svg when there is no svg content under the pointer.
    // attaching the dummy event listener to parent element to trigger wheel event
    // https://github.com/d3/d3/issues/3035
    if (Agent.browser === 'safari') {
      this.getCtx()._parentDiv.addEventListener('wheel', () => {});
    }
  }

  if (this.isDndSupported()) {
    var context = this.getCtx();
    this.setDragSource(new DragSource(context));

    // Add drag source listeners
    this._addDndListener('dragstart', this.OnDndDragStart);
    this._addDndListener('drag', this.OnDndDrag);
    this._addDndListener('dragend', this.OnDndDragEnd);

    // Add drop target listeners
    this._addDndListener('dragenter', this.OnDndDragEnter);
    this._addDndListener('dragover', this.OnDndDragOver);
    this._addDndListener('dragleave', this.OnDndDragLeave);
    this._addDndListener('drop', this.OnDndDrop);

    var outerDiv = context.getContainer();
    for (var eventType in this._dndListeners) {
      ToolkitUtils.addDomEventListener(outerDiv, eventType, this._dndListeners[eventType], false);
    }

    this._context.addDndEventManager(this);
  }
};

/**
 * Add a drag & drop listener.
 * @param {string} eventType Event type.
 * @param {function} callback Callback function.
 * @private
 */
EventManager.prototype._addDndListener = function (eventType, callback) {
  var staticCallback = SvgDocumentUtils.createStaticCallback(this.getCtx(), callback, this);
  this._dndListeners[eventType] = staticCallback;
};

/**
 * Removes event listeners and hides tooltip from the specified displayable.
 * Subcomponents that only need to perform additional listener cleanup
 * should override RemoveListener instead of this function
 * @param {Displayable} displayable The object on which to remove the listeners.
 * @param {boolean=} keepTooltip optional true if tooltip should not be hidden
 */
EventManager.prototype.removeListeners = function (displayable, keepTooltip) {
  if (!displayable) return;

  // Hide any tooltips previously shown
  if (!keepTooltip) this.hideTooltip();

  this.RemoveListeners(displayable);
};
/**
 * Removes event listeners from the specified displayable.
 * @protected
 * @param {Displayable} displayable The object on which to remove the listeners.
 */
EventManager.prototype.RemoveListeners = function (displayable) {
  if (Agent.isTouchDevice()) {
    displayable.removeEvtListener(TouchEvent.TOUCHSTART, this.OnTouchStartBubble, false, this);
    displayable.removeEvtListener(TouchEvent.TOUCHMOVE, this.OnTouchMoveBubble, false, this);
    displayable.removeEvtListener(TouchEvent.TOUCHEND, this.OnTouchEndBubble, false, this);

    this.TouchManager.removeTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_START_TYPE,
      this.OnComponentTouchHoverStart,
      this
    );
    this.TouchManager.removeTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_MOVE_TYPE,
      this.OnComponentTouchHoverMove,
      this
    );
    this.TouchManager.removeTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_END_TYPE,
      this.OnComponentTouchHoverEnd,
      this
    );
    this.TouchManager.removeTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_OUT_TYPE,
      this.OnComponentTouchHoverOut,
      this
    );
    this.TouchManager.removeTouchEventListener(
      ComponentTouchEvent.TOUCH_HOVER_OVER_TYPE,
      this.OnComponentTouchHoverOver,
      this
    );

    this.TouchManager.removeTouchEventListener(
      ComponentTouchEvent.TOUCH_CLICK_TYPE,
      this.OnComponentTouchClick,
      this
    );
    this.TouchManager.removeTouchEventListener(
      ComponentTouchEvent.TOUCH_DOUBLE_CLICK_TYPE,
      this.OnComponentTouchDblClick,
      this
    );
  } else {
    displayable.removeEvtListener(MouseEvent.CLICK, this._onClick, false, this);
    displayable.removeEvtListener(MouseEvent.DBLCLICK, this._onDblClick, false, this);
    displayable.removeEvtListener('contextmenu', this.OnContextMenu, false, this);
    displayable.removeEvtListener(MouseEvent.MOUSEMOVE, this.OnMouseMove, false, this);
    displayable.removeEvtListener(MouseEvent.MOUSEOVER, this.PreOnMouseOver, false, this);
    displayable.removeEvtListener(MouseEvent.MOUSEOUT, this.PreOnMouseOut, false, this);
    displayable.removeEvtListener(MouseEvent.MOUSEDOWN, this.PreOnMouseDown, false, this);
    displayable.removeEvtListener(MouseEvent.MOUSEUP, this.OnMouseUp, false, this);
    displayable.removeEvtListener(KeyboardEvent.KEYDOWN, this.OnKeyDown, false, this);
    displayable.removeEvtListener(KeyboardEvent.KEYUP, this.OnKeyUp, false, this);
    displayable.removeEvtListener(DvtFocusEvent.FOCUS, this.OnFocus, false, this);
    displayable.removeEvtListener(DvtFocusEvent.BLUR, this.OnBlur, false, this);
  }

  if (this.isDndSupported()) {
    var outerDiv = this.getCtx().getContainer();
    for (var eventType in this._dndListeners) {
      ToolkitUtils.removeDomEventListener(
        outerDiv,
        eventType,
        this._dndListeners[eventType],
        false
      );
    }

    this._dndListeners = {};

    this._context.removeDndEventManager(this);
  }
};

/**
 * Releases all resources owned to prevent memory leaks.
 */
EventManager.prototype.destroy = function () {
  if (this.CustomTooltipManager) {
    this.CustomTooltipManager.removeTooltipEventListener(
      'actionTooltipClosed',
      this.OnActionTooltipClosed,
      this
    );
    this.CustomTooltipManager.removeTooltipEventListener(
      'actionTooltipStarted',
      this.OnActionTooltipStarted,
      this
    );
  }
};

/**
 * A method called before an event is processed. Sets a touch manager for the event and calls preEventBuble on touch manager object.
 * @param {DvtTouchEvent} event
 * @protected
 */
EventManager.prototype.PreEventBubble = function (event) {
  this.TouchManager.preEventBubble(event);
};

/**
 * Sets the selection handler to use with this event manager.
 * @param {SelectionHandler} handler The selection handler to use.
 */
EventManager.prototype.setSelectionHandler = function (handler) {
  this._selectionHandler = handler;
};

/**
 * Gets the selection handler to use with this event manager.
 * @param {object} logicalObj Logical object used to retrieve the correct selection handler. Optional parameter used for
 * override subclasses like DvtThematicMapEventManager.
 */
EventManager.prototype.getSelectionHandler = function (logicalObj) {
  return this._selectionHandler;
};

/**
 * Returns the glasspane of the marquee handler for this event manager, if one exists.
 * @return {dvt.Rect} The glasspane for a dvt.MarqueeHandler
 * subclasses can override like DvtChartEventManager
 */
EventManager.prototype.getMarqueeGlassPane = function () {
  return null;
};

/**
 * Sets the drag source to use with this event manager.
 * @param {DragSource} dragSource The drag source to use
 */
EventManager.prototype.setDragSource = function (dragSource) {
  this.DragSource = dragSource;
  if (Agent.isTouchDevice()) this.DragSource.setTouchManager(this.TouchManager);
};

/**
 * Sets the keyboard handler to use with this event manager. This method is
 * a no-op if we are rendering the component on a touch device.
 * @param {dvt.KeyboardHandler} handler The keyboard handler to use.
 */
EventManager.prototype.setKeyboardHandler = function (handler) {
  if (!Agent.isTouchDevice()) this.KeyboardHandler = handler;
};

/**
 * Returns the keyboard handler used by this event manager
 * @return {dvt.KeyboardHandler}
 */
EventManager.prototype.getKeyboardHandler = function () {
  return this.KeyboardHandler;
};

/**
 * Sets the event manager's keyboard focus on the given DvtKeyboardNavigable,
 * and update the keyboard focus visual feedback.
 * @param {DvtKeyboardNavigable} navigable The DvtKeyboardNavigable to receive keyboard focus
 */
EventManager.prototype.setFocusObj = function (navigable) {
  var curFocus = this.getFocus();
  if (navigable != curFocus) {
    this.setFocus(navigable);
    if (curFocus) {
      curFocus.hideKeyboardFocusEffect();
    }

    // set this event manager as the one to receive keyboard events
    if (
      this._currentKeyboardHandlerIdx > -1 &&
      this._currentKeyboardHandlerIdx < this._keyboardHandlers.length
    ) {
      var handler = this._keyboardHandlers[this._currentKeyboardHandlerIdx];
      if (handler != this) {
        // Only hide focus effect if the keyboard handler has changed
        handler.hideKeyboardFocusEffect();
      }
    }
  }
  //update current keyboard handler when a navigable is in focus
  this.setCurrentKeyboardHandler(this);
};

/**
 * Sets the event manager's keyboard focus on the given DvtKeyboardNavigable
 * @param {DvtKeyboardNavigable} navigable The DvtKeyboardNavigable to receive keyboard focus
 */
EventManager.prototype.setFocus = function (navigable) {
  if (this.KeyboardHandler) this._focusedObj = navigable;
};

/**
 * Returns the DvtKeyboardNavigable item with the current keyboard focus
 * @return {DvtKeyboardNavigable} The DvtKeyboardNavigable with the current keyboard focus
 */
EventManager.prototype.getFocus = function () {
  return this.KeyboardHandler ? this._focusedObj : null;
};

/**
 * Updates the view when the owning component receives focus
 */
EventManager.prototype.setFocused = function (isFocused) {
  var navigable = this.getFocus();
  // don't show keyboard focus effect on touch devices
  if (navigable && this.KeyboardHandler) {
    if (!isFocused) {
      navigable.hideKeyboardFocusEffect();
    } else if (
      this._shouldDisplayKeyboardFocus &&
      this._currentKeyboardHandlerIdx >= 0 &&
      this._currentKeyboardHandlerIdx < this._keyboardHandlers.length &&
      this._keyboardHandlers[this._currentKeyboardHandlerIdx] === this
    ) {
      // show keyboard focus effect if we receive focus after completing an animation
      // and we had keyboard focus before the animation began
      navigable.showKeyboardFocusEffect();
    }
  }

  if (!isFocused) this._shouldDisplayKeyboardFocus = false;
};

/**
 * Specifies whether tooltips are enabled.
 * @param {boolean} tooltipsEnabled
 */
EventManager.prototype.setTooltipsEnabled = function (tooltipsEnabled) {
  this._tooltipsEnabled = tooltipsEnabled;
};

/**
 * Returns true if tooltips are enabled.
 * @param {dvt.Obj=} logicalObj The logical object that is currently being targeted, if one is available.
 * @return {boolean}
 */
EventManager.prototype.getTooltipsEnabled = function (logicalObj) {
  return this._tooltipsEnabled;
};

/**
 * Returns the logical object corresponding to the specified Displayable.  All high level event handlers,
 * such as the selection handlers, are designed to react to the logical objects.
 * @param {Displayable} target The displayable.
 * @param {boolean} ignoreParents (optional) true indicates that parent displayables should not be searched if the
 *                  target doesn't have its own logical object
 * @return {object} The logical object corresponding to the target.
 * @protected
 */
EventManager.prototype.GetLogicalObject = function (target, ignoreParents) {
  return this.GetLogicalObjectAndDisplayable(target, ignoreParents).logicalObject;
};

/**
 * Returns the logical object and associated Displayable corresponding to the specified Displayable.
 * All high level event handlers, such as the selection handlers, are designed to react to the
 * logical objects.
 * @param {Displayable} target The displayable.
 * @param {boolean} ignoreParents (optional) true indicates that parent displayables should not be searched if the
 *                  target doesn't have its own logical object
 * @return {object} The logical object and associated Displayable corresponding to the target.
 * @protected
 */
EventManager.prototype.GetLogicalObjectAndDisplayable = function (target, ignoreParents) {
  // TODO: might not need this function anymore
  //: the popup handler needs to keep track of the displayable associated with the logical
  //object that launched a mousehover popup in order to dismiss the popup at the right time
  var displayable = target;
  while (displayable) {
    if (displayable._logicalObjects) {
      for (var i = 0; i < displayable._logicalObjects.length; i++) {
        var mapping = displayable._logicalObjects[i];
        if (mapping.eventManager == this) {
          var retObj = {};
          retObj.logicalObject = mapping.logicalObject;
          retObj.displayable = displayable;
          return retObj;
        }
      }
    }
    displayable = ignoreParents ? null : displayable.getParent();
  }
  return {};
};

/**
 * Returns the tooltip color for the specified object.
 * @param {object} obj The logical object.
 * @param {number} x The relative x coordinate of the event
 * @param {number} y The relative y coordinate of the event
 * @private
 */
EventManager.prototype._getTooltipColor = function (obj, x, y) {
  if (obj && obj.getDatatipColor) return obj.getDatatipColor();
};

/**
 * Fires the specified event through the callback.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 */
EventManager.prototype.FireEvent = function (event, source) {
  if (this._callback) this._callback.call(this._callbackObj, event, source);
};

/**
 * Fires a selection event with the current selection state.
 * @param {object} logicalObj Logical object used to retrieve the correct selection handler.
 * @private
 */
EventManager.prototype.fireSelectionEvent = function (logicalObj) {
  var selectionHandler = this.getSelectionHandler(logicalObj);
  if (!selectionHandler) return;

  // Get the array of selected ids
  var selectedIds = selectionHandler.getSelectedIds();

  // Create and fire the event
  var selectionEvent = EventFactory.newSelectionEvent(selectedIds);
  this._callback.call(this._callbackObj, selectionEvent);
};

//*******************************************************************************//
//*********************** Begin Event Listeners *********************************//
//*******************************************************************************//

/**
 * Click event handler that accounts for double clicks
 * @private
 */
EventManager.prototype._onClick = function (event) {
  if (this.IsDoubleClickable(event)) {
    if (this._clickTimer && this._clickTimer.isRunning()) {
      var clickEvent = this._savedClickEvent;
      if (event.pageX == clickEvent.pageX && event.pageY == clickEvent.pageY) {
        this._savedClickCount++;
        // Same coords, this is a double click, so ignore second click event
        return;
      } else {
        // Different coords, so need to process first event
        this._clickTimer.stop();
        this._onClickTimerEnd();
      }
    }
    this._savedClickEvent = event;
    this._savedClickCount = 1;
    if (!this._clickTimer) {
      this._clickTimer = new Timer(this._context, 250, this._onClickTimerEnd, this, 1);
    }
    this._clickTimer.reset();
    this._clickTimer.start();
  } else {
    this.OnClick(event);
  }
};

EventManager.prototype._onClickTimerEnd = function () {
  var clickEvent = this._savedClickEvent;
  this._savedClickEvent = null;
  this._savedClickCount = 0;
  if (clickEvent) {
    this.OnClick(clickEvent);
  }
};

/**
 * Click event handler.
 * @param {DvtMouseEvent} event The platform specific mouse event
 * @protected
 */
EventManager.prototype.OnClick = function (event) {
  var obj = this.GetLogicalObject(event.target);
  this.OnClickInternal(event);

  this.ProcessSelectionEventHelper(obj, event.ctrlKey);

  // Stop displaying keyboard focus after the user has clicked
  this._shouldDisplayKeyboardFocus = false;

  // Done if there is no object
  if (!obj) {
    return;
  }

  //  and  - update the keyboard focus on mouse click
  if (this.KeyboardHandler && obj.getNextNavigable) {
    var nextFocus = obj.getNextNavigable(event);
    this.setFocusObj(nextFocus);
  }
};

EventManager.prototype.IsDoubleClickable = function (event) {
  var obj = this.GetLogicalObject(event.target);
  if (obj && obj.isDoubleClickable && obj.isDoubleClickable()) return true;
  else return false;
};

/**
 * Helper function to process selection events
 * @param {DvtLogicalObject} logicalObj The logical object to process selection on
 * @param {Boolean} isMultiSelect True if we are performing multi-select
 * @private
 */
EventManager.prototype.ProcessSelectionEventHelper = function (logicalObj, isMultiSelect) {
  // Selection Support
  var selectionHandler = this.getSelectionHandler(logicalObj);
  if (selectionHandler) {
    var bSelectionChanged = selectionHandler.processClick(logicalObj, isMultiSelect);
    // If the selection has changed, fire an event
    if (bSelectionChanged) this.fireSelectionEvent(logicalObj);
  }
};

EventManager.prototype._onDblClick = function (event) {
  // Check whether we've received 2 clicks before the double click event to prevent falsely triggering a double click
  // on a Displayable when the target of the first click was different.
  var isDblClickable = this.IsDoubleClickable(event);
  if ((isDblClickable && this._savedClickCount === 2) || !isDblClickable) this.OnDblClick(event);
  this._savedClickCount = 0;
};

/**
 * Double click event handler.
 * @protected
 */
EventManager.prototype.OnDblClick = function (event) {
  if (this._clickTimer && this._clickTimer.isRunning()) {
    this._clickTimer.stop();
    this._savedClickEvent = null;
  }
  this.OnDblClickInternal(event);
};

/**
 * Context Menu event handler.
 * @protected
 */
EventManager.prototype.OnContextMenu = function (event) {
  var obj = this.GetLogicalObject(event.target);

  // set keyboard focus on the object we are firing the context menu on
  if (obj && obj.getNextNavigable) this.setFocus(obj);

  this._onContextMenuHelper(event, obj);
};

/**
 * Helper method that does the bulk of the context menu handling
 *
 * @param {DvtMouseEvent} event
 * @param {Object} obj  The logical object on which the mouse event was fired
 */
EventManager.prototype._onContextMenuHelper = function (event, obj) {
  var popupLaunched = this._processActionPopup(event.target, new Point(event.pageX, event.pageY));
  if (popupLaunched) event.preventDefault();

  // Process selection only for selectable objects so that generating context menu on empty area doesn't deselect ()
  if (obj && obj.isSelectable && obj.isSelectable()) {
    // prevent deselection in mac ctrl + click
    var skip = Agent.os === 'mac' && obj.isSelected();
    if (!skip) {
      this.ProcessSelectionEventHelper(obj, event.ctrlKey);
    }
  }
};

/**
 * Keypress down event handler.  Delegates to DvtComponentKeyboardHandlers
 * until event is consumed.
 * @param {DvtKeyboardEvent} event
 * @return {Boolean} true if this event manager has consumed the event
 * @protected
 */
EventManager.prototype.OnKeyDown = function (event) {
  this._bKeyDown = true;
  var keyCode = event.keyCode;
  var eventConsumed = false;

  var i;
  var increment;

  // if no current event manager is set to receive keyboard focus,
  // start at one end of the array and pass event to each event manager until
  // one event manager consumes the event.  that will be the current event manager
  if (
    this._currentKeyboardHandlerIdx < 0 ||
    this._currentKeyboardHandlerIdx > this._keyboardHandlers.length
  ) {
    // if we get a shift+tab, start from the back of the array
    if (keyCode == KeyboardEvent.TAB && event.shiftKey) i = this._keyboardHandlers.length - 1;
    else i = 0;
  } else {
    i = this._currentKeyboardHandlerIdx;
  }

  // if we get a shift+tab, start from the back of the array and move backward
  if (keyCode == KeyboardEvent.TAB && event.shiftKey) increment = -1;
  else increment = 1;

  for (i; i >= 0 && i < this._keyboardHandlers.length && !eventConsumed; i = i + increment) {
    var handler = this._keyboardHandlers[i];
    if (handler === this) eventConsumed = this.ProcessKeyboardEvent(event);
    else eventConsumed = handler.handleKeyboardEvent(event);

    if (eventConsumed) this._currentKeyboardHandlerIdx = i;
  }

  // consume all arrow key events to prevent event being consumed by another component and losing focus
  if (
    !eventConsumed &&
    (event.keyCode == KeyboardEvent.UP_ARROW ||
      event.keyCode == KeyboardEvent.DOWN_ARROW ||
      event.keyCode == KeyboardEvent.LEFT_ARROW ||
      event.keyCode == KeyboardEvent.RIGHT_ARROW)
  ) {
    EventManager.consumeEvent(event);
  }

  //reset current keyboard handler index as focus goes out of component
  if (!eventConsumed && keyCode == KeyboardEvent.TAB) {
    this._currentKeyboardHandlerIdx = -1;
  }
  return eventConsumed;
};

/**
 * @override
 */
EventManager.prototype.handleKeyboardEvent = function (event) {
  return this.OnKeyDown(event);
};

/**
 * @override
 */
EventManager.prototype.hideKeyboardFocusEffect = function () {
  var currentNavigable = this.getFocus();

  if (currentNavigable && currentNavigable.isShowingKeyboardFocusEffect()) {
    currentNavigable.hideKeyboardFocusEffect();
  }
};

/**
 * Keypress down event handler.  Provides basic keyboard navigation and
 * triggering of context menus.
 * @param {DvtKeyboardEvent} event
 * @return {Boolean} true if this event manager has consumed the event
 * @protected
 */
EventManager.prototype.ProcessKeyboardEvent = function (event) {
  if (!this.KeyboardHandler) return false;

  // clear tooltip if one is shown; tooltip can be shown if mouse is used to make a selection
  // and then we use the keyboard to navigate from the mouse-selected item
  this.hideTooltip();

  var currentNavigable = this.getFocus();
  var nextNavigable = null;

  // When tabbing into/out of a DVT component or subcomponent, we need to ensure focus effect is consistently shown/hidden
  if (event.keyCode == KeyboardEvent.TAB && currentNavigable) {
    if (currentNavigable.isShowingKeyboardFocusEffect()) {
      // Tabbing out of a component
      this._bKeyDown = false;
      currentNavigable.hideKeyboardFocusEffect();
      this.ProcessRolloverEvent(event, currentNavigable, false);

      // try to navigate to the next/previous subcomponent
      var nextComponent;
      if (event.shiftKey) nextComponent = this._context.previousKeyboardFocus();
      else nextComponent = this._context.nextKeyboardFocus();

      if (nextComponent) {
        nextComponent.FireListener(event, false);
        EventManager.consumeEvent(event);
        return true;
      } else {
        return false; // handle the case where we tab out of a component. don't cancel the event and propagate it onwards
      }
    } else {
      // Tabbing into a component
      this.ShowFocusEffect(event, currentNavigable);
      this.ProcessRolloverEvent(event, currentNavigable, true);
      EventManager.consumeEvent(event);
      return true;
    }
  }

  nextNavigable = this.KeyboardHandler.processKeyDown(event);

  if (nextNavigable) {
    this.setFocus(nextNavigable);

    // the user has transferred focus via the keyboard, start showing keyboard focus effect
    this._shouldDisplayKeyboardFocus = true;
    if (currentNavigable) {
      currentNavigable.hideKeyboardFocusEffect();
      this.ProcessRolloverEvent(event, currentNavigable, false);
    }
    if (this.KeyboardHandler.isSelectionEvent(event))
      this.ProcessSelectionEventHelper(nextNavigable, event.shiftKey);
    else if (this.KeyboardHandler.isMultiSelectEvent(event))
      this.ProcessSelectionEventHelper(nextNavigable, event.ctrlKey);

    this.ShowFocusEffect(event, nextNavigable);
    this.ProcessRolloverEvent(event, nextNavigable, true);

    return true;
  }

  return false;
};

/**
 * Shows the keyboard focus effects wich includes tooltip, for a keyboard navigable object.
 * @param {DvtKeyboardEvent} event The keyboard event
 * @param {DvtKeyboardNavigable} navigable The keyboard navigable to show focus effect for
 * @protected
 */
EventManager.prototype.ShowFocusEffect = function (event, navigable) {
  navigable.showKeyboardFocusEffect();
  var coords = navigable.getKeyboardTooltipLocation
    ? navigable.getKeyboardTooltipLocation()
    : navigable.getKeyboardBoundingBox(this.getCtx().getStage()).getCenter();
  var pageCoords = this.getCtx().stageToPageCoords(coords.x, coords.y);
  this.ProcessObjectTooltip(
    event,
    pageCoords.x,
    pageCoords.y,
    navigable,
    navigable.getTargetElem()
  );
  this.UpdateActiveElement(navigable);
};

/**
 * Keypress up event handler.
 * @param {DvtKeyboardEvent} event
 * @protected
 */
EventManager.prototype.OnKeyUp = function (event) {
  this._bKeyDown = false;
  if (this._handleExternalKeyboardFocus === true && event.keyCode == KeyboardEvent.TAB) {
    this._handleExternalKeyboardFocus = false;

    //  - firing a fake keydown event on keyup to communicate the tab to the newly focused element
    if (document.createEvent) {
      var keyboardEvent = document.createEvent('KeyboardEvent');
      var keycode = event.keyCode;
      var ctrlKeyPressed = event.ctrlKey;
      var shiftKeyPressed = event.shiftKey;

      if (typeof keyboardEvent.initKeyboardEvent != 'undefined') {
        keyboardEvent.initKeyboardEvent(
          KeyboardEvent.KEYDOWN,
          true,
          true,
          window,
          ctrlKeyPressed,
          false,
          shiftKeyPressed,
          false,
          keycode,
          keycode
        );
      } else {
        keyboardEvent.initKeyEvent(
          KeyboardEvent.KEYDOWN,
          true,
          true,
          window,
          ctrlKeyPressed,
          false,
          false,
          shiftKeyPressed,
          keycode,
          keycode
        );
      }

      /*
        ideally, we would just create the native keyboard event and disptach it to the wrapping div, but we
        can't for two reasons
        1. when the keyboardEvent is initialized above, the initKeyboardEvent method used by Webkit doesn't initialize
           the event with the right keycode; it is always 0.  This is a known bug tracked in Chromium and at Webkit
           see http://code.google.com/p/chromium/issues/detail?id=27048 (Chromium) and
           https://bugs.webkit.org/show_bug.cgi?id=16735 (Webkit)
        2. since the native event doesn't work, I tried dispatching a DvtKeyboardEvent to the wrapping div.
           however, this generates a DOM EventException of type UNSPECIFIED_EVENT_TYPE_ERR, even though the
           type of the DvtKeyboardEvent was specified.

        So, instead, we will directly call the bubble listener that we attach to the wrapping div
        */
      var svgKeyboardEvent = DomEventFactory.newEvent(keyboardEvent);
      svgKeyboardEvent.keyCode = keycode;
      svgKeyboardEvent.ctrlKey = ctrlKeyPressed;
      svgKeyboardEvent.shiftKey = shiftKeyPressed;

      var stage = this.getCtx().getStage();
      var wrappingDiv = stage.getSVGRoot().parentNode;
      HtmlKeyboardListenerUtils._bubbleListener.call(wrappingDiv, svgKeyboardEvent);
    }
  }
};

/**
 * Mouse Move event handler
 * @protected
 *
 * @param {DvtMouseEvent} event  Mouse move event
 */
EventManager.prototype.OnMouseMove = function (event) {
  var pageX = event.pageX;
  var pageY = event.pageY;

  var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target);
  var obj = objAndDisp.logicalObject;
  var displayable = objAndDisp.displayable;

  // Return if no object is found
  if (!obj) return;

  this.ProcessObjectTooltip(event, pageX, pageY, obj, displayable);
};

EventManager.prototype.PreOnMouseOver = function (event) {
  this.OnMouseOver(event);
};

/**
 * Mouse Over event handler
 * @param {DvtMouseEvent} event Mouse Over event
 * @protected
 */
EventManager.prototype.OnMouseOver = function (event) {
  var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target);
  var obj = objAndDisp.logicalObject;
  var displayable = objAndDisp.displayable;

  // Return if no object is found
  if (!obj) return;

  // Selection Support
  var selectionHandler = this.getSelectionHandler(obj);
  if (selectionHandler) selectionHandler.processMouseOver(obj);

  // Category Rollover Support
  this.ProcessRolloverEvent(event, obj, true);

  // Accessibility Support
  this.UpdateActiveElement(obj, displayable);
};

EventManager.prototype.PreOnMouseOut = function (event) {
  var enteredLogicalObject = this.GetLogicalObject(event.relatedTarget);
  var obj = this.GetLogicalObject(event.target);
  if (!obj || obj !== enteredLogicalObject) {
    this.OnMouseOut(event);
  }
};

/**
 * Mouse Out event handler
 * @param {DvtMouseEvent} event Mouse Out event
 * @protected
 */
EventManager.prototype.OnMouseOut = function (event) {
  var obj = this.GetLogicalObject(event.target);

  // Return if no object is found
  if (!obj) return;

  var relatedObj = this.GetLogicalObject(event.relatedTarget);
  if (obj == relatedObj) return; // not a mouse out if they correspond to the same object

  // Selection Support
  var selectionHandler = this.getSelectionHandler(obj);
  if (selectionHandler) selectionHandler.processMouseOut(obj);

  // Category Rollover Support
  this.ProcessRolloverEvent(event, obj, false);

  // : If the mouse has moved off the component, hide the tooltip
  this.hideTooltip();
};

EventManager.prototype.PreOnMouseDown = function (event) {
  this.OnMouseDown(event);
};

/**
 * Mouse Down event handler
 * @protected
 *
 * @param {DvtMouseEvent} event  Mouse down event
 */
EventManager.prototype.OnMouseDown = function (event) {
  var isPopup = this.isInActionPopup();
  if (isPopup) {
    this.CustomTooltipManager.closeActionTooltip();
  }

  // Drag and Drop Support
  var obj = this.GetLogicalObject(event.target);
  if (this.DragSource && !event.dragSourceSet && this.IsDragCandidate(obj)) {
    this.DragSource.setDragCandidate(obj);
    event.dragSourceSet = true;
  }
};

/**
 * Mouse Up event handler
 * @protected
 *
 * @param {DvtMouseEvent} event  Mouse Up event
 */
EventManager.prototype.OnMouseUp = function (event) {
  // no default behavior, subclasses can override
};

/**
 * @private
 * Shows tooltips on touch
 * @param {ComponentTouchEvent} event  Component touch event
 */
EventManager.prototype._processTouchTooltip = function (event) {
  var tooltipInfoObj = this.TouchManager.getTooltipInfo();
  var touchIds = tooltipInfoObj['touchIds'];
  var tooltipTarget = tooltipInfoObj['tooltipTarget'];

  // If no hints and another event manager didn't already process the event for a tooltip, hide current tooltip
  if (
    !this.GetEventInfo(event, EventManager._EVENT_INFO_TOOLTIP_DISPLAYED_KEY) &&
    (touchIds.length == 0 || !tooltipTarget)
  ) {
    this.hideTooltip();
    return;
  }

  var avgPos = this.TouchManager.calcAveragePosition(touchIds);
  var obj = this.GetLogicalObject(tooltipTarget);
  this.ProcessObjectTooltip(event, avgPos.x, avgPos.y, obj, null);
};

/**
 * Touch Start event handler
 * @param {DvtTouchEvent} event
 * @protected
 */
EventManager.prototype.OnTouchStartBubble = function (event) {
  this.PreEventBubble(event);

  if (event.isInitialTouch()) {
    this._popupJustClosed = false;
  }

  // Drag and Drop Support
  if (this.DragSource) {
    var obj = this.GetLogicalObject(event.target);
    if (!event.dragSourceSet && this.IsDragCandidate(obj)) {
      this.DragSource.setDragCandidate(obj);
      event.dragSourceSet = true;
    }
  }

  var isPopup = this.isInActionPopup();
  // Action popups block other types of interactions
  if (isPopup) {
    this.CustomTooltipManager.closeActionTooltip();
    this.TouchManager.resetTouchHold();
  }
  this.HandleImmediateTouchStartInternal(event);
  this.TouchManager.fireLogicalEvents(event);
  this.TouchManager.postEventBubble(event);

  // Handle touch actions
  if (this.isTouchResponseTouchStart()) {
    this._touchResponseHandled = true;
    this.TouchManager.processAssociatedTouchAttempt(
      event,
      EventManager.TOUCH_RESPONSE_TOUCH_START,
      this._saveTouchStart,
      this
    );
  } else {
    this._touchResponseHandled = false;
    this._processTouchTooltip(event);
  }
};

/**
 * Touch Move event handler
 * @param {DvtTouchEvent} event
 * @protected
 */
EventManager.prototype.OnTouchMoveBubble = function (event) {
  this.PreEventBubble(event);

  if (this.TouchManager) {
    this._prevActionClear = false;

    this.HandleImmediateTouchMoveInternal(event);
    this.TouchManager.fireLogicalEvents(event);
    this.TouchManager.postEventBubble(event);

    this._processTouchTooltip(event);
  }
};

/*
 * Timeout needed to put touch end after an attempt to touch & hold
 */
EventManager.prototype._handleTouchEndTimer = function () {
  for (var i = 0; i < this._touchEndTimer.length; i++) {
    var timerObj = this._touchEndTimer[i];
    timerObj['timer'].stop();
    var event = timerObj['event'];
    if (this.TouchManager) {
      this.HandleImmediateTouchEndInternal(event);
      this.TouchManager.fireLogicalEvents(event);
      this.TouchManager.postEventBubble(event);
    }
  }
  this._touchEndTimer = new Array();
};

/**
 * Touch End event handler
 * @param {DvtTouchEvent} event
 * @protected
 */
EventManager.prototype.OnTouchEndBubble = function (event) {
  this.PreEventBubble(event);
  var timer = new Timer(this._context, 0, this._handleTouchEndTimer, this, 1);
  if (!this._touchEndTimer) this._touchEndTimer = new Array();
  this._touchEndTimer.push({ event: event, timer: timer });
  timer.start();
};

EventManager.prototype.HandleImmediateTouchStartInternal = function (event) {};

EventManager.prototype.HandleImmediateTouchMoveInternal = function (event) {};

EventManager.prototype.HandleImmediateTouchEndInternal = function (event) {};

/**
 * Touch hover start event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event  Component touch event
 * @protected
 */
EventManager.prototype.OnComponentTouchHoverStart = function (event) {
  this.HandleTouchHoverStartInternal(event);

  // Handle touch actions if not already handled on touch start
  if (!this._touchResponseHandled) {
    this.HandleTouchActionsStart(event);
  }
};

/**
 * Touch hover move event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event
 * @protected
 */
EventManager.prototype.OnComponentTouchHoverMove = function (event) {
  this.HandleTouchHoverMoveInternal(event);

  if (!this._touchResponseHandled) {
    this.HandleTouchActionsMove(event);
  }
};

/**
 * Touch hover end event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event
 * @protected
 */
EventManager.prototype.OnComponentTouchHoverEnd = function (event) {
  this.HandleTouchHoverEndInternal(event);

  // Fire an event notifying callback object that touch hold release happened. Used by JET for context menus.
  if (this._callbackObj instanceof BaseComponent) {
    var stageCoord = this.getCtx().getStageAbsolutePosition();
    var x = event.touch.pageX;
    var y = event.touch.pageY;
    if (
      x <= stageCoord.x + this._callbackObj.getWidth() &&
      x >= stageCoord.x &&
      y <= stageCoord.y + this._callbackObj.getHeight() &&
      y >= stageCoord.y
    )
      this._callback.call(
        this._callbackObj,
        EventFactory.newTouchHoldReleaseEvent(event.getNativeEvent())
      );
  }

  if (!this._touchResponseHandled) {
    this.HandleTouchActionsEnd(event);
  }
};

/**
 * Touch hover out event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event
 * @protected
 */
EventManager.prototype.OnComponentTouchHoverOut = function (event) {
  var enteredLogicalObject = this.GetLogicalObject(event.relatedTarget);
  var obj = this.GetLogicalObject(event.target);
  if (!obj || obj !== enteredLogicalObject) {
    this.HandleTouchHoverOutInternal(event);

    if (!this._touchResponseHandled) {
      this.HandleTouchActionsOut(event);
    }
  }
};

/**
 * Touch hover over event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event
 * @protected
 */
EventManager.prototype.OnComponentTouchHoverOver = function (event) {
  this.HandleTouchHoverOverInternal(event);

  if (!this._touchResponseHandled) {
    this.HandleTouchActionsOver(event);
  }
};

/**
 * Touch double click event handler. Subclasses must override.
 * @param {ComponentTouchEvent} event
 * @protected
 */
EventManager.prototype.OnComponentTouchDblClick = function (event) {
  this.HandleTouchDblClickInternal(event);
};

/**
 * Touch click event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event Component Touch event
 * @protected
 */
EventManager.prototype.OnComponentTouchClick = function (event) {
  var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target);
  var dlo = objAndDisp.logicalObject;
  var displayable = objAndDisp.displayable;
  var touch = event.touch;

  var done = this.HandleTouchClickInternal(event);
  if (done) return;

  // When touchResponse is touchStart, selection is handled on touchend listener.
  if (!this.isTouchResponseTouchStart()) this._processTouchSelection(dlo);
  // Prevent selection clearing if popup has just closed
  if (!this._popupJustClosed) this._processTouchSelectionClear(dlo);

  if (this.CustomTooltipManager.displayActionPopup()) {
    this.UpdateActionTooltipLaunchedFeedback(displayable, new Point(touch.pageX, touch.pageY));
    this.CustomTooltipManager.startActionPopupAtPosition(touch.pageX, touch.pageY, displayable);
  }
};

/**
 * @param {dvt.Obj} dlo The logical object to process selection on
 * @param {boolean} onlySelect Only perform a selection event, not a deselection event
 * @private
 */
EventManager.prototype._processTouchSelection = function (dlo, onlySelect) {
  var bSelectionChanged = false;
  var selectionHandler = this.getSelectionHandler(dlo);
  // If onlySelect is true and object already selected, don't process selection
  if (
    selectionHandler &&
    dlo &&
    dlo.isSelectable &&
    dlo.isSelectable() &&
    !(onlySelect && dlo.isSelected())
  ) {
    // Process click immediately
    bSelectionChanged = selectionHandler.processClick(dlo, true);
    // If the selection has changed, fire an event
    if (bSelectionChanged) this.fireSelectionEvent(dlo);
  }
  this._prevActionClear = false;
};

/**
 * @param {dvt.Obj} dlo The logical object to process selection clear on
 * @private
 */
EventManager.prototype._processTouchSelectionClear = function (dlo) {
  var bSelectionChanged = false;
  var selectionHandler = this.getSelectionHandler(dlo);
  if (selectionHandler && (!dlo || !dlo.isSelectable || !dlo.isSelectable())) {
    if (!this._prevActionClear) {
      // Don't ask for clear selection if popup just closed
      var showClearDialog = false;
      // There are two different policies for the clear selection dialog
      // 1) If a tap, show clear selection only for multiple selection when more than 1 is selected
      // 2) If a touch and hold + release, don't attempt a clear or perform a  clear

      var selType = selectionHandler.getType();
      if (selType == SelectionHandler.TYPE_MULTIPLE) {
        if (selectionHandler.getSelectedCount() > 1) {
          showClearDialog = true;
        }
      }

      if (showClearDialog) {
        this.addClearAllActionItem();
      } else {
        bSelectionChanged = selectionHandler.processClick(null, false);
        // If the selection has changed, fire an event
        if (bSelectionChanged) this.fireSelectionEvent(dlo);
      }
    }
  }
};

EventManager.prototype.OnActionTooltipClosed = function (event) {
  this._popupJustClosed = true;
  this._isInActionPopup = false;
  var actionPopup = this.CustomTooltipManager.getActionTooltip();

  if (actionPopup.containsMenuId(EventManager.CLEAR_SELECTION_ACTION_TYPE)) {
    this._prevActionClear = true;
  }
  this.CustomTooltipManager.clearActionTooltip();

  // end start
  this.UpdateActionTooltipClosedFeedback(event.target);
};

EventManager.prototype.OnActionTooltipStarted = function (event) {
  this._isInActionPopup = true;
};

//*******************************************************************************//
//************************* End Event Listeners *********************************//
//*******************************************************************************//

EventManager.prototype._getTooltipInfo = function (target, obj, x, y) {
  var text = null;
  var isDatatip = false;
  if (obj && obj.getDatatip) {
    text = obj.getDatatip(target, x, y);
    if (text) isDatatip = true;
  }

  if (!text && obj && obj.getTooltip) {
    text = obj.getTooltip(target, x, y);
  }
  return { text: text, isDatatip: isDatatip };
};

/**
 * @private
 * Process show tooltip for the mousemove or touch event
 * @param {object} target target object
 * @param {object} obj  logical object
 * @param {number} pageX  event x-coordinate
 * @param {number} pageY  event y-coordinate
 * @return {boolean}  true if tooltip is shown
 */
EventManager.prototype._processShowTooltip = function (target, obj, pageX, pageY) {
  if (this.getTooltipsEnabled(obj)) {
    var relPos = this._context.pageToStageCoords(pageX, pageY);
    var x = relPos.x;
    var y = relPos.y;

    var tooltipInfo = this._getTooltipInfo(target, obj, x, y);
    var isDatatip = tooltipInfo['isDatatip'];
    var text = tooltipInfo['text'];
    if (text) {
      this.CustomTooltipManager.clearActionTooltip();
      var borderColor = this._getTooltipColor(obj, x, y);

      var ttm = this._context.getTooltipManager();
      if (isDatatip) {
        ttm.showDatatip(pageX, pageY, text, borderColor);
      } else {
        ttm.showTooltip(pageX, pageY, text, null, true, borderColor);
      }
      if (!this._hideTooltipListener) {
        this._hideTooltipListener = this._keyboardHideTooltip.bind(this);
        document.documentElement.addEventListener(
          KeyboardEvent.KEYDOWN,
          this._hideTooltipListener,
          { capture: true }
        );
      }

      this.TooltipLaunched(text, borderColor);
      this.DispatchElementEvent('tooltiplaunched');
      return true;
    } else {
      this.hideTooltip();
    }
  } else {
    this.hideTooltip();
  }
  return false;
};

EventManager.prototype._keyboardHideTooltip = function (event) {
  var keycode = event.keyCode;
  if (keycode === KeyboardEvent.ESCAPE) {
    this.hideTooltip();
    event.preventDefault();
  }
};

EventManager.prototype.hideTooltip = function () {
  var tooltipManager = this._context.getTooltipManager();
  if (tooltipManager) tooltipManager.hideTooltip();

  this.TooltipHidden();
  if (this._hideTooltipListener) {
    document.documentElement.removeEventListener(
      KeyboardEvent.KEYDOWN,
      this._hideTooltipListener,
      { capture: true }
    );
    this._hideTooltipListener = null;
  }
};

EventManager.prototype._processActionPopup = function (targetObj, position) {
  // Only if action tooltip shown
  if (this.CustomTooltipManager.displayActionPopup()) {
    this.SetupTouchTooltip(targetObj);
    this.UpdateActionPopupShownFeedback(targetObj);
    this.CustomTooltipManager.startActionPopupAtPosition(position.x, position.y, targetObj);
    return true;
  } else {
    this.UpdateActionPopupHiddenFeedback(targetObj);
    return false;
  }
};
/*
 * General  hooks
 */

EventManager.prototype.TooltipLaunched = function (tooltip, borderColor) {};

EventManager.prototype.TooltipHidden = function () {};

EventManager.prototype.SetupTouchTooltip = function (targetObj) {
  var obj = this.GetLogicalObject(targetObj);
  var actionTooltip = this.CustomTooltipManager.getActionTooltip();
  var tooltipBorderColor = actionTooltip.getTooltipBorderColor();
  // If border color wasn't overridden, get it here
  if (tooltipBorderColor == null) {
    var borderColor = this._getTooltipColor(obj);
    actionTooltip.setTooltipBorderColor(borderColor);
  }
};

/**
 * Click function for subclasses to overwrite
 * @param {DvtMouseEvent} event The platform specific mouse event
 * @protected
 */
EventManager.prototype.OnClickInternal = function (event) {};
/**
 *  Double Click function for subclasses to overwrite
 * @param {DvtMouseEvent} event The platform specific mouse event
 * @protected
 */
EventManager.prototype.OnDblClickInternal = function (event) {};

/*
 * Touch-related hooks
 */
EventManager.prototype.HandleTouchHoverStartInternal = function (event) {};

EventManager.prototype.HandleTouchHoverMoveInternal = function (event) {};

EventManager.prototype.HandleTouchHoverEndInternal = function (event) {};

EventManager.prototype.HandleTouchHoverOverInternal = function (event) {};

EventManager.prototype.HandleTouchHoverOutInternal = function (event) {};

/**
 * Internal Touch click event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event Component Touch event
 * @return {boolean} true if done handling touch click
 * @protected
 */
EventManager.prototype.HandleTouchClickInternal = function (event) {
  return false;
};
/**
 * Internal Double Touch click event handler. Subclasses can override.
 * @param {ComponentTouchEvent} event Component Touch event
 * @protected
 */
EventManager.prototype.HandleTouchDblClickInternal = function (event) {};

// Action popup shown for the given target object
EventManager.prototype.UpdateActionPopupShownFeedback = function (targetObj) {};

// Action popup hidden for the given target object
EventManager.prototype.UpdateActionPopupHiddenFeedback = function (targetObj) {};

EventManager.prototype.UpdateActionTooltipClosedFeedback = function (targetObj) {};

EventManager.prototype.UpdateActionTooltipLaunchedFeedback = function (targetObj, position) {};

EventManager.prototype.isInActionPopup = function () {
  return this._isInActionPopup;
};

/**
 * Returns a localized "Clear Selection" text.
 * @return {string}
 */
EventManager.prototype.GetClearSelectionText = function () {
  var component = this.getComponent();
  return component && component.getOptions().translations.labelClearSelection;
};

// Add a clear selection popup menu item
EventManager.prototype.addClearAllActionItem = function () {
  var actionTooltip = this.CustomTooltipManager.getActionTooltip();
  var menuItems = actionTooltip.getMenuItems();
  if (actionTooltip && menuItems.length > 0) {
    if (menuItems[menuItems.length - 1].getId() === EventManager.CLEAR_SELECTION_ACTION_TYPE) {
      return;
    }
  }
  this.addActionTooltipMenuItem(
    EventManager.CLEAR_SELECTION_ACTION_TYPE,
    this.GetClearSelectionText(),
    this._actionTooltipClearListener,
    this
  );
  // Override color to always be gray
  if (actionTooltip) actionTooltip.setTooltipBorderColor(DvtCustomTooltip.DEFAULT_BORDER_COLOR);
};

// Add a menu item to the action tooltip
EventManager.prototype.addActionTooltipMenuItem = function (id, text, listener, obj) {
  var actionTooltip = this.CustomTooltipManager.getActionTooltip();
  actionTooltip.addMenuItem(new DvtCustomTooltipItem(this._context, id, text, listener, obj));
};

/*
 * Touch-related listeners
 */
// Performed after tapping the clear selection option in an action popup
EventManager.prototype._actionTooltipClearListener = function (evt) {
  var dlo = this.GetLogicalObject(evt.target);
  var bSelectionChanged = this.getSelectionHandler(dlo).processClick(null, false);
  // If the selection has changed, fire an event
  if (bSelectionChanged) this.fireSelectionEvent(dlo);
};

/**
 * Consumes an event by calling preventDefault() and stopPropagation() on the event to prevent default browser
 * behavior and prevent other listeners from receiving this event which we always want to do for keyboard events.
 * @param {dvt.BaseEvent} event The event to consume
 */
EventManager.consumeEvent = function (event) {
  if (event) {
    event.preventDefault();
    //: stop event propagation when the event is consumed
    event.stopPropagation();
  }
};

/**
 * Adds a DvtComponentKeyboardHandler to process keyboard events initially
 * received by this event manager.  Handlers are stored in tab index order and
 * a keyboard event will be passed from one handler to the next until some
 * handler (which might be this event manager itself) consumes the event or
 * all handlers after or before the current handler in the list have
 * had a chance to process the keyboard event.
 *
 * @param {DvtComponentKeyboardHandler} handler
 * @param {Number} index The tab index at which to add this handler
 *
 */
EventManager.prototype.addComponentKeyboardHandlerAt = function (handler, index) {
  // Return immediately if the current index doesn't exist
  if (index > this._keyboardHandlers.length) return;
  if (handler) {
    this._keyboardHandlers.splice(index, 0, handler);
    // maintain the pointer to the current keyboard handler
    if (index <= this._currentKeyboardHandlerIdx) this._currentKeyboardHandlerIdx++;
  }
};

/**
 * Removes the given DvtComponentKeyboardHandler
 *
 * @param {DvtComponentKeyboardHandler} handler
 *
 */
EventManager.prototype.removeComponentKeyboardHandler = function (handler) {
  if (handler) {
    var i = this._findHandler(handler);
    if (i > -1) {
      // if the handler to be removed is the current one and it's the
      // first handler on the list, then let the reference to the current handler point
      // to the first element in the handler list after the current handler is removed
      if (this._currentKeyboardHandlerIdx == i && i == 0) this._currentKeyboardHandlerIdx = 0;
      // maintain the pointer to the current keyboard handler
      else if (i <= this._currentKeyboardHandlerIdx) this._currentKeyboardHandlerIdx--;

      this._keyboardHandlers.splice(i, 1);
    }
  }
};

/**
 * Returns index of specified DvtComponentKeyboardHandler in the internal list,
 * or -1 if not found.
 * @param {DvtComponentKeyboardHandler} handler
 * @return {Number}
 * @private
 */
EventManager.prototype._findHandler = function (handler) {
  var idx = -1;
  var length = this._keyboardHandlers.length;

  for (var i = 0; i < length; i++) {
    if (this._keyboardHandlers[i] === handler) idx = i;
  }

  return idx;
};

/**
 * Updates the pointer to the current keyboard handler
 * @param {DvtComponentKeyboardHandler} handler
 */
EventManager.prototype.setCurrentKeyboardHandler = function (handler) {
  var idx = this._findHandler(handler);

  if (idx >= 0) this._currentKeyboardHandlerIdx = idx;
};

EventManager.prototype.IsDragCandidate = function (obj) {
  // subclasses should override
  return true;
};

/**
 * Fires an active element change event in order to add aria-activedescendant attribute to the outer div.
 * This is needed by accessibility client in order to determine active SVG element
 * @param {object} obj The logical object corresponding to the targeted displayable.
 * @param {Displayable} displayable The displayable being targeted.
 * @protected
 */
EventManager.prototype.UpdateActiveElement = function (obj, displayable) {
  // Find the displayable if needed
  if (!displayable) {
    if (obj.getDisplayable) displayable = obj.getDisplayable();
    else if (obj.getDisplayables) displayable = obj.getDisplayables()[0];
    else displayable = obj;
  }

  // Don't continue if the displayable is not a valid displayable
  if (!(displayable instanceof Displayable)) return;

  // Find the displayable with the ARIA tags, by traversing ancestors if needed.  If the logical object has a deferred
  // aria-label, then it doesn't matter which displayable is used.
  if (obj.getAriaLabel) {
    var ariaLabel = obj.getAriaLabel();
    if (ariaLabel) {
      displayable.setAriaProperty('label', ariaLabel);
    }
  } else {
    while (!displayable.getAriaRole() && displayable.getParent()) {
      displayable = displayable.getParent();
    }
  }

  // Return if this displayable is the stage, since it should never be the active element
  if (displayable == this.getCtx().getStage()) return;

  // Set the new active element
  this.getCtx().setActiveElement(displayable);
};

/**
 * Gets a touch manager object
 * @return {TouchManager} touch manager object
 */
EventManager.prototype.getTouchManager = function () {
  return this.TouchManager;
};

/**
 * Ends a drag without specifying the final mouse/touch coordinate.
 * Used to end touch drag and to end a drag that happens outside the component area (called by AdfDhtmlDvtToolkitPeer).
 * @return {object} An event, if fired.
 */
EventManager.prototype.endDrag = function () {
  return null; // subclasses should override
};

/**
 * @private
 * Check if the event has information
 * @param {DvtEvent} event  Dvt Event object
 * @return {boolean}  true if the event has information
 */
EventManager.prototype._hasEventInfo = function (event) {
  if (event == null) return false;

  var nativeEvt = event.getNativeEvent();
  if (nativeEvt._eventInfo) return true;

  return false;
};

/**
 * @protected
 * Get event information for the passed key
 * @param {DvtEvent} event  Dvt Event object
 * @param {string} key  event info key
 * @return {object}  event info value
 */
EventManager.prototype.GetEventInfo = function (event, key) {
  if (!this._hasEventInfo(event) || key == null) return null;

  //get the value from event info
  var eventInfo;
  if (!this.StoreInfoByEventType(key)) {
    eventInfo = event.getNativeEvent()._eventInfo;
  } else {
    eventInfo = event.getNativeEvent()._eventInfo[event.type];
  }
  return eventInfo ? eventInfo[key] : null;
};

/**
 * @protected
 * Set event information
 * @param {DvtEvent} event  Dvt Event object
 * @param {string} key  event info key
 * @param {object} value  event info value
 */
EventManager.prototype.SetEventInfo = function (event, key, value) {
  if (event == null || key == null) return;

  var nativeEvt = event.getNativeEvent();
  if (!nativeEvt._eventInfo) nativeEvt._eventInfo = {};

  if (!this.StoreInfoByEventType(key)) {
    nativeEvt._eventInfo[key] = value;
  } else {
    var typeName = event.type;
    if (!nativeEvt._eventInfo[typeName]) nativeEvt._eventInfo[typeName] = {};
    //set the value in event info
    nativeEvt._eventInfo[typeName][key] = value;
  }
};

/**
 * @protected
 * Checks if the event info should be stored on native event using event type
 * @param {string} key  event info key
 * @return {boolean} true to use event type in addition to the key to store event info
 */
EventManager.prototype.StoreInfoByEventType = function (key) {
  if (key == EventManager._EVENT_INFO_TOOLTIP_DISPLAYED_KEY) {
    return false;
  }
  return true;
};

/**
 * Process object tooltip
 * @param {DvtMouseEvent|DvtKeyboardEvent|ComponentTouchEvent} event  Mouse, keyboard or touch event
 * @param {number} relPosX  x position relative to the page
 * @param {number} relPosY  y position relative to the page
 * @param {object} obj  logical object
 * @param {object} targetObj  Target object
 * @protected
 */
EventManager.prototype.ProcessObjectTooltip = function (event, relPosX, relPosY, obj, targetObj) {
  if (!this.GetEventInfo(event, EventManager._EVENT_INFO_TOOLTIP_DISPLAYED_KEY)) {
    if (this._processShowTooltip(targetObj, obj, relPosX, relPosY))
      this.SetEventInfo(event, EventManager._EVENT_INFO_TOOLTIP_DISPLAYED_KEY, true);
  }
};

/**
 * Resets the flag for external focus event. The flag is could be set when component gain the focus by mouse click or keyboard tabbing.
 * The flag is used by key up event and it is reset on timer to ensure that Eevnt manager does not keep stale flag.
 * @private
 */
EventManager.prototype._resetExternalKeyboardFocus = function () {
  this._handleExternalKeyboardFocus = false;
};

/**
 * Focus event handler.
 * @param {DvtFocusEvent} event focus event
 * @protected
 */
EventManager.prototype.OnFocus = function (event) {
  // - when user tabs into a component, the component does not get "keydown" event, since the keydown happened outside of the component.
  //Then the focus is transfered to the component and the component gets the "focus" and the "keyup" events.
  //As the result of the skipped "keydown" event, the first focus is set on the outer div, but the keyboard focus is not set/shown on the navigable object.
  //As a fix for this bug the _handleExternalKeyboardFocus flag is going to be used. When we detect that "keydown" is skipped, the flag is set to true.
  //Then if the focus was set by keyboard tabbing, the flag will be checked by the KeyUp event - the fake "keydown" is going to be generated in order to set the keyboard focus.
  //Otherwise the flag will be reset by the timer.
  this._handleExternalKeyboardFocus = false;

  if (!this._bKeyDown && !event.isPropagationStopped()) {
    this._handleExternalKeyboardFocus = true;
    if (!this._keyboardFocusTimer) {
      this._keyboardFocusTimer = new Timer(
        this._context,
        200,
        this._resetExternalKeyboardFocus,
        this,
        1
      );
    }
    this._keyboardFocusTimer.reset();
    this._keyboardFocusTimer.start();
    event.stopPropagation();
  }
};

/**
 * Blur event handler.
 * @param {DvtFocusEvent} event focus event
 * @protected
 */
EventManager.prototype.OnBlur = function (event) {
  //clean up the keyboard focus
  this._bKeyDown = false;
  var currentNavigable = this.getFocus();
  if (currentNavigable && currentNavigable.isShowingKeyboardFocusEffect()) {
    currentNavigable.hideKeyboardFocusEffect();
  }
};

/**
 * Processes a rollover action on the specified logical object.
 * @param {dvt.BaseEvent} event The event that caused the rollover.
 * @param {DvtLogicalObject} obj The logical object that was the target of the event.
 * @param {boolean} bOver True if this is a rollover, false if this is a rollout.
 */
EventManager.prototype.ProcessRolloverEvent = function (event, obj, bOver) {
  // subclasses must override if hoverBehavior is supported
};

/**
 * Creates category rollover handler
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @return {CategoryRolloverHandler} category rollover handler
 */
EventManager.prototype.CreateCategoryRolloverHandler = function (callback, callbackObj) {
  return new CategoryRolloverHandler(callback, callbackObj);
};

/**
 * Returns the touch response for the component
 * @return {string}
 * @protected
 */
EventManager.prototype.GetTouchResponse = function () {
  return EventManager.TOUCH_RESPONSE_TOUCH_START;
};

/**
 * Returns true if touch response should be on touchStart event
 * @return {boolean}
 */
EventManager.prototype.isTouchResponseTouchStart = function () {
  var touchResponse = this.GetTouchResponse();
  if (touchResponse === EventManager.TOUCH_RESPONSE_TOUCH_START) return true;
  else if (touchResponse === EventManager.TOUCH_RESPONSE_TOUCH_HOLD) return false;
  else {
    // start with the parent of the container div
    var root = this.getCtx().getSvgDocument().parentElement.parentElement;
    while (root) {
      var style = window.getComputedStyle(root);
      if (
        (style.overflow !== 'hidden' &&
          ((root.scrollWidth > root.clientWidth + EventManager._TOUCH_RESPONSE_PADDING_CHECK &&
            style['overflow-x'] !== 'hidden') ||
            (root.scrollHeight > root.clientHeight + EventManager._TOUCH_RESPONSE_PADDING_CHECK &&
              style['overflow-y'] !== 'hidden'))) ||
        (window.frameElement && window.frameElement.nodeName == 'IFRAME')
      ) {
        // touchResponse should be auto when in an iFrame 
        return false;
      }
      if (root.nodeName === 'HTML') {
        break;
      }
      root = root.parentElement;
    }
    return true;
  }
};

/**
 * Handles touch start actions like marquee select, tooltips, and category rollover.
 * @param {DvtTouchEvent} event Touch event to handle
 * @param {dvt.Touch} touch Touch object for the event
 * @private
 */
EventManager.prototype._saveTouchStart = function (event, touch) {
  var touchIds = this.TouchManager.getTouchIdsForObj(EventManager.TOUCH_RESPONSE_TOUCH_START);
  if (touchIds.length <= 1) {
    // Use HOVER_TOUCH_KEY so that tooltips aren't canceled when touch hold is triggered in TouchManager
    this.TouchManager.saveProcessedTouch(
      touch.identifier,
      TouchManager.HOVER_TOUCH_KEY,
      null,
      TouchManager.HOVER_TOUCH_KEY,
      TouchManager.HOVER_TOUCH_KEY,
      this.HandleTouchActionsMove,
      this.HandleTouchActionsEnd,
      this
    );
    this.HandleTouchActionsStart(event);
  }
};

/**
 * Handles touch start and touch hold actions like marquee select, tooltips, and category rollover.
 * @param {DvtTouchEvent|ComponentTouchEvent} event
 * @protected
 */
EventManager.prototype.HandleTouchActionsStart = function (event) {
  var obj = this.GetLogicalObject(event.target);
  var touch = event instanceof ComponentTouchEvent ? event.touch : event.touches[0];

  // Logic copied from TouchManager._onTouchHoldHover
  if (!(event instanceof ComponentTouchEvent)) {
    if (!this._touchMap[touch.identifier]) this._touchMap[touch.identifier] = {};

    this._touchMap[touch.identifier][TouchManager.PREV_HOVER_OBJ] = null;
    if (obj) this.HandleTouchActionsOver(event);
    this._touchMap[touch.identifier][TouchManager.PREV_HOVER_OBJ] = obj;
  }

  // Category rollover support
  if (obj) this.ProcessRolloverEvent(event, obj, true);

  // Tooltips
  this._processTouchTooltip(event);

  this._prevActionClear = false;
};

/**
 * Handles touch move actions.
 * @param {DvtTouchEvent|ComponentTouchEvent} event Touch event to handle
 * @protected
 */
EventManager.prototype.HandleTouchActionsMove = function (event) {
  var touch = event instanceof ComponentTouchEvent ? event.touch : event.touches[0];

  var obj;
  if (!(event instanceof ComponentTouchEvent)) {
    // Cancel the browser default behavior to pan.
    event.preventDefault();

    // The target for a touch event is always the touchstart target. TouchManager already handles updating the
    // target based on the current x/y coordinates, but we need to handle it as well if we are dealing with the browser
    // touch events.
    var targetObj = SvgDocumentUtils.elementFromTouch(touch);
    obj = this.GetLogicalObject(targetObj);
    var prevObj = this._touchMap[touch.identifier][TouchManager.PREV_HOVER_OBJ];
    if (prevObj != obj) {
      // Handle hover out/over events. Logic copied from TouchManager._onTouchHoldHover
      if (prevObj) {
        var target;
        if (prevObj.getDisplayable) target = prevObj.getDisplayable();
        else if (prevObj.getDisplayables) target = prevObj.getDisplayables()[0];

        if (target) {
          event.target = target;
          this.HandleTouchActionsOut(event, touch);
        }
      }

      event.target = targetObj;
      if (obj) this.HandleTouchActionsOver(event);
    }

    this._touchMap[touch.identifier][TouchManager.PREV_HOVER_OBJ] = obj;
  } else {
    obj = this.GetLogicalObject(event.target);
  }

  // Category rollover support
  if (obj) this.ProcessRolloverEvent(event, obj, true);
};

/**
 * Handles touch end actions.
 * @param {DvtTouchEvent|ComponentTouchEvent} event Touch event to handle
 * @param {dvt.Touch=} touch Touch object for the event
 * @protected
 */
EventManager.prototype.HandleTouchActionsEnd = function (event, touch) {
  var targetObj;
  var obj;

  // Logic copied from TouchManager._onTouchHoldHover
  if (!(event instanceof ComponentTouchEvent)) {
    // Cancel the browser default behavior to pan.
    event.preventDefault();

    // The target for a touch event is always the touchstart target. TouchManager already handles updating the
    // target based on the current x/y coordinates, but we need to handle it as well if we are dealing with the browser
    // touch events.
    targetObj = SvgDocumentUtils.elementFromTouch(touch);
    obj = this.GetLogicalObject(targetObj);

    var target;
    if (obj) {
      if (obj.getDisplayable) target = obj.getDisplayable();
      else if (obj.getDisplayables) target = obj.getDisplayables()[0];
    }

    if (target) {
      event.target = target;
      this.HandleTouchActionsOut(event, touch);
    }

    this._touchMap[touch.identifier][TouchManager.PREV_HOVER_OBJ] = null;
  } else {
    // ComponentTouchEvent should use its stored touch, else at this point touch event has been passed in and removed from event
    var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target);
    targetObj = objAndDisp.displayable;
    obj = objAndDisp.logicalObject;
    touch = event.touch;
  }

  var touchX = touch.pageX;
  var touchY = touch.pageY;

  this._processTouchSelection(obj, this._component ? this._component.hasContextMenu() : null);

  this._processActionPopup(targetObj, new Point(touchX, touchY));
};

/**
 * Handles touch over actions.
 * @param {DvtTouchEvent|ComponentTouchEvent} event Touch event to handle
 * @protected
 */
EventManager.prototype.HandleTouchActionsOver = function (event) {
  var obj = this.GetLogicalObject(event.target);

  // Category Rollover Support
  if (obj) this.ProcessRolloverEvent(event, obj, true);

  var selectionHandler = this.getSelectionHandler(obj);
  if (selectionHandler) selectionHandler.processMouseOver(obj);
};

/**
 * Handles touch move actions.
 * @param {DvtTouchEvent|ComponentTouchEvent} event Touch event to handle
 * @param {dvt.Touch=} touch Touch object for the event
 * @protected
 */
EventManager.prototype.HandleTouchActionsOut = function (event, touch) {
  var obj = this.GetLogicalObject(event.target);

  // ComponentTouchEvent should use its stored touch, else at this point touch event has been passed in and removed from event
  if (event instanceof ComponentTouchEvent) touch = event.touch;

  // Category Rollover Support
  if (obj) this.ProcessRolloverEvent(event, obj, false);

  var selectionHandler = this.getSelectionHandler(obj);
  if (selectionHandler) selectionHandler.processMouseOut(obj);
};

/**
 * Returns the component that owns the event manager.
 * @return {BaseComponent}
 */
EventManager.prototype.getComponent = function () {
  return this._component;
};

// Drag & Drop Support

/** dataType for storing offsetX in DnD dataTransfer */
EventManager.DROP_OFFSET_X_DATA_TYPE = 'text/_dvtDropOffsetX';
/** dataType for storing offsetY in DnD dataTransfer */
EventManager.DROP_OFFSET_Y_DATA_TYPE = 'text/_dvtDropOffsetY';

/**
 * Returns whether drag & drop is supported.
 * @return {boolean}
 */
EventManager.prototype.isDndSupported = function () {
  return false;
};

/**
 * Handles DnD dragStart event.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.OnDndDragStart = function (event) {
  var $event = ToolkitUtils.getEventForSyntax(this._context, event);
  var dataTransfer = $event.dataTransfer;

  // Pass if the dataTransfer is already loaded, since the event is already handled by another event manager
  if ($event.dataTransfer.types && $event.dataTransfer.types.length > 0) return;

  var relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
  var dragTransferable = this.DragSource.getDragTransferable(relPos.x, relPos.y);
  var dragSourceType = this.GetDragSourceType(event);

  // Cancel the event if drag can't be started
  // Only call preventDefault if this is the last event manager because it's possible that the subsequent event
  // managers can accept the drag (preventDefault can't be cancelled once called)
  if (dragTransferable == null || dragSourceType == null) {
    if (this._context.isLastDndEventManager(this)) event.preventDefault();
    return;
  }

  this._context.getTooltipManager().hideTooltip();

  // Provide data to the dataTransfer based on dataTypes
  var dragOptions = this._getDragOptions(event);
  var dataTypes = dragOptions['dataTypes'];
  var callback = dragOptions['dragStart'];

  // Cancel the both dataTypes and callback are undefined
  if (dataTypes == null && !callback) {
    if (this._context.isLastDndEventManager(this)) event.preventDefault();
    return;
  }

  // If selection is enabled and the dragged object isn't selected, we should select the object
  var obj = this.DragSource.getDragObject();
  this.ProcessSelectionEventHelper(obj, false);

  if (obj.hideHoverEffect) obj.hideHoverEffect();

  if (dataTypes != null) {
    // Support single data type that's defined as a string
    if (!Array.isArray(dataTypes)) dataTypes = [dataTypes];

    var dragData = this._getDragData(event);

    for (var i = 0; i < dataTypes.length; i++) dataTransfer.setData(dataTypes[i], dragData);
  }

  // Create and set drag image
  var dragFeedback = ToolkitUtils.getDragFeedback(
    this.DragSource.getDragOverFeedback(relPos.x, relPos.y),
    this._context.getStage()
  );
  var dragImage = dragFeedback.svg;
  var dragOffset = this.DragSource.getDragOffset(relPos.x, relPos.y);

  dragImage.style.width = dragFeedback.width + 'px';
  dragImage.style.height = dragFeedback.height + 'px';
  dragImage.style.left = event.pageX - dragOffset.x + 'px';
  dragImage.style.top = event.pageY - dragOffset.y + 'px';
  dragImage.style.position = 'absolute';
  dragImage.style.fontFamily = this._context.getDefaultFontFamily();
  dragImage.style.fontSize = this._context.getDefaultFontSize();

  // Disable mouse events on the drag image so it doesn't interfere with the drag events.
  SvgDocumentUtils.disableMouseEvents(dragImage);

  // The drag image has to be in the DOM tree when being set, so we add it and remove it immediately.
  document.body.appendChild(dragImage); // @HTMLUpdateOK
  DvtAnimationFrameUtils.requestAnimationFrame(function () {
    document.body.removeChild(dragImage);
  });

  dataTransfer.setDragImage(dragImage, dragOffset.x, dragOffset.y);

  // Store the drop offsets in the dataTransfer so we can position the item correctly if the drop happens on a DVT component
  var dropOffset = this.GetDropOffset(event);
  if (dropOffset) {
    dataTransfer.setData(EventManager.DROP_OFFSET_X_DATA_TYPE, dropOffset.x);
    dataTransfer.setData(EventManager.DROP_OFFSET_Y_DATA_TYPE, dropOffset.y);
  }

  // Handle the user-defined callback
  if (callback) {
    var eventPayload = this._getDragEventPayload(event);
    callback($event, eventPayload);
  }
};

/**
 * Handles DnD drag event.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.OnDndDrag = function (event) {
  this._handleDragSourceEvent(event, 'drag');
};

/**
 * Handles DnD dragEnd event.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.OnDndDragEnd = function (event) {
  this.DragSource.setDragCandidate(null); // Reset drag candidate
  this._handleDragSourceEvent(event, 'dragEnd');
};

/**
 * Returns the type of the current drag source.
 * @param {dvt.BaseEvent} event
 * @return {string} The drag source type.
 * @protected
 */
EventManager.prototype.GetDragSourceType = function (event) {
  // subclasses should override
  return null;
};

/**
 * Returns the data context of the current drag source or an array of data contexts.
 * @param {boolean} bSanitize if true, the data contexts return should be sanitized so they can safely be stringified
 * @return {Array|object}
 * @protected
 */
EventManager.prototype.GetDragDataContexts = function (bSanitize) {
  // subclasses should override
  return [];
};

/**
 * Returns the offset between the data location and the cursor location during drag.
 * If provided, the offset will be included in the dataTransfer so that the drop target can take it into account.
 * @param {dvt.BaseEvent} event
 * @return {Point}
 * @protected
 */
EventManager.prototype.GetDropOffset = function (event) {
  // subclasses should override
  return null;
};

/**
 * Returns the drag options object of the current drag source.
 * @param {dvt.BaseEvent} event
 * @return {object}
 * @private
 */
EventManager.prototype._getDragOptions = function (event) {
  var dragSourceType = this.GetDragSourceType(event);
  return this.getComponent().getOptions()['dnd']['drag'][dragSourceType];
};

/**
 * Returns the ui param for the drag callback.
 * @param {dvt.BaseEvent} event
 * @return {object}
 * @private
 */
EventManager.prototype._getDragEventPayload = function (event) {
  var ui = {};
  var dragSourceType = this.GetDragSourceType(event);
  ui[dragSourceType] = this.GetDragDataContexts();
  return ui;
};

/**
 * Returns the data string to populate the DnD dataTransfer.
 * @param {dvt.BaseEvent} event
 * @return {object}
 * @private
 */
EventManager.prototype._getDragData = function (event) {
  // Stringify data contexts, ignoring component and componentElemment
  return JSON.stringify(this.GetDragDataContexts(true));
};

/**
 * Handles drag or dragEnd event.
 * @param {dvt.BaseEvent} event
 * @param {string} eventType
 * @private
 */
EventManager.prototype._handleDragSourceEvent = function (event, eventType) {
  var dragSourceType = this.GetDragSourceType(event);
  if (dragSourceType == null) return;

  var callback = this._getDragOptions(event)[eventType];
  if (callback) {
    var $event = ToolkitUtils.getEventForSyntax(this._context, event);
    callback($event);
  }
};

// Drag source events above. Drop target events below.

/**
 * Handles DnD dragEnter event.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.OnDndDragEnter = function (event) {
  this._handleDropTargetEvent(event, 'dragEnter', true);
};

/**
 * Handles DnD dragOver event.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.OnDndDragOver = function (event) {
  this._handleDropTargetEvent(event, 'dragOver', true);
};

/**
 * Handles DnD dragLeave event.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.OnDndDragLeave = function (event) {
  this._handleDropTargetEvent(event, 'dragLeave', false);
};

/**
 * Handles DnD drop event.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.OnDndDrop = function (event) {
  this._handleDropTargetEvent(event, 'drop', false);
};

/**
 * Returns the type of the current drop target.
 * @param {dvt.BaseEvent} event
 * @return {string} The drop target type.
 * @protected
 */
EventManager.prototype.GetDropTargetType = function (event) {
  // subclasses should override
  return null;
};

/**
 * Returns the ui param for the drop callback.
 * @param {dvt.BaseEvent} event
 * @return {object}
 * @protected
 */
EventManager.prototype.GetDropEventPayload = function (event) {
  // subclasses should override
  return null;
};

/**
 * Shows the hover effect of the current drop target.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.ShowDropEffect = function (event) {
  // subclasses should override
  return;
};

/**
 * Shows the hover effect of the current rejected drop target.
 * @param {dvt.BaseEvent} event
 * @protected
 */
EventManager.prototype.ShowRejectedDropEffect = function (event) {
  // subclasses should override
  // implemented temporary for  - theming is not implemented for charts dnd
  this.ClearDropEffect();
};

/**
 * Clears all hover effects from drop targets.
 * @protected
 */
EventManager.prototype.ClearDropEffect = function () {
  // subclasses should override
  return;
};

/**
 * Returns the drag options object of the current drop target.
 * @param {dvt.BaseEvent} event
 * @return {object}
 * @private
 */
EventManager.prototype._getDropOptions = function (event) {
  var dropTargetType = this.GetDropTargetType(event);
  return this.getComponent().getOptions()['dnd']['drop'][dropTargetType];
};

/**
 * Handles dragEnter, dragOver, dragLeave, or drop event.
 * @param {dvt.BaseEvent} event
 * @param {string} eventType
 * @param {boolean} showEffect Whether the drop target hover effect should be shown.
 * @private
 */
EventManager.prototype._handleDropTargetEvent = function (event, eventType, showEffect) {
  var dropRejected = this._handleDropTargetEventHelper(event, eventType);

  if (!dropRejected) event.preventDefault();

  if (!dropRejected && showEffect) this.ShowDropEffect(event);
  else if (dropRejected && showEffect) this.ShowRejectedDropEffect(event);
  else this.ClearDropEffect();
};

/**
 * The main logic for _handleDropTargetEvent(). Determines whether the drop should be rejected.
 * @param {dvt.BaseEvent} event
 * @param {string} eventType
 * @return {boolean} True if the drop is rejected. False if the drop is accepted.
 * @private
 */
EventManager.prototype._handleDropTargetEventHelper = function (event, eventType) {
  var dropTargetType = this.GetDropTargetType(event);
  if (dropTargetType == null) return true;

  var $event = ToolkitUtils.getEventForSyntax(this._context, event);
  var dropOptions = this._getDropOptions(event);

  // Handle user-defined callback function
  var callback = dropOptions[eventType];
  if (callback) {
    var eventPayload = this.GetDropEventPayload(event);
    var callbackValue = callback($event, eventPayload);
    if (event.getNativeEvent().defaultPrevented) {
      return false;
    } else if (callbackValue != null && !this._context.isCustomElement()) {
      // If there's a return value, don't handle dataTypes
      // Custom element syntax does not support return values
      return callbackValue;
    }
  }

  // Handle dataTypes
  var dataTypes = dropOptions['dataTypes'];
  if (dataTypes != null) {
    // Support single dataType that's defined as a string
    if (!Array.isArray(dataTypes)) dataTypes = [dataTypes];

    // If there's at least one matching dataType, accept the drop
    for (var i = 0; i < dataTypes.length; i++) {
      if ($event.dataTransfer.types && $event.dataTransfer.types.indexOf(dataTypes[i]) >= 0)
        return false;
    }
  }

  return true;
};

/**
 * Dispatches a non bubbling CustomEvent from the root SVG element. This method can be used for
 * firing events out for testing purposes, e.g. after a tooltip is launched.
 * @param {string} eventType The CustomEvent type
 * @param {Object} eventDetail The object that will be passed in the CustomEvent's detail property.
 * @protected
 */
EventManager.prototype.DispatchElementEvent = function (eventType, eventDetail) {
  this.getCtx()
    .getSvgDocument()
    .dispatchEvent(new CustomEvent(eventType, { detail: eventDetail }));
};

// Custom tooltip event handler
/**
 * @constructor
 */
const DvtCustomTooltipEventHandler = function (
  context,
  customTooltipManager,
  callback,
  callbackObj
) {
  this._customTooltipManager = customTooltipManager;
  this.Init(context, callback, callbackObj);
};

Obj.createSubclass(DvtCustomTooltipEventHandler, EventManager);

DvtCustomTooltipEventHandler.prototype.OnClickInternal = function (event) {
  var target = event.target;
  this._handleMenuClick(target);
};

DvtCustomTooltipEventHandler.prototype.HandleImmediateTouchStartInternal = function (event, touch) {
  event.blockTouchHold();
  this._handleMenuClick(event.target);
};

DvtCustomTooltipEventHandler.prototype.HandleTouchClickInternal = function (evt) {
  var target = evt.target;
  this._handleMenuClick(target);
};

DvtCustomTooltipEventHandler.prototype._handleMenuClick = function (targetObj) {
  var actionObj = this._customTooltipManager._actionPopupObj;
  var menuItem = targetObj._menu;
  if (menuItem) {
    // Close before menu item event fired since listener may need restored component visual state
    this._customTooltipManager.closeActionTooltip();
    menuItem.FireActionTooltipItem(actionObj);
  }
};

/**
 * Interactivity manager for custom tooltips and menus.  The two can be visually combined.
 * @class DvtCustomTooltipManager
 * @constructor
 */
const DvtCustomTooltipManager = function (context, id) {
  this.Init(context, id);
};

Obj.createSubclass(DvtCustomTooltipManager, Obj);

DvtCustomTooltipManager.prototype.Init = function (context, id) {
  this._context = context;
  this._id = id;
  this._actionTooltip = new DvtCustomTooltip(this._context, this._id + 'ActionPopup');
};

/*
 * For rendering a rich tooltip
 */
DvtCustomTooltipManager.prototype.GetRichTooltipManager = function () {
  if (!this._RichTooltipManager) {
    var tooltipId = this._id + 'Tooltip';
    // TODO: may want to change tooltip managers to have their own impl
    this._RichTooltipManager = new DvtHtmlRichTooltipManager(this._context, tooltipId);
    this._RichTooltipManager.InitializeTooltipElem();

    // Attach listeners to action tooltip displayable
    var tooltipContext = this._RichTooltipManager.GetStoredContext();
    if (tooltipContext) {
      var eh = new DvtCustomTooltipEventHandler(tooltipContext, this, null, null);
      eh.addListeners(this._actionTooltip);
    }
  }
  return this._RichTooltipManager;
};

// Clear settings on old action tooltip
DvtCustomTooltipManager.prototype.clearActionTooltip = function () {
  if (this._actionTooltip) this._actionTooltip.clearContent();
};

// Retrieve current action tooltip
DvtCustomTooltipManager.prototype.getActionTooltip = function () {
  return this._actionTooltip;
};

// Hide a tooltip that is currently showing
DvtCustomTooltipManager.prototype.hideTooltip = function () {
  this.clearActionTooltip();
  if (this._RichTooltipManager) this._RichTooltipManager.hideTooltip();
};

// Closes an action tooltip that was left on screen
DvtCustomTooltipManager.prototype.closeActionTooltip = function () {
  var closedEvent = EventFactory.newActionTooltipEvent('actionTooltipClosed', this._actionPopupObj);
  this.FireListener(closedEvent);
  this._actionPopupObj = null;
  this.hideTooltip();
};

DvtCustomTooltipManager.prototype.displayActionPopup = function () {
  var actionTooltip = this.getActionTooltip();
  // If no action tooltip initialized with actions (not just tooltips), don't show one
  if (!actionTooltip || !actionTooltip.hasMenuItems()) return false;
  return true;
};

DvtCustomTooltipManager.prototype.startActionPopupAtPosition = function (
  pageX,
  pageY,
  targetObj,
  alignment
) {
  var actionTooltip = this.getActionTooltip();
  if (!actionTooltip) return;

  this.GetRichTooltipManager().showRichElementAtPosition(pageX, pageY, actionTooltip, true, false);

  // Clear the text
  var startEvent = EventFactory.newActionTooltipEvent('actionTooltipStarted', targetObj);
  this.FireListener(startEvent);

  this._actionPopupObj = targetObj;
};

/**
 * Adds an event listener.
 **/
DvtCustomTooltipManager.prototype.addTooltipEventListener = function (type, listener, obj) {
  // Store a reference to the listener
  var listenersArray = this._getListeners(type, true);
  listenersArray.push(listener);
  listenersArray.push(obj);
};

/**
 * Removes an event listener.
 **/
DvtCustomTooltipManager.prototype.removeTooltipEventListener = function (type, listener, obj) {
  // Remove the listener
  var listenersArray = this._getListeners(type, false);
  if (listenersArray !== null) {
    for (var i = 0; i < listenersArray.length; i += 2) {
      if (listenersArray[i] === listener && listenersArray[i + 1] === obj) {
        listenersArray.splice(i, 2);
        break;
      }
    }
  }
};

/**
 * Returns the listeners of the given event type
 **/
DvtCustomTooltipManager.prototype._getListeners = function (type, createNew) {
  // First find the object where the listener arrays are stored
  if (!this._listenerObj) {
    if (createNew) {
      this._listenerObj = {};
    } else {
      return null;
    }
  }

  // Then find the array for this event type, creating if necessary
  var eventKey = type;
  var listenersArray = this._listenerObj[eventKey];
  if (!listenersArray && createNew) {
    listenersArray = [];
    this._listenerObj[eventKey] = listenersArray;
  }

  return listenersArray;
};

/**
 * Notifies all applicable event listeners of the given event.
 **/
DvtCustomTooltipManager.prototype.FireListener = function (event) {
  var listenersArray = this._getListeners(event.type, false);
  if (listenersArray) {
    for (var i = 0; i < listenersArray.length; i += 2) {
      var obj = listenersArray[i + 1];
      listenersArray[i].call(obj, event);
    }
  }
};

/**
 * Returns a formatted version of the tooltip.
 * @param {string} tooltip
 * @return {string}
 * @private
 */
DvtCustomTooltipManager._formatTextString = function (tooltip) {
  var fullText = '';
  if (!tooltip) return fullText;

  tooltip = tooltip.replace(/\n/g, '<br>'); // replace logical newlines sequences
  var tooltipTextArray = tooltip.split('<br>');
  if (tooltipTextArray) {
    var shortArray = new Array();
    for (var i = 0; i < tooltipTextArray.length; i++) {
      var txt = tooltipTextArray[i];
      if (txt != null && txt != '') {
        shortArray.push(txt);
      }
    }
    for (var i = 0; i < shortArray.length; i++) {
      fullText += shortArray[i];
      if (i < shortArray.length - 1) {
        fullText += '\n';
      }
    }
  }
  return fullText;
};

/**
 *  Defines a mask.
 *  @param {dvt.GradientFill} gradient The gradient to use for this mask
 *  @param {dvt.Rectangle} bounds The bounds of this mask
 *  @constructor
 */
const Mask = function (gradient, bounds) {
  this._id = 'mask' + Mask._uniqueSeed++;
  this._gradient = gradient;
  this._bounds = bounds;
};

Obj.createSubclass(Mask, Obj);

/**
 * @private
 */
Mask._uniqueSeed = 0;

/**
 * Returns the ID of the mask
 * @return {String}
 */
Mask.prototype.getId = function () {
  return this._id;
};

/**
 * Returns the DvtGradient for this mask
 * @return {DvtGradient}
 */
Mask.prototype.getGradient = function () {
  return this._gradient;
};

/**
 * Returns the bounds of this mask
 * @return {dvt.Rectangle}
 */
Mask.prototype.getBounds = function () {
  return this._bounds;
};

/**
 * Use element displayable.
 * @param {dvt.Context} context
 * @param {number} x The x-axis coordinate of one corner of the rectangular region into which the referenced element is placed.
 * @param {number} y The y-axis coordinate of one corner of the rectangular region into which the referenced element is placed.
 * @param {Displayable} target The target element.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {Displayable}
 * @class
 * @constructor
 */
const Use = function (context, x, y, target, id) {
  this.Init(context, x, y, target, id);
};

Obj.createSubclass(Use, Displayable);

/** @private **/
Use._uniqueSeed = 0;

/**
 * @param {dvt.Context} context
 * @param {number} x
 * @param {number} y
 * @param {Displayable} target
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
Use.prototype.Init = function (context, x, y, target, id) {
  Use.superclass.Init.call(this, context, 'use', id);

  var targetId = target.getId();
  if (!targetId) {
    targetId = 'use' + Use._uniqueSeed++;
    target.setId(targetId);
  }

  if (context.existsGlobalDefReference(targetId)) context.increaseGlobalDefReference(targetId);
  else {
    var targetElem = target.getElem();
    ToolkitUtils.setAttrNullNS(targetElem, 'id', targetId);
    context.appendDefs(targetElem);
    context.increaseGlobalDefReference(targetId);
  }

  this._targetId = targetId;

  ToolkitUtils.setHref(this._elem, ToolkitUtils.getUrlPathById(targetId));

  this.setX(x).setY(y);
};

// Create SVG property getters and setters
Displayable.defineProps(Use, { x: { value: 0 }, y: { value: 0 } });

/**
 * @override
 */
Use.prototype.destroy = function () {
  this.getCtx().decreaseGlobalDefReference(this._targetId);
  Use.superclass.destroy.call(this);
};

/**
 * Context object corresponding to an SVG document. The constructor creates a SVG document inside the specified
 * container.
 * @param {Element} container The div element under which the SVG document will be created.
 * @param {string} id
 * @param {Element=} referenceDiv An optional div element to use as a reference point for calculating the absolute
 *                                 position of the stage.
 * @extends {Obj}
 * @class Context
 * @constructor
 */
const Context = function (container, id, referenceDiv) {
  // Create the SVG document and add to the container
  var svgId = id ? id + '_svg' : null;
  this._root = ToolkitUtils.createSvgDocument(svgId);
  container.appendChild(this._root); //@HTMLUpdateOK

  // Save a reference to the svg element's parent div for updating the active descendent needed for accessibility
  this._parentDiv = container;

  //  - Fix for flex layout and height inheritance in Chrome and Safari
  this.addSizingSvg();

  // Save any application set aria role so we don't override.
  // Note that we will only respect this if set before we initially render the component.
  this._appAriaRole = this._parentDiv.getAttribute('role');
  this._role = this._appAriaRole;

  // Store a reference to the div used for calculating the absolute position of the stage.
  this._referenceDiv = referenceDiv;

  // Create the defs, and stage
  this._defs = SvgShapeUtils.createElement('defs');
  ToolkitUtils.appendChildElem(this._root, this._defs);

  this._keyboardFocusArray = [];
  this._keyboardFocusIndex = 0;

  this._dndEventManagers = [];

  this.Init(this._root, id);

  // Add the stage element
  ToolkitUtils.appendChildElem(this._root, this._stage.getElem());

  // Since we only support JET in this toolkit version, we're providing a public oj reference
  // for the JET libraries which can be used to access loggers. Use string literals to access
  // the oj object and JET classes.
  this['oj'] = null;
};

Obj.createSubclass(Context, Obj);

/** @private @const */
Context._DEFAULT_FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

/** @private @const */
Context._DEFAULT_FONT_WEIGHT = '400';

/** @private */
Context._id = 0;

/** @const */
Context.DEFAULT_FONT_SIZE = CSSStyle.DEFAULT_FONT_SIZE;
/** @const */
const COMP_ARIA_LABEL = Symbol('componentAriaLabel');

/**
 * Initializes this context object with the platform dependent objects.
 * @param  {DOMElement} root
 * @param  {string} id
 * @protected
 */
Context.prototype.Init = function (root, id) {
  var stageId = (id ? id : '_dvt' + Context._id) + '_stage';
  this._stage = new DvtStage(this, root, stageId); // TODO use naming utils
  Context._id++;

  // Apply the default font properties to the stage for inheritance. Note that these
  // aren't so much defaults, as the most commonly used styles.
  this._normalizedFontFamilyCache = {};
  this.setDefaultFontSize(Context.DEFAULT_FONT_SIZE);
  this.setDefaultFontFamily(Context._DEFAULT_FONT_FAMILY);
  this.setDefaultFontWeight(Context._DEFAULT_FONT_WEIGHT);

  this._tooltipManagers = new Object();
  this._customTooltipManagers = new Object();

  this._scheduler = null;

  //: map of ClipPath objects stored by id
  this._globalDefsMap = {};
};

/**
 * Returns the default CSS font family that is applied to the stage.
 * @return {string}
 */
Context.prototype.getDefaultFontFamily = function () {
  return this._defaultFontFamily;
};

/**
 * Sets the default CSS font family that is applied to the stage. This method should be called before
 * the component is rendered to ensure the component checks its font family against the correct default font family.
 * @param {string} fontFamily The default font family
 */
Context.prototype.setDefaultFontFamily = function (fontFamily) {
  if (fontFamily) {
    this._defaultFontFamily = this._normalizeFontFamily(fontFamily);
    ToolkitUtils.setAttrNullNS(this._stage.getElem(), 'font-family', this.getDefaultFontFamily());
  }
};

/**
 * Returns true if the specified fontFamily is equal to the default (or one of its syntactic equivalents)
 * @param {string} fontFamily The font family to compare
 * @return {boolean} true if the fontFamily is the default, false otherwise
 */
Context.prototype.isDefaultFontFamily = function (fontFamily) {
  if (fontFamily) return this._defaultFontFamily === this._normalizeFontFamily(fontFamily);
  return false;
};

/**
 * Returns the default CSS font size that is applied to the stage.
 * @return {string}
 */
Context.prototype.getDefaultFontSize = function () {
  return this._defaultFontSize;
};

/**
 * Returns the theme behavior of the context.
 * @return {string}
 */
Context.prototype.getThemeBehavior = function () {
  return parseJSONFromFontFamily('oj-theme-json')['behavior'];
};

/**
 * Sets the default CSS font size that is applied to the stage. This method should be called before
 * the component is rendered to ensure the component checks its font size against the correct default font size.
 * @param {string} fontSize The default font size
 */
Context.prototype.setDefaultFontSize = function (fontSize) {
  if (fontSize) {
    this._defaultFontSize = fontSize;
    ToolkitUtils.setAttrNullNS(this._stage.getElem(), 'font-size', this.getDefaultFontSize());
  }
};

/**
 * Returns the default CSS font weight that is applied to the stage.
 * @return {string}
 */
Context.prototype.getDefaultFontWeight = function () {
  return this._defaultFontWeight;
};

/**
 * Sets the default CSS font weight that is applied to the stage. This method should be called before
 * the component is rendered to ensure the component checks its font weight against the correct default font weight.
 * @param {string} fontWeight The default font size
 */
Context.prototype.setDefaultFontWeight = function (fontWeight) {
  if (fontWeight) {
    this._defaultFontWeight = fontWeight;
    ToolkitUtils.setAttrNullNS(this._stage.getElem(), 'font-weight', this.getDefaultFontWeight());
  }
};

/**
 * Normalizes a font family string against all possible variations.
 * @param {string} fontFamily The font family string to normalize
 * @return {string} The normalized font family string
 * @private
 */
Context.prototype._normalizeFontFamily = function (fontFamily) {
  // For example, the following are all equivalent:
  // 1) 'Helvetica Neue', Helvetica, Arial, sans-serif'
  // 2) "Helvetica Neue", Helvetica, Arial, sans-serif'
  // 3) "Helvetica Neue",Helvetica,Arial,sans-serif
  var normalized = this._normalizedFontFamilyCache[fontFamily];
  if (!normalized) {
    normalized = fontFamily.replace(/, /g, ',').replace(/"/g, "'");
    this._normalizedFontFamilyCache[fontFamily] = normalized;
  }
  return normalized;
};

/**
 *  Returns a platform dependent implementation of the one and only
 *  stage.
 *  @return {DvtStage}
 */
Context.prototype.getStage = function () {
  return this._stage;
};

/**
 * Returns true if this Context is ready to support component rendering.  This will be false when the SVG document
 * is not attached to a visible subtree of the DOM.
 * @return {boolean}
 */
Context.prototype.isReadyToRender = function () {
  // Check if the parent div is connected to the DOM and not hidden via display:none. This indicates that
  // we can perform measurement, which is a pre-requisite for us to render.
  if (this._destroyed) return false;
  if (this._parentDiv.offsetParent != null) return true;
  else {
    var computedStyle = window.getComputedStyle(this._parentDiv);
    if (computedStyle && computedStyle.position == 'fixed') return computedStyle.display != 'none';
    else return false;
  }
};

/**
 * Returns the SVG document corresponding to this context instance.
 * @return {Element}
 */
Context.prototype.getSvgDocument = function () {
  return this._root;
};

/**
 * Returns the SVG document used for sizing.
 * @return {Element}
 */
Context.prototype.getSizingSvg = function () {
  return this._sizingSvg;
};

/**
 * Adds the SVG document used for sizing
 */
Context.prototype.addSizingSvg = function () {
  if (!this._sizingSvg) {
    if (Agent.engine === 'blink' || Agent.browser === 'safari') {
      this._root.style.position = 'absolute';
      this._root.style.left = '0px';
      this._root.style.top = '0px';
      this._root.style.padding = 'inherit';
      this._sizingSvg = document.createElementNS(ToolkitUtils.SVG_NS, 'svg');
      this._sizingSvg.style.width = '100%';
      this._sizingSvg.style.height = '100%';
      this.getContainer().appendChild(this._sizingSvg);
    }
  }
};

/**
 * Removes the SVG document used for sizing.
 */
Context.prototype.removeSizingSvg = function () {
  if (this._sizingSvg) {
    this._root.style.removeProperty('position');
    this._root.style.removeProperty('left');
    this._root.style.removeProperty('top');
    this._root.style.removeProperty('padding');
    this.getContainer().removeChild(this._sizingSvg);
    this._sizingSvg = null;
  }
};

/**
 * Specifies the reading direction for the context.  This is used by Agent.isRightToLeft(context) overriding the
 * reading direction from the DOM when specified.
 * @param {string} dir The reading direction string, such as "rtl" or "ltr".
 */
Context.prototype.setReadingDirection = function (dir) {
  this._readingDirection = dir;
};

/**
 * Returns the reading direction for the context, if specified.  Component developers should use Agent.isRightToLeft
 * instead, as that function will determine the reading direction from the DOM when not specified on the context.
 * @return {string} The reading direction string if specified on the context, null otherwise.
 */
Context.prototype.getReadingDirection = function () {
  return this._readingDirection;
};

/**
 * Adds a reference count for the global def element with the given id
 * @param {string} id The id of the global def element
 * @return {boolean} Whether the global def element exists in the map
 */
Context.prototype.existsGlobalDefReference = function (id) {
  return this._globalDefsMap[id] > 0;
};

/**
 * Adds a reference count for the global def element with the given id
 * @param {string} id The id of the global def element
 */
Context.prototype.increaseGlobalDefReference = function (id) {
  // The id of the element must be valid to continue
  if (id == null) return;

  if (this._globalDefsMap[id]) this._globalDefsMap[id]++;
  else this._globalDefsMap[id] = 1;
};

/**
 * Removes a reference count for the global def element with the given id
 * @param {string} id The id of the global def element
 */
Context.prototype.decreaseGlobalDefReference = function (id) {
  // The id of the element must be valid to continue
  if (id == null) return;

  // Update the reference count for this clip path id
  var refCount = this._globalDefsMap[id];
  if (refCount) {
    if (refCount == 1) delete this._globalDefsMap[id];
    else this._globalDefsMap[id] = refCount - 1;
  }

  // If no longer referenced, remove the clip path from the defs
  if (!this._globalDefsMap[id]) this.removeDefsById(id);
};

/**
 * Returns a platform dependent implementation of the one and only
 * tooltip manager.
 * @param {string} id
 * @return {HtmlTooltipManager}
 */
Context.prototype.getTooltipManager = function (id) {
  if (!id) id = '_dvtTooltip';
  var stageId = this.getStage().getId();
  id = id + stageId;
  var manager = this._tooltipManagers[id];
  if (!manager) {
    this._tooltipManagers[id] = new HtmlTooltipManager(this, id);
  }
  return this._tooltipManagers[id];
};

/**
 * Hides tooltips shown by tooltip managers registered with the context
 */
Context.prototype.hideTooltips = function () {
  for (var id in this._tooltipManagers) {
    this._tooltipManagers[id].hideTooltip();
  }
};

/**
 * Removes tooltip divs shown by tooltip managers registered with the context
 */
Context.prototype.releaseTooltipResources = function () {
  for (var id in this._tooltipManagers) {
    this._tooltipManagers[id].releaseTooltipResources();
  }
};

/**
 * Get the single scheduler instance for this context.
 * @return {DvtScheduler}
 */
Context.prototype.getScheduler = function () {
  if (!this._scheduler) {
    this._scheduler = new DvtScheduler(this);
  }

  return this._scheduler;
};

/**
 * Returns the specified page coordinates relative to the stage.
 * @param {number} pageX
 * @param {number} pageY
 * @return {Point}
 */
Context.prototype.pageToStageCoords = function (pageX, pageY) {
  var stagePos = this.getStageAbsolutePosition();
  var xPos = pageX - stagePos.x;
  var yPos = pageY - stagePos.y;
  return new Point(xPos, yPos);
};

/**
 * Returns the specified stage coordinates relative to the page.
 * @param {number} stageX The x coordinate, relative to the stage.
 * @param {number} stageY The y coordinate, relative to the stage.
 * @return {Point}
 */
Context.prototype.stageToPageCoords = function (stageX, stageY) {
  var stagePos = this.getStageAbsolutePosition();
  var xPos = stageX + stagePos.x;
  var yPos = stageY + stagePos.y;
  return new Point(xPos, yPos);
};

/**
 * Returns the coordinates of the stage, relative to the page.  This is an expensive operation which is optimized by
 * using a cache, managed by dvt.EventManager.
 * @return {Point}
 */
Context.prototype.getStageAbsolutePosition = function () {
  // Use a reference element at the same position at the SVG whenever possible.  The browser functions used in Agent's
  // getElementPosition do not always return the correct values for SVG elements, especially in Firefox.  Note that we
  // can ensure the presence of a parent div at the same coordinates across all our supported frameworks, so this
  // issue will never occur in the real product.
  var referenceElem = this._referenceDiv;
  if (!referenceElem) {
    var svgRoot = this.getStage().getSVGRoot();
    referenceElem = svgRoot.parentNode ? svgRoot.parentNode : svgRoot;
  }

  // Note: As mentioned above, this returns the wrong position in Firefox for SVG elements.
  var svgPos = Agent.getElementPosition(referenceElem);

  return new Point(parseInt(svgPos.x), parseInt(svgPos.y));
};

/**
 * Returns true if the SVG for this context is fully offscreen.
 * @param {boolean} noCache Determines whether the cached value will be used
 * @return {boolean}
 */
Context.prototype.isOffscreen = function (noCache) {
  // Use the cached value if available, since the calculation can cause reflow.
  if (this._bOffscreen != null && !noCache) return this._bOffscreen;

  var referenceElem = this.getStage().getSVGRoot();
  var bOffscreen;
  try {
    var rect = referenceElem.getBoundingClientRect();
    bOffscreen =
      rect.bottom < 0 ||
      rect.right < 0 ||
      rect.top > (window.innerHeight || document.documentElement.clientHeight) ||
      rect.left > (window.innerWidth || document.documentElement.clientWidth);
  } catch (e) {
    //IE11 throws 'Unspecified error' exception, when referenceElem is disconnected from the DOM
    bOffscreen = true;
  }

  if (!noCache) this._bOffscreen = bOffscreen;

  return bOffscreen;
};

/**
 * Resets the cached isOffscreen flag.
 */
Context.prototype.resetIsOffscreen = function () {
  this._bOffscreen = null;
};

/**
 * Returns the DvtCustomTooltipManager for the given id.
 * @param {string} id
 * @return {DvtCustomTooltipManager}
 */
Context.prototype.getCustomTooltipManager = function (id) {
  if (!id) id = '_dvtCustomTooltip';
  var stageId = this.getStage().getId();
  id = id + stageId;
  var manager = this._customTooltipManagers[id];
  if (!manager) {
    this._customTooltipManagers[id] = new DvtCustomTooltipManager(this, id);
  }
  return this._customTooltipManagers[id];
};

/**
 * Append element(s) to the application global <defs> element.
 * @param {object} elem
 */
Context.prototype.appendDefs = function (elem) {
  ToolkitUtils.appendChildElem(this._defs, elem);
};

/**
 *   @return {DOM_Element}  the global <defs> DOM element
 */
Context.prototype.getDefs = function () {
  return this._defs;
};

/**
 * Removes the specified element from the global <defs> element.
 * @param {object} elem
 */
Context.prototype.removeDefs = function (elem) {
  if (elem._obj) elem._obj.destroy();
  this._defs.removeChild(elem);
};

/**
 * Removes the element with the specified id from the global <defs> element.
 * @param {string} id
 */
Context.prototype.removeDefsById = function (id) {
  var defs = this._defs.childNodes;
  var len = defs.length;
  for (var i = 0; i < len; i++) {
    var def = defs[i];
    if (def.id === id) {
      this.removeDefs(def);
      return;
    }
  }
};

/**
 * Returns the value of the attribute on the root element
 * @param {string} attrName Attribute name
 * @return {string} value of the attribute
 */
Context.prototype.getRootAttribute = function (attrName) {
  return ToolkitUtils.getAttrNullNS(this._root, attrName);
};

/**
 * Clears all unique seeds used for filter, clip path, gradient id generation.
 * Should only be called by puppeteer tests.
 */
Context.resetUniqueSeeds = function () {
  DvtSvgFilterUtils._counter = 0;
  ClipPath._uniqueSeed = 0;
  SvgShapeUtils._uniqueSeed = 0;
  Mask._uniqueSeed = 0;
  Use._uniqueSeed = 0;
  Agent._bInitialized = false;
};

/**
 * Clears all caches used for text.
 * Should only be called by puppeteer tests.
 */
Context.resetCaches = function () {
  TextUtils.clearCaches();
};

/**
 * Sets the wai-aria active-descendent to be the given displayable.
 * @param {dvt.Displayable} displayable The new active displayable.
 */
Context.prototype.setActiveElement = function (displayable) {
  // Clear the id of the current active element.  This field is only set if a temp id was applied earlier.
  if (this._activeElement) {
    ToolkitUtils.removeAttrNullNS(this._activeElement.getElem(), 'id');
    this._activeElement = null;
  }

  // Get the DOM ID of the elem. If it doesn't have an ID, create one for it.
  var elem = displayable.getElem();
  var id = ToolkitUtils.getAttrNullNS(elem, 'id');
  if (!id) {
    id = Context._generateActiveElementId(displayable);
    ToolkitUtils.setAttrNullNS(elem, 'id', id);
    this._activeElement = displayable;
  }

  // Ensure that aria properties have been written to the DOM
  displayable.applyAriaProperties();

  // Update the active descendant to point to the displayable
  if (this._role == 'application') this._parentDiv.setAttribute('aria-activedescendant', id);
};

Context._generateActiveElementId = function (displayable) {
  var randomizedPrefix =
    '_dvtActiveElement' + (Agent.isEnvironmentTest() ? '' : Math.floor(Math.random() * 1000000000)); //@RandomNumberOK
  var dispId = displayable.getId();
  // Use the displayable ID as a suffix if it's a string or a number
  if (
    typeof dispId === 'string' ||
    dispId instanceof String ||
    typeof dispId === 'number' ||
    dispId instanceof Number
  ) {
    return randomizedPrefix + '_' + dispId;
  } else {
    return randomizedPrefix;
  }
};

/**
 * Sets the wai-aria label property on the containing div.
 * @param {string} ariaLabel
 */
Context.prototype.setAriaLabel = function (ariaLabel) {
  // Don't overwrite application set aria-label
  if (!this._parentDiv.getAttribute('aria-label') || this._parentDiv[COMP_ARIA_LABEL]) {
    this._parentDiv[COMP_ARIA_LABEL] = true;
    if (ariaLabel) {
      this._parentDiv.setAttribute('aria-label', AriaUtils.processAriaLabel(ariaLabel));
    } else this._parentDiv.removeAttribute('aria-label');
  }
};

/**
 * Sets the wai-aria role property on the containing div.
 * @param {string} role
 */
Context.prototype.setAriaRole = function (role) {
  if (!this._appAriaRole) {
    if (role) this._parentDiv.setAttribute('role', role);
    else this._parentDiv.removeAttribute('role');

    this._role = role;
  }
};

/**
 * Sets the callback to be invoked when the tooltip is attached. Used in JET to support JET components in the custom
 * tooltips.
 * @param {function} callback
 */
Context.prototype.setTooltipAttachedCallback = function (callback) {
  this._tooltipAttachedCallback = callback;
};

/**
 * Returns the callback to be invoked when the tooltip is attached. Used in JET to support JET components in the custom
 * tooltips.
 * @return {?function}
 */
Context.prototype.getTooltipAttachedCallback = function () {
  return this._tooltipAttachedCallback;
};

/**
 * Reset current keyboard focus after focus event
 * Move to the first component on plain TAB or last component on SHIFT+TAB
 * @param {object} event the DOM event object
 */
Context.prototype.resetCurrentKeyboardFocus = function (event) {
  if (!this._keyboardFocusArray || this._keyboardFocusArray.length === 0) return;
  if (event.keyCode == KeyboardEvent.TAB && event.shiftKey) {
    this.setCurrentKeyboardFocus(this._keyboardFocusArray[this._keyboardFocusArray.length - 1]);
  } else if (event.keyCode == KeyboardEvent.TAB) {
    this.setCurrentKeyboardFocus(this._keyboardFocusArray[0]);
  }
};

/**
 * Sets an array of keyboard listeners that are connected through tabbing. The context will initially focus on
 * the first component in the array. Shift the focus to the next/previous component using nextKeyboardFocus() and
 * previousKeyboardFocus().
 * @param {array} displayables Array of keyboard listeners.
 */
Context.prototype.setKeyboardFocusArray = function (displayables) {
  this._keyboardFocusArray = displayables;
  this._keyboardFocusIndex = 0;

  if (displayables.length > 0) {
    var wrappingDiv = this._root.parentNode;
    wrappingDiv._currentObj = this._keyboardFocusArray[this._keyboardFocusIndex];
  }
};

/**
 * Returns the component of the current Keyboard Focus.
 * @return {dvt.Displayable} The current component.
 */
Context.prototype.getCurrentKeyboardFocus = function () {
  if (this._keyboardFocusArray.length <= this._keyboardFocusIndex) {
    return null;
  } else {
    return this._keyboardFocusArray[this._keyboardFocusIndex];
  }
};

/**
 * Sets the current Keyboard Focus.
 * @param {dvt.Displayable} newKeyboardFocus component that the current keyboard focus will be set to.
 * @return {boolean} Whether the Focus was successfully set.
 */
Context.prototype.setCurrentKeyboardFocus = function (newKeyboardFocus) {
  var newFocusIndex = this._keyboardFocusArray.indexOf(newKeyboardFocus);
  if (newFocusIndex == -1) {
    return false;
  }
  var currentObj = this._keyboardFocusArray[newFocusIndex];
  this._keyboardFocusIndex = newFocusIndex;
  var wrappingDiv = this._root.parentNode;
  wrappingDiv._currentObj = currentObj;
  return true;
};

/**
 * Shifts the keyboard focus to the next component and returns the component.
 * @return {dvt.Displayable} The next component.
 */
Context.prototype.nextKeyboardFocus = function () {
  var currentObj = this._keyboardFocusArray[this._keyboardFocusIndex + 1];
  if (currentObj) {
    this._keyboardFocusIndex++;
    var wrappingDiv = this._root.parentNode;
    wrappingDiv._currentObj = currentObj;
    return currentObj;
  } else {
    return null;
  }
};

/**
 * Shifts the keyboard focus to the previous component and returns the component.
 * @return {dvt.Displayable} The next component.
 */
Context.prototype.previousKeyboardFocus = function () {
  var currentObj = this._keyboardFocusArray[this._keyboardFocusIndex - 1];
  if (currentObj) {
    this._keyboardFocusIndex--;
    var wrappingDiv = this._root.parentNode;
    wrappingDiv._currentObj = currentObj;
    return currentObj;
  } else {
    return null;
  }
};

/**
 * Returns a number converter if it's set by the consuming framework layer. Supported options
 * are limited to minimumFractionDigits and maximumFractionDigits.
 * @param {object} options containing the minimumFractionDigits and maximumFractionDigits.
 * @return {object} the converter or null
 */
Context.prototype.getNumberConverter = function (options) {
  var localeHelpers = this.getLocaleHelpers();
  if (localeHelpers.createNumberConverter) return localeHelpers.createNumberConverter(options);

  return null;
};

/**
 * Returns the localeHelpers object or an empty object if none are defined.
 * @return {object}
 */
Context.prototype.getLocaleHelpers = function () {
  return this._localeHelpers ? this._localeHelpers : {};
};

/**
 * Sets the localeHelpers object, which may contain isoToDateConverter, dateToIsoConverter, and numberConverterFactory.
 * @param {object} helpers
 */
Context.prototype.setLocaleHelpers = function (helpers) {
  this._localeHelpers = helpers;
};

/**
 * Polyfill for requestAnimationFrame.
 * @param {function} callback The function that will be executed.
 * @return {number} A long integer value that uniquely identifies the entry in the callback list. This can be passed to
 *                  Context.cancelAnimationFrame to cancel the request.
 */
Context.requestAnimationFrame = DvtAnimationFrameUtils.requestAnimationFrame;

/**
 * Polyfill for cancelAnimationFrame.
 * @param {number} requestId A long integer value that uniquely identifies the entry in the callback list.
 */
Context.cancelAnimationFrame = DvtAnimationFrameUtils.cancelAnimationFrame;

/**
 * Returns the parent div of the context
 * @return {Element}
 */
Context.prototype.getContainer = function () {
  return this._parentDiv;
};

/**
 * Returns a new div that is used to hold custom content that overlays
 * the component.
 * @return {Element}
 */
Context.prototype.createOverlayDiv = function () {
  var overlayDiv = document.createElement('div');
  overlayDiv.style.top = '-100%';
  overlayDiv.style.position = 'relative';
  return overlayDiv;
};

/**
 * Sets the callback to be invoked when the overlay is attached. Used in JET to support JET components in the custom
 * center content.
 * @param {function} callback
 */
Context.prototype.setOverlayAttachedCallback = function (callback) {
  this._overlayAttachedCallback = callback;
};

/**
 * Returns the callback to be invoked when the overlay is attached. Used in JET to support JET components in the custom
 * center content.
 * @return {?function}
 */
Context.prototype.getOverlayAttachedCallback = function () {
  return this._overlayAttachedCallback;
};

/**
 * Registers an event manager that supports DnD. When there are multiple event managers, they all listen to the same
 * DnD events since the the events are fired by the outerDiv, so this keeps track of the order in which the listeners
 * would be called.
 * @param {dvt.EventManager} em
 */
Context.prototype.addDndEventManager = function (em) {
  this._dndEventManagers.push(em);
};

/**
 * Unregister a DnD event manager.
 * @param {dvt.EventManager} em
 */
Context.prototype.removeDndEventManager = function (em) {
  var index = this._dndEventManagers.indexOf(em);
  this._dndEventManagers.splice(index, 1);
};

/**
 * Returns whether this is the last event manager that would be fired when there's a DnD event.
 * @param {dvt.EventManager} em
 * @return {boolean}
 */
Context.prototype.isLastDndEventManager = function (em) {
  return this._dndEventManagers[this._dndEventManagers.length - 1] === em;
};

/**
 * Sets a callback used to fix the renderer context for JET DVTs.
 * @param {function} callback
 */
Context.prototype.setFixContextCallback = function (callback) {
  this._fixContextCallback = callback;
};

/**
 * Prepares a custom renderer context object by calling a provided callback for
 * fixing a renderer context if one exists.
 * @param {Object} rendererContext
 * @return {Object}
 */
Context.prototype.fixRendererContext = function (rendererContext) {
  if (this._fixContextCallback) return this._fixContextCallback(rendererContext);
  return rendererContext;
};

/**
 * Sets whether or not the JET component was created as a custom element or not
 * @param {boolean} customElement True if the JET component was created as a custom element, false otherwise
 */
Context.prototype.setCustomElement = function (customElement) {
  this._customElement = customElement;
};

/**
 * Gets whether or not the JET component was created as a custom element or not
 * @return {boolean} True if the JET component was created as a custom element, false otherwise
 */
Context.prototype.isCustomElement = function () {
  return this._customElement;
};

/**
 * Marks context as destroyed. Called by ojdvt-base on component destruction.
 */
Context.prototype.destroy = function () {
  this._destroyed = true;
};

/**
 * Stores the JET references.
 * @param {Object} properties object with JET references as keys
 */
Context.prototype.setJetProperties = function (properties) {
  this._jetProps = properties;
  Object.assign(this, properties);
};

/**
 * Returns stored JET references
 * @return {Object} object with jet references as keys
 */
Context.prototype.getJetProperties = function () {
  return this._jetProps;
};

// Factory function to avoid circular dependendencies
Context.prototype.createContext = function (container, id, referenceDiv) {
  var context = new Context(container, id, referenceDiv);
  context.setJetProperties(this.getJetProperties());
  return context;
};

/**
 * Class defining easing functions for animations.
 * @extends {Obj}
 * @class Easing
 * @constructor
 */
const Easing = function () {
  this.Init();
};

Obj.createSubclass(Easing, Obj);

/**
 * Linear easing function.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @type {number}
 */
Easing.linear = function (progress) {
  return progress;
};

/**
 * Quadratic easing function that starts slow and speeds up at the beginning.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @type {number}
 */
Easing.quadraticIn = function (progress) {
  return Easing.PolyIn(progress, 2);
};

/**
 * Quadratic easing function that starts fast and slows down at the end.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @type {number}
 */
Easing.quadraticOut = function (progress) {
  return Easing.PolyOut(progress, 2);
};

/**
 * Quadratic easing function that starts slow, speeds up, and then slows down at the end.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @type {number}
 */
Easing.quadraticInOut = function (progress) {
  return Easing.PolyInOut(progress, 2);
};

/**
 * Cubic easing function that starts slow and speeds up at the beginning.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @type {number}
 */
Easing.cubicIn = function (progress) {
  return Easing.PolyIn(progress, 3);
};

/**
 * Cubic easing function that starts fast and slows down at the end.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @type {number}
 */
Easing.cubicOut = function (progress) {
  return Easing.PolyOut(progress, 3);
};

/**
 * Cubic easing function that starts slow, speeds up, and then slows down at the end.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @type {number}
 */
Easing.cubicInOut = function (progress) {
  return Easing.PolyInOut(progress, 3);
};

/**
 * Cubic easing function that starts fast and slows down at the end,
 * overshooting the target and then coming back.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @param {number}  overshoot  value to overshoot, with higher values
 *        overshooting more (value of 0 means no overshoot,
 *        default value of 1.7 overshoots by about 10%)
 * @type {number}
 */
Easing.backOut = function (progress, overshoot) {
  //t = progress, s = overshoot
  //(s+1)*t^3 - s*t^2
  if (!overshoot) {
    overshoot = 1.70158;
  }
  progress = 1 - progress;
  return 1 - progress * progress * ((overshoot + 1) * progress - overshoot);
};

/**
 * Cubic easing function that starts slow and speeds up at the beginning,
 * overshooting the starting value in the opposite direction and then
 * proceeding forward.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @param {number}  overshoot  value to overshoot, with higher values
 *        overshooting more (value of 0 means no overshoot,
 *        default value of 1.7 overshoots by about 10%)
 * @type {number}
 */
Easing.backIn = function (progress, overshoot) {
  //t = progress, s = overshoot
  //(s+1)*t^3 - s*t^2
  if (!overshoot) {
    overshoot = 1.70158;
  }
  return progress * progress * ((overshoot + 1) * progress - overshoot);
};

/**
 * Easing function that oscillates at the start with an exponentially
 * decaying sine wave.
 *
 * @param {number}  progress  percent progress of the animation
 * @param {number}  amplitude  amplitude of the sine wave
 * @param {number}  period  period of the sine wave
 * @type {number}
 */
Easing.elasticIn = function (progress, amplitude, period) {
  if (progress <= 0 || progress >= 1) {
    return progress;
  }
  if (!period) {
    period = 0.45;
  }
  var s;
  if (!amplitude || amplitude < 1) {
    amplitude = 1;
    s = period / 4;
  } else {
    s = (period / (2 * Math.PI)) * Math.asin(1 / amplitude);
  }
  return -(
    amplitude *
    Math.pow(2, 10 * (progress -= 1)) *
    Math.sin(((progress - s) * (2 * Math.PI)) / period)
  );
};

/**
 * Easing function that oscillates at the end with an exponentially
 * decaying sine wave.
 *
 * @param {number}  progress  percent progress of the animation
 * @param {number}  amplitude  amplitude of the sine wave
 * @param {number}  period  period of the sine wave
 * @type {number}
 */
Easing.elasticOut = function (progress, amplitude, period) {
  return 1 - Easing.elasticIn(1 - progress, amplitude, period);
};

/**
 * @protected
 * Polynomial easing function that starts slow and speeds up at the beginning.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @param {number}  exp  exponent of the polynomial
 * @type {number}
 */
Easing.PolyIn = function (progress, exp) {
  if (progress < 0) {
    return 0;
  }
  if (progress > 1) {
    return 1;
  } else {
    return Math.pow(progress, exp);
  }
};

/**
 * @protected
 * Polynomial easing function that starts fast and slows down at the end.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @param {number}  exp  exponent of the polynomial
 * @type {number}
 */
Easing.PolyOut = function (progress, exp) {
  if (progress < 0) {
    return 0;
  }
  if (progress > 1) {
    return 1;
  } else {
    return 1 - Math.pow(1 - progress, exp);
  }
};

/**
 * @protected
 * Polynomial easing function that starts slow, speeds up, and then slows down at the end.
 * Returns the percent progress of the animation after applying the easing function.
 * @param {number}  progress  percent progress of the animation
 * @param {number}  exp  exponent of the polynomial
 * @type {number}
 */
Easing.PolyInOut = function (progress, exp) {
  if (progress < 0) {
    return 0;
  }
  if (progress > 1) {
    return 1;
  }
  if (progress < 0.5) {
    return 0.5 * Math.pow(2 * progress, exp);
  } else {
    return 0.5 * (2 - Math.pow(2 * (1 - progress), exp));
  }
};

/**
 * @protected
 */
Easing.prototype.Init = function () {};

/**
 * Class defining interpolation functions for animations.
 * @extends {Obj}
 * @class DvtInterpolator
 * @constructor
 */
const DvtInterpolator = function () {
  this.Init();
};

Obj.createSubclass(DvtInterpolator, Obj);

DvtInterpolator.TYPE_NUMBER = 'typeNumber';
DvtInterpolator.TYPE_MATRIX = 'typeMatrix';
DvtInterpolator.TYPE_NUMBER_ARRAY = 'typeNumberArray';
DvtInterpolator.TYPE_COLOR = 'typeColor';
DvtInterpolator.TYPE_COLOR_ARRAY = 'typeColorArray';
DvtInterpolator.TYPE_GROW_POLYLINE = 'typeGrowPolyline';
DvtInterpolator.TYPE_RECTANGLE = 'typeRectangle';
DvtInterpolator.TYPE_POINT = 'typePoint';
DvtInterpolator.TYPE_PATH = 'typePath';
DvtInterpolator.TYPE_GROW_PATH = 'typeGrowPath';
DvtInterpolator.TYPE_FILL = 'typeFill';
DvtInterpolator.TYPE_STROKE = 'typeStroke';
DvtInterpolator.TYPE_POLYLINE = 'typePolyline';

/**
 * Interpolate a value between the original and destination values for the
 * given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {string}  type  type of value being interpolated
 * @param  origVal  original property value
 * @param  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 */
DvtInterpolator.interpolate = function (context, type, origVal, destVal, progress) {
  //don't pin progress, so that we can do elastic type easing functions,
  //like backIn and backOut for popIn and popOut anims
  /*if (progress <= 0)
  {
    return origVal;
  }

  if (progress >= 1)
  {
    return destVal;
  }*/

  var interpolatorFunc = DvtInterpolator._getInterpolator(type);
  if (interpolatorFunc) {
    return interpolatorFunc(context, origVal, destVal, progress);
  }

  return destVal;
};

/**
 * @private
 * Get the interpolator to use for the given type of value.
 * @param {string}  type  type of value to interpolate
 * @type {function}
 */
DvtInterpolator._getInterpolator = function (type) {
  return DvtInterpolator._map[type];
};

/**
 * Interpolate a number between the original and destination values for the
 * given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {number}
 * @protected
 */
DvtInterpolator.InterpolateNumber = function (context, origVal, destVal, progress) {
  //return (origVal + progress * (destVal - origVal));
  return DvtMath.interpolateNumber(origVal, destVal, progress);
};

/**
 * Interpolate an array of numbers between the original and destination
 * values for the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {array}
 * @protected
 */
DvtInterpolator.InterpolateNumberArray = function (context, origVal, destVal, progress) {
  var origLength = origVal.length;
  var destLength = destVal.length;
  var array = [];
  for (var i = 0; i < Math.max(origLength, destLength); i++) {
    //if one array is shorter than the other, use the last actual value
    //from the shorter array to interpolate with all the extra elements
    //in the longer array
    var n1;
    var n2;
    if (i < origLength) {
      n1 = origVal[i];
    } else {
      n1 = origVal[origLength - 1];
    }
    if (i < destLength) {
      n2 = destVal[i];
    } else {
      n2 = destVal[destLength - 1];
    }
    array.push(DvtInterpolator.InterpolateNumber(context, n1, n2, progress));
  }
  return array;
};

/**
 * Interpolate a matrix between the original and destination values for the
 * given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {Matrix}  origVal  original property value
 * @param {Matrix}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {Matrix}
 * @protected
 */
DvtInterpolator.InterpolateMatrix = function (context, origVal, destVal, progress) {
  var newA = DvtInterpolator.InterpolateNumber(context, origVal.getA(), destVal.getA(), progress);
  var newB = DvtInterpolator.InterpolateNumber(context, origVal.getB(), destVal.getB(), progress);
  var newC = DvtInterpolator.InterpolateNumber(context, origVal.getC(), destVal.getC(), progress);
  var newD = DvtInterpolator.InterpolateNumber(context, origVal.getD(), destVal.getD(), progress);
  var newTx = DvtInterpolator.InterpolateNumber(
    context,
    origVal.getTx(),
    destVal.getTx(),
    progress
  );
  var newTy = DvtInterpolator.InterpolateNumber(
    context,
    origVal.getTy(),
    destVal.getTy(),
    progress
  );

  return new Matrix(newA, newB, newC, newD, newTx, newTy);
};

/**
 * Interpolate a color between the original and destination values for the
 * given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @protected
 */
DvtInterpolator.InterpolateColor = function (context, origVal, destVal, progress) {
  return ColorUtils.interpolateColor(origVal, destVal, progress);
};

/**
 * Interpolate an array of colors between the original and destination
 * values for the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {array}
 * @protected
 */
DvtInterpolator.InterpolateColorArray = function (context, origVal, destVal, progress) {
  var origLength = origVal.length;
  var destLength = destVal.length;
  var array = [];
  for (var i = 0; i < Math.max(origLength, destLength); i++) {
    //if one array is shorter than the other, use the last actual value
    //from the shorter array to interpolate with all the extra elements
    //in the longer array
    var n1;
    var n2;
    if (i < origLength) {
      n1 = origVal[i];
    } else {
      n1 = origVal[origLength - 1];
    }
    if (i < destLength) {
      n2 = destVal[i];
    } else {
      n2 = destVal[destLength - 1];
    }
    array.push(DvtInterpolator.InterpolateColor(context, n1, n2, progress));
  }
  return array;
};

/**
 * Interpolate an array of polyline points between the original and
 * destination values for the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {array}
 * @protected
 */
DvtInterpolator.InterpolateGrowPolyline = function (context, origVal, destVal, progress) {
  if (progress === 0) {
    return [destVal[0], destVal[1]];
  } else if (progress === 1) {
    return destVal;
  }

  var destLength = destVal.length;
  var array = [destVal[0], destVal[1]];
  var totalLength = DvtInterpolator.CalcPolylineLength(destVal);
  var partialLength = progress * totalLength;
  var accumLength = 0;
  var currSegLength;
  for (var i = 2; i < destLength - 1; i += 2) {
    var x1 = destVal[i - 2];
    var y1 = destVal[i - 1];
    var x2 = destVal[i];
    var y2 = destVal[i + 1];

    currSegLength = DvtInterpolator.CalcPolylineLength([x1, y1, x2, y2]);

    if (accumLength + currSegLength > partialLength) {
      var ratio = (partialLength - accumLength) / currSegLength;
      var diffX = x2 - x1;
      var diffY = y2 - y1;
      array.push(x1 + ratio * diffX);
      array.push(y1 + ratio * diffY);
      break;
    } else {
      accumLength += currSegLength;

      array.push(x2);
      array.push(y2);
    }
  }
  return array;
};

/**
 * Interpolate an array of path commands between the original and
 * destination values for the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {array}
 * @protected
 */
DvtInterpolator.InterpolateGrowPath = function (context, origVal, destVal, progress) {
  if (progress === 0) {
    return [destVal[0], destVal[1]];
  } else if (progress === 1) {
    return destVal;
  }

  var destLength = destVal.length;
  var array = [];
  var totalLength = DvtInterpolator.CalcPathLength(destVal);
  var partialLength = progress * totalLength;
  var accumLength = 0;
  var currSegLength;
  var x1;
  var y1;
  var cpx1;
  var cpy1;
  var cpx2;
  var cpy2;
  var prevX;
  var prevY;
  for (var i = 0; i < destLength; i++) {
    var cmd = destVal[i];
    var segArray;
    switch (cmd) {
      case 'M':
        x1 = destVal[++i];
        y1 = destVal[++i];
        prevX = x1;
        prevY = y1;
        segArray = [prevX, prevY, prevX, prevY];
        break;
      case 'L':
        x1 = destVal[++i];
        y1 = destVal[++i];
        segArray = [prevX, prevY, x1, y1];
        break;
      case 'Q':
        cpx1 = destVal[++i];
        cpy1 = destVal[++i];
        x1 = destVal[++i];
        y1 = destVal[++i];
        segArray = [prevX, prevY, x1, y1];
        break;
      case 'C':
        cpx1 = destVal[++i];
        cpy1 = destVal[++i];
        cpx2 = destVal[++i];
        cpy2 = destVal[++i];
        x1 = destVal[++i];
        y1 = destVal[++i];
        segArray = [prevX, prevY, x1, y1];
        break;
    }

    currSegLength = DvtInterpolator.CalcPolylineLength(segArray);

    if (accumLength + currSegLength > partialLength) {
      var ratio = (partialLength - accumLength) / currSegLength;

      array.push(cmd);
      switch (cmd) {
        case 'Q':
          array.push(prevX + ratio * (cpx1 - prevX), prevY + ratio * (cpy1 - prevY));
          break;
        case 'C':
          array.push(
            prevX + ratio * (cpx1 - prevX),
            prevY + ratio * (cpy1 - prevY),
            prevX + ratio * (cpx2 - prevX),
            prevY + ratio * (cpy2 - prevY)
          );
          break;
      }
      array.push(prevX + ratio * (x1 - prevX), prevY + ratio * (y1 - prevY));
      break;
    } else {
      accumLength += currSegLength;

      array.push(cmd);
      switch (cmd) {
        case 'Q':
          array.push(cpx1, cpy1);
          break;
        case 'C':
          array.push(cpx1, cpy1, cpx2, cpy2);
          break;
      }
      array.push(x1);
      array.push(y1);
    }
    prevX = x1;
    prevY = y1;
  }
  return array;
};

DvtInterpolator.CalcPolylineLength = function (arPoints) {
  var length = 0;
  var oldX;
  var oldY;
  var xx;
  var yy;
  for (var i = 0; i < arPoints.length; i += 2) {
    xx = arPoints[i];
    yy = arPoints[i + 1];

    if (i > 0) {
      if (xx === oldX) {
        length += Math.abs(yy - oldY);
      } else if (yy === oldY) {
        length += Math.abs(xx - oldX);
      } else {
        var diffX = Math.abs(xx - oldX);
        var diffY = Math.abs(yy - oldY);
        length += Math.sqrt(diffX * diffX + diffY * diffY);
      }
    }

    oldX = xx;
    oldY = yy;
  }
  return length;
};

DvtInterpolator.CalcPathLength = function (arPoints) {
  var length = 0;
  var oldX;
  var oldY;
  var xx;
  var yy;
  var cmd;
  for (var i = 0; i < arPoints.length; ) {
    cmd = arPoints[i];
    switch (cmd) {
      case 'M':
        xx = arPoints[i + 1];
        yy = arPoints[i + 2];
        oldX = xx;
        oldY = yy;
        i += 3;
        continue;
        break;
      case 'L':
        xx = arPoints[i + 1];
        yy = arPoints[i + 2];
        i += 3;
        break;
      case 'Q':
        xx = arPoints[i + 3];
        yy = arPoints[i + 4];
        i += 5;
        break;
      case 'C':
        xx = arPoints[i + 5];
        yy = arPoints[i + 6];
        i += 7;
        break;
    }

    if (i > 0) {
      if (xx === oldX) {
        length += Math.abs(yy - oldY);
      } else if (yy === oldY) {
        length += Math.abs(xx - oldX);
      } else {
        var diffX = Math.abs(xx - oldX);
        var diffY = Math.abs(yy - oldY);
        length += Math.sqrt(diffX * diffX + diffY * diffY);
      }
    }

    oldX = xx;
    oldY = yy;
  }
  return length;
};

/**
 * Interpolate a rectangle between the original and destination values for
 * the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {Rectangle}  origVal  original property value
 * @param {Rectangle}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {Rectangle}
 * @protected
 */
DvtInterpolator.InterpolateRectangle = function (context, origVal, destVal, progress) {
  var newX = DvtInterpolator.InterpolateNumber(context, origVal.x, destVal.x, progress);
  var newY = DvtInterpolator.InterpolateNumber(context, origVal.y, destVal.y, progress);
  var newW = DvtInterpolator.InterpolateNumber(context, origVal.w, destVal.w, progress);
  var newH = DvtInterpolator.InterpolateNumber(context, origVal.h, destVal.h, progress);

  return new Rectangle(newX, newY, newW, newH);
};

/**
 * Interpolate a point between the original and destination values for
 * the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {Point}  origVal  original property value
 * @param {Point}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {Point}
 * @protected
 */
DvtInterpolator.InterpolatePoint = function (context, origVal, destVal, progress) {
  var newX = DvtInterpolator.InterpolateNumber(context, origVal.x, destVal.x, progress);
  var newY = DvtInterpolator.InterpolateNumber(context, origVal.y, destVal.y, progress);

  return new Point(newX, newY);
};

/**
 * Interpolate a path between the original and destination
 * values for the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {array}
 * @protected
 */
DvtInterpolator.InterpolatePath = function (context, origVal, destVal, progress) {
  var origLength = origVal.length;
  var destLength = destVal.length;
  //TO DO:
  //for now, if the paths are not of equal length, just return the dest val
  if (origLength != destLength) {
    return destVal;
  }

  var array = [];
  var i = 0;
  var j = 0;
  for (; i < origLength && j < destLength; ) {
    var n1 = origVal[i];
    var n2 = destVal[j];
    var bNumberN1 = !isNaN(n1);
    var bNumberN2 = !isNaN(n2);
    if (!bNumberN1 && !bNumberN2) {
      if (n1 === n2) {
        array.push(n1);
      }
      //TO DO: handle case where commands are different
    } else if (bNumberN1 && bNumberN2) {
      array.push(DvtInterpolator.InterpolateNumber(context, n1, n2, progress));
    }
    i++;
    j++;
  }
  return array;
};

/**
 * Interpolate a fill between the original and destination values for the
 * given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @protected
 */
DvtInterpolator.InterpolateFill = function (context, origVal, destVal, progress) {
  if (origVal instanceof SolidFill && destVal instanceof SolidFill) {
    var color = DvtInterpolator.InterpolateColor(
      context,
      origVal.getColor(),
      destVal.getColor(),
      progress
    );
    var alpha = DvtInterpolator.InterpolateNumber(
      context,
      origVal.getAlpha(),
      destVal.getAlpha(),
      progress
    );
    return new SolidFill(color, alpha);
  }

  return destVal;
};

/**
 * Interpolate a stroke between the original and destination values for the
 * given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @protected
 */
DvtInterpolator.InterpolateStroke = function (context, origVal, destVal, progress) {
  if (origVal instanceof Stroke && destVal instanceof Stroke) {
    var color = DvtInterpolator.InterpolateColor(
      context,
      origVal.getColor(),
      destVal.getColor(),
      progress
    );
    var alpha = DvtInterpolator.InterpolateNumber(
      context,
      origVal.getAlpha(),
      destVal.getAlpha(),
      progress
    );
    var width = DvtInterpolator.InterpolateNumber(
      context,
      origVal.getWidth(),
      destVal.getWidth(),
      progress
    );
    //clone the destVal because it may have other properties set that
    //we can't interpolate between
    return new Stroke(
      color,
      alpha,
      width,
      destVal.isFixedWidth(),
      destVal.getDashProps(),
      destVal.getLineProps()
    );
  }

  return destVal;
};

/**
 * Interpolate an array of polyline coordinates between the original and
 * destination values for the given percent progress.
 * @param {dvt.Context}  context  platform specific context object
 * @param {number}  origVal  original property value
 * @param {number}  destVal  destination property value
 * @param {number}  progress  percent progress to interpolate
 * @type {array}
 * @protected
 */
DvtInterpolator.InterpolatePolyline = function (context, origVal, destVal, progress) {
  var origLength = origVal.length;
  var destLength = destVal.length;
  var array = [];
  for (var i = 0; i < Math.max(origLength, destLength); i++) {
    //if one array is shorter than the other, use the last actual coords
    //from the shorter array to interpolate with all the extra coords
    //in the longer array
    //: use the last coordinate pair, not just the last
    //element in the array
    var endOffset = 2;
    if (i % 2 == 1) {
      endOffset = 1;
    }
    var n1;
    var n2;
    if (i < origLength) {
      n1 = origVal[i];
    } else {
      n1 = origVal[origLength - endOffset];
    }
    if (i < destLength) {
      n2 = destVal[i];
    } else {
      n2 = destVal[destLength - endOffset];
    }
    array.push(DvtInterpolator.InterpolateNumber(context, n1, n2, progress));
  }

  //trim the array to remove redundant coords at the end
  if (destLength < origLength) {
    var arLength = array.length;
    var lastX = array[arLength - 2];
    var lastY = array[arLength - 1];
    for (var i = arLength - 4; i >= 0; i -= 2) {
      var currX = array[i];
      var currY = array[i + 1];
      if (currX == lastX && currY == lastY) {
        array.splice(i, 2);
      } else {
        break;
      }
    }
  }

  return array;
};

/**
 * @protected
 */
DvtInterpolator.prototype.Init = function () {};

//need to define the map after the functions are defined above
/**
 * @private
 */
DvtInterpolator._map = {};
DvtInterpolator._map[DvtInterpolator.TYPE_NUMBER] = DvtInterpolator.InterpolateNumber;
DvtInterpolator._map[DvtInterpolator.TYPE_MATRIX] = DvtInterpolator.InterpolateMatrix;
DvtInterpolator._map[DvtInterpolator.TYPE_NUMBER_ARRAY] = DvtInterpolator.InterpolateNumberArray;
DvtInterpolator._map[DvtInterpolator.TYPE_COLOR] = DvtInterpolator.InterpolateColor;
DvtInterpolator._map[DvtInterpolator.TYPE_COLOR_ARRAY] = DvtInterpolator.InterpolateColorArray;
DvtInterpolator._map[DvtInterpolator.TYPE_GROW_POLYLINE] = DvtInterpolator.InterpolateGrowPolyline;
DvtInterpolator._map[DvtInterpolator.TYPE_RECTANGLE] = DvtInterpolator.InterpolateRectangle;
DvtInterpolator._map[DvtInterpolator.TYPE_POINT] = DvtInterpolator.InterpolatePoint;
DvtInterpolator._map[DvtInterpolator.TYPE_PATH] = DvtInterpolator.InterpolatePath;
DvtInterpolator._map[DvtInterpolator.TYPE_GROW_PATH] = DvtInterpolator.InterpolateGrowPath;
DvtInterpolator._map[DvtInterpolator.TYPE_FILL] = DvtInterpolator.InterpolateFill;
DvtInterpolator._map[DvtInterpolator.TYPE_STROKE] = DvtInterpolator.InterpolateStroke;
DvtInterpolator._map[DvtInterpolator.TYPE_POLYLINE] = DvtInterpolator.InterpolatePolyline;

// State constants (private)
var _STATE_INITIALIZE = 0;
var _STATE_BEGIN = 1;
var _STATE_RUN = 2;

// Nested class begin //////////////////////////////////////

var DvtAnimatorPropItem = function (type, setter, destVal) {
  this.type = type;
  this.setter = setter;
  this.destVal = destVal;
  this.startVal = null;
};

// Nested class end ////////////////////////////////////////

/**
 * Class representing an animator that animates a property change.
 * @class Animator
 * @constructor
 *
 * @param {Context}  context  platform specific context object
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 * @param {function}  easing  easing function to use with this animation
 */
const Animator = function (context, duration, delay, easing) {
  this._context = context;

  this._scheduler = context.getScheduler();
  this._duration = duration ? duration : 0.5; //in seconds
  this._delay = delay ? delay : 0; //in seconds
  this.setEasing(easing);

  this._bRunning = false;
  this._startTime = null;
  this._progress = 0;
  this._state = _STATE_INITIALIZE;

  this._onInit = null;
  this._onInitObj = null;
  this._onEnd = null;
  this._onEndObj = null;

  this._context = context;
  this._props = new Map();
};

// Type Constants
Animator.TYPE_NUMBER = DvtInterpolator.TYPE_NUMBER;
Animator.TYPE_MATRIX = DvtInterpolator.TYPE_MATRIX;
Animator.TYPE_NUMBER_ARRAY = DvtInterpolator.TYPE_NUMBER_ARRAY;
Animator.TYPE_COLOR = DvtInterpolator.TYPE_COLOR;
Animator.TYPE_COLOR_ARRAY = DvtInterpolator.TYPE_COLOR_ARRAY;
Animator.TYPE_GROW_POLYLINE = DvtInterpolator.TYPE_GROW_POLYLINE;
Animator.TYPE_RECTANGLE = DvtInterpolator.TYPE_RECTANGLE;
Animator.TYPE_POINT = DvtInterpolator.TYPE_POINT;
Animator.TYPE_PATH = DvtInterpolator.TYPE_PATH;
Animator.TYPE_GROW_PATH = DvtInterpolator.TYPE_GROW_PATH;
Animator.TYPE_FILL = DvtInterpolator.TYPE_FILL;
Animator.TYPE_STROKE = DvtInterpolator.TYPE_STROKE;
Animator.TYPE_POLYLINE = DvtInterpolator.TYPE_POLYLINE;

// PUBLIC API

/**
 * Add a property to animate.
 *
 * @param {string}  type  type of property
 * @param {object}  obj  object being animated
 * @param {function}  getter  getter function for property being animated
 * @param {function}  setter  setter function for property being animated
 * @param  destVal  destination value to animate to
 */
Animator.prototype.addProp = function (type, obj, getter, setter, destVal) {
  var item = this._getPropItem(obj, getter);
  if (item) {
    item.destVal = destVal;
  } else {
    item = new DvtAnimatorPropItem(type, setter, destVal);
    this._setPropItem(obj, getter, item);
  }
};

/**
 * Get the destination value for a property being animated.
 *
 * @param {object}  obj  object being animated
 * @param {function}  getter  getter function for property being animated
 * @param {boolean} callGetter (optional) If no destination value is found, indicates whether the getter should be called directly rather than returning null
 */
Animator.prototype.getDestVal = function (obj, getter, callGetter) {
  var item = this._getPropItem(obj, getter);
  if (item) {
    return item.destVal;
  }
  //if not part of the animation, return null
  return callGetter ? getter.call(obj) : null;
};

/**
 * Set the easing function for this animation.
 *
 * @param {function}  easing  easing function
 */
Animator.prototype.setEasing = function (easing) {
  this._easing = easing ? easing : Easing.cubicInOut;
};

/**
 * Get the function to call when this item ends.
 * Returns an array of two elements:
 * [0] the function
 * [1] optional reference to object instance on which the function is defined
 *
 * @return {array}
 */
Animator.prototype.getOnEnd = function () {
  return [this._onEnd, this._onEndObj];
};

/**
 * Set the function to call when this item ends.
 *
 * @param {function}  onEnd  function to call when this item ends
 * @param {object}  onEndObj  optional reference to object instance on which the
 *        function is defined
 */
Animator.prototype.setOnEnd = function (onEnd, onEndObj) {
  this._onEnd = onEnd;
  this._onEndObj = onEndObj ? onEndObj : null;
};

/**
 * Get the function to call when this item initializes.
 * Returns an array of two elements:
 * [0] the function
 * [1] optional reference to object instance on which the function is defined
 *
 * @return {array}
 */
Animator.prototype.getOnInit = function () {
  return [this._onInit, this._onInitObj];
};

/**
 * Set the function to call when this item initializes.
 *
 * @param {function}  onInit  function to call when this item initializes
 * @param {object}  onInitObj  optional reference to object instance on which the
 *        function is defined
 */
Animator.prototype.setOnInit = function (onInit, onInitObj) {
  this._onInit = onInit;
  this._onInitObj = onInitObj ? onInitObj : null;
};

/**
 * Determine if this item is running.
 *
 * @return {boolean}
 */
Animator.prototype.isRunning = function () {
  return this._bRunning;
};

/**
 * Play this item.
 * @param {boolean} bImmediate true to begin the animation immediately.  This should generally be false when used by
 *                             components, so that the animation is started after the browser rendering is complete.
 */
Animator.prototype.play = function (bImmediate) {
  if (bImmediate) this._play();
  // Play after a quick timeout allowing the browser to render the bulk of the DOM and any subsequent components.
  else
    this._animationRequestId = Context.requestAnimationFrame(Obj.createCallback(this, this._play));
};

/**
 * Process this item for the given timestamp.
 *
 * @param {number}  time  current timestamp, in milliseconds
 * @return {boolean}
 */
Animator.prototype.processTime = function (time) {
  if (!this._bRunning) {
    return;
  }

  var elapsedTime = time - this._startTime;
  if (elapsedTime < 0) {
    return false;
  }

  var duration = 1000 * this._getTotalDuration();
  var progress = 1;
  if (duration != 0) {
    progress = elapsedTime / duration;
  }
  if (progress > 1) {
    progress = 1;
  }
  this._processStep(progress);

  var bDone = progress >= 1;
  if (bDone) {
    this._processEnd();
  }
  return bDone;
};

/**
 * Stop this item.
 *
 * @param {boolean}  bJumpToEnd  true to jump to 100% progress,
 *        false to stop at current progress
 */
Animator.prototype.stop = function (bJumpToEnd) {
  if (this._animationRequestId) {
    // If animation has been queued, but not started, remove the animation from the queue.
    // Animation request id will be null after animations have been started.
    Context.cancelAnimationFrame(this._animationRequestId);
    this._animationRequestId = null;
  }

  this._scheduler.removeScheduled(this);
  if (bJumpToEnd) {
    this._processStep(1);
  }
  this._processEnd();
};

// PRIVATE API

/**
 * @private
 * Get the given property in the storage array, or null if the property is not found.
 *
 * @param {object}  obj  object being animated
 * @param {function}  getter  getter function for property being animated
 */
Animator.prototype._getPropItem = function (obj, getter) {
  var objMap = this._props.get(obj);
  return objMap ? objMap.get(getter) : null;
};

/**
 * @private
 * Set the given property in the storage array.
 *
 * @param {object}  obj  object being animated
 * @param {function}  getter  getter function for property being animated
 * @param {DvtAnimatorPropItem} item the item being stored
 */
Animator.prototype._setPropItem = function (obj, getter, item) {
  var objMap = this._props.get(obj);
  if (!objMap) {
    objMap = new Map();
    this._props.set(obj, objMap);
  }
  objMap.set(getter, item);
};

/**
 * Get the total duration of this item, in seconds.
 *
 * @return {number}
 */
Animator.prototype._getTotalDuration = function () {
  return this._delay + this._duration;
};

/**
 * Called by play with an optional timeout to enable the animation to run more smoothly.
 * @private
 */
Animator.prototype._play = function () {
  if (!this._bRunning) {
    this._bRunning = true;
    this._processPlay();
    this._scheduler.addScheduled(this);
  }

  // If offscreen, stop the animation immediately and jump to end
  if (this._context.isOffscreen()) this.stop(true);

  this._animationRequestId = null;
};

/**
 * Process when this item stops.
 */
Animator.prototype._processEnd = function () {
  //only process end if still running
  if (this._bRunning) {
    this._bRunning = false;
    this._progress = 1;
    this._state = _STATE_BEGIN;
  }
  if (this._onEnd && !this._ended) {
    this._onEnd.call(this._onEndObj);
    this._ended = true;
  }
};

/**
 * Process initialization of this item when it starts to play.
 */
Animator.prototype._processInitialize = function () {
  if (this._onInit) {
    this._onInit.call(this._onInitObj);
  }
  this._props.forEach(function (objMap, obj) {
    objMap.forEach(function (item, getter) {
      item.startVal = getter.call(obj);
    });
  });
  this._state = _STATE_BEGIN;
};

/**
 * @protected
 * Process when this item is played.
 */
Animator.prototype._processPlay = function () {
  if (this._state == _STATE_INITIALIZE) {
    this._processInitialize();
  }

  if (this._state == _STATE_BEGIN) {
    this._startTime = new Date().getTime();
    this._bRunning = true;
    this._progress = 0;
  } else {
    var elapsedTime = this._progress * 1000 * this._getTotalDuration();
    this._startTime = new Date().getTime() - elapsedTime;
  }

  this._state = _STATE_RUN;
};

/**
 * Process a step of this item as it plays.
 *
 * @param {number}  progress  percent progress of this item
 */
Animator.prototype._processStep = function (progress) {
  this._progress = progress;
  var prog = progress;
  if (this._delay > 0) {
    var min = this._delay / this._getTotalDuration();
    var diff = 1 - min;
    prog = diff === 0 ? 0.5 : Math.min(1, (progress - min) / diff);
  }
  if (prog >= 0) {
    if (this._easing) {
      prog = this._easing(prog);
    }
    var ctx = this._context;
    this._props.forEach(function (objMap, obj) {
      objMap.forEach(function (item, getter) {
        var interpVal = DvtInterpolator.interpolate(
          ctx,
          item.type,
          item.startVal,
          item.destVal,
          prog
        );
        item.setter.call(obj, interpVal);
      });
    });
  }
};

/**
 * Abstract base class representing something that can be played, like an animation.
 * @extends {Obj}
 * @class Playable
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 */
const Playable = function (context) {
  this.Init(context);
};

Obj.createSubclass(Playable, Obj);

/**
 * Append a function to the end of the given playable's current onEnd function.
 *
 * @param {Playable}  playable  playable to append onEnd function to
 * @param {function}  onEnd  new function to append to current onEnd function
 * @param {object}  onEndObj  optional reference to object instance on which the new
 *        onEnd function is defined
 */
Playable.appendOnEnd = function (playable, onEnd, onEndObj) {
  if (!playable || !onEnd) {
    return;
  }

  var arOnEnd = playable.getOnEnd();
  if (!arOnEnd || !arOnEnd[0]) {
    playable.setOnEnd(onEnd, onEndObj);
  } else {
    var newOnEnd = function () {
      arOnEnd[0].call(arOnEnd[1]);
      onEnd.call(onEndObj);
    };
    playable.setOnEnd(newOnEnd);
  }
};

/**
 * Prepend a function to the start of the given playable's current onInit function.
 *
 * @param {Playable}  playable  playable to prepend onInit function to
 * @param {function}  onInit  new function to prepend to current onInit function
 * @param {object}  onInitObj  optional reference to object instance on which the new
 *        onInit function is defined
 */
Playable.prependOnInit = function (playable, onInit, onInitObj) {
  if (!playable || !onInit || !playable.getOnInit || !playable.setOnInit) {
    return;
  }

  var arOnInit = playable.getOnInit();
  if (!arOnInit || !arOnInit[0]) {
    playable.setOnInit(onInit, onInitObj);
  } else {
    var newOnInit = function () {
      onInit.call(onInitObj);
      arOnInit[0].call(arOnInit[1]);
    };
    playable.setOnInit(newOnInit);
  }
};

/**
 * @protected
 */
Playable.prototype.Init = function (context) {
  this.Context = context;
  this._onEnd = null;
  this._onEndObj = null;
};

/**
 * Set the function to call when this playable ends.
 *
 * @param {function}  onEnd  function to call when this playable ends
 * @param {object}  onEndObj  optional reference to object instance on which the
 *        onEnd function is defined
 */
Playable.prototype.setOnEnd = function (onEnd, onEndObj) {
  this._onEnd = onEnd;
  if (onEndObj) {
    this._onEndObj = onEndObj;
  } else {
    this._onEndObj = null;
  }
  this.OnEndUpdated();
};

/**
 * Makes sure _onEnd does not get called twice.
 *
 */
Playable.prototype.CallOnEnd = function () {
  if (this._onEnd && !this._ended) {
    this._onEnd.call(this._onEndObj);
    this._ended = true;
  }
};

/**
 * Get the function to call when this playable ends.
 * Returns an array of two elements:
 * [0] the function
 * [1] optional reference to object instance on which the function is defined
 *
 * @type {array}
 */
Playable.prototype.getOnEnd = function () {
  return [this._onEnd, this._onEndObj];
};

/**
 * @protected
 * Called when the onEnd funciton on this playable is set.
 */
Playable.prototype.OnEndUpdated = function () {
  //subclasses must override
};

/**
 * Returns the duration of this animation, in seconds.
 * @type {number}
 */
Playable.prototype.getDuration = function () {
  //subclasses must override
  return 0;
};

/**
 * Initializes the start and end states of the animation.  This should be called prior to deferring the animation on a
 * timeout or request animation frame.
 */
Playable.prototype.initialize = function () {
  //subclasses must override if they are supporting the bImmediate flag in play()
};

/**
 * Play this item.
 * @param {boolean} bImmediate true to begin the animation immediately.  This should generally be false when used by
 *                             components, so that the animation is started after the browser rendering is complete.
 */
Playable.prototype.play = function (bImmediate) {
  //subclasses must override
};

/**
 * Stop this playable.
 */
Playable.prototype.stop = function (bJumpToEnd) {
  //subclasses must override
};

/**
 * Class representing a set of DvtPlayables that are played at the same time.
 * The playables should be passed into the constructor as either:
 * 1) individual arguments, for example:
 *    new ParallelPlayable(context, playable1, playable2, ...), or
 * 2) a single Array, for example:
 *    new ParallelPlayable(context, [playable1, playable2, ...]);
 * @extends {Playable}
 * @class ParallelPlayable
 * @constructor
 *
 * @param {Context}  context  platform specific context object
 */
const ParallelPlayable = function (context) {
  var arPlayables;
  if (arguments && arguments.length > 1 && arguments[1] instanceof Array) {
    arPlayables = arguments[1];
  } else {
    arPlayables = [].slice.call(arguments);
    //remove the context from the arPlayables array
    arPlayables.splice(0, 1);
  }

  this.Init(context, arPlayables);
};

Obj.createSubclass(ParallelPlayable, Playable);

/**
 * @protected
 * @override
 */
ParallelPlayable.prototype.Init = function (context, arPlayables) {
  ParallelPlayable.superclass.Init.call(this, context);

  this._runningCounter = 0;
  this._arPlayables = arPlayables ? arPlayables : [];
  this._bStarted = false;
};

/**
 * @override
 */
ParallelPlayable.prototype.getDuration = function () {
  var duration = 0;
  for (var i = 0; i < this._arPlayables.length; i++) {
    var playable = this._arPlayables[i];
    if (playable instanceof Playable) duration = Math.max(duration, playable.getDuration());
  }
  return duration;
};

/**
 * @override
 */
ParallelPlayable.prototype.initialize = function () {
  for (var i = 0; i < this._arPlayables.length; i++) {
    if (this._arPlayables[i] instanceof Playable) this._arPlayables[i].initialize();
  }
};

/**
 * @override
 */
ParallelPlayable.prototype.play = function (bImmediate) {
  if (this._arPlayables.length > 0) {
    if (bImmediate) this._play();
    else {
      // Play after a quick timeout allowing the browser to render the bulk of the DOM and any subsequent components.
      this.initialize();
      this._animationRequestId = Context.requestAnimationFrame(
        Obj.createCallback(this, this._play)
      );
    }
  } else {
    // The onEnd listener should still be called.
    this._animationRequestId = Context.requestAnimationFrame(Obj.createCallback(this, this.DoEnd));
  }
};

/**
 * Called by play with an optional timeout to enable the animation to run more smoothly.
 * @private
 */
ParallelPlayable.prototype._play = function () {
  var playable;

  if (!this._bStarted) {
    for (var i = 0; i < this._arPlayables.length; i++) {
      playable = this._arPlayables[i];
      if (playable instanceof Playable) {
        this._runningCounter++;

        //call internal onEnd function when each Playable ends
        Playable.appendOnEnd(playable, this.OnPlayableEnd, this);
      }
    }
  }

  for (var i = 0; i < this._arPlayables.length; i++) {
    playable = this._arPlayables[i];
    if (playable instanceof Playable) {
      // Perform the animation immediately since this is not part of a slow component render operation.
      playable.play(true);
    }
  }

  this._bStarted = true;
  this._animationRequestId = null;
};

/**
 * @override
 */
ParallelPlayable.prototype.stop = function (bJumpToEnd) {
  if (this._animationRequestId) {
    // If animation has been queued, but not started, remove the animation from the queue.
    // Animation request id will be null after animations have been started.
    Context.cancelAnimationFrame(this._animationRequestId);
    this.DoEnd();
    return;
  }

  var playable;
  for (var i = 0; i < this._arPlayables.length; i++) {
    playable = this._arPlayables[i];
    if (playable instanceof Playable) {
      playable.stop(bJumpToEnd);
    }
  }
};

/**
 * @protected
 * Called after each playable ends.
 */
ParallelPlayable.prototype.OnPlayableEnd = function () {
  //decrement the count of running playables
  this._runningCounter--;

  //if no more running, call the onEnd function for this ParallelPlayable
  if (this._runningCounter < 1) {
    this.DoEnd();
  }
};

/**
 * @protected
 * Called after all the playables have finished.
 */
ParallelPlayable.prototype.DoEnd = function () {
  this.CallOnEnd();
  this._animationRequestId = null;
};

/**
 * Class representing a set of DvtPlayables that are played one after another.
 * The playables should be passed into the constructor as either:
 * 1) individual arguments, for example:
 *    new dvt.ParallelPlayable(context, playable1, playable2, ...), or
 * 2) a single Array, for example:
 *    new dvt.ParallelPlayable(context, [playable1, playable2, ...]);
 * @extends {Playable}
 * @class dvt.ParallelPlayable
 * @constructor
 *
 * @param {Context}  context  platform specific context object
 */
const SequentialPlayable = function (context) {
  var arPlayables;
  if (arguments && arguments.length > 1 && arguments[1] instanceof Array) {
    arPlayables = arguments[1];
  } else {
    arPlayables = [].slice.call(arguments);
    //remove the context from the arPlayables array
    arPlayables.splice(0, 1);
  }

  this.Init(context, arPlayables);
};

Obj.createSubclass(SequentialPlayable, Playable);

/**
 * @protected
 * @override
 */
SequentialPlayable.prototype.Init = function (context, arPlayables) {
  SequentialPlayable.superclass.Init.call(this, context);

  this._arPlayables = arPlayables ? arPlayables : [];
  this._currIndex = -1;
  this._bStarted = false;
};

/**
 * @override
 */
SequentialPlayable.prototype.getDuration = function () {
  var duration = 0;
  for (var i = 0; i < this._arPlayables.length; i++) {
    var playable = this._arPlayables[i];
    if (playable instanceof Playable) duration += playable.getDuration();
  }
  return duration;
};

/**
 * @override
 */
SequentialPlayable.prototype.initialize = function () {
  if (this._arPlayables.length > 0 && this._arPlayables[0] instanceof Playable)
    this._arPlayables[0].initialize();
};

/**
 * @override
 */
SequentialPlayable.prototype.play = function (bImmediate) {
  if (this._arPlayables && this._arPlayables.length > 0) {
    if (bImmediate) this._play();
    else {
      // Play after a quick timeout allowing the browser to render the bulk of the DOM and any subsequent components.
      this.initialize();
      this._animationRequestId = Context.requestAnimationFrame(
        Obj.createCallback(this, this._play)
      );
    }
  } else {
    // The onEnd listener should still be called.
    this._animationRequestId = Context.requestAnimationFrame(Obj.createCallback(this, this.DoEnd));
  }
};

/**
 * Called by play with an optional timeout to enable the animation to run more smoothly.
 * @private
 */
SequentialPlayable.prototype._play = function () {
  if (this._bStarted) {
    var currPlayable = this._arPlayables[this._currIndex];
    if (currPlayable instanceof Playable) {
      // Perform the animation immediately since this is not part of a slow component render operation.
      currPlayable.play(true);
    }
    return;
  }

  var firstPlayable;
  if (this._arPlayables[0] instanceof Playable) firstPlayable = this._arPlayables[0];

  var lastPlayable;
  if (this._arPlayables[this._arPlayables.length - 1] instanceof Playable)
    lastPlayable = this._arPlayables[this._arPlayables.length - 1];

  var playable;
  for (var i = 0; i < this._arPlayables.length - 1; i++) {
    playable = this._arPlayables[i];
    if (playable instanceof Playable) {
      //at the end of each playable, play the next one
      Playable.appendOnEnd(playable, this.DoSequenceStep, this);
    }
  }

  //call the onEnd function for this SequentialPlayable at the very
  //end of the sequence
  //if (playable)
  //  Playable.appendOnEnd(playable, this.DoEnd, this);
  if (lastPlayable) Playable.appendOnEnd(lastPlayable, this.DoEnd, this);

  this._bStarted = true;
  this._currIndex = 0;

  // Perform the animation immediately since this is not part of a slow component render operation.
  if (firstPlayable) firstPlayable.play(true);

  this._animationRequestId = null;
};

/**
 * @protected
 * Called after each playable, except the last one, ends.
 */
SequentialPlayable.prototype.DoSequenceStep = function () {
  var playable = this._arPlayables[++this._currIndex];
  if (playable instanceof Playable) {
    // Perform the animation immediately since this is not part of a slow component render operation.
    playable.play(true);
  } else {
    this.DoSequenceStep();
  }
};

/**
 * @override
 */
SequentialPlayable.prototype.stop = function (bJumpToEnd) {
  if (this._animationRequestId) {
    // If animation has been queued, but not started, remove the animation from the queue.
    // Animation request id will be null after animations have been started.
    Context.cancelAnimationFrame(this._animationRequestId);
    this.DoEnd();
    return;
  }

  if (this._arPlayables) {
    var playable;
    for (var i = this._currIndex; i < this._arPlayables.length; i++) {
      playable = this._arPlayables[i];
      if (playable && playable instanceof Playable) {
        playable.stop(bJumpToEnd);
      }
    }
  }
};

/**
 * @protected
 * Called after the last playable has finished.
 */
SequentialPlayable.prototype.DoEnd = function () {
  this.CallOnEnd();
  this._animationRequestId = null;
};

/**
 * Abstract base class representing an animation.
 * @extends {Playable}
 * @class BaseAnimation
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single dvt.Container or Array of DvtContainers to animate
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const BaseAnimation = function (context, objs, duration, delay) {
  this.Init(context, objs, duration, delay);
};

Obj.createSubclass(BaseAnimation, Playable);

/**
 * Easing: linear.
 */
BaseAnimation.EASING_LINEAR = 1;

/**
 * Easing: cubic in and out.
 */
BaseAnimation.EASING_CUBIC_IN_OUT = 2;

/**
 * Easing: cubic in.
 */
BaseAnimation.EASING_CUBIC_IN = 3;

/**
 * Easing: cubic out.
 */
BaseAnimation.EASING_CUBIC_OUT = 4;

/**
 * Easing: quadratic in and out.
 */
BaseAnimation.EASING_QUADRATIC_IN_OUT = 5;

/**
 * Easing: quadratic in.
 */
BaseAnimation.EASING_QUADRATIC_IN = 6;

/**
 * Easing: quadratic out.
 */
BaseAnimation.EASING_QUADRATIC_OUT = 7;

/**
 * Easing: bounce in.
 */
BaseAnimation.EASING_BOUNCE_IN = 8;

/**
 * Easing: bounce out.
 */
BaseAnimation.EASING_BOUNCE_OUT = 9;

/**
 * Easing: elastic in.
 */
BaseAnimation.EASING_ELASTIC_IN = 10;

/**
 * Easing: elastic out.
 */
BaseAnimation.EASING_ELASTIC_OUT = 11;

/**
 * Direction: center.
 */
BaseAnimation.DIR_C = 1;

/**
 * Direction: north.
 */
BaseAnimation.DIR_N = 2;

/**
 * Direction: northeast.
 */
BaseAnimation.DIR_NE = 3;

/**
 * Direction: east.
 */
BaseAnimation.DIR_E = 4;

/**
 * Direction: southeast.
 */
BaseAnimation.DIR_SE = 5;

/**
 * Direction: south.
 */
BaseAnimation.DIR_S = 6;

/**
 * Direction: southwest.
 */
BaseAnimation.DIR_SW = 7;

/**
 * Direction: west.
 */
BaseAnimation.DIR_W = 8;

/**
 * Direction: northwest.
 */
BaseAnimation.DIR_NW = 9;

//axis constants
/**
 * Axis: x-axis
 */
BaseAnimation.AXIS_X = 1;

/**
 * Axis: y-axis
 */
BaseAnimation.AXIS_Y = 2;

//rotation directions
/**
 * Rotation direction: clockwise
 */
BaseAnimation.ROT_DIR_CLOCKWISE = 1;

/**
 * Rotation direction: counter-clockwise
 */
BaseAnimation.ROT_DIR_COUNTERCLOCKWISE = 2;

/**
 * @protected
 * Get the easing function corresponding to the given constant.
 * @param easing  constant representing the easing function
 * @type {function}
 */
BaseAnimation.GetEasingFunction = function (easing) {
  switch (easing) {
    case BaseAnimation.EASING_LINEAR:
      return Easing.linear;
    case BaseAnimation.EASING_CUBIC_IN:
      return Easing.cubicIn;
    case BaseAnimation.EASING_CUBIC_OUT:
      return Easing.cubicOut;
    case BaseAnimation.EASING_QUADRATIC_IN_OUT:
      return Easing.quadraticInOut;
    case BaseAnimation.EASING_QUADRATIC_IN:
      return Easing.quadraticIn;
    case BaseAnimation.EASING_QUADRATIC_OUT:
      return Easing.quadraticOut;
    case BaseAnimation.EASING_BOUNCE_IN:
      return Easing.backIn;
    case BaseAnimation.EASING_BOUNCE_OUT:
      return Easing.backOut;
    case BaseAnimation.EASING_ELASTIC_IN:
      return Easing.elasticIn;
    case BaseAnimation.EASING_ELASTIC_OUT:
      return Easing.elasticOut;
    case BaseAnimation.EASING_CUBIC_IN_OUT:
    default:
      return Easing.cubicInOut;
  }
};

/**
 * @protected
 * Get the point corresponding to the given compass direction
 * on the given bounding box.
 * @param {dvt.Rectangle}  boundsRect  bounding box
 * @param direction  constant representing the compass direction
 * @type {Point}
 */
BaseAnimation.GetCompassPoint = function (boundsRect, direction) {
  switch (direction) {
    case BaseAnimation.DIR_N:
      return new Point(boundsRect.x + 0.5 * boundsRect.w, boundsRect.y);
    case BaseAnimation.DIR_NE:
      return new Point(boundsRect.x + boundsRect.w, boundsRect.y);
    case BaseAnimation.DIR_E:
      return new Point(boundsRect.x + boundsRect.w, boundsRect.y + 0.5 * boundsRect.h);
    case BaseAnimation.DIR_SE:
      return new Point(boundsRect.x + boundsRect.w, boundsRect.y + boundsRect.h);
    case BaseAnimation.DIR_S:
      return new Point(boundsRect.x + 0.5 * boundsRect.w, boundsRect.y + boundsRect.h);
    case BaseAnimation.DIR_SW:
      return new Point(boundsRect.x, boundsRect.y + boundsRect.h);
    case BaseAnimation.DIR_W:
      return new Point(boundsRect.x, boundsRect.y + 0.5 * boundsRect.h);
    case BaseAnimation.DIR_NW:
      return new Point(boundsRect.x, boundsRect.y);
    case BaseAnimation.DIR_C:
    default:
      return new Point(boundsRect.x + 0.5 * boundsRect.w, boundsRect.y + 0.5 * boundsRect.h);
  }
};

/**
 * @protected
 * Get the point to position the given object rectangle so that it aligns to the
 * boundary rectangle in the compass direction.
 * @param {dvt.Rectangle}  objRect  object bounding box
 * @param {dvt.Rectangle}  boundsRect  bounding box
 * @param direction  constant representing the compass direction
 * @type {Point}
 */
BaseAnimation.GetAlignCompassPoint = function (objRect, boundsRect, direction) {
  var compassPoint = BaseAnimation.GetCompassPoint(boundsRect, direction);
  switch (direction) {
    case BaseAnimation.DIR_N:
      return new Point(compassPoint.x - 0.5 * objRect.w, compassPoint.y);
    case BaseAnimation.DIR_NE:
      return new Point(compassPoint.x - objRect.w, compassPoint.y);
    case BaseAnimation.DIR_E:
      return new Point(compassPoint.x - objRect.w, compassPoint.y - 0.5 * objRect.h);
    case BaseAnimation.DIR_SE:
      return new Point(compassPoint.x - objRect.w, compassPoint.y - objRect.h);
    case BaseAnimation.DIR_S:
      return new Point(compassPoint.x - 0.5 * objRect.w, compassPoint.y - objRect.h);
    case BaseAnimation.DIR_SW:
      return new Point(compassPoint.x, compassPoint.y - objRect.h);
    case BaseAnimation.DIR_W:
      return new Point(compassPoint.x, compassPoint.y - 0.5 * objRect.h);
    case BaseAnimation.DIR_NW:
      return new Point(compassPoint.x, compassPoint.y);
    case BaseAnimation.DIR_C:
    default:
      return new Point(compassPoint.x - 0.5 * objRect.w, compassPoint.y - 0.5 * objRect.h);
  }
};

/**
 * @protected
 * @override
 */
BaseAnimation.prototype.Init = function (context, objs, duration, delay) {
  BaseAnimation.superclass.Init.call(this, context);

  this._context = context;

  if (objs instanceof Array) {
    this._arObjects = objs;
  } else {
    this._arObjects = [objs];
  }

  this._duration = duration ? duration : 0.5;
  this._delay = delay ? delay : 0;
  this._easing = BaseAnimation.EASING_CUBIC_IN_OUT;
  this._bInitialized = false;

  this._bSaveAndRestoreOriginalMatrices = false;
  this._origMatrixArray = null;
  this._bHideObjectsOnEnd = false;

  this.CreateAnimator(context);
};

/**
 * @protected
 * Get the platform dependent context object.
 * @type {dvt.Context}
 */
BaseAnimation.prototype.GetContext = function () {
  return this._context;
};

/**
 * Determine if this animation is running.
 * @type {boolean}
 */
BaseAnimation.prototype.isRunning = function () {
  if (this._animator) {
    return this._animator.isRunning();
  }
  return false;
};

/**
 * @override
 */
BaseAnimation.prototype.initialize = function () {
  if (!this._bInitialized) {
    //initialize the desired end results of the animation before the start
    //states because the end results may depend on the object states
    //before the start states are applied
    this._initializeEndStates(this._arObjects);
    //initialize the display objects appropriately for the start of the animation
    this._initializeStartStates(this._arObjects);

    this.InitializePlay();

    this._bInitialized = true;
  }
};

/**
 * @override
 */
BaseAnimation.prototype.play = function (bImmediate) {
  // Initialize the start and end states.
  this.initialize();

  if (this._animator) this._animator.play(bImmediate);
};

/**
 * @override
 */
BaseAnimation.prototype.stop = function (bJumpToEnd) {
  if (this._animator) this._animator.stop(bJumpToEnd);
};

/**
 * @override
 */
BaseAnimation.prototype.getDuration = function () {
  return this._duration;
};

/**
 * Set the easing function for this animation.
 * @param  easing  one of the EASING_ constants defined on BaseAnimation
 */
BaseAnimation.prototype.setEasing = function (easing) {
  this._easing = easing;

  if (this._animator) this._animator.setEasing(BaseAnimation.GetEasingFunction(this._easing));
};

/**
 * @protected
 * Create the underlying animator used by this animation.
 * @param {dvt.Context}  context  platform specific context object
 */
BaseAnimation.prototype.CreateAnimator = function (context) {
  this._animator = new Animator(
    context,
    this._duration,
    this._delay,
    BaseAnimation.GetEasingFunction(this._easing)
  );
  this._animator.setOnEnd(this.OnAnimEnd, this);
};

/**
 * @protected
 * Called when the underlying animator ends.
 */
BaseAnimation.prototype.OnAnimEnd = function () {
  //hide objects first
  if (this._bHideObjectsOnEnd) {
    this.SetObjectsVisible(false);
  }

  //restore original transforms after hiding objects
  if (this._bSaveAndRestoreOriginalMatrices) {
    this.RestoreOriginalMatrices();
  }

  //call external onEnd func after any internal cleanup
  this.CallOnEnd();
};

/**
 * @protected
 * Called when play is called.
 */
BaseAnimation.prototype.InitializePlay = function () {
  //for subclasses to implement
};

/**
 * Called when play is called to initialize the start states of
 * the objects being animated.
 * @param {array}  arObjects  array of objects being animated
 * @private
 */
BaseAnimation.prototype._initializeStartStates = function (arObjects) {
  if (arObjects) {
    var obj;
    for (var i = 0; i < arObjects.length; i++) {
      obj = arObjects[i];
      if (obj) {
        if (this._bSaveAndRestoreOriginalMatrices) {
          if (!this._origMatrixArray) {
            this._origMatrixArray = [];
          }

          this._origMatrixArray.push(obj.getMatrix());
        }

        this.InitStartState(obj);
      }
    }
  }
};

/**
 * Called when play is called to initialize the end states of
 * the objects being animated.
 * @param {array}  arObjects  array of objects being animated
 * @private
 */
BaseAnimation.prototype._initializeEndStates = function (arObjects) {
  if (arObjects) {
    var obj;
    for (var i = 0; i < arObjects.length; i++) {
      obj = arObjects[i];
      if (obj) {
        this.InitEndState(obj);
      }
    }
  }
};

/**
 * @protected
 * Initialize the start state of the given object being animated.
 * @param {object}  obj  object being animated
 */
BaseAnimation.prototype.InitStartState = function (obj) {
  //subclasses must implement
};

/**
 * @protected
 * Initialize the end state of the given object being animated.
 * @param {object}  obj  object being animated
 */
BaseAnimation.prototype.InitEndState = function (obj) {
  //subclasses must implement
};

/**
 * @protected
 * Set visibility of objects.
 *
 * @param {boolean}  bVisible  true to show, false to hide
 */
BaseAnimation.prototype.SetObjectsVisible = function (bVisible) {
  if (this._arObjects) {
    var obj;
    for (var i = this._arObjects.length - 1; i >= 0; i--) {
      obj = this._arObjects[i];
      if (obj) {
        obj.setVisible(bVisible);
      }
    }
  }
};

/**
 * @protected
 * Restore objects' original matrices as they were before animation.
 */
BaseAnimation.prototype.RestoreOriginalMatrices = function () {
  if (this._arObjects) {
    var obj;
    for (var i = this._arObjects.length - 1; i >= 0; i--) {
      obj = this._arObjects[i];
      if (obj) {
        if (this._origMatrixArray) {
          obj.setMatrix(this._origMatrixArray.pop());
        }
      }
    }
  }
};

/**
 * Class representing an animation to fade in an object.
 * @extends {BaseAnimation}
 * @class AnimFadeIn
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single dvt.Container or Array of DvtContainers to animate
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const AnimFadeIn = function (context, objs, duration, delay) {
  this.Init(context, objs, duration, delay);
};

Obj.createSubclass(AnimFadeIn, BaseAnimation);

/**
 * @protected
 * @override
 */
AnimFadeIn.prototype.Init = function (context, objs, duration, delay) {
  AnimFadeIn.superclass.Init.call(this, context, objs, duration, delay);
};

/**
 * @protected
 * @override
 */
AnimFadeIn.prototype.InitStartState = function (obj) {
  obj.setAlpha(0);
};

/**
 * @protected
 * @override
 */
AnimFadeIn.prototype.InitEndState = function (obj) {
  this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getAlpha, obj.setAlpha, 1);
};

/**
 * Class representing an animation to move an object by a given amount.
 * @extends {BaseAnimation}
 * @class AnimMoveBy
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single dvt.Container or Array of DvtContainers to animate
 * @param offsets  a single dvt.Point or Array of DvtPoints to move by
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const AnimMoveBy = function (context, objs, offsets, duration, delay) {
  this.Init(context, objs, offsets, duration, delay);
};

Obj.createSubclass(AnimMoveBy, BaseAnimation);

/**
 * @protected
 * @override
 */
AnimMoveBy.prototype.Init = function (context, objs, offsets, duration, delay) {
  if (offsets instanceof Array) {
    this._arOffsets = offsets;
  } else if (offsets instanceof Point) {
    this._arOffsets = [offsets];
  } else {
    this._arOffsets = [new Point(0, 0)];
  }

  this._currIndex = 0;

  AnimMoveBy.superclass.Init.call(this, context, objs, duration, delay);
};

/**
 * @protected
 * @override
 */
AnimMoveBy.prototype.InitEndState = function (obj) {
  var offset;
  if (this._currIndex < this._arOffsets.length) {
    offset = this._arOffsets[this._currIndex];
  } else {
    offset = this._arOffsets[this._arOffsets.length - 1];
  }

  this._animator.addProp(
    Animator.TYPE_NUMBER,
    obj,
    obj.getTranslateX,
    obj.setTranslateX,
    obj.getTranslateX() + offset.x
  );
  this._animator.addProp(
    Animator.TYPE_NUMBER,
    obj,
    obj.getTranslateY,
    obj.setTranslateY,
    obj.getTranslateY() + offset.y
  );

  this._currIndex++;
};

/**
 * Class representing an animation to move and fade in an object.  The object
 * is moved in from the edges of a provided rectangle as it fades.
 * The object is also scaled as it fades, so it becomes larger as it is
 * more opaque.
 * @extends {AnimFadeIn}
 * @class AnimScaleFadeIn
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single dvt.Container or Array of DvtContainers to animate
 * @param {Rectangle}  boundsRect  a rectangle defining the bounds for moving the object
 * @param direction  compass direction to move display object in from;
 *        can be one of the values defined in BaseAnimation:
 *        DIR_C, DIR_N, DIR_NE, DIR_E, DIR_SE, DIR_S, DIR_SW, DIR_W, DIR_NW (default is DIR_NW)
 * @param {number}  minScale  minimum scale to make the object as it starts
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const AnimScaleFadeIn = function (context, objs, boundsRect, direction, minScale, duration, delay) {
  this.Init(context, objs, boundsRect, direction, minScale, duration, delay);
};

Obj.createSubclass(AnimScaleFadeIn, AnimFadeIn);

/**
 * @protected
 * @override
 */
AnimScaleFadeIn.prototype.Init = function (
  context,
  objs,
  boundsRect,
  direction,
  minScale,
  duration,
  delay
) {
  this._boundsRect = boundsRect;
  this._direction = direction ? direction : BaseAnimation.DIR_NW;
  this._minScale = minScale ? minScale : 0.5;

  AnimScaleFadeIn.superclass.Init.call(this, context, objs, duration, delay);

  //need to do this AFTER calling superclass Init because member will
  //initially be defined there
  this._bSaveAndRestoreOriginalMatrices = true;
};

/**
 * @protected
 * @override
 */
AnimScaleFadeIn.prototype.InitStartState = function (obj) {
  AnimScaleFadeIn.superclass.InitStartState.call(this, obj);

  var newScaleX = this._minScale * obj.getScaleX();
  var newScaleY = this._minScale * obj.getScaleY();

  //move the dispObj to the edge of the bounding rect and scale it down
  var objBounds = obj.getDimensions();
  var rect = new Rectangle(0, 0, newScaleX * objBounds.w, newScaleY * objBounds.h);
  var point = BaseAnimation.GetAlignCompassPoint(rect, this._boundsRect, this._direction);
  obj.setTranslate(point.x, point.y);
  obj.setScale(newScaleX, newScaleY);
};

/**
 * @protected
 * @override
 */
AnimScaleFadeIn.prototype.InitEndState = function (obj) {
  AnimScaleFadeIn.superclass.InitEndState.call(this, obj);

  var currMat = obj.getMatrix();
  this._animator.addProp(Animator.TYPE_MATRIX, obj, obj.getMatrix, obj.setMatrix, currMat);
};

/**
 * Class representing an animation to fade out an object.
 * @extends {dvt.BaseAnimation}
 * @class AnimFadeOut
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single dvt.Container or Array of DvtContainers to animate
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const AnimFadeOut = function (context, objs, duration, delay) {
  this.Init(context, objs, duration, delay);
};

Obj.createSubclass(AnimFadeOut, BaseAnimation);

/**
 * @protected
 * @override
 */
AnimFadeOut.prototype.Init = function (context, objs, duration, delay) {
  AnimFadeOut.superclass.Init.call(this, context, objs, duration, delay);
};

/**
 * @protected
 * @override
 */
AnimFadeOut.prototype.InitEndState = function (obj) {
  this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getAlpha, obj.setAlpha, 0);
};

/**
 * Class used to animate replacing one set of display objects with another set by
 * fading out the old and fading in the new.
 * @extends {ParallelPlayable}
 * @class DvtCombinedAnimFade
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param outObjs  a single dvt.Container or Array of DvtContainers to fade out
 * @param inObjs  a single dvt.Container or Array of DvtContainers to fade in
 * @param {number}  duration  length of individual out and in animations, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const DvtCombinedAnimFade = function (context, outObjs, inObjs, duration, delay) {
  this.Init(context, outObjs, inObjs, duration, delay);
};

Obj.createSubclass(DvtCombinedAnimFade, ParallelPlayable);

/**
 * @protected
 * @override
 */
DvtCombinedAnimFade.prototype.Init = function (context, outObjs, inObjs, duration, delay) {
  if (!duration) duration = 0.5;
  if (!delay) delay = 0;

  var fadeOut = new AnimFadeOut(context, outObjs, duration, delay);
  //delay the fade out by a little bit to make both animations easier to see
  var fadeIn = new AnimFadeIn(context, inObjs, duration, 0.5 * fadeOut.getDuration() + delay);

  DvtCombinedAnimFade.superclass.Init.call(this, context, [fadeOut, fadeIn]);
};

/**
 * Class used to animate replacing one set of display objects with another set by
 * moving out the old and moving in the new.
 * @extends {dvt.ParallelPlayable}
 * @class CombinedAnimMoveBy
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param outObjs  a single dvt.Container or Array of DvtContainers to move out
 * @param inObjs  a single dvt.Container or Array of DvtContainers to move in
 * @param outOffsets  a single dvt.Point or Array of DvtPoints to move out by
 * @param inOffsets  a single dvt.Point or Array of DvtPoints to move in by
 * @param {number}  duration  length of individual out and in animations, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const CombinedAnimMoveBy = function (
  context,
  outObjs,
  inObjs,
  outOffsets,
  inOffsets,
  duration,
  delay
) {
  this.Init(context, outObjs, inObjs, outOffsets, inOffsets, duration, delay);
};

Obj.createSubclass(CombinedAnimMoveBy, ParallelPlayable);

/**
 * @protected
 * @override
 */
CombinedAnimMoveBy.prototype.Init = function (
  context,
  outObjs,
  inObjs,
  outOffsets,
  inOffsets,
  duration,
  delay
) {
  if (!duration) duration = 0.5;
  if (!delay) delay = 0;

  var moveOut = new AnimMoveBy(context, outObjs, outOffsets, duration, delay);
  var moveIn = new AnimMoveBy(context, inObjs, inOffsets, duration, delay);

  CombinedAnimMoveBy.superclass.Init.call(this, context, [moveOut, moveIn]);
};

/**
 * Class used to animate replacing one set of display objects with another set by
 * moving and fading out the old and moving and fading in the new.  The objects
 * are moved out toward and in from the edges of a provided rectangle as they fade.
 * The objects are also scaled as they fade, so they become smaller as they are
 * more transparent.
 * @extends {dvt.ParallelPlayable}
 * @class DvtCombinedAnimScaleFade
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param outObjs  a single dvt.Container or Array of DvtContainers to fade out
 * @param inObjs  a single dvt.Container or Array of DvtContainers to fade in
 * @param {dvt.Rectangle}  boundsRect  a rectangle defining the bounds for moving the objects
 * @param outDirection  compass direction to move old display objects out to;
 *        can be one of the values defined in BaseAnimation:
 *        DIR_C, DIR_N, DIR_NE, DIR_E, DIR_SE, DIR_S, DIR_SW, DIR_W, DIR_NW (default is DIR_NE)
 * @param inDirection  compass direction to move new display objects in from;
 *        can be one of the values defined in BaseAnimation:
 *        DIR_C, DIR_N, DIR_NE, DIR_E, DIR_SE, DIR_S, DIR_SW, DIR_W, DIR_NW (default is DIR_NW)
 * @param {number}  minScale  minimum scale to make the objects as they fade
 * @param {number}  duration  length of individual out and in animations, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const DvtCombinedAnimScaleFade = function (
  context,
  outObjs,
  inObjs,
  boundsRect,
  outDirection,
  inDirection,
  minScale,
  duration,
  delay
) {
  this.Init(
    context,
    outObjs,
    inObjs,
    boundsRect,
    outDirection,
    inDirection,
    minScale,
    duration,
    delay
  );
};

Obj.createSubclass(DvtCombinedAnimScaleFade, ParallelPlayable);

/**
 * @protected
 * @override
 */
DvtCombinedAnimScaleFade.prototype.Init = function (
  context,
  outObjs,
  inObjs,
  boundsRect,
  outDirection,
  inDirection,
  minScale,
  duration,
  delay
) {
  if (!outDirection) outDirection = BaseAnimation.DIR_NE;
  if (!inDirection) inDirection = BaseAnimation.DIR_NW;
  if (!minScale) minScale = 0.5;
  if (!duration) duration = 0.5;
  if (!delay) delay = 0;

  // TOOD: From EJ, AnimScaleFadeOut not defined; set to null for now
  // var fadeOut = new AnimScaleFadeOut(
  //   context,
  //   outObjs,
  //   boundsRect,
  //   outDirection,
  //   minScale,
  //   duration,
  //   delay
  // );
  var fadeOut = null;
  var fadeIn = new AnimScaleFadeIn(
    context,
    inObjs,
    boundsRect,
    inDirection,
    minScale,
    duration,
    0.3 + delay //add fadeOut.getDuration() after it is implemented e.g 0.3 * fadeOut.getDuration() + delay
  );

  DvtCombinedAnimScaleFade.superclass.Init.call(this, context, [fadeOut, fadeIn]);
};

/**
 * Animation handler for black box animations.
 * @class BlackBoxAnimationHandler
 */
const BlackBoxAnimationHandler = function () {};

Obj.createSubclass(BlackBoxAnimationHandler, Obj);

// Black Box Animation Types
BlackBoxAnimationHandler.ALPHA_FADE = 'alphaFade';
BlackBoxAnimationHandler.SLIDE_TO_RIGHT = 'slideToRight';
BlackBoxAnimationHandler.SLIDE_TO_LEFT = 'slideToLeft';
BlackBoxAnimationHandler.ZOOM = 'zoom';

/**
 * Returns true if the specified animation type should be handled by a black box animation.
 * @param {string} type The animation type.
 * @return {boolean}
 */
BlackBoxAnimationHandler.isSupported = function (type) {
  return (
    type == BlackBoxAnimationHandler.ALPHA_FADE ||
    type == BlackBoxAnimationHandler.SLIDE_TO_RIGHT ||
    type == BlackBoxAnimationHandler.SLIDE_TO_LEFT ||
    type == BlackBoxAnimationHandler.ZOOM
  );
};

/**
 * Creates and returns the specified black box animation for the displayables.
 * @param {dvt.Context} context The platform specific context object.
 * @param {string} type The animation type.
 * @param {object} objs The displayable or array of displayables.
 * @param {dvt.Rectangle} bounds The bounds of the objects to animate.
 * @param {number} duration The duration of the animation
 * @return {dvt.Playable} The animation from the old object to the new object.
 */
BlackBoxAnimationHandler.getInAnimation = function (context, type, objs, bounds, duration) {
  if (type == BlackBoxAnimationHandler.ALPHA_FADE) return new AnimFadeIn(context, objs, duration);
  else if (type == BlackBoxAnimationHandler.SLIDE_TO_RIGHT) {
    BlackBoxAnimationHandler._offsetObjects(objs, -bounds.w, 0);
    return new AnimMoveBy(context, objs, new Point(bounds.w, 0), duration);
  } else if (type == BlackBoxAnimationHandler.SLIDE_TO_LEFT) {
    BlackBoxAnimationHandler._offsetObjects(objs, bounds.w, 0);
    return new AnimMoveBy(context, objs, new Point(-bounds.w, 0), duration);
  } else if (type == BlackBoxAnimationHandler.ZOOM)
    return new AnimScaleFadeIn(context, objs, bounds, BaseAnimation.DIR_C, 0.5, duration);
  else return null;
};

/**
 * Creates and returns the specified black box animation between the old displayable and
 * the new displayable.
 * @param {dvt.Context} context The platform specific context object.
 * @param {string} type The animation type.
 * @param {object} outObjs The displayable or array of displayables to animate out.
 * @param {object} inObjs The displayable or array of displayables to animate in.
 * @param {dvt.Rectangle} bounds The bounds of the objects to animate.
 * @param {number} duration The duration of the animation (in seconds).
 * @return {dvt.Playable} The animation from the old object to the new object.
 */
BlackBoxAnimationHandler.getCombinedAnimation = function (
  context,
  type,
  outObjs,
  inObjs,
  bounds,
  duration
) {
  if (type == BlackBoxAnimationHandler.ALPHA_FADE)
    return new DvtCombinedAnimFade(context, outObjs, inObjs, duration);
  else if (type == BlackBoxAnimationHandler.SLIDE_TO_RIGHT) {
    BlackBoxAnimationHandler._offsetObjects(inObjs, -bounds.w, 0);
    return new CombinedAnimMoveBy(
      context,
      outObjs,
      inObjs,
      new Point(bounds.w, 0),
      new Point(bounds.w, 0),
      duration
    );
  } else if (type == BlackBoxAnimationHandler.SLIDE_TO_LEFT) {
    BlackBoxAnimationHandler._offsetObjects(inObjs, bounds.w, 0);
    return new CombinedAnimMoveBy(
      context,
      outObjs,
      inObjs,
      new Point(-bounds.w, 0),
      new Point(-bounds.w, 0),
      duration
    );
  } else if (type == BlackBoxAnimationHandler.ZOOM)
    return new DvtCombinedAnimScaleFade(
      context,
      outObjs,
      inObjs,
      bounds,
      BaseAnimation.DIR_C,
      BaseAnimation.DIR_C,
      0.5,
      duration
    );
  else return null;
};

/**
 * Adjusts the objects by the specified offset.
 * @param {object} objs The displayable or array of displayables.
 * @param {number} offsetX The x offset to add.
 * @param {number} offsetY The y offset to add.
 @private
 */
BlackBoxAnimationHandler._offsetObjects = function (objs, offsetX, offsetY) {
  if (objs.length) {
    for (var i = 0; i < objs.length; i++)
      BlackBoxAnimationHandler._offsetObjects(objs[i], offsetX, offsetY);
  } else if (objs) {
    // Adjust the displayable
    objs.setTranslate(objs.getTranslateX() + offsetX, objs.getTranslateY() + offsetY);
  }
};

/**
 * Class providing the ability to create a custom animation using a dvt.Animator.
 * @param {dvt.Context} context The platform specific context object.
 * @param {obj} obj The object to animate.
 * @param {number} duration The length of animation, in seconds.
 * @param {number} delay The time to delay start of animation, in seconds.
 * @extends {dvt.BaseAnimation}
 * @class CustomAnimation
 * @constructor
 */
const CustomAnimation = function (context, obj, duration, delay) {
  this.Init(context, obj, duration, delay);
};

Obj.createSubclass(CustomAnimation, BaseAnimation);

/**
 * Returns the animator, which can be used to add animated properties.
 * @return {dvt.Animator} The animator for this animation.
 */
CustomAnimation.prototype.getAnimator = function () {
  return this._animator;
};

/**
 * Animation handler for data objects.
 * @param {dvt.Context} context The platform specific context object.
 * @param {dvt.Container} deleteContainer The container where deletes should be moved for animation.
 * @class DataAnimationHandler
 * @constructor
 */
const DataAnimationHandler = function (context, deleteContainer) {
  this.Init(context, deleteContainer);
};

Obj.createSubclass(DataAnimationHandler, Obj);

// TODO Document the expected interface for animatable objects:
// getId()
// animateUpdate(oldObj)
// animateDelete()
// animateInsert()

/**
 * The percentage of overlap for animation phases when overlap is enabled.
 * @const
 * @private
 */
DataAnimationHandler._OVERLAP_RATIO = 0.4;

/**
 * Initializes the handler.
 * @param {dvt.Context} context The platform specific context object.
 * @param {dvt.Container} deleteContainer The container where deletes should be moved for animation.
 * @protected
 */
DataAnimationHandler.prototype.Init = function (context, deleteContainer) {
  this._context = context;
  this._deleteContainer = deleteContainer;
  this._playables = [];
};

/**
 * Returns the dvt.Context associated with this animation handler.
 * @return {dvt.Context}
 */
DataAnimationHandler.prototype.getCtx = function () {
  return this._context;
};

/**
 * Constructs an animation between two lists of logical objects.  This function
 * delegates the specific animation behavior to the logical objects.  The animation
 * can be retrieved using getAnimation().
 * @param {array} oldList The list to animate from.
 * @param {array} newList The list to animate to.
 */
DataAnimationHandler.prototype.constructAnimation = function (oldList, newList) {
  if (!newList || this._context.isOffscreen()) return;

  newList = newList.slice(0);
  // Loop through the two lists and diff the changes.
  // Note: This implementation considers changes in order to be updates.
  var updatesArray = [];
  if (oldList) {
    //create map
    var animateMap = new this._context.ojMap();
    for (var newIndex = 0; newIndex < newList.length; newIndex++) {
      var newItem = newList[newIndex];
      if (!newItem || !newItem.getId())
        //newItem and newItem ID must exist for animateMap update
        continue;
      animateMap.set(newItem.getId(), newItem);
    }
    for (var oldIndex = 0; oldIndex < oldList.length; oldIndex++) {
      var oldItem = oldList[oldIndex];
      var oldId = oldItem ? oldItem.getId() : undefined;
      var newItem = oldId ? animateMap.get(oldId) : undefined;
      if (newItem) {
        updatesArray.push(newItem.getId());
        newItem.animateUpdate(this, oldItem);
      }
      // If no match found, it was a delete.  Pass in the delete container so that
      // the object can choose whether to move to the new container.
      else {
        if (oldItem) oldItem.animateDelete(this, this._deleteContainer);
      }
    }
  }
  var updates = new this._context.KeySetImpl(updatesArray);

  // All remaining objects in newList are inserts
  for (var i = 0; i < newList.length; i++) {
    if (newList[i] && (!newList[i].getId() || !updates.has(newList[i].getId())))
      // must be valid object for insert
      newList[i].animateInsert(this);
  }
};

/**
 * Returns the container where deleted elements go.
 * @return {dvt.Container} The container where deleted elements go.
 */
DataAnimationHandler.prototype.getDeleteContainer = function () {
  return this._deleteContainer;
};
/**
 * Adds the specified playable to this handler's animation.
 * @param {dvt.Playable} playable The playable to add to this animation.
 * @param {number} index The relative ordering of the animation, beginning at 0.
 */
DataAnimationHandler.prototype.add = function (playable, index) {
  if (!playable) return;

  if (!index) index = 0;

  // Make sure the playables array is large enough
  while (this._playables.length <= index) this._playables.push(new Array());

  // Add the playable to the array
  this._playables[index].push(playable);
};

/**
 * Returns the animation constructed by this handler.
 * @param {boolean=} bOverlap true if the animation phases should be slightly overlapped.  This produces a smoother
 *                             result as long as the objects in each phase are distinct.
 * @return {dvt.Playable} The animation constructed by this handler.
 */
DataAnimationHandler.prototype.getAnimation = function (bOverlap) {
  // Construct a parallel playable for each phase of the animation
  var playables = [];
  for (var i = 0; i < this._playables.length; i++) {
    // Construct and add the playable for this index in the sequence
    if (this._playables[i].length > 0) {
      var playable = new ParallelPlayable(this._context, this._playables[i]);
      playables.push(playable);
    }
  }

  if (bOverlap) {
    // Overlap the animation phases for a smoother effect
    var phases = [];
    var startTime = 0;
    for (var phaseIndex = 0; phaseIndex < playables.length; phaseIndex++) {
      if (startTime > 0) {
        // Create the overlap using a sequential playable with empty custom animation for the delay. This is the easiest
        // way to force a delay without introducing delay onto Playable itself.
        var delayPlayable = new CustomAnimation(this._context, null, startTime);
        phases.push(new SequentialPlayable(this._context, [delayPlayable, playables[phaseIndex]]));
      } else phases.push(playables[phaseIndex]);

      // Update the startTime for the next phase
      startTime += (1 - DataAnimationHandler._OVERLAP_RATIO) * playables[phaseIndex].getDuration();
    }
    return new ParallelPlayable(this._context, phases);
  } else return new SequentialPlayable(this._context, playables);
};

/**
 * Returns the number of playables in this animation.
 * @return {Number} the number of playables in this animation.
 */
DataAnimationHandler.prototype.getNumPlayables = function () {
  return this._playables.length;
};

/**
 * Class representing an animation to move an object to a given point.
 * @extends {BaseAnimation}
 * @class AnimMoveTo
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single dvt.Container or Array of DvtContainers to animate
 * @param points  a single Point or Array of DvtPoints to move to
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const AnimMoveTo = function (context, objs, points, duration, delay) {
  this.Init(context, objs, points, duration, delay);
};

Obj.createSubclass(AnimMoveTo, BaseAnimation);

/**
 * @protected
 * @override
 */
AnimMoveTo.prototype.Init = function (context, objs, points, duration, delay) {
  if (points instanceof Array) {
    this._arPoints = points;
  } else if (points instanceof Point) {
    this._arPoints = [points];
  } else {
    this._arPoints = [new Point(0, 0)];
  }

  this._currIndex = 0;

  AnimMoveTo.superclass.Init.call(this, context, objs, duration, delay);
};

/**
 * @protected
 * @override
 */
AnimMoveTo.prototype.InitEndState = function (obj) {
  var point;
  if (this._currIndex < this._arPoints.length) {
    point = this._arPoints[this._currIndex];
  } else {
    point = this._arPoints[this._arPoints.length - 1];
  }

  this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getTranslateX, obj.setTranslateX, point.x);
  this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getTranslateY, obj.setTranslateY, point.y);

  this._currIndex++;
};

/**
 * Class representing an animation to scale an object to a given value.
 * @extends {BaseAnimation}
 * @class AnimScaleTo
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single dvt.Container or Array of DvtContainers to animate
 * @param scales  a single dvt.Point or Array of DvtPoints to scale to
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const AnimScaleTo = function (context, objs, scales, duration, delay) {
  this.Init(context, objs, scales, duration, delay);
};

Obj.createSubclass(AnimScaleTo, BaseAnimation);

/**
 * @protected
 * @override
 */
AnimScaleTo.prototype.Init = function (context, objs, scales, duration, delay) {
  if (scales instanceof Array) {
    this._arScales = scales;
  } else if (scales instanceof Point) {
    this._arScales = [scales];
  } else {
    this._arScales = [new Point(1, 1)];
  }

  this._currIndex = 0;

  AnimScaleTo.superclass.Init.call(this, context, objs, duration, delay);
};

/**
 * @protected
 * @override
 */
AnimScaleTo.prototype.InitEndState = function (obj) {
  var scale;
  if (this._currIndex < this._arScales.length) {
    scale = this._arScales[this._currIndex];
  } else {
    scale = this._arScales[this._arScales.length - 1];
  }

  this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getScaleX, obj.setScaleX, scale.x);
  this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getScaleY, obj.setScaleY, scale.y);

  this._currIndex++;
};

/**
 * Class representing an animation to pop an object in.
 * @extends {dvt.BaseAnimation}
 * @class AnimPopIn
 * @constructor
 *
 * @param {dvt.Context}  context  platform specific context object
 * @param objs  a single Container or Array of DvtContainers to animate
 * @param {boolean}  bCenter  true to scale the object from its center,
 *        false to scale from its origin
 * @param {number}  duration  length of animation, in seconds
 * @param {number}  delay  time to delay start of animation, in seconds
 */
const AnimPopIn = function (context, objs, bCenter, duration, delay) {
  this.Init(context, objs, bCenter, duration, delay);
};

Obj.createSubclass(AnimPopIn, BaseAnimation);

/**
 * @protected
 */
AnimPopIn.BackOut = function (progress) {
  return Easing.backOut(progress, 2.5);
};

/**
 * @protected
 * @override
 */
AnimPopIn.prototype.Init = function (context, objs, bCenter, duration, delay) {
  this._bCenter = bCenter;
  if (this._bCenter) {
    //temporary containers used to scale an object from its center
    this._tempContainers = [];
    //current index in array of temp containers
    this._currIndex = 0;
  }
  AnimPopIn.superclass.Init.call(this, context, objs, duration, delay);
};

/**
 * @override
 */
AnimPopIn.prototype.setEasing = function (easing) {
  //do nothing because we want to use our own easing
};

/**
 * @protected
 * @override
 */
AnimPopIn.prototype.CreateAnimator = function (context) {
  AnimPopIn.superclass.CreateAnimator.call(this, context);
  this._animator.setEasing(AnimPopIn.BackOut);
  if (this._bCenter) {
    //need to remove temporary containers at end of anim
    Playable.appendOnEnd(this._animator, this.RemoveTempContainers, this);
  }
};

/**
 * @protected
 * @override
 */
AnimPopIn.prototype.InitStartState = function (obj) {
  if (this._bCenter) {
    //For centering, the idea is to insert a temporary container between the obj and its
    //parent.  The temp container will be positioned such that its origin is at the center
    //of the obj.  Then, when the temp container is scaled about its origin, it will look
    //like the obj is scaled about its own center point.
    var tempContainer = this._tempContainers[this._currIndex];

    var dims = obj.getDimensions();
    //store the original translate on the temp container
    tempContainer._dvtAnimPopInOrigTx = obj.getTranslateX();
    tempContainer._dvtAnimPopInOrigTy = obj.getTranslateY();
    //calculate the center point of the obj
    var dx = dims.x + 0.5 * dims.w;
    var dy = dims.y + 0.5 * dims.h;
    //position the origin of the temp container at the center point of the obj
    //so that the obj appears to scale from its center
    tempContainer.setTranslate(
      tempContainer._dvtAnimPopInOrigTx + dx,
      tempContainer._dvtAnimPopInOrigTy + dy
    );
    //translate the obj so that its center point is at the origin of the temp container
    obj.setTranslate(-dx, -dy);
    //reparent the obj to the temp container, and insert the temp container into
    //the obj's original parent at the same index
    var childIndex = obj.getParent().getChildIndex(obj);
    tempContainer._dvtAnimPopInChildIndex = childIndex;
    obj.getParent().addChildAt(tempContainer, childIndex);
    tempContainer.addChild(obj);

    //scale the temp container instead of the obj
    tempContainer.setScale(0.01, 0.01);

    this._currIndex++;
  } else {
    //scale the obj
    obj.setScale(0.01, 0.01);
  }
  obj.setVisible(true);
};

/**
 * @protected
 * @override
 */
AnimPopIn.prototype.InitEndState = function (obj) {
  if (this._bCenter) {
    //create a temp container
    var tempContainer = new Container(this._context);
    this._tempContainers.push(tempContainer);
    //scale the temp container to full size
    this._animator.addProp(
      Animator.TYPE_NUMBER,
      tempContainer,
      tempContainer.getScaleX,
      tempContainer.setScaleX,
      1
    );
    this._animator.addProp(
      Animator.TYPE_NUMBER,
      tempContainer,
      tempContainer.getScaleY,
      tempContainer.setScaleY,
      1
    );
  } else {
    this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getScaleX, obj.setScaleX, 1);
    this._animator.addProp(Animator.TYPE_NUMBER, obj, obj.getScaleY, obj.setScaleY, 1);
  }
};

/**
 * @protected
 */
AnimPopIn.prototype.RemoveTempContainers = function () {
  //remove temp containers used for scaling from center
  if (this._tempContainers) {
    for (var i = 0; i < this._tempContainers.length; i++) {
      var tempContainer = this._tempContainers[i];
      this._tempContainers[i] = null;
      if (tempContainer.getNumChildren() > 0) {
        //obj should be first child of temp container
        var obj = tempContainer.getChildAt(0);
        if (obj) {
          //translate the obj back to its original position and reparent it back to
          //its original container at the same z-index
          obj.setTranslate(tempContainer._dvtAnimPopInOrigTx, tempContainer._dvtAnimPopInOrigTy);
          tempContainer.getParent().addChildAt(obj, tempContainer._dvtAnimPopInChildIndex);
        }
      }
      //remove the temp container from the display list
      tempContainer.getParent().removeChild(tempContainer);
    }
    this._tempContainers = null;
  }
};

/**
  *   Creates an immutable linear gradient fill.
  *   @extends {dvt.GradientFill}
  *   @class
  *   <p>
  *   <b>Example usage:</b><br><br><code>
  *
  *   //  Fill rectangle with a left-to-right gradient of red through blue to green.<br>
  *   //  The colors are evenly graduated because the stop values have been omitted.<br><br>
  *   rect.setFill(<b>new LinearGradientFill(0, ['red', 'green, 'blue']</b>) ;<br><br>
  *
  *   //  Fill rectangle with a north-east direction gradient of red to green
  *   with an unequal gradient distribution of colors.<br><br>
  *   rect.setFill(<b>new LinearGradientFill(45, ['red', 'green], [0, 0.75,1]</b>) ;<br><br>

  *   @constructor
  *   @param {number} angle  Specifies the direction of the gradient as an
  *                          angle in degrees (using the standard anti-clockwise convention
  *                           for positive angles, i.e. 0 = horizontal and 90 = vertically up, etc).
  *   @param {Array} arColors  An array of color specifications (which do not include alpha values).
  *   @param {Array} arColors  An optional array of alpha values (between 0 and 1).  If omitted,
  *                            alphas of 1 are assumed.
  *   @param {Array} arStops   An optional array of stop boundary positions (between 0 and 1).
  *                            If omitted, an equal distribution of colors is assumed.
  *   @param {Array} arBounds  An optional bounding box array (x, y, w, h).
  */
const LinearGradientFill = function (angle, arColors, arAlphas, arStops, arBounds) {
  this.Init(angle, arColors, arAlphas, arStops, arBounds);
};

Obj.createSubclass(LinearGradientFill, GradientFill);

/**
 *  @override
 */
LinearGradientFill.prototype.Init = function (angle, arColors, arAlphas, arStops, arBounds) {
  LinearGradientFill.superclass.Init.call(this, arColors, arAlphas, arStops, arBounds);

  if (angle === null || isNaN(angle)) {
    angle = 0;
  } else if (Math.abs(angle) > 360) {
    angle %= 360;
  }

  this._angle = angle;
};

/**
 *  Gets the angle of the gradient in degrees.
 *  @type {number}
 *  @return The angle of the gradient in degrees.  The zero degree direction is
 *  left-to-right (due east). Positive angles rotate anti-clockwise, and negative
 *  angles rotate clockwise.
 */
LinearGradientFill.prototype.getAngle = function () {
  return this._angle;
};

/**
 * @override
 */
LinearGradientFill.prototype.equals = function (fill) {
  if (fill instanceof LinearGradientFill && fill.getAngle() == this.getAngle())
    return LinearGradientFill.superclass.equals.call(this, fill);
  else return false;
};

/*---------------------------------------------------------------------*/
/*    KeyboardFocusEffect     Manages keyboard focus effect         */
/*---------------------------------------------------------------------*/
/**
 *  Creates a rectangular shape that represents keyboard focus
 *  @param {dvt.Context} context the rendering context
 *  @param {dvt.Container} displayable a parent container
 *  @param {Rectangle} bounds keyboard focus dimensions
 *  @param {dvt.Matrix} matrix transformation matrix to apply to the focus effect
 *  @param {string} id  optional id for the focus
 *  @param {boolean} bAppendLast optional argument that specifies a position of the focus effect in the parent container.
 *                   True to add focus effect to the end of the child list. Default is false.
 *  @extends {Rect}
 */
const KeyboardFocusEffect = function (context, displayable, bounds, matrix, id, bAppendLast) {
  this.Init(context, displayable, bounds, matrix, id, bAppendLast);
};

Obj.createSubclass(KeyboardFocusEffect, Obj);

KeyboardFocusEffect.FOCUS_BORDER_RADIUS = 1;
KeyboardFocusEffect.FOCUS_STROKE_WIDTH = 1;
KeyboardFocusEffect.FOCUS_STROKE_ALPHA = 1;

/*---------------------------------------------------------------------*/
/*  Init()                                                             */
/*---------------------------------------------------------------------*/
/**
 *  Object initializer.
 *  @param {dvt.Context} context the rendering context
 *  @param {dvt.Container} container a parent container
 *  @param {Rectangle} bounds keyboard focus dimensions
 *  @param {dvt.Matrix} matrix transformation matrix to apply to the focus effect
 *  @param {string} id  optional id for the focus
 *  @param {boolean} bAppendLast optional argument that specifies a position of the focus effect in the parent container.
 *                   True to add focus effect to the end of the child list. Default is false.
 *  @protected
 */
KeyboardFocusEffect.prototype.Init = function (
  context,
  container,
  bounds,
  matrix,
  id,
  bAppendLast
) {
  this._container = container;
  this._focusEffect = new Rect(context, bounds.x, bounds.y, bounds.w, bounds.h, id);

  var stroke = this.CreateStroke();
  this._focusEffect.setStroke(stroke);
  this._focusEffect.setRx(KeyboardFocusEffect.FOCUS_BORDER_RADIUS);
  this._focusEffect.setRy(KeyboardFocusEffect.FOCUS_BORDER_RADIUS);
  if (matrix) this._focusEffect.setMatrix(matrix);
  this._focusEffect.setFill(null);
  this._appendLast = bAppendLast;
};

/**
 * Helper function that creates a solid stroke for the focus rectangle
 * @return {Stroke} a stroke for the focus rectangle
 * @protected
 */
KeyboardFocusEffect.prototype.CreateStroke = function () {
  var color = Agent.getFocusColor();
  var width = KeyboardFocusEffect.FOCUS_STROKE_WIDTH;
  var alpha = KeyboardFocusEffect.FOCUS_STROKE_ALPHA;
  var dashProps;
  if (Agent.browser === 'safari' || Agent.engine === 'blink') {
    width = 2;
  } else {
    dashProps = {
      dashArray: width,
      dashOffset: width
    };
  }

  return new Stroke(color, alpha, width, false, dashProps);
};

KeyboardFocusEffect.prototype.getEffect = function () {
  return this._focusEffect;
};

KeyboardFocusEffect.prototype.setEffect = function (effect) {
  this._focusEffect = effect;
};

KeyboardFocusEffect.prototype.show = function () {
  if (this._focusEffect instanceof Shape) {
    if (!this._appendLast) this._container.addChildAt(this._focusEffect, 0);
    else this._container.addChild(this._focusEffect);
  }
};

KeyboardFocusEffect.prototype.hide = function () {
  if (this._focusEffect instanceof Shape) this._container.removeChild(this._focusEffect);
};

/**
 * 2D array implementation for use in improving performance.  Alternate implementation options may be added in
 * the future as needed.
 * @class Array2D
 * @extends {dvt.Obj}
 * @constructor
 */
const Array2D = function () {
  this.Init();
};

Obj.createSubclass(Array2D, Obj);

/**
 * Initializes the array and its underlying data structures.
 */
Array2D.prototype.Init = function () {
  this._data = [];
};

/**
 * Retrieves the value corresponding to the keys from the array.
 * @param {number} keyA
 * @param {number} keyB
 * @return {object}
 */
Array2D.prototype.get = function (keyA, keyB) {
  return this._getInner(keyA)[keyB];
};

/**
 * Stores the value corresponding to the keys in the array.
 * @param {number} keyA
 * @param {number} keyB
 * @param {object} value
 * @return {object} The previous value, if one existed.
 */
Array2D.prototype.put = function (keyA, keyB, value) {
  var innerMap = this._getInner(keyA);
  var oldValue = innerMap[keyB];
  innerMap[keyB] = value;
  return oldValue;
};

/**
 * Returns the inner array corresponding to the specified key, creating it if necessary.
 * @param {number} keyA
 * @return {array} The inner array.
 * @private
 */
Array2D.prototype._getInner = function (keyA) {
  var innerMap = this._data[keyA];
  if (!innerMap) {
    innerMap = [];
    this._data[keyA] = innerMap;
  }
  return innerMap;
};

/**
 *  A static class for chart layout.
 *  @class LayoutUtils
 *  @constructor
 */
const LayoutUtils = {};

Obj.createSubclass(LayoutUtils, Obj);

/**
 * Positions the specified displayable in the available space.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {string} position The position within the available space.  Valid values are "top", "bottom", "left", "right", "start", "end".
 * @param {dvt.Displayable} displayable The displayable to be positioned.
 * @param {number} width The width of the displayable.
 * @param {number} height The height of the displayable.
 * @param {number} gap The gap to leave between the displayable and other content.  This gap is applied only if
 *                     the displayable's area is greater than 0.
 */
LayoutUtils.position = function (availSpace, position, displayable, width, height, gap) {
  if (!displayable) return;

  // Adjust the gap if the displayable has no area
  gap = width * height > 0 ? gap : 0;

  if (position == 'start') position = Agent.isRightToLeft(displayable.getCtx()) ? 'right' : 'left';
  else if (position == 'end')
    position = Agent.isRightToLeft(displayable.getCtx()) ? 'left' : 'right';

  if (position == 'top') {
    displayable.setTranslate(availSpace.x + availSpace.w / 2 - width / 2, availSpace.y);
    availSpace.y += height + gap;
    availSpace.h -= height + gap;
  } else if (position == 'bottom') {
    displayable.setTranslate(
      availSpace.x + availSpace.w / 2 - width / 2,
      availSpace.y + availSpace.h - height
    );
    availSpace.h -= height + gap;
  } else if (position == 'left') {
    displayable.setTranslate(availSpace.x, availSpace.y + availSpace.h / 2 - height / 2);
    availSpace.x += width + gap;
    availSpace.w -= width + gap;
  } else if (position == 'right') {
    displayable.setTranslate(
      availSpace.x + availSpace.w - width,
      availSpace.y + availSpace.h / 2 - height / 2
    );
    availSpace.w -= width + gap;
  }
};

/**
 * Aligns the specified displayable in the available space.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {string} align The position within the available space.  Valid values are "start", "center", and "end".
 * @param {dvt.Displayable} displayable The displayable to be positioned.
 * @param {number} width The width of the displayable.
 */
LayoutUtils.align = function (availSpace, align, displayable, width) {
  if (!displayable) return;

  // Account for the locale and find the position
  var position = align;
  if (position == 'start') position = Agent.isRightToLeft(displayable.getCtx()) ? 'right' : 'left';
  else if (position == 'end')
    position = Agent.isRightToLeft(displayable.getCtx()) ? 'left' : 'right';

  // Align the text
  if (position == 'left') displayable.setX(availSpace.x);
  else if (position == 'center') displayable.setX(availSpace.x + availSpace.w / 2 - width / 2);
  else if (position == 'right') displayable.setX(availSpace.x + availSpace.w - width);
};

/**
 * Returns the bubble marker size for a data item.
 * @param {number} z The z value of the data item.
 * @param {number} minZ The minimum z value in the data set.
 * @param {number} maxZ The maximum z value in the data set.
 * @param {number} minSize The smallest allowable bubble size.
 * @param {number} maxSize The largest allowable bubble size.
 * @return {number}
 */
LayoutUtils.getBubbleSize = function (z, minZ, maxZ, minSize, maxSize) {
  if (z <= 0) return 0;

  // Marker shape doesn't matter, so assume square markers
  var minArea = minSize * minSize;
  var maxArea = maxSize * maxSize;

  // If the z value range is less than the area range, reduce the are range to match the z value range by
  // increasing minArea and decreasing maxArea by the same factor
  if (maxZ / minZ < maxArea / minArea) {
    // The formula below guarantees that:
    // 1) the new area range matches the z value range, i.e. (maxArea / minArea) == (maxZ / minZ)
    // 2) the new area range is within than the original area range, i.e. (maxArea < origMaxArea) && (minArea > origMinArea)
    // 3) the max area is decreased by the same factor as the min area is increased, i.e. (origMaxArea / maxArea) == (minArea / origMinArea)
    var avgArea = Math.sqrt(minArea * maxArea);
    var avgZ = Math.sqrt(minZ * maxZ);

    // Handle the case where z == minZ == maxZ
    if (z == avgZ) return Math.sqrt(avgArea);

    maxArea = (maxZ / avgZ) * avgArea;
    minArea = (minZ / avgZ) * avgArea;
  }

  // The bubble area is linearly proportional to the z value
  var area = minArea + ((z - minZ) / (maxZ - minZ)) * (maxArea - minArea);
  return Math.sqrt(area);
};

/**
 * A specialized map used for tracking whether a set of pixel coords has been drawn to.
 * @param {number=} scale The scale factor determining how many pixels in each direction the map coords correspond to.
 *                         Defaults to 1 if not specified. The scale factor must be an exact multiple of the inner map's
 *                         scale factor.
 * @param {PixelMap=} innerMap A map with smaller scale factor.
 * @class PixelMap
 * @extends {dvt.Array2D}
 * @constructor
 */
const PixelMap = function (scale, innerMap) {
  this.Init(scale, innerMap);
};

Obj.createSubclass(PixelMap, Array2D);

/** @private @const **/
PixelMap._INITIAL_SIZE = 1500;

/**
 * Initializes the map and its underlying data structures.
 * @param {number=} scale The scale factor determining how many pixels in each direction the map coords correspond to.
 *                         Defaults to 1 if not specified. The scale factor must be an exact multiple of the inner map's
 *                         scale factor.
 * @param {PixelMap=} innerMap A map with smaller scale factor.
 */
PixelMap.prototype.Init = function (scale, innerMap) {
  PixelMap.superclass.Init.call(this);

  // Store the inner map and add the outer map reference back to this.
  this._innerMap = innerMap;
  if (this._innerMap) {
    this._innerMap._outerMap = this;
    this._innerMap._bOuterMap = true;
  }

  // Store the scale and cache capacity.
  this._scale = scale || 1;
  this._capacity = this._scale * this._scale;

  // Cache the presence of inner and outer maps, since they are checked frequently.
  this._bInnerMap = this._innerMap != null;
  this._bOuterMap = false; // set to true if passed to an outer map.

  // Prepopulate a section of the underlying data structure for performance reasons.
  // Testing has shown that subsequent use of a pre-populated 2D array is significantly
  // faster than populating the data structure as we go.
  var initialSize = PixelMap._INITIAL_SIZE / this._scale;
  for (var x = 0; x < initialSize; x++) {
    for (var y = 0; y < initialSize; y++) {
      this.put(x, y, 0);
    }
  }
};

/**
 * Returns true if the specified coordinates are fully obscured.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return {boolean}
 */
PixelMap.prototype.isObscured = function (x1, y1, x2, y2) {
  // Evaluate the scaled areas to determine whether the coords are obscured.
  var scaledX1 = this._adjustForScale(x1);
  var scaledY1 = this._adjustForScale(y1);
  var scaledX2 = this._adjustForScale(x2);
  var scaledY2 = this._adjustForScale(y2);
  for (var xCoord = scaledX1; xCoord <= scaledX2; xCoord++) {
    for (var yCoord = scaledY1; yCoord <= scaledY2; yCoord++) {
      // Check this map's information. If known to be obscured, search the next area.
      var pixelValue = this.get(xCoord, yCoord);
      if (pixelValue !== true) {
        // Not known to be obscured, check the inner map.
        if (this._bInnerMap) {
          var innerX1 = Math.max(x1, xCoord * this._scale);
          var innerY1 = Math.max(y1, yCoord * this._scale);
          var innerX2 = Math.min(x2, (xCoord + 1) * this._scale - 1);
          var innerY2 = Math.min(y2, (yCoord + 1) * this._scale - 1);
          if (!this._innerMap.isObscured(innerX1, innerY1, innerX2, innerY2)) return false;
        } // no inner map, not obscured.
        else return false;
      }
    }
  }
  // If not obscured, would've returned false earlier.
  return true;
};

/**
 * Obscures the specified coordinates.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} alpha The amount of the pixel to obscure.
 */
PixelMap.prototype.obscure = function (x1, y1, x2, y2, alpha) {
  // Evaluate the scaled segments to determine whether the coords are obscured.
  var scaledX1 = this._adjustForScale(x1);
  var scaledY1 = this._adjustForScale(y1);
  var scaledX2 = this._adjustForScale(x2);
  var scaledY2 = this._adjustForScale(y2);
  for (var xCoord = scaledX1; xCoord <= scaledX2; xCoord++) {
    for (var yCoord = scaledY1; yCoord <= scaledY2; yCoord++) {
      // Check this map's information. If not known to be obscured, check the inner maps.
      var pixelValue = this.get(xCoord, yCoord);
      if (pixelValue !== true) {
        if (this._bInnerMap) {
          var innerX1 = Math.max(x1, xCoord * this._scale);
          var innerY1 = Math.max(y1, yCoord * this._scale);
          var innerX2 = Math.min(x2, (xCoord + 1) * this._scale - 1);
          var innerY2 = Math.min(y2, (yCoord + 1) * this._scale - 1);
          this._innerMap.obscure(innerX1, innerY1, innerX2, innerY2, alpha);
        } else {
          // No inner map, increment. The scale should always be 1 here.
          this._increment(xCoord, yCoord, alpha);
        }
      }
    }
  }
};

/**
 * Increments the map for the specified coordinates.
 * @param {number} x The unscaled x coordinate.
 * @param {number} y The unscaled y coordinate.
 * @param {number} incr The amount to increment.
 * @private
 */
PixelMap.prototype._increment = function (x, y, incr) {
  // First adjust the coordinates for this map's scale.
  var scaledX = this._adjustForScale(x);
  var scaledY = this._adjustForScale(y);

  // Increment the value. If value is greater than capacity, store as true (occupied).
  var value = this.get(scaledX, scaledY);
  value = value != null ? value + incr : incr;
  if (value >= this._capacity) value = true;

  // Update the map.
  this.put(scaledX, scaledY, value);

  // If at capacity, update the outer map.
  if (value === true && this._bOuterMap) this._outerMap._increment(x, y, this._capacity);
};

/**
 * Returns the scaled value for the specified coordinate.
 * @param {number} coord The unscaled coordinate.
 * @return {number}
 * @private
 */
PixelMap.prototype._adjustForScale = function (coord) {
  return Math.floor(coord / this._scale);
};

/**
 * ImageLoader
 */
const ImageLoader = { _cache: {} };

Obj.createSubclass(ImageLoader, Obj);
/**
 * Copied from AdfIEAgent and AdfAgent
 * Adds an event listener that fires in the non-Capture phases for the specified
 * eventType.  There is no ordering guaranteee, nor is there a guarantee
 * regarding the number of times that an event listener will be called if
 * it is added to the same element multiple times.
 */
ImageLoader.addBubbleEventListener = function (element, type, listener) {
  if (window.addEventListener) {
    ToolkitUtils.addDomEventListener(element, type, listener, false);
    return true;
  }
  // Internet Explorer
  else if (window.attachEvent) {
    element.attachEvent('on' + type, listener);
    return true;
  } else {
    return false;
  }
};

/**
 * @this {ImageLoader}
 * Load an image.
 *
 * @param src URL of the image to load
 * @param onComplete function to call when the image is loaded
 *
 * @return image if image is already loaded
 *         otherwise null
 */
ImageLoader.loadImage = function (src, onComplete) {
  //first look for a cached copy of the image
  var entry = this._cache[src];

  //if cached image found, use it
  if (entry) {
    // if image is loading, add listener to queue
    if (entry._image) {
      ImageLoader._addListenerToQueue(entry._listeners, onComplete);
    }
    // if image is loaded, call onComplete function
    else {
      if (onComplete) {
        onComplete(entry);
      }
      // no handler, just return image width and height
      return entry;
    }
  }
  //if cached image not found, load the new image
  else {
    this.loadNewImage(src, onComplete);
  }
  return null;
};

/**
 * @this {ImageLoader}
 * Load a new image.
 *
 * @param src URL of the image to load
 * @param onComplete function to call when the image is loaded
 */
ImageLoader.loadNewImage = function (src, onComplete) {
  // create img element
  var image = document.createElement('img');

  // add a new entry to the image cached
  // depending on the state, entry value contains different attributes
  // when image is loading, entry contains image element and listeners
  // when image is loaded, entry contains image width and height
  var newEntry = {
    _listeners: [],
    url: src,
    _image: image
  };
  if (onComplete) {
    //    newEntry._listeners.push(onComplete);
    ImageLoader._addListenerToQueue(newEntry._listeners, onComplete);
  }

  this._cache[src] = newEntry;

  ImageLoader.addBubbleEventListener(image, 'load', function (e) {
    // copy width and height to entry and delete image element
    newEntry.width = image.width;
    newEntry.height = image.height;
    delete newEntry._image;

    // notify all listeners image loaded and delete all listeners
    var i;
    var len = newEntry._listeners.length;
    for (i = 0; i < len; i++) {
      // if there is a listener
      if (newEntry._listeners[i]) {
        newEntry._listeners[i](newEntry);
      }
    }
    delete newEntry._listeners;
  });

  image.src = src;
};

// add a listener to the queue only if it doesn't already exist
ImageLoader._addListenerToQueue = function (queue, listener) {
  if (listener) {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i] === listener) return;
    }
    queue.push(listener);
  }
};

/**
 * Utility functions for polygons.
 * @class
 */
const PolygonUtils = {};

Obj.createSubclass(PolygonUtils, Obj);

/**
 * Returns the bounding box of the supplied polygon coords.
 * @param {Array} aPts an array of consecutive x,y coordinate pairs.
 * @return {Rectangle} the bounding box of the supplied polygon.
 */
PolygonUtils.getDimensions = function (aPts) {
  if (!aPts || aPts.length === 0) {
    return new Rectangle();
  }

  var minX = Number.MAX_VALUE;
  var maxX = -1 * Number.MAX_VALUE;
  var minY = Number.MAX_VALUE;
  var maxY = -1 * Number.MAX_VALUE;

  var len = aPts.length;
  var x, y;
  for (var i = 0; i < len; i++) {
    x = aPts[i++];
    y = aPts[i];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  return new Rectangle(minX, minY, Math.abs(maxX - minX), Math.abs(maxY - minY));
};

/**
 * Gets the points array for a regular polygon with n sides and radius r.
 * @param {number} cx Center x.
 * @param {number} cy Center y.
 * @param {number} n The number of sides.
 * @param {number} r the radius (distance from center to vertex).
 * @param {number} theta The angle of the first vertex (from top center).
 * @param {number=} direction 1 for clockwise, 0 for counter-clockwise. Default is clockwise.
 * @return {array} Points array.
 * @private
 */
PolygonUtils.getRegularPolygonPoints = function (cx, cy, n, r, theta, direction) {
  var points = [];
  var angle;
  for (var i = 0; i < n; i++) {
    angle = theta + (i / n) * 2 * Math.PI * (direction == 0 ? -1 : 1);
    points.push(cx + r * Math.sin(angle), cy - r * Math.cos(angle));
  }
  return points;
};

/**
 * Scales and returns the points array for a polygon.
 * @param {array} points
 * @param {number} sx
 * @param {number} sy
 * @return {array}
 */
PolygonUtils.scale = function (points, sx, sy) {
  var ret = [];
  for (var i = 0; i < points.length - 1; i += 2) {
    ret.push(points[i] * sx);
    ret.push(points[i + 1] * sy);
  }
  return ret;
};

/**
 * Translates and returns the points array for a polygon.
 * @param {array} points
 * @param {number} tx
 * @param {number} ty
 * @return {array}
 */
PolygonUtils.translate = function (points, tx, ty) {
  var ret = [];
  for (var i = 0; i < points.length - 1; i += 2) {
    ret.push(points[i] + tx);
    ret.push(points[i + 1] + ty);
  }
  return ret;
};

/**
 * Circle displayable.
 * @param {dvt.Context} context
 * @param {number} cx The x coordinate of the center of the circle.
 * @param {number} cy The y coordinate of the center of the circle.
 * @param {number} r The radius of the circle.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @class
 * @constructor
 */
const Circle = function (context, cx, cy, r, id) {
  this.Init(context, cx, cy, r, id);
};

Obj.createSubclass(Circle, Shape);

/**
 * @param {dvt.Context} context
 * @param {number} cx The x coordinate of the center of the circle.
 * @param {number} cy The y coordinate of the center of the circle.
 * @param {number} r The radius of the circle.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
Circle.prototype.Init = function (context, cx, cy, r, id) {
  Circle.superclass.Init.call(this, context, 'circle', id);
  this.setCx(cx).setCy(cy);
  this.setRadius(r);
};

// Create SVG property getters and setters
Displayable.defineProps(Circle, { r: { name: 'radius' }, cx: { value: 0 }, cy: { value: 0 } });

/**
 * @override
 */
Circle.prototype.copyShape = function () {
  return new Circle(this.getCtx(), this.getCx(), this.getCy(), this.getRadius());
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
Circle.prototype.getDimensionsSelf = function (targetCoordinateSpace) {
  // Note: In the near future, we will not support children for shapes, so this routine will be refactored into the
  //       existing getDimensions calls.  For now, components must be aware of the presence of children to use this.
  var bounds = new Rectangle(
    this.getCx() - this.getRadius(),
    this.getCy() - this.getRadius(),
    this.getRadius() * 2,
    this.getRadius() * 2
  );
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

/**
 * Image displayable.
 * @param {dvt.Context} context
 * @param {string} src The url for the image
 * @param {number} x The top left x-coordinate of the image
 * @param {number} y The top left y-coordinate of the image
 * @param {number} w The image width
 * @param {number} h The image height
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {Shape}
 * @class
 * @constructor
 */
const Image = function (context, src, x, y, w, h, id) {
  this.Init(context, src, x, y, w, h, id);
};

Obj.createSubclass(Image, Shape); // TODO  this should extend displayable

/**
 * Helper method called by the constructor for initializing this object
 * @param {string} src The url for the image
 * @param {number} x The top left x-coordinate of the image
 * @param {number} y The top left y-coordinate of the image
 * @param {number} w The image width
 * @param {number} h The image height
 * @param {string} id The identifier for the image
 * @private
 */
Image.prototype.Init = function (context, src, x, y, w, h, id) {
  Image.superclass.Init.call(this, context, 'image', id);

  // If we're in JET where the src may be a CSS class name, then obtain the URL from the background-image property.
  src = ToolkitUtils.getImageUrl(context, src);

  // IE doesn't allow interactivity unless there's a fill
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    ToolkitUtils.setAttrNullNS(this._elem, 'fill', '#FFFFFF');
    ToolkitUtils.setAttrNullNS(this._elem, 'fill-opacity', '0');
  }

  //Sets the position and size and src of the image
  this.setSrc(src);
  this.setX(x).setY(y);
  this.setWidth(w);
  this.setHeight(h);

  //TODO: set preserveAspectRatio="none" for now
  ToolkitUtils.setAttrNullNS(this._elem, 'preserveAspectRatio', 'none');

  // By default, hide images from VoiceOver
  this.setAriaProperty('hidden', 'true');
};

// Create SVG property getters and setters
Displayable.defineProps(Image, { x: {}, y: {}, width: {}, height: {} });

/**
 * Returns the src of the image.
 * @return (String) the src of the image.
 */
Image.prototype.getSrc = function () {
  return this._src;
};

/**
 * Sets the src of the image.
 * @param {String} src  The src of the image.
 * @return {Image} self Image object
 */
Image.prototype.setSrc = function (src) {
  if (src !== this._src) {
    var uri = src;
    this._src = src;

    ToolkitUtils.setHref(this._elem, uri);
  }

  // Return self for linking setters
  return this;
};

/**
 * @override
 */
Image.prototype.getDimensions = function (targetCoordinateSpace) {
  // Optimized implementation that allows container geometry to be taken into account to avoid costly DOM calls
  if (this.getDimensionsSelf && this.getNumChildren() - this._getInnerShapeCount() == 0)
    return this.getDimensionsSelf(targetCoordinateSpace);
  else {
    var bbox = this.getElem().getBBox();
    if (bbox.width && bbox.height) bbox = new Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
    else bbox = new Rectangle(bbox.x, bbox.y, this.getWidth(), this.getHeight());

    return this.ConvertCoordSpaceRect(bbox, targetCoordinateSpace);
  }
};

/**
 * Convenience method for setting the width and height of the image.
 * @param {object} dims An object with width and height properties.
 */
Image.prototype.__setDimensions = function (dims) {
  this.setWidth(dims.width);
  this.setHeight(dims.height);
};

/**
 * @override
 */
Image.prototype.UpdateSelectionEffect = function () {
  // noop: Does not participate in selection effects
};

/**
 * @override
 */
Image.prototype.copyShape = function () {
  return new Image(
    this.getCtx(),
    this.getSrc(),
    this.getX(),
    this.getY(),
    this.getWidth(),
    this.getHeight()
  );
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
Image.prototype.getDimensionsSelf = function (targetCoordinateSpace) {
  // Note: In the near future, we will not support children for shapes, so this routine will be refactored into the
  //       existing getDimensions calls.  For now, components must be aware of the presence of children to use this.
  var bounds = new Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

/**
 * @override
 */
Image.prototype.setAriaProperty = function (property, value) {
  Image.superclass.setAriaProperty.call(this, property, value);
  if (property != 'hidden') Image.superclass.setAriaProperty.call(this, 'hidden', null);
};

/**
 * Line displayable.
 * @param {dvt.Context} context
 * @param {number} x1 The x coordinate of the first point.
 * @param {number} y1 The y coordinate of the first point.
 * @param {number} x2 The x coordinate of the second point.
 * @param {number} y2 The y coordinate of the second point.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {Shape}
 * @class
 * @constructor
 */
const Line = function (context, x1, y1, x2, y2, id) {
  this.Init(context, x1, y1, x2, y2, id);
};

Obj.createSubclass(Line, Shape);

/**
 * @param {dvt.Context} context
 * @param {number} x1 The x coordinate of the first point.
 * @param {number} y1 The y coordinate of the first point.
 * @param {number} x2 The x coordinate of the second point.
 * @param {number} y2 The y coordinate of the second point.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
Line.prototype.Init = function (context, x1, y1, x2, y2, id) {
  Line.superclass.Init.call(this, context, 'line', id);

  this.setX1(x1).setY1(y1).setX2(x2).setY2(y2);
  this._bHollow = false; // TODO  CLEANUP: The whole bHollow thing is pretty strange.
};

// Create SVG property getters and setters
Displayable.defineProps(Line, {
  x1: { value: 0 },
  x2: { value: 0 },
  y1: { value: 0 },
  y2: { value: 0 }
});

/**
 * Changes the shape to an outline shape format.  Used for legend that represent a hidden state.
 * @override
 */
Line.prototype.setHollow = function () {
  var parentElem = this._elem.parentNode;

  if (!this._bHollow) {
    this._origElem = this._elem;
    var hollowMarker;
    var width = this.getX2() - this.getX1(); // Legend lines are always horizontal, so take width as height
    var height = width;
    var startY = this.getY1() - width / 2;
    var stroke = this.getStroke();

    hollowMarker = SvgShapeUtils.createElement('rect');
    ToolkitUtils.setAttrNullNS(hollowMarker, 'x', this.getX1());
    ToolkitUtils.setAttrNullNS(hollowMarker, 'y', startY);
    ToolkitUtils.setAttrNullNS(hollowMarker, 'width', this.getX2() - this.getX1());
    ToolkitUtils.setAttrNullNS(hollowMarker, 'height', height);
    var color = stroke.getColor();
    const STROKE_OPACITY = 'stroke-opacity';
    if (color) {
      var alpha = stroke.getAlpha();
      // Workaround for Safari where versions < 5.1 draw rgba values as black
      if (Agent.browser === 'safari' && color.indexOf('rgba') !== -1) {
        ToolkitUtils.setAttrNullNS(hollowMarker, 'stroke', ColorUtils.getRGB(color));
        // Use alpa in rgba value as a multiplier to the alpha set on the object as this is what svg does.
        if (alpha != null)
          ToolkitUtils.setAttrNullNS(
            hollowMarker,
            STROKE_OPACITY,
            ColorUtils.getAlpha(color) * alpha
          );
        else ToolkitUtils.setAttrNullNS(hollowMarker, STROKE_OPACITY, ColorUtils.getAlpha(color));
      } else {
        ToolkitUtils.setAttrNullNS(hollowMarker, 'stroke', color);
        if (alpha != null) ToolkitUtils.setAttrNullNS(hollowMarker, STROKE_OPACITY, alpha);
      }
    }
    ToolkitUtils.setAttrNullNS(hollowMarker, 'fill', '#ffffff');
    ToolkitUtils.setAttrNullNS(hollowMarker, 'fill-opacity', '0.001'); // need this or hit detection fails on center
    ToolkitUtils.setAttrNullNS(hollowMarker, 'shape-rendering', 'crispEdges');
    hollowMarker._obj = this; // replace the elem's _obj backpointer
    parentElem.replaceChild(hollowMarker, this._elem);
    this._elem = hollowMarker;
    ToolkitUtils.setAttrNullNS(this._elem, 'opacity', this._alpha);
    this._bHollow = true;
  } else if (this._origElem) {
    parentElem.replaceChild(this._origElem, this._elem);
    ToolkitUtils.setAttrNullNS(this._origElem, 'opacity', this._alpha);
    this._elem = this._origElem;
    this._origElem = null;
    this._bHollow = false;
  }
};

/**
 * @override
 */
Line.prototype.getDimensions = function (targetCoordinateSpace) {
  // TODO  CLEANUP: It seems like this can just call getDimensionsSelf
  var bounds = Line.superclass.getDimensions.call(this, targetCoordinateSpace);
  // : Vertical/horizontal lines in svg are ignored when group containers wrap them
  if (this._childGroupElem && this._elem) {
    var groupBox = this._childGroupElem.getBBox();
    // Empty bounding box is an indication of only vertical/horizontal lines present in this group
    // In this case, use the original line itself to get the bounds as an approximation
    if (groupBox.x == 0 && groupBox.y == 0 && groupBox.width == 0 && groupBox.height == 0) {
      var lineBounds = this._elem.getBBox();
      bounds = new Rectangle(lineBounds.x, lineBounds.y, lineBounds.width, lineBounds.height);
    }
  }
  return bounds;
};

/**
 * @override
 */
Line.prototype.copyShape = function () {
  return new Line(this.getCtx(), this.getX1(), this.getY1(), this.getX2(), this.getY2());
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
Line.prototype.getDimensionsSelf = function (targetCoordinateSpace) {
  // Note: In the near future, we will not support children for shapes, so this routine will be refactored into the
  //       existing getDimensions calls.  For now, components must be aware of the presence of children to use this.
  var x = Math.min(this.getX1(), this.getX2());
  var y = Math.min(this.getY1(), this.getY2());
  var w = Math.abs(this.getX1() - this.getX2());
  var h = Math.abs(this.getY1() - this.getY2());

  var bounds = new Rectangle(x, y, w, h);
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

/**
 * SVG does not set style properties when a line has 0 width or height and only uses stroke width.
 * This function works around this SVG issue by adding a small variation to eliminate the 0 dimension.
 * @private
 */
Line.prototype._adjustDimensionsForStyle = function () {
  if (this.getX1() == this.getX2()) this.setX2(this.getX2() + 0.001);
  else if (this.getY1() == this.getY2()) this.setY2(this.getY2() + 0.001);
};

/**
 * @override
 * @param {boolean=} bSkipAdjustDimensions Whether coord adjustment should be skipped as it may cause bad rendering
 *                                         when pixel hinting is used.
 */
Line.prototype.setStyle = function (style, bSkipAdjustDimensions) {
  if (style && !bSkipAdjustDimensions) this._adjustDimensionsForStyle();
  return Line.superclass.setStyle.call(this, style);
};

/**
 * @override
 * @param {boolean=} bSkipAdjustDimensions Whether coord adjustment should be skipped as it may cause bad rendering
 *                                         when pixel hinting is used.
 */
Line.prototype.setClassName = function (className, bSkipAdjustDimensions) {
  if (className && !bSkipAdjustDimensions) this._adjustDimensionsForStyle();
  return Line.superclass.setClassName.call(this, className);
};

/**
 * Path displayable.
 * @param {dvt.Context} context
 * @param {object} cmds The string of SVG path commands or an array of SVG path commands, whose entries contain the
 *                      commands followed by coordinates.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {Shape}
 * @class
 * @constructor
 */
const Path = function (context, cmds, id) {
  this.Init(context, cmds, id);
};

Obj.createSubclass(Path, Shape);

/**
 * @param {dvt.Context} context
 * @param {object} cmds The string of SVG path commands or an array of SVG path commands, whose entries contain the
 *                      commands followed by coordinates.
 * @param {string=} id The optional id for the corresponding DOM element.
 */
Path.prototype.Init = function (context, cmds, id) {
  Path.superclass.Init.call(this, context, 'path', id);

  if (Array.isArray(cmds)) this.setCmds(PathUtils.getPathString(cmds));
  else this.setCmds(cmds);
};

/**
 * Returns the string of SVG path commands.
 * @param {string} cmds
 */
Path.prototype.getCmds = function () {
  return this.GetProperty('d');
};

/**
 * Specifies the string of SVG path commands.
 * @param {String} cmds
 * @return {Path}
 */
Path.prototype.setCmds = function (cmds) {
  if (cmds) this.SetSvgProperty('d', cmds);

  // Clear the cached array commands, which will be populated when needed.
  this.SetProperty('arCmds', null);

  // Return self for linking setters
  return this;
};

/**
 * Returns the array of SVG path commands, whose entries contain the commands followed by coordinates.
 * @return {array}
 */
Path.prototype.getCommandsArray = function () {
  // If cached copy exists, use it.
  var arCmds = this.GetProperty('arCmds');
  if (!arCmds) {
    // Otherwise, convert, cache and return.
    arCmds = PathUtils.createPathArray(this.getCmds());
    this.SetProperty('arCmds', arCmds);
  }
  return arCmds;
};

/**
 * Specifies the array of SVG path commands, whose entries contain the commands followed by coordinates.
 * @param {array} arCmds
 * @return {Path}
 */
Path.prototype.setCommandsArray = function (arCmds) {
  // Convert to string and set
  var cmds = arCmds ? PathUtils.getPathString(arCmds) : null;
  this.setCmds(cmds);

  // Cache the array
  this.SetProperty('arCmds', arCmds);

  // Return self for linking setters
  return this;
};

/**
 * @override
 */
Path.prototype.copyShape = function () {
  return new Path(this.getCtx(), this.getCmds());
};

/**
 * @override
 */
Path.prototype.GetAriaElem = function () {
  if (Agent.isTouchDevice()) this.CreateChildGroupElem(false, true);
  return Path.superclass.GetAriaElem.call(this);
};

/**
 *  @param {dvt.Context} context
 *  @param {String} shape Marker shape
 *  @param {number} cx  The x position of the center of the marker.
 *  @param {number} cy  The y position of the center of the marker.
 *  @param {number} width  The width of the marker.
 *  @param {number} height  The height of the marker.
 *  @param {string=} borderRadius Optional border radius value. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 *  @param {boolean=} bMaintainAspectRatio Optional boolean true if keeping aspect ratio.  True by default
 *  and only applies to built-in non-human shapes
 *  @param {boolean=} bUseIntegerCoords Optional specify whether to use integer coords in path
 *  @param {String=} id  Optional ID for the shape.
 *  @extends {Shape}
 *  @constructor
 */
const SimpleMarker = function (
  context,
  shape,
  cx,
  cy,
  width,
  height,
  borderRadius,
  bMaintainAspectRatio,
  bUseIntegerCoords,
  id
) {
  this.Init(
    context,
    shape,
    cx,
    cy,
    width,
    height,
    borderRadius,
    bMaintainAspectRatio,
    bUseIntegerCoords,
    id
  );
};

Obj.createSubclass(SimpleMarker, Shape);

// MARKER SHAPES
/**
 * A circular marker.
 */
SimpleMarker.CIRCLE = 'circle';

/**
 * An elliptical marker.
 */
SimpleMarker.ELLIPSE = 'ellipse';

/**
 * A square marker.
 */
SimpleMarker.SQUARE = 'square';

/**
 * A rectangular marker.
 */
SimpleMarker.RECTANGLE = 'rectangle';

/**
 * A diamond shaped marker.
 */
SimpleMarker.DIAMOND = 'diamond';

/**
 * A triangular shaped marker with a vertex at the top.
 */
SimpleMarker.TRIANGLE_UP = 'triangleUp';

/**
 * A triangular shaped marker with a vertex at the bottom.
 */
SimpleMarker.TRIANGLE_DOWN = 'triangleDown';

/**
 * A plus-shaped marker.
 */
SimpleMarker.PLUS = 'plus';

/**
 * A human figure shaped marker.
 */
SimpleMarker.HUMAN = 'human';

/**
 * A star figure shaped marker.
 */
SimpleMarker.STAR = 'star';

/**
 * Circle SVG element
 * @private
 */
SimpleMarker._CIRCLE_ELEM = 'circle';

/**
 * Ellipse SVG element
 * @private
 */
SimpleMarker._ELLIPSE_ELEM = 'ellipse';

/**
 * Rect SVG element
 * @private
 */
SimpleMarker._RECT_ELEM = 'rect';

/**
 * Path SVG element
 * @private
 */
SimpleMarker._PATH_ELEM = 'path';

/**
 * Polygon SVG element
 * @private
 */
SimpleMarker._POLYGON_ELEM = 'polygon';

/**
 * Mapping from shape to element type
 * @private
 */
SimpleMarker._SHAPE_ELEM_MAP = {};
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.CIRCLE] = SimpleMarker._CIRCLE_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.ELLIPSE] = SimpleMarker._ELLIPSE_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.SQUARE] = SimpleMarker._PATH_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.RECTANGLE] = SimpleMarker._PATH_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.DIAMOND] = SimpleMarker._POLYGON_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.TRIANGLE_UP] = SimpleMarker._POLYGON_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.TRIANGLE_DOWN] = SimpleMarker._POLYGON_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.PLUS] = SimpleMarker._POLYGON_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.HUMAN] = SimpleMarker._PATH_ELEM;
SimpleMarker._SHAPE_ELEM_MAP[SimpleMarker.STAR] = SimpleMarker._POLYGON_ELEM;

/**
 * Default border radius for rounded rect
 */
SimpleMarker.DEFAULT_BORDER_RADIUS = '6';

/** @const @private **/
SimpleMarker._HUMAN_CMDS =
  'M 306.40625 386.78125 C 304.19988 386.78125 302.40625 389.07579 302.40625 391.90625 ' +
  'C 302.40625 394.73671 304.19988 397.03125 306.40625 397.03125 C 308.61263 397.03125 310.40625 394.73671 310.40625 ' +
  '391.90625 C 310.40625 389.07579 308.61263 386.78125 306.40625 386.78125 z M 301.78125 396.0625 C 300.43025 397.2945 ' +
  '298.28125 400.28125 298.90625 403.15625 C 302.41725 405.79925 309.20225 406.154 314.03125 403 C 314.21825 399.828 ' +
  '312.68325 397.5635 310.90625 396.0625 C 308.65625 400.7185 304.28125 399.7815 301.78125 396.0625 z ';

/** @const @private **/
SimpleMarker._SHAPE_STAR_CMDS = [
  -50, -11.22, -16.69, -17.94, 0, -47.55, 16.69, -17.94, 50, -11.22, 26.69, 13.8, 30.9, 47.56, 0,
  33.42, -30.9, 47.56, -26.69, 13.8
];

/**
 * Object initializer.
 * @param {dvt.Context} context
 * @param {String} shape Marker shape or path commands for a custom shape
 * @param {number} cx  The x position of the center of the marker.
 * @param {number} cy  The y position of the center of the marker.
 * @param {number} width  The width of the marker.
 * @param {number} height  The height of the marker.
 * @param {string=} borderRadius Optional border radius value. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 * @param {boolean=} bMaintainAspectRatio Optional boolean true if keeping aspect ratio. True by default
 * and only applies to built-in non-human shapes
 * @param {boolean=} bUseIntegerCoords Optional specify whether to use integer coords in path
 * @param {String=} id  Optional ID for the shape.
 * @protected
 */
SimpleMarker.prototype.Init = function (
  context,
  shape,
  cx,
  cy,
  width,
  height,
  borderRadius,
  bMaintainAspectRatio,
  bUseIntegerCoords,
  id
) {
  if (bUseIntegerCoords) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    width = Math.round(width);
    height = Math.round(height);

    // Dimensions have to be even to prevent floating numbers when calculating x and y
    height = height % 2 == 1 ? height + 1 : height;
    width = width % 2 == 1 ? width + 1 : width;
  }

  this._bMaintainAspectRatio = true;
  if (bMaintainAspectRatio === false) {
    this._bMaintainAspectRatio = false;
    if (shape == SimpleMarker.CIRCLE) {
      shape = SimpleMarker.ELLIPSE;
    }
  }

  if (borderRadius && borderRadius != '0') {
    this._borderRadius = borderRadius;
  }

  this._shape = shape ? shape : SimpleMarker.RECTANGLE;
  this._dataColor = '#000000';
  var type = shape ? SimpleMarker._SHAPE_ELEM_MAP[shape] : SimpleMarker._PATH_ELEM;

  if (type == null) {
    this._isCustomShape = true;
    this._path = new Path(context, shape);
    type = SimpleMarker._PATH_ELEM;
  }

  SimpleMarker.superclass.Init.call(this, context, type, id);

  if (this._shape == SimpleMarker.SQUARE || this._shape == SimpleMarker.RECTANGLE)
    this._path = this._getBorderRadiusPath(context, cx, cy, width, height, borderRadius);

  if (this._shape == SimpleMarker.HUMAN) this._path = new Path(context, SimpleMarker._HUMAN_CMDS);

  this._propertyChange = {};
  this.setCenter(cx, cy, true).setSize(width, height);
};

/**
 * Sets the dimensions (cx, cy, width, height) of the marker with a Rectangle.
 * x, y values of Rectangle correspond to the marker's center.
 * @param {Rectangle} rect
 *
 * @return {SimpleMarker}
 */
SimpleMarker.prototype.setCenterDimensions = function (rect) {
  return this.setCenter(rect.x, rect.y, true).setSize(rect.w, rect.h);
};

/**
 * Gets the dimensions (cx, cy, width, height) of the marker as a Rectangle.
 * x, y values of Rectangle correspond to the marker's center.
 *
 * @return {Rectangle}
 */
SimpleMarker.prototype.getCenterDimensions = function () {
  return new Rectangle(this._cx, this._cy, this._width, this._height);
};

/**
 * Sets the size of the marker.
 * @param {number} width The width of the marker.
 * @param {number} height The height of the marker.
 * @param {boolean} bDefer Defer SetSvgProperty
 *
 * @return {SimpleMarker}
 */
SimpleMarker.prototype.setSize = function (width, height, bDefer) {
  return this.setWidth(width, true).setHeight(height, bDefer);
};

/**
 * Sets the center coordinates of the marker.
 * @param {number} cx  The x position of the center of the marker.
 * @param {number} cy  The y position of the center of the marker.
 * @param {boolean} bDefer Defer SetSvgProperty
 *
 * @return {SimpleMarker}
 */
SimpleMarker.prototype.setCenter = function (cx, cy, bDefer) {
  return this.setCx(cx, true).setCy(cy, bDefer);
};

/**
 * Updates relevant SVG properties of the marker
 * @return {SimpleMarker}
 * @private
 */
SimpleMarker.prototype._updateSvgProperties = function () {
  if (this._propertyChange.width || this._propertyChange.height) {
    var s = Math.min(this._width, this._height);
    this._propertyChange.s = this._s != s;
    this._s = s;
  }

  if (
    (this._shape == SimpleMarker.RECTANGLE || this._shape == SimpleMarker.SQUARE) &&
    !this._borderRadius
  ) {
    if (
      this._propertyChange.width ||
      this._propertyChange.height ||
      this._propertyChange.cx ||
      this._propertyChange.cy
    ) {
      var cmds = PathUtils.rectangleWithBorderRadius(
        this._cx - this._width / 2,
        this._cy - this._height / 2,
        this._width,
        this._height
      );
      this._setCmds(cmds);
    }
  } else if (this._shape == SimpleMarker.CIRCLE || this._shape == SimpleMarker.ELLIPSE) {
    if (this._propertyChange.cx) ToolkitUtils.setAttrNullNS(this._elem, 'cx', this._cx, 0);
    if (this._propertyChange.cy) ToolkitUtils.setAttrNullNS(this._elem, 'cy', this._cy, 0);

    if (this._shape == SimpleMarker.CIRCLE) {
      if (this._propertyChange.s) ToolkitUtils.setAttrNullNS(this._elem, 'r', this._s / 2, 0);
    } else {
      if (this._propertyChange.width)
        ToolkitUtils.setAttrNullNS(this._elem, 'rx', this._width / 2, 0);
      if (this._propertyChange.height)
        ToolkitUtils.setAttrNullNS(this._elem, 'ry', this._height / 2, 0);
    }
  } else if (this._isPolygon()) {
    if (this._propertyChange.s || this._propertyChange.cx || this._propertyChange.cy)
      this._setPolygon(this._getPolygonArray());
  } else if (this._isPath()) {
    if (
      this._propertyChange.width ||
      this._propertyChange.height ||
      this._propertyChange.cx ||
      this._propertyChange.cy
    )
      this._setCmds(this._getCmds());
  }

  this.UpdateSelectionEffect();
  this._propertyChange = {};
  return this;
};

/**
 * Returns the x coordinate of the center of the marker.
 * @return {number}
 */
SimpleMarker.prototype.getCx = function () {
  return this._cx;
};

/**
 * Specifies the x coordinate of the center of the marker.
 * @param {number} cx
 * @param {boolean} bDefer Defer updating the svg properties
 * @return {SimpleMarker}
 */
SimpleMarker.prototype.setCx = function (cx, bDefer) {
  this._propertyChange.cx = this._cx != cx;
  this._cx = cx;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 * Returns the y coordinate of the center of the marker.
 * @return {number}
 */
SimpleMarker.prototype.getCy = function () {
  return this._cy;
};

/**
 * Specifies the y coordinate of the center of the marker.
 * @param {number} cy
 * @param {boolean} bDefer Defer updating the svg properties
 * @return {SimpleMarker}
 */
SimpleMarker.prototype.setCy = function (cy, bDefer) {
  this._propertyChange.cy = this._cy != cy;
  this._cy = cy;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 *  Returns the size of the marker.
 *  @return {number}
 */
SimpleMarker.prototype.getSize = function () {
  // Note: This currently returns the smaller of the width and height, while the marker field returns the greater of the
  // two. This needs to be reconciled.
  return this._s;
};

/**
 * Returns the width of the marker.
 * @return {number}
 */
SimpleMarker.prototype.getWidth = function () {
  return this._width;
};

/**
 * Specifies the width of the marker.
 * @param {number} width
 * @param {boolean} bDefer Defer updating the svg properties
 * @return {SimpleMarker}
 */
SimpleMarker.prototype.setWidth = function (width, bDefer) {
  this._propertyChange.width = this._width != width;
  this._width = width;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 * Returns the height of the marker.
 * @return {number}
 */
SimpleMarker.prototype.getHeight = function () {
  return this._height;
};

/**
 * Specifies the height of the marker.
 * @param {number} height
 * @param {boolean} bDefer Defer updating the svg properties
 * @return {SimpleMarker}
 */
SimpleMarker.prototype.setHeight = function (height, bDefer) {
  this._propertyChange.height = this._height != height;
  this._height = height;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 * Returns polygon array for given dimensions.
 *
 * @return {array} array of polygon coordinates
 * @private
 */
SimpleMarker.prototype._getPolygonArray = function () {
  var ar = [];

  var cx = this._cx;
  var cy = this._cy;

  var halfx = this.getMaintainAspectRatio() ? this._s / 2 : this._width / 2;
  var halfy = this.getMaintainAspectRatio() ? this._s / 2 : this._height / 2;
  var sixthx = this.getMaintainAspectRatio() ? this._s / 6 : this._width / 6;
  var sixthy = this.getMaintainAspectRatio() ? this._s / 6 : this._height / 6;

  if (this._shape == SimpleMarker.TRIANGLE_UP) {
    ar = [cx - halfx, cy + halfy, cx, cy - halfy, cx + halfx, cy + halfy];
  } else if (this._shape == SimpleMarker.TRIANGLE_DOWN) {
    ar = [cx - halfx, cy - halfy, cx, cy + halfy, cx + halfx, cy - halfy];
  } else if (this._shape == SimpleMarker.DIAMOND) {
    ar = [cx - halfx, cy, cx, cy - halfy, cx + halfx, cy, cx, cy + halfy];
  } else if (this._shape == SimpleMarker.PLUS) {
    ar = [
      cx - halfx,
      cy - sixthy,
      cx - sixthx,
      cy - sixthy,
      cx - sixthx,
      cy - halfy,
      cx + sixthx,
      cy - halfy,
      cx + sixthx,
      cy - sixthy,
      cx + halfx,
      cy - sixthy,
      cx + halfx,
      cy + sixthy,
      cx + sixthx,
      cy + sixthy,
      cx + sixthx,
      cy + halfy,
      cx - sixthx,
      cy + halfy,
      cx - sixthx,
      cy + sixthy,
      cx - halfx,
      cy + sixthy
    ];
  } else if (this._shape == SimpleMarker.STAR) {
    ar = SimpleMarker._SHAPE_STAR_CMDS;

    // Scale and translate from center of (0,0)
    ar = PolygonUtils.scale(
      ar,
      this.getMaintainAspectRatio() ? this._s / 100 : this._width / 100,
      this.getMaintainAspectRatio() ? this._s / 100 : this._height / 100
    );
    ar = PolygonUtils.translate(ar, cx, cy);
  }
  return ar;
};

/**
 * Sets the polygon shape of the marker
 * @param {array} ar
 * @private
 */
SimpleMarker.prototype._setPolygon = function (ar) {
  ToolkitUtils.setAttrNullNS(this._elem, 'points', SvgShapeUtils.convertPointsArray(ar));
};

/**
 * Calculates and returns path commands for given dimensions
 *
 * @return {string} commands
 * @private
 */
SimpleMarker.prototype._getCmds = function () {
  var dim = DisplayableUtils.getDimForced(this.getCtx(), this._path);

  var max = Math.max(dim.w, dim.h);
  var maintain = this.getMaintainAspectRatio();
  if (this._shape == SimpleMarker.RECTANGLE) maintain = false;
  var scalex = maintain ? this._s / max : this._width / dim.w;
  var scaley = maintain ? this._s / max : this._height / dim.h;

  var dx = this._cx - dim.x * scalex - (dim.w * scalex) / 2;
  var dy = this._cy - dim.y * scaley - (dim.h * scaley) / 2;

  return PathUtils.transformPath(this._path.getCommandsArray(), dx, dy, scalex, scaley);
};

/**
 * Sets the path of the marker
 * @param {string} cmds
 * @private
 */
SimpleMarker.prototype._setCmds = function (cmds) {
  ToolkitUtils.setAttrNullNS(this._elem, 'd', cmds);
};

/**
 * Gets the type of the marker
 * @return {string}
 */
SimpleMarker.prototype.getType = function () {
  return this._shape;
};

/**
 * @private
 * @return {boolean}
 */
SimpleMarker.prototype._isPolygon = function () {
  return SimpleMarker._SHAPE_ELEM_MAP[this._shape] == SimpleMarker._POLYGON_ELEM;
};

/**
 * @private
 * @return {boolean}
 */
SimpleMarker.prototype._isPath = function () {
  return (
    SimpleMarker._SHAPE_ELEM_MAP[this._shape] == SimpleMarker._PATH_ELEM || this._isCustomShape
  );
};

/**
 * @protected
 * @return {number} Stroke width
 */
SimpleMarker.prototype.GetStrokeWidth = function () {
  var stroke = this.getStroke();
  if (stroke) {
    return stroke.getWidth();
  }
  return 0;
};

/**
 * @private
 * Gets the path of the marker when a border radius is specified.  Only applies for rectangle and square shapes.
 *
 * @param {dvt.Context} context
 * @param {number} cx  The x position of the center of the marker.
 * @param {number} cy  The y position of the center of the marker.
 * @param {number} width  The width of the marker.
 * @param {number} height  The height of the marker.
 * @param {string=} borderRadius Optional border radius value. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 *
 * @return {Path} marker path with border radius.
 */
SimpleMarker.prototype._getBorderRadiusPath = function (
  context,
  cx,
  cy,
  width,
  height,
  borderRadius
) {
  if (this._shape == SimpleMarker.SQUARE || this._shape == SimpleMarker.RECTANGLE) {
    var s = Math.min(width, height);
    var w = this._shape == SimpleMarker.SQUARE ? s : width;
    var h = this._shape == SimpleMarker.SQUARE ? s : height;
    var x = cx - w / 2;
    var y = cy - h / 2;
    var cmds = PathUtils.rectangleWithBorderRadius(x, y, w, h, borderRadius, s, '0');
    return new Path(context, cmds);
  }
  return null;
};

/**
 * Gets the border radius value of the marker.
 *
 * @return {string} border radius value. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 * @private
 */
SimpleMarker.prototype._getBorderRadius = function () {
  return this._borderRadius;
};

/**
 * Specifies the color of the data item and its selection feedback, if different from the default.
 * @param {string} dataColor The CSS color string of the primary color of the data item.
 * @param {boolean} bSkipStroke True if the hover and selected stroke creation should be skipped.
 */
SimpleMarker.prototype.setDataColor = function (dataColor, bSkipStroke) {
  this._dataColor = dataColor;
  if (!bSkipStroke) {
    var hoverColor = SelectionEffectUtils.getHoverBorderColor(dataColor);
    var innerColor = '#FFFFFF';
    var outerColor = '#5A5A5A';

    this.setHoverStroke(new Stroke(innerColor, 1, 1, true), new Stroke(hoverColor, 1, 3.5, true));
    this.setSelectedStroke(
      new Stroke(innerColor, 1, 1.5, true),
      new Stroke(outerColor, 1, 4.5, true)
    );
    this.setSelectedHoverStroke(
      new Stroke(innerColor, 1, 1.5, true),
      new Stroke(hoverColor, 1, 4.5, true)
    );
  }
};

/**
 * Get the data color used as a base for selection colors.
 * @return {string} data color
 */
SimpleMarker.prototype.getDataColor = function () {
  return this._dataColor;
};

/**
 * Changes the shape to an outline shape format.  Used for legend
 * markers that represent a hidden state for the associated series risers.
 * @param {String} color Border color for hollow shape in format of #aarrggbb
 * @override
 */
SimpleMarker.prototype.setHollow = function (color) {
  //scale the stroke width inversely proportional to the marker scale
  //so that the stroke width appears to be the same for all markers
  //  var scaleX = this.getScaleX();
  //  var scaleY = this.getScaleY();
  //  var scale = Math.min(scaleX, scaleY);
  var strokeWidth = this.GetStrokeWidth();
  strokeWidth = strokeWidth ? strokeWidth : 1; // / scale;

  //save the stroke width so that we can reset it if needed
  SimpleMarker.superclass.setHollow.call(this, color, strokeWidth);
};

/**
 * Adds reference for legend text to marker
 * @param {dvt.Text} text Legend text
 */
SimpleMarker.prototype.setText = function (text) {
  this._markerText = text;
};

/**
 * Adds reference for legend text to marker
 * @param {number} alpha Opacity of object
 * @override
 */
SimpleMarker.prototype.setAlpha = function (alpha) {
  SimpleMarker.superclass.setAlpha.call(this, alpha);

  if (alpha !== this.getAlpha()) {
    if (this._markerText) this._markerText.setAlpha(alpha);
    this.UpdateSelectionEffect();
  }
};

/**
 * @return {SimpleMarker} copy of the marker
 * @override
 */
SimpleMarker.prototype.copyShape = function () {
  return new SimpleMarker(
    this.getCtx(),
    this._shape,
    this.getCx(),
    this.getCy(),
    this.getWidth(),
    this.getHeight(),
    this._getBorderRadius(),
    this.getMaintainAspectRatio()
  );
};

/**
 * @override
 */
SimpleMarker.prototype.getDimensions = function (targetCoordinateSpace) {
  return this.getDimensionsSelf(targetCoordinateSpace);
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
SimpleMarker.prototype.getDimensionsSelf = function (targetCoordinateSpace) {
  var x = this.getCx() - this.getWidth() / 2;
  var y = this.getCy() - this.getHeight() / 2;
  var bounds = new Rectangle(x, y, this.getWidth(), this.getHeight());
  // Calculate the bounds relative to the target space
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

/**
 * @param {boolean} bMaintainAspectRatio True if keeping aspect ratio
 */
SimpleMarker.prototype.setMaintainAspectRatio = function (bMaintainAspectRatio) {
  this._bMaintainAspectRatio = bMaintainAspectRatio;
};

/**
 * @return {boolean} true if keeping aspect ratio
 */
SimpleMarker.prototype.getMaintainAspectRatio = function () {
  return this._bMaintainAspectRatio;
};

/**
 * @param {dvt.Context} context
 * @param {number} cx  The x position of the center of the marker.
 * @param {number} cy  The y position of the center of the marker.
 * @param {number} width  The width of the marker.
 * @param {number} height  The height of the marker.
 * @param {string=} borderRadius Optional border radius of the marker. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 * @param {string=} source Optional image URI for the default state.
 * @param {string=} sourceSelected Optional image URI for the selected state. 'source' used if not passed.
 * @param {string=} sourceHover Optional image URI for the hover state. 'source' used if not passed.
 * @param {string=} sourceHoverSelected Optional image URI for the hover selected state. 'source' used if not passed.
 * @param {string=} id Optional ID for the shape.
 *
 * @extends {dvt.Shape}
 * @constructor
 */
const ImageMarker = function (
  context,
  cx,
  cy,
  width,
  height,
  borderRadius,
  source,
  sourceSelected,
  sourceHover,
  sourceHoverSelected,
  id
) {
  this.Init(
    context,
    cx,
    cy,
    width,
    height,
    borderRadius,
    source,
    sourceSelected,
    sourceHover,
    sourceHoverSelected,
    id
  );
};

Obj.createSubclass(ImageMarker, Shape);
/**
 * Object initializer.
 * @param {dvt.Context} context
 * @param {number} cx  The x position of the center of the marker.
 * @param {number} cy  The y position of the center of the marker.
 * @param {number} width  The width of the marker.
 * @param {number} height  The height of the marker.
 * @param {string=} borderRadius Optional the border radius of the marker. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 * @param {string=} source Optional image URI for the default state.
 * @param {string=} sourceSelected Optional image URI for the selected state. 'source' used if not passed.
 * @param {string=} sourceHover Optional image URI for the hover state. 'source' used if not passed.
 * @param {string=} sourceHoverSelected Optional image URI for the hover selected state. 'source' used if not passed.
 * @param {string=} id Optional ID for the shape.
 * @protected
 */
ImageMarker.prototype.Init = function (
  context,
  cx,
  cy,
  width,
  height,
  borderRadius,
  source,
  sourceSelected,
  sourceHover,
  sourceHoverSelected,
  id
) {
  ImageMarker.superclass.Init.call(this, context, 'image', id);

  this._setMarkerImageStates(source, sourceSelected, sourceHover, sourceHoverSelected);
  var image = this._getImage();
  this._setSource(image);

  this._propertyChange = {};
  this.setCenter(cx, cy, true).setSize(width, height);
  this._updateBorder(borderRadius);

  // IE doesn't allow interactivity unless there's a fill
  if (Agent.browser === 'ie' || Agent.browser === 'edge') {
    ToolkitUtils.setAttrNullNS(this._elem, 'fill', '#FFFFFF');
    ToolkitUtils.setAttrNullNS(this._elem, 'fill-opacity', '0');
  }
};

/**
 * @param {string} preserveAspectRatio String to pass into the preserveAspectRatio attribute for this marker
 */
ImageMarker.prototype.setPreserveAspectRatio = function (preserveAspectRatio) {
  ToolkitUtils.setAttrNullNS(this._elem, 'preserveAspectRatio', preserveAspectRatio, 'xMidYMid');
};

/**
 * Sets the dimensions (cx, cy, width, height) of the marker with a Rectangle.
 * x, y values of Rectangle correspond to the marker's center.
 * @param {Rectangle} rect
 *
 * @return {ImageMarker}
 */
ImageMarker.prototype.setCenterDimensions = function (rect) {
  return this.setCenter(rect.x, rect.y, true).setSize(rect.w, rect.h);
};

/**
 * Gets the dimensions (cx, cy, width, height) of the marker as a Rectangle.
 * x, y values of Rectangle correspond to the marker's center.
 *
 * @return {Rectangle}
 */
ImageMarker.prototype.getCenterDimensions = function () {
  return new Rectangle(this._cx, this._cy, this._width, this._height);
};

/**
 * Sets the size of the marker.
 * @param {number} width The width of the marker.
 * @param {number} height The height of the marker.
 * @param {boolean} bDefer Defer SetSvgProperty
 *
 * @return {ImageMarker}
 */
ImageMarker.prototype.setSize = function (width, height, bDefer) {
  return this.setWidth(width, true).setHeight(height, bDefer);
};

/**
 * Returns the size of the marker.
 *
 * @return {number} The bigger dimension of the width and height
 */
ImageMarker.prototype.getSize = function () {
  return Math.max(this.getWidth(), this.getHeight());
};

/**
 * Sets the center coordinates of the marker.
 * @param {number} cx  The x position of the center of the marker.
 * @param {number} cy  The y position of the center of the marker.
 * @param {boolean} bDefer Defer SetSvgProperty
 *
 * @return {ImageMarker}
 */
ImageMarker.prototype.setCenter = function (cx, cy, bDefer) {
  return this.setCx(cx, true).setCy(cy, bDefer);
};

/**
 * Updates SVG properties of the marker
 * @return {ImageMarker}
 * @private
 */
ImageMarker.prototype._updateSvgProperties = function () {
  if (this._propertyChange.cx || this._propertyChange.width)
    ToolkitUtils.setAttrNullNS(this._elem, 'x', this._cx - this._width / 2, 0);

  if (this._propertyChange.cy || this._propertyChange.height)
    ToolkitUtils.setAttrNullNS(this._elem, 'y', this._cy - this._height / 2, 0);

  if (this._propertyChange.width) ToolkitUtils.setAttrNullNS(this._elem, 'width', this._width, 0);

  if (this._propertyChange.height)
    ToolkitUtils.setAttrNullNS(this._elem, 'height', this._height, 0);

  // redraws border radius clipPath and _borderPath element
  this._updateBorder(this._borderRadius);
  this.UpdateSelectionEffect();
  this._propertyChange = {};
  return this;
};

/**
 * Returns the x coordinate of the center of the marker.
 * @return {number}
 */
ImageMarker.prototype.getCx = function () {
  return this._cx;
};

/**
 * Specifies the x coordinate of the center of the marker.
 * @param {number} cx
 * @param {boolean} bDefer Defer SetSvgProperty
 * @return {ImageMarker}
 */
ImageMarker.prototype.setCx = function (cx, bDefer) {
  this._propertyChange.cx = this._cx != cx;
  this._cx = cx;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 * Returns the y coordinate of the center of the marker.
 * @return {number}
 */
ImageMarker.prototype.getCy = function () {
  return this._cy;
};

/**
 * Specifies the y coordinate of the center of the marker.
 * @param {number} cy
 * @param {boolean} bDefer Defer SetSvgProperty
 * @return {ImageMarker}
 */
ImageMarker.prototype.setCy = function (cy, bDefer) {
  this._propertyChange.cy = this._cy != cy;
  this._cy = cy;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 * Returns the width of the marker.
 * @return {number}
 */
ImageMarker.prototype.getWidth = function () {
  return this._width;
};

/**
 * Specifies the width of the marker.
 * @param {number} width
 * @param {boolean} bDefer Defer SetSvgProperty
 * @return {ImageMarker}
 */
ImageMarker.prototype.setWidth = function (width, bDefer) {
  this._propertyChange.width = this._width != width;
  this._width = width;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 * Returns the height of the marker.
 * @return {number}
 */
ImageMarker.prototype.getHeight = function () {
  return this._height;
};

/**
 * Specifies the height of the marker.
 * @param {number} height
 * @param {boolean} bDefer Defer SetSvgProperty
 * @return {ImageMarker}
 */
ImageMarker.prototype.setHeight = function (height, bDefer) {
  this._propertyChange.height = this._height != height;
  this._height = height;
  return bDefer ? this : this._updateSvgProperties();
};

/**
 * Set the image source
 * @param {String} src Image URI to be set as the source.
 * @private
 */
ImageMarker.prototype._setSource = function (src) {
  ToolkitUtils.setHref(this._elem, ToolkitUtils.getImageUrl(this.getCtx(), src));
};

/**
 * Set the image state array
 * @param {String} source Image URI for the default state.
 * @param {String} sourceSelected Image URI for the selected state.
 * @param {String} sourceHover Image URI for the hover state.
 * @param {String} sourceHoverSelected Image URI for the hover selected state.
 * @private
 */
ImageMarker.prototype._setMarkerImageStates = function (
  source,
  sourceSelected,
  sourceHover,
  sourceHoverSelected
) {
  // at a minimum an image URI will be provided for the active marker state
  var sourceImage = source;
  this._imageStates = [sourceImage];
  this._imageStates.push(sourceSelected ? sourceSelected : sourceImage);
  this._imageStates.push(sourceHover ? sourceHover : sourceImage);
  this._imageStates.push(sourceHoverSelected ? sourceHoverSelected : this._imageStates[1]);
};

/**
 * Get default image state URI
 * @return {string}
 * @private
 */
ImageMarker.prototype._getImage = function () {
  return this._imageStates[0];
};

/**
 * Get selected image state URI
 * @return {string}
 * @private
 */
ImageMarker.prototype._getImageSelected = function () {
  return this._imageStates[1];
};

/**
 * Get hover image state URI
 * @return {string}
 * @private
 */
ImageMarker.prototype._getImageHover = function () {
  return this._imageStates[2];
};

/**
 * Get hover selected image state URI
 * @return {string}
 * @private
 */
ImageMarker.prototype._getImageHoverSelected = function () {
  return this._imageStates[3];
};

/**
 * @override
 */
ImageMarker.prototype.showHoverEffect = function () {
  this.IsShowingHoverEffect = true;
  if (this.isSelected()) this._setSource(this._getImageHoverSelected());
  else this._setSource(this._getImageHover());
};

/**
 * @override
 */
ImageMarker.prototype.hideHoverEffect = function () {
  this.IsShowingHoverEffect = false;
  if (this.isSelected()) this._setSource(this._getImageSelected());
  else this._setSource(this._getImage());
};

/**
 * @override
 */
ImageMarker.prototype.setSelected = function (selected) {
  if (this.IsSelected == selected) return;

  this.IsSelected = selected;
  if (selected) {
    if (this.isHoverEffectShown()) this._setSource(this._getImageHoverSelected());
    else this._setSource(this._getImageSelected());
  } else {
    this._setSource(this._getImage());
  }
};

/**
 * Updates/sets the border radius clip path and border path element of the marker.
 *
 * @param {string} borderRadius Border radius value. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 * @private
 */
ImageMarker.prototype._updateBorder = function (borderRadius) {
  if (borderRadius || this._borderPath) {
    // Set clip path with new commands
    if (borderRadius && borderRadius != '0') {
      var clipCmds = PathUtils.rectangleWithBorderRadius(
        this._cx - this._width / 2,
        this._cy - this._height / 2,
        this._width,
        this._height,
        borderRadius,
        Math.min(this._width, this._height),
        '0'
      );
      var clipPath = new ClipPath();
      clipPath.addPath(clipCmds);
      this.setClipPath(clipPath);
    }

    // Update border path with new commands
    if (this._borderPath) {
      var borderCmds = PathUtils.rectangleWithBorderRadius(
        this._cx - this._width / 2 + this._borderWidth / 2,
        this._cy - this._height / 2 + this._borderWidth / 2,
        this._width - this._borderWidth,
        this._height - this._borderWidth,
        borderRadius,
        Math.min(this._width, this._height),
        '0'
      );
      this._borderPath.setCmds(borderCmds);
    }
  }
  this._borderRadius = borderRadius;
};

/**
 * Gets the border radius value of the image marker.
 *
 * @return {string} border radius value. Example values '5px', '50% 50% 0 0', '5px / 10px', '50% 50% 25% 25% / 25% 25% 50% 50%'
 * @private
 */
ImageMarker.prototype._getBorderRadius = function () {
  return this._borderRadius;
};

/**
 * @override
 */
ImageMarker.prototype.setStroke = function (stroke) {
  if (!stroke || stroke.getWidth() <= 0) {
    this._borderWidth = 0;
    // Clear old border path if no new stroke.
    if (this._borderPath) {
      this.removeChild(this._borderPath);
      this._borderPath = null;
    }
    return;
  }

  var width = stroke.getWidth();
  if (!this._borderPath || width != this._borderWidth) {
    // Calculate border path commands
    var cmds = PathUtils.rectangleWithBorderRadius(
      this._cx - this._width / 2 + width / 2,
      this._cy - this._height / 2 + width / 2,
      this._width - width,
      this._height - width,
      this._borderRadius,
      Math.min(this._width, this._height),
      '0'
    );

    // Create and add _borderPath element
    if (this._borderPath) this._borderPath.setCmds(cmds);
    else {
      this._borderPath = new Path(this.getCtx(), cmds);
      this._borderPath.setInvisibleFill();
      this.addChild(this._borderPath);
    }
  }
  this._borderWidth = width;
  this._borderPath.setStroke(stroke);
};

/**
 * @override
 */
ImageMarker.prototype.setHollow = function (fc, strokeWidth) {
  ImageMarker.superclass.setHollow.call(this, fc, strokeWidth);
  var hollow = this.isHollow();
  if (hollow) {
    this._imageContainer = this._elem.parentNode;
    this._imageContainer.removeChild(this._elem);
  } else if (this._imageContainer) this._imageContainer.appendChild(this._elem);
};

/**
 * @return {ImageMarker} copy of the marker
 * @override
 */
ImageMarker.prototype.copyShape = function () {
  return new ImageMarker(
    this.getCtx(),
    this.getCx(),
    this.getCy(),
    this.getWidth(),
    this.getHeight(),
    this._getBorderRadius(),
    this._getImage(),
    this._getImageSelected(),
    this._getImageHover(),
    this._getImageHoverSelected(),
    null
  );
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
ImageMarker.prototype.getDimensionsSelf = function (targetCoordinateSpace) {
  var x = this.getCx() - this.getWidth() / 2;
  var y = this.getCy() - this.getHeight() / 2;
  var bounds = new Rectangle(x, y, this.getWidth(), this.getHeight());
  // Calculate the bounds relative to the target space
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

/**
 * Abstract base class for polygon displayable that is defined by an array of points.
 * @extends {Shape}
 * @class
 * @constructor
 */
const DvtPolygonalShape = function () {
  // This class should never be instantiated directly
};

Obj.createSubclass(DvtPolygonalShape, Shape);

/**
 * @param {dvt.Context} context
 * @param {string} type The type of SVG element to be created.
 * @param {array} arPoints The array of coordinates for this polygon, in the form [x1,y1,x2,y2...].
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
DvtPolygonalShape.prototype.Init = function (context, type, arPoints, id) {
  DvtPolygonalShape.superclass.Init.call(this, context, type, id);

  if (arPoints) this.setPoints(arPoints);
};

/**
 * Returns the array of coordinates for this shape, in the form [x1,y1,x2,y2...].
 * @return {array}
 */
DvtPolygonalShape.prototype.getPoints = function () {
  return this.GetProperty('arPoints');
};

/**
 * Specifies the array of coordinates for this shape, in the form [x1,y1,x2,y2...].
 * @param {array} arPoints
 * @return {DvtPolygonalShape}
 */
DvtPolygonalShape.prototype.setPoints = function (arPoints) {
  this.SetProperty('arPoints', arPoints);
  return this.SetSvgProperty('points', SvgShapeUtils.convertPointsArray(arPoints));
};

/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {dvt.Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
DvtPolygonalShape.prototype.getDimensionsSelf = function (targetCoordinateSpace) {
  // Note: In the near future, we will not support children for shapes, so this routine will be refactored into the
  //       existing getDimensions calls.  For now, components must be aware of the presence of children to use this.
  var bounds = PolygonUtils.getDimensions(this.getPoints());
  return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
};

/**
 * Polygon displayable.
 * @param {dvt.Context} context
 * @param {array} arPoints The array of coordinates for this polygon, in the form [x1,y1,x2,y2...].
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {DvtPolygonalShape}
 * @class
 * @constructor
 */
const Polygon = function (context, arPoints, id, doNotInit) {
  // Temp soln to prevent super from DvtChartBar to call init when doNotRender is true
  // TODO:: JET-48705: make more permanent fix when Polygon is changed to es6 class
  if (!doNotInit) {
    this.Init(context, arPoints, id);
  }
};

Obj.createSubclass(Polygon, DvtPolygonalShape);

/**
 * @param {dvt.Context} context
 * @param {array} arPoints The array of coordinates for this polygon, in the form [x1,y1,x2,y2...].
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
Polygon.prototype.Init = function (context, arPoints, id) {
  Polygon.superclass.Init.call(this, context, 'polygon', arPoints, id);
};

/**
 * @override
 */
Polygon.prototype.copyShape = function () {
  return new Polygon(this.getCtx(), this.getPoints());
};

/**
 * @override
 */
Polygon.prototype.GetAriaElem = function () {
  if (Agent.isTouchDevice()) this.CreateChildGroupElem(false, true);
  return Polygon.superclass.GetAriaElem.call(this);
};

/**
 * Polyline displayable.
 * @param {dvt.Context} context
 * @param {array} arPoints The array of coordinates for this polyline, in the form [x1,y1,x2,y2...].
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {DvtPolygonalShape}
 * @class
 * @constructor
 */
const Polyline = function (context, arPoints, id) {
  this.Init(context, arPoints, id);
};

Obj.createSubclass(Polyline, DvtPolygonalShape);

/**
 * @param {dvt.Context} context
 * @param {array} arPoints The array of coordinates for this polyline, in the form [x1,y1,x2,y2...].
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
Polyline.prototype.Init = function (context, arPoints, id) {
  Polyline.superclass.Init.call(this, context, 'polyline', arPoints, id);
  ToolkitUtils.setAttrNullNS(this._elem, 'fill', 'none');
};

/**
 * @override
 */
Polyline.prototype.copyShape = function () {
  return new Polyline(this.getCtx(), this.getPoints());
};

/**
 * @override
 */
Polyline.prototype.requiresStrokeAdjustmentForShadow = function () {
  return true;
};

/**
 * Creates an instance of BackgroundOutputText.
 * @extends {Container}
 * @class BackgroundOutputText
 * @constructor
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {CSSStyle} style The CSS style to be applied to the text and background
 * @param {string} id
 */
const BackgroundOutputText = function (context, textStr, x, y, style, id) {
  this.Init(context, textStr, x, y, style, id);
};

Obj.createSubclass(BackgroundOutputText, Container);

/**
 * @const
 * @private
 */
BackgroundOutputText._PADDING = 0.15;
/**
 * @param {dvt.Context} context
 * @param {string} textStr the text string
 * @param {number} x
 * @param {number} y
 * @param {CSSStyle} style The CSS style to be applied to the text and background
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
BackgroundOutputText.prototype.Init = function (context, textStr, x, y, style, id) {
  BackgroundOutputText.superclass.Init.call(this, context, 'g', id);

  this.TextInstance = this.CreateTextInstance(context, textStr, x, y, id);
  this._backgroundRect = null;
  if (style) this.setCSSStyle(style);
  this.addChild(this.TextInstance);
};

/**
 * Returns the text string for this text object.
 * @return {string} the text string
 */
BackgroundOutputText.prototype.getTextString = function () {
  return this.TextInstance.getTextString();
};

/**
 * Specifies the text string for this text object.
 * @param {string} textString the text string
 * @return {BackgroundOutputText}
 */
BackgroundOutputText.prototype.setTextString = function (textString) {
  this.TextInstance.setTextString(textString);
  return this;
};

/**
 * Returns true if this text instance has been truncated.  When truncated, the getUntruncatedTextString function can be
 * used to find the full text String.
 * @return {boolean}
 */
BackgroundOutputText.prototype.isTruncated = function () {
  return this.TextInstance.isTruncated();
};

/**
 * Returns the untruncated text string for this text object.  Returns null if the text string has not been truncated.
 * @return {string} the untruncated text string
 */
BackgroundOutputText.prototype.getUntruncatedTextString = function () {
  return this.TextInstance.getUntruncatedTextString();
};

/**
 * Specifies the untruncated text string for this text object. This should only be set if the OutputText was
 * truncated by dvt.TextUtils.
 * @param {string} textString the untruncated text string
 */
BackgroundOutputText.prototype.setUntruncatedTextString = function (textString) {
  this.TextInstance.setUntruncatedTextString(textString);
};

/**
 * Returns the x position for this text object.
 * @return {number} The x position.
 */
BackgroundOutputText.prototype.getX = function () {
  return this.TextInstance.getX();
};

/**
 * Specifies the x position for this text object.
 * @param {number} x The x position
 * @return {BackgroundOutputText}
 */
BackgroundOutputText.prototype.setX = function (x) {
  this.TextInstance = this.TextInstance.setX(x);
  this._realignBackground();
  return this;
};

/**
 * Returns the y position for this text object.
 * @return {number} The y position.
 */
BackgroundOutputText.prototype.getY = function () {
  return this.TextInstance.getY();
};

/**
 * Specifies the y position for this text object.
 * @param {number} y The y position
 * @return {BackgroundOutputText}
 */
BackgroundOutputText.prototype.setY = function (y) {
  this.TextInstance = this.TextInstance.setY(y);
  this._realignBackground();
  return this;
};

/**
 * Convenience function for specifying the font size. This function will clone the CSSStyle and apply it to the component.
 * @param {string|number} size The font-size which can be in the format 9, '9', '9px', or 'xx-small'
 */
BackgroundOutputText.prototype.setFontSize = function (size) {
  this.TextInstance.setFontSize(size);
  // Also update the local copy of DvtCssStyle
  this._style.setFontSize(CSSStyle.FONT_SIZE, String(size), this.getCtx());
  this._realignBackground();
};

/**
 * Returns the horizontal alignment for this text object.  Valid constants begin with OutputText.H_ALIGN_.
 * @return {string}
 */
BackgroundOutputText.prototype.getHorizAlignment = function () {
  return this.TextInstance.getHorizAlignment();
};

/**
 * Specifies the horizontal alignment for this text object.  Valid constants begin with OutputText.H_ALIGN_.
 * @param {string} align
 */
BackgroundOutputText.prototype.setHorizAlignment = function (align) {
  this.TextInstance.setHorizAlignment(align);
  this._realignBackground();
};

/**
 * Returns the vertical alignment for this text object.  Valid constants begin with OutputText.V_ALIGN_.
 * @return {string} The horizontal alignment
 */
BackgroundOutputText.prototype.getVertAlignment = function () {
  return this.TextInstance.getVertAlignment();
};

/**
 * Specifies the vertical alignment for this text object.  Valid constants begin with OutputText.V_ALIGN_.
 * @param {string} align
 */
BackgroundOutputText.prototype.setVertAlignment = function (align) {
  this.TextInstance.setVertAlignment(align);
  this._realignBackground();
};

/**
 * Aligns the left side of the text to the x coordinate. Note: This does not always correspond to what the browser
 * considers a "start" alignment, as we work around issues in rtl locales to provide a consistent API.
 */
BackgroundOutputText.prototype.alignLeft = function () {
  this.TextInstance.alignLeft();
  this._realignBackground();
};

/**
 * Aligns the center of the text to the x coordinate.
 */
BackgroundOutputText.prototype.alignCenter = function () {
  this.TextInstance.alignCenter();
  this._realignBackground();
};

/**
 * Aligns the right side of the text to the x coordinate. Note: This does not always correspond to what the browser
 * considers an "end" alignment, as we work around issues in rtl locales to provide a consistent API.
 */
BackgroundOutputText.prototype.alignRight = function () {
  this.TextInstance.alignRight();
  this._realignBackground();
};

/**
 * Aligns the top of the text to the y coordinate.
 */
BackgroundOutputText.prototype.alignTop = function () {
  this.TextInstance.alignTop();
  this._realignBackground();
};

/**
 * Aligns the middle of the text to the y coordinate.
 */
BackgroundOutputText.prototype.alignMiddle = function () {
  this.TextInstance.alignMiddle();
  this._realignBackground();
};

/**
 * Aligns the bottom of the text to the y coordinate.
 */
BackgroundOutputText.prototype.alignBottom = function () {
  this.TextInstance.alignBottom();
  this._realignBackground();
};

/**
 * Aligns the bottom of the text to the y coordinate.
 */
BackgroundOutputText.prototype.alignAuto = function () {
  this.TextInstance.alignAuto();
  this._realignBackground();
};

/**
 * Sets the CSSStyle of this object.
 * @param {CSSStyle} style The CSSStyle of this object.
 * @override
 */
BackgroundOutputText.prototype.setCSSStyle = function (style) {
  // support automatic text color for text with backgrounds
  if (style.getStyle(CSSStyle.BACKGROUND_COLOR) && !style.getStyle(CSSStyle.COLOR))
    style.setStyle(
      CSSStyle.COLOR,
      ColorUtils.getContrastingTextColor(style.getStyle(CSSStyle.BACKGROUND_COLOR))
    );

  if (this.TextInstance) this.TextInstance.setCSSStyle(style);

  if (this._backgroundRect || BackgroundOutputText._hasBackgroundStyles(style)) {
    if (!this._backgroundRect) {
      this._backgroundRect = this.CreateBackground(this.getCtx(), this.TextInstance);
      this.addChildAt(this._backgroundRect, 0);
    }
    this._setBackgroundCSSStyle(this._backgroundRect, style);
  }

  this._style = style;
};

/**
 * Returns the CSSStyle of this object.
 * @return {CSSStyle} the CSSStyle of this object.
 * @override
 */
BackgroundOutputText.prototype.getCSSStyle = function () {
  return this._style;
};

/**
 *  @override
 */
BackgroundOutputText.prototype.setMatrix = function (mat) {
  this.TextInstance.setMatrix(mat);

  if (this._backgroundRect) this._backgroundRect.setMatrix(mat);
};

/**
 *  @override
 */
BackgroundOutputText.prototype.getMatrix = function () {
  return this.TextInstance.getMatrix();
};

/**
 * Returns the bounds of the output text relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {Rectangle} The bounds of the output text relative to the target coordinate space.
 */
BackgroundOutputText.prototype.getTextDimensions = function (targetCoordinateSpace) {
  return this.TextInstance.getDimensions(targetCoordinateSpace);
};

/**
 * @override
 */
BackgroundOutputText.prototype.getDimensions = function (targetCoordinateSpace) {
  // include the bounds of the rectangle background for the dimensions
  var dims = this.TextInstance.getDimensions();
  var padding = dims.h * BackgroundOutputText._PADDING;
  dims.x -= padding;
  dims.w += 2 * padding;
  return this.ConvertCoordSpaceRect(dims, targetCoordinateSpace);
};

/**
 * @override
 */
BackgroundOutputText.prototype.getDimensionsWithStroke = function () {
  // we want this to behave like a shape as opposed to a container
  // get the dims for this shape by itself
  return this.GetElemDimensionsWithStroke();
};

/**
 * @override
 */
BackgroundOutputText.prototype.GetDimensionsWithStroke = function (targetCoordinateSpace) {
  // we want this to behave like a shape as opposed to a container
  //get the dims for this shape by itself
  var dims = this.GetElemDimensionsWithStroke();
  if (!targetCoordinateSpace || targetCoordinateSpace === this) return dims;
  else {
    // Calculate the bounds relative to the target space
    return this.ConvertCoordSpaceRect(dims, targetCoordinateSpace);
  }
};

/**
 * @override
 */
BackgroundOutputText.prototype.GetElemDimensionsWithStroke = function () {
  // we want this to behave like a shape as opposed to a container
  // get the dims for this shape by itself
  var dims = this.getDimensions();

  var elementWithStroke = this._backgroundRect ? this._backgroundRect : this.TextInstance;
  var stroke = elementWithStroke.getStroke();
  if (dims && stroke) {
    var sw = stroke.getWidth();
    if (sw) {
      var halfSw = 0.5 * sw;
      dims.x -= halfSw;
      dims.y -= halfSw;
      dims.w += sw;
      dims.h += sw;
    }
  }
  return dims;
};

/**
 * @override
 */
BackgroundOutputText.prototype.copyShape = function () {
  return this.TextInstance.copyShape();
};

/**
 * Creates and returns the text object for the BackgroundOutputText object
 * @param {dvt.Context} context
 * @param {string} textStr the text string
 * @param {number} x
 * @param {number} y
 * @param {string=} id The optional id for the corresponding DOM element.
 * @return {dvt.Displayable}
 * @protected
 */
BackgroundOutputText.prototype.CreateTextInstance = function (context, textStr, x, y, id) {
  return new OutputText(context, textStr, x, y, id);
};

/**
 * Returns an object with the background styles of the output text applied
 * @param {dvt.Context} context
 * @param {OutputText} text The output text.
 * @return {Rect} The object to be rendered behind the text.
 * @protected
 */
BackgroundOutputText.prototype.CreateBackground = function (context, text) {
  var bboxDims = text.getDimensions();
  var padding = bboxDims.h * BackgroundOutputText._PADDING;
  return new Rect(context, bboxDims.x - padding, bboxDims.y, bboxDims.w + 2 * padding, bboxDims.h);
};

/**
 * Realigns the background rect with the text
 * @private
 */
BackgroundOutputText.prototype._realignBackground = function () {
  if (!this._backgroundRect) return;

  var bboxDims = this.TextInstance.getDimensions();
  var padding = bboxDims.h * 0.15;

  var hAlign = this.getHorizAlignment();
  var vAlign = this.getVertAlignment();

  // Align x-Coordinate
  if (hAlign == OutputText.H_ALIGN_LEFT) this._backgroundRect.setX(this.getX() - padding);
  else if (hAlign == OutputText.H_ALIGN_CENTER)
    this._backgroundRect.setX(this.getX() - bboxDims.w * 0.5 - padding);
  else if (hAlign == OutputText.H_ALIGN_RIGHT)
    this._backgroundRect.setX(this.getX() - bboxDims.w - padding);

  // Align y-Coordinate
  var fontSize = parseFloat(this._style.getFontSize());
  if (isNaN(fontSize)) fontSize = 0;
  var yAdjustment = 0; // fudge factor for specific alignments in certain browsers

  if (Agent.engine === 'blink' && vAlign == OutputText.V_ALIGN_MIDDLE)
    yAdjustment = fontSize * 0.12;
  // Chrome, vALign = middle, rect must be shifted up a bit
  else if (
    (Agent.browser === 'ie' || Agent.browser === 'edge') &&
    vAlign == OutputText.V_ALIGN_BOTTOM
  )
    yAdjustment = -fontSize * 0.4; // IE, vAlign = bottom, rect must be shifted down a bit

  var deltaH = this.GetTextDimensionsForRealign(bboxDims);
  if (vAlign == OutputText.V_ALIGN_TOP) this._backgroundRect.setY(this.getY());
  else if (vAlign == OutputText.V_ALIGN_MIDDLE)
    this._backgroundRect.setY(this.getY() - deltaH * 0.5 - yAdjustment);
  else if (vAlign == OutputText.V_ALIGN_CENTRAL)
    this._backgroundRect.setY(this.getY() - deltaH * 0.5);
  else if (vAlign == OutputText.V_ALIGN_BOTTOM)
    this._backgroundRect.setY(this.getY() - deltaH - yAdjustment);
  else if (vAlign == OutputText.V_ALIGN_AUTO) this._backgroundRect.setY(bboxDims.y);

  // width may need to be reset (rotated labels ended up extra long)
  this._backgroundRect.setWidth(bboxDims.w + 2 * padding);
  this._backgroundRect.setHeight(bboxDims.h);
};

/**
 * Sets the CSSStyle of the given background rect.
 * @param {Rect} rect The background Rect
 * @param {CSSStyle} style The CSSStyle of this object.
 * @private
 */
BackgroundOutputText.prototype._setBackgroundCSSStyle = function (rect, style) {
  if (style) {
    var bgColor = style.getStyle(CSSStyle.BACKGROUND_COLOR);
    if (bgColor != null) rect.setSolidFill(bgColor);
    else rect.setInvisibleFill();

    var borderColor = style.getStyle(CSSStyle.BORDER_COLOR);
    var borderWidth = style.getStyle(CSSStyle.BORDER_WIDTH);
    var borderRadius = style.getStyle(CSSStyle.BORDER_RADIUS);
    if (borderColor || borderWidth || borderRadius) {
      var bgStyle = new CSSStyle();
      bgStyle.setStyle(CSSStyle.BORDER_COLOR, borderColor);
      bgStyle.setStyle(CSSStyle.BORDER_WIDTH, borderWidth);
      bgStyle.setStyle(CSSStyle.BORDER_RADIUS, borderRadius);
      rect.setCSSStyle(bgStyle);
    }
  } else {
    rect.setInvisibleFill();
  }

  rect.setMouseEnabled(false);
};

/**
 * Returns the change in height needed to realign the background rect after the text instance is realigned
 * @param {Object=} dims
 * @return {number}
 * @protected
 */
BackgroundOutputText.prototype.GetTextDimensionsForRealign = function (dims) {
  return dims.h;
};

/**
 * returns true if style has any of the background styles
 * set by BackgroundOutputText.prototype._setBackgroundCSSStyle
 * @private
 * @param {CSSStyle} style the styles of the background text
 * @return {boolean} true if style has any of the background styles
 */
BackgroundOutputText._hasBackgroundStyles = function (style) {
  if (!style) return false;

  return style.hasBackgroundStyles();
};

/**
 *  @override
 */
BackgroundOutputText.prototype.includeChildSubtree = function () {
  return false;
};

BackgroundOutputText.prototype.isMultiline = function () {
  return false;
};

BackgroundOutputText.prototype.hasBackground = function () {
  return true;
};

/**
 * Read-only text object that supports wrapping.
 * @extends {dvt.Container}
 * @class BackgroundMultilineText
 * @extends {BackgroundOutputText}
 * @constructor
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {dvt.CSSStyle} style
 * @param {string=} id
 * @param {boolean=} preserveNewLine If true, text will wrap only on new line characters
 */
const BackgroundMultilineText = function (context, textStr, x, y, style, id, preserveNewLine) {
  this.Init(context, textStr, x, y, style, id, preserveNewLine);
};

Obj.createSubclass(BackgroundMultilineText, BackgroundOutputText);

/**
 * @param {dvt.Context} context
 * @param {string} textStr the text string
 * @param {number} x
 * @param {number} y
 * @param {dvt.CSSStyle} style
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
BackgroundMultilineText.prototype.Init = function (
  context,
  textStr,
  x,
  y,
  style,
  id,
  preserveNewLine
) {
  this._preserveNewLine = preserveNewLine ? preserveNewLine : false;

  BackgroundMultilineText.superclass.Init.call(this, context, textStr, x, y, style, id);
};

/**
 * Wraps the text instance for this object.
 * @param {number} maxWidth The maximum width of the text.
 * @param {number} maxHeight The maximum height of the text.
 * @param {number} minChars The minimum number of characters that should be displayed before ellipsis after truncation.
 * @param {boolean=} breakOnTruncation Optional boolean to return unwrapped text if text does not fully fit in given dimensions
 * @return {boolean} false if the text cannot fit in the parameters, true otherwise.
 */
BackgroundMultilineText.prototype.wrapText = function (
  maxWidth,
  maxHeight,
  minChars,
  breakOnTruncation
) {
  return this.TextInstance.wrapText(maxWidth, maxHeight, minChars, breakOnTruncation);
};

/**
 * @override
 */
BackgroundMultilineText.prototype.CreateTextInstance = function (context, textStr, x, y, id) {
  return new MultilineText(context, textStr, x, y, id, this._preserveNewLine);
};

/**
 * @override
 */
BackgroundMultilineText.prototype.GetTextDimensionsForRealign = function () {
  return this.getLineHeight();
};

/**
 * @override
 */
BackgroundMultilineText.prototype.getDimensions = function (targetCoordinateSpace) {
  var dims = this.TextInstance.getDimensions();
  var padding = (dims.h * BackgroundOutputText._PADDING) / this.getLineCount();
  dims.x -= padding;
  dims.w += 2 * padding;
  return this.ConvertCoordSpaceRect(dims, targetCoordinateSpace);
};

//// Functions added so that BackgroundMultilineText can be used in the same instances as MultilineText
/**
 * Truncates the text instance to fit within the given width.  Sets the untruncated text string on itself if
 * truncated text does not fit.  Only for use by dvt.TextUtils.
 * @param {number} maxWidth The maximum width of the text.
 * @param {number} maxHeight The maximum height of the text.
 * @param {number} minChars The minimum number of characters that should be displayed before ellipsis after truncation.
 * @return {boolean} false if the text cannot fit at all, true otherwise.
 */
BackgroundMultilineText.prototype.__fitText = function (maxWidth, maxHeight, minChars) {
  return this.TextInstance.__fitText(maxWidth, maxHeight, minChars);
};

/**
 * Returns an array with pointers to all the lines in this BackgroundMultilineText object
 * @return {Array} the lines in this object.
 * @private
 */
BackgroundMultilineText.prototype._getTextLines = function () {
  return this.TextInstance._getTextLines();
};

/**
 * Returns the line height
 * @return {number}
 */
BackgroundMultilineText.prototype.getLineHeight = function () {
  return this.TextInstance.getLineHeight();
};

/**
 * Returns the number of lines for the text
 * @return {number}
 */
BackgroundMultilineText.prototype.getLineCount = function () {
  return this.TextInstance.getLineCount();
};

/** Returns the y position used for vertical alignment
 *  @return {number} The y position.
 */
BackgroundMultilineText.prototype.getYAlignCoord = function () {
  return this.TextInstance.getYAlignCoord();
};

/**
 * Enables or disables attempting to wrap during text fitting
 * @param {boolean} wrapEnabled
 */
BackgroundMultilineText.prototype.setWrapEnabled = function (wrapEnabled) {
  this.TextInstance.setWrapEnabled(wrapEnabled);
};

/**
 * Returns whether or not text will attempt to wrap during fitting
 * @return {boolean}
 */
BackgroundMultilineText.prototype.isWrapEnabled = function () {
  return this.TextInstance.isWrapEnabled();
};

/**
 * @override
 */
BackgroundMultilineText.prototype.UpdateSelectionEffect = function () {
  // noop: Does not participate in selection effects
};

BackgroundMultilineText.prototype.isMultiline = function () {
  return true;
};

/**
 * Base class for JSON component defaults.
 * @param {object} defaultsMap A map of the skin names to the JSON of defaults.
 * @param {dvt.Context} context The rendering context.
 * @class
 * @constructor
 * @extends {dvt.Obj}
 */
const BaseComponentDefaults = function (defaultsMap, context) {
  this.Init(defaultsMap, context);
};

Obj.createSubclass(BaseComponentDefaults, Obj);

/** @const **/
BaseComponentDefaults.FONT_SIZE = 'font-size: ';

/** @const **/
BaseComponentDefaults.FONT_SIZE_11 = BaseComponentDefaults.FONT_SIZE + '11px;';

/** @const **/
BaseComponentDefaults.FONT_SIZE_12 = BaseComponentDefaults.FONT_SIZE + '12px;';

/** @const **/
BaseComponentDefaults.FONT_SIZE_13 = BaseComponentDefaults.FONT_SIZE + '13px;';

/** @const **/
BaseComponentDefaults.FONT_SIZE_14 = BaseComponentDefaults.FONT_SIZE + '14px;';

/** @const **/
BaseComponentDefaults.FONT_WEIGHT_BOLD = 'font-weight: bold;';

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA =
  "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;";

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_11 =
  BaseComponentDefaults.FONT_FAMILY_ALTA + BaseComponentDefaults.FONT_SIZE_11;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_12 =
  BaseComponentDefaults.FONT_FAMILY_ALTA + BaseComponentDefaults.FONT_SIZE_12;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_13 =
  BaseComponentDefaults.FONT_FAMILY_ALTA + BaseComponentDefaults.FONT_SIZE_13;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_14 =
  BaseComponentDefaults.FONT_FAMILY_ALTA + BaseComponentDefaults.FONT_SIZE_14;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD =
  BaseComponentDefaults.FONT_FAMILY_ALTA + BaseComponentDefaults.FONT_WEIGHT_BOLD;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_11 =
  BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD + BaseComponentDefaults.FONT_SIZE_11;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 =
  BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD + BaseComponentDefaults.FONT_SIZE_12;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_13 =
  BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD + BaseComponentDefaults.FONT_SIZE_13;

/** @const **/
BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_14 =
  BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD + BaseComponentDefaults.FONT_SIZE_14;

/**
 * Defines the progression of skin names.
 * @const
 * @private
 */
BaseComponentDefaults._SKINS = [CSSStyle.SKIN_ALTA];

/**
 * @param {object} defaultsMap A map of the skin names to the JSON of defaults.
 * @param {dvt.Context} context The rendering context.
 */
BaseComponentDefaults.prototype.Init = function (defaultsMap, context) {
  this._defaults = defaultsMap ? defaultsMap : {};
  this._context = context;

  // Initialize the defaults cache on the class if it doesn't already exist. This is used to prevent excess cloning and
  // merging of the defaults layers.
  if (!this.constructor.defaultsCache) this.constructor.defaultsCache = {};
};

/**
 * Returns the base skin name for this component
 * @return {String} The base skin name for this component
 */
BaseComponentDefaults.prototype.getBaseSkinName = function () {
  return CSSStyle.SKIN_ALTA;
};

/**
 * Combines the user options with the defaults for the specified version.  Returns the combined options object.  This
 * object will contain internal attribute values and should be accessed in internal code only.
 * @param {object} userOptions The object containing options specifications for this component.
 * @return {object} The combined options object.
 */
BaseComponentDefaults.prototype.calcOptions = function (userOptions) {
  var skin = userOptions ? userOptions['skin'] : null;
  var defaults = this.getDefaults(skin);

  // Use defaults if no overrides specified
  if (!userOptions) return defaults;

  // Get component noclone options and add data provider properties
  var noClone = this.getNoCloneObject();
  if (this._context && this._context.dataProviderProps) {
    var dpProps = this._context.dataProviderProps;
    for (var i = 0; i < dpProps.length; i++) {
      noClone[dpProps[i]] = true;
    }
  }
  // Merge the options object with the defaults
  var options = JsonUtils.merge(userOptions, defaults, noClone);

  //  - short circuit animation if animation duration is 0
  if (this.getAnimationDuration(options) == 0) {
    options['animationOnDataChange'] = 'none';
    options['animationOnDisplay'] = 'none';
  }

  return options;
};

/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 */
BaseComponentDefaults.prototype.getDefaults = function (skin) {
  if (!skin) skin = this.getBaseSkinName();

  // Return the cached defaults if available.
  if (this.constructor.defaultsCache[skin])
    return JsonUtils.clone(this.constructor.defaultsCache[skin]);
  else {
    // Note: Subsequent default objects are deltas on top of previous objects
    var skinIndex = Math.max(BaseComponentDefaults._SKINS.indexOf(skin), 0);
    var ret = JsonUtils.clone(this._defaults[BaseComponentDefaults._SKINS[0]]);
    for (var i = 1; i <= skinIndex; i++) {
      ret = JsonUtils.merge(this._defaults[BaseComponentDefaults._SKINS[i]], ret);
    }

    // Add to the cache and return. We need to clone to ensure the cached copy isn't changed.
    this.constructor.defaultsCache[skin] = JsonUtils.clone(ret);
    return ret;
  }
};

/**
 * Returns the object of keys not to be cloned.
 * @return {object} The object of keys not to be cloned
 */
BaseComponentDefaults.prototype.getNoCloneObject = function () {
  return {};
};

/**
 * Returns the animation duration from the options given.
 * @param {object} options The options from which to get the animation duration.
 * @return {number} The animation duration.
 */
BaseComponentDefaults.prototype.getAnimationDuration = function (options) {
  return options['styleDefaults'] && options['styleDefaults']['animationDuration']
    ? options['styleDefaults']['animationDuration']
    : options['animationDuration']
    ? options['animationDuration']
    : null;
};

/**
 * A minimalist scrollbar.
 * @class
 * @constructor
 * @extends {Container}
 * @param {dvt.Context} context
 * @param {function=} callback The callback function
 * @param {object=} callbackObj The object that the callback function belongs to
 * @param {dvt.Displayable=} dragTarget The displayable to use for listening to drag events
 */
const SimpleScrollbar = function (context, callback, callbackObj, dragTarget) {
  SimpleScrollbar.superclass.Init.call(this, context);
  this._callback = callback;
  this._callbackObj = callbackObj;
  this._dragTarget = dragTarget;
};

Obj.createSubclass(SimpleScrollbar, Container);

/** @private */
SimpleScrollbar._THUMB_MIN_SIZE = 12;

/**
 * Renders the simple scrollbar at the specified size.
 * @param {object} options The object containing specifications for the scrollbar.
 * @param {number} width The width of the scrollbar.
 * @param {number} height The height of the scrollbar.
 */
SimpleScrollbar.prototype.render = function (options, width, height) {
  this._width = width;
  this._height = height;

  // Global min/max
  this._globalMin = options['min'];
  this._globalMax = options['max'];

  this._isHoriz = options['isHorizontal'];
  this._isReversed = options['isReversed'];

  // Create background
  var background = new Rect(this.getCtx(), 0, 0, width, height);
  background.setSolidFill(options['backgroundColor']);
  background.setPixelHinting(true);
  this.addChild(background);

  // Create thumb
  this._thumb = new Rect(this.getCtx(), 0, 0, width, height);
  this._thumb.setSolidFill(options['color']);
  this._thumb.setPixelHinting(true);
  this.addChild(this._thumb);

  this._thumbMin = this._globalMin;
  this._thumbMax = this._globalMax;

  // The renderedThumbMin/Max can be wider than the actual thumbMin/Max if the viewport range is very small
  this._renderedThumbMin = this._thumbMin;
  this._renderedThumbMax = this._thumbMax;

  // Add hit area to make interaction with scrollbar easier
  var hitAreaSize = Agent.isTouchDevice() ? 8 : 4;
  var hitArea = new Rect(
    this.getCtx(),
    -hitAreaSize,
    -hitAreaSize,
    this._width + 2 * hitAreaSize,
    this._height + 2 * hitAreaSize
  );
  hitArea.setInvisibleFill();
  this.addChild(hitArea);

  // Add event listeners
  var hasDragTarget = this._dragTarget != null;
  SvgDocumentUtils.addDragListeners(
    hasDragTarget ? this._dragTarget : this,
    this._onDragStart,
    this._onDragMove,
    this._onDragEnd,
    this,
    !hasDragTarget
  );
  if (!Agent.isTouchDevice() && !hasDragTarget) {
    this.addEvtListener(MouseEvent.CLICK, this._onClick, false, this);
  }

  this._dragged = false; // flag to indicate mouse/touch down
};

/**
 * Sets the range of the scrollbar thumb.
 * @param {number} min The min value of the range.
 * @param {number} max The max value of the range.
 * @param {number=} globalMin The global min value of the scrollbar.
 * @param {number=} globalMax The global max value of the scrollbar.
 */
SimpleScrollbar.prototype.setViewportRange = function (min, max, globalMin, globalMax) {
  if (globalMin != null) this._globalMin = globalMin;
  if (globalMax != null) this._globalMax = globalMax;

  // Store the actual min/max before minRange adjustments
  this._thumbMin = min;
  this._thumbMax = max;

  // For usability, make sure that the thumb is not shorter than the minimum number of pixels
  var range = max - min;
  var globalRange = this._globalMax - this._globalMin;
  var minRange = Math.min(
    (SimpleScrollbar._THUMB_MIN_SIZE / (this._isHoriz ? this._width : this._height)) * globalRange,
    globalRange
  );

  if (range < minRange) {
    max += (minRange - range) / 2;
    min -= (minRange - range) / 2;

    if (min < this._globalMin) {
      min = this._globalMin;
      max = this._globalMin + minRange;
    }
    if (max > this._globalMax) {
      max = this._globalMax;
      min = this._globalMax - minRange;
    }
  }

  this._renderedThumbMin = min;
  this._renderedThumbMax = max;

  // Get the coords and modify the thumb
  var minCoord = this._getCoord(min);
  var maxCoord = this._getCoord(max);

  if (this._isHoriz) {
    this._thumb.setX(Math.min(minCoord, maxCoord));
    this._thumb.setWidth(Math.abs(maxCoord - minCoord));
  } else {
    this._thumb.setY(Math.min(minCoord, maxCoord));
    this._thumb.setHeight(Math.abs(maxCoord - minCoord));
  }
};

/**
 * Gets the coordinate of a value.
 * @param {number} value
 * @return {number} coord
 * @private
 */
SimpleScrollbar.prototype._getCoord = function (value) {
  var ratio = (value - this._globalMin) / (this._globalMax - this._globalMin);
  if (this._isReversed) ratio = 1 - ratio;

  if (this._isHoriz) return ratio * this._width;
  else return ratio * this._height;
};

/**
 * Gets the value from a coord.
 * @param {number} pageX
 * @param {number} pageY
 * @return {number} value
 * @private
 */
SimpleScrollbar.prototype._getValue = function (pageX, pageY) {
  var coord = this.stageToLocal(this.getCtx().pageToStageCoords(pageX, pageY));
  var ratio = this._isHoriz ? coord.x / this._width : coord.y / this._height;
  if (this._isReversed) ratio = 1 - ratio;
  ratio = Math.min(Math.max(ratio, 0), 1); // bound the value within min/max
  return this._globalMin + ratio * (this._globalMax - this._globalMin);
};

/**
 * Handles click event.
 * @param {object} event
 * @private
 */
SimpleScrollbar.prototype._onClick = function (event) {
  var val = this._getValue(event.pageX, event.pageY);
  if (val >= this._renderedThumbMin && val <= this._renderedThumbMax) return;

  var range = this._thumbMax - this._thumbMin;
  this._setViewportRange(val - range / 2, val + range / 2, 'end');
};

/**
 * Handles drag start.
 * @param {object} event
 * @return {boolean} True if the drag is initiated.
 * @private
 */
SimpleScrollbar.prototype._onDragStart = function (event) {
  var val;
  if (event.touches) {
    if (event.touches.length != 1) return false;
    val = this._getValue(event.touches[0].pageX, event.touches[0].pageY);
  } else val = this._getValue(event.pageX, event.pageY);

  // Bypass thumb checking logic if we're scrolling on an outer container
  if (this._dragTarget || (val >= this._renderedThumbMin && val <= this._renderedThumbMax)) {
    // If the rendered thumb is bigger than the actual range, we still need to bound the val to the actual range,
    // otherwise the scrollbar won't drag all the way to the edges of the chart.
    this._prevVal = Math.min(Math.max(val, this._thumbMin), this._thumbMax);
    this._dragged = true;
    return true;
  }
  return false;
};

/**
 * Handles drag move.
 * @param {object} event
 * @private
 */
SimpleScrollbar.prototype._onDragMove = function (event) {
  if (!this._dragged) return;

  var val;
  if (event.touches) {
    if (event.touches.length != 1) return;
    val = this._getValue(event.touches[0].pageX, event.touches[0].pageY);
  } else val = this._getValue(event.pageX, event.pageY);

  var dragOffset = val - this._prevVal;
  // If the drag target is not the scrollbar, the thumb should move in the opposite direction as the drag target
  if (this._dragTarget) dragOffset *= -1;

  this._setViewportRange(this._thumbMin + dragOffset, this._thumbMax + dragOffset, 'move');
  this._prevVal = val;

  event.preventDefault(); // prevent scrolling the page
};

/**
 * Handles drag end.
 * @param {object} event
 * @private
 */
SimpleScrollbar.prototype._onDragEnd = function (event) {
  if (!this._dragged) return;

  if (event.touches) this._setViewportRange(this._thumbMin, this._thumbMax, 'end');
  else {
    var val = this._getValue(event.pageX, event.pageY);
    var dragOffset = val - this._prevVal;
    this._setViewportRange(this._thumbMin + dragOffset, this._thumbMax + dragOffset, 'end');
  }

  this._dragged = false;
};

/**
 * Sets the range of the scrollbar thumb and fires an overview event.
 * @param {number} min The min value of the range.
 * @param {number} max The max value of the range.
 * @param {string} eventSubtype The subtype of the simple scrollbar event.
 * @private
 */
SimpleScrollbar.prototype._setViewportRange = function (min, max, eventSubtype) {
  // Adjust min/max so that they are within globalMin/Max
  var range = max - min;
  if (min < this._globalMin) {
    min = this._globalMin;
    max = this._globalMin + range;
  }
  if (max > this._globalMax) {
    max = this._globalMax;
    min = this._globalMax - range;
  }

  this.setViewportRange(min, max);

  // Fire event
  if (this._callback) {
    var evt = EventFactory.newSimpleScrollbarEvent(eventSubtype, min, max);
    this._callback.call(this._callbackObj, evt, this);
  }
};

/**
 * A minimalist scrollable container that can scroll either vertically or horizontally, but not both.
 * Use DvtScrollableContainer if scrolling in both directions is required.
 * @class
 * @constructor
 * @extends {Container}
 * @param {dvt.Context} context
 * @param {number} width The width of the scrollable container
 * @param {number} height The height of the scrollable container
 * @param {string} visibleScrolling String to define whether scrolling is enabled. Set to 'always' in redwood. Valid values are 'asNeeded', 'off' and 'always'
 * @param {boolean} isHorizontalScrolling True if this container scrolls horizontally
 */
const SimpleScrollableContainer = function (
  context,
  width,
  height,
  visibleScrolling,
  isHorizontalScrolling
) {
  SimpleScrollableContainer.superclass.Init.call(this, context);
  this._contentSize = isHorizontalScrolling ? width : height;
  this._width = width;
  this._height = height;

  this._background = new Rect(context, 0, 0, width, height);
  this._background.setInvisibleFill();
  this.addChild(this._background);

  this._container = new Container(context);
  this.addChild(this._container);

  this._isHorizontalScrolling = isHorizontalScrolling;
  this._isScrollbarVisible = false;
  // sets scrolling to be 'asNeeded'|'always'
  this.scrolling = visibleScrolling;

  if (!Agent.isTouchDevice()) {
    this.addEvtListener(MouseEvent.MOUSEWHEEL, this._onMouseWheel, false, this);
  }
};

Obj.createSubclass(SimpleScrollableContainer, Container);

/** @private */
SimpleScrollableContainer._SCROLLBAR_WIDTH = 3;
/** @private */
SimpleScrollableContainer._SCROLLBAR_GAP = 2;

/**
 * Returns the scrolling pane of this container
 * @return {Container}
 */
SimpleScrollableContainer.prototype.getScrollingPane = function () {
  return this._container;
};

/**
 * Prepares the content pane for  For performance, this component defers scrollbar rendering until this value is set
 * by the owning component.
 */
SimpleScrollableContainer.prototype.prepareContentPane = function () {
  var size = this._container.getDimensions();
  if (this._isHorizontalScrolling) this._contentSize = size.w + size.x;
  else this._contentSize = size.h + size.y;

  // TODO
  // - Support customization of scrollbar color, width, etc.

  if (this.hasScrollingContent()) {
    // add padding to bottom to match top when scrolling
    if (this._isHorizontalScrolling) this._contentSize += size.x;
    else this._contentSize += size.y;

    // create masks and scrollbars
    if (!this._maskContainer) {
      var dims = new Rectangle(0, 0, this._width, this._height);
      this._fadeTop = new Mask(
        new LinearGradientFill(
          this._isHorizontalScrolling ? 0 : 270,
          ['#FFFFFF', '#FFFFFF'],
          [0, 1],
          [0, 0.1]
        ),
        dims
      );
      this._fadeBottom = new Mask(
        new LinearGradientFill(
          this._isHorizontalScrolling ? 180 : 90,
          ['#FFFFFF', '#FFFFFF'],
          [0, 1],
          [0, 0.1]
        ),
        dims
      );
      this._fadeTopBottom = new Mask(
        new LinearGradientFill(
          this._isHorizontalScrolling ? 180 : 90,
          ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
          [0, 1, 1, 0],
          [0, 0.1, 0.9, 1]
        ),
        dims
      );

      this._maskContainer = new Container(this.getCtx());
      this.addChild(this._maskContainer);
      var clipPath = new ClipPath();
      clipPath.addRect(0, 0, this._width, this._height);
      this._container.setClipPath(clipPath);
      this._maskContainer.addChild(this._container);

      this._scrollbar = new SimpleScrollbar(this.getCtx(), this._handleScrollbar, this, this);
      this._scrollbarTimer = new Timer(this.getCtx(), 100, this._hideScrollbar, this);
    }

    this._maskContainer.setMask(this._fadeBottom);
    // Creates the scrollbar
    var scrollbarOptions = {
      color: '#9E9E9E',
      backgroundColor: '#F0F0F0',
      isHorizontal: this._isHorizontalScrolling,
      isReversed: false,
      min: 0,
      max: this._contentSize
    };
    if (this._isHorizontalScrolling) {
      this._scrollbar.render(
        scrollbarOptions,
        this._getScrollbarWidth(),
        SimpleScrollableContainer._SCROLLBAR_WIDTH
      );
      this._scrollbar.setTranslate(
        SimpleScrollableContainer._SCROLLBAR_GAP,
        this._height -
          (SimpleScrollableContainer._SCROLLBAR_WIDTH + SimpleScrollableContainer._SCROLLBAR_GAP)
      );
    } else {
      this._scrollbar.render(
        scrollbarOptions,
        SimpleScrollableContainer._SCROLLBAR_WIDTH,
        this._getScrollbarWidth()
      );
      this._scrollbar.setTranslate(
        Agent.isRightToLeft(this.getCtx())
          ? SimpleScrollableContainer._SCROLLBAR_GAP
          : this._width -
              (SimpleScrollableContainer._SCROLLBAR_WIDTH +
                SimpleScrollableContainer._SCROLLBAR_GAP),
        SimpleScrollableContainer._SCROLLBAR_GAP
      );
    }
    this._scrollbar.setViewportRange(0, this._getAvailSize());
    // make scrollbars visible for tests
    if (!Agent.isEnvironmentTest()) this._scrollbar.setAlpha(0);
    this.addChild(this._scrollbar);
    if (this.scrolling === 'always') {
      this._showScrollbar();
    }
  } else {
    this.addChild(this._container);
    this.removeChild(this._maskContainer);
    this.removeChild(this._scrollbar);
  }
};

/**
 * Returns the scrollbar width after adjusting for any styling gaps
 * @return {number}
 * @private
 */
SimpleScrollableContainer.prototype._getScrollbarWidth = function () {
  return (
    (this._isHorizontalScrolling ? this._width : this._height) -
    2 * SimpleScrollableContainer._SCROLLBAR_GAP
  );
};

/**
 * Returns the current available size of the scrollable dimension for this container. The available width is returned
 * if horizontal scrolling is enabled and the available height otherwise.
 * @return {number}
 * @private
 */
SimpleScrollableContainer.prototype._getAvailSize = function () {
  return this._isHorizontalScrolling ? this._width : this._height;
};

/**
 * Fades out the scrollbar
 * @param {dvt.BaseEvent} event
 * @private
 */
SimpleScrollableContainer.prototype._hideScrollbar = function (event) {
  if (this._isScrollbarVisible && this.scrolling !== 'always') {
    this._isScrollbarVisible = false;
    this._scrollbarTimer.reset();
    this._fadeOutAnim = new AnimFadeOut(this.getCtx(), this._scrollbar, 0.2);
    this._fadeOutAnim.play();
  }
};

/**
 * Displays the scrollbar and sets/resets a scrollbar fade out timer
 * @param {dvt.BaseEvent} event
 * @private
 */
SimpleScrollableContainer.prototype._showScrollbar = function (event) {
  if (!this._isScrollbarVisible) {
    if (this._fadeOutAnim) {
      this._fadeOutAnim.stop(true);
      this._fadeOutAnim = null;
    }
    this._scrollbar.setAlpha(1);
    this._isScrollbarVisible = true;
    this._scrollbarTimer.start();
  } else {
    this._scrollbarTimer.reset();
    this._scrollbarTimer.start();
  }
};

/**
 * Updates the masking fade effects to indicate scrollable regions
 * @param {number} translate The scrollbar translation
 * @private
 */
SimpleScrollableContainer.prototype._updateFade = function (translate) {
  if (translate == 0)
    // scrolled to the top, show bottom mask only
    this._maskContainer.setMask(this._fadeBottom);
  else if (translate + this._getAvailSize() >= this._contentSize)
    // scrolled to the bottom, show top mask only
    this._maskContainer.setMask(this._fadeTop);
  // scrolled to the middle, show mask at top and bottom
  else this._maskContainer.setMask(this._fadeTopBottom);
};

/**
 * Scrolls the container on mouse wheel.
 * @param {dvt.BaseEvent} event
 * @private
 */
SimpleScrollableContainer.prototype._onMouseWheel = function (event) {
  if (!this.hasScrollingContent()) return;
  this._showScrollbar();

  var delta = event.wheelDelta != null ? event.wheelDelta : 0;

  var newTranslate =
    -1 *
      (this._isHorizontalScrolling
        ? this._container.getTranslateX()
        : this._container.getTranslateY()) -
    4 * delta;
  var minTranslate = 0;
  var maxTranslate = Math.max(this._contentSize - this._getAvailSize(), 0);
  var translate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);
  if (this._isHorizontalScrolling) {
    this._container.setTranslateX(translate * -1);
    this._scrollbar.setViewportRange(translate + this._width, translate);
  } else {
    this._container.setTranslateY(translate * -1);
    this._scrollbar.setViewportRange(translate, translate + this._height);
  }
  this._updateFade(translate);
  event.preventDefault();
};

/**
 * Handles the event fired by the scrollbar.
 * @param {object} event
 * @private
 */
SimpleScrollableContainer.prototype._handleScrollbar = function (event) {
  this._showScrollbar();

  if (this._isHorizontalScrolling) this._container.setTranslateX(event.newMin * -1);
  else this._container.setTranslateY(event.newMin * -1);

  this._updateFade(event.newMin);
};

/**
 * Returns the width of this container
 * @return {number}
 */
SimpleScrollableContainer.prototype.getWidth = function () {
  return this._width;
};

/**
 * Returns the height of this container
 * @return {number}
 */
SimpleScrollableContainer.prototype.getHeight = function () {
  return this._height;
};

/**
 * Scrolls the container so that the displayable is visible.
 * @param {dvt.Displayable} displayable The displayable to view.
 */
SimpleScrollableContainer.prototype.scrollIntoView = function (displayable) {
  if (!this.hasScrollingContent()) return;

  var dim = displayable.getDimensions(displayable.getParent());
  var size = this._container.getDimensions();
  var translate;
  if (this._isHorizontalScrolling) {
    var currTranslateX = -1 * this._container.getTranslateX();
    var maxTranslateX = dim.x - size.x;
    var minTranslateX = dim.x + dim.w - this._width + size.x;

    if (currTranslateX < minTranslateX) {
      this._container.setTranslateX(-1 * minTranslateX);
      this._scrollbar.setViewportRange(minTranslateX + this._width, minTranslateX);
      translate = minTranslateX;
    } else if (currTranslateX > maxTranslateX) {
      this._container.setTranslateX(-1 * maxTranslateX);
      this._scrollbar.setViewportRange(maxTranslateX + this._width, maxTranslateX);
      translate = maxTranslateX;
    }
  } else {
    var currTranslateY = -1 * this._container.getTranslateY();
    var maxTranslateY = dim.y - size.y;
    var minTranslateY = dim.y + dim.h - this._height + size.y;

    if (currTranslateY < minTranslateY) {
      this._container.setTranslateY(-1 * minTranslateY);
      this._scrollbar.setViewportRange(minTranslateY, minTranslateY + this._height);
      translate = minTranslateY;
    } else if (currTranslateY > maxTranslateY) {
      this._container.setTranslateY(-1 * maxTranslateY);
      this._scrollbar.setViewportRange(maxTranslateY, maxTranslateY + this._height);
      translate = maxTranslateY;
    }
  }
  if (translate != undefined) this._updateFade(translate);
};

/**
 * Returns whether or not content will scroll based on available space.
 * @return {boolean} true if content will scroll
 */
SimpleScrollableContainer.prototype.hasScrollingContent = function () {
  return this._contentSize > this._getAvailSize();
};

/**
 * Button
 * @param {dvt.Context} context
 * @param {dvt.Displayable} upState
 * @param {dvt.Displayable} overState
 * @param {dvt.Displayable} downState
 * @param {dvt.Displayable} disabledState
 * @param {string} id
 * @param {object=} callback
 * @param {object=} callbackObj
 * @constructor
 */
const Button = function (
  context,
  upState,
  overState,
  downState,
  disabledState,
  id,
  callback,
  callbackObj
) {
  this.Init(context, upState, overState, downState, disabledState, id, callback, callbackObj);
};

Obj.createSubclass(Button, Container);

Button.STATE_ENABLED = 0;
Button.STATE_OVER = 1;
Button.STATE_DOWN = 2;
Button.STATE_DISABLED = 3;

Button.NO_EVENT_LISTENERS = true; //dont register any event listeners

/**
 * Initialization method called by the constructor
 *
 * @protected
 *
 * @param {dvt.Context} context  Platform specific context object
 * @param {dvt.Displayable} upState      Button up state
 * @param {dvt.Displayable} overState    Button over state
 * @param {dvt.Displayable} downState    Button down state
 * @param {dvt.Displayable} disabledState    Button disabled state
 * @param {string} id   The id for this object
 * @param {function} callback   The optional function that should be called on click event
 * @param {object} callbackObj  The optional object instance on which the callback function is defined
 *
 */
Button.prototype.Init = function (
  context,
  upState,
  overState,
  downState,
  disabledState,
  id,
  callback,
  callbackObj
) {
  Button.superclass.Init.call(this, context, null, id);

  this.setCallback(callback, callbackObj);

  //: don't do anything special in setUpState() during construction
  this._bDuringInit = true;

  this.setUpState(upState);
  this.setOverState(overState);
  this.setDownState(downState);

  if (disabledState) {
    this.setDisabledState(disabledState);
  }

  this.setEnabled(true); // enable mouse events for upState
  this.drawUpState();

  this._tooltip = null;

  this._bToggleEnabled = false;
  this._bToggled = false;

  //: don't do anything special in setUpState() during construction
  this._bDuringInit = false;
};

/**
 *  Returns the enabled state of this button
 *  @return {boolean}  true if the button is enabled,, else false.
 */
Button.prototype.isEnabled = function () {
  return this._enabled;
};

/**
 *   Enable/disable the button
 */
Button.prototype.setEnabled = function (bEnabled) {
  if (this._enabled != bEnabled) {
    this._enabled = bEnabled;
    var isTouchDevice = Agent.isTouchDevice();
    var clickEvent = isTouchDevice ? TouchEvent.TOUCHSTART : MouseEvent.CLICK;
    // Set passive: false for touch start event, so that preventDefault can be called on the event.
    var clickEventOptions = isTouchDevice ? { capture: false, passive: false } : { capture: false };

    if (bEnabled) {
      this.addEvtListener(MouseEvent.MOUSEOVER, this.OnMouseOver, false, this);
      this.addEvtListener(MouseEvent.MOUSEOUT, this.OnMouseOut, false, this);
      this.addEvtListener(MouseEvent.MOUSEDOWN, this.OnMouseDown, false, this);
      this.addEvtListener(MouseEvent.MOUSEUP, this.OnMouseUp, false, this);
      this.addEvtListener(clickEvent, this.OnClick, clickEventOptions, this);
      this.setCursor(SelectionEffectUtils.getSelectingCursor());
    } else {
      this.removeEvtListener(MouseEvent.MOUSEOVER, this.OnMouseOver, false, this);
      this.removeEvtListener(MouseEvent.MOUSEOUT, this.OnMouseOut, false, this);
      this.removeEvtListener(MouseEvent.MOUSEDOWN, this.OnMouseDown, false, this);
      this.removeEvtListener(MouseEvent.MOUSEUP, this.OnMouseUp, false, this);
      this.removeEvtListener(clickEvent, this.OnClick, clickEventOptions, this);
      this.setCursor(null);
    }
    // render disabled state
    this.initState();
  }
};

/**
 * Mouse over handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
Button.prototype.OnMouseOver = function (event) {
  if (!this._bToggled) {
    this.drawOverState();
  } else {
    this.drawOverDownState();
  }
};

/**
 * Mouse out handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
Button.prototype.OnMouseOut = function (event) {
  if (!this._bToggled) {
    this.drawUpState();
  } else {
    this.drawDownState();
  }
};

/**
 * Mouse down handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
Button.prototype.OnMouseDown = function (event) {
  this.drawDownState();
};

/**
 * Mouse up handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
Button.prototype.OnMouseUp = function (event) {
  if (!this._bToggled) {
    Agent.isTouchDevice() ? this.drawUpState() : this.drawOverState();
  } else {
    Agent.isTouchDevice() ? this.drawDownState() : this.drawOverDownState();
  }
};

/**
 * @protected
 * Click Handler
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
Button.prototype.OnClick = function (event) {
  if (this._bToggleEnabled) {
    this._bToggled = !this._bToggled;
    if (!this._bToggled) {
      Agent.isTouchDevice() ? this.drawUpState() : this.drawOverState();
    } else {
      Agent.isTouchDevice() ? this.drawDownState() : this.drawOverDownState();
    }
  }

  // Call the callback
  if (this._callback) {
    this._callback.call(this._callbackObj, event, this);
    event.stopPropagation();
    event.preventDefault();
  }
};

Button.prototype.drawUpState = function () {
  this._enableButton(this.upState, true);
  this._enableButton(this.downState, false);
  this._enableButton(this.overState, false);
  this._enableButton(this.disabledState, false);
  this._enableButton(this.overDownState, false);
};

Button.prototype.drawOverState = function () {
  this._enableButton(this.upState, false);
  this._enableButton(this.downState, false);
  this._enableButton(this.overState, true);
  this._enableButton(this.disabledState, false);
  this._enableButton(this.overDownState, false);
};

Button.prototype.drawDownState = function () {
  this._enableButton(this.upState, false);
  this._enableButton(this.downState, true);
  this._enableButton(this.overState, false);
  this._enableButton(this.disabledState, false);
  this._enableButton(this.overDownState, false);
};

Button.prototype.drawDisabledState = function () {
  this._enableButton(this.upState, false);
  this._enableButton(this.overState, false);
  this._enableButton(this.downState, false);
  this._enableButton(this.disabledState, true);
  this._enableButton(this.overDownState, false);
};

/**
 * Draws the over + down (hover selected) state.
 * If the state doesn't exist, defaults to drawing down state.
 */
Button.prototype.drawOverDownState = function () {
  if (this.overDownState) {
    this._enableButton(this.upState, false);
    this._enableButton(this.overState, false);
    this._enableButton(this.downState, false);
    this._enableButton(this.disabledState, false);
    this._enableButton(this.overDownState, true);
  } else this.drawDownState();
};

/**
 *   Show or hide the specified button face shape.
 */
Button.prototype._enableButton = function (button, enabled) {
  //   this._enableMouseEvents(button, enabled);
  if (button) {
    button.setAlpha(enabled ? 1 : 0);
  }

  //image button does not work when swapping different image states
  //   button.setVisible(enabled);
};

Button.prototype._enableMouseEvents = function (container, enabled) {
  if (container.setMouseEnabled) {
    container.setMouseEnabled(enabled);
  }
  var child = container.firstChild;

  //loop over all childs
  while (child != null) {
    this._enableMouseEvents(child, enabled);
    child = child.nextSibling;
  }
};

Button.prototype.setUpState = function (upState) {
  if (!this.upState || this.upState != upState) {
    var enabled = false;
    if (this.upState) {
      enabled = this._isButtonEnabled(this.upState);
      this.removeChild(this.upState);
    }
    //: if the button has no enabled states, enable the up state by default
    else if (!this._bDuringInit) {
      var bDownEnabled = false;
      var bOverEnabled = false;
      var bDisabledEnabled = false;
      if (this.downState) {
        bDownEnabled = this._isButtonEnabled(this.downState);
      }
      if (this.overState) {
        bOverEnabled = this._isButtonEnabled(this.overState);
      }
      if (this.disabledState) {
        bDisabledEnabled = this._isButtonEnabled(this.disabledState);
      }
      if (!(bDownEnabled || bOverEnabled || bDisabledEnabled)) {
        enabled = true;
      }
    }

    if (upState) {
      this.addChild(upState);
    }

    this.upState = upState;
    this._enableButton(this.upState, enabled);
  }
};

Button.prototype.setDownState = function (downState) {
  if (!this.downState || this.downState != downState) {
    var enabled = false;
    if (this.downState) {
      enabled = this._isButtonEnabled(this.downState);
      this.removeChild(this.downState);
    }

    if (downState) {
      this.addChild(downState);
    }

    this.downState = downState;
    this._enableButton(this.downState, enabled);
  }
};

Button.prototype.setOverState = function (overState) {
  if (!this.overState || this.overState != overState) {
    var enabled = false;
    if (this.overState) {
      enabled = this._isButtonEnabled(this.overState);
      this.removeChild(this.overState);
    }

    if (overState) {
      this.addChild(overState);
    }

    this.overState = overState;
    this._enableButton(this.overState, enabled);
  }
};

Button.prototype.setDisabledState = function (disabledState) {
  if (!this.disabledState || this.disabledState == disabledState) {
    var enabled = false;
    if (this.disabledState) {
      enabled = this._isButtonEnabled(this.disabledState);
      this.removeChild(this.disabledState);
    }

    if (disabledState) {
      this.addChild(disabledState);
    }

    this.disabledState = disabledState;
    this._enableButton(this.disabledState, enabled);
  }
};

/**
 * Sets the over + down (hover selected) state of a toggle button
 * @param {dvt.Shape} overDownState
 */
Button.prototype.setOverDownState = function (overDownState) {
  if (!this.overDownState || this.overDownState == overDownState) {
    var enabled = false;
    if (this.overDownState) {
      enabled = this._isButtonEnabled(this.overDownState);
      this.removeChild(this.overDownState);
    }

    if (overDownState) {
      this.addChild(overDownState);
    }

    this.overDownState = overDownState;
    this._enableButton(this.overDownState, enabled);
  }
};

/**
 * Set the callback function handler
 *
 * @public
 *
 * @param {function} callback    The function that should be called on click event
 * @param {object} callbackObj   The object instance on which the callback function is defined
 */
Button.prototype.setCallback = function (callback, callbackObj) {
  this._callback = callback;
  this._callbackObj = callbackObj;
};

Button.prototype.setTooltip = function (tooltip) {
  this._tooltip = tooltip;

  // Assume that if using Button's tooltip getter/setter that we should set wai-aria properties
  // Otherwise, assume that button owner has separate logical object that will handle accessibility
  if (tooltip) {
    this.setAriaRole('button');
    this.setAriaProperty('label', tooltip);
  }
};

Button.prototype.getTooltip = function () {
  return this._tooltip;
};

Button.prototype.initState = function () {
  this.isEnabled() ? this.drawUpState() : this.drawDisabledState();
};

Button.prototype.setToggleEnabled = function (bToggleEnabled) {
  this._bToggleEnabled = bToggleEnabled;
};

Button.prototype.setToggled = function (bToggled) {
  if (this._bToggleEnabled) {
    this._bToggled = bToggled;
    if (!this._bToggled) {
      this.drawUpState();
    } else {
      this.drawDownState();
    }
  }
};

Button.prototype.isToggled = function () {
  return this._bToggled;
};

Button.prototype._isButtonEnabled = function (button) {
  var enabled = false;
  if (button) {
    enabled = button.getAlpha() > 0 ? true : false;
  }
  return enabled;
};

/**
 * Show keyboard focus
 */
Button.prototype.showKeyboardFocusEffect = function () {
  if (!this._keyboardFocusEffect) this._keyboardFocusEffect = this.CreateKeyboardFocusEffect();
  this._keyboardFocusEffect.show();
  this._isShowingKeyboardFocusEffect = true;
  this.getCtx().setActiveElement(this);
};

/**
 * Hide keyboard focus
 */
Button.prototype.hideKeyboardFocusEffect = function () {
  if (this._keyboardFocusEffect) this._keyboardFocusEffect.hide();
  this._isShowingKeyboardFocusEffect = false;
};

/**
 * Returns true if this navigable is showing its keyboard focus effect
 * @return {boolean} true if showing keyboard focus effect
 */
Button.prototype.isShowingKeyboardFocusEffect = function () {
  return this._isShowingKeyboardFocusEffect;
};

/**
 * @protected
 * Creates keyboard focus effect for the component
 * @return {KeyboardFocusEffect} keyboard focus effect
 */
Button.prototype.CreateKeyboardFocusEffect = function () {
  return new KeyboardFocusEffect(this.getCtx(), this, this.getDimensions(), null, null, true);
};

/**
 * Handle keyboard event
 * @param {DvtKeyboardEvent} event keyboard event
 */
Button.prototype.handleKeyboardEvent = function (event) {
  var keyCode = event.keyCode;
  if (keyCode == KeyboardEvent.ENTER || keyCode == KeyboardEvent.SPACE) {
    // Call the callback
    if (this._callback) {
      this._callback.call(this._callbackObj, event, this);
      event.stopPropagation();
      event.preventDefault();
    }
  }
};

/**
 * IconButton
 * @param {dvt.Context} context
 * @param {'outlined'|'borderless'} chroming
 * @param {object} iconOptions supports keys style, size, pos
 * @param {dvt.Shape} background (optional)
 * @param {string} id
 * @param {object=} callback
 * @param {object=} callbackObj
 * @constructor
 */
const IconButton = function (
  context,
  chroming,
  iconOptions,
  background,
  id,
  callback,
  callbackObj
) {
  this.Init(context, chroming, iconOptions, background, id, callback, callbackObj);
};

Obj.createSubclass(IconButton, Container);

/**
 * Initialization method called by the constructor
 *
 * @protected
 *
 * @param {dvt.Context} context  Platform specific context object
 * @param {'outlined'|'borderless'} chroming
 * @param {object} iconOptions supports keys style, size, pos
 * @param {dvt.Shape} background (optional)
 * @param {string} id   The id for this object
 * @param {function} callback   The optional function that should be called on click event
 * @param {object} callbackObj  The optional object instance on which the callback function is defined
 *
 */
IconButton.prototype.Init = function (
  context,
  chroming,
  iconOptions,
  background,
  id,
  callback,
  callbackObj
) {
  IconButton.superclass.Init.call(this, context, null, id);

  this.setCallback(callback, callbackObj);

  this._chroming = chroming;
  if (!background) background = this._createDefaultBackground(iconOptions.size);

  var solidBackground = background.copyShape();
  solidBackground.setClassName('oj-dvt-button-background');
  this.addChild(solidBackground);
  this.addChild(background);
  var icon = OutputText.createIcon(this.getCtx(), iconOptions);
  this.addChild(icon);

  this._tooltip = null;

  this._bToggleEnabled = false;
  this._bToggled = false;
  this._bMouseOver = false;
  this._bMouseDown = false;
  this.setEnabled(true); // enable mouse events
};

IconButton.prototype._createDefaultBackground = function (iconSize) {
  var padding = 4;
  var cmd = PathUtils.roundedRectangle(
    -padding,
    -padding,
    iconSize + 2 * padding,
    iconSize + 2 * padding,
    padding,
    padding,
    padding,
    padding
  );
  var background = new Path(this.getCtx(), cmd);
  // don't use pixel hinting on desktop bc the corners look broken
  background.setPixelHinting(Agent.getDevicePixelRatio() > 1);
  return background;
};

/**
 *  Returns the enabled state of this button
 *  @return {boolean}  true if the button is enabled,, else false.
 */
IconButton.prototype.isEnabled = function () {
  return this._enabled;
};

/**
 *   Enable/disable the button
 */
IconButton.prototype.setEnabled = function (bEnabled) {
  if (this._enabled != bEnabled) {
    this._enabled = bEnabled;
    var isTouchDevice = Agent.isTouchDevice();
    var clickEvent = isTouchDevice ? TouchEvent.TOUCHSTART : MouseEvent.CLICK;
    // Set passive: false for touch start event, so that preventDefault can be called on the event.
    var clickEventOptions = isTouchDevice ? { capture: false, passive: false } : { capture: false };

    if (bEnabled) {
      this.addEvtListener(MouseEvent.MOUSEOVER, this.OnMouseOver, false, this);
      this.addEvtListener(MouseEvent.MOUSEOUT, this.OnMouseOut, false, this);
      this.addEvtListener(MouseEvent.MOUSEDOWN, this.OnMouseDown, false, this);
      this.addEvtListener(MouseEvent.MOUSEUP, this.OnMouseUp, false, this);
      this.addEvtListener(clickEvent, this.OnClick, clickEventOptions, this);
      this.setCursor(SelectionEffectUtils.getSelectingCursor());
    } else {
      this.removeEvtListener(MouseEvent.MOUSEOVER, this.OnMouseOver, false, this);
      this.removeEvtListener(MouseEvent.MOUSEOUT, this.OnMouseOut, false, this);
      this.removeEvtListener(MouseEvent.MOUSEDOWN, this.OnMouseDown, false, this);
      this.removeEvtListener(MouseEvent.MOUSEUP, this.OnMouseUp, false, this);
      this.removeEvtListener(clickEvent, this.OnClick, clickEventOptions, this);
      this.setCursor(null);
      this._bMouseOver = false;
      this._bMouseDown = false;
    }
    this._updateClasses();
  }
};

/**
 * Mouse over handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
IconButton.prototype.OnMouseOver = function (event) {
  this._bMouseOver = true;
  this._updateClasses();
};

/**
 * Mouse out handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
IconButton.prototype.OnMouseOut = function (event) {
  this._bMouseOver = false;
  this._updateClasses();
};

/**
 * Mouse down handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
IconButton.prototype.OnMouseDown = function (event) {
  this._bMouseDown = true;
  this._updateClasses();
};

/**
 * Mouse up handler
 * @protected
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
IconButton.prototype.OnMouseUp = function (event) {
  this._bMouseDown = false;
  this._updateClasses();
};

/**
 * @protected
 * Click Handler
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object
 */
IconButton.prototype.OnClick = function (event) {
  if (this._bToggleEnabled) {
    this.setToggled(!this._bToggled);
  }

  // Call the callback
  if (this._callback) {
    this._callback.call(this._callbackObj, event, this);
    event.stopPropagation();
    event.preventDefault();
  }
};

/**
 * Set the callback function handler
 *
 * @public
 *
 * @param {function} callback    The function that should be called on click event
 * @param {object} callbackObj   The object instance on which the callback function is defined
 */
IconButton.prototype.setCallback = function (callback, callbackObj) {
  this._callback = callback;
  this._callbackObj = callbackObj;
};

IconButton.prototype.setTooltip = function (tooltip) {
  this._tooltip = tooltip;

  // Assume that if using IconButton's tooltip getter/setter that we should set wai-aria properties
  // Otherwise, assume that button owner has separate logical object that will handle accessibility
  if (tooltip) {
    this.setAriaRole('button');
    this.setAriaProperty('label', tooltip);
  }
};

IconButton.prototype.getTooltip = function () {
  return this._tooltip;
};

IconButton.prototype.setToggleEnabled = function (bToggleEnabled) {
  this._bToggleEnabled = bToggleEnabled;
  this._updateClasses();
};

IconButton.prototype.setToggled = function (bToggled) {
  if (this._bToggleEnabled) {
    this._bToggled = bToggled;
    this._updateClasses();
  }
};

IconButton.prototype.isToggled = function () {
  return this._bToggled;
};

/**
 * Show keyboard focus
 */
IconButton.prototype.showKeyboardFocusEffect = function () {
  if (!this._keyboardFocusEffect) this._keyboardFocusEffect = this.CreateKeyboardFocusEffect();
  this._keyboardFocusEffect.show();
  this._isShowingKeyboardFocusEffect = true;
  this.getCtx().setActiveElement(this);
};

/**
 * Hide keyboard focus
 */
IconButton.prototype.hideKeyboardFocusEffect = function () {
  if (this._keyboardFocusEffect) this._keyboardFocusEffect.hide();
  this._isShowingKeyboardFocusEffect = false;
};

/**
 * Returns true if this navigable is showing its keyboard focus effect
 * @return {boolean} true if showing keyboard focus effect
 */
IconButton.prototype.isShowingKeyboardFocusEffect = function () {
  return this._isShowingKeyboardFocusEffect;
};

/**
 * @protected
 * Creates keyboard focus effect for the component
 * @return {KeyboardFocusEffect} keyboard focus effect
 */
IconButton.prototype.CreateKeyboardFocusEffect = function () {
  return new KeyboardFocusEffect(this.getCtx(), this, this.getDimensions(), null, null, true);
};

/**
 * Handle keyboard event
 * @param {DvtKeyboardEvent} event keyboard event
 */
IconButton.prototype.handleKeyboardEvent = function (event) {
  var keyCode = event.keyCode;
  if (keyCode == KeyboardEvent.ENTER || keyCode == KeyboardEvent.SPACE) {
    // Call the callback
    if (this._callback) {
      this._callback.call(this._callbackObj, event, this);
      event.stopPropagation();
      event.preventDefault();
    }
  }
};

IconButton.prototype._updateClasses = function () {
  var elem = this.getElem();
  var disabled = false;
  var hover = false;
  var active = false;
  var selected = this._bToggleEnabled && this._bToggled;
  var unselected = this._bToggleEnabled && !this._bToggled;
  if (this._enabled) {
    hover = this._bMouseOver;
    active = this._bMouseDown;
  } else {
    disabled = true;
  }
  this.setClassName(
    `oj-dvt-button-${this._chroming}${selected ? ' oj-selected' : ''}${
      unselected ? ' oj-unselected' : ''
    }${disabled ? ' oj-disabled' : ''}${hover ? ' oj-hover' : ''}${active ? ' oj-active' : ''}`
  );
};

/**
 * TransientButton. This adds listeners that hide and show this button based
 * on focus, blur, mouse over, and mouse out events on the current stage.
 * @param {dvt.Context} context The rendering context.
 * @param {object} iconStyle the icon style
 * @param {object} iconSize the icon size
 * @param {function} callback The function that should be called to when this button is activated.
 * @param {object} callbackObj The object instance on which the callback function is defined.
 * @extends {dvt.Button}
 * @constructor
 */
const TransientButton = function (context, iconStyle, iconSize, callback, callbackObj) {
  this.Init(context, iconStyle, iconSize, callback, callbackObj);
};

Obj.createSubclass(TransientButton, IconButton);

/**
 * Attribute for button radius.
 * @const
 * @private
 */
TransientButton._DEFAULT_RADIUS = 15.5;

/**
 * Helper method called by the constructor to initialize this object.
 * @param {dvt.Context} context The rendering context.
 * @param {object} iconStyle the icon style
 * @param {object} iconSize the icon size
 * @param {function} callback The function that should be called to when this button is activated.
 * @param {object} callbackObj The object instance on which the callback function is defined.
 * @protected
 */
TransientButton.prototype.Init = function (context, iconStyle, iconSize, callback, callbackObj) {
  var radius = TransientButton._DEFAULT_RADIUS;
  var background = new Circle(context, radius, radius, radius);
  TransientButton.superclass.Init.call(
    this,
    context,
    'outlined',
    { style: iconStyle, size: iconSize, pos: { x: radius, y: radius } },
    background,
    null,
    callbackObj,
    callback
  );
  var stage = context.getStage();
  // Need to set 'useCapture' to true for focus/blur event listeners since dvt.EventManager calls 'stopPropagation'
  stage.addEvtListener(DvtFocusEvent.FOCUS, this._onFocus, true, this);
  stage.addEvtListener(DvtFocusEvent.BLUR, this._onBlur, true, this);
  if (!Agent.isTouchDevice()) {
    // IE does not always fire the appropriate mouseover and mouseout events, so use mouseenter and mouseleave instead
    if (Agent.browser === 'ie' || Agent.browser === 'edge') {
      stage.addEvtListener('mouseenter', this._onMouseOver, false, this);
      stage.addEvtListener('mouseleave', this._onMouseOut, false, this);
    } else {
      stage.addEvtListener(MouseEvent.MOUSEOVER, this._onMouseOver, false, this);
      stage.addEvtListener(MouseEvent.MOUSEOUT, this._onMouseOut, false, this);
    }
  }
};

/**
 * Sets this button as visible.
 */
TransientButton.prototype.show = function () {
  this.setAlpha(1);
};

/**
 * Sets this button as hidden.
 */
TransientButton.prototype.hide = function () {
  this.setAlpha(0);
};

/**
 * Focus handler.
 * @private
 * @param {DvtFocusEvent} event The dispatched event to be processed by the object.
 */
TransientButton.prototype._onFocus = function (event) {
  this._isFocused = true;
  this.show();
};

/**
 * Blur handler.
 * @private
 * @param {DvtFocusEvent} event The dispatched event to be processed by the object.
 */
TransientButton.prototype._onBlur = function (event) {
  this._isFocused = false;
  if (!this._isMouseOver) this.hide();
};

/**
 * Mouse over handler.
 * @private
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object.
 */
TransientButton.prototype._onMouseOver = function (event) {
  if (this._mouseOutTimer && this._mouseOutTimer.isRunning()) this._mouseOutTimer.stop();

  this._isMouseOver = true;
  this.show();
};

/**
 * Mouse out handler.
 * @private
 * @param {DvtMouseEvent} event The dispatched event to be processed by the object.
 */
TransientButton.prototype._onMouseOut = function (event) {
  if (!this._mouseOutTimer)
    this._mouseOutTimer = new Timer(this.getCtx(), 10, this._onMouseOutTimerEnd, this, 1);

  this._mouseOutTimer.reset();
  this._mouseOutTimer.start();
};

/**
 * Mouse out timer handler.
 * @private
 */
TransientButton.prototype._onMouseOutTimerEnd = function () {
  this._isMouseOver = false;
  if (!this._isFocused) this.hide();
};

/**
 * @override
 */
TransientButton.prototype.OnMouseDown = function (event) {
  TransientButton.superclass.OnMouseDown.call(this, event);
  //Event propagation is stopped because TransientButton should not initiate drag on mouse down event
  event.stopPropagation();
};

/**
 * @override
 */
TransientButton.prototype.OnMouseUp = function (event) {
  TransientButton.superclass.OnMouseUp.call(this, event);
  //Event propagation is stopped because TransientButton should not initiate drag on mouse up event
  event.stopPropagation();
};

/**
 * Simple logical object for custom datatip support.
 * @param {dvt.HtmlTooltipManager} tooltipManager
 * @param {function} tooltipFunc The callback function used to render the datatip content
 * @param {string} datatipColor The border color of the datatip.
 * @param {object} dataContext Object passed into the callback function
 * @class
 * @constructor
 */
const CustomDatatipPeer = function (tooltipManager, tooltipFunc, datatipColor, dataContext) {
  this.Init(tooltipManager, tooltipFunc, datatipColor, dataContext);
};

Obj.createSubclass(CustomDatatipPeer, Obj);

/**
 * @override
 */
CustomDatatipPeer.prototype.Init = function (
  tooltipManager,
  tooltipFunc,
  datatipColor,
  dataContext
) {
  this._tooltipManager = tooltipManager;
  this._tooltipFunc = tooltipFunc;
  this._datatipColor = datatipColor;
  this._dataContext = dataContext;
};

/**
 * @override
 */
CustomDatatipPeer.prototype.getDatatip = function (target) {
  return this._tooltipManager.getCustomTooltip(this._tooltipFunc, this._dataContext);
};

/**
 * @override
 */
CustomDatatipPeer.prototype.getDatatipColor = function (target) {
  return this._datatipColor;
};

/**
 *  Provides automation services for a DVT component.
 *  @param {Object} dvtComponent
 *  @constructor
 */
const Automation = function (dvtComponent) {
  this.Init(dvtComponent);
};

Obj.createSubclass(Automation, Obj);

Automation.prototype.Init = function (dvtComponent) {
  this._comp = dvtComponent;
};

/**
 * @const
 */
Automation.TOOLTIP_SUBID = 'tooltip';

/**
 * Returns the subId corresponding to the SVG DOM Element.
 * @param {SVGElement} domElement The SVG DOM Element used in determining the subId
 * @return {String} The corresponding subId
 */
Automation.prototype.getSubIdForDomElement = function (domElement) {
  var displayable = Automation._findDisplayable(domElement);
  if (displayable && !(displayable instanceof Array))
    return this.GetSubIdForDomElement(displayable);
  else if (domElement) {
    // tooltip automation
    if (this.IsTooltipElement(domElement)) return Automation.TOOLTIP_SUBID;
  }
  return null;
};

/**
 * Returns the subId corresponding to the dvt.Displayable.
 * @param {dvt.Displayable} displayable The dvt.Displayable used in determining the subId
 * @return {String} The corresponding subId
 * @protected
 */
Automation.prototype.GetSubIdForDomElement = function (displayable) {
  //subclasses should override
  return null;
};

/**
 * Returns the SVG DOM Element corresponding to the given subId
 * @param {String} subId The subId used to locate a SVG DOM Element
 * @return {SVGElement} The SVG DOM Element
 */
Automation.prototype.getDomElementForSubId = function (subId) {
  //subclasses should override
  return null;
};

/**
 * Finds the dvt.Displayable for a DOM Element
 * @param {SVGElement} domElement The SVG DOM Element to find a dvt.Displayable for
 * @return {dvt.Displayable} The displayable corresponding to the DOM Element or null
 * @private
 */
Automation._findDisplayable = function (domElement) {
  while (domElement) {
    // If this object has a displayable, return it
    if (domElement._obj) return domElement._obj;
    // Otherwise look at the parent
    else domElement = domElement.parentNode;
  }
  return null;
};

/**
 * Finds the tooltip DOM Element associated with the dvtComponent
 * @param {Object} dvtComponent
 * @param {String} tooltipId (optional) Used when dvtComponent is a Chart to get datatip or tooltip
 * @return {SVGElement} The DOM Element corresponding to the tooltip, if it is visible, or null
 * @protected
 */
Automation.prototype.GetTooltipElement = function (dvtComponent, tooltipId) {
  if (dvtComponent) {
    var tooltipElem = dvtComponent.getCtx().getTooltipManager(tooltipId).getTooltipElem();
    return tooltipElem.style.visibility == 'hidden' ? null : tooltipElem;
  }

  return null;
};

/**
 * Returns true if the given DOM element is used for tooltips
 * @param {SVGElement} domElement The SVG DOM Element to inspect
 * @return {boolean} True if the domElement is used for tooltips
 * @protected
 */
Automation.prototype.IsTooltipElement = function (domElement) {
  var id = domElement.getAttribute('id');
  if (id && id.indexOf(HtmlTooltipManager._TOOLTIP_DIV_ID) == 0) return true;
  return false;
};

/**
 * Interactivity manager for keyboard events.
 * @param {EventManager} manager The owning EventManager
 * @class KeyboardHandler
 * @constructor
 */
const KeyboardHandler = function (manager) {
  this.Init(manager);
};

Obj.createSubclass(KeyboardHandler, Obj);

/**
 * @param {EventManager} manager The owning EventManager
 */
KeyboardHandler.prototype.Init = function (manager) {
  this._eventManager = manager;
};

/**
 * Processes key down events.
 * @param {DvtKeyboardEvent} event
 * @return {DvtKeyboardNavigable} The object that has keyboard focus as a result of the keyboard event. Null if the event
 *                                does not affect which DvtKeyboardNavigable has focus.
 */
KeyboardHandler.prototype.processKeyDown = function (event) {
  // If component does not have any data, return the logical object associated with no data text
  // to make the no data text keyboard navigable and accessible to non visual user.
  let optionsCache = this._eventManager.getComponent().getOptionsCache();
  let noDataPeer = optionsCache.getFromCache('noDataPeer');
  if (noDataPeer) {
    EventManager.consumeEvent(event);
    return noDataPeer;
  }

  var currentNavigable = this._eventManager.getFocus();
  if (currentNavigable && (this.isNavigationEvent(event) || this.isMultiSelectEvent(event))) {
    EventManager.consumeEvent(event);
    var nextNavigable = currentNavigable.getNextNavigable(event);
    return nextNavigable;
  }

  return null;
};

/**
 * Simple implementation to return a navigable item based on direction and bounding box of current focused item
 * @param {DvtKeyboardNavigable} currentNavigable The DvtKeyboardNavigable item with current focus
 * @param {DvtKeyboardEvent} event
 * @param {Array} navigableItems An array of items that could receive focus next
 * @param {Boolean=} ignoreBounds Ignore the _isInBounds check when finding the next navigable
 * @param {dvt.Displayable=} targetCoordinateSpace The displayable defining the target coordinate space
 * @param {Boolean=} use2d Whether or not to use perpendicular direction when comparing distance between logical objects
 * @return {DvtKeyboardNavigable} The next navigable
 */
KeyboardHandler.getNextNavigable = function (
  currentNavigable,
  event,
  navigableItems,
  ignoreBounds,
  targetCoordinateSpace,
  use2d
) {
  if (!currentNavigable) {
    if (!navigableItems || navigableItems.length < 1) return null;
    else return navigableItems[0];
  }

  var nextNavigable = null;
  var nextNavigableDelta = 0;
  var nextNavigableDelta2 = 0;
  var delta = 0;
  var delta2 = 0;

  var direction = event.keyCode;
  var direction2 = use2d && KeyboardHandler.getPerpendicularDirection(event.keyCode);

  // get the bounds of the current navigable
  var currentBounds = currentNavigable.getKeyboardBoundingBox(targetCoordinateSpace);
  var candidateBounds;

  for (var i = 0; i < navigableItems.length; i++) {
    var navigable = navigableItems[i];

    if (currentNavigable === navigable) continue;

    candidateBounds = navigable.getKeyboardBoundingBox(targetCoordinateSpace);

    if (ignoreBounds || KeyboardHandler._isInBounds(currentBounds, candidateBounds, direction)) {
      delta = KeyboardHandler._computeDelta(currentBounds, candidateBounds, direction);
      // using Math.abs in order to equally favor equidistance items in either positive or negative dir2
      delta2 =
        use2d &&
        Math.abs(KeyboardHandler._computeDelta(currentBounds, candidateBounds, direction2));

      if (
        ((direction == KeyboardEvent.UP_ARROW || direction == KeyboardEvent.LEFT_ARROW) &&
          delta < 0 &&
          (!nextNavigable || delta > nextNavigableDelta)) ||
        ((direction == KeyboardEvent.DOWN_ARROW || direction == KeyboardEvent.RIGHT_ARROW) &&
          delta > 0 &&
          (!nextNavigable || delta < nextNavigableDelta)) ||
        (use2d && delta === nextNavigableDelta && delta2 < nextNavigableDelta2 && delta !== 0)
      ) {
        nextNavigable = navigable;
        nextNavigableDelta = delta;
        nextNavigableDelta2 = delta2;
      }
    }
  }
  return nextNavigable ? nextNavigable : currentNavigable;
};

/**
 * Returns the key code of the arrow key perpendicular to that of the passed arrow key code. Follows right hand
 * screw rule to determine the perpendicular direction. i.e curl 4 fingers of right hand to point to direction
 * and thumb points to perpendicular direction.
 * @param {number} direction Integer key code of either up, down left or right arrow key.
 * @returns {number} Integer key code.
 */
KeyboardHandler.getPerpendicularDirection = function (direction) {
  if (direction === KeyboardEvent.UP_ARROW) {
    return KeyboardEvent.RIGHT_ARROW;
  } else if (direction === KeyboardEvent.RIGHT_ARROW) {
    return KeyboardEvent.DOWN_ARROW;
  } else if (direction === KeyboardEvent.DOWN_ARROW) {
    return KeyboardEvent.LEFT_ARROW;
  } else if (direction === KeyboardEvent.LEFT_ARROW) {
    return KeyboardEvent.UP_ARROW;
  }
};

/**
 * Returns a default keyboard navigable by selecting the upper left or lower right-most item in the navigableItems
 * array.  Utility method that can be called by classes that implement DvtKeyboardNavigable
 * @param {Array} navigableItems An array of DvtKeyboardNavigables from which to choose the default one to receive focus
 * @return {DvtKeyboardNavigable}
 */
KeyboardHandler.prototype.getDefaultNavigable = function (navigableItems) {
  if (!navigableItems || navigableItems.length <= 0) return null;

  var defaultNavigable = navigableItems[0];
  var defaultLocation = defaultNavigable.getKeyboardBoundingBox();
  var navigable;
  var navigableLocation;

  for (var i = 1; i < navigableItems.length; i++) {
    navigable = navigableItems[i];
    navigableLocation = navigable.getKeyboardBoundingBox();
    // return the top left-most item in non-bidi and top right-most item in bidi
    if (
      (((navigableLocation.x == defaultLocation.x && navigableLocation.y < defaultLocation.y) ||
        navigableLocation.x < defaultLocation.x) &&
        !Agent.isRightToLeft(this._eventManager.getCtx())) ||
      (((navigableLocation.x + navigableLocation.w == defaultLocation.x + defaultLocation.w &&
        navigableLocation.y < defaultLocation.y) ||
        navigableLocation.x + navigableLocation.w > defaultLocation.x + defaultLocation.w) &&
        Agent.isRightToLeft(this._eventManager.getCtx()))
    ) {
      defaultNavigable = navigable;
      defaultLocation = defaultNavigable.getKeyboardBoundingBox();
    }
  }

  return defaultNavigable;
};

/**
 * Returns true if the event requires us to update the DvtKeyboardNavigable with keyboard focus.  In the base
 * implementation, we return true if the given event is an arrow keystroke.
 * @param {DvtKeybaordEvent} event
 * @return {Boolean}
 */
KeyboardHandler.prototype.isNavigationEvent = function (event) {
  var keyCode = event.keyCode;

  switch (keyCode) {
    case KeyboardEvent.UP_ARROW:
    case KeyboardEvent.DOWN_ARROW:
    case KeyboardEvent.LEFT_ARROW:
    case KeyboardEvent.RIGHT_ARROW:
      return true;
    default:
      break;
  }
  return false;
};

/**
 * Returns true if the event requires us to perform a single select
 * @param {DvtKeyboardEvent} event
 * @return {Boolean}
 */
KeyboardHandler.prototype.isSelectionEvent = function (event) {
  return false; // subclasses should override
};

/**
 * Returns true if the event requires us to perform a multi select
 * @param {DvtKeybaordEvent} event
 * @return {Boolean}
 */
KeyboardHandler.prototype.isMultiSelectEvent = function (event) {
  return false; // subclasses should override
};

/**
 * Determines if the candidate bounds line up with the current bounds in the given direction
 * For example, if the direction is up, then the candidate's x-bounds should overlap with the
 * current's x-bounds
 *
 * @param {dvt.Rectangle} currentBounds
 * @param {dvt.Rectangle} candidateBounds
 * @param {Number} direction  One of DvtKeyboardEvent.UP_ARROW, DvtKeyboardEvent.DOWN_ARROW,
 *                            DvtKeyboardEvent.LEFT_ARROW, or DvtKeyboardEvent.RIGHT_ARROW
 * @return {Boolean} True if the candidate bounds line up with the current bounds, in the given direction
 * @private
 */
KeyboardHandler._isInBounds = function (currentBounds, candidateBounds, direction) {
  if (direction == KeyboardEvent.UP_ARROW || direction == KeyboardEvent.DOWN_ARROW) {
    // if up/down, check that the current x-bounds overlap with the candidate's x-bounds.
    // by making sure that the left edge of the current is not to the right of the candidate
    // and that the right edge of the current is not to the left of the candidate

    var currentX1 = currentBounds.x;
    var currentX2 = currentX1 + currentBounds.w;
    var candidateX1 = candidateBounds.x;
    var candidateX2 = candidateX1 + candidateBounds.w;

    return !(currentX1 >= candidateX2 || currentX2 <= candidateX1);
  } else if (
    direction == KeyboardEvent.LEFT_ARROW ||
    direction == KeyboardEvent.RIGHT_ARROW
  ) {
    // if left/right, check that the current y-bounds overlap with the candidate's y-bounds.
    // by making sure that the top edge of the current is not below the candidate
    // and that the bottom edge of the current is not above the candidate

    var currentY1 = currentBounds.y;
    var currentY2 = currentY1 + currentBounds.h;
    var candidateY1 = candidateBounds.y;
    var candidateY2 = candidateY1 + candidateBounds.h;

    return !(currentY1 >= candidateY2 || currentY2 <= candidateY1);
  }
};

/**
 * Determines the diffeerence between the centers of the currentBounds and the candidatBounds,
 * in the given direction.  The difference is negative if the candidate is above or to the left
 * of the current, positive if the candidate is below or to the right
 *
 * @param {dvt.Rectangle} currentBounds
 * @param {dvt.Rectangle} candidateBounds
 * @param {Number} direction  One of DvtKeyboardEvent.UP_ARROW, DvtKeyboardEvent.DOWN_ARROW,
 *                            DvtKeyboardEvent.LEFT_ARROW, or DvtKeyboardEvent.RIGHT_ARROW
 * @return {Number} The difference between the centers of the currentBounds and candidateBounds, in
 *                  the given direction
 * @private
 */

KeyboardHandler._computeDelta = function (currentBounds, candidateBounds, direction) {
  var delta = 0;
  var currentX = currentBounds.getCenter().x;
  var currentY = currentBounds.getCenter().y;
  var candidateX = candidateBounds.getCenter().x;
  var candidateY = candidateBounds.getCenter().y;

  if (direction == KeyboardEvent.UP_ARROW || direction == KeyboardEvent.DOWN_ARROW)
    delta = candidateY - currentY;
  else if (direction == KeyboardEvent.LEFT_ARROW || direction == KeyboardEvent.RIGHT_ARROW)
    delta = candidateX - currentX;

  return delta;
};

/**
 * Returns the next navigable based on the arrow key that was pressed. This method will return the next navigable that
 * is adjacent to the current navigable, in the direction of the arrow key. If there are no adjacent navigables, the
 * closest navigable in the direction of the arrow key is returned.  Distance to the nearest navigable is based on
 * straight line distance between the midpoints of the navigables' keyboard bounding box, multiplied by a penalty
 * factor if the midpoints are too far off the vertical (in the case of up and down) or horizontal (for left and right)
 *
 * @param {DvtKeyboardNavigable} current
 * @param {DvtKeyboardEvent} event
 * @param {Array} listOfObjects Array of DvtKeyboardNavigable objects
 * @return {DvtKeyboardNavigable}
 */
KeyboardHandler.getNextAdjacentNavigable = function (current, event, listOfObjects) {
  var keycode = event.keyCode;

  if (!listOfObjects) return null;

  if (!current) return listOfObjects[0];

  var nextObject = current; //init to current object
  var nextDistance = Number.MAX_VALUE;

  // If an object is in contact it overrules all other attributes
  // Only another in contact object with better attributes will have higher precedence
  var nextInContact = false;

  // Whether or not the for loop has encountered the current object
  var hasFoundCurrent = false;

  for (var i = 0; i < listOfObjects.length; i++) {
    var object = listOfObjects[i];

    if (object === current) {
      hasFoundCurrent = true;
      continue;
    }

    if (!KeyboardHandler._isValidDestination(object, current, keycode)) continue;

    var inContact = KeyboardHandler._calcInContact(object, current, keycode);

    if (nextInContact && !inContact) continue;

    var distance = KeyboardHandler._calcDistanceAngleWeighted(object, current, keycode);

    // : If there is another object with the exact same position as the current one, only navigate to that
    // object if it is positioned later (index-wise) in the listOfObjects. Otherwise, the navigation will get trapped
    // between the two (or more) overlapping objects forever since the algorithm always navigates to the closest object.
    if (distance == 0 && !hasFoundCurrent) continue;

    // Make sure incontact flag have highest precedence
    if (
      (!nextInContact && inContact) ||
      (distance < nextDistance && ((nextInContact && inContact) || !nextInContact))
    ) {
      nextDistance = distance;
      nextObject = object;
      nextInContact = inContact;
    }
  }
  return nextObject;
};

/**
 * Determine if two objects are in contact in the specified direction
 *
 * @param {DvtKeyboardNavigable} object
 * @param {DvtKeyboardNavigable} current
 * @param {Number} keycode
 * @return {Boolean}
 * @private
 */
KeyboardHandler._calcInContact = function (object, current, keycode) {
  var objRect = object.getKeyboardBoundingBox();
  var curRect = current.getKeyboardBoundingBox();

  switch (keycode) {
    case KeyboardEvent.UP_ARROW:
      return (
        KeyboardHandler._isVerticallyAligned(objRect, curRect) &&
        (curRect.y <= objRect.y + objRect.h ||
          KeyboardHandler._areEqualWithinTolerance(curRect.y, objRect.y + objRect.h))
      );
    case KeyboardEvent.DOWN_ARROW:
      return (
        KeyboardHandler._isVerticallyAligned(objRect, curRect) &&
        (objRect.y <= curRect.y + curRect.h ||
          KeyboardHandler._areEqualWithinTolerance(objRect.y, curRect.y + curRect.h))
      );
    case KeyboardEvent.RIGHT_ARROW:
      return (
        KeyboardHandler._isHorizontallyAligned(objRect, curRect) &&
        (objRect.x <= curRect.x + curRect.w ||
          KeyboardHandler._areEqualWithinTolerance(objRect.x, curRect.x + curRect.w))
      );
    case KeyboardEvent.LEFT_ARROW:
      return (
        KeyboardHandler._isHorizontallyAligned(objRect, curRect) &&
        (curRect.x <= objRect.x + objRect.w ||
          KeyboardHandler._areEqualWithinTolerance(curRect.x, objRect.x + objRect.w))
      );
    default:
      break;
  }

  return false;
};

/**
 * Returns true if the two input rectangles are lined up vertically
 *
 * @param {dvt.Rectangle} rect1
 * @param {dvt.Rectangle} rect2
 * @return {Boolean}
 * @private
 */
KeyboardHandler._isVerticallyAligned = function (rect1, rect2) {
  return (
    (rect1.x >= rect2.x && rect1.x <= rect2.x + rect2.w) ||
    (rect2.x >= rect1.x && rect2.x <= rect1.x + rect1.w)
  );
};

/**
 * Returns true if the two input rectangles are lined up horizontally
 *
 * @param {dvt.Rectangle} rect1
 * @param {dvt.Rectangle} rect2
 * @return {Boolean}
 * @private
 */
KeyboardHandler._isHorizontallyAligned = function (rect1, rect2) {
  return (
    (rect1.y >= rect2.y && rect1.y <= rect2.y + rect2.h) ||
    (rect2.y >= rect1.y && rect2.y <= rect1.y + rect1.h)
  );
};

/**
 * Returns the distance between the centers of the keyboard bounding boxes of the input DvtKeyboardNavigables.
 * Distance is multiplied by a penalty factor if the centers are too far off the vertical (in the case of up and down)
 * or horizontal (for left and right)
 *
 * @param {DvtKeyboardNavigable} object
 * @param {DvtKeyboardNavigable} current
 * @param {Number} keycode
 * @return {Number}
 * @private
 */
KeyboardHandler._calcDistanceAngleWeighted = function (object, current, keycode) {
  // Variables used for calculating penalties when calculating distances between two DvtKeyboardNavigables
  var optimalAngle1 = (15 / 180) * Math.PI;
  var optimalAngle2 = (40 / 180) * Math.PI;
  var suboptimalAnglePenalty1 = 2; // multiplier to the distance
  var suboptimalAnglePenalty2 = 6; // multiplier to the distance

  var objectBB = object.getKeyboardBoundingBox();
  var objCenterX = objectBB.x + objectBB.w / 2;
  var objCenterY = objectBB.y + objectBB.h / 2;

  var currentBB = current.getKeyboardBoundingBox();
  var curCenterX = currentBB.x + currentBB.w / 2;
  var curCenterY = currentBB.y + currentBB.h / 2;

  var x_dist = Math.abs(objCenterX - curCenterX);
  var y_dist = Math.abs(objCenterY - curCenterY);

  var angle = Math.atan2(y_dist, x_dist);

  var distance = Math.sqrt(x_dist * x_dist + y_dist * y_dist);

  // Angle penalty based on direction
  if (
    (angle > optimalAngle1 &&
      (keycode == KeyboardEvent.RIGHT_ARROW || keycode == KeyboardEvent.LEFT_ARROW)) ||
    (angle < DvtMath.HALF_PI - optimalAngle1 &&
      (keycode == KeyboardEvent.UP_ARROW || keycode == KeyboardEvent.DOWN_ARROW))
  ) {
    if (
      (angle > optimalAngle2 &&
        (keycode == KeyboardEvent.RIGHT_ARROW || keycode == KeyboardEvent.LEFT_ARROW)) ||
      (angle < DvtMath.HALF_PI - optimalAngle2 &&
        (keycode == KeyboardEvent.UP_ARROW || keycode == KeyboardEvent.DOWN_ARROW))
    ) {
      distance *= suboptimalAnglePenalty2;
    } else {
      distance *= suboptimalAnglePenalty1;
    }
  }

  return distance;
};

/**
 * Determine if a point is valid based on the direction
 * @param {DvtKeyboardNavigable} object
 * @param {DvtKeyboardNavigable} current
 * @param {Number} keycode
 * @return {Boolean}
 * @private
 */
KeyboardHandler._isValidDestination = function (object, current, keycode) {
  var objBB = object.getKeyboardBoundingBox();
  var curBB = current.getKeyboardBoundingBox();

  switch (keycode) {
    case KeyboardEvent.UP_ARROW:
      return objBB.y < curBB.y || KeyboardHandler._areEqualWithinTolerance(objBB.y, curBB.y);
    case KeyboardEvent.DOWN_ARROW:
      return objBB.y > curBB.y || KeyboardHandler._areEqualWithinTolerance(objBB.y, curBB.y);
    case KeyboardEvent.RIGHT_ARROW:
      return objBB.x > curBB.x || KeyboardHandler._areEqualWithinTolerance(objBB.x, curBB.x);
    case KeyboardEvent.LEFT_ARROW:
      return objBB.x < curBB.x || KeyboardHandler._areEqualWithinTolerance(objBB.x, curBB.x);
    default:
      break;
  }
  return true;
};

/**
 * Utility method to check if two numbers are equal, within a small tolerance. Used to account for small rounding
 * errors
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean} true if the numbers are within 0.0000001 of each other
 * @private
 */
KeyboardHandler._areEqualWithinTolerance = function (a, b) {
  return Math.abs(a - b) <= 0.0000001;
};

/**
 * Handler used for marquee operations.
 * @class
 * @constructor
 * @param {dvt.Container} container Marquee container.
 * @param {Rectangle} marqueeBounds The area in which the marquee can be initiated and drawn.
 * @param {Rectangle} glassPaneBounds The area that will be covered by the glass pane when the marquee is active.
 * @param {dvt.Fill} fill The marquee rect fill
 * @param {dvt.Stroke} stroke The marquee rect stroke
 * @param {boolean=} allowHorizResize Whether horizontal resize is allowed. Defaults to true.
 * @param {boolean=} allowVertResize Whether vertical resize is allowed. Defaults to true.
 * @param {Rectangle=} horizResizeBounds The bounds for initiating a marquee that only resizes horizontally.
 * @param {Rectangle=} vertResizeBounds The bounds for initiating a marquee that only resizes vertically.
 */
const MarqueeHandler = function (
  container,
  marqueeBounds,
  glassPaneBounds,
  fill,
  stroke,
  allowHorizResize,
  allowVertResize,
  horizResizeBounds,
  vertResizeBounds
) {
  this.Init(
    container,
    marqueeBounds,
    glassPaneBounds,
    fill,
    stroke,
    allowHorizResize,
    allowVertResize,
    horizResizeBounds,
    vertResizeBounds
  );
};

Obj.createSubclass(MarqueeHandler, Obj);

/**
 * @param {dvt.Container} container Marquee container.
 * @param {Rectangle} marqueeBounds The area in which the marquee can be initiated and drawn.
 * @param {Rectangle} glassPaneBounds The area that will be covered by the glass pane when the marquee is active.
 * @param {dvt.Fill} fill The marquee rect fill
 * @param {dvt.Stroke} stroke The marquee rect stroke
 * @param {boolean=} allowHorizResize Whether horizontal resize is allowed. Defaults to true.
 * @param {boolean=} allowVertResize Whether vertical resize is allowed. Defaults to true.
 * @param {Rectangle=} horizResizeBounds The bounds for initiating a marquee that only resizes horizontally.
 * @param {Rectangle=} vertResizeBounds The bounds for initiating a marquee that only resizes vertically.
 */
MarqueeHandler.prototype.Init = function (
  container,
  marqueeBounds,
  glassPaneBounds,
  fill,
  stroke,
  allowHorizResize,
  allowVertResize,
  horizResizeBounds,
  vertResizeBounds
) {
  this._context = container.getCtx();
  this._container = container;
  this._bounds = marqueeBounds;
  this._fill = fill;
  this._stroke = stroke;
  this._strokeWidth = 1;
  this._allowHoriz = allowHorizResize == null ? true : allowHorizResize;
  this._allowVert = allowVertResize == null ? true : allowVertResize;
  this._horizBounds = horizResizeBounds;
  this._vertBounds = vertResizeBounds;

  // Set up the glass pane
  this._glassPane = new Rect(
    this._context,
    glassPaneBounds.x,
    glassPaneBounds.y,
    glassPaneBounds.w,
    glassPaneBounds.h
  );
  this._glassPane.setInvisibleFill();

  // Flags
  this._marqueeOn = false; // whether the marquee has been activated
  this._marqueeDrawn = false; // whether the marquee has been drawn
  this._resizeHoriz = false; // whether the marquee is resizeable horizontally
  this._resizeVert = false; // whether the marquee is resizeable vertically
};

/**
 * Processes drag start.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @param {boolean} ctrlKey Whether the ctrl key is pressed during the event.
 * @return {object}
 */
MarqueeHandler.prototype.processDragStart = function (relPos, ctrlKey) {
  if (!this._marqueeOn) {
    this._origPt = this._container.stageToLocal(relPos); // marquee origin

    // Determine if the marquee is resizeable horizontally and/or vertically:
    // - if origin is inside marqueeBounds, then allow resize in both directions if possible;
    // - if origin is inside vertResizeBounds, then only vert resize is possible;
    // - if origin is inside horizResizeBounds, then only horiz resize is possible;
    // - otherwise, marquee shouldn't be initiated.
    this._resizeHoriz = this._allowHoriz;
    this._resizeVert = this._allowVert;
    if (!this._bounds.containsPoint(this._origPt.x, this._origPt.y)) {
      if (this._vertBounds && this._vertBounds.containsPoint(this._origPt.x, this._origPt.y))
        this._resizeHoriz = false;
      else if (this._horizBounds && this._horizBounds.containsPoint(this._origPt.x, this._origPt.y))
        this._resizeVert = false;
      else return null;
    }

    this._marqueeOn = true;
    this._marquee = null;
    this._marqueeInnerArea = null;
    return this._createMarqueeEvent('start', ctrlKey);
  }

  return null;
};

/**
 * Processes drag move.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @param {boolean} ctrlKey Whether the ctrl key is pressed during the event.
 * @return {object}
 */
MarqueeHandler.prototype.processDragMove = function (relPos, ctrlKey) {
  if (!this._marqueeOn) return null;

  if (!this._marqueeDrawn) {
    this._container.addChild(this._glassPane);

    // Initiate the marquee
    this._marquee = new Rect(
      this._context,
      this._bounds.x,
      this._bounds.y,
      this._bounds.w,
      this._bounds.h
    );
    this._marqueeInnerArea = new Rect(
      this._context,
      this._bounds.x,
      this._bounds.y,
      this._bounds.w,
      this._bounds.h
    );

    // marquee element should not receive pointer events
    this._marquee.getElem().setAttribute('pointer-events', 'none');
    this._marqueeInnerArea.getElem().setAttribute('pointer-events', 'none');

    if (this._resizeHoriz) {
      this._marquee.setX(this._origPt.x);
      this._marquee.setWidth(0);
      this._marqueeInnerArea.setX(this._origPt.x);
      this._marqueeInnerArea.setWidth(0);
    }
    if (this._resizeVert) {
      this._marquee.setY(this._origPt.y);
      this._marquee.setHeight(0);
      this._marqueeInnerArea.setY(this._origPt.y);
      this._marqueeInnerArea.setHeight(0);
    }

    this._marquee.setClassName('oj-dvt-marquee');
    this._marquee.setStyle({ stroke: this._stroke.getColor(), fill: this._fill.getColor() });
    this._marquee.setPixelHinting(true);
    this._glassPane.addChild(this._marquee);

    this._marqueeInnerArea.setClassName('oj-dvt-marquee-inner-area');
    this._marqueeInnerArea.setPixelHinting(true);
    this._glassPane.addChild(this._marqueeInnerArea);

    this._marqueeDrawn = true;
  }

  var newPt = this._container.stageToLocal(relPos);

  // Bound the newPt within the marquee bounds
  newPt.x = Math.max(newPt.x, this._bounds.x);
  newPt.x = Math.min(newPt.x, this._bounds.x + this._bounds.w);
  newPt.y = Math.max(newPt.y, this._bounds.y);
  newPt.y = Math.min(newPt.y, this._bounds.y + this._bounds.h);

  // Update marquee x and w
  if (this._resizeHoriz) {
    var width = Math.abs(newPt.x - this._origPt.x);
    var x = newPt.x < this._origPt.x ? newPt.x : this._origPt.x;
    this._marquee.setWidth(width);
    this._marquee.setX(x);
    var marqueeInnerWidth = width - 2 * this._strokeWidth;
    this._marqueeInnerArea.setWidth(Math.max(0, marqueeInnerWidth));
    this._marqueeInnerArea.setX(x + this._strokeWidth);
  }

  // Update marquee y and h
  if (this._resizeVert) {
    var height = Math.abs(newPt.y - this._origPt.y);
    var y = newPt.y < this._origPt.y ? newPt.y : this._origPt.y;
    this._marquee.setHeight(height);
    this._marquee.setY(y);
    var marqueeInnerHeight = height - 2 * this._strokeWidth;
    this._marqueeInnerArea.setHeight(Math.max(0, marqueeInnerHeight));
    this._marqueeInnerArea.setY(y + this._strokeWidth);
  }

  return this._createMarqueeEvent('move', ctrlKey);
};

/**
 * Processes drag end.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @param {boolean} ctrlKey Whether the ctrl key is pressed during the event.
 * @return {object}
 */
MarqueeHandler.prototype.processDragEnd = function (relPos, ctrlKey) {
  if (this._marqueeOn) {
    this._marqueeOn = false;

    if (this._marqueeDrawn) {
      // Remove the marquee and glass pane
      this._glassPane.removeChild(this._marquee);
      this._glassPane.removeChild(this._marqueeInnerArea);
      this._container.removeChild(this._glassPane);
      this._marqueeDrawn = false;

      return this._createMarqueeEvent('end', ctrlKey);
    }
  }

  return null;
};

/**
 * Processes drag end.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @param {boolean} ctrlKey Whether the ctrl key is pressed during the event.
 * @return {boolean}
 */
MarqueeHandler.prototype.cancelMarquee = function () {
  if (this._marqueeOn) {
    this._marqueeOn = false;

    if (this._marqueeDrawn) {
      // Remove the marquee and glass pane
      this._glassPane.removeChild(this._marquee);
      this._glassPane.removeChild(this._marqueeInnerArea);
      this._container.removeChild(this._glassPane);
      this._marqueeDrawn = false;

      return true;
    }
  }

  return false;
};

/**
 * Creates a marquee event.
 * @param {string} subtype Event subtype.
 * @param {boolean} ctrlKey Whether the ctrl key is pressed during the event.
 * @return {object} The event.
 */
MarqueeHandler.prototype._createMarqueeEvent = function (subtype, ctrlKey) {
  var x = null;
  var y = null;
  var w = null;
  var h = null;

  if (this._resizeHoriz) {
    x = this._marquee ? this._marquee.getX() : this._origPt.x;
    w = this._marquee ? this._marquee.getWidth() : 0;
  }
  if (this._resizeVert) {
    y = this._marquee ? this._marquee.getY() : this._origPt.y;
    h = this._marquee ? this._marquee.getHeight() : 0;
  }

  return new EventFactory.newMarqueeEvent(subtype, x, y, w, h, ctrlKey);
};

/**
 * Returns the appropriate cursor type.
 * @param {dvt.Point} relPos The current cursor position relative to the stage.
 * @return {string} The cursor type.
 */
MarqueeHandler.prototype.getCursor = function (relPos) {
  var pos = this._container.stageToLocal(relPos);
  var withinBounds = this._bounds.containsPoint(pos.x, pos.y);
  var withinVertBounds = this._vertBounds && this._vertBounds.containsPoint(pos.x, pos.y);
  var withinHorizBounds = this._horizBounds && this._horizBounds.containsPoint(pos.x, pos.y);

  if (withinBounds || withinVertBounds || withinHorizBounds) return 'crosshair';
  else return 'inherit';
};

/**
 * Returns the glasspane object. Used in cases on device where we need to check in the current target of a touchMove
 * is the marquee handler's glasspane.
 * @return {Rect} The glasspane rect for this marquee handler.
 */
MarqueeHandler.prototype.getGlassPane = function () {
  return this._glassPane;
};

/**
 * Handler used for pan and zoom operations.
 * @constructor
 * @param {dvt.Container} container Glass pane container.
 * @param {dvt.Rectangle} panZoomBounds The area in which pan/zoom can be initiated.
 * @param {dvt.Rectangle} glassPaneBounds The area that will be covered by the glass pane during pan.
 * @param {number} zoomRate The rate of mouse wheel zoom.
 */
const PanZoomHandler = function (container, panZoomBounds, glassPaneBounds, zoomRate) {
  this.Init(container, panZoomBounds, glassPaneBounds, zoomRate);
};

Obj.createSubclass(PanZoomHandler, Obj);

/**
 * @param {dvt.Container} container Glass pane container.
 * @param {dvt.Rectangle} panZoomBounds The area in which the pan/zoom can be initiated.
 * @param {dvt.Rectangle} glassPaneBounds The area that will be covered by the glass pane when the marquee is active.
 * @param {number} zoomRate The rate of mouse wheel zoom.
 */
PanZoomHandler.prototype.Init = function (container, panZoomBounds, glassPaneBounds, zoomRate) {
  this._context = container.getCtx();
  this._container = container;
  this._bounds = panZoomBounds;
  this._zoomRate = zoomRate;

  // Set up the glass pane
  this._glassPane = new Rect(
    this._context,
    glassPaneBounds.x,
    glassPaneBounds.y,
    glassPaneBounds.w,
    glassPaneBounds.h
  );
  this._glassPane.setInvisibleFill();

  // Flags
  this._panOn = false; // whether the pan has been initiated
  this._glassPaneDrawn = false; // whether the glass pane has been drawn
  this._pinchOn = false; // whether the pinch has been initiated
};

/**
 * Processes drag start.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @return {object}
 */
PanZoomHandler.prototype.processDragStart = function (relPos) {
  if (!this._panOn) {
    this._origPt = this._container.stageToLocal(relPos); // drag origin
    this._lastPt = this._origPt;

    // Ignore if the start point is outside the pan/zoom bounds
    if (!this._bounds.containsPoint(this._origPt.x, this._origPt.y)) return null;

    this._panOn = true;

    return EventFactory.newPanZoomEvent('panStart', 0, 0, 0, 0, 0, 0, 0, 0);
  }

  return null;
};

/**
 * Processes drag move.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @return {object}
 */
PanZoomHandler.prototype.processDragMove = function (relPos) {
  if (!this._panOn) return null;

  if (!this._glassPaneDrawn) {
    this._container.addChild(this._glassPane);
    this._glassPaneDrawn = true;
  }

  var newPt = this._container.stageToLocal(relPos);
  var deltaX = newPt.x - this._lastPt.x;
  var deltaY = newPt.y - this._lastPt.y;
  var totalDeltaX = newPt.x - this._origPt.x;
  var totalDeltaY = newPt.y - this._origPt.y;
  this._lastPt = newPt;

  return EventFactory.newPanZoomEvent(
    'panMove',
    -deltaX,
    -deltaX,
    -deltaY,
    -deltaY,
    -totalDeltaX,
    -totalDeltaX,
    -totalDeltaY,
    -totalDeltaY
  );
};

/**
 * Processes drag end.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @return {object}
 */
PanZoomHandler.prototype.processDragEnd = function (relPos) {
  if (this._panOn) {
    this._panOn = false;

    if (this._glassPaneDrawn) {
      // Remove the glass pane
      this._container.removeChild(this._glassPane);
      this._glassPaneDrawn = false;

      var newPt = relPos ? this._container.stageToLocal(relPos) : this._lastPt;
      var deltaX = newPt.x - this._lastPt.x;
      var deltaY = newPt.y - this._lastPt.y;
      var totalDeltaX = newPt.x - this._origPt.x;
      var totalDeltaY = newPt.y - this._origPt.y;
      this._lastPt = null;

      return EventFactory.newPanZoomEvent(
        'panEnd',
        -deltaX,
        -deltaX,
        -deltaY,
        -deltaY,
        -totalDeltaX,
        -totalDeltaX,
        -totalDeltaY,
        -totalDeltaY
      );
    }
  }

  return null;
};

/**
 * Processes mouse wheel.
 * @param {dvt.Point} relPos The event position relative to the stage.
 * @param {number} delta The mouse wheel delta.
 * @return {object}
 */
PanZoomHandler.prototype.processMouseWheel = function (relPos, delta) {
  // Ignore if the cursor is outside the pan/zoom bounds
  var startPt = this._container.stageToLocal(relPos);
  if (!this._bounds.containsPoint(startPt.x, startPt.y)) return null;

  delta *= this._zoomRate;

  // Compute the deltas. It should maintain the cursor pointing at the same item.
  var deltaXMin = delta * (startPt.x - this._bounds.x);
  var deltaXMax = -delta * (this._bounds.x + this._bounds.w - startPt.x);
  var deltaYMin = delta * (startPt.y - this._bounds.y);
  var deltaYMax = -delta * (this._bounds.y + this._bounds.h - startPt.y);

  return EventFactory.newPanZoomEvent(
    'zoom',
    deltaXMin,
    deltaXMax,
    deltaYMin,
    deltaYMax,
    deltaXMin,
    deltaXMax,
    deltaYMin,
    deltaYMax
  );
};

/**
 * Processes pinch start.
 * @param {dvt.Point} relPos1 The position of the first finger relative to the stage.
 * @param {dvt.Point} relPos2 The position of the second finger relative to the stage.
 * @return {object}
 */
PanZoomHandler.prototype.processPinchStart = function (relPos1, relPos2) {
  if (!this._pinchOn) {
    // Save pinch origin
    this._origPt1 = this._container.stageToLocal(relPos1);
    this._origPt2 = this._container.stageToLocal(relPos2);
    this._lastPt1 = this._origPt1;
    this._lastPt2 = this._origPt2;

    // Ignore if the start points are outside the pan/zoom bounds
    if (
      !this._bounds.containsPoint(this._origPt1.x, this._origPt1.y) ||
      !this._bounds.containsPoint(this._origPt2.x, this._origPt2.y)
    )
      return null;

    this._pinchOn = true;

    return EventFactory.newPanZoomEvent('pinchStart', 0, 0, 0, 0, 0, 0, 0, 0);
  }

  return null;
};

/**
 * Processes pinch move.
 * @param {dvt.Point} relPos1 The position of the first finger relative to the stage.
 * @param {dvt.Point} relPos2 The position of the second finger relative to the stage.
 * @return {object}
 */
PanZoomHandler.prototype.processPinchMove = function (relPos1, relPos2) {
  if (!this._pinchOn) return null;

  var newPt1 = this._container.stageToLocal(relPos1);
  var newPt2 = this._container.stageToLocal(relPos2);

  var deltas = this._computePinchDeltas(newPt1, newPt2, this._lastPt1, this._lastPt2);
  var totalDeltas = this._computePinchDeltas(newPt1, newPt2, this._origPt1, this._origPt2);

  this._lastPt1 = newPt1;
  this._lastPt2 = newPt2;

  return EventFactory.newPanZoomEvent(
    'pinchMove',
    deltas.dxMin,
    deltas.dxMax,
    deltas.dyMin,
    deltas.dyMax,
    totalDeltas.dxMin,
    totalDeltas.dxMax,
    totalDeltas.dyMin,
    totalDeltas.dyMax
  );
};

/**
 * Processes pinch end.
 * @return {object}
 */
PanZoomHandler.prototype.processPinchEnd = function () {
  if (this._pinchOn) {
    this._pinchOn = false;
    var totalDeltas = this._computePinchDeltas(
      this._lastPt1,
      this._lastPt2,
      this._origPt1,
      this._origPt2
    );

    this._lastPt1 = null;
    this._lastPt2 = null;

    return EventFactory.newPanZoomEvent(
      'pinchEnd',
      0,
      0,
      0,
      0,
      totalDeltas.dxMin,
      totalDeltas.dxMax,
      totalDeltas.dyMin,
      totalDeltas.dyMax
    );
  }

  return null;
};

/**
 * Computes how much the bounds should change based on the two finger movements.
 * @param {dvt.Point} pos1 Current position of the first finger.
 * @param {dvt.Point} pos2 Current position of the second finger.
 * @param {dvt.Point} prevPos1 Previous position of the first finger.
 * @param {dvt.Point} prevPos2 Previous position of the second finger.
 * @return {object} An object containing deltas for the bounds: dxMin, dxMax, dyMin, and dyMax.
 * @private
 */
PanZoomHandler.prototype._computePinchDeltas = function (pos1, pos2, prevPos1, prevPos2) {
  // Calculate the ratio of the current inter-finger distance to the previous
  var dx = Math.abs(pos1.x - pos2.x);
  var dy = Math.abs(pos1.y - pos2.y);
  var prevDx = Math.abs(prevPos1.x - prevPos2.x);
  var prevDy = Math.abs(prevPos1.y - prevPos2.y);
  // The check dx > dy/2 is to make it easier to zoom in y-direction alone. Otherwise, one might pinch in y-direction,
  // but the slight finger movement in the x-direction will cause the x-axis to zoom as well.
  var zoomX = dx > dy / 2 ? prevDx / dx : 1;
  var zoomY = dy > dx / 2 ? prevDy / dy : 1;

  // Calculate the distance the center of the two fingers has moved
  var cx = (pos1.x + pos2.x) / 2;
  var cy = (pos1.y + pos2.y) / 2;
  var prevCx = (prevPos1.x + prevPos2.x) / 2;
  var prevCy = (prevPos1.y + prevPos2.y) / 2;
  var dcx = cx - prevCx;
  var dcy = cy - prevCy;

  // Perform a zoom
  var dxMin = (1 - zoomX) * (cx - this._bounds.x);
  var dxMax = (zoomX - 1) * (this._bounds.x + this._bounds.w - cx);
  var dyMin = (1 - zoomY) * (cy - this._bounds.y);
  var dyMax = (zoomY - 1) * (this._bounds.y + this._bounds.h - cy);

  // Perform a scroll
  dxMin -= dcx;
  dxMax -= dcx;
  dyMin -= dcy;
  dyMax -= dcy;

  return { dxMin: dxMin, dxMax: dxMax, dyMin: dyMin, dyMax: dyMax };
};

/**
 * Zooms by the specified amount.
 * @param {number} dz A number specifying the zoom ratio, e.g. dz = 2 means zoom in by 200%.
 * @return {object}
 */
PanZoomHandler.prototype.zoomBy = function (dz) {
  var shiftRatio = (1 / dz - 1) / 2;
  var deltaXMin = -shiftRatio * this._bounds.w;
  var deltaXMax = shiftRatio * this._bounds.w;
  var deltaYMin = -shiftRatio * this._bounds.h;
  var deltaYMax = shiftRatio * this._bounds.h;

  return EventFactory.newPanZoomEvent(
    'zoom',
    deltaXMin,
    deltaXMax,
    deltaYMin,
    deltaYMax,
    deltaXMin,
    deltaXMax,
    deltaYMin,
    deltaYMax
  );
};

/**
 * Pans by the specified amount.
 * @param {number} dx A number from specifying the pan ratio in the x direction, e.g. dx = 0.5 means pan end by 50%.
 * @param {number} dy A number from specifying the pan ratio in the y direction, e.g. dy = 0.5 means pan down by 50%.
 * @return {object}
 */
PanZoomHandler.prototype.panBy = function (dx, dy) {
  var deltaX = dx * this._bounds.w * (Agent.isRightToLeft(this._context) ? -1 : 1);
  var deltaY = dy * this._bounds.h;

  return EventFactory.newPanZoomEvent(
    'panEnd',
    deltaX,
    deltaX,
    deltaY,
    deltaY,
    deltaX,
    deltaX,
    deltaY,
    deltaY
  );
};

/**
 * Returns the appropriate cursor type.
 * @param {dvt.Point=} relPos The current cursor position relative to the stage.
 * @return {string} The cursor type.
 */
PanZoomHandler.prototype.getCursor = function (relPos) {
  if (relPos == null || this.isWithinBounds(relPos)) {
    return this._panOn ? ToolkitUtils.getGrabbingCursor() : ToolkitUtils.getGrabCursor();
  } else return 'inherit';
};

/**
 * Returns whether the point is within the bounds of the pan-zoom handler.
 * @param {dvt.Point} relPos The current cursor position relative to the stage.
 * @return {boolean}
 */
PanZoomHandler.prototype.isWithinBounds = function (relPos) {
  var pos = this._container.stageToLocal(relPos);
  return this._bounds.containsPoint(pos.x, pos.y);
};

export { Agent, AnimFadeIn, AnimFadeOut, AnimMoveBy, AnimMoveTo, AnimPopIn, AnimScaleFadeIn, AnimScaleTo, Animator, AriaUtils, Array2D, ArrayUtils, Automation, BackgroundMultilineText, BackgroundOutputText, BaseAnimation, BaseComponent, BaseComponentCache, BaseComponentDefaults, BaseEvent, BlackBoxAnimationHandler, Button, CSSGradient, CSSStyle, Cache, CategoryRolloverHandler, Circle, ClipPath, ColorUtils, CombinedAnimMoveBy, ComponentTouchEvent, Container, Context, CustomAnimation, CustomDatatipPeer, DataAnimationHandler, Dimension, Displayable, DisplayableUtils, DomEventFactory, DragAndDropUtils, DragSource, Easing, EventFactory, EventManager, GradientFill, GradientParser, HtmlKeyboardListenerUtils, HtmlTooltipManager, IconButton, Image, ImageLoader, ImageMarker, JsonUtils, KeyboardEvent, KeyboardFocusEffect, KeyboardHandler, LayoutUtils, Line, LinearGradientFill, Map2D, MarqueeHandler, Mask, DvtMath as Math, Matrix, MouseEvent, MultilineText, Obj, OutputText, PanZoomHandler, ParallelPlayable, Path, PathUtils, PatternFill, PixelMap, Playable, Point, Polygon, PolygonUtils, Polyline, Rect, Rectangle, ResourceUtils, SelectionEffectUtils, SelectionHandler, SequentialPlayable, Shadow, Shape, SimpleMarker, SimpleObjPeer, SimpleScrollableContainer, SimpleScrollbar, SolidFill, Stroke, SvgDocumentUtils, SvgShapeUtils, TextObjPeer, TextUtils, Timer, ToolkitUtils, Touch, TouchEvent, TouchManager, TransientButton, Use };
