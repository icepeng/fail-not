export interface Success<T> {
    success: true;
    value: T;
}

export interface Failure {
    success: false;
    message: string;
}

export type Result<T> = Success<T> | Failure;

export function success<T>(value: T): Success<T> {
    return {
        success: true,
        value,
    };
}

export function failure(message: string): Failure {
    return {
        success: false,
        message,
    };
}

export function map<T, R>(fn: (x: T) => R) {
    return (x: Result<T>): Result<R> => {
        if (x.success === false) {
            return x;
        }
        return success(fn(x.value));
    };
}

export function apply<T, R>(fn: Result<(x: T) => R>) {
    return (x: Result<T>): Result<R> => {
        if (fn.success === false) {
            return fn;
        }
        return map(fn.value)(x);
    };
}

export function liftA2<T, R, E>(fn: (x: T) => (y: R) => E) {
    return (x: Result<T>) => apply(map(fn)(x));
}

export function bind<T, R>(fn: (x: T) => Result<R>) {
    return (x: Result<T>): Result<R> => {
        if (x.success === false) {
            return x;
        }
        return fn(x.value);
    };
}
