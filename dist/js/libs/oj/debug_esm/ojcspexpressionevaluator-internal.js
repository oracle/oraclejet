/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExpParser, TEMPLATE_ELEMENT, TEMPLATE_LITERAL, NEW_EXP, ARROW_EXP, RETURN_STATEMENT, FUNCTION_EXP, OBJECT_EXP, getKeyValue, ARRAY_EXP, CONDITIONAL_EXP, LOGICAL_EXP, BINARY_EXP, UNARY_EXP, IDENTIFIER, CALL_EXP, MEMBER_EXP, LITERAL } from 'ojs/ojexpparser';

/**
 * @license
 * Copyright (c) 2019 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 *
 * @license
 * Based on the Expression Evaluator 2.0.0
 * https://github.com/donmccurdy/expression-eval
 * under MIT License
 * @ignore
 */

// Used by VTemplateEngine
const PROXY_SYMBOL = Symbol('proxy');

/**
 * @ignore
 * @constructor
 */
// eslint-disable-next-line no-unused-vars
const CspExpressionEvaluatorInternal = function (options) {
  var _parser = new ExpParser();
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
          ret = _evaluateAndUnwrap(parsed, scopes);
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
    return _evaluateAndUnwrap(ast, [context]);
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

  // Unwrap value if exists and it is a Proxy created by
  // VTemplateEngine around properties.
  function _evaluateAndUnwrap(node, contexts) {
    const value = _evaluate(node, contexts);
    return value?.[PROXY_SYMBOL] ?? value;
  }

  // eslint-disable-next-line consistent-return
  function _evaluate(node, contexts) {
    switch (node.type) {
      case IDENTIFIER:
        return _getValue(contexts, node.name);

      case MEMBER_EXP:
        return _evaluateMember(node, contexts)[1];

      case LITERAL:
        return node.value;

      case CALL_EXP:
        var caller;
        var fn;
        var assign;
        switch (node.callee.type) {
          case IDENTIFIER:
            assign = _getValueWithContext(contexts, node.callee.name);
            break;
          case MEMBER_EXP:
            assign = _evaluateMember(node.callee, contexts);
            break;
          default:
            fn = _evaluateAndUnwrap(node.callee, contexts);
        }
        if (!fn && Array.isArray(assign)) {
          caller = assign[0];
          fn = assign[1];
        }
        if (typeof fn !== 'function') {
          _throwError('Expression is not a function');
        }
        return fn.apply(caller, _evaluateArray(node.arguments, contexts));

      case UNARY_EXP:
        var testValue;
        try {
          testValue = _evaluateAndUnwrap(node.argument, contexts);
        } catch (e) {
          // Undefined identifier will throw an error, don't report it
          if (node.argument.type !== IDENTIFIER) {
            throw e;
          }
        }
        return _unops[node.operator](testValue);

      case BINARY_EXP:
        if (node.operator === '=') {
          return _evaluateAssignment(node.left, contexts, _evaluateAndUnwrap(node.right, contexts));
        }
        return _binops[node.operator](
          _evaluateAndUnwrap(node.left, contexts),
          _evaluateAndUnwrap(node.right, contexts)
        );

      case LOGICAL_EXP:
        return _binops[node.operator](_evaluateAndUnwrap(node.left, contexts), function () {
          return _evaluateAndUnwrap(node.right, contexts);
        });

      case CONDITIONAL_EXP:
        return _evaluateAndUnwrap(node.test, contexts)
          ? _evaluateAndUnwrap(node.consequent, contexts)
          : _evaluateAndUnwrap(node.alternate, contexts);

      case ARRAY_EXP:
        return _evaluateArray(node.elements, contexts);

      case OBJECT_EXP:
        return _evaluateObjectExpression(node, contexts);

      case FUNCTION_EXP:
      case ARROW_EXP:
        return _evaluateFunctionExpression(node, contexts);

      case NEW_EXP:
        return _evaluateConstructorExpression(node, contexts);

      case TEMPLATE_LITERAL:
        return _evaluateTemplateLiteral(node, contexts);

      case TEMPLATE_ELEMENT:
        return node.value.cooked;

      default:
        throw new Error('Unsupported expression type: ' + node.type);
    }
  }

  function _evaluateArray(list, contexts) {
    return list.reduce((acc, v) => {
      const elem = _evaluateAndUnwrap(v, contexts);
      if (elem instanceof _Spread) {
        acc.push(...elem.items());
      } else {
        acc.push(elem);
      }
      return acc;
    }, []);
  }

  function _evaluateMember(node, contexts) {
    var memberAccess = _getMemberAccess(node, contexts);
    if (memberAccess.length === 0) {
      return memberAccess;
    }
    var value = _getMemberValue(memberAccess);
    return [memberAccess[0], value];
  }

  function _getMemberAccess(node, contexts) {
    var object = _evaluate(node.object, contexts);
    if (!object && node.optional) {
      // handle optional chaining operator: test?.prop
      return [];
    }
    var key = node.computed ? _evaluate(node.property, contexts) : node.property.name;
    return _getMemberAccessForKey(object, key);
  }

  function _evaluateObjectExpression(node, contexts) {
    return node.properties.reduce(function (acc, curr) {
      const key = getKeyValue(curr.key);
      Object.defineProperty(acc, key, {
        configurable: true,
        enumerable: true,
        value: _evaluateAndUnwrap(curr.value, contexts),
        writable: true
      });
      return acc;
    }, {});
  }

  // eslint-disable-next-line consistent-return
  function _getValue(contexts, name) {
    var target = _getContextForIdentifier(contexts, name);
    if (target) {
      return _getMemberValue(_getMemberAccessForKey(target, name));
    }
    throw new Error('Variable ' + name + ' is undefined');
  }

  // eslint-disable-next-line consistent-return
  function _getValueWithContext(contexts, name) {
    var target = _getContextForIdentifier(contexts, name);
    if (target) {
      return [target, _getMemberValue(_getMemberAccessForKey(target, name))];
    }
    throw new Error('Variable ' + name + ' is undefined');
  }

  function _evaluateAssignment(node, contexts, val) {
    switch (node.type) {
      case IDENTIFIER:
        var name = node.name;
        var target = _getContextForIdentifier(contexts, name);
        if (!target) {
          _throwError('Cannot assign value to undefined variable ' + name);
        }
        var identifierAccess = _getMemberAccessForKey(target, name);
        if (_isRestrictedMemberKey(identifierAccess[1])) {
          _throwError('Assignment to member "' + identifierAccess[1] + '" is not allowed');
        }
        identifierAccess[0][identifierAccess[1]] = val;
        break;
      case MEMBER_EXP:
        var memberAccess = _getMemberAccess(node, contexts);
        if (_isRestrictedMemberKey(memberAccess[1])) {
          _throwError('Assignment to member "' + memberAccess[1] + '" is not allowed');
        }
        memberAccess[0][memberAccess[1]] = val;
        break;
      default:
        _throwError('Expression of type: ' + node.type + ' not supported for assignment');
    }
    return val;
  }

  function _evaluateFunctionExpression(node, contexts) {
    return function () {
      var _args = arguments;

      var argScope = node.params.reduce(function (acc, arg, i) {
        acc[arg.name] = _args[i];
        return acc;
      }, {});

      // eslint-disable-next-line dot-notation
      argScope['this'] = this;

      try {
        // Expect to get node.body.type = 'BlockStatement'.
        // Expect to get node.body.body = {type: 'ReturnStatement', argument: <node to evaluate>} || <node to evaluate>
        const hasReturn = node.body.body.type === RETURN_STATEMENT;
        const codeBlock = hasReturn ? node.body.body.argument : node.body.body;
        const val = _evaluateAndUnwrap(codeBlock, [argScope].concat(contexts));
        return hasReturn ? val : undefined;
      } catch (e) {
        _throwErrorWithExpression(e, node.body.expr);
      }
      return undefined;
    };
  }

  function _evaluateConstructorExpression(node, contexts) {
    var constrObj = _evaluateAndUnwrap(node.callee, contexts);
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
    const resolvedExpressions = node.expressions.map((expr) => _evaluateAndUnwrap(expr, contexts));
    const result = node.quasis.reduce((acc, curVal, curIndex) => {
      acc.push(_evaluateAndUnwrap(curVal, contexts));
      if (curIndex < resolvedExpressions.length) {
        acc.push(resolvedExpressions[curIndex]);
      }
      return acc;
    }, []);
    return result.join('');
  }

  // Block prototype-chain escape hatches. Safe data objects can still expose these
  // names as own, non-accessor properties, but never as inherited capabilities.
  function _getMemberAccessForKey(object, key) {
    var propertyKey = typeof key === 'symbol' ? key : String(key);
    return [object, propertyKey, _validateMemberKey(object, propertyKey)];
  }

  function _validateMemberKey(object, key) {
    if (object === Object && _isUnsafeObjectStaticMember(key)) {
      _throwError('Access to member "' + key + '" is not allowed');
    } else if (_isInheritedIntrinsicPrototypeHelper(object, key)) {
      _throwError('Access to member "' + key + '" is not allowed');
    }
    if (!_isRestrictedMemberKey(key)) {
      return null;
    }
    var descriptor = Object.getOwnPropertyDescriptor(Object(object), key);
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
      _throwError('Access to member "' + key + '" is not allowed');
    } else if (typeof descriptor.value === 'function') {
      _throwError('Access to member "' + key + '" is not allowed');
    } else if (key === 'prototype' && typeof object === 'function') {
      _throwError('Access to member "' + key + '" is not allowed');
    }
    return descriptor;
  }

  function _getMemberValue(memberAccess) {
    // For restricted keys, use the validated data-descriptor value rather than
    // invoking a Proxy get trap that could return a different capability.
    return memberAccess[2] ? memberAccess[2].value : memberAccess[0][memberAccess[1]];
  }

  function _isRestrictedMemberKey(propertyKey) {
    return (
      propertyKey === 'constructor' || propertyKey === '__proto__' || propertyKey === 'prototype'
    );
  }

  // These legacy accessors can recover or modify an intrinsic prototype without
  // evaluating a restricted member name. Allow applications to use an own data
  // property with one of these names, but reject the inherited intrinsic helpers.
  function _isInheritedIntrinsicPrototypeHelper(object, propertyKey) {
    if (
      propertyKey !== '__lookupGetter__' &&
      propertyKey !== '__lookupSetter__' &&
      propertyKey !== '__defineGetter__' &&
      propertyKey !== '__defineSetter__'
    ) {
      return false;
    }

    var target = Object(object);
    var visitedTargets = new Set();
    while (target) {
      // An extensible Proxy can report itself, or an earlier object, as its
      // prototype. Treat cycles as unsafe rather than looping indefinitely.
      if (visitedTargets.has(target)) {
        return true;
      }
      visitedTargets.add(target);
      var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (descriptor) {
        return (
          (target === Object.prototype || target === Function.prototype) &&
          typeof descriptor.value === 'function'
        );
      }
      target = Object.getPrototypeOf(target);
    }
    return false;
  }

  // The evaluator exposes Object by default. These reflection methods can otherwise
  // retrieve or mutate intrinsic prototypes and recover Function through descriptors.
  function _isUnsafeObjectStaticMember(propertyKey) {
    return (
      propertyKey === 'assign' ||
      propertyKey === 'create' ||
      propertyKey === 'defineProperty' ||
      propertyKey === 'defineProperties' ||
      propertyKey === 'getOwnPropertyDescriptor' ||
      propertyKey === 'getOwnPropertyDescriptors' ||
      propertyKey === 'getPrototypeOf' ||
      propertyKey === 'setPrototypeOf'
    );
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

export { CspExpressionEvaluatorInternal, PROXY_SYMBOL };
