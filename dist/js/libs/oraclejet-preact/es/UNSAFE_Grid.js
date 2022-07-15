/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_Grid.css';
import { gridInterpolations } from './utils/UNSAFE_interpolations/grid.js';
import { boxAlignmentInterpolations } from './utils/UNSAFE_interpolations/boxalignment.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import './keys-cb973048.js';
import './_curry1-8b0d63fc.js';
import './_has-77a27fd6.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_classNames.js';
import './_curry2-6a0eecef.js';

const baseStyles = "b5ak6kf";
const interpolations = [...Object.values(gridInterpolations), ...Object.values(boxAlignmentInterpolations)];
const styleInterpolations = mergeInterpolations(interpolations);
/**
 * An implicit grid. Resize your browser to see how items reflow.
 */

const Grid = _a => {
  var {
    children
  } = _a,
      props = __rest(_a, ["children"]);

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = __rest(_b, ["class"]);

  const allStyles = Object.assign({}, styles);
  return jsx("div", Object.assign({
    class: `${baseStyles} ${cls}`,
    style: allStyles
  }, {
    children: children
  }));
};

export { Grid };
/*  */
//# sourceMappingURL=UNSAFE_Grid.js.map
