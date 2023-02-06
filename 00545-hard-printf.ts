// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Format<"abc">, string>>,
  Expect<Equal<Format<"a%sbc">, (s1: string) => string>>,
  Expect<Equal<Format<"a%dbc">, (d1: number) => string>>,
  Expect<Equal<Format<"a%%dbc">, string>>,
  Expect<Equal<Format<"a%%%dbc">, (d1: number) => string>>,
  Expect<Equal<Format<"a%dbc%s">, (d1: number) => (s1: string) => string>>
];

// ============= Your Code Here =============
type ControlsMap = {
  c: "char";
  s: string;
  d: number;
  o: "oct";
  h: "hex";
  f: "float";
  p: "pointer";
};

type ParsePrintFormat<
  S extends string,
  Flag extends boolean = false
> = S extends `${infer Head}${infer Rest}`
  ? Head extends "%"
    ? ParsePrintFormat<Rest, Flag extends true ? false : true>
    : [
        ...(Flag extends true
          ? Head extends keyof ControlsMap
            ? [ControlsMap[Head]]
            : []
          : []),
        ...ParsePrintFormat<Rest, false>
      ]
  : [];

type Format<T extends string> = FormatCore<ParsePrintFormat<T>>;
type FormatCore<A extends Array<unknown>> = A extends [
  infer Head,
  ...infer Rest
]
  ? (arg: Head) => FormatCore<Rest>
  : string;
