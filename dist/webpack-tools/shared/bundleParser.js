/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Parses the data carried by an AMD resource bundle without evaluating the
 * bundle.  Resource bundles are build input, so executing them in a VM does
 * not provide a meaningful security boundary.
 */
const {parse} = require('@babel/parser');

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

class BundleFunction {
  constructor(source) {
    this.source = source;
  }
}

function parseBundle(source) {
  const ast = parse(source, {
    sourceType: 'script',
    plugins: ['typescript']
  });
  const statements = ast.program.body.filter((statement) => statement.type !== 'EmptyStatement');
  if (statements.length !== 1 || statements[0].type !== 'ExpressionStatement') {
    throw new Error('ojL10n resource bundles must contain a single AMD define() call');
  }

  const call = statements[0].expression;
  if (call.type !== 'CallExpression' || call.callee.type !== 'Identifier' || call.callee.name !== 'define') {
    throw new Error('ojL10n resource bundles must use an AMD define() call');
  }

  return evaluateDefine(call.arguments, source);
}

function evaluateDefine(args, source) {
  if (args.length === 1) {
    const arg = args[0];
    return isFunction(arg) ? evaluateCallback(arg, [], source) : evaluate(arg, source);
  }
  if (args.length === 2 && args[0].type === 'ArrayExpression' && isFunction(args[1])) {
    const dependencies = args[0].elements.map((element) => evaluate(element, source));
    return evaluateCallback(args[1], dependencies, source);
  }
  throw new Error('ojL10n resource bundles must use define(data) or define(dependencies, callback)');
}

function evaluateCallback(callback, dependencies, source) {
  const exportsIndex = dependencies.indexOf('exports');
  const bindings = new Map();
  let exportsValue;
  if (exportsIndex !== -1 && callback.params[exportsIndex] && callback.params[exportsIndex].type === 'Identifier') {
    exportsValue = {};
    bindings.set(callback.params[exportsIndex].name, exportsValue);
  }

  if (callback.body.type !== 'BlockStatement') {
    return evaluate(callback.body, source, bindings);
  }

  for (const statement of callback.body.body) {
    if (statement.type === 'ExpressionStatement' && statement.expression.type === 'StringLiteral') {
      continue;
    }
    if (statement.type === 'VariableDeclaration') {
      statement.declarations.forEach((declaration) => {
        if (declaration.id.type !== 'Identifier' || !declaration.init) {
          throw new Error('ojL10n resource bundle callback contains an unsupported declaration');
        }
        bindings.set(declaration.id.name, evaluate(declaration.init, source, bindings));
      });
      continue;
    }
    if (statement.type === 'ExpressionStatement' && statement.expression.type === 'AssignmentExpression' &&
        statement.expression.operator === '=') {
      assign(statement.expression.left, evaluate(statement.expression.right, source, bindings), bindings);
      continue;
    }
    if (statement.type === 'ReturnStatement') {
      return statement.argument ? evaluate(statement.argument, source, bindings) : undefined;
    }
    // TypeScript's AMD output marks exports with Object.defineProperty(). It
    // has no bearing on the resource data and is safe to ignore.
    if (isEsModuleMarker(statement)) {
      continue;
    }
    throw new Error('ojL10n resource bundle callback contains unsupported code');
  }

  return exportsValue && (exportsValue.default || exportsValue);
}

function assign(left, value, bindings) {
  if (left.type !== 'MemberExpression' || left.computed || left.object.type !== 'Identifier' ||
      left.property.type !== 'Identifier') {
    throw new Error('ojL10n resource bundle callback contains an unsupported assignment');
  }
  const target = bindings.get(left.object.name);
  if (!target || BLOCKED_KEYS.has(left.property.name)) {
    throw new Error('ojL10n resource bundle callback contains an unsafe assignment');
  }
  target[left.property.name] = value;
}

function evaluate(node, source, bindings = new Map()) {
  if (!node) {
    throw new Error('ojL10n resource bundle contains an empty expression');
  }
  if (node.type === 'StringLiteral' || node.type === 'NumericLiteral' || node.type === 'BooleanLiteral' || node.type === 'NullLiteral') {
    return node.value;
  }
  if (node.type === 'Identifier') {
    if (!bindings.has(node.name)) throw new Error(`ojL10n resource bundle uses unsupported identifier ${node.name}`);
    return bindings.get(node.name);
  }
  if (node.type === 'UnaryExpression' && node.argument.type === 'NumericLiteral') {
    if (node.operator === '-') return -node.argument.value;
    if (node.operator === '+') return node.argument.value;
    // Terser emits booleans as !0 and !1 in production locale bundles.
    if (node.operator === '!') return !node.argument.value;
    if (node.operator === 'void') return undefined;
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map((element) => evaluate(element, source, bindings));
  }
  if (node.type === 'ObjectExpression') {
    const value = {};
    node.properties.forEach((property) => {
      if (property.type !== 'ObjectProperty' || property.computed || property.method) {
        throw new Error('ojL10n resource bundle contains an unsupported object property');
      }
      const key = property.key.type === 'Identifier' ? property.key.name : property.key.value;
      if (typeof key !== 'string' || BLOCKED_KEYS.has(key)) return;
      Object.defineProperty(value, key, {value: evaluate(property.value, source, bindings), enumerable: true, writable: true, configurable: true});
    });
    return value;
  }
  if (isFunction(node)) {
    return new BundleFunction(source.slice(node.start, node.end));
  }
  throw new Error(`ojL10n resource bundle contains unsupported ${node.type}`);
}

function isFunction(node) {
  return node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression';
}

function isEsModuleMarker(statement) {
  const expression = statement.expression;
  return expression && expression.type === 'CallExpression' && expression.callee.type === 'MemberExpression' &&
    expression.callee.object.type === 'Identifier' && expression.callee.object.name === 'Object' &&
    expression.callee.property.type === 'Identifier' && expression.callee.property.name === 'defineProperty';
}

module.exports = {parseBundle, BundleFunction};
