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
exports.getModuleNameVar = void 0;
const ts = __importStar(require("typescript"));
const _MODULE_VAR = "oj_imported_module";
let _MODULE_VAR_COUNTER;
function importTransformer(buildOptions) {
    function visitor(ctx, sf) {
        var _a;
        _MODULE_VAR_COUNTER = 1;
        if (buildOptions["debug"])
            console.log(`${sf.fileName}: processing imports...`);
        const importToModule = (_a = buildOptions.importMaps) === null || _a === void 0 ? void 0 : _a.propsToModule;
        const visitor = (node) => {
            if (importToModule && isDefineCall(node)) {
                return updateDefineCall(node, importToModule);
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return (sf) => ts.visitNode(sf, visitor(ctx, sf));
    };
}
exports.default = importTransformer;
function isDefineCall(node) {
    return (node.kind === ts.SyntaxKind.CallExpression &&
        node["expression"].escapedText == "define");
}
function updateDefineCall(node, propImports) {
    const args = node.arguments;
    const deps = args[0];
    const newDeps = [];
    const newParams = [];
    const newBodyStatements = [];
    const moduleToVar = {};
    for (let propClass in propImports) {
        const propsModule = propImports[propClass];
        let moduleVar = moduleToVar[propsModule];
        if (!moduleVar) {
            moduleVar = getModuleNameVar();
            moduleToVar[propsModule] = moduleVar;
            newDeps.push(ts.factory.createStringLiteral(propsModule));
            newParams.push(ts.factory.createParameterDeclaration(undefined, undefined, undefined, moduleVar));
        }
        const varDecl = ts.factory.createVariableDeclaration(propClass, undefined, undefined, ts.factory.createIdentifier(`${moduleVar}.${propClass}`));
        newBodyStatements.push(ts.factory.createVariableStatement(undefined, [varDecl]));
    }
    if (newDeps.length > 0) {
        const updatedDeps = ts.factory.updateArrayLiteralExpression(deps, deps.elements.concat(newDeps));
        const readyFunc = args[1];
        const newBody = ts.factory.updateBlock(readyFunc.body, newBodyStatements.concat(readyFunc.body.statements));
        const updatedReadyFunc = ts.factory.updateFunctionExpression(readyFunc, readyFunc.modifiers, readyFunc.asteriskToken, readyFunc.name, readyFunc.typeParameters, readyFunc.parameters.concat(newParams), readyFunc.type, newBody);
        return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [updatedDeps, updatedReadyFunc]);
    }
    return node;
}
function getModuleNameVar() {
    return `${_MODULE_VAR}_${_MODULE_VAR_COUNTER++}`;
}
exports.getModuleNameVar = getModuleNameVar;
