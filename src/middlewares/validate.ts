import { Context, Next } from 'koa';
import { ZodType } from 'zod';
import { ZodError } from 'zod';

export const validate = <T extends any>(schema: ZodType<T>) => {
  return async (ctx: Context, next: Next) => {
    try {
      // 校验请求体、查询参数等
      const validatedData = await schema.parseAsync({
        body: ctx.request.body,
        query: ctx.query,
        params: ctx.params,
      });

      ctx.state.validated = validatedData
    
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.error(400, error.issues.pop()?.message ?? '参数校验失败')
      }
    }
  };
};