import { MessagePayload } from './MessagePayload.js';
import { Response } from './Response.js';
import { DocumentQualifierEnum, MessageCategory, MessageClass, MessageType, type DocumentQualifier } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class PrintResponse extends MessagePayload {
  DocumentQualifier?: DocumentQualifier;
  Response?: Response;

  constructor() {
    super(MessageClass.Device, MessageCategory.Print, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'DocumentQualifier', enum: DocumentQualifierEnum },
    { name: 'Response', type: Response as unknown as Newable },
  ];
}

registerPayload('Print', 'Response', PrintResponse as unknown as Newable);
