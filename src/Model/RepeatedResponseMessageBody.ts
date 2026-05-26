import type { FieldSchema, Newable } from '../util/json/schema.js';
import { BalanceInquiryResponse } from './BalanceInquiryResponse.js';
import { PaymentResponse } from './PaymentResponse.js';
import { StoredValueResponse } from './StoredValueResponse.js';

export class RepeatedResponseMessageBody {
  PaymentResponse?: PaymentResponse;
  StoredValueResponse?: StoredValueResponse;
  BalanceInquiryResponse?: BalanceInquiryResponse;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PaymentResponse', type: PaymentResponse as unknown as Newable },
    { name: 'StoredValueResponse', type: StoredValueResponse as unknown as Newable },
    { name: 'BalanceInquiryResponse', type: BalanceInquiryResponse as unknown as Newable },
  ];
}
