// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Join<["a", "p", "p", "l", "e"], "-">, "a-p-p-l-e">>,
  Expect<Equal<Join<["Hello", "World"], " ">, "Hello World">>,
  Expect<Equal<Join<["2", "2", "2"], 1>, "21212">>,
  Expect<Equal<Join<["o"], "u">, "o">>
];

// ============= Your Code Here =============
type Join<
  A extends Array<unknown>,
  Separator extends string | number
> = A extends [infer First extends string, ...infer Rest]
  ? `${First}${Rest extends [] ? "" : Separator}${Join<Rest, Separator>}`
  : "";
