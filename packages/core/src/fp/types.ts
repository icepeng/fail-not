export type Predicate<A> = (a: A) => boolean;

export type Refinement<A, B extends A> = (a: A) => a is B;

export type Lazy<T> = () => T;
