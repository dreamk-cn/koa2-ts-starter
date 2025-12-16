import { User } from '@/entities/User';
import { Context, Next } from 'koa';

declare module 'koa' {
  interface DefaultState {
    user?: User;
    permissions?: string[]; // 存放当前用户拥有的所有权限标识 (e.g. ['user:add', 'sys:log'])
  }
}

/**
 * 权限守卫：判断当前用户是否拥有指定权限
 * @param perm 权限标识，例如 'user:list'
 */
export const requirePerm = (perm: string) => {
  return async (ctx: Context, next: Next) => {
    // 获取 auth 中间件准备好的权限列表
    const userPerms = ctx.state.permissions || [];

    // 超级管理员特权 (如果你的 sys_role 表里有 super_admin，可以在这里放行)
    const user = ctx.state.user;
    const isSuperAdmin = user?.roles?.some(r => r?.roleCode === 'super_admin');
    
    // 校验
    if (isSuperAdmin || userPerms.includes(perm)) {
      await next(); // 有权限，放行
    } else {
      return ctx.error(403, `无权访问，需要权限: ${perm}`)
    }
  };
};