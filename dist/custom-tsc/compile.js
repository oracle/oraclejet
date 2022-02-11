"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const JetTypeGenerator_1 = require("./JetTypeGenerator");
function compile({ tsconfigJson, buildOptions }) {
    const parsedJsonConfig = ts.parseJsonConfigFileContent(tsconfigJson, ts.sys, '.');
    const parsedTsconfigJson = {
        compilerOptions: parsedJsonConfig.options,
        files: parsedJsonConfig.fileNames
    };
    const _buildOptions = Object.assign({}, buildOptions);
    const compilerHost = ts.createCompilerHost(parsedTsconfigJson.compilerOptions);
    const program = ts.createProgram(parsedTsconfigJson.files, parsedTsconfigJson.compilerOptions, compilerHost);
    compilerHost.writeFile = JetTypeGenerator_1.getTypeGenerator(_buildOptions);
    let emitResult;
    const errors = [];
    const EmitOptions = {
        before: [metadataTransformer_1.default(program, _buildOptions), decoratorTransformer_1.default(_buildOptions)]
    };
    if (_buildOptions.isolationMode) {
        program.getSourceFiles().forEach((sf) => {
            try {
                emitResult = program.emit(sf, undefined, undefined, undefined, EmitOptions);
            }
            catch (error) {
                errors.push(error);
                return;
            }
        });
    }
    else {
        try {
            emitResult = program.emit(undefined, undefined, undefined, undefined, EmitOptions);
        }
        catch (error) {
            errors.push(error);
            return { errors, parsedTsconfigJson };
        }
    }
    handleDiagnosticMessages(program, emitResult, errors);
    if (errors.length == 0 && parsedTsconfigJson.compilerOptions.declaration) {
        JetTypeGenerator_1.assembleTypes(buildOptions);
    }
    return {
        errors,
        parsedTsconfigJson
    };
}
exports.default = compile;
function parseDiagnostic(diagnostic) {
    let result;
    if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        result = `${diagnostic.file.fileName}:${line + 1}:${character + 1} - ${message}`;
    }
    else {
        result = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    }
    return result;
}
function handleDiagnosticMessages(program, emitResult, errors) {
    const diagnostics = [...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics];
    diagnostics.forEach((diagnostic) => {
        const errorMessage = parseDiagnostic(diagnostic);
        if (errors.indexOf(errorMessage) === -1) {
            errors.push(errorMessage);
        }
    });
}
//# sourceMappingURL=compile.js.map