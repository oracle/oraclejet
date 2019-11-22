/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(function()
{
  "use strict";


/* global Map:false */

/* eslint-disable no-use-before-define */

/* eslint-disable one-var-declaration-per-line */

/* eslint-disable no-plusplus */

/* eslint-disable camelcase */

/* eslint-disable one-var */

/* eslint-disable no-param-reassign */
// Based on JSEP Parser
//
//     JavaScript Expression Parser (JSEP) 0.3.4
//     JSEP may be freely distributed under the MIT License
//     http://jsep.from.so/

/**
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
function ExpParser() {
  // Parsing
  // -------
  // `expr` is a string with the passed in expression
  this.parse = function (expr) {
    // `index` stores the character number we are currently at while `length` is a constant
    // All of the gobbles below will modify `index` as we move along
    var length = expr.length;
    var context = {
      index: 0,
      expr: expr
    };
    var nodes = [];

    while (context.index < length) {
      var ch_i = expr.charCodeAt(context.index); // Expressions can be separated by semicolons, commas, or just inferred without any
      // separators

      if (ch_i === SEMCOL_CODE || ch_i === COMMA_CODE) {
        context.index++; // ignore separators
      } else {
        var node = _gobbleExpression(context);

        if (node) {
          nodes.push(node); // If we weren't able to find a binary expression and are out of room, then
          // the expression passed in probably has too much
        } else if (context.index < length) {
          _throwError('Unexpected "' + expr.charAt(context.index) + '"', context.index);
        }
      }
    } // If there's only one expression just try returning the expression


    if (nodes.length === 1) {
      return nodes[0];
    }

    return {
      type: 0,
      // 'Compound'
      body: nodes
    };
  }; // Push `index` up to the next non-space character


  function _gobbleSpaces(context) {
    var expr = context.expr;
    var ch = expr.charCodeAt(context.index); // space or tab

    while (ch === 32 || ch === 9 || ch === 10 || ch === 13) {
      ch = expr.charCodeAt(++context.index);
    }
  } // The main parsing function. Much of this code is dedicated to ternary expressions
  // eslint-disable-next-line consistent-return


  function _gobbleExpression(context) {
    var expr = context.expr;

    var test = _gobbleBinaryExpression(context),
        consequent,
        alternate;

    _gobbleSpaces(context);

    if (expr.charCodeAt(context.index) === QUMARK_CODE) {
      // Ternary expression: test ? consequent : alternate
      context.index++;
      consequent = _gobbleExpression(context);

      if (!consequent) {
        _throwError('Expected expression', context.index);
      }

      _gobbleSpaces(context);

      if (expr.charCodeAt(context.index) === COLON_CODE) {
        context.index++;
        alternate = _gobbleExpression(context);

        if (!alternate) {
          _throwError('Expected expression', context.index);
        }

        return {
          type: 8,
          // ConditionalExpression,
          test: test,
          consequent: consequent,
          alternate: alternate
        };
      }

      _throwError('Expected :', context.index);
    } else {
      return test;
    }
  } // Search for the operation portion of the string (e.g. `+`, `===`)
  // Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
  // and move down from 3 to 2 to 1 character until a matching binary operation is found
  // then, return that binary operation


  function _gobbleBinaryOp(context) {
    var expr = context.expr;

    _gobbleSpaces(context);

    var to_check = expr.substr(context.index, _max_binop_len),
        tc_len = to_check.length;

    while (tc_len > 0) {
      // Don't accept a binary op when it is an identifier.
      // Binary ops that start with a identifier-valid character must be followed
      // by a non identifier-part valid character
      if (_binary_ops[to_check] && (!_isIdentifierStart(expr.charCodeAt(context.index)) || context.index + to_check.length < expr.length && !_isIdentifierPart(expr.charCodeAt(context.index + to_check.length)))) {
        context.index += tc_len;
        return to_check;
      }

      to_check = to_check.substr(0, --tc_len);
    }

    return false;
  } // This function is responsible for gobbling an individual expression,
  // e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`


  function _gobbleBinaryExpression(context) {
    var node, biop, prec, stack, biop_info, left, right, i, cur_biop; // First, try to get the leftmost thing
    // Then, check to see if there's a binary operator operating on that leftmost thing

    left = _gobbleToken(context);
    biop = _gobbleBinaryOp(context); // If there wasn't a binary operator, just return the leftmost node

    if (!biop) {
      return left;
    } // Otherwise, we need to start a stack to properly place the binary operations in their
    // precedence structure


    biop_info = {
      value: biop,
      prec: _binaryPrecedence(biop)
    };
    right = _gobbleToken(context);

    if (!right) {
      _throwError('Expected expression after ' + biop, context.index);
    }

    stack = [left, biop_info, right]; // Properly deal with precedence using [recursive descent](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
    // eslint-disable-next-line no-cond-assign

    while (biop = _gobbleBinaryOp(context)) {
      prec = _binaryPrecedence(biop);

      if (prec === 0) {
        break;
      }

      biop_info = {
        value: biop,
        prec: prec
      };
      cur_biop = biop; // Reduce: make a binary expression from the three topmost entries.

      while (stack.length > 2 && prec <= stack[stack.length - 2].prec) {
        right = stack.pop();
        biop = stack.pop().value;
        left = stack.pop();
        node = _createBinaryExpression(biop, left, right, context);
        stack.push(node);
      }

      node = _gobbleToken(context);

      if (!node) {
        _throwError('Expected expression after ' + cur_biop, context.index);
      }

      stack.push(biop_info, node);
    }

    i = stack.length - 1;
    node = stack[i];

    while (i > 1) {
      node = _createBinaryExpression(stack[i - 1].value, stack[i - 2], node, context);
      i -= 2;
    }

    return node;
  } // An individual part of a binary expression:
  // e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)


  function _gobbleToken(context) {
    var expr = context.expr;
    var ch, to_check, tc_len;

    _gobbleSpaces(context);

    ch = expr.charCodeAt(context.index);

    if (_isDecimalDigit(ch) || ch === PERIOD_CODE) {
      // Char code 46 is a dot `.` which can start off a numeric literal
      return _gobbleNumericLiteral(context);
    } else if (ch === SQUOTE_CODE || ch === DQUOTE_CODE) {
      // Single or double quotes
      return _gobbleStringLiteral(context);
    } else if (ch === OBRACK_CODE) {
      return _gobbleArray(context);
    } else if (ch === OBRACE_CODE) {
      return _gobbleObjectLiteral(context);
    }

    to_check = expr.substr(context.index, _max_unop_len);
    tc_len = to_check.length;

    while (tc_len > 0) {
      // Don't accept an unary op when it is an identifier.
      // Unary ops that start with a identifier-valid character must be followed
      // by a non identifier-part valid character
      if (to_check in _unary_ops && (!_isIdentifierStart(expr.charCodeAt(context.index)) || context.index + to_check.length < expr.length && !_isIdentifierPart(expr.charCodeAt(context.index + to_check.length)))) {
        context.index += tc_len;
        return {
          type: 5,
          // 'UnaryExpression'
          operator: to_check,
          argument: _gobbleToken(context),
          prefix: true
        };
      }

      to_check = to_check.substr(0, --tc_len);
    }

    var start = context.index;

    if (expr.substring(start, start + 8) === 'function') {
      context.index += 8;
      return _gobbleFunction(context);
    }

    if (_isIdentifierStart(ch) || ch === OPAREN_CODE) {
      // open parenthesis
      // `foo`, `bar.baz`
      return _gobbleVariable(context);
    }

    return false;
  } // Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
  // keep track of everything in the numeric literal and then calling `parseFloat` on that string


  function _gobbleNumericLiteral(context) {
    var expr = context.expr;
    var number = '',
        ch,
        chCode;

    while (_isDecimalDigit(expr.charCodeAt(context.index))) {
      number += expr.charAt(context.index++);
    }

    if (expr.charCodeAt(context.index) === PERIOD_CODE) {
      // can start with a decimal marker
      number += expr.charAt(context.index++);

      while (_isDecimalDigit(expr.charCodeAt(context.index))) {
        number += expr.charAt(context.index++);
      }
    }

    ch = expr.charAt(context.index);

    if (ch === 'e' || ch === 'E') {
      // exponent marker
      number += expr.charAt(context.index++);
      ch = expr.charAt(context.index);

      if (ch === '+' || ch === '-') {
        // exponent sign
        number += expr.charAt(context.index++);
      }

      while (_isDecimalDigit(expr.charCodeAt(context.index))) {
        // exponent itself
        number += expr.charAt(context.index++);
      }

      if (!_isDecimalDigit(expr.charCodeAt(context.index - 1))) {
        _throwError('Expected exponent (' + number + expr.charAt(context.index) + ')', context.index);
      }
    }

    chCode = expr.charCodeAt(context.index); // Check to make sure this isn't a variable name that start with a number (123abc)

    if (_isIdentifierStart(chCode)) {
      _throwError('Variable names cannot start with a number (' + number + expr.charAt(context.index) + ')', context.index);
    } else if (chCode === PERIOD_CODE) {
      _throwError('Unexpected period', context.index);
    }

    return {
      type: 3,
      // "Literal"
      value: parseFloat(number),
      raw: number
    };
  } // Parses a string literal, staring with single or double quotes with basic support for escape codes
  // e.g. `"hello world"`, `'this is\nJSEP'`


  function _gobbleStringLiteral(context) {
    var expr = context.expr;
    var str = '',
        quote = expr.charAt(context.index++),
        closed = false,
        ch;
    var length = expr.length;

    while (context.index < length) {
      ch = expr.charAt(context.index++);

      if (ch === quote) {
        closed = true;
        break;
      } else if (ch === '\\') {
        // Check for all of the common escape codes
        ch = expr.charAt(context.index++);

        switch (ch) {
          case 'n':
            str += '\n';
            break;

          case 'r':
            str += '\r';
            break;

          case 't':
            str += '\t';
            break;

          case 'b':
            str += '\b';
            break;

          case 'f':
            str += '\f';
            break;

          case 'v':
            str += '\x0B';
            break;

          default:
            str += ch;
        }
      } else {
        str += ch;
      }
    }

    if (!closed) {
      _throwError('Unclosed quote after "' + str + '"', context.index);
    }

    return {
      type: 3,
      // "Literal"
      value: str,
      raw: quote + str + quote
    };
  } // Gobbles only identifiers
  // e.g.: `foo`, `_value`, `$x1`
  // Also, this function checks if that identifier is a literal:
  // (e.g. `true`, `false`, `null`) or `this`


  function _gobbleIdentifier(context) {
    var expr = context.expr;
    var ch = expr.charCodeAt(context.index),
        start = context.index,
        identifier;

    if (_isIdentifierStart(ch)) {
      context.index++;
    } else {
      _throwError('Unexpected ' + expr.charAt(context.index), context.index);
    }

    var length = expr.length;

    while (context.index < length) {
      ch = expr.charCodeAt(context.index);

      if (_isIdentifierPart(ch)) {
        context.index++;
      } else {
        break;
      }
    }

    identifier = expr.slice(start, context.index);

    if (identifier === 'new') {
      // process constructor expression, e.g. new Date('Jan 1, 2016')
      _gobbleSpaces(context);

      var constructorNode = _gobbleVariable(context, 4); // stop at CallExpression type


      if (constructorNode.type !== 4) {
        _throwError('Expression of type: ' + constructorNode.type + ' not supported for constructor expression');
      }

      return {
        type: 12,
        // 'ConstructorExpression'
        callee: constructorNode.callee,
        arguments: constructorNode.arguments
      };
    }

    if (_literals.has(identifier)) {
      return {
        type: 3,
        // 'Literal'
        value: _literals.get(identifier),
        raw: identifier
      };
    }

    return {
      type: 1,
      // 'Identifier'
      name: identifier
    };
  } // Gobbles a list of arguments within the context of a function call
  // or array literal. This function also assumes that the opening character
  // `(` or `[` has already been gobbled, and gobbles expressions and commas
  // until the terminator character `)` or `]` is encountered.
  // e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`


  function _gobbleArguments(context, termination, identifiersOnly) {
    var expr = context.expr;
    var length = expr.length;
    var ch_i,
        args = [],
        node,
        closed = false;
    var separator_count = 0;

    while (context.index < length) {
      _gobbleSpaces(context);

      ch_i = expr.charCodeAt(context.index);

      if (ch_i === termination) {
        // done parsing
        closed = true;
        context.index++;

        if (termination === CPAREN_CODE && separator_count && separator_count >= args.length) {
          _throwError('Unexpected token ' + String.fromCharCode(termination), context.index);
        }

        break;
      } else if (ch_i === COMMA_CODE) {
        // between expressions
        context.index++;
        separator_count++;

        if (separator_count !== args.length) {
          // missing argument
          if (termination === CPAREN_CODE) {
            _throwError('Unexpected token ,', context.index);
          } else if (termination === CBRACK_CODE) {
            for (var arg = args.length; arg < separator_count; arg++) {
              args.push(null);
            }
          }
        }
      } else {
        if (identifiersOnly) {
          node = _gobbleIdentifier(context);
        } else {
          node = _gobbleExpression(context);
        }

        if (!node || args.length > separator_count) {
          _throwError('Expected comma', context.index);
        }

        args.push(node);
      }
    }

    if (!closed) {
      _throwError('Expected ' + String.fromCharCode(termination), context.index);
    }

    return args;
  } // Gobble a non-literal variable name. This variable name may include properties
  // e.g. `foo`, `bar.baz`, `foo['bar'].baz`
  // It also gobbles function calls:
  // e.g. `Math.acos(obj.angle)`


  function _gobbleVariable(context, stopAtType) {
    var expr = context.expr;
    var ch_i, node;
    ch_i = expr.charCodeAt(context.index);

    if (ch_i === OPAREN_CODE) {
      node = _gobbleGroup(context);
    } else {
      node = _gobbleIdentifier(context);
    }

    _gobbleSpaces(context);

    ch_i = expr.charCodeAt(context.index);

    while (ch_i === PERIOD_CODE || ch_i === OBRACK_CODE || ch_i === OPAREN_CODE) {
      context.index++;

      if (ch_i === PERIOD_CODE) {
        _gobbleSpaces(context);

        node = {
          type: 2,
          // 'MemberExpression'
          computed: false,
          object: node,
          property: _gobbleIdentifier(context)
        };
      } else if (ch_i === OBRACK_CODE) {
        node = {
          type: 2,
          // 'MemberExpression'
          computed: true,
          object: node,
          property: _gobbleExpression(context)
        };

        _gobbleSpaces(context);

        ch_i = expr.charCodeAt(context.index);

        if (ch_i !== CBRACK_CODE) {
          _throwError('Unclosed [', context.index);
        }

        context.index++;
      } else if (ch_i === OPAREN_CODE) {
        // A function call is being made; gobble all the arguments
        node = {
          type: 4,
          // 'CallExpression'
          arguments: _gobbleArguments(context, CPAREN_CODE),
          callee: node
        };
      } // stop is used for constructor types, e.g. new Date('Jan 1, 2016').toISOString()
      // treat constructor as a group, then execute the rest


      if (stopAtType === node.type) {
        return node;
      }

      _gobbleSpaces(context);

      ch_i = expr.charCodeAt(context.index);
    }

    return node;
  } // Responsible for parsing a group of things within parentheses `()`
  // This function assumes that it needs to gobble the opening parenthesis
  // and then tries to gobble everything within that parenthesis, assuming
  // that the next thing it should see is the close parenthesis. If not,
  // then the expression probably doesn't have a `)`
  // eslint-disable-next-line consistent-return


  function _gobbleGroup(context) {
    context.index++;

    var node = _gobbleExpression(context);

    _gobbleSpaces(context);

    if (context.expr.charCodeAt(context.index) === CPAREN_CODE) {
      context.index++;
      return node;
    }

    _throwError('Unclosed (', context.index);
  } // Responsible for parsing Array literals `[1, 2, 3]`
  // This function assumes that it needs to gobble the opening bracket
  // and then tries to gobble the expressions as arguments.


  function _gobbleArray(context) {
    context.index++;
    return {
      type: 9,
      // 'ArrayExpression'
      elements: _gobbleArguments(context, CBRACK_CODE)
    };
  }

  function _gobbleFunction(context) {
    var expr = context.expr;

    _gobbleSpaces(context);

    var ch_i = expr.charCodeAt(context.index);

    if (ch_i !== OPAREN_CODE) {
      _throwError('Expected (,', context.index);
    }

    context.index++;

    var args = _gobbleArguments(context, CPAREN_CODE, true);

    _gobbleSpaces(context);

    ch_i = expr.charCodeAt(context.index);

    if (ch_i !== OBRACE_CODE) {
      _throwError('Expected {,', context.index);
    }

    context.index++;

    _gobbleSpaces(context);

    var startDef = context.index;
    var hasReturn;
    var start = context.index;

    if (expr.substring(start, start + 6) === 'return') {
      hasReturn = true;
      context.index += 6;
    }

    _gobbleSpaces(context);

    var body = _gobbleExpression(context);

    _gobbleSpaces(context);

    ch_i = expr.charCodeAt(context.index);

    if (ch_i === SEMCOL_CODE) {
      context.index++;

      _gobbleSpaces(context);
    }

    ch_i = expr.charCodeAt(context.index);

    if (ch_i !== CBRACE_CODE) {
      _throwError('Expected },', context.index);
    }

    context.index++;
    return {
      type: 11,
      // 'FunctionExpression'
      arguments: args,
      body: body,
      expr: expr.substring(startDef, context.index - 1),
      return: hasReturn
    };
  }

  function _gobbleObjectLiteral(context) {
    var expr = context.expr;
    context.index++;
    var props = [];
    var closed;
    var separator_count = 0;
    var length = expr.length;

    while (context.index < length && !closed) {
      _gobbleSpaces(context);

      var ch_i = expr.charCodeAt(context.index);

      if (ch_i === CBRACE_CODE) {
        // done parsing
        closed = true;
        context.index++;
      } else if (ch_i === COMMA_CODE) {
        // between expressions
        context.index++;
        separator_count++;

        if (separator_count !== props.length) {
          // missing argument
          _throwError('Unexpected token ,', context.index);
        }
      } else {
        var key;

        if (ch_i === SQUOTE_CODE || ch_i === DQUOTE_CODE) {
          // Single or double quotes
          key = _gobbleStringLiteral(context).value;
        } else {
          key = _gobbleIdentifier(context).name;
        }

        _gobbleSpaces(context);

        ch_i = expr.charCodeAt(context.index);

        if (ch_i !== COLON_CODE) {
          _throwError('Expected \':\'. Found ' + String.fromCharCode(ch_i), context.index);
        }

        context.index++; // Set "writer" property on the context while we are evaluating the expression
        // for property writers. We will only allow assignment operators if the flag is set

        var writer = context.writer;

        if (key === '_ko_property_writers') {
          context.writer = 1;
        }

        try {
          props.push({
            key: key,
            value: _gobbleExpression(context)
          });
        } finally {
          context.writer = writer;
        }
      }
    }

    if (!closed) {
      _throwError('Expected ' + String.fromCharCode(CBRACE_CODE), context.index);
    }

    return {
      type: 10,
      // 'ObjectExpression'
      properties: props
    };
  }
  /*
  // This is the full set of types that any JSEP node can be.
  // The literals are replaced with numbers in the code for faster comparison
  var COMPOUND = 'Compound',            // 0
    IDENTIFIER = 'Identifier',          // 1
    MEMBER_EXP = 'MemberExpression',    // 2
    LITERAL = 'Literal',                // 3
    CALL_EXP = 'CallExpression',        // 4
    UNARY_EXP = 'UnaryExpression',      // 5
    BINARY_EXP = 'BinaryExpression',    // 6
    LOGICAL_EXP = 'LogicalExpression',  // 7
    CONDITIONAL_EXP = 'ConditionalExpression',// 8
    ARRAY_EXP = 'ArrayExpression',      // 9
    OBJECT_EXP = 'ObjectExpression',    // 10
    FUNCTION_EXP = 'FunctionExpression',// 11
    CONSTRUCTOR_EXP = 'ConstructorExpression',// 12
  */


  var PERIOD_CODE = 46,
      // '.'
  COMMA_CODE = 44,
      // ','
  SQUOTE_CODE = 39,
      // single quote
  DQUOTE_CODE = 34,
      // double quotes
  OPAREN_CODE = 40,
      // (
  CPAREN_CODE = 41,
      // )
  OBRACK_CODE = 91,
      // [
  CBRACK_CODE = 93,
      // ]
  QUMARK_CODE = 63,
      // ?
  SEMCOL_CODE = 59,
      // ;
  COLON_CODE = 58,
      // :
  OBRACE_CODE = 123,
      // {
  CBRACE_CODE = 125; // }

  function _getMaxKeyLen(obj) {
    return Object.keys(obj).reduce(function (curr, key) {
      return Math.max(curr, key.length);
    }, 0);
  } // Operations
  // ----------
  // Set `t` to `true` to save space (when minified, not gzipped)


  var t = true,
      // Use a quickly-accessible map to store all of the unary operators
  // Values are set to `true` (it really doesn't matter)
  _unary_ops = {
    '-': t,
    '!': t,
    '~': t,
    '+': t
  },
      // Also use a map for the binary operations but set their values to their
  // binary precedence for quick reference:
  // see [Order of operations](http://en.wikipedia.org/wiki/Order_of_operations#Programming_language)
  _binary_ops = {
    '=': 1,
    '||': 2,
    '&&': 3,
    '|': 4,
    '^': 5,
    '&': 6,
    '==': 7,
    '!=': 7,
    '===': 7,
    '!==': 7,
    '<': 8,
    '>': 8,
    '<=': 8,
    '>=': 8,
    '<<': 9,
    '>>': 9,
    '>>>': 9,
    '+': 10,
    '-': 10,
    '*': 11,
    '/': 11,
    '%': 11
  },
      // Get return the longest key length of any object
  _max_unop_len = _getMaxKeyLen(_unary_ops),
      _max_binop_len = _getMaxKeyLen(_binary_ops); // Literals
  // ----------
  // Store the values to return for the various literals we may encounter


  var _literals = new Map();

  _literals.set('true', true);

  _literals.set('false', false);

  _literals.set('null', null);

  _literals.set('undefined', undefined); // Returns the precedence of a binary operator or `0` if it isn't a binary operator


  function _binaryPrecedence(op_val) {
    return _binary_ops[op_val] || 0;
  } // Utility function (gets called from multiple places)
  // Also note that `a && b` and `a || b` are *logical* expressions, not binary expressions


  function _createBinaryExpression(operator, left, right, context) {
    if (operator === '=' && !context.writer) {
      _throwError('Unexpected operator \'=\'', context.index);
    }

    var type = operator === '||' || operator === '&&' ? 7 : 6; // ? 'LogicalExpression' : 'BinaryExpression'

    return {
      type: type,
      operator: operator,
      left: left,
      right: right
    };
  } // `ch` is a character code in the next three functions


  function _isDecimalDigit(ch) {
    return ch >= 48 && ch <= 57; // 0...9
  }

  function _isIdentifierStart(ch) {
    return ch === 36 || ch === 95 || // `$` and `_`
    ch >= 65 && ch <= 90 || // A...Z
    ch >= 97 && ch <= 122 || // a...z
    ch >= 128 && !_binary_ops[String.fromCharCode(ch)]; // any non-ASCII that is not an operator
  }

  function _isIdentifierPart(ch) {
    return ch === 36 || ch === 95 || // `$` and `_`
    ch >= 65 && ch <= 90 || // A...Z
    ch >= 97 && ch <= 122 || // a...z
    ch >= 48 && ch <= 57 || // 0...9
    ch >= 128 && !_binary_ops[String.fromCharCode(ch)]; // any non-ASCII that is not an operator
  }

  function _throwError(message, index) {
    var error = new Error(message + ' at character ' + index);
    error.index = index;
    error.description = message;
    throw error;
  }
}

return ExpParser;
});