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
exports.assembleTypes = void 0;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const template_1 = require("./template");
const MetaTypes = __importStar(require("./utils/MetadataTypes"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const TransformerError_1 = require("./utils/TransformerError");
let _BUILD_OPTIONS;
let view;
const _REGEX_BLANK_LINES = new RegExp(/^(?:[\t ]*(?:\r?\n|\r))+/gm);
const _REGEX_LINE_BREAKS = new RegExp(/(\r?\n|\r)/g);
const _PROP_NOT_APPLICABLE = '';
let _COMPILER_OPTIONS;
let allComponents = {};
function dtsTransformWrapper(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    const templatePath = buildOptions.templatePath;
    view = new template_1.Template(templatePath);
    _COMPILER_OPTIONS = program.getCompilerOptions();
    const dtsTransformer = (context) => {
        return ((sf) => {
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
        });
    };
    return dtsTransformer;
}
exports.default = dtsTransformWrapper;
function assembleTypes(buildOptions) {
    if (buildOptions.typesDir !== undefined) {
        const coreJET = !!buildOptions.coreJetBuildOptions;
        const EXCLUDED_MODULES = buildOptions.coreJetBuildOptions?.exclude || [];
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
        const pathToCompiledTsCode = buildOptions.tsBuiltDir;
        const regexExportDep = new RegExp(/^\s*export\s+[\w ,]*{\s*(?<exports>[\w ,]+)\s*}[\w ,]*(\s+from\s+)['"](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/gm);
        const regexImportDep = new RegExp(/^[\s]*import\s+[\w\s\{\}\*,]*["'](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/gm);
        const moduleTypeDependencies = {};
        const processedModuleNames = new Set();
        let destFilePath;
        const moduleEntryFiles = glob.sync(`${pathToCompiledTsCode}/**/*(index.d.ts|loader.d.ts)`);
        moduleEntryFiles.forEach((entryFile) => {
            const moduleDir = path.dirname(entryFile);
            const typeDefinitionFile = path.basename(entryFile);
            const moduleName = moduleDir.substring(pathToCompiledTsCode.length + 1);
            if (EXCLUDED_MODULES.indexOf(moduleName) > -1) {
                return;
            }
            const exports_files = glob.sync(`${moduleDir}/exports_*.d.ts`);
            if (exports_files.length == 0) {
                return;
            }
            else if (processedModuleNames.has(moduleName)) {
                return;
            }
            else {
                processedModuleNames.add(moduleName);
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
            fs.writeFileSync(destFilePath, finalExports.join('\n'), { encoding: 'utf-8' });
            moduleTypeDependencies[moduleName].forEach((dtsFile) => {
                if (buildOptions.debug) {
                    console.log(`copy file ${path.join(moduleDir, dtsFile)} to ${path.join(destDir, dtsFile)}`);
                }
                fs.copyFileSync(path.join(moduleDir, dtsFile), path.join(destDir, dtsFile));
            });
        });
    }
}
exports.assembleTypes = assembleTypes;
function generateCustomElementTypes(context, rootNode) {
    const { factory } = context;
    if (_COMPILER_OPTIONS.removeComments) {
        const newImports = getImportStatements();
        const importStatements = MetaUtils.generateStatementsFromText(newImports);
        const newContent = generateCustomElementTypeContent(rootNode.fileName);
        const newStatements = MetaUtils.generateStatementsFromText(newContent);
        return factory.updateSourceFile(rootNode, [
            ...importStatements,
            ...rootNode.statements,
            ...newStatements
        ]);
    }
    else {
        const newContent = getImportStatements() + generateCustomElementTypeContent(rootNode.fileName);
        const newStatements = MetaUtils.generateStatementsFromText(newContent, rootNode.getEnd() - 1);
        applyAnnotationsFromMetadata(rootNode.statements, newStatements, _BUILD_OPTIONS.componentToMetadata);
        return factory.updateSourceFile(rootNode, [...rootNode.statements, ...newStatements]);
    }
}
function generateCustomElementTypeContent(fileName) {
    let content = '';
    const coreJET = !!_BUILD_OPTIONS.coreJetBuildOptions;
    const vcomponents = _BUILD_OPTIONS.componentToMetadata;
    for (const vcomponentName in vcomponents) {
        let metadata = vcomponents[vcomponentName];
        const customElementName = metadata.name;
        if (customElementName) {
            const vcompNames = new VCompNames(vcomponentName, customElementName);
            const data = getComponentTemplateData(metadata, _BUILD_OPTIONS, vcompNames);
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
                    if (allComponents[module].indexOf(vcompNames.name) < 0) {
                        allComponents[module].push(vcompNames.name);
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
function getImportStatements() {
    let typeImports = '';
    if ('GlobalProps' in _BUILD_OPTIONS.importMaps?.exportToAlias) {
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
            if (!importMaps?.exportToAlias?.ComponentProps) {
                isComponentPropsImportNeeded = true;
                break;
            }
        }
    }
    if (isComponentPropsImportNeeded) {
        typeImports = `import { ComponentProps } from 'preact'\n` + typeImports;
    }
    return typeImports;
}
function getComponentTemplateData(metadata, buildOptions, vcompNames) {
    const legacyComponentName = getLegacyComponentName(metadata, buildOptions, vcompNames.name);
    const classDataParam = metadata['classTypeParams'] ?? '';
    const classDataParamsAny = metadata['classTypeParamsAny'] ?? '';
    const classDataParamsDeclaration = metadata['classTypeParamsDeclaration'] ?? '';
    const propsDataParam = metadata['propsTypeParams'] ?? '';
    const propsClassDataParams = metadata['propsClassTypeParams'] ?? '';
    const propsClassDataParamsDeclaration = metadata['propsClassTypeParamsDeclaration'] ?? '';
    const propsClassName = metadata['propsClassName'];
    let propsComponentPropsAlternateName = '';
    let propsMappedTypesClassName = '';
    let propsReadonlyMappedTypesClassName = '';
    if (metadata['useComponentPropsForSettableProperties']) {
        const componentPropsAlias = buildOptions.importMaps?.exportToAlias?.ComponentProps || 'ComponentProps';
        propsComponentPropsAlternateName = `${componentPropsAlias}<typeof ${vcompNames.name}>`;
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
        propsTypeParamsAny: metadata['propsTypeParamsAny'] ?? '',
        propsClassName: propsClassName,
        propsComponentPropsAlternateName: propsComponentPropsAlternateName,
        propsMappedTypesClassName: propsMappedTypesClassName,
        propsReadonlyMappedTypesClassName: propsReadonlyMappedTypesClassName,
        globalPropsName: buildOptions.importMaps?.exportToAlias?.GlobalProps ?? 'GlobalProps',
        vcomponentClassName: vcompNames.name,
        customElementName: vcompNames.customElementName,
        vcomponentName: vcompNames.elementInterface,
        eventMapInterface: vcompNames.eventMapInterface,
        settablePropertiesInterface: vcompNames.settablePropertiesInterface,
        settablePropertiesLenientInterface: vcompNames.settablePropertiesLenientInterface,
        componentPropertyInterface: vcompNames.intrinsicPropsInterface,
        readOnlyProps: metadata['readOnlyProps'],
        templateSlotProps: metadata['templateSlotProps'] ?? [],
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
        data.legacyEventMapInterface = `${legacyComponentName}${VCompNames._EVENTMAP}${classDataParamsDeclaration}`;
        data.legacySettablePropertiesInterface = `${legacyComponentName}${VCompNames._SETTABLEPROPS}${propsClassDataParamsDeclaration}`;
        data.legacySettablePropertiesLenientInterface = `${legacyComponentName}${VCompNames._SETTABLEPROPSLENIENT}${propsClassDataParamsDeclaration}`;
    }
    return data;
}
function getLegacyComponentName(metadata, buildOptions, vcomponentName) {
    const legacyVersion = buildOptions.coreJetBuildOptions?.enableLegacyElement;
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
function applyAnnotationsFromMetadata(origStatements, statements, componentToMetadata) {
    for (const vcomp in componentToMetadata) {
        let metadata = componentToMetadata[vcomp];
        const custElem = metadata.name;
        if (custElem) {
            const vcompNames = new VCompNames(vcomp, custElem);
            const vcName = vcompNames.name;
            const vcompDecl = origStatements.find((stmt) => isVCompDeclStatement(stmt, vcName));
            const elementInterface = vcompNames.elementInterface;
            const vcompElementInterfaceDecl = statements.find((stmt) => ts.isInterfaceDeclaration(stmt) && ts.idText(stmt.name) === elementInterface);
            const vcompElementNamespaceDecl = statements.find((stmt) => ts.isModuleDeclaration(stmt) && stmt.name.text === elementInterface);
            const settablePropertiesInterface = vcompNames.settablePropertiesInterface;
            const vcompSettablePropsDecl = statements.find((stmt) => ts.isInterfaceDeclaration(stmt) && ts.idText(stmt.name) === settablePropertiesInterface);
            const intrinsicPropsInterface = vcompNames.intrinsicPropsInterface;
            const vcompIntrinsicPropsDecl = statements.find((stmt) => ts.isInterfaceDeclaration(stmt) && ts.idText(stmt.name) === intrinsicPropsInterface);
            const vcompDeprecated = metadata.status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
            if (vcompDecl) {
                applyAnnotationComments(MetaTypes.MDContext.COMP, _PROP_NOT_APPLICABLE, vcompDecl, undefined, `This export corresponds to the ${vcompNames.name} Preact component. For the ${vcompNames.customElementName} custom element, import ${vcompNames.elementInterface} instead.`, vcompDeprecated);
            }
            applyAnnotationComments(MetaTypes.MDContext.COMP, _PROP_NOT_APPLICABLE, vcompElementInterfaceDecl, undefined, `This export corresponds to the ${vcompNames.customElementName} custom element. For the ${vcompNames.name} Preact component, import ${vcompNames.name} instead.`, vcompDeprecated);
            const properties = metadata.properties;
            if (properties) {
                for (const prop in properties) {
                    const description = properties[prop]['jsdoc']?.['description'];
                    const deprecated = properties[prop].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
                    if (description || deprecated) {
                        const propDecl = properties[prop].readOnly
                            ? vcompElementInterfaceDecl
                            : vcompSettablePropsDecl;
                        applyAnnotationComments(MetaTypes.MDContext.PROP, prop, propDecl, vcompIntrinsicPropsDecl, description, deprecated);
                    }
                }
            }
            const events = metadata.events;
            if (events) {
                for (const event in events) {
                    const description = events[event]['jsdoc']?.['description'];
                    const deprecated = events[event].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
                    if (description || deprecated) {
                        applyAnnotationComments(MetaTypes.MDContext.EVENT, event, undefined, vcompIntrinsicPropsDecl, description, deprecated);
                    }
                }
            }
            const methods = metadata.methods;
            if (methods) {
                for (const method in methods) {
                    const description = methods[method]['jsdoc']?.['description'];
                    const deprecated = methods[method].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
                    if (description || deprecated) {
                        applyAnnotationComments(MetaTypes.MDContext.METHOD, method, vcompElementInterfaceDecl, undefined, description, deprecated);
                    }
                }
            }
            const templateSlots = metadata['templateSlotProps'];
            if (templateSlots) {
                for (const tSlot of templateSlots) {
                    if (tSlot.slotRenderType && tSlot.slotDeprecation) {
                        applyAnnotationComments(MetaTypes.MDContext.SLOT, tSlot.slotRenderType, vcompElementNamespaceDecl, undefined, undefined, tSlot.slotDeprecation);
                    }
                }
            }
        }
    }
}
function applyAnnotationComments(mdContext, mdProp, mdDecl, mdCallbackDecl, description, deprecated) {
    let descriptionText;
    let deprecatedMin;
    let deprecatedFull;
    const hasTrailingNewLine = description !== undefined ||
        deprecated?.value !== undefined ||
        deprecated?.description !== undefined;
    if (description) {
        description = description.replace(_REGEX_LINE_BREAKS, '$1 * ');
        descriptionText = `*
 * ${description}
 `;
    }
    if (deprecated) {
        deprecatedMin = `* @deprecated `;
        if (deprecated.since) {
            deprecatedMin += `since ${deprecated.since} `;
        }
        if (hasTrailingNewLine && description == undefined) {
            deprecatedFull = `*
 ${deprecatedMin} `;
        }
        else {
            deprecatedFull = deprecatedMin.substring(0);
        }
        if (deprecated.value || deprecated.description) {
            if (deprecated.since) {
                deprecatedFull += '- ';
            }
            if (deprecated.value) {
                const altValues = mdContext & MetaTypes.MDContext.EVENT
                    ? deprecated.value.map((val) => `on${val}`).join(', ')
                    : deprecated.value.join(', ');
                deprecatedFull += `${deprecated.value.length == 1 ? 'Suggested alternative: ' : 'Suggested alternatives: '}${altValues}. `;
            }
            if (deprecated.description) {
                deprecatedFull += `${deprecated.description} `;
            }
        }
        if (hasTrailingNewLine) {
            deprecatedFull += `
 `;
        }
    }
    const fullComment = (descriptionText ?? '') + (deprecatedFull ?? '');
    if (mdContext & MetaTypes.MDContext.COMP && fullComment.length > 0) {
        ts.addSyntheticLeadingComment(mdDecl, ts.SyntaxKind.MultiLineCommentTrivia, fullComment, hasTrailingNewLine);
    }
    if (mdContext & (MetaTypes.MDContext.PROP | MetaTypes.MDContext.METHOD) &&
        fullComment.length > 0) {
        const mdPropSignature = mdDecl?.members.find((mbr) => ts.isPropertySignature(mbr) && ts.isIdentifier(mbr.name) && ts.idText(mbr.name) === mdProp);
        if (mdPropSignature) {
            ts.addSyntheticLeadingComment(mdPropSignature, ts.SyntaxKind.MultiLineCommentTrivia, fullComment, hasTrailingNewLine);
        }
    }
    if ((mdContext & MetaTypes.MDContext.PROP && deprecatedMin) ||
        (mdContext & MetaTypes.MDContext.EVENT && fullComment.length > 0)) {
        const mdCallback = mdContext & MetaTypes.MDContext.PROP ? `on${mdProp}Changed` : `on${mdProp}`;
        const mdCallbackSignature = mdCallbackDecl?.members.find((mbr) => ts.isPropertySignature(mbr) &&
            ts.isIdentifier(mbr.name) &&
            ts.idText(mbr.name) === mdCallback);
        if (mdCallbackSignature) {
            if (mdContext & MetaTypes.MDContext.PROP) {
                ts.addSyntheticLeadingComment(mdCallbackSignature, ts.SyntaxKind.MultiLineCommentTrivia, deprecatedMin, false);
            }
            else {
                ts.addSyntheticLeadingComment(mdCallbackSignature, ts.SyntaxKind.MultiLineCommentTrivia, fullComment, hasTrailingNewLine);
            }
        }
    }
    if (mdContext & MetaTypes.MDContext.SLOT) {
        const moduleBody = mdDecl.body;
        if (moduleBody && ts.isModuleBlock(moduleBody)) {
            const renderSlotType = moduleBody.statements.find((stmt) => ts.isTypeAliasDeclaration(stmt) && ts.idText(stmt.name) === mdProp);
            if (renderSlotType) {
                ts.addSyntheticLeadingComment(renderSlotType, ts.SyntaxKind.MultiLineCommentTrivia, fullComment, hasTrailingNewLine);
            }
        }
    }
}
class VCompNames {
    constructor(vcompName, tagName) {
        if (vcompName === tagName) {
            vcompName = MetaUtils.tagNameToElementRoot(tagName);
        }
        this._vcompName = vcompName;
        this._tagName = tagName;
    }
    get name() {
        return this._vcompName;
    }
    get customElementName() {
        return this._tagName;
    }
    get elementInterface() {
        return `${MetaUtils.tagNameToElementInterfaceName(this._tagName)}`;
    }
    get eventMapInterface() {
        return `${this.elementInterface}${VCompNames._EVENTMAP}`;
    }
    get settablePropertiesInterface() {
        return `${this.elementInterface}${VCompNames._SETTABLEPROPS}`;
    }
    get settablePropertiesLenientInterface() {
        return `${this.elementInterface}${VCompNames._SETTABLEPROPSLENIENT}`;
    }
    get intrinsicPropsInterface() {
        return `${this._vcompName}${VCompNames._INTRINSICPROPS}`;
    }
}
VCompNames._EVENTMAP = 'EventMap';
VCompNames._SETTABLEPROPS = 'SettableProperties';
VCompNames._SETTABLEPROPSLENIENT = 'SettablePropertiesLenient';
VCompNames._INTRINSICPROPS = 'IntrinsicProps';
function isVCompDeclStatement(statement, vcompName) {
    let isFound = false;
    if (ts.isClassDeclaration(statement) && statement.name?.getText() === vcompName) {
        isFound = true;
    }
    else if (ts.isVariableStatement(statement)) {
        const varDecl = statement.declarationList.declarations[0];
        if (ts.isIdentifier(varDecl.name) && ts.idText(varDecl.name) === vcompName) {
            isFound = true;
        }
    }
    return isFound;
}
function fixStringLiteralCalls(text) {
    const regex = /(?<=createStringLiteral\()(\s*\'[\w\/.-]+\'\s*)(?=\))/gm;
    const matches = text.match(regex);
    if (matches) {
        text = text.replace(regex, `$1, true`);
    }
    return text;
}
function fixCreateImportExportSpecifierCalls(text) {
    const regex = /(?:(create(Import|Export)Specifier\())/gm;
    const matches = text.match(regex);
    if (matches) {
        text = text.replace(regex, `$1false, `);
    }
    return text;
}
//# sourceMappingURL=dtsTransformer.js.map