import type { FieldSchema } from '../util/json/schema.js';

export class AdditionalAmount {
  Name?: string;
  Value?: number;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Name' },
    { name: 'Value', decimal: true },
  ];
}
