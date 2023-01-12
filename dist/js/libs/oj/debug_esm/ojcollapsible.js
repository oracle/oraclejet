/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import { subtreeShown, subtreeHidden } from 'ojs/ojcomponentcore';
import Context from 'ojs/ojcontext';
import { unwrap, isValidIdentifier } from 'ojs/ojdomutils';
import 'ojs/ojcustomelement';
import 'ojs/ojanimation';
import { CustomElementUtils } from 'ojs/ojcustomelement-utils';

var __oj_collapsible_metadata = 
{
  "properties": {
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "expandArea": {
      "type": "string",
      "enumValues": [
        "disclosureIcon",
        "header"
      ],
      "value": "header"
    },
    "expanded": {
      "type": "boolean",
      "writeback": true,
      "value": false,
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "deprecated",
              "since": "13.0.0",
              "description": "Use doCollapse/doExpand instead"
            }
          ]
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {}
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
  "events": {
    "ojBeforeCollapse": {},
    "ojBeforeExpand": {},
    "ojCollapse": {},
    "ojExpand": {}
  },
  "extension": {}
};
/* global __oj_collapsible_metadata */
(function () {
  __oj_collapsible_metadata.extension._WIDGET_NAME = 'ojCollapsible';
  __oj_collapsible_metadata.extension._CONTROLS_SUBTREE_HIDDEN = true;
  oj.CustomElementBridge.register('oj-collapsible', { metadata: __oj_collapsible_metadata });
})();

/**
 * @ojcomponent oj.ojCollapsible
 * @augments oj.baseComponent
 * @since 0.6.0
 *
 * @class oj.ojCollapsible
 * @ojshortdesc A collapsible displays a header that can be expanded to show its content.
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["expandArea", "expanded", "disabled"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 2
 *
 * @ojoracleicon 'oj-ux-ico-collapsible'
 * @ojuxspecs ['collapsible-header']
 *
 * @classdesc
 * <h3 id="collapsibleOverview-section">
 *   JET Collapsible
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#collapsibleOverview-section"></a>
 * </h3>
 *
 * <p>Description: A JET Collapsible displays a header that can be expanded to show additional content beneath it.
 * The child element of the oj-collapsible in the named <a href="#header">header</a> slot is displayed in the header, while the child element in the <a href="#Default">default</a> slot is displayed as the content.
 *
 * <p>Note for performance reasons, if the collapsible content is expensive to render, you should wrap it in an <code class="prettyprint">oj-defer</code> element (API doc {@link oj.ojDefer}) to defer the rendering of that content.<br/>
 * See the Collapsible - Deferred Rendering demo for an example.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-collapsible>
 *   &lt;h3 slot='header'>Header 1&lt;/h3>
 *   &lt;p>Content 1&lt;/p>
 * &lt;/oj-collapsible>
 * </code></pre>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 *  </h3>
 *  To migrate from oj-collapsible to oj-c-collapsible, you need to revise the import statement and references to oj-c-collapsible in your app.
 *  In addition, please note the changes between the two components below.
 *  <h5>oj-header-border style class</h5>
 *  <p>The <code class="prettyprint">oj-header-border</code> style class should no longer be used with oj-c-collapsible.
 *     To display a divider between the collapsible header and content, set the <code class="prettyprint">variant</code> property value
 *     to <code class="prettyprint">horizontal-rule</code>
 *  </p>
 *  <h5>Child margins</h5>
 *   <p>By default, <code class="prettyprint">oj-c-collapsible</code> removes margins from children passed
 *      in the <code class="prettyprint">header</code> and default (content) slots. To preserve the margins,
 *      wrap the header or content elements in an extra <code class="prettyprint">div</code>.
 *   </p>
 *  <h5>expand-area attribute</h5>
 *   <p>The <code class="prettyprint">expand-area</code> attribute will not be supported in oj-c-collapsible.
 *      A click anywhere in the header area will toggle disclosure which has always been  the default behavior for oj-collapsible too.
 *   </p>
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
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>In the unusual case that the directionality (LTR or RTL) changes post-init, the collapsible must be <code class="prettyprint">refresh()</code>ed.
 *
 * <h3 id="data-attributes-section">
 *   Custom Data Attributes
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
 * </h3>
 *
 * <p>Collapsible supports the following custom data attributes.
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>data-oj-clickthrough</kbd></td>
 *       <td><p>Specify on any element inside the header where you want to control whether Collapsible should toggle disclosure by
 *           an event originating from the element or one of its descendants.</p>
 *           <p>For example, if you specify this attribute with a value of "disabled" on a button inside the header, then Collapsible
 *           will not trigger disclosure when user clicks on the button.</p>
 *       </td>
 *       <td>
 *         <pre class="prettyprint"><code>&lt;oj-collapsible>
 *   &lt;div slot="header">
 *     &lt;h3>Header 3&lt;/h3>
 *     &lt;oj-button data-oj-clickthrough="disabled">&lt;/oj-button
 *   &lt;/div>
 *   &lt;p>Content&lt;/p>
 * &lt;/oj-collapsible></code></pre>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 */
//-----------------------------------------------------
//                   Slots
//-----------------------------------------------------

/**
 * <p>The default slot is the collapsible's content.
 *
 * @ojchild Default
 * @memberof oj.ojCollapsible
 *
 * @example <caption>Initialize the Collapsible with child content specified:</caption>
 * &lt;oj-collapsible>
 *   &lt;h3 slot='header'>Header 1&lt;/h3>
 *   &lt;p>Content 1&lt;/p>
 * &lt;/oj-collapsible>
 */

/**
 * <p>The <code class="prettyprint">header</code> slot is the collapsible's header. If not specified, the header contains only an open/close icon. Note that the header text is required for JET collapsible for accessibility purposes.</p>
 *
 * @ojslot header
 * @memberof oj.ojCollapsible
 *
 * @example <caption>Initialize the Collapsible with the header slot specified:</caption>
 * &lt;oj-collapsible>
 *   &lt;h3 slot='header'>Header 1&lt;/h3>
 *   &lt;p>Content 1&lt;/p>
 * &lt;/oj-collapsible>
 */

/**
 * <p>Sub-ID for the disclosure icon of a Collapsible.</p>
 *
 * @ojsubid oj-collapsible-disclosure
 * @memberof oj.ojCollapsible
 * @example <caption>Get the Collapsible disclosure icon:</caption>
 * var node = myCollapsible.getNodeBySubId({"subId": "oj-collapsible-disclosure"});
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
 *       <td>Header</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Toggle disclosure state</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojCollapsible
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
 *       <td>Header</td>
 *       <td><kbd>Space or Enter</kbd></td>
 *       <td>Toggle disclosure state.</tr>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <p>Disabled items can receive keyboard focus, but do not allow any other interaction.
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojCollapsible
 */

//------------------------------------------------------
//                  Styling Start
//------------------------------------------------------
/**
 * Use on any element inside the header where you do not want Collapsible to process the click event.
 * @ojstyleclass oj-clickthrough-disabled
 * @ojdisplayname Prevent Clickthrough
 * @ojstyleselector oj-collapsible *
 * @ojdeprecated {since: '12.0.0', description: 'Specify data-oj-clickthrough attribute with value disabled instead.'}
 * @memberof oj.ojCollapsible
 * @ojtsexample
 * &lt;oj-collapsible id="collapsibleId">
 *   &lt;span slot='header'>
 *      &lt;h3>Header&lt;/h3>
 *      &lt;oj-button class="oj-clickthrough-disabled">Click&lt;/oj-button>
 *   &lt;/span>
 *   &lt;!-- Content -->
 * &lt;/oj-collapsible>
 */

(function () {
  var uid = 0;
  var OPEN_ICON = 'oj-collapsible-open-icon';
  var CLOSE_ICON = 'oj-collapsible-close-icon';

  const OJC_HEADER = 'oj-collapsible-header';
  const OJC_TRANSITION = 'oj-collapsible-transition';
  const OJC_DISCLOSURE = 'oj-collapsible-disclosure';

  const OJ_ARIA_EXPANDED = 'aria-expanded';
  const OJ_ARIA_HIDDEN = 'aria-hidden';

  oj.__registerWidget('oj.ojCollapsible', $.oj.baseComponent, {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * Specifies if the content is expanded.
       *
       * @expose
       * @memberof oj.ojCollapsible
       * @instance
       * @ojshortdesc Specifies if the content is expanded.
       * @type {boolean}
       * @default false
       * @ojwriteback
       * @ojeventgroup common
       * @ojwebelementstatus {
       *   type: "deprecated",
       *   since: "13.0.0",
       *   description: "Use doCollapse/doExpand instead"
       * }
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">expanded</code> attribute specified:</caption>
       * &lt;oj-collapsible expanded='true'>&lt;/oj-collapsible>
       *
       * @example <caption>Get or set the <code class="prettyprint">expanded</code> property after initialization:</caption>
       * // getter
       * var expandedValue = myCollapsible.expanded;
       *
       * // setter
       * myCollapsible.expanded = false;
       */
      expanded: false,

      /**
       * Disables the collapsible if set to <code class="prettyprint">true</code>.
       * @name disabled
       * @memberof oj.ojCollapsible
       * @instance
       * @ojshortdesc Disables the collapsible if set to true.
       * @type {boolean}
       * @default false
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">disabled</code> attribute specified:</caption>
       * &lt;oj-collapsible disabled='true'>&lt;/oj-collapsible>
       *
       * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
       * // getter
       * var disabledValue = myCollapsible.disabled;
       *
       * // setter
       * myCollapsible.disabled = false;
       */
      disabled: false,

      /**
       * The type of event to expand/collapse the collapsible.
       * To expand the collapsible on hover, use "mouseover".
       *
       * @ignore
       * @ojtsignore
       * @expose
       * @memberof oj.ojCollapsible
       * @instance
       * @type {string}
       * @default "click"
       */
      expandOn: 'click',

      /**
       * Where in the header to click to toggle disclosure.
       *
       * @expose
       * @memberof oj.ojCollapsible
       * @instance
       * @ojshortdesc Where in the header to click to toggle disclosure.
       * @type {string}
       * @ojvalue {string} "header" click any where in the header to toggle disclosure
       * @ojvalue {string} "disclosureIcon" click the disclosureIcon to toggle disclosure
       * @default "header"
       * @ojdeprecated {since: '14.0.0', description: 'The expand-area attribute should no longer be used and will be removed in the future.
       *                A click anywhere in the header area will toggle the disclosure (current default setting).'}
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">expand-area</code> attribute specified:</caption>
       * &lt;oj-collapsible expand-area='disclosureIcon'>&lt;/oj-collapsible>
       *
       * @example <caption>Get or set the <code class="prettyprint">expand-area</code> property after initialization:</caption>
       * // getter
       * var expandAreaValue = myCollapsible.expandArea;
       *
       * // setter
       * myCollapsible.expandArea = 'disclosureIcon';
       */
      expandArea: 'header',

      // callbacks
      /**
       * Triggered immediately before the collapsible is expanded.
       * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event, which prevents the content from expanding.
       *
       * @expose
       * @event
       * @memberof oj.ojCollapsible
       * @instance
       * @ojshortdesc Triggered immediately before the collapsible is expanded.
       * @ojcancelable
       * @property {Element} header The header that is about to be expanded.
       * @property {Element} content The content that is about to be expanded.
       */
      beforeExpand: null,

      /**
       * Triggered after the collapsible has been expanded (after animation completes).
       *
       * @expose
       * @event
       * @memberof oj.ojCollapsible
       * @instance
       * @ojshortdesc Triggered immediately after the collapsible is expanded.
       * @property {Element} header The header that was just expanded.
       * @property {Element} content The content that was just expanded.
       */
      expand: null,

      /**
       * Triggered immediately before the collapsible is collapsed.
       * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event, which prevents the content from collapsing.
       *
       * @expose
       * @event
       * @memberof oj.ojCollapsible
       * @instance
       * @ojshortdesc Triggered immediately before the collapsible is collapsed.
       * @ojcancelable
       * @property {Element} header The header that is about to be collapsed.
       * @property {Element} content The content that is about to be collapsed.
       */
      beforeCollapse: null,

      /**
       * Triggered after the collapsible has been collapsed.
       *
       * @expose
       * @event
       * @memberof oj.ojCollapsible
       * @instance
       * @ojshortdesc Triggered immediately after the collapsible is collapsed.
       * @property {Element} header The header that was just collapsed.
       * @property {Element} content The content that was just collapsed.
       */
      collapse: null
    },

    /**
     * @memberof oj.ojCollapsible
     * @instance
     * @protected
     * @override
     */
    _ComponentCreate: function () {
      this._super();

      //  - Stop using ui-helper-reset in the layout widgets.
      this.element.addClass('oj-collapsible oj-component');

      this._processPanels();
      this._refresh();

      //  - collapsible shouldn't implement _init()
      this._initialRender = true;

      // don't fire event on initial render
      var elem = this.element[0];
      this._expandCollapseHandler(
        this._createEventObject(elem, this.options.expanded ? 'ojexpand' : 'ojcollapse')
      );

      this._initialRender = undefined;
    },

    /**
     * Returns the focus element.
     * @return {Element} the focus element inside ojCollapsible or the root element
     * @protected
     * @ignore
     */

    GetFocusElement: function () {
      if (!this._isDisabled()) {
        return this._getCollapsibleIcon()[0];
      }

      return this.element[0];
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _createEventObject: function (element, type) {
      return {
        type: type,
        target: element,
        currentTarget: element,
        preventDefault: $.noop
      };
    },

    /**
     * @memberof oj.ojCollapsible
     * @param {Object} menu The JET Menu to open as a context menu
     * @param {Event} event What triggered the menu launch
     * @param {string} eventType "mouse", "touch", "keyboard"
     * @private
     */
    _NotifyContextMenuGesture: function (menu, event, eventType) {
      // Setting the launcher to the "twisty" icon, since that seems to be the only tabbable thing in the collapsible,
      // and it seems to remain tabbable even if the collapsible is disabled.  See the superclass JSDoc for _OpenContextMenu
      // for tips on choosing a launcher.
      this._OpenContextMenu(event, eventType, { launcher: this._getCollapsibleIcon().first() });
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _createIcons: function () {
      var options = this.options;
      var icon = options.expanded ? OPEN_ICON : CLOSE_ICON;
      var iconTag = this._isDisabled() ? $('<span>') : $('<a tabindex="0">');

      iconTag
        .addClass(
          'oj-component-icon oj-clickable-icon-nocontext oj-collapsible-header-icon ' + icon
        )
        .attr('aria-labelledby', this.header.attr('id'))
        .prependTo(this.headerWrapper); // @HTMLUpdateOK
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _destroyIcons: function () {
      this.headerWrapper.children('.oj-collapsible-header-icon').remove();
    },

    /**
     * @memberof oj.ojCollapsible
     * @override
     * @private
     */
    _destroy: function () {
      //  - ojcollapsible should resolve busy state when it's destroyed
      this._resolveBusyContext();
      this._cleanup();

      // clean up main element
      this.element.removeClass('oj-collapsible oj-component oj-expanded oj-collapsed oj-disabled');

      // clean up headers
      if (this._isDisabled()) {
        this._findFocusables(this.headerWrapper).removeAttr('tabIndex');
      }

      this.header.removeClass(OJC_HEADER).each(this._removeIdAttr.bind(this));

      // aria
      var focusable = this._findFirstFocusableInHeader();
      focusable
        .removeAttr('role')
        .removeAttr('aria-controls')
        .removeAttr(OJ_ARIA_EXPANDED)
        .removeAttr('aria-disabled');

      this._destroyIcons();

      // remove header wrapper
      if (this.header && this.headerWrapper) {
        unwrap(this.header);
        this.headerWrapper = null;
      }

      // clean up content panels
      this.content
        .css('display', '')
        .removeAttr(OJ_ARIA_HIDDEN)
        .removeAttr('tabIndex')
        .removeClass('oj-component-content oj-collapsible-content')
        .each(this._removeIdAttr.bind(this));
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _cleanup: function () {
      // remove listeners
      this._tearDownEvents();

      // remove wrapper
      if (this.content) {
        //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
        unwrap(this.content);
        this.wrapper = null;
      }
      // TODO: remove oj-disabled
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _isDisabled: function () {
      return this.element.hasClass('oj-disabled');
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _getExpandAreaSelector: function () {
      if (this.options.expandArea === 'header') {
        return '> .oj-collapsible-header-wrapper';
      }
      return '> .oj-collapsible-header-wrapper > .oj-collapsible-header-icon';
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _getCollapsibleIcon: function () {
      return this.headerWrapper.find('.oj-collapsible-header-icon');
    },

    /**
     * @memberof oj.ojCollapsible
     * @override
     * @private
     */
    _setOption: function (key, value, flags) {
      if (key === 'expanded') {
        if (value === this.options.expanded) {
          return;
        }

        if (value) {
          this.expand(true);
        } else {
          this.collapse(true);
        }
        return;
      }

      // #5332 - opacity doesn't cascade to positioned elements in IE
      // so we need to add the disabled class to the headers and panels
      if (key === 'disabled') {
        this._super(key, value, flags);
        this.refresh();
        return;
      }

      if (key === 'expandOn' || key === 'expandArea') {
        this._tearDownEvents();
        this._super(key, value, flags);
        this._setupEvents();
      } else {
        this._super(key, value, flags);
      }
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _keydown: function (event) {
      if (event.altKey || event.ctrlKey) {
        return;
      }
      var keyCode = $.ui.keyCode;

      switch (event.keyCode) {
        case keyCode.SPACE:
        case keyCode.ENTER:
          this._toggleHandler(event);
          break;
        default:
      }
    },

    /**
     * Refreshes the visual state of the collapsible.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojCollapsible
     * @instance
     * @return {void}
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myCollapsible.refresh();
     */
    refresh: function () {
      this._super();
      this._cleanup();
      this._processPanels();
      this._destroyIcons();
      this._refresh();
    },

    /**
     * Make sure the header slot is the first child of the root element
     * If the slot header is not specified, it will create one with empty text
     * @memberof oj.ojCollapsible
     * @private
     */
    _processHeaderSlots: function () {
      var elem = this.element[0];
      var newHeader = false;

      // add the header node if not specified
      var headers = CustomElementUtils.getSlotMap(elem).header;
      var header;

      if (headers && headers.length) {
        // exactly one child element has the "header" named slot
        if (headers.length === 1) {
          header = headers[0];
        } else {
          // multiple child elements have the "header" named slots, combine them
          var $header = $("<span slot='header'></span>");
          header = $header[0];

          for (var i = 0; i < headers.length; i++) {
            header.appendChild(headers[i]); // @HTMLUpdateOK
          }
          $header.children().attr('slot', '');
          newHeader = true;
        }
      } else {
        header = $("<span slot='header'></span>")[0];
        newHeader = true;
      }

      // make the header slot be the first child
      // Note prepend doesn't work in IE11 and Edge, use insertBefore instead
      if (newHeader || this.element.children().index(header) !== 0) {
        elem.insertBefore(header, elem.firstChild); // @HTMLUpdateOK
      }

      return $(header);
    },

    /**
     * Make sure the default slots are the last child of the root element
     * If there are multiple default slots, combine them
     * @memberof oj.ojCollapsible
     * @private
     */
    _processDefaultSlots: function () {
      var elem = this.element[0];

      var contents = CustomElementUtils.getSlotMap(elem)[''];
      var content;

      if (contents && contents.length === 1) {
        content = contents[0];
      } else {
        var $content = $('<div></div>');
        content = $content[0];
        if (contents && contents.length) {
          for (var i = 0; i < contents.length; i++) {
            content.appendChild(contents[i]); // @HTMLUpdateOK
          }
        }
        // add the content slot
        // Note: append doesn't work in IE11 and Edge, use appendChild instead
        elem.appendChild(content); // @HTMLUpdateOK
      }

      return $(content);
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _processPanels: function () {
      // process header
      if (this._IsCustomElement()) {
        this.header = this._processHeaderSlots();
      } else {
        //  - Stop using ui-helper-reset in the layout widgets.
        this.header = this.element.children(':first-child');
      }
      this.header.addClass(OJC_HEADER);

      // process content
      if (this._IsCustomElement()) {
        this.content = this._processDefaultSlots();
      } else {
        this.content = this.header.next();
      }
      this.content.addClass('oj-collapsible-content oj-component-content');

      this.content.wrap('<div></div>'); // @HTMLUpdateOK
      this.wrapper = this.content.parent().addClass('oj-collapsible-wrapper');

      if (this.options.disabled) {
        this.element.addClass('oj-disabled');
      }

      // wrap header in another div for A11Y
      this.header.wrap('<div></div>'); // @HTMLUpdateOK
      this.headerWrapper = this.header.parent().addClass('oj-collapsible-header-wrapper');

      if (this.header.hasClass('oj-header-border')) {
        this.headerWrapper.addClass('oj-header-border');
      }

      // Note: must set tabIndex=-1 to focusable elements
      // to avoid tabbing in a disabled header
      if (this._isDisabled()) {
        this._findFocusables(this.headerWrapper).attr('tabIndex', -1);
      }
    },

    /**
     * Used for explicit cases where the component needs to be refreshed
     * (e.g., when the value option changes or other UI gestures).
     * @memberof oj.ojCollapsible
     * @private
     */
    _refresh: function () {
      var header = this.header;
      var content = this.content;
      var options = this.options;

      var id = this.element.attr('id');
      if (!id) {
        uid += 1;
        id = uid;
      }

      var collapsibleId = 'oj-collapsible-' + id;
      this.collapsibleId = collapsibleId;

      var headerId = header.attr('id');
      var contentId = content.attr('id');

      if (!headerId) {
        headerId = collapsibleId + '-header';
        header.attr('id', headerId);
      }
      if (!contentId) {
        contentId = collapsibleId + '-content';
        content.attr('id', contentId);
      }

      // aria
      this._createIcons();
      var focusable = this._findFirstFocusableInHeader();
      focusable
        .attr('role', 'button')
        .attr('aria-controls', contentId)
        .attr(OJ_ARIA_EXPANDED, options.expanded); // @HTMLUpdateOK
      // .attr('aria-expanded', options.expanded);

      if (this._isDisabled()) {
        focusable.attr('aria-disabled', 'true');
      }

      //  - when collapsible is refreshed, it's content displays & disclosure icon collapsed
      if (options.expanded) {
        content.removeAttr(OJ_ARIA_HIDDEN);
      } else {
        this.wrapper.css({
          'max-height': 0,
          'overflow-y': 'hidden',
          display: 'none'
        });
        // content.attr('aria-hidden', 'true');
        content.attr(OJ_ARIA_HIDDEN, 'true'); // @HTMLUpdateOK
      }

      this._setupEvents();
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _setupEvents: function () {
      var events = {
        keydown: this._keydown
      };

      var event = this.options.expandOn;
      if (event) {
        var self = this;
        $.each(event.split(' '), function (index, eventName) {
          // security test
          if (isValidIdentifier(eventName)) {
            events[eventName] = self._toggleHandler;
          }
        });
      }

      var expandArea = this.element.find(this._getExpandAreaSelector());

      // add listeners on expandArea (event expandArea)
      this._on(expandArea, events);

      this._on(this.wrapper, {
        transitionend: this._transitionEndHandler,
        webkitTransitionEnd: this._transitionEndHandler
      });

      if (!this._isDisabled()) {
        this._on(this.element, {
          ojfocus: this._focusHandler,
          ojfocusout: this._focusHandler
        });

        this._focusable({
          element: this._getCollapsibleIcon(),
          applyHighlight: true
        });

        this._AddHoverable(expandArea);
        this._AddActiveable(expandArea);
      }
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _tearDownEvents: function () {
      var expandArea = this.element.find(this._getExpandAreaSelector());

      this._RemoveHoverable(expandArea);
      this._RemoveActiveable(expandArea);
      this._off(expandArea);

      // remove wrapper listeners
      if (this.wrapper) {
        this._off(this.wrapper);
      }
      this._off(this.element.add(this.content));
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _toggleHandler: function (event) {
      if (this._isDisabled() || event.isDefaultPrevented()) {
        return;
      }

      //  - click on button in header slot propagates to collapse/expand action
      var target = $(event.target);
      for (; target.length && target[0] !== this.header[0]; target = target.parent()) {
        if (target.attr('data-oj-clickthrough') === 'disabled') {
          return;
        }
        /**
         * @deprecated since 12.0.0, use data-oj-clickthrough="disabled" attribute instead
         */
        if (target.hasClass('oj-clickthrough-disabled')) {
          return;
        }
      }

      if (this.options.expanded) {
        this.collapse(true, event);
      } else {
        this.expand(true, event);
      }

      event.preventDefault();
      event.stopPropagation();

      // set focus on the disclosure icon
      this._getCollapsibleIcon().focus();
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _calcEffectTime: function (jelem) {
      var propertyStr = jelem.css('transitionProperty');
      var delayStr = jelem.css('transitionDelay');
      var durationStr = jelem.css('transitionDuration');
      var propertyArray = propertyStr.split(',');
      var delayArray = delayStr.split(',');
      var durationArray = durationStr.split(',');
      var propertyLen = propertyArray.length;
      var delayLen = delayArray.length;
      var durationLen = durationArray.length;
      var maxTime = 0;

      for (var i = 0; i < propertyLen; i++) {
        var duration = durationArray[i % durationLen];
        var durationMs =
          duration.indexOf('ms') > -1 ? parseFloat(duration) : parseFloat(duration) * 1000;
        if (durationMs > 0) {
          var delay = delayArray[i % delayLen];
          var delayMs = delay.indexOf('ms') > -1 ? parseFloat(delay) : parseFloat(delay) * 1000;

          maxTime = Math.max(maxTime, delayMs + durationMs);
        }
      }

      return maxTime + 100;
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _resolveTransition: function (wrapper) {
      var self = this;

      this._transitionTimer = setTimeout(function () {
        self._transitionEndHandler();
      }, self._calcEffectTime(wrapper));
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _expandCollapseHandler: function (event) {
      // only process expand/collapse for a disabled collapsible on initial render
      if (this._isDisabled() && !this._initialRender) {
        return;
      }

      if (event.target !== this.element[0]) {
        return;
      }

      if (this._initialRender || !event.isDefaultPrevented || !event.isDefaultPrevented()) {
        var element = this.element;
        var content = this.content;
        var wrapper = this.wrapper;
        var isExpanded = event.type === 'ojexpand';

        var self = this;
        event.preventDefault();

        // fire option change event
        if (!this._initialRender) {
          this._changeExpandedOption(isExpanded);
        }

        //  - ojcollapsible should update disclosure icon before animation not after
        this._getCollapsibleIcon()
          .toggleClass(OPEN_ICON, isExpanded)
          // logic or cause same icon for expanded/collapsed state would remove the oj-icon-class
          .toggleClass(CLOSE_ICON, !isExpanded || OPEN_ICON === CLOSE_ICON)
          .end();

        //  - expansion animation on initial render.
        if (
          this._initialRender ||
          document.hidden ||
          this.element.hasClass('oj-collapsible-skip-animation')
        ) {
          if (!isExpanded) {
            wrapper.css('max-height', 0);
            wrapper.hide();
          }
          self._afterExpandCollapse(isExpanded, event);
        } else {
          // do animation
          wrapper.contentHeight = wrapper.outerHeight();

          // Add a busy state for the animation.  The busy state resolver will be invoked
          // when the animation is completed
          if (!this._animationResolve) {
            var busyContext = Context.getContext(element[0]).getBusyContext();
            this._animationResolve = busyContext.addBusyState({
              description: "The collapsible id='" + this.element.attr('id') + "' is animating."
            });
          }
          this._transitionEnded = false;

          // expanding
          if (isExpanded) {
            // James: set display:none on the wrapper when it is hidden and then
            // remove display:none when its is shown.
            // This should trigger JAWS into refreshing the buffer.
            wrapper.show();

            setTimeout(function () {
              // if closed, add inner height to content height
              wrapper.contentHeight += content.outerHeight();

              wrapper.addClass(OJC_TRANSITION).css({
                'max-height': wrapper.contentHeight
              });
              self._resolveTransition(wrapper);
            }, 0);
          } else {
            // collapsing
            // disable transitions & set max-height to content height
            wrapper.removeClass(OJC_TRANSITION);
            wrapper.css({
              'max-height': wrapper.contentHeight,
              'overflow-y': 'hidden'
            });

            // no transition when end state is the same
            if (wrapper.contentHeight === 0) {
              self._transitionEndHandler();
            } else {
              setTimeout(function () {
                // enable & start transition
                wrapper.addClass(OJC_TRANSITION).css({
                  'max-height': 0 //! important
                });
                self._resolveTransition(wrapper);
              }, 20);
            }
          }
        }
      }
    },

    _focusHandler: function (event) {
      if (this._isDisabled()) {
        return;
      }

      if (event.type === 'ojfocusout') {
        this._findFirstFocusableInHeader().attr('tabIndex', -1);

        event.preventDefault();
        event.stopPropagation();
      } else if (event.type === 'ojfocus') {
        this._findFirstFocusableInHeader().attr('tabIndex', 0).focus();
        event.preventDefault();
        event.stopPropagation();
      }
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _findFirstFocusableInHeader: function () {
      return this._findFocusables(this.headerWrapper).first();
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _findFocusables: function (start) {
      // create <span> or <a> depending on if this.isDisabled
      if (this._isDisabled()) {
        return start.find('span');
      }
      return start.find('a,:input');
    },

    /**
     * Expand a collapsible.<p>
     * Note the beforeExpand event will only be fired when vetoable is true.<p>
     * Please use the <code class="prettyprint">expanded</code> option
     * for expanding a collapsible so that it triggers the beforeExpand event:
     * $( ".selector" ).ojCollapsible( "option", "expanded", true );
     *
     * @expose
     * @ignore
     * @ojtsignore
     * @memberof oj.ojCollapsible
     * @instance
     * @param {boolean} vetoable if event is vetoable
     */
    expand: function (vetoable, event) {
      if (this._isDisabled()) {
        return;
      }

      var eventData = {
        /** @expose */
        header: this.header,
        /** @expose */
        content: this.content
      };

      if (!vetoable || this._trigger('beforeExpand', event, eventData) !== false) {
        this._expandCollapseHandler(this._createEventObject(this.element[0], 'ojexpand'));
      }
    },

    /**
     * Collapse a collapsible.<p>
     * Note the beforeCollapse event will only be fired when vetoable is true.<p>
     * Please use the <code class="prettyprint">expanded</code> option
     * for collapsing a collapsible so that it triggers the beforeCollapse event:
     * $( ".selector" ).ojCollapsible( "option", "expanded", false );
     *
     * @expose
     * @ignore
     * @ojtsignore
     * @memberof oj.ojCollapsible
     * @instance
     * @param {boolean} vetoable if event is vetoable
     */
    collapse: function (vetoable, event) {
      if (this._isDisabled()) {
        return;
      }

      var eventData = {
        /** @expose */
        header: this.header,
        /** @expose */
        content: this.content
      };

      if (!vetoable || this._trigger('beforeCollapse', event, eventData) !== false) {
        this._expandCollapseHandler(this._createEventObject(this.element[0], 'ojcollapse'));
      }
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _transitionEndHandler: function (event) {
      // ignore event if not for this collapsible
      if (this._isDisabled() || (event && event.target !== this.element[0])) {
        return;
      }

      var isMaxHeight = false;
      if (event && event.originalEvent) {
        isMaxHeight = event.originalEvent.propertyName === 'max-height';
      }

      // if transition property is MaxHeight, clear timer if exists
      if (isMaxHeight && this._transitionTimer) {
        clearTimeout(this._transitionTimer);
        this._transitionTimer = undefined;
      }

      if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      // transition end already handled
      if (this._transitionEnded) {
        return;
      }

      // always set flag either timer expired or transition end
      if (isMaxHeight || !event) {
        this._transitionEnded = true;
      }

      if (!this.wrapper) {
        return;
      }

      // just completed a collapse transition
      if (this.options.expanded) {
        this.wrapper.css({
          'max-height': 9999,
          'overflow-y': ''
        });
      } else {
        // James: set display:none on the wrapper when it is hidden and then remove display:none when its is shown.
        // This should trigger JAWS into refreshing the buffer.
        this.wrapper.hide();
      }

      this.wrapper.removeClass(OJC_TRANSITION);
      this._afterExpandCollapse(this.options.expanded, event);
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _resolveBusyContext: function () {
      // resolve/remove the component busy state
      if (this._animationResolve) {
        this._animationResolve();
        this._animationResolve = null;
      }
    },

    /**
     * @memberof oj.ojCollapsible
     * @private
     */
    _afterExpandCollapse: function (isExpanded, event) {
      var element = this.element;
      var wrapper = this.wrapper;

      if (isExpanded) {
        element.removeClass('oj-collapsed');
        element.addClass('oj-expanded');

        //  - ojcollapsible needs to call oj.components.subtreeshown()/subtreehidden()
        subtreeShown(wrapper[0]);
      } else {
        element.removeClass('oj-expanded');
        element.addClass('oj-collapsed');

        //  - ojcollapsible needs to call oj.components.subtreeshown()/subtreehidden()
        subtreeHidden(wrapper[0]);
      }

      // aria
      if (isExpanded) {
        this.content.removeAttr(OJ_ARIA_HIDDEN);
      } else {
        this.content.attr(OJ_ARIA_HIDDEN, 'true'); // @HTMLUpdateOK
      }

      this._findFirstFocusableInHeader().attr(OJ_ARIA_EXPANDED, isExpanded); // @HTMLUpdateOK

      this._resolveBusyContext();

      var eventData = {
        /** @expose */
        header: this.header,
        /** @expose */
        content: this.content
      };

      if (!this._initialRender) {
        if (isExpanded) {
          this._trigger('expand', event, eventData);
        } else {
          this._trigger('collapse', event, eventData);
        }
      }
    },

    /**
     * @param {boolean} value
     * @memberof oj.ojCollapsible
     * @private
     */
    _changeExpandedOption: function (value) {
      this.option('expanded', value, { _context: { writeback: true, internalSet: true } });
    },

    getNodeBySubId: function (locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      var subId = locator.subId;

      switch (subId) {
        case 'oj-collapsible-content':
          return this.content[0];

        case OJC_HEADER:
          return this.header[0];

        case OJC_DISCLOSURE:
        case 'oj-collapsible-header-icon':
          return this._getCollapsibleIcon()[0];
        default:
      }

      // Non-null locators have to be handled by the component subclasses
      return null;
    },

    getSubIdByNode: function (node) {
      var headerIcon = this.getNodeBySubId({ subId: OJC_DISCLOSURE });
      var currentNode = node;
      while (currentNode) {
        if (currentNode === this.content[0]) {
          return { subId: 'oj-collapsible-content' };
        } else if (currentNode === this.header[0]) {
          return { subId: OJC_HEADER };
        } else if (currentNode === headerIcon) {
          return { subId: OJC_DISCLOSURE };
        }

        currentNode = currentNode.parentElement;
      }
      return null;
    },

    /**
     * @param {string} id
     * @memberof oj.ojCollapsible
     * @private
     */
    _removeIdAttr: function (_, element) {
      if (/^oj-collapsible/.test(element.id)) {
        this.removeAttribute('id');
      }
    }
  });
})();
