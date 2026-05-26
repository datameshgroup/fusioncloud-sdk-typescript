import { MessagePayload } from './MessagePayload.js';
import { CustomerOrder } from './CustomerOrder.js';
import { ExtensionData } from './ExtensionData.js';
import { LoyaltyResult } from './LoyaltyResult.js';
import { PaymentReceipt } from './PaymentReceipt.js';
import { PaymentResult } from './PaymentResult.js';
import { POIData } from './POIData.js';
import { Response } from './Response.js';
import { SaleData } from './SaleData.js';
import { DocumentQualifier, MessageCategory, MessageClass, MessageType, type DocumentQualifier as DocumentQualifierT } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class PaymentResponse extends MessagePayload {
  Response?: Response;
  SaleData?: SaleData;
  POIData?: POIData;
  PaymentResult?: PaymentResult;
  LoyaltyResult?: LoyaltyResult[];
  PaymentReceipt?: PaymentReceipt[];
  CustomerOrder?: CustomerOrder;
  AllowedProductCode?: string[];
  ExtensionData?: ExtensionData;

  constructor() {
    super(MessageClass.Service, MessageCategory.Payment, MessageType.Response);
  }

  /**
   * Get a plain text version of the specified receipt type. Falls back to
   * `CustomerReceipt` if the requested qualifier isn't present. Matches the
   * C# helper.
   */
  getReceiptAsPlainText(documentQualifier: DocumentQualifierT = DocumentQualifier.SaleReceipt): string | null {
    const receipt =
      this.PaymentReceipt?.find((r) => r.DocumentQualifier === documentQualifier) ??
      this.PaymentReceipt?.find((r) => r.DocumentQualifier === DocumentQualifier.CustomerReceipt);
    return receipt?.OutputContent?.getContentAsPlainText() ?? null;
  }

  /**
   * Legacy support: rewrite a single CustomerReceipt entry to SaleReceipt and
   * drop everything else.
   */
  mapReceiptsToSaleReceipt(): void {
    if (!this.PaymentReceipt) return;
    const r = this.PaymentReceipt.find((x) => x?.DocumentQualifier === DocumentQualifier.CustomerReceipt);
    if (!r) return;
    r.DocumentQualifier = DocumentQualifier.SaleReceipt;
    this.PaymentReceipt.length = 0;
    this.PaymentReceipt.push(r);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'SaleData', type: SaleData as unknown as Newable },
    { name: 'POIData', type: POIData as unknown as Newable },
    { name: 'PaymentResult', type: PaymentResult as unknown as Newable },
    { name: 'LoyaltyResult', isArray: true, type: LoyaltyResult as unknown as Newable },
    { name: 'PaymentReceipt', isArray: true, type: PaymentReceipt as unknown as Newable },
    { name: 'CustomerOrder', type: CustomerOrder as unknown as Newable },
    { name: 'AllowedProductCode', isArray: true },
    { name: 'ExtensionData', type: ExtensionData as unknown as Newable },
  ];
}

registerPayload('Payment', 'Response', PaymentResponse as unknown as Newable);
