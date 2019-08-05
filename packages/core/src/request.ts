import { Request as _Request } from 'express';

export interface Request extends _Request {
  body: unknown;
}
