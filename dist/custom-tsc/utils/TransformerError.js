"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerError = exports.ExceptionKey = exports.ExceptionType = void 0;
const PrettyMsgEncoder_1 = require("./PrettyMsgEncoder");
var ExceptionType;
(function (ExceptionType) {
    ExceptionType["THROW_ERROR"] = "error";
    ExceptionType["WARN_IF_DISABLED"] = "warn_if_disabled";
    ExceptionType["LOG_WARNING"] = "warning";
})(ExceptionType || (exports.ExceptionType = ExceptionType = {}));
var ExceptionKey;
(function (ExceptionKey) {
    ExceptionKey["INVALID_PROPS_TYPE"] = "invalid_props_type";
    ExceptionKey["CONDITIONAL_PROPS_TYPE"] = "conditional_props_type";
    ExceptionKey["MISSING_PROPS_OBJECT"] = "missing_props_object";
    ExceptionKey["GLOBAL_PROPS_MINIMUM"] = "global_props_minimum";
    ExceptionKey["MISSING_FORWARDREF_WRAPPER"] = "missing_forwardref_wrapper";
    ExceptionKey["INVALID_ELEMENTNAME_IN_PACK"] = "invalid_elementname_in_pack";
    ExceptionKey["YIELDS_INVALID_FUNC_VCOMP_D_TS"] = "yields_invalid_func_vcomp_d_ts";
    ExceptionKey["INVALID_CUSTOM_EVENT_PROPNAME"] = "invalid_custom_event_propname";
    ExceptionKey["INVALID_IMPERATIVE_HANDLE_TYPE"] = "invalid_imperative_handle_type";
    ExceptionKey["RESERVED_REF_PROP"] = "reserved_ref_prop";
    ExceptionKey["RESERVED_KEY_PROP"] = "reserved_key_prop";
    ExceptionKey["RESERVED_CLASSNAME_PROP"] = "reserved_classname_prop";
    ExceptionKey["RESERVED_HTMLFOR_PROP"] = "reserved_htmlfor_prop";
    ExceptionKey["RESERVED_CLASS_PROP"] = "reserved_class_prop";
    ExceptionKey["RESERVED_STYLE_PROP"] = "reserved_style_prop";
    ExceptionKey["INVALID_OBSERVED_EVENT_HANDLER"] = "invalid_observed_event_handler";
    ExceptionKey["DUPLICATE_ROWRITEBACK_PROP"] = "duplicate_rowriteback_prop";
    ExceptionKey["DUPLICATE_PROP_ROWRITEBACK"] = "duplicate_prop_rowriteback";
    ExceptionKey["WRITEBACK_NO_PROP_MATCH"] = "writeback_no_prop_match";
    ExceptionKey["ROWRITEBACK_NO_PROP_MATCH"] = "rowriteback_no_prop_match";
    ExceptionKey["WRITEBACK_MISSING_PREFIX"] = "writeback_missing_prefix";
    ExceptionKey["PROP_DEFAULT_NONOBJECT_VALUE"] = "prop_default_nonobject_value";
    ExceptionKey["PROP_DEFAULT_EVENT_HANDLER"] = "prop_default_event_handler";
    ExceptionKey["PROP_DEFAULT_OBSERVEDGLOBALPROP"] = "prop_default_observedglobalprop";
    ExceptionKey["MULTIPLE_DYNAMIC_TEMPLATE_SLOTS"] = "multiple_dynamic_template_slots";
    ExceptionKey["MULTIPLE_DYNAMIC_SLOTS"] = "multiple_dynamic_slots";
    ExceptionKey["INVALID_MIXED_DYNAMIC_SLOT_PROPS"] = "invalid_mixed_dynamic_slot_props";
    ExceptionKey["UNSUPPORTED_DEFAULT_SLOT_TYPE"] = "unsupported_default_slot_type";
    ExceptionKey["COMPONENT_CHILDREN_NOT_DEFAULT_SLOT"] = "component_children_not_default_slot";
    ExceptionKey["INVALID_OBSERVEDGLOBALPROPS_INSTANCE"] = "invalid_observedglobalprops_instance";
    ExceptionKey["INVALID_SINCE"] = "invalid_since_value";
    ExceptionKey["INVALID_DYNAMIC_TEMPLATE_SLOTS_TYPE_PARAM"] = "invalid_dynamic_template_slots_type_param";
    ExceptionKey["UNRECOGNIZED_FUNCTION_WRAPPER"] = "unrecognized_function_wrapper";
    ExceptionKey["STATIC_DEFAULTPROPS_ON_FUNCTION"] = "static_defaultprops_on_function";
    ExceptionKey["RESERVED_CUSTOM_EVENT_PREFIX"] = "reserved_custom_event_prefix";
    ExceptionKey["PROP_DEFAULT_UNKNOWN_PROP"] = "prop_default_unknown_prop";
    ExceptionKey["MISSING_DYNAMIC_SLOT_DEF"] = "missing_dynamic_slot_def";
    ExceptionKey["UNSUPPORTED_IMPLICITBUSYCONTEXT"] = "unsupported_implicitbusycontext";
    ExceptionKey["UNEXPECTED_APIDOC_EXCEPTION"] = "unexpected_apidoc_exception";
    ExceptionKey["MISSING_METHOD_SIGNATURES"] = "missing_method_signatures";
    ExceptionKey["DEPRECATED_METHODS_METADATA"] = "deprecated_methods_metadata";
    ExceptionKey["IGNORED_OJMETADATA_NAME"] = "ignored_ojmetadata_name";
    ExceptionKey["IGNORED_OJMETADATA_MAIN"] = "ignored_ojmetadata_main";
    ExceptionKey["INCONSISTENT_PACK_VERSION"] = "inconsistent_pack_version";
    ExceptionKey["INCONSISTENT_PACK_JETVERSION"] = "inconsistent_pack_jetversion";
    ExceptionKey["INCONSISTENT_PACK_DEPENDENCYSCOPE"] = "inconsistent_pack_dependencyscope";
    ExceptionKey["INCONSISTENT_PACK_LICENSE"] = "inconsistent_pack_license";
    ExceptionKey["INCONSISTENT_PACK_PACKNAME"] = "inconsistent_pack_packname";
    ExceptionKey["IGNORED_OJMETADATA_INTERNALNAME"] = "ignored_ojmetadata_internalname";
    ExceptionKey["IGNORED_INTERNALNAME_METADATA"] = "ignored_internalname_metadata";
    ExceptionKey["DEPRECATED_ELEMENTREADONLY"] = "deprecated_elementreadonly";
    ExceptionKey["RESERVED_GLOBAL_PROP"] = "reserved_global_prop";
    ExceptionKey["PROP_DEFAULT_NO_DEFAULTPROPS"] = "prop_default_no_defaultprops";
    ExceptionKey["PROP_DEFAULT_OBJECT_LITERAL"] = "prop_default_object_literal";
    ExceptionKey["DEFAULT_TO_ANY_TYPE"] = "default_to_any_type";
    ExceptionKey["CANNOT_CONVERT_TO_JSON"] = "cannot_convert_to_json";
    ExceptionKey["IGNORED_OJMETADATA_VALUE"] = "ignored_ojmetadata_value";
    ExceptionKey["INVALID_STYLEVARIABLESET"] = "invalid_stylevariableset";
    ExceptionKey["MALFORMED_METADATA_VALUE"] = "malformed_metadata_value";
    ExceptionKey["TRIMMED_METADATA_STRING"] = "trimmed_metadata_string";
    ExceptionKey["UNRECOGNIZED_OJMETADATA_KEY"] = "unrecognized_ojmetadata_key";
    ExceptionKey["INCORRECT_METADATA_VALUE_TYPE"] = "incorrect_metadata_value_type";
    ExceptionKey["DT_REQUIRED_HAS_DEFAULT_VALUE"] = "dt_required_has_default_value";
    ExceptionKey["IGNORED_BIGINT_DEFAULT_VALUE"] = "ignored_bigint_default_value";
    ExceptionKey["IGNORED_FUNCTION_DEFAULT_VALUE"] = "ignored_function_default_value";
    ExceptionKey["IGNORED_ARRAY_DEFAULT_VALUE"] = "ignored_array_default_value";
    ExceptionKey["UNRECOGNIZED_SUBPROP_KEY"] = "unrecognized_subprop_key";
})(ExceptionKey || (exports.ExceptionKey = ExceptionKey = {}));
class TransformerError extends Error {
    constructor(vcompName, message, errNode) {
        const header = TransformerError.getMsgHeader(ExceptionType.THROW_ERROR, vcompName, errNode);
        super(`${header} ${message}`);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransformerError);
        }
        this.name = 'TransformerError';
    }
    static getMsgHeader(type, vcompName, errNode) {
        const encoder = this._encoder;
        let rtnString = '';
        const sourceFile = errNode?.getSourceFile();
        if (sourceFile) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(errNode.getStart());
            rtnString = `${encoder.encodeFileLineChar(sourceFile.fileName, line, character)} - `;
        }
        rtnString += `${type == ExceptionType.LOG_WARNING ? encoder.WARNING : encoder.ERROR} - ${encoder.encode(PrettyMsgEncoder_1.PCC.VCOMP, vcompName)}:`;
        return rtnString;
    }
    static setDisabledList(list) {
        this._disabledList = list;
    }
    static initPrettyMsgEncoding(tsconfig_pretty) {
        this._encoder = new PrettyMsgEncoder_1.PrettyMsgEncoder(tsconfig_pretty);
    }
    static reportException(key, type, vcompName, message, errNode) {
        if (type === ExceptionType.THROW_ERROR ||
            (type === ExceptionType.WARN_IF_DISABLED &&
                (this._disabledList === null || this._disabledList.indexOf(key) === -1))) {
            throw new TransformerError(vcompName, message, errNode);
        }
        else {
            const logHeader = TransformerError.getMsgHeader(ExceptionType.LOG_WARNING, vcompName, errNode);
            console.log(`${logHeader} ${message}`);
        }
    }
}
exports.TransformerError = TransformerError;
TransformerError._disabledList = null;
//# sourceMappingURL=TransformerError.js.map