export interface Success<T> {
    success: true;
    value: T;
}

export interface Failure<T> {
    success: false;
    err: T;
}

export type Result<T, R> = Success<T> | Failure<R>;

export function success<T>(value: T): Result<T, never> {
    return {
        success: true,
        value,
    };
}

export function failure<T>(err: T): Result<never, T> {
    return {
        success: false,
        err,
    };
}

export function map<A, B>(fn: (x: A) => B) {
    return <E>(x: Result<A, E>): Result<B, E> => {
        if (x.success === false) {
            return x;
        }
        return success(fn(x.value));
    };
}

export function apply<A, B, E>(fn: Result<(x: A) => B, E>) {
    return <E2>(x: Result<A, E2>): Result<B, E | E2> => {
        if (fn.success === false) {
            return fn;
        }
        return map(fn.value)(x);
    };
}

export function liftA2<A, B, C>(fn: (x: A) => (y: B) => C) {
    return <E>(x: Result<A, E>) => apply(map(fn)(x));
}

export function bind<T, R, E>(fn: (x: T) => Result<R, E>) {
    return <E2>(x: Result<T, E2>): Result<R, E | E2> => {
        if (x.success === false) {
            return x;
        }
        return fn(x.value);
    };
}

export function match<A, B>(fn: (x: A) => B): <E>(x: Result<A, E>) => B | E;
export function match<A, B, C, E>(fn: (x: A) => B, errFn: (x: E) => C): (x: Result<A, E>) => B | C;
export function match<A, B, C, E>(fn: (x: A) => B, errFn?: (x: E) => C) {
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
