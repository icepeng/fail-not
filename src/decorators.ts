import { Request } from './request';

export type Decorator<T> = (req: Request) => T;

export const Req = () => (req: Request) => req;

export const Body = <T = unknown>() => (req: Request) => req.body as T;

export const Param = (key: string) => (req: Request) =>
  req.params[key] as string;

export const Query = (key: string) => (req: Request) =>
  req.query[key] as string;
