// These types are for debugging purposes only.

/** Expands a type by one level */
type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

/** Expands a type by an infinite number of levels */
type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
    ? T extends infer O
      ? { [K in keyof O]: ExpandRecursively<O[K]> }
      : never
    : T;

/** Hide implementation details like `Omit<T, K>` and instead show the object type */
type Resolve<T> = T extends (...args: never) => unknown
  ? T
  : { [K in keyof T]: T[K] };
