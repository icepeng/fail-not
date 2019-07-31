import { ResponseModel } from './response-model.interface';

export function forbidden<T>(data?: T): ResponseModel<T> {
    return {
        status: 403,
        data,
    };
}
