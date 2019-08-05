import { expressAdapter } from 'fail-not-core';
import { AppRoutes } from './app.routes';

function bootstrap() {
  const app = expressAdapter(AppRoutes);

  // tslint:disable-next-line: no-console
  console.log('Listening on port 3000');
  app.listen(3000);
}

bootstrap();
