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
exports.getInstalledDependenciesPackMap = exports.getComponentJSONObj = exports.getParentDirPath = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const path = __importStar(require("path"));
function getParentDirPath(tsFileName) {
    let rtnParentDirPath = null;
    const pathSegments = tsFileName.split('/');
    if (pathSegments.length > 2) {
        rtnParentDirPath = pathSegments.slice(0, pathSegments.length - 2).join('/');
    }
    return rtnParentDirPath;
}
exports.getParentDirPath = getParentDirPath;
function getComponentJSONObj(dirPath) {
    return _getJSONObj(`${dirPath}/component.json`);
}
exports.getComponentJSONObj = getComponentJSONObj;
function getInstalledDependenciesPackMap(program) {
    const rtnInstalledDependenciesMap = new Map();
    const installedDependenciesDir = _getInstalledDependenciesDirPath(program);
    if (installedDependenciesDir) {
        const dependencies = ts.sys.getDirectories(installedDependenciesDir);
        for (const depName of dependencies) {
            const jsonObj = getComponentJSONObj(`${installedDependenciesDir}/${depName}`);
            if (jsonObj) {
                const depPack = new MetaTypes.VCompPack(jsonObj);
                if (depPack.isJETPack() || depPack.isReferenceComponent()) {
                    rtnInstalledDependenciesMap.set(depName, depPack);
                }
            }
        }
    }
    return rtnInstalledDependenciesMap;
}
exports.getInstalledDependenciesPackMap = getInstalledDependenciesPackMap;
function _getJSONObj(jsonFileName) {
    let rtnJSONObj;
    if (ts.sys.fileExists(jsonFileName)) {
        const componentJSON = ts.sys.readFile(jsonFileName, 'utf-8');
        try {
            rtnJSONObj = JSON.parse(componentJSON);
        }
        catch (err) {
            console.log(`Invalid JSON read from file ${jsonFileName}`);
        }
    }
    return rtnJSONObj;
}
function _getInstalledDependenciesDirPath(program) {
    let rtnInstalledDependenciesDirPath = null;
    const relLookupDirs = program.getCompilerOptions().rootDirs ?? program.getCompilerOptions().rootDir
        ? [program.getCompilerOptions().rootDir]
        : [];
    const lookupDirs = relLookupDirs.map((dir) => path.posix.resolve(dir));
    lookupDirs.push(path.posix.resolve());
    for (const dir of lookupDirs) {
        const ojetConfigFileName = `${dir}/oraclejetconfig.json`;
        const ojetConfig = _getJSONObj(ojetConfigFileName);
        if (ojetConfig) {
            const relExchangeComponentsDirPath = ojetConfig.paths?.source?.exchangeComponents;
            if (relExchangeComponentsDirPath) {
                rtnInstalledDependenciesDirPath = `${dir}/${relExchangeComponentsDirPath}`;
                if (!ts.sys.directoryExists(rtnInstalledDependenciesDirPath)) {
                    rtnInstalledDependenciesDirPath = null;
                }
            }
            break;
        }
    }
    return rtnInstalledDependenciesDirPath;
}
//# sourceMappingURL=MetadataFileUtils.js.map