import type { FieldSchema, Newable } from '../util/json/schema.js';
import { CoinsOrBills } from './CoinsOrBills.js';

export class CashHandlingDevice {
  CashHandlingOKFlag?: boolean;
  Currency?: string;
  CoinsOrBills?: CoinsOrBills;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'CashHandlingOKFlag' },
    { name: 'Currency' },
    { name: 'CoinsOrBills', type: CoinsOrBills as unknown as Newable },
  ];
}
