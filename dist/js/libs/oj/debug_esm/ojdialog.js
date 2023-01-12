/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { PopupWhenReadyMediator } from 'ojs/ojpopupcore';
import 'ojs/ojbutton';
import 'jqueryui-amd/widgets/mouse';
import 'jqueryui-amd/widgets/draggable';
import $ from 'jquery';
import oj from 'ojs/ojcore-base';
import { removeResizeListener, addResizeListener, isAncestorOrSelf, getCSSLengthAsFloat } from 'ojs/ojdomutils';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';
import { subtreeAttached, subtreeDetached, setDefaultOptions, createDynamicPropertyGetter } from 'ojs/ojcomponentcore';
import { startAnimation } from 'ojs/ojanimation';
import FocusUtils from 'ojs/ojfocusutils';
import { CustomElementUtils } from 'ojs/ojcustomelement-utils';
import { getDeviceRenderMode } from 'ojs/ojconfig';

(function () {
  const OJ_RESIZABLE_HANDLE_SELECTOR = '.oj-resizable-handle';
  const OJ_RESIZABLE_RESIZE = 'oj-resizable-alsoresize';

  $.widget('oj.ojResizable', {
    version: '1.0.0',
    widgetEventPrefix: 'oj',
    options: {
      // ///////////////////////////////////////////////////////////////////////////////////
      //
      // Mouse Options (copied)
      //
      // ///////////////////////////////////////////////////////////////////////////////////

      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      cancel: 'input,textarea,button,select,option',
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      distance: 1,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      delay: 0,
      // ///////////////////////////////////////////////////////////////////////////////////
      //
      // Resize Options
      //
      // ///////////////////////////////////////////////////////////////////////////////////

      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      maxHeight: null,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      maxWidth: null,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      minHeight: 10,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      minWidth: 10,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      alsoResize: false,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      animate: false,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      animateDuration: 'slow',
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      animateEasing: 'swing',
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      containment: false,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      ghost: false,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      grid: false,
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      handles: 'e,s,se',
      /**
       *
       * @private
       * @expose
       * @memberof! oj.ojResizable
       * @instance
       *
       */
      helper: false,
      // See #7960
      // zIndex: 90,

      // ///////////////
      // callbacks
      // ///////////////

      /**
       * Triggered when the ojResizable is resized.
       *
       * @private
       * @expose
       * @event
       * @name resize
       * @memberof! oj.ojResizable
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Empty object included for consistency with other events
       *
       * @example <caption>Initialize the resizable with the <code class="prettyprint">resize</code> callback specified:</caption>
       * $( ".selector" ).ojResizable({
       *     "resize": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojresize</code> event:</caption>
       * $( ".selector" ).on( "ojresize", function( event, ui ) {} );
       */
      resize: null,
      /**
       * Triggered on the start of a resize operation.
       *
       * @private
       * @expose
       * @event
       * @name start
       * @memberof! oj.ojResizable
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Empty object included for consistency with other events
       *
       * @example <caption>Initialize the resizable with the <code class="prettyprint">start</code> callback specified:</caption>
       * $( ".selector" ).ojResizable({
       *     "start": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojstart</code> event:</caption>
       * $( ".selector" ).on( "ojstart", function( event, ui ) {} );
       */
      // note - jqui doc has .on("resizestart"
      start: null,
      /**
       * Triggered on the end of a resize operation.
       *
       * @private
       * @expose
       * @event
       * @name stop
       * @memberof! oj.ojResizable
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Empty object included for consistency with other events
       *
       * @example <caption>Initialize the resizable with the <code class="prettyprint">stop</code> callback specified:</caption>
       * $( ".selector" ).ojResizable({
       *     "stop": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojstop</code> event:</caption>
       * $( ".selector" ).on( "ojstop", function( event, ui ) {} );
       */
      // note - jqui doc has .on("resizestop"
      stop: null
    },
    // ///////////////////////////////////////////////////////////////////////////////////
    //
    // Original Resize Functions
    //
    // ///////////////////////////////////////////////////////////////////////////////////

    _num: function (value) {
      return parseInt(value, 10) || 0;
    },
    _isNumber: function (value) {
      return !isNaN(parseInt(value, 10));
    },
    _hasScroll: function (_el, a) {
      var el = _el;
      if ($(el).css('overflow') === 'hidden') {
        return false;
      }

      var scroll = a && a === 'left' ? 'scrollLeft' : 'scrollTop';
      var has = false;

      if (el[scroll] > 0) {
        return true;
      }

      // TODO: determine which cases actually cause this to happen
      // if the element doesn't have the scroll set, see if it's possible to
      // set the scroll
      el[scroll] = 1;
      has = el[scroll] > 0;
      el[scroll] = 0;
      return has;
    },
    /**
     * Triggered when the ojResizable is created.
     *
     * @private
     * @expose
     * @event
     * @name create
     * @memberof! oj.ojResizable
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Empty object included for consistency with other events
     *
     * @example <caption>Initialize the resizable with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojResizable({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // note - jqui has on("resizecreate", ... need to verify if we need some form of "ojcreate".
    _create: function () {
      this._super();

      var n;
      var i;
      var handle;
      var axis;
      var hname;
      var that = this;
      var o = this.options;

      //
      // Create an instance of the 3rd party jqueryui mouse widget.
      //

      var mouseConstructor = this.element.mouse.bind(this.element);
      mouseConstructor();
      this.mouse = mouseConstructor('instance');

      //
      // Because we aggregating the mouse widget (and not extending it),
      // we override the protected methods of this mouse instance.
      //

      this.mouse._mouseCapture = function (event) {
        return that._mouseCapture(event);
      };

      this.mouse._mouseStart = function (event) {
        return that._mouseStart(event);
      };

      this.mouse._mouseDrag = function (event) {
        return that._mouseDrag(event);
      };

      this.mouse._mouseStop = function (event) {
        if (this.element) {
          this.element.focus();
        }
        return that._mouseStop(event);
      };

      this.element.addClass('oj-resizable');

      $.extend(this, {
        originalElement: this.element,
        _proportionallyResizeElements: [],
        // _helper: o.helper || o.ghost || o.animate ? o.helper || "oj-resizable-helper" : null
        _helper: null
      });

      this._initialResize = true;

      this.handles =
        o.handles ||
        (!$(OJ_RESIZABLE_HANDLE_SELECTOR, this.element).length
          ? 'e,s,se'
          : {
              n: '.oj-resizable-n',
              e: '.oj-resizable-e',
              s: '.oj-resizable-s',
              w: '.oj-resizable-w',
              se: '.oj-resizable-se',
              sw: '.oj-resizable-sw',
              ne: '.oj-resizable-ne',
              nw: '.oj-resizable-nw'
            });

      if (this.handles.constructor === String) {
        if (this.handles === 'all') {
          this.handles = 'n,e,s,w,se,sw,ne,nw';
        }

        n = this.handles.split(',');
        this.handles = {};

        for (i = 0; i < n.length; i++) {
          handle = $.trim(n[i]);
          hname = 'oj-resizable-' + handle;
          axis = $("<div class='oj-resizable-handle " + hname + "'></div>");

          this.handles[handle] = '.oj-resizable-' + handle;
          this.element.append(axis); // @HTMLUpdateOK
        }
      }

      var keys = Object.keys(this.handles);
      for (i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (this.handles[k].constructor === String) {
          this.handles[k] = this.element.children(this.handles[k]).first().show();
        }
      }

      this._handles = $(OJ_RESIZABLE_HANDLE_SELECTOR, this.element);

      this._handles.mouseover(function () {
        if (!that.resizing) {
          if (this.className) {
            axis = this.className.match(/oj-resizable-(se|sw|ne|nw|n|e|s|w)/i);
          }
          that.axis = axis && axis[1] ? axis[1] : 'se';
        }
      });

      this.mouse._mouseInit();
    },
    /**
     * Remove the ojResizable functionality completely.
     * This will return the element back to its pre-init state.
     *
     * <p>This method does not accept any arguments.
     *
     * @private
     * @expose
     * @method
     * @name oj.ojResizable#destroy
     * @memberof! oj.ojResizable
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * var destroy = $( ".selector" ).ojResizable( "destroy" );
     */

    _destroy: function () {
      if (this.mouse) {
        this.mouse._mouseDestroy();
      }

      try {
        this.mouse.destroy();
        this.mouse = null;
      } catch (e) {
        // ignore
      }

      var _destroy = function (exp) {
        $(exp)
          .removeClass('oj-resizable oj-resizable-disabled oj-resizable-resizing')
          .removeData('resizable')
          .removeData('oj-resizable')
          .unbind('.resizable')
          .find(OJ_RESIZABLE_HANDLE_SELECTOR)
          .remove();
      };

      _destroy(this.originalElement);

      return this;
    },
    _mouseCapture: function (event) {
      var capture = false;
      var keys = Object.keys(this.handles);

      for (var i = 0; i < keys.length; i++) {
        var handle = $(this.handles[keys[i]])[0];
        if (handle === event.target || $.contains(handle, event.target)) {
          capture = true;
        }
      }

      return !this.options.disabled && capture;
    },
    _mouseStart: function (event) {
      var curleft;
      var curtop;
      var cursor;
      var o = this.options;
      var iniPos = this.element.position();
      var el = this.element;

      this.resizing = true;

      // Bugfix for http://bugs.jqueryui.com/ticket/1749
      if (/absolute/.test(el.css('position'))) {
        el.css({ position: 'absolute', top: el.css('top'), left: el.css('left') });
      } else if (el.is('.oj-draggable')) {
        el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
      }

      this._renderProxy();

      curleft = this._num(this.helper.css('left'));
      curtop = this._num(this.helper.css('top'));

      if (o.containment) {
        curleft += $(o.containment).scrollLeft() || 0;
        curtop += $(o.containment).scrollTop() || 0;
      }

      this.offset = this.helper.offset();
      this.position = { left: curleft, top: curtop };
      this.size = { width: el.width(), height: el.height() };
      this.originalSize = { width: el.width(), height: el.height() };
      this.originalPosition = { left: curleft, top: curtop };
      this.sizeDiff = {
        width: el.outerWidth() - el.width(),
        height: el.outerHeight() - el.height()
      };
      this.originalMousePosition = { left: event.pageX, top: event.pageY };

      this.aspectRatio = this.originalSize.width / this.originalSize.height || 1;

      cursor = /** @type string */ ($('.oj-resizable-' + this.axis).css('cursor'));
      $('body').css('cursor', cursor === 'auto' ? this.axis + '-resize' : cursor);

      el.addClass('oj-resizable-resizing');

      this._propagate('start', event);

      this._alsoresize_start(event);
      this._containment_start(event);

      return true;
    },
    _mouseDrag: function (event) {
      var data;
      var el = this.helper;
      var props = {};
      var smp = this.originalMousePosition;
      var a = this.axis;
      var dx = event.pageX - smp.left || 0;
      var dy = event.pageY - smp.top || 0;
      var trigger = this._change[a];

      this.prevPosition = {
        top: this.position.top,
        left: this.position.left
      };
      this.prevSize = {
        width: this.size.width,
        height: this.size.height
      };

      if (!trigger) {
        return false;
      }

      data = trigger.apply(this, [event, dx, dy]);

      this._updateVirtualBoundaries(event.shiftKey);
      if (event.shiftKey) {
        data = this._updateRatio(data, event);
      }

      data = this._respectSize(data, event);

      this._updateCache(data);

      this._propagate('resize', event);

      this._alsoresize_resize(event, this.ui());
      this._containment_resize(event, this.ui());

      if (this.position.top !== this.prevPosition.top) {
        props.top = this.position.top + 'px';
      }
      if (this.position.left !== this.prevPosition.left) {
        props.left = this.position.left + 'px';
      }
      if (this.size.width !== this.prevSize.width) {
        props.width = this.size.width + 'px';
      }
      if (this.size.height !== this.prevSize.height) {
        props.height = this.size.height + 'px';
      }
      el.css(props);

      if (!this._helper && this._proportionallyResizeElements.length) {
        this._proportionallyResize();
      }

      if (!$.isEmptyObject(props)) {
        this._trigger('resize', event, this.ui());
      }

      return false;
    },
    _mouseStop: function (event) {
      this.resizing = false;
      $('body').css('cursor', 'auto');

      this.element.removeClass('oj-resizable-resizing');

      this._propagate('stop', event);

      this._alsoresize_stop(event);
      this._containment_stop(event);

      return false;
    },
    _updateVirtualBoundaries: function (forceAspectRatio) {
      var pMinWidth;
      var pMaxWidth;
      var pMinHeight;
      var pMaxHeight;
      var b;
      var o = this.options;

      b = {
        minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
        maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : Infinity,
        minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
        maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : Infinity

        /*
           minWidth: 0,
           maxWidth: Infinity,
           minHeight: 0,
           maxHeight: Infinity
           */
      };

      if (forceAspectRatio) {
        pMinWidth = b.minHeight * this.aspectRatio;
        pMinHeight = b.minWidth / this.aspectRatio;
        pMaxWidth = b.maxHeight * this.aspectRatio;
        pMaxHeight = b.maxWidth / this.aspectRatio;

        if (pMinWidth > b.minWidth) {
          b.minWidth = pMinWidth;
        }
        if (pMinHeight > b.minHeight) {
          b.minHeight = pMinHeight;
        }
        if (pMaxWidth < b.maxWidth) {
          b.maxWidth = pMaxWidth;
        }
        if (pMaxHeight < b.maxHeight) {
          b.maxHeight = pMaxHeight;
        }
      }
      this._vBoundaries = b;
    },
    _updateCache: function (data) {
      this.offset = this.helper.offset();
      if (this._isNumber(data.left)) {
        this.position.left = data.left;
      }
      if (this._isNumber(data.top)) {
        this.position.top = data.top;
      }
      if (this._isNumber(data.height)) {
        this.size.height = data.height;
      }
      if (this._isNumber(data.width)) {
        this.size.width = data.width;
      }
    },
    _updateRatio: function (_data) {
      var data = _data;
      var cpos = this.position;
      var csize = this.size;
      var a = this.axis;

      if (this._isNumber(data.height)) {
        data.width = data.height * this.aspectRatio;
      } else if (this._isNumber(data.width)) {
        data.height = data.width / this.aspectRatio;
      }

      if (a === 'sw') {
        data.left = cpos.left + (csize.width - data.width);
        data.top = null;
      }
      if (a === 'nw') {
        data.top = cpos.top + (csize.height - data.height);
        data.left = cpos.left + (csize.width - data.width);
      }

      return data;
    },
    _respectSize: function (_data) {
      var data = _data;
      var o = this._vBoundaries;
      var a = this.axis;
      var ismaxw = this._isNumber(data.width) && o.maxWidth && o.maxWidth < data.width;
      var ismaxh = this._isNumber(data.height) && o.maxHeight && o.maxHeight < data.height;
      var isminw = this._isNumber(data.width) && o.minWidth && o.minWidth > data.width;
      var isminh = this._isNumber(data.height) && o.minHeight && o.minHeight > data.height;
      var dw = this.originalPosition.left + this.originalSize.width;
      var dh = this.position.top + this.size.height;
      var cw = /sw|nw|w/.test(a);
      var ch = /nw|ne|n/.test(a);

      if (isminw) {
        data.width = o.minWidth;
      }
      if (isminh) {
        data.height = o.minHeight;
      }
      if (ismaxw) {
        data.width = o.maxWidth;
      }
      if (ismaxh) {
        data.height = o.maxHeight;
      }

      if (isminw && cw) {
        data.left = dw - o.minWidth;
      }
      if (ismaxw && cw) {
        data.left = dw - o.maxWidth;
      }
      if (isminh && ch) {
        data.top = dh - o.minHeight;
      }
      if (ismaxh && ch) {
        data.top = dh - o.maxHeight;
      }

      // Fixing jump error on top/left 
      if (!data.width && !data.height && !data.left && data.top) {
        data.top = null;
      } else if (!data.width && !data.height && !data.top && data.left) {
        data.left = null;
      }

      return data;
    },
    _proportionallyResize: function () {
      if (!this._proportionallyResizeElements.length) {
        return;
      }

      var i;
      var j;
      var borders;
      var paddings;
      var prel;
      var element = this.helper || this.element;

      for (i = 0; i < this._proportionallyResizeElements.length; i++) {
        prel = this._proportionallyResizeElements[i];

        if (!this.borderDif) {
          this.borderDif = [];
          borders = [
            prel.css('borderTopWidth'),
            prel.css('borderRightWidth'),
            prel.css('borderBottomWidth'),
            prel.css('borderLeftWidth')
          ];
          paddings = [
            prel.css('paddingTop'),
            prel.css('paddingRight'),
            prel.css('paddingBottom'),
            prel.css('paddingLeft')
          ];

          for (j = 0; j < borders.length; j++) {
            this.borderDif[j] = (parseInt(borders[j], 10) || 0) + (parseInt(paddings[j], 10) || 0);
          }
        }

        prel.css({
          height: element.height() - this.borderDif[0] - this.borderDif[2] || 0,
          width: element.width() - this.borderDif[1] - this.borderDif[3] || 0
        });
      }
    },
    _renderProxy: function () {
      var el = this.element;
      this.elementOffset = el.offset();

      this.helper = this.element;
    },
    _change: {
      e: function (event, dx) {
        return { width: this.originalSize.width + dx };
      },
      w: function (event, dx) {
        var cs = this.originalSize;
        var sp = this.originalPosition;
        return { left: sp.left + dx, width: cs.width - dx };
      },
      n: function (event, dx, dy) {
        var cs = this.originalSize;
        var sp = this.originalPosition;
        return { top: sp.top + dy, height: cs.height - dy };
      },
      s: function (event, dx, dy) {
        return { height: this.originalSize.height + dy };
      },
      se: function (event, dx, dy) {
        return $.extend(
          this._change.s.apply(this, arguments),
          this._change.e.apply(this, [event, dx, dy])
        );
      },
      sw: function (event, dx, dy) {
        return $.extend(
          this._change.s.apply(this, arguments),
          this._change.w.apply(this, [event, dx, dy])
        );
      },
      ne: function (event, dx, dy) {
        return $.extend(
          this._change.n.apply(this, arguments),
          this._change.e.apply(this, [event, dx, dy])
        );
      },
      nw: function (event, dx, dy) {
        return $.extend(
          this._change.n.apply(this, arguments),
          this._change.w.apply(this, [event, dx, dy])
        );
      }
    },
    _propagate: function (n, event) {
      //
      // Propage resizeStart and resizeStop events.
      // (resize is propagated internally by drag)
      //

      // $.ui.plugin.call(this, n, [event, this.ui()]);
      if (n !== 'resize') {
        this._trigger(n, event, this.ui());
      }
    },
    // ////////////////////////////////////////////////////////////////////////////////
    //
    // Code block that implements functionality formerly in defined as a plugin.
    // (note: plugin code is deprecated)
    //
    // The alsoResize functionality "also resizes" the dialog body.
    // This approach allows the footer area to remain at a fixed height
    // the dialog is resized.
    //
    // $.ui.plugin.add("resizable", "alsoResize", {
    //
    // ///////////////////////////////////////////////////////////////////////////////

    _alsoresize_start: function () {
      // var that = $(this).resizable( "instance" ),
      // var that = $(this).data("oj-resizable"), // w
      var that = this;
      var o = that.options;

      var _store = function (exp) {
        $(exp).each(function () {
          var el = $(this);

          el.data(OJ_RESIZABLE_RESIZE, {
            width: parseInt(el.width(), 10),
            height: parseInt(el.height(), 10),
            left: parseInt(el.css('left'), 10),
            top: parseInt(el.css('top'), 10)
          });
        });
      };

      if (typeof o.alsoResize === 'object' && !o.alsoResize.parentNode) {
        if (o.alsoResize.length) {
          o.alsoResize = o.alsoResize[0];
          _store(o.alsoResize);
        } else {
          $.each(o.alsoResize, function (exp) {
            _store(exp);
          });
        }
      } else {
        _store(o.alsoResize);
      }
    },
    _alsoresize_resize: function (event, ui) {
      // var that = $(this).resizable( "instance" ),
      // var that = $(this).data("oj-resizable"), // v
      var that = this;

      var o = that.options;
      var os = that.originalSize;
      var op = that.originalPosition;

      var delta = {
        height: that.size.height - os.height || 0,
        width: that.size.width - os.width || 0,
        top: that.position.top - op.top || 0,
        left: that.position.left - op.left || 0
      };
      var _alsoResize = function (exp, c) {
        $(exp).each(function () {
          var el = $(this);
          var start = $(this).data(OJ_RESIZABLE_RESIZE);
          var style = {};
          var css;
          if (c && c.length) {
            css = c;
          } else if (el.parents(ui.originalElement[0]).length) {
            css = ['width', 'height'];
          } else {
            css = ['width', 'height', 'top', 'left'];
          }

          $.each(css, function (i, prop) {
            var sum = (start[prop] || 0) + (delta[prop] || 0);
            if (sum && sum >= 0) {
              style[prop] = sum;
            }
          });

          el.css(style);
        });
      };

      if (typeof o.alsoResize === 'object' && !o.alsoResize.nodeType) {
        $.each(o.alsoResize, function (exp, c) {
          _alsoResize(exp, c);
        });
      } else {
        _alsoResize(o.alsoResize, null);
      }
    },
    _alsoresize_stop: function () {
      $(this).removeData(OJ_RESIZABLE_RESIZE);
    },
    // ///////////////////////////////////////////////////////////////////////////////
    //
    // Code block for containment functionality (formerly defined as a plugin)
    //
    // $.ui.plugin.add( "resizable", "containment", {
    //
    // ///////////////////////////////////////////////////////////////////////////////

    _containment_start: function () {
      var element;
      var p;
      var co;
      var ch;
      var cw;
      var width;
      var height;

      var that = this;

      var o = that.options;
      var el = that.element;
      var oc = o.containment;
      var ce;
      if (oc instanceof $) {
        ce = oc.get(0);
      } else if (/parent/.test(oc)) {
        ce = el.parent().get(0);
      } else {
        ce = oc;
      }

      if (!ce) {
        return;
      }

      that.containerElement = $(ce);

      if (/document/.test(oc) || oc === document) {
        that.containerOffset = {
          left: 0,
          top: 0
        };
        that.containerPosition = {
          left: 0,
          top: 0
        };

        that.parentData = {
          element: $(document),
          left: 0,
          top: 0,
          width: $(document).width(),
          height: $(document).height() || document.body.parentNode.scrollHeight
        };
      } else {
        element = $(ce);
        p = [];
        $(['Top', 'Right', 'Left', 'Bottom']).each(function (i, name) {
          p[i] = that._num(element.css('padding' + name));
        });

        that.containerOffset = element.offset();
        that.containerPosition = element.position();
        that.containerSize = {
          height: element.innerHeight() - p[3],
          width: element.innerWidth() - p[1]
        };

        co = that.containerOffset;
        ch = that.containerSize.height;
        cw = that.containerSize.width;
        width = that._hasScroll(ce, 'left') ? ce.scrollWidth : cw;
        height = that._hasScroll(ce) ? ce.scrollHeight : ch;

        that.parentData = {
          element: ce,
          left: co.left,
          top: co.top,
          width: width,
          height: height
        };
      }
    },
    _containment_resize: function (event, ui) {
      var woset;
      var hoset;
      var isParent;
      var isOffsetRelative;

      // var that = $(this).data("oj-resizable");
      var that = this;

      var o = that.options;
      var co = that.containerOffset;
      var cp = that.position;
      var pRatio = event.shiftKey;
      var cop = {
        top: 0,
        left: 0
      };
      var ce = that.containerElement;
      var continueResize = true;

      if (ce[0] !== document && /static/.test(ce.css('position'))) {
        cop = co;
      }

      if (cp.left < (that._helper ? co.left : 0)) {
        that.size.width += that._helper
          ? that.position.left - co.left
          : that.position.left - cop.left;
        if (pRatio) {
          that.size.height = that.size.width / that.aspectRatio;
          continueResize = false;
        }
        that.position.left = o.helper ? co.left : 0;
      }

      if (cp.top < (that._helper ? co.top : 0)) {
        that.size.height += that._helper ? that.position.top - co.top : that.position.top;
        if (pRatio) {
          that.size.width = that.size.height * that.aspectRatio;
          continueResize = false;
        }
        that.position.top = that._helper ? co.top : 0;
      }

      that.offset.left = that.parentData.left + that.position.left;
      that.offset.top = that.parentData.top + that.position.top;

      woset = Math.abs(
        (that._helper ? that.offset.left - cop.left : that.offset.left - co.left) +
          that.sizeDiff.width
      );
      hoset = Math.abs(
        (that._helper ? that.offset.top - cop.top : that.offset.top - co.top) + that.sizeDiff.height
      );

      isParent = that.containerElement.get(0) === that.element.parent().get(0);
      isOffsetRelative = /relative|absolute/.test(that.containerElement.css('position'));

      if (isParent && isOffsetRelative) {
        woset -= Math.abs(that.parentData.left);
      }

      if (woset + that.size.width >= that.parentData.width) {
        that.size.width = that.parentData.width - woset;
        if (pRatio) {
          that.size.height = that.size.width / that.aspectRatio;
          continueResize = false;
        }
      }

      if (hoset + that.size.height >= that.parentData.height) {
        that.size.height = that.parentData.height - hoset;
        if (pRatio) {
          that.size.width = that.size.height * that.aspectRatio;
          continueResize = false;
        }
      }

      if (!continueResize) {
        that.position.left = ui.prevPosition.left;
        that.position.top = ui.prevPosition.top;
        that.size.width = ui.prevSize.width;
        that.size.height = ui.prevSize.height;
      }
    },
    _containment_stop: function () {
      var that = this;
      var o = that.options;
      var co = that.containerOffset;
      var cop = that.containerPosition;
      var ce = that.containerElement;
      var helper = $(that.helper);
      var ho = helper.offset();
      var w = helper.outerWidth() - that.sizeDiff.width;
      var h = helper.outerHeight() - that.sizeDiff.height;

      if (that._helper && !o.animate && /relative/.test(ce.css('position'))) {
        $(this).css({
          left: ho.left - cop.left - co.left,
          width: w,
          height: h
        });
      }

      if (that._helper && !o.animate && /static/.test(ce.css('position'))) {
        $(this).css({
          left: ho.left - cop.left - co.left,
          width: w,
          height: h
        });
      }
    },
    ui: function () {
      return {
        originalElement: this.originalElement,
        element: this.element,
        helper: this.helper,
        position: this.position,
        size: this.size,
        originalSize: this.originalSize,
        originalPosition: this.originalPosition,
        prevSize: this.prevSize,
        prevPosition: this.prevPosition
      };
    }
  });
})();

(function () {
  // class name constants
  var /** @const */ OJD_BODY = 'oj-dialog-body';
  var /** @const */ OJD_CONTAINER = 'oj-dialog-container';
  var /** @const */ OJD_CONTENT = 'oj-dialog-content';
  var /** @const */ OJD_FOOTER = 'oj-dialog-footer';
  var /** @const */ OJD_HEADER = 'oj-dialog-header';
  var /** @const */ OJD_HEADER_CLOSE = 'oj-dialog-header-close';
  var /** @const */ OJD_HEADER_CLOSE_WRAPPER = 'oj-dialog-header-close-wrapper';
  var /** @const */ OJD_OPTION_DEFAULTS = 'oj-dialog-option-defaults';
  var /** @const */ OJD_HELPER_ELEMENT_DIALOG = 'oj-helper-element-in-dialog-with-accesskey';
  var /** @const */ OJD_ACCESS_KEY = 'data-ojAccessKey';

  var /** @const */ OJD_TITLE_CLASS = '.oj-dialog-title';
  var /** @const */ OJD_FOOTER_CLASS = '.oj-dialog-footer';
  var /** @const */ OJD_HEADER_CLASS = '.oj-dialog-header';
  var /** @const */ OJD_BODY_CLASS = '.oj-dialog-body';
  var /** @const */ OJD_CONTENT_CLASS = '.oj-dialog-content';
  var /** @const */ OJD_CONTAINER_CLASS = '.oj-dialog-container';

  var /** @const */ OJ_RESIZABLE = 'oj-resizable';
  var /** @const */ OJ_RESIZABLE_N = 'oj-resizable-n';
  var /** @const */ OJ_RESIZABLE_E = 'oj-resizable-e';
  var /** @const */ OJ_RESIZABLE_S = 'oj-resizable-s';
  var /** @const */ OJ_RESIZABLE_W = 'oj-resizable-w';
  var /** @const */ OJ_RESIZABLE_SE = 'oj-resizable-se';
  var /** @const */ OJ_RESIZABLE_SW = 'oj-resizable-sw';
  var /** @const */ OJ_RESIZABLE_NE = 'oj-resizable-ne';
  var /** @const */ OJ_RESIZABLE_NW = 'oj-resizable-nw';

  var /** @const */ OJ_DRAGGABLE = 'oj-draggable';

  var /** @const */ SLOT_BODY = 'body';
  var /** @const */ SLOT_DEFAULT = '';
  var /** @const */ SLOT_HEADER = 'header';
  var /** @const */ SLOT_FOOTER = 'footer';
  var /** @const */ SLOT_CONTEXTMENU = 'contextMenu';

  /**
   * @typedef {Object} oj.ojDialog.PositionAlign
   * @property {"top"|"bottom"|"center"} [vertical] Vertical alignment.
   * @property {"start"|"end"|"left"|"center"|"right"} [horizontal] Horizontal alignment. <p>
   * <ul>
   *  <li><b>"start"</b> evaluates to "left" in LTR mode and "right" in RTL mode.</li>
   *  <li><b>"end"</b> evaluates to "right" in LTR mode and "left" in RTL mode.</li>
   * </ul>
   *
   */

  /**
   * @typedef {Object} oj.ojDialog.PositionPoint
   * @property {number} [x] Horizontal alignment offset.
   * @property {number} [y] Vertical alignment offset.
   */

  /**
   * @typedef {Object} oj.ojDialog.Position
   * @property {Object} [my] Defines which edge on the popup to align with the target ("of") element.
   * @property {Object} [at] Defines which position on the target element ("of") to align the positioned element
   *                                  against.
   * @property {Object} [offset] Defines a point offset in pixels from the ("my") alignment.
   * @property {string|Object} [of] Which element to position the popup against.
   *
   * If the value is a string, it should be a selector or the literal string value
   * of <code class="prettyprint">window</code>.  Otherwise, a point of x,y.  When a point
   * is used, the values are relative to the whole document.  Page horizontal and vertical
   * scroll offsets need to be factored into this point - see UIEvent
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageX">pageX</a>,
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY">pageY</a>.
   *
   * @property {"flip"|"fit"|"flipfit"|"none"} [collision] Rule for alternate alignment. <p>
   * <ul>
   *  <li><b>"flip"</b> the element to the opposite side of the target and the
   *             collision detection is run again to see if it will fit. Whichever side
   *             allows more of the element to be visible will be used. </li>
   * <li><b>"fit"</b> shift the element away from the edge of the window. </li>
   * <li><b>"flipfit"</b> first applies the flip logic, placing the element
   *  on whichever side allows more of the element to be visible. Then the fit logic
   *  is applied to ensure as much of the element is visible as possible.</li>
   * <li><b>"none"</b> no collision detection.</li>
   * </ul>
   * @ojsignature [{target:"Type", value:"oj.ojDialog.PositionAlign", for:"my", jsdocOverride:true},
   *               {target:"Type", value:"oj.ojDialog.PositionAlign", for:"at", jsdocOverride:true},
   *               {target:"Type", value:"oj.ojDialog.PositionPoint", for:"offset", jsdocOverride:true},
   *               {target:"Type", value:"string|oj.ojDialog.PositionPoint", for:"of", jsdocOverride:true}]
   */

  /**
   * @ojcomponent oj.ojDialog
   * @augments oj.baseComponent
   * @since 0.6.0
   * @ojrole dialog
   * @ojdisplayname Dialog
   * @ojshortdesc A dialog displays a popup window that provides information and gathers input from the application user.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["dialogTitle", "initialVisibility", "style", "modality", "dragAffordance", "cancelBehavior", "resizeBehavior"]}
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 12
   *
   * @ojoracleicon 'oj-ux-ico-dialog'
   * @ojuxspecs ['dialog']
   *
   * @classdesc
   * <h3 id="dialogOverview-section">
   *   JET Dialog Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dialogOverview-section"></a>
   * </h3>
   * <p>Description: Themeable, WAI-ARIA-compliant dialog component.
   * A dialog is a floating window that typically contains a title bar and a content area.
   * The dialog window can be moved by dragging on the title area, and closed with the 'x' icon (by default). Dialogs can also be resized by dragging on edges or corners of the dialog component. </p>
   *
   *<p>If the content length exceeds the maximum height, a scrollbar will automatically appear.</p>
   *
   *<p>A bottom button bar and semi-transparent modal overlay layer are common options that can be added.</p>
   *
   *
   * <h3 id="focus-section">
   *   Focus
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#focus-section"></a>
   * </h3>
   *
   *<p>Upon opening a dialog, focus is automatically moved to the first item that matches the following:</p>
   *<ol>
   *  <li>The first element within the dialog with the <code>autofocus</code> attribute</li>
   *  <li>The first <code>:tabbable</code> element within the dialog body</li>
   *  <li>The first <code>:tabbable</code> element within the dialog footer</li>
   *  <li>The dialog's close button</li>
   *  <li>The dialog itself</li>
   *</ol>
   *<p>While open, the dialog widget ensures that tabbing cycles focus between elements within the dialog itself, not elements outside of it. Modal dialogs additionally prevent mouse users from clicking on elements outside of the dialog.</p>
   *
   *<p>Upon closing a dialog, focus is automatically returned to the element that had focus when the dialog was opened.</p>
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
   *<p>
   *<h3>Sizing</h3>
   *
   * <p> Dialog dimensions, including <code class="prettyprint"> height, width, min-width, max-width, min-height</code> and <code class="prettyprint">max-height</code> are defined with css variables. The default dialog dimensions are the following:
   *
   *<ul>
   *  <li> <code class="prettyprint">height: auto</code> </li>
   *  <li> <code class="prettyprint">width: 600px</code> </li>
   *  <li> <code class="prettyprint">min-width: 200px</code> </li>
   *  <li> <code class="prettyprint">max-width: 100vw - 3rem</code> </li>
   *  <li> <code class="prettyprint">max-height: 100vh - 3rem</code> </li>
   *</ul>
   *
   * In most cases, you will want to use the default <code class="prettyprint">height:auto</code>, since this will automatically adjust the height based on the content.
   * Users can change the dialog dimensions using style attributes:
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-dialog id="wideDialog" title="Wide Dialog" style="width: 400px; min-width: 100px; max-width 500px;"&gt;
   *    &lt;div slot="body"&gt;
   *       &lt;p&gt; Dialog Text
   *    &lt;/div&gt;
   * &lt;/oj-dialog&gt;
   * </code></pre>
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   * <h4> role </h4>
   * By default, the role will be set to dialog.
   * This can be observed by inspecting the DOM:
   *
   * <pre class="prettyprint">
   * <code>
   *  &lt;div class="ojdialog ..." role="dialog"&gt;
   * </code></pre>
   *
   * This can be changed using the role attribute. WAI-ARIA recommends that role="dialog" be used if the dialog expects input (such as text input),
   * otherwise, use the role attribute to assign role="alertdialog".
   *
   * <h4> aria-labelledby </h4>
   *
   * For both default and user-defined headers, the dialog component takes care of aria-labelledby for you.
   * The <code class="prettyprint">aria-labelledby</code> attribute is generated automatically (and set to the id of the header's title).
   * For user-defined headers, the title div is identified by the div that has the <code class="prettyprint">oj-dialog-title</code> class.
   * Note that user-defined headers must have a title div (in order to meet accesibility requirements).
   *
   * <h4> aria-describedby </h4>
   *
   * If the dialog contains additional descriptive text besides the dialog title, this text can be associated
   * with the dialog using the <code class="prettyprint">aria-describedby</code> attribute. Unlike the
   * <code class="prettyprint">aria-labelledby</code> association, the <code class="prettyprint">aria-describedby</code>
   * attribute is not generated and set automatically. It is up to the user to specify the attribute
   * on <code class="prettyprint">oj-dialog</code> and link it to the element containing the additional description:
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-dialog id="dialog" title="Accessible Title" aria-describedby="desc"&gt;
   *    &lt;div slot="body"&gt;
   *       &lt;p id="desc"&gt; This is a dialog with accessible description.
   *    &lt;/div&gt;
   * &lt;/oj-dialog&gt;
   * </code></pre>
   *
   * <h3 id="reparenting-section">
   *   Reparenting
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
   * </h3>
   *
   *  <p id="reparenting-strategy">
   *     When dialogs are open, they will be reparented into a common container in the
   *     document body and reparented back when closed.  Within this container in the body,
   *     dialogs will always be top rooted but other types of dialogs used within an open
   *     dialog will be reparented within the dialog's layer. The dialog's layer defines its
   *     z-index weight "stacking context" and marked by the "oj-dialog-layer" style.
   *     The goal of this design is to maintain as much of the page author's document structure
   *     while avoiding most of the clipping and positioning issues of a completely inline design.
   *     Dialogs are assigned the same z-index values  The layering between dialog peers reflect the
   *     opening order.  In addition, the dialog that has active focus will be assigned a greater z-index
   *     by way of the "oj-focus-within" pseudo selector applied with "oj-dialog-layer" selector.
   *     The page author has control over z-index weights by way of the "oj-dialog-layer" selector.
   *  </p>
   *  <p>
   *     There are known caveats with this design. However, these scenarios are considered "bad use"
   *     based on our JET dialog/popup strategy.
   *  </p>
   *  <ol>
   *    <li>Events raised within the dialog will not bubble up to the dialog's original ancestors.  Instead, listeners for menu events should
   *        be applied to either the dialog's root element, or the document.</li>
   *    <li>Likewise, developers should not use CSS descendant selectors, or similar logic, that assumes that the dialog will remain a child
   *        of its original parent.</li>
   *    <li>Dialogs containing iframes are problematic.  The iframe elements "may" fire a HTTP GET request for its src attribute
   *        each time the iframe is reparented in the document.</li>
   *    <li>If an iframe is added to the dialog's body, it must not be the first or last tab stop within the dialog or keyboard and VoiceOver
   *        navigation will not remain within the dialog.</li>
   *    <li>In some browsers, reparenting a dialog that contains elements having overflow, will cause these overflow elements to
   *        reset their scrollTop.</li>
   *  </ol>
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p> Setting the reading direction (LTR or RTL) is supported by setting the <code class="prettyprint">"dir"</code> attribute on the
   * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET component, in the unusual case that the reading direction
   * is changed post-init, the dialog must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
   *
   *<h3>Additional Examples</h3>
   *
   * <p> The following defines a basic dialog, with an ok button in the footer:
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-dialog id="dialogWithFooter" dialog-title="Dialog with Footer" style="width: 400px; min-width: 100px; max-width 500px;"&gt;
   *    &lt;div slot="body"&gt;
   *       &lt;p&gt; Dialog Text
   *    &lt;/div&gt;
   *    &lt;div slot="footer"&gt;
   *       &lt;oj-button id="okButton"&gt; OK &lt;/oj-button&gt;
   *    &lt;/div&gt;
   * &lt;/oj-dialog&gt;
   *
   * </code></pre>
   *
   * Note that you will need to define your own event handlers for the ok and close buttons (see the demos for examples of this).
   *
   * <p> A dialog with user-defined header is shown next. Arbitrary header content can be defined using a user-defined header.
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-dialog id="dialog" dialog-title="Dialog Title"&gt;
   *    &lt;div slot="header"&gt;
   *       &lt;span id="dialog-title-id" class="oj-dialog-title"&gt; User Defined Header&lt;/span&gt;
   *    &lt;/div&gt;
   *    &lt;div slot="body"&gt;
   *       &lt;p&gt; Dialog Text
   *    &lt;/div&gt;
   * &lt;/oj-dialog&gt;
   * </code></pre>
   */
  //-----------------------------------------------------
  //                   Slots
  //-----------------------------------------------------
  /**
   * <p>The default slot is the dialog's body. The <code class="prettyprint">&lt;oj-dialog></code>
   * element accepts DOM nodes as children for the default slot.
   * The default slot can also be named with "body".
   * For styling, the default body slot will be rendered with the <code class="prettyprint">oj-dialog-body</code> class.
   *
   * @ojchild Default
   * @ojshortdesc The default slot is the dialog's body. It is the same as the named "body" slot.
   * @memberof oj.ojDialog
   * @since 4.0.0
   *
   * @example <caption>Initialize the Dialog with body content (using the default slot name):</caption>
   * &lt;oj-dialog>
   *   &lt;div>Dialog Content&lt;/div>
   * &lt;/oj-dialog>
   *
   */

  /**
   * <p>The <code class="prettyprint">header</code> slot is for the dialog's header area.
   * The  <code class="prettyprint">&lt;oj-dialog></code> element accepts DOM nodes as children
   * with the header slot.
   * For styling, the header slot will be rendered with the <code class="prettyprint">oj-dialog-header</code> class.
   * </p>
   * If a header slot is not specified by the user, a header will automatically be created.
   * The automatically generated header will contain a close button, and the header title will be set
   * to the dialog title.
   *
   * @ojslot header
   * @ojshortdesc The header slot is for the dialog's header area. See the Help documentation for more information.
   * @memberof oj.ojDialog
   * @since 4.0.0
   *
   * @example <caption>Initialize the Dialog with header and body content:</caption>
   * &lt;oj-dialog>
   *   &lt;div slot='header'>Header Content&lt;/div>
   *   &lt;div>Dialog Content&lt;/div>
   * &lt;/oj-dialog>
   */

  /**
   * <p>The <code class="prettyprint">body</code> slot is for the dialog's body area.
   * The <code class="prettyprint">&lt;oj-dialog></code> element accepts DOM nodes as children
   * with the body slot.
   * For styling, the body slot will be rendered with the <code class="prettyprint">oj-dialog-body</code> class.
   * Note that "body" is the default slot.
   *
   * @ojslot body
   * @ojshortdesc The body slot is for the dialog's body area. See the Help documentation for more information.
   * @memberof oj.ojDialog
   * @since 4.0.0
   *
   * @example <caption>Initialize the Dialog with body content:</caption>
   * &lt;oj-dialog>
   *   &lt;div slot="body">Dialog Content&lt;/div>
   * &lt;/oj-dialog>
   */

  /**
   * <p>The <code class="prettyprint">footer</code> slot is for the dialog's footer area.
   * The <code class="prettyprint">&lt;oj-dialog></code> element accepts DOM nodes as children
   * with the footer slot.
   * For styling, the footer slot will be rendered with the <code class="prettyprint">oj-dialog-footer</code> class.
   *
   * @ojslot footer
   * @ojshortdesc The footer slot is for the dialog's footer area. See the Help documentation for more information.
   * @memberof oj.ojDialog
   * @since 4.0.0
   *
   * @example <caption>Initialize the Dialog with body and footer content:</caption>
   * &lt;oj-dialog>
   *   &lt;div>Dialog Content&lt;/div>
   *   &lt;div slot='footer'>Footer Content&lt;/div>
   * &lt;/oj-dialog>
   */
  //-----------------------------------------------------
  //                   Fragments
  //-----------------------------------------------------
  /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Gesture</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Dialog Close Icon</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Close the dialog.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojDialog
   */

  /**
   * The JET Dialog can be closed with keyboard actions:
   *
   * <p>
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Dialog</td>
   *       <td><kbd>Esc</kbd></td>
   *       <td>Close the dialog.</td>
   *     </tr>
   *     <tr>
   *       <td>Dialog Close Icon</td>
   *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
   *       <td>Close the dialog.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojDialog
   */

  //-----------------------------------------------------
  //                   Sub-ids
  //-----------------------------------------------------
  /**
   * <p>Sub-ID for the dialog header.</p>
   *
   * @ojsubid oj-dialog-header
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-dialog-header'});
   */

  /**
   * <p>Sub-ID for the dialog footer.</p>
   *
   * @ojsubid oj-dialog-footer
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog footer:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-dialog-footer'});
   */

  /**
   * <p>Sub-ID for the dialog body.</p>
   *
   * @ojsubid oj-dialog-body
   * @memberof oj.ojDialog
   * @ojdeprecated {since:"1.2.0", description:"This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed."}
   *
   * @example <caption>Get the node for the dialog body:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-dialog-body'});
   */

  /**
   * <p>Sub-ID for the dialog content.</p>
   *
   * @ojsubid oj-dialog-content
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog content:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-dialog-content'});
   */

  /**
   * <p>Sub-ID for the dialog header-close-wrapper.</p>
   *
   * @ojsubid oj-dialog-header-close-wrapper
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header-close-wrapper:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-dialog-header-close-wrapper'});
   */

  /**
   * <p>Sub-ID for the dialog close-icon.</p>
   *
   * @ojsubid oj-dialog-close-icon
   * @memberof oj.ojDialog
   * @ojdeprecated {since: "1.2.0", description: "This sub-ID is deprecated."}
   *
   * @example <caption>Get the node for the dialog close-icon:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-dialog-close-icon'});
   */

  /**
   * <p>Sub-ID for the dialog close affordance.</p>
   *
   * @ojsubid oj-dialog-close
   * @memberof oj.ojDialog
   * @ojdeprecated {since: "2.1.0", description: "This sub-ID is deprecated."}
   *
   * @example <caption>Get the node for the dialog close affordance:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-dialog-close'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the north location.</p>
   *
   * @ojsubid oj-resizable-n
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-n'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the south location.</p>
   *
   * @ojsubid oj-resizable-s
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-s'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the east location.</p>
   *
   * @ojsubid oj-resizable-e
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-e'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the west location.</p>
   *
   * @ojsubid oj-resizable-w
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-w'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the northeast location.</p>
   *
   * @ojsubid oj-resizable-ne
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-ne'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the northwest location.</p>
   *
   * @ojsubid oj-resizable-nw
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-nw'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the southwest location.</p>
   *
   * @ojsubid oj-resizable-sw
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-sw'});
   */

  /**
   * <p>Sub-ID for the dialog resizable handle at the southeast location.</p>
   *
   * @ojsubid oj-resizable-se
   * @memberof oj.ojDialog
   *
   * @example <caption>Get the node for the dialog header:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-resizable-se'});
   */

  //-----------------------------------------------------
  //                   Styling
  //-----------------------------------------------------

  // ----------------------------------- oj-dialog-title--------------
  /**
   * Class used to format the dialog title. Automatically created headers use oj-dialog-title to format the title.<br/>
   * For user-defined headers, you may want to use the oj-dialog-title class so that the title in your user-defined header
   * is stylistically similar to a default title.<br/>
   * @ojstyleclass oj-dialog-title
   * @ojdisplayname Dialog Title
   * @ojstyleselector oj-dialog *
   * @ojshortdesc Class used to format the dialog title. See the Help documentation for more information.
   * @memberof oj.ojDialog
   */
  // ----------------------------------- oj-dialog-footer-separator--------------
  /**
   * Class that works with the <code class="prettyprint">oj-dialog-footer</code> class to specify a separator between the dialog body and the dialog footer.</br>
   * This class should be applied to the div that specifies <code class="prettyprint">slot="footer"</code> for the dialog.<br/>
   * Note that for themes that have a built-in footer separator (specifically the iOS theme), this class has no effect.<br/>
   * @ojstyleclass oj-dialog-footer-separator
   * @ojdisplayname Footer Separator
   * @ojstyleselector oj-dialog > div
   * @ojshortdesc Class used to specify a separator between the dialog body and the dialog footer. See the Help documentation for more information.
   * @memberof oj.ojDialog
   */
  // ----------------------------------- oj-progress-bar-embedded--------------
  /**
   * Optional class used to format a progress bar when embedded in the dialog.<br/>
   * @ojstyleclass oj-progress-bar-embedded
   * @ojdisplayname Embedded Progress Bar
   * @memberof oj.ojDialog
   */
  // ----------------------------------- oj-focus-highlight -------------
  /**
   * Under normal circumstances this class is applied automatically. It is documented here for the rare cases that an app developer needs per-instance control.<br/><br/>
   * The oj-focus-highlight class applies focus styling that may not be desirable when the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus occurs by a non-pointer mechanism, for example keyboard or initial page load.<br/><br/>
   * The application-level behavior for this component is controlled in the theme by the <code class="prettyprint"><span class="pln">$focusHighlightPolicy </span></code>SASS variable; however, note that this same variable controls the focus highlight policy of many components and patterns. The values for the variable are:<br/><br/>
   * <code class="prettyprint"><span class="pln">nonPointer: </span></code>oj-focus-highlight is applied only when focus is not the result of pointer interaction. Most themes default to this value.<br/>
   * <code class="prettyprint"><span class="pln">all: </span></code> oj-focus-highlight is applied regardless of the focus mechanism.<br/>
   * <code class="prettyprint"><span class="pln">none: </span></code> oj-focus-highlight is never applied. This behavior is not accessible, and is intended for use when the application wishes to use its own event listener to precisely control when the class is applied (see below). The application must ensure the accessibility of the result.<br/><br/>
   * To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use event listeners to toggle this class as needed.<br/>
   * @ojstyleclass oj-focus-highlight
   * @ojdisplayname Focus Styling
   * @ojshortdesc Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.
   * @memberof oj.ojDialog
   */
  /**
   * @ojstylevariableset oj-dialog-css-set1
   * @ojstylevariable oj-dialog-border-radius {description: "Dialog border radius", formats: ["length","percentage"], help: "#css-variables"}
   * @ojstylevariable oj-dialog-bg-color {description: "Dialog background color", formats: ["color"], help: "#css-variables"}
   * @ojstylevariable oj-dialog-border-color {description: "Dialog border color", formats: ["color"], help: "#css-variables"}
   * @ojstylevariable oj-dialog-box-shadow {description: "Dialog box shadow", help: "#css-variables"}
   * @ojstylevariable oj-dialog-header-bg-color {description: "Dialog header background color", formats: ["color"],help: "#css-variables"}
   * @ojstylevariable oj-dialog-header-border-color {description: "Border color between the dialog header and body", formats: ["color"], help: "#css-variables"}
   * @ojstylevariable oj-dialog-header-padding {description: "Dialog header padding", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-dialog-body-padding {description: "Dialog body padding", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-dialog-footer-padding {description: "Dialog footer padding", formats: ["length"], help: "#css-variables"}
   * @memberof oj.ojDialog
   */
  /**
   * @ojstylevariableset oj-dialog-css-set2
   * @ojdisplayname Title
   * @ojstylevariable oj-dialog-title-font-size {description: "Dialog title font size", formats: ["length"], help: "#oj-dialog-css-set2"}
   * @ojstylevariable oj-dialog-title-line-height {description: "Dialog title line height", formats: ["number"], help: "#oj-dialog-css-set2"}
   * @ojstylevariable oj-dialog-title-font-weight {description: "Dialog title font weight", formats: ["font_weight"], help: "#oj-dialog-css-set2"}
   * @ojstylevariable oj-dialog-title-text-color {description: "Dialog title text color", formats: ["color"], help: "#oj-dialog-css-set2"}
   * @memberof oj.ojDialog
   */

  /**
   * @ojstylevariableset oj-dialog-css-set3
   * @ojdisplayname Cancel icon
   * @ojstylevariable oj-dialog-cancel-icon-margin-top {description: "Dialog cancel icon margin top", formats: ["length"], help: "#oj-dialog-css-set3"}
   * @ojstylevariable oj-dialog-cancel-icon-margin-end {description: "Dialog cancel icon margin end", formats: ["length"], help: "#oj-dialog-css-set3"}
   * @memberof oj.ojDialog
   */
  // ------------------------------------------------ oj-dialog Styling end ------------------------------------------------

  oj.__registerWidget('oj.ojDialog', $.oj.baseComponent, {
    version: '1.0.0',
    widgetEventPrefix: 'oj',
    options: {
      /**
       * Specifies the cancel behavior of the dialog.
       * The default value depends on the theme.
       * In the Redwood theme, the default is <code class="prettyprint">"none"</code>.
       * In the deprecated Alta web theme, the default is <code class="prettyprint">"icon"</code>.
       * In the deprecated Alta mobile themes (Android, iOS, Windows), the default is <code class="prettyprint">"none"</code>.
       *
       * <p> Note that the cancelBehavior applies to both automatic and user-defined headers.
       * So, a user-defined header will use the cancelBehavior setting or a theme-specific default.
       *
       * @expose
       * @memberof oj.ojDialog
       * @ojshortdesc Specifies the cancel behavior of the dialog. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojvalue {string} "icon" A close icon will automatically be created. The dialog will close when it has focus and user presses the escape (ESC) key.
       * @ojvalue {string} "escape" The dialog will close when it has focus and user presses the escape (ESC) key. A close icon will not be created.
       * @ojvalue {string} "none" A close icon will not be created. No actions will be associated with the escape key.
       *
       * @example <caption>Initialize the dialog to disable the default <code class="prettyprint">cancelBehavior</code></caption>
       * &lt;oj-dialog cancel-behavior="none" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">cancelBehavior</code> property, after initialization:</caption>
       * // getter
       * var cancelBehavior = myDialog.cancelBehavior;
       *
       * // setter
       * myDialog.cancelBehavior = "icon";
       *
       * @example <caption>Set the default in the theme (SCSS) :</caption>
       * $dialogCancelBehaviorOptionDefault: icon !default;
       *
       */
      cancelBehavior: 'icon',
      /**
       * Specifies the drag affordance.
       * The default value depends on the theme.
       * In the Redwood theme, the default is <code class="prettyprint">"none"</code>.
       * In the deprecated Alta web theme, the default is <code class="prettyprint">"title-bar"</code>.
       * In the deprecated Alta mobile themes (Android, iOS, Windows), the default is <code class="prettyprint">"none"</code>.
       *
       * @expose
       * @memberof oj.ojDialog
       * @ojshortdesc Specifies the drag affordance. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojvalue {string} "title-bar" The dialog will be draggable by the title bar.
       * @ojvalue {string} "none" The dialog will not be draggable.
       *
       * @example <caption>Initialize the dialog to enable dragging <code class="prettyprint">dragAffordance</code></caption>
       * &lt;oj-dialog drag-affordance="title-bar" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">dragAffordance</code> property, after initialization:</caption>
       * // getter
       * var dragAffordance = myDialog.dragAffordance;
       *
       * // setter
       * myDialog.dragAffordance = "title-bar";
       */
      dragAffordance: 'title-bar',
      /**
       * Set the initial visibility of the dialog.
       *
       * @expose
       * @memberof oj.ojDialog
       * @instance
       * @type {string}
       * @default "hide"
       * @ojvalue {string} "hide" The dialog will stay hidden until the <a href="#open"><code class="prettyprint">open()</code></a> method is called.
       * @ojvalue {string} "show" The dialog will automatically open upon initialization.
       *
       * @example <caption>Initialize the dialog with the <code class="prettyprint">initialVisibility</code> property:</caption>
       * &lt;oj-dialog initial-visibility="show" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">initialVisibility</code> property, after initialization:</caption>
       * // getter
       * var initialVisibility = myDialog.initialVisibility;
       *
       * // setter
       * myDialog.initialVisibility = "show";
       */
      initialVisibility: 'hide',
      /**
       *
       * Defines the modality of the dialog.
       *
       * @expose
       * @memberof oj.ojDialog
       * @instance
       * @default "modal"
       * @type {string}
       * @ojvalue {string} "modal" The dialog is modal. Interactions with other page elements are disabled. Modal dialogs overlay other page elements.
       * @ojvalue {string} "modeless" Defines a modeless dialog.
       *
       * @example <caption>Initialize the dialog to a specific modality <code class="prettyprint">modality</code></caption>
       * &lt;oj-dialog modality="modeless" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">modality</code> property, after initialization:</caption>
       * // getter
       * var modality = myDialog.modality;
       *
       * // setter
       * myDialog.modality = "modeless";
       */
      modality: 'modal',
      /**
       * <p>Position object is used to establish the location the dialog will appear relative to
       * another element. {@link oj.ojDialog.Position} defines "my" alignment "at" the alignment
       * "of" some other thing which can be "offset" by so many pixels.</p>
       *
       * <p>The "my" and "at" properties define alignment points relative to the dialog and other
       * element.  The "my" property represents the dialog's alignment where the "at" property
       * represents the other element that can be identified by "of". The values of these properties
       * describe horizontal and vertical alignments.</p>
       *
       * <p>If none of the <code class="prettyprint">position</code> properties are specified,
       * the default dialog position is "center" on desktop and "bottom" on phone.</p>
       *
       * <b>Deprecated v3.0.0 jQuery UI position syntax; Use of a percent unit with
       * "my" or "at" is not supported.</b>
       *
       * @expose
       * @memberof oj.ojDialog
       * @ojshortdesc Establishes the location that the dialog will appear relative to another element. See the Help documentation for more information.
       * @instance
       * @type {Object}
       * @ojsignature { target: "Type",
       *                value: "oj.ojDialog.Position",
       *                jsdocOverride: true}
       * @name position
       * @example <caption>Initialize the dialog with <code class="prettyprint">position</code>
       *           property specified:</caption>
       * &lt;oj-dialog position.my.horizontal="left"
       *           position.my.vertical="top"
       *           position.at.horizontal="right"
       *           position.at.vertical="top" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">position</code> property,
       *          after initialization:</caption>
       * // getter
       * var position = myDialog.position;
       *
       * // setter
       * myDialog.position =
       *    {"my": {"horizontal": "start", "vertical": "bottom"},
       *     "at": {"horizontal": "end", "vertical": "top" },
       *     "offset": {"x": 0, "y":5}};
       */
      position: {
        /**
         * Defines which edge on the dialog to align with the target ("of") element.
         *
         * @expose
         * @memberof! oj.ojDialog
         * @instance
         * @name position.my
         * @name position.my
         * @type {{horizontal:string, vertical:string}}
         */
        my: {
          /**
           * @expose
           * @memberof! oj.ojDialog
           * @instance
           * @name position.my.horizontal
           * @name position.my.horizontal
           * @type {string}
           * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
           * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
           * @ojvalue {string} "left"
           * @ojvalue {string} "center"
           * @ojvalue {string} "right"
           * @default "center"
           */
          horizontal: 'center',
          /**
           * @expose
           * @memberof! oj.ojDialog
           * @instance
           * @name position.my.vertical
           * @name position.my.vertical
           * @type {string}
           * @ojvalue {string} "top"
           * @ojvalue {string} "center"
           * @ojvalue {string} "bottom"
           * @default "center"
           */
          vertical: 'center'
        },
        /**
         * Defines a point offset in pixels from the ("my") alignment.
         * @expose
         * @memberof! oj.ojDialog
         * @instance
         * @name position.offset
         * @name position.offset
         * @type {{x:number, y:number}}
         */
        offset: {
          /**
           * Horizontal alignment offset.
           * @expose
           * @memberof! oj.ojDialog
           * @instance
           * @name position.offset.x
           * @name position.offset.x
           * @type {number}
           * @default 0
           */
          x: 0,
          /**
           * Vertical alignment offset.
           * @expose
           * @memberof! oj.ojDialog
           * @instance
           * @name position.offset.y
           * @name position.offset.y
           * @type {number}
           * @default 0
           */
          y: 0
        },
        /**
         * Defines which position on the target element ("of") to align the positioned element
         * against.
         *
         * @expose
         * @memberof! oj.ojDialog
         * @instance
         * @name position.at
         * @name position.at
         * @type {{horizontal:string, vertical:string}}
         */
        at: {
          /**
           * @expose
           * @memberof! oj.ojDialog
           * @instance
           * @name position.at.horizontal
           * @name position.at.horizontal
           * @type {string}
           * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
           * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
           * @ojvalue {string} "left"
           * @ojvalue {string} "center"
           * @ojvalue {string} "right"
           * @default "center"
           */
          horizontal: 'center',
          /**
           * @expose
           * @memberof! oj.ojDialog
           * @instance
           * @name position.at.vertical
           * @name position.at.vertical
           * @type {string}
           * @ojvalue {string} "top"
           * @ojvalue {string} "center"
           * @ojvalue {string} "bottom"
           * @default "center"
           */
          vertical: 'center'
        },
        /**
         * Which element to position the dialog against.
         * If the value is a string, it should be a selector or the literal string value
         * of <code class="prettyprint">window</code>.  Otherwise, a point of x,y.  When a point
         * is used, the values are relative to the whole document.  Page horizontal and vertical
         * scroll offsets need to be factored into this point - see UIEvent
         * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageX">pageX</a>,
         * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY">pageY</a>.
         *
         * @example <caption>Finding the point for an svg element:</caption>
         * var rect = svgDom.getBoundingClientRect();
         * var position = {of:{x:rect.left + window.pageXOffset, y:rect.top + window.pageYOffset}};
         *
         * @expose
         * @memberof! oj.ojDialog
         * @ojshortdesc Specifies which element to position the dialog against. See the Help documentation for more information.
         * @instance
         * @name position.of
         * @name position.of
         * @type {string|{x: number, y: number}}
         * @default "window"
         */
        of: 'window',
        /**
         * Rule for alternate alignment.
         *
         * @expose
         * @memberof! oj.ojDialog
         * @instance
         * @name position.collision
         * @name position.collision
         * @type {string}
         * @ojvalue {string} "flip" Flip the element to the opposite side of the target and the
         *  collision detection is run again to see if it will fit. Whichever side
         *  allows more of the element to be visible will be used.
         * @ojvalue {string} "fit" Shift the element away from the edge of the window.
         * @ojvalue {string} "flipfit" First applies the flip logic, placing the element
         *  on whichever side allows more of the element to be visible. Then the fit logic
         *  is applied to ensure as much of the element is visible as possible.
         * @ojvalue {string} "none" No collision detection.
         * @default "fit"
         */
        collision: 'fit',
        // Ensure the titlebar is always visible
        using: function (pos) {
          var topOffset = $(this).css(pos).offset().top;
          if (topOffset < 0) {
            $(this).css('top', pos.top - topOffset);
          }
        }
      },
      /**
       *
       * Specifies the resizeBehavior of the dialog.
       * The default value depends on the theme.
       * In the Redwood theme, the default is <code class="prettyprint">"none"</code>.
       * In the deprecated Alta web theme, the default is <code class="prettyprint">"resizable"</code>.
       * In the deprecated Alta mobile themes (Android, iOS, Windows), the default is <code class="prettyprint">"none"</code>.
       *
       * @expose
       * @memberof oj.ojDialog
       * @ojshortdesc Specifies the resizeBehavior of the dialog. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojvalue {string} "resizable" The dialog will be interactively resizable.
       * @ojvalue {string} "none" The dialog will not be interactively resizable.
       *
       * @example <caption>Initialize the dialog to a specific resizeBehavior <code class="prettyprint">resizeBehavior</code></caption>
       * &lt;oj-dialog resize-behavior="resizable" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">resizeBehavior</code> property, after initialization:</caption>
       *
       * // getter
       * var resizeBehavior = myDialog.resizeBehavior;
       *
       * // setter
       * myDialog.resizeBehavior = "resizable";
       * @example <caption>Set the default in the theme (SCSS) :</caption>
       * $dialogResizeBehaviorOptionDefault: resizable !default;
       */
      resizeBehavior: 'resizable',
      /**
       *
       * The WAI-ARIA role of the dialog. By default, role="dialog" is added to the generated HTML markup that surrounds the dialog.
       * When used as an alert dialog, the user should set role to "alertdialog".
       *
       * @ignore
       * @memberof oj.ojDialog
       * @ojshortdesc The WAI-ARIA role of the dialog. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @default "dialog"
       *
       * @example <caption>Initialize the dialog with the <code class="prettyprint">role</code></caption> property specified:</caption>
       * &lt;oj-dialog role="alertdialog" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">role</code> property, after initialization:</caption>
       * // getter
       * var role = myDialog.role;
       *
       * // setter
       * myDialog.role = "alertdialog";
       */
      role: 'dialog',
      /**
       *
       * Specify the title of the dialog. null is the default.
       *
       * @expose
       * @memberof oj.ojDialog
       * @ojtranslatable
       * @instance
       * @type {string|null}
       *
       * @example <caption>Initialize the <code class="prettyprint">dialogTitle</code> property.</caption>
       * &lt;oj-dialog dialog-title="Title of Dialog" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">dialogTitle</code> property, after initialization:</caption>
       * // getter
       * var dialogTitle = myDialog.dialogTitle;
       *
       * // setter
       * myDialog.dialogTitle = "Title of Dialog";
       */
      dialogTitle: null,
      /**
       *
       * Specify the title of the dialog. null is the default.
       *
       * @expose
       * @ignore
       * @memberof oj.ojDialog
       * @instance
       * @type {string|null}
       *
       * @example <caption>Initialize the dialog to a specific title <code class="prettyprint">title</code></caption>
       * &lt;oj-dialog dialog-title="Title of Dialog" &gt;&lt;/oj-dialog&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">title</code> property, after initialization:</caption>
       * // getter
       * var title = myDialog.title;
       *
       * // setter
       * myDialog.title = "Title of Dialog";
       */
      title: null,
      // /////////////////////////////////////////////////////
      // events
      // /////////////////////////////////////////////////////

      /**
       * Triggered before the dialog is dismissed via the
       * <code class="prettyprint">close()</code> method. The close can be cancelled by calling
       * <code class="prettyprint">event.preventDefault()</code>.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {Event} event a custom event
       */
      beforeClose: null,
      /**
       * Triggered before the dialog is launched via the <code class="prettyprint">open()</code>
       * method. The open can be cancelled by calling
       * <code class="prettyprint">event.preventDefault()</code>.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {Event} event a custom event
       */
      beforeOpen: null,
      /**
       * Triggered after the dialog is dismissed via the
       * <code class="prettyprint">close()</code> method.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @instance
       * @ojbubbles
       * @ojeventgroup common
       * @property {Event} event a custom event
       */
      close: null,
      /**
       * Triggered after focus has been transferred to the dialog.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @instance
       * @ojbubbles
       * @property {Event} event a custom event
       */
      focus: null,
      /**
       * Triggered after the dialog is launched via the <code class="prettyprint">open()</code>
       * method.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {Event} event a custom event
       */
      open: null,
      /**
       * Triggered when the dialog is being resized.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @ojshortdesc Triggered when the dialog is being resized. See the Help documentation for more information.
       * @instance
       * @ojbubbles
       * @property {Object} originalEvent the underlying UI <a href="http://api.jqueryui.com/resizable/#event-resize">Event</a> object
       * @property {Object} originalPosition the original CSS position of the dialog
       * @property {Object} originalSize the original size of the dialog
       * @property {Object} position the current CSS position of the dialog
       * @property {Object} size the current size of the dialog
       */
      resize: null,
      /**
       * Triggered when the user starts resizing the dialog.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @ojshortdesc Triggered when the user starts resizing the dialog. See the Help documentation for more information.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {Object} originalEvent the underlying UI <a href="http://api.jqueryui.com/resizable/#event-resize">Event</a> object
       * @property {Object} originalPosition the original CSS position of the dialog
       * @property {Object} originalSize the original size of the dialog
       * @property {Object} position the current CSS position of the dialog
       * @property {Object} size the current size of the dialog
       */
      resizeStart: null,
      /**
       * Triggered when the user stops resizing the dialog.
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @ojshortdesc Triggered when the user stops resizing the dialog. See the Help documentation for more information.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {Object} originalEvent the underlying UI <a href="http://api.jqueryui.com/resizable/#event-resize">Event</a> object
       * @property {Object} originalPosition the original CSS position of the dialog
       * @property {Object} originalSize the original size of the dialog
       * @property {Object} position the current CSS position of the dialog
       * @property {Object} size the current size of the dialog
       */
      resizeStop: null,
      /**
       * Triggered when a default animation is about to start, such as when the component is
       * being opened/closed or a child item is being added/removed. The default animation can
       * be cancelled by calling <code class="prettyprint">event.preventDefault</code>.
       * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @ojshortdesc Triggered when a default animation is about to start, such as when the component is being opened/closed or a child item is being added/removed.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {"open"|"close"} action The action that triggers the animation.<br><br>
       *            The number of actions can vary from component to component.
       *            Suggested values are:
       *                    <ul>
       *                      <li>"open" - when a dialog component is opened</li>
       *                      <li>"close" - when a dialog component is closed</li>
       *                    </ul>
       * @property {!Element} element target of animation
       * @property {!function():void} endCallback If the event listener calls
       *            event.preventDefault to cancel the default animation, It must call the
       *            endCallback function when it finishes its own animation handling and any
       *            custom animation has ended.
       *
       *
       * @example <caption>Add a listener for the
       *          <code class="prettyprint">ojAnimateStart</code> event to override the default
       *          "close" animation:</caption>
       * myDialog.addEventListener("ojAnimateStart", function( event )
       *   {
       *     // verify that the component firing the event is a component of interest and action
       *      is close
       *     if (event.detail.action == "close") {
       *       event.preventDefault();
       *       oj.AnimationUtils.slideOut(event.detail.element).then(event.detail.endCallback);
       *   });
       *
       * @example <caption>The default open and close animations are controlled via the theme
       *          (SCSS) :</caption>
       * $dialogOpenAnimation: ((effect: "zoomIn"), "fadeIn")  !default;
       * $dialogCloseAnimation: ((effect: "zoomOut"), "fadeOut")  !default;
       */

      animateStart: null,
      /**
       * Triggered when a default animation has ended, such as when the component is being
       * opened/closed or a child item is being added/removed. This event is not triggered if
       * the application has called preventDefault on the animateStart
       * event.
       * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
       *
       * @expose
       * @event
       * @memberof oj.ojDialog
       * @ojshortdesc Triggered when a default animation has ended, such as when the component is being opened/closed or a child item is being added/removed.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {!Element} element target of animation
       * @property {"open"|"close"} action The action that triggered the animation.<br><br>
       *                   The number of actions can vary from component to component.
       *                   Suggested values are:
       *                    <ul>
       *                      <li>"open" - when a dialog component is opened</li>
       *                      <li>"close" - when a dialog component is closed</li>
       *                    </ul>
       *
       * @example <caption>Add a listener for the
       *          <code class="prettyprint">ojAnimateEnd</code> event to listen for the "close"
       *          ending animation:</caption>
       * myDialog.addEventListener("ojAnimateEnd", function( event )
       *   {
       *     // verify that the component firing the event is a component of interest and action
       *      is close
       *     if (event.detail.action == "close") {}
       *   });
       *
       * @example <caption>The default open and close animations are controlled via the theme
       *          (SCSS) :</caption>
       * $dialogOpenAnimation: (effect: "zoomIn", fade: true)  !default;
       * $dialogCloseAnimation: (effect: "zoomOut", fade: true)  !default;
       */
      animateEnd: null
    },
    /**
     * @memberof oj.ojDialog
     * @instance
     * @protected
     * @override
     * @return {void}
     */

    _ComponentCreate: function () {
      this._super();
      var self = this;

      this.originalCss = {
        display: this.element[0].style.display,
        width: this.element[0].style.width,
        height: this.element[0].style.height
      };
      this.originalPosition = {
        parent: this.element.parent(),
        index: this.element.parent().children().index(this.element)
      };

      // For the widget syntax, pull the title attribute from the root element moving to an option
      if (!this._IsCustomElement()) {
        this.originalTitle = this.element.attr('title');
        this.options.title = this.options.title || this.originalTitle;
        this.element.removeAttr('title');
      }

      this.element.hide();
      this.element.uniqueId();
      this.element.addClass('oj-dialog oj-component');
      this.element.attr({
        // Setting tabIndex makes the div focusable
        tabIndex: -1
      });

      if (!this._IsCustomElement() || !this.element[0].hasAttribute('role')) {
        this.element.attr('role', this.options.role);
      }

      this._on(this.element, { keydown: this._keydownHandler.bind(this) });

      // fixup references to header, body and footer.  assumption is they will be immediate children
      // of the root node.
      this.userDefinedDialogHeader = false;

      this._createContainer();

      if (!this._IsCustomElement()) {
        var children = this.element.children();
        for (var i = 0; i < children.length; i++) {
          var child = $(children[i]);
          if (child.is(OJD_HEADER_CLASS)) {
            this.userDefinedDialogHeader = true;
            this._userDefinedHeader = child;
            this._userDefinedHeaderDiv = children[i];
            this._dialogContainer.appendChild(this._userDefinedHeader[0]); // @HTMLUpdateOK
            subtreeAttached(this._userDefinedHeader);
          } else if (child.is(OJD_BODY_CLASS)) {
            this._createContentDiv();
            this._uiDialogContent = $(this._contentDiv);

            this._contentDiv.appendChild(children[i]); // @HTMLUpdateOK
            subtreeAttached(children[i]);

            this._dialogContainer.appendChild(this._contentDiv); // @HTMLUpdateOK
            subtreeAttached(this._contentDiv);

            this._uiDialogBody = child;
            this._uiDialogBodyDiv = children[i];
          } else if (child.is(OJD_FOOTER_CLASS)) {
            this._uiDialogFooter = child;
            this._uiDialogFooterDiv = children[i];
            this._dialogContainer.appendChild(this._uiDialogFooter[0]); // @HTMLUpdateOK
            subtreeAttached(this._uiDialogFooter);
          }
        }
      }

      if (this._IsCustomElement()) {
        this._processSlottedChildren();
      }

      this.element[0].appendChild(this._dialogContainer); // @HTMLUpdateOK
      subtreeAttached(this._dialogContainer);

      // fixup dialog header
      if (this.userDefinedDialogHeader) {
        this._userDefinedTitleDiv = this._userDefinedHeaderDiv.querySelector(OJD_TITLE_CLASS);
        this._userDefinedTitle = $(this._userDefinedTitleDiv);

        if (this._userDefinedTitleDiv !== null && this._userDefinedTitleDiv !== undefined) {
          // create an id for the user-defined title
          this._userDefinedTitle.uniqueId();
          // to meet accessibility requirements for user-defined headers,
          // associate the title id with the .oj-dialog aria-labelledby.
          this.element.attr({ 'aria-labelledby': this._userDefinedTitle.attr('id') });
        }
      } else {
        this._createTitlebar();
      }

      // body was not provided. insert the content between the header and footer
      if (!this._uiDialogContent) {
        this._createContentDiv();
        this._uiDialogContent = $(this._contentDiv);

        if (this._userDefinedHeader) {
          // prettier-ignore
          this._dialogContainer.insertBefore( // @HTMLUpdateOK
            this._contentDiv,
            this._userDefinedHeaderDiv.nextSibling
          );
        } else {
          // prettier-ignore
          this._dialogContainer.insertBefore( // @HTMLUpdateOK
            this._contentDiv,
            this._uiDialogTitlebarDiv.nextSibling
          );
        }
        subtreeAttached(this._contentDiv);
      }

      this._setupFocus(this.element);

      // fixup the position option set via the widget constructor
      var options = this.options;
      options.position = oj.PositionUtils.coerceToJet(options.position);

      // For custom element dialogs, detect changes to the 'title' attribute using a mutation observer.
      // Update the dialog title DOM on 'title' attribute change.
      if (this._IsCustomElement()) {
        this._titleMutationObserver = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes') {
              if (mutation.attributeName === 'title') {
                self._uiDialogTitleDiv.textContent = mutation.target.getAttribute(
                  mutation.attributeName
                );
              }
            }
          });
        });
        // Start observing the dialog element for changes to the title attribute.
        this._titleMutationObserver.observe(this.element[0], {
          attributes: true,
          attributeFilter: ['title']
        });
      }
    },

    _createContainer: function () {
      this._dialogContainer = document.createElement('div');
      this._dialogContainer.classList.add(OJD_CONTAINER);
    },

    _createHeaderSlot: function () {
      this._headerSlot = document.createElement('div');
      this._headerSlot.classList.add(OJD_HEADER);

      this._dialogContainer.appendChild(this._headerSlot); // @HTMLUpdateOK
      subtreeAttached(this._headerSlot);

      this.userDefinedDialogHeader = true;
      this._userDefinedHeaderDiv = this._headerSlot;
      this._userDefinedHeader = $(this._headerSlot);
    },

    // Create the footer slot element.
    _createFooterSlot: function () {
      this._footerSlot = document.createElement('div');

      this._dialogContainer.appendChild(this._footerSlot); // @HTMLUpdateOK
      subtreeAttached(this._footerSlot);
      this._uiDialogFooterDiv = this._footerSlot;
      this._uiDialogFooter = $(this._footerSlot);
    },

    _createContentDiv: function () {
      this._contentDiv = document.createElement('div');
      this._contentDiv.classList.add(OJD_CONTENT, 'oj-dialog-default-content');
    },

    // Create the body slot element
    _createBodySlot: function () {
      this._createContentDiv();

      this._dialogContainer.appendChild(this._contentDiv); // @HTMLUpdateOK
      subtreeAttached(this._contentDiv);

      this._bodySlot = document.createElement('div');
      this._bodySlot.classList.add('oj-dialog-body-wrapper');

      this._contentDiv.appendChild(this._bodySlot); // @HTMLUpdateOK
      this._uiDialogContent = $(this._contentDiv);

      this._uiDialogBodyDiv = this._bodySlot;
      this._uiDialogBody = $(this._bodySlot);
    },

    // override in order to return the reparented location of the context menu slot
    _GetContextMenu: function () {
      if (this._IsCustomElement()) {
        if (this._contextmenuSlot && this._contextmenuSlot.length > 0) {
          return this._contextmenuSlot[0];
        }
        return this._super();
      }
      return null;
    },

    // Process any slotted children and move them into the correct location
    _processSlottedChildren: function () {
      if (this._footerSlot != null) {
        this.element[0].removeChild(this._footerSlot);
      }
      if (this._headerSlot != null) {
        this.element[0].removeChild(this._headerSlot);
      }
      if (this._bodySlot != null) {
        this.element[0].removeChild(this._bodySlot);
      }
      if (this._contextmenuSlot != null) {
        this.element[0].removeChild(this._contextmenuSlot);
      }

      var slotMap = CustomElementUtils.getSlotMap(this.element[0]);
      var slots = Object.keys(slotMap);
      var slot;
      var s;

      for (s = 0; s < slots.length; s++) {
        slot = slots[s];
        if (
          slot !== SLOT_HEADER &&
          slot !== SLOT_FOOTER &&
          slot !== SLOT_BODY &&
          slot !== SLOT_DEFAULT &&
          slot !== SLOT_CONTEXTMENU
        ) {
          // silently remove as per custom component slot behavior
          slotMap[slot].parentNode.removeChild(slotMap[slot]);
        }
      }

      var hasOwnProperty = Object.prototype.hasOwnProperty;
      if (hasOwnProperty.call(slotMap, SLOT_HEADER)) {
        this._createHeaderSlot();
      }

      // Note that the default slot is the body slot.
      if (hasOwnProperty.call(slotMap, SLOT_BODY) || hasOwnProperty.call(slotMap, SLOT_DEFAULT)) {
        this._createBodySlot();
      }

      if (hasOwnProperty.call(slotMap, SLOT_FOOTER)) {
        this._createFooterSlot();
      }

      // save the location of the context menu slot.
      if (hasOwnProperty.call(slotMap, SLOT_CONTEXTMENU)) {
        this._contextmenuSlot = slotMap[SLOT_CONTEXTMENU];
      }

      var slotParent = this._bodySlot;
      for (s = 0; s < slots.length; s++) {
        slot = slots[s];
        switch (slot) {
          case SLOT_HEADER:
            // Note - the header is wrapped with the title for accessibility,
            // so we add the oj-dialog-header class during wrap process.
            slotParent = this._headerSlot;
            break;
          case SLOT_FOOTER:
            slotParent = this._footerSlot;
            break;
          case SLOT_BODY:
          case SLOT_DEFAULT:
            slotParent = this._bodySlot;
            break;
          default:
            break;
        }

        var slotElements = slotMap[slot];
        if (slotElements != null) {
          for (var i = 0; i < slotElements.length; i++) {
            slotParent.appendChild(slotElements[i]); // @HTMLUpdateOK
            switch (slot) {
              case SLOT_HEADER:
                break;
              case SLOT_FOOTER:
                slotParent = this._footerSlot;
                slotMap[slot][i].classList.add(OJD_FOOTER);
                break;
              case SLOT_BODY:
              case SLOT_DEFAULT:
                slotParent = this._bodySlot;
                slotMap[slot][i].classList.add(OJD_BODY);
                break;
              default:
                break;
            }
          }
        }
      }
    },

    /**
     * @memberof oj.ojDialog
     * @instance
     * @protected
     * @override
     */
    _AfterCreateEvent: function () {
      if (this.options.initialVisibility === 'show') {
        this.open();
      }
    },
    /**
     * @memberof oj.ojDialog
     * @instance
     * @protected
     * @override
     */
    _destroy: function () {
      this._off(this.element, 'keydown');

      if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
        this._closeImplicitly();
      }

      this._setWhenReady('none');

      this._destroyResizable();

      if (this.element.hasClass(OJ_DRAGGABLE)) {
        this.element.draggable('destroy');
        this.element.removeClass(OJ_DRAGGABLE);
      }

      this._destroyCloseButton();

      if (this.userDefinedDialogHeader) {
        // remove any unique id from the user-defined header's title
        this._userDefinedTitle.removeUniqueId();
      }

      if (this._uiDialogBody) {
        // unwrap the dialog body from the content element.
        this._uiDialogBody.insertAfter(this._uiDialogContent); // @HTMLUpdateOK safe manipulation
      }
      this._uiDialogContent.remove();
      this._uiDialogBody = null;
      this._uiDialogContent = null;

      this.element.removeUniqueId().removeClass('oj-dialog oj-component').css(this.originalCss);

      this.element.stop(true, true);

      if (!this._IsCustomElement()) {
        if (this.originalTitle) {
          this.element.attr('title', this.originalTitle);
        }
      }

      if (this._uiDialogTitlebar) {
        this._uiDialogTitlebar.remove();
        this._uiDialogTitlebar = null;
      }

      delete this._popupServiceEvents;
      this._super();
    },
    disable: $.noop,
    enable: $.noop,
    /**
     * Closes the dialog.
     *
     * @expose
     * @name oj.ojDialog#close
     * @method
     * @memberof oj.ojDialog
     * @instance
     * @return {void}
     * @fires oj.ojDialog#beforeClose
     * @fires oj.ojDialog#close
     *
     * @example <caption>Invoke the <code class="prettyprint">close</code> method:</caption>
     * myDialog.close();
     */
    close: function (event) {
      if (this._isOperationPending('close', [event])) {
        return;
      }

      // can only close an open dialog.
      var status = oj.ZOrderUtils.getStatus(this.element);
      if (status !== oj.ZOrderUtils.STATUS.OPEN) {
        return;
      }

      // Status toggle is needed to prevent a recursive closed callled from a
      // beforeClose handler. The _isOperationPending gatekeeper isn't activated
      // until after the _setWhenReady('close'|'open') call.
      oj.ZOrderUtils.setStatus(this.element, oj.ZOrderUtils.STATUS.BEFORE_CLOSE);
      if (this._trigger('beforeClose', event) === false && !this._ignoreBeforeCloseResultant) {
        oj.ZOrderUtils.setStatus(this.element, status);
        return;
      }

      // activates the _isOperationPending gatekeeper
      this._setWhenReady('close');
      this._focusedElement = null;

      // if dialog modality is modal, check if we need
      // to restore the disabled accesskey attributes
      if (this.options.modality === 'modal') {
        var forEach = Array.prototype.forEach;
        // Find elements within dialog that have accesskey and remove marker added during open
        var elementsInDialogWithAccesskey = this.element[0].querySelectorAll(
          '.oj-helper-element-in-dialog-with-accesskey'
        );
        forEach.call(elementsInDialogWithAccesskey, function (element) {
          element.classList.remove(OJD_HELPER_ELEMENT_DIALOG);
        });
        // Find elements with oj-helper-element-with-accesskey class, get accesskey value from data attr, set accesskey attr, remove class
        var elementsInDOMWithAccesskey = document.querySelectorAll(
          '.oj-helper-element-with-accesskey'
        );
        forEach.call(elementsInDOMWithAccesskey, function (element) {
          element.setAttribute('accesskey', element.getAttribute(OJD_ACCESS_KEY));
          element.removeAttribute(OJD_ACCESS_KEY);
          element.classList.remove('oj-helper-element-with-accesskey');
        });
      }

      /** @type {!Object.<oj.PopupService.OPTION, ?>} */
      var psOptions = {};
      psOptions[oj.PopupService.OPTION.POPUP] = this.element;
      psOptions[oj.PopupService.OPTION.CONTEXT] = { closeEvent: event };
      oj.PopupService.getInstance().close(psOptions);
    },
    /**
     * Before callback is invoked while the dialog is still visible and still parented in the zorder container.
     * Close animation is performed here.
     * @memberof oj.ojDialog
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for closing the popup
     * @return {Promise|void}
     */
    _beforeCloseHandler: function (psOptions) {
      var rootElement = psOptions[oj.PopupService.OPTION.POPUP];
      var isFull = this._isFullDisplay();
      var isSheet = this._isSheetDisplay();

      this._unregisterResizeListener(rootElement[0]);

      this._destroyResizable();
      if (isSheet) {
        // turn off body overflow for animation duration in 'sheet' mode
        this._disableBodyOverflow();
      }

      var animationOptions = (parseJSONFromFontFamily(OJD_OPTION_DEFAULTS) || {})
        .animation;
      var closeAnimation;
      if (animationOptions) {
        if (isSheet && !isFull && animationOptions.sheet) {
          closeAnimation = animationOptions.sheet.close;
        } else if (animationOptions.normal) {
          closeAnimation = animationOptions.normal.close;
        } else if (animationOptions.close) {
          // compatibility with older themes
          closeAnimation = animationOptions.close;
        }
      }
      if (!this._ignoreBeforeCloseResultant && closeAnimation) {
        // eslint-disable-next-line no-undef
        return startAnimation(rootElement[0], 'close', closeAnimation, this).then(
          function () {
            rootElement.hide();
          }
        );
      }

      rootElement.hide();
      return undefined;
    },
    /**
     * Close finalization callback.
     *
     * @memberof oj.ojDialog
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for closing the popup
     * @return {void}
     */
    _afterCloseHandler: function (psOptions) {
      var context = psOptions[oj.PopupService.OPTION.CONTEXT];
      this._restoreBodyOverflow();

      // Moved from close(). Don't want to move focus until the close animation completed.
      // If the launcher is not focusable, find the closet focuable ancestor
      if (!this.opener.filter(':focusable').focus().length) {
        var launcher = this.opener.parents().filter(':focusable');
        if (launcher.length > 0) {
          launcher[0].focus();
        } else {
          // Hiding a focused element doesn't trigger blur in WebKit
          // so in case we have nothing to focus on, explicitly blur the active element
          // https://bugs.webkit.org/show_bug.cgi?id=47182
          $(this.document[0].activeElement).blur();
        }
      }

      var event;
      if (context) {
        event = context.closeEvent;
      }

      this._trigger('close', event);
    },
    /**
     * <p>Returns true if the dialog is currently open. This method does not accept any arguments.
     * </p>
     *
     * The "open" state reflects the period of time the dialog is visible, including open and
     * close animations.
     *
     * @expose
     * @method
     * @name oj.ojDialog#isOpen
     * @ojshortdesc Returns true if the dialog is currently open.
     * @memberof oj.ojDialog
     * @instance
     * @return {boolean} <code>true</code> if the dialog is open.
     *
     * @example <caption>Invoke the <code class="prettyprint">isOpen</code> method:</caption>
     * var isOpen = myDialog.isOpen();
     */
    isOpen: function () {
      var status = oj.ZOrderUtils.getStatus(this.element);
      // the window is visible and reparented to the zorder container for these statuses
      return (
        status === oj.ZOrderUtils.STATUS.OPENING ||
        status === oj.ZOrderUtils.STATUS.OPEN ||
        status === oj.ZOrderUtils.STATUS.BEFORE_CLOSE ||
        status === oj.ZOrderUtils.STATUS.CLOSING
      );
    },
    /**
     * Opens the dialog.
     *
     * @expose
     * @method
     * @name oj.ojDialog#open
     * @memberof oj.ojDialog
     * @instance
     * @return {void}
     * @fires oj.ojDialog#beforeOpen
     * @fires oj.ojDialog#open
     *
     * @example <caption>Invoke the <code class="prettyprint">open</code> method:</caption>
     * var open = myDialog.open();
     */
    open: function (event) {
      if (this._isOperationPending('open', [event])) {
        return;
      }

      // calling open on a dialog in an open state will result in calling the
      // beforeOpen followed by resetting inital focus. This is different behavior
      // than the popup which forces a sync close follwed by a reopen - dialog
      // doesn't have accessiblity launcher requirements.
      var status = oj.ZOrderUtils.getStatus(this.element);
      if (
        !(
          status === oj.ZOrderUtils.STATUS.OPEN ||
          status === oj.ZOrderUtils.STATUS.UNKNOWN ||
          status === oj.ZOrderUtils.STATUS.CLOSE
        )
      ) {
        return;
      }

      this._isDefaultPosition = !this._hasPositionAttribute();

      // status change is needed to prevent calling open from an on before open
      // handler.  The _isOperationPending doens't gurard until this._setWhenReady('open');
      oj.ZOrderUtils.setStatus(this.element, oj.ZOrderUtils.STATUS.BEFORE_OPEN);
      if (this._trigger('beforeOpen', event) === false) {
        oj.ZOrderUtils.setStatus(this.element, status);
        return;
      }

      // open was called on a open dialog, just establish intial focus
      if (status === oj.ZOrderUtils.STATUS.OPEN) {
        oj.ZOrderUtils.setStatus(this.element, status);
        this._focusTabbable();
        return;
      }

      // activates the isOperationPending gate keeper
      this._setWhenReady('open');

      if (this.userDefinedDialogHeader) {
        // Add close button to user-defined header
        if (
          (this.closeButton === undefined || this.closeButton === null) &&
          this.options.cancelBehavior === 'icon'
        ) {
          this._createCloseButton(this._userDefinedHeaderDiv);
        }
      } else {
        this._createTitlebarCloseButton();
      }

      this.opener = $(this.document[0].activeElement);

      var isSheetDisplay = this._isSheetDisplay();

      if (isSheetDisplay) {
        this.element[0].classList.add('oj-dialog-sheet');
      }

      if (!isSheetDisplay && this.options.dragAffordance === 'title-bar' && $.fn.draggable) {
        this._makeDraggable();
      }
      // normalize alignments, so that start and end keywords work as expected.
      var isRtl = this._GetReadingDirection() === 'rtl';
      var position = this.options.position;
      if (isSheetDisplay) {
        position = this._setSheetPosition(this.options.position);
      }
      position = oj.PositionUtils.coerceToJqUi(position);
      position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);

      // if modality is set to modal, prevent accesskey events
      // from being triggered while dialog is open
      if (this.options.modality === 'modal') {
        var forEach = Array.prototype.forEach;
        // Mark elements within the dialog that have an accesskey attr. Those shouldn't have accesskey attr removed
        var elementsInDialogWithAccesskey = this.element[0].querySelectorAll('[accesskey]');
        forEach.call(elementsInDialogWithAccesskey, function (element) {
          element.classList.add(OJD_HELPER_ELEMENT_DIALOG);
        });
        // Mark elements with accesskey attr, move accesskey value to data attr, remove accesskey attr from elements
        var elementsInDOMWithAccesskey = document.querySelectorAll('[accesskey]');
        forEach.call(elementsInDOMWithAccesskey, function (element) {
          if (!element.classList.contains(OJD_HELPER_ELEMENT_DIALOG)) {
            element.classList.add('oj-helper-element-with-accesskey');
            element.setAttribute(OJD_ACCESS_KEY, element.getAttribute('accesskey')); // @HTMLUpdateOK
            element.removeAttribute('accesskey');
          }
        });
      }

      /** @type {!Object.<oj.PopupService.OPTION, ?>} */
      var psOptions = {};
      psOptions[oj.PopupService.OPTION.POPUP] = this.element;
      psOptions[oj.PopupService.OPTION.LAUNCHER] = this.opener;
      psOptions[oj.PopupService.OPTION.POSITION] = position;
      psOptions[oj.PopupService.OPTION.MODALITY] = this.options.modality;
      psOptions[oj.PopupService.OPTION.EVENTS] = this._getPopupServiceEvents();
      psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = 'oj-dialog-layer';
      psOptions[oj.PopupService.OPTION.LAYER_LEVEL] = oj.PopupService.LAYER_LEVEL.TOP_LEVEL;
      psOptions[oj.PopupService.OPTION.CUSTOM_ELEMENT] = this._IsCustomElement();
      oj.PopupService.getInstance().open(psOptions);
    },
    /**
     * Before open callback is called after the dialog has been reparented into the
     * zorder container. Open animation is performed here.
     * @memberof oj.ojDialog
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for opening the popup
     * @return {Promise|void}
     */
    _beforeOpenHandler: function (psOptions) {
      var rootElement = psOptions[oj.PopupService.OPTION.POPUP];
      var position = psOptions[oj.PopupService.OPTION.POSITION];

      var isSheet = this._isSheetDisplay();
      if (isSheet) {
        // turn off overflow before animating in 'sheet' mode
        this._disableBodyOverflow();
      }

      rootElement.show();

      var isFull = this._isFullDisplay();
      if (isFull) {
        this.element[0].classList.add('oj-dialog-full');
      }

      rootElement.position(position);

      this._registerResizeListener(this.element[0]);

      // We add .oj-animate-open when the dialog is animating on open.
      // This supports maintaing the visibility of a nested dialog during animation open.
      rootElement.parent().addClass('oj-animate-open');

      var animationOptions = (parseJSONFromFontFamily(OJD_OPTION_DEFAULTS) || {})
        .animation;
      var openAnimation;
      if (animationOptions) {
        if (isSheet && !isFull && animationOptions.sheet) {
          openAnimation = animationOptions.sheet.open;
        } else if (animationOptions.normal) {
          openAnimation = animationOptions.normal.open;
        } else if (animationOptions.open) {
          // compatibility with older themes
          openAnimation = animationOptions.open;
        }
      }
      if (openAnimation) {
        // eslint-disable-next-line no-undef
        return startAnimation(rootElement[0], 'open', openAnimation, this);
      }

      return undefined;
    },
    /**
     * Called after the dialog is shown. Perform open finalization.
     * @memberof oj.ojDialog
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for opening the popup
     * @return {void}
     */
    _afterOpenHandler: function (psOptions) {
      var rootElement = psOptions[oj.PopupService.OPTION.POPUP];
      rootElement.parent().removeClass('oj-animate-open');
      this._restoreBodyOverflow();
      this._makeResizable();
      this._trigger('open');
      this._focusTabbable();
    },
    /**
     * Refresh the dialog.
     * Typically used after dynamic content is added to a dialog.
     * @expose
     * @method
     * @name oj.ojDialog#refresh
     * @memberof oj.ojDialog
     * @instance
     * @return {void}
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myDialog.refresh();
     */
    refresh: function () {
      this._super();
    },

    /**
     * Unregister event listeners for resize the dialog element.
     * @param {Element} element  DOM element
     * @private
     */
    _unregisterResizeListener: function (element) {
      if (element && this._resizeHandler) {
        // remove existing listener
        removeResizeListener(element, this._resizeHandler);
        this._resizeHandler = null;
      }
    },

    /**
     * Register event listeners for resize the dialog element.
     * @param {Element} element  DOM element
     * @private
     */
    _registerResizeListener: function (element) {
      if (element) {
        if (this._resizeHandler == null) {
          this._resizeHandler = this._handleResize.bind(this);
        }
        addResizeListener(element, this._resizeHandler, 100, true);
      }
    },

    /**
     * Resize handler to adujust dialog position when the size changes after
     * initial render.
     *
     * @memberof oj.ojDialog
     * @instance
     * @private
     */
    _handleResize: function () {
      if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
        this._adjustPosition();
      }
    },

    /**
     * @memberof oj.ojDialog
     * @instance
     * @private
     */
    _focusTabbable: function () {
      var hasFocus = this.GetFocusElement();
      hasFocus.focus();
      this._trigger('focus');
    },

    /**
     * Returns the current focusable element for this component which can be the root custom element
     * or an HTML element like an input or select.
     * @return {Element}
     * @memberof oj.ojDialog
     * @instance
     * @protected
     * @override
     */
    GetFocusElement: function () {
      var hasFocus = null;

      // Set focus to the outer dialog if the title-bar is clicked (or dragged).
      if (this._titleBarMousedown === true) {
        return this.element[0];
      }

      // Set focus to the first match:
      // 1. First element inside the dialog matching [autofocus]
      // 2. Tabbable element inside the content element
      // 3. Tabbable element inside the footer
      // 4. The close button
      // 5. The dialog itself

      hasFocus = this.element.find('[autofocus]');

      if (hasFocus == null || !hasFocus.length) {
        hasFocus = FocusUtils.getFirstTabStop(this._contentDiv);
        if (hasFocus != null) return hasFocus;
      }
      if (hasFocus == null || !hasFocus.length) {
        if (this._uiDialogFooter && this._uiDialogFooter.length) {
          hasFocus = FocusUtils.getFirstTabStop(this._uiDialogFooterDiv);
          if (hasFocus != null) return hasFocus;
        }
      }
      if (hasFocus == null || !hasFocus.length) {
        if (this.closeButton) {
          hasFocus = this.closeButton;
        }
      }
      if (hasFocus == null || !hasFocus.length) {
        hasFocus = this.element;
      }
      return hasFocus[0];
    },

    _keydownHandler: function (event) {
      if (
        this.options.cancelBehavior !== 'none' &&
        !event.isDefaultPrevented() &&
        event.keyCode &&
        event.keyCode === $.ui.keyCode.ESCAPE
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close(event);
        return;
      }

      if (event.keyCode !== $.ui.keyCode.TAB) {
        return;
      }

      // prevent tabbing out of dialogs
      var focusItem;

      // Note that we check document.activeElement instead of event.target since
      // descendant elements such as ojTable may change focus when handling Tab key.
      // This aligns with browser behavior because it determines next tabstop
      // based on activeElement.
      if (!event.shiftKey) {
        // For TAB, we cycle when we are on the last element.
        if (
          FocusUtils.isLastActiveElement(this.element) ||
          document.activeElement === this.element[0]
        ) {
          focusItem = FocusUtils.getFirstTabStop(this.element);
          if (focusItem != null) {
            focusItem.focus();
            event.preventDefault();
          }
        }
      } else if (
        FocusUtils.isFirstActiveElement(this.element) ||
        document.activeElement === this.element[0]
      ) {
        // For SHIFT-TAB, we cycle when we are on the first element.
        focusItem = FocusUtils.getLastTabStop(this.element);
        if (focusItem != null) {
          focusItem.focus();
          event.preventDefault();
        }
      }
    },

    //
    // Invoke focusable on the passed element.
    // Called on two distinct elements - the outer dialog,
    // and the closeWrapper (assuming that there is an x-icon in the dialog)
    //
    _setupFocus: function (elem) {
      var self = this;
      this._focusable({
        applyHighlight: true,
        setupHandlers: function (focusInHandler, focusOutHandler) {
          self._on(elem, {
            focus: function (event) {
              focusInHandler($(event.currentTarget));
            },
            blur: function (event) {
              focusOutHandler($(event.currentTarget));
            }
          });
        }
      });
    },

    _disableBodyOverflow: function () {
      var body = document.body;
      body.classList.add('oj-dialog-sheet-animating');
    },

    _restoreBodyOverflow: function () {
      var body = document.body;
      body.classList.remove('oj-dialog-sheet-animating');
    },

    _destroyCloseButton: function () {
      if (this.closeButtonDiv !== null && this.closeButtonDiv !== undefined) {
        if (this.closeButtonDiv.parentElement) {
          subtreeDetached(this.closeButtonDiv);
          this.closeButtonDiv.parentElement.removeChild(this.closeButtonDiv);
        }

        this.closeButton = null;
      }

      if (this._headerSlot) {
        this._headerSlot.classList.remove(OJD_HEADER_CLOSE);
      }
      if (this._uiDialogTitlebarDiv) {
        this._uiDialogTitlebarDiv.classList.remove(OJD_HEADER_CLOSE);
      }
    },

    //
    // Create a close button.
    // Needed for user-defined headers.
    //
    _createCloseButton: function (divParentElement) {
      // use oj-button for custom element implementations
      if (this._IsCustomElement()) {
        this.closeButtonDiv = document.createElement('oj-button');
        this.closeButtonDiv.classList.add(OJD_HEADER_CLOSE_WRAPPER);
        this.closeButtonDiv.setAttribute('data-oj-binding-provider', 'none');
        this.closeButtonDiv.setAttribute('display', 'icons');
        this.closeButtonDiv.setAttribute('chroming', 'half');

        var closeButtonLabel = document.createElement('span');
        closeButtonLabel.textContent = this.getTranslatedString('labelCloseIcon');

        var closeButtonStartIcon = document.createElement('span');
        closeButtonStartIcon.className = 'oj-fwk-icon oj-fwk-icon-cross';
        closeButtonStartIcon.setAttribute('slot', 'startIcon');

        this.closeButtonDiv.appendChild(closeButtonStartIcon);
        this.closeButtonDiv.appendChild(closeButtonLabel);

        divParentElement.appendChild(this.closeButtonDiv); // @HTMLUpdateOK
        subtreeAttached(this.closeButtonDiv);

        this.closeButton = $(this.closeButtonDiv);
      }

      if (!this._IsCustomElement()) {
        this.closeButton = $('<button><\button>').addClass(OJD_HEADER_CLOSE_WRAPPER);

        this.closeButton
          .ojButton({
            display: 'icons',
            chroming: 'half',
            label: this.getTranslatedString('labelCloseIcon'),
            icons: { start: 'oj-component-icon oj-fwk-icon-cross' }
          })
          .appendTo(divParentElement); // @HTMLUpdateOK

        this.closeButtonDiv = this.closeButton[0];
      }

      this._on(this.closeButton, {
        click: function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.close(event);
        }
      });

      // When the close button is present, add a class to the title bar.
      // This is used to conditionally apply style changes to the title div.
      if (this._headerSlot) {
        this._headerSlot.classList.add(OJD_HEADER_CLOSE);
      }
      if (this._uiDialogTitlebarDiv) {
        this._uiDialogTitlebarDiv.classList.add(OJD_HEADER_CLOSE);
      }

      // no need to do this - buttons handle focus on their own.
      // var hasFocus = this.closeButton;
      // this._setupFocus(hasFocus);
    },

    //
    // Create the close button and the titlebar's mousedown handler.
    //
    _createTitlebarCloseButton: function () {
      if (
        (this.closeButton === undefined || this.closeButton === null) &&
        this.options.cancelBehavior === 'icon'
      ) {
        this._createCloseButton(this._uiDialogTitlebarDiv);
      }

      this._on(this._uiDialogTitlebar, {
        mousedown: function (event) {
          // Don't prevent click on close button (#8838)
          // Focusing a dialog that is partially scrolled out of view
          // causes the browser to scroll it into view, preventing the click event
          // Note that the implementation will search for the dialog close wrapper class
          // in parent, grandparent, etc., in order to handle custom element vs. widget syntax,
          // as well as handle the differences in browser event implementions (e.g. IE reports
          // a shallower button stack for button click events).
          //
          var isCloseButton = isAncestorOrSelf(this.closeButtonDiv, event.target);
          this._titleBarMousedown = true;
          if (!isCloseButton) {
            // Set focus to the dialog if we are dragging by the header
            this.element.focus();
          }
        },
        mouseup: function () {
          this._titleBarMousedown = null;
        }
      });
    },

    _createTitlebar: function () {
      this._uiDialogTitlebarDiv = document.createElement('div');
      this._uiDialogTitlebarDiv.classList.add(OJD_HEADER);

      // prettier-ignore
      this._dialogContainer.insertBefore( // @HTMLUpdateOK
        this._uiDialogTitlebarDiv,
        this._dialogContainer.firstChild
      );

      subtreeAttached(this._uiDialogTitlebarDiv);

      this._uiDialogTitlebar = $(this._uiDialogTitlebarDiv);

      this._uiDialogTitleDiv = document.createElement('h1');
      this._uiDialogTitleDiv.classList.add('oj-dialog-title');
      $(this._uiDialogTitleDiv).uniqueId();
      this._uiDialogTitlebarDiv.appendChild(this._uiDialogTitleDiv); // @HTMLUpdateOK
      subtreeAttached(this._uiDialogTitleDiv);

      this._title(this._uiDialogTitleDiv);

      this.element.attr({
        'aria-labelledby': this._uiDialogTitleDiv.id
      });
    },

    _title: function (_title) {
      var title = _title;

      // Set the content of the title.
      if (!this._IsCustomElement()) {
        if (!this.options.title) {
          title.innerHTML = '&#160;'; // @HTMLUpdateOK
        }
        title.textContent = this.options.title;
      } else if (this._IsCustomElement()) {
        if (this.options.dialogTitle) {
          title.textContent = this.options.dialogTitle;
        } else if (this.element.attr('title')) {
          title.textContent = this.element.attr('title');
        } else {
          title.innerHTML = '&#160;'; // @HTMLUpdateOK
        }
      }
    },

    _makeDraggable: function () {
      var that = this;
      var options = this.options;

      function filteredUi(ui) {
        return {
          position: ui.position,
          offset: ui.offset
        };
      }

      this.element.draggable({
        addClasses: false,
        handle: '.oj-dialog-header',
        containment: 'document',
        start: function (event, ui) {
          $(this).addClass('oj-dialog-dragging');
          that._positionDescendents();
          that._trigger('dragStart', event, filteredUi(ui));
        },
        drag: function (event, ui) {
          //
          // call positionDescendents so that any descendents,
          // such as a pulldown menu, will be repositioned as the dialog is dragged.
          //
          that._positionDescendents();
          that._trigger('drag', event, filteredUi(ui));
        },
        stop: function (event, ui) {
          var left = ui.offset.left - that.document.scrollLeft();
          var top = ui.offset.top - that.document.scrollTop();

          options.position = {
            my: { horizontal: 'left', vertical: 'top' },
            at: { horizontal: 'left', vertical: 'top' },
            offset: { x: left >= 0 ? left : 0, y: top >= 0 ? top : 0 },
            of: window
          };

          $(this).removeClass('oj-dialog-dragging');
          that._positionDescendents();
          that._trigger('dragStop', event, filteredUi(ui));
        }
      });

      this.element.addClass(OJ_DRAGGABLE);
    },
    _destroyResizable: function () {
      if (this._resizableComponent && this._resizableComponent('instance')) {
        this._resizableComponent('destroy');
        delete this._resizableComponent;
      }
    },
    _makeResizable: function () {
      this._destroyResizable();
      if (this.options.resizeBehavior !== 'resizable') {
        return;
      }
      var that = this;
      var resizeHandles = 'n,e,s,w,se,sw,ne,nw';

      function filteredUi(ui) {
        return {
          originalPosition: ui.originalPosition,
          originalSize: ui.originalSize,
          position: ui.position,
          size: ui.size
        };
      }

      this._resizableComponent = this.element.ojResizable.bind(this.element);

      var minWidth = Math.max(getCSSLengthAsFloat(this.element.css('min-width')), 10);
      var minHeight = Math.max(getCSSLengthAsFloat(this.element.css('min-height')), 10);
      var maxWidth = getCSSLengthAsFloat(this.element.css('max-width'));
      var maxHeight = getCSSLengthAsFloat(this.element.css('max-height'));
      maxWidth = maxWidth === 0 ? null : maxWidth;
      maxHeight = maxHeight === 0 ? null : maxHeight;

      this._resizableComponent({
        minWidth: minWidth,
        minHeight: minHeight,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        cancel: OJD_CONTENT_CLASS,
        containment: 'document',
        handles: resizeHandles,
        start: function (event, ui) {
          that._isResizing = true;

          $(this).addClass('oj-dialog-resizing');
          // fire resizestart
          that._trigger('resizeStart', event, filteredUi(ui));
        },
        resize: function (event, ui) {
          that._trigger('resize', event, filteredUi(ui));
        },
        stop: function (event, ui) {
          that._isResizing = false;

          $(this).removeClass('oj-dialog-resizing');
          that._trigger('resizeStop', event, filteredUi(ui));
        }
      });
    },
    _position: function () {
      //
      // Extended position objects with better names to support RTL.
      //
      var isRtl = this._GetReadingDirection() === 'rtl';
      var position = this.options.position;
      if (this._isSheetDisplay()) {
        position = this._setSheetPosition(position);
      }
      position = oj.PositionUtils.coerceToJqUi(position);
      position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);
      this.element.position(position);

      this._positionDescendents();
    },
    _positionDescendents: function () {
      // trigger refresh of descendents
      oj.PopupService.getInstance().triggerOnDescendents(
        this.element,
        oj.PopupService.EVENT.POPUP_REFRESH
      );
    },
    _adjustPosition: function () {
      var isDraggable = this.element.hasClass(OJ_DRAGGABLE);
      var isResizable = this.element.hasClass(OJ_RESIZABLE);
      // do not adjust position for resizable, movable and big dialogs
      if (
        isDraggable ||
        isResizable ||
        this.element.width() > window.innerWidth ||
        this.element.height() > window.innerHeight
      ) {
        this._positionDescendents();
      } else {
        this._position();
      }
    },
    _isSheetDisplay: function () {
      if (this._isDefaultPosition) {
        var behavior = parseJSONFromFontFamily('oj-theme-json').behavior;
        var isPhone = getDeviceRenderMode() === 'phone';
        if (behavior.includes('redwood') && isPhone) {
          return true;
        }
      }
      return false;
    },
    _isFullDisplay: function () {
      if (!this._isSheetDisplay()) {
        // full display supported on Reddwood mobile only
        return false;
      }
      var height = window.innerHeight;
      var width = window.innerWidth;
      var elemHeight = this.element[0].offsetHeight;
      var elemWidth = this.element[0].offsetWidth;
      if (elemHeight >= height * 0.95 && elemWidth >= width * 0.95) {
        return true;
      }
      return false;
    },
    _hasPositionAttribute: function () {
      var attrs = this.element[0].attributes;
      for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].name.startsWith('position')) {
          return true;
        }
      }
      return false;
    },
    _setSheetPosition: function (position) {
      var pos = $.extend({}, position);
      pos.my.vertical = 'bottom';
      pos.at.vertical = 'bottom';
      pos.of = window;
      return pos;
    },
    _setOption: function (key, value, flags) {
      /* jshint maxcomplexity:15*/
      var isDraggable;

      // don't allow a dialog to be disabled.
      if (key === 'disabled') {
        return;
      }

      this._super(key, value, flags);

      switch (key) {
        case 'dragAffordance':
          isDraggable = this.element.hasClass(OJ_DRAGGABLE);

          if (isDraggable && value === 'none') {
            this.element.draggable('destroy');
            this.element.removeClass(OJ_DRAGGABLE);
          }

          if (!this._isSheetDisplay() && !isDraggable && value === 'title-bar') {
            this._makeDraggable();
          }

          break;

        case 'position':
          // convert to the internal position format and reevaluate the position.
          this._isDefaultPosition = false;
          var options = this.options;
          options.position = oj.PositionUtils.coerceToJet(value, options.position);
          this._position();

          // setting the option is handled here.  don't call on super.
          return;

        case 'resizeBehavior':
          if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
            this._makeResizable();
          }
          break;

        case 'title':
        case 'dialogTitle':
          if (this.userDefinedDialogHeader) {
            this._title(this._userDefinedHeaderDiv.querySelector(OJD_TITLE_CLASS));
          } else {
            this._title(this._uiDialogTitlebarDiv.querySelector(OJD_TITLE_CLASS));
          }
          break;
        case 'role':
          this.element.attr('role', value);
          break;

        case 'modality':
          if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
            /** @type {!Object.<oj.PopupService.OPTION, ?>} */
            var psOptions = {};
            psOptions[oj.PopupService.OPTION.POPUP] = this.element;
            psOptions[oj.PopupService.OPTION.MODALITY] = value;
            oj.PopupService.getInstance().changeOptions(psOptions);
          }
          break;

        case 'cancelBehavior':
          if (value === 'none' || value === 'escape') {
            this._destroyCloseButton();
          } else if (value === 'icon') {
            if (this.userDefinedDialogHeader) {
              this._destroyCloseButton();
              this._createCloseButton(this._userDefinedHeaderDiv);

              //
              // Insert oj-dialog-title between oj-dialog-header and oj-dialog-header-close-wrapper
              //
              this._userDefinedTitleDiv = this._userDefinedHeaderDiv.querySelector(OJD_TITLE_CLASS);
              this._userDefinedTitle = $(this._userDefinedTitleDiv);
            } else {
              this._destroyCloseButton();
              this._createCloseButton(this._uiDialogTitlebarDiv);

              this.standardTitleDiv = this._uiDialogTitlebarDiv.querySelector(OJD_TITLE_CLASS);
              this.standardTitle = $(this.standardTitleDiv);
            }
          }
          break;
        default:
          break;
      }
    },

    getNodeBySubId: function (locator) {
      if (locator === null) {
        return this.element ? this.element[0] : null;
      }

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

      var subId = locator.subId;

      //
      // Use slot structure to return body and footer subids.
      //
      if (this._IsCustomElement() && (subId === OJD_FOOTER || subId === OJD_BODY)) {
        if (subId === OJD_BODY) {
          return this._uiDialogBodyDiv.querySelector(OJD_BODY_CLASS);
        } else if (subId === OJD_FOOTER) {
          return this._uiDialogFooterDiv.querySelector(OJD_FOOTER_CLASS);
        }
      } else {
        // General case
        var selector;
        var node;

        switch (subId) {
          case OJD_HEADER:
          case OJD_CONTENT:
          case OJD_FOOTER:
            selector =
              this.element[0].nodeName +
              '[id="' +
              _escapeId(this.element.attr('id')) +
              '"] > ' +
              OJD_CONTAINER_CLASS +
              ' > ';
            selector += '.' + subId;
            node = this.element.parent().find(selector);
            if (!node || node.length === 0) {
              return null;
            }

            return node[0];

          case OJ_RESIZABLE_N:
          case OJ_RESIZABLE_E:
          case OJ_RESIZABLE_S:
          case OJ_RESIZABLE_W:
          case OJ_RESIZABLE_SE:
          case OJ_RESIZABLE_SW:
          case OJ_RESIZABLE_NE:
          case OJ_RESIZABLE_NW:
            selector =
              this.element[0].nodeName + '[id="' + _escapeId(this.element.attr('id')) + '"] > ';
            selector += '.' + subId;
            node = this.element.parent().find(selector);
            if (!node || node.length === 0) {
              return null;
            }

            return node[0];

          // "oj-dialog-close-icon" is deprecated as of 1.2
          // use "oj-dialog-close" instead.
          // "oj-dialog-close" is deprecated as of 2.1.*
          case 'oj-dialog-close-icon':
          case 'oj-dialog-close':
            return null;

          // "oj-dialog-body" is deprecated as of 1.2
          case OJD_BODY:
            selector =
              this.element[0].nodeName + '[id="' + _escapeId(this.element.attr('id')) + '"] > ';
            selector += OJD_CONTAINER_CLASS + ' > ' + OJD_CONTENT_CLASS + ' > ';
            selector += '.' + subId;
            node = this.element.parent().find(selector);
            if (!node || node.length === 0) {
              return null;
            }

            return node[0];

          case OJD_HEADER_CLOSE_WRAPPER:
            selector =
              this.element[0].nodeName + '[id="' + _escapeId(this.element.attr('id')) + '"] > ';
            selector += OJD_CONTAINER_CLASS + ' > ' + OJD_HEADER_CLASS + ' > ';
            selector += '.' + subId;
            node = this.element.parent().find(selector);
            if (!node || node.length === 0) {
              return null;
            }

            return node[0];

          default:
            break;
        }
      }

      // Non-null locators have to be handled by the component subclasses
      return null;
    },

    getSubIdByNode: function (node) {
      if (node != null) {
        var nodeCached = $(node);

        if (nodeCached.hasClass(OJD_HEADER)) {
          return { subId: OJD_HEADER };
        }
        if (nodeCached.hasClass(OJD_FOOTER)) {
          return { subId: OJD_FOOTER };
        }
        if (nodeCached.hasClass(OJD_CONTENT)) {
          return { subId: OJD_CONTENT };
        }
        if (nodeCached.hasClass(OJD_HEADER_CLOSE_WRAPPER)) {
          return { subId: OJD_HEADER_CLOSE_WRAPPER };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_N)) {
          return { subId: OJ_RESIZABLE_N };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_E)) {
          return { subId: OJ_RESIZABLE_E };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_S)) {
          return { subId: OJ_RESIZABLE_S };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_W)) {
          return { subId: OJ_RESIZABLE_W };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_SE)) {
          return { subId: OJ_RESIZABLE_SE };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_SW)) {
          return { subId: OJ_RESIZABLE_SW };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_NE)) {
          return { subId: OJ_RESIZABLE_NE };
        }
        if (nodeCached.hasClass(OJ_RESIZABLE_NW)) {
          return { subId: OJ_RESIZABLE_NW };
        }
      }

      return null;
    },
    /**
     * @memberof oj.ojDialog
     * @instance
     * @private
     * @return {void}
     */
    _surrogateRemoveHandler: function () {
      // In all cases except when the dialog is already open, removal of the
      // surrogate during opening or closing will result in implicit removal.
      // 1) CLOSING: Handled in oj.ZOrderUtils.removeFromAncestorLayer.  If the
      //    surrogate doesn't exist the layer containing the popup dom is detached.
      // 2) OPENING: in the PopupServiceImpl#open _finalize, if the surrogate doesn't
      //    exist after in the open state, this remove callback is invoked.
      //
      // Custom element will call _NotifyDetached after element.remove but
      // but jquery UI instances will invoke the _destory method.

      var element = this.element;
      var status = oj.ZOrderUtils.getStatus(element);
      if (status === oj.ZOrderUtils.STATUS.OPEN) {
        element.remove();
      }
    },
    /**
     * @memberof oj.ojDialog
     * @instance
     * @private
     * @return {!Object.<oj.PopupService.EVENT, function(...)>}
     */
    _getPopupServiceEvents: function () {
      if (!this._popupServiceEvents) {
        /** @type {!Object.<oj.PopupService.EVENT, function(...)>} **/
        var events = {};

        events[oj.PopupService.EVENT.POPUP_CLOSE] = this._closeImplicitly.bind(this);
        events[oj.PopupService.EVENT.POPUP_REMOVE] = this._surrogateRemoveHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_REFRESH] = this._adjustPosition.bind(this);
        events[oj.PopupService.EVENT.POPUP_BEFORE_OPEN] = this._beforeOpenHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_AFTER_OPEN] = this._afterOpenHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_BEFORE_CLOSE] = this._beforeCloseHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_AFTER_CLOSE] = this._afterCloseHandler.bind(this);

        this._popupServiceEvents = events;
      }
      return this._popupServiceEvents;
    },
    /**
     * @memberof oj.ojDialog
     * @instance
     * @private
     */
    _closeImplicitly: function () {
      this._ignoreBeforeCloseResultant = true;
      this.close();
      delete this._ignoreBeforeCloseResultant;
    },

    /**
     * Creates a Promise exposed by the {@link oj.ojDialog#whenReady} method.
     *
     * @param {string} operation valid values are "open", "close" or "none"
     * @memberof oj.ojDialog
     * @instance
     * @private
     */
    _setWhenReady: function (operation) {
      /** @type {PopupWhenReadyMediator} */
      var mediator = this._whenReadyMediator;
      if (mediator) {
        mediator.destroy();
        delete this._whenReadyMediator;
      }

      // operation === none
      if (['open', 'close'].indexOf(operation) < 0) {
        return;
      }

      this._whenReadyMediator = new PopupWhenReadyMediator(
        this.element,
        operation,
        'ojDialog',
        this._IsCustomElement()
      );
    },

    /**
     * Checks to see if there is a pending "open" or "close" operation.  If pending and it
     * is the same as the requested operation, the request silently fails.  If the current
     * operation is the inverse operation, we queue the current operation after the pending
     * operation is resolved.
     *
     * @memberof oj.ojDialog
     * @instance
     * @private
     * @param {string} operation currently requested
     * @param {Array} args passed to a queue operation
     * @returns {boolean} <code>true</code> if a "close" or "open" operation is pending completion.
     */
    _isOperationPending: function (operation, args) {
      /** @type {oj.PopupWhenReadyMediator} **/
      var mediator = this._whenReadyMediator;
      if (mediator) {
        return mediator.isOperationPending(this, operation, operation, args);
      }
      return false;
    },
    /**
     * Notifies the component that its subtree has been removed from the document
     * programmatically after the component has been created.
     *
     * @memberof oj.ojDialog
     * @instance
     * @protected
     * @override
     */
    _NotifyDetached: function () {
      // detaching an open popup results in implicit dismissal
      if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
        this._closeImplicitly();
      }

      this._super();
    }
  });

  setDefaultOptions({
    ojDialog: {
      resizeBehavior: createDynamicPropertyGetter(function () {
        return (parseJSONFromFontFamily(OJD_OPTION_DEFAULTS) || {}).resizeBehavior;
      }),
      cancelBehavior: createDynamicPropertyGetter(function () {
        return (parseJSONFromFontFamily(OJD_OPTION_DEFAULTS) || {}).cancelBehavior;
      }),
      dragAffordance: createDynamicPropertyGetter(function () {
        return (parseJSONFromFontFamily(OJD_OPTION_DEFAULTS) || {}).dragAffordance;
      })
    }
  });
})();

(function () {
var __oj_dialog_metadata = 
{
  "properties": {
    "cancelBehavior": {
      "type": "string",
      "enumValues": [
        "escape",
        "icon",
        "none"
      ]
    },
    "dialogTitle": {
      "type": "string"
    },
    "dragAffordance": {
      "type": "string",
      "enumValues": [
        "none",
        "title-bar"
      ]
    },
    "initialVisibility": {
      "type": "string",
      "enumValues": [
        "hide",
        "show"
      ],
      "value": "hide"
    },
    "modality": {
      "type": "string",
      "enumValues": [
        "modal",
        "modeless"
      ],
      "value": "modal"
    },
    "position": {
      "type": "object",
      "properties": {
        "at": {
          "type": "object",
          "properties": {
            "horizontal": {
              "type": "string",
              "enumValues": [
                "center",
                "end",
                "left",
                "right",
                "start"
              ],
              "value": "center"
            },
            "vertical": {
              "type": "string",
              "enumValues": [
                "bottom",
                "center",
                "top"
              ],
              "value": "center"
            }
          }
        },
        "collision": {
          "type": "string",
          "enumValues": [
            "fit",
            "flip",
            "flipfit",
            "none"
          ],
          "value": "fit"
        },
        "my": {
          "type": "object",
          "properties": {
            "horizontal": {
              "type": "string",
              "enumValues": [
                "center",
                "end",
                "left",
                "right",
                "start"
              ],
              "value": "center"
            },
            "vertical": {
              "type": "string",
              "enumValues": [
                "bottom",
                "center",
                "top"
              ],
              "value": "center"
            }
          }
        },
        "of": {
          "type": "string|object",
          "value": "window"
        },
        "offset": {
          "type": "object",
          "properties": {
            "x": {
              "type": "number",
              "value": 0
            },
            "y": {
              "type": "number",
              "value": 0
            }
          }
        }
      }
    },
    "resizeBehavior": {
      "type": "string",
      "enumValues": [
        "none",
        "resizable"
      ]
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "labelCloseIcon": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "close": {},
    "getProperty": {},
    "isOpen": {},
    "open": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {},
    "ojBeforeClose": {},
    "ojBeforeOpen": {},
    "ojClose": {},
    "ojFocus": {},
    "ojOpen": {},
    "ojResize": {},
    "ojResizeStart": {},
    "ojResizeStop": {}
  },
  "extension": {}
};
  __oj_dialog_metadata.extension._WIDGET_NAME = 'ojDialog';
  __oj_dialog_metadata.extension._CONTROLS_SUBTREE_HIDDEN = true;
  oj.CustomElementBridge.register('oj-dialog', { metadata: __oj_dialog_metadata });
})();
