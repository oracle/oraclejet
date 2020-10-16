define(['exports', 'ojs/ojcore-base', 'ojs/ojcustomelement'], function (exports, oj, ojcustomelement) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    function getDescriptiveText(element) {
        if (oj.BaseCustomElementBridge.hasInstance(element)) {
            const bridge = oj.BaseCustomElementBridge.getInstance(element);
            return bridge.GetDescriptiveText(element);
        }
        return '';
    }

    exports.getDescriptiveText = getDescriptiveText;

    Object.defineProperty(exports, '__esModule', { value: true });

});
