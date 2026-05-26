import type { FieldSchema, Newable } from '../util/json/schema.js';
import { EnvelopedData } from './EnvelopedData.js';

export class ProtectedCardData {
  ContentType?: string;
  EnvelopedData?: EnvelopedData;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ContentType' },
    { name: 'EnvelopedData', type: EnvelopedData as unknown as Newable },
  ];
}
