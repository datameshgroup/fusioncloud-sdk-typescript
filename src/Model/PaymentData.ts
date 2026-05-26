import type { FieldSchema, Newable } from '../util/json/schema.js';
import { PaymentInstrumentData } from './PaymentInstrumentData.js';
import { TransactionIdentification } from './TransactionIdentification.js';
import { PaymentType, PaymentTypeEnum, type PaymentType as PaymentTypeT } from './Types.js';

export class PaymentData {
  PaymentType: PaymentTypeT = PaymentType.Normal;
  SplitPaymentFlag?: boolean;
  CardAcquisitionReference?: TransactionIdentification;
  RequestedValidityDate?: string;
  PaymentInstrumentData?: PaymentInstrumentData;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PaymentType', enum: PaymentTypeEnum },
    { name: 'SplitPaymentFlag' },
    { name: 'CardAcquisitionReference', type: TransactionIdentification as unknown as Newable },
    { name: 'RequestedValidityDate' },
    { name: 'PaymentInstrumentData', type: PaymentInstrumentData as unknown as Newable },
  ];
}
