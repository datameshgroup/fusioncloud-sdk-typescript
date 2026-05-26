import { MessagePayload } from './MessagePayload.js';
import { LogoutResponse } from './LogoutResponse.js';
import { Response } from './Response.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class LogoutRequest extends MessagePayload {
  MaintenanceAllowed?: boolean;

  constructor() {
    super(MessageClass.Service, MessageCategory.Logout, MessageType.Request);
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new LogoutResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [{ name: 'MaintenanceAllowed' }];
}

registerPayload('Logout', 'Request', LogoutRequest as unknown as Newable);
