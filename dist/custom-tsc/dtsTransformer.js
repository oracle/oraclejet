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
exports.assembleTypes = exports.fixCreateImportExportSpecifierCalls = exports.fixStringLiteralCalls = void 0;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const template_1 = require("./template");
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const TransformerError_1 = require("./utils/TransformerError");
let _BUILD_OPTIONS;
let view;
const _REGEX_BLANK_LINES = new RegExp(/^(?:[\t ]*(?:\r?\n|\r))+/gm);
let _COMPILER_OPTIONS;
let allComponents = {};
function dtsTransformWrapper(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    const templatePath = buildOptions.templatePath;
    view = new template_1.Template(templatePath);
    _COMPILER_OPTIONS = program.getCompilerOptions();
    const dtsTransformer = (context) => {
        return (sf) => {
            function visit(node) {
                if (buildOptions.componentToMetadata) {
                    return generateCustomElementTypes(context, node);
                }
                else {
                    return node;
                }
            }
            if (_BUILD_OPTIONS['debug'])
                console.log(`${sf.fileName}: processing afterDeclaration`);
            return ts.visitNode(sf, visit);
        };
    };
    return dtsTransformer;
}
exports.default = dtsTransformWrapper;
function generateCustomElementTypes(context, rootNode) {
    const { factory } = context;
    let imports = getImportStatements(rootNode, context);
    const importStatements = MetaUtils.generateStatementsFromText(imports);
    let newContent = generateCustomElementTypeContent(rootNode.fileName);
    const newStatements = MetaUtils.generateStatementsFromText(newContent);
    return factory.updateSourceFile(rootNode, [
        ...importStatements,
        ...rootNode.statements,
        ...newStatements
    ]);
}
function generateCustomElementTypeContent(fileName) {
    let content = '';
    const coreJET = !!_BUILD_OPTIONS.coreJetBuildOptions;
    const vcomponents = _BUILD_OPTIONS.componentToMetadata;
    for (let vcomponentName in vcomponents) {
        let metadata = vcomponents[vcomponentName];
        const customElementName = metadata.name;
        if (customElementName) {
            if (vcomponentName === customElementName) {
                vcomponentName = MetaUtils.tagNameToElementName(customElementName);
            }
            const data = getComponentTemplateData(metadata, _BUILD_OPTIONS, customElementName, vcomponentName);
            const exports = getComponentExportsString(data, _BUILD_OPTIONS);
            const baseFileName = path.basename(fileName, '.tsx');
            const exportContent = `export { ${exports} } from './${baseFileName}';`;
            const rootDir = _COMPILER_OPTIONS.rootDir;
            const outDir = _COMPILER_OPTIONS.outDir || rootDir || path.dirname(fileName);
            const arrDirs = path.resolve(fileName).split(path.sep).slice(0, -1);
            let module = '';
            if (rootDir) {
                const rootDirExpanded = path.resolve(rootDir);
                const arrRootDir = rootDirExpanded.split(path.sep);
                let match = true;
                for (let i = 0; i < arrRootDir.length; i++) {
                    if (arrRootDir[i] != arrDirs[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    module = arrDirs.slice(arrRootDir.length).join('/');
                }
            }
            let exportsFile = path.join(path.resolve(outDir), module, `exports_${customElementName}.d.ts`);
            if (_BUILD_OPTIONS.debug) {
                console.log(`rootDir = ${rootDir}`);
                console.log(`outDir = ${outDir}`);
                console.log(`module name = ${module}`);
                console.log(`exports file = ${exportsFile}`);
            }
            try {
                fs.writeFileSync(exportsFile, exportContent);
                if (coreJET) {
                    allComponents[module] = allComponents[module] || [];
                    if (allComponents[module].indexOf(vcomponentName) < 0) {
                        allComponents[module].push(vcomponentName);
                    }
                }
            }
            catch (err) {
                console.log(`An unexpected error happened while generating ${exportsFile}.`);
                throw err;
            }
            try {
                let generatedContent = view.render('container.tmpl', data);
                generatedContent = generatedContent.replace(_REGEX_BLANK_LINES, '');
                content = content.replace(_REGEX_BLANK_LINES, '');
                content += `// Custom Element interfaces\n`;
                content += `${generatedContent}`;
            }
            catch (err) {
                console.log(`An unexpected error happened while generating content for ${fileName}.`);
                throw err;
            }
        }
    }
    return content;
}
function getImportStatements(rootNode, context) {
    var _a, _b;
    let typeImports = '';
    if ('GlobalProps' in ((_a = _BUILD_OPTIONS.importMaps) === null || _a === void 0 ? void 0 : _a.exportToAlias)) {
        typeImports =
            "import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';\n" +
                "import 'ojs/oj-jsx-interfaces';\n";
    }
    else {
        typeImports =
            "import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';\n" +
                "import { GlobalProps } from 'ojs/ojvcomponent';\n" +
                "import 'ojs/oj-jsx-interfaces';\n";
    }
    let isComponentPropsImportNeeded = false;
    const vcomponents = _BUILD_OPTIONS.componentToMetadata;
    const importMaps = _BUILD_OPTIONS.importMaps;
    for (let vcomponentName in vcomponents) {
        let metadata = vcomponents[vcomponentName];
        if (metadata['useComponentPropsForSettableProperties']) {
            if (!((_b = importMaps === null || importMaps === void 0 ? void 0 : importMaps.exportToAlias) === null || _b === void 0 ? void 0 : _b.ComponentProps)) {
                isComponentPropsImportNeeded = true;
                break;
            }
        }
    }
    if (isComponentPropsImportNeeded) {
        typeImports = `import { ComponentProps } 'preact'\n` + typeImports;
    }
    return typeImports;
}
function getComponentTemplateData(metadata, buildOptions, customElementName, vcomponentName) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const legacyComponentName = getLegacyComponentName(metadata, buildOptions, vcomponentName);
    const vcomponentElementName = MetaUtils.tagNameToElementInterfaceName(customElementName);
    const classDataParam = (_a = metadata['classTypeParams']) !== null && _a !== void 0 ? _a : '';
    const classDataParamsAny = getTypeParamsAny(classDataParam);
    const classDataParamsDeclaration = (_b = metadata['classTypeParamsDeclaration']) !== null && _b !== void 0 ? _b : '';
    const propsDataParam = (_c = metadata['propsTypeParams']) !== null && _c !== void 0 ? _c : '';
    const propsClassDataParams = (_d = metadata['propsClassTypeParams']) !== null && _d !== void 0 ? _d : '';
    const propsClassDataParamsDeclaration = (_e = metadata['propsClassTypeParamsDeclaration']) !== null && _e !== void 0 ? _e : '';
    const propsClassName = metadata['propsClassName'];
    let propsComponentPropsAlternateName = '';
    let propsMappedTypesClassName = '';
    let propsReadonlyMappedTypesClassName = '';
    if (metadata['useComponentPropsForSettableProperties']) {
        const componentPropsAlias = ((_g = (_f = buildOptions.importMaps) === null || _f === void 0 ? void 0 : _f.exportToAlias) === null || _g === void 0 ? void 0 : _g.ComponentProps) || 'ComponentProps';
        propsComponentPropsAlternateName = `${componentPropsAlias}<typeof ${vcomponentName}>`;
    }
    else if (metadata['propsMappedTypes']) {
        const mappedPropsInfo = {
            mappedTypes: metadata['propsMappedTypes'],
            wrappedTypeName: propsClassName
        };
        propsMappedTypesClassName = MetaUtils.constructMappedTypeName(mappedPropsInfo, propsClassDataParams);
        propsReadonlyMappedTypesClassName = MetaUtils.constructMappedTypeName(mappedPropsInfo, propsDataParam);
    }
    const data = {
        classTypeParams: classDataParam,
        classTypeParamsDeclaration: classDataParamsDeclaration,
        classTypeParamsAny: classDataParamsAny,
        propsClassTypeParams: propsClassDataParams,
        propsClassTypeParamsDeclaration: propsClassDataParamsDeclaration,
        propsTypeParams: propsDataParam,
        propsTypeParamsAny: (_h = metadata['propsTypeParamsAny']) !== null && _h !== void 0 ? _h : '',
        propsClassName: propsClassName,
        propsComponentPropsAlternateName: propsComponentPropsAlternateName,
        propsMappedTypesClassName: propsMappedTypesClassName,
        propsReadonlyMappedTypesClassName: propsReadonlyMappedTypesClassName,
        componentPropertyInterface: `${vcomponentName}IntrinsicProps`,
        customElementName: customElementName,
        vcomponentClassName: vcomponentName,
        vcomponentName: vcomponentElementName,
        eventMapInterface: `${vcomponentElementName}EventMap`,
        settablePropertiesInterface: `${vcomponentElementName}SettableProperties`,
        settablePropertiesLenientInterface: `${vcomponentElementName}SettablePropertiesLenient`,
        readOnlyProps: metadata['readOnlyProps'],
        funcVCompMethodSignatures: metadata['funcVCompMethodSignatures'],
        properties: metadata.properties,
        events: metadata.events,
        methods: sortAndFilterMethods(metadata.methods),
        slots: metadata.slots,
        dynamicSlots: metadata.dynamicSlots
    };
    if (legacyComponentName) {
        data.legacyComponentName = legacyComponentName;
        data.legacyComponentNameWithGenerics = `${legacyComponentName}${classDataParamsDeclaration}`;
        data.legacyEventMapInterface = `${legacyComponentName}EventMap${classDataParamsDeclaration}`;
        data.legacySettablePropertiesInterface = `${legacyComponentName}SettableProperties${propsClassDataParamsDeclaration}`;
        data.legacySettablePropertiesLenientInterface = `${legacyComponentName}SettablePropertiesLenient${propsClassDataParamsDeclaration}`;
    }
    return data;
}
function getLegacyComponentName(metadata, buildOptions, vcomponentName) {
    var _a;
    const legacyVersion = (_a = buildOptions.coreJetBuildOptions) === null || _a === void 0 ? void 0 : _a.enableLegacyElement;
    const sinceJetVersionStr = metadata['since'];
    let legacyComponentName = '';
    if (legacyVersion != null && sinceJetVersionStr != null) {
        try {
            const sinceJetVersion = Number(sinceJetVersionStr.match(/^([^.]+)/)[0]);
            if (sinceJetVersion < legacyVersion) {
                legacyComponentName = `oj${vcomponentName}`;
            }
        }
        catch (err) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_SINCE, TransformerError_1.ExceptionType.THROW_ERROR, vcomponentName, `Invalid 'since' value: ${sinceJetVersionStr}.`);
        }
    }
    return legacyComponentName;
}
function getComponentExportsString(data, buildOptions) {
    const coreJET = !!buildOptions.coreJetBuildOptions;
    if (coreJET) {
        const exports = [
            data.eventMapInterface,
            data.settablePropertiesInterface,
            data.settablePropertiesLenientInterface,
            data.vcomponentName
        ];
        if (data.legacyComponentName) {
            exports.push(data.legacyEventMapInterface);
            exports.push(data.legacySettablePropertiesInterface);
            exports.push(data.legacySettablePropertiesLenientInterface);
            exports.push(data.legacyComponentName);
        }
        return exports.join(', ');
    }
    return data.vcomponentName;
}
function getTypeParamsAny(params) {
    let retVal = '';
    if (params && params.startsWith('<') && params.endsWith('>')) {
        let retValArr = params.substring(1, params.length - 1).split(',');
        retVal = `<${retValArr.map((val) => 'any').join(',')}>`;
    }
    return retVal;
}
function sortAndFilterMethods(methods) {
    const filter = ['getProperty', 'setProperty', 'setProperties'];
    return Object.keys(methods)
        .sort()
        .reduce((a, c) => {
        if (filter.indexOf(c) < 0) {
            a[c] = methods[c];
        }
        return a;
    }, {});
}
function fixStringLiteralCalls(text) {
    const regex = /(?<=createStringLiteral\()(\s*\'[\w\/.-]+\'\s*)(?=\))/gm;
    const matches = text.match(regex);
    if (matches) {
        text = text.replace(regex, `$1, true`);
    }
    return text;
}
exports.fixStringLiteralCalls = fixStringLiteralCalls;
function fixCreateImportExportSpecifierCalls(text) {
    const regex = /(?:(create(Import|Export)Specifier\())/gm;
    const matches = text.match(regex);
    if (matches) {
        text = text.replace(regex, `$1false, `);
    }
    return text;
}
exports.fixCreateImportExportSpecifierCalls = fixCreateImportExportSpecifierCalls;
function assembleTypes(buildOptions) {
    var _a;
    const coreJET = !!buildOptions.coreJetBuildOptions;
    const EXCLUDED_MODULES = ((_a = buildOptions.coreJetBuildOptions) === null || _a === void 0 ? void 0 : _a.exclude) || [];
    function processImportedDependencies(typeDeclarName, seen) {
        const typeDeclarCont = fs.readFileSync(typeDeclarName, 'utf-8');
        let matches;
        while ((matches = regexImportDep.exec(typeDeclarCont)) !== null) {
            const importTypeFile = matches.groups.localdep;
            const typeDeclarFile = path.join(path.dirname(typeDeclarName), `${importTypeFile}.d.ts`);
            if (!seen.has(`${path.basename(typeDeclarFile)}`)) {
                seen.add(`${path.basename(typeDeclarFile)}`);
                processImportedDependencies(typeDeclarFile, seen);
            }
        }
    }
    const typeDefinitionFile = buildOptions.mainEntryFile;
    const pathToCompiledTsCode = buildOptions.tsBuiltDir;
    const regexExportDep = new RegExp(/^\s*export\s+[\w ,]*{\s*(?<exports>[\w ,]+)\s*}[\w ,]*(\s+from\s+)['"](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/gm);
    const regexImportDep = new RegExp(/^[\s]*import\s+[\w\s\{\}\*,]*["'](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/gm);
    let moduleTypeDependencies = {};
    let destFilePath;
    const moduleEntryFiles = glob.sync(`${pathToCompiledTsCode}/**/${typeDefinitionFile}`);
    moduleEntryFiles.forEach((entryFile) => {
        const moduleDir = path.dirname(entryFile);
        const moduleName = moduleDir.substring(pathToCompiledTsCode.length + 1);
        if (EXCLUDED_MODULES.indexOf(moduleName) > -1) {
            return;
        }
        const exports_files = glob.sync(`${moduleDir}/exports_*.d.ts`);
        if (exports_files.length == 0) {
            return;
        }
        const sourceFileContent = fs.readFileSync(entryFile, 'utf-8');
        const finalExports = [];
        if (!coreJET) {
            finalExports.push(sourceFileContent.replace(regexImportDep, '').trim());
        }
        moduleTypeDependencies[moduleName] = new Set();
        exports_files.forEach((expfile) => {
            const expFileContent = fs.readFileSync(expfile, 'utf-8');
            finalExports.push(expFileContent);
        });
        let matches;
        while ((matches = regexExportDep.exec(sourceFileContent)) !== null) {
            const exportTypeFile = matches.groups.localdep;
            const exports = matches.groups.exports;
            if (coreJET) {
                let inject = true;
                let statementToInject = matches[0];
                if (exports && allComponents[moduleName]) {
                    let namedExports = exports.split(',').map((comp) => comp.trim());
                    namedExports = namedExports.filter((comp) => allComponents[moduleName].indexOf(comp) < 0);
                    if (namedExports.length > 0) {
                        statementToInject = statementToInject.replace(matches[1], namedExports.join(','));
                    }
                    else {
                        inject = false;
                    }
                }
                if (inject) {
                    finalExports.unshift(statementToInject);
                }
            }
            const typeDeclarFile = path.join(moduleDir, `${exportTypeFile}.d.ts`);
            if (!moduleTypeDependencies[moduleName].has(`${path.basename(typeDeclarFile)}`)) {
                moduleTypeDependencies[moduleName].add(`${path.basename(typeDeclarFile)}`);
                processImportedDependencies(typeDeclarFile, moduleTypeDependencies[moduleName]);
            }
        }
        const destDir = buildOptions.coreJetBuildOptions
            ? `${buildOptions.typesDir}/${moduleName}`
            : `${buildOptions.typesDir}/${moduleName}/types/`;
        if (buildOptions.debug) {
            console.log(`empty ${destDir}`);
        }
        fs.emptyDirSync(destDir);
        destFilePath = path.join(destDir, typeDefinitionFile);
        if (buildOptions.debug) {
            console.log(`create file ${destFilePath}`);
        }
        fs.writeFileSync(destFilePath, finalExports.join('\n'), {
            encoding: 'utf-8'
        });
        moduleTypeDependencies[moduleName].forEach((dtsFile) => {
            if (buildOptions.debug) {
                console.log(`copy file ${path.join(moduleDir, dtsFile)} to ${path.join(destDir, dtsFile)}`);
            }
            fs.copyFileSync(path.join(moduleDir, dtsFile), path.join(destDir, dtsFile));
        });
    });
}
exports.assembleTypes = assembleTypes;
//# sourceMappingURL=dtsTransformer.js.map