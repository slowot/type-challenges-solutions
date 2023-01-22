// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<RequiredKeys<{ a: number; b?: string }>, "a">>,
  Expect<Equal<RequiredKeys<{ a: undefined; b?: undefined }>, "a">>,
  Expect<
    Equal<
      RequiredKeys<{ a: undefined; b?: undefined; c: string; d: null }>,
      "a" | "c" | "d"
    >
  >,
  Expect<Equal<RequiredKeys<{}>, never>>
];

// ============= Your Code Here =============
type GetRequired<
  O extends Record<keyof any, unknown>,
  T extends O = Required<O>
> = {
  [K in keyof O as O[K] extends T[K] ? K : never]: O[K];
};

type RequiredKeys<O extends Record<PropertyKey, unknown>> =
  keyof GetRequired<O>;
