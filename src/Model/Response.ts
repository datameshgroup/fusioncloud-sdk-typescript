import type { FieldSchema } from '../util/json/schema.js';
import {
  ErrorCondition,
  ErrorConditionEnum,
  Result,
  ResultEnum,
  type ErrorCondition as ErrorConditionT,
  type Result as ResultT,
} from './Types.js';

/**
 * Wrapper around the result of any request. Matches C# `Response`:
 *  - `ErrorCondition` is only serialized when `!success` (Newtonsoft
 *    `ShouldSerializeErrorCondition`).
 *  - The constructor defaults to `Result.Failure / ErrorCondition.Cancel`,
 *    matching the C# default constructor.
 */
export class Response {
  Result: ResultT = Result.Failure;
  ErrorCondition: ErrorConditionT = ErrorCondition.Cancel;
  AdditionalResponse?: string;

  constructor(init?: Partial<Pick<Response, 'Result' | 'ErrorCondition' | 'AdditionalResponse'>>) {
    if (init?.Result !== undefined) this.Result = init.Result;
    if (init?.ErrorCondition !== undefined) this.ErrorCondition = init.ErrorCondition;
    if (init?.AdditionalResponse !== undefined) this.AdditionalResponse = init.AdditionalResponse;
  }

  get success(): boolean {
    return this.Result === Result.Success || this.Result === Result.Partial;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Result', enum: ResultEnum },
    {
      name: 'ErrorCondition',
      enum: ErrorConditionEnum,
      shouldSerialize: (o) => !(o as Response).success,
    },
    { name: 'AdditionalResponse' },
  ];
}
