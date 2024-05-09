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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecoratorParamValue = exports.getDecoratorArguments = exports.getDecoratorName = exports.getDecorators = exports.getDecorator = void 0;
const ts = __importStar(require("typescript"));
const MetaUtils = __importStar(require("./MetadataUtils"));
function getDecorator(node, name) {
    let rtnDecorator;
    if (ts.canHaveDecorators(node)) {
        rtnDecorator = ts.getDecorators(node)?.find((decorator) => {
            return getDecoratorName(decorator) === name;
        });
    }
    return rtnDecorator;
}
exports.getDecorator = getDecorator;
function getDecorators(node) {
    const decoratorMap = {};
    if (ts.canHaveDecorators(node)) {
        ts.getDecorators(node)?.forEach((decorator) => {
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
function getDecoratorArguments(decorator) {
    let rtnArgs = undefined;
    if (ts.isCallExpression(decorator.expression)) {
        rtnArgs = decorator.expression.arguments;
    }
    return rtnArgs;
}
exports.getDecoratorArguments = getDecoratorArguments;
function getDecoratorParamValue(decorator, paramName) {
    let param = undefined;
    const args = getDecoratorArguments(decorator);
    args?.forEach((arg) => {
        if (ts.isObjectLiteralExpression(arg)) {
            arg.properties.forEach((prop) => {
                if (ts.isPropertyAssignment(prop)) {
                    const propKey = prop.name.getText();
                    if (propKey === paramName) {
                        param = MetaUtils.getMDValueFromNode(prop.initializer, propKey);
                    }
                }
            });
        }
    });
    return param;
}
exports.getDecoratorParamValue = getDecoratorParamValue;
//# sourceMappingURL=DecoratorUtils.js.map