import Router from '@koa/router';
import AuthController from '@/controllers/auth';

const router = new Router({ prefix: '/api/auth' });

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export default router;