import type { Context, Next } from 'koa';
import { ZodType, ZodError } from 'zod';

import { AppError } from '@/errors/AppError';

export const validate = <T extends Record<string, unknown>>(schema: ZodType<T>) => {
  return async (ctx: Context, next: Next) => {
    try {
      const validatedData = await schema.parseAsync({
        body: ctx.request.body,
        query: ctx.query,
        params: ctx.params,
      });

      ctx.state.validated = validatedData;

      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(400, error.issues[0]?.message ?? '参数校验失败');
      }
      throw error;
    }
  };
};