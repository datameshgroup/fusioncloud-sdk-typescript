import type { FieldSchema, Newable } from '../util/json/schema.js';
import { LoyaltyAccount } from './LoyaltyAccount.js';
import { LoyaltyUnitEnum, type LoyaltyUnit } from './Types.js';

export class LoyaltyAccountStatus {
  LoyaltyAccount?: LoyaltyAccount;
  CurrentBalance?: number;
  LoyaltyUnit?: LoyaltyUnit;
  Currency?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'LoyaltyAccount', type: LoyaltyAccount as unknown as Newable },
    { name: 'CurrentBalance', decimal: true },
    { name: 'LoyaltyUnit', enum: LoyaltyUnitEnum },
    { name: 'Currency' },
  ];
}
