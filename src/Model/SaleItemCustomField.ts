import type { FieldSchema } from '../util/json/schema.js';
import { SaleItemCustomFieldTypeEnum, type SaleItemCustomFieldType } from './Types.js';

export class SaleItemCustomField {
  Key?: string;
  Type: SaleItemCustomFieldType = 'String';
  Value?: string;

  constructor(key?: string, value?: string) {
    if (key !== undefined) this.Key = key;
    if (value !== undefined) this.Value = value;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Key' },
    { name: 'Type', enum: SaleItemCustomFieldTypeEnum },
    { name: 'Value' },
  ];
}
