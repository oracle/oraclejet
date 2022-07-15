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
const dtsTransformer_1 = require("./dtsTransformer");
const ts_creator_1 = __importDefault(require("ts-creator"));
let _BUILD_OPTIONS;
function importTransformWrapper(buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    const importTransformer = (context) => {
        return (sf) => {
            function visit(node) {
                if (buildOptions.componentToMetadata) {
                    return generateMissingImports(context, node);
                }
                else {
                    return node;
                }
            }
            if (_BUILD_OPTIONS['debug'])
                console.log(`${sf.fileName}: processing imports...`);
            return ts.visitNode(sf, visit);
        };
    };
    return importTransformer;
}
exports.default = importTransformWrapper;
function generateMissingImports(context, rootNode) {
    let content;
    const vcomponents = _BUILD_OPTIONS.componentToMetadata;
    for (let vcomponentName in vcomponents) {
        if (vcomponents[vcomponentName]['additionalImports']) {
            content = vcomponents[vcomponentName]['additionalImports'].join('\n');
            break;
        }
    }
    if (content && content.length) {
        const { factory } = context;
        const code = (0, dtsTransformer_1.fixCreateImportExportSpecifierCalls)((0, dtsTransformer_1.fixStringLiteralCalls)((0, ts_creator_1.default)(content)));
        let result = ts.transpile(code);
        let importStatements = eval(result);
        rootNode = factory.updateSourceFile(rootNode, [...importStatements, ...rootNode.statements]);
    }
    return rootNode;
}
//# sourceMappingURL=importTransformer.js.map