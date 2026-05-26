import { MessagePayload } from './MessagePayload.js';
import { GetTotalsResponse } from './GetTotalsResponse.js';
import { Response } from './Response.js';
import { TotalFilter } from './TotalFilter.js';
import {
  ErrorCondition,
  MessageCategory,
  MessageClass,
  MessageType,
  Result,
  TotalDetailEnum,
  type TotalDetail,
} from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class GetTotalsRequest extends MessagePayload {
  TotalDetails: TotalDetail[] = [];
  TotalFilter: TotalFilter = new TotalFilter();

  constructor() {
    super(MessageClass.Service, MessageCategory.GetTotals, MessageType.Request);
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new GetTotalsResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TotalDetails', isArray: true, enum: TotalDetailEnum },
    { name: 'TotalFilter', type: TotalFilter as unknown as Newable },
  ];
}

registerPayload('GetTotals', 'Request', GetTotalsRequest as unknown as Newable);
