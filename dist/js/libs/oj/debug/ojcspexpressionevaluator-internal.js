/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojexpparser'], function (exports, ojexpparser) { 'use strict';

  /**
   * @license
   * Copyright (c) 2019 2024, Oracle and/or its affiliates.
   * Licensed under The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   *
   * @license
   * Based on the Expression Evaluator 2.0.0
   * https://github.com/donmccurdy/expression-eval
   * under MIT License
   * @ignore
   */

  /**
   * @ignore
   * @constructor
   */
  // eslint-disable-next-line no-unused-vars
  const CspExpressionEvaluatorInternal = function (options) {
    var _parser = new ojexpparser.ExpParser();
    var _options = Object.assign({}, options);
    if (!(_options.globalScope && _options.globalScope.Object)) {
      _options.globalScope = Object.assign({ Object: Object }, _options.globalScope);
    }

    /**
     * Creates expression evaluator
     * @param {string} expressionText expression associated  with the returned evaluator
     * @return {Object} an object with the 'evaluate' key referencing a function that
     * will return the result of evaluation. The function will take an array of scoping contexts ordered from the
     * most specific to the least specific
     * @ignore
     */
    this.createEvaluator = function (expressionText) {
      var parsed;
      try {
        parsed = _parser.parse(expressionText);
      } catch (e) {
        _throwErrorWithExpression(e, expressionText);
      }
      var extraScope = _options.globalScope;
      return {
        evaluate: function (contexts) {
          var ret;
          var scopes = contexts;
          if (extraScope) {
            scopes = contexts.concat([extraScope]);
          }
          try {
            ret = _evaluate(parsed, scopes);
          } catch (e) {
            _throwErrorWithExpression(e, expressionText);
          }
          return ret;
        }
      };
    };

    /**
     * @param {object} ast an AST node
     * @param {object} context a context object to apply on expressions
     * @ignore
     */
    this.evaluate = function (ast, context) {
      return _evaluate(ast, [context]);
    };

    // Note, for logical && and || operators the right hand expression
    // is always a callback. It is done to ensure that the right hand
    // expression is evaluated only if it is needed and only after
    // left hand expression is evaluated.
    var _binops = {
      '||': function (a, b) {
        return a || b();
      },
      '??': function (a, b) {
        return a ?? b();
      },
      '&&': function (a, b) {
        return a && b();
      },
      '|': function (a, b) {
        return a | b;
      },
      '^': function (a, b) {
        return a ^ b;
      },
      '&': function (a, b) {
        return a & b;
      },
      '==': function (a, b) {
        return a == b;
      },
      '!=': function (a, b) {
        return a != b;
      },
      '===': function (a, b) {
        return a === b;
      },
      '!==': function (a, b) {
        return a !== b;
      },
      '<': function (a, b) {
        return a < b;
      },
      '>': function (a, b) {
        return a > b;
      },
      '<=': function (a, b) {
        return a <= b;
      },
      '>=': function (a, b) {
        return a >= b;
      },
      '<<': function (a, b) {
        return a << b;
      },
      '>>': function (a, b) {
        return a >> b;
      },
      '>>>': function (a, b) {
        return a >>> b;
      },
      '+': function (a, b) {
        return a + b;
      },
      '-': function (a, b) {
        return a - b;
      },
      '*': function (a, b) {
        return a * b;
      },
      '/': function (a, b) {
        return a / b;
      },
      '%': function (a, b) {
        return a % b;
      },
      '**': function (a, b) {
        return a ** b;
      },
      instanceof: function (a, b) {
        return a instanceof b;
      }
    };

    var _unops = {
      '-': function (a) {
        return -a;
      },
      '+': function (a) {
        return a;
      },
      '~': function (a) {
        return ~a;
      },
      '!': function (a) {
        return !a;
      },
      '...': function (a) {
        return new _Spread(a);
      },
      typeof: function (a) {
        return typeof a;
      }
    };

    function _Spread(list) {
      this.items = function () {
        return list;
      };
    }

    // eslint-disable-next-line consistent-return
    function _evaluate(node, contexts) {
      switch (node.type) {
        case ojexpparser.IDENTIFIER:
          return _getValue(contexts, node.name);

        case ojexpparser.MEMBER_EXP:
          return _evaluateMember(node, contexts)[1];

        case ojexpparser.LITERAL:
          return node.value;

        case ojexpparser.CALL_EXP:
          var caller;
          var fn;
          var assign;
          switch (node.callee.type) {
            case ojexpparser.IDENTIFIER:
              assign = _getValueWithContext(contexts, node.callee.name);
              break;
            case ojexpparser.MEMBER_EXP:
              assign = _evaluateMember(node.callee, contexts);
              break;
            default:
              fn = _evaluate(node.callee, contexts);
          }
          if (!fn && Array.isArray(assign)) {
            caller = assign[0];
            fn = assign[1];
          }
          if (typeof fn !== 'function') {
            _throwError('Expression is not a function');
          }
          return fn.apply(caller, _evaluateArray(node.arguments, contexts));

        case ojexpparser.UNARY_EXP:
          var testValue;
          try {
            testValue = _evaluate(node.argument, contexts);
          } catch (e) {
            // Undefined identifier will throw an error, don't report it
            if (node.argument.type !== ojexpparser.IDENTIFIER) {
              throw e;
            }
          }
          return _unops[node.operator](testValue);

        case ojexpparser.BINARY_EXP:
          if (node.operator === '=') {
            return _evaluateAssignment(node.left, contexts, _evaluate(node.right, contexts));
          }
          return _binops[node.operator](
            _evaluate(node.left, contexts),
            _evaluate(node.right, contexts)
          );

        case ojexpparser.LOGICAL_EXP:
          return _binops[node.operator](_evaluate(node.left, contexts), function () {
            return _evaluate(node.right, contexts);
          });

        case ojexpparser.CONDITIONAL_EXP:
          return _evaluate(node.test, contexts)
            ? _evaluate(node.consequent, contexts)
            : _evaluate(node.alternate, contexts);

        case ojexpparser.ARRAY_EXP:
          return _evaluateArray(node.elements, contexts);

        case ojexpparser.OBJECT_EXP:
          return _evaluateObjectExpression(node, contexts);

        case ojexpparser.FUNCTION_EXP:
          return _evaluateFunctionExpression(node, contexts);

        case ojexpparser.NEW_EXP:
          return _evaluateConstructorExpression(node, contexts);

        case ojexpparser.TEMPLATE_LITERAL:
          return _evaluateTemplateLiteral(node, contexts);

        case ojexpparser.TEMPLATE_ELEMENT:
          return node.value.cooked;

        default:
          throw new Error('Unsupported expression type: ' + node.type);
      }
    }

    function _evaluateArray(list, contexts) {
      return list.reduce((acc, v) => {
        const elem = _evaluate(v, contexts);
        if (elem instanceof _Spread) {
          acc.push(...elem.items());
        } else {
          acc.push(elem);
        }
        return acc;
      }, []);
    }

    function _evaluateMember(node, contexts) {
      var object = _evaluate(node.object, contexts);
      if (!object && node.optional) {
        // handle optional chaining operator: test?.prop
        return [];
      } else if (node.computed) {
        return [object, object[_evaluate(node.property, contexts)]];
      }
      return [object, object[node.property.name]];
    }

    function _evaluateObjectExpression(node, contexts) {
      return node.properties.reduce(function (acc, curr) {
        const key = ojexpparser.getKeyValue(curr.key);
        acc[key] = _evaluate(curr.value, contexts);
        return acc;
      }, {});
    }

    // eslint-disable-next-line consistent-return
    function _getValue(contexts, name) {
      var target = _getContextForIdentifier(contexts, name);
      if (target) {
        return target[name];
      }
      throw new Error('Variable ' + name + ' is undefined');
    }

    // eslint-disable-next-line consistent-return
    function _getValueWithContext(contexts, name) {
      var target = _getContextForIdentifier(contexts, name);
      if (target) {
        return [target, target[name]];
      }
      throw new Error('Variable ' + name + ' is undefined');
    }

    function _evaluateAssignment(node, contexts, val) {
      switch (node.type) {
        case ojexpparser.IDENTIFIER:
          var name = node.name;
          var target = _getContextForIdentifier(contexts, name);
          if (!target) {
            _throwError('Cannot assign value to undefined variable ' + name);
          }
          target[name] = val;
          break;
        case ojexpparser.MEMBER_EXP:
          var key = node.computed ? _evaluate(node.property, contexts) : node.property.name;
          _evaluateMember(node, contexts)[0][key] = val;
          break;
        default:
          _throwError('Expression of type: ' + node.type + ' not supported for assignment');
      }
      return val;
    }

    function _evaluateFunctionExpression(node, contexts) {
      // eslint-disable-next-line consistent-return
      return function () {
        var _args = arguments;

        var argScope = node.arguments.reduce(function (acc, arg, i) {
          acc[arg.name] = _args[i];
          return acc;
        }, {});

        // eslint-disable-next-line dot-notation
        argScope['this'] = this;

        try {
          var val = _evaluate(node.body, [argScope].concat(contexts));

          if (node.return) {
            return val;
          }
        } catch (e) {
          _throwErrorWithExpression(e, node.expr);
        }
      };
    }

    function _evaluateConstructorExpression(node, contexts) {
      var constrObj = _evaluate(node.callee, contexts);
      if (!(constrObj instanceof Function)) {
        _throwError('Node of type ' + node.callee.type + ' is not evaluated into a constructor');
      }

      // eslint-disable-next-line new-parens
      return new (Function.prototype.bind.apply(
        constrObj,
        [null].concat(_evaluateArray(node.arguments, contexts))
      ))();
    }

    function _evaluateTemplateLiteral(node, contexts) {
      const resolvedExpressions = node.expressions.map((expr) => _evaluate(expr, contexts));
      const result = node.quasis.reduce((acc, curVal, curIndex) => {
        acc.push(_evaluate(curVal, contexts));
        if (curIndex < resolvedExpressions.length) {
          acc.push(resolvedExpressions[curIndex]);
        }
        return acc;
      }, []);
      return result.join('');
    }

    function _getContextForIdentifier(contexts, name) {
      for (var i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        if (context instanceof Object && name in context) {
          return context;
        }
      }
      return null;
    }

    function _throwError(message) {
      throw new Error(message);
    }
    function _throwErrorWithExpression(e, expression) {
      throw new Error(e.message + ' in expression "' + expression + '"');
    }
  };

  exports.CspExpressionEvaluatorInternal = CspExpressionEvaluatorInternal;

  Object.defineProperty(exports, '__esModule', { value: true });

});
