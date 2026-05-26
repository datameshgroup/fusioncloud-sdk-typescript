import { MessagePayload } from './MessagePayload.js';
import { LoginResponse } from './LoginResponse.js';
import { Response } from './Response.js';
import { SaleSoftware } from './SaleSoftware.js';
import { SaleTerminalData } from './SaleTerminalData.js';
import {
  MessageCategory,
  MessageClass,
  MessageType,
  SaleCapability,
  type SaleCapability as SaleCapabilityT,
} from './Types.js';
import { ErrorCondition } from './Types.js';
import { Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import { formatLoginDateTime } from '../util/json/dates.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class LoginRequest extends MessagePayload {
  /** Override the DateTime emitted on the wire. If null, `formatLoginDateTime(now)` is used. */
  DateTimeOverride?: string;

  SaleSoftware?: SaleSoftware;
  SaleTerminalData?: SaleTerminalData;
  TrainingModeFlag?: boolean = false;
  OperatorLanguage?: string;
  OperatorID?: string;
  ShiftNumber?: string;
  TokenRequestedType?: string;
  CustomerOrderReq?: string;
  POISerialNumber?: string;
  Pairing?: boolean;

  // Cache the computed DateTime so serializing twice (once for the MAC body,
  // once for the envelope) yields the same bytes. The C# implementation has
  // the same latent issue — it just usually hits the same millisecond on both
  // calls. Caching keeps the SDK robust regardless of host/runtime timing.
  private _cachedDateTime?: string;

  /** Wire-side `DateTime` getter — formats `now` to the C# `yyyy-MM-ddTHH:mm:ss.fffzzz` shape. */
  get DateTime(): string {
    if (this.DateTimeOverride) return this.DateTimeOverride;
    if (!this._cachedDateTime) this._cachedDateTime = formatLoginDateTime(new Date());
    return this._cachedDateTime;
  }
  set DateTime(value: string) {
    this.DateTimeOverride = value;
  }

  constructor(
    providerIdentification?: string,
    applicationName?: string,
    softwareVersion?: string,
    certificationCode?: string,
    saleCapabilities?: SaleCapabilityT[],
  ) {
    super(MessageClass.Service, MessageCategory.Login, MessageType.Request);
    if (providerIdentification !== undefined || applicationName !== undefined) {
      this.SaleSoftware = new SaleSoftware(
        providerIdentification,
        applicationName,
        softwareVersion,
        certificationCode,
      );
      const caps =
        saleCapabilities ?? [
          SaleCapability.PrinterReceipt,
          SaleCapability.CashierStatus,
          SaleCapability.CashierError,
        ];
      this.SaleTerminalData = new SaleTerminalData();
      this.SaleTerminalData.SaleCapabilities = caps;
    }
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new LoginResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'DateTime' },
    { name: 'SaleSoftware', type: SaleSoftware as unknown as Newable },
    { name: 'SaleTerminalData', type: SaleTerminalData as unknown as Newable },
    { name: 'TrainingModeFlag' },
    { name: 'OperatorLanguage' },
    { name: 'OperatorID' },
    { name: 'ShiftNumber' },
    { name: 'TokenRequestedType' },
    { name: 'CustomerOrderReq' },
    { name: 'POISerialNumber' },
    { name: 'Pairing' },
  ];
}

registerPayload('Login', 'Request', LoginRequest as unknown as Newable);
