import Router from '@koa/router';
import RoleController from '@/controllers/role';
import auth from '@/middlewares/auth';
import { requirePerm } from '@/middlewares/guard';
import { validate } from '@/middlewares/validate';
import { AssignMenusSchema, RoleCreateSchema, RoleDeleteSchema, RoleDetailSchema, RoleListSchema, RoleUpdateSchema } from '@/schemas/role';

const router = new Router({ prefix: '/api/roles' });

// 全局应用 auth 中间件
router.use(auth);

// 定义路由 + 权限控制
router.get('/', requirePerm('sys:role:list'), validate(RoleListSchema), RoleController.getList);
router.get('/:id', requirePerm('sys:role:list'), validate(RoleDetailSchema), RoleController.getDetail);
router.post('/', requirePerm('sys:role:add'), validate(RoleCreateSchema), RoleController.create);
router.put('/:id', requirePerm('sys:role:edit'), validate(RoleUpdateSchema), RoleController.update);
router.delete('/:id', requirePerm('sys:role:delete'), validate(RoleDeleteSchema), RoleController.delete);
router.post('/:id/menus', requirePerm('sys:role:assign'), validate(AssignMenusSchema), RoleController.assignMenus);

export default router;
