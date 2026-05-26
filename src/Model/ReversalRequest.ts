import { MessagePayload } from './MessagePayload.js';
import { OriginalPOITransaction } from './OriginalPOITransaction.js';
import { PaymentData } from './PaymentData.js';
import { Response } from './Response.js';
import { ReversalResponse } from './ReversalResponse.js';
import { SaleData } from './SaleData.js';
import { TransactionIdentification } from './TransactionIdentification.js';
import {
  ErrorCondition,
  MessageCategory,
  MessageClass,
  MessageType,
  ReversalReasonEnum,
  Result,
  type ReversalReason,
} from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class ReversalRequest extends MessagePayload {
  SaleData?: SaleData;
  PaymentData?: PaymentData;
  OriginalPOITransaction?: OriginalPOITransaction;
  ReversalReason?: ReversalReason;
  ReversedAmount?: number;

  constructor(reversalReason?: ReversalReason, poiTransactionID?: TransactionIdentification) {
    super(MessageClass.Service, MessageCategory.Reversal, MessageType.Request);
    if (reversalReason !== undefined) this.ReversalReason = reversalReason;
    if (poiTransactionID !== undefined) {
      this.OriginalPOITransaction = new OriginalPOITransaction();
      this.OriginalPOITransaction.POITransactionID = poiTransactionID;
    }
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new ReversalResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    if (this.ReversedAmount !== undefined) r.ReversedAmount = this.ReversedAmount;
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'SaleData', type: SaleData as unknown as Newable },
    { name: 'PaymentData', type: PaymentData as unknown as Newable },
    { name: 'OriginalPOITransaction', type: OriginalPOITransaction as unknown as Newable },
    { name: 'ReversalReason', enum: ReversalReasonEnum },
    { name: 'ReversedAmount', decimal: true },
  ];
}

registerPayload('Reversal', 'Request', ReversalRequest as unknown as Newable);
