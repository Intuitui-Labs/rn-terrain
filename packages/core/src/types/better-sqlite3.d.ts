declare module 'better-sqlite3' {
  export interface Statement {
    run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }

  export interface DatabaseOptions {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: (message?: unknown, ...additionalArgs: unknown[]) => void;
    nativeBinding?: string;
  }

  export default class Database {
    constructor(filename: string | Buffer, options?: DatabaseOptions);
    exec(source: string): this;
    prepare(source: string): Statement;
    pragma(pragma: string, options?: { simple?: boolean }): unknown;
    transaction<T extends (...args: any[]) => any>(fn: T): T;
    close(): this;
  }
}
