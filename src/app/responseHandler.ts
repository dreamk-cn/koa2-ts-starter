import { Context, Next } from 'koa';

const responseHandler = async (ctx: Context, next: Next) => {
  try {

    ctx.success = (data: any = null, msg: string = 'success') => {
      ctx.body = {
        code: 0,
        msg,
        data,
      };
    };

    ctx.error = (code = 400, msg: string = 'error') => {
      ctx.body = {
        code,
        msg,
        data: null,
      };
    }

    await next();

    if (ctx.status === 404 && !ctx.body) {
      ctx.body = { code: 404, msg: 'Not Found' };
    }
  } catch (err: any) {
    console.error('全局错误捕获:', err);
    const statusCode = err.status || 500;
    const errorMsg = err.message || 'Internal Server Error';

    ctx.status = statusCode;
    ctx.body = {
      code: statusCode,
      msg: errorMsg,
      data: null,
    };
  }
};

export default responseHandler;