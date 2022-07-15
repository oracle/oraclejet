/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_AspectRatio.css';
import { dimensionInterpolations } from './utils/UNSAFE_interpolations/dimensions.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import { stringLiteralArray } from './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-8b0d63fc.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';

// hack to get aspect-ratio to work.
// CSS now has an aspect-ratio attribute that makes this super easy.
// aspect-ratio is supported in all major browsers, most recently in Safari 15.
// https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
// However, it isn't until jet 14 that we drop support for Safari 14.
// When jet 14 comes out we can replace the padding-bottom hack with aspect-ratio css property.
// Also a user could just put aspect-ratio directly on their dom, instead of wrapping
// it inside this AspectRatio component.
// NOTE: padding-bottom has to be on a dom node that is the child of a dom node that has
// width, not the same dom node. From css doc:
// The size of the padding as a percentage, relative to the width of the containing block.
// So the root dom node has the dimensions styling and the '::before' dom node
// has the padding information.
// 100%/ratio. 100/(4/3) = 75%
// e.g., 16/9 = 56.25%, 4/3 = 75%, 1/1=100%, 2/1=50%

const baseDivStyles = "b10sxgzy"; // common aspect ratios
// The box’s preferred aspect ratio is the specified ratio of width / height.
// The ratio has a '/' as a separator and not a ':' because the '/' is what
// the CSS aspect-ratio uses.
// TODO: Don't use fixed ratios. Let them specify any number

const ratios = stringLiteralArray(['9/16', '1/1', '6/5', '5/4', '4/3', '11/8', '1.43/1', '3/2', '14/9', '16/10', '1.6180/1', '5/3', '16/9', '1.85/1', '1.9/1', '2/1', '2.2/1', '64/21', '2.4/1', '2.414/1', '2.76/1', '32/9', '18/5', '4/1']);
const dimensions = stringLiteralArray(['maxWidth', 'minWidth', 'width']); // Create an array [dimensionInterpolations['maxWidth'], dimensionInterpolations['width'], dimensionInterpolations['minWidth']]

const widthDimensionInterpolation = Array.from(dimensions, x => dimensionInterpolations[x]);
const interpolations = mergeInterpolations(widthDimensionInterpolation);
/**
 * The AspectRatio component displays its content with a certain ratio based on the dimension
 * properties. Overflow content is hidden.
 *
 * It uses a common padding-bottom hack to do this. In future versions it will
 * be implemented using the CSS's aspect-ratio property when the browsers we need to support
 * all have it. For example, Safari 15 has it, but we won't drop Safari 14 until jet 14.
 *
 */

function AspectRatio(_a) {
  var {
    children,
    ratio = '1/1'
  } = _a,
      props = __rest(_a, ["children", "ratio"]);

  const _b = interpolations(props),
        {
    class: cls
  } = _b,
        styles = __rest(_b, ["class"]);

  const stylesWithAspectRatioVar = Object.assign(Object.assign({}, styles), {
    '--oj-c-PRIVATE-DO-NOT-USE-aspect-ratio': ratio
  });
  return jsx("div", Object.assign({
    class: classNames([baseDivStyles, cls]),
    style: stylesWithAspectRatioVar
  }, {
    children: children
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { AspectRatio, ratios };
/*  */
//# sourceMappingURL=UNSAFE_AspectRatio.js.map
