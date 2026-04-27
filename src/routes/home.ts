import { validate } from '@/middlewares/validate';
import Router from '@koa/router';
import type { Context } from 'koa';
import z from 'zod';

const router = new Router();

const userSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    age: z.coerce.number().min(1).default(1),
    ids: z.string()
    .transform((val) => val.split(',').map(Number)) 
    // 转化后可以继续接校验
    .pipe(z.array(z.number()).min(1, '至少需要一个ID'))
  }),
});
type UserReqData = z.infer<typeof userSchema>;

router.get('/', async (ctx: Context) => {
  ctx.body = 'Hello World！'
});

router.post('/validate', validate(userSchema), async (ctx) => {
  const { body } = ctx.state.validated as UserReqData;
  const rawBody = ctx.request.body
  console.warn('parseBody', body)
  console.warn('rawBody', rawBody)

  return ctx.success({ rawBody, body})
})

export default router;