/**
 * Licenced under the MIT License
 *
 * Copyright (c) 2010 Seznam.cz, a.s.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * @license
 */
/*
 * Internet explorer generates pointer events by default for all input types like mouse, pen or touch (finger).
 * Touchr is generating touch events only for touch type by default but it can be overwritten by
 * window.Touchr_ALLOWED_POINTER_TYPE bitmask property. It can have values:
 * 1 for touch
 * 2 for mouse
 * 4 for pen
 * and their combinations.
 */

(function(window) {
	var IE_10		= !!window.navigator.msPointerEnabled,
		// Check below can mark as IE11+ also other browsers which implements pointer events in future
		// that is not issue, because touch capability is tested in IF statement bellow.
		// Note since Edge 16/Windows 10 1709 the property 'window.navigator.pointerEnabled' is undefined.
		IE_11_PLUS	= (!!window.navigator.pointerEnabled || !!window.PointerEvent);

	// Only pointer enabled browsers without touch capability.
	if (!!window.navigator.maxTouchPoints > 0 && (IE_10 || (IE_11_PLUS && !window.TouchEvent))) {
		var document = window.document,
			POINTER_DOWN		= IE_11_PLUS ? "pointerdown"	: "MSPointerDown",
			POINTER_UP 			= IE_11_PLUS ? "pointerup"		: "MSPointerUp",
			POINTER_MOVE		= IE_11_PLUS ? "pointermove"	: "MSPointerMove",
			POINTER_CANCEL		= IE_11_PLUS ? "pointercancel"	: "MSPointerCancel",
			POINTER_TYPE_TOUCH 	= IE_11_PLUS ? "touch"	: MSPointerEvent.MSPOINTER_TYPE_TOUCH,
			POINTER_TYPE_MOUSE 	= IE_11_PLUS ? "mouse"	: MSPointerEvent.MSPOINTER_TYPE_MOUSE,
			POINTER_TYPE_PEN 	= IE_11_PLUS ? "pen"	: MSPointerEvent.MSPOINTER_TYPE_PEN, //IE11+ has also unknown type which Touchr doesn't support
			GESTURE_START		= "MSGestureStart",
			GESTURE_CHANGE		= "MSGestureChange",
			GESTURE_END			= "MSGestureEnd",
			TOUCH_ACTION		= IE_11_PLUS ? "touchAction" : "msTouchAction",
			_180_OVER_PI		= 180/Math.PI,
			// Which pointer types will be used for generating touch events: 1 - touch, 2 - mouse, 4 - pen or their combination
			ALLOWED_POINTER_TYPE = window.Touchr_ALLOWED_POINTER_TYPE || 1,
			createEvent = function (eventName, target, params) {
				var k,
					event = document.createEvent("Event");

				event.initEvent(eventName, true, true);
				for (k in params) {
					event[k] = params[k];
				}
				target.dispatchEvent(event);
			},
			/**
			 * ECMAScript 5 accessors to the rescue
			 * @see http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
			 */
			makeSubArray = (function() {
				var MAX_SIGNED_INT_VALUE = Math.pow(2, 32) - 1,
					hasOwnProperty = Object.prototype.hasOwnProperty;

				function ToUint32(value) {
					return value >>> 0;
				}

				function getMaxIndexProperty(object) {
					var maxIndex = -1,
						isValidProperty,
						prop;

					for (prop in object) {

						isValidProperty = (
							String(ToUint32(prop)) === prop &&
								ToUint32(prop) !== MAX_SIGNED_INT_VALUE &&
								hasOwnProperty.call(object, prop));

						if (isValidProperty && prop > maxIndex) {
							maxIndex = prop;
						}
					}
					return maxIndex;
				}

				return function(methods) {
					var length = 0;
					methods = methods || { };

					methods.length = {
						get: function() {
							var maxIndexProperty = +getMaxIndexProperty(this);
							return Math.max(length, maxIndexProperty + 1);
						},
						set: function(value) {
							var constrainedValue = ToUint32(value);
							if (constrainedValue !== +value) {
								throw new RangeError();
							}
							for (var i = constrainedValue, len = this.length; i < len; i++) {
								delete this[i];
							}
							length = constrainedValue;
						}
					};
					methods.toString = {
						value: Array.prototype.join
					};
					return Object.create(Array.prototype, methods);
				};
			})(),
			// methods passed to TouchList closure method to extend Array
			touchListMethods = {
				/**
				 * Returns touch by id. This method fulfill the TouchList interface.
				 * @param {Number} id
				 * @returns {Touch}
				 */
				identifiedTouch: {
					value: function (id) {
						var length = this.length;
						while (length--) {
							if (this[length].identifier === id) return this[length];
						}
						return undefined;
					}
				},
				/**
				 * Returns touch by index. This method fulfill the TouchList interface.
				 * @param {Number} index
				 * @returns {Touch}
				 */
				item: {
					value: function (index) {
						return this[index];
					}
				},
				/**
				 * Returns touch index
				 * @param {Touch} touch
				 * @returns {Number}
				 */
				_touchIndex: {
					value: function (touch) {
						var length = this.length;
						while (length--) {
							if (this[length].pointerId == touch.pointerId) return length;
						}
						return -1;
					}
				},

				/**
				 * Add all events and convert them to touches
				 * @param {Event[]} events
				 */
				_addAll: {
					value: function(events) {
						var i = 0,
							length = events.length;

						for (; i < length; i++) {
							this._add(events[i]);
						}
					}
				},

				/**
				 * Add and MSPointer event and convert it to Touch like object
				 * @param {Event} event
				 */
				_add: {
					value: function(event) {
						var index = this._touchIndex(event);

						index = index < 0 ? this.length : index;

						//normalizing Pointer to Touch
						event.type = POINTER_MOVE;
						event.identifier = event.pointerId;
						//in DOC is mentioned that it is 0..255 but actually it returns 0..1 value
						//returns 0.5 for mouse down buttons in IE11, should it be issue?
						event.force = event.pressure;
						//default values for Touch which we cannot obtain from Pointer
						event.radiusX = event.radiusY = 1;
						event.rotationAngle = 0;

						this[index] = event;
					}
				},

				/**
				 * Removes an event from this touch list.
				 * @param {Event} event
				 */
				_remove: {
					value: function(event) {
						var index = this._touchIndex(event);

						if (index >= 0) {
							this.splice(index,1);
						}
					}
				}
			},

			/**
			 * This class store touches in an list which can be also accessible as array which is
			 * little bit bad because TouchList have to extend Array. Because we are aiming on
			 * IE10+ we can use ECMAScript5 solution.
			 * @extends Array
			 * @see http://www.w3.org/TR/2011/WD-touch-events-20110913/#touchlist-interface
			 * @see https://developer.mozilla.org/en-US/docs/DOM/TouchList
			 */
			TouchList = (function(methods) {
				return function() {
					var arr = makeSubArray(methods);
					if (arguments.length === 1) {
						arr.length = arguments[0];
					}
					else {
						arr.push.apply(arr, arguments);
					}
					return arr;
				};
			})(touchListMethods),

			/**
			 * list of all touches running during life cycle
			 * @type TouchList
			 */
			generalTouchesHolder,

			/**
			 * Storage of link between pointer {id} and original target
			 * @type Object
			 */
			pointerToTarget = {},

			/**
			 * General gesture object which fires MSGesture events whenever any associated MSPointer event changed.
			 */
			gesture = window.MSGesture ? new MSGesture() : null,

			gestureScale = 1,
			gestureRotation = 0,

			/**
			 * Storage of targets and anonymous MSPointerStart handlers for later
			 * unregistering
			 * @type Array
			 */
			attachedPointerStartMethods = [],

			/**
			 * Checks if node is some of parent children or sub-children
			 * @param {HTMLElement|Document} parent
			 * @param {HTMLElement} node
			 * @returns {Boolean}
			 */
			checkSameTarget = function (parent, node) {
				if (node) {
					if (parent === node) {
						return true;
					} else {
						return checkSameTarget(parent, node.parentNode);
					}
				} else {
					return false;
				}
			},

			/**
			 * Returns bitmask type of pointer to compare with allowed pointer types
			 * @param {Number|String} pointerType
			 * @returns {Number}
			 */
			pointerTypeToBitmask = function (pointerType) {
				if (pointerType == POINTER_TYPE_TOUCH) {
					return 1;
				} else if (pointerType == POINTER_TYPE_MOUSE) {
					return 2;
				} else {
					return 4;
				}
			},

			/**
			 * Main function which is rewriting the MSPointer event to touch event
			 * and preparing all the necessary lists of touches.
			 * @param {Event} evt
			 */
			pointerListener = function (evt) {
				var type,
					i,
					target = evt.target,
					originalTarget,
					changedTouches,
					targetTouches;

				// Skip pointers which are not allowed by users:
				if (!(pointerTypeToBitmask(evt.pointerType) & ALLOWED_POINTER_TYPE)) {
					return;
				}

				if (evt.type === POINTER_DOWN) {
					generalTouchesHolder._add(evt);
					pointerToTarget[evt.pointerId] = evt.target;

					type = "touchstart";

					// Fires MSGesture event when we have at least two pointers in our holder
					// (adding pointers to gesture object immediately fires Gesture event)
					if (gesture && generalTouchesHolder.length > 1) {
						gesture.target = evt.target;
						for (i = 0; i < generalTouchesHolder.length; i++) {
							// Adds to gesture only touches
							// It is not necessary to create separate gesture for mouse or pen pointers
							// because they cannot be present more than by 1 pointer.
							if (generalTouchesHolder[i].pointerType === POINTER_TYPE_TOUCH) {
								gesture.addPointer(generalTouchesHolder[i].pointerId);
							}
						}
					}
				}

				if (evt.type === POINTER_MOVE && generalTouchesHolder.identifiedTouch(evt.pointerId)) {
					generalTouchesHolder._add(evt);

					type = "touchmove";
				}

				//Preparation of touch lists have to be done before pointerup/MSPointerUp where we delete some information

				//Which touch fired this event, because we know that MSPointer event is fired for every
				//changed pointer than we create a list only with actual pointer
				changedTouches = document.createTouchList(evt);
				//Target touches is list of touches which started on (touchstart) on target element, they
				//are in this array even if these touches have coordinates outside target elements
				targetTouches = document.createTouchList();
				for (i = 0; i < generalTouchesHolder.length; i++) {
					//targetTouches._add(generalTouchesHolder[i]);
					//check if the pointerTarget is in the target
					if (checkSameTarget(target, pointerToTarget[generalTouchesHolder[i].identifier])) {
						targetTouches._add(generalTouchesHolder[i]);
					}
				}
				originalTarget = pointerToTarget[evt.pointerId];

				if (evt.type === POINTER_UP || evt.type === POINTER_CANCEL) {
					generalTouchesHolder._remove(evt);
					pointerToTarget[evt.pointerId] = null;

					delete pointerToTarget[evt.pointerId];
					type = "touchend";

					// Fires MSGestureEnd event when there is only one ore zero touches:
					if (gesture && generalTouchesHolder.length <= 1) {
						gesture.stop();
					}
				}

				//console.log("+", evt.type, evt.pointerType, generalTouchesHolder.length, evt.target.nodeName+"#"+evt.target.id);
				if (type && originalTarget) {
					createEvent(type, originalTarget, {touches: generalTouchesHolder, changedTouches: changedTouches, targetTouches: targetTouches});
				}
			},

			/**
			 * Main function which is rewriting the MSGesture event to gesture event.
			 * @param {Event} evt
			 */
			gestureListener = function (evt) {
				//TODO: check first, other than IE (FF?), browser which implements pointer events how to make gestures from pointers. Maybe it would be mix of pointer/gesture events.
				var type, scale, rotation;
				if (evt.type === GESTURE_START) {type = "gesturestart"}
				else if (evt.type === GESTURE_CHANGE) {type = "gesturechange"}
				else if (evt.type === GESTURE_END) {type = "gestureend"}

				// -------- SCALE ---------
				//MSGesture:
				//Scale values represent the difference in scale from the last MSGestureEvent that was fired.
				//Apple:
				//The distance between two fingers since the start of an event, as a multiplier of the initial distance. The initial value is 1.0.

				// ------- ROTATION -------
				//MSGesture:
				//Clockwise rotation of the cursor around its own major axis expressed as a value in radians from the last MSGestureEvent of the interaction.
				//Apple:
				//The delta rotation since the start of an event, in degrees, where clockwise is positive and counter-clockwise is negative. The initial value is 0.0
				if (evt.type === GESTURE_START) {
					scale = gestureScale = 1;
					rotation = gestureRotation = 0;
				} else {
					scale = gestureScale = gestureScale + (evt.scale - 1); //* evt.scale;
					rotation = gestureRotation = gestureRotation + evt.rotation * _180_OVER_PI;
				}

				createEvent(type, evt.target, {scale: scale, rotation: rotation, screenX: evt.screenX, screenY: evt.screenY});
			},

			/**
			 * This method augments event listener methods on given class to call
			 * our own method which attach/detach the MSPointer events handlers
			 * when user tries to attach touch events.
			 * @param {Function} elementClass Element class like HTMLElement or Document
			 */
			augmentEventListener = function(elementClass) {
				var customAddEventListener = attachTouchEvents,
					customRemoveEventListener = removeTouchEvents,
					oldAddEventListener = elementClass.prototype.addEventListener,
					oldRemoveEventListener = elementClass.prototype.removeEventListener;

				elementClass.prototype.addEventListener = function(type, listener, useCapture) {
					//"this" is HTML element
					if ((type.indexOf("gesture") === 0 || type.indexOf("touch") === 0)) {
						customAddEventListener.call(this, type, listener, useCapture);
					}
					oldAddEventListener.call(this, type, listener, useCapture);
				};

				elementClass.prototype.removeEventListener = function(type, listener, useCapture) {
					if ((type.indexOf("gesture") === 0 || type.indexOf("touch") === 0)) {
						customRemoveEventListener.call(this, type, listener, useCapture);
					}
					oldRemoveEventListener.call(this, type, listener, useCapture);
				};
			},
			/**
			 * This method attach event handler for MSPointer / MSGesture events when user
			 * tries to attach touch / gesture events.
			 * @param {String} type
			 * @param {Function} listener
			 * @param {Boolean} useCapture
			 */
			attachTouchEvents = function (type, listener, useCapture) {
				//element owner document or document itself
				var doc = this.nodeType == 9 ?  this : this.ownerDocument;

				// Because we are listening only on document, it is not necessary to
				// attach events on one document more times
				if (attachedPointerStartMethods.indexOf(doc) < 0) {
					//TODO: reference on node, listen on DOM removal to clean the ref?
					attachedPointerStartMethods.push(doc);
					doc.addEventListener(POINTER_DOWN, pointerListener, useCapture);
					doc.addEventListener(POINTER_MOVE, pointerListener, useCapture);
					doc.addEventListener(POINTER_UP, pointerListener, useCapture);
					doc.addEventListener(POINTER_CANCEL, pointerListener, useCapture);
					doc.addEventListener(GESTURE_START, gestureListener, useCapture);
					doc.addEventListener(GESTURE_CHANGE, gestureListener, useCapture);
					doc.addEventListener(GESTURE_END, gestureListener, useCapture);
				}

				// e.g. Document has no style
				// only touchmove event requires touch-action:none, don't set it unless it's neccessary
				// as it affects native behavior such as scrolling with pan gesture
				if (type === "touchmove" && this.style && (typeof this.style[TOUCH_ACTION] == "undefined" || !this.style[TOUCH_ACTION])) {
					this._touchActionUpdated = true;
					this.style[TOUCH_ACTION] = "none";
					// handle scrolling
					// if the element is draggable, don't scroll
					if (!this.hasAttribute("draggable")) {
						attachScrollHandler(this);
					}
				}
			},
			/**
			 * This method attach the scroll event handler.
			 * @param {Element} elem 
			 */
			attachScrollHandler = function(elem) {
				var last, scrollElem, findClosestScrollableElement, clearCachedHeight, visitedElems = [], pointerDownHandler, pointerMoveHandler, pointerUpHandler;

				/**
				 * Find the closest scrollable element from and including target
				 * @param {Element} target
				 * @return {Element}
				 */
				findClosestScrollableElement = function(target) {
					var clientHeight, scrollHeight;

					if (target == null) {
						return null;
					}

					// use cached clientHeight and scrollHeight, to minimize layout/reflow
					clientHeight = target._cachedClientHeight || target.clientHeight;
					scrollHeight = target._cachedScrollHeight || target.scrollHeight;

					target._cachedClientHeight = clientHeight;
					target._cachedScrollHeight = scrollHeight;

					// keep track of the elements visited so we could clear cached height later
					if (visitedElems.indexOf(target) === -1) {
						visitedElems.push(target);
					}

					if (!isNaN(clientHeight) && !isNaN(scrollHeight) && Math.abs(scrollHeight - clientHeight) > 1) {
						return target == document.documentElement ? document.body : target;
					}
					else {
						if (elem != target) {
							return findClosestScrollableElement(target.parentNode);
						}
						return null;
					}
				};

				/**
				 * Clear cached clientHeight and scrollHeight from visited elements
				 */
				clearCachedHeight = function() {
					for (var i=0; i<visitedElems.length; i++) {
						visitedElems[i]._cachedClientHeight = null;
						visitedElems[i]._cachedScrollHeight = null;
					}
					visitedElems.length = 0;
				};

				/**
				 * Handler for PointerDown event
				 */
				pointerDownHandler = function(event) {
					if (event.pointerType === "touch") {
						// should have been clear 
						clearCachedHeight();

						last = event.clientY;
						scrollElem = findClosestScrollableElement(event.target);
						if (scrollElem) {
							// prevent ancestors that have pointer event handler installed
							// to do any work
							event.stopPropagation();
						}
					}
				};

				/**
				 * Handler for PointerMove event
				 */
				pointerMoveHandler = function(Event) {
					var current, delta, nextScrollElem;

					if (event.pointerType === "touch") {
						if (last != undefined && scrollElem) {
							current = scrollElem.scrollTop;
							delta = last - event.clientY;
							scrollElem.scrollTop = current + delta;	

							// see if scroll min/max has been reached, scroll the next closest scrollable element
							// ignore if delta is < 1 (subpixel case)
							if (delta >= 1 && current == scrollElem.scrollTop) {
								nextScrollElem = findClosestScrollableElement(scrollElem.parentNode);								
								while (nextScrollElem) {
									current = nextScrollElem.scrollTop;
									nextScrollElem.scrollTop = current + delta;
									if (nextScrollElem === document.body || nextScrollElem.scrollTop != current) {
										break;
									}
									nextScrollElem = findClosestScrollableElement(nextScrollElem.parentNode);
								}
							}
						}
						last = event.clientY;
					}
				};

				/**
				 * Handler for PointerUp event
				 */
				pointerUpHandler = function(event) {
					clearCachedHeight();
					last = undefined;
				};

				elem.addEventListener(POINTER_DOWN, pointerDownHandler);
				elem.addEventListener(POINTER_MOVE, pointerMoveHandler); 
				elem.addEventListener(POINTER_UP, pointerUpHandler);
				elem._pointerHandlers = [pointerDownHandler, pointerMoveHandler, pointerUpHandler];
			},
			/**
			 * This method detach the scroll event handler.
			 * @param {Element} elem 
			 */
			detachScrollHandler = function(elem) {
				if (elem._pointerHandlers) {
					elem.removeEventListener(POINTER_DOWN, elem._pointerHandlers[0]);
					elem.removeEventListener(POINTER_MOVE, elem._pointerHandlers[1]);
					elem.removeEventListener(POINTER_UP, elem._pointerHandlers[2]);
					elem._pointerHandlers = undefined;
				}
			},
			/**
			 * This method detach event handler for MSPointer / MSGesture events when user
			 * tries to detach touch / gesture events.
			 * @param {String} type
			 * @param {Function} listener
			 * @param {Boolean} useCapture
			 */
			removeTouchEvents = function (type, listener, useCapture) {
				//todo: are we able to understand when all listeners are unregistered and shall be removed?
				if (type === "touchmove") {
					if (this._touchActionUpdated) {
						delete this.style[TOUCH_ACTION];
					}
					detachScrollHandler(this);
				}
			};


		/*
		 * Adding DocumentTouch interface
		 * @see http://www.w3.org/TR/2011/WD-touch-events-20110505/#idl-def-DocumentTouch
		 */

		/**
		 * Create touches list from array or touches or given touch
		 * @param {Touch[]|Touch} touches
		 * @returns {TouchList}
		 */
		document.createTouchList = function(touches) {
			var touchList = new TouchList();
			if (touches) {
				if (touches.length) {
					touchList._addAll(touches);
				} else {
					touchList._add(touches);
				}
			}
			return touchList;
		};

		/*******  Fakes which persuade other code to use touch events ********/

		/**
		 * AbstractView is class for document.defaultView === window
		 * @param {AbstractView} view
		 * @param {EventTarget} target
		 * @param {Number} identifier
		 * @param {Number} pageX
		 * @param {Number} pageY
		 * @param {Number} screenX
		 * @param {Number} screenY
		 * @return {Touch}
		 */
		document.createTouch = function(view, target, identifier, pageX, pageY, screenX, screenY) {
			return {
				identifier: identifier,
				screenX: screenX,
				screenY: screenY,
				//clientX: clientX,
				//clientY: clientY,
				pageX: pageX,
				pageY: pageY,
				target: target
			};
		};
		//Fake Modernizer touch test
		//http://modernizr.github.com/Modernizr/touch.html
		if (!window.ontouchstart) window.ontouchstart = 1;

		/*******  End of fakes ***********************************/

		generalTouchesHolder = document.createTouchList();

		// Overriding HTMLElement and HTMLDocument to hand over touch handler to MSPointer event handler
		augmentEventListener(HTMLElement);
		augmentEventListener(Document);
	}
}(window));