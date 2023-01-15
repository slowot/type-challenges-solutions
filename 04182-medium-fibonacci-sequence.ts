// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>
];

// ============= Utils =============
type PlusOrMinusOption = "+" | "-";
type SignType = "" | "-" | "+";
type ExtractNumberType = ["", 0] | ["-" | "+", number];
type CarryType = 0 | -1 | 1;

type DigitType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type IncrementDigitList = IncrementDigitListCore;
type IncrementDigitListCore<
  Iterator extends number = 0,
  Result extends Array<unknown> = [Exclude<DigitType, 0>]
> = Result[Iterator] extends never
  ? Result
  : IncrementDigitListCore<
      PlusOne<Iterator>,
      [...Result, Exclude<Result[Iterator], PlusOne<Iterator>>]
    >;

type OptionXNOR<
  Left extends PlusOrMinusOption,
  Right extends PlusOrMinusOption
> = Left extends Right ? "+" : "-";

type OptionNOT<Option extends PlusOrMinusOption> = Exclude<
  PlusOrMinusOption,
  Option
>;

type SortNumber<
  Left extends number,
  Right extends number,
  Option extends ">" | "<" = ">"
> = CompareNumber<Left, Right> extends Option ? [Left, Right] : [Right, Left];

type NegativeNumber<N extends number> =
  NumberToString<N> extends `-${infer Integer extends number}`
    ? Integer
    : ParseInt<`-${N}`>;

type NumberToString<N extends number> = `${N}`;

type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : "";

type ExtractNumber<N extends number> = N extends 0
  ? ["", 0]
  : `${N}` extends `-${infer Integer extends number}`
  ? ["-", Integer]
  : ["+", N];

type RemoveExtraChar<S extends string> = S extends `${SignType}0`
  ? "0"
  : S extends `${infer Sign extends SignType}0${infer Rest}`
  ? RemoveExtraChar<`${Sign}${Rest}`>
  : S extends `${"+"}${infer Integer extends number}`
  ? `${Integer}`
  : S;

type ParseInt<S extends string> =
  RemoveExtraChar<S> extends `${infer Integer extends number}`
    ? Integer
    : never;

type PreFormatNumber<
  Left extends number,
  Right extends number,
  Reversed extends boolean = true,
  Result extends [string, string] = PreFormatNumberCore<
    ReverseString<NumberToString<Left>>,
    ReverseString<NumberToString<Right>>
  >
> = Reversed extends true
  ? Result
  : [ReverseString<Result[0]>, ReverseString<Result[1]>];

type PreFormatNumberCore<
  Left extends string,
  Right extends string,
  LResult extends string = "",
  RResult extends string = ""
> = Left extends `${infer LDigit extends DigitType}${infer LRest}`
  ? Right extends `${infer RDigit extends DigitType}${infer RRest}`
    ? PreFormatNumberCore<
        LRest,
        RRest,
        `${LResult}${LDigit}`,
        `${RResult}${RDigit}`
      >
    : PreFormatNumberCore<Left, "0", LResult, RResult>
  : Right extends ""
  ? [LResult, RResult]
  : PreFormatNumberCore<"0", Right, LResult, RResult>;

type SimplePlus<
  LeftMinusOne extends number,
  RightPlusOne extends number,
  LeftPlusOne extends number = LeftMinusOne,
  RightMinusOne extends number = RightPlusOne
> = LeftMinusOne extends 0
  ? RightPlusOne
  : RightMinusOne extends 0
  ? LeftPlusOne
  : SimplePlus<
      MinusOne<LeftMinusOne>,
      PlusOne<RightPlusOne>,
      PlusOne<LeftPlusOne>,
      MinusOne<RightMinusOne>
    >;

type SimpleMinus<Left extends number, Right extends number> = SimplePlus<
  Left,
  NegativeNumber<Right>
>;

type CalculateDigit<
  Left extends DigitType,
  Right extends DigitType,
  Carry extends CarryType,
  Option extends PlusOrMinusOption,
  NewLeft extends number = Carry extends -1
    ? MinusOne<Left>
    : Carry extends 1
    ? PlusOne<Left>
    : Left
> = Option extends "+"
  ? ExtractDigit<SimplePlus<NewLeft, Right>>
  : ExtractDigit<SimpleMinus<NewLeft, Right>>;

type ExtractDigit<N extends number> = ExtractNumber<N>[0] extends "-"
  ? [-1, SimplePlus<10, N>]
  : NumberToString<
      ExtractNumber<N>[1]
    > extends `1${infer Digit extends DigitType}`
  ? [1, Digit]
  : [0, N];

type CompareNumber<
  Left extends number,
  Right extends number,
  ExtractSign extends [SignType, SignType] = [
    ExtractNumber<Left>[0],
    ExtractNumber<Right>[0]
  ],
  ExtractABS extends [number, number] = [
    ExtractNumber<Left>[1],
    ExtractNumber<Right>[1]
  ]
> = Left extends Right
  ? "="
  : ExtractSign extends ["-", "-"]
  ? Exclude<"<" | ">", CompareABS<ExtractABS[0], ExtractABS[1]>>
  : ExtractSign extends ["-", "+" | ""]
  ? "<"
  : ExtractSign extends ["+" | "", "-"]
  ? ">"
  : CompareABS<ExtractABS[0], ExtractABS[1]>;

type CompareABS<
  Left extends number,
  Right extends number,
  PreFormated extends [string, string] = PreFormatNumber<Left, Right, false>
> = Left extends Right
  ? "="
  : PreFormated[0] extends `${infer LDigit extends DigitType}${infer LRest}`
  ? PreFormated[1] extends `${infer RDigit extends DigitType}${infer RRest}`
    ? CompareDigit<LDigit, RDigit> extends "="
      ? CompareABS<Left, Right, [LRest, RRest]>
      : CompareDigit<LDigit, RDigit>
    : never
  : never;

type CompareDigit<
  Left extends DigitType,
  Right extends DigitType
> = Left extends IncrementDigitList[Right]
  ? ">"
  : Left extends Right
  ? "="
  : "<";

type PlusABSOneCore<S extends string> =
  S extends `${infer Digit extends DigitType}${infer Rest}`
    ? Digit extends 9
      ? `0${PlusABSOneCore<Rest>}`
      : `${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0][Digit]}${Rest}`
    : "1";

type MinusABSOneCore<S extends string> = S extends "0"
  ? "1-"
  : S extends `${infer Digit extends DigitType}${infer Rest}`
  ? Digit extends 0
    ? `9${MinusABSOneCore<Rest>}`
    : `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`
  : never;

type PlusOrMinusABSOneCore<
  S extends string,
  Option extends PlusOrMinusOption
> = Option extends "+" ? PlusABSOneCore<S> : MinusABSOneCore<S>;

type PlusOrMinusABSOne<
  N extends number,
  Option extends PlusOrMinusOption
> = ExtractNumber<N>[0] extends "-"
  ? never
  : ParseInt<
      ReverseString<
        PlusOrMinusABSOneCore<ReverseString<NumberToString<N>>, Option>
      >
    >;

type PlusABSOne<N extends number> = PlusOrMinusABSOne<N, "+">;
type MinusABSOne<N extends number> = PlusOrMinusABSOne<N, "-">;

type PlusOrMinusOne<
  N extends number,
  Option extends PlusOrMinusOption
> = ParseInt<
  ExtractNumber<N>[0] extends OptionNOT<Option>
    ? `${OptionNOT<Option>}${MinusABSOne<ExtractNumber<N>[1]>}`
    : `${Option}${PlusABSOne<ExtractNumber<N>[1]>}`
>;

type MinusOne<N extends number> = PlusOrMinusOne<N, "-">;
type PlusOne<N extends number> = PlusOrMinusOne<N, "+">;

type PlusOrMinus<
  Left extends number,
  Right extends number,
  Option extends PlusOrMinusOption,
  ExtractSign extends [SignType, SignType] = [
    ExtractNumber<Left>[0],
    ExtractNumber<Right>[0]
  ],
  ExtractABS extends [number, number] = [
    ExtractNumber<Left>[1],
    ExtractNumber<Right>[1]
  ]
> = Left extends 0
  ? Option extends "+"
    ? Right
    : NegativeNumber<Right>
  : Right extends 0
  ? Left
  : ExtractSign extends ["-", "-"]
  ? Option extends "+"
    ? NegativeNumber<PlusABS<ExtractABS[0], ExtractABS[1]>>
    : MinusABS<ExtractABS[1], ExtractABS[0]>
  : ExtractSign extends ["-", "+"]
  ? Option extends "+"
    ? MinusABS<ExtractABS[1], ExtractABS[0]>
    : NegativeNumber<PlusABS<ExtractABS[0], ExtractABS[1]>>
  : ExtractSign extends ["+", "-"]
  ? PlusOrMinusABS<ExtractABS[0], ExtractABS[1], OptionNOT<Option>>
  : PlusOrMinusABS<ExtractABS[0], ExtractABS[1], Option>;

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

type PlusOrMinusABS<
  Left extends number,
  Right extends number,
  Option extends PlusOrMinusOption
> = Option extends "+"
  ? ParseInt<ReverseString<PlusABSCore<PreFormatNumber<Left, Right>>>>
  : CompareABS<Left, Right> extends "<"
  ? NegativeNumber<
      ParseInt<ReverseString<MinusABSCore<PreFormatNumber<Right, Left>>>>
    >
  : ParseInt<ReverseString<MinusABSCore<PreFormatNumber<Left, Right>>>>;

type PlusABS<Left extends number, Right extends number> = PlusOrMinusABS<
  Left,
  Right,
  "+"
>;

type MinusABS<Left extends number, Right extends number> = PlusOrMinusABS<
  Left,
  Right,
  "-"
>;

type PlusOrMinusABSCore<
  PreFormated extends [string, string],
  Option extends PlusOrMinusOption,
  Carry extends CarryType = 0
> = PreFormated[0] extends `${infer LDigit extends DigitType}${infer LRest}`
  ? PreFormated[1] extends `${infer RDigit extends DigitType}${infer RRest}`
    ? CalculateDigit<LDigit, RDigit, Carry, Option> extends [
        infer NewCarry extends CarryType,
        infer NewDigit extends DigitType
      ]
      ? `${NewDigit}${PlusOrMinusABSCore<[LRest, RRest], Option, NewCarry>}`
      : never
    : never
  : Carry extends 1
  ? "1"
  : "";

type PlusABSCore<PreFormated extends [string, string]> = PlusOrMinusABSCore<
  PreFormated,
  "+"
>;

type MinusABSCore<PreFormated extends [string, string]> = PlusOrMinusABSCore<
  PreFormated,
  "-"
>;

// ============= Your Code Here =============
type Fibonacci<
  N extends number,
  Previous extends number = 0,
  Current extends number = 1
> = N extends 1
  ? Current
  : Fibonacci<MinusOne<N>, Current, Plus<Previous, Current>>;

type ExtraCase = Expect<Equal<Fibonacci<78>, 8944394323791464>>;
