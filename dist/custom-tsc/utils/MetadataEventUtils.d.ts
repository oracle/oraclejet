import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
import * as Metadata from 'ojs/ojmetadata';
export declare function generateEventsMetadata(memberKey: string, propDeclaration: ts.PropertyDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function getDtMetadataForEvent(propDeclaration: ts.PropertyDeclaration, typeNode: ts.TypeNode | undefined, isCancelable: boolean, metaUtilObj: MetaTypes.MetaUtilObj): Metadata.ComponentMetadataEvents;
