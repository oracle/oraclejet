/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
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

 
/**
 * @ojcomponent oj.ojProgressbar
 * @augments oj.baseComponent
 * @classdesc
 * The ojProgressbar component allows a user to display progress of an input in a rectangular horizontal meter. 
 * If a developer does not wish to display the exact value, a value of '-1' can be passed in to display an indeterminate value.
 *
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
 *
 * <p>If this component is being used to describe the loading process of a particular region of a page, then the <code class="prettyprint">aria-describedby</code> 
 *    attribute must point to the id of the progressbar and <code class="prettyprint">aria-busy = "true"</code> must be added to the region until the loading is complete.</p>
 *
 *
 * <h3 id="markup-section">
 *   HTML Markup and Style Classes
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#markup-section"></a>
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
 *       <td> oj-progressbar-start-label</td>
 *       <td> Optional class that can be passed into a seperate div containing the start text to display underneath the progressbar. </td>
 *     </tr>
  *    <tr>
 *       <td>oj-progressbar-end-label</td>
 *       <td> Optional class that can be passed into a seperate div containing the end text to display underneath the progressbar. </td>
 *     </tr>
 *     <tr>
 *       <td>oj-progressbar-embedded</td>
 *       <td> Optional class that can be passed into a progressbar div to style an embedded progressbar within a web application or dialog.</td>
 *       <td><code><pre>
 * 	    &lt;div class="oj-web-applayout-page">
 *  	      &lt;header class="oj-web-applayout-header">
 *  	      &lt;/header>
 *  	      &lt;div class="oj-progressbar-embedded" data-bind="ojComponent:{component: 'ojProgressbar', value: loadingValue}">
 *  	      &lt;/div>
 * 	    &lt;/div>
 *        </pre></code></td>
 *      </tr>
 *   </tbody>
 * </table>
 *
 *
 * @example <caption>Initialize component using widget API</caption>
 * &lt;div id="progressBar"/&gt;<br/>
 * $("#progressBar").ojProgressbar({'value': loadValue, 'max':100});
 * @example <caption>Using knockout, value bind to observables - loadValue</caption> 
 * &lt;div id="progressBar" data-bind="ojComponent: {role: 'ojProgressbar', value: loadValue, max:100}"/&gt;
 * 
 */
(function() {
   /*
	* <h3 id="markup-section">
    *   HTML Markup and Style Classes
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#markup-section"></a>
    * </h3>
    *
    * <p>To create the start label for the progressbar wrap the start label text in a div with the  <code class="prettyprint"> oj-progressbar-start-label </code> class. </p>
	*
	* <p>To create the end label for the progressbar wrap the end label text in a div with the  <code class="prettyprint"> oj-progressbar-end-label </code> class. </p>
    *
	*/
oj.__registerWidget("oj.ojProgressbar",  $['oj']['baseComponent'], {
	version: "1.0.0",
	defaultElement : "<div>", 
    widgetEventPrefix : "oj", 
	options: {
		/** 
		 * The maximum allowed value. The element's max attribute is used if it 
		 * is provided, otherwise the default value of 100 is used. 
		 * @expose 
		 * @public
		 * @instance
		 * @memberof! oj.ojProgressbar 
		 * @default <code class="prettyprint">100</code>
		 */
		max: 100,
		/** 
		 * The value of the progressbar. The element's value attribute is used if it 
		 * is provided, otherwise the default value of 0 is used. For indeterminate progressbar, set value to -1.
		 * @expose 
		 * @public
		 * @instance
		 * @memberof! oj.ojProgressbar 
		 * @default <code class="prettyprint">0</code>
		 */
		value: 0,
		/** 
		 * If disbled is set to true, then the progressbar will not change if a new value is passed in.
		 * By default this parameter is set to false.
		 * @expose 
		 * @public
		 * @instance
		 * @memberof! oj.ojProgressbar 
		 * @default <code class="prettyprint">false</code>
		 */
		disabled: false
		
	},
    // The min value is a constant and 0 is the value set for it.
	min: 0,
	
	 /** 
	   * Variable used to indicate that the value is indeterminate
	   *
	   * @override
	   * @private
	   */
	_indeterminate: false,
	
	_ComponentCreate: function() {
		this._super();
                
		// Constrain initial value
		this.oldValue = this.options.value = this._constrainedValue();

		this.element
			.addClass( "oj-progressbar" )
			.attr({
				// Only set static values, aria-valuenow and aria-valuemax are
				// set inside _refreshValue()
				"role": "progressbar",
				"aria-valuemin": this.min
			});
        
		this.valueDiv = $( "<div class='oj-progressbar-value'></div>" )
			.appendTo( this.element ); // @HTMLUpdateOK

		this._refreshValue();
	},
	
  
  _InitOptions : function (originalDefaults, constructorOptions)
  {
    var element = this.element;
    
    this._super(originalDefaults, constructorOptions);
    
    if (constructorOptions['max'] === undefined)
    {
      // get from dom. if still undefined, get from originalDefaults.
      var dom = element.attr("max") || undefined;
      if (dom != null)
        this.options['max'] = dom;
    }
  },
	
  /**
   * Check that value is valid and within the correct bounds. A value of -1 indicates an indeterminate value.
   * @param {number} newValue - The new value of the progressbar being passed in.
   * @override
   * @private
   */
	_constrainedValue: function( newValue ) {
		if ( newValue === undefined ) {
			newValue = this.options.value;
		}
		
        // Indicates that the value is indeterminate.
		this._indeterminate = (newValue == -1 );

		// sanitize value
		if ( typeof newValue !== "number" ) {
			newValue = isNaN(newValue) ? 0 : Number(newValue);

		}

		return this._indeterminate ? -1 :
			Math.min( this.options.max, Math.max( this.min, newValue ) );
	},
  /**
   * Set the value
   * @param {Object} options - The options being set
   * @override
   * @private
   */
	_setOptions: function( options, flags ) {
		// Ensure "value" option is set after other values (like max)
		var value = options.value;
		delete options.value;

		this._super( options, flags );
		if( !this.options.disabled) {
		    this.options.value = this._constrainedValue( value );
		    this._refreshValue();
		}
	},

   /**
   * Check that the max value is not less than the min 
   * @param {string} key - The key for the option being set
   * @param {string|number} value - The value being set
   * @override
   * @private
   */
	_setOption: function( key, value, flags ) {
		if ( key === "max" ) {
			// Don't allow a max less than min
			value = Math.max( this.min, value );
		}

		this._super( key, value, flags );
	},
  /**
   * Calculates the percentage of the progressbar that has been loaded based on min, max, and value.
   *
   * @override
   * @private
   */
	_percentage: function() {
		return this._indeterminate ? 100 : 100 * ( this.options.value - this.min ) / ( this.options.max - this.min );
	},

   /**
    * This function is used to update the value when the value has changed.
    *
    * @override
    * @private
    */
	_refreshValue: function() {
		var value = this.options.value,
			percentage = this._percentage();

		this.valueDiv
			.toggle( this._indeterminate || value > this.min )
			.width( percentage.toFixed(0) + "%" );

		this.element.toggleClass( "oj-progressbar-indeterminate", this._indeterminate );


		if ( this._indeterminate) {
			this.element.attr({
				"aria-valuetext": "In Progress"
			});
			this.element.removeAttr( "aria-valuenow" );
			this.element.removeAttr( "aria-valuemin" );
			this.element.removeAttr( "aria-valuemax" );
			if ( !this.overlayDiv ) {
				this.overlayDiv = $( "<div class='oj-progressbar-overlay'></div>" ).appendTo( this.valueDiv ); // @HTMLUpdateOK
			    this.overlayDiv.addClass("oj-indeterminate");
			}
		} else {
			this.element.attr({
				"aria-valuemax": this.options.max,
				"aria-valuenow": value
			});
			if ( this.overlayDiv ) {
				this.overlayDiv.remove();
				this.overlayDiv = null;
			}
		}
	},
	
   /**
    * Overide the destory function to remove appropriate class and attributes.
    *
    * @override
    * @private
    */	
	_destroy: function() {
		this.element
			.removeClass( "oj-progressbar" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();
		this._super();
	}
	
// Fragments:

	/**
     * <p>This component has no touch interaction.  </p>
	 *
	 *
	 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
	 * @memberof oj.ojProgressbar
	 */

	/**
     * <p>This component has no keyboard interaction.  </p>
	 *
	 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
	 * @memberof oj.ojProgressbar
	 */
});

}( ));
(function() {
var ojProgressbarMeta = {
  "properties": {
    "disabled": {},
    "max": {},
    "value": {}
  },
  "methods": {},
  "extension": {
    "_widgetName": "ojProgressbar"
  }
};
oj.Components.registerMetadata('ojProgressbar', 'baseComponent', ojProgressbarMeta);
oj.Components.register('oj-progressbar', oj.Components.getMetadata('ojProgressbar'));
})();
});
