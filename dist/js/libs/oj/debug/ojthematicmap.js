/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtThematicMap'], function(oj, $, comp, base, dvt)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojThematicMap
 * @augments oj.dvtBaseComponent
 * @since 0.7
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="thematicMapOverview-section">
 *   JET Thematic Map
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#thematicMapOverview-section"></a>
 * </h3>
 *
 * <p>Thematic maps are used to display data corresponding to geographic locations
 * or regions, such as election data for a state or sales by territory for a product. 
 * Applications are required to supply a mapProvider for a valid thematic map.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-thematic-map mapProvider='[[mapProviderObj]]'
 *   areas='[{"color":"#003366", "location":"FL"},
*            {"color":"#CC3300", "location":"TX"},
*            {"color":"#99CC33", "location":"CA"}]'>
 * &lt;/oj-thematic-map>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">styleDefaults.dataAreaDefaults</code> or 
 *    <code class="prettyprint">styleDefaults.dataMarkerDefaults</code>, instead of styling properties
 *    on the individual data items. The thematic map can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 *
 * <h3 id="mapprovider-section">
 *   Map Rendering
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#mapprovider-section"></a>
 * </h3>
 *
 * <p>
 *   Thematic map supports rendering of GeoJSON formatted geographic data. An application can specify the GeoJSON along with keys
 *   used for determining area IDs and labels by setting the the [mapProvider]{@link oj.ojThematicMap#mapProvider} attribute. 
 *   Currently only GeoJSON objects of "type" Feature or FeatureCollection are supported. Each Feature object contains
 *   the information to render a map area including the area id, coordinates, and optional short and long labels. Only Feature
 *   "geometry" objects of "type" Polygon and MutliPolgyon will be used for defining area boundaries.  All other "type" values
 *   will be skipped.  The Feature "properties" object is where the thematic map will look up area info like id, short
 *   label, and long label using the key mappings provided in the [propertiesKeys]{@link oj.ojThematicMap#mapProvider.propertiesKeys} property.
 *   See the thematic map <a href="../jetCookbook.html?component=thematicMap&demo=mapProvider">Map Provider Demo</a> for an example.
 * </p>
 * <p>
 *   If longitude/latitude coordinate data need to be rendered, the application should use a projection library to
 *   project the coordinates to the map projection before passing as x and y properties to the marker object.
 * </p>
 */
oj.__registerWidget('oj.ojThematicMap', $['oj']['dvtBaseComponent'],
  {
    widgetEventPrefix: "oj",
    options: {},
    _currentLocale : '',
    _loadedBasemaps : [],
    _basemapPath : 'resources/internal-deps/dvt/thematicMap/basemaps/',
    _supportedLocales: {
      'ar' : 'ar',
      'cs' : 'cs',
      'da' : 'da',
      'de' : 'de',
      'el' : 'el',
      'es' : 'es',
      'fi' : 'fi',
      'fr' : 'fr',
      'fr-ca' : 'fr_CA',
      'he' : 'iw',
      'hu' : 'hu',
      'it' : 'it',
      'ja' : 'ja',
      'ko' : 'ko',
      'nl' : 'nl',
      'no' : 'no',
      'pl' : 'pl',
      'pt' : 'pt_BR',
      'pt-pt' : 'pt',
      'ro' : 'ro',
      'ru' : 'ru',
      'sk' : 'sk',
      'sv' : 'sv',
      'th' : 'th',
      'tr' : 'tr',
      'zh-hans' : 'zh_CN',
        'zh-hant' : 'zh_TW'},

    // @inheritdoc
    _ComponentCreate : function() {
      this._super();
      this._checkBasemaps = [];
      this._initiallyRendered = false;
      this._dataLayersToUpdate = [];
    },

    // @inheritdoc
    _CreateDvtComponent: function(context, callback, callbackObj) {
      return dvt.ThematicMap.newInstance(context, callback, callbackObj);
    },

    // @inheritdoc
    _ConvertLocatorToSubId : function(locator) {
      var subId = locator['subId'];

      // Convert the supported locators
      if(subId == 'oj-thematicmap-area') {
        // dataLayerId:area[index]
        subId = this._getDataLayerId(locator['dataLayer'], locator['index'], 'area') + ':area[' + locator['index'] + ']';
      }
      else if(subId == 'oj-thematicmap-marker') {
        // dataLayerId:marker[index]
        subId = this._getDataLayerId(locator['dataLayer'], locator['index'], 'marker') + ':marker[' + locator['index'] + ']';
      }
      else if(subId == 'oj-thematicmap-link') {
        // dataLayerId:link[index]
        subId = this._getDataLayerId(locator['dataLayer'], locator['index'], 'link') + ':link[' + locator['index'] + ']';
      }
      else if(subId == 'oj-thematicmap-tooltip') {
        subId = 'tooltip';
      }
      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    },

    // @inheritdoc
    _ConvertSubIdToLocator : function(subId) {
      var locator = {};

      if(subId.indexOf(':area') > 0) {
        // dataLayerId:area[index]
        locator['subId'] = 'oj-thematicmap-area';
        if (!this._IsCustomElement())
          locator['dataLayer'] = subId.substring(0, subId.indexOf(':'));
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId.indexOf(':marker') > 0) {
        // dataLayerId:marker[index]
        locator['subId'] = 'oj-thematicmap-marker';
        if (!this._IsCustomElement())
          locator['dataLayer'] = subId.substring(0, subId.indexOf(':'));
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId.indexOf(':link') > 0) {
        // dataLayerId:link[index]
        locator['subId'] = 'oj-thematicmap-link';
        if (!this._IsCustomElement())
          locator['dataLayer'] = subId.substring(0, subId.indexOf(':'));
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId == 'tooltip') {
        locator['subId'] = 'oj-thematicmap-tooltip';
      }

      return locator;
    },

    // @inheritdoc
    _GetComponentStyleClasses: function() {
      var styleClasses = this._super();
      styleClasses.push('oj-thematicmap');
      return styleClasses;
    },

    // @inheritdoc
    _GetChildStyleClasses: function() {
      var styleClasses = this._super();
      styleClasses['oj-dvtbase oj-thematicmap'] = {'path': 'animationDuration', 'property': 'animation-duration'};
      styleClasses['oj-thematicmap-arealayer'] = [
        {'path': 'styleDefaults/areaStyle', 'property': 'CSS_BACKGROUND_PROPERTIES'},
        {'path': 'styleDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'}
      ];
      styleClasses['oj-thematicmap-area'] = {'path': 'styleDefaults/dataAreaDefaults/borderColor', 'property': 'border-top-color'};
      styleClasses['oj-thematicmap-area oj-hover'] = {'path': 'styleDefaults/dataAreaDefaults/hoverColor', 'property': 'border-top-color'};
      styleClasses['oj-thematicmap-area oj-selected'] = [
        {'path': 'styleDefaults/dataAreaDefaults/selectedInnerColor', 'property': 'border-top-color'},
        {'path': 'styleDefaults/dataAreaDefaults/selectedOuterColor', 'property': 'border-bottom-color'}];
      styleClasses['oj-thematicmap-marker'] = [
        {'path': 'styleDefaults/dataMarkerDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'},
        {'path': 'styleDefaults/dataMarkerDefaults/color', 'property': 'background-color'},
        {'path': 'styleDefaults/dataMarkerDefaults/opacity', 'property': 'opacity'},
        {'path': 'styleDefaults/dataMarkerDefaults/borderColor', 'property': 'border-top-color'}
      ];
      styleClasses['oj-thematicmap-link'] = {'path': 'styleDefaults/linkDefaults/color', 'property': 'color'};
      styleClasses['oj-thematicmap-link oj-hover'] = {'path': 'styleDefaults/linkDefaults/_hoverColor', 'property': 'color'};
      styleClasses['oj-thematicmap-link oj-selected'] = {'path': 'styleDefaults/linkDefaults/_selectedColor', 'property': 'border-color'};
      return styleClasses;
    },

    // @inheritdoc
    _GetEventTypes : function() {
      return ['optionChange'];
    },


    // @inheritdoc
    _setOptions : function (options, flags) {
      // determine if option change is a data layer update and save data to call data layer update API instead of render in _Render
      var numUpdates = Object.keys(options).length;
      var newAreaLayers = options['areaLayers'];
      var oldAreaLayers = this.options['areaLayers'];
      var pointDataLayers = options['pointDataLayers'];
      if (numUpdates == 1 && newAreaLayers && oldAreaLayers && oldAreaLayers.length > 0) {
        for (var i = 0; i < newAreaLayers.length; i++) {
          var newAreaLayer = newAreaLayers[i];
          var currAreaLayer = oldAreaLayers[i];
          var updateDataLayer = true;
          for (var areaLayerKey in newAreaLayer) {
            // check to see if option update is a data layer update by seeing if any other area layer property is changed
            if (areaLayerKey != 'areaDataLayer' && newAreaLayer[areaLayerKey] != currAreaLayer[areaLayerKey]) {
              updateDataLayer = updateDataLayer && false;
            }
          }
          if (updateDataLayer && !oj.Object.compareValues(currAreaLayer['areaDataLayer'], newAreaLayer['areaDataLayer'])) {
            this._dataLayersToUpdate.push({'options': newAreaLayer['areaDataLayer'], 'parentLayer': newAreaLayer['layer'], 'isADL': true});
          }
        }
      }
      else if (numUpdates == 1 && pointDataLayers && this.options['pointDataLayers'] && this.options['pointDataLayers'].length > 0) {
        for (var i = 0; i < pointDataLayers.length; i++) {
          if (!oj.Object.compareValues(this.options['pointDataLayers'][i], pointDataLayers[i])) {
            this._dataLayersToUpdate.push({'options': pointDataLayers[i], 'parentLayer': pointDataLayers[i]['id'], 'isADL': false});
          }
        }
      }
      this._super(options, flags);
     },

    // @inheritdoc
    _GetComponentRendererOptions: function() {
      return ['tooltip/renderer','_tooltip/renderer','renderer','focusRenderer','hoverRenderer','selectionRenderer'];
    },

    // @inheritdoc
    _ProcessOptions: function() {
      this._super();

      // wrap tooltip function in try catch
      var tooltipObj = this.options['tooltip'];
      var tooltipFun = tooltipObj ? tooltipObj['renderer'] : null;
      if (tooltipFun) {
        var self = this;
        this.options['_tooltip'] = {
          'renderer': function(context) {
            var defaultTooltip = self._IsCustomElement() ? 
                           {'insert' : context['tooltip']} : context['tooltip'];
            try {
              var tooltip = tooltipFun(context);
              return tooltip || defaultTooltip;
            } catch (error) {
              oj.Logger.warn("Showing default tooltip. " + error);
              return defaultTooltip;
            }
          }
        };
      }

      var areaLayers = this.options['areaLayers'];
      // call custom renderers
      if (areaLayers) {
        for (var i = 0; i < areaLayers.length; i++) {
          var areaDataLayer = areaLayers[i]['areaDataLayer'];
          if (areaDataLayer) {
            var renderer = areaDataLayer['_templateRenderer'];
            if (renderer)
              areaDataLayer['renderer'] = this._GetTemplateDataRenderer(renderer, 'area');
          }
        }
      }
      var pointDataLayers = this.options['pointDataLayers'];
      if (pointDataLayers) {
        for (var i = 0; i < pointDataLayers.length; i++) {
          var pointDataLayer = pointDataLayers[i];
          if (pointDataLayer) {
            var renderer = pointDataLayer['_templateRenderer'];
            if (renderer)
              pointDataLayer['renderer'] = this._GetTemplateDataRenderer(renderer, 'point');
          }
        }
      }

      // callback function for getting the context needed for custom renderers
      this.options['_contextHandler'] = this._getContextHandler();
    },

    // @inheritdoc
    _Render: function() {
      this._NotReady();
      
      var areaLayers = this.options['areaLayers'];
      // Don't render unless a basemap and area layer or at least a mapProvider for custom element are provided
      if (this._IsCustomElement()) {
        if (!this.options['mapProvider']) {
          this._MakeReady();
          return;
        }
      } else {
        if (!this.options['basemap'] || !areaLayers || areaLayers.length < 1) {
          this._MakeReady();
          return;
        }

        // For thematic map, we must ensure that all basemaps are loaded before rendering.  If basemaps are still loading,
        // return and wait for the load listener to call _Render again.
        this._loadBasemap();
        for (var i = 0; i < this._checkBasemaps.length; i++) {
          if (!this._loadedBasemaps[this._checkBasemaps[i]])
            return;
        }
        this._checkBasemaps = [];
      }

      // do data layer updates only if we've already initially rendered the thematic map
      if (this._initiallyRendered && this._dataLayersToUpdate.length > 0) {
        // Fix 18498656: If the component is not attached to a visible subtree of the DOM, rendering will fail because
        // getBBox calls will not return the correct values.
        // Note: Checking offsetParent() does not work here since it returns false for position: fixed.
        if(this._context.isReadyToRender()) {
          for (var i = 0; i < this._dataLayersToUpdate.length; i++) {
            var dl = this._dataLayersToUpdate[i];
            var isAdl = dl['isADL'];
            if (isAdl)
              this._CleanTemplate('area');
            else
              this._CleanTemplate('point');
            this._component.updateLayer(dl['options'], dl['parentLayer'], isAdl);
          }
          this._dataLayersToUpdate = [];
        }
      } else {
        // Delegate to the super to call the shared JS component for actual rendering.
        this._super();
        this._initiallyRendered = true;
      }
    },

    // @inheritdoc
    _RenderComponent : function(options, isResize) {
      // Map old to new APIs right before render so we handle deferred data case as well
      if (this._IsCustomElement()) {
        this._mapCustomElementOptions(options);
      }
      // parse the top level selection map and populate data layer selection option
      this._updateDataLayerSelection(options); 

      this._super(options, isResize);
    },

    /**
     * Creates a callback function that will be used by a data item to populate context for its custom renderer
     * @return {Function} context handler callback used to create context for a custom renderer
     * @private
     * @instance
     * @memberof oj.ojThematicMap
     */
    _getContextHandler: function() {
     var thisRef = this;
     var contextHandlerFunc = function (parentElement, rootElement, data, state, previousState) {
       var context = {
         'component': oj.Components.__GetWidgetConstructor(thisRef.element),
         'parentElement': parentElement,
         'rootElement': rootElement,
         'data': data,
         'state': state,
         'previousState': previousState,
         'id': data['id'],
         'label': data['label'],
         'color': data['color'],
         'location': data['location'],
         'x': data['x'],
         'y': data['y']
       };
       if (thisRef._IsCustomElement()) {
        context['renderDefaultHover'] = thisRef.renderDefaultHover.bind(thisRef, context);
        context['renderDefaultSelection'] = thisRef.renderDefaultSelection.bind(thisRef, context);
        context['renderDefaultFocus'] = thisRef.renderDefaultFocus.bind(thisRef, context);
       }
       return thisRef._FixRendererContext(context);
     }
     return contextHandlerFunc;
    },

    /**
     * Renders the default hover effect for a data item.
     * @param {Object} context A context object with the following properties:
     * <ul>
     *  <li>{Function} component: A reference to the thematic map widget constructor so non public methods cannot be called.</li>
     *  <li>{Object} data: The data object for a stamped data visualization in the data layer.</li>
     *  <li>{SVGElement} parentElement: An element that is part of a displayed subtree on the DOM. Modifications of the parentElement are not supported.</li>
     *  <li>{SVGElement} rootElement: Null on initial rendering or the current data item SVG element.</li>
     *  <li>{Object} state: An object that reflects the current state of the data item with the following boolean properties: hovered, selected, focused.</li>
     *  <li>{Object} previousState: An object that reflects the previous state of the data item with the following boolean properties: hovered, selected, focused.</li>
     *  <li>{string} id: The id of the hovered item.</li>
     *  <li>{string} label: The data label of the hovered item.</li>
     *  <li>{string} color: The color of the hovered item.</li>
     *  <li>{string} location: The location id of the hovered item which can be null if x/y are set instead.</li>
     *  <li>{string} x: The x coordinate of the hovered item which can be null if location is set instead.</li>
     *  <li>{string} y: The y coordinate of the hovered item which can be null if location is set instead.</li>
     * </ul>
     * @expose
     * @ignore
     * @instance
     * @memberof oj.ojThematicMap
     */
    renderDefaultHover: function (context) {
      if (!context['previousState'] || context['state']['hovered'] != context['previousState']['hovered']) {
        this._component.processDefaultHoverEffect(context['id'], context['state']['hovered']);
      }
    },

    /**
     * Renders the default selection effect for a data item.
     * @param {Object} context A context object with the following properties:
     * <ul>
     *  <li>{Function} component: A reference to the thematic map widget constructor so non public methods cannot be called.</li>
     *  <li>{Object} data: The data object for a stamped data visualization in the data layer.</li>
     *  <li>{SVGElement} parentElement: An element that is part of a displayed subtree on the DOM. Modifications of the parentElement are not supported.</li>
     *  <li>{SVGElement} rootElement: Null on initial rendering or the current data item SVG element.</li>
     *  <li>{Object} state: An object that reflects the current state of the data item with the following boolean properties: hovered, selected, focused.</li>
     *  <li>{Object} previousState: An object that reflects the previous state of the data item with the following boolean properties: hovered, selected, focused.</li>
     *  <li>{string} id: The id of the hovered item.</li>
     *  <li>{string} label: The data label of the hovered item.</li>
     *  <li>{string} color: The color of the hovered item.</li>
     *  <li>{string} location: The location id of the hovered item which can be null if x/y are set instead.</li>
     *  <li>{string} x: The x coordinate of the hovered item which can be null if location is set instead.</li>
     *  <li>{string} y: The y coordinate of the hovered item which can be null if location is set instead.</li>
     * </ul>
     * @expose
     * @ignore
     * @instance
     * @memberof oj.ojThematicMap
     */
    renderDefaultSelection: function (context) {
      if (!context['previousState'] || context['state']['selected'] != context['previousState']['selected']) {
        this._component.processDefaultSelectionEffect(context['id'], context['state']['selected']);
      }
    },

    /**
     * Renders the default focus effect for a data item.
     * @param {Object} context A context object with the following properties:
     * <ul>
     *  <li>{Function} component: A reference to the thematic map widget constructor so non public methods cannot be called.</li>
     *  <li>{Object} data: The data object for a stamped data visualization in the data layer.</li>
     *  <li>{SVGElement} parentElement: An element that is part of a displayed subtree on the DOM. Modifications of the parentElement are not supported.</li>
     *  <li>{SVGElement} rootElement: Null on initial rendering or the current data item SVG element.</li>
     *  <li>{Object} state: An object that reflects the current state of the data item with the following boolean properties: hovered, selected, focused.</li>
     *  <li>{Object} previousState: An object that reflects the previous state of the data item with the following boolean properties: hovered, selected, focused.</li>
     *  <li>{string} id: The id of the hovered item.</li>
     *  <li>{string} label: The data label of the hovered item.</li>
     *  <li>{string} color: The color of the hovered item.</li>
     *  <li>{string} location: The location id of the hovered item which can be null if x/y are set instead.</li>
     *  <li>{string} x: The x coordinate of the hovered item which can be null if location is set instead.</li>
     *  <li>{string} y: The y coordinate of the hovered item which can be null if location is set instead.</li>
     * </ul>
     * @expose
     * @ignore
     * @instance
     * @memberof oj.ojThematicMap
     */
    renderDefaultFocus: function (context) {
      if (!context['previousState'] || context['state']['focused'] != context['previousState']['focused']) {
        this._component.processDefaultFocusEffect(context['id'], context['state']['focused']);
      }
    },

    /**
     * Loads the basemaps and resource bundles.
     * @private
     */
    _loadBasemap: function() {
      var basemap = this.options['basemap'];
      if (basemap) {
        var locale = oj.Config.getLocale();
        if (locale !== this._currentLocale) {
          this._currentLocale = locale;
          this._loadedBasemaps = [];
        }

        // Track basemaps that need to be loaded before rendering
        var areaLayers = this.options['areaLayers'];
        // load area layer basemaps
        if (areaLayers) {
          for (var i = 0; i < areaLayers.length; i++) {
            var layer = areaLayers[i]['layer'];
            if (layer) {
              this._loadBasemapHelper(basemap, layer, locale);
            }
          }
        }

        // load city basemap
        var pointDataLayers = this.options['pointDataLayers'];
        // Don't try and load cities basemap if mapProvider is used
        if (!this.options['mapProvider'] && pointDataLayers && pointDataLayers.length > 0)
          this._loadBasemapHelper(basemap, 'cities', locale);
      }
    },

    /**
     * Utility function for loading resource bundles by url.
     * @param {string} url The url of the resource to load
     * @param {boolean} bRenderOnFail True if we should render even if resource fails to load
     * @private
     */
    _loadResourceByUrl: function(url, bRenderOnFail) {
      // resource is already loaded or function tried to load this resource but failed
      if (this._loadedBasemaps[url])
        return;

      var thisRef = this;
      var renderCallback = function () {
        thisRef._loadedBasemaps[url] = true;
        thisRef._Render();
      }
      // TODO Update to use requirejs for internal resource bundle loading after 2.2.0(?)
      var getScript = $.getScript(oj.Config.getResourceUrl(url), function(script, textStatus) {renderCallback();});
      // Resource bundles might not get included, but this should not stop component rendering
      if (bRenderOnFail) {
        getScript.fail(function(jqxhr, settings, exception) {renderCallback();});
      }
    },

    /**
     * Helper function to load a single layer basemap and resource bundle.
     * @private
     */
    _loadBasemapHelper: function(basemap, layer, locale) {
      var isLoaded = true;
      try {
        // If the basemap is not loaded in DvtBaseMapManager then we'll get an error thrown
        // so we need to catch and load the basemap
        isLoaded = Object.keys(dvt.DvtBaseMapManager.getLayerIds(basemap, layer)).length > 0;
      } catch (err) {
        isLoaded = false;
      }

      if (!isLoaded) {
        // Don't need to wait for loaded basemaps if using mapProvider
        if (!this.options['mapProvider']) {
          var relativeUrl = this._basemapPath + 'ojthematicmap-' + basemap + '-' + layer + '.js';
          if (this._checkBasemaps.indexOf(relativeUrl) == -1) {
            this._checkBasemaps.push(relativeUrl);
            this._loadResourceByUrl(relativeUrl, false);
          }
        }
      }

      if (locale.indexOf('en') === -1) {
        /*
         * Split locale by subtags and try to load resource bundle that satisfies
         * Locale syntax defined by BCP 47 and should be one of the following formats:
         * 1)language_script_region
         * 2)language_region
         * 3)language_script
         * 4)language
         * 5)default (en)
         */
        var splitLocale = locale.toLowerCase().split('-');
        var localeList = [splitLocale[0]];
        if (splitLocale.length > 1) {
          localeList.unshift(splitLocale[0]+'-'+splitLocale[1]);
        }
        if (splitLocale.length > 2) {
          localeList.unshift(splitLocale[0]+'-'+splitLocale[2], splitLocale[0]+'-'+splitLocale[1]+'-'+splitLocale[2]);
        }

        basemap = basemap.charAt(0).toUpperCase() + basemap.slice(1);
        layer = layer.charAt(0).toUpperCase() + layer.slice(1);
        var bundleName = this._basemapPath + 'resourceBundles/' + basemap + layer + 'Bundle_';
        // Go thru list of supported DVT languages
        for (var i = 0; i < localeList.length; i++) {
          if (this._supportedLocales[localeList[i]]) {
            var bundleUrl = bundleName + this._supportedLocales[localeList[i]] + ".js";
            if (this._checkBasemaps.indexOf(bundleUrl) == -1) {
              this._checkBasemaps.push(bundleUrl);
              this._loadResourceByUrl(bundleUrl, true);
            }
            break;
          }
        }
      }
    },

    // @inheritdoc
    _HandleEvent: function(event) {
      var type = event['type'];
      if (!this._IsCustomElement() && type === 'selection') {
        var selection = {};
        var id = event['clientId'];
        selection[id] = event['selection'];
        if (this.options['selection']) {
          for (var dataLayerId in this.options['selection']) {
            if (id !== dataLayerId)
              selection[dataLayerId] = this.options['selection'][dataLayerId];
          }
        }
        this._UserOptionChange('selection', selection);
      } else {
        this._super(event);
      }
    },

    // @inheritdoc
    _GetTranslationMap: function() {
      // The translations are stored on the options object.
      var translations = this.options['translations'];

      // Safe to modify super's map because function guarentees a new map is returned
      var ret = this._super();
      ret['DvtUtilBundle.THEMATIC_MAP'] = translations['componentName'];
      return ret;
    },

    /**
     * Updates the options object with the current data layer selection states
     * @param {Object} options The options object to update
     * @memberof oj.ojThematicMap
     * @instance
     * @private
     */
    _updateDataLayerSelection: function(options) {
      var selection = options['selection'];
      // Assume ids are unique amongst all data items for custom elements
      // so just same selection array on all data layers
      if (selection) {
        var pdls = options['pointDataLayers'];
        if (pdls) {
          if (this._IsCustomElement() && pdls[0]) {
            pdls[0]['selection'] = selection;
          } else {
            for (var i = 0; i < pdls.length; i++) {
              if (selection[pdls[i]['id']])
                pdls[i]['selection'] = selection[pdls[i]['id']];
            }
          }
        }

        var als = options['areaLayers'];
        if (als && als[0]) {
          // JET thematic map does not support nesting of point data layers within an area layer
          var adl = als[0]['areaDataLayer'];
          if (this._IsCustomElement() && adl) {
            adl['selection'] = selection;
          } else {
            if (adl && selection[adl['id']])
              adl['selection'] = selection[adl['id']];
          }
        }
      }
    },

    /**
     * Returns an object with the following properties for automation testing verification of an area with
     * the specified index in the areas property.
     *
     * @param {number} index
     * @property {string} color
     * @property {string} label
     * @property {boolean} selected
     * @property {string} tooltip
     * @return {Object|null} An object containing properties for the area, or null if none exists.
     * @expose
     * @instance
     * @memberof oj.ojThematicMap
     */
    getArea : function(index) {
      if (this._IsCustomElement())
        return this._component.getAutomation().getData(this._getDataLayerId(null, index, 'area'), 'area', index);
      else
        return this._component.getAutomation().getData(arguments[0], 'area', arguments[1]);
    },

    /**
     * Returns an object with the following properties for automation testing verification of a marker with
     * the specified index in the markers property.
     *
     * @param {number} index
     * @property {string} color
     * @property {string} label
     * @property {boolean} selected
     * @property {string} tooltip
     * @return {Object|null} An object containing properties for the marker, or null if none exists.
     * @expose
     * @instance
     * @memberof oj.ojThematicMap
     */
    getMarker : function(index) {
      if (this._IsCustomElement())
        return this._component.getAutomation().getData(this._getDataLayerId(null, index, 'marker'), 'marker', index);
      else
        return this._component.getAutomation().getData(arguments[0], 'marker', arguments[1]);
    },

    /**
     * Returns an object with the following properties for automation testing verification of a link with
     * the specified index in the links property.
     *
     * @param {number} index
     * @property {string} color
     * @property {string} label
     * @property {boolean} selected
     * @property {string} tooltip
     * @return {Object|null} An object containing properties for the link, or null if none exists.
     * @expose
     * @instance
     * @memberof oj.ojThematicMap
     */
    getLink : function(index) {
      if (this._IsCustomElement())
        return this._component.getAutomation().getData(this._getDataLayerId(null, index, 'link'), 'link', index);
      else
        return this._component.getAutomation().getData(arguments[0], 'link', arguments[1]);
    },

    /**
     * {@ojinclude "name":"nodeContextDoc"}
     * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
     * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
     *
     * @example {@ojinclude "name":"nodeContextExample"}
     *
     * @expose
     * @instance
     * @memberof oj.ojThematicMap
     */
    getContextByNode: function(node) {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context) {
        if (this._IsCustomElement())
          delete context['dataLayer'];
        if (context['subId'] !== 'oj-thematicmap-tooltip')
          return context;
      }

      return null;
    },

    // @inheritdoc
    _GetComponentDeferredDataPaths : function() {
      if (this._IsCustomElement())
        return {'root': ['areas', 'markers', 'links']};
      else
        return {
          'areaLayers': ['areaDataLayer/areas', 'areaDataLayer/markers', 'areaDataLayer/links'],
          'pointDataLayers': ['markers', 'links']
        };
    },

    // @inheritdoc
    _GetComponentNoClonePaths : function() {
      // For custom elements we want to skip cloning for data and also the mapProvider object so we can 
      // internally do === checks and perform animations when the mapProvider changes
      if (this._IsCustomElement())
        return {'areas': true, 'markers': true, 'links': true, 'mapProvider': true};
      else
        return {'mapProvider': true, 'areaLayers': {'areaDataLayer': {'areas': true, 'markers': true, 'links': true}}, 'pointDataLayers': {'markers': true, 'links': true}};
    },

    // @inheritdoc
    _GetDataContext : function(options) {
      if (this._IsCustomElement()) {
        return this._super();
      } else {
        // Need to use this.options instead of options because the options
        // passed in will actually be an areaLayer or pointDataLayer options object
        var basemap = this.options['basemap'];
        var layer = options['layer'] ? options['layer'] : 'cities';
        return {'basemap': basemap, 'layer' : layer, 'ids': dvt.DvtBaseMapManager.getLayerIds(basemap, layer)};
      }
    },

    /**
     * Map custom element APIs to the widget APIs and return an object containing
     * the new area and point data layers for rendering purposes.
     * @param {string} options The options to map
     * @private
     * @instance
     * @memberof oj.ojThematicMap
     */
    _mapCustomElementOptions: function(options) {
      // AnimationOnMapChange is not exposed, map animationOnDisplay to that property instead
      var animOnMapChange = options['animationOnMapChange'];
      if (animOnMapChange)
        options['animationOnDisplay'] = animOnMapChange;

      // Create areaLayers and pointDataLayers objects for data items
      var areaLayers = [{}];
      options['areaLayers'] = areaLayers;
      var areaLayer = areaLayers[0];
      var adl = {'id': 'adl1'}; // need id for automation lookup
      areaLayer['areaDataLayer'] = adl;

      var pointDataLayers = [{'id': 'pdl1'}]; // need id for automation lookup
      options['pointDataLayers'] = pointDataLayers;
      var pdl = pointDataLayers[0];

      // New top level properties that should be mapped to the areaLayer
      var props = ['labelDisplay', 'labelType'];
      this._mapOptionHelper(options, props, [areaLayer]);

      // New top level properties that should be mapped to the area/pointDataLayers
      props = ['animationOnDataChange', 'focusRenderer', 'hoverRenderer', 'renderer', 'selectionMode', 'selectionRenderer'];
      this._mapOptionHelper(options, props, [adl, pdl]);

      // New top level properties that should be mapped to the areaDataLayer
      props = ['areas', 'isolatedItem'];
      this._mapOptionHelper(options, props, [adl]);

      // Create a map of area/marker ids to data layer ids
      this._idToDataLayerMap = {};
      var areas = options['areas'];
      if (areas) {
        for (var i = 0; i < areas.length; i++) {
          var area = areas[i];
          this._idToDataLayerMap[area.id] = 'adl1';
        }
      }

      // For markers and links we need to check whether they belong to an 
      // area/pointDataLayer by checking if location is defined. 
      // Save the old array index to the new data layer mapping for constructing
      // and deconstructing subIds. Custom element subIds lack the dataLayerId.
      var markers = options['markers'];
      if (markers) {
        this._markerToDataLayerMap = [];
        var areaMarkers = [];
        var pointMarkers = [];
        for (var i = 0; i < markers.length; i++) {
          var marker = markers[i];
          if (marker['location']) {
            areaMarkers.push(marker);
            this._markerToDataLayerMap[i] = 'adl1';
            this._idToDataLayerMap[marker.id] = 'adl1';
          }
          else if (marker['x'] && marker['y']) {
            pointMarkers.push(marker);
            this._markerToDataLayerMap[i] = 'pdl1';
            this._idToDataLayerMap[marker.id] = 'pdl1';
          }
        }

        if (areaMarkers.length > 0)
          adl['markers'] = areaMarkers;
        if (pointMarkers.length > 0)
          pdl['markers'] = pointMarkers;
      }

      var links = options['links'];
      if (links) {
        this._linkToDataLayerMap = [];
        var areaLinks = [];
        var pointLinks = [];
        for (var i = 0; i < links.length; i++) {
          var link = links[i];
          var linkStart = link['startLocation'];
          // Just check the startLocation, further validation of endLocation
          // occurs in toolkit impl
          if (linkStart && linkStart['location']) {
            areaLinks.push(link);
            this._linkToDataLayerMap[i] = 'adl1';
          }
          else if (linkStart && linkStart['x'] && linkStart['y']) {
            pointLinks.push(link);
            this._linkToDataLayerMap[i] = 'pdl1';
          }
          else if (linkStart && linkStart['id']) {
            // If id is specified, find whether it maps to an area or marker.
            // Ids should be unique so we can stop at the first match.
            var dlId = this._idToDataLayerMap[linkStart['id']];
            if (dlId === 'adl1')
              areaLinks.push(link);
            else
              pointLinks.push(link);
            this._linkToDataLayerMap[i] = dlId;
          }
        }

        if (areaLinks.length > 0)
          adl['links'] = areaLinks;
        if (pointLinks.length > 0)
          pdl['links'] = pointLinks;
      }
    },

    /**
     * Helper method to map an custom element API to the old API.
     * @private
     * @instance
     * @memberof oj.ojThematicMap
     */
    _mapOptionHelper: function(options, props, optionObjs) {
      for (var i = 0; i < props.length; i++) {
        var key = props[i];
        var value = options[key];
        if (value) {
          for (var j = 0; j < optionObjs.length; j++)
            optionObjs[j][key] = value;
        }
      }
    },

    /**
     * Returns the dataLayerId used for a subId. Returns empty string for
     * custom elements
     * @param  {string} dataLayer The data layer or null if known
     * @param  {number} index The data item index
     * @param  {string} dataItemType Enum of type area, marker or link
     * @return {string}
     * @private
     */
    _getDataLayerId: function(dataLayer, index, dataItemType) {
      if (this._IsCustomElement()) {
        switch(dataItemType) {
          case 'area':
            return 'adl1';
          case 'marker':
            return this._markerToDataLayerMap[index];
          case 'link':
            return this._linkToDataLayerMap[index];
          default:
            return '';
        }
      } else {
        return dataLayer;
      }
    },
});

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
 *       <td rowspan="3">Data Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="3">Element</td>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Pan when <code class="prettyprint">panning</code> is <code class="prettyprint">auto</code>.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Pinch-close</kbd></td>
 *       <td>Zoom out when <code class="prettyprint">zooming</code> is <code class="prettyprint">auto</code>.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Spread-open</kbd></td>
 *       <td>Zoom in when <code class="prettyprint">zooming</code> is <code class="prettyprint">auto</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojThematicMap
 */

/**
 * <ul>
 *   <li>componentElement: The thematic map element.</li>
 *   <li>data: The data object for a stamped data visualization.</li> 
 *   <li>parentElement: An element that is part of a displayed subtree on the DOM. Modifications of the parentElement are not supported.</li> 
 *   <li>rootElement: Null on initial rendering or the current data item SVG element.</li> 
 *   <li>state: An object that reflects the current state of the data item with the following parameters: 
 *     <ul> 
 *       <li>hovered: hovered state, boolean.</li> <li>selected: selected state, boolean.</li> 
 *       <li>focused: focused state, boolean.</li> 
 *       </ul> 
 *   </li> 
 *   <li>previousState: An object that reflects the previous state of the data item with the following parameters: 
 *     <ul> 
 *       <li>hovered: hovered state, boolean.</li> <li>selected: selected state, boolean.</li> 
 *       <li>focused: focused state, boolean.</li> 
 *     </ul> 
 *   </li> 
 *   <li>id: The id of the hovered item.</li> 
 *   <li>label: The data label of the hovered item.</li> 
 *   <li>color: The color of the hovered item.</li> 
 *   <li>location: The location id of the hovered item which can be null if x/y are set instead.</li> 
 *   <li>x: The x coordinate of the hovered item which can be null if location is set instead.</li> 
 *   <li>y: The y coordinate of the hovered item which can be null if location is set instead.</li> 
 *   <li>renderDefaultFocus: Function for rendering default focus effect for the data item. </li>
 *   <li>renderDefaultHover: Function for rendering default hover effect for the data item. </li>
 *   <li>renderDefaultSelection: Function for rendering default selection effect for the data item. </li>
 * </ul>
 * @ojfragment rendererContext - renderer context used by custom data item renderers, such as renderer, focusRenderer, hoverRenderer, selectionRenderer.
 * @memberof oj.ojThematicMap
 */
 
/**
 *<table class="keyboard-table">
 *  <thead>
 *    <tr>
 *      <th>Key</th>
 *      <th>Action</th>
 *    </tr>
 *  </thead>
 *  <tbody>
 *  <tr>
 *     <td><kbd>Tab</kbd></td>
 *     <td>Move focus to map and then to next element.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + Tab</kbd></td>
 *     <td>Move focus to map and then to previous element.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>= or +</kbd></td>
 *     <td>Zoom in one level if zooming is enabled.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>- or _</kbd></td>
 *     <td>Zoom out one level if zooming is enabled.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>0</kbd></td>
 *     <td>Zoom to fit map if zooming is enabled.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + Alt + 0</kbd></td>
 *     <td>Zoom to fit region with focus.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + 0</kbd></td>
 *     <td>Zoom to fit selected regions.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + Shift + 0</kbd></td>
 *     <td>Reset map.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>PageUp</kbd></td>
 *     <td>Pan up.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>PageDown</kbd></td>
 *     <td>Pan down.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + PageUp</kbd></td>
 *     <td>Pans left in left to right locales.  Pans right in right to left locales.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + PageDown</kbd></td>
 *     <td>Pans right in left to right locales.  Pans left in right to left locales.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>LeftArrow or RightArrow</kbd></td>
 *     <td>Move focus and selection to the left or right nearest data item in the collection (e.g. areas, markers, links) or 
 *         the left link end marker if the focus is on a link and Alt + &lt; or Alt + &gt; was used to move there.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>UpArrow or DownArrow</kbd></td>
 *     <td>Move focus and selection to the above or below nearest data item in the collection (e.g. areas, markers, links) or
 *         to the next link above that is associated with the previous data item,
 *         if the focus is on a link and Alt + &lt; or Alt + &gt; was used to move there.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + LeftArrow or Shift + RightArrow</kbd></td>
 *     <td>Move focus and multi-select the left or right nearest data item in the collection (e.g. areas, markers, links).</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + UpArrow or Shift + DownArrow</kbd></td>
 *     <td>Move focus and multi-select the nearest data item above or below in the collection (e.g. areas, markers, links).</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + LeftArrow or Ctrl + RightArrow</kbd></td>
 *     <td>Move focus to the left or right nearest data item in the collection (e.g. areas, markers, links), 
 *         without changing the current selection.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + UpArrow or Ctrl + DownArrow</kbd></td>
 *     <td>Move focus to nearest data item above or below in the collection (e.g. areas, markers, links), without changing the current selection.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>] or [</kbd></td>
 *     <td>Move focus and selection to nearest data item in the next data layer above or below.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + ] or Shift + [</kbd></td>
 *     <td>Move focus to nearest data item in the next data layer above or below and multi-select.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + ] or Ctrl + [</kbd></td>
 *     <td>Move focus to nearest data item in the next data layer above or below, without changing the current selection.</td>
 *  </tr>
 *  <tr>
 *    <td><kbd>Alt + &lt; or Alt + &gt;</kbd></td>
 *    <td>Move focus from a data item to an associated link. Note that the link must have been created referencing the data item's ID 
 *        in its start/endLocation objects for an association to exist.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + Spacebar</kbd></td>
 *     <td>Multi-select base map region or marker with focus.</td>
 *  </tr>
 *  </tbody>
 *</table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojThematicMap
 */
/**
 * The duration of the animations in milliseconds.
 * @expose
 * @name animationDuration
 * @memberof oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">animation-duration</code> attribute specified:</caption>
 * &lt;oj-thematic-map animation-duration='200'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">animationDuration</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.animationDuration;
 * 
 * // setter
 * myThematicMap.animationDuration=200;
 */
/**
 * The type of animation to apply when the element is initially displayed
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
 * &lt;oj-thematic-map animation-on-display='auto'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.animationOnDisplay;
 * 
 * // setter
 * myThematicMap.animationOnDisplay="auto";
 */
/**
 * Determines how labels for this layer should be displayed.
 * @expose
 * @name labelDisplay
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto" Renders the label if it fits within the area bounds.
 * @default <code class="prettyprint">"off"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">label-display</code> attribute specified:</caption>
 * &lt;oj-thematic-map label-display='auto'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">labelDisplay</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.labelDisplay;
 * 
 * // setter
 * myThematicMap.labelDisplay="auto";
 */
/**
 * Determines which of the basemap labels to display
 * @expose
 * @name labelType
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "long"
 * @ojvalue {string} "short"
 * @default <code class="prettyprint">"short"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">label-display</code> attribute specified:</caption>
 * &lt;oj-thematic-map label-type='long'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">labelType</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.labelType;
 * 
 * // setter
 * myThematicMap.labelType="long";
 */
/**
 * The type of selection behavior that is enabled on the thematic map.
 * @expose
 * @name selectionMode
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "single"
 * @ojvalue {string} "multiple"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">selection-mode</code> attribute specified:</caption>
 * &lt;oj-thematic-map selection-mode='multiple'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.selectionMode;
 * 
 * // setter
 * myThematicMap.selectionMode="multiple";
 */
/**
 * The id for the isolated area of this area data layer. If set, only the isolated area will be displayed.
 * @expose
 * @name isolatedItem
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">isolated-item</code> attribute specified:</caption>
 * &lt;oj-thematic-map isolated-item='a2'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">isolatedItem</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.isolatedItem;
 * 
 * // setter
 * myThematicMap.isolatedItem="a2";
 */
/**
 * Specifies the maximum zoom level for this element. This can be any number greater than 1.0 
 * which indicates the maximum point to which the map can be scaled. A value of 2.0 implies that 
 * the map can be zoomed in until it reaches twice the viewport size. A maxZoom of 1.0 indicates 
 * that the user cannot zoom the map beyond the viewport size.
 * @expose
 * @name maxZoom
 * @memberof oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">6.0</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">max-zoom</code> attribute specified:</caption>
 * &lt;oj-thematic-map max-zoom='10'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">maxZoom</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.maxZoom;
 * 
 * // setter
 * myThematicMap.maxZoom=10;
 */
/**
 * Specifies whether the map will zoom to fit the data objects on initial render.
 * @expose
 * @name initialZooming
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">initial-zooming</code> attribute specified:</caption>
 * &lt;oj-thematic-map initial-zooming='auto'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">initialZooming</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.initialZooming;
 * 
 * // setter
 * myThematicMap.initialZooming="auto";
 */
/**
 * Determines whether element zooming is allowed.
 * @expose
 * @name zooming
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">zooming</code> attribute specified:</caption>
 * &lt;oj-thematic-map zooming='auto'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">zooming</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.zooming;
 * 
 * // setter
 * myThematicMap.zooming="auto";
 */
/**
 * Determines whether element panning is allowed.
 * @expose
 * @name panning
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">panning</code> attribute specified:</caption>
 * &lt;oj-thematic-map panning='auto'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">panning</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.panning;
 * 
 * // setter
 * myThematicMap.panning="auto";
 */
/**
 * An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">tooltip</code> attribute specified:</caption>
 * <!-- Using dot notation -->
 * &lt;oj-thematic-map tooltip.renderer='[[tooltipFun]]'>&lt;/oj-thematic-map>
 * 
 * &lt;oj-thematic-map tooltip='[[{"renderer": tooltipFun}]]'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code> 
 * property after initialization:</caption>
 * // Get one
 * var value = myThematicMap.tooltip.renderer;
 * 
 * // Get all
 * var values = myThematicMap.tooltip;
 *
 * // Set one, leaving the others intact. Always use the setProperty API for 
 * // subproperties rather than setting a subproperty directly.
 * myThematicMap.setProperty('tooltip.renderer', tooltipFun);
 * 
 * // Set all. Must list every resource key, as those not listed are lost.
 * myThematicMap.tooltip={'renderer': tooltipFun};
 */
/**
 *  A function that returns a custom tooltip. The function takes a dataContext argument, 
 *  provided by the thematic map, with the following properties: 
 *  <ul>
 *    <li>color: The color of the hovered item or null if the hovered item if not associated with any data.</li>
 *    <li>componentElement: The thematic map element.</li>
 *    <li>data: The data object of the hovered item or null if the hovered item if not associated with any data.</li> 
 *    <li>id: The id of the hovered item or null if the hovered item if not associated with any data.</li> 
 *    <li>label: The data label of the hovered item or null if the hovered item if not associated with any data.</li> 
 *    <li>location: The location id of the hovered item which can be null if x/y are set instead.</li> 
 *    <li>locationName: The location name of the hovered item if location id is set.</li> 
 *    <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li> 
 *    <li>tooltip: The default tooltip string constructed by the element if any.</li> 
 *    <li>x: The x coordinate of the hovered item which can be null if location is set instead.</li> 
 *    <li>y: The y coordinate of the hovered item which can be null if location is set instead.</li> 
 *  </ul>
 *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 * @example <caption>See the <a href="#tooltip">tooltip</a> attribute for usage examples.</caption>
 */
/**
 * Specifies the tooltip behavior of the thematic map.
 * @expose
 * @name tooltipDisplay
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "labelAndShortDesc"
 * @ojvalue {string} "none"
 * @ojvalue {string} "shortDesc"
 * @default <code class="prettyprint">"none"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">tooltip-display</code> attribute specified:</caption>
 * &lt;oj-thematic-map tooltip-display='auto'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">tooltipDisplay</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.tooltipDisplay;
 * 
 * // setter
 * myThematicMap.tooltipDisplay="auto";
 */
/**
 * Specifies marker behavior on zoom.
 * @expose
 * @name markerZoomBehavior
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "zoom"
 * @ojvalue {string} "fixed"
 * @default <code class="prettyprint">"fixed"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">marker-zoom-behavior</code> attribute specified:</caption>
 * &lt;oj-thematic-map marker-zoom-behavior='zoom'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">markerZoomBehavior</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.markerZoomBehavior;
 * 
 * // setter
 * myThematicMap.markerZoomBehavior="zoom";
 */
/**
 * An array of id strings, used to define the selected data items.
 * @expose
 * @name selection
 * @memberof oj.ojThematicMap
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">selection</code> attribute specified:</caption>
 * &lt;oj-thematic-map selection='["area1", "area2", "marker2"]'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">selection</code> 
 * property after initialization:</caption>
 * // Get one
 * var value = myThematicMap.selection[0];
 * 
 * // Get all
 * var values = myThematicMap.selection;
 * 
 * // Set all (There is no permissible "set one" syntax.)
 * myThematicMap.selection=["area1", "area2", "marker2"];
 */
/**
 * An array of category strings used for category filtering. Data items with a category in 
 * hiddenCategories will be filtered.
 * @expose
 * @name hiddenCategories
 * @memberof oj.ojThematicMap
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">hidden-categories</code> attribute specified:</caption>
 * &lt;oj-thematic-map hidden-categories='["soda", "water"]'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code> 
 * property after initialization:</caption>
 * // Get one
 * var value = myThematicMap.hiddenCategories[0];
 * 
 * // Get all
 * var values = myThematicMap.hiddenCategories;
 * 
 * // Set all (There is no permissible "set one" syntax.)
 * myThematicMap.hiddenCategories=["soda", "water"];
 */
/**
 * An array of category strings used for category highlighting. Data items with a category in 
 * highlightedCategories will be highlighted.
 * @expose
 * @name highlightedCategories
 * @memberof oj.ojThematicMap
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">highlighted-categories</code> attribute specified:</caption>
 * &lt;oj-thematic-map highlighted-categories='["soda", "water"]'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">highlightedCategories</code> 
 * property after initialization:</caption>
 * // Get one
 * var value = myThematicMap.highlightedCategories[0];
 * 
 * // Get all
 * var values = myThematicMap.highlightedCategories;
 * 
 * // Set all (There is no permissible "set one" syntax.)
 * myThematicMap.highlightedCategories=["soda", "water"];
 */
/**
 * The matching condition for the highlightedCategories option. By default, highlightMatch is 
 * 'all' and only items whose categories match all of the values specified in the highlightedCategories 
 * array will be highlighted. If highlightMatch is 'any', then items that match at least one of the 
 * highlightedCategories values will be highlighted.
 * @expose
 * @name highlightMatch
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "any"
 * @ojvalue {string} "all"
 * @default <code class="prettyprint">"all"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">highlight-match</code> attribute specified:</caption>
 * &lt;oj-thematic-map highlight-match='any'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">highlightMatch</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.highlightMatch;
 * 
 * // setter
 * myThematicMap.highlightMatch="any";
 */
/**
 * Defines the behavior applied when hovering over data items.
 * @expose
 * @name hoverBehavior
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "dim"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">hover-behavior</code> attribute specified:</caption>
 * &lt;oj-thematic-map hover-behavior='dim'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">hoverBehavior</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.hoverBehavior;
 * 
 * // setter
 * myThematicMap.hoverBehavior="dim";
 */
/**
 * An object defining the style defaults for this thematic map.
 * @expose
 * @name styleDefaults
 * @memberof oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">style-defaults</code> attribute specified:</caption>
 * <!-- Using dot notation -->
 * &lt;oj-thematic-map style-defaults.animation-duration='200'>&lt;/oj-thematic-map>
 * 
 * <!-- Using JSON notation -->
 * &lt;oj-thematic-map style-defaults='{"animationDuration": 200, "svgStyle": {"fill": "url(someURL@filterId)"}'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">styleDefaults</code> 
 * property after initialization:</caption>
 * // Get one
 * var value = myThematicMap.styleDefaults.animationDuration;
 * 
 * // Get all
 * var values = myThematicMap.styleDefaults;
 *
 * // Set one, leaving the others intact. Always use the setProperty API for 
 * // subproperties rather than setting a subproperty directly.
 * myThematicMap.setProperty('styleDefaults.svgStyle', {'fill': 'url(someURL#filterId)'});
 * 
 * // Set all. Must list every resource key, as those not listed are lost.
 * myThematicMap.styleDefaults={'fill': 'url("someURL#filterId")'};
 */
/**
 * The CSS style object defining the style of the area layer areas.
 * @expose
 * @name styleDefaults.areaSvgStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style for the area layer labels.
 * @expose
 * @name styleDefaults.labelStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * Specifies initial hover delay in ms for highlighting data items.
 * @expose
 * @name styleDefaults.hoverBehaviorDelay
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * An object defining the default styles for data areas. Properties specified on this object 
 * may be overridden by specifications on the data object.
 * @expose
 * @name styleDefaults.dataAreaDefaults
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The area stroke color for the area data layer.
 * @expose
 * @name styleDefaults.dataAreaDefaults.borderColor
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The hover data area border color.
 * @expose
 * @name styleDefaults.dataAreaDefaults.hoverColor
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The outer selected data area border color.
 * @expose
 * @name styleDefaults.dataAreaDefaults.selectedInnerColor
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The outer selected data area border color.
 * @expose
 * @name styleDefaults.dataAreaDefaults.selectedOuterColor
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * An object defining the default styles for data markers. Properties specified on this object may be 
 * overridden by specifications on the data object.
 * @expose
 * @name styleDefaults.dataMarkerDefaults
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The border color.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.borderColor
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The border width in pixels.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.borderWidth
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The border style.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.borderStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "solid"
 * @default <code class="prettyprint">"solid"</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The fill color of a marker.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.color
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The default marker pixel width. Note that this option will be ignored if a value is provided to calculate marker sizes.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.width
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The default marker pixel height. Note that this option will be ignored if a value is provided to calculate marker sizes.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.height
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The default marker opacity.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.opacity
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">1.0</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The default marker shape. Can take the name of a built-in shape or the svg path commands for a custom shape.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.shape
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "square"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @ojvalue {string} "circle"
 * @default <code class="prettyprint">"circle"</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style for a marker label.
 * @expose
 * @name styleDefaults.dataMarkerDefaults.labelStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * An object defining the default styles for data areas. Properties specified on this object may be 
 * overridden by specifications on the data object.
 * @expose
 * @name styleDefaults.linkDefaults
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The stroke color for links.
 * @expose
 * @name styleDefaults.linkDefaults.color
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The stroke width for links in pixels.
 * @expose
 * @name styleDefaults.linkDefaults.width
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">2</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * A callback function used to stamp custom SVG elements for a data layer. The function takes a single argument, 
 * provided by the element, with the following properties: 
 * {@ojinclude "name":"rendererContext"}
 *
 * The function should an Object with the following property: 
 * <ul>
 *   <li>insert: SVGElement - An SVG element, which will be used as the data item.</li>
 * </ul>
 * @expose
 * @name renderer
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An optional callback function to update the node in response to changes in hover state. 
 * The function takes a single argument, provided by the element, with the following properties: 
 * {@ojinclude "name":"rendererContext"}
 *
 * The function should return one of the following: 
 * <ul>
 *   <li>An Object with the following property:
 *     <ul><li>insert: SVGElement - An SVG element, which will be used as the data item.</li></ul>
 *   </li>
 *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
 * </ul>
 * @expose
 * @name hoverRenderer
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An optional callback function to update the data item in response to changes in selection state. 
 * The function takes a single argument, provided by the element, with the following properties: 
 * {@ojinclude "name":"rendererContext"}
 *
 * The function should return one of the following: 
 * <ul>
 *   <li>An Object with the following property:
 *     <ul><li>insert: SVGElement - An SVG element, which will be used as the data item.</li></ul>
 *   </li>
 *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
 * </ul>
 * @expose
 * @name selectionRenderer
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An optional callback function to update the data item in response to changes in keyboard focus state. 
 * The function takes a single argument, provided by the element, with the following properties: 
 * {@ojinclude "name":"rendererContext"}
 *
 * The function should return one of the following: 
 * <ul>
 *   <li>An Object with the following property:
 *     <ul><li>insert: SVGElement - An SVG element, which will be used as the data item.</li></ul>
 *   </li>
 *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
 * </ul>
 * @expose
 * @name focusRenderer
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties that define a row of data for an area data layer. 
 * Also accepts a Promise where no data will be rendered if the Promise is rejected. Regardless of the
 * set value type, we will wrap and return a Promise when accessing the areas property.
 * @expose
 * @name areas
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">areas</code> attribute specified:</caption>
 * &lt;oj-thematic-map areas='[{"id": "a1", "color": "red", "location": "FRA"}, 
 *                             ...
 *                             {"id": "a27", "color": "green", "location": "USA"}]'>
 * &lt;/oj-thematic-map>
 * 
 * &lt;oj-thematic-map areas='[[areasPromise]]'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">areas</code> 
 * property after initialization:</caption>
 * 
 * // Get all (The areas getter always returns a Promise so there is no "get one" syntax)
 * var values = myThematicMap.areas;
 * 
 * // Set all (There is no permissible "set one" syntax.)
 * myThematicMap.areas=[{"id": "a1", "color": "red", "location": "FRA"}, 
 *              ...
 *              {"id": "a27", "color": "green", "location": "USA"}];
 */
/**
 * An array of category strings corresponding to this area. This allows highlighting and filtering of areas.
 * @expose
 * @name areas[].categories
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style class to apply to the data item. The style class and inline style will override any 
 * other styling specified through the options. For tooltips and hover interactivity, it's recommended 
 * to also pass a representative color to the item color attribute.
 * @expose
 * @name areas[].svgClassName
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The data object color.
 * @expose
 * @name areas[].color
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The identifier for this data object.
 * @expose
 * @name areas[].id
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * Text used for the area's label.
 * @expose
 * @name areas[].label
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style defining the label style for this area.
 * @expose
 * @name areas[].labelStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The id of the state or country this area is associated with.
 * @expose
 * @name areas[].location
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The data object opacity.
 * @expose
 * @name areas[].opacity
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">1.0</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * Specifies whether or not the area will be selectable.
 * @expose
 * @name areas[].selectable
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The text that displays in the area's tooltip.
 * @expose
 * @name areas[].shortDesc
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style object defining the style of the data item. The style class and inline style will override any other
 *  styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a 
 *  representative color to the item color attribute.
 * @expose
 * @name areas[].svgStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#areas">areas</a> attribute for usage examples.</caption>
 */
/**
 * An array of objects with the following properties that define a row of data for a data layer.
 * Also accepts a Promise where no data will be rendered if the Promise is rejected. Regardless of the
 * set value type, we will wrap and return a Promise when accessing the markers property.
 * @expose
 * @name markers
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">markers</code> attribute specified:</caption>
 * &lt;oj-thematic-map markers='[{"id": "m1", "color": "red", "shape": "circle", x": 2102, "y": 910}, 
 *                             ...
 *                             {"id": "m27", "color": "green", "shape": "circle", "x": 4820, "y": 277}]'>
 * &lt;/oj-thematic-map>
 * 
 * &lt;oj-thematic-map markers='[[markersPromise]]'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">markers</code> 
 * property after initialization:</caption>
 * 
 * // Get all (The markers getter always returns a Promise so there is no "get one" syntax)
 * var values = myThematicMap.markers;
 * 
 * // Set all (There is no permissible "set one" syntax.)
 * myThematicMap.markers=[{"id": "m1", "color": "red", "shape": "circle", x": 2102, "y": 910}, 
 *                ...
 *                {"id": "m27", "color": "green", "shape": "circle", "x": 4820, "y": 277}];
 */
/**
 * The border color.
 * @expose
 * @name markers[].borderColor
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The border style.
 * @expose
 * @name markers[].borderStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "solid"
 * @default <code class="prettyprint">"solid"</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The border width in pixels.
 * @expose
 * @name markers[].borderWidth
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of category strings corresponding to this marker. This allows highlighting and filtering of markers.
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 * @expose
 * @name markers[].categories
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the data item. The style class and inline style will override any other 
 * styling specified through the options. For tooltips and hover interactivity, it's recommended to also 
 * pass a representative color to the item color attribute.
 * @expose
 * @name markers[].svgClassName
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The marker color.
 * @expose
 * @name markers[].color
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The pixel height for this marker. Note that this option will be ignored if a value is provided 
 * to calculate marker sizes.
 * @expose
 * @name markers[].height
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The identifier for this data object.
 * @expose
 * @name markers[].id
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * Text used for the marker's label.
 * @expose
 * @name markers[].label
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * Determines the position relative to the marker that the label should be displayed.
 * @expose
 * @name markers[].labelPosition
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "top"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "center"
 * @default <code class="prettyprint">"center"</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style defining the label style for this marker.
 * @expose
 * @name markers[].labelStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The id of the area this marker is associated with.
 * @expose
 * @name markers[].location
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The marker opacity.
 * @expose
 * @name markers[].opacity
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">1.0</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The angle to rotate the marker in clockwise degrees around the center of the image.
 * @expose
 * @name markers[].rotation
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * Specifies whether or not the marker will be selectable.
 * @expose
 * @name markers[].selectable
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * Specifies the shape of a marker. Can take the name of a built-in shape or the svg path 
 * commands for a custom shape.
 * @expose
 * @name markers[].shape
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "square"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @ojvalue {string} "circle"
 * @default <code class="prettyprint">"circle"</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The text that displays in the marker's tooltip.
 * @expose
 * @name markers[].shortDesc
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * Specifies an URI specifying the location of the image resource to use for the marker instead of a built-in shape. 
 * The shape attribute is ignored if the source image is defined.
 * @expose
 * @name markers[].source
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * An optional URI specifying the location of the hover image resource. If not defined, the source image will be used.
 * @expose
 * @name markers[].sourceHover
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * An optional URI specifying the location of the selected image resource on hover. If not defined, the 
 * sourceSelected image will be used. If sourceSelected is not defined, then the source image will be used.
 * @expose
 * @name markers[].sourceHoverSelected
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * An optional URI specifying the location of the selected image. If not defined, the source image will be used.
 * @expose
 * @name markers[].sourceSelected
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style object defining the style of the data item. The style class and inline style will override any other 
 * styling specified through the options. For tooltips and hover interactivity, it's recommended to also 
 * pass a representative color to the item color attribute.
 * @expose
 * @name markers[].svgStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * A data value used to calculate the marker dimensions based on the range of all the data values and the 
 * element size. Markers with negative or zero data values will not be rendered. If specified, this value 
 * takes precedence over the width and height options.
 * @expose
 * @name markers[].value
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * The pixel width for this marker. Note that this option will be ignored if a value is provided to calculate marker sizes.
 * @expose
 * @name markers[].width
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#markers">markers</a> attribute for usage examples.</caption>
 */
/**
 * An array of objects with the following properties that define the data for links.
 * Also accepts a Promise where no data will be rendered if the Promise is rejected. Regardless of the
 * set value type, we will wrap and return a Promise when accessing the links property.
 * @expose
 * @name links
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">links</code> attribute specified:</caption>
 * &lt;oj-thematic-map links='[{"id": "l1", "startLocation": {"id": "m2"}, "endLocation": {"id": "m29"}}, 
 *                             ...
 *                             {"id": "l7", "startLocation": {"id": "m17"}, "endLocation": {"id": "m9"}}]'>
 * &lt;/oj-thematic-map>
 * 
 * &lt;oj-thematic-map links='[[markersPromise]]'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">links</code> 
 * property after initialization:</caption>
 * 
 * // Get all (The links getter always returns a Promise so there is no "get one" syntax)
 * var values = myThematicMap.links;
 * 
 * // Set all (There is no permissible "set one" syntax.)
 * myThematicMap.links=[{"id": "l1", "startLocation": {"id": "m2"}, "endLocation": {"id": "m29"}}, 
 *              ...
 *              {"id": "l7", "startLocation": {"id": "m17"}, "endLocation": {"id": "m9"}}];
 */
/**
 * An array of category strings corresponding to this link. This allows highlighting and filtering of links.
 * @expose
 * @name links[].categories
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style class to apply to the data item. The style class and inline style will override any other 
 * styling specified through the options. For tooltips and hover interactivity, it's recommended to 
 * also pass a representative color to the item color attribute.
 * @expose
 * @name links[].svgClassName
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * The link color.
 * @expose
 * @name links[].color
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * An object with the following key/value pairs used to determine the end point of the link:
 * <ul>
 *   <li>id: The marker or area id to be used as the end point.</li> 
 *   <li>location: The string location name of a built-in city or area.</li> 
 *   <li>x: The x coordinate which can represent latitude.</li> 
 *   <li>y: The y coordinate which can represent longitude.</li> 
 * </ul> 
 * @expose
 * @name links[].endLocation
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * The identifier for this data object.
 * @expose
 * @name links[].id
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * Specifies whether or not the area will be selectable.
 * @expose
 * @name links[].selectable
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * The text that displays in the area's tooltip.
 * @expose
 * @name links[].shortDesc
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * An object with the following key/value pairs used to determine the start point of the link:
 * <ul>
 *   <li>id: The marker or area id to be used as the start point.</li> 
 *   <li>location: The string location name of a built-in city or area.</li> 
 *   <li>x: The x coordinate which can represent latitude.</li> 
 *   <li>y: The y coordinate which can represent longitude.</li>
 *   </ul> 
 * @expose
 * @name links[].startLocation
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style object defining the style of the data item. The style class and inline style will override 
 * any other styling specified through the options. For tooltips and hover interactivity, 
 * it's recommended to also pass a representative color to the item color attribute.
 * @expose
 * @name links[].svgStyle
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * The link width in pixels.
 * @expose
 * @name links[].width
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {number}
 * @default <code class="prettyprint">2</code>
 * 
 * @example <caption>See the <a href="#links">links</a> attribute for usage examples.</caption>
 */
/**
 * Data visualizations require a press and hold delay before triggering tooltips and 
 * rollover effects on mobile devices to avoid interfering with page panning, but these 
 * hold delays can make applications seem slower and less responsive. For a better user 
 * experience, the application can remove the touch and hold delay when data visualizations 
 * are used within a non scrolling container or if there is sufficient space outside of the 
 * visualization for panning. If touchResponse is touchStart the element will instantly 
 * trigger the touch gesture and consume the page pan events if the element does not require 
 * an internal feature that requires a touch start gesture like panning or zooming. 
 * If touchResponse is auto, the element will behave like touchStart if it determines that 
 * it is not rendered within scrolling content and if element panning is not available for 
 * those elements that support the feature. 
 * @expose
 * @name touchResponse
 * @memberof oj.ojThematicMap
 * @instance
 * @type {string}
 * @ojvalue {string} "touchStart"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">touch-response</code> attribute specified:</caption>
 * &lt;oj-thematic-map touch-response='touchStart'>&lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">touchResponse</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myThematicMap.touchResponse;
 * 
 * // setter
 * myThematicMap.touchResponse="touchStart";
 */
/**
 * An object with the following properties, used to define a custom basemap.
 * @expose
 * @name mapProvider
 * @memberof oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the thematic map with the 
 * <code class="prettyprint">map-provider</code> attribute specified:</caption>
 * <!-- Using dot notation -->
 * &lt;oj-thematic-map map-provider.geo='[[geoJsonObj]]'
 *   map-provider.properties-keys='{"id": "country", "shortLabel": "iso_a3", "longLabel": "country"}'>
 * &lt;/oj-thematic-map>
 * 
 * &lt;oj-thematic-map mapProvider='[[{"geo": geoJsonObj, 
 *                                     "propertiesKeys": {"id": "country", 
 *                                                        "shortLabel": "iso_a3", 
 *                                                        "longLabel": "country"}]]'>
 * &lt;/oj-thematic-map>
 * 
 * @example <caption>Get or set the <code class="prettyprint">mapProvider</code> 
 * property after initialization:</caption>
 * // Get one
 * var value = myThematicMap.mapProvider.geo;
 * 
 * // Get all
 * var values = myThematicMap.mapProvider;
 *
 * // Set one, leaving the others intact. Always use the setProperty API for 
 * // subproperties rather than setting a subproperty directly.
 * myThematicMap.setProperty('mapProvider.geo', geoJsonObj);
 * 
 * // Set all. Must list every resource key, as those not listed are lost.
 * myThematicMap.mapProvider={'geo': geoJsonObj};
 */
/**
 * The GeoJSON object containing custom area coordinates. Only GeoJSON objects of "type" Feature or 
 * FeatureCollection and Feature "geometry" objects of "type" Polygon or MultiPolygon are currently 
 * supported. Each Feature object will contain a thematic map area and each Feature's "properties" 
 * object will at a minimum need to contain a key, which can be defined in the propertiesKeys object, 
 * that will be used as the ID of the area. 
 * @expose
 * @name mapProvider.geo
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#mapProvider">mapProvider</a> attribute for usage examples.</caption>
 */
/**
 * The object specifying the GeoJSON Feature "properties" object keys to use for the custom 
 * area id, short label, and long label mappings.
 * <ul>
 *   <li>id: The required name of the "properties" key to use as the location id that will map a data item to a map area.</li> 
 *   <li>shortLabel: The optional name of the "properties" key to use for rendering area labels when labelType is set to "short".</li> 
 *   <li>longLabel: The optional name of the "properties" key to use for rendering area labels when labelType is set to "long".</li>
 * </ul> 
 * @expose
 * @name mapProvider.propertiesKeys
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#mapProvider">mapProvider</a> attribute for usage examples.</caption>
 */


// SubId Locators **************************************************************

/**
 * <p>Sub-ID for an area in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the area within the specified data layer.
 *
 * @ojsubid oj-thematicmap-area
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the first area in the collection (e.g. areas, markers, links) with id 'states':</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-area', 'dataLayer': 'states', 'index' : 0});
 */

/**
 * <p>Sub-ID for a marker in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the marker within the specified data layer.
 *
 * @ojsubid oj-thematicmap-marker
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the first marker in the collection (e.g. areas, markers, links) with id 'states':</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-marker', 'dataLayer': 'states', 'index' : 0});
 */

/**
 * <p>Sub-ID for a link in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the link within the specified data layer.
 *
 * @ojsubid oj-thematicmap-link
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the first link in the collection (e.g. areas, markers, links) with id 'states':</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-link', 'dataLayer': 'states', 'index' : 0});
 */

/**
 * <p>Sub-ID for the the thematic map tooltip.</p>
 *
 * @ojsubid oj-thematicmap-tooltip
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the tooltip object of the thematic map, if displayed:</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-tooltip'});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for an area in the specified data layer.</p>
 *
 * @property {number} index The index of the area within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-area
 * @memberof oj.ojThematicMap
 */

/**
 * <p>Context for a marker in the specified data layer.</p>
 * 
 * @property {number} index The index of the marker within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-marker
 * @memberof oj.ojThematicMap
 */

/**
 * <p>Context for a link in the specified data layer.</p>
 * 
 * @property {number} index The index of the link within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-link
 * @memberof oj.ojThematicMap
 */


/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojThematicMapMeta = {
  "properties": {
    "animationDuration": {
      "type": "number"
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues":  ["auto", "none"]
    },
    "areas": {
      "type": "Array<object>|Promise"
    },
    "focusRenderer": {},
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightMatch": {
      "type": "string"
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues":  ["dim", "none"]
    },
    "hoverRenderer": {},
    "initialZooming": {
      "type": "string",
      "enumValues":  ["auto", "none"]
    },
    "isolatedItem": {
      "type": "string"
    },
    "labelDisplay": {
      "type": "string",
      "enumValues":  ["auto", "on", "off"]
    },
    "labelType": {
      "type": "string",
      "enumValues":  ["short", "long"]
    },
    "links": {
      "type": "Array<object>|Promise"
    },
    "mapProvider": {
      "type": "object",
      "properties": {
        "geo": {
          "type": "object"
        },
        "propertiesKeys": {
          "type": "object"
        }
      }
    },
    "markers": {
      "type": "Array<object>|Promise"
    },
    "markerZoomBehavior": {
      "type": "string",
      "enumValues":  ["fixed", "zoom"]
    },
    "maxZoom": {
      "type": "number"
    },
    "panning": {
      "type": "string",
      "enumValues":  ["none", "auto"]
    },
    "renderer": {},
    "selection": {
      "type": "Array<string>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues":  ["none", "single", "multiple"]
    },
    "selectionRenderer": {},
    "styleDefaults": {
      "type": "object",
      "properties": {
        "areaSvgStyle": {
          "type": "object"
        },
        "dataAreaDefaults": {
          "type": "object",
          "properties": {
            "dataAreaDefaults": {
              "borderColor": {
                "type": "string"
              },
              "hoverColor": {
                "type": "string"
              },
              "selectedInnerColor": {
                "type": "string"
              },
              "selectedOuterColor": {
                "type": "string"
              }
            }
          }
        },
        "dataMarkerDefaults": {
          "type": "object",
          "properties": {
            "dataMarkerDefaults": {
              "borderColor": {
                "type": "string"
              },
              "borderStyle": {
                "type": "string",
                "enumValues":  ["solid", "none"]
              },
              "borderWidth": {
                "type": "number"
              },
              "color": {
                "type": "string"
              },
              "height": {
                "type": "number"
              },
              "labelStyle": {
                "type": "string"
              },
              "opacity": {
                "type": "number"
              },
              "shape": {
                "type": "string"
              },
              "width": {
                "type": "number"
              }
            }
          }
        },
        "hoverBehaviorDelay": {
          "type": "number"
        },
        "labelStyle": {
          "type": "string"
        },
        "linkDefaults": {
          "type": "object",
          "properties": {
            "linkDefaults": {
              "color": {
                "type": "string"
              },
              "width": {
                "type": "number"
              }
            }
          }
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "tooltipDisplay": {
      "type": "string",
      "enumValues":  ["auto", "shortDesc", "labelAndShortDesc", "none"]
    },
    "touchResponse": {
      "type": "string",
      "enumValues":  ["auto", "touchStart"]
    },
    "translations": {
      "properties": {
        "componentName": {
          "type": "string"
        }
      }
    },
    "zooming": {
      "type": "string",
      "enumValues":  ["none", "auto"]
    }
  },
  "methods": {
    "getArea": {},
    "getContextByNode": {},
    "getLink": {},
    "getMarker": {}
  },
  "extension": {
    _WIDGET_NAME: "ojThematicMap"
  }
};
oj.CustomElementBridge.registerMetadata('oj-thematic-map', 'dvtBaseComponent', ojThematicMapMeta);
// Get the combined meta of superclass which contains a shape parse function generator
var dvtMeta = oj.CustomElementBridge.getMetadata('oj-thematic-map');
oj.CustomElementBridge.register('oj-thematic-map', {
  'metadata': dvtMeta,
  'parseFunction': dvtMeta['extension']._DVT_PARSE_FUNC({'style-defaults.data-marker-defaults.shape': true})
});
})();
});
