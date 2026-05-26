import type { FieldSchema, Newable } from '../util/json/schema.js';
import { TransactionIdentification } from './TransactionIdentification.js';

export class PaymentAcquirerData {
  AcquirerID?: string;
  MerchantID?: string;
  AcquirerPOIID?: string;
  AcquirerTransactionID?: TransactionIdentification;
  ApprovalCode?: string;
  ResponseCode?: string;
  RRN?: string;
  STAN?: string;
  HostReconciliationID?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'AcquirerID' },
    { name: 'MerchantID' },
    { name: 'AcquirerPOIID' },
    { name: 'AcquirerTransactionID', type: TransactionIdentification as unknown as Newable },
    { name: 'ApprovalCode' },
    { name: 'ResponseCode' },
    { name: 'RRN' },
    { name: 'STAN' },
    { name: 'HostReconciliationID' },
  ];
}
