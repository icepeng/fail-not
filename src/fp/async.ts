export function map<T, R>(fn: (x: T) => R) {
  return (xPromise: Promise<T>): Promise<R> => {
    return xPromise.then(fn);
  };
}

export function apply<T, R>(fnPromise: Promise<(x: T) => R>) {
  return (xPromise: Promise<T>): Promise<R> => {
    return fnPromise.then(fn => {
      return map(fn)(xPromise);
    });
  };
}

export function liftA2<T, R, E>(fn: (x: T) => (y: R) => E) {
  return (x: Promise<T>) => apply(map(fn)(x));
}

export function bind<T, R>(fn: (x: T) => Promise<R>) {
  return (xPromise: Promise<T>): Promise<R> => {
    return xPromise.then(fn);
  };
}

export const Async = {
  map,
  apply,
  liftA2,
  bind,
};
