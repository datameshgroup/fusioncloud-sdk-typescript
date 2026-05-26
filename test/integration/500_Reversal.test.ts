import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  PaymentRequest,
  PaymentResponse,
  ReversalReason,
  ReversalRequest,
  ReversalResponse,
  Result,
} from '../../src/index.js';
import { FusionClientFixture, settingsAvailable } from './fixtures/FusionClientFixture.js';

describe.skipIf(!settingsAvailable)('Reversal (live)', () => {
  let fixture: FusionClientFixture;

  beforeAll(() => {
    fixture = new FusionClientFixture();
  });

  afterAll(async () => {
    await fixture.dispose();
  });

  it('reverses a just-completed payment', async () => {
    const transactionId = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 15);
    const payment = new PaymentRequest(transactionId, 1.0);
    const paymentResp = await fixture.client.sendRecvAsync<PaymentResponse>(payment, { type: PaymentResponse });
    expect(paymentResp).toBeInstanceOf(PaymentResponse);
    expect(paymentResp!.POIData?.POITransactionID).toBeDefined();

    const reversal = new ReversalRequest('MerchantCancel' as ReversalReason, paymentResp!.POIData!.POITransactionID!);
    const r = await fixture.client.sendRecvAsync<ReversalResponse>(reversal, { type: ReversalResponse });
    expect(r).toBeInstanceOf(ReversalResponse);
    expect(r!.Response?.Result).toBe(Result.Success);
  });
});
