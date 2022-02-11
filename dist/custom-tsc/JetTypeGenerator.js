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
exports.assembleTypes = exports.getTypeGenerator = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const template_1 = require("./template");
const glob = __importStar(require("glob"));
const TransformerError_1 = require("./utils/TransformerError");
const _REGEX_LINE_ENDING = new RegExp(/(\r\n|\r)/gm);
const _REGEX_BLANK_LINES = new RegExp(/^(?:[\t ]*(?:\r?\n|\r))+/gm);
const _REGEX_EMPTY_EXPORT = new RegExp(/export {};/gi);
function getTypeGenerator(buildOptions) {
    const templatePath = buildOptions.templatePath;
    const view = new template_1.Template(templatePath);
    return (fileName, content) => {
        var _a;
        const dirname = path.dirname(fileName);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }
        let importComponentChildren = false;
        if (fileName.endsWith('d.ts')) {
            content = content.replace(_REGEX_EMPTY_EXPORT, '');
            content = content.replace(_REGEX_BLANK_LINES, '');
            if (buildOptions.componentToMetadata) {
                let typeImports = '';
                if ('GlobalProps' in ((_a = buildOptions.importMaps) === null || _a === void 0 ? void 0 : _a.exportToAlias)) {
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
                content = typeImports + content;
                const vcomponents = buildOptions.componentToMetadata;
                for (let vcomponentName in vcomponents) {
                    let metadata = vcomponents[vcomponentName];
                    const customElementName = metadata.name;
                    if (customElementName) {
                        if (vcomponentName === customElementName) {
                            vcomponentName = MetaUtils.tagNameToElementName(customElementName);
                        }
                        const data = getComponentTemplateData(metadata, buildOptions, customElementName, vcomponentName);
                        if (data.slots || data.dynamicSlots) {
                            importComponentChildren = true;
                        }
                        const exports = getComponentExportsString(data, buildOptions);
                        const baseFileName = path.basename(fileName, '.d.ts');
                        const exportContent = `export { ${exports} } from './${baseFileName}';`;
                        const exportsFile = path.join(path.dirname(fileName), `exports_${customElementName}.d.ts`);
                        try {
                            let generatedContent = view.render('container.tmpl', data);
                            generatedContent = generatedContent.replace(_REGEX_BLANK_LINES, '');
                            content = content.replace(_REGEX_BLANK_LINES, '');
                            content += `// Custom Element interfaces\n`;
                            content += `${generatedContent}`;
                            fs.writeFileSync(exportsFile, exportContent);
                        }
                        catch (err) {
                            console.log(`An unexpected error happened while generating content for ${fileName}.`);
                            throw err;
                        }
                    }
                }
            }
        }
        if (importComponentChildren && !isUsingComponentChildren(content)) {
            const statement = 'import { ComponentChildren } from "preact"\n';
            content = statement + content;
        }
        content = content.replace(_REGEX_LINE_ENDING, '\n');
        fs.writeFileSync(fileName, content);
    };
}
exports.getTypeGenerator = getTypeGenerator;
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
    const regexExportDep = new RegExp(/^\s*(export\s).+(\s+from\s+)['"](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/gm);
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
        const coreJETSuppressedExports = new Set();
        exports_files.forEach((expfile) => {
            const expFileContent = fs.readFileSync(expfile, 'utf-8');
            if (coreJET) {
                let injectedMatches;
                while ((injectedMatches = regexExportDep.exec(expFileContent)) !== null) {
                    coreJETSuppressedExports.add(injectedMatches.groups.localdep);
                }
            }
            finalExports.push(expFileContent);
        });
        let matches;
        while ((matches = regexExportDep.exec(sourceFileContent)) !== null) {
            const exportTypeFile = matches.groups.localdep;
            if (coreJET && !coreJETSuppressedExports.has(exportTypeFile)) {
                finalExports.unshift(matches[0]);
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
function getComponentTemplateData(metadata, buildOptions, customElementName, vcomponentName) {
    var _a, _b, _c, _d, _e, _f;
    const legacyComponentName = getLegacyComponentName(metadata, buildOptions, vcomponentName);
    const vcomponentElementName = MetaUtils.tagNameToElementInterfaceName(customElementName);
    const classDataParam = (_a = metadata['classTypeParams']) !== null && _a !== void 0 ? _a : '';
    const classDataParamsAny = getTypeParamsAny(classDataParam);
    const classDataParamsDeclaration = (_b = metadata['classTypeParamsDeclaration']) !== null && _b !== void 0 ? _b : '';
    const propsDataParam = (_c = metadata['propsTypeParams']) !== null && _c !== void 0 ? _c : '';
    const propsClassDataParams = (_d = metadata['propsClassTypeParams']) !== null && _d !== void 0 ? _d : '';
    const propsClassDataParamsDeclaration = (_e = metadata['propsClassTypeParamsDeclaration']) !== null && _e !== void 0 ? _e : '';
    const propsClassName = metadata['propsClassName'];
    let propsMappedTypesClassName = '';
    let propsReadonlyMappedTypesClassName = '';
    if (metadata['propsMappedTypes']) {
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
        propsTypeParamsAny: (_f = metadata['propsTypeParamsAny']) !== null && _f !== void 0 ? _f : '',
        propsClassName: propsClassName,
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
            throw new TransformerError_1.TransformerError(vcomponentName, `Invalid 'since' value: ${sinceJetVersionStr}.`);
        }
    }
    return legacyComponentName;
}
function isUsingComponentChildren(content) {
    const regexp = new RegExp(/\s*import\s+\{[\w\,\s]+\bComponentChildren\b[\w\,\s]+\}\s+from\s+['"]preact['"]/, 'g');
    return regexp.test(content);
}
//# sourceMappingURL=JetTypeGenerator.js.map