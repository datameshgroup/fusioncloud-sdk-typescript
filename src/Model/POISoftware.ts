import type { FieldSchema } from '../util/json/schema.js';

export class POISoftware {
  ProviderIdentification?: string;
  ApplicationName?: string;
  SoftwareVersion?: string;
  CertificationCode?: string;
  ComponentDescription?: string;
  ComponentType?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ProviderIdentification' },
    { name: 'ApplicationName' },
    { name: 'SoftwareVersion' },
    { name: 'CertificationCode' },
    { name: 'ComponentDescription' },
    { name: 'ComponentType' },
  ];
}
