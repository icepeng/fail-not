import { Route } from './route';

export type Controller = ReadonlyArray<Route<any>>;

export function controller(path: string, routes: Controller): Controller {
  return routes.map(x => ({ ...x, path: '/' + path + '/' + x.path }));
}
