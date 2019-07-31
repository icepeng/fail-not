import { controller } from '../../controller';
import { get, Route } from '../../router';
import { ProductService } from './product.service';
import { pipe } from '../../fp/pipe';
import * as AsyncResult from '../../fp/async-result';
import { ok } from '../../response/ok';
import { badRequest } from '../../response/bad-request';
import { Request } from 'express';

function ProductControllerFactory([productService]: [ProductService]): Route[] {
    const getAll = get(
        '',
        pipe(
            productService.getAll,
            AsyncResult.match(products => ok({ products }), err => badRequest(err)),
        ),
    );

    const getOne = get(
        ':id',
        pipe(
            (req: Request) => productService.getOne(+req.params.id),
            AsyncResult.match(products => ok({ products }), err => badRequest(err)),
        ),
    );

    return controller('products', [getAll, getOne]);
}

export const ProductController = ProductControllerFactory([ProductService]);
