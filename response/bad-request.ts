import { ResponseModel } from './response-model.interface';

export function badRequest<T>(data?: T): ResponseModel<T> {
    return {
        status: 400,
        data,
    };
}
