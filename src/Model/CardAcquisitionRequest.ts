import { MessagePayload } from './MessagePayload.js';
import { CardAcquisitionResponse } from './CardAcquisitionResponse.js';
import { CardAcquisitionTransaction } from './CardAcquisitionTransaction.js';
import { Response } from './Response.js';
import { SaleData } from './SaleData.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class CardAcquisitionRequest extends MessagePayload {
  SaleData?: SaleData;
  CardAcquisitionTransaction?: CardAcquisitionTransaction;

  constructor() {
    super(MessageClass.Service, MessageCategory.CardAcquisition, MessageType.Request);
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new CardAcquisitionResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'SaleData', type: SaleData as unknown as Newable },
    { name: 'CardAcquisitionTransaction', type: CardAcquisitionTransaction as unknown as Newable },
  ];
}

registerPayload('CardAcquisition', 'Request', CardAcquisitionRequest as unknown as Newable);
