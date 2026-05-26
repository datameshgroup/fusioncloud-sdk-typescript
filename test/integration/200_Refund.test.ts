import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentType,
  Result,
} from '../../src/index.js';
import { FusionClientFixture, settingsAvailable } from './fixtures/FusionClientFixture.js';

describe.skipIf(!settingsAvailable)('Refund (live)', () => {
  let fixture: FusionClientFixture;

  beforeAll(() => {
    fixture = new FusionClientFixture();
  });

  afterAll(async () => {
    await fixture.dispose();
  });

  it('processes a $1.00 refund', async () => {
    const transactionId = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 15);
    const req = new PaymentRequest(transactionId, 1.0, undefined, PaymentType.Refund);
    const r = await fixture.client.sendRecvAsync<PaymentResponse>(req, { type: PaymentResponse });
    expect(r).toBeInstanceOf(PaymentResponse);
    expect(r!.PaymentResult?.PaymentType).toBe(PaymentType.Refund);
    expect(r!.Response?.Result).toBe(Result.Success);
  });
});
