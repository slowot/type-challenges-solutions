// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>
];

// ============= Your Code Here =============
type Last_1<T extends Array<unknown>> = T extends [
  infer ElementType,
  ...infer Rest
]
  ? Rest extends []
    ? ElementType
    : Last<Rest>
  : never;

type Last<T extends Array<unknown>> = T extends [
  ...infer Rest,
  infer ElementType
]
  ? ElementType
  : never;
