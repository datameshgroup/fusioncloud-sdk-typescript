import type { FieldSchema } from '../util/json/schema.js';
import { TokenRequestedTypeEnum, type TokenRequestedType } from './Types.js';

export class PaymentToken {
  TokenRequestedType?: TokenRequestedType;
  TokenValue?: string;
  ExpiryDateTime?: Date;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TokenRequestedType', enum: TokenRequestedTypeEnum },
    { name: 'TokenValue' },
    { name: 'ExpiryDateTime', date: 'iso' },
  ];
}
