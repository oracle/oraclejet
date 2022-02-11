import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function generateSlotsMetadata(memberKey: string, propDeclaration: ts.PropertyDeclaration, typeName: string, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function getSlotData(detailNode: ts.TypeNode, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.SlotDataMetadata;
export declare function checkDefaultSlotType(propName: string, typeName: string, propDecl: ts.PropertyDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function validateDynamicSlots(metaUtilObj: MetaTypes.MetaUtilObj): void;
