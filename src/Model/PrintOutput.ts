import type { FieldSchema, Newable } from '../util/json/schema.js';
import { OutputContent } from './OutputContent.js';
import {
  DocumentQualifierEnum,
  ResponseModeEnum,
  type DocumentQualifier,
  type ResponseMode,
} from './Types.js';

export class PrintOutput {
  DocumentQualifier?: DocumentQualifier;
  ResponseMode?: ResponseMode;
  IntegratedPrintFlag?: boolean;
  RequiredSignatureFlag?: boolean;
  OutputContent?: OutputContent;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'DocumentQualifier', enum: DocumentQualifierEnum },
    { name: 'ResponseMode', enum: ResponseModeEnum },
    { name: 'IntegratedPrintFlag' },
    { name: 'RequiredSignatureFlag' },
    { name: 'OutputContent', type: OutputContent as unknown as Newable },
  ];
}
