/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojpopupcore',
                  'jqueryui-amd/draggable', 'jqueryui-amd/mouse'],
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

// lory retrieved from https://raw.github.com/jquery/jquery-ui/1-10-stable/ui/jquery.ui.resizable.js on 04/09/2014, and then modified


/*
*
*   - This widget is NOT EXPOSED.
*     ojResizable is made available only to dialog and other components that need to call resize functionality.
*   Changes:
*    - Options minWidth, minHeight, maxWidth, and maxHeight have been deleted
*    - Removed zIndex option
*    - Removed css write of zIndex (this is supported in style sheets)
*
*/

(function() {

    oj.__registerWidget("oj.ojResizable", $['oj']['baseComponent'], {
	version: "1.0.0",
        widgetEventPrefix : "oj", 

	options: {

	/////////////////////////////////////////////////////////////////////////////////////
	//
	// Mouse Options (copied)
	//
	/////////////////////////////////////////////////////////////////////////////////////

	    /** 
             *
             * @private
             * @expose
             * @memberof! oj.ojResizable
	     * @instance
             *
             */
	    cancel: "input,textarea,button,select,option",

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

	/////////////////////////////////////////////////////////////////////////////////////
	//
	// Resize Options
	//
	/////////////////////////////////////////////////////////////////////////////////////


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
	    animateDuration: "slow",
	    /** 
             *
             * @private
             * @expose
             * @memberof! oj.ojResizable
	     * @instance
             *
             */
	    animateEasing: "swing",

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
	    handles: "e,s,se",
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

	    /////////////////
	    // callbacks
	    /////////////////


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

	/////////////////////////////////////////////////////////////////////////////////////
	//
	// Original Resize Functions
	//
	/////////////////////////////////////////////////////////////////////////////////////

	_num: function( value ) {
	    return parseInt( value, 10 ) || 0;
	},

	_isNumber: function( value ) {
	    return !isNaN( parseInt( value , 10 ) );
	},

	_hasScroll: function( el, a ) {

	    if ( $( el ).css( "overflow" ) === "hidden") {
		return false;
	    }

	    var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
	    has = false;

	    if ( el[ scroll ] > 0 ) {
		return true;
	    }

	    // TODO: determine which cases actually cause this to happen
	    // if the element doesn't have the scroll set, see if it's possible to
	    // set the scroll
	    el[ scroll ] = 1;
	    has = ( el[ scroll ] > 0 );
	    el[ scroll ] = 0;
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
	_ComponentCreate : function ()
	{
            this._super();

	    var n, i, handle, axis, hname,
            that = this, o = this.options;

            //
            // Create an instance of the 3rd party jqueryui mouse widget.
            //

            var mouseConstructor = this.element['mouse'].bind(this.element);
            mouseConstructor();
            this.mouse = mouseConstructor('instance');

            //
            // Because we aggregating the mouse widget (and not extending it),
            // we override the protected methods of this mouse instance.
            //

	    this.mouse['_mouseCapture'] = function(event) {
		return that._mouseCapture(event);
	    };

	    this.mouse['_mouseStart'] = function(event) {
		return that._mouseStart(event);
	    };

	    this.mouse['_mouseDrag'] = function(event) {
		return that._mouseDrag(event);
	    };

	    this.mouse['_mouseStop'] = function(event) {
		return that._mouseStop(event);
	    };

	    this.element.addClass("oj-resizable");

	    $.extend(this, {
		originalElement: this.element,
		_proportionallyResizeElements: [],
		// _helper: o.helper || o.ghost || o.animate ? o.helper || "oj-resizable-helper" : null
		_helper: null
	    });

	    this._initialResize = true;

	    this.handles = o.handles || (!$(".oj-resizable-handle", this.element).length ? "e,s,se" : { n: ".oj-resizable-n", e: ".oj-resizable-e", s: ".oj-resizable-s", w: ".oj-resizable-w", se: ".oj-resizable-se", sw: ".oj-resizable-sw", ne: ".oj-resizable-ne", nw: ".oj-resizable-nw" });
	    if(this.handles.constructor === String) {

		if ( this.handles === "all") {
		    this.handles = "n,e,s,w,se,sw,ne,nw";
		}

		n = this.handles.split(",");
		this.handles = {};

		for(i = 0; i < n.length; i++) {

		    handle = $.trim(n[i]);
		    hname = "oj-resizable-"+handle;
		    axis = $("<div class='oj-resizable-handle " + hname + "'></div>");

		    // axis.css({ zIndex: o.zIndex });

		    // Todo: refine for alta styles
		    // 
		    // if ("se" === handle) {
		    // axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
		    //}

		    this.handles[handle] = ".oj-resizable-"+handle;
		    this.element.append(axis);   // @HTMLUpdateOK
		}
	    }

	    this._renderAxis = function(target) {

		var i, axis, padPos, padWrapper;

		target = target || this.element;

		for(i in this.handles) {

		    if(this.handles[i].constructor === String) {
			this.handles[i] = this.element.children( this.handles[ i ] ).first().show();
		    }

		}
	    };

	    // TODO: make renderAxis a prototype function
	    this._renderAxis(this.element);

	    this._handles = $(".oj-resizable-handle", this.element);

	    this._handles.mouseover(function() {
		if (!that.resizing) {
		    if (this.className) {
			axis = this.className.match(/oj-resizable-(se|sw|ne|nw|n|e|s|w)/i);
		    }
		    that.axis = axis && axis[1] ? axis[1] : "se";
		}
	    });

	    this.mouse['_mouseInit']();
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

	_destroy: function() {

            if (this.mouse) {
                this.mouse['_mouseDestroy']();
            }

            try {
                this.mouse['destroy']();
                this.mouse = null;
	    } catch ( e ) {}

	    var wrapper,
	    _destroy = function(exp) {
		$(exp).removeClass("oj-resizable oj-resizable-disabled oj-resizable-resizing")
		    .removeData("resizable").removeData("oj-resizable").unbind(".resizable").find(".oj-resizable-handle").remove();
	    };

	    _destroy(this.originalElement);

	    return this;
	},

	_mouseCapture: function(event) {
	    var i, handle,
	    capture = false;

	    for (i in this.handles) {
		handle = $(this.handles[i])[0];
		if (handle === event.target || $.contains(handle, event.target)) {
		    capture = true;
		}
	    }

	    return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

	    var curleft, curtop, cursor,
	    o = this.options,
	    iniPos = this.element.position(),
	    el = this.element;

	    this.resizing = true;

	    // Bugfix for http://bugs.jqueryui.com/ticket/1749
	    if ( (/absolute/).test( el.css("position") ) ) {
		el.css({ position: "absolute", top: el.css("top"), left: el.css("left") });
	    } else if (el.is(".oj-draggable")) {
		el.css({ position: "absolute", top: iniPos.top, left: iniPos.left });
	    }

	    this._renderProxy();

	    curleft = this._num(this.helper.css("left"));
	    curtop = this._num(this.helper.css("top"));

	    if (o.containment) {
		curleft += $(o.containment).scrollLeft() || 0;
		curtop += $(o.containment).scrollTop() || 0;
	    }

	    this.offset = this.helper.offset();
	    this.position = { left: curleft, top: curtop };
	    this.size = { width: el.width(), height: el.height() };
	    this.originalSize = { width: el.width(), height: el.height() };
	    this.originalPosition = { left: curleft, top: curtop };
	    this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
	    this.originalMousePosition = { left: event.pageX, top: event.pageY };

	    this.aspectRatio =  (this.originalSize.width / this.originalSize.height) || 1;

	    // cursor = $(".oj-resizable-" + this.axis).css("cursor");
	    cursor = /** @type string */ ($(".oj-resizable-" + this.axis).css("cursor"));
	    $("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

	    el.addClass("oj-resizable-resizing");

	    this._propagate("start", event);

	    this._alsoresize_start(event);
	    this._containment_start(event);

	    return true;
	},

	_mouseDrag: function(event) {

	    var data,
	    el = this.helper, props = {},
	    smp = this.originalMousePosition,
	    a = this.axis,
	    dx = (event.pageX-smp.left)||0,
	    dy = (event.pageY-smp.top)||0,
	    trigger = this._change[a];

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

	    this._propagate("resize", event);

	    this._alsoresize_resize(event, this.ui());
	    this._containment_resize(event, this.ui());

	    if ( this.position.top !== this.prevPosition.top ) {
		props.top = this.position.top + "px";
	    }
	    if ( this.position.left !== this.prevPosition.left ) {
		props.left = this.position.left + "px";
	    }
	    if ( this.size.width !== this.prevSize.width ) {
		props.width = this.size.width + "px";
	    }
	    if ( this.size.height !== this.prevSize.height ) {
		props.height = this.size.height + "px";
	    }
	    el.css( props );

	    if ( !this._helper && this._proportionallyResizeElements.length ) {
		this._proportionallyResize();
	    }

	    if ( !$.isEmptyObject( props ) ) {
		this._trigger( "resize", event, this.ui() );
	    }

	    return false;
	},

	_mouseStop: function(event) {

	    this.resizing = false;
	    var pr, ista, soffseth, soffsetw, s, left, top,
	    o = this.options, that = this;

	    $("body").css("cursor", "auto");

	    this.element.removeClass("oj-resizable-resizing");

	    this._propagate("stop", event);

	    this._alsoresize_stop(event);
	    this._containment_stop(event);

	    return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
	    var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
	    o = this.options;

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

	    if(forceAspectRatio) {
		pMinWidth = b.minHeight * this.aspectRatio;
		pMinHeight = b.minWidth / this.aspectRatio;
		pMaxWidth = b.maxHeight * this.aspectRatio;
		pMaxHeight = b.maxWidth / this.aspectRatio;

		if(pMinWidth > b.minWidth) {
		    b.minWidth = pMinWidth;
		}
		if(pMinHeight > b.minHeight) {
		    b.minHeight = pMinHeight;
		}
		if(pMaxWidth < b.maxWidth) {
		    b.maxWidth = pMaxWidth;
		}
		if(pMaxHeight < b.maxHeight) {
		    b.maxHeight = pMaxHeight;
		}
	    }
	    this._vBoundaries = b;
	},

	_updateCache: function(data) {
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

	_updateRatio: function( data ) {

	    var cpos = this.position,
	    csize = this.size,
	    a = this.axis;

	    if (this._isNumber(data.height)) {
		data.width = (data.height * this.aspectRatio);
	    } else if (this._isNumber(data.width)) {
		data.height = (data.width / this.aspectRatio);
	    }

	    if (a === "sw") {
		data.left = cpos.left + (csize.width - data.width);
		data.top = null;
	    }
	    if (a === "nw") {
		data.top = cpos.top + (csize.height - data.height);
		data.left = cpos.left + (csize.width - data.width);
	    }

	    return data;
	},

	_respectSize: function( data ) {

	    var o = this._vBoundaries,
	    a = this.axis,
	    ismaxw = this._isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = this._isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
	    isminw = this._isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = this._isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
	    dw = this.originalPosition.left + this.originalSize.width,
	    dh = this.position.top + this.size.height,
	    cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
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

	_proportionallyResize: function() {

	    if (!this._proportionallyResizeElements.length) {
		return;
	    }

	    var i, j, borders, paddings, prel,
	    element = this.helper || this.element;

	    for ( i=0; i < this._proportionallyResizeElements.length; i++) {

		prel = this._proportionallyResizeElements[i];

		if (!this.borderDif) {
		    this.borderDif = [];
		    borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
		    paddings = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];

		    for ( j = 0; j < borders.length; j++ ) {
			this.borderDif[ j ] = ( parseInt( borders[ j ], 10 ) || 0 ) + ( parseInt( paddings[ j ], 10 ) || 0 );
		    }
		}

		prel.css({
		    height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
		    width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
		});

	    }

	},

	_renderProxy: function() {

	    var el = this.element, o = this.options;
	    this.elementOffset = el.offset();

	    this.helper = this.element;

	},

	_change: {
	    "e": function(event, dx) {
		return { width: this.originalSize.width + dx };
	    },
	    "w": function(event, dx) {
		var cs = this.originalSize, sp = this.originalPosition;
		return { left: sp.left + dx, width: cs.width - dx };
	    },
	    "n": function(event, dx, dy) {
		var cs = this.originalSize, sp = this.originalPosition;
		return { top: sp.top + dy, height: cs.height - dy };
	    },
	    "s": function(event, dx, dy) {
		return { height: this.originalSize.height + dy };
	    },
	    "se": function(event, dx, dy) {
		return $.extend(this._change["s"].apply(this, arguments), this._change["e"].apply(this, [event, dx, dy]));
	    },
	    "sw": function(event, dx, dy) {
		return $.extend(this._change["s"].apply(this, arguments), this._change["w"].apply(this, [event, dx, dy]));
	    },
	    "ne": function(event, dx, dy) {
		return $.extend(this._change["n"].apply(this, arguments), this._change["e"].apply(this, [event, dx, dy]));
	    },
	    "nw": function(event, dx, dy) {
		return $.extend(this._change["n"].apply(this, arguments), this._change["w"].apply(this, [event, dx, dy]));
	    }
	},

	_propagate: function(n, event) {

	    // 
	    // Propage resizeStart and resizeStop events.
	    // (resize is propagated internally by drag)
	    // 

	    // $.ui.plugin.call(this, n, [event, this.ui()]);
	    (n !== "resize" && this._trigger(n, event, this.ui()));
	},

	//////////////////////////////////////////////////////////////////////////////////
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
	/////////////////////////////////////////////////////////////////////////////////

	_alsoresize_start: function () {

	    //var that = $(this).resizable( "instance" ),
	    // var that = $(this).data("oj-resizable"), // w
	    var that = this;
	    var o = that.options;
	    // var initialR = that._initialResize;

	    var _store = function (exp) {
		$(exp).each(function() {
		    var el = $(this);

		    el.data("oj-resizable-alsoresize", {
			width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
			left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
		    });
		});
	    };

	    if (typeof(o.alsoResize) === "object" && !o.alsoResize.parentNode) {
		if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
		else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
	    }else{
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
		height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
		top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
	    },

	    _alsoResize = function (exp, c) {
		$(exp).each(function() {
		    var el = $(this), start = $(this).data("oj-resizable-alsoresize"), style = {},
		    css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];

		    $.each(css, function (i, prop) {
			var sum = (start[prop]||0) + (delta[prop]||0);
			if (sum && sum >= 0) {
			    style[prop] = sum || null;
			}
		    });

		    el.css(style);
		});
	    };

	    if (typeof(o.alsoResize) === "object" && !o.alsoResize.nodeType) {
		$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
	    }else{
		_alsoResize(o.alsoResize, null);
	    }
	},

	_alsoresize_stop: function () {
	    // $(this).removeData("resizable-alsoresize");
	    $(this).removeData("oj-resizable-alsoresize");
	},


	/////////////////////////////////////////////////////////////////////////////////
	// 
	// Code block for containment functionality (formerly defined as a plugin)
	// 
	// $.ui.plugin.add( "resizable", "containment", {
	// 
	/////////////////////////////////////////////////////////////////////////////////

	_containment_start: function() {

	    var element, p, co, ch, cw, width, height;

	    // var that = $(this).data("oj-resizable");
	    var that = this;

	    var o = that.options,
	    el = that.element,
	    oc = o.containment,
	    ce = ( oc instanceof $ ) ? oc.get( 0 ) : ( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

	    if ( !ce ) {
		return;
	    }

	    that.containerElement = $( ce );

	    if ( /document/.test( oc ) || oc === document ) {
		that.containerOffset = {
		    left: 0,
		    top: 0
		};
		that.containerPosition = {
		    left: 0,
		    top: 0
		};

		that.parentData = {
		    element: $( document ),
		    left: 0,
		    top: 0,
		    width: $( document ).width(),
		    height: $( document ).height() || document.body.parentNode.scrollHeight
		};
	    } else {
		element = $( ce );
		p = [];
		$([ "Top", "Right", "Left", "Bottom" ]).each(function( i, name ) {
		    p[ i ] = that._num( element.css( "padding" + name ) );
		});

		that.containerOffset = element.offset();
		that.containerPosition = element.position();
		that.containerSize = {
		    height: ( element.innerHeight() - p[ 3 ] ),
		    width: ( element.innerWidth() - p[ 1 ] )
		};

		co = that.containerOffset;
		ch = that.containerSize.height;
		cw = that.containerSize.width;
		width = ( that._hasScroll ( ce, "left" ) ? ce.scrollWidth : cw );
		height = ( that._hasScroll ( ce ) ? ce.scrollHeight : ch ) ;

		that.parentData = {
		    element: ce,
		    left: co.left,
		    top: co.top,
		    width: width,
		    height: height
		};
	    }
	},

	_containment_resize: function( event, ui ) {
	    var woset, hoset, isParent, isOffsetRelative;

	    // var that = $(this).data("oj-resizable");
	    var that = this;

	    var o = that.options,
	    co = that.containerOffset,
	    cp = that.position,
	    pRatio = event.shiftKey,
	    cop = {
		top: 0,
		left: 0
	    },
	    ce = that.containerElement,
	    continueResize = true;

	    if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
		cop = co;
	    }

	    if ( cp.left < ( that._helper ? co.left : 0 ) ) {
		that.size.width = that.size.width + ( that._helper ? ( that.position.left - co.left ) : ( that.position.left - cop.left ) );
		if ( pRatio ) {
		    that.size.height = that.size.width / that.aspectRatio;
		    continueResize = false;
		}
		that.position.left = o.helper ? co.left : 0;
	    }

	    if ( cp.top < ( that._helper ? co.top : 0 ) ) {
		that.size.height = that.size.height + ( that._helper ? ( that.position.top - co.top ) : that.position.top );
		if ( pRatio ) {
		    that.size.width = that.size.height * that.aspectRatio;
		    continueResize = false;
		}
		that.position.top = that._helper ? co.top : 0;
	    }

	    that.offset.left = that.parentData.left + that.position.left;
	    that.offset.top = that.parentData.top + that.position.top;

	    woset = Math.abs( ( that._helper ? that.offset.left - cop.left : ( that.offset.left - co.left ) ) + that.sizeDiff.width );
	    hoset = Math.abs( ( that._helper ? that.offset.top - cop.top : ( that.offset.top - co.top ) ) + that.sizeDiff.height );

	    isParent = that.containerElement.get( 0 ) === that.element.parent().get( 0 );
	    isOffsetRelative = /relative|absolute/.test( that.containerElement.css( "position" ) );

	    if ( isParent && isOffsetRelative ) {
		woset -= Math.abs( that.parentData.left );
	    }

	    if ( woset + that.size.width >= that.parentData.width ) {
		that.size.width = that.parentData.width - woset;
		if ( pRatio ) {
		    that.size.height = that.size.width / that.aspectRatio;
		    continueResize = false;
		}
	    }

	    if ( hoset + that.size.height >= that.parentData.height ) {
		that.size.height = that.parentData.height - hoset;
		if ( pRatio ) {
		    that.size.width = that.size.height * that.aspectRatio;
		    continueResize = false;
		}
	    }

	    if ( !continueResize ){
		that.position.left = ui.prevPosition.left;
		that.position.top = ui.prevPosition.top;
		that.size.width = ui.prevSize.width;
		that.size.height = ui.prevSize.height;
	    }
	},

	_containment_stop: function(){

	    // var that = $(this).data("oj-resizable"),
	    var that = this,

	    o = that.options,
	    co = that.containerOffset,
	    cop = that.containerPosition,
	    ce = that.containerElement,
	    helper = $( that.helper ),
	    ho = helper.offset(),
	    w = helper.outerWidth() - that.sizeDiff.width,
	    h = helper.outerHeight() - that.sizeDiff.height;

	    if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
		$( this ).css({
		    left: ho.left - cop.left - co.left,
		    width: w,
		    height: h
		});
	    }

	    if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
		$( this ).css({
		    left: ho.left - cop.left - co.left,
		    width: w,
		    height: h
		});
	    }
	},

	ui: function() {
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

}() );

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

// lory retrieved from https://raw.github.com/jquery/jquery-ui/1-10-stable/ui/jquery.ui.dialog.js on 09/03/2013, and then modified

//
// Note that one of the main differences between JET Dialog and the jQueryUI dialog
// is the reparenting approach:
//
//   - JET Dialog reparents to the body on OPEN
//   - jQueryUI dialog reparents to the appendTo() container on CREATE
//

// Notes:
//  - $.uiBackCompat has been deprecated
//

/*!
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 */


(function() {

    var /** @const */ _destroyTitlebar = true;
    var /** @const */ _placeHolderPrefix = "ojDialogPlaceHolder-";
    var /** @const */ _placeHolderFooterPrefix = "ojDialogPlaceHolderFooter-";
    var /** @const */ _placeHolderHeaderPrefix = "ojDialogPlaceHolderHeader-";
    var /** @const */ _wrapperPrefix = "ojDialogWrapper-";

    // var /** @const */ _padYDelta = 2;   // add a small amount of padding so that the scrollbar does not inadvertantly show up.
    var /** @const */ _padYDelta = 0;   // add a small amount of padding so that the scrollbar does not inadvertantly show up.

    var /** @const */ _resizeDelay = 30;   // delay between body refresh during resize
    // var /** @const */ _resizeDelay = 0;   // delay between body refresh during resize

    /**
    * @ojcomponent oj.ojDialog
    * @augments oj.baseComponent
    * @since 0.6
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
    * <h3 id="styling-section">
    *   Styling
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
    * </h3>
    * 
    * <table class="generic-table styling-table">
    *   <thead>
    *     <tr>
    *       <th>Class(es)</th>
    *       <th>Description</th>
    *     </tr>
    *   </thead>
    *   <tbody>
    *     <tr>
    *       <td>oj-dialog-header</td>
    *       <td><p>Optional. If oj-dialog-header is omitted, a header will automatically be created.
    *        <p>For automically created headers (when <code class="prettyprint"> oj-dialog-header </code>
    *        is not part of the user's markup), the title of the header is the dialog title, and a close button is created.
    *       </td>
    *     </tr>
    *     <tr>
    *       <td>oj-dialog-body</td>
    *       <td><p> Expected. Formats the body of the dialog.</td>
    *     </tr>
    *     <tr>
    *       <td>oj-dialog-footer</td>
    *       <td><p> Optional. Formats the footer of the dialog. Omit if the dialog has no footer. </td>
    *     </tr>
    *     <tr>
    *       <td>oj-dialog-footer-separator</td>
    *       <td><p>A separator between the dialog body and the dialog footer can be added by using a second style class ( <code class="prettyprint"> oj-dialog-footer-separator </code>) in the footer. So use:
    *           <ul>
    *             <li>oj-dialog-footer oj-dialog-footer-separator</li>
    *           </ul>
    *      to add a footer separator to the dialog. 
    *     <p>See the demo section for a live example of the footer separator. </td>
    *     </tr>
    *     <tr>
    *       <td>oj-progressbar-embedded</td>
    *       <td><p> Optional. Used to format a progress bar embedded in the dialog header.</td>
    *     </tr>
    *
    *   </tbody>
    * </table>
    *
    * <p> Note that the dialog component wraps additional divs around the user's content and also performs other DOM manipulations.
    * Thus, the user should be careful if they wish to engage in advanced coding approaches.
    * In general, it is better to target DOM elements by id or class name
    * (e.g., developers should not rely on relative positioning of dialog DOM elements).
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
    *<p>While open, the dialog widget ensures that tabbing cycles focus between elements within the dialog itself, not elements outside of it. Modal dialogs additionally prevent mouse users fro  clicking on elements outside of the dialog.</p>
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
    *  <li> <code class="prettyprint">width: 300px</code> </li>
    *  <li> <code class="prettyprint">min-width: 200px</code> </li>
    *</ul>
    *
    * In most cases, you will want to use the default <code class="prettyprint">height:auto</code>, since this will automatically adjust the height based on the content.
    *
    * <p> Dialog dimensions can be set using rootAttributes:
    *
    * <pre class="prettyprint">
    * <code>
    *  &lt;div id="wideDialog" title="Wide Dialog" style=""
    *       data-bind="ojComponent:{component: 'ojDialog', initialVisibility: 'show',
    *		  rootAttributes: { style: 'width: 400px; min-width: 100px; max-width 500px;'}}"&gt;
    *       &lt;div class="oj-dialog-body"&gt;
    *         &lt;p&gt; Dialog Text
    *       &lt;/div&gt;
    *  &lt;/div&gt;
    * </code></pre>
    *
    *
    * To dynamically change a dialog dimension (e.g., change a dimension after the dialog has been created), the 'widget' syntax is required:
    * <pre class="prettyprint">
    * <code>
    * $("#wideDialog").ojDialog('widget').css{'width', '400px'}
    * </code></pre>
    *
    * <h3 id="ally-section">
    *   Accessibility
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
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
    * This can be changed using the role option. WAI-ARIA recommends that role="dialog" be used if the dialog expects input (such as text input),
    * otherwise, use the role option to assign role="alertdialog".
    *
    * <h4> labeled-by </h4>
    *
    * For default headers, the dialog component takes care of labeled-by for you. User-defined headers require additional work on the user's part:
    *<ul>
    *  <li> <b> Default Headers </b> </li>
    *   For default headers, the labeled-by attribute will be generated automatically (and set to the id of the title).
    *  <li> <b> User-defined Headers </b> </li>
    *   For user-defined headers, the the labeled-by attribute should be defined in the user's markup. Please refer to the demos for examples.
    *</ul>
    *
    * <h3 id="reparenting-section">
    *   Reparenting
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
    * </h3>
    *
    *  <p id="reparenting-strategy">
    *     When dialogs are open, they will be reparented into a common container in the
    *     document body and reparented back when closed.  Within this container in the body,
    *     dialogs will always be top rooted but other types of popups used within an open
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
    *     based on our JET popup strategy.
    *  </p>
    *  <ol>
    *    <li>Events raised within the dialog will not bubble up to the dialog's original ancestors.  Instead, listeners for menu events should
    *        be applied to either the dialog's root element, or the document.</li>
    *    <li>Likewise, developers should not use CSS descendant selectors, or similar logic, that assumes that the dialog will remain a child
    *        of its original parent.</li>
    *    <li>Dialogs containing iframes are problematic.  The iframe elements "may" fire a HTTP GET request for its src attribute
    *        each time the iframe is reparented in the document.</li>
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
    * <h3 id="pseudos-section">
    *   Pseudo-selectors
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
    * </h3>
    *
    * <p>The <code class="prettyprint">:oj-dialog</code> pseudo-selector can be used in jQuery expressions to select JET Dialogs.  For example:
    *
    * <pre class="prettyprint">
    * <code>$( ":oj-dialog" ) // selects all JET Dialogs on the page
    * $myEventTarget.closest( ":oj-dialog" ) // selects the closest ancestor that is a JET Dialog
    * </code></pre>
    *
    *<h3>Additional Examples</h3>
    *
    * <p> The following defines a basic dialog, with a cancel and an ok button in the footer:
    *
    * <pre class="prettyprint">
    * <code>
    *
    * &lt;div id="dialog" class="ojDialog" title="ojDialog Title"&gt;
    *     &lt;div class="oj-dialog-body"&gt;
    *         &lt;p&gt;Dialog Text&lt;/p&gt;
    *     &lt;/div&gt;
    *     &lt;div class="oj-dialog-footer"&gt;
    *        &lt;button id="buttonCancel" data-bind="ojComponent:
    *              { component: 'ojButton', label: 'OK'}"&gt; &lt;/button&gt;
    *        &lt;button data-bind="ojComponent:
    *              { component: 'ojButton', label: 'Cancel'}"&gt; &lt;/button&gt;
    *     &lt;/div&gt;
    * &lt;/div&gt;
    *
    * </code></pre>
    *
    * Note that you will need to define your own event handlers for the ok and close buttons (see the demos for examples of this).
    *
    * <p> A dialog with user-defined header is shown next. Arbitrary header content can be defined using a user-defined header.
    *
    * <pre class="prettyprint">
    * <code>
    *
    * &lt;div id="dialog" class="ojDialog" title="ojDialog Title"&gt;
    *   &lt;div class="oj-dialog-header" aria-labelledby="dialog-title-id"&gt;
    *     &lt;span id="dialog-title-id" class="oj-dialog-title"&gt; User Defined Header&lt;/span&gt;
    *    &lt;/div&gt;
    *    &lt;div class="oj-dialog-body"&gt;
    *        &lt;p&gt;Dialog Text&lt;/p&gt;
    *        &lt;br&gt;
    *    &lt;/div&gt;
    *    &lt;div class="oj-dialog-footer"&gt;
    *       &lt;button data-bind="ojComponent:
    *           { component: 'ojButton', label: 'OK'}"&gt; &lt;/button&gt;
    *       &lt;button id="buttonCancel" class="" data-bind="ojComponent:
    *           { component: 'ojButton', label: 'Cancel'}"&gt; &lt;/button&gt;
    *    &lt;/div&gt;
    * &lt;/div&gt;
    *
    * </code></pre>
    *
    * <h3 id="jqui2jet-section">
    *   JET for jQuery UI developers
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
    * </h3>
    *
    * This section summarizes the major differences between the JQueryUI dialog and the JET dialog API.
    *
    * <h4> Options added to JET Dialog </h4>
    *
    * <p>
    * One additional option has been added to the JET dialog:
    *
    * <p>
    * <table class="keyboard-table">
    *   <thead>
    *     <tr>
    *       <th>JQueryUI Dialog Option</th>
    *       <th>JET Dialog Option </th>
    *     </tr>
    *   </thead>
    *   <tbody>
    *     <tr>
    *       <td></td>
    *       <td><code class="prettyprint">role</code></td>
    *     </tr>
    *   </tbody>
    * </table>
    *
    * The JET Dialog option allows the developer to set the WAI-ARIA role. The <td><code class="prettyprint">role </code></td> option is not part of the JQueryUI dialog.
    *
    * <h4> Options Renamed between JQueryUI Dialog and JET Dialog </h4>
    *
    * <p>
    * The following options have been renamed between the JQueryUI dialog and the JET dialog.
    *
    * <p>
    * <table class="keyboard-table">
    *   <thead>
    *     <tr>
    *       <th>JQueryUI Dialog Option</th>
    *       <th>JET Dialog Option </th>
    *     </tr>
    *   </thead>
    *   <tbody>
    *     <tr>
    *       <td><code class="prettyprint">autoOpen </code></td>
    *       <td><code class="prettyprint">initialVisibility</code></td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">closeOnEscape </code></td>
    *       <td><code class="prettyprint">cancelBehavior</code></td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">draggable</code></td>
    *       <td><code class="prettyprint">dragAffordance</code></td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">modal</code></td>
    *       <td><code class="prettyprint">modality</code></td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">resizable</code></td>
    *       <td><code class="prettyprint">resizeBehavior</code></td>
    *     </tr>
    *   </tbody>
    * </table>
    *
    * <p>Also note that the JQueryUI dialog defines these options as booleans, while the JET dialog defines these options as strings.
    * <h4> Options in JQueryUI Dialog but not In JET Dialog </h4>
    *
    * <p>
    * The following options are part of the JQueryUI dialog but are not options in JET Dialog:
    *
    * <p>
    * <table class="keyboard-table">
    *   <thead>
    *     <tr>
    *       <th>JQueryUI Dialog Option</th>
    *       <th>JET Dialog Approach </th>
    *     </tr>
    *   </thead>
    *   <tbody>
    *     <tr>
    *       <td><code class="prettyprint">appendTo</code></td>
    *       <td>Use the jquery <code class="prettyprint">appendTo()</code> instead</td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">button</code></td>
    *       <td>Buttons are added directly to HTML markup</td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">width</code>, <code class="prettyprint">height</code></td>
    *       <td>Use css variables <code class="prettyprint">width</code>, <code class="prettyprint">height</code></td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">minWidth</code>, <code class="prettyprint">maxWidth</code>, <code class="prettyprint">minHeight</code>, <code class="prettyprint">maxHeight</code></td>
    *       <td>Use css variables <code class="prettyprint">min-width</code>, <code class="prettyprint">max-width</code>, <code class="prettyprint">min-height</code>, <code class="prettyprint">max-height</code></td>
    *     </tr>
    *     <tr>
    *       <td><code class="prettyprint">show</code>, <code class="prettyprint">hide</code></td>
    *       <td>Use css classes instead, e.g., <code class="prettyprint">display: none</code> to hide an element</td>
    *     </tr>
    *   </tbody>
    * </table>
    *
    *
    * <h4> Event Names </h4>
    *
    * <p>Event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "dialog".
    * E.g. the JQUI <code class="prettyprint">dialogcreate</code> event is <code class="prettyprint">ojcreate</code> in JET, as shown in the doc for that event.
    *
    *
    * <!-- - - - - Above this point, the tags are for the class.
    *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
    *
    *
    * @desc Creates a JET Dialog.
    * @param {Object=} options a map of option-value pairs to set on the component
    * @example <caption>Initialize a (modal) dialog with no options specified:</caption>
    * $( ".selector" ).ojDialog();
    * @example <caption>Create a modeless dialog: </caption>
    * $("#dialog").ojDialog(modality: "modeless"});
    */

    oj.__registerWidget("oj.ojDialog", $['oj']['baseComponent'], {
	version: "1.0.0",
        widgetEventPrefix : "oj",
	options:
	{
	    /**
	     * Specifies the cancel behavior of the dialog. The following are valid values:
             *
             * <ul>
             * <li>
	     * <code class="prettyprint">"icon"</code> - (the default) (a) a close icon will automatically be created, and (b) the dialog will close when it has focus and user presses the escape (ESC) key.
             * </li>
             * <li>
	     * <code class="prettyprint">"none"</code> - no actions will be associated with the escape key.
             * </li>
             * <li>
	     * <code class="prettyprint">"escape"</code> -  the dialog will close when it has focus and user presses the escape (ESC) key. A close icon will not automatically be created.
             * </li>
             * </ul>
             *
             * Note that the cancelBehavior applies to both automatic and user-defined headers. So by default, a user-defined header will have a system generated close icon.
             * @expose
             * @memberof oj.ojDialog
             * @instance
             * @type {string}
             * @default <code class="prettyprint">"icon"</code>
             *
             * @example <caption>Initialize the dialog to disable the default <code class="prettyprint">cancelBehavior</code></caption>
             * $(".selector" ).ojDialog( {cancelBehavior: "none" } );
             *
             * @example <caption>Get or set the <code class="prettyprint">cancelBehavior</code> option, after initialization:</caption>
             * // getter
             * var cancelBehavior = $(".selector" ).ojDialog( "option", "cancelBehavior" );
             *
             * // setter
             * $(".selector" ).ojDialog( "option", "cancelBehavior", "none");
             */
	    cancelBehavior: "icon",
	    /**
	     * Specifies the drag affordance.
	     * If set to <code class="prettyprint">"title-bar"</code> (the default) the dialog will be draggable by the title bar.
	     * If <code class="prettyprint">"none"</code>, the dialog will not be draggable.
             *
             * @expose
             * @memberof oj.ojDialog
             * @instance
             * @type {string}
             * @default <code class="prettyprint">"title-bar"</code>
             *
             * @example <caption>Initialize the dialog to disable dragging <code class="prettyprint">dragAffordance</code></caption>
             * $(".selector" ).ojDialog( {dragAffordance: "none" } );
             *
             * @example <caption>Get or set the <code class="prettyprint">dragAffordance</code> option, after initialization:</caption>
             * // getter
             * var dragAffordance = $(".selector" ).ojDialog( "option", "dragAffordance" );
             *
             * // setter
             * $(".selector" ).ojDialog( "option", "dragAffordance", "none");
             */
	    dragAffordance: "title-bar",


	    /**
             * <p> Set the initial visibility of the dialog.
	     * If set to <code class="prettyprint">"show"</code>, the dialog will automatically open upon initialization.
	     * If <code class="prettyprint">"hide"</code>, the dialog will stay hidden until the <a href="#method-open"><code class="prettyprint">open()</code></a> method is called.
             *
             * @expose
             * @memberof oj.ojDialog
             * @instance
             * @type {string}
             * @default <code class="prettyprint">"hide"</code>
             *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">initialVisibility</code> option specified:</caption>
             * $(".selector" ).ojDialog( {initialVisibility: "show" } );
             *
             * @example <caption>Get or set the <code class="prettyprint">initialVisibility</code> option, after initialization:</caption>
             * // getter
             * var initialVisibility = $(".selector" ).ojDialog( "option", "initialVisibility" );
             *
             * // setter
             * $(".selector" ).ojDialog( "option", "initialVisibility", "show");
             */
	    // initialVisibility: "show",
	    initialVisibility: "hide",


	    /**
	     *
	     * The modality of the dialog. Valid values are:
             * <ul>
             * <li>
	     * <code class="prettyprint">"modal"</code> - (the default) The dialog is modal. Interactions with other page elements are disabled. Modal dialogs overlay other page elements.
             * </li>
             * <li>
	     * <code class="prettyprint">"modeless"</code> - defines a modeless dialog.
             * </li>
             * </ul>
             *
             * @expose
             * @memberof oj.ojDialog
             * @instance
             * @default <code class="prettyprint">"modal"</code>
             * @type {string}
             *
             * @example <caption>Initialize the dialog to a specific modality <code class="prettyprint">modality</code></caption>
             * $(".selector" ).ojDialog( {modality: "modal" } );
             *
             * @example <caption>Get or set the <code class="prettyprint">modality</code> option, after initialization:</caption>
             * // getter
             * var modality = $(".selector" ).ojDialog( "option", "modality" );
             *
             * // setter
             * $(".selector" ).ojDialog( "option", "modality", "modal");
             */
	    modality: "modal",

	    // todo: link to position utility?
	    // JQUi doc had { ..., of: button}} - what does this mean?

           /**
            * <p>Position object is defined by the jquery position API and is used to establish the location the
            * dialog will appear relative to another element.  The postion object contains the following properties:
            * "my", "at", "of", "colision", "using" and "within".</p>
            *
            * <p>The "my" and "at" properties defines aligment points relative to the dialog and other element.  The
            * "my" property represents the dialogs alignment where the "at" property represents the other element
            * that can be identified by "of" or defauts to the launcher when the dialog opens.  The values of these
            * properties describe a "horizontal vertical" location.</p>
            *
            * <p>Acceptable "horizontal" alignments values are: "right", "center", "left", "start", "end".  Note: Jet has
            * added "start" and "end" options to be more RTL friendly.  The Jet values of "start" and "end" normalize
            * to "right" or "left" depending on the direction of the document.</p>
            *
            * <p>Acceptable "vertical" alignment values are: "top", "center" and "bottom".</p>
            *
            * The following is a short summary of the most interesting positon properties:
            * <ul>
            *   <li><code class="prettyprint">my</code> - A "vertical horizontal" rule that defines the location of the dialog
            *       used for alignment.</li>
            *   <li><code class="prettyprint">at</code> - A "vertical horizontal" rule that defines the location of the
            *       other element for used alignment. The other element is defined by "of" or defaults to the open launcher
            *       argument if not specified.</li>
            * </ul>
            *
            * @expose
            * @memberof oj.ojDialog
            * @instance
            * @type {Object}
            * @default <code class="prettyprint">{my: "center", at: "center", collision: "fit"}</code>
            *
            * @example <caption>Initialize the dialog with <code class="prettyprint">position</code> option specified:</caption>
            * $( ".selector" ).ojDialog( { "position": {"my": "left top", "at": "right top"} } );
            *
            * @example <caption>Get or set the <code class="prettyprint">position</code> option, after initialization:</caption>
            * // getter
            * var position = $( ".selector" ).ojDialog( "option", "position" );
            *
            * // setter
            * $( ".selector" ).ojDialog( "option", "position", {"my": "start bottom", "at": "end+14 top" } );
            */
     	    position: {
                /**
                 *
                 * @expose
                 * @alias position.my
                 * @memberof! oj.ojDialog
                 * @instance
     		 * @type {string}
                 * @default <code class="prettyprint">"center"</code>
                 *
                 */
		my: "center",
                /**
                 *
                 * @expose
                 * @alias position.at
                 * @memberof! oj.ojDialog
                 * @instance
		 * @type {string}
                 * @default <code class="prettyprint">"center"</code>
                 *
                 */
		at: "center",
                /**
                 *
                 * @expose
                 * @alias position.of
                 * @memberof! oj.ojDialog
                 * @instance
		 * @type {Object}
                 * @default <code class="prettyprint">"window"</code>
                 *
                 */
		of: window,
                /**
                 *
                 * @expose
                 * @alias position.collision
                 * @memberof! oj.ojDialog
                 * @instance
		 * @type {string}
                 * @default <code class="prettyprint">"fit"</code>
                 *
                 */
		collision: "fit",
		// Ensure the titlebar is always visible
		using: function( pos ) {
		    var topOffset = $( this ).css( pos ).offset().top;
		    if ( topOffset < 0 ) {
			$( this ).css( "top", pos.top - topOffset );
		    }
		}
	    },

	    /**
	     *
	     * The resizeBehavior of the dialog. "resizable" (default) makes the dialog resizable.
             * "none" disables dialog resizability.
             *
             * @expose
             * @memberof oj.ojDialog
             * @instance
             * @type {string}
             * @default <code class="prettyprint">"resizable"</code>
             *
             * @example <caption>Initialize the dialog to a specific resizeBehavior <code class="prettyprint">resizeBehavior</code></caption>
             * $(".selector" ).ojDialog( {resizeBehavior: "none" } );
             *
             * @example <caption>Get or set the <code class="prettyprint">resizeBehavior</code> option, after initialization:</caption>
             * // getter
             * var resizeBehavior = $(".selector" ).ojDialog( "option", "resizeBehavior" );
             *
             * // setter
             * $(".selector" ).ojDialog( "option", "resizeBehavior", "none");
             */
	    resizeBehavior: "resizable",

	    /**
	     *
	     * The WAI-ARIA role of the dialog. By default, role="dialog" is added to the generated HTML markup that surrounds the dialog.
             * When used as an alert dialog, the user should set role to "alertdialog".
             *
             * @expose
             * @memberof oj.ojDialog
             * @instance
             * @type {string}
             * @default <code class="prettyprint">"dialog"</code>
             *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">role</code></caption> option specified:</caption>
             * $(".selector" ).ojDialog( {role: "alertdialog" } );
             *
             * @example <caption>Get or set the <code class="prettyprint">role</code> option, after initialization:</caption>
             * // getter
             * var role = $(".selector" ).ojDialog( "option", "role" );
             *
             * // setter
             * $(".selector" ).ojDialog( "option", "role", "alertdialog");
             */
	    role: "dialog",

	    /**
	     *
	     * Specify the title of the dialog. null is the default.
             *
             * @expose
             * @memberof oj.ojDialog
	     * @instance
             * @type {string|null}
             *
             * @example <caption>Initialize the dialog to a specific title <code class="prettyprint">title</code></caption>
             * $(".selector" ).ojDialog( {title: "Title of Dialog" } );
             *
             * @example <caption>Get or set the <code class="prettyprint">title</code> option, after initialization:</caption>
             * // getter
             * var title = $(".selector" ).ojDialog( "option", "title" );
             *
             * // setter
             * $(".selector" ).ojDialog( "option", "title", "Title of Dialog");
             */
	    title: null,

	    ///////////////////////////////////////////////////////
	    // events
	    ///////////////////////////////////////////////////////

            /**
             * Triggered when a dialog is about to close. If cancelled, the dialog will not close.
             *
	     * @expose
             * @event
             * @name beforeClose
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">beforeClose</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "beforeClose": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeclose</code> event:</caption>
             * $( ".selector" ).on( "ojbeforeclose", function( event, ui ) {} );
             */

	    beforeClose: null,

            /**
             * Triggered when the dialog is about to to open.
             *
	     * @expose
             * @event
             * @name beforeOpen
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">beforeOpen</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "beforeOpen": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeopen</code> event:</caption>
             * $( ".selector" ).on( "ojbeforeopen", function( event, ui ) {} );
             */

	    beforeOpen: null,


		// * @name close
            /**
             * Triggered when the dialog is closed.
             *
	     * @expose
             * @event
             * @name oj.ojDialog#close
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">close</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "close": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojclose</code> event:</caption>
             * $( ".selector" ).on( "ojclose", function( event, ui ) {} );
             */

	    close : null,

            /**
             * Triggered when the dialog gains focus.
             *
	     * @expose
             * @event
             * @name focus
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">focus</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "focus": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojfocus</code> event:</caption>
             * $( ".selector" ).on( "ojfocus", function( event, ui ) {} );
             */

	    focus: null,
            /**
             * Triggered when the dialog is opened.
             *
	     * @expose
             * @event oj.ojDialog#open
             * @name open
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">open</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "open": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojopen</code> event:</caption>
             * $( ".selector" ).on( "ojopen", function( event, ui ) {} );
             */
	    open: null,

            /**
             * Triggered when the dialog is being resized.
             *
	     * @expose
             * @event
             * @name resize
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
	     * <ul>
	     * <li>
	     * <div><strong>event</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Event">Event</a>
	     * </div>
	     * <div></div>
	     * </li>
	     * <li>
	     * <div><strong>ui</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div></div>
	     * <ul>
	     * <li>
	     * <div><strong>originalPosition</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The CSS position of the dialog prior to being resized.</div>
	     * </li>
	     * <li>
	     * <div><strong>position</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The current CSS position of the dialog.</div>
	     * </li>
	     * <li>
	     * <div><strong>originalSize</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The size of the dialog prior to being resized.</div>
	     * </li>
	     * <li>
	     * <div><strong>size</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The current size of the dialog.</div>
	     * </li>
	     * </ul>
	     * </li>
	     * </ul>
	     *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">resize</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "resize": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojresize</code> event:</caption>
             * $( ".selector" ).on( "ojresize", function( event, ui ) {} );
             */
	    resize: null,

            /**
             * Triggered when the user starts resizing the dialog.
             *
	     * @expose
             * @event
             * @name resizeStart
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
	     * <ul>
	     * <li>
	     * <div><strong>event</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Event">Event</a>
	     * </div>
	     * <div></div>
	     * </li>
	     * <li>
	     * <div><strong>ui</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div></div>
	     * <ul>
	     * <li>
	     * <div><strong>originalPosition</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The CSS position of the dialog prior to being resized.</div>
	     * </li>
	     * <li>
	     * <div><strong>position</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The current CSS position of the dialog.</div>
	     * </li>
	     * <li>
	     * <div><strong>originalSize</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The size of the dialog prior to being resized.</div>
	     * </li>
	     * <li>
	     * <div><strong>size</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The current size of the dialog.</div>
	     * </li>
	     * </ul>
	     * </li>
	     * </ul>
	     *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">resizeStart</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "resizeStart": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojresizestart</code> event:</caption>
             * $( ".selector" ).on( "ojresizestart", function( event, ui ) {} );
             */
	    resizeStart: null,

            /**
             * Triggered when the user stops resizing the dialog.
             *
	     * @expose
             * @event
             * @name resizeStop
             * @memberof oj.ojDialog
             * @instance
             * @property {Event} event <code class="prettyprint">jQuery</code> event object
             * @property {Object} ui Currently empty
             *
	     * <ul>
	     * <li>
	     * <div><strong>event</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Event">Event</a>
	     * </div>
	     * <div></div>
	     * </li>
	     * <li>
	     * <div><strong>ui</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div></div>
	     * <ul>
	     * <li>
	     * <div><strong>originalPosition</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The CSS position of the dialog prior to being resized.</div>
	     * </li>
	     * <li>
	     * <div><strong>position</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The current CSS position of the dialog.</div>
	     * </li>
	     * <li>
	     * <div><strong>originalSize</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The size of the dialog prior to being resized.</div>
	     * </li>
	     * <li>
	     * <div><strong>size</strong></div>
	     * <div>Type: <a href="http://api.jquery.com/Types/#Object">Object</a>
	     * </div>
	     * <div>The current size of the dialog.</div>
	     * </li>
	     * </ul>
	     * </li>
	     * </ul>
	     *
             * @example <caption>Initialize the dialog with the <code class="prettyprint">resizeStop</code> callback specified:</caption>
             * $( ".selector" ).ojDialog({
             *     "resizeStop": function( event, ui ) {}
             * });
             *
             * @example <caption>Bind an event listener to the <code class="prettyprint">ojresizestop</code> event:</caption>
             * $( ".selector" ).on( "ojresizestop", function( event, ui ) {} );
             */
	    resizeStop: null
	},


        /**
         * Triggered when the dialog is created.
         *
         * @expose
         * @override
         * @event
         * @name create
         * @memberof oj.ojDialog
         * @instance
         * @property {Event} event <code class="prettyprint">jQuery</code> event object
         * @property {Object} ui Currently empty
         *
         * @example <caption>Initialize the dialog with the <code class="prettyprint">create</code> callback specified:</caption>
         * $( ".selector" ).ojDialog({
         *     "create": function( event, ui ) {}
         * });
         *
         * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
         * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
         */

	_ComponentCreate : function ()
	{
            this._super();
	    // _create: function() {
	    this.originalCss = {
		display: this.element[0].style.display,
		width: this.element[0].style.width,
		height: this.element[0].style.height
	    };
	    this.originalPosition = {
		parent: this.element.parent(),
		index: this.element.parent().children().index( this.element )
	    };
	    this.originalTitle = this.element.attr("title");
	    this.options.title = this.options.title || this.originalTitle;

	    this._createWrapper();

	    this.element
		.show()
		.removeAttr("title")
		// .addClass("oj-dialog-content oj-component-content")
		.addClass("oj-dialog-content oj-dialog-default-content")
		.appendTo( this.uiDialog );  // @HTMLUpdateOK

	    this.userDefinedDialogHeader = false;

	    //
	    // If there is not nested content,
	    // simply find the first oj-dialog-header
	    //
	    var nestedContent = this.element.find(".oj-dialog");

	    if (!nestedContent.length) {

		this._userDefinedHeader = this.element.find(".oj-dialog-header");
		if (this._userDefinedHeader.length) {
		    this.userDefinedDialogHeader = true;
		}
	    }
	    else {

		//
		// For nested content,
		// look for a header that is NOT contained with an oj-dialog-body
		//

		var allDialogHeaders = this.element.find('.oj-dialog-header');

		var that = this;

		//this.element('.oj-dialog-header').each(function(index, li) {
		allDialogHeaders.each(function(index, li) {

		    var dialogHeader = $(li);
		    var isNestedDialog = dialogHeader.closest('.oj-dialog-body');

		    //
		    // If the header is not nested within an .oj-dialog-body,
		    // then it IS a user-defined header.
		    //
		    if (!isNestedDialog.length) {
			// this._userDefinedHeader = dialogHeader;
			that._userDefinedHeader = dialogHeader;
			// this.userDefinedDialogHeader = true;
			that.userDefinedDialogHeader = true;
			return false;
		    }

		});

	    }

	    if (this.userDefinedDialogHeader) {

		this._createPlaceHolderHeader(this._userDefinedHeader);
		this._userDefinedHeader.prependTo(this.uiDialog);   // @HTMLUpdateOK

		if (this.options.cancelBehavior === "icon") {

		    this._createCloseButton(this._userDefinedHeader);

		    //
		    // Insert oj-dialog-title between oj-dialog-header and oj-dialog-header-close-wrapper
		    //
		    this._userDefinedTitle = this._userDefinedHeader.find(".oj-dialog-title");
		    if (this._userDefinedTitle.length)
		    	this._userDefinedTitle.insertAfter(this.uiDialogTitlebarCloseWrapper); // @HTMLUpdateOK

		}

	    }
	    else {
		this._createTitlebar();
	    }

	    this.uiDialogFooter = this.element.children(".oj-dialog-footer");
	    this._createPlaceHolderFooter(this.uiDialogFooter);

	    if (this.uiDialogFooter.length) {
		this.uiDialogFooter.addClass("oj-helper-clearfix")
		this.uiDialogFooter.appendTo(this.uiDialog);   // @HTMLUpdateOK
	    }

	    if ( this.options.dragAffordance === "title-bar" && $.fn.draggable ) {
		this._makeDraggable();
	    }

	    this._isOpen = false;
	},

	//
	// support for auto-open.
	//
	_AfterCreateEvent: function() {

	    if (this.options.initialVisibility === "show" ) {
		this.open();
	    }

	},

	/**
	 * Remove the dialog functionality completely.
	 * This will return the element back to its pre-init state.
	 *
	 * <p>This method does not accept any arguments.
	 *
	 * @method
	 * @name oj.ojDialog#destroy
	 * @memberof oj.ojDialog
	 * @instance
	 *
	 * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
	 * var destroy = $( ".selector" ).ojDialog( "destroy" );
	 */
	_destroy: function() {

	    // Remove the resize delay.
	    if (this._delayId)
		window.clearTimeout(this._delayId);

            if (this.isOpen())

                this._closeImplicitly();

	    var isDraggable = this.uiDialog.hasClass("oj-draggable");

	    if (this._resizableComponent) {
		if (this._resizableComponent("instance"))
		    this._resizableComponent("destroy");
		this._resizableComponent = null;
	    }

	    if (this.uiDialogFooter.length) {
		this.uiDialogFooter.removeClass("oj-helper-clearfix")
		$('#' + this._placeHolderFooterId).replaceWith(this.uiDialogFooter); // @HTMLUpdateOK
	    }

	    this._destroyCloseButton();

	    if (this.userDefinedDialogHeader) {

		var header = this.uiDialog.find(".oj-dialog-header");
		if (header)
		    $('#' + this._placeHolderHeaderId).replaceWith(header); // @HTMLUpdateOK
	    }

	    if (this.uiDialogTitle) {
		this.uiDialogTitle.remove();
		this.uiDialogTitle = null;
	    }

	    this.element
		.removeUniqueId()
		.removeClass( "oj-dialog-content oj-dialog-default-content" )
		.css( this.originalCss );

	    if (this.uiDialog)
		this.uiDialog.stop( true, true );

	    this.element.unwrap();

	    if ( this.originalTitle ) {
		this.element.attr( "title", this.originalTitle );
	    }

	    // causes testing problems.
	    if (_destroyTitlebar) {
		if (this.uiDialogTitlebar) {
		    this.uiDialogTitlebar.remove();
		    this.uiDialogTitlebar = null;
		}
	    }

            delete this._popupServiceEvents;
            delete this._isOpen;
            this._super();
	},

	/**
	 * Returns a <code class="prettyprint">jQuery</code> object containing the generated wrapper.
	 *
	 * <p>This method does not accept any arguments.
	 *
	 * @expose
	 * @name oj.ojDialog#widget
	 * @memberof oj.ojDialog
	 * @instance
	 * @return {jQuery} the dialog
	 *
	 * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
	 * var widget = $( ".selector" ).ojDialog( "widget" );
	 */
	widget: function() {
	    return this.uiDialog;
	},

	disable: $.noop,
	enable: $.noop,

	/**
	 * Closes the dialog.
	 *
         * @name oj.ojDialog#close
	 * @method
	 * @memberof oj.ojDialog
	 * @instance
         * @property {Event} event <code class="prettyprint">jQuery</code> event object
         * @return {void}
         * @fires oj.ojDialog#beforeClose
         * @fires oj.ojDialog#close
	 *
	 * @example <caption>Invoke the <code class="prettyprint">close</code> method:</caption>
	 * var close = $( ".selector" ).ojDialog( "close" );
	 */
	close: function( event ) {
            if (!this.isOpen())
              return;

	    if (this._trigger( "beforeClose", event ) === false && !this._ignoreBeforeCloseResultant) {
		return;
	    }

	    this._isOpen = false;
	    this._focusedElement = null;

	    if ( !this.opener.filter(":focusable").focus().length ) {
		// Hiding a focused element doesn't trigger blur in WebKit
		// so in case we have nothing to focus on, explicitly blur the active element
		// https://bugs.webkit.org/show_bug.cgi?id=47182
		$( this.document[0].activeElement ).blur();
	    }

            /** @type {!Object.<oj.PopupService.OPTION, ?>} */
            var psOptions = {};
            psOptions[oj.PopupService.OPTION.POPUP] = this.uiDialog;
            oj.PopupService.getInstance().close(psOptions);

            this._trigger( "close", event);

	},

	/**
	 * Returns true if the dialog is currently open.
	 *
	 * <p>This method does not accept any arguments.
	 *
	 * @method
	 * @name oj.ojDialog#isOpen
	 * @memberof oj.ojDialog
	 * @instance
         * @property {Event} event <code class="prettyprint">jQuery</code> event object
	 *
	 * @example <caption>Invoke the <code class="prettyprint">isOpen</code> method:</caption>
	 * var isOpen = $( ".selector" ).ojDialog( "isOpen" );
	 */
	isOpen: function() {
	    return this._isOpen;
	},

	/**
	 * Opens the dialog.
	 *
	 * @method
	 * @name oj.ojDialog#open
	 * @memberof oj.ojDialog
	 * @instance
         * @return {void}
         * @fires oj.ojDialog#beforeOpen
         * @fires oj.ojDialog#open
	 *
	 * @example <caption>Invoke the <code class="prettyprint">open</code> method:</caption>
	 * var open = $( ".selector" ).ojDialog( "open" );
	 */
	open: function( event ) {

            // this.$element.on('click.ojDialog', $.proxy(this.uiDialog.hide, this));

	    if (this._trigger( "beforeOpen", event ) === false ) {
		return;
	    }

	    if ( this.isOpen() ) {
		    this._focusTabbable();
		return;
	    }

	    this._isOpen = true;
	    this.opener = $( this.document[0].activeElement );

	    if (this.options.resizeBehavior === "resizable") {
	        this._makeResizable();
	    }

            // normalize alignments, so that start and end keywords work as expected.
	    var isRtl = this._GetReadingDirection() === "rtl";
            var position = oj.PositionUtils.normalizeHorizontalAlignment(this.options.position, isRtl)

            /** @type {!Object.<oj.PopupService.OPTION, ?>} */
            var psOptions = {};
            psOptions[oj.PopupService.OPTION.POPUP] = this.uiDialog;
            psOptions[oj.PopupService.OPTION.LAUNCHER] = this.opener;
            psOptions[oj.PopupService.OPTION.POSITION] = position;
            psOptions[oj.PopupService.OPTION.MODALITY] = this.options.modality;
            psOptions[oj.PopupService.OPTION.EVENTS] = this._getPopupServiceEvents();
            psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = "oj-dialog-layer";
            psOptions[oj.PopupService.OPTION.LAYER_LEVEL] = oj.PopupService.LAYER_LEVEL.TOP_LEVEL;
            oj.PopupService.getInstance().open(psOptions);

	    this._trigger("open");
            this._focusTabbable();
	},

	/**
	 * Refresh the dialog.
	 * Typically used after dynamic content is added to a dialog.
	 *
	 * @method
	 * @name oj.ojDialog#refresh
	 * @memberof oj.ojDialog
	 * @instance
         * @return {void}
	 *
	 * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
	 * var open = $( ".selector" ).ojDialog( "refresh" );
	 */
	refresh: function()
	{
	    this._super();
	},

	_focusTabbable: function() {

	    var hasFocus = this._focusedElement;
            if (hasFocus && hasFocus.length > 0)
            {
              // if dialog already has focus then return
              if (oj.DomUtils.isAncestorOrSelf(this.uiDialog[0], hasFocus[0]))
                return;
            }

            // Set focus to the first match:
	    // 1. First element inside the dialog matching [autofocus]
	    // 2. Tabbable element inside the content element
	    // 3. Tabbable element inside the footer
	    // 4. The close button
	    // 5. The dialog itself

	    // var hasFocus = this.element.find("[autofocus]");
	    // var hasFocus = this._focusedElement;

	    if ( !hasFocus ) {
	       hasFocus = this.element.find( "[autofocus]" );
	    }

	    if ( !hasFocus.length ) {
		hasFocus = this.element.find(":tabbable");
	    }
	    if ( !hasFocus.length ) {
		if (this.uiDialogFooter.length)
		    // hasFocus = this.uiDialogFooter.filter(":tabbable");
		    hasFocus = this.uiDialogFooter.find(":tabbable");
	    }
	    if ( !hasFocus.length ) {
		// todo: this may not exist when a user-defined header is used.
		// We may want to provide an api for the focusable element, or
		// check the oj-dialog-header markup
		if (this.uiDialogTitlebarClose)
		    hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
	    }
	    if ( !hasFocus.length ) {
		hasFocus = this.uiDialog;
	    }
	    hasFocus.eq( 0 ).focus();
        this._trigger("focus");
	},

	'_keepFocus': function( event ) {
	    function checkFocus() {
		var activeElement = this.document[0].activeElement,
		isActive = this.uiDialog[0] === activeElement ||
		    $.contains( this.uiDialog[0], activeElement );
		if ( !isActive ) {
		    this._focusTabbable();
		}
	    }
	    event.preventDefault();
	    checkFocus.call( this );
	},

	_isNumber: function( value ) {
	    return !isNaN( parseInt( value , 10 ) );
	},

	_createWrapper: function() {

	    this._isResizing = false;

	    // make sure that the element has a unique id.
	    this.element.uniqueId();
	    this._elementId = this.element.attr('id');
	    this._wrapperId = _wrapperPrefix + this._elementId;

	    this.uiDialog = $("<div>");
	    this.uiDialog.addClass( "oj-dialog oj-component")
		.hide()
		.attr({
		    // Setting tabIndex makes the div focusable
		    'tabIndex': -1,
		    'role': this.options.role,
		    'id' : this._wrapperId
		});

	    this.uiDialog.insertBefore(this.element);   // @HTMLUpdateOK

	    this._on( this.uiDialog, {
		keyup: function( event ) {

		},

		keydown: function( event ) {

		    if (this.options.cancelBehavior != "none" && !event.isDefaultPrevented() && event.keyCode &&
			event.keyCode === $.ui.keyCode.ESCAPE ) {
			event.preventDefault();
			event.stopImmediatePropagation();
			this.close( event );
			return;
		    }

		    if ( event.keyCode !== $.ui.keyCode.TAB ) {
			return;
		    }

                    // for modeless dialogs, we don't prevent tabbing out of the dialog.
                    if (this.options.modality === "modeless") return;

		    // prevent tabbing out of dialogs
		    var tabbables = this.uiDialog.find(":tabbable"),

		    first = tabbables.filter(":first"),
		    last  = tabbables.filter(":last");

		    var index;

		    if (!event.shiftKey) {

			if (event.target === last[0] || event.target === this.uiDialog[0]) {
			    first.focus();
			    event.preventDefault();
			}
			else {

			    //
			    // Make sure the first dialog tabbable (the header icon)
			    // does not tab out of the dialog.
			    //
			    index = tabbables.index(document.activeElement);

			    if (index == 0) {
				if (tabbables[1]) {
				    tabbables[1].focus();
				    event.preventDefault();
				}
			    }
			}

		    } else if (event.shiftKey) {

			//
			// For SHIFT-TAB, we reverse the tab order.
			//

			if (event.target === first[0] || event.target === this.uiDialog[0]) {
			    last.focus();
			    event.preventDefault();
			}
			else {

			    //
			    // Make sure the second dialog tabbable tabs back to the header
			    //
			    index = tabbables.index(document.activeElement);

			    if (index == 1) {
				if (tabbables[0]) {
				    tabbables[0].focus();
				    event.preventDefault();
				}
			    }
			}
		    }



		    }
	    });

	    // We assume that any existing aria-describedby attribute means
	    // that the dialog content is marked up properly
	    // otherwise we brute force the content as the description
	    if ( !this.element.find("[aria-describedby]").length ) {
		this.uiDialog.attr({
		    "aria-describedby": this.element.uniqueId().attr("id")
		});
	    }

	},


	_destroyCloseButton: function() {

	    if (this.uiDialogTitlebarCloseWrapper) {
		this.uiDialogTitlebarCloseWrapper.remove();
		this.uiDialogTitlebarCloseWrapper = null;
		this.uiDialogTitlebarClose = null;
	    }
	},


	//
	// Create a close button.
	//
	_createCloseButton: function(domDestination) {

	    this.uiDialogTitlebarCloseWrapper = $("<div>")
		.addClass("oj-dialog-header-close-wrapper")
		.attr("tabindex", "1")
		.attr("aria-label", "close")
		.attr("role", "button")
		.appendTo(domDestination);  // @HTMLUpdateOK

	    this.uiDialogTitlebarClose = $("<span>")
		.addClass("oj-component-icon oj-clickable-icon oj-dialog-close-icon")
		.attr("alt", "close icon" )
		.prependTo( this.uiDialogTitlebarCloseWrapper);   // @HTMLUpdateOK

	    this._on( this.uiDialogTitlebarCloseWrapper, {
		click: function( event ) {
		    event.preventDefault();
		    event.stopImmediatePropagation();
		    this.close( event );
		},
		mousedown: function( event ) {
		    var currTarget = event.currentTarget;
		    $(currTarget).addClass("oj-active");
		},
		mouseup: function( event ) {
		    var currTarget = event.currentTarget;
		    $(currTarget).removeClass("oj-active");
		},
		mouseenter: function( event ) {
		    var currTarget = event.currentTarget;
		    $(currTarget).addClass("oj-hover");
		},
		mouseleave: function( event ) {
		    var currTarget = event.currentTarget;
		    $(currTarget).removeClass("oj-hover");
		    $(currTarget).removeClass("oj-active");
		},

		//
		// Close dialog when close icon has focus and SPACE is entered.
		//
		keyup: function( event ) {

                    if (event.keyCode && event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER) {
			event.preventDefault();
			event.stopImmediatePropagation();
			this.close( event );
			return;
		    }
		}

	    });

	},

	_createTitlebar: function() {
	    var uiDialogTitle;
	    var headerClasses;

	    headerClasses = "oj-dialog-header oj-helper-clearfix";

	    this.uiDialogTitlebar = $("<div>")
		.addClass(headerClasses)
		.prependTo( this.uiDialog );   // @HTMLUpdateOK

	    this._on( this.uiDialogTitlebar, {
		mousedown: function( event ) {
		    // Don't prevent click on close button (#8838)
		    // Focusing a dialog that is partially scrolled out of view
		    // causes the browser to scroll it into view, preventing the click event
		    // if ( !$( event.target ).closest(".oj-fwk-icon-close") ) {
		    if ( !$( event.target ).closest(".oj-dialog-close-icon") ) {
			// Dialog isn't getting focus when dragging (#8063)
			this.uiDialog.focus();
		    }
		}
	    });


	    if (this.options.cancelBehavior === "icon")
		this._createCloseButton(this.uiDialogTitlebar);


	    uiDialogTitle = $("<span>")
		.uniqueId()
		.addClass("oj-dialog-title")
		// .prependTo( this.uiDialogTitlebar );
		.appendTo( this.uiDialogTitlebar );  // @HTMLUpdateOK
	    this._title( uiDialogTitle );

	    this.uiDialog.attr({
		"aria-labelledby": uiDialogTitle.attr("id")
	    });
	},

	_title: function( title ) {
	    if ( !this.options.title ) {
		title.html("&#160;");   // @HTMLUpdateOK
	    }
	    title.text( this.options.title );
	},


	_makeDraggable: function() {
	    var that = this,
	    options = this.options;

	    function filteredUi( ui ) {
		return {
		    position: ui.position,
		    offset: ui.offset
		};
	    }

	    this.uiDialog.draggable({
		// cancel: ".oj-dialog-content, .oj-dialog-titlebar-close",
		// handle: ".oj-dialog-titlebar",
		addClasses: false,
		cancel: ".oj-dialog-content, .oj-dialog-header-close",
		handle: ".oj-dialog-header",
		containment: "document",
		start: function( event, ui ) {
		    $( this ).addClass("oj-dialog-dragging");
		    that._blockFrames();
		    that._trigger( "dragStart", event, filteredUi( ui ) );
		},
		'drag': function( event, ui ) {
		    that._trigger( "drag", event, filteredUi( ui ) );
		},
		stop: function( event, ui ) {
		    options.position = [
			ui.position.left - that.document.scrollLeft(),
			ui.position.top - that.document.scrollTop()
		    ];
		    $( this ).removeClass("oj-dialog-dragging");
		    that._unblockFrames();
		    that._trigger( "dragStop", event, filteredUi( ui ) );
		}
	    });

	    this.uiDialog.addClass("oj-draggable")

	},

	_makeResizable: function() {

	    var that = this,

	    options = this.options,

	    // handles = options.resizable,
	    position = this.uiDialog.css("position"),
	    // resizeHandles = typeof handles === "string" ? handles : "n,e,s,w,se,sw,ne,nw";

	    resizeHandles = "n,e,s,w,se,sw,ne,nw";

	    function filteredUi( ui ) {
		return {
		    'originalPosition': ui.originalPosition,
		    'originalSize': ui.originalSize,
		    position: ui.position,
		    size: ui.size
		};
	    }

	    this._resizableComponent = this.uiDialog['ojResizable'].bind(this.uiDialog);

	    // this.uiDialog.['ojResizable']({
	    // this.uiDialog.resizable({

	    this._resizableComponent({
		cancel: ".oj-dialog-content",
		containment: "document",

		handles: resizeHandles,
		start: function( event, ui ) {

		    that._isResizing = true;

		    $( this ).addClass("oj-dialog-resizing");
		    that._blockFrames();
		    // fire resizestart
		    that._trigger( "resizeStart", event, filteredUi( ui ) );

		},
		resize: function( event, ui ) {
		    that._trigger( "resize", event, filteredUi( ui ) );
		},
		stop: function( event, ui ) {

		    that._isResizing = false;

		    $( this ).removeClass("oj-dialog-resizing");
		    that._unblockFrames();
		    that._trigger( "resizeStop", event, filteredUi( ui ) );

		}
	    });

	},

	_position: function() {

	    //
	    // Extended position objects with better names to support RTL.
	    //
	    var isRtl = this._GetReadingDirection() === "rtl";
            var position = oj.PositionUtils.normalizeHorizontalAlignment(this.options.position, isRtl)
            this.uiDialog.position(position);

      this._positionDescendents();
  },

  _positionDescendents: function() {

    // trigger refresh of descendents
    oj.PopupService.getInstance().triggerOnDescendents(this.uiDialog, oj.PopupService.EVENT.POPUP_REFRESH);
  },

	_setOption: function( key, value, flags ) {
	    /*jshint maxcomplexity:15*/
	    var isDraggable, isResizable,
	    uiDialog = this.uiDialog;

	    // don't allow a dialog to be disabled.
	    if ( key === "disabled" ) {
		return;
	    }

	    this._super( key, value, flags );

            switch (key)
            {
	    case "dragAffordance":

		// isDraggable = uiDialog.is(":data(oj-draggable)");
		isDraggable = uiDialog.hasClass("oj-draggable");

		if ( isDraggable && value === "none") {
		    uiDialog.draggable("destroy");
		    this.uiDialog.removeClass("oj-draggable");
		}

		if ( !isDraggable && value === "title-bar" ) {
		    this._makeDraggable();
		}

		break;

	    case "position":
		this._position();
		break;

	    case "resizeBehavior":

		isResizable = false;
		if (this._resizableComponent) isResizable = true;

		// currently resizable, becoming non-resizable
		if ( isResizable && value != "resizable" ) {
		    // uiDialog._resizableComponent("destroy");
		    if (this._resizableComponent("instance"))
		        this._resizableComponent("destroy");
		    this._resizableComponent = null;
		}

		// currently non-resizable, becoming resizable
		if ( !isResizable && value === "resizable" ) {
		    this._makeResizable();
		}

		break;

	    case "title":
		this._title( this.uiDialogTitlebar.find(".oj-dialog-title") );
		break;

	    case "role":
		uiDialog.attr("role", value);
		break;

	    case "modality":
		if (this.isOpen())
		{
		  /** @type {!Object.<oj.PopupService.OPTION, ?>} */
		  var psOptions = {};
		  psOptions[oj.PopupService.OPTION.POPUP] = this.uiDialog;
		  psOptions[oj.PopupService.OPTION.MODALITY] = value;
		  oj.PopupService.getInstance().changeOptions(psOptions);
		}
		break;

	    case "cancelBehavior":

		if (value === "none" || value === "escape") {

		    // we may need additional code here
		    // if (this.userDefinedDialogHeader) {   }

		    this._destroyCloseButton();

		}
		else if (value === "icon") {

		    if (this.userDefinedDialogHeader) {

			this._destroyCloseButton();
			this._createCloseButton(this._userDefinedHeader);

			//
			// Insert oj-dialog-title between oj-dialog-header and oj-dialog-header-close-wrapper
			//
			this._userDefinedTitle = this._userDefinedHeader.find(".oj-dialog-title");
			if (this._userDefinedTitle.length)
		    	    this._userDefinedTitle.insertAfter(this.uiDialogTitlebarCloseWrapper);  // @HTMLUpdateOK

		    } else  {
			this._destroyCloseButton();
			this._createCloseButton(this.uiDialogTitlebar);

			this.standardTitle = this.uiDialogTitlebar.find(".oj-dialog-title");
			if (this.standardTitle.length)
		    	    this.standardTitle.insertAfter(this.uiDialogTitlebarCloseWrapper);  // @HTMLUpdateOK

		    }

		}

		break;

	    }
	},

	_blockFrames: function() {
	    this.iframeBlocks = this.document.find( "iframe" ).map(function() {
		var iframe = $( this );

		var offset = /** @type {{left: number, top: number}}  */ (iframe.offset());

		return $( "<div>" )
		    .css({
			width: iframe.outerWidth(),
			height: iframe.outerHeight()
		    })
		    .appendTo( iframe.parent() )  // @HTMLUpdateOK
		    .offset( offset )[0];
	    });
	},

	_unblockFrames: function() {
	    if ( this.iframeBlocks ) {
		this.iframeBlocks.remove();
		delete this.iframeBlocks;
	    }
	},

	_createPlaceHolderFooter: function(domElement) {

	    this._placeHolderFooterId = _placeHolderFooterPrefix + this._elementId;

	    this._placeHolderFooter = $("<div>")
		.hide()
		.attr({'id' : this._placeHolderFooterId});

	    this._placeHolderFooter.insertBefore(domElement);  // @HTMLUpdateOK

	},

	_createPlaceHolderHeader: function(domElement) {

	    this._placeHolderHeaderId = _placeHolderHeaderPrefix + this._elementId;

	    this._placeHolderHeader = $("<div>")
		.hide()
		.attr({'id' : this._placeHolderHeaderId});

	    this._placeHolderHeader.insertBefore(domElement);  // @HTMLUpdateOK

	},

	getNodeBySubId: function(locator)
	{
	    if (locator == null)
	    {
		return this.element ? this.element[0] : null;
	    }

	    var subId = locator['subId'];

	    switch (subId) {

	    case "oj-dialog-header":
                // "oj-dialog-body" is deprecated as of 1.2
	    case "oj-dialog-body":
	    case "oj-dialog-footer":
	    case "oj-dialog-content":
	    case "oj-dialog-header-close-wrapper":
	    case "oj-resizable-n":
	    case "oj-resizable-e":
	    case "oj-resizable-s":
	    case "oj-resizable-w":
	    case "oj-resizable-se":
	    case "oj-resizable-sw":
	    case "oj-resizable-ne":
	    case "oj-resizable-nw":

		var dotSubId = "." + subId;
                if (!this.widget().find(dotSubId)) return null;
		return (this.widget().find(dotSubId)[0]);
		break;
                
                // "oj-dialog-close-icon" is deprecated as of 1.2
                // use "oj-dialog-close" instead.
	    case "oj-dialog-close-icon":
	    case "oj-dialog-close":

                if (!this.widget().find(".oj-dialog-close-icon")) return null;
		return (this.widget().find(".oj-dialog-close-icon")[0]);
                break;
	    }

	    // Non-null locators have to be handled by the component subclasses
	    return null;
	},

        //** @inheritdoc */
        getSubIdByNode: function(node)
        {

            if (node != null) {

                var nodeCached = $(node);

                if (nodeCached.hasClass('oj-dialog-header'))
                    return {'subId': 'oj-dialog-header'};
	        else if (nodeCached.hasClass('oj-dialog-footer'))
                    return {'subId': 'oj-dialog-footer'};
	        else if (nodeCached.hasClass('oj-dialog-content'))
                    return {'subId': 'oj-dialog-content'};
	        else if (nodeCached.hasClass('oj-dialog-header-close-wrapper'))
                    return {'subId': 'oj-dialog-header-close-wrapper'};
                //
                // This is the only asymmetrical match - the node with the class
                // oj-dialog-close-icon returns the subId oj-dialog-close
                //
	        else if (nodeCached.hasClass('oj-dialog-close-icon'))
                    return {'subId': 'oj-dialog-close'};
	        else if (nodeCached.hasClass('oj-resizable-n'))
                    return {'subId': 'oj-resizable-n'};
	        else if (nodeCached.hasClass('oj-resizable-e'))
                    return {'subId': 'oj-resizable-e'};
	        else if (nodeCached.hasClass('oj-resizable-s'))
                    return {'subId': 'oj-resizable-s'};
	        else if (nodeCached.hasClass('oj-resizable-w'))
                    return {'subId': 'oj-resizable-w'};
	        else if (nodeCached.hasClass('oj-resizable-se'))
                    return {'subId': 'oj-resizable-se'};
	        else if (nodeCached.hasClass('oj-resizable-sw'))
                    return {'subId': 'oj-resizable-sw'};
	        else if (nodeCached.hasClass('oj-resizable-ne'))
                    return {'subId': 'oj-resizable-ne'};
	        else if (nodeCached.hasClass('oj-resizable-nw'))
                    return {'subId': 'oj-resizable-nw'};

            }

            return null;
        },


      /**
       * @memberof! oj.ojDialog
       * @instance
       * @private
       * @return {void}
       */
       _surrogateRemoveHandler: function()
       {
         var element = this.element;
         element.remove();
       },
      /**
       * @memberof! oj.ojDialog
       * @instance
       * @private
       * @return {!Object.<oj.PopupService.EVENT, function(...)>}
       */
       _getPopupServiceEvents: function()
       {
         if (!this._popupServiceEvents)
         {
           /** @type {!Object.<oj.PopupService.EVENT, function(...)>} **/
           var events = this._popupServiceEvents = {};
           events[oj.PopupService.EVENT.POPUP_CLOSE] = $.proxy(this._closeImplicitly, this);
           events[oj.PopupService.EVENT.POPUP_REMOVE] = $.proxy(this._surrogateRemoveHandler, this);
           events[oj.PopupService.EVENT.POPUP_REFRESH] = $.proxy(this._positionDescendents, this);
          }
         return this._popupServiceEvents;
       },
      /**
       * @memberof! oj.ojDialog
       * @instance
       * @private
       * @return {void}
       */
       _closeImplicitly: function() {
         this._ignoreBeforeCloseResultant = true;
         this.close();
         delete this._ignoreBeforeCloseResultant;
       }

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
    *
    */

    //////////////////     SUB-IDS     //////////////////
    /**
     * <p>Sub-ID for the dialog header.</p>
     *
     * @ojsubid oj-dialog-header
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-dialog-header'} );
     */

    /**
     * <p>Sub-ID for the dialog footer.</p>
     *
     * @ojsubid oj-dialog-footer
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog footer:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-dialog-footer'} );
     */

    /**
     * <p>Sub-ID for the dialog body.</p>
     *
     * @ojsubid oj-dialog-body
     * @memberof oj.ojDialog
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the node for the dialog body:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-dialog-body'} );
     */

    /**
     * <p>Sub-ID for the dialog content.</p>
     *
     * @ojsubid oj-dialog-content
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog content:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-dialog-content'} );
     */

    /**
     * <p>Sub-ID for the dialog header-close-wrapper.</p>
     *
     * @ojsubid oj-dialog-header-close-wrapper
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header-close-wrapper:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-dialog-header-close-wrapper'} );
     */

    /**
     * <p>Sub-ID for the dialog close-icon.</p>
     *
     * @ojsubid oj-dialog-close-icon
     * @memberof oj.ojDialog
     * @deprecated this sub-ID is deprecated, please use oj-dialog-close instead.
     *
     * @example <caption>Get the node for the dialog close-icon:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-dialog-close-icon'} );
     */

    /**
     * <p>Sub-ID for the dialog close affordance.</p>
     *
     * @ojsubid oj-dialog-close
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog close affordance:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-dialog-close'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the north location.</p>
     *
     * @ojsubid oj-resizable-n
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-n'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the south location.</p>
     *
     * @ojsubid oj-resizable-s
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-s'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the east location.</p>
     *
     * @ojsubid oj-resizable-e
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-e'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the west location.</p>
     *
     * @ojsubid oj-resizable-w
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-w'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the northeast location.</p>
     *
     * @ojsubid oj-resizable-ne
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-ne'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the northwest location.</p>
     *
     * @ojsubid oj-resizable-nw
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-nw'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the southwest location.</p>
     *
     * @ojsubid oj-resizable-sw
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-sw'} );
     */

    /**
     * <p>Sub-ID for the dialog resizable handle at the southeast location.</p>
     *
     * @ojsubid oj-resizable-se
     * @memberof oj.ojDialog
     *
     * @example <caption>Get the node for the dialog header:</caption>
     * var node = $( ".selector" ).ojDialog( "getNodeBySubId", {'subId': 'oj-resizable-se'} );
     */



    });

}() );


});
