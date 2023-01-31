// ============= Test Cases =============
import type { Debug, Equal, Expect, IsAny } from "./test-utils";

class ClassA {}

VueBasicProps({
  props: {
    propA: {},
    propB: { type: String },
    propC: { type: Boolean },
    propD: { type: ClassA },
    propE: { type: [String, Number] },
    propF: RegExp,
  },
  data(this) {
    type PropsType = Debug<typeof this>;
    type cases = [
      Expect<IsAny<PropsType["propA"]>>,
      Expect<Equal<PropsType["propB"], string>>,
      Expect<Equal<PropsType["propC"], boolean>>,
      Expect<Equal<PropsType["propD"], ClassA>>,
      Expect<Equal<PropsType["propE"], string | number>>,
      Expect<Equal<PropsType["propF"], RegExp>>
    ];

    // @ts-expect-error
    this.firstname;
    // @ts-expect-error
    this.getRandom();
    // @ts-expect-error
    this.data();

    return {
      firstname: "Type",
      lastname: "Challenges",
      amount: 10,
    };
  },
  computed: {
    fullname() {
      return `${this.firstname} ${this.lastname}`;
    },
  },
  methods: {
    getRandom() {
      return Math.random();
    },
    hi() {
      alert(this.fullname.toLowerCase());
      alert(this.getRandom());
    },
    test() {
      const fullname = this.fullname;
      const propE = this.propE;
      type cases = [
        Expect<Equal<typeof fullname, string>>,
        Expect<Equal<typeof propE, string | number>>
      ];
    },
  },
});

// ============= Your Code Here =============
type ConstructorType<T> = { new (...args: Array<any>): T & object } | { (): T };

type InferComputed<Computed extends Record<PropertyKey, any>> = {
  [K in keyof Computed]: ReturnType<Computed[K]>;
};

type InferProps<Props extends Record<PropertyKey, unknown>> = {
  [K in keyof Props]: Props[K] extends
    | ConstructorType<infer T>
    | { type: ConstructorType<infer T> | Array<ConstructorType<infer T>> }
    ? T
    : any;
};

type Options<
  Props extends Record<PropertyKey, unknown>,
  Data,
  Computed extends Record<PropertyKey, any>,
  Methods,
  InferredThis = ThisType<
    InferProps<Props> & Data & InferComputed<Computed> & Methods
  >
> = {
  props: Props;
  data(this: InferProps<Props>): Data;
  computed: Computed & InferredThis;
  methods: Methods & InferredThis;
};

declare function VueBasicProps<
  P extends Record<PropertyKey, unknown>,
  D,
  C extends Record<PropertyKey, any>,
  M
>(options: Options<P, D, C, M>): unknown;
