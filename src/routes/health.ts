import Router from '@koa/router';
import type { Context } from 'koa';

const router = new Router();

router.get('/health', async (ctx: Context) => {
  ctx.success({
    status: 'ok',
    env: process.env.ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

export default router;
