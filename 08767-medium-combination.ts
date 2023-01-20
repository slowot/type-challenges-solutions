// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<
    Equal<
      Combination<["foo", "bar", "baz"]>,
      | "foo"
      | "bar"
      | "baz"
      | "foo bar"
      | "foo bar baz"
      | "foo baz"
      | "foo baz bar"
      | "bar foo"
      | "bar foo baz"
      | "bar baz"
      | "bar baz foo"
      | "baz foo"
      | "baz foo bar"
      | "baz bar"
      | "baz bar foo"
    >
  >
];

// ============= Your Code Here =============
type Combination<
  A extends Array<string>,
  U extends string = A[number],
  Iterator extends string = U
> = Iterator extends Iterator
  ? Iterator | `${Iterator} ${Combination<A, Exclude<U, Iterator>>}`
  : never;
