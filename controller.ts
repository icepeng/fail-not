import { Route } from './router';
import { join } from 'path';

export function controller(path: string, routes: Route[]): Route[] {
    return routes.map(x => ({ ...x, path: join('/', path, x.path) }));
}
