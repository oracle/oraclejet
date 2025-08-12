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
exports.default = compile;
const ts = __importStar(require("typescript"));
const metadataTransformer_1 = __importDefault(require("./metadataTransformer"));
const decoratorTransformer_1 = __importDefault(require("./decoratorTransformer"));
const importTransformer_1 = __importDefault(require("./importTransformer"));
const utilityTransformer_1 = __importDefault(require("./utilityTransformer"));
const dtsTransformer_1 = __importDefault(require("./dtsTransformer"));
const vdomTransformer_1 = __importDefault(require("./vdomTransformer"));
const dtsTransformer_2 = require("./dtsTransformer");
const PrettyMsgEncoder_1 = require("./utils/PrettyMsgEncoder");
const TransformerError_1 = require("./utils/TransformerError");
const ApiDocFileUtils_1 = require("./utils/ApiDocFileUtils");
const MetadataFileUtils_1 = require("./shared/MetadataFileUtils");
const sharedCommentScanner_1 = require("./sharedCommentScanner");
const exportTransformer_1 = __importDefault(require("./exportTransformer"));
const __SUPPORTED_TS_VERSION = '5.8.3';
const [__SUPPORTED_TS_MAJOR, __SUPPORTED_TS_MINOR] = __SUPPORTED_TS_VERSION
    .split('.', 2)
    .map((str) => Number.parseInt(str));
const __INCL_VDOM_TRANSFORMER_POC = '__INCL_VDOM_TRANSFORMER_POC';
function compile({ tsconfigJson, buildOptions }) {
    const parsedJsonConfig = ts.parseJsonConfigFileContent(tsconfigJson, ts.sys, '.');
    const parsedTsconfigJson = {
        compilerOptions: parsedJsonConfig.options,
        files: parsedJsonConfig.fileNames
    };
    const errors = [];
    let _isVDomTransformerConfigEnabled = false;
    // get the absolute path of the well-known '__apidoc__' directory that contains shareable jsdoc comment blocks
    const sharedContentDir = (0, MetadataFileUtils_1.findApidocRootDir)(parsedTsconfigJson.compilerOptions);
    // If TypeScript version detected at build time is earlier than our supported
    // version, return the error.
    const [bldTsMajor, bldTsMinor] = ts.version.split('.', 2).map((str) => Number.parseInt(str));
    if (bldTsMajor < __SUPPORTED_TS_MAJOR ||
        (bldTsMajor === __SUPPORTED_TS_MAJOR && bldTsMinor < __SUPPORTED_TS_MINOR)) {
        const error = new Error(`Unsupported TypeScript version detected: ${ts.version}
Upgrade your JET project to TypeScript version ${__SUPPORTED_TS_VERSION}
`);
        errors.push(error);
        return { errors, parsedTsconfigJson };
    }
    const _buildOptions = { ...buildOptions };
    // default followImports setting (used by API Doc utilities) to true
    if (_buildOptions.followImports == undefined) {
        _buildOptions.followImports = true;
    }
    if (_buildOptions.debug == undefined) {
        _buildOptions.debug = false;
    }
    // setting default value for this option
    if (_buildOptions.apiDocBuildEnabled == undefined) {
        _buildOptions.apiDocBuildEnabled = true;
    }
    _buildOptions.parentDirToPackInfo = {};
    // If undocumented '_JET_disabledExceptionKeys' field detected in raw
    // compilerOptions, transfer to buildOptions for uptake by the
    // custom-tsc transformers.
    if (parsedJsonConfig?.raw?.compilerOptions?.['_JET_disabledExceptionKeys']) {
        _buildOptions.disabledExceptionKeys = [
            ...parsedJsonConfig.raw.compilerOptions['_JET_disabledExceptionKeys']
        ];
    }
    // If undocumented '_JET_UNSAFE_TRANSFORMER_CONFIG' field detected in raw
    // compilerOptions, check whether we should be configuring the
    // vdomTransformer POC
    if (parsedJsonConfig?.raw?.compilerOptions?.['_JET_UNSAFE_TRANSFORMER_CONFIG']) {
        _isVDomTransformerConfigEnabled =
            parsedJsonConfig.raw.compilerOptions['_JET_UNSAFE_TRANSFORMER_CONFIG'] ===
                __INCL_VDOM_TRANSFORMER_POC;
    }
    const compilerHost = ts.createCompilerHost(parsedTsconfigJson.compilerOptions);
    const program = ts.createProgram(parsedTsconfigJson.files, parsedTsconfigJson.compilerOptions, compilerHost);
    let emitResult;
    // Any error in the transformer is a RT error as far as the compiler is concerned.
    // 1. If it is a syntax error in the ts/tsx file (like let messageTime?: string = 1), these will be caught by the TS compiler
    // before any of the compiler after or before plug-ins are called, so the emit returns successfully and the diagnostic messages
    // will be collected after emit by calling the handleDiagnosticMessages function below
    // 2. If it is an application error (we passed the syntax checking and either the application throws an application Error or is a JS runtime error)
    // we capture that in the try/catch block.
    // We collect all diagnostic and error messages and return to the caller.
    // For testing error handling, we will call compiler with a build option called isolationMode set to true. In this case, we proceed
    // calling emit on a file-by-file basis so that we can capture all syntax and error messages.
    const EmitOptions = {
        before: [
            ...(_isVDomTransformerConfigEnabled ? [(0, vdomTransformer_1.default)(program)] : []),
            ...(!_buildOptions.isolationMode ? [(0, sharedCommentScanner_1.extractSharedComments)()] : []),
            ...(!_buildOptions.isolationMode ? [(0, exportTransformer_1.default)(program, _buildOptions)] : []),
            (0, metadataTransformer_1.default)(program, _buildOptions),
            (0, decoratorTransformer_1.default)(_buildOptions),
            (0, importTransformer_1.default)(_buildOptions),
            (0, utilityTransformer_1.default)(program, _buildOptions)
        ],
        afterDeclarations: [(0, dtsTransformer_1.default)(program, _buildOptions)]
    };
    if (_buildOptions.isolationMode) {
        program.getSourceFiles().forEach((sf) => {
            try {
                emitResult = program.emit(sf, undefined, undefined, undefined, EmitOptions);
            }
            catch (e) {
                errors.push(processEmitError(e));
                return; // go to next file
            }
        });
    }
    else {
        try {
            emitResult = program.emit(undefined, undefined, undefined, undefined, EmitOptions);
            if (_buildOptions.debug) {
                const results = _buildOptions.programExportMaps?.getAllModuleTypeExports();
                console.log(results);
            }
            // jsdoc-style doclet json file generation happens after emit so that we can gather all
            // sharable comment blocks (in the "before" phase, see the extractSharedComments transformer)
            // and apply where needed in the generateApiDoc call.
            _buildOptions.sharedContent = sharedCommentScanner_1.sharedDocs;
            (0, ApiDocFileUtils_1.generateApiDoc)(_buildOptions, sharedContentDir);
        }
        catch (e) {
            errors.push(processEmitError(e));
            return { errors, parsedTsconfigJson };
        }
    }
    handleDiagnosticMessages(program, emitResult, errors);
    // if compile ended with no errors, assemble the type declaration files
    if (errors.length == 0 && parsedTsconfigJson.compilerOptions.declaration) {
        (0, dtsTransformer_2.assembleTypes)(buildOptions);
    }
    return {
        errors,
        parsedTsconfigJson
    };
}
function handleDiagnosticMessages(program, emitResult, errors) {
    const diagnostics = [...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics];
    if (diagnostics.length) {
        const encoder = new PrettyMsgEncoder_1.PrettyMsgEncoder(program.getCompilerOptions().pretty);
        diagnostics.forEach((diagnostic) => {
            const errorMessage = parseDiagnostic(diagnostic, encoder);
            if (errors.indexOf(errorMessage) === -1) {
                errors.push(errorMessage);
            }
        });
    }
}
function parseDiagnostic(diagnostic, encoder) {
    let rtnString = '';
    if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        rtnString = `${encoder.encodeFileLineChar(diagnostic.file.fileName, line, character)} - `;
    }
    rtnString += `${encoder.ERROR}${diagnostic.code ? ` ${encoder.encode(PrettyMsgEncoder_1.PCC.ERRCODE, `TS${diagnostic.code}`)}` : ''}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine)}`;
    return rtnString;
}
/**
 * Process the error thrown by the call to emit.
 * If the error is an instance of a TransformerError, then return
 * the underlying message string which has already been carefully
 * parsed and encoded.  Otherwise, just return the caught error as-is.
 *
 * @param error
 * @returns what gets pushed onto errors[] from the try/catch block
 * @ignore
 */
function processEmitError(error) {
    return error instanceof TransformerError_1.TransformerError ? error.message : error;
}
//# sourceMappingURL=compile.js.map