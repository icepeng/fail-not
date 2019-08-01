interface Ok<T> {
  readonly status: 200;
  readonly data: T;
}

export function ok<T>(data: T): Ok<T> {
  return {
    status: 200,
    data,
  };
}
