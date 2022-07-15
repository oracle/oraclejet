/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx } from 'preact/jsx-runtime';
import { dimensionInterpolations } from './utils/UNSAFE_interpolations/dimensions.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import { flexitemInterpolations } from './utils/UNSAFE_interpolations/flexitem.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-8b0d63fc.js';
import './utils/UNSAFE_classNames.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';

import './keys-cb973048.js';

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
