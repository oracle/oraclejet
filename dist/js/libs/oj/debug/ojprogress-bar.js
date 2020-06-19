define(['exports', 'ojs/ojvcomponent', 'ojs/ojtranslation'], function (exports, ojvcomponent, Translations) { 'use strict';

  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */


  /**
   * @ojcomponent oj.ojProgressBar
   * @ojtsvcomponent
   * @ojsignature {target: "Type", value: "class ojProgressBar extends JetElement<ojProgressBarSettableProperties>"}
   *
   * @since 9.0.0
   * @ojshortdesc A progress bar allows the user to visualize the progression of an extended computer operation.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["max"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 4
   * @ojvbmincolumns 1
   * @ojunsupportedthemes ["Alta"]
   *
   * @ojuxspecs ['progress-indicator']
   *
   * @classdesc
   * <h3 id="progressBarOverview-section">
   *   JET Progress Bar
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressBarOverview-section"></a>
   * </h3>
   * The JET Progress Bar element allows a user to display progress of an operation in a rectangular horizontal meter.
   * If a developer does not wish to display the exact value, a value of '-1' can be passed in to display an indeterminate value.
   *
   * <pre class="prettyprint"><code>&lt;oj-progress-bar value='{{progressValue}}'>&lt;/oj-progress-bar></code></pre>
   *
   *
   */
  // --------------------------------------------------- oj.ojProgressbar Styling Start -----------------------------------------------------------
  // ---------------- oj-progress-bar-embedded --------------
  /**
    * Optional class that can be set on a oj-progress bar element to style an embedded progress bar within a web application or dialog.
    * @ojstyleclass oj-progress-bar-embedded
    * @ojdisplayname Embedded
    * @memberof oj.ojProgressBar
    * @ojtsexample
    * &lt;div class='oj-web-applayout-page'>
    *   &lt;header class='oj-web-applayout-header'>
    *   &lt;/header>
    *   &lt;oj-progress-bar class='oj-progress-bar-embedded' value='{{loadingValue}}'>
    *   &lt;/oj-progress-bar>
    * &lt;/div>
    */
  // --------------------------------------------------- oj.ojProgressbar Styling end -----------------------------------------------------------
  /**
   * The maximum allowed value. The element's max attribute is used if it
   * is provided, otherwise the default value of 100 is used.
   * @ojshortdesc The maximum allowed value.
   * @expose
   * @name max
   * @type {number}
   * @instance
   * @memberof oj.ojProgressBar
   * @default 100
   * @ojmin 0
   */
  /**
   * The value of the Progress Bar. The element's value attribute is used if it
   * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
   * Any other negative value will default to 0.
   * @ojshortdesc The value of the Progress Bar.
   * @expose
   * @name value
   * @type {number}
   * @instance
   * @memberof oj.ojProgressBar
   * @default 0
   * @ojmin -1
   * @ojeventgroup common
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
   * @memberof oj.ojProgressBar
   * @instance
   * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
   * @return {void}
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
   * @memberof oj.ojProgressBar
   * @instance
   *
   * @example <caption>Get a single subproperty of a complex property:</caption>
   * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
   */
  /**
   * Performs a batch set of properties.
   * @function setProperties
   * @param {Object} properties - An object containing the property and value pairs to set.
   * @return {void}
   *
   * @expose
   * @memberof oj.ojProgressBar
   * @instance
   *
   * @example <caption>Set a batch of properties:</caption>
   * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
   */

  var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  class Props {
      constructor() {
          this.max = 100;
          this.value = 0;
      }
  }
  exports.ProgressBar = class ProgressBar extends ojvcomponent.VComponent {
      render() {
          return this.props.value == -1 ? this._renderIndeterminateBar() : this._renderDeterminateBar();
      }
      _renderDeterminateBar() {
          const props = this.props;
          let max = props.max;
          let value = props.value;
          if (max < 0) {
              max = 0;
          }
          if (value < 0) {
              value = 0;
          }
          const percentage = max == 0 ? 0 : value > max ? 1 : value / max;
          return (ojvcomponent.h("oj-progress-bar", { class: 'oj-progress-bar', role: 'progressbar', "aria-valuemin": '0', "aria-valuemax": max, "aria-valuenow": value },
              ojvcomponent.h("div", { class: 'oj-progress-bar-value', style: { width: percentage * 100 + '%' } })));
      }
      _renderIndeterminateBar() {
          return (ojvcomponent.h("oj-progress-bar", { class: 'oj-progress-bar', role: 'progressbar', "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText') },
              ojvcomponent.h("div", { class: 'oj-progress-bar-value oj-progress-bar-indeterminate' },
                  ojvcomponent.h("div", { class: 'oj-progress-bar-overlay' }))));
      }
  };
  exports.ProgressBar.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "aria-valuemin": true, "aria-valuemax": true, "aria-valuetext": true, "aria-valuenow": true, "role": true } }, "properties": { "max": { "type": "number", "value": 100 }, "value": { "type": "number", "value": 0 } } };
  exports.ProgressBar = __decorate([
      ojvcomponent.customElement('oj-progress-bar')
  ], exports.ProgressBar);

  Object.defineProperty(exports, '__esModule', { value: true });

});
