import { ResponseModel } from './response-model.interface';

export function badRequest<T>(data?: T): ResponseModel<T | undefined> {
    return {
        status: 400,
        data,
    };
}
