/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeventtarget'], function (exports, ojeventtarget) { 'use strict';

    class DataGridProviderRefreshEvent extends ojeventtarget.GenericEvent {
        constructor(detail) {
            let eventOptions = {};
            eventOptions[DataGridProviderRefreshEvent._DETAIL] = detail;
            super('refresh', eventOptions);
        }
    }
    DataGridProviderRefreshEvent._DETAIL = 'detail';

    class DataGridProviderAddEvent extends ojeventtarget.GenericEvent {
        constructor(detail) {
            let eventOptions = {};
            eventOptions[DataGridProviderAddEvent._DETAIL] = detail;
            super('add', eventOptions);
        }
    }
    DataGridProviderAddEvent._DETAIL = 'detail';

    class DataGridProviderRemoveEvent extends ojeventtarget.GenericEvent {
        constructor(detail) {
            let eventOptions = {};
            eventOptions[DataGridProviderRemoveEvent._DETAIL] = detail;
            super('remove', eventOptions);
        }
    }
    DataGridProviderRemoveEvent._DETAIL = 'detail';

    class DataGridProviderUpdateEvent extends ojeventtarget.GenericEvent {
        constructor(detail) {
            let eventOptions = {};
            eventOptions[DataGridProviderUpdateEvent._DETAIL] = detail;
            super('update', eventOptions);
        }
    }
    DataGridProviderUpdateEvent._DETAIL = 'detail';

    exports.DataGridProviderAddEvent = DataGridProviderAddEvent;
    exports.DataGridProviderRefreshEvent = DataGridProviderRefreshEvent;
    exports.DataGridProviderRemoveEvent = DataGridProviderRemoveEvent;
    exports.DataGridProviderUpdateEvent = DataGridProviderUpdateEvent;

    Object.defineProperty(exports, '__esModule', { value: true });

});
