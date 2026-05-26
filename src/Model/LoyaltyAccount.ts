import type { FieldSchema, Newable } from '../util/json/schema.js';
import { LoyaltyAccountID } from './LoyaltyAccountID.js';
import { LoyaltyBrandEnum, type LoyaltyBrand } from './Types.js';

export class LoyaltyAccount {
  LoyaltyAccountID?: LoyaltyAccountID;
  LoyaltyBrand?: LoyaltyBrand;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'LoyaltyAccountID', type: LoyaltyAccountID as unknown as Newable },
    { name: 'LoyaltyBrand', enum: LoyaltyBrandEnum },
  ];
}
