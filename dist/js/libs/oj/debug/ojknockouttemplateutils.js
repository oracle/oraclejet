/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'jqueryui-amd/widget', 'jquery', 'knockout'], function (exports, widget, $, ko) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  /**
   * This is added so that we could cleanup any ko references on the element when it is removed.
   * @export
   */
  $.widget('oj._ojDetectCleanData', {
    options: {
      /**
       * @type {boolean}
       * @default <code class="prettyprint">false</code>
       */
      cleanParent: false
    },
    _destroy: function () {
      var disposal = ko.utils.domNodeDisposal;
      var cleanExternalData = 'cleanExternalData';

      // need to temporarily short circuit the domNodeDisposal call otherwise
      // the _destroy override would be invoked again
      var oldCleanExternal = disposal[cleanExternalData];
      disposal[cleanExternalData] = function () {};

      try {
        // provide the option to clean from the parent node for components like ojdatagrid so that the comment
        // and text nodes aren't memory leaked with ko when remove/_destroy is not called on all node types
        if (this.options.cleanParent && this.element[0].parentNode != null) {
          ko.cleanNode(this.element[0].parentNode);
        } else {
          ko.cleanNode(this.element[0]);
        }
      } finally {
        disposal[cleanExternalData] = oldCleanExternal;
      }
    }
  });

  /**
   * Utility methods for knockout templates.
   *
   *
   * @since 4.0.0
   * @namespace
   * @ojtsmodule
   * @export
   * @name oj.KnockoutTemplateUtils
   */
  const KnockoutTemplateUtils = {};

  /**
   * JET custom elements do not support template binding attributes, so applications using knockout templates
   * should use this utility to convert their knockout templates to a renderer function for use in component
   * renderer APIs instead.
   *
   * @param {string} template The name of the knockout template to use.
   * @param {boolean=} bReplaceNode True if the entire target node should be replaced by the output of the template.
   *                                If false or omitted, the children of the target node will be replaced.
   * @return {function(Object)} A renderer function that takes a context object.
   * @export
   * @method getRenderer
   * @memberof oj.KnockoutTemplateUtils
   * @example <caption>Convert a knockout template to a custom tooltip renderer function:</caption>
   * &lt;oj-tag-cloud tooltip.renderer="[[oj.KnockoutTemplateUtils.getRenderer('tooltip_template')]]">&lt;/oj-tag-cloud>
   */
  KnockoutTemplateUtils.getRenderer = function (template, bReplaceNode) {
    var templateRenderer = function (context) {
      // For DVTs, the node to attach the template to is different than the context's parentElement key
      var parentElement = context._parentElement || context.parentElement;

      var bindingContext = ko.contextFor(context.componentElement);

      // Make sure we have a bindingContext before rendering.  It's possible that this is called
      // after a component has been disconnected and there is no bindingContext.
      if (bindingContext) {
        var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
          // eslint-disable-next-line no-param-reassign
          binding.$context = context;
        });
        ko.renderTemplate(
          template,
          childContext,
          {
            afterRender: function (renderedElement) {
              $(renderedElement)._ojDetectCleanData();
            }
          },
          parentElement,
          bReplaceNode ? 'replaceNode' : 'replaceChildren'
        );
      }

      return null;
    };

    return function (context) {
      if (
        context.componentElement.classList &&
        context.componentElement.classList.contains('oj-dvtbase')
      ) {
        // Create a dummy div
        var dummyDiv = document.createElement('div');
        dummyDiv.style.display = 'none';
        dummyDiv._dvtcontext = context._dvtcontext;
        context.componentElement.appendChild(dummyDiv);
        Object.defineProperty(context, '_parentElement', { value: dummyDiv, enumerable: false });
        Object.defineProperty(context, '_templateCleanup', {
          value: function () {
            $(dummyDiv).remove();
          },
          enumerable: false
        });
        Object.defineProperty(context, '_templateName', {
          value: template,
          enumerable: false
        });

        templateRenderer(context);

        var elem = dummyDiv.children[0];
        if (elem) {
          dummyDiv.removeChild(elem);
          $(dummyDiv).remove();
          return { insert: elem };
        }
        return { preventDefault: true };
      }

      return templateRenderer(context);
    };
  };

  const getRenderer = KnockoutTemplateUtils.getRenderer;

  exports.getRenderer = getRenderer;

  Object.defineProperty(exports, '__esModule', { value: true });

});
