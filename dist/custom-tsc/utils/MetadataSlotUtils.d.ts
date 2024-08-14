import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function generateSlotsMetadata(memberKey: string, slotPropDeclaration: ts.PropertyDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function getSlotData(slotDataNode: ts.TypeNode, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.SlotDataMetadata;
export declare function validateDynamicSlots(metaUtilObj: MetaTypes.MetaUtilObj): void;
