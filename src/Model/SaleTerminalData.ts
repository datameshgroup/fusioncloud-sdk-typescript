import type { FieldSchema, Newable } from '../util/json/schema.js';
import { SaleProfile } from './SaleProfile.js';
import {
  SaleCapabilityEnum,
  TerminalEnvironmentEnum,
  type SaleCapability,
  type TerminalEnvironment,
} from './Types.js';

export class SaleTerminalData {
  TerminalEnvironment?: TerminalEnvironment | null;
  SaleCapabilities?: SaleCapability[];
  SaleProfile?: SaleProfile;
  TotalsGroupID?: string;
  DeviceID?: string;

  /**
   * Set `loginRequest=true` to populate the defaults the C# constructor
   * applies for LoginRequest: Attended terminal, empty capabilities, basic
   * SaleProfile.
   */
  constructor(loginRequest = true) {
    if (loginRequest) {
      this.TerminalEnvironment = 'Attended';
      this.SaleCapabilities = [];
      this.SaleProfile = new SaleProfile();
    }
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TerminalEnvironment', enum: TerminalEnvironmentEnum, nullableEnum: true },
    { name: 'SaleCapabilities', isArray: true, enum: SaleCapabilityEnum },
    { name: 'SaleProfile', type: SaleProfile as unknown as Newable },
    { name: 'TotalsGroupID' },
    { name: 'DeviceID' },
  ];
}
