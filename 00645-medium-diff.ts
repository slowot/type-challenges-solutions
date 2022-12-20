// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type Foo = {
  name: string;
  age: string;
};
type Bar = {
  name: string;
  age: string;
  gender: number;
};
type Coo = {
  name: string;
  gender: number;
};

type cases = [
  Expect<Equal<Diff<Foo, Bar>, { gender: number }>>,
  Expect<Equal<Diff<Bar, Foo>, { gender: number }>>,
  Expect<Equal<Diff<Foo, Coo>, { age: string; gender: number }>>,
  Expect<Equal<Diff<Coo, Foo>, { age: string; gender: number }>>
];

// ============= Your Code Here =============
type a = 1 | 2;
type b = 1 | 3;
type c = a & b;
type Diff<T, U> = {
  [K in Exclude<keyof T | keyof U, keyof T & keyof U>]: K extends keyof T
    ? T[K]
    : K extends keyof U
    ? U[K]
    : never;
};
