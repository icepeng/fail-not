import { Route } from './route';
import { join } from 'path';

export function controller(path: string, routes: Route[]): Route[] {
    return routes.map(x => ({ ...x, path: join('/', path, x.path) }));
}
