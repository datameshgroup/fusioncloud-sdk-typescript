import type { FieldSchema, Newable } from '../util/json/schema.js';
import { CardData } from './CardData.js';
import { PaymentInstrumentData } from './PaymentInstrumentData.js';
import { StoredValueAccountID } from './StoredValueAccountID.js';
import { TransactionIdentification } from './TransactionIdentification.js';
import { AccountTypeEnum, type AccountType } from './Types.js';

export class PaymentAccountReq {
  AccountType: AccountType = 'Default';
  CardAcquisitionReference?: TransactionIdentification;
  PaymentInstrumentData?: PaymentInstrumentData;

  static withStoredValue(storedValueAccountID: StoredValueAccountID): PaymentAccountReq {
    const r = new PaymentAccountReq();
    r.PaymentInstrumentData = new PaymentInstrumentData();
    r.PaymentInstrumentData.PaymentInstrumentType = 'StoredValue';
    r.PaymentInstrumentData.StoredValueAccountID = storedValueAccountID;
    return r;
  }

  static withCard(cardData: CardData): PaymentAccountReq {
    const r = new PaymentAccountReq();
    r.PaymentInstrumentData = new PaymentInstrumentData();
    r.PaymentInstrumentData.PaymentInstrumentType = 'Card';
    r.PaymentInstrumentData.CardData = cardData;
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'AccountType', enum: AccountTypeEnum },
    { name: 'CardAcquisitionReference', type: TransactionIdentification as unknown as Newable },
    { name: 'PaymentInstrumentData', type: PaymentInstrumentData as unknown as Newable },
  ];
}
