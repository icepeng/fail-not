import { controller } from '../../controller';
import { Body, Param } from '../../decorators';
import * as AsyncResult from '../../fp/async-result';
import { pipe } from '../../fp/pipe';
import { ok } from '../../response/ok';
import { get, post, Route } from '../../router';
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
            Param('id'),
            id => productService.getOne(+id),
            AsyncResult.match(products => ok({ products })),
        ),
    );

    const add = post(
        '',
        pipe(
            Body,
            body => productService.add(body),
            AsyncResult.match(id => ok({ id })),
        ),
    );

    return controller('products', [getAll, getOne, add]);
}

export const ProductController = ProductControllerFactory([ProductService]);
