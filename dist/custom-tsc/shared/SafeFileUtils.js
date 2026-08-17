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
exports.validateFileNameSegment = validateFileNameSegment;
exports.getSafeJsonFilePath = getSafeJsonFilePath;
exports.getContainedPath = getContainedPath;
const path = __importStar(require("path"));
const UNSAFE_FILE_NAME_CHARS = /[<>:"/\\|?*\u0000-\u001f]/;
/**
 * Validates that a value is safe to use as a single filename segment.
 *
 * @param value The value to validate.
 * @param description A human-readable description used in the error message.
 * @returns The original value when it is safe to use as a filename segment.
 * @throws Error if the value is empty, trimmed, a path traversal segment, or contains path separators or unsafe filename characters.
 */
function validateFileNameSegment(value, description) {
    if (typeof value !== 'string' ||
        value.length === 0 ||
        value !== value.trim() ||
        value === '.' ||
        value === '..' ||
        UNSAFE_FILE_NAME_CHARS.test(value) ||
        path.posix.basename(value) !== value ||
        path.win32.basename(value) !== value) {
        throw new Error(`Invalid ${description} "${value}". Value must be a single file name segment.`);
    }
    return value;
}
/**
 * Builds a JSON file path under the specified output directory using a validated filename base.
 *
 * @param outputDir The directory where the JSON file should be written.
 * @param fileNameBase The filename without the `.json` extension.
 * @param description A human-readable description used in validation errors.
 * @returns The path to the JSON file.
 * @throws Error if the filename base is not a safe single filename segment.
 */
function getSafeJsonFilePath(outputDir, fileNameBase, description) {
    return path.join(outputDir, `${validateFileNameSegment(fileNameBase, description)}.json`);
}
/**
 * Resolves path segments under a base directory and verifies the result stays contained within that directory.
 *
 * @param baseDir The directory that must contain the resolved path.
 * @param pathSegments Additional path segments to resolve under the base directory.
 * @returns The resolved contained path.
 * @throws Error if the resolved path escapes the base directory.
 */
function getContainedPath(baseDir, ...pathSegments) {
    const resolvedBaseDir = path.resolve(baseDir);
    const resolvedPath = path.resolve(resolvedBaseDir, ...pathSegments);
    if (resolvedPath !== resolvedBaseDir &&
        !resolvedPath.startsWith(`${resolvedBaseDir}${path.sep}`)) {
        throw new Error(`Resolved path escapes the expected output directory: ${resolvedPath}`);
    }
    return resolvedPath;
}
//# sourceMappingURL=SafeFileUtils.js.map