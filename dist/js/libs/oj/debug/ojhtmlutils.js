/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout'], function(oj, ko)
{

/**
 * Utility class with functions for preprocessing HTML data
 * to avoid a problem using a custom tag within HTML table.
 * Used as a part of ModuleElementUtils.createView() call
 *
 * @constructor
 * @private
 * @expose
 */
var HtmlUtils = {};

/**
 * @ignore
 * @export
 * @static
 */
HtmlUtils.stringToNodeArray = function (html) {
  // escape html for the predefined tags
  var tags = [
    'table', 'caption', 'colgroup', 'col', 'thead', 'tfoot', 'th',
    'tbody', 'tr', 'td', 'template'
  ];
  var i;

  for (i = 0; i < tags.length; i++) {
    // eslint-disable-next-line no-param-reassign
    html = _escapeTag(tags[i], html);
  }
  // convert tags into DOM structure
  var container = document.createElement('div');
  container.innerHTML = html; // @HTMLUpdateOK html is the oj-module or composite View which does not come from the end user
  if (html.indexOf('<oj-bind-replace-') !== -1) { _unescapeTag(container); }

  // convert child nodes to nodes array accepted by oj-module element
  var childList = container.childNodes;
  var nodesArray = [];
  for (i = childList.length; i--; nodesArray.unshift(childList[i]));
  return nodesArray;
};

/**
 * @private
 */
function _escapeTag(from, str) {
  var startTag = new RegExp('<' + from + '(?=\\s|>)', 'gi');
  var endTag = new RegExp('</' + from + '(?=\\s|>)', 'gi');
  return str.replace(startTag, '<oj-bind-replace-' +
                      from).replace(endTag, '</oj-bind-replace-' + from);
}

/**
 * @private
 */
function _unescapeTag(parent) {
  // replace '<oj-bind-replace-tag' with the original <tag in the array of DOM nodes
  var children = parent.childNodes;
  var len = children.length;
  for (var i = 0; i < len; i++) {
    var child = children[i];
    _unescapeTag(child);
    var nodeName = child.nodeName.toLowerCase();
    var j;
    var attr;
    var replNode;

    if (nodeName.substr(0, 16) === 'oj-bind-replace-') {
      var replName = nodeName.substr(16);
      replNode = document.createElement(replName);
      for (j = 0; j < child.attributes.length; j++) {
        attr = child.attributes[j];
        replNode.setAttribute(attr.name, attr.value);
      }
      var childHolder = replNode.content ? replNode.content : replNode;
      for (j = 0; child.childNodes.length > 0;) {
        childHolder.appendChild(child.childNodes[0]);
      }
      parent.replaceChild(replNode, child);
    } else if (nodeName === 'script' || nodeName === 'style') {
      replNode = document.createElement(nodeName);
      for (j = 0; j < child.attributes.length; j++) {
        attr = child.attributes[j];
        replNode.setAttribute(attr.name, attr.value);
      }
      var origHTML = child.innerHTML;
      replNode.innerHTML = origHTML.replace(new RegExp('oj-bind-replace-', 'g'), '');
      parent.replaceChild(replNode, child);
    } else if (child.nodeType === 8) { // comment node
      var origValue = child.nodeValue;
      child.nodeValue = origValue.replace(new RegExp('oj-bind-replace-', 'g'), '');
    }
  }
}

;return HtmlUtils;
});