import { randomInt, randomUUID } from 'node:crypto';
import { hostname } from 'node:os';
import { DefaultWebSocketFactory } from './DefaultWebSocketFactory.js';
import type { IFusionWebSocket, IWebSocketFactory } from './IWebSocketFactory.js';
import { NexoMessageParser } from './NexoMessageParser.js';
import type { IMessageParser } from './IMessageParser.js';
import { AbortRequest } from './Model/AbortRequest.js';
import { BalanceInquiryRequest } from './Model/BalanceInquiryRequest.js';
import { BalanceInquiryResponse } from './Model/BalanceInquiryResponse.js';
import { CardAcquisitionResponse } from './Model/CardAcquisitionResponse.js';
import { DisplayRequest } from './Model/DisplayRequest.js';
import { EventNotification } from './Model/EventNotification.js';
import { LoginRequest } from './Model/LoginRequest.js';
import { LoginResponse } from './Model/LoginResponse.js';
import { LogoutResponse } from './Model/LogoutResponse.js';
import { MessagePayload } from './Model/MessagePayload.js';
import { PairingData } from './Model/PairingData.js';
import { PaymentRequest } from './Model/PaymentRequest.js';
import { PaymentResponse } from './Model/PaymentResponse.js';
import { ReconciliationResponse } from './Model/ReconciliationResponse.js';
import { Response } from './Model/Response.js';
import { SaleToPOIMessage } from './Model/SaleToPOIMessage.js';
import { StoredValueRequest } from './Model/StoredValueRequest.js';
import { StoredValueResponse } from './Model/StoredValueResponse.js';
import { TransactionStatusRequest } from './Model/TransactionStatusRequest.js';
import { TransactionStatusResponse } from './Model/TransactionStatusResponse.js';
import {
  ErrorCondition,
  Result,
  UnifyRootCA,
  UnifyURL,
  type UnifyRootCA as UnifyRootCAT,
  type UnifyURL as UnifyURLT,
} from './Model/Types.js';
import { AsyncQueue } from './util/AsyncQueue.js';
import { FusionException, FusionTimeoutException, MessageFormatException, NetworkException } from './util/FusionException.js';
import { LogLevel, type LogEventArgs } from './util/LogLevel.js';
import { TypedEventEmitter } from './util/events.js';
import { WebSocketHeaders } from './util/WebSocketHeaders.js';

const DEFAULT_TEST_URL = 'wss://www.cloudposintegration.io/nexouat1';
const DEFAULT_PRODUCTION_URL = 'wss://nexo.datameshgroup.io:5000';

interface QueuedMessagePayload {
  serviceID: string | undefined;
  messagePayload: MessagePayload;
}

type ConnectState = 'Connected' | 'Connecting' | 'Disconnecting' | 'Disconnected';

export interface FusionClientEvents {
  log: [LogEventArgs];
  connect: [];
  connectError: [];
  disconnect: [];
  loginResponse: [LoginResponse];
  logoutResponse: [LogoutResponse];
  cardAcquisitionResponse: [CardAcquisitionResponse];
  paymentResponse: [PaymentResponse];
  reconciliationResponse: [ReconciliationResponse];
  displayRequest: [DisplayRequest];
  transactionStatusResponse: [TransactionStatusResponse];
  eventNotification: [EventNotification];
  storedValueResponse: [StoredValueResponse];
  balanceInquiryResponse: [BalanceInquiryResponse];
}

export interface FusionClientOptions {
  useTestEnvironment?: boolean;
  webSocketFactory?: IWebSocketFactory;
  messageParser?: IMessageParser;
}

export class FusionClient extends TypedEventEmitter<FusionClientEvents> {
  // Identity
  ServiceID?: string;
  SaleID?: string;
  POIID?: string;
  KEK?: string;

  // Connection config
  URL: UnifyURLT;
  CustomURL?: string;
  RootCA: UnifyRootCAT;
  CustomRootCA?: string;

  // Login & options
  LoginRequest?: LoginRequest;
  private _loginResponse?: LoginResponse;
  get LoginResponse(): LoginResponse | undefined {
    return this._loginResponse;
  }

  ReceiveBufferSize = 1024;
  LogLevel: LogLevel = LogLevel.Debug;
  DefaultTimeoutMs = 60_000;
  DefaultHeartbeatTimeoutMs = 15_000;

  private _loginRequired = true;
  get LoginRequired(): boolean {
    return this._loginRequired;
  }
  set LoginRequired(v: boolean) {
    this._loginRequired = v;
  }

  WebSocketFactory: IWebSocketFactory;
  MessageParser: IMessageParser;

  private _lastSaleToPOIResponse?: SaleToPOIMessage;
  get LastSaleToPOIResponse(): SaleToPOIMessage | undefined {
    return this._lastSaleToPOIResponse;
  }

  /** True if any of the response events have a subscriber. */
  get isEventModeEnabled(): boolean {
    return (
      this.listenerCount('loginResponse') > 0 ||
      this.listenerCount('logoutResponse') > 0 ||
      this.listenerCount('cardAcquisitionResponse') > 0 ||
      this.listenerCount('paymentResponse') > 0 ||
      this.listenerCount('reconciliationResponse') > 0 ||
      this.listenerCount('displayRequest') > 0 ||
      this.listenerCount('transactionStatusResponse') > 0 ||
      this.listenerCount('eventNotification') > 0 ||
      this.listenerCount('storedValueResponse') > 0 ||
      this.listenerCount('balanceInquiryResponse') > 0
    );
  }

  private readonly instanceId: string;
  private ws?: IFusionWebSocket;
  private cts?: AbortController;
  private socketCloseCts?: AbortController;
  private connectState: ConnectState = 'Disconnected';
  private readonly recvQueue = new AsyncQueue<QueuedMessagePayload>();
  private lastTxnServiceID = '';
  private lastMessageRefServiceID = '';

  // Parked request handling for auto-login
  private parkedRequestMessage?: MessagePayload;
  private parkedServiceID?: string;
  private parkedTimeoutMs?: number;

  constructor(options: FusionClientOptions = {}) {
    super();
    const useTest = !!options.useTestEnvironment;
    this.instanceId = randomInt(0, 0xffffffff).toString(16).toUpperCase().padStart(8, '0');
    this.WebSocketFactory = options.webSocketFactory ?? new DefaultWebSocketFactory();
    this.MessageParser =
      options.messageParser ?? new NexoMessageParser({ useTestKeyIdentifier: useTest, enableMACValidation: true });
    this.MessageParser.onLog = (e) => this.fireLog(e.logLevel, e.data, e.exception);
    this.URL = useTest ? UnifyURL.Test : UnifyURL.Production;
    this.RootCA = useTest ? UnifyRootCA.Test : UnifyRootCA.Production;
  }

  /** Generate a fresh ServiceID (UUIDv4, hex-only). */
  updateServiceID(): string {
    this.ServiceID = randomUUID().replace(/-/g, '');
    return this.ServiceID;
  }

  // ---------------- Connect / Disconnect ----------------

  async connectAsync(): Promise<boolean> {
    this.log(LogLevel.Trace, 'connectAsync() called...');
    let urlString = '';
    try {
      if (this.ws?.isOpen) {
        this.log(LogLevel.Trace, 'Skipping connectAsync(). ws.isOpen');
        return true;
      }
      this.connectState = 'Connecting';

      this.cts?.abort();
      this.cts = new AbortController();
      this.socketCloseCts?.abort();
      this.socketCloseCts = new AbortController();

      switch (this.URL) {
        case UnifyURL.Test:
          urlString = DEFAULT_TEST_URL;
          break;
        case UnifyURL.Production:
          urlString = DEFAULT_PRODUCTION_URL;
          break;
        case UnifyURL.Custom:
          urlString = this.CustomURL ?? '';
          break;
      }
      const url = new URL(urlString);

      this.log(LogLevel.Debug, `Connecting to ${url}...`);

      const headers = new WebSocketHeaders();
      const cert = this.LoginRequest?.SaleSoftware?.CertificationCode;
      if (cert) headers.CertificationCode = cert;
      if (this.SaleID) headers.SaleID = this.SaleID;
      if (this.POIID) headers.POIID = this.POIID;
      headers.InstanceID = this.instanceId;

      this.ws = await this.WebSocketFactory.connectAsync(
        url,
        headers,
        this.DefaultHeartbeatTimeoutMs,
        this.cts.signal,
        { rootCA: this.RootCA, customRootCA: this.CustomRootCA },
      );

      if (this.ws.isOpen) {
        this.connectState = 'Connected';
        this.wireSocketHandlers();
        this.fireOnConnect();
      }
      this.log(LogLevel.Information, `Connected = ${this.ws.isOpen}`);
      return this.ws.isOpen;
    } catch (e) {
      this.log(
        LogLevel.Error,
        `A network error occured connecting to ${urlString}. ${(e as Error).message}`,
        e as Error,
      );
      this.fireOnConnectError();
      throw new NetworkException((e as Error).message, { cause: e });
    }
  }

  async disconnectAsync(): Promise<void> {
    if (this.connectState === 'Disconnecting' || this.connectState === 'Disconnected') {
      this.log(LogLevel.Trace, `Skipping disconnectAsync()... connectState=${this.connectState}`);
      return;
    }
    this.connectState = 'Disconnecting';
    this.log(LogLevel.Debug, 'Disconnecting...');
    this._loginRequired = true;

    try {
      this.socketCloseCts?.abort();
      this.cts?.abort();
      if (this.ws?.isOpen) await this.ws.close(1000, '');
    } catch (e) {
      this.log(LogLevel.Error, `Exception occured in disconnectAsync(). ${(e as Error).message}`, e as Error);
    } finally {
      this.ws = undefined;
      this.cts = undefined;
      this.connectState = 'Disconnected';
      this.recvQueue.rejectAll(new NetworkException('Socket disconnected', { errorRecoveryRequired: true }));
    }

    this.fireOnDisconnect();
    this.log(LogLevel.Information, 'Disconnected');
  }

  // ---------------- Send ----------------

  async sendAsync(
    requestMessage: MessagePayload,
    opts: { serviceID?: string; ensureConnectedAndLoginComplete?: boolean; timeoutMs?: number } = {},
  ): Promise<SaleToPOIMessage> {
    const serviceID = opts.serviceID ?? this.updateServiceID();
    if (opts.serviceID) this.ServiceID = opts.serviceID;
    const ensure = opts.ensureConnectedAndLoginComplete ?? true;
    const timeoutMs = opts.timeoutMs ?? this.DefaultTimeoutMs;

    this.log(
      LogLevel.Trace,
      `sendAsync processing for ServiceID = ${serviceID}, Message = ${requestMessage.constructor.name}.`,
    );

    let envelope: SaleToPOIMessage;
    let envelopeJson: string;
    try {
      envelope = this.MessageParser.buildSaleToPOIMessage(
        serviceID,
        this.SaleID!,
        this.POIID!,
        this.KEK,
        requestMessage,
      );
      envelopeJson = this.MessageParser.saleToPOIMessageToString(envelope);
    } catch (e) {
      const message = `Error building DataMesh request. ${(e as Error).message}`;
      this.log(LogLevel.Error, message, e as Error);
      throw new MessageFormatException(message, { cause: e });
    }

    if (ensure && (await this.ensureConnectedAndLoginComplete(requestMessage instanceof LoginRequest, timeoutMs))) {
      // Special handling: a cancel-of-parked-payment short-circuit.
      if (
        requestMessage instanceof AbortRequest &&
        this.parkedRequestMessage &&
        (this.parkedRequestMessage instanceof PaymentRequest ||
          this.parkedRequestMessage instanceof StoredValueRequest ||
          this.parkedRequestMessage instanceof BalanceInquiryRequest) &&
        this.parkedServiceID === requestMessage.MessageReference?.ServiceID
      ) {
        this.lastTxnServiceID = this.parkedServiceID ?? '';
        await this.handleParkedRequestMessage(
          new Response({
            Result: Result.Failure,
            ErrorCondition: ErrorCondition.Aborted,
            AdditionalResponse: 'User Cancelled',
          }),
        );
        return envelope;
      }

      this.parkedRequestMessage = requestMessage;
      this.parkedServiceID = serviceID;
      this.parkedTimeoutMs = timeoutMs;
      return envelope;
    }

    // Track lastTxnServiceID for ValidateMessage. Special cases: AbortRequest,
    // InputResponse, PrintResponse don't update it; TransactionStatusRequest
    // records its referenced ServiceID too.
    if (requestMessage instanceof TransactionStatusRequest) {
      this.lastMessageRefServiceID = requestMessage.MessageReference?.ServiceID ?? '';
      this.log(LogLevel.Trace, `Request Message Reference ServiceID = ${this.lastMessageRefServiceID}`);
    }
    if (!(requestMessage instanceof AbortRequest) && !isInputOrPrintResponse(requestMessage)) {
      this.lastTxnServiceID = serviceID;
      this.log(LogLevel.Trace, `LastTxnServiceID = ${this.lastTxnServiceID}`);
    }

    this.log(LogLevel.Information, `TX ${envelopeJson}`);

    if (!this.ws) {
      throw new NetworkException('Socket is not connected');
    }
    try {
      await this.ws.send(envelopeJson);
    } catch (e) {
      const message = `A network error occured sending the request message. ${(e as Error).message}`;
      this.log(LogLevel.Error, message, e as Error);
      await this.disconnectAsync();
      throw new NetworkException(message, { cause: e, errorRecoveryRequired: false });
    }

    return envelope;
  }

  // ---------------- Recv ----------------

  async recvAsync<T extends MessagePayload>(opts: { type?: new () => T; timeoutMs?: number; signal?: AbortSignal } = {}): Promise<T | MessagePayload | null> {
    if (this.isEventModeEnabled) {
      throw new Error('Unable to call recvAsync when event handlers are subscribed');
    }
    const timeoutMs = opts.timeoutMs ?? this.DefaultTimeoutMs;
    const signal = opts.signal ?? AbortSignal.timeout(timeoutMs);

    while (!signal.aborted) {
      let qmp: QueuedMessagePayload;
      try {
        qmp = await this.recvQueue.dequeue(signal);
      } catch (e) {
        if (this.socketCloseCts?.signal.aborted) {
          throw new NetworkException('Socket disconnected', { errorRecoveryRequired: true });
        }
        if (signal.aborted) {
          throw new FusionTimeoutException('Timeout waiting for response', { errorRecoveryRequired: true });
        }
        throw e;
      }

      if (!this.validateMessage(qmp.serviceID, qmp.messagePayload)) continue;
      if (!opts.type) return qmp.messagePayload;
      if (qmp.messagePayload instanceof opts.type) return qmp.messagePayload as T;
      this.log(
        LogLevel.Trace,
        `recvAsync<${opts.type.name}>, discarding response type ${qmp.messagePayload.constructor.name}`,
      );
    }
    return null;
  }

  async sendRecvAsync<T extends MessagePayload>(
    requestMessage: MessagePayload,
    opts: { type: new () => T; timeoutMs?: number } = {} as never,
  ): Promise<T | null> {
    const timeoutMs = opts.timeoutMs ?? this.DefaultTimeoutMs;
    const signal = AbortSignal.timeout(timeoutMs);
    await this.sendAsync(requestMessage, { timeoutMs });
    const result = await this.recvAsync<T>({ type: opts.type, signal });
    return result as T | null;
  }

  // ---------------- Pairing data ----------------

  getPairingData(posName?: string): PairingData {
    if (!this.LoginRequest?.SaleSoftware?.CertificationCode) {
      throw new Error('CertificationCode is required to generate PairingData');
    }
    const data = new PairingData();
    data.SaleID = this.SaleID ?? randomUUID();
    data.PairingPOIID = randomUUID();
    data.KEK = this.KEK ?? PairingData.createKEK();
    data.CertificationCode = this.LoginRequest.SaleSoftware.CertificationCode;
    data.POSName = posName ?? hostname();
    data.Version = 1;
    return data;
  }

  getPairingDataJson(posName?: string): string {
    const data = this.getPairingData(posName);
    const obj: Record<string, unknown> = {};
    for (const f of PairingData.__schema) {
      const v = (data as unknown as Record<string, unknown>)[f.name];
      if (v !== null && v !== undefined) obj[f.jsonName ?? f.name] = v;
    }
    return JSON.stringify(obj);
  }

  // ---------------- Internals ----------------

  /** Returns `true` if an auto-login was triggered and the request should be parked. */
  private async ensureConnectedAndLoginComplete(isLoginInProgress: boolean, timeoutMs: number): Promise<boolean> {
    await this.connectAsync();
    if (!this._loginRequired || isLoginInProgress) return false;
    if (!this.LoginRequest) {
      await this.disconnectAsync();
      throw new Error('Login required, but LoginRequest is null');
    }
    await this.sendAsync(this.LoginRequest, {
      serviceID: this.updateServiceID(),
      ensureConnectedAndLoginComplete: false,
      timeoutMs,
    });
    return true;
  }

  private async handleParkedRequestMessage(response: Response): Promise<void> {
    if (!this.parkedRequestMessage) return;

    if (response.success) {
      await this.sendAsync(this.parkedRequestMessage, {
        serviceID: this.parkedServiceID!,
        ensureConnectedAndLoginComplete: false,
        timeoutMs: this.parkedTimeoutMs ?? this.DefaultTimeoutMs,
      });
    } else {
      const synthetic = this.parkedRequestMessage.createDefaultResponseMessagePayload(response);
      if (synthetic) {
        // The synthetic response carries the parked request's serviceID, not
        // the login's. Update lastTxnServiceID so validateMessage accepts it.
        if (this.parkedServiceID) this.lastTxnServiceID = this.parkedServiceID;
        if (this.isEventModeEnabled) this.fireResponseEvent(synthetic);
        else this.recvQueue.enqueue({ serviceID: this.parkedServiceID, messagePayload: synthetic });
      }
    }
    this.parkedRequestMessage = undefined;
    this.parkedServiceID = undefined;
    this.parkedTimeoutMs = undefined;
  }

  private wireSocketHandlers(): void {
    if (!this.ws) return;
    this.ws.onMessage((data) => this.onMessage(data));
    this.ws.onClose(() => this.onSocketClosed());
    this.ws.onError((err) => this.log(LogLevel.Error, `WebSocket error: ${err.message}`, err));
  }

  private onMessage(data: string): void {
    this.log(LogLevel.Information, `RX ${data}`);

    let messagePayload: MessagePayload | null = null;
    let serviceID: string | undefined;
    try {
      const msg = this.MessageParser.parseSaleToPOIMessage(data, this.KEK);
      this._lastSaleToPOIResponse = msg ?? undefined;
      messagePayload = msg?.MessagePayload ?? null;
      serviceID = msg?.MessageHeader?.ServiceID;
    } catch (e) {
      this.log(LogLevel.Error, `An error occured parsing the json response. ${(e as Error).message}`, e as Error);
    }

    if (!messagePayload) return;

    if (serviceID !== undefined && !this.validateMessage(serviceID, messagePayload)) return;

    if (messagePayload instanceof LoginResponse) {
      this._loginResponse = messagePayload;
    }

    if (this.isEventModeEnabled) {
      this.fireResponseEvent(messagePayload);
    } else {
      this.recvQueue.enqueue({ serviceID, messagePayload });
    }

    if (messagePayload instanceof LogoutResponse) {
      if (messagePayload.Response?.success) this._loginRequired = true;
    }
    if (messagePayload instanceof LoginResponse && this._loginRequired) {
      this._loginRequired = !messagePayload.Response?.success;
      void this.handleParkedRequestMessage(messagePayload.Response ?? new Response());
    }
  }

  private onSocketClosed(): void {
    if (this.connectState === 'Connected' || this.connectState === 'Connecting') {
      void this.disconnectAsync();
    }
  }

  private validateMessage(responseServiceID: string | undefined, payload: MessagePayload): boolean {
    if (payload instanceof EventNotification || !this.lastTxnServiceID) return true;

    if (
      payload instanceof DisplayRequest &&
      !responseServiceID &&
      payload.DisplayOutput?.OutputContent?.getContentAsPlainText()?.includes('Card Tokenization URL')
    ) {
      return true;
    }

    if (!responseServiceID) {
      this.log(
        LogLevel.Error,
        `No ServiceID received in ${payload.constructor.name}. Expected value is ${this.lastTxnServiceID}. Will process the next message instead.`,
      );
      return false;
    }
    if (this.lastTxnServiceID !== responseServiceID) {
      this.log(
        LogLevel.Error,
        `Unexpected ServiceID (${responseServiceID}) received in ${payload.constructor.name}. Expected value is ${this.lastTxnServiceID}. Will process the next message instead.`,
      );
      return false;
    }

    if (payload instanceof TransactionStatusResponse) {
      const tr = payload;
      const refServiceID =
        tr.RepeatedMessageResponse?.MessageHeader?.ServiceID ?? tr.MessageReference?.ServiceID ?? '';
      this.log(LogLevel.Trace, `Response Message Reference ServiceID = ${refServiceID}`);
      if (refServiceID && this.lastMessageRefServiceID && this.lastMessageRefServiceID !== refServiceID) {
        this.log(
          LogLevel.Error,
          `Unexpected Message Reference ServiceID (${refServiceID}) received in ${payload.constructor.name}. Expected value is ${this.lastMessageRefServiceID}. Will process the next message instead.`,
        );
        return false;
      }
    }
    return true;
  }

  private fireResponseEvent(payload: MessagePayload): void {
    try {
      if (payload instanceof LoginResponse) this.emit('loginResponse', payload);
      else if (payload instanceof LogoutResponse) this.emit('logoutResponse', payload);
      else if (payload instanceof CardAcquisitionResponse) this.emit('cardAcquisitionResponse', payload);
      else if (payload instanceof PaymentResponse) this.emit('paymentResponse', payload);
      else if (payload instanceof ReconciliationResponse) this.emit('reconciliationResponse', payload);
      else if (payload instanceof TransactionStatusResponse) this.emit('transactionStatusResponse', payload);
      else if (payload instanceof DisplayRequest) this.emit('displayRequest', payload);
      else if (payload instanceof EventNotification) this.emit('eventNotification', payload);
      else if (payload instanceof StoredValueResponse) this.emit('storedValueResponse', payload);
      else if (payload instanceof BalanceInquiryResponse) this.emit('balanceInquiryResponse', payload);
      else this.log(LogLevel.Error, `Unknown response message ${payload.getMessageDescription()}`);
    } catch (e) {
      this.log(
        LogLevel.Critical,
        `An exception was thrown from POS event handler On${payload.getMessageDescription()}. ${(e as Error).message}`,
      );
    }
  }

  private fireOnConnect(): void {
    try {
      this.emit('connect');
    } catch (e) {
      this.log(LogLevel.Critical, `An exception was thrown from POS event handler onConnect. ${(e as Error).message}`);
    }
  }

  private fireOnConnectError(): void {
    try {
      this.emit('connectError');
    } catch (e) {
      this.log(
        LogLevel.Critical,
        `An exception was thrown from POS event handler onConnectError. ${(e as Error).message}`,
      );
    }
  }

  private fireOnDisconnect(): void {
    try {
      this.emit('disconnect');
    } catch (e) {
      this.log(
        LogLevel.Critical,
        `An exception was thrown from POS event handler onDisconnect. ${(e as Error).message}`,
      );
    }
  }

  private log(logLevel: LogLevel, data: string, exception?: Error): void {
    if (this.listenerCount('log') === 0 || this.LogLevel > logLevel) return;
    this.fireLog(logLevel, data, exception);
  }

  private fireLog(logLevel: LogLevel, data: string, exception?: Error): void {
    try {
      const args: LogEventArgs = {
        logLevel,
        createdDateTime: new Date(),
        data: `[${this.instanceId}] ${data}`,
      };
      if (exception) args.exception = exception;
      this.emit('log', args);
    } catch {
      // intentional swallow — log handler raised
    }
  }
}

function isInputOrPrintResponse(p: MessagePayload): boolean {
  const n = p.constructor.name;
  return n === 'InputResponse' || n === 'PrintResponse';
}

export { FusionException, MessageFormatException, NetworkException, FusionTimeoutException };
