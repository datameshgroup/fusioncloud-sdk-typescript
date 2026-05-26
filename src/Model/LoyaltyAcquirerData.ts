import type { FieldSchema, Newable } from '../util/json/schema.js';
import { TransactionIdentification } from './TransactionIdentification.js';

export class LoyaltyAcquirerData {
  LoyaltyAcquirerID?: string;
  ApprovalCode?: string;
  LoyaltyTransactionID?: TransactionIdentification;
  HostReconciliationID?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'LoyaltyAcquirerID' },
    { name: 'ApprovalCode' },
    { name: 'LoyaltyTransactionID', type: TransactionIdentification as unknown as Newable },
    { name: 'HostReconciliationID' },
  ];
}
