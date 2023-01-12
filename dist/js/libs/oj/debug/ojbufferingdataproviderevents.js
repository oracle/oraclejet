/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeventtarget'], function (exports, ojeventtarget) { 'use strict';

    class BufferingDataProviderSubmittableChangeEvent extends ojeventtarget.GenericEvent {
        constructor(detail) {
            const eventOptions = {};
            eventOptions['detail'] = detail;
            super('submittableChange', eventOptions);
        }
    }

    exports.BufferingDataProviderSubmittableChangeEvent = BufferingDataProviderSubmittableChangeEvent;

    Object.defineProperty(exports, '__esModule', { value: true });

});
