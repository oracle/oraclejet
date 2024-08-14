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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMetadata = exports.getValidationInfo = void 0;
const MetaTypes = __importStar(require("./MetadataTypes"));
const TransformerError_1 = require("./TransformerError");
const _ANY_CONTEXT = MetaTypes.MDContext.COMP |
    MetaTypes.MDContext.PROP |
    MetaTypes.MDContext.EVENT |
    MetaTypes.MDContext.SLOT |
    MetaTypes.MDContext.METHOD |
    MetaTypes.MDContext.TYPEDEF;
const _DT_METADATA_VALIDATION_MAP = new Map([
    ['description', { baseType: 'string', isArray: false, context: _ANY_CONTEXT }],
    ['displayName', { baseType: 'string', isArray: false, context: _ANY_CONTEXT }],
    ['extension', { baseType: 'object', isArray: false, context: _ANY_CONTEXT }],
    ['help', { baseType: 'string', isArray: false, context: _ANY_CONTEXT }],
    ['status', { baseType: 'object', isArray: true, context: _ANY_CONTEXT }],
    ['visible', { baseType: 'boolean', isArray: false, context: _ANY_CONTEXT }],
    ['name', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['version', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['jetVersion', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    [
        'properties',
        {
            baseType: 'object',
            isArray: false,
            context: MetaTypes.MDContext.COMP | MetaTypes.MDContext.PROP
        }
    ],
    ['methods', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['events', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['slots', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['dynamicSlots', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['dependencies', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['dependencyScope', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['icon', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['implements', { baseType: 'string', isArray: true, context: MetaTypes.MDContext.COMP }],
    ['license', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['main', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['pack', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['paths', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['preferredParent', { baseType: 'object', isArray: true, context: MetaTypes.MDContext.COMP }],
    ['propertyLayout', { baseType: 'object', isArray: true, context: MetaTypes.MDContext.COMP }],
    ['since', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['styleClasses', { baseType: 'object', isArray: true, context: MetaTypes.MDContext.COMP }],
    ['styleVariables', { baseType: 'object', isArray: true, context: MetaTypes.MDContext.COMP }],
    ['styleVariableSet', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.COMP }],
    ['subcomponentType', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.COMP }],
    [
        'type',
        {
            baseType: 'string',
            isArray: false,
            context: MetaTypes.MDContext.COMP | MetaTypes.MDContext.PROP
        }
    ],
    ['enumValues', { baseType: 'string', isArray: true, context: MetaTypes.MDContext.PROP }],
    ['readOnly', { baseType: 'boolean', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['value', { baseType: 'any', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['binding', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['writeback', { baseType: 'boolean', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['dynamicSlotDef', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.PROP }],
    [
        'exclusiveMaximum',
        { baseType: 'string|number', isArray: false, context: MetaTypes.MDContext.PROP }
    ],
    [
        'exclusiveMinimum',
        { baseType: 'string|number', isArray: false, context: MetaTypes.MDContext.PROP }
    ],
    ['format', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['maximum', { baseType: 'string|number', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['minimum', { baseType: 'string|number', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['minCapabilities', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['pattern', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['placeholder', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.PROP }],
    [
        'propertyEditorValues',
        { baseType: 'object', isArray: false, context: MetaTypes.MDContext.PROP }
    ],
    ['propertyGroup', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['required', { baseType: 'boolean', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['translatable', { baseType: 'boolean', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['units', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.PROP }],
    ['internalName', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.METHOD }],
    ['params', { baseType: 'object', isArray: true, context: MetaTypes.MDContext.METHOD }],
    ['return', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.METHOD }],
    ['bubbles', { baseType: 'boolean', isArray: false, context: MetaTypes.MDContext.EVENT }],
    ['cancelable', { baseType: 'boolean', isArray: false, context: MetaTypes.MDContext.EVENT }],
    ['detail', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.EVENT }],
    ['eventGroup', { baseType: 'string', isArray: false, context: MetaTypes.MDContext.EVENT }],
    [
        'implicitBusyContext',
        { baseType: 'boolean', isArray: false, context: MetaTypes.MDContext.SLOT }
    ],
    ['data', { baseType: 'object', isArray: false, context: MetaTypes.MDContext.SLOT }],
    ['maxItems', { baseType: 'number', isArray: false, context: MetaTypes.MDContext.SLOT }],
    ['minItems', { baseType: 'number', isArray: false, context: MetaTypes.MDContext.SLOT }],
    ['preferredContent', { baseType: 'string', isArray: true, context: MetaTypes.MDContext.SLOT }],
    [
        'templateSlotRenderType',
        {
            baseType: 'string',
            isArray: false,
            context: MetaTypes.MDContext.PROP | MetaTypes.MDContext.SLOT
        }
    ]
]);
function getValidationInfo(key) {
    const vInfo = _DT_METADATA_VALIDATION_MAP.get(key);
    return vInfo ? { ...vInfo } : null;
}
exports.getValidationInfo = getValidationInfo;
function isValidMetadata(key, value, mdValidInfo, tag, metaUtilObj) {
    let isValid = true;
    if (mdValidInfo.baseType !== 'any') {
        const testValue = mdValidInfo.isArray && Array.isArray(value) ? value[0] : value;
        const valType = typeof testValue;
        isValid =
            mdValidInfo.baseType !== 'string|number'
                ? valType === mdValidInfo.baseType
                : valType === 'string' || valType === 'number';
        if (!isValid) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INCORRECT_METADATA_VALUE_TYPE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'@ojmetadata ${key}' annotation specified metadata of the incorrect type, and will be ignored.
  Expected type:  ${mdValidInfo.baseType}
  Received type:  ${valType}`, tag);
        }
    }
    return isValid;
}
exports.isValidMetadata = isValidMetadata;
//# sourceMappingURL=MetadataValidationUtils.js.map