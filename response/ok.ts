import { ResponseModel } from './response-model.interface';

export function ok<T>(data: T): ResponseModel<T> {
    return {
        status: 200,
        data,
    };
}
