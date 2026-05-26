import { MessagePayload } from './MessagePayload.js';
import { PaymentReceipt } from './PaymentReceipt.js';
import { POIData } from './POIData.js';
import { Response } from './Response.js';
import { SaleData } from './SaleData.js';
import { StoredValueResult } from './StoredValueResult.js';
import { DocumentQualifier, MessageCategory, MessageClass, MessageType, type DocumentQualifier as DocumentQualifierT } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class StoredValueResponse extends MessagePayload {
  Response?: Response;
  SaleData?: SaleData;
  POIData?: POIData;
  StoredValueResult?: StoredValueResult[];
  PaymentReceipt?: PaymentReceipt[];

  constructor() {
    super(MessageClass.Service, MessageCategory.StoredValue, MessageType.Response);
  }

  get storedValueResultItem(): StoredValueResult | undefined {
    return this.StoredValueResult?.[0];
  }

  getReceiptAsPlainText(documentQualifier: DocumentQualifierT = DocumentQualifier.SaleReceipt): string | null {
    const r =
      this.PaymentReceipt?.find((x) => x.DocumentQualifier === documentQualifier) ??
      this.PaymentReceipt?.find((x) => x.DocumentQualifier === DocumentQualifier.CustomerReceipt);
    return r?.OutputContent?.getContentAsPlainText() ?? null;
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'SaleData', type: SaleData as unknown as Newable },
    { name: 'POIData', type: POIData as unknown as Newable },
    { name: 'StoredValueResult', isArray: true, type: StoredValueResult as unknown as Newable },
    { name: 'PaymentReceipt', isArray: true, type: PaymentReceipt as unknown as Newable },
  ];
}

registerPayload('StoredValue', 'Response', StoredValueResponse as unknown as Newable);
