import { MessagePayload } from './MessagePayload.js';
import { Response } from './Response.js';
import { TransactionTotals } from './TransactionTotals.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class GetTotalsResponse extends MessagePayload {
  Response?: Response;
  POIReconciliationID?: string;
  TransactionTotals?: TransactionTotals[];

  constructor() {
    super(MessageClass.Service, MessageCategory.GetTotals, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'POIReconciliationID' },
    { name: 'TransactionTotals', isArray: true, type: TransactionTotals as unknown as Newable },
  ];
}

registerPayload('GetTotals', 'Response', GetTotalsResponse as unknown as Newable);
