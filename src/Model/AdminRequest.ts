import { MessagePayload } from './MessagePayload.js';
import { AdminResponse } from './AdminResponse.js';
import { MessageReference } from './MessageReference.js';
import { Response } from './Response.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class AdminRequest extends MessagePayload {
  ServiceIdentification?: string;
  MessageReference?: MessageReference;

  constructor() {
    super(MessageClass.Service, MessageCategory.Admin, MessageType.Request);
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new AdminResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ServiceIdentification' },
    { name: 'MessageReference', type: MessageReference as unknown as Newable },
  ];
}

registerPayload('Admin', 'Request', AdminRequest as unknown as Newable);
