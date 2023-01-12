/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojtranslation', 'jquery', 'hammerjs', 'ojs/ojcontext', 'ojs/ojjquery-hammer', 'ojs/ojcomponentcore', 'ojs/ojdomutils'], function (exports, oj, Translations, $, Hammer, Context, ojjqueryHammer, ojcomponentcore, DomUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

  (function () {
var __oj_indexer_metadata = 
{
  "properties": {
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "deprecated",
              "since": "14.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "ariaDisabledLabel": {
          "type": "string"
        },
        "ariaInBetweenText": {
          "type": "string"
        },
        "ariaKeyboardInstructionText": {
          "type": "string"
        },
        "ariaOthersLabel": {
          "type": "string"
        },
        "ariaTouchInstructionText": {
          "type": "string"
        },
        "indexerCharacters": {
          "type": "string"
        },
        "indexerOthers": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
    __oj_indexer_metadata.extension._WIDGET_NAME = 'ojIndexer';
    __oj_indexer_metadata.extension._INNER_ELEM = 'ul';
    __oj_indexer_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['aria-label', 'aria-labelledby'];
    oj.CustomElementBridge.register('oj-indexer', { metadata: __oj_indexer_metadata });
  })();

  /**
   * The interface for oj.IndexerModel which should be implemented by all object instances
   * bound to the data parameter for ojIndexer.
   * @export
   * @since 1.2
   * @interface oj.IndexerModel
   */

  const IndexerModel = function () {};
  oj._registerLegacyNamespaceProp('IndexerModel', IndexerModel);

  // without the at-name tag, JSDoc tool prepends a "." to the field name for some reason, which messes up the QuickNav.
  /**
   * Constant for the section that represents all non-letters including numbers and symbols.
   * @export
   * @expose
   * @type {Object}
   * @property {string} id The id of this section
   * @property {string} label The label of this section
   * @name SECTION_OTHERS
   * @memberof oj.IndexerModel
   */
  IndexerModel.SECTION_OTHERS = {
    id: '__others__',
    label: Translations.getTranslatedString('oj-ojIndexer.indexerOthers')
  };

  /**
   * @typedef {string|Object} oj.IndexerModel.Section
   * @ojsignature {target:"Type", value:"string|{label: string}"}
   */

  /**
   * Make a section current in the Indexer.  The implementation should scroll the associated ListView so that the section becomes visible.
   * @param {string|Object} section the current section
   * @return {Promise.<string>|Promise.<Object>} a Promise which when resolved will return the section that the associated ListView actually scrolls to.
   *                   For example, the implementation could choose to scroll to the next available section in ListView if no data
   *                   exists for that section.
   * @method
   * @name setSection
   * @memberof oj.IndexerModel
   * @instance
   * @ojsignature {target: "Type",
   *               value: "(section: oj.IndexerModel.Section): Promise<oj.IndexerModel.Section>"}
   */

  /**
   * Returns an array of objects each representing a section in the associated ListView.  The section object could either be
   * a String or an object containing at least a 'label' field.  For example, the implementation may return an array of Strings
   * representing letters of the alphabet. Or it may return an array of objects each containing a 'label' field for the section
   * titles.
   * @return {Array.<string>|Array.<Object>} an array of all indexable sections
   * @method
   * @name getIndexableSections
   * @memberof oj.IndexerModel
   * @instance
   * @ojsignature {target: "Type", value: "(): oj.IndexerModel.Section[]"}
   */

  /**
   * Returns an array of objects each representing a section that does not have a corresponding section in the associated ListView.
   * It must be a subset of the return value of <code>getIndexableSections</code>.  Return null or undefined if there's nothing missing.
   * @return {Array.<string>|Array.<Object>} an array of missing sections
   * @method
   * @name getMissingSections
   * @memberof oj.IndexerModel
   * @instance
   * @ojsignature {target: "Type", value: "(): oj.IndexerModel.Section[]"}
   */

  (function () {
    // constants
    const _DATA_INCLUDES = 'data-includes';
    const _DATA_RANGE = 'data-range';
    const _DATA_OTHERS = 'data-others';

    /*!
     * JET Indexer @VERSION
     *
     *
     * Depends:
     *  jquery.ui.widget.js
     */

    /**
     * @ojcomponent oj.ojIndexer
     * @augments oj.baseComponent
     * @since 1.2.0
     *
     * @ojshortdesc An indexer displays a list of sections that corresponds to group headers of a list.
     * @ojrole slider
     *
     * @ojoracleicon 'oj-ux-ico-indexer'
     * @ojuxspecs ['indexer']
     *
     * @classdesc
     * <h3 id="indexerOverview-section">
     *   JET Indexer Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#indexerOverview-section"></a>
     * </h3>
     * <p>Description: The JET Indexer is usually associated with a scrollable JET ListView.  It provides a list of sections that
     *                 corresponds to group headers in ListView.  When a section is selected the corresponding group header will be
     *                 scroll to the top of the ListView.
     * </p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-indexer
     *   aria-controls='listview1'
     *   data='{{data}}'>
     * &lt;/oj-indexer>
     * </code>
     * </pre>
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
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     * The JET Indexer is accessible - it sets and maintains the appropriate aria- attributes,
     * including <code class="prettyprint">aria-valuenow</code>, <code class="prettyprint">aria-valuemax</code>,
     * <code class="prettyprint">aria-valuemin</code> and <code class="prettyprint">aria-orientation</code>.
     * <p>
     * Application developer should associate a ListView with the Indexer by specifying the id of the ListView in the aria-controls attribute in the Indexer.
     * </p>
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
     *       <td>Characters</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Selects the character in the indexer, which scrolls to the corresponding group header in the associated ListView.
     *           When tap on the ellipsis character, the character in between will be selected.</td>
     *     </tr>
     *     <tr>
     *       <td>Characters</td>
     *       <td><kbd>Pan</kbd></td>
     *       <td>Selects the character in the indexer, which scrolls to the corresponding group header in the associated ListView.
     *           When pan up and down the ellipsis character, the indexer will select the range of characters represented by the ellipsis.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojIndexer
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
     *       <td rowspan = "3" nowrap>Section</td>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Move focus to the section below.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Move focus to the section above.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Selects the current section.  No op if the section is already selected.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojIndexer
     */

    //-----------------------------------------------------
    //                   Sub-ids
    //-----------------------------------------------------

    /**
     * <p>Sub-ID for the sections within the Indexer.  See the <a href="#getNodeBySubId">getNodeBySubId</a>
     * method for details.</p>
     *
     * @ojsubid oj-indexer-section
     * @memberof oj.ojIndexer
     *
     * @example <caption>Get the node that represents the specified prefix 'A' in the indexer:</caption>
     * var node = myIndexer.getNodeBySubId({'subId': 'oj-indexer-section', 'section': 'A'});
     */

    //-----------------------------------------------------
    //                   Styling
    //-----------------------------------------------------
    /**
     * @ojstylevariableset oj-indexer-css-set1
     * @ojstylevariable oj-indexer-text-color {description: "Indexer text color", formats: ["color"], help: "#css-variables"}
     * @ojstylevariable oj-indexer-font-size {description: "Indexer font size", formats: ["length"], help: "#css-variables"}
     * @memberof oj.ojIndexer
     */
    // --------------------------------------------------- oj.ojIndexer Styling End -----------------------------------------------------------

    oj.__registerWidget('oj.ojIndexer', $.oj.baseComponent, {
      defaultElement: '<ul>',
      version: '1.2',
      widgetEventPrefix: 'oj',

      options: {
        /**
         * The data model for the Indexer which must be a oj.IndexerModel.  Currently the <a href="IndexerModelTreeDataProvider.html">IndexerModelTreeDataProvider</a>
         * is available that applications can use as the data for both ListView and the Indexer.  If not specified, then an empty indexer is rendered.
         *
         * @ojshortdesc The data provider for the Indexer.
         * @expose
         * @memberof! oj.ojIndexer
         * @instance
         * @type {Object}
         * @ojsignature {target:"Type", value:"IndexerModel", jsdocOverride:true}
         * @default null
         * @ojwebelementstatus {type: "deprecated", since: "14.0.0",
         *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
         *
         * @example <caption>Initialize the Indexer with an IndexModel:</caption>
         * &lt;oj-indexer data='{{myIndexerModel}}'>&lt;/oj-indexer>
         *
         * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
         * // getter
         * var dataValue = myIndexer.data;
         *
         * // setter
         * myIndexer.data = myIndexerModel;
         */
        data: null
      },

      /**
       * Creates the indexer
       * @override
       * @memberof! oj.ojIndexer
       * @protected
       */
      _ComponentCreate: function () {
        this._super();
        this._setup();
      },

      /**
       * Initialize the indexer after creation
       * @protected
       * @override
       * @memberof! oj.ojIndexer
       */
      _AfterCreate: function () {
        this._super();
        this._createIndexerContent();
        this._setAriaProperties();
        this._createInstructionText();
      },

      /**
       * Destroy the indexer
       * @memberof! oj.ojIndexer
       * @override
       * @private
       */
      _destroy: function () {
        this._super();

        var container = this._getIndexerContainer();

        this._unregisterResizeListener(container);
        this._unregisterTouchHandler(container);
        this._unsetAriaProperties();
        this.element.removeClass('oj-component-initnode');

        DomUtils.unwrap(this.element, container);
      },

      /**
       * Sets a single option
       * @memberof! oj.ojIndexer
       * @override
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _setOption: function (key, value) {
        this._superApply(arguments);
        if (key === 'data') {
          this.refresh();
        }
      },

      /**
       * Sets up resources needed by indexer
       * @memberof! oj.ojIndexer
       * @instance
       * @override
       * @protected
       */
      _SetupResources: function () {
        this._super();

        // register a resize listener and swipe handler
        var container = this._getIndexerContainer()[0];
        this._registerResizeListener(container);
        this._registerTouchHandler(container);
      },

      /**
       * Release resources held by indexer
       * @memberof! oj.ojIndexer
       * @instance
       * @override
       * @protected
       */
      _ReleaseResources: function () {
        this._super();

        var container = this._getIndexerContainer()[0];
        this._unregisterResizeListener(container);
        this._unregisterTouchHandler(container);

        // if there's outstanding busy state, release it now
        this._resolveBusyState();
      },

      /**
       * @private
       */
      _resolveBusyState: function () {
        if (this.busyStateResolve) {
          this.busyStateResolve(null);
          this.busyStateResolve = null;
        }
      },

      /**
       * Returns a jQuery object containing the root dom element of the indexer
       * @ignore
       * @expose
       * @override
       * @memberof! oj.ojIndexer
       * @instance
       * @return {jQuery} the root DOM element of the indexer
       */
      widget: function () {
        return this._getIndexerContainer();
      },

      /**
       * Redraw the entire indexer after having made some external modification.
       *
       * <p>This method does not accept any arguments.
       *
       * @ojshortdesc Redraw the entire indexer.
       * @expose
       * @memberof! oj.ojIndexer
       * @instance
       * @return {void}
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       * $( ".selector" ).ojIndexer( "refresh" );
       */
      refresh: function () {
        this._super();

        this.element.empty();
        this._createIndexerContent();
        this._setAriaProperties();
        this.m_current = null;
      },

      getNodeBySubId: function (locator) {
        if (locator == null) {
          return this.element ? this.element[0] : null;
        }

        var subId = locator.subId;
        if (subId === 'oj-indexer-section') {
          var section = locator.section;
          var sections = this.element.children('li');
          for (var i = 0; i < sections.length; i++) {
            var node = sections.get(i);
            var data = $(node).data(_DATA_RANGE);
            if (data === section) {
              return node;
            }

            // it's a separator, check the sections included in the range
            var includes = $(node).data(_DATA_INCLUDES);
            if (includes != null) {
              for (var j = 0; j < includes.length; j++) {
                if (includes[j] === section) {
                  return node;
                }
              }
            }
          }
        }
        // Non-null locators have to be handled by the component subclasses
        return null;
      },

      getSubIdByNode: function (node) {
        if (node != null) {
          var section = $(node).data(_DATA_RANGE);
          if (section != null) {
            return { subId: 'oj-indexer-section', section: section };
          }
        }

        return null;
      },

      /** **************************** core rendering **********************************/
      /**
       * Sets wai-aria properties on root element
       * @private
       */
      _setAriaProperties: function () {
        this.element
          .attr('role', 'slider')
          .attr('aria-orientation', 'vertical')
          .attr('aria-describedby', this.element.prop('id') + ':desc')
          .attr('aria-valuemin', 0)
          .attr('aria-valuemax', Math.max(0, this.element.children().length - 1));
      },

      /**
       * Removes wai-aria properties on root element
       * @private
       */
      _unsetAriaProperties: function () {
        this.element
          .removeAttr('role')
          .removeAttr('aria-orientation')
          .removeAttr('aria-describedby')
          .removeAttr('aria-valuemin')
          .removeAttr('aria-valuemax')
          .removeAttr('aria-valuetext');
      },

      /**
       * Create instruction text for screen reader
       * @private
       */
      _createInstructionText: function () {
        var key;

        if (DomUtils.isTouchSupported()) {
          key = 'ariaTouchInstructionText';
        } else {
          key = 'ariaKeyboardInstructionText';
        }

        var text = $(document.createElement('div'));
        text.prop('id', this.element.prop('id') + ':desc');
        text.addClass('oj-helper-hidden-accessible').text(this.getTranslatedString(key));

        this._getIndexerContainer().append(text); // @HTMLUpdateOK
      },

      /**
       * Retrieves the div around the root element, create one if needed.
       * @return {jQuery} the div around the root element
       * @private
       */
      _getIndexerContainer: function () {
        if (this.m_container == null) {
          this.m_container = this._createIndexerContainer();
        }
        return this.m_container;
      },

      /**
       * Creates the div around the root element.
       * @return {jQuery} the div around the root element
       * @private
       */
      _createIndexerContainer: function () {
        var container;
        if (this.OuterWrapper) {
          container = $(this.OuterWrapper);
        } else {
          container = $(document.createElement('div'));
          this.element.parent()[0].replaceChild(container[0], this.element[0]);
        }
        container.addClass('oj-indexer oj-component');
        container.prepend(this.element); // @HTMLUpdateOK

        return container;
      },

      /**
       * @private
       */
      _createIndexerContent: function () {
        var model = this._getIndexerModel();
        if (model == null) {
          return;
        }

        var root = this.element;
        var missingSections;
        var sections = model.getIndexableSections();
        if (model.getMissingSections) {
          missingSections = model.getMissingSections();
        }
        var sectionOthers = this.getTranslatedString('indexerOthers');
        var height = this.widget().outerHeight();

        // the first character is always present, use it to test height
        var first = this._createItem(sections[0], missingSections);
        root.append(first); // @HTMLUpdateOK

        // remove abbr first otherwise it will affect item height
        this._getIndexerContainer().removeClass('oj-indexer-abbr');
        if (this.m_itemHeight == null) {
          this.m_itemHeight = first.outerHeight();
        }
        // safeguard this.m_itemHeight from being 0, which shouldn't happen
        var itemHeight = Math.max(1, this.m_itemHeight);
        var max = Math.floor(height / itemHeight);

        // first +1 is to include the '#', second +1 is to include rendering of the symbol between letters
        var skip = Math.floor((sections.length + 1) / max) + 1;
        if (skip > 1) {
          // the height of item is a little different
          this._getIndexerContainer().addClass('oj-indexer-abbr');
        }

        for (var i = 1 + skip; i < sections.length; i = i + skip + 1) {
          if (skip > 1) {
            var separator = this._createSeparator(sections, i - skip, i - 1);
            root.append(separator); // @HTMLUpdateOK
          } else {
            i -= 1;
          }

          var section = sections[i];
          var item = this._createItem(section, missingSections);
          root.append(item); // @HTMLUpdateOK
        }

        // the last character is always present
        var last = this._createItem(sections[sections.length - 1], missingSections);
        root.append(last); // @HTMLUpdateOK

        // the special others character is always present
        var others = this._createItem(sectionOthers);
        others.attr('data-others', 'true');
        root.append(others); // @HTMLUpdateOK

        if (this.m_height == null) {
          this.m_height = height;
        }
      },

      /**
       * @private
       */
      _createItem: function (section, missingSections) {
        var label = section.label ? section.label : section;

        var item = $(document.createElement('li'));
        item.data(_DATA_RANGE, section).text(label);

        if (missingSections != null && missingSections.indexOf(section) > -1) {
          item.addClass('oj-disabled');
        }

        return item;
      },

      /**
       * @private
       */
      _createSeparator: function (sections, from, to) {
        var includes = [];
        var item = $(document.createElement('li'));
        item
          .addClass('oj-indexer-ellipsis')
          .data(_DATA_RANGE, sections[from + Math.round((to - from) / 2)]);
        for (var i = from; i <= to; i++) {
          includes.push(sections[i]);
        }
        item.data(_DATA_INCLUDES, includes);
        return item;
      },
      /** ************************** end core rendering **********************************/

      /** ****************************** event handler **********************************/
      /**
       * Initialize the indexer
       * @private
       */
      _setup: function () {
        var self = this;

        this.element.uniqueId().addClass('oj-component-initnode').attr('tabIndex', 0);

        this._on(this.element, {
          click: function (event) {
            self._handleClick(event);
          },
          keydown: function (event) {
            self._handleKeyDown(event);
          },
          focus: function (event) {
            self._handleFocus(event);
          },
          blur: function (event) {
            self._handleBlur(event);
          }
        });

        this._focusable({
          applyHighlight: true,
          setupHandlers: function (focusInHandler, focusOutHandler) {
            self._focusInHandler = focusInHandler;
            self._focusOutHandler = focusOutHandler;
          }
        });
      },

      /**
       * Event handler for when mouse click anywhere in the indexer
       * @param {Event} event mouseclick event
       * @private
       */
      _handleClick: function (event) {
        var target;

        // only perform events on left mouse, (right in rtl culture)
        if (event.button === 0) {
          target = $(event.target);
          this._setCurrent(target);
        }
      },

      /**
       * Handler for focus event
       * @param {Event} event the focus event
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _handleFocus: function (event) {
        this._getIndexerContainer().addClass('oj-focus-ancestor');
        if (this.m_current == null) {
          this._setFocus(this.element.children('li').first());
        } else {
          this._setFocus(this.m_current);
        }
      },

      /**
       * Handler for blur event
       * @param {Event} event the blur event
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _handleBlur: function (event) {
        this._getIndexerContainer().removeClass('oj-focus-ancestor');
      },

      /**
       * Event handler for when user press down a key
       * @param {Event} event keydown event
       * @private
       */
      _handleKeyDown: function (event) {
        var next;
        var processed = false;

        switch (event.keyCode) {
          // UP key
          case 38:
            next = this.m_current.prev();
            break;
          // DOWN key
          case 40:
            next = this.m_current.next();
            break;
          // ENTER key
          case 13:
            this._setCurrent(this.m_current);
            processed = true;
            break;
          default:
            break;
        }

        if (next != null && next.length > 0) {
          processed = true;
          this._setFocus(next);
        }

        if (processed) {
          event.preventDefault();
        }
      },

      _setFocus: function (item) {
        if (this.m_current != null) {
          this._focusOutHandler(this.m_current);
        }
        this._focusInHandler(item);

        this._updateAriaProperties(item);
        this.m_current = item;
      },

      /**
       * Retrieves the indexer model.
       * @private
       */
      _getIndexerModel: function () {
        var model = this.option('data');
        if (
          model != null &&
          (model.setSection === undefined || model.getIndexableSections === undefined)
        ) {
          throw new Error('Invalid IndexerModel');
        }
        return model;
      },

      /**
       * Sets the character item as current
       * @param {jQuery} item
       * @private
       */
      _setCurrent: function (item) {
        var section = item.data(_DATA_RANGE);
        if (item.attr(_DATA_OTHERS)) {
          section = IndexerModel.SECTION_OTHERS;
        }

        this._setCurrentSection(section);
      },

      /**
       * Sets the section as current
       * @param {Object} section
       * @private
       */
      _setCurrentSection: function (section) {
        var self = this;
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        this.busyStateResolve = busyContext.addBusyState({ description: 'setCurrentSection' });

        // sets on the IndexerModel
        var promise = /** @type {Promise} */ (this._getIndexerModel().setSection(section));
        promise.then(
          function (val) {
            // the resolve value is the section that actually scrolls to
            if (val != null) {
              var item = self._findItem(val);
              if (item != null) {
                self._setFocus(item);
              }
            }

            self._resolveBusyState();
          },
          function () {
            self._resolveBusyState();
          }
        );
      },

      /**
       * Update wai-aria properties
       * @param {jQuery} item the item
       * @private
       */
      _updateAriaProperties: function (item) {
        var includes = item.data(_DATA_INCLUDES);
        var valueText = '';

        if (includes != null) {
          // length should always be > 0
          if (includes.length > 0) {
            var first = includes[0].label ? includes[0].label : includes[0];
            var second = includes[includes.length - 1].label
              ? includes[includes.length - 1].label
              : includes[includes.length - 1];
            valueText = this.getTranslatedString('ariaInBetweenText', {
              first: first,
              second: second
            });
          }
        } else {
          var val = item.data(_DATA_RANGE);
          // checks if it's the special others section
          if (val === IndexerModel.SECTION_OTHERS) {
            valueText = this.getTranslatedString('ariaOthersLabel');
          } else {
            valueText = val;
          }
        }

        // convey to screen reader that it's disabled
        if (item.hasClass('oj-disabled')) {
          valueText = valueText + '. ' + this.getTranslatedString('ariaDisabledLabel');
        }

        this.element.attr('aria-valuetext', valueText);
        this.element.attr('aria-valuenow', item.index());
      },

      /**
       * Finds the item with the specified section
       * @param {Object} section
       * @return {jQuery} the item, null if not found
       * @private
       */
      _findItem: function (section) {
        var children = this.element.children();

        for (var i = 0; i < children.length; i++) {
          var item = children.get(i);
          var value = $(item).data(_DATA_RANGE);
          var includes = $(item).data(_DATA_INCLUDES);

          if (
            (value != null && value === section) ||
            (includes != null && includes.indexOf(section) > -1)
          ) {
            return $(item);
          }
        }

        return null;
      },

      /**
       * Unregister event listeners for resize the container DOM element.
       * @param {Element} element the container DOM element
       * @private
       */
      _unregisterResizeListener: function (element) {
        if (element && this._resizeHandler) {
          // remove existing listener
          DomUtils.removeResizeListener(element, this._resizeHandler);
        }
      },

      /**
       * Register event listeners for resize the container DOM element.
       * @param {Element} element  DOM element
       * @private
       */
      _registerResizeListener: function (element) {
        if (element) {
          if (this._resizeHandler == null) {
            this._resizeHandler = this._handleResize.bind(this);
          }

          DomUtils.addResizeListener(element, this._resizeHandler);
        }
      },

      /**
       * Unregister panning handler
       * @param {Element} element  DOM element
       * @private
       */
      _unregisterTouchHandler: function (element) {
        if (this.hammer) {
          this.hammer.off('panstart panmove panend');
          $(element).ojHammer('destroy');
        }
        this.hammer = null;
      },

      /**
       * Register panning handler
       * @param {Element} element  DOM element
       * @private
       */
      _registerTouchHandler: function (element) {
        var self = this;
        var x;
        var y;
        var currentTarget;
        var currentSection;
        var currentY;

        var options = {
          recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]]
        };

        this.hammer = $(element)
          .ojHammer(options)
          .on('panstart', function (event) {
            var target = event.gesture.target;
            // for x, don't use the target, use x relative to the indexer to ensure it reflects item in Indexer
            // even if the finger is off the Indexer
            x = self.element[0].getBoundingClientRect().left + 5;
            y = target.getBoundingClientRect().top;
            self._setCurrent($(target));

            currentTarget = target;
            currentSection = $(target).data(_DATA_RANGE);
            currentY = y;
          })
          .on('panmove', function (event) {
            // calculate point instead of using screenX/Y from touch is better since
            // 1) x stays constant
            // 2) in voiceover user could have pan anywhere on the screen
            var previousY = currentY;
            currentY = y + event.gesture.deltaY;

            var target = document.elementFromPoint(x, currentY);

            // should not happen
            if (target == null) {
              return;
            }

            var delta = currentY - previousY;
            var range;
            var section;

            if (currentTarget === target) {
              range = $(target).data(_DATA_INCLUDES);
              // if the section is a range (dot), then try to set the next section inside the range current
              // for example, if move on * which represents range BCD, if current is C then move up should go to B and move down should go to D
              if (range != null) {
                var index = range.indexOf(currentSection);
                section = null;
                if (delta > 0 && index < range.length - 1) {
                  section = range[index + 1];
                } else if (delta < 0 && index > 0) {
                  section = range[index - 1];
                }

                if (section != null) {
                  currentSection = section;
                  self._setCurrentSection(section);
                }
              }
            } else if ($(target).data(_DATA_RANGE)) {
              range = $(target).data(_DATA_INCLUDES);
              section = null;
              // if the target is a range (dot), check to see if we should set the section to the beginning of
              // range or end of range.  For example, if you have A * E with * represents BCD, coming from A should go to B
              // where as coming from E should go to D.
              if (range != null) {
                if (delta > 0 && target === currentTarget.nextElementSibling) {
                  section = range[0];
                } else if (delta < 0 && target === currentTarget.previousElementSibling) {
                  section = range[range.length - 1];
                }
              }

              if (section == null) {
                section = $(target).data(_DATA_RANGE);
              }

              currentTarget = target;
              currentSection = section;

              self._setCurrentSection(currentSection);
            }
          })
          .on('panend', function () {
            currentTarget = null;
            currentSection = null;
            currentY = null;
          });
      },

      /**
       * The resize handler.
       * @param {number} width the new width
       * @param {number} height the new height
       * @private
       */
      _handleResize: function (width, height) {
        if (height > 0 && height !== this.m_height) {
          this.refresh();
          this.m_height = height;
        }
      }
    });
  })();

  /**
   * Implementation of the IndexerModel used by ListView.  This implementation groups the data based on the first letter of the
   * group header text and the alphabet of the current locale.
   * @export
   * @ojtsnoexport
   * @param {Object} listview the internal ListView instance
   * @class oj.ListViewIndexerModel
   * @implements oj.IndexerModel
   * @classdesc Implementation of IndexerModel used by ListView.
   * @extends EventSource
   * @constructor
   * @ignore
   */
  const ListViewIndexerModel = function (listview) {
    this.listview = listview;
    this.Init();
  };
  oj._registerLegacyNamespaceProp('ListViewIndexerModel', ListViewIndexerModel);
  // Subclass from oj.EventSource
  oj.Object.createSubclass(ListViewIndexerModel, oj.EventSource, 'oj.ListViewIndexerModel');

  /**
   * @export
   * Returns the sections displayed by the Indexer.
   * @returns {Array.<Object>} an array of sections
   * @memberof! oj.ListViewIndexerModel
   */
  ListViewIndexerModel.prototype.getIndexableSections = function () {
    var sections = this.listview.ojContext.getTranslatedString('indexerCharacters');
    return sections.split('|');
  };

  /**
   * @export
   * Returns the sections that are missing in the associated ListView.
   * @return {Array.<Object>} an array of sections that are missing.
   * @memberof! oj.ListViewIndexerModel
   */
  ListViewIndexerModel.prototype.getMissingSections = function () {
    if (this.missingSections == null) {
      this.missingSections = this._getMissingSections();
    }

    return this.missingSections;
  };

  /**
   * Returns the sections that are currently missing.
   * @private
   */
  ListViewIndexerModel.prototype._getMissingSections = function () {
    var results = [];
    var groupItems = this.listview._getGroupItemsCache();
    var sections = this.getIndexableSections();
    var i;

    for (i = 0; i < sections.length; i++) {
      var section = sections[i];
      var found = false;
      // eslint-disable-next-line no-loop-func
      groupItems.each(function () {
        var content = $(this).text();
        if (content.length > 0 && content.charAt(0) === section) {
          found = true;
          return false;
        }
        return true;
      });

      if (!found) {
        results.push(section);
      }
    }

    return results;
  };

  /**
   * @export
   * Sets the current section.  When associated with a ListView, this will scroll the ListView to the corresponding group header.
   * @param {Object} section the current section
   * @return {Promise} a Promise object which when resolve will return the section that the IndexerModel actually sets as current.
   * @memberof! oj.ListViewIndexerModel
   */
  ListViewIndexerModel.prototype.setSection = function (section) {
    if (section === IndexerModel.SECTION_OTHERS) {
      return this._setOtherSection();
    }

    return this._setSection(section);
  };

  /**
   * Sets the 'Other' section as current
   * @private
   */
  ListViewIndexerModel.prototype._setOtherSection = function () {
    var sections = this.getIndexableSections();
    var self = this;

    return new Promise(function (resolve) {
      var match = null;

      // find the group header that DOES NOT match ANY of the sections
      self.listview._getGroupItemsCache().each(function () {
        var content = $(this).text();
        for (var i = 0; i < sections.length; i++) {
          var section = sections[i];
          if (content.indexOf(section) === 0) {
            // skip and check next group header
            return true;
          }
        }

        match = this;
        return false;
      });

      if (match) {
        self.listview._scrollToGroupHeader(match);
        resolve(IndexerModel.SECTION_OTHERS);
      } else {
        resolve(null);
      }
    });
  };

  /**
   * Sets the specified section as current.
   * @private
   */
  ListViewIndexerModel.prototype._setSection = function (section) {
    var sections = this.getIndexableSections();
    var index = sections.indexOf(section);
    var self = this;

    return new Promise(function (resolve) {
      if (index === -1) {
        // if it's not even in the indexable sections, then we don't need to process anymore
        resolve(null);
      } else {
        var match = null;

        // try to find the group header, use the next section as needed
        for (; index < sections.length; index++) {
          var _section = sections[index];
          var groupHeader = self._findGroupHeader(_section);
          if (groupHeader != null) {
            self.listview._scrollToGroupHeader(groupHeader);
            match = _section;
            break;
          }
        }

        resolve(match);
      }
    });
  };

  /**
   * Finds the group header with the specified section
   * @private
   */
  ListViewIndexerModel.prototype._findGroupHeader = function (section) {
    var match;

    this.listview._getGroupItemsCache().each(function () {
      var content = $(this).text();
      if (content.indexOf(section) === 0) {
        match = this;
        return false;
      }
      return true;
    });

    return match;
  };

  exports.ListViewIndexerModel = ListViewIndexerModel;

  Object.defineProperty(exports, '__esModule', { value: true });

});
