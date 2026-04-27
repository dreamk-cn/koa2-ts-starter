import { Context, Next } from 'koa';

export async function requestLogger(ctx: Context, next: Next) {
  const startAt = Date.now();

  try {
    await next();
  } finally {
    const durationMs = Date.now() - startAt;
    console.log(`${ctx.method} ${ctx.path} ${ctx.status} - ${durationMs}ms`);
  }
}
