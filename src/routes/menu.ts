import Router from '@koa/router';
import MenuController from '@/controllers/menu';
import auth from '@/middlewares/auth';
import { requirePerm } from '@/middlewares/guard';
import { validate } from '@/middlewares/validate';
import { MenuCreateSchema, MenuDeleteSchema, MenuListSchema, MenuUpdateSchema } from '@/schemas/menu';

const router = new Router({ prefix: '/api/menus' });

// 全局应用 auth 中间件
router.use(auth);

// 定义路由 + 权限控制
router.get('/', requirePerm('sys:menu:list'), validate(MenuListSchema), MenuController.getList);
router.get('/:id', requirePerm('sys:menu:list'), MenuController.getDetail);
router.post('/', requirePerm('sys:menu:add'), validate(MenuCreateSchema), MenuController.create);
router.put('/:id', requirePerm('sys:menu:edit'), validate(MenuUpdateSchema), MenuController.update);
router.delete('/:id', requirePerm('sys:menu:delete'), validate(MenuDeleteSchema), MenuController.delete);

export default router;
