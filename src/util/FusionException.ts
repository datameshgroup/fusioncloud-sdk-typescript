import type { ErrorCondition } from '../Model/Types.js';

/**
 * Mirror of the C# exception hierarchy: FusionException → MessageFormatException,
 * NetworkException, FusionTimeoutException.
 *
 * `errorRecoveryRequired` signals the calling app should enter error-recovery
 * flow (typically by issuing an AbortRequest).
 */
export class FusionException extends Error {
  errorRecoveryRequired = false;

  get errorReason(): string {
    return 'Other Exception';
  }

  get errorCondition(): ErrorCondition {
    return 'UnreachableHost' as ErrorCondition;
  }

  constructor(message?: string, options?: { cause?: unknown; errorRecoveryRequired?: boolean }) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = new.target.name;
    if (options?.errorRecoveryRequired !== undefined) {
      this.errorRecoveryRequired = options.errorRecoveryRequired;
    }
  }
}

export class MessageFormatException extends FusionException {
  override get errorReason(): string {
    return 'Message Format Error';
  }
}

export class NetworkException extends FusionException {
  override get errorReason(): string {
    return 'Network Error';
  }
}

/**
 * Renamed from `TimeoutException` to avoid clashing with the JS DOM type and
 * to make sure callers explicitly identify Fusion-specific timeouts.
 */
export class FusionTimeoutException extends FusionException {
  override get errorReason(): string {
    return 'Timeout';
  }
}
