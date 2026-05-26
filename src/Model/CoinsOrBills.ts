import type { FieldSchema } from '../util/json/schema.js';

export class CoinsOrBills {
  UnitValue?: string;
  Number?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'UnitValue' },
    { name: 'Number' },
  ];
}
