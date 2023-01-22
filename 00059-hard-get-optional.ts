// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<GetOptional<{ foo: number; bar?: string }>, { bar?: string }>>,
  Expect<
    Equal<GetOptional<{ foo: undefined; bar?: undefined }>, { bar?: undefined }>
  >
];

// ============= Your Code Here =============
type GetOptional<
  O extends Record<keyof any, unknown>,
  T extends O = Required<O>
> = {
  [K in keyof O as O[K] extends T[K] ? never : K]: O[K];
};
