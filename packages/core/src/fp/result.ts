import { Lazy, Predicate, Refinement } from './types';

export interface Success<A> {
  success: true;
  value: A;
}

export interface Failure<E> {
  success: false;
  err: E;
}

export type Result<A, E> = Success<A> | Failure<E>;

function success<A>(value: A): Result<A, never> {
  return {
    success: true,
    value,
  };
}

function failure<E>(err: E): Result<never, E> {
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

function tryCatch<A, E>(
  fn: Lazy<A>,
  onError: (reason: unknown) => E,
): Result<A, E> {
  try {
    return success(fn());
  } catch (err) {
    return failure(onError(err));
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
      return failure(errFn(x.err));
    }
    return success(fn(x.value));
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

function bind<A, B, E>(fn: (x: A) => Result<B, E>) {
  return <E2>(x: Result<A, E2>): Result<B, E | E2> => {
    if (x.success === false) {
      return x;
    }
    return fn(x.value);
  };
}

function sequence<A, B, E, E2>([ma, mb]: [Result<A, E>, Result<B, E2>]): Result<
  [A, B],
  E | E2
>;
function sequence<A, B, C, E, E2, E3>([ma, mb, mc]: [
  Result<A, E>,
  Result<B, E2>,
  Result<C, E3>,
]): Result<[A, B, C], E | E2 | E3>;
function sequence<A, B, C, D, E, E2, E3, E4>([ma, mb, mc, md]: [
  Result<A, E>,
  Result<B, E2>,
  Result<C, E3>,
  Result<D, E4>,
]): Result<[A, B, C, D], E | E2 | E3 | E4>;
function sequence<A, E>(mList: Array<Result<A, E>>): Result<A[], E>;
function sequence(mList: Array<Result<any, any>>) {
  const failed = mList.find(r => r.success === false) as Failure<any>;
  if (failed) {
    return failed;
  }

  return success(mList.map(r => (r as Success<any>).value));
}

function traverse<A, B, E>(fn: (a: A) => Result<B, E>) {
  return (arr: A[]) => sequence(arr.map(fn));
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
  liftA2,
  bind,
  sequence,
  traverse,
  tap,
  fold,
};
