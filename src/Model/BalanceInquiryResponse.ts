import { MessagePayload } from './MessagePayload.js';
import { LoyaltyAccountStatus } from './LoyaltyAccountStatus.js';
import { PaymentAccountStatus } from './PaymentAccountStatus.js';
import { PaymentReceipt } from './PaymentReceipt.js';
import { Response } from './Response.js';
import { DocumentQualifier, MessageCategory, MessageClass, MessageType, type DocumentQualifier as DocumentQualifierT } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class BalanceInquiryResponse extends MessagePayload {
  Response?: Response;
  PaymentAccountStatus?: PaymentAccountStatus;
  LoyaltyAccountStatus?: LoyaltyAccountStatus;
  PaymentReceipt?: PaymentReceipt[];

  constructor() {
    super(MessageClass.Service, MessageCategory.BalanceInquiry, MessageType.Response);
  }

  getReceiptAsPlainText(documentQualifier: DocumentQualifierT = DocumentQualifier.SaleReceipt): string | null {
    const r =
      this.PaymentReceipt?.find((x) => x.DocumentQualifier === documentQualifier) ??
      this.PaymentReceipt?.find((x) => x.DocumentQualifier === DocumentQualifier.CustomerReceipt);
    return r?.OutputContent?.getContentAsPlainText() ?? null;
  }

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
    { name: 'PaymentAccountStatus', type: PaymentAccountStatus as unknown as Newable },
    { name: 'LoyaltyAccountStatus', type: LoyaltyAccountStatus as unknown as Newable },
    { name: 'PaymentReceipt', isArray: true, type: PaymentReceipt as unknown as Newable },
  ];
}

registerPayload('BalanceInquiry', 'Response', BalanceInquiryResponse as unknown as Newable);
