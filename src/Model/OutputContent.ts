import type { FieldSchema, Newable } from '../util/json/schema.js';
import { OutputFormatEnum, type OutputFormat } from './Types.js';
import { OutputText } from './OutputText.js';
import { PredefinedContent } from './PredefinedContent.js';

/**
 * Mirror of C# `OutputContent`. The `getContentAsPlainText()` helper unpacks
 * XHTML receipts to a printable plain-text form — same rules as the C# version
 * (`<p>`, `<br>`, `<pre>` produce newlines; everything else is text content
 * with collapsed whitespace).
 */
export class OutputContent {
  OutputFormat: OutputFormat = 'Unknown';
  PredefinedContent?: PredefinedContent;
  /** XHTML content. Stored decoded (UTF-8) in memory; base64-encoded on the wire. */
  OutputXHTML?: string;
  OutputText?: OutputText;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'OutputFormat', enum: OutputFormatEnum },
    { name: 'PredefinedContent', type: PredefinedContent as unknown as Newable },
    { name: 'OutputXHTML', base64: true },
    { name: 'OutputText', type: OutputText as unknown as Newable },
  ];

  /** Returns the receipt or display content as plain text. */
  getContentAsPlainText(): string {
    switch (this.OutputFormat) {
      case 'XHTML':
        if (!this.OutputXHTML || !this.OutputXHTML.trim()) return '';
        return xhtmlToPlainText(this.OutputXHTML);
      case 'Text':
        return this.OutputText?.Text ?? '';
      default:
        return '';
    }
  }

  /** Like `getContentAsPlainText` but swallows parse errors. */
  get contentAsPlainText(): string {
    try {
      return this.getContentAsPlainText();
    } catch {
      return 'DATAMESH INVALID FORMAT';
    }
  }
}

const NEW_LINE_TAGS = new Set(['p', 'br', 'br/', 'pre']);
const NEW_LINE = '\r\n';

/**
 * Minimal XHTML → plain-text reducer that matches the behaviour of the C#
 * `OutputContent.ParseNode` walker. We don't pull in a full DOM parser — just
 * tokenize tags and text and collapse whitespace inside non-<pre> blocks.
 */
function xhtmlToPlainText(xhtml: string): string {
  const wrapped = `<html>${xhtml}</html>`;
  const tokens = tokenize(wrapped);
  const out: string[] = [];
  const tagStack: string[] = [];

  for (const t of tokens) {
    if (t.kind === 'open') {
      const name = t.name.toLowerCase();
      if (NEW_LINE_TAGS.has(name) && out.length > 0) out.push(NEW_LINE);
      if (!t.selfClosing) tagStack.push(name);
    } else if (t.kind === 'close') {
      const name = t.name.toLowerCase();
      if (name === 'p' && out.length > 0) out.push(NEW_LINE);
      // Pop matching open tag.
      for (let i = tagStack.length - 1; i >= 0; i--) {
        if (tagStack[i] === name) {
          tagStack.splice(i);
          break;
        }
      }
    } else {
      const inPre = tagStack.length > 0 && tagStack[tagStack.length - 1] === 'pre';
      const text = decodeEntities(t.text);
      const line = inPre ? text : text.trim().replace(/[\t\n\r\s]+/g, ' ');
      if (line) out.push(line);
    }
  }
  return out.join('');
}

type Token =
  | { kind: 'open'; name: string; selfClosing: boolean }
  | { kind: 'close'; name: string }
  | { kind: 'text'; text: string };

function tokenize(xhtml: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < xhtml.length) {
    if (xhtml[i] === '<') {
      const close = xhtml.indexOf('>', i);
      if (close === -1) break;
      const inside = xhtml.slice(i + 1, close).trim();
      if (inside.startsWith('/')) {
        tokens.push({ kind: 'close', name: inside.slice(1).trim() });
      } else {
        const selfClosing = inside.endsWith('/');
        const nameEnd = inside.search(/[\s/>]/);
        const name = nameEnd === -1 ? inside : inside.slice(0, nameEnd);
        tokens.push({ kind: 'open', name, selfClosing });
      }
      i = close + 1;
    } else {
      const next = xhtml.indexOf('<', i);
      const end = next === -1 ? xhtml.length : next;
      tokens.push({ kind: 'text', text: xhtml.slice(i, end) });
      i = end;
    }
  }
  return tokens;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
