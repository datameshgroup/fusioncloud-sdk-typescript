import type { FieldSchema, Newable } from '../util/json/schema.js';
import { LoyaltyAccount } from './LoyaltyAccount.js';
import { LoyaltyAcquirerData } from './LoyaltyAcquirerData.js';
import { LoyaltyAmount } from './LoyaltyAmount.js';
import { Rebates } from './Rebates.js';

export class LoyaltyResult {
  LoyaltyAccount?: LoyaltyAccount;
  CurrentBalance?: number;
  LoyaltyAmount?: LoyaltyAmount;
  LoyaltyAcquirerData?: LoyaltyAcquirerData;
  Rebates?: Rebates;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'LoyaltyAccount', type: LoyaltyAccount as unknown as Newable },
    { name: 'CurrentBalance', decimal: true },
    { name: 'LoyaltyAmount', type: LoyaltyAmount as unknown as Newable },
    { name: 'LoyaltyAcquirerData', type: LoyaltyAcquirerData as unknown as Newable },
    { name: 'Rebates', type: Rebates as unknown as Newable },
  ];
}
