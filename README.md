# Koa3 TypeScript Starter

基于 **Koa3 + TypeScript + pnpm** 的个人后端起始模板。内置统一响应信封、Zod 校验、JWT/加密工具与 Vitest 测试，适合快速起手小项目或 API 服务。

## ✨ 特性

- **TypeScript**：`Node16` 模块解析，严格模式
- **路径别名**：`@/` 指向 `src/`（开发 `tsconfig-paths`，生产 `tsc-alias`）
- **统一响应**：`ctx.ok` / `ctx.fail`，业务语义看 `body.code`，不依赖改 HTTP status
- **错误处理**：`AppError` + 全局 `mapError`，Zod 校验失败自动映射
- **请求校验**：`validate(schema)` 中间件，校验结果写入 `ctx.state.validated`
- **环境变量**：启动时用 Zod 校验 `.env`，配置错误直接退出
- **工程化**：ESLint + Prettier、请求日志、健康检查、Vitest + Supertest
- **常用工具**：JWT 签发/校验、bcrypt 密码、分页 Schema、扁平数组转树

## 📋 环境要求

- Node.js **≥ 20**（推荐 LTS）
- [pnpm](https://pnpm.io/) **≥ 9**

## 🚀 快速开始

### 1. 获取项目

```bash
git clone https://github.com/dreamk-cn/koa3-ts-starter.git my-project
cd my-project
```

也可直接 Fork / 下载 ZIP，再改 `package.json` 中的 `name`。

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

按需修改 `.env`。**启动前必须配置** `JWT_SECRET`（见下方 [环境变量](#-环境变量)）。

### 4. 启动开发服务

```bash
pnpm dev
```

默认地址：[http://127.0.0.1:3000](http://127.0.0.1:3000)

使用 Bun 热更新（可选）：

```bash
pnpm dev-bun
```

### 5. 生产构建与运行

```bash
pnpm build
pnpm start
```

## 📜 常用脚本


| 命令                | 说明                         |
| ----------------- | -------------------------- |
| `pnpm dev`        | Nodemon + ts-node 开发模式     |
| `pnpm dev-bun`    | Bun 热更新开发（需安装 Bun）         |
| `pnpm build`      | 编译到 `dist/` 并解析路径别名        |
| `pnpm start`      | 运行编译后的 `dist/app.js`       |
| `pnpm lint`       | ESLint 检查 `src/`           |
| `pnpm format`     | Prettier 格式化 `src/**/*.ts` |
| `pnpm test`       | 运行 Vitest 测试               |
| `pnpm test:watch` | Vitest 监听模式                |


## 📁 目录结构

```text
.
├── public/                 # 静态资源（可选）
├── src/
│   ├── app.ts              # 进程入口：监听端口
│   ├── app/
│   │   ├── index.ts        # 创建 Koa、挂载中间件与路由
│   │   ├── context.ts      # ctx.ok / ctx.fail（原型扩展）
│   │   ├── responseHandler.ts  # 全局 catch、404 信封
│   │   └── mapError.ts     # 未知错误 → 统一 body
│   ├── config/             # 环境变量与配置
│   ├── errors/
│   │   └── AppError.ts     # 可抛出的业务错误
│   ├── middlewares/
│   │   ├── requestLogger.ts
│   │   └── validate.ts     # Zod 校验中间件
│   ├── routes/             # 路由模块
│   ├── schemas/            # 公共 Zod Schema（如分页）
│   ├── types/
│   │   ├── api.ts          # ApiBody、envelope 纯函数
│   │   └── koa.d.ts        # Context 类型扩展
│   └── utils/              # jwt、encryption、tree 等
├── tests/                  # Vitest + Supertest
├── .env.example
├── eslint.config.mjs
├── nodemon.json
├── tsconfig.json
└── vitest.config.ts
```

## 📦 API 响应约定

所有 JSON 接口（除少数明文路由）使用统一信封：

```json
{
  "code": 0,
  "msg": "success",
  "data": { }
}
```


| 字段     | 说明                                                       |
| ------ | -------------------------------------------------------- |
| `code` | **业务状态码**。`0` 表示成功，非 `0` 表示失败（如 `400`、`401`、`404`、`500`） |
| `msg`  | 提示文案                                                     |
| `data` | 业务数据；失败时为 `null`                                         |


**设计原则**：中间件与 `mapError` **不会**为了业务失败去改 `ctx.status`。客户端应以 `**body.code`** 为准判断成功/失败（多数情况下 HTTP 仍为 `200`）。

### 成功响应

```typescript
ctx.ok();                          // data: null
ctx.ok({ id: 1 });                 // 默认 msg: "success"
ctx.ok(user, '登录成功');
```

### 业务失败（就地返回）

```typescript
ctx.fail(400, '用户名不能为空');
// ctx.error(...) 与 ctx.fail 相同，为兼容别名
```

### 业务失败（抛出，推荐）

```typescript
import { AppError } from '@/errors/AppError';

throw new AppError(401, '未登录');
throw new AppError(403, '无权限', false); // expose=false 时对客户端隐藏具体 message
```

`validate` 中间件在校验失败时会 `throw new AppError(400, ...)`，由 `responseHandler` 统一转成信封。

### 纯函数（测试或无 ctx 场景）

```typescript
import { envelope } from '@/types/api';

const body = envelope.ok({ id: 1 });
const errBody = envelope.fail(500, '服务异常');
```

## 🛣️ 内置路由


| 方法     | 路径          | 说明                              |
| ------ | ----------- | ------------------------------- |
| `GET`  | `/`         | 明文 `Hello World`（示例，未走信封）       |
| `GET`  | `/health`   | 健康检查，`ctx.ok` 返回状态与时间戳          |
| `POST` | `/validate` | Zod 校验示例，见 `src/routes/home.ts` |


### `/validate` 示例

请求体：

```json
{
  "username": "abcd",
  "age": 2,
  "ids": "1,2,3"
}
```

成功时 `code: 0`，`data` 中含校验后的 `body`（`ids` 已转为数字数组）。

## ✅ 参数校验

定义 Schema 时建议把 `body` / `query` / `params` 包在一层对象里，与中间件约定一致：

```typescript
import z from 'zod';
import { validate } from '@/middlewares/validate';

const schema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
  query: z.object({
    page: z.coerce.number().default(1),
  }),
});

router.post('/items', validate(schema), async (ctx) => {
  const { body, query } = ctx.state.validated as z.infer<typeof schema>;
  ctx.ok({ body, query });
});
```

公共分页字段可使用 `src/schemas/base.ts` 中的 `PageSchema`。

## 🔐 环境变量

启动时由 `src/config/index.ts` 校验，缺失或非法会打印错误并 `process.exit(1)`。


| 变量               | 必填    | 默认值           | 说明                        |
| ---------------- | ----- | ------------- | ------------------------- |
| `PORT`           | 否     | `3000`        | 监听端口                      |
| `ENV`            | 否     | `development` | 运行环境标识                    |
| `JWT_SECRET`     | **是** | —             | JWT 密钥，生产环境请使用强随机串        |
| `JWT_EXPIRES_IN` | 否     | `2h`          | JWT 过期时间（传给 jsonwebtoken） |


`.env.example` 中的数据库相关变量为**预留占位**，当前版本未接入 ORM，接入数据库后可自行扩展 `config` 与 `envSchema`。

## 🧰 内置工具


| 模块        | 路径                        | 用途                                 |
| --------- | ------------------------- | ---------------------------------- |
| JWT       | `src/utils/jwt.ts`        | `signToken` / `verifyToken`        |
| 密码        | `src/utils/encryption.ts` | `hashPassword` / `comparePassword` |
| 树形结构      | `src/utils/tree.ts`       | `listToTree` 扁平列表转树                |
| 分页 Schema | `src/schemas/base.ts`     | `PageSchema`（pageNo / pageSize）    |


接入鉴权时，可自行新增 `middlewares/auth.ts`，在路由上使用 `verifyToken` 并写入 `ctx.state.user`。

## 🧪 测试

```bash
pnpm test
```

测试位于 `tests/`，使用 Supertest 对 `app` 发起 HTTP 请求，覆盖 `/health` 与 `/validate` 的成功/失败分支。

## 🔧 开发说明

- **入口**：`src/app.ts` 创建 HTTP Server 并监听端口；应用组装在 `src/app/index.ts`。
- **中间件顺序**：CORS → bodyParser → 静态文件 → 请求日志 → **responseHandler** → 路由。`responseHandler` 需包在路由外层，才能捕获路由内抛出的 `AppError`。
- **类型扩展**：修改 `ctx` 上的方法时，同步更新 `src/types/koa.d.ts`。
- **路径别名**：源码写 `@/xxx`；构建后由 `tsc-alias` 改写为相对路径。

