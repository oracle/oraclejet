/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function isTracerEnabled() {
    return typeof window !== 'undefined' && !!window.__JET_TRACER_ENABLED__;
}
function getTracer() {
    var _a;
    const tracer = window.GlobalTracer;
    return (_a = tracer === null || tracer === void 0 ? void 0 : tracer.get) === null || _a === void 0 ? void 0 : _a.call(tracer);
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
            const trigger = {
                type: getTraceType(event),
                target
            };
            const options = {
                operationName: 'componentEvent',
                trigger
            };
            return tracer.span(options, (span) => {
                let error;
                try {
                    return dispatchEvent.call(target, event);
                }
                catch (e) {
                    error = e;
                }
                finally {
                    const finishOptions = {};
                    if (error) {
                        finishOptions.error = error;
                    }
                    span.finish(finishOptions);
                }
            });
        }
        else {
            return dispatchEvent.call(target, event);
        }
    };
}

export { traceDispatchEvent };
