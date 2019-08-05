import { badRequest, pipe, Result } from 'fail-not-core';

export interface CreateProductDto {
  title: string;

  price: number;
}

function titleNotEmpty(createProductDto: CreateProductDto) {
  if (createProductDto.title === '') {
    return Result.failure(badRequest('Title is empty' as const));
  }
  return Result.success(createProductDto);
}

function titleMax50(createProductDto: CreateProductDto) {
  if (createProductDto.title.length > 50) {
    return Result.failure(badRequest('Title length must <= 50' as const));
  }
  return Result.success(createProductDto);
}

function priceIsPositive(createProductDto: CreateProductDto) {
  if (createProductDto.price <= 0) {
    return Result.failure(badRequest('Price must be greater than 0' as const));
  }
  return Result.success(createProductDto);
}

export const createProductDtoValidator = pipe(
  titleNotEmpty,
  Result.bind(titleMax50),
  Result.bind(priceIsPositive),
);
