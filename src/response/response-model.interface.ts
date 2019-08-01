export interface ResponseModel<T> {
  readonly status: number;
  readonly data: T;
}
