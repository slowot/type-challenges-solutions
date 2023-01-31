// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<ParsePrintFormat<"">, []>>,
  Expect<Equal<ParsePrintFormat<"Any string.">, []>>,
  Expect<Equal<ParsePrintFormat<"The result is %d.">, ["dec"]>>,
  Expect<Equal<ParsePrintFormat<"The result is %%d.">, []>>,
  Expect<Equal<ParsePrintFormat<"The result is %%%d.">, ["dec"]>>,
  Expect<Equal<ParsePrintFormat<"The result is %f.">, ["float"]>>,
  Expect<Equal<ParsePrintFormat<"The result is %h.">, ["hex"]>>,
  Expect<Equal<ParsePrintFormat<"The result is %q.">, []>>,
  Expect<Equal<ParsePrintFormat<"Hello %s: score is %d.">, ["string", "dec"]>>,
  Expect<Equal<ParsePrintFormat<"The result is %">, []>>
];

// ============= Your Code Here =============
type ControlsMap = {
  c: "char";
  s: "string";
  d: "dec";
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
