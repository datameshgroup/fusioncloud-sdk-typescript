import type { FieldSchema } from '../util/json/schema.js';

export class AmountType {
  AmountValue?: number;
  Currency?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'AmountValue', decimal: true },
    { name: 'Currency' },
  ];
}
