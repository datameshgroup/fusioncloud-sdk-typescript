import { MessagePayload } from './MessagePayload.js';
import { DiagnosisResponse } from './DiagnosisResponse.js';
import { Response } from './Response.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class DiagnosisRequest extends MessagePayload {
  POIID?: string;
  HostDiagnosisFlag = false;
  AcquirerID?: string[];

  constructor() {
    super(MessageClass.Service, MessageCategory.Diagnosis, MessageType.Request);
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new DiagnosisResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'POIID' },
    { name: 'HostDiagnosisFlag' },
    { name: 'AcquirerID', isArray: true },
  ];
}

registerPayload('Diagnosis', 'Request', DiagnosisRequest as unknown as Newable);
