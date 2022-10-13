/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx } from 'preact/jsx-runtime';
import { Flex } from './UNSAFE_Flex.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-b6f34fc4.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './utils/UNSAFE_classNames.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';

import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-77d2b8e6.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';

/**
 * Center is a convenience component that creates a flexbox
 * with justifyContent: center and alignItems: center.
 * TODO: How do I add background-color, border, etc?
 *
 */
function Center(_a) {
    var { children, width = '100%', height = '100%' } = _a, props = __rest(_a, ["children", "width", "height"]);
    return (jsx(Flex, Object.assign({}, props, { justify: "center", align: "center", width: width, height: height }, { children: children })));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { Center };
/*  */
//# sourceMappingURL=UNSAFE_Center.js.map
