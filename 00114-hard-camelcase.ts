// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";
import type { IsLetter } from "./utils";

type cases = [
  Expect<Equal<CamelCase<"foobar">, "foobar">>,
  Expect<Equal<CamelCase<"FOOBAR">, "foobar">>,
  Expect<Equal<CamelCase<"foo_bar">, "fooBar">>,
  Expect<Equal<CamelCase<"foo_bar_hello_world">, "fooBarHelloWorld">>,
  Expect<Equal<CamelCase<"HELLO_WORLD_WITH_TYPES">, "helloWorldWithTypes">>,
  Expect<Equal<CamelCase<"-">, "-">>,
  Expect<Equal<CamelCase<"">, "">>,
  Expect<Equal<CamelCase<"😎">, "😎">>
];

// ============= Your Code Here =============
type CamelCase<
  S extends string,
  Result extends string = Uncapitalize<CamelCaseCore<S>>
> = Result extends "" ? S : Result;

type CamelCaseCore<
  S extends string,
  Word extends string = ""
> = S extends `${infer Head}${infer Rest}`
  ? IsLetter<Head> extends true
    ? CamelCaseCore<Rest, `${Word}${Lowercase<Head>}`>
    : `${Capitalize<Word>}${CamelCaseCore<Rest, "">}`
  : Capitalize<Word>;
