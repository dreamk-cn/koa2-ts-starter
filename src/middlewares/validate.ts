import { Context, Next } from 'koa';
import { ZodType } from 'zod';
import { ZodError } from 'zod';

export const validate = (schema: ZodType) => {
  return async (ctx: Context, next: Next) => {
    try {
      // 校验请求体、查询参数等
      schema.parse({
        body: ctx.request.body,
        query: ctx.query,
        params: ctx.params,
      });
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.error(400, error.issues.pop()?.message ?? '参数校验失败')
      }
    }
  };
};