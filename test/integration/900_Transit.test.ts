import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  ExtensionData,
  PaymentRequest,
  PaymentResponse,
  Result,
  TransitData,
  Trip,
} from '../../src/index.js';
import { FusionClientFixture, settingsAvailable } from './fixtures/FusionClientFixture.js';

describe.skipIf(!settingsAvailable)('Transit (live)', () => {
  let fixture: FusionClientFixture;

  beforeAll(() => {
    fixture = new FusionClientFixture();
  });

  afterAll(async () => {
    await fixture.dispose();
  });

  it('sends a transit payment with TransitData extension', async () => {
    const transactionId = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 15);
    const req = new PaymentRequest(transactionId, 5.0);
    req.ExtensionData = new ExtensionData();
    req.ExtensionData.TransitData = new TransitData();
    req.ExtensionData.TransitData.IsWheelchairEnabled = false;
    req.ExtensionData.TransitData.Trip = new Trip();
    req.ExtensionData.TransitData.Trip.TotalDistanceTravelled = 4.2;
    req.ExtensionData.TransitData.Tags = ['NSWAllowTSSSubsidy'];

    const r = await fixture.client.sendRecvAsync<PaymentResponse>(req, { type: PaymentResponse });
    expect(r).toBeInstanceOf(PaymentResponse);
    expect([Result.Success, Result.Failure]).toContain(r!.Response?.Result);
  });
});
