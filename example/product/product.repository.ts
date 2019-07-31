import { Product } from './product.interface';
import { AsyncResult } from '../../fp/async-result';
import { success } from '../../fp/result';

function ProductRepositoryFactory() {
    const DATA = [
        {
            id: 1,
            title: '콜라',
            price: 2000,
        },
        {
            id: 2,
            title: '펩시',
            price: 1000,
        },
    ];
    async function getAll(): AsyncResult<Product[], never> {
        return success(DATA);
    }

    async function getOne(id: number): AsyncResult<Product, never> {
        return success(DATA.find(x => x.id === id));
    }

    return {
        getAll,
        getOne,
    };
}

export const ProductRepository = ProductRepositoryFactory();
export type ProductRepository = typeof ProductRepository;
