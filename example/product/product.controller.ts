import { controller } from '../../controller';
import { Body, Param } from '../../decorators';
import * as Array from '../../fp/array';
import * as AsyncResult from '../../fp/async-result';
import { pipe } from '../../fp/pipe';
import { ok } from '../../response/ok';
import { get, post, put, Route } from '../../router';
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

    const edit = put(
        ':id',
        pipe(
            Array.of,
            Array.apply([Body, Param('id')]), // TODO: 이대로는 타입 추론이 안된다
            ([body, id]) => productService.edit(+id, body),
            AsyncResult.match(() => ok()),
        ),
    );

    return controller('products', [getAll, getOne, add, edit]);
}

export const ProductController = ProductControllerFactory([ProductService]);
