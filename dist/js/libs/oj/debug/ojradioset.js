/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue', 'ojs/ojradiocheckbox'],
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
(function() {

/*!
 * JET Radioset @VERSION
 */
/**
 * @ojcomponent oj.ojRadioset
 * @augments oj.editableValue
 * @since 0.6
 * @classdesc
 * <p>
 * The JET Radioset component (ojRadioset) enhances a group of 
 * <code class="prettyprint">input type="radio"</code> elements. It 
 * manages the selected value of the group and it adds required validation. 
 * It also adds and removes the correct
 * oj-* styles to the dom elements so it has the JET styling and is themable.
 * </p>
 * <p>To use an ojRadioset, group all the inputs and their labels within a 
 *   container dom element, e.g., <code class="prettyprint">div</code>.
 *   For accessibility, set <code class="prettyprint">aria-labelledby</code> on 
 *   this container dom element.
 *   Also set each input's <code class="prettyprint">id</code> attribute, and 
 *   refer to that in the input's label's 
 *   <code class="prettyprint">for</code> attribute.
 *   Then create the ojRadioset on this container dom element.  
 * </p>
 * <p>
 *  The <code class="prettyprint">fieldset</code>/<code class="prettyprint">legend</code> elements 
 *  are not a supported way 
 *   to group and label ojRadioset, so <code class="prettyprint">fieldset</code> cannot be the 
 *   container dom element on which you create the ojRadioset. 
 *   Grouping with a <code class="prettyprint">div</code> element and using 
 *   a <code class="prettyprint">label</code> element allows you to
 *   lay out your labels/fields in more ways than if you used a fieldset/legend. 
 *   Both are equally accessible. 
 * </p>
 * <p>
 *  Radioset is used by selecting a container element which contains the 
 *  radio input elements and calling <code class="prettyprint">ojRadioset()</code>. 
 *  You can enable and disable a radio set, 
 *  which will enable and disable all contained radios. 
 * </p>
 * <p>
 *  Radioset does not have a readOnly option since HTML does not support
 *  readonly on radios and checkboxes.
 * </p>
 * <p>
 * In native themes, the label element is required. The label element is used to render the
 * radio image.
 * </p> 
 * 
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
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
 * <p>JET Radioset takes care of setting 
 * <code class="prettyprint">role="radiogroup"</code> on the radioset element.  
 * 
 * <p>As shown in the online demos, the application is responsible for applying 
 * <code class="prettyprint">aria-labelledby</code>
 * to point to the radioset's <code class="prettyprint">label</code> element for the group of radios.
 * <p>Disabled content: JET supports an accessible luminosity contrast ratio, 
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>, 
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which 
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user 
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio 
 * required of enabled content, it cannot be used to convey meaningful information.<p>
 * 

 *  
 * <h3 id="label-section">
 *   Label and Radioset
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a <code class="prettyprint">label</code> element with the 
 * radioset by putting an <code class="prettyprint">id</code> on the label, and then setting the 
 * <code class="prettyprint">aria-labelledby</code> attribute on the radioset dom to be the label's 
 * <code class="prettyprint">id</code>.
 * Note: The radioset's label is not the same as the label for each radio. The 
 * radioset's label will have the required and help information on it, 
 * not the label for each radio.
 * </p>
 * <p>
 * The component will decorate its associated label with required and help 
 * information, if the <code class="prettyprint">required</code> and 
 * <code class="prettyprint">help</code> options are set. 
 * </p>
 * <p>
 * In native themes, the label element is required. The label element is used to render the
 * radio image.
 * </p> 
 * 
 *  * <h3 id="styling-section">
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
 *       <td>oj-radioset-no-chrome</td>
 *       <td><p>Use this styleclass if you don't want the chrome around the set.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the div where you bind ojRadioset.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-radioset-input-start</td>
 *       <td><p>Use this styleclass to order the radio at the start and label text at the end 
 *       even if a theme has a different default order.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the div where you bind ojRadioset.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-radioset-input-end</td>
 *       <td><p>Use this styleclass to order the radio at the end and the label text at the start 
 *       even if a theme has a different default order.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the div where you bind ojRadioset.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-focus-highlight</td>
 *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}
 *           <ul>
 *             <li>The class must be applied to the div where you apply oj-choice-row or oj-choice-row-inline.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 * 
 * <p>
 *   All JQUI and JET components inherit <code class="prettyprint">disable()</code> 
 *   and <code class="prettyprint">enable()</code> methods from the base class. 
 *    This API duplicates the functionality of the 
 *    <code class="prettyprint">disabled</code> option.  
 *    In JET, to keep the API as lean as possible, we have chosen not to document 
 *    these methods outside of this section.
 * </p>
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * 
 * @desc Creates a JET Radioset.
 *  For JET Radioset, if the DOM changes (for example, you add/remove a radio, or change the disabled 
 *  attribute on a radio), 
 *  you should <code class="prettyprint">refresh()</code>.
 * 
 * @param {Object=} options a map of option-value pairs to set on the component
 * 
 * @example <caption>Initialize the radioset with no options specified:</caption>
 * $(".selector").ojRadioset();
 * 
 * @example <caption>Initialize the radioset with some options and callbacks specified:</caption>
 * $( ".selector" ).ojRadioset( { "value": "copy", "valuechange": 
 * function( event, ui ) {alert("valuechanged from " + ui.previousValue + " to " + ui.value);} } );             
 * @example <caption>Initialize component using widget API</caption>
 * &lt;label id="grouplabel">Greetings&lt;/label>
 * &lt;div id="radioset" aria-labelledby="grouplabel">
 *   &lt;input id="helloid" value="hello" type="radio" name="greetings"/&gt;
 *   &lt;label for="helloid"/&gt;Hello&lt;/label>
 *   &lt;input id="bonjourid" value="bonjour" type="radio" name="greetings"/&gt;
 *   &lt;label for="bonjourid"/&gt;Bonjour&lt;/label>
 *   &lt;input id="ciaoid" value="ciao" type="radio" name="greetings"/&gt;
 *   &lt;label for="ciaoid"/&gt;Ciao&lt;/label>
 * &lt;div>
 * <br/>
 * // set the value to "ciao". (The 'ciao' radio will be checked)
 * $("#radioset").ojRadioset({'option', 'value', 'ciao'});
 * 
 * @example <caption>Initialize a radioset via the JET 
 * <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;label id="grouplabel">Time&lt;/label>
 * &lt;div id="radioset" data-bind="ojComponent: {component: 'ojRadioset', value: 'night'} 
 *   aria-labelledby="grouplabel" >
 *   &lt;input id="morningid" value="morning" type="radio" name="time"/&gt;
 *   &lt;label for="morningid"/&gt;Morning&lt;/label>
 *   &lt;input id="nightid" value="night" type="radio" name="time"/&gt;
 *   &lt;label for="nightid"/&gt;Night&lt;/label>
 * &lt;div>
 * <br/>
  * @example <caption>Using knockout, value bind to observable:</caption>
 * &lt;label id="grouplabel">Time&lt;/label>
 * &lt;div id="radioset" data-bind="ojComponent: {component: 'ojRadioset', 
 * value: currentTime} 
 *   aria-labelledby="grouplabel" >
 *   &lt;input id="morningid" value="morning" type="radio" name="time"/&gt;
 *   &lt;label for="morningid"/&gt;Morning&lt;/label>
 *   &lt;input id="nightid" value="night" type="radio" name="time"/&gt;
 *   &lt;label for="nightid"/&gt;Night&lt;/label>
 * &lt;div>
 * <br/>
 * // in the model, make the currentTime variable a knockout observable.
 * // The model and the component's value option will stay in sync. Change the
 * // component's value option and the model will change. Change the model,
 * // and the component's value option will change. Click on a radio, and both
 * // will change.
 * self.currentTime = ko.observable("night");
 */
oj.__registerWidget("oj.ojRadioset", $['oj']['editableValue'],
{
  version : "1.0.0",  
  defaultElement : "<div>", 
  widgetEventPrefix : "oj", 
  options : 
  {
    /** 
     * <p>
     * Disabled <code class="prettyprint">true</code> disables the component and disables all the 
     * inputs/labels. 
     * Disabled <code class="prettyprint">false</code> enables the component, and leaves the 
     * inputs' <code class="prettyprint">disabled</code> property as it is in the dom.
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
     * $(".selector").ojRadioset({"disabled": true});
     * 
     * @expose 
     * @type {?boolean}
     * @default <code class="prettyprint">false</code>
     * @public
     * @instance
     * @memberof oj.ojRadioset
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
     * $(".selector").ojRadioset({'value': 'coffee'});<br/>
     * @example <caption>Get or set <code class="prettyprint">value</code> option, after initialization:</caption>
     * // Getter: returns 'coffee'
     * $(".selector").ojRadioset("option", "value");
     * // Setter: sets 'tea'
     * $(".selector").ojRadioset("option", "value", 'tea');
     * 
     * @expose 
     * @access public
     * @instance
     * @default <code class="prettyprint">null</code>
     * When the option is not set, the value of the checked radio is used, if a radio is checked.
     * @memberof oj.ojRadioset
     * @type {string|undefined|null}
     */
    value: undefined
  },
  /**** start Public APIs ****/
      
   /**
   * Refreshes the radioset
   * <p>A <code class="prettyprint">refresh()</code> is required 
   * when a radioset is programatically changed, like in the following circumstances:
   * <ul>
   *   <li>After radios are added or removed or modified (without using ojRadioset) in the DOM.</li>
   *   <li>After a radio's disabled dom attribute is changed. Since there is no api to change an
   *   individual radio's disabled state, the only way to do this is to change the radio's 
   *   disabled attribute in dom and then to call refresh on the ojRadioset.</li>
   * </ul>    
   * @expose 
   * @memberof oj.ojRadioset
   * @instance
   * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
   * $( ".selector" ).ojRadioset( "refresh" );
   */
  refresh: function() 
  {
    // Set _ResetComponentState. It is called first in EditableValue's refresh,
    // and we override it in ojradioset to reset the this.$radios in case some have 
    // been deleted or overridden.
    
    this._super();      
    this._setup();
  },
  /**
   * Returns a jQuery object containing the element visually representing the radioset. 
   * 
   * <p>This method does not accept any arguments.
   * 
   * @expose
   * @memberof oj.ojRadioset
   * @instance
   * @return {jQuery} the radio
  */
  widget : function ()
  {
    return this.uiRadioset;
  },
          
   /**** end Public APIs ****/         
          
  /**** start internal widget functions ****/   
  /**
   * @protected
   * @override
   * @instance
   * @memberof oj.ojRadioset
   */
  _InitOptions : function (originalDefaults, constructorOptions)
  {
    var checkedRadio, domValue;
    var props = [{attribute: "disabled", validateOption: true},
                 {attribute: "placeholder"},
                 {attribute: "required", coerceDomValue: true, validateOption: true},
                 {attribute: "title"}
                 // {attribute: "value"} // code below sets value
               ]; 
    
    this._super(originalDefaults, constructorOptions);
    oj.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this);  
    this.$radios = this._findRadiosWithMatchingName();
    
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
      // return the checked values by simply looking at DOM node

      checkedRadio = this.$radios.filter(":checked");
      domValue = (checkedRadio.length === 0) ? undefined : checkedRadio.val();
      // we only use the dom if SOMETHING is checked. If nothing is checked, we stay with whatever
      // is in this.options['value'].
      if (domValue !== undefined)
      {
        // when defaulting from DOM we want to trigger optionChange to writeback new value
        this.option("value", domValue, {'_context':{writeback: true, internalSet: true}});
      }
      // widget defaults to null
      if (this.options['value'] === undefined)
        this.options['value'] = null;
    }
  },      
  /**
   * After _ComponentCreate and _AfterCreate, 
   * the widget should be 100% set up. this._super should be called first.
   * @override
   * @protected
   * @memberof oj.ojRadioset
   * @instance
   */
  _ComponentCreate : function ()
  {
    var element = this.element;
    this._super();
    // first check to see if this.element is NOT a fieldset. If fieldset, throw error.
    if (element.is("fieldset"))
    {
      throw new Error("ojRadioset cannot be bound to a fieldset. Use a div instead.");
    }
    // Turn each radio into ojRadioCheckbox. Since ojRadiooxSet delegates to the _ojRadioCheckbox
    // component, and we need to mark this as an internal node so that oj.Components.getComponentElementByNode
    // knows it is an internal component in this case, not a stand-alone component
    this.$radios._ojRadioCheckbox().attr('data-oj-internal', true);

    // keep the root dom element as is, and add a wrapper dom underneath it. This way we can
    // have one div around all the inputs and labels, and for inline messaging we can have another
    // div around the inline messaging content. And we can style the borders of the two boxes differently.
    this.uiRadioset = element.addClass("oj-radioset oj-component").attr( "role", "radiogroup" )
      .wrapInner("<div class='oj-radioset-wrapper'></div>"); //@HTMLUpdateOK
    
    this._on(this._events);
  },
  /**
   * This is where we do things right after the component was created.
   * this._super should be called first.
   * 
   * @override
   * @memberof oj.ojRadioset
   * @instance
   * @protected
   */
  _AfterCreate: function()
  {
    this._super();
    this._setup();
  },
  /**
   * Resets this.$radios. This is called at the beginning of a refresh in EditableValue
   * @override
   * @memberof oj.ojRadioset
   * @instance
   * @protected   
   */
  _ResetComponentState : function ()
  { 
    // we could have added, removed, or modified radios, so we need to re-find all the 
    // inputs on refresh and turn the ones that aren't already ojRadioCheckboxes into them.
    this.$radios = this._findRadiosWithMatchingName();
    
    // we have a rule for refresh: if we have a public API for it, then the app dev has to use the
    // option, and not expect changing the dom will update the state with refresh.
    // However, ojRadioset does not expose a public API for the individual radios' disabled state
    // to the app developer. Our private ojRadioCheckbox component has a disabled option that
    // our code has access to.
    // For each radio, we need to look at the disabled attribute dom and update the 
    // ojradiocheckbox's disabled option.

    // !! ensures it is a boolean
    // update the private ojradiocheckbox component's disabled option to keep it in sync with the dom
    this.$radios.filter( ".oj-radio" ).each(function() 
    {
        var disabledValue = $( this ).attr("disabled") !== undefined ? 
          !!$( this ).prop("disabled") : false;
        $( this )._ojRadioCheckbox("option", "disabled", disabledValue);
    });
      
    // no need to refresh the ojRadioCheckbox's that exist since we have options for everything.
    // of the type=radio inputs that are not yet ojRadioCheckboxs, make them ojRadioCheckboxes.

    // create ojRadioCheckboxes on any new ones.
    this.$radios.not(".oj-radio")._ojRadioCheckbox();
  },  
  /**
   * Sets focus on the element that naturally gets focus. For radioset, this is the first radio <br/>
   * 
   * @returns {*} a truthy value if focus was set to the intended element, a falsey value 
   * otherwise.
   * @override
   * @memberof oj.ojRadioset
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
   * @memberof oj.ojRadioset
   * @instance
   * @protected
   * @since 1.0.0
   */
  _SetDisabledDom : function(node)
  {
    // no-op
  },
  /**
   * Returns a jquery object that is a set of elements that are input type radio
   * and have the name of the first radio found.
   * 
   * @return {Object} jquery object of all the radios within the root dom element
   * that have the same 'name' attribute as the first radio found.
   * @private
   */
  _findRadiosWithMatchingName : function ()
  {
    //return this.element.find('input[type=radio]'); // simplest thing to do.
    var element = this.element;
    var first = element.find("input[type=radio]:first"), 
      name, allradios, selector;
    if (first.length === 0)
    {
      oj.Logger.warn("Could not find any input type=radio within this element");
    }
    // get the name attribute of the first input radio
    name = first.attr("name");
    // find all input radios with matching name
    if (name === undefined)
    {
      // search for all radios with no name
      allradios = element.find("input[type=radio]");
      // now loop and find the ones without 'name' attribute
      return allradios.not("[name]");
    }
    else
    {
      // search for all radios with the name
      selector = "input[type=radio][name=" + name + "]";
      return element.find(selector);
      
    }
  },
  // Override to set custom launcher
  _NotifyContextMenuGesture: function(menu, event, eventType)
  {
    // Setting the launcher to the checked radio if any (since that's what's tabbable in mainstream browsers), 
    // else the first enabled radio (when no selection, all enabled radios are tabbable).
    // Component owner should feel free to specify a different launcher if appropriate.
    // See the superclass JSDoc for _OpenContextMenu for tips on choosing a launcher.
    var radios = this.element.find("input[type=radio]");
    var checked = radios.filter(":checked");
    var launcher = checked.length ? checked : radios.filter(":enabled").first();
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
   * @memberof oj.ojRadioset
   * @instance
   * @private
   */
  _setup: function() 
  {
    // at this point we already have this.$radios set to a list of radios for this radioset.
    this._propagateDisabled(this.options.disabled );
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
   * @memberof oj.ojRadioset
   */
  _HandleChangeEvent: function(event)
  {
    // TODO make sure the target is an input radio?
    // TODO any more checks I need to do?
    //alert("XYZ In _changeSetValue target is " + event.target + " And the value of the input is " + event.target.value);

    // should I double check that the event.target is the same as the 'checked'?
    // if (event.target === this.$radios.filter(":checked"))???
    // 
    var submittedValue = this._GetDisplayValue();
    // run full validation. There is no need to check if values have changed
    //  since for checkboxset/radiosetif we get into this function we know value has changed.
    // passing in doValueChangeCheck: false will skip the new-old value comparison
    this._SetValue(submittedValue, event, _sValueChangeCheckFalse);
  },
                  
  /**
   * Returns the display value that is ready to be passed to the converter.
   * 
   * @param {Object} value the stored value if available that needs to be formatted for display
   * @override
   * @protected
   * @memberof oj.ojRadioset
   */
  _GetDisplayValue : function (value) 
  {
    // return the value of the 'checked' radio
    return this._GetElementValue();
  },
  /**
   * Called when the display value on the element needs to be updated 
   * as a result of a value change. 
   * ojRadioset stores a String value, and this value matches the value
   * of the currently checked radio. So, if we need to set the display value,
   * what this means is we need to 'check' the radio whose value matches the
   * displayValue.
   * 
   * @param {String} displayValue the value of the checkbox that needs to be checked
   * @override
   * @protected
   * @memberof oj.ojRadioset
  */  
  _SetDisplayValue : function (displayValue) 
  {
    var length = this.$radios.length;
    var radioInputValue, i, $radio;

    // go through each _ojRadioCheckbox and see if it needs to be checked or unchecked.
    for (i = 0; i < length; i++)
    {
      $radio = $(this.$radios[i]);
      radioInputValue = $radio[0].value;
      // does the radio's value match the displayValue?
      var checked = $radio._ojRadioCheckbox("option", "checked"); 
      if (displayValue === radioInputValue)
      {
        // yes. this needs to be checked, if it isn't already
        if (!checked)
        {
          $radio._ojRadioCheckbox("option", "checked", true);
        }
      }
      else
      {
        /// no. this needs to be unchecked, if it isn't already
        if (checked)
        {
          $radio._ojRadioCheckbox("option", "checked", false);
        }
      }
    } 
  },
  /**
   * Returns the element's value. Normally, this is a call to this.element.val(),
   * but in the case of ojRadioset, the element's value is really the value
   * of the checked radio in the set.
   * @override
   * @protected
   * @memberof oj.ojRadioset
   */
  _GetElementValue : function () 
  {
    // "input:checked" selects radios that are currently checked as 
    // reflected in their boolean (true or false) checked property, 
    // which is affected when the user clicks the radio for example.
    // for radio, there will be one or none checked; 
    // if none are checked, return null (checkedRadio.val() is undefined if nothing is checked)
    var checkedRadio = this.$radios.filter(":checked");
    if (checkedRadio.length === 0)
      return null;
    else
      return checkedRadio.val();
  },

  /**
   * Returns the default styleclass for the component. Currently this is 
   * used to pass to the _ojLabel component, which will append -label and 
   * add the style class onto the label. This way we can style the label
   * specific to the input component. For example, for inline labels, the
   * radioset/checkboxset components need to have margin-top:0, whereas all the
   * other inputs need it to be .5em. So we'll have a special margin-top style 
   * for .oj-label-inline.oj-radioset-label
   * All input components must override
   * 
   * @return {string}
   * @memberof oj.ojRadioset
   * @override
   * @protected
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-radioset";
  },
  /**
   * Returns a jquery object of the elements representing the 
   * content nodes (input type=radio). This is used in EditableValue to add
   * aria-describedby to the input when there is a help icon, to add
   * aria-required and aria-invalid
   * @protected
   * @override
   * @memberof oj.ojRadioset
   */
  _GetContentElement : function ()
  {
    if (this.$radios != null)
      return this.$radios;
    else this._findRadiosWithMatchingName();
  },
    /**
   * Called when a aria-required attribute needs to be set or removed. 
   * Most inputs/selects need aria-required on the input element (aka 'content')
   * But it is not legal to have aria-required on radio/checkboxes, nor on
   * radiogroup/group.
   * Subclasses can override to put aria-required where they want or not put it at all.
   * 
   * @param {Object=} value the current value of the required option
   * @memberof oj.ojRadioset
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
   * @memberof oj.ojRadioset
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
      this.$radios.each(function() 
      {
        // this is the technique to use to call package-private functions
        // Calling it like this.$radios.ojRadioCheckbox("__setAncestorComponentDisabled",value)
        // gives an error because jquery prevents you from calling functions with an "_"
        // 
        // This is how we handle 'disabled' for radioset. We don't change the radiocheckbox
        // component's disabled option ever since if we do that we've lost what the initial disabled
        // state is (we store the disabled dom value from the radio into its disabled option)
        // and we need that when we refresh. Instead what we do
        // is we mark if its ancestor (the radioset) is disabled or not. Then, when we render
        // out the radios 'disabled' state, like oj-disabled, we look to see if it is 'effectively
        // disabled' (see _IsEffectivelyDisabled call in ojRadioCheckbox), that is if its 
        // option is disabled OR its ancestor (the radioset) is disabled.
        $( this ).data("oj-_ojRadioCheckbox").__setAncestorComponentDisabled(disabled);
      });
 
      this.$radios._ojRadioCheckbox("refreshDisabled");
  },
  /**
   * Note that _setOption does not get called during create in the super class. 
   * It only gets called when the component has already been created.
   * @override
   * @private
   */
  _setOption : function (key, value)
  {
    this._superApply(arguments);
        
    if ( key === "disabled" ) 
    {
        this._propagateDisabled(value);
    }
  },
   getNodeBySubId: function(locator)
  {
    var node = this._super(locator), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-radioset-inputs") {
        node = this.$radios.get();
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
    
    if (this.$radios)
    {
      this.$radios._ojRadioCheckbox( "destroy" );
    }

    // remove the dom we added to wrap the children of this.element, but don't remove the children.
    $(wrapperDom).contents().unwrap();

    return ret;
  }
  /**** end internal widget functions ****/ 
 
  /**
   * Removes the radioset functionality completely. 
   * This will return the element back to its pre-init state.
   * 
   * <p>This method does not accept any arguments.
   * 
   * @method
   * @name oj.ojRadioset#destroy
   * @memberof oj.ojRadioset
   * @instance
   * 
   * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
   * $( ".selector" ).ojRadioset( "destroy" );
   */
});

//////////////////     SUB-IDS     //////////////////


/**
 * <p>Sub-ID for the radioset's radios.</p>
 *
 * @ojsubid oj-radioset-inputs
 * @deprecated This sub-ID is not needed.  Since the application supplies the input elements, it can supply a unique ID by which the input elements can be accessed.
 * @memberof oj.ojRadioset
 *
 * @example <caption>Get the nodes for the radios:</caption>
 * var nodes = $( ".selector" ).ojRadioset( "getNodeBySubId", {'subId': 'oj-radioset-inputs'} );
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
   *     <tr>
   *       <td>Input</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Select the input. In some themes, the input is not visible, 
   *       so you will tap on the label.</td>
   *     </tr>
   *     <tr>
   *       <td>Input's label</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Select the corresponding input.</td>
   *     </tr> 
   *     <tr>
   *       <td>Input or Label</td>
   *       <td><kbd>Press & Hold</kbd></td>
   *       <td>If hints, title or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *    </tr> 
   *     {@ojinclude "name":"labelTouchDoc"}  
   *   </tbody>
   * </table>
   *
   * 
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojRadioset
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
   *       <td rowspan="2">Input</td>
   *       <td><kbd>UpArrow</kbd></td>
   *       <td>Select the previous input in the group.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>DownArrow</kbd></td>
   *       <td>Select the next input in the group.</td>
   *     </tr>
   *     <tr>
   *       <td>Radioset</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the checked radio input. If hints, title or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *     </tr> 
   *     {@ojinclude "name":"labelKeyboardDoc"}   
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojRadioset
   */

// -----------------------------------------------------------------------------
// "private static members" shared by all radiosets
// -----------------------------------------------------------------------------
/**
 * do not do a value change check in _SetValue
 */
var _sValueChangeCheckFalse = {doValueChangeCheck: false};
/**
 * String used to determine how we are rendering the input.
 * @const
 * @private
 * @type {string}
 */
var _HTML = "html";

}());
(function() {
var ojRadiosetMeta = {
  "properties": {
    "disabled": {
      "type": "boolean"
    },
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {
    "destroy": {},
    "refresh": {},
    "widget": {}
  },
  "extension": {
    "_widgetName": "ojRadioset"
  }
};
oj.Components.registerMetadata('ojRadioset', 'editableValue', ojRadiosetMeta);
oj.Components.register('oj-radioset', oj.Components.getMetadata('ojRadioset'));
})();
});
