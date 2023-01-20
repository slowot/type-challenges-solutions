// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";
import type { Contains } from "./utils";

type cases = [
  Expect<Equal<FirstUniqueCharIndex<"leetcode">, 0>>,
  Expect<Equal<FirstUniqueCharIndex<"loveleetcode">, 2>>,
  Expect<Equal<FirstUniqueCharIndex<"aabb">, -1>>,
  Expect<Equal<FirstUniqueCharIndex<"">, -1>>
];

// ============= Your Code Here =============
type FirstUniqueCharIndex<
  S extends string,
  Buffer extends string = "",
  Counter extends Array<unknown> = []
> = S extends `${infer First}${infer Rest}`
  ? Contains<`${Buffer}${Rest}`, First> extends true
    ? FirstUniqueCharIndex<Rest, `${Buffer}${First}`, [...Counter, First]>
    : Counter["length"]
  : -1;
