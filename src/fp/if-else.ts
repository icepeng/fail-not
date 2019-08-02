export function ifElse<A, B, C>(fns: {
  if: (a: A) => boolean;
  then: (a: A) => B;
  else: (a: A) => C;
}) {
  return (a: A) => (fns.if(a) ? fns.then(a) : fns.else(a));
}
