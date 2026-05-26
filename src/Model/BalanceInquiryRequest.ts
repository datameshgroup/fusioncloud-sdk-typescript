import { MessagePayload } from './MessagePayload.js';
import { BalanceInquiryResponse } from './BalanceInquiryResponse.js';
import { LoyaltyAccountReq } from './LoyaltyAccountReq.js';
import { PaymentAccountReq } from './PaymentAccountReq.js';
import { Response } from './Response.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class BalanceInquiryRequest extends MessagePayload {
  PaymentAccountReq?: PaymentAccountReq;
  LoyaltyAccountReq?: LoyaltyAccountReq;

  constructor(init?: { paymentAccountReq?: PaymentAccountReq; loyaltyAccountReq?: LoyaltyAccountReq }) {
    super(MessageClass.Service, MessageCategory.BalanceInquiry, MessageType.Request);
    if (init?.paymentAccountReq) this.PaymentAccountReq = init.paymentAccountReq;
    if (init?.loyaltyAccountReq) this.LoyaltyAccountReq = init.loyaltyAccountReq;
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new BalanceInquiryResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PaymentAccountReq', type: PaymentAccountReq as unknown as Newable },
    { name: 'LoyaltyAccountReq', type: LoyaltyAccountReq as unknown as Newable },
  ];
}

registerPayload('BalanceInquiry', 'Request', BalanceInquiryRequest as unknown as Newable);
