/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojcolor', 'ojs/ojconverter-color', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojlabelledbyutils', 'ojs/ojarraytabledatasource', 'ojs/ojlistview', 'ojs/ojeditablevalue'],
       function(oj, $, Components, Color, ColorConverter, Logger, Context, LabelledByUtils)
{
  "use strict";
var __oj_color_palette_metadata = 
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
    "labelDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "off"
      ],
      "value": "off"
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
    "layout": {
      "type": "string",
      "enumValues": [
        "grid",
        "list"
      ],
      "value": "grid"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "palette": {
      "type": "Array<Object>"
    },
    "swatchSize": {
      "type": "string",
      "enumValues": [
        "xs",
        "sm",
        "lg"
      ],
      "value": "lg"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "labelNone": {
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
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* global Promise:false, Color:false, ColorConverter:false, Logger:false, Context:false, LabelledByUtils:false */

/*---------------------------------------------------------
   ojColorPalette    Jet Color Palette element
   Depends:   jquery.ui.core.js
              jquery.ui.widget.js
----------------------------------------------------------*/
(function () {
  /*
    function debugObj(o)  {
      var s ;
      try { s = JSON.stringify(o) ; }
      catch (e) { s = "ERROR";}
      return s ;
    };
  */
  //  ojColorPalette class names
  var OJCP_LIST_ITEM_ELEMENT = 'oj-listview-item-element';
  var OJCP_SELECTED = 'oj-selected';
  /* unused, kept for future use
     var OJCP_CONTAINER = "oj-colorpalette-container",
     var OJCP_GRID = "oj-colorpalette-grid",
     var OJCP_LIST = "oj-colorpalette-list",
     var OJCP_TEXT = "oj-colorpalette-swatch-text",
     var OJCP_LIST_CONTAINER = "oj-listview-container",
     var OJCP_LIST_ELEMENT = "oj-listview-element",
  */
  // Misc translation keys

  var TRANSKEY_NONE = 'labelNone';
  /**
   * @ojcomponent oj.ojColorPalette
   * @augments oj.editableValue
   * @since 3.0.0
   *
   * @class oj.ojColorPalette
   * @ojimportmembers oj.ojDisplayOptions
   * @ojtsimport {module: "ojcolor", type: "AMD", importName: "Color"}
   * @ojshortdesc A color palette displays a set of predefined colors from which a specific color can be selected.
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojColorPalette extends editableValue<oj.Color, ojColorPaletteSettableProperties>"
   *               },
   *               {
   *                target: "Type",
   *                value: "ojColorPaletteSettableProperties extends editableValueSettableProperties<oj.Color>",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "layout", "swatchSize", "labelDisplay", "disabled"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["palette", "value"]}
   * @ojvbdefaultcolumns 4
   * @ojvbmincolumns 4
   *
   * @classdesc
   * <h3 id="colorPaletteOverview-section">
   *   JET Color Palette
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#colorPaletteOverview-section"></a>
   * </h3>
   * The Jet Color Palette element allows an application to display a set of pre-defined
   * colors from which a specific color can be selected. The palette's content is specified as a list
   * of color objects containing an oj.Color.
   * <pre class="prettyprint">
   * <code>&lt;oj-color-palette palette="[[myPalette]]" value="{{colorValue}}">
   * &lt;/oj-color-palette>
   * </code></pre>
   * {@ojinclude "name":"validationAndMessagingDoc"}
   *
   * <p>
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"keyboardDoc"}
   *
   * <p>
   *
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>As with any JET element, in the unusual case that the directionality (LTR or RTL) changes post-init, the color palette must be <code class="prettyprint">refresh()</code>ed.
   *
   */

  oj.__registerWidget('oj.ojColorPalette', $.oj.editableValue, {
    widgetEventPrefix: 'oj',
    defaultElement: '<input>',
    options: {
      /**
       * Labelled-by is used to establish a relationship between this and another element.
       * A common use is to tie the oj-label and the oj-color-palette together for accessibility.
       * The oj-label custom element has an id, and you use the labelled-by attribute
       * to tie the two elements together to facilitate correct screen reader behavior.
       *
       * @ojshortdesc Used to establish a relationship between this element and another element.
       * @example <caption>Initialize the color palette with the <code class="prettyprint">labelled-by</code> attribute specified:</caption>
       * &ltoj-label id="labelId">Name:&lt/oj-label>
       * &ltoj-color-palette labelled-by="labelId">&lt;/oj-color-palette>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelled-by</code> property, after initialization:</caption>
       * // getter
       * var labelledBy = myColorPalette.labelledBy;
       *
       * // setter
       * myColorPalette.labelledBy = "labelId";
       *
       * @expose
       * @type {?string}
       * @default null
       * @instance
       * @memberof oj.ojColorPalette
       */
      labelledBy: null,

      /**
       * Specify an array of objects defining the palette's color set, and optionally, descriptive labels for the colors.
       * Each object has the following structure:
       * @property {Object} color the color definition
       * @property {string} [label] optional descriptive string (refer to attribute <em>label-display</em>).
       *                                         If omitted, <em>label</em> defaults to the color's hex string format.
       *
       * @ojsignature {target:"Type", value:"oj.Color", for:"color", jsdocOverride:true}
       * @member
       * @type {Array.<Object>}
       * @ojsignature  {target: "Type", value: "Array<{color: oj.Color, label?: string}>"}
       * @default null
       * @ojshortdesc Specifies an array of objects defining the palette's color set.
       * @example <caption>Initialize the color palette with the <code class="prettyprint">palette</code> attribute specified:</caption>
       * &ltoj-color-palette palette='[[myPalette]]'>&lt;/oj-color-palette>
       *
       * @example <caption>Get or set the <code class="prettyprint">palette</code> property, after initialization:</caption>
       * // Get one
       * var oneColor = myColorPalette.palette[0];
       *
       * // Get all
       * var myPallete = myColorPalette.palette;
       *
       * // Set all
       * var palette = [{color:new oj.Color('#ffffff'), label: 'White'},
       {color: new oj.Color('#77bb99'), label: 'Std text'},
       . . .];
       * myColorPalette.palette = palette;
       * @expose
       * @instance
       * @memberof oj.ojColorPalette
       * @ojtranslatable
       */
      palette: null,

      /**
       * The swatch size.  If the size is <em>'sm'</em> or <em>'xs'</em>, the color <em>label</em> property is used as a tooltip.
       * @member
       * @type {string}
       * @default "lg"
       * @ojshortdesc Specifies the swatch size.
       * @ojvalue {string} "xs" {"description": "extra small swatch", "displayName": "Extra Small"}
       * @ojvalue {string} "sm" {"description": "small swatch", "displayName": "Small"}
       * @ojvalue {string} "lg" {"description": "large swatch", "displayName": "Large"}
       * @ojvalueskeeporder
       *
       * @example <caption>Initialize the color palette with the <code class="prettyprint">swatch-size</code> attribute specified:</caption>
       * &ltoj-color-palette swatch-size="lg">&lt;/oj-color-palette>
       *
       * @example <caption>Get or set the <code class="prettyprint">swatchSize</code> property, after initialization:</caption>
       * // getter
       * var swatchSize = myColorPalette.swatchSize;
       *
       * // setter
       * myColorPalette.swatchSize = "lg";
       * @expose
       * @instance
       * @memberof oj.ojColorPalette
       */
      swatchSize: 'lg',

      /**
       * Specifies whether a text label accompanies the color swatch.
       * @member
       * @type {string}
       * @default "off"
       * @ojshortdesc Specifies whether a text label accompanies the color swatch.
       * @ojvalue {string} "auto" labels are displayed if the <em>layout</em> property is <em>'list'</em> and swatch-size is <em>'sm'</em> or if the <em>layout</em> is <em>'grid'</em> and <em>swatch-size</em> is <em>'lg'</em>
       * @ojvalue {string} "off" labels are not displayed
       *
       * @example <caption>Initialize the color palette with the <code class="prettyprint">label-display</code> attribute specified:</caption>
       * &ltoj-color-palette label-display="auto">&lt;/oj-color-palette>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelDisplay</code> property, after initialization:</caption>
       * // getter
       * var labelDisplay = myColorPalette.labelDisplay;
       *
       * // setter
       * myColorPalette.labelDisplay = "auto";
       * @expose
       * @instance
       * @memberof oj.ojColorPalette
       */
      labelDisplay: 'off',

      /**
       * Specifies the layout of the color swatches.
       * @member
       * @type {string}
       * @default "grid"
       * @ojshortdesc Specifies the layout of the color swatches.
       * @ojvalue {string} "grid" Layout the color swatches in a grid
       * @ojvalue {string} "list" Layout the color swatches in a list
       * @expose
       * @example <caption>Initialize the color palette with the <code class="prettyprint">layout</code> attribute specified:</caption>
       * &ltoj-color-palette layout="grid">&lt;/oj-color-palette>
       *
       * @example <caption>Get or set the <code class="prettyprint">layout</code> property, after initialization:</caption>
       * // getter
       * var layout = myColorPalette.layout;
       *
       * // setter
       * myColorPalette.layout = "grid";
       * @instance
       * @memberof oj.ojColorPalette
       */
      layout: 'grid',

      /**
       * The current value of the palette element.
       * @member
       * @type {Object}
       * @ojformat color
       * @default null
       * @ojshortdesc The current value of the palette element.
       * @ojwriteback
       * @expose
       * @instance
       * @ojeventgroup common
       * @ojsignature {target:"Type", value:"oj.Color", jsdocOverride:true}
       * @memberof oj.ojColorPalette
       * @example <caption>Initialize the color palette with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &ltoj-color-palette value='{{myColor}}'>&lt;/oj-color-palette>
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> property, after initialization:</caption>
       * // getter
       * var color = myColorPalette.value;
       *
       * // setter
       * myColorPalette.value = new oj.Color('rgb(0,0,0)');
       */
      value: null
    },
    // end options
    //* * @inheritdoc */
    getNodeBySubId: function getNodeBySubId(locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      var subId = locator.subId;
      var index = locator.index;

      var ret = this._super(locator);

      var elems;

      if (!ret) {
        switch (subId) {
          case 'oj-palette-entry':
            elems = this._$LV.find('.oj-listview-item');

            if (elems.length && index < elems.length) {
              ret = elems[index];
            }

            break;

          default:
            break;
        }
      }

      return ret;
    },
    //* * @inheritdoc */
    getSubIdByNode: function getSubIdByNode(elem) {
      var $node = $(elem);
      var subId = null;
      var index = -1;
      var ret = null;
      var id;
      var elems;

      if ($node.is('li') && $node.hasClass(OJCP_LIST_ITEM_ELEMENT)) {
        subId = 'oj-palette-entry';
        id = $node.attr('id');
        elems = this._$LV.find('.oj-listview-item');
        $.each(elems, function (i, obj) {
          if ($(obj).attr('id') === id) {
            index = i;
            return false;
          }

          return true;
        });
      }

      if (subId) {
        ret = {
          subId: subId
        };

        if (index >= 0) {
          ret.index = index;
        }
      }

      if (ret == null) {
        ret = this._super(elem);
      }

      return ret;
    },

    /**
     * Add an entry to the palette.
     * @param {oj.Color | Object}   newEntry  An oj.Color object specfying the color to be added,
     * or an object of the same format as used for defining a palette - see the <code class="prettyprint">palette</code> option.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @expose
     * @ojdeprecated {since:"4.0.0", description: "This is deprecated for API consistency with the remove function. The same functionality can be achieved by mutating the observable array that is set as the palette."}
     * @ignore
     * @instance
     */
    add: function add(newEntry) {
      var o = null;
      var c;

      if (newEntry instanceof Color) {
        o = {
          color: newEntry
        };
      } else if (_typeof(newEntry) === 'object') {
        c = newEntry.color;

        if (c instanceof Color) {
          o = newEntry;
        }
      } // Perform the add.


      if (o) {
        // Add a palette busy state for the add
        // The busy state resolver will be invoked when ListView completes the add.
        this._setPaletteBusyContext('The swatch add is being animated in the palette (id=' + this.element.attr('id') + ').'); // Perform the add


        o.id = this._getNewSwatchId(); // give the new swatch an id

        if (!this._opStack) {
          this._opStack = []; // fifo stack of post-busy operations
        }

        this._opStack.push({
          op: 'a',
          obj: o
        });

        this._palDataSource.add(o); // ListView will render the new entry


        this._waitForLV(); // complete the add when LV is complete

      }
    },

    /**
     * Remove an entry from the palette.
     * @param {Object | number | oj.Color}  palEntry  Can be the zero-based index to the entry, or an
     * object containing the color specfication (using the same format as used for defining the
     * palette - see the <code class="prettyprint">palette</code> option, or an oj.Color object.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @expose
     * @ojdeprecated {since:"4.0.0", description: "This is deprecated due to a name collision with HTMLElement. The same functionality can be achieved by mutating the observable array that is set as the palette."}
     * @ignore
     * @instance
     */
    remove: function remove(palEntry) {
      var id = null;

      var t = _typeof(palEntry);

      if (t === 'number') {
        // index
        if (palEntry >= 0 && palEntry < this._palette.length) {
          id = this._palette[palEntry].id;
        } else {
          Logger.error("JET Color Palette (id='" + this.element.attr('id') + "'): Invalid index for remove (" + palEntry + ')');
        }
      } else if (t === 'object') {
        var c = palEntry instanceof Color ? palEntry : palEntry.color;
        id = this._findSwatchIdOfColorInPalette(c);
      }

      if (id) {
        // eslint-disable-next-line no-param-reassign
        palEntry = {
          id: id
        }; // Add a palette busy state for the remove
        // The busy state resolver will be invoked when ListView completes the remove.

        this._setPaletteBusyContext('The removed swatch is being animated in the palette (id=' + this.element.attr('id') + ').'); // Perform the remove


        if (!this._opStack) {
          this._opStack = []; // fifo stack of post-busy operations
        }

        this._opStack.push({
          op: 'r',
          obj: palEntry
        });

        this._palDataSource.remove(palEntry); // LV will re-render


        this._waitForLV(); // complete the remove when LV is complete

      }
    },

    /**
     * Returns a Promise that resolves when the component is ready and has finished rendering.
     * This method does not accept any arguments.
     * @ojshortdesc Returns a Promise that resolves when the component is ready and has finished rendering.
     * @memberof oj.ojColorPalette
     * @expose
     * @ignore
     * @instance
     * @return {Promise} A Promise that resolves when the component is ready.
     */
    whenReady: function whenReady() {
      var self = this;
      var promise = new Promise(function (resolve) {
        self._$LV.ojListView('whenReady').then(function () {
          resolve(true);
        });
      });
      return promise;
    },

    /**
       * Override to setup resources needed by this component.
       * @memberof oj.ojColorPalette
       * @override
       * @protected
       */
    _SetupResources: function _SetupResources() {
      this._super();

      var self = this;
      var LVResolve = Context.getContext(this._$LV[0]).getBusyContext();
      LVResolve.whenReady().then(function () {
        // Instantiate the ListView
        self._$LV.ojListView({
          data: self._palDataSource,
          item: {
            renderer: self._renderer.bind(self)
          },
          optionChange: self._onLVOptionChange.bind(self),
          selectionMode: 'single',
          selection: self._palInitSelected,
          rootAttributes: {
            style: 'height:100%;width:100%'
          }
        }).attr('data-oj-internal', ''); // for use in automation api


        self._$LVWidget = self._$LV;
        return LVResolve.whenReady();
      }).then(function () {
        // Don't want any listview text if palette is empty
        self._$LV.ojListView('option', 'translations.msgNoData', '');

        self._setOptDisabled(self._disabled); // FIX : when there is a vertical scrollbar, add
        // padding so that no horizontal scrollbar is needed and the
        // text doesn't get cut off or truncated


        if (self._$LV[0].scrollWidth > self._$LV[0].clientWidth) {
          var scrollbarWidth = self._getScrollbarWidth();

          var rtl = self._GetReadingDirection() === 'rtl';

          self._$LV.css(rtl ? 'padding-left' : 'padding-right', scrollbarWidth + 1);
        }

        self._resolvePaletteBusyContext(); // component is ready to use

      });
    },

    /**
     * Override to release resources held by this component.
     * @memberof oj.ojColorPalette
     * @override
     * @protected
     */
    _ReleaseResources: function _ReleaseResources() {
      this._super();

      this._resolvePaletteBusyContext();

      if (this._$LVWidget) {
        this._$LVWidget.ojListView('destroy');

        this._$LVWidget = null;
      }
    },

    /**
     * Override to do the delay connect/disconnect
     * @memberof oj.ojColorPalette
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function _VerifyConnectedForSetup() {
      return true;
    },

    /**
     * Destroy the Color Palette. The base class#destroy
     * calls _ReleaseResources.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @override
     * @protected
     */
    _destroy: function _destroy() {
      this._palDataSource = null;

      this._$paletteContainer.remove(); // remove our markup from dom


      this._$boundElem.removeClass('oj-colorpalette');

      this._clear();

      this._super();
    },

    /**
     * Called the first time the widget is called on an element.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _ComponentCreate: function _ComponentCreate() {
      this._super();

      this._initPalette();
    },

    /**
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _AfterCreate: function _AfterCreate() {
      var label;

      this._super();

      this._updateLabelledBy(this.element[0], null, this.options.labelledBy, this._$LV); // custom element's use oj-label.


      if (!this._IsCustomElement()) {
        label = this._GetLabelElement();
      } // Apply the label to the listview


      if (label) {
        // Set the aria-labelledby attribute of the listview to the returned id
        var labelId = label.attr('id');

        if (!labelId) {
          Logger.warn('JET Color Palette: The label for this component needs an id in order to be accessible');
        } else {
          this._$LV.attr('aria-labelledby', labelId);
        }
      } else {
        // Check if the element has aria-label
        var ariaLabelString = this.element.attr('aria-label');

        if (ariaLabelString) {
          // Set the aria-label of the listview to the returned string
          this._$LV.attr('aria-label', ariaLabelString);
        }
      }
    },

    /**
     * Handle an option change.
     * Called by $(selector).ojColorPalette("option", "prop", value)
     * @param {string}   key
     * @param {string | oj.Color | boolean}   newval
     * @param {Object}   flags
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setOption: function _setOption(key, newval, flags) {
      var originalValue = this.options.labelledBy;
      var bSkip = false;

      switch (key) {
        case 'value':
          // Fix  - COULD NOT CHANGE A PALETTE VALUE FROM JAVASCRIPT
          // If the value has changed and if the value is in the palette,
          // ojlistview would trigger selection event for the color in palette (see method _onLVOptionChange).
          // The selection handler (_selected) would set new value (in method _SetValue), which would
          // internally set the new value in options and fires option change event.
          // So in that case, skip calling _super below to avoid duplicate firing of option change event.
          bSkip = this._setOptValue(newval);
          break;

        case 'palette':
          this._setOptPalette(newval);

          break;

        case 'swatchSize':
          this._setOptSwatchSize(newval);

          break;

        case 'layout':
          this._setOptLayout(newval);

          break;

        case 'labelDisplay':
          this._setOptLabelDisplay(newval);

          break;

        case 'disabled':
          this._setOptDisabled(newval, true);

          break;

        case 'labelledBy':
          // remove the old one and add the new one
          this._updateLabelledBy(this.element[0], originalValue, newval, this._$LV);

          break;

        default:
          break;
      }

      if (!bSkip) {
        this._super(key, newval, flags);
      }
    },

    /**
     * If custom element, get the labelledBy option, and set this
     * onto the root dom element as aria-labelledby. We append "|label" so it matches the id that
     * is on the oj-label's label element.
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _updateLabelledBy: LabelledByUtils._updateLabelledBy,

    /**
     * @param {Event} event the associated Event object.
     * @param {Object} ui the context object.
     * @return {void}
     * @private
     * @memberof oj.ojColorPalette
     * @instance
     */
    _onLVOptionChange: function _onLVOptionChange(event, ui) {
      if (ui.option === 'selection') {
        this._selected(event, ui);
      }
    },

    /**
     * Wait for ListView to be ready, and complete the add/remove
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _waitForLV: function _waitForLV() {
      if (this._LVResolve) {
        return;
      }

      var self = this;
      this._LVResolve = Context.getContext(this._$LV[0]).getBusyContext();

      this._LVResolve.whenReady().then(function () {
        self._LVResolve = null;
        var stackEntry;
        var thisObj;
        var postOp;
        var newPalette;
        var i;
        var index; // Resolve palette's busy state

        self._resolvePaletteBusyContext();

        if (!self._opStack) {
          return;
        }

        postOp = false;

        for (i = 0; i < self._opStack.length; i++) {
          stackEntry = self._opStack[i];
          thisObj = stackEntry.obj;

          if (stackEntry.op === 'a' || stackEntry.op === 'r') {
            postOp = true;

            if (!newPalette) {
              newPalette = self._palette.slice(0);
            }

            if (stackEntry.op === 'a') {
              // add swatch
              newPalette.push(thisObj);
            } else if (stackEntry.op === 'r') {
              // remove swatch
              index = self._findIndexOfSwatchById(newPalette, thisObj.id);
              newPalette.splice(index, 1);
              stackEntry.index = index; // save doing this again later
            }
          }
        } // Fire the optionChange event for 'palette' add/remove


        if (postOp) {
          // Fire the optionChange event for 'palette'
          self._fireOptionChangeEvent('palette', newPalette, null); // internalSet is true in fireOptionChangeEvent, so update _palette now.


          while (self._opStack.length) {
            stackEntry = self._opStack.shift();
            thisObj = stackEntry.obj;

            if (stackEntry.op === 'a') {
              // add swatch
              self._palette.push(thisObj);
            } else if (stackEntry.op === 'r') {
              // remove swatch
              self._palette.splice(stackEntry.index, 1);
            }
          }
        }
      }, function () {
        Logger.error("JET Color Palette (id='" + self.element.attr('id') + "'): ListView timed out.");
        self._opStack = [];
      });
    },

    /**
     * Compares two color values (oj.Colors)
     * @param {oj.Color}   color1   a color to match
     * @param {oj.Color}   color2   a color to match
     * @returns {boolean}  true if colors match, else false.
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _compareColorValues: function _compareColorValues(color1, color2) {
      var t1 = color1 instanceof Color;
      var t2 = color2 instanceof Color;
      var ret = false;

      if (t1 && t2) {
        ret = color1.isEqual(color2);
      }

      return ret;
    },

    /**
     * Fire optionChange event
     * @param {string}  key             the option key whose property value has been changed.
     * @param {Object | null}  newVal   the new value after the change
     * @param {Event | null} origEvent  false if option change is not due to user interaction.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _fireOptionChangeEvent: function _fireOptionChangeEvent(key, newVal, origEvent) {
      if (key === 'palette') {
        this.option(key, newVal, {
          _context: {
            originalEvent: origEvent,
            internalSet: true
          },
          changed: true // don't need comparison check

        });
      } // end if "value"

    },

    /**
     * Find the supplied oj.Color in the palette and return the index to it.
     * @param {oj.Color}  color  the color to be found.
     * @returns {number}  the index in the palette array, or -1 if not found.
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _findColorInPalette: function _findColorInPalette(color) {
      var index = -1;
      var a = this._palette;
      var l = a.length;
      var i;
      var co;

      for (i = 0; i < l; i++) {
        co = a[i];

        if (color.isEqual(co.color)) {
          index = i;
          break;
        }
      }

      return index;
    },

    /**
     * Returns the swatch ID of the supplied oj.Color in the palette.
     * @param {oj.Color}  color  the color to be found.
     * @returns {string | null}  the ID of the swatch, or null if not found.
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _findSwatchIdOfColorInPalette: function _findSwatchIdOfColorInPalette(color) {
      var id = null;
      var a = this._palette;
      var l = a.length;
      var i;
      var co;

      for (i = 0; i < l; i++) {
        co = a[i];

        if (color.isEqual(co.color)) {
          id = co.id;
          break;
        }
      }

      return id;
    },

    /**
     * Returns the index to the swatch with the supplied ID in the array.
     * @param {string}  a   the array to be searched.
     * @param {string}  id   the ID to be found.
     * @returns {number}  the index to the swatch, or -1 if not found.
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _findIndexOfSwatchById: function _findIndexOfSwatchById(a, id) {
      var index = -1;
      var l = a.length;
      var i;
      var co;

      for (i = 0; i < l; i++) {
        co = a[i];

        if (co.id === id) {
          index = i;
          break;
        }
      }

      return index;
    },

    /**
     * set Palette BusyContext
     * @param {string} description
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setPaletteBusyContext: function _setPaletteBusyContext(description) {
      // The busy state resolver will be invoked when ListView completes the add.
      if (!this._resolve) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        this._resolve = busyContext.addBusyState({
          description: description
        });
      }
    },

    /**
     * Resolve PaletteBusyContext
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _resolvePaletteBusyContext: function _resolvePaletteBusyContext() {
      if (this._resolve) {
        this._resolve();

        this._resolve = null;
      }
    },

    /**
     * Swatch renderer  called from ojListView.
     * @param {Object}  context the ojListView context.
     * @return {Object}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _renderer: function _renderer(context) {
      var raw;
      var color;
      var label;
      var haveLabel;
      var showLabels;
      var none;
      var tooltip;
      color = context.data.color;

      if (!(color instanceof Color)) {
        // If color is undefined, will substitute black.
        color = Color.BLACK;
        Logger.warn("JET Color Palette (id='" + this.element.attr('id') + "'): Substituting Color.BLACK for an object that is not an instance of Color");
      }

      haveLabel = context.data.label;
      label = haveLabel;
      showLabels = this._labelDisplay === 'auto' && this._layout === 'list' && this._swatchSize === 'sm' || this._labelDisplay === 'auto' && this._layout === 'grid' && this._swatchSize === 'lg';

      if (color != null) {
        tooltip = label || this._convHex.format(color);

        if (showLabels) {
          label = tooltip || this._convHex.format(color);
          label = haveLabel ? label : label.toUpperCase();
        } else {
          label = null;
        }

        none = !!(this._isTransparent(color) || label && label.toLowerCase() === 'none');
      }

      var selectedClass = '';

      if (this._initSelection === context.data.id) {
        selectedClass = OJCP_SELECTED;
        this._initSelection = -1; // The swatch is not rendered yet so will note the parent.  Will find the
        // swatch to remove the selection highlighting on the next selection.

        this._selectedParent = context.parentElement;
      }

      var swatchClass;

      if (this._layout === 'list') {
        swatchClass = 'oj-colorpalette-swatchsize-' + this._swatchSize + (none ? ' oj-colorpalette-swatch-none' : '');
      } else {
        swatchClass = this._swatchClass + (none ? ' oj-colorpalette-swatch-none' : '');
      }

      if (none) {
        // transparent color required
        raw = this._renderNone(showLabels, label, tooltip, swatchClass, selectedClass); // transparent color
      } else {
        //  standard swatch
        raw = this._renderStandard(color, showLabels, label, tooltip, swatchClass, selectedClass);
      }

      return raw;
    },

    /**
     * Render a standard swatch
     * @param {oj.Color}  color
     * @param {boolean}   showLabels
     * @param {string}    label
     * @param {string}    tooltip
     * @param {string}    swatchClass
     * @param {string}    selectedClass
     * @return {Object}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _renderStandard: function _renderStandard(color, showLabels, label, tooltip, swatchClass, selectedClass) {
      var entry = $("<div class='oj-colorpalette-swatch-entry'></div>").addClass(swatchClass + (showLabels ? ' oj-colorpalette-swatch-showlabel' : '')).append($("<div class='oj-colorpalette-swatch-container'></div>") // @HTMLUpdateOK
      .append($("<div class='oj-colorpalette-swatch'></div>") // @HTMLUpdateOK
      .attr('title', !label ? tooltip : null).addClass(selectedClass).css('backgroundColor', color.toString())));

      if (label) {
        entry.append($("<span class='oj-colorpalette-swatch-text'>" + label + '</span>')[0]); // @HTMLUpdateOK
      }

      return entry[0];
    },

    /**
     * Render a 'none' swatch.
     * @param {boolean}   showLabels
     * @param {string} label
     * @param {string}    tooltip
     * @param {string} swatchClass
     * @param {string} selectedClass
     * @return {Object}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _renderNone: function _renderNone(showLabels, label, tooltip, swatchClass, selectedClass) {
      var raw;
      raw = "<div class='oj-colorpalette-swatch-entry " + swatchClass + (showLabels ? ' oj-colorpalette-swatch-showlabel' : '') + "'>" + "<div class='oj-colorpalette-swatch-container'>" + "<div class='oj-colorpalette-swatch " + selectedClass + "'" + (!label ? " title='" + tooltip + "'" : '') + '>' + "<div class='oj-colorpalette-swatch-none-icon'>" + '</div>' + '</div>' + '</div>';

      if (label) {
        raw += "<span class='oj-colorpalette-swatch-text'>" + label + '</span>';
      }

      raw += '</div>';
      return $(raw)[0];
    },

    /**
     * Handle selection event of a swatch from ListView
     * @param {Event}   event  the associated Event object.
     * @param {Object}  ui the context object.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _selected: function _selected(event, ui) {
      var newColor = null;
      var swatch;
      var lastSelected; // Color the internal swatch border (normally transparent) so that it
      // shows as selected.

      swatch = $(ui.items[0]).find('.oj-colorpalette-swatch');
      swatch.addClass(OJCP_SELECTED); // Remove the last selected swatch highlighting

      lastSelected = this._selectedSwatch;
      this._selectedSwatch = swatch;

      if (!lastSelected) {
        // Do we have an initial selection to remove
        if (this._selectedParent) {
          lastSelected = $(this._selectedParent).find('.oj-colorpalette-swatch');
          this._selectedParent = null;
        }
      }

      if (lastSelected) {
        lastSelected.removeClass(OJCP_SELECTED);
      } // Fire value-changed event


      if (ui.value.length === 1) {
        for (var i = 0; i < this._palette.length; i++) {
          // listview sends the id in the selection event
          // it may not be the same as the index after palette is updated
          // so comparing with the id here instead of index
          if (this._palette[i].id === ui.value[0]) {
            newColor = this._palette[i].color;
            break;
          }
        }
      } else {
        // No value, probably because its a deselection caused by a changing the pallete
        // option and the current value is not in the new palette.  Will leave the value
        // as is, and not fire a value change event.
        return;
      }

      this._SetValue(newColor, event);

      this._value = newColor;
    },

    /**
     * Handle "disabled" option change.
     * @param {boolean}  disabled  the "disabled" option value.
     * @param {boolean} applyOnlyIfDifferent Only apply the new value if it's different from the
     *        current value.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setOptDisabled: function _setOptDisabled(disabled, applyOnlyIfDifferent) {
      var $swatches;
      var t;
      var change = !applyOnlyIfDifferent || applyOnlyIfDifferent && disabled !== this._disabled;

      if (change) {
        if (this._$LV) {
          this._$LV.ojListView('option', 'disabled', disabled);
        }

        $swatches = $('.oj-colorpalette-container .oj-colorpalette-swatch');
        t = this; // Enable/diable the appearance of the swatches

        if (disabled) {
          //  ListView doesn't show any difference to the disabled items, so do it here
          this._disabledBG = [];
          $.each($swatches, function (i, obj) {
            t._disabledBG.push(obj.style.backgroundColor); // eslint-disable-next-line no-param-reassign


            obj.style.backgroundColor = '#eee';
          });
        } else {
          if (this._disabledBG && this._disabledBG.length) {
            $.each($swatches, function (i, obj) {
              // eslint-disable-next-line no-param-reassign
              obj.style.backgroundColor = t._disabledBG[i];
            });
          }

          this._disabledBG = null;
        }

        this._disabled = disabled;
      }
    },

    /**
     * Handle "value" option change.
     * @param {oj.Color}  color  the "value" option color.
     * @return {boolean}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setOptValue: function _setOptValue(color) {
      var palIndex = -1;
      var pal = [];

      if (this._palette.length > 0) {
        if (color instanceof Color) {
          // Check if value has changed
          if (!this._compareColorValues(this._value, color)) {
            // Color is different from current
            palIndex = this._findColorInPalette(color); // Fix  - COULD NOT CHANGE A PALETTE VALUE FROM JAVASCRIPT
            // use the id instead of the index
            // this is needed because listview is looking up the id for selection

            if (palIndex >= 0 && this._palette[palIndex].id != null) {
              // Found in palette, so select it
              var palId = this._palette[palIndex].id;
              pal.push(palId);
            }

            this._$LV.ojListView('option', 'selection', pal); // select, or deselect if not found


            this._value = color;
          }
        }
      }

      return pal.length > 0; // return true if at least one palette color is selected
    },

    /**
     * Handle "palette" option change.
     * @param {Array}  palette  the "palette" option array.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setOptPalette: function _setOptPalette(palette) {
      if ($.isArray(palette)) {
        if (!this._isPaletteEqual(palette, this._palette)) {
          // Palettes are different
          // Add a palette busy state for the rerender of the ListView
          // The busy state resolver will be invoked when ListView completes the add.
          this._setPaletteBusyContext('The palette (id=' + this.element.attr('id') + ') option change in progress.');

          this._opStack = []; // clear the fifo stack of post-busy operations

          this._palette = palette.slice(0); // make copy in case app is using same array

          this._initSelection = this._findColorInPalette(this._value);

          this._setData(palette, this._initSelection, true);

          this._waitForLV();
        }
      }
    },

    /**
     * Handle "swatchSize" option change.
     * @param {string} swatchSize
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setOptSwatchSize: function _setOptSwatchSize(swatchSize) {
      if (typeof swatchSize === 'string') {
        if (swatchSize !== this._swatchSize) {
          this._swatchSize = swatchSize;
          var suffix = swatchSize === 'lg' || swatchSize === 'sm' ? swatchSize : 'xs';
          this._swatchClass = 'oj-colorpalette-swatchsize-' + suffix;

          this._$LV.ojListView('refresh');
        }
      }
    },

    /**
     * Handle "labelDisplay" option change.
     * @param {string}  labelDisplay  the "labelDisplay" option value.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setOptLabelDisplay: function _setOptLabelDisplay(labelDisplay) {
      if (typeof labelDisplay === 'string') {
        if (labelDisplay !== this._labelDisplay) {
          if (labelDisplay === 'auto' || labelDisplay === 'off') {
            this._labelDisplay = labelDisplay;

            this._$LV.ojListView('refresh');
          }
        }
      }
    },

    /**
     * Handle "layout" option change.
     * @param {string}  layout  the "layout" option value.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setOptLayout: function _setOptLayout(layout) {
      if (typeof layout === 'string') {
        if (layout !== this._layout) {
          this._layout = layout;

          this._setDisplayFormat();

          this._$LV.ojListView('refresh');
        }
      }
    },

    /**
     * Update the ListView display format
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setDisplayFormat: function _setDisplayFormat() {
      var grid = this._layout === 'grid';
      var layoutClass = grid ? 'oj-colorpalette-grid' : 'oj-colorpalette-list';

      this._$LV.removeClass('oj-colorpalette-grid oj-colorpalette-list oj-listview-card-layout');

      this._$LV.addClass(layoutClass);

      if (grid) {
        this._$LV.addClass('oj-listview-card-layout');
      }
    },

    /**
     * Update the ListView data option
     * @param {Array} palette
     * @param {number} initSelected
     * @param {boolean} setOption
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setData: function _setData(palette, initSelected, setOption) {
      this._addIdsToPalette(palette); // add "id" props


      this._palDataSource = new oj.ArrayTableDataSource(palette, {
        idAttribute: 'id'
      }); //  If current value property matches a supplied swatch, select it.

      if (initSelected >= 0) {
        // use the id instead of the index
        // this is needed because after palette changes, the id and index may not match
        // and listview is looking up the id for selection
        if (this._palette[initSelected].id) {
          // eslint-disable-next-line no-param-reassign
          initSelected = this._palette[initSelected].id;
        }

        if (this._palInitSelected.length === 0) {
          this._palInitSelected.push(initSelected);
        } else {
          this._palInitSelected[0] = initSelected;
        }
      }

      if (setOption) {
        this._$LV.ojListView('option', 'data', this._palDataSource);
      }
    },

    /**
     * Initializes the widget, examines options and sets up
     * internal data structures.
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _initPalette: function _initPalette() {
      this._setPaletteBusyContext('Palette (id=' + this.element.attr('id') + ') is initializing.');

      this._initData();

      this._setup();
    },

    /**
     * Perform setup, and init the ListView
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _setup: function _setup() {
      // Add new listview markup as a child of this component's DOM element
      this._$boundElem.append(this._markup); // @HTMLUpdateOK (strings are all code constants)


      this._$boundElem.addClass('oj-colorpalette');

      this._$paletteContainer = this._$boundElem.find('.oj-colorpalette-container');
      this._$LV = this._$paletteContainer.find(':first'); // Listview UL
      // Will be using a component context for the ListView

      this._$LV.attr('data-oj-context', ''); //  If value property matches a supplied swatch, note for initial selection.


      if (this._value && this._value instanceof Color) {
        this._initSelection = this._findColorInPalette(this._value);
      }

      this._swatchId = 0; // use  _getNextSwatchId() to access

      this._setData(this._palette, this._initSelection, false);
    },

    /**
     * Set up instance data
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _initData: function _initData() {
      this._applyOptions(); // process the component options


      var converterOptions = {
        format: 'hex'
      };
      this._convHex = new ColorConverter(converterOptions);
      this._labelNone = this.getTranslatedString(TRANSKEY_NONE);
      var layoutClass;

      if (this._layout === 'grid') {
        layoutClass = 'oj-colorpalette-grid oj-listview-card-layout';
      } else {
        layoutClass = 'oj-colorpalette-list';
      } //  Create the inner ListView markup


      this._markup = function () {
        return ["<div class='oj-colorpalette-container oj-form-control-container'>", "<ul class='" + layoutClass + "'/>", '</div>'].join('');
      }();
    },

    /**
     * Process the component options
     * @return {void}
     * @memberof oj.ojColorPalette
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
      this._palInitSelected = [];
      this._palDataSource = null;
      opt = opts.swatchSize;

      if (typeof opt === 'string') {
        opt = opt.toLowerCase();

        if (opt !== 'lg' && opt !== 'sm' && opt !== 'xs') {
          opt = 'lg';
        }
      }

      this._swatchSize = opt;
      this._swatchClass = 'oj-colorpalette-swatchsize-' + opt;
      opt = opts.labelDisplay;

      if (typeof opt === 'string') {
        opt = opt.toLowerCase();

        if (opt !== 'auto' && opt !== 'off') {
          opt = 'auto';
        }
      }

      this._labelDisplay = opt;
      opt = opts.layout;

      if (typeof opt === 'string') {
        opt = opt.toLowerCase();

        if (opt !== 'grid' && opt !== 'list') {
          opt = 'grid';
        }

        if (opt !== 'grid' && this._swatchSize === 'xs') {
          opt = 'grid';
        }
      }

      this._layout = opt;
      opt = opts.value;

      if (!(opt instanceof Color)) {
        opt = null;
      }

      this._value = opt || Color.BLACK;
      opt = opts.palette;

      if (!$.isArray(opt)) {
        opt = [];
      }

      this._palette = opt.slice(0);
      opt = opts.disabled;

      if (typeof opt === 'boolean') {
        this._disabled = opt;
      }
    },

    /**
     * Returns true if an oj.Color represents the 'transparent'.
     * @param {oj.Color} color the color object to be tested.
     * @returns {boolean}  true if oj.Color is transparent, else false.
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _isTransparent: function _isTransparent(color) {
      var r = color.getRed();
      var g = color.getGreen();
      var b = color.getBlue();
      var a = color.getAlpha();
      return r === 0 && g === 0 && b === 0 && a === 0;
    },

    /**
     * Compare two palette arrays. (index property is not checked.)
     * @param {Array} pal1
     * @param {Array} pal2
     * @return {boolean}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _isPaletteEqual: function _isPaletteEqual(pal1, pal2) {
      var len1 = pal1.length;
      var len2 = pal2.length;
      var lab1;
      var lab2;
      var o1;
      var o2;
      var i;
      var ret = false;

      if (len1 === len2) {
        for (i = 0; i < len1; i++) {
          o1 = pal1[i];
          o2 = pal2[i];

          if (this._compareColorValues(o1.color, o2.color)) {
            lab1 = o1.label;
            lab2 = o2.label;

            if (lab1 !== lab2) {
              break;
            }
          }
        }

        ret = i >= len1;
      }

      return ret;
    },

    /**
     * Add "id" property to palette entries
     * @param {Array} palette
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _addIdsToPalette: function _addIdsToPalette(palette) {
      var l = palette.length;

      for (var i = 0; i < l; i++) {
        var o = palette[i];
        o.id = this._getNewSwatchId();
      }
    },

    /**
     * Returns a new (unique) swatch id.
     * @returns {string} swatch id
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _getNewSwatchId: function _getNewSwatchId() {
      var s = this._swatchId.toString();

      this._swatchId += 1;
      return s;
    },

    /**
     * Clear resources
     * @return {void}
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _clear: function _clear() {
      this._convHex = null;
      this._markup = null;
      this._$LVElem = null;
      this._$LV = null;
      this._$LVWidget = null;
    },

    /**
     * Get the width of a vertical scrollbar.
     * @returns {number} Width of a vertical scrollbar
     * @memberof oj.ojColorPalette
     * @instance
     * @private
     */
    _getScrollbarWidth: function _getScrollbarWidth() {
      var div = document.createElement('div');
      div.style.overflow = 'scroll';
      div.style.width = '100px';
      div.style.height = '100px';
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      var innerDiv = document.createElement('div');
      innerDiv.style.width = '100%';
      innerDiv.style.height = '100%';
      div.appendChild(innerDiv);
      this.element.append(div); // @HTMLUpdateOK

      var outerWidth = div.offsetWidth;
      var innerWidth = innerDiv.offsetWidth;
      $(div).remove();
      return outerWidth - innerWidth;
    },

    /**
     * Returns a jquery object of the launcher element representing the content nodes.
     * @returns {Object}
     * @protected
     * @override
     * @instance
     * @memberof oj.ojColorPalette
     */
    _GetMessagingLauncherElement: function _GetMessagingLauncherElement() {
      return this.element;
    },

    /**
     * Returns a jquery object of the elements representing the content nodes (spectrum thumb).
     * @returns {Object}
     * @protected
     * @override
     * @instance
     * @memberof oj.ojColorPalette
     */
    _GetContentElement: function _GetContentElement() {
      return this._$LV;
    },

    /**
     * Returns the element's value. Normally, this is a call to this.element.val(), but for some
     * components, it could be something else. E.g., for ojRadioset the element's value is really the
     * value of the selected radio in the set.
     * @returns {oj.Color} color value
     * @override
     * @memberof oj.ojColorPalette
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
     * @memberof oj.ojColorPalette
     * @instance
     * @protected
     * @override
     */
    _SetDisplayValue: function _SetDisplayValue(displayValue) {
      // If displayValue is null/undefined, will substitute black.
      if (displayValue) {
        if (typeof displayValue === 'string') {
          this._value = new Color(displayValue);
        } else {
          this._value = displayValue;
        }
      } else {
        this._value = Color.BLACK;
        Logger.warn("JET Color Palette (id='" + this.element.attr('id') + "'): Substituting Color.BLACK since display value is not defined.");
      }
    },

    /**
     * Returns the display value that is ready to be passed to the converter.
     *
     * @return {string} usually a string display value
     *
     * @memberof oj.ojColorPalette
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
     * @memberof oj.ojColorPalette
     * @instance
     * @protected
     * @override
     */
    _GetDefaultStyleClass: function _GetDefaultStyleClass() {
      return 'oj-colorpalette';
    } // Fragments:

    /**
     * Sets a property or a single subproperty for complex properties and notifies the component
     * of the change, triggering a [property]Changed event.
     *
     * @function setProperty
     * @param {string} property - The property name to set. Supports dot notation for subproperty access.
     * @param {any} value - The new value to set the property to.
     *
     * @expose
     * @memberof oj.ojColorPalette
     * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
     * @instance
     *
     * @example <caption>Set a single subproperty of a complex property:</caption>
     * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
     */

    /**
     * Retrieves a value for a property or a single subproperty for complex properties.
     * @function getProperty
     * @param {string} property - The property name to set. Supports dot notation for subproperty access.
     * @return {any}
     *
     * @expose
     * @memberof oj.ojColorPalette
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
     * @memberof oj.ojColorPalette
     * @instance
     *
     * @example <caption>Set a batch of properties:</caption>
     * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
     */

    /**
     * <p>Sub-ID for a palette swatch item at a specific index.</p>
     *
     * @ojsubid oj-palette-entry
     * @memberof oj.ojColorPalette
     *
     * @example <caption>Get the palette's internal JET ListView entry for the third palette swatch:</caption>
     * var node = myColorPalette.getNodeBySubId({'subId': 'oj-palette-entry', 'index': 2});
     */

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
     *       <td>Swatch</td>
     *       <td><kbd>Space or Enter</kbd></td>
     *       <td>Select a color swatch.</tr>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>PgDn</kbd></td>
     *       <td>Navigates down the swatch display to the next page.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>PgUp</kbd></td>
     *       <td>Navigates up the swatch display to the previous page.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Navigate to the next swatch if in list layout, or to the swatch in the same position in the next row if in grid layout.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Navigate to the previous swatch if in list layout, or to the swatch in the same position in the previous row if in grid layout.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Navigate to the next swatch.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Navigate to the previous swatch.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojColorPalette
     */

  }); // end    $.widget("oj.ojColorPalette", ...

})();



/* global __oj_color_palette_metadata */
(function () {
  __oj_color_palette_metadata.extension._WIDGET_NAME = 'ojColorPalette';
  oj.CustomElementBridge.register('oj-color-palette', {
    metadata: __oj_color_palette_metadata
  });
})();

});