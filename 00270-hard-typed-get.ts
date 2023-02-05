// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Get<Data, "hello">, "world">>,
  Expect<Equal<Get<Data, "foo.bar.count">, 6>>,
  Expect<Equal<Get<Data, "foo.bar">, { value: "foobar"; count: 6 }>>,
  Expect<Equal<Get<Data, "foo.baz">, false>>,

  Expect<Equal<Get<Data, "no.existed">, never>>
];

type Data = {
  foo: {
    bar: {
      value: "foobar";
      count: 6;
    };
    included: true;
  };
  "foo.baz": false;
  hello: "world";
};

// ============= Your Code Here =============
type ExtraCase = {
  "foo.bar": {
    baz: {
      value: "foobarbaz";
    };
  };
};
type TestExtra = Get<ExtraCase, "foo.bar.baz">;

type Get<T, K, Cache extends string = ""> = T extends object
  ? K extends keyof T
    ? T[K]
    : K extends `${infer Head}.${infer Rest}`
    ? `${Cache}${Head}` extends keyof T
      ? Get<T[`${Cache}${Head}`], Rest>
      : Get<T, Rest, `${Cache}${Head}.`>
    : never
  : never;
