import type { FieldSchema, Newable } from '../util/json/schema.js';

export class KEKIdentifier {
  KeyIdentifier?: string;
  KeyVersion?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'KeyIdentifier' },
    { name: 'KeyVersion' },
  ];
}

export class KeyEncryptionAlgorithm {
  Algorithm?: string;
  static readonly __schema: readonly FieldSchema[] = [{ name: 'Algorithm' }];
}

export class KEK {
  Version?: string;
  KEKIdentifier?: KEKIdentifier;
  KeyEncryptionAlgorithm?: KeyEncryptionAlgorithm;
  EncryptedKey?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Version' },
    { name: 'KEKIdentifier', type: KEKIdentifier as unknown as Newable },
    { name: 'KeyEncryptionAlgorithm', type: KeyEncryptionAlgorithm as unknown as Newable },
    { name: 'EncryptedKey' },
  ];
}

export class MACAlgorithm {
  Algorithm?: string;
  static readonly __schema: readonly FieldSchema[] = [{ name: 'Algorithm' }];
}

export class EncapsulatedContent {
  ContentType?: string;
  static readonly __schema: readonly FieldSchema[] = [{ name: 'ContentType' }];
}

export class Recipient {
  KEK?: KEK;
  MACAlgorithm?: MACAlgorithm;
  EncapsulatedContent?: EncapsulatedContent;
  MAC?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'KEK', type: KEK as unknown as Newable },
    { name: 'MACAlgorithm', type: MACAlgorithm as unknown as Newable },
    { name: 'EncapsulatedContent', type: EncapsulatedContent as unknown as Newable },
    { name: 'MAC' },
  ];
}

export class AuthenticatedData {
  Version?: string;
  Recipient?: Recipient;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Version' },
    { name: 'Recipient', type: Recipient as unknown as Newable },
  ];
}

export class SecurityTrailer {
  ContentType?: string;
  AuthenticatedData?: AuthenticatedData;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ContentType' },
    { name: 'AuthenticatedData', type: AuthenticatedData as unknown as Newable },
  ];
}
