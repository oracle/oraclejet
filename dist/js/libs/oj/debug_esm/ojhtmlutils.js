/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @namespace
 * @hideconstructor
 * @ojtsmodule
 *
 * @since 6.1.0
 * @classdesc
 * <p>Utility class with functions for preprocessing HTML content.</p>
 * <p><b>Note,</b> the utility methods do not validate HTML input provided by an application
 * for integrity or security violations. It is the application's responsibility to sanitize
 * the input to prevent unsafe content from being added to the page.</p>
 */
const HtmlUtils = {};

/**
 * Utility that will parse an HTML string into an array of DOM Nodes.
 * @param {string} html The HTML string to parse.
 * @return {Array<Node>}
 * @memberof! HtmlUtils
 * @static
 */
HtmlUtils.stringToNodeArray = function (html) {
  // escape html for the predefined tags
  var tags = [
    'table',
    'caption',
    'colgroup',
    'col',
    'thead',
    'tfoot',
    'th',
    'tbody',
    'tr',
    'td',
    'template',
    'p'
  ];
  var i;

  for (i = 0; i < tags.length; i++) {
    // eslint-disable-next-line no-param-reassign
    html = _escapeTag(tags[i], html);
  }
  // convert tags into DOM structure
  var container = document.createElement('div');
  container.innerHTML = html; // @HTMLUpdateOK html is the oj-module or composite View which does not come from the end user
  if (html.indexOf('<oj-bind-replace-') !== -1) {
    _unescapeTag(container);
  }

  // convert child nodes to nodes array accepted by oj-module element
  var nodesArray = [];
  while (container.firstChild) {
    nodesArray.push(container.firstChild);
    container.removeChild(container.firstChild);
  }
  return nodesArray;
};

/**
 * Utility that will clone the content of a template node and return
 * an array of DOM Nodes.
 * @param {Node} node The template node to retrieve the content for.
 * @return {Array<Node>}
 * @memberof! HtmlUtils
 * @static
 */
HtmlUtils.getTemplateContent = function (node) {
  var nodes = [];

  if (node.nodeType === 1 && node.tagName.toLowerCase() === 'template') {
    var content = node.content;
    if (content) {
      nodes.push(document.importNode(content, true));
    } else {
      Array.prototype.forEach.call(node.childNodes, function (child) {
        nodes.push(child.cloneNode(true));
      });
    }
  } else {
    throw new Error('Invalid template node ' + node);
  }

  return nodes;
};

/**
 * @private
 */
function _escapeTag(from, str) {
  var startTag = new RegExp('<' + from + '(?=\\s|>)', 'gi');
  var endTag = new RegExp('</' + from + '(?=\\s|>)', 'gi');
  return str
    .replace(startTag, '<oj-bind-replace-' + from)
    .replace(endTag, '</oj-bind-replace-' + from);
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

    const BIND_REPLACE = 'oj-bind-replace-';
    if (nodeName.substr(0, 16) === BIND_REPLACE) {
      var replName = nodeName.substr(16);
      replNode = document.createElement(replName); // @HTMLUpdateOK
      for (j = 0; j < child.attributes.length; j++) {
        attr = child.attributes[j];
        replNode.setAttribute(attr.name, attr.value); // @HTMLUpdateOK
      }
      var childHolder = replNode.content ? replNode.content : replNode;
      for (j = 0; child.childNodes.length > 0; ) {
        childHolder.appendChild(child.childNodes[0]);
      }
      parent.replaceChild(replNode, child);
    } else if (nodeName === 'script' || nodeName === 'style') {
      replNode = document.createElement(nodeName); // @HTMLUpdateOK
      for (j = 0; j < child.attributes.length; j++) {
        attr = child.attributes[j];
        replNode.setAttribute(attr.name, attr.value); // @HTMLUpdateOK
      }
      var origHTML = child.innerHTML; // @HTMLUpdateOK
      replNode.innerHTML = origHTML.replace(new RegExp(BIND_REPLACE, 'g'), ''); // @HTMLUpdateOK
      parent.replaceChild(replNode, child);
    } else if (child.nodeType === 8) {
      // comment node
      var origValue = child.nodeValue;
      child.nodeValue = origValue.replace(new RegExp(BIND_REPLACE, 'g'), '');
    }
  }
}

const stringToNodeArray = HtmlUtils.stringToNodeArray;
const getTemplateContent = HtmlUtils.getTemplateContent;

export { getTemplateContent, stringToNodeArray };
