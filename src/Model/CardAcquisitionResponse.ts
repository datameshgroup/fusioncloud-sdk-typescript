import { MessagePayload } from './MessagePayload.js';
import { PaymentInstrumentData } from './PaymentInstrumentData.js';
import { POIData } from './POIData.js';
import { Response } from './Response.js';
import { SaleData } from './SaleData.js';
import { MessageCategory, MessageClass, MessageType, PaymentBrandEnum, type PaymentBrand } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class CardAcquisitionResponse extends MessagePayload {
  Response?: Response;
  SaleData?: SaleData;
  POIData?: POIData;
  PaymentBrand?: PaymentBrand;
  PaymentInstrumentData?: PaymentInstrumentData;

  constructor() {
    super(MessageClass.Service, MessageCategory.CardAcquisition, MessageType.Response);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'SaleData', type: SaleData as unknown as Newable },
    { name: 'POIData', type: POIData as unknown as Newable },
    { name: 'PaymentBrand', enum: PaymentBrandEnum },
    { name: 'PaymentInstrumentData', type: PaymentInstrumentData as unknown as Newable },
  ];
}

registerPayload('CardAcquisition', 'Response', CardAcquisitionResponse as unknown as Newable);
