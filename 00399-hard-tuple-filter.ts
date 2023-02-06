// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";
import type { ArrayFilterOut } from "./utils";

type cases = [
  Expect<Equal<FilterOut<[], never>, []>>,
  Expect<Equal<FilterOut<[never], never>, []>>,
  Expect<Equal<FilterOut<["a", never], never>, ["a"]>>,
  Expect<Equal<FilterOut<[1, never, "a"], never>, [1, "a"]>>,
  Expect<
    Equal<
      FilterOut<
        [never, 1, "a", undefined, false, null],
        never | null | undefined
      >,
      [1, "a", false]
    >
  >,
  Expect<
    Equal<
      FilterOut<[number | null | undefined, never], never | null | undefined>,
      [number | null | undefined]
    >
  >
];

// ============= Your Code Here =============
type BadResult = FilterOut<[1, never, "a"], number>;
type ExpectedResult = ArrayFilterOut<[1, never, "a"], [number]>;

type FilterOut<A extends Array<unknown>, T> = A extends [
  infer Head,
  ...infer Rest
]
  ? [...([Head] extends [T] ? [] : [Head]), ...FilterOut<Rest, T>]
  : [];
