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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = moduleExportTransformer;
const ts = __importStar(require("typescript"));
const path_1 = __importDefault(require("path"));
const ExportMaps_1 = require("./shared/ExportMaps");
const MetadataFileUtils_1 = require("./shared/MetadataFileUtils");
let _OPTIONS;
let _CHECKER;
let allMonoPacks;
//const collectedReexports = new Map<string, ReexportedType[]>();
/**
 * Transformer run after the metadata transformer and before the code
 * is compiled to JavaScript so we can add any missing import statements.
 * @param buildOptions
 */
function moduleExportTransformer(program, buildOptions) {
    _CHECKER = program.getTypeChecker();
    _OPTIONS = buildOptions;
    _OPTIONS.programExportMaps = new ExportMaps_1.ExportMaps();
    let compilerOptions;
    // Transformer factory function
    const exportTransformer = (context) => {
        compilerOptions = compilerOptions ?? context.getCompilerOptions();
        allMonoPacks = allMonoPacks ?? (0, MetadataFileUtils_1.getAllMonoPacks)(compilerOptions);
        return processReexportsFromModule;
    };
    return exportTransformer;
}
/**
 * Transformer that parses the AST of a module index.ts file and extracts information about re-exported types. This information is
 * saved in an instance of ExportMaps and surfaced to consumers as the programExportMaps property of the ApiDocOptions.
 * Currently this information is used by the ApiDocUtils utility when generating doclets consumed by the API Doc generation process.
 * @param sourceFile The ts.SourceFile instance
 * @returns the unchanged ts.SourceFile
 */
function processReexportsFromModule(sourceFile) {
    const fileName = (0, MetadataFileUtils_1.ensureAbsolutePath)(sourceFile.fileName);
    const parentDir = path_1.default.posix.dirname(fileName);
    // accept only index.ts
    if (!/index\.ts?$/.test(fileName) || !parentDir)
        return sourceFile;
    // if we have a monopack check if the index.ts is coming from the modules associated with the
    // monopack content
    if (Object.keys(allMonoPacks).length > 0) {
        let isComponentModule = false;
        Object.entries(allMonoPacks).forEach(([pathToMonoPack, packInfo]) => {
            // relative path of parent dir should be the module root dir
            const relParentDir = path_1.default.relative(packInfo.absPath, parentDir);
            if (packInfo.monoPack.contents.findIndex((contentObj) => contentObj.name === relParentDir) > -1) {
                isComponentModule = true;
                return;
            }
        });
        if (!isComponentModule)
            return sourceFile;
    }
    const reexports = [];
    if (_OPTIONS['debug']) {
        console.log(`${sourceFile.fileName}:: collecting type re-exports...`);
    }
    sourceFile.forEachChild((node) => {
        if (!ts.isExportDeclaration(node) || !node.moduleSpecifier)
            return;
        const moduleSpecifier = node.moduleSpecifier.text;
        // Named exports: export { Foo } from './module';
        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
            for (const element of node.exportClause.elements) {
                const exportedName = element.name.text;
                const originalName = (element.propertyName ?? element.name).text;
                const symbol = _CHECKER.getExportSpecifierLocalTargetSymbol(element);
                if (symbol && isTypeOnlySymbol(symbol)) {
                    reexports.push({
                        exportedName,
                        originalName,
                        from: moduleSpecifier,
                        kind: getSymbolKind(symbol)
                    });
                }
            }
        }
        // Wildcard exports: export * from './module';
        if (!node.exportClause) {
            const resolvedModule = _CHECKER.getSymbolAtLocation(node.moduleSpecifier);
            if (resolvedModule?.exports) {
                resolvedModule.exports.forEach((symbol, name) => {
                    if (isTypeOnlySymbol(symbol)) {
                        reexports.push({
                            exportedName: name.toString(),
                            originalName: name.toString(),
                            from: moduleSpecifier,
                            kind: getSymbolKind(symbol)
                        });
                    }
                });
            }
        }
    });
    if (reexports.length > 0) {
        // save the module name and it's exported types
        _OPTIONS.programExportMaps.storeExportsForModule(parentDir, reexports);
    }
    return sourceFile;
}
function isTypeOnlySymbol(symbol) {
    const declarations = symbol.getDeclarations() ?? [];
    return declarations.some((decl) => ts.isInterfaceDeclaration(decl) || ts.isTypeAliasDeclaration(decl));
}
function getSymbolKind(symbol) {
    const declarations = symbol.getDeclarations();
    if (!declarations || declarations.length === 0)
        return 'unknown';
    const decl = declarations[0];
    if (ts.isInterfaceDeclaration(decl))
        return 'interface';
    if (ts.isTypeAliasDeclaration(decl))
        return 'type';
    return 'unknown';
}
//# sourceMappingURL=exportTransformer.js.map