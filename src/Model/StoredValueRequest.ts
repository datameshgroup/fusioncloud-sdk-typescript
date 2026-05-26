import { MessagePayload } from './MessagePayload.js';
import { Response } from './Response.js';
import { SaleData } from './SaleData.js';
import { StoredValueAccountStatus } from './StoredValueAccountStatus.js';
import { StoredValueData } from './StoredValueData.js';
import { StoredValueResponse } from './StoredValueResponse.js';
import { StoredValueResult } from './StoredValueResult.js';
import { TransactionIdentification } from './TransactionIdentification.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class StoredValueRequest extends MessagePayload {
  SaleData?: SaleData;
  StoredValueData: StoredValueData[] = [];

  constructor(transactionID?: string, storedValueData?: StoredValueData[]) {
    super(MessageClass.Service, MessageCategory.StoredValue, MessageType.Request);
    if (transactionID !== undefined) {
      this.SaleData = new SaleData();
      this.SaleData.SaleTransactionID = new TransactionIdentification(transactionID);
    }
    if (storedValueData) this.StoredValueData = storedValueData;
  }

  /** First entry of `StoredValueData`, if any. */
  get storedValueDataItem(): StoredValueData | undefined {
    return this.StoredValueData[0];
  }

  addStoredValueData(item: StoredValueData): void {
    this.StoredValueData.push(item);
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new StoredValueResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    r.StoredValueResult = this.StoredValueData.map((d) => {
      const sr = new StoredValueResult();
      sr.StoredValueTransactionType = d.StoredValueTransactionType;
      if (d.ProductCode !== undefined) sr.ProductCode = d.ProductCode;
      if (d.EanUpc !== undefined) sr.EanUpc = d.EanUpc;
      if (d.ItemAmount !== undefined) sr.ItemAmount = d.ItemAmount;
      if (d.TotalFeesAmount !== undefined) sr.TotalFeesAmount = d.TotalFeesAmount;
      if (d.Currency !== undefined) sr.Currency = d.Currency;
      const status = new StoredValueAccountStatus();
      if (d.StoredValueAccountID !== undefined) status.StoredValueAccountID = d.StoredValueAccountID;
      status.CurrentBalance = 0;
      sr.StoredValueAccountStatus = status;
      return sr;
    });
    if (this.SaleData) r.SaleData = this.SaleData;
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'SaleData', type: SaleData as unknown as Newable },
    { name: 'StoredValueData', isArray: true, type: StoredValueData as unknown as Newable },
  ];
}

registerPayload('StoredValue', 'Request', StoredValueRequest as unknown as Newable);
