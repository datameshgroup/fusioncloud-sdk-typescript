import type { FieldSchema } from '../util/json/schema.js';
import { ComponentTypeEnum, type ComponentType } from './Types.js';
import { sdkUserAgent } from '../util/userAgent.js';

export class SaleSoftware {
  ProviderIdentification?: string;
  ApplicationName?: string;
  SoftwareVersion?: string;
  CertificationCode?: string;
  ComponentType?: ComponentType;

  private _componentDescription?: string;
  /**
   * Identifies the SDK to the host. Auto-populated with `DataMesh.Fusion/<ver>(<runtime>; <os>; …)`
   * to mirror C# `SaleSoftware.GetAssemblyVersionData`.
   */
  get ComponentDescription(): string {
    if (!this._componentDescription) this._componentDescription = sdkUserAgent();
    return this._componentDescription;
  }
  set ComponentDescription(value: string | undefined) {
    this._componentDescription = value;
  }

  constructor(
    providerIdentification?: string,
    applicationName?: string,
    softwareVersion?: string,
    certificationCode?: string,
  ) {
    if (providerIdentification !== undefined) this.ProviderIdentification = providerIdentification;
    if (applicationName !== undefined) this.ApplicationName = applicationName;
    if (softwareVersion !== undefined) this.SoftwareVersion = softwareVersion;
    if (certificationCode !== undefined) this.CertificationCode = certificationCode;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ProviderIdentification' },
    { name: 'ApplicationName' },
    { name: 'SoftwareVersion' },
    { name: 'CertificationCode' },
    { name: 'ComponentDescription' },
    { name: 'ComponentType', enum: ComponentTypeEnum },
  ];
}
