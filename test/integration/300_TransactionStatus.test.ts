import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  MessageCategory,
  MessageReference,
  PaymentRequest,
  PaymentResponse,
  Result,
  TransactionStatusRequest,
  TransactionStatusResponse,
} from '../../src/index.js';
import { FusionClientFixture, settingsAvailable } from './fixtures/FusionClientFixture.js';

describe.skipIf(!settingsAvailable)('TransactionStatus (live)', () => {
  let fixture: FusionClientFixture;

  beforeAll(() => {
    fixture = new FusionClientFixture();
  });

  afterAll(async () => {
    await fixture.dispose();
  });

  it('returns the repeated response for a completed payment', async () => {
    const transactionId = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 15);
    const payment = new PaymentRequest(transactionId, 1.0);
    const paymentSale = await fixture.client.sendAsync(payment);
    const paymentResp = await fixture.client.recvAsync<PaymentResponse>({ type: PaymentResponse });
    expect(paymentResp).toBeInstanceOf(PaymentResponse);

    const status = new TransactionStatusRequest();
    status.MessageReference = new MessageReference();
    status.MessageReference.MessageCategory = MessageCategory.Payment;
    status.MessageReference.ServiceID = paymentSale.MessageHeader.ServiceID;
    status.MessageReference.SaleID = paymentSale.MessageHeader.SaleID;
    status.MessageReference.POIID = paymentSale.MessageHeader.POIID;

    const r = await fixture.client.sendRecvAsync<TransactionStatusResponse>(status, {
      type: TransactionStatusResponse,
    });
    expect(r).toBeInstanceOf(TransactionStatusResponse);
    expect(r!.Response?.Result).toBe(Result.Success);
    expect(r!.RepeatedMessageResponse?.RepeatedResponseMessageBody?.PaymentResponse).toBeDefined();
  });
});
