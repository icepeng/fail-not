import { expressAdapter } from 'fail-not-core';
import { ProductControllerFactory } from './product/product.controller';
import { ProductRepositoryFactory } from './product/product.repository';
import { ProductServiceFactory } from './product/product.service';
import { TypeormServiceFactory } from './typeorm.service';

async function bootstrap() {
  const TypeormService = await TypeormServiceFactory();
  const ProductRepository = ProductRepositoryFactory([TypeormService]);
  const ProductService = ProductServiceFactory([ProductRepository]);
  const ProductController = ProductControllerFactory([ProductService]);
  const app = expressAdapter(ProductController);

  // tslint:disable-next-line: no-console
  console.log('Listening on port 3000');
  app.listen(3000);
}

bootstrap();
