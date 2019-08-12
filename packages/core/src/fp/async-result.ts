import { Failure, Result, Success } from './result';
import { Lazy } from './types';

export type AsyncResult<A, E> = Promise<Result<A, E>>;

async function success<A>(value: A): AsyncResult<A, never> {
  return {
    success: true,
    value,
  };
}

async function failure<E>(err: E): AsyncResult<never, E> {
  return {
    success: false,
    err,
  };
}

function fromResult<A, E>(x: Result<A, E>): AsyncResult<A, E> {
  return Promise.resolve(x);
}

async function tryCatch<A, E>(
  fn: Lazy<Promise<A>>,
  onError: (reason: unknown) => E,
): AsyncResult<A, E> {
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

async function sequence<A, B, E, E2>([ma, mb]: [
  AsyncResult<A, E>,
  AsyncResult<B, E2>,
]): AsyncResult<[A, B], E | E2>;
async function sequence<A, B, C, E, E2, E3>([ma, mb, mc]: [
  AsyncResult<A, E>,
  AsyncResult<B, E2>,
  AsyncResult<C, E3>,
]): AsyncResult<[A, B, C], E | E2 | E3>;
async function sequence<A, B, C, D, E, E2, E3, E4>([ma, mb, mc, md]: [
  AsyncResult<A, E>,
  AsyncResult<B, E2>,
  AsyncResult<C, E3>,
  AsyncResult<D, E4>,
]): AsyncResult<[A, B, C, D], E | E2 | E3 | E4>;
async function sequence<A, E>(
  mList: Array<AsyncResult<A, E>>,
): AsyncResult<A[], E>;
async function sequence(mmaList: Array<AsyncResult<any, any>>) {
  const maList = await Promise.all(mmaList);
  const failed = maList.find(r => r.success === false) as Failure<any>;
  if (failed) {
    return failed;
  }

  return success(maList.map(r => (r as Success<any>).value));
}

function traverse<A, B, E>(fn: (a: A) => AsyncResult<B, E>) {
  return (arr: A[]) => sequence(arr.map(fn));
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
  bind,
  sequence,
  traverse,
  tap,
  fold,
};
