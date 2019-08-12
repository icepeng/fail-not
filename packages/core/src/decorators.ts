import { Request } from './request';

export type Decorator<T> = (req: Request) => T;

export const Req = () => (req: Request) => req;

export const Body: {
  <T = unknown>(): (req: Request) => T;
  <T = unknown, R = unknown>(transform: (x: T) => R): (req: Request) => R;
} = <T = unknown, R = unknown>(transform?: (x: T) => R) => (req: Request) =>
  transform ? transform(req.body as T) : (req.body as T);

export const Param: {
  (key: string): (req: Request) => string;
  <T>(key: string, transform: (x: string) => T): (req: Request) => T;
} = <T>(key: string, transform?: (x: string) => T) => (req: Request) =>
  transform ? transform(req.params[key]) : (req.params[key] as string);

export const Query = (key: string) => (req: Request) =>
  req.query[key] as string;
