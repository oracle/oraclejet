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
exports.default = vdomTransformer;
const ts = __importStar(require("typescript"));
const path = __importStar(require("path"));
const DecoratorUtils_1 = require("./shared/DecoratorUtils");
const ImportMaps_1 = require("./shared/ImportMaps");
const JETComp_1 = require("./shared/JETComp");
const JETContent_1 = require("./shared/JETContent");
const MetadataFileUtils_1 = require("./shared/MetadataFileUtils");
const Utils_1 = require("./shared/Utils");
/**
 * CustomTransformer that visits the AST identifying JET mono-pack contents
 * that are vdom components (i.e., exported Preact components and hooks) and
 * then generates simplified JET component metadata JSON for these contents.
 */
function vdomTransformer(program) {
    const programImportMaps = new ImportMaps_1.ImportMaps();
    const checker = program.getTypeChecker();
    let compilerOptions;
    let outDir;
    let allMonoPacks;
    let contentFactory;
    function visitor(ctx, sf) {
        compilerOptions = compilerOptions ?? ctx.getCompilerOptions();
        outDir = outDir ?? compilerOptions.outDir ?? '.';
        allMonoPacks = allMonoPacks ?? (0, MetadataFileUtils_1.getAllMonoPacks)(compilerOptions);
        contentFactory = contentFactory ?? new JETContent_1.JETContentFactory(checker);
        const visitor = (node) => {
            if (ts.isImportDeclaration(node)) {
                const bindings = node.importClause?.namedBindings;
                if (bindings && ts.isNamedImports(bindings)) {
                    for (let binding of bindings.elements) {
                        // an aliased import will specify its original exported name
                        // in propertyName, otherwise the import and its "alias"
                        // are the same
                        const importName = (binding.propertyName || binding.name).text;
                        const module = (0, Utils_1.trimQuotes)(node.moduleSpecifier.getText());
                        programImportMaps.registerMapping(node, module, importName, binding.name.text);
                    }
                }
                return node;
            }
            const [pathToMonoPack, content] = getContentInfo(node, allMonoPacks, programImportMaps, contentFactory);
            if (pathToMonoPack && content) {
                (0, MetadataFileUtils_1.writeJETContentMetadata)(outDir, pathToMonoPack, content);
                return node;
            }
            // Otherwise call visitEachChild for the current node
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return ((sf) => ts.visitNode(sf, visitor(ctx, sf)));
    };
}
function getContentInfo(node, allMonoPacks, importMaps, contentFactory) {
    let pathToMonoPack;
    let content;
    // Only interested in exported symbols at the top-level of a SourceFile
    if (node.parent &&
        ts.isSourceFile(node.parent) &&
        ts.canHaveModifiers(node) &&
        ts.getModifiers(node)?.findIndex((mod) => mod.kind === ts.SyntaxKind.ExportKeyword) >= 0) {
        // Ensure that we have an absolute path for the SourceFile (always provided
        // by TypeScript in posix format)
        const srcFilename = (0, MetadataFileUtils_1.ensureAbsolutePath)(node.parent.fileName);
        // Find a potential mono-pack container based upon whether the node's SourceFile
        // resides in a directory that is a direct descendent of the mono-pack definition
        // (i.e., relative path from mono-pack to SourceFile does not include any
        // 'go to parent directory' directives).
        let packInfo;
        [pathToMonoPack, packInfo] = Object.entries(allMonoPacks).find(([pathToMonoPack, packInfo]) => !path.relative(packInfo.absPath, srcFilename).includes('..'));
        if (pathToMonoPack && packInfo) {
            const monoPack = packInfo.monoPack;
            const defaultMain = srcFilename.substring(packInfo.absPath.length - monoPack.name.length, srcFilename.length - path.extname(srcFilename).length);
            let defaultExport;
            let contentType;
            let compName;
            let contentItem;
            let propsTypeNode;
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                    // USE CASE
                    // Class-based vdom Component
                    //    * class Foo extends [Pure]Component<P = {}, S = {}>
                    // Make sure we don't have a class-based VComponent
                    // (i.e., no 'customElement' decorator!)
                    const exportToAlias = importMaps.getMap(ImportMaps_1.IMAP.exportToAlias, node);
                    if ((0, DecoratorUtils_1.getDecorator)(node, exportToAlias.customElement) == undefined) {
                        // Is there a matching contentItem for this potential vdom Component?
                        defaultExport = node.name ? ts.idText(node.name) : '';
                        compName = (0, Utils_1.titleCaseToStickCase)(defaultExport);
                        contentItem = monoPack.findContentInPack(compName, JETComp_1.ContentItemType.VDOM);
                        if (contentItem) {
                            // A class-based vdom Component will extend either 'Component' or 'PureComnponent'
                            const heritageClauses = node.heritageClauses;
                            for (let clause of heritageClauses) {
                                for (let typeNode of clause.types) {
                                    const baseName = (0, Utils_1.getTypeNameFromTypeReference)(typeNode);
                                    if (baseName === exportToAlias.Component ||
                                        baseName === exportToAlias.PureComponent) {
                                        contentType = JETContent_1.ContentType.VDOM;
                                        propsTypeNode = typeNode.typeArguments?.[0];
                                    }
                                }
                            }
                        }
                    }
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                    // USE CASES
                    // Function-based vdom Component
                    //    * export function Foo(props: P, context?: any): VNode<any> | null
                    // hook Component
                    //    * export function useFoo(args...): returnType { ... }
                    // util Component
                    //    * all other exported functions
                    //    * TBD explicit opt-in (marked @public) or opt-out (NOT marked @protected, @private)
                    // Is there a matching contentItem for this potential Component?
                    defaultExport = node.name ? ts.idText(node.name) : '';
                    compName = (0, Utils_1.titleCaseToStickCase)(defaultExport);
                    contentItem = monoPack.findContentInPack(compName);
                    switch (contentItem?.type) {
                        case JETComp_1.ContentItemType.VDOM:
                            contentType = JETContent_1.ContentType.VDOM;
                            break;
                        case JETComp_1.ContentItemType.HOOK:
                            contentType = JETContent_1.ContentType.HOOK;
                            break;
                        case JETComp_1.ContentItemType.UTIL:
                            contentType = JETContent_1.ContentType.UTIL;
                            break;
                        default:
                            break;
                    }
                    break;
                case ts.SyntaxKind.VariableStatement:
                    // USE CASES
                    // Function-based vdom Component
                    //    * export Foo = (props: P, context?: any): VNode<any> | null => { ... } ||
                    //                    function(props: P, context?: any): VNode<any> | null { ... }
                    // hook Component
                    //    * export useFoo = (args...): returnType => { ... } ||
                    //                        function(args...): returnType { ... }
                    // util Component
                    //    * all other exported variables, initialized to arrow or anonymous functions
                    //    * TBD explicit opt-in (marked @public) or opt-out (NOT marked @protected, @private)
                    // Is there a matching contentItem for this potential Component?
                    const varDecl = node.declarationList.declarations[0];
                    defaultExport = varDecl.name.getText();
                    compName = (0, Utils_1.titleCaseToStickCase)(defaultExport);
                    contentItem = monoPack.findContentInPack(compName);
                    // If there is a matching contentItem AND the VariableDeclaration has an initializer,
                    // then the node passed to the ContentFactory is reset to that initializer expression,
                    // and that expression is used to generate the JETContent metadata
                    if (contentItem !== undefined && varDecl.initializer) {
                        node = varDecl.initializer;
                        switch (contentItem.type) {
                            case JETComp_1.ContentItemType.VDOM:
                                contentType = JETContent_1.ContentType.VDOM;
                                break;
                            case JETComp_1.ContentItemType.HOOK:
                                contentType = JETContent_1.ContentType.HOOK;
                                break;
                            case JETComp_1.ContentItemType.UTIL:
                                contentType = JETContent_1.ContentType.UTIL;
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
            if (contentType) {
                content = contentFactory.create(contentType, compName, defaultExport, defaultMain, monoPack, contentItem, node, propsTypeNode);
            }
        }
    }
    return [pathToMonoPack, content];
}
//# sourceMappingURL=vdomTransformer.js.map