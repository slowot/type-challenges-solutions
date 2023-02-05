// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";
import type { ParseInt } from "./utils";

type cases = [
  Expect<Equal<ToNumber<"0">, 0>>,
  Expect<Equal<ToNumber<"5">, 5>>,
  Expect<Equal<ToNumber<"12">, 12>>,
  Expect<Equal<ToNumber<"27">, 27>>,
  Expect<Equal<ToNumber<"18@7_$%">, never>>
];

// ============= Your Code Here =============
type ToNumber<S extends string> = ParseInt<S>;
