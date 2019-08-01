import * as Result from './result';

export type AsyncResult<T, R> = Promise<Result.Result<T, R>>;

export function fromResult<T, R>(x: Result.Result<T, R>): AsyncResult<T, R> {
  return Promise.resolve(x);
}

export function map<A, B>(fn: (x: A) => B) {
  return async <E>(xPromise: AsyncResult<A, E>): AsyncResult<B, E> => {
    const x = await xPromise;
    if (x.success === false) {
      return x;
    }
    return Result.success(fn(x.value));
  };
}

export function apply<A, B, E>(fnPromise: AsyncResult<(x: A) => B, E>) {
  return async <E2>(xPromise: AsyncResult<A, E2>): AsyncResult<B, E | E2> => {
    const fn = await fnPromise;
    if (fn.success === false) {
      return fn;
    }
    return map(fn.value)(xPromise);
  };
}

export function liftA2<A, B, C>(fn: (x: A) => (y: B) => C) {
  return <E>(x: AsyncResult<A, E>) => apply(map(fn)(x));
}

export function bind<A, B, E>(fn: (x: A) => AsyncResult<B, E>) {
  return async <E2>(xPromise: AsyncResult<A, E2>): AsyncResult<B, E | E2> => {
    const x = await xPromise;
    if (x.success === false) {
      return x;
    }
    return fn(x.value);
  };
}

export function match<A, B>(
  fn: (x: A) => B,
): <E>(x: AsyncResult<A, E>) => Promise<B | E>;
export function match<A, B, C, E>(
  fn: (x: A) => B,
  errFn: (x: E) => C,
): (x: AsyncResult<A, E>) => Promise<B | C>;
export function match<A, B, C, E>(fn: (x: A) => B, errFn?: (x: E) => C) {
  return async (xPromise: AsyncResult<A, E>): Promise<B | C | E> => {
    const x = await xPromise;
    if (x.success === false) {
      if (!errFn) {
        return x.err;
      }
      return errFn(x.err);
    }
    return fn(x.value);
  };
}
