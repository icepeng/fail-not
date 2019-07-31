import { ResponseModel } from './response-model.interface';

export function unauthorized<T>(data?: T): ResponseModel<T> {
    return {
        status: 401,
        data,
    };
}
