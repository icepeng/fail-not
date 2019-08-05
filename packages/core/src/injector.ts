export async function AsyncInjector<T>(factory: (...deps: any[]) => T, deps: any[]) {
  return factory(await Promise.all(deps));
}
