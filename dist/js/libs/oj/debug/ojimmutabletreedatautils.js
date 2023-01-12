/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

   /**
    * @preserve Copyright 2013 jQuery Foundation and other contributors
    * Released under the MIT license.
    * http://jquery.org/license
    */

   /* jslint browser: true,devel:true*/

   /**
    *
    * @ojmodulecontainer ojimmutabletreedatautils
    * @ojhidden
    * @ojtsmodule
    * @since 13.0.0
    * @classdesc This module contains several mutation functions to update/add/remove
    * tree data and return a mutated copy. It also provides a function to find the node's path in the tree data.
    * User need to call <code>fetchByKeys</code> first to get the node's data, then pass the data to
    * <a href="#findPathByData">findPathByData</a> to get the path. Finially, call the correct mutation function to change the data.
    */

   /**
    * Utility function that find the node's path in base array by node's data.
    * @since 13.0.0
    * @param {Array<D>} baseArray The array that contain the node.
    * @param {D} data The returned node's data from <code>fetchByKeys</code>.
    * @param {string=} childrenAttribute Optional. The children attribute name in array. The default value is 'children'.
    * @return {Array<number>} The path to that node.
    * @memberof ojimmutabletreedatautils
    * @ojexports
    * @method
    * @name findPathByData
    * @ojsignature [
    *  {target: "Type", value:"<K, D>", for: "genericTypeParameters"},
    *  {target: "Type", value: "Array<D>", for: "treeArray"},
    *  {target: "Type", value: "D", for: "data"},
    *  {target: "Type", value: "string | 'children'", for: "?childrenAttribute"},
    *  {target: "Type", value:"Array<number>", for:"returns"}
    * ]
    * @ojtsexample <caption>Find path of 'Today'</caption>
    * import {
    *  MutableArrayTreeDataProvider
    * } from 'ojs/ojmutablearraytreedataprovider';
    * import {
    *  findPathByData
    * } from 'ojs/ojimmutabletreedatautils';
    * const baseData = [
    *   {title:"News", id:"news"},
    *   {title:"Blogs", id:"blogs", "children": [
    *     {title:"Today", id:"today"},
    *     {title:"Yesterday", id:"yesterday"},
    *     {title:"Archive", id:"archive", "children": [
    *       {title: "Links", id:'links'}
    *      ]}
    *   ]}
    * ];
    * // create a new MutableArrayTreeDataProvider with keyAttribute 'id'
    * // keyAttribute is unique in baseData
    * // The default keyAttributeScope is 'global'.
    * const mutableATDP = new MutableArrayTreeDataProvider(baseData, 'id');
    *
    * // create a new set and add key 'today' into keySet
    * let keySet = new Set();
    * keySet.add('today');
    *
    * // call fetchByKeys with keySet
    * const value = await mutableATDP.fetchByKeys({keys: keySet});
    *
    * // get data of node 'today'
    * const nodeData = value.results.get('today').data;
    *
    * // call findPathByData to get path
    * // path should be [1, 0]
    * const path = findPathByData(baseData, nodeData);
    */

   /**
    * Utility function that adds node by path and newData. Then returns the mutataed copy. The base array will not be changed.
    * @since 13.0.0
    * @param {Array} baseArray The base array that need to be updated.
    * @param {Array<number>} path The path that shows where the newData should be inserted at. Each item in the path indicates the index of the nodes in the path starting with root.
    * The last item in the path is the insertion index within the target parent node. If it is -1, new node will be appended to the target parent node's children array.
    * @param {D} newData The new node's data.
    * @param {string=} childrenAttribute Optional. The children attribute name in array. The default value is 'children'.
    * @return {Array<D>} The mutated array.
    * @memberof ojimmutabletreedatautils
    * @ojexports
    * @method
    * @name addNode
    * @ojsignature [
    *  {target: "Type", value:"<K, D>", for: "genericTypeParameters"},
    *  {target: "Type", value: "Array<D>", for: "baseArray"},
    *  {target: "Type", value: "Array<number>", for: "path"},
    *  {target: "Type", value: "D", for: "newData"},
    *  {target: "Type", value: "string | 'children'", for: "?childrenAttribute"},
    *  {target: "Type", value:"Array<D>", for:"returns"}
    * ]
    * @ojtsexample <caption>Add a child node to 'Today'</caption>
    * import {
    *  MutableArrayTreeDataProvider
    * } from 'ojs/ojmutablearraytreedataprovider';
    * import {
    *  addNode,
    *  findPathByData
    * } from 'ojs/ojimmutabletreedatautils';
    * const baseData = [
    *   {title:"News", id:"news"},
    *   {title:"Blogs", id:"blogs", "children": [
    *     {title:"Today", id:"today"},
    *     {title:"Yesterday", id:"yesterday"},
    *     {title:"Archive", id:"archive", "children": [
    *       {title: "Links", id:'links'}
    *      ]}
    *   ]}
    * ];
    * // create a new MutableArrayTreeDataProvider with keyAttribute 'id'
    * // keyAttribute is unique in baseData
    * // The default keyAttributeScope is 'global'.
    * const mutableATDP = new MutableArrayTreeDataProvider(baseData, 'id');
    *
    * // create a new set and add key 'today' into keySet
    * let keySet = new Set();
    * keySet.add('today');
    *
    * // call fetchByKeys with keySet
    * const value = await mutableATDP.fetchByKeys({keys: keySet});
    *
    * // get data of node 'today'
    * const nodeData = value.results.get('today').data;
    *
    * // call findPathByData to get path of node 'today'
    * // path should be [1, 0]
    * const path = findPathByData(baseData, nodeData);
    *
    * // indicate the index that the new node shoule be inserted at.
    * path.push(0);
    *
    * // create a new node that will be added into baseData
    * const newNode = {id: 'newNode', title:"new node"};
    *
    * // use addNode to mutate baseData and update immutableData
    * let immutableData = addNode(baseData, path, newNode);
    *
    * // update mutableATDP.data with immutableData
    * mutableATDP.data = immutableData;
    * @ojtsexample <caption>Add a new node before 'Archive' by using -1 in path array</caption>
    * import {
    *  MutableArrayTreeDataProvider
    * } from 'ojs/ojmutablearraytreedataprovider';
    * import {
    *  addNode,
    *  findPathByData
    * } from 'ojs/ojimmutabletreedatautils';
    * const baseData = [
    *   {title:"News", id:"news"},
    *   {title:"Blogs", id:"blogs", "children": [
    *     {title:"Today", id:"today"},
    *     {title:"Yesterday", id:"yesterday"},
    *     {title:"Archive", id:"archive", "children": [
    *       {title: "Links", id:'links'}
    *      ]}
    *   ]}
    * ];
    * // create a new MutableArrayTreeDataProvider with keyAttribute 'id'
    * // keyAttribute is unique in baseData
    * // The default keyAttributeScope is 'global'.
    * const mutableATDP = new MutableArrayTreeDataProvider(baseData, 'id');
    *
    * // create a new set and add key 'archive' into keySet
    * let keySet = new Set();
    * keySet.add('archive');
    *
    * // call fetchByKeys with keySet
    * const value = await mutableATDP.fetchByKeys({keys: keySet});
    *
    * // get data of node 'archive'
    * const nodeData = value.results.get('archive').data;
    *
    * // call findPathByData to get path of node 'archive'
    * // path should be [1, 2]
    * const path = findPathByData(baseData, nodeData);
    *
    * // replace the last item in path with -1
    * path.pop();
    * path.push(-1);
    *
    * // create a new node that will be added into baseData
    * const newNode = {id: 'newNode', title:"new node"};
    *
    * // use addNode to mutate baseData and update immutableData
    * // newNode should be added at index 2. Because Blogs' children array's length is 2 before adding.
    * // immutableData[1].children[2] is { title: 'new node', id: 'newNode' }
    * let immutableData = addNode(baseData, path, newNode);
    *
    * // update mutableATDP.data with immutableData
    * mutableATDP.data = immutableData;
    */

   /**
    * Utility function that replace node by path and newData. Then returns the mutataed copy. The base array will not be changed.
    * @since 13.0.0
    * @param {Array} baseArray The base array that need to be updated.
    * @param {Array<number>} path The path that shows where the newData should be inserted at. Each item in the path indicates the index of the nodes in the path starting with root.
    * The last item in the path is the insertion index within the target parent node. If it is -1, last node of the target parent node's children array will be replaced by new node.
    * @param {D} newData The new node's data.
    * @param {string=} childrenAttribute Optional. The children attribute's name in array. The default value is 'children'.
    * @return {Array<D>} The mutated array.
    * @memberof ojimmutabletreedatautils
    * @ojexports
    * @method
    * @name replaceNode
    * @ojsignature [
    *  {target: "Type", value:"<K, D>", for: "genericTypeParameters"},
    *  {target: "Type", value: "Array<D>", for: "baseArray"},
    *  {target: "Type", value: "Array<number>", for: "path"},
    *  {target: "Type", value: "D", for: "newData"},
    *  {target: "Type", value: "string | 'children'", for: "?childrenAttribute"},
    *  {target: "Type", value:"Array<D>", for:"returns"}
    * ]
    * @ojtsexample <caption>Update 'Today' title</caption>
    * import {
    *  MutableArrayTreeDataProvider
    * } from 'ojs/ojmutablearraytreedataprovider';
    * import {
    *  replaceNode,
    *  findPathByData
    * } from 'ojs/ojimmutabletreedatautils';
    * const baseData = [
    *   {title:"News", id:"news"},
    *   {title:"Blogs", id:"blogs", "children": [
    *     {title:"Today", id:"today"},
    *     {title:"Yesterday", id:"yesterday"},
    *     {title:"Archive", id:"archive", "children": [
    *       {title: "Links", id:'links'}
    *      ]}
    *   ]}
    * ];
    * // create a new MutableArrayTreeDataProvider with keyAttribute 'id'
    * // keyAttribute is unique in baseData
    * // The default keyAttributeScope is 'global'.
    * const mutableATDP = new MutableArrayTreeDataProvider(baseData, 'id');
    *
    * // create a new set and add key 'today' into keySet
    * let keySet = new Set();
    * keySet.add('today');
    *
    * // call fetchByKeys with keySet
    * const value = await mutableATDP.fetchByKeys({keys: keySet});
    *
    * // get data of node 'today'
    * const nodeData = value.results.get('today').data;
    *
    * // call findPathByData to get path
    * // path should be [1, 0]
    * const path = findPathByData(baseData, nodeData);
    *
    * // create an object that contains the property that will be updated
    * const newNode = {title:"new Today", id: 'today'};
    *
    * // use replaceNode to mutate baseData and update immutableData
    * let immutableData = replaceNode(baseData, path, newNode);
    *
    * // update mutableATDP.data with immutableData
    * mutableATDP.data = immutableData;
    */

   /**
    * Utility function that removes node by path and returns the mutataed copy. The base array will not be changed.
    * @since 13.0.0
    * @param {Array} baseArray The base array that need to be updated.
    * @param {Array<number>} path The path that shows where the newData should be inserted at. Each item in the path indicates the index of the nodes in the path starting with root.
    * The last item in the path is the insertion index within the target parent node. If it is -1, last node of the target parent node's children array will be removed.
    * @param {string=} childrenAttribute Optional. The children attribute's name in array. The default value is 'children'.
    * @return {Array<D>} The mutated array.
    * @memberof ojimmutabletreedatautils
    * @ojexports
    * @method
    * @name removeNode
    * @ojsignature [
    *  {target: "Type", value:"<K, D>", for: "genericTypeParameters"},
    *  {target: "Type", value: "Array<D>", for: "baseArray"},
    *  {target: "Type", value: "Array<number>", for: "path"},
    *  {target: "Type", value: "string | 'children'", for: "?childrenAttribute"},
    *  {target: "Type", value:"Array<D>", for:"returns"}
    * ]
    * @ojtsexample <caption>Remove node 'Today'</caption>
    * import {
    *  MutableArrayTreeDataProvider
    * } from 'ojs/ojmutablearraytreedataprovider';
    * import {
    *  removeNode,
    *  findPathByData
    * } from 'ojs/ojimmutabletreedatautils';
    * const baseData = [
    *   {title:"News", id:"news"},
    *   {title:"Blogs", id:"blogs", "children": [
    *     {title:"Today", id:"today"},
    *     {title:"Yesterday", id:"yesterday"},
    *     {title:"Archive", id:"archive", "children": [
    *       {title: "Links", id:'links'}
    *      ]}
    *   ]}
    * ];
    * // create a new MutableArrayTreeDataProvider with keyAttribute 'id'
    * // keyAttribute is unique in baseData.
    * // The default keyAttributeScope is 'global'.
    * const mutableATDP = new MutableArrayTreeDataProvider(baseData, 'id');
    *
    * // create a new set and add key 'today' into keySet
    * let keySet = new Set();
    * keySet.add('today');
    *
    * // call fetchByKeys with keySet
    * const value = await mutableATDP.fetchByKeys({keys: keySet});
    *
    * // get data of node 'today'
    * const nodeData = value.results.get('today').data;
    *
    * // call findPathByData to get path
    * // path should be [1, 0]
    * const path = findPathByData(baseData, nodeData);
    *
    * // use removeNode to mutate baseData and update immutableData
    * let immutableData = removeNode(baseData, path);
    *
    * // update mutableATDP.data with immutableData
    * mutableATDP.data = immutableData;
    */

   /**
    * Utility function that adds/removes/updates node for children mutations by path and returns the mutataed copy. The base array will not be changed.
    * When deleteCount is 1 and doesn't have newData, spliceNode will remove the child node.
    * When deleteCount is 1 and has newData, spliceNode will replace the child node with newData.
    * When deleteCount is 0, spliceNode will add a node according to childrenArrayIndex.
    * @since 13.0.0
    * @param {Array} baseArray The base array that need to be updated.
    * @param {Array<number>} path The path should be the path to the Node's parent index. Root manipulations will have a path of [].
    * @param {D=} newData The new node's data.
    * @param {number=} childrenArrayIndex The index at which to start changing the array. Default value would be 0.
    * @param {number=} deleteCount An integer indicating the number of elements in the array to remove from <code>childrenArrayIndex</code>. Default value would be 0.
    * 0 means no elements are removed. Max value will be 1.
    * @param {string=} childrenAttribute Optional. The children attribute's name in array. The default value is 'children'.
    * @return {Array<D>} The mutated array.
    * @memberof ojimmutabletreedatautils
    * @ojexports
    * @method
    * @name spliceNode
    * @ojsignature [
    *  {target: "Type", value:"<K, D>", for: "genericTypeParameters"},
    *  {target: "Type", value: "Array<D>", for: "baseArray"},
    *  {target: "Type", value: "Array<number>", for: "path"},
    *  {target: "Type", value: "D", for: "newData"},
    *  {target: "Type", value: "number", for: "childrenArrayIndex"},
    *  {target: "Type", value: "number", for: "deleteCount"},
    *  {target: "Type", value: "string | 'children'", for: "?childrenAttribute"},
    *  {target: "Type", value:"Array<D>", for:"returns"}
    * ]
    * @ojtsexample <caption>Add node</caption>
    * import {
    *  MutableArrayTreeDataProvider
    * } from 'ojs/ojmutablearraytreedataprovider';
    * import {
    *  spliceNode
    * } from 'ojs/ojimmutabletreedatautils';
    * const oldData = [
         { title: 'News', id: 'news' },
         {
           title: 'Blogs',
           id: 'blogs',
           children: [
             { title: 'Today', id: 'today' },
             { title: 'Yesterday', id: 'yesterday' },
             { title: 'Archive', id: 'archive' }
           ]
         }
       ];
       const newNode = { title: 'new node', id: 'newNode' };
       // should add a child node under blog at index 0
       const newData = spliceNode(oldData, [1], newNode);
   * @ojtsexample <caption>remove node</caption>
   * import {
   *  MutableArrayTreeDataProvider
   * } from 'ojs/ojmutablearraytreedataprovider';
   * import {
   *  spliceNode
   * } from 'ojs/ojimmutabletreedatautils';
   * const oldData = [
         { title: 'News', id: 'news' },
         {
           title: 'Blogs',
           id: 'blogs',
           children: [
             { title: 'Today', id: 'today' },
             { title: 'Yesterday', id: 'yesterday' },
             { title: 'Archive', id: 'archive' }
           ]
         }
       ];
      // remove node today
      const newData = spliceNode(oldData, [1], null, 0, 1);
   * @ojtsexample <caption>update node</caption>
   * import {
   *  MutableArrayTreeDataProvider
   * } from 'ojs/ojmutablearraytreedataprovider';
   * import {
   *  spliceNode
   * } from 'ojs/ojimmutabletreedatautils';
   * const oldData = [
         { title: 'News', id: 'news' },
         {
           title: 'Blogs',
           id: 'blogs',
           children: [
             { title: 'Today', id: 'today' },
             { title: 'Yesterday', id: 'yesterday' },
             { title: 'Archive', id: 'archive' }
           ]
         }
       ];
       const newNode = { title: 'new today', id: 'today' };
       // should update today with newNode
      const newData = spliceNode(oldData, [1], newNode, 0, 1);
    */

   function findPathByData(baseArray, data, childrenAttribute = 'children') {
       return findPath(baseArray, data, childrenAttribute, []);
   }
   function findPath(treeArray, data, childrenAttribute = 'children', path) {
       for (let i = 0; i < treeArray.length; i++) {
           if (treeArray[i] === data) {
               path.push(i);
               return path;
           }
           else if (treeArray[i][childrenAttribute]) {
               path.push(i);
               const newPath = findPath(treeArray[i][childrenAttribute], data, childrenAttribute, path);
               if (newPath) {
                   return newPath;
               }
               path.pop();
           }
       }
       return null;
   }
   function addNode(baseArray, path, newData, childrenAttribute = 'children') {
       const result = [...baseArray];
       let pointer = result;
       const newPath = [];
       let lastIndex = path[path.length - 1];
       for (let index = 0; index < path.length - 1; index++) {
           newPath.push(path[index]);
           newPath.push(childrenAttribute);
       }
       if (newPath.length === 0) {
           pointer.splice(lastIndex, 0, newData);
       }
       for (let i = 0; i < newPath.length; i++) {
           let currAttributeName = newPath[i];
           if (i === newPath.length - 1) {
               if (pointer[currAttributeName]) {
                   pointer[currAttributeName] = [...pointer[currAttributeName]];
               }
               else {
                   pointer[currAttributeName] = [];
               }
               if (lastIndex === -1) {
                   lastIndex = pointer[currAttributeName].length - 1;
               }
               pointer[currAttributeName].splice(lastIndex, 0, newData);
           }
           else {
               if (Array.isArray(pointer[currAttributeName])) {
                   pointer[currAttributeName] = [...pointer[currAttributeName]];
               }
               else {
                   pointer[currAttributeName] = Object.assign({}, pointer[currAttributeName]);
               }
               pointer = pointer[currAttributeName];
           }
       }
       return result;
   }
   function replaceNode(baseArray, path, newData, childrenAttribute = 'children') {
       const result = [...baseArray];
       let pointer = result;
       const newPath = [];
       for (let index = 0; index < path.length; index++) {
           newPath.push(path[index]);
           newPath.push(childrenAttribute);
       }
       newPath.pop();
       for (let i = 0; i < newPath.length; i++) {
           let currAttributeName = newPath[i];
           if (i === newPath.length - 1) {
               if (currAttributeName === -1) {
                   currAttributeName = pointer.length - 1;
               }
               pointer[currAttributeName] = Object.assign({}, newData);
           }
           else {
               if (Array.isArray(pointer[currAttributeName])) {
                   pointer[currAttributeName] = [...pointer[currAttributeName]];
               }
               else {
                   pointer[currAttributeName] = Object.assign({}, pointer[currAttributeName]);
               }
               pointer = pointer[currAttributeName];
           }
       }
       return result;
   }
   function removeNode(baseArray, path, childrenAttribute = 'children') {
       const result = [...baseArray];
       let pointer = result;
       let removedItem = path[path.length - 1];
       const newPath = [];
       for (let index = 0; index < path.length - 1; index++) {
           newPath.push(path[index]);
           newPath.push(childrenAttribute);
       }
       if (newPath.length === 0) {
           if (pointer.length === 1) {
               pointer = pointer.splice(0, 1);
           }
           else {
               if (removedItem === -1) {
                   removedItem = pointer.length - 1;
               }
               pointer = pointer.splice(removedItem, 1);
           }
       }
       for (let i = 0; i < newPath.length; i++) {
           let currAttributeName = newPath[i];
           if (i === newPath.length - 1) {
               if (pointer[currAttributeName].length === 1) {
                   delete pointer[currAttributeName];
               }
               else {
                   pointer[currAttributeName] = [...pointer[currAttributeName]];
                   if (removedItem === -1) {
                       removedItem = pointer[currAttributeName].length - 1;
                   }
                   pointer[currAttributeName].splice(removedItem, 1);
               }
           }
           else {
               if (Array.isArray(pointer[currAttributeName])) {
                   pointer[currAttributeName] = [...pointer[currAttributeName]];
               }
               else {
                   pointer[currAttributeName] = Object.assign({}, pointer[currAttributeName]);
               }
               pointer = pointer[currAttributeName];
           }
       }
       return result;
   }
   function spliceNode(baseArray, path, newData, childrenArrayIndex = 0, deleteCount = 0, childrenAttribute = 'children') {
       path.push(childrenArrayIndex);
       if (deleteCount > 0 && !newData) {
           return removeNode(baseArray, path, childrenAttribute);
       }
       else if (deleteCount > 0) {
           return replaceNode(baseArray, path, newData, childrenAttribute);
       }
       else {
           return addNode(baseArray, path, newData, childrenAttribute);
       }
   }

   exports.addNode = addNode;
   exports.findPathByData = findPathByData;
   exports.removeNode = removeNode;
   exports.replaceNode = replaceNode;
   exports.spliceNode = spliceNode;

   Object.defineProperty(exports, '__esModule', { value: true });

});
