export type Reader<R, A> = (r: R) => A;

function of<R, A>(a: A): Reader<R, A> {
  return (_r: R) => a;
}

function map<A, B>(fn: (a: A) => B) {
  return <R>(a: Reader<R, A>): Reader<R, B> => {
    return (r: R) => fn(a(r));
  };
}

function apply<R, A, B>(fn: Reader<R, (a: A) => B>) {
  return (a: Reader<R, A>): Reader<R, B> => {
    return (r: R) => map(fn(r))(a)(r);
  };
}

function liftA2<R, A, B, C>(fn: (a: A) => (y: B) => C) {
  return (a: Reader<R, A>) => apply(map(fn)(a));
}

function bind<R, A, B>(fn: (x: A) => Reader<R, B>) {
  return (a: Reader<R, A>): Reader<R, B> => {
    return (r: R) => fn(a(r))(r);
  };
}

function ask<R>(): Reader<R, R> {
  return (r: R) => r;
}

export const Reader = {
  of,
  map,
  apply,
  liftA2,
  bind,
  ask,
};
