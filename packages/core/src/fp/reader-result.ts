import { Reader } from './reader';
import { Failure, Result, Success } from './result';

export type ReaderResult<R, A, B> = Reader<R, Result<A, B>>;

function map<A, B>(fn: (x: A) => B) {
  return <R, E>(mma: ReaderResult<R, A, E>): ReaderResult<R, B, E> => {
    return (r: R) => {
      const ma = mma(r);
      if (ma.success === false) {
        return ma;
      }
      return Result.success(fn(ma.value));
    };
  };
}

function bimap<A, B, E, E2>(fn: (x: A) => B, errFn: (x: E) => E2) {
  return <R>(mma: ReaderResult<R, A, E>): ReaderResult<R, B, E2> => {
    return (r: R) => {
      const ma = mma(r);
      if (ma.success === false) {
        return Result.failure(errFn(ma.err));
      }
      return Result.success(fn(ma.value));
    };
  };
}

function apply<R, A, B, E>(mfn: ReaderResult<R, (x: A) => B, E>) {
  return <E2>(mma: ReaderResult<R, A, E2>): ReaderResult<R, B, E | E2> => {
    return (r: R) => {
      const fn = mfn(r);
      if (fn.success === false) {
        return fn;
      }
      return map(fn.value)(mma)(r);
    };
  };
}

function liftA2<A, B, C>(fn: (x: A) => (y: B) => C) {
  return <R, E>(x: ReaderResult<R, A, E>) => apply(map(fn)(x));
}

function bind<R, A, B, E>(fn: (x: A) => ReaderResult<R, B, E>) {
  return <E2>(mma: ReaderResult<R, A, E2>): ReaderResult<R, B, E | E2> => {
    return (r: R) => {
      const ma = mma(r);
      if (ma.success === false) {
        return ma;
      }
      return fn(ma.value)(r);
    };
  };
}

function sequence<R, A, B, E, E2>([ma, mb]: [
  ReaderResult<R, A, E>,
  ReaderResult<R, B, E2>,
]): ReaderResult<R, [A, B], E | E2>;
function sequence<R, A, B, C, E, E2, E3>([ma, mb, mc]: [
  ReaderResult<R, A, E>,
  ReaderResult<R, B, E2>,
  ReaderResult<R, C, E3>,
]): ReaderResult<R, [A, B, C], E | E2 | E3>;
function sequence<R, A, B, C, D, E, E2, E3, E4>([ma, mb, mc, md]: [
  ReaderResult<R, A, E>,
  ReaderResult<R, B, E2>,
  ReaderResult<R, C, E3>,
  ReaderResult<R, D, E4>,
]): ReaderResult<R, [A, B, C, D], E | E2 | E3 | E4>;
function sequence<R, A, E>(
  mList: Array<ReaderResult<R, A, E>>,
): ReaderResult<R, A[], E>;
function sequence<R>(mmaList: Array<ReaderResult<any, any, any>>) {
  return (r: R) => {
    const maList = mmaList.map(x => x(r));
    const failed = maList.find(x => x.success === false) as Failure<any>;
    if (failed) {
      return failed;
    }

    return Result.success(maList.map(x => (x as Success<any>).value));
  };
}

function traverse<R, A, B, E>(fn: (a: A) => ReaderResult<R, B, E>) {
  return (arr: A[]) => sequence(arr.map(fn));
}

function tap<A, E>(fn: (x: A) => void, errFn?: (x: E) => void) {
  return <R>(mma: ReaderResult<R, A, E>): ReaderResult<R, A, E> => {
    return (r: R) => {
      const ma = mma(r);
      if (ma.success === false) {
        if (errFn) {
          errFn(ma.err);
        }
        return ma;
      }
      fn(ma.value);
      return ma;
    };
  };
}

function fold<A, B>(
  fn: (x: A) => B,
): <R, E>(x: ReaderResult<R, A, E>) => Reader<R, B | E>;
function fold<A, B, C, E>(
  fn: (x: A) => B,
  errFn: (x: E) => C,
): <R>(x: ReaderResult<R, A, E>) => Reader<R, B | C>;
function fold<A, B, C, E>(fn: (x: A) => B, errFn?: (x: E) => C) {
  return <R>(mma: ReaderResult<R, A, E>): Reader<R, B | C | E> => {
    return (r: R) => {
      const ma = mma(r);
      if (ma.success === false) {
        if (!errFn) {
          return ma.err;
        }
        return errFn(ma.err);
      }
      return fn(ma.value);
    };
  };
}

export const ReaderResult = {
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
