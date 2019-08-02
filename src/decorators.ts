import { Request } from './request';

export type Decorator<T> = (req: Request) => T;

export const Req = () => (req: Request) => req;

export const Body = <T = unknown>() => (req: Request) => req.body as T;

export const Param: {
  (key: string): (req: Request) => string;
  <T>(key: string, transform: (x: string) => T): (req: Request) => T;
} = <T>(key: string, transform?: (x: string) => T) => (req: Request) =>
  transform ? transform(req.params[key]) : (req.params[key] as string);

export const Query = (key: string) => (req: Request) =>
  req.query[key] as string;

export function applyMany<A>(fnA: Decorator<A>): (x: Request) => [A];
export function applyMany<A, B>(
  fnA: Decorator<A>,
  fnB: Decorator<B>,
): (x: Request) => [A, B];
export function applyMany<A, B, C>(
  fnA: Decorator<A>,
  fnB: Decorator<B>,
  fnC: Decorator<C>,
): (x: Request) => [A, B, C];
export function applyMany<A, B, C, D>(
  fnA: Decorator<A>,
  fnB: Decorator<B>,
  fnC: Decorator<C>,
  fnD: Decorator<D>,
): (x: Request) => [A, B, C, D];
export function applyMany<A, B, C, D, E>(
  fnA: Decorator<A>,
  fnB: Decorator<B>,
  fnC: Decorator<C>,
  fnD: Decorator<D>,
  fnE: Decorator<E>,
): (x: Request) => [A, B, C, D, E];
export function applyMany<A, B, C, D, E, F>(
  fnA: Decorator<A>,
  fnB: Decorator<B>,
  fnC: Decorator<C>,
  fnD: Decorator<D>,
  fnE: Decorator<E>,
  fnF: Decorator<F>,
): (x: Request) => [A, B, C, D, E, F];
export function applyMany(...decorators: Array<Decorator<any>>) {
  return (req: Request) => decorators.map(decorator => decorator(req));
}
