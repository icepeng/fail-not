import { Request } from './request';
import { ResponseModel } from './response/response-model.interface';

type HTTP_VERB = 'get' | 'post' | 'delete' | 'put' | 'patch';

export type Handler<T extends ResponseModel> = (req: Request) => T | Promise<T>;

export interface Route<T extends ResponseModel> {
  method: HTTP_VERB;
  path: string;
  handler: Handler<T>;
}

export type Routes = ReadonlyArray<Route<any>>;

function route<T extends ResponseModel>(
  method: HTTP_VERB,
  path: string,
  handler: Handler<T>,
): Route<T> {
  return {
    method,
    path,
    handler,
  };
}

export function get<T extends ResponseModel>(
  path: string,
  handler: Handler<T>,
) {
  return route('get', path, handler);
}

export function post<T extends ResponseModel>(
  path: string,
  handler: Handler<T>,
) {
  return route('post', path, handler);
}

export function del<T extends ResponseModel>(
  path: string,
  handler: Handler<T>,
) {
  return route('delete', path, handler);
}

export function put<T extends ResponseModel>(
  path: string,
  handler: Handler<T>,
) {
  return route('put', path, handler);
}

export function patch<T extends ResponseModel>(
  path: string,
  handler: Handler<T>,
) {
  return route('patch', path, handler);
}

export function prefixRoutes(path: string, routes: Routes): Routes {
  return routes.map(x => ({ ...x, path: '/' + path + '/' + x.path }));
}
