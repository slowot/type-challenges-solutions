// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";
import { ExpectFalse, NotEqual } from "./test-utils";

let x = 1;
let y = 1 as const;

type cases1 = [
  Expect<Equal<Integer<1>, 1>>,
  Expect<Equal<Integer<1.1>, never>>,
  Expect<Equal<Integer<1.0>, 1>>,
  Expect<Equal<Integer<typeof x>, never>>,
  Expect<Equal<Integer<typeof y>, 1>>
];

// ============= Your Code Here =============
type Integer<N extends number> = number extends N
  ? never
  : `${N}` extends `${infer Int}.${infer Rest}`
  ? Rest extends `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${infer _}`
    ? never
    : Int
  : N;
