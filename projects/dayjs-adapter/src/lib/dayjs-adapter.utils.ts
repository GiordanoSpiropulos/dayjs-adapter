/** Creates an array and fill it with values*/
export function range<T>(length: number, valueFunction: (index: number) => T) {
  return Array.from({ length }, (_, i) => valueFunction(i));
}
