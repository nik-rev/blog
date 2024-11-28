/**
 * Renames the keys of U by following the map in T
 * @example
 * type Result = Rename<{ one: "x", three: "z" }, { one: 1, two: 2 }>
 * // Result: { x: 1, two: 2 }
 * */
export type Rename<T, U> = {
  [K in keyof U as K extends keyof T
    ? T[K] extends string
      ? T[K]
      : never
    : K]: K extends keyof U ? U[K] : never;
};
