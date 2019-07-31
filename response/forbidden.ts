import { ResponseModel } from './response-model.interface';

export function forbidden<T>(data?: T): ResponseModel<T | undefined> {
    return {
        status: 403,
        data,
    };
}
