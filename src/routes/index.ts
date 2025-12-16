import fs from 'node:fs';
import path from 'node:path';
import Router from '@koa/router';

const router = new Router();

fs.readdirSync(__dirname).forEach((file) => {
  if ((file === 'index.ts' || file === 'index.js') || (!file.endsWith('.ts') && !file.endsWith('.js'))) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const routeModule = require(path.join(__dirname, file));
  const route = routeModule.default || routeModule;

  if (route instanceof Router) {
    router.use(route.routes());
    router.use(route.allowedMethods());
  }
});

export default router;
