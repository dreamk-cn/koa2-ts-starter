import Router from '@koa/router';
import { Context } from 'koa';

// 定义前缀
const router = new Router({ prefix: '/api/users' });

router.get('/list', async (ctx: Context) => {
  console.warn(ctx.body)
  ctx.success([{ name: 'Tom' }, { name: 'Jerry' }], '获取用户列表成功');
});

router.get('/:id', async (ctx: Context) => {
  const { id } = ctx.params;

  if (id === '1')
    return ctx.error(400, '用户不存在');

  return ctx.success({ id, name: 'Tom' }, '获取用户详情成功');
})

router.post('/', async (ctx: Context) => {
  const data = ctx.request.body;
  ctx.success(data, '创建用户成功');
});

router.delete('/:id', async (ctx: Context) => {

  const { id } = ctx.params;

  ctx.success(id, '删除用户成功');

});

export default router;