// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

interface User {
  name: string;
  age: number;
  address: string;
}

interface UserPartialName {
  name?: string;
  age: number;
  address: string;
}

interface UserPartialNameAndAge {
  name?: string;
  age?: number;
  address: string;
}

type cases = [
  Expect<Equal<PartialByKeys<User, "name">, UserPartialName>>,
  Expect<Equal<PartialByKeys<User, "name" | "age">, UserPartialNameAndAge>>,
  Expect<Equal<PartialByKeys<User>, Partial<User>>>,
  // @ts-expect-error
  Expect<Equal<PartialByKeys<User, "name" | "unknown">, UserPartialName>>
];

// ============= Your Code Here =============
type ExtraCase = {
  name: "Jack";
  age?: 36;
  say: "Hello";
};
type ExtraCaseExpected = {
  name?: "Jack";
  age?: 36;
  say: "Hello";
};
type ActualResult = PartialByKeys<ExtraCase, "name">;
type SpecialCase = Expect<Equal<ActualResult, ExtraCaseExpected>>;

type Flatten<T> = {
  [K in keyof T]: T[K];
};
type PartialByKeys<T, P extends keyof T = keyof T> = Flatten<
  { [K in P]?: T[K] } & Omit<T, P>
>;
