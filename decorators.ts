import { Request } from 'express';

export type Decorator = (req: Request) => any;

export const Req = (req: Request) => req;

export const Body = (req: Request) => req.body;

export const Param = (key: string) => (req: Request) => req.params[key] as string;

export const Query = (key: string) => (req: Request) => req.query[key] as string;
