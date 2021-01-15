/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { CustomElementUtils } from 'ojs/ojcustomelement-utils';

function getDescriptiveText(element) {
    var _a;
    const state = CustomElementUtils.getElementState(element);
    return (_a = state === null || state === void 0 ? void 0 : state.getDescriptiveText()) !== null && _a !== void 0 ? _a : '';
}

export { getDescriptiveText };
