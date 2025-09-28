// This file adds global type declarations for libraries without proper typings

// bcryptjs
declare module 'bcryptjs' {
  export function genSalt(rounds?: number): Promise<string>;
  export function hash(s: string, salt: string | number): Promise<string>;
  export function compare(s: string, hash: string): Promise<boolean>;

  export namespace genSalt {
    export function sync(rounds?: number): string;
  }
  export namespace hash {
    export function sync(s: string, salt: string | number): string;
  }
  export namespace compare {
    export function sync(s: string, hash: string): boolean;
  }
}

// Declare other problematic libraries
declare module 'cacheable-request';
declare module 'cors';
declare module 'debug';
declare module 'estree';
declare module 'estree-jsx';
declare module 'hast';
declare module 'http-cache-semantics';
declare module 'json-schema';
declare module 'json5';
declare module 'keyv';
declare module 'mdast';
declare module 'ms';
declare module 'responselike';
declare module 'unist';
declare module 'webidl-conversions';
declare module 'whatwg-url';
declare module 'yauzl';
