import { Request } from './request';
import { ResponseModel } from './response/response-model.interface';

type HTTP_VERB = 'get' | 'post' | 'delete' | 'put' | 'patch';

export type Handler = (
  req: Request,
) => ResponseModel<any> | Promise<ResponseModel<any>>;

export interface Route {
  method: HTTP_VERB;
  path: string;
  handler: Handler;
}

function route(method: HTTP_VERB, path: string, handler: Handler): Route {
  return {
    method,
    path,
    handler,
  };
}

export function get(path: string, handler: Handler) {
  return route('get', path, handler);
}

export function post(path: string, handler: Handler) {
  return route('post', path, handler);
}

export function del(path: string, handler: Handler) {
  return route('delete', path, handler);
}

export function put(path: string, handler: Handler) {
  return route('put', path, handler);
}

export function patch(path: string, handler: Handler) {
  return route('patch', path, handler);
}
