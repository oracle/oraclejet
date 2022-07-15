/* @oracle/oraclejet-preact: 13.0.0 */
import './text.css';
import { k as keys_1 } from '../../keys-cb973048.js';
import '../../_curry1-8b0d63fc.js';
import '../../_has-77a27fd6.js';

const textAlignStyles = {
  start: "so5vivr",
  end: "exraja",
  right: "rnoefqf"
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
