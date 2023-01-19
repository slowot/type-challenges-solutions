// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Unique<[1, 1, 2, 2, 3, 3]>, [1, 2, 3]>>,
  Expect<Equal<Unique<[1, 2, 3, 4, 4, 5, 6, 7]>, [1, 2, 3, 4, 5, 6, 7]>>,
  Expect<Equal<Unique<[1, "a", 2, "b", 2, "a"]>, [1, "a", 2, "b"]>>,
  Expect<
    Equal<
      Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>,
      [string, number, 1, "a", 2, "b"]
    >
  >,
  Expect<
    Equal<
      Unique<[unknown, unknown, any, any, never, never]>,
      [unknown, any, never]
    >
  >
];

// ============= Your Code Here =============
type Contain<A extends Array<unknown>, Element> = A extends [
  infer First,
  ...infer Rest
]
  ? Equal<First, Element> extends true
    ? true
    : Contain<Rest, Element>
  : false;

type Unique<
  A extends Array<unknown>,
  Result extends Array<unknown> = []
> = A extends [infer First, ...infer Rest]
  ? Contain<Result, First> extends true
    ? Unique<Rest, Result>
    : Unique<Rest, [...Result, First]>
  : Result;
