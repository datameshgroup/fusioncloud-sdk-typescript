import type { FieldSchema, Newable } from '../util/json/schema.js';
import { AdditionalAmount } from './AdditionalAmount.js';
import {
  CurrencySymbol,
  CurrencySymbolEnum,
  type CurrencySymbol as CurrencySymbolT,
} from './Types.js';

export class AmountsResp {
  Currency: CurrencySymbolT | null = CurrencySymbol.AUD;
  AuthorizedAmount?: number;
  TotalRebatesAmount?: number;
  TotalFeesAmount?: number;
  CashBackAmount?: number;
  TipAmount?: number;
  SurchargeAmount?: number;
  RequestedAmount?: number;
  PartialAuthorizedAmount?: number;
  TotalAdditionalAmount?: number;
  AdditionalAmounts?: AdditionalAmount[];

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Currency', enum: CurrencySymbolEnum, nullableEnum: true },
    { name: 'AuthorizedAmount', decimal: true },
    { name: 'TotalRebatesAmount', decimal: true },
    { name: 'TotalFeesAmount', decimal: true },
    { name: 'CashBackAmount', decimal: true },
    { name: 'TipAmount', decimal: true },
    { name: 'SurchargeAmount', decimal: true },
    { name: 'RequestedAmount', decimal: true },
    { name: 'PartialAuthorizedAmount', decimal: true },
    { name: 'TotalAdditionalAmount', decimal: true },
    { name: 'AdditionalAmounts', isArray: true, type: AdditionalAmount as unknown as Newable },
  ];
}
