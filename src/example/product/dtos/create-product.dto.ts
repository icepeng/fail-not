import { failure, success } from '../../../fp/result';
import { badRequest } from '../../../response/bad-request';
import { pipe } from '../../../fp/pipe';
import * as Result from '../../../fp/result';

export interface CreateProductDto {
  title: string;

  price: number;
}

function titleNotEmpty(createProductDto: CreateProductDto) {
  if (createProductDto.title === '') {
    return failure(badRequest('Title is empty' as const));
  }
  return success(createProductDto);
}

function titleMax50(createProductDto: CreateProductDto) {
  if (createProductDto.title.length > 50) {
    return failure(badRequest('Title length must <= 50' as const));
  }
  return success(createProductDto);
}

function priceIsPositive(createProductDto: CreateProductDto) {
  if (createProductDto.price <= 0) {
    return failure(badRequest('Price must be greater than 0' as const));
  }
  return success(createProductDto);
}

export const createProductDtoValidator = pipe(
  Result.bind(titleNotEmpty),
  Result.bind(titleMax50),
  Result.bind(priceIsPositive),
);
