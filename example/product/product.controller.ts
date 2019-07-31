import { controller } from '../../controller';
import * as AsyncResult from '../../fp/async-result';
import { pipe } from '../../fp/pipe';
import { ok } from '../../response/ok';
import { get, Route } from '../../router';
import { ProductService } from './product.service';

function ProductControllerFactory([productService]: [ProductService]): Route[] {
    const getAll = get(
        '',
        pipe(
            productService.getAll,
            AsyncResult.match(products => ok({ products })),
        ),
    );

    const getOne = get(
        ':id',
        pipe(
            req => productService.getOne(+req.params.id),
            AsyncResult.match(products => ok({ products })),
        ),
    );

    return controller('products', [getAll, getOne]);
}

export const ProductController = ProductControllerFactory([ProductService]);
