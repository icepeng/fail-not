import { ResponseModel } from './response-model.interface';

export function internalServerError<T>(data: T): ResponseModel<T> {
    return {
        status: 500,
        data,
    };
}
