/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-axis'], function (exports, ojdvtAxis) { 'use strict';

    function getLabelFormatInfo(options) {
        let axisOptions = {};
        axisOptions._utils = true;
        axisOptions.scale = options.scale ? options.scale : 'linear';
        axisOptions.step = options.step;
        axisOptions.baselineScaling = axisOptions.scale === 'log' ? 'min' : 'zero';
        if (options.rangeType === 'axis') {
            axisOptions.max = options.range.max;
            axisOptions.min = options.range.min;
        }
        else if (options.rangeType === 'data') {
            axisOptions.dataMax = options.range.max;
            axisOptions.dataMin = options.range.min;
        }
        let mixin = new (ojdvtAxis.DataAxisInfoMixin(class {
        }))(null, axisOptions);
        let obj = mixin.getAxisData();
        let formatter;
        let minimumFractionDigits = 20;
        let maximumFractionDigits = 0;
        if (!obj.isLog) {
            formatter = new ojdvtAxis.LinearScaleAxisValueFormatter(obj.min, obj.max, obj.step, 'auto', 'on');
            maximumFractionDigits = formatter.getDecimalPlaces();
            minimumFractionDigits = maximumFractionDigits;
        }
        else {
            for (var i = 0; i <= obj.numSteps; i++) {
                let value = i * obj.step + obj.min;
                value = mixin.linearToActual(value);
                formatter = new ojdvtAxis.LinearScaleAxisValueFormatter(value, value, value, 'auto', 'on');
                maximumFractionDigits = Math.max(maximumFractionDigits, formatter.getDecimalPlaces());
                minimumFractionDigits = Math.min(minimumFractionDigits, formatter.getDecimalPlaces());
            }
        }
        return {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits
        };
    }

    exports.getLabelFormatInfo = getLabelFormatInfo;

    Object.defineProperty(exports, '__esModule', { value: true });

});
