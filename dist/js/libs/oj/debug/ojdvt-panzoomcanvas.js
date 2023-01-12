/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit'], function (exports, dvt) { 'use strict';

  /**
   * @constructor
   * @param {dvt.Context} context The rendering context
   * @param {function} callback The callback for this PanZoomCanvasEventManager
   * @param {Object} callbackObj The callback object for this PanZoomCanvasEventManager
   */
  class PanZoomCanvasEventManager extends dvt.EventManager {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      /**
       * Used for the momentum timer interval
       * @private
       */
      this._MOMENTUM_START_TIMER_INTERVAL = 50;

      this._pzc = callbackObj;
      this._zoomAnimator = null;
      this._bPanning = false;
      this._bPanned = false;
      this._bZooming = false;
      this._bDragging = false;
      // momentum-based panning (turned on for both touch and desktop)
      this._bMomentumPanning = true;
    }

    /**
     * @override
     */
    addListeners(displayable) {
      super.addListeners(displayable);
      displayable.addEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
    }

    /**
     * @override
     */
    RemoveListeners(displayable) {
      super.RemoveListeners(displayable);
      displayable.removeEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
    }

    /**
     * @override
     */
    OnMouseDown(event) {
      this._bDragging = false;
      this._bPanned = false;
      if (event.button != dvt.MouseEvent.RIGHT_CLICK_BUTTON) {
        var pos = this._callbackObj.GetRelativeMousePosition(event);
        this._mx = pos.x;
        this._my = pos.y;
        this._px = this._mx;
        this._py = this._my;
        this._bDown = true;

        //for elastic constraints, save the original values
        this._origPanX = this._callbackObj.getPanX();
        this._origPanY = this._callbackObj.getPanY();
        this._origZoom = this._callbackObj.getZoom();

        if (this._bMomentumPanning) {
          //save current time for momentum-based panning
          this._currTime = new Date().getTime();
        }
      }
      //if momentum panning was running, stop it
      if (this._momentumTimer && this._momentumTimer.isRunning()) {
        this._momentumTimer.stop();
        this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
        this._momentumTimer.reset();
      }
    }

    /**
     * @override
     */
    OnMouseMove(event) {
      // Fixes for:
      //  - chrome: single selection doesn't work
      //  - node is not selected if mouse pointer is moved slightly - drag and drop
      // Add a small tolerance for mouse moves before attempting to pan to avoid consuming the event
      // and preventing the selection.
      // Check for position to verify if this is a legitimate mousemove
      var pos = this._callbackObj.GetRelativeMousePosition(event);
      if (Math.abs(pos.x - this._px) <= 3 && Math.abs(pos.y - this._py) <= 3) return;

      if (this._bDown) {
        this._bDragging = true;
        pos = this._callbackObj.GetRelativeMousePosition(event);
        var xx = pos.x;
        var yy = pos.y;

        if (event.ctrlKey) {
          if (!this._bZooming) {
            this._callback.call(this._callbackObj, dvt.EventFactory.newZoomEvent('dragZoomBegin'));
            this._bZooming = true;
            //turn on elastic constraints for the duration of this drag
            this._callbackObj.SetElasticConstraints(true);
          }
          //for elastic constraints, use a zoomTo so that the delta is relative to the mouseDown point,
          //resulting in more consistent values and smoother elastic animation
          //var dz = 1 + (this._my - yy) / 100;
          //to emulate the behavior from the line above, which scaled by 1% for each pixel, need to
          //take that 1% with the correct sign and raise it to the power of the total number of pixels moved
          var sign = this._py >= yy ? 1 : -1;
          var zz = this._origZoom * Math.pow(1 + sign * 0.01, Math.abs(this._py - yy));
          if (!this._callbackObj.isPanningEnabled()) {
            this._callbackObj.zoomTo(zz, null, null);
          } else {
            this._callbackObj.zoomTo(zz, this._px, this._py);
          }
        } else {
          this._handlePanMove(xx, yy);
        }

        this._mx = xx;
        this._my = yy;
      }
      this._callbackObj.setCursor(this._callbackObj.getCursor(this._bDown));
    }

    /**
     * @override
     */
    OnMouseUp(event) {
      this.PanZoomEnd();
      super.OnMouseUp(event);
    }

    /**
     * @override
     */
    OnClick(event) {
      if (this._bDragging || this._bPanned) {
        this._bDragging = false;
        this._bPanned = false;
        dvt.EventManager.consumeEvent(event);
      }
    }

    /**
     * @override
     */
    OnMouseOut(event) {
      // simulate mouse up event if needed
      if (this._bDown && (this._bPanning || this._bZooming)) {
        if (!event.relatedTarget || event.relatedTarget == null) {
          this.OnMouseUp(event);
        }
      }

      super.OnMouseOut(event);
    }

    /**
     * @protected
     * Handler for the mouse wheel event
     * @param {dvt.MouseEvent} event mouse wheel event
     */
    OnMouseWheel(event) {
      if (!event.wheelDelta || event.wheelDelta === 0 || !this._callbackObj.isZoomingEnabled()) {
        return;
      }

      var currZoom = this._callbackObj.getZoom();
      //TODO: re-enable animation after fixing how it works in conjunction with overview window
      //if there is already a zoom animator running, clean it up
      if (this._zoomAnimator) {
        var oldZoomAnim = this._zoomAnimator;
        //stop the old animator
        this._zoomAnimator.stop();
        //get the destination zoom level of the old animator so that we can add to it
        currZoom = this._callbackObj.getZoom(oldZoomAnim);
        this._zoomAnimator = null;

        //change the easing function so that it's fast at the start to
        //blend in more seamlessly with the animation we just stopped
        //partway through
      }
      this._zoomAnimator = null;

      var delta = event.wheelDelta;

      //: divide by the absolute value of the delta so that the zoom only changes by the increment,
      //just like in native Flash
      var zz = currZoom * (1 + (this._callbackObj.getZoomIncr() * delta) / Math.abs(delta));
      var pos = this._callbackObj.GetRelativeMousePosition(event);

      //cancel the mouse wheel event so that the browser doesn't scroll the page
      event.stopPropagation();
      event.preventDefault();

      //elastic constraints don't work right for mouse wheel zooming
      //(cause errors when zooming out in zooming.jspx Diagram demo page)
      //this._callbackObj.SetElasticConstraints(true);
      if (!this._callbackObj.isPanningEnabled()) {
        this._callbackObj.zoomTo(zz, null, null, this._zoomAnimator);
      } else {
        this._callbackObj.zoomTo(zz, pos.x, pos.y, this._zoomAnimator);
      }

      if (this._zoomAnimator) {
        dvt.Playable.appendOnEnd(this._zoomAnimator, this._clearZoomAnimator, this);
        this._zoomAnimator.play();
      }
    }

    /**
     * Clears the zoom animator
     * @private
     */
    _clearZoomAnimator() {
      this._zoomAnimator = null;
    }

    /**
     * Handles events for the momentum start timer
     * @private
     */
    _handleMomentumStartTimer() {
      //do nothing
    }

    /**
     * Handles events for the momentum timer
     * @private
     */
    _handleMomentumTimer() {
      //percent to slow down momentum each iteration
      var fraction = 0.04; //.02;
      //quadratic damping function
      var ratio = 1 - fraction * this._momentumIterCount;
      ratio *= ratio;
      var interval = this._momentumTimer.getInterval(); //this._MOMENTUM_START_TIMER_INTERVAL;
      //deltas to pan by for this iteration
      var dx = ratio * this._momentumXperMS * interval;
      var dy = ratio * this._momentumYperMS * interval;
      //add deltas to accumulated values
      this._momentumDx += dx;
      this._momentumDy += dy;
      //add accumulated deltas to the last drag pan position
      var newX = this._origPanX + this._mx - this._px + this._momentumDx;
      var newY = this._origPanY + this._my - this._py + this._momentumDy;
      this._callbackObj.panTo(newX, newY, null, true);
      var bStop = false;
      //stop just before ratio goes to 0
      if (this._momentumIterCount >= 1 / fraction - 1) {
        bStop = true;
      } else {
        //stop if we've hit elastic constraints
        var currX = this._callbackObj.getPanX();
        var currY = this._callbackObj.getPanY();
        //if the difference between the desired and actual pan positions is greater than the delta for this timer
        //iteration, we must be hitting the elastic constraints, so stop iterating
        var panDirection = this._pzc.getPanDir();
        if (
          (Math.abs(currX - newX) > Math.abs(dx) && panDirection != 'y') ||
          (Math.abs(currY - newY) > Math.abs(dy) && panDirection != 'x')
        ) {
          bStop = true;
        }
      }

      if (bStop) {
        this._momentumTimer.stop();
        this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
        this._momentumTimer.reset();
        //turn off elastic constraints when momentum stops
        this._callbackObj.SetElasticConstraints(false);
      } else {
        this._momentumIterCount++;
      }
    }

    /**
     * @override
     */
    HandleImmediateTouchStartInternal(event) {
      if (this._callbackObj.isZoomingEnabled())
        this.TouchManager.processAssociatedTouchAttempt(
          event,
          'zoomTouch',
          this.ZoomStartTouch,
          this
        );

      if (this._callbackObj.isPanningEnabled())
        this.TouchManager.processAssociatedTouchAttempt(event, 'panTouch', this.PanStartTouch, this);
    }

    /**
     * @override
     */
    HandleImmediateTouchMoveInternal(event) {
      if (this._callbackObj.isZoomingEnabled())
        this.TouchManager.processAssociatedTouchMove(event, 'zoomTouch');

      if (this._callbackObj.isPanningEnabled())
        this.TouchManager.processAssociatedTouchMove(event, 'panTouch');

      //  Only prevent default browser behavior if panning or zooming is enabled
      if (this._callbackObj.isZoomingEnabled() || this._callbackObj.isPanningEnabled())
        event.preventDefault();
    }

    /**
     * @override
     */
    HandleImmediateTouchEndInternal(event) {
      if (this._callbackObj.isZoomingEnabled())
        this.TouchManager.processAssociatedTouchEnd(event, 'zoomTouch');

      if (this._callbackObj.isPanningEnabled())
        this.TouchManager.processAssociatedTouchEnd(event, 'panTouch');
    }

    /**
     * Handles zoom start for touch device
     * @param {dvt.TouchEvent} event Touch event to handle
     * @param {dvt.Touch} touch Touch object for the event
     * @protected
     */
    ZoomStartTouch(event, touch) {
      var touchIds = this.TouchManager.getTouchIdsForObj('zoomTouch');
      if (touchIds.length <= 1) {
        this.TouchManager.saveProcessedTouch(
          touch.identifier,
          'zoomTouch',
          null,
          'zoomTouch',
          'zoomTouch',
          this.ZoomMoveTouch,
          this.ZoomEndTouch,
          this
        );
        this._mx = touch.pageX;
        this._my = touch.pageY;
        this._px = this._mx;
        this._py = this._my;

        //for elastic constraints, save the original values
        this._origPanX = this._callbackObj.getPanX();
        this._origPanY = this._callbackObj.getPanY();
        this._origZoom = this._callbackObj.getZoom();

        //: save the original finger distance
        this._origDist = null;
        touchIds = this.TouchManager.getTouchIdsForObj('zoomTouch');
        this._callbackObj.setCurrentTouchTargets(this.TouchManager.getStartTargetsByIds(touchIds));
      }

      //if momentum panning was running, stop it
      if (this._momentumTimer && this._momentumTimer.isRunning()) {
        this._momentumTimer.stop();
        this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
        this._momentumTimer.reset();
      }
    }

    /**
     * Handles zoom move for touch device
     * @param {dvt.TouchEvent} event Touch event to handle
     * @param {dvt.Touch} touch Touch object for the event
     * @protected
     */
    ZoomMoveTouch(event, touch) {
      var touchIds = this.TouchManager.getTouchIdsForObj('zoomTouch');
      if (touchIds.length == 2) {
        var data = this.TouchManager.getMultiTouchData(touchIds);
        if (data) {
          // set a flag so we won't try to pan while zooming
          if (!this._bZooming) {
            this._bZooming = true;
            this.TouchManager.blockTouchHold();
            this._callback.call(this._callbackObj, dvt.EventFactory.newZoomEvent('dragZoomBegin'));
          }
          //turn on elastic constraints for the duration of this drag
          this._callbackObj.SetElasticConstraints(true);

          //:
          //the original distance should be the current distance minus the current delta distance
          if (this._origDist == null) {
            this._origDist = data.dist - data.dz;
          }
          //the new zoom should be the original zoom multiplied by the ratio of current finger distance to original
          //finger distance (e.g. if you move your fingers twice as far apart as they originally were, the view should
          //zoom by a factor of 2)
          var zz = this._origZoom * (data.dist / this._origDist);
          //the center point of the zoom needs to be converted to stage-relative coords
          var cp = this._pzc.getCtx().pageToStageCoords(data.cx, data.cy);

          this.hideTooltip();
          this._callbackObj.setCurrentTouchTargets(this.TouchManager.getStartTargetsByIds(touchIds));
          this._callbackObj.zoomTo(zz, cp.x, cp.y);
          //the center point delta is in page coords, which should be okay for panning
          this._callbackObj.panBy(data.dcx, data.dcy);
        }
      }
    }

    /**
     * Handles zoom end for touch device
     * @param {dvt.TouchEvent} event Touch event to handle
     * @param {dvt.Touch} touch Touch object for the event
     * @protected
     */
    ZoomEndTouch(event, touch) {
      if (this._bZooming) {
        //: clear the original finger distance
        this._origDist = null;
        this.TouchManager.unblockTouchHold();
        this._handleZoomEnd();
      }
      var touchIds = this.TouchManager.getTouchIdsForObj('zoomTouch');
      this._callbackObj.setCurrentTouchTargets(this.TouchManager.getStartTargetsByIds(touchIds));
      if (touchIds.length == 0)
        this._callback.call(
          this._callbackObj,
          dvt.EventFactory.newZoomEvent('zoomEnd', this._callbackObj.getZoom(), this._origZoom)
        );
    }

    /**
     * Handles pan start for touch device
     * @param {dvt.TouchEvent} event Touch event to handle
     * @param {dvt.Touch} touch Touch object for the event
     * @protected
     */
    PanStartTouch(event, touch) {
      if (!this._bZooming) {
        var touchIds = this.TouchManager.getTouchIdsForObj('panTouch');
        if (touchIds.length <= 1) {
          this.TouchManager.saveProcessedTouch(
            touch.identifier,
            'panTouch',
            null,
            'panTouch',
            'panTouch',
            this.PanMoveTouch,
            this.PanEndTouch,
            this
          );
          this._mx = touch.pageX;
          this._my = touch.pageY;
          this._px = this._mx;
          this._py = this._my;

          //for elastic constraints, save the original values
          this._origPanX = this._callbackObj.getPanX();
          this._origPanY = this._callbackObj.getPanY();
          this._origZoom = this._callbackObj.getZoom();

          if (this._bMomentumPanning) {
            //save current time for momentum-based panning
            this._currTime = new Date().getTime();
          }
        }
      }
      //if momentum panning was running, stop it
      if (this._momentumTimer && this._momentumTimer.isRunning()) {
        this._momentumTimer.stop();
        this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
        this._momentumTimer.reset();
      }
    }

    /**
     * Handles pan move for touch device
     * @param {dvt.TouchEvent} event Touch event to handle
     * @param {dvt.Touch} touch Touch object for the event
     * @protected
     */
    PanMoveTouch(event, touch) {
      if (!this._bZooming) {
        var touchIds = this.TouchManager.getTouchIdsForObj('panTouch');
        if (touchIds.length == 1) {
          var xx = touch.pageX;
          var yy = touch.pageY;
          this._handlePanMove(xx, yy);
          this._mx = xx;
          this._my = yy;
        }
      }
    }

    /**
     * Handles pan end for touch device
     * @param {dvt.TouchEvent} event Touch event to handle
     * @param {dvt.Touch} touch Touch object for the event
     * @protected
     */
    PanEndTouch(event, touch) {
      if (!this._bZooming && this._bPanning) {
        this._handlePanEnd();
        this.SetEventInfo(event, 'panned', true);
      }
    }

    /**
     * Handles a zoom end event by passing a zoom event to the callback and updating the control panel
     * @private
     */
    _handleZoomEnd() {
      this._callback.call(this._callbackObj, dvt.EventFactory.newZoomEvent('dragZoomEnd'));
      this._bZooming = false;

      //turn off elastic constraints, which will animate a bounce back to constrained values, if necessary
      this._callbackObj.SetElasticConstraints(false);
    }

    /**
     * Handles a pan move event by passing a pan event to the callback and updating the control panel
     * @param {Number} xx The x position to move to
     * @param {Number} yy The y position to move to
     * @private
     */
    _handlePanMove(xx, yy) {
      if (!this._bPanning) {
        this._callback.call(this._callbackObj, dvt.EventFactory.newPanEvent('dragPanBegin'));
        this._bPanning = true;
        //turn on elastic constraints for the duration of this drag
        this._callbackObj.SetElasticConstraints(true);

        if (this._bMomentumPanning) {
          //keep track of last N mouse moves for momentum-based panning
          this._arLastNMouseMoves = [];
        }
      }

      //for elastic constraints, use a panTo so that the delta is relative to the mouseDown point,
      //resulting in more consistent values and smoother elastic animation
      //this._callbackObj.panBy(xx - this._mx, yy - this._my);
      this._callbackObj.panTo(
        this._origPanX + xx - this._px,
        this._origPanY + yy - this._py,
        null,
        true
      );

      if (this._bMomentumPanning) {
        //get new timestamp for momentum-based panning
        this._lastTime = this._currTime;
        this._currTime = new Date().getTime();

        //create or reset the timer to determine if we should start momentum-based panning
        if (this._momentumStartTimer) {
          if (this._momentumStartTimer.isRunning()) {
            this._momentumStartTimer.stop();
            this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
          }
          this._momentumStartTimer.reset();
        } else {
          this._momentumStartTimer = new dvt.Timer(
            this._context,
            this._MOMENTUM_START_TIMER_INTERVAL,
            this._handleMomentumStartTimer,
            this,
            1
          );
        }
        //save the info for this mouse move
        this._arLastNMouseMoves.push({
          dt: this._currTime - this._lastTime,
          dx: xx - this._mx,
          dy: yy - this._my
        });
        //only save last N moves, so drop the oldest
        if (this._arLastNMouseMoves.length > 5) {
          this._arLastNMouseMoves.splice(0, 1);
        }
        //start the timer to indicate if we should start momentum-based panning;
        //if the timer expires, we won't do momentum-based panning, if the timer hasn't expired when the
        //mouseup occurs, then we'll start momentum-based panning
        this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('notready'));
        this._momentumStartTimer.start();
      }
    }

    /**
     * Helper function called on mouseup or touchend events. Handles end of panning movement.
     * @private
     */
    _handlePanEnd() {
      this._callback.call(this._callbackObj, dvt.EventFactory.newPanEvent('dragPanEnd'));
      this._bPanning = false;
      this._bPanned = true;
      //if the momentum-based panning start timer is still running, that means that the mouseup happened
      //very quickly after the last mouse move, so we want to start momentum-based panning
      if (this._momentumStartTimer && this._momentumStartTimer.isRunning()) {
        this._momentumStartTimer.stop();
        this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
        this._momentumStartTimer.reset();
        //create or reset the momentum panning timer
        if (!this._momentumTimer) {
          //initialize with start timer interval, but it will later be changed based on mousemove event intervals
          this._momentumTimer = new dvt.Timer(
            this._context,
            this._MOMENTUM_START_TIMER_INTERVAL,
            this._handleMomentumTimer,
            this
          );
        } else {
          this._momentumTimer.reset();
        }

        //use the last N mousemoves to average the x,y deltas per ms
        var dt = 0;
        var dx = 0;
        var dy = 0;
        var numMoves = this._arLastNMouseMoves.length;
        while (this._arLastNMouseMoves.length > 0) {
          var objMove = this._arLastNMouseMoves.pop();
          dt += objMove.dt;
          dx += objMove.dx;
          dy += objMove.dy;
        }
        this._arLastNMouseMoves = null;
        this._momentumXperMS = dx / dt;
        this._momentumYperMS = dy / dt;
        //use timer interval similar to mousemove interval
        this._momentumTimer.setInterval(Math.ceil(dt / numMoves)); //@HTMLUpdateOK
        this._momentumIterCount = 1;
        this._momentumDx = 0;
        this._momentumDy = 0;
        //We disable and enable panning on DnD operations. The check should prevent momentum panning when panning is temporary disabled
        if (this._pzc.isPanningEnabled()) {
          this._callbackObj._view.dispatchEvent(dvt.EventFactory.newEvent('notready'));
          this._momentumTimer.start();
        }
      } else {
        //turn off elastic constraints, which will animate a bounce back to constrained values, if necessary
        this._callbackObj.SetElasticConstraints(false);
      }
    }

    /**
     * Ends pan zoom operations
     * @protected
     */
    PanZoomEnd() {
      this._bDown = false;
      this._bDragging = false;

      if (this._bPanning) {
        this._handlePanEnd();
      }
      if (this._bZooming) {
        this._handleZoomEnd();
      }
      this._callbackObj.setCursor(this._callbackObj.getCursor(this._bDown));
    }

    /**
     * @override
     */
    GetTouchResponse() {
      if (this._pzc.isPanningEnabled() || this._pzc.isZoomingEnabled())
        return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
      return dvt.EventManager.TOUCH_RESPONSE_AUTO;
    }

    /**
     * @override
     */
    StoreInfoByEventType(key) {
      if (key == 'panned') {
        return false;
      }
      return super.StoreInfoByEventType(key);
    }
  }

  /**
   *  Creates a canvas that supports panning and zooming.
   *  @extends {dvt.Container}
   *  @class PanZoomCanvas is a platform independent class representing a
   *  pannable, zoomable canvas.
   *  @constructor
   *  @param {dvt.Context} context The context object
   *  @param {number} ww The width of the canvas
   *  @param {number} hh The height of the canvas
   */

  class PanZoomCanvas extends dvt.Container {
    constructor(context, ww, hh, view) {
      super(context);

      this.DEFAULT_PAN_INCREMENT = 15;
      this.DEFAULT_ZOOM_INCREMENT = 0.05;
      this.DEFAULT_ANIMATION_DURATION = 0.5;

      this._view = view;

      this._ww = ww;
      this._hh = hh;

      this._px = 0;
      this._py = 0;
      this._mx = 0;
      this._my = 0;

      this._minPanX = null;
      this._maxPanX = null;
      this._minPanY = null;
      this._maxPanY = null;
      this._minZoom = 0.1;
      this._maxZoom = 1;

      this._panIncrement = this.DEFAULT_PAN_INCREMENT;
      this._zoomIncrement = this.DEFAULT_ZOOM_INCREMENT;
      this._zoomToFitPadding = PanZoomCanvas.DEFAULT_PADDING;

      this._bPanningEnabled = true;
      this._panDirection = 'auto';
      this._bZoomingEnabled = true;
      this._bZoomToFitEnabled = true;

      this._backgroundPane = new dvt.Rect(this.getCtx(), 0, 0, this._ww, this._hh);
      this.addChild(this._backgroundPane);
      this._backgroundPane.setInvisibleFill();

      this._contentPane = new dvt.Container(this.getCtx());
      this.addChild(this._contentPane);
      this._contentPane.setMatrix(new dvt.Matrix());

      this._animationDuration = this.DEFAULT_ANIMATION_DURATION;

      this._eventManager = new PanZoomCanvasEventManager(context, this.FireListener, this);
      this._eventManager.addListeners(this);

      this._clipIdSuffix = 1;
      this.SetClipRect(ww, hh);

      //flag indicating if constraints should be treated as elastic, so that overflow is possible, with bounce back
      this._bElasticConstraints = false;
      //anim for bouncing back elastic constraints
      this._elasticConstraintsAnim = null;
    }

    /**
     * Sets the pan zoom canvas size with an optional parameter to set a clipPath
     * @param {number} ww The new width of the pan zoom canvas.
     * @param {number} hh The new height of the pan zoom canvas.
     * @param {boolean} bAdjustSizeOnly If true, only the pan zoom canvas size is adjusted and no clip path is set.
     */
    setSize(ww, hh, bAdjustSizeOnly) {
      this._ww = ww;
      this._hh = hh;
      // Thematic Map uses this method to update canvas width temporarily before a zoom to fit to position the map within
      // a smaller bounds when legend is fixed without actually decreasing the canvas size
      if (!bAdjustSizeOnly) {
        this._backgroundPane.setWidth(ww);
        this._backgroundPane.setHeight(hh);

        this.SetClipRect(ww, hh);
      }
    }

    getSize() {
      return new dvt.Dimension(this._ww, this._hh);
    }

    /**
     *  Sets a clipping region for the panZoomCanvas.
     *  @param {number} ww width
     *  @param {number} hh height
     */
    SetClipRect(ww, hh) {
      var clipPath = new dvt.ClipPath('pzc');
      clipPath.addRect(this.getTranslateX(), this.getTranslateY(), ww, hh);
      this.setClipPath(clipPath);
    }

    /**
     * Get the content pane of the canvas.  The content pane is the
     * object that will be panned and zoomed.  Content should be
     * added as a child of the content pane, not the canvas itself.
     * @return {dvt.Container} the content pane of the canvas
     */
    getContentPane() {
      return this._contentPane;
    }

    setContentPane(contentPane) {
      this._contentPane = contentPane;
    }

    /**
     * Get the background pane of the canvas.  The background
     * pane appears behind the content pane, and should be used
     * for styling.
     * @return {dvt.Rect} the background pane of the canvas
     */
    getBackgroundPane() {
      return this._backgroundPane;
    }

    /**
     * Gets the matrix for this pan zoom canvas
     * @param {dvt.Animator} an optional animator which may continue a destination value for this matrix
     * @return {dvt.Matrix} the matrix
     */
    getContentPaneMatrix(animator) {
      if (animator) {
        var mat = animator.getDestVal(this._contentPane, this._contentPane.getMatrix);
        if (mat) {
          return mat;
        }
      }
      return this._contentPane.getMatrix();
    }

    /**
     * Get the current zoom level.
     * @param {dvt.Animator} animator (optional) The animator to check for a more current value
     * @return {number} the current zoom level
     */
    getZoom(animator) {
      return this.getContentPaneMatrix(animator).getA();
    }

    /**
     * Get the current horizontal pan position.
     * @param {dvt.Animator} animator (optional) The animator to check for a more current value
     * @return {number} the current horizontal pan position
     */
    getPanX(animator) {
      return this.getContentPaneMatrix(animator).getTx();
    }

    /**
     * Get the current vertical pan position.
     * @param {dvt.Animator} animator (optional) The animator to check for a more current value
     * @return {number} the current vertical pan position
     */
    getPanY(animator) {
      return this.getContentPaneMatrix(animator).getTy();
    }

    /**
     * Set the padding to leave around the content when it is zoomed-to-fit.
     * The default value is 20.
     * @param {number} n new zoom-to-fit padding
     */
    setZoomToFitPadding(n) {
      this._zoomToFitPadding = n;
    }

    /**
     * Get the padding to leave around the content when it is zoomed-to-fit.
     * @return {number} zoom-to-fit padding
     */
    getZoomToFitPadding() {
      return this._zoomToFitPadding;
    }

    /**
     * Pan by the given amount.
     * @param {number} dx horizontal amount to pan by
     * @param {number} dy vertical amount to pan by
     * @param {dvt.Animator} animator optional animator to use to animate the pan
     * @param {function=} panEndFunc Additional optional callback function panning completed
     * @param {boolean} noWriteback optional if true, don't writeback to options
     */
    panBy(dx, dy, animator, panEndFunc, noWriteback) {
      if (!this.isPanningEnabled()) {
        return;
      }

      var oldX = this.getPanX(animator);
      var oldY = this.getPanY(animator);
      var newX = this.getPanDir() == 'y' ? oldX : this.ConstrainPanX(oldX + dx);
      var newY = this.getPanDir() == 'x' ? oldY : this.ConstrainPanY(oldY + dy);

      var deltaX = newX - oldX;
      var deltaY = newY - oldY;

      var mat = null;
      if (animator) {
        mat = animator.getDestVal(this._contentPane, this._contentPane.getMatrix);
      }
      if (!mat) {
        mat = this._contentPane.getMatrix();
      }

      mat = mat.translate(deltaX, deltaY);

      var thisRef = this;
      var fireStartEventFunc = () => {
        thisRef.FirePanEvent('panning', newX, newY, oldX, oldY, animator, this.getZoom());
      };
      var fireEndEventFunc = () => {
        if (!noWriteback) {
          thisRef.FirePanEvent('panned', newX, newY, oldX, oldY, animator, this.getZoom());
        }
      };

      if (animator) {
        animator.addProp(
          dvt.Animator.TYPE_MATRIX,
          this._contentPane,
          this._contentPane.getMatrix,
          this._contentPane.setMatrix,
          mat
        );
        dvt.Playable.prependOnInit(animator, fireStartEventFunc);
        dvt.Playable.appendOnEnd(animator, fireEndEventFunc);
        if (panEndFunc) {
          dvt.Playable.appendOnEnd(animator, panEndFunc);
        }
      } else {
        fireStartEventFunc();
        this._contentPane.setMatrix(mat);
        fireEndEventFunc();
        if (panEndFunc) {
          panEndFunc();
        }
      }
    }

    /**
     * Pan to the given position.
     * @param {number} xx horizontal position to pan to
     * @param {number} yy vertical position to pan to
     * @param {dvt.Animator} animator optional animator to use to animate the pan
     * @param {boolean} noWriteback optional, if true, don't writeback to options
     */
    panTo(xx, yy, animator, noWriteback) {
      if (!this.isPanningEnabled()) {
        return;
      }

      var dx = xx - this.getPanX(animator);
      var dy = yy - this.getPanY(animator);
      this.panBy(dx, dy, animator, null, noWriteback);
    }

    /**
     * Writeback the pan value to options
     */
    writebackPan() {
      this.FirePanEvent(
        'panned',
        this.getPanX(),
        this.getPanY(),
        this.getPanX(),
        this.getPanY(),
        null,
        this.getZoom()
      );
    }

    /**
     * Zoom by the given amount.
     * @param {number} dz amount to zoom by
     * @param {number} xx horizontal center of zoom (if not specified, treated as the horizontal center of the canvas)
     * @param {number} yy vertical center of zoom (if not specified, treated as the vertical center of the canvas)
     * @param {dvt.Animator} animator optional animator to use to animate the zoom
     * @param {boolean} panAndZoom optional if true, both zoom + pan changes are occurring
     */
    zoomBy(dz, xx, yy, animator, panAndZoom) {
      if (!this.isZoomingEnabled()) {
        return;
      }

      if (!xx && xx !== 0) {
        xx = this._ww / 2;
      }
      if (!yy && yy !== 0) {
        yy = this._hh / 2;
      }

      var oldZoom = this.getZoom(animator);
      var newZoom = this.ConstrainZoom(oldZoom * dz);

      var deltaZoom = newZoom / oldZoom;

      var mat = this.getContentPaneMatrix();

      // determine the new matrix after zooming
      mat = mat.scale(deltaZoom, deltaZoom, xx, yy);

      // shift the update matrix back into bounds
      var xDiff = this.ConstrainPanX(mat.getTx()) - mat.getTx();
      var yDiff = this.ConstrainPanY(mat.getTy()) - mat.getTy();
      this.FireZoomEvent('adjustPanConstraints', newZoom, oldZoom, animator, xx, yy);

      // shift the update matrix back into bounds again in case the zooming listener changes the pan constraints
      xDiff = this.ConstrainPanX(mat.getTx()) - mat.getTx();
      yDiff = this.ConstrainPanY(mat.getTy()) - mat.getTy();
      mat = mat.translate(xDiff, yDiff);

      var thisRef = this;
      var fireStartEventFunc = () => {
        thisRef.FireZoomEvent(
          'zooming',
          newZoom,
          oldZoom,
          animator,
          xx,
          yy,
          thisRef.getPanX(),
          thisRef.getPanY()
        );
      };
      var fireEndEventFunc = () => {
        //use current zoom level at time of firing event as new zoom level
        //in event, because if continously scrolling the mouse wheel, each
        //zoom animation gets interrupted by the next one, so each event
        //doesn't actually zoom all the way to the desired scale until the
        //last event
        thisRef.FireZoomEvent(
          'zoomed',
          thisRef.getZoom(),
          oldZoom,
          animator,
          xx,
          yy,
          thisRef.getPanX(),
          thisRef.getPanY(),
          panAndZoom
        );
      };

      if (animator) {
        animator.addProp(
          dvt.Animator.TYPE_MATRIX,
          this._contentPane,
          this._contentPane.getMatrix,
          this._contentPane.setMatrix,
          mat
        );
        dvt.Playable.prependOnInit(animator, fireStartEventFunc);
        dvt.Playable.appendOnEnd(animator, fireEndEventFunc);
      } else {
        fireStartEventFunc();
        this._contentPane.setMatrix(mat);
        fireEndEventFunc();
      }
    }

    /**
     * Zoom to the given scale.
     * @param {number} zz new scale
     * @param {number} xx horizontal center of zoom (if not specified, treated as the horizontal center of the canvas)
     * @param {number} yy vertical center of zoom (if not specified, treated as the vertical center of the canvas)
     * @param {dvt.Animator} animator optional animator to use to animate the zoom
     * @param {boolean} panAndZoom optional if true, both zoom + pan changes are occurring
     */
    zoomTo(zz, xx, yy, animator, panAndZoom) {
      if (!this.isZoomingEnabled()) {
        return;
      }
      var dz = zz / this.getZoom(animator);
      this.zoomBy(dz, xx, yy, animator, panAndZoom);
    }

    /**
     * Pan the content pane to be centered in the canvas.
     * @param {dvt.Animator} animator optional animator to use to animate the zoom-to-fit
     * @param {dvt.Rectangle} fitBounds optional bounds in content pane coordinate system to zoom-to-fit to
     */
    center(animator, fitBounds) {
      var panningEnabled = this.isPanningEnabled();
      var panDirection = this.getPanDir();
      this.setPanningEnabled(true);
      this.setPanDir('auto');
      var bounds = fitBounds;
      if (!bounds) bounds = this._contentPane.getDimensions();

      var cxBounds = (bounds.x + bounds.w / 2) * this.getZoom();
      var cyBounds = (bounds.y + bounds.h / 2) * this.getZoom();
      var dx = this._ww / 2 - cxBounds;
      var dy = this._hh / 2 - cyBounds;
      this.panTo(dx, dy, animator);
      this.setPanningEnabled(panningEnabled);
      this.setPanDir(panDirection);
    }

    /**
     * Zoom and pan the content pane to fit the canvas size.
     * @param {dvt.Animator} animator optional animator to use to animate the zoom-to-fit
     * @param {dvt.Rectangle} fitBounds optional bounds in content pane coordinate system to zoom-to-fit to
     */
    zoomToFit(animator, fitBounds) {
      if (!this.isZoomToFitEnabled()) {
        return;
      }

      var panningEnabled = this.isPanningEnabled();
      var panDirection = this.getPanDir();

      var zoomingEnabled = this.isZoomingEnabled();
      this.setPanningEnabled(true);
      this.setPanDir('auto');
      this.setZoomingEnabled(true);
      try {
        var bounds = fitBounds ? fitBounds : this._contentPane.getDimensions();
        if (!bounds) return;

        var dzx = (this._ww - 2 * this._zoomToFitPadding) / bounds.w;
        var dzy = (this._hh - 2 * this._zoomToFitPadding) / bounds.h;
        var dz = Math.min(dzx, dzy);
        dz = this.ConstrainZoom(dz);

        var cxBounds = (bounds.x + bounds.w / 2) * dz;
        var cyBounds = (bounds.y + bounds.h / 2) * dz;
        var dx = this._ww / 2 - cxBounds;
        var dy = this._hh / 2 - cyBounds;

        var oldZoom = this.getZoom(animator);
        var thisRef = this;
        var fireStartEventFunc = () => {
          thisRef.FireZoomEvent('zoomToFitBegin', null, null, animator);
        };
        var fireEndEventFunc = () => {
          thisRef.FireZoomEvent('zoomToFitEnd', thisRef.getZoom(), oldZoom, animator);
        };

        if (!animator) fireStartEventFunc();
        else dvt.Playable.prependOnInit(animator, fireStartEventFunc);

        this.zoomTo(dz, 0, 0, animator, true);
        this.panTo(dx, dy, animator);

        if (animator) {
          dvt.Playable.appendOnEnd(animator, fireEndEventFunc);
        } else {
          fireEndEventFunc();
        }
      } finally {
        this.setPanningEnabled(panningEnabled);
        this.setPanDir(panDirection);
        this.setZoomingEnabled(zoomingEnabled);
      }
    }

    /**
     * Calculate the zoom-to-fit scale.
     * @param {dvt.Rectangle} bounds optional bounds in content pane coordinate system to calculate zoom-to-fit scale to
     */
    calcZoomToFitScale(bounds) {
      if (!bounds) {
        bounds = this._contentPane.getDimensions();
      }

      var dzx = (this._ww - 2 * this._zoomToFitPadding) / bounds.w;
      var dzy = (this._hh - 2 * this._zoomToFitPadding) / bounds.h;
      var dz = Math.min(dzx, dzy);
      dz = this.ConstrainZoom(dz);

      return dz;
    }

    /**
     * Calculate the zoom-to-fit dimensions.
     */
    calcZoomToFitBounds() {
      var bounds = this._contentPane.getDimensions();
      bounds.x -= this._zoomToFitPadding;
      bounds.y -= this._zoomToFitPadding;
      bounds.w += 2 * this._zoomToFitPadding;
      bounds.h += 2 * this._zoomToFitPadding;

      return bounds;
    }

    /**
     * Get the current viewport in the coordinate system of the content pane.
     * @return  {dvt.Rectangle}  current viewport
     */
    getViewport() {
      var topLeftGlobal = this.localToStage(new dvt.Point(0, 0));
      var bottomRightGlobal = this.localToStage(new dvt.Point(this._ww, this._hh));
      var topLeftLocal = this.getContentPane().stageToLocal(topLeftGlobal);
      var bottomRightLocal = this.getContentPane().stageToLocal(bottomRightGlobal);
      return new dvt.Rectangle(
        topLeftLocal.x,
        topLeftLocal.y,
        bottomRightLocal.x - topLeftLocal.x,
        bottomRightLocal.y - topLeftLocal.y
      );
    }

    /**
     * @protected
     * Set whether constraints should be elastic, with overflow and bounce back.
     */
    SetElasticConstraints(bElastic) {
      this._bElasticConstraints = bElastic;

      //if turning on, stop any previously running bounce back anim
      if (bElastic) {
        if (this._elasticConstraintsAnim) {
          if (this._elasticConstraintsAnim.isRunning()) {
            this._elasticConstraintsAnim.stop();
          }
          this._elasticConstraintsAnim = null;
        }
      }
      //if turning off, animate the bounce back to constraint values
      else {
        var currX = this.getPanX();
        var currY = this.getPanY();
        var currZoom = this.getZoom();
        this._bElasticPan = currX != this.ConstrainPanX(currX) || currY != this.ConstrainPanY(currY);
        this._bElasticZoom = currZoom != this.ConstrainZoom(currZoom);
        if (this._bElasticPan || this._bElasticZoom) {
          this._elasticConstraintsAnim = new dvt.Animator(this.getCtx(), 0.4);
          //do cubicOut easing so that the anim happens fast at the beginning and slows down at the end,
          //to make it seem like an elastic
          this._elasticConstraintsAnim.setEasing(dvt.Easing.cubicOut);
          //if zoom beyond constraint, constrain it
          if (this._bElasticZoom) {
            this.zoomBy(1, 0.5 * this._ww, 0.5 * this._hh, this._elasticConstraintsAnim);
          }
          //if pan is beyond constraints, constrain it
          if (this._bElasticPan) {
            this.panBy(0, 0, this._elasticConstraintsAnim);
          }

          dvt.Playable.appendOnEnd(
            this._elasticConstraintsAnim,
            this._elasticConstraintsAnimOnEnd,
            this
          );
          if (this._bElasticPan)
            this.FirePanEvent(
              'elasticAnimBegin',
              null,
              null,
              null,
              null,
              this._elasticConstraintsAnim
            );
          if (this._bElasticZoom)
            this.FireZoomEvent(
              'elasticAnimBegin',
              null,
              null,
              null,
              null,
              this._elasticConstraintsAnim
            );
          this._view.dispatchEvent(dvt.EventFactory.newEvent('notready'));
          this._elasticConstraintsAnim.play();
        } else {
          this.writebackPan();
          this._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
        }
      }
    }

    /**
     * @protected
     * Determine whether constraints are elastic, with overflow and bounce back.
     */
    IsElasticConstraints() {
      return this._bElasticConstraints;
    }

    /**
     * @private
     */
    _elasticConstraintsAnimOnEnd() {
      this._elasticConstraintsAnim = null;
      if (this._bElasticPan) this.FirePanEvent('elasticAnimEnd');
      if (this._bElasticZoom) this.FireZoomEvent('elasticAnimEnd');
      this._view.dispatchEvent(dvt.EventFactory.newEvent('ready'));
    }

    /**
     * @private
     * Damping function for elastic pan constraints.
     */
    _panDampingFunc(delta, whole) {
      //parabola centered at (0,0) expanding to the right: y ^ 2 = 4 * a * x
      var a = 0.01 * whole;
      return Math.sqrt(4 * a * delta);
    }

    /**
     * @private
     * Damping function for elastic zoom constraints.
     */
    _zoomDampingFunc(delta, whole) {
      //parabola centered at (0,0) expanding to the right: y ^ 2 = 4 * a * x
      var a = 0.002 * whole;
      return Math.sqrt(4 * a * delta);
    }

    /**
     * @protected
     * Constrain horizontal panning if needed
     * @param {number} xx new horizontal position
     * @return {number} adjusted horizontal position
     */
    ConstrainPanX(xx) {
      var offsetX = xx;
      var dx;
      if (this._minPanX != null && offsetX < this._minPanX) {
        //if elastic constraints, damp the constraint overflow delta
        if (this.IsElasticConstraints()) {
          dx = this._minPanX - offsetX;
          offsetX = this._minPanX - this._panDampingFunc(dx, this._ww);
        } else {
          offsetX = this._minPanX;
        }
      }
      if (this._maxPanX != null && offsetX > this._maxPanX) {
        //if elastic constraints, damp the constraint overflow delta
        if (this.IsElasticConstraints()) {
          dx = offsetX - this._maxPanX;
          offsetX = this._maxPanX + this._panDampingFunc(dx, this._ww);
        } else {
          offsetX = this._maxPanX;
        }
      }
      return offsetX;
    }

    /**
     * @protected
     * Constrain vertical panning if needed
     * @param {number} xx new vertical position
     * @return {number} adjusted vertical position
     */
    ConstrainPanY(yy) {
      var offsetY = yy;
      var dy;
      if (this._minPanY != null && offsetY < this._minPanY) {
        //if elastic constraints, damp the constraint overflow delta
        if (this.IsElasticConstraints()) {
          dy = this._minPanY - offsetY;
          offsetY = this._minPanY - this._panDampingFunc(dy, this._hh);
        } else {
          offsetY = this._minPanY;
        }
      }
      if (this._maxPanY != null && offsetY > this._maxPanY) {
        //if elastic constraints, damp the constraint overflow delta
        if (this.IsElasticConstraints()) {
          dy = offsetY - this._maxPanY;
          offsetY = this._maxPanY + this._panDampingFunc(dy, this._hh);
        } else {
          offsetY = this._maxPanY;
        }
      }
      return offsetY;
    }

    /**
     * Applies zoom constraints to the specified zoom level
     *
     * @param {number} zz the specified zoom level
     *
     * @return {number} the constrained zoom level
     * @protected
     */
    ConstrainZoom(zz) {
      var newZ = Math.max(0, zz); // zoom can't be negative
      var dz;
      if (this._minZoom && newZ < this._minZoom) {
        //if elastic constraints, damp the constraint overflow delta
        if (this.IsElasticConstraints()) {
          dz = this._minZoom - newZ;
          newZ = this._minZoom - this._zoomDampingFunc(dz, this._maxZoom - this._minZoom); //TO DO: what if no min/max?
        } else {
          newZ = this._minZoom;
        }
      }
      if (this._maxZoom && newZ > this._maxZoom) {
        //if elastic constraints, damp the constraint overflow delta
        if (this.IsElasticConstraints()) {
          dz = newZ - this._maxZoom;
          newZ = this._maxZoom + this._zoomDampingFunc(dz, this._maxZoom - this._minZoom); //TO DO: what if no min/max?
        } else {
          newZ = this._maxZoom;
        }
      }
      return newZ;
    }

    static RoundFloatForCompare(n) {
      return Math.round(n * 100000);
    }

    /**
     * @protected
     * Get the position relative to the stage of the given mouse event.
     * @param {object} event mouse event
     * @return {dvt.Point}
     */
    GetRelativeMousePosition(event) {
      return this.getCtx().pageToStageCoords(event.pageX, event.pageY);
    }

    /**
     * @protected
     */
    FirePanEvent(subtype, newX, newY, oldX, oldY, animator, zoom) {
      var panEvent = dvt.EventFactory.newPanEvent(subtype, newX, newY, oldX, oldY, animator, zoom);
      this.FireListener(panEvent);
    }

    /**
     * Fires a zoom event to listeners
     *
     * @param {string}  subtype  subtype of the event
     * @param {number}  newZoom  new zoom factor
     * @param {number}  oldZoom  old zoom factor
     * @param {dvt.Animator}  animator  optional animator used to animate the zoom
     * @param {number}  xx  horizontal center of zoom
     * @param {number}  yy  vertical center of zoom
     * @param {number}  panX  optional current X position
     * @param {number}  panY  optional current Y position
     * @param {boolean} panAndZoom optional if true, both zoom + pan changes are occurring
     * @protected
     */
    FireZoomEvent(subtype, newZoom, oldZoom, animator, xx, yy, panX, panY, panAndZoom) {
      var point = panX != null && panY != null ? new dvt.Point(panX, panY) : null;
      var zoomEvent = dvt.EventFactory.newZoomEvent(
        subtype,
        newZoom,
        oldZoom,
        animator,
        new dvt.Point(xx, yy),
        point,
        panAndZoom
      );
      this.FireListener(zoomEvent);
      return zoomEvent;
    }

    zoomAndCenter() {
      this.FireZoomEvent('zoomAndCenter');
    }

    /**
     * Get the next incremental, increasing, zoom level.
     *
     * @param currZoom current zoom level
     *
     * @return next zoom level
     */
    getNextZoomLevel(currZoom) {
      var zoomLevel = currZoom;

      zoomLevel += this.getZoomIncr();
      if (zoomLevel > this.getMaxZoom()) zoomLevel = this.getMaxZoom();

      return zoomLevel;
    }

    /**
     * Get the previous incremental, decreasing, zoom level.
     *
     * @param currZoom current zoom level
     *
     * @return previous zoom level
     */
    getPrevZoomLevel(currZoom) {
      var zoomLevel = currZoom;

      zoomLevel -= this.getZoomIncr();
      if (zoomLevel < this.getMinZoom()) zoomLevel = this.getMinZoom();

      return zoomLevel;
    }

    /**
     * Get the increment to use for zooming.
     *
     * @return zoom increment
     */
    getZoomIncr() {
      return this._zoomIncrement;
    }

    /**
     * Get the increment to use for panning.
     *
     * @return pan increment
     */
    getPanIncr() {
      return this._panIncrement;
    }

    /**
     * Set the minimum zoom factor allowed.
     * The default is .1.
     *
     * @param n minimum zoom factor
     */
    setMinZoom(n) {
      this._minZoom = n;
    }

    /**
     * Get the minimum zoom factor allowed.
     *
     * @return minimum zoom factor
     */
    getMinZoom() {
      return this._minZoom;
    }

    /**
     * Set the maximum zoom factor allowed.
     *
     * @param n maximum zoom factor
     */
    setMaxZoom(n) {
      if (n < 0) n = 1;
      this._maxZoom = n;
    }

    /**
     * Get the maximum zoom factor allowed.
     *
     * @return maximum zoom factor
     */
    getMaxZoom() {
      return this._maxZoom;
    }

    /**
     * Set the minimum x coord allowed.
     * The default is NaN, meaning there is no minimum.
     *
     * @param n minimum x coord
     */
    setMinPanX(n) {
      this._minPanX = n;
    }

    /**
     * Get the minimum x coord allowed.
     *
     * @return minimum x coord
     */
    getMinPanX() {
      return this._minPanX;
    }

    /**
     * Set the maximum x coord allowed.
     * The default is NaN, meaning there is no maximum.
     *
     * @param n maximum x coord
     */
    setMaxPanX(n) {
      this._maxPanX = n;
    }

    /**
     * Get the maximum x coord allowed.
     *
     * @return maximum x coord
     */
    getMaxPanX() {
      return this._maxPanX;
    }

    /**
     * Set the minimum y coord allowed.
     * The default is NaN, meaning there is no minimum.
     *
     * @param n minimum y coord
     */
    setMinPanY(n) {
      this._minPanY = n;
    }

    /**
     * Get the minimum y coord allowed.
     *
     * @return minimum y coord
     */
    getMinPanY() {
      return this._minPanY;
    }

    /**
     * Set the maximum y coord allowed.
     * The default is NaN, meaning there is no maximum.
     *
     * @param n maximum y coord
     */
    setMaxPanY(n) {
      this._maxPanY = n;
    }

    /**
     * Get the maximum y coord allowed.
     *
     * @return maximum y coord
     */
    getMaxPanY() {
      return this._maxPanY;
    }

    /**
     * Sets the animation duration (in seconds) for zoom interactions
     *
     * @param animationDuration the animation duration (in seconds)
     */
    setAnimDur(animationDuration) {
      this._animationDuration = animationDuration;
    }

    /**
     * Gets the animation duration (in seconds) for zoom interactions
     *
     * @return the animation duration (in seconds)
     */
    getAnimDur() {
      return this._animationDuration;
    }
    /**
     * Sets whether panning is enabled
     *
     * @param {boolean} panningEnabled true if panning is enabled
     */
    setPanningEnabled(panningEnabled) {
      this._bPanningEnabled = panningEnabled;
    }
    /**
     * Returns true if panning is enabled
     *
     * @return {boolean} true if panning is enabled
     */
    isPanningEnabled() {
      return this._bPanningEnabled;
    }

    /**
     * Sets the direction panning is enabled
     *
     * @param {string} panDirection the direction panning is enabled
     */
    setPanDir(panDirection) {
      this._panDirection = panDirection;
    }
    /**
     * Returns direction panning is enabled
     *
     * @return {string} direction panning is enabled
     */
    getPanDir() {
      return this._panDirection;
    }

    setZoomingEnabled(zoomingEnabled) {
      this._bZoomingEnabled = zoomingEnabled;
    }

    isZoomingEnabled() {
      return this._bZoomingEnabled;
    }

    setZoomToFitEnabled(zoomToFitEnabled) {
      this._bZoomToFitEnabled = zoomToFitEnabled;
    }

    isZoomToFitEnabled() {
      return this._bZoomToFitEnabled;
    }

    /**
     * Stores current touch targets (for zoom events)
     * @param {array} targets an array of the current touch targets
     */
    setCurrentTouchTargets(targets) {
      this._currTargets = targets;
    }

    /**
     * Returns current touch targets (for zoom events)
     * @return {array} an array of the current touch targets
     */
    getCurrentTouchTargets() {
      return this._currTargets;
    }

    /**
     * Resets touch info, touch map and timers. The method is called after DnD event when touches stored by PanZoomCanvasEventManager become irrelevant.
     */
    resetTouchTargets() {
      if (dvt.Agent.isTouchDevice()) {
        this._currTargets = null;
        this._eventManager.TouchManager.reset();
      }
    }

    /**
     * Ends pan zoom operations
     */
    panZoomEnd() {
      // Fix for the  - ie9/10 initiate dnd then release, diagram snaps to mouse position
      // When AFBlockingGlassPane is added the mouseover events are not comming at the right time. The mouseout and subsequent mouseup are lost.
      // To fix the behavior this method is called by the component when DnD is initiated to compensate the absence of mouseout events.
      this._eventManager.PanZoomEnd();
    }

    /**
     * Enables/disables user interaction
     * @param {boolean} bEnabled True to enable interaction
     */
    setInteractionEnabled(bEnabled) {
      if (!bEnabled) this._eventManager.removeListeners(this);
      else this._eventManager.addListeners(this);
    }

    /**
     * Component destroy function called to prevent memory leaks when component is no longer referenced.
     */
    destroy() {
      // Animation should stopped before the event manager is destroyed since it might access the event manager
      if (this._elasticConstraintsAnim) {
        this._elasticConstraintsAnim.stop(true);
        this._elasticConstraintsAnim = null;
      }
      if (this._eventManager) {
        this._eventManager.removeListeners(this);
        this._eventManager.destroy();
        this._eventManager = null;
      }
      this.setClipPath(null);
      // Always call superclass last for destroy
      super.destroy(this);
    }

    /**
     * Returns the appropriate cursor type.
     * @param {boolean} panOn true during active panning
     * @return {string} The cursor type.
     */
    getCursor(panOn) {
      if (this._bPanningEnabled) {
        return panOn ? dvt.ToolkitUtils.getGrabbingCursor() : dvt.ToolkitUtils.getGrabCursor();
      } else return 'inherit';
    }
  }

  PanZoomCanvas.DEFAULT_PADDING = 20;

  /**
   *  @param {dvt.EventManager} manager The owning dvt.EventManager
   *  @class PanZoomCanvasKeyboardHandler
   *  @extends {dvt.KeyboardHandler}
   *  @constructor
   */
  class PanZoomCanvasKeyboardHandler extends dvt.KeyboardHandler {
    constructor(component, manager) {
      super(manager);
      this._comp = component;
    }

    /**
     * @override
     */
    processKeyDown(event) {
      var keyCode = event.keyCode;
      var canvas = this._comp.getPanZoomCanvas();
      if (keyCode == dvt.KeyboardEvent.PAGE_UP) {
        //TODO handle BiDi panning left/right
        if (event.ctrlKey || event.shiftKey) canvas.panBy(canvas.getPanIncr(), 0);
        else canvas.panBy(0, canvas.getPanIncr());
        event.preventDefault();
      } else if (keyCode == dvt.KeyboardEvent.PAGE_DOWN) {
        if (event.ctrlKey || event.shiftKey) canvas.panBy(-canvas.getPanIncr(), 0);
        else canvas.panBy(0, -canvas.getPanIncr());
        event.preventDefault();
      } else if (dvt.KeyboardEvent.isEquals(event) || dvt.KeyboardEvent.isPlus(event)) {
        canvas.zoomTo(canvas.getZoom() + canvas.getZoomIncr());
      } else if (dvt.KeyboardEvent.isMinus(event) || dvt.KeyboardEvent.isUnderscore(event)) {
        canvas.zoomTo(canvas.getZoom() - canvas.getZoomIncr());
      } else if (
        (keyCode == dvt.KeyboardEvent.ZERO || keyCode == dvt.KeyboardEvent.NUMPAD_ZERO) &&
        !event.ctrlKey &&
        !event.shiftKey
      ) {
        canvas.zoomToFit();
      } else {
        return super.processKeyDown(event);
      }
      return undefined;
    }
  }

  /**
   * A component that supports panning and zooming
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @constructor
   * @protected
   */
  class PanZoomComponent extends dvt.BaseComponent {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      // IE11 does not support vector-effects=non-scaling-stroke so we still need to set stroke width based on zoom
      this._bSupportsVectorEffects = !(
        (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') &&
        dvt.Agent.version <= 11
      );
      this._resourcesMap = null;
      this._panAnimator = null;
      this._panningInterrupted = false;
    }

    /**
     * Returns the PanZoomCanvas associated with this component
     * @return {PanZoomCanvas}
     */
    getPanZoomCanvas() {
      return this._panZoomCanvas;
    }

    /**
     * @override
     */
    render(options, width, height) {
      this.Width = width;
      this.Height = height;
      this._isResize = !options;

      // - buttons not responding in firefox if hierarchy viewer present
      //If component is resized before initializing the canvas, don't render the component
      //There is nothing to resize without pan zoom canvas
      if (this.IsResize() && !this.getPanZoomCanvas()) return;

      this.PreRender();

      // Process data
      if (!this.IsResize()) {
        this.SetOptions(options);
      }

      this.Render(options, width, height);
      this.UpdateAriaAttributes();
    }

    /**
     * Returns whether or not the current rendering technology supports vector effects.
     * @return {boolean}
     */
    supportsVectorEffects() {
      return this._bSupportsVectorEffects;
    }

    /**
     * A hook for handling a canvas pan event
     * @param {object} event The pan event sent from the PanZoomCanvas
     * @protected
     */
    HandlePanEvent(event) {
      // subclasses should override
    }

    /**
     * A hook for handling a canvas zoom event
     * @param {object} event The zoom event sent form the PanZoomCanvas
     * @protected
     */
    HandleZoomEvent(event) {
      // subclasses should override
    }

    /**
     * Returns whether the current render was caused by a resize event
     * @return {boolean}
     * @protected
     */
    IsResize() {
      return this._isResize;
    }

    /**
     * A hook for component logic before new data is processed and Render is called
     * @protected
     */
    PreRender() {
      // subclasses should override
    }

    /**
     * Rendering method called after PreRender and new data is processed
     * @protected
     */
    Render() {
      // Create the pan zoom canvas or update its size for a resize event
      if (!this.IsResize()) {
        if (this._panZoomCanvas) {
          this.removeChild(this._panZoomCanvas);
          this._panZoomCanvas = null;
        }

        // Create the pan zoom canvas
        this._panZoomCanvas = new PanZoomCanvas(
          this.getCtx(),
          this.getWidth(),
          this.getHeight(),
          this
        );
        this._panZoomCanvas.addEvtListener('dvtPan', this.HandlePanEvent, false, this);
        this._panZoomCanvas.addEvtListener('dvtZoom', this.HandleZoomEvent, false, this);
        this.addChild(this._panZoomCanvas);
      } else {
        this._panZoomCanvas.setSize(this.getWidth(), this.getHeight());
      }
      var clipPath = new dvt.ClipPath('comp');
      clipPath.addRect(this.getTranslateX(), this.getTranslateY(), this.getWidth(), this.getHeight());
      this.setClipPath(clipPath);
    }

    /**
     * @override
     */
    SetOptions(options) {
      super.SetOptions(options);
      this.Options = this.Defaults ? this.Defaults.calcOptions(options) : options;
    }

    /**
     * @override
     */
    destroy() {
      if (this._panZoomCanvas) {
        this._panZoomCanvas.destroy();
        this._panZoomCanvas = null;
      }
      // Always call superclass last for destroy
      super.destroy();
    }

    /**
     * Ensures the displayable is in viewport
     * @param {dvt.KeyboardEvent} event
     * @param {DvtKeyboardNavigable} navigable The keyboard navigable, different for tmap
     */
    ensureObjInViewport(event, navigable) {
      if (!this._panZoomCanvas.isPanningEnabled()) {
        return;
      }
      if (this._panAnimator) {
        this._panningInterrupted = true;
        this._panAnimator.stop();
      }
      var width = this.Width;
      var height = this.Height;
      var dimensions = navigable.getKeyboardBoundingBox(this.getCtx().getStage());
      var viewport = new dvt.Rectangle(0, 0, width, height);
      if (viewport.getUnion(dimensions).equals(viewport)) {
        //navigable is entirely inside the viewport
        return;
      }
      var panX = 0;
      var panY = 0;
      var objW = dimensions.w;
      var objH = dimensions.h;
      var objX = dimensions.x;
      var objY = dimensions.y;
      if (objW <= width) {
        if (objX < 0) {
          panX = objX;
        } else if (objX + objW > width) {
          panX = objX + objW - width;
        }
      } else {
        panX = objX + 0.5 * objW - 0.5 * width;
      }
      if (objH <= height) {
        if (objY < 0) {
          panY = objY;
        } else if (objY + objH > height) {
          panY = objY + objH - height;
        }
      } else {
        panY = objY + 0.5 * objH - 0.5 * height;
      }

      var animator = new dvt.Animator(this.getCtx(), this.getAnimDur());
      this._panAnimator = animator;
      var thisRef = this;
      var fireEndEventPanFunc = () => {
        thisRef._panAnimator = null;
        thisRef.getEventManager().showFocusEffect(event, navigable);
        thisRef._panningInterrupted = false;
      };
      this.getPanZoomCanvas().panBy(-panX, -panY, animator, fireEndEventPanFunc);
      animator.play();
    }

    /**
     * Returns whether the component is currently panning
     * @return {boolean} true is component is currently panning
     */
    isPanning() {
      return this._panAnimator != null || this._panningInterrupted;
    }
  }

  exports.PanZoomCanvas = PanZoomCanvas;
  exports.PanZoomCanvasEventManager = PanZoomCanvasEventManager;
  exports.PanZoomCanvasKeyboardHandler = PanZoomCanvasKeyboardHandler;
  exports.PanZoomComponent = PanZoomComponent;

  Object.defineProperty(exports, '__esModule', { value: true });

});
