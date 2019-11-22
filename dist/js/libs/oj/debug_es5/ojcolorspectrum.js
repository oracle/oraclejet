/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojcolor', 'ojs/ojlogger', 'ojs/ojlabelledbyutils', 'ojs/ojslider', 'jqueryui-amd/widgets/draggable', 'ojs/ojtouchproxy', 'ojs/ojeditablevalue'],
       function(oj, $, Components, Color, Logger, LabelledByUtils)
{
  "use strict";
var __oj_color_spectrum_metadata = 
{
  "properties": {
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "converterHint": {
          "type": "Array<string>|string",
          "value": [
            "placeholder",
            "notewindow"
          ]
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string",
          "value": [
            "inline"
          ]
        },
        "validatorHint": {
          "type": "Array<string>|string",
          "enumValues": [
            "none",
            "notewindow"
          ],
          "value": [
            "notewindow"
          ]
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "value": ""
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "none",
        "provided"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "labelledBy": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "transientValue": {
      "type": "object",
      "writeback": true,
      "readOnly": true
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "labelHue": {
          "type": "string"
        },
        "labelOpacity": {
          "type": "string"
        },
        "labelSatLum": {
          "type": "string"
        },
        "labelThumbDesc": {
          "type": "string"
        }
      }
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "value": {
      "type": "object",
      "writeback": true
    }
  },
  "methods": {
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "refresh": {},
    "reset": {},
    "showMessages": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {}
  },
  "extension": {}
};


/*----------------------------------------------------------------
   ojColorSpectrum    JET Color (spectrum) element
   Depends:   jquery.ui.core.js
              jquery.ui.widget.js
------------------------------------------------------------------*/

/* global Color:false, Logger:false, LabelledByUtils:false */
(function () {
  /*
  function debugObj(o)  {
    var s ;
    try { s = JSON.stringify(o) ; }
    catch (e) { s = "ERROR";}
    return s ;
  };
  */
  //  ojColorSpectrum class names
  var OJES_SPECTRUM = 'oj-colorspectrum-spectrum';
  var OJES_THUMB = 'oj-colorspectrum-thumb';
  var OJES_DISABLED = 'oj-disabled'; // Misc translation keys

  var TRANSKEY_HUE = 'labelHue';
  var TRANSKEY_OPACITY = 'labelOpacity';
  var TRANSKEY_THUMB_DESC = 'labelThumbDesc';
  /**
   * Returns an array of Hue, Saturation, Luminance, and Alpha from an oj.Color
   * @private
   * @param   {oj.Color}  color    The color to be converted.
   * @return  {Array}   The HSLA representation [h, s, l, a]
   */

  function _getHslFromRgb(color) {
    var hsl = _rgbToHsl(color.getRed(), color.getGreen(), color.getBlue());

    hsl[0] *= 360; // hsl was returned in [0,1] so transform into

    hsl[1] *= 100; // [0,360] for hue, and [0,100] for

    hsl[2] *= 100; // saturation/luminance

    hsl.push(color.getAlpha());
    return hsl;
  }
  /**
   * Converts an RGB color value to HSL. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h, s, and l in the set [0, 1].
   * @private
   * @param   {number}  r       The red color value
   * @param   {number}  g       The green color value
   * @param   {number}  b       The blue color value
   * @return  {Array}   The HSL representation [h, s, l]
   */


  function _rgbToHsl(r, g, b) {
    // eslint-disable-next-line no-param-reassign
    r /= 255; // eslint-disable-next-line no-param-reassign

    g /= 255; // eslint-disable-next-line no-param-reassign

    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var l = (max + min) / 2;

    if (max === min) {
      // achromatic
      h = 0;
      s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;

        default:
          break;
      }

      h /= 6;
    }

    return [h, s, l];
  }
  /**
   * @ojcomponent oj.ojColorSpectrum
   * @augments oj.editableValue
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojColorSpectrum extends editableValue<oj.Color, ojColorSpectrumSettableProperties>"
   *               },
   *               {
   *                target: "Type",
   *                value: "ojColorSpectrumSettableProperties extends editableValueSettableProperties<oj.Color>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 3.0.0
   *
   * @class oj.ojColorSpectrum
   * @ojimportmembers oj.ojDisplayOptions
   * @ojtsimport {module: "ojcolor", type: "AMD", importName: "Color"}
   * @ojshortdesc A color spectrum allows a custom color value to be specified from a display containing a saturation/luminosity spectrum, plus hue and opacity sliders.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "disabled"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 4
   * @ojvbmincolumns 4
   *
   * @classdesc
   * <h3 id="colorSpectrumOverview-section">
   *   JET Color Spectrum
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#colorSpectrumOverview-section"></a>
   * </h3>
   *
   * The JET Color Spectrum element allows a custom color value to be retrieved from a display
   * containing a saturation/luminosity spectrum, and hue and opacity sliders.
   * <pre class="prettyprint">
   * <code>&lt;oj-color-spectrum value="{{colorValue}}">
   * &lt;/oj-color-spectrum>
   * </code></pre>
   * {@ojinclude "name":"validationAndMessagingDoc"}
   *
   * <h3 id="touch-section">
   *   Touch End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"touchDoc"}
   * </p></br>
   *
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"keyboardDoc"}
   * </br>
   *
   *
   */


  oj.__registerWidget('oj.ojColorSpectrum', $.oj.editableValue, {
    widgetEventPrefix: 'oj',
    defaultElement: '<input>',
    options: {
      /**
       * Labelled-by is used to establish a relationship between this and another element.
       * A common use is to tie the oj-label and the oj-color-spectrum together for accessibility.
       * The oj-label custom element has an id, and you use the labelled-by attribute
       * to tie the two elements together to facilitate correct screen reader behavior.
       *
       * @ojshortdesc Used to establish a relationship between this element and another element.
       *
       * @example <caption>Initialize the color spectrum with the <code class="prettyprint">labelled-by</code> attribute specified:</caption>
       * &ltoj-label id="labelId">Name:&lt/oj-label>
       * &ltoj-color-spectrum labelled-by="labelId">&lt;/oj-color-spectrum>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property, after initialization:</caption>
       * // getter
       * var labelledBy = myColorSpectrum.labelledBy;
       *
       * // setter
       * myColorSpectrum.labelledBy = "labelId";
       *
       * @expose
       * @type {?string}
       * @default null
       * @instance
       * @memberof oj.ojColorSpectrum
       */
      labelledBy: null,

      /**
       * The value of the element representing the current color.
       * @member
       * @type {Object}
       * @ojsignature {target:"Type", value:"oj.Color", jsdocOverride:true}
       * @ojformat color
       * @default null
       * @ojwriteback
       * @expose
       * @instance
       * @ojeventgroup common
       * @memberof oj.ojColorSpectrum
       * @ojshortdesc Specifies the value of the element representing the current color.
       * @example <caption>Initialize the color spectrum with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &ltoj-color-spectrum value='{{myColor}}'>&lt;/oj-color-spectrum>
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> property, after initialization:</caption>
       * // getter
       * var color = myColorSpectrum.value;
       *
       * // setter
       * myColorSpectrum.value = new oj.Color('rgb(0,0,0)');
       * </code>
       */
      value: null,

      /**
       * The <code class="prettyprint">transient-value</code> is the read-only attribute for retrieving the
       * transient value of the color spectrum.<p>
       * The <code class="prettyprint">transient-value</code> updates to display the transient
       * changes of the spectrum thumb, and the hue and opacity sliders. The difference in behavior
       * between the <code class="prettyprint">transient-value</code> and <code class="prettyprint">value</code>
       * is that <code class="prettyprint">transient-value</code> will be updated as the spectrum thumb or
       * hue/opacity sliders are moved, whereas the <code class="prettyprint">value</code> attribute is
       * updated only after the respective thumb is released (or after a key press).
       * </p>
       * @ojshortdesc Retrieves the transient value of the component.
       * @alias transientValue
       * @member
       * @ojformat color
       * @type {Object}
       * @ojsignature {target:"Type", value:"oj.Color", jsdocOverride:true}
       * @expose
       * @instance
       * @memberof oj.ojColorSpectrum
       * @readonly
       * @ojwriteback
       * @since 4.2.0
       *
       */
      rawValue: null
    },
    // end options
    //* * @inheritdoc */
    getNodeBySubId: function getNodeBySubId(locator) {
      if (locator === null) {
        return this.element ? this.element[0] : null;
      }

      var subId = locator.subId;

      var ret = this._super(locator);

      if (!ret) {
        switch (subId) {
          case 'oj-spectrum':
            ret = this._$spectrum[0];
            break;

          case 'oj-spectrum-thumb':
            ret = this._$spectrumThumb[0];
            break;

          case 'oj-hue-slider-bar':
            ret = this._$hueSlider.ojSlider('getNodeBySubId', {
              subId: 'oj-slider-bar'
            });
            break;

          case 'oj-hue-slider-bar-value':
            ret = this._$hueSlider.ojSlider('getNodeBySubId', {
              subId: 'oj-slider-bar-value'
            });
            break;

          case 'oj-hue-slider-thumb':
            ret = this._$hueSlider.ojSlider('getNodeBySubId', {
              subId: 'oj-slider-thumb-0'
            });
            break;

          case 'oj-opacity-slider-bar':
            ret = this._$alphaSlider.ojSlider('getNodeBySubId', {
              subId: 'oj-slider-bar'
            });
            break;

          case 'oj-opacity-slider-bar-value':
            ret = this._$alphaSlider.ojSlider('getNodeBySubId', {
              subId: 'oj-slider-bar-value'
            });
            break;

          case 'oj-opacity-slider-thumb':
            ret = this._$alphaSlider.ojSlider('getNodeBySubId', {
              subId: 'oj-slider-thumb-0'
            });
            break;

          default:
            break;
        }
      }

      return ret;
    },
    //* * @inheritdoc */
    getSubIdByNode: function getSubIdByNode(elem) {
      if (!elem) {
        return null;
      }

      var $node = $(elem);
      var subId = null;
      var $ancestor;
      var sliderType;

      if ($node.hasClass(OJES_SPECTRUM)) {
        subId = 'oj-spectrum';
      } else if ($node.hasClass(OJES_THUMB)) {
        subId = 'oj-spectrum-thumb';
      } else {
        $ancestor = $node.closest('.oj-slider');
        sliderType = $ancestor.hasClass('oj-slider-vertical') ? 'hue' : 'opacity';

        if ($node.hasClass('oj-slider-bar')) {
          // This is no longer correct because of fix for  - unused css class in ojslider #slider-id-barback node
          // sliderType = $node.hasClass('oj-slider-vertical')? "hue" : "opacity" ;
          subId = 'oj-' + sliderType + '-slider-bar';
        } else if ($node.hasClass('oj-slider-bar-value')) {
          subId = 'oj-' + sliderType + '-slider-bar-value';
        } else if ($node.hasClass('oj-slider-thumb')) {
          subId = 'oj-' + sliderType + '-slider-thumb';
        }
      }

      if (subId != null) {
        return {
          subId: subId
        };
      }

      return this._super(elem);
    },

    /**
     * Destroy the Color Spectrum component
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @override
     * @protected
     */
    _destroy: function _destroy() {
      if (this._$boundElem) {
        this._clearListeners();

        this._destroySliders();

        this._removeMarkup(); // remove our markup from dom


        this._$boundElem.removeClass('oj-colorspectrum');

        this._clear();
      }

      this._super();
    },

    /**
     * Called the first time the widget is called on an element.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _ComponentCreate: function _ComponentCreate() {
      this._super();

      this._initEditor();
    },

    /**
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _AfterCreate: function _AfterCreate() {
      var label;

      this._super();

      this._updateLabelledBy(this.element[0], null, this.options.labelledBy, this._$spectrumThumb); // custom element's use oj-label.


      if (!this._IsCustomElement()) {
        label = this._GetLabelElement();
      } // Apply the label to the thumb


      if (label) {
        // Set the aria-labelledby attribute of the thumb to the returned id
        var labelId = label.attr('id');

        if (!labelId) {
          Logger.warn('JET Color Spectrum: The label for this component needs an id in order ' + 'to be accessible');
        } else {
          this._$spectrumThumb.attr('aria-labelledby', labelId);
        }
      } else {
        // Check if the element has aria-label
        var ariaLabelString = this.element.attr('aria-label');

        if (ariaLabelString) {
          // Set the aria-label of the thumb to the returned string
          this._$spectrumThumb.attr('aria-label', ariaLabelString);
        }
      }
    },

    /**
     * Handle an option change.
     * Called by $(selector).ojColorSpectrum("option", "prop", value)
     * @param {string}   key
     * @param {string | oj.Color | boolean}   newval
     * @param {Object}   flags
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setOption: function _setOption(key, newval, flags) {
      var originalValue = this.options.labelledBy;

      switch (key) {
        case 'value':
          this._setOptValue(newval);

          break;

        case 'disabled':
          this._setOptDisabled(newval, true);

          break;

        case 'labelledBy':
          // remove the old one and add the new one
          this._updateLabelledBy(this.element[0], originalValue, newval, this._$spectrumThumb);

          break;

        default:
          break;
      }

      this._super(key, newval, flags);
    },

    /**
     * Catch the string rawValue/transientValue sent by editableValue, convert to oj.Color and
     * change the rawValue/transientValue option.
     * @param {oj.Color} val
     * @param {Event} event
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @override
     * @private
     */
    _SetRawValue: function _SetRawValue(val, event) {
      var _val = val;

      if (typeof val === 'string') {
        try {
          _val = new Color(val);
        } catch (e) {
          Logger.error("ojColorSpectrum (id='" + this.element.attr('id') + "'): invalid " + this._transientValueName + ' (' + val + '), defaulting to black');
          _val = Color.BLACK;
        }
      }

      var flags = {};
      flags._context = {
        originalEvent: event,
        writeback: true,
        internalSet: true,
        readOnly: true
      };

      if (!this._comparedRoundedColor(this.options[this._transientValueName], _val)) {
        this.option(this._transientValueName, _val, flags);
      }
    },

    /**
     * If custom element, get the labelledBy option, and set this
     * onto the root dom element as aria-labelledby. We append "|label" so it matches the id that
     * is on the oj-label's label element.
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _updateLabelledBy: LabelledByUtils._updateLabelledBy,

    /**
     * @memberof oj.ojColorSpectrum
     * @param {oj.Color} val1
     * @param {oj.Color} val2
     * @returns {boolean} true if rounded colors match, else false.
     * @private
     * @instance
     */
    _comparedRoundedColor: function _comparedRoundedColor(val1, val2) {
      var ret = val1.getRed() === val2.getRed() && val1.getGreen() === val2.getGreen() && val1.getBlue() === val2.getBlue() && val1.getAlpha() === val2.getAlpha();
      return ret;
    },

    /**
     * Compares two color values (oj.Colors)
     * @param {oj.Color}  color1   a color object to compare.
     * @param {oj.Color}  color2   a color object to compare.
     * @returns {boolean}  true    if colors match, else false.
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _compareColorValues: function _compareColorValues(color1, color2) {
      var t1 = color1 instanceof Color;
      var t2 = color2 instanceof Color;
      return t1 && t2 && color1.isEqual(color2);
    },

    /**
     * Handle "disabled" option change.
     * @param {boolean} disabled True if the component is disabled, false if enabled.
     * @param {boolean} applyOnlyIfDifferent Only apply the new value if it's different from the
     *        current value.
     * @returns {boolean}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setOptDisabled: function _setOptDisabled(disabled, applyOnlyIfDifferent) {
      var change = !applyOnlyIfDifferent || applyOnlyIfDifferent && disabled !== this._disabled;

      if (change) {
        this._enableSliders(!disabled);

        if (disabled) {
          this.element.addClass(OJES_DISABLED);

          this._makeThumbDraggable(false);
        } else {
          this.element.removeClass(OJES_DISABLED);

          this._makeThumbDraggable(true);
        }

        this._disabled = disabled;
      }

      return change;
    },

    /**
     * Handle "value" option change on the component.
     * @param {oj.Color}  color   the new color to apply.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setOptValue: function _setOptValue(color) {
      if (color instanceof Color) {
        // Check if value has changed
        if (!this._compareColorValues(this._value, color)) {
          // Color is different from current
          this._setColorVals(color); // note the new color


          this._setSliderValue(this._hueVal, true);

          this._setSliderValue(this._alphaVal, false);

          this._setSpectrumHue(this._hueVal, this._satVal, this._lumVal, this._alphaVal, true);
        }
      }
    },

    /**
     * Handle slider option change.
     * @param {Event} e  the associated event.
     * @param {Object} ui
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _onSliderOptionChange: function _onSliderOptionChange(e, ui) {
      var newColor;
      var hue;
      var sat;
      var lum;
      var alpha;
      var isHueSlider;
      var isAlphaSlider;
      var $targ;

      if (!this._sliderSetup) {
        return;
      }

      if (ui.option !== 'rawValue' && ui.option !== 'value' || ui.value === undefined) {
        return;
      } // Slider  workround - originalEvent is missing on rawValue,
      // but is set on previous "value"


      if (ui.option === 'value') {
        this._isOrigEvent = !!e.originalEvent; // set for following rawValue event
      }

      $targ = $(e.target);
      isHueSlider = $targ.hasClass('oj-colorspectrum-hue');
      isAlphaSlider = $targ.hasClass('oj-colorspectrum-alpha');

      if (!isHueSlider && !isAlphaSlider) {
        return;
      } // Get existing values


      hue = this._hueVal;
      sat = this._satVal;
      lum = this._lumVal;
      alpha = this._alphaVal;

      if (isHueSlider) {
        hue = ui.value; //  Update alpha slider gradient

        this._updateAlphaBG(hue, sat, lum); // Update the spectrum


        this._setSpectrumHue(hue, sat, lum, alpha, false);
      } else {
        // Alpha slider
        alpha = ui.value;

        this._setAriaText(hue, sat, lum, alpha);
      } // Fire value optionChange event


      newColor = new Color({
        h: hue,
        s: sat,
        l: lum,
        a: alpha
      }); // If optionChange is fired because of direct user action on the slider,
      // then need to tell the Spectrum component which will also fire an
      // optionChange for the app listener.

      if (e.originalEvent || this._isOrigEvent) {
        this._isOrigEvent = false; // TDO - remove when slider  fixed

        if (ui.option === 'rawValue') {
          this._SetRawValue(newColor, e);
        } else if (ui.option === 'value') {
          this._SetValue(newColor, e);
        }
      }

      this._setColorVals(newColor);
    },

    /**
     * Set a slider value
     * @param {number} value  the value to be applied to a slider
     * @param {boolean} isHue true if the hue slider should be updated,
     *                        or false for the alpha aslider.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setSliderValue: function _setSliderValue(value, isHue) {
      var $targ = isHue ? this._$hueSlider : this._$alphaSlider;
      $targ.ojSlider('option', 'value', value);
    },

    /**
     * Apply the hue to the spectrum, and optionally moves the spectrum thumb.
     * @param {number}  hue   hue value in [0,360].
     * @param {number}  sat   saturation value in [1, 100].
     * @param {number}  lum   luminosity value in [1,100].
     * @param {number}  alpha alpha value
     * @param {boolean=}  moveThumb  if true the spectrum thumb is also moved.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setSpectrumHue: function _setSpectrumHue(hue, sat, lum, alpha, moveThumb) {
      var color = 'hsl(' + hue + ', 100%, 50%)';

      this._$spectrum.css('background-color', color);

      if (moveThumb) {
        var pos = this._getSatLumSpectrumPosition(sat, lum);

        this._setThumbPosition(pos.x, pos.y);
      }

      this._setAriaText(hue, sat, lum, alpha);
    },

    /**
     * Apply a mask to the spectrum so that the current hue is displayed showing combined
     * saturation and luminosity gradients.
     * http://stackoverflow.com/questions/17224383/generate-a-saturation-brightness-mask-using-gradients
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setSpectrumMask: function _setSpectrumMask() {
      var grad = ' -___-linear-gradient(top, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0) 50%, hsla(0, 0%, 0%, 0) 50%, hsl(0, 0%, 0%) 100%), -___-linear-gradient(left, hsl(0, 0%, 50%) 0%, hsla(0, 0%, 50%, 0) 100%)';
      var ai = oj.AgentUtils.getAgentInfo();
      var rep;

      switch (ai.browser) {
        case oj.AgentUtils.BROWSER.FIREFOX:
          rep = 'moz';
          break;

        case oj.AgentUtils.BROWSER.CHROME:
        case oj.AgentUtils.BROWSER.SAFARI:
        case oj.AgentUtils.BROWSER.EDGE_CHROMIUM:
        default:
          rep = 'webkit';
          break;

        case oj.AgentUtils.BROWSER.IE:
          rep = 'ms';
          break;
      }

      grad = ' -___-linear-gradient(top, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0) 50%, hsla(0, 0%, 0%, 0) 50%, hsl(0, 0%, 0%) 100%), -___-linear-gradient(left, hsl(0, 0%, 50%) 0%, hsla(0, 0%, 50%, 0) 100%)';
      grad = grad.replace(/___/g, rep);

      this._$spectrum.css('backgroundImage', grad);
    },

    /**
     * Updates the thumb's current (x,y) position relative to the spectrum top left. Note this does not
     * move the thumb - refer to _moveThumb().
     * @param {number} x  the x displacement into the spectrum.  If NaN the value is ignored.
     * @param {number} y  the y displacement into the spectrum.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setThumbPosition: function _setThumbPosition(x, y) {
      // y can never be NaN
      // x is only NaN from _keyDown() function
      if (!isNaN(x)) {
        this._xThumb = x;
      }

      this._yThumb = y;

      this._moveThumb(0, 0);
    },

    /**
     * Returns the thumb center's displacement into the spectrum for the
     * given saturation and luminosity values.
     * @param {number}  sat   saturation value in [1, 100].
     * @param {number}  lum   luminosity value in [1,100].
     * @returns {Object}  Object containing {x: , y:} where x and y are displacements
     *                    into the spectrum div.
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _getSatLumSpectrumPosition: function _getSatLumSpectrumPosition(sat, lum) {
      var satPos = Math.min(sat / 100 * this._spectrumWidth, this._spectrumWidth);
      var lumPos = this._spectrumHeight - Math.min(lum / 100 * this._spectrumHeight, this._spectrumHeight);
      return {
        x: Math.round(satPos),
        y: Math.round(lumPos)
      };
    },
    //
    //  *  Contrast is currently created by using a drop shadow on the thumb.
    //  *  Set the thumb to a contrasting color so that it does not become hard to
    //  *  see when over very light parts of the spectrum.
    //  *  @param {number} hue  the hue value.
    //  *  @param {number} sat  the saturation value in [1, 100]
    //  *  @param {number} lum  the luminosity value in [1, 100]
    //  *  @private

    /*
      _setContrastingThumb : function(hue, sat, lum)
      {
      var c ;
        if (((sat < 30) && (lum > 70)) || (lum > 70))
      {
      c = "black" ;
      }
      else
      {
      c = "white" ;
      }
        this._$spectrumThumb.css('border-color', c) ;
      },
    */

    /**
     * Move the spectrum thumb relative to its current position (which is
     * set by _setThumbPosition()) by the supplied deltas. Updates
     * (this._xThumb, this._yThumb). The  call is ignored if the move
     * will take the thumb center outside the spectrum.
     * @param {number} xDelta     Pixels to move in the x-axis
     * @param {number} yDelta     Pixels to move in the y-axis
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _moveThumb: function _moveThumb(xDelta, yDelta) {
      var x;
      var y; // Ensure that the thumb center hasn't gone outside the spectrum

      x = this._xThumb + xDelta;
      y = this._yThumb + yDelta;

      if (x < 0) {
        x = 0;
      }

      if (y < 0) {
        y = 0;
      }

      if (x >= this._spectrumWidth) {
        x = this._spectrumWidth - 1;
      }

      if (y >= this._spectrumHeight) {
        y = this._spectrumHeight - 1;
      }

      this._xThumb = x;
      this._yThumb = y;
      x = x - this._spectrumThumbRadius + 'px';
      y = y - this._spectrumThumbRadius + 'px';
      this._$spectrumThumb[0].style.left = x;
      this._$spectrumThumb[0].style.top = y;
    },

    /**
     * Handle click on the spectrum
     * @param {Event}  e the associated event.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _spectrumClick: function _spectrumClick(e) {
      if (this._disabled) {
        return;
      }

      var pos = this._$spectrum.offset(); // get click position relative


      var xDisp = e.pageX - pos.left; // relative to spectrum

      var yDisp = e.pageY - pos.top; // top left

      var hue;
      var sat;
      var lum;
      var o;
      xDisp = Math.round(xDisp);
      yDisp = Math.round(yDisp);
      o = this._getSatLumFromPosition(xDisp, yDisp);
      sat = o.s;
      lum = o.l;
      hue = this._hueVal; // Update alpha slider

      this._updateAlphaBG(hue, sat, lum); //  Fire value optionChange event.


      var oNewColor = new Color({
        h: hue,
        s: sat,
        l: lum,
        a: this._alphaVal
      });

      this._SetRawValue(oNewColor, e);

      this._SetValue(oNewColor, e);

      this._setAriaText(hue, sat, lum, this._alphaVal);

      this._value = oNewColor;

      this._setSatLum(sat, lum);

      this._setThumbPosition(xDisp, yDisp); // this._setContrastingThumb(hue, sat, lum) ;


      this._$spectrumThumb.focus();
    },

    /**
     * Handle keydown on the spectrum
     * @param {Event}  e the associated event.
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _keyDown: function _keyDown(e) {
      var key;
      var xDelta;
      var yDelta;
      var elapsed;
      var accel = 1;
      this._keyNow = new Date().getTime();

      if (this._keyStart < 0) {
        // start new typeamatic period
        this._keyStart = this._keyNow;
        this._keyCount = 0;
      }

      elapsed = this._keyNow - this._keyStart;
      this._keyCount += 1;

      if (elapsed > 1400 || this._keyCount > 25) {
        accel = 3; // now move in increments of 3 pixels
      }

      xDelta = 0;
      yDelta = 0;
      key = e.keyCode;

      if (key === 40) {
        // down
        yDelta = accel;
      } else if (key === 38) {
        // up
        yDelta = -accel;
      } else if (key === 39) {
        // right
        xDelta = accel;
      } else if (key === 37) {
        // left
        xDelta = -accel;
      } else if (key === 36) {
        // home
        this._setThumbPosition(0, 0);

        this._keyStart = -1;
      } else if (key === 35) {
        // end
        this._setThumbPosition(this._spectrumWidth - 1, this._spectrumHeight - 1);

        this._keyStart = -1;
      } else if (key === 33) {
        // PgUp
        this._setThumbPosition(NaN, 0);

        this._keyStart = -1;
      } else if (key === 34) {
        // PgDn
        this._setThumbPosition(NaN, this._spectrumHeight - 1);

        this._keyStart = -1;
      } else {
        return undefined;
      }

      this._moveThumb(xDelta, yDelta);

      this._handleThumbMoved(e, this._xThumb, this._yThumb);

      e.preventDefault();
      return false;
    },

    /**
     * Handle keyup on the spectrum
     * @param {Event} e  the associated event.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _keyUp: function _keyUp(e) {
      this._keyStart = -1; // end of elapsed time/keystroke counting period
      // aria-valuetext was not set during the key down's to avoid repetitive
      // JAWS talkback - will do it now.

      var satLum = this._getSatLumFromPosition(this._xThumb, this._yThumb);

      this._setAriaText(this._hueVal, satLum.s, satLum.l, this._alphaVal); //  Fire the completing "value" event


      var newVal = this.options[this._transientValueName];

      this._SetValue(newVal, e);
    },

    /**
     * Set up the spectrum thumb to be draggable using jQuery Draggable
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _initThumbDraggable: function _initThumbDraggable() {
      if (!this._thumbDragHandler) {
        this._thumbDragHandler = this._thumbDrag.bind(this);
      }

      this._$spectrumThumb.draggable({
        drag: this._thumbDragHandler,
        stop: this._thumbDragHandler // Note: cannot use "containment" option currently,
        //       it fails for touch drag on Edge browser.

      });
    },

    /**
     * Enable or disable dragging the spectrum thumb.
     * @param {boolean} enable True to enable dragging, false to disable it.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _makeThumbDraggable: function _makeThumbDraggable(enable) {
      this._$spectrumThumb.draggable(enable ? 'enable' : 'disable');
    },

    /**
     * Handle drag and end dragstop of spectrum thumb
     * @param {Event} e  the associated event.
     * @param {Object} ui
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _thumbDrag: function _thumbDrag(e, ui) {
      var cx;
      var cy;
      var off1;
      var off2; // Constrain the thumb center to inside the spectrum
      // Left and right sides

      if (ui.position.left < -this._spectrumThumbRadius) {
        // eslint-disable-next-line no-param-reassign
        ui.position.left = -this._spectrumThumbRadius;
        cx = 0;
      } else if (ui.position.left + this._spectrumThumbRadius >= this._spectrumWidth) {
        // eslint-disable-next-line no-param-reassign
        ui.position.left = this._spectrumWidth - 1 - this._spectrumThumbRadius;
        cy = this._spectrumWidth - 1;
      } // Top and bottom sides


      if (ui.position.top < -this._spectrumThumbRadius) {
        // eslint-disable-next-line no-param-reassign
        ui.position.top = -this._spectrumThumbRadius;
        cy = 0;
      } else if (ui.position.top + this._spectrumThumbRadius >= this._spectrumHeight) {
        // eslint-disable-next-line no-param-reassign
        ui.position.top = this._spectrumHeight - 1 - this._spectrumThumbRadius;
        cy = this._spectrumHeight - 1;
      } // Find center of dragged thumb relative to spectrum


      off1 = this._$spectrumThumb.offset();
      off2 = this._$spectrum.offset();

      if (cx !== 0) {
        cx = off1.left + this._spectrumThumbRadius - off2.left;
      }

      if (cy !== 0) {
        cy = off1.top + this._spectrumThumbRadius - off2.top;
      } // Almost always when we get a 'dragstop' the position has not changed from
      // the last 'drag', but we must update the value on 'dragstop',
      // so do not return in that case.


      if (e.type !== 'dragstop' && this._xThumb === cx && this._yThumb === cy) {
        return;
      }

      if (e.type === 'drag') {
        this._xThumb = cx;
        this._yThumb = cy;
      } else {
        cx = this._xThumb; // use last drag position

        cy = this._yThumb;
      }

      this._handleThumbMoved(e, cx, cy); // update UI for the new position

    },

    /**
     * Handle previous spectrum thumb reposition by updating the alpha
     * slider background, and changing rawValue and value option values.
     * @param {Event}  e        the associated event.
     * @param {number} xCenter  the x value relative to the left side of the spectrum
     * @param {number} yCenter  the y value relative to the top of the spectrum
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _handleThumbMoved: function _handleThumbMoved(e, xCenter, yCenter) {
      var aria = false;
      var hue = this._hueVal;

      var o = this._getSatLumFromPosition(xCenter, yCenter);

      var sat = o.s;
      var lum = o.l; // Update alpha slider background

      this._updateAlphaBG(hue, sat, lum); // Fire value optionChange event.


      var color = new Color({
        h: hue,
        s: sat,
        l: lum,
        a: this._alphaVal
      });

      this._SetRawValue(color, e);

      if (e.type === 'dragstop') {
        this._SetValue(color, e.originalEvent);

        aria = true;
      }

      this._value = color;

      this._setSatLum(sat, lum); // this._setContrastingThumb(hue, sat, lum) ;    //  ensure thumb is easily viewable


      if (aria) {
        this._setAriaText(hue, sat, lum, this._alphaVal);
      }
    },

    /**
     * Return the sat/lum from the spectrum thumb reposition
     * @param {number} xCenter  the x value relative to the left side of the spectrum
     * @param {number} yCenter  the y value relative to the top of the spectrum
     * @returns {Object}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _getSatLumFromPosition: function _getSatLumFromPosition(xCenter, yCenter) {
      var sat = xCenter / (this._spectrumWidth - 1) * 100;
      var lum = 100 - yCenter / (this._spectrumHeight - 1) * 100;
      return {
        s: sat,
        l: lum
      };
    },

    /**
     * Update alpha slider background gradient
     * @param {number} hue  the hue value
     * @param {number} sat  the saturation value
     * @param {number} lum  the luminosity value
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _updateAlphaBG: function _updateAlphaBG(hue, sat, lum) {
      //  Update alpha slider gradient
      var grad;
      var from = 'hsla(' + hue + ',' + sat + '%,' + lum + '%, 0)';
      var to = 'hsla(' + hue + ',' + sat + '%,' + lum + '%, 1.0)'; // Reverse the gradient if RTL

      if (this._isRtl) {
        grad = to;
        to = from;
        from = grad;
      }

      grad = 'linear-gradient(90deg, ' + from + ', ' + to + ')';
      grad = grad + ',' + this._alphaBgUrl;
      this._disabledAlphaBG = grad;

      this._$alphaBarBack.css('background', grad);
    },

    /**
     * Returns an hsl string with the saturation and luminosity rounded to 2 dec places.
     * @param {number} hue  the hue value
     * @param {number} sat  the saturation value
     * @param {number} lum  the luminosity value
     * @param {number} alpha  the alpha value
     * @returns {string} hsl string
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _getRoundedHsl: function _getRoundedHsl(hue, sat, lum, alpha) {
      var s = 'hsl';
      var haveAlpha = typeof alpha === 'number' && alpha < 1;
      s += haveAlpha ? 'a(' : '(';

      var _hue = Math.round(hue);

      var _sat = Math.round(sat * 100) / 100;

      var _lum = Math.round(lum * 100) / 100;

      s += _hue + ', ' + _sat + '%, ' + _lum + '%' + (haveAlpha ? ',' + alpha : '') + ')';
      return s;
    },

    /**
     * Set the saturation and luminosity values.
     * @param {number} sat  saturation value in [0,100]
     * @param {number} lum  luminosity value in [0,100]
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setSatLum: function _setSatLum(sat, lum) {
      this._satVal = sat;
      this._lumVal = lum;
    },

    /**
     * @param {oj.Color} color
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setColorVals: function _setColorVals(color) {
      if (color) {
        this._value = color;

        var hsl = _getHslFromRgb(color);

        this._hueVal = hsl[0];
        this._satVal = hsl[1];
        this._lumVal = hsl[2];
        this._alphaVal = hsl[3];
      }
    },

    /**
     * Set the spectrum and thumb aria-textvalue.
     * @param {number} hue  the hue value
     * @param {number} sat  the saturation value
     * @param {number} lum  the luminosity value
     * @param {number} alpha the alpha value
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setAriaText: function _setAriaText(hue, sat, lum, alpha) {
      var ariaText = this._getRoundedHsl(hue, sat, lum, alpha);

      this._$spectrumThumb.attr('aria-valuetext', ariaText);
    },

    /**
     * Initialize the widget, examine options and set-up internal data structures.
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _initEditor: function _initEditor() {
      this._initData();

      this._setup();
    },

    /**
     * Perform setup, and init the sliders
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setup: function _setup() {
      // Add markup as a child of this component's DOM element
      this._$boundElem.append(this._markup); // @HTMLUpdateOK (contained strings are sanitized)


      this._$boundElem.addClass('oj-colorspectrum'); //-------------------------------------------------------------------------------------
      // Temp  - ojSlider needs an Id to work properly, but does not create one if not supplied.
      // This is currently being fixed by Lory.  REMOVE when fixed in ojSlider


      $('.oj-colorspectrum-hue').uniqueId();
      $('.oj-colorspectrum-alpha').uniqueId(); //-------------------------------------------------------------------------------------
      // Get working data

      this._$editorContainer = this._$boundElem.find('.oj-colorspectrum-container');
      this._$hueSlider = this._$boundElem.find('.oj-colorspectrum-hue');
      this._$alphaSlider = this._$boundElem.find('.oj-colorspectrum-alpha');
      this._$spectrum = this._$boundElem.find('.oj-colorspectrum-spectrum');
      this._$spectrumThumb = this._$boundElem.find('.oj-colorspectrum-thumb'); // Set initial temporary left and top values

      this._$spectrumThumb.css({
        left: '-9999px',
        top: '-9999px'
      }); // Get the thumb radius.  It appears that if the page has other components
      // and the page geometry is changing, offsetWidth is sometimes zero.  Here
      // we check for this and try it in a different way.


      this._spectrumThumbRadius = this._$spectrumThumb[0].offsetWidth / 2;

      if (this._spectrumThumbRadius <= 0) {
        this._spectrumThumbRadius = this._$spectrumThumb.width() / 2;
      }

      this._isTouch = oj.DomUtils.isTouchSupported();
      this._spectrumWidth = this._$spectrum.width();
      this._spectrumHeight = this._$spectrum.height();

      this._$spectrumThumb.attr('aria-describedby', this._$boundElem.find('.oj-colorspectrum-thumb-description').uniqueId().attr('id'));

      var fakeDiv = document.createElement('div');
      fakeDiv.className = 'oj-colorspectrum-alpha-bg';

      this._$boundElem[0].appendChild(fakeDiv); // @HTMLUpdateOK


      this._alphaBgUrl = window.getComputedStyle(fakeDiv, null).getPropertyValue('background-image');

      this._$boundElem[0].removeChild(fakeDiv); // Prep and create hue and alpha sliders


      var disabled = !!this._disabled;

      var hsl = _getHslFromRgb(this._value);

      this._hueVal = hsl[0];
      this._satVal = hsl[1];
      this._lumVal = hsl[2];
      this._alphaVal = hsl[3];
      this._sliderSetup = false; // ignore slider optionchange events during setup

      this._$hueSlider.ojSlider({
        max: 360,
        min: 0,
        step: 1,
        value: this._hueVal,
        orientation: 'vertical',
        optionChange: this._onSliderOptionChange.bind(this),
        rootAttributes: {
          class: 'oj-slider-color-picker'
        }
      }).attr('data-oj-internal', ''); // for use in automation api / oj.Components.getComponentElementByNode


      this._$alphaSlider.ojSlider({
        max: 1,
        min: 0,
        step: 0.01,
        value: this._alphaVal,
        orientation: 'horizontal',
        optionChange: this._onSliderOptionChange.bind(this),
        rootAttributes: {
          class: 'oj-slider-color-picker'
        }
      }).attr('data-oj-internal', ''); // for use in automation api / oj.Components.getComponentElementByNode


      this._initSliders(); //  Apply the saturation/luminosity mask


      this._setSpectrumMask(); // Paint the spectrum and move the thumb to its initial position based
      // on the current color value.


      this._setSpectrumHue(this._hueVal, this._satVal, this._lumVal, this._alphaVal, true); // Add listeners for the spectrum and the spectrum thumb


      this._$spectrum.click(this._spectrumClick.bind(this));

      this._initThumbDraggable();

      this._setOptDisabled(disabled); // Add keyboard listeners


      this._$spectrumThumb.keydown(this._keyDown.bind(this));

      this._$spectrumThumb.keyup(this._keyUp.bind(this));

      this._$spectrum.focus(this._nofocus.bind(this)); // Focus ring


      this._focusable({
        element: this._$spectrumThumb,
        applyHighlight: true
      });

      if (oj.DomUtils.isTouchSupported()) {
        this._setupTouch(this._$spectrumThumb);
      }
    },

    /**
     * Move focus to the spectrum thumb
     * @param {Event} e  the associated event.
     * @returns {boolean}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _nofocus: function _nofocus(e) {
      this._$spectrumThumb.focus();

      return false;
    },

    /**
     * Initialize the sliders
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _initSliders: function _initSliders() {
      var subId = {
        subId: 'oj-slider-bar'
      }; // for getNodeBySubId()

      this._$hueBarBack = $(this._$hueSlider.ojSlider('getNodeBySubId', subId));
      this._$alphaBarBack = $(this._$alphaSlider.ojSlider('getNodeBySubId', subId));
      subId.subId = 'oj-slider-bar-value';
      this._$hueBarValue = $(this._$hueSlider.ojSlider('getNodeBySubId', subId));
      this._$alphaBarValue = $(this._$alphaSlider.ojSlider('getNodeBySubId', subId));
      var grad = 'linear-gradient(0deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';

      this._$hueBarBack.css('background', grad);

      this._disabledHueBG = grad;

      this._updateAlphaBG(this._hueVal, this._satVal, this._lumVal);

      this._sliderSetup = true;
    },

    /**
     * Set up instance data
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _initData: function _initData() {
      this._applyOptions(); // process the component options


      this._xThumb = 0; // initial spectrum

      this._yThumb = 0; // thumb position.
      // Get slider aria-label's

      var hueTitle = this._EscapeXSS(this.getTranslatedString(TRANSKEY_HUE));

      var alphaTitle = this._EscapeXSS(this.getTranslatedString(TRANSKEY_OPACITY));

      var thumbDesc = this._EscapeXSS(this.getTranslatedString(TRANSKEY_THUMB_DESC)); //  Create the markup


      this._markup = function () {
        return ["<div class='oj-colorspectrum-container oj-form-control-container'>", "<div class='oj-colorspectrum-spectrum' tabindex='-1'>", "<div class='oj-colorspectrum-thumb' role='slider' aria-describedby='' tabIndex='0'></div>", '</div>', "<div class='oj-colorspectrum-thumb-description oj-helper-hidden-accessible'>" + thumbDesc + '</div>', "<input class='oj-colorspectrum-hue' aria-label='" + hueTitle + "'></input>", "<input class='oj-colorspectrum-alpha' aria-label='" + alphaTitle + "'></input>", '</div>'].join('');
      }();

      this._keyStart = -1;
      this._isRtl = this._GetReadingDirection() === 'rtl';
    },

    /**
     * Process the component options
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _applyOptions: function _applyOptions() {
      var opts = this.options;
      var opt;
      this._doc = this.element[0].ownerDocument;
      this._body = this._doc.body;
      this._$boundElem = $(this.element);
      this._disabled = false;
      this._transientValueName = this._IsCustomElement() ? 'transientValue' : 'rawValue';
      opt = opts.value;

      if (!(opt instanceof Color)) {
        opt = null;
      }

      this._value = opt || Color.BLACK;
      opts[this._transientValueName] = this._value;
      opt = opts.disabled;
      this._disabled = typeof opt === 'boolean' ? opt : false;
    },

    /**
     * Enable/disable the hue and alpha sliders
     * @param {boolean} enable true if sliders are to be enabled, false for disable
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _enableSliders: function _enableSliders(enable) {
      var disabled = !enable; //= ======================================================================
      //  Because of ojSlider , which basically destroys the slider
      //  when it disables it, we need to save off the background style, and
      //  reapply it, on the next enable.
      //  --- REMOVE WHEN osSlider is fixed! ---

      if (enable) {
        this._$hueSlider.ojSlider('option', 'disabled', disabled);

        this._$alphaSlider.ojSlider('option', 'disabled', disabled); // Need to restablish JQ pointers since they are now invalid!


        var subId = {
          subId: 'oj-slider-bar'
        };
        this._$hueSlider = this._$boundElem.find('.oj-colorspectrum-hue');
        this._$alphaSlider = this._$boundElem.find('.oj-colorspectrum-alpha');
        this._$hueBarBack = $(this._$hueSlider.ojSlider('getNodeBySubId', subId));
        this._$alphaBarBack = $(this._$alphaSlider.ojSlider('getNodeBySubId', subId));

        if (this._disabledAlphaBG) {
          this._$alphaBarBack.css('background', this._disabledAlphaBG);
        }

        if (this._disabledHueBG) {
          this._$hueBarBack.css('background', this._disabledHueBG);
        }
      } else {
        var bg = this._$hueBarBack.css('background');

        if (bg && bg.length > 0) {
          this._disabledHueBG = bg;
        }

        bg = this._$alphaBarBack.css('background');

        if (bg && bg.length > 0) {
          this._disabledAlphaBG = bg;
        } // remove the inline  style background override
        // otherwise the background of the disabled ojSlider would be overridden


        this._$hueBarBack.css('background', '');

        this._$alphaBarBack.css('background', '');

        this._$hueSlider.ojSlider('option', 'disabled', disabled);

        this._$alphaSlider.ojSlider('option', 'disabled', disabled);
      } //= ==================================================

    },

    /**
     * Destroy the hue and alpha sliders
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _destroySliders: function _destroySliders() {
      this._$hueSlider.ojSlider('destroy');

      this._$alphaSlider.ojSlider('destroy');
    },

    /**
     * Remove the added markup
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _removeMarkup: function _removeMarkup() {
      this._$boundElem.empty();
    },

    /**
     * Unbind all mouse/keyboard event listeners
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _clearListeners: function _clearListeners() {
      this._$spectrum.off('click');

      this._$spectrumThumb.off('mousedown');

      this._$spectrumThumb.off('keydown');

      this._$spectrumThumb.off('keyup');

      if (this._touchProxy) {
        this._tearDownTouch(this._$spectrumThumb);
      }
    },

    /**
     * Clear resources
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _clear: function _clear() {
      this._markup = null;
      this._$boundElem = null;
      this._$editorContainer = null;
      this._$hue = null;
      this._$alpha = null;
      this._$editorContainer = null;
      this._$hueSlider = null;
      this._$alphaSlider = null;
      this._$spectrum = null;
      this._$spectrumThumb = null;
      this._spectrumThumbSize = null;
      this._strings = null;
      this._mouseMoveHandler = null;
      this._mouseUpHandler = null;
    },

    /**
     * Setup touch support
     * @param {Element} elem
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _setupTouch: function _setupTouch(elem) {
      this._touchProxy = oj._TouchProxy.addTouchListeners(elem);
    },

    /**
     * End touch support
     * @param {Element} elem
     * @return {void}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @private
     */
    _tearDownTouch: function _tearDownTouch(elem) {
      oj._TouchProxy.removeTouchListeners(elem);
    },

    /**
     * Returns a jquery object of the launcher element representing the content nodes (spectrum).
     * @returns {Element}
     * @protected
     * @override
     * @instance
     * @memberof oj.ojColorSpectrum
     */
    _GetMessagingLauncherElement: function _GetMessagingLauncherElement() {
      return this.element;
    },

    /**
     * Returns a jquery object of the elements representing the content nodes (spectrum thumb).
     * @returns {Element}
     * @protected
     * @override
     * @instance
     * @memberof oj.ojColorSpectrum
     */
    _GetContentElement: function _GetContentElement() {
      return this._$spectrumThumb;
    },

    /**
     * Returns the element's value. Normally, this is a call to this.element.val(), but for some
     * components, it could be something else. E.g., for ojRadioset the element's value is really the
     * value of the selected radio in the set.
     * @returns {oj.Color} element's value
     * @override
     * @memberof oj.ojColorSpectrum
     * @instance
     * @protected
     */
    _GetElementValue: function _GetElementValue() {
      return this._value;
    },

    /**
     * Called when the display value on the element needs to be updated. This method updates the
     * (content) element value.
     *
     * @param {string} displayValue of the new string to be displayed
     * @return {void}
     *
     * @memberof oj.ojColorSpectrum
     * @instance
     * @protected
     * @override
     */
    _SetDisplayValue: function _SetDisplayValue(displayValue) {
      if (typeof displayValue === 'string') {
        this._value = new Color(displayValue);
      } else {
        this._value = displayValue;
      }
    },

    /**
     * Returns the display value that is ready to be passed to the converter.
     *
     * @return {string} usually a string display value
     *
     * @memberof oj.ojColorSpectrum
     * @instance
     * @protected
     * @override
     */
    _GetDisplayValue: function _GetDisplayValue() {
      return this._value.toString();
    },

    /**
     * Returns the default styleclass for the component. All input components must override.
     *
     * @return {string}
     *
     * @memberof oj.ojColorSpectrum
     * @instance
     * @protected
     * @override
     */
    _GetDefaultStyleClass: function _GetDefaultStyleClass() {
      return 'oj-colorspectrum';
    },

    /**
     * Helper function to escape Cross site script text
     * @private
     * @param {string} escapeMe
     * @return {jQuery|string}
     * @memberof oj.ojColorSpectrum
     * @instance
     * @ignore
     */
    _EscapeXSS: function _EscapeXSS(escapeMe) {
      return $('<span>' + escapeMe + '</span>').text();
    } // / ///////////////     KEYBOARD     //////////////////

    /**
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
     *       <td rowspan="6">Spectrum Thumb</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves the thumb to the left (decreasing saturation).  Holding the key down will cause the thumb to accelerate its movement.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves the thumb to the right (increasing saturation).  Holding the key down will cause the thumb to accelerate its movement.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Moves the thumb vertically to the top of the spectrum (luminosity 100%).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Moves the thumb vertically to the bottom of the spectrum (luminosity 0%).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Moves the thumb to the top left corner of the spectrum (saturation 0%, luminosity 100%).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Moves the thumb to the bottom right of the spectrum (saturation 100%, luminosity 0%).</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="8">Slider Thumb</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves the thumb to the left for the horizontal <code class="prettyprint">Opacity</code> slider, and downwards for the vertical <code class="prettyprint">Hue</code> slider.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves the thumb to the right for the horizontal <code class="prettyprint">Opacity</code> slider, and upwards for the vertical <code class="prettyprint">Hue</code> slider.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves the thumb upwards for the vertical <code class="prettyprint">Hue</code> slider, and to the right for the horizontal <code class="prettyprint">Opacity</code> slider.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves the thumb downwards for the vertical <code class="prettyprint">Hue</code> slider, and to the left for the horizontal <code class="prettyprint">Opacity</code> slider.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Moves the thumb to the leftmost (complete opacity) for the horizontal <code class="prettyprint">Opacity</code> slider,
     *           and to the bottom for the vertical <code class="prettyprint">Hue</code> slider.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Moves the thumb to the rightmost (complete opacity) for the horizontal <code class="prettyprint">Opacity</code> slider, and to the top for the vertical <code class="prettyprint">Hue</code> slider.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Moves the thumb 20% of the slider range - upwardsfor the vertical <code class="prettyprint">Hue</code> slider, and to the right (lower opacity) for the horizontal <code class="prettyprint">Opacity</code> slider.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Moves the thumb 20% of the slider range - downwards for the vertical <code class="prettyprint">Hue</code> slider, and to the left (higher opacity) for the horizontal <code class="prettyprint">Opacity</code> slider.</td>
     *     </tr>
     *   </tbody>
     * </table>
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojColorSpectrum
     */
    // / ///////////////     TOUCH     //////////////////

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
     *       <td>Repositions the thumb to the tapped position.</td>
     *     </tr>
     *     <tr>
     *       <td>Slider Thumb</td>
     *       <td><kbd>Swipe</kbd></td>
     *       <td>Repositions the thumb to the swiped position.</td>
     *     </tr>
     *     <tr>
     *       <td>Spectrum</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Repositions the thumb to the tapped position.</td>
     *     </tr>
     *     <tr>
     *       <td>Spectrum Thumb</td>
     *       <td><kbd>Swipe</kbd></td>
     *       <td>Repositions the thumb to the swiped position.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc,
     * and standalone gesture doc
     * @memberof oj.ojColorSpectrum
     */

    /**
     * Sets a property or a single subproperty for complex properties and notifies the component
     * of the change, triggering a [property]Changed event.
     *
     * @function setProperty
     * @param {string} property - The property name to set. Supports dot notation for subproperty access.
     * @param {any} value - The new value to set the property to.
     *
     * @expose
     * @memberof oj.ojColorSpectrum
     * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
     * @instance
     *
     * @example <caption>Set a single subproperty of a complex property:</caption>
     * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
     */

    /**
     * Retrieves a value for a property or a single subproperty for complex properties.
     * @function getProperty
     * @param {string} property - The property name to get. Supports dot notation for subproperty access.
     * @return {any}
     *
     * @expose
     * @memberof oj.ojColorSpectrum
     * @instance
     *
     * @example <caption>Get a single subproperty of a complex property:</caption>
     * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
     */

    /**
     * Performs a batch set of properties.
     * @function setProperties
     * @param {Object} properties - An object containing the property and value pairs to set.
     *
     * @expose
     * @memberof oj.ojColorSpectrum
     * @instance
     *
     * @example <caption>Set a batch of properties:</caption>
     * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
     */
    // / ///////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for the vertical hue slider bar.</p>
     *
     * @ojsubid oj-hue-slider-bar
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the hue slider bar:</caption>
     * var node = myColorSpectrum.getNodeBySubId({'subId': 'oj-hue-slider-bar'} );
     */

    /**
     * <p>Sub-ID for the vertical hue slider bar value.</p>
     *
     * @ojsubid oj-hue-slider-bar-value
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the hue slider bar value:</caption>
     * var node = myColorSpectrum.getNodeBySubId( {'subId': 'oj-hue-slider-bar-value'} );
     */

    /**
     * <p>Sub-ID for the vertical hue slider thumb.</p>
     *
     * @ojsubid oj-hue-slider-thumb
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the hue slider thumb:</caption>
     * var node = myColorSpectrum.getNodeBySubId({'subId': 'oj-hue-slider-thumb'} );
     */

    /**
     * <p>Sub-ID for the horizontal opacity slider bar.</p>
     *
     * @ojsubid oj-opacity-slider-bar
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the opacity slider bar:</caption>
     * var node = myColorSpectrum.getNodeBySubId({'subId': 'oj-opacity-slider-bar'} );
     */

    /**
     * <p>Sub-ID for the horizontal opacity slider bar value.</p>
     *
     * @ojsubid oj-opacity-slider-bar-value
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the opacity slider bar value:</caption>
     * var node = myColorSpectrum.getNodeBySubId({'subId': 'oj-opacity-slider-bar-value'} );
     */

    /**
     * <p>Sub-ID for the horizontal opacity slider thumb.</p>
     *
     * @ojsubid oj-opacity-slider-thumb
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the opacity slider thumb:</caption>
     * var node = myColorSpectrum.getNodeBySubId({'subId': 'oj-opacity-slider-thumb'} );
     */

    /**
     * <p>Sub-ID for the saturation/luminosity spectrum. </p>
     *
     * @ojsubid oj-spectrum
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the saturation/luminosity spectrum:</caption>
     * var node = myColorSpectrum.getNodeBySubId( {'subId': 'oj-spectrum'} );
     *
     */

    /**
     * <p>Sub-ID for the saturation/luminosity spectrum thumb. </p>
     *
     * @ojsubid oj-spectrum-thumb
     * @memberof oj.ojColorSpectrum
     *
     * @example <caption>Get the node for the saturation/luminosity spectrum thumb:</caption>
     * var node = myColorSpectrum.getNodeBySubId({'subId': 'oj-spectrum-thumb'} );
     *
     */

  }); // end    $.widget("oj.ojColorSpectrum"

})();



/* global __oj_color_spectrum_metadata */
(function () {
  __oj_color_spectrum_metadata.extension._WIDGET_NAME = 'ojColorSpectrum';
  oj.CustomElementBridge.register('oj-color-spectrum', {
    metadata: __oj_color_spectrum_metadata
  });
})();

});