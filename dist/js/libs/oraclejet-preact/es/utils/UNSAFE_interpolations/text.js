/* @oracle/oraclejet-preact: 13.1.0 */
import './text.css';
import { k as keys_1 } from '../../keys-77d2b8e6.js';
import '../../_curry1-b6f34fc4.js';
import '../../_has-f370c697.js';

const textAlignStyles = {
  start: "_wibxf",
  end: "cgdb3m",
  right: "n4t3gp"
};
const textStyles = {
  textAlign: textAlignStyles
};
const textAligns = keys_1(textAlignStyles);
const textInterpolations = {
  textAlign: ({
    textAlign
  }) => textAlign === undefined ? {} : {
    class: textAlignStyles[textAlign]
  }
};

export { textAlignStyles, textAligns, textInterpolations, textStyles };
/*  */
//# sourceMappingURL=text.js.map
