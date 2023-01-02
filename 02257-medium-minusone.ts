// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  Expect<Equal<MinusOne<1101>, 1100>>,
  Expect<Equal<MinusOne<0>, -1>>
];

// ============= Your Code Here =============
type NumberToString<N extends number> = `${N}`;
type ParseInt<T extends string> =
  RemoveExtraChar<T> extends `${infer Digit extends number}`
    ? Digit
    : "[ParseInt]: Not a Number";
type testParseInt = ParseInt<"+100h001">;
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : "";

type RemoveExtraChar<S extends string> = S extends `${"" | "+" | "-"}0`
  ? "0"
  : S extends `${infer First extends "" | "-" | "+"}0${infer Rest}`
  ? RemoveExtraChar<`${First}${Rest}`>
  : S extends `${"+"}${infer First extends number}${infer Rest}`
  ? `${First}${Rest}`
  : S;
type testRemoveExtraChar = RemoveExtraChar<"+1000001">;
type InternalPlusOne<N extends number> =
  /* Only positive numbers and 0 should be handled, negative numbers should be treated as invalid input */
  ExtractNumber<N>[0] extends "-"
    ? "[InternalPlusOne]: Invalid Input"
    : ReverseString<InternalPlusOneCore<ReverseString<NumberToString<N>>>>;
type InternalMinusOne<N extends number> =
  /* Only positive numbers should be handled, 0 and negative numbers should be treated as illegal input */
  ExtractNumber<N>[0] extends "+"
    ? ReverseString<InternalMinusOneCore<ReverseString<NumberToString<N>>>>
    : "[InternalMinusOne]: Invalid Input";
type InternalPlusOneCore<S extends string> =
  S extends `${infer Digit extends number}${infer Rest}`
    ? Digit extends 9
      ? `0${InternalPlusOneCore<Rest>}`
      : `${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0][Digit]}${Rest}`
    : "1";
type InternalMinusOneCore<S extends string> =
  S extends `${infer Digit extends number}${infer Rest}`
    ? Digit extends 0
      ? `9${InternalMinusOneCore<Rest>}`
      : `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`
    : "[InternalMinusOneCore]: InternalMinusOneCore can only be used in InternalMinusOne";

type ExtractNumberType = ["", 0] | ["-" | "+", number];
type ExtractNumber<N extends number> = N extends 0
  ? ["", 0]
  : `${N}` extends `-${infer Digit extends number}`
  ? ["-", Digit]
  : ["+", N];

type PlusOrMinusOption = "+" | "-";
type PlusOrMinusOne<
  T extends ExtractNumberType,
  Option extends PlusOrMinusOption,
  OppositeOption extends PlusOrMinusOption = Exclude<PlusOrMinusOption, Option>
> = T extends [infer Sign extends "" | "-" | "+", infer Digit extends number]
  ? ParseInt<`${Sign extends OppositeOption
      ? `${OppositeOption}${InternalMinusOne<Digit>}`
      : `${Option}${InternalPlusOne<Digit>}`}`>
  : "[PlusOrMinusOne]: Error";
type MinusOne<N extends number> = PlusOrMinusOne<ExtractNumber<N>, "-">;
type PlusOne<N extends number> = PlusOrMinusOne<ExtractNumber<N>, "+">;

type testMinus0 = MinusOne<-0>;
type testMinus1 = MinusOne<0>;
type testMinus2 = MinusOne<-1>;
type testMinus3 = MinusOne<-2>;
type testMinus4 = MinusOne<1>;
type testMinus5 = MinusOne<9>;
type testMinus6 = MinusOne<19>;

type testPlus0 = PlusOne<-0>;
type testPlus1 = PlusOne<0>;
type testPlus2 = PlusOne<-1>;
type testPlus3 = PlusOne<-2>;
type testPlus4 = PlusOne<1>;
type testPlus5 = PlusOne<9>;
type testPlus6 = PlusOne<19>;
