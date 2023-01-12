import ts from 'typescript';
export declare enum ExceptionType {
    THROW_ERROR = "error",
    WARN_IF_DISABLED = "warn_if_disabled",
    LOG_WARNING = "warning"
}
export declare enum ExceptionKey {
    INVALID_PROPS_TYPE = "invalid_props_type",
    CONDITIONAL_PROPS_TYPE = "conditional_props_type",
    MISSING_PROPS_OBJECT = "missing_props_object",
    GLOBAL_PROPS_MINIMUM = "global_props_minimum",
    MISSING_FORWARDREF_WRAPPER = "missing_forwardref_wrapper",
    INVALID_ELEMENTNAME_IN_PACK = "invalid_elementname_in_pack",
    YIELDS_INVALID_FUNC_VCOMP_D_TS = "yields_invalid_func_vcomp_d_ts",
    INVALID_CUSTOM_EVENT_PROPNAME = "invalid_custom_event_propname",
    INVALID_IMPERATIVE_HANDLE_TYPE = "invalid_imperative_handle_type",
    RESERVED_REF_PROP = "reserved_ref_prop",
    RESERVED_KEY_PROP = "reserved_key_prop",
    RESERVED_CLASSNAME_PROP = "reserved_classname_prop",
    RESERVED_HTMLFOR_PROP = "reserved_htmlfor_prop",
    RESERVED_CLASS_PROP = "reserved_class_prop",
    RESERVED_STYLE_PROP = "reserved_style_prop",
    DUPLICATE_ROWRITEBACK_PROP = "duplicate_rowriteback_prop",
    DUPLICATE_PROP_ROWRITEBACK = "duplicate_prop_rowriteback",
    WRITEBACK_NO_PROP_MATCH = "writeback_no_prop_match",
    ROWRITEBACK_NO_PROP_MATCH = "rowriteback_no_prop_match",
    WRITEBACK_MISSING_PREFIX = "writeback_missing_prefix",
    PROP_DEFAULT_NONOBJECT_VALUE = "prop_default_nonobject_value",
    PROP_DEFAULT_EVENT_HANDLER = "prop_default_event_handler",
    PROP_DEFAULT_OBSERVEDGLOBALPROP = "prop_default_observedglobalprop",
    MULTIPLE_DYNAMIC_TEMPLATE_SLOTS = "multiple_dynamic_template_slots",
    MULTIPLE_DYNAMIC_SLOTS = "multiple_dynamic_slots",
    INVALID_MIXED_DYNAMIC_SLOT_PROPS = "invalid_mixed_dynamic_slot_props",
    UNSUPPORTED_DEFAULT_SLOT_TYPE = "unsupported_default_slot_type",
    COMPONENT_CHILDREN_NOT_DEFAULT_SLOT = "component_children_not_default_slot",
    INVALID_OBSERVEDGLOBALPROPS_INSTANCE = "invalid_observedglobalprops_instance",
    INVALID_SINCE = "invalid_since_value",
    UNRECOGNIZED_FUNCTION_WRAPPER = "unrecognized_function_wrapper",
    STATIC_DEFAULTPROPS_ON_FUNCTION = "static_defaultprops_on_function",
    RESERVED_CUSTOM_EVENT_PREFIX = "reserved_custom_event_prefix",
    PROP_DEFAULT_UNKNOWN_PROP = "prop_default_unknown_prop",
    MISSING_DYNAMIC_SLOT_DEF = "missing_dynamic_slot_def",
    UNEXPECTED_APIDOC_EXCEPTION = "unexpected_apidoc_exception",
    MISSING_METHOD_SIGNATURES = "missing_method_signatures",
    IGNORED_OJMETADATA_NAME = "ignored_ojmetadata_name",
    INCONSISTENT_PACK_VERSION = "inconsistent_pack_version",
    INCONSISTENT_PACK_JETVERSION = "inconsistent_pack_jetversion",
    INCONSISTENT_PACK_LICENSE = "inconsistent_pack_license",
    INCONSISTENT_PACK_PACKNAME = "inconsistent_pack_packname",
    IGNORED_OJMETADATA_INTERNALNAME = "ignored_ojmetadata_internalname",
    IGNORED_INTERNALNAME_METADATA = "ignored_internalname_metadata",
    DEPRECATED_ELEMENTREADONLY = "deprecated_elementreadonly",
    RESERVED_GLOBAL_PROP = "reserved_global_prop",
    PROP_DEFAULT_NO_DEFAULTPROPS = "prop_default_no_defaultprops",
    PROP_DEFAULT_OBJECT_LITERAL = "prop_default_object_literal",
    DEFAULT_TO_ANY_TYPE = "default_to_any_type",
    CANNOT_CONVERT_TO_JSON = "cannot_convert_to_json",
    IGNORED_OJMETADATA_VALUE = "ignored_ojmetadata_value",
    INVALID_STYLEVARIABLESET = "invalid_stylevariableset",
    MALFORMED_METADATA_VALUE = "malformed_metadata_value",
    TRIMMED_METADATA_STRING = "trimmed_metadata_string"
}
export declare class TransformerError extends Error {
    private constructor();
    private static _disabledList;
    private static getMsgHeader;
    static setDisabledList(list: Array<string> | null): void;
    static reportException(key: ExceptionKey, type: ExceptionType, vcompName: string, message: string, errNode?: ts.Node): void;
}
