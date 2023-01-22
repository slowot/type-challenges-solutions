// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

SimpleVue({
  data() {
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
      alert(this.amount);
      alert(this.fullname.toLowerCase());
      alert(this.getRandom());
    },
    test() {
      const fullname = this.fullname;
      const cases: [Expect<Equal<typeof fullname, string>>] = [] as any;
    },
  },
});

// ============= Your Code Here =============
declare function SimpleVue<D, C, M>(options: Option<D, C, M>): unknown;

type Option<Data, Computed, Methods> = {
  data: (this: never) => Data;
  computed?: Computed & ThisType<Data>;
  methods?: Methods &
    ThisType<
      Data &
        Methods & {
          [K in keyof Computed]: Computed[K] extends (
            ...args: Array<unknown>
          ) => infer R
            ? R
            : Computed[K];
        }
    >;
};
