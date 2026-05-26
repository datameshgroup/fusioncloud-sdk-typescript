import { MessagePayload } from './MessagePayload.js';
import { Response } from './Response.js';
import { TransactionTotals } from './TransactionTotals.js';
import {
  MessageCategory,
  MessageClass,
  MessageType,
  ReconciliationTypeEnum,
  type ReconciliationType,
} from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class ReconciliationResponse extends MessagePayload {
  Response?: Response;
  ReconciliationType?: ReconciliationType;
  POIReconciliationID?: string;
  TransactionTotals?: TransactionTotals[];
  TID?: string;
  MID?: string;
  AcquirerID?: string;
  LastShiftTotalTime?: Date;

  constructor() {
    super(MessageClass.Service, MessageCategory.Reconciliation, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'ReconciliationType', enum: ReconciliationTypeEnum },
    { name: 'POIReconciliationID' },
    { name: 'TransactionTotals', isArray: true, type: TransactionTotals as unknown as Newable },
    { name: 'TID' },
    { name: 'MID' },
    { name: 'AcquirerID' },
    { name: 'LastShiftTotalTime', date: 'iso' },
  ];
}

registerPayload('Reconciliation', 'Response', ReconciliationResponse as unknown as Newable);
