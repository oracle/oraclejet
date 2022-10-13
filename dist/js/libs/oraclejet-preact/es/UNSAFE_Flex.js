/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
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
import './_curry1-b6f34fc4.js';
import './utils/UNSAFE_classNames.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';
import './keys-77d2b8e6.js';

const baseStyles = "_hpdtdu";
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