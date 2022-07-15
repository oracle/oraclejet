/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx } from 'preact/jsx-runtime';
import { borderInterpolations } from './utils/UNSAFE_interpolations/borders.js';
import { dimensionInterpolations } from './utils/UNSAFE_interpolations/dimensions.js';
import { flexitemInterpolations } from './utils/UNSAFE_interpolations/flexitem.js';
import { colorInterpolations } from './utils/UNSAFE_interpolations/colors.js';
import { paddingInterpolations } from './utils/UNSAFE_interpolations/padding.js';
import { ariaInterpolations } from './utils/UNSAFE_interpolations/aria.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import { stringLiteralArray } from './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-8b0d63fc.js';

import './keys-cb973048.js';
import './_has-77a27fd6.js';
import './utils/UNSAFE_classNames.js';
import './_curry2-6a0eecef.js';

const elementTypes = stringLiteralArray(['div', 'main', 'article', 'section', 'aside']);
const interpolations = [
    ...Object.values(borderInterpolations),
    ...Object.values(dimensionInterpolations),
    ...Object.values(flexitemInterpolations),
    ...Object.values(colorInterpolations),
    ...Object.values(paddingInterpolations),
    ...Object.values(ariaInterpolations)
];
const styleInterpolations = mergeInterpolations(interpolations);
const View = (_a) => {
    var { as, children } = _a, props = __rest(_a, ["as", "children"]);
    const _b = styleInterpolations(props), { class: cls } = _b, styles = __rest(_b, ["class"]);
    // we hardcode box-sizing: border-box on all of our Preact components.
    styles['boxSizing'] = 'border-box';
    const Component = as || 'div';
    return (jsx(Component, Object.assign({ class: cls, style: styles }, { children: children })));
};

export { View, elementTypes };
/*  */
//# sourceMappingURL=UNSAFE_View.js.map
