// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<GetRequired<{ foo: number; bar?: string }>, { foo: number }>>,
  Expect<
    Equal<GetRequired<{ foo: undefined; bar?: undefined }>, { foo: undefined }>
  >
];

// ============= Your Code Here =============
type RemoveOptional<T extends Record<keyof any, unknown>> = {
  [K in keyof T]-?: T[K];
};

type GetRequired<
  O extends Record<keyof any, unknown>,
  T = RemoveOptional<O>
> = {
  [K in keyof (O | T) as O[K] extends T[K] ? K : never]: O[K];
};
