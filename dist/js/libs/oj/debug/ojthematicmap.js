/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
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
 *
 * @classdesc
 * <h3 id="thematicMapOverview-section">
 *   JET Thematic Map Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#thematicMapOverview-section"></a>
 * </h3>
 *
 * <p>Thematic maps are used to display data corresponding to geographic locations
 * or regions, such as election data for a state or sales by territory for a product. 
 * Applications are required to supply a basemap and an area layer for a valid Thematic Map.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojThematicMap',
 *   basemap: 'usa',
 *   areaLayers: [{
 *     layer: 'states',
 *     areaDataLayer: {
 *       areas: [{color:'#003366', location:'FL'},
 *               {color:'#CC3300', location:'TX'},
 *               {color:'#99CC33', location:'CA'}]
 *     }
 *   }]
 * }"/>
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
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets. Alternate visualizations should
 *    be considered if identifying data changes is important, since all data items will generally move and resize on any data
 *    change.
 * </p>
 *
 * <h4>Style Attributes</h4>
 * <p>Use the highest level options property available. For example, consider using  attributes on
 *    <code class="prettyprint">styleDefaults.dataAreaDefaults</code> or
 *    <code class="prettyprint">styleDefaults.dataMarkerDefaults</code>, instead of attributes on the individual items. The component can
 *    take advantage of these higher level attributes to apply the style properties on containers, saving expensive DOM
 *    calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 *
 * <h3 id="basemap-section">
 *   Built-in Maps
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#basemap-section"></a>
 * </h3>
 *
 * <p>
 *  Thematic map has several built-in maps which can be chosen using the
 *  [basemap]{@link oj.ojThematicMap#basemap} and [layer]{@link oj.ojThematicMap#areaLayers.layer}
 *  attributes in the options object.
 * </p>
 *
 * <p>
 *  To use one of the built-in maps, set the [basemap]{@link oj.ojThematicMap#basemap}
 *  attribute to one of the supported values:
 *  <ul>
 *    <li>africa</li>
 *    <li>asia</li>
 *    <li>australia</li>
 *    <li>europe</li>
 *    <li>northAmerica</li>
 *    <li>southAmerica</li>
 *    <li>usa</li>
 *    <li>world</li>
 *  </ul>
 * </p>
 *
 * <p>
 *  Create an area layer object and pass it in an array to the
 *  [areaLayers]{@link oj.ojThematicMap#areaLayers} attribute and set the area layer object's
 *  [layer]{@link oj.ojThematicMap#areaLayers.layer} attribute to one of the
 *  supported values for that basemap.
 * </p>
 * <p>Applications are responsible for loading the necessary maps for a particular ojThematicMap component.
 *  This can be done via RequireJS with the following module syntax 'basemaps/ojthematicmap-[basemap]-[layer]',
 *  e.g. 'basemaps/ojthematicmap-world-countries'.
 * </p>
 *  <ul>
 *    <li>usa
 *    <ul>
 *      <li>states</li>
 *      <li>counties</li>
 *    </ul>
 *  </li>
 *  <li>africa, asia, australia, europe, northAmerica, southAmerica, world
 *    <ul>
 *      <li>countries</li>
 *      <li>continents (world basemap)</li>
 *      <li>continent (all other basemaps)</li>
 *    </ul>
 *  </li>
 * </ul>
 * </p>
 *
 * <p>
 *  Each built-in map layer has a list of supported location IDs that should be
 *  set as the value for an [area]{@link oj.ojThematicMap#areaLayers.areaDataLayer.areas} or
 *  [marker]{@link oj.ojThematicMap#areaLayers.areaDataLayer.markers} object's
 *  [location]{@link oj.ojThematicMap#areaLayers.areaDataLayer.areas.location} attribute.
 * </p>
 * <p>
 *  Continent basemaps support the following IDs:
 *  <ul>
 *    <li>Africa: AF</li>
 *    <li>Asia: AS</li>
 *    <li>Australia: AU</li>
 *    <li>Europe: EU</li>
 *    <li>North America: NA</li>
 *    <li>South America: SA</li>
 *  </ul>
 * </p>
 * <p>
 *  All other basemaps support the following IDs. See the Thematic Map <a href="../uiComponents-thematicMap-basemaps.html">Basemap Demo</a> for an example.
 *  <ul>
 *    <li><a href="dvt/thematicMap/africa-countries-ids.json">Africa Countries</a></li>
 *    <li><a href="dvt/thematicMap/asia-countries-ids.json">Asia Countries</a></li>
 *    <li><a href="dvt/thematicMap/australia-countries-ids.json">Australia Countries</a></li>
 *    <li><a href="dvt/thematicMap/europe-countries-ids.json">Europe Countries</a></li>
 *    <li><a href="dvt/thematicMap/northAmerica-countries-ids.json">North America Countries</a></li>
 *    <li><a href="dvt/thematicMap/southAmerica-countries-ids.json">South America Countries</a></li>
 *    <li><a href="dvt/thematicMap/usa-counties-ids.json">USA Counties</a></li>
 *    <li><a href="dvt/thematicMap/usa-states-ids.json">USA States</a></li>
 *    <li><a href="dvt/thematicMap/world-countries-ids.json">World Countries</a></li>
 *  </ul>
 * </p>
 *
 * <h3 id="cities-section">
 *   Built-in Cities
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#cities-section"></a>
 * </h3>
 *
 * <p>
 *  Thematic map also supports a set of built-in cities for each basemap that can
 *  be used in a marker object's [location]{@link oj.ojThematicMap#pointDataLayers.markers.location}
 *  attribute instead of passing in longitude and latitude coordinates.
 *  See the Thematic Map <a href="../uiComponents-thematicMap-points.html">Points Demo</a> for an example.
 * </p>
 * <p>Applications are responsible for loading the required cities basemap if needed.
 *  This can be done via RequireJS with the following module syntax 'basemaps/ojthematicmap-[basemap]-cities',
 *  e.g. 'basemaps/ojthematicmap-world-cities'.
 * </p>
 * <ul>
 *   <li><a href="dvt/thematicMap/africa-cities-ids.json">Africa Cities</a></li>
 *   <li><a href="dvt/thematicMap/asia-cities-ids.json">Asia Cities</a></li>
 *  <li><a href="dvt/thematicMap/australia-cities-ids.json">Australia Cities</a></li>
 *   <li><a href="dvt/thematicMap/europe-cities-ids.json">Europe Cities</a></li>
 *   <li><a href="dvt/thematicMap/northAmerica-cities-ids.json">North America Cities</a></li>
 *   <li><a href="dvt/thematicMap/southAmerica-cities-ids.json">South America Cities</a></li>
 *   <li><a href="dvt/thematicMap/usa-cities-ids.json">USA Cities</a></li>
 *   <li><a href="dvt/thematicMap/world-cities-ids.json">World Cities</a></li>
 * </ul>
 *
 * <h3 id="mapprovider-section">
 *   Custom Maps
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#mapprovider-section"></a>
 * </h3>
 *
 * <p>
 *   Instead of a built-in map, an application can specify a custom map using GeoJSON formatted geo data with
 *   the [mapProvider]{@link oj.ojThematicMap#mapProvider} option. When using a custom map, the
 *   [basemap]{@link oj.ojThematicMap#basemap} and [layer]{@link oj.ojThematicMap#areaLayers[].layer} options are still required.
 * </p>
 * <p>
 *   Currently only GeoJSON objects of "type" Feature or FeatureCollection are supported. Each Feature object contains
 *   the information to render a map area including the area id, coordinates, and optional short and long labels. Only Feature
 *   "geometry" objects of "type" Polygon and MutliPolgyon will be used for defining area boundaries.  All other "type" values
 *   will be skipped.  The Feature "properties" object is where the Thematic Map component will look up area info like id, short
 *   label, and long label using the key mappings provided in the [propertiesKeys]{@link oj.ojThematicMap#mapProvider.propertiesKeys} option.
 *   See the Thematic Map <a href="../uiComponents-thematicMap-mapProvider.html">Map Provider Demo</a> for an example.
 * </p>
 * <p>
 *   If longitude/latitude coordinate data need to be rendered, the application should using a projection library like Proj4JS to
 *   project the coordinates to the map projection.  The Thematic Map component will not project x/y values passed in to the data markers
 *   option for custom maps.
 * </p
 *
 * @desc Creates a JET Thematic Map.
 * @example <caption>Initialize the Thematic Map with no options specified:</caption>
 * $(".selector").ojThematicMap();
 *
 * @example <caption>Initialize the Thematic Map with some options:</caption>
 * $(".selector").ojThematicMap({basemap: 'usa'});
 *
 * @example <caption>Initialize the Thematic Map via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojThematicMap'}">
 */
oj.__registerWidget('oj.ojThematicMap', $['oj']['dvtBaseComponent'],
  {
    widgetEventPrefix: "oj",
    options: {
      /**
       * Triggered after thematic map resources are loaded and the component has rendered.
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">load</code> callback specified:</caption>
       * $(".selector").ojThematicMap({
       *   "load": function(){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojload</code> event:</caption>
       * $(".selector").on("ojload", function(){});
       *
       * @expose
       * @event
       * @memberof oj.ojThematicMap
       * @deprecated Use the  <a href="#whenReady">whenReady</a> method instead
       * @instance
       */
      load: null
    },
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

    //** @inheritdoc */
    _ComponentCreate : function() {
      this._super();
      this._checkBasemaps = [];
      this._initiallyRendered = false;
      this._dataLayersToUpdate = [];
    },

    //** @inheritdoc */
    _CreateDvtComponent: function(context, callback, callbackObj) {
      return dvt.ThematicMap.newInstance(context, callback, callbackObj);
    },

    //** @inheritdoc */
    _ConvertLocatorToSubId : function(locator) {
      var subId = locator['subId'];

      // Convert the supported locators
      if(subId == 'oj-thematicmap-area') {
        // dataLayerId:area[index]
        subId = locator['dataLayer'] + ':area[' + locator['index'] + ']';
      }
      else if(subId == 'oj-thematicmap-marker') {
        // dataLayerId:marker[index]
        subId = locator['dataLayer'] + ':marker[' + locator['index'] + ']';
      }
      else if(subId == 'oj-thematicmap-link') {
        // dataLayerId:link[index]
        subId = locator['dataLayer'] + ':link[' + locator['index'] + ']';
      }
      else if(subId == 'oj-thematicmap-tooltip') {
        subId = 'tooltip';
      }
      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    },

    //** @inheritdoc */
    _ConvertSubIdToLocator : function(subId) {
      var locator = {};

      if(subId.indexOf(':area') > 0) {
        // dataLayerId:area[index]
        locator['subId'] = 'oj-thematicmap-area';
        locator['dataLayer'] = subId.substring(0, subId.indexOf(':'));
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId.indexOf(':marker') > 0) {
        // dataLayerId:marker[index]
        locator['subId'] = 'oj-thematicmap-marker';
        locator['dataLayer'] = subId.substring(0, subId.indexOf(':'));
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId.indexOf(':link') > 0) {
        // dataLayerId:link[index]
        locator['subId'] = 'oj-thematicmap-link';
        locator['dataLayer'] = subId.substring(0, subId.indexOf(':'));
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId == 'tooltip') {
        locator['subId'] = 'oj-thematicmap-tooltip';
      }

      return locator;
    },

    //** @inheritdoc */
    _GetComponentStyleClasses: function() {
      var styleClasses = this._super();
      styleClasses.push('oj-thematicmap');
      return styleClasses;
    },

    //** @inheritdoc */
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

    //** @inheritdoc */
    _GetEventTypes : function() {
      return ['load', 'optionChange'];
    },


    //** @inheritdoc */
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


    //** @inheritdoc */
    _ProcessOptions: function() {
      this._super();

      // wrap tooltip function in try catch
      var tooltipObj = this.options['tooltip'];
      var tooltipFun = tooltipObj ? tooltipObj['renderer'] : null;
      if (tooltipFun) {
        this.options['_tooltip'] = {
          'renderer': function(context) {
            var defaultTooltip = context['tooltip'];
            try {
              var tooltip = tooltipFun(context);
              return tooltip || defaultTooltip;
            } catch (error) {
              oj.Logger.warn("Showing default tooltip. " + error);
              return defaultTooltip;
            }
          },
          '_templateCleanup': tooltipObj['_templateCleanup']
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

    //** @inheritdoc */
    _Render: function() {
      this._NotReady();
      
      var areaLayers = this.options['areaLayers'];
      // Don't render unless a basemap and area layer are at least specified
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

      // parse the top level selection map and populate data layer selection option
      this._updateDataLayerSelection();

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

      // Send event once basemaps have been loaded and rendering is complete
      this._trigger('load', null, null);
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
         'component': oj.Components.getWidgetConstructor(thisRef.element),
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
       return thisRef._FixRendererContext(context);
     }
     return contextHandlerFunc;
    },

    /**
     * Renders the default hover effect for a data item.
     * @param {Object} context A context object with the following properties:
     * <ul>
     *  <li>{Function} component: A reference to the Thematic Map widget constructor so non public methods cannot be called.</li>
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
     *  <li>{Function} component: A reference to the Thematic Map widget constructor so non public methods cannot be called.</li>
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
     *  <li>{Function} component: A reference to the Thematic Map widget constructor so non public methods cannot be called.</li>
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
        // Check to see if MapProvider
        var mapProvider = this.options['mapProvider'];
        if (mapProvider) {
          oj.MapProviderUtils.geoJsonToBasemap(basemap, layer, mapProvider);
        } else {
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

    //** @inheritdoc */
    _HandleEvent: function(event) {
      var type = event['type'];
      if (type === 'selection') {
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
      }
      else {
        this._super(event);
      }
    },

    //** @inheritdoc */
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
     * @memberof oj.ojThematicMap
     * @instance
     * @private
     */
    _updateDataLayerSelection: function() {
      var selection = this.options['selection'];
      if (selection) {
        var pdls = this.options['pointDataLayers'];
        if (pdls) {
          for (var i = 0; i < pdls.length; i++) {
            if (selection[pdls[i]['id']])
              pdls[i]['selection'] = selection[pdls[i]['id']];
          }
        }

        var als = this.options['areaLayers'];
        if (als) {
          for (var i = 0; i < als.length; i++) {
            // JET Thematic Map does not support nesting of point data layers within an area layer
            var adl = als[i]['areaDataLayer'];
            if (adl && selection[adl['id']])
              adl['selection'] = selection[adl['id']];
          }
        }
      }
    },

    /**
     * Returns an object with the following properties for automation testing verification of the area with
     * the specified data layer id and index.
     *
     * @param {string} dataLayerId
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
    getArea : function(dataLayerId, index) {
      return this._component.getAutomation().getData(dataLayerId, 'area', index);
    },

    /**
     * Returns an object with the following properties for automation testing verification of the marker with
     * the specified data layer id and index.
     *
     * @param {string} dataLayerId
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
    getMarker : function(dataLayerId, index) {
      return this._component.getAutomation().getData(dataLayerId, 'marker', index);
    },

    /**
     * Returns an object with the following properties for automation testing verification of the link with
     * the specified data layer id and index.
     *
     * @param {string} dataLayerId
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
    getLink : function(dataLayerId, index) {
      return this._component.getAutomation().getData(dataLayerId, 'link', index);
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
      if (context && context['subId'] !== 'oj-thematicmap-tooltip')
        return context;

      return null;
    },

    //** @inheritdoc */
    _GetComponentDeferredDataPaths : function() {
      return {
        'areaLayers': ['areaDataLayer/areas', 'areaDataLayer/markers'],
        'pointDataLayers': ['markers', 'links']
      };
    },

    //** @inheritdoc */
    _GetComponentNoClonePaths : function() {
      return {'areaLayers': {'areaDataLayer': {'areas': true, 'markers': true}}, 'pointDataLayers': {'markers': true, 'links': true}};
    },

    //** @inheritdoc */
    _GetDataContext : function(options) {
      // Need to use this.options instead of options because the options
      // passed in will actually be an areaLayer or pointDataLayer options object
      var basemap = this.options['basemap'];
      var layer = options['layer'] ? options['layer'] : 'cities';
      return {'basemap': basemap, 'layer' : layer, 'ids': dvt.DvtBaseMapManager.getLayerIds(basemap, layer)};
    }
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
 *       <td rowspan="3">Component</td>
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
 *     <td>Move focus to map and then to next component.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + Tab</kbd></td>
 *     <td>Move focus to map and then to previous component.</td>
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
 * var nodes = $( ".selector" ).ojThematicMap( "getNodeBySubId", {'subId': 'oj-thematicmap-area', 'dataLayer': 'states', 'index' : 0} );
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
 * var nodes = $( ".selector" ).ojThematicMap( "getNodeBySubId", {'subId': 'oj-thematicmap-marker', 'dataLayer': 'states', 'index' : 0} );
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
 * var nodes = $( ".selector" ).ojThematicMap( "getNodeBySubId", {'subId': 'oj-thematicmap-link', 'dataLayer': 'states', 'index' : 0} );
 */

/**
 * <p>Sub-ID for the the thematic map tooltip.</p>
 *
 * @ojsubid oj-thematicmap-tooltip
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the tooltip object of the thematic map, if displayed:</caption>
 * var nodes = $( ".selector" ).ojThematicMap( "getNodeBySubId", {'subId': 'oj-thematicmap-tooltip'} );
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for an area in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the area within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-area
 * @memberof oj.ojThematicMap
 */

/**
 * <p>Context for a marker in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the marker within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-marker
 * @memberof oj.ojThematicMap
 */

/**
 * <p>Context for a link in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the link within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-link
 * @memberof oj.ojThematicMap
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *   <li>color: The color of the hovered item or null if the hovered item if not associated with any data.</li> 
 *   <li>component: The widget constructor for the thematic map. The 'component' is bound to the associated jQuery element so can be called directly as a function.</li> 
 *   <li>data: The data object of the hovered item or null if the hovered item if not associated with any data.</li> 
 *   <li>id: The id of the hovered item or null if the hovered item if not associated with any data.</li> 
 *   <li>label: The data label of the hovered item or null if the hovered item if not associated with any data.</li> 
 *   <li>location: The location id of the hovered item which can be null if x/y are set instead.</li> 
 *   <li>locationName: The location name of the hovered item if location id is set.</li> 
 *   <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li> 
 *   <li>tooltip: The default tooltip string constructed by the component if any.</li> 
 *   <li>x: The x coordinate of the hovered item which can be null if location is set instead.</li> 
 *   <li>y: The y coordinate of the hovered item which can be null if location is set instead.</li>
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */

/**
 * The knockout template used for stamping other data visualizations within a data layer. Only a single SVG element or DVT is supported 
 * when using knockout templates at this time. The markers.location or markers.x and markers.y options will be 
 * used to determine the stamp placement within the Thematic Map. No other existing marker options will be used
 * by the Thematic Map when a knockout template is provided.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option.
 * 
 * @ojbindingonly
 * @name areaLayers.areaDataLayer.template
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */

/**
 * The knockout template used for stamping other data visualizations within a data layer. Only a single SVG element or DVT is supported 
 * when using knockout templates at this time. The markers.location or markers.x and markers.y options will be 
 * used to determine the stamp placement within the Thematic Map. No other existing marker options will be used
 * by the Thematic Map when a knockout template is provided.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option.
 * 
 * @ojbindingonly
 * @name pointDataLayers.template
 * @memberof! oj.ojThematicMap
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */

/**
 * Thematic Map MapProvider utility class for converting a GeoJSON object into a basemap.
 * @ignore
 * @since 2.1.0
 */
oj.MapProviderUtils = {};

oj.MapProviderUtils._MANAGER = 'DvtBaseMapManager';
oj.MapProviderUtils._UNPROCESSED = '_UNPROCESSED_MAPS';
// GeoJSON keys
oj.MapProviderUtils._TYPE = 'type';
oj.MapProviderUtils._GEOMETRY = 'geometry';
oj.MapProviderUtils._COORDINATES = 'coordinates';
oj.MapProviderUtils._FEATURES = 'features';
oj.MapProviderUtils._PROPERTIES = 'properties';
// GeoJSON Types
oj.MapProviderUtils._TYPE_FEATURE_COLLECTION = 'FeatureCollection';
oj.MapProviderUtils._TYPE_GEOMETRY_COLLECTION = 'GeometryCollection';
oj.MapProviderUtils._TYPE_FEATURE = 'Feature';
oj.MapProviderUtils._TYPE_POLYGON = 'Polygon';
oj.MapProviderUtils._TYPE_MULTI_POLYGON = 'MultiPolygon';
// Our internal properties keys required for determining an area's id, shortLabel, and longLabel
oj.MapProviderUtils._ID = 'id';
oj.MapProviderUtils._SHORT_LABEL = 'shortLabel';
oj.MapProviderUtils._LONG_LABEL = 'longLabel';

/**
 * Converts a GeoJSON object to a basemap layer
 * @param {string} basemap The name of the basemap
 * @param {string} layer The name of the layer
 * @param  {Object} mapProvider The mapProvider object
 * @ignore
 */
oj.MapProviderUtils.geoJsonToBasemap = function(basemap, layer, mapProvider) {
  var labels = {};
  var areas = {};
  var geoJson = mapProvider['geo'];
  var keys = mapProvider['propertiesKeys'] || {};

  // Determine the GeoJSON top-level type
  var type = geoJson[oj.MapProviderUtils._TYPE];
  // Only a Feature will have a properties object which gives us a place to look up
  // an area's id, shortLabel, and longLabel.
  if (type === oj.MapProviderUtils._TYPE_FEATURE_COLLECTION) {
    var features = geoJson[oj.MapProviderUtils._FEATURES];
    // Check each feature for an ID and skip if not provided
    features.forEach(function(feature) {
      oj.MapProviderUtils.parseFeature(feature, keys, areas, labels);
    });
  }
  else if (type === oj.MapProviderUtils._TYPE_FEATURE) {
    oj.MapProviderUtils.parseFeature(geoJson, keys, areas, labels);
  }
  else {
    oj.Logger.error('GeoJSON type of ' + type + ' is not supported. Only Feature and FeatureCollection types are supported.');
    return;
  }
  
  // Don't try and render if map didn't contain any valid areas
  var numAreas = Object.keys(areas).length;
  if (numAreas === 0) {
    oj.Logger.error('No valid Features found in GeoJSON.');      return;
  }

  // Register the basemap with DvtBaseMapManager
  if (!window[oj.MapProviderUtils._MANAGER ]) {
    window[oj.MapProviderUtils._MANAGER] = {};
    window[oj.MapProviderUtils._MANAGER ][oj.MapProviderUtils._UNPROCESSED] = [[], [], []];
  }
  window[oj.MapProviderUtils._MANAGER ][oj.MapProviderUtils._UNPROCESSED][0].push([basemap, layer, labels, areas, null, null, 0]);
};

/**
 * Parses a GeoJSON Feature object and translates it to a Thematic Map area.
 * @param  {Object} feature The Feature object
 * @param  {Object} keys The object containing the properties keys mapping
 * @param  {Object} areas   The areas map of area id to svg paths
 * @param  {Object} labels  The labels map of area id to label info
 */
oj.MapProviderUtils.parseFeature = function(feature, keys, areas, labels) {
  // A Feature has 'geometry' and 'properties' keys and maps to an area.
  // Do not process a Feature if it does not have an id or is not a supported geometry type.
  var props = feature[oj.MapProviderUtils._PROPERTIES];
  var geom = feature[oj.MapProviderUtils._GEOMETRY];
  if (!oj.MapProviderUtils.isSupportedGeometry(geom)) {
    oj.Logger.warn("A geometry of type " + geom[oj.MapProviderUtils._TYPE] + " is not supported and will be skipped.");
    return;
  }

  var id = props[keys[oj.MapProviderUtils._ID]];
  if (!id) {
    oj.Logger.warn("No 'id' value found in the mapProvider.propertiesKey object. " +
      "A Feature's 'properties' object must have an id in the field specified by the mapProvider.propertiesKey.id value.");
    return;
  }

  // Generate label info
  var shortLabel = props[keys[oj.MapProviderUtils._SHORT_LABEL]];
  var longLabel = props[keys[oj.MapProviderUtils._LONG_LABEL]];
  if (shortLabel || longLabel) {
    labels[id] = [shortLabel, longLabel];
  }

  // Generate area svg path
  areas[id] = oj.MapProviderUtils.geomToPath(geom);
};

/**
 * Returns true if the geometry object is a supported type
 * @param  {Object}  geom The geometry object
 * @return {boolean}
 * @ignore
 */
oj.MapProviderUtils.isSupportedGeometry = function(geom) {
  var type = geom[oj.MapProviderUtils._TYPE];
  if (type === oj.MapProviderUtils._TYPE_POLYGON || type === oj.MapProviderUtils._TYPE_MULTI_POLYGON)
    return true;
  return false;
};

/**
 * Converts a GeoJSON Polygon or MultiPolygon geometry to a string of relative path commands.
 * Only Polygon and MultiPolygon geometry types are currently supported.
 * @param {Array} geom The GeoJSON geometry to convert
 * @return {string}
 * @ignore
 */
oj.MapProviderUtils.geomToPath = function(geom) {
  var path = '';
  var type = geom[oj.MapProviderUtils._TYPE];
  var coords = geom[oj.MapProviderUtils._COORDINATES];
  if (type === oj.MapProviderUtils._TYPE_POLYGON) {
    path = oj.MapProviderUtils.polygonToPath(coords);
  }
  else if (type === oj.MapProviderUtils._TYPE_MULTI_POLYGON) {
    // The coordinates of a MultiPolygon are an array of Polygon coordinate arrays.
    coords.forEach(function(polygonCoords) {
      path += oj.MapProviderUtils.polygonToPath(polygonCoords);
    });
  }
  return path;
};

/**
 * Converts a GeoJSON Polygon coordinate array to a relative SVG path.
 * @param  {Array} coords The coordinates array to convert
 * @return {string}
 */
oj.MapProviderUtils.polygonToPath = function(coords) {
  var path = '';
  // The coordinates of a Polygon are an array of LinearRing coordinate arrays
  // where the first element in the array represents the exterior ring and any subsequent 
  // elements represent interior rings (or holes) e.g. 
  // [ 
  //   [[x1, y1], ...], (exterior ring)
  //   [[x2, y2], ...]] (interior ring)
  // ].
  coords.forEach(function(linearArrayCoords) {
    path += oj.MapProviderUtils.linearRingToPath(linearArrayCoords);
  });
  return path;
};

/**
 * Converts a GeoJSON LinearRing coordinate array to a relative SVG path. 
 * @param  {Array} coords The coordinates array to convert
 * @return {string}
 * @ignore
 */
oj.MapProviderUtils.linearRingToPath = function(coords) {
  // [ [100.0, 0.0], [101.0, 1.0] ]
  var path, prevX, prevY;
  var prevCmd = 'M';
  if (coords) {
    coords.forEach(function(coord) {
      var x = coord[0];
      var y = -coord[1]; // flip for svg because 0,0 is top left instead of bottom left
      if (prevCmd === 'M') {
        prevX = x;
        prevY = y;
        prevCmd = 'x'; // reset the previous command
        path = 'M' + x + ' ' + y;
        return;
      }

      var relX = x - prevX;
      var relY = y - prevY;
      // check to see if we can convert a l to a h/v command
      if (prevCmd == 'l') {
        if (prevX == x) { // vertical line
          prevCmd = 'v';
          prevY = y;
          path = path + prevCmd + relY;
          return;
        } else if (prevY == y) { // horizontal line
          prevCmd = 'h';
          prevX = x;
          path = path + prevCmd + relX;
          return;
        }
        path = path + ' ' + relX + ' ' + relY;
      } else {
        prevCmd = 'l';
        path = path + 'l' + relX + ' ' + relY;
      }
      prevX = x;
      prevY = y;
    });
  }
  return path + 'Z';
};


/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojThematicMapMeta = {
  "properties": {
    "animationDuration": {
      "type": "number|string"
    },
    "animationOnDisplay": {
      "type": "string"
    },
    "animationOnMapChange": {
      "type": "string"
    },
    "areaLayers": {
      "type": "Array<object>"
    },
    "basemap": {
      "type": "string"
    },
    "hiddenCategories": {
      "type": "Array<string>"
    },
    "highlightedCategories": {
      "type": "Array<string>"
    },
    "highlightMatch": {
      "type": "string"
    },
    "hoverBehavior": {
      "type": "string"
    },
    "initialZooming": {
      "type": "string"
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
    "markerZoomBehavior": {
      "type": "string"
    },
    "maxZoom": {
      "type": "number"
    },
    "panning": {
      "type": "string"
    },
    "pointDataLayers": {
      "type": "Array<object>"
    },
    "selection": {
      "type": "object"
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "areaStyle": {
          "type": "string|object"
        },
        "dataAreaDefaults": {
          "type": "object",
          "properties": {
            "dataAreaDefaults": {
              "borderColor": {
                "type": "string"
              },
              "drilledInnerColor": {
                "type": "string"
              },
              "drilledOuterColor": {
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
                "type": "string"
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
          "type": "number|string"
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
      "type": "string"
    },
    "touchResponse": {
      "type": "string"
    },
    "translations": {
      "properties": {
        "componentName": {
          "type": "string"
        }
      }
    },
    "zooming": {
      "type": "string"
    }
  },
  "methods": {
    "getArea": {},
    "getContextByNode": {},
    "getLink": {},
    "getMarker": {},
    "renderDefaultFocus": {},
    "renderDefaultHover": {},
    "renderDefaultSelection": {}
  },
  "extension": {
    _WIDGET_NAME: "ojThematicMap"
  }
};
oj.CustomElementBridge.registerMetadata('oj-thematic-map', 'dvtBaseComponent', ojThematicMapMeta);
oj.CustomElementBridge.register('oj-thematic-map', {'metadata': oj.CustomElementBridge.getMetadata('oj-thematic-map')});
})();
});
