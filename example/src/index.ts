import { expressAdapter } from 'fail-not-core';
import { AppControllers } from './app.controllers';

async function bootstrap() {
  const app = await expressAdapter(AppControllers);

  // tslint:disable-next-line: no-console
  console.log('Listening on port 3000');
  app.listen(3000);
}

bootstrap();
