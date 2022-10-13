/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx } from 'preact/jsx-runtime';
import { dimensionInterpolations } from './utils/UNSAFE_interpolations/dimensions.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import { flexitemInterpolations } from './utils/UNSAFE_interpolations/flexitem.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-b6f34fc4.js';
import './utils/UNSAFE_classNames.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';

import './keys-77d2b8e6.js';

const interpolations = [...Object.values(dimensionInterpolations), flexitemInterpolations.flex];
const styleInterpolations = mergeInterpolations(interpolations);
const Spacer = (_a) => {
    var props = __rest(_a, []);
    const _b = styleInterpolations(props), { class: cls } = _b, styles = __rest(_b, ["class"]);
    return jsx("div", { class: `${cls}`, style: styles });
};

export { Spacer };
/*  */
//# sourceMappingURL=UNSAFE_Spacer.js.map
