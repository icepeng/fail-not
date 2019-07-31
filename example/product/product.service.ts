import * as AsyncResult from '../../fp/async-result';
import { pipe } from '../../fp/pipe';
import { failure, success } from '../../fp/result';
import { notFound } from '../../response/not-found';
import { ProductRepository } from './product.repository';

function ProductServiceFactory([productRepository]: [ProductRepository]) {
    function getAll() {
        return productRepository.getAll();
    }

    const getOne = pipe(
        (id: number) => productRepository.getOne(id),
        AsyncResult.bind(async product => {
            if (!product) {
                return failure(
                    notFound({
                        message: 'Product not found',
                    } as const),
                );
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
