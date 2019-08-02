import { Result } from './result';

export type AsyncResult<T, R> = Promise<Result<T, R>>;

async function success<T>(value: T): AsyncResult<T, never> {
  return {
    success: true,
    value,
  };
}

async function failure<T>(err: T): AsyncResult<never, T> {
  return {
    success: false,
    err,
  };
}

function fromResult<T, R>(x: Result<T, R>): AsyncResult<T, R> {
  return Promise.resolve(x);
}

function map<A, B>(fn: (x: A) => B) {
  return async <E>(xPromise: AsyncResult<A, E>): AsyncResult<B, E> => {
    const x = await xPromise;
    if (x.success === false) {
      return x;
    }
    return Result.success(fn(x.value));
  };
}

function apply<A, B, E>(fnPromise: AsyncResult<(x: A) => B, E>) {
  return async <E2>(xPromise: AsyncResult<A, E2>): AsyncResult<B, E | E2> => {
    const fn = await fnPromise;
    if (fn.success === false) {
      return fn;
    }
    return map(fn.value)(xPromise);
  };
}

function liftA2<A, B, C>(fn: (x: A) => (y: B) => C) {
  return <E>(x: AsyncResult<A, E>) => apply(map(fn)(x));
}

function bind<A, B, E>(fn: (x: A) => AsyncResult<B, E> | Result<B, E>) {
  return async <E2>(xPromise: AsyncResult<A, E2>): AsyncResult<B, E | E2> => {
    const x = await xPromise;
    if (x.success === false) {
      return x;
    }
    return fn(x.value);
  };
}

function match<A, B>(
  fn: (x: A) => B,
): <E>(x: AsyncResult<A, E>) => Promise<B | E>;
function match<A, B, C, E>(
  fn: (x: A) => B,
  errFn: (x: E) => C,
): (x: AsyncResult<A, E>) => Promise<B | C>;
function match<A, B, C, E>(fn: (x: A) => B, errFn?: (x: E) => C) {
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

export const AsyncResult = {
  success,
  failure,
  fromResult,
  map,
  apply,
  liftA2,
  bind,
  match,
};
