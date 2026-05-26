import type { FieldSchema, Newable } from '../util/json/schema.js';
import { LoyaltyAccountID } from './LoyaltyAccountID.js';
import { TransactionIdentification } from './TransactionIdentification.js';

export class LoyaltyAccountReq {
  CardAcquisitionReference?: TransactionIdentification;
  LoyaltyAccountID?: LoyaltyAccountID;

  constructor(loyaltyAccountID?: LoyaltyAccountID) {
    if (loyaltyAccountID !== undefined) this.LoyaltyAccountID = loyaltyAccountID;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'CardAcquisitionReference', type: TransactionIdentification as unknown as Newable },
    { name: 'LoyaltyAccountID', type: LoyaltyAccountID as unknown as Newable },
  ];
}
