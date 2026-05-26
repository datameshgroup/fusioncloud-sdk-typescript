import type { FieldSchema, Newable } from '../util/json/schema.js';
import { CashHandlingDevice } from './CashHandlingDevice.js';
import { GlobalStatusEnum, PrinterStatusEnum, type GlobalStatus, type PrinterStatus } from './Types.js';

export class POIStatus {
  GlobalStatus?: GlobalStatus;
  SecurityOKFlag?: boolean;
  PEDOKFlag?: boolean;
  CardReaderOKFlag?: boolean;
  PrinterStatus?: PrinterStatus;
  CommunicationOKFlag?: boolean;
  CashHandlingDevice?: CashHandlingDevice;
  FraudPreventionFlag?: boolean;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'GlobalStatus', enum: GlobalStatusEnum },
    { name: 'SecurityOKFlag' },
    { name: 'PEDOKFlag' },
    { name: 'CardReaderOKFlag' },
    { name: 'PrinterStatus', enum: PrinterStatusEnum },
    { name: 'CommunicationOKFlag' },
    { name: 'CashHandlingDevice', type: CashHandlingDevice as unknown as Newable },
    { name: 'FraudPreventionFlag' },
  ];
}
