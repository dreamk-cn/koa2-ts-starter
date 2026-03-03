import Router from '@koa/router';
import UserController from '@/controllers/user';
import auth from '@/middlewares/auth';
import { requirePerm } from '@/middlewares/guard';
import { validate } from '@/middlewares/validate';
import { RegisterSchema } from '@/schemas/auth';
import { AssignRolesSchema, UserDeleteSchema, UserDetailSchema, UserListSchema, UserUpdateSchema } from '@/schemas/user';

const router = new Router({ prefix: '/api/users' });

// 全局应用 auth 中间件
router.use(auth);

// 定义路由 + 权限控制
router.get('/', requirePerm('sys:user:list'), validate(UserListSchema), UserController.getList);
router.get('/:id', requirePerm('sys:user:list'), validate(UserDetailSchema), UserController.getDetail);
router.post('/', requirePerm('sys:user:add'), validate(RegisterSchema), UserController.create);
router.put('/:id', requirePerm('sys:user:edit'), validate(UserUpdateSchema), UserController.update);
router.delete('/:id', requirePerm('sys:user:delete'), validate(UserDeleteSchema), UserController.delete);
router.post('/:id/roles', requirePerm('sys:user:assign'), validate(AssignRolesSchema), UserController.assignRoles);

export default router;
