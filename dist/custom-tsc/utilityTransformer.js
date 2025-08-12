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
exports.default = utilityTransformer;
const ts = __importStar(require("typescript"));
const path = __importStar(require("path"));
const MetaTypes = __importStar(require("./utils/MetadataTypes"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const TypeUtils = __importStar(require("./utils//MetadataTypeUtils"));
const ApiDocFileUtils_1 = require("./utils/ApiDocFileUtils");
let _CHECKER;
let _OPTIONS;
/**
 *
 * @param node Main entry to process a function and extract metadata into MetaUtilObj
 * @param metaUtilObj
 */
function generateFunctionMetadata(node, metaUtilObj) {
    // if (!metaUtilObj.rtMetadata.methods) {
    //   metaUtilObj.rtMetadata.methods = {};
    // }
    let targetNode = node;
    // const foo = <FunctionEpression | ArrowFunction> in which case parent is a VariableDeclaration
    if (ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
        targetNode = node.parent;
    }
    const methodName = targetNode.name.getText();
    //metaUtilObj.rtMetadata.methods[methodName] = {};
    const dtMetadata = MetaUtils.getDtMetadata(node, MetaTypes.MDContext.METHOD, null, metaUtilObj);
    metaUtilObj.fullMetadata.methods[methodName] = getFunctionDtMetadata(node, dtMetadata, metaUtilObj);
}
/**
 * Given a function-like-node, this function will attempt to extract all DT metadata based on either jsdoc annotations and/or from the syntax
 * @param functionNode this is the function-like-node for which we want to generate jsdoc style metadata
 * @param dtMD
 * @param metaUtilObj
 * @returns
 */
function getFunctionDtMetadata(functionNode, dtMD, metaUtilObj) {
    let dtMethod = { ...dtMD };
    // We have two potential sources for method parameter metadata:
    //
    //  - DT metadata
    //  - standard JSDoc (i.e., @param tags - descriptions only, used as a fallback)
    //
    const paramsDtMD = dtMethod.params;
    const paramsJsdocMD = dtMethod['jsdoc']?.['params'];
    // Given a parameter name, searches our two potential sources for the corresponding
    // method parameter metadata, preferring more complete DT metadata over JSDoc metadata.
    const findMethodParamMD = (pname) => paramsDtMD?.find((param) => param.name === pname) ??
        paramsJsdocMD?.find((param) => param.name === pname);
    // Map the actual parameters from the method node itself to the "complete"
    // parameter metadata DT objects (including type) from our sources
    // -- the type of the actual parameter "wins"
    const dtParams = functionNode.parameters.map((param) => {
        const name = param.name.getText();
        // for function parameters, get the symbol of the parameter
        let declSymbol = null;
        if (ts.isParameter(param)) {
            declSymbol = metaUtilObj.typeChecker.getSymbolAtLocation(param.name);
        }
        const typeObj = TypeUtils.getAllMetadataForDeclaration(param, MetaTypes.MDScope.DT, MetaTypes.MDContext.METHOD | MetaTypes.MDContext.METHOD_PARAM, null, declSymbol, metaUtilObj);
        let typeRefs = typeObj?.typeDefs;
        if (typeRefs) {
            MetaUtils.createTypeDefinitionFromTypeRefs(typeRefs.map((t) => t.typeReference), metaUtilObj);
        }
        let paramObj = { name, type: typeObj.type };
        if (typeObj.isApiDocSignature && typeObj.reftype) {
            paramObj['reftype'] = typeObj.reftype;
            paramObj['isApiDocSignature'] = typeObj.isApiDocSignature;
        }
        if (param.type && param.initializer) {
            // Capture default values if available
            paramObj['defaultvalue'] = param.initializer.getText();
        }
        const paramMDObj = findMethodParamMD(name);
        if (paramMDObj) {
            paramObj = { ...paramMDObj, ...paramObj };
        }
        return paramObj;
    });
    if (dtParams.length > 0) {
        dtMethod.params = dtParams;
    }
    else {
        delete dtMethod.params;
    }
    // Get the return type from the function-like node
    let returnTypeObj = TypeUtils.getReturnTypeForFunction(functionNode, metaUtilObj);
    dtMethod.return = returnTypeObj.type;
    if (returnTypeObj.isApiDocSignature && returnTypeObj.reftype) {
        dtMethod['jsdoc'] = dtMethod['jsdoc'] || {};
        dtMethod['jsdoc']['returnType'] = returnTypeObj.reftype;
    }
    let typeRefs = returnTypeObj?.typeDefs;
    if (typeRefs) {
        MetaUtils.createTypeDefinitionFromTypeRefs(typeRefs.map((t) => t.typeReference), metaUtilObj);
    }
    return dtMethod;
}
/**
 * Returns an array of JSDocTag nodes, each member corresponds to a discovered comment tag and its value.
 * @param commentText the jsdoc comment block
 * @returns
 */
function createJSDocTagsFromComment(commentText) {
    const metadataTags = [];
    const lines = commentText.split('\n');
    let currentTag = null;
    let currentValue = [];
    for (const line of lines) {
        // Match JSDoc tags, ensuring we do NOT capture `*/` at the end
        const tagMatch = line.match(/^\s*\*\s*@(\S+)\s+([\s\S]*?)(?=\n\s*\*\s*@|\n\s*\*\/|$)/);
        if (tagMatch) {
            // Store the previous tag if one exists
            if (currentTag) {
                metadataTags.push(ts.factory.createJSDocUnknownTag(ts.factory.createIdentifier(currentTag), currentValue.length === 1
                    ? currentValue[0].trim()
                    : ts.factory.createNodeArray(currentValue.map((value) => ts.factory.createJSDocText(value.trim().replace(/\*\/$/, '')) // Remove stray */
                    ))));
            }
            currentTag = tagMatch[1]; // Capture tag name
            currentValue = [tagMatch[2] ? tagMatch[2].trim() : '']; // Capture first value
        }
        else if (currentTag) {
            // If we are inside a multi-line value, keep appending
            currentValue.push(line.replace(/^\s*\*\s?/, '').trim());
        }
    }
    // Save the last captured tag
    if (currentTag) {
        metadataTags.push(ts.factory.createJSDocUnknownTag(ts.factory.createIdentifier(currentTag), currentValue.length === 1
            ? currentValue[0].trim()
            : ts.factory.createNodeArray(currentValue.map((value) => ts.factory.createJSDocText(value.trim().replace(/\*\/$/, '')) // Remove stray */
            ))));
    }
    return metadataTags;
}
/**
 *
 * @param sourceFile Extracts all DT annotation metadata from the comment block that contains the ojmetadata type 'resource' entry
 * @param metaUtilObj
 * @returns
 */
function extractMetadataTags(sourceFile, metaUtilObj) {
    const fullText = sourceFile.getFullText();
    const allComments = ts.getLeadingCommentRanges(fullText, 0) || [];
    let metadataCommentBlock = null;
    for (const range of allComments) {
        const commentText = fullText.slice(range.pos, range.end);
        // Check if this comment block contains our @ojmetadata type "resource" marker
        if (/@ojmetadata\s+type\s+["']resource["']/.test(commentText)) {
            metadataCommentBlock = commentText;
            break; // Stop at the first marker found
        }
    }
    // bail if we did not find the resource type metadata
    if (!metadataCommentBlock) {
        return null;
    }
    // create the JSDocTags
    const metadataTags = createJSDocTagsFromComment(metadataCommentBlock);
    // Create a properly structured JSDoc node with the discovered tags
    const syntheticJSDoc = ts.factory.createJSDocComment(metadataCommentBlock, metadataTags);
    // Create a synthetic VariableDeclaration (a valid HasJSDoc node)
    const syntheticNode = ts.factory.createVariableDeclaration(ts.factory.createIdentifier('syntheticMetadata'), // Identifier
    undefined, undefined, undefined);
    // Attach the JSDoc to the synthetic node
    syntheticNode.jsDoc = [syntheticJSDoc];
    // add the SourceFile as parent
    syntheticNode.parent = sourceFile;
    // call out utility function to validate and return annotation metadata
    return MetaUtils.getDtMetadata(syntheticNode, MetaTypes.MDContext.COMP, null, metaUtilObj);
}
/**
 * Main callback to process a given sourceFile. Validates the file extension(ts/tsx) and looks for
 * a top level comment block that minimally contains the @ojmetadata type 'resource' entry
 * @param sourceFile
 * @returns
 */
function processUtilityFunctions(sourceFile) {
    // Ensure the file extension is .ts or .tsx
    if (!/\.(ts|tsx)$/.test(sourceFile.fileName)) {
        return null;
    }
    // create a bare minimum starter MetautilObj
    let metaUtilObj = getMetaUtilObj(sourceFile);
    if (!metaUtilObj) {
        return null;
    }
    // Store function definitions by name for later lookup
    // we can store a null value for the node in case when we find the export statement before
    // the function node declaration (not a typical coding behavior though). When that function
    // node will be processed we would see that the function was exported so we can process it's metadata.
    const functionDefinitions = new Map();
    ts.forEachChild(sourceFile, function visit(node) {
        // Handle function declarations
        if (ts.isFunctionDeclaration(node) && node.name) {
            const isExported = node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);
            const name = node.name.getText(sourceFile);
            // handle the case when the export statement is inlined with the function declartion OR
            // the export statement happened before the function declaration
            if (isExported || functionDefinitions.has(name)) {
                generateFunctionMetadata(node, metaUtilObj);
            }
            else {
                functionDefinitions.set(name, node);
            }
        }
        // Handle variable declarations with function expressions (Named and Default)
        else if (ts.isVariableStatement(node)) {
            const isExported = node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);
            node.declarationList.declarations.forEach((declaration) => {
                if (declaration.name &&
                    ts.isIdentifier(declaration.name) &&
                    declaration.initializer &&
                    (ts.isFunctionExpression(declaration.initializer) ||
                        ts.isArrowFunction(declaration.initializer))) {
                    const name = declaration.name.getText(sourceFile);
                    // handle the case when the export statement is inlined with the function declartion OR
                    // the export statement happened before the function declaration
                    if (isExported || functionDefinitions.has(name)) {
                        generateFunctionMetadata(declaration.initializer, metaUtilObj);
                    }
                    else {
                        functionDefinitions.set(name, declaration.initializer);
                    }
                }
            });
        }
        // handle "export default" statements
        else if (ts.isExportAssignment(node)) {
            if (node.expression && ts.isIdentifier(node.expression)) {
                const name = node.expression.getText(sourceFile);
                const functionNode = functionDefinitions.get(name);
                if (functionNode) {
                    generateFunctionMetadata(functionNode, metaUtilObj);
                }
                else {
                    // handle the case when the export statement happens before the function declaration
                    // in this case the function node is null and that's fine we should find it later when
                    // we process that node
                    functionDefinitions.set(name, null);
                }
            }
        }
        // Handle "export { myFunction }" and "export myFunction"
        else if (ts.isExportDeclaration(node) &&
            node.exportClause &&
            ts.isNamedExports(node.exportClause)) {
            node.exportClause.elements.forEach((exportSpecifier) => {
                const name = exportSpecifier.name.getText(sourceFile);
                const functionNode = functionDefinitions.get(name);
                if (functionNode) {
                    generateFunctionMetadata(functionNode, metaUtilObj);
                }
                else {
                    // handle the case when the export statement happens before the function declaration
                    // in this case the function node is null and that's fine we should find it later when
                    // we process that node
                    functionDefinitions.set(name, null);
                }
            });
        }
        ts.forEachChild(node, visit);
    });
    // collected all the function metadata now generate the jsdoc style doclets
    (0, ApiDocFileUtils_1.generateApiDocMetadata)(metaUtilObj, _OPTIONS);
    // Store the jsdoc metadata for the utility in the ApiDocOptions
    // it will be written out after the compiler emit phase completed
    storeApiDocMetadataInBuildOptions(metaUtilObj);
}
/**
 * Creates the starter metaUtilObj which is a collection of all the discoverable metadata associated with exported functions.
 * If the sourceFile is not marked with the 'resource' type ojmetadata, we are not going to spelungk and look for functions
 * @param sourceFile The ts/tsx source file
 * @returns a new MetautilObj object or null
 */
function getMetaUtilObj(sourceFile) {
    // create a core, bare minimum metaUtilObj
    let metaUtilObj = MetaUtils.MetaUtilObjFactory.create(_CHECKER);
    if (_OPTIONS.debug) {
        metaUtilObj.debugMode = _OPTIONS.debug;
    }
    // parse the special comment block and get the metadata from jsdoc tags
    let metadataTags = extractMetadataTags(sourceFile, metaUtilObj);
    if (!metadataTags || !metadataTags['name']) {
        return null;
    }
    // add discovered tag based metadata to the metaUtilObj
    metaUtilObj.componentName = metadataTags['name'];
    metaUtilObj.fullMetadata = {
        name: metadataTags['name'],
        jetVersion: metadataTags['jetVersion'],
        version: metadataTags['version'],
        type: metadataTags['type'],
        methods: {}
    };
    metaUtilObj.fullMetadata['main'] = metadataTags['main'];
    const fileName = sourceFile.fileName;
    metaUtilObj.fullMetadata['jsdoc'] = metaUtilObj.fullMetadata['jsdoc'] || {};
    metaUtilObj.fullMetadata['jsdoc']['meta'] = {
        filename: path.basename(fileName),
        path: path.dirname(fileName)
    };
    metaUtilObj.fullMetadata['jsdoc'].description = metadataTags.description || '';
    return metaUtilObj;
}
function storeApiDocMetadataInBuildOptions(metaUtilObj) {
    //store apidoc doclets in global BuildOptions
    if (metaUtilObj.apidoc) {
        if (!_OPTIONS.componentToApiDoc) {
            _OPTIONS.componentToApiDoc = {};
        }
        _OPTIONS.componentToApiDoc[metaUtilObj.componentName] = JSON.parse(JSON.stringify(metaUtilObj.apidoc));
    }
}
// Transformer factory function
function beforeTransform(context) {
    return (sourceFile) => {
        if (_OPTIONS.apiDocBuildEnabled) {
            if (_OPTIONS['debug']) {
                console.log(`${sourceFile.fileName}:: processUtilityFunctions: processing metadata...`);
            }
            processUtilityFunctions(sourceFile);
        }
        else {
            if (_OPTIONS['debug']) {
                console.log(`${sourceFile.fileName}:: processUtilityFunctions: processing metadata is disabled`);
            }
        }
        return sourceFile;
    };
}
// Export as a factory function for TypeScript plugins
function utilityTransformer(program, options) {
    _CHECKER = program.getTypeChecker();
    _OPTIONS = options;
    return (context) => beforeTransform(context);
}
//# sourceMappingURL=utilityTransformer.js.map