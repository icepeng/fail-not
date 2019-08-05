export interface BadRequest<T> {
  readonly status: 400;
  readonly data: T;
}

export function badRequest<T>(data: T): BadRequest<T> {
  return {
    status: 400,
    data,
  };
}
