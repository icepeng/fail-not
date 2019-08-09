import { Lazy } from './types';
import { Failure, Result, Success } from './result';

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

async function tryCatch<T, R>(
  fn: Lazy<Promise<T>>,
  onError: (reason: unknown) => R,
): AsyncResult<T, R> {
  try {
    return Result.success(await fn());
  } catch (err) {
    return Result.failure(onError(err));
  }
}

function map<A, B>(fn: (x: A) => B) {
  return async <E>(
    xPromise: AsyncResult<A, E> | Result<A, E>,
  ): AsyncResult<B, E> => {
    const x = await xPromise;
    if (x.success === false) {
      return x;
    }
    return Result.success(fn(x.value));
  };
}

function bimap<A, B, E, E2>(fn: (x: A) => B, errFn: (x: E) => E2) {
  return async (
    xPromise: AsyncResult<A, E> | Result<A, E>,
  ): AsyncResult<B, E2> => {
    const x = await xPromise;
    if (x.success === false) {
      return Result.failure(errFn(x.err));
    }
    return Result.success(fn(x.value));
  };
}

function apply<A, B, E>(
  fnPromise: AsyncResult<(x: A) => B, E> | Result<(x: A) => B, E>,
) {
  return async <E2>(
    xPromise: AsyncResult<A, E2> | Result<A, E2>,
  ): AsyncResult<B, E | E2> => {
    const fn = await fnPromise;
    if (fn.success === false) {
      return fn;
    }
    return map(fn.value)(xPromise);
  };
}

function liftA2<A, B, C>(fn: (x: A) => (y: B) => C) {
  return <E>(x: AsyncResult<A, E> | Result<A, E>) => apply(map(fn)(x));
}

function sequence<I, A, B, E, E2>(
  fnA: (i: I) => AsyncResult<A, E>,
  fnB: (i: I) => AsyncResult<B, E2>,
): (i: I) => AsyncResult<[A, B], E | E2>;
function sequence<I, A, B, C, E, E2, E3>(
  fnA: (i: I) => AsyncResult<A, E>,
  fnB: (i: I) => AsyncResult<B, E2>,
  fnC: (i: I) => AsyncResult<C, E3>,
): (i: I) => AsyncResult<[A, B, C], E | E2 | E3>;
function sequence<I, A, B, C, D, E, E2, E3, E4>(
  fnA: (i: I) => AsyncResult<A, E>,
  fnB: (i: I) => AsyncResult<B, E2>,
  fnC: (i: I) => AsyncResult<C, E3>,
  fnD: (i: I) => AsyncResult<D, E4>,
): (i: I) => AsyncResult<[A, B, C, D], E | E2 | E3 | E4>;
function sequence(...fns: Array<(a: any) => AsyncResult<any, any>>) {
  return async (i: any) => {
    const results = await Promise.all(fns.map(fn => fn(i)));
    const failed = results.find(r => r.success === false) as Failure<any>;
    if (failed) {
      return failed;
    }

    return success(results.map(r => (r as Success<any>).value));
  };
}

function bind<A, B, E>(fn: (x: A) => AsyncResult<B, E> | Result<B, E>) {
  return async <E2>(
    xPromise: AsyncResult<A, E2> | Result<A, E2>,
  ): AsyncResult<B, E | E2> => {
    const x = await xPromise;
    if (x.success === false) {
      return x;
    }
    return fn(x.value);
  };
}

function tap<A, E>(fn: (x: A) => void, errFn?: (x: E) => void) {
  return async (xPromise: AsyncResult<A, E>): AsyncResult<A, E> => {
    const x = await xPromise;
    if (x.success === false) {
      if (errFn) {
        errFn(x.err);
      }
      return x;
    }
    fn(x.value);
    return x;
  };
}

function fold<A, B>(
  fn: (x: A) => B,
): <E>(x: AsyncResult<A, E>) => Promise<B | E>;
function fold<A, B, C, E>(
  fn: (x: A) => B,
  errFn: (x: E) => C,
): (x: AsyncResult<A, E>) => Promise<B | C>;
function fold<A, B, C, E>(fn: (x: A) => B, errFn?: (x: E) => C) {
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
  tryCatch,
  map,
  bimap,
  apply,
  liftA2,
  sequence,
  bind,
  tap,
  fold,
};
