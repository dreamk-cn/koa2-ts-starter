import 'koa';

declare module 'koa' {
  interface Context {
    ok: <T>(data?: T | null, msg?: string) => void;
    /** 业务失败，写入 body.code，不改 HTTP status */
    fail: (code: number, msg: string) => void;
    /** @deprecated 使用 fail，保留别名便于迁移 */
    error: (code: number, msg: string) => void;
    params: Record<string, string>;
  }

  interface DefaultState {
    validated?: unknown;
  }
}
