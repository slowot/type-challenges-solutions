// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<
    Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>
  >
];

// ============= Utils =============
type PlusOrMinusOption = "+" | "-";
type ExtractNumberType = ["", 0] | ["-" | "+", number];

type NumberToString<N extends number> = `${N}`;

type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : "";

type ExtractNumber<N extends number> = N extends 0
  ? ["", 0]
  : `${N}` extends `-${infer Integer extends number}`
  ? ["-", Integer]
  : ["+", N];

type RemoveExtraChar<S extends string> = S extends `${"" | "+" | "-"}0`
  ? "0"
  : S extends `${infer First extends "" | "-" | "+"}0${infer Rest}`
  ? RemoveExtraChar<`${First}${Rest}`>
  : S extends `${"+"}${infer First extends number}${infer Rest}`
  ? `${First}${Rest}`
  : S;
type ParseInt<T extends string> =
  RemoveExtraChar<T> extends `${infer Integer extends number}`
    ? Integer
    : "[ParseInt]: Not a Number";

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

type PlusOrMinusOne<
  T extends ExtractNumberType,
  Option extends PlusOrMinusOption,
  OppositeOption extends PlusOrMinusOption = Exclude<PlusOrMinusOption, Option>
> = T extends [infer Sign extends "" | "-" | "+", infer Integer extends number]
  ? ParseInt<`${Sign extends OppositeOption
      ? `${OppositeOption}${InternalMinusOne<Integer>}`
      : `${Option}${InternalPlusOne<Integer>}`}`>
  : "[PlusOrMinusOne]: Error";

type MinusOne<N extends number> = PlusOrMinusOne<ExtractNumber<N>, "-">;
type PlusOne<N extends number> = PlusOrMinusOne<ExtractNumber<N>, "+">;

// ============= Your Code Here =============
type FlattenDepth<
  T extends Array<unknown>,
  Depth extends number = 1
> = Depth extends 0
  ? T
  : T extends [infer First, ...infer Rest]
  ? First extends Array<unknown>
    ? [...FlattenDepth<First, MinusOne<Depth>>, ...FlattenDepth<Rest, Depth>]
    : [First, ...FlattenDepth<Rest, Depth>]
  : T;
