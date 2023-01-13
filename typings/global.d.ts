declare const __DEV__: boolean;

declare const System: {
  import(module: string): Promise<any>;
};

declare interface AsyncResult<T> {
  res: T;
  err: Error;
}

declare interface TResult {
  code: string;
  message: string;
  context: any;
  content: any;
}

declare interface Window {
  token: any | string;
}

/** redux beg **/

export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface Dispatch {
  (action: Action): void;
}

/** redux end **/
