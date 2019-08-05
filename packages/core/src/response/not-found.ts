export interface NotFound<T> {
  readonly status: 404;
  readonly data: T;
}

export function notFound<T>(data: T): NotFound<T> {
  return {
    status: 404,
    data,
  };
}
