import { MessagePayload } from './MessagePayload.js';
import { POIData } from './POIData.js';
import { Response } from './Response.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class ReversalResponse extends MessagePayload {
  Response?: Response;
  POIData?: POIData;
  ReversedAmount?: number;

  constructor() {
    super(MessageClass.Service, MessageCategory.Reversal, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'POIData', type: POIData as unknown as Newable },
    { name: 'ReversedAmount', decimal: true },
  ];
}

registerPayload('Reversal', 'Response', ReversalResponse as unknown as Newable);
