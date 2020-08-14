"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const template_1 = require("./template");
const glob = require("glob");
const _REGEX_LINE_ENDING = new RegExp(/(\r\n|\r)/mg);
const _REGEX_BLANK_LINES = new RegExp(/^(?:[\t ]*(?:\r?\n|\r))+/mg);
const _REGEX_EMPTY_EXPORT = new RegExp(/export {};/gi);
function getTypeGenerator(buildOptions) {
    const templatePath = buildOptions.templatePath;
    const view = new template_1.Template(templatePath);
    return (fileName, content) => {
        const dirname = path.dirname(fileName);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }
        if (fileName.endsWith("d.ts") && buildOptions.componentToMetadata) {
            content = content.replace(_REGEX_EMPTY_EXPORT, "");
            content = content.replace(_REGEX_BLANK_LINES, "");
            const vcomponents = buildOptions.componentToMetadata;
            if (containsCustomElements(vcomponents)) {
                content =
                    "import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';\n" +
                        "import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';\n" +
                        content;
                for (let vcomponentName in vcomponents) {
                    let metadata = vcomponents[vcomponentName];
                    const customElementName = metadata.name;
                    if (customElementName) {
                        const data = getComponentTemplateData(metadata, customElementName, vcomponentName);
                        const exports = getComponentExportsString(data.vcomponentName, data.vpropsClassName, data.propsClassName, data.componentPropertyInterface, data.legacyComponentName);
                        const baseFileName = path.basename(fileName, ".d.ts");
                        const exportContent = `\nexport { ${exports} } from './${baseFileName}';\n`;
                        const exportsFile = path.join(path.dirname(fileName), `exports_${customElementName}.d.ts`);
                        try {
                            let generatedContent = view.render("container.tmpl", data);
                            generatedContent = generatedContent.replace(_REGEX_BLANK_LINES, "");
                            content = content.replace(_REGEX_BLANK_LINES, "");
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
        content = content.replace(_REGEX_LINE_ENDING, "\n");
        fs.writeFileSync(fileName, content);
    };
}
exports.getTypeGenerator = getTypeGenerator;
function assembleTypes(buildOptions) {
    var _a;
    const EXCLUDED_MODULES = ((_a = buildOptions.coreJetBuildOptions) === null || _a === void 0 ? void 0 : _a.exclude) || [];
    function processImportedDependencies(typeDeclarName, seen) {
        const typeDeclarCont = fs.readFileSync(typeDeclarName, "utf-8");
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
    const regexImport = new RegExp(/^\s*import\s+.*["'][\w\/_\.\-!]+["'];?$/mg);
    const regexExportDep = new RegExp(/^\s*(export\s).+(\s+from\s+)['"](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/mg);
    const regexImportDep = new RegExp(/^\s*(import\s).+(\s+from\s+)['"](?<localdep>[\.]{1,2}[\/][\w_-]+)['"];?$/mg);
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
        const sourceFileContent = fs.readFileSync(entryFile, "utf-8");
        let newIndexFileContent = sourceFileContent.replace(regexImport, "").trim();
        moduleTypeDependencies[moduleName] = new Set();
        let matches;
        while ((matches = regexExportDep.exec(sourceFileContent)) !== null) {
            const exportTypeFile = matches.groups.localdep;
            const typeDeclarFile = path.join(moduleDir, `${exportTypeFile}.d.ts`);
            if (!moduleTypeDependencies[moduleName].has(`${path.basename(typeDeclarFile)}`)) {
                moduleTypeDependencies[moduleName].add(`${path.basename(typeDeclarFile)}`);
                processImportedDependencies(typeDeclarFile, moduleTypeDependencies[moduleName]);
            }
        }
        exports_files.forEach((expfile) => {
            const expFileContent = fs.readFileSync(expfile, "utf-8");
            newIndexFileContent += "\n";
            newIndexFileContent += expFileContent;
        });
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
        fs.writeFileSync(destFilePath, newIndexFileContent, { encoding: "utf-8" });
        moduleTypeDependencies[moduleName].forEach((dtsFile) => {
            if (buildOptions.debug) {
                console.log(`copy file ${path.join(moduleDir, dtsFile)} to ${path.join(destDir, dtsFile)}`);
            }
            fs.copyFileSync(path.join(moduleDir, dtsFile), path.join(destDir, dtsFile));
        });
    });
}
exports.assembleTypes = assembleTypes;
function getComponentTemplateData(metadata, customElementName, vcomponentName) {
    var _a, _b;
    const legacyComponentName = metadata["ojLegacyVComponent"];
    const vcomponentElementName = `${vcomponentName}Element`;
    const propsDataParam = (_a = metadata["propsTypeParams"]) !== null && _a !== void 0 ? _a : "";
    const data = {
        propsTypeParams: propsDataParam,
        propsTypeParamsAny: (_b = metadata["propsTypeParamsAny"]) !== null && _b !== void 0 ? _b : "",
        propsClassName: metadata["propsClassName"],
        vpropsClassName: metadata["vpropsClassName"],
        componentPropertyInterface: `${vcomponentName}Properties`,
        customElementName: customElementName,
        vcomponentClassName: vcomponentName,
        vcomponentName: vcomponentElementName,
        vcomponentNameWithGenerics: `${vcomponentElementName}${propsDataParam}`,
        eventMapInterface: `${vcomponentElementName}EventMap${propsDataParam}`,
        settablePropertiesInterface: `${vcomponentElementName}SettableProperties${propsDataParam}`,
        settablePropertiesLenientInterface: `${vcomponentElementName}SettablePropertiesLenient${propsDataParam}`,
        properties: metadata.properties,
        events: metadata.events,
    };
    if (legacyComponentName) {
        data.legacyComponentName = legacyComponentName;
        data.legacyComponentNameWithGenerics = `${legacyComponentName}${propsDataParam}`;
        data.legacyEventMapInterface = `${legacyComponentName}EventMap${propsDataParam}`;
        data.legacySettablePropertiesInterface = `${legacyComponentName}SettableProperties${propsDataParam}`;
        data.legacySettablePropertiesLenientInterface = `${legacyComponentName}SettablePropertiesLenient${propsDataParam}`;
    }
    return data;
}
function getComponentExportsString(vcomponentElementName, vpropsClassName, propsClassName, componentPropertyInterface, legacyComponentName) {
    const exports = [
        `${vcomponentElementName}EventMap`,
        `${vcomponentElementName}SettableProperties`,
        `${vcomponentElementName}SettablePropertiesLenient`,
        vcomponentElementName,
        vpropsClassName,
    ];
    if (propsClassName) {
        exports.push(componentPropertyInterface);
    }
    if (legacyComponentName) {
        exports.push(`${legacyComponentName}EventMap`);
        exports.push(`${legacyComponentName}SettableProperties`);
        exports.push(`${legacyComponentName}SettablePropertiesLenient`);
        exports.push(`${legacyComponentName}`);
    }
    return exports.join(", ");
}
function containsCustomElements(vcomponents) {
    let containsCustomElement = false;
    for (let vcomponentName in vcomponents) {
        let metadata = vcomponents[vcomponentName];
        containsCustomElement = containsCustomElement || metadata.name != null;
    }
    return containsCustomElement;
}
