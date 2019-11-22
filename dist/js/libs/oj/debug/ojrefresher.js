/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojcomponentcore',  'ojs/ojpulltorefresh', 'ojs/ojlogger', 'touchr'], 
/*
* @param {Object} oj 
* @param {jQuery} $
*/
function(oj, $, Context, Components, PullToRefreshUtils, Logger)
{
  "use strict";
var __oj_refresher_metadata = 
{
  "properties": {
    "refreshContent": {
      "type": "function"
    },
    "target": {
      "type": "Element"
    },
    "text": {
      "type": "string",
      "value": ""
    },
    "threshold": {
      "type": "number",
      "value": 0
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "ariaRefreshCompleteLink": {
          "type": "string"
        },
        "ariaRefreshLink": {
          "type": "string"
        },
        "ariaRefreshingLink": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};

/* global PullToRefreshUtils:false, Logger:false, Context:false */
/*!
 * jQuery UI Refresher @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.position.js
 */

(function () {
/**
 * @ojcomponent oj.ojRefresher
 * @augments oj.baseComponent
 * @since 5.1.0
 *
 * @ojshortdesc A refresher is a wrapper for attaching pull to refresh functionality to a DOM element.
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["text", "threshold"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 12
 *
 * @classdesc
 * <h3 id="refresherOverview-section">
 *   JET Refresher
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#refresherOverview-section"></a>
 * </h3>
 *
 * <p>Description: A wrapper to provide pull-to-refresh functionality for a target DOM element
 *
 * <p>Warning: The pull to refresh gesture will not work with drag and drop enabled components. Drag and drop must be disabled in the component if
 * use of pull to refresh is needed.
 *
 * <pre class="prettyprint"><code>&lt;oj-refresher id='myrefresher' threshold='100' text='Checking for updates' refresh-content='[[refreshFunc]]'>
 *    &lt;oj-list-view id="listview">&lt;/oj-list-view>
 * &lt;/oj-refresher>
 *
 * </code></pre>
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 */
  oj.__registerWidget('oj.ojRefresher', $.oj.baseComponent,
    {
      widgetEventPrefix: 'oj',
      options:
      {
        /**
         * <p>The function to invoke when the pull to refresh is triggered. Must return a Promise which will be resolved when the refresh function is completed.
         *
         * @expose
         * @memberof oj.ojRefresher
         * @ojrequired
         * @instance
         * @type {function():Promise.<*>}
         * @default null
         * @ojshortdesc Specifies the function to invoke when pull-to-refresh operation is triggered. See the Help documentation for more information.
         *
         * @example <caption>Initialize the Refresher with the <code class="prettyprint">refreshContent</code> attribute specified:</caption>
         * &lt;oj-refresher refresh-content=[[refreshFunc]]>&lt;/oj-refresher>
         *
         */
        refreshContent: null,
        /**
         * <p>The minimum distance in pixels that the user needs to pull down in order to trigger a refresh.
         * If 0, then the threshold will default to the height of the target element.
         *
         * @expose
         * @memberof oj.ojRefresher
         * @instance
         * @type {number}
         * @default 0
         * @ojshortdesc The minimum distance in pixels that the user needs to pull down in order to trigger a refresh. See the Help documentation for more information.
         *
         * @example <caption>Initialize the Refresher with the <code class="prettyprint">threshold</code> attribute specified:</caption>
         * &lt;oj-refresher threshold='100'>&lt;/oj-refresher>
         *
         */
        threshold: 0,
        /**
         * <p>The target to detect pull down. If no target is specified, then the wrapper will attempt to use the first child element with
         * the 'oj-scroller' CSS style class applied to it. If no such element is found, then the first child element of the oj-refresher element
         * will be used.
         *
         * @expose
         * @memberof oj.ojRefresher
         * @instance
         * @type {Element}
         * @default null
         * @ojshortdesc The target element used to detect a pull-to-refresh trigger. See the Help documentation for more information.
         *
         * @example <caption>Initialize the Refresher with the <code class="prettyprint">target</code> attribute specified:</caption>
         * &lt;oj-refresher target=[[document.getElementById("listview")]]>
         *    &lt;oj-list-view id='listview'>&lt;/oj-list-view>
         * &lt;/oj-refresher>
         *
         */
        target: null,
        /**
         * <p>A text messsage shown in the pull-to-refresh panel after a pull down gesture.
         *
         * @expose
         * @memberof oj.ojRefresher
         * @instance
         * @type {string}
         * @default ''
         * @ojtranslatable
         * @ojshortdesc Specifies a text message to display in the pull-to-refresh panel after a pull down gesture.
         *
         * @example <caption>Initialize the Refresher with the <code class="prettyprint">text</code> attribute specified:</caption>
         * &lt;oj-refresher text='Checking for updates'>
         *    &lt;oj-list-view id='listview'>&lt;/oj-list-view>
         * &lt;/oj-refresher>
         *
         */
        text: '',
      },

      /**
       * Sets up resources needed by refresher
       * @memberof! oj.ojRefresher
       * @instance
       * @override
       * @protected
       */
      _SetupResources: function () {
        this._super();
        this.element.addClass('oj-component');

        this._setupRefresh();
      },

      /**
       * Release resources held by refresher
       * @memberof! oj.ojRefresher
       * @instance
       * @override
       * @protected
       */
      _ReleaseResources: function () {
        this._super();
        this._checkObserver();
        PullToRefreshUtils.tearDownPullToRefresh(this.scrollerElement);
      },

      /**
       * @memberof oj.ojRefresher
       * @expose
       * @instance
       * @override
       */
      refresh: function () {
        this._super();
        this._checkObserver();
        this._setupRefresh();
      },

      /**
       * Helper function for disconnecting the observer if it is initialized.
       * @private
       */
      _checkObserver: function () {
          // if observer still connected, disconnect it now.
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
      },

      /**
       * Helper function for setting up the refresher
       * @private
       */
      _setupRefresh: function () {
        var self = this;

        this._setupScrollerElement();

        if (this.scrollerElement) {
          var busyContext = Context.getContext(this.scrollerElement).getBusyContext();
          busyContext.whenReady().then(function () {
            self._setupObserver(self);

            self._setupPullToRefresh();
          });
        } else {
          Logger.error('Issue with the target selected: Target missing or not found');
        }
      },

      /**
       * Helper function for setting up the pull to refresh hook
       * @private
       */
      _setupPullToRefresh: function () {
        var threshold = this.options.threshold === 0 ? null : this.options.threshold;
        PullToRefreshUtils.setupPullToRefresh(this.scrollerElement,
                                                 this.options.refreshContent, {
                                                   threshold: threshold,
                                                   primaryText: this.options.text
                                                 });
      },

      /**
       * Helper function for setting the scroller Element
       * @private
       */
      _setupScrollerElement: function () {
        if (this.options.target != null) {
          this.scrollerElement = this.options.target;
        } else if (this.element[0]) {
          var ojScroller = this.element[0].getElementsByClassName('oj-scroller');
          this.scrollerElement = ojScroller.length > 0 ? ojScroller[0] : null;
          if (!this.scrollerElement && this.element[0].children.length !== 0) {
            this.scrollerElement = this.element[0].children[0];
          }
        } else {
          this.scrollerElement = null;
        }
      },

      /**
       * Helper function for setting the scrollerElement observer
       * @private
       */
      _setupObserver: function (self) {
        if (self.scrollerElement) {
          // create an observer instance to remove pulltorefresh applied on the scroller when its destroyed
          // eslint-disable-next-line no-param-reassign
          self.observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.removedNodes.length > 0 &&
                  mutation.removedNodes[0] === self.scrollerElement) {
                self.observer.disconnect();
                // eslint-disable-next-line no-param-reassign
                self.observer = null;

                PullToRefreshUtils.tearDownPullToRefresh(self.scrollerElement);
              }
            });
          });

          // if parentNode exists use that, otherwise use document.
          // eslint-disable-next-line no-param-reassign
          self.parentNode = self.scrollerElement.parentNode;
          if (self.parentNode) {
            self.observer.observe(self.parentNode, { childList: true });
          } else {
            self.observer.observe(document, { childList: true });
          }
        }
      }

      // Slots
      // Override contextMenu slot definition to remove it from the jsdoc as it is not supported for refresher

      /**
       * @ojslot contextMenu
       * @memberof oj.ojRefresher
       * @ignore
       */

      // Fragments
      /**
       * {@ojinclude "name":"ojStylingDocIntro"}
       *
       * <table class="generic-table styling-table">
       *   <thead>
       *     <tr>
       *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
       *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td>oj-scroller</td>
       *       <td>Designates the element to be the scroller element used in place of the target.</td>
       *       </td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
       * @memberof oj.ojRefresher
       */

    });
}());


/* global __oj_refresher_metadata */
/**
 * @protected
 * @ignore
 */
(function () {
  __oj_refresher_metadata.extension._WIDGET_NAME = 'ojRefresher';
  oj.CustomElementBridge.register('oj-refresher',
                                  { metadata: __oj_refresher_metadata });
}());

});