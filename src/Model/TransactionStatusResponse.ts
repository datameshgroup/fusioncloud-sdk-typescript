import { MessagePayload } from './MessagePayload.js';
import { MessageReference } from './MessageReference.js';
import { RepeatedMessageResponse } from './RepeatedMessageResponse.js';
import { Response } from './Response.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class TransactionStatusResponse extends MessagePayload {
  Response?: Response;
  MessageReference?: MessageReference;
  RepeatedMessageResponse?: RepeatedMessageResponse;

  constructor() {
    super(MessageClass.Service, MessageCategory.TransactionStatus, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'MessageReference', type: MessageReference as unknown as Newable },
    { name: 'RepeatedMessageResponse', type: RepeatedMessageResponse as unknown as Newable },
  ];
}

registerPayload('TransactionStatus', 'Response', TransactionStatusResponse as unknown as Newable);
