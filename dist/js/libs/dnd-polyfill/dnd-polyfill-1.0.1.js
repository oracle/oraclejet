/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

(function() {

/* exported localRequire */
function localRequire() {
  'use strict';

  var _moduleDefs = {};

  function _define(name, deps, module) {
    _moduleDefs[name] = {
      deps: deps.map(_pathToName),
      module: module,
      resolve: _resolve
    };
  }

  function _require(deps, callback) {
    var args = _resolveDeps(deps);
    callback.apply(null, args);
  }

  function _pathToName(path) {
    return (path.indexOf('./') === 0) ? path.substr(2) : path;
  }

  function _resolve() {
    /* jshint validthis: true */
    if (!this._resolvedModule) {
      var args = _resolveDeps(this.deps);
      var module = this.module;
      this._resolvedModule =
        (typeof module === 'function') ?
          module.apply(null, args) :
          module;
    }

    return this._resolvedModule;  
  }

  function _resolveDeps(deps) {
    return deps.map(function(dep) {
      var moduleDef = _moduleDefs[dep];
      return moduleDef.resolve();
    });
  }

  return {
    define: _define,
    require: _require
  };
}

var localRequireModule = localRequire();
var define = localRequireModule.define;
var require = localRequireModule.require;

define('dataTransfer',[],function() {
  'use strict';

  // This is just a short-term DataTransfer implementation to get
  // things up and running.  The real implementation must:
  // - Implement the read/write, read-only and protected modes.
  // - Delegate get/setData to the DataTransferItemList.

  function DataTransfer(dragImageCallback, dataModeCallback) {

    var _data = {};
    var _dropEffect = "none";
    var _effectAllowed = "uninitialized";
    var _getDataMode = dataModeCallback || function(){return "readwrite";};

    var _DROP_EFFECTS = [
      "none",
      "copy",
      "link",
      "move"
    ];

    var _EFFECTS_ALLOWED = [
      "uninitialized",
      "none",
      "copy",
      "copylink",
      "copymove",
      "link",
      "linkmove",
      "move",
      "all"
    ];

    // Normally this.files is populated when users drag files from desktop
    // into the browser.  Since the polyfill is activated only when the
    // drag starts from the browser, this property is always empty.
    this.files = {};

    // this.items should be a DataTransferItemList object, which is not
    // yet supported by IE11 and FF38.
    this.items = {};

    function _getData(format) {
      // Data cannot be retrieved in protected mode
      if (_getDataMode() !== "protected") {
        var normalizedFormat = _normalizeFormat(format);

        return (normalizedFormat && _data.hasOwnProperty(normalizedFormat)) ?
                 _data[normalizedFormat] :
                 null;
      }

      // W3C spec says that getData should return the empty string in protected
      // mode, though only IE 11 and Firefox 40 implement this.  In Chrome 44,
      // getData returns the actual data in all events.
      return "";
    }

    function _setData(format, data) {
      // Data can only be changed in read/write mode
      if (_getDataMode() === "readwrite") {
        var normalizedFormat = _normalizeFormat(format);

        if (normalizedFormat) {
          // Native implementations convert non-string data to string
          _data[normalizedFormat] = data.toString();
        }
      }
    }

    function _clearData(format) {
      // Data can only be changed in read/write mode
      if (_getDataMode() === "readwrite") {
        var normalizedFormat = _normalizeFormat(format);

        if (!normalizedFormat) {
          _data = {};
        } else if (_data.hasOwnProperty(normalizedFormat)) {
          delete _data[normalizedFormat];
        }
      }
    }

    function _normalizeFormat(format) {
      // Native implementations convert non-string format value to string
      return (format) ? format.toString().toLowerCase() : null;
    }

    function _setDragImage(element, x, y) {
      if (dragImageCallback) {
        dragImageCallback(element, x, y);
      }
    }

    function _getTypes() {
      var types = Object.keys(_data);

      // Add DOMStringList interface methods
      types.item = function(index) {
        return (index >= 0 && index < types.length) ? types[index] : null;
      };
      types.contains = function(str) {
        return types.indexOf(str) >= 0;
      };

      return types;
    }

    function _getDropEffect() {
      return _dropEffect;
    }

    function _setDropEffect(value) {
      // W3C spec says that the attribute must ignore any attempts to set it to
      // an invalid value
      value = value.toLowerCase();
      if (_DROP_EFFECTS.indexOf(value) >= 0) {
        _dropEffect = value;
      }
    }

    function _getEffectAllowed() {
      return _effectAllowed;
    }

    function _setEffectAllowed(value) {
      // W3C spec says that the attribute must ignore any attempts to set it to
      // an invalid value
      value = value.toLowerCase();
      if (_EFFECTS_ALLOWED.indexOf(value) >= 0) {
        _effectAllowed = value;
      }
    }

    this.getData = _getData;
    this.setData = _setData;
    this.clearData = _clearData;
    this.setDragImage = _setDragImage;

    Object.defineProperty(this, 'types', {
      get: _getTypes
    });

    Object.defineProperty(this, "dropEffect", {
      get: _getDropEffect,
      set: _setDropEffect
    });

    Object.defineProperty(this, "effectAllowed", {
      get: _getEffectAllowed,
      set: _setEffectAllowed
    });
  }

  return DataTransfer;
});

define('dragImage',[],function() {
  'use strict';

  function DragImage(element, x, y) {

    var _imageElem = _createDragImageElement(element);
    var _offsetX = x;
    var _offsetY = y;
    var _scrollLeft = element.scrollLeft;
    var _scrollTop = element.scrollTop;

    // Find the maximum zIndex for the children of an element.  If an immediate
    // child doesn't form a stacking context, we have to visit descendants until
    // a stacking context is found.
    function _findMaxChildZIndex(element) {
      var zIndex = 0;

      if (element.children) {
        for (var i = 0; i < element.children.length; i++) {
          var childElem = element.children[i];
          var style = window.getComputedStyle(childElem);
          if (style.position !== "static" && style.zIndex !== "auto" &&
              !isNaN(style.zIndex))
          {
             zIndex = Math.max(zIndex, style.zIndex);
          } else {
             zIndex = Math.max(zIndex, _findMaxChildZIndex(childElem));
          }
        }
      }

      return zIndex;
    }

    function _createDragImageElement(element) {
      var attached = (element.parentNode != null);
      var stylePosition = element.style.position;
      var styleTop = element.style.top;

      // If the element is not attached to the DOM, attach it temporarily so 
      // that we can get the offset size.
      if (!attached) {
        element.style.position = "fixed";
        element.style.top = "10000px";
        document.body.appendChild(element);
      }

      var imageElem = element.cloneNode(true);
      imageElem.id = element.id + "_dragimage";
      imageElem.style.opacity = 0.7;
      imageElem.style.position = "fixed";
      imageElem.style.width = element.offsetWidth + "px";
      imageElem.style.height = element.offsetHeight + "px";

      // Set zIndex so that the drag image won't get covered by other elements
      imageElem.style.zIndex = _findMaxChildZIndex(document.body) + 1;

      // Hide the drag image initially to avoid flicker.  dragController
      // will move and show it at the right position on the first drag. 
      imageElem.style.visibility = "hidden";

      if (!attached) {
        document.body.removeChild(element);
        element.style.position = stylePosition;
        element.style.top = styleTop;
      }

      return imageElem;
    }

    function _start() {
      document.body.appendChild(_imageElem);

      // Scroll position is not copied by cloneNode. It can only be set after
      // the element is attached to the DOM tree, so we have to do it here.
      _imageElem.scrollLeft = _scrollLeft;
      _imageElem.scrollTop = _scrollTop;
    }

    function _end() {
      document.body.removeChild(_imageElem);
      _imageElem = null;
    }

    function _move(clientX, clientY) {
      // Compensate for the scroll position or else the image may be too high
      _imageElem.style.left = (clientX - _offsetX + _scrollLeft) + "px";
      _imageElem.style.top = (clientY - _offsetY + _scrollTop) + "px";
    }

    function _show(doShow) {
      _imageElem.style.visibility = doShow ? "visible" : "hidden";
    }

    this.start = _start;
    this.end = _end;
    this.move = _move;
    this.show = _show;
  }

  return DragImage;
});

define('eventDispatcher',[],function() {
  'use strict';

  var _EVENT_PROPS = {
    dragstart: {"bubbles":true, "cancelable":true},
    drag:      {"bubbles":true, "cancelable":true},
    dragend:   {"bubbles":true, "cancelable":false},
    dragenter: {"bubbles":true, "cancelable":true},
    dragover:  {"bubbles":true, "cancelable":true},
    dragleave: {"bubbles":true, "cancelable":false},
    drop:      {"bubbles":true, "cancelable":true}
  };

  /**
   * Create synthetic DnD event and dispatch it to a target
   *
   * @param {string} type the event type
   * @param {Object} props properties from native mouse or touch event to use
   *        in the synthetic DnD event
   * @param {DataTransfer} dataTransfer the data being dragged
   * return (boolean) return true if Event.preventDefault has been called by an
   *        event listener; false otherwise
   */
  function _dispatch(type, props, dataTransfer) {

    var event = _createAndInitEvent(type, props, dataTransfer);

    // Dispatch the event and return a boolean that indicates whether
    // Event.preventDefault has been called.  We can't rely on the
    // defaultPrevented property on the event since some browsers (e.g. IE)
    // don't set it.
    return !props.target.dispatchEvent(event);
  }

  function _createAndInitEvent(type, props, dataTransfer) {

    // DragEvent inheritance:
    // DragEvent -> MouseEvent -> UIEvent -> Event
    //
    // The reasons we have to create the synthetic drag event as Event object
    // instead of one of the descendant types:
    // IE doesn't allow the dataTransfer property on DragEvent to be set to
    // user-defined object.
    // PhantomJS (for testing) doesn't allow the dataTransfer property on
    // MouseEvent to be set.
    // Creating drag event as MouseEvent doesn't work on mobile platforms. The
    // event is never dispatched.
    // iOS 8 doesn't allow the pageX and pageY properties, which are supposed to 
    // be read-only, to be set on UIEvent.
    //
    // We create Event instead and set the missing properties ourselves.
    //
    // Using document.createEvent to create the event works on all platforms
    // for now, but it's being deprecated.  IE 11 and iOS 8 doesn't support the 
    // newer Event constructor pattern yet, so we use it only if available.
    //
    var event;

    if (window.Event && typeof window.Event === 'function') {
      var eventInit = {'bubbles': _EVENT_PROPS[type].bubbles,
                       'cancelable': _EVENT_PROPS[type].cancelable};
      event = new window.Event(type, eventInit); 
    } else {
      event = document.createEvent("Event");
      event.initEvent(
        type,
        _EVENT_PROPS[type].bubbles,
        _EVENT_PROPS[type].cancelable);
    }

    // Add missing UIEvent properties to the event
    event.view = document.defaultView;
    event.detail = 0;

    // Add missing MouseEvent properties to the event
    _setMouseEventProps(event, props);
    
    // Add missing MouseEvent method to the event
    event.getModifierState = function(keyArg) {
      return _getModifierStateFromProps(keyArg, props);
    };

    // Add missing DragEvent property to the event
    event.dataTransfer = dataTransfer;

    // Marked as pseudo event so that internally we can differentiate between real DOM
    // event vs. event created by this class
    event.__isPseudo = true;

    return event;
  }

  function _getModifierStateFromProps(keyArg, props) {
    if (keyArg === "Alt") {
      return props.altKey;
    } else if (keyArg === "Control") {
      return props.ctrlKey;
    } else if (keyArg === "Meta") {
      return props.metaKey;
    } else if (keyArg === "Shift") {
      return props.shiftKey;
    }

    return false;
  }
  
  function _toNumber(prop) {
    return prop ? prop : 0;
  }

  function _toBoolean(prop) {
    return prop ? prop : false;
  }

  // Set native mouse/touch event properties into synthetic DnD event
  function _setMouseEventProps(event, props) {
    var rect = props.target.getBoundingClientRect();

    event.screenX = _toNumber(props.screenX);
    event.screenY = _toNumber(props.screenY);
    event.clientX = _toNumber(props.clientX);
    event.clientY = _toNumber(props.clientY);

    // offsetX and offsetY are relative to target. We need to recompute
    // them based on target since we fire synthetic DnD events to
    // different targets from one mouse/touch event.
    event.offsetX = props.clientX - rect.left;
    event.offsetY = props.clientY - rect.top;

    event.pageX = _toNumber(props.pageX);
    event.pageY = _toNumber(props.pageY);
    event.altKey = _toBoolean(props.altKey);
    event.ctrlKey = _toBoolean(props.ctrlKey);
    event.metaKey = _toBoolean(props.metaKey);
    event.shiftKey = _toBoolean(props.shiftKey);
    event.button = _toNumber(props.button);
    event.buttons = _toNumber(props.buttons);
    event.relatedTarget = props.relatedTarget ? props.relatedTarget : null;
  }

  // Extract native mouse event properties
  function _getMouseEventProps(event) {
    return {
      screenX: event.screenX,
      screenY: event.screenY,
      clientX: event.clientX,
      clientY: event.clientY,

      // Event though offsetX and offsetY is on native mouse event, we will
      // need to recompute them for different DnD targets, so don't bother
      // extracting them from the native event.

      pageX: event.pageX,
      pageY: event.pageY,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      button: event.button,
      buttons: event.buttons
    };
  }

  return {
    dispatch: _dispatch,
    getMouseEventProps: _getMouseEventProps
  };
});

define('autoScroller',[],function() {
  'use strict';

  // Check if we need to do scrolling and return the element scrolled
  function _checkAutoScroll(topElem, clientX, clientY) {
    var scrollElem = topElem;

    while (scrollElem != null && !_autoScroll(scrollElem, clientX, clientY)) {
      // Use parentNode instead of parentElement because on IE, parentElement
      // is undefined for svg elements.
      scrollElem = scrollElem.parentNode;
    }

    return scrollElem;
  }

  // Check if we need to auto-scroll the element that the pointer is on.
  //
  // @param scrollElem the element to be scrolled
  // @param clientX x coordinate of the pointer relative to window client area
  // @param clientY y coordinate of the pointer relative to window client area
  // return true if the element is scrolled; false otherwise.
  //
  function _autoScroll(scrollElem, clientX, clientY) {

    if (!_isScrollable(scrollElem)) {
      return false;
    }

    var scrollLeft = scrollElem.scrollLeft;
    var scrollTop = scrollElem.scrollTop;
    var leftChange;
    var topChange;

    if (scrollElem === document.documentElement) {
      // The correct values of scrollTop and scrollLeft for document
      // may be on body (e.g. Chrome) or documentElement (e.g. IE and FF)
      scrollLeft = scrollLeft || document.body.scrollLeft;
      scrollTop = scrollTop || document.body.scrollTop;
    } else {
      // clientX and clientY are relative to the window.
      // Adjust them to be relative to the scrolling element.
      var rect = scrollElem.getBoundingClientRect();
      clientX -= Math.round(rect.left);
      clientY -= Math.round(rect.top);
    }

    leftChange = _computeScrollChange(scrollElem.clientWidth,
                                      scrollElem.scrollWidth,
                                      clientX,
                                      scrollLeft);

    topChange = _computeScrollChange(scrollElem.clientHeight,
                                     scrollElem.scrollHeight,
                                     clientY,
                                     scrollTop);

    if (leftChange || topChange) {
      _scrollElementTo(scrollElem, scrollLeft + leftChange, scrollTop + topChange);

      // Return true to indicate that we scrolled the element
      return true;
    }

    // Return false if no scrolling occurred
    return false;
  }

  function _isScrollable(elem) {
    // Special case for document.  Some browsers use documentElement to control
    // scrolling while others use body.  We treat them as one and handle
    // it when we get to documentElement.
    if (elem === document.body) {
      return false;
    } else if (elem === document.documentElement) {
      return true;
    }

    if (elem.nodeType === 1) {
      var computedStyle = window.getComputedStyle(elem, null);

      return ((computedStyle.overflow === "auto" || 
               computedStyle.overflow === "scroll") &&
              (elem.scrollWidth > elem.clientWidth ||
               elem.scrollHeight > elem.clientHeight));
    }
    
    return false;
  }

  // Return the delta to change scrollLeft or scrollTop of an element by, if
  // the pointer (mouse or touch) is within a threshold of the elemnt's client
  // area.
  //
  // @param clientMax the element's clientWidth or clientHeight
  // @param scrollMax the element's scrollWidth or scrollHeight
  // @param clientPos the current pointer's X or Y position relative to element
  // @param oldScroll the element's current scrollLeft or scrollTop
  // return the delta to change the element's scrollLeft or scrollTop
  //
  function _computeScrollChange(clientMax, scrollMax, clientPos, oldScroll) {
    var threshold = 12;
    var step = 15;

    if (clientPos > (clientMax - threshold) && clientPos < clientMax) {
      // the pointer is within a threshold from the right or bottom edge
      if ((oldScroll + clientMax) < scrollMax) {
        // the scrollbar is not already at the end, scroll forward
        return step;
      }
    } else if (clientPos >= 0 && clientPos < threshold) {
      // the pointer is within a threshold from the left or top edge
      if (oldScroll > 0) {
        // the scrollbar is not already at the beginning, scroll backward
        return -(Math.min(oldScroll, step));
      }
    }

    return 0;
  }

  function _scrollElementTo(elem, x, y) {
    elem.scrollLeft = x;
    elem.scrollTop = y;

    // Some browsers (e.g. Chrome) may require setting scrollLeft and
    // scrollTop on the body instead of documentElement
    if (elem === document.documentElement) {
      document.body.scrollLeft = x;
      document.body.scrollTop = y;
    }
  }

  return {
    checkAutoScroll: _checkAutoScroll
  };
});

define('dragController',['./dataTransfer', './dragImage', './eventDispatcher', './autoScroller'],
       function(DataTransfer, DragImage, EventDispatcher, AutoScroller) {
  'use strict';

  /**
   * The DragController orchestrates the drag.  This piece of the
   * drag and drop subsystem contains platform-agnostic drag management
   * code that is common across platforms/browsers.
   */
  function DragController() {

    var _dataTransfer;
    var _dragImage;
    var _dragSource;
    var _dragOverElem;
    var _lastElemPointX = -1;
    var _lastElemPointY = -1;
    var _currentDragOp = "none";
    var _bodyCursor;
    var _dataMode;
    var _dragImageOffset;

    /**
     * Called by platform-specific driver to notify the controller that
     * a drag start gesture has been detected.  In response, the controller
     * fires a 'dragstart' event.
     * @param {Element} dragSource the 'draggable' element which the user
     *        is attempting to drag.
     * @param {Function} dragStartedCallback a callback that is invoked
     *        after the dragstart event is delivered.  The callback takes
     *        the event object as an argument and returns a boolean indicating
     *        whether the polyfill should handle the drag and drop operation.
     * @param {Object} inputProps the input event properties including
     *        coordinates (clientX and clientY) of the pointer and keyboard
     *        states when the drag starts.
     * return {Object} return an object containing the following properties:
     *        dragState: string indicates the state of the 'dragstart' event with
     *                  the following values:
     *                  'started' - The drag has been started by the polyfill.
     *                  'canceled' - The drag was canceled.
     *                  The property is undefined when the drag was neither 
     *                  canceled nor started by the polyfill.
     *        dataTrasnfer: the DataTransfer for this drag
     */
    function _start(dragSource, dragStartedCallback, inputProps) {
      var dataTransfer = new DataTransfer(_setDragImage, _getDataMode);
      var defaultPrevented = _fireEvent("dragstart", dragSource, inputProps, dataTransfer);

      if (defaultPrevented) {
        return {"dragState":"canceled"};
      }

      // Always set 'dataTransfer' property on the return object,
      // because caller needs DataTransfer even if polyfill isn't handling the drag.
      return _isDragStarted(dataTransfer, dragStartedCallback) ? 
        _dragStarted(dataTransfer, dragSource, inputProps) :
        {"dataTransfer": dataTransfer};
    }

    function _getDataMode() {
      return _dataMode;
    }

    function _fireEvent(eventName, eventTarget, inputProps, dataTransfer, relatedTarget) {
      _dataMode = _computeDataMode(eventName);

      if (eventName !== "dragstart") {
        dataTransfer.dropEffect =
          _determineDropEffect(eventName, dataTransfer.effectAllowed);
      }

      // inputProps is null only in unit test.  Otherwise inputProps is
      // an internally-created object populated with event properties.
      if (!inputProps) {
        inputProps = {};
      }

      inputProps.target = eventTarget;
      inputProps.relatedTarget = relatedTarget;

      // Return true if preventDefault has been called on the event
      return EventDispatcher.dispatch(eventName, inputProps, dataTransfer);
    }

    function _computeDataMode(eventName) {
      if (eventName === "dragstart") {
        return "readwrite";
      } else if (eventName === "drop") {
        return "readonly";
      } else {
        return "protected";
      }
    }

    // Determine dropEffect according to W3C spec.
    // Note that browser implementation vary.  e.g. on IE, dropEffect on events
    // other than drag and dragleave are only dependent on what dragstart set
    // effectAllowed to, even if subsequent events set them to something else.
    function _determineDropEffect(eventName, effectAllowed) {
      var dropEffect;

      if (eventName === "drag" || eventName === "dragleave") {
        // drag and dragleave events always get "none" as dropEffect
        dropEffect = "none";
      } else if (eventName === "dragenter" || eventName === "dragover") {
        if (effectAllowed === "none") {
          dropEffect = "none";
        } else if (effectAllowed === "move") {
          dropEffect = "move";
        } else if (effectAllowed.indexOf("link") === 0) {
          dropEffect = "link";
        } else {
          dropEffect = "copy";
        }
      } else {  // "drop" or "dragend"
        dropEffect = _currentDragOp;
      }

      return dropEffect;
    }

    // Tests whether the drag has been started.  Returns true
    // if the drag has been started *and* the polyfill is handling
    // the drag, false otherwise.
    function _isDragStarted(dataTransfer, dragStartedCallback) {
      if (dataTransfer.types.length === 0) {
        return false;
      }

      return dragStartedCallback ?
             dragStartedCallback(dataTransfer, _dragImage) :
             true;
    }

    // Peforms initialization actions in response to a drag being
    // started.  Returns a properties object suitable for return
    // from DragController.start().
    function _dragStarted(dataTransfer, dragSource, inputProps) {
      _dataTransfer = dataTransfer;
      _dragSource = dragSource;
      _bodyCursor = document.body.style.cursor;
      _ensureNonNullDragImage(dragSource, inputProps);

      return {
        "dragState": "started",
        "dataTransfer": dataTransfer
      };
    }

    function _ensureNonNullDragImage(dragSource, inputProps) {
      // If no drag image, use the drag source element as the image
      if (_dragImage == null) {
        var rect = dragSource.getBoundingClientRect();
        var clientX = inputProps ? inputProps.clientX : rect.left;
        var clientY = inputProps ? inputProps.clientY : rect.top;

        _setDragImage(dragSource, clientX - rect.left, clientY - rect.top);
      }
    }

    // Callback function for DataTransfer object to notify controller when
    // setDragImage is called
    function _setDragImage(element, x, y) {
      if (_dragImage) {
        _dragImage.end();
        _dragImage = null;
      }

      if (element && element.cloneNode) {
        _dragImageOffset = {x: x, y: y};
        _dragImage = new DragImage(element, x, y);
        _dragImage.start();
      }
    }

    // Todo: doc inputProps
    // Returns true if an active drag operation has been canceled,
    // false otherwise
    function _drag(inputProps) {
      if (inputProps && _isInDrag()) {
        // Hide the drag image before firing drag events so that any call to
        // elementFromPoint in the listeners will work correctly.
        _dragImage.show(false);

        if (_fireDrag(inputProps)) {
          _cancel(inputProps);
          return true;
        }

        try {
          var overElem  = _getDragOverElement(inputProps);
          _fireDragEnterLeave(overElem, inputProps);
          _fireDragOver(overElem, inputProps);
          _updateDragUI(overElem, inputProps);
          _saveDragOverState(overElem, inputProps);
        } finally {
          // Show the drag image again after firing drag events
          _dragImage.show(true);
        }
      }

      return false;
    }

    function _isInDrag() {
      return _dataTransfer != null;
    }

    function _fireDrag(inputProps) {
      return _fireEvent("drag", _dragSource, inputProps, _dataTransfer);
    }

    function _getDragOverElement(inputProps) {
      var clientX = inputProps.clientX;
      var clientY = inputProps.clientY;

      // Avoid hit testing if not needed to avoid flicker
      if (clientX === _lastElemPointX && clientY === _lastElemPointY) {
        return _dragOverElem;
      }

      return document.elementFromPoint(clientX, clientY);
    }

    function _fireDragEnterLeave(overElem, inputProps) {
      if (overElem !== _dragOverElem) {

        // dragenter is fired on new element before dragleave fired on old element
        if (overElem) {
          _fireEvent("dragenter", overElem, inputProps, _dataTransfer, _dragOverElem);
        }

        if (_dragOverElem) {
          _restoreElementCursor(_dragOverElem);
          _fireEvent("dragleave", _dragOverElem, inputProps, _dataTransfer, overElem);
        }
      }
    }

    function _fireDragOver(overElem, inputProps) {
      if (overElem) {
        var canceled = _fireEvent("dragover", overElem, inputProps, _dataTransfer);
        _updateCurrentDragOp(canceled);
      }
    }

    // Update "current drag operation" based on dragover result as defined by
    // W3C spec.
    function _updateCurrentDragOp(dragOverCanceled) {
      // If the dragover listener has called Event.preventDefault, it means drop
      // will be allowed.
      if (dragOverCanceled) {
        var effectAllowed = _dataTransfer.effectAllowed;

        if (effectAllowed === "uninitialized" ||
            effectAllowed === "all" ||
            effectAllowed.indexOf(_dataTransfer.dropEffect) >= 0) {
          _currentDragOp = _dataTransfer.dropEffect;
        } else {
          _currentDragOp = "none";
        }
      } else {
        if (_isTextField(_dragOverElem)) {
          _currentDragOp = "copy";
        } else {
          _currentDragOp = "none";
        }
      }
    }

    function _isTextField(element) {
      return element &&
        (element.nodeName === "TEXTAREA" ||
        (element.nodeName === "INPUT" && element.type === "text"));
    }

    // Updates the UI in response to a drag
    function _updateDragUI(overElem, inputProps) {
      _moveDragImage(inputProps);
      _updateCursor(overElem);
      _autoScroll(overElem, inputProps);
    }

    // Moves the drag image to the client coordinates specified
    // by inputProps.  As a side effect of moving the drag image
    function _moveDragImage(inputProps) {
      _dragImage.move(inputProps.clientX, inputProps.clientY);
    }

    function _updateCursor(overElem) {
      var newCursor;
      
      if (_currentDragOp === "none") {
        newCursor = "not-allowed";
      } else if (_currentDragOp === "copy") {
        newCursor = "copy";
      } else if (_currentDragOp === "link") {
        newCursor = "alias";
      } else {
        newCursor = "default";
      }

      // Update the cursor if necessary
      if (newCursor !== document.body.style.cursor) {
        document.body.style.cursor = newCursor;
      }

      _changeElementCursor(overElem, newCursor);
    }

    function _changeElementCursor(element, newCursor) {
      if (element.style.cursor !== newCursor) {
        if (element._dndSavedCursor === undefined) {
          element._dndSavedCursor = element.style.cursor;
        }
        element.style.cursor = newCursor;
      }
    }

    function _restoreElementCursor(element) {
      if (element._dndSavedCursor !== undefined) {
        element.style.cursor = element._dndSavedCursor;
        delete element._dndSavedCursor;
      }
    }

    function _autoScroll(overElem, inputProps) {
      if (AutoScroller.checkAutoScroll(
            overElem, inputProps.clientX, inputProps.clientY)) {

        // If we scroll any element, invalidate the last hit test coordinate
        // so that we will do hit test again
        _lastElemPointX = -1;
        _lastElemPointY = -1;
      }
    }

    function _saveDragOverState(overElem, inputProps) {
      _dragOverElem = overElem;
      _lastElemPointX = inputProps.clientX;
      _lastElemPointY = inputProps.clientY;
    }

    function _end(inputProps) {
      _endDrag(inputProps, false);
    }

    function _cancel(inputProps) {
      _endDrag(inputProps, true);
    }

    function _endDrag(inputProps, cancelDrag) {
      if (_isInDrag()) {
        // Hide the drag image before firing drag events so that any call to
        // elementFromPoint in the listeners will work correctly.
        _dragImage.show(false);

        var dropTarget = _getDragOverElement(inputProps);
        if (dropTarget) {
          _restoreElementCursor(dropTarget);
          _fireDragLeave(dropTarget, inputProps, cancelDrag);
          _handleDrop(dropTarget, inputProps, cancelDrag);
        }

        _fireEvent("dragend", _dragSource, inputProps, _dataTransfer);
        _resetDragState();
      }
    }

    function _fireDragLeave(dropTarget, inputProps, cancelDrag) {

      // Todo: currently we only fire the dragleave event if the
      // dropTarget is non-null.  Is it possible that some other element
      // (ie. our previous _dragOverElem may have received a dragenter event
      // but not yet received a dragleave?  If so, should we deliver the
      // dragleave in this case?

      if (!_isDropActive(cancelDrag)) {
        _fireEvent("dragleave", dropTarget, inputProps, _dataTransfer);
      }
    }

    function _handleDrop(dropTarget, inputProps, cancelDrag) {
      if (_isDropActive(cancelDrag)) {
        var eventCanceled = _fireEvent("drop", dropTarget, inputProps, _dataTransfer);

        // Todo: might be useful to add a comment here that explains the
        // logic, perhaps referencing the specification.  It isn't obvious
        // on first (or second) glance what the desired behavior is.

        if (eventCanceled) {
          _currentDragOp = _dataTransfer.dropEffect;
        } else if (_isTextField(dropTarget)) {
          _updateTextField(dropTarget);
        } else {
          _currentDragOp = "none";
        }

        return eventCanceled;
      }
      return true;
    }

    function _isDropActive(cancelDrag) {
      return (!cancelDrag && (_currentDragOp !== "none"));
    }

    function _updateTextField(element) {
      var textData = _dataTransfer.getData("text");
      if (textData && textData !== "") {
        var oldValue = element.value;
        var selEnd = element.selectionEnd;

        // For text field, insert any text data at the current caret position
        element.value = oldValue.substring(0, selEnd) +
                        textData +
                        oldValue.substring(selEnd);
      }
    }

    function _resetDragState() {
      _setDragImage(null, 0, 0);
      _dataTransfer = null;
      _dragSource = null;
      _dragOverElem = null;
      _currentDragOp = "none";

      document.body.style.cursor = _bodyCursor;
      _bodyCursor = null;
    }

    // make sure the drag image is not right on top of the cursor, as it will
    // interfere with dragenter/leave/over function (showing invalid drop)
    var TOUCH_IMAGE_LEFT_OFFSET = 50;
    var TOUCH_IMAGE_RIGHT_OFFSET = 10;

    // for directly handling of dnd event
    // basically this will fire pseudo dnd event in place of dnd event, so that
    // it can support advance datatransfer object than what native browser offers
    function _handleDndEvent(event) {
      var target = event.target;
      var relatedTarget = event.relatedTarget;
      // replicate input props, note that dnd events inherits from MouseEvent 
      var inputProps = EventDispatcher.getMouseEventProps(event);

      switch(event.type) {
        case "drag":
          if (_dragImage) {
            _dragImage.show(true);
          }
          _fireEvent("drag", target, inputProps, _dataTransfer);      
          break;
        case "dragenter":
          _fireEvent("dragenter", target, inputProps, _dataTransfer, relatedTarget);      
          break;
        case "dragleave":
          _fireEvent("dragleave", target, inputProps, _dataTransfer, relatedTarget);      
          break;
        case "dragover":
          var x = _dragImageOffset.x > 0 ? inputProps.clientX - TOUCH_IMAGE_LEFT_OFFSET : inputProps.clientX + TOUCH_IMAGE_RIGHT_OFFSET;
          var y = inputProps.clientY;
          _dragImage.move(x, y);

          var canceled = _fireEvent("dragover", target, inputProps, _dataTransfer);      
          _updateCurrentDragOp(canceled);
          if (canceled) {
            event.preventDefault();
          }
          break;
        case "dragend":
          if (_dragImage) {
            _dragImage.show(false);
          }
          _fireEvent("dragend", target, inputProps, _dataTransfer, relatedTarget);
          _resetDragState();
          // cleanup native event
          event.dataTransfer.clearData();
          break;
        case "drop":
          if (_dragImage) {
            _dragImage.show(false);
          }
          canceled = _handleDrop(target, inputProps, false);
          if (canceled) {
            event.preventDefault();
          }
          break;
      }
    }    

    this.start = _start;
    this.drag = _drag;
    this.end = _end;
    this.cancel = _cancel;
    this.handleDndEvent = _handleDndEvent;
  }

  return DragController;
});

define('args',[],function() {
  'use strict';

  /**
   * Verifies that the specified value is a non-null, non-empty
   * string.
   */
  function _requiredString(name, value) {
    _required(name, value);

    if (typeof value !== 'string') {
      throw new Error('argument \'' + name + '\' must be a string');
    }
  }

  /**
   * Verifies that the specified value is a non-null object.  (Any truthy
   * value is sufficient.)
   */
  function _required(name, value) {
    if (!value) {
      throw new Error('required argument \'' + name + '\' not specified');
    }
  }

  return {
    requiredString: _requiredString,
    required: _required
  };
});

define('glassPane',['./eventDispatcher'], function(EventDispatcher) {
  'use strict';

  /**
   * @callback DragCallback
   * @param {Object} inputProps most recent mouse event properties
   */

  /**
   * @callback EndCallback
   * @param {Object} inputProps most recent mouse event properties
   * @param {boolean} cancelDrag true to cancel drag operation; false to end it
   *        normally by firing "drop" event.
   */

  /**
   * GlassPane is a virtual element for intercepting mousemove and mouseup
   * events for desktop drag operation
   *
   * @param {DragCallback} dragCallback driver callback function that is
   *        invoked at fixed interval during drag operation.
   * @param {EndCallback} endCallback driver callback function that is invoked
   *        when the drag operation ends.
   */
  function GlassPane(dragCallback, endCallback) {

    var _dragIntervalId;
    var _lastInputProps;
    var _initButtons;

    function _start(inputProps) {
      // Event listeners may need the last hit point, so set this first.
      _lastInputProps = inputProps;

      document.body.addEventListener("mouseenter", _handleGlassMouseEnter, true);
      document.body.addEventListener("mousemove", _handleGlassMouseMove, true);
      document.body.addEventListener("mouseup", _handleGlassMouseUp, true);

      // Set an interval to fire drag and drop events.  We can't just rely on
      // mousemove event since it doesn't get fired when the mouse is not moved,
      // whereas drag events are fired continuously.
      // W3C spec specifies the interval to be 350ms (+-200ms).  It's jittery at
      // 350ms, so we set it to a lower value while keeping it within spec.
      _dragIntervalId = window.setInterval(_processDrag, 200);
    }

    function _end() {
      if (_dragIntervalId) {
        window.clearInterval(_dragIntervalId);
        _dragIntervalId = null;
      }

      document.body.removeEventListener("mouseenter", _handleGlassMouseEnter, true);
      document.body.removeEventListener("mousemove", _handleGlassMouseMove, true);
      document.body.removeEventListener("mouseup", _handleGlassMouseUp, true);
    }

    /**
     * Return a number of event properties from the last mouse event
     *
     * @return {Object} object containing the following mouse event properties:
     *                  screenX
     *                  screenY
     *                  clientX
     *                  clientY
     *                  altKey
     *                  ctrlKey
     *                  metaKey
     *                  shiftKey
     *                  button
     */
    function _getLastInputProps() {
      return _lastInputProps;
    }

    function _processDrag() {
      var dragCanceled = false;

      try {
        dragCanceled = dragCallback(_lastInputProps);
      }
      finally {
      }
    }

    function _handleGlassMouseEnter(event) {
      // If the mouse pointer has re-entered the document body, check the mouse
      // button.  If it's no longer down, cancel the drag.
      // This check used to be in mousemove listener, but IE sometimes doesn't 
      // set event.buttons correctly if the element underneath the pointer
      // changes, causing the drag to be cancelled incorrectly.
      if (event.target === document.body && event.buttons !== _initButtons) {
        // Remember the last mouse position.
        _lastInputProps = EventDispatcher.getMouseEventProps(event);

        endCallback(_lastInputProps, true);
      }
    }

    function _handleGlassMouseMove(event) {
      // Set _initButtons if it hasn't been set so that we can remember which
      // buttons are pressed when the drag is initiated.  We can't rely on
      // the dragstart event value since IE doesn't set it.
      if (_initButtons === undefined) {
        _initButtons = event.buttons;
      }

      // Don't allow any other processing
      event.stopPropagation();
      event.preventDefault();

      // Remember the last mouse position. _processDrag will process it and fire
      // events.
      _lastInputProps = EventDispatcher.getMouseEventProps(event);

      _processDrag();
    }

    function _handleGlassMouseUp(event) {
      // Don't allow any other processing
      event.stopPropagation();
      event.preventDefault();

      _lastInputProps = EventDispatcher.getMouseEventProps(event);

      endCallback(_lastInputProps, false);
    }

    this.start = _start;
    this.end = _end;
    this.getLastInputProps = _getLastInputProps;
  }

  return GlassPane;
});

define('desktopDragDriver',['./args', './glassPane', './eventDispatcher'],
       function(Args, GlassPane, EventDispatcher) {
  'use strict';

  /**
   * Handles all of the desktop-specific parts of a drag and drop
   * operation.
   *
   * @param controller the DragController that we are driving
   * @param rootElement the root DOM element within which drag operations
   *        may be performed.
   */
  function DesktopDragDriver(controller, rootElement) {
    Args.required('controller', controller);

    var _glassPane;
    var _pointerType;
    var _dragSource;

    /**
     * Installs the desktop drag driver.
     */
    function _install() {
      // We only need the polyfill on IE and Edge to support:
      // 1. setDragImage
      // 2. setData with non-text data type
      //
      // In addition, we install it for PhantomJS for testing.
      var userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.indexOf("trident") > 0 ||
          userAgent.indexOf("edge") > 0 ||
          userAgent.indexOf("phantomjs") > 0) {
        rootElement.addEventListener('dragstart', _handleDragStart, true);

        // these has to be registered before pointer/dragstart event
        // there should be no effect for phantomjs since pointer type will
        // never be "touch"
        rootElement.addEventListener("drag", _handleDndEvent, true);
        rootElement.addEventListener("dragover", _handleDndEvent, true);
        rootElement.addEventListener("dragend", _handleDndEvent, true);
        rootElement.addEventListener("dragenter", _handleDndEvent, true);
        rootElement.addEventListener("dragleave", _handleDndEvent, true);
        rootElement.addEventListener("drop", _handleDndEvent, true);  
        rootElement.addEventListener('pointerdown', _handlePointerDown, true);
      }
    }

    /**
     * Removes the desktop drag driver.
     */
    function _remove() {
      rootElement.removeEventListener('dragstart', _handleDragStart, true);
      rootElement.removeEventListener("drag", _handleDndEvent, true);
      rootElement.removeEventListener("dragover", _handleDndEvent, true);
      rootElement.removeEventListener("dragend", _handleDndEvent, true);
      rootElement.removeEventListener("dragenter", _handleDndEvent, true);
      rootElement.removeEventListener("dragleave", _handleDndEvent, true);
      rootElement.removeEventListener("drop", _handleDndEvent, true);
      rootElement.removeEventListener('pointerdown', _handlePointerDown, true);
    }

    /**
     * Keep track of the pointer type that triggers the dnd
     */
    function _handlePointerDown(event) {      
      _pointerType = event.pointerType;      
    }

    // Capture listener for drag start events.  Our strategy is this:
    // we capture all native drag start events delivered by the browser and
    // in their place we dispatch polyfill-provided equivalent events.
    // After app-defined event handlers have processed our polyfill-provided
    // events, we inspect the data transfer object to determine whether the
    // the polyfill needs to handle the drag and drop operation.  If so,
    // we cancel the native event and continue to drive the operation.  (If
    // not, we copy properties/data over to the native event and let the
    // default processing kick in.)
    function _handleDragStart(event) {
      if (_pointerType === "touch") {
        // to prevent IE from rendering the ghost image
        var target = event.target;
        target.style.visibility = "hidden";

        // for desktop that supports touch such as the surface pro
        _handleTouchDragStart(event);

        setTimeout(function()
        {
          target.style.visibility = "visible";
        }, 0);
      }
      else {
        // all others, including phantomjs
        _handleMouseDragStart(event);
      }
    }

    function _handleMouseDragStart(event) {
      var inputProps = EventDispatcher.getMouseEventProps(event);
      var dragProps;

      // We don't want any listeners to see the native event.
      event.stopPropagation();

      // Before we fire our pseudo event, we remove our capture
      // listener so that we avoid capturing our own event.
      _remove();

      try {
        dragProps = controller.start(event.target, _needsPolyfill, inputProps);
      }
      finally {
         _install();
      }

      if (dragProps.dragState === "canceled") {
        event.preventDefault();
      } else if (dragProps.dragState === "started") {
        _startDrag(event, dragProps, inputProps);
      } else {
        _copyNativeDataToNativeEvent(dragProps.dataTransfer, event);
      }
    }

    function _needsPolyfill(dataTransfer, dragImage) {
      return (dragImage != null) || _hasNonNativeData(dataTransfer);
    }

    // Return true if dataTransfer contains non-native data type.
    // IE only supports two native data types: "text" and "url".
    function _hasNonNativeData(dataTransfer) {
      var types = dataTransfer.types;
      if (types.length === 0) {
        return false;
      }

      for (var i = 0; i < types.length; i++) {
        var type = types[i].toLowerCase();

        if (type !== "text" && type !== "url") {
          return true;
        }
      }

      return false;
    }

    function _copyNativeDataToNativeEvent(dataTransfer, nativeEvent) {
      _copyDataToEvent(dataTransfer, nativeEvent, "text");
      _copyDataToEvent(dataTransfer, nativeEvent, "url");
    }

    function _copyDataToEvent(dataTransfer, event, format) {
      var data = dataTransfer.getData(format);
      if (data) {
        event.dataTransfer.setData(format, data);
      }    
    }
    
    function _startDrag(event, dragProps, inputProps) {
      // Let the browser know that the polyfill is handling
      // the drag by canceling the native event.
      event.preventDefault();

      _setupEventListeners(inputProps);
    }

    function _setupEventListeners(inputProps)
    {
      // Create a glass pane to capture subsequent mouse events
      _glassPane = new GlassPane(_dragCallback, _endCallback);
      _glassPane.start(inputProps);

      // Add a keydown capturing listener to the body to handle Esc key
      document.body.addEventListener("keydown", _handleKeyDown, true);
    }

    function _teardownEventListeners()
    {
      // Remove the glass pane when we are done
      if (_glassPane) {
        _glassPane.end();
        _glassPane = null;
      }

      // Remove the keydown capturing listener on the body
      document.body.removeEventListener("keydown", _handleKeyDown, true);
    }

    function _dragCallback(inputProps) {
      var dragCanceled = controller.drag(inputProps);

      if (dragCanceled) {
        _teardownEventListeners();
      }

      return dragCanceled;
    }

    function _endCallback(inputProps, cancel) {
      _teardownEventListeners();
      
      if (cancel) {
        controller.cancel(inputProps);
      } else {
        controller.end(inputProps);
      }
    }

    function _handleKeyDown(event)
    {
      // Don't allow any other processing
      event.stopPropagation();
      event.preventDefault();

      if (event.key === "Esc" || event.keyCode === 27) {
        // Retrieve the last hit point before destroying the glass pane
        var lastInputProps = _glassPane.getLastInputProps();

        // Destroy the glass pane before processing the event so that hit
        // testing will work correctly
        _teardownEventListeners();

        controller.cancel(lastInputProps);
      }
    }

    /////////////////// Edge Touch Support /////////////////////////////
    /**
     * For touch on Edge, we cannot rely on touch event because by default
     * they are not enabled (even worse on hybrid app use case the option
     * is not exposed).  Using a touch event polyfill (that simulate touch
     * events based on pointer events) would not work either because pointer
     * events are immediately cancelled when the element is draggable.
     *
     * The strategy that we decided to use is to listen for the native dnd event
     * and enhance them to add advance datatransfer support (drag image support 
     * in a later release).
     */
    function _handleTouchDragStart(event) {      
      // bail if the event is a pseudo event created by the controller
      if (event.__isPseudo) {
        return;
      }

      // we'll be firing our own dragstart event
      event.stopPropagation();
      
      var elem = event.target;
      
      // Find the first draggable ancestor element of the touch target
      while (elem && !elem.draggable) {
        elem = elem.parentNode;
      }
      
      if (elem) {
        _dragSource = elem;
      
        var inputProps = EventDispatcher.getMouseEventProps(event);
        var status = controller.start(_dragSource, null, inputProps);
        if (status.dragState !== "started") {
          // cancel drag
          event.preventDefault();
          _dragSource = null;
        }
      }      
    }

    // for the rest of dnd event we will just delegate to the controller to fire
    // the pseudo event
    function _handleDndEvent(event) {
      // bail if the event is a pseudo event
      if (event.__isPseudo) {
        return;
      }
      
      // bail if dragstart did not succeed
      if (!_dragSource) {
        return;
      }

      // we'll be firing our own event
      event.stopPropagation();  
  
      controller.handleDndEvent(event);    

      // reset _dragSource when done
      if (event.type === "dragend") {
        _dragSource = null;
      }
    }

    this.install = _install;
    this.remove = _remove;
  }

  return DesktopDragDriver;
});

define('touchDragDriver',['./args'], function(Args) {
  'use strict';

  function TouchDragDriver(controller, rootElement) {

    Args.required('controller', controller);

    var _dragSource = null;
    var _dragStarted = false;

    function _install() {
      rootElement.addEventListener("touchstart", _handleRootTouchStart, true);
      rootElement.addEventListener("touchmove", _handleRootTouchMove, true);
    }

    function _remove() {
      rootElement.removeEventListener("touchstart", _handleRootTouchStart, true);
      rootElement.removeEventListener("touchmove", _handleRootTouchMove, true);
    }

    function _handleRootTouchStart(event) {
      var elem = event.target;

      // Find the first draggable ancestor element of the touch target
      while (elem && !elem.draggable) {
        elem = elem.parentNode;
      }

      // Add touch event listeners to first draggable ancestor element if exists
      if (elem) {
        _setupEventListeners(elem);
      }
    }

    function _handleRootTouchMove() {
      // On iOS, if there is no pre-existing touchmove listener in the ancestor
      // chain when touchstart happens on an element, adding a touchmove 
      // listener afterwards and calling event.preventDefault has no effect and 
      // still allow the document to scroll.
      //
      // Register a no-op touchmove listener to work around this problem.
    }

    function _setupEventListeners(elem) {
      elem.addEventListener("touchstart", _handleTouchStart, false);
      elem.addEventListener("touchmove", _handleTouchMove, false);
      elem.addEventListener("touchend", _handleTouchEnd, false);
      elem.addEventListener("touchcancel", _handleTouchCancel, false);
    }

    function _teardownEventListeners(elem) {
      elem.removeEventListener("touchstart", _handleTouchStart, false);
      elem.removeEventListener("touchmove", _handleTouchMove, false);
      elem.removeEventListener("touchend", _handleTouchEnd, false);
      elem.removeEventListener("touchcancel", _handleTouchCancel, false);
    }

    function _handleTouchStart(event) {
      // drag source should be currentTarget, not target.  currentTarget is the
      // element that we added this listener to, whereas target could be a
      // descendant of currentTarget.
      _dragSource = event.currentTarget;

      // Do not fire dragstart on touchstart.  Wait for the first touchmove,
      // which may not occur.
      _dragStarted = false;
    }

    function _handleTouchMove(event) {
      event.preventDefault();
      event.stopPropagation();

      if (!_dragStarted) {
        var status = controller.start(_dragSource,
                                      null,
                                      _getTouchEventProps(event));

        // If the drag didn't start (e.g. no data or canceled), just teardown and return
        if (status.dragState !== "started") {
          _teardownEventListeners(event.currentTarget);
          return;
        }

        _dragStarted = true;
      }

      var dragCanceled = controller.drag(_getTouchEventProps(event));

      if (dragCanceled) {
        _teardownEventListeners(event.currentTarget);
      }
    }

    function _handleTouchEnd(event) {
      _endDrag(event, false);
    }

    function _handleTouchCancel(event) {
      _endDrag(event, true);
    }

    function _endDrag(event, cancel) {
      var elem = event.currentTarget;

      if (cancel) {
        controller.cancel(_getTouchEventProps(event));
      } else {
        controller.end(_getTouchEventProps(event));
      }

      _dragSource = null;
      _dragStarted = false;

      // Remove event listener from this element
      _teardownEventListeners(elem);
    }

    function _getTouchEventProps(event) {
      return {
        screenX: Math.round(event.changedTouches[0].screenX),
        screenY: Math.round(event.changedTouches[0].screenY),
        clientX: Math.round(event.changedTouches[0].clientX),
        clientY: Math.round(event.changedTouches[0].clientY),
        pageX: Math.round(event.changedTouches[0].pageX),
        pageY: Math.round(event.changedTouches[0].pageY),
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey
      };
    }

    this.install = _install;
    this.remove = _remove;
  }

  return TouchDragDriver;
});

define('bootstrap',['./dragController', './desktopDragDriver', './touchDragDriver'], 
       function(DragController, DesktopDragDriver, TouchDragDriver) {
  'use strict';

  var _drivers = [];

  /**
   * Initializes the drag and drop polyfill.
   */
  function _init() {
    if (!_isInitialized()) {
      var controller = new DragController();

      // Todo: support platform-specific bootstrapping, so that we
      // do not need to install mobile driver on desktop and
      // vice versa.
      var userAgent = navigator.userAgent.toLowerCase();

      // do not use TouchDragDriver for Edge, it will be handled with DesktopDragDriver
      var driverConstructors = userAgent.indexOf("edge") !== -1 ? [DesktopDragDriver] : [DesktopDragDriver, TouchDragDriver];
      _installDragDrivers(controller, driverConstructors);
    }
  }

  function _installDragDrivers(controller, driverConstructors) {
      var rootElement = document.documentElement;
    for (var i = 0; i < driverConstructors.length; i++) {
      var DriverConstructor = driverConstructors[i];
      var driver = new DriverConstructor(controller, rootElement);
      driver.install();
      _drivers.push(driver);
    }
  }

  /**
   * Destroys the drag and drop polyfill.
   */
  function _destroy() {
    _drivers.forEach(function(driver) {
      driver.remove();
    });

    _drivers = [];
  }

  function _isInitialized() {
    return _drivers.length > 0;
  }
  
  return {
    init: _init,
    destroy: _destroy
  };
});

  require(['bootstrap'], function(bootstrap) {
    bootstrap.init();
  });
})();