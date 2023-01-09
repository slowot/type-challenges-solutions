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
type PlusOrMinusOption = "+" | "-";
type ExtractNumberType = ["", 0] | ["-" | "+", number];

type OptionXNOR<
  Left extends PlusOrMinusOption,
  Right extends PlusOrMinusOption
> = Left extends Right ? "+" : "-";

type OptionNot<Option extends PlusOrMinusOption> = Exclude<
  PlusOrMinusOption,
  Option
>;

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
    : never;

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
  N extends number,
  Option extends PlusOrMinusOption
> = ParseInt<
  ExtractNumber<N>[0] extends OptionNot<Option>
    ? `${OptionNot<Option>}${InternalMinusOne<ExtractNumber<N>[1]>}`
    : `${Option}${InternalPlusOne<ExtractNumber<N>[1]>}`
>;

type MinusOne<N extends number> = PlusOrMinusOne<N, "-">;
type PlusOne<N extends number> = PlusOrMinusOne<N, "+">;

type PlusOrMinus<
  Left extends number,
  Right extends number,
  Option extends PlusOrMinusOption
> = ExtractNumber<Right>[0] extends PlusOrMinusOption
  ? PlusOrMinus<
      PlusOrMinusOne<Left, OptionXNOR<ExtractNumber<Right>[0], Option>>,
      PlusOrMinusOne<Right, OptionNot<ExtractNumber<Right>[0]>>,
      Option
    >
  : Left;

type Plus<Left extends number, Right extends number> = PlusOrMinus<
  Left,
  Right,
  "+"
>;

type Minus<Left extends number, Right extends number> = PlusOrMinus<
  Left,
  Right,
  "-"
>;

type SinglePlus<Left extends number, Right extends number> = Right extends 0
  ? Left
  : SinglePlus<PlusOne<Left>, MinusOne<Right>>;

type PreFormatNumber<
  Left extends number,
  Right extends number
> = PreFormatNumberCore<
  ReverseString<NumberToString<Left>>,
  ReverseString<NumberToString<Right>>
>;

type PreFormatNumberCore<
  Left extends string,
  Right extends string,
  LResult extends string = "",
  RResult extends string = ""
> = Left extends `${infer LDigit extends number}${infer LRest}`
  ? Right extends `${infer RDigit extends number}${infer RRest}`
    ? PreFormatNumberCore<
        LRest,
        RRest,
        `${LResult}${LDigit}`,
        `${RResult}${RDigit}`
      >
    : PreFormatNumberCore<Left, "0", LResult, RResult>
  : Right extends `${infer RDigit extends number}${infer RRest}`
  ? PreFormatNumberCore<"0", Right, LResult, RResult>
  : [LResult, RResult];

type BetterPlusCore<
  Left extends string,
  Right extends string,
  Carry extends 0 | 1 = 0,
  Result extends string = ""
> = Left extends `${infer LDigit extends number}${infer LRest}`
  ? Right extends `${infer RDigit extends number}${infer RRest}`
    ? NumberToString<
        SinglePlus<SinglePlus<LDigit, RDigit>, Carry>
      > extends `1${infer Digit extends number}`
      ? `${Result}${Digit}${BetterPlusCore<LRest, RRest, 1>}`
      : `${Result}${SinglePlus<
          SinglePlus<LDigit, RDigit>,
          Carry
        >}${BetterPlusCore<LRest, RRest, 0>}`
    : "Error: never"
  : `${Result}${Carry extends 1 ? "1" : ""}`;

type BetterPlus<
  Left extends number,
  Right extends number,
  Temp extends [string, string] = PreFormatNumber<Left, Right>
> = ParseInt<ReverseString<BetterPlusCore<Temp[0], Temp[1]>>>;

type sfds = BetterPlus<1, 10>;
