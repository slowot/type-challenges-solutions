// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<OptionalKeys<{ a: number; b?: string }>, "b">>,
  Expect<Equal<OptionalKeys<{ a: undefined; b?: undefined }>, "b">>,
  Expect<
    Equal<
      OptionalKeys<{ a: undefined; b?: undefined; c?: string; d?: null }>,
      "b" | "c" | "d"
    >
  >,
  Expect<Equal<OptionalKeys<{}>, never>>
];

// ============= Your Code Here =============
type GetOptional<
  O extends Record<PropertyKey, unknown>,
  T extends O = Required<O>
> = {
  [K in keyof O as O[K] extends T[K] ? never : K]: O[K];
};

type OptionalKeys<O extends Record<PropertyKey, unknown>> =
  keyof GetOptional<O>;
