import type { FieldSchema } from '../util/json/schema.js';
import { CurrencySymbol, CurrencySymbolEnum, type CurrencySymbol as CurrencySymbolT } from './Types.js';

export class AmountsReq {
  Currency: CurrencySymbolT = CurrencySymbol.AUD;
  RequestedAmount?: number;
  CashBackAmount?: number;
  TipAmount?: number;
  SurchargeAmount?: number;
  PaidAmount?: number;
  MinimumAmountDeliver?: number;
  MaximumCashBackAmount?: number;
  MinimumSplitAmount?: number;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Currency', enum: CurrencySymbolEnum },
    { name: 'RequestedAmount', decimal: true },
    { name: 'CashBackAmount', decimal: true },
    { name: 'TipAmount', decimal: true },
    { name: 'SurchargeAmount', decimal: true },
    { name: 'PaidAmount', decimal: true },
    { name: 'MinimumAmountDeliver', decimal: true },
    { name: 'MaximumCashBackAmount', decimal: true },
    { name: 'MinimumSplitAmount', decimal: true },
  ];
}
