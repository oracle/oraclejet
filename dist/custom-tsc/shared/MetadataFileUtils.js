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
exports.ensureAbsolutePath = ensureAbsolutePath;
exports.findApidocRootDir = findApidocRootDir;
exports.getParentDirPath = getParentDirPath;
exports.getComponentJSONObj = getComponentJSONObj;
exports.getInstalledDependenciesMap = getInstalledDependenciesMap;
exports.getAllMonoPacks = getAllMonoPacks;
exports.writeJETContentMetadata = writeJETContentMetadata;
const ts = __importStar(require("typescript"));
const fse = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const JETComp_1 = require("./JETComp");
const JETContent_1 = require("./JETContent");
const COMPONENT_JSON = 'component.json';
const OJETCONFIG_JSON = 'oraclejetconfig.json';
const SHARED_CONTENT_DIRNAME = '__apidoc__';
//
// Public utilities
//
/**
 * Returns a TypeScript file path (i.e., in posix format) that is guaranteed
 * to be an absolute path
 */
function ensureAbsolutePath(relPath) {
    const absPath = path.resolve(relPath);
    // NOTE - The 'resolve' method did the heavy lifting of resolving
    // its argument to an absolute path BUT if executed on the Windows
    // platform it also:
    //    * added a Windows-specific drive letter at the root (e.g., 'C:\')
    //    * converted the path separators to backslashes
    const rootLen = path.parse(absPath).root.length - 1;
    const absPosixPath = rootLen == 0 // no drive letter at root?
        ? absPath // then good to go...
        : _NATIVE_TO_POSIX(absPath.substring(rootLen)); // ...otherwise apply fixups
    return absPosixPath;
}
/**
 * Finds the well-known '__apidoc__' directory containing shareable jsdoc comment blocks, starting
 * from the project's current directory, rootDirs or rootDir values
 * @param compilerOptions
 * @returns the absolute path to the '__apidoc__' directory
 */
function findApidocRootDir(compilerOptions) {
    const rootDirsAbs = _getLookupAbsPathsFromCompilerOptions(compilerOptions);
    for (const root of rootDirsAbs) {
        const found = _findDirRecursive(root, SHARED_CONTENT_DIRNAME);
        if (found) {
            return found;
        }
    }
    return undefined;
}
/**
 * Given a TypeScript filename, return the TypeScript path to its parent directory
 * or null if the file is at the root (no parent directory)
 */
function getParentDirPath(tsFileName) {
    let rtnParentDirPath = null;
    const pathSegments = tsFileName.split('/');
    if (pathSegments.length > 2) {
        rtnParentDirPath = pathSegments.slice(0, pathSegments.length - 2).join('/');
    }
    return rtnParentDirPath;
}
/**
 * Given a TypeScript directory path, determine if a component.json file exists - if so,
 * read the file and parse it to return the resulting object.
 */
// TODO Convert return type to Metadata.ComponentMetadata once 'mono-pack' is fully supported
function getComponentJSONObj(dirPath) {
    return _getJSONObj(`${dirPath}/${COMPONENT_JSON}`);
}
/**
 * Given a JET ts.Program, return a map of installed dependency Packs.
 */
function getInstalledDependenciesMap(program) {
    const rtnInstalledDependenciesMap = new Map();
    const installedDependenciesDir = _getInstalledDependenciesDirPath(program);
    if (installedDependenciesDir) {
        const dependencies = ts.sys.getDirectories(installedDependenciesDir);
        for (const depName of dependencies) {
            const jsonObj = getComponentJSONObj(`${installedDependenciesDir}/${depName}`);
            if (jsonObj) {
                const depPack = new JETComp_1.JETComp(jsonObj);
                if (depPack.isJETPack() || depPack.isReferenceComponent()) {
                    rtnInstalledDependenciesMap.set(depName, depPack);
                }
            }
        }
    }
    return rtnInstalledDependenciesMap;
}
/**
 * Given the CompilerOptions in effect for this Program's transpilation,
 * return a mappping of JET mono-packs to be transpiled.
 */
function getAllMonoPacks(compilerOptions) {
    const rtnMonoPacks = {};
    const lookupAbsPaths = _getLookupAbsPathsFromCompilerOptions(compilerOptions);
    // FIRST USE CASE:
    // Look for an oraclejetconfig.json file, indicating that transpilation is occurring
    // within a JET CLI Project.
    const ojetConfig = _lookupJSONObj(lookupAbsPaths, OJETCONFIG_JSON);
    if (ojetConfig) {
        // If 'oraclejetconfig.json' is found, use it to get information about the
        // (mono-pack) 'components' directory:
        //
        //    * we need the source 'components' directory to find and load the mono-pack
        //      instances to add to our map
        //    * BUT we also need the staged 'components' directory path information for our map,
        //      since ts.SourceFiles will have been staged prior to transpilation, plus
        //      the staged directory path for the mono-pack (and its contents) MAY include
        //      the version
        //
        // NOTE:  Most 'paths' metadata in oraclejetconfig.json are simple folder names,
        //        with the exception of the staging directory for the build.
        //        Since that can be a (platform-specific) path, we need to ensure that it
        //        is converted to posix format!
        const isVersioned = ojetConfig.jsonObj?.unversioned ? false : true;
        const relSrcDir = ojetConfig.jsonObj.paths?.source?.common;
        const relComponentsDir = ojetConfig.jsonObj.paths?.source?.components;
        const relStagingDir = ojetConfig.jsonObj.paths?.staging?.web;
        if (relSrcDir && relComponentsDir && relStagingDir) {
            const srcComponentsDir = `${ojetConfig.absPath}/${relSrcDir}/${relComponentsDir}`;
            const relStagedComponentsDir = `${_NATIVE_TO_POSIX(relStagingDir)}/${relComponentsDir}`;
            // Search the list of sub-directories in the source 'components' directory,
            // looking for a component.json file identifying a mono-pack
            const componentDirs = ts.sys.getDirectories(srcComponentsDir);
            for (const compDir of componentDirs) {
                const compDirPath = `${srcComponentsDir}/${compDir}`;
                const compJsonObj = getComponentJSONObj(compDirPath);
                if (compJsonObj) {
                    const packComp = new JETComp_1.JETComp(compJsonObj);
                    if (packComp.isMonoPack()) {
                        // If we find a mono-pack, register it under its
                        // staged 'components' path (possibly versioned!)
                        const stagedMonoPackPath = `${relStagedComponentsDir}/${compDir}${isVersioned ? `/${packComp.version}` : ''}`;
                        rtnMonoPacks[stagedMonoPackPath] = {
                            absPath: `${ojetConfig.absPath}/${stagedMonoPackPath}`,
                            monoPack: packComp
                        };
                    }
                }
            }
        }
    }
    // SECOND USE CASE:
    // If we are operating outside of an OJET CLI Project, then we assume that:
    //
    //    * the Program only contains a SINGLE JET mono-pack
    //    * no special staging occurs (i.e., transpiled in place)
    else {
        // will only return a component.json instance whose type === 'mono-pack'
        const monoPackLookup = _lookupJSONObj(lookupAbsPaths, COMPONENT_JSON, 'mono-pack');
        if (monoPackLookup) {
            const monoPackComp = new JETComp_1.JETComp(monoPackLookup.jsonObj);
            const stagedMonoPackPath = path.relative(path.resolve(compilerOptions.outDir ?? '.'), monoPackLookup.absPath);
            rtnMonoPacks[stagedMonoPackPath] = {
                absPath: monoPackLookup.absPath,
                monoPack: monoPackComp
            };
        }
    }
    return rtnMonoPacks;
}
function writeJETContentMetadata(outDir, packPath, content) {
    if ((0, JETContent_1.isVdomContent)(content) || (0, JETContent_1.isHookContent)(content) || (0, JETContent_1.isUtilContent)(content)) {
        // Build the path to where we want to write out this content metadata
        // and ensure the directory exists
        // NOTE:  For fs-extra, ensure we're using the native platform path format!
        const contentMDDir = _POSIX_TO_NATIVE(`${outDir}/${packPath}/metadata/${content.main}/${content.export ?? content.name}`);
        fse.ensureDirSync(contentMDDir);
        fse.writeFileSync(path.join(contentMDDir, COMPONENT_JSON), JSON.stringify(content, null, 2));
    }
}
//
// Private functions
//
/**
 * Given a TypeScript JSON file name, determine if the JSON file exists - if so,
 * read the file and parse it to return the resulting object.
 */
function _getJSONObj(jsonFileName) {
    let rtnJSONObj;
    if (ts.sys.fileExists(jsonFileName)) {
        const JSONstr = ts.sys.readFile(jsonFileName, 'utf-8');
        try {
            rtnJSONObj = JSON.parse(JSONstr);
        }
        catch (err) {
            console.log(`Invalid JSON read from file ${jsonFileName}`);
        }
    }
    return rtnJSONObj;
}
/**
 * Given the CompilerOptions in effect for this Program's transpilation,
 * return an array of absolute root directory paths in which to look for
 * critical metadata file(s).
 *
 * NOTE:  TypeScript normalizes all filepaths to posix path format!
 */
function _getLookupAbsPathsFromCompilerOptions(compilerOptions) {
    // Initialize an array of relative paths to the specified rootDir(s)
    const lookupRelPaths = compilerOptions.rootDirs ?? (compilerOptions.rootDir ? [compilerOptions.rootDir] : []);
    // Transform the relative rootDir(s) into absolute paths
    const lookupAbsPaths = lookupRelPaths.map((dir) => path.posix.resolve(dir));
    // Push the absolute path of the current working directory onto the array, and return it
    lookupAbsPaths.push(path.posix.resolve());
    return lookupAbsPaths;
}
/**
 * Given an array of lookup directories, search for a JSON file with the specified name
 * and, if found, parse it and return the JSON object along with the lookup directory
 * in which it was found.
 * If an optional 'type' string value is provided, also check if the JSON object's
 * 'type' property is a match (useful for component.json files, where we might be looking
 * for a particular component type, like a 'mono-pack' or a 'resource' component)
 * - otherwise, keep searching!
 */
function _lookupJSONObj(lookupAbsPaths, filename, type) {
    let jsonObjInfo;
    for (const absPath of lookupAbsPaths) {
        const lookupFileName = `${absPath}/${filename}`;
        const jsonObj = _getJSONObj(lookupFileName);
        if (jsonObj && (type === undefined || jsonObj['type'] === type)) {
            jsonObjInfo = {
                absPath,
                jsonObj
            };
            break;
        }
    }
    return jsonObjInfo;
}
/**
 * Given a JET ts.Program, return the absolute path to the directory with component.json
 * files for any installed dependencies of the JET Project, or null if that directory
 * could not be found.
 */
function _getInstalledDependenciesDirPath(program) {
    let rtnInstalledDependenciesDirPath = null;
    // Look for the JET Project's oraclejetconfig.json file, if available.
    const lookupAbsPaths = _getLookupAbsPathsFromCompilerOptions(program.getCompilerOptions());
    const ojetConfig = _lookupJSONObj(lookupAbsPaths, OJETCONFIG_JSON);
    if (ojetConfig) {
        // If 'oraclejetconfig.json' is found, use it to get the relative path to
        // the exchangeComponents directory - convert the relative path to
        // an absolute path, verify that it's valid, and return it.
        const relExchangeComponentsDirPath = ojetConfig.jsonObj.paths?.source?.exchangeComponents;
        if (relExchangeComponentsDirPath) {
            rtnInstalledDependenciesDirPath = `${ojetConfig.absPath}/${relExchangeComponentsDirPath}`;
            if (!ts.sys.directoryExists(rtnInstalledDependenciesDirPath)) {
                rtnInstalledDependenciesDirPath = null;
            }
        }
    }
    return rtnInstalledDependenciesDirPath;
}
/**
 * Recursively searches for a directory with the given name under `startPath`.
 */
function _findDirRecursive(startPath, dirName) {
    const entries = fse.readdirSync(startPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.posix.join(startPath, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === dirName) {
                return fullPath;
            }
            const found = _findDirRecursive(fullPath, dirName);
            if (found)
                return found;
        }
    }
    return undefined;
}
/**
 * Given a native platform path, ensures that it is returned in posix format.
 * NOTE:  TypeScript APIs always return filenames in posix format!
 */
function _NATIVE_TO_POSIX(filepath) {
    if (path.sep === path.posix.sep)
        return filepath;
    else {
        return filepath.replace(/\\/g, '/');
    }
}
/**
 * Given a posix path, ensures that it is returned in the native platform format.
 */
function _POSIX_TO_NATIVE(filepath) {
    if (path.posix.sep === path.sep)
        return filepath;
    else {
        return filepath.replace(/\//g, '\\');
    }
}
//# sourceMappingURL=MetadataFileUtils.js.map