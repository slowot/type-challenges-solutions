// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Chunk<[], 1>, []>>,
  Expect<Equal<Chunk<[1, 2, 3], 1>, [[1], [2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3], 2>, [[1, 2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 2>, [[1, 2], [3, 4]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 5>, [[1, 2, 3, 4]]>>,
  Expect<Equal<Chunk<[1, true, 2, false], 2>, [[1, true], [2, false]]>>
];

// ============= Your Code Here =============
type Chunk<
  A extends Array<unknown>,
  N extends number,
  Chunked extends Array<unknown> = [],
  Result extends Array<unknown> = []
> = Chunked["length"] extends N
  ? Chunk<A, N, [], [...Result, Chunked]>
  : A extends [infer First, ...infer Rest]
  ? Chunk<Rest, N, [...Chunked, First], Result>
  : Chunked extends []
  ? Result
  : [...Result, Chunked];
