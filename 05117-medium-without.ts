// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Without<[1, 2], 1>, [2]>>,
  Expect<Equal<Without<[1, 2, 4, 1, 5], [1, 2]>, [4, 5]>>,
  Expect<Equal<Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>, []>>
];

// ============= Your Code Here =============
type TupleToUnion<A extends Array<unknown>> = A extends [
  infer First,
  ...infer Rest
]
  ? First | TupleToUnion<Rest>
  : never;

type Without<
  A extends Array<unknown>,
  Remove,
  Union = Remove extends Array<unknown> ? TupleToUnion<Remove> : Remove
> = A extends [infer First, ...infer Rest]
  ? First extends Union
    ? Without<Rest, Remove, Union>
    : [First, ...Without<Rest, Remove, Union>]
  : [];
