import type { FieldSchema, Newable } from '../util/json/schema.js';
import { SaleTerminalData } from './SaleTerminalData.js';
import { SaleToIssuerData } from './SaleToIssuerData.js';
import { SponsoredMerchant } from './SponsoredMerchant.js';
import { TransactionIdentification } from './TransactionIdentification.js';
import {
  CustomerOrderReqEnum,
  TokenRequestedTypeEnum,
  type CustomerOrderReq,
  type TokenRequestedType,
} from './Types.js';

export class SaleData {
  OperatorID?: string;
  OperatorLanguage?: string;
  ShiftNumber?: string;
  CustomerLanguage?: string;
  SaleTransactionID?: TransactionIdentification;
  SaleReferenceID?: string;
  SaleTerminalData?: SaleTerminalData;
  TokenRequestedType?: TokenRequestedType;
  CustomerOrderID?: string;
  CustomerOrderReq?: CustomerOrderReq[];
  SaleToPOIData?: string;
  SaleToAcquirerData?: string;
  SaleToIssuerData?: SaleToIssuerData;
  SponsoredMerchant?: SponsoredMerchant;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'OperatorID' },
    { name: 'OperatorLanguage' },
    { name: 'ShiftNumber' },
    { name: 'CustomerLanguage' },
    { name: 'SaleTransactionID', type: TransactionIdentification as unknown as Newable },
    { name: 'SaleReferenceID' },
    { name: 'SaleTerminalData', type: SaleTerminalData as unknown as Newable },
    { name: 'TokenRequestedType', enum: TokenRequestedTypeEnum },
    { name: 'CustomerOrderID' },
    { name: 'CustomerOrderReq', isArray: true, enum: CustomerOrderReqEnum },
    { name: 'SaleToPOIData' },
    { name: 'SaleToAcquirerData' },
    { name: 'SaleToIssuerData', type: SaleToIssuerData as unknown as Newable },
    { name: 'SponsoredMerchant', type: SponsoredMerchant as unknown as Newable },
  ];
}
