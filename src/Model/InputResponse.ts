import { MessagePayload } from './MessagePayload.js';
import { InputResult } from './InputResult.js';
import { OutputResult } from './OutputResult.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class InputResponse extends MessagePayload {
  OutputResult?: OutputResult;
  InputResult?: InputResult;

  constructor() {
    super(MessageClass.Device, MessageCategory.Input, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'OutputResult', type: OutputResult as unknown as Newable },
    { name: 'InputResult', type: InputResult as unknown as Newable },
  ];
}

registerPayload('Input', 'Response', InputResponse as unknown as Newable);
