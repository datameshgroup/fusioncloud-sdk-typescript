import { randomBytes } from 'node:crypto';
import type { FieldSchema } from '../util/json/schema.js';
import type { BaudRate, DataBits, EncryptionType, PairingMode, Parity, PortType } from './Types.js';

/**
 * Mirror of C# PairingData. Field names use the single-letter JSON keys
 * (`m`, `u`, `sb`, …) that the cloud pairing flow expects on the wire.
 */
export class PairingData {
  Mode?: PairingMode;
  PortType?: PortType;
  PortParamsBaudRate?: BaudRate;
  PortParamsParity?: Parity;
  PortParamsDataBits?: DataBits;
  EncryptionType?: EncryptionType;
  HeartbeatTimeout?: number;
  SaleID?: string;
  PairingPOIID?: string;
  KEK?: string;
  CertificationCode?: string;
  POSName?: string;
  Version = 1;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Mode', jsonName: 'm' },
    { name: 'PortType', jsonName: 'u' },
    { name: 'PortParamsBaudRate', jsonName: 'sb' },
    { name: 'PortParamsParity', jsonName: 'sp' },
    { name: 'PortParamsDataBits', jsonName: 'sd' },
    { name: 'EncryptionType', jsonName: 'et' },
    { name: 'HeartbeatTimeout', jsonName: 'hb' },
    { name: 'SaleID', jsonName: 's' },
    { name: 'PairingPOIID', jsonName: 'p' },
    { name: 'KEK', jsonName: 'k' },
    { name: 'CertificationCode', jsonName: 'c' },
    { name: 'POSName', jsonName: 'n' },
    { name: 'Version', jsonName: 'v' },
  ];

  /** Generates a 48-character uppercase hex KEK suitable for pairing. */
  static createKEK(): string {
    return randomBytes(24).toString('hex').toUpperCase();
  }
}
