export interface InternalServerError<T> {
  readonly status: 500;
  readonly data: T;
}

export function internalServerError<T>(data: T): InternalServerError<T> {
  return {
    status: 500,
    data,
  };
}
