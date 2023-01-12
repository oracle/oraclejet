/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojdatasource-common'], function(oj)
{
  "use strict";



// /////////// JsonDiagramDataSource //////////////////

/**
 * @export
 * @class oj.JsonDiagramDataSource
 * @extends oj.DiagramDataSource
 * @ojtsignore
 * @classdesc JSON implementation of the oj.DiagramDataSource
 * @param {Object} data JSON data object with following properties:
 * <table>
 * <tbody>
 * <tr><td><b>nodes</b></td><td>An optional array of nodes. See {@link DiagramDataSource.NodeObject} section.</td></tr>
 * <tr><td><b>links</b></td><td>An optional array of links. See {@link DiagramDataSource.LinkObject} section.</td></tr>
 * </tbody>
 * </table>
 * @param {Object=} options the options set on this data source
 * @param {Function=} options.childData Function callback to retrieve nodes and links for the specified parent.
 *                      Function will return a Promise that resolves into an object with the following structure:</p>
 * <table>
 * <tbody>
 * <tr><td><b>nodes</b></td><td>An array of objects for the child nodes for the given parent.
 *                              See {@link DiagramDataSource.NodeObject} section.</td></tr>
 * <tr><td><b>links</b></td><td>An array of objects for the links for the given parent.
 *                              See {@link DiagramDataSource.LinkObject} section.</td></tr>
 * </tbody>
 * </table>
 * @constructor
 * @final
 * @since 3.0
 * @ojdeprecated {since: '14.0.0', description: 'JsonDiagramDataSource has been deprecated with the oj-diagram data property,
 * use DataProvider on nodeData and linkData oj-diagram attributes instead.'}
 */
oj.JsonDiagramDataSource = function (data, options) {
  this.childDataCallback = options ? options.childData : null;
  this._nodesMapById = {};
  oj.JsonDiagramDataSource.superclass.constructor.call(this, data);
};

// Subclass from oj.DiagramDataSource
oj.Object.createSubclass(
  oj.JsonDiagramDataSource,
  oj.DiagramDataSource,
  'oj.JsonDiagramDataSource'
);

/**
 * Returns child data for the given parent.
 * The data include all immediate child nodes along with links whose endpoints
 * both descend from the current parent node.
 * If all the links are available upfront, they can be returned as part of the
 * top-level data (since all nodes descend from the diagram root).
 * If lazy-fetching links is desirable, the most
 * optimal way to return links is as part of the data of the
 * nearest common ancestor of the link's endpoints.
 *
 * @param {Object|null} parentData An object that contains data for the parent node.
 *                     See {@link DiagramDataSource.NodeObject} section.
 *                     If parentData is null, the method retrieves data for top level nodes.
 * @return {Promise} Promise resolves to a component object with the following structure:<p>
 * <table>
 * <tbody>
 * <tr><td><b>nodes</b></td><td>An array of objects for the child nodes for the given parent.
 *                              See {@link DiagramDataSource.NodeObject} section.</td></tr>
 * <tr><td><b>links</b></td><td>An array of objects for the links for the given parent.
 *                              See {@link DiagramDataSource.LinkObject} section.</td></tr>
 * </tbody>
 * </table>
 * @export
 * @method
 * @name getData
 * @memberof! oj.JsonDiagramDataSource
 * @instance
 */
oj.JsonDiagramDataSource.prototype.getData = function (parentData) {
  var childData;
  if (parentData) {
    // retrieve child data
    childData = parentData.nodes;
    if (childData === undefined && this.childDataCallback) {
      childData = this.childDataCallback(parentData);
      this._updateLocalData(this._nodesMapById[parentData.id], childData);
      return childData;
    }

    this._updateNodesMap({ nodes: childData });
    return Promise.resolve({ nodes: childData });
  }
  // retrieve top level data
  if (this.data) {
    this._updateNodesMap(this.data);
    return Promise.resolve(this.data);
  } else if (this.childDataCallback) {
    childData = this.childDataCallback();
    this._updateLocalData(null, childData);
    return childData;
  }

  return Promise.resolve(null);
};

/**
 * Internal method that updates a map of nodes that is used to improve performace
 * @param {Object} data data that might contain diagram nodes
 * @private
 */
oj.JsonDiagramDataSource.prototype._updateNodesMap = function (data) {
  // if callback for additional data is not specified - no need to keep map of nodes
  if (!this.childDataCallback || !data.nodes) {
    return;
  }
  var nodes = data.nodes;
  for (var i = 0; i < nodes.length; i++) {
    this._nodesMapById[nodes[i].id] = nodes[i];
  }
};

/**
 * Internal method that updates local data copy
 * @param {Object} parentData parent node that has to be updated
 * @param {Promise} childData
 * @private
 */
oj.JsonDiagramDataSource.prototype._updateLocalData = function (parentData, childData) {
  if (childData instanceof Promise) {
    var thisRef = this;
    childData.then(
      function (data) {
        if (!parentData && !thisRef.data) {
          // top level data were initially set to null,
          // create an object before setting its nodes and links properties
          thisRef.data = {};
        }
        if (Array.isArray(data.nodes)) {
          if (parentData) {
            // eslint-disable-next-line no-param-reassign
            parentData.nodes = data.nodes;
          } else {
            thisRef.data.nodes = data.nodes;
          }
          thisRef._updateNodesMap(data);
        }
        if (Array.isArray(data.links)) {
          thisRef.data.links = Array.isArray(thisRef.data.links)
            ? thisRef.data.links.concat(data.links)
            : data.links;
        }
        thisRef.handleEvent('ADD', {
          data: data,
          parentId: parentData ? parentData.id : null,
          index: 0
        });
      },
      function () {}
    );
  }
};

/**
 * Retrieves number of child nodes
 * @param {Object} nodeData A data object for the node in question.
 *                          See {@link DiagramDataSource.NodeObject} section.
 * @return {number} Number of child nodes if child count is available.
 *                  The method returns 0 for leaf nodes.
 *                  The method returns -1 if the child count is unknown
 *                  (e.g. if the children have not been fetched).
 * @export
 * @method
 * @name getChildCount
 * @memberof! oj.JsonDiagramDataSource
 * @instance
 */
oj.JsonDiagramDataSource.prototype.getChildCount = function (nodeData) {
  if (nodeData) {
    var childData = nodeData.nodes;
    var count;
    if (Array.isArray(childData)) {
      count = childData.length;
    } else if (childData === undefined && this.childDataCallback) {
      count = -1;
    } else {
      count = 0;
    }
    return count;
  }
  return -1;
};

/**
 * Indicates whether the specified object contains links
 * that should be discovered in order to display promoted links.
 *
 * @param {Object} nodeData A data object for the container node in question.
 *                          See {@link DiagramDataSource.NodeObject} section.
 * @return {string} the valid values are "connected", "disjoint", "unknown"
 * @export
 * @method
 * @name getDescendantsConnectivity
 * @memberof! oj.JsonDiagramDataSource
 * @instance
 */
// eslint-disable-next-line no-unused-vars
oj.JsonDiagramDataSource.prototype.getDescendantsConnectivity = function (nodeData) {
  return 'unknown';
};

});