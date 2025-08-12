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
exports.generateApiDocMetadata = generateApiDocMetadata;
exports.generateApiDoc = generateApiDoc;
const fs = __importStar(require("fs"));
const TransformerError_1 = require("./TransformerError");
const ApiDocUtils_1 = require("./ApiDocUtils");
const INCLUDE_TOKEN = '@include';
function generateApiDocMetadata(metaUtilObj, options) {
    if (options.apiDocDir && options.apiDocBuildEnabled) {
        try {
            console.log(`building API Doc metadata for module ${metaUtilObj.componentName}...`);
            const apidoc = (0, ApiDocUtils_1.generateDoclets)(metaUtilObj);
            if (apidoc && Array.isArray(apidoc)) {
                metaUtilObj.apidoc = apidoc;
            }
        }
        catch (e) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNEXPECTED_APIDOC_EXCEPTION, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, 'Unexpected error happened during ApiDoc metadata processing.');
        }
    }
}
/**
 * Updates the generated jsdoc metadata (if needed) with shared comment blocks and then writes out the final content into
 * <ComponentName>.json files
 * @param options An ApiDocOptions property bag containing settings about where to write out apidoc collateral.
 * @param sharedContentDir The absolute path of a directory where shared content was defined
 */
function generateApiDoc(options, sharedContentDir) {
    const allDoclets = options.componentToApiDoc;
    if (options.apiDocDir && options.apiDocBuildEnabled && allDoclets) {
        for (const componentName of Object.keys(allDoclets)) {
            try {
                console.log(`building API Doc metadata for module ${componentName}...`);
                const apidoc = allDoclets[componentName];
                if (sharedContentDir) {
                    apidoc.forEach((doclet) => {
                        if (doclet.kind === 'class' || doclet.kind === 'namespace') {
                            if (doclet.classdesc?.indexOf(INCLUDE_TOKEN) > -1) {
                                doclet.classdesc = (0, ApiDocUtils_1.injectSharedContent)(doclet.classdesc, options.sharedContent, sharedContentDir);
                            }
                        }
                        else {
                            if (doclet.description?.indexOf(INCLUDE_TOKEN) > -1) {
                                doclet.description = (0, ApiDocUtils_1.injectSharedContent)(doclet.description, options.sharedContent, sharedContentDir);
                            }
                            //if the type associated with the Typedef is a module export, mark it so
                            // we will render differently in the API Doc
                            if (doclet.kind == 'typedef' && (0, ApiDocUtils_1.isExportedType)(doclet, options)) {
                                doclet.ojexports = true;
                            }
                        }
                    });
                }
                writeApiDocFiles(apidoc, componentName, options.apiDocDir);
            }
            catch (e) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNEXPECTED_APIDOC_EXCEPTION, TransformerError_1.ExceptionType.LOG_WARNING, componentName, 'Unexpected error happened during ApiDoc metadata processing.');
            }
        }
    }
}
/**
 * Writes out the <ComponentName>.json jsdoc-style doclet file.
 * @param apidocResult The jsdoc-style metadata gathered for a given component
 * @param componentName
 * @param apiDocDir the output directory where the doclet json file will be written put.
 */
function writeApiDocFiles(apidocResult, componentName, apiDocDir) {
    if (!fs.existsSync(apiDocDir)) {
        fs.mkdirSync(apiDocDir, { recursive: true });
    }
    const apiDocForComponent = `${apiDocDir}/${componentName}.json`;
    fs.writeFileSync(apiDocForComponent, JSON.stringify(apidocResult, null, 2));
}
//# sourceMappingURL=ApiDocFileUtils.js.map