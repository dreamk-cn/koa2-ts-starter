import 'reflect-metadata';
import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import serve from 'koa-static';
import path from 'path';

// 引入自定义模块
import { config } from '@/config/config'
import router from '@/routes';
import responseHandler from '@/middlewares/responseHandler';
import { AppDataSource } from './config/db';
AppDataSource.initialize().then(() => {
  console.log('数据源已初始化！');
}).catch((err) => {
  console.error('数据源初始化期间出错：', err);
});

const app = new Koa();

// 中间件
app.use(cors()); // 允许跨域
app.use(bodyParser()); // 解析请求体
app.use(serve(path.join(__dirname, '../public'))); // 静态文件服务
app.use(responseHandler); // 全局相应处理

// 挂载路由
app.use(router.routes()).use(router.allowedMethods());

// 错误处理
app.on('error', (err: Error, ctx: Context) => {
  console.error('server error', err, ctx);
});

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port} [${config.env}]`);
});