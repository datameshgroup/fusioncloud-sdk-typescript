import { sdkUserAgent } from './userAgent.js';

/** Headers sent on the initial WebSocket upgrade. */
export class WebSocketHeaders {
  SaleID?: string;
  POIID?: string;
  CertificationCode?: string;
  InstanceID?: string;

  get UserAgent(): string {
    return sdkUserAgent();
  }
}
