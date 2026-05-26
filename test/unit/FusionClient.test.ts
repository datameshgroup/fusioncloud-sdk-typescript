import { describe, expect, it, beforeEach } from 'vitest';
import '../../src/index.js';
import { FusionClient } from '../../src/FusionClient.js';
import { NexoMessageParser } from '../../src/NexoMessageParser.js';
import { LoginRequest } from '../../src/Model/LoginRequest.js';
import { LoginResponse } from '../../src/Model/LoginResponse.js';
import { PaymentRequest } from '../../src/Model/PaymentRequest.js';
import { PaymentResponse } from '../../src/Model/PaymentResponse.js';
import { Response } from '../../src/Model/Response.js';
import { Result } from '../../src/Model/Types.js';
import type { IFusionWebSocket, IWebSocketFactory } from '../../src/IWebSocketFactory.js';

const TEST_KEK = '1140B940AD020C7C6EC25DBDBDA4759E3A329CCC6D07A694';

class StubWebSocket implements IFusionWebSocket {
  readonly sent: string[] = [];
  private messageHandler?: (data: string) => void;
  private closeHandler?: (code: number, reason: string) => void;

  isOpen = true;

  async send(data: string): Promise<void> {
    this.sent.push(data);
  }

  async close(): Promise<void> {
    this.isOpen = false;
    this.closeHandler?.(1000, '');
  }

  onMessage(handler: (data: string) => void): void {
    this.messageHandler = handler;
  }

  onClose(handler: (code: number, reason: string) => void): void {
    this.closeHandler = handler;
  }

  onError(): void {
    // unused
  }

  /** Simulate a wire message arriving from the host. */
  inject(data: string): void {
    this.messageHandler?.(data);
  }
}

class StubFactory implements IWebSocketFactory {
  readonly sockets: StubWebSocket[] = [];
  async connectAsync(): Promise<IFusionWebSocket> {
    const s = new StubWebSocket();
    this.sockets.push(s);
    return s;
  }
}

function makeClient(): { client: FusionClient; factory: StubFactory; parser: NexoMessageParser } {
  const factory = new StubFactory();
  const parser = new NexoMessageParser({ enableMACValidation: false });
  parser.enableSecurityTrailer = false;
  const client = new FusionClient({ webSocketFactory: factory, messageParser: parser });
  client.SaleID = 'e0ae2486-7fd1-4ffd-818d-ea9a18beffce';
  client.POIID = 'DMGCD001';
  client.KEK = TEST_KEK;
  return { client, factory, parser };
}

function loginResponseJson(serviceID: string): string {
  return JSON.stringify({
    SaleToPOIResponse: {
      MessageHeader: {
        ProtocolVersion: '3.1-dmg',
        MessageClass: 'Service',
        MessageCategory: 'Login',
        MessageType: 'Response',
        ServiceID: serviceID,
        SaleID: 'sale',
        POIID: 'poi',
      },
      LoginResponse: {
        Response: { Result: 'Success' },
      },
    },
  });
}

function paymentResponseJson(serviceID: string): string {
  return JSON.stringify({
    SaleToPOIResponse: {
      MessageHeader: {
        ProtocolVersion: '3.1-dmg',
        MessageClass: 'Service',
        MessageCategory: 'Payment',
        MessageType: 'Response',
        ServiceID: serviceID,
        SaleID: 'sale',
        POIID: 'poi',
      },
      PaymentResponse: {
        Response: { Result: 'Success' },
      },
    },
  });
}

describe('FusionClient', () => {
  let client: FusionClient;
  let factory: StubFactory;

  beforeEach(() => {
    ({ client, factory } = makeClient());
  });

  it('connectAsync opens the socket and fires connect event', async () => {
    let fired = false;
    client.on('connect', () => {
      fired = true;
    });
    const result = await client.connectAsync();
    expect(result).toBe(true);
    expect(fired).toBe(true);
    expect(factory.sockets).toHaveLength(1);
  });

  it('auto-login: a payment send triggers a login first, then sends the parked payment', async () => {
    client.LoginRequest = new LoginRequest('DMG', 'FusionApp', '1.0.0.0', 'cert');
    const payment = new PaymentRequest('TX-1', 1.0);

    // Kick off the send (doesn't await — we need to interleave the login response)
    const sendPromise = client.sendAsync(payment);

    // The first message sent should be the login.
    await new Promise((r) => setImmediate(r));
    const socket = factory.sockets[0]!;
    expect(socket.sent.length).toBe(1);
    const first = JSON.parse(socket.sent[0]!) as Record<string, unknown>;
    expect(((first.SaleToPOIRequest as Record<string, unknown>).MessageHeader as Record<string, unknown>).MessageCategory).toBe('Login');
    const loginServiceID = ((first.SaleToPOIRequest as Record<string, unknown>).MessageHeader as { ServiceID: string }).ServiceID;

    // Inject a successful login response.
    socket.inject(loginResponseJson(loginServiceID));

    // The parked payment should be sent.
    await sendPromise;
    await new Promise((r) => setImmediate(r));
    expect(socket.sent.length).toBe(2);
    const second = JSON.parse(socket.sent[1]!) as Record<string, unknown>;
    expect(((second.SaleToPOIRequest as Record<string, unknown>).MessageHeader as Record<string, unknown>).MessageCategory).toBe('Payment');
  });

  it('recvAsync<PaymentResponse> waits for matching type', async () => {
    client.LoginRequired = false;
    await client.connectAsync();
    const payment = new PaymentRequest('TX-2', 2.0);
    await client.sendAsync(payment);
    const socket = factory.sockets[0]!;
    const last = JSON.parse(socket.sent[socket.sent.length - 1]!) as Record<string, unknown>;
    const serviceID = ((last.SaleToPOIRequest as Record<string, unknown>).MessageHeader as { ServiceID: string }).ServiceID;

    socket.inject(paymentResponseJson(serviceID));
    const result = await client.recvAsync<PaymentResponse>({ type: PaymentResponse, timeoutMs: 1000 });
    expect(result).toBeInstanceOf(PaymentResponse);
    expect((result as PaymentResponse).Response?.Result).toBe(Result.Success);
  });

  it('discards responses with mismatched ServiceID', async () => {
    client.LoginRequired = false;
    await client.connectAsync();
    await client.sendAsync(new PaymentRequest('TX-3', 3.0));
    const socket = factory.sockets[0]!;

    // Inject a payment response with the WRONG serviceID — should be dropped.
    socket.inject(paymentResponseJson('not-the-right-id'));
    // Then inject one with the matching serviceID.
    const last = JSON.parse(socket.sent[socket.sent.length - 1]!) as Record<string, unknown>;
    const serviceID = ((last.SaleToPOIRequest as Record<string, unknown>).MessageHeader as { ServiceID: string }).ServiceID;
    socket.inject(paymentResponseJson(serviceID));

    const result = await client.recvAsync<PaymentResponse>({ type: PaymentResponse, timeoutMs: 1000 });
    expect(result).toBeInstanceOf(PaymentResponse);
  });

  it('event mode delivers payment responses via emit', async () => {
    client.LoginRequired = false;
    const received: PaymentResponse[] = [];
    client.on('paymentResponse', (r) => received.push(r));
    await client.connectAsync();
    await client.sendAsync(new PaymentRequest('TX-4', 4.0));
    const socket = factory.sockets[0]!;
    const last = JSON.parse(socket.sent[socket.sent.length - 1]!) as Record<string, unknown>;
    const serviceID = ((last.SaleToPOIRequest as Record<string, unknown>).MessageHeader as { ServiceID: string }).ServiceID;
    socket.inject(paymentResponseJson(serviceID));
    expect(received.length).toBe(1);
  });

  it('LoginResponse failure triggers a synthetic default response for the parked request', async () => {
    client.LoginRequest = new LoginRequest('DMG', 'FusionApp', '1.0.0.0', 'cert');
    const payment = new PaymentRequest('TX-5', 5.0);
    const sendPromise = client.sendAsync(payment);
    await new Promise((r) => setImmediate(r));
    const socket = factory.sockets[0]!;
    const first = JSON.parse(socket.sent[0]!) as Record<string, unknown>;
    const loginServiceID = ((first.SaleToPOIRequest as Record<string, unknown>).MessageHeader as { ServiceID: string }).ServiceID;

    // Inject a FAILURE login response.
    socket.inject(
      JSON.stringify({
        SaleToPOIResponse: {
          MessageHeader: {
            ProtocolVersion: '3.1-dmg',
            MessageClass: 'Service',
            MessageCategory: 'Login',
            MessageType: 'Response',
            ServiceID: loginServiceID,
            SaleID: 'sale',
            POIID: 'poi',
          },
          LoginResponse: {
            Response: { Result: 'Failure', ErrorCondition: 'LoggedOut' },
          },
        },
      }),
    );

    await sendPromise;
    // Recv should now yield a synthetic PaymentResponse with Failure.
    const result = await client.recvAsync<PaymentResponse>({ type: PaymentResponse, timeoutMs: 1000 });
    expect(result).toBeInstanceOf(PaymentResponse);
    expect((result as PaymentResponse).Response?.Result).toBe(Result.Failure);
  });

  it('getPairingData populates required fields', () => {
    client.LoginRequest = new LoginRequest('DMG', 'FusionApp', '1.0.0.0', 'cert-code');
    const data = client.getPairingData('TestPOS');
    expect(data.POSName).toBe('TestPOS');
    expect(data.CertificationCode).toBe('cert-code');
    expect(data.SaleID).toBe('e0ae2486-7fd1-4ffd-818d-ea9a18beffce');
    expect(data.KEK).toBe(TEST_KEK);
  });

  it('getPairingDataJson uses single-letter wire keys', () => {
    client.LoginRequest = new LoginRequest('DMG', 'FusionApp', '1.0.0.0', 'cert-code');
    const json = client.getPairingDataJson('TestPOS');
    const obj = JSON.parse(json) as Record<string, unknown>;
    expect(obj.s).toBe('e0ae2486-7fd1-4ffd-818d-ea9a18beffce');
    expect(obj.c).toBe('cert-code');
    expect(obj.n).toBe('TestPOS');
    expect(obj.v).toBe(1);
  });

  it('LoginResponse with success disables loginRequired', async () => {
    expect(client.LoginRequired).toBe(true);
    client.LoginRequest = new LoginRequest('DMG', 'FusionApp', '1.0.0.0', 'cert');
    const payment = new PaymentRequest('TX-6', 6.0);
    const sendPromise = client.sendAsync(payment);
    await new Promise((r) => setImmediate(r));
    const socket = factory.sockets[0]!;
    const first = JSON.parse(socket.sent[0]!) as Record<string, unknown>;
    const loginServiceID = ((first.SaleToPOIRequest as Record<string, unknown>).MessageHeader as { ServiceID: string }).ServiceID;
    socket.inject(loginResponseJson(loginServiceID));
    await sendPromise;
    expect(client.LoginRequired).toBe(false);
    expect(client.LoginResponse).toBeInstanceOf(LoginResponse);
  });

  it('discarded but valid response — Response default constructor sanity', () => {
    const r = new Response();
    expect(r.Result).toBe(Result.Failure);
    expect(r.success).toBe(false);
  });
});
