import { MessagePayload } from './MessagePayload.js';
import { AmountsReq } from './AmountsReq.js';
import { CardData } from './CardData.js';
import { ExtensionData } from './ExtensionData.js';
import { PaymentData } from './PaymentData.js';
import { PaymentInstrumentData } from './PaymentInstrumentData.js';
import { PaymentReceipt } from './PaymentReceipt.js';
import { PaymentResponse } from './PaymentResponse.js';
import { PaymentResult } from './PaymentResult.js';
import { PaymentTransaction } from './PaymentTransaction.js';
import { Response } from './Response.js';
import { SaleData } from './SaleData.js';
import { SaleItem } from './SaleItem.js';
import { TransactionIdentification } from './TransactionIdentification.js';
import {
  ErrorCondition,
  MessageCategory,
  MessageClass,
  MessageType,
  PaymentType,
  Result,
  type PaymentType as PaymentTypeT,
  type UnitOfMeasure,
  type WeightUnitOfMeasure,
} from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';
import type { SaleItemCustomField } from './SaleItemCustomField.js';

export interface AddSaleItemOptions {
  productCode?: string;
  productLabel?: string;
  itemAmount?: number;
  quantity?: number;
  unitOfMeasure?: UnitOfMeasure;
  itemID?: number;
  parentItemID?: number;
  eanUpc?: string;
  additionalProductInfo?: string;
  unitPrice?: number;
  taxCode?: string;
  saleChannel?: string;
  costBase?: number;
  discount?: number;
  discountReason?: string;
  category?: string;
  subCategory?: string;
  categories?: string[];
  brand?: string;
  quantityInStock?: number;
  restricted?: boolean;
  pageURL?: string;
  imageURLs?: string[];
  style?: string;
  size?: string;
  colour?: string;
  weight?: number;
  weightUnitOfMeasure?: WeightUnitOfMeasure;
  tags?: string[];
  customFields?: SaleItemCustomField[];
}

export class PaymentRequest extends MessagePayload {
  SaleData?: SaleData;
  PaymentTransaction?: PaymentTransaction;
  PaymentData?: PaymentData;
  PaymentReceipt?: PaymentReceipt[];
  ExtensionData?: ExtensionData;

  /**
   * Construct a request with the parameters most callers need: a
   * `transactionID` (becomes `SaleData.SaleTransactionID.TransactionID`) and
   * `requestedAmount`. Mirrors the C# convenience constructor.
   */
  constructor(transactionID?: string, requestedAmount?: number, saleItems?: SaleItem[], paymentType: PaymentTypeT = PaymentType.Normal) {
    super(MessageClass.Service, MessageCategory.Payment, MessageType.Request);
    if (transactionID === undefined && requestedAmount === undefined) return;

    this.SaleData = new SaleData();
    if (transactionID !== undefined) {
      this.SaleData.SaleTransactionID = new TransactionIdentification(transactionID);
    }

    this.PaymentTransaction = new PaymentTransaction();
    this.PaymentTransaction.AmountsReq = new AmountsReq();
    if (requestedAmount !== undefined) {
      this.PaymentTransaction.AmountsReq.RequestedAmount = requestedAmount;
    }
    this.PaymentTransaction.SaleItem = saleItems ?? [];

    this.PaymentData = new PaymentData();
    this.PaymentData.PaymentType = paymentType;
  }

  /** Add a SaleItem to `PaymentTransaction.SaleItem`. Mirrors C# helper. */
  addSaleItem(opts: AddSaleItemOptions): SaleItem {
    if (!this.PaymentTransaction) {
      throw new Error('Unable to access SaleItem array as PaymentTransaction == null');
    }
    this.PaymentTransaction.SaleItem ??= [];

    const item = new SaleItem();
    item.ItemID = opts.itemID ?? this.PaymentTransaction.SaleItem.length;
    if (opts.parentItemID !== undefined) item.ParentItemID = opts.parentItemID;
    if (opts.productCode !== undefined) item.ProductCode = opts.productCode;
    if (opts.productLabel !== undefined) item.ProductLabel = opts.productLabel;
    item.ItemAmount = opts.itemAmount ?? 0;
    item.Quantity = opts.quantity ?? 1;
    item.UnitOfMeasure = opts.unitOfMeasure ?? 'Other';
    if (opts.eanUpc !== undefined) item.EanUpc = opts.eanUpc;
    if (opts.additionalProductInfo !== undefined) item.AdditionalProductInfo = opts.additionalProductInfo;
    item.UnitPrice = opts.unitPrice ?? item.ItemAmount;
    if (opts.taxCode !== undefined) item.TaxCode = opts.taxCode;
    if (opts.saleChannel !== undefined) item.SaleChannel = opts.saleChannel;
    if (opts.costBase !== undefined) item.CostBase = opts.costBase;
    if (opts.discount !== undefined) item.Discount = opts.discount;
    if (opts.discountReason !== undefined) item.DiscountReason = opts.discountReason;
    if (opts.brand !== undefined) item.Brand = opts.brand;
    if (opts.quantityInStock !== undefined) item.QuantityInStock = opts.quantityInStock;
    if (opts.restricted !== undefined) item.Restricted = opts.restricted;
    if (opts.pageURL !== undefined) item.PageURL = opts.pageURL;
    if (opts.imageURLs !== undefined) item.ImageURLs = opts.imageURLs;
    if (opts.style !== undefined) item.Style = opts.style;
    if (opts.size !== undefined) item.Size = opts.size;
    if (opts.colour !== undefined) item.Colour = opts.colour;
    if (opts.weight !== undefined) item.Weight = opts.weight;
    if (opts.weightUnitOfMeasure !== undefined) item.WeightUnitOfMeasure = opts.weightUnitOfMeasure;
    if (opts.tags !== undefined) item.Tags = opts.tags;
    if (opts.customFields !== undefined) item.CustomFields = opts.customFields;

    if (opts.category !== undefined || opts.subCategory !== undefined) {
      if (opts.category !== undefined) item.Category = opts.category;
      if (opts.subCategory !== undefined) item.SubCategory = opts.subCategory;
    } else if (opts.categories !== undefined) {
      item.Categories = opts.categories;
    }

    this.PaymentTransaction.SaleItem.push(item);
    return item;
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new PaymentResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    r.PaymentResult = new PaymentResult();
    r.PaymentResult.PaymentType = this.PaymentData?.PaymentType ?? PaymentType.Normal;
    r.PaymentResult.PaymentInstrumentData = new PaymentInstrumentData();
    r.PaymentResult.PaymentInstrumentData.PaymentInstrumentType = 'Card';
    const card = new CardData();
    card.PaymentBrand = 'Card';
    card.EntryMode = 'Contactless';
    r.PaymentResult.PaymentInstrumentData.CardData = card;
    if (this.SaleData) r.SaleData = this.SaleData;
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'SaleData', type: SaleData as unknown as Newable },
    { name: 'PaymentTransaction', type: PaymentTransaction as unknown as Newable },
    { name: 'PaymentData', type: PaymentData as unknown as Newable },
    { name: 'PaymentReceipt', isArray: true, type: PaymentReceipt as unknown as Newable },
    { name: 'ExtensionData', type: ExtensionData as unknown as Newable },
  ];
}

registerPayload('Payment', 'Request', PaymentRequest as unknown as Newable);
