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
exports.getCommentForSymbol = getCommentForSymbol;
exports.getMDValue = getMDValue;
exports.getTypeNameFromTypeReference = getTypeNameFromTypeReference;
exports.getValueNodeFromIdentifier = getValueNodeFromIdentifier;
exports.getValueNodeFromPropertyAccessExpression = getValueNodeFromPropertyAccessExpression;
exports.getValueNodeFromReference = getValueNodeFromReference;
exports.isValueNodeReference = isValueNodeReference;
exports.getFunctionReturnTsType = getFunctionReturnTsType;
exports.removeCastExpressions = removeCastExpressions;
exports.stickCaseToTitleCase = stickCaseToTitleCase;
exports.titleCaseToStickCase = titleCaseToStickCase;
exports.trimQuotes = trimQuotes;
exports.walkPropertiesOfType = walkPropertiesOfType;
const ts = __importStar(require("typescript"));
///////////////////////////////////
// A collection of useful utilities
///////////////////////////////////
/**
 * Given a Symbol, return its JSDoc description text
 */
function getCommentForSymbol(symbol, checker) {
    return ts.displayPartsToString(symbol?.getDocumentationComment(checker));
}
/**
 * Given a Node representing a value, return the corresponding metadata value.
 * A metadata value has to be expressible as JSON, otherwise return undefined.
 */
function getMDValue(vNode, checker) {
    let val = undefined;
    // Remove any casts on the value node
    vNode = removeCastExpressions(vNode);
    // If the value node is a reference (either a straight Identifier or a PropertyAccess),
    // dereference it and remove any casts on the dereference
    if (vNode && isValueNodeReference(vNode)) {
        vNode = getValueNodeFromReference(vNode, checker);
        vNode = removeCastExpressions(vNode);
    }
    // NOTE:  If at this point the vNode IS an Identifier then it must be
    //        the unique Identifier for 'undefined', in which case we skip
    //        further processing.
    if (vNode && !ts.isIdentifier(vNode)) {
        // OK, not 'undefined'...first check for a literal value
        const vSymbol = checker.getSymbolAtLocation(vNode);
        if (vSymbol) {
            const vType = checker.getTypeOfSymbol(vSymbol);
            if (vType.isLiteral()) {
                val = vType.value;
            }
        }
        // If no literal value found...
        if (val == undefined) {
            // ...try processing expression nodes for values that are expressible
            // as JSON, including arrays and objects
            vNode = getValueNodeFromReference(vNode, checker) ?? vNode;
            if (!isValueNodeReference(vNode)) {
                vNode = removeCastExpressions(vNode);
                switch (vNode.kind) {
                    case ts.SyntaxKind.StringLiteral:
                        val = vNode.text;
                        break;
                    case ts.SyntaxKind.NumericLiteral:
                        val = Number(vNode.text);
                        break;
                    case ts.SyntaxKind.TrueKeyword:
                        val = true;
                        break;
                    case ts.SyntaxKind.FalseKeyword:
                        val = false;
                        break;
                    case ts.SyntaxKind.NullKeyword:
                        val = null;
                        break;
                    case ts.SyntaxKind.ArrayLiteralExpression:
                        let vArray = [];
                        // Loop over the ArrayLiteral elements, pushing each metadata value
                        // onto the return array.
                        // If an item comes back as undefined, assume there was an error
                        // and abort (sparse arrays are NOT supported!)
                        for (const elem of vNode.elements) {
                            const itemValue = getMDValue(elem, checker);
                            if (itemValue !== undefined) {
                                vArray.push(itemValue);
                            }
                            else {
                                vArray = undefined;
                                break;
                            }
                        }
                        // Array value to return?
                        if (vArray !== undefined) {
                            val = vArray;
                        }
                        break;
                    case ts.SyntaxKind.ObjectLiteralExpression:
                        const objExpression = vNode;
                        let vObj = {};
                        if (objExpression.properties.length > 0) {
                            // Loop over ObjectLiteral properties, adding simple PropertyAssignment
                            // key/MDValue pairs.  If an MDValue sub-prop comes back as undefined,
                            // skip it but keep going.
                            for (const subprop of objExpression.properties) {
                                if (ts.isPropertyAssignment(subprop)) {
                                    const sub_key = subprop.name.getText();
                                    const sub_val = getMDValue(subprop.initializer, checker);
                                    if (sub_val !== undefined) {
                                        vObj[sub_key] = sub_val;
                                    }
                                }
                            }
                            // If, after looping through all PropertyAssignments, we did not end up
                            // transferring any sub-properties, abort this metadata object value
                            if (Object.keys(vObj).length === 0) {
                                vObj = undefined;
                            }
                        }
                        // Object value to return?
                        if (vObj !== undefined) {
                            val = vObj;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    return val;
}
/**
 * Extract the type name from a TypeReferenceType node
 */
function getTypeNameFromTypeReference(node) {
    // NOTE: TypeReferenceType == (TypeReferenceNode | ExpressionWithTypeArguments)
    return ts.isTypeReferenceNode(node) ? node.typeName?.getText() : node.expression?.getText();
}
/**
 * Given an Identifier reference, get the underlying value node
 * or undefined if a value node could not be determined.
 * If the underlying value of the Identifier is actually 'undefined',
 * then return this unique Identifier as the value node.
 */
function getValueNodeFromIdentifier(iNode, checker) {
    let vNode = undefined;
    const refSymbol = checker.getSymbolAtLocation(iNode);
    if (refSymbol) {
        if (refSymbol.getName() !== 'undefined') {
            // Reference to a (const) expression?
            if (refSymbol.valueDeclaration?.initializer) {
                vNode = refSymbol.valueDeclaration.initializer;
            }
            // Reference to a function declaration?
            else if (refSymbol.valueDeclaration && ts.isFunctionDeclaration(refSymbol.valueDeclaration)) {
                vNode = refSymbol.valueDeclaration;
            }
        }
        // special case where the underlying value of the Identifier is actually 'undefined'
        // therefore return the unique 'undefined' Identifier as the value node
        else {
            vNode = iNode;
        }
    }
    return vNode;
}
/**
 * Given a PropertyAccessExpression reference, get the underlying value node
 * or undefined if a value node could not be determined.
 * Given a node for the expression 'Foo.bar':
 *    -> node.expression refers to object 'Foo'
 *    -> node.name identifies prop 'bar'
 * References to an EnumMember are a special case of a PropertyAccessExpression.
 */
function getValueNodeFromPropertyAccessExpression(propAccessNode, checker) {
    let vNode = undefined;
    // Determine if the PropertyAccessExpression specifies an EnumMember,
    // in which case we just want to return the PropertyAccessExpression node
    // that was passed in
    const propAccessSymbol = checker.getSymbolAtLocation(propAccessNode);
    if (propAccessSymbol?.valueDeclaration && ts.isEnumMember(propAccessSymbol.valueDeclaration)) {
        vNode = propAccessNode;
    }
    else {
        // Get the target container
        let targetNode = getValueNodeFromReference(propAccessNode.expression, checker);
        // Remove any type casts from the target
        targetNode = removeCastExpressions(targetNode);
        // If a target ObjectLiteralExpression is found, find the
        // specified property and return its value node
        if (targetNode && ts.isObjectLiteralExpression(targetNode)) {
            const propName = ts.idText(propAccessNode.name);
            const accessedProp = targetNode.properties.find((prop) => prop.name?.getText() === propName);
            if (accessedProp && ts.isPropertyAssignment(accessedProp)) {
                vNode = accessedProp.initializer;
            }
        }
    }
    return vNode;
}
/**
 * Given a node that references a value node, get the underlying value node or
 * undefined if a value node could not be determined
 */
function getValueNodeFromReference(refNode, checker) {
    let vNode = undefined;
    if (ts.isIdentifier(refNode)) {
        vNode = getValueNodeFromIdentifier(refNode, checker);
    }
    else if (ts.isPropertyAccessExpression(refNode)) {
        vNode = getValueNodeFromPropertyAccessExpression(refNode, checker);
    }
    return vNode;
}
/**
 * Return true if the specified value node is actually a reference to a value
 */
function isValueNodeReference(vNode) {
    return ts.isIdentifier(vNode) || ts.isPropertyAccessExpression(vNode);
}
/**
 * Given a "function-like" node, returns the ts.Type object representing
 * its return type
 */
function getFunctionReturnTsType(funcDecl, checker) {
    const funcType = funcDecl.type
        ? // if there's a declared return type, use it
            checker.getTypeAtLocation(funcDecl.type)
        : // otherwise, infer the type from the declaration signature
            checker.getReturnTypeOfSignature(checker.getSignatureFromDeclaration(funcDecl));
    return funcType;
}
/**
 * Given a value node, remove any wrapping type cast 'as' expressions
 * to get the underlying expression node
 */
function removeCastExpressions(vNode) {
    while (vNode && ts.isAsExpression(vNode)) {
        vNode = vNode.expression;
    }
    return vNode;
}
/**
 * Convert a stick-case name to TitleCase
 */
function stickCaseToTitleCase(name) {
    return name
        .toLowerCase()
        .match(/-(?<match>.*)/)[0]
        .replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}
/**
 * Convert a TitleCase (or camelCase) name to stick-case
 */
function titleCaseToStickCase(name) {
    /* BEGIN from MDN
        - Any copyright is dedicated to the Public Domain:
          https://creativecommons.org/publicdomain/zero/1.0/
    */
    function upperToHyphenLower(match, offset) {
        return (offset > 0 ? '-' : '') + match.toLowerCase();
    }
    return name.replace(/[A-Z]/g, upperToHyphenLower);
    /* END from MDN */
}
/**
 * Return a new string with quotes (single or double) removed
 * from the beginning and end of the original string
 */
function trimQuotes(text) {
    return text.replace(/^['"]|['"]$/g, '');
}
/**
 * Walk the properties of a Type, invoking a specified callback
 * whose arguments are the property's Symbol and Name
 */
function walkPropertiesOfType(type, checker, callback) {
    const propSymbols = checker.getPropertiesOfType(type);
    for (const sym of propSymbols) {
        callback(sym, sym.getName());
    }
}
//# sourceMappingURL=Utils.js.map