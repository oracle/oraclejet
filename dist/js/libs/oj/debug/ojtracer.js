/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcustomelement-utils'], function (exports, ojcustomelementUtils) { 'use strict';

    /**
     * Contains telemetry utility functions
     * @ojmodulecontainer ojtracer
     * @ojtsmodule
     * @since 11.1.0
     */

    /**
     * Return some descriptive text to help identify this element for the Tracer
     *
     * @ojexports
     * @memberof ojtracer
     * @param {HTMLElement} element - element for which to return descriptive text
     * @returns {string} descriptive text
     * @method
     * @name getDescriptiveText
     */

    /**
     * Allow user to set an opentelemetry-compatible TracerProvider object
     * Please see the {@link https://opentelemetry.io opentelemetry documentation}
     *
     * @ojexports
     * @memberof ojtracer
     * @param {unknown} provider
     * @method
     * @name setTracerProvider
     */

    /**
     * Return the user-set opentelemetry-compatible TracerProvider object, or an internal no-op version if nothing has been set
     * Please see the {@link https://opentelemetry.io opentelemetry documentation}
     * @ojexports
     * @memberof ojtracer
     * @returns {unknown} opentelemetry-compatible TracerProvider
     * @method
     * @name getTracerProvider
     */

    class NoOpSpan {
        spanContext() {
            const sc = {
                traceId: '',
                spanId: '',
                traceFlags: 0
            };
            return sc;
        }
        setAttribute(key, value) {
            return this;
        }
        setAttributes(attributes) {
            return this;
        }
        addEvent(name, attributesOrStartTime, startTime) {
            return this;
        }
        setStatus(status) {
            return this;
        }
        updateName(name) {
            return this;
        }
        end(endTime) { }
        isRecording() {
            return false;
        }
        recordException(exception, time) { }
    }

    class NoOpTracer {
        startSpan(name, options, context) {
            return new NoOpSpan();
        }
        startActiveSpan(name, optOrFunc, contextOrFunc, func) {
            let fn;
            if (arguments.length < 2) {
                return;
            }
            else if (arguments.length === 2) {
                fn = optOrFunc;
            }
            else if (arguments.length === 3) {
                fn = contextOrFunc;
            }
            else {
                fn = func;
            }
            return fn(new NoOpSpan());
        }
    }

    class NoOpTracerProvider {
        getTracer(name, version) {
            return new NoOpTracer();
        }
    }

    function getDescriptiveText(element) {
        var _a;
        const state = ojcustomelementUtils.CustomElementUtils.getElementState(element);
        return (_a = state === null || state === void 0 ? void 0 : state.getDescriptiveText()) !== null && _a !== void 0 ? _a : '';
    }
    let tracerProvider;
    function setTracerProvider(provider) {
        tracerProvider = provider;
    }
    function getTracerProvider() {
        if (!tracerProvider) {
            tracerProvider = new NoOpTracerProvider();
        }
        return tracerProvider;
    }

    exports.getDescriptiveText = getDescriptiveText;
    exports.getTracerProvider = getTracerProvider;
    exports.setTracerProvider = setTracerProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

});
