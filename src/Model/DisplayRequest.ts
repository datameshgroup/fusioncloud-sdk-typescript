import { MessagePayload } from './MessagePayload.js';
import { DisplayOutput } from './DisplayOutput.js';
import { OutputContent } from './OutputContent.js';
import { OutputText } from './OutputText.js';
import { MessageCategory, MessageClass, MessageType } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class DisplayRequest extends MessagePayload {
  DisplayOutput?: DisplayOutput;
  DisableAbortRequestOption?: boolean;

  constructor() {
    // The C# DisplayRequest constructs with MessageClass.Service but the
    // wire payload uses Device — mirroring the C# code 1:1, including this
    // quirk (the actual JSON uses what's in MessageHeader, set by Unify).
    super(MessageClass.Service, MessageCategory.Display, MessageType.Request);
  }

  /** Plain-text view of the cashier display, stripping any leading "SHORT | " prefix. */
  getCashierDisplayAsPlainText(): string | null {
    const raw = this.DisplayOutput?.OutputContent?.OutputText?.Text;
    if (!raw) return null;
    const i = raw.indexOf('|');
    if (i > -1 && i < raw.length - 2) return raw.substring(i + 2).trim();
    return raw;
  }

  /** Convenience constructor for plain-text display output. */
  setCashierDisplayAsPlainText(text: string): void {
    const out = new DisplayOutput();
    out.OutputContent = new OutputContent();
    out.OutputContent.OutputText = new OutputText();
    out.OutputContent.OutputText.Text = text;
    this.DisplayOutput = out;
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'DisplayOutput', type: DisplayOutput as unknown as Newable },
    { name: 'DisableAbortRequestOption' },
  ];
}

registerPayload('Display', 'Request', DisplayRequest as unknown as Newable);
