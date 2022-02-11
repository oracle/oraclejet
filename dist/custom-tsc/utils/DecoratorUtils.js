"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecoratorParamValue = exports.getDecoratorName = exports.getDecorators = exports.getDecorator = void 0;
const ts = __importStar(require("typescript"));
function getDecorator(node, name) {
    var _a;
    return (_a = node.decorators) === null || _a === void 0 ? void 0 : _a.find((decorator) => {
        return getDecoratorName(decorator) === name;
    });
}
exports.getDecorator = getDecorator;
function getDecorators(node, aliasToExport) {
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
    let param = undefined;
    if (ts.isCallExpression(decorator.expression)) {
        const args = decorator.expression.arguments;
        args.forEach((arg) => {
            if (ts.isObjectLiteralExpression(arg)) {
                arg.properties.forEach((prop) => {
                    if (ts.isPropertyAssignment(prop)) {
                        const propKey = prop.name.getText();
                        if (propKey === paramName) {
                            param = _getValue(prop.initializer);
                        }
                    }
                });
            }
        });
    }
    return param;
}
exports.getDecoratorParamValue = getDecoratorParamValue;
function _getValue(exp) {
    let value = undefined;
    switch (exp.kind) {
        case ts.SyntaxKind.StringLiteral:
            value = exp.text;
            break;
        case ts.SyntaxKind.NumericLiteral:
            value = Number(exp.text);
            break;
        case ts.SyntaxKind.TrueKeyword:
            value = true;
            break;
        case ts.SyntaxKind.FalseKeyword:
            value = false;
            break;
        case ts.SyntaxKind.NullKeyword:
            value = null;
            break;
        case ts.SyntaxKind.ArrayLiteralExpression:
            value = _getArrayLiteral(exp);
            break;
        case ts.SyntaxKind.ObjectLiteralExpression:
            value = _getObjectLiteral(exp);
            break;
    }
    return value;
}
function _getArrayLiteral(arrayExpression) {
    let retArray = [];
    arrayExpression.elements.forEach((element) => {
        const item = _getValue(element);
        if (!(item === null || item === undefined)) {
            retArray.push(item);
        }
    });
    return retArray;
}
function _getObjectLiteral(objExpression) {
    let retObj = {};
    objExpression.properties.forEach((prop) => {
        if (ts.isPropertyAssignment(prop)) {
            const propKey = prop.name.getText();
            retObj[propKey] = _getValue(prop.initializer);
        }
    });
    return retObj;
}
//# sourceMappingURL=DecoratorUtils.js.map