import type { FieldSchema, Newable } from '../util/json/schema.js';
import { AmountType } from './AmountType.js';

export class CurrencyConversion {
  CustomerApprovedFlag?: boolean;
  ConvertedAmount?: AmountType;
  Rate?: string;
  Markup?: string;
  Commission?: string;
  Declaration?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'CustomerApprovedFlag' },
    { name: 'ConvertedAmount', type: AmountType as unknown as Newable },
    { name: 'Rate' },
    { name: 'Markup' },
    { name: 'Commission' },
    { name: 'Declaration' },
  ];
}
