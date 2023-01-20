// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<All<[1, 1, 1], 1>, true>>,
  Expect<Equal<All<[1, 1, 2], 1>, false>>,
  Expect<Equal<All<["1", "1", "1"], "1">, true>>,
  Expect<Equal<All<["1", "1", "1"], 1>, false>>,
  Expect<Equal<All<[number, number, number], number>, true>>,
  Expect<Equal<All<[number, number, string], number>, false>>,
  Expect<Equal<All<[null, null, null], null>, true>>,
  Expect<Equal<All<[[1], [1], [1]], [1]>, true>>,
  Expect<Equal<All<[{}, {}, {}], {}>, true>>
];

// ============= Your Code Here =============
type ExtraCase = All<[number, number, 1, number, 2], number>; //should be false

type All<A extends Array<unknown>, Element> = A[number] extends Element
  ? A extends [infer Head, ...infer Rest]
    ? Equal<Head, Element> extends true
      ? All<Rest, Element>
      : false
    : true
  : false;
