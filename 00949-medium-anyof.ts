// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<
    Equal<AnyOf<[1, "test", true, [1], { name: "test" }, { 1: "test" }]>, true>
  >,
  Expect<Equal<AnyOf<[1, "", false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "test", false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", true, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [1], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [], { name: "test" }]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [], { 1: "test" }]>, true>>,
  Expect<
    Equal<AnyOf<[0, "", false, [], { name: "test" }, { 1: "test" }]>, true>
  >,
  Expect<Equal<AnyOf<[0, "", false, [], {}, undefined, null]>, false>>,
  Expect<Equal<AnyOf<[]>, false>>
];

// ============= Your Code Here =============
type Falsy =
  | 0
  | ""
  | false
  | []
  | undefined
  | null; /* {} is special. eg: 1 extends {} is true */
type AnyOf<T extends Array<unknown>> = AnyOfCore<T> extends []
  ? false
  : Equal<AnyOfCore<T>, [{}]> extends true
  ? false
  : true;
type AnyOfCore<T extends Array<unknown>> = T extends [
  infer ElementType,
  ...infer Rest
]
  ? ElementType extends Falsy
    ? AnyOfCore<Rest>
    : [ElementType, ...AnyOfCore<Rest>]
  : T;
