import type { FieldSchema, Newable } from '../util/json/schema.js';
import { EncryptedContent } from './EncryptedContent.js';
import { KEK } from './SecurityTrailer.js';

export class EnvelopedData {
  Version?: string;
  KEK?: KEK;
  EncryptedContent?: EncryptedContent;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Version' },
    { name: 'KEK', type: KEK as unknown as Newable },
    { name: 'EncryptedContent', type: EncryptedContent as unknown as Newable },
  ];
}
