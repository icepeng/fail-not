export function existing<T>(x: T): x is Exclude<T, null | undefined> {
  return x != null;
}
