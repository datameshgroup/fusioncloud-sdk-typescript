/**
 * Tiny typed event emitter used by FusionClient. Subclassing Node's built-in
 * EventEmitter is fine, but a self-contained typed version keeps the API
 * surface minimal and side-steps the `any`-typed listener overloads.
 */
export class TypedEventEmitter<TEvents> {
  private readonly handlers = new Map<keyof TEvents, Array<(...args: unknown[]) => void>>();

  on<K extends keyof TEvents>(event: K, handler: (...args: ArgsOf<TEvents[K]>) => void): void {
    const list = this.handlers.get(event) ?? [];
    list.push(handler as (...args: unknown[]) => void);
    this.handlers.set(event, list);
  }

  off<K extends keyof TEvents>(event: K, handler: (...args: ArgsOf<TEvents[K]>) => void): void {
    const list = this.handlers.get(event);
    if (!list) return;
    const i = list.indexOf(handler as (...args: unknown[]) => void);
    if (i >= 0) list.splice(i, 1);
  }

  emit<K extends keyof TEvents>(event: K, ...args: ArgsOf<TEvents[K]>): boolean {
    const list = this.handlers.get(event);
    if (!list || list.length === 0) return false;
    for (const h of list.slice()) {
      try {
        h(...args);
      } catch {
        // Swallow — handlers should not break the emitter.
      }
    }
    return true;
  }

  listenerCount<K extends keyof TEvents>(event: K): number {
    return this.handlers.get(event)?.length ?? 0;
  }
}

type ArgsOf<T> = T extends unknown[] ? T : never;
