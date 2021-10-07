/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { CustomElementUtils } from 'ojs/ojcustomelement-utils';

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
 *
 * @ojexports
 * @memberof ojtracer
 * @param {Object} provider
 * @method
 * @name setTracerProvider
 */

/**
 * Return the user-set opentelemetry-compatible TracerProvider object, or an internal no-op version if nothing has been set
 *
 * @ojexports
 * @memberof ojtracer
 * @returns {Object} opentelemetry-compatible TracerProvider
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
    startActiveSpan(name, fn) {
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
    const state = CustomElementUtils.getElementState(element);
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

export { getDescriptiveText, getTracerProvider, setTracerProvider };
