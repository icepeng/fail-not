import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Controller } from './controller';

export async function expressAdapter(controllers: Array<Promise<Controller>>) {
  const app = express();
  app.use(bodyParser.json());

  const routes = await Promise.all(controllers).then(res =>
    res.reduce((arr, x) => [...arr, ...x], []),
  );

  routes.forEach(route => {
    app[route.method](route.path, async (req, res, next) => {
      const result = await route.handler(req);
      return res.status(result.status).json(result.data);
    });
  });

  return app;
}
