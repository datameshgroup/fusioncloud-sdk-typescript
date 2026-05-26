import type { FieldSchema, Newable } from '../util/json/schema.js';
import { AmountsReq } from './AmountsReq.js';
import { OriginalPOITransaction } from './OriginalPOITransaction.js';
import { SaleItem } from './SaleItem.js';
import { TransactionConditions } from './TransactionConditions.js';

export class PaymentTransaction {
  AmountsReq?: AmountsReq;
  OriginalPOITransaction?: OriginalPOITransaction;
  TransactionConditions?: TransactionConditions;
  SaleItem?: SaleItem[];

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'AmountsReq', type: AmountsReq as unknown as Newable },
    { name: 'OriginalPOITransaction', type: OriginalPOITransaction as unknown as Newable },
    { name: 'TransactionConditions', type: TransactionConditions as unknown as Newable },
    { name: 'SaleItem', isArray: true, type: SaleItem as unknown as Newable },
  ];
}
