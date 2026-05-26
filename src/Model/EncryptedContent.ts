import type { FieldSchema, Newable } from '../util/json/schema.js';
import { ContentEncryptionAlgorithm } from './ContentEncryptionAlgorithm.js';

export class EncryptedContent {
  ContentType?: string;
  ContentEncryptionAlgorithm?: ContentEncryptionAlgorithm;
  EncryptedData?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ContentType' },
    { name: 'ContentEncryptionAlgorithm', type: ContentEncryptionAlgorithm as unknown as Newable },
    { name: 'EncryptedData' },
  ];
}
