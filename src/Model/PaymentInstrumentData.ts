import type { FieldSchema, Newable } from '../util/json/schema.js';
import { CardData } from './CardData.js';
import { StoredValueAccountID } from './StoredValueAccountID.js';
import { PaymentInstrumentTypeEnum, type PaymentInstrumentType } from './Types.js';

export class PaymentInstrumentData {
  PaymentInstrumentType?: PaymentInstrumentType;
  CardData?: CardData;
  StoredValueAccountID?: StoredValueAccountID;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PaymentInstrumentType', enum: PaymentInstrumentTypeEnum },
    { name: 'CardData', type: CardData as unknown as Newable },
    { name: 'StoredValueAccountID', type: StoredValueAccountID as unknown as Newable },
  ];
}
