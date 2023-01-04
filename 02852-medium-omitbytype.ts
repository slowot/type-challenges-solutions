// ============= Test Cases =============
import type { Equal, Expect, ExpectExtends } from "./test-utils";

interface Model {
  name: string;
  count: number;
  isReadonly: boolean;
  isEnable: boolean;
}

type cases = [
  Expect<Equal<OmitByType<Model, boolean>, { name: string; count: number }>>,
  Expect<
    Equal<
      OmitByType<Model, string>,
      { count: number; isReadonly: boolean; isEnable: boolean }
    >
  >,
  Expect<
    Equal<
      OmitByType<Model, number>,
      { name: string; isReadonly: boolean; isEnable: boolean }
    >
  >
];

// ============= Your Code Here =============
type OmitByType<T extends object, U> = {
  [K in keyof T as U extends T[K] ? never : K]: T[K];
};
