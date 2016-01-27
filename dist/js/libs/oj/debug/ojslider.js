/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue', 'jqueryui-amd/draggable', 'ojs/ojtouchproxy'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function() {

/*!
 * JET Slider @VERSION
 *
 *
 * Depends:
 *  jquery.ui.widget.js
 */

/**
 * @ojcomponent oj.ojSlider
 * @augments oj.editableValue
 * 
 * @classdesc
 * <h3 id="sliderOverview-section">
 *   JET Slider Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sliderOverview-section"></a>
 * </h3>
 * <p>Description: The ojSlider component enhances an HTML <code class="prettyprint">input</code> element into an interactive slider.
 * </p>
 * The <code class="prettyprint">type</code> option is used to set the slider to either a single-thumb or a range slider.
 * Single thumb sliders are defined by setting the <code class="prettyprint">type</code> option to either <code class="prettyprint">"single"</code>, <code class="prettyprint">"fromMin"</code>, or <code class="prettyprint">"fromMax"</code>.
 * The <code class="prettyprint">type</code> option defaults to <code class="prettyprint">"fromMin"</code>, which will style the value bar from the minimum value to the slider thumb.
 * A range slider (a slider with two thumbs) is defined by setting <code class="prettyprint">type</code> to <code class="prettyprint">range"</code>. 
 * The value bar is styled between the thumbs for a range slider.
 * <ul>
 * <li> To create a single thumb slider:</li>
 * Either use the default <code class="prettyprint">type</code>, or set the <code class="prettyprint">type</code> option to either "single", "fromMin", or "fromMax".
 * Set the <code class="prettyprint">value</code> option to a number. The value should be between the <code class="prettyprint">min</code> and <code class="prettyprint">max</code> option values. 
 * <li> To create a range slider (slider with two thumbs):</li>
 * set the <code class="prettyprint">type</code> option to "range", 
 * and set the <code class="prettyprint">value</code> option to an array of two numbers.
 * The first array value must be less than or equal to the second array value, and both values must be between the <code class="prettyprint">min</code> and <code class="prettyprint">max</code> option values. 
 * </ul>
 * </p>
 * The step option of the slider specifies the interval between thumb stops. For example, if <code class="prettyprint">min</code>  is set to 0 and <code class="prettyprint">max</code>
 * is set to 10, a <code class="prettyprint">step</code> value of 2 would allow the thumb to be positioned at 0, 2, 4, 6, 8, and 10.
 * </p>
 * The <code class="prettyprint">orientation</code> option defaults to <code class="prettyprint">"horizontal"</code>.
 * Set <code class="prettyprint">orientation</code> to <code class="prettyprint">"vertical"</code> for a vertical slider (one where the thumb travels along the vertical axis).
 * </p>
 * Set the <code class="prettyprint">disabled</code> option <code class="prettyprint">true</code> to display a slider that displays a value but does not allow interaction.
 * </p>
 * For horizontal sliders, use the slider component's <code class="prettyprint">rootAttributes </code> 
 * to set the width. For vertical sliders, use <code class="prettyprint">style </code> attributes on the 
 * <code class="prettyprint">input </code> tag to set the slider height. These conventions are recommended in order
 * to achieve the best messaging format.
 * </p>
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 * <p>
 * The slider component is accessible - it sets and maintains the appropriate aria- attributes, 
 * including <code class="prettyprint">aria-valuenow</code>, <code class="prettyprint">aria-valuemax</code>,
 * <code class="prettyprint">aria-valuemin</code> and <code class="prettyprint">aria-orientation</code>.
 * <p>
 * It is up to the application developer to associate the label with the slider input component.
 * There are three ways to do this:
 * <ul>
 * <li>
 * Set an <code class="prettyprint">aria-labelledby</code> on the slider input to reference the label
 * <code class="prettyprint">id</code>.
 * </li>
 * <li>
 * Set an <code class="prettyprint">id</code> on the slider input, and also set 
 * the <code class="prettyprint">for</code> attribute on the label to be the input's id.
 * </li>
 * <li>
 * Set an <code class="prettyprint">aria-label</code> on the slider input. 
 * </li>
 * </ul>
 *
 * The slider component will then use this information in the input tag to create the appropriate aria attribute on the slider thumb(s).
</p>
In addition, the slider thumb element can be accessed using <code class="prettyprint">getNodeBySubId()</code> method.
This allows the user to (a) override any of the above aria attributes that were set automically on the thumb,
 * or (b) define additional aria attributes, such as <code class="prettyprint">aria-controls</code> 
 * or <code class="prettyprint">aria-valueText</code> .
 * <p> 
 * If the slider controls another element that is in a remote area of the page,
 * then the <code class="prettyprint">aria-controls</code> attribute for the slider thumb should be set.
 * This can also be accomplished by accessing the slider thumb element using <code class="prettyprint">getNodeBySubID()</code>.
 * 
 * <p> 
 * For example, suppose there is another component, that is in a remote area of the page that controlled by the slider.
 * Assume that the <code class="prettyprint">id</code>  of the remote element is "idOfRemoteElement".
 * Below we use the <code class="prettyprint">getNodeBySubId()</code> method to access the thumb element in order to set the 
 * <code class="prettyprint">aria-controls</code> attribute of the thumb to point to the the id ("idOfRemoteElement") of the remote html element:
 * 
 * <pre class="prettyprint">
 * <code>
 *  $(document).ready(function() {
 *     ko.applyBindings(...)
 *     var thumb0 = $('#inputslider-id').ojSlider("getNodeBySubId", {subId:"oj-slider-thumb-0"});
 *     $(thumb0).attr("aria-controls", "idOfRemoteElement");
 *  });
 * </code></pre>
 * 
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * @desc Creates an ojSlider component
 * 
 * @param {Object=} options a map of option-value pairs to set on the component
 * 
 * @example <caption>Initialize component using widget API</caption>
 * &lt;input id="spin" type="text"/&gt;<br/>
 * $("#slider").ojSlider({'value': 10, 'max':100, 'min':0, 'step':2});
 * $("#slider").ojSlider({'option', 'value', 10});
 * @example <caption>Using knockout, value, min, max bind to observables - salary, salaryMax, salaryMin</caption> 
 * &lt;input id="foo" data-bind="ojComponent: 
 *   {component: 'ojSlider', value: salary, min:salaryMin, max:salaryMax, step:5}"/&gt;
 */
    oj.__registerWidget("oj.ojSlider", $['oj']['editableValue'], {
        defaultElement: "<input>",
        version: "1.0.1",
        widgetEventPrefix : "oj", 

        options: {

            /** @private 
              * @type {?number}
            */
            distance: 0,
            /** 
              * The maximum value of the slider. 
              * The <code class="prettyprint">max</code> must not be less than the 
              * <code class="prettyprint">min</code>, or else an Error is thrown during initialization.
              * @expose 
              * @memberof oj.ojSlider
              * @instance
              * @type {?number}
              * @default <code class="prettyprint">null</code>
              * @example <caption>Initialize the slider with the 
              * <code class="prettyprint">max</code> option specified:</caption>
              * $( ".selector" ).ojSlider( { "max": 100 } );
              * @example <caption>Set the <code class="prettyprint">max</code> to a number inside 
              * of quotes; this is valid and will be coerced to a number,
              * -100 in this example:</caption>
              * $( ".selector" ).ojSlider( { "max": "-100" } );
              */
            max: 100,
            /** 
              * The minimum value of the slider. 
              * The <code class="prettyprint">min</code> must not be greater than the 
              * <code class="prettyprint">max</code>, or else an Error is thrown during initialization.
              * @expose 
              * @memberof oj.ojSlider
              * @instance
              * @type {?number}
              * @default <code class="prettyprint">null</code>
              * @example <caption>Initialize the slider with the 
              * <code class="prettyprint">max</code> option specified:</caption>
              * $( ".selector" ).ojSlider( { "max": 100 } );
              * @example <caption>Set the <code class="prettyprint">max</code> to a number inside 
              * of quotes; this is valid and will be coerced to a number,
              * -100 in this example:</caption>
              * $( ".selector" ).ojSlider( { "max": "-100" } );
              */
            min: 0,
            /** 
              * Specify the orientation of the slider.
              *
              * @expose 
              * @memberof! oj.ojSlider
              * @instance
              * @type {string}
              * @ojvalue {string} "horizontal" Orient the slider horizontally.
              * @ojvalue {string} "vertical" Orient the slider vertically.
              * @default <code class="prettyprint">"horizontal"</code>
              *
              * @example <caption>Initialize the slider with the 
              * <code class="prettyprint">orientation</code> option specified:</caption>
              * $( ".selector" ).ojSlider( { "orientation": "vertical" } );
              * 
              * @example <caption>Get or set the <code class="prettyprint">orientation</code> 
              * option after initialization:</caption>
              * // getter
              * var orientation = $( ".selector" ).ojSlider( "option", "orientation" );
              * 
              * // setter
              * $( ".selector" ).ojSlider( "option", "orientation", "vertical" );
              */
            orientation: "horizontal",
            
            /**
              * readOnly is private - more UX design is necessary to support readonly across components.
              * Whether the component is readOnly. The element's <code class="prettyprint">readOnly</code>
              *  property is used as its initial value if it exists, when the option is not explicitly set. When neither is set, 
              * <code class="prettyprint">readOnly </code>
              * defaults to false.
              * 
              * @example <caption>Initialize component with <code class="prettyprint">readOnly</code> option:</caption>
              * $(".selector").ojSlider({"readOnly": true});
              * 
              * @private
              * @type {?boolean}
              * @default <code class="prettyprint">false</code>
              * @instance
              * @memberof oj.ojSlider
              */
            readOnly: false,

            
            /** 
             * Whether the component is disabled. The element's <code class="prettyprint">disabled</code>
             *  property is used as its initial 
             * value if it exists, when the option is not explicitly set. When neither is set, 
             * <code class="prettyprint">disabled </code>
             * defaults to false.
             * 
             * @example <caption>Initialize component with <code class="prettyprint">disabled</code> option:</caption>
             * $(".selector").ojSlider({"disabled": true});
             * 
             * @expose 
             * @type {?boolean}
             * @default <code class="prettyprint">false</code>
             * @instance
             * @memberof oj.ojSlider
             */
            disabled: false,

            /** 
             * Determines the size or amount of each interval or step the slider takes 
             * between min and max.
             * The full specified value of the range (max - min) should be divisible by step.
             *
             * @expose 
             * @instance
             * @type {?number}
             * @default <code class="prettyprint">1</code>
             * @memberof oj.ojSlider 
             * @example <caption>Initialize the slider with the 
             * <code class="prettyprint">step</code> option specified:</caption>
             * $( ".selector" ).ojSlider( { "step": 10 } );
             * @example <caption>Set the <code class="prettyprint">step</code> to a number inside 
             * of quotes; this is valid and will be coerced to a number,
             * 10 in this example:</caption>
             * $( ".selector" ).ojSlider( { "step": "10" } );
             **/

            step: 1,

            /**
              * The slider type determines whether the slider has one thumb or two thumbs, and how the value is represented in the UI.
              * <p> Note that for the use case of dynamically switching between a range slider and a single-thumb slider,
              * it is best to set the <code class="prettyprint">type</code> option before setting the <code class="prettyprint">value</code> option. 
              * This avoids the loss of the second thumb's value (during value coersion) when switching from a single-thumb slider to a range slider (when the value would be set as an array on a single-thumb slider).
              *
              * @expose
              * @type {?string}
              * @ojvalue {string} "fromMin" A single-thumb slider where the value bar goes from the slider min to the the slider thumb.
              * @ojvalue {string} "fromMax" A single-thumb slider where the value bar goes from the slider thumb to the the slider max.
              * @ojvalue {string} "range" A slider with two thumbs, where the value bar goes between the slider thumbs.
              * @ojvalue {string} "single" A single-thumb slider where the value bar has no additional styling.
              * @default <code class="prettyprint">"fromMin"</code>
              * @instance
              * @memberof oj.ojSlider
              * 
              * @example <caption>Initialize component with <code class="prettyprint">type</code> option set to "range":</caption>
              * $(".selector").ojSlider({"type": "range"});
              * 
              */

            type: "fromMin",
            
            /** 
             * The value of the component. Value can be a number or an array. 
             * When <code class="prettyprint">type</code> is equal to "range" the <code class="prettyprint">value</code> should be an array of two numbers,
             * while any other <code class="prettyprint">type</code> should have <code class="prettyprint">value</code> defined as a number.
             * 
             * <p> Note that the <code class="prettyprint">value</code> option should
             * be compatible with the <code class="prettyprint">type</code> option, as described above.
             * A value that is not compatible with the type will be coerced into a compatible value. 
             * For example, it <code class="prettyprint">type</code> is set to "range" 
             * and the value is not an array of two numbers, then the value will be
             * automatically coerced into an array of two numbers.
             *
             * <p> Also note that for the use case of dynamically switching between a single-thumb slider and a range slider,
             * you should set the <code class="prettyprint">type</code> option before setting the <code class="prettyprint">value</code> option.
             * This avoids the loss of the second thumb's value (during value coersion) when switching from a single-thumb slider to a range slider (when the value would be set as an array on a single-thumb slider).
             *
             * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option specified:</caption>
             * $(".selector").ojSlider({'value': 55});<br/>
             * @example <caption>Get or set <code class="prettyprint">value</code> option, after initialization:</caption>
             * // Getter: returns 55
             * $(".selector").ojSlider("option", "value");
             * // Setter: sets 20
             * $(".selector").ojSlider("option", "value", 20);
             * @example <caption>Set the <code class="prettyprint">value</code> to a number inside 
             * of quotes; this is valid and will be coerced to a number,
             * 10 in this example:</caption>
             * $( ".selector" ).ojSlider( { "value": "10" } );
             * @expose 
             * @access public
             * @instance
             * @default <code class="prettyprint">0</code>
             * @memberof oj.ojSlider
             * @type {?number|Array.<Number>}
             */
            value: 0,
             /**
              * <p>The  <code class="prettyprint">rawValue</code> is the read-only option for retrieving
              * the transient value from the slider.</p>
              * <p>
              * The <code class="prettyprint">rawValue</code> updates to display the transient changes of the
              * slider thumb value (subject to the step constraints). The difference in behavior is that 
              * <code class="prettyprint">rawValue</code> will be updated the thumb as it is sliding, 
              * where as the <code class="prettyprint">value</code> option is updated only after the 
              * thumb is released (or after a key press).
              * </p>
              * <p>This is a read-only option so page authors cannot set or change it directly.</p>
              * @expose
              * @access public
              * @instance
              * @default n/a
              * @memberof oj.ojSlider
              * @type {?number|Array.<Number>|undefined}
              * @since 1.2
              * @readonly
              */
             rawValue: undefined

        },

        // number of pages in a slider
        // (how many times can you page up/down to go through the whole range)
        _numPages: 5,

        _sliderDisplayValue: null,

        _isRTL: function() {
            return oj.DomUtils.getReadingDirection() === "rtl";
        },

        _ComponentCreate : function () {

            this._super();

            var node = this.element;

            // input type=number does not support the 'pattern' attribute, so
            // neither should ojInputNumber.
            // remove this before EditableValue grabs it and uses it.
            
            node.removeAttr("pattern");

            // ojSlider could support both <div> and <input> tags
            this._inputtag = false;

            if (this.element.is("INPUT")) 
            {
                this._inputtag = true;

                // Save the input tag style, apply to sliderWrapper later in the code.
                if (this.element[0].style) 
                    this._styleFromInputTag = this.element[0].style.cssText;

                this._inputElementOriginalDisplay = this.element.css("display");
                this.element.css("display", "none");

                var inputDiv = $(this.element).wrap('<div> </div>'); // @HTMLUpdateOK
                
                // _elementWrapped is the new wrapped input element.
                this._elementWrapped = inputDiv.parent();
            }
            else {
                this._elementWrapped = this.element;
            }

            this._componentSetup();
        },

        //
        // Setup the component based on the current options.
        // Also create DOM elements for thumbs and bars.
        //
        _componentSetup : function () {

            this._newMultiValue = new Array();
            this._thumbIndex = null;

            var classes = "oj-slider ";

            if (this._isVertical()) 
                classes += "oj-slider-vertical";
            else
                classes += "oj-slider-horizontal";
        
            classes += " oj-component oj-form-control";

            if (this.options.readonly) classes += " oj-read-only";
            if (this.options.disabled) classes += " oj-disabled";

            this._elementWrapped.removeClass();
            this._elementWrapped.addClass(classes);

            if (this.options.type === "range")
                this._multipleThumbs = true;
            else this._multipleThumbs = false;

            this._calculateNewMax();

            this._createSliderContainer();
            this._createBarBackground();
            this._buildValueOption();
            this._createRange();
            this._createThumbs();
            this._updateUI();

	    this._setupEvents();
        },

        _AfterCreate : function ()
        {
            this._super();

	    this._makeDraggable();

            var label = this._GetLabelElementLocal();

            // this.$label = this._GetLabelElementLocal();

            //
            // Copy any labelled-by on the <input labelled-by="id"> to the slider thumb.
            //
            if (label) {
                // 
                // this id shold be on the thumb: aria-labelledby =
                // 
                var thumb = this._elementWrapped.find('.oj-slider-thumb');
                // Set the aria-labelledby attribute of the thumb to the returned id.
                var labelId = label.attr("id");
                if (!labelId)
                    labelId = label.attr("for");

                thumb.attr('aria-labelledby', labelId);

                if (label.length > 1 && thumb.length > 1)  {

                    /*
                    var label2 = label[1];
                    var secondLabelId = $(label2).attr("id");
                    */

                    var thumb2 = thumb[1];
                    thumb2.attr('aria-labelledby',  String(labelId));
                }
            }
            else {

                //
                // Check if the <input> has aria-label=""
                //

                var ariaLabelString = this.element.attr("aria-label");
                if (ariaLabelString) {
                    // console.log("aria-label " + ariaLabelString);

                    var thumb = this._elementWrapped.find('.oj-slider-thumb');

                    // Set the aria-labelledby attribute of the thumb to the returned id
                    thumb.attr('aria-label',  ariaLabelString);

                }
            }
        },

        _GetLabelElementLocal : function ()
        {
            // If <input> has aria-labelledby set, then look for label it is referring to.
            var queryResult = this._getAriaLabelledByElementLocal();
            if (queryResult !== null && queryResult.length !== 0)
            {
                // console.log("found labelledby");
                // console.log("label id is " + queryResult.attr("id"));
                return queryResult;
            }
            
            queryResult = this._getAriaLabelForElementLocal();
            if (queryResult !== null && queryResult.length !== 0)
                return queryResult;

        },

        _getAriaLabelForElementLocal: function()
        {
            var id = this.element.prop("id");
            if (id !== undefined)
            {

                var labelQuery = "label[for='" + id + "']";

                // console.log("label id is " + $(labelQuery).attr("id"));

                var jqLabelQuery = $(labelQuery);
                if (jqLabelQuery.length > 0) return jqLabelQuery;

                var spanQuery = "span[for='" + id + "']";

                // console.log("span id is " + $(spanQuery).attr("id"));

                if ($(spanQuery).length !== 0)
                    return $(spanQuery);
            }
            return null;
        },

        _getAriaLabelledByElementLocal: function()
        {
            // look for a label with an id equal to the value of aria-labelledby. 
            // .prop does not work for aria-labelledby. Need to use .attr to find
            // aria-labelledby.
            var ariaId = this.element.attr("aria-labelledby");

            if (ariaId !== undefined )
            {

                var labelQuery = "label[id='" + ariaId + "']"; 
                var jqLabelQuery = $(labelQuery);
                if (jqLabelQuery.length > 0) return jqLabelQuery;

                var spanQuery = "span[id='" + ariaId + "']"; 
                var jqSpanQuery = $(spanQuery);
                if (jqSpanQuery.length > 0) return jqSpanQuery;

            }    
            else
                return null;
        },

        widget: function() {
            return this._elementWrapped;
        },

        /**
         * Called when the display value on the element needs to be updated. This method updates the 
         * (content) element value. Widgets can override this method to update the element appropriately. 
         * 
         * @param {String} displayValue of the new string to be displayed
         * 
         * @memberof oj.slider
         * @instance
         * @protected
        */  
        _SetDisplayValue : function (displayValue) 
        {
            this._sliderDisplayValue = displayValue;
        },
        
        /**
         * Returns the display value that is ready to be passed to the converter.
         * 
         * @return {string} usually a string display value
         * 
         * @memberof oj.slider
         * @instance
         * @protected
         */
        _GetDisplayValue : function () 
        {
            return this._sliderDisplayValue;
        },

        _getElementId: function() {
            return (this.element[0].id);
        },

        //
        // Return the id of the slider thumb at index.
        //
        _getThumbId: function(index) {

            var elementId = this._getElementId();
            var thumbId = elementId + "-thumb" + index;
            return thumbId;
        },

        // 
        // Return the id of the slider bar value.
        // 
        _getBarValueId: function(index) {

            var elementId = this._getElementId();
            var thumbId = elementId + "-barValue";
            return thumbId;
        },

        // 
        // Return the id of the slider bar.
        // 
        _getBarBackgroundId: function(index) {

            var elementId = this._getElementId();
            var thumbId = elementId + "-barBack";
            return thumbId;
        },

        // 
        // Return the id of the slider bar.
        // 
        _getSliderWrapperId: function(index) {

            var elementId = this._getElementId();
            var sliderWrapperId = elementId + "-sliderWrapper";
            return sliderWrapperId;
        },

        _createThumbs: function() {

            var i, thumbCount,
            ariaNow = "aria-valuenow = '" + this._valueMin() + "' ",
            ariaMin = "aria-valuemin = '" + this._valueMin() + "' ",
            ariaMax = "aria-valuemax = '" + this._valueMax() + "' ",
            options = this.options,
            orientationClass,
            thumb = "",
            thumbSpanStart = "<span ", 
            thumbClasses = "class='oj-slider-thumb ui-state-default' tabindex='0' role='slider'" + ariaMin + ariaMax + "></span>",
            thumbs = [];

            if (this._multipleThumbs) 
                thumbCount = this.options.value.length;
            else thumbCount = 1;

            // 
            // Assign each thumb a unique id based on the elementId and the thumb number.
            // 
            for (i=0; i < thumbCount; i++) {
                var thumbId = "id='" + this._getThumbId(i) + "' ";
                thumb = thumbSpanStart + thumbId + thumbClasses;
                thumbs.push( thumb );
            }

            this._thumbs = $(thumbs.join( "" )).appendTo(this._sliderContainer);  // @HTMLUpdateOK
            this._thumb = this._thumbs.eq(0);

            var that = this;
            this._thumbs.each(function( i ) {
                $( this ).data( "oj-slider-thumb-index", i );

                if (that._isVertical() ) 
                    $(this).attr('aria-orientation', "vertical");

                if (that.options.disabled) {
                    $(this).attr('aria-disabled', "true");
                    $(this).removeAttr("tabindex")
                } else {
                    $(this).removeAttr('aria-disabled');
                }
                
                // To support read only, we place set title = "read only" on the thumb.
                if (that.options.readOnly) {
                    $(this).attr('title', "read only");
                    // $(this).removeAttr("tabindex")
                } else 
                    $(this).removeAttr('title');
                
            });
        },

        // 
        // Create a containing div to group all component generated content.
        // This is used in messaging, so that we can apply margins/padding 
        // between the inline message div and the pixels that make up the slider.
        // 
        _createSliderContainer: function() {

            var sliderWrapperId = this._getSliderWrapperId();
            var existingSliderWrapper = this._elementWrapped.find('#' + sliderWrapperId);

            if (existingSliderWrapper.length) existingSliderWrapper.remove();

            this._sliderContainer = $("<div></div>");
            $(this._sliderContainer).attr('id', sliderWrapperId);
            this._sliderContainer.addClass("oj-slider-container");

            this.element.after(this._sliderContainer); // @HTMLUpdateOK

            // copy all style properties from the input tag to the enclosing slider div (sliderWrapper) 
            this._sliderContainer[0].style.cssText = this._styleFromInputTag;
            // 
            // If the height is not set on a vertical slider,
            // Apply a 150px default height.
            // 
            if (this._isVertical() && this._sliderContainer[0].style.height == "") {
                this._sliderContainer[0].style.height = "150px";
            }
        },

        _createBarBackground: function() {

            var barId = this._getBarBackgroundId();

            var existingBarBack = this._elementWrapped.find('#' + barId);

            if (existingBarBack.length) existingBarBack.remove();

            this._barback = $("<div></div>");

            var classes = "oj-slider-bar";
            
            if (this._isVertical()) 
                classes += " oj-slider-vertical";
            else
                classes += " oj-slider-horizontal";
        
            $(this._barback).attr('id', barId);
            this._barback.addClass(classes)

            // Place the background bar element immediately after the hidden input tab.
            this._sliderContainer.append(this._barback);  // @HTMLUpdateOK

            //
            // Clicking on the bar repositions the thumb.
            //
            var that = this;
            this._barback.on("mousedown" + that.eventNamespace, function( event ) {

                that._repositionThumb(event);
                that._mouseStop(event);

                var thumb = that._getActiveThumb();
                thumb.focus();

            });
        },

        //
        // Set the options.value to the correct type, based on whether the slider has
        // been set to a range slider (_multipleThumbs is true), or a single-thumbed slider.
        //
        // Handle cases when the values option was never set, or when the values 
        // option was incorrectly set.
        //
        _buildValueOption: function() {

            var options = this.options;

            if ( options.type ) {

                if (!this.options.value) {

                    //
                    // If the value options was never set,
                    // then initialize the value using valueMin (for a single-thumbbed slider)
                    // or [valueMin, valueMax] (for a two-thumbbed slider).
                    //
                    if (this._multipleThumbs) 
                        this.options.value = [this._valueMin(), this._valueMax()];
                    else 
                        this.options.value = this._valueMin();

                    this.option('value',
                                this.options.value,
                                {'_context': {writeback: true, internalSet: true}});

                } else if (this._multipleThumbs) {

                    if (this.options.value.length != 2) {
                        //
                        // Transform to an array of two values if the user did not supply 
                        // the correct # of array values.
                        //
                        var firstValue;
                        if (this.options.value.length > 0) firstValue = this.options.value[0];
                        else firstValue = this._valueMin();

                        this.options.value = [firstValue, this._valueMax()];
                        this.option('value',
                                    this.options.value,
                                    {'_context': {writeback: true, internalSet: true}});
                    }
                }
            }
        },

        _createRange: function() {

            var options = this.options, classes = "";

            if ( options.type ) {

                //
                // Define the range (value bar) div
                //
                this._range = $("<div></div>");
                // Give the bar an id.
                $(this._range).attr('id', this._getBarValueId());

                this._sliderContainer.append(this._range);  // @HTMLUpdateOK
                classes = "oj-slider-range oj-slider-bar-value";

                //
                // Like the bar background, clicking on the bar value also repositions the thumb.
                //
                var that = this;
                this._range.on("mousedown" + that.eventNamespace, function( event ) {
                    that._repositionThumb(event);
                    that._mouseStop(event);

                    var thumb = that._getActiveThumb();
                    // if we add oj-active here it "sticks"
                    // thumb.addClass("oj-active").focus();
                    thumb.focus();

                });

                this._range = this._sliderContainer.find('#' + this._getBarValueId());

                var newClass = "";
                if (options.type === "fromMin") newClass = " oj-slider-range-min";
                else if (options.type === "fromMax") newClass = " oj-slider-range-max";

                this._range.addClass( classes + newClass);
            } else {

                if ( this._range ) {
                    this._range.remove();
                }
                this._range = null;
            }
        },

        _setupTouch : function (e)
        {
            this._touchProxy = oj._TouchProxy.addTouchListeners(e);
        },

        _tearDownTouch : function (e)
        {
            oj._TouchProxy.removeTouchListeners(e);
        },

	/**
	 * Setup events for slider.
	 * 
	 * @protected
	 * @memberof oj.ojSlider
	 * @instance
	 */
        _setupEvents: function() {

            if (this._CanSetValue()) 
	    {
		this._hoverable( this._elementWrapped );
	    }	    
	    this._focusable( this._elementWrapped );

            this._thumbs.toArray().forEach (

                function(current, i) {
                    var thumb = $(current);

                    // setup keyboard events on each thumb.
                    this._UnregisterChildNode(thumb);
                    this._on(thumb, this._thumbEvents);

                    // setup touch events on each thumb
                    this._setupTouch(thumb);

                    // We should double-check the need for hoverable on thumbs
                    // once there is a more consistent cross-component story for hoverable
                    // this._hoverable(thumb);
                    // this._focusable(thumb);
                },
                this
            );
        },

        // This call is necessary in order to implement popup messaging properly.
	/**
	 * Returns a jquery object of the elements representing the content nodes (slider).
	 * @protected
	 * @override
	 * @memberof oj.ojSlider
	 */
	_GetContentElement : function ()
	{
	    return this._elementWrapped;
	},

        // 
        // Destroy the slider DOM.
        // This is called both by _destroy and during an option change.
        // During option change, we do not unwrap - since we wish to maintain any
        // divs added for messaging, such as oj-messaging-inline-container.
        //
        _destroySliderDom: function() {

            // Tear down touch events for each thumb.
            this._thumbs.toArray().forEach (
                function(current, i) {
                    var thumb = $(current);
                    this._tearDownTouch(thumb);
                },
                this
            );

            if (this._range) this._range.remove();
            if (this._sliderContainer) this._sliderContainer.remove();

        },

        //
        // Unwrap the slider.
        // This is only called when we completely destroy the slider (_destroy).
        //
        _unwrapSlider: function() {

            oj.DomUtils.unwrap(this.element, this._elementWrapped); // @HTMLUpdateOK
            this.element.css("display", this._inputElementOriginalDisplay);
	    this._RestoreAttributes(this.element);
        },

        /**
          * Override of protected base class method.  
          * Method name needn't be quoted since is in externs.js.
          * @protected
          * @memberof oj.ojSlider
          * @instance
          */
        _destroy: function() {

            this._destroySliderDom();
            this._unwrapSlider();

	    return this._super();

        },

        // 
        // Called when the the user clicks on the bar in order to reposition the thumb.
        // Setup initial positions, distance.
        // The mouse position is used for bar clicks,
        // while the thumb position is used when dragging the thumb.
        // 
        // Do not process mouse events if the slider is disabled (or readOnly).
        // 
        _repositionThumb: function(event) {

            var position, normValue, distance, index,
            that = this,
            o = this.options;

            index = 0;
            this._closestThumb = this._thumb;

            if ( o.disabled ) return false;
            if ( o.readOnly ) return false;

            //
            // Reposition, since when we clicked on a bar.
            //
            position = { x: event.pageX, y: event.pageY };
            normValue = this._getNormValueFromMouse(position);

            distance = this._valueMax() - this._valueMin() + 1;

            if (this._multipleThumbs) {
                this._thumbs.each(function( i ) {
                    var thisDistance = Math.abs( normValue - that._getMultiValues(i) );
                    if (( distance > thisDistance ) ||
                        ( distance === thisDistance &&
                          (i === that._lastChangedValueIndex || that._getMultiValues(i) === o.min ))) {
                        distance = thisDistance;
                        this._closestThumb = $( this );
                        index = i;
                    } 
                });
            }

            this._thumbIndex = index;
            if (!this._closestThumb) return;

            // This call is needed to support 'click-to-reposition' the thumb
            if ( !this._thumbs.hasClass( "ui-state-hover" ) ) {
                this._slide( event, index, normValue );
            }

            var thumb = this._getActiveThumb();
            thumb.addClass("oj-active").focus();
            // For mobile theming, we need to change the color of the value bar when active.
            this._range.addClass("oj-active");

            return true;
        },

        // 
        // Called by draggable start.
        // Ad the oj-active classes, place thumb in focus.
        // 
        _initDragging: function(event, thumb) {

            var o = this.options;

            if ( o.disabled ) return false;
            if ( o.readOnly ) return false;

            thumb.addClass("oj-active").focus();
            // For mobile theming, we need to change the color of the value bar when active.
            this._range.addClass("oj-active");

            return true;
        },

        _mouseDragInternal: function( event, thumb ) {

            // Mirror the mouse drag with a pct change.

            //
            // Raw value update.
            // 
            var normValue = this._getNormValueFromThumb(thumb);
            this._slide( event, this._thumbIndex, normValue, true );

            var pct = this._getFracFromThumb(thumb) * 100;

            if (this._multipleThumbs) this._setRangeMultiThumb(pct, this._thumbIndex);
            else this._setRange(pct);

            return false;
        },

        _mouseStop: function( event, thumb ) {

            this._thumbs.removeClass( "oj-active" );
            this._range.removeClass("oj-active");

            var normValue = this._getNormValueFromThumb(thumb);
            this._slide( event, this._thumbIndex, normValue );
            // _change is needed for click positioning
            this._change( event, this._thumbIndex, false );

            this._thumbIndex = null;

            return false;
        },

        _isVertical: function() {
            return (this.options.orientation === "vertical");
        },
        // 
        // Adjust the fraction for bounds limits and orientation.
        // 
        _getOrientationAdjustedFrac: function(frac) {

            if ( frac > 1 ) {
                frac = 1;
            }
            if ( frac < 0 ) {
                frac = 0;
            }
            if ( this._isVertical() ) {
                frac = 1 - frac;
            }

            return frac;
        },

        // 
        // Return a normalized value (trimmed to step increments)
        // based on the passed mouse coordinates.
        //
        _getNormValueFromMouse: function(position) {

            var pixelTotal,
            pixelMouse,
            valueTotal,
            valueMouse;

            var fracMouse = this._getFracFromMouse(position);

            valueTotal = this._valueMax() - this._valueMin();

            if (this._isRTL() && !this._isVertical())
                fracMouse = 1 - fracMouse;

            valueMouse = this._valueMin() + fracMouse * valueTotal;

            return this._trimAlignValue( valueMouse );
        },

        // 
        // Return the fraction (between 0 and 1)
        // that represents the bar value.
        // This is based on the mouse position parameter.
        // 
        _getFracFromMouse: function(position) {

            var pixelTotal, pixelMouse, fracMouse;

            if (!this._isVertical()) {
                pixelTotal = this._barback.width();
                pixelMouse = position.x - this._barback.offset().left;
            } else {
                pixelTotal = this._barback.height();
                pixelMouse = position.y - this._barback.offset().top;
            }

            if (pixelTotal == 0) return 1;

            fracMouse = ( pixelMouse / pixelTotal );
            fracMouse = this._getOrientationAdjustedFrac(fracMouse);

            return fracMouse;

        },

        // Return the active thumb
        _getActiveThumb: function() {

            if (this._multipleThumbs) {
                return($(this._thumbs[this._thumbIndex]));
            } else 
                return(this._thumb);
        },

        // 
        // Return the fraction (between 0 and 1)
        // that represents the bar value.
        // This is based on the current position of the thumb.
        // 
        _getFracFromThumb: function(thumb) {

            var pixelTotal, pixelMouse, fracThumb;

            if (!thumb)
                thumb = this._getActiveThumb();

            var pos;

            if (!this._isVertical()) {
                var halfThumbWidth = thumb.outerWidth()/2;
                pos = thumb.offset().left + halfThumbWidth;
                pixelTotal = this._barback.width();
                pixelMouse = pos - this._barback.offset().left;
            } else {
                var halfThumbHeight = thumb.outerHeight()/2;
                pos = thumb.offset().top + halfThumbHeight;
                pixelTotal = this._barback.height();
                pixelMouse = pos - this._barback.offset().top;
            }

            if (pixelTotal == 0) return 1;

            fracThumb = ( pixelMouse / pixelTotal );

            // console.log("pos " + pos + " pctMouse " + fracThumb);

            fracThumb = this._getOrientationAdjustedFrac(fracThumb);

            return fracThumb;

        },

        _getNormValueFromThumb: function(thumb) {
            var fracThumb,
            valueTotal,
            valueMouse;

            fracThumb = this._getFracFromThumb(thumb);

            // console.log("_getNormValueFromThumb percent: " + fracThumb);

            valueTotal = this._valueMax() - this._valueMin();

            if (this._isRTL() && !this._isVertical())
                fracThumb = 1 - fracThumb;

            valueMouse = this._valueMin() + fracThumb * valueTotal;

            var trimmedValue =  this._trimAlignValue( valueMouse );
            // console.log("_getNormValueFromThumb valueMouse: " + valueMouse + " " + trimmedValue);

            return trimmedValue;
        },

        // Return the value for the inactive thumb.
        _getOtherThumbValue: function(index) {
            return(this._getMultiValues( index ? 0 : 1 ));
        },

        //
        // Return the new value, limited by the value of the other thumb.
        // (We ensure that we do not go past the value of the other thumb).
        //
        _getNewThumbValueLimited: function(index, newVal, otherVal) {
            
            if ( ( this.options.value.length === 2 ) &&
                 ( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
               ) {
                return(otherVal);
            }
            return(newVal);
        },

        _slide: function( event, index, newVal, rawOnly ) {
            
            // console.log("_slide: options.value " + this.options.value + " newVal " + newVal);
            var otherVal;

            if (this._multipleThumbs) {

                otherVal = this._getOtherThumbValue(index);
                newVal = this._getNewThumbValueLimited(index, newVal, otherVal);

                if ( newVal !== this._getMultiValues(index) ) {
                    this._setMultiValue(event, index, newVal, rawOnly);
                }
            } else {
                // This case handles a single value
                if ( newVal !== this._getSingleValue() ) {

                    // sets slider thumb value
                    this._setSingleValue(event, newVal, rawOnly);

                    if (!rawOnly)
                    if (this._inputtag) {
                        this.element.val(newVal);
                    }
                }
            } 
        },

        // 
        // Set the slider value.
        // 
        _setSingleValue: function(event, newValue, rawOnly ) {

            this._newValue = this._trimAlignValue( newValue );
            // console.log("setSingleValue " + newValue + " -> " + this._newValue);
            // this._change(event, 0 );
            // console.log("setSingleValue options.value = " + this.options.value)
            if (!rawOnly) {
                this._SetValue(this._newValue, event); 
                this._updateUI();
            }
            this._SetRawValue(this._newValue, event); 

            return;

        },

        _change: function( event, index, rawOnly ) {

            // console.log("_change from " + this.options.value + " to newValue " + this._newValue);

            if (this._multipleThumbs) {
                // store the last change values for creating draggable containment
                this._lastChangedValues = this._getNewValues(index, this._newMultiValue[index]);
                this._SetRawValue(this._lastChangedValues, event);
                if (!rawOnly)
                    this._SetValue(this._lastChangedValues, event); 
            } else {
                this._SetRawValue(this._newValue, event); 
                if (!rawOnly)
                    this._SetValue(this._newValue, event); 
            }

            //store the last changed value index for reference when thumbs overlap
            this._lastChangedValueIndex = index;

        },
        
        //
        // Return options.values with the new value copied in the array
        // Used to format the values argument to SetValue (for the case of multiple thumbs)
        //
        _getNewValues: function(index, newValue) {

            var vals, i;

            vals = this.options.value.slice();

            for ( i = 0; i < vals.length; i += 1) {
                // console.log("**********  " + i + " " + vals[i]);
                vals[ i ] = this._trimAlignValue( vals[ i ] );
            }

            // assume newValue is trim aligned
            // Assign only if it is the thumb that is actually sliding
            if (index === this._thumbIndex)
                vals[index] = newValue;

            return vals;

        },

        // 
        // Return the value of a single thumbbed slider.
        // 
        _getSingleValue: function() {
            return this._getValueAligned();
        },

        // 
        // Return the value for the specified thumb.
        // 
        _getMultiValues: function(index) {

            // 
            // Parameter index is supplied.
            // Return the value for the specified thumb.
            // 
            return this._getValuesAligned(index);

        },

        //
        // Internal setter for slider values.
        // Sets the value for the specifed thumb.
        // (index 0 is used for a single thumb, 
        // for a range slider index 0 and index 1 are used).
        //
        _setMultiValue: function(event, index, newValue,rawOnly ) {

            this._newMultiValue[index] = this._trimAlignValue( newValue );
            // console.log(index + " _setMultiValue " + this._newValue);
            this._change(event, index, rawOnly );
            if (!rawOnly) this._updateUI();
            return;

        },

        _setOption: function( key, value, flags ) {

            var i;
            var coercedValue;

            if (key === "value")
            {

                if (Array.isArray(value)) {
                    if (!isNaN(value[0])) {
                        this._multipleThumbs = true;
                        coercedValue = value;
                    }
                    else {
                        //
                        // Don't set multipleThumbs if the value is not a number
                        // (as would be the case for an error code)
                        //
                        this._multipleThumbs = false;
                        coercedValue = this._parse(key, value[0]);
                    }
                }
                else {
                    this._multipleThumbs = false;
                    coercedValue = this._parse(key, value);
                }
            }

            if (key === "max" || key === "min")
            {
                coercedValue = this._parse(key, value);
            }
            else if (key === "step")
            {
                coercedValue = this._parseStep(value);    
            }
            else
                coercedValue = value;
            
            // Note - this sets aria-disabled="false" on the top level element.
            // For sliders, we do not set disabled on the top level div.
            if ( key != "disabled" ) 
                this._super( key, coercedValue, flags );

            // when a dom element supports readonly, use that, and not aria-readonly.
            // having both is an error

            // Note - for now, readOnly is private.
            if (key === "readOnly")
            {
                this.options.readonly = coercedValue;
            }
            if (key === "disabled") {
                this.options.disabled = coercedValue;
            }

            switch ( key ) {

            case "value":
                this._updateUI();
	        this._makeDraggable();
                break;

            case "min":
            case "max":

                this._calculateNewMax();
                this._updateUI();
	        this._makeDraggable();
                break;

            case "orientation":
            case "readonly":
            case "step":
            case "type":
            case "disabled":
                this._reCreate();
                break;
            }
        },

        //
        // Recreate the slider.
        // Destroy's everything except the wrapper.
        // Called after optionChange.
        //
        _reCreate: function() {
            this._destroySliderDom();
            this._componentSetup();
            this._AfterCreate();
        },

        // internal value getter
        // _getValueAligned() returns value trimmed by min and max, aligned by step
        _getValueAligned: function() {
            var val = this.options.value;
            val = this._trimAlignValue( val );

            return val;
        },

        // 
        // Internal values getter
        //
        // _getValuesAligned() returns array of values trimmed by min and max, aligned by step
        // _getValuesAligned( index ) returns single value trimmed by min and max, aligned by step
        // 
        _getValuesAligned: function( index ) {
            var val = this._trimAlignValue(this.options.value[index]);
            return val;
        },

        // 
        // Return the step-aligned value that val is closest to, between (inclusive) min and max
        // 
        _trimAlignValue: function( val ) {
            if ( val <= this._valueMin() ) {
                return this._valueMin();
            }
            if ( val >= this._valueMax() ) {
                return this._valueMax();
            }
            var step = ( this.options.step > 0 ) ? this.options.step : 1,
            valModStep = (val - this._valueMin()) % step,
            alignValue = val - valModStep;

            if ( Math.abs(valModStep) * 2 >= step ) {
                alignValue += ( valModStep > 0 ) ? step : ( -step );
            }

            // Since JavaScript has problems with large floats, round
            // the final value to 5 digits after the decimal point (see #4124)
            return parseFloat( alignValue.toFixed(5) );
        },

        _calculateNewMax: function() {
            // Check if we need to do this--don't just use straight remainder because of JS math issues
            var min = this._valueMin();
            if ((((this.options.max - min) / this.options.step) % 1) !== 0) {
                var remainder = ( this.options.max - min ) % this.options.step;
                this.max = this.options.max - remainder;
            }
            else {
                this.max = this.options.max;
            }
        },

        _valueMin: function() {
            return this.options.min;
        },

        _valueMax: function() {
            return this.max;
        },

        //
        // Calculate the grid size passed to draggable.
        // This implements the drag to step increments.
        // For a horizontal grid, we would return an array of [pixelInterval, 1],
        // while a vertical grid returns [1, pixelInterval].
        //
        _getGrid: function () {

            var numIntervals;
            if (this.options.step > 0)
                numIntervals = (this._valueMax() - this._valueMin()) / this.options.step;
            else
                numIntervals = 100; // this case should not occur.

            var pixelTotal;

            if (!this._isVertical()) {
                pixelTotal = this._barback.width();
            } else {
                pixelTotal = this._barback.height();
            }
            
            var pixelInterval = pixelTotal / numIntervals;

            if (pixelInterval < 1) pixelInterval = 1;

            if (!this._isVertical()) {
                return new Array(pixelInterval, 1);
            } else {
                return new Array(1, pixelInterval);
            }
            
        },

        _getThumbsValueFrac: function (index) {

            return ((this._getMultiValues(index) - this._valueMin()) / (this._valueMax() - this._valueMin()));
            // Note - (max - min) is checked in options to make sure that it is non-zero and positive 
            // Note - we always use aligned values.
        },


        // 
        // Update the UI, reflecting the value.
        // 
        _updateUI: function() {

            var valPercent, value, valueMin, valueMax;

            // 
            // Multiple thumbs case.
            // 
            if (this._multipleThumbs) {
                this._thumbs.toArray().forEach (

                    function(current, i) {
                        var thumb = $(current);
                        valPercent = this._getThumbsValueFrac(i) * 100;

                        if (this._isRTL() && !this._isVertical()) valPercent = 100 - valPercent;
                        // console.log(i + " Refresh value " + valPercent);
                        
                        if (!this._isVertical()) {
                            $(thumb)["css"]({left: valPercent + "%"});
                        } else { 
                            $(thumb)["css"]({top: (100 - valPercent) + "%"});
                        }

                        $(thumb).attr('aria-valuenow', this._getMultiValues(i));
                        this._setRangeMultiThumb(valPercent, i);

                    },
                    this
                );

            } else {

                // 
                // Scalar value (single thumb)
                //

                // We always want an aligned value here.
                value =  this._getValueAligned();

                valueMin = this._valueMin();
                valueMax = this._valueMax();
                valPercent = ( valueMax !== valueMin ) ?
                    ( value - valueMin ) / ( valueMax - valueMin ) * 100 : 0;

                if (this._isRTL() && !this._isVertical()) valPercent = 100 - valPercent;

                if (!this._isVertical()) {
                    this._thumb["css"]({left: valPercent + "%"});
                } else {
                    this._thumb["css"]({top: (100 - valPercent) + "%"});
                }

                $(this._thumb).attr('aria-valuenow', value);

                this._setRange(valPercent);
            }
        },

        // Set the range (bar value)
        _setRange: function(val) {

            // console.log("_setRange " + val);

            var oRange = this.options.type;

            if (!this._isVertical()) {

                if (!this._isRTL()) {
                    if (oRange === "fromMin") {
                        this._range["css"]( { width: val + "%" });
                    }
                    if (oRange === "fromMax") {
                        this._range["css" ]( { width: ( 100 - val ) + "%" });
                    }
                }
                else {
                    if (oRange === "fromMin") {
                        this._range["css" ]( { width: ( 100 - val ) + "%" });
                    }
                    if (oRange === "fromMax") {
                        this._range["css"]( { width: val + "%" });
                    }
                }
            }
            else {

                if ( oRange === "fromMin") {
                    this._range["css"]( { height: val + "%" });
                }
                if ( oRange === "fromMax") {
                    this._range["css"]( { height: ( 100 - val ) + "%" });
                }
            }
        },

        // 
        // set the range for a multi-thumb (range) slider
        // 
        _setRangeMultiThumb: function(val, index) {

            var id = this._range.attr('id');

            if (index == 0) {

                var thumb1Pct = this._getThumbsValueFrac(1) * 100;
                // console.log("thumb1Pct " + thumb1Pct);

                switch (this.options.type) {

                case "fromMin":

                    if (!this._isVertical()) {
                        this._range["css"]( { width: val + "%" });
                    } 
                    else {
                        this._range["css"]( { height: val + "%" });
                    }
                    break;

                case "range":

                    if (!this._isVertical() ) {
                        if (!this._isRTL()) {
                            this._range["css"]( { left: val + "%" });
                            this._range["css"]( { width: (thumb1Pct - val) + "%" });
                        }
                        else {
                            this._range["css"]( { left: (100 - thumb1Pct) + "%" });
                            this._range["css"]( { width: (thumb1Pct - (100 - val)) + "%" });
                        }

                    } else {
                        this._range["css"]( { top: (100 - thumb1Pct) + "%" });
                        this._range["css"]( { height: (thumb1Pct - val) + "%" });
                    }

                    break;
                }

            } else {

                var thumb0Pct = this._getThumbsValueFrac(0) * 100;

                switch (this.options.type) {

                case "fromMax":
                    if (!this._isVertical()) {
                        this._range["css" ]( { width: ( 100 - val ) + "%" });
                    } 
                    else {
                        this._range["css" ]( { height: ( 100 - val ) + "%" });
                    }
                    break;

                case "range":

                    if (!this._isVertical() ) {
                        if (!this._isRTL()) {
                            if (document.getElementById(id)) {
                                var barLeft = parseInt(document.getElementById(id).style.left, 10);
                                this._range["css"]( { width: (val - barLeft ) + "%" });
                            }
                        }
                        else {
                            if (document.getElementById(id)) {
                                this._range["css"]( { left: val + "%" });
                                this._range["css"]( { width: (- val + 100 - thumb0Pct) + "%" });
                            }
                        }

                    } else {

                        if (document.getElementById(id)) {
                            this._range["css"]( { top: (100 - val) + "%" });
                            this._range["css"]( { height: (val - thumb0Pct) + "%" });
                        }
                    }

                    break;
                }
            }
        },

        _thumbEvents: {
            keydown: function( event ) {
                var curVal, newVal, step, tempVal,
                
                index = $( event.target ).data( "oj-slider-thumb-index" );
                this._thumbIndex = index;

                switch (event.keyCode) {
                case $.ui.keyCode.HOME:
                case $.ui.keyCode.END:
                case $.ui.keyCode.PAGE_UP:
                case $.ui.keyCode.PAGE_DOWN:
                case $.ui.keyCode.UP:
                case $.ui.keyCode.RIGHT:
                case $.ui.keyCode.DOWN:
                case $.ui.keyCode.LEFT:
                    event.preventDefault();
                    $( event.target ).addClass( "oj-active" );
                    break;
                }

                step = this.options.step;

                if (this._multipleThumbs) {
                    curVal = newVal = this._getMultiValues( index );
                } else {
                    curVal = newVal = this._getSingleValue();
                }

                switch (event.keyCode) {
                case $.ui.keyCode.HOME:
                    newVal = this._valueMin();
                    break;
                case $.ui.keyCode.END:
                    newVal = this._valueMax();
                    break;
                case $.ui.keyCode.PAGE_UP:
                    newVal = this._trimAlignValue(
                        curVal + ( ( this._valueMax() - this._valueMin() ) / this._numPages )
                    );
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    newVal = this._trimAlignValue(
                        curVal - ( (this._valueMax() - this._valueMin()) / this._numPages ) );
                    break;

                case $.ui.keyCode.UP:

                    // upArrow always increments the value
                    if (curVal === this._valueMax()) return;
                    tempVal = curVal + step;
                    newVal = this._trimAlignValue(tempVal);
                    break;

                case $.ui.keyCode.RIGHT:

                    if (!this._isRTL() || this._isVertical()) {
                        if (curVal === this._valueMax()) return;
                        tempVal = curVal + step;
                    }
                    else {
                        if (curVal === this._valueMin()) return;
                        tempVal = curVal - step;
                    }

                    newVal = this._trimAlignValue(tempVal);
                    break;

                case $.ui.keyCode.DOWN:

                    // Down arrow always decrements the value.
                    if (curVal === this._valueMin()) return;
                    tempVal = curVal - step;
                    newVal = this._trimAlignValue(tempVal);

                    break;

                case $.ui.keyCode.LEFT:

                    if (!this._isRTL() || this._isVertical()) {
                        if (curVal === this._valueMin()) return;
                        tempVal = curVal - step;
                    }
                    else {
                        if (curVal === this._valueMax()) return;
                        tempVal = curVal + step;
                        // console.log("horz key " + curVal + " -> " + tempVal + " " + step);
                    }

                    newVal = this._trimAlignValue(tempVal);
                    break;
                }

                this._slide( event, index, newVal );
            },
            keyup: function(event) {
                var index = $( event.target ).data( "oj-slider-thumb-index" );
                this._thumbIndex = index;

                this._change( event, index, false );
                    
                    $( event.target ).removeClass( "oj-active" );
                this._thumbIndex = null;

            }
        },

        // P R O T E C T E D    C O N S T A N T S   A N D   M E T H O D S

        // *********** START WIDGET FACTORY METHODS (they retain _camelcase naming convention) **********
        
        
        /**
          * Called at component create time primarily to initialize options, often using DOM values. This 
          * method is called before _ComponentCreate is called, so components that override this method 
          * should be aware that the component has not been rendered yet. The element DOM is available and 
          * can be relied on to retrieve any default values. <p> 
          * @param {!Object} originalDefaults - original default options defined on the widget and its ancestors
          * @param {?Object} constructorOptions - options passed into the widget constructor
          * 
          * @memberof oj.ojSlider
          * @instance
          * @protected
          */
        _InitOptions: function(originalDefaults, constructorOptions)
        {

            var opts = this.options;
            var self = this;

            this._superApply(arguments);
            var props = 
                [{attribute: "disabled", validateOption: true},
//                 {attribute: "placeholder"},
                 {attribute: "value"}, 

                 // 
                 // Once slider supports read-only, uncomment the following line.
                 // {attribute: "readonly", option: "readOnly", defaultOptionValue: false, validateOption: true},
                 // 

                 {attribute: "title"},
                 {attribute: "min"},
                 {attribute: "max"},
                 {attribute: "step"}];


            oj.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this,
                // post-process callback
                function (initializedOptions)
                { 
                    // coerce regardless of where the option value came from - dom/constructor
                    var toParse = ['value', 'step', 'min', 'max'];
                    
                    for (var i=0; i<toParse.length; i++)
                    {
                        var opt = toParse[i];
                        var value = (opt in initializedOptions) ? initializedOptions[opt] : opts[opt];
                        if (value != null)
                        {
                            if (opt === 'step')
                                initializedOptions[opt] =  self._parseStep(value);
                            else if (opt === 'min' || opt === 'max')
                                initializedOptions[opt] =  self._parse(opt, value);
                            else if (opt === 'value') {
                                if (Array.isArray(value))
                                    initializedOptions[opt] = value;
                                else 
                                    initializedOptions[opt] =  self._parse(opt, value);
                            }
                        } 
                    }
                }
            );

            
            if (opts['value'] === undefined)
            {
                throw new Error(this.getTranslatedString("noValue"));
            }
            
            // now make sure min < max, else throw an Error
            if (opts['min'] != null && opts['max'] != null)
            {
                if (opts['max'] < opts['min'])
                {
                    throw new Error(this.getTranslatedString("maxMin"));
                }
                
                // Make sure value is within min and max
                if (opts['value'] < opts['min'] || opts['value'] > opts['max']) {
                    throw new Error(this.getTranslatedString("valueRange"));
                }
            }
        },

        getNodeBySubId: function(locator)
        {
            if (locator == null)
            {
                return this.element ? this.element[0] : null;
            }
            
            var subId = locator['subId'];
            
            var thumbId;
            if (subId === "oj-slider-thumb-0") {
                return this.widget().find(".oj-slider-thumb")[0];
            }
            else if (subId === "oj-slider-thumb-1") {
                return this.widget().find(".oj-slider-thumb")[1];
            }
            else if (subId === "oj-slider-bar") {
                var barId = "#" + this._getBarBackgroundId();
                return this.widget().find("." + subId)[0];
            }
            else if (subId === "oj-slider-bar-value") {
                return this.widget().find("." + subId)[0];
            }
            
            // Non-null locators have to be handled by the component subclasses
            return null;
        },

        //** @inheritdoc */
        getSubIdByNode: function(node)
        {
            if (node != null) {
                if (node.id === this._getThumbId(0) && $(node).hasClass("oj-slider-thumb"))
                    return {'subId': 'oj-slider-thumb-0'};
                else if (node.id === this._getThumbId(1) && $(node).hasClass("oj-slider-thumb"))
                    return {'subId': 'oj-slider-thumb-1'};
                else if ($(node).hasClass("oj-slider-bar"))
                    return {'subId': 'oj-slider-bar'};
                else if ($(node).hasClass("oj-slider-bar-value"))
                    return {'subId': 'oj-slider-bar-value'};
            }

            return null;
        },

        // *********** END WIDGET FACTORY METHODS **********

        /**
         * Returns the default styleclass for the component.
         * 
         * @return {string}
         * @memberof oj.ojSlider
         * @override
         * @protected
         */
        _GetDefaultStyleClass: function()
        {
            return "oj-slider";
        },

        // The user can clear out min/max by setting the option to null, so we
        // do not coerce null.
        /**
         * @param {string} option name of the option. this will show up in the error if thrown
         * @param val value to parse
         * @throws {Error} if option value is invalid
         * @private
         */
        _parse: function(option, val)
        {
            var returnValue;
            if (val !== null)
                returnValue = +val;
            else
                returnValue = val;

            if (isNaN(returnValue))
                throw new Error(this.getTranslatedString("optionNum", {'option':option}));
            
            return returnValue;
        },
        /**
         * parse the step's value
         * We are following the behavior of HTML-5 the best we can. According
         * to the spec, it says step must be a number greater than 0. 
         * Chrome defaults it to 1 if it is not.
         * @throws {Error} if option value is invalid 
         * @private
         */
        _parseStep: function(val)
        {
            var defaultStep = 1, parsedStep;
            if (val === null)
                return defaultStep;
            parsedStep = this._parse("step", val);
            if (parsedStep <= 0)
            {
                // throw an exception
                throw new Error(this.getTranslatedString("invalidStep"));
            }
            // DEFAULT to 1 if it isn't > 0
            if (parsedStep === null || parsedStep <= 0)
                parsedStep = defaultStep;
            return parsedStep;
        },

        /////////////////////////////////////////////////////////////////////////////////////////
        //
        // Draggable - used to implement slider thumb dragging
        //
        // JQueryUI draggable is used to implement the dragging of slider thumbs.
        // Several draggable options are used:
        //
        // - Axis constaint
        //   The thumb is constrained to movement along the x-axis (for horizontal sliders)
        //   or movement along the y-axis (for vertical siders)
        //
        // - Range constraints
        //   The thumb is constrained to ranges along the axis using the draggable constraint 
        //   option. 
        //
        // - Step
        //   The granularity of movement is constrained to the step size using the grid 
        //   option.
        //
        /////////////////////////////////////////////////////////////////////////////////////////

        // return the endpoint of the bar
        _getEndInterval: function() {
            return (this._barback.offset().left + this._barback.width());
        },
            
        // return the startpoint of the bar
        _getStartInterval: function() {
            return (this._barback.offset().left);
        },
            

        // 
        // Set up the draggable with the context, thumb, and containment parameters.
        // Use the axis method to ensure only horizontal or vertical movement.
        // 
	_callDraggable: function(thumbParam) {

            var g = this._getGrid();
            var cachedStyle = thumbParam[0].style;

            var axisValue;
            if (!this._isVertical()) axisValue = "x";
            else axisValue = "y";

            var that = this;

            thumbParam.draggable({
                axis: axisValue,
                // grid: [8.8,1],
                grid: g,
                disabled: false,
		start: function( event, ui ) {

                    // 
                    // Set current thumb 
                    // 

                    if (thumbParam[0] == $(that._thumbs)[0])
                        that._thumbIndex = 0;
                    else if (thumbParam[0] == $(that._thumbs)[1])
                        that._thumbIndex = 1;

                    that._initDragging(event, thumbParam);
		},

		'drag': function( event, ui ) {

                    // 
                    // Compensate for a draggable bug.
                    // The bug causes the thumb to drift off axis (for some .css thumb sizes).
                    // The workaround address the problem by:
                    //   When the thumb travels along the x-axis (horizontal slider),
                    //   null out modifications made to top. 
                    // Handle this issue similarly for vertical sliders.
                    // 
                    var pos = ui.position;

                    if (!that._isVertical()) {
                        cachedStyle.top = "";
                        pos.top = "";
                    } else {
                        cachedStyle.left = "";
                        pos.left = "";
                    }

                    that._mouseDragInternal(event, thumbParam);

                    // 
                    // Enforce constraints (don't allow sliding past the end)
                    // 
                    if (!that._isVertical()) {

                        if (pos.left < 0) pos.left = 0;
                        if (pos.left > that._barback.width())
                            pos.left = that._barback.width();

                    } else {

                        if (pos.top < 0) pos.top = 0;
                        if (pos.top > that._barback.height())
                            pos.top = that._barback.height();
                    }

                    // 
                    // For range sliders, ensure that thumbs do not cross.
                    // 
                    if (that._multipleThumbs) {

                        var otherThumb;
                        // var thumb = that._getActiveThumb();

                        if (that._thumbIndex == 0) {
                            otherThumb = $(that._thumbs[1]);
                        } else {
                            otherThumb = $(that._thumbs[0]);
                        }

                        //
                        // parentLeft ensures that the offsets are calculated properly 
                        // for a slider embedded in a repositioned container (popup or dialog)
                        //
                        var pos1, pos2;
                        if (!that._isVertical()) {
                            var halfThumbWidth = thumbParam.outerWidth()/2;
                            var parentLeft = that._barback.offsetParent().offset().left;
                            pos1 = thumbParam.offset().left + halfThumbWidth - parentLeft;
                            pos2 = otherThumb.offset().left + halfThumbWidth - parentLeft;
                        } else {
                            var halfThumbHeight = thumbParam.outerHeight()/2;
                            var parentTop = that._barback.offsetParent().offset().top;
                            pos1 = thumbParam.offset().top + halfThumbHeight - parentTop;
                            pos2 = otherThumb.offset().top + halfThumbHeight - parentTop;
                        }

                        if (that._thumbIndex == 0) {
                            if (!that._isVertical()) {
                                if (!that._isRTL()) {
                                    if (pos.left > pos2) pos.left = pos2;
                                } else {
                                    if (pos.left < pos2) pos.left = pos2;
                                }
                            } else {
                                if (pos.top < pos2) pos.top = pos2;
                            }
                        }
                        else {
                            if (!that._isVertical()) {
                                if (!that._isRTL()) {
                                    if (pos.left < pos2) pos.left = pos2;
                                } else {
                                    if (pos.left > pos2) pos.left = pos2;
                                }
                            } else {
                                if (pos.top > pos2) pos.top = pos2;
                            }
                        }
                    }
	        },

		stop: function( event, ui ) {

                    //
                    // compensate for a firefox draggable bug.
                    // without this code, thumbs with larger active sizes become oval on stop.
                    // 
                    this.style.width = "";
                    this.style.height = "";

                    that._mouseStop(event, thumbParam);
		}
	    });
        },

        //
        // Setup the draggable for each of the thumbs.
        //
	_makeDraggable: function() {

            // Do not allow dragging on a disabled thumb.
            if (this.options.disabled) return;

            // console.log("_makeDraggable");

            if (this._multipleThumbs) {
                this._thumbs.toArray().forEach (

                    function(current, i) {
                        var thumb = $(current);
	                this._callDraggable(thumb);
                    },
                    this
                );

            } else {
	        this._callDraggable(this._thumb);
            }
	},

        // 
        // Call this if we change option to disabled.
        // 
	_disableDraggable: function() {

            if (this._multipleThumbs) {
                this._thumbs.toArray().forEach (

                    function(current, i) {
                        var thumb = $(current);
                        if (thumb.is('.ui-draggable'))
                            thumb['draggable']("disable");
                    },
                    this
                );

            } else {
                if (this._thumb.is('.ui-draggable'))
                    this._thumb.draggable("disable");
            }
	}

        /////////////////////////////////////////////////////////////////////////////////////////
        // Draggable - end
        /////////////////////////////////////////////////////////////////////////////////////////


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
 *       <td>Slider Bar</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Reposition the thumb.</td>
 *     </tr>
 *     <tr>
 *       <td>Slider Thumb</td>
 *       <td><kbd>Swipe</kbd></td>
 *       <td>Reposition the thumb.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojSlider
 */

/**
 * The JET slider supports keyboard actions for thumb movement:
 *
 * <p>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Use</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td> Places focus on the slider component.
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Scrolls right on a horizontal slider, scrolls up on a vertical slider.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Scrolls left on a horizontal slider, scrolls down on a vertical slider.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Scrolls right on a horizontal slider, scrolls up on a vertical slider.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Scrolls left on a horizontal slider, scrolls down on a vertical slider.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Scrolls one page right on a horizontal slider, scrolls one page up on a vertical slider. <br>
 *       A page is defined as 20% of the range of the slider.
 *     </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Scrolls one page left on a horizontal slider, scrolls one page down on a vertical slider.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>End</kbd></td>
 *       <td>Scrolls to the right end on a horizontal slider, scrolls to the bottom on a vertical slider.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Home</kbd></td>
 *       <td>Scrolls to the left end on a horizontal slider, scrolls to the top on a vertical slider.
 *       </td>
 *     </tr>
 * </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojSlider
 *
 */

//////////////////     SUB-IDS     //////////////////

 /**
  * <p>Sub-ID for the slider thumb. Use this id to access the thumb of a single-thumbed slider, or the first thumb (associated with the lowest value) of a range slider. </p>
  *
  * @ojsubid oj-slider-thumb-0
  * @memberof oj.ojSlider
  *
  * @example <caption>Get the node for the slider thumb:</caption>
  * var node = $( ".selector" ).ojSlider( "getNodeBySubId", {'subId': 'oj-slider-thumb-0'} );
  *
  */

 /**
  * <p>Sub-ID for the second slider thumb. Use this id to access the second thumb (associated with the highest value) of a range slider. </p>
  *
  * @ojsubid oj-slider-thumb-1
  * @memberof oj.ojSlider
  *
  * @example <caption>Get the node for the slider thumb:</caption>
  * var node = $( ".selector" ).ojSlider( "getNodeBySubId", {'subId': 'oj-slider-thumb-1'} );
  *
  */

 /**
  * <p>Sub-ID for the slider bar. </p>
  *
  * @ojsubid oj-slider-bar
  * @memberof oj.ojSlider
  *
  * @example <caption>Get the node for the slider bar:</caption>
  * var node = $( ".selector" ).ojSlider( "getNodeBySubId", {'subId': 'oj-slider-bar'} );
  *
  */

 /**
  * <p>Sub-ID for the slider bar value. </p>
  *
  * @ojsubid oj-slider-bar-value
  * @memberof oj.ojSlider
  *
  * @example <caption>Get the node for the slider bar value:</caption>
  * var node = $( ".selector" ).ojSlider( "getNodeBySubId", {'subId': 'oj-slider-bar-value'} );
  *
  */

    });

}() );
});
