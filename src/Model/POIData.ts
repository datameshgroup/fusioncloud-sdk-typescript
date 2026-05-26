import type { FieldSchema, Newable } from '../util/json/schema.js';
import { TransactionIdentification } from './TransactionIdentification.js';

export class POIData {
  POITransactionID?: TransactionIdentification;
  POIReconciliationID?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'POITransactionID', type: TransactionIdentification as unknown as Newable },
    { name: 'POIReconciliationID' },
  ];
}
