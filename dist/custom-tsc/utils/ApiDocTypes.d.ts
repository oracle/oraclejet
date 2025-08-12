import * as MetadataTypes from 'ojs/ojmetadata';
export type AllJsDocTypes = JsDocComponentType | JsDocUtilityType | JsDocPropertyType | JsDocEventType | JsDocMethodType | JsDocSlotType | JsDocTypeDefType | JsDocFragmentType;
type JsDocMemberDocletType = {
    id: string;
    name: string;
    memberof: string;
    meta: JsDocMetaType;
    longname?: string;
    ojhidden?: boolean;
    scope?: 'static' | 'instance';
    description?: MetadataTypes.ComponentMetadata['description'];
    since?: MetadataTypes.ComponentMetadata['since'];
    tsdeprecated?: MetadataTypes.Status[];
    displayName?: string;
};
export type JsDocComponentType = JsDocMemberDocletType & {
    kind: 'class';
    classdesc?: string;
    pack?: string;
    tagWithoutBrackets?: string;
    tagWithBrackets?: string;
    domInterface?: string;
    ojPageTitle?: string;
    ojcomponent: boolean;
    isvcomponent: boolean;
    camelCaseName?: string;
    ojPageTitlePrefix?: string;
    ojtsvcomponent?: boolean;
    tstype?: JsDocTsType;
    ojsignature?: JsDocTsType[];
    ojunsupportedthemes?: string;
    ojmodule?: string;
    ojslotcomponent?: boolean;
};
export type JsDocUtilityType = JsDocMemberDocletType & {
    kind: 'namespace';
    classdesc?: string;
    pack?: string;
    scope: 'static';
    ojmodule?: string;
    ojmodulecontainer?: string;
};
export type JsDocPropertyType = JsDocMemberDocletType & {
    kind: 'member';
    optional?: boolean;
    type: JsDocType;
    defaultvalue?: string;
    ojwriteback?: boolean;
    readonly?: boolean;
    dynamicSlotDef?: string;
    ojvalues?: JsDocPropValueType[];
    properties?: JsDocPropertyType[];
    observedGlobalProp?: boolean;
};
export type JsDocMethodType = JsDocMemberDocletType & {
    kind: 'function';
    ojexports?: boolean;
    params?: JsDocParamsType[];
    returns: JsDocReturnType[];
};
export type JsDocEventType = JsDocMemberDocletType & {
    kind: 'event';
    properties?: JsDocPropertyType[];
};
export type JsDocTypeDefType = JsDocMemberDocletType & {
    kind: 'typedef';
    tsgenerictype?: JsDocTsType;
    type: JsDocType;
    properties?: JsDocPropertyType[];
    ojexports?: boolean;
    tstype?: JsDocTsType[];
};
export type JsDocSlotType = JsDocMemberDocletType & {
    kind: 'member';
    ojslot?: boolean;
    ojchild?: boolean;
    ojtemplateslotprops?: string;
    properties?: JsDocPropertyType[];
    dynamicSlot?: boolean;
    optional?: boolean;
};
export type JsDocFragmentType = JsDocMemberDocletType & {
    kind: 'member';
    ojfragment: true;
};
type JsDocPropValueType = {
    name: string;
    description?: string;
    displayName?: string;
    type: JsDocType;
};
type JsDocReturnType = {
    type: JsDocType;
    description?: string;
    tstype?: JsDocTsType[];
};
export type JsDocParamsType = {
    name: string;
    description?: string;
    type: JsDocType;
    optional?: boolean;
    defaultvalue?: string;
    tstype?: JsDocTsType[];
};
type JsDocType = {
    names: string[];
};
type JsDocTsType = {
    target: string;
    value: string;
    jsdocOverride?: boolean;
    for?: string;
    genericParameters?: string;
    module?: string;
};
type JsDocMetaType = {
    filename: string;
    path: string;
};
export {};
