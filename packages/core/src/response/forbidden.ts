export interface Forbidden<T> {
  readonly status: 403;
  readonly data: T;
}

export function forbidden<T>(data: T): Forbidden<T> {
  return {
    status: 403,
    data,
  };
}
