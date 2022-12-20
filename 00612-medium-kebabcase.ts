// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<KebabCase<"FooBarBaz">, "foo-bar-baz">>,
  Expect<Equal<KebabCase<"fooBarBaz">, "foo-bar-baz">>,
  Expect<Equal<KebabCase<"foo-bar">, "foo-bar">>,
  Expect<Equal<KebabCase<"foo_bar">, "foo_bar">>,
  Expect<Equal<KebabCase<"Foo-Bar">, "foo--bar">>,
  Expect<Equal<KebabCase<"ABC">, "a-b-c">>,
  Expect<Equal<KebabCase<"-">, "-">>,
  Expect<Equal<KebabCase<"">, "">>,
  Expect<Equal<KebabCase<"😎">, "😎">>
];

// ============= Your Code Here =============
type KebabCase<S extends string> = S extends KebabCaseCore<S>
  ? S
  : RemoveHeadDash<KebabCaseCore<S>>;
type RemoveHeadDash<S extends string> = S extends `-${infer Rest}` ? Rest : S;
type KebabCaseCore<S extends string> =
  S extends `${infer ElementType}${infer Rest}`
    ? ElementType extends Uppercase<ElementType>
      ? ElementType extends Lowercase<ElementType>
        ? `${ElementType}${KebabCaseCore<Rest>}`
        : `-${Lowercase<ElementType>}${KebabCaseCore<Rest>}`
      : `${ElementType}${KebabCaseCore<Rest>}`
    : S;
