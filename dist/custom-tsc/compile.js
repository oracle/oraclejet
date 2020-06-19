"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const metadataTransformer_1 = require("./metadataTransformer");
const decoratorTransformer_1 = require("./decoratorTransformer");
const jsxTransformer_1 = require("./jsxTransformer");
const importAmdTransformer_1 = require("./importAmdTransformer");
const importEs6Transformer_1 = require("./importEs6Transformer");
const JetTypeGenerator_1 = require("./JetTypeGenerator");
const COMPILER_OPTIONS = {
    experimentalDecorators: true,
    failOnTypeErrors: true,
    jsx: 'react',
    jsxFactory: "h",
    module: 'commonjs',
    moduleResolution: 'node',
    noEmitOnError: false,
    stripInternal: true,
    target: 'es6'
};
function compile({ files, compilerOptions, buildOptions }) {
    const { options: _compilerOptions } = ts.convertCompilerOptionsFromJson(Object.assign(Object.assign({}, COMPILER_OPTIONS), compilerOptions), '.');
    const _buildOptions = Object.assign({}, buildOptions);
    const compilerHost = ts.createCompilerHost(_compilerOptions);
    const program = ts.createProgram(files, _compilerOptions, compilerHost);
    compilerHost.writeFile = JetTypeGenerator_1.getTypeGenerator(_buildOptions);
    const afterTransformers = [];
    if (_compilerOptions.module === ts.ModuleKind.AMD) {
        afterTransformers.push(importAmdTransformer_1.default(_buildOptions));
    }
    else if (_compilerOptions.module === ts.ModuleKind.ES2015) {
        afterTransformers.push(importEs6Transformer_1.default(_buildOptions));
    }
    const emitResult = program.emit(undefined, undefined, undefined, undefined, {
        before: [metadataTransformer_1.default(program, _buildOptions), decoratorTransformer_1.default(_buildOptions)],
        after: afterTransformers,
        afterDeclarations: [jsxTransformer_1.default(program, _buildOptions)]
    });
    const errors = [];
    function parseDiagnostic(diagnostic) {
        let result;
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            result = `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
        }
        else {
            result = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        }
        return result;
    }
    [...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics].forEach(diagnostic => {
        const errorMessage = parseDiagnostic(diagnostic);
        if (errors.indexOf(errorMessage) === -1) {
            errors.push(errorMessage);
        }
    });
    if (errors.length == 0 && _compilerOptions.declaration) {
        JetTypeGenerator_1.assembleTypes(buildOptions);
    }
    return {
        errors
    };
}
exports.default = compile;
