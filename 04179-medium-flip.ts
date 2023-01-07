// ============= Test Cases =============
import type { Equal, Expect, NotEqual } from "./test-utils";

type cases = [
  Expect<Equal<{ a: "pi" }, Flip<{ pi: "a" }>>>,
  Expect<NotEqual<{ b: "pi" }, Flip<{ pi: "a" }>>>,
  Expect<Equal<{ 3.14: "pi"; true: "bool" }, Flip<{ pi: 3.14; bool: true }>>>,
  Expect<
    Equal<{ val2: "prop2"; val: "prop" }, Flip<{ prop: "val"; prop2: "val2" }>>
  >
];

// ============= Your Code Here =============
type ToString<T> = T extends
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  ? `${T}`
  : "[ToString]: Error";

type Flip<T extends object> = {
  [K in keyof T as T[K] extends keyof any ? T[K] : ToString<T[K]>]: K;
};
