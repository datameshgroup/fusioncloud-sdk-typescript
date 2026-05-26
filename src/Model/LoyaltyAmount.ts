import type { FieldSchema } from '../util/json/schema.js';
import {
  CurrencySymbol,
  CurrencySymbolEnum,
  LoyaltyUnitEnum,
  type CurrencySymbol as CurrencySymbolT,
  type LoyaltyUnit,
} from './Types.js';

export class LoyaltyAmount {
  LoyaltyUnit?: LoyaltyUnit;
  Currency: CurrencySymbolT | null = CurrencySymbol.AUD;
  AmountValue = 0;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'LoyaltyUnit', enum: LoyaltyUnitEnum, nullableEnum: true },
    { name: 'Currency', enum: CurrencySymbolEnum, nullableEnum: true },
    { name: 'AmountValue', decimal: true },
  ];
}
