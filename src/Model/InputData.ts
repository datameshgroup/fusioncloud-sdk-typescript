import type { FieldSchema } from '../util/json/schema.js';
import { DeviceEnum, InfoQualifyEnum, InputCommandEnum, type Device, type InfoQualify, type InputCommand } from './Types.js';

export class InputData {
  Device?: Device;
  InfoQualify?: InfoQualify;
  InputCommand?: InputCommand;
  NotifyCardInputFlag?: boolean;
  MaxInputTime?: number;
  ImmediateResponseFlag?: boolean;
  MinLength?: number;
  MaxLength?: number;
  MaxDecimalLength?: number;
  WaitUserValidationFlag?: boolean;
  DefaultInputString?: string;
  StringMask?: string;
  FromRightToLeftFlag?: boolean;
  MaskCharactersFlag?: boolean;
  MenuBackFlag?: boolean;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Device', enum: DeviceEnum },
    { name: 'InfoQualify', enum: InfoQualifyEnum },
    { name: 'InputCommand', enum: InputCommandEnum },
    { name: 'NotifyCardInputFlag' },
    { name: 'MaxInputTime' },
    { name: 'ImmediateResponseFlag' },
    { name: 'MinLength' },
    { name: 'MaxLength' },
    { name: 'MaxDecimalLength' },
    { name: 'WaitUserValidationFlag' },
    { name: 'DefaultInputString' },
    { name: 'StringMask' },
    { name: 'FromRightToLeftFlag' },
    { name: 'MaskCharactersFlag' },
    { name: 'MenuBackFlag' },
  ];
}
