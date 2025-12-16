import Router from '@koa/router';
import { Context } from 'koa';

// 定义前缀
const router = new Router({ prefix: '/api/users' });

router.get('/', async (ctx: Context) => {
  // TS 现在知道 ctx 上有 success 方法
  ctx.success([{ name: 'Tom' }, { name: 'Jerry' }], '获取用户列表成功');
});

router.post('/', async (ctx: Context) => {
  const data = ctx.request.body;
  ctx.success(data, '创建用户成功');
});

export default router;