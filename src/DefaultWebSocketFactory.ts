import WebSocket from 'ws';
import { rootCertificates } from 'node:tls';
import type { IFusionWebSocket, IWebSocketFactory } from './IWebSocketFactory.js';
import { rootCaForUnifyRootCa } from './util/CertificateValidation.js';
import type { WebSocketHeaders } from './util/WebSocketHeaders.js';
import type { UnifyRootCA } from './Model/Types.js';

/**
 * Default `IWebSocketFactory` backed by the `ws` library. Sets identity headers
 * on the upgrade request (note: the C# DefaultWebSocketFactory has a documented
 * bug where every header is written with `SaleID`'s value — this implementation
 * uses the correct value per header).
 *
 * Heartbeat: `ws` does NOT auto-ping on a `keepAliveInterval` the way
 * .NET `ClientWebSocket` does, so we drive a `setInterval` ping ourselves.
 */
export class DefaultWebSocketFactory implements IWebSocketFactory {
  async connectAsync(
    url: URL,
    headers: WebSocketHeaders,
    heartbeatTimeoutMs: number,
    signal: AbortSignal,
    options?: { rootCA?: UnifyRootCA; customRootCA?: string },
  ): Promise<IFusionWebSocket> {
    const requestHeaders: Record<string, string> = {};
    if (headers.UserAgent) requestHeaders['X-USER-AGENT'] = headers.UserAgent;
    if (headers.SaleID) requestHeaders['X-SALE-ID'] = headers.SaleID;
    if (headers.POIID) requestHeaders['X-POI-ID'] = headers.POIID;
    if (headers.InstanceID) requestHeaders['X-INSTANCE-ID'] = headers.InstanceID;
    if (headers.CertificationCode)
      requestHeaders['X-CERTIFICATION-CODE'] = headers.CertificationCode;

    const wsOptions: WebSocket.ClientOptions = {
      headers: requestHeaders,
      handshakeTimeout: 30_000,
    };

    // The bundled Test/Production CAs supplement the system trust store
    // rather than replacing it — the live DataMesh hosts present chains that
    // need both. `tls.rootCertificates` snapshots the bundled Node CAs.
    const ca = options?.rootCA
      ? rootCaForUnifyRootCa(options.rootCA, options.customRootCA)
      : undefined;
    if (ca) {
      wsOptions.ca = [...rootCertificates, ca];
      wsOptions.rejectUnauthorized = true;
    }

    const ws = new WebSocket(url.toString(), wsOptions);

    await waitForOpen(ws, signal);

    return new WsAdapter(ws, heartbeatTimeoutMs);
  }
}

function waitForOpen(ws: WebSocket, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      ws.off('open', onOpen);
      ws.off('error', onError);
      signal.removeEventListener('abort', onAbort);
    };
    const onOpen = (): void => {
      cleanup();
      resolve();
    };
    const onError = (err: Error): void => {
      cleanup();
      reject(err);
    };
    const onAbort = (): void => {
      cleanup();
      try {
        ws.terminate();
      } catch {
        // ignore
      }
      reject(new Error('Connect aborted'));
    };
    ws.once('open', onOpen);
    ws.once('error', onError);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

class WsAdapter implements IFusionWebSocket {
  private readonly heartbeatHandle: NodeJS.Timeout | null;

  constructor(
    private readonly ws: WebSocket,
    heartbeatTimeoutMs: number,
  ) {
    this.heartbeatHandle =
      heartbeatTimeoutMs > 0
        ? setInterval(() => {
            try {
              if (ws.readyState === WebSocket.OPEN) ws.ping();
            } catch {
              // ignore — close handler will fire if the socket is actually dead
            }
          }, heartbeatTimeoutMs)
        : null;
    if (this.heartbeatHandle) this.heartbeatHandle.unref?.();
  }

  get isOpen(): boolean {
    return this.ws.readyState === WebSocket.OPEN;
  }

  async send(data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ws.send(data, (err) => (err ? reject(err) : resolve()));
    });
  }

  async close(code = 1000, reason = ''): Promise<void> {
    if (this.heartbeatHandle) clearInterval(this.heartbeatHandle);
    if (
      this.ws.readyState === WebSocket.CLOSED ||
      this.ws.readyState === WebSocket.CLOSING
    ) {
      return;
    }
    await new Promise<void>((resolve) => {
      const onClose = (): void => {
        this.ws.off('close', onClose);
        resolve();
      };
      this.ws.on('close', onClose);
      try {
        this.ws.close(code, reason);
      } catch {
        resolve();
      }
      // Hard timeout — if peer never replies to the close frame, force terminate.
      const timer = setTimeout(() => {
        try {
          this.ws.terminate();
        } catch {
          // ignore
        }
        resolve();
      }, 2000);
      timer.unref?.();
    });
  }

  onMessage(handler: (data: string) => void): void {
    this.ws.on('message', (data) => {
      const text = typeof data === 'string' ? data : (data as Buffer).toString('utf8');
      handler(text);
    });
  }

  onClose(handler: (code: number, reason: string) => void): void {
    this.ws.on('close', (code, reason) => handler(code, reason.toString('utf8')));
  }

  onError(handler: (err: Error) => void): void {
    this.ws.on('error', handler);
  }
}
