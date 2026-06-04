import type { Context, Next } from 'koa';

import { mapError } from '@/app/mapError';
import { envelope } from '@/types/api';

/** 全局错误捕获与 404 信封；不修改 ctx.status，业务语义用 body.code */
const responseHandler = async (ctx: Context, next: Next) => {
  try {
    await next();

    if (!ctx.body && ctx.status === 404) {
      ctx.body = envelope.fail(404, 'Not Found');
    }
  } catch (err: unknown) {
    console.error('全局错误捕获:', err);
    ctx.body = mapError(err);
  }
};

export default responseHandler;
