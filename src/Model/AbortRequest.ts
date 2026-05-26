import { MessagePayload } from './MessagePayload.js';
import { MessageReference } from './MessageReference.js';
import type { Response } from './Response.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class AbortRequest extends MessagePayload {
  MessageReference?: MessageReference;
  AbortReason?: string;

  constructor() {
    super(MessageClass.Service, MessageCategory.Abort, MessageType.Request);
  }

  override createDefaultResponseMessagePayload(_response: Response): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'MessageReference', type: MessageReference as unknown as Newable },
    { name: 'AbortReason' },
  ];
}

registerPayload('Abort', 'Request', AbortRequest as unknown as Newable);
