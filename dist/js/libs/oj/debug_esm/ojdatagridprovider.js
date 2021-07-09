/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { GenericEvent } from 'ojs/ojeventtarget';

class DataGridProviderRefreshEvent extends GenericEvent {
    constructor() {
        let eventOptions = {};
        super('refresh', eventOptions);
    }
}

class DataGridProviderAddEvent extends GenericEvent {
    constructor(detail) {
        let eventOptions = {};
        eventOptions[DataGridProviderAddEvent._DETAIL] = detail;
        super('add', eventOptions);
    }
}
DataGridProviderAddEvent._DETAIL = 'detail';

class DataGridProviderRemoveEvent extends GenericEvent {
    constructor(detail) {
        let eventOptions = {};
        eventOptions[DataGridProviderRemoveEvent._DETAIL] = detail;
        super('remove', eventOptions);
    }
}
DataGridProviderRemoveEvent._DETAIL = 'detail';

class DataGridProviderUpdateEvent extends GenericEvent {
    constructor(detail) {
        let eventOptions = {};
        eventOptions[DataGridProviderUpdateEvent._DETAIL] = detail;
        super('update', eventOptions);
    }
}
DataGridProviderUpdateEvent._DETAIL = 'detail';

export { DataGridProviderAddEvent, DataGridProviderRefreshEvent, DataGridProviderRemoveEvent, DataGridProviderUpdateEvent };
