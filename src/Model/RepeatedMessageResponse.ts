import type { FieldSchema, Newable } from '../util/json/schema.js';
import { MessageHeader } from './MessageHeader.js';
import { RepeatedResponseMessageBody } from './RepeatedResponseMessageBody.js';

export class RepeatedMessageResponse {
  MessageHeader?: MessageHeader;
  RepeatedResponseMessageBody?: RepeatedResponseMessageBody;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'MessageHeader', type: MessageHeader as unknown as Newable },
    { name: 'RepeatedResponseMessageBody', type: RepeatedResponseMessageBody as unknown as Newable },
  ];
}
