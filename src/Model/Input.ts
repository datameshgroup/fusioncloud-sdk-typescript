import type { FieldSchema } from '../util/json/schema.js';
import { InputCommandEnum, type InputCommand } from './Types.js';

export class Input {
  InputCommand?: InputCommand;
  ConfirmedFlag?: boolean;
  FunctionKey?: number;
  TextInput?: string;
  DigitInput?: number;
  MenuEntryNumber?: number;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'InputCommand', enum: InputCommandEnum },
    { name: 'ConfirmedFlag' },
    { name: 'FunctionKey' },
    { name: 'TextInput' },
    { name: 'DigitInput' },
    { name: 'MenuEntryNumber' },
  ];
}
