/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base'], function (exports, oj) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    /**
     * Contains utility functions intended to be used to configure layer
     * @ojmodulecontainer ojlayerutils
     * @ojtsmodule
     * @ojhidden
     * @since 19.0.0
     */
    /**
     * Function to get layer context. This context allows to determines if legacy popup support is available  or if it should use pure corepack solution with no legacy dependency
     *
     * @ojexports
     * @memberof ojlayerutils
     * @ojsignature {target: "Type",
     *               value: "(baseElem:HTMLElement): { getRootLayerHost?:(priority?:'popup' | 'dialog' | 'messages' | 'tooltip') => Element;
     *               getLayerHost?:(priority?:'popup' | 'dialog' | 'messages' | 'tooltip') => Element; onLayerUnmount?:(element:HTMLElement) => void; }"}
     * @method
     * @name getLayerContext
     */

    const NEW_DEFAULT_LAYER_ID = '__root_layer_host';
    const getLayerHost = (element, level, priority) => {
        let parentLayerHost = null;
        if (level === 'nearestAncestor') {
            parentLayerHost = element.closest('[data-oj-layer]');
        }
        if (parentLayerHost) {
            return parentLayerHost;
        }
        let rootLayerHost = document.getElementById(NEW_DEFAULT_LAYER_ID);
        // get/create the default layer host
        if (!rootLayerHost) {
            rootLayerHost = document.createElement('div');
            rootLayerHost.setAttribute('id', NEW_DEFAULT_LAYER_ID);
            // explicitly specifying a binding provider of 'preact' here otherwise
            // custom elements inside the Layer may walk up the DOM and think that
            // they are in a ko-activated subtree and wait forever for bindings to be applied
            rootLayerHost.setAttribute('data-oj-binding-provider', 'preact');
            rootLayerHost.style.position = 'relative';
            rootLayerHost.style.zIndex = '999';
            document.body.prepend(rootLayerHost); // @HTMLUpdateOK
        }
        return rootLayerHost;
    };
    function getLayerContext(baseElem) {
        const layerHostResolver = oj.VLayerUtils ? oj.VLayerUtils.getLayerHost : getLayerHost;
        const onLayerUnmountResolver = oj.VLayerUtils ? oj.VLayerUtils.onLayerUnmount : null;
        return {
            getRootLayerHost: layerHostResolver.bind(null, baseElem, 'topLevel'),
            getLayerHost: layerHostResolver.bind(null, baseElem, 'nearestAncestor'),
            onLayerUnmount: onLayerUnmountResolver?.bind(null, baseElem)
        };
    }

    exports.getLayerContext = getLayerContext;

    Object.defineProperty(exports, '__esModule', { value: true });

});
