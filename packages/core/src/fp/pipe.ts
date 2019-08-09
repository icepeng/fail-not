export function pipe<T extends unknown[], A>(
  fnA: (...x: T) => A,
): (...x: T) => A;
export function pipe<T extends unknown[], A, B>(
  fnA: (...x: T) => A,
  fnB: (x: A) => B,
): (...x: T) => B;
export function pipe<T extends unknown[], A, B, C>(
  fnA: (...x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
): (...x: T) => C;
export function pipe<T extends unknown[], A, B, C, D>(
  fnA: (...x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
): (...x: T) => D;
export function pipe<T extends unknown[], A, B, C, D, E>(
  fnA: (...x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
  fnE: (x: D) => E,
): (...x: T) => E;
export function pipe<T extends unknown[], A, B, C, D, E, F>(
  fnA: (...x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
  fnE: (x: D) => E,
  fnF: (x: E) => F,
): (...x: T) => F;
export function pipe<T extends unknown[], A, B, C, D, E, F, G>(
  fnA: (...x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
  fnE: (x: D) => E,
  fnF: (x: E) => F,
  fnG: (x: F) => G,
): (...x: T) => G;
export function pipe<T extends unknown[], A, B, C, D, E, F, G, H>(
  fnA: (...x: T) => A,
  fnB: (x: A) => B,
  fnC: (x: B) => C,
  fnD: (x: C) => D,
  fnE: (x: D) => E,
  fnF: (x: E) => F,
  fnG: (x: F) => G,
  fnH: (x: G) => H,
): (...x: T) => H;
export function pipe(...fns: Array<(...x: unknown[]) => unknown>) {
  return (...x: unknown[]) => {
    const [first, ...others] = fns;
    return others.reduce((val, fn) => fn(val), first(...x));
  };
}
