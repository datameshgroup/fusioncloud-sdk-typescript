import type { FieldSchema } from '../util/json/schema.js';

export class CustomerOrder {
  CustomerOrderID?: string;
  SaleReferenceId?: string;
  OpenOrderState?: boolean;
  StartDate?: string;
  EndDate?: string;
  ForecastedAmount?: number;
  CurrentAmount?: number;
  Currency?: string;
  AccessedBy?: string;
  AdditionalInformation?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'CustomerOrderID' },
    { name: 'SaleReferenceId' },
    { name: 'OpenOrderState' },
    { name: 'StartDate' },
    { name: 'EndDate' },
    { name: 'ForecastedAmount', decimal: true },
    { name: 'CurrentAmount', decimal: true },
    { name: 'Currency' },
    { name: 'AccessedBy' },
    { name: 'AdditionalInformation' },
  ];
}
