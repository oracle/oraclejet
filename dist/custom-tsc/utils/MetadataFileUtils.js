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
exports.getComponentJSONObj = exports.getParentDirPath = void 0;
const ts = __importStar(require("typescript"));
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
    let rtnComponentJSONObj;
    const jsonFilePath = `${dirPath}/component.json`;
    if (ts.sys.fileExists(jsonFilePath)) {
        const componentJSON = ts.sys.readFile(jsonFilePath, 'utf-8');
        try {
            rtnComponentJSONObj = JSON.parse(componentJSON);
        }
        catch (err) {
            console.log(`Invalid JSON read from file ${jsonFilePath}`);
        }
    }
    return rtnComponentJSONObj;
}
exports.getComponentJSONObj = getComponentJSONObj;
//# sourceMappingURL=MetadataFileUtils.js.map