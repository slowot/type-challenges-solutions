// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<GetRequired<{ foo: number; bar?: string }>, { foo: number }>>,
  Expect<
    Equal<GetRequired<{ foo: undefined; bar?: undefined }>, { foo: undefined }>
  >
];

// ============= Your Code Here =============
type GetRequired<
  O extends Record<keyof any, unknown>,
  T extends O = Required<O>
> = {
  [K in keyof O as O[K] extends T[K] ? K : never]: O[K];
};
