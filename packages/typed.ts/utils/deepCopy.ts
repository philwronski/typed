// export function deepCopy<T>(source: T): T {
//   return Array.isArray(source)
//     ? source.map(item => deepCopy(item))
//     : source instanceof Date
//       ? new Date(source.getTime())
//       : source && typeof source === 'object'
//         ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
//           Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
//           o[prop] = deepCopy((source as { [key: string]: any })[prop]);
//           return o;
//         }, Object.create(Object.getPrototypeOf(source)))
//         : source as T;
// }

export function deepCopy<T>(source: T): T {
  let clone: T;
  if (Array.isArray(source)) {
    clone = source.map((item) => deepCopy(item)) as T;
  } else if (source instanceof Date) {
    clone = new Date(source.getTime()) as T;
  } else if (source instanceof Element) {
    // clone = source.cloneNode(true) as T;
    clone = source;
  } else if (typeof source === "object") {
    clone = Object.getOwnPropertyNames(source).reduce((o, prop) => {
      Object.defineProperty(
        o,
        prop,
        Object.getOwnPropertyDescriptor(source, prop)!
      );
      o[prop] = deepCopy((source as { [key: string]: any })[prop]);
      return o;
    }, Object.create(Object.getPrototypeOf(source))) as T;
  } else {
    clone = source as T;
  }

  return clone;
}

export class cloneable {
  public static deepCopy<T>(source: T): T {
    return deepCopy<T>(source);
  }
}
