import type { FieldSchema, Newable } from '../util/json/schema.js';
import { OutputFormatEnum, type OutputFormat } from './Types.js';
import { OutputText } from './OutputText.js';
import { PredefinedContent } from './PredefinedContent.js';

export class DisplayOutputContent {
  OutputFormat: OutputFormat = 'Unknown';
  PredefinedContent?: PredefinedContent;
  OutputXHTML?: string;
  OutputText?: OutputText;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'OutputFormat', enum: OutputFormatEnum },
    { name: 'PredefinedContent', type: PredefinedContent as unknown as Newable },
    { name: 'OutputXHTML', base64: true },
    { name: 'OutputText', type: OutputText as unknown as Newable },
  ];
}
