import { ResponseModel } from './response-model.interface';

export function notFound<T>(data?: T): ResponseModel<T | undefined> {
    return {
        status: 404,
        data,
    };
}
