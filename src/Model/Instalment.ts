import type { FieldSchema } from '../util/json/schema.js';
import { InstalmentTypeEnum, PeriodUnitEnum, type InstalmentType, type PeriodUnit } from './Types.js';

export class Instalment {
  InstalmentType?: InstalmentType[];
  SequenceNumber?: string;
  PlanID?: string;
  Period?: string;
  PeriodUnit?: PeriodUnit;
  FirstPaymentDate?: string;
  TotalNbOfPayments?: string;
  CumulativeAmount?: number;
  FirstAmount?: number;
  Charges?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'InstalmentType', isArray: true, enum: InstalmentTypeEnum },
    { name: 'SequenceNumber' },
    { name: 'PlanID' },
    { name: 'Period' },
    { name: 'PeriodUnit', enum: PeriodUnitEnum },
    { name: 'FirstPaymentDate' },
    { name: 'TotalNbOfPayments' },
    { name: 'CumulativeAmount', decimal: true },
    { name: 'FirstAmount', decimal: true },
    { name: 'Charges' },
  ];
}
