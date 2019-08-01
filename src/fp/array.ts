export function of<A>(a: A): A[] {
  return [a];
}

export function flatten<A>(mma: A[][]): A[] {
  return mma.reduce((a, b) => a.concat(b));
}

export function map<T, R>(fn: (x: T) => R) {
  return (x: T[]): R[] => {
    return x.map(fn);
  };
}

export function apply<T, R>(fns: Array<(x: T) => R>) {
  return (x: T[]): R[] => {
    return flatten(fns.map(fn => map(fn)(x)));
  };
}

export function liftA2<T, R, E>(fn: (x: T) => (y: R) => E) {
  return (x: T[]) => apply(map(fn)(x));
}

export function bind<T, R>(fn: (x: T) => R[]) {
  return (x: T[]): R[] => {
    return flatten(x.map(fn));
  };
}
