import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function generateSlotsMetadata(memberKey: string, slotPropDeclaration: ts.PropertyDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
/**
 * Returns the properties of the slot data.
 * @param slotDataNode
 */
export declare function getSlotData(slotDataNode: ts.TypeNode, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.SlotDataMetadata;
/**
 * Utility that validates dynamic slot metadata after all other metadata is processed:
 *
 *    - If the VComponent custom element supports dynamic slots, then there must be
 *      one or more other Properties with the corresponding dynamicSlotDef metadata.
 *    - We also need to see if there are any dynamic template slots that require
 *      additions to the list of template slots.
 *    - Also take the opportunity to do some final housekeeping on our VComponent's
 *      list of template slots before the list is packaged and passed on to the
 *      dtsTransformer.
 */
export declare function validateDynamicSlots(metaUtilObj: MetaTypes.MetaUtilObj): void;
