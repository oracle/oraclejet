/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import * as Logger from 'ojs/ojlogger';
import Context from 'ojs/ojcontext';
import * as Config from 'ojs/ojconfig';
import * as ResponsiveUtils from 'ojs/ojresponsiveutils';
import * as ThemeUtils from 'ojs/ojthemeutils';
import * as TimerUtils from 'ojs/ojtimerutils';
import * as Translations from 'ojs/ojtranslation';

/**
 * @ojoverviewdoc ModuleLoadingOverview - [5]JET Module Loading
 * @classdesc
 * {@ojinclude "name":"moduleLoadingOverviewDoc"}
 */
/**
 * <h2 id="usage">Overview
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h2>
 * <p>
 *  JET classes and components are delivered via a set of <a href="https://github.com/amdjs/amdjs-api/wiki/AMD">asynchronous module definitions</a> (AMDs or more informally, modules).
 *  JET applications typically use <a href="https://requirejs.org/">RequireJS</a> to load the necessary modules and call API as required.  The values returned from JET modules come in one of three forms:
 * </p>
 * <h4>No return value</h4>
 *  <p>Some modules may not return any value at all.  The purpose of these modules is simply to load the associated JavaScript into memory,
 *     but the application typically does not directly interact with or instantiate this code. For example, modules that define
 *     JET Web Components typically would not have return values.
 *  </p>
 * <pre class="prettyprint"><code>
 * //Loading a JET component in your Typescript code
 *
 * //To typecheck the element APIs, import as below.
 * import {ojAccordion} from "ojs/ojaccordion";
 *
 * //For the transpiled javascript to load the element's module, import as below
 * import "ojs/ojaccordion";</code></pre>
 * <h4>One return value</h4>
 *  <p>Some modules directly return a single object or constructor function.  Applications would typically call functions on the returned
 *     object or instantiate new objects via the constructor function.  For example, the 'ojs/ojcontext' module
 *     has a single return value:
 *  </p>
 * <pre class="prettyprint"><code>
 * //Javascript example
 * define(['ojs/ojcontext'], function(Context) {
 *   var pageContext = Context.getPageContext();
 * })</code></pre>
 * <pre class="prettyprint"><code>
 * //TypeScript example
 * import Context = require('ojs/ojcontext');
 *   let pageContext = Context.getPageContext();
 * </code></pre>
 * <h4>Multiple return values</h4>
 *  <p>Some modules package several objects or constructor functions inside a single JavaScript object.  Applications would typically retrieve the relevant object or constructor function via a
 *     documented property on this object and then either call functions or instantiate new objects as appropriate.  For example, the 'ojs/ojattributegrouphandler' module has multiple return values.
 *  </p>
 * <pre class="prettyprint"><code>
 * //TypeScript example
 * import {ColorAttributeGroupHandler, ShapeAttributeGroupHandler} from "ojs/ojattributegrouphandler";
 *  let colorHandler = new ColorAttributeGroupHandler();
 *  let shapeHandler = new ShapeAttributeGroupHandler({'0-2 years': 'triangleDown',
 *                                                     '3-5 years': 'circle',
 *                                                     '6+ years': 'triangleUp'});
 *  var getLegendData = function(data, colorHandler) {
 *     var items = [];
 *     for (var i = 0; i < data.length; i++)
 *     {
 *       items.push({
 *         value: data[i].value,
 *         text: data[i].category,
 *         color: colorHandler.getValue(data[i].category),
 *       });
 *     }
 *     return [{items: items}];
 *   };
 *
 * //Another example
 * import * as Logger from "ojs/ojlogger";
 *  Logger.log("Please enter a valid input");
 * </code></pre>
 *
 * @ojfragment moduleLoadingOverviewDoc
 * @memberof ModuleLoadingOverview
 */

oj._registerLegacyNamespaceProp('Logger', Logger);
oj._registerLegacyNamespaceProp('Context', Context);
oj._registerLegacyNamespaceProp('Config', Config);
oj._registerLegacyNamespaceProp('ResponsiveUtils', ResponsiveUtils);
oj._registerLegacyNamespaceProp('ThemeUtils', ThemeUtils);
oj._registerLegacyNamespaceProp('TimerUtils', TimerUtils);
oj._registerLegacyNamespaceProp('Translations', Translations);

export default oj;
