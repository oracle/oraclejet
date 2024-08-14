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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
const metadataTransformer_1 = __importDefault(require("./metadataTransformer"));
const decoratorTransformer_1 = __importDefault(require("./decoratorTransformer"));
const importTransformer_1 = __importDefault(require("./importTransformer"));
const dtsTransformer_1 = __importDefault(require("./dtsTransformer"));
const dtsTransformer_2 = require("./dtsTransformer");
const PrettyMsgEncoder_1 = require("./utils/PrettyMsgEncoder");
const TransformerError_1 = require("./utils/TransformerError");
const __SUPPORTED_TS_VERSION = '5.4.5';
const [__SUPPORTED_TS_MAJOR, __SUPPORTED_TS_MINOR] = __SUPPORTED_TS_VERSION
    .split('.', 2)
    .map((str) => Number.parseInt(str));
function compile({ tsconfigJson, buildOptions }) {
    const parsedJsonConfig = ts.parseJsonConfigFileContent(tsconfigJson, ts.sys, '.');
    const parsedTsconfigJson = {
        compilerOptions: parsedJsonConfig.options,
        files: parsedJsonConfig.fileNames
    };
    const errors = [];
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
    if (_buildOptions.followImports == undefined) {
        _buildOptions.followImports = true;
    }
    if (_buildOptions.apiDocBuildEnabled == undefined) {
        _buildOptions.apiDocBuildEnabled = true;
    }
    _buildOptions.parentDirToPackInfo = {};
    if (parsedJsonConfig?.raw?.compilerOptions?.['_JET_disabledExceptionKeys']) {
        _buildOptions.disabledExceptionKeys = [
            ...parsedJsonConfig.raw.compilerOptions['_JET_disabledExceptionKeys']
        ];
    }
    const compilerHost = ts.createCompilerHost(parsedTsconfigJson.compilerOptions);
    const program = ts.createProgram(parsedTsconfigJson.files, parsedTsconfigJson.compilerOptions, compilerHost);
    let emitResult;
    const EmitOptions = {
        before: [
            (0, metadataTransformer_1.default)(program, _buildOptions),
            (0, decoratorTransformer_1.default)(_buildOptions),
            (0, importTransformer_1.default)(_buildOptions)
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
                return;
            }
        });
    }
    else {
        try {
            emitResult = program.emit(undefined, undefined, undefined, undefined, EmitOptions);
        }
        catch (e) {
            errors.push(processEmitError(e));
            return { errors, parsedTsconfigJson };
        }
    }
    handleDiagnosticMessages(program, emitResult, errors);
    if (errors.length == 0 && parsedTsconfigJson.compilerOptions.declaration) {
        (0, dtsTransformer_2.assembleTypes)(buildOptions);
    }
    return {
        errors,
        parsedTsconfigJson
    };
}
exports.default = compile;
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
function processEmitError(error) {
    return error instanceof TransformerError_1.TransformerError ? error.message : error;
}
//# sourceMappingURL=compile.js.map