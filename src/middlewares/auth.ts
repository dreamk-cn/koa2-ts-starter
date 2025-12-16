import { Context, Next } from 'koa';
import { verifyToken } from '@/utils/jwt';
import { AppDataSource } from '@/config/db';
import { User } from '@/entities/User';

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.header.authorization?.replace('Bearer ', '');

  if (!token) {
    ctx.status = 401;
    return ctx.error(401, '未提供 Token，请先登录');
  }

  try {
    const payload = verifyToken(token);

    // 查询数据库获取完整用户信息 (包含角色和菜单权限)
    // RBAC，我们需要连表查询出 Role 和 Menu
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: payload.id },
      relations: ['roles', 'roles.menus'], // 级联查询
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 扁平化权限 (把所有角色的所有菜单权限提取出来，去重)
    const permissions = new Set<string>();
    user.roles.forEach((role) => {
      role.menus.forEach((menu) => {
        if (menu.perms) {
          permissions.add(menu.perms);
        }
      });
    });

    // 挂载到 ctx.state
    ctx.state.user = user;
    ctx.state.permissions = Array.from(permissions);

    await next();
  } catch {
    return ctx.error(401, 'Token 无效或已过期');
  }
};

export default auth;