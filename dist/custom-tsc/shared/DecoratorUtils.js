"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecorator = getDecorator;
exports.getDecorators = getDecorators;
exports.getDecoratorName = getDecoratorName;
exports.getDecoratorArguments = getDecoratorArguments;
const ts = __importStar(require("typescript"));
/**
 * Looks for a decorator of a specified name for a given node.
 * @param node Node to process
 * @param name Name of the decorator to retrieve
 * @returns Decorator requested, or undefined if not found
 */
function getDecorator(node, name) {
    let rtnDecorator;
    if (ts.canHaveDecorators(node)) {
        rtnDecorator = ts.getDecorators(node)?.find((decorator) => {
            return getDecoratorName(decorator) === name;
        });
    }
    return rtnDecorator;
}
/**
 * Retrieves all the decorators for the given node.
 * @param node Node to process
 * @returns A map of decorator names to Decorator instances.
 */
function getDecorators(node) {
    const decoratorMap = {};
    if (ts.canHaveDecorators(node)) {
        ts.getDecorators(node)?.forEach((decorator) => {
            decoratorMap[getDecoratorName(decorator)] = decorator;
        });
    }
    return decoratorMap;
}
/**
 * Returns the name of a specified ts.Decorator
 * @param decorator Decorator to process
 * @returns Name of the decorator
 */
function getDecoratorName(decorator) {
    const decoratorExpr = decorator.expression;
    if (ts.isCallExpression(decoratorExpr)) {
        // @listener(...)
        return decoratorExpr.expression.getText();
    }
    else {
        // @method
        return decoratorExpr.getText();
    }
}
/**
 * Retrieves the arguments array for the given decorator.
 * @param decorator Decorator to process
 * @returns Expression array representing the decorator's arguments, or undefined if no arguments
 */
function getDecoratorArguments(decorator) {
    let rtnArgs = undefined;
    if (ts.isCallExpression(decorator.expression)) {
        rtnArgs = decorator.expression.arguments;
    }
    return rtnArgs;
}
//# sourceMappingURL=DecoratorUtils.js.map