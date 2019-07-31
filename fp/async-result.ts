import * as Result from './result';

export type AsyncResult<T> = Promise<Result.Result<T>>;

export function map<T, R>(fn: (x: T) => R) {
    return (xPromise: AsyncResult<T>): AsyncResult<R> => {
        return xPromise.then(x => {
            if (x.success === false) {
                return x;
            }
            return Result.success(fn(x.value));
        });
    };
}

export function apply<T, R>(fnPromise: AsyncResult<(x: T) => R>) {
    return (xPromise: AsyncResult<T>): AsyncResult<R> => {
        return fnPromise.then(fn => {
            if (fn.success === false) {
                return fn;
            }
            return map(fn.value)(xPromise);
        });
    };
}

export function liftA2<T, R, E>(fn: (x: T) => (y: R) => E) {
    return (x: AsyncResult<T>) => apply(map(fn)(x));
}

export function bind<T, R>(fn: (x: T) => AsyncResult<R>) {
    return (xPromise: AsyncResult<T>): AsyncResult<R> => {
        return xPromise.then(x => {
            if (x.success === false) {
                return x;
            }
            return fn(x.value);
        });
    };
}

export function match<T, R, E>(fn: (x: T) => R, errFn: (x: string) => E) {
    return (xPromise: AsyncResult<T>): Promise<R | E> => {
        return xPromise.then(x => {
            if (x.success === false) {
                return errFn(x.message);
            }
            return fn(x.value);
        });
    };
}
