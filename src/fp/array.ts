function of<A>(a: A): A[] {
  return [a];
}

function flatten<A>(mma: A[][]): A[] {
  return mma.reduce((a, b) => a.concat(b));
}

function map<T, R>(fn: (x: T) => R) {
  return (x: T[]): R[] => {
    return x.map(fn);
  };
}

function apply<T, R>(fns: Array<(x: T) => R>) {
  return (x: T[]): R[] => {
    return flatten(fns.map(fn => map(fn)(x)));
  };
}

function liftA2<T, R, E>(fn: (x: T) => (y: R) => E) {
  return (x: T[]) => apply(map(fn)(x));
}

function bind<T, R>(fn: (x: T) => R[]) {
  return (x: T[]): R[] => {
    return flatten(x.map(fn));
  };
}

export const Array = {
  of,
  flatten,
  map,
  apply,
  liftA2,
  bind,
};
