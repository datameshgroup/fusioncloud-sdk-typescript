import { MessagePayload } from './MessagePayload.js';
import { Response } from './Response.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class AdminResponse extends MessagePayload {
  Response?: Response;
  ServiceIdentification?: string;

  constructor() {
    super(MessageClass.Service, MessageCategory.Admin, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'ServiceIdentification' },
  ];
}

registerPayload('Admin', 'Response', AdminResponse as unknown as Newable);
