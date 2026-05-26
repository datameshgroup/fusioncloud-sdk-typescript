import { MessagePayload } from './MessagePayload.js';
import { Response } from './Response.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class LogoutResponse extends MessagePayload {
  Response?: Response;

  constructor() {
    super(MessageClass.Service, MessageCategory.Logout, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
  ];
}

registerPayload('Logout', 'Response', LogoutResponse as unknown as Newable);
