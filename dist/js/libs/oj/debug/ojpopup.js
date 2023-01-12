/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojpopupcore', 'ojs/ojcore-base', 'jquery', 'ojs/ojcontext', 'ojs/ojdomutils', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojanimation', 'ojs/ojfocusutils', 'ojs/ojcustomelement-utils'], function (ojpopupcore, oj, $, Context, DomUtils, ThemeUtils, Components, AnimationUtils, FocusUtils, ojcustomelementUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  FocusUtils = FocusUtils && Object.prototype.hasOwnProperty.call(FocusUtils, 'default') ? FocusUtils['default'] : FocusUtils;

  (function () {
    /**
     * List of all pseudo marker selectors that defines rules for where a tail is aligned.
     * @private
     * @const
     */
    var _TAIL_STYLES = ['oj-left', 'oj-center', 'oj-right', 'oj-top', 'oj-middle', 'oj-bottom'];

    /**
     * Mapping of horizontal-vertical (x,y) positon using alignment to jet tail pseudo marker
     * selectors.
     *
     * horizontal: right, left, center
     * vertical: top, bottom, middle
     *
     * @private
     * @const
     */
    var _TAIL_ALIGN_RULES = {
      'right-top': 'oj-right oj-top',
      'right-middle': 'oj-right oj-middle',
      'right-bottom': 'oj-right oj-bottom',
      'left-top': 'oj-left oj-top',
      'left-middle': 'oj-left oj-middle',
      'left-bottom': 'oj-left oj-bottom',
      'center-top': 'oj-center oj-top',
      'center-middle': 'oj-left oj-middle',
      'center-bottom': 'oj-center oj-bottom'
    };

    /**
     * @typedef {Object} oj.ojPopup.PositionAlign
     * @property {"top"|"bottom"|"center"} [vertical] Vertical alignment.
     * @property {"start"|"end"|"left"|"center"|"right"} [horizontal] Horizontal alignment. <p>
     * <ul>
     *  <li><b>"start"</b> evaluates to "left" in LTR mode and "right" in RTL mode.</li>
     *  <li><b>"end"</b> evaluates to "right" in LTR mode and "left" in RTL mode.</li>
     * </ul>
     *
     */

    /**
     * @typedef {Object} oj.ojPopup.PositionPoint
     * @property {number} [x] Horizontal alignment offset.
     * @property {number} [y] Vertical alignment offset.
     */

    /**
     * @typedef {Object} oj.ojPopup.Position
     * @property {Object} [my] Defines which edge on the popup to align with the target ("of") element.
     * @property {Object} [at] Defines which position on the target element ("of") to align the positioned element
     *                                  against.
     * @property {Object} [offset] Defines a point offset in pixels from the ("my") alignment.
     * @property {string|Object} [of] Which element to position the popup against.  The default is the
     * <code class="prettyprint">launcher</code> argument passed to the
     * <code class="prettyprint">open</code> method. <p>
     *
     * If the value is a string, it should be a selector or the literal string value
     * of <code class="prettyprint">window</code>.  Otherwise, a point of x,y.  When a point
     * is used, the values are relative to the whole document.  Page horizontal and vertical
     * scroll offsets need to be factored into this point - see UIEvent
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageX">pageX</a>,
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY">pageY</a>.
     *
     * @property {"flip"|"fit"|"flipfit"|"flipcenter"|"none"} [collision] Rule for alternate alignment. <p>
     * <ul>
     *  <li><b>"flip"</b> the element to the opposite side of the target and the
     *             collision detection is run again to see if it will fit. Whichever side
     *             allows more of the element to be visible will be used. </li>
     * <li><b>"fit"</b> shift the element away from the edge of the window. </li>
     * <li><b>"flipfit"</b> first applies the flip logic, placing the element
     *  on whichever side allows more of the element to be visible. Then the fit logic
     *  is applied to ensure as much of the element is visible as possible.</li>
     * <li><b>flipcenter</b> first applies the flip rule and follows with center alignment.</li>
     * <li><b>"none"</b> no collision detection.</li>
     * </ul>
     * @ojsignature [{target:"Type", value:"oj.ojPopup.PositionAlign", for:"my", jsdocOverride:true},
     *               {target:"Type", value:"oj.ojPopup.PositionAlign", for:"at", jsdocOverride:true},
     *               {target:"Type", value:"oj.ojPopup.PositionPoint", for:"offset", jsdocOverride:true},
     *               {target:"Type", value:"string|oj.ojPopup.PositionPoint", for:"of", jsdocOverride:true}]
     */

    /**
     * @ojcomponent oj.ojPopup
     * @augments oj.baseComponent
     *
     * @since 1.1.0
     * @ojdisplayname Popup
     * @ojshortdesc A popup temporarily 'pops up' content in the foreground.
     * @ojrole tooltip
     * @ojrole dialog
     * @ojrole alertdialog
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["initalFocus", "modality", "autoDismiss", "tail",
     *                                                     "position.at.horizontal", "position.at.vertical",
     *                                                     "position.collision", "position.my.horizontal",
     *                                                     "position.my.vertical", "position.of",
     *                                                     "position.offset.x", "position.offset.y", "style"]}
     * @ojvbdefaultcolumns 2
     * @ojvbmincolumns 1
     *
     * @ojoracleicon 'oj-ux-ico-popup-oj'
     * @ojuxspecs ['popup']
     *
     * @classdesc
     * <h3 id="popupOverview-section">
     *   JET Popup Component
     *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#popupOverview-section"></a></h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant popup that can display arbitrary content.</p>
     *
     * <p>A JET popup can be created from custom element
     * <code class="prettyprint">&lt;oj-popup&gt;</code> syntax. This element will become the
     * root - outer chrome of the popup.  The content of the popup will be relocated under an
     * element marked with the <code class="prettyprint">.oj-popup-content</code> selector.
     * Dynamic content can be inserted under the element identified by the
     * <code class="prettyprint">.oj-popup-content</code> selector.  However, page developers
     * are encouraged to create their own content element to anchor dynamic content changes
     * versus using <code class="prettyprint">.oj-popup-content</code> as the marker selector.</p>
     *
     * <pre class="prettyprint">
     * <code>&lt;oj-popup id="popup"&gt;
     *   &lt;span class="mycontent"&gt;
     *     Hello World!
     *   &lt;/span class="mycontent"&gt;
     * &lt;/oj-popup&gt;
     * </code></pre>
     *
     * <p>The following is an example of dynamically changing the content of the popup defined above.
     * </p>
     *
     * <pre class="prettyprint">
     * <code>var content = popup.querySelector( ".mycontent" );
     * content.textContent = "Hello Universe!";
     * </code></pre>
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
     * <br/><br/>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>For WAI-ARIA compliance, JET automatically adds
     * <code class="prettyprint">role="tooltip"</code> to the root popup dom element if not
     * already specificed. This is not a component property but rather the standard html
     * <a href="https://www.w3.org/WAI/PF/aria/roles">role</a> attribute. Depending on how the
     * popup is used in the page, the page developer should choose from the following:
     * <ul>
     *   <li>"tooltip" defines contextual popup that displays a description for an element.</li>
     *   <li>"dialog" defines an application window that is designed to interrupt the current
     *       processing of an application in order to prompt the user to enter information or
     *       require a response.</li>
     *   <li>"alertdialog" defines type of dialog that contains an alert message, where initial focus
     *       goes to an element within the dialog.</li>
     * </ul>
     * The popup also adds the <code class="prettyprint">aria-describedby="popup-id"</code> attribute
     * to the assocaited launcher while the popup is open.
     * </p>
     *
     * On platforms that support voice over mode (VO), the popup injects anchor tags "skip links"
     * into the document for navigation. Skip links are not visible but read in VO mode.
     * Two skip links are injected into the document when a popup is disclosed:
     *  <ul>
     *    <li>A close link, {@link oj.ojPopup#translations.ariaCloseSkipLink}, is injected as a
     *        sibling to the popup's content. Activation of this link will close the popup.</li>
     *    <li>For cases where the popup doesn't steal focus when it's open, a content navigation
     *        skip link, {@link oj.ojPopup#translations.ariaFocusSkipLink}, is injected as a
     *        sibling to the launcher (first required argument of the open method). If the launcher
     *        selector targets a sub-element of the launcher, the skip link could be injected under
     *        the launcher, which can be problematic for oj-button as skip link activation will
     *        also activate the associated launcher.</li>
     *  </ul>
     *
     * <p>One point often overlooked is making the gestures that launch a popup accessible.
     *   There are no constraints to what events a page developer might choose to trigger opening a
     *   popup.  The choice should be accessible for screen reader users.  Page
     *   developers should take care when using mouse events to trigger opening of a popup.
     *   This is especially important if the content of the popup can't be derived from other
     *   visible areas on the page. In cases that mouseover, mouseout, mouseenter, mouseleave and
     *   hover events are used to launch popups, there needs to be a keyboard functional equivalency.
     * </p>
     *
     * <p>See also the <a href="#styling-section">oj-focus-highlight</a> discussion.
     *
     * <h3 id="reparenting-section">
     *   Reparenting
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
     * </h3>
     *
     *  <p id="reparenting-strategy">
     *     When popups are open, they will be reparented in the document and reparented back when
     *     closed. When open, the location of the popup within the document will be in context of
     *     how it's used. Popups open from other popups will be relocated in the document into the
     *     nearest parent popup's layer. The popups layer defines its z-index weight "stacking
     *     context".  The ojPopup's layer is marked with the "oj-popup-layer" style.
     *     The context of opening is defined by the launcher argument passed to the open method.  If
     *     not open from another popup, the popup will be reparented to a container in the document
     *     body. Popups of the same type are assigned the same z-index values.  The layering between
     *     peer popups reflect the opening order. The popup that has active focus will be assigned a
     *     greater z-index value. This is applied to the popup's layer by way of the "oj-focus-within"
     *     pseudo selector applied with "oj-popup-layer" selector. The page author has control over
     *     z-index weights by way of the "oj-popup-layer" selector.
     *  </p>
     *  <p>
     *     There are known caveats with this design. However, these scenarios are considered "bad use"
     *     based on our JET popup strategy.
     *  </p>
     *  <ol>
     *    <li>Events raised within the popup will not bubble up to the popup's original ancestors.
     *        Instead, listeners for popup events should be applied to either the popup's root
     *        element, or the document.</li>
     *    <li>Likewise, developers should not use CSS descendant selectors, or similar logic, that
     *        assumes that the popup will remain a child of its original parent.</li>
     *    <li>Popups containing iframes are problematic.  The iframe elements "may" fire a HTTP GET
     *        request for its src attribute each time the iframe is reparented in the document.</li>
     *    <li>If an iframe is added to the popup's content, it must not be the first or last tab stop
     *        within the popup or keyboard and VoiceOver navigation will not remain within the popup.</li>
     *    <li>In some browsers, reparenting a popup that contains elements having overflow, will cause
     *        these overflow elements to reset their scrollTop.</li>
     *  </ol>
     *
     * <h3 id="eventHandling-section">
     *   Event Handling
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#eventHandling-section"></a>
     * </h3>
     * <ul>
     *  <li>ojBeforeClose(event) - Triggered before a popup closes. Event can prevent closing the
     *      popup; However, there are cases the framework must veto, such as when the popup is
     *      destroyed.</li>
     *  <li>ojBeforeOpen(event) - Triggered before a popup opens. Event can prevent opening the
     *      popup.</li>
     *  <li>ojClose(event) - Triggered after the popup has closed.</li>
     *  <li>ojFocus(event) - Triggered when initial focus is established on opening, depending on
     *      the value of the initalFocus property, or <kbd>F6</kbd> focus toggle from the associated
     *      launcher.</li>
     *  <li>ojOpen(event) - Triggered after the popup has been made visible.</li>
     * </ul>
     */

    //-----------------------------------------------------
    //                   Slots
    //-----------------------------------------------------

    /**
     * <p>The <code class="prettyprint">&lt;oj-popup></code> accepts
     * any DOM elements in its Default slot but only tracks the validity
     * state of any JET custom element descendents that contain the valid property.
     * @ojchild Default
     * @memberof oj.ojPopup
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
     *       <td>Outside popup or launcher</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Close the popup.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>Disabled items do not allow any touch interaction.
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojPopup
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
     *       <td rowspan = "3">Focus within Popup</td>
     *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
     *       <td>Navigate the content of the popup. Close the open popup if there are no tab stops in
     *           the popup.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>F6</kbd></td>
     *       <td>Move focus to the launcher for a popup with modeless modality.  Close the open popup
     *           if the modality is modal.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Close the open popup.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan = "1">Popup Launcher</td>
     *       <td><kbd>F6</kbd></td>
     *       <td>Move focus to the first tab stop within the open popup.  If there is not a tab stop
     *           within the content, focus is established on the popup.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojPopup
     */

    //-----------------------------------------------------
    //                   Styles
    //-----------------------------------------------------

    // ---------------- oj-focus-highlight --------------
    /**
     * Under normal circumstances this class is applied automatically.
     * It is documented here for the rare cases that an app developer needs per-instance control.<br/><br/>
     * The oj-focus-highlight class applies focus styling that may not be desirable when the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus occurs by a non-pointer mechanism, for example keyboard or initial page load.<br/><br/>
     * The application-level behavior for this component is controlled in the theme by the <code class="prettyprint"><span class="pln">$focusHighlightPolicy </span></code>SASS variable; however, note that this same variable controls the focus highlight policy of many components and patterns. The values for the variable are:<br/><br/>
     * <code class="prettyprint"><span class="pln">nonPointer: </span></code>oj-focus-highlight is applied only when focus is not the result of pointer interaction. Most themes default to this value.<br/>
     * <code class="prettyprint"><span class="pln">all: </span></code> oj-focus-highlight is applied regardless of the focus mechanism.<br/>
     * <code class="prettyprint"><span class="pln">none: </span></code> oj-focus-highlight is never applied. This behavior is not accessible, and is intended for use when the application wishes to use its own event listener to precisely control when the class is applied (see below). The application must ensure the accessibility of the result.<br/><br/>
     * To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use event listeners to toggle this class as needed.<br/>
     * @ojstyleclass oj-focus-highlight
     * @ojdisplayname Focus Styling
     * @ojshortdesc Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.
     * @memberof oj.ojPopup
     * @ojtsexample
     * &lt;oj-popup class="oj-focus-highlight">
     *   &lt;!-- Content -->
     * &lt;/oj-popup>
     */
    /**
     * @ojstylevariableset oj-popup-css-set1
     * @ojstylevariable oj-popup-bg-color {description: "Popup background color", formats: ["color"],help: "#css-variables"}
     * @ojstylevariable oj-popup-border-color {description: "Popup border color", formats: ["color"], help: "#css-variables"}
     * @ojstylevariable oj-popup-border-radius {description: "Popup border radius", formats: ["length","percentage"], help: "#css-variables"}
     * @ojstylevariable oj-popup-box-shadow {description: "Popup box shadow", help: "#css-variables"}
     * @ojstylevariable oj-popup-padding {description: "Popup padding", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-popup-tail-height {description: "Popup tail height", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-popup-tail-width {description: "Popup tail width", formats: ["length"], help: "#css-variables"}
     * @memberof oj.ojPopup
     */
    // --------------------------------------------------- oj.ojPopup Styling end -----------------------------------------------------------

    oj.__registerWidget('oj.ojPopup', $.oj.baseComponent, {
      widgetEventPrefix: 'oj',
      options: {
        /**
         *
         * @private
         * @memberof oj.ojPopup
         * @instance
         */
        animation: null,
        /**
         * Defines conditions that will cause an open popup to auto close dismiss.  A value of
         * <code class="prettyprint">focusLoss</code> defines the dismissal condition where focus
         * has left the content of the popup or from the associated launcher or if what the popup
         * is aligned to is not fully visible within an overflow area.
         *
         * @expose
         * @memberof oj.ojPopup
         * @ojshortdesc Specifies the auto dismissal behavior.
         * @instance
         * @type {string}
         * @default 'focusLoss'
         * @ojvalue {string} "none" disables auto dismissal behaviors.
         * @ojvalue {string} "focusLoss" defines auto dismissal behavior when focus leaves the
         *   content of the popup or associated launcher.  In addition, if what the popup is
         *   positioned to is not visible within an overflow area, the popup will auto close
         *   dismiss.
         *
         * @example <caption>Initialize the popup with
         *          <code class="prettyprint">auto-dismiss</code> attribute specified:</caption>
         * &lt;oj-popup auto-dismiss="focusLoss" &gt;&lt;/oj-popup&gt;
         *
         * @example <caption>Get or set the <code class="prettyprint">autoDismiss</code> property,
         *          after initialization:</caption>
         * // getter
         * var autoDismiss = myPopup.autoDismiss;
         * // setter
         * myPopup.autoDismiss = "none";
         */
        autoDismiss: 'focusLoss',
        /**
         * Defines the presence of border, shadow and background color of the root popup dom.
         * Value of <code class="prettyprint">none</code> applies the
         * <code class="prettyprint">oj-popup-no-chrome</code> selector defined by the active
         * theme to the root dom of the popup to remove the default chrome.
         *
         * @expose
         * @memberof oj.ojPopup
         * @ojshortdesc Specifies whether to use the border, shadow, and background colors from the active theme.
         * @instance
         * @type {string}
         * @default 'default'
         * @ojvalue {string} "default" describes the popups border, shadow, and background color
         *           defined by the active theme.
         * @ojvalue {string} "none" turns off the outer chrome defined by the active theme.
         *
         * @example <caption>Initialize the popup with <code class="prettyprint">chrome</code>
         *          attribute specified:</caption>
         * &lt;oj-popup chrome="none" &gt;&lt;/oj-popup&gt;
         *
         * @example <caption>Get or set the <code class="prettyprint">chrome</code> property, after
         *          initialization:</caption>
         * // getter
         * var chrome = myPopup.chrome;
         *
         * // setter
         * myPopup.chrome = "none";
         */
        chrome: 'default',
        /**
         * Determines if the popup should steal focus to its content when initially open. A value
         * of <code class="prettyprint">none</code> prevents the popup from grabbing focus when
         * open.
         *
         * @expose
         * @memberof oj.ojPopup
         * @ojshortdesc Specifies whether the popup steals focus to its content when initially opened.
         * @instance
         * @type {string}
         * @default 'auto'
         * @ojvalue {string} "auto" is derived from the values of the modality and
         *          autoDismiss properties
         * @ojvalue {string} "none" prevents the popup from stealing focus when open.
         * @ojvalue {string} "firstFocusable" defines that a popup should grab focus to the first
         *          focusable element within the popup's content.
         * @ojvalue {string} "popup" focus to the root popup container (good choice for touch
         *          platforms).
         *
         * @example <caption>Initialize the popup with
         *           <code class="prettyprint">initial-focus</code> attribute specified:</caption>
         * &lt;oj-popup initial-focus="none" &gt;&lt;/oj-popup&gt;
         *
         * @example <caption>Get or set the <code class="prettyprint">initialFocus</code> property,
         *          after initialization:</caption>
         * // getter
         * var initialFocus = myPopup.initialFocus;
         *
         * // setter
         * myPopup.initialFocus = "none";
         */
        initialFocus: 'auto',

        /**
         * <p>Position property is used to establish the location the popup will appear relative to
         * another element. {@link oj.ojPopup.Position} defines "my" alignment "at" the alignment
         * "of" some other thing which can be "offset" by so many pixels.</p>
         *
         * <p>The "my" and "at" properties defines alignment points relative to the popup and other
         * element.  The "my" property represents the popups alignment where the "at" property
         * represents the other element that can be identified by "of" or defauts to the launcher
         * when the popup opens.  The values of these properties describe horizontal and
         * vertical alignments.</p>
         *
         * <b>Deprecated v3.0.0 jQuery UI position syntax; Use of a percent unit with
         * "my" or "at" is not supported.</b>
         *
         * @expose
         * @memberof oj.ojPopup
         * @instance
         * @type {Object}
         * @ojsignature { target: "Type",
         *                value: "oj.ojPopup.Position",
         *                jsdocOverride: true}
         * @name position
         * @ojshortdesc Specifies the position of a popup when launched. See the Help documentation for more information.
         * @example <caption>Initialize the popup with <code class="prettyprint">position</code>
         *           attribute specified:</caption>
         * &lt;oj-popup position.my.horizontal="left"
         *           position.my.vertical="top"
         *           position.at.horizontal="right"
         *           position.at.vertical="top" &gt;&lt;/oj-popup&gt;
         *
         * @example <caption>Get or set the <code class="prettyprint">position</code> property,
         *          after initialization:</caption>
         * // getter
         * var position = myPopup.position;
         *
         * // setter
         * myPopup.position =
         *    {"my": {"horizontal": "start", "vertical": "bottom"},
         *     "at": {"horizontal": "end", "vertical": "top" },
         *     "offset": {"x": 0, "y":5}};
         */
        position: {
          /**
           * Defines which edge on the popup to align with the target ("of") element.
           *
           * @expose
           * @memberof! oj.ojPopup
           * @instance
           * @name position.my
           * @type {{horizontal:string, vertical:string}}
           */
          my: {
            /**
             * Defines the horizontal alignment of the popup.
             * @expose
             * @memberof! oj.ojPopup
             * @instance
             * @name position.my.horizontal
             * @type {string}
             * @default 'start'
             * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
             * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
             * @ojvalue {string} "left"
             * @ojvalue {string} "center"
             * @ojvalue {string} "right"
             */
            horizontal: 'start',
            /**
             * Defines the vertical alignment of the popup.
             * @expose
             * @memberof! oj.ojPopup
             * @instance
             * @name position.my.vertical
             * @type {string}
             * @default 'top'
             * @ojvalue {string} "top"
             * @ojvalue {string} "center"
             * @ojvalue {string} "bottom"
             */
            vertical: 'top'
          },
          /**
           * Defines a point offset in pixels from the ("my") alignment.
           * @expose
           * @memberof! oj.ojPopup
           * @instance
           * @name position.offset
           * @type {{x:number, y:number}}
           */
          offset: {
            /**
             * Horizontal alignment offset.
             * @expose
             * @memberof! oj.ojPopup
             * @instance
             * @name position.offset.x
             * @type {number}
             * @default 0
             */
            x: 0,
            /**
             * Vertical alignment offset.
             * @expose
             * @memberof! oj.ojPopup
             * @instance
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
           * @memberof! oj.ojPopup
           * @instance
           * @name position.at
           * @type {{horizontal:string, vertical:string}}
           */
          at: {
            /**
             * Defines the horizontal alignment of what the popup is aligned to.
             * @expose
             * @memberof! oj.ojPopup
             * @instance
             * @name position.at.horizontal
             * @type {string}
             * @default 'start'
             * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
             * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
             * @ojvalue {string} "left"
             * @ojvalue {string} "center"
             * @ojvalue {string} "right"
             */
            horizontal: 'start',
            /**
             * Defines the vertical alignment of what the popup is aligned to.
             * @expose
             * @memberof! oj.ojPopup
             * @instance
             * @name position.at.vertical
             * @type {string}
             * @default 'bottom'
             * @ojvalue {string} "top"
             * @ojvalue {string} "center"
             * @ojvalue {string} "bottom"
             */
            vertical: 'bottom'
          },
          /**
           * Which element to position the popup against.  The default is the
           * <code class="prettyprint">launcher</code> argument passed to the
           * <code class="prettyprint">open</code> method.
           *
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
           * @memberof! oj.ojPopup
           * @instance
           * @name position.of
           * @ojshortdesc Which element to position the popup against. See the Help documentation for more information.
           * @type {string|{x: number, y: number}}
           */
          of: undefined,
          /**
           * Rule for alternate alignment.
           *
           * @expose
           * @memberof! oj.ojPopup
           * @instance
           * @name position.collision
           * @type {string}
           * @default 'flip'
           * @ojvalue {string} "flip" the element to the opposite side of the target and the
           *  collision detection is run again to see if it will fit. Whichever side
           *  allows more of the element to be visible will be used.
           * @ojvalue {string} "fit" shift the element away from the edge of the window.
           * @ojvalue {string} "flipfit" first applies the flip logic, placing the element
           *  on whichever side allows more of the element to be visible. Then the fit logic
           *  is applied to ensure as much of the element is visible as possible.
           * @ojvalue {string} "flipcenter" first applies the flip rule and follow with center
           *  alignment.
           * @ojvalue {string} "none" no collision detection.
           */
          collision: 'flip'
        },
        /**
         * Determines if a decoration will be displayed from the popup that points to the element
         * the popup is aligned to. The <code class="prettyprint">simple</code> value enables the
         * tail defined by the current theme.  In addtion, the
         * <code class="prettyprint">oj-popup-tail-simple</code> selector will be applied to the
         * root dom element.  This is to allow the box-shadow, z-index and other chrome styling to
         * vary per tail decoration.
         *
         * @expose
         * @memberof oj.ojPopup
         * @ojshortdesc Specifies whether to display a decoration pointing from the popup to the launching element. See the Help documentation for more information.
         * @instance
         * @type {string}
         * @default 'none'
         * @ojvalue {string} "none" no decoration will be displayed from the popup pointing to the
         *          launcher.
         * @ojvalue {string} "simple" enables showing the tail defined by the current theme.
         *
         * @example <caption>Initialize the popup with <code class="prettyprint">tail</code>
         *          attribute specified:</caption>
         * &lt;oj-popup tail="simple" &gt;&lt;/oj-popup&gt;
         *
         * @example <caption>Get or set the <code class="prettyprint">tail</code> property, after
         *          initialization:</caption>
         * // getter
         * var tail = myPopup.tail;
         *
         * // setter
         * myPopup.tail = "simple";
         */
        tail: 'none',
        /**
         * Determines if the popup should block user input of the page behind with a blocking
         * overlay pane.
         *
         * <p>The default modality varies by theme.
         *
         * @expose
         * @memberof oj.ojPopup
         * @ojshortdesc Specifies whether the popup should block user input to the page.
         * @instance
         * The modality of the popup. Valid values are:
         * @ojvalue {string} "modeless" defines a modeless popup.
         * @ojvalue {string} "modal" The popup is modal. Interactions with other page elements are
         *          disabled. Modal popups overlay other page elements.
         * @type {string}
         * @default 'modeless'
         * @example <caption>Initialize the popup to have modality
         *          <code class="prettyprint">modality</code></caption>
         * &lt;oj-popup modality="modal" &gt;&lt;/oj-popup&gt;
         *
         * @example <caption>Get or set the <code class="prettyprint">modality</code> property,
         *          after initialization:</caption>
         * // getter
         * var modality = myPopup.modality;
         *
         * // setter
         * myPopup.modality = "modal";
         *
         */
        modality: 'modeless',
        /**
         * @private
         * @memberof oj.ojPopup
         * @instance
         * @type {string}
         */
        role: 'tooltip',
        // Events
        /**
         * Triggered before the popup is launched via the <code class="prettyprint">open()</code>
         * method. The open can be cancelled by calling
         * <code class="prettyprint">event.preventDefault()</code>.
         *
         * @expose
         * @event
         * @memberof oj.ojPopup
         * @ojshortdesc Triggered before the popup is launched.
         * @instance
         * @ojcancelable
         * @ojbubbles
         */
        beforeOpen: null,
        /**
         * Triggered after the popup is launched via the <code class="prettyprint">open()</code>
         * method.
         *
         * @expose
         * @event
         * @memberof oj.ojPopup
         * @ojshortdesc Triggered after the popup is launched.
         * @instance
         * @ojbubbles
         */
        open: null,
        /**
         * Triggered before the popup is dismissed via the
         * <code class="prettyprint">close()</code> method. The close can be cancelled by calling
         * <code class="prettyprint">event.preventDefault()</code>.
         *
         * @expose
         * @event
         * @memberof oj.ojPopup
         * @ojshortdesc Triggered before the popup is dismissed.
         * @instance
         * @ojcancelable
         * @ojbubbles
         */
        beforeClose: null,
        /**
         * Triggered after the popup is dismissed via the
         * <code class="prettyprint">close()</code> method.
         *
         * @expose
         * @event
         * @memberof oj.ojPopup
         * @ojshortdesc Triggered after the popup is dismissed.
         * @instance
         * @ojbubbles
         */
        close: null,
        /**
         * Triggered after focus has been transferred to the popup. This will occur after the
         * <code class="prettyprint">open()</code> method is called, depending on the value
         * of the <code class="prettyprint">initialFocus</code> property.  It's also triggered
         * when using the <kbd>F6</kbd> key to toggle focus from the associated launcher element
         * to the content of the popup.
         *
         * @expose
         * @event
         * @memberof oj.ojPopup
         * @ojshortdesc Triggered after focus has been transferred to the popup.
         * @instance
         * @ojbubbles
         */
        focus: null,
        /**
         * Triggered when a default animation is about to start, such as when the component is
         * being opened/closed or a child item is being added/removed. The default animation can
         * be cancelled by calling <code class="prettyprint">event.preventDefault</code>.
         * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
         *
         * @expose
         * @event
         * @memberof oj.ojPopup
         * @ojshortdesc Triggered when a default animation is about to start, such as when the component is being opened/closed or a child item is being added/removed.
         * @instance
         * @ojcancelable
         * @ojbubbles
         * @property {"open"|"close"} action The action that triggers the animation.<br><br>
         *            The number of actions can vary from component to component.
         *            Suggested values are:
         *                    <ul>
         *                      <li>"open" - when a popup component is opened</li>
         *                      <li>"close" - when a popup component is closed</li>
         *                    </ul>
         * @property {!Element} element target of animation
         * @property {!function():void} endCallback If the event listener calls
         *            event.preventDefault to cancel the default animation, It must call the
         *            endCallback function when it finishes its own animation handling and any
         *            custom animation has ended.
         *
         * @example <caption>Add a listener for the
         *          <code class="prettyprint">ojAnimateStart</code> event to override the default
         *          "close" animation:</caption>
         * myPopup.addEventListener("ojAnimateStart", function( event )
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
         * $popupOpenAnimation: ((effect: "zoomIn"), "fadeIn")  !default;
         * $popupCloseAnimation: ((effect: "zoomOut"), "fadeOut")  !default;
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
         * @memberof oj.ojPopup
         * @ojshortdesc Triggered when a default animation had ended, such as when the component is being opened/closed or a child item is being added/removed.
         * @instance
         * @ojcancelable
         * @ojbubbles
         * @property {!Element} element target of animation
         * @property {"open"|"close"} action The action that triggered the animation.<br><br>
         *                   The number of actions can vary from component to component.
         *                   Suggested values are:
         *                    <ul>
         *                      <li>"open" - when a popup component is opened</li>
         *                      <li>"close" - when a popup component is closed</li>
         *                    </ul>
         *
         * @example <caption>Add a listener for the
         *          <code class="prettyprint">ojAnimateEnd</code> event to listen for the "close"
         *          ending animation:</caption>
         * myPopup.addEventListener("ojAnimateEnd", function( event )
         *   {
         *     // verify that the component firing the event is a component of interest and action
         *      is close
         *     if (event.detail.action == "close") {}
         *   });
         *
         * @example <caption>The default open and close animations are controlled via the theme
         *          (SCSS) :</caption>
         * $popupOpenAnimation: (effect: "zoomIn", fade: true)  !default;
         * $popupCloseAnimation: (effect: "zoomOut", fade: true)  !default;
         */
        animateEnd: null
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @protected
       * @override
       */
      _ComponentCreate: function () {
        this._super();

        var rootStyle = this._getRootStyle();
        var element = this.element;
        element.hide().addClass(rootStyle).attr('aria-hidden', 'true');
        element.addClass('oj-component');

        // Creates a content element and moves the children of the root to the content element
        // and then appends the content element to the root element.
        var content = $('<div>');
        content.addClass([rootStyle, 'content'].join('-'));
        content.attr('role', 'presentation');
        content.append(element[0].childNodes); // @HTMLUpdateOK move app defined children to content wrapper
        content.appendTo(element); // @HTMLUpdateOK attach programmaticly generated node
        this._content = content;

        this._setChrome();
        this._setupFocus(element);

        // fixup the position option set via the widget constructor
        var options = this.options;
        options.position = oj.PositionUtils.coerceToJet(options.position);
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @protected
       * @override
       */
      _AfterCreate: function () {
        // first apply rootAttributes that might define an id if unspecified
        this._super();

        // aria-describedby needs an id.  Assign an id to the popup root if not already defined.
        this.element.uniqueId();

        // create the tail with a subid
        this._createTail();
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @protected
       * @override
       */
      _destroy: function () {
        if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
          this._closeImplicitly();
        }

        this._setWhenReady('none');
        this._destroyTail();
        delete this._popupServiceEvents;

        // make sure the root element is hidden
        var element = this.element;
        element.hide().attr('aria-hidden', 'true').removeUniqueId();

        // Move the children back under the root node removing the content node.
        var content = this._content;
        delete this._content;
        element.append(content[0].childNodes); // @HTMLUpdateOK destructor move children back under root
        content.remove();

        var closeDelayTimer = this._closeDelayTimer;
        if (closeDelayTimer) {
          delete this._closeDelayTimer;
          closeDelayTimer();
        }

        this._super();
      },
      /**
       * Opens the popup. This method accepts two arguments. The first argument "launcher" is
       * required but the second "position" is optional.
       *
       * @expose
       * @method
       * @name oj.ojPopup#open
       * @ojshortdesc Opens the popup.
       * @memberof oj.ojPopup
       * @instance
       * @param {!(string|Element)} launcher selector or dom element that is associated with the
       *        popup. Defines the context of how the popup is used. The argument is required.
       * @param {Object=} position {@link oj.ojPopup.Position} an element relative to another
       * @return {void}
       * @ojsignature { target: "Type",
       *                value: "oj.ojPopup.Position",
       *                for: "position",
       *                jsdocOverride: true}
       * @fires oj.ojPopup#ojBeforeOpen
       * @fires oj.ojPopup#ojOpen
       *
       * @example <caption>Invoke the <code class="prettyprint">open</code> method:</caption>
       * var open = myPopup.open("#launcher");
       */
      open: function (launcher, position) {
        if (this._isOperationPending('open', [launcher, position])) {
          return;
        }

        if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
          this._closeImplicitly(); // synchronous close
        }

        var element = this.element;
        var status = oj.ZOrderUtils.getStatus(element);
        if (!(status === oj.ZOrderUtils.STATUS.CLOSE || status === oj.ZOrderUtils.STATUS.UNKNOWN)) {
          return;
        }

        // status change is needed to prevent calling open from an on before open
        // handler.  The _isOperationPending doens't gurard until this._setWhenReady('open');
        oj.ZOrderUtils.setStatus(element, oj.ZOrderUtils.STATUS.BEFORE_OPEN);
        if (this._trigger('beforeOpen') === false) {
          oj.ZOrderUtils.setStatus(this.element, status);
          return;
        }

        // activates the _isOperationPending gatekeeper
        this._setWhenReady('open');

        this._setLauncher(launcher);
        var _launcher = this._launcher;

        var options = this.options;
        // eslint-disable-next-line no-param-reassign
        position = position || options.position;
        if (!position.of) {
          this._hasPositionOfLauncherOverride = true;
          // eslint-disable-next-line no-param-reassign
          position.of = _launcher;
        }

        this._setPosition(position);

        this._setAutoDismiss(options.autoDismiss);
        this._addDescribedBy();

        if (!this._IsCustomElement() || !element[0].hasAttribute('role')) {
          element.attr('role', options.role);
        }

        // convert to the jquery ui position format
        var _position = this._getPositionAsJqUi();

        // build layer class selectors applied to the popup layer
        var rootStyle = this._getRootStyle();
        var layerClass = [rootStyle, 'layer'].join('-');
        var tailDecoration = options.tail;
        if (tailDecoration !== 'none') {
          layerClass += ' ' + [rootStyle, 'tail', tailDecoration].join('-');
        }

        /** @type {!Object.<oj.PopupService.OPTION, ?>} */
        var psOptions = {};
        psOptions[oj.PopupService.OPTION.POPUP] = element;
        psOptions[oj.PopupService.OPTION.LAUNCHER] = _launcher;
        psOptions[oj.PopupService.OPTION.POSITION] = _position;
        psOptions[oj.PopupService.OPTION.EVENTS] = this._getPopupServiceEvents();
        psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = layerClass;
        psOptions[oj.PopupService.OPTION.MODALITY] = options.modality;
        psOptions[oj.PopupService.OPTION.CUSTOM_ELEMENT] = this._IsCustomElement();
        oj.PopupService.getInstance().open(psOptions);
      },
      /**
       * Before open callback is called after the popup has been reparented into the
       * zorder container. Open animation is performed here.
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for opening the popup
       * @return {Promise|void}
       */
      _beforeOpenHandler: function (psOptions) {
        var element = psOptions[oj.PopupService.OPTION.POPUP];
        var position = psOptions[oj.PopupService.OPTION.POSITION];

        element.show();
        element.position(position);

        // note the initial popup width/height
        this.initialWidth = element.width();
        this.initialHeight = element.height();

        // TODO might want to add fadeIn for the modal overlay in the future.
        var animationOptions = this.options.animation;
        if (animationOptions && animationOptions.open) {
          var actionPrefix = animationOptions.actionPrefix;
          var action = actionPrefix ? [actionPrefix, 'open'].join('-') : 'open';
          // eslint-disable-next-line no-undef
          return AnimationUtils.startAnimation(
            element[0],
            action,
            oj.PositionUtils.addTransformOriginAnimationEffectsOption(element, animationOptions.open),
            this
          );
        }

        return undefined;
      },
      /**
       * Called after the popup is shown. Perform open finalization.
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for opening the popup
       * @return {void}
       */
      _afterOpenHandler: function (psOptions) {
        var element = psOptions[oj.PopupService.OPTION.POPUP];
        var launcher = psOptions[oj.PopupService.OPTION.LAUNCHER];

        if (this.initialWidth !== element.width() || this.initialHeight !== element.height()) {
          // if the popup width/height changed during opening, re-apply position constraints
          this._reposition();
        }
        delete this.initialWidth;
        delete this.initialHeight;

        // set up a listener for future size changes
        this._registerResizeListener(element[0]);

        this._initVoiceOverAssist();

        this._trigger('open');

        this._intialFocus();

        this._on(element, { keydown: this._keyHandler });
        if (launcher && launcher.length > 0) {
          this._on(launcher, { keydown: this._keyHandler });
        }
      },
      /**
       * Override to retrieve the context menu element from the context area of the popup
       * versus the root.
       * @memberof oj.ojPopup
       * @instance
       * @protected
       * @override
       */
      _GetContextMenu: function () {
        if (this._IsCustomElement()) {
          var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(this._content[0]);
          var slot = slotMap.contextMenu;
          if (slot && slot.length > 0) {
            return slot[0];
          }
        } else {
          return this._super();
        }
        return undefined;
      },
      /**
       * Closes the popup. This method does not accept any arguments.
       *
       * @expose
       * @method
       * @name oj.ojPopup#close
       * @ojshortdesc Closes the popup.
       * @memberof oj.ojPopup
       * @instance
       * @return {void}
       * @fires oj.ojPopup#ojBeforeClose
       * @fires oj.ojPopup#ojClose
       *
       * @example <caption>Invoke the <code class="prettyprint">close</code> method:</caption>
       * myPopup.close();
       */
      close: function () {
        if (this._isOperationPending('close', [])) {
          return;
        }

        var element = this.element;
        var status = oj.ZOrderUtils.getStatus(element);
        if (status !== oj.ZOrderUtils.STATUS.OPEN) {
          return;
        }

        // Status toggle is needed to prevent a recursive closed callled from a
        // beforeClose handler. The _isOperationPending gatekeeper isn't activated
        // until after the _setWhenReady('close'|'open') call.
        oj.ZOrderUtils.setStatus(element, oj.ZOrderUtils.STATUS.BEFORE_CLOSE);
        if (this._trigger('beforeClose') === false && !this._ignoreBeforeCloseResultant) {
          oj.ZOrderUtils.setStatus(element, status);
          return;
        }

        // activates the _isOperationPending gatekeeper
        this._setWhenReady('close');

        var launcher = this._launcher;
        this._off(element, 'keydown');
        if (launcher && launcher.length > 0) {
          this._off(launcher, 'keydown');
        }

        // if the content has focus, restore the the launcher
        this._restoreFocus();

        // clean up voice over assist
        this._destroyVoiceOverAssist();

        /** @type {!Object.<oj.PopupService.OPTION, ?>} */
        var psOptions = {};
        psOptions[oj.PopupService.OPTION.POPUP] = element;
        oj.PopupService.getInstance().close(psOptions);
      },
      /**
       * Before callback is invoked while the popup is still visible and still parented in the
       * zorder container. Close animation is performed here.
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for closing the popup
       * @return {Promise|void}
       */
      _beforeCloseHandler: function (psOptions) {
        var element = psOptions[oj.PopupService.OPTION.POPUP];

        this._unregisterResizeListener(element[0]);

        // TODO might want to add fadeOut for the modal overlay in the future.
        var animationOptions = this.options.animation;

        if (!this._ignoreBeforeCloseResultant && animationOptions && animationOptions.close) {
          var actionPrefix = animationOptions.actionPrefix;
          var action = actionPrefix ? [actionPrefix, 'close'].join('-') : 'close';

          /** @type {?} */
          // eslint-disable-next-line no-undef
          var promise = AnimationUtils.startAnimation(
            element[0],
            action,
            oj.PositionUtils.addTransformOriginAnimationEffectsOption(
              element,
              animationOptions.close
            ),
            this
          ).then(function () {
            element.hide();
          });
          return promise;
        }

        element.hide();
        return undefined;
      },
      /**
       * Close finalization callback.
       *
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for closing the popup
       * @return {void}
       */
      // eslint-disable-next-line no-unused-vars
      _afterCloseHandler: function (psOptions) {
        this._removeDescribedBy();
        this._setAutoDismiss();

        delete this._launcher;
        this._trigger('close');

        if (this._hasPositionOfLauncherOverride) {
          var options = this.options;
          options.position.of = null;
          delete this._hasPositionOfLauncherOverride;
        }
      },
      /**
       * <p>Returns the state of whether the popup is currently open. This method does not accept
       * any arguments.</p>
       *
       * The "open" state reflects the period of time the popup is visible, including open and
       * close animations.
       *
       * @expose
       * @method
       * @name oj.ojPopup#isOpen
       * @ojshortdesc Returns the state of whether the popup is currently visible.
       * @memberof oj.ojPopup
       * @instance
       * @return {boolean} <code>true</code> if the popup is open.
       *
       * @example <caption>Invoke the <code class="prettyprint">isOpen</code> method:</caption>
       * var isOpen = myPopup.isOpen();
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
       * Causes the popup to reevaluate its position.  Call this function after
       * the content of the popup has dynamically changed while the popup is open.
       *
       * <p>This method does not accept any arguments.</p>
       *
       * @expose
       * @method
       * @name oj.ojPopup#refresh
       * @ojshortdesc Refreshes the popup, causing it to reevaluate its position.
       * @memberof oj.ojPopup
       * @instance
       * @return {void}
       *
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       * myPopup.refresh();
       */
      refresh: function () {
        this._super();

        if (oj.ZOrderUtils.getStatus(this.element) !== oj.ZOrderUtils.STATUS.OPEN) {
          return;
        }

        if (!this._reposition()) {
          return;
        }

        // trigger refresh of descendents if reposition was successful
        var element = this.element;
        oj.PopupService.getInstance().triggerOnDescendents(
          element,
          oj.PopupService.EVENT.POPUP_REFRESH
        );
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @protected
       * @param {string} key option name
       * @param {?Object} value of the target option identified by the key
       * @override
       */
      _setOption: function (key, value) {
        var options = this.options;
        switch (key) {
          case 'tail':
            if (value !== options.tail) {
              this._setTail(value);
            }
            break;
          case 'chrome':
            if (value !== options.chrome) {
              this._setChrome(value);
            }
            break;
          case 'position':
            this._setPosition(value);
            this.refresh();
            // don't call super because setPosition sets the option after creating a new
            // instance.  This prevents the same position instance from getting registered
            // with multiple component instances.
            return;
          case 'autoDismiss':
            if (
              oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN &&
              value !== options.autoDismiss
            ) {
              this._setAutoDismiss(value);
            }
            break;
          case 'modality':
            if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
              var element = this.element;
              /** @type {!Object.<oj.PopupService.OPTION, ?>} */
              var psOptions = {};
              psOptions[oj.PopupService.OPTION.POPUP] = element;
              psOptions[oj.PopupService.OPTION.MODALITY] = value;
              oj.PopupService.getInstance().changeOptions(psOptions);
            }
            break;
          default:
            break;
        }

        this._superApply(arguments);
      },
      /**
       * Returns the root selector prefix for the popup components.  In the future if the popup is
       * subcassed, this method can be made protected and override to change the root selector names
       * for the target component.
       *
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @return {string}
       */
      _getRootStyle: function () {
        return 'oj-popup';
      },
      /**
       * Handles setting up the target tail.
       *
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {string} tail option value
       */
      _setTail: function (tail) {
        this._destroyTail();
        this._createTail(tail);
        this._reposition();
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {string} tail option value
       */
      _createTail: function (tail) {
        var tailDecoration = tail || this.options.tail;
        if (tailDecoration === 'none') {
          return;
        }

        var rootStyle = this._getRootStyle();
        var tailMarkerStyle = [rootStyle, 'tail'].join('-');
        var tailStyle = [tailMarkerStyle, tailDecoration].join('-');

        var tailDom = $('<div>').hide();
        tailDom.addClass(tailMarkerStyle).addClass(tailStyle);
        tailDom.attr('role', 'presentation');

        // id over "marker style" due to nesting popups in popups
        this._tailId = tailDom.attr('id', this._getSubId('tail')).attr('id');
        var element = this.element;
        tailDom.appendTo(element); // @HTMLUpdateOK attach programmaticly generated node

        // tail "value" style is applied to the root dom for shadow and z-index adjustments
        element.addClass(tailStyle);

        // The tail can change the z-index of the layer that defines the stacking context
        // of the popup.  If the popup is open, update the layers class.
        if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
          var layerClass = [rootStyle, 'layer'].join('-');
          layerClass += ' ' + tailStyle;

          /** @type {!Object.<oj.PopupService.OPTION, ?>} */
          var options = {};
          options[oj.PopupService.OPTION.POPUP] = element;
          options[oj.PopupService.OPTION.LAYER_SELECTORS] = layerClass;
          oj.PopupService.getInstance().changeOptions(options);
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @return {jQuery}
       */
      _getTail: function () {
        var tailId = this._tailId;
        if (!tailId) {
          return null;
        }

        return $(document.getElementById(tailId));
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _destroyTail: function () {
        var tail = this._getTail();
        if (tail) {
          tail.remove();
        }

        delete this._tailId;

        var tailDecoration = this.options.tail;
        var rootStyle = this._getRootStyle();
        var tailStyle = [rootStyle, 'tail', tailDecoration].join('-');

        var element = this.element;
        element.removeClass(tailStyle);

        // if the popup is open, reseed the layer class removing the
        // tail style.
        if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
          var layerClass = [rootStyle, 'layer'].join('-');
          /** @type {!Object.<oj.PopupService.OPTION, ?>} */
          var options = {};
          options[oj.PopupService.OPTION.POPUP] = element;
          options[oj.PopupService.OPTION.LAYER_SELECTORS] = layerClass;
          oj.PopupService.getInstance().changeOptions(options);
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {string} chrome option value
       */
      _setChrome: function (chrome) {
        var chromeDecoration = chrome || this.options.chrome;
        var noChromeStyle = [this._getRootStyle(), 'no-chrome'].join('-');
        var element = this.element;

        if (chromeDecoration === 'default' && element.hasClass(noChromeStyle)) {
          element.removeClass(noChromeStyle);
        } else if (chromeDecoration === 'none' && !element.hasClass(noChromeStyle)) {
          element.addClass(noChromeStyle);
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {string|Node|jQuery|null} _launcher provided when the popup is open
       */
      _setLauncher: function (_launcher) {
        var launcher = _launcher;
        if (!launcher) {
          launcher = $(document.activeElement);
        } else if ($.type(launcher) === 'string') {
          // id jquery selector
          launcher = $(launcher);
        } else if (launcher.nodeType === 1) {
          // dom element
          launcher = $(launcher);
        }

        // if a jquery collection, select the first dom node not in the popups content
        if (launcher instanceof $ && launcher.length > 1) {
          var element = this.element;

          for (var i = 0; i < launcher.length; i++) {
            var target = launcher[0];
            if (!DomUtils.isAncestorOrSelf(element[0], target)) {
              launcher = $(target);
              break;
            }
          }
        } else if (
          !(launcher instanceof $) || // object is not a jq
          (launcher instanceof $ && launcher.length === 0)
        ) {
          // empty jq collection
          launcher = $(document.activeElement);
        }

        this._launcher = launcher;
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {?Object} position object set as an option or passed as an argument to the open
       *                  method.
       */
      _setPosition: function (position) {
        var options = this.options;

        // new position extends the existing object
        // covert to jet internal position format
        if (position) {
          options.position = oj.PositionUtils.coerceToJet(position, options.position);
        }
      },

      /**
       * Returns a jQuery UI position object from the internal object.
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @returns {Object}
       */
      _getPositionAsJqUi: function () {
        var options = this.options;
        var position = oj.PositionUtils.coerceToJqUi(options.position);
        var isRtl = this._GetReadingDirection() === 'rtl';
        position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);

        var origUsing = position.using;
        origUsing = $.isFunction(origUsing) ? origUsing : null;

        // override with our proxy to handle positioning of the tail
        // overload the callback arguments forcing the original using as the first argument
        position.using = this._usingHandler.bind(this, origUsing);

        return position;
      },

      /**
       * Resolves a busy state blocking delayed call to implicitly close
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {Function} busyStateResolver
       */
      _resolveBusyStateAndCloseImplicitly: function (busyStateResolver) {
        busyStateResolver();
        delete this._closeDelayTimer;
        this._closeImplicitly();
      },
      /**
       * Cancels the delayed implicit closure.
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {number} timer
       * @param {Function} busyStateResolver
       */
      _resolveBusyStateAndCancelDelayedClosure: function (timer, busyStateResolver) {
        window.clearTimeout(timer);
        busyStateResolver();
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {Function} origUsing position using hander if already provided
       * @param {Object} pos "my" element associated with the position object
       * @param {Object} props directions as to where the element should be moved
       */
      _usingHandler: function (origUsing, pos, props) {
        var element = props.element.element;

        // do nothing if the position is the same
        if (pos.top === element.css('top') && pos.left === element.css('left')) {
          return;
        }

        var tail = this._getTail();
        if (!tail) {
          element.css(pos);
        } else {
          tail.hide();
          for (var i = 0; i < _TAIL_STYLES.length; i++) {
            tail.removeClass(_TAIL_STYLES[i]);
            element.removeClass(_TAIL_STYLES[i]);
          }
          tail.removeAttr('style');

          // 
          // Check if "of" alignment is to a x,y versus a dom element.  The horizontal
          // rule returned from jquery UI position defaults to "left" or "right".  The height and
          // width of the target will be zero when the "of" is not a DOM element.
          // Use the position.my alignment rules over what jquery returns when aligned to a point.
          //
          // jQuery 3.1 made changes to the offset.  The basic refactor was to switch over to using
          // "Element.getBoundingClientRect()".  Part of this refactor will return a offset rect of
          // {top: 0, left: 0} for any element that doesn't have a bounding box
          // "Element.getClientRects()". Many types of SVG elements such as <g> fall into this
          // category.  The popup will appear in the top left of the browser.
          //
          if (props.target && props.target.height === 0 && props.target.width === 0) {
            var isRtl = this._GetReadingDirection() === 'rtl';
            var position = oj.PositionUtils.normalizeHorizontalAlignment(
              this.options.position,
              isRtl
            );
            var myrule = position.my;
            if (!oj.StringUtils.isEmptyOrUndefined(myrule)) {
              // If the original horizontal rule is center, use it; otherwise, use the calculated
              // hint. The left/right rules reflect the actual positioning but center is never
              // represented correctly aligned to a point even though the alignment is correct.
              var suggestedHrule =
                myrule.horizontal === 'center' ? myrule.horizontal : props.horizontal;
              var suggestedVrule = myrule.vertical === 'center' ? 'middle' : myrule.vertical;
              // eslint-disable-next-line no-param-reassign
              props.horizontal = suggestedHrule;
              // eslint-disable-next-line no-param-reassign
              props.vertical = suggestedVrule;
            }
          }

          var alignMnemonic = [props.horizontal, props.vertical].join('-');
          var tailStyle = _TAIL_ALIGN_RULES[alignMnemonic];
          tail.addClass(tailStyle);
          element.addClass(tailStyle);
          tail.show();

          // adjust the vertical and horizontal positioning to account for the tail
          // so that the page developer doesn't have to factor that in
          var borderFactor = 2; // factor in a little extra so the borders overlap
          var tailHOffset;
          if (props.horizontal === 'left') {
            tailHOffset = tail.outerWidth();
            tailHOffset -= tailHOffset + DomUtils.getCSSLengthAsInt(tail.css('left'));
            // eslint-disable-next-line no-param-reassign
            pos.left += tailHOffset - borderFactor;
          } else if (props.horizontal === 'right') {
            tailHOffset = tail.outerWidth();
            tailHOffset -= tailHOffset + DomUtils.getCSSLengthAsInt(tail.css('right'));
            // eslint-disable-next-line no-param-reassign
            pos.left -= tailHOffset - borderFactor;
          }

          var tailVOffset;
          // tail adjustments when the offset of the image is not the total size of the image
          if (props.vertical === 'top') {
            tailVOffset = tail.outerHeight();
            tailVOffset -= tailVOffset + DomUtils.getCSSLengthAsInt(tail.css(props.vertical));
            // eslint-disable-next-line no-param-reassign
            pos.top += tailVOffset - borderFactor;
          } else if (props.vertical === 'bottom') {
            tailVOffset = tail.outerHeight();
            tailVOffset -= tailVOffset + DomUtils.getCSSLengthAsInt(tail.css(props.vertical));
            // eslint-disable-next-line no-param-reassign
            pos.top -= tailVOffset - borderFactor;
          }
          element.css(pos);

          // adjustments to the vertical or horizontal centering.  The 50% alignment is from
          // the edge of the tail versus the center of the image.  The tail can't be located
          // at "center, middle". In this case (dead center), horizintal center looks better
          // on small viewports (_TAIL_ALIGN_RULES["center-middle"] === 'oj-left oj-middle')
          if (props.horizontal === 'center' && props.vertical !== 'middle') {
            var rootWidth = element.width();
            var leftPercent = Math.round(((rootWidth / 2 - tail.outerWidth() / 2) / rootWidth) * 100);
            tail.css({
              left: leftPercent + '%'
            });
          } else if (props.vertical === 'middle') {
            var rootHeight = element.height();
            var topPercent = Math.round(
              ((rootHeight / 2 - tail.outerHeight() / 2) / rootHeight) * 100
            );
            tail.css({
              top: topPercent + '%'
            });
          }
        }

        oj.PositionUtils.captureTransformOriginAnimationEffectsOption(element, props);

        // call on the original using regardless of the tail
        if (origUsing) {
          origUsing(pos, props);
        }

        var options = this.options;

        // The "origUsing" could alter the positon.  This check needs to be last.
        // When focusLoss auto dismissal is enabled, implicitly close the popup when the
        // position.of is clipped in an overflow container.
        if (options.autoDismiss === 'focusLoss') {
          if (oj.PositionUtils.isAligningPositionClipped(props)) {
            // Ignore focus back to what had focus before the popup was open. Focus
            // restore could fight scroll if the popup was closed due to the aligning
            // element being clipped.
            this._ignoreRestoreFocus = true;

            // operation needs to happen in the next stacking frame and guarded by a
            // busy state.
            var busyContext = Context.getContext(this.element[0]).getBusyContext();
            var bsOptions = {
              description: [
                "ojPopup identified by '",
                this.element.attr('id'),
                "' is pending implicit closure."
              ].join('')
            };
            var resolver = busyContext.addBusyState(bsOptions);
            // prettier-ignore
            var delayTimer = window.setTimeout( // @HTMLUpdateOK
              this._resolveBusyStateAndCloseImplicitly.bind(this, resolver),
              0
            );

            this._closeDelayTimer = this._resolveBusyStateAndCancelDelayedClosure.bind(
              this,
              delayTimer,
              resolver
            );
          }
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @return {boolean} <code>false</code> if the position was skipped
       */
      _reposition: function () {
        var element = this.element;
        var position = this._getPositionAsJqUi();

        // verify selector is valid; otherwise, skip the reposition
        if (oj.StringUtils.isString(position.of)) {
          var jqOf = $(position.of);
          if (jqOf.length === 0) {
            return false;
          }

          position.of = jqOf;
        }

        if (this.element.width() > window.innerWidth || this.element.height() > window.innerHeight) {
          return false;
        }

        element.position(position);
        return true;
      },

      /**
       * Unregister event listeners for resize the popup element.
       * @param {Element} element  DOM element
       * @private
       */
      _unregisterResizeListener: function (element) {
        if (element && this._resizeHandler) {
          // remove existing listener
          DomUtils.removeResizeListener(element, this._resizeHandler);
          this._resizeHandler = null;
        }
      },

      /**
       * Register event listeners for resize the popup element.
       * @param {Element} element  DOM element
       * @private
       */
      _registerResizeListener: function (element) {
        if (element) {
          if (this._resizeHandler == null) {
            this._resizeHandler = this._handleResize.bind(this);
          }
          DomUtils.addResizeListener(element, this._resizeHandler, 30, true);
        }
      },

      /**
       * Resize handler to adjust popup position when the size changes after
       * initial render.
       *
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _handleResize: function () {
        if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
          this._reposition();
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {boolean=} waiAriaAssisted focus established via keyboard or voice over versus from
       *        open API
       */
      _intialFocus: function (waiAriaAssisted) {
        var initialFocus = this._deriveInitialFocus();
        if (waiAriaAssisted || initialFocus !== 'none') {
          var element = this.GetFocusElement();
          element.focus();
          this._trigger('focus');
        }
      },

      /**
       * Returns the current focusable element for this component which can be the root custom element
       * or an HTML element like an input or select.
       * @return {Element}
       * @memberof oj.ojPopup
       * @instance
       * @protected
       * @override
       */
      GetFocusElement: function () {
        var activeElement = document.activeElement;
        if (activeElement && this._isFocusInPopup(activeElement)) {
          return activeElement;
        }

        var initialFocus = this._deriveInitialFocus();

        if (initialFocus === 'none') {
          initialFocus = 'popup';
        }

        var element;
        if (initialFocus === 'firstFocusable') {
          var content = this._content;
          var nodes = content.find(':focusable');

          for (var i = 0; i < nodes.length; i++) {
            if (FocusUtils.isFocusable(nodes[i])) {
              element = $(nodes[i]);
              break;
            }
          }

          if (!element) {
            // nothing to set focus to, default to "popup"
            initialFocus = 'popup';
          }
        }

        // Establish focus to the root element of the popup.  It's not a natural focus stop
        if (initialFocus === 'popup') {
          var closeSkipLink = this._closeSkipLink;
          if (closeSkipLink) {
            element = closeSkipLink.getLink();
          } else {
            element = this.element;
            element.attr('tabindex', '-1');
          }
        }

        return element[0];
      },

      /**
       * @memberof oj.ojPopup
       * @private
       * @return {string} derives the target initialFocus option when the default is auto
       */
      _deriveInitialFocus: function () {
        var options = this.options;
        var initialFocus = options.initialFocus;

        if (initialFocus === 'auto') {
          var modality = options.modality;
          if (modality === 'modal') {
            if (DomUtils.isTouchSupported()) {
              initialFocus = 'popup';
            } else {
              initialFocus = 'firstFocusable';
            }
          } else {
            initialFocus = 'none';
          }
        }

        return initialFocus;
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {Element} activeElement from the event being handled
       * @param {boolean!} includeChildren when true the focus test will include the scope of any
       *                   child popups.
       * @return {boolean} <code>true</code> if the active element is within the content of the
       *                   popup
       */
      _isFocusInPopup: function (activeElement, includeChildren) {
        if (!activeElement) {
          // eslint-disable-next-line no-param-reassign
          activeElement = document.activeElement;
        }

        // added to avoid automation issues where an active element is not established
        if (!activeElement) {
          return false;
        }

        var element = this.element;

        // popups that are children are siblings to the parent popup within the
        // layer that defines the stacking context.
        if (includeChildren) {
          element = element.parent();
        }

        return DomUtils.isAncestorOrSelf(element[0], activeElement);
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {Element} activeElement from the event being handled
       * @return {boolean} <code>true</code> if the active element the launcher or a decedent of the
       *         launcher
       */
      _isFocusInLauncher: function (activeElement) {
        if (!activeElement) {
          // eslint-disable-next-line no-param-reassign
          activeElement = document.activeElement;
        }

        var launcher = this._launcher;
        return DomUtils.isAncestorOrSelf(launcher[0], activeElement);
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _restoreFocus: function () {
        if (this._ignoreRestoreFocus) {
          delete this._ignoreRestoreFocus;
          return;
        }

        // extend the focus check to include popups that are children
        if (this._isFocusInPopup(null, true)) {
          var launcher = this._launcher;
          launcher.focus();
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {jQuery.Event|Event} event keydown
       */
      _keyHandler: function (event) {
        if (event.isDefaultPrevented()) {
          return;
        }

        var content = this._content;
        var options;
        var launcher;

        /** @type {?} */
        var target = event.target;
        if (
          event.keyCode === $.ui.keyCode.ESCAPE &&
          (this._isFocusInPopup(target) || this._isFocusInLauncher(target))
        ) {
          event.preventDefault();
          event.stopPropagation();
          this.close();
        } else if (event.keyCode === 117 || event.key === 'F6') {
          // F6 - toggle focus to launcher or popup
          // keyCode is deprecated and it's not supported on some browsers.
          if (this._isFocusInPopup(target)) {
            // If this is a modeless popup, toggle focus to the launcher;
            // otherwise, close the popup as we can't set focus under the
            // modal glass pane.
            options = this.options;
            if (options.modality === 'modeless') {
              event.preventDefault();
              launcher = this._launcher;
              launcher.focus();
            } else {
              this.close();
            }
          } else if (this._isFocusInLauncher(target)) {
            event.preventDefault();
            this._intialFocus(true);
          }
        } else if (event.keyCode === $.ui.keyCode.TAB && this._isFocusInPopup(target)) {
          // TAB within popup
          var nodes = content.find(':tabbable');
          if (nodes.length > 0) {
            var firstNode = nodes[0];
            var lastNode = nodes[nodes.length - 1];
            var element = this.element;

            if ((firstNode === target || element[0] === target) && event.shiftKey) {
              // tabbing backwards, cycle focus to last node
              event.preventDefault();
              // If the first and last tab stops are the same,
              // force focus to the root popup dom.  This will
              // cause the blur to fire on any input components.
              // If we are back tabbing on the popup dom, jump to the
              // last tab stop.
              if (firstNode === lastNode && firstNode === target) {
                element.attr('tabindex', '-1');
                element.focus();
              } else {
                $(lastNode).focus(); // tabbing backwards, cycle focus to last node
              }
            } else if (lastNode === target && !event.shiftKey) {
              event.preventDefault();
              // If the first and last tab stops are the same,
              // force focus to the root popup dom.  This will
              // cause the blur to fire on any input components.
              if (lastNode === firstNode) {
                element.attr('tabindex', '-1');
                element.focus();
              } else {
                $(firstNode).focus(); // tabbing forwards, cycle to the first node
              }
            }
          } else {
            event.preventDefault();
            options = this.options;
            if (options.modality === 'modeless') {
              // if there is nothing in the popup that is tabbable, handle as a F6
              // toggle to the launcher
              launcher = this._launcher;
              launcher.focus();
            } else {
              // Modal popup can't set focus to something under the overlay,
              // implicitly close.
              this.close();
            }
          }
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {string|null} autoDismiss option value
       */
      _setAutoDismiss: function (autoDismiss) {
        // unregister any existing handlers, might need to add mouseOut in the future
        var focusLossCallback = this._focusLossCallback;
        var events = this._getPopupServiceEvents();
        if (focusLossCallback) {
          delete events[oj.PopupService.EVENT.POPUP_AUTODISMISS];
          delete this._focusLossCallback;
        }

        if (autoDismiss === 'focusLoss') {
          focusLossCallback = this._dismissalHandler.bind(this);
          this._focusLossCallback = focusLossCallback;
          events[oj.PopupService.EVENT.POPUP_AUTODISMISS] = focusLossCallback;
        }

        if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
          var element = this.element;
          /** @type {!Object.<oj.PopupService.OPTION, ?>} */
          var options = {};
          options[oj.PopupService.OPTION.POPUP] = element;
          options[oj.PopupService.OPTION.EVENTS] = events;
          oj.PopupService.getInstance().changeOptions(options);
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {Event} event native doc
       */
      _dismissalHandler: function (event) {
        if (oj.ZOrderUtils.getStatus(this.element) !== oj.ZOrderUtils.STATUS.OPEN) {
          return;
        }

        var launcher = this._launcher;
        var element = this.element;

        // child popups are siblings to the parent in the layer.
        var layer = element.parent();

        /** @type {?} */
        var target = event.target;

        // if the target is on the focus skip link next to the launcher, ignore.
        var focusSkipLink = this._focusSkipLink;
        if (focusSkipLink) {
          var link = focusSkipLink.getLink();
          if (link && DomUtils.isAncestorOrSelf(link[0], target)) {
            return;
          }
        }

        // if event target is not under the laucher or popup root dom subtrees, dismiss
        if (
          !DomUtils.isAncestorOrSelf(launcher[0], target) &&
          !DomUtils.isAncestorOrSelf(layer[0], target)
        ) {
          var tabindexAttr = target.getAttribute('tabindex');
          if (FocusUtils.isFocusable(target) && tabindexAttr !== '-1') {
            // If the dismissal event target can take focus and the
            // event type is a mousedown or touchstart, wait for the focus event
            // to trigger dismissal.  This allows the blur to happen
            // on input components which triggers validation.
            if (event.type === 'mousedown' || event.type === 'touchstart') {
              return;
            }

            this._ignoreRestoreFocus = true;
          }

          // invoke standard close dismissal that can be canceled via the beforeclose
          // event.
          this.close();
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _addDescribedBy: function () {
        var launcher = this._launcher;
        var element = this.element;

        var popupId = element.attr('id');
        var describedby = launcher.attr('aria-describedby');
        var tokens = describedby ? describedby.split(/\s+/) : [];
        tokens.push(popupId);
        describedby = $.trim(tokens.join(' '));
        launcher.attr('aria-describedby', describedby);
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _removeDescribedBy: function () {
        var launcher = this._launcher;
        var element = this.element;

        if (!launcher || launcher.length === 0) {
          return;
        }

        var popupId = element.attr('id');
        var describedby = launcher.attr('aria-describedby');
        var tokens = describedby ? describedby.split(/\s+/) : [];
        var index = $.inArray(popupId, tokens);
        if (index !== -1) {
          tokens.splice(index, 1);
        }

        describedby = $.trim(tokens.join(' '));
        if (describedby) {
          launcher.attr('aria-describedby', describedby);
        } else {
          launcher.removeAttr('aria-describedby');
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _initVoiceOverAssist: function () {
        var isVOSupported =
          oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS ||
          oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID;
        var liveRegion = this._liveRegion;
        if (!liveRegion) {
          liveRegion = new ojpopupcore.PopupLiveRegion();
          this._liveRegion = liveRegion;
        }

        var message;
        var initialFocus = this._deriveInitialFocus();
        if (isVOSupported) {
          message = this.getTranslatedString(
            initialFocus === 'none'
              ? 'ariaLiveRegionInitialFocusNoneTouch'
              : 'ariaLiveRegionInitialFocusFirstFocusableTouch'
          );
        } else {
          message = this.getTranslatedString(
            initialFocus === 'none'
              ? 'ariaLiveRegionInitialFocusNone'
              : 'ariaLiveRegionInitialFocusFirstFocusable'
          );
        }
        liveRegion.announce(message);

        if (isVOSupported) {
          var focusSkipLinkId = this._getSubId('focusSkipLink');
          var launcher = this._launcher;
          var callback = this._intialFocus.bind(this, true);
          message = this.getTranslatedString('ariaFocusSkipLink');
          this._focusSkipLink = new ojpopupcore.PopupSkipLink(launcher, message, callback, focusSkipLinkId);

          var content = this._content;
          var closeSkipLinkId = this._getSubId('closeSkipLink');
          callback = this._closeImplicitly.bind(this);
          message = this.getTranslatedString('ariaCloseSkipLink');
          this._closeSkipLink = new ojpopupcore.PopupSkipLink(content, message, callback, closeSkipLinkId);
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _destroyVoiceOverAssist: function () {
        var liveRegion = this._liveRegion;
        liveRegion.destroy();
        delete this._liveRegion;

        var focusSkipLink = this._focusSkipLink;
        if (focusSkipLink) {
          focusSkipLink.destroy();
          delete this._focusSkipLink;
        }

        var closeSkipLink = this._closeSkipLink;
        if (closeSkipLink) {
          closeSkipLink.destroy();
          delete this._closeSkipLink;
        }
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {string} sub id that will become a composite id prefixed with the components uuid
       * @return {string}
       */
      _getSubId: function (sub) {
        /** @type {?} */
        var id = this.element.attr('id');
        if (oj.StringUtils.isEmptyOrUndefined(id)) {
          id = this.uuid;
        }
        return [id, sub].join('_');
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
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
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @return {!Object.<oj.PopupService.EVENT, function(...)>}
       */
      _getPopupServiceEvents: function () {
        if (!this._popupServiceEvents) {
          /** @type {!Object.<oj.PopupService.EVENT, function(...)>} **/
          var events = {};
          this._popupServiceEvents = events;
          events[oj.PopupService.EVENT.POPUP_CLOSE] = this._closeImplicitly.bind(this);
          events[oj.PopupService.EVENT.POPUP_REMOVE] = this._surrogateRemoveHandler.bind(this);
          events[oj.PopupService.EVENT.POPUP_REFRESH] = this.refresh.bind(this);
          events[oj.PopupService.EVENT.POPUP_BEFORE_OPEN] = this._beforeOpenHandler.bind(this);
          events[oj.PopupService.EVENT.POPUP_AFTER_OPEN] = this._afterOpenHandler.bind(this);
          events[oj.PopupService.EVENT.POPUP_BEFORE_CLOSE] = this._beforeCloseHandler.bind(this);
          events[oj.PopupService.EVENT.POPUP_AFTER_CLOSE] = this._afterCloseHandler.bind(this);
        }
        return this._popupServiceEvents;
      },
      /**
       * @memberof oj.ojPopup
       * @instance
       * @private
       */
      _closeImplicitly: function () {
        this._ignoreBeforeCloseResultant = true;
        this.close();
        delete this._ignoreBeforeCloseResultant;
      },
      /**
       * Creates a Promise exposed by the {@link oj.ojPopup#whenReady} method.
       *
       * @param {string} operation valid values are "open", "close" or "none"
       * @memberof oj.ojPopup
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

        this._whenReadyMediator = new ojpopupcore.PopupWhenReadyMediator(
          this.element,
          operation,
          'ojPopup',
          this._IsCustomElement()
        );
      },

      /**
       * Checks to see if there is a pending "open" or "close" operation.  If pending and it
       * is the same as the requested operation, the request silently fails.  If the current
       * operation is the inverse operation, we queue the current operation after the pending
       * operation is resolved.
       *
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {string} operation currently requested
       * @param {Array} args passed to a queue operation
       * @returns {boolean} <code>true</code> if a close or open operation is pending completion.
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
       * @memberof oj.ojPopup
       * @instance
       * @private
       * @param {jQuery} elem to manage the focus ring on
       */
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
      /**
       * Notifies the component that its subtree has been removed from the document
       * programmatically after the component has been created.
       *
       * @memberof oj.ojPopup
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

    const animationVars = {
      open: '--oj-private-popup-global-open-animation-default',
      close: '--oj-private-popup-global-close-animation-default'
    };
    // sets the default modality option from the current theme
    Components.setDefaultOptions({
      ojPopup: {
        modality: Components.createDynamicPropertyGetter(function () {
          return ThemeUtils.getCachedCSSVarValues(['--oj-private-popup-global-modality-default'])[0];
        }),
        animation: Components.createDynamicPropertyGetter(function () {
          const animationDefaultOptions = {};
          const keys = Object.keys(animationVars);
          const vars = keys.map((key) => animationVars[key]);
          const values = ThemeUtils.getCachedCSSVarValues(vars);
          keys.forEach((key, i) => {
            animationDefaultOptions[key] = JSON.parse(values[i]);
          });
          return animationDefaultOptions;
        })
      }
    });
  })();

  (function () {
var __oj_popup_metadata = 
{
  "properties": {
    "autoDismiss": {
      "type": "string",
      "enumValues": [
        "focusLoss",
        "none"
      ],
      "value": "focusLoss"
    },
    "chrome": {
      "type": "string",
      "enumValues": [
        "default",
        "none"
      ],
      "value": "default"
    },
    "initialFocus": {
      "type": "string",
      "enumValues": [
        "auto",
        "firstFocusable",
        "none",
        "popup"
      ],
      "value": "auto"
    },
    "modality": {
      "type": "string",
      "enumValues": [
        "modal",
        "modeless"
      ],
      "value": "modeless"
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
              "value": "start"
            },
            "vertical": {
              "type": "string",
              "enumValues": [
                "bottom",
                "center",
                "top"
              ],
              "value": "bottom"
            }
          }
        },
        "collision": {
          "type": "string",
          "enumValues": [
            "fit",
            "flip",
            "flipcenter",
            "flipfit",
            "none"
          ],
          "value": "flip"
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
              "value": "start"
            },
            "vertical": {
              "type": "string",
              "enumValues": [
                "bottom",
                "center",
                "top"
              ],
              "value": "top"
            }
          }
        },
        "of": {
          "type": "string|object"
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
    "tail": {
      "type": "string",
      "enumValues": [
        "none",
        "simple"
      ],
      "value": "none"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "ariaCloseSkipLink": {
          "type": "string"
        },
        "ariaFocusSkipLink": {
          "type": "string"
        },
        "ariaLiveRegionInitialFocusFirstFocusable": {
          "type": "string"
        },
        "ariaLiveRegionInitialFocusFirstFocusableTouch": {
          "type": "string"
        },
        "ariaLiveRegionInitialFocusNone": {
          "type": "string"
        },
        "ariaLiveRegionInitialFocusNoneTouch": {
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
    "ojOpen": {}
  },
  "extension": {}
};
    __oj_popup_metadata.extension._WIDGET_NAME = 'ojPopup';
    __oj_popup_metadata.extension._CONTROLS_SUBTREE_HIDDEN = true;
    oj.CustomElementBridge.register('oj-popup', { metadata: __oj_popup_metadata });
  })();

});
