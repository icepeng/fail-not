import { Product } from './product.interface';
import { AsyncResult } from '../../fp/async-result';
import { success } from '../../fp/result';
import { CreateProductDto } from './dtos/create-product.dto';

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

    async function getOneByTitle(title: string): AsyncResult<Product, never> {
        return success(DATA.find(x => x.title === title));
    }

    async function add(createProductDto: CreateProductDto): AsyncResult<number, never> {
        const id = DATA[DATA.length - 1].id + 1;
        DATA.push({
            id,
            ...createProductDto,
        });
        return success(id);
    }

    return {
        getAll,
        getOne,
        getOneByTitle,
        add,
    };
}

export const ProductRepository = ProductRepositoryFactory();
export type ProductRepository = typeof ProductRepository;
