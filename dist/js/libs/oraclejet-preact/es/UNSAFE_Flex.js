/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx } from 'preact/jsx-runtime';
import { dimensionInterpolations } from './utils/UNSAFE_interpolations/dimensions.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import './UNSAFE_Flex.css';
import { boxAlignmentInterpolations } from './utils/UNSAFE_interpolations/boxalignment.js';
import { flexboxInterpolations } from './utils/UNSAFE_interpolations/flexbox.js';
import { flexitemInterpolations } from './utils/UNSAFE_interpolations/flexitem.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-8b0d63fc.js';
import './utils/UNSAFE_classNames.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';
import './keys-cb973048.js';

const baseStyles = "b12c3cqv";
const interpolations = [...Object.values(dimensionInterpolations), ...Object.values(flexboxInterpolations), ...Object.values(flexitemInterpolations), ...Object.values(boxAlignmentInterpolations)];
const styleInterpolations = mergeInterpolations(interpolations);
const Flex = _a => {
  var {
    children
  } = _a,
      props = __rest(_a, ["children"]);

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = __rest(_b, ["class"]);

  return jsx("div", Object.assign({
    class: `${baseStyles} ${cls}`,
    style: styles
  }, {
    children: children
  }));
};

export { Flex };
/*  */
//# sourceMappingURL=UNSAFE_Flex.js.map
