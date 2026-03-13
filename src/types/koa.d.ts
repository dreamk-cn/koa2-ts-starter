import 'koa'

declare module 'koa' {
  // 扩展 Context(ctx) 类型
  interface Context {
    // 自定义ctx方法
    success: (data?: any, msg?: string) => void;
    error: (code?: number, msg?: string) => void;
    // @koa2/router 的 params 类型
    params: any;
  }

  // 扩展 DefaultState(state) 类型
  interface DefaultState {
    // permissions?: string[]; // 存放当前用户拥有的所有权限标识 (e.g. ['user:add', 'sys:log'])
  }
}