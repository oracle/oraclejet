/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'hammerjs', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojjquery-hammer', 'ojs/ojcomponentcore', 'ojs/ojpopup'], 
      /*
      * @param {Object} oj 
      * @param {jQuery} $
      * @param {Object} Hammer  
      */
      function(oj, $, Hammer, Logger, Context)
{
  "use strict";
//%COMPONENT_METADATA%
var __oj_label_metadata = 
{
  "properties": {
    "for": {
      "type": "string"
    },
    "help": {
      "type": "object",
      "value": {
        "definition": null,
        "source": null
      },
      "properties": {
        "definition": {
          "type": "string"
        },
        "source": {
          "type": "string"
        }
      }
    },
    "labelId": {
      "type": "string"
    },
    "showRequired": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "tooltipHelp": {
          "type": "string"
        },
        "tooltipRequired": {
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


/* global Hammer:false, Logger:false, Context:false */
(function () {
  /**
   * String used in the id on the span that surrounds the help icon.
   * @const
   * @private
   * @type {string}
   */
  var _HELP_ICON_ID = '_helpIcon';
  /**
   * String used in the id on the span that surrounds the required icon.
   * @const
   * @private
   * @type {string}
   */

  var _REQUIRED_ICON_ID = '_requiredIcon';
  /**
   * aria-describedby
   * @const
   * @private
   * @type {string}
   */

  var _ARIA_DESCRIBEDBY = 'aria-describedby';
  /**
   * described-by
   * @const
   * @private
   * @type {string}
   */

  var _DESCRIBED_BY = 'described-by';
  /**
   * aria-labelledby
   * @const
   * @private
   * @type {string}
   */

  var _ARIA_LABELLEDBY = 'aria-labelledby';
  /**
   * labelled-by
   * @const
   * @private
   * @type {string}
   */

  var _LABELLED_BY = 'labelled-by';
  /*!
   * JET oj-label. @VERSION
   */

  /**
   * <p>
   * The oj-label component decorates the label text with a required icon and help icon. The user
   * can interact with the help icon (on hover, on focus, etc) to display help description text
   * or to navigate to an url for more help information.
   * </p>
   * <p>For accessibility reasons, you need to associate the oj-label component to its
   * JET form component. For most JET form components you do this
   * using the oj-label's <code class="prettyprint">for</code> attribute and
   * the JET form component's <code class="prettyprint">id</code> attribute.
   * For a few JET form components
   * (oj-radioset, oj-checkboxset, oj-color-palette, and oj-color-spectrum)
   * you associate the oj-label component to its JET form component using
   * the oj-label's <code class="prettyprint">id</code> attribute and the
   * JET form component's <code class="prettyprint">labelled-by</code> attribute.
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-label for="inputtextid" show-required="[[isRequired]]"
   * help.definition="[[helpDef]]" help.source="[[helpSource]]">input label&lt;/oj-label>
   * &lt;oj-input-text id="inputtextid" required="[[isRequired]]">&lt;//oj-input-text>
   *
   * &lt;oj-label id="radiosetlabel" show-required="[[isRequired]]">radioset&lt;/oj-label>
   * &lt;oj-radioset required="[[isRequired]]" labelled-by="radiosetlabel">
   *   &lt;oj-option name="color" value="red">Red&lt;/oj-option>
   *   &lt;oj-option name="color" value="blue">Blue&lt;/oj-option>
   * &lt;/oj-radioset>
   *
   * &lt;!--  You can bind the text as a child comment node or on a span element, but not on the
   * oj-label element. The knockout text binding is not supported on a JET custom element; -->
   * &lt;oj-label for="input2">&lt;!--ko text: input2Label -->&lt;!--/ko-->&lt;/oj-label>
   * </code>
   * </pre>
   * <p>
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
   * <h3 id="styling-section">
   *   Styling
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
   * </h3>
   * {@ojinclude "name":"stylingDoc"}
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   * <p>For accessibility reasons, you need to associate the oj-label component to its
   * JET form component. For most JET form components you do this
   * using the oj-label's <code class="prettyprint">for</code> attribute and
   * the JET form component's <code class="prettyprint">id</code> attribute. For more examples,
   * refer to the JET form component's API jsdoc.
   * </p>
    *
   * @ojcomponent oj.ojLabel
   * @ojshortdesc A label is a short description of requested input.
   * @since 4.0.0
   * @augments oj.baseComponent
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["for", "showRequired"]}
   * @ojvbdefaultcolumns 3
   * @ojvbmincolumns 1
   */

  oj.__registerWidget('oj.ojLabel', $.oj.baseComponent, {
    version: '1.0.0',
    defaultElement: '<label>',
    widgetEventPrefix: 'oj',
    options: {
      /**
       * <p>
       * The <code class="prettyprint">for</code> attribute refers to the id of the
       * element this oj-label element is associated with.
       * Some JET form components support using oj-label's <code class="prettyprint">for</code>
       *  attribute to point to its <code class="prettyprint">id</code> attribute
       * (e.g., oj-input-text, oj-slider), and others do not (e.g., oj-checkboxset).
       * <p>
       * For the oj-radioset, oj-checkboxset, oj-color-palette, and oj-color-spectrum components,
       * instead of the <code class="prettyprint">for</code> attribute, use the
       * <code class="prettyprint">id</code> attribute on oj-label
       * with JET's form element's <code class="prettyprint">labelled-by</code> attribute.
       * </p>
       * <p>
       * Refer to the JET's form element's documentation for more examples showing the
       * use of <code class="prettyprint">for</code>/<code class="prettyprint">id</code>
       * and the use of <code class="prettyprint">id</code>/<code class="prettyprint">labelled-by</code>.
       * </p>
       *
       * @expose
       * @memberof oj.ojLabel
       * @ojshortdesc Specifies the form element associated with this label. See the Help documentation for more information.
       * @instance
       * @type {string|null}
       * @default null
       * @since 4.0.0
       *
       * @example <caption>Associate oj-label to the oj-input-text using the
       * <code class="prettyprint">for</code> attribute on oj-label and the
       * <code class="prettyprint">id</code> attribute on oj-input-text during initialization.</caption>
       * &lt;oj-label for="inputId">Name:&lt;/oj-label>
       * &lt;oj-input-text id="inputId">&lt;/oj-input-text>
       *
       */
      for: null,

      /**
       * The help information that goes on the oj-label.  The help attributes are:
       * <ul>
       * <li><code class="prettyprint">definition</code> - this is the help definition text.
       * It is what shows up
       * when the user hovers over the help icon, or tabs into the help icon, or press
       * and holds the help icon on a mobile device. No formatted text is available for
       * help definition attribute.</li>
       * <li><code class="prettyprint">source</code> - this is the help source url.
       * If present, a help icon will
       * render next to the label. For security reasons
       *  we only support urls with protocol http: or https:.
       * If the url doesn't comply we ignore it and throw an error.
       * Pass in an encoded URL since we do not encode the URL.
       * </ul>
       *
       * @expose
       * @memberof oj.ojLabel
       * @ojshortdesc Help information associated with this label.
       * @instance
       * @type {Object|null}
       * @default {'definition' :null, 'source': null}
       * @since 4.0.0
       *
       * @example <caption>Initialize the label with the help definition and help source:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-label help.definition="some help definition" help.source="some external url">Name:&lt;/oj-label>
       * &lt;!-- Using JSON notation -->
       * &lt;oj-label help='{"definition":"some value", "source":"someurl"}'>Name:&lt;/oj-label>
       * @example <caption>Set the <code class="prettyprint">help</code> attribute, after initialization:</caption>
       *
       * // Set one, leaving the others intact. Use the setProperty API for
       * // subproperties so that a property change event is fired.
       * myComponent.setProperty('help.definition', 'some new value');
       * // Get all
       * var values = myComponent.help;
       * // Set all.  Must list every key, as those not listed are lost.
       * myComponent.help = {
       *   definition: 'some new value',
       *   source: 'some new url'
       * };
       * @property {(string|null)=} definition help definition text
       * @property {(string|null)=} source help source url
       */
      help: {
        definition: null,
        source: null
      },

      /**
       * <code class="prettyprint">label-id</code> sets the <code class="prettyprint">id</code>
       * attribute on the internal label element.  The use case where this may be needed
       * is if you are using a <code class="prettyprint">&lt;div aria-labelledby></code>
       * and for accessibility reasons you need to point to the
       * oj-label's <code class="prettyprint">label</code>
       * element. This should be a corner case. Most often you'd use oj-label's
       * <code class="prettyprint">for</code> attribute to
       * associate with a form component's id attribute or use oj-label's
       * <code class="prettyprint">id</code> attribute to
       * associate with a JET form component's <code class="prettyprint">labelled-by</code> attribute.
       * @expose
       * @type {string|null}
       * @default null
       * @public
       * @instance
       * @since 4.0.0
       * @memberof oj.ojLabel
       * @ojshortdesc Specifies the id to set on the internal label element, if required. See the Help documentation for more information.
       *
       * @example <caption>Initialize the label with the
       * <code class="prettyprint">label-id</code> attribute:</caption>
       * &lt;oj-label label-id="labelId">Name:&lt;/oj-label>
       * @example <caption>Set the attribute, after initialization:</caption>
       * // getter
       * var labelid = myOjLabel.labelId;
       * // setter
       * myOjLabel.labelId = "myLabelId";
       */
      labelId: null,

      /**
       * Whether this label should have a required icon. It is recommended that you
       * bind the <code class="prettyprint">show-required</code> attribute to the same binding
       * as the <code class="prettyprint">required</code> attribute on the
       * associated JET form component to make sure they are in sync.
       * @expose
       * @type {?boolean}
       * @default false
       * @public
       * @instance
       * @memberof oj.ojLabel
       * @ojshortdesc Specifies whether the label should render an icon indicating that the associated form field requires a value. See the Help documentation for more information.
       * @since 4.0.0
       *
       * @example <caption>Initialize the oj-label with the
       * <code class="prettyprint">show-required</code> attribute, binding form component's
       * <code class="prettyprint">required</code> attribute to the same value.</caption>
       * &lt;oj-label show-required="[[isRequired]]">Name:&lt;/oj-label>
       * &lt;oj-input-text required="[[isRequired]]">&lt;/oj-input-text>
       * @example <caption>Set the attribute, after initialization:</caption>
       * // getter
       * var showRequired = myOjLabel.showRequired;
       * // setter
       * myOjLabel.showRequired = false;
       */
      showRequired: false,

      /**
       * Allows you to set certain attributes on the root dom element.
       * For ojLabel, we use 'class' only. The input components (via
       * EditableValue) set a styleclass on the ojLabel's root in case
       * component-specific label styling is needed. For example, ojradioset
       * would pass class: 'oj-radioset-label'. ojinputtext would pass class:
       * 'oj-inputtext-label'.
       *
       * @example <caption>Initialize root dom element with the set of
       * <code class="prettyprint">rootAttributes</code>:</caption>
       * $(".selector").ojLabel("option", "rootAttributes", {
       *   'class': 'oj-inputtext-label'
       * });
       *
       * @expose
       * @access public
       * @memberof oj.ojLabel
       * @instance
       * @type {Object}
       * @default {'id': null, 'class': null, 'style':null}
       * @ignore
       */
      rootAttributes: null
    },

    /**
     * @private
     * @memberof oj.ojLabel
     * @const
     */
    _BUNDLE_KEY: {
      _TOOLTIP_HELP: 'tooltipHelp',
      _TOOLTIP_REQUIRED: 'tooltipRequired'
    },

    /** ** start Public APIs ****/

    /**
     * Returns a jQuery object containing the root dom element of the label
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojLabel
     * @instance
     * @return {jQuery} the label
     * @ignore
     */
    widget: function widget() {
      return this.uiLabel;
    },

    /**
     * Refreshes the component with all the current attributes.
     * <p>
     * Call refresh if the <code class="prettyprint">id</code> changes, though
     * changing the <code class="prettyprint">id</code> shouldn't be needed.
     * </p>
     * <p>
     * Also, call refresh after <code class="prettyprint">required</code>
     * or <code class="prettyprint">help</code> changes.
     * The locale could have changed in the meantime, and refresh is needed to update the
     * <code class="prettyprint">required</code> and
     * <code class="prettyprint">help</code> tooltips.
     * </p>
     * There should be no need to call refresh for other attribute changes.
     *
     * @example document.getElementById("label1").setProperty("id","label2");
     * document.getElementById("label2").refresh();
     * @access public
     * @instance
     * @return {void}
     * @expose
     * @memberof oj.ojLabel
     * @ojshortdesc Refreshes the component.
     */
    refresh: function refresh() {
      this._super();

      this._refreshRequired();

      this._refreshHelp();

      this._addIdsToDom();
    },

    /** ** end Public APIs ****/

    /** ** start internal widget functions ****/

    /**
     * Overridden to make sure describedById option is set
     *
     * @memberof oj.ojLabel
     * @instance
     * @protected
     */
    _InitOptions: function _InitOptions(originalDefaults, constructorOptions) {
      this._super(originalDefaults, constructorOptions);

      this._isCustomElement = this._IsCustomElement();

      this._checkRequiredOption();
    },

    /**
     * After _ComponentCreate and _AfterCreate,
     * the widget should be 100% set up. this._super should be called first.
     * @override
     * @protected
     * @instance
     * @memberof oj.ojLabel
     */
    _ComponentCreate: function _ComponentCreate() {
      this._super();

      this._touchEatClickNamespace = this.eventNamespace + 'TouchEatClick';
      this._touchEatContextMenuNamespace = this.eventNamespace + 'TouchEatContextMenu';
      this._helpDefPopupNamespace = this.eventNamespace + 'HelpDefPopup';
      this._bTouchSupported = oj.DomUtils.isTouchSupported();

      this._drawOnCreate();
    },

    /**
     * @protected
     * @override
     * @instance
     * @memberof oj.ojLabel
    */
    _AfterCreate: function _AfterCreate() {
      var self = this;
      var forOption = this.options.for;
      var showRequiredOption = this.options.showRequired;
      var inputIdOption;
      var setIdOption;
      var targetElement;

      if (this.OuterWrapper) {
        inputIdOption = this.OuterWrapper.getAttribute('data-oj-input-id');
        setIdOption = this.OuterWrapper.getAttribute('data-oj-set-id');
      } // To get the 'for' on the <label>, what we do is set labelled-by on the
      // form component (simple document.getElementById search; we want to avoid
      // attribute searches since the performance isn't very good.),
      // which in turn sets the data-oj-input-id on the label, which
      // in turn sets its <label> element
      //


      if (inputIdOption) {
        // get internal label element and set its 'for'
        var labelElement = this.element[0];
        labelElement.setAttribute('for', inputIdOption);
      } else if (setIdOption) {
        // This is set by oj-radioset, oj-checkboxset, etc, so the oj-label can find it fast.
        this._targetElement = document.getElementById(setIdOption);
        targetElement = this._targetElement;

        if (this._needsHelpIcon()) {
          self._addHelpSpanIdOnTarget(self.helpSpanId, targetElement);
        }

        if (self.options.showRequired) {
          self._addRequiredDescribedByOnCustomFormElement(targetElement);
        }
      } // find the target element using document.getElementById, then set described-by
      // on it for helpIcon and requiredIcon accessibility.
      // And if there isn't an data-oj-input-id attribute set on oj-label yet,
      // set that.


      if (forOption && this._isCustomElement) {
        // get the targetElement in a setTimeout.
        // do this in next tick, otherwise there can be timing issues with bindings resolving
        // and the 'id' on the form component may not be resolved in time for oj-label to find
        // it - if oj-label is before the oj form component.
        // or setting labelled-by on form component which immediately
        // sets data-oj-input-id on oj-label.
        // If we do not do it in a setTimeout, then what we were observing is the data-oj-input-id
        // attribute would be set on the form component, but it wasn't getting the setOption
        // call. E.g., a test case is ojLabel with knockout where order is input and label
        var busyContext = Context.getContext(this.OuterWrapper).getBusyContext();
        var labelledByResolved = busyContext.addBusyState({
          description: "The oj-label id='" + this.OuterWrapper.id + "' is looking for its form component with id " + forOption
        });
        setTimeout(function () {
          self._targetElement = document.getElementById(forOption);

          if (self._targetElement) {
            targetElement = self._targetElement;

            if (self._needsHelpIcon()) {
              self._addHelpSpanIdOnTarget(self.helpSpanId, targetElement);
            }

            if (showRequiredOption) {
              self._addRequiredDescribedByOnCustomFormElement(targetElement);
            }

            if (!inputIdOption) {
              if (self._isElementCustomElement(targetElement)) {
                var ojLabelId = self.OuterWrapper.id;

                self._addElementAttribute(targetElement, ojLabelId, _LABELLED_BY);
              } else {
                self.element[0].setAttribute('for', forOption);
              }
            }
          } else {
            Logger.info('could not find an element with forOption ' + forOption);
          }

          labelledByResolved();
        }, 0);
      } else if (this._isCustomElement && this.options.labelId) {
        // no 'for' option.
        // look for aria-labelledby to support using
        // <oj-label> with a non-JET component, e.g., <div>
        // and this only works if aria-labelledby has only one id.
        // corner-case. For the JET components that link via id/labelled-by, not for/id,
        // the form component writes 'for' on the label, which in turn writes 'described-by'
        // on the JET form component.
        this._targetElement = this._getTargetElementFromLabelledAttr(_ARIA_LABELLEDBY, this.options.labelId);
        targetElement = this._targetElement;

        if (targetElement) {
          if (this._needsHelpIcon()) {
            this._addHelpSpanIdOnTarget(this.helpSpanId, targetElement);
          }
        }
      }
    },

    /**
     * <p>Save only the 'class' attribute since that is what
     * we manipulate. We don't have to save all the attributes.
     * N/A for custom element oj-label, so if custom element, this returns right away.
     *
     * @param {Object} element - jQuery selection to save attributes for
     * @protected
     * @memberof oj.ojLabel
     * @instance
     * @override
     */
    _SaveAttributes: function _SaveAttributes(element) {
      // _SaveAttributes is called before _InitOptions, so we can't use our global _isCustomElement
      // variable here.
      if (this._IsCustomElement()) {
        return;
      }

      this._savedClasses = element.attr('class');
    },

    /**
     * <p>Restore what was saved in _SaveAttributes.
     * N/A for custom element oj-label, so if custom element, this returns right away.
     * </p>
     *
     * @protected
     * @memberof oj.ojLabel
     * @instance
     * @override
     */
    _RestoreAttributes: function _RestoreAttributes() {
      if (this._IsCustomElement()) {
        return;
      } // restore the saved "class" attribute. Setting class attr to undefined is a no/op, so
      // if this._savedClasses is undefined we explicitly remove the 'class' attribute.


      if (this._savedClasses) {
        this.element.attr('class', this._savedClasses);
      } else {
        this.element.removeAttr('class');
      }
    },

    /**
     * Notifies the component that its subtree has been removed from the document programmatically
     * after the component has been created
     * @memberof! oj.ojLabel
     * @instance
     * @protected
     */
    _NotifyDetached: function _NotifyDetached() {
      this._superApply(arguments);

      this._handleCloseHelpDefPopup();
    },

    /**
     * Notifies the component that its subtree has been made hidden programmatically
     * after the component has been created
     * @memberof! oj.ojLabel
     * @instance
     * @protected
     */
    _NotifyHidden: function _NotifyHidden() {
      this._superApply(arguments);

      this._handleCloseHelpDefPopup();
    },

    /**
     * The translation section name for the private ojLabel() is oj-ojLabel.
     * In 4.0.0 and the introduction of the oj-label custom element,
     *  the translation section name is oj-ojLabel.
     * @protected
     * @override
     * @instance
     * @memberof oj.ojLabel
     */
    _GetTranslationsSectionName: function _GetTranslationsSectionName() {
      if (!this._IsCustomElement()) {
        return 'oj-ojLabel';
      }

      return 'oj-ojLabel';
    },

    /**
     * Method for components to override in order to handle changes to watched attributes.
     * @param {string} attr The name of the watched attribute
     * @param {string} oldValue The old attribute value
     * @param {string} newValue The new attribute value
     * @protected
     * @override
     * @instance
     * @memberof oj.ojLabel
     */
    // eslint-disable-next-line no-unused-vars
    _WatchedAttributeChanged: function _WatchedAttributeChanged(attr, oldValue, newValue) {
      this._superApply(arguments);

      switch (attr) {
        case 'data-oj-input-id':
          // set 'for' on the label element to be the value of this inputId.
          this.element[0].setAttribute('for', newValue);
          break;

        case 'data-oj-set-id':
          // This is set by set components like oj-radioset, oj-checkboxset, etc.
          this._targetElement = document.getElementById(newValue);
          var targetElement = this._targetElement; // we need to wait a tick because for oj-radioset,
          // it sets 'data-oj-set-id' on oj-label
          // which in turn sets 'described-by' on oj-radioset. And if we didn't wait a
          // tick, the attribute is written fine, but the describedBy option change is lost.
          // The testcase is this:
          // create an ojLabel with knockout where order is label and wrapped radioset

          var needsHelpIcon = this._needsHelpIcon();

          var needsRequiredIcon = this.options.showRequired;

          if (needsHelpIcon || needsRequiredIcon) {
            var busyContext = Context.getContext(this.OuterWrapper).getBusyContext();
            var describedByResolved = busyContext.addBusyState({
              description: 'The oj-label is writing described-by on its target.'
            });
            var self = this;
            setTimeout(function () {
              if (needsHelpIcon) {
                self._addHelpSpanIdOnTarget(self.helpSpanId, targetElement);
              }

              if (self.options.showRequired) {
                self._addRequiredDescribedByOnCustomFormElement(targetElement);
              }

              describedByResolved();
            }, 0);
          }

          break;

        default:
          break;
      }
    },

    /**
     * set up dom and styles on create
     * @private
     * @memberof oj.ojLabel
     */
    _drawOnCreate: function _drawOnCreate() {
      var helpSpan = null;
      var labelElementId; // custom element is <oj-label>. this.element is the <label> element.
      // <oj-label class="oj-label oj-component">
      //    <div class="oj-label-group">(helpandrequired spans)<label></label>
      // </oj-label>

      if (this.OuterWrapper) {
        this.uiLabel = $(this.OuterWrapper).append(this.element.wrap(this._createOjLabelGroupDom()).parent()); // @HTMLUpdateOK

        this.uiLabel.addClass('oj-label oj-component');
      } else {
        // wrap the label with a root dom element (oj-label) and its child
        // (oj-label-group). Then point this.uiLabel to the root dom element <div class=oj-label>
        this.uiLabel = this.element.wrap(this._createRootDomElement()) // @HTMLUpdateOK
        .closest('.oj-component');
      } // adds id to the label element from label-id or id or generates one (in that order).
      // used for both ojLabel and oj-label.


      this._addIdsToDom(); // use the label element's id to create the help span and required span ids


      labelElementId = this.element[0].id;
      this.helpSpanId = labelElementId + _HELP_ICON_ID;
      this.requiredSpanId = labelElementId + _REQUIRED_ICON_ID; // move any oj-label styles off of this.element, and put on the
      // root dom element. They are restored in _destroy

      if (!this._isCustomElement) {
        this._moveLabelStyleClassesToRootDom();
      } // we put a span with an id on it around the help icon and
      // a span with an id on it around the required icon so that
      // the input's aria-describedby can point to it, if needed. Then the screen reader will
      // read the aria-label on the images when focus is on the input, so the user knows
      // that there is help and/or required icons.


      if (this.options.showRequired) {
        this._createRequiredIconSpanDom();
      }

      if (this._needsHelpIcon()) {
        helpSpan = this._createIconSpan(this.helpSpanId, true);

        this._createHelp(helpSpan);
      }
    },

    /**
     * Add described-by for the required icon on the custom form element.
     * This will be oj-checkboxset or oj-radioset only.
     * For all form controls except radioset
     * and checkboxset, aria-required on the form control reads required. So no need to
     * put aria-describedby on those for required icon.
     * @private
     * @memberof oj.ojLabel
     * @instance
     *
     */
    _addRequiredDescribedByOnCustomFormElement: function _addRequiredDescribedByOnCustomFormElement(targetElement) {
      if (targetElement && this._isElementCustomElementAriaRequiredUnsupported(targetElement)) {
        this._addElementAttribute(targetElement, this.requiredSpanId, _DESCRIBED_BY);
      }
    },

    /**
     * @private
     * @instance
     * @memberof oj.ojLabel
     *
     */
    _removeRequiredDescribedByOnCustomFormElement: function _removeRequiredDescribedByOnCustomFormElement(targetElement) {
      if (targetElement && this._isElementCustomElementAriaRequiredUnsupported(targetElement)) {
        this._removeElementAttribute(targetElement, this.requiredSpanId, _DESCRIBED_BY);
      }
    },

    /**
     * Call for custom oj-label element only. Adds aria-describedby on native form element or
     * described-by on JET form element with the help icon span's id or aria-labelledby on
     * div role='group'..
     * @private
     * @instance
     * @memberof oj.ojLabel
     * @param {string} helpSpanId The id of the help span
     *
     */
    _addHelpSpanIdOnTarget: function _addHelpSpanIdOnTarget(helpSpanId, targetElement) {
      var attributeName;
      attributeName = this._getAriaAttributeForTarget(targetElement);

      this._addElementAttribute(targetElement, helpSpanId, attributeName);
    },

    /**
     * Call for custom oj-label element only. Removes aria-describedby on native form element or
     * described-by on JET form element with the help icon span's id or aria-labelledby on
     * div role='group'.
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _removeHelpSpanIdOnTarget: function _removeHelpSpanIdOnTarget(helpSpanId, targetElement) {
      var attributeName;
      attributeName = this._getAriaAttributeForTarget(targetElement);

      this._removeElementAttribute(targetElement, helpSpanId, attributeName);
    },

    /**
     * Based on the targetElement, this figures out which attribute we need to write onto
     * the target to make it be able to read out the help definition. E.g., described-by for
     * JET form control, aria-describedby for input, aria-labelled-by for div role='group'
     * @param {Element} targetElement
     * @return {string|null} the attribute, aria-describedby, aria-labelledby, or described-by
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _getAriaAttributeForTarget: function _getAriaAttributeForTarget(targetElement) {
      var attributeName;

      if (!this._isElementCustomElement(targetElement)) {
        // We handle the one label to role='group' differently.
        // If a <div aria-labelledby role='group'> points to the
        // <oj-label>'s label-id, then add/remove aria-labelledby, not aria-describedby, since
        // screenreaders don't read aria-describedby on divs.
        if (targetElement.getAttribute('role') === 'group') {
          attributeName = _ARIA_LABELLEDBY;
        } else {
          attributeName = _ARIA_DESCRIBEDBY;
        }
      } else {
        attributeName = _DESCRIBED_BY;
      }

      return attributeName;
    },

    /**
     * Return the element with by using a querySelector to search for the attribute with the id.
     * e.g., aria-labelledby attribute set to labelId.
     * @private
     * @instance
     * @memberof oj.ojLabel
     * @param attrName the attribute name to look for. e.g., labelled-by or aria-labelledby
     * @param {string} id
     * @return {Element|null} is a reference to an Element object,
     * or null if the element is not found.
     *
     */
    _getTargetElementFromLabelledAttr: function _getTargetElementFromLabelledAttr(attrName, id) {
      var attributeSearchString; // The ~ means to look to see if the id is in a list of whitespace-separated
      // values, one of which is exactly equal to id, and labelled-by could have a
      // list of whitespace-separated ids.

      attributeSearchString = '[' + attrName + "~='" + id + "']";
      return document.querySelector(attributeSearchString);
    },

    /**
     * If targetElement's tagName has a "-", return true, else return false.
     * @param {Element} targetElement the HTML element the 'for' attribute is pointing to
     * @private
     * @memberof oj.ojLabel
     * @instance
     * @return {boolean} return true if targetElement's tagName contains "-". Else return false.
     *
     */
    _isElementCustomElement: function _isElementCustomElement(targetElement) {
      oj.Assert.assertDomElement(targetElement);
      return targetElement.tagName.indexOf('-') !== -1;
    },

    /**
     * Checks the targetElement's tagname against oj-checkboxset or oj-radioset, because these
     * are the only components that do not support aria-required.
     * @param {Element} targetElement the HTML element the 'for' attribute is pointing to
     * @private
     * @memberof oj.ojLabel
     * @instance
     * @return {boolean} true if targetElement's tagName is oj-radioset or oj-checkboxset.
     *
     */
    _isElementCustomElementAriaRequiredUnsupported: function _isElementCustomElementAriaRequiredUnsupported(targetElement) {
      oj.Assert.assertDomElement(targetElement);
      var componentName;
      var componentNames = ['oj-radioset', 'oj-checkboxset'];
      var length = componentNames.length;
      var tagName;
      var found = false;
      tagName = targetElement.tagName.toLowerCase();

      for (var i = 0; i < length && !found; i++) {
        componentName = componentNames[i];

        if (tagName.indexOf(componentName) === 0) {
          found = true;
        }
      }

      return found;
    },

    /**
     * Generic function to add a value to the element's attribute. For example, you can
     * add "foo" to the elem's aria-describedby attribute. It will not overwrite
     * any current aria-describedby values already there.
     *
     * @param {Element} elem the HTML element on which to add the attribute
     * @param {string} id the id to add to the attribute
     * @param {string} attr the attribute to add to. e.g., "aria-describedby"
     * @private
     * @memberof oj.ojLabel
     * @instance
     *
     */
    _addElementAttribute: function _addElementAttribute(elem, id, attr) {
      var index;
      var currentAttributeValue = elem.getAttribute(attr);
      var newAttributeValue;
      var tokens;
      tokens = currentAttributeValue ? currentAttributeValue.split(/\s+/) : []; // Get index that id is in the tokens, if at all.

      index = tokens.indexOf(id); // add id if it isn't already there

      if (index === -1) {
        tokens.push(id);
      }

      newAttributeValue = tokens.join(' ').trim();
      elem.setAttribute(attr, newAttributeValue);
    },

    /**
     * Generic function to remove a value to the element's attribute. For example, you can
     * remove "foo" from the elem's aria-describedby attribute. It will not remove
     * any other aria-describedby values already there.
     * @param {Element} elem the HTML element
     * @param {string} id the id to remove from the attr
     * @param {string} attr the attribute to remove from. e.g., "aria-describedby"
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _removeElementAttribute: function _removeElementAttribute(elem, id, attr) {
      var currentAttributeValue = elem.getAttribute(attr);
      var newAttributeValue;
      var index;
      var tokens; // get aria-describedby that is on the element
      // split into tokens

      tokens = currentAttributeValue ? currentAttributeValue.split(/\s+/) : []; // Get index that id is in the tokens, if at all.

      index = tokens.indexOf(id); // remove that from the tokens array

      if (index !== -1) {
        tokens.splice(index, 1);
      } // join the tokens back together and trim whitespace


      newAttributeValue = tokens.join(' ').trim();

      if (newAttributeValue) {
        elem.setAttribute(attr, newAttributeValue);
      } else {
        elem.setAttribute(attr, '');
      }
    },

    /**
     * Create help.
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _createHelp: function _createHelp(helpSpan) {
      var helpDef = this.options.help.definition;
      var helpSource = this.options.help.source;

      var helpIconAnchor = this._createHelpIconAnchorDomElement(helpDef, helpSource); // .prepend: Insert content, specified by the parameter, to the beginning of each element


      $(helpSpan).prepend( // @HTMLUpdateOK
      helpIconAnchor);

      this._attachHelpDefToIconAnchor();

      this._focusable({
        element: helpIconAnchor,
        applyHighlight: true
      });
    },

    /**
     * Create required icon span dom and its contents
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _createRequiredIconSpanDom: function _createRequiredIconSpanDom() {
      // _createIconSpan creates the span and adds it in the oj-label-group dom
      var requiredSpan = this._createIconSpan(this.requiredSpanId, false);

      requiredSpan.appendChild(this._createRequiredIconDomElement()); // @HTMLUpdateOK
    },

    /**
     * @throws error if showRequired is not a boolean
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _checkRequiredOption: function _checkRequiredOption() {
      var showRequired = this.options.showRequired;

      if (typeof showRequired !== 'boolean') {
        throw new Error("Option 'showRequired' has invalid value set: " + showRequired);
      }
    },

    /**
     * Add an id to the label element if there isn't one already there.
     * Called during init and refresh.
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _addIdsToDom: function _addIdsToDom() {
      var labelElementId; // Use label-id to set label element's id. If label-id doesn't exist, this uses oj-label's
      // id to generate a sub-id on label.

      if (this._isCustomElement) {
        if (!this.OuterWrapper.id) {
          $(this.OuterWrapper).uniqueId();
        }

        this._refreshLabelId();
      } // if no id on the label element, generate one.
      // this will be used to wrap the helpIcon and the requiredIcon and
      // then for the aria-describedby on the input.


      labelElementId = this.element.attr('id');

      if (labelElementId == null) {
        this.element.uniqueId();
      }
    },

    /**
     * Called if NOT a custom element.
     * move oj-label* classes from label element onto the root dom element
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _moveLabelStyleClassesToRootDom: function _moveLabelStyleClassesToRootDom() {
      var arrayOfClasses;
      var classes = this.element.attr('class');
      var className;
      var numClasses;

      if (classes) {
        arrayOfClasses = classes.split(/\s+/);
        numClasses = arrayOfClasses.length;

        for (var i = 0; i < numClasses; i++) {
          className = arrayOfClasses[i]; // if class name has -label- in it, then move it
          // (e.g., oj-label, oj-label-inline, oj-md-label-nowrap,
          // oj-md-labels-inline)

          if (className.indexOf('-label') > 0) {
            this.uiLabel.addClass(className);
            this.element.removeClass(className);
          }
        }
      }
    },

    /**
     * create and return the span with an id that we'll use to put around the help
     * icon or required icon. The order of the dom of oj-label-group's children should always be:
     * <helpIcon span/><requiredIcon span/><label element>
     * @param {string} id the id of the span
     * @param {boolean} isHelp if true, prepend icon span to oj-label-group, else
     * add before the label element.
     * This is needed because we always want the help dom to come before the required dom and
     * we always want the label element to come last.
     * @returns {Element}
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _createIconSpan: function _createIconSpan(id, isHelp) {
      var ojLabelGroupDom;
      var span = document.createElement('span');
      span.setAttribute('id', id);

      if (isHelp) {
        ojLabelGroupDom = this.uiLabel.find('.oj-label-group');
        ojLabelGroupDom.prepend(span); // @HTMLUpdateOK
      } else {
        this.element.before(span); // @HTMLUpdateOK
      }

      return span;
    },

    /**
     * For ojLabel component only, not oj-label.
     * return the dom node for the root dom element
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _createRootDomElement: function _createRootDomElement() {
      var inputLabelClass;
      var rootAttributes = this.options.rootAttributes;
      var rootDomNode;
      var rootDomNodeClasses = 'oj-label oj-component';

      if (rootAttributes) {
        inputLabelClass = rootAttributes.class;
      }

      if (inputLabelClass) {
        rootDomNodeClasses = rootDomNodeClasses + ' ' + inputLabelClass;
      } // rootDomNode =
      //  $("<div class='oj-label oj-component'><div class='oj-label-group'></div></div>",
      //     this.document[0]);


      rootDomNode = document.createElement('div');
      rootDomNode.className = rootDomNodeClasses;
      rootDomNode.appendChild(this._createOjLabelGroupDom()); // @HTMLUpdateOK

      return rootDomNode;
    },

    /**
     * return the dom node for the oj-label-group node
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _createOjLabelGroupDom: function _createOjLabelGroupDom() {
      var labelGroupNode;
      labelGroupNode = document.createElement('div');
      labelGroupNode.className = 'oj-label-group';
      return labelGroupNode;
    },

    /**
     * return the dom node for the span with oj-label-required-icon
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _createRequiredIconDomElement: function _createRequiredIconDomElement() {
      var requiredTooltip = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_REQUIRED);
      var requiredDom = document.createElement('span');
      requiredDom.className = 'oj-label-required-icon oj-component-icon';
      requiredDom.setAttribute('role', 'img');
      requiredDom.setAttribute('title', requiredTooltip); // title isn't being read by the screen reader. this is only needed for radioset/checkboxset.

      requiredDom.setAttribute('aria-label', requiredTooltip);
      return requiredDom;
    },

    /**
     * return the dom node for the help icon anchor.
     * if (_needsHelpIcon) , show help icon
     * if (helpSource), add href
     * if (helpDef), add 'aria-label'=helpDef on help icon.
     * @private
     * @memberof oj.ojLabel
     * @instance
     */
    _createHelpIconAnchorDomElement: function _createHelpIconAnchorDomElement(helpDef, source) {
      var helpIconAnchor; // construct the help html
      // if source (external url) or helpDef, then render a clickable help icon
      // From our Accessibility expert - You must not put role of img on a link.
      // This will make it so it is not a link any more to AT.
      // It is ok to leave it off the the <a> tag and do the following.
      // helpIconAnchor =
      //  $( "<a tabindex='0' target='_blank' class='oj-label-help-icon-anchor oj-label-help-icon oj-component-icon oj-clickable-icon-nocontext'></a>",
      //  this.document[0] );
      // The above is not reading anything when it has focus if it doesn't have an href. So if
      // it doesn't have an href, it needs some kind of role on it.

      helpIconAnchor = document.createElement('a');
      helpIconAnchor.setAttribute('tabindex', '0');
      helpIconAnchor.setAttribute('target', '_blank');
      helpIconAnchor.className = 'oj-label-help-icon-anchor oj-label-help-icon oj-component-icon oj-clickable-icon-nocontext';

      if (source) {
        try {
          oj.DomUtils.validateURL(source);
          helpIconAnchor.setAttribute('href', source);
        } catch (e) {
          throw new Error(e + '. The source option (' + source + ') is invalid.');
        }
      } else {
        // if there is no href, then we need a role that the screen reader/voiceover will read.
        helpIconAnchor.setAttribute('role', 'img');
      }

      if (helpDef) {
        helpIconAnchor.setAttribute('aria-label', helpDef);
      } else {
        helpIconAnchor.setAttribute('aria-label', this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_HELP));
      }

      return helpIconAnchor;
    },

    /**
     * To accomodate keyboard and touch users,
     * show a popup on hover, on tabbing in or touch press that shows the
     * help definition text on the help icon.
     *
     * press is recognized when the
     * pointer is down for x ms without any movement. In other words, you press with your finger and
     * don't let up and then after x ms the Help Def window shows up. You can then let go of your finger
     * the help def window stays up.
     * On Android, when you press and hold you see touchstart. When you finally let up, you see touchend
     * On ios, when you press and hold you see touchstart. When you finally let up, sometimes you
     * see touchend only. Other times, you see touchend mousedown mouseup click all
     * consecutively.
     * On ios, a quick tap shows touchstart touchend mousedown mouseup click (I only register those events)
     * all right after another.
     * @private
     * @memberof oj.ojLabel
     */
    _attachHelpDefToIconAnchor: function _attachHelpDefToIconAnchor() {
      var $helpDefPopupDiv;
      var $helpIcon;
      var position;
      var self = this;
      $helpIcon = this.widget().find('.oj-label-help-icon-anchor'); // before we do any of this work, make sure there is a help icon

      if ($helpIcon.length === 0) {
        return;
      } // Create the popup div where we will display the help def text, add a unique id onto it and save
      // that id so we can use it to popup.
      // 1. Build display:none div with help definition text. This will be our popup.
      // 2. Register click/touch event on label which will call a callback to open the popup on
      // PRESS


      if (this._bTouchSupported) {
        // this is code to be extra careful: Check if the _eatClickOnHelpIconListener exists.
        // If it does exist, call 'off'. We don't want this click listener
        // that eats clicks lying around.
        if (this._eatClickOnHelpIconListener) {
          this.widget().off(this._touchEatClickNamespace);
        } // The pressHold gesture also fires a click event on iphone on touchend.  Prevent that here.
        // This event is added to the widget on click in the function _handleOpenPopupForHelpDef


        this._eatClickOnHelpIconListener = function () {
          // changing colors is a good way to debug if the handler is being called. this changes
          // the label color.
          // if (this.style.color === "aqua")
          // this.style.color = "yellow";
          // else
          // this.style.color = "aqua";
          return false;
        };

        $helpIcon.on('contextmenu' + this._touchEatContextMenuNamespace, false);
      } // For touch device, press with finger on helpIcon to show the help def in a popup.
      // If there is no help source, you can also tap with finger on the helpIcon to show the help
      // def in a popup.
      // For keyboard users, tab in to helpIcon to show the help def in a popup.
      // For mouse users, hovering on helpIcon shows the help def in a popup.
      // ------------------------------------------------------------------------------------
      // ENTERING CALLBACK TO OPEN THE POPUP IF NEEDED
      // (focusin from tab, not mouse, OR press from touch)


      this._openPopupForHelpDefCallbackListener = function (event) {
        if ($helpDefPopupDiv == null) {
          // create popup's div
          $helpDefPopupDiv = self._createHelpDefPopupDiv();
          position = {
            my: 'start bottom',
            at: 'end top',
            collision: 'flipcenter',
            of: $helpIcon
          };
          $helpDefPopupDiv.ojPopup({
            position: position,
            modality: 'modeless',
            animation: {
              open: null,
              close: null
            }
          });
        }

        self._handleOpenHelpDefPopup(event, $helpDefPopupDiv, $helpIcon);
      }; // END CALLBACK TO OPEN POPUP
      //
      // CALLBACK TO CLOSE POPUP


      this._closePopupForHelpDefCallbackListener = function () {
        self._handleCloseHelpDefPopup();
      }; // END CALLBACK TO CLOSE POPUP
      // Add event handlers to open the help definition popup


      this._addShowHelpDefinitionEventHandlers($helpIcon);
    },

    /**
     * Create the div that will be used as the popup for the help definition.
     * @private
     * @memberof oj.ojLabel
     */
    _createHelpDefPopupDiv: function _createHelpDefPopupDiv() {
      var contentDiv;
      var $contentDiv;
      var helpDef = this.options.help.definition;
      var helpDefPopupDiv;
      var $helpDefPopupDiv;
      var helpDefText;

      if (helpDef) {
        helpDefText = helpDef;
      } else {
        helpDefText = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_HELP);
      }

      if (!this._helpDefPopupDivId) {
        // create a root node to bind to the popup
        helpDefPopupDiv = document.createElement('div');
        helpDefPopupDiv.className = 'oj-help-popup';
        helpDefPopupDiv.style.display = 'none';
        $helpDefPopupDiv = $(helpDefPopupDiv);
        $helpDefPopupDiv.uniqueId();
        this._helpDefPopupDivId = $helpDefPopupDiv.prop('id'); // create a content node

        contentDiv = document.createElement('div');
        contentDiv.className = 'oj-help-popup-container';
        helpDefPopupDiv.appendChild(contentDiv); // @HTMLUpdateOK created contentDiv ourselves

        $contentDiv = $(contentDiv);
        $contentDiv.text(helpDefText);
        this.uiLabel.append($helpDefPopupDiv);
      } else {
        // Find the div with the id, and then update the text of it.
        $helpDefPopupDiv = $(document.getElementById(this._helpDefPopupDivId));

        if ($helpDefPopupDiv.length) {
          $contentDiv = $helpDefPopupDiv.find('.oj-help-popup-container').first();
          $contentDiv.text(helpDefText);
        }
      }

      return $helpDefPopupDiv;
    },

    /**
     * Add the event listeners to show the helpDefinition text in a popup
     * @param {jQuery} $helpIcon
     * @returns {undefined}
     * @instance
     * @memberof oj.ojLabel
     * @private
     */
    _addShowHelpDefinitionEventHandlers: function _addShowHelpDefinitionEventHandlers($helpIcon) {
      var hammerOptions; // Open the popup on focusin and mousenter.
      // *I have logic in the listener to ignore these when these trigger as a result of
      // the user touching the screen.

      $helpIcon.on('focusin' + this._helpDefPopupNamespace + ' mouseenter' + this._helpDefPopupNamespace, this._openPopupForHelpDefCallbackListener);
      $helpIcon.on('mouseleave' + this._helpDefPopupNamespace, this._closePopupForHelpDefCallbackListener);

      if (this._bTouchSupported) {
        // And if touch is supported, the user can also open the popup on press or,
        //  if no help source, on tap.
        if (this.options.help.source) {
          hammerOptions = {
            recognizers: [[Hammer.Press, {
              time: oj.DomUtils.PRESS_HOLD_THRESHOLD
            }]]
          };
          $helpIcon.ojHammer(hammerOptions); // JET components are encouraged to use JQUI's _on() method, giving all the conveniences
          // of the _on method, like automatic cleanup.

          this._on($helpIcon, {
            press: this._openPopupForHelpDefCallbackListener
          });
        } else {
          hammerOptions = {
            recognizers: [[Hammer.Tap], [Hammer.Press, {
              time: oj.DomUtils.PRESS_HOLD_THRESHOLD
            }]]
          };
          $helpIcon.ojHammer(hammerOptions);

          this._on($helpIcon, {
            press: this._openPopupForHelpDefCallbackListener,
            tap: this._openPopupForHelpDefCallbackListener
          });
        }
      }
    },

    /**
     * Handle open popup for help definition.
     * @instance
     * @memberof oj.ojLabel
     * @private
     */
    _handleOpenHelpDefPopup: function _handleOpenHelpDefPopup(event, helpDefPopupDiv, helpIcon) {
      var isOpen = helpDefPopupDiv.ojPopup('isOpen');

      if (isOpen) {
        return;
      } // touch supported does not mean only touch. It could be a touch-enabled laptop like Windows10


      if (this._bTouchSupported) {
        // For a press, we want to show the popup with the help def,
        // but we do not want to navigate to the source url. So we eat the click.
        if (event.type === 'press') {
          var widget = this.widget();
          widget.on('click' + this._touchEatClickNamespace, this._eatClickOnHelpIconListener);
          var self = this;
          helpDefPopupDiv.on('ojclose', function () {
            widget.off(self._touchEatClickNamespace);
          });
        } else {
          helpDefPopupDiv.off('ojclose');
        } // Open the popup if I get a 'press' event, a 'tap' event, a 'focusin' event if
        // it wasn't a touch, and a 'mouseenter' event if it wasn't a touch.
        // I look for a recent touchstart event and use this to filter out
        // the focusin and mouseevent events. I use touchstart and not touchend because while
        // pressing I get the touchstart, but I don't get the touchend until the finger lets up.


        if (event.type === 'press' || event.type === 'tap' || !oj.DomUtils.recentTouchStart() && (event.type === 'focusin' || event.type === 'mouseenter')) {
          helpDefPopupDiv.ojPopup('open', helpIcon);
        } // end touch code

      } else {
        // non-touch devices. focusin/mouseenter are the only ways to open the popup.
        helpDefPopupDiv.ojPopup('open', helpIcon);
      }
    },

    /**
     * Close helpDef popup. This is called from _NotifyDetached and _NotifyHidden and
     * as a callback for this._closePopupForHelpDefCallbackListener.
     * @private
     * @memberof oj.ojLabel
     */
    _handleCloseHelpDefPopup: function _handleCloseHelpDefPopup() {
      var $helpDefPopupDiv;

      if (this._helpDefPopupDivId != null) {
        $helpDefPopupDiv = $(document.getElementById(this._helpDefPopupDivId));
        $helpDefPopupDiv.ojPopup('close');
      }
    },

    /**
     * Remove the event listeners for opening a popup on the help def icon and for eating
     * the clicks on the 'press' event. Called from destroy and when we remove the help icon.
     * @private
     * @memberof oj.ojLabel
     */
    _removeHelpDefIconEventListeners: function _removeHelpDefIconEventListeners(helpIcon) {
      if (this._bTouchSupported) {
        this.widget().off(this._touchEatClickNamespace);
        helpIcon.off(this._touchEatContextMenuNamespace);
        this._eatClickOnHelpIconListener = null;
        this._eatContextMenuOnHelpIconListener = null; // helpIcon is same element on which we originally called ojHammer()
        // the listeners are automatically removed since we used jqueryui's _on

        helpIcon.ojHammer('destroy');
      }

      helpIcon.off(this._helpDefPopupNamespace);
      this._openPopupForHelpDefCallbackListener = null;
      this._closePopupForHelpDefCallbackListener = null;
    },

    /**
     * removes the help def popup dom and variables
     * @returns {undefined}
     * @private
     * @memberof oj.ojLabel
     */
    _removeHelpDefPopup: function _removeHelpDefPopup() {
      var $helpDefPopupDiv;

      if (this._helpDefPopupDivId != null) {
        $helpDefPopupDiv = $(document.getElementById(this._helpDefPopupDivId));

        if ($helpDefPopupDiv.length > 0) {
          $helpDefPopupDiv.ojPopup('destroy');
          $helpDefPopupDiv.remove();
        }

        this._helpDefPopupDivId = null;
      }
    },

    /**
     * @private
     * @memberof oj.ojLabel
     * @returns {boolean}
     */
    _needsHelpIcon: function _needsHelpIcon() {
      var options = this.options;
      var helpDef;
      var helpSource = options.help.source;
      var needsIcon; // "", or null, or undefined all mean help.source is not specified.

      needsIcon = helpSource !== '' && helpSource != null;

      if (!needsIcon) {
        // Now check helpDef: "", or null, or undefined all mean help.definition is not specified.
        helpDef = options.help.definition;
        needsIcon = helpDef !== '' && helpDef != null;
      }

      return needsIcon;
    },

    /**
     * refresh the help dom --
     * find the help root dom node and remove it if it is there
     * and add back the help html. Helpful if a help option changed.
     * @private
     * @memberof oj.ojLabel
     */
    _refreshHelp: function _refreshHelp() {
      var helpSpanId = this.helpSpanId;
      var helpSpan;
      var $helpIcon;
      var needsHelpIcon;
      var targetElement = this._targetElement; // remove the help info if it is there.

      $helpIcon = this.uiLabel.find('.oj-label-help-icon');

      if ($helpIcon.length === 1) {
        // remove things we added in _attachHelpDefToIconAnchor
        this._removeHelpDefIconEventListeners($helpIcon);

        this._removeHelpDefPopup();

        $helpIcon.remove();
      }

      helpSpan = document.getElementById(helpSpanId);
      needsHelpIcon = this._needsHelpIcon(); // ok, we removed the helpIcon (but not the span) at the start of this method,
      // so we need to add it back if we needHelpIcon

      if (needsHelpIcon) {
        if (helpSpan == null) {
          helpSpan = this._createIconSpan(helpSpanId, true);
        }

        this._createHelp(helpSpan);

        if (this._isCustomElement) {
          this._addHelpSpanIdOnTarget(helpSpanId, targetElement);
        }
      } else if (helpSpan !== null) {
        helpSpan.parentNode.removeChild(helpSpan);

        if (this._isCustomElement) {
          this._removeHelpSpanIdOnTarget(helpSpanId, targetElement);
        }
      }
    },

    /**
     * refresh the required dom --
     * if required is true, then add the required dom if it isn't already there
     * if required is false, remove the required dom if it is there.
     * Helpful if the required option changed.
     * @private
     * @memberof oj.ojLabel
     */
    _refreshRequired: function _refreshRequired() {
      var $requiredDom;
      var requiredSpanId = this.requiredSpanId;
      var requiredSpan;
      var requiredTooltip;
      requiredSpan = document.getElementById(requiredSpanId);

      if (this.options.showRequired) {
        // add required if it wasn't already there
        if (!requiredSpan) {
          this._createRequiredIconSpanDom();

          if (this._isCustomElement) {
            this._addRequiredDescribedByOnCustomFormElement(this._targetElement);
          }
        } else {
          // required is there, so we need to refresh the translated value in case it changed.
          requiredTooltip = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_REQUIRED);
          $requiredDom = this.uiLabel.find('.oj-label-required-icon');
          $requiredDom.attr('title', requiredTooltip);
        }
      } else {
        // not required, so remove it
        requiredSpan = document.getElementById(requiredSpanId);

        if (requiredSpan !== null) {
          requiredSpan.parentNode.removeChild(requiredSpan);
        }

        if (this._isCustomElement) {
          this._removeRequiredDescribedByOnCustomFormElement(this._targetElement);
        }
      }
    },

    /**
     * This gets called during component initialization and when the 'for' option changes.
     * And this should find the targetElement, set labelledBy on it and describedBy.
     * @private
     * @memberof oj.ojLabel
     */
    _refreshFor: function _refreshFor(oldValue, newValue) {
      var labelElement = this.element[0];
      var ojLabelId = this.OuterWrapper.id;

      if (oldValue) {
        // If someone removes 'for', the labelled-by is removed and the
        // internal 'for' is removed and data-oj-input-id is removed.
        labelElement.removeAttribute('for');
        this.OuterWrapper.removeAttribute('data-oj-input-id');
        var oldTarget = document.getElementById(oldValue);

        if (oldTarget) {
          var labelledBy = oldTarget.getAttribute(_LABELLED_BY);

          if (labelledBy) {
            if (labelledBy === ojLabelId) {
              oldTarget.removeAttribute(_LABELLED_BY);
            } else {
              // remove the ojLabelId from the labelledBy
              var splitArray = labelledBy.split(/\s+/); // remove ojLabelId from the splitArray and rejoin

              var newArray = splitArray.filter(function (item) {
                return item !== ojLabelId;
              });
              var newLabelledBy = newArray.join(' ');
              oldTarget.setAttribute(_LABELLED_BY, newLabelledBy);
            }
          }
        }
      }

      this._targetElement = document.getElementById(this.options.for);

      if (this._targetElement) {
        var targetElement = this._targetElement;

        if (this._isElementCustomElement(targetElement)) {
          this._addElementAttribute(targetElement, ojLabelId, _LABELLED_BY);

          if (this._needsHelpIcon()) {
            this._addHelpSpanIdOnTarget(this.helpSpanId, targetElement);
          }

          if (this.options.showRequired) {
            this._addRequiredDescribedByOnCustomFormElement(targetElement);
          }
        } else {
          labelElement.setAttribute('for', newValue);
        }
      }
    },

    /**
     * refresh label-id which is only for oj-label custom element.
     * Set the label element's id to label-id. If label-id is not set,
     * then use the <oj-label>'s id attribute to set a sub-id on the label element.
     * @private
     * @memberof oj.ojLabel
     */
    _refreshLabelId: function _refreshLabelId() {
      var labelIdOption;
      var customElementId;
      labelIdOption = this.options.labelId;

      if (labelIdOption) {
        this.element.attr('id', labelIdOption);
      } else {
        // for custom elements, this.uiLabel is <oj-label>.
        customElementId = this.uiLabel.attr('id');

        if (customElementId) {
          // create sub-id on the label element
          this.element.attr('id', customElementId + '|label');
        }
      }
    },

    /**
     * Note that _setOption does not get called during create. it only gets called
     * when the component has already been created.
     * @override
     * @protected
     * @memberof oj.ojLabel
     * @instance
     */
    // eslint-disable-next-line no-unused-vars
    _setOption: function _setOption(key, value) {
      var oldValue = this.options[key];

      this._superApply(arguments);

      switch (key) {
        case 'showRequired':
          this._refreshRequired();

          break;

        case 'help':
          this._refreshHelp();

          break;

        case 'for':
          // todo: what happens if 'for' changes? I can see that being very unlikely.
          // but what it can do is use its id to search for labelledBy target, and
          // remove the labelledBy target, then add 'for' and start again.
          // it can look at this.options.for for 'old value' and value for new value
          if (this._isCustomElement) {
            // refreshes for, which is only for oj-label custom element, not ojLabel.
            // targetElement is the element with id === oj-label's for option
            this._refreshFor(oldValue, value);
          }

          break;

        case 'labelId':
          // refreshes label-id, which is only for oj-label custom element, not ojLabel.
          this._refreshLabelId();

          break;

        default:
          break;
      }
    },
    // @inheritdoc
    getNodeBySubId: function getNodeBySubId(locator) {
      var node;
      var subId;
      node = this._super(locator);

      if (!node) {
        subId = locator.subId;

        if (subId === 'oj-label-help-icon') {
          node = this.widget().find('.oj-label-help-icon')[0];
        }
      } // Non-null locators have to be handled by the component subclasses


      return node || null;
    },
    // @inheritdoc
    getSubIdByNode: function getSubIdByNode(node) {
      var subId = null;

      if (node != null) {
        if (node === this.widget().find('.oj-label-help-icon')[0]) {
          subId = {
            subId: 'oj-label-help-icon'
          };
        }
      }

      return subId || this._superApply(arguments);
    },

    /**
     *
     * @override
     * @protected
     * @memberof oj.ojLabel
     * @instance
     */
    _destroy: function _destroy() {
      // remove things we added in _attachHelpDefToIconAnchor
      var helpIcon = this.uiLabel.find('.oj-label-help-icon');

      this._removeHelpDefIconEventListeners(helpIcon);

      this._removeHelpDefPopup();

      this.helpSpanId = null;
      this.requiredSpanId = null;
      this._isCustomElement = null; // DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout

      oj.DomUtils.unwrap(this.element, this.uiLabel);
      return this._super();
    }
    /** ** end internal widget functions ****/

    /**
     * Removes the label functionality completely.
     * This will return the element back to its pre-init state.
     *
     * <p>This method does not accept any arguments.
     *
     * @method
     * @name oj.ojLabel#destroy
     * @memberof oj.ojLabel
     * @instance
     * @ignore
     *
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * $( ".selector" ).ojLabel( "destroy" );
     */

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
     *       <td rowspan=2>Help Icon</td>
     *       <td><kbd>Tap and Hold</kbd></td>
     *       <td>Show the help definition in a popup</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tap</kbd></td>
     *       <td>If no help source, show the help definition in a popup.
     *       If help source, navigate to the url.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojLabel
     * @instance
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
     *       <td rowspan=2>Help Icon</td>
     *       <td><kbd>Enter</kbd></td>
     *       <td>If there is an url associated with help icon, navigate to the url.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Show the help definition in a popup.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojLabel
     * @instance
     */

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
     *       <td>oj-focus-highlight</td>
     *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}</td>
     *     </tr>
     *     <tr>
     *       <td style="text-decoration:line-through">oj-label-accesskey</td>
     *       <td><span style="color:red">Deprecated</span> JET's
     *       accessibility team discourages access keys, so
     *       this styleclass has been deprecated.</td>
     *     </tr>
     *     <tr>
     *       <td>oj-label-nowrap</td>
     *       <td>place on the oj-label element to have it not wrap
     *       when you don't want to use the responsive design classes
     *       (e.g., oj-md-labels-nowrap or oj-md-label-nowrap).</td>
     *     </tr>
     *     <tr>
     *       <td>oj-label-inline</td>
     *       <td>place on the oj-label element to inline the label with the sibling dom element
     *       when you don't want to use the responsive design classes (e.g., oj-md-labels-inline).</td>
     *     </tr>
     *     <tr>
     *       <td>oj-label-inline-top</td>
     *       <td>place on the oj-label element together with oj-label-inline
     *       to inline the label with the
     *       sibling dom element and have zero margin-top.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
     * @memberof oj.ojLabel
     * @instance
     */

  }); // ////////////////     SUB-IDS     //////////////////

  /**
   * <p>Sub-ID for the label's help icon.</p>
   *
   * @ojsubid oj-label-help-icon
   * @memberof oj.ojLabel
   *
   * @example <caption>Get the node for the help icon:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-label-help-icon'});
   */

})();



/* global __oj_label_metadata:false */
(function () {
  __oj_label_metadata.extension._WIDGET_NAME = 'ojLabel';
  __oj_label_metadata.extension._INNER_ELEM = 'label';
  __oj_label_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['accesskey'];
  __oj_label_metadata.extension._WATCHED_ATTRS = ['data-oj-input-id', 'data-oj-set-id'];
  oj.CustomElementBridge.register('oj-label', {
    metadata: __oj_label_metadata
  });
})();

});