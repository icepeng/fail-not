import { Route } from './route';

export function controller(path: string, routes: Route[]): Route[] {
    return routes.map(x => ({ ...x, path: '/' + path + '/' + x.path }));
}
