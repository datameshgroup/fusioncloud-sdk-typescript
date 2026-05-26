import { MessagePayload } from './MessagePayload.js';
import { DisplayOutput } from './DisplayOutput.js';
import { InputData } from './InputData.js';
import { InputResponse } from './InputResponse.js';
import { InputResult } from './InputResult.js';
import { OutputContent } from './OutputContent.js';
import { OutputResult } from './OutputResult.js';
import { OutputText } from './OutputText.js';
import { Response } from './Response.js';
import { ErrorCondition, MessageCategory, MessageClass, MessageType, Result } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class InputRequest extends MessagePayload {
  DisplayOutput?: DisplayOutput;
  InputData?: InputData;

  constructor() {
    super(MessageClass.Device, MessageCategory.Input, MessageType.Request);
  }

  /** Plain-text view of the cashier display, stripping any leading "SHORT | " prefix. */
  getCashierDisplayAsPlainText(): string | null {
    const raw = this.DisplayOutput?.OutputContent?.OutputText?.Text;
    if (!raw) return null;
    const i = raw.indexOf('|');
    if (i > -1 && i < raw.length - 2) return raw.substring(i + 2).trim();
    return raw;
  }

  setCashierDisplayAsPlainText(text: string): void {
    const out = new DisplayOutput();
    out.OutputContent = new OutputContent();
    out.OutputContent.OutputText = new OutputText();
    out.OutputContent.OutputText.Text = text;
    this.DisplayOutput = out;
  }

  override createDefaultResponseMessagePayload(response: Response): MessagePayload {
    const fallback =
      response ??
      new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted, AdditionalResponse: '' });
    const r = new InputResponse();
    r.OutputResult = new OutputResult();
    r.OutputResult.Response = fallback;
    r.InputResult = new InputResult();
    r.InputResult.Response = fallback;
    return r;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'DisplayOutput', type: DisplayOutput as unknown as Newable },
    { name: 'InputData', type: InputData as unknown as Newable },
  ];
}

registerPayload('Input', 'Request', InputRequest as unknown as Newable);
