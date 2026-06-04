import type Koa from 'koa';

import { envelope, type ApiBody } from '@/types/api';

/** 在 Context 原型上挂载响应方法，避免每个请求重复赋值 */
export function extendContext(app: Koa) {
  app.context.ok = function <T>(this: Koa.Context, data: T | null = null, msg = 'success') {
    this.body = envelope.ok(data, msg) satisfies ApiBody<T>;
  };

  const fail = function (this: Koa.Context, code: number, msg: string) {
    this.body = envelope.fail(code, msg);
  };

  app.context.fail = fail;
  app.context.error = fail;
}
