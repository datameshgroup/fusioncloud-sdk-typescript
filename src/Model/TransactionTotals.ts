import type { FieldSchema, Newable } from '../util/json/schema.js';
import { PaymentTotals } from './PaymentTotals.js';
import { PaymentInstrumentTypeEnum, type PaymentInstrumentType } from './Types.js';

export class TransactionTotals {
  PaymentInstrumentType?: PaymentInstrumentType;
  AcquirerID?: string;
  ErrorCondition?: string;
  HostReconciliationID?: string;
  CardBrand?: string;
  POIID?: string;
  SaleID?: string;
  OperatorID?: string;
  ShiftNumber?: string;
  TotalsGroupID?: string;
  PaymentCurrency?: string;
  PaymentTotals?: PaymentTotals[];

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PaymentInstrumentType', enum: PaymentInstrumentTypeEnum },
    { name: 'AcquirerID' },
    { name: 'ErrorCondition' },
    { name: 'HostReconciliationID' },
    { name: 'CardBrand' },
    { name: 'POIID' },
    { name: 'SaleID' },
    { name: 'OperatorID' },
    { name: 'ShiftNumber' },
    { name: 'TotalsGroupID' },
    { name: 'PaymentCurrency' },
    { name: 'PaymentTotals', isArray: true, type: PaymentTotals as unknown as Newable },
  ];
}
