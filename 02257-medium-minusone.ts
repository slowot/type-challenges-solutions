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
type CarryType = 0 | -1 | 1;

type OptionXNOR<
  Left extends PlusOrMinusOption,
  Right extends PlusOrMinusOption
> = Left extends Right ? "+" : "-";

type OptionNot<Option extends PlusOrMinusOption> = Exclude<
  PlusOrMinusOption,
  Option
>;

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
    >; /* type system can only repeat 999 times, so SimplePlusCore<1000, 1000> wiil throw a error */

type fsdf = SimpleMinus<3, 32>;
type SimpleMinus<Left extends number, Right extends number> = SimplePlus<
  Left,
  NegativeNumber<Right>
>;

type ExtractDigit<Digit extends number> = ExtractNumber<Digit>[0] extends "-"
  ? [-1, SimplePlus<10, Digit>]
  : NumberToString<
      ExtractNumber<Digit>[1]
    > extends `1${infer NewDigit extends number}`
  ? [1, NewDigit]
  : [0, Digit];

type CalculateDigit<
  Left extends number,
  Right extends number,
  Carry extends CarryType,
  Option extends PlusOrMinusOption
> = Option extends "+"
  ? ExtractDigit<SimplePlus<SimplePlus<Left, Right>, Carry>>
  : ExtractDigit<SimplePlus<SimpleMinus<Left, Right>, Carry>>;

type BetterPlus<Left extends number, Right extends number> = ParseInt<
  ReverseString<BetterPlusCore<PreFormatNumber<Left, Right>>>
>;

// 需要 对负数进行反运算
type BetterMinus<
  Left extends number,
  Right extends number,
  Result = ParseInt<
    ReverseString<BetterMinusCore<PreFormatNumber<Left, Right>>>
  >
> = [Result] extends [never]
  ? NegativeNumber<BetterMinus<Right, Left>>
  : Result;

// 只处理正数
type BetterMinusCore<
  PreFormat extends [string, string],
  Carry extends CarryType = 0
> = PreFormat[0] extends `${infer LDigit extends number}${infer LRest}`
  ? PreFormat[1] extends `${infer RDigit extends number}${infer RRest}`
    ? `${CalculateDigit<LDigit, RDigit, Carry, "-">[1]}${BetterMinusCore<
        [LRest, RRest],
        CalculateDigit<LDigit, RDigit, Carry, "-">[0]
      >}`
    : "Error: never" /* 两个字符串已预处理为等长 不可能出现这种情况 */
  : Carry extends -1
  ? never
  : "";

// 只处理正数
type BetterPlusCore<
  PreFormat extends [string, string],
  Carry extends CarryType = 0
> = PreFormat[0] extends `${infer LDigit extends number}${infer LRest}`
  ? PreFormat[1] extends `${infer RDigit extends number}${infer RRest}`
    ? `${CalculateDigit<LDigit, RDigit, Carry, "+">[1]}${BetterPlusCore<
        [LRest, RRest],
        CalculateDigit<LDigit, RDigit, Carry, "+">[0]
      >}`
    : "Error: never" /* 两个字符串已预处理为等长 不可能出现这种情况 */
  : Carry extends 1
  ? "1"
  : "";

type fds = BetterPlus<8944394323791464, 7888788647582928>;
type fs32 = BetterPlus<-32, 3>;
type mi32 = BetterMinus<3, -32>;

type step1 = PreFormatNumberCore<"3", "23">;
type fddfs2 = BetterMinusCore<PreFormatNumber<3, 32>>;

// 目前 BetterPlus BetterMinus 里面的left和right均只能为正数， 需要对传入的负数进行处理，反运算即可。 (-3 + -4) => -(3 + 4); (-3 + 4) => (4 - 3); (-3 - -4) => -(3 - 4)
