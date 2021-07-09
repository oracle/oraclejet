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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDtMetadataForComponent = exports.getVCompClassInfo = void 0;
const ts = __importStar(require("typescript"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
function getVCompClassInfo(classNode, vexportToAlias, checker) {
    var _a, _b;
    let rtnInfo = null;
    let heritageClauses = classNode.heritageClauses;
    for (let clause of heritageClauses) {
        for (let type of clause.types) {
            let baseClass = TypeUtils.getTypeNameFromTypeReference(type);
            if (baseClass === vexportToAlias.Component ||
                baseClass === vexportToAlias.PureComponent) {
                rtnInfo = {
                    className: classNode.name.getText(),
                };
                if (((_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a[0]) &&
                    ts.isTypeReferenceNode((_b = type.typeArguments) === null || _b === void 0 ? void 0 : _b[0])) {
                    let utilityType = type.typeArguments[0];
                    rtnInfo.propsInfo = MetaUtils.getPropsInfo(utilityType, vexportToAlias, checker);
                    if (!rtnInfo.propsInfo &&
                        TypeUtils.getTypeNameFromTypeReference(utilityType) !==
                            vexportToAlias.GlobalProps) {
                        throw new TransformerError_1.TransformerError(rtnInfo.className, "All custom elements at a minimum support global properties. Properties should use the ExtendGlobalProps utility type, e.g. Component<ExtendGlobalProps<Props>>.");
                    }
                    break;
                }
                else {
                    throw new TransformerError_1.TransformerError(rtnInfo.className, "All custom elements at a minimum support global properties and should pass in GlobalProps for the property type, e.g. Component<GlobalProps>.");
                }
            }
        }
    }
    return rtnInfo;
}
exports.getVCompClassInfo = getVCompClassInfo;
function getDtMetadataForComponent(classNode, metaUtilObj) {
    const vcompInterfaceName = MetaUtils.tagNameToElementInterfaceName(metaUtilObj.fullMetadata["name"]);
    metaUtilObj.fullMetadata["implements"] = new Array(vcompInterfaceName);
    let dtMetadata = MetaUtils.getDtMetadata(classNode, metaUtilObj);
    if (dtMetadata["implements"]) {
        metaUtilObj.fullMetadata["implements"] = metaUtilObj.fullMetadata["implements"].concat(dtMetadata["implements"]);
        delete dtMetadata["implements"];
    }
    Object.assign(metaUtilObj.fullMetadata, dtMetadata);
}
exports.getDtMetadataForComponent = getDtMetadataForComponent;
