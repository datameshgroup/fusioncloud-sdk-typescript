import type { FieldSchema } from '../util/json/schema.js';
import { StoredValueTransactionTypeEnum, type StoredValueTransactionType } from './Types.js';

/** Base class for StoredValueData (request side) and StoredValueResult (response side). */
export class StoredValueInformation {
  StoredValueTransactionType: StoredValueTransactionType = 'Reserve';
  ProductCode?: string;
  EanUpc?: string;
  ItemAmount?: number;
  TotalFeesAmount?: number;
  Currency?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'StoredValueTransactionType', enum: StoredValueTransactionTypeEnum },
    { name: 'ProductCode' },
    { name: 'EanUpc' },
    { name: 'ItemAmount', decimal: true },
    { name: 'TotalFeesAmount', decimal: true },
    { name: 'Currency' },
  ];
}
