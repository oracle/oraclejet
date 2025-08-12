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
exports.JETContentFactory = exports.ContentType = void 0;
exports.isComponentContent = isComponentContent;
exports.isVdomContent = isVdomContent;
exports.isHookContent = isHookContent;
exports.isUtilContent = isUtilContent;
exports.isResourceContent = isResourceContent;
exports.isVBFragmentContent = isVBFragmentContent;
exports.isVBPatternContent = isVBPatternContent;
const ts = __importStar(require("typescript"));
const DefaultProps_1 = require("./DefaultProps");
const ContentMetadata_1 = require("./ContentMetadata");
const Utils_1 = require("./Utils");
////////////////
// Content Types
////////////////
// enum of JETContent types
var ContentType;
(function (ContentType) {
    ContentType["COMPONENT"] = "composite";
    ContentType["VDOM"] = "vdom";
    ContentType["HOOK"] = "hook";
    ContentType["UTIL"] = "util";
    ContentType["RESOURCE"] = "resource";
    ContentType["VB_FRAGMENT"] = "vbcs-fragment";
    ContentType["VB_PATTERN"] = "vbcs-pattern";
})(ContentType || (exports.ContentType = ContentType = {}));
//////////////
// Type Guards
//////////////
function isComponentContent(content) {
    return !content.type || content.type === ContentType.COMPONENT;
}
function isVdomContent(content) {
    return content.type === ContentType.VDOM;
}
function isHookContent(content) {
    return content.type === ContentType.HOOK;
}
function isUtilContent(content) {
    return content.type === ContentType.UTIL;
}
function isResourceContent(content) {
    return content.type === ContentType.RESOURCE;
}
function isVBFragmentContent(content) {
    return content.type === ContentType.VB_FRAGMENT;
}
function isVBPatternContent(content) {
    return content.type === ContentType.VB_PATTERN;
}
/////////////////
// Factory method
/////////////////
class JETContentFactory {
    constructor(checker) {
        this._checker = checker;
    }
    _generateGenericSignature(node, exportName) {
        let signature;
        const typeParams = node.typeParameters;
        if (typeParams && typeParams.length > 0) {
            const paramSignatures = [];
            for (const param of typeParams) {
                paramSignatures.push(param.getText());
            }
            signature = `${exportName}<${paramSignatures.join(', ')}>`;
        }
        return signature;
    }
    _generateBaseContent(type, name, exportName, main, monoPack, contentItem, node) {
        let base = {
            name,
            version: monoPack.version,
            jetVersion: monoPack.jetVersion,
            pack: monoPack.name,
            type,
            description: contentItem.description,
            displayName: contentItem.displayName,
            export: contentItem.export ?? (name !== exportName ? exportName : undefined),
            genericSignature: this._generateGenericSignature(node, contentItem.export ?? exportName),
            main: contentItem.main ?? main,
            license: monoPack.license,
            status: contentItem.status?.length > 0 ? [...contentItem.status] : undefined
        };
        return base;
    }
    _setBaseContentFromJSDoc(content, tags) {
        for (const tag of tags) {
            if (ts.idText(tag.tagName) === 'since') {
                const sinceVersion = ts.getTextOfJSDocComment(tag.comment);
                if (sinceVersion) {
                    content.since = sinceVersion;
                }
            }
        }
    }
    create(type, name, exportName, main, monoPack, contentItem, node, propsTypeNode) {
        let rtnContent;
        let defaultProps;
        switch (type) {
            case ContentType.VDOM:
                const vdom = {
                    ...this._generateBaseContent(ContentType.VDOM, name, exportName, main, monoPack, contentItem, node)
                };
                // If propsTypeNode not supplied, then assume Function-based vdom Component
                //    * props will be the first parameter, and also a source for
                //      default property values
                if (propsTypeNode == undefined && ts.isFunctionLike(node)) {
                    const propsParam = node.parameters[0];
                    if (propsParam) {
                        propsTypeNode = propsParam.type;
                        defaultProps = (0, DefaultProps_1.getDefaultPropsFromSource)(propsParam);
                    }
                }
                // Otherwise assume Class-based vdom Component
                //    * look for the 'defaultProps' class element to provide
                //      default property values
                else if (ts.isClassLike(node)) {
                    for (const elem of node.members) {
                        if ((0, DefaultProps_1.isDefaultPropsClassElement)(elem)) {
                            defaultProps = (0, DefaultProps_1.getDefaultPropsFromSource)(elem);
                            break;
                        }
                    }
                }
                // Use any documentation comments for the 'description' metadata
                const docComment = (0, Utils_1.getCommentForSymbol)(this._checker.getTypeAtLocation(node).getSymbol(), this._checker);
                if (docComment) {
                    vdom.description = docComment;
                }
                // Set any other common metadata from standard JSDoc
                let tags = ts.getJSDocTags(node);
                this._setBaseContentFromJSDoc(vdom, tags);
                // Generate the vdom Component's 'properties' metadata
                if (propsTypeNode) {
                    const seen = new Set();
                    const propsType = this._checker.getTypeAtLocation(propsTypeNode);
                    vdom.properties = (0, ContentMetadata_1.generateVdomPropertiesMetadata)(propsType, ContentMetadata_1.CMContext.PROPERTY, seen, this._checker, defaultProps);
                }
                rtnContent = vdom;
                break;
            case ContentType.HOOK:
            case ContentType.UTIL:
                if (ts.isFunctionLike(node)) {
                    const func = {
                        ...this._generateBaseContent(type, name, exportName, main, monoPack, contentItem, node)
                    };
                    // Use any documentation comments for the 'description' metadata
                    const docComment = (0, Utils_1.getCommentForSymbol)(this._checker.getTypeAtLocation(node).getSymbol(), this._checker);
                    if (docComment) {
                        func.description = docComment;
                    }
                    // Set any other common metadata from standard JSDoc
                    let tags = ts.getJSDocTags(node);
                    this._setBaseContentFromJSDoc(func, tags);
                    // Generate function parameters and return metadata,
                    // and assign it to the JETContent instance
                    const params = [];
                    for (const paramDecl of node.parameters) {
                        params.push((0, ContentMetadata_1.generateVdomParamMetadata)(paramDecl, tags, this._checker));
                    }
                    const funcProps = {
                        params,
                        return: (0, ContentMetadata_1.generateVdomReturnMetadata)((0, Utils_1.getFunctionReturnTsType)(node, this._checker), tags, this._checker)
                    };
                    rtnContent = Object.assign(func, funcProps);
                }
                break;
            default:
                break;
        }
        return rtnContent;
    }
}
exports.JETContentFactory = JETContentFactory;
//# sourceMappingURL=JETContent.js.map