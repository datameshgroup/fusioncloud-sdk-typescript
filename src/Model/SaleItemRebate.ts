import type { FieldSchema } from '../util/json/schema.js';
import { UnitOfMeasureEnum, type UnitOfMeasure } from './Types.js';

export class SaleItemRebate {
  ItemID = 0;
  ProductCode?: string;
  EanUpc?: string;
  UnitOfMeasure?: UnitOfMeasure;
  Quantity = 0;
  ItemAmount = 0;
  RebateLabel?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ItemID' },
    { name: 'ProductCode' },
    { name: 'EanUpc' },
    { name: 'UnitOfMeasure', enum: UnitOfMeasureEnum },
    { name: 'Quantity', decimal: true },
    { name: 'ItemAmount', decimal: true },
    { name: 'RebateLabel' },
  ];
}
