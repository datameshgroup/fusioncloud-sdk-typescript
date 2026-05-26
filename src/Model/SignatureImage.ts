import type { FieldSchema } from '../util/json/schema.js';

export class SignatureImage {
  ImageFormat?: string;
  ImageData?: string;
  ImageReference?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ImageFormat' },
    { name: 'ImageData' },
    { name: 'ImageReference' },
  ];
}
