// ============= Test Cases =============
import type { Equal, Expect, NotEqual } from "./test-utils";
import { IsLetter } from "./utils";

type cases = [
  Expect<Equal<CapitalizeWords<"foobar">, "Foobar">>,
  Expect<Equal<CapitalizeWords<"FOOBAR">, "FOOBAR">>,
  Expect<Equal<CapitalizeWords<"foo bar">, "Foo Bar">>,
  Expect<Equal<CapitalizeWords<"foo bar hello world">, "Foo Bar Hello World">>,
  Expect<Equal<CapitalizeWords<"foo bar.hello,world">, "Foo Bar.Hello,World">>,
  Expect<
    Equal<
      CapitalizeWords<"aa!bb@cc#dd$ee%ff^gg&hh*ii(jj)kk_ll+mm{nn}oo|pp🤣qq">,
      "Aa!Bb@Cc#Dd$Ee%Ff^Gg&Hh*Ii(Jj)Kk_Ll+Mm{Nn}Oo|Pp🤣Qq"
    >
  >,
  Expect<Equal<CapitalizeWords<"">, "">>
];

// ============= Your Code Here =============
type CapitalizeWords<
  S extends string,
  Word extends string = ""
> = S extends `${infer Head}${infer Rest}`
  ? IsLetter<Head> extends true
    ? CapitalizeWords<Rest, `${Word}${Head}`>
    : `${Capitalize<Word>}${Head}${CapitalizeWords<Rest, "">}`
  : Capitalize<Word>;
