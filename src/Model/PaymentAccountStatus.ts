import type { FieldSchema, Newable } from '../util/json/schema.js';
import { PaymentAcquirerData } from './PaymentAcquirerData.js';
import { PaymentInstrumentData } from './PaymentInstrumentData.js';

export class PaymentAccountStatus {
  PaymentInstrumentData?: PaymentInstrumentData;
  Currency?: string;
  CurrentBalance?: number;
  PaymentAcquirerData?: PaymentAcquirerData;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PaymentInstrumentData', type: PaymentInstrumentData as unknown as Newable },
    { name: 'Currency' },
    { name: 'CurrentBalance', decimal: true },
    { name: 'PaymentAcquirerData', type: PaymentAcquirerData as unknown as Newable },
  ];
}
