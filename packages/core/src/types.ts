type PromiseReturn<T> = T extends Promise<infer U> ? U : T;

export type Injected<T extends (...args: any[]) => any> = PromiseReturn<
  ReturnType<T>
>;
