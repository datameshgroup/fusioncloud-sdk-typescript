import { MessagePayload } from './MessagePayload.js';
import { PrintOutput } from './PrintOutput.js';
import { PrintResponse } from './PrintResponse.js';
import { Response } from './Response.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class PrintRequest extends MessagePayload {
  PrintOutput?: PrintOutput;

  constructor() {
    super(MessageClass.Device, MessageCategory.Print, MessageType.Request);
  }

  /** Plain-text view of the receipt content. */
  getReceiptAsPlainText(): string | null {
    return this.PrintOutput?.OutputContent?.getContentAsPlainText() ?? null;
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const r = new PrintResponse();
    r.Response =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PrintOutput', type: PrintOutput as unknown as Newable },
  ];
}

registerPayload('Print', 'Request', PrintRequest as unknown as Newable);
