import type { FieldSchema } from '../util/json/schema.js';

export class TotalFilter {
  POIID?: string;
  SaleID?: string;
  OperatorID?: string;
  ShiftNumber?: string;
  TotalsGroupID?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'POIID' },
    { name: 'SaleID' },
    { name: 'OperatorID' },
    { name: 'ShiftNumber' },
    { name: 'TotalsGroupID' },
  ];
}
