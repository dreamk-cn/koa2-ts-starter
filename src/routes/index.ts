import Router from '@koa/router';
import healthRouter from './health';
import homeRouter from './home';

const router = new Router();

router.use(healthRouter.routes());
router.use(healthRouter.allowedMethods());
router.use(homeRouter.routes());
router.use(homeRouter.allowedMethods());

export default router;
