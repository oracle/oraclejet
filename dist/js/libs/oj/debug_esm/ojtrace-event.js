/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getTracerProvider } from 'ojs/ojtracer';

function isTracerEnabled() {
    return typeof window !== 'undefined' && !!window.__JET_TRACER_ENABLED__;
}
function getTracer() {
    const tracerProvider = getTracerProvider();
    return tracerProvider.getTracer('JET');
}
function shouldTraceEvent(event) {
    const type = event === null || event === void 0 ? void 0 : event.type;
    if (!type || type.startsWith('ojBefore')) {
        return false;
    }
    switch (type) {
        case 'attribute-changed':
        case 'ojAnimateStart':
        case 'ojAnimateEnd':
        case 'ojTransitionStart':
        case 'ojTransitionEnd':
        case 'labelledByChanged':
        case 'beforeDestroyChanged':
            return false;
    }
    return true;
}
function getTraceType(event) {
    var _a;
    let type = event.type;
    const value = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.value;
    if (value != null) {
        switch (type) {
            case 'validChanged':
                type = `${type}=${value}`;
                break;
            case 'expandedChanged':
                if (typeof value === 'boolean') {
                    type = `${type}=${value}`;
                }
                break;
        }
    }
    return type;
}
function traceDispatchEvent(dispatchEvent) {
    return function (event) {
        const target = this;
        const tracer = getTracer();
        if (isTracerEnabled() && tracer && shouldTraceEvent(event)) {
            const type = getTraceType(event);
            const operationName = 'componentEvent';
            return tracer.startActiveSpan(`${operationName} ${type}`, (span) => {
                try {
                    span.setAttribute('type', type);
                    span.setAttribute('operationName', operationName);
                    return dispatchEvent.call(target, event);
                }
                catch (e) {
                    span.setStatus({ code: 2, message: e.message });
                }
                finally {
                    span.end();
                }
            });
        }
        else {
            return dispatchEvent.call(target, event);
        }
    };
}

export { traceDispatchEvent };
