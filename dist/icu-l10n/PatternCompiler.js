const Parser = require('intl-messageformat-parser');
const PluralCompiler = require('make-plural-compiler');

module.exports = class PatternCompiler {
  constructor(locale) {
    this._locale = locale;
  }

  compile(pattern) {
    const ast = Parser.parse(pattern);
    const paramAccumulator = Object.create(null);
    const combinedParts = this._processParts(ast, paramAccumulator);
    return {paramTypes: paramAccumulator, formatter: `function (p){return ${combinedParts};}`};
  }

  getPluralSelect() {
    if (!this._hasPlurals) {
      return '';
    }
    PluralCompiler.load(require('cldr-core/supplemental/plurals.json'));
    const select = new PluralCompiler(this._getLanguage()).compile();
    return `function _pluralSelect(n) {
if (Intl.PluralRules) return new Intl.PluralRules('${this._locale}').select(n);
return (${String(select)})(n);
}
`
  }

  _processParts(ast, paramAccumulator, currentPluralNode) {
    if (!ast) {
      return undefined;
    }
    const acc = [];
    return ast.reduce(
        (acc, node) => {
            switch (node.type) {
                case 0: // raw text
                    acc.push(`${JSON.stringify(node.value)}`);
                    break;
                case 1: // argument
                    acc.push(this._getParameterExpression(node, paramAccumulator));
                    break;
                case 2: // number
                    acc.push(this._getNumberFormat(node, paramAccumulator));
                    break;
                case 3: // date
                    acc.push(this._getDateTimeFormat(node, 'date', paramAccumulator));
                    break;
                case 4: // time
                    acc.push(this._getDateTimeFormat(node, 'time', paramAccumulator));
                    break;
                case 5: // select
                    acc.push(this._getSelectFormat(node, paramAccumulator));
                    break;
                case 6: // plural
                  acc.push(this._getPluralFormat(node, paramAccumulator));
                    break;
                case 7: // pound
                  acc.push(this._getPoundFormat(currentPluralNode, paramAccumulator));
                  break;
                default:
                    throw new Error('Unsupported token type: ' + node.type);

            }

            return acc;

        },
        acc
    ).join('+');
  }

  _getNumberFormat(node, paramAccumulator) {
      let opts;
      const style = node.style;
      if (typeof style === 'string') {
          opts = this._getFormatOpts().number[style];
      } else if (Parser.isNumberSkeleton(style)) {
          opts = Parser.convertNumberSkeletonToNumberFormatOptions(style.tokens);
      }
      return `new Intl.NumberFormat("${this._locale}",${this._stringifyOptions(opts)}).
                format(${this._getParameterExpression(node, paramAccumulator, 'number')})`;
  }

  _getDateTimeFormat(node, type, paramAccumulator) {
    let opts;
    const style = node.style;
    if (typeof style === 'string') {
        opts = this._getFormatOpts()[type][style];
    } else if (Parser.isDateTimeSkeleton(style)) {
        opts = Parser.parseDateTimeSkeleton(style.pattern);
    }
    return `new Intl.DateTimeFormat("${this._locale}",${this._stringifyOptions(opts)}).
              format(${this._getParameterExpression(node, paramAccumulator, 'date')})`;
  }

  _getSelectFormat(node, paramAccumulator) {
    const {opts, other} = this._getSelectOptions(node, paramAccumulator);
    // The generated code will look like the following:
    // {male: "he said", female: "she said"}[param]||{"they said"}
    return `({${opts.join(',')}}[${this._getParameterExpression(node, paramAccumulator)}]${other})`;
  }

  _getPluralFormat(node, paramAccumulator) {
    const {opts, other, exactPlurals} = this._getSelectOptions(node, paramAccumulator, node);
    const offset = node.offset !== 0 ? `-(${node.offset})` :  '';
    const num = this._getParameterExpression(node, paramAccumulator, 'number');

    const pluralMatch = opts.length === 0 ? 'undefined' :
      `{${opts.join(',')}}[_pluralSelect(${num}${offset})]`;
    const exactMatch =
      exactPlurals.length > 0 ? `{${exactPlurals.join(',')}}[${num}]||` : '';

    if (opts.length > 0) {
      this._hasPlurals = true;
    }

    // The generated code will look like the following:
    // {0: "message for zero"}[pluralNum]||
    // {one: "one message", many: "many message"}[new Intl.PluralRules(loc).select(pluralNum-offset)]||
    // {"default message"}
    return `(${exactMatch}${pluralMatch}${other})`;
}

  _getPoundFormat(node, paramAccumulator) {
    if (!node) {
      throw new Error("Unexpected pound roken outside of the plural rule!");
    }
    const offset = node.offset !== 0 ? `-${node.offset}` :  '';
    const num = this._getParameterExpression(node, paramAccumulator, 'number');
    return `new Intl.NumberFormat("${this._locale}").format(${num}${offset})`;
  }

  _getSelectOptions(node, paramAccumulator, pluralNode) {
    const options = node.options;
    const opts = []; // regular options
    let other = ''; // default option
    const exactPlurals = []; // exact plural values
    Object.keys(options).forEach(key => {
      const opt = options[key];
      if (key === 'other') {
        other = `||${this._processParts(opt.value, paramAccumulator, pluralNode)}`;
      } else {
        if (pluralNode && key.length > 1 && key.startsWith('=')) {
          exactPlurals.push(`${key.substring(1)}:${this._processParts(opt.value, paramAccumulator, pluralNode)}`);
        } else {
          opts.push(`"${key}":${this._processParts(opt.value, paramAccumulator, pluralNode)}`);
        }
      }
    });

    return {opts, other, exactPlurals};
  }

 _getParameterExpression(node, paramAccumulator, type) {
   const paramName = node.value;
   paramAccumulator[paramName] = type || 'string';
    // no need to escape parameter name since it is supposed to be a valid identifier or number
    return `p["${paramName}"]`;
  }

  _stringifyOptions(obj) {
    if (opts === undefined)
      return opts;
    const inner = Object.keys(obj)
      .map(key => `${key}:${JSON.stringify(obj[key])}`)
      .join(',');
    return `{${inner}}`;
  }

  _getFormatOpts()  {
    return {
      number: {
        currency: {
          style: 'currency',
        },

        percent: {
          style: 'percent',
        },
      },

      date: {
        short: {
          month: 'numeric',
          day: 'numeric',
          year: '2-digit',
        },

        medium: {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        },

        long: {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        },

        full: {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        },
      },

      time: {
        short: {
          hour: 'numeric',
          minute: 'numeric',
        },

        medium: {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        },

        long: {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        },

        full: {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        },
      },
    };
  }
  _getLanguage() {
    return this._locale.split('-')[0];
  }
}




