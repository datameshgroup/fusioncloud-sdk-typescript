import { MessagePayload } from './MessagePayload.js';
import { MessageReference } from './MessageReference.js';
import { Response } from './Response.js';
import { TransactionStatusResponse } from './TransactionStatusResponse.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class TransactionStatusRequest extends MessagePayload {
  MessageReference?: MessageReference;

  constructor() {
    super(MessageClass.Service, MessageCategory.TransactionStatus, MessageType.Request);
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new TransactionStatusResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'MessageReference', type: MessageReference as unknown as Newable },
  ];
}

registerPayload('TransactionStatus', 'Request', TransactionStatusRequest as unknown as Newable);
