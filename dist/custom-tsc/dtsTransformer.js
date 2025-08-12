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
exports.default = dtsTransformWrapper;
exports.assembleTypes = assembleTypes;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const template_1 = require("./template");
const MetaTypes = __importStar(require("./utils/MetadataTypes"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const TransformerError_1 = require("./utils/TransformerError");
const Utils_1 = require("./shared/Utils");
let _BUILD_OPTIONS;
let view;
const _REGEX_BLANK_LINES = new RegExp(/^(?:[\t ]*(?:\r?\n|\r))+/gm);
const _REGEX_LINE_BREAKS = new RegExp(/(\r?\n|\r)/g);
// N/A placeholder for applyAnnotationComments calls
// when (context === MetaTypes.MDContext.COMP)
const _PROP_NOT_APPLICABLE = '';
let _COMPILER_OPTIONS;
let allComponents = {};
/**
 * Transformer run over the TypeScript AST to add custom element specific AST nodes effectively manipulating the
 * final d.ts file
 * @param program
 * @param buildOptions
 */
function dtsTransformWrapper(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    const templatePath = buildOptions.templatePath;
    view = new template_1.Template(templatePath);
    _COMPILER_OPTIONS = program.getCompilerOptions();
    const dtsTransformer = (context) => {
        return ((sf) => {
            function visit(node) {
                if (buildOptions.componentToMetadata) {
                    //ts.visitEachChild(node, visit, context);
                    // this should update the statements of the SF Node
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
function assembleTypes(buildOptions) {
    // Has a directory been identified in which to assemble type definitions?
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
        // regex to find the local dependency name from export {name} from '<path>' lines
        const regexExportDep = new RegExp(/^\s*export\s+[\w ,]*{\s*(?<exports>[\w ,]+)\s*}[\w ,]*(\s+from\s+)['"](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/gm);
        // regex to find the local dependency name from import {name} from '<path>' lines
        const regexImportDep = new RegExp(/^[\s]*import\s+[\w\s\{\}\*,]*["'](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/gm);
        const moduleTypeDependencies = {};
        const processedModuleNames = new Set();
        let destFilePath;
        // ensure we have a normalized path so that we can extract
        // the correct moduleName from each module entryFile
        const pathToCompiledTsCode = path.normalize(buildOptions.tsBuiltDir);
        // find all the index.d.ts or loader.d.ts files
        const moduleEntryFiles = glob.sync(`${pathToCompiledTsCode}/**/*(index.d.ts|loader.d.ts)`);
        moduleEntryFiles.forEach((entryFile) => {
            const moduleDir = path.dirname(entryFile);
            const typeDefinitionFile = path.basename(entryFile);
            const moduleName = moduleDir.substring(pathToCompiledTsCode.length + 1);
            if (EXCLUDED_MODULES.indexOf(moduleName) > -1) {
                return;
            }
            // check for the existence of any exports_<custom_elem_name>.d.ts file,
            // indicating that we have a VComponent instance
            // -- if none exists, skip this moduleEntryFile
            const exports_files = glob.sync(`${moduleDir}/exports_*.d.ts`);
            if (exports_files.length == 0) {
                return;
            }
            // otherwise check if we have already processed this moduleName (which might
            // be the case if this VComponent had both an index.d.ts and a duplicate
            // loader.d.ts for legacy purposes)
            // -- if so, skip this moduleEntryFile
            else if (processedModuleNames.has(moduleName)) {
                return;
            }
            // otherwise remember that we have processed this moduleName
            else {
                processedModuleNames.add(moduleName);
            }
            // read the file and remove all the imports
            const sourceFileContent = fs.readFileSync(entryFile, 'utf-8');
            // build up a new index.d.ts file from the existing index.d.ts (or loader.d.ts)
            const finalExports = [];
            if (!coreJET) {
                // We want to preserve the default TS exports outside of core JET
                // Within core JET, we want to suppress the export of the VComp classes
                finalExports.push(sourceFileContent.replace(regexImportDep, '').trim());
            }
            moduleTypeDependencies[moduleName] = new Set();
            exports_files.forEach((expfile) => {
                //read the file and add its content to index.d.ts/loader.d.ts
                const expFileContent = fs.readFileSync(expfile, 'utf-8');
                finalExports.push(expFileContent);
            });
            // Go line by line and get the locally exported type file names. We will read those and check for local
            // type dependencies. These local d.ts files will need to be copied to the final destination along with the index.d.ts file
            let matches;
            while ((matches = regexExportDep.exec(sourceFileContent)) !== null) {
                const exportTypeFile = matches.groups.localdep;
                // match named exports from index.d.ts - used to remove the vcomponent class (for coreJet) but preserve other named exports
                const exports = matches.groups.exports;
                if (coreJET) {
                    let inject = true;
                    let statementToInject = matches[0];
                    // we want to let this export through in core JET however remove any reference to the vcomp class
                    // check if this module has one or more vcomponents
                    if (exports && allComponents[moduleName]) {
                        let namedExports = exports.split(',').map((comp) => comp.trim());
                        //filter out vcomponent name from exports
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
            // we assembled the content of one module's index.d.ts/loader.d.ts, so now
            // it's time to write the module's types to the assembly destination
            // (for jet core components the destination has a different structure)
            const destDir = buildOptions.coreJetBuildOptions
                ? `${buildOptions.typesDir}/${moduleName}`
                : `${buildOptions.typesDir}/${moduleName}/types/`;
            // make sure the directory is empty (will create if does not exist)
            if (buildOptions.debug) {
                console.log(`empty ${destDir}`);
            }
            fs.emptyDirSync(destDir);
            destFilePath = path.join(destDir, typeDefinitionFile);
            if (buildOptions.debug) {
                console.log(`create file ${destFilePath}`);
            }
            fs.writeFileSync(destFilePath, finalExports.join('\n'), { encoding: 'utf-8' });
            // now copy all the other d.ts files to the final destination
            moduleTypeDependencies[moduleName].forEach((dtsFile) => {
                if (buildOptions.debug) {
                    console.log(`copy file ${path.join(moduleDir, dtsFile)} to ${path.join(destDir, dtsFile)}`);
                }
                fs.copyFileSync(path.join(moduleDir, dtsFile), path.join(destDir, dtsFile));
            });
        });
    }
}
// Private functions
function generateCustomElementTypes(context, rootNode) {
    const { factory } = context;
    // If comments removed during emit, maintain the status quo...
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
    // ...otherwise, append the new content in one chunk with adjusted positioning.
    else {
        // New content string consists of new import statements required to support
        // the generated VComponent custom element type declararations
        const newContent = getImportStatements() + generateCustomElementTypeContent(rootNode.fileName);
        // Convert the new content to ts.Statements, passing an offset so that they will be
        // properly positioned at the end of the ts.SourceFile - this repositioning is required
        // to account for JSDoc comment "trivia" during emit
        const newStatements = MetaUtils.generateStatementsFromText(newContent, rootNode.getEnd() - 1);
        // Apply annotations in the form of synthetic comments
        applyAnnotationsFromMetadata(rootNode.statements, newStatements, _BUILD_OPTIONS.componentToMetadata);
        // Return a updated ts.SourceFile with the new content appended at the end
        return factory.updateSourceFile(rootNode, [...rootNode.statements, ...newStatements]);
    }
}
function generateCustomElementTypeContent(fileName) {
    let content = '';
    const coreJET = !!_BUILD_OPTIONS.coreJetBuildOptions;
    const vcomponents = _BUILD_OPTIONS.componentToMetadata;
    // we could have multiple VComponents defined in a d.ts file for which we want to generate custom element interfaces
    for (const vcomponentName in vcomponents) {
        let metadata = vcomponents[vcomponentName];
        // ex: oj-file-picker, foo-basic
        const customElementName = metadata.name;
        if (customElementName) {
            // Create instance of class that provides names for type definition generation
            const vcompNames = new VCompNames(vcomponentName, customElementName);
            // Generate the data object passed to the templates
            const data = getComponentTemplateData(metadata, _BUILD_OPTIONS, vcompNames);
            // Export calls for the types we will generate. The existence of this file serves as clue in the assembleTypes
            // function that we deal with custom element component
            const exports = getComponentExportsString(data, _BUILD_OPTIONS);
            const baseFileName = path.basename(fileName, '.tsx');
            const exportContent = `export { ${exports} } from './${baseFileName}';`;
            const rootDir = _COMPILER_OPTIONS.rootDir;
            const outDir = _COMPILER_OPTIONS.outDir || rootDir || path.dirname(fileName);
            // if no rootDir or outDir is specified, the exports_... file will be written out to the same dir as the source file
            // find the module path name by finding the diff between the full path of the fileName and the rootDir
            //arrayify the path of the fileName, removing the fileName itself from the end;
            const arrDirs = path.resolve(fileName).split(path.sep).slice(0, -1);
            // reasonable presumption of the module name, being the folder that contains the source file
            //let module = arrDirs[arrDirs.length - 1];
            let module = '';
            // refine now based on rootDir setting
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
                // this should be the diff
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
                // the exports file will be used to insert its content into the final index.d.ts file of the module
                // exposing the custom element types
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
    // We could have multiple VComponents defined in a d.ts file, check if any of them
    // require a ComponentProps import
    for (let vcomponentName in vcomponents) {
        let metadata = vcomponents[vcomponentName];
        if (metadata['useComponentPropsForSettableProperties']) {
            // Force injection of 'ComponentProps' only if there was
            // no other usage
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
/**
 * Generate the data object used for the templates
 */
function getComponentTemplateData(metadata, buildOptions, vcompNames
//  customElementName: string,
//  vcomponentName: string
) {
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
    // If this is a functional VComponent use case where we can't rely upon
    // the declaration of the Props type alias to be included in the
    // generated d.ts file, then use an alternate pattern to refer to the
    // Props type when generating references to readonly and settable properties.
    if (metadata['useComponentPropsForSettableProperties']) {
        const componentPropsAlias = buildOptions.importMaps?.exportToAlias?.ComponentProps || 'ComponentProps';
        propsComponentPropsAlternateName = `${componentPropsAlias}<typeof ${vcompNames.name}>`;
    }
    // Otherwise, if the Props "class" is a MappedType, construct two versions
    // of its name (one for settable Properties, and one for readonly Properties),
    // with the appropriate type parameters for the innermost Type.
    else if (metadata['propsMappedTypes']) {
        const mappedPropsInfo = {
            mappedTypes: metadata['propsMappedTypes'],
            wrappedTypeName: propsClassName
        };
        propsMappedTypesClassName = MetaUtils.constructMappedTypeName(mappedPropsInfo, propsClassDataParams);
        propsReadonlyMappedTypesClassName = MetaUtils.constructMappedTypeName(mappedPropsInfo, propsDataParam);
    }
    const data = {
        // the type parameter names used by the VComp class
        classTypeParams: classDataParam,
        // the type parameter declaration used by the VComp class
        classTypeParamsDeclaration: classDataParamsDeclaration,
        classTypeParamsAny: classDataParamsAny,
        // the type parameter names used by the Props class
        propsClassTypeParams: propsClassDataParams,
        // the type parameter declaration used by the Props class
        propsClassTypeParamsDeclaration: propsClassDataParamsDeclaration,
        // the type parameter names used by the Props class in the VComp class
        propsTypeParams: propsDataParam,
        propsTypeParamsAny: metadata['propsTypeParamsAny'] ?? '',
        propsClassName: propsClassName,
        propsComponentPropsAlternateName: propsComponentPropsAlternateName,
        propsMappedTypesClassName: propsMappedTypesClassName,
        propsReadonlyMappedTypesClassName: propsReadonlyMappedTypesClassName,
        globalPropsName: buildOptions.importMaps?.exportToAlias?.GlobalProps ?? 'GlobalProps',
        // NOTE - Templates only use vcomponentClassName directly for:
        //  * generating Class-based custom element method types, or
        //  * generating an alternate form of indexed access to Props types
        //    when the variable for the wrapper class returned by the
        //    registerCustomElement call is not explicitly typed,
        //    AND Props is defined by a non-exported type alias.
        // Therefore, we can assume (for type generation purposes) that vcomponentName
        // is either a VComponent class name or the name of the functional VComponent
        // wrapper class variable.
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
/**
 * Return the legacy component name for VComponents implemented
 * with a since version before the build specified JET version
 * to be used for type aliasing.
 * @param metadata
 * @param buildOptions
 * @param vcomponentName
 */
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
/**
 * Generate the string containing the types we want to export
 */
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
    // Outside of core JET, the only export we want to inject is the Element type itself
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
    // Loop over the VComponents whose custom element type declarations we will attempt to annotate
    for (const vcomp in componentToMetadata) {
        let metadata = componentToMetadata[vcomp];
        const custElem = metadata.name;
        if (custElem) {
            // Find the annotation targets
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
            // Add boilerplate hints to the original VComponent declaration and the custom element interface
            if (vcompDecl) {
                applyAnnotationComments(MetaTypes.MDContext.COMP, _PROP_NOT_APPLICABLE, vcompDecl, undefined, `This export corresponds to the ${vcompNames.name} Preact component. For the ${vcompNames.customElementName} custom element, import ${vcompNames.elementInterface} instead.`, vcompDeprecated);
            }
            applyAnnotationComments(MetaTypes.MDContext.COMP, _PROP_NOT_APPLICABLE, vcompElementInterfaceDecl, undefined, `This export corresponds to the ${vcompNames.customElementName} custom element. For the ${vcompNames.name} Preact component, import ${vcompNames.name} instead.`, vcompDeprecated);
            // Loop over Properties - annotate with JSDoc description, top-level deprecation metadata
            const properties = metadata.properties;
            if (properties) {
                for (const prop in properties) {
                    const description = properties[prop]['jsdoc']?.['description'];
                    const deprecated = properties[prop].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
                    if (description || deprecated) {
                        // Readonly writeback Property declarations appear as PropertySignature members
                        // of the VComponent Element interface; all other Property declarations appear
                        // as PropertySignature members of the VComponent SettableProperties interface.
                        // All on[Prop]Changed callback declarations appear as PropertySignature
                        // members of the VComponent IntrinsicProps interface.
                        const propDecl = properties[prop].readOnly
                            ? vcompElementInterfaceDecl
                            : vcompSettablePropsDecl;
                        applyAnnotationComments(MetaTypes.MDContext.PROP, prop, propDecl, vcompIntrinsicPropsDecl, description, deprecated);
                    }
                }
            }
            // Loop over Events - annotate with JSDoc description, top-level deprecation metadata
            const events = metadata.events;
            if (events) {
                for (const event in events) {
                    const description = events[event]['jsdoc']?.['description'];
                    const deprecated = events[event].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
                    if (description || deprecated) {
                        // All Event declarations appear as on[Event] callback PropertySignature
                        // members of the VComponent IntrinsicProps interface
                        applyAnnotationComments(MetaTypes.MDContext.EVENT, event, undefined, vcompIntrinsicPropsDecl, description, deprecated);
                    }
                }
            }
            // Loop over Methods - annotate with JSDoc description, top-level deprecation metadata
            const methods = metadata.methods;
            if (methods) {
                for (const method in methods) {
                    const description = methods[method]['jsdoc']?.['description'];
                    const deprecated = methods[method].status?.find((item) => (item.type == undefined || item.type === 'deprecated') && item.target == undefined);
                    if (description || deprecated) {
                        // All Method declarations appear as PropertySignature members
                        // of the VComponent Element interface
                        applyAnnotationComments(MetaTypes.MDContext.METHOD, method, vcompElementInterfaceDecl, undefined, description, deprecated);
                    }
                }
            }
            const templateSlots = metadata['templateSlotProps'];
            if (templateSlots) {
                for (const tSlot of templateSlots) {
                    if (tSlot.slotDeprecation) {
                        if (tSlot.slotRenderType) {
                            // Template slot render function signature type aliases appear as
                            // TypeAliasDeclarations within the VComponent Element namespace
                            applyAnnotationComments(MetaTypes.MDContext.SLOT, tSlot.slotRenderType, vcompElementNamespaceDecl, undefined, undefined, tSlot.slotDeprecation);
                        }
                        if (tSlot.slotContextType) {
                            // Default template slot context type aliases (if generated) appear
                            // as TypeAliasDeclarations with the VComponent Element namespace
                            applyAnnotationComments(MetaTypes.MDContext.SLOT, tSlot.slotContextType, vcompElementNamespaceDecl, undefined, undefined, tSlot.slotDeprecation);
                        }
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
    // Determine if the full annotation comment will be a leading
    // JSDoc comment block that ends with a new line, or minimal @deprecated
    // JSDoc markup that will appear inline
    const hasTrailingNewLine = description !== undefined ||
        deprecated?.value !== undefined ||
        deprecated?.description !== undefined;
    if (description) {
        // Format JSDoc description metadata as a comment block
        description = description.replace(_REGEX_LINE_BREAKS, '$1 * ');
        descriptionText = `*
 * ${description}
 `;
    }
    if (deprecated) {
        // Set up minimal @deprecated JSDoc markup
        deprecatedMin = `* @deprecated `;
        if (deprecated.since) {
            deprecatedMin += `since ${deprecated.since} `;
        }
        // Initialize the full @deprecated markup based upon the minimum,
        // and append additional information if available.
        if (hasTrailingNewLine && description == undefined) {
            // Need to set up comment block
            deprecatedFull = `*
 ${deprecatedMin} `;
        }
        else {
            // Either comment block already set up, or not needed
            deprecatedFull = deprecatedMin.substring(0);
        }
        if (deprecated.value || deprecated.description) {
            if (deprecated.since) {
                deprecatedFull += '- ';
            }
            if (deprecated.value) {
                // For suggested alternatives to deprecated Events, convert to
                // callback name for the annotation comment
                const altValues = mdContext & MetaTypes.MDContext.EVENT
                    ? deprecated.value.map((val) => `on${val}`).join(', ')
                    : deprecated.value.join(', ');
                deprecatedFull += `${deprecated.value.length == 1 ? 'Suggested alternative: ' : 'Suggested alternatives: '}${altValues}. `;
            }
            if (deprecated.description) {
                deprecatedFull += `${deprecated.description} `;
            }
        }
        // If the full @deprecated markup will be finishing up a leading
        // JSDoc comment block, then end with a new line
        if (hasTrailingNewLine) {
            deprecatedFull += `
 `;
        }
    }
    // Construct the full annotation comment, consisting of a JSDoc description
    // comment block and/or @deprecated JSDoc markup
    const fullComment = (descriptionText ?? '') + (deprecatedFull ?? '');
    // If an annotation is required for the VComponent as a whole,
    // then simply apply it to the specified InterfaceDeclaration
    if (mdContext & MetaTypes.MDContext.COMP && fullComment.length > 0) {
        ts.addSyntheticLeadingComment(mdDecl, ts.SyntaxKind.MultiLineCommentTrivia, fullComment, hasTrailingNewLine);
    }
    // If an annotation is required for a VComponent Property or Method,
    // then search the specified InterfaceDeclaration for the corresponding
    // PropertySignature member
    if (mdContext & (MetaTypes.MDContext.PROP | MetaTypes.MDContext.METHOD) &&
        fullComment.length > 0) {
        const mdPropSignature = mdDecl?.members.find((mbr) => ts.isPropertySignature(mbr) && ts.isIdentifier(mbr.name) && ts.idText(mbr.name) === mdProp);
        if (mdPropSignature) {
            ts.addSyntheticLeadingComment(mdPropSignature, ts.SyntaxKind.MultiLineCommentTrivia, fullComment, hasTrailingNewLine);
        }
    }
    // If a deprecation annotation is for a VComponent Property OR any annotation
    // is required for a VComponent Event, then search the specified InterfaceDeclaration
    // for the corresponding callback PropertySignature
    if ((mdContext & MetaTypes.MDContext.PROP && deprecatedMin) ||
        (mdContext & MetaTypes.MDContext.EVENT && fullComment.length > 0)) {
        const mdCallback = mdContext & MetaTypes.MDContext.PROP ? `on${mdProp}Changed` : `on${mdProp}`;
        const mdCallbackSignature = mdCallbackDecl?.members.find((mbr) => ts.isPropertySignature(mbr) &&
            ts.isIdentifier(mbr.name) &&
            ts.idText(mbr.name) === mdCallback);
        if (mdCallbackSignature) {
            if (mdContext & MetaTypes.MDContext.PROP) {
                // 'on[Prop]Changed' callbacks only get minimal inline @deprecated markup
                ts.addSyntheticLeadingComment(mdCallbackSignature, ts.SyntaxKind.MultiLineCommentTrivia, deprecatedMin, false);
            }
            else {
                // 'on[Event]' callbacks get the full annotation comment
                ts.addSyntheticLeadingComment(mdCallbackSignature, ts.SyntaxKind.MultiLineCommentTrivia, fullComment, hasTrailingNewLine);
            }
        }
    }
    // If an annotation is required for a VComponent Slot, then search
    // the specified ModuleDeclaration's ModuleBlock for the corresponding
    // TypeAliasDeclaration
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
/**
 * Utility class that encapsulates the rules and static literals for VComponent names
 * requried for generating VComponent type definitions.
 */
class VCompNames {
    constructor(vcompName, tagName) {
        // NOTE:
        // For Function-based VComponents, if there is no exported Variable for
        // the value returned by registerCustomElement AND if the Preact functional
        // component implementation is an anonymous function, then the vcompName
        // ends up being equal to the stick-case tagName.
        // Since the vcompName is the root of the IntrinsicProps interface name
        // and stick-case is illegal in interface names, this is the one use case
        // where we overide the supplied vcompName.
        if (vcompName === tagName) {
            vcompName = (0, Utils_1.stickCaseToTitleCase)(tagName);
        }
        this._vcompName = vcompName;
        this._tagName = tagName;
    }
    // Accessors
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
/**
 * Returns true if the ts.Statement is the declaration for the specified VComponent.
 */
function isVCompDeclStatement(statement, vcompName) {
    let isFound = false;
    // Class-based instance?
    if (ts.isClassDeclaration(statement) && statement.name?.getText() === vcompName) {
        isFound = true;
    }
    // Function-based instance?
    else if (ts.isVariableStatement(statement)) {
        const varDecl = statement.declarationList.declarations[0];
        if (ts.isIdentifier(varDecl.name) && ts.idText(varDecl.name) === vcompName) {
            isFound = true;
        }
    }
    return isFound;
}
/**
 * Makes sure that the ts.createStringLiteral calls are using the second argument (boolean) telling TS to
 * use single quotes when writing out the string literal.
 */
function fixStringLiteralCalls(text) {
    const regex = /(?<=createStringLiteral\()(\s*\'[\w\/.-]+\'\s*)(?=\))/gm;
    const matches = text.match(regex);
    if (matches) {
        text = text.replace(regex, `$1, true`);
    }
    return text;
}
/**
 * TS 4.5.x and above includes a breaking change(!) to both createImportSpecifier and createExportSpecifier,
 * whereby a boolean isTypeOnly argument was added to the beginning of the call.  Yeesh...
 * Therefore, check the TS major/minor versions and, if appropropriate, add the missing arg.
 */
function fixCreateImportExportSpecifierCalls(text) {
    const regex = /(?:(create(Import|Export)Specifier\())/gm;
    const matches = text.match(regex);
    if (matches) {
        text = text.replace(regex, `$1false, `);
    }
    return text;
}
//# sourceMappingURL=dtsTransformer.js.map