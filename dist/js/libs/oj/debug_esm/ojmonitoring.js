/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
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

export { getWritebackMonitor, performMonitoredWriteback, setWritebackMonitor };
