// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<BEM<"btn", ["price"], []>, "btn__price">>,
  Expect<
    Equal<
      BEM<"btn", ["price"], ["warning", "success"]>,
      "btn__price--warning" | "btn__price--success"
    >
  >,
  Expect<
    Equal<
      BEM<"btn", [], ["small", "medium", "large"]>,
      "btn--small" | "btn--medium" | "btn--large"
    >
  >
];

// ============= Your Code Here =============
type BEM<
  B extends string,
  E extends Array<string>,
  M extends Array<string>
> = `${B}\
${[E[number]] extends [never] ? "" : `__${E[number]}`}\
${[M[number]] extends [never] ? "" : `--${M[number]}`}`;
