import { ResponseModel } from './response-model.interface';

export function ok<T>(data?: T): ResponseModel<T | undefined> {
    return {
        status: 200,
        data,
    };
}
