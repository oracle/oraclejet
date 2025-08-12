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
exports.sharedDocs = void 0;
exports.extractSharedComments = extractSharedComments;
const ts = __importStar(require("typescript"));
const path_1 = __importDefault(require("path"));
const sharedDocs = {};
exports.sharedDocs = sharedDocs;
/**
 * Transformer that scans *_doc.ts files inside a well-known __apidoc__ directory and detects regions.
 * A region is a jsdoc comment block delimited with a #region <>name/#endregion <name> comment line.
 * @returns a Map of an absolute file and the regions defined in that file name
 */
function extractSharedComments() {
    return (context) => {
        return (sourceFile) => {
            const fileName = sourceFile.fileName;
            const absoluteFileName = path_1.default.resolve(fileName);
            if (!(absoluteFileName.includes('__apidoc__') && absoluteFileName.endsWith('_doc.ts')))
                return sourceFile;
            let text = sourceFile.getFullText();
            const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard);
            scanner.setText(text);
            let currentRegion = null;
            let insideRegion = false;
            while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
                const tokenKind = scanner.getToken();
                const tokenText = scanner.getTokenText();
                const comment = tokenText.trim();
                if (tokenKind === ts.SyntaxKind.SingleLineCommentTrivia) {
                    const startMatch = comment.match(/^\/\/\s*#region\s+([a-zA-Z0-9_-]+)\s*/);
                    if (startMatch) {
                        currentRegion = startMatch[1];
                        insideRegion = true;
                        continue;
                    }
                    const endMatch = comment.match(/^\/\/\s*#endregion\s+([a-zA-Z0-9_-]+)\s*/);
                    if (endMatch && currentRegion === endMatch[1]) {
                        currentRegion = null;
                        insideRegion = false;
                        continue;
                    }
                }
                // Look for /** ... */ comments only within a region
                if (insideRegion && tokenKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                    const commentText = scanner.getTokenText().trim();
                    if (commentText.startsWith('/**')) {
                        // initialize the entry
                        if (!sharedDocs[absoluteFileName])
                            sharedDocs[absoluteFileName] = {};
                        // make sure we are only storing one comment block per region
                        if (!sharedDocs[absoluteFileName][currentRegion]) {
                            sharedDocs[absoluteFileName][currentRegion] = cleanJSDoc(commentText);
                        }
                        else {
                            console.warn(`Duplicate JSDoc block found in region "${currentRegion}" of ${absoluteFileName}. Ignoring.`);
                        }
                    }
                }
            }
            return sourceFile;
        };
    };
}
function cleanJSDoc(jsdoc) {
    return jsdoc
        .replace(/^\/\*\*/, '') // remove opening /** (start of doc block)
        .replace(/\*\/$/, '') // remove closing */
        .split('\n') // break into lines
        .map((line) => line.trim()) // trim spaces
        .map((line) => line.replace(/^\*\s?/, '')) // remove leading "* " or "*"
        .join('\n') // rejoin into one string
        .trim(); // trim final result
}
//# sourceMappingURL=sharedCommentScanner.js.map