import { controller } from '../../controller';
import { get, Route } from '../../router';
import { ProductService } from './product.service';
import { pipe } from '../../fp/pipe';
import * as AsyncResult from '../../fp/async-result';
import { ok } from '../../response/ok';
import { badRequest } from '../../response/bad-request';

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
