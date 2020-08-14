"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function getDecorator(node, name) {
    var _a;
    return (_a = node.decorators) === null || _a === void 0 ? void 0 : _a.find((decorator) => {
        return getDecoratorName(decorator) === name;
    });
}
exports.getDecorator = getDecorator;
function getDecorators(node) {
    const decoratorMap = {};
    if (node.decorators) {
        node.decorators.forEach((decorator) => {
            decoratorMap[getDecoratorName(decorator)] = decorator;
        });
    }
    return decoratorMap;
}
exports.getDecorators = getDecorators;
function getDecoratorName(decorator) {
    const decoratorExpr = decorator.expression;
    if (ts.isCallExpression(decoratorExpr)) {
        return decoratorExpr.expression.getText();
    }
    else {
        return decoratorExpr.getText();
    }
}
exports.getDecoratorName = getDecoratorName;
function getDecoratorParamValue(decorator, paramName) {
    const args = decorator.expression["arguments"];
    let param = null;
    args === null || args === void 0 ? void 0 : args.forEach((arg) => {
        if (!param) {
            const mapSymbol = arg.symbol;
            const paramSymbol = mapSymbol.members.has(paramName);
            param = paramSymbol === null || paramSymbol === void 0 ? void 0 : paramSymbol.valueOf();
        }
    });
    return param;
}
exports.getDecoratorParamValue = getDecoratorParamValue;
