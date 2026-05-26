import type { FieldSchema } from '../util/json/schema.js';

export class TransactionIdentification {
  TransactionID?: string;
  TimeStamp: Date = new Date();

  constructor(transactionID?: string) {
    if (transactionID !== undefined) {
      this.TransactionID = transactionID;
      this.TimeStamp = new Date();
    }
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TransactionID' },
    { name: 'TimeStamp', date: 'iso' },
  ];
}
