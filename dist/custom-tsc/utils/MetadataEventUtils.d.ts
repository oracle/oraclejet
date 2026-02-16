import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
import * as Metadata from 'ojs/ojmetadata';
export declare function generateEventsMetadata(memberKey: string, propDeclaration: ts.PropertyDeclaration, memberSymbol: ts.Symbol, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function getDtMetadataForEvent(prop: string, propDeclaration: ts.PropertyDeclaration, memberSymbol: ts.Symbol, typeNode: ts.TypeNode | undefined, isCancelable: boolean, metaUtilObj: MetaTypes.MetaUtilObj): Metadata.ComponentMetadataEvents;
