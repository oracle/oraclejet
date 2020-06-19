"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
let _BUILD_OPTIONS;
let _FILE_NAME;
function importTransformer(buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    function visitor(ctx, sf) {
        var _a;
        _FILE_NAME = sf.fileName;
        if (_BUILD_OPTIONS["debug"])
            console.log(`${_FILE_NAME}: processing imports...`);
        const moduleToProps = (_a = _BUILD_OPTIONS.importMaps) === null || _a === void 0 ? void 0 : _a.moduleToProps;
        const sfImports = sf["imports"];
        const numImports = sfImports.length - 1;
        let importCount = 0;
        const visitor = (node) => {
            var _a;
            if (moduleToProps && ts.isSourceFile(node) && numImports > 0) {
                const newStatements = [];
                let hasUpdatedImports = false;
                (_a = node.statements) === null || _a === void 0 ? void 0 : _a.forEach((statement, index) => {
                    if (ts.isImportDeclaration(statement)) {
                        importCount++;
                        const importDecl = statement;
                        const module = trimQuotes(importDecl.moduleSpecifier.getText());
                        const newBindingElements = updateOrCreateBindingElements(moduleToProps[module], importDecl);
                        if (newBindingElements.length > 0) {
                            hasUpdatedImports = true;
                            newStatements.push(updateImportStatement(importDecl, newBindingElements));
                        }
                        else {
                            newStatements.push(statement);
                        }
                        delete moduleToProps[module];
                        if (importCount === numImports) {
                            for (let module in moduleToProps) {
                                const newBindingElements = updateOrCreateBindingElements(moduleToProps[module]);
                                if (newBindingElements.length > 0) {
                                    hasUpdatedImports = true;
                                    newStatements.push(createImportStatement(module, newBindingElements));
                                }
                            }
                        }
                    }
                    else {
                        newStatements.push(statement);
                    }
                });
                if (hasUpdatedImports) {
                    return ts.updateSourceFileNode(node, newStatements, node.isDeclarationFile, node.referencedFiles, node.typeReferenceDirectives, node.hasNoDefaultLib, node.libReferenceDirectives);
                }
                return node;
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
function hasNamedImport(importDecl, namedImport) {
    var _a;
    const bindings = (_a = importDecl.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
        for (let binding of bindings.elements) {
            if (binding.name.text === namedImport) {
                return true;
            }
        }
    }
    return false;
}
function updateImportStatement(importDecl, newBindingElements) {
    const importClause = importDecl.importClause;
    const namedBindings = importClause.namedBindings;
    const newNamedBindings = ts.updateNamedImports(namedBindings, namedBindings.elements.concat(newBindingElements));
    const newImportClause = ts.updateImportClause(importClause, importClause.name, newNamedBindings, importClause.isTypeOnly);
    return ts.updateImportDeclaration(importDecl, importDecl.decorators, importDecl.modifiers, newImportClause, importDecl.moduleSpecifier);
}
function createImportStatement(module, newBindingElements) {
    const newNamedBindings = ts.createNamedImports(newBindingElements);
    const importClause = ts.createImportClause(undefined, newNamedBindings, false);
    return ts.createImportDeclaration(undefined, undefined, importClause, ts.createStringLiteral(module));
}
function updateOrCreateBindingElements(propClasses, importDecl = null) {
    const newBindingElements = [];
    if (propClasses) {
        propClasses.forEach((propClass) => {
            if (!importDecl || !hasNamedImport(importDecl, propClass)) {
                newBindingElements.push(ts.createImportSpecifier(undefined, ts.createIdentifier(propClass)));
            }
        });
    }
    return newBindingElements;
}
function trimQuotes(text) {
    return text.slice(1, text.length - 1);
}
