import { MessagePayload } from './MessagePayload.js';
import { Response } from './Response.js';
import { ReconciliationResponse } from './ReconciliationResponse.js';
import {
  ErrorCondition,
  MessageCategory,
  MessageClass,
  MessageType,
  ReconciliationTypeEnum,
  Result,
  type ReconciliationType,
} from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class ReconciliationRequest extends MessagePayload {
  ReconciliationType?: ReconciliationType;
  POIReconciliationID?: string;

  constructor(reconciliationType?: ReconciliationType) {
    super(MessageClass.Service, MessageCategory.Reconciliation, MessageType.Request);
    if (reconciliationType !== undefined) this.ReconciliationType = reconciliationType;
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new ReconciliationResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    if (this.ReconciliationType !== undefined) r.ReconciliationType = this.ReconciliationType;
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ReconciliationType', enum: ReconciliationTypeEnum },
    { name: 'POIReconciliationID' },
  ];
}

registerPayload('Reconciliation', 'Request', ReconciliationRequest as unknown as Newable);
