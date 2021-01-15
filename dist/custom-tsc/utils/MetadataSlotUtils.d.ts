import * as ts from "typescript";
import * as MetaTypes from "./MetadataTypes";
export declare function generateSlotsMetadata(memberKey: string, propDeclaration: ts.PropertyDeclaration, typeName: string, isCustomElement: boolean, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function getSlotData(detailNode: ts.HasType, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.SlotDataMetadata;
export declare function checkDefaultSlotType(propName: string, typeName: string, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function validateDynamicSlots(metaUtilObj: MetaTypes.MetaUtilObj): void;
