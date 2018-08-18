declare module '*.json' {
  const json: any;
  export default json;
}

interface IDictionary<T> {
  [key: string]: T;
}

