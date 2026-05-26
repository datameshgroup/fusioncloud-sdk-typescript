import type { FieldSchema } from '../util/json/schema.js';
import { TransactionTypeEnum, type TransactionType } from './Types.js';

export class PaymentTotals {
  TransactionType?: TransactionType;
  TransactionCount?: number;
  TransactionAmount?: number;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TransactionType', enum: TransactionTypeEnum },
    { name: 'TransactionCount' },
    { name: 'TransactionAmount', decimal: true },
  ];
}
