import { badRequest, Result } from 'fail-not-core';

export function toInt(x: string) {
  const int = parseInt(x, 10);
  if (isNaN(int)) {
    return Result.failure(badRequest('Integer required' as const));
  }
  return Result.success(int);
}
