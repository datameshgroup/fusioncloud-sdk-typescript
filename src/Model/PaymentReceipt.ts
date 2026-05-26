import type { FieldSchema, Newable } from '../util/json/schema.js';
import { OutputContent } from './OutputContent.js';
import { DocumentQualifierEnum, type DocumentQualifier } from './Types.js';

export class PaymentReceipt {
  DocumentQualifier?: DocumentQualifier;
  IntegratedPrintFlag?: boolean;
  RequiredSignatureFlag?: boolean;
  OutputContent?: OutputContent;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'DocumentQualifier', enum: DocumentQualifierEnum },
    { name: 'IntegratedPrintFlag' },
    { name: 'RequiredSignatureFlag' },
    { name: 'OutputContent', type: OutputContent as unknown as Newable },
  ];

  /** Convenience accessor — returns the plain-text receipt body. */
  getContentAsPlainText(): string {
    return this.OutputContent?.getContentAsPlainText() ?? '';
  }
}
