/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

    const _MONITORS = {};
    const _WRITEBACK_MONITOR = Symbol();
    function getWritebackMonitor() {
        return _MONITORS[_WRITEBACK_MONITOR];
    }
    function setWritebackMonitor(monitor) {
        _MONITORS[_WRITEBACK_MONITOR] = monitor;
    }
    function performMonitoredWriteback(propName, writer, event, newValue) {
        if (writer) {
            const monitor = getWritebackMonitor();
            if (monitor) {
                monitor(propName, event, writer.bind(null, newValue));
            }
            else {
                writer(newValue);
            }
        }
    }

    exports.getWritebackMonitor = getWritebackMonitor;
    exports.performMonitoredWriteback = performMonitoredWriteback;
    exports.setWritebackMonitor = setWritebackMonitor;

    Object.defineProperty(exports, '__esModule', { value: true });

});
