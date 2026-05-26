import { MessagePayload } from './MessagePayload.js';
import { POISystemData } from './POISystemData.js';
import { Response } from './Response.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class LoginResponse extends MessagePayload {
  Response?: Response;
  POISystemData?: POISystemData;

  constructor() {
    super(MessageClass.Service, MessageCategory.Login, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'POISystemData', type: POISystemData as unknown as Newable },
  ];
}

registerPayload('Login', 'Response', LoginResponse as unknown as Newable);
