import type { FieldSchema, Newable } from '../util/json/schema.js';
import { SignatureImage } from './SignatureImage.js';

export class CapturedSignature {
  RawSignature?: string;
  SignatureImage?: SignatureImage;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'RawSignature' },
    { name: 'SignatureImage', type: SignatureImage as unknown as Newable },
  ];
}
