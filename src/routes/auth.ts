import Router from '@koa/router';
import AuthController from '@/controllers/auth';
import auth from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { LoginSchema, RegisterSchema } from '@/schemas/auth';

const router = new Router({ prefix: '/api/auth' });

router.post('/register', validate(RegisterSchema), AuthController.register);
router.post('/login', validate(LoginSchema), AuthController.login);
router.get('/permission-info', auth, AuthController.getPermissionInfo)

export default router;