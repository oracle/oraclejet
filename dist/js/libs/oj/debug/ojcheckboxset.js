/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue', 'ojs/ojradiocheckbox'], 
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
(function() {

/*!
 * JET Checkboxset @VERSION
 */
/**
 * @ojcomponent oj.ojCheckboxset
 * @augments oj.editableValue
 * @since 0.6
 * @classdesc
 * <p>
 * The JET Checkboxset component (ojCheckboxset) enhances a group of
 * <code class="prettyprint">input type="checkbox"</code> elements and
 * manages the selected values of the group. It also adds and removes the correct
 * oj-* styles to the dom elements so it has the JET styling and is themable.
 * </p>
 * <p>To use an ojCheckboxset, group one or more checkbox inputs and their labels
 *  within a container dom element, e.g., <code class="prettyprint">div</code>.
 *   For accessibility, set <code class="prettyprint">aria-labelledby</code> on this container dom element.
 *   Also set each input's <code class="prettyprint">id</code> attribute, and refer to that in the
 *   input's label's <code class="prettyprint">for</code> attribute.
 *   Then create the ojCheckboxset on this container dom element.
 * </p>
 * <p>
 *  The <code class="prettyprint">fieldset</code>/<code class="prettyprint">legend</code> elements
 *  are not a supported way
 *  to group and label ojCheckboxset, so <code class="prettyprint">fieldset</code> cannot be the
 *  container dom element on which you create the ojCheckboxset.
 *  Grouping with a <code class="prettyprint">div</code> element and using
 *  a <code class="prettyprint">label</code> element allows you to
 *  lay out your labels/fields in more ways than if you used a fieldset/legend.
 *  Both are equally accessible.
 * </p>
 * <p>
 *  Checkboxset is used by selecting a container element which contains the
 *  checkbox input elements and calling <code class="prettyprint">ojCheckboxset()</code>.
 *  You can enable and disable a checkbox set,
 *  which will enable and disable all contained checkboxes.
 * </p>
 * <p>
 *  Checkboxset does not have a readOnly option since HTML does not support
 *  readonly on radios and checkboxes.
 * </p>
 * <p>
 * The component will decorate its associated label with required and help information, if
 * the applicable API is set. See the <code class="prettyprint">required</code> and
 * <code class="prettyprint">help</code>
 * options. Use <code class="prettyprint">aria-labelledby</code> to associate the main label with
 * the checkboxset component. Doing this also makes the checkboxset accessible.
 * </p>
 * <p>
 * In native themes, the label element is required. The native input is hidden and the 
 * label element is used to render the checkbox image.
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
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>JET Checkboxset takes care of setting <code class="prettyprint">role="group"</code>
 * on the checkboxset element.
 *
 * <p>As shown in the online demos, the application is responsible for applying
 * <code class="prettyprint">aria-labelledby</code>
 * to point to the main label element for the group of checkboxes.
 * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
 * required of enabled content, it cannot be used to convey meaningful information.<p>
 * <h3 id="label-section">
 *   Label and Checkboxset
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the checkboxset
 * by putting an <code class="prettyprint">id</code> on the label, and then setting the
 * <code class="prettyprint">aria-labelledby</code> attribute on the checkboxset dom to be the
 * label's id.
 * Note: The checkboxset's label is not the same as the label for each checkbox.
 * The checkboxset's label will have the required and help information on it,
 * not the label for each checkbox.
 * </p>
 * <p>
 * In native themes, the label element is required. The native input is hidden and the 
 * label element is used to render the checkbox image.
 * </p>
 * <p>
 * The component will decorate its associated label with required and help
 * information, if the <code class="prettyprint">required</code> and
 * <code class="prettyprint">help</code> options are set.
 * </p>
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class(es)</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-choice-row</td>
 *       <td><p>Used to line up the input and the label with each other on the same line, and
 *              following input and label on the next line.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the span surrounding the input and label to keep them aligned.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-choice-row-inline</td>
 *       <td><p>Used to line up the input and the label with each other on the same line, and
 *              following input and label on the same line as well.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the span surrounding the input and label to keep them aligned.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-checkboxset-no-chrome</td>
 *       <td><p>Use this styleclass if you don't want the chrome around the set.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the div where you bind ojCheckboxset.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-checkboxset-input-start</td>
 *       <td><p>Use this styleclass to order the checkbox at the start and label text at the end 
 *       even if a theme has a different default order.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the div where you bind ojCheckboxset.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-checkboxset-input-end</td>
 *       <td><p>Use this styleclass to order the checkbox at the end and the label text at the start 
 *       even if a theme has a different default order.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the div where you bind ojCheckboxset.</li>
 *           </ul>
 *       </td>
 *     </tr>
*      <tr>
 *       <td>oj-focus-highlight</td>
 *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}
*           <ul>
 *             <li>The class must be applied to the div where you apply oj-choice-row or oj-choice-row-inline.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * <h3 id="eventHandling-section">
 *   Event Handling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#eventHandling-section"></a>
 * </h3>
 * <ul>
 *  <li>optionChange(event, ui) - Type: ojoptionchange
 *  <p>
 *   Triggered if the value changes when the user interacts with the component
 *   (clicking on one of the checkboxe buttons); or if the value has
 *   changed programmatically via the value option.
 *  </li>
 * </ul>
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 *
 * <p>
 *   All JQUI and JET components inherit <code class="prettyprint">disable()</code> and <code class="prettyprint">enable()</code> methods from the base class.  This API
 *       duplicates the functionality of the <code class="prettyprint">disabled</code> option.  In JET, to keep the API as lean as possible, we
 *       have chosen not to document these methods outside of this section.
 * </p>
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 *
 * @desc Creates or re-initializes a JET Checkboxset.  For JET components, re-initing
 * is generally like a hard refresh, meaning it typically does everything
 * <code class="prettyprint">refresh()</code> does, plus potentially a bit more.
 *  For JET Checkboxset, if the DOM changes (for example, you add/remove a checkbox, or change the disabled
 *  attribute on a checkbox), you should refresh.
 *
 * <p>Don't confuse the re-initializer with the <code class="prettyprint">option()</code> method,
 * which (in one overload) also accepts a map of option-value pairs
 * to set on the component, but does not re-init.
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the checkboxset with no options specified:</caption>
 * $(".selector").ojCheckboxset();
 *
 * @example <caption>Initialize the checkboxset with some options and callbacks specified:</caption>
 * $( ".selector" ).ojCheckboxset( { "value": ["copy"], "valuechange":
 * function( event, ui ) {alert("valuechanged from " + ui.previousValue + " to " + ui.value);} } );
 * @example <caption>Initialize component using widget API</caption>
 * &lt;label id="grouplabel">Greetings&lt;/label>
 * &lt;div id="checkboxset" aria-labelledby="grouplabel">
 *   &lt;input id="helloid" value="hello" type="checkbox" name="greetings"/&gt;
 *   &lt;label for="helloid"/&gt;Hello&lt;/label>
 *   &lt;input id="bonjourid" value="bonjour" type="checkbox" name="greetings"/&gt;
 *   &lt;label for="bonjourid"/&gt;Bonjour&lt;/label>
 *   &lt;input id="ciaoid" value="ciao" type="checkbox" name="greetings"/&gt;
 *   &lt;label for="ciaoid"/&gt;Ciao&lt;/label>
 * &lt;div>
 * <br/>
 * // set the value to "ciao". (The 'ciao' checkbox will be checked)
 * $("#checkboxset").ojCheckboxset({'option', 'value', ['ciao']});
 *
 * @example <caption>Initialize a checkboxset via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;label id="grouplabel">Time&lt;/label>
 * &lt;div id="checkboxset" data-bind="ojComponent: {component: 'ojCheckboxset', value: ['night']}
 *   aria-labelledby="grouplabel" >
 *   &lt;input id="morningid" value="morning" type="checkbox" name="time"/&gt;
 *   &lt;label for="morningid"/&gt;Morning&lt;/label>
 *   &lt;input id="nightid" value="night" type="checkbox" name="time"/&gt;
 *   &lt;label for="nightid"/&gt;Night&lt;/label>
 * &lt;div>
 * <br/>
  * @example <caption>Using knockout, value bind to observable:</caption>
 * &lt;label id="grouplabel">Time&lt;/label>
 * &lt;div id="checkboxset" data-bind="ojComponent: {component: 'ojCheckboxset', value: currentTime}
 *   aria-labelledby="grouplabel" >
 *   &lt;input id="morningid" value="morning" type="checkbox" name="time"/&gt;
 *   &lt;label for="morningid"/&gt;Morning&lt;/label>
 *   &lt;input id="nightid" value="night" type="checkbox" name="time"/&gt;
 *   &lt;label for="nightid"/&gt;Night&lt;/label>
 * &lt;div>
 * <br/>
 * // in the model, make the currentTime variable a knockout observable.
 * // The model and the component's value option will stay in sync. Change the
 * // component's value option and the model will change. Change the model,
 * // and the component's value option will change. Click on a checkbox, and both
 * // will change.
 * self.currentTime = ko.observable(["night"]);
 */
oj.__registerWidget("oj.ojCheckboxset", $['oj']['editableValue'],
{
  version : "1.0.0",
  defaultElement : "<div>",
  widgetEventPrefix : "oj",
  options :
  {
     /**
     * <p>
     * Disabled <code class="prettyprint">true</code> disables the component and disables
     * all the inputs/labels.
     * Disabled <code class="prettyprint">false</code> enables the component, and leaves the inputs
     * disabled state as it is in the dom.
     * <p>
     * After create time, the disabled state should be set via this API,
     * not by setting the underlying DOM attribute.
     *
     * <p>The 2-way <code class="prettyprint">disabled</code> binding offered by
     * the <code class="prettyprint">ojComponent</code> binding
     * should be used instead of Knockout's built-in <code class="prettyprint">disable</code>
     * and <code class="prettyprint">enable</code> bindings,
     * as the former sets the API, while the latter sets the underlying DOM attribute.
     *
     * @example <caption>Initialize component with <code class="prettyprint">disabled</code> option:</caption>
     * $(".selector").ojCheckboxset({"disabled": true});
     *
     * @expose
     * @type {?boolean}
     * @default <code class="prettyprint">false</code>
     * @public
     * @instance
     * @memberof oj.ojCheckboxset
     */
    disabled: false,
    /**
     * The value of the component.
     *
     * <p>
     * When <code class="prettyprint">value</code> option changes due to programmatic
     * intervention, the component always clears all messages and runs deferred validation, and
     * always refreshes UI display value.</br>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>All messages are cleared. This includes
     * <code class="prettyprint">messagesHidden</code>, <code class="prettyprint">messagesShown</code>
     *  and <code class="prettyprint">messagesCustom</code> options.</li>
     * </ul>
     *
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; if there is a validation error the
     * <code class="prettyprint">messagesHidden</code> option is updated.</li>
     * </ul>
     * </p>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option specified:</caption>
     * $(".selector").ojCheckboxset({'value': ['coffee']});<br/>
     * @example <caption>Get or set <code class="prettyprint">value</code> option, after initialization:</caption>
     * // Getter: returns ['coffee']
     * $(".selector").ojCheckboxset("option", "value");
     * // Setter: sets ['coffee', 'tea']
     * $(".selector").ojCheckboxset("option", "value", ['coffee', 'tea']);
     *
     * @expose
     * @access public
     * @instance
     * @default <code class="prettyprint">[]</code>
     * When the option is not set, value is set to an array built from the checked checkboxes, if
     * any are checked.
     * @memberof oj.ojCheckboxset
     * @type {Array|undefined|null}
     */
    value: undefined
  },
  /**** start Public APIs ****/

   /**
   * Refreshes the checkboxset
   * <p>A <code class="prettyprint">refresh()</code> or re-init is required
   * when a checkboxset is programatically changed, like in the following circumstances:
   * <ul>
   *   <li>After checkboxes are added or removed or modified (without using ojCheckboxset) in the DOM.</li>
   *   <li>After a checkbox's disabled dom attribute is changed. Since there is no api to change an
   *   individual checkbox's disabled state, the only way to do this is to change the checkbox's
   *   disabled attribute in dom and then to call refresh on the ojCheckboxset.</li>
   * </ul>
   * @expose
   * @memberof oj.ojCheckboxset
   * @instance
   * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
   * $( ".selector" ).ojCheckboxset( "refresh" );
   */
  refresh: function()
  {
    this._super();
    this._setup();
  },
  /**
   * Returns a jQuery object containing the element visually representing the checkboxset.
   *
   * <p>This method does not accept any arguments.
   *
   * @expose
   * @memberof oj.ojCheckboxset
   * @instance
   * @return {jQuery} the checkbox
  */
  widget : function ()
  {
    return this.uiCheckboxset;
  },

   /**** end Public APIs ****/

  /**** start internal widget functions ****/

  /**
   * Overridden to set the options.value. When constructorOptions value is undefined,
   * we read the CHECKED options on the checkboxes and build the value array from that.
   *
   * @memberof oj.ojCheckboxset
   * @instance
   * @protected
   */
  _InitOptions : function (originalDefaults, constructorOptions)
  {
    var checkedValues = new Array(), selectedCheckbox, domValue,
        props = [{attribute: "disabled", validateOption: true},
                 {attribute: "title"},
                 {attribute: "placeholder"},
                 //{attribute: "value", "defaultValue": null},  // code below sets value
                 {attribute: "required", coerceDomValue: true, validateOption: true
                 }];

    this._super(originalDefaults, constructorOptions);
    oj.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this);
    this.$checkboxes = this._findCheckboxesWithMatchingName();

    // component, app, and constructor are merged into this.options.option by the time _InitOptions
    // is called. Let's take this example:
    // component (widget) default - 'foo'<br/>
    // app default - 'bar'<br/>
    // dom  - 'lucy'<br/>
    // constructorOptions['value'] - undefined<br/>
    // this.options.option is set to 'bar' initially. We don't want to just take this value, because
    // we want DOM value to win over the app and components default if DOM is set.
    // Therefore, the component needs to check if the constructorOptions['value'] is
    // undefined and if so, set value option to 'lucy' (the DOM value in this example). <br/>
    //
    // use DOM value if constructorOptions is undefined. if DOM value is undefined, then
    // leave this.options["value"] alone since it's the merged app/widget default at this point.
    if (constructorOptions['value'] === undefined)
    {
      // constructor option for value is undefined. Then we check the dom.
      selectedCheckbox = this.$checkboxes.filter(":checked");
      if (selectedCheckbox.length > 0)
      {
        selectedCheckbox.each(function(){
          checkedValues.push($(this).val());
        });
        domValue = checkedValues;

        // when defaulting from DOM we want to trigger optionChange to writeback new value

        this.option("value", domValue, {'_context':{writeback: true, internalSet: true}});
      }
      // if nothing is checked, we leave this.options["value"] as it is if not undefined, else
      // the widget's default is [].
      if (this.options["value"] === undefined)
        this.options["value"] = [];

    }
  },
  /**
   * After _ComponentCreate and _AfterCreate,
   * the widget should be 100% set up. this._super should be called first.
   * @override
   * @protected
   * @memberof oj.ojCheckboxset
   * @instance
   */
  _ComponentCreate : function ()
  {
    this._super();
    // first check to see if this.element is NOT a fieldset. If fieldset, throw error.
    if (this.element.is("fieldset"))
    {
      throw new Error("ojCheckboxset cannot be bound to a fieldset. Use a div instead.");
    }
    // Turn each checkbox into ojCheckbox. Do this first, since we need it
    // in calls from 'create'. Also, since ojCheckboxSet delegates to the _ojRadioCheckbox
    // component, and we need to mark this as an internal node so that oj.Components.getComponentElementByNode
    // knows it is an internal component in this case, not a stand-alone component
    this.$checkboxes._ojRadioCheckbox().attr('data-oj-internal', true);
 
    // keep the root dom element as is, and add a wrapper dom underneath it. This way we can
    // have one div around all the inputs and labels, and for inline messaging we can have another
    // div around the inline messaging content. And we can style the borders of the two boxes differently.
    this.uiCheckboxset = this.element.addClass("oj-checkboxset oj-component").attr( "role", "group" )
      .wrapInner("<div class='oj-checkboxset-wrapper'></div>"); //@HTMLUpdateOk

    this._on(this._events);
    this._setup();
  },
    /**
   * Resets this.checkboxes. This is called at the beginning of a refresh in EditableValue
   * @override
   * @memberof oj.ojCheckboxset
   * @instance
   * @protected
   */
  _ResetComponentState : function ()
  {
    // we could have added, removed, or modified radios, so we need to re-find all the
    // inputs on refresh and turn the ones that aren't already ojRadioCheckboxes into them.
    this.$checkboxes = this._findCheckboxesWithMatchingName();

     // we have a rule for refresh: if we have a public API for it, then the app dev has to use the
    // option, and not expect changing the dom will update the state with refresh.
    // However, ojCheckboxset does not expose a public API for the individual checkbox's disabled state
    // to the app developer. Our private ojRadioCheckbox component has a disabled option that
    // our code has access to.
    // For each checkbox, we need to look at the disabled attribute dom and update the
    // ojradiocheckbox's disabled option.

    // !! ensures it is a boolean
    // update the private ojradiocheckbox component's disabled option to keep it in sync with the dom
    this.$checkboxes.filter( ".oj-checkbox" ).each(function()
    {
        var disabledValue = $( this ).attr("disabled") !== undefined ?
          !!$( this ).prop("disabled") : false;
        $( this )._ojRadioCheckbox("option", "disabled", disabledValue);
    });

    // no need to refresh the ojRadioCheckbox's that exist since we have options for everything.
    // of the type=radio inputs that are not yet ojRadioCheckboxs, make them ojRadioCheckboxes.

    // create ojRadioCheckboxes on any new ones.
    this.$checkboxes.not(".oj-checkbox")._ojRadioCheckbox();
    
  },

  /**
   * Sets focus on the element that naturally gets focus. For radioset, this is the first checkbox <br/>
   *
   * @returns {*} a truthy value if focus was set to the intended element, a falsey value
   * otherwise.
   * @override
   * @memberof oj.ojCheckboxset
   * @instance
   * @protected
   * @since 0.7
   */
  Focus : function ()
  {
    this._GetContentElement().first().focus();
    return true;
  },
  /**
   * Sets the disabled option onto the dom.
   * This is a no-op for checkboxset since its root dom element is a div, and disabled is
   * invalid on a div. If we did try to set disabled on the div, then restore attributes doesn't
   * work correctly since it wasn't saved correctly.
   * @param {Object} node - dom node
   *
   * @memberof oj.ojCheckboxset
   * @instance
   * @protected
   * @since 1.0.0
   */
  _SetDisabledDom : function(node)
  {
    // no-op
  },
  /**
   * Returns a jquery object that is a set of elements that are input type checkbox
   * and have the name of the first checkbox found.
   *
   * @return {Object} jquery object of all the checkboxes within the root dom element
   * that have the same 'name' attribute as the first checkbox found.
   * @private
   */
  _findCheckboxesWithMatchingName : function ()

  {
    //return this.element.find('input[type=checkbox]'); // simplest thing to do.

    var first = this.element.find("input[type=checkbox]:first"),
      name, allcheckboxes, selector;
    if (first.length === 0)
    {
      oj.Logger.warn("Could not find any input type=checkbox within this element");
    }
    // get the name attribute of the first input checkbox
    name = first.attr("name");
    // find all input checkboxes with matching name
    if (name === undefined)
    {
      // search for all checkboxes with no name
      allcheckboxes = this.element.find("input[type=checkbox]");
      // now loop and find the ones without 'name' attribute
      return allcheckboxes.not("[name]");
    }
    else
    {
      // search for all checkboxes with the name
      selector = "input[type=checkbox][name=" + name + "]";
      return this.element.find(selector);

    }
  },

  // Override to set custom launcher
  _NotifyContextMenuGesture: function(menu, event, eventType)
  {
    // Setting the launcher to the first tabbable checkbox in the set.
    // Component owner should feel free to specify a different launcher if appropriate,
    // e.g. could specify the "current" checkbox rather than the first if desired.
    // See the superclass JSDoc for _OpenContextMenu for tips on choosing a launcher.
    var launcher = this.element.find("input[type=checkbox]:tabbable").first();
    this._OpenContextMenu(event, eventType, {"launcher": launcher});
  },
  // Override to set launcher to widget
  _GetMessagingLauncherElement : function ()
  {
    // focus events only get triggered on input, but they do bubble up and we will capture them
    // on the widget.
    // mouseenter events get called once once if the user hovers over for the entire widget. if
    // we put it on the inputs, it gets called every time you leave and enter a new input. Plus,
    // this doesn't work when we hide the input like we do in the native themes.
     return this.widget();                          
  },
  /**
   * _setup is called on create and refresh. Use the disabled option to
   * update the component. If the component's option is disabled, then
   * leave it alone.
   * @memberof oj.ojCheckboxset
   * @instance
   * @private
   */
  _setup: function()
  {
     // at this point we already have this.$checkboxes set to a list of checkboxes for this
     // checkboxset
    this._propagateDisabled(this.options.disabled );
    // TODO: if one checkbox, set oj-checkboxset-single. if more than one, remove it.
    if (this.$checkboxes !== null)
    {
      if (this.$checkboxes.length === 1)
      {
        this.element.addClass("oj-checkboxset-single");
      }
      else
      {
        this.element.removeClass("oj-checkboxset-single");
      }
    }
  },
  _events :
  {
    'change' : function (event)
    {

      this._HandleChangeEvent(event);
    }
  },

  /**
   * @param {Event} event DOM event
   * @override
   * @protected
   * @memberof oj.ojCheckboxset
   */
  _HandleChangeEvent: function(event)
  {
    var submittedValue, checkboxes;
    
    // keep oj-selected in sync with the input element's checked state
    checkboxes = this.$checkboxes;
    if (checkboxes.length > 0)
    {
      checkboxes.each(function(){
        if (this === event.target) {
          // the target is one of the checkboxes. Update the oj-selected class to keep it 
          // in sync with the input's HTML checked attribute
          $(this)._ojRadioCheckbox("setSelectedClass", event.target.checked);
        }
      });
    }
    // run full validation. There is no need to check if values have changed
    // since for checkboxset/radioset if we get into this function we know value has changed.
    // passing in doValueChangeCheck: false will skip the new-old value comparison
    submittedValue = this._GetDisplayValue();
    this._SetValue(submittedValue, event, _sValueChangeCheckFalse);
  },

  /**
   * Returns the display value that is ready to be passed to the converter.
   *
   * @param {Object} value the stored value if available that needs to be formatted for display
   * @override
   * @protected
   * @memberof oj.ojCheckboxset
   */
  _GetDisplayValue : function (value)
  {
    // return the value of the 'checked' checkboxes
    return this._GetElementValue();
  },
  /**
   * Called when the display value on the element needs to be updated
   * as a result of a value change.
   * ojCheckboxset stores an Array value, and this value matches the values
   * of the currently checked checkboxes. So, if we need to set the display value,
   * what this means is we need to 'check' the checkboxes whose values match the
   * displayValue and 'uncheck' those that don't.
   *
   * @param {Array} checkedBoxes an Array of values that need to be checked, e.g., ["red","blue"]
   * @override
   * @protected
   * @memberof oj.ojCheckboxset
  */
 _SetDisplayValue : function (checkedBoxes)
  {
    var length = this.$checkboxes.length;
    var checkboxInputValue, i, $checkbox;

    // go through each _ojRadioCheckbox and see if it needs to be checked or unchecked.
    for (i = 0; i < length; i++)
    {
      $checkbox = $(this.$checkboxes[i]);
      checkboxInputValue = $checkbox[0].value;
      // does the checkbox's value exist in the checkedBoxes array?
      var index = checkedBoxes.indexOf(checkboxInputValue);
      var checked = $checkbox._ojRadioCheckbox("option", "checked"); 
      if (index !== -1)
      {
        // yes. this needs to be checked, if it isn't already
        if (!checked)
        {
          $checkbox._ojRadioCheckbox("option", "checked", true);
        }
      }
      else
      {
        /// no. this needs to be unchecked, if it isn't already
        if (checked)
        {
          $checkbox._ojRadioCheckbox("option", "checked", false);
        }
      }
    } 
  },
  /**
   * Returns the element's value. Normally, this is a call to this.element.val(),
   * but in the case of ojCheckboxset, the element's value is really the value
   * of the checked checkboxes in the set.
   * @override
   * @protected
   * @memberof oj.ojCheckboxset
   */
  _GetElementValue : function ()
  {
    // "input:checked" selects checkboxes that are currently checked as
    // reflected in their boolean (true or false) checked property,
    // which is affected when the user clicks the checkbox for example.
    // for checkbox, there will be one or none checked;
    // if none are checked, return null (selectedCheckbox.val() is undefined if nothing is checked)
    var checkedValues=new Array();
    var selectedCheckbox = this.$checkboxes.filter(":checked");
    if (selectedCheckbox.length === 0)
      return [];
    else
    {
      selectedCheckbox.each(function(){checkedValues.push($(this).val());});
      return checkedValues;
    }
  },


  /**
   * Returns the default styleclass for the component. Currently this is
   * used to pass to the _ojLabel component, which will append -label and
   * add the style class onto the label. This way we can style the label
   * specific to the input component. For example, for inline labels, the
   * checkboxset/checkboxset components need to have margin-top:0, whereas all the
   * other inputs need it to be .5em. So we'll have a special margin-top style
   * for .oj-label-inline.oj-checkboxset-label
   * All input components must override
   *
   * @return {string}
   * @memberof oj.ojCheckboxset
   * @override
   * @protected
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-checkboxset";
  },
  /**
   * Returns a jquery object of the elements representing the content nodes (checkboxes/labels).
   * @protected
   * @override
   * @memberof oj.ojCheckboxset
   */
  _GetContentElement : function ()
  {
    if (this.$checkboxes != null)
      return this.$checkboxes;
    else this._findCheckboxesWithMatchingName();
  },
  /**
   * Called when a aria-required attribute needs to be set or removed.
   * Most inputs/selects need aria-required on the input element (aka 'content')
   * But it is not legal to have aria-required on radio/checkboxes, nor on
   * radiogroup/group.
   * Subclasses can override to put aria-required where they want or not put it at all.
   *
   * @param {Object=} value the current value of the required option
   * @memberof oj.ojCheckboxset
   * @instance
   * @protected
   */
  _RefreshAriaRequired : function (value)
  {
    // Radiogroup/group does not support aria-required so we can't use it there.
  },
  /**
   * Called to find out if aria-required is unsupported. This is needed for the label.
   * It is not legal to have aria-required on radio/checkboxes, nor on
   * radiogroup/group.
   * If aria-required is not supported, then we wrap the required icon as well as the
   * help icons so that JAWS can read required. We don't do this for form controls that use
   * aria-required because if we did JAWS would read required twice.
   * @memberof oj.ojCheckboxset
   * @instance
   * @protected
   * @return {boolean}
   */
  _AriaRequiredUnsupported : function()
  {
    return true;
  },
  _propagateDisabled: function( disabled ) {
      disabled = !!disabled;
      this.$checkboxes.each(function()
      {
        // this is the technique to use to call package-private functions
        // Calling it like this.$radios.ojRadioCheckbox("__setAncestorComponentDisabled",value)
        // gives an error because jquery prevents you from calling functions with an "_"
        //
        // This is how we handle 'disabled' for the checkboxset. We don't change the radiocheckbox
        // component's disabled option ever since if we do that we've lost what the initial disabled
        // state is (we store the disabled dom value from the radio into its disabled option)
        // and we need that when we refresh. Instead what we do
        // is we mark if its ancestor (the checkboxset) is disabled or not. Then, when we render
        // out the checkboxes 'disabled' state, like oj-disabled, we look to see if it is 'effectively
        // disabled' (see _IsEffectivelyDisabled call in ojRadioCheckbox), that is if its
        // option is disabled OR its ancestor (the checkboxset) is disabled.
        $( this ).data("oj-_ojRadioCheckbox").__setAncestorComponentDisabled(disabled);
      });

      this.$checkboxes._ojRadioCheckbox("refreshDisabled"); // re-render disabled
  },
  /**
   * @override
   * @private
   */
  _setOption : function (key, value, flags)
  {
    this._super(key, value, flags);

    if ( key === "disabled" )
    {
      this._propagateDisabled(value);
    }
  },

  //** @inheritdoc */  
  getNodeBySubId: function(locator)
  {
    var node = this._super(locator), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-checkboxset-inputs") {
        return this.$checkboxes.get();
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _destroy : function ()
  {
    var ret = this._super();
    var wrapperDom = this.element[0].firstChild;
    
    if (this.$checkboxes)
    {
      this.$checkboxes._ojRadioCheckbox( "destroy" );
    }
    
    // remove the dom we added to wrap the children of this.element, but don't remove the children.
    $(wrapperDom).contents().unwrap();
    
    return ret;
  }
  /**** end internal widget functions ****/
   /**
   * Removes the checkboxset functionality completely.
   * This will return the element back to its pre-init state.
   *
   * <p>This method does not accept any arguments.
   *
   * @method
   * @name oj.ojCheckboxset#destroy
   * @memberof oj.ojCheckboxset
   * @instance
   *
   * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
   * $( ".selector" ).ojCheckboxset( "destroy" );
   */

   // Fragments:

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
   *    <tr>
   *       <td>Checkbox</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> Select/unselect the input</td>
   *     </tr>
   *     <tr>
   *       <td>Input's Label</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> Select/unselect the corresponding input</td>
   *    </tr>
   *     <tr>
   *       <td>Input or Label</td>
   *       <td><kbd>Press & Hold</kbd></td>
   *       <td>If hints, title or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *    </tr>
   *    {@ojinclude "name":"labelTouchDoc"}
   *   </tbody>
   *  </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojCheckboxset
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
   *       <td>Checkboxset</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the first item in the checkboxset. 
   *       If hints, title or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *     </tr> 
   *     {@ojinclude "name":"labelKeyboardDoc"}   
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojCheckboxset
   */
});


//////////////////     SUB-IDS     //////////////////


/**
 * <p>Sub-ID for the checkboxset's checkboxes.
 *
 * @ojsubid oj-checkboxset-inputs
 * @memberof oj.ojCheckboxset
 * @example <caption>Get the nodes for the checkboxes:</caption>
 * var nodes = $( ".selector" ).ojCheckboxset( "getNodeBySubId", {'subId': 'oj-checkboxset-inputs'} );
 * @deprecated The application creates and provides the DOM elements for the input
 * and label, so this subid is not necessary.
 */

// -----------------------------------------------------------------------------
// "private static members" shared by all checkboxsets
// -----------------------------------------------------------------------------
/**
 * do not do a value change check in _SetValue
 */
var _sValueChangeCheckFalse = {doValueChangeCheck: false};

}());
(function() {
var ojCheckboxsetMeta = {
  "properties": {
    "disabled": {
      "type": "boolean"
    },
    "value": {
      "type": "Array"
    }
  },
  "methods": {
    "destroy": {},
    "refresh": {},
    "widget": {}
  },
  "extension": {
    "_widgetName": "ojCheckboxset"
  }
};
oj.Components.registerMetadata('ojCheckboxset', 'editableValue', ojCheckboxsetMeta);
oj.Components.register('oj-checkboxset', oj.Components.getMetadata('ojCheckboxset'));
})();
});
