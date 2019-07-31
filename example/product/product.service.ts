import { ProductRepository } from './product.repository';
import { pipe } from '../../fp/pipe';
import * as AsyncResult from '../../fp/async-result';
import { failure, success } from '../../fp/result';

function ProductServiceFactory([productRepository]: [ProductRepository]) {
    function getAll() {
        return productRepository.getAll();
    }

    const getOne = pipe(
        (id: number) => productRepository.getOne(id),
        AsyncResult.bind(async product => {
            if (!product) {
                return failure('Not found');
            }
            return success(product);
        }),
    );

    return {
        getAll,
        getOne,
    };
}

export const ProductService = ProductServiceFactory([ProductRepository]);
export type ProductService = typeof ProductService;
