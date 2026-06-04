/** 统一 API 响应信封；业务语义看 code，不依赖 HTTP status */
export interface ApiBody<T = unknown> {
  code: number;
  msg: string;
  data: T | null;
}

export const envelope = {
  ok<T>(data: T | null = null, msg = 'success'): ApiBody<T> {
    return { code: 0, msg, data };
  },
  fail(code: number, msg: string): ApiBody<null> {
    return { code, msg, data: null };
  },
};
