import type { FieldSchema, Newable } from '../util/json/schema.js';
import { SaleItemRebate } from './SaleItemRebate.js';

export class Rebates {
  TotalRebate?: number;
  RebateLabel?: string;
  SaleItemRebate?: SaleItemRebate[];

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TotalRebate', decimal: true },
    { name: 'RebateLabel' },
    { name: 'SaleItemRebate', isArray: true, type: SaleItemRebate as unknown as Newable },
  ];
}
