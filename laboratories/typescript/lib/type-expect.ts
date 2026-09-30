/**
 * Tiny helper for compile-time expectation documentation.
 * Runtime no-op — used to make intent obvious in experiments.
 */
export function expectType<T>(_value: T): void {
  // intentional no-op
}

export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

export type Assert<T extends true> = T;
