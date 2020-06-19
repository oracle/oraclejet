"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
let _BUILD_OPTIONS;
let _FILE_NAME;
const _MODULE_VAR = "oj_imported_module";
let _MODULE_VAR_COUNTER;
function importTransformer(buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    function visitor(ctx, sf) {
        var _a;
        _MODULE_VAR_COUNTER = 1;
        _FILE_NAME = sf.fileName;
        if (_BUILD_OPTIONS["debug"])
            console.log(`${_FILE_NAME}: processing imports...`);
        const importToModule = (_a = _BUILD_OPTIONS.importMaps) === null || _a === void 0 ? void 0 : _a.propsToModule;
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
            newDeps.push(ts.createLiteral(propsModule));
            newParams.push(ts.createParameter(undefined, undefined, undefined, moduleVar));
        }
        const varDecl = ts.createVariableDeclaration(propClass, undefined, ts.createIdentifier(`${moduleVar}.${propClass}`));
        newBodyStatements.push(ts.createVariableStatement(undefined, [varDecl]));
    }
    if (newDeps.length > 0) {
        const updatedDeps = ts.updateArrayLiteral(deps, deps.elements.concat(newDeps));
        const readyFunc = args[1];
        const newBody = ts.updateBlock(readyFunc.body, newBodyStatements.concat(readyFunc.body.statements));
        const updatedReadyFunc = ts.updateFunctionExpression(readyFunc, readyFunc.modifiers, readyFunc.asteriskToken, readyFunc.name, readyFunc.typeParameters, readyFunc.parameters.concat(newParams), readyFunc.type, newBody);
        return ts.updateCall(node, node.expression, node.typeArguments, [
            updatedDeps,
            updatedReadyFunc,
        ]);
    }
    return node;
}
function getModuleNameVar() {
    return `${_MODULE_VAR}_${_MODULE_VAR_COUNTER++}`;
}
exports.getModuleNameVar = getModuleNameVar;
