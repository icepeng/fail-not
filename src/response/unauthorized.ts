interface Unauthorized<T> {
  readonly status: 401;
  readonly data: T;
}

export function unauthorized<T>(data: T): Unauthorized<T> {
  return {
    status: 401,
    data,
  };
}
