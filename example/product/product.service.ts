import * as AsyncResult from '../../fp/async-result';
import { pipe } from '../../fp/pipe';
import { failure, success } from '../../fp/result';
import { notFound } from '../../response/not-found';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dtos/create-product.dto';
import { badRequest } from '../../response/bad-request';

function ProductServiceFactory([productRepository]: [ProductRepository]) {
    const getAll = () => productRepository.getAll();

    const getOne = pipe(
        productRepository.getOne,
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

    const checkDuplicateTitle = (createProductDto: CreateProductDto) =>
        pipe(
            productRepository.getOneByTitle,
            AsyncResult.bind(async product => {
                if (!!product) {
                    return failure(
                        badRequest({
                            message: 'Duplicate title',
                        } as const),
                    );
                }
                return success(createProductDto);
            }),
        )(createProductDto.title);

    const add = pipe(
        checkDuplicateTitle,
        AsyncResult.bind(productRepository.add),
    );

    return {
        getAll,
        getOne,
        add,
    };
}

export const ProductService = ProductServiceFactory([ProductRepository]);
export type ProductService = typeof ProductService;
