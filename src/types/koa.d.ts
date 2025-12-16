import type { DefaultState, DefaultContext } from 'koa';

declare module 'koa' {
  // 扩展 Context 接口
  interface Context {
    success: (data?: any, msg?: string) => void;
  }
}