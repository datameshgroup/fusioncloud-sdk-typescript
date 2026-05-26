import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  FusionClient,
  LoginRequest,
  LoginResponse,
  Result,
  SaleCapability,
  UnifyURL,
} from '../../src/index.js';
import { FusionClientFixture, loadSettings, settingsAvailable } from './fixtures/FusionClientFixture.js';

describe.skipIf(!settingsAvailable)('Login (live)', () => {
  let fixture: FusionClientFixture;

  beforeAll(() => {
    fixture = new FusionClientFixture();
  });

  afterAll(async () => {
    await fixture.dispose();
  });

  it('logs in and returns POISystemData', async () => {
    const r = await fixture.client.sendRecvAsync<LoginResponse>(fixture.client.LoginRequest!, {
      type: LoginResponse,
    });
    expect(r).toBeInstanceOf(LoginResponse);
    expect(r!.Response?.Result).toBe(Result.Success);
    expect(r!.POISystemData).toBeDefined();
  });

  it('throws on invalid custom URL', async () => {
    const s = loadSettings();
    const client = new FusionClient({ useTestEnvironment: s.UseTestEnvironment });
    client.URL = UnifyURL.Custom;
    client.CustomURL = 'wss://invalid.example.invalid/nonsense';
    client.SaleID = s.SaleID;
    client.POIID = s.POIID;
    client.KEK = s.KEK;
    client.LoginRequest = new LoginRequest(
      s.ProviderIdentification,
      s.ApplicationName,
      s.SoftwareVersion,
      s.CertificationCode,
      [SaleCapability.CashierStatus, SaleCapability.PrinterReceipt],
    );
    await expect(client.connectAsync()).rejects.toBeDefined();
  });
});
