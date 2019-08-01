export function pipe<T, A>(fnA: (x: T) => A): (x: T) => A;
export function pipe<T, A, B>(fnA: (x: T) => A, fnB: (x: A) => B): (x: T) => B;
export function pipe<T, A, B, C>(
  fnA: (x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
): (x: T) => C;
export function pipe<T, A, B, C, D>(
  fnA: (x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
): (x: T) => D;
export function pipe<T, A, B, C, D, E>(
  fnA: (x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
  fnE: (x: D) => E,
): (x: T) => E;
export function pipe<T, A, B, C, D, E, F>(
  fnA: (x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
  fnE: (x: D) => E,
  fnF: (x: E) => F,
): (x: T) => F;
export function pipe(...fns: Array<(x: any) => any>) {
  return (x: any) => fns.reduce((val, fn) => fn(val), x);
}
