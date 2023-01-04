// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

interface User {
  name?: string;
  age?: number;
  address?: string;
}

interface UserRequiredName {
  name: string;
  age?: number;
  address?: string;
}

interface UserRequiredNameAndAge {
  name: string;
  age: number;
  address?: string;
}

type cases = [
  Expect<Equal<RequiredByKeys<User, "name">, UserRequiredName>>,
  Expect<Equal<RequiredByKeys<User, "name" | "age">, UserRequiredNameAndAge>>,
  Expect<Equal<RequiredByKeys<User>, Required<User>>>,
  // @ts-expect-error
  Expect<Equal<RequiredByKeys<User, "name" | "unknown">, UserRequiredName>>
];

// ============= Your Code Here =============
type ExtraCase = {
  name?: "Jack";
  age?: 36;
  say: "Hello";
};
type ExtraCaseExpected = {
  name: "Jack";
  age?: 36;
  say: "Hello";
};
type ActualResult = RequiredByKeys<ExtraCase, "name">;
type SpecialCase = Expect<Equal<ActualResult, ExtraCaseExpected>>;

type Flatten<T> = {
  [K in keyof T]: T[K];
};
type RequiredByKeys<T, P extends keyof T = keyof T> = Flatten<
  { [K in P]-?: T[K] } & Omit<T, P>
>;
