import { MessagePayload } from './MessagePayload.js';
import { HostStatus } from './HostStatus.js';
import { POIStatus } from './POIStatus.js';
import { Response } from './Response.js';
import { ResponseExtensionData } from './ResponseExtensionData.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class DiagnosisResponse extends MessagePayload {
  Response?: Response;
  LoggedSaleID?: string[];
  POIStatus?: POIStatus;
  HostStatus?: HostStatus[];
  ExtensionData?: ResponseExtensionData;

  constructor() {
    super(MessageClass.Service, MessageCategory.Diagnosis, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'LoggedSaleID', isArray: true },
    { name: 'POIStatus', type: POIStatus as unknown as Newable },
    { name: 'HostStatus', isArray: true, type: HostStatus as unknown as Newable },
    { name: 'ExtensionData', type: ResponseExtensionData as unknown as Newable },
  ];
}

registerPayload('Diagnosis', 'Response', DiagnosisResponse as unknown as Newable);
