import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Route } from './route';

export function expressAdapter(routes: Route[]) {
    const app = express();
    app.use(bodyParser.json());

    routes.forEach(route => {
        app[route.method](route.path, async (req, res, next) => {
            const result = await route.handler(req);
            return res.status(result.status).json(result.data);
        });
    });

    return app;
}
