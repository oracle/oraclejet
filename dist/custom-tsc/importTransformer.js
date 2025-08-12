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
exports.default = importTransformWrapper;
const ts = __importStar(require("typescript"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
let _BUILD_OPTIONS;
/**
 * Transformer run after the metadata transformer and before the code
 * is compiled to JavaScript so we can add any missing import statements.
 * @param buildOptions
 */
function importTransformWrapper(buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    const importTransformer = (context) => {
        return ((sf) => {
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
        });
    };
    return importTransformer;
}
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
        const importStatements = MetaUtils.generateStatementsFromText(content);
        rootNode = factory.updateSourceFile(rootNode, [...importStatements, ...rootNode.statements]);
    }
    return rootNode;
}
//# sourceMappingURL=importTransformer.js.map