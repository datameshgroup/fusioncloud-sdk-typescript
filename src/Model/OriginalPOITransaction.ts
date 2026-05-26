import type { FieldSchema, Newable } from '../util/json/schema.js';
import { TransactionIdentification } from './TransactionIdentification.js';

export class OriginalPOITransaction {
  SaleID?: string;
  POIID?: string;
  POITransactionID?: TransactionIdentification;
  ReuseCardDataFlag?: boolean;
  ApprovalCode?: string;
  CustomerLanguage?: string;
  AcquirerID?: string;
  AmountValue?: number;
  HostTransactionID?: TransactionIdentification;
  LastTransactionFlag?: boolean;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'SaleID' },
    { name: 'POIID' },
    { name: 'POITransactionID', type: TransactionIdentification as unknown as Newable },
    { name: 'ReuseCardDataFlag' },
    { name: 'ApprovalCode' },
    { name: 'CustomerLanguage' },
    { name: 'AcquirerID' },
    { name: 'AmountValue', decimal: true },
    { name: 'HostTransactionID', type: TransactionIdentification as unknown as Newable },
    { name: 'LastTransactionFlag' },
  ];
}
