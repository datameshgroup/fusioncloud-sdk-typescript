import type { FieldSchema, Newable } from '../util/json/schema.js';
import { AmountsResp } from './AmountsResp.js';
import { CurrencyConversion } from './CurrencyConversion.js';
import { PaymentAcquirerData } from './PaymentAcquirerData.js';
import { PaymentInstrumentData } from './PaymentInstrumentData.js';
import {
  AuthenticationMethodEnum,
  PaymentTypeEnum,
  type AuthenticationMethod,
  type PaymentType,
} from './Types.js';

export class PaymentResult {
  PaymentType?: PaymentType;
  PaymentInstrumentData?: PaymentInstrumentData;
  AmountsResp?: AmountsResp;
  CurrencyConversion?: CurrencyConversion;
  CustomerLanguage?: string;
  OnlineFlag?: boolean;
  AuthenticationMethod?: AuthenticationMethod[];
  ValidityDate?: string;
  PaymentAcquirerData?: PaymentAcquirerData;
  Currency?: string;
  RRN?: string;
  CurrentBalance?: number;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PaymentType', enum: PaymentTypeEnum },
    { name: 'PaymentInstrumentData', type: PaymentInstrumentData as unknown as Newable },
    { name: 'AmountsResp', type: AmountsResp as unknown as Newable },
    { name: 'CurrencyConversion', type: CurrencyConversion as unknown as Newable },
    { name: 'CustomerLanguage' },
    { name: 'OnlineFlag' },
    { name: 'AuthenticationMethod', isArray: true, enum: AuthenticationMethodEnum },
    { name: 'ValidityDate' },
    { name: 'PaymentAcquirerData', type: PaymentAcquirerData as unknown as Newable },
    { name: 'Currency' },
    { name: 'RRN' },
    { name: 'CurrentBalance', decimal: true },
  ];
}
