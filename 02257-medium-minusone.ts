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
type SignType = "" | "-" | "+";
type ExtractNumberType = ["", 0] | ["-" | "+", number];
type CarryType = 0 | -1 | 1;

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
  ExtractNumber<N>[0] extends OptionNOT<Option>
    ? `${OptionNOT<Option>}${InternalMinusOne<ExtractNumber<N>[1]>}`
    : `${Option}${InternalPlusOne<ExtractNumber<N>[1]>}`
>;

type MinusOne<N extends number> = PlusOrMinusOne<N, "-">;
type PlusOne<N extends number> = PlusOrMinusOne<N, "+">;

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

// TODO
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
  : Right extends `${infer RDigit extends number}${infer RRest}`
  ? PreFormatNumberCore<"0", Right, LResult, RResult>
  : [LResult, RResult];

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
    >; /* type system can only repeat 999 times, so SimplePlus<1000, 1000> wiil throw a error */

type fsdf = SimpleMinus<3, 32>;
type SimpleMinus<Left extends number, Right extends number> = SimplePlus<
  Left,
  NegativeNumber<Right>
>;

type ExtractDigit<N extends number> = ExtractNumber<N>[0] extends "-"
  ? [-1, SimplePlus<10, N>]
  : NumberToString<
      ExtractNumber<N>[1]
    > extends `1${infer Digit extends DigitType}`
  ? [1, Digit]
  : [0, N];

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

type PlusABS<Left extends number, Right extends number> = ParseInt<
  ReverseString<PlusABSCore<PreFormatNumber<Left, Right>>>
>;

type Plus<
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
> = Left extends 0
  ? Right
  : Right extends 0
  ? Left
  : ExtractSign extends ["-", "-"]
  ? NegativeNumber<PlusABS<ExtractABS[0], ExtractABS[1]>>
  : ExtractSign extends ["-", "+"]
  ? MinusABS<ExtractABS[1], ExtractABS[0]>
  : ExtractSign extends ["+", "-"]
  ? MinusABS<ExtractABS[0], ExtractABS[1]>
  : PlusABS<ExtractABS[0], ExtractABS[1]>;

type Minus<
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
> = Left extends 0
  ? NegativeNumber<Right>
  : Right extends 0
  ? Left
  : ExtractSign extends ["-", "-"]
  ? MinusABS<ExtractABS[1], ExtractABS[0]>
  : ExtractSign extends ["-", "+"]
  ? NegativeNumber<PlusABS<ExtractABS[0], ExtractABS[1]>>
  : ExtractSign extends ["+", "-"]
  ? PlusABS<ExtractABS[0], ExtractABS[1]>
  : MinusABS<ExtractABS[0], ExtractABS[1]>;

type MinusABS<Left extends number, Right extends number> = CompareABS<
  Left,
  Right
> extends "<"
  ? NegativeNumber<
      ParseInt<ReverseString<MinusABSCore<PreFormatNumber<Right, Left>>>>
    >
  : ParseInt<ReverseString<MinusABSCore<PreFormatNumber<Left, Right>>>>;

// Left must be bigger than right
type MinusABSCore<
  PreFormated extends [string, string],
  Carry extends CarryType = 0
> = PreFormated[0] extends `${infer LDigit extends DigitType}${infer LRest}`
  ? PreFormated[1] extends `${infer RDigit extends DigitType}${infer RRest}`
    ? CalculateDigit<LDigit, RDigit, Carry, "-"> extends [
        infer NewCarry extends CarryType,
        infer NewDigit extends DigitType
      ]
      ? `${NewDigit}${MinusABSCore<[LRest, RRest], NewCarry>}`
      : never
    : never
  : "";

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

type CompareDigit<
  Left extends DigitType,
  Right extends DigitType
> = Left extends IncrementDigitList[Right]
  ? ">"
  : Left extends Right
  ? "="
  : "<";

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

type PlusABSCore<
  PreFormated extends [string, string],
  Carry extends CarryType = 0
> = PreFormated[0] extends `${infer LDigit extends DigitType}${infer LRest}`
  ? PreFormated[1] extends `${infer RDigit extends DigitType}${infer RRest}`
    ? CalculateDigit<LDigit, RDigit, Carry, "+"> extends [
        infer NewCarry extends CarryType,
        infer NewDigit extends DigitType
      ]
      ? `${NewDigit}${PlusABSCore<[LRest, RRest], NewCarry>}`
      : never
    : never
  : Carry extends 1
  ? "1"
  : "";

type fds = Plus<8944394323791464, 7888788647582928>;
type mi32 = Minus<894744, 785298>;
type te32 = Minus<-8944394323791464, 7888788647582928>;
type ki32 = Minus<4, 4>;
type f93 = Plus<0, 0>;
type k912 = CompareABS<84744, 888888>;
type step1 = PreFormatNumberCore<"3", "23">;
type fk323 = SortNumber<-99, 999>;
type fsd23334 = SortNumber<46, 45, "<">;
type k343 = CompareDigit<5, 4>;
