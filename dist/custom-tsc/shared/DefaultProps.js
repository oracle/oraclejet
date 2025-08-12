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
exports.getDefaultPropsFromSource = getDefaultPropsFromSource;
exports.getDefaultPropValue = getDefaultPropValue;
exports.isDefaultPropsClassElement = isDefaultPropsClassElement;
const ts = __importStar(require("typescript"));
const Utils_1 = require("./Utils");
function getDefaultPropsFromSource(source) {
    let rtnDefaultProps;
    // If the source is a function parameter and the parameter name
    // is an object binding pattern, then the binding pattern's array
    // of elements provides the defaultProps mapping.
    if (ts.isParameter(source) && ts.isObjectBindingPattern(source.name)) {
        rtnDefaultProps = source.name.elements;
    }
    // Otherwise if the source is a class element then check whether it's
    // a PropertyDeclaration whose value is an ObjectLiteralExpression
    // providing the defaultProps mapping.
    else if (ts.isClassElement(source) && ts.isPropertyDeclaration(source)) {
        if (source.initializer && ts.isObjectLiteralExpression(source.initializer)) {
            rtnDefaultProps = source.initializer.properties;
        }
    }
    return rtnDefaultProps;
}
/**
 * Given a DefaultPropsElement, return the metadata value
 */
function getDefaultPropValue(defElem, checker) {
    let val = undefined;
    if (ts.isPropertyAssignment(defElem) ||
        (ts.isBindingElement(defElem) && defElem.initializer && !defElem.dotDotDotToken)) {
        val = (0, Utils_1.getMDValue)(defElem.initializer, checker);
    }
    return val;
}
/**
 * Check whether the specified ClassElement provides the defaultProps mapping for
 * a Class-based Component.
 */
function isDefaultPropsClassElement(elem) {
    return ts.isPropertyDeclaration(elem) && elem.name.getText() === 'defaultProps';
}
//# sourceMappingURL=DefaultProps.js.map