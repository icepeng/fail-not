import { Lazy, Refinement, Predicate } from './types';

export interface Success<T> {
  success: true;
  value: T;
}

export interface Failure<T> {
  success: false;
  err: T;
}

export type Result<T, R> = Success<T> | Failure<R>;

function success<T>(value: T): Result<T, never> {
  return {
    success: true,
    value,
  };
}

function failure<T>(err: T): Result<never, T> {
  return {
    success: false,
    err,
  };
}

function isSuccess(value: Result<any, any>) {
  return value.success;
}

function isFailure(value: Result<any, any>) {
  return !value.success;
}

function tryCatch<T, R>(
  fn: Lazy<T>,
  onError: (reason: unknown) => R,
): Result<T, R> {
  try {
    return Result.success(fn());
  } catch (err) {
    return Result.failure(onError(err));
  }
}

function fromPredicate<E, A, B extends A>(
  fn: Refinement<A, B>,
  onFalse: (x: A) => E,
): (x: A) => Result<B, E>;
function fromPredicate<E, A>(
  fn: Predicate<A>,
  onFalse: (x: A) => E,
): (x: A) => Result<A, E> {
  return (x: A) => (fn(x) ? success(x) : failure(onFalse(x)));
}

function map<A, B>(fn: (x: A) => B) {
  return <E>(x: Result<A, E>): Result<B, E> => {
    if (x.success === false) {
      return x;
    }
    return success(fn(x.value));
  };
}

function bimap<A, B, E, E2>(fn: (x: A) => B, errFn: (x: E) => E2) {
  return (x: Result<A, E>): Result<B, E2> => {
    if (x.success === false) {
      return Result.failure(errFn(x.err));
    }
    return Result.success(fn(x.value));
  };
}

function apply<A, B, E>(fn: Result<(x: A) => B, E>) {
  return <E2>(x: Result<A, E2>): Result<B, E | E2> => {
    if (fn.success === false) {
      return fn;
    }
    return map(fn.value)(x);
  };
}

function liftA2<A, B, C>(fn: (x: A) => (y: B) => C) {
  return <E>(x: Result<A, E>) => apply(map(fn)(x));
}

function sequence<I, A, B, E, E2>(
  fnA: (i: I) => Result<A, E>,
  fnB: (i: I) => Result<B, E2>,
): (i: I) => Result<[A, B], E | E2>;
function sequence<I, A, B, C, E, E2, E3>(
  fnA: (i: I) => Result<A, E>,
  fnB: (i: I) => Result<B, E2>,
  fnC: (i: I) => Result<C, E3>,
): (i: I) => Result<[A, B, C], E | E2 | E3>;
function sequence<I, A, B, C, D, E, E2, E3, E4>(
  fnA: (i: I) => Result<A, E>,
  fnB: (i: I) => Result<B, E2>,
  fnC: (i: I) => Result<C, E3>,
  fnD: (i: I) => Result<D, E4>,
): (i: I) => Result<[A, B, C, D], E | E2 | E3 | E4>;
function sequence(...fns: Array<(a: any) => Result<any, any>>) {
  return (i: any) => {
    const results = fns.map(fn => fn(i));
    const failed = results.find(r => r.success === false) as Failure<any>;
    if (failed) {
      return failed;
    }

    return success(results.map(r => (r as Success<any>).value));
  };
}

function bind<T, R, E>(fn: (x: T) => Result<R, E>) {
  return <E2>(x: Result<T, E2>): Result<R, E | E2> => {
    if (x.success === false) {
      return x;
    }
    return fn(x.value);
  };
}

function tap<A, E>(fn: (x: A) => void, errFn?: (x: E) => void) {
  return (x: Result<A, E>): Result<A, E> => {
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

function fold<A, B>(fn: (x: A) => B): <E>(x: Result<A, E>) => B | E;
function fold<A, B, C, E>(
  fn: (x: A) => B,
  errFn: (x: E) => C,
): (x: Result<A, E>) => B | C;
function fold<A, B, C, E>(fn: (x: A) => B, errFn?: (x: E) => C) {
  return (x: Result<A, E>): B | C | E => {
    if (x.success === false) {
      if (!errFn) {
        return x.err;
      }
      return errFn(x.err);
    }
    return fn(x.value);
  };
}

export const Result = {
  success,
  failure,
  isSuccess,
  isFailure,
  tryCatch,
  fromPredicate,
  map,
  bimap,
  apply,
  sequence,
  liftA2,
  bind,
  tap,
  fold,
};
