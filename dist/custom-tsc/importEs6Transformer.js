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
const ts = __importStar(require("typescript"));
function importTransformer(buildOptions) {
    function visitor(ctx, sf) {
        var _a;
        if (buildOptions["debug"])
            console.log(`${sf.fileName}: processing imports...`);
        const moduleToProps = (_a = buildOptions.importMaps) === null || _a === void 0 ? void 0 : _a.moduleToProps;
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
                    return ts.factory.updateSourceFile(node, newStatements, node.isDeclarationFile, node.referencedFiles, node.typeReferenceDirectives, node.hasNoDefaultLib, node.libReferenceDirectives);
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
    const newNamedBindings = ts.factory.updateNamedImports(namedBindings, namedBindings.elements.concat(newBindingElements));
    const newImportClause = ts.factory.updateImportClause(importClause, importClause.isTypeOnly, importClause.name, newNamedBindings);
    return ts.factory.updateImportDeclaration(importDecl, importDecl.decorators, importDecl.modifiers, newImportClause, importDecl.moduleSpecifier);
}
function createImportStatement(module, newBindingElements) {
    const newNamedBindings = ts.factory.createNamedImports(newBindingElements);
    const importClause = ts.factory.createImportClause(false, undefined, newNamedBindings);
    return ts.factory.createImportDeclaration(undefined, undefined, importClause, ts.factory.createStringLiteral(module));
}
function updateOrCreateBindingElements(propClasses, importDecl = null) {
    const newBindingElements = [];
    if (propClasses) {
        propClasses.forEach((propClass) => {
            if (!importDecl || !hasNamedImport(importDecl, propClass)) {
                newBindingElements.push(ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier(propClass)));
            }
        });
    }
    return newBindingElements;
}
function trimQuotes(text) {
    return text.slice(1, text.length - 1);
}
