import type { FieldSchema } from '../util/json/schema.js';

export class SaleToIssuerData {
  StatementReference?: string;
  static readonly __schema: readonly FieldSchema[] = [{ name: 'StatementReference' }];
}
