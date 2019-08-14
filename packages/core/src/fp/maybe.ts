export type Maybe<T> = T | None;
export type None = undefined | null;

function map<A, B>(fn: (x: A) => B) {
  return (x: Maybe<A>): Maybe<B> => {
    if (x == null) {
      return x as None;
    }
    return fn(x);
  };
}

function apply<A, B>(fn: Maybe<(x: A) => B>) {
  return (x: Maybe<A>): Maybe<B> => {
    if (fn == null) {
      return fn;
    }
    return map(fn)(x);
  };
}

function liftA2<A, B, C>(fn: (x: A) => (y: B) => C) {
  return (x: Maybe<A>) => apply(map(fn)(x));
}

function bind<A, B>(fn: (x: A) => Maybe<B>) {
  return (x: Maybe<A>): Maybe<B> => {
    if (x == null) {
      return x as None;
    }
    return fn(x);
  };
}

function fold<A, B, C>(fn: (x: A) => B, noneFn: () => C) {
  return (x: Maybe<A>): B | C => {
    if (x == null) {
      return noneFn();
    }
    return fn(x);
  };
}

export const Maybe = {
  map,
  apply,
  liftA2,
  bind,
  fold,
};
