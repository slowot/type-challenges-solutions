// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Zip<[], []>, []>>,
  Expect<Equal<Zip<[1, 2], [true, false]>, [[1, true], [2, false]]>>,
  Expect<Equal<Zip<[1, 2, 3], ["1", "2"]>, [[1, "1"], [2, "2"]]>>,
  Expect<Equal<Zip<[], [1, 2, 3]>, []>>,
  Expect<Equal<Zip<[[1, 2]], [3]>, [[[1, 2], 3]]>>
];

// ============= Your Code Here =============
type Zip<
  Left extends Array<unknown>,
  Right extends Array<unknown>,
  Result extends Array<unknown> = []
> = Left extends [infer LFirst, ...infer LRest]
  ? Right extends [infer RFirst, ...infer RRest]
    ? Zip<LRest, RRest, [...Result, [LFirst, RFirst]]>
    : Result
  : Result;
